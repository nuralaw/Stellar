import { C, Css, Svg } from "./kit";

// Words in context, "Second meaning": a familiar word can have a second meaning. Cover it, read the sentence as a blank, predict from context.
export const alt = "The word carry is covered by a blank; its familiar meaning, lift, is set aside. The clue only two of nine voted points to it, so persuade fits and lift and transport are crossed out.";

const P = "v-words-in-context--second-meaning-";
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
  // "carry": highlighted, then covered
  r("hl", `opacity: 0; animation-name: ${P}hl;`),
  kf("hl", "0%, 5% { opacity: 0 } 10%, 30% { opacity: 1 } 36%, 100% { opacity: 0 }"),
  r("carry", `opacity: 0; animation-name: ${P}carry;`),
  kf("carry", `0%, 4% { opacity: 0 } 10% { opacity: 1; fill: ${C.primaryText} } 30% { opacity: 1; fill: ${C.primaryText} } 36%, 100% { opacity: 0 }`),
  // the meaning you know: appears, then is set aside
  r("fam", `opacity: 0; animation-name: ${P}fam;`),
  kf("fam", "0%, 12% { opacity: 0; transform: translateY(6px) } 18%, 28% { opacity: 1; transform: none } 34%, 100% { opacity: 0; transform: translateY(-14px) }"),
  show("blank", 32),
  show("tcover", 32),
  draw("u1", 38, 6),
  draw("u2", 42, 6),
  lit("w", 38),
  draw("arrow", 46, 6),
  r("head", `animation-name: ${P}head;`),
  kf("head", "0%, 50% { opacity: 0 } 54%, 100% { opacity: 1 }"),
  show("bubble", 52),
  r("type", `transform-box: fill-box; transform-origin: right center; transform: scaleX(0); animation-name: ${P}type;`),
  kf("type", "0%, 55% { transform: scaleX(1) } 63%, 100% { transform: scaleX(0) }"),
  show("tpred", 52),
  show("cards", 62),
  bad("b1", 68),
  bad("b2", 72),
  draw("x1", 68, 4),
  draw("x2", 72, 4),
  r("ok", `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}ok;`),
  kf("ok", `0%, 76% { fill: ${C.fill}; stroke: ${C.line} } 82%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`),
  show("fill", 82),
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

function Card({ x, word, c, xc }: { x: number; word: string; c: string; xc?: string }) {
  return (
    <>
      <rect className={cls("a", c)} x={x} y={124} width={92} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 46} y={141} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {word}
      </text>
      {xc && <path className={cls("a", xc)} d={`M${x + 18} 137 L${x + 74} 137`} pathLength={100} stroke={C.bad} strokeWidth={2} fill="none" />}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "sent")}>
          <Piece x={16} y={34} text="The mayor's plan failed to" />
          <Piece x={16} y={52} text="the council:" />
          <Piece x={99} y={52} text="only two of nine" c="w" />
          <Piece x={16} y={70} text="members voted" c="w" />
          <Piece x={105} y={70} text="for it." />
        </g>
        {/* the word carry: highlighted, then covered by a blank */}
        <rect className={cls("a", "hl")} x={184} y={19} width={42} height={21} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <text className={cls("a", "carry")} x={189} y={34} fontSize={FS} fontWeight={700} fill={C.primaryText} textLength={32} lengthAdjust="spacingAndGlyphs">
          carry
        </text>
        <g className={cls("a", "blank")}>
          <rect x={186} y={18} width={68} height={22} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        </g>
        <g className={cls("a", "tcover")}>
          <text x={220} y={13} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            cover it
          </text>
        </g>

        {/* the meaning you know */}
        <g className={cls("a", "fam")}>
          <rect x={16} y={86} width={78} height={24} rx={12} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <rect x={27} y={92} width={11} height={11} rx={2} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <path d="M27 96 H38" stroke={C.muted} strokeWidth={1.5} fill="none" />
          <text x={46} y={103} fontSize={12} fontWeight={700} fill={C.muted}>
            lift
          </text>
          <text x={102} y={102} fontSize={11} fontWeight={700} fill={C.muted}>
            meaning you know
          </text>
        </g>

        {/* the clue, the arrow, the prediction */}
        <path className={cls("a", "u1")} d="M99 56 H202" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "u2")} d="M16 74 H99" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "arrow")} d="M206 57 Q232 62 232 46" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "head")} d="M226 51 L232 43 L238 51" stroke={C.primary} strokeWidth={2} fill="none" />
        <g className={cls("a", "bubble")}>
          <rect x={16} y={86} width={84} height={24} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={58} y={102} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            win over
          </text>
          <rect className={cls("a", "type")} x={16} y={87} width={84} height={22} rx={11} fill={C.fill} stroke="none" />
        </g>
        <g className={cls("a", "tpred")}>
          <text x={108} y={102} fontSize={11} fontWeight={700} fill={C.primaryText}>
            predict
          </text>
        </g>

        {/* choices */}
        <g className={cls("a", "cards")}>
          <Card x={16} word="lift" c="b1" xc="x1" />
          <Card x={114} word="transport" c="b2" xc="x2" />
          <Card x={212} word="persuade" c="ok" />
        </g>
        <g className={cls("a", "fill")}>
          <text x={220} y={34} textAnchor="middle" fontSize={FS} fontWeight={700} fill={C.good}>
            persuade
          </text>
        </g>
      </g>
    </Svg>
  );
}
