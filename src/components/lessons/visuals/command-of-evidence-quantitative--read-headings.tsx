import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "Read the labels first": title, headings and units come before any number; a cell is where a row and a column meet.
export const alt = "Title, headings and units are read first. Bands for row B and the temperature column cross at 24; a 24 moved to the fish column is stamped wrong column. Years before present: bigger means older.";

const P = "v-command-of-evidence-quantitative--read-headings-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number, d = 6) => r(n, `stroke-dasharray: 100; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 }`);
/** Visible only between a% and b% (a pulse of attention); hidden in the final frame. */
const win = (n: string, a: number, b: number) => r(n, `opacity: 0; animation-name: ${P}${n};`) + kf(n, `0%, ${a}% { opacity: 0 } ${a + 2}%, ${b}% { opacity: 1 } ${b + 2}%, 100% { opacity: 0 }`);
const sweep = (n: string, t: number, from: string) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: ${from} } ${t + 2}% { opacity: 1; transform: ${from} } ${t + 7}%, 100% { opacity: 1; transform: none }`);

const css = [
  r("a", "animation: 12s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("tbl", 3),
  win("title", 5, 10),
  win("head", 12, 17),
  win("unit", 19, 24),
  show("pill", 27),
  sweep("hband", 29, "translateY(-17px)"),
  sweep("vband", 34, "translateX(-72px)"),
  show("glow", 40),
  show("card", 46),
  draw("move", 51),
  show("stamp", 56),
  show("mini", 62),
  draw("rev", 68),
  r("mhead", `animation-name: ${P}mhead;`),
  kf("mhead", "0%, 55% { opacity: 0 } 58%, 100% { opacity: 1 }"),
  r("rhead", `animation-name: ${P}rhead;`),
  kf("rhead", "0%, 72% { opacity: 0 } 75%, 100% { opacity: 1 }"),
  show("old", 72),
  show("close", 78),
].join("\n");

const TS = { fontSize: 11, fontWeight: 700 } as const;

function T({ x, y, t, color = C.ink, w = 700, size = 11, anchor = "middle" }: { x: number; y: number; t: string; color?: string; w?: number; size?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={w} fill={color}>
      {t}
    </text>
  );
}

export default function Visual() {
  const rows = [
    { y: 50, tank: "A", fish: "9", temp: "18" },
    { y: 67, tank: "B", fish: "7", temp: "24" },
    { y: 84, tank: "C", fish: "8", temp: "21" },
  ];
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* attention pulses: title, column headings, units */}
        <rect className={cls("a", "title")} x={12} y={4} width={76} height={17} rx={5} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("a", "head")} x={14} y={23} width={188} height={15} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("a", "unit")} x={54} y={39} width={148} height={12} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <g className={cls("a", "title")}>
          <T x={96} y={16} t="title" color={C.primaryText} anchor="start" />
        </g>
        <g className={cls("a", "head")}>
          <T x={210} y={35} t="column heading" color={C.primaryText} anchor="start" />
        </g>
        <g className={cls("a", "unit")}>
          <T x={210} y={48} t="unit" color={C.primaryText} anchor="start" />
        </g>

        {/* the table */}
        <g className={cls("a", "tbl")}>
          <T x={16} y={16} t="Tank study" size={12} anchor="start" />
          <rect x={16} y={22} width={184} height={28} rx={4} fill={C.fill} />
          <T x={36} y={40} t="Tank" />
          <T x={92} y={35} t="Fish length" />
          <T x={92} y={47} t="(cm)" color={C.muted} w={600} />
          <T x={164} y={35} t="Water temp" />
          <T x={164} y={47} t="(°C)" color={C.muted} w={600} />
          <path d="M16 67 H200 M16 84 H200 M16 101 H200" stroke={C.line} strokeWidth={1} fill="none" />
        </g>
        <g className={cls("a", "glow")}>
          <rect x={129} y={68} width={70} height={15} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={2} />
        </g>
        <g className={cls("a", "tbl")}>
          {rows.map((row) => (
            <g key={row.tank}>
              <T x={36} y={row.y + 12} t={row.tank} />
              <T x={92} y={row.y + 12} t={row.fish} w={600} />
              <T x={164} y={row.y + 12} t={row.temp} w={row.temp === "24" ? 700 : 600} />
            </g>
          ))}
        </g>
        <rect className={cls("a", "hband")} x={16} y={67} width={184} height={17} rx={3} fill="none" stroke={C.primary} strokeWidth={1.5} />
        <rect className={cls("a", "vband")} x={128} y={22} width={72} height={79} rx={3} fill="none" stroke={C.primary} strokeWidth={1.5} />

        {/* the question and a choice that misuses the 24 */}
        <g className={cls("a", "pill")}>
          <rect x={210} y={44} width={94} height={20} rx={10} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={257} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText} textLength={84} lengthAdjust="spacingAndGlyphs">
            the warmer tank
          </text>
        </g>
        <g className={cls("a", "card")}>
          <rect x={210} y={70} width={94} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={257} y={85} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} textLength={82} lengthAdjust="spacingAndGlyphs">
            fish 24 cm long
          </text>
        </g>
        <path className={cls("a", "move")} d="M152 75.5 H106" pathLength={100} stroke={C.bad} strokeWidth={2} fill="none" />
        <path className={cls("a", "mhead")} d="M113 70 L106 75.5 L113 81" stroke={C.bad} strokeWidth={2} fill="none" />
        <g className={cls("a", "stamp")}>
          <rect x={214} y={97} width={86} height={17} rx={4} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <T x={257} y={109} t="wrong column" color={C.bad} />
        </g>

        {/* units can swap the meaning: years before present */}
        <g className={cls("a", "mini")}>
          <rect x={16} y={116} width={168} height={16} rx={3} fill={C.fill} />
          <T x={38} y={128} t="Fossil" />
          <T x={122} y={128} t="Years before present" />
          <T x={38} y={144} t="X" w={600} />
          <T x={122} y={144} t="40" w={600} />
          <T x={38} y={160} t="Y" w={600} />
          <T x={122} y={160} t="90" w={600} />
          <path d="M16 148 H184 M16 164 H184" stroke={C.line} strokeWidth={1} fill="none" />
        </g>
        <g className={cls("a", "old")}>
          <rect x={61} y={149} width={122} height={15} rx={4} fill="none" stroke={C.primary} strokeWidth={2} />
        </g>
        <path className={cls("a", "rev")} d="M196 135 V160" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <g className={cls("a", "rhead")}>
          <path d="M191 154 L196 161 L201 154" stroke={C.primary} strokeWidth={2} fill="none" />
          <T x={206} y={146} t="bigger = older" color={C.primaryText} anchor="start" {...TS} />
          <T x={206} y={160} t="oldest" color={C.primaryText} anchor="start" {...TS} />
        </g>

        {/* the rule */}
        <g className={cls("a", "close")}>
          <T x={210} y={18} t="Labels first." color={C.primaryText} anchor="start" size={12} />
          <T x={210} y={32} t="Then numbers." color={C.primaryText} anchor="start" size={12} />
        </g>
      </g>
    </Svg>
  );
}
