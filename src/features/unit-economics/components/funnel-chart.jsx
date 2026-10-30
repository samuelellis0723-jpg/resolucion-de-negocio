import { formatNumber } from '@/features/unit-economics/components/number-formatters.js';

const funnelStages = [
  ['leads', 'Leads'], ['contacts', 'Contactos'], ['bookings', 'Agendas'], ['realizedVisits', 'Visitas'], ['sales', 'Ventas'],
];

export function FunnelChart({ channels }) {
  const width = 760;
  const left = 126;
  const right = 64;
  const chartWidth = width - left - right;
  const maxValue = Math.max(...funnelStages.flatMap(([key]) => [channels.meta[key], channels.google[key]]), 1);
  const chartHeight = funnelStages.length * 56 + 22;
  const barHeight = 13;

  return (
    <div className="chart-frame">
      <svg aria-label="Funnel comparado entre Meta y Google, desde leads hasta ventas" className="chart-svg" role="img" viewBox={`0 0 ${width} ${chartHeight}`}>
        {funnelStages.map(([key, label], index) => {
          const y = index * 56 + 10;
          const metaWidth = channels.meta[key] / maxValue * chartWidth;
          const googleWidth = channels.google[key] / maxValue * chartWidth;
          return (
            <g key={key}>
              <text className="chart-axis-label" x="0" y={y + 11}>{label}</text>
              <rect className="chart-bar chart-bar--meta" height={barHeight} rx="6.5" width={metaWidth} x={left} y={y} />
              <text className="chart-value" x={Math.min(left + metaWidth + 8, width - 48)} y={y + 11}>{formatNumber(channels.meta[key], 1)}</text>
              <rect className="chart-bar chart-bar--google" height={barHeight} rx="6.5" width={googleWidth} x={left} y={y + 19} />
              <text className="chart-value" x={Math.min(left + googleWidth + 8, width - 48)} y={y + 30}>{formatNumber(channels.google[key], 1)}</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend"><span><i className="legend-dot legend-dot--meta" /> Meta</span><span><i className="legend-dot legend-dot--google" /> Google</span><span className="chart-method">Cada etapa aplica su tasa a la anterior.</span></div>
    </div>
  );
}
