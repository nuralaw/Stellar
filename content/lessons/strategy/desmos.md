---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Know when the built-in Desmos calculator beats algebra, and type exactly the right thing to solve equations, systems, constants, tables and statistics in seconds.
minutes: 14
---

## When to reach for Desmos

Bluebook has a Desmos graphing calculator built in, and you can open it (calculator icon, top of the screen) on all 44 Math questions. There's also a scientific mode, but graphing mode does almost everything you need.

Desmos is fast on some jobs and slow on others. Strong scorers don't open it on every question. They spot the types where a graph does the hard work and skip it when algebra is quicker.

**Reach for Desmos when you see:**

- An equation that's messy to solve by hand: square roots, x², x³, absolute value, x in a fraction. Graph it instead of solving it.
- A **system** of two equations (two lines, or a line and a parabola). The answer is where the graphs cross.
- "How many solutions…?" Count the crossings.
- The vertex, maximum, minimum, x-intercepts or y-intercept of a function.
- An unknown constant like k, c or a: "For what value of k does the system have no solution?" Use a slider.
- "Which expression is equivalent to…?" Graph them and see which one sits exactly on top.
- A table of x and y values and "which equation fits?" Use a regression.
- A list of numbers and a question about mean, median or range.
- A shaded inequality question: "Which point is a solution to the system?"

**Skip Desmos when:**

- The algebra is one or two steps, like `3x + 5 = 20`. You'll be done before you finish typing.
- It's a word problem about percents, ratios or units. The hard part is the setup, and Desmos can't read English.
- The question asks what a number *means* ("What does 12 represent in this model?").
- It's a geometry question built around a figure. A reference-sheet formula is usually faster.
- You've spent 30 seconds zooming and clicking with no luck. Switch to algebra.

Rule of thumb: if you can solve it by hand in about 20 seconds, do that. You get about 95 seconds per question (22 questions in 35 minutes), so spend Desmos time where it pays.

## The method

Use this routine on every Desmos question:

1. **Decide what you're looking for before you type.** An intersection? An x-intercept? A slider value? A number from a regression? Say it to yourself in a word or two.
2. **Rename the variable to x.** Desmos graphs x and y. If the question uses t, p or n, type x instead. Any other letter makes Desmos offer a slider instead of a graph.
3. **Type the expression carefully.** Watch exponents and fractions (more on this below), and use parentheses generously.
4. **Zoom out if nothing shows up.** Many "no solution" mistakes are really "the crossing was off the screen" mistakes.
5. **Click the gray points.** Desmos marks intercepts, intersections, maximums and minimums with gray dots. Click a dot to see its exact coordinates.
6. **Answer the question that was asked.** If the crossing is at (3, 5) but the question wants x + y, the answer is 8, not 3.
7. **Match the answer format.** Desmos gives decimals. If the choices have fractions or square roots, type each choice into Desmos to see its decimal, then match.

### Graph both sides of an equation

To solve any equation in one variable, put the left side on one line and the right side on another:

- Line 1: `y = 2sqrt(x+3)`
- Line 2: `y = x - 1`

The x-value of each intersection is a solution, and you can see at a glance how many there are. Graphs that never meet mean no real solution; graphs lying exactly on top of each other mean infinitely many. (Typing the equation as written, like `x^2 + 2x = 15`, also works: Desmos draws vertical lines at the solutions, here x = −5 and x = 3.)

### Systems

Type each equation on its own line, exactly as given. You don't need to solve for y first: `3x + 2y = 12` works fine. Click the crossing point. For "how many solutions," just count the crossings. Two parallel lines means no solution. One line drawn on top of the other means infinitely many.

### Sliders for unknown constants

Type the equation with the constant in it, for example `y = x^2 - 6x + c`. Desmos offers an "add slider" button for c. Click it, then drag the slider and watch the graph change. Stop when the graph does what the question says (touches the x-axis once, becomes parallel to the other line, and so on).

A few slider tips:

- The default range is −10 to 10. Click the numbers at the ends of the slider to change them.
- Dragging gets you *close*. Then type the exact value you suspect (like `c = 9`) into the slider box to confirm.
- Parallel lines are hard to judge by eye. Use the slider to find the neighborhood, then check slopes by hand.

### Pick numbers for questions full of letters

Desmos can't do symbolic algebra. But on a "which expression is equivalent, in terms of a and b" question, you can set `a = 2` and `b = 3`, then see which answer choice gives the same number as the original.

### Equivalent expressions

Graph the original on line 1 and an answer choice on line 2. If the second graph lands *exactly* on top of the first, they're equivalent. Click the colored circle next to a line to hide or show it, which makes overlaps easy to spot.

### Tables and regression

When a question gives you a table of values, type `table` (or use the + button and choose table). The columns are named x₁ and y₁. Enter the data, then on a new line type a model with a tilde (~) instead of an equals sign. The tilde tells Desmos "find the numbers that make this fit the data best."

- Line: `y_1 ~ mx_1 + b`
- Quadratic: `y_1 ~ ax_1^2 + bx_1 + c`
- Exponential: `y_1 ~ ab^(x_1)`

Desmos shows the values of m and b (or a, b, c) under the regression. You can then use those letters in other lines, for example `f(x) = ab^x` and then `f(4)`. If the points fit perfectly, you get the exact equation. If they don't (a scatterplot), you get the line or curve of best fit.

### Statistics

Put numbers in square brackets to make a list, then use a function:

- `mean([4,7,7,10,12])` gives the mean (average).
- `median([4,7,7,10,12])` gives the median (middle value). No need to sort first.
- `total([4,7,7,10,12])` gives the sum.
- `max(...)` and `min(...)` give the biggest and smallest; range is `max(L) - min(L)`.
- `stdev(...)` gives the standard deviation (how spread out the data is).

You can name a list with `L = [4,7,7,10,12]` and then write `mean(L)`. For a frequency table (values with counts), make two lists, `v = [1,2,3,4]` for the values and `c = [5,8,4,3]` for the counts, and the mean is `total(v*c)/total(c)`. Desmos multiplies the lists item by item.

### Restricted domains and inequalities

To graph only part of a function, add a condition in curly braces: `y = x^2 - 4x {0 <= x <= 5}`. This helps with "maximum value on the interval…" questions, because the highest point of the restricted graph might be an endpoint, not the vertex.

For inequalities, type them directly: `y > 2x - 1` and `y <= -x + 5`. The solution to the system is where the shadings overlap. To test a choice, type the point, like `(1, 3)`, and see if it lands in the double-shaded area. A dashed boundary (`<` or `>`) is not included; a solid one (`<=` or `>=`) is.

### Degrees and radians

Desmos graphing mode starts in **radians**. Most SAT trig uses degrees, so `sin(30)` will give the wrong answer (about −0.99 instead of 0.5) until you switch. Click the wrench (graph settings) and choose Degrees, or check it before any trig question.

## Rules and formulas you need

**The cheat sheet: type exactly this**

| Goal | What to type | What to look at |
|---|---|---|
| Solve an equation | `y = left side` and `y = right side` on two lines | x-values of the intersections |
| Count solutions | Same two lines (or one function and `y = 0`) | How many crossings |
| Solve a system | Each equation on its own line, any form | Coordinates of the intersection |
| Find x-intercepts (zeros) | `y = x^2 - 5x + 6` | Gray dots on the x-axis |
| Find the vertex, max or min | `y = -2x^2 + 8x + 1` | Gray dot at the turning point |
| Evaluate a function | `f(x) = 3x^2 - 2` then `f(4)` | The number shown on the right of line 2 |
| Solve f(x) = value | `f(x) = ...` then `y = 7` | x-value of the intersection |
| Find a constant | `y = x^2 + kx + 9`, add slider k | Slider value when the graph matches |
| Check equivalence | Original on line 1, a choice on line 2 | Whether the graphs overlap exactly |
| Linear regression | table, then `y_1 ~ mx_1 + b` | Values of m and b |
| Quadratic regression | table, then `y_1 ~ ax_1^2 + bx_1 + c` | Values of a, b, c |
| Exponential regression | table, then `y_1 ~ ab^(x_1)` | a = starting value, b = growth factor |
| Mean or median | `mean([3,8,8,11])`, `median([3,8,8,11])` | The number on the right |
| Sum of a list | `total([3,8,8,11])` | The number on the right |
| Spread | `stdev(L)` or `max(L) - min(L)` | Compare the numbers |
| Restrict the domain | `y = x^2 {-1 <= x <= 3}` | Highest or lowest point of the piece |
| System of inequalities | `y > 2x - 1` and `y <= -x + 5` | The region with both shadings |
| Test a point | `(2, 4)` | Is it inside the overlap? |
| Absolute value, roots, π | `abs(x - 3)`, `sqrt(x)`, `cbrt(x)`, `pi` | Graph or evaluate |
| Distance between points | `distance((1,2),(4,6))` | The number (here 5) |
| Midpoint | `midpoint((1,2),(5,8))` | The point (here (3, 5)) |
| Remainder | `mod(47, 6)` | The number (here 5) |
| Combinations | `nCr(8,3)` | The number (here 56) |

**Keys to know**

| Symbol | How to type it |
|---|---|
| Exponent | `^` (Shift + 6) |
| Subscript, like x₁ | `x_1` (underscore) |
| Tilde for regression | `~` (Shift + the key left of 1) |
| ≤ and ≥ | `<=` and `>=` |
| Fraction | `/` (press the right arrow to leave the bottom) |

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

Choice (A) is the time, not the height (and also the starting height). (D) comes from forgetting that −4.9 × 2² is negative.

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

- **Typing a letter other than x.** If you type `y = -4.9t^2 + 19.6t + 2`, Desmos makes t a slider instead of graphing a curve. Rename the variable to x first.
- **Fractions that swallow the rest of the line.** After you type `/`, everything goes into the bottom until you press the right arrow. `1/2x` becomes 1 over 2x, not half of x. Look at what Desmos shows before you trust it.
- **Exponents that swallow the rest of the line.** Same problem with `^`. Press the right arrow after the exponent, and use parentheses: `2^(x+1)`.
- **Using = instead of ~ for regression.** With `=`, Desmos doesn't fit anything. Regression needs the tilde, and the table names need subscripts: `y_1` and `x_1`, not y and x.
- **Commas inside big numbers.** Type `1350`, not `1,350`. Desmos reads a comma as a separator between numbers.
- **Letters used twice.** If an old line already defines a, b or k, a new regression or slider with the same letter causes a conflict. Delete old lines, or use different letters.
- **Radians by accident.** Desmos graphing starts in radians. For degree questions, switch in the wrench menu first.
- **Answering the wrong thing.** Desmos gives you a point; the question might want only x, only y, their sum, or how many points there are.
- **Trusting a rounded decimal.** Point labels are rounded. If the answer is a fraction, or a grid-in needs more precision, type the exact expression or test each choice.
- **Judging "parallel" or "touching" by eye.** Lines that look parallel might cross far away, and a parabola that looks like it touches the axis might miss by a hair. Type the exact slider value, and back it up with slopes or the discriminant.
- **Fitting too few points.** A quadratic has three unknowns, so its regression needs at least three points. With only two, use another clue in the question, like the vertex.

## Quick checklist

- Is this a Desmos question (curves, systems, constants, tables, stats), or is algebra faster?
- Did I rename the variable to x and use `^`, `_`, `~` and `/` correctly?
- Did I press the right arrow to leave every exponent and fraction?
- Did I zoom out and click the right gray point?
- For trig: is Desmos in degrees?
- Did I answer the exact question (x, y, sum, count) and match the answer format?

## Sources

- [SAT Suite Calculator Policy (College Board)](https://satsuite.collegeboard.org/in-school-assessments/calculator-policy)
- [Desmos Cheat Sheet for the Digital SAT (Acely)](https://acely.com/sat/desmos-cheat-sheet)
- [Desmos SAT Calculator: What It Does, What It Can't Do (LearnQ)](https://blogs.learnq.ai/?p=4053)
- [A Step-by-Step Guide to the Desmos SAT Calculator (Say Hello College)](https://sayhellocollege.com/blog/guide-to-using-the-desmos-sat-calculator/)
- [Desmos on the Digital SAT (PrepMaven)](https://prepmaven.com/blog/test-prep/desmos-on-the-digital-sat/)
- [SAT Regression with Desmos: Data Tables to Equations (The Test Advantage)](https://thetestadvantage.com/blog/sat-regression-with-desmos-may-2026-data-tables-to-equations)
- [Desmos Scientific Calculator for the SAT: When to Switch (The Test Advantage)](https://thetestadvantage.com/blog/desmos-may-2026-scientific-calculator-for-sat-when-to-switch)
- [The only SAT Math Desmos Guide you'll ever need (YouTube)](https://www.youtube.com/watch?v=jCT0jTVzKy0)
- [A Beginner's Guide to Desmos on the SAT Math (YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ)
- [Official Desmos Thread (r/Sat)](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [What are people doing to learn Desmos? (r/Sat)](https://www.reddit.com/r/Sat/comments/1jwhsot/what_are_people_doing_to_learn_desmos/)
- [Desmos Help Center: Regressions](https://help.desmos.com/hc/en-us/articles/4406972958733)
- [Desmos Help Center: Statistics](https://help.desmos.com/hc/en-us/articles/4405633253389)
- [SAT Desmos Practice (Larry Learns)](https://www.larrylearns.com/blog/sat-desmos-practice)
- [How to Use the Desmos Calculator on the Digital SAT (Vibrant Publishers)](https://www.vibrantpublishers.com/blogs/blogs-on-act-sat/how-to-use-the-desmos-calculator-on-the-digital-sat)
- [How to Use the Desmos SAT Calculator (Achievable)](https://www.achievable.me/exams/sat/resources/how-to-use-the-desmos-sat-calculator/)
- [Practicing Digitally Using the Built-In Calculator (UWorld)](https://collegeprep.uworld.com/?p=24110)
- [Cracking the Digital SAT: Bluebook Tips and Tools (Applerouth)](https://applerouth.com/blog/cracking-the-digital-sat-bluebook-tips-tools-and-strategies-for-success)
- [How to Use Desmos on the SAT (Epic Exam Prep)](https://epicexamprep.com/?p=34213)
- [SAT Calculator Strategy: When and How (Axiom Academy)](https://theaxiomacademy.org/learn/sat-calculator-strategy-when-how)
