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
3. Select **Start sculpting**, then use Build, Carve, or Smooth. Adjust brush size, strength, and symmetry.
4. Save an editable JSON project or export an OBJ. Returning to the skeleton discards sculpted details after a warning; Undo can restore the previous state.

Two fingers orbit and zoom. Use Orbit for one-finger navigation. Projects also autosave in the browser, subject to available browser storage; keep exported project backups.

## Known limitations

Painting, posing after sculpting, additional brushes, and a complete 123D Creature workflow are not implemented. Symmetry identifies matching joints by position, so it is not a persistent explicit pairing and may not find previously asymmetric joints. Mesh generation and sculpting run on the main thread and have not been benchmarked on target phones. Exports are not verified print-ready. Phone touch usability and older iPad compatibility need device testing.
