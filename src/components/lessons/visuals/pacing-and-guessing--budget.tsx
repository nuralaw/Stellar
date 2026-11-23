import { C, Css, Svg, Tex } from "./kit";

// Time budget: module time / number of questions; a pace check divides the time LEFT by the questions LEFT.
export const alt =
  "Time per question: R&W is 32 minutes over 27 questions, about 71 seconds; Math is 35 minutes over 22, about 95. At question 8 with 20 minutes left, 1200 divided by 15 is 80 seconds: a little behind.";

const L = "v-pacing-and-guessing--budget-";

// Geometry (canvas units). One second of Math time = 288 / 2100 units.
const X0 = 16;
const BW = 288;
const RW_N = 27;
const M_N = 22;
const RW_SW = BW / RW_N;
const M_SW = BW / M_N;
const RW_Y = 22;
const M_Y = 90;
const BH = 12;
const MH = 14;
const CUR = X0 + (900 / 2100) * BW; // 15 min used of 35: x = 139.4
const THIN = (80 / 2100) * BW; // 80 s slice width, 10.97

const RW_LIT = 20;
const M_LIT = 17;

const css = `
.v-pacing-and-guessing--budget-a { animation: 11s ease-in-out infinite; }
.v-pacing-and-guessing--budget-scene { animation-name: ${L}scene; }
@keyframes ${L}scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }

.v-pacing-and-guessing--budget-slices { animation-name: ${L}slices; }
@keyframes ${L}slices { 0%, 5% { opacity: 0 } 11%, 100% { opacity: 1 } }

/* Phase 2: one slice of each bar lights up and grows */
.v-pacing-and-guessing--budget-lit1 { transform-box: fill-box; transform-origin: center; transform: scaleY(1.6); animation-name: ${L}lit1; }
@keyframes ${L}lit1 { 0%, 14% { transform: none; fill: ${C.muted} } 20%, 36% { transform: scaleY(1.6); fill: ${C.primary} } 42%, 100% { transform: scaleY(1.6); fill: ${C.muted} } }
.v-pacing-and-guessing--budget-t1 { animation-name: ${L}t1; }
@keyframes ${L}t1 { 0%, 18% { opacity: 0 } 23%, 100% { opacity: 1 } }
.v-pacing-and-guessing--budget-f1 { opacity: 0; animation-name: ${L}f1; }
@keyframes ${L}f1 { 0%, 20% { opacity: 0 } 25%, 44% { opacity: 1 } 49%, 100% { opacity: 0 } }
.v-pacing-and-guessing--budget-lit2 { opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: ${L}lit2; }
@keyframes ${L}lit2 { 0%, 24% { opacity: 0; transform: none } 29%, 46% { opacity: 1; transform: scaleY(1.6) } 51%, 100% { opacity: 0; transform: scaleY(1.6) } }
.v-pacing-and-guessing--budget-t2 { opacity: 0; animation-name: ${L}t2; }
@keyframes ${L}t2 { 0%, 28% { opacity: 0 } 33%, 46% { opacity: 1 } 51%, 100% { opacity: 0 } }
.v-pacing-and-guessing--budget-f2 { opacity: 0; animation-name: ${L}f2; }
@keyframes ${L}f2 { 0%, 30% { opacity: 0 } 35%, 46% { opacity: 1 } 51%, 100% { opacity: 0 } }

/* Phase 3: question 8, the used time is greyed */
.v-pacing-and-guessing--budget-used { transform-box: fill-box; transform-origin: left center; animation-name: ${L}used; }
@keyframes ${L}used { 0%, 52% { transform: scaleX(0) } 60%, 100% { transform: scaleX(1) } }
.v-pacing-and-guessing--budget-cur { animation-name: ${L}cur; }
@keyframes ${L}cur { 0%, 58% { opacity: 0 } 63%, 100% { opacity: 1 } }
.v-pacing-and-guessing--budget-br { stroke-dasharray: 100; animation-name: ${L}br; }
@keyframes ${L}br { 0%, 62% { stroke-dashoffset: 100 } 69%, 100% { stroke-dashoffset: 0 } }
.v-pacing-and-guessing--budget-bl { animation-name: ${L}bl; }
@keyframes ${L}bl { 0%, 66% { opacity: 0 } 71%, 100% { opacity: 1 } }

/* Phase 4: the remaining time over 15 slices */
.v-pacing-and-guessing--budget-thin { animation-name: ${L}thin; }
@keyframes ${L}thin { 0%, 73% { opacity: 0 } 79%, 100% { opacity: 1 } }
.v-pacing-and-guessing--budget-ref { animation-name: ${L}ref; }
@keyframes ${L}ref { 0%, 79% { opacity: 0 } 84%, 100% { opacity: 1 } }
.v-pacing-and-guessing--budget-f3 { animation-name: ${L}f3; }
@keyframes ${L}f3 { 0%, 82% { opacity: 0 } 87%, 100% { opacity: 1 } }
.v-pacing-and-guessing--budget-cap { animation-name: ${L}cap; }
@keyframes ${L}cap { 0%, 86% { opacity: 0; transform: translateY(3px) } 91%, 100% { opacity: 1; transform: none } }
`;

const rwSlices = Array.from({ length: RW_N }, (_, i) => i);
const mSlices = Array.from({ length: M_N }, (_, i) => i);
const thinSlices = Array.from({ length: 15 }, (_, i) => i);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-scene">
        {/* R&W: 32 min over 27 questions */}
        <text x={X0} y={16} fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
          R&amp;W: 32 min, 27 questions
        </text>
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-slices">
          {rwSlices.map((i) =>
            i === RW_LIT ? null : <rect key={i} x={X0 + i * RW_SW + 0.6} y={RW_Y} width={RW_SW - 1.2} height={BH} rx={1.5} fill={C.muted} />,
          )}
          <rect
            className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-lit1"
            x={X0 + RW_LIT * RW_SW + 0.6}
            y={RW_Y}
            width={RW_SW - 1.2}
            height={BH}
            rx={1.5}
            fill={C.muted}
          />
        </g>
        <text className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-t1" x={X0 + (RW_LIT + 0.5) * RW_SW} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          71 s
        </text>
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-f1">
          <Tex x={160} y={50} size={13} width={160} color={C.ink}>{String.raw`\dfrac{32\cdot 60}{27}\approx 71`}</Tex>
        </g>

        {/* Math: 35 min over 22 questions */}
        <text x={X0} y={73} fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
          Math: 35 min, 22 questions
        </text>
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-slices">
          {mSlices.map((i) => (
            <rect key={i} x={X0 + i * M_SW + 0.6} y={M_Y} width={M_SW - 1.2} height={MH} rx={1.5} fill={C.ink} />
          ))}
        </g>
        <rect className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-lit2" x={X0 + M_LIT * M_SW + 0.6} y={M_Y} width={M_SW - 1.2} height={MH} rx={1.5} fill={C.primary} />
        <text className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-t2" x={X0 + (M_LIT + 0.5) * M_SW} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          95 s
        </text>
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-f2">
          <Tex x={160} y={130} size={13} width={160} color={C.ink}>{String.raw`\dfrac{35\cdot 60}{22}\approx 95`}</Tex>
        </g>

        {/* Phase 4 sits under the grey: remaining 15 slices of 80 s */}
        <rect className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-thin" x={CUR} y={M_Y - 3} width={X0 + BW - CUR} height={MH + 6} fill={C.bg} />
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-thin">
          {thinSlices.map((j) => (
            <rect key={j} x={CUR + j * THIN + 0.6} y={M_Y} width={THIN - 1.2} height={MH} rx={1.5} fill={C.primary} />
          ))}
        </g>

        {/* Phase 3: time already used is greyed, a cursor marks question 8 */}
        <rect className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-used" x={X0} y={M_Y} width={CUR - X0} height={MH} rx={1.5} fill={C.line} />
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-cur">
          <line x1={CUR} y1={M_Y - 5} x2={CUR} y2={M_Y + MH + 8} stroke={C.ink} strokeWidth={1.5} />
          <text x={CUR - 5} y={126} textAnchor="end" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
            question 8 of 22
          </text>
        </g>
        <path className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-br" d={`M${CUR} 112 V116 H${X0 + BW} V112`} pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-bl" x={(CUR + X0 + BW) / 2} y={129} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
          20 min = 1200 s left
        </text>

        {/* Reference: the 95 s slice the remaining ones are measured against */}
        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-ref">
          <rect x={CUR} y={M_Y - 3} width={M_SW} height={MH + 6} rx={3} fill="none" stroke={C.ink} strokeWidth={1.5} strokeDasharray="3 2" />
          <text x={CUR + M_SW + 5} y={84} fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
            95 s
          </text>
        </g>

        <g className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-f3">
          <Tex x={X0} y={148} size={13} anchor="start" width={84} color={C.primaryText}>{String.raw`\dfrac{1200}{15}=80`}</Tex>
          <text x={112} y={146} fontSize={11} fill={C.muted} stroke="none">
            time left ÷ questions left
          </text>
        </g>
        <text className="v-pacing-and-guessing--budget-a v-pacing-and-guessing--budget-cap" x={112} y={163} fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
          80 s &lt; 95 s: a little behind
        </text>
      </g>
    </Svg>
  );
}
