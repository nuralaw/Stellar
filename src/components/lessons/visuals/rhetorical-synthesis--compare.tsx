import { C, Css, Svg } from "./kit";

// Compare: both things, the same feature, a signal word. Similarity links the 40,000-book chips; difference links the dates; a one-sided sentence bounces off.
export const alt =
  "Two library cards. For a similarity goal the matching 40,000 books chips link with both; for a difference goal the 1921 and 1987 chips link with while; a sentence about one library only is rejected.";

const P = "v-rhetorical-synthesis--compare-";
const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const rise = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
/** Visible between t and off, gone afterwards. */
const blink = (n: string, t: number, off: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, ${off}% { opacity: 1 } ${off + 4}%, 100% { opacity: 0 }`);

const css = `
${rule("a", "animation: 11s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${rise("cards", 6)}
${fade("pillS", 14)}
${fade("pillD", 49)}
${kf("pillSOn", `0%, 14% { fill: ${C.fill}; stroke: ${C.line} } 18%, 47% { fill: ${C.soft}; stroke: ${C.primary} } 52%, 100% { fill: ${C.fill}; stroke: ${C.line} }`)}
${kf("pillSTx", `0%, 14% { fill: ${C.muted} } 18%, 47% { fill: ${C.primaryText} } 52%, 100% { fill: ${C.muted} }`)}
${kf("chipS", `0%, 22% { fill: ${C.fill}; stroke: ${C.line} } 26%, 47% { fill: ${C.soft}; stroke: ${C.primary} } 52%, 100% { fill: ${C.fill}; stroke: ${C.line} }`)}
${kf("chipD", `0%, 54% { fill: ${C.fill}; stroke: ${C.line} } 58%, 100% { fill: ${C.soft}; stroke: ${C.primary} }`)}
${kf("lineS", `0%, 26% { stroke-dashoffset: 100; stroke: ${C.primary} } 31%, 47% { stroke-dashoffset: 0; stroke: ${C.primary} } 52%, 100% { stroke-dashoffset: 0; stroke: ${C.muted} }`)}
${kf("lineD", `0%, 58% { stroke-dashoffset: 100 } 63%, 100% { stroke-dashoffset: 0 }`)}
${blink("sigS", 31, 47)}
${fade("sigSm", 47)}
${fade("sigD", 63)}
${kf("third", `0%, 72% { opacity: 0; transform: translateY(10px) } 77%, 80% { opacity: 1; transform: translateY(-6px) } 82% { transform: translate(-5px, -6px) } 84% { transform: translate(5px, -6px) } 86% { transform: translate(-3px, -6px) } 90%, 100% { opacity: 1; transform: none }`)}
${kf("thirdBox", `0%, 80% { fill: ${C.fill}; stroke: ${C.line} } 83%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} }`)}
${fade("thirdTag", 86)}
`;

const A = "a";
const CARD_Y = 14;
const CARD_H = 76;

/** One library card with its two feature chips. The chip boxes take fill and stroke from the classes. */
function Card({ x, name, date }: { x: number; name: string; date: string }) {
  return (
    <g>
      <rect x={x} y={CARD_Y} width={136} height={CARD_H} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} />
      <text x={x + 12} y={32} fontSize={13} fontWeight={700} fill={C.ink}>
        {name}
      </text>
      <rect className={cls(A, "chipD")} x={x + 12} y={38} width={108} height={20} rx={10} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <text x={x + 66} y={52} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
        {date}
      </text>
      <rect className={cls(A, "chipS")} x={x + 12} y={62} width={108} height={20} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={x + 66} y={76} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
        40,000 books
      </text>
    </g>
  );
}

/** The signal word sitting on a link. */
function Signal({ y, word, tone, name }: { y: number; word: string; tone: "on" | "off"; name: string }) {
  const on = tone === "on";
  return (
    <g className={cls(A, name)}>
      <rect x={141} y={y - 9} width={38} height={18} rx={9} fill={on ? C.soft : C.fill} stroke={on ? C.primary : C.muted} strokeWidth={1.5} />
      <text x={160} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? C.primaryText : C.muted}>
        {word}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls(A, "scene")}>
        <g className={cls(A, "cards")}>
          <Card x={16} name="Pine Hill" date="opened 1921" />
          <Card x={168} name="Cedar Park" date="opened 1987" />
        </g>

        {/* The matching pair, linked by "both" (pale once the goal moves on), then the differing pair, linked by "while" */}
        <path className={cls(A, "lineS")} d="M136 72 L184 72" pathLength={100} strokeDasharray={100} fill="none" stroke={C.muted} strokeWidth={2} />
        <Signal y={72} word="both" tone="on" name="sigS" />
        <Signal y={72} word="both" tone="off" name="sigSm" />
        <path className={cls(A, "lineD")} d="M136 48 L184 48" pathLength={100} strokeDasharray={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <Signal y={48} word="while" tone="on" name="sigD" />

        {/* The goal toggle */}
        <g className={cls(A, "pillS")}>
          <rect className={cls(A, "pillSOn")} x={52} y={100} width={100} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text className={cls(A, "pillSTx")} x={102} y={115} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
            similarity
          </text>
        </g>
        <g className={cls(A, "pillD")}>
          <rect x={168} y={100} width={100} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={218} y={115} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            difference
          </text>
        </g>

        {/* A sentence about one library only: it tries to land and bounces off */}
        <g className={cls(A, "third")}>
          <rect className={cls(A, "thirdBox")} x={16} y={132} width={176} height={26} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={28} y={149} fontSize={11} fontWeight={600} fill={C.ink}>
            Pine Hill holds 40,000 books.
          </text>
        </g>
        <g className={cls(A, "thirdTag")}>
          <text x={204} y={149} fontSize={12} fontWeight={700} fill={C.bad}>
            one side only
          </text>
        </g>
      </g>
    </Svg>
  );
}
