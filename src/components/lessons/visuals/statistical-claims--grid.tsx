import { C, Css, Svg } from "./kit";

// Random sample vs random assignment, side by side: a 2 × 2 grid of what each combination allows.
export const alt = "A 2 by 2 grid. Random sample and random assignment: cause and generalize. Random sample only: generalize, relationship only. Random assignment only: cause for the participants only. Neither: neither.";

const P = "v-statistical-claims--grid-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("hd", 2)}
${at("c1", 20)}
${at("c2", 36)}
${at("c3", 52)}
${at("c4", 68)}
`;

const GX = [72, 190];
const GY = [58, 104];
const CW = 114;
const CH = 42;
const CELLS = [
  { k: "c1", col: 0, row: 0, l1: "cause and", l2: "generalize", tone: "good" },
  { k: "c2", col: 1, row: 0, l1: "cause, but only", l2: "for participants", tone: "ink" },
  { k: "c3", col: 0, row: 1, l1: "generalize, but", l2: "relationship only", tone: "ink" },
  { k: "c4", col: 1, row: 1, l1: "neither", l2: "", tone: "bad" },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("hd")}>
        <text x={GX[0] + CW + 2} y={24} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
          random sample?
        </text>
        <g fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
          <text x={GX[0] + CW / 2} y={46}>
            yes
          </text>
          <text x={GX[1] + CW / 2} y={46}>
            no
          </text>
        </g>
        <text transform="translate(28 103) rotate(-90)" fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
          random assignment?
        </text>
        <g fontSize={12} fontWeight={600} fill={C.muted} textAnchor="end">
          <text x={GX[0] - 8} y={GY[0] + 25}>
            yes
          </text>
          <text x={GX[0] - 8} y={GY[1] + 25}>
            no
          </text>
        </g>
      </g>

      {CELLS.map((c) => {
        const col = c.tone === "good" ? C.good : c.tone === "bad" ? C.bad : C.ink;
        const fill = c.tone === "good" ? C.goodSoft : c.tone === "bad" ? C.badSoft : C.fill;
        const x = GX[c.col];
        const y = GY[c.row];
        return (
          <g key={c.k} className={cls(c.k)}>
            <rect x={x} y={y} width={CW} height={CH} rx={6} fill={fill} stroke={col} strokeWidth={1.5} />
            {c.l2 ? (
              <>
                <text x={x + CW / 2} y={y + 18} fontSize={11} fontWeight={700} fill={col} textAnchor="middle">
                  {c.l1}
                </text>
                <text x={x + CW / 2} y={y + 33} fontSize={11} fontWeight={700} fill={col} textAnchor="middle">
                  {c.l2}
                </text>
              </>
            ) : (
              <text x={x + CW / 2} y={y + 26} fontSize={13} fontWeight={700} fill={col} textAnchor="middle">
                {c.l1}
              </text>
            )}
          </g>
        );
      })}

      <text className={cls("c4")} x={160} y={164} fontSize={12} fill={C.muted} textAnchor="middle">
        sample → who it fits. assignment → cause.
      </text>
    </Svg>
  );
}
