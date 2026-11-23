import { C, Css, Svg, Tex } from "./kit";

// A bag of 3 red and 5 blue marbles, two blue picks. With replacement: 5/8 · 5/8 = 25/64. Without: 5/8 · 4/7 = 5/14.
export const alt =
  "A bag of 3 red and 5 blue marbles, two blue picks. With replacement the second pick is 5/8 again: 25/64. Without replacement the bag shrinks to 7: 5/8 · 4/7 = 5/14.";

const P = "v-probability--independent-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("labs", 5),
  pop("f1", 20),
  // Column A: the marble comes out, goes back in, the second pick is the same fraction.
  r("outA", "0%, 10% { transform: none } 16%, 30% { transform: translate(36px, -11px) } 36%, 100% { transform: none }", "transform-box: view-box;"),
  pop("a8", 38),
  pop("a2", 42),
  pop("a3", 52),
  // Column B: the marble stays out, the bag has 7 left, the second fraction changes.
  r("outB", "0%, 10% { transform: translate(0, 0) } 16%, 100% { transform: translate(36px, -11px) }", "transform: translate(36px, -11px); transform-box: view-box;"),
  pop("b7", 60),
  pop("b2", 64),
  pop("b3", 76),
  pop("rule", 84),
].join(" ");

const lab = { stroke: "none" } as const;
// Row-major, 4 per row: 3 red (R) and 5 blue (B). The last blue marble (bottom right) is the one picked.
const KINDS = ["R", "R", "B", "B", "R", "B", "B", "B"] as const;
const dotX = (c0: number, i: number) => c0 + 14 + (i % 4) * 22;
const dotY = (i: number) => (i < 4 ? 47 : 69);
const fill = (k: string) => (k === "R" ? C.bad : C.muted);
const Y = 130; // the work

/** One column: a bag of 8, the picked marble, and the pieces of the product. */
function Column({ c0, withReplacement }: { c0: number; withReplacement: boolean }) {
  const cx = c0 + 68;
  const out = withReplacement ? "outA" : "outB";
  const second = withReplacement ? String.raw`\dfrac{5}{8}` : String.raw`\dfrac{4}{7}`;
  const result = withReplacement ? String.raw`\dfrac{25}{64}` : String.raw`\dfrac{5}{14}`;
  const warm = withReplacement ? C.ink : C.primaryText;
  const k = withReplacement ? "a" : "b";
  return (
    <g>
      <text className={cls("labs")} x={c0} y={21} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>
        {withReplacement ? "with replacement" : "without replacement"}
      </text>
      <rect x={c0} y={33} width={94} height={50} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      {KINDS.slice(0, 7).map((kind, i) => (
        <circle key={i} cx={dotX(c0, i)} cy={dotY(i)} r={7.5} fill={fill(kind)} />
      ))}
      {/* the picked marble */}
      <circle className={cls(out)} cx={dotX(c0, 7)} cy={dotY(7)} r={7.5} fill={C.muted} stroke={C.primary} strokeWidth={2} />
      <text
        className={cls(withReplacement ? "a8" : "b7")}
        x={c0 + 47}
        y={99}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill={withReplacement ? C.muted : C.primaryText}
        {...lab}
      >
        {withReplacement ? "still 8 in the bag" : "now 7 in the bag"}
      </text>

      {/* 5/8 · second pick = result */}
      <g className={cls("f1")}>
        <Tex x={cx - 47} y={Y} size={19} width={44}>{String.raw`\dfrac{5}{8}`}</Tex>
      </g>
      <g className={cls(`${k}2`)}>
        <Tex x={cx - 28} y={Y} size={19} width={30}>{String.raw`\cdot`}</Tex>
        <Tex x={cx - 9} y={Y} size={19} width={44} color={warm}>{second}</Tex>
      </g>
      <g className={cls(`${k}3`)}>
        <Tex x={cx + 11} y={Y} size={19} width={30}>{String.raw`=`}</Tex>
        <Tex x={cx + 42} y={Y} size={19} width={54} color={C.good}>{result}</Tex>
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <line x1={160} y1={18} x2={160} y2={146} stroke={C.line} strokeWidth={1.5} />
        <Column c0={16} withReplacement />
        <Column c0={172} withReplacement={false} />
        <g className={cls("rule")}>
          <Tex x={160} y={166} size={13} width={240} color={C.muted}>{String.raw`P(A\text{ and }B)=P(A)\cdot P(B)`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
