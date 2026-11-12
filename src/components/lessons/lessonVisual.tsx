import type { ReactNode } from "react";
import { VISUALS } from "./visuals";

/** A lesson's island animation, rendered on the server as SVG + CSS (null if the lesson has none). */
export function lessonVisual(slug: string): ReactNode {
  const v = VISUALS[slug];
  return v ? <v.Visual /> : null;
}
