import { C, Css, Svg } from "./kit";

// however / therefore are not FANBOYS. Between two sentences: "; however," (a comma alone is a splice).
// Then the word slides: inside a sentence it takes two commas, at the end of the first sentence it ends it.
export const alt =
  "Two sentences, a gap. The FANBOYS word \"but\" fits after a comma; \"however\" with a comma is a splice. It needs a semicolon before and a comma after. Inside a sentence it takes two commas.";

const P = "v-boundaries--however-slot-";
const K = (n: string) => P + n;
const A = K("a");

// widths measured on the rendered text (14px / 700)
const X1 = 24; // left edge of the second-phase rows
const W1 = 148; // "The museum was free"
const W2 = 52; // "the line"
const CHIP = 70; // the "however" chip in the second phase
const OPEN = 92; // how far "was long." moves right to make room for ", however,"

/** Fade (and slide) one element in between a% and b%, then stay. */
const fade = (n: string, a: number, b: number, dy = 4) =>
  `.${K(n)} { animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${b}%, 100% { opacity: 1; transform: none } }`;
/** An element that shows only between a% and b% (hidden in the final frame): fade in a..a+3, out b..b+3. */
const flash = (n: string, a: number, b: number, dy = 0) =>
  `.${K(n)} { opacity: 0; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${a + 4}%, ${b}% { opacity: 1; transform: none } ${b + 3}%, 100% { opacity: 0; transform: none } }`;
/** Chip colour: neutral until a%, then the verdict colours (the base style is the verdict). */
const verdict = (n: string, a: number, bad: boolean) =>
  `.${K(n)} { fill: ${bad ? C.badSoft : C.goodSoft}; stroke: ${bad ? C.bad : C.good}; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { fill: ${C.fill}; stroke: ${C.primary} } ${a + 3}%, 100% { fill: ${bad ? C.badSoft : C.goodSoft}; stroke: ${bad ? C.bad : C.good} } }`;

const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

${fade("s", 4, 9, 0)}
.${K("slot")} { opacity: 0; animation-name: ${K("slot")}; }
@keyframes ${K("slot")} { 0%, 6% { opacity: 0 } 9% { opacity: 1 } 12% { opacity: .35 } 15% { opacity: 1 } 18%, 100% { opacity: 0 } }

/* 1. "but" fits, 2. ", however" is a splice, 3. "; however," locks */
${flash("but", 13, 24, -14)}
${verdict("butbox", 16, false)}
${flash("butcap", 17, 24)}
${flash("how", 29, 41, -14)}
${verdict("howbox", 33, true)}
.${K("shake")} { animation-name: ${K("shake")}; }
@keyframes ${K("shake")} { 0%, 33% { transform: translateX(0) } 35% { transform: translateX(7px) } 37% { transform: translateX(-5px) } 39% { transform: translateX(3px) } 41%, 100% { transform: translateX(0) } }
${flash("howcap", 34, 41)}
${fade("ok", 46, 51, -14)}
${verdict("okbox", 50, false)}
${fade("okcap", 52, 56, 4)}

/* Second phase: the word slides around */
.${K("move")} { opacity: 0; animation-name: ${K("move")}; }
@keyframes ${K("move")} { 0%, 59% { opacity: 0 } 63%, 100% { opacity: 1 } }
.${K("chip")} { animation-name: ${K("chip")}; }
@keyframes ${K("chip")} {
  0%, 67% { transform: translate(${160 - CHIP / 2 - (X1 + W2 + 12)}px, -31px) }
  75%, 80% { transform: translate(0, 0) }
  88%, 100% { transform: translate(${X1 + W1 + 14 - (X1 + W2 + 12)}px, -62px) }
}
.${K("p2")} { animation-name: ${K("p2")}; }
@keyframes ${K("p2")} { 0%, 62% { transform: none } 68%, 80% { transform: translateX(${OPEN}px) } 88%, 100% { transform: none } }
.${K("pair")} { opacity: 0; animation-name: ${K("pair")}; }
@keyframes ${K("pair")} { 0%, 73% { opacity: 0 } 77%, 82% { opacity: 1 } 85%, 100% { opacity: 0 } }
.${K("dot")} { animation-name: ${K("dot")}; }
@keyframes ${K("dot")} { 0%, 85% { opacity: 1 } 88%, 100% { opacity: 0 } }
.${K("endmark")} { opacity: 0; animation-name: ${K("endmark")}; }
@keyframes ${K("endmark")} { 0%, 87% { opacity: 0 } 90%, 100% { opacity: 1 } }
.${K("cap1")} { opacity: 0; animation-name: ${K("cap1")}; }
@keyframes ${K("cap1")} { 0%, 74% { opacity: 0 } 78%, 83% { opacity: 1 } 86%, 100% { opacity: 0 } }
.${K("cap2")} { opacity: 0; animation-name: ${K("cap2")}; }
@keyframes ${K("cap2")} { 0%, 88% { opacity: 0 } 91%, 100% { opacity: 1 } }
`;

/** A rounded punctuation box with a big mark in it (marks sit slightly above the baseline). */
function Mark({ x, y, mark, color }: { x: number; y: number; mark: string; color: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={24} fontWeight={700} fill={color}>
      {mark}
    </text>
  );
}

export default function Visual() {
  const chipX = X1 + W2 + 12;
  const rowBase = 108;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* Two full sentences with a gap in between */}
        <g className={`${A} ${K("s")}`}>
          <rect x={16} y={8} width={288} height={28} rx={10} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={160} y={27} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            The museum was free
          </text>
          <rect x={16} y={104} width={288} height={28} rx={10} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={160} y={123} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            the line was long
          </text>
        </g>

        {/* The slot for marks */}
        <g className={`${A} ${K("slot")}`}>
          <rect x={92} y={54} width={136} height={32} rx={9} fill="none" stroke={C.primary} strokeWidth={2.5} strokeDasharray="5 4" />
        </g>

        {/* 1. FANBOYS "but" after a comma: fits */}
        <g className={`${A} ${K("but")}`}>
          <rect className={`${A} ${K("butbox")}`} x={122} y={55} width={76} height={30} rx={9} strokeWidth={2.5} />
          <text x={160} y={77} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
            , but
          </text>
        </g>
        <g className={`${A} ${K("butcap")}`}>
          <text x={160} y={153} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            FANBOYS: , but
          </text>
        </g>

        {/* 2. "however" with a comma: rejected */}
        <g className={`${A} ${K("how")}`}>
          <g className={`${A} ${K("shake")}`}>
            <rect className={`${A} ${K("howbox")}`} x={104} y={55} width={112} height={30} rx={9} strokeWidth={2.5} />
            <text x={160} y={77} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
              , however
            </text>
          </g>
        </g>
        <g className={`${A} ${K("howcap")}`}>
          <text x={160} y={153} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad}>
            comma splice
          </text>
        </g>

        {/* 3. "; however," locks in */}
        <g className={`${A} ${K("ok")}`}>
          <rect className={`${A} ${K("okbox")}`} x={92} y={55} width={136} height={30} rx={9} strokeWidth={2.5} />
          <Mark x={106} y={77} mark=";" color={C.primaryText} />
          <rect x={120} y={59} width={80} height={22} rx={7} fill={C.primary} />
          <text x={160} y={75} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.onPrimary}>
            however
          </text>
          <Mark x={214} y={77} mark="," color={C.primaryText} />
        </g>
        <g className={`${A} ${K("okcap")}`}>
          <text x={160} y={153} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            not FANBOYS: however, therefore
          </text>
          <text x={160} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            or a period: . However,
          </text>
        </g>

        {/* Second phase: the word slides inside one sentence, then to the end of the first */}
        <g className={`${A} ${K("move")}`}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <text x={X1} y={rowBase - 62} fontSize={14} fontWeight={700} fill={C.ink}>
            The museum was free
          </text>
          <text className={`${A} ${K("dot")}`} x={X1 + W1} y={rowBase - 62} fontSize={14} fontWeight={700} fill={C.ink}>
            .
          </text>
          <g className={`${A} ${K("endmark")}`}>
            <text x={X1 + W1 + 3} y={rowBase - 62} fontSize={22} fontWeight={700} fill={C.primaryText}>
              ,
            </text>
            <text x={X1 + W1 + 14 + CHIP + 2} y={rowBase - 62} fontSize={22} fontWeight={700} fill={C.primaryText}>
              ;
            </text>
          </g>
          <text x={X1} y={rowBase} fontSize={14} fontWeight={700} fill={C.ink}>
            the line
          </text>
          <g className={`${A} ${K("pair")}`}>
            <text x={X1 + W2 + 1} y={rowBase} fontSize={22} fontWeight={700} fill={C.primaryText}>
              ,
            </text>
            <text x={X1 + W2 + 12 + CHIP + 3} y={rowBase} fontSize={22} fontWeight={700} fill={C.primaryText}>
              ,
            </text>
          </g>
          <g className={`${A} ${K("p2")}`}>
            <text x={X1 + W2 + 5} y={rowBase} fontSize={14} fontWeight={700} fill={C.ink}>
              was long.
            </text>
          </g>
          <g className={`${A} ${K("chip")}`}>
            <rect x={chipX} y={rowBase - 17} width={CHIP} height={24} rx={7} fill={C.primary} />
            <text x={chipX + CHIP / 2} y={rowBase} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.onPrimary}>
              however
            </text>
          </g>
          <g className={`${A} ${K("cap1")}`}>
            <text x={160} y={156} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
              pair of commas
            </text>
          </g>
          <g className={`${A} ${K("cap2")}`}>
            <text x={160} y={156} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
              ends the sentence it contrasts with
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
