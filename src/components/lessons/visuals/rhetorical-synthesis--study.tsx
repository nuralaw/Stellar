import { C, Css, Svg } from "./kit";

// Study: the notes split into aim, method, finding, always in that order. The goal picks one part or two; a choice with half of them fails.
export const alt =
  "A study's notes in a fixed order: aim, method, finding. Goal method locks only the method green; goal aim plus method locks both and a choice with only the aim is marked half the job.";

const P = "v-rhetorical-synthesis--study-";
const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const drop = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(-8px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);

const css = `
${rule("a", "animation: 11s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${drop("r0", 6)}
${drop("r1", 11)}
${drop("r2", 16)}
${fade("tag0", 24)}
${fade("tag1", 28)}
${fade("tag2", 32)}
${fade("arr", 34)}
${fade("goalA", 38)}
${kf("goalAx", `0%, 52% { opacity: 1 } 56%, 100% { opacity: 0 }`)}
${fade("goalB", 56)}
${kf("dim0", `0%, 44% { opacity: 1 } 48%, 54% { opacity: 0.45 } 60%, 100% { opacity: 1 }`)}
${kf("dim2", `0%, 44% { opacity: 1 } 48%, 100% { opacity: 0.45 }`)}
${kf("box0", `0%, 58% { fill: ${C.fill}; stroke: ${C.line} } 62%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`)}
${kf("box1", `0%, 44% { fill: ${C.fill}; stroke: ${C.line} } 48%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`)}
${kf("bracket", `0%, 62% { stroke-dashoffset: 100 } 68%, 100% { stroke-dashoffset: 0 }`)}
${kf("half", `0%, 72% { opacity: 0; transform: translateX(10px) } 77%, 79% { opacity: 1; transform: translateX(0) } 81% { transform: translateX(-4px) } 83% { transform: translateX(4px) } 85%, 100% { opacity: 1; transform: none }`)}
`;

const A = "a";
const ROW_X = 84;
const ROW_W = 172;
const rowY = (i: number) => 14 + i * 42;

const rows = [
  { tag: "aim", l1: "Wanted to learn whether", l2: "foxes avoid busy streets" },
  { tag: "method", l1: "Fitted foxes with", l2: "GPS collars" },
  { tag: "finding", l1: "Foxes avoided", l2: "busy streets" },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls(A, "scene")}>
        {rows.map((r, i) => {
          const y = rowY(i);
          return (
            <g key={r.tag}>
              {/* The tag, then the arrow down to the next stage */}
              <g className={cls(A, `tag${i}`)}>
                <rect x={16} y={y + 5} width={56} height={20} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
                <text x={44} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
                  {r.tag}
                </text>
              </g>
              {i < 2 && (
                <path className={cls(A, "arr")} d={`M44 ${y + 27} L44 ${y + 39} M40 ${y + 35} L44 ${y + 39} L48 ${y + 35}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
              )}
              {/* The note chip. Aim fades back in once the goal asks for it. */}
              <g className={cls(A, `r${i}`)}>
                <g className={i === 1 ? undefined : cls(A, i === 0 ? "dim0" : "dim2")} opacity={i === 2 ? 0.45 : 1}>
                  <rect
                    className={i === 2 ? undefined : cls(A, i === 0 ? "box0" : "box1")}
                    x={ROW_X}
                    y={y}
                    width={ROW_W}
                    height={30}
                    rx={8}
                    fill={i === 2 ? C.fill : C.goodSoft}
                    stroke={i === 2 ? C.line : C.good}
                    strokeWidth={1.5}
                  />
                  <text x={ROW_X + 10} y={y + 13} fontSize={11} fontWeight={600} fill={C.ink}>
                    {r.l1}
                  </text>
                  <text x={ROW_X + 10} y={y + 25} fontSize={11} fontWeight={600} fill={C.ink}>
                    {r.l2}
                  </text>
                </g>
              </g>
            </g>
          );
        })}

        {/* Bracket joining aim and method for the two-part goal */}
        <path className={cls(A, "bracket")} d="M266 18 L272 18 L272 70 L266 70" pathLength={100} strokeDasharray={100} fill="none" stroke={C.good} strokeWidth={2} />

        {/* The goal: method first, then aim + method */}
        <g className={cls(A, "goalA")}>
          <g className={cls(A, "goalAx")} opacity={0}>
            <text x={16} y={156} fontSize={14} fontWeight={600} fill={C.ink}>
              <tspan fill={C.muted}>Goal: </tspan>
              <tspan fill={C.primaryText} fontWeight={700}>
                method
              </tspan>
            </text>
          </g>
        </g>
        <g className={cls(A, "goalB")}>
          <text x={16} y={156} fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fill={C.muted}>Goal: </tspan>
            <tspan fill={C.primaryText} fontWeight={700}>
              aim + method
            </tspan>
          </text>
        </g>

        {/* A choice with only one of the two parts */}
        <g className={cls(A, "half")}>
          <rect x={160} y={140} width={144} height={22} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={232} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bad}>
            aim only: half the job
          </text>
        </g>
      </g>
    </Svg>
  );
}
