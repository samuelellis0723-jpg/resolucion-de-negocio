export const ANALYST_CONTRACT = {
  version: 1,
  maxMessageLength: 2000,
  maxContextLength: 40000,
  inputFields: ['installationPrice', 'grossMarginPercent', 'commissionPercent', 'visitCost', 'fixedMonthlyCosts', 'technicianMonthlyCost', 'baseVisitCapacity', 'extraTechnicians', 'extraTechnicianCapacity', 'batteryPrice', 'batteryGrossMarginPercent', 'batteryCommissionPercent', 'batteryAttachPercent'],
  modelMetrics: ['contribution', 'batteryContribution', 'expectedBatteryContribution', 'customerLtv', 'capacity'],
  totalMetrics: ['leads', 'contacts', 'bookings', 'requestedVisits', 'realizedVisits', 'lostVisits', 'sales', 'adSpend', 'monthlyOperatingResult', 'adCac', 'realCac', 'ltvToCac', 'visitsPerSale', 'capacityUsedPercent'],
  channelMetrics: ['interpolatedLeads', 'leads', 'contacts', 'bookings', 'requestedVisits', 'realizedVisits', 'lostVisits', 'sales', 'cpl', 'adCac', 'realCac', 'ltvToCac', 'visitsPerSale', 'visitValue'],
  nullableMetrics: ['cpl', 'adCac', 'realCac', 'ltvToCac', 'visitsPerSale'],
  rates: ['contact', 'booking', 'visit', 'close'],
  scenarios: { base: 'Datos base del caso', own: 'Plan propio auditado · run-rate', custom: 'Escenario editado · [SUPUESTO]' },
  sources: [
    'marckdowns/sol-de-casa-contexto-canonico.md · datos del caso y ocho reglas',
    'markdowns/sol-de-casa-nivel-1-modelo.md · economía por instalación, escenarios y supuestos',
    'markdowns/nivel-2-implementacion.md · datos, reglas, batería y run-rate',
    'markdowns/nivel-3-implementacion.md · calendario de cobros, pagos y capacitación (no calculado en esta consulta)',
    'src/features/unit-economics/unit-economics-model.js · calculateModel, calculateChannel e interpolateLeads',
  ],
  rules: [
    '[SUPUESTO del caso] LTV corresponde a una sola venta en contribución, sin recompra.',
    '[SUPUESTO del caso] Todo el funnel ocurre en el mismo mes y las tasas se mantienen constantes frente a la inversión.',
    'Si falta capacidad, se atiende Google antes que Meta. Las ventas usan visitas realizadas; los teléfonos inválidos no se descuentan de nuevo.',
    'CPL usa leads brutos históricos; CAC real incluye anuncios y visitas realizadas. La comisión reduce contribución; fijos y técnicos quedan fuera del CAC.',
    'Esta instantánea es run-rate mensual con técnicos activos, no flujo de caja ni mes de capacitación. El costo del técnico empieza al contratar y su capacidad empieza el mes siguiente. No se han enviado proyecciones de caja.',
    '[SUPUESTO] Los campos de changes son decisiones o valores editados frente al caso; no son observaciones nuevas. La mejora de respuesta/filtro y sus tasas requieren validación.',
    '[SUPUESTO] Extrapolar adhesión de batería a futuro requiere validación. La batería solo afecta customerLtv si includeBatteryInLtv está activo; nunca se suma al resultado operativo solar ni a caja en esta consulta.',
    'En calculateChannel, el argumento contribution recibe customerLtv; en el resultado operativo se usa solarContribution. null significa métrica no definida, nunca cero.',
    'Ventas y visitas fraccionarias son expectativas del modelo del caso ficticio, no resultados garantizados.',
  ],
};

// This function is also embedded in the generated n8n JSON. No financial arithmetic runs here.
export function validateAnalystRequest(body, contract, expectedFormulas, referenceInputs) {
  const fail = (message) => ({ valid: false, statusCode: 400, response: { success: false, message } });
  const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const keys = (value, fields) => object(value) && Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
  const numeric = (value) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e12;
  const numbers = (value, fields, nullable = false) => keys(value, fields) && fields.every((field) => numeric(value[field]) || (nullable && contract.nullableMetrics.includes(field) && value[field] === null));
  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

  if (!keys(body, ['message', 'sessionId', 'context'])) return fail('La solicitud debe incluir message, sessionId y context.');
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.trim().length > contract.maxMessageLength) return fail('Escribe una pregunta financiera de entre 1 y 2.000 caracteres.');
  if (typeof body.sessionId !== 'string' || !/^[a-zA-Z0-9_-]{8,80}$/.test(body.sessionId)) return fail('La sesión no es válida. Recarga la calculadora y vuelve a intentar.');
  const context = body.context;
  if (!keys(context, ['version', 'project', 'fictional', 'currency', 'period', 'capturedAt', 'scenario', 'inputs', 'metrics', 'changes', 'sources', 'rules', 'formulas'])) return fail('Falta el contexto financiero o su formato no es válido.');
  if (JSON.stringify(context).length > contract.maxContextLength) return fail('El contexto financiero supera el tamaño permitido.');
  if (context.version !== contract.version || context.project !== 'sol-de-casa' || context.fictional !== true || context.currency !== 'USD' || context.period !== 'monthly-run-rate' || !Object.hasOwn(contract.scenarios, context.scenario)) return fail('El contexto no corresponde a esta calculadora del caso ficticio.');
  if (typeof context.capturedAt !== 'string' || context.capturedAt.length > 30 || !Number.isFinite(Date.parse(context.capturedAt)) || new Date(context.capturedAt).toISOString() !== context.capturedAt) return fail('La fecha de la instantánea financiera no es válida.');
  if (!object(referenceInputs?.base) || !object(referenceInputs?.own) || !Array.isArray(expectedFormulas) || expectedFormulas.length === 0 || !same(context.sources, contract.sources) || !same(context.rules, contract.rules) || !same(context.formulas, expectedFormulas)) return fail('Las referencias del modelo no coinciden. Actualiza la interfaz y el workflow a la misma versión.');

  const inputs = context.inputs;
  if (!keys(inputs, [...contract.inputFields, 'includeBatteryInLtv', 'channels']) || !contract.inputFields.every((field) => numeric(inputs[field]) && inputs[field] >= 0) || typeof inputs.includeBatteryInLtv !== 'boolean' || !keys(inputs.channels, ['meta', 'google'])) return fail('Las entradas financieras no tienen el formato esperado.');
  if (!Number.isInteger(inputs.extraTechnicians) || inputs.extraTechnicians > 2) return fail('El caso admite como máximo dos técnicos extra.');
  for (const key of ['meta', 'google']) {
    const channel = inputs.channels[key];
    if (!keys(channel, ['investment', 'leadRetentionPercent', 'rates', 'history']) || !numeric(channel.investment) || channel.investment < 0 || !numeric(channel.leadRetentionPercent) || channel.leadRetentionPercent < 0 || channel.leadRetentionPercent > 100 || !numbers(channel.rates, contract.rates) || contract.rates.some((rate) => channel.rates[rate] < 0 || channel.rates[rate] > 100)) return fail('Las entradas de un canal no son válidas.');
    if (!Array.isArray(channel.history) || channel.history.length < 2 || channel.history.length > 20 || !channel.history.every((point) => Array.isArray(point) && point.length === 2 && point.every((value) => numeric(value) && value >= 0))) return fail('El histórico de leads no tiene el formato esperado.');
    if (!same(channel.history, referenceInputs.base.channels[key].history)) return fail('El histórico no coincide con el modelo actual de la calculadora.');
  }

  const metrics = context.metrics;
  if (!keys(metrics, [...contract.modelMetrics, 'operatingCosts', 'totals', 'channels']) || !contract.modelMetrics.every((field) => numeric(metrics[field])) || !numbers(metrics.operatingCosts, ['fixed', 'technicians']) || !numbers(metrics.totals, contract.totalMetrics, true) || !keys(metrics.channels, ['meta', 'google']) || !['meta', 'google'].every((key) => numbers(metrics.channels[key], contract.channelMetrics, true))) return fail('Las métricas calculadas están ausentes o tienen un formato inválido.');

  const changePaths = [...contract.inputFields, 'includeBatteryInLtv'];
  for (const key of ['meta', 'google']) {
    changePaths.push(`channels.${key}.investment`, `channels.${key}.leadRetentionPercent`, ...contract.rates.map((rate) => `channels.${key}.rates.${rate}`));
  }
  if (!Array.isArray(context.changes) || context.changes.length > changePaths.length || !context.changes.every((change) => keys(change, ['path', 'caseValue', 'activeValue']) && changePaths.includes(change.path) && [change.caseValue, change.activeValue].every((value) => numeric(value) || typeof value === 'boolean'))) return fail('Los supuestos editados no tienen el formato esperado.');

  // Compare provenance data only; never reimplement or recalculate financial metrics.
  const valueAt = (inputs, path) => path.split('.').reduce((value, key) => value[key], inputs);
  const changedPaths = changePaths.filter((path) => valueAt(inputs, path) !== valueAt(referenceInputs.base, path));
  if (context.changes.length !== changedPaths.length || new Set(context.changes.map((change) => change.path)).size !== changedPaths.length || !context.changes.every((change) => changedPaths.includes(change.path) && change.caseValue === valueAt(referenceInputs.base, change.path) && change.activeValue === valueAt(inputs, change.path))) return fail('Los supuestos declarados no corresponden a las entradas activas.');
  const expectedScenario = changedPaths.length === 0 ? 'base' : changePaths.every((path) => valueAt(inputs, path) === valueAt(referenceInputs.own, path)) ? 'own' : 'custom';
  if (context.scenario !== expectedScenario) return fail('La etiqueta del escenario no corresponde a las entradas activas.');

  return { valid: true, message: body.message.trim(), sessionId: body.sessionId, context };
}
