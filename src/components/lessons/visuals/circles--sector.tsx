import { C, Css, Svg, Tex } from "./kit";

// A 72° sector is 72/360 = 1/5 of a circle with radius 10: arc = 1/5 × 20π = 4π, area = 1/5 × 100π = 20π.
export const alt =
  "A circle split into five equal parts of 72 degrees each. One part is shaded: its arc is 1/5 of the circumference, 4π, and its area is 1/5 of the circle, 20π, for radius 10.";

const P = "v-circles--sector-";
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
  pop("cuts", 22),
  pop("wedge", 36),
  draw("arc", 40, 10),
  pop("p1", 36),
  pop("p2", 50),
  pop("p3", 64),
].join(" ");

const O = { x: 96, y: 96 };
const R = 60;
const pt = (deg: number, rr = R) => ({ x: f(O.x + rr * Math.cos(rad(deg))), y: f(O.y + rr * Math.sin(rad(deg))) });
// The shaded sector spans SVG angles −72° .. 0° (counterclockwise from the right).
const p0 = pt(0);
const p72 = pt(-72);
const wedge = `M${O.x} ${O.y} L${p0.x} ${p0.y} A${R} ${R} 0 0 0 ${p72.x} ${p72.y} Z`;
const arcPath = `M${p0.x} ${p0.y} A${R} ${R} 0 0 0 ${p72.x} ${p72.y}`;
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={R} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        {/* five equal cuts of 72° */}
        <g className={cls("cuts")} stroke={C.muted} strokeWidth={1}>
          {[0, 72, 144, 216, 288].map((dg) => (
            <line key={dg} x1={O.x} y1={O.y} x2={pt(dg).x} y2={pt(dg).y} />
          ))}
        </g>
        <path className={cls("wedge")} d={wedge} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <path className={cls("arc")} d={arcPath} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4} />
        <circle cx={O.x} cy={O.y} r={3.5} fill={C.ink} />
        <g className={cls("p1")}>
          <Tex x={f(O.x + 14)} y={f(O.y + 12)} size={12} anchor="start" width={50}>{String.raw`r=10`}</Tex>
        </g>
        <text className={cls("p1")} x={f(O.x + 22)} y={f(O.y - 8)} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>72°</text>

        <g className={cls("p1")}>
          <Tex x={182} y={34} size={14} anchor="start" width={120}>{String.raw`\dfrac{72}{360}=\dfrac{1}{5}`}</Tex>
        </g>
        <g className={cls("p2")}>
          <Tex x={182} y={64} size={12} anchor="start" width={130} color={C.muted}>{String.raw`\text{circle: }2\pi\cdot10=20\pi`}</Tex>
          <Tex x={182} y={88} size={14} anchor="start" width={130} color={C.primaryText}>{String.raw`\dfrac{1}{5}\times20\pi=4\pi`}</Tex>
        </g>
        <g className={cls("p3")}>
          <Tex x={182} y={118} size={12} anchor="start" width={130} color={C.muted}>{String.raw`\text{area: }\pi\cdot10^2=100\pi`}</Tex>
          <Tex x={182} y={146} size={14} anchor="start" width={130}>{String.raw`\dfrac{1}{5}\times100\pi=20\pi`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
