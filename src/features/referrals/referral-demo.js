// Public demonstration identifier. It carries no household information.
export const DEMO_REFERRAL_CODE = 'sd-7m4q9v2k';

export function resolveReferralCode(code) {
  if (code !== DEMO_REFERRAL_CODE) return null;

  return {
    code: DEMO_REFERRAL_CODE,
    isSimulated: true,
  };
}

export function getReferralUrl(origin, code = DEMO_REFERRAL_CODE) {
  return new URL(`/referidos/${encodeURIComponent(code)}`, origin).href;
}
