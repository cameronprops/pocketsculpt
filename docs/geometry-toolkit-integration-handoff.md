# Pocket Sculpt Geometry Toolkit: Integration Handoff

Status: **instructions only, not implemented**  
Target repository: `cameronprops/pocketsculpt`  
Target: main development conversation / coding agent  
Priority: **integrate incrementally before developing standalone v0.4**

## Goal

Bring the independently prototyped Geometry Validation Toolkit (v0.1 through v0.3) into Pocket Sculpt without breaking the existing touch-first creature workflow. Use it first as a **read-only diagnostic layer**, then progressively enable safety controls. Pocket Sculpt is intended to integrate into BuilderCraft, so keep geometry algorithms independent of UI and rendering.

**Important:** The earlier toolkit ZIPs were generated in another conversation and are not committed to this repository by this handoff. The agent must obtain those archives from the user or rebuild and test the algorithms from the specifications below. Do not claim integration or passing tests based only on this document.

## First: inspect actual code

1. Inspect the entire repository and latest commits, not just the README. The README may be stale.
2. Identify actual application entry points, mesh representation, brush implementations, skeleton-to-mesh generation, group/layer representation, renderer, and test runner.
3. Determine whether the app is still a single-file prototype or has been modularized. Avoid introducing a build system unless needed.
4. Run the existing tests and record baseline performance and failures.
5. Review the available v0.3 ZIP before importing any code. Check API compatibility, correctness, and test quality.

## Intended reusable structure (adapt to actual repo)

```text
packages/geometry-core/
  validation/
  spatial/
  collision/
  remeshing/
  primitives/
  brushes/
  tests/
apps/pocket-sculpt/
apps/buildercraft/
```

This is a *logical* architecture, not an instruction to move the repository into a monorepo immediately. A local `geometry-core/` directory or library is fine until shared packaging makes sense.

## Integration phases and acceptance criteria

### P0-01: non-destructive diagnostics (low risk)

- Add mesh validators for index range, finite coordinates, degenerate triangles, inconsistent adjacent-face winding, boundary edges, non-manifold edges, and disconnected components.
- Closed-solid checks must not reject intentionally open garments or sheet meshes.
- Hook validation into sculpt/mesh generation as optional diagnostics; **do not modify user geometry**.
- Report counts, affected face IDs, and timings in a developer-accessible diagnostic view or log.
- Acceptance: same visual and edit behavior as baseline; invalid fixtures are detected; valid open surfaces are not falsely rejected as closed solids.

### P0-02: spatial acceleration and brush selection (medium risk)

- Add a triangle BVH (bounding volume hierarchy), with conservative AABB intersection tests.
- Use triangle-to-brush-volume overlap tests, not vertex-inside-radius alone: a brush may intersect a triangle without containing any vertex.
- Identify dirty faces and nearby collision candidates, excluding shared-vertex/edge neighbors where their contact is topologically expected.
- Compare accelerated collision results to a brute-force reference on small test meshes.
- Acceptance: same detection results as reference fixtures, no missed intersections in the test suite; collect timings on representative mobile-scale meshes.

### P0-03: safe brush transactions (medium risk)

- Treat each brush stroke step as a proposed edit, validate locally, then commit or reject/attenuate the step.
- Detect near-zero area triangles, non-finite positions, orientation reversals relative to the pre-stroke surface, and detected nonadjacent triangle intersections.
- A normal reversal alone is **not** proof of invalid geometry. Use context and tolerances; preserve legitimate edits and intentional topology changes.
- Ensure undo/redo retains correct geometry and metadata.
- Acceptance: repeated carve/sharpen/high-strength strokes do not silently corrupt test meshes; existing strokes remain functional.

### P1-01: controlled local remeshing (higher risk)

- Start with conforming edge splits (avoid T-junctions).
- Then evaluate curvature-adaptive target edge lengths, edge collapses, edge flips, and smoothing with feature preservation.
- Maintain stable mesh IDs or remap IDs/polygroups explicitly after topology changes.
- Benchmark edits and check for changed volume, normals, boundaries, and group assignment.
- Acceptance: valid output and no unintended holes after repeated edits; measurable local update cost.

### P1-02: skeleton and joint quality (later)

- Evaluate capsule/variable-radius curve implicit fields and controlled smooth unions.
- Avoid puffy shoulders and hips and unintended merging of nearby limbs.
- Keep editable skeleton graph and polygroups independent of generated mesh.
- Preserve multiple separate skeletons and body-part separation.

### P1-03: thin-shell garments (later)

- Keep clothing as independent surface objects with open boundaries, controllable offset/thickness, and body collision constraints.
- Do not force all garments to become watertight solids.
- Add tests for neck/sleeve/hem boundaries and wrinkles.

## v0.1 to v0.3 toolkit inventory (reported in previous conversation; independently verify)

- v0.1: triangle/edge validity, safe brush prototype, box primitive, smooth-min helper; 10 tests reportedly passing.
- v0.2: triangle intersections including coplanar cases, connected components, inward-oriented closed components, conforming edge subdivision, collision-aware brush prototype; 21 tests reportedly passing.
- v0.3: triangle BVH, dirty-region collision queries, local brush-region selection, vertex-manifold validation; 32 tests reportedly passing.
- Known v0.3 limitations: BVH rebuilt per collision check; vertex-only brush selection can miss intersected triangles; curvature-aware remeshing, edge collapse, edge flipping, and comprehensive performance benchmarks not implemented.
- Test counts are **historical claims, not verified in this repository**.

## Reference mathematical checks

Wolfram calculations were successfully evaluated:

- `Cross[{1,0,0},{0,1,0}].Cross[{1,0,0},{0,-1,0}]` => `-1` (orientation reversal of test normals).
- Polynomial smooth-min with `a=-0.3`, `b=-0.1`, `k=0.6`, `h=Clip[1/2+(b-a)/(2k),{0,1}]`, `(1-h)b+ha-kh(1-h)` => `-0.3666666666666667`.
- These are reference unit-test values, not proof of whole-mesh correctness.

## Required regression fixtures

- Closed cube, open quad sheet, two disconnected components, reversed closed shell, degenerate triangle, zero-length edge, non-manifold edge and vertex.
- Crossing triangles, coplanar overlap, adjacent triangles that legitimately touch, distant triangles.
- Brush crossing triangle with no vertex inside brush radius.
- Repeated carve, sharpen, smooth, inflate, high-strength edits, near thin surfaces, and undo/redo.
- Subdivision must preserve shared-edge conformity and track group assignments.
- Shoulder, hip, elbow, knee, and branching creature limb; garment collar/sleeve/hem.
- Benchmark mesh counts, latency, memory, BVH rebuild/refit, and target Galaxy browser performance.

## Constraints

- No destructive rewrite of Pocket Sculpt.
- Keep Android touch-first and older iPad compatibility goals.
- Respect existing scene units, hard-surface primitives, snapping, separate skeletons, and polygroups.
- Do not merge mesh components merely because they overlap.
- Preserve editable project format; version migrations if schema changes.
- Prefer JavaScript/TypeScript first; consider WebAssembly only after profiling.
- Keep any shared geometry library free of UI and platform dependencies.
- Do not claim mobile performance without device testing.

## Requested workflow for the main development conversation

1. Review this handoff and current repository.
2. Add these items to the existing punchlist, avoiding duplicates.
3. Obtain or reconstruct toolkit code, and rerun tests.
4. Implement P0-01 in a small reviewable change, with diagnostics off by default.
5. Then proceed through P0-02 and P0-03 after tests and benchmarks.
6. Record each change, validation result, remaining risks, and next task.
7. Preserve existing app behavior throughout.

**Definition of done for the first integration:** a real Pocket Sculpt mesh can be passed to a reusable validator, diagnostics are inspectable, no user mesh is mutated, tests pass, and the current application still works.
