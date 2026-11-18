import { C, Css, Svg } from "./kit";

// Words in context, "Use the charge": the clue (praised) is positive, so the positive word (benevolent) fits; negative and neutral words do not.
export const alt = "The sentence They praised the doctor as ___: praised has a plus charge. Benevolent (+) fits and fills the blank; malevolent (minus) and sedentary (neutral) are crossed out.";

const P = "v-words-in-context--charge-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const bad = (n: string, t: number) => `.${P}${n} { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }`;

const css = `
.v-words-in-context--charge-a { animation: 10s ease-in-out infinite; }
.v-words-in-context--charge-scene { animation-name: v-words-in-context--charge-scene; }
@keyframes v-words-in-context--charge-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("sent", 4)}
${show("plus", 16)}
${show("chips", 28)}
${show("caps", 34)}
${bad("b1", 48)}
${bad("b2", 54)}
${show("fill", 72)}
.v-words-in-context--charge-ok { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-words-in-context--charge-ok; }
@keyframes v-words-in-context--charge-ok { 0%, 62% { fill: ${C.fill}; stroke: ${C.line} } 68%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-words-in-context--charge-clue { fill: ${C.primary}; animation-name: v-words-in-context--charge-clue; }
@keyframes v-words-in-context--charge-clue { 0%, 14% { fill: ${C.ink} } 20%, 100% { fill: ${C.primary} } }
`;

const FS = 13;
const K = 6.9;

function Piece({ x, text, cls }: { x: number; text: string; cls?: string }) {
  return (
    <text className={cls ? `v-words-in-context--charge-a ${cls}` : undefined} x={x} y={52} fontSize={FS} fontWeight={600} fill={C.ink} textLength={text.length * K} lengthAdjust="spacingAndGlyphs">
      {text}
    </text>
  );
}

function Chip({ x, word, sym, cap, cls }: { x: number; word: string; sym: string; cap: string; cls: string }) {
  return (
    <>
      <rect className={`v-words-in-context--charge-a ${cls}`} x={x} y={86} width={92} height={28} rx={14} strokeWidth={1.5} />
      <text x={x + 46} y={105} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
        {word}
      </text>
      <circle cx={x + 6} cy={86} r={9} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
      <text x={x + 6} y={90.5} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
        {sym}
      </text>
      <g className={`v-words-in-context--charge-a v-words-in-context--charge-caps`}>
        <text x={x + 46} y={134} textAnchor="middle" fontSize={11} fill={C.muted}>
          {cap}
        </text>
      </g>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-words-in-context--charge-a v-words-in-context--charge-scene`}>
        <g className={`v-words-in-context--charge-a v-words-in-context--charge-sent`}>
          <Piece x={16} text="They" />
          <Piece x={50} text="praised" cls={`v-words-in-context--charge-clue`} />
          <Piece x={104} text="the doctor as" />
          <rect x={200} y={32} width={88} height={26} rx={7} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        </g>
        <g className={`v-words-in-context--charge-a v-words-in-context--charge-plus`}>
          <circle cx={74} cy={26} r={9} fill={C.primary} />
          <text x={74} y={31} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.bg}>
            +
          </text>
        </g>

        <g className={`v-words-in-context--charge-a v-words-in-context--charge-chips`}>
          <Chip x={16} word="benevolent" sym="+" cap="bene- = good" cls={`v-words-in-context--charge-ok`} />
          <Chip x={114} word="malevolent" sym="−" cap="mal- = bad" cls={`v-words-in-context--charge-b1`} />
          <Chip x={212} word="sedentary" sym="0" cap="neutral" cls={`v-words-in-context--charge-b2`} />
        </g>

        <g className={`v-words-in-context--charge-a v-words-in-context--charge-fill`}>
          <text x={244} y={50} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.good}>
            benevolent
          </text>
          <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
            match the clue’s charge
          </text>
        </g>
      </g>
    </Svg>
  );
}
