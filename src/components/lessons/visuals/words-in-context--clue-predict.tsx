import { C, Css, Svg } from "./kit";

// Words in context, "Clue, predict, match": the blank is solved from the text. Find the clue, predict your own word, then match a choice.
export const alt = "A blank solved from the text: the clue is underlined with an arrow to the blank, the prediction pays attention appears, then attentive matches and distant and hasty are crossed out.";

const P = "v-words-in-context--clue-predict-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number, d = 8) => r(n, `stroke-dasharray: 100; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 }`);
const bad = (n: string, t: number) => r(n, `fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} }`);

const css = [
  r("a", "animation: 10s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("sent", 4),
  r("pulse", `opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: ${P}pulse;`),
  kf("pulse", "0%, 8% { opacity: 0; transform: scale(1) } 10% { opacity: 0.9; transform: scale(1) } 18%, 100% { opacity: 0; transform: scale(1.18) }"),
  draw("u2", 18),
  draw("u3", 24, 6),
  r("clue", `fill: ${C.primaryText}; animation-name: ${P}clue;`),
  kf("clue", `0%, 18% { fill: ${C.ink} } 26%, 100% { fill: ${C.primaryText} }`),
  show("tclue", 22),
  draw("arrow", 30),
  show("bubble", 38),
  r("type", `transform-box: fill-box; transform-origin: right center; transform: scaleX(0); animation-name: ${P}type;`),
  kf("type", "0%, 42% { transform: scaleX(1) } 52%, 100% { transform: scaleX(0) }"),
  show("tpred", 38),
  show("cards", 52),
  bad("b1", 60),
  bad("b2", 66),
  draw("x1", 60, 5),
  draw("x2", 66, 5),
  r("ok", `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}ok;`),
  kf("ok", `0%, 72% { fill: ${C.fill}; stroke: ${C.line} } 78%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`),
  show("fill", 80),
  show("tmatch", 72),
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

function Tag({ x, y, text, c, anchor = "start" }: { x: number; y: number; text: string; c: string; anchor?: "start" | "middle" }) {
  return (
    <g className={cls("a", c)}>
      <text x={x} y={y} textAnchor={anchor} fontSize={11} fontWeight={700} fill={C.primaryText}>
        {text}
      </text>
    </g>
  );
}

function Card({ x, word, c, xc }: { x: number; word: string; c: string; xc?: string }) {
  return (
    <>
      <rect className={cls("a", c)} x={x} y={118} width={92} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 46} y={135} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {word}
      </text>
      {xc && <path className={cls("a", xc)} d={`M${x + 18} 131 L${x + 74} 131`} pathLength={100} stroke={C.bad} strokeWidth={2} fill="none" />}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "sent")}>
          <Piece x={16} y={56} text="The new principal is" />
          <rect x={146} y={40} width={70} height={22} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={221} y={56} fontSize={FS} fontWeight={600} fill={C.ink}>
            :
          </text>
          <Piece x={16} y={76} text="she answers every email within an hour" c="clue" />
          <Piece x={16} y={94} text="and never forgets a name." c="clue" />
        </g>
        <rect className={cls("a", "pulse")} x={146} y={40} width={70} height={22} rx={7} fill="none" stroke={C.primary} strokeWidth={2} />

        {/* the clue: underline + arrow back to the blank */}
        <path className={cls("a", "u2")} d="M16 80 H259" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "u3")} d="M16 98 H171" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <Tag x={180} y={98} text="clue" c="tclue" />
        <path className={cls("a", "arrow")} d="M206 94 C300 104 306 48 236 51" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "tclue")} d="M242 45 L235 51 L242 57" stroke={C.primary} strokeWidth={2} fill="none" />

        {/* the prediction */}
        <g className={cls("a", "bubble")}>
          <rect x={112} y={6} width={118} height={24} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <path d="M176 30 L181 40" stroke={C.line} strokeWidth={1.5} fill="none" />
          <text x={171} y={22} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            pays attention
          </text>
          <rect className={cls("a", "type")} x={112} y={7} width={118} height={22} rx={11} fill={C.fill} stroke="none" />
        </g>
        <Tag x={238} y={22} text="predict" c="tpred" />

        {/* match a choice */}
        <g className={cls("a", "cards")}>
          <Card x={16} word="distant" c="b1" xc="x1" />
          <Card x={114} word="attentive" c="ok" />
          <Card x={212} word="hasty" c="b2" xc="x2" />
        </g>
        <Tag x={160} y={166} text="match" c="tmatch" anchor="middle" />
        <g className={cls("a", "fill")}>
          <text x={181} y={56} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.good}>
            attentive
          </text>
        </g>
      </g>
    </Svg>
  );
}
