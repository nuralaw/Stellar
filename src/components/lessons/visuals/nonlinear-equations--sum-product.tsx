import { C, Css, Svg, Tex } from "./kit";

// Sum and product of the solutions: (x − 2)(x − 3) = x² − 5x + 6, so r + s = −b/a and rs = c/a. Use it on 5x² − 30x + 8 = 0 without solving.
export const alt =
  "The solutions 2 and 3 of x² − 5x + 6 = 0 add to 5 and multiply to 6: −b/a and c/a. So 5x² − 30x + 8 = 0 has sum 6 and product 8/5 without solving. One repeated solution does not count.";

const P = "v-nonlinear-equations--sum-product-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

// Beats (% of the 12 s loop): 3 x² − 5x + 6 = 0 and (x − 2)(x − 3) = 0 · 16 the sum and the product show up in the coefficients ·
// 34 the general rule · 50–64 use it on 5x² − 30x + 8 = 0 · 66–86 trap: one solution only.
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("ra", 3),
  show("rb", 8),
  show("ch", 17),
  show("gen", 34),
  show("sp", 40),
  show("u", 52, 64),
  show("tr", 67, 85),
].join(" ");

const AY = 20;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* x² − 5x + 6 = 0 with its pieces, and the factored form with its solutions */}
        <g className={cls("ra")}>
          <Tex x={108} y={AY} size={18} width={60}>{String.raw`x^2`}</Tex>
          <Tex x={150} y={AY} size={18} width={60} color={C.primaryText}>{String.raw`-5x`}</Tex>
          <Tex x={192} y={AY} size={18} width={50} color={C.good}>{String.raw`+6`}</Tex>
          <Tex x={230} y={AY} size={18} width={50}>{String.raw`=0`}</Tex>
        </g>
        <g className={cls("rb")}>
          <Tex x={104} y={86} size={17} width={150}>{String.raw`(x-2)(x-3)=0`}</Tex>
          <path d="M184 86 H204 M197 80 L204 86 L197 92" fill="none" stroke={C.muted} strokeWidth={2} />
          <Tex x={256} y={86} size={17} width={100}>{String.raw`x=2,\ x=3`}</Tex>
        </g>

        {/* Where the sum and the product show up */}
        <g className={cls("ch")}>
          <line x1={150} y1={AY + 14} x2={134} y2={42} stroke={C.primary} strokeWidth={1.5} />
          <line x1={192} y1={AY + 14} x2={220} y2={42} stroke={C.good} strokeWidth={1.5} />
          <rect x={64} y={42} width={104} height={26} rx={13} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <Tex x={116} y={55} size={14} width={104} color={C.primaryText}>{String.raw`-2-3=-5`}</Tex>
          <rect x={184} y={42} width={72} height={26} rx={13} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={220} y={55} size={14} width={72} color={C.good}>{String.raw`2\cdot3=6`}</Tex>
        </g>

        {/* The general rule */}
        <g className={cls("gen")}>
          <Tex x={160} y={113} size={14} width={300}>{String.raw`a(x-r)(x-s)=ax^2-a(r+s)x+a\,rs`}</Tex>
        </g>
        <g className={cls("sp")}>
          <Tex x={98} y={146} size={17} width={150} color={C.primaryText}>{String.raw`r+s=-\dfrac{b}{a}`}</Tex>
          <Tex x={226} y={146} size={17} width={120} color={C.good}>{String.raw`rs=\dfrac{c}{a}`}</Tex>
        </g>

        {/* Use it without solving */}
        <g className={cls("u")}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <Tex x={160} y={26} size={20} width={220}>{String.raw`5x^2-30x+8=0`}</Tex>
          <Tex x={160} y={60} size={16} width={220} color={C.muted}>{String.raw`a=5,\ b=-30,\ c=8`}</Tex>
          <Tex x={90} y={108} size={17} width={160} color={C.primaryText}>{String.raw`r+s=-\dfrac{-30}{5}=6`}</Tex>
          <Tex x={236} y={108} size={17} width={110} color={C.good}>{String.raw`rs=\dfrac{8}{5}`}</Tex>
          <text x={160} y={156} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.muted} stroke="none">
            no solving needed
          </text>
        </g>

        {/* The trap: one solution is not two */}
        <g className={cls("tr")}>
          <rect x={-10} y={-10} width={340} height={200} fill={C.bg} />
          <Tex x={160} y={32} size={20} width={220}>{String.raw`x^2-6x+9=0`}</Tex>
          <Tex x={160} y={72} size={20} width={220}>{String.raw`(x-3)^2=0`}</Tex>
          <text x={160} y={112} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink} stroke="none">
            only one solution: x = 3
          </text>
          <text x={160} y={142} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.bad} stroke="none">
            two different solutions only
          </text>
        </g>
      </g>
    </Svg>
  );
}
