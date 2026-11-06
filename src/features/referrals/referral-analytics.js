import { DEMO_VISIT_CAPACITY, NEW_CLIENT_REWARD, REFERRER_REWARD, getDemoMonth } from './referral-store.js';

export const VISIT_COST = 60;
export const CAC_LIMIT = 300;
export const CASE_CLOSE_RATE = 0.45;
export const CASE_MONTHLY_VISIT_CAPACITY = 100;
export const PART_ONE_PAID_VISITS = 97.4875;
export const PART_ONE_PAID_CAC = 620.59;

export function getProjectedReferralEconomics() {
  const visitsPerSale = 1 / CASE_CLOSE_RATE;
  const visitCostPerSale = visitsPerSale * VISIT_COST;
  const rewardCostPerSale = visitsPerSale * REFERRER_REWARD + NEW_CLIENT_REWARD;
  return {
    visitsPerSale,
    visitCostPerSale,
    rewardBudgetPerSale: CAC_LIMIT - visitCostPerSale,
    rewardCostPerSale,
    projectedCac: visitCostPerSale + rewardCostPerSale,
  };
}

export function getActiveReferralMetrics(state, month = getDemoMonth()) {
  const events = state.events;
  const count = (type) => events.filter((event) => event.type === type).length;
  const rewards = events.filter((event) => event.type === 'reward_granted');
  const bookedThisMonth = events.filter((event) => event.type === 'visit_scheduled' && event.month === month).length;
  const visitsCompleted = count('visit_completed');
  const salesClosed = count('sale_closed');
  const visitCost = visitsCompleted * VISIT_COST;
  const rewardCost = rewards.reduce((sum, event) => sum + event.amount, 0);
  const totalCost = visitCost + rewardCost;

  return {
    shareActionOpens: count('share_action_opened'),
    referralPageVisits: count('referral_opened'),
    estimates: count('estimate_viewed'),
    requests: state.requests.length,
    scheduled: count('visit_scheduled'),
    visitsCompleted,
    salesClosed,
    rewards,
    visitCost,
    rewardCost,
    totalCost,
    cac: salesClosed === 0 ? null : totalCost / salesClosed,
    bookedThisMonth,
    capacityRemaining: Math.max(0, DEMO_VISIT_CAPACITY - bookedThisMonth),
    capacityExceeded: bookedThisMonth > DEMO_VISIT_CAPACITY,
  };
}
