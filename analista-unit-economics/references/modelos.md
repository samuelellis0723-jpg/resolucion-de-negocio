# Cómo aplicar el flujo a cada tipo de negocio

Contenido: 1 E-commerce / tienda · 2 Suscripción · 3 Lead gen B2B · 4 Servicios con capacidad limitada · 5 SaaS, IA y agentes · 6 Marketplace · 7 Proyecto nuevo sin datos

## 1. E-commerce / tienda
**Pieza crítica:** veces que compra al año. **Preguntas clave:** ¿precio incluye IVA? ¿COGS incluye empaque? ¿envío lo paga el cliente o la tienda? ¿qué % de compradores son nuevos? ¿cuántos días rota el inventario?
- Calcula CM2 y ROAS de equilibrio **por categoría o producto** (un catálogo mixto tiene márgenes distintos).
- Revisa el embudo visita → carrito → pago antes de culpar al anuncio; mejorar conversión baja el CAC sin gastar más.
- Compra única (tortas de cumpleaños, equipo caro): el primer pedido debe pagar el CAC.
- Compra recurrente: LTV a 12 meses con la frecuencia real; verifica que haya caja para el payback.
- Con inventario: modela fechas de desembolso y cobro, además del costo de capital del stock, para evaluar recuperación de caja.
- Palancas típicas: subir ticket (bundles, envío gratis desde cierto monto), bajar devoluciones, mejorar conversión, renegociar COGS y envío.

## 2. Suscripción / membresía
**Pieza crítica:** meses que se queda (1 / churn). **Preguntas clave:** churn mensual por cohorte (¿alto en los primeros meses?), costo variable mensual por socio, forma de cobro.
- LTV acotado a 12 o 24 meses con la fórmula geométrica; no uses vida infinita.
- Revisa la curva de caja con churn: el payback de suscripción casi siempre es más largo que CAC / CM2.
- Palanca principal: prepago trimestral/anual (payback Día 1) y reducir el churn de los primeros 90 días.
- Expansión: si hay upsells reales, calcula NRR; no la supongas.

## 3. Lead gen B2B / servicios por contrato
**Pieza crítica:** % que contrata. **Preguntas clave:** embudo completo, tiempo de respuesta, costo de la degustación/demo/visita, valor y frecuencia del contrato.
- CAC por contrato cerrado, con todos los pasos comerciales dentro.
- Speed-to-lead: responder el mismo día suele subir el cierre; simula el CAC con la mejora.
- Calidad del lead: habla con quien atiende las llamadas; un formulario no es una venta.
- Recurrencia: si el cliente repite, el LTV multiplica por eventos al año; verifica el supuesto.

## 4. Servicios con capacidad limitada (coaching, manicura, talleres, clases)
**Pieza crítica:** utilización de horas y retención. **Preguntas clave:** horas disponibles por semana, duración de la sesión, cuánto vale tu hora, costos variables por sesión (materiales, comisiones, transporte), cuánto tiempo se queda el cliente, cómo llegan los clientes (referidos, redes, anuncios).
- El tiempo del prestador es costo variable: CM2 por hora = CM2 por sesión / horas de la sesión (incluye preparación y traslados).
- Tu techo de ingresos es `horas × utilización × precio/hora`; si el negocio ya está lleno, el siguiente paso es subir precio, paquetes o formato grupal, no más marketing.
- CAC de referidos y orgánico no es cero: incluye el tiempo dedicado a captar y las promociones/descuentos de bienvenida.
- LTV = CM2 por mes × meses que se queda; prepago de paquetes mejora caja y retención.
- Cancelaciones y no-shows: réstalos de la utilización efectiva.

## 5. SaaS, productos con IA y agentes
**Pieza crítica:** costo de inferencia por usuario activo y churn. **Preguntas clave:** modelo y precio por millón de tokens (del proveedor, vigente), tokens promedio y del percentil 90 por sesión, sesiones por mes, costo de infraestructura y soporte.
- Costo variable = tokens de entrada × precio entrada + tokens de salida × precio salida (+ herramientas, búsqueda, almacenamiento).
- Compara el CM2 del usuario promedio con el del usuario intensivo (percentil 90–95); en tarifa plana este último suele destruir margen.
- Palancas: topes de uso, planes por créditos, enrutar tareas simples a modelos más baratos, caching de prompts, reducir contexto.
- Márgenes típicos: SaaS tradicional alto; IA con inferencia significativa más bajo. Úsalos solo como referencia, valida con costos reales.
- Si el proyecto es un agente o automatización vendido a un cliente (ej. mercadeo, reservas, atención): precio = costo variable + horas de mantenimiento + margen objetivo; cobra una cuota de implementación para financiar el CAC.

## 6. Marketplace
**Pieza crítica:** take rate neto y liquidez. 
- Ingreso neto = GMV × take rate − incentivos/cupones; el margen se calcula sobre eso, nunca sobre el GMV.
- CAC dual: costo de captar vendedores + costo de captar compradores, ponderado por la relación oferta/demanda.
- Si falta liquidez (compradores sin oferta o viceversa), el LTV real es menor que el teórico.

## 7. Proyecto nuevo sin datos
- Construye tres escenarios (pesimista, base, optimista) con rangos para precio, COGS, conversión, churn y CAC.
- Identifica las 2–3 variables que más mueven el resultado y propón la prueba más barata para medirlas (preventa, anuncio pequeño, lista de espera, entrevistas).
- Define un umbral de "seguir/frenar": por ejemplo, CAC máximo y conversión mínima que hacen viable el modelo.
- No presentes cifras como hechos: todo es `[SUPUESTO]` hasta validar.
