# Auditoría adversarial del analista de Sol de Casa

Rama revisada: `samu`. Se conservaron los cambios locales de la integración existentes al comenzar la revisión.

## Defectos reproducidos y corregidos

1. **Etiqueta de escenario incoherente:** al enviar las entradas del plan propio con `scenario: "base"`, `validateAnalystRequest` devolvía `valid: true`. Esto podía presentar supuestos editados como datos base. El validador ahora compara las entradas con los datos base y del preset extraídos del modelo existente y rechaza una etiqueta incompatible.
2. **Supuestos omitidos o falsos:** las entradas editadas con `changes: []` también se aceptaban. Ahora se exige una lista completa y sin duplicados, con valor base y activo coherentes con cada entrada. Se rechazan además históricos modificados, que no son controles editables de esta UI. Estas comparaciones verifican procedencia; no ejecutan fórmulas financieras.
3. **Payload nulo sin error comprensible:** `requestAnalyst(null, ...)` producía `TypeError: Cannot read properties of null (reading 'context')`. El servicio ahora deja que la validación responda con el error de contrato. También rechaza una URL de tipo incorrecto con un mensaje comprensible.

La fecha se valida como ISO, tal como la genera el panel. El workflow se regeneró desde su fuente para incorporar las mismas correcciones del contrato.

## Intentos de refutación

| Punto | Evidencia y resultado |
| --- | --- |
| Controles y escenario actuales | La página pasa `inputs` y `result` al panel; el envío construye su instantánea dentro del handler. La prueba cambia inversión y cierre, verifica las métricas nuevas enviadas y que la instantánea anterior no cambie. Se corrigió la procedencia declarada en el webhook. |
| Leads, ventas y visitas | El contexto conserva campos distintos para leads brutos/retenidos, contactos, agendas, visitas solicitadas/realizadas y ventas. Con capacidad 50, Google conserva 39,7375 visitas y Meta recibe 10,2625; la demanda solicitada sigue siendo mayor. |
| CAC real y costos fijos | Aumentar costos fijos y costo mensual del técnico deja CAC y ventas iguales, pero reduce resultado operativo. No se cambió el cálculo. |
| Operación y caja | El panel, el contrato y el prompt identifican run-rate y señalan que no se envía caja. Para capacitación/cobros/pagos se remite al simulador existente. |
| Contexto y datos faltantes | El prompt pide explicar solo las métricas recibidas, marcar supuestos y pedir cambiar controles ante un escenario nuevo. No contiene los resultados base como respuestas fijas. La calidad de una respuesta real de IA sigue pendiente de una credencial y modelo configurados. |
| Workflow | El JSON debe coincidir exactamente con el generador; las conexiones se verifican contra los nombres de nodos. Se entrega inactivo, sin credenciales ni modelo elegido. |
| Carga y errores | Pruebas del servicio cubren URL ausente/inválida, payload nulo/incompleto, red, respuesta inválida/vacía, errores sin trazas, cancelación y timeout. La UI mantiene los controles financieros disponibles y marca una respuesta anterior si cambiaron las entradas. |
| Alcance financiero y formulario | El diff de los modelos financiero/de caja y del formulario mock permanece vacío. Las entradas y métricas se seleccionan por una lista de campos financieros, sin datos del formulario. |
| Configuración y secretos | La documentación explica importación, credencial y modelo manuales, variable VITE solo para URL, CORS, acceso y límites. El workflow no contiene claves; el mock no se conecta al analista. |

## Controles del modelo existente

| Métrica | Datos base | Plan propio auditado |
| --- | ---: | ---: |
| Ventas esperadas | 22,31625 | 36,08253 |
| Visitas realizadas | 97,4875 | 149,5615 |
| CAC real combinado | $620,59 | $492,58 |
| LTV:CAC solar | 2,62x | 3,30x |
| Resultado operativo mensual | $4.414,66 | $21.060,42 |

LTV solar es contribución por una venta ($1.625 en estos dos escenarios); las cifras en «x» corresponden a LTV:CAC. Los controles se obtienen de `calculateModel`, con batería desactivada. Las pruebas adicionales verifican que activarla cambia el LTV elegido y conserva la contribución solar y el resultado operativo solar.

## Verificaciones

- `npm run build:analyst-workflow`: regenera el JSON desde el contrato, las entradas de referencia y las expresiones del modelo original.
- `npm run verify:analyst`: comprueba los controles anteriores, cambios activos, procedencia, errores y el workflow generado.
- `npm run build`: compila React y el HTML autónomo del Nivel 2.
- `git diff --check`: revisión de espacios del diff.

Todos estos comandos pasaron. `git diff --check` solo mostró avisos de conversión LF/CRLF, sin errores de espacios.

Se volvió a importar el JSON corregido en **n8n 2.41.7**, usando datos y configuración temporales aislados. Una copia de prueba se configuró con una credencial ficticia y un proveedor local simulado. Se comprobó por HTTP:

- Éxito 200 y contexto editado idéntico al recibido por el proveedor.
- Entrada inválida, escenario falso y cambios omitidos rechazados con 400, sin llamadas al proveedor.
- Fallo del proveedor y respuesta vacía transformados en 502 sin filtrar el detalle interno.
- Preflight CORS para el origen local permitido.

Durante el primer intento el servidor todavía no había registrado el webhook. La prueba posterior esperó que el propio workflow respondiera a una entrada inválida antes de iniciar las verificaciones; entonces pasó el recorrido completo. La instancia de prueba y el proveedor simulado se detuvieron al finalizar. El JSON entregado sigue inactivo y sin credenciales; requiere seleccionar credencial y modelo en n8n.

La revisión del panel y sus estados es por código y pruebas de servicio; no hay navegador gráfico disponible para confirmar visualmente teclado, foco, carga y cambios de controles. No se usó un modelo real: siguen pendientes la calidad de las explicaciones y la resistencia efectiva a instrucciones adversariales con el modelo que se configure. El prompt revisado exige usar solo el contexto y señalar lo que falta; no constituye una garantía de exactitud de una respuesta probabilística.
