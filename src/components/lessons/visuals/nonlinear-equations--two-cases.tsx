import { C, Css, Svg, Tex } from "./kit";

// Squares and absolute values give two solutions the same distance either side of the middle: |x − 7| = 6 and (x − 7)² = 36 both give 1 and 13.
export const alt =
  "On a number line, |x − 7| = 6 means x is 6 away from 7: x = 1 or x = 13. (x − 7)² = 36 gives the same points. A right side of −6 gives no solution. The two solutions add to 14.";

const P = "v-nonlinear-equations--two-cases-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const draw = (n: string, t0: number) =>
  kf(n, `0%, ${t0}% { stroke-dashoffset: 100; opacity: 0 } ${t0 + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t0 + 8}%, 100% { stroke-dashoffset: 0; opacity: 1 }`, "stroke-dasharray: 100;");

// Beats (% of the 12 s loop): 3 the centre · 8 |x − 7| = 6 · 14 two arrows, two dots · 30 two lines ·
// 46 the square gives the same · 56 the sum · 66–86 right side −6: no solution.
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("ax", 3),
  show("c7", 5),
  show("abs", 8),
  kf("shift", "0%, 44% { transform: translateX(70px) } 50%, 100% { transform: none }"),
  show("cap", 9, 30),
  draw("arl", 14),
  draw("arr", 14),
  show("six", 20),
  show("dots", 24),
  show("split", 31, 46),
  show("sq", 48),
  show("pm", 52),
  show("sum", 57),
  show("cur", 66, 85),
].join(" ");

// Number line: x = 7 at 159.5, 18.5 units per 1, so 1 -> 48.5 and 13 -> 270.5.
const px = (v: number) => 30 + 18.5 * v;
const AY = 124;
const RY = 102;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The line and its centre */}
        <g className={cls("ax")}>
          <line x1={24} y1={AY} x2={296} y2={AY} stroke={C.muted} strokeWidth={1.5} />
          {[1, 7, 13].map((v) => (
            <line key={v} x1={px(v)} y1={AY - 5} x2={px(v)} y2={AY + 5} stroke={C.muted} strokeWidth={1.5} />
          ))}
        </g>
        <g className={cls("c7")}>
          <circle cx={px(7)} cy={AY} r={6.5} fill={C.primary} />
          <text x={px(7)} y={AY + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
            centre 7
          </text>
        </g>

        {/* The two equal distances */}
        <g fill="none" stroke={C.ink} strokeWidth={2.5}>
          <path className={cls("arl")} d={`M${px(7) - 4} ${RY} H${px(1)} M${px(1) + 8} ${RY - 6} L${px(1)} ${RY} L${px(1) + 8} ${RY + 6}`} pathLength={100} />
          <path className={cls("arr")} d={`M${px(7) + 4} ${RY} H${px(13)} M${px(13) - 8} ${RY - 6} L${px(13)} ${RY} L${px(13) - 8} ${RY + 6}`} pathLength={100} />
        </g>
        <g className={cls("six")} fontSize={14} fontWeight={700} fill={C.ink} textAnchor="middle" stroke="none">
          <text x={(px(1) + px(7)) / 2} y={RY - 9}>6</text>
          <text x={(px(7) + px(13)) / 2} y={RY - 9}>6</text>
        </g>
        <g className={cls("dots")}>
          <circle cx={px(1)} cy={AY} r={6.5} fill={C.good} />
          <circle cx={px(13)} cy={AY} r={6.5} fill={C.good} />
          <Tex x={px(1)} y={AY + 24} size={15} width={60} color={C.good}>{String.raw`x=1`}</Tex>
          <Tex x={px(13)} y={AY + 24} size={15} width={60} color={C.good}>{String.raw`x=13`}</Tex>
        </g>

        {/* Top: |x − 7| = 6, then the square beside it, and the two lines they give */}
        <g className={cls("abs")}>
          <g className={cls("shift")}>
            <Tex x={90} y={24} size={20} width={150}>{String.raw`\vert x-7\vert=6`}</Tex>
          </g>
        </g>
        <g className={cls("cap")}>
          <text x={160} y={52} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.muted} stroke="none">
            distance from 7 is 6
          </text>
        </g>
        <g className={cls("split")}>
          <Tex x={84} y={56} size={16} width={110}>{String.raw`x-7=-6`}</Tex>
          <Tex x={236} y={56} size={16} width={110}>{String.raw`x-7=6`}</Tex>
        </g>
        <g className={cls("sq")}>
          <Tex x={232} y={24} size={20} width={150}>{String.raw`(x-7)^2=36`}</Tex>
        </g>
        <g className={cls("pm")}>
          <Tex x={160} y={56} size={17} width={130} color={C.primaryText}>{String.raw`x-7=\pm6`}</Tex>
        </g>
        <g className={cls("sum")}>
          <Tex x={160} y={166} size={14} width={180} color={C.muted}>{String.raw`1+13=2\cdot7=14`}</Tex>
        </g>

        {/* The trap: a distance is never negative */}
        <g className={cls("cur")}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <Tex x={160} y={46} size={24} width={220}>{String.raw`\vert x-7\vert=-6`}</Tex>
          <text x={160} y={100} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.bad} stroke="none">
            no solution
          </text>
          <text x={160} y={128} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink} stroke="none">
            a distance is never negative
          </text>
        </g>
      </g>
    </Svg>
  );
}
