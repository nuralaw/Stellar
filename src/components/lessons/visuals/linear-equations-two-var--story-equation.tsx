import { C, Css, Svg, Tex } from "./kit";

// 8x + 5y = 200: each coefficient is the price of one item, each term is the money spent on it, the intercepts mean "only one kind".
// Shirts $8, hats $5, $200 to spend. x = 15 shirts cost 120, so 80 is left for hats: y = 16. The line crosses at (25, 0) and (0, 40).
export const alt =
  "Shirts cost $8, hats $5, and 200 dollars are spent: 8x + 5y = 200. With 15 shirts (120 dollars), 80 is left for 16 hats. The graph crosses at (25, 0), only shirts, and (0, 40), only hats.";

const P = "v-linear-equations-two-var--story-equation-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const grow = (n: string, t: number, d: number) => r(n, `0%, ${t}% { transform: scaleX(0); opacity: 0 } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 100% { transform: none; opacity: 1 }`, "transform-box: fill-box; transform-origin: left center;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 94% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("i1", 3),
  pop("i2", 8),
  pop("eq", 14),
  pop("cap", 20),
  pop("bar", 30),
  grow("shirts", 34, 8),
  pop("shirtT", 40),
  r("left", "0%, 46% { opacity: 0 } 50%, 52% { opacity: 1 } 56%, 100% { opacity: 0 }", "opacity: 0;"),
  grow("hats", 52, 6),
  pop("hatT", 57),
  pop("yy", 62),
  pop("axes", 62),
  draw("line", 66, 10),
  pop("dots", 74),
  pop("lbl", 78),
  pop("pt", 85),
].join("\n");

const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { color?: string; size?: number; w?: number; anchor?: "start" | "middle" | "end" } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 16} anchor={o.anchor ?? "middle"} width={o.w ?? 60} color={o.color ?? C.ink}>
    {s}
  </Tex>
);
const layer = (parts: string[], show: number[]) => parts.map((p, i) => (show.includes(i) ? p : String.raw`\phantom{${p}}`)).join("");
const EQ = ["8", "x+", "5", "y=200"];

// the graph: x from 0 to 25 (4.4 per unit), y from 0 to 40 (2.5 per unit)
const gx = (x: number) => 192 + 4.4 * x;
const gy = (y: number) => 150 - 2.5 * y;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the two items and their prices */}
        <g className={cls("i1")}>
          <g transform="translate(14 12)">
            <path d="M6 3 L10 1 Q12 4 14 1 L18 3 L23 8 L20 11 L18 9 V22 H6 V9 L4 11 L1 8 Z" fill={C.soft} stroke={C.ink} strokeWidth={1.5} />
          </g>
          <text x={42} y={32} fontSize={15} fontWeight={700} fill={C.primaryText} {...lab}>
            $8
          </text>
          {T(62, 27, String.raw`\times x`, { anchor: "start", size: 14, w: 40 })}
        </g>
        <g className={cls("i2")}>
          <g transform="translate(98 12)">
            <path d="M2 18 Q2 6 12 6 Q22 6 22 18 Z M1 18 H25 L22 22 H3 Z" fill={C.soft} stroke={C.ink} strokeWidth={1.5} />
          </g>
          <text x={128} y={32} fontSize={15} fontWeight={700} fill={C.primaryText} {...lab}>
            $5
          </text>
          {T(148, 27, String.raw`\times y`, { anchor: "start", size: 14, w: 40 })}
        </g>

        {/* the equation: the prices in the accent colour, the counters neutral */}
        <g className={cls("eq")}>
          {T(92, 66, layer(EQ, [1, 3]), { size: 21, w: 150 })}
          {T(92, 66, layer(EQ, [0, 2]), { size: 21, w: 150, color: C.primaryText })}
        </g>
        <g className={cls("cap")} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle" {...lab}>
          <text x={38} y={90}>shirts</text>
          <text x={89} y={90}>hats</text>
          <text x={138} y={90}>total</text>
        </g>

        {/* x = 15: the shirts take 120 of the 200, what is left buys hats */}
        <g className={cls("bar")}>
          <rect x={18} y={102} width={150} height={22} rx={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        </g>
        <rect className={cls("shirts")} x={18} y={102} width={90} height={22} rx={5} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <g className={cls("shirtT")}>{T(63, 113, String.raw`8(15)=120`, { size: 12, w: 86 })}</g>
        <text className={cls("left")} x={138} y={117} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
          80 left
        </text>
        <rect className={cls("hats")} x={108} y={102} width={60} height={22} rx={5} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <g className={cls("hatT")}>{T(138, 113, String.raw`5y=80`, { size: 12, w: 56 })}</g>
        <g className={cls("yy")}>{T(92, 148, String.raw`x=15\quad y=16`, { size: 17, w: 150, color: C.good })}</g>

        {/* the graph: the two intercepts mean only one kind of item */}
        <path className={cls("axes")} d={`M${gx(0)} ${gy(44)} V${gy(0)} H${gx(26)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <line className={cls("line")} x1={gx(0)} y1={gy(40)} x2={gx(25)} y2={gy(0)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        <g className={cls("dots")}>
          <circle cx={gx(25)} cy={gy(0)} r={4.5} fill={C.primary} />
          <circle cx={gx(0)} cy={gy(40)} r={4.5} fill={C.primary} />
        </g>
        <g className={cls("lbl")} fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>
          <text x={304} y={163} textAnchor="end">
            only shirts
          </text>
          <text x={gx(0) + 8} y={gy(40) - 1}>
            only hats
          </text>
        </g>
        <g className={cls("pt")}>
          <circle cx={gx(15)} cy={gy(16)} r={5} fill={C.good} />
          <text x={gx(15) + 4} y={gy(16) - 9} fontSize={11} fontWeight={700} fill={C.good} {...lab}>
            (15, 16)
          </text>
        </g>
      </g>
    </Svg>
  );
}
