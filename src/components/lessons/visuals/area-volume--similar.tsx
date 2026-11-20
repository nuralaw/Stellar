import { C, Css, Svg } from "./kit";

// Two similar cones, k = 2: every length is doubled (drawn r : h the same in both). Area × k² = 4, volume × k³ = 8.
export const alt =
  "Two similar cones. Every length of the big cone is 2 times the small cone's, so k = 2. Surface area grows by 2² = 4, from 10 to 40. Volume grows by 2³ = 8, from 6 to 48.";

const P = "v-area-volume--similar-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("small", 6),
  pop("big", 18),
  pop("k", 32),
  pop("p1", 44),
  pop("p2", 58),
].join(" ");

const yBase = 140;
/** A cone: radius rr, height hh, base center (cx, yBase). The base ellipse is 0.3 as tall as it is wide. */
const Cone = ({ cx, rr, hh, fill }: { cx: number; rr: number; hh: number; fill: string }) => (
  <>
    <path d={`M${cx - rr} ${yBase} L${cx} ${yBase - hh} L${cx + rr} ${yBase} A${rr} ${rr * 0.3} 0 0 1 ${cx - rr} ${yBase} Z`} fill={fill} stroke={C.ink} strokeWidth={2} />
    <path d={`M${cx - rr} ${yBase} A${rr} ${rr * 0.3} 0 0 0 ${cx + rr} ${yBase}`} fill="none" stroke={C.ink} strokeWidth={2} />
    <line x1={cx} y1={yBase} x2={cx + rr} y2={yBase} stroke={C.primary} strokeWidth={2.5} />
    <line x1={cx} y1={yBase - hh} x2={cx} y2={yBase} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
  </>
);
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("small")}>
          <Cone cx={56} rr={18} hh={36} fill={C.fill} />
          <text x={56} y={yBase + 24} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>small</text>
        </g>
        <g className={cls("big")}>
          <Cone cx={140} rr={36} hh={72} fill={C.soft} />
          <text x={140} y={yBase + 24} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>big</text>
        </g>
        <g className={cls("k")} {...lab}>
          <text x={98} y={44} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>k = 2</text>
          <text x={98} y={60} textAnchor="middle" fontSize={11} fill={C.muted}>every length × 2</text>
        </g>

        <g className={cls("p1")} {...lab}>
          <text x={212} y={52} fontSize={14} fontWeight={700} fill={C.ink}>area × 4</text>
          <text x={212} y={69} fontSize={11} fill={C.muted}>k² = 4 · 10 → 40</text>
        </g>
        <g className={cls("p2")} {...lab}>
          <text x={212} y={106} fontSize={14} fontWeight={700} fill={C.primaryText}>volume × 8</text>
          <text x={212} y={123} fontSize={11} fill={C.muted}>k³ = 8 · 6 → 48</text>
        </g>
      </g>
    </Svg>
  );
}
