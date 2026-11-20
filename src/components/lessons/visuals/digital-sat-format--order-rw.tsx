import { C, Css, Svg } from "./kit";

// Question order in Reading and Writing: four domain groups in a fixed order. Craft, Ideas and Expression climb
// skill by skill (short runs). Standard English Conventions is ONE climb, easiest to hardest, whatever the skill.
// (The run lengths are a sketch: the real counts vary by test.)
export const alt =
  "A Reading and Writing module: 27 bars in four groups: Craft, Ideas, Conventions, Expression. The other groups climb in short runs; Conventions is one single climb from easiest to hardest.";

const P = "v-digital-sat-format--order-rw-";
const A = P + "a";
const SCENE = P + "scene";
const BAR = P + "bar";
const TAG = P + "tag";
const BASE = 108;
const GROUPS: { name: string; runs: number[]; one?: boolean }[] = [
  { name: "Craft", runs: [3, 3, 2] },
  { name: "Ideas", runs: [3, 2, 2] },
  { name: "Conventions", runs: [7], one: true },
  { name: "Expression", runs: [3, 2] },
];

// 27 bars. x: 9 per bar and 9 extra between groups.
const bars: { i: number; g: number; x: number; h: number; one: boolean }[] = [];
{
  let x = 22;
  let i = 0;
  GROUPS.forEach((g, gi) => {
    if (gi > 0) x += 9;
    g.runs.forEach((n) => {
      for (let k = 0; k < n; k++) {
        bars.push({ i: i++, g: gi, x, h: g.one ? 12 + k * 10 : 14 + k * 14, one: Boolean(g.one) });
        x += 9;
      }
    });
  });
}
const groupX = GROUPS.map((_, gi) => {
  const bs = bars.filter((b) => b.g === gi);
  return (bs[0].x + bs[bs.length - 1].x + 6) / 2;
});

/** Each bar grows in turn; the Conventions bars end as the accent. */
const barCss = bars
  .map(({ i, one }) => {
    const t = 6 + i * 1.7;
    const n = P + "b" + i;
    const end = one ? C.primary : C.muted;
    return `@keyframes ${n} { 0%, ${t.toFixed(1)}% { transform: scaleY(0); fill: ${C.muted} } ${(t + 4).toFixed(1)}%, 60% { transform: scaleY(1); fill: ${C.muted} } 66%, 100% { transform: scaleY(1); fill: ${end} } }`;
  })
  .join("\n");

const css = `
.v-digital-sat-format--order-rw-a { animation: 9s ease-in-out infinite; }
.v-digital-sat-format--order-rw-scene { animation-name: v-digital-sat-format--order-rw-scene; }
@keyframes v-digital-sat-format--order-rw-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-digital-sat-format--order-rw-bar { transform-box: fill-box; transform-origin: center bottom; }
${barCss}
.v-digital-sat-format--order-rw-tag { animation-name: v-digital-sat-format--order-rw-tag; }
@keyframes v-digital-sat-format--order-rw-tag { 0%, 64% { opacity: 0; transform: translateY(4px) } 70%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        <text x={22} y={30} fontSize={15} fontWeight={700} fill={C.ink}>
          Reading and Writing
        </text>

        {/* One bar per question: height = difficulty */}
        <line x1={18} y1={BASE + 1} x2={302} y2={BASE + 1} stroke={C.line} strokeWidth={1.5} />
        {bars.map((b) => (
          <rect
            key={b.i}
            className={`${A} ${BAR}`}
            style={{ animationName: `${P}b${b.i}` }}
            x={b.x}
            y={BASE - b.h}
            width={7}
            height={b.h}
            rx={2}
            fill={b.one ? C.primary : C.muted}
          />
        ))}
        {GROUPS.map((g, gi) => (
          <text key={g.name} x={g.one ? groupX[gi] - 8 : gi === 3 ? 302 : groupX[gi]} y={126} textAnchor={gi === 3 ? "end" : "middle"} fontSize={11} fontWeight={600} fill={g.one ? C.primaryText : C.muted}>
            {g.name}
          </text>
        ))}

        {/* The point */}
        <g className={`${A} ${TAG}`}>
          <text x={160} y={152} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
            Conventions: one easy-to-hard climb
          </text>
        </g>
      </g>
    </Svg>
  );
}
