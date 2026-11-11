---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratic, radical, rational and absolute value equations, count solutions with the discriminant, and find where a line meets a parabola.
minutes: 15
---

> **Key idea:** Move everything to one side (= 0) before you read a, b and c, use the discriminant b² − 4ac to count solutions or find k, and check every answer in the original equation after squaring or clearing a fraction.

## What this question looks like

You get an equation that isn't a straight line (with x², a square root, x in a denominator, or an absolute value) and must solve it. Some questions give a **system**: two equations that must both be true at once, with at least one of them curved.

Common versions:

- A quadratic set equal to something, like `3x² − 7x − 6 = 0` or `(x − 4)² = 25`: "What is the positive solution?"
- "How many real solutions does the equation have?"
- "For what value of k does the equation have exactly one real solution?" (or no real solutions)
- A square root or x in a denominator, like `√(x + 3) = x − 3` or `5/(x − 1) = …`, often with a fake answer among the choices
- An absolute value equation, like `abs(2x − 1) = 9`
- A system like `y = x² − 4x + 1` and `y = 2x − 8`: "If (a, b) is a solution, what is a + b?" or "How many solutions?"
- A graph of a line and a parabola, asking for a crossing point

Easy versions just want a solution. Hard versions (often in the second module) hide a constant such as k, c or p and ask what it must be for a certain number of solutions. That's where most points are won or lost.

## The method

1. **Pin down the target.** One solution, all of them, their sum, how many, or the value of k? Many wrong answers are right numbers for the wrong question.
2. **Pick a tool.** Use algebra if it looks quick and Desmos if it's messy or you need to compare choices. Strong scorers solve with one and check with the other.
3. **For a system, make one equation.** Solve one equation for y (or use the one already written as `y = …`) and substitute it into the other.
4. **Set it equal to 0.** Expand, collect like terms, and write `ax² + bx + c = 0`. Only now are a, b and c reliable.
5. **Solve or count.** To solve, factor, take square roots, complete the square, or use the quadratic formula. To count solutions or find k, skip solving and use the discriminant.
6. **Check for fake answers.** If you squared both sides or multiplied by something with x in it, plug each answer into the original equation. Throw out any that fail.
7. **Finish the job.** For a system, find y from the simpler equation (usually the line). Then answer exactly what step 1 asked.

## Rules and formulas you need

### Four ways to solve a quadratic

| Method | Use it when | Quick example |
|---|---|---|
| Factoring | Small numbers that multiply and add nicely | `x² − x − 12 = 0` → `(x − 4)(x + 3) = 0` → x = 4 or x = −3 |
| Square roots | No plain x term, or already `(x − h)² = k` | `(x − 2)² = 9` → x − 2 = ±3 → x = 5 or x = −1 |
| Completing the square | a = 1 and b is even | `x² + 6x = 4` → add 9 to both sides → `(x + 3)² = 13` → x = −3 ± √13 |
| Quadratic formula | Anything, especially when choices contain √ | `x = (−b ± √(b² − 4ac)) / (2a)` |

The **zero product rule** says that if A × B = 0, then A = 0 or B = 0. It only works when one side is zero: `(x − 1)(x + 2) = 4` does *not* mean x − 1 = 4.

### The discriminant counts real solutions

The **discriminant** is `b² − 4ac`, the part under the square root in the quadratic formula.

| Discriminant | Real solutions | What the graph does |
|---|---|---|
| Positive (> 0) | 2 | Crosses the x-axis twice |
| Zero (= 0) | Exactly 1 (a "double root") | Touches the x-axis at its vertex |
| Negative (< 0) | 0 | Never reaches the x-axis |

For a line and a parabola, substitute first, then use the same table. Two means the line cuts through the parabola, 1 means it just touches it (it's *tangent*), and 0 means they miss each other.

### Sum and product of the solutions

For `ax² + bx + c = 0`, you can get these without solving:

| You want | Formula | Example: `2x² − 10x + 3 = 0` |
|---|---|---|
| Sum of solutions | −b/a | −(−10)/2 = 5 |
| Product of solutions | c/a | 3/2 |

Watch the sign: the sum has a minus sign, the product doesn't.

### Equations that can create fake solutions

A fake (or **extraneous**) solution comes out of the algebra but fails the original equation.

| Type | How to solve | What to check |
|---|---|---|
| Radical, like `√(x + 1) = x − 5` | Get the root alone, then square both sides | Plug back in. A square root is never negative. |
| Rational (x in a denominator) | Note which x-values make a denominator 0, then multiply every term by the common denominator | Reject any answer that makes a denominator 0 |
| Absolute value | Get the absolute value alone, then split: inside = +right side, or inside = −right side | Plug both back in. If the right side comes out negative, that case fails. |

### Other facts to know cold

- `x² = 25` has two solutions, 5 and −5. The ± is not optional.
- `√25 = 5` only. The square root symbol means the positive root.
- An absolute value is never negative, so `abs(x + 2) = −3` has no solution.
- If both sides simplify to the same expression, like `2(x² + 1) = 2x² + 2`, every x works: infinitely many solutions.
- If both sides simplify to something false, like 3 = 5, there are no solutions.

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

- **Keeping a fake root.** After squaring or clearing denominators, the fake answer is almost always a choice, often as "both." Plug back into the original equation.
- **Reading a, b, c too early.** In `x² + 3x = 2x + 6`, b is not 3. Get everything on one side first: x² + x − 6 = 0, so b = 1.
- **Sign mistakes in −4ac.** If c is negative, −4ac is positive. For `x² + 2x − 8`, the discriminant is 4 + 32 = 36, not 4 − 32.
- **Not squaring all of b.** If b = 2√5, then b² = 4 × 5 = 20, not 2 × 5. Hard questions love radicals and fractions as coefficients.
- **Dropping the ±.** `(x + 1)² = 16` gives x = 3 *and* x = −5.
- **Dividing both sides by x.** In `x² = 7x`, that loses x = 0. Instead write x² − 7x = 0, so x(x − 7) = 0, and x = 0 or x = 7.
- **Answering the wrong thing.** They ask for k and you report x. They ask for a + b and you give a. They ask for the positive solution and you pick the negative one.
- **Ignoring a condition on k.** If k² = 36 and the question says k > 0, the answer is 6, not −6.
- **Pairing x and y from different solutions.** In a system, each x has its own y. Find each pair separately.
- **Trusting a Desmos slider for an exact answer.** A slider gets you close (say, 2.48). Confirm the exact value with the discriminant, or test the choices.
- **Checking only one absolute value case.** In `abs(x − 3) = 2x`, the case x − 3 = −2x gives x = 1, which works (the absolute value of −2 is 2). The case x − 3 = 2x gives x = −3, which fails: the left side is 6, the right side is −6.

## Desmos shortcut

Desmos is allowed on every Math question, and this skill is where it pays off most.

- **Type the equation itself.** Enter `x^2-6x+5=0` and Desmos draws a vertical line at each solution. Read the x-values off the grid; if clicking a line shows no label, graph `y=x^2-6x+5` and click its gray x-intercept dots.
- **It works for every type.** Use `sqrt(x+7)+5=x` for a root, `abs(2x-5)=x+1` for absolute value, and parentheses around any denominator.
- **Fake roots never appear.** Desmos graphs the original equation, so it only shows true solutions. For Example 3, `y=sqrt(x+7)+5` and `y=x` meet only at (9, 9), so x = 2 never shows up.
- **Systems: click the gray dots.** For Example 1, type `y=x^2-5x+2` and `y=x-3`. The crossing dots show (1, −2) and (5, 2).
- **"How many solutions?" Count crossings.** Count where `y = (your quadratic)` meets the x-axis, or count a system's crossing dots. Zoom out once so nothing hides off-screen.
- **Unknown constant? Use a slider.** Type `y=-5x+k` with the parabola and add the slider for k. Drag until the line just touches the parabola, then confirm exactly or try each choice as k.
- **Solve the discriminant equation in Desmos.** Write it with x standing in for k, like `64-8(7-x)=0`. The vertical line lands at x = −1, so k = −1.
- **Match decimals to radical choices.** If Desmos gives 0.382 and the choices look like `(3 − √5)/2`, type each choice and compare decimals.
- **Type carefully.** Write `1/(x-2)`, not `1/x-2`. Use `sqrt(` for roots and `abs(` for absolute value. Check that the typed equation matches the one on screen.

> **Tip:** Do the algebra when it's a two-line factor job. Reach for Desmos when the numbers are ugly, a constant is unknown, or you squared something and need to check for fake roots.

## Quick checklist

- Did I note what's being asked (x, k, a sum, how many)?
- Is everything on one side, = 0, before reading a, b, c?
- For "how many" or "what k," did I use `b² − 4ac` instead of solving?
- Did I keep the ± when taking a square root?
- If I squared or cleared a denominator, did I check every answer in the original equation?
- For a system, did I find the matching y for each x?
- Did a quick Desmos graph agree with my answer?
