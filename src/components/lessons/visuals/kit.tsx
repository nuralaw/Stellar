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
