import { C, Css, Svg } from "./kit";

// No penalty for guessing: a blank scores 0, a wrong answer scores 0 (nothing is subtracted),
// and a guess has a 1 in 4 chance of earning the point.
export const alt = "Three outcomes for one question: left blank scores 0; a wrong answer also scores 0, with no penalty; a guess has a 1 in 4 chance to score the point.";

const P = "v-digital-sat-format--guess-";
/** Fade/pop something in at t%. */
const pop = (n: string, t: number) => {
  const k = P + n;
  return `.${k} { transform-box: fill-box; transform-origin: center; animation-name: ${k}; }
@keyframes ${k} { 0%, ${t}% { opacity: 0; transform: scale(0.8) } ${t + 5}%, 100% { opacity: 1; transform: none } }`;
};

const css = `
.v-digital-sat-format--guess-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--guess-scene { animation-name: v-digital-sat-format--guess-scene; }
@keyframes v-digital-sat-format--guess-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
${pop("c1", 5)}
${pop("s1", 14)}
${pop("c2", 26)}
${pop("s2", 42)}
${pop("n2", 49)}
${pop("c3", 58)}
${pop("s3", 73)}
${pop("n3", 80)}
.v-digital-sat-format--guess-w { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-digital-sat-format--guess-w; }
@keyframes v-digital-sat-format--guess-w { 0%, 33% { fill: ${C.bg}; stroke: ${C.muted} } 38%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.v-digital-sat-format--guess-r { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-digital-sat-format--guess-r; }
@keyframes v-digital-sat-format--guess-r { 0%, 65% { fill: ${C.bg}; stroke: ${C.muted} } 70%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

const LETTERS = ["A", "B", "C", "D"];

function Col({ cx, title, pick, pickCls, g }: { cx: number; title: string; pick: number; pickCls: string; g: string }) {
  return (
    <g className={g}>
      <rect x={cx - 44} y={18} width={88} height={144} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={cx} y={40} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
        {title}
      </text>
      {LETTERS.map((l, i) => {
        const x = cx - 30 + i * 20;
        return (
          <g key={l}>
            {i === pick ? <circle className={pickCls} cx={x} cy={62} r={8.5} strokeWidth={1.5} /> : <circle cx={x} cy={62} r={8.5} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />}
            <text x={x} y={66} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>
              {l}
            </text>
          </g>
        );
      })}
      <path d={`M${cx} 78 V92 M${cx - 4.5} 88 L${cx} 93 L${cx + 4.5} 88`} fill="none" stroke={C.muted} strokeWidth={1.5} />
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--guess-a v-digital-sat-format--guess-scene">
        {/* Blank */}
        <Col cx={64} title="blank" pick={-1} pickCls="" g="v-digital-sat-format--guess-a v-digital-sat-format--guess-c1" />
        <text className="v-digital-sat-format--guess-a v-digital-sat-format--guess-s1" x={64} y={128} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.ink}>
          0
        </text>

        {/* Wrong: also 0, nothing subtracted */}
        <Col cx={160} title="wrong" pick={1} pickCls="v-digital-sat-format--guess-a v-digital-sat-format--guess-w" g="v-digital-sat-format--guess-a v-digital-sat-format--guess-c2" />
        <text className="v-digital-sat-format--guess-a v-digital-sat-format--guess-s2" x={160} y={128} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.ink}>
          0
        </text>
        <text className="v-digital-sat-format--guess-a v-digital-sat-format--guess-n2" x={160} y={149} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
          no penalty
        </text>

        {/* A guess can score */}
        <Col cx={256} title="guess" pick={2} pickCls="v-digital-sat-format--guess-a v-digital-sat-format--guess-r" g="v-digital-sat-format--guess-a v-digital-sat-format--guess-c3" />
        <text className="v-digital-sat-format--guess-a v-digital-sat-format--guess-s3" x={256} y={128} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.good}>
          +1
        </text>
        <text className="v-digital-sat-format--guess-a v-digital-sat-format--guess-n3" x={256} y={149} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.good}>
          1 in 4 chance
        </text>
      </g>
    </Svg>
  );
}
