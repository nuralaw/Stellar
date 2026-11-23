import { C, Css, Svg, Tex } from "./kit";

// A table of points, a model typed with ~ instead of =, and Desmos finds the constants: y = 3x + 4 through (1,7), (3,13), (4,16).
export const alt =
  "Points (1, 7), (3, 13) and (4, 16) go into a table with columns x1 and y1. The model y1 ~ m x1 + b, typed with a tilde, makes Desmos find m = 3 and b = 4, so the line passes through every point.";

const P = "v-desmos--regression-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 10) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100 200;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("table", 4),
  pop("row1", 7),
  pop("row2", 10),
  pop("row3", 13),
  pop("shell", 5),
  pop("dot1", 8, 4),
  pop("dot2", 11, 4),
  pop("dot3", 14, 4),
  r("type", "0%, 20% { transform: scaleX(1) } 34%, 100% { transform: scaleX(0) }", "transform-box: fill-box; transform-origin: right center; transform: scaleX(0);"),
  pop("model", 19, 2),
  pop("tag", 35),
  pop("wrong", 41),
  draw("strike", 45, 5),
  draw("line", 50, 10),
  r("dotfit", "0%, 58% { fill: var(--ink) } 64%, 100% { fill: var(--success) }"),
  pop("consts", 60),
  pop("eq", 66),
  pop("c1", 74),
  pop("c2", 77),
  pop("c3", 80),
].join(" ");

// Graph window: x from 0 to 5, y from 0 to 20.
const RX = 140;
const RY = 14;
const RW = 164;
const RH = 92;
const px = (x: number) => f(RX + (x * RW) / 5);
const py = (y: number) => f(RY + RH - (y * RH) / 20);
const pts: [number, number][] = [
  [1, 7],
  [3, 13],
  [4, 16],
];
const lab = { stroke: "none" } as const;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const mono = { fontFamily: MONO, fontWeight: 700 as const, ...lab };

const cards = [
  { n: "c1", name: "line", pts: "2 points", path: "M0 13 L36 1", dots: [[7.2, 10.6], [28.8, 3.4]] },
  { n: "c2", name: "exp", pts: "2 points", path: "M0 13 Q24 13 36 1", dots: [[11.3, 12.3], [33.5, 3.3]] },
  { n: "c3", name: "quad", pts: "3 points", path: "M0 2 Q18 24 36 2", dots: [[0, 2], [18, 13], [36, 2]] },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the table: columns x1 and y1 */}
        <g className={cls("table")}>
          <rect x={16} y={14} width={84} height={72} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <line x1={58} y1={14} x2={58} y2={86} stroke={C.line} strokeWidth={1.5} />
          <line x1={16} y1={32} x2={100} y2={32} stroke={C.line} strokeWidth={1.5} />
          <text x={37} y={27} textAnchor="middle" fontSize={12} fill={C.ink} {...mono}>x1</text>
          <text x={79} y={27} textAnchor="middle" fontSize={12} fill={C.ink} {...mono}>y1</text>
        </g>
        {pts.map(([x, y], i) => (
          <g key={x} className={cls(`row${i + 1}`)} {...lab} fontSize={13} fontWeight={700} fill={C.ink}>
            <text x={37} y={47 + i * 18} textAnchor="middle">{x}</text>
            <text x={79} y={47 + i * 18} textAnchor="middle">{y}</text>
          </g>
        ))}

        {/* the model, typed with a tilde */}
        <g className={cls("model")}>
          <text x={16} y={108} fontSize={13} fill={C.ink} {...mono}>
            y1 <tspan fill={C.primary} fontSize={16}>~</tspan> m x1 + b
          </text>
        </g>
        <rect className={cls("type")} x={14} y={94} width={112} height={20} fill={C.bg} />
        <text className={cls("tag")} x={16} y={124} fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>~ finds the constants</text>
        <g className={cls("wrong")}>
          <text x={16} y={143} fontSize={13} fill={C.muted} {...mono}>y1 = m x1 + b</text>
          <line className={cls("strike")} x1={14} y1={147} x2={104} y2={139} pathLength={100} stroke={C.bad} strokeWidth={2} />
          <text x={16} y={157} fontSize={11} fill={C.muted} {...lab}>= needs numbers</text>
        </g>

        {/* the graph */}
        <g className={cls("shell")}>
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
        </g>
        <line className={cls("line")} x1={px(0)} y1={py(4)} x2={px(5)} y2={py(19)} pathLength={100} stroke={C.primary} strokeWidth={2} />
        {pts.map(([x, y], i) => (
          <g key={x} className={cls(`dot${i + 1}`)}>
            <circle className={cls("dotfit")} cx={px(x)} cy={py(y)} r={5.5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
          </g>
        ))}
        <g className={cls("eq")}>
          <Tex x={RX + 8} y={RY + 16} size={16} anchor="start" color={C.primaryText} width={90}>{String.raw`y=3x+4`}</Tex>
        </g>
        <g className={cls("consts")}>
          <rect x={RX + 68} y={RY + RH - 30} width={90} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <Tex x={RX + 113} y={RY + RH - 18} size={13} width={88}>{String.raw`m=3,\ b=4`}</Tex>
        </g>

        {/* what each model needs */}
        {cards.map((c, i) => (
          <g key={c.n} className={cls(c.n)}>
            <rect x={RX + i * 56} y={118} width={52} height={46} rx={8} fill={C.fill} />
            <g transform={`translate(${RX + i * 56 + 8} ${123})`} fill="none" strokeWidth={2}>
              <path d={c.path} stroke={C.ink} />
              {c.dots.map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill={C.primary} stroke="none" />
              ))}
            </g>
            <text x={RX + i * 56 + 26} y={152} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>{c.name}</text>
            <text x={RX + i * 56 + 26} y={162} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>{c.pts}</text>
          </g>
        ))}
      </g>
    </Svg>
  );
}
