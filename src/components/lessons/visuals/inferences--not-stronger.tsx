import { C, Css, Svg } from "./kit";

// Inferences, "Not stronger than the evidence": compare each choice's strength with the facts, not with a hedge word.
export const alt = "A ceiling sits at the evidence's height. Helps every runner pokes above it: too strong. Has no effect points the other way: against the facts. May help some runners fits under the line.";

const P = "v-inferences--not-stronger-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const grow = (n: string, t: number, origin: string) => `.@@${n} { transform-box: fill-box; transform-origin: ${origin}; animation-name: @@${n}; }\n@keyframes @@${n} { 0%, ${t}% { transform: scaleX(0) } ${t + 5}%, 100% { transform: scaleX(1) } }`;

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("ev", 5)}
.@@ceil { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@ceil; }
@keyframes @@ceil { 0%, 12% { stroke-dashoffset: 100 } 19%, 100% { stroke-dashoffset: 0 } }
${show("la", 20)}
${show("lb", 24)}
${show("lc", 28)}
${grow("bB", 32, "left center")}
${grow("bBx", 37, "left center")}
${show("sB", 42)}
${grow("bC", 46, "right center")}
${show("sC", 52)}
${grow("bA", 56, "left center")}
.@@bAfill { fill: ${C.good}; animation-name: @@bAfill; }
@keyframes @@bAfill { 0%, 62% { fill: ${C.muted} } 67%, 100% { fill: ${C.good} } }
${show("sA", 66)}
${show("t1", 72)}
${show("t2", 78)}
${show("cap", 86)}
`.replaceAll("@@", P);

const Label = ({ y, text, cn }: { y: number; text: string; cn: string }) => (
  <text className={cls("a", cn)} x={16} y={y} fontSize={11} fontWeight={600} fill={C.ink}>{text}</text>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <path d="M148 30 V108" stroke={C.line} strokeWidth={1.5} fill="none" />

        {/* the evidence sets the ceiling */}
        <g className={cls("a", "ev")}>
          <text x={16} y={26} fontSize={11} fontWeight={700} fill={C.muted}>evidence: 20 volunteers, one week</text>
          <rect x={148} y={32} width={60} height={7} rx={3} fill={C.ink} />
        </g>
        <path className={cls("a", "ceil")} pathLength={100} d="M208 32 V92" stroke={C.primary} strokeWidth={2} strokeDasharray="100" fill="none" />

        {/* may help some runners: fits */}
        <Label y={54} text="may help some runners" cn="la" />
        <rect className={cls("a", "bA", "bAfill")} x={148} y={58} width={52} height={7} rx={3} />
        <text className={cls("a", "sA")} x={216} y={54} fontSize={11} fontWeight={700} fill={C.good}>matches</text>

        {/* helps every runner: too strong */}
        <Label y={76} text="helps every runner" cn="lb" />
        <rect className={cls("a", "bB")} x={148} y={80} width={60} height={7} rx={3} fill={C.muted} />
        <rect className={cls("a", "bBx")} x={208} y={80} width={70} height={7} rx={3} fill={C.bad} />
        <text className={cls("a", "sB")} x={216} y={76} fontSize={11} fontWeight={700} fill={C.bad}>too strong</text>

        {/* has no effect: against the facts */}
        <Label y={98} text="has no effect" cn="lc" />
        <rect className={cls("a", "bC")} x={104} y={102} width={44} height={7} rx={3} fill={C.primary} />
        <text className={cls("a", "sC")} x={158} y={98} fontSize={11} fontWeight={700} fill={C.primaryText}>against the facts</text>

        {/* a stated fact: a firm statement fits */}
        <g className={cls("a", "t1")}>
          <rect x={16} y={118} width={150} height={28} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={130} fontSize={11} fontWeight={600} fill={C.muted}>evidence: the text states</text>
          <text x={24} y={142} fontSize={11} fontWeight={700} fill={C.ink}>the fact outright</text>
        </g>
        <g className={cls("a", "t2")}>
          <path d="M170 132 H182 M178 128 L182 132 L178 136" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <rect x={186} y={118} width={118} height={28} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={194} y={130} fontSize={11} fontWeight={600} fill={C.muted}>firm, no hedge</text>
          <text x={194} y={142} fontSize={11} fontWeight={700} fill={C.good}>also fits</text>
        </g>

        <text className={cls("a", "cap")} x={160} y={162} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>Match the facts, not the hedge word.</text>
      </g>
    </Svg>
  );
}
