import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Match every part": split the claim in two, then look for words in each quotation that match each part.
export const alt = "The claim has two parts, generous and hides it. Quotation A has words for only the first part (1 of 2) and is rejected. Quotation B has words for both parts (2 of 2) and is right.";

const P = "v-command-of-evidence-textual--match-words-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const hl = (n: string, t: number) => `.${P}${n} { fill: ${C.primaryText}; font-weight: 700; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.ink}; font-weight: 600 } ${t + 5}%, 100% { fill: ${C.primaryText}; font-weight: 700 } }`;

const css = `
.v-command-of-evidence-textual--match-words-a { animation: 10s ease-in-out infinite; }
.v-command-of-evidence-textual--match-words-scene { animation-name: v-command-of-evidence-textual--match-words-scene; }
@keyframes v-command-of-evidence-textual--match-words-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("claim", 6)}
${show("qa", 20)}
${show("sa", 34)}
${show("qb", 50)}
${show("sb", 74)}
${hl("h1", 26)}
${hl("h2", 56)}
${hl("h3", 62)}
`;

function Part({ x, n, word }: { x: number; n: string; word: string }) {
  return (
    <>
      <rect x={x} y={10} width={112} height={28} rx={14} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <circle cx={x + 16} cy={24} r={8} fill={C.primary} />
      <text x={x + 16} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary}>
        {n}
      </text>
      <text x={x + 30} y={29} fontSize={13} fontWeight={700} fill={C.ink}>
        {word}
      </text>
    </>
  );
}

/** The A / B letter in its own small chip, apart from the sentence. */
function Letter({ cy, letter }: { cy: number; letter: string }) {
  return (
    <>
      <circle cx={34} cy={cy} r={10} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
      <text x={34} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {letter}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-scene`}>
        <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-claim`}>
          <Part x={40} n="1" word="generous" />
          <Part x={168} n="2" word="hides it" />
        </g>

        {/* Quotation A: only part 1 */}
        <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-qa`}>
          <rect x={16} y={48} width={288} height={46} rx={9} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <Letter cy={71} letter="A" />
          <text x={56} y={67} fontSize={12} fontWeight={600} fill={C.ink}>
            He gave <tspan className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-h1`}>freely</tspan> to every
          </text>
          <text x={56} y={84} fontSize={12} fontWeight={600} fill={C.ink}>
            neighbor in need.
          </text>
        </g>
        <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-sa`}>
          <text x={294} y={75} textAnchor="end" fontSize={12} fontWeight={700} fill={C.bad}>
            1 of 2
          </text>
        </g>

        {/* Quotation B: both parts */}
        <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-qb`}>
          <rect x={16} y={102} width={288} height={46} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Letter cy={125} letter="B" />
          <text x={56} y={121} fontSize={12} fontWeight={600} fill={C.ink}>
            He <tspan className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-h2`}>left the coins</tspan> at night,
          </text>
          <text x={56} y={138} fontSize={12} fontWeight={600} fill={C.ink}>
            so <tspan className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-h3`}>none knew</tspan> the giver.
          </text>
        </g>
        <g className={`v-command-of-evidence-textual--match-words-a v-command-of-evidence-textual--match-words-sb`}>
          <text x={294} y={129} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good}>
            2 of 2
          </text>
        </g>

        <text x={160} y={166} textAnchor="middle" fontSize={11} fill={C.muted}>
          every part needs matching words
        </text>
      </g>
    </Svg>
  );
}
