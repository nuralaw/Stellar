import { C, Css, Svg } from "./kit";

// Compare, don't compute: A = 4, 5, 5, 5, 6 and B = 1, 3, 5, 7, 9 both have mean 5. B's dots sit farther from 5, so B has the larger SD.
export const alt = "Two dot plots on the same scale, both with mean 5. Set A, 4, 5, 5, 5, 6, has short distance bars. Set B, 1, 3, 5, 7, 9, has long ones, so B has the larger standard deviation.";

const P = "v-one-var-data--sd-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("da", 2)}
${at("db", 8)}
${draw("mean", 16, 10)}
${at("ba", 30)}
${at("bb", 46)}
${at("res", 70)}
`;

const px = (v: number) => 44 + 24 * v;
const A = [4, 5, 5, 5, 6];
const B = [1, 3, 5, 7, 9];
const dots = (vals: number[], y: number) => {
  const seen: Record<number, number> = {};
  return vals.map((v) => {
    const k = (seen[v] = (seen[v] ?? -1) + 1);
    return <circle key={`${v}-${k}`} cx={px(v)} cy={y - 11 * k} r={4.5} />;
  });
};

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Axis */}
      <path d={`M${px(0)} 148 H${px(10)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <text key={v} x={px(v)} y={162}>
            {v}
          </text>
        ))}
      </g>

      {/* Mean line */}
      <line className={cls("mean")} x1={px(5)} y1={36} x2={px(5)} y2={148} pathLength={100} stroke={C.ink} strokeWidth={1.5} />

      <text className={cls("mean")} x={px(5) + 6} y={99} fontSize={11} fontWeight={600} fill={C.ink} stroke="none" style={{ strokeDasharray: "none" }}>
        mean 5
      </text>

      {/* Row labels */}
      <g fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">
        <text x={22} y={70}>
          A
        </text>
        <text x={22} y={118}>
          B
        </text>
      </g>

      {/* Dots */}
      <g className={cls("da")} fill={C.ink}>
        {dots(A, 66)}
      </g>
      <g className={cls("db")} fill={C.ink}>
        {dots(B, 114)}
      </g>

      {/* Distance bars from the mean */}
      <g className={cls("ba")} stroke={C.primary} strokeWidth={3} fill="none">
        <path d={`M${px(5)} 78 H${px(4)} M${px(5)} 78 H${px(6)}`} />
      </g>
      <g className={cls("bb")} stroke={C.primary} strokeWidth={3} fill="none">
        <path d={`M${px(5)} 126 H${px(1)} M${px(5)} 126 H${px(9)}`} />
        <path d={`M${px(5)} 133 H${px(3)} M${px(5)} 133 H${px(7)}`} />
      </g>

      <text className={cls("res")} x={160} y={26} fontSize={14} fontWeight={700} fill={C.primary} textAnchor="middle">
        B is more spread out: larger SD
      </text>
    </Svg>
  );
}
