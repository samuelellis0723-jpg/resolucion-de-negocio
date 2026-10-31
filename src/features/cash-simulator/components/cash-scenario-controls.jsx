import { CashNumberField } from '@/features/cash-simulator/components/cash-number-field.jsx';

const RATE_FIELDS = [
  ['contact', 'Contacto'],
  ['booking', 'Agenda'],
  ['visit', 'Visita'],
  ['close', 'Cierre'],
];

export function CashScenarioControls({ scenarios, selectedId, onSelect, onChange, onRateChange }) {
  const selected = scenarios.find((item) => item.id === selectedId) ?? scenarios[0];

  return (
    <section className="cash-panel cash-input-panel" aria-labelledby="cash-input-title">
      <div className="cash-panel-heading">
        <div><p className="cash-kicker">Ajustes de escenario</p><h2 id="cash-input-title">Mueve las palancas</h2></div>
        <span className="cash-edit-mark">Editable</span>
      </div>
      <label className="cash-field">
        <span>Plan que vas a ajustar</span>
        <select onChange={(event) => onSelect(event.target.value)} value={selected.id}>
          {scenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <p className="cash-plan-note">{selected.note}</p>
      <div className="cash-field-grid">
        <CashNumberField label="Meta al mes" value={selected.metaInvestment} onChange={(value) => onChange(selected.id, { metaInvestment: value })} max={100000} step={200} suffix="USD" />
        <CashNumberField label="Google al mes" value={selected.googleInvestment} onChange={(value) => onChange(selected.id, { googleInvestment: value })} max={100000} step={200} suffix="USD" />
        <label className="cash-field">
          <span>Leads de Meta</span>
          <select onChange={(event) => onChange(selected.id, { leadMethod: event.target.value })} value={selected.leadMethod}>
            <option value="historical">Histórico interpolado</option>
            <option value="constant-cpl">CPL constante [SUPUESTO]</option>
          </select>
        </label>
        {selected.leadMethod === 'constant-cpl' && <CashNumberField label="CPL constante [SUPUESTO]" value={selected.assumedCpl} onChange={(value) => onChange(selected.id, { assumedCpl: value })} max={10000} min={1} step={1} suffix="USD" />}
        <CashNumberField label={`Leads Meta retenidos${selected.id.startsWith('own-') ? ' [SUPUESTO]' : ''}`} value={selected.metaLeadRetention} onChange={(value) => onChange(selected.id, { metaLeadRetention: value })} max={100} step={5} suffix="%" />
        {RATE_FIELDS.map(([key, label]) => (
          <CashNumberField key={key} label={`Tasa Meta · ${label}${selected.id.startsWith('own-') ? ' [SUPUESTO]' : ''}`} value={selected.metaRates[key]} onChange={(value) => onRateChange(selected.id, key, value)} max={100} step={1} suffix="%" />
        ))}
        <CashNumberField label="Técnicos extra [SUPUESTO]" value={selected.extraTechnicians} onChange={(value) => onChange(selected.id, { extraTechnicians: value })} max={2} step={1} />
        <CashNumberField label="Mes de contratación [SUPUESTO]" value={selected.technicianHireMonth} onChange={(value) => onChange(selected.id, { technicianHireMonth: value })} min={1} max={24} step={1} />
      </div>
      <div className="cash-rule-note">
        <strong>Pauta mensual constante [SUPUESTO].</strong>
        <span>El total no cae desde el mes 19. Los montos, el filtro, las tasas optimizadas y el mes de contratación son editables; afectan salidas mensuales, leads, ventas y capacidad.</span>
      </div>
      <p className="cash-fixed-note">Tasas Google, precio, costos variables, costos fijos, caja inicial y piso permanecen en los datos del caso.</p>
    </section>
  );
}
