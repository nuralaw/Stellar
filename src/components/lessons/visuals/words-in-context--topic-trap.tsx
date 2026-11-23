import { C, Css, Svg } from "./kit";

// Words in context, "Topic trap": a choice that fits the topic is not proven by the text; only the choice the clue supports survives.
export const alt = "Narrow and cracked are the clues. Historic and scenic get dotted lines ending in a question mark and fade; unsuitable gets solid lines to both clues and locks in green.";

const P = "v-words-in-context--topic-trap-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number, d = 8) => r(n, `stroke-dasharray: 100; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 }`);
const fade = (n: string, t: number) => r(n, `opacity: 0.4; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 1 } ${t + 6}%, 100% { opacity: 0.4 }`);
const lit = (n: string, t: number) => r(n, `fill: ${C.primaryText}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.ink} } ${t + 8}%, 100% { fill: ${C.primaryText} }`);

const css = [
  r("a", "animation: 10s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("sent", 4),
  lit("w1", 10),
  lit("w2", 14),
  draw("u1", 10, 6),
  draw("u2", 14, 6),
  show("chips", 18),
  show("cards", 30),
  show("dots", 42),
  draw("s1", 44, 7),
  draw("s2", 48, 7),
  fade("dim1", 54),
  fade("dim2", 54),
  show("tno", 54),
  r("ok", `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}ok;`),
  kf("ok", `0%, 60% { fill: ${C.fill}; stroke: ${C.line} } 66%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`),
  show("tyes", 62),
  show("fill", 72),
].join("\n");

const FS = 12;
const K = 6.4;

function Piece({ x, y, text, c }: { x: number; y: number; text: string; c?: string }) {
  return (
    <text className={c ? cls("a", c) : undefined} x={x} y={y} fontSize={FS} fontWeight={600} fill={C.ink} textLength={text.length * K} lengthAdjust="spacingAndGlyphs">
      {text}
    </text>
  );
}

function Card({ x, word, c }: { x: number; word: string; c?: string }) {
  return (
    <>
      <rect className={c ? cls("a", c) : undefined} x={x} y={128} width={92} height={26} rx={13} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={x + 46} y={145} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "sent")}>
          <Piece x={16} y={24} text="Because the old bridge was" />
          <Piece x={188} y={24} text="narrow" c="w1" />
          <Piece x={16} y={42} text="and its stone was" />
          <Piece x={132} y={42} text="cracked," c="w2" />
          <Piece x={190} y={42} text="engineers" />
          <Piece x={16} y={60} text="judged it" />
          <rect x={80} y={44} width={78} height={22} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <Piece x={164} y={60} text="for heavy trucks." />
        </g>
        <path className={cls("a", "u1")} d="M188 28 H227" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "u2")} d="M132 46 H177" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />

        {/* the clues, lifted out of the sentence */}
        <g className={cls("a", "chips")}>
          <rect x={70} y={80} width={70} height={20} rx={10} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={105} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            narrow
          </text>
          <rect x={180} y={80} width={70} height={20} rx={10} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={215} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            cracked
          </text>
        </g>

        {/* proof test: dotted lines that end in "?" vs solid lines to both clues */}
        <g className={cls("a", "dots")}>
          <path d="M62 126 L82 112" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 4" fill="none" />
          <circle cx={87} cy={108} r={8} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text x={87} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            ?
          </text>
          <path d="M258 126 L238 112" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 4" fill="none" />
          <circle cx={233} cy={108} r={8} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text x={233} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            ?
          </text>
        </g>
        <path className={cls("a", "s1")} d="M160 126 L108 102" pathLength={100} stroke={C.good} strokeWidth={2.5} fill="none" />
        <path className={cls("a", "s2")} d="M160 126 L212 102" pathLength={100} stroke={C.good} strokeWidth={2.5} fill="none" />

        <g className={cls("a", "cards")}>
          <g className={cls("a", "dim1")}>
            <Card x={16} word="historic" />
          </g>
          <Card x={114} word="unsuitable" c="ok" />
          <g className={cls("a", "dim2")}>
            <Card x={212} word="scenic" />
          </g>
        </g>

        <g className={cls("a", "tno")}>
          <text x={62} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            no proof
          </text>
          <text x={258} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            no proof
          </text>
        </g>
        <g className={cls("a", "tyes")}>
          <text x={160} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.good}>
            proved by the clue
          </text>
        </g>
        <g className={cls("a", "fill")}>
          <text x={119} y={60} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.good}>
            unsuitable
          </text>
        </g>
      </g>
    </Svg>
  );
}
