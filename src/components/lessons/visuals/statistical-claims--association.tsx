import { C, Css, Svg } from "./kit";

// A survey sees exercise and sleep rise together (association); it cannot say which way the arrow points, or whether a third factor drives both.
export const alt = "Exercise and sleep rise together: an association. Arrows between them carry question marks, and a third factor could drive both. Cause is crossed out; is associated with is ticked.";

const P = "v-statistical-claims--association-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const pop = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scale(0.4) } ${t + 3}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const U = [0.05, 0.12, 0.2, 0.28, 0.35, 0.42, 0.5, 0.58, 0.65, 0.74, 0.83, 0.92];
const NOISE = [0.08, -0.05, 0.12, -0.1, 0.06, 0.14, -0.08, 0.05, -0.12, 0.09, -0.04, 0.06];
const OX = 34;
const OY = 122;
const PX = (u: number) => OX + 140 * u;
const PY = (v: number) => OY - 88 * v;
const TREND = (u: number) => 0.15 + 0.72 * u;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("axes", 1)}
${U.map((_, i) => pop(`d${i}`, 6 + i * 1.6)).join("\n")}
${draw("line", 26, 6)}
${at("assoc", 34)}
${at("ex", 40)}
${at("ar1", 44)}
${at("ar2", 48)}
${at("third", 56)}
${draw("t1", 60, 4)}
${draw("t2", 63, 5)}
${at("cause", 72)}
${draw("strike", 76, 5)}
${at("ok", 82)}
`;

const Arrow = ({ d, col, w = 1.5 }: { d: string; col: string; w?: number }) => <path d={d} fill="none" stroke={col} strokeWidth={w} />;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The scatter plot */}
      <g className={cls("axes")}>
        <path d={`M${OX} 28 V${OY} H178`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={OX} y={22} fontSize={11} fontWeight={600} fill={C.muted}>
          sleep
        </text>
        <text x={178} y={OY + 14} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="end">
          exercise
        </text>
      </g>
      {U.map((u, i) => (
        <circle key={i} className={cls(`d${i}`)} cx={PX(u)} cy={PY(Math.min(0.95, TREND(u) + NOISE[i]))} r={4} fill={C.ink} />
      ))}
      <path className={cls("line")} d={`M${PX(0)} ${PY(TREND(0))} L${PX(1)} ${PY(TREND(1))}`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
      <text className={cls("assoc")} x={OX + 8} y={44} fontSize={13} fontWeight={700} fill={C.primaryText}>
        association
      </text>

      {/* Which way does it point? */}
      <g className={cls("ex")}>
        <rect x={206} y={66} width={60} height={22} rx={5} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={236} y={81} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          exercise
        </text>
        <rect x={206} y={112} width={60} height={22} rx={5} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={236} y={127} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          sleep
        </text>
      </g>
      <g className={cls("ar1")}>
        <Arrow d="M222 91 V108 M218 104 L222 108 L226 104" col={C.muted} />
        <text x={229} y={104} fontSize={12} fontWeight={700} fill={C.muted}>
          ?
        </text>
      </g>
      <g className={cls("ar2")}>
        <Arrow d="M250 108 V91 M246 95 L250 91 L254 95" col={C.muted} />
        <text x={257} y={104} fontSize={12} fontWeight={700} fill={C.muted}>
          ?
        </text>
      </g>

      {/* Or a third factor behind both */}
      <g className={cls("third")}>
        <rect x={200} y={20} width={96} height={22} rx={5} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
        <text x={248} y={35} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          a third factor
        </text>
      </g>
      <g fill="none" stroke={C.bad} strokeWidth={1.5}>
        <path className={cls("t1")} d="M236 43 V63 M232 59 L236 63 L240 59" pathLength={100} />
        <path className={cls("t2")} d="M286 43 V123 H270 M274 119 L270 123 L274 127" pathLength={100} />
      </g>

      {/* What the survey can say */}
      <g className={cls("cause")}>
        <text x={74} y={162} fontSize={12} fontWeight={700} fill={C.bad} textAnchor="middle">
          cause
        </text>
      </g>
      <path className={cls("strike")} d="M55 158 H93" pathLength={100} fill="none" stroke={C.bad} strokeWidth={2} />
      <g className={cls("ok")}>
        <text x={102} y={162} fontSize={12} fontWeight={700} fill={C.good}>
          is associated with
        </text>
        <path d="M216 158 l4 4 l8 -9" fill="none" stroke={C.good} strokeWidth={2.5} />
      </g>
    </Svg>
  );
}
