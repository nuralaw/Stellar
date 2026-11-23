import { C, Css, Svg, Tex } from "./kit";

// Elimination when nothing cancels yet: multiply one equation first so 4y and −4y cancel.
export const alt =
  "The system 3x + 2y = 13 and 5x − 4y = 7. Multiply the first equation by 2 to get 6x + 4y = 26. Now 4y and −4y cancel when you add: 11x = 33, so x = 3.";

const P = "v-systems-linear--multiply-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-systems-linear--multiply-a { animation: 9s ease-in-out infinite; }
${[4, 20, 30, 44, 56, 70].map(fade).join("\n")}
/* The 4y and −4y: dark when the rows appear, orange once they are about to cancel */
.v-systems-linear--multiply-inkhot { opacity: 0; animation-name: v-systems-linear--multiply-inkhot; }
@keyframes v-systems-linear--multiply-inkhot { 0%, 30% { opacity: 0 } 35%, 44% { opacity: 1 } 50%, 100% { opacity: 0 } }
.v-systems-linear--multiply-hot { animation-name: v-systems-linear--multiply-hot; }
@keyframes v-systems-linear--multiply-hot { 0%, 44% { opacity: 0 } 50%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }
`;

const SZ = 17;
const EM: Record<string, number> = { x: 0.578, y: 0.489, "+": 1.222, "-": 1.222, "=": 1.333 };
const wd = (s: string) => [...s].reduce((n, c) => n + (EM[c] ?? 0.5), 0) * SZ;
const RX = 170;

const tex = (x: number, y: number, s: string, color: string = C.ink, size = SZ) => (
  <Tex x={x} y={y} size={size} anchor="start" width={130} color={color}>
    {s}
  </Tex>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The system */}
      <g className={`${a} ${fc(4)}`}>
        {tex(16, 44, String.raw`3x+2y=13`)}
        {tex(16, 80, String.raw`5x-4y=7`)}
      </g>

      {/* Multiply the first by 2 */}
      <g className={`${a} ${fc(20)}`}>
        <path d="M122 44 H152 M146 39 L152 44 L146 49" fill="none" stroke={C.primary} strokeWidth={2} />
        <Tex x={137} y={28} size={14} color={C.primaryText} width={50}>
          {String.raw`\times 2`}
        </Tex>
      </g>
      <g className={`${a} ${fc(30)}`}>
        {tex(RX, 44, String.raw`6x+{}`)}
        {tex(RX + wd("6x+4y"), 44, String.raw`{}=26`)}
        {tex(RX, 80, String.raw`5x`)}
        {tex(RX + wd("5x-4y"), 80, String.raw`{}=7`)}
      </g>
      <g className={cls("inkhot")}>
        {tex(RX + wd("6x+"), 44, String.raw`4y`)}
        {tex(RX + wd("5x"), 80, String.raw`{}-4y`)}
      </g>
      <g className={cls("hot")}>
        {tex(RX + wd("6x+"), 44, String.raw`4y`, C.primaryText)}
        {tex(RX + wd("5x"), 80, String.raw`{}-4y`, C.primaryText)}
      </g>

      {/* Add them */}
      <g className={`${a} ${fc(44)}`}>
        <line x1={166} y1={96} x2={300} y2={96} stroke={C.muted} strokeWidth={1.5} />
        <text x={148} y={104} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.muted} stroke="none">
          +
        </text>
        {tex(RX, 118, String.raw`11x=33`, C.ink, 18)}
        <Tex x={20} y={120} size={13} anchor="start" color={C.muted} width={140}>
          {String.raw`4y\ \text{and}\ {-4y}\ \text{cancel}`}
        </Tex>
      </g>
      <g className={`${a} ${fc(70)}`}>
        <rect x={166} y={134} width={96} height={30} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <Tex x={214} y={149} size={19} color={C.good} width={90}>
          {String.raw`x=3`}
        </Tex>
      </g>
    </Svg>
  );
}
