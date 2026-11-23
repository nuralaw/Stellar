import { C, Css, Svg, Tex } from "./kit";

// Three Desmos moves in three bands: [ ] pairs the sides of a system, x1=[1...100] makes an identity exact, { } keeps only a part.
export const alt =
  "Square brackets pair the sides of a system in one regression. A list of 100 values makes an identity exact (a = 4). Curly braces keep only the part where a condition holds, such as a > 0.";

const P = "v-desmos--lists-restrictions-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 6) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100 200;");
const cover = (n: string, t: number, d: number) => r(n, `0%, ${t}% { transform: scaleX(1) } ${t + d}%, 100% { transform: scaleX(0) }`, "transform-box: fill-box; transform-origin: right center; transform: scaleX(0);");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  // band 1: lists
  pop("lefts", 4),
  pop("rights", 8),
  draw("pair", 12, 6),
  pop("cap", 14),
  cover("code", 19, 7),
  pop("codeg", 18, 1),
  pop("sep", 28),
  draw("sepx", 31, 3),
  // band 2: identity
  pop("expr", 34),
  pop("lbl", 40),
  cover("dots", 41, 10),
  pop("dotsg", 40, 1),
  pop("res", 54),
  // band 3: restriction
  pop("axes", 60),
  draw("half", 62, 8),
  pop("rcode", 70),
  r("fade", "0%, 74% { opacity: 1 } 80%, 100% { opacity: 0.18 }"),
  pop("ans", 80),
  pop("acode", 84),
  draw("anx", 88, 3),
].join(" ");

const lab = { stroke: "none" } as const;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const mono = { fontFamily: MONO, fontWeight: 700 as const, fontSize: 12, ...lab };
const SQ = C.primaryText;
const CU = C.good;

// Band 3 plot: x from −2 to 2.
const px = (x: number) => f(16 + (x + 2) * 20);
const py = (y: number) => f(162 - y * 13);
const half = (from: number, to: number) =>
  Array.from({ length: 9 }, (_, i) => {
    const x = from + ((to - from) * i) / 8;
    return `${i ? "L" : "M"}${px(x)} ${py(x * x)}`;
  }).join(" ");

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* band 1: lists pair in order */}
        <g className={cls("lefts")}>
          {[
            { x: 16, t: String.raw`x+2y` },
            { x: 68, t: String.raw`3x-y` },
          ].map((b) => (
            <g key={b.x}>
              <rect x={b.x} y={16} width={46} height={16} rx={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <Tex x={b.x + 23} y={24} size={12} width={44}>{b.t}</Tex>
            </g>
          ))}
        </g>
        <g className={cls("rights")}>
          {[
            { x: 16, t: "10" },
            { x: 68, t: "2" },
          ].map((b) => (
            <g key={b.x}>
              <rect x={b.x} y={42} width={46} height={16} rx={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <text x={b.x + 23} y={54} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>{b.t}</text>
            </g>
          ))}
        </g>
        <g stroke={C.primary} strokeWidth={2}>
          <line className={cls("pair")} x1={39} y1={33} x2={39} y2={41} pathLength={100} />
          <line className={cls("pair")} x1={91} y1={33} x2={91} y2={41} pathLength={100} />
        </g>
        <text className={cls("cap")} x={128} y={27} fontSize={11} fill={C.muted} {...lab}>pairs in order</text>
        <g className={cls("codeg")}>
          <text x={128} y={44} {...mono} fill={C.ink}>
            <tspan fill={SQ}>[</tspan>x1+2y1,3x1-y1<tspan fill={SQ}>]</tspan>~<tspan fill={SQ}>[</tspan>10,2<tspan fill={SQ}>]</tspan>
          </text>
        </g>
        <rect className={cls("code")} x={126} y={32} width={176} height={16} fill={C.bg} />
        <g className={cls("sep")}>
          <text x={128} y={58} fontSize={11} fill={C.muted} {...lab}>two separate lines</text>
          <line className={cls("sepx")} x1={126} y1={55} x2={222} y2={55} pathLength={100} stroke={C.bad} strokeWidth={2} />
        </g>

        {/* band 2: an identity must hold for 100 values */}
        <g className={cls("expr")}>
          <Tex x={16} y={74} size={13} anchor="start" width={196}>{String.raw`(x+2)(ax+3)\sim 4x^2+11x+6`}</Tex>
        </g>
        <g className={cls("lbl")}>
          <text x={16} y={93} {...mono} fill={C.ink}>x1=<tspan fill={SQ}>[</tspan>1...100<tspan fill={SQ}>]</tspan></text>
          <text x={118} y={93} fontSize={11} fill={C.muted} {...lab}>100 values</text>
        </g>
        <g className={cls("dotsg")}>
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={19 + i * 8} cy={103} r={2.5} fill={C.muted} />
          ))}
        </g>
        <rect className={cls("dots")} x={14} y={98} width={200} height={10} fill={C.bg} />
        <g className={cls("res")}>
          <rect x={236} y={86} width={68} height={24} rx={12} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={270} y={98} size={14} width={66}>{String.raw`a=4`}</Tex>
        </g>

        {/* band 3: braces keep the part where the condition holds */}
        <g className={cls("axes")} stroke={C.muted} strokeWidth={1.5}>
          <line x1={16} y1={py(0)} x2={96} y2={py(0)} />
          <line x1={px(0)} y1={118} x2={px(0)} y2={py(0)} />
        </g>
        <g className={cls("fade")}>
          <path className={cls("half")} d={half(-1.6, 0)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        </g>
        <path className={cls("half")} d={half(0, 1.6)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <g className={cls("rcode")}>
          <text x={104} y={140} {...mono} fill={C.ink}>y=x^2<tspan fill={CU}>{"{x>0}"}</tspan></text>
          <text x={104} y={156} fontSize={11} fill={C.muted} {...lab}>braces = condition</text>
        </g>
        <g className={cls("ans")}>
          <rect x={208} y={124} width={46} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <rect x={258} y={124} width={46} height={22} rx={11} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={231} y={135} size={12} width={46}>{String.raw`a=-2`}</Tex>
          <Tex x={281} y={135} size={12} width={46}>{String.raw`a=3`}</Tex>
          <line className={cls("anx")} x1={212} y1={142} x2={250} y2={128} pathLength={100} stroke={C.bad} strokeWidth={2} />
        </g>
        <g className={cls("acode")}>
          <text x={208} y={162} {...mono} fill={CU}>{"{a>0}"}</text>
          <text x={262} y={162} fontSize={11} fill={C.muted} {...lab}>keeps 3</text>
        </g>
      </g>
    </Svg>
  );
}
