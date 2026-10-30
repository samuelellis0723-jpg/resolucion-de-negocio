import { formatMoney } from '@/features/unit-economics/components/number-formatters.js';

export function EfficiencyChart({ channels }) {
  const width = 640;
  const height = 300;
  const maxValue = Math.max(channels.meta.realCac || 0, channels.google.realCac || 0, 1);
  const maxBarWidth = 390;
  const rows = [
    { channel: channels.meta, label: 'Meta', color: 'meta' },
    { channel: channels.google, label: 'Google', color: 'google' },
  ];

  return (
    <div className="chart-frame">
      <svg aria-label="Comparación de CPL y CAC real por canal" className="chart-svg" role="img" viewBox={`0 0 ${width} ${height}`}>
        {rows.map(({ channel, label, color }, index) => {
          const y = index * 110 + 30;
          const cplWidth = (channel.cpl || 0) / maxValue * maxBarWidth;
          const cacWidth = (channel.realCac || 0) / maxValue * maxBarWidth;
          return (
            <g key={label}>
              <text className="chart-axis-label" x="0" y={y + 9}>{label}</text>
              <text className="chart-small-label" x="82" y={y + 5}>CPL</text>
              <rect className={`chart-bar chart-bar--${color} chart-bar--light`} height="18" rx="9" width={cplWidth} x="130" y={y - 11} />
              <text className="chart-value" x={Math.min(140 + cplWidth, 590)} y={y + 4}>{formatMoney(channel.cpl, 0)}</text>
              <text className="chart-small-label" x="82" y={y + 43}>CAC real</text>
              <rect className={`chart-bar chart-bar--${color}`} height="18" rx="9" width={cacWidth} x="130" y={y + 27} />
              <text className="chart-value" x={Math.min(140 + cacWidth, 590)} y={y + 42}>{formatMoney(channel.realCac, 0)}</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend"><span><i className="legend-dot legend-dot--meta" /> Meta</span><span><i className="legend-dot legend-dot--google" /> Google</span><span className="chart-method">CAC real incluye anuncios y visitas realizadas.</span></div>
    </div>
  );
}
