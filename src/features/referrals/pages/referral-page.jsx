import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ShareCard, formatSaving } from '../components/share-card.jsx';
import { calculateReferralEstimate, parseMonthlyBill, CASE_AVERAGE_INSTALLATION_COST } from '../referral-calculator.js';
import { createReferralId, resolveReferralCode } from '../referral-demo.js';
import { clearSessionRequest, getRemainingDemoCapacity, getSessionRequest, NEW_CLIENT_REWARD, readReferralState, recordReferralEvent, REFERRAL_STORAGE_KEY, setSessionRequest, submitReferralRequest } from '../referral-store.js';
import { getSharedSaving } from '../savings-demo.js';
import './referrals.css';

const paybackFormatter = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const confirmationDetails = {
  received: { title: 'Solicitud recibida · SIMULADO', description: 'Tu solicitud de prueba quedó registrada. No hay cita confirmada ni contacto real.' },
  waiting: { title: 'En espera · SIMULADO', description: 'La capacidad de demostración está agotada. Conservamos tu interés en espera; no hay cita confirmada ni contacto real.' },
  scheduled: { title: 'Visita agendada · SIMULADO', description: 'La agenda de prueba avanzó. No existe una cita real ni se contactará a este correo ficticio.' },
  completed: { title: 'Visita realizada · SIMULADO', description: 'La visita se marcó como realizada solo para demostrar el recorrido. No ocurrió una visita real.' },
  closed: { title: 'Venta cerrada · SIMULADO', description: 'La venta se marcó como cerrada solo para demostrar el recorrido. No ocurrió una compra real.' },
};

function nextDemoContact() {
  const nextNumber = readReferralState().requests.length + 1;
  return { name: `Vecino de prueba ${nextNumber}`, email: `vecino${nextNumber}@example.test` };
}

function validateContact(name, email) {
  return {
    nameError: name.trim().length < 2 || name.trim().length > 60 ? 'Escribe un nombre ficticio de 2 a 60 caracteres.' : '',
    emailError: !/^[^\s@]+@[^\s@]+\.test$/i.test(email.trim()) ? 'Usa un correo ficticio que termine en .test.' : '',
  };
}

export function ReferralPage() {
  const { codigo } = useParams();
  const [searchParams] = useSearchParams();
  const referral = resolveReferralCode(codigo);
  const sharedSaving = getSharedSaving(searchParams.get('ahorro'));
  const [billInput, setBillInput] = useState('');
  const [billError, setBillError] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [contact, setContact] = useState(nextDemoContact);
  const [contactErrors, setContactErrors] = useState({ nameError: '', emailError: '' });
  const [savedRequest, setSavedRequest] = useState(() => referral ? getSessionRequest(referral.code) : null);
  const [storageError, setStorageError] = useState('');
  const [capacityRemaining, setCapacityRemaining] = useState(getRemainingDemoCapacity);
  const billRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const submissionIdRef = useRef(null);
  const submitLockRef = useRef(false);
  const viewIdRef = useRef(null);
  if (!submissionIdRef.current) submissionIdRef.current = createReferralId();
  if (!viewIdRef.current) viewIdRef.current = createReferralId();

  useEffect(() => {
    if (!referral) return;
    try {
      recordReferralEvent({ id: viewIdRef.current, type: 'referral_opened', referralCode: referral.code });
    } catch {
      setStorageError('El navegador no permite guardar el historial de esta demostración.');
    }
  }, [referral?.code]);

  useEffect(() => {
    if (savedRequest) window.scrollTo(0, 0);
  }, [savedRequest?.id]);

  useEffect(() => {
    if (!referral) return undefined;
    const syncOtherTab = (event) => {
      if (event.key !== REFERRAL_STORAGE_KEY) return;
      setSavedRequest(getSessionRequest(referral.code));
      setCapacityRemaining(getRemainingDemoCapacity());
    };
    window.addEventListener('storage', syncOtherTab);
    return () => window.removeEventListener('storage', syncOtherTab);
  }, [referral?.code]);

  function handleEstimate(event) {
    event.preventDefault();
    const parsed = parseMonthlyBill(billInput);
    if (parsed.error) {
      setBillError(parsed.error);
      setEstimate(null);
      billRef.current?.focus();
      return;
    }
    const nextEstimate = calculateReferralEstimate(parsed.amount);
    setBillError('');
    setEstimate(nextEstimate);
    try {
      recordReferralEvent({
        id: createReferralId(), type: 'estimate_viewed', referralCode: referral.code,
        monthlyBill: nextEstimate.monthlyBill, monthlySaving: nextEstimate.monthlySaving,
      });
    } catch {
      setStorageError('El navegador no permite guardar el historial de esta demostración.');
    }
  }

  function handleRequest(event) {
    event.preventDefault();
    if (submitLockRef.current || savedRequest || !estimate) return;
    const errors = validateContact(contact.name, contact.email);
    setContactErrors(errors);
    if (errors.nameError) { nameRef.current?.focus(); return; }
    if (errors.emailError) { emailRef.current?.focus(); return; }

    submitLockRef.current = true;
    try {
      const { request } = submitReferralRequest({
        id: submissionIdRef.current, referralCode: referral.code,
        name: contact.name, email: contact.email, estimate,
      });
      setSessionRequest(referral.code, request.id);
      setSavedRequest(request);
      setCapacityRemaining(getRemainingDemoCapacity());
      setStorageError('');
    } catch {
      setStorageError('No se pudo guardar la solicitud en este navegador. Inténtalo de nuevo cuando el almacenamiento esté disponible.');
    } finally {
      submitLockRef.current = false;
    }
  }

  function startAnotherDemo() {
    clearSessionRequest(referral.code);
    submissionIdRef.current = createReferralId();
    setSavedRequest(null);
    setEstimate(null);
    setBillInput('');
    setBillError('');
    setContact(nextDemoContact());
    setContactErrors({ nameError: '', emailError: '' });
    setCapacityRemaining(getRemainingDemoCapacity());
    window.scrollTo(0, 0);
  }

  if (!referral) {
    return (
      <section className="referral-page referral-page--invalid page-gutter" aria-labelledby="invalid-title">
        <p className="savings-kicker">Invitación no disponible</p>
        <h1 id="invalid-title">Este código no es válido.</h1>
        <p>Revisa el enlace que recibiste. También puedes conocer el caso educativo desde el inicio.</p>
        <Link className="button button--dark" to="/">Ir al inicio</Link>
      </section>
    );
  }

  return (
    <div className="referral-flow">
      {!savedRequest && <section className="referral-intro page-gutter" aria-labelledby="referral-title">
        <div className="referral-intro__copy">
          <p className="savings-kicker"><span aria-hidden="true" /> Invitación · DEMOSTRACIÓN</p>
          <h1 id="referral-title">Descubre cuánto podrías ahorrar en tu casa.</h1>
          <p>Una familia con paneles compartió esta invitación. Calcula tu ahorro <strong>ESTIMADO</strong> con el 70 % promedio del caso ficticio.</p>
          <a className="referral-intro__jump" href="#calcular-ahorro">Calcular mi ahorro <span aria-hidden="true">↓</span></a>
        </div>
        <div className="referral-intro__card"><ShareCard invitation {...sharedSaving} /></div>
      </section>}

      {!savedRequest && <section className="referral-calculator page-gutter" id="calcular-ahorro" aria-labelledby="estimate-title">
        <div className="referral-calculator__heading">
          <p className="savings-kicker">Primero, tu gasto de luz</p>
          <h2 id="estimate-title">Un número para empezar.</h2>
          <p>Escribe un importe ficticio para esta demostración. No uses un recibo real ni información personal.</p>
        </div>
        <form className="referral-bill-form" onSubmit={handleEstimate} noValidate>
          <label htmlFor="monthly-bill">¿Cuánto pagas de luz al mes? · USD</label>
          <div className="referral-bill-form__controls">
            <div className="referral-bill-form__input-wrap">
              <span aria-hidden="true">$</span>
              <input id="monthly-bill" ref={billRef} type="text" inputMode="decimal" autoComplete="off" value={billInput} onChange={(event) => { setBillInput(event.target.value); setBillError(''); setEstimate(null); }} aria-invalid={Boolean(billError)} aria-describedby={billError ? 'bill-error' : 'bill-help'} />
            </div>
            <button className="button button--sun" type="submit">Ver mi estimación <span aria-hidden="true">→</span></button>
          </div>
          {billError ? <p className="referral-field-error" id="bill-error" role="alert">{billError}</p> : <p className="referral-field-help" id="bill-help">Puedes usar coma o punto para los centavos.</p>}
        </form>

        {estimate && !savedRequest && (
          <div className="referral-results" aria-labelledby="result-title">
            <div className="referral-results__heading">
              <span>Resultado · ESTIMADO</span>
              <h3 id="result-title">Lo que indican estos números.</h3>
            </div>
            <div className="referral-results__grid">
              <div><span>Ahorro mensual</span><strong>{formatSaving(estimate.monthlySaving)}</strong></div>
              <div><span>Ahorro anual</span><strong>{formatSaving(estimate.annualSaving)}</strong></div>
              <div><span>Recuperación simple</span><strong>{paybackFormatter.format(estimate.simplePaybackYears)} años</strong></div>
            </div>
            <p>Aplicamos el 70 % a tu recibo mensual y lo proyectamos a 12 meses. Dividimos el costo de instalación de {formatSaving(CASE_AVERAGE_INSTALLATION_COST)} entre el ahorro anual. Redondeamos las cifras al mostrarlas. <strong>ESTIMADO.</strong> El cálculo excluye otros costos y el resultado real puede variar.</p>
          </div>
        )}
      </section>}

      {estimate && !savedRequest && (
        <section className="referral-request page-gutter" aria-labelledby="request-title">
          <div className="referral-request__heading">
            <p className="savings-kicker">Después de la estimación</p>
            <h2 id="request-title">Solicitar una visita de prueba.</h2>
            <p>Esta solicitud es <strong>SIMULADA</strong>: se guarda solo en este navegador y no crea una cita ni envía datos a Sol de Casa.</p>
            {capacityRemaining === 0 && <p className="referral-capacity">La capacidad de demostración está agotada. Tu interés se guardará <strong>en espera · SIMULADO</strong>.</p>}
          </div>
          <form className="referral-contact-form" onSubmit={handleRequest} noValidate>
            <div>
              <label htmlFor="demo-name">Nombre ficticio</label>
              <input id="demo-name" ref={nameRef} type="text" autoComplete="off" value={contact.name} onChange={(event) => { setContact((current) => ({ ...current, name: event.target.value })); setContactErrors((current) => ({ ...current, nameError: '' })); }} aria-invalid={Boolean(contactErrors.nameError)} aria-describedby={contactErrors.nameError ? 'name-error' : undefined} />
              {contactErrors.nameError && <p id="name-error" className="referral-field-error" role="alert">{contactErrors.nameError}</p>}
            </div>
            <div>
              <label htmlFor="demo-email">Correo ficticio · dominio .test</label>
              <input id="demo-email" ref={emailRef} type="email" autoComplete="off" value={contact.email} onChange={(event) => { setContact((current) => ({ ...current, email: event.target.value })); setContactErrors((current) => ({ ...current, emailError: '' })); }} aria-invalid={Boolean(contactErrors.emailError)} aria-describedby={contactErrors.emailError ? 'email-error' : undefined} />
              {contactErrors.emailError && <p id="email-error" className="referral-field-error" role="alert">{contactErrors.emailError}</p>}
            </div>
            <button className="button button--dark" type="submit">Guardar solicitud simulada <span aria-hidden="true">→</span></button>
          </form>
        </section>
      )}

      {savedRequest && (
        <section className="referral-confirmation page-gutter" aria-labelledby="confirmation-title" role="status">
          <span className="referral-confirmation__mark" aria-hidden="true" />
          <p className="savings-kicker">Estado guardado en este navegador</p>
          <h2 id="confirmation-title">{confirmationDetails[savedRequest.status].title}</h2>
          <p>{confirmationDetails[savedRequest.status].description}</p>
          {savedRequest.status === 'closed' && <p>Descuento de {formatSaving(NEW_CLIENT_REWARD)} para el nuevo cliente habilitado una vez · [SUPUESTO] · SIMULADO.</p>}
          <dl>
            <div><dt>Identificador</dt><dd>{savedRequest.id}</dd></div>
            <div><dt>Código de referido</dt><dd>{savedRequest.referralCode}</dd></div>
            <div><dt>Ahorro mensual · ESTIMADO</dt><dd>{formatSaving(savedRequest.estimate.monthlySaving)}</dd></div>
          </dl>
          <div className="referral-confirmation__actions">
            <button className="button button--sun" type="button" onClick={startAnotherDemo}>Hacer otra prueba</button>
            <Link className="button button--outline" to="/">Volver al inicio</Link>
          </div>
        </section>
      )}

      {storageError && <p className="referral-storage-error page-gutter" role="alert">{storageError}</p>}
    </div>
  );
}
