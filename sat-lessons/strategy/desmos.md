---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Use the built-in Desmos calculator the right way: type without errors, graph, run regressions, use sliders, and know when paper is faster.
minutes: 24
---

## How Desmos works on test day

Every math question in Bluebook, the testing app, has a calculator button. It opens Desmos, a free online graphing calculator. You can switch between the Desmos graphing calculator and the Desmos scientific calculator at any time, in both math modules. There is no calculator in Reading and Writing.

- You may bring your own approved handheld calculator instead. Calculators with CAS (computer algebra, a feature that solves and factors algebra for you) are not allowed. If your own calculator stops working, you can keep going with Desmos.
- The test version is the normal Desmos graphing calculator with three extras switched off: images, folders and notes. One thing is switched on: "log mode" for exponential, logarithmic and power regressions. Everything in this lesson works on test day.
- Desmos starts in **radians**, not degrees (Move 8 shows how to change it).
- Since fall 2026 you can resize the calculator window in Bluebook.
- Practice on the exact test version at [desmos.com/testing/collegeboard/graphing](https://www.desmos.com/testing/collegeboard/graphing) and in the full-length practice tests in Bluebook. Test day should not be the first time you use it.

The calculator has two parts: the *expression list*, where you type one equation, list or number per line (press Enter for a new line), and the graph. The + button above the list adds a table. On the graph, the wrench button opens the settings, and the + and − buttons zoom in and out.

> **Key idea:** Desmos is fast when the answer is a picture or a number: a crossing point, a top point, a fitted equation, a mean. It is slow when you still have to think about what to type. Set up the math on paper first, then let Desmos do the heavy work.

## A routine for every question

1. **Read the last line.** Know exactly what you need: x, y, a constant, a count, a maximum.
2. **Decide in about 10 seconds.** If one or two lines on paper finish it, use paper. If the answer is a crossing point, a zero, a top or bottom point, a fitted equation, a shaded region or a statistic, use Desmos.
3. **Write the equation on paper first** when the question is a story.
4. **Type it carefully** (the six rules below) and compare the formatted line with the question.
5. **Read the right thing:** the x-coordinate or the y-coordinate, the exact decimal, the whole graph after zooming out.
6. **Finish by hand and check:** do the last step the question asks for, and see whether your answer fits the answer box.

## Type it right: six keyboard rules

Most Desmos mistakes are typing mistakes, not math mistakes. We typed every input in this lesson, key by key, into the College Board version of Desmos.

1. **Exponents.** Use ^. Typing + or − ends the exponent by itself, so `x^2 + 3x` works. For a longer exponent use parentheses: `2^(x+1)`. Typing `2^x+1` gives 2^x + 1, which is a different function.
2. **Fractions.** The / key starts a fraction, and everything you type after it stays in the bottom part until you press the right arrow key (→). So `y = 1/2x + 3` becomes y = 1/(2x + 3). Type `y = 1/2`, press →, then type `x + 3`.
3. **Subscripts.** Type `x1` and `y1`. Desmos makes the 1 small (a subscript) by itself. If you type an underscore, as in `x_1`, Desmos stays in the subscript until you press →, and typing ~ there gives an error.
4. **Symbols.** `<=` becomes ≤, `>=` becomes ≥, `sqrt` becomes √, and `pi` becomes π. The tilde ~, used for regressions, is Shift plus the key left of 1 on a US keyboard.
5. **Letters.** Desmos graphs only x and y. Any other letter (a, k, p) makes Desmos offer a slider. A system written with a and b gives an error, so rename the letters to x and y. The letter e is the number 2.718…, not a variable.
6. **Read the line back.** Desmos shows your input as neat math. Compare it with the question before you trust the graph.

## Move 1: Solve equations and systems by graphing

**A system.** Type each equation on its own line, exactly as written. Click one of the lines and gray dots appear at the special points; click the gray dot where the lines cross to see its coordinates. For more, see the lesson on systems of two linear equations.

**One equation in x.** Graph each side as its own line or curve. For 2^x = 3x + 1, type `y = 2^x` on one line and `y = 3x + 1` on the next. Every crossing point is a solution, and its x-coordinate is the value of x.

**Zeros (x-intercepts).** Type the function as `y = ...` and click the gray dots on the x-axis. For `y = x^2 - 4x + 1` you get (0.26795, 0) and (3.73205, 0). These are 2 − √3 and 2 + √3. If the answer choices show square roots, compare decimals (√3 is about 1.732) or use algebra.

**How many solutions.** Count the crossing points. Zoom out first: a crossing can sit outside the screen.

## Move 2: Find a maximum or a minimum

Type the function and click the curve. A gray dot appears at the top point (or bottom point) of a parabola. Click it to see the coordinates.

- The *maximum value* or *minimum value* is the y-coordinate.
- *Where* it happens (the time, the price, the number of items) is the x-coordinate.
- If the function uses another letter, like h(t), type it with x: h(t) = −4.9t² + 29.4t + 2 becomes `y = -4.9x^2 + 29.4x + 2`.

## Move 3: Tables and regressions

A *regression* finds the equation that fits a set of points. On the SAT, the points come from a table or a graph, and the fit is often exact.

**Make a table.** Click + and choose table, or type `table` on an empty line. Put the x-values in the first column and the y-values in the second. Desmos names the columns x_1 and y_1.

**Fast way: the regression button.** Click the small regression icon at the left of the table. Desmos adds a linear regression and shows the equation and R². A menu lets you switch to quadratic, exponential and other types.

**Typed way.** On a new line, type the model with ~ instead of =, and with x1 and y1 instead of x and y:

| Model | Type this | Use it when |
|---|---|---|
| Line | `y1 ~ mx1 + b` | y changes by the same amount each step |
| Parabola | `y1 ~ ax1^2 + bx1 + c` | there is one top or bottom point |
| Parabola, vertex form | `y1 ~ a(x1 - h)^2 + k` | the question talks about the vertex |
| Exponential | `y1 ~ ab^x1` | y is multiplied by the same number each step |

Desmos then lists the values (m and b, or a, b and c). R² = 1 means the points fit the model exactly. If R² is not 1, check the table for a typing error, or try another model. Desmos remembers the values, so on the next line you can type `ab^5` or `f(x) = mx + b` and use them.

Two points fix a line, and three points fix a parabola. If the answer choices are in a special form, such as a(b)^x or a(x − h)² + k, use that same form in your regression.

**Advanced: find constants with a list.** If a question says that (ax + 1)(x + b) = 3x² + 7x + 2 for all x, type `x1 = [1...10]` on one line and `(ax1 + 1)(x1 + b) ~ 3x1^2 + 7x1 + 2` on the next. Desmos tests all ten values at once and finds a = 3 and b = 2. Be careful: if no constants can make the two sides equal, Desmos still prints its best try, and when two answers exist it shows only one. Always put the numbers back into the question.

## Move 4: Sliders for unknown constants

Type an equation with a letter, like `y = x^2 - 6x + c`. Desmos shows a button "add slider: c". Click it, and a slider c = 1 (from −10 to 10) appears below.

- Drag the slider and watch the graph move. Press the play button to animate it.
- Click the value and type an exact number, like `c = 9`.
- Click the −10 or 10 at the ends to change the range.

Sliders are good for questions like "for what value of c does the graph touch the x-axis at exactly one point" (here c = 9), "for what value of k do the lines never meet", or "which value makes the curve pass through (2, 5)". Dragging only gets you close, so the fastest safe method is to type each answer choice into the slider line and see which one does the job. For exact values, algebra is usually quicker; use the slider to check.

## Move 5: Inequalities and shading

Type the inequality: `y < 2x + 1` or `y <= 2x + 1`. Desmos shades the side where it is true. The boundary is dashed for < and >, and solid for ≤ and ≥.

- With two inequalities, the solution of the system is where the shadings overlap; that region is darker.
- To test answer choices, type each point, like `(0, 3)`, and see whether it sits in the overlap.
- A point exactly on a boundary is hard to judge by eye. Substitute it instead: on a dashed line it is not a solution.
- A one-variable inequality, like `5 - 2(x + 4) < 3x + 7`, is shaded to one side of a vertical line. This shows you the direction of the answer (here x > −2).

## Move 6: Test the answer choices

- **Plug in values.** Type `f(x) = 8(1.5)^x` on one line and `f(5)` on the next. To try several inputs at once, type a list: `f([1, 2, 3, 4])`.
- **Plot points.** Type a choice like `(2, 5)` to see whether it lies on a curve or inside a shaded region.
- **Equivalent expressions.** Type the original as `y = ...` and each choice as `y = ...`. The equivalent one lies exactly on top of the original. Click the colored circle next to a line to hide it and check.
- **Constants.** Type each choice into the slider line, as in Move 4.

## Move 7: Statistics in one line

| Type this | You get |
|---|---|
| `mean([84, 91, 77, 88])` | the mean (average): 85 |
| `median([12, 7, 9, 15, 7, 10])` | the median: 9.5 (Desmos sorts the list for you) |
| `max(L) - min(L)` | the range of a list called L |
| `total(L)` | the sum of the list |
| `stdevp(L)` and `stdev(L)` | the standard deviation (of a whole population, or of a sample) |

Name a list once and reuse it: type `L = [3, 8, 8, 10, 11]`, then `mean(L)` and `median(L)` on the next lines.

For a missing value, think in totals. If four scores are 84, 91, 77 and 88 and the mean of five scores must be 86, type `5*86 - total([84, 91, 77, 88])`. Desmos shows 90.

On the SAT you calculate means, medians and ranges, but standard deviation questions only ask you to compare: which data set is more spread out? So you will rarely need the stdev functions.

## Move 8: Degrees or radians

Desmos starts in radians. In radians, `sin(30)` gives about −0.988, which is useless for a triangle with a 30° angle. Click the wrench and choose **Degrees**: now `sin(30)` gives 0.5. Check this setting before every trigonometry calculation. If a question gives an angle in radians, such as π/6, switch back.

## Move 9: Zoom in and read points exactly

- **Zoom.** Use the + and − buttons, scroll with the mouse, or set the x and y ranges in the wrench menu. After you zoom, a home button appears; it brings back the normal view. For a table, the magnifier icon at the left of the table zooms to show all the points.
- **Nothing on the screen?** Zoom out. Big numbers (like a price of 500) are far outside the normal −10 to 10 view.
- **Gray dots.** Click a curve to show its special points: intercepts, crossing points, and the top or bottom of a parabola. Click a dot to see its coordinates.
- **Rounding.** At normal zoom, the label shows five decimal places; zoom in to see more. Know the common decimals: 0.33333 is 1/3, 0.66667 is 2/3, 0.16667 is 1/6, 0.14286 is 1/7.
- **Fractions.** When a line shows a number, a small fraction icon at the left of the line switches between the decimal and the fraction. Type `1/3`, press →, then type `+ 1/4`: Desmos shows 0.583333…, and the icon turns it into 7/12. (Without the →, you get 1/(3 + 1/4), a different number.)
- **Entering the answer.** A student-produced response box takes up to 5 characters (6 with a minus sign). For 2/3, type 2/3, .6666 or .6667, but not .67, which is not accurate enough. Type 7/2 or 3.5, not 3 1/2. Don't type $, % or commas.

## Worked examples

### Example 1: The highest point

The height h, in meters, of a ball t seconds after it is thrown is given by h(t) = −4.9t² + 29.4t + 2. What is the maximum height of the ball, in meters?

- (A) 2
- (B) 3
- (C) 6.07
- (D) 46.1

**Solution.** Type `y = -4.9x^2 + 29.4x + 2`. You won't see the top of the curve at first, because it is far above the normal view, so zoom out. Click the curve and then the gray dot at the top: (3, 46.1). The maximum height is the y-coordinate, 46.1 meters.

By hand: the top of a parabola is at t = −b/(2a) = −29.4/(2 × (−4.9)) = 3, and h(3) = −44.1 + 88.2 + 2 = 46.1.

Why the others are wrong: (B) is the time when the ball is highest, the x-coordinate of the top point. (A) is the starting height, where the curve crosses the y-axis. (C) is about the time when the ball hits the ground, the positive x-intercept.

**Answer:** (D)

### Example 2: A table and an exponential regression

| x | 1 | 2 | 3 |
|---|---|---|---|
| f(x) | 12 | 18 | 27 |

The table shows three values of the exponential function f. What is the value of f(5)?

- (A) 40.5
- (B) 41.5
- (C) 60.75
- (D) 91.125

**Solution.** Make a table in Desmos with 1, 2, 3 in the x1 column and 12, 18, 27 in the y1 column. The question says the function is exponential, so on a new line type `y1 ~ ab^x1`. Desmos shows a = 8 and b = 1.5, with R² = 1, so f(x) = 8(1.5)^x. On the next line type `ab^5`: Desmos shows 60.75.

By hand: each step multiplies y by 18 ÷ 12 = 1.5. So f(4) = 27 × 1.5 = 40.5 and f(5) = 40.5 × 1.5 = 60.75.

Why the others are wrong: (A) is f(4), one step too early. (D) is f(6), one step too far. (B) comes from the wrong model: a linear regression, `y1 ~ mx1 + b`, gives m = 7.5 and b = 4, and 7.5 × 5 + 4 = 41.5. Always use the model the question names.

**Answer:** (C)

### Example 3: Statistics with lists

A data set contains the values 10, 12, 14, 16, 18 and 50. If the value 50 is removed, by how much does the mean of the data set decrease?

*Student-produced response: enter your answer.*

**Solution.** Type `mean([10, 12, 14, 16, 18, 50]) - mean([10, 12, 14, 16, 18])`. Desmos shows 6.

By hand: the first mean is 120 ÷ 6 = 20 and the new mean is 70 ÷ 5 = 14, and 20 − 14 = 6.

A common mistake is to answer 1, the change in the median (from 15 to 14). The median hardly moves, because removing an extreme value changes the mean much more than the median.

**Answer:** 6

## When not to use Desmos

Desmos costs time: you have to open it, type, zoom and read. Before you start typing, spend a few seconds asking: "Can I finish this in one or two lines on paper?" If yes, use paper. Tutors give these cases most often:

- **Short algebra or arithmetic.** For 3x + 5 = 20, or "what is 15% of 80", typing takes longer than thinking.
- **Word problems before you have an equation.** Desmos solves what you type, not what the story says. Write the equation on paper first, then use Desmos to solve or check it.
- **Questions about form.** "Which expression is equivalent?" or "which form shows the vertex as a constant?" Graphing four choices takes a long time; rewriting by hand is often faster.
- **Answer choices with square roots, π or fractions.** A graph gives decimals (3.73205), and matching them to exact forms takes extra work.
- **Exact constants.** For "no solution" or "exactly one solution" questions, comparing slopes or using the discriminant (b² − 4ac) gives the exact value at once. A slider only gets close.
- **Geometry without coordinates** (angles, similar triangles, areas), and statistics questions that ask about ideas rather than numbers.

Some tutors report that recent tests include more questions on which Desmos is slow. These reports come from students' memories of the test, not from College Board, and Desmos is still available on every math question. The safe plan is the same either way: learn the algebra, and use Desmos as a tool and a checker.

## Common mistakes

- **A fraction that swallows the rest of the line.** Press → after the bottom part of every fraction.
- **= instead of ~ in a regression,** or x instead of x1. With =, Desmos does not fit anything.
- **Radians instead of degrees** in a trigonometry question.
- **Reading the wrong coordinate.** The maximum value is the y-coordinate; the time when it happens is the x-coordinate.
- **Missing a crossing point** that is off the screen. Zoom out before you count solutions.
- **Old lines left over from the last question.** A slider called a or k from an earlier question can change your new graph. Delete old lines with the X at the right of each line.
- **Trusting the picture** at a boundary line or for almost-parallel lines. Substitute the point or compare slopes.
- **Rounding too early,** or entering .67 for 2/3. Keep the full decimal or the fraction until the end.

## Quick checklist

- Can I solve this in one or two lines on paper? If yes, skip Desmos.
- Did I write the equation on paper first, and does the formatted line in Desmos match the question?
- Did I press → after every fraction, and did I type x1 and y1 with ~ for a regression?
- Is the angle setting right (degrees or radians) for this question?
- Did I zoom out to see every crossing point, and did I read the coordinate the question asks for?
- Did I clear old lines and sliders from the previous question?
- Does my answer fit the answer box (5 characters, 6 with a minus sign)?

## Sources

- [SAT Suite calculator policy (College Board)](https://satsuite.collegeboard.org/digital/what-to-bring-do/calculator-policy) — the built-in Desmos calculator, the switch between graphing and scientific, handheld rules
- [Desmos calculators on College Board tests (College Board and Desmos, PDF, updated for 2026–27)](https://www.desmos.com/assessment-pdfs/CollegeBoard_Desmos_Calculator_AP_SAT.pdf) — what is different in the test version: no images, folders or notes; log mode for regressions
- [Bluebook: new and updated features (College Board)](https://bluebook.collegeboard.org/test-admin/new-updated-features) — fall 2026 changes, including the resizable calculator
- [Assessment Framework for the Digital SAT Suite, version 4 (College Board, PDF)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — calculator on every math question, answer-entry rules, what statistics questions ask
- [Desmos graphing calculator, College Board version](https://www.desmos.com/testing/collegeboard/graphing) — the test-day calculator, used to type and check every input in this lesson
- [SupertutorTV: When NOT to use Desmos on the Digital SAT](https://supertutortv.com/?p=29849) — ugly fractions, radicals, sliders that only get close, graphing every choice
- [The Test Advantage: When not to use Desmos on SAT Math](https://thetestadvantage.com/blog/when-not-to-use-desmos-on-sat-math) — the "one line on paper" check and questions about form
- [The Last SAT Desmos Guide You'll Need (James Lu SAT, YouTube)](https://www.youtube.com/watch?v=e-O4nwVHQ-Y) — regressions, lists like [1...10], table regressions, number of solutions
- [The only SAT Math Desmos Guide you'll ever need (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=jCT0jTVzKy0) — sliders, statistics, radians, and the limits of Desmos
- [Acely: Desmos cheat sheet for the SAT](https://acely.com/sat/desmos-cheat-sheet) — keyboard shortcuts, the regression button, statistics functions
