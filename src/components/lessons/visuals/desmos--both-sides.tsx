import { C, Css, Svg, Tex } from "./kit";

// x² − 4 = 3x: graph each side as its own y; the x of each crossing is a solution (−1 and 4). Zoom out to see both.
export const alt =
  "x² − 4 = 3x is split into y = x² − 4 and y = 3x. Zooming out shows both crossings; their x-values, −1 and 4, are the solutions. A graph that lies exactly on top is equivalent.";

const P = "v-desmos--both-sides-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 10) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100 200;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("eq", 4),
  pop("rows1", 11),
  pop("rows2", 15),
  pop("shell", 14),
  draw("para", 20),
  draw("line", 28),
  r("zoom", "0%, 40% { transform: scale(1.9) } 52%, 100% { transform: scale(1) }", "transform-box: view-box; transform-origin: 273px 34.5px;"),
  pop("dot1", 34, 4),
  pop("dot2", 54, 4),
  r("zoomtag", "0%, 35% { opacity: 0 } 39%, 49% { opacity: 1 } 53%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("drop", 58, 6),
  pop("xlab", 62),
  pop("chips", 66),
  pop("ynote", 69),
  pop("strip", 74),
  r("slide", "0%, 80% { transform: translate(16px, 7px) } 88%, 100% { transform: none }", "transform-box: fill-box; transform-origin: center;"),
  r("turnB", "0%, 86% { stroke: var(--ink) } 91%, 100% { stroke: var(--success) }"),
  r("turnA", "0%, 86% { stroke: var(--muted) } 91%, 100% { stroke: var(--success) }"),
].join(" ");

// Graph window: x from −3 to 6, y from −7 to 17.
const RX = 150;
const RY = 12;
const RW = 158;
const RH = 108;
const px = (x: number) => f(RX + ((x + 3) * RW) / 9);
const py = (y: number) => f(RY + ((17 - y) * RH) / 24);
const para = Array.from({ length: 33 }, (_, i) => {
  const x = -3 + i * 0.25;
  return `${i ? "L" : "M"}${px(x)} ${py(x * x - 4)}`;
}).join(" ");
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the equation, split into two sides */}
        <g className={cls("eq")}>
          <Tex x={16} y={22} size={15} anchor="start" width={120}>{String.raw`x^2-4=3x`}</Tex>
        </g>
        <g className={cls("rows1")}>
          <path d="M16 34 V52 H22" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <line x1={24} y1={52} x2={38} y2={52} stroke={C.ink} strokeWidth={3} />
          <Tex x={44} y={52} size={14} anchor="start" width={66}>{String.raw`y=x^2-4`}</Tex>
          <text x={112} y={56} fontSize={11} fill={C.muted} {...lab}>left</text>
        </g>
        <g className={cls("rows2")}>
          <path d="M16 52 V76 H22" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <line x1={24} y1={76} x2={38} y2={76} stroke={C.primary} strokeWidth={3} />
          <Tex x={44} y={76} size={14} anchor="start" width={66}>{String.raw`y=3x`}</Tex>
          <text x={112} y={80} fontSize={11} fill={C.muted} {...lab}>right</text>
        </g>

        {/* the graph */}
        <clipPath id="v-desmos--both-sides-clip">
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} />
        </clipPath>
        <rect className={cls("shell")} x={RX} y={RY} width={RW} height={RH} rx={6} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
        <g clipPath="url(#v-desmos--both-sides-clip)">
          <g className={cls("zoom")}>
            <g className={cls("shell")} stroke={C.line} strokeWidth={1}>
              {[-2, 0, 2, 4].map((n) => (
                <line key={`x${n}`} x1={px(n)} y1={RY} x2={px(n)} y2={RY + RH} />
              ))}
              {[-4, 0, 4, 8, 12, 16].map((n) => (
                <line key={`y${n}`} x1={RX} y1={py(n)} x2={RX + RW} y2={py(n)} />
              ))}
            </g>
            <g className={cls("shell")} stroke={C.muted} strokeWidth={1.5}>
              <line x1={RX} y1={py(0)} x2={RX + RW} y2={py(0)} />
              <line x1={px(0)} y1={RY} x2={px(0)} y2={RY + RH} />
            </g>
            <path className={cls("para")} d={para} pathLength={100} fill="none" stroke={C.ink} strokeWidth={1.8} />
            <line className={cls("line")} x1={px(-2.5)} y1={py(-7.5)} x2={px(6)} y2={py(18)} pathLength={100} stroke={C.primary} strokeWidth={1.8} />
            <g className={cls("drop")} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3">
              <line x1={px(4)} y1={py(12)} x2={px(4)} y2={RY + RH} />
              <line x1={px(-1)} y1={py(0)} x2={px(-1)} y2={RY + RH} />
            </g>
            <circle className={cls("dot1")} cx={px(4)} cy={py(12)} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle className={cls("dot2")} cx={px(-1)} cy={py(-3)} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          </g>
        </g>
        <g className={cls("xlab")} {...lab}>
          <text x={px(4)} y={RY + RH + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>4</text>
          <text x={px(-1)} y={RY + RH + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>−1</text>
        </g>

        {/* solutions */}
        <g className={cls("chips")}>
          <rect x={16} y={98} width={58} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <rect x={80} y={98} width={58} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <Tex x={45} y={109} size={13} color={C.primaryText} width={58}>{String.raw`x=-1`}</Tex>
          <Tex x={109} y={109} size={13} color={C.primaryText} width={58}>{String.raw`x=4`}</Tex>
        </g>
        <text className={cls("zoomtag")} x={16} y={112} textAnchor="start" fontSize={11} fontWeight={600} fill={C.primaryText} {...lab}>zoom out before you count</text>
        <text className={cls("ynote")} x={16} y={138} fontSize={11} fill={C.muted} {...lab}>y-values: not the answer</text>

        {/* equivalent expressions: the graph that sits exactly on top */}
        <g className={cls("strip")}>
          <rect x={16} y={146} width={288} height={26} rx={8} fill={C.fill} />
          <path className={cls("turnA")} d="M26 153 Q46 177 66 153" fill="none" stroke={C.good} strokeWidth={3} />
          <g className={cls("slide")}>
            <path className={cls("turnB")} d="M26 153 Q46 177 66 153" fill="none" stroke={C.good} strokeWidth={2} />
          </g>
          <text x={80} y={163} fontSize={12} fontWeight={600} fill={C.ink} {...lab}>equivalent = exactly on top</text>
        </g>
      </g>
    </Svg>
  );
}
