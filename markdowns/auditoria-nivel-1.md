# Auditoría del Nivel 1 · Sol de Casa

## Alcance

Revisión documental y financiera del Nivel 1, siguiendo el contexto canónico actualizado. Se leyeron `marckdowns/estructuraBase.md`, `marckdowns/reglas.md`, `marckdowns/Bpracticas.md`, `marckdowns/sol-de-casa-contexto-canonico.md` y los tres entregables previos. El Excel `outputs/sol-de-casa-nivel-1/sol-de-casa-nivel-1.xlsx` se consultó únicamente en lectura: tiene pestañas `Supuestos` y `Resultados`, con cálculos enlazados. No se modificaron los originales ni el Excel.

El repositorio no contiene `markdowns/` al inicio de esta revisión; esta carpeta reúne copias revisadas. Las reglas de React aplican a la futura app, pero no hay `package.json`, código JSX/TSX ni estructura React que revisar en este repositorio.

## Resultado de la comprobación

Los resultados reportados para el plan propio sí se derivan de los datos y supuestos del caso. La reconstrucción independiente coincide con las fórmulas del libro:

| Métrica | Reconstrucción | Resultado |
|---|---|---:|
| Meta a $4.800 | Interpolación entre $4.000→500 y $6.000→680 | 572 leads brutos |
| Meta luego del filtro | 572 × 80 % | 457,6 leads |
| Visitas Meta | 457,6 × 80 % × 40 % × 75 % | 109,824 |
| Ventas Meta | 109,824 × 22 % | 24,16128 |
| Google a $4.000 | Histórico | 100 leads |
| Visitas Google | 100 × 85 % × 55 % × 85 % | 39,7375 |
| Ventas Google | 39,7375 × 30 % | 11,92125 |
| Total de visitas | 109,824 + 39,7375 | 149,5615 de capacidad 150 |
| Total de ventas | 24,16128 + 11,92125 | 36,08253 |
| CAC real total | ($8.800 + 149,5615 × $60) / 36,08253 | $492,58 |
| LTV:CAC | $1.625 / CAC real total | 3,30x |

El plan es run-rate desde el segundo mes: se paga el técnico desde que se contrata, pero las 50 visitas adicionales aparecen al mes siguiente. La recomendación debe condicionar la contratación a la demanda y a la caja durante ese primer mes.

## Controles financieros

- Contribución de una instalación: $6.500 × (28 % − 3 %) = **$1.625**. La comisión está en contribución y no se duplica en CAC.
- Hoy: Meta aporta 57,75 visitas y 10,395 ventas; Google, 39,7375 visitas y 11,92125 ventas. Total: **97,4875 visitas** y **22,31625 ventas**, por debajo de capacidad 100.
- CAC real actual: Meta **$718,13**; Google **$535,54**; total combinado **$620,59**. LTV:CAC combinado **2,62x**.
- Agencia teórica: 1.000 leads Meta, 115,5 visitas solicitadas, 100 atendidas por prioridad de canal y **18 ventas**. CAC real **$777,78**.
- Agencia histórica: 840 leads Meta, 97,02 visitas y **17,4636 ventas**. CAC real **$791,43**.
- CAC de anuncios y visitas por venta también se reconstruyeron por canal: hoy, Meta **$384,80 / 5,56** y Google **$335,54 / 3,33**; plan propio, Meta **$198,66 / 4,55** y Google **$335,54 / 3,33**. En agencia teórica, Meta tiene CAC de anuncios **$444,44** y CAC real **$777,78** tras el límite de capacidad.
- Caja del mes 1 actual: entradas **$144.027,81**; egresos **$140.291,51**; saldo final **$15.736,30**, que supera el piso en **$10.736,30**.
- Batería: contribución de $510 por adhesión; $76,50 esperados por instalación solar solo bajo el supuesto de extrapolar 15 %. Se excluye de la caja porque faltan fechas de cobro y pago.

La tabla de resultados y la fila manual del modelo revisado conservan las fórmulas para reproducir estos controles. Los valores fraccionarios de ventas y visitas son expectativas matemáticas del embudo, no unidades físicas garantizadas.

Payback: se parte de `−CAC real`; el flujo de firma es −$520 y el flujo de instalación/cobro del mes siguiente es +$2.145. Para el CAC real más alto de los escenarios auditados, agencia histórica ($791,43), el acumulado pasa de −$791,43 a −$1.311,43 y luego a +$833,57: cruza cero en el segundo mes del ciclo.

## Hallazgos de documentación y alcance

1. El contexto canónico menciona `sol-de-casa-gauntlet-prompts.md`, pero no se encuentra ese archivo ni `prompts.md` en el repositorio.
2. Los archivos originales están bajo `marckdowns/`; se preservan sin sobrescribir. Los documentos revisados quedan en `markdowns/`.
3. El registro original documenta una misma revisión con 760 leads y sus detalles 600 Meta + 160 Google, además de una fórmula circular. La copia revisada conserva una cita literal de ese registro, su motivo y su corrección; no atribuye a snapshots separados valores de funnel o caja sin respaldo en el registro.
4. La recomendación propia presupone mejora de conversiones y retención del filtro. Son supuestos del caso por validar, no resultados observados. El escenario de técnico es capacidad del segundo mes en adelante.
5. No se construyó el sitio: la actualización del contexto delimita esta revisión al Nivel 1 y al análisis documental. La landing y las calculadoras web quedan para la fase correspondiente.

## Árbitro adversarial · cinco controles

1. **Contribución:** pasa. `6.500 × (28 % − 3 %) = $1.625`; la comisión se resta de contribución, sin incorporar los costos fijos.
2. **CAC real:** pasa. Usa `ads + $60 × visitas realizadas`, no solicitadas. En agencia teórica se limita la visita atendida a capacidad 100 antes de calcular ventas y CAC.
3. **Prioridad de capacidad:** la regla está documentada: Google antes que Meta. Ningún escenario auditado con ambos canales supera capacidad; agencia teórica tiene Google en $0, así que sus 100 visitas atendidas son de Meta. Por eso la prioridad no cambia los resultados de los escenarios dados.
4. **Trazabilidad:** pasa. El modelo separa inputs del caso de los supuestos de respuesta/filtro, permite reconstruir la interpolación y muestra fórmulas para CAC, contribución, caja y payback.
5. **Recomendación por canal:** pasa. Explicita que Meta tiene CPL menor ($8 vs. $40) pero CAC real mayor ($718,13 vs. $535,54), y recomienda probar las mejoras antes de escalar.

## Archivos revisados

- `markdowns/sol-de-casa-nivel-1-modelo.md`
- `markdowns/recomendacion-andres-sol-de-casa.md`
- `markdowns/en-que-se-equivoco-o-nos-confundio-la-ia.md`

