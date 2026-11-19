# Sculpt+ feature target

This is a working checklist, not a claim of exact parity. Version differences between 123D Creature and Sculpt+ need verification against screenshots, documentation, or the original app. Pocket Sculpt's armature and labels are an independent implementation.

Sources:
- Sculpt+ book contents: https://www.oreilly.com/library/view/3d-cad-with/9781449343002/
- 123D Creature sculpting overview: https://static1.squarespace.com/static/51aaa939e4b02f35a70f62e6/t/53da4518e4b049ed3c3f230e/1406813464630/123D%2BCreature.pdf
- 123D Creature tutorial: https://spolearninglab.com/curriculum/software/3d_modeling/123dcreature_intro.html

## Skeleton
- [~] Create limbs, move, shape and pose: basic implementation; needs interaction and quality work.
- [ ] Insert joint on bone, merge joints, cut/copy/paste and limb scale.
- [~] Symmetry: basic geometric matching, not stable semantic pairing.
- [~] Bake: generates a sculptable triangle mesh; quality/performance not yet at target.

## Sculpt
- [~] Out, In, Smooth, Flatten and Grab: implemented, require device and behavior validation.
- [ ] Sharpen and its behavior.
- [~] Brush size, strength and symmetry: basic controls.

## Paint and image rub
- [~] Vertex color paint, fixed swatches, custom color: basic.
- [ ] Persistent custom swatches and distinct hard/soft brush behavior.
- [ ] Image rub, photos, camera, pattern, face and texture selection.
- [ ] UV unwrap, bake vertex or projected paint to a texture, textured export.

## Presentation and project management
- [ ] Gallery, multiple saved projects, import/export workflow and thumbnail previews.
- [ ] Environment, lights, backgrounds, compositing and image export.
- [~] JSON save/open, undo/redo, OBJ export: basic; no print validation.
- [ ] STL export and model validation.
- [ ] Orbit, zoom, pan and multi-touch parity: pan remains missing.

## Requested extensions
- [~] Joint labeling and transfer of unbaked armature branches.
- [ ] Rigging/weights and posing after sculpting; preserve paint.
- [ ] Labeled reusable sculpted parts, directional matching and mashups.
- [ ] Layers, accessories, draped garments, quad/SubD workflow and NURBS handoff.

[~] means an initial implementation, not verified parity. Exact behavior, original starter assets, and target-device performance remain unverified.
