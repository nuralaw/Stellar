import { C, Css, Svg } from "./kit";

// A dependent clause (because, which ...) cannot stand alone: it hooks onto a main clause.
// Opener + comma, essential tail with no mark, extra "which" tail with a comma. A period or semicolon leaves a fragment.
export const alt =
  "A main clause and a dependent clause that cannot stand alone. Before the main clause it takes a comma; after it, no mark if essential, a comma if extra. A period or semicolon is rejected.";

const P = "v-boundaries--dependent-";
const K = (n: string) => P + n;
const A = K("a");

/** Fade (and slide) one element in between a% and b%, then stay. */
const fade = (n: string, a: number, b: number, dy = 4) =>
  `.${K(n)} { animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${b}%, 100% { opacity: 1; transform: none } }`;
/** Visible only from a% to b% (hidden in the final frame). */
const flash = (n: string, a: number, b: number, from = "translateY(4px)") =>
  `.${K(n)} { opacity: 0; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: ${from} } ${a + 4}%, ${b}% { opacity: 1; transform: none } ${b + 3}%, 100% { opacity: 0; transform: none } }`;

const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

${fade("main", 5, 10, 0)}
${fade("mtag", 8, 12)}

/* 1. The opener floats in with a loose hook, the hook snaps on and a comma sits between */
${flash("top", 12, 40, "translateX(-24px)")}
${flash("hook", 14, 25, "translateY(0)")}
${flash("link", 25, 40, "translateY(0)")}
${flash("comma1", 27, 40, "translateY(-12px)")}
${flash("cap1", 16, 24)}
${flash("cap2", 28, 40)}

/* 2. The essential tail: no mark */
${flash("tail1", 43, 55, "translateY(10px)")}
${flash("link2", 45, 55, "translateY(0)")}
${flash("nomark", 48, 55)}
${flash("cap3", 45, 55)}

/* 3. The extra "which" tail: comma (this is the final frame) */
.${K("tail2")} { animation-name: ${K("tail2")}; }
@keyframes ${K("tail2")} { 0%, 57% { opacity: 0; transform: translateY(10px) } 62%, 100% { opacity: 1; transform: none } }
.${K("link3")} { stroke-dasharray: 100; animation-name: ${K("link3")}; }
@keyframes ${K("link3")} { 0%, 57% { stroke-dashoffset: 100 } 63%, 100% { stroke-dashoffset: 0 } }
.${K("comma2")} { animation-name: ${K("comma2")}; }
@keyframes ${K("comma2")} { 0%, 59% { opacity: 0; transform: translateY(-12px) } 64%, 70% { opacity: 1; transform: none } 73%, 88% { opacity: 0; transform: none } 91%, 100% { opacity: 1; transform: none } }
.${K("cap4")} { animation-name: ${K("cap4")}; }
@keyframes ${K("cap4")} { 0%, 62% { opacity: 0 } 66%, 71% { opacity: 1 } 74%, 89% { opacity: 0 } 92%, 100% { opacity: 1 } }

/* 4. A period and a semicolon try to take the comma's place and bounce off */
.${K("try1")} { opacity: 0; animation-name: ${K("try1")}; }
@keyframes ${K("try1")} {
  0%, 73% { opacity: 0; transform: translateY(-26px) }
  77% { opacity: 1; transform: translateY(0) }
  79% { transform: translateX(5px) } 81% { transform: translateX(-4px) } 83% { transform: translateX(0) }
  86%, 100% { opacity: 0; transform: translateY(-26px) }
}
.${K("try2")} { opacity: 0; animation-name: ${K("try2")}; }
@keyframes ${K("try2")} {
  0%, 80% { opacity: 0; transform: translateY(-26px) }
  84% { opacity: 1; transform: translateY(0) }
  86% { transform: translateX(5px) } 88% { transform: translateX(-4px) } 89.5% { transform: translateX(0) }
  92%, 100% { opacity: 0; transform: translateY(-26px) }
}
.${K("cap5")} { opacity: 0; animation-name: ${K("cap5")}; }
@keyframes ${K("cap5")} { 0%, 74% { opacity: 0 } 78%, 91% { opacity: 1 } 94%, 100% { opacity: 0 } }
`;

/** A small punctuation chip (22 wide, same height as a block). */
function Chip({ x, y, mark, bad }: { x: number; y: number; mark: string; bad?: boolean }) {
  return (
    <>
      <rect x={x} y={y} width={22} height={28} rx={7} fill={bad ? C.badSoft : C.fill} stroke={bad ? C.bad : C.primary} strokeWidth={2} />
      <text x={x + 11} y={y + 21} textAnchor="middle" fontSize={22} fontWeight={700} fill={bad ? C.bad : C.primaryText}>
        {mark}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* The main clause: green, solid */}
        <g className={`${A} ${K("main")}`}>
          <rect x={16} y={62} width={222} height={28} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={2} />
          <text x={28} y={81} fontSize={14} fontWeight={600} fill={C.ink}>
            the bus took the coast road
          </text>
        </g>
        <g className={`${A} ${K("mtag")}`}>
          <text x={246} y={80} fontSize={11} fontWeight={700} fill={C.good}>
            main clause
          </text>
        </g>

        {/* 1. The opener with a hook */}
        <g className={`${A} ${K("top")}`}>
          <rect x={16} y={10} width={222} height={28} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={28} y={29} fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fontSize={15} fontWeight={700} fill={C.primaryText}>
              Because
            </tspan>
            {" the pass was closed"}
          </text>
        </g>
        <g className={`${A} ${K("hook")}`}>
          <path d="M208 38 V44" stroke={C.primary} strokeWidth={2.5} fill="none" />
          <circle cx={208} cy={49} r={4.5} fill="none" stroke={C.primary} strokeWidth={2.5} />
        </g>
        <g className={`${A} ${K("link")}`}>
          <path d="M208 38 V62" stroke={C.primary} strokeWidth={2.5} fill="none" />
        </g>
        <g className={`${A} ${K("comma1")}`}>
          <Chip x={246} y={10} mark="," />
        </g>
        <g className={`${A} ${K("cap1")}`}>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            dependent: cannot stand alone
          </text>
        </g>
        <g className={`${A} ${K("cap2")}`}>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            opener, main
          </text>
        </g>

        {/* 2. The essential tail, no mark */}
        <g className={`${A} ${K("tail1")}`}>
          <rect x={16} y={114} width={222} height={28} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={28} y={133} fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fontSize={15} fontWeight={700} fill={C.primaryText}>
              because
            </tspan>
            {" the pass was closed"}
          </text>
        </g>
        <g className={`${A} ${K("link2")}`}>
          <path d="M60 90 V114" stroke={C.primary} strokeWidth={2.5} fill="none" />
        </g>
        <g className={`${A} ${K("nomark")}`}>
          <text x={70} y={106} fontSize={11} fontWeight={700} fill={C.muted}>
            no mark
          </text>
        </g>
        <g className={`${A} ${K("cap3")}`}>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            main + essential: no comma
          </text>
        </g>

        {/* 3. The extra "which" tail with a comma: the final frame */}
        <g className={`${A} ${K("tail2")}`}>
          <rect x={44} y={114} width={196} height={28} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={56} y={133} fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fontSize={15} fontWeight={700} fill={C.primaryText}>
              which
            </tspan>
            {" surprised everyone"}
          </text>
          <text x={248} y={132} fontSize={11} fontWeight={700} fill={C.primaryText}>
            dependent
          </text>
        </g>
        <path className={`${A} ${K("link3")}`} d="M100 90 V114" pathLength={100} stroke={C.primary} strokeWidth={2.5} fill="none" />
        <g className={`${A} ${K("comma2")}`}>
          <Chip x={16} y={114} mark="," />
        </g>
        <g className={`${A} ${K("cap4")}`}>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            extra tail: comma
          </text>
        </g>

        {/* 4. Period and semicolon bounce off */}
        <g className={`${A} ${K("try1")}`}>
          <Chip x={16} y={114} mark="." bad />
          <circle cx={38} cy={114} r={7} fill={C.bad} />
          <path d="M35 111 l6 6 M41 111 l-6 6" stroke={C.bg} strokeWidth={1.8} fill="none" />
        </g>
        <g className={`${A} ${K("try2")}`}>
          <Chip x={16} y={114} mark=";" bad />
          <circle cx={38} cy={114} r={7} fill={C.bad} />
          <path d="M35 111 l6 6 M41 111 l-6 6" stroke={C.bg} strokeWidth={1.8} fill="none" />
        </g>
        <g className={`${A} ${K("cap5")}`}>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad}>
            leaves a fragment
          </text>
        </g>
      </g>
    </Svg>
  );
}
