import { Link } from 'react-router-dom';
import { useReferralDemo } from '../hooks/use-referral-demo.js';
import { DEMO_REFERRAL_CODE } from '../referral-demo.js';
import { NEW_CLIENT_REWARD, REFERRER_REWARD } from '../referral-store.js';
import { formatSaving } from './share-card.jsx';

const steps = ['Invitación', 'Solicitud', 'Agenda', 'Visita', 'Venta'];
const statusDetails = {
  received: { label: 'Solicitud recibida · SIMULADO', progress: 2 },
  waiting: { label: 'En espera · SIMULADO', progress: 2 },
  scheduled: { label: 'Visita agendada · SIMULADO', progress: 3 },
  completed: { label: 'Visita realizada · SIMULADO', progress: 4 },
  closed: { label: 'Venta cerrada · SIMULADO', progress: 5 },
};

export function MyReferrals() {
  const state = useReferralDemo();
  const requests = state.requests.filter((request) => request.referralCode === DEMO_REFERRAL_CODE).slice().reverse();
  const shareOpens = state.events.filter((event) => event.type === 'share_action_opened' && event.referralCode === DEMO_REFERRAL_CODE).length;

  return (
    <section className="my-referrals page-gutter" id="mis-referidos" aria-labelledby="my-referrals-title">
      <div className="savings-section-heading">
        <div>
          <p className="savings-kicker">Seguimiento · SIMULADO</p>
          <h2 id="my-referrals-title">Mis referidos.</h2>
        </div>
        <p>La acción de compartir se abrió {shareOpens} {shareOpens === 1 ? 'vez' : 'veces'} en este navegador. Abrir WhatsApp no confirma que se haya enviado un mensaje.</p>
      </div>

      {requests.length === 0 ? (
        <div className="my-referrals__empty">
          <p>{shareOpens ? 'Ya abriste la acción de compartir. Cuando un vecino guarde una solicitud de prueba, aparecerá aquí.' : 'Aún no hay solicitudes de prueba. Comparte una cifra simulada para iniciar el recorrido.'}</p>
          <div className="referral-progress" role="progressbar" aria-label="Avance del ciclo de referidos" aria-valuemin="0" aria-valuemax="5" aria-valuenow={shareOpens ? 1 : 0}><span style={{ width: shareOpens ? '20%' : '0%' }} /></div>
          <a className="text-link" href="#compartir-ahorro">Compartir mi ahorro <span aria-hidden="true">↗</span></a>
        </div>
      ) : (
        <div className="my-referrals__list">
          {requests.map((request) => {
            const detail = statusDetails[request.status];
            const rewards = state.events.filter((event) => event.type === 'reward_granted' && event.requestId === request.id);
            const hasReferrerReward = rewards.some((event) => event.rewardFor === 'referrer');
            const hasNewClientReward = rewards.some((event) => event.rewardFor === 'new_client');
            return (
              <article className="my-referrals__item" key={request.id}>
                <div className="my-referrals__item-head">
                  <div><span>Referido de demostración</span><h3>{request.name}</h3></div>
                  <strong>{detail.label}</strong>
                </div>
                <div className="referral-progress" role="progressbar" aria-label={`Avance de ${request.name}`} aria-valuemin="0" aria-valuemax="5" aria-valuenow={detail.progress}><span style={{ width: `${detail.progress * 20}%` }} /></div>
                <ol className="my-referrals__steps">
                  {steps.map((step, index) => <li key={step} className={index < detail.progress ? 'is-complete' : ''}>{step}</li>)}
                </ol>
                {request.status === 'waiting' && <p className="my-referrals__waiting">Interés guardado. Falta capacidad de demostración para agendar; no hay cita confirmada.</p>}
                <div className="my-referrals__rewards">
                  <p>{hasReferrerReward ? `${formatSaving(REFERRER_REWARD)} para quien refirió · habilitado una vez` : `${formatSaving(REFERRER_REWARD)} para quien refirió · pendiente de visita realizada`} <span>[SUPUESTO] · SIMULADO</span></p>
                  <p>{hasNewClientReward ? `${formatSaving(NEW_CLIENT_REWARD)} de descuento para el nuevo cliente · habilitado una vez` : `${formatSaving(NEW_CLIENT_REWARD)} para el nuevo cliente · pendiente de venta cerrada`} <span>[SUPUESTO] · SIMULADO</span></p>
                </div>
                <small>Solicitud {request.id} · código {request.referralCode}</small>
              </article>
            );
          })}
        </div>
      )}
      <p className="my-referrals__note">Compartir, solicitar y agendar solo avanzan el estado. Los descuentos [SUPUESTO] se habilitan después de eventos comprobados en esta simulación.</p>
      <Link className="text-link" to="/panel-andres">Ver panel de Andrés <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
