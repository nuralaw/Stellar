import { C, Css, Svg, Tex } from "./kit";

// Solve for a letter: undo the operations around it one at a time, on the whole side. P = 2L + 2W gives W; c = 3 + 12/m gives m.
export const alt =
  "Solving for a letter works like solving an equation: P = 2L + 2W becomes W = (P − 2L)/2, and c = 3 + 12/m becomes m = 12/(c − 3). Each step is done to both sides, the whole side at a time.";

const P = "v-equivalent-expressions--formula-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const pulse = (n: string, t: number) =>
  kf(n, `0%, ${t}% { opacity: 0; transform: none } ${t + 3}% { opacity: 1; transform: scale(1.06) } ${t + 8}% { opacity: 1; transform: none } ${t + 14}%, 100% { opacity: 0 }`, "opacity: 0; transform-box: fill-box; transform-origin: center;");

// Top formula (% of the 12 s loop): 3–15 P = 2L + 2W · 15–26 minus 2L · 26–36 divide by 2 · 36– done.
// Bottom formula: 44–54 · 54–64 · 64–74 · 74– done.
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("a1", 3, 15),
  show("n1", 4, 15),
  show("a2", 15, 26),
  show("n2", 16, 26),
  show("a3", 26, 36),
  show("n3", 27, 36),
  pulse("br", 29),
  show("trap", 31, 36),
  show("a4", 36),
  show("d1", 3),
  show("b1", 44, 54),
  show("m1", 45, 54),
  show("b2", 54, 64),
  show("m2", 55, 64),
  show("b3", 64, 74),
  show("m3", 65, 74),
  show("b4", 74),
  show("m4", 75),
].join(" ");

const TY = 38;
const BY = 122;

export default function Visual() {
  const note = (n: string, y: number, text: string, x = 160) => (
    <g className={cls(n)}>
      <text x={x} y={y} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
        {text}
      </text>
    </g>
  );
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <line className={cls("d1")} x1={40} y1={91} x2={280} y2={91} stroke={C.line} strokeWidth={1.5} />

        {/* Top: P = 2L + 2W, W alone at the end */}
        <g className={cls("a1")}>
          <Tex x={194} y={TY} size={22} anchor="end" width={150}>{String.raw`P=2L+2`}</Tex>
          <Tex x={196} y={TY} size={22} anchor="start" width={40} color={C.primaryText}>{String.raw`W`}</Tex>
        </g>
        <g className={cls("a2")}>
          <Tex x={194} y={TY} size={22} anchor="end" width={150}>{String.raw`P-2L=2`}</Tex>
          <Tex x={196} y={TY} size={22} anchor="start" width={40} color={C.primaryText}>{String.raw`W`}</Tex>
        </g>
        <g className={cls("a3")}>
          <Tex x={204} y={TY} size={22} anchor="end" width={170}>{String.raw`\dfrac{P-2L}{2}=`}</Tex>
          <Tex x={206} y={TY} size={22} anchor="start" width={40} color={C.primaryText}>{String.raw`W`}</Tex>
          <rect className={cls("br")} x={106} y={12} width={70} height={54} rx={9} fill="none" stroke={C.primary} strokeWidth={2} />
          <g className={cls("trap")}>
            <Tex x={270} y={TY} size={15} width={80} color={C.bad}>{String.raw`P-\dfrac{2L}{2}`}</Tex>
            <line x1={236} y1={TY + 15} x2={304} y2={TY - 15} stroke={C.bad} strokeWidth={2.5} />
          </g>
        </g>
        <g className={cls("a4")}>
          <Tex x={120} y={TY} size={22} anchor="end" width={40} color={C.primaryText}>{String.raw`W`}</Tex>
          <Tex x={116} y={TY} size={22} anchor="start" width={170}>{String.raw`=\dfrac{P-2L}{2}`}</Tex>
        </g>
        {note("n1", 78, "W is × 2, then + 2L")}
        {note("n2", 78, "− 2L on both sides")}
        {note("n3", 78, "÷ 2 on the whole side")}

        {/* Bottom: c = 3 + 12/m, m alone at the end */}
        <g className={cls("b1")}>
          <Tex x={160} y={BY} size={20} width={170}>{String.raw`c=3+\dfrac{12}{m}`}</Tex>
        </g>
        <g className={cls("b2")}>
          <Tex x={160} y={BY} size={20} width={170}>{String.raw`c-3=\dfrac{12}{m}`}</Tex>
        </g>
        <g className={cls("b3")}>
          <Tex x={160} y={BY} size={20} width={170}>{String.raw`m(c-3)=12`}</Tex>
        </g>
        <g className={cls("b4")}>
          <Tex x={130} y={BY} size={20} anchor="end" width={40} color={C.primaryText}>{String.raw`m`}</Tex>
          <Tex x={126} y={BY} size={20} anchor="start" width={140}>{String.raw`=\dfrac{12}{c-3}`}</Tex>
        </g>
        {note("m1", 160, "get the letter alone")}
        {note("m2", 160, "− 3 on both sides")}
        {note("m3", 160, "× m on both sides")}
        {note("m4", 160, "÷ (c − 3)")}
      </g>
    </Svg>
  );
}
