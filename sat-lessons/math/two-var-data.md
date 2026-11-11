---
title: Two-variable data and scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Read scatterplots, use a line of best fit to predict, explain slope and intercept in context, and tell linear data from exponential data.
minutes: 20
---

## What this question looks like

You see a **scatterplot**: one dot for each pair of values (x, y), usually with a line or curve of best fit drawn through the dots. Sometimes you get a table of x- and y-values instead. The question asks you to read the model, explain it or pick it.

Typical question stems:

- "Which of the following is closest to the value the line of best fit predicts when x = 20?"
- "How many of the data points have an actual value greater than the value the line of best fit predicts?"
- "What is the best interpretation of the slope (or of the number 410) in this context?"
- "Which of the following equations best models the data?"
- "Which type of model best fits the data: increasing linear, decreasing linear, increasing exponential or decreasing exponential?"
- "Which of the following could be an equation of a line of best fit for data set B?"

How often: usually 1 or 2 of the 44 math questions. The easy ones ask you to read a value from the line; the hard ones change the data set and ask what happens to the line.

The sub-types: predicted (on the line) versus actual (the dots); the meaning of the slope and the y-intercept; finding or choosing the equation of a model; choosing between a linear and an exponential model; and how the line changes when every data point changes.

## The method

1. Read the axes first: what x and y measure, their units, and how much one grid line is worth.
2. Decide what the question wants: a **predicted** value (read the line, or put x into the equation), an **actual** value (read the dot), or the difference between them.
3. For a slope question, say it as a sentence: "For each 1 more [x unit], the predicted [y] goes up (or down) by [slope] [y units]."
4. For an intercept question, say: "When [x] is 0, the predicted [y] is [intercept]."
5. To choose an equation, use signs first: does the trend go up or down, and does the line cross the y-axis above or below 0? Then estimate the slope from two points on the line (not two dots).
6. To choose a model, look at how y changes when x goes up in equal steps: the same amount each time means linear; the same factor (the same percent) each time means exponential.
7. If the data is in a table and the choices are close, run a regression in Desmos.

## Rules and formulas you need

### Reading a scatterplot

- **Positive association:** as x increases, y tends to increase (the dots go up to the right). **Negative association:** as x increases, y tends to decrease. **No association:** no up or down pattern.
- **Strong:** the dots lie close to a line or curve. **Weak:** the dots are widely scattered.
- An association doesn't prove that x causes y. That needs an experiment (see the lesson on evaluating statistical claims).
- An **outlier** is a dot far away from the overall pattern.

### Line of best fit: predicted versus actual

- A **line of best fit** (trend line) is the straight line that follows the pattern of the dots, with dots both above and below it.
- A value read from the line, or calculated from its equation, is a **predicted** value. A dot is an **actual** (observed) value.
- **Residual** = actual − predicted. A dot above the line has actual > predicted: the line underestimates, and the residual is positive. A dot below the line has actual < predicted: the line overestimates, and the residual is negative.
- Predictions inside the range of the data are reasonable. Predictions far outside it are risky, because the pattern may not continue.

### Slope and y-intercept in context

| Part of y = mx + b | What it means | Sentence to use |
|---|---|---|
| Slope m | the predicted change in y for each increase of 1 in x | "For each additional [x unit], the predicted [y] increases by m [y units]." (decreases if m is negative) |
| y-intercept b | the predicted y when x = 0 | "When [x] is 0, the predicted [y] is b." |

- The units of the slope are "y units per x unit", like dollars per month.
- For an increase of k in x, the predicted change in y is k × m.
- The word "predicted" (or "estimated") matters. A model describes the trend; it doesn't say that every data point changes by exactly m.
- The SAT also writes lines as y = a + bx. Then a is the intercept and b is the slope: the slope is always the number multiplied by x.

### Linear or exponential?

| | Linear model | Exponential model |
|---|---|---|
| Each time x goes up by 1, y... | changes by the same amount | is multiplied by the same factor |
| Equation | y = mx + b | y = a(b)^x, where a is the value at x = 0 and b is the factor |
| Table test | equal differences | equal ratios |
| Graph | straight line | curve that gets steeper and steeper (growth) or flattens toward 0 (decay) |
| Words | "increases by 30 each year" | "increases by 6% each year" |

- Growth of p% per step means a factor of 1 + p/100. Decay of p% per step means a factor of 1 − p/100. For example, growth of 6% per year means × 1.06 each year.
- Word clues: a fixed amount per step ("adds 30 members a year", "loses 2 liters an hour") is linear; a fixed percent or factor ("grows 6% a year", "doubles", "halves every 3 days") is exponential. Words like "loses", "decays" and "withdraws" mean decreasing.
- With growth, an exponential model eventually passes any linear model, even one that starts higher.

### Choosing a model from a scatterplot

- A good model follows the trend and has dots both above and below it. If all the dots are on one side of a line or curve, it is not a good fit.
- Dots in a straight band: linear. Dots on a curve that keeps getting steeper (or flattens out toward 0): exponential. Dots that rise and then fall (or fall and then rise): quadratic.

### When every data point changes

| Change to every data point | A line of best fit y = mx + b becomes |
|---|---|
| each y-value is multiplied by k | y = (km)x + kb |
| k is added to each y-value | y = mx + (b + k) |
| k is added to each x-value | y = m(x − k) + b |

> **Key idea:** Do to the line exactly what was done to the data. If every y-value is doubled, every point of the line is doubled too, so both the slope and the intercept double.

## Worked examples

### Example 1: Actual versus predicted

The table shows the high temperature, in degrees Celsius, and the number of ice creams sold at a beach stand on 8 days. A line of best fit for the data is y = 4x − 20, where x is the temperature and y is the number of ice creams sold.

| Temperature x (°C) | Ice creams sold y |
|---|---|
| 18 | 55 |
| 20 | 56 |
| 22 | 70 |
| 24 | 74 |
| 26 | 84 |
| 28 | 95 |
| 30 | 97 |
| 32 | 109 |

On how many of the 8 days was the actual number of ice creams sold greater than the number predicted by the line of best fit?

- (A) 3
- (B) 4
- (C) 5
- (D) 7

**Solution.** Predicted values come from the line, so put each temperature into y = 4x − 20. The predictions are 52, 60, 68, 76, 84, 92, 100 and 108. Now compare each actual value with its prediction: 55 > 52, 56 < 60, 70 > 68, 74 < 76, 84 = 84, 95 > 92, 97 < 100 and 109 > 108. The actual value is greater on 4 days (at 18, 22, 28 and 32 °C). On a scatterplot, these are the 4 dots above the line. Choice (A) counts the days below the line. Choice (C) also counts the day on the line, where actual and predicted are equal. Choice (D) counts every day that isn't on the line.

**Answer:** (B)

### Example 2: The meaning of the slope

A used-phone store uses the model y = −9.5x + 410 to estimate the price y, in dollars, of a certain phone x months after the phone was released. What is the best interpretation of −9.5 in this context?

- (A) The estimated price of the phone when it was released is $9.50.
- (B) For each additional month after release, the estimated price of the phone decreases by $9.50.
- (C) For each additional month after release, the price of every phone of this type decreases by exactly $9.50.
- (D) For each additional month after release, the estimated price of the phone decreases by 9.5%.

**Solution.** The number −9.5 is the slope, the number multiplied by x. The slope is the change in the estimated price for each increase of 1 in x, that is, for each additional month. It is negative, so the estimated price goes down by $9.50 each month. Choice (A) describes the y-intercept, and the intercept here is 410: the estimated price at release (x = 0) is $410. Choice (C) drops the word "estimated" and says "every" and "exactly", but a model describes the trend, not each phone. Choice (D) describes a percent change, which belongs to an exponential model, not a linear one.

**Answer:** (B)

### Example 3: Linear or exponential?

The table shows the number of followers f, in thousands, of a new video account t months after the account was created.

| t (months) | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| f (thousands) | 64 | 96 | 144 | 216 | 324 |

Which of the following equations best models the data?

- (A) f = 64 + 32t
- (B) f = 64(1.5)^t
- (C) f = 64(0.5)^t
- (D) f = 96(1.5)^t

**Solution.** Check the differences first: 96 − 64 = 32, 144 − 96 = 48, 216 − 144 = 72. They aren't equal, so the data isn't linear. Now check the ratios: 96 ÷ 64 = 1.5, 144 ÷ 96 = 1.5, 216 ÷ 144 = 1.5 and 324 ÷ 216 = 1.5. Each month the number is multiplied by 1.5 (a 50% increase), so the model is exponential with factor 1.5. The starting value, at t = 0, is 64, so f = 64(1.5)^t. Choice (A) uses only the first difference, 32; it predicts 128 at t = 2 instead of 144. Choice (C) would cut the number in half each month. Choice (D) starts at 96, which is the value at t = 1, not at t = 0.

**Answer:** (B)

### Example 4: The equation of a line of best fit

The table shows the number of members y of a new chess club x months after the club started.

| Month x | Members y |
|---|---|
| 1 | 19 |
| 2 | 20 |
| 3 | 26 |
| 4 | 27 |
| 5 | 31 |
| 6 | 34 |
| 7 | 38 |
| 8 | 37 |

Which of the following equations best represents a line of best fit for the data?

- (A) y = 2.9x + 16
- (B) y = 2.6x + 16.4
- (C) y = 16x + 2.9
- (D) y = 2.9x + 19

**Solution.** Desmos route: make a table with the months in the x_1 column and the members in the y_1 column, then type `y1 ~ mx1 + b` below it. Desmos gives m ≈ 2.905 and b ≈ 15.93, so the best line is about y = 2.9x + 16, choice (A).

Without Desmos you can still rule out the others. Choice (C) swaps the slope and the intercept: the club grows by about 3 members a month, not 16. Choice (D) uses the first y-value, 19, as the intercept, but 19 is the value at x = 1, and the intercept is the value at x = 0. Choice (B) is the line through the first and last points, (1, 19) and (8, 37). It sits too low in the middle: 5 of the 6 points between those two lie above it, and a line of best fit should have points both above and below it.

**Answer:** (A)

### Example 5: When every data point changes

For data set A, a line of best fit is y = 1.8x + 12. Data set B is created from data set A by keeping every x-value and changing every y-value: each y-value is multiplied by 2, and then 5 is added. Which of the following could be an equation of a line of best fit for data set B?

- (A) y = 3.6x + 17
- (B) y = 3.6x + 29
- (C) y = 1.8x + 29
- (D) y = 3.6x + 34

**Solution.** Do to the line what was done to the data. Every point (x, y) of data set A becomes (x, 2y + 5), so the line y = 1.8x + 12 becomes y = 2(1.8x + 12) + 5 = 3.6x + 24 + 5 = 3.6x + 29. Doubling the y-values doubles both the slope and the intercept, and adding 5 raises only the intercept. Choice (A) adds 5 to the intercept but forgets to double it first. Choice (C) forgets that doubling every y-value also doubles the slope (the line gets twice as steep). Choice (D) adds 5 before doubling: 2(12 + 5) = 34.

**Answer:** (B)

## Traps to avoid

- **Dot instead of line.** "Predicted" or "estimated by the line" means read the line or use the equation, even when a dot sits nearby. "Actual" or "observed" means read the dot.
- **Residual sign.** Residual = actual − predicted. A dot above the line gives a positive residual (the line underestimates); a dot below gives a negative one.
- **Slope versus intercept.** The slope is the number multiplied by x: a rate, "per" one unit. The intercept is the constant: the predicted value when x = 0.
- **Dropping "predicted".** Choices that say "every", "exactly" or "always" overstate what a model tells you.
- **Percent versus amount.** A linear model changes by a fixed amount; a fixed percent change means an exponential model.
- **Checking one step only.** One difference in a table doesn't prove a pattern. Check every step: equal differences for linear, equal ratios for exponential.
- **Intercept from the first row.** The y-intercept is the y-value at x = 0. If the table starts at x = 1, or x counts years since 2015, the first y-value may not be the intercept.
- **Grid scale.** Read the axis labels: one grid line may be worth 2, 5 or 100 units.
- **Predicting far outside the data.** A prediction far beyond the data assumes the trend continues, which may not be true.
- **Correlation is not causation.** A strong association doesn't show that x causes y.

## Desmos shortcut

Use Desmos when the data comes as a table, or to check a model against the points.

- **Make a table:** click the + button and choose "table". Type the x-values in the x_1 column and the y-values in the y_1 column.
- **Run a regression:** on a new line below the table, type the model with `~` (the tilde, usually Shift and the key to the left of 1) instead of `=`. Linear: `y1 ~ mx1 + b`. Exponential: `y1 ~ ab^x1` (the x1 goes up into the exponent). Quadratic: `y1 ~ ax1^2 + bx1 + c`. Desmos turns each 1 into a small subscript by itself. Don't type an underscore (x_1): the ~ or the next term gets stuck in the subscript and Desmos shows an error.
- **Read the result:** Desmos shows the values of the letters (m and b, or a and b) and R², which tells you how close the points are to the model (closer to 1 means a tighter fit). For a line it also shows r. For Example 4 you get m ≈ 2.905, b ≈ 15.93, R² ≈ 0.963 and r ≈ 0.981.
- **Predict:** Desmos remembers m and b, so on a new line type `10m + b` to get the predicted value at x = 10 (about 44.98 for Example 4).
- **Exponential results:** the values may not match a choice exactly (on the test, Desmos fits exponential models with "Log Mode" switched on, so its numbers can differ a little from other calculators). Pick the closest choice, and check that b is greater than 1 for growth and between 0 and 1 for decay.
- **Check a choice:** graph an answer choice, like `y = 2.9x + 16`, on top of the table points. A good fit runs through the middle of the dots.
- **Start clean:** Desmos keeps old lines from earlier questions. Delete old tables and regressions, or use new letters, so an old m or b doesn't get mixed in.

## Quick checklist

- What are x and y, and what is one grid line worth?
- Predicted = the line; actual = the dot; residual = actual − predicted.
- Slope sentence: "for each 1 more x, the predicted y changes by m".
- Intercept sentence: "when x is 0, the predicted y is b".
- Equal differences: linear. Equal ratios: exponential.
- A good fit has points both above and below it.
- Data in a table and close choices: run a Desmos regression.

## Sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — official testing points (fitting linear, quadratic and exponential models, predictions, comparing linear and exponential growth) and a sample line-of-best-fit question.
- [SAT Practice Test 6 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-6-answers-digital.pdf) — official reasoning for choosing a model with points above and below it, and for a line of best fit after the y-values are scaled.
- [SAT Practice Test 5 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf) — points above the line have actual values greater than predicted.
- [Mastering Two-Variable Data and Scatterplots (Test Ninjas)](https://www.test-ninjas.com/sat-two-variable-data-scatterplots) — the trend, fit, estimate routine and direction versus strength.
- [Scatterplots and Line of Best Fit (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/scatterplots-line-best-fit) — residual signs, the intercept warning and Desmos regression forms.
- [Scatter Plot: A Study Guide (Albert.io)](https://www.albert.io/blog/scatter-plot-a-study-guide-for-mastering-scatterplots-and-models/) — the differences versus ratios table test.
- [SAT Regression with Desmos (The Test Advantage)](https://thetestadvantage.com/blog/sat-regression-with-desmos-may-2026-data-tables-to-equations) — regression syntax, typing `~` instead of `=`, and the starting-year trap.
- [Identifying an Exponential Equation from Values or Points (1600.io)](https://1600.io/courses/1698988/lectures/43506884) — testing answer choices in Desmos and exponential regression.
- [Digital SAT Math Official Guide #3: Problem-Solving and Data Analysis (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=rFVm6ABV73A) — walkthroughs of scatterplot, slope and intercept, and linear versus exponential questions.
- [All of Problem Solving and Data Analysis on the SAT (James Lu, YouTube)](https://www.youtube.com/watch?v=rytygT3oFO4) — the "line = predicted, dots = actual" rule.
