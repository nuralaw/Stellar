import katex from "katex";
import type { ReactNode } from "react";

// Building blocks for lesson visuals: the short looping animation in each lesson's "island"
// (lesson cards on /lessons and the lesson's cover screen). Rules: visuals/README.md.
// Server-safe on purpose: no hooks, no "use client", so a visual ships as plain SVG + CSS, no JS.

/** Theme colors (CSS variables, so the light and dark themes both work). Use only these. */
export const C = {
  /** Main strokes and text. */
  ink: "var(--ink)",
  /** Secondary text, axes, labels. */
  muted: "var(--muted)",
  /** Grid lines, faint guides, dividers. */
  line: "var(--line)",
  /** Card background (to knock out lines behind text). */
  bg: "var(--surface)",
  /** Soft neutral fill: boxes, bars, blanks. */
  fill: "var(--surface-2)",
  /** The one accent: the thing to look at right now. */
  primary: "var(--primary)",
  /** The accent as TEXT: AA on light surfaces (plain --primary is only 3:1 there); same orange at night. */
  primaryText: "var(--primary-strong)",
  /** Text drawn on a solid C.primary fill (navy in both themes; white on the day orange is only 3:1). */
  onPrimary: "var(--primary-ink)",
  /** Soft accent fill behind a highlighted thing. */
  soft: "var(--primary-soft)",
  /** "Right" / the correct choice locking in. */
  good: "var(--success)",
  goodSoft: "var(--success-soft)",
  /** "Wrong" / a trap being rejected (use sparingly). */
  bad: "var(--danger)",
  badSoft: "var(--danger-soft)",
} as const;

/** Every visual draws on this 320 × 180 canvas (16:9). 1 unit = 1px on a lesson card. */
export const W = 320;
export const H = 180;

/** The root <svg> of a visual. */
export function Svg({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className="block h-full w-full overflow-visible select-none"
      fontFamily="inherit"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/**
 * The visual's own CSS: keyframes and classes. Every class name and keyframe name must start with `v-<slug>-`
 * (the styles are global once on the page, and up to 33 visuals share one page).
 */
export function Css({ children }: { children: string }) {
  return <style dangerouslySetInnerHTML={{ __html: children }} />;
}

// Browsers space every <mo>−</mo> like a binary operator ("y = − 5"). Mark a prefix (unary) minus, i.e. one that opens
// an <mrow> or follows an operator/opening bracket/comma, as form="prefix" with no side spacing. Lookbehind (not a
// consuming group) so chains like "−−1" are all handled; a converted minus keeps matching as a previous <mo>.
const PREFIX_MINUS = /(?<=<mrow>|<mo[^>]*>(?:=|\(|\[|,|\+|−|×|·|⋅|≠|\{|∣|→|∈|;|&lt;|&gt;|≤|≥|:)<\/mo>)<mo>[−-]<\/mo>/g;
function fixUnaryMinus(mathml: string): string {
  return mathml.replace(PREFIX_MINUS, '<mo form="prefix" lspace="0em" rspace="0em">−</mo>');
}

/**
 * A formula typeset with KaTeX inside the SVG (a <foreignObject>, server-rendered HTML, no JS). Use it for any math
 * that is more than plain numbers and letters (fractions, roots, exponents, \pi ...); plain `<text>` stays for labels.
 *   <Tex x={160} y={90} size={16}>{String.raw`(x-h)^2+(y-k)^2=r^2`}</Tex>
 * - `children`: LaTeX without \( \) delimiters. Write it with String.raw`...` so backslashes stay as typed.
 * - `x`, `y`: the anchor point in canvas units. `y` is the vertical middle of the formula's box. `anchor` says what x is:
 *   "middle" (default: x is the center), "start" (the left edge) or "end" (the right edge).
 * - `size`: the font size in canvas units, like <text fontSize> (default 14).
 * - `color`: a C.* color (default C.ink). Never a hex color.
 * - `width`, `height`: the box the formula is centered/aligned in. A formula wider than `width` is clipped, so give
 *   enough room (default width 220, height = 2.6 × size). The box never draws anything.
 * Animate a <g className=...> that wraps the <Tex> (opacity, transform, ...), never the <Tex> itself: Safari handles
 * transforms on <foreignObject> badly.
 */
export function Tex({
  children,
  x,
  y,
  size = 14,
  anchor = "middle",
  color = C.ink,
  width = 220,
  height,
}: {
  children: string;
  x: number;
  y: number;
  size?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
  width?: number;
  height?: number;
}) {
  const h = height ?? Math.round(size * 2.6);
  const left = anchor === "start" ? x : anchor === "end" ? x - width : x - width / 2;
  // MathML output: native math inside the foreignObject (Safari 14.1+, Chrome 109+, Firefox). KaTeX's HTML output uses
  // absolutely positioned spans that WebKit mis-places inside SVG transforms and animated groups.
  let html: string;
  try {
    html = fixUnaryMinus(katex.renderToString(children, { throwOnError: true, strict: "error", output: "mathml" }));
  } catch (e) {
    // One bad formula must not take a whole page down during SSR: show the source as plain text.
    console.error(`<Tex> cannot render "${children}": ${e instanceof Error ? e.message : e}`);
    return (
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize={size} fill={color} stroke="none">
        {children}
      </text>
    );
  }
  return (
    <foreignObject x={left} y={y - h / 2} width={width} height={h} overflow="visible" pointerEvents="none">
      <div
        className="kit-tex"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: anchor === "start" ? "flex-start" : anchor === "end" ? "flex-end" : "center",
          width: "100%",
          height: "100%",
          fontSize: size,
          lineHeight: 1,
          color,
          whiteSpace: "nowrap",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </foreignObject>
  );
}
