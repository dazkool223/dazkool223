// Curated design-system entry: the reusable presentational primitives only.
// Everything else in src/ (page sections, layout, effects tied to next/font)
// is app-specific, not a building block a design agent should reuse - see
// .design-sync/NOTES.md for the scoping rationale.
export { default as Reveal } from '../src/components/Reveal.tsx';
export { default as Magnetic } from '../src/components/Magnetic.tsx';
export { default as SectionHeading } from '../src/components/SectionHeading.tsx';
export { default as Marquee } from '../src/components/Marquee.tsx';
export { default as GridOverlay } from '../src/components/GridOverlay.tsx';
export { default as ToolbenchPanel } from '../src/components/ToolbenchPanel.tsx';
export { default as FieldNotesStrip } from '../src/components/FieldNotesStrip.tsx';
