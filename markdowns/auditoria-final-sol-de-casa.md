# Auditoría final · Sol de Casa

Fecha: 2026-10-31  
Rama revisada: `samu`  
Commit base: `d07617e` (`feat: add 24-month cash flow simulator`)

## Dictamen

Los controles financieros revisados concuerdan entre el caso, los documentos, `SolDeCasaModel`, la calculadora y la proyección de Nivel 3. La caja de M1 actual coincide con el control a centavos. El plan propio mantiene la capacidad base durante el mes de contratación y suma 50 visitas desde el siguiente. Las sensibilidades de la propuesta propia inicial quedan sobre el piso de $5.000; las agencias teórica e histórica no pasan el piso a 24 meses y se marcan **No cumple**.

El dictamen es acotado: se ejecutó el build y se inspeccionaron las rutas por HTTP, pero este entorno no ofrecía navegador para renderizar, tomar capturas ni interactuar con los formularios o la calculadora. Por esa razón no certifico su aspecto visual ni el flujo de interacción en navegador.

## Revisión y trazabilidad

Se leyeron README, auditoría y modelo de Nivel 1, recomendación, registro de errores de IA, implementación y cierre de Nivel 2, implementación de Nivel 3 y los documentos de estructura, reglas, buenas prácticas y contexto canónico de `marckdowns/`. Se aplicaron las instrucciones de `analista-unit-economics` para separar contribución, CAC y caja y para declarar supuestos; y las de `frontend-design` para conservar una interfaz responsive, clara y accesible.

El archivo Excel de Nivel 1 existe y se consultó solo en lectura. Se revisaron las hojas `Resultados` y `Supuestos`, sus fórmulas/caché y los escenarios actuales, agencia y plan propio. Sus resultados principales coinciden con los cálculos documentados. No se editó ni se generó ningún archivo de hoja de cálculo. Los originales de `marckdowns/` permanecen intactos.

La landing comunica los 420 hogares instalados, 4,9 estrellas, 210 reseñas y el 70 % como ahorro promedio indicado en el caso ficticio, no garantía. El formulario sigue conectado solo al mock de `json-server`; no se agregó backend. El HTML autónomo se genera desde el modelo compartido. El resultado operativo de Nivel 2 está separado del flujo de caja de Nivel 3.

## Recálculo independiente

### Caso unitario

`Contribución = $6.500 × (28 % − 3 %) = $1.625`. Los $195 de comisión se restan una vez de la contribución y no se vuelven a cargar en CAC. El CAC real usa visitas **realizadas**: `(anuncios + $60 × visitas realizadas) / ventas`. Los costos fijos quedan fuera del CAC.

| Métrica | Plan actual | Agencia histórica | Plan propio · run-rate |
| --- | ---: | ---: | ---: |
| Meta / Google | $4.000 / $4.000 | $8.000 / $0 | $4.800 / $4.000 |
| Leads Meta brutos | 500 | 840 | 572 |
| Leads Meta tras filtro | 500 | 840 | 457,6 |
| Visitas realizadas | 97,4875 | 97,02 | 149,5615 |
| Ventas esperadas | 22,31625 | 17,4636 | 36,08253 |
| CAC real | $620,59 | $791,43 | $492,58 |
| LTV:CAC | 2,62x | 2,05x | 3,30x |
| Resultado operativo mensual | $4.414,66 | −$3.442,85 | $21.060,42 |

En el plan actual, Meta aporta 57,75 visitas, 10,395 ventas y CAC real $718,13; Google aporta 39,7375 visitas, 11,92125 ventas y CAC $535,54. La trampa continúa: CPL Meta $8 frente a Google $40, pero el CAC real de Meta es mayor. El escenario agencia teórica a CPL $8 es una excepción explícita: 1.000 leads, 115,5 visitas solicitadas, 100 realizadas, 18 ventas y CAC real $777,78. No se confunde con los 840 leads históricos.

En Nivel 2, el plan propio es un run-rate de 150 visitas desde el mes posterior a contratar: 149,5615 visitas, 36,08253 ventas, CAC $492,58 y resultado operativo $21.060,42. La batería no se añade a la caja ni a la base; su adhesión futura de 15 % sigue **[SUPUESTO]**.

### Caja y capacidad

Para M1 actual: entradas `$3.250 × (22,31625 + 22) = $144.027,8125`; salidas `$3.770 × 22,31625 + $1.105 × 22 + $60 × 97,4875 + $8.000 + $18.000 = $140.291,5125`; caja final `$12.000 + entradas − salidas = $15.736,30`. Redondeados a centavos, los importes coinciden con $144.027,81, $140.291,51 y $15.736,30.

En el escenario propio del simulador, el técnico se contrata en M1: M1 conserva capacidad 100, realiza 100 visitas y paga $1.800 desde ese mes; M2 tiene capacidad 150. El embudo de M2 reproduce los resultados de run-rate del Nivel 2. La caja mínima de cierre es $9.169,27 en M2 y el cierre de M24 $472.498,54. El saldo de apertura $12.000 se considera una sola vez y también se incluye en la validación del piso.

El motor asigna Google primero. En el estrés de capacidad 50, Google recibe 39,7375 visitas y Meta el remanente 10,2625. Solo las visitas atendidas generan ventas. La regla de pauta M19+ se comprueba en cada escenario; las entradas iniciales mantienen pauta mensual constante, marcada como **[SUPUESTO]**, por lo que no disminuye en ese periodo.

### Controles a 24 meses del simulador

| Escenario inicial | Caja mínima de cierre | Mes | Caja M24 | Ventas acumuladas | Resultado de controles |
| --- | ---: | ---: | ---: | ---: | --- |
| Plan actual | $15.736,30 | M1 | $117.273,39 | 535,59 | Cumple |
| Agencia teórica | −$45.420,00 | M24 | −$45.420,00 | 432,00 | No cumple piso |
| Agencia histórica | −$60.897,82 | M24 | −$60.897,82 | 419,13 | No cumple piso |
| Plan propio con técnico | $9.169,27 | M2 | $472.498,54 | 855,08 | Cumple |
| Plan propio sin técnico | $14.096,92 | M1 | $219.162,04 | 604,30 | Cumple |

El saldo mínimo es el menor cierre de M1–M24; el chequeo del piso también incorpora la apertura. “Cumple” describe solo el piso y la regla de pauta, no la certeza de ventas.

## Revisión adversarial

1. **Contribución y costos:** comisión dentro de contribución; CAC excluye fijos; caja incluye comisión al firmar, instalación al mes siguiente y pagos por visitas realizadas. No se encontró doble conteo.
2. **Prioridad y técnicos:** Google precede a Meta en cada mes; el técnico cuesta desde contratación y aporta capacidad desde el siguiente. Confirmado en el flujo de M1/M2.
3. **Ventas de mes cero:** 22 ventas entran una vez como cobro pendiente y pago de instalación en M1. La caja inicial se arrastra una vez, no se vuelve a sumar como flujo cada mes.
4. **Piso/pauta:** todos los cinco escenarios recalculan caja mínima y pauta M19+; las dos agencias fallan el piso y no se etiquetan como factibles. Escenarios factibles iniciales pasan ambos controles.
5. **Supuestos:** filtro/tasas de Meta, CPL teórico, presupuesto de escenarios, mes de contratación y repetición constante de pauta están visibles y editables donde aplica. La batería, impuestos, deuda y otros egresos no están modelados como hechos.

**Corrección de presentación:** los controles de escenario permitían cambiar el método de leads de Meta sin cambiar el nombre fijo del escenario, lo que podía rotular un resultado histórico como teórico (o viceversa). Se fijó el método de cada escenario y se mantuvo editable el CPL teórico; cuando se modifican entradas, la tabla y el resumen agregan “editado”. No se alteraron resultados financieros por esta corrección.

## Comprobaciones ejecutadas y límites

- `npm run build`: correcto; Vite construyó React y regeneró `nivel-2-autonomo.html` desde el modelo fuente.
- Verificación Node independiente: recalculó actual, agencia histórica, plan propio, M1, las 120 filas de caja y los seis puntos de sensibilidad; coincidencia con controles documentados.
- Comprobaciones de rutas por HTTP para `/`, `/calculadora`, `/simulador-caja` y `/nivel-2-autonomo.html`: respuestas 200 del servidor Vite.
- `git diff --check`: sin errores de espacios. El repositorio no define scripts de lint ni test; el build fue la verificación configurada.
- CUA no informó aplicaciones o navegadores. No se realizó QA visual ni interacción real de los controles/formulario.

La proyección de 24 meses repite mensualmente demanda, tasas y pauta y no incorpora impuestos, financiamiento, batería ni costos no proporcionados. Es un escenario mecánico con supuestos explícitos, no un pronóstico ni una solicitud de crédito cuantificada. La sensibilidad que detalla los cambios está en [sensibilidad-final-nivel-3.md](sensibilidad-final-nivel-3.md); el discurso y las respuestas probables están en [presentacion-oral-final.md](presentacion-oral-final.md).
