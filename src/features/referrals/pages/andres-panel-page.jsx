import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatSaving } from '../components/share-card.jsx';
import { useReferralDemo } from '../hooks/use-referral-demo.js';
import { DEMO_REFERRAL_CODE } from '../referral-demo.js';
import { CAC_LIMIT, CASE_CLOSE_RATE, CASE_MONTHLY_VISIT_CAPACITY, PART_ONE_PAID_CAC, PART_ONE_PAID_VISITS, VISIT_COST, getActiveReferralMetrics, getProjectedReferralEconomics } from '../referral-analytics.js';
import { advanceReferralRequest, clearSessionRequest, DEMO_VISIT_CAPACITY, getDemoMonth, NEW_CLIENT_REWARD, REFERRER_REWARD } from '../referral-store.js';
import './andres-panel.css';

const countFormatter = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 2 });
const statusLabels = {
  received: 'Solicitud recibida',
  waiting: 'En espera',
  scheduled: 'Visita agendada',
  completed: 'Visita realizada',
  closed: 'Venta cerrada',
};
const eventLabels = {
  share_action_opened: 'Acción de compartir abierta',
  whatsapp_opened: 'Acción de WhatsApp iniciada',
  referral_link_copied: 'Enlace copiado',
  referral_opened: 'Página del vecino visitada',
  estimate_viewed: 'Cálculo visto',
  request_received: 'Solicitud recibida',
  request_waitlisted: 'Solicitud en espera',
  request_reactivated: 'Solicitud reactivada',
  visit_scheduled: 'Visita agendada',
  visit_completed: 'Visita realizada',
  sale_closed: 'Venta cerrada',
  reward_granted: 'Descuento habilitado [SUPUESTO]',
};

function nextAction(request, capacityRemaining) {
  if (request.status === 'waiting') return { target: 'received', label: 'Reactivar solicitud', disabled: capacityRemaining === 0 };
  if (request.status === 'received') return capacityRemaining === 0
    ? { target: 'waiting', label: 'Pasar a espera', disabled: false }
    : { target: 'scheduled', label: 'Agendar visita simulada', disabled: false };
  if (request.status === 'scheduled') return { target: 'completed', label: 'Marcar visita realizada', disabled: false };
  if (request.status === 'completed') return { target: 'closed', label: 'Cerrar venta simulada', disabled: false };
  return null;
}

export function AndresPanelPage() {
  const state = useReferralDemo();
  const [actionMessage, setActionMessage] = useState('');
  const month = getDemoMonth();
  const active = getActiveReferralMetrics(state, month);
  const projection = getProjectedReferralEconomics();
  const metrics = [
    ['Acciones de compartir abiertas', active.shareActionOpens],
    ['Acciones de WhatsApp iniciadas', active.whatsAppOpens],
    ['Enlaces copiados', active.copiedLinks],
    ['Visitas a la página del vecino', active.referralPageVisits],
    ['Cálculos vistos', active.estimates],
    ['Solicitudes guardadas', active.requests],
    ['Visitas agendadas', active.scheduled],
    ['Visitas realizadas', active.visitsCompleted],
    ['Ventas cerradas', active.salesClosed],
    ['Premios habilitados [SUPUESTO]', active.rewards.length],
  ];

  function handleAdvance(request, target) {
    try {
      const result = advanceReferralRequest(request.id, target);
      setActionMessage(`${statusLabels[result.request.status]} · SIMULADO. Solicitud ${result.request.id}.`);
    } catch (error) {
      setActionMessage(error.message);
    }
  }

  return (
    <div className="andres-panel page-gutter">
      <header className="andres-panel__heading">
        <div>
          <p className="savings-kicker">Panel de Andrés · SIMULADO</p>
          <h1>Del enlace a la venta.</h1>
          <p>Los registros activos vienen de los eventos de este navegador. La proyección del caso se muestra aparte y no se suma a esta demo.</p>
        </div>
        <Link className="button button--outline" to="/mi-ahorro">Ver la familia <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="andres-panel__section" aria-labelledby="active-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Datos activos · SIMULADO</p><h2 id="active-title">Lo que ocurrió en esta demo.</h2></div>
        <div className="andres-metric-grid">
          {metrics.map(([label, value]) => <div className="andres-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <p className="andres-panel__caption">Abrir WhatsApp o copiar un enlace registra una intención de compartir. Las visitas realizadas se cuentan al completar la visita. Cada evento y su identificador aparecen al final del panel.</p>
      </section>

      <section className="andres-panel__section andres-panel__economics" aria-labelledby="economics-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Economía activa · SIMULADO</p><h2 id="economics-title">Costo de cada cierre referido.</h2></div>
        <div className="andres-cost-grid">
          <div><span>Visitas realizadas × {formatSaving(VISIT_COST)}</span><strong>{formatSaving(active.visitCost)}</strong></div>
          <div><span>Descuentos habilitados [SUPUESTO]</span><strong>{formatSaving(active.rewardCost)}</strong></div>
          <div><span>Costo referido acumulado</span><strong>{formatSaving(active.totalCost)}</strong></div>
          <div className="andres-cost-grid__cac"><span>CAC referido · costo ÷ ventas cerradas</span><strong>{active.cac === null ? 'Sin ventas para calcular' : formatSaving(active.cac)}</strong></div>
        </div>
        <p className="andres-panel__caption">Fórmula: (visitas referidas realizadas × {formatSaving(VISIT_COST)} + recompensas habilitadas) ÷ ventas referidas cerradas. Límite: {formatSaving(CAC_LIMIT)} por venta.</p>
        {active.cac !== null && active.cac > CAC_LIMIT && <p className="andres-alert" role="alert">El CAC de esta demo excede {formatSaving(CAC_LIMIT)} por venta. No ampliar la prueba con este costo.</p>}
      </section>

      <section className="andres-panel__section" aria-labelledby="capacity-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Agenda del mes {month} · SIMULADO</p><h2 id="capacity-title">Capacidad visible.</h2></div>
        <div className="andres-capacity">
          <div><span>Plazas de demostración [SUPUESTO]</span><strong>{DEMO_VISIT_CAPACITY}</strong></div>
          <div><span>Ya ocupadas este mes</span><strong>{active.bookedThisMonth}</strong></div>
          <div><span>Disponibles para agendar</span><strong>{active.capacityRemaining}</strong></div>
        </div>
        {active.capacityRemaining === 0 && <p className="andres-alert" role="status">Capacidad agotada · SIMULADO. Las solicitudes nuevas quedan en espera y no se agendan más visitas este mes.</p>}
        {active.capacityExceeded && <p className="andres-alert" role="alert">La agenda supera la capacidad de demostración. Revisa los eventos guardados.</p>}
        <p className="andres-panel__caption">Referencia de Parte 1 · SIMULADO: {CASE_MONTHLY_VISIT_CAPACITY} visitas mensuales de capacidad base y {countFormatter.format(PART_ONE_PAID_VISITS)} visitas pagadas esperadas. La diferencia teórica de {countFormatter.format(CASE_MONTHLY_VISIT_CAPACITY - PART_ONE_PAID_VISITS)} no es una agenda confirmada ni se mezcla con el cupo local.</p>
      </section>

      <section className="andres-panel__section andres-panel__controls" aria-labelledby="controls-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Controles de recorrido · SIMULADO</p><h2 id="controls-title">Avanzar sin saltar etapas.</h2></div>
        {state.requests.length === 0 ? <p>Aún no hay solicitudes. Abre la invitación, calcula el ahorro y guarda una solicitud de prueba.</p> : (
          <div className="andres-request-list">
            {state.requests.map((request) => {
              const action = nextAction(request, active.capacityRemaining);
              return <article className="andres-request" key={request.id}>
                <div><strong>{request.name}</strong><span>{statusLabels[request.status]} · SIMULADO</span><small>{request.id} · {request.referralCode}</small></div>
                {action ? <button className="button button--dark" type="button" disabled={action.disabled} onClick={() => handleAdvance(request, action.target)}>{action.label}</button> : <span className="andres-request__done">Recorrido completado</span>}
                {request.status === 'waiting' && action?.disabled && <p>Sin cupo este mes. El interés permanece en espera.</p>}
              </article>;
            })}
          </div>
        )}
        <p className="andres-action-message" role="status" aria-live="polite">{actionMessage}</p>
        <Link className="text-link" to={`/referidos/${DEMO_REFERRAL_CODE}`} onClick={() => clearSessionRequest(DEMO_REFERRAL_CODE)}>Abrir invitación de prueba <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="andres-panel__section andres-panel__projection" aria-labelledby="projection-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Proyección del caso · SIMULADO</p><h2 id="projection-title">Una venta esperada al 45 % de cierre.</h2></div>
        <div className="andres-projection-grid">
          <div><span>Visitas realizadas por venta</span><strong>{countFormatter.format(projection.visitsPerSale)}</strong></div>
          <div><span>Costo de visitas por venta</span><strong>{formatSaving(projection.visitCostPerSale)}</strong></div>
          <div><span>Máximo para premios bajo el tope de $300</span><strong>{formatSaving(projection.rewardBudgetPerSale)}</strong></div>
          <div><span>Premios propuestos por venta [SUPUESTO]</span><strong>{formatSaving(projection.rewardCostPerSale)}</strong></div>
          <div className="andres-projection-grid__total"><span>CAC referido proyectado</span><strong>{formatSaving(projection.projectedCac)}</strong></div>
        </div>
        <p className="andres-panel__caption">1 ÷ {Math.round(CASE_CLOSE_RATE * 100)} % = {countFormatter.format(projection.visitsPerSale)} visitas por venta. Se habilitan {formatSaving(REFERRER_REWARD)} por visita realizada para quien refirió y {formatSaving(NEW_CLIENT_REWARD)} por venta cerrada para el nuevo cliente [SUPUESTO]. Se redondea solo al presentar. Frente al CAC pagado combinado de Parte 1, {formatSaving(PART_ONE_PAID_CAC)} · SIMULADO, esta proyección es menor; son canales y bases diferentes.</p>
      </section>

      <section className="andres-panel__section andres-panel__events" aria-labelledby="events-title">
        <div className="andres-panel__section-heading"><p className="savings-kicker">Rastro de eventos · SIMULADO</p><h2 id="events-title">Cada cifra tiene origen.</h2></div>
        {state.events.length === 0 ? <p>Sin eventos en este navegador todavía.</p> : <ol>
          {state.events.slice().reverse().map((event) => <li key={event.id}>
            <strong>{eventLabels[event.type] ?? event.type}</strong>
            <span>{event.requestId ? `Solicitud ${event.requestId}` : `Código ${event.referralCode}`}{event.type === 'reward_granted' ? ` · ${formatSaving(event.amount)}` : ''}</span>
            <small>{event.id}</small>
          </li>)}
        </ol>}
      </section>
    </div>
  );
}
