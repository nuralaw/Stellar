import { C, Css, Svg, Tex } from "./kit";

// The five volume formulas on the SAT reference sheet. Surface area is not on the sheet.
export const alt =
  "The five volume formulas on the SAT reference sheet: box lwh, cylinder πr²h, sphere 4/3 πr³, cone 1/3 πr²h and pyramid 1/3 lwh. Surface area formulas are not on the sheet.";

const P = "v-area-volume--sheet-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 7}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("s1", 6),
  pop("s2", 20),
  pop("s3", 34),
  pop("s4", 48),
  pop("s5", 62),
  pop("note", 78),
].join(" ");

const XS = [42, 101, 160, 219, 278];
const sk = { fill: C.fill, stroke: C.ink, strokeWidth: 1.8 } as const;
const soft = { fill: C.soft, stroke: C.ink, strokeWidth: 1.8 } as const;
const dash = { fill: "none", stroke: C.muted, strokeWidth: 1.2, strokeDasharray: "3 3" } as const;

const Cap = ({ cx, f, name }: { cx: number; f: string; name: string }) => (
  <>
    <Tex x={cx} y={107} size={14} width={58}>
      {f}
    </Tex>
    <text x={cx} y={134} textAnchor="middle" fontSize={11} fill={C.muted} stroke="none">
      {name}
    </text>
  </>
);

export default function Visual() {
  const [x1, x2, x3, x4, x5] = XS;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* box */}
        <g className={cls("s1")}>
          <polygon points={`${x1 - 20},50 ${x1 - 8},40 ${x1 + 26},40 ${x1 + 14},50`} {...soft} />
          <rect x={x1 - 20} y={50} width={34} height={30} {...sk} />
          <polygon points={`${x1 + 14},50 ${x1 + 26},40 ${x1 + 26},70 ${x1 + 14},80`} {...sk} />
          <Cap cx={x1} f={String.raw`lwh`} name="box" />
        </g>
        {/* cylinder */}
        <g className={cls("s2")}>
          <path d={`M${x2 - 18} 44 V76 A18 6 0 0 0 ${x2 + 18} 76 V44`} {...sk} />
          <ellipse cx={x2} cy={44} rx={18} ry={6} {...soft} />
          <Cap cx={x2} f={String.raw`\pi r^2h`} name="cylinder" />
        </g>
        {/* sphere */}
        <g className={cls("s3")}>
          <circle cx={x3} cy={60} r={24} {...sk} />
          <path d={`M${x3 - 24} 60 A24 7 0 0 0 ${x3 + 24} 60`} fill="none" stroke={C.ink} strokeWidth={1.2} />
          <path d={`M${x3 - 24} 60 A24 7 0 0 1 ${x3 + 24} 60`} {...dash} />
          <Cap cx={x3} f={String.raw`\dfrac{4}{3}\pi r^3`} name="sphere" />
        </g>
        {/* cone */}
        <g className={cls("s4")}>
          <path d={`M${x4 - 20} 78 L${x4} 32 L${x4 + 20} 78 A20 6 0 0 1 ${x4 - 20} 78`} {...sk} />
          <path d={`M${x4 - 20} 78 A20 6 0 0 0 ${x4 + 20} 78`} fill="none" stroke={C.ink} strokeWidth={1.8} />
          <Cap cx={x4} f={String.raw`\dfrac{1}{3}\pi r^2h`} name="cone" />
        </g>
        {/* pyramid */}
        <g className={cls("s5")}>
          <polygon points={`${x5 - 22},78 ${x5 + 12},78 ${x5 + 22},68 ${x5 - 12},68`} {...soft} />
          <polyline points={`${x5 - 22},78 ${x5},30 ${x5 + 12},78`} {...sk} fill="none" />
          <line x1={x5} y1={30} x2={x5 + 22} y2={68} stroke={C.ink} strokeWidth={1.8} />
          <line x1={x5} y1={30} x2={x5 - 12} y2={68} {...dash} />
          <Cap cx={x5} f={String.raw`\dfrac{1}{3}lwh`} name="pyramid" />
        </g>

        <text className={cls("note")} x={160} y={158} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          No surface-area formulas on the sheet
        </text>
      </g>
    </Svg>
  );
}
