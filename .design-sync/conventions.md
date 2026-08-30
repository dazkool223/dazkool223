## Digital Workshop conventions

This is a small, curated slice of a personal portfolio's presentational
primitives - not a full component library. Build with them as-is; there is
no provider or root wrapper to add.

**Dark by design.** Every component assumes the site's dark theme - there
is no light-mode variant. Compose on `bg-bg` (near-black) with `text-ink`
(warm off-white) as the base; placing these on a light background will
read as low-contrast/wrong.

**Styling idiom: Tailwind utilities over design tokens**, not component
props. Real token names (defined in `styles.css`, safe to use as
`bg-*`/`text-*`/`border-*` utilities):

| token | utility example | role |
|---|---|---|
| `--bg` | `bg-bg` | page background (near-black) |
| `--surface` | `bg-surface` | card/panel background, one step up from bg |
| `--ink` | `text-ink` | primary text |
| `--muted` | `text-muted` | secondary text |
| `--faint` | `text-faint` | tertiary/label text |
| `--line` | `border-line` | hairline borders/dividers |
| `--accent` | `text-accent` / `bg-accent` / `border-accent` | the one brand color (orange) - use sparingly, as a highlight |
| `--accent-dim` | `bg-accent-dim` | low-opacity accent wash (hover states) |

Fonts: `font-display` (Space Grotesk - headings), `font-mono` (IBM Plex
Mono - labels/code). The third brand font (Newsreader, an italic serif for
accent notes) has no bare utility class - use it via the `.annotation`
class below or `font-family: var(--font-newsreader)`.

A handful of hand-written classes carry real design meaning - reuse them
rather than reinventing:
- `.label-mono` - small uppercase tracked mono label (section eyebrows, nav)
- `.annotation` - italic serif accent-colored aside/margin note
- `.rule` - 1px hairline divider (`--line`)
- `.fig-frame` - hairline frame with `+` corner register marks, for
  figure/media containers

**Where the truth lives**: `styles.css` (imports `_ds_bundle.css` +
fonts) has every rule above, verbatim from the real site's compiled
Tailwind output - read it before inventing new utility combinations.
Per-component `.prompt.md` files carry real usage examples ported from the
live site.

**Idiomatic snippet** (a labeled, revealed content block - the site's most
common composition):

```tsx
<Reveal delay={0.1}>
  <p className="label-mono text-accent">bench 02</p>
  <h3 className="font-display text-3xl font-medium text-ink">a heading</h3>
  <p className="mt-2 text-muted">supporting copy in the muted tone.</p>
  <p className="annotation mt-3">a wry aside, italic and accent-colored.</p>
  <div className="rule mt-4" />
</Reveal>
```
