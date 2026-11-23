import { C, Css, Svg } from "./kit";

// Margin of error: a bigger random sample narrows it (dots cluster, bracket shrinks); more spread in the data widens it.
export const alt = "Top: estimates from samples of 25 scatter wide around the true mean, from samples of 100 they cluster, and the margin bracket shrinks. Bottom: more spread in the data makes the bracket longer.";

const P = "v-inference-sample--margin-factors-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
// An element that fades in at tIn at its start transform, holds, then moves to its resting place between m0 and m1.
const mv = (k: string, tIn: number, m0: number, m1: number, from: string) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${tIn}% { opacity: 0; transform: ${from} } ${tIn + 4}%, ${m0}% { opacity: 1; transform: ${from} } ${m1}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const MX = 160; // the true mean / the sample mean
// Row A: 10 sample estimates. Resting place = tight cluster (n = 100); they start twice as wide (n = 25).
const TIGHT = [-30, -22, -16, -10, -4, 3, 9, 16, 23, 30];
const AY = [42, 52, 46, 55, 40, 50, 44, 54, 41, 51];
// Row B: 12 data points. Resting place = spread out; they start three times closer together.
const SPREAD = [-48, -38, -30, -21, -12, -4, 4, 12, 21, 30, 38, 48];
const BY = [112, 124, 116, 128, 110, 120, 126, 114, 122, 110, 126, 118];

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("meanA", 2)}
${win("labA1", 2, 26)}
${at("labA2", 30)}
${TIGHT.map((t, i) => mv(`ea${i}`, 4 + i * 0.6, 28, 40, `translateX(${t}px)`)).join("\n")}
${mv("brA", 12, 28, 40, "scaleX(2)")}
${mv("brAl", 12, 28, 40, "translateX(-30px)")}
${mv("brAr", 12, 28, 40, "translateX(30px)")}
${win("txtA1", 12, 38)}
${at("txtA2", 42)}
${at("sep", 48)}
${at("meanB", 50)}
${at("labB", 50)}
${SPREAD.map((t, i) => mv(`db${i}`, 52 + i * 0.6, 68, 78, `translateX(${(-2 * t) / 3}px)`)).join("\n")}
${mv("brB", 56, 68, 78, "scaleX(0.3333)")}
${mv("brBl", 56, 68, 78, "translateX(20px)")}
${mv("brBr", 56, 68, 78, "translateX(-20px)")}
${win("txtB1", 58, 66)}
${at("txtB2", 80)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Row A: bigger sample, smaller margin */}
      <text className={cls("labA1")} x={24} y={26} fontSize={12} fontWeight={700} fill={C.ink}>
        sample of 25
      </text>
      <text className={cls("labA2")} x={24} y={26} fontSize={12} fontWeight={700} fill={C.primaryText}>
        sample of 100
      </text>
      <g className={cls("meanA")}>
        <line x1={MX} y1={34} x2={MX} y2={72} stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={MX + 6} y={32} fontSize={11} fontWeight={600} fill={C.muted}>
          true mean
        </text>
      </g>
      {TIGHT.map((t, i) => (
        <circle key={i} className={cls(`ea${i}`)} cx={MX + t} cy={AY[i]} r={4} fill={C.ink} />
      ))}
      <rect className={cls("brA")} x={MX - 30} y={63} width={60} height={5} rx={2.5} fill={C.primary} />
      <line className={cls("brAl")} x1={MX - 30} y1={59} x2={MX - 30} y2={72} stroke={C.primary} strokeWidth={2.5} />
      <line className={cls("brAr")} x1={MX + 30} y1={59} x2={MX + 30} y2={72} stroke={C.primary} strokeWidth={2.5} />
      <text className={cls("txtA1")} x={MX} y={86} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
        wide margin
      </text>
      <text className={cls("txtA2")} x={MX} y={86} fontSize={12} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        bigger sample, smaller margin
      </text>

      <line className={cls("sep")} x1={24} y1={93} x2={296} y2={93} stroke={C.line} strokeWidth={1.5} />

      {/* Row B: more spread, larger margin */}
      <text className={cls("labB")} x={24} y={106} fontSize={12} fontWeight={700} fill={C.ink}>
        standard deviation
      </text>
      <line className={cls("meanB")} x1={MX} y1={108} x2={MX} y2={146} stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
      {SPREAD.map((t, i) => (
        <circle key={i} className={cls(`db${i}`)} cx={MX + t} cy={BY[i] + 4} r={3.5} fill={C.muted} />
      ))}
      <rect className={cls("brB")} x={MX - 30} y={140} width={60} height={5} rx={2.5} fill={C.primary} />
      <line className={cls("brBl")} x1={MX - 30} y1={136} x2={MX - 30} y2={149} stroke={C.primary} strokeWidth={2.5} />
      <line className={cls("brBr")} x1={MX + 30} y1={136} x2={MX + 30} y2={149} stroke={C.primary} strokeWidth={2.5} />
      <text className={cls("txtB1")} x={MX} y={163} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
        tight data, short margin
      </text>
      <text className={cls("txtB2")} x={MX} y={163} fontSize={12} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        more spread, larger margin
      </text>
    </Svg>
  );
}
