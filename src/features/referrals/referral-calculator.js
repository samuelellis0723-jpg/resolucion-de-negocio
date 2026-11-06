export const CASE_AVERAGE_SAVING_RATE = 0.7;
export const CASE_AVERAGE_INSTALLATION_COST = 6500;

export function parseMonthlyBill(value) {
  const normalized = String(value).trim();
  if (!normalized) return { error: 'Escribe cuánto pagas de luz al mes.' };
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(normalized)) {
    return { error: 'Escribe un importe válido, con hasta dos decimales.' };
  }

  const amount = Number(normalized.replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'El importe debe ser mayor que cero.' };
  if (amount > 10000) return { error: 'Para esta demostración, usa un importe de $10.000 o menos.' };
  return { amount };
}

export function calculateReferralEstimate(monthlyBill) {
  const monthlySaving = Math.round((monthlyBill * CASE_AVERAGE_SAVING_RATE + Number.EPSILON) * 100) / 100;
  const annualSaving = Math.round(monthlySaving * 12 * 100) / 100;
  return {
    monthlyBill,
    monthlySaving,
    annualSaving,
    simplePaybackYears: CASE_AVERAGE_INSTALLATION_COST / annualSaving,
  };
}
