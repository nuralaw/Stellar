import { C, Css, Svg, Tex } from "./kit";

// A story total is a fixed fee plus a rate times a quantity, compared with a limit; whole answers round the sensible way.
export const alt =
  "A $15 fee and $6 blocks, one per hour, are stacked against a $50 limit. A sixth block would pass the limit and is rejected, so 15 + 6h ≤ 50 gives h ≤ 5.83: round down to 5 hours.";

const P = "v-linear-inequalities--fee-rate-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90) =>
  r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, ${until}% { opacity: 1 } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0 }`, until < 90 ? "opacity: 0;" : "");
/** A block pops in (grows from its middle). */
const pop = (n: string, t: number) =>
  r(n, `0%, ${t}% { opacity: 0; transform: scale(0.6) } ${t + 5}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, "transform-box: fill-box; transform-origin: center;");

const BLOCKS = [12, 20, 28, 36, 44];
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  show("track", 3),
  show("fee", 4),
  show("tagfee", 8),
  show("tagrate", 14),
  ...BLOCKS.map((t, i) => pop(`b${i}`, t)),
  show("c1", 12, 20),
  show("c2", 20, 28),
  show("c3", 28, 36),
  show("c4", 36, 44),
  show("c5", 44),
  // The sixth block: it flashes red at the limit, then bounces away.
  r(
    "b5",
    "0%, 50% { opacity: 0; transform: none } 53%, 56% { opacity: 1; transform: none } 57% { opacity: 0.35 } 59% { opacity: 1 } 61% { opacity: 0.35 } 63% { opacity: 1; transform: none } 67% { opacity: 0.8; transform: translate(10px, -14px) } 71%, 100% { opacity: 0; transform: translate(18px, -26px) }",
    "opacity: 0;",
  ),
  show("ghost", 68),
  show("formula", 54),
  show("answer", 66),
  show("band", 66),
  show("dot", 72),
  show("down", 76),
  show("note", 82),
].join(" ");

const BX = 30; // bar left edge; $1 = 5.2 px, so $50 = 260 px
const U = 5.2;
const BY = 26;
const BH = 26;
const LIM = BX + 50 * U;
const NY = 143;
const hx = (h: number) => BX + h * 32.5;
const feeW = 15 * U;
const bw = 6 * U;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The limit bar */}
      <g className={cls("track")}>
        <rect x={BX} y={BY} width={50 * U} height={BH} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <line x1={LIM} y1={BY - 6} x2={LIM} y2={BY + BH + 6} stroke={C.ink} strokeWidth={2} strokeDasharray="4 3" />
        <text x={LIM} y={BY - 10} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          limit $50
        </text>
      </g>

      {/* The fee: once */}
      <g className={cls("fee")}>
        <rect x={BX} y={BY} width={feeW} height={BH} rx={6} fill={C.line} stroke={C.muted} strokeWidth={1.5} />
        <text x={BX + feeW / 2} y={BY + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          $15
        </text>
      </g>
      <text className={cls("tagfee")} x={BX + feeW / 2} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
        fee (once)
      </text>

      {/* $6 per hour */}
      {BLOCKS.map((_, i) => (
        <g key={i} className={cls(`b${i}`)}>
          <rect x={BX + feeW + i * bw + 1} y={BY + 2} width={bw - 2} height={BH - 4} rx={4} fill={C.primary} />
          <text x={BX + feeW + i * bw + bw / 2} y={BY + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.onPrimary} stroke="none">
            $6
          </text>
        </g>
      ))}
      <text className={cls("tagrate")} x={BX + feeW + 2.5 * bw} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText} stroke="none">
        $6 each hour
      </text>

      {/* The sixth block crosses the limit and is sent away */}
      <g className={cls("b5")}>
        <rect x={BX + feeW + 5 * bw + 1} y={BY + 2} width={bw - 2} height={BH - 4} rx={4} fill={C.badSoft} stroke={C.bad} strokeWidth={2} />
        <text x={BX + feeW + 5 * bw + bw / 2} y={BY + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad} stroke="none">
          $6
        </text>
      </g>
      <g className={cls("ghost")}>
        <rect x={BX + feeW + 5 * bw + 1} y={BY + 2} width={bw - 2} height={BH - 4} rx={4} fill="none" stroke={C.bad} strokeWidth={1.5} strokeDasharray="3 3" />
        <path d={`M${BX + feeW + 5 * bw + 11} ${BY + 9} l10 10 M${BX + feeW + 5 * bw + 21} ${BY + 9} l-10 10`} fill="none" stroke={C.bad} strokeWidth={2} />
      </g>

      {/* The count and the inequality */}
      {[1, 2, 3, 4, 5].map((n) => (
        <g key={n} className={cls(`c${n}`)}>
          <Tex x={BX} y={95} size={20} anchor="start" color={C.primaryText} width={70}>
            {`h=${n}`}
          </Tex>
        </g>
      ))}
      <g className={cls("formula")}>
        <Tex x={128} y={95} size={20} anchor="start" width={170}>
          {String.raw`15+6h\le 50`}
        </Tex>
      </g>

      {/* The answer on a number line: round down */}
      <g className={cls("answer")}>
        <Tex x={BX} y={119} size={18} anchor="start" width={110}>
          {String.raw`h\le 5.83`}
        </Tex>
      </g>
      <g className={cls("band")}>
        <rect x={BX} y={NY - 7} width={hx(5.83) - BX} height={14} rx={7} fill={C.soft} />
        <line x1={BX - 2} y1={NY} x2={hx(8) + 2} y2={NY} stroke={C.muted} strokeWidth={1.5} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
          <g key={h}>
            <line x1={hx(h)} y1={NY - 4} x2={hx(h)} y2={NY + 4} stroke={C.muted} strokeWidth={1.5} />
            <text x={hx(h)} y={NY + 19} textAnchor="middle" fontSize={11} fontWeight={h === 5 ? 700 : 500} fill={h === 5 ? C.ink : C.muted} stroke="none">
              {h}
            </text>
          </g>
        ))}
        <circle cx={hx(5.83)} cy={NY} r={3.5} fill={C.muted} />
      </g>
      <circle className={cls("dot")} cx={hx(5)} cy={NY} r={7} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
      <g className={cls("down")}>
        <path d={`M${hx(5.83)} ${NY - 9} Q${(hx(5.83) + hx(5)) / 2} ${NY - 24} ${hx(5) + 2} ${NY - 11}`} fill="none" stroke={C.good} strokeWidth={2} />
        <path d={`M${hx(5) + 8} ${NY - 17} L${hx(5) + 1} ${NY - 10} L${hx(5) + 9} ${NY - 7}`} fill="none" stroke={C.good} strokeWidth={2} />
        <text x={hx(5.83) + 12} y={NY - 22} fontSize={12} fontWeight={700} fill={C.good} stroke="none">
          round down
        </text>
      </g>
      <text className={cls("note")} x={160} y={176} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
        a goal (at least): round up
      </text>
    </Svg>
  );
}
