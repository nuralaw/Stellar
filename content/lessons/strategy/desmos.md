---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Know when Desmos beats paper, type inputs without errors, and use graphs, regressions, sliders and lists to get answers fast.
---

## Open it only when it pays

Every Math question in Bluebook has a button that opens **Desmos**, a graphing calculator that can also switch to scientific. Reading and Writing has no calculator.

Desmos is fast when the answer is a **picture or a number**: where graphs cross, a zero, a top point, an equation that fits a table, a mean. It's slow when one or two lines on paper finish the job, or when a story still needs turning into an equation. Decide in 10 seconds.

Practice on the [test-day version](https://www.desmos.com/testing/collegeboard/graphing) before test day.

```quiz
Which question is the best job for Desmos?
- Solve 3x + 5 = 20 :: Two steps on paper. You'd be done before you finished typing.
- What is 15% of 80? :: One multiplication: 0.15 × 80 = 12. No graph needed.
* How many real solutions does 2^x = 3x + 1 have? :: Right. Graph both sides and count where they cross. By hand, this one is hard.
- In the model, what does the 12 represent? :: That's about meaning. Desmos can't read the story for you.
> Desmos shines when the answer is something you can see: crossings, zeros, peaks, fits. For quick arithmetic and questions about meaning, paper and thinking win.
```

## Fractions: press → to leave

The `/` key starts a fraction, and **everything** you type after it goes into the bottom, even a `)`, until you press the right arrow key →.

| You type | Desmos reads |
|---|---|
| `y=1/2x+3` | y = 1/(2x + 3) |
| `y=1/2`, then →, then `x+3` | y = (1/2)x + 3 |

Typing `(2/3)x` doesn't help: the `3)x` all lands in the bottom. Type `2/3`, press →, then `x`.

After typing, compare the neat line Desmos shows with the question.

```quiz
You want to graph y = (2/3)x − 4. Which typing works?
- `y=(2/3)x-4` :: After `/`, everything goes in the bottom, even the `)`, so the line comes out wrong.
- `y=2/3x-4` :: Without →, Desmos reads 2/(3x − 4).
* `y=2/3`, then →, then `x-4` :: Right. The arrow closes the fraction, so `x-4` stays on the main line.
- `y=2x/3-4` :: Without →, the `-4` lands in the bottom of the fraction along with the 3.
> Every time you finish the bottom of a fraction, press →. Then check the neat line before you trust the graph.
```

## Exponents: check what's raised

`^` starts an exponent. Two habits keep it right:

- Put an exponent longer than one term in **parentheses**: `y=2^(x+1)`.
- **Press →** to leave the exponent before you type the rest. For y = x² + 3x, type `y=x^2`, then →, then `+3x`.

Then read the neat line: the whole exponent, and nothing else, should be raised. 2^(x+1) and 2^x + 1 are different graphs.

```quiz
You want y = 3^(x − 2). After you type it, the neat line shows y = 3^x − 2, with only the x raised. What do you do?
- Go on: Desmos just shows exponents that way :: The neat line shows exactly what Desmos graphs. Here the exponent is only x.
- Go on: the curve has the right shape, just shifted :: The shift is the problem. Every crossing or point you read from it would be wrong.
* Retype it with the whole exponent in parentheses :: Right. Desmos is graphing 3^x − 2, a different function.
> 3^x − 2 is 3^x moved down 2; 3^(x − 2) is 3^x moved right 2. After retyping, check that all of x − 2 is raised before you trust the graph.
```

## Find where graphs cross

- **A system:** type each equation on its own line, exactly as written (`3x+2y=12` is fine). Click a line, and gray dots appear at its special points. Click the crossing to see its coordinates.
- **One equation in x:** graph each side. For 2^x = 3x + 1, type `y=2^x` on one line and `y=3x+1` on the next. The x-value of each crossing is a solution.
- **How many solutions?** Count the crossings, but **zoom out first**.

```quiz
You graph `y=2^x` and `y=3x+1` and see one crossing, at (0, 1). Before you answer "one solution", what should you do?
- Nothing: the screen shows every crossing :: The screen shows only a small window of the graph. Crossings can hide outside it.
* Zoom out to look for more crossings :: Right. Here a second crossing sits near (3.54, 11.6), which may be off your screen.
- Switch to the scientific calculator to check :: The scientific calculator draws no graphs. Zooming out is the check.
> A crossing off the screen is the easiest way to miscount solutions. Zoom out with the − button or the mouse wheel before you count.
```

## Tops, bottoms and zeros

Type the function after `y=` and click the curve. Gray dots appear at its zeros (x-intercepts) and at its top or bottom point. Click a dot to read it.

- **Desmos graphs only x and y.** Any other letter makes it offer a slider instead of a curve, so retype h(t) with x in place of t.
- The **maximum or minimum value** is the y-coordinate. **When or where** it happens is the x-coordinate.
- Nothing on screen? Zoom out: big values sit outside the starting view.

```quiz
A ball's height in meters, t seconds after it's thrown, is h(t) = −4.9t² + 29.4t + 2. You graph y = −4.9x² + 29.4x + 2, zoom out and click the top point: (3, 46.1). What's the maximum height?
- 3 meters :: 3 is the x-coordinate: the time, in seconds, when the ball is highest.
- 2 meters :: That's the starting height, where the curve meets the y-axis.
* 46.1 meters :: Right. The maximum value is the y-coordinate of the top point.
> By hand: the top is at t = −29.4 ÷ (2 × (−4.9)) = 3, and h(3) = −44.1 + 88.2 + 2 = 46.1.
```

## Fit a table with regression

A **regression** finds the equation that best fits a table. On the SAT the fit is often exact.

Type `table` on an empty line. Enter x-values in the first column, y-values in the second. Desmos names them x₁ and y₁: type them as `x1` and `y1`, **never with `_`**, or a later `~` gets stuck in the subscript. On a new line, type a model with `~` instead of `=`:

| Model | Type |
|---|---|
| Line | `y1~mx1+b` |
| Parabola | `y1~ax1^2`, →, `+bx1+c` |
| Exponential | `y1~ab^x1` |

Desmos lists the fitted values and R²; **R² = 1** means a perfect fit.

```quiz
A table gives values of an exponential function. You've entered the table. What do you type next?
- `y_1~ab^x_1` :: A typed `_` traps the `~` inside the subscript, and Desmos shows an error.
- `y1=ab^x1` :: With `=`, Desmos fits nothing. A regression needs `~`.
- `y1~mx1+b` :: That's the line model, but the question says exponential.
* `y1~ab^x1` :: Right. The `~` tells Desmos to find the a and b that fit the table best.
> A regression needs three things: the model the question names, `~` instead of `=`, and `x1` and `y1` typed as a letter and a digit.
```

## Reuse the fitted numbers

Desmos remembers the values a regression finds. On the next line you can type `ab^5` to get the model's value at x = 5, without retyping a and b.

The table shows three values of an exponential function f.

| x | f(x) |
|---|---|
| 1 | 12 |
| 2 | 18 |
| 3 | 27 |

```quiz
What is f(5)?
- 40.5 :: That's f(4), one step too early.
- 41.5 :: That comes from a line fit, `y1~mx1+b`. The question says exponential.
* 60.75 :: Right. f(x) = 8(1.5)^x, so f(5) = 60.75.
- 91.125 :: That's f(6), one step too far.
> In Desmos: make the table, then type `y1~ab^x1`. Desmos shows a = 8, b = 1.5 and R² = 1, so f(x) = 8(1.5)^x. On a new line type `ab^5`: it shows 60.75.
> By hand: each step multiplies by 18 ÷ 12 = 1.5. So f(4) = 27 × 1.5 = 40.5 and f(5) = 40.5 × 1.5 = 60.75.
```

## Sliders for unknown constants

Graph an equation with an extra letter, like y = x² − 6x + c. Desmos offers **add slider** for c. Click it.

- Drag the slider and watch the graph move. Dragging only gets you **close**.
- Click the slider's number and type an exact value, such as each answer choice, to test it.
- The range starts at −10 to 10. Click its ends to change it.

For exact constants, algebra (slopes, the discriminant) is often faster. Use the slider to check.

```quiz
For what value of c does the graph of y = x² − 6x + c touch the x-axis at exactly one point?
- 3 :: 3 is the x-coordinate of the bottom point, not c.
- 6 :: With c = 6 the curve dips below the axis and crosses it twice.
* 9 :: Right. With c = 9, the bottom point sits exactly on the x-axis, at (3, 0).
- 36 :: That's b². Touching once needs b² − 4c = 0, so c = 36 ÷ 4.
> In Desmos: graph y = x² − 6x + c, add the slider, then type each choice into it. Only c = 9 puts the bottom point on the x-axis.
> By hand: one touch means b² − 4ac = 0, so 36 − 4c = 0 and c = 9.
```

## Shading for inequalities

Type an inequality, like `y<2x+1` or `y<=2x+1` (Desmos turns `<=` into ≤). It shades the side where the inequality is true. The edge is **dashed** for < and >, so points on it don't count. It's **solid** for ≤ and ≥, so they do.

With two inequalities, the solutions are where the shadings **overlap**. To test a choice, type the point, like `(0,3)`. If it lands on an edge or a corner, plug it in instead: the picture can fool you there.

```quiz
The system is y > 2x − 1 and y ≤ −x + 5. In Desmos, the point (2, 3) sits right at a corner of the shaded region. Is it a solution?
- Yes: it touches the shaded region :: The picture fools you at corners. Plug the point into both inequalities.
- Yes: it satisfies y ≤ −x + 5 :: True, 3 ≤ 3. But a solution must satisfy both inequalities.
* No: 3 > 2(2) − 1 is false :: Right. 3 > 3 is false, so the point sits on the dashed edge, which isn't included.
> Two edges meet at the corner. The solid edge (≤) includes the point, but the dashed edge (>) doesn't. Failing one inequality is enough to rule it out.
```

## Statistics in one line

Put numbers in square brackets to make a list, then wrap it in a function:

| Type | You get |
|---|---|
| `mean([84,91,77,88])` | 85 |
| `median([12,7,9,15,7,10])` | 9.5 (no sorting needed) |
| `total([84,91,77,88])` | 340 |

You can also name a list, as in `L=[3,8,8,10,11]`, then type `mean(L)`, or `max(L)-min(L)` for the range. For a missing value, think in **totals**.

```quiz
Five test scores have a mean of 86. Four of them are 84, 91, 77 and 88. What do you type to find the fifth?
- `mean([84,91,77,88])` :: That gives 85, the mean of the four. It isn't the missing score.
- `4*86-total([84,91,77,88])` :: There are five scores, so their total is 5 × 86, not 4 × 86.
* `5*86-total([84,91,77,88])` :: Right. Five scores with a mean of 86 total 430, and 430 − 340 = 90.
> Mean × count = total. Subtract the scores you know, and what's left is the missing one: 90.
```

## Check the mode and exact values

> **Trap:** Desmos starts in **radians**. For triangle trig, click the wrench and choose Degrees, or `sin(30)` gives about −0.988 instead of 0.5.

Point labels are rounded decimals. When the choices hold roots or fractions, type each choice on its own line, like `2+sqrt(3)`, and compare **all** the digits.

Before each new question, delete old lines: a leftover slider called a or k can change your new graph.

```quiz
Desmos shows a zero at x = 3.73205. Which answer choice matches?
- √14 :: √14 ≈ 3.74166. Close, but the digits split at the second decimal place.
* 2 + √3 :: Right. 2 + 1.73205 = 3.73205, a perfect match.
- 3 + √2 :: 3 + 1.41421 = 4.41421, far off.
- 4 − √3 :: 4 − 1.73205 = 2.26795, nowhere near.
> Matching the first digit or two isn't enough. Type each choice into Desmos and compare its value with the label, digit by digit.
```

## Recap

- Decide in 10 seconds: Desmos for crossings, zeros, peaks, fits and statistics; paper for one-line algebra.
- Press → to leave every fraction and exponent, put long exponents in parentheses, and type `x1`, never `x_1`.
- Retype other letters as x and y, and read the coordinate the question asks for.
- Zoom out before you count crossings.
- For a regression, use `~` and the model the question names.
- Check degrees for trig, match decimals digit by digit, and delete old lines.
