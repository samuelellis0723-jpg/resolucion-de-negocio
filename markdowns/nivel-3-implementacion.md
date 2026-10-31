# Sol de Casa · Implementación del Nivel 3

## Alcance

El simulador React se agrega en `/simulador-caja`. La landing, `/calculadora`, el formulario local y `nivel-2-autonomo.html` conservan sus rutas y función. Las conversiones, prioridades de capacidad e interpolación usan `SolDeCasaModel.calculateModel` de Nivel 2; la proyección de caja consume las visitas y ventas de ese modelo en cada mes. La agencia teórica configura un CPL constante en el canal de Meta del modelo compartido.

La aplicación muestra cinco escenarios en paralelo: plan actual, agencia teórica ($8.000 en Meta a $8 CPL), agencia histórica ($8.000 en Meta con leads históricos), plan propio con filtro y técnico adicional y plan propio con filtro sin técnico. Los montos de pauta, modo de leads de Meta, retención, tasas de Meta y contratación se editan en el panel. El histórico de Google sigue la interpolación y su tope de 160 leads; al superar la última inversión de la tabla, el modelo mantiene el último dato histórico.

## Datos del caso y supuestos

Precios, porcentajes de cobro, costos de equipos/instalación/comisión, visitas, capacidad base, costos fijos, caja inicial, piso de caja y ventas del mes cero proceden del caso. La batería no entra en la caja. Las tasas de Google y el costo por visita se comparten con el Nivel 2.

| Entrada | Valor inicial | Tratamiento |
| --- | ---: | --- |
| CPL Meta teórico | $8 | **[SUPUESTO]** editable; únicamente en modo de CPL constante. Contrasta 1.000 leads teóricos a $8.000 con los 840 históricos. |
| Filtro de leads Meta del plan propio | Retención 80 % | **[SUPUESTO]** editable; reduce leads Meta antes de aplicar el funnel. |
| Tasas Meta del plan propio | 80 % / 40 % / 75 % / 22 % | **[SUPUESTO]** editable; contacto, agenda, visita, cierre. Cambia visitas y ventas esperadas. |
| Repetición de la pauta por 24 meses | Mismo presupuesto cada mes | **[SUPUESTO]** visible en pantalla; las inversiones mensuales de cada canal se editan. Mantenerlas constantes hace que el total no disminuya después del mes 18. |
| Plan propio de referencia | Meta $4.800, Google $4.000, un técnico | Niveles documentados en el Nivel 1; el costo de técnico se paga desde el mes elegido y sus 50 visitas empiezan el mes siguiente. El mes de contratación inicial es 1, editable. |
| Segundo plan propio | Meta $4.000, Google $4.000, sin técnico | Compara la mejora de respuesta/filtro con capacidad base; la mejora de tasas y retención conserva la etiqueta de supuesto. |

El modelo aplica los porcentajes de conversión del caso a cada mes de pauta. Repetir la misma demanda, tasas y presupuesto durante dos años no es un dato histórico ni una promesa. Las cantidades fraccionarias de leads, visitas y ventas representan expectativas del embudo.

## Funnel y capacidad

Por escenario y mes, el simulador construye las entradas del mismo `calculateModel` compartido. Leads, contactos, agendas, visitas solicitadas, visitas realizadas y ventas siguen las fórmulas de [la implementación del Nivel 2](nivel-2-implementacion.md). Si no alcanza la capacidad, Google se atiende primero y Meta recibe el remanente. Solo las visitas realizadas generan ventas.

Los técnicos extra se cargan desde su mes de contratación. La capacidad usa `técnicos contratados antes del mes actual × 50`; por tanto, contratar en el mes 1 supone el costo de $1.800 en ese mes y aumenta la capacidad de 100 a 150 desde el mes 2. El control limita a dos técnicos extra. El costo se conserva en todos los meses desde la contratación.

## Fórmulas de caja

Para el mes `t`, `ventas_(t−1)` comienza en las 22 ventas del mes cero. La caja inicial de $12.000 se suma una vez como saldo de apertura del mes 1.

```text
Entradas_t = $6.500 × 50 % × (ventas_t + ventas_(t−1))
           = $3.250 × ventas_t + $3.250 × ventas_(t−1)

Equipos y comisión_t = $6.500 × (55 % + 3 %) × ventas_t
                     = $3.770 × ventas_t
Instalación_t = $6.500 × 17 % × ventas_(t−1)
               = $1.105 × ventas_(t−1)
Técnicos_t = $1.800 × técnicos ya contratados en t

Salidas_t = $3.770 × ventas_t + $1.105 × ventas_(t−1)
          + $60 × visitas_realizadas_t + anuncios_t + $18.000
          + $1.800 × técnicos ya contratados en t
Caja final_t = caja inicial_t + entradas_t − salidas_t
Caja inicial_(t+1) = caja final_t
```

La fórmula de caja preserva capital de trabajo y calendario de pagos; no es contribución ni CAC. La contribución unitaria permanece en $1.625 y CAC real es `(anuncios + $60 × visitas realizadas) / ventas`, como en Nivel 2. Los costos fijos, inventario pagado al firmar y desfase de cobro no se suman al CAC. La proyección no incluye batería por falta de calendario de cobros y pagos.

### Reconciliación de mes 1 · plan actual

El modelo calcula ventas M1 de 22,31625; usa las 22 ventas de M0 para el segundo cobro y el pago de instalación.

```text
Entradas = $3.250 × (22,31625 + 22) = $144.027,8125 → $144.027,81
Salidas = $3.770 × 22,31625 + $1.105 × 22
        + $60 × 97,4875 + $8.000 + $18.000
        = $140.291,5125 → $140.291,51
Caja final = $12.000 + $144.027,8125 − $140.291,5125
           = $15.736,30
```

Los cálculos internos conservan centavos y fracciones; el redondeo se aplica solo al presentar importes. Caja inicial y las 22 ventas del mes cero se incorporan una sola vez.

## Controles y lectura

La tabla contiene una fila por mes y escenario con inversión por canal, leads brutos y retenidos de Meta, leads de Google, visitas solicitadas/realizadas, capacidad, ventas, entradas, salidas y caja final. El filtro permite ver todos o un escenario. Los gráficos comparan caja con la referencia de $5.000 y visitas realizadas con capacidad. El resumen informa saldo mínimo y mes, caja del mes 24, ventas acumuladas y dos controles separados:

- `pisoCumplido`: el saldo de apertura y todos los cierres mensuales se mantienen en al menos $5.000. La cifra “caja mínima · mes” es el cierre mínimo entre M1 y M24; el saldo inicial también participa en la validación del piso.
- `pautaCumplida`: la inversión total del mes 19 en adelante no queda por debajo de la inversión del mes anterior.
- `factible`: ambos controles se cumplen. La etiqueta solo reporta estas reglas del encargo; no garantiza que las ventas ocurran.

Como la pauta mensual permanece constante en el horizonte, la regla de no reducción desde M19 pasa automáticamente; las cifras mensuales siguen visibles para auditarlo. Un escenario que cae bajo $5.000 se marca “No cumple” y no se describe como factible. El pitch deja elegir el escenario a presentar y explica sus hipótesis y riesgos; no llama “óptimo” a ningún plan.

## Controles reproducidos

| Escenario inicial | Caja mínima y mes | Caja M24 | Ventas acumuladas | Piso | Pauta desde M19 |
| --- | ---: | ---: | ---: | --- | --- |
| Plan actual | $15.736,30, mes 1 | $117.273,39 | 535,59 | Cumple | Cumple |
| Agencia teórica | −$45.420, mes 24 | −$45.420 | 432,00 | No cumple | Cumple |
| Agencia histórica | −$60.897,82, mes 24 | −$60.897,82 | 419,13 | No cumple | Cumple |
| Plan propio con técnico | $9.169,27, mes 2 | $472.498,54 | 855,08 | Cumple | Cumple |
| Plan propio sin técnico | $14.096,92, mes 1 | $219.162,04 | 604,30 | Cumple | Cumple |

El plan propio con técnico se contrata en M1: durante M1 opera con 100 visitas y paga $1.800; desde M2 ofrece capacidad 150. Desde M2 el embudo compartido coincide con la referencia de Nivel 2: 36,08253 ventas esperadas y 149,5615 visitas realizadas. En M1 el límite base de 100 reduce ventas a 25,179 y la caja cierra en $11.496,92. Las agencias tienen valores esperados negativos de caja a M24 y no se presentan como factibles, aunque su primer mes cierre sobre el piso.

Las proyecciones a 24 meses son sensibilidad mecánica a las entradas, no una serie temporal observada. La caja no incorpora crédito, intereses, impuestos, cuentas por cobrar vencidas u otros egresos no incluidos en el caso. Para evaluar financiamiento real se requieren calendarios reales de instalación/cobro, ventas ejecutadas, costos, obligaciones y liquidez disponible.
