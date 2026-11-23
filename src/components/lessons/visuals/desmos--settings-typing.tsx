import { C, Css, Svg, Tex } from "./kit";

// Three small fixes: the fraction/decimal button (0.875 → 7/8), the degrees switch (sin 30 = −0.988 → 0.5), the right arrow (3/x+2).
export const alt =
  "Three fixes: the fraction button turns 0.875 into 7/8; switching Radians to Degrees changes sin(30) from −0.988 to 0.5; the right arrow keeps +2 out of the denominator of 3/x.";

const P = "v-desmos--settings-typing-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
/** Visible until `t`, then gone (the "before" half of a flip). The still frame shows the "after". */
const gone = (n: string, from: number, t: number) => r(n, `0%, ${from}% { opacity: 0 } ${from + 4}%, ${t}% { opacity: 1 } ${t + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const press = (n: string, t: number, rest: string, hot: string) =>
  r(n, `0%, ${t}% { ${rest} } ${t + 2}%, ${t + 5}% { ${hot} } ${t + 8}%, 100% { ${rest} }`);
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  // 1: fraction / decimal
  pop("b1", 4),
  gone("dec", 4, 14),
  pop("frac", 15, 4),
  press("btn", 11, "fill: var(--surface); stroke: var(--line)", "fill: var(--primary); stroke: var(--primary)"),
  // 2: radians / degrees
  pop("b2", 24),
  gone("rad", 24, 38),
  gone("rres", 24, 38),
  pop("deg", 40, 4),
  pop("dres", 40, 4),
  press("chip", 36, "fill: var(--surface); stroke: var(--line)", "fill: var(--primary-soft); stroke: var(--primary)"),
  // 3: the right arrow
  pop("a1", 48),
  pop("a2", 54),
  pop("b3", 62, 4),
  r("key", "0%, 66% { transform: translateY(0) } 68%, 71% { transform: translateY(2px) } 74%, 100% { transform: translateY(0) }"),
  press("keyface", 66, "fill: var(--surface); stroke: var(--ink)", "fill: var(--primary-soft); stroke: var(--primary)"),
  pop("plus", 74, 3),
  pop("pic2", 78),
  pop("cap", 86),
].join(" ");

const lab = { stroke: "none" } as const;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const mono = { fontFamily: MONO, fontWeight: 700 as const, ...lab };

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 1: fraction or decimal */}
        <g className={cls("b1")}>
          <rect x={16} y={16} width={120} height={32} rx={8} fill={C.fill} />
          <text className={cls("dec")} x={28} y={38} fontSize={17} fontWeight={700} fill={C.ink} {...lab}>0.875</text>
          <g className={cls("frac")}>
            <Tex x={28} y={32} size={22} anchor="start" width={60} height={34}>{String.raw`\tfrac{7}{8}`}</Tex>
          </g>
          <rect className={cls("btn")} x={102} y={23} width={28} height={18} rx={9} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
          <path d="M109 30 H123 M120 27 L123 30 L120 33 M123 36 H109 M112 33 L109 36 L112 39" fill="none" stroke={C.ink} strokeWidth={1.5} />
          <text x={148} y={36} fontSize={11} fill={C.muted} {...lab}>fraction / decimal</text>
        </g>

        {/* 2: radians or degrees */}
        <g className={cls("b2")}>
          <rect x={16} y={58} width={120} height={26} rx={8} fill={C.fill} />
          <text x={28} y={76} fontSize={14} fill={C.ink} {...mono}>sin(30)</text>
          <text className={cls("rres")} x={150} y={77} fontSize={16} fontWeight={700} fill={C.bad} {...lab}>{"−0.988"}</text>
          <text className={cls("dres")} x={150} y={77} fontSize={16} fontWeight={700} fill={C.good} {...lab}>0.5</text>
          <rect className={cls("chip")} x={218} y={58} width={86} height={26} rx={13} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
          <circle cx={236} cy={71} r={3.5} fill="none" stroke={C.primary} strokeWidth={2} />
          <path d="M236 63.5 V65.5 M236 76.5 V78.5 M228.5 71 H230.5 M241.5 71 H243.5 M230.7 65.7 L232.1 67.1 M239.9 74.9 L241.3 76.3 M241.3 65.7 L239.9 67.1 M232.1 74.9 L230.7 76.3" fill="none" stroke={C.primary} strokeWidth={2} />
          <text className={cls("rad")} x={252} y={75} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>Radians</text>
          <text className={cls("deg")} x={252} y={75} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>Degrees</text>
        </g>

        {/* 3: the right arrow leaves the denominator */}
        <g className={cls("a1")}>
          <text x={16} y={107} fontSize={13} fill={C.ink} {...mono}>y=3/x+2</text>
          <Tex x={150} y={103} size={14} anchor="start" color={C.bad} width={100}>{String.raw`y=\dfrac{3}{x+2}`}</Tex>
        </g>
        <g className={cls("a2")}>
          <text x={16} y={145} fontSize={13} fill={C.ink} {...mono}>y=3/x</text>
        </g>
        <g className={cls("key")}>
          <g className={cls("b3")}>
            <rect className={cls("keyface")} x={58} y={132} width={26} height={20} rx={5} fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
            <path d="M65 142 H78 M74 138 L78 142 L74 146" fill="none" stroke={C.ink} strokeWidth={2} />
          </g>
        </g>
        <text className={cls("plus")} x={90} y={145} fontSize={13} fill={C.ink} {...mono}>+2</text>
        <g className={cls("pic2")}>
          <Tex x={150} y={141} size={14} anchor="start" color={C.good} width={100}>{String.raw`y=\dfrac{3}{x}+2`}</Tex>
        </g>
        <text className={cls("cap")} x={160} y={166} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted} {...lab}>compare the picture with the problem</text>
      </g>
    </Svg>
  );
}
