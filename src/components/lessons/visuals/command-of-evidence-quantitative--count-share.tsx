import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "Compare shares": West has more band students (36 vs 30), but East has the larger share (30% vs 18%).
export const alt = "Count column: East 30, West 36, so West has more. Percent column: East 30 percent, West 18 percent, so East has the larger share. Read the column; no dividing.";

const P = "v-command-of-evidence-quantitative--count-share-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const grow = (n: string, t: number) => `.${P}${n} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { transform: scaleY(0) } ${t + 9}%, 100% { transform: scaleY(1) } }`;

const css = `
.v-command-of-evidence-quantitative--count-share-a { animation: 10s ease-in-out infinite; }
.v-command-of-evidence-quantitative--count-share-scene { animation-name: v-command-of-evidence-quantitative--count-share-scene; }
@keyframes v-command-of-evidence-quantitative--count-share-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${grow("c1", 6)}
${grow("c2", 10)}
${show("cv", 18)}
${show("no", 26)}
${show("arrow", 40)}
${grow("s1", 50)}
${grow("s2", 54)}
${show("sv", 62)}
${show("yes", 70)}
`;

const BASE = 118;
const K = 1.8;
const W = 30;

function Bar({ x, v, cls, fill, stroke }: { x: number; v: number; cls: string; fill: string; stroke: string }) {
  return <rect className={`v-command-of-evidence-quantitative--count-share-a ${P}${cls}`} x={x} y={BASE - v * K} width={W} height={v * K} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-scene`}>
        {/* Counts */}
        <text x={81} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
          count column
        </text>
        <path d={`M30 ${BASE} H132`} stroke={C.muted} strokeWidth={1.5} fill="none" />
        <Bar x={46} v={30} cls="c1" fill={C.fill} stroke={C.muted} />
        <Bar x={86} v={36} cls="c2" fill={C.fill} stroke={C.muted} />
        <g className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-cv`}>
          <text x={61} y={BASE - 30 * K - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            30
          </text>
          <text x={101} y={BASE - 36 * K - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            36
          </text>
        </g>
        <text x={61} y={133} textAnchor="middle" fontSize={11} fill={C.muted}>
          East
        </text>
        <text x={101} y={133} textAnchor="middle" fontSize={11} fill={C.muted}>
          West
        </text>
        <text className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-no`} x={81} y={154} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bad}>
          West has more
        </text>

        {/* switch to the percent column */}
        <g className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-arrow`}>
          <path d="M138 86 H166 M160 81 L167 86 L160 91" fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={152} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            switch
          </text>
        </g>

        {/* Shares */}
        <text x={238} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
          percent column
        </text>
        <path d={`M176 ${BASE} H300`} stroke={C.muted} strokeWidth={1.5} fill="none" />
        <Bar x={202} v={30} cls="s1" fill={C.soft} stroke={C.primary} />
        <Bar x={246} v={18} cls="s2" fill={C.fill} stroke={C.muted} />
        <g className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-sv`}>
          <text x={217} y={BASE - 30 * K - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            30%
          </text>
          <text x={261} y={BASE - 18 * K - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            18%
          </text>
        </g>
        <text x={217} y={133} textAnchor="middle" fontSize={11} fill={C.muted}>
          East
        </text>
        <text x={261} y={133} textAnchor="middle" fontSize={11} fill={C.muted}>
          West
        </text>
        <text className={`v-command-of-evidence-quantitative--count-share-a v-command-of-evidence-quantitative--count-share-yes`} x={238} y={154} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
          larger share: East
        </text>
      </g>
    </Svg>
  );
}
