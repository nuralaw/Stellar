import { C, Css, Svg } from "./kit";

// Extra information takes a matching pair: comma-comma, dash-dash or brackets. Never a mixed pair or a lone mark.
// "My cousin, a pilot, lives in Oslo": the insert drops in between two commas, lifts out (the sentence survives),
// then gets dashes and brackets. Mismatched or one-ended wrappers are rejected.
export const alt =
  "\"My cousin, a pilot, lives in Oslo.\" The extra information sits in a matching pair: commas, dashes or brackets. A mixed pair, or one mark alone, is wrong.";

const P = "v-boundaries--pairs-";
const K = (n: string) => P + n;
const A = K("a");

const BASE = 98; // text baseline of the sentence
const P1 = 24; // "My cousin" starts here
const P2 = 106; // "lives in Oslo" when nothing is inserted
// How far "lives in Oslo" moves right for each wrapper
const SC = 78; // commas / brackets
const SD = 102; // dashes
const SM = 92; // comma + dash
const SO = 84; // one end open
const CX = 110; // the insert chip's x (commas)

/** An element visible between a% and b% only (fades in a..a+3, out b..b+3) and back at the end of the loop if keep. */
const show = (n: string, a: number, b: number) =>
  `.${K(n)} { opacity: 0; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0 } ${a + 3}%, ${b}% { opacity: 1 } ${b + 3}%, 100% { opacity: 0 } }`;

const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* the sentence: "lives in Oslo" opens and closes around the insert */
.${K("p2")} { transform: translateX(${SC}px); animation-name: ${K("p2")}; }
@keyframes ${K("p2")} {
  0%, 31% { transform: translateX(${SC}px) }
  37%, 47% { transform: translateX(0) }
  53%, 59% { transform: translateX(${SD}px) }
  63%, 71% { transform: translateX(${SC}px) }
  75%, 80% { transform: translateX(${SM}px) }
  84%, 92% { transform: translateX(${SO}px) }
  99%, 100% { transform: translateX(${SC}px) }
}
/* the insert: hovers above, drops in, lifts out, comes back for each wrapper */
.${K("chip")} { animation-name: ${K("chip")}; }
@keyframes ${K("chip")} {
  0%, 14% { transform: translate(0, -36px) }
  20%, 31% { transform: translate(0, 0) }
  37%, 47% { transform: translate(0, -36px) }
  53%, 59% { transform: translate(10px, 0) }
  64%, 92% { transform: translate(0, 0) }
  99%, 100% { transform: translate(0, 0) }
}
.${K("hover")} { opacity: 0; animation-name: ${K("hover")}; }
@keyframes ${K("hover")} { 0%, 6% { opacity: 0 } 10%, 14% { opacity: 1 } 18%, 36% { opacity: 0 } 40%, 47% { opacity: 1 } 51%, 100% { opacity: 0 } }
.${K("slot")} { opacity: 0; animation-name: ${K("slot")}; }
@keyframes ${K("slot")} { 0%, 6% { opacity: 0 } 10%, 15% { opacity: 1 } 19%, 100% { opacity: 0 } }

/* wrappers */
.${K("commas")} { animation-name: ${K("commas")}; }
@keyframes ${K("commas")} { 0%, 17% { opacity: 0 } 21%, 33% { opacity: 1 } 36%, 97% { opacity: 0 } 99%, 100% { opacity: 1 } }
${show("dashes", 50, 60)}
${show("brackets", 61, 72)}
${show("left", 73, 92)}
${show("rdash", 73, 80)}
${show("ropen", 84, 92)}

/* captions */
.${K("cap1")} { animation-name: ${K("cap1")}; }
@keyframes ${K("cap1")} { 0%, 18% { opacity: 0 } 23%, 31% { opacity: 1 } 35%, 97% { opacity: 0 } 99%, 100% { opacity: 1 } }
${show("cap2", 37, 46)}
${show("cap3", 52, 59)}
${show("cap4", 63, 71)}
${show("cap5", 75, 82)}
${show("cap6", 84, 92)}
`;

function Cap({ n, color, children }: { n: string; color: string; children: string }) {
  return (
    <g className={`${A} ${K(n)}`}>
      <text x={160} y={150} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {children}
      </text>
    </g>
  );
}

export default function Visual() {
  const mark = (x: number, glyph: string, color: string, size = 22) => (
    <text x={x} y={BASE} fontSize={size} fontWeight={700} fill={color}>
      {glyph}
    </text>
  );
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* the blank */}
        <g className={`${A} ${K("slot")}`}>
          <rect x={CX} y={BASE - 20} width={60} height={26} rx={8} fill="none" stroke={C.primary} strokeWidth={2} strokeDasharray="4 4" />
        </g>

        {/* the sentence */}
        <text x={P1} y={BASE} fontSize={15} fontWeight={700} fill={C.ink}>
          My cousin
        </text>
        <g className={`${A} ${K("p2")}`}>
          <text x={P2} y={BASE} fontSize={15} fontWeight={700} fill={C.ink}>
            lives in Oslo
          </text>
        </g>

        {/* matching wrappers (green) */}
        <g className={`${A} ${K("commas")}`}>
          {mark(100, ",", C.good)}
          {mark(CX + 62, ",", C.good)}
        </g>
        <g className={`${A} ${K("dashes")}`}>
          <path d={`M102 ${BASE - 5} h12`} stroke={C.good} strokeWidth={3} fill="none" />
          <path d={`M${CX + 10 + 64} ${BASE - 5} h12`} stroke={C.good} strokeWidth={3} fill="none" />
        </g>
        <g className={`${A} ${K("brackets")}`}>
          {mark(99, "(", C.good, 20)}
          {mark(CX + 62, ")", C.good, 20)}
        </g>

        {/* mismatched: red left comma, orange right dash; then a lone comma with the closing end missing */}
        <g className={`${A} ${K("left")}`}>{mark(100, ",", C.bad)}</g>
        <g className={`${A} ${K("rdash")}`}>
          <path d={`M${CX + 64} ${BASE - 5} h12`} stroke={C.primary} strokeWidth={3} fill="none" />
        </g>
        <g className={`${A} ${K("ropen")}`}>
          <rect x={CX + 62} y={BASE - 18} width={12} height={24} rx={4} fill="none" stroke={C.bad} strokeWidth={2} strokeDasharray="3 3" />
        </g>

        {/* the insert */}
        <g className={`${A} ${K("chip")}`}>
          <rect x={CX} y={BASE - 18} width={60} height={24} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={CX + 30} y={BASE - 1} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            a pilot
          </text>
          <g className={`${A} ${K("hover")}`}>
            <text x={CX + 30} y={BASE - 26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
              extra information
            </text>
          </g>
        </g>

        
        <g className={`${A} ${K("cap1")}`}>
          <text x={160} y={150} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            pair: comma … comma
          </text>
        </g>
        <Cap n="cap2" color={C.good}>
          remove test: still a full sentence
        </Cap>
        <Cap n="cap3" color={C.good}>
          pair: dash … dash
        </Cap>
        <Cap n="cap4" color={C.good}>
          pair: ( … )
        </Cap>
        <Cap n="cap5" color={C.bad}>
          mismatch
        </Cap>
        <Cap n="cap6" color={C.bad}>
          one end open
        </Cap>
      </g>
    </Svg>
  );
}
