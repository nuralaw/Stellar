import { C, Css, Svg, Tex } from "./kit";

// 40 students: 22 take art, 15 take music, 6 take both. 22 + 15 counts the 6 twice, so art or music = 22 + 15 − 6 = 31.
export const alt =
  "Two overlapping circles in a box of 40 students: art 22, music 15, both 6. Adding 22 + 15 counts the 6 twice, so subtract once: 37 − 6 = 31, and the chance of art or music is 31/40. Neither is 9/40.";

const P = "v-probability--or-overlap-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 }`);
// Visible from t0 to t1 only; hidden in the still frame.
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("overlap", 8),
  pop("artfill", 16),
  pop("artlab", 16),
  pop("musfill", 28),
  pop("muslab", 28),
  pop("sum", 36),
  // The overlap flashes twice (once per circle), then the union is one calm colour.
  r(
    "flash",
    "0%, 42% { opacity: 0 } 45% { opacity: .75 } 48% { opacity: 0 } 51% { opacity: .75 } 54%, 100% { opacity: 0 }",
    "opacity: 0;",
  ),
  win("twice", 42, 56),
  pop("reset", 57),
  pop("sub", 58),
  pop("rule", 66),
  pop("frac", 72),
  win("neither", 84, 90),
  r("fracout", "0%, 80% { opacity: 1 } 84%, 90% { opacity: 0 } 93%, 100% { opacity: 1 }"),
].join(" ");

const lab = { stroke: "none" } as const;
// Art: center (70, 72), radius 38. Music: center (118, 72), radius 32. They cross at x = 98.375, y = 72 ± 25.28.
const LENS = "M98.375 46.72 A32 32 0 0 0 98.375 97.28 A38 38 0 0 0 98.375 46.72 Z";

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The 40 students */}
        <rect x={16} y={14} width={156} height={122} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} />
        <text x={24} y={129} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>40 students</text>

        {/* Each circle fills in turn; where they overlap the fill is doubled */}
        <circle className={cls("artfill")} cx={70} cy={72} r={38} fill={C.primary} fillOpacity={0.24} />
        <circle className={cls("musfill")} cx={118} cy={72} r={32} fill={C.primary} fillOpacity={0.24} />
        {/* From the union on, the overlap is one colour again */}
        <g className={cls("reset")}>
          <path d={LENS} fill={C.bg} />
          <path d={LENS} fill={C.primary} fillOpacity={0.24} />
        </g>
        <path className={cls("flash")} d={LENS} fill={C.bad} />
        <circle cx={70} cy={72} r={38} fill="none" stroke={C.ink} strokeWidth={2} />
        <circle cx={118} cy={72} r={32} fill="none" stroke={C.ink} strokeWidth={2} />

        <g fontWeight={700} textAnchor="middle" {...lab}>
          <text className={cls("artlab")} x={46} y={30} fontSize={13} fill={C.ink}>Art 22</text>
          <text className={cls("muslab")} x={136} y={30} fontSize={13} fill={C.ink}>Music 15</text>
          <text className={cls("overlap")} x={97} y={77} fontSize={16} fill={C.ink}>6</text>
          <g className={cls("neither")}>
            <text x={150} y={116} fontSize={16} fill={C.good}>9</text>
            <text x={150} y={129} fontSize={11} fill={C.good}>neither</text>
          </g>
        </g>

        {/* The work, step by step */}
        <g className={cls("sum")}>
          <Tex x={244} y={34} size={16} width={116}>{String.raw`22+15=37`}</Tex>
        </g>
        <text className={cls("twice")} x={244} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>
          6 counted twice
        </text>
        <g className={cls("sub")}>
          <Tex x={244} y={62} size={16} width={116} color={C.primaryText}>{String.raw`37-6=31`}</Tex>
        </g>
        <g className={cls("frac")}>
          <g className={cls("fracout")}>
            <Tex x={244} y={102} size={20} width={116} color={C.good}>{String.raw`\dfrac{31}{40}`}</Tex>
          </g>
        </g>
        <g className={cls("neither")}>
          <Tex x={244} y={102} size={15} width={130} color={C.good}>{String.raw`1-\dfrac{31}{40}=\dfrac{9}{40}`}</Tex>
        </g>

        {/* The rule */}
        <g className={cls("rule")}>
          <Tex x={160} y={154} size={13} width={300} color={C.muted}>{String.raw`P(A\text{ or }B)=P(A)+P(B)-P(A\text{ and }B)`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
