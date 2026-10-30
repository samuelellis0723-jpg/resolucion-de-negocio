import { ControlField } from '@/features/unit-economics/components/control-field.jsx';
import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';

function ChannelControl({ channelKey, channel, onInvestmentChange, onRateChange, onLeadRetentionChange }) {
  const channelTitle = channel.name;
  return (
    <fieldset className={`channel-control channel-control--${channelKey}`}>
      <legend><span className={`channel-dot channel-dot--${channelKey}`} />{channelTitle}</legend>
      <ControlField label="Inversión mensual" help={`${formatNumber(channel.investment, 0)} USD al mes`} max={10000} onChange={(event) => onInvestmentChange(channelKey, event)} step={100} suffix="USD" type="range" value={channel.investment} />
      <div className="range-value"><strong>{formatMoney(channel.investment)}</strong><span>Máximo $10.000 según el histórico</span></div>
      {channelKey === 'meta' && <ControlField label="Leads que pasan el filtro" help="100 % en datos base; el plan propio supone retener 80 %." max={100} min={0} onChange={onLeadRetentionChange} suffix="%" value={channel.leadRetentionPercent} />}
      <div className="rate-grid">
        {[
          ['contact', 'Contacto'], ['booking', 'Agenda'], ['visit', 'Visita hecha'], ['close', 'Cierre'],
        ].map(([rateKey, label]) => (
          <ControlField key={rateKey} label={label} max={100} min={0} onChange={(event) => onRateChange(channelKey, rateKey, event)} step={1} suffix="%" value={channel.rates[rateKey]} />
        ))}
      </div>
    </fieldset>
  );
}

export function CalculatorControls({ inputs, onInputChange, onChannelInvestmentChange, onChannelRateChange, onLeadRetentionChange }) {
  return (
    <aside className="controls-panel" aria-label="Controles de la calculadora">
      <div className="controls-intro">
        <p className="eyebrow">Modelo editable</p>
        <h2>Ajusta las entradas.</h2>
        <p>Los resultados se recalculan al cambiar cualquier valor. Las tasas se aplican en secuencia dentro del mismo mes.</p>
      </div>
      <ChannelControl channelKey="meta" channel={inputs.channels.meta} onInvestmentChange={onChannelInvestmentChange} onRateChange={onChannelRateChange} onLeadRetentionChange={onLeadRetentionChange} />
      <ChannelControl channelKey="google" channel={inputs.channels.google} onInvestmentChange={onChannelInvestmentChange} onRateChange={onChannelRateChange} />
      <fieldset className="assumption-controls">
        <legend>Precio, visitas y capacidad</legend>
        <div className="control-grid">
          <ControlField label="Precio instalación" max={20000} min={1000} onChange={(event) => onInputChange('installationPrice', event)} step={100} suffix="USD" value={inputs.installationPrice} />
          <ControlField label="Margen bruto" max={100} min={0} onChange={(event) => onInputChange('grossMarginPercent', event)} suffix="%" value={inputs.grossMarginPercent} />
          <ControlField label="Comisión" max={50} min={0} onChange={(event) => onInputChange('commissionPercent', event)} suffix="%" value={inputs.commissionPercent} />
          <ControlField label="Costo visita hecha" max={1000} min={0} onChange={(event) => onInputChange('visitCost', event)} step={5} suffix="USD" value={inputs.visitCost} />
          <ControlField label="Capacidad base" help="Visitas al mes con el equipo actual" max={500} min={0} onChange={(event) => onInputChange('baseVisitCapacity', event)} step={10} suffix="visitas" value={inputs.baseVisitCapacity} />
          <label className="control-field">
            <span className="control-label">Técnicos extra activos</span>
            <span className="control-help">+50 visitas desde el mes siguiente a cada contratación</span>
            <select onChange={(event) => onInputChange('extraTechnicians', { target: { value: event.target.value } })} value={inputs.extraTechnicians}>
              {[0, 1, 2].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'técnico' : 'técnicos'}</option>)}
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset className="assumption-controls battery-controls">
        <legend>Batería · supuesto opcional</legend>
        <p className="control-help battery-context">Prueba: 3 de 20 clientes la agregaron. Extrapolar 15 % a futuro es un supuesto; no se incluye en la caja.</p>
        <div className="control-grid">
          <ControlField label="Adhesión estimada" help="Editable; base observada 15 %" max={100} min={0} onChange={(event) => onInputChange('batteryAttachPercent', event)} suffix="%" value={inputs.batteryAttachPercent} />
          <ControlField label="Precio batería" max={10000} min={0} onChange={(event) => onInputChange('batteryPrice', event)} step={100} suffix="USD" value={inputs.batteryPrice} />
        </div>
        <label className="check-control">
          <input checked={inputs.includeBatteryInLtv} onChange={(event) => onInputChange('includeBatteryInLtv', { target: { value: event.target.checked } })} type="checkbox" />
          <span>Incluir contribución esperada de batería en LTV:CAC</span>
        </label>
      </fieldset>
    </aside>
  );
}
