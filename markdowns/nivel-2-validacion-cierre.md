# Sol de Casa · Validación y cierre del Nivel 2

Fecha de verificación: 2026-10-31  
Rama: `samu`  
Commit revisado: `9bc1645` (`origin/samu`)

## Alcance revisado

Se revisaron el README, el modelo y auditoría de Nivel 1, la recomendación, el registro de errores de IA, la implementación del Nivel 2 y los markdowns de reglas/contexto disponibles. La app conserva la estructura React descrita en el repositorio. La landing está en `/`, la calculadora en `/calculadora` y el modelo financiero compartido vive en `src/features/unit-economics/unit-economics-model.js`; `scripts/build-standalone.mjs` incorpora ese mismo modelo a `nivel-2-autonomo.html`.

El formulario de landing valida nombre, correo, propiedad y recibo, y envía solamente al mock local `http://127.0.0.1:3001/solicitudes`. La interfaz avisa que no transmite solicitudes a una empresa. El formulario no promete cobertura, financiación, garantías ni otros datos ausentes del caso.

## Verificaciones ejecutadas

- `npm run build`: correcto. Vite compiló la app de producción y `build:standalone` generó el HTML autónomo.
- Verificación numérica independiente con Node contra el modelo compartido: base y plan propio coinciden con los controles documentados abajo.
- Control de prioridad con capacidad reducida a 50 visitas: Google retiene sus 39,7375 visitas pedidas y Meta recibe las 10,2625 restantes disponibles.
- Control de interpolación: inversión cero produce cero leads; Google queda en 160 leads al superar su punto de saturación histórico.
- HTTP local: `/`, `/calculadora` y `/nivel-2-autonomo.html` respondieron 200. El endpoint de lectura `GET /solicitudes` respondió 200 y vacío.
- `npm run mock:api` intentó arrancar el mock en el puerto 3001, pero el puerto ya estaba ocupado por un servidor local existente. El endpoint existente respondió a la lectura GET; no se envió un POST para evitar añadir una solicitud ficticia a su base.
- No hay script de pruebas o lint configurado en `package.json`.

No había navegador disponible para automatización o inspección visual (el inventario CUA no reportó apps ni navegadores). Los HTTP 200 confirman que el servidor entrega los documentos, no sustituyen una prueba visual de renderizado o interacción del formulario.

## Controles del modelo reproducidos

Contribución solar por instalación: `$6.500 × (28 % − 3 %) = $1.625`. La comisión se resta en contribución; costos fijos y costo de técnicos no entran al CAC. CAC real incluye visitas realizadas, no las solicitadas. Las ventas se calculan solo desde visitas realizadas y la asignación de capacidad favorece Google.

| Métrica | Caso base | Plan propio auditado |
| --- | ---: | ---: |
| Inversión publicitaria | $8.000 | $8.800 |
| Ventas esperadas | 22,31625 | 36,08253 |
| Visitas realizadas | 97,4875 | 149,5615 |
| Capacidad run-rate | 100 | 150 |
| CAC real combinado | $620,59 | $492,58 |
| LTV:CAC solar | 2,62x | 3,30x |
| Costos fijos | $18.000 | $18.000 |
| Costo técnicos extra activos | $0 | $1.800 |
| Resultado operativo mensual estimado | $4.414,66 | $21.060,42 |

Fórmula del resultado operativo, run-rate: `ventas × $1.625 − anuncios − visitas realizadas × $60 − costos fijos − técnicos extra activos`. Se excluye batería y desfase de caja. En el plan propio, Meta invierte $4.800, retiene 80 % de leads después del filtro y usa tasas 80/40/75/22; Google conserva su inversión y tasas base de $4.000; se modela un técnico extra. El cambio de capacidad empieza el mes posterior a la contratación, por lo que 150 es capacidad de run-rate, no capacidad del mes de contratación.

En el caso base, Meta tiene CPL de $8 y CAC real de $718,13; Google tiene CPL de $40 y CAC real de $535,54. El lead de Meta cuesta menos, pero el cliente adquirido cuesta más. Batería permanece fuera del resultado base. Su posible contribución al LTV continúa siendo una opción separada: adhesión futura de 15 % marcada como **[SUPUESTO]**.

## Dictamen

Las cifras clave, los controles de costos, la prioridad de capacidad y la generación del modelo autónomo concuerdan con el modelo común y los documentos de Nivel 1. No encontré una discrepancia nueva que amerite cambiar cifras o la recomendación existente. No se modificó una hoja de cálculo ni se añadió alcance de Nivel 3. El único límite de validación pendiente es una comprobación visual e interacción real en navegador; este entorno no tenía navegador disponible.
