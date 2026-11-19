# Pocket Sculpt engineering punch list

Derived from the supplied engineering brief. A checked item requires its stated acceptance criteria, not just a prototype. See `docs/mesh-stability-audit.md` for evidence and limitations. Existing `PUNCHLIST.md` remains in effect.

## P0: Stable sculpting
- [ ] P0-01: Audit mesh, winding, normals, undo and brush root causes. Partial audit documented; reproduce all reported failures.
- [ ] P0-02: Mesh diagnostics for invalid data, degenerate/collapsed faces and edges, winding, boundaries and non-manifold geometry. Utility and tests exist; integrate where appropriate and distinguish intentional open surfaces.
- [ ] P0-03: Transactional deformations with safe rollback and undo. Carve, Sharpen, Build, Flatten, Smooth and Grab use local triangle-orientation guards; full transaction, self-intersection and all failure-path tests remain.
- [ ] P0-04: Limit stroke displacement against local edge length and curvature; test repeated strong and small-radius strokes. Partial: per-update displacement is capped against local mean edge length; curvature and complete repeated-stroke coverage remain.
- [ ] P0-05: Evaluate localized adaptive remeshing, including split/collapse/flip/relax and attributes.
- [ ] P0-06: Evaluate non-shrinking smoothing and volume behavior.

## P1: Anatomy and garments
- [ ] P1-01: Evaluate variable-radius skeletal fields and controllable branch blends.
- [ ] P1-02: Improve human and creature joint transitions with reference-based pose tests.
- [ ] P1-03: Separate, selectable, sculptable thin garment shells with controlled openings and thickness.
- [ ] P1-04: Garment/body and garment/self collision detection and correction.
- [ ] P1-05: Sculpted wrinkles, folds, seams and silhouette without damage or unwanted inflation.

## Massing primitives and kitbashing
- [x] Prototype model-axis aligned sphere, box and cylinder node primitives, with per-node scale and project persistence.
- [ ] Add rotation/local axes, selectable blend behavior, additional closed primitives and sharp-edge controls.
- [ ] Validate complex assemblies, Boolean operations, export and Buildercraft interchange.

## P2: Extendable geometry
- [ ] P2-01: Evaluate sparse distance fields where topology changes justify them.
- [ ] P2-02: Stable node graph, transforms, hierarchy, metadata and blend controls independent of rendering.
- [ ] P2-03: Reserve optional future pose, blend, interpolation and time metadata without implementing animation yet.
- [ ] P2-04: Benchmark WebAssembly or native geometry kernels against measured bottlenecks.

## P3: Portability and Buildercraft
- [ ] P3-01: Measure performance on Galaxy; verify original iPad Pro capabilities and compatibility.
- [ ] P3-02: Separate reusable core/data from UI and test direct Buildercraft scene import.
- [ ] P3-03: Keep integration secondary to reliable sculpting.

## Acceptance checks
- [ ] Repeated strong, tiny-radius and alternating strokes: valid geometry, no unintended holes, reversible undo, acceptable latency.
- [ ] Anatomy: recognizable proportions and controlled transitions across extreme poses.
- [ ] Garments: intended openings retained, sculptable surface, no new holes or intersections, consistent fit.
- [ ] Mobile: record input latency, memory and frame stalls on real devices.
