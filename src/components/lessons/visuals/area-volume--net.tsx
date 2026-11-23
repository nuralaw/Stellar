import { C, Css, Svg, Tex } from "./kit";

// The net of a 2 × 3 × 4 box (12 px per unit; edges 4, 2 and 3 are labelled). Faces come in pairs: 2×3 = 6, 2×4 = 8, 3×4 = 12, each twice. Total 52.
export const alt =
  "The unfolded net of a box that is 2 by 3 by 4. Six faces: two of 2×3 = 6, two of 2×4 = 8 and two of 3×4 = 12. The surface area is 2 × (6 + 8 + 12) = 52.";

const P = "v-area-volume--net-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const U = 12;
const X0 = 30;
const Y0 = 42;
// Faces (in units): x, y, width, height, area, group. Layout: a cross with the far face on the right.
const FACES = [
  { id: "c", x: 2, y: 2, w: 4, h: 3, n: 12, g: 3 },
  { id: "f", x: 8, y: 2, w: 4, h: 3, n: 12, g: 3 },
  { id: "t", x: 2, y: 0, w: 4, h: 2, n: 8, g: 2 },
  { id: "b", x: 2, y: 5, w: 4, h: 2, n: 8, g: 2 },
  { id: "l", x: 0, y: 2, w: 2, h: 3, n: 6, g: 1 },
  { id: "r", x: 6, y: 2, w: 2, h: 3, n: 6, g: 1 },
] as const;
const CT = { x: 2 + 2, y: 2 + 1.5 }; // the center face's center, where the faces unfold from
const GT = { 1: 30, 2: 46, 3: 62 } as const;
const unfold = (f: (typeof FACES)[number]) => {
  const dx = (CT.x - (f.x + f.w / 2)) * U;
  const dy = (CT.y - (f.y + f.h / 2)) * U;
  const t = f.g === 3 ? (f.id === "c" ? 6 : 10) : f.g === 2 ? 14 : 20;
  return r(`u${f.id}`, `0%, ${t}% { opacity: 0; transform: translate(${dx}px, ${dy}px) } ${t + 12}%, 100% { opacity: 1; transform: none }`, "");
};
const glow = (g: 1 | 2 | 3) => r(`g${g}`, `0%, ${GT[g]}% { fill: ${C.fill}; stroke: ${C.ink} } ${GT[g] + 3}%, ${GT[g] + 10}% { fill: ${C.soft}; stroke: ${C.primary} } ${GT[g] + 14}%, 100% { fill: ${C.fill}; stroke: ${C.ink} }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  ...FACES.map(unfold),
  glow(1),
  glow(2),
  glow(3),
  pop("dim", 28),
  pop("p1", 34),
  pop("p2", 50),
  pop("p3", 66),
  pop("p4", 78),
].join(" ");
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {FACES.map((f) => (
          <g key={f.id} className={cls(`u${f.id}`)}>
            <rect className={cls(`g${f.g}`)} x={X0 + f.x * U} y={Y0 + f.y * U} width={f.w * U} height={f.h * U} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.8} />
            <text x={X0 + (f.x + f.w / 2) * U} y={Y0 + (f.y + f.h / 2) * U + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} {...lab}>
              {f.n}
            </text>
          </g>
        ))}

        <g className={cls("dim")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <text x={X0 + 4 * U} y={Y0 - 6} textAnchor="middle">4</text>
          <text x={X0 + 6 * U + 7} y={Y0 + U + 4}>2</text>
          <text x={X0 - 7} y={Y0 + 3.5 * U + 4} textAnchor="end">3</text>
        </g>
        <g className={cls("p1")}>
          <Tex x={192} y={46} size={14} anchor="start" width={110}>{String.raw`2\times3=6`}</Tex>
        </g>
        <g className={cls("p2")}>
          <Tex x={192} y={68} size={14} anchor="start" width={110}>{String.raw`2\times4=8`}</Tex>
        </g>
        <g className={cls("p3")}>
          <Tex x={192} y={90} size={14} anchor="start" width={110}>{String.raw`3\times4=12`}</Tex>
        </g>
        <text className={cls("p4")} x={192} y={118} fontSize={11} fill={C.muted} {...lab}>each face twice:</text>
        <g className={cls("p4")}>
          <Tex x={192} y={136} size={14} anchor="start" width={120}>{String.raw`2(6+8+12)`}</Tex>
          <Tex x={192} y={157} size={18} anchor="start" width={90} color={C.primaryText}>{String.raw`{=}52`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
