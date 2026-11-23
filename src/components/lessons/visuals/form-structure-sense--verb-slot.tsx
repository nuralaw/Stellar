import { C, Css, Svg } from "./kit";

// The main-verb slot: a subject needs exactly one main verb. If the main verb is already in the sentence,
// the blank takes a describing form (connecting). If no main verb is there yet, the blank is the main verb.
export const alt =
  "Two sentences with a blank after The bridge. In the first, the main verb opened is there: connects is rejected, connecting locks in. In the second, no main verb is there, so connects locks in.";

const P = "v-form-structure-sense--verb-slot-";
const A = P + "a";
const SCENE = P + "scene";

const css = `
.v-form-structure-sense--verb-slot-a { animation: 10s ease-in-out infinite; }
.v-form-structure-sense--verb-slot-scene { animation-name: v-form-structure-sense--verb-slot-scene; }
@keyframes v-form-structure-sense--verb-slot-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Row 1: the main verb "opened" is spotted */
.v-form-structure-sense--verb-slot-mv { fill: ${C.primaryText}; animation-name: v-form-structure-sense--verb-slot-mv; }
@keyframes v-form-structure-sense--verb-slot-mv { 0%, 10% { fill: ${C.ink} } 16%, 100% { fill: ${C.primaryText} } }
.v-form-structure-sense--verb-slot-mvTag { animation-name: v-form-structure-sense--verb-slot-mvTag; }
@keyframes v-form-structure-sense--verb-slot-mvTag { 0%, 12% { opacity: 0; transform: translateY(4px) } 18%, 100% { opacity: 1; transform: none } }

/* Row 1: "connects" is tried (second main verb) and rejected, then "connecting" locks in */
.v-form-structure-sense--verb-slot-bad { opacity: 0; animation-name: v-form-structure-sense--verb-slot-bad; }
@keyframes v-form-structure-sense--verb-slot-bad {
  0%, 22% { opacity: 0; transform: translateX(0) }
  26%, 34% { opacity: 1; transform: translateX(0) }
  28% { transform: translateX(-3px) }
  30% { transform: translateX(3px) }
  32% { transform: translateX(-2px) }
  38%, 100% { opacity: 0; transform: translateX(0) }
}
.v-form-structure-sense--verb-slot-slot1 { fill: none; stroke: ${C.good}; animation-name: v-form-structure-sense--verb-slot-slot1; }
@keyframes v-form-structure-sense--verb-slot-slot1 {
  0%, 22% { fill: none; stroke: ${C.muted} }
  26%, 35% { fill: ${C.badSoft}; stroke: ${C.bad} }
  40%, 46% { fill: none; stroke: ${C.muted} }
  50%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }
}
.v-form-structure-sense--verb-slot-win1 { animation-name: v-form-structure-sense--verb-slot-win1; }
@keyframes v-form-structure-sense--verb-slot-win1 { 0%, 46% { opacity: 0; transform: translateY(6px) } 52%, 100% { opacity: 1; transform: none } }
.v-form-structure-sense--verb-slot-cap1 { animation-name: v-form-structure-sense--verb-slot-cap1; }
@keyframes v-form-structure-sense--verb-slot-cap1 { 0%, 50% { opacity: 0 } 56%, 100% { opacity: 1 } }

/* Row 2: no main verb yet, so "connects" fits */
.v-form-structure-sense--verb-slot-slot2 { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-form-structure-sense--verb-slot-slot2; }
@keyframes v-form-structure-sense--verb-slot-slot2 { 0%, 66% { fill: none; stroke: ${C.muted} } 72%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-form-structure-sense--verb-slot-win2 { animation-name: v-form-structure-sense--verb-slot-win2; }
@keyframes v-form-structure-sense--verb-slot-win2 { 0%, 66% { opacity: 0; transform: translateY(6px) } 72%, 100% { opacity: 1; transform: none } }
.v-form-structure-sense--verb-slot-cap2 { animation-name: v-form-structure-sense--verb-slot-cap2; }
@keyframes v-form-structure-sense--verb-slot-cap2 { 0%, 72% { opacity: 0 } 78%, 100% { opacity: 1 } }
`;

const SX = 95; // slot left
const SW = 84; // slot width
const CX = SX + SW / 2;

function Row({ y, tail, rowClass }: { y: number; tail: string; rowClass: string }) {
  return (
    <g fontSize={13} fontWeight={600}>
      <text x={21} y={y} textLength={68} lengthAdjust="spacingAndGlyphs" fill={C.ink}>
        The bridge
      </text>
      <rect className={`${A} ${rowClass}`} x={SX} y={y - 19} width={SW} height={26} rx={13} strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={185} y={y} textLength={tail === "two islands" ? 72 : 76} lengthAdjust="spacingAndGlyphs" fill={C.ink}>
        {tail}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {/* Row 1: the main verb is already here */}
        <Row y={46} tail="two islands" rowClass={P + "slot1"} />
        <text className={`${A} ${P + "mv"}`} x={262} y={46} textLength={40} lengthAdjust="spacingAndGlyphs" fontSize={13} fontWeight={600}>
          opened.
        </text>
        <g className={`${A} ${P + "mvTag"}`}>
          <text x={282} y={26} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText}>
            main verb
          </text>
        </g>
        <text className={`${A} ${P + "bad"}`} x={CX} y={46} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.bad}>
          connects
        </text>
        <text className={`${A} ${P + "win1"}`} x={CX} y={46} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          connecting
        </text>
        <text className={`${A} ${P + "cap1"}`} x={160} y={76} textAnchor="middle" fontSize={12} fill={C.muted}>
          main verb is here: blank = describing form
        </text>

        {/* Row 2: no main verb yet */}
        <Row y={122} tail="two islands." rowClass={P + "slot2"} />
        <text className={`${A} ${P + "win2"}`} x={CX} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          connects
        </text>
        <text className={`${A} ${P + "cap2"}`} x={160} y={152} textAnchor="middle" fontSize={12} fill={C.muted}>
          no main verb yet: the blank is it
        </text>
      </g>
    </Svg>
  );
}
