import { C, Css, Svg } from "./kit";

// Fill the blanks first: with 50 s left and ~80 s needed per question, solving is out; a blank scores 0, a guess has
// a 1 in 4 chance. Click an answer on every blank, then spend the leftover seconds on one question.
export const alt =
  "With 50 seconds left and three blank questions that each need about 80 seconds, there is no time to solve. Guess all three: a blank is 0, a guess is 1 in 4. Spend leftover time on question 24.";

const L = "v-pacing-and-guessing--fill-blanks-";

const STEP = 28;
const X0 = 16;
const TY = 18;
const TW = 24;
const TH = 34;
const NUMS = [18, 19, 20, 21, 22, 23, 24, 25, 26];
const tx = (i: number) => X0 + i * STEP;

const pops = [0, 1, 2]
  .map((k) => {
    const t = 40 + k * 5;
    return `.v-pacing-and-guessing--fill-blanks-p${k} { transform-box: fill-box; transform-origin: center; animation-name: ${L}p${k}; }
@keyframes ${L}p${k} { 0%, ${t}% { opacity: 0; transform: scale(0) } ${t + 2.5}% { opacity: 1; transform: scale(1.4) } ${t + 5}%, 100% { opacity: 1; transform: scale(1) } }`;
  })
  .join("\n");

const css = `
.v-pacing-and-guessing--fill-blanks-a { animation: 11s ease-in-out infinite; }
.v-pacing-and-guessing--fill-blanks-scene { animation-name: ${L}scene; }
@keyframes ${L}scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Phase 2: no time to solve (transient, hidden in the still frame) */
.v-pacing-and-guessing--fill-blanks-no { opacity: 0; animation-name: ${L}no; }
@keyframes ${L}no { 0%, 14% { opacity: 0 } 19%, 34% { opacity: 1 } 39%, 100% { opacity: 0 } }

/* Phase 3: three quick clicks */
${pops}
.v-pacing-and-guessing--fill-blanks-cnt { opacity: 0; animation-name: ${L}cnt; }
@keyframes ${L}cnt { 0%, 55% { opacity: 0 } 59%, 66% { opacity: 1 } 70%, 100% { opacity: 0 } }

/* Phase 4: the outcome cards, the leftover seconds, the pencil on 24 */
.v-pacing-and-guessing--fill-blanks-c1 { animation-name: ${L}c1; }
@keyframes ${L}c1 { 0%, 68% { opacity: 0 } 73%, 100% { opacity: 1 } }
.v-pacing-and-guessing--fill-blanks-c2 { animation-name: ${L}c2; }
@keyframes ${L}c2 { 0%, 72% { opacity: 0 } 77%, 100% { opacity: 1 } }
.v-pacing-and-guessing--fill-blanks-left { animation-name: ${L}left; }
@keyframes ${L}left { 0%, 78% { opacity: 0 } 83%, 100% { opacity: 1 } }
.v-pacing-and-guessing--fill-blanks-bar { transform-box: fill-box; transform-origin: left center; animation-name: ${L}bar; }
@keyframes ${L}bar { 0%, 79% { transform: scaleX(0) } 85%, 100% { transform: scaleX(1) } }
.v-pacing-and-guessing--fill-blanks-pen { animation-name: ${L}pen; }
@keyframes ${L}pen { 0%, 84% { opacity: 0; transform: translate(-6px, 6px) } 89%, 100% { opacity: 1; transform: none } }
.v-pacing-and-guessing--fill-blanks-fin { animation-name: ${L}fin; }
@keyframes ${L}fin { 0%, 86% { opacity: 0 } 91%, 100% { opacity: 1 } }
`;

const pencil = (
  <g fill={C.bg} strokeWidth={1.5}>
    <path d="M-7 5 L5 -7 L8 -4 L-4 8 L-8 9 Z" />
    <path d="M3 -5 L6 -2" />
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-scene`}>
        {/* Row of questions: answered ones are filled, 24 to 26 are blank */}
        {NUMS.map((n, i) => {
          const blank = i >= 6;
          return (
            <g key={n}>
              <rect x={tx(i)} y={TY} width={TW} height={TH} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <text x={tx(i) + TW / 2} y={TY + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
                {n}
              </text>
              {blank ? (
                <>
                  <circle cx={tx(i) + TW / 2} cy={TY + 24} r={5.5} fill="none" stroke={C.muted} strokeWidth={1.5} />
                  <circle className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-p${i - 6}`} cx={tx(i) + TW / 2} cy={TY + 24} r={5.5} fill={C.primary} />
                </>
              ) : (
                <circle cx={tx(i) + TW / 2} cy={TY + 24} r={5.5} fill={C.muted} />
              )}
            </g>
          );
        })}

        {/* Countdown */}
        <rect x={272} y={TY + 7} width={32} height={20} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={288} y={TY + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          0:50
        </text>

        {/* Each blank needs about 80 s */}
        <path d={`M${tx(6)} ${TY + TH + 5} V${TY + TH + 9} H${tx(8) + TW} V${TY + TH + 5}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={(tx(6) + tx(8) + TW) / 2} y={TY + TH + 23} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
          each needs ~80 s
        </text>

        {/* Phase 2: solving is crossed out */}
        <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-no`}>
          <g transform="translate(30 96)" stroke={C.muted}>
            {pencil}
          </g>
          <line x1={20} y1={106} x2={40} y2={86} stroke={C.bad} strokeWidth={2.5} />
          <text x={52} y={100} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
            50 s &lt; 80 s: no time to solve
          </text>
        </g>

        {/* Phase 3 counter */}
        <text className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-cnt`} x={160} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
          +3 chances of 1 in 4
        </text>

        {/* Phase 4: blank versus guess */}
        <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-c1`}>
          <rect x={16} y={86} width={92} height={28} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={62} y={104} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.muted} stroke="none">
            blank = 0
          </text>
        </g>
        <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-c2`}>
          <rect x={116} y={86} width={128} height={28} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={180} y={104} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
            guess = 1 in 4
          </text>
        </g>

        {/* Leftover seconds go to question 24 only */}
        <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-left`}>
          <text x={16} y={133} fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            leftover seconds
          </text>
        </g>
        <rect className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-bar`} x={16} y={139} width={80} height={8} rx={4} fill={C.ink} />
        <g className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-pen`}>
          <g transform={`translate(${tx(6) + TW - 1} ${TY + TH - 1})`} stroke={C.primary}>
            {pencil}
          </g>
        </g>
        <text className={`v-pacing-and-guessing--fill-blanks-a v-pacing-and-guessing--fill-blanks-fin`} x={160} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          change the guess only if you solve it
        </text>
      </g>
    </Svg>
  );
}
