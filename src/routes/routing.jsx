import { Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/features/landing/pages/landing-page.jsx';
import { CalculatorPage } from '@/features/unit-economics/pages/calculator-page.jsx';
import { CashSimulatorPage } from '@/features/cash-simulator/pages/cash-simulator-page.jsx';
import { SavingsPage } from '@/features/referrals/pages/savings-page.jsx';
import { ReferralPage } from '@/features/referrals/pages/referral-page.jsx';
import { AndresPanelPage } from '@/features/referrals/pages/andres-panel-page.jsx';
import { NotFoundPage } from '@/pages/not-found-page.jsx';

export function Routing() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calculadora" element={<CalculatorPage />} />
      <Route path="/simulador-caja" element={<CashSimulatorPage />} />
      <Route path="/mi-ahorro" element={<SavingsPage />} />
      <Route path="/referidos/:codigo" element={<ReferralPage />} />
      <Route path="/panel-andres" element={<AndresPanelPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
