import { formatMoney, formatNumber, formatRatio } from '@/features/unit-economics/components/number-formatters.js';

export function ChannelResultsTable({ channels }) {
  return (
    <div className="table-scroll">
      <table className="results-table">
        <caption>Resultados por canal. El CAC real divide anuncios más visitas realizadas entre ventas.</caption>
        <thead><tr><th scope="col">Canal</th><th scope="col">Leads históricos</th><th scope="col">Leads tras filtro</th><th scope="col">Contactos</th><th scope="col">Agendas</th><th scope="col">Visitas pedidas</th><th scope="col">Visitas realizadas</th><th scope="col">Ventas</th><th scope="col">CPL bruto</th><th scope="col">CAC anuncios</th><th scope="col">CAC real</th><th scope="col">LTV:CAC</th></tr></thead>
        <tbody>
          {['meta', 'google'].map((key) => {
            const channel = channels[key];
            return <tr key={key}>
              <th scope="row"><span className={`channel-dot channel-dot--${key}`} />{channel.name}</th>
              <td>{formatNumber(channel.interpolatedLeads)}</td><td>{formatNumber(channel.leads)}</td><td>{formatNumber(channel.contacts)}</td><td>{formatNumber(channel.bookings)}</td>
              <td>{formatNumber(channel.requestedVisits)}</td><td>{formatNumber(channel.realizedVisits)}</td><td>{formatNumber(channel.sales)}</td>
              <td>{formatMoney(channel.cpl)}</td><td>{formatMoney(channel.adCac)}</td><td>{formatMoney(channel.realCac)}</td><td>{formatRatio(channel.ltvToCac)}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
