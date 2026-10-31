import { formatNumber } from '@/features/unit-economics/components/number-formatters.js';
import { CashChartLegend } from '@/features/cash-simulator/components/cash-chart-legend.jsx';
import { CASH_CHART_BOTTOM, CASH_CHART_HEIGHT, CASH_CHART_LEFT, CASH_CHART_RIGHT, CASH_CHART_WIDTH, CASH_SERIES_COLORS, makeChartPath, xForMonth, yForValue } from '@/features/cash-simulator/components/cash-chart-utils.js';

export function VisitCapacityChart({ results }) {
  const high = Math.max(160, ...results.flatMap((result) => result.rows.map((row) => Math.max(row.capacity, row.requestedVisits)))) * 1.12;
  const ticks = [0, high / 2, high];

  return (
    <section className="cash-panel cash-chart-panel" aria-labelledby="visits-chart-title">
      <div className="cash-panel-heading"><div><p className="cash-kicker">Capacidad operativa</p><h2 id="visits-chart-title">Visitas atendidas y disponibles</h2></div><span className="cash-chart-unit">visitas · mismo mes</span></div>
      <p className="cash-chart-note">La capacidad del técnico nuevo aparece un mes después de contratarlo. Las visitas no realizadas no generan ventas.</p>
      <div className="cash-chart-scroll" role="region" aria-label="Gráfico de visitas y capacidad, desplazable">
        <svg aria-labelledby="visits-chart-title" className="cash-svg" role="img" viewBox={`0 0 ${CASH_CHART_WIDTH} ${CASH_CHART_HEIGHT}`}>
          {ticks.map((tick, index) => <g key={index}><line className="cash-gridline" x1={CASH_CHART_LEFT} x2={CASH_CHART_WIDTH - CASH_CHART_RIGHT} y1={yForValue(tick, 0, high)} y2={yForValue(tick, 0, high)} /><text className="cash-axis-label" textAnchor="end" x={CASH_CHART_LEFT - 9} y={yForValue(tick, 0, high) + 4}>{formatNumber(tick, 0)}</text></g>)}
          {[1, 6, 12, 18, 24].map((month) => <text className="cash-axis-label" key={month} textAnchor="middle" x={xForMonth(month)} y={CASH_CHART_HEIGHT - CASH_CHART_BOTTOM + 21}>{`Mes ${month}`}</text>)}
          {results.map((result, index) => {
            const color = CASH_SERIES_COLORS[index % CASH_SERIES_COLORS.length];
            const visits = result.rows.map((row) => [xForMonth(row.month), yForValue(row.realizedVisits, 0, high)]);
            const capacity = result.rows.map((row) => [xForMonth(row.month), yForValue(row.capacity, 0, high)]);
            return <g key={result.id} style={{ '--series-color': color }}><path className="capacity-series" d={makeChartPath(capacity)} /><path className="cash-series" d={makeChartPath(visits)} /></g>;
          })}
        </svg>
      </div>
      <div className="cash-chart-key"><span><i className="cash-key-line" />visitas realizadas</span><span><i className="cash-key-line cash-key-line--dash" />capacidad</span></div>
      <CashChartLegend results={results} />
    </section>
  );
}
