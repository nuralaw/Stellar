import { C, Css, Svg, Tex } from "./kit";

// A parallelogram is a rectangle in disguise (A = bh); a trapezoid is half of a parallelogram made of two copies.
// Part 1: b = 14, h = 6, slanted side 9 (11 px per unit). Part 2: b1 = 7, b2 = 13, h = 5 (12 px per unit).
export const alt =
  "A parallelogram 14 by 6 becomes a rectangle by moving a triangle: A = bh. A trapezoid with bases 7 and 13 and height 5, doubled, fills a parallelogram: A = 1/2 (7 + 13) · 5 = 50.";

const P = "v-area-volume--trapezoid-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  win("A", 3, 42),
  pop("hA", 9),
  pop("slant", 14),
  win("ghost", 3, 17),
  r("tri", "0%, 20% { transform: translate(0, 0) } 24% { transform: translate(0, -12px) } 32% { transform: translate(154px, -12px) } 36%, 100% { transform: translate(154px, 0) }", "transform: translate(154px, 0);"),
  pop("rect", 36),
  pop("fA", 38),
  pop("B", 45),
  pop("b1", 48),
  win("b2", 50, 70),
  pop("hB", 53),
  r("copy", "0%, 56% { opacity: 0; transform: rotate(0deg) } 59% { opacity: 1; transform: rotate(0deg) } 70%, 100% { opacity: 1; transform: rotate(180deg) }", "transform-box: view-box; transform-origin: 160px 70px; transform: rotate(180deg);"),
  pop("bsum", 72),
  pop("half", 78),
  pop("fB", 82),
].join(" ");

const lab = { stroke: "none" } as const;
const T = { fill: C.fill, stroke: C.ink, strokeWidth: 2 } as const;
// Part 1 (parallelogram): base 154 wide, height 66, slanted by 74.
const pa = { x: 44, y: 122, w: 154, h: 66, s: 74 };
const para = `${pa.x},${pa.y} ${pa.x + pa.w},${pa.y} ${pa.x + pa.w + pa.s},${pa.y - pa.h} ${pa.x + pa.s},${pa.y - pa.h}`;
// Part 2 (trapezoid): bottom 156, top 84, height 60.
const trap = "22,100 178,100 142,40 58,40";

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Part 1: the parallelogram becomes a rectangle */}
        <g className={cls("A")}>
          <text x={160} y={26} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
            height: straight across, at a right angle
          </text>
          <polygon className={cls("ghost")} points={para} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
          {/* what stays: a trapezoid with a straight left side */}
          <polygon points={`${pa.x + pa.s},${pa.y} ${pa.x + pa.w},${pa.y} ${pa.x + pa.w + pa.s},${pa.y - pa.h} ${pa.x + pa.s},${pa.y - pa.h}`} fill={C.fill} />
          {/* the triangle that moves from the left end to the right end */}
          <polygon className={cls("tri")} points={`${pa.x},${pa.y} ${pa.x + pa.s},${pa.y} ${pa.x + pa.s},${pa.y - pa.h}`} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <g stroke={C.ink} strokeWidth={2} fill="none">
            <line x1={pa.x} y1={pa.y} x2={pa.x + pa.w} y2={pa.y} />
            <line x1={pa.x + pa.s} y1={pa.y - pa.h} x2={pa.x + pa.w + pa.s} y2={pa.y - pa.h} />
          </g>
          <g className={cls("slant")}>
            <line x1={pa.x} y1={pa.y} x2={pa.x + pa.s} y2={pa.y - pa.h} stroke={C.muted} strokeWidth={3} />
            <text x={66} y={80} textAnchor="end" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>not the</text>
            <text x={66} y={94} textAnchor="end" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>height</text>
          </g>
          <line x1={pa.x + pa.w} y1={pa.y} x2={pa.x + pa.w + pa.s} y2={pa.y - pa.h} stroke={C.muted} strokeWidth={2} />
          <g className={cls("hA")}>
            <line x1={pa.x + pa.s} y1={pa.y - pa.h} x2={pa.x + pa.s} y2={pa.y} stroke={C.primary} strokeWidth={2.5} strokeDasharray="5 4" />
            <path d={`M${pa.x + pa.s} ${pa.y - 8} H${pa.x + pa.s + 8} V${pa.y}`} fill="none" stroke={C.primary} strokeWidth={1.5} />
            <Tex x={pa.x + pa.s + 14} y={88} size={13} anchor="start" width={44} color={C.primaryText}>{String.raw`h=6`}</Tex>
          </g>
          <Tex x={pa.x + pa.w / 2} y={138} size={14} width={80}>{String.raw`b=14`}</Tex>
          <rect className={cls("rect")} x={pa.x + pa.s} y={pa.y - pa.h} width={pa.w} height={pa.h} fill="none" stroke={C.ink} strokeWidth={2.5} />
          <g className={cls("fA")}>
            <Tex x={160} y={158} size={17} width={90} color={C.primaryText}>{String.raw`A=bh`}</Tex>
          </g>
        </g>

        {/* Part 2: a trapezoid is half of a parallelogram */}
        <g className={cls("B")}>
          <polygon className={cls("copy")} points={trap} {...T} />
          <polygon points={trap} {...T} />
          <polygon className={cls("half")} points={trap} fill={C.soft} stroke={C.ink} strokeWidth={2} />
          <g className={cls("half")} stroke={C.primary} strokeWidth={4}>
            <line x1={58} y1={40} x2={142} y2={40} />
            <line x1={22} y1={100} x2={178} y2={100} />
          </g>
          <g className={cls("hB")}>
            <line x1={58} y1={40} x2={58} y2={100} stroke={C.ink} strokeWidth={2} strokeDasharray="5 4" />
            <path d="M58 92 H66 V100" fill="none" stroke={C.ink} strokeWidth={1.5} />
            <Tex x={72} y={70} size={13} anchor="start" width={44}>{String.raw`h=5`}</Tex>
          </g>
          <g className={cls("b1")}>
            <Tex x={100} y={26} size={14} width={70} color={C.primaryText}>{String.raw`b_1=7`}</Tex>
          </g>
          <g className={cls("b2")}>
            <Tex x={100} y={116} size={14} width={80} color={C.primaryText}>{String.raw`b_2=13`}</Tex>
          </g>
          <g className={cls("bsum")}>
            <Tex x={142} y={116} size={14} width={140} color={C.primaryText}>{String.raw`b_1+b_2=20`}</Tex>
          </g>
          <g className={cls("fB")}>
            <Tex x={160} y={144} size={16} width={310}>{String.raw`A=\dfrac{1}{2}(b_1+b_2)h=\dfrac{1}{2}(20)(5)=50`}</Tex>
          </g>
        </g>
      </g>
    </Svg>
  );
}
