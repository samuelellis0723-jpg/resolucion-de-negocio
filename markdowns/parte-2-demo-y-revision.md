# Parte 2 · guion de demostración y revisión

## Guion de tres minutos

1. **0:00–0:30.** Mostrar la fuga: 86 de 100 visitas no abren el formulario. Abrir `/mi-ahorro` y distinguir $77 del último mes de $441 acumulados, ambos **SIMULADOS**.
2. **0:30–1:00.** Elegir la cifra, abrir «Compartir mi ahorro», revisar la tarjeta y copiar el enlace. Aclarar que WhatsApp solo prepara el mensaje.
3. **1:00–1:40.** Abrir `/referidos/sd-7m4q9v2k`, escribir $110 ficticios y mostrar $77 mensuales, $924 anuales y 7,03 años **ESTIMADOS** antes del formulario. Guardar la solicitud **SIMULADA**.
4. **1:40–2:30.** En `/panel-andres`, agendar la visita, marcarla realizada y cerrar la venta. Volver a «Mis referidos» para ver el avance y los descuentos únicos de $15 y $50 **[SUPUESTO]**. Mostrar que el CAC activo se calcula con eventos, mientras el proyectado es $216,67.
5. **2:30–3:00.** Agotar el cupo de demostración con otra solicitud ficticia y mostrar «En espera · SIMULADO». Explicar la prueba 25/25 durante 30 días, su contramétrica de asistencia y el límite de $300 por venta.

## Revisión de experiencia

Las cuatro preguntas literales del PDF están **pendientes de lectura**: el archivo no está disponible en el repositorio ni entre los adjuntos accesibles. Mientras llega, la revisión interna comprueba desde la familia que (1) el ahorro mensual se distingue del acumulado y se puede sumar, (2) compartir no significa mensaje enviado; y desde el vecino que (3) el cálculo ESTIMADO precede al formulario y explica sus límites, (4) la confirmación o espera deja claro que no existe una cita real. Esta revisión interna no se presenta como prueba con usuarios.

## Estado de pruebas

`npm run verify:referrals` cubre cálculo de $110, entradas inválidas, código inválido, recarga, envío duplicado, etapas, premios únicos, cero cierres, CAC, capacidad y renderizado de las rutas. `npm run build` comprueba la compilación. La inspección visual en navegador móvil y la revisión por otro equipo siguen pendientes si el servicio de navegador no está disponible; no se atribuyen resultados a ellas.
