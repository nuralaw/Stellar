import { C, Css, Svg } from "./kit";

// FANBOYS: the seven joining words (For, And, Nor, But, Or, Yet, So). Each letter shows its word, then
// "full sentence , FANBOYS full sentence" joins two clauses with a big comma and the conjunction locks in green.
// A short example below shows the pattern at work.
export const alt =
  "The letters F A N B O Y S each show their word: For, And, Nor, But, Or, Yet, So. Two full sentences are joined by a big comma and a FANBOYS word that locks in green, as in: It rained, but we played.";

const P = "v-boundaries--fanboys-";
const A = P + "a";
const SCENE = P + "scene";
const LET = P + "l";
const WORD = P + "w";
const BOX = P + "box";
const COMMA = P + "comma";
const JOIN = P + "join";
const LOCK = P + "lock";
const EX = P + "ex";

const LETTERS = ["F", "A", "N", "B", "O", "Y", "S"];
const WORDS = ["For", "And", "Nor", "But", "Or", "Yet", "So"];
const X0 = 41;
const DX = 39.7;

const letterCss = LETTERS.map((_, i) => {
  const t = 6 + i * 3;
  const w = 30 + i * 2;
  return `.${LET}${i} { animation-name: ${LET}${i}; }
@keyframes ${LET}${i} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 4}%, 100% { opacity: 1; transform: none } }
.${WORD}${i} { animation-name: ${WORD}${i}; }
@keyframes ${WORD}${i} { 0%, ${w}% { opacity: 0 } ${w + 4}%, 100% { opacity: 1 } }`;
}).join("\n");

const css = `
.v-boundaries--fanboys-a { animation: 10s ease-in-out infinite; }
.v-boundaries--fanboys-scene { animation-name: v-boundaries--fanboys-scene; }
@keyframes v-boundaries--fanboys-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${letterCss}
.v-boundaries--fanboys-box { animation-name: v-boundaries--fanboys-box; }
@keyframes v-boundaries--fanboys-box { 0%, 48% { opacity: 0; transform: translateY(8px) } 56%, 100% { opacity: 1; transform: none } }
.v-boundaries--fanboys-comma { transform-box: fill-box; transform-origin: center; animation-name: v-boundaries--fanboys-comma; }
@keyframes v-boundaries--fanboys-comma { 0%, 56% { opacity: 0; transform: scale(2.2) } 64%, 100% { opacity: 1; transform: none } }
.v-boundaries--fanboys-join { animation-name: v-boundaries--fanboys-join; }
@keyframes v-boundaries--fanboys-join { 0%, 62% { opacity: 0; transform: translateY(-40px) } 72%, 100% { opacity: 1; transform: none } }
.v-boundaries--fanboys-lock { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-boundaries--fanboys-lock; }
@keyframes v-boundaries--fanboys-lock { 0%, 74% { fill: ${C.fill}; stroke: ${C.primary} } 80%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-boundaries--fanboys-ex { animation-name: v-boundaries--fanboys-ex; }
@keyframes v-boundaries--fanboys-ex { 0%, 80% { opacity: 0; transform: translateY(6px) } 88%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {/* The acronym, each letter with its word */}
        {LETTERS.map((l, i) => (
          <g key={l}>
            <g className={`${A} ${LET + i}`}>
              <text x={X0 + i * DX} y={36} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.primary}>
                {l}
              </text>
            </g>
            <g className={`${A} ${WORD + i}`}>
              <text x={X0 + i * DX} y={53} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink}>
                {WORDS[i]}
              </text>
            </g>
          </g>
        ))}

        {/* The pattern: full sentence , FANBOYS full sentence */}
        <g className={`${A} ${BOX}`}>
          <rect x={22} y={76} width={88} height={36} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={66} y={98} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            full sentence
          </text>
          <rect x={210} y={76} width={88} height={36} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={254} y={98} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            full sentence
          </text>
        </g>
        <g className={`${A} ${COMMA}`}>
          <text x={121} y={108} textAnchor="middle" fontSize={50} fontWeight={700} fill={C.primary}>
            ,
          </text>
        </g>
        <g className={`${A} ${JOIN}`}>
          <rect className={`${A} ${LOCK}`} x={134} y={76} width={68} height={36} rx={18} strokeWidth={2} />
          <text x={168} y={98} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            FANBOYS
          </text>
        </g>

        {/* One example */}
        <g className={`${A} ${EX}`}>
          <text x={160} y={150} textAnchor="middle" fontSize={16} fontWeight={600} fill={C.ink}>
            It rained
            <tspan fill={C.primary} fontSize={24} fontWeight={700}>
              ,
            </tspan>
            <tspan fill={C.good} fontWeight={700}>
              {" but"}
            </tspan>
            {" we played."}
          </text>
        </g>
      </g>
    </Svg>
  );
}
