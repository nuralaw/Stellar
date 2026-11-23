import { C, Css, Svg } from "./kit";

// Words in context, "Negation": a negative phrase (far from) flips the blank. Find what is true, then the blank is its opposite.
export const alt = "On a minus-to-plus gauge the true idea, helped, sits on the plus side; far from flips it to the minus side, so harmful fits the blank and helpful is crossed out.";

const P = "v-words-in-context--negation-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number, d = 8) => r(n, `stroke-dasharray: 100; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 }`);
const bad = (n: string, t: number) => r(n, `fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} }`);
const lit = (n: string, t: number) => r(n, `fill: ${C.primaryText}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.ink} } ${t + 8}%, 100% { fill: ${C.primaryText} }`);

const css = [
  r("a", "animation: 10s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("sent", 4),
  r("pulse", `opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: ${P}pulse;`),
  kf("pulse", "0%, 8% { opacity: 0; transform: scale(1) } 10% { opacity: 0.9; transform: scale(1) } 18%, 100% { opacity: 0; transform: scale(1.18) }"),
  show("gauge", 16),
  show("true", 22),
  lit("helped", 22),
  lit("far", 36),
  draw("arc", 38, 10),
  show("tflip", 38),
  r("land", `animation-name: ${P}land;`),
  kf("land", "0%, 46% { opacity: 0; transform: translateX(152px) } 56%, 100% { opacity: 1; transform: none }"),
  show("cards", 62),
  bad("b1", 70),
  draw("x1", 70, 5),
  r("ok", `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}ok;`),
  kf("ok", `0%, 76% { fill: ${C.fill}; stroke: ${C.line} } 82%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`),
  show("fill", 84),
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

function Marker({ x, text, fill, stroke }: { x: number; text: string; fill: string; stroke: string }) {
  return (
    <>
      <circle cx={x} cy={106} r={9} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={x} y={129} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
        {text}
      </text>
    </>
  );
}

function Card({ x, word, c, xc }: { x: number; word: string; c: string; xc?: string }) {
  return (
    <>
      <rect className={cls("a", c)} x={x} y={142} width={100} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 50} y={159} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {word}
      </text>
      {xc && <path className={cls("a", xc)} d={`M${x + 22} 155 L${x + 78} 155`} pathLength={100} stroke={C.bad} strokeWidth={2} fill="none" />}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "sent")}>
          <Piece x={16} y={34} text="Far from" c="far" />
          <Piece x={73} y={34} text="being" />
          <rect x={112} y={18} width={64} height={22} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={180} y={34} fontSize={FS} fontWeight={600} fill={C.ink}>
            ,
          </text>
          <Piece x={190} y={34} text="the new schedule" />
          <Piece x={16} y={54} text="helped" c="helped" />
          <Piece x={56} y={54} text=": students slept longer." />
        </g>
        <rect className={cls("a", "pulse")} x={112} y={18} width={64} height={22} rx={7} fill="none" stroke={C.primary} strokeWidth={2} />

        {/* the gauge */}
        <g className={cls("a", "gauge")}>
          <path d="M40 106 H280" stroke={C.muted} strokeWidth={2} fill="none" />
          <circle cx={28} cy={106} r={10} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text x={28} y={111} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            −
          </text>
          <circle cx={292} cy={106} r={10} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text x={292} y={111} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            +
          </text>
        </g>
        <g className={cls("a", "true")}>
          <Marker x={236} text="true" fill={C.fill} stroke={C.muted} />
        </g>

        {/* the flip */}
        <path className={cls("a", "arc")} d="M230 94 Q160 64 90 94" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "tflip")} d="M98 86 L90 94 L100 98" stroke={C.primary} strokeWidth={2} fill="none" />
        <g className={cls("a", "tflip")}>
          <text x={160} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            far from = flip
          </text>
        </g>
        <g className={cls("a", "land")}>
          <Marker x={84} text="blank" fill={C.soft} stroke={C.primary} />
        </g>

        {/* choices */}
        <g className={cls("a", "cards")}>
          <Card x={36} word="harmful" c="ok" />
          <Card x={184} word="helpful" c="b1" xc="x1" />
        </g>
        <g className={cls("a", "fill")}>
          <text x={144} y={34} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.good}>
            harmful
          </text>
        </g>
      </g>
    </Svg>
  );
}
