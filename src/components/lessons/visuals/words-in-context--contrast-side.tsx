import { C, Css, Svg } from "./kit";

// Words in context, "Contrast words": a contrast word (but) flips the blank only if the clue and the blank are on opposite sides of it.
export const alt = "Two sentences with a wall at the word but. First: blank (calm) and clue (hands shook) are on opposite sides, so opposite meaning. Second: same side, so same meaning (nervous).";

const P = "v-words-in-context--contrast-side-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const draw = (n: string, t: number) => `.${P}${n} { stroke-dasharray: 100; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + 10}%, 100% { stroke-dashoffset: 0 } }`;

const css = `
.v-words-in-context--contrast-side-a { animation: 10s ease-in-out infinite; }
.v-words-in-context--contrast-side-scene { animation-name: v-words-in-context--contrast-side-scene; }
@keyframes v-words-in-context--contrast-side-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("r1", 6)}
${draw("arc1", 24)}
${show("t1", 32)}
${show("r2", 46)}
${draw("arc2", 62)}
${show("t2", 70)}
`;

const FS = 11.5;
const K = 6.2;

/** A piece of the sentence with a forced width, so the layout does not depend on the font. */
function Piece({ x, y, text, color = C.ink, bold = false }: { x: number; y: number; text: string; color?: string; bold?: boolean }) {
  return (
    <text x={x} y={y} fontSize={FS} fontWeight={bold ? 700 : 600} fill={color} textLength={text.length * K} lengthAdjust="spacingAndGlyphs">
      {text}
    </text>
  );
}

function Blank({ x, y, word }: { x: number; y: number; word: string }) {
  return (
    <>
      <rect x={x} y={y - 16} width={50} height={22} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <text x={x + 25} y={y} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.ink}>
        {word}
      </text>
    </>
  );
}

function But({ x, y }: { x: number; y: number }) {
  return (
    <>
      <path d={`M${x + 14} ${y - 32} V${y - 22} M${x + 14} ${y + 8} V${y + 18}`} stroke={C.muted} strokeWidth={2} fill="none" />
      <rect x={x} y={y - 22} width={28} height={30} rx={8} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      <text x={x + 14} y={y - 3} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.ink}>
        but
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-scene`}>
        {/* Row 1: blank and clue on opposite sides of "but" */}
        <g className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-r1`}>
          <Piece x={16} y={70} text="She seemed" />
          <Blank x={84} y={70} word="calm" />
          <text x={136} y={70} fontSize={FS} fontWeight={600} fill={C.ink}>
            ,
          </text>
          <But x={148} y={70} />
          <Piece x={184} y={70} text="her" />
          <Piece x={208} y={70} text="hands shook." color={C.primary} bold />
        </g>
        <path className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-arc1`} d="M109 52 Q177 12 246 54" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-t1`}>
          <text x={177} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            opposite sides: opposite
          </text>
        </g>

        {/* Row 2: blank and clue on the same side */}
        <g className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-r2`}>
          <Piece x={16} y={144} text="Shaking," color={C.primary} bold />
          <Piece x={70} y={144} text="she felt" />
          <Blank x={126} y={144} word="nervous" />
          <text x={178} y={144} fontSize={FS} fontWeight={600} fill={C.ink}>
            ,
          </text>
          <But x={188} y={144} />
          <Piece x={222} y={144} text="it went well." />
        </g>
        <path className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-arc2`} d="M41 126 Q96 96 151 126" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={`v-words-in-context--contrast-side-a v-words-in-context--contrast-side-t2`}>
          <text x={96} y={104} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            same side: same
          </text>
        </g>
      </g>
    </Svg>
  );
}
