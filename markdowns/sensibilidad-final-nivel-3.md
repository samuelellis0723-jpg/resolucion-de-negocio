# Sensibilidad final · plan propio con técnico

Fecha: 2026-10-31  
Base comparada: plan propio de caja, Meta $4.800/mes, Google $4.000/mes, retención Meta 80 %, tasas Meta 80/40/75/22, un técnico contratado en M1. El técnico cuesta desde M1; su capacidad extra rige desde M2. La pauta y las conversiones se mantienen constantes 24 meses como **[SUPUESTO]**.

## Método

Se recalculan 24 meses con las mismas ecuaciones de Nivel 3. Se cambia una variable a la vez, manteniendo las demás entradas en su valor base:

```text
Leads Meta retenidos = interpolación histórica de Meta × retención
Visitas = funnel por canal, asignando capacidad primero a Google
Ventas = visitas realizadas × tasa de cierre
Entradas_t = $3.250 × (ventas_t + ventas_(t−1))
Salidas_t = $3.770 × ventas_t + $1.105 × ventas_(t−1)
            + $60 × visitas_realizadas_t + anuncios_t + $18.000
            + $1.800 × técnicos contratados en t
Caja final_t = caja inicial_t + entradas_t − salidas_t
```

La caja mínima reportada es el menor cierre de M1–M24; el control del piso también prueba el saldo inicial de $12.000. Los presupuestos, funnel, calendario de cobro/pago, y la capacidad efectiva se conservan mes a mes; por eso un cambio en ventas altera también la caja del mes siguiente.

## Variables elegidas

1. **Retención del filtro Meta, 80 % ±20 % relativo** → 64 % / 96 %. Es un supuesto explícito del plan: cuantifica leads que se pierden con el filtro.
2. **Cierre Meta, 22 % ±20 % relativo** → 17,6 % / 26,4 %. Es una de las tasas optimizadas **[SUPUESTO]**; afecta directamente ventas y el efectivo cobrado en los meses actual y siguiente.
3. **Pauta Meta $4.800 ±20 %** → $3.840 / $5.760 al mes. Es el nivel presupuestario seleccionado para el plan, no un dato histórico observado en todos los meses. Google permanece en $4.000. El aumento de gasto puede toparse con la capacidad y reducir caja sin agregar visitas atendidas.

Los escenarios bajos/altos son perturbaciones relativas aisladas; no son escenarios conjuntos ni intervalos de confianza.

## Resultados

Base: caja mínima **$9.169,27 en M2**; caja M24 **$472.498,54**. Todas las cifras son USD. Los importes se calculan sin redondeo y se muestran a centavos.

| Cambio aislado | Valor | Caja mínima | Mes mínimo | Caja M24 | Cambio M24 vs. base | Piso de $5.000 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Base | — | $9.169,27 | M2 | $472.498,54 | — | Cumple |
| Retención Meta −20 % | 64 % | $11.496,92 | M1 | $332.569,58 | −$139.928,95 | Cumple |
| Retención Meta +20 % | 96 % | $9.092,80 | M2 | $475.292,04 | +$2.793,51 | Cumple |
| Cierre Meta −20 % | 17,6 % | $7.373,27 | M2 | $297.949,39 | −$174.549,15 | Cumple |
| Cierre Meta +20 % | 26,4 % | $10.118,11 | M1 | $647.047,68 | +$174.549,15 | Cumple |
| Pauta Meta −20 % | $3.840/mes | $12.456,92 | M1 | $385.943,83 | −$86.554,71 | Cumple |
| Pauta Meta +20 % | $5.760/mes | $7.172,80 | M2 | $452.252,04 | −$20.246,49 | Cumple |

## Lectura y riesgo

La conversión de cierre mueve más la caja del mes 24 en esta sensibilidad. Si baja 20 %, el cierre mínimo cae a $7.373,27 aunque siga por encima del piso; el saldo M24 pierde $174.549,15 frente a la base. Es la tasa prioritaria para validar por cohorte antes de comprometer pauta.

El mayor gasto de Meta reduce el saldo final en esta curva: Google tiene prioridad y, con un técnico ya activo, la demanda combinada puede alcanzar el límite de 150 visitas. Gasto adicional que no produce visitas atendidas sí sale de caja. Por eso un CPL menor no garantiza un mejor resultado.

Retención y cierre están correlacionados en la operación real, pero se alteraron por separado para cumplir una sensibilidad *one-at-a-time*. La tabla no estima probabilidades. Como la pauta se mantiene constante en cada variante, todas conservan la regla desde M19; cualquier programación variable tendría que verificar mes a mes que `anuncios_t ≥ anuncios_(t−1)` para `t ≥ 19`. La batería, impuestos, deuda y financiamiento siguen fuera del caso base.
