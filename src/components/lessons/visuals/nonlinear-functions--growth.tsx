import { C, Css, Svg } from "./kit";

// Linear growth adds the same amount each year (+60); exponential growth multiplies (×1.2), so its gap keeps getting bigger.
export const alt =
  "Bars for years 0 to 3 starting at 300. Linear growth adds 60 each year: 300, 360, 420, 480. Exponential growth multiplies by 1.2 each year: 300, 360, 432, 518. The exponential bars pull ahead.";

const P = "v-nonlinear-functions--growth-";
const fc = (t: number) => `${P}f${t}`;
const gc = (t: number) => `${P}g${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const grow = (t: number) => {
  const n = gc(t);
  return `.${n} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { transform: scaleY(0); opacity: 1 } ${t + 10}%, 90% { transform: none; opacity: 1 } 97%, 100% { transform: none; opacity: 0 } }`;
};
const css = `
.v-nonlinear-functions--growth-a { animation: 9s ease-in-out infinite; }
${[4, 58, 70].map(fade).join("\n")}
${[8, 22, 36, 50].map(grow).join("\n")}
`;
const a = `${P}a`;

// Scale: 0.2 px per unit. Baseline y = 148. Groups at x = 30, 90, 150, 210; each bar 22 wide.
const BASE = 148;
const LIN = [300, 360, 420, 480];
const EXP = [300, 360, 432, 518.4];
const S = 0.2;
const TIMES = [8, 22, 36, 50];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <line x1={22} y1={BASE} x2={278} y2={BASE} stroke={C.muted} strokeWidth={1.5} />

      {/* Legend */}
      <g className={`${a} ${fc(4)}`}>
        <rect x={30} y={18} width={10} height={10} rx={2} fill={C.muted} />
        <text x={45} y={27} fontSize={12} fontWeight={600} fill={C.ink}>
          +60 each year
        </text>
        <rect x={150} y={18} width={10} height={10} rx={2} fill={C.primary} />
        <text x={165} y={27} fontSize={12} fontWeight={600} fill={C.ink}>
          ×1.2 each year
        </text>
      </g>

      {LIN.map((v, i) => {
        const x = 30 + 60 * i;
        return (
          <g key={i}>
            <rect className={`${a} ${gc(TIMES[i])}`} x={x} y={BASE - v * S} width={22} height={v * S} rx={2} fill={C.muted} />
            <rect className={`${a} ${gc(TIMES[i])}`} x={x + 24} y={BASE - EXP[i] * S} width={22} height={EXP[i] * S} rx={2} fill={C.primary} />
            <text x={x + 23} y={BASE + 15} textAnchor="middle" fontSize={11} fill={C.muted}>
              {i}
            </text>
          </g>
        );
      })}
      <text x={290} y={BASE + 15} textAnchor="end" fontSize={11} fill={C.muted}>
        year
      </text>

      {/* The last pair: the gap */}
      <g className={`${a} ${fc(58)}`}>
        <text x={221} y={BASE - 480 * S - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
          480
        </text>
        <text x={245} y={BASE - 518.4 * S - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primary}>
          518
        </text>
      </g>
      <g className={`${a} ${fc(70)}`}>
        <text x={258} y={84} fontSize={12} fontWeight={700} fill={C.primary}>
          the gap
        </text>
        <text x={258} y={100} fontSize={12} fontWeight={700} fill={C.primary}>
          grows
        </text>
      </g>
    </Svg>
  );
}
