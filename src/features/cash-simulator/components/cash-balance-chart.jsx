import { formatMoney } from '@/features/unit-economics/components/number-formatters.js';
import { CashChartLegend } from '@/features/cash-simulator/components/cash-chart-legend.jsx';
import { CASH_CHART_BOTTOM, CASH_CHART_HEIGHT, CASH_CHART_LEFT, CASH_CHART_RIGHT, CASH_CHART_WIDTH, CASH_SERIES_COLORS, makeChartPath, xForMonth, yForValue } from '@/features/cash-simulator/components/cash-chart-utils.js';

export function CashBalanceChart({ results }) {
  const points = results.flatMap((item) => [12000, ...item.rows.map((row) => row.endingCash)]);
  const low = Math.min(-5000, ...points) - 3000;
  const high = Math.max(10000, ...points) + 3000;
  const ticks = Array.from({ length: 5 }, (_, index) => low + (high - low) * index / 4);
  const floorY = yForValue(5000, low, high);

  return (
    <section className="cash-panel cash-chart-panel" aria-labelledby="cash-chart-title">
      <div className="cash-panel-heading"><div><p className="cash-kicker">Liquidez proyectada</p><h2 id="cash-chart-title">Caja final por mes</h2></div><span className="cash-chart-unit">USD · meses 1–24</span></div>
      <p className="cash-chart-note">Cada trazo parte de $12.000. La línea roja marca el piso mínimo de $5.000.</p>
      <div className="cash-chart-scroll" role="region" aria-label="Gráfico de caja, desplazable">
        <svg aria-labelledby="cash-chart-title" className="cash-svg" role="img" viewBox={`0 0 ${CASH_CHART_WIDTH} ${CASH_CHART_HEIGHT}`}>
          {ticks.map((tick, index) => <g key={index}><line className="cash-gridline" x1={CASH_CHART_LEFT} x2={CASH_CHART_WIDTH - CASH_CHART_RIGHT} y1={yForValue(tick, low, high)} y2={yForValue(tick, low, high)} /><text className="cash-axis-label" textAnchor="end" x={CASH_CHART_LEFT - 9} y={yForValue(tick, low, high) + 4}>{formatMoney(tick, 0)}</text></g>)}
          <line className="cash-floor-line" x1={CASH_CHART_LEFT} x2={CASH_CHART_WIDTH - CASH_CHART_RIGHT} y1={floorY} y2={floorY} />
          <text className="cash-floor-label" x={CASH_CHART_WIDTH - CASH_CHART_RIGHT - 5} y={floorY - 7} textAnchor="end">Piso $5.000</text>
          {[0, 6, 12, 18, 24].map((month) => <g key={month}><line className="cash-axis-tick" x1={xForMonth(month)} x2={xForMonth(month)} y1={CASH_CHART_HEIGHT - CASH_CHART_BOTTOM} y2={CASH_CHART_HEIGHT - CASH_CHART_BOTTOM + 4} /><text className="cash-axis-label" textAnchor="middle" x={xForMonth(month)} y={CASH_CHART_HEIGHT - CASH_CHART_BOTTOM + 21}>{month === 0 ? 'Inicio' : `Mes ${month}`}</text></g>)}
          {results.map((result, index) => {
            const values = [12000, ...result.rows.map((row) => row.endingCash)];
            return <path className="cash-series" d={makeChartPath(values.map((value, month) => [xForMonth(month), yForValue(value, low, high)]))} key={result.id} style={{ '--series-color': CASH_SERIES_COLORS[index % CASH_SERIES_COLORS.length] }} />;
          })}
        </svg>
      </div>
      <CashChartLegend results={results} />
    </section>
  );
}
