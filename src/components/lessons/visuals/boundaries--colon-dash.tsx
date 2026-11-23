import { C, Css, Svg } from "./kit";

// Colon / one dash: a full sentence on the left, the detail on the right (list, phrase, explaining sentence).
// The dash does the same job. A fragment on the left breaks it.
export const alt =
  "A full sentence, then a colon or one dash, then the detail: a list, a phrase or a sentence that explains. After an unfinished phrase the colon gets a red cross.";

const P = "v-boundaries--colon-dash-";
const K = (n: string) => P + n;
const A = K("a");

/** Fade (and slide) one element in between a% and b%, then stay. */
const fade = (n: string, a: number, b: number, dy = 4) =>
  `.${K(n)} { animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${b}%, 100% { opacity: 1; transform: none } }`;
const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

${fade("block", 5, 10, 0)}
${fade("full", 10, 14)}
.${K("slot")} { opacity: 0; animation-name: ${K("slot")}; }
@keyframes ${K("slot")} { 0%, 10% { opacity: 0 } 13% { opacity: 1 } 16% { opacity: .35 } 19% { opacity: 1 } 22%, 100% { opacity: 0 } }
${fade("colon", 19, 26, -26)}
.${K("arrow")} { stroke-dasharray: 100; animation-name: ${K("arrow")}; }
@keyframes ${K("arrow")} { 0%, 27% { stroke-dashoffset: 100 } 32%, 100% { stroke-dashoffset: 0 } }
.${K("next")} { opacity: 0; animation-name: ${K("next")}; }
@keyframes ${K("next")} { 0%, 29% { opacity: 0 } 34%, 60% { opacity: 1 } 64%, 100% { opacity: 0 } }
${fade("r1", 36, 41)}
${fade("t1", 41, 44, 0)}
${fade("r2", 45, 50)}
${fade("t2", 50, 53, 0)}
${fade("r3", 54, 59)}
${fade("t3", 59, 62, 0)}
${fade("dash", 64, 70)}
${fade("same", 66, 71)}

/* Wrong case: the left block is a fragment, the colon is rejected */
.${K("wrong")} { opacity: 0; animation-name: ${K("wrong")}; }
@keyframes ${K("wrong")} { 0%, 79% { opacity: 0 } 84%, 100% { opacity: 1 } }
.${K("shake")} { animation-name: ${K("shake")}; }
@keyframes ${K("shake")} { 0%, 84% { transform: translateX(0) } 87% { transform: translateX(8px) } 90% { transform: translateX(-4px) } 93%, 100% { transform: translateX(0) } }
`;

/** One detail card: tag on the left, text in a card, tick on the right. */
function Row({ i, y, tag, text }: { i: number; y: number; tag: string; text: string }) {
  return (
    <>
      <g className={`${A} ${K("r" + i)}`}>
        <text x={16} y={y + 17} fontSize={11} fontWeight={700} fill={C.muted}>
          {tag}
        </text>
        <rect x={88} y={y} width={216} height={26} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={100} y={y + 18} fontSize={14} fontWeight={600} fill={C.ink}>
          {text}
        </text>
      </g>
      <g className={`${A} ${K("t" + i)}`}>
        <circle cx={288} cy={y + 13} r={7} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <path d={`M285 ${y + 13} l2.5 2.5 l4 -5`} fill="none" stroke={C.good} strokeWidth={1.8} />
      </g>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* The full sentence */}
        <g className={`${A} ${K("block")}`}>
          <rect x={16} y={14} width={178} height={36} rx={10} fill={C.goodSoft} stroke={C.good} strokeWidth={2} />
          <text x={28} y={37} fontSize={13} fontWeight={700} fill={C.ink}>
            She packed two things
          </text>
        </g>
        <g className={`${A} ${K("full")}`}>
          <text x={16} y={67} fontSize={11} fontWeight={700} fill={C.good}>
            full sentence
          </text>
        </g>

        {/* The slot, then the colon drops in */}
        <g className={`${A} ${K("slot")}`}>
          <rect x={202} y={14} width={26} height={36} rx={8} fill="none" stroke={C.primary} strokeWidth={2} strokeDasharray="4 4" />
        </g>
        <g className={`${A} ${K("colon")}`}>
          <rect x={202} y={14} width={26} height={36} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <circle cx={215} cy={25} r={3.5} fill={C.primaryText} />
          <circle cx={215} cy={39} r={3.5} fill={C.primaryText} />
        </g>

        {/* "or" one dash, same job */}
        <g className={`${A} ${K("dash")}`}>
          <text x={241} y={37} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            or
          </text>
          <rect x={252} y={14} width={34} height={36} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <path d="M260 32 H278" stroke={C.primaryText} strokeWidth={4} fill="none" />
        </g>

        {/* Signpost arrow and the two captions that share one spot */}
        <path className={`${A} ${K("arrow")}`} d="M215 54 V74 M209 68 L215 75 L221 68" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.2} />
        <g className={`${A} ${K("next")}`}>
          <text x={224} y={69} fontSize={11} fontWeight={700} fill={C.primaryText}>
            detail follows
          </text>
        </g>
        <g className={`${A} ${K("same")}`}>
          <text x={224} y={69} fontSize={11} fontWeight={700} fill={C.primaryText}>
            dash = colon
          </text>
        </g>

        {/* The three kinds of detail */}
        <Row i={1} y={80} tag="list" text="a map and a compass" />
        <Row i={2} y={110} tag="phrase" text="one answer: yes" />
        <Row i={3} y={140} tag="explains it" text="it cost too much" />

        {/* Wrong case replaces the scene for a moment */}
        <g className={`${A} ${K("wrong")}`}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <rect x={16} y={44} width={178} height={36} rx={10} fill={C.fill} stroke={C.muted} strokeWidth={2} strokeDasharray="5 4" />
          <text x={28} y={67} fontSize={13} fontWeight={700} fill={C.muted}>
            She packed such as
          </text>
          <g className={`${A} ${K("shake")}`}>
            <rect x={202} y={44} width={26} height={36} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={2} />
            <circle cx={215} cy={55} r={3.5} fill={C.bad} />
            <circle cx={215} cy={69} r={3.5} fill={C.bad} />
          </g>
          <circle cx={250} cy={62} r={10} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <path d="M245.5 57.5 l9 9 M254.5 57.5 l-9 9" stroke={C.bad} strokeWidth={2.2} fill="none" />
          <text x={16} y={102} fontSize={11} fontWeight={700} fill={C.muted}>
            fragment
          </text>
          <text x={160} y={138} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.bad}>
            no colon after an unfinished phrase
          </text>
        </g>
      </g>
    </Svg>
  );
}
