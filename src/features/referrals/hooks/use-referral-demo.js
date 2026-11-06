import { useEffect, useState } from 'react';
import { REFERRAL_STORAGE_KEY, readReferralState } from '../referral-store.js';

export function useReferralDemo() {
  const [state, setState] = useState(readReferralState);

  useEffect(() => {
    const refresh = (event) => {
      if (event?.type !== 'storage' || event.key === REFERRAL_STORAGE_KEY) setState(readReferralState());
    };
    window.addEventListener('sol-de-casa-referrals-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('sol-de-casa-referrals-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return state;
}
