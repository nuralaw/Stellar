---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratic, radical, rational and absolute value equations, count solutions with the discriminant, and find where a line meets a parabola.
minutes: 13
---

## What this question looks like

These questions give you an equation that is *not* a straight line (something with x², a square root, x in a denominator, or absolute value bars) and ask you to solve it. Some give a *system*, meaning two equations that must both be true at once, where at least one is curved. You'll usually spot one of these:

- A quadratic set equal to something: `3x² − 7x − 6 = 0` or `(x − 4)² = 25`. "What is a solution?" or "What is the positive solution?"
- "How many real solutions does the equation have?" Or the harder version: "For what value of k does the equation have **exactly one** real solution?" (or **no** real solutions).
- A square root or a fraction with x on the bottom: `√(x + 3) = x − 3` or `5/(x − 1) = …`. The question often hides a fake answer that doesn't actually work.
- Absolute value: `|2x − 1| = 9`.
- A system like `y = x² − 4x + 1` and `y = 2x − 8`. "If (a, b) is a solution, what is a + b?" or "How many solutions does the system have?"
- A graph of a line and a parabola, asking for an intersection point.

Easy versions just want you to solve. Hard versions (often in the second module) hide an unknown constant such as k, c or p and ask what it must be for a certain number of solutions. That's where most points are won or lost.

## The method

1. **Read what's being asked.** One solution? All of them? Their sum? How many there are? The value of k? Underline the target. Many wrong answers are correct numbers for the wrong question.
2. **Pick a tool.** If it looks quick, do algebra. If it's messy, or there are answer choices to compare, graph it in Desmos (see the Desmos section). Strong scorers do both: one to solve, one to check.
3. **For a system, turn two equations into one.** Solve one equation for y (or use the one already written as `y = …`), then substitute it into the other. Now you have one equation in x.
4. **Get everything on one side, = 0.** Expand, collect like terms, and write it as `ax² + bx + c = 0`. Only now are a, b and c reliable.
5. **Solve or count.** To *solve*, factor, take square roots, complete the square, or use the quadratic formula. To *count* solutions or find k, skip solving and use the discriminant, `b² − 4ac`. To find a *sum* or *product* of solutions, use −b/a or c/a.
6. **Check for fake (extraneous) answers.** If you squared both sides, or multiplied by something with x in it, plug each answer into the *original* equation. Throw out any that fail.
7. **Finish the job.** For a system, find y by plugging x into the simpler equation (usually the line). Then answer the exact question you underlined in step 1.

## Rules and formulas you need

**Four ways to solve a quadratic**

| Method | Use it when | Quick example |
|---|---|---|
| Factoring | Small whole numbers that multiply and add nicely | `x² − x − 12 = 0` → `(x − 4)(x + 3) = 0` → x = 4 or x = −3 |
| Square roots | No plain x term, or already in `(x − h)² = k` form | `(x − 2)² = 9` → x − 2 = ±3 → x = 5 or x = −1 |
| Completing the square | a = 1 and b is even | `x² + 6x = 4` → add 9 to both sides → `(x + 3)² = 13` → x = −3 ± √13 |
| Quadratic formula | Anything, especially when choices contain √ | `x = (−b ± √(b² − 4ac)) / (2a)` |

**The zero product rule:** if A × B = 0, then A = 0 or B = 0. It only works when one side is **zero**. `(x − 1)(x + 2) = 4` does *not* mean x − 1 = 4.

**The discriminant counts real solutions.** The discriminant is the part under the square root in the quadratic formula: `b² − 4ac`.

| Discriminant | Real solutions | What the graph does |
|---|---|---|
| Positive (> 0) | 2 | Parabola crosses the x-axis twice |
| Zero (= 0) | Exactly 1 (a "double root") | Parabola just touches the x-axis at its vertex |
| Negative (< 0) | 0 | Parabola never reaches the x-axis |

For a line and a parabola, substitute first, then use the same table: 2 means the line cuts through the parabola, 1 means the line just touches it (it's *tangent*), and 0 means they miss each other.

**Sum and product of the solutions** of `ax² + bx + c = 0`:

| You want | Formula | Example: `2x² − 10x + 3 = 0` |
|---|---|---|
| Sum of solutions | −b/a | −(−10)/2 = 5 |
| Product of solutions | c/a | 3/2 |

Watch the sign: the sum has a minus sign, the product doesn't.

**Equations that can create fake solutions**

| Type | How to solve | What to check |
|---|---|---|
| Radical, like `√(x + 1) = x − 5` | Get the root alone on one side, then square both sides | Plug back in. A square root can never equal a negative number. |
| Rational (x in a denominator) | Write down which x-values make a denominator 0. Multiply every term by the common denominator. | Reject any answer that makes a denominator 0 |
| Absolute value | Get the absolute value alone. Split into two cases: inside = +right side, and inside = −right side. | Plug both back in. If the right side would be negative, that case fails. |

**Other facts to know cold**

- `x² = 25` has **two** solutions: 5 and −5. The ± is not optional.
- `√25 = 5` only. The square root symbol means the positive root.
- `|stuff| = −3` has **no** solution. Absolute value is never negative.
- Never divide both sides by x. In `x² = 7x`, dividing loses x = 0. Instead, move everything to one side: x² − 7x = 0, so x(x − 7) = 0, which gives x = 0 or x = 7.
- If both sides simplify to the exact same expression (like `2(x² + 1) = 2x² + 2`), every x works: **infinitely many** solutions. If they simplify to something false (like 3 = 5), there are **no** solutions.

## Worked examples

### Example 1: Line meets parabola

`y = x² − 5x + 2`

`y = x − 3`

The system above has two solutions. If (a, b) is the solution with the greater x-coordinate, what is a + b?

- (A) −1
- (B) 2
- (C) 5
- (D) 7

**Solution**

Both equations say what y is, so set them equal: `x² − 5x + 2 = x − 3`.

Move everything to the left: `x² − 6x + 5 = 0`. This factors as `(x − 1)(x − 5) = 0`, so x = 1 or x = 5.

The greater x-value is a = 5. Find y using the line, since it's simpler: b = 5 − 3 = 2. Check in the parabola: 25 − 25 + 2 = 2. It matches.

So a + b = 5 + 2 = 7.

Why the others are wrong: (A) is 1 + (−2), the sum for the *other* solution, (1, −2). (B) is just b and (C) is just a. Each one is only half the job.

**Answer:** (D)

### Example 2: Exactly one solution

`y = 2x² + 3x + 7`

`y = −5x + k`

In the system above, k is a constant. For what value of k does the system have exactly one real solution?

- (A) −2
- (B) −1
- (C) 1
- (D) 9

**Solution**

"Exactly one solution" means the line is tangent to the parabola, so the discriminant must be 0.

Set the equations equal: `2x² + 3x + 7 = −5x + k`.

Move everything to the left. Add 5x and subtract k: `2x² + 8x + (7 − k) = 0`.

Now a = 2, b = 8, and c = 7 − k. Set the discriminant to zero:

`8² − 4(2)(7 − k) = 0`

64 − 8(7 − k) = 0, so 64 − 56 + 8k = 0, so 8 + 8k = 0, so k = −1.

Check: with k = −1, the equation becomes `2x² + 8x + 8 = 0`, which is `2(x + 2)² = 0`. That's one solution, x = −2. It works.

Why the others are wrong: (C) comes from moving k to the left without flipping its sign, which gives 7 + k instead of 7 − k. (A) is the x-coordinate of the touching point, and (D) is its y-coordinate (−5(−2) − 1 = 9). Both answer a question nobody asked.

**Answer:** (B)

### Example 3: The fake root (student-produced response)

`√(x + 7) + 5 = x`

What is the solution to the equation above?

**Solution**

Get the square root alone first: `√(x + 7) = x − 5`.

Square both sides: `x + 7 = (x − 5)²`, which is `x + 7 = x² − 10x + 25`. Remember that (x − 5)² is *not* x² + 25. You need the middle term.

Move everything to one side: `x² − 11x + 18 = 0`, which factors as `(x − 2)(x − 9) = 0`. The candidates are x = 2 and x = 9.

Now check both in the **original** equation:

- x = 9: √16 + 5 = 4 + 5 = 9. This works.
- x = 2: √9 + 5 = 3 + 5 = 8, and 8 ≠ 2. This is a fake root. Squaring created it, because (−3)² and 3² are both 9.

The question says "the solution," so there should be only one. That's a hint that one candidate fails.

**Answer:** 9

### Example 4: Watch the denominator

`(x + 4)/(x − 2) = 12/(x² − 2x)`

Which of the following gives all solutions to the equation above?

- (A) −6 only
- (B) 2 only
- (C) −6 and 2
- (D) 6 and −2

**Solution**

First, factor the right denominator: `x² − 2x = x(x − 2)`. The denominators can't be zero, so x ≠ 0 and x ≠ 2. Write that down before you do anything else.

Multiply both sides by x(x − 2): `x(x + 4) = 12`, which gives `x² + 4x − 12 = 0`.

Factor: `(x + 6)(x − 2) = 0`, so x = −6 or x = 2.

But x = 2 is banned, because it makes a denominator zero. Only x = −6 is left. Check it: the left side is (−2)/(−8) = 1/4, and the right side is 12/(36 + 12) = 12/48 = 1/4. It works.

Why the others are wrong: (C) skipped the check. (B) kept the fake answer and threw out the real one. (D) comes from a sign slip in factoring: `(x − 6)(x + 2)` multiplies out to x² − 4x − 12, not x² + 4x − 12.

**Answer:** (A)

## Traps to avoid

- **Keeping a fake root.** After squaring or clearing denominators, the SAT almost always offers the fake answer as a choice, often as "both" in multiple choice. Always plug back into the *original* equation.
- **Reading a, b, c too early.** In `x² + 3x = 2x + 6`, b is not 3. Get everything on one side first: x² + x − 6 = 0, so b = 1.
- **Sign mistakes in −4ac.** If c is negative, −4ac becomes positive. In `x² + 2x − 8`, the discriminant is 4 + 32 = 36, not 4 − 32.
- **Forgetting to square the whole b.** If b = 2√5, then b² = 4 × 5 = 20, not 2 × 5. Hard questions love radicals and fractions as coefficients.
- **Dropping the ±.** `(x + 1)² = 16` gives x = 3 *and* x = −5.
- **Dividing by x.** You lose the solution x = 0.
- **Answering the wrong thing.** The question asks for k, but you report x. It asks for a + b, but you give a. It asks for the positive solution, but you pick the negative one.
- **Ignoring a condition on k.** If k² = 36 and the question says k > 0, the answer is 6, not −6.
- **Pairing x and y from different solutions.** In a system, each x has its own y. Find each pair separately.
- **Trusting a Desmos slider for an exact answer.** A slider gets you close (say, 2.48). Confirm the exact value with the discriminant, or test the answer choices.
- **The absolute value case that "works" algebraically.** In `|x − 3| = 2x`, the case x − 3 = −2x gives x = 1, and it checks: |−2| = 2. But the other case, x − 3 = 2x, gives x = −3, and |−6| = 6 ≠ −6. Always check both cases.

## Desmos shortcut

The built-in Desmos calculator is allowed on every math question, and this skill is where it pays off most.

- **Solve any one-variable equation by typing it in.** Enter `x^2-6x+5=0` and Desmos draws vertical lines at each solution. Click where they cross the x-axis to read the values. This works for radicals, absolute values and fractions too. Type `abs(2x-5)=x+1` for absolute value and `sqrt(x+7)+5=x` for a root.
- **Fake roots disappear on their own.** If you graph the *original* equation, Desmos only shows the real solutions. For Example 3, graph `y=sqrt(x+7)+5` and `y=x`. They meet only at (9, 9), so x = 2 never shows up. This is the fastest way to catch extraneous answers.
- **Systems: enter both equations and click the gray dots.** For Example 1, type `y=x^2-5x+2` and `y=x-3`. Clicking the intersection dots shows (1, −2) and (5, 2).
- **"How many solutions?" Count the crossings.** Graph `y = (your quadratic)` and count where it meets the x-axis, or count the intersection dots in a system. Zoom out once to make sure nothing is off-screen.
- **Unknown constant? Use a slider.** Type `y=-5x+k` alongside the parabola, and Desmos offers to "add slider" for k. Drag it until the line just touches the parabola. That's the tangent value. Then confirm it exactly, or plug each answer choice in as k and see which one gives exactly one touching point.
- **Let Desmos solve the discriminant for you.** Write the discriminant with x standing in for the unknown, like `64-8(7-x)=0`. The vertical line lands at x = −1, which is k.
- **Match decimals to radical choices.** If Desmos gives 0.382 and the choices look like `(3 − √5)/2`, type each choice into Desmos and compare the decimals.
- **Typing tips.** Type `1/(x-2)`, not `1/x-2`, because parentheses matter. Use `sqrt(` for roots and `abs(` for absolute value. Check that the typed equation looks like the one on screen before you trust the graph.

> **Tip:** Do the algebra when it's a two-line factor job. Reach for Desmos when the numbers are ugly, when a constant is unknown, or whenever you squared something and need to check for fake roots.

## Quick checklist

- Did I underline what's being asked (x, k, a sum, how many)?
- Is everything on one side, = 0, before reading a, b, c?
- For "how many" or "what k," did I use `b² − 4ac` instead of solving?
- Did I keep the ± when taking a square root?
- If I squared or cleared a denominator, did I check every answer in the original equation?
- For a system, did I find the matching y for each x?
- Did a quick Desmos graph agree with my answer?

## Sources

- [College Board: Advanced Math on the Digital SAT](https://satsuite.collegeboard.org/digital/whats-on-the-test/math/types/advanced)
- [Test Ninjas: SAT Nonlinear Equations (framework skill description and question types)](https://test-ninjas.com/sat-nonlinear-equations)
- [Open Exam Prep: Systems of Linear and Nonlinear Equations](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/nonlinear-systems)
- [Open Exam Prep: Radical Equations and Extraneous Solutions](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/radical-equations-extraneous)
- [Open Exam Prep: Mastering the Built-In Desmos Calculator](https://open-exam-prep.com/study-guides/sat-math/introduction/desmos-calculator-mastery)
- [Albert.io: Solving Nonlinear Systems of Equations for the SAT](https://www.albert.io/blog/mastering-systems-of-linear-and-nonlinear-equations-solve-nonlinear-system-of-equations-for-the-sat/)
- [Albert.io: Digital SAT Math quadratics and the discriminant](https://www.albert.io/blog/?p=117721)
- [The Test Advantage: The Discriminant Trick for Hard Module 2 Quadratics](https://thetestadvantage.com/blog/dsat-discriminant-trick-solve-hard-module-2-quadratics-sept-2025)
- [The Test Advantage: Sum of Solutions on Desmos](https://thetestadvantage.com/blog/sat-sum-of-solutions-on-desmos-may-2026-10-second-method)
- [1600.io: Using Regression to Find Both Solutions to a Quadratic](https://1600.io/courses/1698988/lectures/47466973)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [YouTube: The Only SAT Math Desmos Guide You'll Ever Need](https://www.youtube.com/watch?v=-pGNBb8M3LQ)
- [PrepScholar: How (and When) to Complete the Square](https://blog.prepscholar.com/completing-the-square-formula)
- [ProfCurious: Radical, Rational and Absolute Value Equations](https://www.profcurious.com/ap_digital-sat/resources/study-notes/3-9-radical-rational-and-absolute-value-equations)
- [JustLockedIn: Nonlinear Equations and Systems question patterns](https://justlockedin-main.pages.dev/patterns/math/advanced-math/non-linear-equations-in-one-variable-and-system-of-equations-in-two-variables/)
- [Axiom Academy: Discriminant and Number of Solutions](https://theaxiomacademy.org/learn/sat-style-discriminant-number-solutions)
- [Schoolhouse.world: Hardest SAT Math Questions](https://schoolhouse.world/blog/hardest-sat-math-questions)
