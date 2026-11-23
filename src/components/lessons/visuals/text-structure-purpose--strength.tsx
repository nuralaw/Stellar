import { C, Css, Svg } from "./kit";

// Verb strength: a text that says "usually" qualifies a claim; refutes is too strong.
export const alt =
  "A strength scale from mild to strong: supports, concedes, qualifies, challenges, refutes. The text says usually, so qualifies fits; refutes is rejected as too strong.";

const P = "v-text-structure-purpose--strength-";
const k = (n: string) => P + n;
const cls = (n: string) => `${k("a")} ${k(n)}`;

const show = (n: string, t: number) => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const draw = (n: string, t: number, d: number) => `.${k(n)} { stroke-dasharray: 100; animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 } }`;
const mark = (n: string, t: number) => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 } }`;

const css = `
.${k("a")} { animation: 11s ease-in-out infinite; }
.${k("scene")} { animation-name: ${k("scene")}; }
@keyframes ${k("scene")} { 0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("strip", 4)}
${show("scale", 8)}
.${k("hl")} { fill: ${C.primaryText}; animation-name: ${k("hl")}; }
@keyframes ${k("hl")} { 0%, 16% { fill: ${C.ink} } 22%, 100% { fill: ${C.primaryText} } }
${draw("p1", 26, 8)}
${mark("h1", 33)}
.${k("dot1")} { fill: ${C.primary}; animation-name: ${k("dot1")}; }
@keyframes ${k("dot1")} { 0%, 34% { fill: ${C.fill} } 40%, 100% { fill: ${C.primary} } }
.${k("lab1")} { fill: ${C.primaryText}; animation-name: ${k("lab1")}; }
@keyframes ${k("lab1")} { 0%, 34% { fill: ${C.ink} } 40%, 100% { fill: ${C.primaryText} } }
${draw("p2", 50, 8)}
${mark("h2", 57)}
.${k("dot2")} { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${k("dot2")}; }
@keyframes ${k("dot2")} { 0%, 58% { fill: ${C.fill}; stroke: ${C.muted} } 63%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.${k("lab2")} { fill: ${C.bad}; animation-name: ${k("lab2")}; }
@keyframes ${k("lab2")} { 0%, 58% { fill: ${C.ink} } 63%, 100% { fill: ${C.bad} } }
${show("note", 60)}
${show("cap", 76)}
`;

const AXIS_Y = 86;
const TICKS = [
  { word: "supports" },
  { word: "concedes" },
  { word: "qualifies", good: true },
  { word: "challenges" },
  { word: "refutes", bad: true },
];
const X0 = 48;
const STEP = 56;
const xOf = (i: number) => X0 + i * STEP;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The text strip */}
        <g className={cls("strip")}>
          <rect x={16} y={12} width={288} height={38} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={26} y={28} fontSize={12} fontWeight={600} fill={C.ink}>
            They <tspan className={cls("hl")}>usually</tspan> do land on their feet.
          </text>
          <text x={26} y={44} fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan className={cls("hl")}>But in very short falls</tspan>, they can&apos;t turn.
          </text>
        </g>

        {/* The strength scale */}
        <g className={cls("scale")}>
          <path d={`M24 ${AXIS_Y} H296`} stroke={C.muted} strokeWidth={2} fill="none" />
          {TICKS.map((t, i) => {
            const x = xOf(i);
            const row = i % 2 === 0 ? 108 : 124;
            const dotCls = t.good ? cls("dot1") : t.bad ? cls("dot2") : undefined;
            const labCls = t.good ? cls("lab1") : t.bad ? cls("lab2") : undefined;
            return (
              <g key={t.word}>
                <path d={`M${x} ${AXIS_Y + 5} V${row - 12}`} stroke={C.line} strokeWidth={1.5} fill="none" />
                <circle className={dotCls} cx={x} cy={AXIS_Y} r={5.5} fill={t.good || t.bad ? undefined : C.fill} stroke={t.good ? C.primary : t.bad ? C.bad : C.muted} strokeWidth={2} />
                <text className={labCls} x={x} y={row} textAnchor="middle" fontSize={12} fontWeight={700} fill={t.good || t.bad ? undefined : C.ink}>
                  {t.word}
                </text>
              </g>
            );
          })}
          <text x={16} y={146} fontSize={11} fill={C.muted}>
            mild
          </text>
          <path d="M44 142 H250 M244 138 L251 142 L244 146" stroke={C.muted} strokeWidth={1.5} fill="none" />
          <text x={304} y={146} textAnchor="end" fontSize={11} fill={C.muted}>
            strong
          </text>
        </g>

        {/* Pointer 1: onto qualifies */}
        <path className={cls("p1")} d={`M${xOf(2)} 51 V74`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path className={cls("h1")} d={`M${xOf(2) - 5} 69 L${xOf(2)} 75 L${xOf(2) + 5} 69`} fill="none" stroke={C.primary} strokeWidth={2} />

        {/* Pointer 2: onto refutes, rejected */}
        <path className={cls("p2")} d={`M${xOf(4)} 51 V74`} pathLength={100} fill="none" stroke={C.bad} strokeWidth={2} />
        <path className={cls("h2")} d={`M${xOf(4) - 5} 69 L${xOf(4)} 75 L${xOf(4) + 5} 69`} fill="none" stroke={C.bad} strokeWidth={2} />
        <g className={cls("note")}>
          <text x={xOf(4) - 10} y={68} textAnchor="end" fontSize={12} fontWeight={700} fill={C.bad}>
            too strong
          </text>
        </g>

        <g className={cls("cap")}>
          <text x={160} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            Match the verb to how far the text goes
          </text>
        </g>
      </g>
    </Svg>
  );
}
