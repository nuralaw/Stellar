import { C, Css, Svg } from "./kit";

// Transitions, phrase choices: test the relation half and the target half separately.
export const alt =
  "Sentence 1: \"Researchers built computer models.\" The card \"Based on | these models,\" passes both checks, relation and target; \"Despite | these estimates,\" fails on its relation and leaves.";

const P = "v-transitions--phrase-";
const A = P + "a";
const n = (s: string) => P + s;

const X0 = 50;
const XM = 130;
const X1 = 270;
const R = 8;

/** Path of the left (relation) or right (target) half of a card, with rounded outer corners. */
function half(side: "l" | "r", y: number, h: number) {
  const b = y + h;
  return side === "l"
    ? `M${X0 + R} ${y} H${XM} V${b} H${X0 + R} Q${X0} ${b} ${X0} ${b - R} V${y + R} Q${X0} ${y} ${X0 + R} ${y} Z`
    : `M${XM} ${y} H${X1 - R} Q${X1} ${y} ${X1} ${y + R} V${b - R} Q${X1} ${b} ${X1 - R} ${b} H${XM} Z`;
}

const OK = { y: 64, h: 30 };
const NO = { y: 136, h: 26 };
const LINK_X = 218;

const css = `
.${A} { animation: 11s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
.${n("s1")} { animation-name: ${n("s1")}; }
@keyframes ${n("s1")} { 0%, 4% { opacity: 0 } 11%, 100% { opacity: 1 } }
.${n("glow")} { fill: ${C.primaryText}; animation-name: ${n("glow")}; }
@keyframes ${n("glow")} { 0%, 13% { fill: ${C.ink} } 19%, 100% { fill: ${C.primaryText} } }
.${n("card")} { animation-name: ${n("card")}; }
@keyframes ${n("card")} { 0%, 20% { opacity: 0; transform: translateY(12px) } 28%, 100% { opacity: 1; transform: none } }
.${n("okR")} { animation-name: ${n("okR")}; }
@keyframes ${n("okR")} { 0%, 32% { opacity: 0 } 38%, 100% { opacity: 1 } }
.${n("okT")} { animation-name: ${n("okT")}; }
@keyframes ${n("okT")} { 0%, 42% { opacity: 0 } 48%, 100% { opacity: 1 } }
.${n("link")} { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: ${n("link")}; }
@keyframes ${n("link")} { 0%, 42% { stroke-dashoffset: 100; opacity: 0 } 52%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.${n("rej")} { opacity: 0; transform: translateX(70px); animation-name: ${n("rej")}; }
@keyframes ${n("rej")} {
  0%, 56% { opacity: 0; transform: translateX(40px) }
  63%, 65% { opacity: 1; transform: translateX(0) }
  67% { transform: translateX(-4px) }
  69% { transform: translateX(4px) }
  71% { transform: translateX(-3px) }
  73% { opacity: 1; transform: translateX(0) }
  82%, 100% { opacity: 0; transform: translateX(70px) }
}
.${n("bad")} { fill: ${C.badSoft}; animation-name: ${n("bad")}; }
@keyframes ${n("bad")} { 0%, 64% { fill: ${C.fill} } 68%, 100% { fill: ${C.badSoft} } }
.${n("x")} { animation-name: ${n("x")}; }
@keyframes ${n("x")} { 0%, 64% { opacity: 0 } 68%, 100% { opacity: 1 } }
`;

function Tick({ cx, cy, ok }: { cx: number; cy: number; ok: boolean }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={8} fill={ok ? C.good : C.bad} />
      <path
        d={ok ? `M${cx - 4} ${cy} L${cx - 1} ${cy + 3.5} L${cx + 4.5} ${cy - 3.5}` : `M${cx - 3.5} ${cy - 3.5} L${cx + 3.5} ${cy + 3.5} M${cx + 3.5} ${cy - 3.5} L${cx - 3.5} ${cy + 3.5}`}
        fill="none"
        stroke={C.bg}
        strokeWidth={2}
      />
    </>
  );
}

export default function Visual() {
  const okMid = OK.y + OK.h / 2 + 5;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {/* Sentence 1 */}
        <text className={`${A} ${n("s1")}`} x={160} y={34} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.ink}>
          Researchers built{" "}
          <tspan className={`${A} ${n("glow")}`} fontWeight={700}>
            computer models
          </tspan>
          .
        </text>

        {/* Accepted card */}
        <g className={`${A} ${n("card")}`}>
          <path d={half("l", OK.y, OK.h)} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <path d={half("r", OK.y, OK.h)} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <path className={`${A} ${n("okR")}`} d={half("l", OK.y, OK.h)} fill={C.goodSoft} stroke={C.good} strokeWidth={2} />
          <path className={`${A} ${n("okT")}`} d={half("r", OK.y, OK.h)} fill={C.goodSoft} stroke={C.good} strokeWidth={2} />
          <text x={(X0 + XM) / 2} y={okMid} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} stroke="none">
            Based on
          </text>
          <text x={(XM + X1) / 2} y={okMid} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} stroke="none">
            these models,
          </text>
        </g>
        <g className={`${A} ${n("okR")}`}>
          <Tick cx={72} cy={113} ok />
          <text x={84} y={117} fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            relation
          </text>
        </g>
        <g className={`${A} ${n("okT")}`}>
          <Tick cx={162} cy={113} ok />
          <text x={174} y={117} fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            target
          </text>
        </g>
        <path
          className={`${A} ${n("link")}`}
          d={`M${LINK_X} ${OK.y - 2} V43`}
          pathLength={100}
          fill="none"
          stroke={C.primary}
          strokeWidth={2}
          strokeDasharray="100"
        />

        {/* Rejected card */}
        <g className={`${A} ${n("rej")}`}>
          <path className={`${A} ${n("bad")}`} d={half("l", NO.y, NO.h)} stroke={C.bad} strokeWidth={1.5} />
          <path d={half("r", NO.y, NO.h)} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={(X0 + XM) / 2} y={NO.y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            Despite
          </text>
          <text x={(XM + X1) / 2} y={NO.y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            these estimates,
          </text>
          <g className={`${A} ${n("x")}`}>
            <Tick cx={X0} cy={NO.y} ok={false} />
          </g>
        </g>
      </g>
    </Svg>
  );
}
