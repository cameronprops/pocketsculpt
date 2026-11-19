# Pocket Sculpt and Buildercraft: web direction

## Product direction

Pocket Sculpt is intended to become a modeling workspace in the Buildercraft suite, available through a responsive browser interface on desktop, tablet and phone. It should remain usable as a standalone web app. Mouse, keyboard, pen and touch are first-class inputs; small and large screens require different layouts, not different project formats.

This is a product direction, not a claim that Buildercraft already runs in a browser or that direct integration exists. Onshape is an example of the kind of capable browser workflow sought, not evidence about this implementation.

## Current evidence

- Pocket Sculpt currently has a TypeScript/Three.js web prototype and project JSON. It can export OBJ and experimental body groups. These are not a live scene bridge.
- The `cameronprops/BuilderCraft` main-branch README, inspected 2026-11-19, describes a Rust desktop CAD alpha, with a shared scene/geometry kernel and versioned bridges as suite direction. Its README states that other suite applications are not yet implemented. Other branches may differ.
- Pocket Sculpt's native JSON, skeleton metadata, polygroup classification and experimental garment representation are not established Buildercraft import contracts. OBJ export is a manual, potentially lossy path; OBJ files do not reliably carry physical unit metadata.

## Implementation priorities

1. Stabilize sculpting and preserve editable projects; maintain the existing engineering punch list.
2. Define and version a documented interchange contract for units, axes, meshes, materials, node IDs/hierarchy and metadata; preserve unsupported data or explicitly report loss. Add fixtures and round-trip tests before claiming direct import.
3. Build a Buildercraft-side importer and scene placement workflow against the actual integration branch, without disrupting its separate development. Test real exported files end to end.
4. Design a browser host and rendering strategy compatible with the Buildercraft core and Pocket Sculpt. A browser-capable kernel and a responsive viewport are separate deliverables. Measure before choosing a rewrite, WebAssembly or server computation.
5. Test desktop resizing and keyboard/mouse, touch/pen on Android and iPad, and accessibility. Establish supported browsers and capability-based performance tiers from measurements rather than guaranteeing every screen or device.
6. Preserve offline/local-first use where feasible. If later cloud collaboration or compute is introduced, make network and privacy behavior explicit and avoid making it a prerequisite for local sculpting without a deliberate product decision.

## Acceptance

A saved Pocket Sculpt project can be reopened without loss; a documented transfer creates a correctly scaled, oriented and named Buildercraft scene object; the responsive interface remains usable at desktop, tablet and phone widths; real device tests and unsupported feature disclosures are recorded. Neither file export alone nor an embedded preview counts as completed integration.
