# Technical Design — VFT Photosphere MVP

## Stack propuesto
- Vite
- TypeScript
- PWA plugin
- Three.js para visualización/escena/hotspots
- IndexedDB para capturas
- Canvas/WebGL para transforms ligeras
- Sin OpenCV en fase 1

## Principio de arquitectura
Separar claramente:
1. captura guiada,
2. almacenamiento local,
3. preview/cobertura,
4. export,
5. stitching posterior.

Así validamos el producto aunque el stitching avanzado tarde más.

## Módulos
### `app/core/`
- `AppController.ts` — orquesta estados
- `Permissions.ts` — cámara, motion, orientación
- `DevicePose.ts` — normaliza yaw/pitch/roll y smoothing
- `CaptureSession.ts` — estado de hotspots y sesión

### `app/capture/`
- `CameraService.ts` — getUserMedia + frame capture
- `AlignmentEngine.ts` — calcula hotspot más cercano, umbrales, countdown
- `HotspotPatterns.ts` — presets 24/36

### `app/storage/`
- `db.ts` — IndexedDB
- `exports.ts` — export zip/json/images

### `app/view/`
- `SceneView.ts` — esfera/hotspots/progreso
- `OverlayHUD.ts` — nivel, instrucciones, countdown
- `ReviewGallery.ts` — revisar/repetir capturas

### `app/stitch/`
- `StitchPrep.ts` — proyección, normalización, empaquetado
- `WorkerBridge.ts` — futuro worker para stitching

## Flujo principal
1. usuario abre la app
2. concede permisos
3. app fuerza portrait
4. elige modo rápido (24) o calidad (36)
5. se inicia sesión vacía
6. overlay apunta al siguiente hotspot
7. cuando alignment < umbral y roll < umbral durante X ms → auto-captura
8. se guarda imagen + pose + hotspot
9. preview marca cobertura
10. al terminar: revisar, repetir fotos malas, exportar

## Umbrales iniciales
- approaching: ~12–15°
- aligned: ~4–5°
- level: ±2.5°
- hold-to-capture: 700–1000 ms

## Decisiones técnicas para MVP
- usar patrón 24 por defecto para bajar fricción
- mantener 36 como modo calidad
- exportar dataset completo aunque el stitching final sea básico
- si hay problemas de memoria en iPhone: bajar resolución automáticamente

## Riesgos
- APIs motion en iOS requieren gesto/permisos especiales
- inconsistencia de yaw absoluto entre navegadores
- memoria y canvas grandes en Safari
- stitching robusto no debe bloquear el MVP

## Estrategia de verificación
- dev local en móvil/emulación
- pruebas manuales de permisos
- prueba de sesión completa con datos reales
- build de producción sin errores
