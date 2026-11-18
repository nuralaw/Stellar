import { C, Css, Svg } from "./kit";

// Cause needs random assignment. Top row: random sample → coin flip into two groups → cause. Bottom row: no coin flip → relationship only.
export const alt = "Random sample, then a coin flip into two groups: a cause can be shown. Random sample with no coin flip: only a relationship.";

const P = "v-statistical-claims--design-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("e1", 2)}
${at("e2", 16)}
${at("e3", 32)}
${at("s1", 52)}
${at("s2", 62)}
${at("s3", 74)}
`;

const XS = [16, 118, 220];
const W = 84;
const ARROW = (x: number, y: number) => `M${x} ${y} h10 m-5 -5 l5 5 l-5 5`;

type Box = { lines: [string, string]; tone: "ink" | "good" | "bad" | "muted" };
const ROW1: Box[] = [
  { lines: ["random", "sample"], tone: "ink" },
  { lines: ["coin flip", ""], tone: "ink" },
  { lines: ["cause", ""], tone: "good" },
];
const ROW2: Box[] = [
  { lines: ["random", "sample"], tone: "ink" },
  { lines: ["no coin flip", ""], tone: "muted" },
  { lines: ["relationship", ""], tone: "bad" },
];

const tone = (t: Box["tone"]) => ({ ink: C.ink, good: C.good, bad: C.bad, muted: C.muted })[t];
const soft = (t: Box["tone"]) => ({ ink: C.fill, good: C.goodSoft, bad: C.badSoft, muted: C.fill })[t];

function Row({ boxes, y, prefix }: { boxes: Box[]; y: number; prefix: string }) {
  return (
    <>
      {boxes.map((b, i) => (
        <g key={i} className={cls(prefix + (i + 1))}>
          {i > 0 && <path d={ARROW(XS[i] - 14, y + 20)} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray={prefix === "s" && i === 1 ? "3 3" : undefined} />}
          <rect x={XS[i]} y={y} width={W} height={44} rx={6} fill={soft(b.tone)} stroke={tone(b.tone)} strokeWidth={1.5} />
          {b.lines[1] ? (
            <>
              <text x={XS[i] + W / 2} y={y + 19} fontSize={12} fontWeight={700} fill={tone(b.tone)} textAnchor="middle">
                {b.lines[0]}
              </text>
              <text x={XS[i] + W / 2} y={y + 35} fontSize={12} fontWeight={700} fill={tone(b.tone)} textAnchor="middle">
                {b.lines[1]}
              </text>
            </>
          ) : (
            <text x={XS[i] + W / 2} y={y + (prefix === "e" && i === 1 ? 19 : 26)} fontSize={12} fontWeight={700} fill={tone(b.tone)} textAnchor="middle">
              {b.lines[0]}
            </text>
          )}
          {/* The coin flip splits people into two groups */}
          {prefix === "e" && i === 1 && (
            <g>
              <circle cx={XS[i] + W / 2 - 9} cy={y + 33} r={4} fill={C.primary} />
              <circle cx={XS[i] + W / 2 + 9} cy={y + 33} r={4} fill={C.ink} />
            </g>
          )}
        </g>
      ))}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <Row boxes={ROW1} y={30} prefix="e" />
      <Row boxes={ROW2} y={106} prefix="s" />
    </Svg>
  );
}
