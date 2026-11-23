import { C, Css, Svg } from "./kit";

// Inferences, "Three traps": reversed cause, a link treated as a cause, and "could be true" with no sentence behind it.
export const alt = "Three traps: a reversed cause arrow; a dotted link turned into a solid cause (may be linked is safe); and a thought, the bakery cut prices, with no sentence behind it.";

const P = "v-inferences--traps-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("r1t", 5)}
${show("r1c", 12)}
.@@flip { transform-box: fill-box; transform-origin: center; transform: scaleX(-1); animation-name: @@flip; }
@keyframes @@flip { 0%, 20% { transform: scaleX(1) } 27%, 100% { transform: scaleX(-1) } }
.@@r1box { stroke: ${C.bad}; animation-name: @@r1box; }
@keyframes @@r1box { 0%, 26% { stroke: ${C.line} } 32%, 100% { stroke: ${C.bad} } }
${k("st1", "0%, 28% { opacity: 0; transform: scale(1.3) } 34%, 100% { opacity: 1; transform: none }")}
${show("r2t", 38)}
${show("r2c", 46)}
${k("st2", "0%, 52% { opacity: 0; transform: scale(1.3) } 58%, 100% { opacity: 1; transform: none }")}
${show("r2s", 58)}
${show("r3t", 67)}
.@@thought { animation-name: @@thought; }
@keyframes @@thought { 0%, 72% { opacity: 0; transform: translateY(-6px) } 78%, 100% { opacity: 1; transform: none } }
${k("st3", "0%, 80% { opacity: 0; transform: scale(1.3) } 86%, 100% { opacity: 1; transform: none }")}
${show("cap", 90)}
.@@st { transform-box: fill-box; transform-origin: center; }
`.replaceAll("@@", P);

const Node = ({ cx, cy, r = 8, label }: { cx: number; cy: number; r?: number; label?: string }) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
    {label && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>{label}</text>}
  </>
);

const Pill = ({ x, w, text, y = 66 }: { x: number; w: number; text: string; y?: number }) => (
  <>
    <rect x={x} y={y} width={w} height={18} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
    <text x={x + w / 2} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>{text}</text>
  </>
);

const Stamp = ({ x, y, lines, cn }: { x: number; y: number; lines: string[]; cn: string }) => (
  <g className={cls("a", "st", cn)}>
    {lines.map((t, i) => (
      <text key={t} x={x} y={y + i * 12} fontSize={11} fontWeight={700} fill={C.bad}>{t}</text>
    ))}
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* 1: reversed cause */}
        <g className={cls("a", "r1t")}>
          <rect x={16} y={18} width={104} height={26} rx={8} fill="none" stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={35} fontSize={11} fontWeight={600} fill={C.muted}>text</text>
          <Node cx={62} cy={31} label="A" />
          <Node cx={104} cy={31} label="B" />
          <path d="M72 31 H92 M88 27 L92 31 L88 35" fill="none" stroke={C.ink} strokeWidth={2} />
        </g>
        <g className={cls("a", "r1c")}>
          <rect className={cls("a", "r1box")} x={128} y={18} width={176} height={26} rx={8} fill={C.badSoft} strokeWidth={1.5} />
          <Node cx={146} cy={31} label="A" />
          <Node cx={190} cy={31} label="B" />
          <path className={cls("a", "flip")} d="M158 31 H178 M174 27 L178 31 L174 35" fill="none" stroke={C.bad} strokeWidth={2} />
        </g>
        <Stamp x={214} y={28} lines={["reversed", "cause"]} cn="st1" />

        {/* 2: a link is not a cause */}
        <g className={cls("a", "r2t")}>
          <rect x={16} y={50} width={124} height={52} rx={8} fill="none" stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={62} fontSize={11} fontWeight={600} fill={C.muted}>text</text>
          <Pill x={22} w={46} text="owners" />
          <Pill x={88} w={46} text="stress" />
          <path d="M72 75 H84" stroke={C.ink} strokeWidth={2.5} strokeDasharray="1 4" fill="none" />
          <path d="M75 71 L72 75 L75 79 M81 71 L84 75 L81 79" stroke={C.ink} strokeWidth={1.5} fill="none" />
          <text x={78} y={97} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>go together</text>
        </g>
        <g className={cls("a", "r2c")}>
          <rect x={148} y={50} width={156} height={26} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <Node cx={162} cy={63} r={5} />
          <Node cx={196} cy={63} r={5} />
          <path d="M169 63 H189 M185 59 L189 63 L185 67" fill="none" stroke={C.ink} strokeWidth={2} />
        </g>
        <Stamp x={212} y={60} lines={["link is not", "a cause"]} cn="st2" />
        <g className={cls("a", "r2s")}>
          <rect x={148} y={80} width={156} height={22} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Node cx={162} cy={91} r={5} />
          <Node cx={196} cy={91} r={5} />
          <path d="M169 91 H189" stroke={C.ink} strokeWidth={2.5} strokeDasharray="1 4" fill="none" />
          <text x={212} y={95} fontSize={11} fontWeight={700} fill={C.good}>may be linked</text>
        </g>

        {/* 3: could be true */}
        <g className={cls("a", "r3t")}>
          <rect x={16} y={108} width={124} height={44} rx={8} fill="none" stroke={C.line} strokeWidth={1.5} />
          <text x={24} y={121} fontSize={11} fontWeight={600} fill={C.muted}>text</text>
          <rect x={56} y={116} width={72} height={4} rx={2} fill={C.muted} />
          <rect x={56} y={126} width={60} height={4} rx={2} fill={C.muted} />
          <rect x={56} y={136} width={66} height={4} rx={2} fill={C.muted} />
        </g>
        <g className={cls("a", "thought")}>
          <rect x={150} y={108} width={152} height={20} rx={10} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={226} y={122} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>the bakery cut prices</text>
        </g>
        <Stamp x={150} y={142} lines={["could be true,", "not in the text"]} cn="st3" />

        <text className={cls("a", "cap")} x={160} y={165} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>Who does what to whom? Which sentence says so?</text>
      </g>
    </Svg>
  );
}
