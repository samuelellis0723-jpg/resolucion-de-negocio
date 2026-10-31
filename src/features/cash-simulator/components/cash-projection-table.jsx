import { useState } from 'react';
import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';

export function CashProjectionTable({ results }) {
  const [scenarioId, setScenarioId] = useState('all');
  const visibleResults = scenarioId === 'all' ? results : results.filter((result) => result.id === scenarioId);
  const rows = visibleResults.flatMap((result) => result.rows);

  return (
    <section className="cash-panel cash-table-panel" aria-labelledby="cash-table-title">
      <div className="cash-panel-heading">
        <div><p className="cash-kicker">Detalle trazable</p><h2 id="cash-table-title">Las 24 filas de cada plan</h2></div>
        <label className="cash-table-filter"><span>Ver</span><select onChange={(event) => setScenarioId(event.target.value)} value={scenarioId}><option value="all">Todos los escenarios</option>{results.map((result) => <option key={result.id} value={result.id}>{result.label}</option>)}</select></label>
      </div>
      <div className="cash-table-scroll" role="region" aria-label="Proyección de caja por mes y escenario, desplazable" tabIndex="0">
        <table className="cash-month-table">
          <caption>{rows.length} filas: una por mes y escenario · USD salvo conteos</caption>
          <thead><tr><th>Mes</th><th>Escenario</th><th>Meta</th><th>Google</th><th>Leads Meta brutos</th><th>Meta retenidos</th><th>Leads Google</th><th>Visitas pedidas</th><th>Visitas realizadas</th><th>Capacidad</th><th>Ventas</th><th>Entradas</th><th>Salidas</th><th>Caja final</th></tr></thead>
          <tbody>{rows.map((row) => <tr className={row.month === 1 ? 'cash-first-month-row' : ''} key={`${row.scenarioId}-${row.month}`}>
            <td>{row.month}</td><th scope="row">{row.scenarioName}</th><td>{formatMoney(row.metaInvestment)}</td><td>{formatMoney(row.googleInvestment)}</td><td>{formatNumber(row.metaGrossLeads, 2)}</td><td>{formatNumber(row.metaLeads, 2)}</td><td>{formatNumber(row.googleLeads, 2)}</td><td>{formatNumber(row.requestedVisits, 2)}</td><td>{formatNumber(row.realizedVisits, 2)}</td><td>{formatNumber(row.capacity, 0)}</td><td>{formatNumber(row.sales, 2)}</td><td>{formatMoney(row.collections, 2)}</td><td>{formatMoney(row.outflows, 2)}</td><td className={row.endingCash < 5000 ? 'cash-cell--below-floor' : ''}>{formatMoney(row.endingCash, 2)}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="cash-table-note">Los importes usan cifras sin redondear durante el cálculo; solo se redondea su presentación.</p>
    </section>
  );
}
