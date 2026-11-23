# Lesson visuals

Every lesson has a short looping animation: its "island". It plays on the lesson's card on /lessons and,
larger, on the lesson's cover screen. Before reading a single word, the student should **see what the topic is
about**: the core move of the skill, shown once, clearly.

Reference visuals (read both before writing one): `circles.tsx` (math) and `transitions.tsx` (R&W).

## Files

- `src/components/lessons/visuals/<slug>.tsx`, where `<slug>` is the lesson file name.
- `export const alt = "…"`: one sentence (≤ 200 chars) saying what the animation shows. Screen readers read it.
- `export default function Visual()` returning `<Svg label={alt}>…</Svg>` from `./kit`.
- `index.ts` is generated: `npm run lessons:visuals -- --index`. Don't edit it by hand.

Check and preview: `npm run lessons:visuals -- <slug>`. It lints, type-checks, renders the visual and saves a
**storyboard PNG** (7 moments of the loop + the still frame, light and dark theme). Open the PNG and look at it
after every change. Fix anything clipped, overlapping, unreadable or off-center.

## What makes a good island

- **One idea, shown as a change.** Something happens: a line tilts, a word snaps into a blank, a bar grows
  by 20%, a value gets substituted, a wrong choice shakes and leaves, the right one locks in green.
- **3–4 beats, then hold.** Set up → the key move → the result highlighted → hold ~1.5 s → fade out. One loop
  of 6–10 s (use one duration for every element so the beats stay in sync).
- **Concrete, not abstract.** Real numbers and real words: `(x − 3)² + (y + 1)² = 16`, "The test was easy.
  ___, most failed." Use the same idea as the lesson's worked example when you can.
- **Few words.** At most ~8 words visible at once, apart from a math expression or one short sentence that is
  the subject itself. Labels are 1–3 words. No paragraphs, no titles (the card shows the title).
- **Readable at 320 × 180.** Text ≥ 11 units (labels 11–12, main text 14–18). Lines ≥ 1.5 units. Keep 16 units
  of margin from every edge. Center the composition.
- **Calm.** One accent (primary) at a time on the thing to look at now. Green (`good`) only for "this is
  right", red (`bad`) only for a rejected trap. Neutral everything else. No flashing, no bouncing for its own
  sake, ease-in-out motion.

## Technical rules (the checker enforces most of them)

- Draw on the 320 × 180 canvas of `<Svg>`. Colors only from `C` in `./kit` (theme variables, so light and dark
  both work). No hex/rgb colors, no named colors.
- Animate with **CSS keyframes** in `<Css>{css}</Css>`. No SMIL (`<animate>`), no JS, no hooks, no
  `"use client"`. Imports only from `./kit` (and `react` types).
- **Every class name, keyframe name and id starts with `v-<slug>-`** (styles are global and up to 33 visuals
  share a page).
- Animate only `transform`, `opacity`, `fill`, `stroke`, `stroke-dashoffset`. For transforms on SVG elements
  set `transform-box: fill-box; transform-origin: center` (or `transform-box: view-box; transform-origin: <x>px
  <y>px` to rotate around a point of the canvas). Translate in px = canvas units.
- **The element's normal (non-animated) style is the final, fully explained frame.** Keyframes animate from the
  start state to it. With reduced motion the page turns animations off and shows exactly that frame, so it must
  tell the whole story on its own (the storyboard's "still" frame shows it).
- Use one shared timeline: a base class like `.v-<slug>-a { animation: 8s ease-in-out infinite; }` plus one
  class per element that sets `animation-name`; the keyframe percentages are the beats (see the references).
- Hide the reset: fade the whole scene (or the moving parts) out in the last ~8% and in during the first ~6%;
  jump things back to their start while invisible.
- Draw lines with `pathLength={100}` + `stroke-dasharray: 100` and animate `stroke-dashoffset` 100 → 0.
- `<text>` inherits `stroke` from its group: put strokes on shapes, or give text `stroke="none"`.
- Text: `fontSize` in canvas units, `fontWeight` 600–700 for main text, `fill` set explicitly. `textAnchor`
  for alignment. Plain numbers, short labels and coordinates like `(4, 6)` stay `<text>`; use the true minus sign (−).
- **Formulas use `<Tex>`** (below), not Unicode math in `<text>`.
- Math must be exact: a line drawn with slope 2 rises 2 grid units per 1; a bar at 60% is 60% long; a labelled
  right triangle has sides that fit a² + b² = c². Check every number you draw.
- Keep the file under 16 KB.

## Formulas: `<Tex>`

`<Tex>` from `./kit` typesets a LaTeX formula with KaTeX inside the SVG, so fractions, roots, exponents and `\pi` look
like they do in the lesson text. It is server-rendered HTML in a `<foreignObject>` (no JS), and the colour follows the
theme. The storyboard (`npm run lessons:visuals -- <id>`) renders it in headless Chrome, with the KaTeX fonts.

```tsx
import { C, Css, Svg, Tex } from "./kit";
…
<g className={cls("s3")}>
  <Tex x={196} y={126} size={13} anchor="start" width={118} color={C.primaryText}>{String.raw`(x-1)^2+(y-2)^2`}</Tex>
</g>
```

- `children`: LaTeX **without** `\( \)`. Always write it as a `String.raw` template literal, so the backslashes stay (`\frac{1}{2}`,
  `\pi`, `\sqrt{x}`, `\text{total}`, `\tfrac` for a small fraction inside a line).
- `x`, `y`: the anchor point. `y` is the middle of the formula's box. `anchor` says what `x` is: `"middle"` (default,
  the center), `"start"` (left edge) or `"end"` (right edge). **Use `"start"` for formulas in a left-aligned column.**
- `size`: font size in canvas units, like `<text fontSize>` (default 14). KaTeX looks about one step smaller than
  the sans-serif `<text>` at the same size, so use 13–16 for the main formula and 12 at the least.
- `color`: a `C.*` color (default `C.ink`); use `C.primaryText` for an accent formula, never hex.
- `width` / `height`: the box the formula sits in (default 220 wide and 2.6 × `size` tall). Anything wider than
  `width` is cut off, so give the formula enough room; the box draws nothing and takes no clicks. Put two lines of
  work as two `<Tex>` (about 18–20 units apart).
- **Animate a `<g>` that wraps the `<Tex>`** (opacity, transform, a class from `cls(…)`), never the `<Tex>` itself:
  Safari handles transforms on `<foreignObject>` badly.
- A formula that KaTeX cannot read fails the render ("render failed" in the storyboard run).
- Do not use raw `<foreignObject>`: the checker forbids it outside `./kit`.

`<Tex>` uses KaTeX's **MathML output** (native math inside the `<foreignObject>`: Safari 14.1+, Chrome 109+, Firefox), because
KaTeX's HTML output uses absolutely positioned spans that WebKit mis-places inside SVG transforms and animated groups.
MathML shows in the system's math font and an inline `\frac` is set small: use `\dfrac{a}{b}` for a full-size fraction
(and give it room: a fraction is about two lines tall). If a formula cannot be rendered, `<Tex>` logs the error and shows
the source as plain `<text>`, so one bad formula never breaks a page.
