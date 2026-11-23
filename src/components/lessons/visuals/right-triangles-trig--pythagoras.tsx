import type { CSSProperties } from "react";
import { C, Css, Svg, Tex } from "./kit";

// The 3-4-5 triangle with a square on each side (13 px per unit): the 9 + 16 cells of the leg squares fill the 25 cells
// of the hypotenuse square, so a² + b² = c². Then the bigger copies and the triples worth knowing.
export const alt =
  "A right triangle with legs 3 and 4 and hypotenuse 5. The 9 cells of the 3 by 3 square and the 16 cells of the 4 by 4 square fill the 25 cells of the 5 by 5 square, so a² + b² = c².";

const P = "v-right-triangles-trig--pythagoras-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

const U = 13;
const V = { x: 55, y: 68 }; // top of the vertical leg (a = 3)
const O = { x: 55, y: 107 }; // the right angle
const H = { x: 107, y: 107 }; // end of the horizontal leg (b = 4)
const e1 = { x: (H.x - V.x) / 5, y: (H.y - V.y) / 5 }; // one cell along the hypotenuse
const e2 = { x: (3 * U) / 5, y: (-4 * U) / 5 }; // one cell outward from it
const at = (i: number, j: number) => ({ x: V.x + i * e1.x + j * e2.x, y: V.y + i * e1.y + j * e2.y });
const f = (n: number) => Math.round(n * 10) / 10;
const TURN = (Math.atan2(e1.y, e1.x) * 180) / Math.PI; // 36.87°: how much the big square is tilted

// 25 cells in the big square: the first 9 come from the 3 by 3 square, the other 16 from the 4 by 4 square.
const cells = Array.from({ length: 25 }, (_, k) => {
  const i = k % 5;
  const j = Math.floor(k / 5);
  const t = at(i + 0.5, j + 0.5);
  const small = k < 9;
  const m = small ? k : k - 9;
  const w = small ? 3 : 4;
  const s = small ? { x: 16 + U * ((m % w) + 0.5), y: 68 + U * (Math.floor(m / w) + 0.5) } : { x: 55 + U * ((m % w) + 0.5), y: 107 + U * (Math.floor(m / w) + 0.5) };
  const pts = [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)].map((p) => `${f(p.x)},${f(p.y)}`).join(" ");
  return { k, j, small, pts, dx: f(s.x - t.x), dy: f(s.y - t.y) };
});
const from = `translate(var(--dx), var(--dy)) rotate(${f(-TURN)}deg)`;
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("tri", 4),
  pop("mark", 10),
  win("l1", 12, 24),
  win("tag", 12, 24),
  pop("sq", 26),
  pop("sl", 30),
  ...[0, 1, 2, 3, 4].map((j) => r(`c${j}`, `0%, 26% { opacity: 0; transform: ${from} } 30%, ${36 + 3 * j}% { opacity: 1; transform: ${from} } ${42 + 3 * j}%, 100% { opacity: 1; transform: none }`)),
  pop("e1", 56),
  pop("e2", 60),
  pop("e3", 63),
  win("x2", 64, 67),
  win("x3", 68, 71),
  pop("x5", 72),
  pop("t1", 78),
  pop("t2", 82),
  pop("t3", 86),
  pop("t4", 90),
].join(" ");

const lab = { stroke: "none" } as const;
const CHIPS = [
  { n: "3-4-5", x: 172, y: 116 },
  { n: "5-12-13", x: 244, y: 116 },
  { n: "8-15-17", x: 172, y: 142 },
  { n: "7-24-25", x: 244, y: 142 },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the three squares */}
        <g className={cls("sq")} fill="none" strokeWidth={2}>
          <rect x={16} y={68} width={39} height={39} stroke={C.muted} />
          <rect x={55} y={107} width={52} height={52} stroke={C.primary} />
          <polygon points={`${V.x},${V.y} ${H.x},${H.y} ${f(at(5, 5).x)},${f(at(5, 5).y)} ${f(at(0, 5).x)},${f(at(0, 5).y)}`} stroke={C.good} fill={C.goodSoft} />
        </g>
        {/* the unit cells slide from the small squares into the big one */}
        {cells.map((c) => (
          <polygon
            key={c.k}
            className={cls(`c${c.j}`)}
            points={c.pts}
            fill={c.small ? C.muted : C.primary}
            fillOpacity={c.small ? 0.5 : 0.6}
            stroke={C.bg}
            strokeWidth={1}
            style={{ transformBox: "fill-box", transformOrigin: "center", "--dx": `${c.dx}px`, "--dy": `${c.dy}px` } as CSSProperties}
          />
        ))}

        {/* the triangle */}
        <g className={cls("tri")}>
          <polygon points={`${O.x},${O.y} ${H.x},${H.y} ${V.x},${V.y}`} fill={C.fill} stroke={C.ink} strokeWidth={2.5} />
        </g>
        <path className={cls("mark")} d={`M${O.x + 8} ${O.y} V${O.y - 8} H${O.x}`} fill="none" stroke={C.ink} strokeWidth={1.5} />

        {/* side names (frame 1), then the squares' names */}
        <g className={cls("l1")}>
          <Tex x={50} y={88} size={13} anchor="end" width={40}>{String.raw`a=3`}</Tex>
          <Tex x={81} y={121} size={13} width={40}>{String.raw`b=4`}</Tex>
          <Tex x={100} y={74} size={14} width={40} color={C.primaryText}>{String.raw`c=5`}</Tex>
        </g>
        <g className={cls("sl")}>
          <Tex x={36} y={88} size={14} width={40}>{String.raw`a^2`}</Tex>
          <Tex x={81} y={133} size={14} width={40}>{String.raw`b^2`}</Tex>
          <Tex x={f(at(2.5, 2.5).x)} y={f(at(2.5, 2.5).y)} size={14} width={40}>{String.raw`c^2`}</Tex>
        </g>

        {/* right column */}
        <g className={cls("tag")} {...lab}>
          <text x={172} y={34} fontSize={15} fontWeight={700} fill={C.primaryText}>c: the hypotenuse</text>
          <text x={172} y={54} fontSize={12} fill={C.muted}>opposite the right angle,</text>
          <text x={172} y={70} fontSize={12} fill={C.muted}>the longest side</text>
        </g>
        <g className={cls("e1")}>
          <Tex x={172} y={30} size={17} anchor="start" width={130}>{String.raw`9+16=25`}</Tex>
        </g>
        <g className={cls("e2")}>
          <Tex x={172} y={56} size={17} anchor="start" width={140} color={C.primaryText}>{String.raw`a^2+b^2=c^2`}</Tex>
        </g>
        <g className={cls("e3")}>
          <Tex x={172} y={82} size={14} anchor="start" width={140}>{String.raw`c=\sqrt{a^2+b^2}`}</Tex>
        </g>
        <g className={cls("x2")}>
          <Tex x={172} y={101} size={13} anchor="start" width={140}>{String.raw`\times 2:\ 6\text{-}8\text{-}10`}</Tex>
        </g>
        <g className={cls("x3")}>
          <Tex x={172} y={101} size={13} anchor="start" width={140}>{String.raw`\times 3:\ 9\text{-}12\text{-}15`}</Tex>
        </g>
        <g className={cls("x5")}>
          <Tex x={172} y={101} size={13} anchor="start" width={140}>{String.raw`\times 5:\ 15\text{-}20\text{-}25`}</Tex>
        </g>
        {CHIPS.map((c, i) => (
          <g key={c.n} className={cls(`t${i + 1}`)}>
            <rect x={c.x} y={c.y} width={66} height={22} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            <text x={c.x + 33} y={c.y + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>{c.n}</text>
          </g>
        ))}
      </g>
    </Svg>
  );
}
