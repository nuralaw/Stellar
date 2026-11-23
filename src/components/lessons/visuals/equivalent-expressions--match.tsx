import { C, Css, Svg, Tex } from "./kit";

// Match coefficients: (3x + 4)(x + k) = 3x² + bx + 20 for every x, so each power of x has the same coefficient on both sides. k = 5, b = 19.
export const alt =
  "If (3x + 4)(x + k) = 3x² + bx + 20 for every x, the coefficients match column by column: 4k = 20 gives k = 5, then 3k + 4 = b gives b = 19, and the x² columns agree (3 = 3).";

const P = "v-equivalent-expressions--match-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

// Beats (% of the 12 s loop): 3 the equation · 12 expand · 20 three columns · 32 number column, k = 5 · 50 x column, b = 19 ·
// 66 x² column · 82 the filled-in equation.
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("e0", 3, 80),
  show("e1", 82),
  show("all", 5),
  show("exp", 12),
  show("hd", 20),
  show("lr", 24),
  show("rr", 28),
  show("h3", 32, 49),
  show("s3a", 33, 41),
  show("s3b", 41),
  show("t3", 44),
  show("h2", 50, 65),
  show("s2a", 51, 58),
  show("s2b", 58),
  show("t2", 62),
  show("h1", 66, 81),
  show("s1", 68),
  show("t1", 72),
].join(" ");

const COLS = [70, 160, 250];
const tick = (cx: number, n: string) => (
  <path className={cls(n)} d={`M${cx - 5} 156 L${cx - 1} 161 L${cx + 6} 151`} transform="translate(0 0)" fill="none" stroke={C.good} strokeWidth={2.5} />
);

export default function Visual() {
  const cell = (n: string, cx: number, y: number, tex: string, size = 14, color: string = C.ink, width = 90) => (
    <g className={cls(n)}>
      <Tex x={cx} y={y} size={size} width={width} color={color}>
        {tex}
      </Tex>
    </g>
  );
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The equation, then the filled-in one */}
        <g className={cls("e0")}>
          <Tex x={160} y={17} size={15} width={270}>{String.raw`(3x+4)(x+k)=3x^2+bx+20`}</Tex>
        </g>
        <g className={cls("e1")}>
          <Tex x={160} y={17} size={15} width={270}>{String.raw`(3x+4)(x+5)=3x^2+19x+20`}</Tex>
        </g>
        <g className={cls("all")}>
          <text x={160} y={42} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
            true for all x
          </text>
        </g>
        <g className={cls("exp")}>
          <Tex x={160} y={63} size={14} width={220}>{String.raw`=3x^2+3kx+4x+4k`}</Tex>
        </g>

        {/* Columns */}
        {[h("h3", COLS[2]), h("h2", COLS[1]), h("h1", COLS[0])]}
        <g className={cls("hd")} fontSize={12} fontWeight={700} fill={C.muted} stroke="none" textAnchor="middle">
          <Tex x={COLS[0]} y={84} size={13} width={60} color={C.muted}>{String.raw`x^2`}</Tex>
          <Tex x={COLS[1]} y={84} size={13} width={60} color={C.muted}>{String.raw`x`}</Tex>
          <text x={COLS[2]} y={88}>number</text>
        </g>
        <g className={cls("lr")}>
          <Tex x={COLS[0]} y={105} size={14} width={80}>{String.raw`3x^2`}</Tex>
          <Tex x={COLS[1]} y={105} size={14} width={90}>{String.raw`(3k+4)x`}</Tex>
          <Tex x={COLS[2]} y={105} size={14} width={60}>{String.raw`4k`}</Tex>
        </g>
        <g className={cls("rr")}>
          {COLS.map((cx) => (
            <text key={cx} x={cx} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.muted} stroke="none">
              =
            </text>
          ))}
          <Tex x={COLS[0]} y={138} size={14} width={80}>{String.raw`3x^2`}</Tex>
          <Tex x={COLS[1]} y={138} size={14} width={60}>{String.raw`bx`}</Tex>
          <Tex x={COLS[2]} y={138} size={14} width={60}>{String.raw`20`}</Tex>
        </g>

        {/* Solving, one column at a time */}
        {cell("s3a", COLS[2], 158, String.raw`4k=20`, 15, C.primaryText, 80)}
        {cell("s3b", COLS[2], 158, String.raw`k=5`, 15, C.primaryText, 80)}
        {cell("s2a", COLS[1], 158, String.raw`b=3k+4`, 14, C.primaryText, 100)}
        {cell("s2b", COLS[1], 158, String.raw`b=19`, 15, C.primaryText, 80)}
        {cell("s1", COLS[0], 158, String.raw`3=3`, 15, C.ink, 80)}
        {tick(COLS[2] + 32, "t3")}
        {tick(COLS[1] + 36, "t2")}
        {tick(COLS[0] + 28, "t1")}
      </g>
    </Svg>
  );
}

/** The soft highlight behind one column while it is being solved. */
function h(n: string, cx: number) {
  return <rect key={n} className={cls(n)} x={cx - 42} y={73} width={84} height={90} rx={9} fill={C.soft} />;
}
