# Sol de Casa · Modelo financiero de Nivel 1

## Alcance y base

Caso ficticio, moneda USD y periodo mensual. Las fuentes son `sol-de-casa-contexto-canonico.md` y `prompts.md`. El libro contiene `Resultados` y `Supuestos`. Las celdas amarillas de Supuestos son editables; Resultados se calcula desde ellas. No se creó una hoja online.

El LTV se limita a una instalación. Contribución por instalación = $6.500 × (1 − 55 % equipos − 17 % instalación − 3 % comisión) = **$1.625**. El 3 % ($195) reduce contribución y no se agrega al CAC. Los costos fijos se excluyen del CAC real.

## Convenciones del modelo

- El funnel completo ocurre en el mismo mes. Los porcentajes se aplican a leads/contactos/agendas/visitas en secuencia. Los teléfonos inválidos ya quedan dentro de la tasa de contacto y no se restan otra vez.
- Los leads se interpolan linealmente entre los datos históricos, incluido el punto $0 → 0. La agencia teórica usa Meta a CPL constante de $8; el escenario histórico de $8.000 Meta usa los 840 leads observados.
- Las visitas hechas son `MIN(visitas pedidas, capacidad)`. Google recibe capacidad primero; Meta usa el remanente. El CAC real de cada canal es `(ads del canal + $60 × visitas hechas del canal) / ventas del canal`.
- En el escenario propio, filtro/respuesta conserva 80 % de leads Meta y eleva las tasas Meta a 80 % contacto, 40 % agenda, 75 % visita y 22 % cierre. Todos son supuestos del caso, no resultados medidos.
- El plan propio aplica $4.800 Meta y $4.000 Google, y un técnico extra activo. El técnico cuesta $1.800 desde su contratación y aporta 50 visitas de capacidad desde el mes siguiente. El resultado propio es run-rate a capacidad 150; no describe el primer mes de entrenamiento.
- Resultado después de anuncios, visitas, fijos y técnico = contribución solar − anuncios − visitas realizadas × $60 − costos fijos − costo de técnicos extra. No incorpora el calendario de caja, impuestos ni costos no provistos.
- La batería deja $510 de contribución por adhesión. A 15 % de adhesión futura [SUPUESTO: 3/20 pruebas], añade $76,50 esperados por venta solar. No se suma a LTV, resultados base ni caja por falta de fechas de cobro y pago.

## Resultados por escenario

| Escenario | Leads en funnel | Visitas pedidas/hechas | Ventas | CAC real total | LTV:CAC | Resultado tras ads, visitas y fijos |
|---|---:|---:|---:|---:|---:|---:|
| Hoy: Meta $4.000, Google $4.000 | 600 | 97,49 / 97,49 | 22,316 | $620,59 | 2,62x | $4.414,66 |
| Agencia teórica: Meta $8.000 a CPL $8 | 1.000 | 115,50 / 100 | 18,000 | $777,78 | 2,09x | −$2.750,00 |
| Agencia histórica: Meta $8.000, 840 leads | 840 | 97,02 / 97,02 | 17,464 | $791,43 | 2,05x | −$3.442,85 |
| Plan propio: Meta $4.800, Google $4.000, filtro y técnico en run-rate | 557,6 | 149,56 / 149,56 | 36,083 | $492,58 | 3,30x | $21.060,42 |

La fila propia contiene 572 leads Meta antes del filtro y 457,6 después; Google aporta 100. Meta conserva CPL bruto de $8,39 en $4.800 según interpolación histórica; el CPL por lead que sobrevive al filtro es mayor.

## Funnel actual y control manual

Meta: 500 × 55 % = 275 contactos; × 30 % = 82,5 agendas; × 70 % = **57,75 visitas**; × 18 % = **10,395 ventas**. CAC real = ($4.000 + 57,75 × $60) / 10,395 = **$718,13**. LTV:CAC = $1.625 / $718,13 = **2,26x**. Valor por visita = 18 % × $1.625 − $60 = **$232,50**.

Google: 100 → 85 contactos → 46,75 agendas → **39,7375 visitas** → **11,92125 ventas**. CAC real = **$535,54**; LTV:CAC = **3,03x**; valor por visita = **$427,50**. La demanda combinada actual es 97,4875 visitas, debajo de las 100 disponibles.

## Caja del mes 1 y payback

Entradas: $3.250 × (22,31625 ventas actuales + 22 ventas del mes 0) = **$144.027,81**. Salidas: $3.770 × 22,31625 = $84.132,26 por equipos y comisión; $1.105 × 22 = $24.310 por instalación del mes 0; $60 × 97,4875 = $5.849,25 por visitas; $8.000 anuncios; $18.000 fijos. Total salidas: **$140.291,51**. Caja final: $12.000 + $144.027,81 − $140.291,51 = **$15.736,30**, $10.736,30 sobre el piso de $5.000.

Por venta, el flujo al firmar es $3.250 cobrados − $3.575 equipos − $195 comisión = −$520, aparte del CAC ya desembolsado. Al instalar, el flujo es $3.250 − $1.105 = +$2.145. El CAC real se recupera con el cobro del mes siguiente cuando sea menor o igual a $1.625; en estos escenarios el payback unitario es el mes 2.

## Límites

No hay información sobre estacionalidad, capacidad de caja para el plan propio, costos fiscales, garantías, financiamiento ni calendario de batería. No se atribuyen a la landing dirección, cobertura, garantías ni promesas; el ahorro de 70 % es promedio indicado por el caso, no garantía.