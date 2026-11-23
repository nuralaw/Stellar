import { C, Css, Svg } from "./kit";

// Central ideas, "Match the strength": some is not all, may is not proves. A choice must be as strong as the text.
export const alt = "A text with hedge words (small, hints, may, some). A board of weak words and strong words. The choice using proves and every is stamped too strong; the choice that keeps the text's words matches.";

const P = "v-central-ideas--strength-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;
const paint = (n: string, from: string, to: string, t: number) => `.${P}${n} { fill: ${to}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${from} } ${t + 6}%, 100% { fill: ${to} } }`;

const css = `
.v-central-ideas--strength-a { animation: 10s ease-in-out infinite; }
.v-central-ideas--strength-scene { animation-name: v-central-ideas--strength-scene; }
@keyframes v-central-ideas--strength-scene { 0% { opacity: 0 } 6%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("text", 4)}
${paint("hedge", C.ink, C.primaryText, 14)}
${show("row1", 26)}
${show("row2", 32)}
${show("c1", 44)}
.v-central-ideas--strength-flash { transform-box: fill-box; transform-origin: center; animation-name: v-central-ideas--strength-flash; }
@keyframes v-central-ideas--strength-flash { 0%, 52% { transform: scale(1) } 57% { transform: scale(1.3) } 62% { transform: scale(1) } 67% { transform: scale(1.3) } 72%, 100% { transform: scale(1) } }
${paint("hot", C.ink, C.bad, 52)}
${fade("stamp", 62)}
${show("c2", 72)}
${fade("match", 80)}
`;

const WEAK = [
  { w: "some", x: 62, wd: 38 },
  { w: "most", x: 104, wd: 38 },
  { w: "may", x: 146, wd: 32 },
  { w: "suggests", x: 182, wd: 56 },
];
const STRONG = [
  { w: "all", x: 62, wd: 28, hot: false },
  { w: "every", x: 94, wd: 42, hot: true },
  { w: "always", x: 140, wd: 48, hot: false },
  { w: "proves", x: 192, wd: 48, hot: true },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-central-ideas--strength-a v-central-ideas--strength-scene">
        {/* The text, hedge words lit */}
        <g className="v-central-ideas--strength-a v-central-ideas--strength-text">
          <rect x={16} y={10} width={288} height={42} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={28} y={28}>
              A <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hedge">small</tspan> study{" "}
              <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hedge">hints</tspan> that a walk
            </tspan>
            <tspan x={28} y={43}>
              <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hedge">may</tspan> help{" "}
              <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hedge">some</tspan> students.
            </tspan>
          </text>
        </g>

        {/* The word board */}
        <g className="v-central-ideas--strength-a v-central-ideas--strength-row1">
          <text x={16} y={70} fontSize={11} fontWeight={700} fill={C.muted}>weaker</text>
          {WEAK.map((p) => (
            <g key={p.w}>
              <rect x={p.x + 12} y={59} width={p.wd} height={16} rx={8} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
              <text x={p.x + 12 + p.wd / 2} y={70.5} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>{p.w}</text>
            </g>
          ))}
        </g>
        <g className="v-central-ideas--strength-a v-central-ideas--strength-row2">
          <text x={16} y={92} fontSize={11} fontWeight={700} fill={C.bad}>strong</text>
          {STRONG.map((p) => (
            <g key={p.w} className={p.hot ? "v-central-ideas--strength-a v-central-ideas--strength-flash" : undefined}>
              <rect x={p.x + 12} y={81} width={p.wd} height={16} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
              <text x={p.x + 12 + p.wd / 2} y={92.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>{p.w}</text>
            </g>
          ))}
        </g>

        {/* Choice 1: too strong */}
        <g className="v-central-ideas--strength-a v-central-ideas--strength-c1">
          <rect x={14} y={114} width={142} height={48} rx={9} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.ink}>
            <tspan x={22} y={130}>A study <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hot">proves</tspan> that</tspan>
            <tspan x={22} y={143}>a walk raises <tspan fontWeight={700} className="v-central-ideas--strength-a v-central-ideas--strength-hot">every</tspan></tspan>
            <tspan x={22} y={156}>student’s score</tspan>
          </text>
        </g>
        <g className="v-central-ideas--strength-a v-central-ideas--strength-stamp">
          <rect x={46} y={107} width={78} height={14} rx={7} fill={C.bad} />
          <text x={85} y={117.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>too strong</text>
        </g>

        {/* Choice 2: matches */}
        <g className="v-central-ideas--strength-a v-central-ideas--strength-c2">
          <rect x={164} y={114} width={142} height={48} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.ink}>
            <tspan x={172} y={130}>A small study hints</tspan>
            <tspan x={172} y={143}>that a walk may help</tspan>
            <tspan x={172} y={156}>some students</tspan>
          </text>
        </g>
        <g className="v-central-ideas--strength-a v-central-ideas--strength-match">
          <rect x={186} y={107} width={98} height={14} rx={7} fill={C.good} />
          <text x={235} y={117.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>matches the text</text>
        </g>
      </g>
    </Svg>
  );
}
