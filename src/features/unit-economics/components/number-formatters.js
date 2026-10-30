export const formatMoney = (value, digits = 0) => value == null
  ? '—'
  : new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

export const formatNumber = (value, digits = 1) => value == null
  ? '—'
  : new Intl.NumberFormat('es-CR', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

export const formatRatio = (value) => value == null ? '—' : `${formatNumber(value, 2)}x`;
