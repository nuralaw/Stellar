import { C, Css, Svg, Tex } from "./kit";

// Clear denominators: multiply EVERY term (the plain 10 too) by 6, and the fractions become whole numbers.
export const alt =
  "The equation x over 2 plus x over 3 equals 10. A badge multiplies every term by 6, the plain 10 as well: the equation becomes 3x + 2x = 60, so x = 12.";

const P = "v-linear-equations-one-var--clear-denominators-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 }`);
const gone = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 1 } ${t + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
const draw = (n: string, t: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + 6}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 11s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("eq", 6),
  r("ring", "0%, 12% { opacity: 0 } 17%, 26% { opacity: 1 } 31%, 100% { opacity: 0 }", "opacity: 0;"),
  r("badge", "0%, 24% { opacity: 0; transform: translateY(-12px) } 31%, 100% { opacity: 1; transform: none }"),
  pop("every", 30),
  draw("a1", 32),
  draw("a2", 38),
  draw("a3", 44),
  pop("d1", 32),
  pop("d2", 38),
  pop("d3", 44),
  gone("o1", 52),
  gone("o2", 58),
  pop("n1", 52),
  pop("n2", 58),
  pop("n3", 64),
  gone("ten", 42),
  r("tenA", "0%, 42% { opacity: 0 } 46%, 62% { opacity: 1 } 66%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("ans", 74),
].join("\n");

const CX = [90, 122, 154, 192, 232];
const Y = 82;
const tex = (x: number, s: string, color: string = C.ink, size = 22, w = 44) => (
  <Tex x={x} y={Y} size={size} width={w} color={color}>
    {s}
  </Tex>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the fractions (before) */}
        <g className={cls("o1")}>{tex(CX[0], String.raw`\dfrac{x}{2}`)}</g>
        <g className={cls("o2")}>{tex(CX[2], String.raw`\dfrac{x}{3}`)}</g>
        <g className={cls("ten")}>{tex(CX[4], "10")}</g>
        <g className={cls("tenA")}>{tex(CX[4], "10", C.primaryText)}</g>
        {/* the whole numbers (after) */}
        <g className={cls("n1")}>{tex(CX[0], "3x")}</g>
        <g className={cls("n2")}>{tex(CX[2], "2x")}</g>
        <g className={cls("n3")}>{tex(CX[4], "60", C.primaryText)}</g>
        {/* signs stay put */}
        <g className={cls("eq")}>
          {tex(CX[1], "+")}
          {tex(CX[3], "=")}
        </g>
        {/* the two denominators, circled */}
        <g className={cls("ring")} fill="none" stroke={C.primary} strokeWidth={2}>
          <circle cx={CX[0]} cy={Y + 11} r={9} />
          <circle cx={CX[2]} cy={Y + 11} r={9} />
        </g>

        {/* the multiplier */}
        <g className={cls("badge")}>
          <rect x={130} y={14} width={60} height={28} rx={14} fill={C.primary} />
          <Tex x={160} y={28} size={18} width={56} color={C.onPrimary}>
            {String.raw`\times 6`}
          </Tex>
        </g>
        <text className={cls("every")} x={200} y={32} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          every term
        </text>
        {[CX[0], CX[2], CX[4]].map((x, i) => (
          <g key={x}>
            <line className={cls(`a${i + 1}`)} x1={160} y1={42} x2={x} y2={Y - 20} pathLength={100} stroke={C.primary} strokeWidth={2} />
            <circle className={cls(`d${i + 1}`)} cx={x} cy={Y - 20} r={3} fill={C.primary} />
          </g>
        ))}

        {/* the answer */}
        <g className={cls("ans")}>
          <rect x={112} y={118} width={96} height={42} rx={10} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={160} y={139} size={26} width={90} color={C.good}>
            {String.raw`x=12`}
          </Tex>
        </g>
      </g>
    </Svg>
  );
}
