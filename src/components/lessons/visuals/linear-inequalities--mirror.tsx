import { C, Css, Svg } from "./kit";

// Multiplying by −1 mirrors the number line, so the order flips: 2 < 3 becomes −2 > −3.
export const alt =
  "On a number line, 2 is left of 3, so 2 < 3. Multiply both by −1: they swap sides of 0, 3 becomes −3 and 2 becomes −2, and now −2 > −3. A negative multiplier flips the sign.";

const P = "v-linear-inequalities--mirror-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-linear-inequalities--mirror-a { animation: 9s ease-in-out infinite; }
${[4, 14, 62, 76].map(fade).join("\n")}
.v-linear-inequalities--mirror-m2 { animation-name: v-linear-inequalities--mirror-m2; }
@keyframes v-linear-inequalities--mirror-m2 {
  0%, 30% { transform: translateX(128px); opacity: 0 }
  32% { transform: translateX(128px); opacity: 1 }
  56%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: none; opacity: 0 }
}
.v-linear-inequalities--mirror-m3 { animation-name: v-linear-inequalities--mirror-m3; }
@keyframes v-linear-inequalities--mirror-m3 {
  0%, 30% { transform: translateX(192px); opacity: 0 }
  32% { transform: translateX(192px); opacity: 1 }
  56%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: none; opacity: 0 }
}
.v-linear-inequalities--mirror-first { opacity: 0; animation-name: v-linear-inequalities--mirror-first; }
@keyframes v-linear-inequalities--mirror-first { 0%, 4% { opacity: 0 } 9%, 56% { opacity: 1 } 62%, 100% { opacity: 0 } }
`;
const a = `${P}a`;
const m2 = `${P}m2`;
const m3 = `${P}m3`;
const first = `${P}first`;

// Number line y = 104, 32 px per unit, 0 at x = 160. Dots for 2, 3 sit at x = 224, 256; mirrored dots (−2, −3) at 96, 64.
const X = (n: number) => 160 + 32 * n;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The number line */}
      <g className={`${a} ${fc(4)}`}>
        <line x1={X(-4.4)} y1={104} x2={X(4.4)} y2={104} stroke={C.muted} strokeWidth={2} />
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((n) => (
          <g key={n}>
            <line x1={X(n)} y1={99} x2={X(n)} y2={109} stroke={C.muted} strokeWidth={1.5} />
            <text x={X(n)} y={126} textAnchor="middle" fontSize={11} fill={C.muted}>
              {n < 0 ? `−${-n}` : n}
            </text>
          </g>
        ))}
        <line x1={X(0)} y1={58} x2={X(0)} y2={104} stroke={C.line} strokeWidth={1.5} strokeDasharray="4 4" />
      </g>

      {/* The originals stay as grey dots */}
      <g className={`${a} ${fc(14)}`}>
        <circle cx={X(2)} cy={88} r={7} fill={C.muted} />
        <circle cx={X(3)} cy={88} r={7} fill={C.muted} />
      </g>

      {/* Before: 2 < 3 (only while it plays) */}
      <g className={`${a} ${first}`}>
        <text x={160} y={38} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.ink}>
          2 &lt; 3
        </text>
      </g>

      {/* The dots swap sides of 0 */}
      <circle className={`${a} ${m2}`} cx={X(-2)} cy={88} r={7} fill={C.primary} />
      <circle className={`${a} ${m3}`} cx={X(-3)} cy={88} r={7} fill={C.primary} />

      {/* After: −2 > −3 */}
      <g className={`${a} ${fc(62)}`}>
        <text x={160} y={38} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.primary}>
          −2 &gt; −3
        </text>
        <text x={X(-2)} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
          −2
        </text>
        <text x={X(-3)} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
          −3
        </text>
      </g>
      <g className={`${a} ${fc(14)}`}>
        <text x={X(2)} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
          2
        </text>
        <text x={X(3)} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
          3
        </text>
      </g>
      <g className={`${a} ${fc(76)}`}>
        <text x={160} y={156} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
          × (−1) mirrors the line: flip the sign
        </text>
      </g>
    </Svg>
  );
}
