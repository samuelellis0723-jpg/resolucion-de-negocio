# Sol de Casa — Plan para terminar la Parte 2

**Fecha:** 6 de noviembre de 2026  
**Alcance:** prototipo de referidos, ficha de growth de una página y demostración de tres minutos.  
**Base revisada:** PDF «Caso C - Sol de Casa (Parte 2)», HTML `sesion2.html`, documentos del proyecto y estado del repositorio. La presentación DOCX de 16 páginas se devolvió como imágenes sin texto extraíble en la lectura disponible; no inferí requisitos a partir de ella.

La revisión empezó en la rama `samu` sin cambios pendientes. Ya existen la landing, la calculadora financiera y el simulador de caja. La navegación actual incluye `/`, `/calculadora` y `/simulador-caja`; todavía no incluye las pantallas del ciclo de referidos ni el panel de Andrés. Este documento es el único archivo nuevo de esta revisión y organiza ese trabajo sin cambiar los niveles anteriores.

### Diagnóstico

Sol de Casa tiene 420 familias instaladas y no les envía mensajes después de la instalación. El 75 % no sabe cuánto ahorró el mes anterior, el 40 % ha enseñado su recibo y solo el 8 % refiere espontáneamente a una familia al año. La causa probable —por validar— es que el ahorro no se hace visible ni existe un recorrido sencillo para compartirlo y seguir al vecino.

En la web actual, de 100 visitas 14 abren el formulario y 6 dejan sus datos. La mayor pérdida ocurre antes de abrirlo: 86 de cada 100 visitas (86 %). De los 14 que empiezan, 8 no lo terminan (57,1 %). El prototipo debe abrir un camino de recomendación que empiece con el ahorro compartido y pida los datos solo cuando el vecino quiera agendar.

**Indicadores de éxito:** revisar semanalmente cuántas familias activas comparten su ahorro y cuántos leads referidos calificados llegan. El resultado de negocio es visitas referidas realizadas, ventas atribuidas y costo de adquisición referido (visitas más recompensas) de **$300 o menos por venta**, sin superar la capacidad técnica. La referencia de hoy es 8 % de familias que refieren espontáneamente en un año; la cantidad de visitas de referido completadas aún no tiene una línea base semanal y se debe instrumentar.

**Meta de prueba [SUPUESTO]:** obtener al menos 4 leads referidos trazables en 30 días de las 25 familias que reciben la experiencia. Es un objetivo direccional basado en el rendimiento observado de letreros, no una promesa de conversión. Se compara con las otras 25 familias y no basta por sí solo para justificar un técnico nuevo.

### Usuarios

- **Familia con paneles:** quiere comprobar el ahorro de este mes, entender el acumulado y compartirlo sin tener que traducir los datos técnicos. Necesita una vista privada y una tarjeta fácil de enviar.
- **Vecino referido:** quiere saber si los paneles podrían convenirle, ver una estimación entendible y pedir una visita con pocos pasos. Necesita saber qué cálculo es promedio y qué parte es simulada.
- **Andrés:** necesita ver qué etapas producen referidos, cuánto cuesta cada venta, cuántas visitas caben y si las recompensas respetan el tope de $300.

### Solución propuesta

Ampliar el sitio React/Vite existente con una experiencia web priorizada para celular. La familia consulta el ahorro y comparte un enlace personal; el vecino abre ese enlace, calcula un ahorro estimado y puede solicitar una visita; Andrés consulta el embudo y el costo de las recompensas.

Para la demostración académica, los nombres, ahorros, enlaces, actividad y cifras del panel se marcan **SIMULADO**. No se necesita un backend de producción: el prototipo puede mantener datos de demostración en la interfaz y recorrer el flujo de principio a fin. Para probarlo con clientes reales, se deberá usar el ahorro real exportado de la plataforma del inversor y guardar de forma segura los enlaces, consentimientos, leads, citas y recompensas. Esa integración es una fase posterior.

React ya resuelve la interfaz del proyecto. Node.js, MySQL, Sequelize y mysql2 no aportan al prototipo con datos fijos; serían la base del backend y almacenamiento si Sol de Casa convierte el piloto en un servicio real. No hace falta IA: las estimaciones son fórmulas simples y los datos deben venir de la plataforma del inversor, no de una respuesta generativa.

### Mapa del sitio

1. **Ahorro de mi casa:** familia; ahorro del último mes y acumulado, ambos identificados como reales o simulados. Resuelve que hoy el 75 % no conoce su ahorro.
2. **Compartir mi ahorro:** familia; tarjeta con cifra elegida por la familia, texto breve y enlace personal para WhatsApp. Resuelve la falta de una invitación medible.
3. **Ahorro para el vecino:** vecino; calculadora y explicación de supuestos antes de pedir datos. Conserva el código de quien lo invitó.
4. **Solicitar visita:** vecino; formulario corto y confirmación de demostración. Registra el referido y muestra el siguiente estado; si no hay capacidad, deja la solicitud en espera en vez de prometer una cita.
5. **Mis referidos y recompensas:** familia; barra de avance y estados de cada referido. Muestra el costo máximo permitido y cuándo se habilita cada recompensa.
6. **Panel de Andrés:** administrador; datos simulados por etapa, visitas disponibles, ventas, costo de visitas, recompensas y costo referido por venta. Permite decidir si se sigue probando o se ajusta.

### Funcionalidades (MVP / futuras)

#### MVP (imprescindibles para resolver el problema)

- Mostrar ahorro mensual y acumulado con etiqueta **SIMULADO** cuando no provenga de datos reales.
- Generar una tarjeta compartible con enlace personal; evitar publicar datos privados de la familia sin que ella los elija.
- Dar al vecino una calculadora con ahorro promedio del 70 %, costo de instalación promedio de $6.500 y recuperación simple; rotular el cálculo como estimado.
- Permitir que el vecino solicite una visita en pocos pasos y conservar quién lo refirió. No presentar la solicitud de demostración como una cita real.
- Mostrar a la familia el progreso del referido y las recompensas; premiar solo eventos comprobables.
- Dar a Andrés un panel simulado con compartidos, visitas de la página, cálculos, solicitudes, visitas realizadas, cierres y costo de adquisición.
- Mostrar capacidad y una alerta cuando las visitas solicitadas exceden las plazas disponibles.
- Registrar una ficha del experimento A/B y la revisión desde la perspectiva de la familia y del vecino.

#### Mejoras futuras

- Conectar la plataforma del inversor y automatizar el ahorro mensual por hogar.
- Autenticación y acceso privado para clientes; administración real de citas, ventas y recompensas.
- Integración con WhatsApp Business, agenda, CRM y medición de campañas.
- Pruebas de recompensas distintas, niveles o gamificación avanzada. No incluirlas antes de comprobar el costo.
- Automatizaciones o IA. No son necesarias para mostrar el ahorro ni medir el ciclo.

### Flujos de usuario

1. **Familia que comparte:** abre el ahorro mensual → revisa el acumulado → elige compartir → envía su tarjeta por WhatsApp → vuelve a la pantalla de referidos y ve el estado del enlace. Si el ahorro todavía no está conectado, la pantalla lo identifica como simulado.
2. **Vecino que recibe el enlace:** abre la tarjeta → ingresa su recibo mensual → ve ahorro estimado y recuperación simple → solicita visita → recibe una confirmación de demostración. El enlace conserva el identificador del referente. Si no hay espacio, se registra interés sin anunciar una cita confirmada.
3. **Andrés que revisa growth:** abre el panel → compara compartidos, visitas y cierres → revisa visitas realizadas frente a capacidad → comprueba recompensas y costo por venta → decide si continúa el piloto, corrige el paso con mayor fuga o deja de ampliarlo.

### Modelo de datos

En el prototipo no hace falta una base de datos: los registros de la demostración son simulados. Si el piloto pasa a producción, las entidades necesarias serían:

- **Familias:** hogar instalado y estado de su relación con Sol de Casa.
- **Ahorros mensuales:** una familia puede tener muchos registros mensuales, con consumo, ahorro y fecha de cálculo.
- **Enlaces compartidos:** una familia puede generar varios enlaces; cada enlace identifica al referente sin exponer su información privada.
- **Vecinos interesados:** cada vecino llega desde cero o desde un enlace compartido; un vecino puede solicitar una visita.
- **Citas y visitas:** cada cita pertenece a un vecino; registra si fue agendada, realizada o cancelada.
- **Ventas:** una visita realizada puede terminar en cero o una instalación cerrada; cada venta atribuida registra su referente.
- **Recompensas:** cada recompensa se asocia con el referido y el evento que la habilitó; guarda valor, estado y fecha para revisar el tope.
- **Experimento:** cada familia de la prueba queda asignada a control o tratamiento para comparar resultados sin mezclar grupos.

### IA en el backend

La IA no hace falta. El ahorro estimado, la recuperación simple, las tasas del embudo y el costo por venta se obtienen con fórmulas transparentes. En producción, se debe leer el dato del inversor y usar reglas deterministas; un fallo de datos debe indicar que el ahorro no está disponible y ofrecer solicitar ayuda, no inventar una cifra.

### Diseño

No se adjuntó un libro de marca. El sitio existente ya tiene una base visual que conviene conservar: fondo marfil `#f5f4e9`, verde `#173d35`, amarillo `#f1bf36`, verde azulado `#378c7c` y coral `#c76748`. Reutilizar los estilos actuales de DM Sans para lectura y Space Grotesk para titulares mantiene continuidad con las páginas ya construidas. Esta base se considera guía visual provisional **[SUPUESTO]**.

Diseñar primero para pantalla móvil: el ahorro ocupa el primer plano; compartir y calcular son acciones visibles; los formularios aparecen después de explicar el beneficio. Usar texto oscuro sobre fondos claros, botones grandes y estados con texto además de color. Respetar la preferencia de movimiento reducido.

### Plan por fases

**Fase 1 — Cerrar números y recorrido.** Confirmar el embudo, el costo de recompensas, la meta de prueba y los bocetos. Entregable: esta ficha de growth y los seis pasos del prototipo. Comprobación: no se mezcla lead con visita realizada y cada cifra tiene fuente o marca **[SUPUESTO]**.

**Fase 2 — Construir el recorrido de demostración.** Añadir ahorro, compartir, página del vecino, calculadora, solicitud, estado de referido y panel. Entregable: recorrido de celular que comienza con el mensaje compartido y termina con el panel de Andrés. Comprobación: se puede completar con datos simulados y cada dato inventado dice **SIMULADO**.

**Fase 3 — Probar con usuarios.** Asignar al azar 25 familias a la experiencia nueva y 25 al proceso actual, medir 30 días y registrar comentarios con las cuatro preguntas. Entregable: conteos por grupo, observaciones y decisión. Comprobación: comparar leads trazables, visitas realizadas, tasa de asistencia, costo y capacidad; etiquetar el piloto como direccional por su tamaño.

**Fase 4 — Ejecutar el plan de 90 días.** Días 1–30: instrumentar enlaces y ejecutar la prueba de 50 familias. Días 31–60: corregir el paso con más fuga y probar un barrio con letreros registrando también su costo. Días 61–90: ampliar gradualmente solo si suben los referidos y se cumplen costo y capacidad. Mantener publicidad optimizada; no aumentar pauta ni contratar un técnico basándose solo en una meta no observada.

#### Ficha de growth lista para pasar a una página

**Ciclo:** familia instalada → ve el ahorro → comparte enlace personal → vecino calcula su ahorro → solicita visita → visita se realiza → Sol de Casa instala paneles → el nuevo hogar ve y comparte su ahorro.

**Mayor fuga observada hoy:** 100 visitas web → 14 abren formulario (86 % se pierde antes del formulario) → 6 envían datos (se pierde 57,1 % de quienes lo abren). La nueva experiencia primero demuestra el ahorro compartido y deja la solicitud para después de la calculadora.

**Costo de un referido y límite de premios:**

- Leads que llegan a visita realizada: `95 % × 85 % × 90 % = 72,675 %`.
- Visitas realizadas por venta: `1 ÷ 45 % = 2,2222`.
- Costo de visitas por venta: `2,2222 × $60 = $133,33`.
- Máximo disponible para todas las recompensas: `$300 − $133,33 = $166,67 por venta`.

| Momento | Recompensa propuesta **[SUPUESTO]** | Costo esperado por venta | Control |
| --- | --- | ---: | --- |
| La familia comparte o el vecino agenda | Barra de avance, sin premio monetario | $0 | No pagar por clic ni por cita que no se atiende |
| La visita del vecino se realiza | Descuento de $15 para quien refirió | $15 × 2,2222 = $33,33 | Contar solo visitas realizadas |
| La instalación del vecino se cierra | Descuento de $50 para el nuevo cliente | $50,00 | Aplicar una vez por venta cerrada |
| **Total de recompensas** |  | **$83,33** | **Quedan $83,34 de margen frente al máximo de $166,67** |

Costo referido estimado con este diseño: `($60 + $15) ÷ 45 % + $50` = **$216,67 por venta** al redondear el total, dentro del límite de $300. Los $15 y $50 son propuestas, no datos del caso. Si se cambia el premio, recalcular el costo antes de mostrarlo.

**Capacidad para un técnico adicional:** para obtener 50 visitas realizadas se necesitan `50 ÷ 72,675 % = 68,8`, aproximadamente **69 leads referidos**. Para sostener 50 visitas mensuales durante los dos meses que tarda el rendimiento del letrero en observarse, se requieren aproximadamente **138 leads en dos meses**. El letrero aportó 6 leads por 20 casas en dos meses: suponiendo el mismo rendimiento por familia que comparte, `100 ÷ 72,675 % ÷ (6/20) ≈ 458,66`, es decir, **459 familias**. Es más que las 420 instaladas. A ese rendimiento, las 420 familias producirían unos 126 leads y 91,6 visitas en dos meses, cerca de 45,8 visitas mensuales. Esta extrapolación **[SUPUESTO]** se debe validar para la tarjeta digital.

**Retención y métrica semanal:** los paneles se compran cada 15–20 años; retener no significa esperar otra compra de paneles. Significa mantener una relación útil después de instalar, fomentar el plan de mantenimiento (lo contrata el 25 % a $12 al mes) y facilitar recomendación voluntaria. Andrés revisa cada semana hogares activos que vieron o compartieron su ahorro por cada 100 hogares invitados; junto con los leads referidos y visitas realizadas. La meta económica sigue siendo CAC referido de $300 o menos por venta. No se inventa una tasa de renovación del plan de mantenimiento: no está en los datos.

**Prueba A/B:** asignar 25 familias a la vista de ahorro y enlace compartible y 25 al proceso actual sin mensajes posteriores. En 30 días medir familias que comparten, leads referidos trazables, visitas realizadas y cierres. Hipótesis: «Si mostramos el ahorro y un enlace personal, entonces las 25 familias tratadas generan al menos 4 leads trazables en 30 días **[SUPUESTO]**, frente al control; vigilamos que la asistencia no baje del 90 %, que el costo por venta no pase $300 y que las visitas no superen capacidad». Los 4 leads son una meta piloto basada en el rendimiento de letreros; el grupo pequeño sirve para aprender y no prueba por sí solo causalidad.

**Canales a 90 días:**

| Cuadrante | Canales | Acción |
| --- | --- | --- |
| Alto potencial / bajo costo marginal | Tarjeta personal y mensajes postinstalación **[SUPUESTO]** | Priorizar la prueba; medir enlaces y visitas, sin afirmar costo cero de operación. |
| Alto impacto observado / alto costo | Anuncios pagados de Meta y Google | Mantener y optimizar; el caso previo llega a 97,49 de 100 visitas, así que no escalar sin capacidad y CAC controlados. |
| Impacto complementario / bajo costo esperado **[SUPUESTO]** | Publicaciones orgánicas que amplifican tarjetas con permiso | Apoyar el alcance; atribuir cada lead a su enlace. |
| Impacto o costo por validar | Letreros de barrio | Repetir en escala pequeña con QR/enlace y registrar costo, leads, visitas y cierres antes de ampliar. |

**En qué se equivocó o nos confundió la IA:** el registro real del Nivel 1 conserva que una versión mostró 760 leads, 25,63 ventas y CAC real de $546,24; atribuía 600 leads a Meta y 160 a Google, aunque los datos históricos eran 500 y 100. También generó una referencia circular en salidas de caja. Se corrigieron la interpolación, las referencias de tasas por canal y el rango de egresos. Este error pertenece al trabajo anterior del proyecto; todavía no hay un error observado en el prototipo de Parte 2. Durante su construcción se debe anotar una cita real, su efecto y la corrección; no inventar errores.

#### Guion de demostración de tres minutos

1. **0:00–0:30:** problema y fuga: 75 % no conoce su ahorro; la web pierde 86 % antes de abrir el formulario.
2. **0:30–1:15:** recorrer la pantalla de la familia, mostrar el ahorro **SIMULADO** y compartir tarjeta/link.
3. **1:15–2:00:** abrir el enlace como vecino, ingresar recibo de $110, mostrar $77 mensuales y $924 anuales de ahorro promedio estimado; la recuperación simple es `$6.500 ÷ $924 = 7,03 años`, antes de otros costos y sin prometer resultados.
4. **2:00–2:35:** solicitar la visita, mostrar el referido y abrir el panel de Andrés para enseñar etapas, capacidad y recompensas.
5. **2:35–3:00:** explicar la prueba de 25/25, el tope de $300 y la decisión si no mejora: corregir la invitación y repetir antes de escalar.

### Riesgos y supuestos

**Riesgos y controles**

- Los datos de la plataforma del inversor son técnicos y no están integrados: usar ahorro simulado en la demo; para clientes reales, validar y cargar el ahorro por hogar antes de enviarlo.
- El 70 % es un promedio reportado, no garantía: expresarlo como estimación y aclarar que la recuperación simple ignora factores no dados.
- El 90 % de visitas realizadas corresponde al embudo de referidos del caso; no asumir que todas las nuevas campañas tendrán ese resultado. Vigilar asistencia y costo real.
- La capacidad actual es 100 visitas al mes y el plan previo estima 97,49 visitas realizadas. Los referidos podrían desplazar visitas pagadas; si se contrata otro técnico, cuesta $1.800 al mes y aporta 50 visitas de capacidad según el caso. No contratar automáticamente.
- El rendimiento del letrero no informa su costo ni prueba que cada familia compartiendo produzca igual. Medir el costo y tratar la conversión digital como hipótesis.
- Los descuentos propuestos pueden exceder el máximo si se acumulan o se premia una cita que no ocurre. Registrar cada evento y verificar `$visitas + recompensas ≤ $300 por instalación referida`.
- Los enlaces y ahorros pueden exponer datos personales. El enlace de vecino no debe mostrar nombre, recibo ni datos privados del referente.

**Supuestos que afectan el alcance**

- **[SUPUESTO]** El rendimiento de 6 leads por 20 casas en dos meses sirve solo como referencia para estimar el orden de magnitud de hogares que comparten; no es una tasa de conversión digital.
- **[SUPUESTO]** El piloto usa 4 leads trazables por 25 familias tratadas en 30 días como meta direccional derivada de esa referencia.
- **[SUPUESTO]** Los descuentos de $15 por visita realizada y $50 al cierre son incentivos de prueba; el caso no fija premios concretos.
- **[SUPUESTO]** Las cifras de la demo, el nombre de muestra, los estados de cita y el panel son simulados hasta que se conecten datos autorizados.
- No se conoce la tasa de renovación ni el costo operativo del plan de mantenimiento, el costo de los letreros, ni la agenda real de técnicos. Obtenerlos antes de escalar.

**Lista de cierre antes de entregar:** recorrido completo móvil; experiencia de familia y vecino; cada dato de demo marcado **SIMULADO**; panel con todas las etapas; costo referido calculado con visitas realizadas; recompensas bajo $300; capacidad visible; ficha de una página; comparación 25/25 y contramétrica; revisión de cuatro preguntas desde ambos roles; registro de un error real de IA; demostración ensayada en tres minutos.
