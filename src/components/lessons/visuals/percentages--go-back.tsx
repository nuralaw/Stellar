import { C, Css, Svg, Tex } from "./kit";

// Go back: after -10% the price is $72. Divide by the multiplier (72 / 0.9 = 80). Taking 10% of 72 is the wrong move.
export const alt = "A price drops 10% to $72, which is 90% of the old price. Taking 10% of 72 is wrong. Nine blocks of $8 make the $72, a tenth block restores the old price: 72 divided by 0.9 is $80.";

const P = "v-percentages--go-back-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
// Visible only between two moments; hidden in the still frame.
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
${at("old", 2)}
${at("arrow", 10)}
${win("plain", 16, 40)}
${win("wrong", 24, 38)}
${at("blocks", 42)}
.${n("tenth")} { transform-box: fill-box; transform-origin: center; animation-name: ${n("tenth")}; }
@keyframes ${n("tenth")} { 0%, 54% { opacity: 0; transform: scale(0.4) } 62%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }
${win("q", 2, 58)}
${at("old80", 62)}
${at("eq", 64)}
${at("chk", 78)}
`;

const X0 = 40;
const U = 24; // one block = $8 = 10% of the old price
const OLD_Y = 28;
const NOW_Y = 78;
const BH = 22;
const nine = Array.from({ length: 9 }, (_, i) => i);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The old price: 100% */}
      <g className={cls("old")}>
        <rect x={X0} y={OLD_Y} width={10 * U} height={BH} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      </g>
      <text className={cls("q")} x={X0 + 5 * U} y={OLD_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
        old = ?
      </text>
      <text className={cls("old80")} x={X0 + 5 * U} y={OLD_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.good}>
        old = $80
      </text>

      {/* The drop */}
      <g className={cls("arrow")}>
        <path d={`M${X0 + 14} ${OLD_Y + BH + 6} V${NOW_Y - 8} M${X0 + 9} ${NOW_Y - 14} L${X0 + 14} ${NOW_Y - 8} L${X0 + 19} ${NOW_Y - 14}`} fill="none" stroke={C.ink} strokeWidth={2} />
        <text x={X0 + 28} y={(OLD_Y + BH + NOW_Y) / 2 + 4} fontSize={13} fontWeight={700} fill={C.ink}>
          −10%
        </text>
      </g>

      {/* The new price as one piece */}
      <g className={cls("plain")}>
        <rect x={X0} y={NOW_Y} width={9 * U} height={BH} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <text x={X0 + 4.5 * U} y={NOW_Y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          now $72
        </text>
      </g>

      {/* Nine blocks of $8, then the tenth */}
      <g className={cls("blocks")}>
        {nine.map((i) => (
          <g key={i}>
            <rect x={X0 + i * U} y={NOW_Y} width={U} height={BH} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
            <text x={X0 + i * U + U / 2} y={NOW_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
              $8
            </text>
          </g>
        ))}
        <text x={X0 + 4.5 * U} y={NOW_Y + BH + 15} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
          now $72
        </text>
      </g>
      <g className={cls("tenth")}>
        <rect x={X0 + 9 * U} y={NOW_Y} width={U} height={BH} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={X0 + 9.5 * U} y={NOW_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.good}>
          $8
        </text>
      </g>

      {/* The wrong move */}
      <g className={cls("wrong")}>
        <Tex x={160} y={134} size={14} width={220} color={C.bad}>{String.raw`10\%\text{ of }72=7.2,\ \text{so }79.2`}</Tex>
        <line x1={64} y1={144} x2={256} y2={124} stroke={C.bad} strokeWidth={2.5} />
        <text x={160} y={160} textAnchor="middle" fontSize={12} fill={C.muted}>
          the 10% was taken from the old price
        </text>
      </g>

      {/* The right move */}
      <g className={cls("eq")}>
        <Tex x={X0} y={140} size={15} anchor="start" width={150} color={C.good}>{String.raw`\text{old}=\dfrac{72}{0.9}=80`}</Tex>
      </g>
      <g className={cls("chk")}>
        <Tex x={X0 + 10 * U} y={140} size={13} anchor="end" width={100} color={C.muted}>{String.raw`80\times0.9=72`}</Tex>
      </g>
    </Svg>
  );
}
