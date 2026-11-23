import { C, Css, Svg } from "./kit";

// Inferences, "Use every fact": facts chain together; the right conclusion uses every fact, and a part that rests on no fact is a new idea.
export const alt = "Three fact tiles chain into one conclusion. A wrong choice has a part with no fact behind it: a new idea. The right choice splits into parts, and every part links back to a fact.";

const P = "v-inferences--use-every-fact-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("t1", 5)}
${show("t2", 11)}
${show("t3", 17)}
.@@arr { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@arr; }
@keyframes @@arr { 0%, 22% { stroke-dashoffset: 100 } 28%, 100% { stroke-dashoffset: 0 } }
.@@ln { stroke: ${C.good}; stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@ln; }
@keyframes @@ln { 0%, 30% { stroke-dashoffset: 100; stroke: ${C.muted} } 36%, 70% { stroke-dashoffset: 0; stroke: ${C.muted} } 78%, 100% { stroke-dashoffset: 0; stroke: ${C.good} } }
${k("merged", "0%, 36% { opacity: 0; transform: translateY(6px) } 42%, 66% { opacity: 1; transform: none } 72%, 100% { opacity: 0; transform: none }")}
.@@merged { opacity: 0; }
${show("chips", 68)}
${show("wrong", 46)}
.@@gap { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: @@gap; }
@keyframes @@gap { 0%, 56% { fill: ${C.fill}; stroke: ${C.line} } 62%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
${k("newIdea", "0%, 58% { opacity: 0 } 64%, 100% { opacity: 1 }")}
${k("backed", "0%, 78% { opacity: 0 } 84%, 100% { opacity: 1 }")}
${show("cap", 87)}
`.replaceAll("@@", P);

const COLS = [16, 117, 218];

function Tile({ x, n, l1, l2, cn }: { x: number; n: string; l1: string; l2: string; cn: string }) {
  return (
    <g className={cls("a", cn)}>
      <rect x={x} y={26} width={86} height={32} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <circle cx={x + 10} cy={26} r={7.5} fill={C.primary} />
      <text x={x + 10} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary}>{n}</text>
      <text x={x + 43} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>{l1}</text>
      <text x={x + 43} y={54} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>{l2}</text>
    </g>
  );
}

function Part({ x, y, text, cls: c, gap }: { x: number; y: number; text: string; cls?: string; gap?: boolean }) {
  return (
    <g>
      <rect className={gap ? cls("a", "gap") : undefined} x={x} y={y} width={86} height={20} rx={7} fill={gap ? C.badSoft : C.fill} stroke={gap ? C.bad : C.line} strokeWidth={1.5} strokeDasharray={gap ? "4 3" : undefined} />
      <text x={x + 43} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink} className={c}>{text}</text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <Tile x={COLS[0]} n="1" l1="drones" l2="scatter seeds" cn="t1" />
        <Tile x={COLS[1]} n="2" l1="loose soil:" l2="more sprouts" cn="t2" />
        <Tile x={COLS[2]} n="3" l1="Pell Ridge" l2="soil is loose" cn="t3" />
        <path className={cls("a", "arr")} pathLength={100} d="M104 42 H115 M111 38 L115 42 L111 46" fill="none" stroke={C.muted} strokeWidth={1.5} />
        <path className={cls("a", "arr")} pathLength={100} d="M205 42 H216 M212 38 L216 42 L212 46" fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* every fact flows into the conclusion */}
        {COLS.map((x) => (
          <path key={x} className={cls("a", "ln")} pathLength={100} d={`M${x + 43} 58 V68`} fill="none" strokeWidth={2.5} />
        ))}
        <g className={cls("a", "merged")}>
          <rect x={16} y={68} width={288} height={20} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>drone seeds at Pell Ridge may sprout well</text>
        </g>

        {/* the right choice, split into parts, each backed by a fact */}
        <g className={cls("a", "chips")}>
          {["drone seeds", "may sprout", "at Pell Ridge"].map((t, i) => (
            <g key={t}>
              <rect x={COLS[i]} y={68} width={86} height={20} rx={7} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
              <text x={COLS[i] + 43} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>{t}</text>
            </g>
          ))}
        </g>
        <text className={cls("a", "backed")} x={160} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.good}>every part backed</text>

        {/* a wrong choice: one part rests on no fact */}
        <g className={cls("a", "wrong")}>
          <Part x={COLS[0]} y={110} text="drones are" />
          <Part x={COLS[1]} y={110} text="the best way" gap />
          <Part x={COLS[2]} y={110} text="to plant seeds" />
        </g>
        <text className={cls("a", "newIdea")} x={160} y={142} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bad}>new idea</text>

        <text className={cls("a", "cap")} x={160} y={162} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>Point to the sentence for every part.</text>
      </g>
    </Svg>
  );
}
