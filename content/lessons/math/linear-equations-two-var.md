---
title: Linear Equations in Two Variables
skill: linear-equations-two-var
domain: algebra
section: math
summary: Read slope and intercepts from any form of a line, handle parallel and perpendicular lines, and turn word problems into equations.
minutes: 11
---

> **Key idea:** Find the slope first: read m from `y = mx + b`, or use −A/B for `Ax + By = C`. Parallel lines share that slope; perpendicular lines use its negative reciprocal.

## What this question looks like

These questions give you a straight line in some form and ask for its slope, a point, or a matching equation. A **linear equation in two variables** has two unknowns (usually x and y), each to the first power and never multiplied together. Every point on its line is a solution.

Typical stems:

- A story with two quantities and a total: "Adult tickets cost $12, child tickets $8, and the club collected $480. Which equation shows this?"
- An equation in **standard form**, like `4x − 6y = 18`, with a question about its slope or intercepts.
- "Line k is parallel (or perpendicular) to line ℓ and passes through (3, 5)…"
- A line through two points, or a point with an unknown coordinate, like "(k, 0) lies on the line…"
- "In the equation `0.08m + g = 22`, what does 0.08 represent?"

## The method

Use the same routine on every line question; word problems add four steps of their own.

### Line questions

1. **Spot the form.** Slope-intercept, standard, point-slope, or only words, a table or a graph?
2. **Get the slope.** Read m from `y = mx + b`, use −A/B for `Ax + By = C`, or solve for y.
3. **Get a point.** Use the y-intercept, a given point, or an intercept (set x or y to 0).
4. **Apply the condition.** Parallel: same slope. Perpendicular: negative reciprocal. A point "on the line": plug it in.
5. **Write the line.** Point-slope form `y − y₁ = m(x − x₁)` is fastest. Then rearrange to match the choices.
6. **Check.** Plug a known point into your answer. If the choices are in another form, test the point in each choice instead of converting all four.

### Word problems

1. Define each variable with units: "a = number of adult tickets".
2. Multiply each **rate** ("$12 each", "per pound") by its own variable.
3. Put a total alone on one side. Add any starting amount.
4. Re-read the question: does it want the equation, a value, or what a number means?

## Rules and formulas you need

These forms and slope facts cover almost every question.

| Form | Looks like | What you read off |
|---|---|---|
| Slope-intercept | `y = mx + b` | slope m, y-intercept (0, b) |
| Standard | `Ax + By = C` | slope −A/B |
| Point-slope | `y − y₁ = m(x − x₁)` | slope m, point (x₁, y₁) |
| Horizontal | `y = k` | slope 0 |
| Vertical | `x = h` | slope undefined (not 0) |

In standard form, the y-intercept is C/B and the x-intercept is C/A.

| Relationship | Slopes | Example |
|---|---|---|
| Parallel | equal, different intercepts | 2/3 and 2/3 |
| Perpendicular | negative reciprocals (product −1) | 2/3 and −3/2 |
| Same line | equal slopes and intercepts | see below |

### Facts to know cold

- **Slope formula:** m = (y₂ − y₁)/(x₂ − x₁). Put the same point first on top and bottom.
- **Intercepts:** for the x-intercept set y = 0; for the y-intercept set x = 0.
- A point is on a line exactly when its coordinates make the equation true.
- Point-slope signs flip: `y − 3 = 2(x + 4)` passes through (−4, 3).
- Multiplying a whole equation by a number keeps the same line. So `y = (2/3)x + 3` and `2x − 3y = −9` are one line, and so are `y = 2x + 1` and `4x − 2y = −2`.

### Reading numbers in a story

- In `12a + 8c = 480`, 12 is the price of one adult ticket and 480 is the total collected.
- An intercept means "the other quantity is 0". Here a = 480/12 = 40: 40 adult tickets if no child tickets sold.
- Solved for one variable, `c = 60 − 1.5a`. The slope −1.5 means each extra adult ticket replaces 1.5 child tickets for the same total.

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

Each of these wrong answers shows up in the choices on purpose.

- **Slope read straight from standard form.** In `5x + 2y = 11` the slope is −5/2, not 5. The x-coefficient is the slope only when y is alone.
- **Sign lost while solving for y.** Dividing by a negative y-coefficient flips the sign of every term.
- **Half of the perpendicular rule.** You must flip AND change the sign. Choices that do only one step are always offered.
- **Parallel and perpendicular mixed up.** Re-read the word before you pick; the other slope is usually a choice.
- **Calling the same line "parallel".** Same slope and same intercept is one line, not two parallel lines.
- **Point-slope sign flip.** `y + 2 = 3(x − 5)` passes through (5, −2), not (−5, 2).
- **Prices swapped in a word problem.** Pair each price with its own item. Write "s = small" next to your equation.
- **Rate turned upside down.** "Gallons per mile" and "miles per gallon" are different numbers. Ask what unit the coefficient carries.

## Desmos shortcut

Desmos graphs any form as typed, so you never need to rearrange `4x − 6y = 18` first.

- **Intercepts:** type the equation, click the line, and click the gray dots where it crosses the axes.
- **Slope or a line through two points:** put the points in a table (columns x₁ and y₁) and type `y1 ~ m x1 + b`. Desmos shows m and b as decimals, so turn 0.666667 back into 2/3.
- **Testing choices:** type the given line, the point `(3, 5)`, and each choice. The right one hits the point and looks parallel (or crosses at a right angle). Confirm with slopes, since lines can *look* parallel without being parallel.
- **Unknown constant:** type `y = −2x + 6` and `(k, 0)`, then drag the k slider until the point sits on the line. Or just click the x-intercept.
- **Perpendicular slope:** type `−1/(2/3)` to get the negative reciprocal without a sign slip.

> **Tip:** Desmos only graphs x and y. If a question uses letters like s and l, swap them for x and y (and track which is which), or solve by hand. For a one-step word problem, algebra is faster.

## Quick checklist

- Which form is this, and what is the slope? (−A/B for standard form.)
- Parallel: same slope. Perpendicular: flip and change the sign.
- Did I plug the given point into my final equation?
- In a word problem, is each price or rate paired with the right variable?
- What unit does each coefficient carry, and which way is the change?
- If the choices are in another form, can I test a point instead of converting?
