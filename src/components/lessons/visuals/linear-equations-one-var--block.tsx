import { C, Css, Svg, Tex } from "./kit";

// Solve for the block: wrap the repeated group in a box, solve for the box, and never solve for x.
// Scene 1: 3(x - 4) + 2 = 20 -> the box is 6, so x - 4 = 6. Scene 2: 9E + 2 = 8E + 18 -> E = 16.
export const alt =
  "In 3(x − 4) + 2 = 20 the group x − 4 is wrapped in a box. Solving for the box gives 6, so x − 4 = 6 and x is never solved first. A second example: 9E + 2 = 8E + 18 gives E = 16.";

const P = "v-linear-equations-one-var--block-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const gone = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 1 } ${t + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
// scene B: hidden in the still frame, visible only between t0 and t1
const only = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 4}%, ${t1}% { opacity: 1 } ${t1 + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 95% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  // scene A fades out for scene B (its normal style is the final frame of A)
  r("sa", "0%, 47% { opacity: 1 } 51%, 100% { opacity: 0 }"),
  r("a1", "0%, 3% { opacity: 0 } 7%, 15% { opacity: 1 } 19%, 100% { opacity: 0 }", "opacity: 0;"),
  r("grp", "0%, 8% { opacity: 0 } 12%, 100% { opacity: 1 }"),
  pop("a2", 14),
  r("box", "0%, 14% { opacity: 0; transform: scale(0.4) } 20%, 100% { opacity: 1; transform: none }", "transform-box: fill-box; transform-origin: center;"),
  pop("strip", 20),
  pop("a3", 27),
  pop("a4", 34),
  r("lit", "0%, 38% { fill: " + C.soft + " } 42%, 100% { fill: " + C.good + " }"),
  r("six", "0%, 38% { opacity: 0 } 42%, 100% { opacity: 1 }"),
  gone("find", 42),
  pop("merge", 42),
  pop("side", 46),
  // scene B
  only("b1", 53, 93),
  only("m1", 61, 93),
  only("b2", 65, 93),
  only("m2", 73, 93),
  only("b3", 77, 93),
].join("\n");

const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { anchor?: "start" | "middle" | "end"; color?: string; size?: number; w?: number } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 24} anchor={o.anchor ?? "middle"} width={o.w ?? 90} color={o.color ?? C.ink}>
    {s}
  </Tex>
);

// Scene A: the main column is centred on x = 130.
const BX = 109 - 30;
const AY = [32, 70, 108];
// Scene B: a small box with the letter E.
const eBox = (x: number, y: number) => (
  <g>
    <rect x={x} y={y - 13} width={24} height={26} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
    <text x={x + 12} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText} {...lab}>
      E
    </text>
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("sa")}>
          {/* 1. the equation, its repeated group highlighted */}
          <g className={cls("a1")}>
            <g>{T(130, AY[0], String.raw`3(\phantom{x-4})+2=20`)}</g>
            <g className={cls("grp")}>{T(130, AY[0], String.raw`\phantom{3(}x-4\phantom{)+2=20}`, { color: C.primaryText })}</g>
          </g>

          {/* 2. the group becomes a block */}
          <g className={cls("a2")}>
            {T(BX - 4, AY[0], "3", { anchor: "end", w: 40 })}
            {T(BX + 40, AY[0], String.raw`+2=20`, { anchor: "start" })}
          </g>
          <g className={cls("box")}>
            <rect x={BX} y={AY[0] - 16} width={36} height={32} rx={8} fill={C.primary} />
            <text x={BX + 18} y={AY[0] + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary} {...lab}>
              block
            </text>
          </g>

          {/* 3. solve for the block */}
          <g className={cls("a3")}>
            {T(BX - 4, AY[1], "3", { anchor: "end", w: 40 })}
            {T(BX + 40, AY[1], String.raw`=18`, { anchor: "start" })}
            <rect x={BX} y={AY[1] - 16} width={36} height={32} rx={8} fill={C.primary} />
          </g>

          {/* 4. the block is 6 */}
          <g className={cls("a4")}>
            <rect className={cls("lit")} x={BX} y={AY[2] - 16} width={36} height={32} rx={8} fill={C.good} />
            {T(BX + 40, AY[2], String.raw`=6`, { anchor: "start", color: C.good })}
          </g>
          <text className={cls("six")} x={BX + 18} y={AY[2] + 7} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.bg} {...lab}>
            6
          </text>

          {/* the question strip: it asks for the block, so the answer is the block */}
          <rect x={BX - 20} y={130} width={150} height={30} rx={15} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <g className={cls("find")}>{T(BX + 55, 145, String.raw`\text{Find }x-4`, { size: 16, w: 140, color: C.ink })}</g>
          <g className={cls("merge")}>
            <rect x={BX - 20} y={130} width={150} height={30} rx={15} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
            {T(BX + 45, 145, String.raw`x-4=6`, { size: 17, w: 110, color: C.good })}
            <path d={`M ${BX + 98} 145 l 5 5 l 10 -11`} fill="none" stroke={C.good} strokeWidth={2.5} />
          </g>

          {/* the road not taken */}
          <g className={cls("side")} opacity={0.75}>
            <text x={262} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
              find x first
            </text>
            {T(262, 72, String.raw`x=10`, { size: 20, w: 70, color: C.muted })}
            <path d="M 236 72 L 288 72" stroke={C.muted} strokeWidth={2} />
            <text x={262} y={106} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
              extra steps
            </text>
          </g>
        </g>

        {/* Scene B: the same idea with a letter */}
        <g className={cls("b1")}>
          {T(84, 36, "9", { anchor: "end", size: 22, w: 24 })}
          {eBox(88, 36)}
          {T(116, 36, String.raw`+2`, { anchor: "start", size: 22, w: 40 })}
          {T(168, 36, "=", { size: 22, w: 24 })}
          {T(196, 36, "8", { anchor: "end", size: 22, w: 24 })}
          {eBox(200, 36)}
          {T(228, 36, String.raw`+18`, { anchor: "start", size: 22, w: 50 })}
        </g>
        <g className={cls("m1")}>
          <text x={160} y={76} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
            − 8 blocks
          </text>
        </g>
        <g className={cls("b2")}>
          {eBox(88, 100)}
          {T(116, 100, String.raw`+2`, { anchor: "start", size: 22, w: 40 })}
          {T(168, 100, "=", { size: 22, w: 24 })}
          {T(196, 100, "18", { anchor: "start", size: 22, w: 40 })}
        </g>
        <g className={cls("m2")}>
          <text x={160} y={136} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
            − 2
          </text>
        </g>
        <g className={cls("b3")}>
          <rect x={102} y={142} width={116} height={32} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          {T(160, 158, String.raw`E=16`, { size: 22, w: 100, color: C.good })}
        </g>
      </g>
    </Svg>
  );
}
