import { C, Css, Svg } from "./kit";

// Central ideas, "Grant, then point": the author grants a small point, "but" turns, the point after it is the main idea.
export const alt = "A sentence in two halves: the first half grants a point (greyed out), the word but turns it, and the second half, the narrator is the real strength, glows as the main idea.";

const P = "v-central-ideas--grant-point-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.v-central-ideas--grant-point-a { animation: 9s ease-in-out infinite; }
.v-central-ideas--grant-point-scene { animation-name: v-central-ideas--grant-point-scene; }
@keyframes v-central-ideas--grant-point-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("grant", 8)}
${show("but", 30)}
${show("point", 48)}
${show("main", 70)}
.v-central-ideas--grant-point-pointBox { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-central-ideas--grant-point-pointBox; }
@keyframes v-central-ideas--grant-point-pointBox { 0%, 50% { fill: ${C.fill}; stroke: ${C.line} } 58%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-scene`}>
        {/* The grant */}
        <g className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-grant`}>
          <text x={16} y={22} fontSize={11} fontWeight={600} fill={C.muted}>
            the author grants…
          </text>
          <rect x={16} y={28} width={288} height={30} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={160} y={48} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.muted}>
            Not unreasonable to admire the plot,
          </text>
        </g>

        {/* The turn */}
        <g className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-but`}>
          <rect x={136} y={66} width={48} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={83} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText}>
            but
          </text>
        </g>

        {/* The point */}
        <g className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-point`}>
          <text x={16} y={110} fontSize={11} fontWeight={600} fill={C.primaryText}>
            …then makes the point
          </text>
          <rect className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-pointBox`} x={16} y={116} width={288} height={30} rx={8} strokeWidth={1.5} />
          <text x={160} y={136} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            the narrator is the real strength.
          </text>
        </g>

        <g className={`v-central-ideas--grant-point-a v-central-ideas--grant-point-main`}>
          <text x={160} y={166} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
            main idea = the point
          </text>
        </g>
      </g>
    </Svg>
  );
}
