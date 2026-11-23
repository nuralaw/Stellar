import { C, Css, Svg, Tex } from "./kit";

// Zero-product: make one side 0, factor, and a product that is 0 means one factor is 0. 2x² + x = 15 gives x = 5/2 or x = −3.
export const alt =
  "2x² + x = 15 becomes 2x² + x − 15 = 0 and factors as (2x − 5)(x + 3) = 0. A product is 0 only if a factor is 0, so x = 5/2 or x = −3. Trap: (x − 1)(x − 2) = 6 does not mean x − 1 = 6.";

const P = "v-nonlinear-equations--zero-product-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const draw = (n: string, t0: number) =>
  kf(n, `0%, ${t0}% { stroke-dashoffset: 100; opacity: 0 } ${t0 + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t0 + 6}%, 100% { stroke-dashoffset: 0; opacity: 1 }`, "stroke-dasharray: 100;");

// Beats (% of the 12 s loop): 3 the equation · 16 the 15 moves, 0 on the right · 24 two brackets · 36 bracket A = 0 ·
// 52 bracket B = 0 · 66 the two solutions on a line · 78–93 the trap (the rest steps back).
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  kf("main", "0%, 4% { opacity: 0 } 7%, 76% { opacity: 1 } 80%, 100% { opacity: 0 }", "opacity: 1;"),
  show("e0", 3, 16),
  show("n1", 8, 22),
  show("e1", 16),
  show("glow", 18, 30),
  show("bx", 24),
  show("cap", 28),
  show("ra", 36, 50),
  show("sa0", 38, 44),
  show("sa", 44),
  show("rb", 52, 66),
  show("sb0", 54, 60),
  show("sb", 60),
  show("line", 66),
  show("dots", 69),
  show("trap", 80, 92),
  draw("strike", 85),
  show("note", 87),
].join(" ");

const AX = 90;
const BX = 178;
const sx = (v: number) => 160 + v * 28;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("main")}>
          {/* The equation: 15 crosses the equals sign, 0 is left on the right */}
          <g className={cls("e0")}>
            <Tex x={183} y={28} size={19} anchor="end" width={150}>{String.raw`2x^2+x=`}</Tex>
            <Tex x={185} y={28} size={19} anchor="start" width={40}>{String.raw`15`}</Tex>
          </g>
          <g className={cls("n1")}>
            <text x={160} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
              − 15 on both sides
            </text>
          </g>
          <circle className={cls("glow")} cx={211} cy={28} r={14} fill={C.soft} />
          <g className={cls("e1")}>
            <Tex x={209} y={28} size={19} anchor="end" width={170}>{String.raw`2x^2+x-15=`}</Tex>
            <Tex x={211} y={28} size={19} anchor="start" width={40} color={C.primaryText}>{String.raw`0`}</Tex>
          </g>

          {/* Two brackets: A × B = 0 */}
          <g className={cls("bx")}>
            <rect x={AX - 33} y={64} width={66} height={32} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            <rect x={BX - 33} y={64} width={66} height={32} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            <Tex x={AX} y={80} size={17} width={60}>{String.raw`2x-5`}</Tex>
            <Tex x={BX} y={80} size={17} width={60}>{String.raw`x+3`}</Tex>
            <text x={134} y={86} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.muted} stroke="none">
              ×
            </text>
            <text x={222} y={86} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.muted} stroke="none">
              =
            </text>
            <Tex x={246} y={80} size={22} width={30} color={C.primaryText}>{String.raw`0`}</Tex>
          </g>
          <g className={cls("cap")}>
            <text x={160} y={54} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.muted} stroke="none">
              a product is 0: one factor is 0
            </text>
          </g>
          <rect className={cls("ra")} x={AX - 33} y={64} width={66} height={32} rx={9} fill="none" stroke={C.primary} strokeWidth={2.5} />
          <rect className={cls("rb")} x={BX - 33} y={64} width={66} height={32} rx={9} fill="none" stroke={C.ink} strokeWidth={2.5} />

          {/* Each bracket set to 0 */}
          <g className={cls("sa0")}>
            <Tex x={AX} y={118} size={17} width={90} color={C.primaryText}>{String.raw`2x-5=0`}</Tex>
          </g>
          <g className={cls("sa")}>
            <Tex x={AX} y={118} size={17} width={90} color={C.primaryText}>{String.raw`x=\dfrac{5}{2}`}</Tex>
          </g>
          <g className={cls("sb0")}>
            <Tex x={BX} y={118} size={17} width={90}>{String.raw`x+3=0`}</Tex>
          </g>
          <g className={cls("sb")}>
            <Tex x={BX} y={118} size={17} width={90}>{String.raw`x=-3`}</Tex>
          </g>

          {/* The solutions on a number line */}
          <g className={cls("line")}>
            <line x1={40} y1={148} x2={280} y2={148} stroke={C.muted} strokeWidth={1.5} />
            <line x1={sx(0)} y1={144} x2={sx(0)} y2={152} stroke={C.muted} strokeWidth={1.5} />
            <text x={sx(0)} y={166} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
              0
            </text>
          </g>
          <g className={cls("dots")}>
            <circle cx={sx(2.5)} cy={148} r={6} fill={C.primary} />
            <circle cx={sx(-3)} cy={148} r={6} fill={C.ink} />
            <text x={sx(2.5)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
              5/2
            </text>
            <text x={sx(-3)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
              −3
            </text>
          </g>
        </g>

        {/* The trap: the other side must be 0 */}
        <g className={cls("trap")}>
          <Tex x={160} y={46} size={21} width={220}>{String.raw`(x-1)(x-2)=6`}</Tex>
          <Tex x={160} y={92} size={19} width={140} color={C.bad}>{String.raw`x-1=6\;?`}</Tex>
          <line className={cls("strike")} x1={96} y1={104} x2={224} y2={80} stroke={C.bad} strokeWidth={3} pathLength={100} />
          <g className={cls("note")}>
            <text x={160} y={140} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.bad} stroke="none">
              the other side must be 0
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
