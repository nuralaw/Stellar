import { C, Css, Svg } from "./kit";

// Radians: π = 180°, so 60° = π/3. Arc length s = rθ: radius 6, θ = π/3 gives s = 2π.
export const alt =
  "A circle with radius 6 and a 60 degree angle, which is π/3 radians. The arc length is s = rθ = 6 · π/3 = 2π. Also 180 degrees = π.";

const P = "v-circles--radians-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 12) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("ring", 6, 14),
  pop("rad", 20),
  pop("wedge", 32),
  draw("arc", 36, 10),
  pop("p1", 22),
  pop("p2", 34),
  pop("p3", 52),
  pop("p4", 66),
  pop("p5", 78),
].join(" ");

const O = { x: 92, y: 96 };
const R = 60;
const pt = (deg: number) => ({ x: f(O.x + R * Math.cos(rad(deg))), y: f(O.y + R * Math.sin(rad(deg))) });
const p0 = pt(0);
const p60 = pt(-60);
const wedge = `M${O.x} ${O.y} L${p0.x} ${p0.y} A${R} ${R} 0 0 0 ${p60.x} ${p60.y} Z`;
const arcPath = `M${p0.x} ${p0.y} A${R} ${R} 0 0 0 ${p60.x} ${p60.y}`;
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={R} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path className={cls("wedge")} d={wedge} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <path className={cls("arc")} d={arcPath} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4} />
        <circle cx={O.x} cy={O.y} r={3.5} fill={C.ink} />
        <text className={cls("p1")} x={f(O.x + 12)} y={f(O.y + 16)} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>r = 6</text>
        <text className={cls("p2")} x={f(O.x + 20)} y={f(O.y - 6)} fontSize={12} fontWeight={700} fill={C.primary} {...lab}>π/3</text>

        <g className={cls("p3")} fill={C.ink} {...lab}>
          <text x={186} y={42} fontSize={13} fontWeight={700}>π rad = 180°</text>
          <text x={186} y={64} fontSize={13} fontWeight={700}>π/3 rad = 60°</text>
        </g>
        <text className={cls("p4")} x={186} y={104} fontSize={12} fill={C.muted} {...lab}>arc length s = rθ</text>
        <g className={cls("p5")} {...lab}>
          <text x={186} y={126} fontSize={14} fontWeight={700} fill={C.ink}>= 6 · π/3</text>
          <text x={186} y={150} fontSize={19} fontWeight={700} fill={C.primary}>= 2π</text>
        </g>
      </g>
    </Svg>
  );
}
