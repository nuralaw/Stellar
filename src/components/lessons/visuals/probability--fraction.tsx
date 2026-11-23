import { C, Css, Svg, Tex } from "./kit";

// A jar of 20 marbles (5 red, 7 green, 8 blue): fit over all gives 7/20; "not green" is the rest, 13/20.
export const alt =
  "A jar of 20 marbles, 7 of them green. Fit over all gives P(green) = 7/20 = 0.35 on a line from impossible (0) to certain (1). Not green is the rest: 1 - 7/20 = 13/20 = 0.65.";

const P = "v-probability--fraction-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 }`);
// Visible from t0 to t1 only; hidden in the still frame.
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 4}%, ${t1}% { opacity: 1 } ${t1 + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("count", 8),
  pop("ring", 14),
  // Beat 2: the green dots stand out; beat 4: the rest do.
  r("ng", "0%, 13% { opacity: 1 } 17%, 55% { opacity: .22 } 59%, 100% { opacity: 1 }"),
  r("g", "0%, 59% { opacity: 1 } 63%, 86% { opacity: .22 } 90%, 100% { opacity: 1 }"),
  win("fit7", 15, 55),
  win("fit13", 61, 86),
  pop("f1", 12),
  pop("f2", 22),
  pop("line", 42),
  pop("m1", 47),
  pop("f3", 64),
  pop("m2", 70),
].join(" ");

const RED = 5;
const GREEN = 7;
// 20 dots, 5 per row: 5 red, then 7 green, then 8 blue.
const DOTS = Array.from({ length: 20 }, (_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const kind: keyof typeof FILL = i < RED ? "red" : i < RED + GREEN ? "green" : "blue";
  return { x: 33 + col * 21, y: 56 + row * 21, kind };
});
const FILL = { red: C.bad, green: C.good, blue: C.muted } as const;
const lab = { stroke: "none" } as const;

// A number line from 0 (x = 152) to 1 (x = 296): 144 wide, so 0.35 sits at 202.4 and 0.65 at 245.6.
const X0 = 152;
const LEN = 144;
const LY = 145;
const at = (p: number) => X0 + p * LEN;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* The jar and its marbles */}
        <rect x={18} y={40} width={114} height={96} rx={14} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <rect className={cls("ring")} x={18} y={40} width={114} height={96} rx={14} fill="none" stroke={C.primary} strokeWidth={2.5} />
        {DOTS.map((d, i) => (
          <circle key={i} className={d.kind === "green" ? cls("g") : cls("ng")} cx={d.x} cy={d.y} r={7} fill={FILL[d.kind]} />
        ))}
        <text className={cls("count")} x={75} y={154} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          20 marbles
        </text>
        <text className={cls("fit7")} x={75} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
          fit: 7
        </text>
        <text className={cls("fit13")} x={75} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
          fit: 13
        </text>

        {/* The rule, then the two fractions */}
        <g className={cls("f1")}>
          <Tex x={226} y={28} size={17} width={150} color={C.muted}>{String.raw`P=\frac{\text{fit}}{\text{all}}`}</Tex>
        </g>
        <g className={cls("f2")}>
          <Tex x={226} y={67} size={21} width={150}>{String.raw`P(\text{green})=\frac{7}{20}`}</Tex>
        </g>
        <g className={cls("f3")}>
          <Tex x={226} y={104} size={17} width={150} color={C.primaryText}>{String.raw`1-\frac{7}{20}=\frac{13}{20}`}</Tex>
        </g>

        {/* The number line: impossible to certain */}
        <g className={cls("line")} {...lab}>
          <line x1={X0} y1={LY} x2={X0 + LEN} y2={LY} stroke={C.ink} strokeWidth={2} />
          <line x1={X0} y1={LY - 5} x2={X0} y2={LY + 5} stroke={C.ink} strokeWidth={2} />
          <line x1={X0 + LEN} y1={LY - 5} x2={X0 + LEN} y2={LY + 5} stroke={C.ink} strokeWidth={2} />
          <text x={X0 - 4} y={LY + 18} fontSize={11} fill={C.muted}>0 impossible</text>
          <text x={X0 + LEN + 4} y={LY + 18} textAnchor="end" fontSize={11} fill={C.muted}>certain 1</text>
        </g>
        <g className={cls("m1")} {...lab}>
          <circle cx={at(0.35)} cy={LY} r={5.5} fill={C.good} />
          <text x={at(0.35)} y={LY - 11} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>0.35</text>
        </g>
        <g className={cls("m2")} {...lab}>
          <circle cx={at(0.65)} cy={LY} r={5.5} fill={C.primary} />
          <text x={at(0.65)} y={LY - 11} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>0.65</text>
        </g>
      </g>
    </Svg>
  );
}
