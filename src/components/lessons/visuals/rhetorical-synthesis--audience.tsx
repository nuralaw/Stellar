import { C, Css, Svg } from "./kit";

// Audience: a reader who does not know the topic needs a few words saying what it is; a reader who knows it does not.
export const alt =
  "One sentence, two readers. For the reader unfamiliar with the theremin a chip saying an electronic instrument snaps in; for the reader who already knows it, the chip is not needed.";

const P = "v-rhetorical-synthesis--audience-";
const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const rise = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);

const css = `
${rule("a", "animation: 10s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${rise("row0", 6)}
${rise("row1", 12)}
${kf("chip", `0%, 22% { opacity: 0; transform: translateY(-12px) } 28%, 100% { opacity: 1; transform: none }`)}
${kf("q", `0%, 30% { opacity: 1 } 34%, 100% { opacity: 0 }`)}
${fade("ok0", 30)}
${kf("ghost", `0%, 44% { opacity: 0; transform: translateY(-12px) } 50%, 54% { opacity: 1; transform: translateY(-3px) } 56% { transform: translate(-4px, -3px) } 58% { transform: translate(4px, -3px) } 60%, 100% { opacity: 1; transform: none }`)}
${fade("noNeed", 60)}
${fade("ok1", 66)}
`;

const A = "a";
const ROWS = [14, 88];

/** A flat reader: a head and shoulders. */
function Reader({ y }: { y: number }) {
  return (
    <g fill={C.muted}>
      <circle cx={24} cy={y + 8} r={5} />
      <path d={`M15 ${y + 22} Q15 ${y + 14} 24 ${y + 14} Q33 ${y + 14} 33 ${y + 22} Z`} />
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls(A, "scene")}>
        {ROWS.map((y, i) => (
          <g key={y} className={cls(A, `row${i}`)}>
            <Reader y={y} />
            <text x={42} y={y + 18} fontSize={12} fontWeight={700} fill={C.ink}>
              {i === 0 ? "unfamiliar" : "already knows"}
            </text>
            <rect x={16} y={y + 26} width={288} height={44} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            <text x={28} y={y + 63} fontSize={12} fontWeight={600} fill={C.ink}>
              The <tspan fill={C.ink}>theremin</tspan> is played without touching it.
            </text>
          </g>
        ))}

        {/* Reader 1: the question marks turn into a tick once the chip is in */}
        <g className={cls(A, "row0")}>
          <text className={cls(A, "q")} x={134} y={ROWS[0] + 18} fontSize={14} fontWeight={700} fill={C.muted} opacity={0}>
            ? ?
          </text>
          <g className={cls(A, "ok0")}>
            <text x={134} y={ROWS[0] + 18} fontSize={14} fontWeight={700} fill={C.good}>
              ✓
            </text>
          </g>
        </g>
        <g className={cls(A, "chip")}>
          <rect x={28} y={ROWS[0] + 30} width={160} height={18} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={108} y={ROWS[0] + 43} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            an electronic instrument
          </text>
        </g>

        {/* Reader 2: the same chip is not needed */}
        <g className={cls(A, "ghost")}>
          <rect x={28} y={ROWS[1] + 30} width={160} height={18} rx={9} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={108} y={ROWS[1] + 43} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
            an electronic instrument
          </text>
        </g>
        <g className={cls(A, "noNeed")}>
          <text x={196} y={ROWS[1] + 43} fontSize={12} fontWeight={700} fill={C.muted}>
            no need
          </text>
        </g>
        <g className={cls(A, "ok1")}>
          <text x={144} y={ROWS[1] + 18} fontSize={14} fontWeight={700} fill={C.good}>
            ✓
          </text>
        </g>
      </g>
    </Svg>
  );
}
