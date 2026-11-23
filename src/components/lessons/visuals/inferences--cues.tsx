import { C, Css, Svg } from "./kit";

// Inferences, "Cue words": the word before the blank decides what kind of sentence belongs there: reason, result, contrast, example.
export const alt = "The cue since lights the reason lamp and becomes the question: why may it mislead? The choice that answers it fits the blank; a cost choice does not. By contrast lights the contrast lamp.";

const P = "v-inferences--cues-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const off = `fill: ${C.fill}; stroke: ${C.line}`;
const on = `fill: ${C.soft}; stroke: ${C.primary}`;

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("s1", 5)}
.@@since { fill: ${C.primaryText}; animation-name: @@since; }
@keyframes @@since { 0%, 9% { fill: ${C.ink} } 14%, 100% { fill: ${C.primaryText} } }
${show("l1", 14)}
${show("l2", 16)}
${show("l3", 18)}
${show("l4", 20)}
.@@rOn { ${off}; animation-name: @@rOn; }
@keyframes @@rOn { 0%, 22% { ${off} } 27%, 78% { ${on} } 84%, 100% { ${off} } }
.@@cOn { ${on}; animation-name: @@cOn; }
@keyframes @@cOn { 0%, 82% { ${off} } 88%, 100% { ${on} } }
.@@bubble { animation-name: @@bubble; }
@keyframes @@bubble { 0%, 30% { opacity: 0; transform: translateY(90px) } 36%, 40% { opacity: 1; transform: translateY(90px) } 50%, 100% { opacity: 1; transform: none } }
.@@bubTx { opacity: 0; animation-name: @@bubTx; }
@keyframes @@bubTx { 0%, 30% { opacity: 0 } 36%, 72% { opacity: 1 } 80%, 100% { opacity: 0 } }
.@@cx { opacity: 0.8; animation-name: @@cx; }
@keyframes @@cx { 0%, 54% { opacity: 0; transform: translateY(8px) } 60%, 100% { opacity: 0.8; transform: none } }
${k("xtag", "0%, 62% { opacity: 0 } 68%, 100% { opacity: 1 }")}
.@@cy { transform: translateY(-90px); animation-name: @@cy; }
@keyframes @@cy { 0%, 54% { opacity: 0; transform: translateY(8px) } 60%, 70% { opacity: 1; transform: none } 80%, 100% { opacity: 1; transform: translateY(-90px) } }
.@@cyBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: @@cyBox; }
@keyframes @@cyBox { 0%, 78% { fill: ${C.fill}; stroke: ${C.line} } 84%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
${show("s2", 82)}
.@@flip { transform-box: fill-box; transform-origin: center; transform: scaleX(-1); animation-name: @@flip; }
@keyframes @@flip { 0%, 88% { transform: scaleX(1) } 94%, 100% { transform: scaleX(-1) } }
${k("opp", "0%, 90% { opacity: 0 } 95%, 100% { opacity: 1 }")}
`.replaceAll("@@", P);

function Lamp({ x, y, cues, role, cn, lit }: { x: number; y: number; cues: string; role: string; cn: string; lit?: string }) {
  return (
    <g className={cls("a", cn)}>
      <rect className={lit ? cls("a", lit) : undefined} x={x} y={y} width={140} height={26} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <circle className={lit ? cls("a", lit) : undefined} cx={x + 14} cy={y + 13} r={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={x + 26} y={y + 11} fontSize={11} fontWeight={600} fill={C.muted}>{cues}</text>
      <text x={x + 26} y={y + 22} fontSize={11} fontWeight={700} fill={C.ink}>{role}</text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <text className={cls("a", "s1")} x={16} y={32} fontSize={12} fontWeight={700} fill={C.ink}>
          survey may mislead, <tspan className={cls("a", "since")}>since</tspan>
        </text>

        {/* the four cue families */}
        <Lamp x={16} y={46} cues="because, since" role="reason" cn="l1" lit="rOn" />
        <Lamp x={164} y={46} cues="therefore, so" role="result" cn="l2" />
        <Lamp x={16} y={75} cues="but, by contrast" role="contrast" cn="l3" lit="cOn" />
        <Lamp x={164} y={75} cues="for example" role="example" cn="l4" />

        {/* the question settles into the slot */}
        <g className={cls("a", "bubble")}>
          <rect x={178} y={18} width={126} height={24} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} strokeDasharray="5 4" />
          <text className={cls("a", "bubTx")} x={241} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>Why may it mislead?</text>
        </g>

        {/* two choices */}
        <g className={cls("a", "cx")}>
          <rect x={16} y={108} width={146} height={20} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={89} y={122} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>the bus costs $2</text>
        </g>
        <text className={cls("a", "xtag")} x={16} y={141} fontSize={11} fontWeight={700} fill={C.muted}>no reason</text>
        <g className={cls("a", "cy")}>
          <rect className={cls("a", "cyBox")} x={181} y={110} width={120} height={20} rx={8} strokeWidth={1.5} />
          <text x={241} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>riders chose the bus</text>
        </g>

        {/* the cue changes: contrast flips the direction */}
        <g className={cls("a", "s2")}>
          <text x={16} y={160} fontSize={12} fontWeight={700} fill={C.primaryText}>By contrast,</text>
          <rect x={108} y={144} width={150} height={22} rx={8} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 4" />
          <path className={cls("a", "flip")} d="M118 155 H146 M140 150 L146 155 L140 160" fill="none" stroke={C.primary} strokeWidth={2} />
          <text className={cls("a", "opp")} x={156} y={159} fontSize={11} fontWeight={700} fill={C.ink}>the opposite</text>
        </g>
      </g>
    </Svg>
  );
}
