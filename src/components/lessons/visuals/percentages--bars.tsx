import { C, Css, Svg, Tex } from "./kit";

// Trap: adding percents. $100, up 20% = $120, down 20% of 120 = $96, which is below the $100 start.
export const alt = "Three bars: $100, then $120 after a 20% rise, then $96 after a 20% fall. The last bar is below the $100 line, so up 20% then down 20% is not back to the start.";

const P = "v-percentages--bars-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const rise = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleY(0.2) } ${t + 1}% { opacity: 1; transform: scaleY(0.2) } ${t + 12}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${rise("b1", 2)}
${at("l1", 10)}
${rise("b2", 24)}
${at("l2", 36)}
${rise("b3", 50)}
${at("l3", 62)}
${at("ref", 64)}
${at("res", 74)}
`;

const K = 0.8;
const BASE = 148;
const BARS = [
  { x: 44, v: 100, label: "$100", cap: "start", k: "1" },
  { x: 128, v: 120, label: "$120", cap: "up 20%", k: "2" },
  { x: 212, v: 96, label: "$96", cap: "down 20%", k: "3" },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <path d={`M32 ${BASE} H284`} fill="none" stroke={C.muted} strokeWidth={1.5} />

      {BARS.map((b) => (
        <g key={b.k}>
          <rect className={cls("b" + b.k)} x={b.x} y={BASE - b.v * K} width={56} height={b.v * K} rx={3} fill={b.k === "2" ? C.primary : b.k === "3" ? C.badSoft : C.fill} stroke={b.k === "3" ? C.bad : b.k === "2" ? C.primary : C.muted} strokeWidth={1.5} />
          <text className={cls("l" + b.k)} x={b.x + 28} y={b.k === "3" ? BASE - b.v * K + 20 : BASE - b.v * K - 6} fontSize={14} fontWeight={700} fill={b.k === "3" ? C.bad : C.ink} textAnchor="middle">
            {b.label}
          </text>
          <text className={cls("l" + b.k)} x={b.x + 28} y={BASE + 16} fontSize={12} fill={C.muted} textAnchor="middle">
            {b.cap}
          </text>
        </g>
      ))}

      {/* The $100 line carried over the last bar */}
      <g className={cls("ref")}>
        <line x1={44} y1={BASE - 100 * K} x2={268} y2={BASE - 100 * K} stroke={C.ink} strokeWidth={1.5} strokeDasharray="5 4" />
      </g>
      <g className={cls("res")}>
        <Tex x={160} y={20} size={15} width={260} color={C.bad}>{String.raw`-20\%\text{ of }\$120=\$24,\ \text{so }\$96`}</Tex>
      </g>
    </Svg>
  );
}
