import { C, Css, Svg } from "./kit";

// A cylinder (r = 3, h = 10) topped by a hemisphere (r = 3): 90π + 18π = 108π. Drawn to scale, 9 px per unit.
export const alt =
  "A silo: a cylinder with radius 3 and height 10 topped by a hemisphere with radius 3. The cylinder holds 90π, the hemisphere holds half of a sphere, 18π, and the total is 108π.";

const P = "v-area-volume--silo-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("cyl", 6),
  pop("dome", 24),
  pop("dims", 36),
  pop("p1", 38),
  pop("p2", 54),
  pop("p3", 72),
].join(" ");

const U = 9;
const cx = 84;
const R = 3 * U; // 27
const yBase = 146;
const yTopCyl = yBase - 10 * U; // 56
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* cylinder body: width 2r = 54, height 10 units = 90 */}
        <g className={cls("cyl")}>
          <path d={`M${cx - R} ${yTopCyl} V${yBase - 7} A${R} 8 0 0 0 ${cx + R} ${yBase - 7} V${yTopCyl} Z`} fill={C.fill} stroke={C.ink} strokeWidth={2} />
        </g>
        {/* hemisphere on top: radius 27 */}
        <g className={cls("dome")}>
          <path d={`M${cx - R} ${yTopCyl} A${R} ${R} 0 0 1 ${cx + R} ${yTopCyl} Z`} fill={C.soft} stroke={C.primary} strokeWidth={2} />
        </g>
        <g className={cls("dims")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <line x1={cx} y1={yTopCyl} x2={cx + R} y2={yTopCyl} stroke={C.muted} strokeWidth={1.5} />
          <text x={cx + R / 2} y={yTopCyl + 16} textAnchor="middle">r = 3</text>
          <line x1={cx + R + 8} y1={yTopCyl} x2={cx + R + 8} y2={yBase - 7} stroke={C.muted} strokeWidth={1.5} />
          <text x={cx + R + 14} y={(yTopCyl + yBase) / 2} >h = 10</text>
        </g>

        <g className={cls("p1")} {...lab}>
          <text x={168} y={52} fontSize={11} fill={C.muted}>cylinder</text>
          <text x={168} y={70} fontSize={13} fontWeight={700} fill={C.ink}>π · 3² · 10 = 90π</text>
        </g>
        <g className={cls("p2")} {...lab}>
          <text x={168} y={100} fontSize={11} fill={C.muted}>hemisphere: half a sphere</text>
          <text x={168} y={118} fontSize={13} fontWeight={700} fill={C.primary}>½ × 36π = 18π</text>
        </g>
        <text className={cls("p3")} x={168} y={148} fontSize={16} fontWeight={700} fill={C.ink} {...lab}>total 108π</text>
      </g>
    </Svg>
  );
}
