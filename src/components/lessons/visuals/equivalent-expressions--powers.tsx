import { C, Css, Svg, Tex } from "./kit";

// Powers as blocks of x: multiplying adds blocks, dividing cancels pairs, (x²)³ is three groups of two. The last frame lists the rules.
export const alt =
  "Powers drawn as blocks of x: x³ times x² is five blocks, so exponents add. Dividing cancels pairs of blocks, so they subtract. x⁰ = 1. (x²)³ is six blocks. The rules are listed at the end.";

const P = "v-equivalent-expressions--powers-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const kf = (n: string, body: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${body} }`;
// Fades in at t0 (% of the loop); stays, or fades out at t1. Pieces that leave start hidden, so the still frame is the last panel.
const show = (n: string, t0: number, t1 = 100) =>
  t1 >= 100
    ? kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, 100% { opacity: 1 }`)
    : kf(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const draw = (n: string, t0: number) =>
  kf(n, `0%, ${t0}% { stroke-dashoffset: 100; opacity: 0 } ${t0 + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t0 + 6}%, 100% { stroke-dashoffset: 0; opacity: 1 }`, "stroke-dasharray: 100;");
const dim = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 1 } ${t + 3}%, 100% { opacity: 0.25 }`, "opacity: 0.25;");
const hl = (n: string, t: number) =>
  kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.ink} } ${t + 3}%, 100% { fill: ${C.soft}; stroke: ${C.primary} }`, `fill: ${C.soft}; stroke: ${C.primary};`);

// Panels (% of the 12 s loop): 3–15 add · 17–29 divide · 31–43 flip · 45–54 zero · 56–65 power of a power · 67– the rules.
const PANELS: [string, number, number][] = [["p1", 3, 15], ["p2", 17, 29], ["p3", 31, 43], ["p4", 45, 54], ["p5", 56, 65]];
const RULES = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  kf("scene", "0% { opacity: 0 } 3%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  ...PANELS.map(([n, t0, t1]) => show(n, t0, t1)),
  // 1: x² slides next to x³
  kf("slide", "0%, 8% { transform: translateX(28px) } 12%, 100% { transform: none }"),
  show("p1n", 11),
  show("p1b", 4),
  show("p1r", 11),
  // 2, 3, 4: the pairs get a stroke, then fade; what is left lights up
  ...[
    ["2", 17, 21, 24],
    ["3", 31, 35, 38],
    ["4", 45, 48, 51],
  ].flatMap(([k, t0, s, d]) => [draw(`s${k}`, +s), dim(`c${k}`, +d), hl(`h${k}`, +d), show(`b${k}`, +t0 + 1), show(`f${k}`, +s + 3)]),
  show("one", 51),
  show("m3", 40),
  // 5: three groups of two
  show("g5", 57),
  show("n5", 60),
  show("f5", 61),
  ...RULES.map((n, i) => show(n, 67 + i * 3)),
].join(" ");

/** One block of x. `c` dims it when it cancels, `h` lights it when it stays. */
function Blk({ x, y, s = 24, c = "", h = "" }: { x: number; y: number; s?: number; c?: string; h?: string }) {
  return (
    <g className={c ? cls(c) : undefined}>
      <rect className={h ? cls(h) : undefined} x={x} y={y} width={s} height={s} rx={4} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
      <text x={x + s / 2} y={y + s / 2 + 5} textAnchor="middle" fontSize={s > 20 ? 14 : 12} fontWeight={700} fill={C.ink} stroke="none">
        x
      </text>
    </g>
  );
}
const bx = (i: number) => 18 + i * 28;
const TOP = 46;
const BOT = 88;

/** A fraction of blocks: `top` over `bottom`, the first `pairs` columns cancel, `stay` says which side keeps the rest. */
function Fraction({ k, top, bottom, pairs }: { k: string; top: number; bottom: number; pairs: number }) {
  return (
    <g className={cls(`b${k}`)}>
      <line x1={16} y1={79} x2={bx(Math.max(top, bottom)) - 4} y2={79} stroke={C.muted} strokeWidth={1.5} />
      {Array.from({ length: top }, (_, i) => (
        <Blk key={`t${i}`} x={bx(i)} y={TOP} c={i < pairs ? `c${k}` : ""} h={i < pairs ? "" : `h${k}`} />
      ))}
      {Array.from({ length: bottom }, (_, i) => (
        <Blk key={`b${i}`} x={bx(i)} y={BOT} c={i < pairs ? `c${k}` : ""} h={i < pairs ? "" : `h${k}`} />
      ))}
      <g fill="none" stroke={C.primary} strokeWidth={2}>
        {Array.from({ length: pairs }, (_, i) => (
          <line key={i} className={cls(`s${k}`)} x1={bx(i) + 12} y1={TOP - 4} x2={bx(i) + 12} y2={BOT + 28} pathLength={100} />
        ))}
      </g>
    </g>
  );
}

const SZ = 18;
const RX = 170;
const W = 142;

export default function Visual() {
  const rule = (n: string, x: number, y: number, tex: string, color: string = C.ink) => (
    <g className={cls(n)}>
      <Tex x={x} y={y} size={15} anchor="start" width={150} color={color}>
        {tex}
      </Tex>
    </g>
  );
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 1: x³ · x² */}
        <g className={cls("p1")}>
          <g className={cls("p1b")}>
            {[0, 1, 2].map((i) => (
              <Blk key={i} x={bx(i)} y={68} />
            ))}
            <Tex x={bx(1) + 12} y={46} size={16} width={60}>{String.raw`x^3`}</Tex>
            <g className={cls("slide")}>
              {[0, 1].map((i) => (
                <rect key={i} x={bx(3 + i)} y={68} width={24} height={24} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
              ))}
              {[0, 1].map((i) => (
                <text key={i} x={bx(3 + i) + 12} y={85} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} stroke="none">
                  x
                </text>
              ))}
              <Tex x={bx(3) + 24 + 5} y={46} size={16} width={60}>{String.raw`x^2`}</Tex>
            </g>
          </g>
          <g className={cls("p1n")}>
            <text x={bx(2) + 28} y={118} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText} stroke="none">
              5 blocks
            </text>
          </g>
          <Tex x={RX} y={66} size={SZ} anchor="start" width={W + 8}>{String.raw`x^3\cdot x^2=x^{3+2}`}</Tex>
          <g className={cls("p1r")}>
            <Tex x={RX} y={100} size={SZ + 2} anchor="start" width={W} color={C.primaryText}>{String.raw`=x^5`}</Tex>
          </g>
        </g>

        {/* 2: x⁵ ÷ x² */}
        <g className={cls("p2")}>
          <Fraction k="2" top={5} bottom={2} pairs={2} />
          <g className={cls("f2")}>
            <Tex x={RX} y={66} size={SZ} anchor="start" width={W}>{String.raw`\dfrac{x^5}{x^2}`}</Tex>
            <Tex x={RX} y={108} size={SZ} anchor="start" width={W} color={C.primaryText}>{String.raw`=x^{5-2}=x^3`}</Tex>
          </g>
        </g>

        {/* 3: x² ÷ x⁵ */}
        <g className={cls("p3")}>
          <Fraction k="3" top={2} bottom={5} pairs={2} />
          <g className={cls("f3")}>
            <Tex x={RX} y={50} size={SZ} anchor="start" width={W}>{String.raw`\dfrac{x^2}{x^5}`}</Tex>
            <Tex x={RX} y={88} size={SZ} anchor="start" width={W} color={C.primaryText}>{String.raw`=x^{2-5}=x^{-3}`}</Tex>
            <Tex x={RX} y={122} size={SZ} anchor="start" width={W} color={C.primaryText}>{String.raw`=\dfrac{1}{x^3}`}</Tex>
          </g>
          <g className={cls("m3")}>
            <text x={bx(4) + 12} y={134} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
              stay below
            </text>
          </g>
        </g>

        {/* 4: x³ ÷ x³ */}
        <g className={cls("p4")}>
          <Fraction k="4" top={3} bottom={3} pairs={3} />
          <g className={cls("one")}>
            <circle cx={bx(1) + 12} cy={79} r={14} fill={C.bg} />
            <text x={bx(1) + 12} y={88} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.primaryText} stroke="none">
              1
            </text>
          </g>
          <g className={cls("f4")}>
            <Tex x={RX} y={66} size={SZ} anchor="start" width={W}>{String.raw`\dfrac{x^3}{x^3}`}</Tex>
            <Tex x={RX} y={108} size={SZ} anchor="start" width={W} color={C.primaryText}>{String.raw`=x^{3-3}=x^0=1`}</Tex>
          </g>
        </g>

        {/* 5: (x²)³ */}
        <g className={cls("p5")}>
          <g className={cls("g5")}>
            {[0, 1, 2].map((g) => (
              <g key={g}>
                <rect x={15 + g * 48} y={62} width={44} height={28} rx={6} fill="none" stroke={C.primary} strokeWidth={1.5} />
                {[0, 1].map((i) => (
                  <Blk key={i} x={18 + g * 48 + i * 20} y={67} s={18} />
                ))}
              </g>
            ))}
          </g>
          <g className={cls("n5")}>
            <Tex x={86} y={116} size={17} width={120} color={C.primaryText}>{String.raw`3\cdot2=6`}</Tex>
          </g>
          <Tex x={RX} y={66} size={SZ} anchor="start" width={W}>{String.raw`(x^2)^3`}</Tex>
          <g className={cls("f5")}>
            <Tex x={RX} y={104} size={SZ} anchor="start" width={W} color={C.primaryText}>{String.raw`=x^{2\cdot3}=x^6`}</Tex>
          </g>
        </g>

        {/* The rules */}
        {rule("r1", 16, 32, String.raw`x^a\cdot x^b=x^{a+b}`)}
        {rule("r2", 16, 72, String.raw`\dfrac{x^a}{x^b}=x^{a-b}`)}
        {rule("r3", 16, 110, String.raw`(x^a)^b=x^{ab}`)}
        {rule("r4", 170, 32, String.raw`x^0=1`)}
        {rule("r5", 170, 72, String.raw`x^{-n}=\dfrac{1}{x^n}`)}
        {rule("r6", 170, 110, String.raw`x^{m/n}=\sqrt[n]{x^m}`)}
        {rule("r7", 16, 148, String.raw`16^{3/4}=2^3=8`, C.primaryText)}
        {rule("r8", 170, 148, String.raw`x^2+x^3\ne x^5`, C.bad)}
      </g>
    </Svg>
  );
}
