import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "Finish the statement": two passes. Cross out every choice that misreads the table, then pick the accurate choice that does the job the sentence needs.
export const alt = "Pass 1: a magnifier finds Brook misread (years swapped). Pass 2: Hartley is true but the wrong job; Quill fell, so it fits. Accurate first, then on target.";

const P = "v-command-of-evidence-quantitative--cross-out-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const bad = (n: string, t: number) => r(n, `fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} }`);
const good = (n: string, t: number) => r(n, `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`);

const css = [
  r("a", "animation: 10s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("tbl", 4),
  show("sent", 8),
  show("cards", 12),
  show("p1", 20),
  r("lens", `opacity: 0; animation-name: ${P}lens;`),
  kf("lens", "0%, 22% { opacity: 0; transform: translate(170px, 145px) } 25% { opacity: 1; transform: translate(170px, 145px) } 34% { opacity: 1; transform: translate(278px, 145px) } 37%, 100% { opacity: 0; transform: translate(278px, 145px) }"),
  show("rowb", 26),
  bad("cbad", 34),
  show("tmis", 36),
  r("p1dim", `opacity: 0.5; animation-name: ${P}p1dim;`),
  kf("p1dim", "0%, 44% { opacity: 1 } 50%, 100% { opacity: 0.5 }"),
  show("p2", 46),
  show("tjob", 52),
  show("rowq", 62),
  good("bok", 62),
  show("tfit", 64),
  show("close", 76),
].join("\n");

const FS = 11.5;

function T({ x, y, t, color = C.ink, w = 700, size = FS, anchor = "start" }: { x: number; y: number; t: string; color?: string; w?: number; size?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={w} fill={color}>
      {t}
    </text>
  );
}

function Card({ y, name, text, c }: { y: number; name: string; text: string; c?: string }) {
  return (
    <>
      <rect className={c ? cls("a", c) : undefined} x={156} y={y} width={148} height={32} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <T x={166} y={y + 14} t={name} color={C.muted} />
      <T x={180} y={y + 14} t={text} />
    </>
  );
}

export default function Visual() {
  const rows = [
    { y: 42, m: "Hartley", a: "150", b: "170" },
    { y: 60, m: "Quill", a: "80", b: "65" },
    { y: 78, m: "Brook", a: "90", b: "110" },
  ];
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* the table */}
        <g className={cls("a", "tbl")}>
          <rect x={16} y={24} width={124} height={18} rx={4} fill={C.fill} />
          <T x={20} y={37} t="Museum" size={11} />
          <T x={90} y={37} t="2019" size={11} anchor="middle" />
          <T x={123} y={37} t="2023" size={11} anchor="middle" />
          <path d="M16 60 H140 M16 78 H140 M16 96 H140" stroke={C.line} strokeWidth={1} fill="none" />
          {rows.map((row) => (
            <g key={row.m}>
              <T x={20} y={row.y + 13} t={row.m} size={11} w={600} />
              <T x={90} y={row.y + 13} t={row.a} size={11} w={600} anchor="middle" />
              <T x={123} y={row.y + 13} t={row.b} size={11} w={600} anchor="middle" />
            </g>
          ))}
        </g>
        <rect className={cls("a", "rowb")} x={16} y={78} width={124} height={18} rx={4} fill="none" stroke={C.bad} strokeWidth={2} />
        <g className={cls("a", "rowq")}>
          <rect x={16} y={60} width={124} height={18} rx={4} fill="none" stroke={C.good} strokeWidth={2} />
          <path d="M147 62 V76 M142 70 L147 76 L152 70" stroke={C.good} strokeWidth={2} fill="none" />
        </g>

        {/* the sentence and the choices */}
        <g className={cls("a", "sent")}>
          <T x={156} y={18} t="Most rose, but not all:" size={12} w={600} />
          <T x={156} y={38} t="for example" size={12} w={600} />
          <rect x={232} y={22} width={72} height={22} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        </g>
        <g className={cls("a", "cards")}>
          <Card y={52} name="A" text="Hartley had 150" />
          <Card y={90} name="B" text="Quill 80 → 65" c="bok" />
          <Card y={128} name="C" text="Brook 110 → 90" c="cbad" />
        </g>
        <g className={cls("a", "tjob")}>
          <T x={166} y={78} t="true, wrong job" color={C.muted} size={11} />
        </g>
        <g className={cls("a", "tfit")}>
          <T x={166} y={116} t="a case that fell" color={C.good} size={11} />
        </g>
        <g className={cls("a", "tmis")}>
          <T x={166} y={154} t="misread: years swapped" color={C.bad} size={11} />
        </g>

        {/* pass 1: magnifier */}
        <g className={cls("a", "lens")}>
          <circle cx={0} cy={0} r={6} fill="none" stroke={C.primary} strokeWidth={2} />
          <path d="M4.5 4.5 L10 10" stroke={C.primary} strokeWidth={2.5} fill="none" />
        </g>

        {/* the two passes */}
        <g className={cls("a", "p1")}>
          <g className={cls("a", "p1dim")}>
            <circle cx={21} cy={111} r={4.5} fill="none" stroke={C.bad} strokeWidth={1.8} />
            <path d="M24.5 114.5 L28 118" stroke={C.bad} strokeWidth={2} fill="none" />
            <T x={34} y={116} t="pass 1: accurate?" color={C.ink} size={11} />
          </g>
        </g>
        <g className={cls("a", "p2")}>
          <circle cx={21} cy={133} r={5.5} fill="none" stroke={C.good} strokeWidth={1.8} />
          <circle cx={21} cy={133} r={1.8} fill={C.good} />
          <T x={34} y={137} t="pass 2: right job?" color={C.ink} size={11} />
        </g>

        {/* the rule */}
        <g className={cls("a", "close")}>
          <T x={16} y={155} t="Accurate first." color={C.primaryText} size={12} />
          <T x={16} y={169} t="Then on target." color={C.primaryText} size={12} />
        </g>
      </g>
    </Svg>
  );
}
