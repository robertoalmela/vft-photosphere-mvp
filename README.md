# VFT Photosphere MVP

MVP propio inspirado en el patrón de captura guiada de VFT/Stanford para crear fotos 360 con móvil sin cámara 360.

## Objetivo
Construir una PWA móvil que guíe al usuario con sensores del teléfono, capture una secuencia estructurada de fotos y genere/exporte una photosphere equirectangular.

## Estado
Bootstrapping inicial + plan + handoff a OpenCode.

## Estructura
- `PRODUCT.md` — producto y alcance
- `DESIGN.md` — arquitectura técnica
- `docs/IMPLEMENTATION_PLAN.md` — plan detallado por fases
- `docs/OPENCODE_HANDOFF.md` — prompt operativo para OpenCode
- `app/` — código de la aplicación (a generar)

## Meta MVP v0
1. PWA móvil en vertical
2. Patrón de 24-36 hotspots guiados
3. Auto-captura por alineación + nivel
4. Guardado local de capturas y metadatos
5. Preview 3D básico
6. Export inicial de panorama o dataset de capturas

## Nota
Primero validamos UX de captura. El stitching final de máxima calidad puede entrar como fase 2 si ralentiza demasiado el MVP.
