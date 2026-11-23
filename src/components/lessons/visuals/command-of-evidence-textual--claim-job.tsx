import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Claim first, then the job": the same finding supports for one verb and is the wrong job for another.
export const alt = "A passage with one claim sentence. The verb support tips a scale toward the finding that roofs were cooler. The verb weaken flips it: that finding is the wrong job, and no cooling at all wins.";

const P = "v-command-of-evidence-textual--claim-job-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("bars", 5)}
.@@claimBar { fill: ${C.soft}; stroke: ${C.primary}; animation-name: @@claimBar; }
@keyframes @@claimBar { 0%, 10% { fill: ${C.fill}; stroke: ${C.line} } 15%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
${show("arrow", 16)}
${k("sup", "0%, 16% { opacity: 0 } 22%, 46% { opacity: 1 } 50%, 100% { opacity: 0 }")}
.@@sup { opacity: 0; }
${k("weak", "0%, 46% { opacity: 0 } 52%, 100% { opacity: 1 }")}
${show("beamIn", 20)}
.@@beam { transform-box: view-box; transform-origin: 160px 120px; transform: rotate(6deg); animation-name: @@beam; }
@keyframes @@beam { 0%, 30% { transform: rotate(0) } 36%, 46% { transform: rotate(-6deg) } 54%, 62% { transform: rotate(0) } 68%, 100% { transform: rotate(6deg) } }
.@@c1 { transform-box: fill-box; transform-origin: center; transform: translate(0, -9px) rotate(6deg); animation-name: @@c1; }
@keyframes @@c1 {
  0%, 24% { opacity: 0; transform: translate(-14px, 0) rotate(0) }
  29%, 30% { opacity: 1; transform: translate(0, 0) rotate(0) }
  36%, 46% { opacity: 1; transform: translate(0, 9px) rotate(-6deg) }
  54%, 62% { opacity: 1; transform: translate(0, 0) rotate(0) }
  68%, 100% { opacity: 1; transform: translate(0, -9px) rotate(6deg) }
}
.@@c1Box { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: @@c1Box; }
@keyframes @@c1Box { 0%, 48% { fill: ${C.goodSoft}; stroke: ${C.good} } 54%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.@@c2 { transform-box: fill-box; transform-origin: center; transform: translate(0, 9px) rotate(6deg); animation-name: @@c2; }
@keyframes @@c2 {
  0%, 54% { opacity: 0; transform: translate(14px, 0) rotate(0) }
  60%, 62% { opacity: 1; transform: translate(0, 0) rotate(0) }
  68%, 100% { opacity: 1; transform: translate(0, 9px) rotate(6deg) }
}
.@@tick1 { opacity: 0; animation-name: @@tick1; }
@keyframes @@tick1 { 0%, 38% { opacity: 0 } 42%, 48% { opacity: 1 } 52%, 100% { opacity: 0 } }
${k("wrong", "0%, 52% { opacity: 0 } 58%, 100% { opacity: 1 }")}
${k("tick2", "0%, 70% { opacity: 0 } 75%, 100% { opacity: 1 }")}
${show("cap", 80)}
`.replaceAll("@@", P);

function Tick({ x, cn }: { x: number; cn: string }) {
  return <path className={cls("a", cn)} d={`M${x - 8} 144 l5 6 l11 -12`} fill="none" stroke={C.good} strokeWidth={2.5} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* the passage as bars */}
        <g className={cls("a", "bars")}>
          <rect x={16} y={16} width={134} height={16} rx={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={28} fontSize={11} fontWeight={600} fill={C.muted}>background</text>
          <rect className={cls("a", "claimBar")} x={16} y={36} width={134} height={18} rx={5} strokeWidth={2} />
          <text x={24} y={49} fontSize={12} fontWeight={700} fill={C.primaryText}>claim</text>
          <rect x={16} y={58} width={134} height={16} rx={5} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={70} fontSize={11} fontWeight={600} fill={C.muted}>background</text>
        </g>

        {/* the verb */}
        <g className={cls("a", "arrow")}>
          <path d="M154 45 H194 M188 40 L194 45 L188 50" fill="none" stroke={C.muted} strokeWidth={1.5} />
        </g>
        <g className={cls("a", "sup")}>
          <rect x={200} y={31} width={104} height={28} rx={14} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={252} y={50} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText}>support</text>
        </g>
        <g className={cls("a", "weak")}>
          <rect x={200} y={31} width={104} height={28} rx={14} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={252} y={50} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText}>weaken</text>
        </g>

        {/* the scale */}
        <g className={cls("a", "beamIn")}>
          <path d="M160 120 L148 140 H172 Z" fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <g className={cls("a", "beam")}>
            <path d="M16 120 H304" stroke={C.ink} strokeWidth={3} fill="none" />
          </g>
        </g>

        <g className={cls("a", "c1")}>
          <rect className={cls("a", "c1Box")} x={16} y={88} width={112} height={32} rx={8} strokeWidth={1.5} />
          <text x={72} y={102} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>roofs with gardens</text>
          <text x={72} y={115} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>4°C cooler</text>
        </g>
        <g className={cls("a", "c2")}>
          <rect x={192} y={88} width={112} height={32} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={248} y={102} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>no cooling</text>
          <text x={248} y={115} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>at all</text>
        </g>

        <Tick x={72} cn="tick1" />
        <text className={cls("a", "wrong")} x={72} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bad}>wrong job</text>
        <Tick x={248} cn="tick2" />

        <text className={cls("a", "cap")} x={160} y={166} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
          Claim first. Verb second. Then the choices.
        </text>
      </g>
    </Svg>
  );
}
