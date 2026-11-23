import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Predict, then match": shrink the claim to one link, predict what you would see, match the choice that shows it.
export const alt = "The claim shrinks to bird to lost tails. The prediction: more lost tails where the bird lives. The same-topic choice is crossed out; the choice that fits the prediction locks in green.";

const P = "v-command-of-evidence-textual--predict-match-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
.@@claim { opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: @@claim; }
@keyframes @@claim { 0%, 4% { opacity: 0; transform: scale(1) } 9%, 16% { opacity: 1; transform: scale(1) } 24%, 100% { opacity: 0; transform: scale(0.7) } }
${show("blocks", 22)}
.@@arrow { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@arrow; }
@keyframes @@arrow { 0%, 26% { stroke-dashoffset: 100 } 33%, 100% { stroke-dashoffset: 0 } }
${show("ghost", 36)}
.@@ghostBox { stroke: ${C.good}; animation-name: @@ghostBox; }
@keyframes @@ghostBox { 0%, 78% { stroke: ${C.primary} } 83%, 100% { stroke: ${C.good} } }
.@@b { opacity: 0.8; transform-box: fill-box; transform-origin: center; transform: scale(0.97); animation-name: @@b; }
@keyframes @@b { 0%, 48% { opacity: 0; transform: translateX(18px) scale(1) } 54%, 62% { opacity: 1; transform: translateX(0) scale(1) } 70%, 100% { opacity: 0.8; transform: scale(0.97) } }
.@@strike { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@strike; }
@keyframes @@strike { 0%, 58% { stroke-dashoffset: 100 } 64%, 100% { stroke-dashoffset: 0 } }
${k("btag", "0%, 62% { opacity: 0 } 68%, 100% { opacity: 1 }")}
.@@aCard { animation-name: @@aCard; }
@keyframes @@aCard { 0%, 70% { opacity: 0; transform: translateX(18px) } 76%, 100% { opacity: 1; transform: none } }
.@@aBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: @@aBox; }
@keyframes @@aBox { 0%, 77% { fill: ${C.fill}; stroke: ${C.line} } 83%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
${k("match", "0%, 80% { opacity: 0 } 86%, 100% { opacity: 1 }")}
${show("cap", 86)}
`.replaceAll("@@", P);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* the claim as a sentence, then shrunk to one link */}
        <text className={cls("a", "claim")} x={160} y={34} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
          a bird makes lizards lose tails
        </text>
        <g className={cls("a", "blocks")}>
          <text x={16} y={34} fontSize={11} fontWeight={600} fill={C.muted}>claim</text>
          <rect x={60} y={18} width={70} height={24} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={95} y={35} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>bird</text>
          <rect x={190} y={18} width={84} height={24} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={232} y={35} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>lost tails</text>
        </g>
        <path className={cls("a", "arrow")} pathLength={100} d="M134 30 H184 M178 25 L184 30 L178 35" fill="none" stroke={C.primary} strokeWidth={2} />

        {/* the prediction ghost, the only dashed element */}
        <g className={cls("a", "ghost")}>
          <text x={16} y={64} fontSize={11} fontWeight={600} fill={C.muted}>prediction</text>
          <rect className={cls("a", "ghostBox")} x={80} y={50} width={194} height={22} rx={8} fill="none" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={177} y={65} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>more lost tails with the bird</text>
        </g>

        {/* choice B: same topic, wrong link */}
        <g className={cls("a", "b")}>
          <rect x={16} y={112} width={288} height={32} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={28} y={126} fontSize={11} fontWeight={600} fill={C.muted}>lizards ate more insects</text>
          <path className={cls("a", "strike")} pathLength={100} d="M26 123 H156" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text className={cls("a", "btag")} x={28} y={139} fontSize={11} fontWeight={700} fill={C.muted}>same topic, wrong link</text>
        </g>

        {/* choice A: snaps onto the prediction */}
        <g className={cls("a", "aCard")}>
          <rect className={cls("a", "aBox")} x={16} y={78} width={288} height={32} rx={8} strokeWidth={1.5} />
          <text x={28} y={92} fontSize={11} fontWeight={700} fill={C.ink}>more broken tails on islands with the bird</text>
          <text className={cls("a", "match")} x={28} y={105} fontSize={11} fontWeight={700} fill={C.good}>match</text>
        </g>
        <path className={cls("a", "match")} d="M177 72 V78" stroke={C.good} strokeWidth={2} fill="none" />

        <text className={cls("a", "cap")} x={160} y={162} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText}>Predict. Match.</text>
      </g>
    </Svg>
  );
}
