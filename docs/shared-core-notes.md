# Shared modeling core: initial direction

Pocket Sculpt remains functional as a web application. A future shared core can serve the web, Android, iOS and Buildercraft, but language choice and migration should be based on measured workloads and compatibility tests. Rust is a candidate, not a committed rewrite.

## Node metadata

A joint may contain optional `metadata`, a JSON object. Namespaced keys are recommended, for example `{"buildercraft":{"category":"hinge"},"study":{"description":"left hand"}}`. JSON-compatible nested objects, arrays and finite numbers are accepted with depth and size bounds. It is persisted with existing project JSON and copied when attaching branches. It has no automatic animation behavior. Unknown metadata keys are retained. Position and scale fields remain the current editable transform; metadata does not override them.

## Baseline

Run `npm run bench:mesh` in `web`. This measures JavaScript mesh generation, smoothing and surface projection for the balanced maquette, with and without fingers. Results depend on hardware, warmup and load; these numbers are diagnostic, not device performance guarantees. Measure on target hardware and compare geometry and latency before choosing a native or WebAssembly implementation.

One container run, 2026-11-18: 22 joints / 8,854 vertices: mesh 223 ms, smooth 29 ms, project 77 ms; 42 joints / 22,838 vertices: mesh 987 ms, smooth 36 ms, project 306 ms. Mesh generation is the first candidate for profiling and an isolated native experiment.

## Compatibility constraints

- Keep existing projects and web functionality working. A shared core must preserve current geometry semantics or explicitly document and test differences.
- Make direct Buildercraft import and metadata preservation a separately tested integration.
- Profile memory, latency, and thermal behavior on actual Android hardware; independently verify original iPad Pro OS and device capabilities before choosing iOS toolchain and deployment targets.
- An iOS-compatible core is not an iOS app: a native shell, graphics backend, packaging, signing and device validation are separate work.
