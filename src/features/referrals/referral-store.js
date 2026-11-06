import { resolveReferralCode } from './referral-demo.js';

export const REFERRAL_STORAGE_KEY = 'sol-de-casa-referrals-v1';
export const REFERRAL_SESSION_PREFIX = 'sol-de-casa-current-request-';
export const DEMO_VISIT_CAPACITY = 1;
export const REFERRER_REWARD = 15;
export const NEW_CLIENT_REWARD = 50;

export function getDemoMonth(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function emptyState() {
  return { version: 1, requests: [], events: [] };
}

export function readReferralState(storage = window.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(REFERRAL_STORAGE_KEY));
    if (parsed?.version === 1 && Array.isArray(parsed.requests) && Array.isArray(parsed.events)) {
      return {
        version: 1,
        requests: parsed.requests.filter((request) =>
          typeof request?.id === 'string' && resolveReferralCode(request.referralCode) &&
          ['received', 'waiting', 'scheduled', 'completed', 'closed'].includes(request.status) && Number.isFinite(request.estimate?.monthlySaving),
        ),
        events: parsed.events.filter((event) =>
          typeof event?.id === 'string' && typeof event.type === 'string' && resolveReferralCode(event.referralCode),
        ),
      };
    }
  } catch {
    // A blocked or malformed browser store leaves the demo in its empty state.
  }
  return emptyState();
}

function saveReferralState(state, storage) {
  storage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(state));
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event('sol-de-casa-referrals-updated'));
  }
  return state;
}

export function getLatestRequest(referralCode, storage = window.localStorage) {
  return readReferralState(storage).requests.filter((request) => request.referralCode === referralCode).at(-1) ?? null;
}

export function getSessionRequest(referralCode, storage = window.localStorage, session = window.sessionStorage) {
  try {
    const id = session.getItem(`${REFERRAL_SESSION_PREFIX}${referralCode}`);
    if (!id) return null;
    const request = readReferralState(storage).requests.find((item) => item.id === id && item.referralCode === referralCode);
    return request ?? null;
  } catch {
    // With blocked tab storage, use the latest local request as a fallback.
    return getLatestRequest(referralCode, storage);
  }
}

export function setSessionRequest(referralCode, requestId, session = window.sessionStorage) {
  try { session.setItem(`${REFERRAL_SESSION_PREFIX}${referralCode}`, requestId); } catch { /* local state remains available */ }
}

export function clearSessionRequest(referralCode, session = window.sessionStorage) {
  try { session.removeItem(`${REFERRAL_SESSION_PREFIX}${referralCode}`); } catch { /* local state remains available */ }
}

export function getRemainingDemoCapacity(storage = window.localStorage, month = getDemoMonth()) {
  const booked = readReferralState(storage).events.filter((event) => event.type === 'visit_scheduled' && event.month === month).length;
  return Math.max(0, DEMO_VISIT_CAPACITY - booked);
}

export function recordReferralEvent(event, storage = window.localStorage) {
  if (!resolveReferralCode(event.referralCode)) throw new Error('Código de referido inválido.');
  const state = readReferralState(storage);
  if (state.events.some((item) => item.id === event.id)) return state;
  const nextState = {
    ...state,
    events: [...state.events, { ...event, simulated: true, occurredAt: new Date().toISOString() }],
  };
  return saveReferralState(nextState, storage);
}

export function submitReferralRequest(input, storage = window.localStorage) {
  if (!resolveReferralCode(input.referralCode)) throw new Error('Código de referido inválido.');
  if (!input.id || !/^[^\s@]+@[^\s@]+\.test$/i.test(input.email.trim()) || !input.name.trim() ||
    !Number.isFinite(input.estimate?.monthlyBill) || input.estimate.monthlyBill <= 0) {
    throw new Error('La solicitud de demostración no es válida.');
  }
  const state = readReferralState(storage);
  const email = input.email.trim().toLowerCase();
  const existing = state.requests.find((request) =>
    request.id === input.id || (request.referralCode === input.referralCode && request.email === email),
  );
  if (existing) return { request: existing, wasExisting: true };

  const status = getRemainingDemoCapacity(storage) > 0 ? 'received' : 'waiting';
  const request = {
    id: input.id,
    referralCode: input.referralCode,
    name: input.name.trim(),
    email,
    estimate: input.estimate,
    status,
    simulated: true,
    createdAt: new Date().toISOString(),
  };
  const nextState = {
    ...state,
    requests: [...state.requests, request],
    events: [...state.events, {
      id: `request-${request.id}`,
      type: status === 'received' ? 'request_received' : 'request_waitlisted',
      referralCode: request.referralCode,
      requestId: request.id,
      simulated: true,
      occurredAt: request.createdAt,
    }],
  };
  saveReferralState(nextState, storage);
  return { request, wasExisting: false };
}

export function advanceReferralRequest(requestId, nextStatus, storage = window.localStorage, month = getDemoMonth()) {
  const state = readReferralState(storage);
  const current = state.requests.find((request) => request.id === requestId);
  if (!current) throw new Error('Solicitud no encontrada.');
  if (current.status === nextStatus) return { request: current, wasExisting: true };

  const allowed = {
    waiting: ['received'],
    received: ['scheduled', 'waiting'],
    scheduled: ['completed'],
    completed: ['closed'],
    closed: [],
  };
  if (!allowed[current.status]?.includes(nextStatus)) throw new Error('La etapa solicitada no sigue el recorrido.');
  if ((current.status === 'waiting' || nextStatus === 'scheduled') && getRemainingDemoCapacity(storage, month) === 0) {
    throw new Error('La agenda mensual de demostración está agotada.');
  }

  const occurredAt = new Date().toISOString();
  const eventType = {
    received: 'request_reactivated',
    waiting: 'request_waitlisted',
    scheduled: 'visit_scheduled',
    completed: 'visit_completed',
    closed: 'sale_closed',
  }[nextStatus];
  const updated = {
    ...current,
    status: nextStatus,
    ...(nextStatus === 'scheduled' ? { scheduledMonth: month, scheduledAt: occurredAt } : {}),
    ...(nextStatus === 'completed' ? { completedAt: occurredAt } : {}),
    ...(nextStatus === 'closed' ? { closedAt: occurredAt } : {}),
  };
  const transitionEvent = {
    id: `transition-${nextStatus}-${requestId}`,
    type: eventType,
    referralCode: current.referralCode,
    requestId,
    ...(nextStatus === 'scheduled' ? { month } : {}),
    simulated: true,
    occurredAt,
  };
  const rewardEvent = nextStatus === 'completed' || nextStatus === 'closed' ? {
    id: `reward-${nextStatus}-${requestId}`,
    type: 'reward_granted',
    rewardFor: nextStatus === 'completed' ? 'referrer' : 'new_client',
    amount: nextStatus === 'completed' ? REFERRER_REWARD : NEW_CLIENT_REWARD,
    referralCode: current.referralCode,
    requestId,
    assumption: true,
    simulated: true,
    occurredAt,
  } : null;
  const additions = [transitionEvent, rewardEvent].filter(Boolean).filter((event) => !state.events.some((existing) => existing.id === event.id));
  saveReferralState({
    ...state,
    requests: state.requests.map((request) => request.id === requestId ? updated : request),
    events: [...state.events, ...additions],
  }, storage);
  return { request: updated, wasExisting: false };
}
