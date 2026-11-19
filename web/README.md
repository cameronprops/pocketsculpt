# Pocket Sculpt Web

A touch-first creature builder inspired by the skeleton-to-sculpt workflow of 123D Creature. This development branch is an early prototype, not a complete clone.

## Run

```sh
cd web
npm install
npm run dev
```

Run `npm run build` to check TypeScript and create a production build.

## Current workflow

1. Move joints and add or remove branches. Symmetry mirrors edits when a matching joint can be found.
2. Adjust joint radii and select surface detail. The body uses a lower-detail preview while a joint is dragged.
3. Select **Start sculpting**, then use Build, Carve, Smooth, or Paint. Choose a paint color in the side panel. Adjust brush size, strength, and symmetry.
4. Save an editable JSON project, including paint, or export an OBJ with per-vertex color. OBJ vertex colors are an extension and may not appear in every importer. Returning to the skeleton discards sculpted details after a warning; Undo can restore the previous state.

Tools sit on the shelf beside the canvas (or along the bottom on a phone). Open Settings for brush and document controls, and use ? for gesture help. Drag two fingers to pan, or pinch to zoom. Use Orbit to rotate. A stationary first finger does not apply a brush mark when the second finger starts a gesture. Use Orbit for one-finger navigation. Undo and Redo restore edits, including paint and transitions between stages. Projects also autosave in the browser, subject to available browser storage; keep exported project backups.

## Known limitations

Texture-map painting, posing after sculpting, additional brushes, and a complete 123D Creature workflow are not implemented. Symmetry identifies matching joints by position, so it is not a persistent explicit pairing and may not find previously asymmetric joints. Mesh generation and sculpting run on the main thread and have not been benchmarked on target phones. Exports are not verified print-ready. Phone touch usability and older iPad compatibility need device testing.
