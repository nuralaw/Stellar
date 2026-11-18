import { C, Css, Svg } from "./kit";

// Association words: three small scatterplots (positive and strong, negative and weak, nonlinear).
export const alt = "Three scatterplots: dots rising close to a line (positive, strong), dots falling but spread out (negative, weak), and dots in a U-shaped curve (nonlinear).";

const P = "v-two-var-data--association-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("p1", 3)}
${at("l1", 14)}
${at("p2", 30)}
${at("l2", 41)}
${at("p3", 57)}
${at("l3", 68)}
`;

// Dots in panel coordinates (88 wide, 66 high; y grows downward on screen).
const PANELS = [
  {
    k: "1",
    x: 14,
    word: "positive",
    note: "strong",
    dots: [[10, 56], [18, 53], [24, 46], [32, 44], [40, 38], [48, 36], [56, 28], [64, 26], [72, 18], [80, 14]],
    trend: [8, 60, 82, 12],
  },
  {
    k: "2",
    x: 116,
    word: "negative",
    note: "weak",
    dots: [[10, 14], [16, 34], [24, 22], [30, 46], [38, 30], [46, 52], [54, 36], [62, 54], [70, 44], [78, 60]],
    trend: [8, 20, 82, 54],
  },
  {
    k: "3",
    x: 218,
    word: "nonlinear",
    note: "curved",
    dots: [[10, 14], [18, 33], [26, 46], [34, 55], [42, 60], [50, 59], [58, 54], [66, 43], [74, 28], [80, 14]],
    trend: null,
  },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {PANELS.map((p) => (
        <g key={p.k} transform={`translate(${p.x} 34)`}>
          <path d="M0 68 H88 M0 68 V0" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <g className={cls("p" + p.k)} fill={C.muted}>
            {p.dots.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={3} />
            ))}
          </g>
          {p.trend && (
            <line className={cls("p" + p.k)} x1={p.trend[0]} y1={p.trend[1]} x2={p.trend[2]} y2={p.trend[3]} stroke={C.primary} strokeWidth={2} />
          )}
          {!p.trend && <path className={cls("p" + p.k)} d="M10 14 Q45 106 80 14" fill="none" stroke={C.primary} strokeWidth={2} />}
          <g className={cls("l" + p.k)} textAnchor="middle">
            <text x={44} y={92} fontSize={13} fontWeight={700} fill={C.ink}>
              {p.word}
            </text>
            <text x={44} y={108} fontSize={12} fill={C.muted}>
              {p.note}
            </text>
          </g>
        </g>
      ))}
    </Svg>
  );
}
