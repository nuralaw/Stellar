import { C, Css, Svg, Tex } from "./kit";

// In a story, b is the amount at time 0 and m is the change per ONE unit: a rate given per several units is divided down first.
export const alt =
  "A battery drops from 100 to 64 over 6 minutes, 36 in all. Six equal steps of minus 6 show the rate, minus 6 per minute, so B(t) = 100 minus 6t.";

const P = "v-linear-functions--rate-start-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fades in at s% (taking d%), optionally from a transform, holds, then leaves with the scene. */
const fx = (n: string, s: number, d = 5, from = "none", box = false) =>
  r(n, `0%, ${s}% { opacity: 0; transform: ${from} } ${s + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, box ? "transform-box: fill-box; transform-origin: center;" : "");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  fx("axis", 0, 4),
  fx("start", 3, 5, "none"),
  fx("dot0", 3, 4, "scale(0)", true),
  r("line", "0%, 10% { stroke-dashoffset: 100; opacity: 1 } 24%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }", "stroke-dasharray: 100;"),
  fx("dot6", 23, 4, "scale(0)", true),
  fx("end", 26, 4),
  fx("total", 31, 6),
  ...[0, 1, 2, 3, 4, 5].map((i) => fx(`st${i}`, 42 + 3.5 * i, 4)),
  fx("per1", 63, 5),
  fx("m0", 66, 5),
  fx("m1", 72, 5),
  fx("b0", 78, 4),
  fx("b1", 82, 4),
  fx("b2", 86, 4),
].join("\n");

// Chart: 24 per minute across (origin x 26), 2.6 per point of battery down (100 at y 30).
const X = (t: number) => 26 + 24 * t;
const Y = (l: number) => 30 + 2.6 * (100 - l);
const lab = { stroke: "none" } as const;
const AXIS = 146;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Time axis */}
      <g className={cls("axis")}>
        <path d={`M${X(0)} ${AXIS} H${X(6) + 10}`} stroke={C.muted} strokeWidth={1.5} fill="none" />
        {[0, 1, 2, 3, 4, 5, 6].map((t) => (
          <g key={t}>
            <line x1={X(t)} y1={AXIS - 3} x2={X(t)} y2={AXIS + 3} stroke={C.muted} strokeWidth={1.5} />
            <text x={X(t)} y={AXIS + 15} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>{t}</text>
          </g>
        ))}
        <text x={X(6) + 18} y={AXIS + 15} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>minutes</text>
      </g>

      {/* The start: the level at t = 0 */}
      <g className={cls("start")}>
        <Tex x={14} y={20} size={13} anchor="start" width={170} color={C.primaryText}>{String.raw`\text{start }(t=0):\ b=100\%`}</Tex>
      </g>

      {/* The drop: 100 to 64 in 6 minutes */}
      <line className={cls("line")} x1={X(0)} y1={Y(100)} x2={X(6)} y2={Y(64)} pathLength={100} stroke={C.muted} strokeWidth={2.5} />
      <circle className={cls("dot0")} cx={X(0)} cy={Y(100)} r={5.5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
      <circle className={cls("dot6")} cx={X(6)} cy={Y(64)} r={4.5} fill={C.ink} stroke={C.bg} strokeWidth={1.5} />
      <text className={cls("end")} x={X(6)} y={Y(64) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>64%</text>

      {/* The total drop: neutral, it is NOT the rate */}
      <g className={cls("total")}>
        <path d={`M${X(6) + 15} ${Y(100)} H${X(6) + 21} V${Y(64)} H${X(6) + 15}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <path d={`M${X(1)} ${Y(100)} H${X(6) + 15} M${X(6)} ${Y(64)} H${X(6) + 15}`} fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="2 3" />
        <text x={X(6) + 29} y={66} fontSize={16} fontWeight={700} fill={C.ink} {...lab}>−36</text>
        <text x={X(6) + 29} y={82} fontSize={11} fill={C.muted} {...lab}>in 6 min</text>
      </g>

      {/* Six equal steps: the rate, per ONE minute */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} className={cls(`st${i}`)}>
          <path d={`M${X(i)} ${Y(100 - 6 * i)} H${X(i + 1)}`} stroke={C.muted} strokeWidth={1.5} fill="none" />
          <path d={`M${X(i + 1)} ${Y(100 - 6 * i)} V${Y(94 - 6 * i)}`} stroke={C.good} strokeWidth={3.5} fill="none" />
          <text x={X(i + 1) + 5} y={(Y(100 - 6 * i) + Y(94 - 6 * i)) / 2 + 4} fontSize={11} fontWeight={700} fill={C.good} {...lab}>−6</text>
        </g>
      ))}
      <text className={cls("per1")} x={34} y={118} fontSize={12} fontWeight={700} fill={C.good} {...lab}>−6 per 1 min</text>

      {/* The formulas: m, then the rule */}
      <g className={cls("m0")}>
        <Tex x={204} y={112} size={14} anchor="start" width={110}>{String.raw`m=\dfrac{-36}{6}=\phantom{-6}`}</Tex>
      </g>
      <g className={cls("m1")}>
        <Tex x={204} y={112} size={14} anchor="start" width={110} color={C.good}>{String.raw`\phantom{m=\dfrac{-36}{6}=}-6`}</Tex>
      </g>
      <g className={cls("b0")}>
        <Tex x={200} y={142} size={16} anchor="start" width={116}>{String.raw`B(t)=\phantom{100-6t}`}</Tex>
      </g>
      <g className={cls("b1")}>
        <Tex x={200} y={142} size={16} anchor="start" width={116} color={C.primaryText}>{String.raw`\phantom{B(t)=}100\phantom{-6t}`}</Tex>
      </g>
      <g className={cls("b2")}>
        <Tex x={200} y={142} size={16} anchor="start" width={116} color={C.good}>{String.raw`\phantom{B(t)=100}-6t`}</Tex>
      </g>
    </Svg>
  );
}
