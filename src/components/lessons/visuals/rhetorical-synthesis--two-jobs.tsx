import { C, Css, Svg } from "./kit";

// Two jobs: a goal with "and" has two boxes to tick. Each half-sentence ticks one and is marked half; only the full sentence ticks both.
export const alt =
  "Goal: define keystone species and give an example, two tick boxes. A definition-only sentence and an example-only sentence each tick one box and are marked half; the sentence with both locks in green.";

const P = "v-rhetorical-synthesis--two-jobs-";
const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const rise = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const slide = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateX(-10px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const dim = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 1 } ${t + 5}%, 100% { opacity: 0.45 }`);

const css = `
${rule("a", "animation: 11s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${rise("goal", 6)}
${slide("s0", 14)}
${slide("s1", 34)}
${slide("s2", 54)}
${fade("h0", 26)}
${fade("h1", 46)}
${fade("both", 72)}
${dim("d0", 34)}
${dim("d1", 54)}
${kf("tickD", `0%, 22% { opacity: 0; stroke: ${C.primary} } 25%, 34% { opacity: 1; stroke: ${C.primary} } 37%, 62% { opacity: 0; stroke: ${C.primary} } 65%, 70% { opacity: 1; stroke: ${C.primary} } 75%, 100% { opacity: 1; stroke: ${C.good} }`)}
${kf("tickE", `0%, 42% { opacity: 0; stroke: ${C.primary} } 45%, 52% { opacity: 1; stroke: ${C.primary} } 55%, 66% { opacity: 0; stroke: ${C.primary} } 69%, 70% { opacity: 1; stroke: ${C.primary} } 75%, 100% { opacity: 1; stroke: ${C.good} }`)}
${kf("win", `0%, 70% { fill: ${C.fill}; stroke: ${C.line} } 75%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`)}
`;

const A = "a";
const rowY = (i: number) => 52 + i * 38;

const sentences = [
  ["A keystone species", "shapes its ecosystem."],
  ["Sea otters protect", "kelp forests."],
  ["A keystone species, such as the", "sea otter, shapes its ecosystem."],
];

/** An empty tick box of the goal with its (animated) tick. */
function Box({ x, label, tick }: { x: number; label: string; tick: string }) {
  return (
    <g>
      <rect x={x} y={20} width={16} height={16} rx={4} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
      <path className={cls(A, tick)} d={`M${x + 3.5} ${28.5} L${x + 7} ${32} L${x + 12.5} ${24}`} fill="none" stroke={C.good} strokeWidth={2.2} />
      <text x={x + 24} y={33} fontSize={13} fontWeight={700} fill={C.ink}>
        {label}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls(A, "scene")}>
        <g className={cls(A, "goal")}>
          <text x={36} y={33} fontSize={13} fontWeight={600} fill={C.muted}>
            Goal:
          </text>
          <Box x={82} label="define" tick="tickD" />
          <Box x={176} label="example" tick="tickE" />
        </g>

        {sentences.map((s, i) => {
          const y = rowY(i);
          const win = i === 2;
          return (
            <g key={i} className={cls(A, `s${i}`)}>
              <g className={win ? undefined : cls(A, `d${i}`)} opacity={win ? 1 : 0.45}>
                <rect className={win ? cls(A, "win") : undefined} x={16} y={y} width={222} height={32} rx={8} fill={win ? C.goodSoft : C.fill} stroke={win ? C.good : C.line} strokeWidth={1.5} />
                <text x={26} y={y + 13} fontSize={11} fontWeight={600} fill={C.ink}>
                  {s[0]}
                </text>
                <text x={26} y={y + 26} fontSize={11} fontWeight={600} fill={C.ink}>
                  {s[1]}
                </text>
              </g>
              <g className={win ? cls(A, "both") : cls(A, `h${i}`)}>
                <text x={274} y={y + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={win ? C.good : C.bad}>
                  {win ? "✓ both" : "half"}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
