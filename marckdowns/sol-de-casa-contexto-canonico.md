Contexto canónico — Caso C · Sol de Casa

Cómo usar este archivo

Este documento reúne el caso, los cálculos de control, los requisitos del sitio y las reglas de programación que deben seguirse al construir el proyecto. Codex no debe depender de esta conversación. Usa este archivo junto con los cuatro prompts Gauntlet de sol-de-casa-gauntlet-prompts.md. Pégalos en orden, en la misma conversación de Codex y en el repositorio del proyecto.

Estado del Nivel 1 reportado

Codex informó que el Nivel 1 ya está completo en un Excel importable, con recomendación, modelo/supuestos y registro de errores de IA. El usuario compartió estos destinos relativos: outputs/sol-de-casa-nivel-1/sol-de-casa-nivel-1.xlsx y documentos Markdown posiblemente bajo marckdowns/. El usuario hará Google Sheets por separado. No se requiere conexión a Sheets y Codex no debe crear, editar ni entregar spreadsheets. Si encuentra el Excel del Nivel 1, puede consultarlo solo en modo lectura como referencia. Codex sí debe construir la calculadora financiera interactiva dentro del sitio React. La landing y calculadora web aún deben construirse. Busca markdowns/ y marckdowns/, preserva los originales y deja documentos canónicos nuevos en markdowns/. No fijes rutas absolutas de Windows.

El plan propio de run-rate desde mes 2 fue reportado como 36,08 ventas, 149,56 visitas, capacidad 150, CAC real total $492,58 y LTV 3,30. Son resultados por verificar: reconstruye las inversiones y fórmulas desde el Excel antes de reutilizarlos; no los trates como datos del caso ni los fuerces. Codex también dijo que excluyó la batería de la caja base por falta de fechas de cobro/pago y que detectó/corrigió un error de interpolación. Conserva la decisión de batería y documenta el error solo con evidencia literal del registro. La skill financiera que Codex reportó usar se llama analista-unit-economics; frontend-design se usará para construir el sitio si está disponible.

Objetivo

Resolver el caso educativo “Sol de Casa” y construir un sitio web que incluya:

Landing page para personas interesadas en paneles solares.

Calculadora financiera y de embudo del Nivel 2 dentro del sitio. La hoja de Google Sheets del Nivel 1 la hará el usuario por separado.

Simulador de caja a 24 meses del Nivel 3.

Recomendación para Andrés, registro de errores de IA, pitch al banco y presentación de tres minutos.

La IA calcula y muestra sus cuentas; el equipo toma la decisión. Moneda USD, cifras mensuales salvo que se diga lo contrario. No inventar datos. Todo supuesto adicional se etiqueta [SUPUESTO], se justifica y se deja visible.

Fuente y reglas del caso

El caso es ficticio. Datos principales:

Sección 1 — Instalación solar y contribución

Precio promedio por instalación: $6.500.

El cliente paga 50 % al firmar y 50 % al terminar la instalación, el mes siguiente.

Equipos: 55 % del precio; se pagan al proveedor el mes de la firma.

Instalación: 17 %; se paga el mes siguiente.

Margen bruto: 28 % (= 100 % − 55 % − 17 %).

Comisión de la asesora: 3 % del precio, pagada el mes de la firma, aplica a todas las ventas.

La comisión forma parte de la contribución, no se añade al CAC.

Sección 2 — Visitas, capacidad y personal

Cada visita realizada cuesta $60, haya venta o no.

Dos técnicos pueden realizar como máximo 100 visitas al mes.

Un técnico adicional cuesta $1.800 al mes y añade 50 visitas de capacidad desde el mes siguiente a su contratación, porque el primer mes se capacita.

Hay máximo dos técnicos extra en el Nivel 3. Sueldo base de técnicos está dentro de costos fijos.

Sección 3 — Resultados actuales y funnel

Inversión de septiembre:

Meta: $4.000; 4.000 clics; CPC $1; 500 leads; CPL $8.

Google: $4.000; 1.600 clics; CPC $2,50; 100 leads; CPL $40.

Tasas del CRM:

Meta: contactados 55 %; contactados que agendan 30 %; agendadas que se realizan 70 %; visitas realizadas que cierran 18 %; teléfonos inválidos 18 %.

Google: contactados 85 %; contactados que agendan 55 %; agendadas que se realizan 85 %; visitas realizadas que cierran 30 %; teléfonos inválidos 3 %.

Las asesoras tardan en promedio 31 horas en llamar; llaman en horario de oficina, de lunes a viernes.

El mes pasado se firmaron 22 instalaciones; se instalan y cobran su segunda mitad en el mes actual.

No restar aparte el porcentaje de teléfonos inválidos si se aplica la tasa CRM de contacto por lead; no duplicar pérdidas.

Sección 4 — Batería

Precio de batería: $3.000.

Margen bruto: 20 %.

Comisión: 3 % también sobre la batería.

En una prueba, 3 de 20 clientes la agregaron (15 % observado). Extrapolar ese porcentaje a todos los clientes futuros es [SUPUESTO].

El caso no especifica cuándo se cobra ni cuándo se pagan costos de batería. No modelar su flujo de caja como hecho; si se incorpora, declarar esos tiempos como supuesto editable.

Sección 5 — Histórico inversión/leads

Puntos observados durante 12 meses:

Meta: $2.000→280 leads; $4.000→500; $6.000→680; $8.000→840; $10.000→960.

Google: $2.000→55; $4.000→100; $6.000→135; $8.000→160; $10.000→160. Google llega al máximo de 160 leads.

Para el Nivel 3, inversión $0 equivale a 0 leads; usar interpolación lineal, con recta desde cero al primer punto.

La propuesta teórica de la agencia usa CPL de Meta constante de $8 para $8.000. Debe compararse con el historial real de Meta: $8.000 → 840 leads.

Sección 6 — Contexto para la landing

2.300 seguidores de Instagram.

Competidor SolarMax cotiza la misma instalación en $7.200.

El caso dice que el cliente promedio ahorra 70 % del recibo.

La historia indica 420 casas instaladas y 4,9 estrellas en Google con 210 reseñas.

Solo usar estos datos como afirmaciones del caso ficticio y rotular el sitio como prototipo educativo. No inventar dirección, cobertura, teléfonos, certificaciones, garantías, financiamiento, promociones ni resultados individuales garantizados.

Sección 7 — Caja

Caja actual: $12.000.

Piso de seguridad: $5.000.

Costos fijos mensuales: $18.000 (sueldos base, oficina y bodega, camioneta, CRM y programas).

Mes 0: 22 ventas.

Caja final del mes = caja anterior + entradas − salidas.

Entradas mes t: 50 % del precio por ventas de t + 50 % por ventas de t−1.

Salidas mes t: 55 % equipos y 3 % comisión de ventas de t; 17 % instalación de ventas de t−1; $60 por visita realizada; inversión Meta y Google; $18.000 fijos; $1.800 por técnico extra desde el mes de contratación.

Ocho supuestos permitidos

En esta sesión, LTV de un cliente = contribución de una sola venta. No hay recompra; mantenimiento y referidos quedan para otra sesión.

Todo el embudo de un lead pasa en el mismo mes.

Tasas del funnel constantes frente a la inversión.

Si se supera capacidad, se atienden primero las visitas de Google y después las de Meta; el resto se pierde.

Interpolación lineal entre puntos del histórico. Inversión cero produce cero leads; desde cero al primer punto también usar línea recta.

Para escenario teórico de agencia se permite CPL Meta constante de $8; comparar siempre con el histórico real.

Mejora de respuesta/filtro: respuesta en menos de 5 minutos y preguntas “¿Es dueño de la casa?” y “¿Su recibo supera $80?”; baja 20 % los leads Meta y cambia tasas Meta a contacto 80 %, agenda 40 %, visita realizada 75 %, cierre 22 %. Marcar [SUPUESTO].

Cualquier dato no proporcionado puede suponerse solo si se marca, justifica y deja editable.

Fórmulas y números de control

Contribución por instalación = $6.500 × 28 % − $6.500 × 3 % = $1.625.

Funnel Meta: 500 leads → 275 contactos → 82,5 agendas → 57,75 visitas realizadas → 10,395 ventas.

Funnel Google: 100 → 85 → 46,75 → 39,7375 visitas realizadas → 11,92125 ventas.

Total actual: 97,4875 visitas pedidas/realizadas (bajo capacidad 100) y 22,31625 ventas.

CAC anuncios Meta = $4.000/10,395 ≈ $384,80. CAC real = ($4.000 + 57,75×$60)/10,395 ≈ $718,13. LTV ≈ 2,26. Visitas/venta ≈ 5,56.

CAC anuncios Google = $4.000/11,92125 ≈ $335,54. CAC real = ($4.000 + 39,7375×$60)/11,92125 ≈ $535,54. LTV ≈ 3,03. Visitas/venta ≈ 3,33.

Meta lead cuesta 5 veces menos por CPL, pero CAC real del cliente Meta es ≈34 % mayor que Google.

Valor de visita Meta = 18 %×$1.625−$60 = $232,50. Google = 30 %×$1.625−$60 = $427,50.

Batería: contribución por venta adicional = $3.000×20 %−$3.000×3 % = $510; valor esperado de $76,50 por venta solar solo si se extrapola el 15 % como [SUPUESTO].

Agencia teórica: 1.000 leads Meta → 115,5 visitas pedidas; por límite se hacen 100 → 18 ventas.

Agencia histórica: 840 leads Meta → 97,02 visitas → 17,4636 ventas, menos que las 22,31625 actuales.

Revisión caja mes 1 plan actual, con mes 0 de 22 ventas: caja final aproximada $15.736 (redondear a ≈$15.700). Mostrar todos los ingresos y egresos.

Payback unitario: empezar en −CAC real. El mes de firma: +$3.250−$3.575−$195 = −$520 (además del CAC ya desembolsado). Mes siguiente: +$3.250−$1.105=+$2.145. Con CAC Meta o Google del caso se recupera en el segundo mes del ciclo.

Requisitos de entrega del caso

Nivel 1

El usuario desarrollará por separado su hoja de Google Sheets. No es un entregable de Codex y Codex no debe crearla ni modificarla.

Si se encuentra el Excel del Nivel 1, puede utilizarse solo como referencia de lectura; nunca se debe sobrescribir.

Codex debe dejar trazables en Markdown las fórmulas, supuestos y escenarios necesarios para la recomendación de una página para Andrés y la lista “En qué se equivocó o nos confundió la IA”.

Los escenarios de referencia son hoy ($4k/$4k), agencia teórica ($8k/$0 con CPL Meta $8), agencia histórica ($8k Meta→840 leads) y un plan propio.

El análisis de cada cifra debe mostrar fórmula y fuente o etiqueta [SUPUESTO]. La validación financiera del sitio usará los controles de este contexto, independientemente de la hoja de Google Sheets del usuario.

Prioridad si falta tiempo: escenario actual completo → agencia → propio.

Nivel 2

Tablero interactivo web con inversión Meta/Google y datos históricos; 4 tasas de funnel por canal; costo de visita; capacidad/técnicos extra; precio, margen, comisión y porcentaje de batería.

Resultados en vivo por canal y total: leads, visitas, ventas, CPL, CAC anuncios, CAC real, LTV, visitas/capacidad, valor visita.

Al menos 3 gráficos: funnel lado a lado; CPL frente a CAC real; visitas pedidas vs capacidad con línea de 100.

Semáforo LTV, alerta de capacidad y visual explícito de la trampa.

Debe coincidir con los controles numéricos de este contexto bajo 1 % y tener botón de volver a los datos del caso.

Entregable del reto: una página HTML + JavaScript, sin instalación; Chart.js desde CDN permitido.

Nivel 3

Simulador mes 1–24; comprobar manualmente mes 1 plan actual antes de proyectar.

Comparar por lo menos 4 planes: actual, agencia, 2 propios (uno con técnico extra).

Reportar caja mínima y mes, caja al mes 24, instalaciones totales.

Gráficos caja y piso, visitas pedidas vs capacidad.

Reglas: caja ≥$5.000; desde mes 19 la inversión total no puede disminuir; máximo 2 técnicos extra.

Pitch de 2 minutos para banco: inversión por canal, cuándo contratar, riesgos y condiciones para crecer.

El facilitador debe poder reproducir el plan en el motor del sitio con diferencia máxima de 3 %.

Presentación

Presentación oral de 3 minutos, una decisión y números que la sostienen.

Orden sugerido: la trampa → números → recomendación → dos cambios → riesgos.

Preparar preguntas probables y respuestas.

Rúbrica: rigor numérico 25, criterio de negocio 30, uso de IA 15, claridad 20, visual 10; bonus Nivel 2 +10, Nivel 3 +15 y mejor plan +5.

Reglas de desarrollo del proyecto

Seguir la documentación de estructura y buenas prácticas compartida por el usuario:

Jerarquía: Componentes → Páginas → Rutas → App → main.jsx.

En React, crear componentes reutilizables que formen páginas, páginas que definan rutas, rutas declaradas en App y App montada desde main.jsx.

Organización por características de negocio (feature-based) y co-location de estilos, tipos, pruebas e historias cuando corresponda.

Nombres de archivos/carpetas en kebab-case; componentes React en PascalCase; variables y funciones en camelCase; handlers con prefijo handle; hooks personalizados con prefijo use.

Un componente por archivo; cada componente/función debe tener responsabilidad única; componentes grandes (aprox. 200 líneas o más) se dividen.

Limitar profundidad a 2–3 niveles; usar alias absolutos mediante jsconfig/tsconfig si el proyecto lo permite.

Componentes puros, estado inmutable, efectos secundarios en useEffect o handlers.

Hooks solo en nivel superior de componentes React u otros hooks.

Evitar duplicación, números mágicos, anidación profunda y optimización prematura. Extraer lógica reutilizable a servicios/hooks; medir antes de optimizar.

Usar lint/formatter existentes y mantener consola limpia.

Si el repositorio ya es React/Vite, seguirlo. Si no existe una app, crear React/Vite de forma ordenada; se permite instalar dependencias npm necesarias. No se requiere backend de producción. Para simular envíos del formulario, se permite json-server en desarrollo con db.json local, claramente etiquetado como mock, sin desplegarlo ni afirmar que recibe solicitudes reales. Además del sitio integrado, producir un HTML autónomo del Nivel 2 que funcione al abrirlo y no sea una copia manual de lógica distinta: debe compartir o generarse desde el mismo modelo.

Si el caso exige un HTML único para Nivel 2 y la app principal usa React, mantener ambos entregables coherentes; no sacrificar la jerarquía React del sitio.

Documentar en la carpeta markdowns/ los supuestos, fórmulas y decisiones importantes.

Landing para clientes

Presentar Sol de Casa como demo académica del caso ficticio. Usar solo hechos disponibles. Tratar el ahorro de 70 % como promedio reportado por el caso, no garantía. Formulario de demostración con validación. No requiere backend real; si se simula persistencia, puede usar json-server y db.json local en desarrollo. Avisar que solo se guarda en el mock local y no llega a Sol de Casa ni genera una cotización real. No inventar datos comerciales ausentes.