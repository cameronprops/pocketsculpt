# Mesh stability audit

Based on the supplied Pocket Sculpt engineering brief. Status is partial and does not establish the brief's definition of done.

- P0-01 partial: body meshes are indexed Three.js triangle buffers generated from a skeletal field. Strokes change vertex positions in place. Undo records snapshots. Carve, Sharpen, Build, Flatten, Smooth and Grab pass through a local orientation backtracking guard. The guard does not detect self-intersections or perform adaptive remeshing. Repeated unsharp sharpening amplified local irregularity, so Sharpen now uses bounded tangential pinching.
- P0-02 partial: `validateMesh` reports nonfinite vertices, invalid indices, degenerate faces, collapsed edges, boundary edges, non-manifold edges and inconsistent winding. Boundaries are reported, not automatically rejected, because open surfaces may be intentional. This utility is not yet wired into all import, export or brush paths; it does not find self-intersections or globally inverted closed shells.
- P0-03 partial: the existing guard backtracks deforming brushes and rejects nonfinite candidates. Collision detection and full stroke transaction semantics remain open.
- P0-04 through P0-06 remain open: per-update displacement is capped using local mean edge length, but curvature-aware limits, topology changes and smoothing still need investigation and separate regression/performance work.

Validation: `npm run test:mesh-validation` covers open edges, indices, degeneracy, nonfinite rollback, inconsistent winding, non-manifold edges and collapsed edges. `npm run test:sharpen` exercises repeated strokes on a curved mesh. This does not prove reliability on a device or arbitrary meshes.

One container run of `npm run bench:mesh`: 22-joint maquette 411 ms total (292 mesh, 31 smooth, 88 projection); 42-joint maquette 1490 ms (1134 mesh, 41 smooth, 315 projection). These vary with machine and load, do not measure brush latency or mobile, and are not a controlled before/after comparison.
