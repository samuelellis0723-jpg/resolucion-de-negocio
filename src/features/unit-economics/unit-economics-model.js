(function attachSolDeCasaModel(root) {
  const DEFAULT_INPUTS = {
    installationPrice: 6500,
    grossMarginPercent: 28,
    commissionPercent: 3,
    visitCost: 60,
    baseVisitCapacity: 100,
    extraTechnicians: 0,
    batteryPrice: 3000,
    batteryGrossMarginPercent: 20,
    batteryCommissionPercent: 3,
    batteryAttachPercent: 15,
    includeBatteryInLtv: false,
    channels: {
      meta: {
        name: 'Meta',
        investment: 4000,
        leadRetentionPercent: 100,
        rates: { contact: 55, booking: 30, visit: 70, close: 18 },
        history: [[0, 0], [2000, 280], [4000, 500], [6000, 680], [8000, 840], [10000, 960]],
      },
      google: {
        name: 'Google',
        investment: 4000,
        rates: { contact: 85, booking: 55, visit: 85, close: 30 },
        history: [[0, 0], [2000, 55], [4000, 100], [6000, 135], [8000, 160], [10000, 160]],
      },
    },
  };

  function interpolateLeads(investment, history) {
    const points = history;
    if (investment <= points[0][0]) return points[0][1];
    for (let index = 1; index < points.length; index += 1) {
      const [upperInvestment, upperLeads] = points[index];
      const [lowerInvestment, lowerLeads] = points[index - 1];
      if (investment <= upperInvestment) {
        const share = (investment - lowerInvestment) / (upperInvestment - lowerInvestment);
        return lowerLeads + share * (upperLeads - lowerLeads);
      }
    }
    return points[points.length - 1][1];
  }

  function calculateChannel(channel, availableCapacity, visitCost, contribution) {
    const interpolatedLeads = interpolateLeads(channel.investment, channel.history);
    const leadRetentionPercent = channel.leadRetentionPercent == null ? 100 : channel.leadRetentionPercent;
    const leads = interpolatedLeads * leadRetentionPercent / 100;
    const contacts = leads * channel.rates.contact / 100;
    const bookings = contacts * channel.rates.booking / 100;
    const requestedVisits = bookings * channel.rates.visit / 100;
    const realizedVisits = Math.min(requestedVisits, Math.max(0, availableCapacity));
    const sales = realizedVisits * channel.rates.close / 100;
    const adCac = sales > 0 ? channel.investment / sales : null;
    const realCac = sales > 0 ? (channel.investment + realizedVisits * visitCost) / sales : null;
    const visitsPerSale = sales > 0 ? realizedVisits / sales : null;
    const visitValue = contribution * channel.rates.close / 100 - visitCost;
    const cpl = interpolatedLeads > 0 ? channel.investment / interpolatedLeads : null;

    return {
      ...channel,
      interpolatedLeads,
      leadRetentionPercent,
      leads,
      contacts,
      bookings,
      requestedVisits,
      realizedVisits,
      lostVisits: requestedVisits - realizedVisits,
      sales,
      cpl,
      adCac,
      realCac,
      ltvToCac: realCac ? contribution / realCac : null,
      visitsPerSale,
      visitValue,
    };
  }

  function calculateModel(inputs) {
    const solarContribution = inputs.installationPrice * (inputs.grossMarginPercent - inputs.commissionPercent) / 100;
    const batteryContribution = inputs.batteryPrice * (inputs.batteryGrossMarginPercent - inputs.batteryCommissionPercent) / 100;
    const expectedBatteryContribution = batteryContribution * inputs.batteryAttachPercent / 100;
    const customerLtv = solarContribution + (inputs.includeBatteryInLtv ? expectedBatteryContribution : 0);
    const capacity = inputs.baseVisitCapacity + inputs.extraTechnicians * 50;
    const initialGoogle = calculateChannel(inputs.channels.google, capacity, inputs.visitCost, customerLtv);
    const initialMeta = calculateChannel(inputs.channels.meta, Math.max(0, capacity - initialGoogle.realizedVisits), inputs.visitCost, customerLtv);
    const channels = { meta: initialMeta, google: initialGoogle };
    const sales = initialMeta.sales + initialGoogle.sales;
    const realizedVisits = initialMeta.realizedVisits + initialGoogle.realizedVisits;
    const requestedVisits = initialMeta.requestedVisits + initialGoogle.requestedVisits;
    const adSpend = inputs.channels.meta.investment + inputs.channels.google.investment;
    const totalAdCac = sales > 0 ? adSpend / sales : null;
    const totalRealCac = sales > 0 ? (adSpend + realizedVisits * inputs.visitCost) / sales : null;
    const ltvToCac = totalRealCac ? customerLtv / totalRealCac : null;

    return {
      contribution: solarContribution,
      batteryContribution,
      expectedBatteryContribution,
      customerLtv,
      capacity,
      channels,
      totals: {
        leads: initialMeta.leads + initialGoogle.leads,
        contacts: initialMeta.contacts + initialGoogle.contacts,
        bookings: initialMeta.bookings + initialGoogle.bookings,
        requestedVisits,
        realizedVisits,
        lostVisits: requestedVisits - realizedVisits,
        sales,
        adSpend,
        adCac: totalAdCac,
        realCac: totalRealCac,
        ltvToCac,
        visitsPerSale: sales > 0 ? realizedVisits / sales : null,
        capacityUsedPercent: capacity > 0 ? realizedVisits / capacity * 100 : 0,
      },
      modelRates: { meta: initialMeta.rates, google: initialGoogle.rates },
    };
  }

  function createOwnPlanInputs() {
    const inputs = structuredClone(DEFAULT_INPUTS);
    inputs.channels.meta.investment = 4800;
    inputs.channels.meta.leadRetentionPercent = 80;
    inputs.channels.meta.rates = { contact: 80, booking: 40, visit: 75, close: 22 };
    inputs.extraTechnicians = 1;
    return inputs;
  }

  root.SolDeCasaModel = { DEFAULT_INPUTS, interpolateLeads, calculateModel, createOwnPlanInputs };
})(globalThis);
