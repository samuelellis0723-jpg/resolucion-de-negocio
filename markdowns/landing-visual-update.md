# Actualización visual de la landing

## Dirección visual

La landing conserva la paleta bosque, papel y amarillo solar existente, con una tipografía editorial serif para los encabezados. Una fotografía arquitectónica ocupa el hero; una segunda toma de techo y paneles acompaña el cierre. El resto del recorrido usa espacio, cifras del caso y texto para evitar añadir componentes del sistema que el repositorio no documenta.

## Activo fotográfico

- Archivo: `src/features/landing/assets/solar-home-generated.jpg`.
- Origen: generado para este prototipo con una herramienta de generación de imágenes; no procede de un cliente ni de una instalación real.
- Tratamiento: JPEG, 1536 × 1024 px, calidad 84; 407.792 bytes frente a los 3.003.321 bytes del PNG intermedio.
- Archivo complementario: `src/features/landing/assets/solar-roof-detail-generated.jpg`, generado para este prototipo en la misma resolución y calidad, con 292.049 bytes frente a los 2.560.161 bytes del PNG intermedio.
- Uso: la primera imagen aparece en el hero y la toma de detalle junto al formulario. Ambas identifican la escena como generada y no real.
- Texto alternativo del hero: describe la vivienda y los paneles e indica que no representa una instalación real de Sol de Casa.

## Comportamiento

- Los textos y la fotografía permanecen visibles por defecto. Tras montar React, `IntersectionObserver` habilita revelados moderados de opacidad y posición; si JavaScript, `IntersectionObserver` o el movimiento reducido lo impiden, el contenido permanece legible.
- El movimiento de profundidad solo afecta a la fotografía del hero, usa desplazamiento limitado y se puede pausar o reactivar con un botón accesible.
- `prefers-reduced-motion: reduce` desactiva el parallax, oculta el control de movimiento y evita los revelados.
- Se conservan las rutas de calculadora y simulador, el ancla del formulario, los datos ficticios documentados y el aviso de ahorro promedio no garantizado.
- El formulario sigue usando únicamente el mock JSON local; no se introdujo una integración o backend de producción.

## Referencias

Se intentó abrir Hozon y Pradiplabs, pero no estaban accesibles en el navegador gráfico ni en la vista web disponible durante esta implementación. La dirección se definió con los patrones descritos en el encargo, sin atribuir detalles no comprobados a esos sitios.
