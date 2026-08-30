#!/usr/bin/env node
// Regenerates a stable-named copy of the Next.js production CSS chunk with
// the next/font CSS-variable assignments promoted to :root. next/font only
// sets --font-grotesk/--font-plex/--font-newsreader on a hashed per-build
// module class applied to <html> in layout.tsx - design-sync previews never
// render inside that wrapper, so without this the brand fonts silently fall
// back to system-ui/monospace/serif. Values below are copied verbatim from
// the compiled chunk's own `*__variable` rules, not invented.
//
// Run after `npm run build`, before package-build.mjs (see cfg.buildCmd).
// Writes alongside the source chunk so its relative `url(../media/...)`
// font references keep resolving.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = '.next/static/chunks';
const chunk = readdirSync(dir).find((f) => /^[a-z0-9]+\.css$/.test(f));
if (!chunk) {
  console.error(`No compiled CSS chunk found under ${dir} — run \`npm run build\` first.`);
  process.exit(1);
}

const fontVars = `:root {
  --font-grotesk: "Space Grotesk", "Space Grotesk Fallback";
  --font-plex: "IBM Plex Mono", "IBM Plex Mono Fallback";
  --font-newsreader: "Newsreader", "Newsreader Fallback";
}
`;
const css = readFileSync(join(dir, chunk), 'utf8');
writeFileSync(join(dir, '_ds-styles.css'), fontVars + css);
console.log(`wrote ${join(dir, '_ds-styles.css')} (from ${chunk}, ${css.length} bytes)`);
