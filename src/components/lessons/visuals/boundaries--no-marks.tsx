import { C, Css, Svg } from "./kit";

// No mark between words that belong together: subject | verb, verb | object, preposition | object.
// Then end marks: a direct question flips verb and subject and takes "?", a reported question keeps normal order and takes ".".
export const alt =
  "No comma between a subject and its verb, a verb and its object, or a preposition and its object. A direct question flips the order and ends with a question mark; a reported one ends with a period.";

const P = "v-boundaries--no-marks-";
const K = (n: string) => P + n;
const A = K("a");

/** Fade (and slide) one element in between a% and b%, then stay. */
const fade = (n: string, a: number, b: number, dy = 4) =>
  `.${K(n)} { animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${b}%, 100% { opacity: 1; transform: none } }`;
/** Visible only between a% and b%. */
const flash = (n: string, a: number, b: number, dy = 0) =>
  `.${K(n)} { opacity: 0; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${a + 3}%, ${b}% { opacity: 1; transform: none } ${b + 3}%, 100% { opacity: 0; transform: none } }`;
const draw = (n: string, a: number, b: number) =>
  `.${K(n)} { stroke-dasharray: 100; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { stroke-dashoffset: 100 } ${b}%, 100% { stroke-dashoffset: 0 } }`;

const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Phase 1: subject | verb, a comma tries to land and bounces off */
${fade("s1", 4, 9, 0)}
${fade("subj", 11, 15)}
${fade("verb", 14, 18)}
.${K("slot")} { opacity: 0; animation-name: ${K("slot")}; }
@keyframes ${K("slot")} { 0%, 15% { opacity: 0 } 19% { opacity: 1 } 22% { opacity: .35 } 25% { opacity: 1 } 28%, 100% { opacity: 0 } }
.${K("comma")} { opacity: 0; animation-name: ${K("comma")}; }
@keyframes ${K("comma")} {
  0%, 24% { opacity: 0; transform: translateY(-14px) }
  28% { opacity: 1; transform: none }
  31% { transform: translateX(5px) } 33% { transform: translateX(-4px) } 35% { transform: none }
  38%, 40% { opacity: 1; transform: none }
  44%, 100% { opacity: 0; transform: translateY(14px) }
}
${fade("shield", 40, 44, 0)}
${flash("cap1", 28, 44)}

/* Phase 2: two more joints */
${fade("r1", 46, 50)}
${fade("g1", 50, 54, 0)}
${fade("r2", 55, 59)}
${fade("g2", 59, 63, 0)}
${fade("cap2", 62, 66)}

/* Phase 3: questions (covers the scene, then the loop fades out) */
.${K("q")} { opacity: 0; animation-name: ${K("q")}; }
@keyframes ${K("q")} { 0%, 69% { opacity: 0 } 73%, 100% { opacity: 1 } }
${fade("d", 74, 78)}
${draw("swap", 78, 84)}
${fade("dlab", 80, 84)}
${fade("dq", 82, 86, 0)}
${fade("i", 85, 89)}
${fade("ilab", 89, 92)}
${fade("ip", 90, 93, 0)}
${fade("final", 91, 94)}
`;

/** A little "no mark" shield: a dashed gap with a red cross. */
function Shield({ x, y, size = 22 }: { x: number; y: number; size?: number }) {
  const m = size / 2;
  return (
    <>
      <rect x={x} y={y} width={size} height={size} rx={6} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
      <path d={`M${x + m - 4} ${y + m - 4} l8 8 M${x + m + 4} ${y + m - 4} l-8 8`} stroke={C.bad} strokeWidth={2} fill="none" />
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* Phase 1: "The books on the top shelf | belong to Maya" wrapped over two lines */}
        <g className={`${A} ${K("verb")}`}>
          <rect x={20} y={47} width={56} height={22} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        </g>
        <g className={`${A} ${K("s1")}`}>
          <text x={24} y={22} fontSize={14} fontWeight={600} fill={C.ink}>
            The books on the top shelf
          </text>
          <text x={24} y={62} fontSize={14} fontWeight={600} fill={C.ink}>
            belong to Maya
          </text>
        </g>
        <g className={`${A} ${K("subj")}`}>
          <path d="M24 28 H201" stroke={C.ink} strokeWidth={2.5} fill="none" />
          <text x={112} y={41} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            subject
          </text>
        </g>
        <g className={`${A} ${K("verb")}`}>
          <text x={48} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            verb
          </text>
        </g>
        <g className={`${A} ${K("slot")}`}>
          <rect x={207} y={5} width={22} height={24} rx={7} fill="none" stroke={C.primary} strokeWidth={2} strokeDasharray="4 4" />
        </g>
        <g className={`${A} ${K("comma")}`}>
          <rect x={207} y={5} width={22} height={24} rx={7} fill={C.badSoft} stroke={C.bad} strokeWidth={2} />
          <text x={218} y={25} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.bad}>
            ,
          </text>
          <circle cx={228} cy={5} r={7} fill={C.bad} />
          <path d="M225 2 l6 6 M231 2 l-6 6" stroke={C.bg} strokeWidth={1.8} fill="none" />
        </g>
        <g className={`${A} ${K("shield")}`}>
          <Shield x={207} y={5} size={24} />
        </g>
        <g className={`${A} ${K("cap1")}`}>
          <text x={160} y={162} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad}>
            no mark between subject and verb
          </text>
        </g>

        {/* Phase 2: two more joints */}
        <g className={`${A} ${K("r1")}`}>
          <rect x={24} y={94} width={70} height={24} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={59} y={111} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            collected
          </text>
          <rect x={128} y={94} width={46} height={24} rx={7} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={151} y={111} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            ferns
          </text>
          <text x={184} y={110} fontSize={11} fontWeight={700} fill={C.muted}>
            verb + object
          </text>
        </g>
        <g className={`${A} ${K("g1")}`}>
          <Shield x={100} y={94} size={24} />
        </g>
        <g className={`${A} ${K("r2")}`}>
          <rect x={24} y={126} width={28} height={24} rx={7} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={38} y={143} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            in
          </text>
          <rect x={86} y={126} width={78} height={24} rx={7} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={125} y={143} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            the forest
          </text>
          <text x={174} y={142} fontSize={11} fontWeight={700} fill={C.muted}>
            preposition + object
          </text>
        </g>
        <g className={`${A} ${K("g2")}`}>
          <Shield x={57} y={126} size={24} />
        </g>
        <g className={`${A} ${K("cap2")}`}>
          <text x={160} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            words that belong together: no mark
          </text>
        </g>

        {/* Phase 3: direct vs reported question */}
        <g className={`${A} ${K("q")}`}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <g className={`${A} ${K("d")}`}>
            <text x={24} y={16} fontSize={11} fontWeight={700} fill={C.muted}>
              direct question
            </text>
            <rect x={58} y={38} width={29} height={19} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
            <path d="M88 60 H122" stroke={C.ink} strokeWidth={2.5} fill="none" />
            <text x={24} y={52} fontSize={15} fontWeight={700} fill={C.ink}>
              How did they escape
            </text>
          </g>
          <path className={`${A} ${K("swap")}`} d="M72 30 q 15 -16 30 0 M76 24 l-4 6 l7 1 M98 24 l4 6 l-7 1" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
          <g className={`${A} ${K("dlab")}`}>
            <text x={24} y={72} fontSize={11} fontWeight={700} fill={C.primaryText}>
              verb before subject
            </text>
          </g>
          <g className={`${A} ${K("dq")}`}>
            <text x={179} y={54} fontSize={26} fontWeight={700} fill={C.primaryText}>
              ?
            </text>
          </g>

          <g className={`${A} ${K("i")}`}>
            <text x={24} y={96} fontSize={11} fontWeight={700} fill={C.muted}>
              reported question
            </text>
            <rect x={210} y={102} width={72} height={19} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
            <path d="M178 124 H210" stroke={C.ink} strokeWidth={2.5} fill="none" />
            <text x={24} y={116} fontSize={15} fontWeight={700} fill={C.ink}>
              The team asked how they escaped
            </text>
          </g>
          <g className={`${A} ${K("ilab")}`}>
            <text x={24} y={136} fontSize={11} fontWeight={700} fill={C.primaryText}>
              subject before verb
            </text>
          </g>
          <g className={`${A} ${K("ip")}`}>
            <text x={286} y={118} fontSize={26} fontWeight={700} fill={C.primaryText}>
              .
            </text>
          </g>
          <g className={`${A} ${K("final")}`}>
            <text x={160} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
              reported question = statement
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
