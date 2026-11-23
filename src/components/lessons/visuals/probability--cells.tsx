import { C, Css, Svg, Tex } from "./kit";

// A two-way table of 50 students: a row, a column and one cell are different fractions over the same 50.
export const alt =
  "A table of 50 students by grade and travel. Grade 9 row: 24 of 50. Bus column: 30 of 50. One cell, grade 9 and bus: 18 of 50. A missing cell is a total minus the known cell: 24 − 6 = 18.";

const P = "v-probability--cells-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
// Visible from t0 to t1 only. `still` keeps it in the final (reduced-motion) frame.
const win = (n: string, t0: number, t1: number, still = false) =>
  r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, still ? "" : "opacity: 0;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("corner", 9),
  r(
    "pulse",
    "0%, 8% { opacity: 0; transform: scale(1) } 11% { opacity: 1; transform: scale(1) } 19%, 100% { opacity: 0; transform: scale(1.4) }",
    "opacity: 0; transform-box: fill-box; transform-origin: center;",
  ),
  win("c0", 9, 17),
  win("row", 21, 35),
  win("c1", 21, 35),
  win("col", 40, 54),
  win("c2", 40, 54),
  win("cell", 59, 73, true),
  win("c3", 59, 73, true),
  win("blank", 78, 89),
  win("rowb", 78, 89),
  win("c4", 78, 89),
].join(" ");

// Grid: label column x 20–104, then Car, Bus, Total (64 wide each). Rows: header 14–38, then 24 tall.
const CX = [20, 104, 168, 232];
const CW = [84, 64, 64, 64];
const RY = [14, 38, 62, 86];
const RH = 24;
const mid = (c: number) => CX[c] + CW[c] / 2;
const base = (rr: number) => RY[rr] + 17;
const lab = { stroke: "none" } as const;

const ROWS: [string, number, number, number][] = [
  ["Grade 9", 6, 18, 24],
  ["Grade 10", 14, 12, 26],
  ["Total", 20, 30, 50],
];

/** A fraction typeset from two <Tex> and a bar: the bottom number keeps one colour in every frame. */
function Frac({ x, y, top, bottom, colorTop = C.ink }: { x: number; y: number; top: string; bottom: string; colorTop?: string }) {
  return (
    <g {...lab}>
      <Tex x={x} y={y - 12} size={18} width={50} color={colorTop}>{top}</Tex>
      <line x1={x - 17} y1={y} x2={x + 17} y2={y} stroke={C.ink} strokeWidth={1.8} />
      <Tex x={x} y={y + 13} size={18} width={50} color={C.primaryText}>{bottom}</Tex>
    </g>
  );
}

function Pill({ cx, cy, children, k }: { cx: number; cy: number; children: string; k?: string }) {
  return (
    <g className={k ? cls(k) : undefined}>
      <rect x={cx - 20} y={cy - 10} width={40} height={20} rx={10} fill={C.primary} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.onPrimary} {...lab}>
        {children}
      </text>
    </g>
  );
}

const FX = 232; // the fraction sits in the same place in every frame
const FY = 134;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Highlights sit behind the numbers */}
        <rect className={cls("row")} x={CX[0]} y={RY[1]} width={276} height={RH} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("rowb")} x={CX[0]} y={RY[1]} width={276} height={RH} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("col")} x={CX[2]} y={RY[0]} width={CW[2]} height={96} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("cell")} x={CX[2] + 1} y={RY[1] + 1} width={CW[2] - 2} height={RH - 2} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />

        {/* The table */}
        <g fill="none" stroke={C.line} strokeWidth={1}>
          <rect x={CX[0]} y={RY[0]} width={276} height={96} rx={6} />
          {[1, 2, 3].map((i) => (
            <line key={`h${i}`} x1={CX[0]} y1={RY[i]} x2={296} y2={RY[i]} />
          ))}
          {[1, 2, 3].map((i) => (
            <line key={`v${i}`} x1={CX[i]} y1={RY[0]} x2={CX[i]} y2={110} />
          ))}
        </g>
        <line x1={CX[0]} y1={RY[3]} x2={296} y2={RY[3]} stroke={C.muted} strokeWidth={1.5} />
        <line x1={CX[3]} y1={RY[0]} x2={CX[3]} y2={110} stroke={C.muted} strokeWidth={1.5} />
        <g fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle" {...lab}>
          <text x={mid(1)} y={base(0)}>Car</text>
          <text x={mid(2)} y={base(0)}>Bus</text>
          <text x={mid(3)} y={base(0)}>Total</text>
        </g>
        {ROWS.map(([name, car, bus, tot], i) => (
          <g key={name} fontSize={14} fontWeight={i === 2 ? 700 : 600} fill={C.ink} textAnchor="middle" {...lab}>
            <text x={mid(0)} y={base(i + 1)} fontSize={12} fill={C.muted}>{name}</text>
            <text x={mid(1)} y={base(i + 1)}>{car}</text>
            <text x={mid(2)} y={base(i + 1)}>{bus}</text>
            <text x={mid(3)} y={base(i + 1)} fontWeight={700}>{tot}</text>
          </g>
        ))}

        {/* The whole table: 50 */}
        <rect className={cls("pulse")} x={mid(3) - 20} y={RY[3] + 2} width={40} height={20} rx={10} fill="none" stroke={C.primary} strokeWidth={2} />
        <Pill cx={mid(3)} cy={RY[3] + 12} k="corner">50</Pill>
        {/* The lit numbers */}
        <Pill cx={mid(3)} cy={RY[1] + 12} k="row">24</Pill>
        <Pill cx={mid(2)} cy={RY[3] + 12} k="col">30</Pill>
        <Pill cx={mid(2)} cy={RY[1] + 12} k="cell">18</Pill>
        {/* The blanked cell */}
        <g className={cls("blank")}>
          <rect x={CX[2] + 2} y={RY[1] + 2} width={CW[2] - 4} height={RH - 4} rx={4} fill={C.bg} />
          <text x={mid(2)} y={base(1)} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText} {...lab}>?</text>
        </g>

        {/* The fractions */}
        <g className={cls("c1")}>
          <Tex x={FX - 22} y={FY} size={16} anchor="end" width={200}>{String.raw`P(\text{grade 9})=`}</Tex>
          <Frac x={FX} y={FY} top="24" bottom="50" />
        </g>
        <g className={cls("c2")}>
          <Tex x={FX - 22} y={FY} size={16} anchor="end" width={200}>{String.raw`P(\text{bus})=`}</Tex>
          <Frac x={FX} y={FY} top="30" bottom="50" />
        </g>
        <g className={cls("c3")}>
          <Tex x={FX - 22} y={FY} size={16} anchor="end" width={200}>{String.raw`P(\text{grade 9 and bus})=`}</Tex>
          <Frac x={FX} y={FY} top="18" bottom="50" />
        </g>
        <g className={cls("c4")}>
          <Tex x={160} y={FY} size={20} width={160} color={C.primaryText}>{String.raw`24-6=18`}</Tex>
        </g>

        {/* One short caption per beat */}
        <g fontSize={12} fontWeight={700} fill={C.muted} textAnchor="middle" {...lab}>
          <text className={cls("c0")} x={160} y={163}>whole table</text>
          <text className={cls("row")} x={160} y={163}>a row</text>
          <text className={cls("col")} x={160} y={163}>a column</text>
          <text className={cls("cell")} x={160} y={163}>a cell = both</text>
          <text className={cls("rowb")} x={160} y={163}>every row adds to its total</text>
        </g>
      </g>
    </Svg>
  );
}
