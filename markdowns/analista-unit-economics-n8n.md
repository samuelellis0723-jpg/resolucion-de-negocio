# Analista de unit economics · Sol de Casa

## Alcance

El panel «Pregunta al analista» vive en `/calculadora`, junto a los resultados del Nivel 2. Recibe las mismas props `inputs` y `result` que usa el resumen. Al enviar una pregunta, toma una instantánea de esos valores. La respuesta identifica esa instantánea; si los controles cambian durante la petición o después de ella, aparece un aviso para volver a consultar.

**La IA calcula, el equipo decide.** El modelo financiero existente calcula las métricas; el analista las explica, identifica supuestos y sugiere preguntas para evaluar. El workflow no tiene herramientas para modificar datos, navegar, ejecutar código solicitado por el usuario ni editar los controles.

El alcance de esta integración es el run-rate mensual de la calculadora. No se envían filas ni resultados del simulador de caja. Una pregunta sobre caja, payback o mes de capacitación debe indicar que esa proyección no se incluyó y remitir al simulador. Una pregunta sobre un escenario nuevo debe pedir cambiar los controles y enviar otra consulta.

## Contrato de entrada

POST con `Content-Type: application/json`:

```js
const request = {
  message: 'Explica por qué el CAC real cambia con la capacidad.',
  sessionId: crypto.randomUUID(),
  context: createAnalystContext(inputs, result, modelSource),
};
```

En el panel, `inputs` y `result` proceden de la calculadora activa y `modelSource` es el archivo original importado como texto por Vite. `context` lo genera `createAnalystContext`; no se rellena a mano. La implementación comprobable de sus campos está en `src/features/economics-analyst/analyst-contract.js`.

| Campo | Contenido |
| --- | --- |
| `message` | Pregunta, normalizada con trim, entre 1 y 2.000 caracteres. |
| `sessionId` | Identificador opaco de 8–80 caracteres alfanuméricos, guion o guion bajo, creado al montar el panel. No identifica una persona ni autentica la petición. |
| `context.version` | Versión 1 del contrato. |
| `context.project`, `fictional`, `currency`, `period` | `sol-de-casa`, `true`, `USD`, `monthly-run-rate`. |
| `capturedAt`, `scenario` | Fecha ISO de envío y clasificación `base`, `own` o `custom`, derivada de las entradas del modelo. |
| `inputs` | Precio, margen, comisión, visita, fijos, técnicos, capacidad y batería; inversiones, retención, tasas e históricos numéricos de Meta y Google. |
| `metrics` | Contribución solar y de batería por separado, LTV seleccionado, capacidad, costos operativos, totales y funnel/métricas por canal. Son valores directos de `calculateModel`, sin redondear. |
| `changes` | Ruta, valor base del caso y valor activo de cada entrada editada. Se tratan como `[SUPUESTO]`, no como observaciones nuevas. |
| `rules`, `sources` | Reglas del caso, separación entre run-rate/caja y referencias de código y Markdown. |
| `formulas` | Expresiones extraídas del archivo fuente financiero existente, con su función y variable de origen. No se ejecutan en n8n. |

El contexto se limita a campos financieros permitidos. No se importa el formulario de demostración, su servicio, `db.json`, nombre, correo, teléfono ni información de solicitudes. El texto de la pregunta se transmite a n8n y al proveedor del modelo: la UI pide usar solo datos del caso ficticio y evitar datos personales.

La validación rechaza campos desconocidos, mensajes vacíos, contexto incompleto, tipos incorrectos, números no finitos, técnicos fuera del límite y referencias que no coincidan con el workflow. También comprueba que la etiqueta del escenario y la lista completa de cambios correspondan a las entradas: no admite omitir cambios, duplicarlos ni falsear sus valores base/activos. Los históricos deben coincidir con el modelo actual porque esos controles no son editables en esta calculadora. Los datos base y del preset usados para estas comparaciones se extraen del propio modelo; no se recalculan métricas en n8n.

`null` solo se admite para razones/costos unitarios que el modelo deja indefinidos; no se convierte en cero. El servidor valida formato, referencias y procedencia declarada; no certifica la autenticidad de las métricas numéricas enviadas por un cliente externo. La UI obtiene esas métricas directamente del modelo vigente.

## Respuestas

Éxito HTTP 200:

```json
{ "success": true, "message": "Texto explicativo del escenario recibido." }
```

Error HTTP 400 (solicitud inválida) o 502 (modelo sin configurar, fallo del proveedor o salida vacía/inválida):

```json
{ "success": false, "message": "Descripción segura del problema." }
```

Los errores que llegan al usuario no incluyen trazas, credenciales ni el prompt. La interfaz muestra el texto como texto plano, sin interpretar HTML. También maneja URL ausente/inválida, red/CORS, JSON inválido, cancelación y timeout de 60 segundos. El modelo en n8n tiene timeout de 45 segundos y no reintenta automáticamente.

No hay memoria conversacional ni historial persistido por este panel. `sessionId` permite correlación de peticiones y no se pasa al proveedor. Cada pregunta debe ser autosuficiente y usa su contexto completo actual, lo que evita mezclar entradas de escenarios anteriores. El nodo Basic LLM Chain no conecta memoria ni herramientas de acción.

## Importar y configurar n8n

1. Abre tu instancia local de n8n y usa **Import from File** con `n8n/workflows/sol-de-casa-unit-economics-analyst.json`. El workflow se entrega desactivado, sin credenciales y sin un modelo seleccionado.
2. En **Modelo de lenguaje**, selecciona una credencial **OpenAI API** almacenada en n8n y un modelo disponible para esa cuenta. Ambos son configuración manual deliberada. Nunca copies la clave a React, a `.env` con prefijo `VITE_` ni al JSON exportado.
3. En **Webhook**, conserva POST y la respuesta mediante **Respond to Webhook**. Los orígenes locales permitidos son `http://127.0.0.1:5173` y `http://localhost:5173`; añade el origen exacto si Vite usa otro puerto. CORS no sustituye autenticación.
4. Para probar, selecciona **Test URL** y **Listen for Test Event**. Copia `.env.example` a `.env.local`, coloca esa URL en `VITE_N8N_ANALYST_WEBHOOK_URL` y reinicia `npm run dev`. El modo de prueba de n8n debe estar escuchando en cada prueba. Para uso local repetido, publica/activa el workflow y usa la URL que n8n muestre para ese modo.
5. Abre `/calculadora`, consulta los datos base, cambia controles o carga «Ver plan propio auditado» y vuelve a preguntar. La respuesta debe citar los datos enviados, sin afirmar resultados para escenarios no calculados.

Los archivos `.env` locales están ignorados por Git. `.env.example` contiene únicamente una URL de prueba de localhost. La URL del webhook es pública para quien acceda al frontend: no es un secreto ni un mecanismo de acceso.

Antes de abrir el webhook públicamente o usar datos reales, configura autenticación o un gateway adecuado, límites de peticiones y tamaño, TLS y la política de registros/retención. Las credenciales del proveedor permanecen del lado de n8n. El workflow desactiva el guardado de ejecuciones exitosas, fallidas y manuales en sus ajustes; revisa además la política de tu instancia y proveedor. El mock `json-server` del formulario permanece separado y local.

Documentación oficial de n8n: [Webhook y URLs de prueba](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/), [Basic LLM Chain](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/), [OpenAI Chat Model y credenciales](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatopenai/) y [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/).

## Una sola fuente de cálculo

No se modificó `unit-economics-model.js` ni `cashflow-model.js`. `analyst-context.js` proyecta los resultados recibidos, marca diferencias frente a `DEFAULT_INPUTS` y extrae declaraciones del código financiero importado como texto por Vite. No contiene una segunda implementación de las cuentas.

El workflow es un artefacto generado. Su validador y contrato proceden de `analyst-contract.js`; las fórmulas de referencia se extraen del mismo archivo financiero. Para regenerarlo tras un cambio autorizado de contrato, prompt o modelo:

```sh
npm run build:analyst-workflow
npm run verify:analyst
npm run build
```

La verificación exige que el JSON versionado coincida con su generador. Si el modelo o contrato cambia, regenera e importa nuevamente el workflow para mantener referencias alineadas. Las expresiones se usan para trazabilidad y explicación, no se evalúan desde la petición.

## Verificación y límites

`npm run verify:analyst` comprueba directamente el modelo existente con las referencias base y del plan propio; los valores no forman parte de las respuestas del agente. Comprueba además contexto editado, instantáneas independientes, exclusión de datos ajenos, ceros/razones indefinidas, capacidad reducida con prioridad Google, independencia del CAC frente a fijos/técnicos y batería opcional. Las pruebas inválidas cubren tipos, fechas, históricos, etiquetas y supuestos incoherentes, payload nulo, respuesta vacía y errores saneados, además de timeout y cancelación del cliente. También comprueba el grafo del workflow y su coincidencia con el generador.

Se importó el JSON sin modificar en **n8n 2.41.7**, usando una base temporal aislada. Después se configuró una copia de prueba con una credencial ficticia y un proveedor local simulado. El recorrido HTTP completo comprobó:

- Respuesta 200 con `{ success: true, message }` y contexto editado idéntico al que recibió el proveedor simulado.
- Solicitud inválida rechazada con 400 antes de invocar el modelo.
- Fallo del proveedor convertido a 502 sin filtrar su detalle de error.
- Salida vacía convertida a 502 y preflight CORS desde el origen local permitido.

La prueba usó únicamente datos ficticios y su instancia temporal se detuvo. No se invocó un modelo real ni se utilizaron credenciales del usuario. La calidad de las explicaciones con el modelo seleccionado queda pendiente de probar después de configurarlo manualmente. No había navegador gráfico disponible; el build y las pruebas de contrato no sustituyen una revisión visual e interactiva del panel.

`npm run build` compila la interfaz y genera el HTML autónomo existente. No hay lint o suite de pruebas previa configurada; la verificación añadida usa Node y sus aserciones integradas, sin instalar un framework.

El prompt exige separar CPL, CAC real con visitas realizadas, contribución después de comisión, fijos, batería opcional y run-rate/caja. La respuesta de un modelo probabilístico debe ser revisada por el equipo; este flujo no reemplaza los controles financieros deterministas.
