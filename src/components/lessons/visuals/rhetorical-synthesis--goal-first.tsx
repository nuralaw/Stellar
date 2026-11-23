import { C, Css, Svg } from "./kit";

// Goal first: three true notes become three choices; each is tested against the goal and only the one that does the job locks in.
export const alt =
  "Goal: emphasize height. Three true choices are tested: the sculptor and harbor ones are true but the wrong job; the 14-meters-tall one does the job and locks in green.";

const P = "v-rhetorical-synthesis--goal-first-";
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const rise = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const slide = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateX(10px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number) => kf(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + 5}%, 100% { stroke-dashoffset: 0 }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const test = (n: string, t: number) => kf(n, `0%, ${t}% { stroke: ${C.line} } ${t + 2}%, ${t + 7}% { stroke: ${C.ink} } ${t + 9}%, 100% { stroke: ${C.line} }`);
const dim = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 1 } ${t + 5}%, 100% { opacity: 0.45 }`);

const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const css = `
${rule("a", "animation: 10s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${rise("n0", 7)}
${rise("n1", 11)}
${rise("n2", 15)}
${rise("goal", 22)}
${slide("c0", 32)}
${slide("c1", 36)}
${slide("c2", 40)}
${draw("l0", 32)}
${draw("l1", 36)}
${test("t0", 46)}
${test("t1", 58)}
${dim("d0", 54)}
${dim("d1", 66)}
${fade("g0", 55)}
${fade("g1", 67)}
${kf("win", `0%, 70% { fill: ${C.fill}; stroke: ${C.line} } 72%, 76% { fill: ${C.fill}; stroke: ${C.ink} } 80%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`)}
${kf("l2", `0%, 40% { stroke-dashoffset: 100; stroke: ${C.line} } 45%, 76% { stroke-dashoffset: 0; stroke: ${C.line} } 80%, 100% { stroke-dashoffset: 0; stroke: ${C.good} }`)}
${fade("g2", 77)}
`;

const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const ROW = (i: number) => 44 + i * 40;

const notes = [
  ["Lund was a", "sculptor"],
  ["Tide Gate is in", "Bergen harbor"],
  ["Tide Gate is", "14 meters tall"],
];
const choices = ["Lund made Tide Gate.", "Tide Gate stands in Bergen.", "Tide Gate is 14 meters tall."];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "goal")}>
          <text x={160} y={30} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fill={C.muted}>Goal: </tspan>emphasize{" "}
            <tspan fill={C.primaryText} fontWeight={700}>
              height
            </tspan>
          </text>
        </g>

        {notes.map((n, i) => {
          const y = ROW(i);
          return (
            <g key={i}>
              <g className={cls("a", `n${i}`)}>
                <rect x={16} y={y} width={100} height={34} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
                <text x={26} y={y + 14} fontSize={11} fontWeight={600} fill={C.ink}>
                  {n[0]}
                </text>
                <text x={26} y={y + 27} fontSize={11} fontWeight={600} fill={C.ink}>
                  {n[1]}
                </text>
              </g>
              <path
                className={cls("a", `l${i}`)}
                d={`M116 ${y + 17} L132 ${y + 17}`}
                pathLength={100}
                strokeDasharray={100}
                fill="none"
                stroke={i === 2 ? C.good : C.line}
                strokeWidth={2}
              />
              <g className={cls("a", `c${i}`)}>
                <g className={i < 2 ? cls("a", `d${i}`) : undefined} opacity={i < 2 ? 0.45 : 1}>
                  <rect
                    className={i < 2 ? cls("a", `t${i}`) : cls("a", "win")}
                    x={132}
                    y={y}
                    width={172}
                    height={34}
                    rx={8}
                    fill={i < 2 ? C.fill : C.goodSoft}
                    stroke={i < 2 ? C.line : C.good}
                    strokeWidth={1.5}
                  />
                  <text x={142} y={y + 14} fontSize={11} fontWeight={600} fill={C.ink}>
                    {choices[i]}
                  </text>
                </g>
                <g className={cls("a", `g${i}`)}>
                  <text x={142} y={y + 28} fontSize={11} fontWeight={i < 2 ? 600 : 700} fill={i < 2 ? C.muted : C.good}>
                    {i < 2 ? "true, wrong job" : "✓ does the job"}
                  </text>
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
