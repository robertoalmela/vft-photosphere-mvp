# OpenCode Handoff

Implementa el primer entregable del proyecto `vft-photosphere-mvp` dentro de este repo.

## Contexto
Queremos una PWA inspirada en VFT/Stanford para crear fotos 360 con móvil sin cámara 360. El foco inicial NO es el stitching premium, sino la experiencia guiada de captura y la estructura técnica correcta.

Lee antes:
- `README.md`
- `PRODUCT.md`
- `DESIGN.md`
- `docs/IMPLEMENTATION_PLAN.md`

## Tu misión
Construye el primer entregable funcional:
- scaffold de app en `app/`
- Vite + TypeScript + PWA
- shell mobile-first
- flujo de permisos
- base de pose/orientación
- patrón de hotspots 24 y 36
- HUD/overlay de guía
- captura y guardado local básico
- revisión/export simple

## Restricciones
- No metas backend
- No metas OpenCV
- No metas librerías innecesarias
- Prioriza Android Chrome y Safari iPhone modernos
- Si una parte no llega, deja la estructura y TODOs claros

## Verificación obligatoria
Antes de terminar:
1. ejecuta `npm install`
2. ejecuta `npm run build`
3. resume exactamente:
   - archivos creados/modificados
   - qué funciona ya
   - qué queda pendiente
   - comandos ejecutados y resultado

## Calidad
- código limpio y modular
- nombres claros
- comentarios solo donde aporten
- evita placeholders vacíos
