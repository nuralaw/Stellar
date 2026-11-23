import { C, Css, Svg, Tex } from "./kit";

// Fractions with letters: cancel factors, never terms; a subtraction needs a common bottom and flips both signs of the second top.
export const alt =
  "Cancel only factors: 6(x + 7) over 12 is (x + 7) over 2, but cancelling the 6 in 6x + 42 is wrong. In 5/(x + 1) − 2/(x + 3) use a common bottom; the minus flips both signs.";

const P = "v-equivalent-expressions--fractions-";
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
const pulse = (n: string, t: number) =>
  kf(n, `0%, ${t}% { transform: none } ${t + 3}% { transform: scale(1.25) } ${t + 7}%, 100% { transform: none }`, "transform-box: fill-box; transform-origin: center;");

// Panels (% of the 12 s loop): 3–27 cancel a factor · 29–50 the trap · 52– subtract
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("p1", 3, 27),
  show("whole", 3, 10),
  show("fact", 10),
  pulse("pu", 14),
  show("res", 18),
  show("lab1", 20),
  show("p2", 29, 50),
  show("trap", 30),
  draw("x1", 34),
  draw("x2", 36),
  draw("x3", 39),
  draw("x4", 41),
  show("lab2", 38),
  show("chk1", 42),
  show("chk2", 45),
  show("p3", 52),
  show("ra", 53),
  show("chip", 57),
  show("w1", 60, 68),
  show("w2", 68, 76),
  show("w3", 76, 84),
  show("w4", 84),
  show("cap", 68),
].join(" ");

// Fractions are drawn from pieces around a fixed seam, so a colored part keeps its place whatever the math font is.
const CX = 92;
const C2 = 76;
const NUM = 77;
const DEN = 109;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 1: 6(x + 7) over 12 -> cancel the factor 6 */}
        <g className={cls("p1")}>
          <g className={cls("whole")}>
            <Tex x={CX} y={92} size={22} width={120}>{String.raw`\dfrac{6x+42}{12}`}</Tex>
          </g>
          <g className={cls("fact")}>
            <line x1={CX - 38} y1={92} x2={CX + 38} y2={92} stroke={C.ink} strokeWidth={1.5} />
            <g className={cls("pu")}>
              <Tex x={CX - 19} y={NUM} size={22} anchor="end" width={30} color={C.primaryText}>{String.raw`6`}</Tex>
            </g>
            <Tex x={CX - 17} y={NUM} size={22} anchor="start" width={70}>{String.raw`(x+7)`}</Tex>
            <g className={cls("pu")}>
              <Tex x={CX} y={DEN} size={22} width={50} color={C.primaryText}>{String.raw`12`}</Tex>
            </g>
          </g>
          <g className={cls("res")}>
            <path d="M146 92 H178 M170 85 L178 92 L170 99" fill="none" stroke={C.primary} strokeWidth={2} />
            <Tex x={236} y={92} size={22} width={110}>{String.raw`\dfrac{x+7}{2}`}</Tex>
          </g>
          <g className={cls("lab1")}>
            <text x={160} y={150} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText} stroke="none">
              cancel factors
            </text>
          </g>
        </g>

        {/* 2: the trap, cancelling inside a sum */}
        <g className={cls("p2")}>
          <g className={cls("trap")}>
            <line x1={C2 - 38} y1={92} x2={C2 + 42} y2={92} stroke={C.ink} strokeWidth={1.5} />
            <Tex x={C2 - 16} y={NUM} size={20} anchor="end" width={30} color={C.bad}>{String.raw`6`}</Tex>
            <Tex x={C2 - 14} y={NUM} size={20} anchor="start" width={80}>{String.raw`x+42`}</Tex>
            <Tex x={C2} y={DEN} size={20} width={50} color={C.bad}>{String.raw`12`}</Tex>
          </g>
          <g fill="none" stroke={C.bad} strokeWidth={2.5}>
            <line className={cls("x1")} x1={C2 - 32} y1={NUM + 11} x2={C2 - 18} y2={NUM - 11} pathLength={100} />
            <line className={cls("x2")} x1={C2 - 12} y1={DEN + 11} x2={C2 + 12} y2={DEN - 11} pathLength={100} />
            <line className={cls("x3")} x1={134} y1={82} x2={152} y2={102} pathLength={100} />
            <line className={cls("x4")} x1={152} y1={82} x2={134} y2={102} pathLength={100} />
          </g>
          <g className={cls("lab2")}>
            <text x={C2 + 2} y={150} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.bad} stroke="none">
              not terms
            </text>
          </g>
          <g className={cls("chk1")}>
            <text x={176} y={34} fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
              cancel the 2s?
            </text>
            <Tex x={176} y={68} size={17} anchor="start" width={130}>{String.raw`\dfrac{2+6}{2+4}`}</Tex>
          </g>
          <g className={cls("chk2")}>
            <Tex x={176} y={114} size={17} anchor="start" width={130}>{String.raw`=\dfrac{8}{6}\ne\dfrac{6}{4}`}</Tex>
          </g>
        </g>

        {/* 3: common bottom, the minus flips both signs */}
        <g className={cls("p3")}>
          <g className={cls("ra")}>
            <Tex x={160} y={36} size={17} width={170}>{String.raw`\dfrac{5}{x+1}-\dfrac{2}{x+3}`}</Tex>
          </g>
          <g className={cls("chip")}>
            <Tex x={122} y={69} size={12} width={70} color={C.primaryText}>{String.raw`\times(x+3)`}</Tex>
            <Tex x={202} y={69} size={12} width={70} color={C.primaryText}>{String.raw`\times(x+1)`}</Tex>
          </g>
          <g className={cls("w1")}>
            <Tex x={160} y={108} size={17} width={240}>{String.raw`\dfrac{5(x+3)-2(x+1)}{(x+1)(x+3)}`}</Tex>
          </g>
          <g className={cls("w2")}>
            <Tex x={160} y={108} size={17} width={240}>{String.raw`\dfrac{5x+15-(2x+2)}{(x+1)(x+3)}`}</Tex>
          </g>
          <g className={cls("w3")}>
            <Tex x={160} y={108} size={17} width={240}>{String.raw`\dfrac{5x+15-2x-2}{(x+1)(x+3)}`}</Tex>
          </g>
          <g className={cls("w4")}>
            <Tex x={160} y={108} size={17} width={240} color={C.primaryText}>{String.raw`\dfrac{3x+13}{(x+1)(x+3)}`}</Tex>
          </g>
          <g className={cls("cap")}>
            <text x={160} y={152} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
              the minus flips both signs
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
