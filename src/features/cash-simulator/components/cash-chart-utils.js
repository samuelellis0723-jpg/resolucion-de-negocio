export const CASH_SERIES_COLORS = ['#176b55', '#b44c35', '#bf8c18', '#31759a', '#7a5b96'];
export const CASH_CHART_WIDTH = 820;
export const CASH_CHART_HEIGHT = 300;
export const CASH_CHART_LEFT = 66;
export const CASH_CHART_RIGHT = 18;
export const CASH_CHART_TOP = 28;
export const CASH_CHART_BOTTOM = 52;

export function xForMonth(month) {
  return CASH_CHART_LEFT + (month / 24) * (CASH_CHART_WIDTH - CASH_CHART_LEFT - CASH_CHART_RIGHT);
}

export function yForValue(value, min, max) {
  return CASH_CHART_HEIGHT - CASH_CHART_BOTTOM
    - ((value - min) / (max - min || 1)) * (CASH_CHART_HEIGHT - CASH_CHART_TOP - CASH_CHART_BOTTOM);
}

export function makeChartPath(points) {
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}
