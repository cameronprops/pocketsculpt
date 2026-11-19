# Pocket Sculpt punch list

## 1. Make garment surfaces usable
- [x] Add experimental connected fitted surfaces for shirt, jacket and pants presets.
- [ ] Define clean openings at neck, cuffs, waist and ankles; remove ragged edges and validate all body variants. Default balanced-maquette jacket/shirt accidental small holes are filtered; broad pants can still have extra openings.
- [ ] Keep each garment independent, selectable, editable and exportable; allow sculpting and fitting after body edits.
- [ ] Prevent body intersections, support adjustment and review on phone; measure performance and mesh integrity.
- [ ] Add drape, accessories and garment layers after fitted shells are reliable.

## 2. Akeley’s Tool: posable figures
- [x] Make Akeley’s Tool visible in the top toolbar, including access to connector assignments in sculpt mode without discarding sculpt edits.
- [x] Assign ball-joint settings to a node and export a standalone ball/socket fit test.
- [ ] Show connector orientation and dimensions on the model. Assigned nodes now have a pink marker.
- [ ] Split a sculpt into parts at a selected joint and generate matching connector geometry.
- [ ] Add hinges, pegs and interchangeable parts; validate wall thickness and fit.
- [ ] Test physical prints for material, tolerances, retention and durability.

## 3. Creature foundations
- [ ] Compare hand and mannequin surfaces visually with references; improve finger separation and proportions.
- [ ] Add direct draggable 3D node shape/move/pose gizmos and local axis orientation.
- [ ] Improve mesh quality at thin features, branch junctions and extreme flattening.
- [ ] Make labeled parts and symmetry reliable for custom creatures and part transfers.

## 4. Sculpting, paint and output
- [ ] Continue Sculpt+ and 123D Creature workflow audit against documented features.
- [ ] Add real sculpt layers and non-destructive editing.
- [ ] Add UV unwrapping and texture export; verify painted model export.
- [ ] Add appropriate printable mesh export and validation; preserve editable projects.

## 5. Performance, mobile and Buildercraft
- [ ] Profile mesh generation, interaction and memory on Samsung Galaxy and older iPad.
- [ ] Reduce unnecessary rebuilds; use adaptive detail and responsive previews.
- [ ] Verify touch controls, settings, setup and autosave on real devices.
- [ ] Define Buildercraft interoperability around tested file formats while keeping Pocket Sculpt standalone.

## 6. Polygroups, layers and multiple skeletons
- [x] Prototype automatic labeled body-face groups and export them as OBJ groups.
- [ ] Add in-app group visualization, selection, editing, visibility and user-defined boundaries.
- [ ] Support independent named massing skeletons and surface layers in one project.
- [ ] Integrate Akeley connectors with group boundaries and independent objects.
- [ ] Generate clean separated, capped printable parts and validate intersections and wall thickness.
- [ ] Preserve group assignments during sculpting, remeshing, saving and Buildercraft transfer.

## 7. Precision and hard-surface modeling
- [x] Prototype a saved millimeters-per-model-unit export scale and optional joint-position snapping.
- [x] Add selectable angle increments for the existing node Z-rotation slider.
- [ ] Add scene measurements, unit display and entry in inches, millimeters and other units.
- [ ] Add visible grids, snapping to points, edges and surfaces, axis constraints, and configurable origins.
- [ ] Add precise three-axis transforms and numeric entry, rotation pivots, and angle snapping for posing.
- [ ] Add hard-surface booleans, clean edges, bevels and precision validation; test printable output.
- [ ] Reconcile project scale with Akeley connector insertion once body splitting is implemented.

## 8. Buildercraft web workspace
- [ ] Make Pocket Sculpt a responsive Buildercraft suite workspace while retaining standalone use.
- [ ] Define a versioned transfer contract for scale, axes, geometry, materials, node metadata and unsupported features.
- [ ] Implement and verify direct Buildercraft scene import with actual project fixtures.
- [ ] Establish browser-capable Buildercraft host and rendering strategy; do not assume the current desktop alpha is already a web app.
- [ ] Test mouse/keyboard, touch and pen at desktop, tablet and phone widths, including performance tiers and local/offline behavior.

## 9. Project and template gallery
- [x] Startup entry points for current autosave, project file, built-in starter setup and locally saved project/template snapshots.
- [x] Export portable template JSON for manual sharing through Git.
- [ ] Add thumbnails, rename/delete, per-project autosave and reliable project management.
- [ ] Add a versioned public template catalog with attribution, licensing, preview, import validation and explicit publishing controls.
- [ ] Test IndexedDB and file opening on each supported browser and document storage limitations.

## 10. Parts, assemblies and desktop controls
- [x] Prototype a parts browser that lists the current skeleton, selectable joints, body and shell objects.
- [x] Add a basic desktop command bar and undo, redo, save, copy and paste shortcuts for skeleton branches.
- [ ] Add actual object selection for meshes and shells; independently editable objects and assemblies.
- [ ] Implement layers as independent named groupings with assignments, visibility, locking and project persistence.
- [ ] Add multiple independent skeletons, assembly hierarchy and cross-workspace interchange.
- [ ] Add complete discoverable, configurable shortcuts, command history, aliases and help.
- [ ] Evaluate sharing a Rust desktop modeling core with Buildercraft; keep the responsive web app working.
- [ ] Keep browser delivery shareable and standalone; evaluate Rust compiled to WebAssembly for measured geometry and memory bottlenecks, with explicit interoperability and benchmark tests.
