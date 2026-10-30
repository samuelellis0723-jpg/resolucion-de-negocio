# Sol de Casa · Implementación del Nivel 2

## Alcance técnico

La app React/Vite sigue `Componentes → Páginas → Rutas → App → main.jsx`, agrupa la landing y el modelo por funcionalidad, usa nombres kebab-case en rutas y archivos, alias `@/` y componentes pequeños por responsabilidad. La landing vive en `/`; la calculadora, en `/calculadora`.

El HTML autónomo `nivel-2-autonomo.html` se construye desde `src/features/unit-economics/unit-economics-model.js` mediante `npm run build:standalone`. La interfaz React y el archivo autónomo llaman a la misma función financiera; no hay una segunda implementación de fórmulas.

## Datos y reglas del modelo

Los valores base se definen en `DEFAULT_INPUTS` en el archivo fuente compartido y se basan en [el modelo financiero del Nivel 1](sol-de-casa-nivel-1-modelo.md): precio $6.500, margen bruto 28 %, comisión 3 %, costo de visita $60, capacidad 100, tasas por canal y puntos de inversión/leads. Los históricos incluyen el punto cero. La interpolación es lineal entre los puntos; Google se mantiene en su máximo de 160 leads después de $8.000, y la calculadora limita el control a $10.000.

Fórmulas en cada canal:

- `leads = interpolación(inversión, histórico del canal)`.
- `contactos = leads × contacto`; `agendas = contactos × agenda`; `visitas pedidas = agendas × visita realizada`.
- `visitas realizadas = MIN(visitas pedidas, capacidad disponible)`.
- Si hay exceso, se asigna capacidad a Google primero y a Meta después. Ventas usan solo visitas realizadas: `visitas realizadas × tasa de cierre`.
- `contribución solar = precio × (margen bruto − comisión)`.
- `CAC anuncios = inversión ÷ ventas`; `CAC real = (inversión + costo visita × visitas realizadas) ÷ ventas`.
- `LTV:CAC = contribución por venta ÷ CAC real`. LTV de base es una sola instalación, según el caso.
- `valor de visita = tasa de cierre × contribución − costo de visita`.

El semáforo señala bajo 1x, de 1x a menos de 3x y 3x o más. En el caso base, Meta tiene CPL $8 y CAC real $718,13; Google tiene CPL $40 y CAC real $535,54. Por eso el CPL menor de Meta no equivale a menor costo de adquisición del cliente. La vista distingue leads históricos interpolados y leads que pasan el filtro; el CPL usa leads brutos.

## Batería

El control de adhesión inicia en 15 %, observado en 3 de 20 clientes. Extrapolarlo al futuro es **[SUPUESTO]**. La batería aporta `$3.000 × (20 % − 3 %) = $510` por adhesión; la contribución esperada se muestra por separado. La casilla para incluirla en LTV:CAC inicia desmarcada, de modo que los controles base sigan reflejando LTV solar de $1.625. No se proyecta caja de batería porque faltan las fechas de cobro y pago.

La capacidad adicional se calcula como 50 visitas por técnico extra activo. Es un modelo de run-rate; cada contratación empieza a aportar capacidad al mes siguiente y cuesta $1.800 al mes desde su contratación. La gráfica conserva una referencia visual de 100 visitas de capacidad base y añade la línea de capacidad efectiva al usar técnicos extra. La calculadora no representa el mes de capacitación como una proyección de caja. El preset «Ver plan propio auditado» carga Meta $4.800, 80 % de retención tras filtro, las tasas supuestas del plan y un técnico extra; no introduce cifras de resultados, que salen del mismo modelo recalculado.

## Landing y formulario de demostración

La landing usa los hechos del caso ficticio: 420 instalaciones, 4,9 estrellas con 210 reseñas, instalación promedio de $6.500 y ahorro promedio indicado de 70 %. El ahorro se presenta como dato reportado, no garantía. No añade cobertura, dirección, teléfono, certificaciones, garantías, financiamiento ni promociones.

El formulario valida nombre, correo, propiedad de vivienda y si el recibo supera $80. Al enviar, hace POST a `json-server` local, colección `solicitudes` en `db.json`. El aviso aclara que los datos quedan solo en esa base de demostración local, no llegan a Sol de Casa y no generan cotización; pide no introducir información sensible y advierte no desplegar el mock. Sin iniciar la API local, el formulario comunica que no pudo guardar.

## Decisiones visuales

Paleta bosque, menta y amarillo solar con tipografías Space Grotesk y DM Sans. La ilustración vectorial de techo/paneles/sol es el gesto distintivo de la landing. La calculadora reserva una columna para entradas y otra para resultados y gráficos SVG accesibles. Los controles tienen etiquetas y unidades visibles, y hay un botón que restaura todas las entradas al caso base.
