import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// The apostrophe grid: 's for one owner, s' for several owners, plain s for more than one, no apostrophe in owning pronouns.
export const alt =
  "Four cells: one owner, the girl's book; several owners, the girls' books; just more than one, two girls, no apostrophe; owning pronouns its and their, never an apostrophe.";

const P = "v-form-structure-sense--apostrophes-";
const A = P + "a";
const SCENE = P + "scene";
const CELL = P + "c";

const cellCss = [0, 1, 2, 3]
  .map((i) => {
    const t = 8 + i * 17;
    return `.${CELL + i} { animation-name: ${CELL + i}; }
@keyframes ${CELL + i} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
  })
  .join("\n");

const css = `
.v-form-structure-sense--apostrophes-a { animation: 10s ease-in-out infinite; }
.v-form-structure-sense--apostrophes-scene { animation-name: v-form-structure-sense--apostrophes-scene; }
@keyframes v-form-structure-sense--apostrophes-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${cellCss}
`;

const CW = 140;
const CH = 74;
const GX = 16;
const GY = 16;

function Cell({ i, tag, children }: { i: number; tag: string; children: ReactNode }) {
  const x = GX + (i % 2) * (CW + 8);
  const y = GY + Math.floor(i / 2) * (CH + 8);
  return (
    <g className={`${A} ${CELL + i}`}>
      <rect x={x} y={y} width={CW} height={CH} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={x + CW / 2} y={y + 20} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
        {tag}
      </text>
      <g transform={`translate(${x + CW / 2} ${y})`} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
        {children}
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        <Cell i={0} tag="one owner">
          <text y={46}>
            the girl<tspan fill={C.primary}>{"’"}s</tspan> book
          </text>
          <text y={64} fontSize={11} fontWeight={600} fill={C.muted}>
            apostrophe before s
          </text>
        </Cell>
        <Cell i={1} tag="several owners">
          <text y={46}>
            the girls<tspan fill={C.primary}>{"’"}</tspan> books
          </text>
          <text y={64} fontSize={11} fontWeight={600} fill={C.muted}>
            apostrophe after s
          </text>
        </Cell>
        <Cell i={2} tag="just more than one">
          <text y={46}>two girls</text>
          <text y={64} fontSize={11} fontWeight={600} fill={C.muted}>
            no apostrophe
          </text>
        </Cell>
        <Cell i={3} tag="owning pronouns">
          <text y={44}>its · their · whose</text>
          <text y={64} fontSize={11} fontWeight={600} fill={C.muted}>
            never an apostrophe
          </text>
        </Cell>
      </g>
    </Svg>
  );
}
