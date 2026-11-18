import { C, Css, Svg } from "./kit";

// Rational exponents: the bottom of the fraction is the root, the top is the power. 8^(2/3) = (∛8)² = 4.
export const alt =
  "The exponent 2/3 on 8 means two things. The bottom number 3 is a cube root: the cube root of 8 is 2. The top number 2 is a power: 2 squared is 4. So 8^(2/3) = 4.";

const P = "v-equivalent-expressions--exponents-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-equivalent-expressions--exponents-a { animation: 9s ease-in-out infinite; }
${[4, 20, 44, 66].map(fade).join("\n")}
.v-equivalent-expressions--exponents-den { fill: ${C.ink}; animation-name: v-equivalent-expressions--exponents-den; }
@keyframes v-equivalent-expressions--exponents-den { 0%, 18% { fill: ${C.ink} } 24%, 40% { fill: ${C.primary} } 46%, 100% { fill: ${C.ink} } }
.v-equivalent-expressions--exponents-num { fill: ${C.ink}; animation-name: v-equivalent-expressions--exponents-num; }
@keyframes v-equivalent-expressions--exponents-num { 0%, 42% { fill: ${C.ink} } 48%, 62% { fill: ${C.primary} } 68%, 100% { fill: ${C.ink} } }
`;
const a = `${P}a`;
const den = `${P}den`;
const num = `${P}num`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* 8^(2/3) = 4 */}
      <g className={`${a} ${fc(4)}`}>
        <text x={118} y={64} textAnchor="middle" fontSize={40} fontWeight={700} fill={C.ink}>
          8
        </text>
        <text className={`${a} ${num}`} x={144} y={34} textAnchor="middle" fontSize={14} fontWeight={700}>
          2
        </text>
        <line x1={137} y1={38} x2={151} y2={38} stroke={C.ink} strokeWidth={1.5} />
        <text className={`${a} ${den}`} x={144} y={52} textAnchor="middle" fontSize={14} fontWeight={700}>
          3
        </text>
      </g>
      <g className={`${a} ${fc(66)}`}>
        <text x={166} y={64} fontSize={40} fontWeight={700} fill={C.good}>
          = 4
        </text>
      </g>

      {/* Bottom number: the root */}
      <g className={`${a} ${fc(20)}`}>
        <text x={160} y={108} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.ink}>
          bottom 3: cube root, ∛8 = 2
        </text>
      </g>
      {/* Top number: the power */}
      <g className={`${a} ${fc(44)}`}>
        <text x={160} y={138} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.ink}>
          top 2: power, 2² = 4
        </text>
      </g>
    </Svg>
  );
}
