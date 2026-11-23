import { C, Css, Svg, Tex } from "./kit";

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
          <Tex x={x0 + X / 2} y={y0 + X / 2} size={19} width={50}>{String.raw`x^2`}</Tex>
        </g>
        {/* its two side lengths */}
        <g className={cls("sq")}>
          <Tex x={x0 + X / 2} y={y0 - 12} size={14} width={20} color={C.muted}>{String.raw`x`}</Tex>
          <Tex x={x0 - 8} y={y0 + X / 2} size={14} anchor="end" width={20} color={C.muted}>{String.raw`x`}</Tex>
        </g>

        {/* the two 2x strips (the 4x) */}
        <g className={cls("st")}>
          <rect x={x0 + X} y={y0} width={T} height={X} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <rect x={x0} y={y0 + X} width={X} height={T} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <Tex x={x0 + X + T / 2} y={y0 + X / 2} size={14} width={30}>{String.raw`2x`}</Tex>
          <Tex x={x0 + X / 2} y={y0 + X + T / 2} size={14} width={30}>{String.raw`2x`}</Tex>
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
        <g className={cls("e1")}>
          <Tex x={168} y={56} size={17} anchor="start" width={120}>{String.raw`x^2+4x`}</Tex>
        </g>
        <text className={cls("e2")} x={168} y={86} fontSize={11} fill={C.muted} {...t}>half of 4 is 2</text>
        <g className={cls("e3")}>
          <Tex x={168} y={108} size={17} anchor="start" width={120}>{String.raw`x^2+4x\phantom{+4}`}</Tex>
          <Tex x={168} y={108} size={17} anchor="start" width={120} color={C.primaryText}>{String.raw`\phantom{x^2+4x}+4`}</Tex>
        </g>
        <g className={cls("e4")}>
          <Tex x={168} y={136} size={20} anchor="start" width={130} color={C.primaryText}>{String.raw`{=}(x+2)^2`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
