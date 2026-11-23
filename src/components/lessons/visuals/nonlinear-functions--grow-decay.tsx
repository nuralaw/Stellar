import { C, Css, Svg, Tex } from "./kit";

// f(x) = a·bˣ multiplies by b every step: b > 1 grows (100, 120, 144, ...), 0 < b < 1 decays (100, 80, 64, ...). Both
// start at a = 100. Decay approaches the x-axis but never reaches 0. Percent link: b = 1 ± r (as a decimal).
export const alt =
  "Bars for 100(1.2)^x grow 100, 120, 144, 173, 207 and for 100(0.8)^x shrink 100, 80, 64, 51, 41. As curves: b > 1 is growth, 0 < b < 1 is decay that never reaches 0; 1.2 is up 20%, 0.8 is down 20%.";

const P = "v-nonlinear-functions--grow-decay-";
const fc = (t: number) => `${P}f${t}`;
const wc = (t: number) => `${P}w${t}`;
const dc = (t: number) => `${P}d${t}`;
const gc = (t: number) => `${P}g${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const win = (t: number, u: number) => {
  const n = wc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, ${u}% { opacity: 1 } ${u + 5}%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 14}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const grow = (t: number) => {
  const n = gc(t);
  return `.${n} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { transform: scaleY(0); opacity: 1 } ${t + 7}%, 90% { transform: none; opacity: 1 } 97%, 100% { transform: none; opacity: 0 } }`;
};
const css = `
.v-nonlinear-functions--grow-decay-a { animation: 11s ease-in-out infinite; }
${[8, 14, 20, 26, 32, 34, 46, 62, 66, 72, 80].map(fade).join("\n")}
${win(4, 38)}
${[48].map(draw).join("\n")}
${[6, 12, 18, 24, 30].map(grow).join("\n")}
`;
const a = `${P}a`;
const lab = { stroke: "none" } as const;

// Bars: panel origins x0 = 16 (growth) and 168 (decay); bar i at x0 + 7 + 26 i, 18 wide; baseline 128; 0.32 px per unit.
const BASE = 128;
const S = 0.32;
const GROW = [100, 120, 144, 172.8, 207.36];
const DECAY = [100, 80, 64, 51.2, 40.96];
const STEP_T = [6, 12, 18, 24, 30];
// Curves: x (0 to 4) -> 34 + 36 x; value v -> 118 − 0.4 v.
const cx = (x: number) => 34 + 36 * x;
const cy = (v: number) => 118 - 0.4 * v;
const curve = (b: number) =>
  Array.from({ length: 33 }, (_, i) => {
    const x = i / 8;
    return `${i === 0 ? "M" : "L"}${cx(x).toFixed(1)} ${cy(100 * Math.pow(b, x)).toFixed(1)}`;
  }).join(" ");

function Bars({ x0, vals, color, word, tex, mult }: { x0: number; vals: number[]; color: string; word: string; tex: string; mult: string }) {
  return (
    <g>
      <text x={x0 + 68} y={26} textAnchor="middle" fontSize={13} fontWeight={700} fill={color === C.primary ? C.primaryText : C.ink} {...lab}>
        {word}
      </text>
      <Tex x={x0 + 68} y={46} size={13} width={110}>{tex}</Tex>
      <line x1={x0} y1={BASE} x2={x0 + 136} y2={BASE} stroke={C.muted} strokeWidth={1.5} />
      {vals.map((v, i) => {
        const x = x0 + 7 + 26 * i;
        return (
          <g key={i}>
            <rect className={`${a} ${gc(STEP_T[i])}`} x={x} y={BASE - v * S} width={18} height={v * S} rx={2} fill={i === 0 ? C.ink : color} />
            <text className={`${a} ${fc(STEP_T[i] + 2)}`} x={x + 9} y={BASE - v * S - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
              {Math.round(v)}
            </text>
            {i > 0 && (
              <text className={`${a} ${fc(STEP_T[i] + 2)}`} x={x - 4} y={144} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
                {mult}
              </text>
            )}
          </g>
        );
      })}
      <text className={`${a} ${fc(34)}`} x={x0 + 7} y={160} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
        start a = 100
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Beat 1-2: bars, the multiplier, the start */}
      <g className={`${a} ${wc(4)}`} opacity={0}>
        <Bars x0={16} vals={GROW} color={C.primary} word="growth ↑" tex={String.raw`100(1.2)^x`} mult="×1.2" />
        <Bars x0={168} vals={DECAY} color={C.muted} word="decay ↓" tex={String.raw`100(0.8)^x`} mult="×0.8" />
      </g>

      {/* Beat 3: the same two as curves on one axis */}
      <g className={`${a} ${fc(46)}`}>
        <line x1={24} y1={118} x2={184} y2={118} stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 4" />
        <circle cx={cx(0)} cy={cy(100)} r={4.5} fill={C.ink} />
        <text x={20} y={68} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>a = 100</text>
      </g>
      <path className={`${a} ${dc(48)}`} d={curve(1.2)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
      <path className={`${a} ${dc(48)}`} d={curve(0.8)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
      <text className={`${a} ${fc(62)}`} x={184} y={132} textAnchor="end" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
        never reaches 0
      </text>

      {/* Beat 3-4: the labels and the percent link */}
      <g className={`${a} ${fc(62)}`}>
        <text x={206} y={28} fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>growth ↑</text>
        <Tex x={268} y={26} size={12} anchor="start" width={40} color={C.primaryText}>{String.raw`b>1`}</Tex>
        <text x={206} y={92} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>decay ↓</text>
        <Tex x={262} y={90} size={12} anchor="start" width={46} color={C.ink}>{String.raw`0<b<1`}</Tex>
      </g>
      <g className={`${a} ${fc(66)}`}>
        <Tex x={206} y={48} size={13} anchor="start" width={100} color={C.primaryText}>{String.raw`1.2=1+0.20`}</Tex>
        <text x={206} y={67} fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>up 20%</text>
      </g>
      <g className={`${a} ${fc(72)}`}>
        <Tex x={206} y={112} size={13} anchor="start" width={100} color={C.ink}>{String.raw`0.8=1-0.20`}</Tex>
        <text x={206} y={131} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>down 20%</text>
      </g>

      {/* Beat 5: the percent trap */}
      <g className={`${a} ${fc(80)}`}>
        <rect x={24} y={142} width={272} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <Tex x={160} y={153} size={13} width={262}>{String.raw`0.6\%=0.006,\ \mathrm{so}\ b=1.006`}</Tex>
      </g>
    </Svg>
  );
}
