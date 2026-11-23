import { C, Css, Svg, Tex } from "./kit";

// h(t) = −5t² + 30t + 4, retyped as y = …: the vertex (3, 49) gives the maximum value (y) and when it happens (x).
export const alt =
  "The parabola h(t) = −5t² + 30t + 4 is retyped with x and y. Its top, (3, 49): y = 49 is the maximum value, x = 3 is when it happens. Each question picks one of them.";

const P = "v-desmos--turning-point-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 8) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100 200;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("formula", 4),
  pop("shell", 6),
  pop("chip", 11),
  r("old", "0%, 16% { opacity: 1 } 21%, 100% { opacity: 0 }", "opacity: 0;"),
  r("new", "0%, 16% { opacity: 0 } 21%, 100% { opacity: 1 }"),
  draw("curve", 12, 14),
  r("dot", "0%, 28% { transform: scale(0) } 32% { transform: scale(1.5) } 36%, 100% { transform: scale(1) }", "transform-box: fill-box; transform-origin: center;"),
  pop("tip", 32),
  draw("yarrow", 38),
  pop("ylab", 44),
  pop("yhead", 43, 3),
  pop("xhead", 51, 3),
  draw("xarrow", 46),
  pop("xlab", 52),
  pop("chips", 54, 4),
  r("yfocus", "0%, 66% { opacity: 1 } 70%, 82% { opacity: 0.2 } 87%, 100% { opacity: 1 }"),
  r("xfocus", "0%, 58% { opacity: 1 } 62%, 64% { opacity: 0.2 } 68%, 74% { opacity: 1 } 78%, 82% { opacity: 0.2 } 87%, 100% { opacity: 1 }"),
  r("hi1", "0%, 66% { opacity: 1 } 68%, 84% { opacity: 0 } 88%, 100% { opacity: 1 }"),
  r("hi2", "0%, 66% { opacity: 0 } 69%, 74% { opacity: 1 } 77%, 100% { opacity: 0 }", "opacity: 0;"),
  r("hi3", "0%, 74% { opacity: 0 } 77%, 82% { opacity: 1 } 85%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("zeros", 77, 4),
].join(" ");

// Graph window: x from −4 to 7, y from −10 to 60.
const RX = 30;
const RY = 34;
const RW = 170;
const RH = 128;
const px = (x: number) => f(RX + ((x + 4) * RW) / 11);
const py = (y: number) => f(RY + ((60 - y) * RH) / 70);
const curve = Array.from({ length: 40 }, (_, i) => {
  const x = -0.9 + i * 0.2;
  return `${i ? "L" : "M"}${px(x)} ${py(-5 * x * x + 30 * x + 4)}`;
}).join(" ");
const z1 = (30 - Math.sqrt(980)) / 10; // zeros of −5x² + 30x + 4
const z2 = (30 + Math.sqrt(980)) / 10;
const V = { x: px(3), y: py(49) };
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("formula")}>
          <Tex x={16} y={14} size={13} anchor="start" width={140}>{String.raw`h(t)=-5t^2+30t+4`}</Tex>
        </g>
        <g className={cls("chip")}>
          <rect x={212} y={3} width={92} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <Tex x={258} y={14} size={12} width={84}>{String.raw`t\to x,\ h\to y`}</Tex>
        </g>

        {/* the graph */}
        <clipPath id="v-desmos--turning-point-clip">
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} />
        </clipPath>
        <g className={cls("shell")}>
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
          <g stroke={C.muted} strokeWidth={1.5}>
            <line x1={RX} y1={py(0)} x2={RX + RW} y2={py(0)} />
            <line x1={px(0)} y1={RY} x2={px(0)} y2={RY + RH} />
          </g>
          <g {...lab} fontSize={11} fontWeight={600} fill={C.muted}>
            <text className={cls("old")} x={px(7) - 6} y={py(0) + 17}>t</text>
            <text className={cls("old")} x={px(0) + 8} y={RY + 12}>h</text>
            <text className={cls("new")} x={px(7) - 6} y={py(0) + 17}>x</text>
            <text className={cls("new")} x={px(0) + 8} y={RY + 12}>y</text>
          </g>
        </g>
        <g clipPath="url(#v-desmos--turning-point-clip)">
          <path className={cls("curve")} d={curve} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        </g>

        {/* the two readings of the top point */}
        <g className={cls("yfocus")}>
          <line className={cls("yarrow")} x1={V.x - 8} y1={V.y} x2={RX + 10} y2={V.y} pathLength={100} stroke={C.primary} strokeWidth={2} />
          <path className={cls("yhead")} d={`M${RX + 17} ${V.y - 5} L${RX + 10} ${V.y} L${RX + 17} ${V.y + 5}`} fill="none" stroke={C.primary} strokeWidth={2} />
          <g className={cls("ylab")}>
            <Tex x={RX + 6} y={V.y - 12} size={13} anchor="start" color={C.primaryText} width={44}>{String.raw`y=49`}</Tex>
            <text x={RX + 6} y={V.y + 17} fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>max value</text>
          </g>
        </g>
        <g className={cls("xfocus")}>
          <line className={cls("xarrow")} x1={V.x} y1={V.y + 8} x2={V.x} y2={py(0) - 8} pathLength={100} stroke={C.ink} strokeWidth={2} />
          <path className={cls("xhead")} d={`M${V.x - 5} ${py(0) - 15} L${V.x} ${py(0) - 8} L${V.x + 5} ${py(0) - 15}`} fill="none" stroke={C.ink} strokeWidth={2} />
          <g className={cls("xlab")}>
            <Tex x={V.x} y={py(0) + 12} size={12} width={40}>{String.raw`x=3`}</Tex>
            <text x={V.x - 24} y={py(0) + 16} textAnchor="end" fontSize={11} fill={C.muted} {...lab}>when</text>
          </g>
        </g>

        <circle className={cls("dot")} cx={V.x} cy={V.y} r={6} fill={C.primary} stroke={C.bg} strokeWidth={2} />
        <g className={cls("tip")}>
          <rect x={V.x + 8} y={V.y - 14} width={54} height={22} rx={6} fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
          <text x={V.x + 35} y={V.y + 1} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(3, 49)</text>
        </g>
        <g className={cls("zeros")}>
          <circle cx={px(z1)} cy={py(0)} r={4.5} fill={C.bg} stroke={C.ink} strokeWidth={2} />
          <circle cx={px(z2)} cy={py(0)} r={4.5} fill={C.bg} stroke={C.ink} strokeWidth={2} />
        </g>

        {/* the questions */}
        <g className={cls("chips")}>
          {[
            { y: 50, text: "max height?", hi: "hi1" },
            { y: 90, text: "what time?", hi: "hi2" },
            { y: 130, text: "zeros?", hi: "hi3" },
          ].map((c) => (
            <g key={c.hi}>
              <rect x={212} y={c.y} width={92} height={26} rx={13} fill={C.fill} />
              <rect className={cls(c.hi)} x={212} y={c.y} width={92} height={26} rx={13} fill={C.soft} stroke={C.primary} strokeWidth={2} />
              <text x={258} y={c.y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>{c.text}</text>
            </g>
          ))}
        </g>
      </g>
    </Svg>
  );
}
