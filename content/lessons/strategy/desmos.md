---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Know when the built-in Desmos calculator beats algebra, and exactly what to type for equations, systems, constants, tables and statistics.
minutes: 18
---

> **Key idea:** Open Desmos when a graph can do the hard work (curves, systems, unknown constants, tables, lists of data) and skip it when the algebra takes a step or two.

## When to reach for Desmos

Bluebook has a Desmos graphing calculator built in, and you can open it (calculator icon, top of the screen) on all 44 Math questions. There's also a scientific mode, but graphing mode does almost everything you need.

Strong scorers don't open it on every question. They spot the types where a graph does the work and skip it when algebra is quicker.

### Reach for it when you see

- A messy equation: square roots, x², x³, absolute value, x in a fraction
- A **system** of two equations: the answer is where the graphs cross
- "How many solutions…?": count the crossings
- The vertex, maximum, minimum or intercepts of a function
- An unknown constant like k, c or a ("For what value of k…?"): use a slider
- "Which expression is equivalent to…?": see which graph sits exactly on top
- A table of x and y values and "which equation fits?": use regression
- A list of numbers and a question about mean, median or range
- A system of inequalities: "Which point is a solution?"

### Skip it when

- The algebra is one or two steps, like `3x + 5 = 20`. You'll be done before you finish typing.
- It's a word problem about percents, ratios or units. The hard part is the setup, and Desmos can't read English.
- The question asks what a number *means* ("What does 12 represent in this model?").
- It's a geometry question built around a figure. A reference-sheet formula is usually faster.
- You've spent 30 seconds zooming and clicking with no luck. Switch to algebra.

> **Tip:** If you can solve it by hand in about 20 seconds, do that. You get about 95 seconds per question (22 questions in 35 minutes), so spend Desmos time where it pays.

## The routine

Run these steps every time you open Desmos.

1. **Decide what you're looking for before you type.** An intersection, an x-intercept, a slider value, a regression number?
2. **Rename the variable to x.** Desmos graphs in x and y, so type x even when the question uses t, p or n.
3. **Type carefully.** Use parentheses generously and watch exponents and fractions (see Traps to avoid).
4. **Zoom out if nothing shows up.** Many "no solution" mistakes are really "the crossing was off the screen" mistakes.
5. **Click the gray points.** Desmos marks intercepts, crossings, maximums and minimums with gray dots. Click one to see its coordinates.
6. **Answer the question that was asked.** If the crossing is at (3, 5) but the question wants x + y, the answer is 8, not 3.
7. **Match the answer format.** Desmos gives decimals. If the choices have fractions or square roots, type each choice to see its decimal, then match.

## The core moves

### Graph both sides of an equation

To solve an equation in one variable, put each side on its own line:

- Line 1: `y = 2sqrt(x+3)`
- Line 2: `y = x - 1`

The x-value of each crossing is a solution, so you can also count solutions at a glance. Graphs that never meet mean no real solution; graphs lying exactly on top of each other mean infinitely many.

You can also type the equation as written, like `x^2 + 2x = 15`. Desmos draws vertical lines at the solutions, here x = −5 and x = 3.

### Systems

Type each equation on its own line, exactly as given. You don't need to solve for y first: `3x + 2y = 12` works fine.

Click the crossing point, or count crossings for "how many solutions." Two parallel lines mean no solution; one line drawn on top of the other means infinitely many.

### Sliders for unknown constants

Type the equation with the constant in it, like `y = x^2 - 6x + c`, and click the "add slider" button for c. Drag the slider until the graph does what the question says, such as touching the x-axis once or running parallel to another line.

- The default range is −10 to 10. Click the numbers at the ends of the slider to change it.
- Dragging only gets you *close*. Type the exact value you suspect (like `c = 9`) into the slider box to confirm.
- Parallel lines are hard to judge by eye. Use the slider to find the neighborhood, then check slopes by hand.

### Equivalent expressions

Graph the original on line 1 and an answer choice on line 2. If the second graph lands *exactly* on top of the first, they're equivalent. Click the colored circle next to a line to hide or show it, which makes overlaps easy to spot.

### Pick numbers for questions full of letters

Desmos can't do symbolic algebra. On a "which expression is equivalent, in terms of a and b" question, set `a = 2` and `b = 3`, then see which choice gives the same number as the original.

### Tables and regression

**Regression** finds the equation that best fits a set of points. Use it when a question gives you a table of values.

1. Type `table` (or use the + button and choose table). The columns are named x₁ and y₁.
2. Enter the data.
3. On a new line, type a model with a tilde (~) instead of an equals sign. The tilde tells Desmos "find the numbers that make this fit the data best."

The three models you'll need:

- Line: `y_1 ~ mx_1 + b`
- Quadratic: `y_1 ~ ax_1^2 + bx_1 + c`
- Exponential: `y_1 ~ ab^(x_1)`

Desmos shows the fitted values of m and b (or a, b, c) under the regression line. You can reuse those letters, for example `f(x) = ab^x` and then `f(4)`.

If the points fit perfectly, you get the exact equation. If they don't (a scatterplot), you get the line or curve of best fit.

### Statistics

Put numbers in square brackets to make a list, then wrap it in a function: `mean([4,7,7,10,12])` gives the average. The cheat sheet below lists the other functions; `median` doesn't need the data sorted first.

You can name a list, `L = [4,7,7,10,12]`, and then write `mean(L)`. `stdev(L)` measures spread (the standard deviation), and `max(L) - min(L)` gives the range.

For a frequency table (values with counts), make two lists: `v = [1,2,3,4]` for the values and `c = [5,8,4,3]` for the counts. The mean is `total(v*c)/total(c)`, because Desmos multiplies lists item by item.

### Restricted domains and inequalities

To graph only part of a function, add a condition in curly braces: `y = x^2 - 4x {0 <= x <= 5}`. This helps on "maximum value on the interval" questions, because the highest point of the piece might be an endpoint, not the vertex.

Type inequalities directly, like `y > 2x - 1` and `y <= -x + 5`. The solutions to the system are where the shadings overlap. To test a choice, type the point, like `(1, 3)`, and see whether it lands in the double-shaded area.

A dashed boundary (`<` or `>`) is not included; a solid one (`<=` or `>=`) is.

### Degrees and radians

Desmos graphing mode starts in **radians**, but most SAT trig uses degrees. Until you switch, `sin(30)` gives about −0.99 instead of 0.5. Click the wrench (graph settings) and choose Degrees before any trig question.

## Cheat sheet: type exactly this

### Equations and systems

| Goal | What to type | What to look at |
|---|---|---|
| Solve an equation | `y = left side` and `y = right side` | x-values of the crossings |
| Count solutions | The same two lines (or one function and `y = 0`) | How many crossings |
| Solve a system | Each equation on its own line | The crossing point |
| Find a constant | `y = x^2 + kx + 9`, add slider k | Slider value when it fits |
| Check equivalence | Original on line 1, a choice on line 2 | Exact overlap |
| System of inequalities | `y > 2x - 1` and `y <= -x + 5` | Region with both shadings |
| Test a point | `(2, 4)` | Inside the overlap? |

### Functions

| Goal | What to type | What to look at |
|---|---|---|
| Zeros (x-intercepts) | `y = x^2 - 5x + 6` | Gray dots on the x-axis |
| Vertex, max or min | `y = -2x^2 + 8x + 1` | Gray dot at the turning point |
| Evaluate a function | `f(x) = 3x^2 - 2`, then `f(4)` | Number at the right of line 2 |
| Solve f(x) = a value | `f(x) = ...`, then `y = 7` | x-value of the crossing |
| Restrict the domain | `y = x^2 {-1 <= x <= 3}` | Highest or lowest point of the piece |

### Data

| Goal | What to type | What to look at |
|---|---|---|
| Linear regression | `table`, then `y_1 ~ mx_1 + b` | m and b |
| Quadratic regression | `table`, then `y_1 ~ ax_1^2 + bx_1 + c` | a, b and c |
| Exponential regression | `table`, then `y_1 ~ ab^(x_1)` | a = start, b = growth factor |
| Mean or median | `mean([3,8,8,11])`, `median([3,8,8,11])` | Number at the right |
| Sum of a list | `total([3,8,8,11])` | Number at the right |
| Spread | `stdev(L)` or `max(L) - min(L)` | Compare the numbers |

### Other handy functions

| Goal | What to type | What to look at |
|---|---|---|
| Absolute value, roots, π | `abs(x - 3)`, `sqrt(x)`, `cbrt(x)`, `pi` | Graph or value |
| Distance between points | `distance((1,2),(4,6))` | The number (here 5) |
| Midpoint | `midpoint((1,2),(5,8))` | The point (here (3, 5)) |
| Remainder | `mod(47, 6)` | The number (here 5) |
| Combinations | `nCr(8,3)` | The number (here 56) |

### Keys to know

| Symbol | How to type it |
|---|---|
| Exponent | `^` (Shift + 6) |
| Subscript, like x₁ | `x_1` (underscore) |
| Tilde for regression | `~` (Shift + the key left of 1) |
| ≤ and ≥ | `<=` and `>=` |
| Fraction | `/`, then the right arrow to leave the bottom |

## Worked examples

### Example 1: An equation with a square root

Which of the following gives all real solutions to `2√(x + 3) = x − 1`?

- (A) 3 − 2√5 only
- (B) 3 + 2√5 only
- (C) 3 − 2√5 and 3 + 2√5
- (D) There are no real solutions.

**Solution**

Graph both sides on separate lines:

- `y = 2sqrt(x+3)`
- `y = x - 1`

The graphs cross only once, at about (7.472, 6.472). So there is exactly one solution, and it's about 7.472. That already rules out (C) and (D).

Now match the decimal to a choice. Type `3+2sqrt(5)` on a new line: Desmos shows 7.472. Type `3-2sqrt(5)`: it shows −1.472, which isn't a crossing. So (B).

Why is (C) tempting? Squaring both sides by hand gives `x² − 6x − 11 = 0`, with roots 3 ± 2√5. But 3 − 2√5 makes the right side negative, and a square root can't be negative, so it's a fake (extraneous) solution. Graphing the original equation never shows fake solutions.

**Answer:** (B)

### Example 2: For what k is there no solution?

In the system below, k is a constant. For what value of k does the system have no solution?

`3x + ky = 7`
`6x − 4y = 5`

- (A) −4
- (B) −2
- (C) 2
- (D) 4

**Solution**

Type `3x + ky = 7` on line 1. Desmos offers a slider for k, so add it. Type `6x - 4y = 5` on line 2.

"No solution" means the lines never meet, so they must be parallel. Drag the slider: as k nears −2, the first line swings around until it runs alongside the second. Type `k = -2` into the slider box: the lines look parallel.

Confirm with slopes, since parallel is hard to judge by eye. The second line's slope is 6/4 = 3/2; the first's is −3/k. So −3/k = 3/2 and k = −2. They aren't the *same* line: halving the second equation gives `3x − 2y = 2.5`, and 2.5 ≠ 7.

Choice (C) is the sign mistake (it makes the slopes opposites). Choice (A) copies the −4 from the other equation without scaling.

**Answer:** (B)

### Example 3: Exponential model from a table

A scientist measures the number of bacteria N in a dish t hours after starting an experiment.

| t (hours) | N |
|---|---|
| 1 | 600 |
| 3 | 1,350 |

The number of bacteria grows exponentially. Which equation models N?

- (A) N = 400(1.5)^t
- (B) N = 600(1.5)^t
- (C) N = 400(2.25)^t
- (D) N = 200(3)^t

**Solution**

Type `table`. Under x₁ enter 1 and 3. Under y₁ enter 600 and 1350 (no comma inside the number). On a new line type:

`y_1 ~ ab^(x_1)`

Desmos reports a = 400 and b = 1.5. So the model is N = 400(1.5)^t.

Check by hand: 400 × 1.5 = 600 and 400 × 1.5³ = 400 × 3.375 = 1,350. Both match.

The traps: (B) treats 600 as the starting amount, but that's the amount at t = 1, not t = 0. (D) fits the first row but gives 5,400 at t = 3. (C) uses 2.25, the growth over *two* hours. Always check every row.

**Answer:** (A)

### Example 4: Finding a missing data value

The data set below has a mean of 19.

`12, 15, 15, 18, 20, 26, x`

What is the value of x?

- (A) 8
- (B) 19
- (C) 27
- (D) 133

**Solution**

The mean is the total divided by how many values there are. There are 7 values, so the total must be 19 × 7 = 133. In Desmos, type:

`19*7 - total([12,15,15,18,20,26])`

Desmos shows 27. Check it: type `mean([12,15,15,18,20,26,27])` and Desmos shows 19. Done.

Choice (A) comes from forgetting that x is one of the values (using 6 instead of 7). (B) is just the mean. (D) is the total, not the missing value.

**Answer:** (C)

### Example 5: Maximum height of a ball

A ball is thrown upward. Its height, in meters, t seconds after it's thrown is given by `h(t) = −4.9t² + 19.6t + 2`. What is the maximum height of the ball, in meters?

- (A) 2
- (B) 19.6
- (C) 21.6
- (D) 41.2

**Solution**

Change t to x and type:

`y = -4.9x^2 + 19.6x + 2`

If you don't see the top of the curve, zoom out. Click the gray dot at the peak: it shows (2, 21.6). The x-value, 2, is the *time* of the peak. The y-value, 21.6, is the *height*, which is what the question asks for.

Choice (A) is the time, not the height (and also the starting height). (B) is just a coefficient from the equation. (D) comes from leaving out the −4.9t² term: 19.6 × 2 + 2 = 41.2.

**Answer:** (C)

### Example 6: Which expression is equivalent?

Which expression is equivalent to `(x² − 9)/(x + 3) + 2x`, for x > 0?

- (A) 3x − 3
- (B) 3x + 3
- (C) x − 3
- (D) 3x − 9

**Solution**

Type the original on line 1. Careful with the fraction: type `(x^2-9)/(x+3)`, then press the right arrow to step out of the bottom of the fraction, then type `+2x`. Line 1 should read `y = (x^2-9)/(x+3) + 2x`.

On line 2, type choice (A): `y = 3x - 3`. It lands exactly on top of line 1. Turn line 2 off and on with its colored circle to be sure. If you try (B), (C) or (D) instead, you'll see a separate line.

By hand: x² − 9 = (x − 3)(x + 3), so the fraction becomes x − 3. Then x − 3 + 2x = 3x − 3. Choice (C) forgets to add the 2x.

**Answer:** (A)

## Traps to avoid

- **Typing a letter other than x.** In `y = -4.9t^2 + 19.6t + 2`, Desmos makes t a slider instead of graphing a curve.
- **Fractions that swallow the rest of the line.** After `/`, everything goes into the bottom until you press the right arrow. `1/2x` becomes 1 over 2x, not half of x.
- **Exponents that do the same.** After `^`, press the right arrow to come back down, and use parentheses: `2^(x+1)`.
- **Using = instead of ~ for regression.** With `=`, Desmos doesn't fit anything. Regression needs the tilde, and the table names need subscripts: `y_1` and `x_1`, not y and x.
- **Commas inside big numbers.** Type `1350`, not `1,350`. Desmos reads a comma as a separator between numbers.
- **Letters used twice.** If an old line already defines a, b or k, a new regression or slider with the same letter causes a conflict. Delete old lines or use different letters.
- **Trusting a rounded decimal.** Point labels are rounded. If the answer is a fraction, or a grid-in needs more precision, type the exact expression or test each choice.
- **Judging "parallel" or "touching" by eye.** Lines that look parallel might cross far away, and a parabola might miss the axis by a hair. Type the exact slider value, and back it up with slopes or the discriminant.
- **Fitting too few points.** A quadratic has three unknowns, so its regression needs at least three points. With only two, use another clue in the question, like the vertex.

## Quick checklist

- Is this a Desmos question (curves, systems, constants, tables, stats), or is algebra faster?
- Did I rename the variable to x and use `^`, `_`, `~` and `/` correctly?
- Did I press the right arrow to leave every exponent and fraction?
- Did I zoom out and click the right gray point?
- For trig: is Desmos in degrees?
- Did I answer the exact question (x, y, sum, count) and match the answer format?
