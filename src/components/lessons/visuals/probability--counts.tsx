import { C, Css, Svg, Tex } from "./kit";

// Scene 1: 0.35 of 60 marbles is 21. Scene 2: 4 buckets of 5 roses and 6 buckets of 12 tulips make 20 and 72 flowers, so P(rose) = 20/92.
export const alt =
  "A probability times the group gives a count: 0.35 of 60 marbles is 21. Then buckets: 4 buckets of 5 roses make 20, 6 buckets of 12 tulips make 72, so the chance of a rose is 20/92, not 4/10 buckets.";

const P = "v-probability--counts-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  // Scene 1 (shown from 4% to 40%, hidden in the still frame)
  r("s1", "0%, 3% { opacity: 0 } 7%, 38% { opacity: 1 } 42%, 100% { opacity: 0 }", "opacity: 0;"),
  r("s1bar", "0%, 9% { opacity: 0 } 14%, 100% { opacity: 1 }"),
  r("s1arrow", "0%, 15% { opacity: 0 } 19%, 100% { opacity: 1 }"),
  r("s1rule", "0%, 17% { opacity: 0 } 21%, 100% { opacity: 1 }"),
  r("s1calc", "0%, 23% { opacity: 0 } 27%, 100% { opacity: 1 }"),
  r("lit", `0%, 26% { fill: ${C.muted}; opacity: .5 } 31%, 100% { fill: ${C.primary}; opacity: 1 }`),
  // Scene 2 (shown from 44%, the still frame)
  r("s2", "0%, 41% { opacity: 0 } 46%, 100% { opacity: 1 }"),
  pop("rb", 46),
  pop("tb", 52),
  pop("re", 58),
  pop("te", 64),
  pop("frac", 72),
  pop("cross", 80),
  pop("cap", 84),
].join(" ");

const lab = { stroke: "none" } as const;

// Scene 1: 60 dots in a bag, the first 21 are blue.
const DOTS = Array.from({ length: 60 }, (_, i) => ({ x: 28 + (i % 10) * 14, y: 74 + Math.floor(i / 10) * 14, blue: i < 21 }));

/** A bucket (a trapezoid with a rim) holding a number of flowers. */
function Bucket({ x, y, n, tone }: { x: number; y: number; n: number; tone: "rose" | "tulip" }) {
  const fill = tone === "rose" ? C.badSoft : C.soft;
  const stroke = tone === "rose" ? C.bad : C.primary;
  return (
    <g>
      <path d={`M${x} ${y} H${x + 26} L${x + 22} ${y + 24} H${x + 4} Z`} fill={fill} stroke={stroke} strokeWidth={1.8} />
      <text x={x + 13} y={y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
        {n}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Scene 1: probability times the group */}
        <g className={cls("s1")}>
          <g className={cls("s1bar")}>
            {/* 100 ticks: 35 of them in color */}
            <line x1={20} y1={22} x2={300} y2={22} stroke={C.line} strokeWidth={10} strokeLinecap="butt" strokeDasharray="1.4 1.4" />
            <line x1={20} y1={22} x2={118} y2={22} stroke={C.primary} strokeWidth={10} strokeLinecap="butt" strokeDasharray="1.4 1.4" />
            <text x={20} y={46} fontSize={14} fontWeight={700} fill={C.primaryText} {...lab}>blue: 0.35</text>
          </g>
          <g className={cls("s1arrow")} {...lab}>
            <path d="M120 34 V56" stroke={C.primary} strokeWidth={2} fill="none" />
            <path d="M115 50 L120 57 L125 50" stroke={C.primary} strokeWidth={2} fill="none" />
          </g>
          <rect x={16} y={60} width={150} height={96} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          {DOTS.map((d, i) => (
            <circle key={i} className={d.blue ? cls("lit") : undefined} cx={d.x} cy={d.y} r={4.5} fill={C.muted} opacity={0.5} />
          ))}
          <text x={91} y={172} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>60 marbles</text>
          <g className={cls("s1rule")}>
            <Tex x={242} y={86} size={14} width={130} color={C.muted}>{String.raw`\text{count}=P\cdot\text{total}`}</Tex>
          </g>
          <g className={cls("s1calc")}>
            <Tex x={242} y={124} size={21} width={130} color={C.primaryText}>{String.raw`0.35\cdot 60=21`}</Tex>
          </g>
        </g>

        {/* Scene 2: buckets, then flowers */}
        <g className={cls("s2")}>
          <g className={cls("rb")}>
            {[0, 1, 2, 3].map((i) => (
              <Bucket key={i} x={20 + i * 32} y={14} n={5} tone="rose" />
            ))}
          </g>
          <g className={cls("tb")}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Bucket key={i} x={20 + i * 32} y={54} n={12} tone="tulip" />
            ))}
          </g>
          <g className={cls("re")}>
            <Tex x={226} y={27} size={16} anchor="start" width={90}>{String.raw`4\cdot 5=20`}</Tex>
          </g>
          <g className={cls("te")}>
            <Tex x={226} y={67} size={16} anchor="start" width={90}>{String.raw`6\cdot 12=72`}</Tex>
          </g>

          <g className={cls("frac")}>
            <Tex x={96} y={118} size={19} width={180} color={C.primaryText}>{String.raw`\dfrac{20}{92}=\dfrac{5}{23}`}</Tex>
          </g>
          <g className={cls("cross")}>
            <Tex x={246} y={118} size={17} width={70} color={C.muted}>{String.raw`\dfrac{4}{10}`}</Tex>
            <line x1={222} y1={134} x2={270} y2={102} stroke={C.bad} strokeWidth={2.5} />
            <text x={246} y={146} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.bad} {...lab}>buckets</text>
          </g>
          <g className={cls("cap")}>
            <text x={160} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>pick a flower, not a bucket</text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
