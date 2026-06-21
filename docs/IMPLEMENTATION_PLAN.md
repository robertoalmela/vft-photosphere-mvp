# VFT Photosphere MVP Implementation Plan

> Para OpenCode: ejecuta este plan dentro de este repo y prioriza un MVP funcional verificable. No metas complejidad innecesaria.

**Goal:** levantar una PWA móvil que guíe la captura estructurada de una photosphere usando sensores del móvil y exporte las capturas con sus metadatos.

**Architecture:** app web mobile-first en Vite + TypeScript. Separar captura, pose, almacenamiento, preview y export. El stitching avanzado queda desacoplado del flujo base.

**Tech Stack:** Vite, TypeScript, Three.js, IndexedDB, PWA plugin, CSS simple sin framework pesado.

---

## Fase 0 — Bootstrapping
- Crear app Vite + TS dentro de `app/`
- Configurar PWA installable
- Añadir scripts `dev`, `build`, `preview`
- Crear estructura modular mínima
- Añadir README corto técnico en `app/`

## Fase 1 — Shell móvil + permisos
- UI vertical mobile-first
- Pantalla inicial con CTA
- Gestión de permisos: cámara + motion
- Mensajes claros para iPhone/Android
- Bloqueo/degradación si no hay portrait o motion

## Fase 2 — Pose + hotspots
- Implementar normalización yaw/pitch/roll
- Smoothing básico
- Presets de hotspots 24 y 36
- Selección del hotspot objetivo más cercano
- Umbrales de approaching/aligned/level

## Fase 3 — Captura guiada
- Overlay HUD con instrucciones
- Countdown de auto-captura
- Captura de frame desde cámara
- Persistencia local en IndexedDB
- Progreso visual por cobertura

## Fase 4 — Revisión + export
- Mini galería de capturas
- Repetir hotspot concreto
- Exportar JSON de sesión + imágenes
- Si da tiempo, ZIP descargable

## Fase 5 — Preview 3D básico
- Esfera o visor simple con hotspots capturados
- Diferenciar pendientes/capturados
- Navegación mínima de revisión

## Criterios de aceptación del primer entregable
1. `npm install` funciona
2. `npm run build` funciona
3. existe una PWA arrancable en `app/`
4. se puede abrir la cámara
5. se puede iniciar una sesión de captura guiada
6. al menos guarda y lista capturas simuladas o reales con metadatos
7. documentación mínima actualizada

## Reglas de implementación
- no uses OpenCV en este primer entregable
- no sobrediseñes stitching ahora
- prioriza flujo real y estable de captura
- mantén módulos pequeños y legibles
- deja TODOs explícitos para lo no terminado

## Comandos de verificación esperados
- `cd app && npm install`
- `cd app && npm run build`
- opcional: `cd app && npm run dev -- --host 0.0.0.0`

## Entregables mínimos
- código base en `app/`
- PWA funcional compilable
- docs actualizadas
- lista clara de siguiente fase técnica
