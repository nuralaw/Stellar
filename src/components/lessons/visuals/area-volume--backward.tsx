import { C, Css, Svg } from "./kit";

// A cone with V = 48π and r = 4: (1/3)π · 4² · h = 48π gives h = 9. Drawn r : h = 4 : 9 (11 px per unit).
export const alt =
  "A cone with radius 4 and volume 48π. Put the numbers in 1/3 π r² h = 48π, drop π and multiply by 3: 16h = 144, so the height h is 9.";

const P = "v-area-volume--backward-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("cone", 6),
  pop("rr", 18),
  pop("vol", 22),
  r("q", "0%, 30% { opacity: 1 } 36%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("hh", 70),
  pop("p1", 30),
  pop("p2", 44),
  pop("p3", 58),
].join(" ");

const U = 11;
const cx = 88;
const R = 4 * U; // 44
const Hh = 9 * U; // 99
const yBase = 132;
const yApex = yBase - Hh;
const yLab = yApex + 0.65 * Hh; // label height: the cone is wide enough here
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("cone")}>
          <path d={`M${cx - R} ${yBase} L${cx} ${yApex} L${cx + R} ${yBase} A${R} 12 0 0 1 ${cx - R} ${yBase} Z`} fill={C.fill} stroke={C.ink} strokeWidth={2} />
          <path d={`M${cx - R} ${yBase} A${R} 12 0 0 0 ${cx + R} ${yBase}`} fill="none" stroke={C.ink} strokeWidth={2} />
          <line x1={cx} y1={yApex} x2={cx} y2={yBase} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        </g>
        <g className={cls("rr")}>
          <line x1={cx} y1={yBase} x2={cx + R} y2={yBase} stroke={C.primary} strokeWidth={3} />
          <text x={cx + R / 2} y={yBase + 28} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>r = 4</text>
        </g>
        <text className={cls("vol")} x={cx} y={yApex - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>V = 48π</text>
        <rect x={cx - 16} y={yLab - 9} width={32} height={16} rx={3} fill={C.fill} stroke="none" />
        <text className={cls("q")} x={cx} y={yLab + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted} {...lab}>h = ?</text>
        <text className={cls("hh")} x={cx} y={yLab + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>h = 9</text>

        <text className={cls("p1")} x={150} y={50} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>⅓ · π · 4² · h = 48π</text>
        <g className={cls("p2")} {...lab}>
          <text x={150} y={80} fontSize={11} fill={C.muted}>drop π, multiply by 3</text>
          <text x={150} y={100} fontSize={14} fontWeight={700} fill={C.ink}>16h = 144</text>
        </g>
        <g className={cls("p3")} {...lab}>
          <text x={150} y={128} fontSize={11} fill={C.muted}>divide by 16</text>
          <text x={150} y={152} fontSize={20} fontWeight={700} fill={C.primaryText}>h = 9</text>
        </g>
      </g>
    </Svg>
  );
}
