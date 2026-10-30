# Fórmulas de referencia

Contenido: 1 Cascada · 2 ROAS y break-even · 3 CAC · 4 LTV · 5 Payback · 6 Retención · 7 Equilibrio y fijos · 8 Capital de trabajo e inventario · 9 Precios y descuentos · 10 Escalamiento

## 1. Cascada de contribución
- Ingreso neto = precio / (1 + IVA) si el precio incluye IVA; luego − descuentos − devoluciones.
- CM1 = ingreso neto − COGS
- CM2 = CM1 − logística − pasarela − otros variables de entrega (soporte, cómputo, comisiones de plataforma)
- CM2% = CM2 / ingreso neto
- CM3 = CM2 − CAC (o marketing variable por unidad)
- Comisión de pasarela: aplícala sobre lo que realmente cobras (precio con IVA), no sobre el ingreso neto.

## 2. ROAS y equilibrio
- ROAS = ventas brutas atribuidas / gasto en anuncios
- ROAS de equilibrio 1er pedido = ingreso atribuido por pedido / CM2. Es 1 / CM2% solo si el ROAS usa ingreso neto; con ventas brutas/IVA usa la misma base bruta en el numerador.
- ROAS de primer pedido necesario considerando recompra = ingreso atribuido del primer pedido / LTV de contribución del horizonte. No multiplicar recompra de nuevo si el ROAS ya incluye esas ventas.
- Resultado por $1 de anuncio = ROAS × (CM2 / ingreso atribuido por pedido) − 1
- ROAS marginal = Δ ventas / Δ gasto

## 3. CAC
- CAC de anuncios = gasto en ads / clientes nuevos atribuidos
- Blended = gasto total de marketing / todos los clientes nuevos (pagados + orgánicos)
- Fully-loaded = (ads + agencia + herramientas + comisiones + muestras + sueldos de adquisición) / clientes nuevos
- Lead gen: CAC = gasto comercial y de marketing / contratos cerrados; CPL = gasto en ads / formularios
- Marginal = Δ gasto de adquisición / Δ clientes nuevos
- CAC máximo aceptable = LTV objetivo / ratio objetivo (ej. LTV / 3)
- Con embudo: CAC = costo por visita × visitas por cliente = CPC / tasa de conversión visita→cliente

## 4. LTV (siempre sobre CM2)
- Transaccional: LTV = CM2 × pedidos en el horizonte
- Suscripción, vida teórica: LTV = CM2_mensual / churn
- Suscripción, horizonte N: LTV_N = CM2_mensual × (1 − (1 − churn)^N) / churn
- Descontado con cobros al final de mes: LTV_N = suma desde t=1 hasta N de CM2_mensual × (1 − churn)^(t−1) / (1+r)^t. A horizonte infinito: CM2_mensual / (churn+r), si converge. Con primer cobro inmediato, multiplicar por (1+r). No descontar el flujo para calcular payback de caja; payback descontado es otra métrica.
- Por cohorte real: LTV = Σ (CM2_mes × % retenido en ese mes)
- Con expansión: usa ingreso por cliente creciente; solo si hay datos de upsell reales

## 5. Payback
- Curva de caja: C(0) = −CAC; C(t) = C(t−1) + CM2_t × retención_t
- Payback = primer mes con C(t) ≥ 0 (reporta el mes, no un promedio)
- Payback simple suscripción sin churn = CAC / CM2_mensual (optimista; usa la curva con churn)
- Prepago: contribución Día 1 = precio paquete (neto) − COGS del periodo − logística del periodo − pasarela; si ≥ CAC, adquisición cubierta al inicio tras reservar costos futuros; mostrar cobros, obligaciones de entrega y margen devengado por separado

## 6. Retención
- Logo churn = clientes perdidos / clientes al inicio del periodo
- GRR = (MRR inicial − downsell − churn) / MRR inicial (máx. 100%)
- NRR = (MRR inicial + expansión − downsell − churn) / MRR inicial; NRR > 100% = churn negativo de ingresos
- Vida media = 1 / churn (solo si el churn es aproximadamente constante)
- Frecuencia de compra anual = pedidos del año / clientes activos

## 7. Equilibrio y costos fijos
- Unidades para cubrir fijos = (fijos mensuales + marketing fijo) / CM2 unitario
- Clientes recurrentes necesarios = fijos mensuales / CM2 mensual por cliente
- Margen de seguridad = (ventas reales − ventas de equilibrio) / ventas reales
- Servicios con capacidad: CM2 por hora = CM2 por sesión / horas por sesión; capacidad máx. = horas disponibles × utilización

## 8. Capital de trabajo e inventario
- Ciclo de conversión de caja = días de inventario + días de cobro − días de pago a proveedores
- Capital atrapado en stock = unidades en inventario × costo unitario
- Tienda con inventario: construir flujos por fechas de compra, pago a proveedor, cobro y entrega. No sumar días de bodega a meses de payback sin convertir unidades ni duplicar el desembolso de inventario.
- Compra mínima de proveedor: verifica que el stock inicial se pueda financiar antes de escalar pauta

## 9. Precios y descuentos
- Margen necesario para mantener CM2 tras un descuento d: ventas deben subir en CM2 / (CM2 − d × precio) − 1 (porcentaje de volumen extra para empatar)
- Precio mínimo para un CM2% objetivo = costos variables / (1 − CM2% objetivo − comisión%)
- Prepago con descuento d sobre N meses: ahorro del cliente = d × N × cuota; revisa que contribución Día 1 ≥ CAC
- Tarifa plana vs. por uso: cobra por uso o con tope cuando el costo variable por usuario intensivo supera el margen del plan

## 10. Escalamiento
- Regla: escala mientras CAC marginal ≤ CAC máximo aceptable (o ROAS marginal > ROAS de equilibrio)
- Incremento por tramo: compara siempre tramos (presupuesto A vs. B), nunca solo el promedio acumulado
- Señales de saturación: sube CPM/CPC, baja CVR, sube frecuencia, aparece fatiga creativa

## Convenciones y límites
- Tasas en decimal: 0.13 = 13%. Mantén moneda, periodo, cohorte y horizonte comparables. No mezcles CAC por cliente con margen por pedido sin ajustar frecuencia.
- CM1/CM2/CM3 son convenciones operativas de esta skill: explicita las partidas. Margen positivo no equivale a EBITDA ni utilidad neta.
- Con churn cero, LTV_N = CM2 × N. Con CAC cero, LTV:CAC es indefinido. Explicita denominadores cero y ausencia de recuperación.
- En la calculadora, descuento y devoluciones reducen el importe bruto; la pasarela cobra sobre el importe descontado previo a devoluciones y COGS no se recupera automáticamente. Ajusta estas convenciones al contrato real.
- La fórmula de volumen extra por descuento supone costos unitarios constantes. Si CM2 menos descuento monetario no es positivo, no hay volumen finito que preserve la contribución original. Redondea unidades de equilibrio hacia arriba.
- El script de recompra requiere una cantidad entera de pedidos igualmente espaciados; con frecuencia esperada fraccionaria usa una tabla explícita.
