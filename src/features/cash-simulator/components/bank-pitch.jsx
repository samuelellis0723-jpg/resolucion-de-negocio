import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';

export function BankPitch({ results, selectedId, onSelect }) {
  const selected = results.find((result) => result.id === selectedId) ?? results[0];
  const plan = selected.plan;
  const feasible = selected.feasible;

  return (
    <section className="bank-pitch" aria-labelledby="bank-pitch-title">
      <div className="bank-pitch-head">
        <div><p className="cash-kicker">Guion para conversar con el banco</p><h2 id="bank-pitch-title">Dos minutos, con los supuestos a la vista</h2></div>
        <label className="cash-field"><span>Escenario del pitch</span><select onChange={(event) => onSelect(event.target.value)} value={selected.id}>{results.map((result) => <option key={result.id} value={result.id}>{result.label}{result.feasible ? ' · cumple' : ' · no cumple'}</option>)}</select></label>
      </div>
      <p className={`pitch-verdict ${feasible ? 'pitch-verdict--pass' : 'pitch-verdict--fail'}`}>
        {feasible ? 'Este escenario supera los dos controles del simulador.' : 'Este escenario no conserva el piso de caja o incumple la regla de pauta; no se presenta como factible.'}
      </p>
      <div className="pitch-copy">
        {selected.id === 'own-with-tech' || selected.id === 'own-without-tech' ? (
          <>
            <p>“Quiero presentar un plan de crecimiento controlado para Sol de Casa, un caso ficticio de instalaciones solares. En el escenario seleccionado, la pauta mensual es {formatMoney(plan.metaInvestment)} en Meta y {formatMoney(plan.googleInvestment)} en Google. El filtro retiene {formatNumber(plan.metaLeadRetention, 0)} % de los leads de Meta [SUPUESTO]; también son [SUPUESTO] las tasas de Meta de {formatNumber(plan.metaRates.contact, 0)} % contacto, {formatNumber(plan.metaRates.booking, 0)} % agenda, {formatNumber(plan.metaRates.visit, 0)} % visita y {formatNumber(plan.metaRates.close, 1)} % cierre, pendientes de validar en operación.</p>
            <p>El modelo parte de $12.000 de caja y 22 ventas en el mes cero. Cobra 50 % al firmar y 50 % al completar la instalación el mes siguiente; reconoce equipos y comisión al firmar, e instalación al mes siguiente. {plan.extraTechnicians > 0 ? `Contrataríamos ${plan.extraTechnicians} técnico(s) extra en el mes ${plan.technicianHireMonth}: su costo empieza ese mes y las 50 visitas adicionales por técnico empiezan al siguiente.` : 'El plan conserva la capacidad base de 100 visitas mensuales.'} En 24 meses, el saldo mínimo es ${formatMoney(selected.minimumCash, 2)}, en el mes ${selected.minimumCashMonth}; el saldo del mes 24 es ${formatMoney(selected.endingCash, 2)}.</p>
          </>
        ) : (
          <>
            <p>“Quiero comparar una alternativa de adquisición para Sol de Casa, un caso ficticio de instalaciones solares. El escenario destina {formatMoney(plan.metaInvestment)} al mes a Meta y {formatMoney(plan.googleInvestment)} a Google. {plan.leadMethod === 'constant-cpl' ? `El cálculo usa CPL de ${formatMoney(plan.assumedCpl)} constante, una hipótesis comercial que debe comprobarse; el histórico de Meta a esa inversión genera menos leads.` : 'Los leads se estiman por interpolación del historial de inversión y leads del caso.'}</p>
            <p>El flujo parte de $12.000 de caja y 22 ventas del mes cero. Respeta los cobros por firma e instalación, los pagos de equipos, comisión e instalación en sus meses correspondientes y atiende Google primero si falta capacidad. A 24 meses, el saldo mínimo es ${formatMoney(selected.minimumCash, 2)}, en el mes ${selected.minimumCashMonth}, y el saldo final sería ${formatMoney(selected.endingCash, 2)}.</p>
          </>
        )}
        <p>La proyección no garantiza ventas: el embudo fraccionario es una expectativa matemática, no unidades comprometidas. Excluye batería porque faltan fechas de cobro y pago; no incorpora financiamiento, impuestos ni cambios de costos fuera de los datos proporcionados. Antes de decidir, validaría las tasas del filtro, la capacidad de instalación y el calendario real de caja con datos observados. Este escenario es una comparación preliminar, no se describe como óptimo.”</p>
      </div>
      <p className="pitch-data-note">Ventas acumuladas estimadas en el escenario: {formatNumber(selected.cumulativeSales, 2)}. La proyección mantiene la inversión mensual constante, incluida desde el mes 19.</p>
    </section>
  );
}
