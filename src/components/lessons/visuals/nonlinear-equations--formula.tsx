import { C, Css, Svg, Tex } from "./kit";

// The quadratic formula with 2x² − 5x − 3 = 0: read a, b, c with their signs, substitute, the discriminant is 49, the ± splits into x = 3 and x = −1/2.
export const alt =
  "For 2x² − 5x − 3 = 0, a = 2, b = −5, c = −3. They go into x = (−b ± √(b² − 4ac)) / 2a: the root is √49 = 7 and the ± gives x = 3 and x = −1/2. Mind −b and divide the whole top by 2a.";

const P = "v-nonlinear-equations--formula-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

// Beats (% of the 12 s loop): 3 the equation · 8 a, b, c with signs · 22 the formula · 34 numbers in · 46 inside the root ·
// 58 √49 = 7 · 68 the ± splits · 80 the two slips to avoid.
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("eq", 3),
  show("box", 8),
  show("chip", 11),
  show("f0", 22, 34),
  show("f1", 35, 47),
  show("f2", 48, 59),
  show("f3", 60, 69),
  show("f4", 70),
  show("t1", 80),
  show("t2", 86),
].join(" ");

const TY = 20;
const TERMS: [number, number, string][] = [
  [98, 42, String.raw`2x^2`],
  [148, 40, String.raw`-5x`],
  [194, 32, String.raw`-3`],
];
const CHIPS: [number, string][] = [
  [88, String.raw`a=2`],
  [152, String.raw`b=-5`],
  [216, String.raw`c=-3`],
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The equation, split into its terms so each coefficient can be boxed */}
        <g className={cls("eq")}>
          {TERMS.map(([x, w, t]) => (
            <Tex key={t} x={x} y={TY} size={18} width={w + 10}>
              {t}
            </Tex>
          ))}
          <Tex x={236} y={TY} size={18} width={50}>{String.raw`=0`}</Tex>
        </g>
        <g className={cls("box")}>
          {TERMS.map(([x, w]) => (
            <rect key={x} x={x - w / 2} y={TY - 14} width={w} height={28} rx={7} fill="none" stroke={C.primary} strokeWidth={2} />
          ))}
        </g>
        <g className={cls("chip")}>
          {CHIPS.map(([x, t], i) => (
            <g key={t}>
              <line x1={TERMS[i][0]} y1={TY + 15} x2={x} y2={42} stroke={C.primary} strokeWidth={1.5} />
              <rect x={x - 30} y={42} width={60} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
              <Tex x={x} y={54} size={14} width={60} color={C.primaryText}>
                {t}
              </Tex>
            </g>
          ))}
        </g>

        {/* The formula, then the numbers */}
        <g className={cls("f0")}>
          <Tex x={160} y={104} size={19} width={230}>{String.raw`x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}`}</Tex>
        </g>
        <g className={cls("f1")}>
          <Tex x={160} y={104} size={16} width={310} color={C.primaryText}>{String.raw`x=\dfrac{-(-5)\pm\sqrt{(-5)^2-4\cdot2\cdot(-3)}}{2\cdot2}`}</Tex>
        </g>
        <g className={cls("f2")}>
          <Tex x={160} y={104} size={19} width={230} color={C.primaryText}>{String.raw`x=\dfrac{5\pm\sqrt{25+24}}{4}`}</Tex>
        </g>
        <g className={cls("f3")}>
          <Tex x={160} y={104} size={19} width={230} color={C.primaryText}>{String.raw`x=\dfrac{5\pm\sqrt{49}}{4}=\dfrac{5\pm7}{4}`}</Tex>
        </g>
        <g className={cls("f4")}>
          <Tex x={84} y={104} size={18} width={150}>{String.raw`x=\dfrac{5+7}{4}=3`}</Tex>
          <Tex x={236} y={104} size={18} width={150}>{String.raw`x=\dfrac{5-7}{4}=-\dfrac12`}</Tex>
        </g>

        {/* The two slips */}
        <g fontSize={13} fontWeight={600} fill={C.muted} textAnchor="middle" stroke="none">
          <g className={cls("t1")}>
            <text x={160} y={146}>−b is the opposite of b</text>
          </g>
          <g className={cls("t2")}>
            <text x={160} y={164}>divide the whole top by 2a</text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
