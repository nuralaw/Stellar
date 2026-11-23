import { C, Css, Svg } from "./kit";

// The Check Your Work screen: repair order is blanks first, then flagged questions that have an answer, then the rest
// only with a reason. Spare time stays in this module.
export const alt =
  "The Check Your Work screen shows question squares 1 to 27. A blank question 12 is filled first, then flagged question 26 is reviewed, then the rest only with a reason. Spare time stays in this module.";

const L = "v-pacing-and-guessing--check-screen-";

const SQ = 22;
const STEP = 25;
const GX = 16;
const GY = 30;
const pos = (n: number) => {
  const i = n - 1;
  return { x: GX + (i % 9) * STEP, y: GY + Math.floor(i / 9) * STEP };
};
const Q12 = pos(12);
const Q26 = pos(26);

const css = `
.v-pacing-and-guessing--check-screen-a { animation: 11s ease-in-out infinite; }
.v-pacing-and-guessing--check-screen-scene { animation-name: ${L}scene; }
@keyframes ${L}scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-pacing-and-guessing--check-screen-grid { animation-name: ${L}grid; }
@keyframes ${L}grid { 0%, 4% { opacity: 0 } 11%, 100% { opacity: 1 } }
.v-pacing-and-guessing--check-screen-side { animation-name: ${L}side; }
@keyframes ${L}side { 0%, 10% { opacity: 0 } 16%, 100% { opacity: 1 } }

/* The clock ticks down slowly: 4:00, 3:40, 3:10 */
.v-pacing-and-guessing--check-screen-k1 { opacity: 0; animation-name: ${L}k1; }
@keyframes ${L}k1 { 0%, 10% { opacity: 0 } 15%, 28% { opacity: 1 } 33%, 100% { opacity: 0 } }
.v-pacing-and-guessing--check-screen-k2 { opacity: 0; animation-name: ${L}k2; }
@keyframes ${L}k2 { 0%, 30% { opacity: 0 } 35%, 58% { opacity: 1 } 63%, 100% { opacity: 0 } }
.v-pacing-and-guessing--check-screen-k3 { animation-name: ${L}k3; }
@keyframes ${L}k3 { 0%, 60% { opacity: 0 } 65%, 100% { opacity: 1 } }

/* Step 1: the blank is answered */
.v-pacing-and-guessing--check-screen-dash { opacity: 0; animation-name: ${L}dash; }
@keyframes ${L}dash { 0%, 22% { opacity: 1 } 27%, 100% { opacity: 0 } }
.v-pacing-and-guessing--check-screen-q12 { transform-box: fill-box; transform-origin: center; animation-name: ${L}q12; }
@keyframes ${L}q12 { 0%, 22% { fill: ${C.fill}; stroke: ${C.line}; transform: none } 27% { fill: ${C.soft}; stroke: ${C.primary}; transform: scale(1.18) } 34%, 100% { fill: ${C.soft}; stroke: ${C.primary}; transform: none } }
.v-pacing-and-guessing--check-screen-d12 { transform-box: fill-box; transform-origin: center; animation-name: ${L}d12; }
@keyframes ${L}d12 { 0%, 26% { opacity: 0; transform: scale(0) } 31% { opacity: 1; transform: scale(1.5) } 36%, 100% { opacity: 1; transform: scale(1) } }
.v-pacing-and-guessing--check-screen-s1 { animation-name: ${L}s1; }
@keyframes ${L}s1 { 0%, 20% { opacity: 0 } 25%, 100% { opacity: 1 } }

/* Step 2: the flagged one gets a second look */
.v-pacing-and-guessing--check-screen-q26 { transform-box: fill-box; transform-origin: center; animation-name: ${L}q26; }
@keyframes ${L}q26 { 0%, 42% { fill: ${C.fill}; stroke: ${C.line}; transform: none } 47% { fill: ${C.soft}; stroke: ${C.primary}; transform: scale(1.12) } 54%, 100% { fill: ${C.soft}; stroke: ${C.primary}; transform: none } }
.v-pacing-and-guessing--check-screen-mag { animation-name: ${L}mag; }
@keyframes ${L}mag { 0%, 44% { opacity: 0 } 49%, 100% { opacity: 1 } }
.v-pacing-and-guessing--check-screen-s2 { animation-name: ${L}s2; }
@keyframes ${L}s2 { 0%, 40% { opacity: 0 } 45%, 100% { opacity: 1 } }

/* Step 3 */
.v-pacing-and-guessing--check-screen-s3 { animation-name: ${L}s3; }
@keyframes ${L}s3 { 0%, 64% { opacity: 0 } 69%, 100% { opacity: 1 } }
`;

const NUMS = Array.from({ length: 27 }, (_, i) => i + 1);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-scene`}>
        <text x={16} y={20} fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          Check Your Work
        </text>

        {/* The grid of question squares */}
        <g className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-grid`}>
          {NUMS.map((n) => {
            const { x, y } = pos(n);
            const special = n === 12 || n === 26;
            return (
              <g key={n}>
                <rect
                  className={n === 12 ? `v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-q12` : n === 26 ? `v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-q26` : undefined}
                  x={x}
                  y={y}
                  width={SQ}
                  height={SQ}
                  rx={5}
                  fill={special ? C.soft : C.fill}
                  stroke={n === 12 || n === 26 ? C.primary : C.line}
                  strokeWidth={n === 12 ? 2.5 : 1.5}
                />
                <text x={x + SQ / 2} y={y + 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
                  {n}
                </text>
                {n === 12 ? (
                  <circle className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-d12`} cx={x + SQ / 2} cy={y + 16} r={3} fill={C.primary} />
                ) : n === 26 ? (
                  <>
                    <path d={`M${x + 4} ${y + 13} V${y + 19.5}`} stroke={C.ink} strokeWidth={1.2} fill="none" />
                    <path d={`M${x + 4} ${y + 13} H${x + 9} L${x + 7.5} ${y + 15} L${x + 9} ${y + 17} H${x + 4}`} fill={C.primary} stroke="none" />
                    <circle cx={x + 16} cy={y + 16} r={3} fill={C.primary} />
                  </>
                ) : (
                  <circle cx={x + SQ / 2} cy={y + 16} r={3} fill={C.muted} />
                )}
              </g>
            );
          })}
          {/* question 12 starts blank: dashed outline, empty */}
          <rect className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-dash`} x={Q12.x} y={Q12.y} width={SQ} height={SQ} rx={5} fill={C.bg} stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 2.5" />
          <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-dash`} x={Q12.x + SQ / 2} y={Q12.y + 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
            12
          </text>
          {/* magnifier on question 26 */}
          <g className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-mag`} fill="none" stroke={C.ink} strokeWidth={1.5}>
            <circle cx={Q26.x + 5} cy={Q26.y + 28} r={3.5} fill={C.bg} />
            <line x1={Q26.x + 7.5} y1={Q26.y + 30.5} x2={Q26.x + 11} y2={Q26.y + 34} />
          </g>
        </g>

        {/* Legend */}
        <g className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-side`}>
          <rect x={16} y={110} width={9} height={9} rx={2.5} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="2 1.8" />
          <text x={30} y={118.5} fontSize={11} fill={C.muted} stroke="none">
            blank
          </text>
          <path d="M66 109 V119 M66 109 H73 L71 112.5 L73 116 H66" fill={C.primary} stroke={C.ink} strokeWidth={1.2} />
          <text x={78} y={118.5} fontSize={11} fill={C.muted} stroke="none">
            flagged
          </text>

          {/* Timer and the module 2 box: spare time does not carry over */}
          <rect x={250} y={30} width={54} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-k1`} x={277} y={45} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            4:00
          </text>
          <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-k2`} x={277} y={45} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            3:40
          </text>
          <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-k3`} x={277} y={45} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            3:10
          </text>
          <path d="M277 57 V76 M273 72 L277 77 L281 72" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <path d="M271 62 L283 72 M283 62 L271 72" stroke={C.bad} strokeWidth={2} />
          <rect x={250} y={81} width={54} height={22} rx={6} fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="3 2.5" />
          <text x={277} y={96} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            module 2
          </text>
          <text x={304} y={120} textAnchor="end" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
            spare time stays
          </text>
          <text x={304} y={133} textAnchor="end" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
            in this module
          </text>
        </g>

        {/* Repair order, one step at a time */}
        <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-s1`} x={16} y={137} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          <tspan fill={C.primaryText}>1</tspan>
          <tspan dx={7}>blanks first</tspan>
        </text>
        <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-s2`} x={16} y={152} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          <tspan fill={C.primaryText}>2</tspan>
          <tspan dx={7}>flagged with an answer</tspan>
        </text>
        <text className={`v-pacing-and-guessing--check-screen-a v-pacing-and-guessing--check-screen-s3`} x={16} y={167} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          <tspan fill={C.primaryText} fontWeight={700}>
            3
          </tspan>
          <tspan dx={7}>the rest, only with a reason</tspan>
        </text>
      </g>
    </Svg>
  );
}
