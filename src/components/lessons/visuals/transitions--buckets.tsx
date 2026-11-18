import { C, Css, Svg } from "./kit";

// Transitions: every transition word is an and, a but or a so. Six words drop into three buckets.
export const alt =
  "Three buckets: and (adds), but (contrast), so (result). Six transition words drop in: Similarly and In fact go in and; However and Nevertheless go in but; Therefore and As a result go in so.";

const P = "v-transitions--buckets-";
const A = P + "a";
const SCENE = P + "scene";
const BUCKET = P + "bucket";

// [bucket index, word, row (0 top, 1 bottom)] in the order they drop.
const WORDS: [number, string, number][] = [
  [1, "However", 0],
  [2, "Therefore", 0],
  [0, "Similarly", 0],
  [1, "Nevertheless", 1],
  [2, "As a result", 1],
  [0, "In fact", 1],
];
const BUCKETS = [
  { x: 16, head: "and", tag: "adds" },
  { x: 115, head: "but", tag: "contrast" },
  { x: 214, head: "so", tag: "result" },
];
const BW = 90;
const CH = 26;
const CY0 = 78;

const dropCss = WORDS.map((_, i) => {
  const t = 10 + i * 11;
  const n = P + "w" + i;
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0; transform: translateY(-42px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
}).join("\n");

const css = `
.v-transitions--buckets-a { animation: 9s ease-in-out infinite; }
.v-transitions--buckets-scene { animation-name: v-transitions--buckets-scene; }
@keyframes v-transitions--buckets-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${dropCss}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {BUCKETS.map((b) => (
          <g key={b.head}>
            <text x={b.x + BW / 2} y={32} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.primary}>
              {b.head}
            </text>
            <text x={b.x + BW / 2} y={48} textAnchor="middle" fontSize={11} fill={C.muted}>
              {b.tag}
            </text>
            <rect className={BUCKET} x={b.x} y={58} width={BW} height={96} rx={10} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
          </g>
        ))}
        {WORDS.map(([bi, word, row], i) => {
          const b = BUCKETS[bi];
          const y = CY0 + row * (CH + 8);
          return (
            <g key={word} className={`${A} ${P + "w" + i}`}>
              <rect x={b.x + 6} y={y - 6} width={BW - 12} height={CH} rx={13} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <text x={b.x + BW / 2} y={y + 12} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
                {word}
              </text>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
