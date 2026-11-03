import { useEffect, useRef, useState } from 'react';
import modelSource from '@/features/unit-economics/unit-economics-model.js?raw';
import { ANALYST_CONTRACT } from './analyst-contract.js';
import { createAnalystContext } from './analyst-context.js';
import { requestAnalyst } from './analyst-service.js';
import sunAvatar from './assets/solcito-analista.webp';
import './analyst-panel.css';

const openingMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola, soy el analista de Sol de Casa. Puedo ayudarte a entender los números del escenario que tienes activo. ¿Qué quieres revisar?',
};

export function AnalystPanel({ inputs, result }) {
  const [sessionId] = useState(() => globalThis.crypto?.randomUUID?.() ?? `sdc-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([openingMessage]);
  const [isSending, setIsSending] = useState(false);
  const controllerRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sequenceRef = useRef(0);

  useEffect(() => () => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, isSending, isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  async function handleSubmit(event) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || isSending) return;

    sequenceRef.current += 1;
    const requestId = sequenceRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setDraft('');
    setIsSending(true);
    setMessages((current) => [...current, { id: `user-${requestId}`, role: 'user', text: question }]);

    try {
      const context = createAnalystContext(inputs, result, modelSource);
      const response = await requestAnalyst({ message: question, sessionId, context }, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setMessages((current) => [...current, {
        id: `assistant-${requestId}`,
        role: 'assistant',
        text: response.message,
        meta: `${ANALYST_CONTRACT.scenarios[context.scenario]} · escenario consultado`,
      }]);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setMessages((current) => [...current, {
        id: `error-${requestId}`,
        role: 'assistant',
        text: requestError.message || 'No pude conectar con el analista. Inténtalo de nuevo.',
        isError: true,
      }]);
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setIsSending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function openChat() {
    setIsOpen(true);
    setIsMinimized(false);
  }

  return (
    <div className="analyst-chat">
      {isOpen && (
        <section className={`analyst-chat-window${isMinimized ? ' analyst-chat-window--minimized' : ''}`} role="dialog" aria-labelledby="analyst-chat-title" aria-modal="false">
          <header className="analyst-chat-header">
            <img className="analyst-chat-avatar analyst-chat-avatar--header" src={sunAvatar} alt="" />
            <div className="analyst-chat-identity">
              <h2 id="analyst-chat-title">Analista solar</h2>
              <span><i aria-hidden="true" /> En línea · Sol de Casa</span>
            </div>
            <div className="analyst-chat-window-actions">
              <button type="button" aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'} onClick={() => setIsMinimized((value) => !value)}>{isMinimized ? '□' : '−'}</button>
              <button type="button" aria-label="Cerrar chat" onClick={() => setIsOpen(false)}>×</button>
            </div>
          </header>

          {!isMinimized && (
            <>
              <div className="analyst-chat-caption">Pregúntame por los resultados del escenario actual. La respuesta usa los controles de esta calculadora.</div>
              <div className="analyst-chat-messages" aria-live="polite" aria-relevant="additions text">
                {messages.map((message) => (
                  <div className={`analyst-chat-row analyst-chat-row--${message.role}`} key={message.id}>
                    {message.role === 'assistant' && <img className="analyst-chat-avatar analyst-chat-avatar--message" src={sunAvatar} alt="" />}
                    <div className={`analyst-chat-bubble${message.isError ? ' analyst-chat-bubble--error' : ''}`}>
                      {message.meta && <span className="analyst-chat-meta">{message.meta}</span>}
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="analyst-chat-row analyst-chat-row--assistant">
                    <img className="analyst-chat-avatar analyst-chat-avatar--message" src={sunAvatar} alt="" />
                    <div className="analyst-chat-bubble analyst-chat-typing" role="status" aria-label="El analista está escribiendo"><i /><i /><i /></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="analyst-chat-composer" onSubmit={handleSubmit}>
                <label className="visually-hidden" htmlFor="analyst-chat-input">Escribe tu mensaje al analista</label>
                <textarea
                  id="analyst-chat-input"
                  ref={inputRef}
                  rows={1}
                  maxLength={ANALYST_CONTRACT.maxMessageLength}
                  placeholder="Escribe un mensaje…"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                  required
                />
                <button className="analyst-chat-send" type="submit" aria-label="Enviar mensaje" disabled={!draft.trim() || isSending}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-4 16-4.5-6.5L4 12Z" /><path d="m11.5 13.5 4-4" /></svg>
                </button>
              </form>
              <p className="analyst-chat-footnote">La IA analiza; el equipo decide. No incluyas datos personales.</p>
            </>
          )}
        </section>
      )}

      {!isOpen && (
        <button className="analyst-chat-launcher" type="button" onClick={openChat} aria-label="Abrir el chat del analista" aria-expanded={isOpen}>
          <img className="analyst-chat-avatar analyst-chat-avatar--launcher" src={sunAvatar} alt="" />
          <span className="analyst-chat-launcher-copy"><strong>Analista solar</strong><small>¿Dudas con tus resultados?</small></span>
          <span className="analyst-chat-launcher-arrow" aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}
