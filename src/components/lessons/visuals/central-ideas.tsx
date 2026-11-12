import { C, Css, Svg } from "./kit";

// Central ideas: find the pivot word, drop the old view and the detail, keep topic + point as the main idea.
export const alt = "A short text about octopus sleep: the word But marks the turn, the old view and a detail fade, and the main idea locks in: octopus sleep has an active stage.";

const css = `
.v-central-ideas-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-central-ideas-scene { animation-name: v-central-ideas-scene; }
@keyframes v-central-ideas-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the pivot word lights up */
.v-central-ideas-pill { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-central-ideas-pill; }
@keyframes v-central-ideas-pill { 0%, 12% { fill: ${C.fill}; stroke: ${C.line} } 17%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-central-ideas-but { fill: ${C.primary}; animation-name: v-central-ideas-but; }
@keyframes v-central-ideas-but { 0%, 12% { fill: ${C.ink} } 17%, 100% { fill: ${C.primary} } }
.v-central-ideas-pop { transform-box: fill-box; transform-origin: center; animation-name: v-central-ideas-pop; }
@keyframes v-central-ideas-pop { 0%, 12% { transform: scale(1) } 17% { transform: scale(1.18) } 23%, 100% { transform: scale(1) } }

/* Beat 2: before the pivot = the old view, it steps back */
.v-central-ideas-old { fill: ${C.muted}; animation-name: v-central-ideas-old; }
@keyframes v-central-ideas-old { 0%, 26% { fill: ${C.ink} } 32%, 100% { fill: ${C.muted} } }
.v-central-ideas-tag1 { animation-name: v-central-ideas-tag1; }
@keyframes v-central-ideas-tag1 { 0%, 27% { opacity: 0; transform: translateX(6px) } 33%, 100% { opacity: 1; transform: none } }

/* Beat 3: after the pivot = the point */
.v-central-ideas-point { fill: ${C.primary}; animation-name: v-central-ideas-point; }
@keyframes v-central-ideas-point { 0%, 40% { fill: ${C.ink} } 46%, 100% { fill: ${C.primary} } }
.v-central-ideas-tag2 { animation-name: v-central-ideas-tag2; }
@keyframes v-central-ideas-tag2 { 0%, 41% { opacity: 0; transform: translateX(6px) } 47%, 100% { opacity: 1; transform: none } }

/* ...and the examples are only a detail */
.v-central-ideas-det { fill: ${C.muted}; animation-name: v-central-ideas-det; }
@keyframes v-central-ideas-det { 0%, 52% { fill: ${C.ink} } 58%, 100% { fill: ${C.muted} } }
.v-central-ideas-tag3 { animation-name: v-central-ideas-tag3; }
@keyframes v-central-ideas-tag3 { 0%, 53% { opacity: 0; transform: translateX(6px) } 59%, 100% { opacity: 1; transform: none } }

/* Beat 4: topic + point drops out of the text as the main idea */
.v-central-ideas-idea { animation-name: v-central-ideas-idea; }
@keyframes v-central-ideas-idea { 0%, 64% { opacity: 0; transform: translateY(-10px) } 74%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-central-ideas-a v-central-ideas-scene">
        {/* The text: old view, pivot + point, detail */}
        <text x={24} y={42} fontSize={14} fontWeight={600} className="v-central-ideas-a v-central-ideas-old">
          Octopus sleep looked quiet.
        </text>

        <g className="v-central-ideas-a v-central-ideas-pop">
          <rect x={22} y={52} width={38} height={22} rx={11} strokeWidth={1.5} className="v-central-ideas-a v-central-ideas-pill" />
          <text x={41} y={68} textAnchor="middle" fontSize={14} fontWeight={700} className="v-central-ideas-a v-central-ideas-but">
            But
          </text>
        </g>
        <text x={66} y={68} fontSize={14} fontWeight={600} fill={C.ink}>
          film found an <tspan className="v-central-ideas-a v-central-ideas-point">active stage</tspan>:
        </text>

        <text x={24} y={94} fontSize={14} fontWeight={600} className="v-central-ideas-a v-central-ideas-det">
          flashing skin, twitching arms.
        </text>

        {/* What each line is */}
        <text x={296} y={42} textAnchor="end" fontSize={11} fill={C.muted} className="v-central-ideas-a v-central-ideas-tag1">
          old view
        </text>
        <text x={296} y={68} textAnchor="end" fontSize={11} fontWeight={700} fill={C.primary} className="v-central-ideas-a v-central-ideas-tag2">
          point
        </text>
        <text x={296} y={94} textAnchor="end" fontSize={11} fill={C.muted} className="v-central-ideas-a v-central-ideas-tag3">
          detail
        </text>

        {/* The main idea */}
        <g className="v-central-ideas-a v-central-ideas-idea">
          <rect x={24} y={118} width={272} height={36} rx={12} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <rect x={38} y={111} width={66} height={14} rx={7} fill={C.bg} />
          <text x={71} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.good}>
            main idea
          </text>
          <text x={160} y={142} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
            Octopus sleep has an active stage.
          </text>
        </g>
      </g>
    </Svg>
  );
}
