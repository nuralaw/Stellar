import { C, Css, Svg } from "./kit";

// Cross-text connections: one claim in Text 1; Text 2 can answer it three ways. The animation tries each answer in turn.
export const alt = "Text 1 says parks cool streets. Text 2 can agree (yes, 2 degrees), add a limit (only large ones: yes, but), or disagree (no, they don't). Each answer lights up in turn.";

const P = "v-cross-text-connections-";

/** Row k lights up (soft fill, accent outline) for a while, then goes back to neutral. */
const pulse = (n: string, t: number) => `.${P}${n} { fill: ${C.fill}; stroke: ${C.line}; animation-name: ${P}${n}; }
@keyframes ${P}${n} {
  0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} }
  ${t + 5}%, ${t + 22}% { fill: ${C.soft}; stroke: ${C.primary} }
  ${t + 28}%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}`;
const tag = (n: string, t: number) => `.${P}${n} { fill: ${C.muted}; animation-name: ${P}${n}; }
@keyframes ${P}${n} {
  0%, ${t}% { fill: ${C.muted} }
  ${t + 5}%, ${t + 22}% { fill: ${C.primary} }
  ${t + 28}%, 100% { fill: ${C.muted} }
}`;

const css = `
.v-cross-text-connections-a { animation: 9s ease-in-out infinite; }

.v-cross-text-connections-scene { animation-name: v-cross-text-connections-scene; }
@keyframes v-cross-text-connections-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Text 2 answers Text 1: the arrow */
.v-cross-text-connections-arrow { stroke-dasharray: 100; animation-name: v-cross-text-connections-arrow; }
@keyframes v-cross-text-connections-arrow { 0%, 6% { stroke-dashoffset: 100 } 14%, 100% { stroke-dashoffset: 0 } }

${pulse("r1", 14)}
${pulse("r2", 40)}
${pulse("r3", 66)}
${tag("t1", 14)}
${tag("t2", 40)}
${tag("t3", 66)}
`;

const ROWS = [
  { y: 36, said: "They do, by 2°C.", tag: "Agrees" },
  { y: 74, said: "Only large ones.", tag: "Yes, but" },
  { y: 112, said: "No, they don't.", tag: "Disagrees" },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={`v-cross-text-connections-a v-cross-text-connections-scene`}>
        {/* Text 1 */}
        <rect x={16} y={36} width={80} height={106} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={28} y={56} fontSize={11} fontWeight={600} fill={C.muted}>
          Text 1
        </text>
        <text fontSize={14} fontWeight={700} fill={C.ink}>
          <tspan x={28} y={84}>Parks</tspan>
          <tspan x={28} y={102}>cool</tspan>
          <tspan x={28} y={120}>streets.</tspan>
        </text>

        {/* Text 2 answers Text 1 */}
        <path className={`v-cross-text-connections-a v-cross-text-connections-arrow`} d="M110 89 H100" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path d="M105 83 L99 89 L105 95" fill="none" stroke={C.primary} strokeWidth={2} />

        <text x={116} y={26} fontSize={11} fontWeight={600} fill={C.muted}>
          Text 2 may say…
        </text>
        {ROWS.map((r, i) => (
          <g key={r.tag}>
            <rect className={`v-cross-text-connections-a v-cross-text-connections-r${i + 1}`} x={114} y={r.y} width={190} height={30} rx={9} strokeWidth={1.5} />
            <text x={124} y={r.y + 19} fontSize={12} fontWeight={600} fill={C.ink}>
              {r.said}
            </text>
            <text className={`v-cross-text-connections-a v-cross-text-connections-t${i + 1}`} x={296} y={r.y + 19} textAnchor="end" fontSize={11} fontWeight={700}>
              {r.tag}
            </text>
          </g>
        ))}
      </g>
    </Svg>
  );
}
