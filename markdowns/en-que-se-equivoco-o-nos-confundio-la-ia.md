# En qué se equivocó o nos confundió la IA

## Error observado en el registro original

El registro conservado en `marckdowns/en-que-se-equivoco-o-nos-confundio-la-ia.md` dice literalmente: **“el escenario «Hoy» mostró 760 leads, 25,63 ventas y CAC real total de $546,24”**. Enseguida documenta el detalle de **600 leads Meta a $4.000** y **160 Google a $4.000**, aunque los históricos del caso dan 500 y 100, respectivamente. El mismo registro afirma que había una fórmula circular en el total de salidas de caja.

**Motivo registrado:** la interpolación priorizaba el tramo de inversión más alto y extrapolaba hacia atrás; algunas tasas de Google estaban enlazadas a Meta; el rango de egresos incluía la celda de total.

**Corrección registrada:** ordenar la interpolación desde el tramo menor, usar referencias de tasas separadas por canal y sumar únicamente partidas de egreso. El registro original reporta que el modelo corregido volvió a 500 leads Meta, 100 Google, 22,316 ventas y caja final de $15.736,30. También conserva esta comprobación: al cambiar Meta de $4.000 a $2.000, el libro recalculó 280 leads; al volver a $4.000, regresó a 500.

No separo estas observaciones en varios errores porque el registro original las presenta dentro de una misma revisión y no conserva más salidas literales que permitan atribuirlas a versiones distintas. Tampoco atribuyo como observados los valores intermedios de funnel o caja que no aparecen en ese registro.

## Comprobación del modelo revisado

La contribución de una instalación es `$6.500 × (28 % − 3 %) = $1.625`. La fila Meta de hoy confirma el CAC real con visitas realizadas: `($4.000 + 57,75 × $60) / 10,395 = $718,13`. Google da `($4.000 + 39,7375 × $60) / 11,92125 = $535,54`. Los controles del modelo y la reconstrucción independiente coinciden.

## Ejemplos hipotéticos, no errores atribuidos

- **Hipotético:** descontar teléfonos inválidos además de la tasa de contacto duplicaría la pérdida, porque las tasas de contacto ya se aplican por lead.
- **Hipotético:** sumar la comisión al CAC y restarla de contribución contaría dos veces la misma comisión. En este caso reduce la contribución y no forma parte del CAC.
- **Hipotético:** presentar el CPL teórico de agencia como histórico confundiría los 1.000 leads estimados a CPL $8 con los 840 leads históricos a $8.000.

