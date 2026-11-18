# Pocket Sculpt

Android-first, touch-first creature modeling experiment inspired by the **skeleton-to-body workflow** of Autodesk 123D Creature. The goal is a customizable sculpting experience for Samsung Galaxy, with a later adaptation for the original 2015 iPad Pro.

## Try it

Open `index.html` in a modern browser. For easy testing on a phone, publish the repository using GitHub Pages or another static host. This is currently a single-file prototype, not an Android APK.

## Current prototype

- Move joints and adjust their radius
- Add branching limbs, with optional mirrored additions from the centerline
- Orbit and pinch-zoom the view
- Toggle a rough body preview
- Save and reopen editable JSON projects
- Export a preliminary OBJ

**Limitations:** The preview uses overlapping volumes, not a watertight unified mesh. The OBJ is a preliminary geometry export, not print-ready. Rendering is currently 2D canvas projection rather than a full GPU 3D renderer. This is a technical prototype and has not been tested on the target Galaxy device.

## Roadmap

1. Test and refine Android touch interaction and camera gestures
2. Implement true 3D rendering and reliable mesh generation from skeleton branches
3. Produce a single manifold body mesh with controllable resolution
4. Add brush-based sculpting, symmetry, undo/redo, and local persistence
5. Add STL/OBJ import/export, optimization, and installable PWA packaging
6. Adapt for the original iPad Pro

## Development

The source currently lives in `index.html`, with no build dependencies. The project will be modularized once the core modeling workflow is validated.

This is an independent project, not affiliated with Autodesk.
