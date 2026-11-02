# Sol de Casa · prototipo educativo

Aplicación React/Vite con una landing ficticia, una calculadora financiera de Nivel 2, un simulador de caja a 24 meses y un formulario conectado únicamente a una API JSON local de demostración.

## Inicio local

Requiere Node.js y npm. Instala las dependencias una vez con `npm install`.

En una terminal, inicia el mock local:

```sh
npm run mock:api
```

En otra terminal, inicia el sitio:

```sh
npm run dev
```

Vite muestra la dirección local. El mock vive en `http://127.0.0.1:3001/solicitudes` y escribe en `db.json`. Solo existe para demostración en desarrollo. No lo despliegues ni publiques y no introduzcas datos sensibles. Las solicitudes no llegan a Sol de Casa ni inician una cotización real.

## Calculadora y HTML autónomo

La ruta `/calculadora` contiene el Nivel 2 interactivo. El HTML autónomo se genera con `npm run build:standalone` en `nivel-2-autonomo.html`; puede abrirse directamente en un navegador y comparte el modelo de cálculo fuente `src/features/unit-economics/unit-economics-model.js`.

`npm run build` construye la app y vuelve a generar el HTML autónomo. La calculadora no usa Google Sheets. También muestra un resultado operativo mensual de run-rate que descuenta anuncios, visitas, costos fijos y técnicos activos; no equivale a una proyección de caja.

## Simulador de caja · Nivel 3

Abre `/simulador-caja` para comparar el plan actual, la agencia teórica, la agencia histórica y dos planes propios durante 24 meses. La tabla y los gráficos aplican los cobros y pagos del caso en sus meses correspondientes. Puedes editar las inversiones mensuales, el CPL teórico, la retención y tasas de Meta de los planes, y el mes y cantidad de técnicos extra. El CPL teórico, el filtro y sus tasas, la contratación y mantener la pauta constante durante 24 meses son **[SUPUESTO]** y se muestran como tales.

El resultado marca si cada escenario conserva el piso de caja de $5.000 y si su inversión mensual cumple la regla de no bajar desde el mes 19. El simulador comparte el embudo del Nivel 2; no representa una oferta de crédito ni garantiza ventas. Lee [la implementación del Nivel 3](markdowns/nivel-3-implementacion.md) para fórmulas, supuestos y controles.

## Documentación del modelo

Consulta la [implementación del Nivel 3](markdowns/nivel-3-implementacion.md), [implementación del Nivel 2](markdowns/nivel-2-implementacion.md), el [modelo auditado](markdowns/sol-de-casa-nivel-1-modelo.md) y la [auditoría](markdowns/auditoria-nivel-1.md).

La [auditoría final](markdowns/auditoria-final-sol-de-casa.md), [sensibilidad](markdowns/sensibilidad-final-nivel-3.md) y [presentación oral](markdowns/presentacion-oral-final.md) reúnen los resultados de la revisión final.

## Analista de unit economics con n8n

La calculadora incluye un panel para consultar sus entradas y resultados activos. El workflow importable está en `n8n/workflows/sol-de-casa-unit-economics-analyst.json`; requiere configurar en n8n una credencial del proveedor y seleccionar un modelo. Copia `.env.example` a `.env.local`, configura la URL de prueba del webhook y reinicia Vite. No se envían datos del formulario de demostración.

Consulta [el contrato, la configuración y las verificaciones del analista](markdowns/analista-unit-economics-n8n.md). `npm run build:analyst-workflow` regenera el JSON y `npm run verify:analyst` comprueba el contrato y las referencias del modelo. La IA calcula, el equipo decide.
