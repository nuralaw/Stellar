import { C, Css, Svg } from "./kit";

// Completing the square with tiles: x² plus two 2x strips is not yet a square. The missing 2 × 2 corner is +4.
export const alt =
  "An x by x square tile and two 2 by x strips make x² + 4x. The missing 2 by 2 corner, worth 4, completes a bigger square: x² + 4x + 4 = (x + 2)².";

const P = "v-circles--tiles-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("sq", 6),
  pop("e1", 8),
  pop("st", 24),
  pop("e2", 26),
  pop("miss", 42),
  pop("cor", 54),
  pop("e3", 56),
  pop("e4", 72),
  r("ghost", "0%, 24% { opacity: 0 } 30%, 52% { opacity: 1 } 56%, 100% { opacity: 0 }", "opacity: 0;"),
].join(" ");

// x is drawn 70 long and 2 is drawn 28 long (any x > 2 would do).
const X = 70;
const T = 28;
const x0 = 40;
const y0 = 48;
const t = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the x by x tile */}
        <g className={cls("sq")}>
          <rect x={x0} y={y0} width={X} height={X} rx={2} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={x0 + X / 2} y={y0 + X / 2 + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.ink} {...t}>x²</text>
        </g>
        {/* its two side lengths */}
        <g className={cls("sq")} fontSize={12} fontWeight={700} fill={C.muted} {...t}>
          <text x={x0 + X / 2} y={y0 - 8} textAnchor="middle">x</text>
          <text x={x0 - 8} y={y0 + X / 2 + 4} textAnchor="end">x</text>
        </g>

        {/* the two 2x strips (the 4x) */}
        <g className={cls("st")}>
          <rect x={x0 + X} y={y0} width={T} height={X} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <rect x={x0} y={y0 + X} width={X} height={T} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <text x={x0 + X + T / 2} y={y0 + X / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...t}>2x</text>
          <text x={x0 + X / 2} y={y0 + X + T / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...t}>2x</text>
          <text x={x0 + X + T / 2} y={y0 - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted} {...t}>2</text>
          <text x={x0 - 8} y={y0 + X + T / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.muted} {...t}>2</text>
        </g>

        {/* the missing corner: a dashed gap first, then the filled 2 by 2 tile */}
        <rect className={cls("ghost")} x={x0 + X} y={y0 + X} width={T} height={T} rx={2} fill="none" stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 3" />
        <g className={cls("cor")}>
          <rect x={x0 + X} y={y0 + X} width={T} height={T} rx={2} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={x0 + X + T / 2} y={y0 + X + T / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText} {...t}>4</text>
        </g>

        {/* the algebra */}
        <text className={cls("e1")} x={168} y={60} fontSize={16} fontWeight={700} fill={C.ink} {...t}>x² + 4x</text>
        <text className={cls("e2")} x={168} y={86} fontSize={11} fill={C.muted} {...t}>half of 4 is 2</text>
        <text className={cls("e3")} x={168} y={112} fontSize={16} fontWeight={700} fill={C.ink} {...t}>
          x² + 4x <tspan fill={C.primaryText}>+ 4</tspan>
        </text>
        <text className={cls("e4")} x={168} y={140} fontSize={19} fontWeight={700} fill={C.primaryText} {...t}>= (x + 2)²</text>
      </g>
    </Svg>
  );
}
