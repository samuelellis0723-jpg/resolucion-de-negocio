# Sol de Casa · prototipo educativo

Aplicación React/Vite con una landing ficticia, una calculadora financiera de Nivel 2 y un formulario conectado únicamente a una API JSON local de demostración.

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

## Documentación del modelo

Consulta [la implementación del Nivel 2](markdowns/nivel-2-implementacion.md), el [modelo auditado](markdowns/sol-de-casa-nivel-1-modelo.md) y la [auditoría](markdowns/auditoria-nivel-1.md).
