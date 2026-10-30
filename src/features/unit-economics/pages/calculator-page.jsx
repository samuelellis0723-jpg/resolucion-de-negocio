import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalculatorControls } from '@/features/unit-economics/components/calculator-controls.jsx';
import { CapacityChart } from '@/features/unit-economics/components/capacity-chart.jsx';
import { ChannelResultsTable } from '@/features/unit-economics/components/channel-results-table.jsx';
import { ChannelTrap } from '@/features/unit-economics/components/channel-trap.jsx';
import { EfficiencyChart } from '@/features/unit-economics/components/efficiency-chart.jsx';
import { EconomicsSummary } from '@/features/unit-economics/components/economics-summary.jsx';
import { FunnelChart } from '@/features/unit-economics/components/funnel-chart.jsx';
import { createCaseInputs, useUnitEconomics } from '@/features/unit-economics/hooks/use-unit-economics.js';

export function CalculatorPage() {
  const [inputs, setInputs] = useState(createCaseInputs);
  const result = useUnitEconomics(inputs);
  const caseResult = useMemo(() => globalThis.SolDeCasaModel.calculateModel(createCaseInputs()), []);

  function handleInputChange(field, event) {
    const value = event.target.value;
    setInputs((current) => {
      if (typeof current[field] === 'boolean') return { ...current, [field]: Boolean(value) };
      const min = event.target.min == null || event.target.min === '' ? -Infinity : Number(event.target.min);
      const max = event.target.max == null || event.target.max === '' ? Infinity : Number(event.target.max);
      return { ...current, [field]: Math.min(max, Math.max(min, Number(value))) };
    });
  }

  function handleChannelInvestmentChange(channelKey, event) {
    const investment = Number(event.target.value);
    setInputs((current) => ({ ...current, channels: { ...current.channels, [channelKey]: { ...current.channels[channelKey], investment } } }));
  }

  function handleChannelRateChange(channelKey, rateKey, event) {
    const rate = Math.max(0, Math.min(100, Number(event.target.value)));
    setInputs((current) => ({ ...current, channels: { ...current.channels, [channelKey]: { ...current.channels[channelKey], rates: { ...current.channels[channelKey].rates, [rateKey]: rate } } } }));
  }

  function handleLeadRetentionChange(event) {
    const leadRetentionPercent = Math.max(0, Math.min(100, Number(event.target.value)));
    setInputs((current) => ({ ...current, channels: { ...current.channels, meta: { ...current.channels.meta, leadRetentionPercent } } }));
  }

  function handleReset() {
    setInputs(createCaseInputs());
  }

  function handleOwnPlan() {
    setInputs(globalThis.SolDeCasaModel.createOwnPlanInputs());
  }

  return (
    <div className="calculator-page page-gutter">
      <section className="calculator-heading">
        <div>
          <p className="eyebrow">Calculadora de Nivel 2 · Prototipo educativo</p>
          <h1>La economía detrás<br />de cada visita.</h1>
          <p>Prueba inversiones, tasas y capacidad. Cada resultado usa la interpolación histórica del caso y se actualiza al momento.</p>
        </div>
        <div className="calculator-actions">
          <Link className="text-link" to="/">Volver a Sol de Casa</Link>
          <button className="button button--outline" onClick={handleOwnPlan} type="button">Ver plan propio auditado</button>
          <button className="button button--outline" onClick={handleReset} type="button">Restaurar datos del caso <span aria-hidden="true">↺</span></button>
        </div>
      </section>
      <div className="calculator-layout">
        <CalculatorControls inputs={inputs} onChannelInvestmentChange={handleChannelInvestmentChange} onChannelRateChange={handleChannelRateChange} onInputChange={handleInputChange} onLeadRetentionChange={handleLeadRetentionChange} />
        <div className="results-column">
          <EconomicsSummary inputs={inputs} result={result} />
          <ChannelTrap caseResult={caseResult} />
          <section className="chart-section">
            <div className="section-heading section-heading--compact"><div><p className="eyebrow">01 · Conversión</p><h2>De lead a venta</h2></div><p>La tasa de cada etapa se aplica a la anterior.</p></div>
            <FunnelChart channels={result.channels} />
          </section>
          <section className="chart-section chart-section--split">
            <div className="section-heading section-heading--compact"><div><p className="eyebrow">02 · Adquisición</p><h2>El costo completo</h2></div><p>CPL mide el lead. CAC real mide la venta con visitas atendidas.</p></div>
            <EfficiencyChart channels={result.channels} />
          </section>
          <section className="chart-section chart-section--split">
            <div className="section-heading section-heading--compact"><div><p className="eyebrow">03 · Operación</p><h2>Demanda y capacidad</h2></div><p>La línea punteada refleja la capacidad mensual efectiva.</p></div>
            <CapacityChart baseCapacity={inputs.baseVisitCapacity} capacity={result.capacity} channels={result.channels} />
          </section>
          <section className="channel-table-section">
            <div className="section-heading section-heading--compact"><div><p className="eyebrow">Detalle trazable</p><h2>Resultados por canal</h2></div><p>USD, salvo tasas y cantidades.</p></div>
            <ChannelResultsTable channels={result.channels} />
            <p className="formula-note">CAC real = (inversión + costo de visitas realizadas) ÷ ventas. Contribución por venta = precio × (margen bruto − comisión). Los costos fijos no se incluyen en CAC. Las ventas fraccionarias son expectativas matemáticas del embudo.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
