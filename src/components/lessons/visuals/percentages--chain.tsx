import { C, Css, Svg, Tex } from "./kit";

// Chain two percents: a = 60% of b and a = 150% of c, so c = 0.6 ÷ 1.5 = 40% of b.
export const alt = "Three bars: b is 100 long, a is 60% of b, and c is the length that fits into a 1.5 times, which is 40% of b. So if a is 60% of b and 150% of c, then c is 40% of b.";

const P = "v-percentages--chain-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: left center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("b", 2)}
${grow("abar", 14, 14)}
${at("alab", 30)}
${grow("cbar", 42, 12)}
${at("cext", 56)}
${at("guide", 70)}
${at("res", 74)}
`;

const K = 2.2;
const X0 = 44;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">
        <text x={26} y={59}>
          b
        </text>
        <text x={26} y={101}>
          a
        </text>
        <text x={26} y={143}>
          c
        </text>
      </g>

      {/* b = 100% */}
      <rect className={cls("b")} x={X0} y={44} width={100 * K} height={22} rx={4} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      <text className={cls("b")} x={X0 + 50 * K} y={60} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
        100%
      </text>

      {/* a = 60% of b */}
      <rect className={cls("abar")} x={X0} y={86} width={60 * K} height={22} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <g className={cls("alab")}>
        <Tex x={X0 + 60 * K + 8} y={97} size={13} anchor="start" width={120}>{String.raw`a=60\%\text{ of }b`}</Tex>
      </g>

      {/* c: a is 150% of c */}
      <rect className={cls("cbar")} x={X0} y={128} width={40 * K} height={22} rx={4} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
      <g className={cls("cext")}>
        <rect x={X0 + 40 * K} y={128} width={20 * K} height={22} rx={4} fill="none" stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 3" />
        <Tex x={X0 + 60 * K + 8} y={139} size={13} anchor="start" width={120}>{String.raw`a=150\%\text{ of }c`}</Tex>
      </g>

      {/* Guide: where 40% of b falls, and the answer */}
      <line className={cls("guide")} x1={X0 + 40 * K} y1={66} x2={X0 + 40 * K} y2={128} stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 3" />
      <g className={cls("res")}>
        <Tex x={160} y={26} size={17} width={200} color={C.primaryText}>{String.raw`c=40\%\text{ of }b`}</Tex>
      </g>
    </Svg>
  );
}
