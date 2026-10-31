import { CASH_SERIES_COLORS } from '@/features/cash-simulator/components/cash-chart-utils.js';

export function CashChartLegend({ results }) {
  return <ul className="cash-chart-legend">{results.map((result, index) => <li key={result.id}><i style={{ '--legend-color': CASH_SERIES_COLORS[index % CASH_SERIES_COLORS.length] }} />{result.label}</li>)}</ul>;
}
