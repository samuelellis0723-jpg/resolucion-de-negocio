# Sol de Casa · prototipo educativo

Aplicación React/Vite con una landing ficticia, una calculadora financiera de Nivel 2, un simulador de caja a 24 meses y un formulario conectado únicamente a una API JSON local de demostración.

## Primera etapa de referidos

`/mi-ahorro` muestra una familia de demostración con seis meses de ahorro **SIMULADO** desde mayo de 2026. Cada ahorro mensual es el 70 % de una base hipotética; octubre muestra $77 y la suma de mayo a octubre es $441. La familia elige si comparte el ahorro mensual o el acumulado. WhatsApp abre un mensaje preparado, sin afirmar que se haya enviado, y el botón de copia coloca el mismo enlace de invitación en el portapapeles.

`/referidos/sd-7m4q9v2k` presenta la invitación al vecino. El código es opaco y estable para esta demo. Los enlaces compartidos llevan solo el código y el período elegido, y la tarjeta reconstruye la cifra simulada sin mostrar nombre, dirección ni recibo del referente. Los enlaces anteriores, sin período, conservan la invitación general. Los datos y la resolución del código viven en `src/features/referrals/`.

## Segunda etapa de referidos

El vecino introduce primero un importe de luz ficticio. La vista calcula ahorro mensual como importe × 70 %, ahorro anual como ahorro mensual × 12 y recuperación simple como $6.500 ÷ ahorro anual. Todo resultado se marca **ESTIMADO**; el 70 % es un promedio del caso ficticio y el cálculo no incluye otros costos. Por ejemplo, $110 produce $77 al mes, $924 al año y 7,03 años.

Solo después del resultado aparece el formulario de visita de prueba, con nombre ficticio y correo de dominio `.test`. La solicitud es **SIMULADA** y no genera una cita ni contacta a Sol de Casa. Cada envío guarda un identificador, el código de referido, el cálculo y el estado en `localStorage`, bajo `sol-de-casa-referrals-v1`. Un segundo clic o el mismo correo de prueba para el mismo código recupera la solicitud existente; al recargar se muestra su confirmación. Los eventos de compartir, página del vecino, cálculo y solicitud están en la misma capa que agendas, visitas, cierres y recompensas para el panel de Andrés.

La capacidad de esta demo es **una visita agendada por mes y navegador** para poder mostrar ambos estados; es un **SUPUESTO de interfaz**, no la capacidad operativa del caso. Solicitar no ocupa una plaza; agendar sí, y una visita realizada conserva esa plaza del mes. Las solicitudes nuevas sin cupo quedan **En espera · SIMULADO** y conservan el interés. El historial y el cupo pertenecen exclusivamente al navegador de la demo: no se sincronizan entre dispositivos. `sessionStorage` recuerda qué solicitud corresponde a cada pestaña para que una recarga no muestre la confirmación de otro vecino de prueba. El enlace sí puede abrirse en otro dispositivo que tenga acceso al sitio; allí comienza un historial local independiente. Para un uso real harían falta autenticación, datos del inversor, almacenamiento compartido y capacidad administrada por Sol de Casa.

## Cierre de Parte 2

`/mi-ahorro` incluye «Mis referidos», con barra de avance, estado por solicitud y descuentos únicos **[SUPUESTO]**: $15 para quien refirió solo después de visita realizada, y $50 para el nuevo cliente solo después de venta cerrada. `/panel-andres` separa eventos activos **SIMULADOS** de la proyección **SIMULADA** del caso. Sus controles avanzan solicitudes por etapas válidas; el costo activo se calcula con visitas realizadas, recompensas habilitadas y ventas cerradas. Con cero ventas muestra «Sin ventas para calcular». La agenda mensual local bloquea nuevas reservas al agotarse.

Ejecuta `npm run verify:referrals` para comprobar cálculos, rutas, atribución, recarga, duplicados, etapas, premios, CAC y capacidad; `npm run build` compila la aplicación. La [ficha de growth](markdowns/parte-2-growth.md) y el [guion de tres minutos con revisión](markdowns/parte-2-demo-y-revision.md) documentan decisiones y límites.

Para abrir el enlace desde un celular, usa un origen del sitio accesible para ese dispositivo. `127.0.0.1` solo sirve en el dispositivo que ejecuta Vite. Si se publica la compilación, configura el alojamiento para que las rutas de React Router sirvan `index.html` al abrir un enlace directo. En HTTP, el navegador puede pedir copiar el enlace manualmente desde el campo visible.

## Inicio local

Requiere Node.js y npm. Instala las dependencias una vez con `npm install`.

En una terminal, inicia el mock local:

```sh
npm run mock:api
```

En otra terminal, inicia el sitio:

```sh
npm run dev
```

Vite muestra la dirección local. El mock vive en `http://127.0.0.1:3001/solicitudes` y escribe en `db.json`. Solo existe para demostración en desarrollo. No lo despliegues ni publiques y no introduzcas datos sensibles. Las solicitudes no llegan a Sol de Casa ni inician una cotización real.

## Calculadora y HTML autónomo

La ruta `/calculadora` contiene el Nivel 2 interactivo. El HTML autónomo se genera con `npm run build:standalone` en `nivel-2-autonomo.html`; puede abrirse directamente en un navegador y comparte el modelo de cálculo fuente `src/features/unit-economics/unit-economics-model.js`.

`npm run build` construye la app y vuelve a generar el HTML autónomo. La calculadora no usa Google Sheets. También muestra un resultado operativo mensual de run-rate que descuenta anuncios, visitas, costos fijos y técnicos activos; no equivale a una proyección de caja.

## Simulador de caja · Nivel 3

Abre `/simulador-caja` para comparar el plan actual, la agencia teórica, la agencia histórica y dos planes propios durante 24 meses. La tabla y los gráficos aplican los cobros y pagos del caso en sus meses correspondientes. Puedes editar las inversiones mensuales, el CPL teórico, la retención y tasas de Meta de los planes, y el mes y cantidad de técnicos extra. El CPL teórico, el filtro y sus tasas, la contratación y mantener la pauta constante durante 24 meses son **[SUPUESTO]** y se muestran como tales.

El resultado marca si cada escenario conserva el piso de caja de $5.000 y si su inversión mensual cumple la regla de no bajar desde el mes 19. El simulador comparte el embudo del Nivel 2; no representa una oferta de crédito ni garantiza ventas. Lee [la implementación del Nivel 3](markdowns/nivel-3-implementacion.md) para fórmulas, supuestos y controles.

## Documentación del modelo

Consulta la [implementación del Nivel 3](markdowns/nivel-3-implementacion.md), [implementación del Nivel 2](markdowns/nivel-2-implementacion.md), el [modelo auditado](markdowns/sol-de-casa-nivel-1-modelo.md) y la [auditoría](markdowns/auditoria-nivel-1.md).

La [auditoría final](markdowns/auditoria-final-sol-de-casa.md), [sensibilidad](markdowns/sensibilidad-final-nivel-3.md) y [presentación oral](markdowns/presentacion-oral-final.md) reúnen los resultados de la revisión final.

## Analista de unit economics con n8n

La calculadora incluye un panel para consultar sus entradas y resultados activos. El workflow importable está en `n8n/workflows/sol-de-casa-unit-economics-analyst.json`; requiere configurar en n8n una credencial del proveedor y seleccionar un modelo. Copia `.env.example` a `.env.local`, configura la URL de prueba del webhook y reinicia Vite. No se envían datos del formulario de demostración.

Consulta [el contrato, la configuración y las verificaciones del analista](markdowns/analista-unit-economics-n8n.md). `npm run build:analyst-workflow` regenera el JSON y `npm run verify:analyst` comprueba el contrato y las referencias del modelo. La IA calcula, el equipo decide.
