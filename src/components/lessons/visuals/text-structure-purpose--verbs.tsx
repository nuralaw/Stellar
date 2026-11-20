import { C, Css, Svg } from "./kit";

// Text structure and purpose, "The job verbs": choices name a sentence's job with a verb; the verbs run from agreeing to pushing back.
export const alt = "A scale of job verbs from builds the point to pushes back: supports, concedes, qualifies, undermines, refutes. The sentence Admittedly, a turbine can hum points to concedes.";

const P = "v-text-structure-purpose--verbs-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.v-text-structure-purpose--verbs-a { animation: 10s ease-in-out infinite; }
.v-text-structure-purpose--verbs-scene { animation-name: v-text-structure-purpose--verbs-scene; }
@keyframes v-text-structure-purpose--verbs-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("scale", 4)}
${show("sent", 30)}
.v-text-structure-purpose--verbs-arrow { stroke-dasharray: 100; animation-name: v-text-structure-purpose--verbs-arrow; }
@keyframes v-text-structure-purpose--verbs-arrow { 0%, 44% { stroke-dashoffset: 100 } 54%, 100% { stroke-dashoffset: 0 } }
.v-text-structure-purpose--verbs-head { animation-name: v-text-structure-purpose--verbs-head; }
@keyframes v-text-structure-purpose--verbs-head { 0%, 52% { opacity: 0 } 56%, 100% { opacity: 1 } }
.v-text-structure-purpose--verbs-dot { fill: ${C.primary}; animation-name: v-text-structure-purpose--verbs-dot; }
@keyframes v-text-structure-purpose--verbs-dot { 0%, 54% { fill: ${C.fill} } 60%, 100% { fill: ${C.primary} } }
.v-text-structure-purpose--verbs-word { fill: ${C.primaryText}; animation-name: v-text-structure-purpose--verbs-word; }
@keyframes v-text-structure-purpose--verbs-word { 0%, 54% { fill: ${C.ink} } 60%, 100% { fill: ${C.primaryText} } }
`;

const AXIS_Y = 104;
const TICKS = [
  { x: 48, word: "supports", above: true },
  { x: 104, word: "concedes", above: false, active: true },
  { x: 160, word: "qualifies", above: true },
  { x: 216, word: "undermines", above: false },
  { x: 272, word: "refutes", above: true },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-scene`}>
        <g className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-scale`}>
          <path d={`M24 ${AXIS_Y} H296`} stroke={C.muted} strokeWidth={2} fill="none" />
          {TICKS.map((t) => (
            <g key={t.word}>
              {t.active ? (
                <circle className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-dot`} cx={t.x} cy={AXIS_Y} r={6} stroke={C.primary} strokeWidth={2} />
              ) : (
                <circle cx={t.x} cy={AXIS_Y} r={5} fill={C.fill} stroke={C.muted} strokeWidth={2} />
              )}
              <text
                className={t.active ? `v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-word` : undefined}
                x={t.x}
                y={t.above ? AXIS_Y - 14 : AXIS_Y + 24}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={t.active ? undefined : C.ink}
              >
                {t.word}
              </text>
            </g>
          ))}
          <text x={24} y={156} fontSize={11} fill={C.muted}>
            builds the point
          </text>
          <path d="M120 152 H196 M190 148 L197 152 L190 156" stroke={C.muted} strokeWidth={1.5} fill="none" />
          <text x={296} y={156} textAnchor="end" fontSize={11} fill={C.muted}>
            pushes back
          </text>
        </g>

        {/* The sentence and its verb */}
        <g className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-sent`}>
          <rect x={16} y={14} width={188} height={26} rx={13} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={110} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            Admittedly, a turbine can hum.
          </text>
        </g>
        <path className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-arrow`} d="M104 42 V84" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path className={`v-text-structure-purpose--verbs-a v-text-structure-purpose--verbs-head`} d="M98 78 L104 86 L110 78" fill="none" stroke={C.primary} strokeWidth={2} />
      </g>
    </Svg>
  );
}
