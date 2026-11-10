import type { Question } from "@/lib/types";

// Original questions. Math uses $…$ (inline) and $$…$$ (display) KaTeX. Write a literal dollar sign as \$.

export const MATH_QUESTIONS: Question[] = [
  {
    id: "m-alg-001",
    section: "math",
    domain: "algebra",
    skill: "linear-equations-one-var",
    difficulty: "easy",
    type: "mcq",
    prompt: "If $4x - 9 = 23$, what is the value of $x$?",
    choices: { A: "$3.5$", B: "$6$", C: "$8$", D: "$14$" },
    answer: "C",
    explanation:
      "Add 9 to both sides: $4x = 32$. Divide by 4: $x = 8$.\n\nChoice A comes from subtracting 9 instead of adding it ($4x = 14$). Choice D comes from subtracting 9 and skipping the division by 4 ($23 - 9 = 14$).",
  },
  {
    id: "m-alg-002",
    section: "math",
    domain: "algebra",
    skill: "systems-linear",
    difficulty: "medium",
    type: "spr",
    prompt:
      "$$\\begin{aligned} 2x + 3y &= 19 \\\\ x - y &= 2 \\end{aligned}$$\n\nThe solution to the system of equations above is $(x, y)$. What is the value of $x + y$?",
    answer: ["8"],
    explanation:
      "From the second equation, $x = y + 2$. Substitute into the first: $2(y + 2) + 3y = 19$, so $5y + 4 = 19$ and $y = 3$. Then $x = 3 + 2 = 5$.\n\nSo $x + y = 5 + 3 = 8$.",
  },
  {
    id: "m-alg-003",
    section: "math",
    domain: "algebra",
    skill: "linear-functions",
    difficulty: "medium",
    type: "mcq",
    prompt:
      "A gym charges a one-time sign-up fee plus a fixed monthly fee. The total cost, in dollars, of a membership for $m$ months is given by $C(m) = 35m + 60$. What is the best interpretation of $60$ in this context?",
    choices: {
      A: "The monthly fee, in dollars",
      B: "The one-time sign-up fee, in dollars",
      C: "The total cost, in dollars, of one month of membership",
      D: "The number of months a member must pay for",
    },
    answer: "B",
    explanation:
      "In $C(m) = 35m + 60$, the term $35m$ grows with each month, so $35$ is the monthly fee. The constant $60$ is paid no matter how many months there are — it's $C(0)$, the one-time sign-up fee.\n\nChoice C would be $C(1) = 95$, not $60$.",
  },
  {
    id: "m-adv-001",
    section: "math",
    domain: "advanced-math",
    skill: "nonlinear-equations",
    difficulty: "medium",
    type: "spr",
    prompt: "What is the positive solution to the equation $x^2 - 2x - 24 = 0$?",
    answer: ["6"],
    explanation:
      "Factor: find two numbers that multiply to $-24$ and add to $-2$: they are $-6$ and $4$. So $(x - 6)(x + 4) = 0$, giving $x = 6$ or $x = -4$.\n\nThe positive solution is $6$.",
  },
  {
    id: "m-adv-002",
    section: "math",
    domain: "advanced-math",
    skill: "equivalent-expressions",
    difficulty: "hard",
    type: "mcq",
    prompt: "Which expression is equivalent to $(3x - 2)^2 - (x + 4)^2$?",
    choices: {
      A: "$8x^2 - 20x - 12$",
      B: "$8x^2 - 4x + 20$",
      C: "$8x^2 - 20x + 20$",
      D: "$10x^2 - 4x - 12$",
    },
    answer: "A",
    explanation:
      "Expand each square: $(3x - 2)^2 = 9x^2 - 12x + 4$ and $(x + 4)^2 = x^2 + 8x + 16$.\n\nSubtract the whole second expression: $9x^2 - 12x + 4 - x^2 - 8x - 16 = 8x^2 - 20x - 12$.\n\nChoice C forgets to subtract the $16$ (adds it instead). A common trap is distributing the minus sign to only the first term.",
  },
  {
    id: "m-adv-003",
    section: "math",
    domain: "advanced-math",
    skill: "nonlinear-functions",
    difficulty: "hard",
    type: "mcq",
    prompt: "The function $f$ is defined by $f(x) = 2^x + k$, where $k$ is a constant. If $f(3) = 5$, what is the value of $f(5)$?",
    choices: { A: "$13$", B: "$29$", C: "$32$", D: "$35$" },
    answer: "B",
    explanation:
      "Use $f(3) = 5$ to find $k$: $2^3 + k = 5$, so $8 + k = 5$ and $k = -3$.\n\nThen $f(5) = 2^5 - 3 = 32 - 3 = 29$.\n\nChoice C ignores $k$; choice D adds 3 instead of subtracting it.",
  },
  {
    id: "m-psd-001",
    section: "math",
    domain: "problem-solving",
    skill: "percentages",
    difficulty: "easy",
    type: "mcq",
    prompt: "The price of a jacket is reduced by $20\\%$. The sale price is \\$64. What was the original price of the jacket?",
    choices: { A: "\\$51.20", B: "\\$76.80", C: "\\$80.00", D: "\\$84.00" },
    answer: "C",
    explanation:
      "After a $20\\%$ discount, the sale price is $80\\%$ of the original price $p$: $0.8p = 64$, so $p = 64 / 0.8 = 80$.\n\nChoice B adds $20\\%$ of \\$64 to \\$64 — but the discount was $20\\%$ of the original price, not of the sale price.",
  },
  {
    id: "m-psd-002",
    section: "math",
    domain: "problem-solving",
    skill: "ratios-rates",
    difficulty: "medium",
    type: "spr",
    prompt:
      "A car travels $150$ miles in $2.5$ hours at a constant speed. At this speed, how many miles will the car travel in $4$ hours?",
    answer: ["240"],
    explanation: "The speed is $150 \\div 2.5 = 60$ miles per hour. In $4$ hours the car travels $60 \\times 4 = 240$ miles.",
  },
  {
    id: "m-geo-001",
    section: "math",
    domain: "geometry-trig",
    skill: "right-triangles-trig",
    difficulty: "medium",
    type: "mcq",
    prompt: "In right triangle $ABC$, angle $C$ is the right angle, $AC = 8$, and $BC = 15$. What is the value of $\\sin A$?",
    choices: { A: "$\\dfrac{8}{17}$", B: "$\\dfrac{15}{17}$", C: "$\\dfrac{8}{15}$", D: "$\\dfrac{15}{8}$" },
    answer: "B",
    explanation:
      "The hypotenuse is $AB = \\sqrt{8^2 + 15^2} = \\sqrt{289} = 17$.\n\nFrom angle $A$, the opposite side is $BC = 15$, so $\\sin A = \\dfrac{\\text{opposite}}{\\text{hypotenuse}} = \\dfrac{15}{17}$.\n\nChoice A is $\\cos A$; choice D is $\\tan A$.",
  },
  {
    id: "m-geo-002",
    section: "math",
    domain: "geometry-trig",
    skill: "circles",
    difficulty: "hard",
    type: "spr",
    prompt: "A circle in the $xy$-plane has the equation $x^2 + y^2 - 6x + 10y - 2 = 0$. What is the radius of the circle?",
    answer: ["6"],
    explanation:
      "Complete the square for $x$ and $y$:\n\n$$(x^2 - 6x + 9) + (y^2 + 10y + 25) = 2 + 9 + 25$$\n\nSo $(x - 3)^2 + (y + 5)^2 = 36$. The right side is $r^2$, so $r = 6$.",
  },
];
