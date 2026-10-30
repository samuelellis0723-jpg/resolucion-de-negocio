import { formatMoney, formatNumber, formatRatio } from '@/features/unit-economics/components/number-formatters.js';
import { MetricTile } from '@/features/unit-economics/components/metric-tile.jsx';

function getRatioTone(ratio) {
  if (ratio == null || ratio < 1) return 'negative';
  if (ratio < 3) return 'watch';
  return 'positive';
}

export function EconomicsSummary({ result, inputs }) {
  const totals = result.totals;
  const isOverCapacity = totals.requestedVisits > result.capacity;
  return (
    <>
      <section className="summary-topline">
        <div>
          <p className="eyebrow">Vista de negocio · USD mensuales</p>
          <h1>Tus números,<br />a la vista.</h1>
          <p>Embudo, adquisición y capacidad calculados a partir de los datos del caso.</p>
        </div>
        <div className={`capacity-status${isOverCapacity ? ' capacity-status--alert' : ''}`} role="status">
          <span className="status-signal" />
          <div><strong>{isOverCapacity ? 'Capacidad superada' : 'Capacidad disponible'}</strong><span>{formatNumber(totals.realizedVisits)} de {formatNumber(result.capacity)} visitas realizadas</span></div>
        </div>
      </section>

      <section aria-label="Indicadores totales" className="metric-grid">
        <MetricTile detail={`${formatNumber(totals.leads)} leads entre ambos canales`} label="Ventas estimadas" tone="neutral" value={formatNumber(totals.sales, 2)} />
        <MetricTile detail="Anuncios + visitas realizadas" label="CAC real combinado" tone="neutral" value={formatMoney(totals.realCac, 2)} />
        <MetricTile detail="Contribución de una instalación / CAC real" label="LTV:CAC" tone={getRatioTone(totals.ltvToCac)} value={formatRatio(totals.ltvToCac)} />
        <MetricTile detail={`${formatNumber(totals.requestedVisits)} visitas pedidas`} label="Capacidad usada" tone={isOverCapacity ? 'negative' : 'positive'} value={`${formatNumber(totals.capacityUsedPercent, 1)}%`} />
      </section>

      <section className="economics-strip">
        <div><span>Contribución solar por venta</span><strong>{formatMoney(result.contribution, 2)}</strong><small>Precio × (margen bruto − comisión)</small></div>
        <div><span>Adquisición en anuncios</span><strong>{formatMoney(totals.adCac, 2)} <small>por venta</small></strong><small>{formatMoney(totals.adSpend)} de inversión combinada</small></div>
        <div><span>Visitas por venta</span><strong>{formatNumber(totals.visitsPerSale, 2)}</strong><small>Usa visitas realizadas, no solicitudes.</small></div>
        <div><span>Contribución esperada de batería [SUPUESTO]</span><strong>{formatMoney(result.expectedBatteryContribution, 2)}</strong><small>{formatNumber(inputs.batteryAttachPercent, 0)}% × {formatMoney(result.batteryContribution)} por adhesión</small></div>
        <div><span>Resultado operativo estimado · run-rate</span><strong className={totals.monthlyOperatingResult < 0 ? 'operating-result--negative' : ''}>{formatMoney(totals.monthlyOperatingResult, 2)}</strong><small>Contribución − anuncios − visitas − costos fijos − técnicos activos</small></div>
      </section>
      {isOverCapacity && <div className="capacity-warning" role="alert"><strong>Se perderían {formatNumber(totals.lostVisits)} visitas.</strong> Google recibe capacidad primero; las solicitudes Meta no atendidas no generan ventas.</div>}
      {inputs.includeBatteryInLtv && <div className="assumption-banner"><strong>Supuesto activo:</strong> LTV:CAC incluye {formatMoney(result.expectedBatteryContribution, 2)} de contribución esperada de batería por instalación solar; el 15 % proviene de una prueba de 3/20 y no se valida como tasa futura.</div>}
    </>
  );
}
