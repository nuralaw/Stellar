---
title: Linear Equations in Two Variables
skill: linear-equations-two-var
domain: algebra
section: math
summary: Switch between the forms of a line, read slope and intercepts from any of them, handle parallel and perpendicular lines, and turn a word problem into an equation.
minutes: 11
---

## What this question looks like

A **linear equation in two variables** has two unknowns, usually x and y, each to the first power and never multiplied together. Its graph is a straight line, and every point on that line is a solution. On the Digital SAT you will usually see one of these:

- A story with two quantities and a total: "Tickets cost $12 for adults and $8 for children, and the club collected $480. Which equation shows this?"
- An equation in **standard form**, like `4x − 6y = 18`, and a question about its slope or intercepts.
- "Line k is parallel (or perpendicular) to line ℓ and passes through (3, 5)…"
- A line through two points, or a point with an unknown coordinate, like "(k, 0) lies on the line…"
- "In the equation `0.08m + g = 22`, what does 0.08 represent?"

## The method

1. **Spot the form.** Is the equation in slope-intercept, standard or point-slope form? Or is it only described in words, a table or a graph?
2. **Get the slope.** Read it straight from `y = mx + b`. In `Ax + By = C`, use −A/B. Otherwise, solve for y.
3. **Get the point you need.** That can be the y-intercept, a given point, or an intercept from setting x or y to 0.
4. **Apply the condition.** Parallel means the same slope. Perpendicular means the negative reciprocal. A point "on the line" means you plug it in.
5. **Write or solve.** Use point-slope form `y − y₁ = m(x − x₁)` to build a line fast, then rearrange to match the choices.
6. **Check.** Plug a known point into your final equation. If the choices are in a different form, test a point in each choice instead of converting all four.

For word problems:

1. Define each variable with units: "a = number of adult tickets".
2. Each **rate** ("$12 each", "per pound") gets multiplied by its own variable.
3. A **total** goes alone on one side. A **starting amount** gets added.
4. Read the question again. Is it asking for the equation, a value, or a meaning?

## Rules and formulas you need

| Form | Looks like | What you can read off |
|---|---|---|
| Slope-intercept | `y = mx + b` | slope m, y-intercept (0, b) |
| Standard | `Ax + By = C` | slope −A/B, y-intercept C/B, x-intercept C/A |
| Point-slope | `y − y₁ = m(x − x₁)` | slope m, a point (x₁, y₁) |
| Horizontal line | `y = k` | slope 0 |
| Vertical line | `x = h` | slope undefined (not 0) |

| Relationship | Slopes | Example |
|---|---|---|
| Parallel | equal, with different intercepts | 2/3 and 2/3 |
| Perpendicular | negative reciprocals, product = −1 | 2/3 and −3/2 |
| Same line | equal slopes AND equal intercepts | `y = 2x + 1` and `4x − 2y = −2` |

More must-know facts:

- **Slope formula:** m = (y₂ − y₁)/(x₂ − x₁). Keep the same point first on top and bottom.
- **x-intercept:** set y = 0. **y-intercept:** set x = 0.
- **A point is on a line** exactly when its coordinates make the equation true.
- **Point-slope signs flip:** `y − 3 = 2(x + 4)` passes through (−4, 3), not (4, 3).
- **Equivalent equations:** multiplying a whole equation by a number doesn't change its line. So `y = (2/3)x + 3` and `2x − 3y = −9` are the same line.

Reading coefficients in a story:

- In `12a + 8c = 480`, 12 is the price of one adult ticket and 480 is the total collected.
- An intercept is "what happens if the other quantity is 0". Here a = 480/12 = 40 means 40 adult tickets if no child tickets were sold.
- If you solve for one variable, like `c = 60 − 1.5a`, the slope −1.5 means "each extra adult ticket means 1.5 fewer child tickets for the same total."

> **Key idea:** In standard form, the slope is NOT the x-coefficient. In `5x + 2y = 11`, the slope is −5/2, not 5.

## Worked examples

### Example 1: Build the equation, then solve

A school club sells small candles for $6 each and large candles for $15 each. Last month the club made exactly $540 from candle sales. If the club sold 30 small candles, how many large candles did it sell?

**Solution**

Let s = small candles and l = large candles. Each rate is multiplied by its own variable, and the total sits alone:

`6s + 15l = 540`

Plug in s = 30: 6(30) + 15l = 540, so 180 + 15l = 540. Then 15l = 360 and l = 24.

Check: 180 + 15(24) = 180 + 360 = 540. Correct.

**Answer:** 24

### Example 2: Parallel line from standard form

In the xy-plane, line ℓ is defined by `4x − 6y = 18`. Line k is parallel to line ℓ and passes through the point (3, 5). Which equation defines line k?

- (A) `y = (2/3)x + 3`
- (B) `y = −(2/3)x + 7`
- (C) `y = −(3/2)x + 19/2`
- (D) `y = (2/3)x − 3`

**Solution**

Slope of ℓ: −A/B = −4/(−6) = 2/3. You can also solve for y: −6y = −4x + 18, so y = (2/3)x − 3.

Parallel means the same slope, 2/3. Plug in (3, 5): 5 = (2/3)(3) + b, so 5 = 2 + b and b = 3. Line k is `y = (2/3)x + 3`.

(B) loses the sign when dividing by −6. (C) uses the perpendicular slope. (D) is line ℓ itself, and it misses the point: (2/3)(3) − 3 = −1, not 5.

**Answer:** (A)

### Example 3: Perpendicular line with an unknown point

In the xy-plane, line p passes through the points (−2, 1) and (4, 4). Line q is perpendicular to line p and passes through the points (0, 6) and (k, 0). What is the value of k?

**Solution**

Slope of p: (4 − 1)/(4 − (−2)) = 3/6 = 1/2.

Perpendicular slope: flip and change the sign, which gives −2. Check: (1/2)(−2) = −1.

Line q goes through (0, 6), so its y-intercept is 6: `y = −2x + 6`.

(k, 0) is on q, so 0 = −2k + 6 and k = 3.

If you used slope 2 (forgot the sign), you'd get k = −3. If you used −1/2 (forgot to flip), you'd get k = 12. Neither one gives a perpendicular line.

**Answer:** 3

### Example 4: What does the coefficient mean?

A delivery van starts the day with a full tank of fuel. The equation `0.08m + g = 22` relates the number of miles the van has driven, m, to the number of gallons of fuel left in the tank, g. Which of the following is the best interpretation of 0.08 in this context?

- (A) The van uses 0.08 gallons of fuel for each mile it drives.
- (B) The van can drive 0.08 miles on each gallon of fuel.
- (C) The tank holds 0.08 gallons of fuel when it is full.
- (D) The amount of fuel in the tank increases by 0.08 gallons for each mile driven.

**Solution**

Solve for g to see the relationship clearly: `g = 22 − 0.08m`. When m goes up by 1 mile, g goes down by 0.08 gallons. So 0.08 is gallons used per mile.

(B) flips the rate. It would be miles per gallon, which is 1 ÷ 0.08 = 12.5. (C) describes the starting amount, which is 22 gallons (m = 0). (D) gets the direction wrong.

Bonus: the m-intercept is 22 ÷ 0.08 = 275, so the van can drive 275 miles before the tank is empty.

**Answer:** (A)

## Traps to avoid

- **Slope read straight from standard form.** In `Ax + By = C`, the slope is −A/B. The x-coefficient alone is never the slope unless y's coefficient is 1 and y is alone.
- **Sign lost while solving for y.** When you divide by a negative coefficient of y, every term flips sign.
- **Half of the perpendicular rule.** The perpendicular slope needs both steps: flip AND change the sign. Choices with only one step are always there.
- **Parallel vs perpendicular mixed up.** Re-read the word before you choose. The other slope is usually among the choices.
- **The same line is not "parallel".** Same slope with the same intercept is one line, not two parallel lines.
- **Point-slope sign flip.** `y + 2 = 3(x − 5)` passes through (5, −2).
- **Prices swapped in a word problem.** Each price must go with its own item. Write "s = small" next to your equation.
- **Rate inverted in context.** "Gallons per mile" and "miles per gallon" are different numbers. Ask: what unit does the coefficient carry?

## Desmos shortcut

Desmos graphs any form directly. You do not need to rearrange `4x − 6y = 18` first.

**Read slope and intercepts:**

1. Type the equation exactly as given.
2. Click the gray dots where the line crosses the axes to see the intercepts.
3. For the slope, either use −A/B, or run a regression: make a table with two points on the line and type `y1 ~ m x1 + b`. Desmos shows m and b.

**Line through two points:** put both points in a table (x₁ and y₁ columns) and type `y1 ~ m x1 + b`. Desmos shows decimals, so convert 0.666667 back to 2/3.

**Test the answer choices:** type the given line, plot the given point as `(3, 5)`, then type each choice. The right one passes through the point and looks parallel (or crosses at a right angle). Confirm with the slopes, because two lines can *look* parallel without being parallel.

**Unknown constant:** type something like `y = −2x + 6` and the point `(k, 0)`, then drag the k slider until the point sits on the line. Or just graph the line and click its x-intercept.

**Perpendicular slope:** type `−1/(2/3)` to get the negative reciprocal without sign slips.

> **Tip:** Desmos only graphs with x and y. If a question uses letters like s and l, either swap them for x and y (keep track of which is which) or just solve by hand. For a one-step word problem, algebra is faster.

## Quick checklist

- Which form is this, and what is the slope? Use −A/B for standard form.
- Parallel: same slope. Perpendicular: flip and change the sign, product −1.
- Did I plug the given point into my final equation to check it?
- In a word problem, is each price or rate paired with the right variable?
- What units does each coefficient carry, and which direction is the change?
- If the choices are in another form, can I test a point instead of converting?

## Sources

- [College Board: What's on the SAT Math Section, Algebra](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/algebra)
- [Test Ninjas: SAT Linear Equations in Two Variables](https://www.test-ninjas.com/sat-linear-equations-in-two-variables)
- [PrepScholar: Lines and Slopes, SAT Math Strategies and Practice](https://blog.prepscholar.com/lines-slopes-sat-math-geometry-strategies-and-practice)
- [Albert: Linear Equations in Two Variables for SAT Math](https://www.albert.io/blog/linear-equations-in-two-variables-master-for-sat-math-success/)
- [Just Locked In: Parallel and Perpendicular Lines](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-equations-in-two-variables/parallel-perpendicular.html)
- [Open Exam Prep: Linear Functions, Slope and Rate of Change](https://open-exam-prep.com/study-guides/sat-math/algebra-linear/linear-functions-slope)
- [Open Exam Prep: Mastering the Built-In Desmos Calculator](https://open-exam-prep.com/study-guides/sat-math/introduction/desmos-calculator-mastery)
- [The Test Advantage: SAT Linear Functions, Rate of Change and Desmos](https://thetestadvantage.com/blog/sat-linear-functions-rate-of-change-desmos-guide-2026)
- [UWorld: SAT Algebra Key Concepts and Question Types](https://collegeprep.uworld.com/blog/types-of-heart-of-algebra-sat-questions-and-strategies/)
- [Acely: Desmos Guide, Linear Equations in 2 Variables](https://acely.com/desmos-guide-library/linear-equations-in-2-variables-using-x-y-variables)
- [The Only SAT Math Desmos Guide You'll Ever Need (video summary)](https://videohighlight.com/v/-pGNBb8M3LQ)
- [Galvanize Test Prep: SAT Algebra Question Types](https://galvanizetestprep.com/blogs/sat-algebra/)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
