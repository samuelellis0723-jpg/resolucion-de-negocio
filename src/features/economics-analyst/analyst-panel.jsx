import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import modelSource from '@/features/unit-economics/unit-economics-model.js?raw';
import { formatMoney, formatNumber } from '@/features/unit-economics/components/number-formatters.js';
import { ANALYST_CONTRACT } from './analyst-contract.js';
import { createAnalystContext } from './analyst-context.js';
import { requestAnalyst } from './analyst-service.js';
import './analyst-panel.css';

export function AnalystPanel({ inputs, result }) {
  const questionId = useId();
  const controllerRef = useRef(null);
  const [sessionId] = useState(() => globalThis.crypto?.randomUUID?.() ?? `sdc-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [answer, setAnswer] = useState('');
  const signature = JSON.stringify(inputs);
  const isStale = snapshot && signature !== snapshot.signature;

  useEffect(() => () => {
    const controller = controllerRef.current;
    controllerRef.current = null;
    controller?.abort();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');
    setError('');
    setAnswer('');
    try {
      const context = createAnalystContext(inputs, result, modelSource);
      setSnapshot({ signature, label: ANALYST_CONTRACT.scenarios[context.scenario], capturedAt: context.capturedAt, question: question.trim() });
      const response = await requestAnalyst({ message: question, sessionId, context }, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setAnswer(response.message);
      setStatus('success');
    } catch (requestError) {
      if (controllerRef.current !== controller) return;
      setError(requestError.message);
      setStatus('error');
    }
  }

  return (
    <section className="analyst-panel" aria-labelledby={`${questionId}-title`}>
      <div className="analyst-heading">
        <div><p className="eyebrow">Lectura del escenario activo</p><h2 id={`${questionId}-title`}>Pregunta al analista.</h2></div>
        <span className="analyst-case-label">Caso ficticio · USD</span>
      </div>
      <p className="analyst-intro">Explica las entradas y resultados de estos controles. Para evaluar otro escenario, ajusta los controles y vuelve a preguntar.</p>
      <dl className="analyst-current-metrics" aria-label="Resultados actuales que acompañan la consulta">
        <div><dt>Ventas esperadas</dt><dd>{formatNumber(result.totals.sales, 2)}</dd></div>
        <div><dt>CAC real combinado</dt><dd>{formatMoney(result.totals.realCac, 2)}</dd></div>
        <div><dt>Resultado operativo mensual</dt><dd>{formatMoney(result.totals.monthlyOperatingResult, 2)}</dd></div>
      </dl>
      <form onSubmit={handleSubmit}>
        <label htmlFor={questionId}>Tu pregunta financiera</label>
        <textarea id={questionId} value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={ANALYST_CONTRACT.maxMessageLength} required rows={3} aria-describedby={`${questionId}-help`} />
        <p id={`${questionId}-help`} className="analyst-help">Por ejemplo: ¿por qué el CPL de Meta es menor pero su CAC real es mayor? Escribe solo sobre el caso; evita nombres, teléfonos y otros datos personales.</p>
        <div className="analyst-actions">
          <button className="button button--dark" disabled={status === 'loading'} type="submit">{status === 'loading' ? 'Consultando…' : 'Consultar escenario actual'}</button>
          {status === 'loading' && <button className="button button--outline" type="button" onClick={() => controllerRef.current?.abort()}>Cancelar</button>}
        </div>
      </form>
      {status === 'loading' && <p className="analyst-status" role="status">El analista está leyendo la instantánea enviada. Puedes seguir usando los controles.</p>}
      {error && <p className="analyst-error" role="alert">{error}</p>}
      {isStale && (answer || status === 'loading') && <p className="analyst-stale" role="status">Los controles cambiaron. Esta consulta corresponde a la instantánea enviada; vuelve a consultar para analizar los valores actuales.</p>}
      {answer && <div className="analyst-answer" aria-live="polite">
        <p className="analyst-snapshot">{snapshot.label} · enviado a las {new Date(snapshot.capturedAt).toLocaleTimeString('es')}</p>
        <p className="analyst-question"><strong>Pregunta:</strong> {snapshot.question}</p>
        <p className="analyst-answer-text">{answer}</p>
      </div>}
      <p className="analyst-footer"><strong>La IA calcula, el equipo decide.</strong> Esta consulta usa resultados operativos de run-rate. Para revisar cobros, pagos y capacitación, abre el <Link to="/simulador-caja">simulador de caja</Link>.</p>
    </section>
  );
}
