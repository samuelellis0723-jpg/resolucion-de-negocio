import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BankPitch } from '@/features/cash-simulator/components/bank-pitch.jsx';
import { CashProjectionTable } from '@/features/cash-simulator/components/cash-projection-table.jsx';
import { CashBalanceChart } from '@/features/cash-simulator/components/cash-balance-chart.jsx';
import { MonthOneReconciliation } from '@/features/cash-simulator/components/month-one-reconciliation.jsx';
import { CashScenarioControls } from '@/features/cash-simulator/components/cash-scenario-controls.jsx';
import { CashScenarioSummary } from '@/features/cash-simulator/components/cash-scenario-summary.jsx';
import { VisitCapacityChart } from '@/features/cash-simulator/components/visit-capacity-chart.jsx';
import { createCashScenarios, projectCashScenarios, updateMetaRate, updateScenario } from '@/features/cash-simulator/cashflow-model.js';
import '@/features/cash-simulator/cash-simulator.css';

export function CashSimulatorPage() {
  const [scenarios, setScenarios] = useState(createCashScenarios);
  const [editingId, setEditingId] = useState('current');
  const [pitchId, setPitchId] = useState('own-with-tech');
  const results = useMemo(() => projectCashScenarios(scenarios), [scenarios]);
  const current = results.find((result) => result.id === 'current');

  function handleScenarioChange(scenarioId, patch) {
    setScenarios((currentScenarios) => updateScenario(currentScenarios, scenarioId, patch));
  }

  function handleRateChange(scenarioId, rateKey, value) {
    setScenarios((currentScenarios) => updateMetaRate(currentScenarios, scenarioId, rateKey, value));
  }

  return (
    <div className="cash-page page-gutter">
      <section className="cash-hero">
        <div className="cash-hero-copy">
          <p className="eyebrow">Nivel 3 · liquidez y crecimiento</p>
          <h1>La caja también tiene su calendario.</h1>
          <p>Compara cinco planes a 24 meses con cobros, pagos, pauta y capacidad en el mes que ocurren.</p>
          <div className="cash-hero-actions"><Link className="text-link" to="/calculadora">Volver a la calculadora</Link><span>Proyección de caso ficticio · USD</span></div>
        </div>
        <div className="cash-hero-ledger" aria-label="Datos iniciales de caja">
          <span>Saldo de partida</span><strong>$12.000</strong><i aria-hidden="true" /><span>Reserva mínima</span><b>$5.000</b><small>22 ventas al cierre del mes cero</small>
        </div>
      </section>

      <MonthOneReconciliation result={current} />

      <section className="cash-workbench" aria-label="Simulador de escenarios">
        <CashScenarioControls onChange={handleScenarioChange} onRateChange={handleRateChange} onSelect={setEditingId} scenarios={scenarios} selectedId={editingId} />
        <CashScenarioSummary results={results} selectedPitchId={pitchId} />
      </section>

      <section className="cash-chart-grid" aria-label="Gráficos comparativos">
        <CashBalanceChart results={results} />
        <VisitCapacityChart results={results} />
      </section>

      <CashProjectionTable results={results} />
      <BankPitch onSelect={setPitchId} results={results} selectedId={pitchId} />
      <p className="cash-disclaimer">La caja acumulada no es utilidad. LTV, CAC y contribución se describen en la <Link to="/calculadora">calculadora del Nivel 2</Link>; este simulador muestra el momento de cobro y pago con el calendario del caso.</p>
    </div>
  );
}
