# Sol de Casa · Modelo financiero de Nivel 1

## Alcance y fuentes

Caso ficticio, cifras mensuales en USD. Se usan los datos del contexto canónico actualizado y el libro `outputs/sol-de-casa-nivel-1/sol-de-casa-nivel-1.xlsx`, consultado solo en lectura. La hoja de Google Sheets corresponde al usuario. Este documento deja fórmulas y resultados auditables; no es una hoja de cálculo.

## Economía por instalación

| Concepto | Cálculo | USD |
|---|---:|---:|
| Precio | Dato del caso | 6.500 |
| Equipos | 6.500 × 55 % | (3.575) |
| Instalación | 6.500 × 17 % | (1.105) |
| Margen bruto | 6.500 × 28 % | 1.820 |
| Comisión | 6.500 × 3 % | (195) |
| Contribución / LTV de una venta | 1.820 − 195 | **1.625** |

Para este caso, LTV significa contribución de una sola venta, sin recompra. El CAC real es `(anuncios + $60 × visitas realizadas) / ventas`; los costos fijos no forman parte del CAC. Los teléfonos inválidos no se restan por separado porque ya están reflejados en contacto por lead.

## Fórmulas del embudo

`Contactos = leads × tasa de contacto`  
`Agendas = contactos × tasa de agenda`  
`Visitas solicitadas = agendas × tasa de visita realizada`  
`Ventas = visitas atendidas × tasa de cierre`  
`Visitas atendidas = MIN(visitas solicitadas, capacidad)`; si falta capacidad, Google tiene prioridad y Meta recibe el remanente.

### Hoy

| Canal | Leads | Contactos | Agendas | Visitas | Ventas | CAC anuncios | CAC real | LTV:CAC | Visitas/venta | Valor de visita |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Meta | 500 | 275 | 82,5 | 57,75 | 10,395 | $384,80 | $718,13 | 2,26x | 5,56 | $232,50 |
| Google | 100 | 85 | 46,75 | 39,7375 | 11,92125 | $335,54 | $535,54 | 3,03x | 3,33 | $427,50 |
| Total | 600 | 360 | 129,25 | 97,4875 | 22,31625 | $358,48 | $620,59 | 2,62x | 4,37 | — |

`Valor de visita = cierre × $1.625 − $60`. El valor total de CAC divide anuncios y costo de visitas combinados entre ventas combinadas; no es el promedio simple de los CAC por canal.

### Escenarios comparados

| Escenario | Leads de Meta + Google | Visitas solicitadas / atendidas | Capacidad | Ventas | CAC real total | LTV:CAC | Resultado mensual después de anuncios, visitas, fijos y técnicos |
|---|---:|---:|---:|---:|---:|---:|---:|
| Hoy: Meta $4.000 + Google $4.000 | 500 + 100 | 97,4875 / 97,4875 | 100 | 22,31625 | $620,59 | 2,62x | $4.414,66 |
| Agencia teórica: Meta $8.000 a CPL $8 | 1.000 + 0 | 115,5 / 100 | 100 | 18 | $777,78 | 2,09x | −$2.750,00 |
| Agencia histórica: Meta $8.000, histórico 840 | 840 + 0 | 97,02 / 97,02 | 100 | 17,4636 | $791,43 | 2,05x | −$3.442,85 |
| Plan propio: Meta $4.800 + Google $4.000, filtro y técnico en run-rate | 457,6 + 100 | 149,5615 / 149,5615 | 150 | 36,08253 | $492,58 | 3,30x | $21.060,42 |

La agencia teórica es Meta $8.000 y Google $0; por tanto, sus 100 visitas atendidas son de Meta y 15,5 visitas solicitadas se pierden por capacidad. Si un escenario combinado rebasa capacidad, se atiende Google primero y luego Meta. Resultado operativo usa contribución menos inversión, visitas, fijos y costo del técnico si aplica. No es saldo de caja.

### Indicadores unitarios de los escenarios

| Escenario/canal | CAC anuncios | CAC real | LTV:CAC | Visitas/venta | Valor de visita | Visitas atendidas / capacidad |
|---|---:|---:|---:|---:|---:|---:|
| Hoy · Meta | $384,80 | $718,13 | 2,26x | 5,56 | $232,50 | 57,75 / 100 |
| Hoy · Google | $335,54 | $535,54 | 3,03x | 3,33 | $427,50 | 39,7375 / 100 |
| Hoy · combinado | $358,48 | $620,59 | 2,62x | 4,37 | — | 97,4875 / 100 |
| Agencia teórica · Meta, capacidad aplicada | $444,44 | $777,78 | 2,09x | 5,56 | $232,50 | 100 / 100 |
| Agencia histórica · Meta | $458,10 | $791,43 | 2,05x | 5,56 | $232,50 | 97,02 / 100 |
| Plan propio · Meta con filtro | $198,66 | $471,39 | 3,45x | 4,55 | $297,50 | 109,824 / 150 |
| Plan propio · Google | $335,54 | $535,54 | 3,03x | 3,33 | $427,50 | 39,7375 / 150 |
| Plan propio · combinado | $243,89 | $492,58 | 3,30x | 4,14 | — | 149,5615 / 150 |

En la agencia teórica aislada (Meta $8.000, Google $0), las 100 visitas atendidas son Meta. Los CAC combinados usan inversión y costo de todas las visitas divididos entre ventas totales. El valor de visita se calcula por canal como `cierre × $1.625 − $60`; para un total combinado con tasas distintas no hay una única tasa representativa.

## Interpolación de leads

Se interpola linealmente entre puntos observados e incluye `$0 → 0`. Para Meta, $4.800 cae entre $4.000 → 500 y $6.000 → 680:

`500 + (4.800 − 4.000) / (6.000 − 4.000) × (680 − 500) = 572 leads`.

El filtro retiene 80 %: `572 × 80 % = 457,6`. Google a $4.000 conserva los 100 leads observados. La agencia teórica es una excepción con CPL constante de $8; la comparación histórica usa 840 leads para Meta a $8.000.

## Plan propio y supuestos

Se eligen dos cambios para el plan: respuesta en menos de cinco minutos con filtro de dueño de casa y recibo mayor a $80; y sumar un técnico. La mejora de funnel y la pérdida de 20 % de leads Meta son **[SUPUESTO]** del caso. Las tasas Meta cambian a 80 % contacto, 40 % agenda, 75 % visita, 22 % cierre. Se aplica interpolación histórica para obtener leads antes del filtro.

- Meta: `457,6 × 80 % × 40 % × 75 % = 109,824 visitas`; `109,824 × 22 % = 24,16128 ventas`.
- Google: `100 × 85 % × 55 % × 85 % = 39,7375 visitas`; `39,7375 × 30 % = 11,92125 ventas`.
- Total: 149,5615 visitas, 36,08253 ventas y CAC real `($8.800 + 149,5615 × $60) / 36,08253 = $492,58`.
- Capacidad: base 100; un técnico extra aporta 50 desde el mes siguiente. Se pagan $1.800 al mes desde contratación. El cálculo $21.060,42 es run-rate con el técnico activo y capacidad 150.

## Batería

Contribución por batería: `$3.000 × (20 % − 3 %) = $510`. Tres adhesiones de veinte dan 15 % observado. Extrapolarlo a clientes futuros es **[SUPUESTO]**; implicaría `$510 × 15 % = $76,50` esperados por instalación solar. No se agrega a contribución base, LTV ni caja porque el contexto no da el calendario de cobros y pagos.

## Caja del mes 1 · plan actual

Saldo inicial: $12.000; ventas mes 0: 22.  
Entradas: `$3.250 × (22,31625 ventas del mes 1 + 22 del mes 0) = $144.027,81`.  
Egresos: `$3.770 × 22,31625 = $84.132,26` (equipos y comisión del mes 1); `$1.105 × 22 = $24.310` (instalación del mes 0); `$60 × 97,4875 = $5.849,25` (visitas); `$8.000` anuncios; `$18.000` fijos. Total: **$140.291,51**.  
Saldo final: `$12.000 + $144.027,81 − $140.291,51 = $15.736,30`, o $10.736,30 por encima del piso.

## Payback unitario

La contribución no equivale al calendario de caja. En la firma se cobran $3.250 y se pagan $3.575 de equipos y $195 de comisión: flujo **−$520**, además del CAC desembolsado. Al instalar el mes siguiente, se cobran $3.250 y se pagan $1.105: flujo **+$2.145**. El CAC real de Meta, Google y los escenarios calculados es menor que la contribución de $1.625; con las reglas de cobro/pago del caso, se recupera al segundo mes del ciclo. No se incluye la batería.

Ejemplo conservador con el CAC más alto de estos escenarios (agencia histórica): el acumulado parte en `−$791,43`; tras el flujo de firma queda en `−$1.311,43`; al cobrar/instalar el mes siguiente suma `$2.145` y queda en **+$833,57**. El cruce de cero ocurre en el segundo mes del ciclo. La caja agregada de la empresa es distinta y se revisa con sus saldos y otros egresos.

