# Pocket Sculpt shared contract v1

This file is intentionally identical on `main` and `web-v0.6.1`. It is the interoperability agreement, not a claim that both applications implement every feature yet.

## Creature document

JSON object with fields:

- `format`: `"pocketsculpt-creature"`
- `version`: `1`
- `joints`: array of `{id,x,y,z,r}` with unique nonnegative integer IDs, finite positions, and radius > 0
- `edges`: array of two-element joint ID pairs `[parent,child]`
- `selected`: optional joint ID used only by the editor

Units are arbitrary model units; the same coordinate system and scale apply on both platforms. X is left/right, Y is up, Z is depth. Exported OBJ uses the same coordinate system.

## Geometry

The web implementation currently uses a smooth-min signed-distance union of tapered capsules and joint spheres, sampled on a grid and polygonized with tetrahedra. Native Android currently renders overlapping primitives. **They are not yet geometry-equivalent.**

The shared target is one connected, consistently oriented, closed 2-manifold triangle mesh per connected skeleton component. Branching and rounded junctions must not leave seams.

## Validation and performance

1. Reject nonfinite coordinates/radii and dangling edge IDs before meshing.
2. Enforce vertex and grid-cell budgets; do not block the UI while generating high-detail meshes.
3. Use low-resolution preview during editing, refine after gesture completion.
4. Check triangle degeneracy, duplicate faces, manifold edge incidence (two triangles per undirected edge), and winding.
5. Compare Android and web results using the same fixtures and tolerance-based bounding boxes, triangle counts, and surface samples.

## Shared fixture

See `shared/fixtures/creature-v1.json`. Both implementations should load it and preserve IDs, coordinates, radii, and edge connectivity on save. Existing legacy web saves can be migrated to this envelope.

## Branch discipline

- Android native implementation stays on `main`.
- Web implementation stays on `web-v0.6.1`.
- Changes to this contract or fixtures should be applied to both branches in separate commits.
- Record parity failures and benchmarks in this document rather than silently treating one implementation as authoritative.
