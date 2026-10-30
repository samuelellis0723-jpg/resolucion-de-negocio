export function MetricTile({ label, value, detail, tone = 'neutral' }) {
  return (
    <article className={`metric-tile metric-tile--${tone}`}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      {detail && <span className="metric-detail">{detail}</span>}
    </article>
  );
}
