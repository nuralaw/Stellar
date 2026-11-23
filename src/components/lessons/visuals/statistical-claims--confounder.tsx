import { C, Css, Svg } from "./kit";

// A third factor (exercise) linked to both vitamins and colds can fake a cause; random assignment balances it, so the arrow can be trusted.
export const alt = "Vitamins and fewer colds are joined by an arrow with a question mark; exercise is linked to both. Random assignment gives two groups the same mix of exercisers, so the vitamin arrow becomes solid.";

const P = "v-statistical-claims--confounder-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

// 16 people: filled = exercises, empty = does not. A coin flip sends 8 to each group; each group ends with 4 and 4.
const FILLED = new Set([0, 3, 4, 6, 1, 7, 10, 13]);
const LSLOT = [0, 9, 3, 11, 4, 12, 6, 14]; // left group slot order: F E F E F E F E
const RSLOT = [2, 1, 5, 7, 8, 10, 15, 13]; // right group slot order: E F E F E F E F
const poolX = (k: number) => 70 + 12 * k;
const GY = 130;
const slotX = (side: "L" | "R", s: number) => (side === "L" ? 34 : 194) + 14 * s;
const PEOPLE = [
  ...LSLOT.map((k, s) => ({ k, fx: slotX("L", s) })),
  ...RSLOT.map((k, s) => ({ k, fx: slotX("R", s) })),
];

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("boxes", 1)}
.${n("q")} { opacity: 0; animation-name: ${n("q")}; }
@keyframes ${n("q")} { 0%, 5% { opacity: 0 } 9%, 36% { opacity: 1 } 42%, 76% { opacity: 0.25 } 82%, 100% { opacity: 0 } }
${at("solid", 82)}
.${n("conf")} { opacity: 0.3; animation-name: ${n("conf")}; }
@keyframes ${n("conf")} { 0%, 14% { opacity: 0 } 18%, 76% { opacity: 1 } 84%, 92% { opacity: 0.3 } 97%, 100% { opacity: 0 } }
${win("c1", 22, 36)}
${win("c2", 40, 54)}
${at("c3", 70)}
${at("rects", 58)}
${at("coin", 58)}
${PEOPLE.map(
  (p, i) => `.${n(`p${i}`)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(`p${i}`)}; }
@keyframes ${n(`p${i}`)} { 0%, ${48 + i * 0.4}% { opacity: 0; transform: translateX(${poolX(p.k) - p.fx}px) scale(0.5) } ${52 + i * 0.4}%, 58% { opacity: 1; transform: translateX(${poolX(p.k) - p.fx}px) } 70%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`,
).join("\n")}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The question: do vitamins cause fewer colds? */}
      <g className={cls("boxes")}>
        <rect x={22} y={62} width={100} height={24} rx={6} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={72} y={78} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          takes vitamins
        </text>
        <rect x={208} y={62} width={90} height={24} rx={6} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={253} y={78} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          fewer colds
        </text>
      </g>
      <g className={cls("q")} fill="none" stroke={C.muted} strokeWidth={2}>
        <path d="M126 74 H204 M198 69 L204 74 L198 79" />
        <text x={165} y={66} fontSize={13} fontWeight={700} fill={C.muted} stroke="none" textAnchor="middle">
          ?
        </text>
      </g>
      <path className={cls("solid")} d="M126 74 H204 M198 69 L204 74 L198 79" fill="none" stroke={C.good} strokeWidth={3} />

      {/* The third factor, linked to both */}
      <g className={cls("conf")}>
        <rect x={90} y={16} width={140} height={22} rx={6} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
        <text x={160} y={31} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          exercise (confounder)
        </text>
        <path d="M125 39 L76 59 M81 52 L76 59 L84 60" fill="none" stroke={C.bad} strokeWidth={2} />
        <path d="M195 39 L248 59 M243 52 L248 59 L240 60" fill="none" stroke={C.bad} strokeWidth={2} />
      </g>

      <text className={cls("c1")} x={160} y={106} fontSize={12} fontWeight={700} fill={C.bad} textAnchor="middle">
        linked to both
      </text>
      <text className={cls("c2")} x={160} y={106} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
        may be exercise, not vitamins
      </text>
      <text className={cls("c3")} x={160} y={106} fontSize={12} fontWeight={700} fill={C.good} textAnchor="middle">
        random assignment: groups start alike
      </text>

      {/* Random assignment: a coin flip, two groups with the same mix */}
      <g className={cls("rects")}>
        <rect x={20} y={116} width={120} height={28} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <rect x={180} y={116} width={120} height={28} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <text x={80} y={160} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
          vitamins
        </text>
        <text x={240} y={160} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
          no vitamins
        </text>
      </g>
      <g className={cls("coin")}>
        <circle cx={160} cy={GY} r={9} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <circle cx={160} cy={GY} r={4.5} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      {PEOPLE.map((p, i) => (
        <circle
          key={i}
          className={cls(`p${i}`)}
          cx={p.fx}
          cy={GY}
          r={4.5}
          fill={FILLED.has(p.k) ? C.primary : C.bg}
          stroke={FILLED.has(p.k) ? C.primary : C.muted}
          strokeWidth={1.5}
        />
      ))}
    </Svg>
  );
}
