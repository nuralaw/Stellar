import { C, Css, Svg, Tex } from "./kit";

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

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={R} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path className={cls("wedge")} d={wedge} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <path className={cls("arc")} d={arcPath} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4} />
        <circle cx={O.x} cy={O.y} r={3.5} fill={C.ink} />
        <g className={cls("p1")}>
          <Tex x={f(O.x + 12)} y={f(O.y + 12)} size={13} anchor="start" width={50}>{String.raw`r=6`}</Tex>
        </g>
        <g className={cls("p2")}>
          <Tex x={f(O.x + 20)} y={f(O.y - 10)} size={13} anchor="start" width={40} color={C.primaryText}>{String.raw`\pi/3`}</Tex>
        </g>

        <g className={cls("p3")}>
          <Tex x={186} y={38} size={14} anchor="start" width={126}>{String.raw`\pi\text{ rad}=180^\circ`}</Tex>
          <Tex x={186} y={58} size={14} anchor="start" width={126}>{String.raw`\pi/3\text{ rad}=60^\circ`}</Tex>
        </g>
        <g className={cls("p4")}>
          <Tex x={186} y={94} size={13} anchor="start" width={126} color={C.muted}>{String.raw`\text{arc length }s=r\theta`}</Tex>
        </g>
        <g className={cls("p5")}>
          <Tex x={186} y={122} size={15} anchor="start" width={126}>{String.raw`{=}6\cdot\dfrac{\pi}{3}`}</Tex>
          <Tex x={186} y={152} size={19} anchor="start" width={126} color={C.primaryText}>{String.raw`{=}2\pi`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
