# Parte 2 · guion de demostración y revisión

## Guion de tres minutos

1. **0:00–0:30.** Mostrar la fuga: 86 de 100 visitas no abren el formulario. Abrir `/mi-ahorro` y distinguir $77 del último mes de $441 acumulados, ambos **SIMULADOS**.
2. **0:30–1:00.** Elegir la cifra, abrir «Compartir mi ahorro», revisar la tarjeta y copiar el enlace. Aclarar que WhatsApp solo prepara el mensaje.
3. **1:00–1:40.** Abrir `/referidos/sd-7m4q9v2k`, escribir $110 ficticios y mostrar $77 mensuales, $924 anuales y 7,03 años **ESTIMADOS** antes del formulario. Guardar la solicitud **SIMULADA**.
4. **1:40–2:30.** En `/panel-andres`, agendar la visita, marcarla realizada y cerrar la venta. Volver a «Mis referidos» para ver el avance y los descuentos únicos de $15 y $50 **[SUPUESTO]**. Mostrar que el CAC activo se calcula con eventos, mientras el proyectado es $216,67.
5. **2:30–3:00.** Con el cupo ocupado, enviar otra solicitud ficticia y mostrar «En espera · SIMULADO». Explicar la prueba 25/25 durante 30 días, la asistencia mínima del 90 % y el tope de $300 por venta. Si la prueba queda por debajo de la meta, revisar en qué paso se perdieron vecinos, ajustar ese paso y repetir antes de ampliar.

## Revisión de experiencia

Revisión interna con las cuatro preguntas de la página 5 del PDF.

| Pregunta | Familia que comparte | Vecino que recibe |
| --- | --- | --- |
| ¿Es para mí? | El encabezado presenta el ahorro de una familia que ya tiene paneles. | La invitación ofrece estimar el ahorro de su propia casa. |
| ¿Hace lo que quiero? | Distingue el último mes del acumulado y permite elegir una cifra. | El enlace muestra la cifra compartida y la calculadora entrega su propia estimación antes de pedir datos. |
| ¿Me importa ahora? | Puede consultar y compartir una cifra en el momento. | Con un solo importe obtiene ahorro anual y tiempo de recuperación. |
| ¿Sé cómo lograrlo? | Tiene vista previa, WhatsApp y un enlace copiable. | La pantalla guía de la estimación a la solicitud, con confirmación o espera según la capacidad. |

## Estado de pruebas

`npm run verify:referrals` cubre el cálculo de $110 y montos con centavos, enlaces mensual y acumulado, parámetros inválidos, renderizado con las API de un navegador HTTP, recarga, duplicados, etapas, premios, CAC y capacidad. `npm run build` comprueba la compilación. Una prueba automatizada de la interfaz compilada recorrió la tarjeta, el cálculo, la solicitud, el cierre con dos premios y una segunda solicitud en espera. Quedan pendientes la inspección visual en un celular y la revisión por otro equipo.
