import { C, Css, Svg, Tex } from "./kit";

// A total is a one-time fee plus rate times units: 8 + 5h = 33. When the fee covers the first 2 hours, only the hours after
// them pay the rate: 12 + 4(h - 2).
export const alt =
  "A bar built from a one-time $8 fee and five $5 hours: 8 + 5h = 33, so h = 5. Below, a $12 fee covers the first 2 hours and only later hours cost $4 each: 12 + 4(h − 2).";

const P = "v-linear-equations-one-var--fee-rate-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const drop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0; transform: translateY(-8px) } ${t + 4}%, 100% { opacity: 1; transform: none }`);
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 }`);
const gone = (n: string, t: number, t2: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 3}%, ${t2}% { opacity: 1 } ${t2 + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  drop("fee", 5),
  pop("feeL", 9),
  ...[1, 2, 3, 4, 5].map((i) => drop(`h${i}`, 12 + i * 4.5)),
  pop("brk", 38),
  pop("f1", 43),
  pop("h5", 49),
  drop("g", 56),
  gone("gg", 56, 61),
  drop("fold", 62),
  ...[1, 2, 3].map((i) => drop(`k${i}`, 64 + i * 4)),
  pop("f2", 78),
  pop("chk", 85),
].join("\n");

const U = 34; // one hour is 34 units wide
const FEE = 54;
const X0 = 24;
const blockH = 26;
const Block = ({ x, y, w, fill, stroke, label, ink, c, dash }: { x: number; y: number; w: number; fill: string; stroke: string; label: string; ink: string; c: string; dash?: boolean }) => (
  <g className={cls(c)}>
    <rect x={x + 1} y={y} width={w - 2} height={blockH} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={dash ? "4 3" : undefined} />
    <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill={ink} stroke="none">
      {label}
    </text>
  </g>
);

const Y1 = 8;
const Y2 = 102;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Row 1: fee once, then one $5 block per hour */}
        <Block x={X0} y={Y1} w={FEE} fill={C.fill} stroke={C.muted} label="$8" ink={C.ink} c="fee" />
        <text className={cls("feeL")} x={X0 + FEE / 2} y={Y1 + 48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
          fee (once)
        </text>
        {[1, 2, 3, 4, 5].map((i) => (
          <Block key={i} x={X0 + FEE + (i - 1) * U} y={Y1} w={U} fill={C.soft} stroke={C.primary} label="$5" ink={C.primaryText} c={`h${i}`} />
        ))}
        <g className={cls("brk")}>
          <path d={`M${X0 + FEE + 6} ${Y1 + 33} v4 H${X0 + FEE - 2 + 5 * U} v-4`} fill="none" stroke={C.primary} strokeWidth={1.5} />
          <text x={X0 + FEE + 2.5 * U + 2} y={Y1 + 48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText} stroke="none">
            rate (each hour)
          </text>
        </g>
        <g className={cls("h5")}>
          <rect x={256} y={Y1} width={48} height={blockH} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={280} y={Y1 + 13} size={16} width={46} color={C.good}>
            {String.raw`h=5`}
          </Tex>
        </g>
        <g className={cls("f1")}>
          <Tex x={160} y={78} size={20} width={140} color={C.ink}>
            {String.raw`8+5h=33`}
          </Tex>
        </g>

        {/* Row 2: the fee covers the first 2 hours; only later hours pay the rate */}
        <g className={cls("gg")}>
          <Block x={X0} y={Y2} w={U} fill={C.fill} stroke={C.line} label="1" ink={C.muted} c="g" dash />
          <Block x={X0 + U} y={Y2} w={U} fill={C.fill} stroke={C.line} label="2" ink={C.muted} c="g" dash />
        </g>
        <Block x={X0} y={Y2} w={2 * U} fill={C.fill} stroke={C.muted} label="$12" ink={C.ink} c="fold" />
        <text className={cls("fold")} x={X0 + U} y={Y2 + 42} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
          first 2 hours
        </text>
        {[1, 2, 3].map((i) => (
          <Block key={i} x={X0 + 2 * U + (i - 1) * U} y={Y2} w={U} fill={C.soft} stroke={C.primary} label="$4" ink={C.primaryText} c={`k${i}`} />
        ))}
        <g className={cls("f2")}>
          <Tex x={206} y={Y2 + 13} size={15} anchor="start" width={100} color={C.ink}>
            {String.raw`12+4(h-2)`}
          </Tex>
        </g>
        <g className={cls("chk")}>
          <Tex x={150} y={160} size={14} width={160} color={C.muted}>
            {String.raw`h=2:\ 12+4(0)=12`}
          </Tex>
          <path d="M 236 158 l 5 5 l 10 -11" fill="none" stroke={C.good} strokeWidth={2.5} />
        </g>
      </g>
    </Svg>
  );
}
