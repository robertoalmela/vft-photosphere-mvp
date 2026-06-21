# Product Brief — VFT Photosphere MVP

## Problema
Hacer una foto 360 con móvil sin cámara 360 suele ser tedioso: el usuario no sabe dónde apuntar, cuánto girar ni cuándo disparar, y luego el procesado falla o tarda demasiado.

## Propuesta
Una PWA móvil que:
- guíe al usuario visualmente por una secuencia óptima de capturas,
- use giroscopio/acelerómetro para validar alineación y nivel,
- auto-dispare cuando la posición sea correcta,
- procese localmente lo suficiente para dar feedback inmediato,
- y exporte una photosphere o un paquete de capturas listo para stitching.

## Usuario objetivo
- gente con móvil que quiere una foto 360 sin comprar cámara 360,
- creadores, inmobiliaria, turismo, documentación de espacios,
- uso casual pero con experiencia guiada y sencilla.

## MVP — Alcance estricto
### Incluye
- PWA instalada en móvil
- orientación vertical obligatoria
- permisos de cámara + motion
- patrón de 24 hotspots por defecto (3×8) o 36 opcional por flag
- overlay de alineación y nivel
- auto-captura con temporizador corto
- guardado local de imagen + yaw/pitch/roll/timestamp
- preview 3D de cobertura capturada
- export JSON + imágenes
- visor simple de revisión

### No incluye en v0
- stitching premium tipo producto final comercial
- IA de relleno avanzada
- sincronización cloud
- colaboración multiusuario
- edición avanzada

## Criterios de éxito MVP
- un usuario nuevo entiende la captura sin tutorial largo
- puede completar una sesión en menos de 3 minutos
- la app no se rompe en Android moderno
- el flujo base funciona en iPhone reciente aunque con calidad reducida
- las capturas y metadatos exportados son consistentes

## Diferenciadores respecto a Stanford/VFT
- UX más clara
- patrón adaptable (24 rápido / 36 calidad)
- mejor feedback de cobertura
- arquitectura limpia sin mezcla rara OpenCV/WebGL heredada
- posibilidad de separar captura y stitching
