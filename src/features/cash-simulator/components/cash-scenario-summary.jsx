import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';

export function CashScenarioSummary({ results, selectedPitchId }) {
  return (
    <section className="cash-panel cash-scoreboard" aria-labelledby="cash-scoreboard-title">
      <div className="cash-panel-heading">
        <div><p className="cash-kicker">Comparación a 24 meses</p><h2 id="cash-scoreboard-title">Qué aguanta la caja</h2></div>
        <span className="cash-scroll-hint">Desliza para comparar</span>
      </div>
      <div className="cash-scoreboard-scroll" role="region" aria-label="Resumen de escenarios, desplazable">
        <table className="cash-scoreboard-table">
          <thead><tr><th>Escenario</th><th>Caja mínima · mes</th><th>Caja mes 24</th><th>Ventas acumuladas</th><th>Piso $5.000</th><th>Regla pauta</th></tr></thead>
          <tbody>{results.map((result) => (
            <tr className={result.id === selectedPitchId ? 'cash-selected-row' : ''} key={result.id}>
              <th scope="row">{result.label}{result.id === selectedPitchId && <span className="cash-pitch-tag">Pitch</span>}</th>
              <td>{formatMoney(result.minimumCash, 2)} <small>· mes {result.minimumCashMonth}</small></td>
              <td>{formatMoney(result.endingCash, 2)}</td>
              <td>{formatNumber(result.cumulativeSales, 2)}</td>
              <td><span className={`cash-status ${result.minimumCashIsMet ? 'cash-status--pass' : 'cash-status--fail'}`}>{result.minimumCashIsMet ? 'Cumple' : 'No cumple'}</span></td>
              <td><span className={`cash-status ${result.adInvestmentNeverDecreasesAfterMonth18 ? 'cash-status--pass' : 'cash-status--fail'}`}>{result.adInvestmentNeverDecreasesAfterMonth18 ? 'Cumple' : 'No cumple'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="cash-interpretation">La caja mínima es el menor cierre entre M1 y M24; el control del piso también revisa los $12.000 iniciales. “Factible” solo significa que conserva el piso y respeta la regla de pauta. No es promesa de ventas ni recomendación automática.</p>
    </section>
  );
}
