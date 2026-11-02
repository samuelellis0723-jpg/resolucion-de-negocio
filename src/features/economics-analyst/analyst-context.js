import '../unit-economics/unit-economics-model.js';
import { ANALYST_CONTRACT } from './analyst-contract.js';

const { DEFAULT_INPUTS, createOwnPlanInputs } = globalThis.SolDeCasaModel;
const pick = (source, fields) => Object.fromEntries(fields.map((field) => [field, source[field]]));

function selectInputs(inputs) {
  return {
    ...pick(inputs, ANALYST_CONTRACT.inputFields),
    includeBatteryInLtv: inputs.includeBatteryInLtv,
    channels: Object.fromEntries(['meta', 'google'].map((key) => [key, {
      investment: inputs.channels[key].investment,
      leadRetentionPercent: inputs.channels[key].leadRetentionPercent ?? 100,
      rates: pick(inputs.channels[key].rates, ANALYST_CONTRACT.rates),
      history: inputs.channels[key].history.map((point) => [...point]),
    }])),
  };
}

export function createAnalystReferenceInputs() {
  return { base: selectInputs(DEFAULT_INPUTS), own: selectInputs(createOwnPlanInputs()) };
}

function findChanges(active, base, path = '') {
  return Object.entries(active).flatMap(([key, value]) => {
    const inputPath = path ? `${path}.${key}` : key;
    if (Array.isArray(value)) return [];
    if (value !== null && typeof value === 'object') return findChanges(value, base[key], inputPath);
    return value === base[key] ? [] : [{ path: inputPath, caseValue: base[key], activeValue: value }];
  });
}

// Formula evidence comes from the existing source file, never a second implementation.
export function extractModelFormulas(source) {
  const references = {
    calculateChannel: ['interpolatedLeads', 'leads', 'contacts', 'bookings', 'requestedVisits', 'realizedVisits', 'sales', 'cpl', 'adCac', 'realCac', 'visitsPerSale', 'visitValue'],
    calculateModel: ['solarContribution', 'batteryContribution', 'expectedBatteryContribution', 'customerLtv', 'capacity', 'initialGoogle', 'initialMeta', 'sales', 'realizedVisits', 'requestedVisits', 'adSpend', 'technicianCosts', 'monthlyOperatingResult', 'totalAdCac', 'totalRealCac', 'ltvToCac'],
  };
  const functionSource = (name) => {
    const start = source.indexOf(`  function ${name}(`);
    if (start < 0) throw new Error('No se pudo leer la referencia del modelo financiero.');
    const next = source.indexOf('\n  function ', start + 1);
    return source.slice(start, next < 0 ? source.indexOf('\n  root.', start) : next).trim();
  };
  const formulas = [{ source: 'unit-economics-model.js#interpolateLeads', expression: functionSource('interpolateLeads') }];
  for (const [functionName, variables] of Object.entries(references)) {
    const body = functionSource(functionName);
    for (const variable of variables) {
      const expression = body.match(new RegExp(`const ${variable} = [\\s\\S]*?;`))?.[0];
      if (!expression) throw new Error('No se pudo leer la referencia del modelo financiero.');
      formulas.push({ source: `unit-economics-model.js#${functionName}.${variable}`, expression: expression.replace(/\r\n/g, '\n') });
    }
  }
  formulas[0].expression = formulas[0].expression.replace(/\r\n/g, '\n');
  return formulas;
}

export function createAnalystContext(inputs, result, modelSource) {
  const selected = selectInputs(inputs);
  const { base, own } = createAnalystReferenceInputs();
  const signature = JSON.stringify(selected);
  return {
    version: ANALYST_CONTRACT.version,
    project: 'sol-de-casa',
    fictional: true,
    currency: 'USD',
    period: 'monthly-run-rate',
    capturedAt: new Date().toISOString(),
    scenario: signature === JSON.stringify(base) ? 'base' : signature === JSON.stringify(own) ? 'own' : 'custom',
    inputs: selected,
    metrics: {
      ...pick(result, ANALYST_CONTRACT.modelMetrics),
      operatingCosts: pick(result.operatingCosts, ['fixed', 'technicians']),
      totals: pick(result.totals, ANALYST_CONTRACT.totalMetrics),
      channels: Object.fromEntries(['meta', 'google'].map((key) => [key, pick(result.channels[key], ANALYST_CONTRACT.channelMetrics)])),
    },
    changes: findChanges(selected, base),
    sources: [...ANALYST_CONTRACT.sources],
    rules: [...ANALYST_CONTRACT.rules],
    formulas: extractModelFormulas(modelSource),
  };
}
