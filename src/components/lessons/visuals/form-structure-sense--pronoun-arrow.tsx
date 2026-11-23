import { C, Css, Svg } from "./kit";

// A pronoun points back to its antecedent. "they" would point at the nearest plural noun (visitors) and is rejected;
// the arrow slides to "map" (one thing), so "it" locks in.
export const alt =
  "Visitors praised the new map, saying blank is much clearer. They points back to visitors and is rejected; the arrow slides to map, one thing, so it locks in.";

const P = "v-form-structure-sense--pronoun-arrow-";
const A = P + "a";
const cl = (n: string) => `${A} ${P}${n}`;
const kf = (n: string, body: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${body} }`;

const css = `
.${A} { animation: 10s ease-in-out infinite; }
${kf("scene", "0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }")}
.${P + "draw"} { stroke-dasharray: 100; stroke-dashoffset: 0; }
.${P + "hid"} { opacity: 0; }

/* "they" is tried: arrow to Visitors, red, shake, gone */
${kf("tryWord", "0%, 14% { opacity: 0; transform: translateX(0) } 17% { opacity: 1 } 28% { transform: translateX(0) } 30% { transform: translateX(-3px) } 32% { transform: translateX(3px) } 34% { transform: translateX(-2px) } 36%, 40% { opacity: 1; transform: translateX(0) } 44%, 100% { opacity: 0; transform: translateX(0) }")}
${kf("arrow1", "0%, 17% { stroke-dashoffset: 100; opacity: 1 } 27% { stroke-dashoffset: 0; opacity: 1 } 40% { opacity: 1 } 46%, 100% { stroke-dashoffset: 0; opacity: 0 }")}
${kf("head1", "0%, 24% { opacity: 0 } 27%, 40% { opacity: 1 } 46%, 100% { opacity: 0 }")}
${kf("tag1", "0%, 28% { opacity: 0 } 32%, 40% { opacity: 1 } 46%, 100% { opacity: 0 }")}
${kf("slot1", `0%, 14% { fill: none; stroke: ${C.muted} } 17%, 40% { fill: ${C.badSoft}; stroke: ${C.bad} } 46%, 66% { fill: none; stroke: ${C.muted} } 72%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`)}

/* the arrow slides to map */
${kf("arrow2", "0%, 48% { stroke-dashoffset: 100 } 58%, 100% { stroke-dashoffset: 0 }")}
${kf("head2", "0%, 55% { opacity: 0 } 58%, 100% { opacity: 1 }")}
${kf("tag2", "0%, 56% { opacity: 0; transform: translateY(4px) } 62%, 100% { opacity: 1; transform: none }")}
${kf("win", "0%, 66% { opacity: 0; transform: translateY(5px) } 72%, 100% { opacity: 1; transform: none }")}
${kf("under", `0%, 66% { stroke: ${C.muted} } 72%, 100% { stroke: ${C.good} }`)}
${kf("pairs", "0%, 76% { opacity: 0 } 82%, 100% { opacity: 1 }")}
`;

/** A short arrow head at (x, y), pointing away from (fx, fy). */
function head(x: number, y: number, fx: number, fy: number) {
  const a = Math.atan2(y - fy, x - fx);
  const p = (d: number) => `${(x - 7 * Math.cos(a + d)).toFixed(1)} ${(y - 7 * Math.sin(a + d)).toFixed(1)}`;
  return `M ${p(0.5)} L ${x} ${y} L ${p(-0.5)}`;
}

const BX = 110; // blank center
const BY = 70; // arrow start (top of the blank)
const T1 = { x: 60, y: 45 };
const T2 = { x: 219, y: 45 };
const word = { fontSize: 15, fontWeight: 600, fill: C.ink, stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cl("scene")}>
        {/* The sentence */}
        <text x={30} y={34} textLength={60} lengthAdjust="spacingAndGlyphs" {...word}>
          Visitors
        </text>
        <text x={96} y={34} textLength={104} lengthAdjust="spacingAndGlyphs" {...word}>
          praised the new
        </text>
        <text x={206} y={34} textLength={32} lengthAdjust="spacingAndGlyphs" {...word}>
          map,
        </text>
        <path d="M 30 40 H 90" stroke={C.muted} strokeWidth={2} fill="none" />
        <path className={cl("under")} d="M 206 40 H 232" stroke={C.good} strokeWidth={2} fill="none" />
        <text x={30} y={90} textLength={46} lengthAdjust="spacingAndGlyphs" {...word}>
          saying
        </text>
        <rect x={82} y={72} width={56} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <rect className={cl("slot1")} x={82} y={72} width={56} height={26} rx={13} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <text x={144} y={90} textLength={112} lengthAdjust="spacingAndGlyphs" {...word}>
          is much clearer.
        </text>

        {/* "they" tried, then "it" */}
        <text className={`${cl("tryWord")} ${P + "hid"}`} x={BX} y={90} textAnchor="middle" {...word} fontWeight={700} fill={C.bad}>
          they
        </text>
        <text className={cl("win")} x={BX} y={90} textAnchor="middle" {...word} fontWeight={700}>
          it
        </text>

        {/* Arrows from the blank back to the noun it replaces */}
        <path className={`${cl("arrow1")} ${P + "draw"} ${P + "hid"}`} d={`M ${BX} ${BY} L ${T1.x} ${T1.y}`} pathLength={100} fill="none" stroke={C.bad} strokeWidth={2.5} />
        <path className={`${cl("head1")} ${P + "hid"}`} d={head(T1.x, T1.y, BX, BY)} fill="none" stroke={C.bad} strokeWidth={2.5} />
        <path className={`${cl("arrow2")} ${P + "draw"}`} d={`M ${BX} ${BY} L ${T2.x} ${T2.y}`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <path className={cl("head2")} d={head(T2.x, T2.y, BX, BY)} fill="none" stroke={C.primary} strokeWidth={2.5} />

        {/* Tags */}
        <g className={`${cl("tag1")} ${P + "hid"}`}>
          <rect x={115} y={108} width={90} height={22} rx={11} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={160} y={123} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad} stroke="none">
            visitors? no
          </text>
        </g>
        <g className={cl("tag2")}>
          <rect x={104} y={108} width={112} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={123} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
            map = 1 thing
          </text>
        </g>

        {/* Pairs */}
        <g className={cl("pairs")} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          <text x={92} y={156} textAnchor="middle">
            1 thing: it, its
          </text>
          <text x={226} y={156} textAnchor="middle">
            2+: they, their
          </text>
        </g>
      </g>
    </Svg>
  );
}
