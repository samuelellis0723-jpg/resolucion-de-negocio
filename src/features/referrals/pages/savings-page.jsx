import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShareCard, formatSaving } from '../components/share-card.jsx';
import { MyReferrals } from '../components/my-referrals.jsx';
import { getReferralUrl } from '../referral-demo.js';
import { clearSessionRequest, recordReferralEvent } from '../referral-store.js';
import { accumulatedSaving, demoHousehold, latestSaving, savingsHistory } from '../savings-demo.js';
import './referrals.css';

const monthFormatter = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const shortMonthFormatter = new Intl.DateTimeFormat('es-CR', { month: 'short', timeZone: 'UTC' });

function monthDate(month) {
  return new Date(`${month}-01T12:00:00Z`);
}

function getShareMessage(amount, period, url) {
  return `Hola, te comparto mi ahorro ${period} SIMULADO de ${formatSaving(amount)} en Sol de Casa. Es una demostración basada en el promedio del caso, no una promesa para tu hogar. Conoce la invitación aquí: ${url}`;
}

export function SavingsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mensual');
  const [copyStatus, setCopyStatus] = useState('');
  const [whatsAppStatus, setWhatsAppStatus] = useState('');
  const selectedAmount = selectedPeriod === 'mensual' ? latestSaving.saving : accumulatedSaving;
  const referralUrl = getReferralUrl(window.location.origin, demoHousehold.referralCode);
  const shareMessage = getShareMessage(selectedAmount, selectedPeriod, referralUrl);
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopyStatus('Enlace copiado. Ya puedes pegarlo donde quieras.');
    } catch {
      setCopyStatus('No se pudo copiar automáticamente. Selecciona el enlace de abajo para copiarlo.');
    }
  }

  function openShareAction() {
    try {
      recordReferralEvent({ id: crypto.randomUUID(), type: 'share_action_opened', referralCode: demoHousehold.referralCode });
    } catch {
      setCopyStatus('No se pudo registrar esta apertura en el navegador.');
    }
  }

  return (
    <div className="savings-page">
      <section className="savings-hero page-gutter" aria-labelledby="savings-title">
        <div className="savings-hero__heading">
          <p className="savings-kicker"><span aria-hidden="true" /> Mi energía en casa · DEMOSTRACIÓN</p>
          <h1 id="savings-title">Tu ahorro, <em>a la vista.</em></h1>
          <p>Una familia con paneles puede revisar lo que ahorró y decidir qué cifra compartir. Todos los importes de esta pantalla son <strong>SIMULADOS</strong>.</p>
        </div>
        <div className="savings-metrics">
          <article className="savings-metric savings-metric--latest">
            <span>Último mes · {monthFormatter.format(monthDate(latestSaving.month))}</span>
            <strong>{formatSaving(latestSaving.saving)}</strong>
            <small>SIMULADO · 70 % de una base hipotética de {formatSaving(latestSaving.referenceBill)}</small>
          </article>
          <article className="savings-metric savings-metric--total">
            <span>Acumulado desde la instalación · mayo 2026</span>
            <strong>{formatSaving(accumulatedSaving)}</strong>
            <small>SIMULADO · suma de los seis meses mostrados abajo</small>
          </article>
        </div>
        <a className="savings-share-jump" href="#compartir-ahorro" onClick={openShareAction}>Compartir mi ahorro <span aria-hidden="true">↗</span></a>
      </section>

      <section className="savings-history page-gutter" aria-labelledby="history-title">
        <div className="savings-section-heading">
          <div>
            <p className="savings-kicker">Cómo se forma el acumulado</p>
            <h2 id="history-title">Seis meses, una suma clara.</h2>
          </div>
          <p>El ejemplo aplica el 70 % de ahorro promedio indicado en el caso a una base hipotética por mes. No proviene de un inversor ni de recibos reales.</p>
        </div>
        <div className="savings-history__list" role="list" aria-label="Historial de ahorros simulados">
          {savingsHistory.map((entry) => (
            <div className="savings-history__row" role="listitem" key={entry.month}>
              <span>{shortMonthFormatter.format(monthDate(entry.month))} <small>{entry.month.slice(0, 4)}</small></span>
              <span>Base {formatSaving(entry.referenceBill)} × 70 %</span>
              <strong>{formatSaving(entry.saving)}</strong>
            </div>
          ))}
          <div className="savings-history__sum">
            <span>Total SIMULADO</span>
            <strong>{formatSaving(accumulatedSaving)}</strong>
          </div>
        </div>
      </section>

      <section className="savings-share page-gutter" id="compartir-ahorro" aria-labelledby="share-title">
        <div className="savings-share__copy">
          <p className="savings-kicker">Invita con una cifra que elijas</p>
          <h2 id="share-title">Compartir empieza por ti.</h2>
          <p>Elige cuál de tus cifras SIMULADAS irá en el mensaje. La tarjeta es una vista previa; el enlace abre una invitación sin tu nombre, dirección ni recibo.</p>
          <fieldset className="share-choice">
            <legend>Cifra para compartir</legend>
            <label>
              <input type="radio" name="share-period" value="mensual" checked={selectedPeriod === 'mensual'} onChange={() => { setSelectedPeriod('mensual'); setCopyStatus(''); setWhatsAppStatus(''); }} />
              <span>Último mes <strong>{formatSaving(latestSaving.saving)}</strong></span>
            </label>
            <label>
              <input type="radio" name="share-period" value="acumulado" checked={selectedPeriod === 'acumulado'} onChange={() => { setSelectedPeriod('acumulado'); setCopyStatus(''); setWhatsAppStatus(''); }} />
              <span>Acumulado <strong>{formatSaving(accumulatedSaving)}</strong></span>
            </label>
          </fieldset>
          <div className="share-message">
            <span>Mensaje listo para WhatsApp</span>
            <p>{shareMessage}</p>
          </div>
          <div className="share-actions">
            <a className="button button--sun" href={whatsAppUrl} target="_blank" rel="noopener noreferrer" onClick={() => setWhatsAppStatus('WhatsApp abierto. El mensaje aún no se ha enviado.')}>Abrir WhatsApp <span aria-hidden="true">↗</span></a>
            <button className="button button--outline" type="button" onClick={copyLink}>Copiar enlace</button>
          </div>
          <p className="share-status" role="status" aria-live="polite">{copyStatus || whatsAppStatus}</p>
          <label className="share-url-label" htmlFor="referral-url">Enlace de invitación</label>
          <input id="referral-url" className="share-url" value={referralUrl} readOnly onFocus={(event) => event.target.select()} />
          <p className="share-disclaimer">Abrir WhatsApp prepara el mensaje; solo tú decides si lo envías.</p>
        </div>
        <div className="savings-share__preview">
          <span>Vista previa · SIMULADO</span>
          <ShareCard amount={selectedAmount} period={selectedPeriod} />
          <Link to={`/referidos/${demoHousehold.referralCode}`} onClick={() => clearSessionRequest(demoHousehold.referralCode)}>Ver la invitación como vecino <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <MyReferrals />
    </div>
  );
}
