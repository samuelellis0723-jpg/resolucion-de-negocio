// Public demonstration identifier. It carries no household information.
export const DEMO_REFERRAL_CODE = 'sd-7m4q9v2k';

export function resolveReferralCode(code) {
  if (code !== DEMO_REFERRAL_CODE) return null;

  return {
    code: DEMO_REFERRAL_CODE,
    isSimulated: true,
  };
}

export function getReferralUrl(origin, code = DEMO_REFERRAL_CODE, period) {
  const url = new URL(`/referidos/${encodeURIComponent(code)}`, origin);
  if (period === 'mensual' || period === 'acumulado') url.searchParams.set('ahorro', period);
  return url.href;
}

export function createReferralId() {
  return globalThis.crypto.randomUUID?.() ??
    Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
