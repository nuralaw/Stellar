import { C, Css, Svg } from "./kit";

// The test's shape: Reading and Writing (2 modules × 27 questions, 32 min), a 10-minute break, Math (2 × 22, 35 min).
export const alt =
  "Reading and Writing: two modules of 27 questions in 32 minutes each. A 10-minute break. Math: two modules of 22 questions in 35 minutes each. 98 questions in 2 hours 14 minutes.";

const P = "v-digital-sat-format--shape-";
/** An element that pops in at t% of the loop. */
const pop = (n: string, t: number) =>
  `.${P}${n} { transform-box: fill-box; transform-origin: center; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: scale(0.85) } ${t + 5}%, 100% { opacity: 1; transform: none } }`;
/** A card outline that is the accent while it arrives, then calms down. */
const glow = (n: string, t: number) =>
  `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke: ${C.primary}; fill: ${C.soft} } ${t + 12}%, 100% { stroke: ${C.line}; fill: ${C.fill} } }`;

const css = `
.v-digital-sat-format--shape-a { animation: 9s ease-in-out infinite; }
.v-digital-sat-format--shape-scene { animation-name: v-digital-sat-format--shape-scene; }
@keyframes v-digital-sat-format--shape-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }
${pop("t1", 5)}
${pop("c1", 9)}
${pop("c2", 18)}
${pop("br", 30)}
${pop("t2", 40)}
${pop("c3", 44)}
${pop("c4", 53)}
${pop("sum", 68)}
${glow("g1", 14)}
${glow("g2", 23)}
${glow("g3", 49)}
${glow("g4", 58)}
`;

const CARDS = [
  { x: 16, q: 27, min: 32, c: "c1", g: "g1" },
  { x: 75, q: 27, min: 32, c: "c2", g: "g2" },
  { x: 191, q: 22, min: 35, c: "c3", g: "g3" },
  { x: 250, q: 22, min: 35, c: "c4", g: "g4" },
] as const;

const CLS: Record<string, string> = {
  c1: "v-digital-sat-format--shape-a v-digital-sat-format--shape-c1",
  c2: "v-digital-sat-format--shape-a v-digital-sat-format--shape-c2",
  c3: "v-digital-sat-format--shape-a v-digital-sat-format--shape-c3",
  c4: "v-digital-sat-format--shape-a v-digital-sat-format--shape-c4",
  g1: "v-digital-sat-format--shape-a v-digital-sat-format--shape-g1",
  g2: "v-digital-sat-format--shape-a v-digital-sat-format--shape-g2",
  g3: "v-digital-sat-format--shape-a v-digital-sat-format--shape-g3",
  g4: "v-digital-sat-format--shape-a v-digital-sat-format--shape-g4",
};

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--shape-a v-digital-sat-format--shape-scene">
        {/* Section names */}
        <text className="v-digital-sat-format--shape-a v-digital-sat-format--shape-t1" x={72.5} y={34} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          Reading and Writing
        </text>
        <text className="v-digital-sat-format--shape-a v-digital-sat-format--shape-t2" x={247.5} y={34} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          Math
        </text>

        {/* Four modules */}
        {CARDS.map((m) => (
          <g key={m.x} className={CLS[m.c]}>
            <rect className={CLS[m.g]} x={m.x} y={44} width={54} height={74} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            <text x={m.x + 27} y={72} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.ink}>
              {m.q}
            </text>
            <text x={m.x + 27} y={86} textAnchor="middle" fontSize={11} fill={C.muted}>
              questions
            </text>
            <line x1={m.x + 10} y1={94} x2={m.x + 44} y2={94} stroke={C.line} strokeWidth={1.5} />
            <text x={m.x + 27} y={110} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
              {m.min} min
            </text>
          </g>
        ))}

        {/* The break */}
        <g className="v-digital-sat-format--shape-a v-digital-sat-format--shape-br">
          <rect x={136} y={56} width={48} height={50} rx={9} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
          <text x={160} y={78} textAnchor="middle" fontSize={11} fill={C.muted}>
            break
          </text>
          <text x={160} y={95} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            10 min
          </text>
        </g>

        {/* The whole test */}
        <g className="v-digital-sat-format--shape-a v-digital-sat-format--shape-sum">
          <rect x={56} y={132} width={208} height={30} rx={15} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={152} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText}>
            98 questions · 2 h 14 min
          </text>
        </g>
      </g>
    </Svg>
  );
}
