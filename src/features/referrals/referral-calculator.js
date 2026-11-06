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
  const monthlyBillCents = Math.round(monthlyBill * 100);
  const savingRatePercent = Math.round(CASE_AVERAGE_SAVING_RATE * 100);
  const monthlySaving = monthlyBillCents * savingRatePercent / 10000;
  const annualSaving = monthlyBillCents * savingRatePercent * 12 / 10000;
  return {
    monthlyBill,
    monthlySaving,
    annualSaving,
    simplePaybackYears: CASE_AVERAGE_INSTALLATION_COST / annualSaving,
  };
}
