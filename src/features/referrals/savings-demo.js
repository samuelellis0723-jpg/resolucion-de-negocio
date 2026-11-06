import { DEMO_REFERRAL_CODE } from './referral-demo.js';

// Every value represents an illustrative household, never inverter or billing data.
export const demoHousehold = {
  referralCode: DEMO_REFERRAL_CODE,
  installedMonth: '2026-05',
  savingRate: 0.7,
  months: [
    { month: '2026-05', referenceBill: 100 },
    { month: '2026-06', referenceBill: 110 },
    { month: '2026-07', referenceBill: 90 },
    { month: '2026-08', referenceBill: 120 },
    { month: '2026-09', referenceBill: 100 },
    { month: '2026-10', referenceBill: 110 },
  ],
};

export const savingsHistory = demoHousehold.months.map(({ month, referenceBill }) => ({
  month,
  referenceBill,
  saving: referenceBill * demoHousehold.savingRate,
}));

export const latestSaving = savingsHistory.at(-1);
export const accumulatedSaving = savingsHistory.reduce((sum, entry) => sum + entry.saving, 0);

export function getSharedSaving(period) {
  if (period === 'mensual') return { period, amount: latestSaving.saving };
  if (period === 'acumulado') return { period, amount: accumulatedSaving };
  return null;
}
