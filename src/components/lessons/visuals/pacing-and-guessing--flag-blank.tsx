import { C, Css, Svg } from "./kit";

// Trap: flagging a blank. Question 14 is flagged but no answer is chosen. The timer runs out: a blank scores zero.
export const alt =
  "Question 14 is flagged but every answer circle is empty. The timer counts down to 0:00, the module closes, and the blank question scores 0 points. Fix: choose a guess, then flag.";

const P = "v-pacing-and-guessing--flag-blank-";
const A = P + "a";
const SCENE = P + "scene";
const FLAG = P + "flag";
const T1 = P + "t1";
const T2 = P + "t2";
const T3 = P + "t3";
const PANEL = P + "panel";
const ZERO = P + "zero";
const FIX = P + "fix";
const NOTE = P + "note";

const css = `
.v-pacing-and-guessing--flag-blank-a { animation: 10s ease-in-out infinite; }
.v-pacing-and-guessing--flag-blank-scene { animation-name: v-pacing-and-guessing--flag-blank-scene; }
@keyframes v-pacing-and-guessing--flag-blank-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the flag goes on, the answer stays empty */
.v-pacing-and-guessing--flag-blank-flag { transform-box: fill-box; transform-origin: left center; animation-name: v-pacing-and-guessing--flag-blank-flag; }
@keyframes v-pacing-and-guessing--flag-blank-flag { 0%, 12% { transform: scaleX(0) } 20%, 100% { transform: scaleX(1) } }

.v-pacing-and-guessing--flag-blank-note { animation-name: v-pacing-and-guessing--flag-blank-note; }
@keyframes v-pacing-and-guessing--flag-blank-note { 0%, 20% { opacity: 0 } 26%, 100% { opacity: 1 } }

/* Beat 2: the timer runs down */
.v-pacing-and-guessing--flag-blank-t1 { opacity: 0; animation-name: v-pacing-and-guessing--flag-blank-t1; }
@keyframes v-pacing-and-guessing--flag-blank-t1 { 0%, 28% { opacity: 1 } 32%, 100% { opacity: 0 } }
.v-pacing-and-guessing--flag-blank-t2 { opacity: 0; animation-name: v-pacing-and-guessing--flag-blank-t2; }
@keyframes v-pacing-and-guessing--flag-blank-t2 { 0%, 30% { opacity: 0 } 34%, 56% { opacity: 1 } 60%, 100% { opacity: 0 } }
.v-pacing-and-guessing--flag-blank-t3 { animation-name: v-pacing-and-guessing--flag-blank-t3; }
@keyframes v-pacing-and-guessing--flag-blank-t3 { 0%, 58% { opacity: 0 } 62%, 100% { opacity: 1 } }
.v-pacing-and-guessing--flag-blank-panel { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-pacing-and-guessing--flag-blank-panel; }
@keyframes v-pacing-and-guessing--flag-blank-panel { 0%, 58% { fill: ${C.fill}; stroke: ${C.line} } 64%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }

/* Beat 3: the result, then the fix */
.v-pacing-and-guessing--flag-blank-zero { animation-name: v-pacing-and-guessing--flag-blank-zero; }
@keyframes v-pacing-and-guessing--flag-blank-zero { 0%, 66% { opacity: 0; transform: translateY(4px) } 72%, 100% { opacity: 1; transform: none } }
.v-pacing-and-guessing--flag-blank-fix { animation-name: v-pacing-and-guessing--flag-blank-fix; }
@keyframes v-pacing-and-guessing--flag-blank-fix { 0%, 76% { opacity: 0 } 82%, 100% { opacity: 1 } }
`;

const LETTERS = ["A", "B", "C", "D"];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {/* The question card */}
        <rect x={16} y={22} width={186} height={110} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={30} y={48} fontSize={15} fontWeight={700} fill={C.ink}>
          Question 14
        </text>
        {/* The flag (Mark for Review) */}
        <line x1={176} y1={34} x2={176} y2={58} stroke={C.ink} strokeWidth={2.5} />
        <path className={`${A} ${FLAG}`} d="M177 35 L194 41 L177 48 Z" fill={C.primary} stroke={C.primary} strokeWidth={1.5} />
        {/* Four empty answer circles */}
        {LETTERS.map((l, i) => (
          <g key={l}>
            <circle cx={42 + i * 44} cy={92} r={14} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
            <text x={42 + i * 44} y={97} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.muted}>
              {l}
            </text>
          </g>
        ))}
        <text className={`${A} ${NOTE}`} x={30} y={124} fontSize={11} fill={C.muted}>
          flagged, no answer
        </text>

        {/* The timer */}
        <rect className={`${A} ${PANEL}`} x={216} y={22} width={88} height={56} rx={12} strokeWidth={1.5} />
        <text x={260} y={40} textAnchor="middle" fontSize={11} fill={C.muted}>
          time left
        </text>
        <g textAnchor="middle" fontSize={22} fontWeight={700}>
          <text className={`${A} ${T1}`} x={260} y={66} fill={C.ink}>
            0:25
          </text>
          <text className={`${A} ${T2}`} x={260} y={66} fill={C.ink}>
            0:10
          </text>
          <text className={`${A} ${T3}`} x={260} y={66} fill={C.bad}>
            0:00
          </text>
        </g>

        {/* The result */}
        <g className={`${A} ${ZERO}`}>
          <text x={260} y={104} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.bad}>
            Question 14
          </text>
          <text x={260} y={124} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.bad}>
            blank = 0
          </text>
        </g>
        <text className={`${A} ${FIX}`} x={160} y={160} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
          Fix: choose a guess, then flag
        </text>
      </g>
    </Svg>
  );
}
