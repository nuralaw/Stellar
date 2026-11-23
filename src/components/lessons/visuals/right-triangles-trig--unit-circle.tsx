import { C, Css, Svg, Tex } from "./kit";

// Unit circle (radius 64 px = 1). The angle π/6 = 30°: the point is (cos 30°, sin 30°) = (√3/2, 1/2).
export const alt =
  "A unit circle with an angle of π/6 radians, which is 30 degrees. The point on the circle is (√3/2, 1/2): cosine is the across distance, sine is the up distance.";

const P = "v-right-triangles-trig--unit-circle-";
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
  draw("ring", 6, 16),
  draw("rad", 24, 10),
  pop("arc", 30),
  draw("cos", 42, 10),
  draw("sin", 52, 10),
  pop("p0", 24),
  pop("p1", 38),
  pop("p2", 48),
  pop("p3", 62),
  pop("p4", 74),
].join(" ");

const O = { x: 84, y: 96 };
const R = 64;
const th = 30;
const Pt = { x: f(O.x + R * Math.cos(rad(th))), y: f(O.y - R * Math.sin(rad(th))) };
const Ft = { x: Pt.x, y: O.y };
const arc = `M${O.x + 24} ${O.y} A24 24 0 0 0 ${f(O.x + 24 * Math.cos(rad(th)))} ${f(O.y - 24 * Math.sin(rad(th)))}`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* axes */}
        <g stroke={C.line} strokeWidth={1.5}>
          <line x1={O.x - R - 10} y1={O.y} x2={O.x + R + 12} y2={O.y} />
          <line x1={O.x} y1={O.y + R + 10} x2={O.x} y2={O.y - R - 12} />
        </g>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={R} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <text x={O.x + R + 3} y={O.y + 14} fontSize={11} fill={C.muted} stroke="none">1</text>

        {/* the angle and its right triangle */}
        <line className={cls("rad")} x1={O.x} y1={O.y} x2={Pt.x} y2={Pt.y} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
        <path className={cls("arc")} d={arc} fill="none" stroke={C.primary} strokeWidth={1.5} />
        <line className={cls("cos")} x1={O.x} y1={O.y} x2={Ft.x} y2={Ft.y} pathLength={100} stroke={C.ink} strokeWidth={3.5} />
        <line className={cls("sin")} x1={Ft.x} y1={Ft.y} x2={Pt.x} y2={Pt.y} pathLength={100} stroke={C.muted} strokeWidth={3.5} />
        <circle cx={Pt.x} cy={Pt.y} r={4} fill={C.primary} />
        <g className={cls("p1")}>
          <Tex x={f(Pt.x + 8)} y={f(Pt.y - 10)} size={12} anchor="start" width={70}>{String.raw`\left(\dfrac{\sqrt{3}}{2},\dfrac{1}{2}\right)`}</Tex>
        </g>

        {/* the table of values */}
        <g className={cls("p0")}>
          <Tex x={216} y={34} size={13} anchor="start" width={98}>{String.raw`\pi\text{ rad}=180^\circ`}</Tex>
        </g>
        <g className={cls("p1")}>
          <Tex x={216} y={54} size={13} anchor="start" width={98}>{String.raw`\pi/6\text{ rad}=30^\circ`}</Tex>
        </g>
        <g className={cls("p2")}>
          <Tex x={216} y={88} size={14} anchor="start" width={80}>{String.raw`\cos=\dfrac{\sqrt{3}}{2}`}</Tex>
          <text x={216} y={115} fontSize={11} fill={C.muted} stroke="none">across</text>
        </g>
        <g className={cls("p3")}>
          <Tex x={216} y={138} size={14} anchor="start" width={80} color={C.muted}>{String.raw`\sin=\dfrac{1}{2}`}</Tex>
          <text x={216} y={162} fontSize={11} fill={C.muted} stroke="none">up</text>
        </g>
        <g className={cls("p4")}>
          <Tex x={f(O.x + 33)} y={f(O.y - 8)} size={12} width={30} color={C.primaryText}>{String.raw`\pi/6`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
