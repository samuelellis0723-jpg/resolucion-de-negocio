# Sol de Casa · ficha de growth · Parte 2

**Caso educativo; proyecciones y registros de interfaz: SIMULADO.** Referencias: [plan de Parte 2](plan-parte-2-sol-de-casa.md) y [modelo financiero auditado de Parte 1](sol-de-casa-nivel-1-modelo.md).

**Ciclo dibujado**

```text
Familia instalada → ve ahorro → comparte enlace → vecino calcula → solicita
        ↑                                               ↓
nuevo hogar ve su ahorro ← venta cerrada ← visita realizada ← agenda
```

**Fuga actual.** De 100 visitas web, 14 abren el formulario y 6 lo envían: **86 % se pierde antes de abrirlo**. La tarjeta pone el ahorro al principio y pide datos después del cálculo. La métrica semanal es **hogares activos que ven o abren compartir su ahorro ÷ hogares invitados**, junto con leads referidos trazables, visitas realizadas y cierres. Abrir WhatsApp no equivale a enviar un mensaje.

**Prueba A/B [SUPUESTO].** Asignar al azar 25 familias a la experiencia y 25 al proceso actual durante 30 días. Meta direccional: **4 leads referidos trazables** entre las 25 tratadas [SUPUESTO], comparados con el control. Contramétrica: **asistencia a visitas ≥90 %**; además, CAC referido ≤$300 por venta y agendas dentro de capacidad. El tamaño de prueba sirve para aprender, no para afirmar causalidad.

**Costo y capacidad.** Con 45 % de cierre sobre visitas realizadas, una venta requiere `1 ÷ 0,45 = 2,222…` visitas. A $60 por visita son **$133,33 por venta**; quedan **$166,67** para premios bajo el tope de $300. Los incentivos propuestos suman `$15 ÷ 0,45 + $50 = $83,33` por venta [SUPUESTO]. **CAC referido proyectado = $216,67**, con redondeo solo al presentar. El CAC pagado combinado del escenario «Hoy» de Parte 1 es **$620,59**; incluye anuncios y visitas realizadas, mientras el referido proyectado incluye visitas y premios. Son bases diferentes, no un resultado observado del piloto.

| Evento | Premio [SUPUESTO] | Regla |
| --- | ---: | --- |
| Compartir, solicitar o agendar | $0 | Solo avance |
| Visita realizada | $15 para quien refirió | Una vez por visita |
| Venta cerrada | $50 para el nuevo cliente | Una vez por cierre |

**Leads para 50 visitas adicionales.** Si 95 % llega a contacto, 85 % agenda y 90 % asiste, `50 ÷ (0,95 × 0,85 × 0,90) = 68,8`: se necesitan **69 leads** aproximadamente. Para sostener 50 visitas al mes durante dos meses, **138 leads**. La capacidad base del caso es 100 visitas mensuales y la proyección pagada actual usa 97,49; comprobar plazas reales antes de agendar referidos.

| Cuadrante | Canal en 90 días | Decisión y medida |
| --- | --- | --- |
| Alto potencial / bajo costo marginal | Tarjeta y mensaje postinstalación [SUPUESTO] | Probar con 25 familias; medir leads, visitas y CAC |
| Alto impacto / alto costo | Meta y Google pagados | Optimizar CAC por canal y capacidad |
| Complemento / costo bajo esperado [SUPUESTO] | Publicación orgánica con permiso | Apoyar tarjetas; atribuir enlaces |
| Impacto y costo por validar | Letreros de barrio | Repetir en pequeño; medir costo y cierres |

**Error de IA documentado, originado en Parte 1.** El [registro original](../marckdowns/en-que-se-equivoco-o-nos-confundio-la-ia.md) mostró **760 leads, 25,63 ventas y CAC $546,24** en «Hoy», con 600 leads Meta y 160 Google aunque los históricos eran 500 y 100. La interpolación usaba el tramo alto hacia atrás, algunas tasas Google apuntaban a Meta y el total de egresos se sumaba a sí mismo. Se corrigieron el orden de interpolación, las referencias por canal y el rango de egresos. El [modelo revisado](sol-de-casa-nivel-1-modelo.md) usa 500 y 100 leads y obtiene CAC pagado combinado $620,59. Este error pertenece al trabajo de Parte 1; no se atribuye a pruebas de esta interfaz.
