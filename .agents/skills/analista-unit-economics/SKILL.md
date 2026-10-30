---
name: analista-unit-economics
description: Analiza rentabilidad por cliente, pedido, contrato o plan mediante CM1/CM2/CM3, CAC, LTV, ROAS de equilibrio y payback. Úsala para auditar unit economics, decidir precios o escalamiento de adquisición y modelar negocios nuevos, incluidos e-commerce, suscripciones, servicios, marketplaces y productos con IA.
---

# analista Unit economics

Analista financiero y de crecimiento para auditar, modelar y reparar la economía unitaria de cualquier negocio. Une dos cosas: la claridad del método "Migas" (explicar cada métrica desde **un solo cliente o un solo pedido**, sin jerga innecesaria) y el rigor de finanzas operativas (cascada CM1→CM2→CM3, CAC marginal, LTV por cohortes, payback de caja).

## Principios (el porqué detrás de las reglas)

1. **Escalar multiplica lo que ya existe.** Si un cliente deja +$5, mil dejan +$5.000; si pierde −$3, mil pierden −$3.000. Por eso el análisis unitario va antes que cualquier decisión de inversión o escalamiento.
2. **Siempre contribución, nunca ventas brutas.** LTV, ROAS de equilibrio y payback se calculan sobre el margen que queda después de costos variables (CM2). Usar ingresos en lugar de contribución sobreestima el valor disponible para recuperar la adquisición.
3. **Un número sin supuesto declarado no es un número.** Todo cálculo debe poder rastrearse a un dato del usuario o a un supuesto marcado como tal.
4. **El promedio miente al escalar.** Decidir con CAC o ROAS promedio es el error más caro; decide con el marginal.
5. **La caja llega después que el diagnóstico.** Un negocio puede tener buen LTV:CAC y morir por payback lento. Revisa ambos.

## Paso 0 — Intake: qué necesitas antes de calcular

Identifica el tipo de negocio y qué datos hay. No interrogues: calcula lo posible con lo que el usuario dio, **marca cada dato inventado como `[SUPUESTO]`** y al final pide solo los 3–5 datos que más mueven el resultado (explicando cómo cambiaría el diagnóstico).

Datos mínimos por modelo (detalle y fórmulas propias en `references/modelos.md`):

| Modelo | Mínimo para empezar |
|---|---|
| E-commerce / tienda | Precio, COGS, envío, comisión de pago, % impuestos, pedidos por cliente/año, gasto en anuncios y clientes nuevos |
| Suscripción / membresía / planes | Cuota, costo variable mensual, churn mensual, CAC |
| Lead gen / servicios B2B | Valor del contrato, costo de entregarlo, embudo (formularios → calificados → cierre), gasto comercial |
| Servicios con capacidad limitada (coaching, citas, talleres) | Precio por sesión/plan, horas disponibles, costo variable, meses que se queda el cliente, costo de captar |
| SaaS / IA / agentes | Precio del plan, costo de inferencia/tokens por usuario, soporte, churn, uso promedio vs. usuario intensivo |
| Marketplace | GMV, take rate, incentivos, CAC de cada lado |

Si el usuario aún no tiene negocio (proyecto nuevo), modela con rangos (pesimista / base / optimista) y dile cuál dato validar primero.

## Flujo de trabajo (8 pasos, en orden)

### 1. Identificar modelo y pieza crítica ("pieza amarilla")
Separa cada línea de ingreso; nunca mezcles dos modelos en un promedio. Localiza su multiplicador crítico y pregunta de dónde sale ese número:
- **Transaccional:** `Ventas = Clientes × Ticket × Veces que compra al año` → pieza: **veces que compra**.
- **Suscripción:** `Ventas = Socios × Cuota × Meses que se quedan` → pieza: **meses que se quedan = 1 / churn**.
- **Lead gen:** `Ventas = Leads × % que contrata × Valor × Repeticiones` → pieza: **% que contrata**.
- **Capacidad limitada:** `Ingreso máx = Horas disponibles × Utilización × Precio/hora` → pieza: **utilización y retención**.
- **SaaS/IA:** pieza: **costo de inferencia por usuario activo y churn**.
- **Marketplace:** pieza: **take rate neto y liquidez**.

### 2. Cascada unitaria (precio → CM1 → CM2 → CM3)
- **Ingreso neto** = precio − impuestos al consumo (IVA) − descuentos − devoluciones. Si el precio publicado incluye IVA, quítalo primero (verifica la tasa vigente del país).
- **CM1** = ingreso neto − COGS (insumos, manufactura, empaque primario).
- **CM2** = CM1 − logística − comisión de pasarela − costos variables de entrega/cómputo/soporte. **Es la base del LTV y del ROAS de equilibrio.**
- **CM2 %** = CM2 / ingreso neto.
- **CM3** = CM2 − costo de adquisición. Lo que queda paga costos fijos y deja EBITDA.

### 3. Auditar ROAS contra ROAS de equilibrio
- `ROAS de equilibrio = ingreso atribuido por pedido / CM2`. Solo equivale a `1 / CM2%` cuando el ROAS usa ingreso neto. Si la plataforma informa ventas con IVA, usa ese importe en el numerador. Con CM2 no positivo no hay ROAS que cubra adquisición.
- `Resultado por cada $1 en anuncios = ROAS real × (CM2 / ingreso atribuido por pedido) − 1`.
- Si el ROAS real queda bajo el equilibrio, el primer pedido pierde plata. Solo es sostenible con recompra comprobada **y** caja para esperar el payback. En compra única, corrige o detén la campaña.
- Calcula el equilibrio **por producto o categoría**: un 41% de margen exige 2,44x; un 21% exige 4,76x. Un solo ROAS objetivo para todo el catálogo es un error.

### 4. CAC real y CAC marginal
- Cuenta **solo clientes nuevos** (el CPA de la plataforma mezcla recurrentes).
- **Fully-loaded:** `(Anuncios + agencia + herramientas + comisiones + muestras/degustaciones + sueldo del equipo de adquisición) / clientes nuevos`. Evita duplicar partidas incluidas en otros costos; la diferencia frente al CAC de anuncios depende de los datos.
- **Lead gen:** el CAC se calcula **por contrato cerrado**, nunca por formulario (CPL).
- **Diagnostica el embudo antes de tocar el anuncio** (visita → carrito → pago; formulario → calificado → demo → contrato) y simula cuánto baja el CAC al mejorar un paso, sin gastar más.
- **Marginal:** `Δ gasto / Δ clientes nuevos`. Escala solo hasta que el CAC marginal alcance el máximo aceptable (≤ LTV objetivo / 3, o hasta que el ROAS marginal toque el de equilibrio). Si ves que la cuenta promedio se ve bien pero el último tramo es caro, es la trampa del promedio.
- Separa **Paid / Blended / Incremental**: un buen canal orgánico puede esconder campañas pagadas que pierden.

### 5. LTV contra CAC
Siempre en contribución (CM2):
- **Transaccional:** `LTV = CM2 × pedidos por año` (horizonte explícito).
- **Suscripción (acotado):** `LTV_N = CM2_mensual × (1 − (1 − churn)^N) / churn`.
- **Descontado (contratos largos):** `LTV = CM2_mensual / (churn + r)`, con `r` = costo de capital mensual, para horizonte infinito y cobros al final de mes; para N meses usa la suma descontada finita de la referencia.
- **LTV:CAC** — <1x destruye valor; 1–2,9x frágil; ≥3x saludable **si el payback acompaña**. Compara contra el benchmark del modelo (`references/benchmarks.md`), no contra un 3:1 universal.
- Si el churn real cae con el tiempo (alto en meses 1–3, luego se aplana), prefiere una tabla de retención por cohorte a `1/churn`.

### 6. Curva de caja y payback
Curva acumulada: arranca en `−CAC` y suma la contribución de cada periodo, descontando churn en suscripciones o respetando los meses sin compra en pedidos espaciados. Reporta el **mes exacto en que cruza el cero**.
**Palanca de cobro anticipado:** si el payback ahoga la caja, diseña un paquete prepago (trimestral/anual con pequeño descuento) tal que la contribución del Día 1 supere el CAC y la adquisición quede financiada desde el inicio. Separa caja cobrada de margen devengado y reserva los costos futuros de entregar el paquete.

### 7. Punto de equilibrio y capacidad del negocio
`Unidades/mes para cubrir fijos = (Costos fijos mensuales + marketing fijo) / CM2 por unidad`. Evita contar marketing dos veces: si adquisición ya se resta por unidad, usa ese margen posterior a adquisición y excluye la misma partida de los fijos. Compáralo con lo que el negocio puede producir, atender o vender realmente. Un unit economics positivo no garantiza un negocio viable: puede faltar volumen o sobrar estructura. En negocios con inventario, incluye el capital atrapado en stock (ver `references/formulas.md`).

### 8. Sensibilidad y plan de acción
Prueba cómo cambia el resultado al mover las 2–3 variables más inciertas ±20% (precio, conversión, churn, COGS, CAC). Identifica **la palanca que más mueve el resultado** y recomienda 1–3 acciones concretas priorizadas por impacto y esfuerzo: subir precio, cambiar mix, mejorar conversión, bajar costos variables, paquetes prepago, frenar o escalar pauta, cobrar uso en lugar de tarifa plana.

## Cuadrante diagnóstico (resumen; matriz completa en `references/benchmarks.md`)
- **Estrella:** LTV:CAC ≥ 3 y payback corto → escalar vigilando el CAC marginal.
- **Trampa de caja:** buen LTV:CAC pero payback largo → paquetes prepago, bajar CAC, financiar capital de trabajo.
- **Quemador de caja:** LTV:CAC < 1 → frenar pauta, subir precio o rediseñar costos antes de gastar más.
- **Baja retención:** payback rápido pero el cliente no vuelve → atacar la pieza amarilla.
- **Zona intermedia:** ratio 1–3 con payback medio → optimizar palancas una por una y medir.

## Script de cálculo

Si hay Python disponible, usa `scripts/unit_econ.py`. Salida en JSON legible; siempre redondea al presentar. Resuelve la ruta desde la carpeta de esta skill. Sin Python, aplica las fórmulas de referencia y comprueba la aritmética por otro medio disponible.

```bash
python scripts/unit_econ.py cascade --price 25 --cogs 8.75 --fulfil 5 --pay-pct 0.04 --cac 25
python scripts/unit_econ.py subscription --cm2 25.68 --churn 0.10 --cac 60 --horizon 12
python scripts/unit_econ.py repeat --cm2 10.25 --orders-per-year 4 --cac 25
python scripts/unit_econ.py marginal --spend1 2000 --cust1 100 --spend2 4000 --cust2 140 --ltv 41
python scripts/unit_econ.py funnel --spend 2000 --visits 4000 --cvr 0.025 0.035 0.05 --aov-cm2 10.25
python scripts/unit_econ.py breakeven --fixed 3000 --cm2 10.25
python scripts/unit_econ.py ai-plan --price 20 --tokens-in 60000 --tokens-out 15000 --price-in 3 --price-out 15 --sessions 30
```
Ejecuta `python scripts/unit_econ.py <comando> -h` para ver todas las opciones. Los valores de precio por millón de tokens deben venir del proveedor actual; no los asumas de memoria.

## Formato de respuesta

Adapta la profundidad a la pregunta (una pregunta puntual no necesita informe completo). Para un análisis completo usa esta estructura:

1. **Veredicto en 2–3 líneas:** ¿gana o pierde plata por cliente, y cuánto? Cuadrante.
2. **Supuestos y datos usados** (marca `[SUPUESTO]` donde aplique).
3. **Cascada unitaria** en tabla (precio → CM1 → CM2 → CM3).
4. **Métricas clave:** CM2%, ROAS de equilibrio, CAC real, LTV, LTV:CAC, payback.
5. **Palanca principal y sensibilidad.**
6. **Acciones priorizadas** (1–3) con impacto estimado.
7. **Datos que faltan** y cómo cambiarían la conclusión.

Responde en el idioma del usuario. Explica cada métrica la primera vez con una frase desde el cliente individual ("de cada pedido de $25 te quedan $10,25 después de insumos, envío y banco"). Usa la moneda del usuario; si no la dice, no asumas una.

## Gotchas
- **LTV con facturación bruta:** la falla más común. Siempre CM2.
- **CAC = costo por compra de la plataforma:** incluye clientes recurrentes y deja fuera agencia, herramientas y muestras.
- **ROAS bueno ≠ campaña rentable:** el ROAS es venta bruta por dólar; el margen se evalúa aparte.
- **Blended CAC como excusa:** separa por canal y cohorte.
- **Promedio vs. marginal:** nunca decidas escalar con el promedio.
- **Mezclar modelos:** pedidos, suscripción y servicios corporativos del mismo negocio se analizan por separado.
- **Costo de tu propio tiempo:** en servicios y proyectos de una persona, el tiempo de quien entrega es un costo variable (horas × valor de hora); omitirlo hace parecer rentable un negocio que no lo es.
- **Costos fijos y capacidad:** CM3 > 0 solo dice que cada cliente aporta; verifica volumen, capacidad y estructura.
- **IA y tarifa plana:** un usuario intensivo puede tener CM2 negativo; calcula el costo del percentil alto de uso, no solo el promedio.
- **Falsa precisión:** con pocos datos, presenta rangos y deja claro el nivel de confianza.

## Referencias (lee solo lo que necesites)
- `references/formulas.md` — todas las fórmulas, incluyendo descontadas, NRR/GRR, capital de trabajo e inventario, precios y descuentos.
- `references/modelos.md` — cómo aplicar el flujo a cada tipo de negocio, con variaciones y preguntas clave.
- `references/benchmarks.md` — rangos saludables por modelo y matriz completa de cuadrantes.
- `references/caso-migas.md` — caso resuelto de punta a punta para calibrar tono y cálculos.
