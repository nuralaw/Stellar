import { C, Css, Svg } from "./kit";

// The punctuation decision tree: ask top to bottom; the first yes decides the mark.
export const alt =
  "Checklist, top to bottom: two sentences, period, semicolon, comma + FANBOYS; sentence then detail, colon or dash; Although opener, comma; detail in the middle, a pair; end, one comma; else none.";

const P = "v-boundaries--tree-";
const A = P + "a";
const SCENE = P + "scene";
const R = P + "r";

// Each row: a question (left) and its answer (right). The first yes decides.
const ROWS: { q: string; a: string; last?: boolean }[] = [
  { q: "Two full sentences?", a: "; . or , + FANBOYS" },
  { q: "Sentence, then detail?", a: "colon or one dash" },
  { q: "Opener: Although…?", a: "comma after opener" },
  { q: "Extra detail, middle?", a: "pair: , … , or — … —" },
  { q: "Extra detail, end?", a: "one comma" },
  { q: "None of these?", a: "no mark", last: true },
];
const QX = 16;
const QW = 146;
const AX = 180;
const AW = 124;
const RH = 23;
const Y0 = 9;
const DY = 28;

const rowCss = ROWS.map((_, i) => {
  const t = 6 + i * 12;
  return `.${R + i} { animation-name: ${R + i}; }
@keyframes ${R + i} { 0%, ${t}% { opacity: 0; transform: translateY(4px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
}).join("\n");

const css = `
.v-boundaries--tree-a { animation: 10s ease-in-out infinite; }
.v-boundaries--tree-scene { animation-name: v-boundaries--tree-scene; }
@keyframes v-boundaries--tree-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${rowCss}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {ROWS.map((r, i) => {
          const y = Y0 + i * DY;
          const cy = y + RH / 2;
          return (
            <g key={r.q} className={`${A} ${R + i}`}>
              {/* link down to the next question */}
              {i < ROWS.length - 1 && <line x1={QX + 10} y1={y + RH} x2={QX + 10} y2={y + DY} stroke={C.muted} strokeWidth={1.5} />}
              <rect x={QX} y={y} width={QW} height={RH} rx={11.5} fill={C.fill} stroke={C.primary} strokeWidth={1.5} />
              <text x={QX + 12} y={cy + 4} fontSize={11} fontWeight={700} fill={C.ink}>
                {r.q}
              </text>
              {/* yes arrow */}
              <line x1={QX + QW + 4} y1={cy} x2={AX - 8} y2={cy} stroke={C.muted} strokeWidth={1.5} />
              <path d={`M${AX - 12} ${cy - 3.5} L${AX - 6} ${cy} L${AX - 12} ${cy + 3.5}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
              <rect x={AX} y={y} width={AW} height={RH} rx={11.5} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
              <text x={AX + AW / 2} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>
                {r.a}
              </text>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
