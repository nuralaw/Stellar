import { C, Css, Svg } from "./kit";

// Transitions: time words look back or ahead on a line; a result word points forward from a cause (so); a purpose
// word points at a goal.
export const alt =
  "Three rows of arrows: Previously looks back and Later looks ahead on a time line; As a result points from Heavy rain to Road closed; To that end points from New drains to the goal Safer roads.";

const P = "v-transitions--result-time-";
const A = P + "a";
const n = (s: string) => P + s;

/** A class + keyframes: hidden (`from`) until s%, reaching the normal style at e%. */
function anim(name: string, s: number, e: number, from: string) {
  return `.${name} { animation-name: ${name}; }
@keyframes ${name} { 0%, ${s}% { ${from} } ${e}%, 100% { opacity: 1; transform: none; stroke-dashoffset: 0 } }`;
}
const FADE = "opacity: 0; transform: translateY(5px)";
const DRAW = "stroke-dashoffset: 100; opacity: 0";

const css = `
.${A} { animation: 10s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${anim(n("line"), 6, 14, DRAW)}
${anim(n("dots"), 8, 14, "opacity: 0")}
${anim(n("back"), 16, 24, DRAW)}
${anim(n("chipB"), 20, 26, FADE)}
${anim(n("fwd"), 26, 34, DRAW)}
${anim(n("chipF"), 30, 36, FADE)}
${anim(n("boxes2"), 38, 44, FADE)}
${anim(n("arrow2"), 44, 52, DRAW)}
${anim(n("chip2"), 48, 54, FADE)}
${anim(n("boxes3"), 60, 66, FADE)}
${anim(n("arrow3"), 66, 74, DRAW)}
${anim(n("chip3"), 70, 76, FADE)}
`;

const pale = { fill: C.fill, stroke: C.line, strokeWidth: 1.5 } as const;
const draw = { pathLength: 100, strokeDasharray: 100, fill: "none", stroke: C.primary, strokeWidth: 2.5 } as const;

function Chip({ cx, y, w, text, cls }: { cx: number; y: number; w: number; text: string; cls: string }) {
  return (
    <g className={`${A} ${cls}`}>
      <rect x={cx - w / 2} y={y} width={w} height={18} rx={9} {...pale} />
      <text x={cx} y={y + 13} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink} stroke="none">
        {text}
      </text>
    </g>
  );
}

function Box({ x, y, text, goal }: { x: number; y: number; text: string; goal?: boolean }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={80}
        height={26}
        rx={8}
        fill={goal ? C.soft : C.fill}
        stroke={goal ? C.primary : C.line}
        strokeWidth={1.5}
        strokeDasharray={goal ? "4 3" : undefined}
      />
      <text x={x + 40} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
        {text}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {/* Row 1: time */}
        <path className={`${A} ${n("line")}`} d="M24 46 H296" pathLength={100} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="100" />
        <g className={`${A} ${n("dots")}`}>
          <circle cx={60} cy={46} r={4.5} fill={C.muted} />
          <circle cx={160} cy={46} r={5.5} fill={C.ink} />
          <circle cx={260} cy={46} r={4.5} fill={C.muted} />
          <text x={160} y={64} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            now
          </text>
        </g>
        <path className={`${A} ${n("back")}`} d="M150 46 H71 L78 41 L71 46 L78 51" {...draw} />
        <Chip cx={60} y={16} w={78} text="Previously," cls={n("chipB")} />
        <path className={`${A} ${n("fwd")}`} d="M170 46 H249 L242 41 L249 46 L242 51" {...draw} />
        <Chip cx={260} y={16} w={52} text="Later," cls={n("chipF")} />

        {/* Row 2: result */}
        <g className={`${A} ${n("boxes2")}`}>
          <Box x={16} y={86} text="Heavy rain" />
          <Box x={224} y={86} text="Road closed" />
        </g>
        <path className={`${A} ${n("arrow2")}`} d="M102 99 H215 L207 94 L215 99 L207 104" {...draw} />
        <Chip cx={160} y={74} w={88} text="As a result," cls={n("chip2")} />

        {/* Row 3: purpose */}
        <g className={`${A} ${n("boxes3")}`}>
          <Box x={16} y={134} text="New drains" />
          <Box x={224} y={134} text="Safer roads" goal />
          <path d="M296 134 V122" fill="none" stroke={C.primaryText} strokeWidth={1.5} />
          <path d="M296 122 L306 126 L296 130 Z" fill={C.primary} stroke={C.primary} strokeWidth={1} />
        </g>
        <path className={`${A} ${n("arrow3")}`} d="M102 147 H215 L207 142 L215 147 L207 152" {...draw} />
        <Chip cx={160} y={122} w={88} text="To that end," cls={n("chip3")} />
      </g>
    </Svg>
  );
}
