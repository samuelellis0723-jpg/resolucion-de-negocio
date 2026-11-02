import { ANALYST_CONTRACT, validateAnalystRequest } from './analyst-contract.js';
import { createAnalystReferenceInputs } from './analyst-context.js';

export async function requestAnalyst(request, options = {}) {
  const endpoint = options.endpoint ?? import.meta.env?.VITE_N8N_ANALYST_WEBHOOK_URL;
  if (endpoint == null || endpoint === '') throw new Error('El analista aún no está conectado. Configura VITE_N8N_ANALYST_WEBHOOK_URL y reinicia Vite.');
  let url;
  try {
    if (typeof endpoint !== 'string' || !endpoint.trim()) throw new Error();
    url = new URL(endpoint);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
  } catch {
    throw new Error('La URL del webhook de n8n no es válida. Usa una URL HTTP o HTTPS sin credenciales.');
  }
  const validated = validateAnalystRequest(request, ANALYST_CONTRACT, request?.context?.formulas, createAnalystReferenceInputs());
  if (!validated.valid) throw new Error(validated.response.message);

  const controller = new AbortController();
  const handleAbort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener('abort', handleAbort, { once: true });
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, options.timeoutMs ?? 60000);

  try {
    const response = await (options.fetchFn ?? fetch)(url.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ message: validated.message, sessionId: validated.sessionId, context: validated.context }),
      signal: controller.signal,
    });
    let payload;
    try { payload = await response.json(); } catch { throw new Error('n8n devolvió una respuesta inválida. Comprueba que el webhook responda con JSON.'); }
    if (!response.ok || payload?.success === false) {
      if (response.status === 400) throw new Error('n8n rechazó el contexto. Comprueba que la interfaz y el workflow usen la misma versión.');
      throw new Error('El analista no pudo responder. Revisa que el workflow esté escuchando y que su modelo y credencial estén configurados.');
    }
    if (payload?.success !== true || typeof payload.message !== 'string' || !payload.message.trim() || payload.message.length > 16000) throw new Error('n8n devolvió una respuesta inválida: se esperaba success y un mensaje de texto.');
    return { success: true, message: payload.message.trim() };
  } catch (error) {
    if (timedOut) throw new Error('El analista tardó demasiado. Puedes volver a consultar; la calculadora sigue disponible.');
    if (controller.signal.aborted) throw new Error('Consulta cancelada.');
    if (error instanceof TypeError) throw new Error('No se pudo conectar con n8n. Revisa la URL, que el workflow esté escuchando y los permisos de origen (CORS).');
    throw error;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', handleAbort);
  }
}
