import { C, Css, Svg } from "./kit";

// Read a histogram: bar height = how many values are in the bin. 2 + 5 + 8 + 4 + 1 = 20 values; the 10th and 11th are in the 20–29 bin.
export const alt = "A histogram of 20 values in bins 0–9, 10–19, 20–29, 30–39 and 40–49 with counts 2, 5, 8, 4 and 1. The counts add to 20, and the 10th and 11th values both fall in the 20–29 bin, so the median is there.";

const P = "v-one-var-data--histogram-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const rise = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleY(0.1) } ${t + 1}% { opacity: 1; transform: scaleY(0.1) } ${t + 8}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const BINS = ["0–9", "10–19", "20–29", "30–39", "40–49"];
const COUNTS = [2, 5, 8, 4, 1];

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${rise("b0", 3)}
${rise("b1", 10)}
${rise("b2", 17)}
${rise("b3", 24)}
${rise("b4", 31)}
${at("cnt", 40)}
${at("tot", 52)}
${at("mid", 68)}
`;

const BX = (i: number) => 46 + i * 46;
const BASE = 142;
const K = 11;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <path d={`M40 ${BASE} H${BX(5) + 2}`} fill="none" stroke={C.muted} strokeWidth={1.5} />

      {COUNTS.map((c, i) => (
        <rect key={i} className={cls("b" + i)} x={BX(i)} y={BASE - c * K} width={44} height={c * K} fill={i === 2 ? C.soft : C.fill} stroke={i === 2 ? C.primary : C.muted} strokeWidth={1.5} />
      ))}

      <g className={cls("cnt")} fontSize={13} fontWeight={700} fill={C.ink} textAnchor="middle">
        {COUNTS.map((c, i) => (
          <text key={i} x={BX(i) + 22} y={BASE - c * K - 5}>
            {c}
          </text>
        ))}
      </g>
      <g fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
        {BINS.map((b, i) => (
          <text key={b} x={BX(i) + 22} y={BASE + 15}>
            {b}
          </text>
        ))}
      </g>

      <text className={cls("tot")} x={160} y={26} fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">
        2 + 5 + 8 + 4 + 1 = 20 values
      </text>

      <g className={cls("mid")} fontSize={11} fontWeight={700} fill={C.primary} textAnchor="middle">
        <text x={BX(2) + 22} y={BASE - 34}>
          10th
        </text>
        <text x={BX(2) + 22} y={BASE - 20}>
          11th
        </text>
      </g>
    </Svg>
  );
}
