import { C, Css, Svg, Tex } from "./kit";

// Weighted mean: A (20 students, mean 70) and B (10 students, mean 85). The plain average 77.5 does not balance the beam;
// the pivot slides toward the bigger group to 75, where 5 : 10 = 10 : 20 and (20 × 70 + 10 × 85) / 30 = 75.
export const alt = "A beam with 20 blocks at 70 (class A) and 10 blocks at 85 (class B). It only balances at 75, not at the plain average 77.5. The combined mean is (20 × 70 + 10 × 85) / 30 = 75.";

const P = "v-one-var-data--weighted-";
const n = (k: string) => P + k;
const cls = (k: string) => `${n("a")} ${n(k)}`;

/** Number line 60..95 across the beam, to scale. */
const X = (v: number) => 24 + (v - 60) * 7.77;
const BEAM = 72;
const PIV = X(77.5);
const SLIDE = X(77.5) - X(75); // 19.4

const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 4%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

.${n("blocks")} { animation-name: ${n("blocks")}; }
@keyframes ${n("blocks")} { 0%, 5% { opacity: 0; transform: translateY(-6px) } 10%, 100% { opacity: 1; transform: none } }
.${n("lab")} { animation-name: ${n("lab")}; }
@keyframes ${n("lab")} { 0%, 10% { opacity: 0 } 15%, 100% { opacity: 1 } }

/* The tempting plain average: a pivot at 77.5 that does not hold */
.${n("rp")} { opacity: 0; animation-name: ${n("rp")}; }
@keyframes ${n("rp")} { 0%, 16% { opacity: 0 } 21%, 38% { opacity: 1 } 41%, 100% { opacity: 0 } }

/* The beam tips toward the heavier group, then levels as the pivot slides to 75 */
.${n("beam")} { transform-box: view-box; transform-origin: ${PIV.toFixed(1)}px ${BEAM}px; animation-name: ${n("beam")}; }
@keyframes ${n("beam")} { 0%, 26% { transform: rotate(0deg) } 32%, 40% { transform: rotate(-4deg) } 52%, 100% { transform: rotate(0deg) } }
.${n("gp")} { animation-name: ${n("gp")}; }
@keyframes ${n("gp")} { 0%, 38% { opacity: 0; transform: translateX(${SLIDE.toFixed(1)}px) } 41% { opacity: 1; transform: translateX(${SLIDE.toFixed(1)}px) } 52%, 100% { opacity: 1; transform: none } }
.${n("gl")} { animation-name: ${n("gl")}; }
@keyframes ${n("gl")} { 0%, 52% { opacity: 0 } 57%, 100% { opacity: 1 } }

.${n("br")} { animation-name: ${n("br")}; }
@keyframes ${n("br")} { 0%, 56% { opacity: 0 } 61%, 100% { opacity: 1 } }
.${n("rt")} { opacity: 0; animation-name: ${n("rt")}; }
@keyframes ${n("rt")} { 0%, 58% { opacity: 0 } 62%, 70% { opacity: 1 } 73%, 100% { opacity: 0 } }
.${n("fm")} { animation-name: ${n("fm")}; }
@keyframes ${n("fm")} { 0%, 72% { opacity: 0 } 77%, 100% { opacity: 1 } }
`;

/** A stack of blocks (2 rows) centered on `v`. */
function Stack({ v, cols, fill }: { v: number; cols: number; fill: string }) {
  const x0 = X(v) - (cols * 8) / 2 + 1;
  return (
    <g fill={fill}>
      {[0, 1].flatMap((r) =>
        Array.from({ length: cols }, (_, c) => <rect key={`${r}-${c}`} x={x0 + c * 8} y={BEAM - 3 - (r + 1) * 8 + 2} width={6.5} height={6.5} rx={1} />),
      )}
    </g>
  );
}

const pivot = (x: number) => `M${x} ${BEAM + 3} l-8 14 h16 z`;
const lab = { fontSize: 11, fontWeight: 600, fill: C.muted, textAnchor: "middle" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("scene")}>
        {/* Group labels */}
        <g className={cls("lab")}>
          <text x={X(70)} y={30} {...lab} fill={C.ink}>
            A: 20 students
          </text>
          <text x={X(70)} y={43} {...lab}>
            mean 70
          </text>
          <text x={X(85)} y={30} {...lab} fill={C.primaryText}>
            B: 10 students
          </text>
          <text x={X(85)} y={43} {...lab}>
            mean 85
          </text>
        </g>

        {/* Beam = number line, with the blocks on it */}
        <g className={cls("beam")}>
          <line x1={18} y1={BEAM} x2={302} y2={BEAM} stroke={C.ink} strokeWidth={3} />
          <g stroke={C.muted} strokeWidth={1.5}>
            {[60, 65, 70, 75, 80, 85, 90, 95].map((v) => (
              <line key={v} x1={X(v)} y1={BEAM + 2} x2={X(v)} y2={BEAM + 6} />
            ))}
          </g>
          <g fontSize={11} fill={C.muted} textAnchor="middle">
            {[60, 70, 80, 90].map((v) => (
              <text key={v} x={X(v)} y={BEAM + 19}>
                {v}
              </text>
            ))}
          </g>
          <g className={cls("blocks")}>
            <Stack v={70} cols={10} fill={C.muted} />
            <Stack v={85} cols={5} fill={C.primary} />
          </g>
        </g>

        {/* The plain average, 77.5: tempting and wrong */}
        <g className={cls("rp")}>
          <path d={pivot(PIV)} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={PIV - 6} y={105} fontSize={13} fontWeight={700} fill={C.bad} textAnchor="middle">
            77.5
          </text>
          <path d={`M${PIV + 11} 98 l8 8 M${PIV + 19} 98 l-8 8`} stroke={C.bad} strokeWidth={2} fill="none" />
          <text x={160} y={152} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
            plain average: treats both as equal
          </text>
        </g>

        {/* The right balance point: 75 */}
        <g className={cls("gp")}>
          <path d={pivot(X(75))} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text className={cls("gl")} x={X(75)} y={105} fontSize={14} fontWeight={700} fill={C.good} textAnchor="middle">
            75
          </text>
        </g>

        {/* Gaps: 5 and 10 */}
        <g className={cls("br")} fill="none" stroke={C.primary} strokeWidth={1.5}>
          <path d={`M${X(70)} 111 v5 H${X(75)} v-5`} />
          <path d={`M${X(75) + 1.5} 111 v5 H${X(85)} v-5`} />
          <g stroke="none" fill={C.primaryText} fontSize={12} fontWeight={700} textAnchor="middle">
            <text x={(X(70) + X(75)) / 2} y={130}>
              5
            </text>
            <text x={(X(75) + X(85)) / 2} y={130}>
              10
            </text>
          </g>
        </g>

        <g className={cls("rt")}>
          <Tex x={160} y={152} size={14} color={C.primaryText}>{String.raw`5:10=10:20`}</Tex>
        </g>
        <g className={cls("fm")}>
          <Tex x={160} y={150} size={13} width={240}>{String.raw`\dfrac{20\times 70+10\times 85}{30}=75`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
