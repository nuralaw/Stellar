import { C, Css, Svg } from "./kit";

// A 3-4-5 right triangle (right angle at B). Name the sides from angle A; move the angle to C and opposite/adjacent swap.
export const alt =
  "Right triangle ABC with the right angle at B, legs 4 and 3. From angle A, BC is opposite and AB is adjacent. Move the angle to C and the two names swap. The hypotenuse AC never changes.";

const P = "v-right-triangles-trig--ratios-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

// Triangle: legs AB = 4, BC = 3 (3-4-5), scale 26 per unit. Right angle at B.
const U = 26;
const B = { x: 86, y: 134 };
const A = { x: B.x + 4 * U, y: B.y };
const Cc = { x: B.x, y: B.y - 3 * U };
const angA = (Math.atan(3 / 4) * 180) / Math.PI; // 36.87

/** Pie wedge at (cx, cy) from SVG angle a0 to a1 (degrees, clockwise from +x). */
const wedge = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(cx + r * Math.cos(rad(d)))} ${f(cy + r * Math.sin(rad(d)))}`;
  return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
};

/** A rule + keyframes for one element class: `extra` is extra declarations, `kf` the keyframe steps. */
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  r("tri", "0%, 6% { stroke-dashoffset: 100 } 18%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  r("fadein", "0%, 14% { opacity: 0 } 20%, 100% { opacity: 1 }"),
  r("hyp", "0%, 26% { opacity: 0 } 32%, 100% { opacity: 1 }"),
  // Angle A phase: visible 36% to 56%, then gone (hidden in the still frame)
  r("pa", "0%, 36% { opacity: 0 } 42%, 56% { opacity: 1 } 61%, 100% { opacity: 0 }", "opacity: 0;"),
  r("pa2", "0%, 46% { opacity: 0 } 52%, 56% { opacity: 1 } 61%, 100% { opacity: 0 }", "opacity: 0;"),
  // Angle C phase: appears at 62% and stays (the still frame)
  r("pc", "0%, 62% { opacity: 0 } 68%, 100% { opacity: 1 }"),
  r("pc2", "0%, 70% { opacity: 0 } 76%, 100% { opacity: 1 }"),
].join(" ");

export default function Visual() {
  const mid = { x: (A.x + Cc.x) / 2, y: (A.y + Cc.y) / 2 };
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the triangle: hypotenuse colour is always muted */}
        <path className={cls("tri")} d={`M${B.x} ${B.y} L${A.x} ${A.y} L${Cc.x} ${Cc.y} Z`} pathLength={100} fill="none" stroke={C.muted} strokeWidth={2} />
        <path className={cls("fadein")} d={`M${B.x} ${B.y - 10} h10 v10`} fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* vertex letters */}
        <g fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          <text x={B.x - 12} y={B.y + 14}>B</text>
          <text x={A.x + 8} y={A.y + 14}>A</text>
          <text x={Cc.x - 6} y={Cc.y - 8} textAnchor="middle">C</text>
        </g>

        {/* hypotenuse: faces the right angle */}
        <text className={cls("hyp")} x={f(mid.x + 12)} y={f(mid.y - 16)} fontSize={12} fontWeight={600} fill={C.muted}>
          hypotenuse
        </text>

        {/* ---- angle A phase ---- */}
        <g className={cls("pa")}>
          <path d={wedge(A.x, A.y, 24, 180, 180 + angA)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <line x1={B.x} y1={B.y} x2={Cc.x} y2={Cc.y} stroke={C.primary} strokeWidth={4} />
          <text x={B.x - 8} y={f((B.y + Cc.y) / 2 + 4)} textAnchor="end" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
            opposite
          </text>
        </g>
        <g className={cls("pa2")}>
          <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} stroke={C.ink} strokeWidth={4} />
          <text x={f((B.x + A.x) / 2)} y={B.y + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            adjacent
          </text>
        </g>
        <g className={cls("pa")}>
          <text x={232} y={62} fontSize={12} fill={C.muted} stroke="none">
            from angle
          </text>
          <text x={232} y={90} fontSize={26} fontWeight={700} fill={C.primaryText} stroke="none">
            A
          </text>
        </g>

        {/* ---- angle C phase (still frame) ---- */}
        <g className={cls("pc")}>
          <path d={wedge(Cc.x, Cc.y, 24, f(angA), 90)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} stroke={C.primary} strokeWidth={4} />
          <text x={f((B.x + A.x) / 2)} y={B.y + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
            opposite
          </text>
          <text x={232} y={62} fontSize={12} fill={C.muted} stroke="none">
            from angle
          </text>
          <text x={232} y={90} fontSize={26} fontWeight={700} fill={C.primaryText} stroke="none">
            C
          </text>
        </g>
        <g className={cls("pc2")}>
          <line x1={B.x} y1={B.y} x2={Cc.x} y2={Cc.y} stroke={C.ink} strokeWidth={4} />
          <text x={B.x - 8} y={f((B.y + Cc.y) / 2 + 4)} textAnchor="end" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            adjacent
          </text>
          <text x={232} y={118} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
            names swap
          </text>
        </g>
      </g>
    </Svg>
  );
}
