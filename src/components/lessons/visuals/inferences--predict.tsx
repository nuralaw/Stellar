import { C, Css, Svg } from "./kit";

// Inferences, "Predict, then match": read the text as roles (belief, twist, cue), write the conclusion yourself, then match it.
export const alt = "Belief, twist and cue bars. The prediction, fog is not the cause, settles into the empty slot first. The choice that only repeats a fact bounces off; the one matching the prediction locks in green.";

const P = "v-inferences--predict-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("r1", 5)}
${show("r2", 12)}
${show("r3", 19)}
.@@arrow { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@arrow; }
@keyframes @@arrow { 0%, 26% { stroke-dashoffset: 100 } 34%, 100% { stroke-dashoffset: 0 } }
.@@bubble { animation-name: @@bubble; }
@keyframes @@bubble { 0%, 32% { opacity: 0; transform: translateY(46px) } 38%, 42% { opacity: 1; transform: translateY(46px) } 50%, 100% { opacity: 1; transform: none } }
.@@tail { opacity: 0; animation-name: @@tail; }
@keyframes @@tail { 0%, 36% { opacity: 0 } 40%, 44% { opacity: 1 } 50%, 100% { opacity: 0 } }
.@@chipTx { opacity: 0; animation-name: @@chipTx; }
@keyframes @@chipTx { 0%, 34% { opacity: 0 } 38%, 78% { opacity: 1 } 84%, 100% { opacity: 0 } }
${k("plab", "0%, 50% { opacity: 0 } 56%, 100% { opacity: 1 }")}
.@@cx { opacity: 0.8; transform-box: fill-box; transform-origin: center; animation-name: @@cx; }
@keyframes @@cx { 0%, 56% { opacity: 0; transform: translateY(8px) } 62%, 66% { opacity: 1; transform: none } 70% { opacity: 1; transform: translateY(-14px) } 75%, 100% { opacity: 0.8; transform: none } }
.@@cxBox { animation-name: @@cxBox; }
@keyframes @@cxBox { 0%, 70% { stroke: ${C.line} } 74%, 100% { stroke: ${C.bad} } }
${k("xtag", "0%, 74% { opacity: 0 } 80%, 100% { opacity: 1 }")}
.@@cy { transform: translate(-2px, -42px); animation-name: @@cy; }
@keyframes @@cy { 0%, 56% { opacity: 0; transform: translate(0, 8px) } 62%, 76% { opacity: 1; transform: none } 86%, 100% { opacity: 1; transform: translate(-2px, -42px) } }
.@@cyBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: @@cyBox; }
@keyframes @@cyBox { 0%, 84% { fill: ${C.fill}; stroke: ${C.line} } 90%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
${k("match", "0%, 86% { opacity: 0 } 91%, 100% { opacity: 1 }")}
${show("cap", 90)}
`.replaceAll("@@", P);

function Row({ y, h = 16, tag, text, cn, accent }: { y: number; h?: number; tag: string; text: string; cn: string; accent?: boolean }) {
  return (
    <g className={cls("a", cn)}>
      <text x={16} y={y + h / 2 + 4} fontSize={11} fontWeight={700} fill={accent ? C.primaryText : C.muted}>{tag}</text>
      <rect x={60} y={y} width={accent || tag === "belief" ? 244 : 116} height={h} rx={5} fill={accent ? C.soft : C.fill} stroke={accent ? C.primary : C.line} strokeWidth={accent ? 2 : 1.5} />
      <text x={68} y={y + h / 2 + 4} fontSize={11} fontWeight={accent ? 700 : 600} fill={C.ink}>{text}</text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <Row y={16} tag="belief" text="Many sailors believed fog slows ships" cn="r1" />
        <Row y={35} tag="twist" text="But ships moved just as fast in fog" cn="r2" accent />
        <Row y={54} h={28} tag="cue" text="This suggests that" cn="r3" />

        {/* belief and twist flow into the cue */}
        <path className={cls("a", "arrow")} pathLength={100} d="M53 24 V68 M53 43 H57 M53 68 H58 M55 64 L59 68 L55 72" fill="none" stroke={C.primary} strokeWidth={1.5} />

        {/* the prediction: a bubble that settles into the slot */}
        <g className={cls("a", "bubble")}>
          <rect x={180} y={54} width={124} height={28} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} strokeDasharray="5 4" />
          <path className={cls("a", "tail")} d="M234 54 L242 46 L250 54" fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text className={cls("a", "chipTx")} x={242} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>fog is not the cause</text>
        </g>
        <text className={cls("a", "plab")} x={180} y={94} fontSize={11} fontWeight={700} fill={C.primaryText}>prediction</text>
        <text className={cls("a", "match")} x={304} y={94} textAnchor="end" fontSize={11} fontWeight={700} fill={C.good}>match</text>

        {/* two choices */}
        <g className={cls("a", "cx")}>
          <rect className={cls("a", "cxBox")} x={16} y={98} width={164} height={24} rx={8} fill={C.fill} stroke={C.bad} strokeWidth={1.5} />
          <text x={98} y={114} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>ships moved as fast in fog</text>
        </g>
        <text className={cls("a", "xtag")} x={16} y={138} fontSize={11} fontWeight={700} fill={C.bad}>repeats a fact</text>
        <g className={cls("a", "cy")}>
          <rect className={cls("a", "cyBox")} x={182} y={98} width={120} height={24} rx={8} strokeWidth={1.5} />
          <text x={242} y={114} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>fog is not the cause</text>
        </g>

        <text className={cls("a", "cap")} x={160} y={160} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>Predict first. Then match.</text>
      </g>
    </Svg>
  );
}
