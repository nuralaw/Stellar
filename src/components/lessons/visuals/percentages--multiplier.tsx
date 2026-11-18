import { C, Css, Svg } from "./kit";

// One multiplier: 100% plus 20% is 120% (× 1.2). 100% minus 20% is 80% (× 0.8).
export const alt = "A bar for 100% gets a 20% piece added to make 120%, so up 20% is × 1.2. A second bar of 100% loses a 20% piece to leave 80%, so down 20% is × 0.8.";

const P = "v-percentages--multiplier-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const K = 1.7; // px per percent
const X0 = 40;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("r1", 2)}
.${n("add")} { animation-name: ${n("add")}; }
@keyframes ${n("add")} { 0%, 14% { opacity: 0; transform: translateX(24px) } 22%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }
${at("m1", 26)}
${at("r2", 44)}
${at("cut", 54)}
${at("m2", 68)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Up 20% */}
      <g className={cls("r1")}>
        <rect x={X0} y={38} width={100 * K} height={30} rx={4} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={X0 + 50 * K} y={58} fontSize={14} fontWeight={700} fill={C.ink} textAnchor="middle">
          100%
        </text>
      </g>
      <g className={cls("add")}>
        <rect x={X0 + 100 * K} y={38} width={20 * K} height={30} rx={4} fill={C.primary} />
        <text x={X0 + 110 * K} y={58} fontSize={11} fontWeight={700} fill={C.bg} textAnchor="middle">
          +20%
        </text>
      </g>
      <text className={cls("m1")} x={278} y={60} fontSize={18} fontWeight={700} fill={C.primary} textAnchor="middle">
        × 1.2
      </text>

      {/* Down 20% */}
      <g className={cls("r2")}>
        <rect x={X0} y={102} width={80 * K} height={30} rx={4} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={X0 + 40 * K} y={122} fontSize={14} fontWeight={700} fill={C.ink} textAnchor="middle">
          80%
        </text>
      </g>
      <g className={cls("cut")}>
        <rect x={X0 + 80 * K} y={102} width={20 * K} height={30} rx={4} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={X0 + 90 * K} y={122} fontSize={11} fontWeight={700} fill={C.bad} textAnchor="middle">
          −20%
        </text>
      </g>
      <text className={cls("m2")} x={278} y={124} fontSize={18} fontWeight={700} fill={C.primary} textAnchor="middle">
        × 0.8
      </text>

      <text x={160} y={158} fontSize={12} fill={C.muted} textAnchor="middle">
        old amount = 100%
      </text>
    </Svg>
  );
}
