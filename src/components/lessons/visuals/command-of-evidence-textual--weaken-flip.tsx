import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Flip it to weaken": the claim says shoe -> faster, so look for the same gain without the shoe.
export const alt = "The claim says a new shoe makes runners faster. Old shoes dropped 8 seconds too, the same gain, so the claim cracks: another cause. A finding that supports the claim is the wrong job.";

const P = "v-command-of-evidence-textual--weaken-flip-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("claim", 5)}
.@@claimBar { opacity: 0.55; animation-name: @@claimBar; }
@keyframes @@claimBar { 0%, 54% { opacity: 1 } 60%, 100% { opacity: 0.55 } }
.@@crack { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@crack; }
@keyframes @@crack { 0%, 54% { stroke-dashoffset: 100 } 60%, 100% { stroke-dashoffset: 0 } }
${show("lanes", 10)}
.@@bar1 { transform-box: fill-box; transform-origin: left center; animation-name: @@bar1; }
@keyframes @@bar1 { 0%, 18% { transform: scaleX(1.3) } 26%, 100% { transform: scaleX(1) } }
.@@bar2 { transform-box: fill-box; transform-origin: left center; animation-name: @@bar2; }
@keyframes @@bar2 { 0%, 40% { transform: scaleX(1.3) } 46%, 100% { transform: scaleX(1) } }
${k("gh1", "0%, 22% { opacity: 0 } 28%, 100% { opacity: 1 }")}
${k("gh2", "0%, 44% { opacity: 0 } 50%, 100% { opacity: 1 }")}
.@@find { opacity: 0; animation-name: @@find; }
@keyframes @@find { 0%, 30% { opacity: 0; transform: translateX(-16px) } 36%, 58% { opacity: 1; transform: none } 64%, 100% { opacity: 0; transform: none } }
${k("brace", "0%, 50% { opacity: 0 } 56%, 100% { opacity: 1 }")}
${show("tags", 62)}
.@@lit { fill: ${C.soft}; stroke: ${C.primary}; animation-name: @@lit; }
@keyframes @@lit { 0%, 70% { fill: ${C.fill}; stroke: ${C.line} } 75%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.@@litTx { fill: ${C.primaryText}; animation-name: @@litTx; }
@keyframes @@litTx { 0%, 70% { fill: ${C.muted} } 75%, 100% { fill: ${C.primaryText} } }
.@@grey { animation-name: @@grey; }
@keyframes @@grey { 0%, 78% { opacity: 0; transform: translateX(-24px) } 84% { opacity: 1; transform: translateX(8px) } 88%, 100% { opacity: 1; transform: none } }
${k("wrong", "0%, 86% { opacity: 0 } 91%, 100% { opacity: 1 }")}
`.replaceAll("@@", P);

function Tag({ x, y, text, lit }: { x: number; y: number; text: string; lit?: boolean }) {
  return (
    <>
      <rect className={lit ? cls("a", "lit") : undefined} x={x} y={y} width={140} height={20} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text className={lit ? cls("a", "litTx") : undefined} x={x + 70} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
        {text}
      </text>
    </>
  );
}

function Lane({ y, label, cn, gh }: { y: number; label: string; cn: string; gh: string }) {
  return (
    <>
      <text x={16} y={y + 12} fontSize={11} fontWeight={600} fill={C.muted}>{label}</text>
      <rect className={cls("a", cn)} x={100} y={y} width={90} height={16} rx={5} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      <g className={cls("a", gh)}>
        <rect x={190} y={y} width={27} height={16} rx={5} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={203.5} y={y + 12} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>−8 s</text>
      </g>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* the claim */}
        <g className={cls("a", "claim")}>
          <g className={cls("a", "claimBar")}>
            <rect x={76} y={14} width={168} height={22} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={2} />
            <text x={146} y={30} textAnchor="end" fontSize={13} fontWeight={700} fill={C.ink}>new shoe</text>
            <path d="M152 25 H172 M167 21 L172 25 L167 29" fill="none" stroke={C.primaryText} strokeWidth={1.5} />
            <text x={178} y={30} fontSize={13} fontWeight={700} fill={C.ink}>faster</text>
          </g>
          <path className={cls("a", "crack")} pathLength={100} d="M160 12 L155 20 L164 26 L156 33 L160 40" fill="none" stroke={C.bad} strokeWidth={2} />
        </g>

        {/* the two lanes */}
        <g className={cls("a", "lanes")}>
          <Lane y={44} label="with new shoe" cn="bar1" gh="gh1" />
          <Lane y={66} label="old shoes" cn="bar2" gh="gh2" />
        </g>
        <g className={cls("a", "brace")}>
          <path d="M226 44 h5 v38 h-5" fill="none" stroke={C.primaryText} strokeWidth={2} />
          <text x={238} y={67} fontSize={11} fontWeight={700} fill={C.primaryText}>same gain</text>
        </g>

        {/* the finding that slides in, then leaves */}
        <g className={cls("a", "find")}>
          <rect x={16} y={96} width={288} height={26} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={160} y={113} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>old shoes also dropped 8 s</text>
        </g>

        {/* four weakening patterns */}
        <g className={cls("a", "tags")}>
          <Tag x={16} y={92} text="opposite result" />
          <Tag x={164} y={92} text="no difference" />
          <Tag x={16} y={116} text="another cause" lit />
          <Tag x={164} y={116} text="step missing" />
        </g>

        {/* a supporting finding is the wrong job */}
        <g className={cls("a", "grey")}>
          <rect x={16} y={140} width={150} height={20} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={91} y={154} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>supports the claim</text>
        </g>
        <text className={cls("a", "wrong")} x={178} y={154} fontSize={11} fontWeight={700} fill={C.bad}>wrong job</text>
      </g>
    </Svg>
  );
}
