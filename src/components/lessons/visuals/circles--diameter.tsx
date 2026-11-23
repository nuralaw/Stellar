import { C, Css, Svg, Tex } from "./kit";

// A diameter from P(−1, 3) to Q(7, 9): the center is its midpoint C(3, 6), the radius is half of it (10 / 2 = 5),
// so (x − 3)² + (y − 6)² = 25. Test points: (3, 10) inside (16 < 25), (6, 10) on (25 = 25), (9, 9) outside (45 > 25). 13 px per unit.
export const alt =
  "A diameter from (−1, 3) to (7, 9) has its midpoint at (3, 6): the center. Half of the length 10 is the radius 5, so (x − 3)² + (y − 6)² = 25. Three test points land inside, on and outside the circle.";

const P = "v-circles--diameter-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 8) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("dia", 5, 8),
  pop("pq", 9),
  pop("pql", 13),
  win("guide", 16, 33),
  pop("mid", 20),
  pop("midl", 23),
  pop("f1", 25),
  pop("f2", 29),
  draw("legx", 35, 5),
  draw("legy", 39, 5),
  pop("legl", 43),
  pop("ten", 46),
  draw("rad", 50, 5),
  pop("five", 55),
  draw("ring", 58, 8),
  pop("eq", 66),
  pop("p1", 70),
  pop("p2", 78),
  pop("p3", 86),
].join(" ");

const U = 13;
const X = (x: number) => 42 + U * x;
const Y = (y: number) => 160 - U * y;
const lab = { stroke: "none" } as const;
const Pp = { x: X(-1), y: Y(3) };
const Q = { x: X(7), y: Y(9) };
const Cc = { x: X(3), y: Y(6) };
const R = { x: X(7), y: Y(3) };
const TESTS = [
  { n: "p1", at: [3, 10], col: C.good, text: C.good, row: 126, xy: "(3, 10)", math: String.raw`16<25`, word: "inside" },
  { n: "p2", at: [6, 10], col: C.primary, text: C.primaryText, row: 144, xy: "(6, 10)", math: String.raw`25=25`, word: "on" },
  { n: "p3", at: [9, 9], col: C.bad, text: C.bad, row: 162, xy: "(9, 9)", math: String.raw`45>25`, word: "outside" },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line key={`x${i}`} x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(11)} />
          ))}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((j) => (
            <line key={`y${j}`} x1={X(-2)} y1={Y(j)} x2={X(9)} y2={Y(j)} />
          ))}
        </g>
        <g stroke={C.muted} strokeWidth={1.5}>
          <line x1={X(-2)} y1={Y(0)} x2={X(9)} y2={Y(0)} />
          <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(11)} />
        </g>

        {/* the circle, once center and radius are known */}
        <circle className={cls("ring")} cx={Cc.x} cy={Cc.y} r={5 * U} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />

        {/* the legs 8 and 6 under the diameter */}
        <line className={cls("legx")} x1={Pp.x} y1={Pp.y} x2={R.x} y2={R.y} pathLength={100} stroke={C.muted} strokeWidth={2} />
        <line className={cls("legy")} x1={R.x} y1={R.y} x2={Q.x} y2={Q.y} pathLength={100} stroke={C.muted} strokeWidth={2} />
        <g className={cls("legl")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <text x={Cc.x} y={R.y + 14} textAnchor="middle">8</text>
          <text x={R.x + 8} y={(R.y + Q.y) / 2 + 4}>6</text>
        </g>

        {/* the diameter, its endpoints and its midpoint */}
        <line className={cls("dia")} x1={Pp.x} y1={Pp.y} x2={Q.x} y2={Q.y} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        <line className={cls("rad")} x1={Cc.x} y1={Cc.y} x2={Q.x} y2={Q.y} pathLength={100} stroke={C.primary} strokeWidth={3.5} />
        <g className={cls("guide")}>
          <line x1={Cc.x} y1={Cc.y} x2={Cc.x} y2={Y(0)} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={Cc.x} y1={Cc.y} x2={X(0)} y2={Cc.y} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3" />
          <text x={Cc.x + 5} y={Y(0) - 6} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>3</text>
          <text x={X(0) + 5} y={Cc.y - 5} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>6</text>
        </g>
        <g className={cls("pq")}>
          <circle cx={Pp.x} cy={Pp.y} r={4.5} fill={C.primary} />
          <circle cx={Q.x} cy={Q.y} r={4.5} fill={C.primary} />
        </g>
        <g className={cls("pql")} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>
          <text x={Pp.x - 7} y={Pp.y + 16}>P</text>
          <text x={Q.x + 8} y={Q.y - 4}>Q</text>
        </g>
        <g className={cls("mid")}>
          <circle cx={Cc.x} cy={Cc.y} r={6} fill={C.bg} stroke={C.ink} strokeWidth={2} />
          <circle cx={Cc.x} cy={Cc.y} r={3} fill={C.ink} />
        </g>
        <text className={cls("midl")} x={Cc.x + 9} y={Cc.y + 18} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>C(3, 6)</text>
        <text className={cls("ten")} x={Cc.x - 14} y={Cc.y - 12} textAnchor="end" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>10</text>
        <text className={cls("five")} x={(Cc.x + Q.x) / 2 + 9} y={(Cc.y + Q.y) / 2 + 11} fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>5</text>

        {/* the three test points */}
        {TESTS.map((t) => {
          const p = { x: X(t.at[0]), y: Y(t.at[1]) };
          return (
            <g key={t.n} className={cls(t.n)}>
              <line x1={p.x} y1={p.y} x2={Cc.x} y2={Cc.y} stroke={t.col} strokeWidth={1.5} strokeDasharray="3 3" />
              <circle cx={p.x} cy={p.y} r={4.5} fill={t.col} />
              <text x={172} y={t.row + 4} fontSize={12} fontWeight={700} fill={t.text} {...lab}>{t.xy}</text>
              <Tex x={216} y={t.row} size={14} anchor="start" width={52} color={t.text}>{t.math}</Tex>
              <text x={270} y={t.row + 4} fontSize={12} fontWeight={700} fill={t.text} {...lab}>{t.word}</text>
            </g>
          );
        })}

        {/* the work */}
        <g className={cls("f1")}>
          <Tex x={172} y={53} size={14} anchor="start" width={120}>{String.raw`\dfrac{-1+7}{2}=3`}</Tex>
        </g>
        <g className={cls("f2")}>
          <Tex x={172} y={91} size={14} anchor="start" width={120}>{String.raw`\dfrac{3+9}{2}=6`}</Tex>
        </g>
        <g className={cls("eq")}>
          <Tex x={166} y={26} size={13} anchor="start" width={142} color={C.primaryText}>{String.raw`(x-3)^2+(y-6)^2=25`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
