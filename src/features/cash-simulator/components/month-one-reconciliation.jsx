import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';

export function MonthOneReconciliation({ result }) {
  const row = result.monthOne;
  const headroom = row.endingCash - 5000;

  return (
    <section className="month-one" aria-labelledby="month-one-title">
      <div className="month-one-heading"><div><p className="cash-kicker">Antes de proyectar</p><h2 id="month-one-title">La caja del mes 1, paso a paso</h2></div><span className="month-one-proof">Control manual · plan actual</span></div>
      <p>La venta se cobra en dos partes. Mes 1 recibe la mitad de sus ventas y la mitad pendiente de las 22 ventas de mes 0; paga equipos y comisión de ventas nuevas y la instalación de ventas del mes 0.</p>
      <div className="month-one-equation" aria-label="Reconciliación de caja del mes 1">
        <div><span>Caja inicial</span><strong>{formatMoney(12000, 2)}</strong></div>
        <span className="equation-sign" aria-hidden="true">+</span>
        <div><span>Entradas</span><strong>{formatMoney(row.collections, 2)}</strong><small>$3.250 × ({formatNumber(row.sales, 5)} + 22)</small></div>
        <span className="equation-sign" aria-hidden="true">−</span>
        <div><span>Salidas</span><strong>{formatMoney(row.outflows, 2)}</strong><small>Equipos+comisión {formatMoney(row.sales * 3770, 2)} · instalación {formatMoney(22 * 1105, 2)} · visitas {formatMoney(row.realizedVisits * 60, 2)} · anuncios $8.000 · fijos $18.000</small></div>
        <span className="equation-sign" aria-hidden="true">=</span>
        <div className="month-one-ending"><span>Caja final</span><strong>{formatMoney(row.endingCash, 2)}</strong><small>{formatMoney(headroom, 2)} sobre el piso</small></div>
      </div>
      <p className="month-one-check">Control esperado: entradas $144.027,81 · salidas $140.291,51 · caja final $15.736,30. Las pequeñas diferencias solo pueden venir del redondeo al presentar.</p>
    </section>
  );
}
