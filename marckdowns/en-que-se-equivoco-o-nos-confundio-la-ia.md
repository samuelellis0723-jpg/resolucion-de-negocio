# En qué se equivocó o nos confundió la IA

## Error observado y corregido en este trabajo

En la primera versión calculada del libro, el escenario «Hoy» mostró **760 leads, 25,63 ventas y CAC real total de $546,24**. La revisión de detalle mostró 600 leads para Meta a $4.000 y 160 para Google a $4.000, aunque el historial indica 500 y 100. También mostró una fórmula circular en el total de salidas de caja.

**Causa.** La fórmula de interpolación daba prioridad al tramo histórico de inversión más alto y extrapolaba hacia atrás. Además, el funnel de Google estaba enlazado a algunas tasas de Meta. El rango de egresos incluía la propia celda de total, creando la referencia circular.

**Corrección.** Se reordenó la interpolación desde el tramo de menor inversión, se conectaron tasas distintas para cada canal y el total de salidas sumó únicamente sus partidas. La versión final vuelve a 500 leads Meta, 100 Google, 22,316 ventas actuales y caja final de $15.736,30. La fila manual confirma CAC real Meta de $718,13. También se cambió temporalmente la inversión Meta de $4.000 a $2.000: el libro recalculó 280 leads; al restablecer $4.000 volvió a 500.

## Riesgos hipotéticos que el modelo evita

- **Hipotético:** restar teléfonos inválidos además de la tasa de contacto. **Efecto:** duplicar la pérdida de leads. **Regla:** las tasas de contacto ya se aplican por lead.
- **Hipotético:** clasificar la comisión de 3 % dentro del CAC. **Efecto:** confundir costo de servicio con adquisición y omitirla de contribución. **Regla:** se resta de contribución y no se vuelve a sumar al CAC.
- **Hipotético:** presentar CPL Meta teórico de $8 a $8.000 como dato histórico. **Efecto:** ocultar que el histórico entrega 840 leads, no 1.000. **Regla:** ambos escenarios se muestran separados.

No se atribuyen estas tres confusiones hipotéticas a una respuesta previa; se conservan como controles para la siguiente fase.