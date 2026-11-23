import { C, Css, Svg, Tex } from "./kit";

// The two reference-sheet triangles, drawn to scale: 45-45-90 (x, x, x√2) and 30-60-90 (x, x√3, 2x).
// Each side is opposite its angle: x faces 30, x√3 faces 60, 2x faces 90.
export const alt =
  "A 45-45-90 triangle with sides x, x and x√2. A 30-60-90 triangle where x faces the 30 degree angle, x√3 faces the 60 degree angle and 2x, the hypotenuse, faces the 90 degree angle.";

const P = "v-right-triangles-trig--special-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
/** Angle label and its opposite side flash in the accent together, then settle. */
const pair = (n: string, t: number) => r(n, `0%, ${t}% { fill: ${C.ink} } ${t + 3}%, ${t + 11}% { fill: ${C.primaryText} } ${t + 14}%, 100% { fill: ${C.ink} }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  r("t1", "0%, 6% { stroke-dashoffset: 100 } 18%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  r("t2", "0%, 22% { stroke-dashoffset: 100 } 36%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("l1", 16),
  pop("l2", 34),
  pair("g30", 46),
  pair("g60", 60),
  pair("g90", 74),
].join(" ");

const U = 52;
const S3 = Math.sqrt(3);
// 45-45-90: legs 52, right angle at bottom-left
const B1 = { x: 36, y: 140 };
const A1 = { x: B1.x + U, y: 140 };
const C1 = { x: B1.x, y: 140 - U };
// 30-60-90: short leg 52 vertical, long leg 52*sqrt(3) horizontal, hypotenuse 104
const B2 = { x: 172, y: 140 };
const A2 = { x: B2.x + f(U * S3), y: 140 };
const C2 = { x: B2.x, y: 140 - U };
const small = { fontSize: 11, fontWeight: 600, fill: C.muted, stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 45-45-90 */}
        <path className={cls("t1")} d={`M${B1.x} ${B1.y} L${A1.x} ${A1.y} L${C1.x} ${C1.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path d={`M${B1.x} ${B1.y - 8} h8 v8`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className={cls("l1")}>
          <Tex x={B1.x - 6} y={B1.y - 24} size={15} anchor="end" width={20}>{String.raw`x`}</Tex>
          <Tex x={B1.x + U / 2} y={B1.y + 14} size={15} width={20}>{String.raw`x`}</Tex>
          <Tex x={f((A1.x + C1.x) / 2 + 8)} y={f((A1.y + C1.y) / 2 - 8)} size={15} anchor="start" width={50}>{String.raw`x\sqrt{2}`}</Tex>
          <text x={A1.x + 6} y={A1.y + 4} {...small}>45°</text>
          <text x={C1.x + 6} y={C1.y - 6} {...small}>45°</text>
        </g>

        {/* 30-60-90 */}
        <path className={cls("t2")} d={`M${B2.x} ${B2.y} L${A2.x} ${A2.y} L${C2.x} ${C2.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path d={`M${B2.x} ${B2.y - 8} h8 v8`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className={cls("l2")}>
          <g className={cls("g30")}>
            <Tex x={B2.x - 6} y={B2.y - 24} size={15} anchor="end" width={20}>{String.raw`x`}</Tex>
          </g>
          <g className={cls("g60")}>
            <Tex x={f(B2.x + (A2.x - B2.x) / 2)} y={B2.y + 14} size={15} width={50}>{String.raw`x\sqrt{3}`}</Tex>
          </g>
          <g className={cls("g90")}>
            <Tex x={f((A2.x + C2.x) / 2 + 8)} y={f((A2.y + C2.y) / 2 - 12)} size={15} anchor="start" width={36}>{String.raw`2x`}</Tex>
          </g>
          <text className={cls("g30")} x={A2.x + 6} y={A2.y + 4} {...small}>30°</text>
          <text className={cls("g60")} x={C2.x + 6} y={C2.y - 6} {...small}>60°</text>
          <text className={cls("g90")} x={B2.x + 12} y={B2.y - 12} {...small}>90°</text>
        </g>
      </g>
    </Svg>
  );
}
