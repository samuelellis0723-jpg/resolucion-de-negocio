import '../unit-economics/unit-economics-model.js';

const { DEFAULT_INPUTS, calculateModel } = globalThis.SolDeCasaModel;

export const CASH_ASSUMPTIONS = {
  months: 24,
  openingCash: 12000,
  minimumCash: 5000,
  monthZeroSales: 22,
  collectionPercentAtSigning: 50,
  equipmentPercent: 55,
  installationPercent: 17,
  baseCapacity: 100,
  extraTechnicianCapacity: 50,
  maximumExtraTechnicians: 2,
  hiringMonthCapacityDelay: 1,
};

const BASE_META_RATES = { contact: 55, booking: 30, visit: 70, close: 18 };
const FILTERED_META_RATES = { contact: 80, booking: 40, visit: 75, close: 22 };

function scenario(id, label, note, values = {}) {
  return {
    id,
    label,
    note,
    metaInvestment: 4000,
    googleInvestment: 4000,
    leadMethod: 'historical',
    assumedCpl: 8,
    metaLeadRetention: 100,
    metaRates: { ...BASE_META_RATES },
    extraTechnicians: 0,
    technicianHireMonth: 2,
    ...values,
  };
}

export function createCashScenarios() {
  return [
    scenario('current', 'Plan actual', 'Inversiones y tasas observadas del caso.'),
    scenario('agency-theoretical', 'Agencia teórica', 'CPL constante; se contrasta con el histórico.', {
      metaInvestment: 8000,
      googleInvestment: 0,
      leadMethod: 'constant-cpl',
    }),
    scenario('agency-historical', 'Agencia histórica', 'Leads Meta interpolados del historial.', {
      metaInvestment: 8000,
      googleInvestment: 0,
    }),
    scenario('own-with-tech', 'Plan propio con técnico', 'Filtro y tasas mejoradas [SUPUESTO]; contratación editable.', {
      metaInvestment: 4800,
      googleInvestment: 4000,
      metaLeadRetention: 80,
      metaRates: { ...FILTERED_META_RATES },
      extraTechnicians: 1,
      technicianHireMonth: 1,
    }),
    scenario('own-without-tech', 'Plan propio sin técnico', 'Mismo filtro [SUPUESTO], con capacidad base.', {
      metaInvestment: 4000,
      googleInvestment: 4000,
      metaLeadRetention: 80,
      metaRates: { ...FILTERED_META_RATES },
    }),
  ];
}

function toModelInputs(plan, matureTechnicians) {
  const inputs = structuredClone(DEFAULT_INPUTS);
  inputs.baseVisitCapacity = CASH_ASSUMPTIONS.baseCapacity;
  inputs.extraTechnicians = matureTechnicians;
  inputs.extraTechnicianCapacity = CASH_ASSUMPTIONS.extraTechnicianCapacity;
  inputs.channels.meta.investment = plan.metaInvestment;
  inputs.channels.meta.leadRetentionPercent = plan.metaLeadRetention;
  inputs.channels.meta.rates = { ...plan.metaRates };
  inputs.channels.meta.leadMethod = plan.leadMethod;
  inputs.channels.meta.assumedCpl = plan.assumedCpl;
  inputs.channels.google.investment = plan.googleInvestment;
  return inputs;
}

export function projectCashScenario(plan, assumptions = CASH_ASSUMPTIONS) {
  const rows = [];
  let endingCash = assumptions.openingCash;
  let previousSales = assumptions.monthZeroSales;
  let cumulativeSales = 0;
  let minimumCash = Infinity;
  let minimumCashMonth = 1;
  let priorAdInvestment = null;
  let adInvestmentNeverDecreasesAfterMonth18 = true;

  for (let month = 1; month <= assumptions.months; month += 1) {
    const hiredTechnicians = month >= plan.technicianHireMonth ? plan.extraTechnicians : 0;
    const matureTechnicians = month > plan.technicianHireMonth ? plan.extraTechnicians : 0;
    const model = calculateModel(toModelInputs(plan, matureTechnicians));
    const { totals, channels } = model;
    const adInvestment = plan.metaInvestment + plan.googleInvestment;
    const price = DEFAULT_INPUTS.installationPrice;
    const collections = price * CASH_ASSUMPTIONS.collectionPercentAtSigning / 100
      * (totals.sales + previousSales);
    const equipmentAndCommission = price
      * (CASH_ASSUMPTIONS.equipmentPercent + DEFAULT_INPUTS.commissionPercent) / 100
      * totals.sales;
    const priorInstallationPayment = price * CASH_ASSUMPTIONS.installationPercent / 100 * previousSales;
    const visitPayments = DEFAULT_INPUTS.visitCost * totals.realizedVisits;
    const technicianPayments = hiredTechnicians * DEFAULT_INPUTS.technicianMonthlyCost;
    const outflows = equipmentAndCommission
      + priorInstallationPayment
      + visitPayments
      + adInvestment
      + DEFAULT_INPUTS.fixedMonthlyCosts
      + technicianPayments;
    const openingCash = endingCash;
    endingCash = openingCash + collections - outflows;
    cumulativeSales += totals.sales;

    if (endingCash < minimumCash) {
      minimumCash = endingCash;
      minimumCashMonth = month;
    }
    if (month >= 19 && priorAdInvestment != null && adInvestment < priorAdInvestment) {
      adInvestmentNeverDecreasesAfterMonth18 = false;
    }

    rows.push({
      month,
      scenarioId: plan.id,
      scenarioName: plan.label,
      metaInvestment: plan.metaInvestment,
      googleInvestment: plan.googleInvestment,
      adInvestment,
      metaGrossLeads: channels.meta.interpolatedLeads,
      metaLeads: channels.meta.leads,
      googleLeads: channels.google.leads,
      requestedVisits: totals.requestedVisits,
      realizedVisits: totals.realizedVisits,
      capacity: model.capacity,
      sales: totals.sales,
      collections,
      outflows,
      openingCash,
      endingCash,
      hiredTechnicians,
      matureTechnicians,
      contribution: model.contribution,
      monthlyOperatingResult: totals.monthlyOperatingResult,
      previousSales,
    });

    previousSales = totals.sales;
    priorAdInvestment = adInvestment;
  }

  const minimumCashIsMet = assumptions.openingCash >= assumptions.minimumCash
    && minimumCash >= assumptions.minimumCash;
  return {
    id: plan.id,
    label: plan.label,
    note: plan.note,
    plan,
    rows,
    minimumCash,
    minimumCashMonth,
    endingCash,
    cumulativeSales,
    minimumCashIsMet,
    adInvestmentNeverDecreasesAfterMonth18,
    feasible: minimumCashIsMet && adInvestmentNeverDecreasesAfterMonth18,
    monthOne: rows[0],
  };
}

export function projectCashScenarios(plans, assumptions = CASH_ASSUMPTIONS) {
  return plans.map((plan) => projectCashScenario(plan, assumptions));
}

export function updateScenario(scenarios, scenarioId, patch) {
  return scenarios.map((item) => item.id === scenarioId ? { ...item, ...patch } : item);
}

export function updateMetaRate(scenarios, scenarioId, rateKey, value) {
  return scenarios.map((item) => item.id === scenarioId
    ? { ...item, metaRates: { ...item.metaRates, [rateKey]: value } }
    : item);
}
