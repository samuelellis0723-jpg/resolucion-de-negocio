import { formatNumber } from '@/features/unit-economics/components/number-formatters.js';

export function CapacityChart({ channels, capacity, baseCapacity }) {
  const width = 680;
  const height = 280;
  const chartTop = 24;
  const chartBottom = 218;
  const chartHeight = chartBottom - chartTop;
  const maxValue = Math.max(capacity * 1.2, channels.meta.requestedVisits + channels.google.requestedVisits, 1);
  const scaleY = (value) => chartBottom - value / maxValue * chartHeight;
  const capacityY = scaleY(capacity);
  const baseCapacityY = scaleY(baseCapacity);
  const barData = [
    { label: 'Meta', x: 165, requested: channels.meta.requestedVisits, realized: channels.meta.realizedVisits, kind: 'meta' },
    { label: 'Google', x: 400, requested: channels.google.requestedVisits, realized: channels.google.realizedVisits, kind: 'google' },
  ];

  return (
    <div className="chart-frame">
      <svg aria-label={`Visitas solicitadas y realizadas frente a capacidad de ${capacity} visitas mensuales`} className="chart-svg" role="img" viewBox={`0 0 ${width} ${height}`}>
        {[0, .25, .5, .75, 1].map((ratio) => {
          const y = chartBottom - chartHeight * ratio;
          const axisValue = maxValue * ratio;
          return <g key={ratio}><line className="chart-gridline" x1="74" x2="635" y1={y} y2={y} /><text className="chart-tick" x="8" y={y + 4}>{formatNumber(axisValue, 0)}</text></g>;
        })}
        {capacity > baseCapacity && <><line className="base-capacity-line" x1="74" x2="635" y1={baseCapacityY} y2={baseCapacityY} /><text className="base-capacity-label" x="75" y={baseCapacityY - 8}>Base {baseCapacity}</text></>}
        <line className="capacity-line" x1="74" x2="635" y1={capacityY} y2={capacityY} />
        <text className="capacity-label" x="525" y={capacityY - 8}>{capacity > baseCapacity ? `Capacidad efectiva ${capacity}` : `Capacidad ${capacity}`}</text>
        {barData.map((item) => {
          const requestedY = scaleY(item.requested);
          const realizedY = scaleY(item.realized);
          return <g key={item.kind}>
            <rect className={`requested-bar requested-bar--${item.kind}`} height={chartBottom - requestedY} width="54" x={item.x} y={requestedY} rx="10" />
            <rect className={`realized-bar realized-bar--${item.kind}`} height={chartBottom - realizedY} width="54" x={item.x + 60} y={realizedY} rx="10" />
            <text className="chart-axis-label" x={item.x + 10} y="247">{item.label}</text>
            <text className="chart-value" x={item.x + 5} y={Math.max(requestedY - 8, 15)}>{formatNumber(item.requested, 1)}</text>
            <text className="chart-value" x={item.x + 63} y={Math.max(realizedY - 8, 15)}>{formatNumber(item.realized, 1)}</text>
          </g>;
        })}
      </svg>
      <div className="chart-legend"><span><i className="legend-dot legend-dot--requested" /> Solicitadas</span><span><i className="legend-dot legend-dot--actual" /> Realizadas</span><span><i className={`legend-line ${capacity > baseCapacity ? 'legend-line--base' : 'legend-line--effective'}`} /> Capacidad base {baseCapacity}</span>{capacity > baseCapacity && <span><i className="legend-line legend-line--effective" /> Capacidad efectiva {capacity}</span>}<span className="chart-method">Las no atendidas no generan ventas.</span></div>
    </div>
  );
}
