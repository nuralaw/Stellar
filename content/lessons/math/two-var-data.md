---
title: Two-Variable Data and Scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Read scatterplots and best-fit models, explain slope and intercept in context, make predictions, and tell linear growth from exponential growth.
minutes: 12
---

> **Key idea:** A model describes the trend, not each data point. Predictions come from the line or equation, and good interpretations say "predicted," "estimated" or "on average."

## What this question looks like

You get a scatterplot, a table or a model and answer one question about the trend. A **scatterplot** shows pairs of data as dots, like hours studied (x) and test score (y). The line or curve of best fit follows the overall trend: it's a model that gives a *predicted* y for each x, which usually isn't the real value.

Typical stems:

- "Based on the line of best fit, what is the predicted value of y when x = 12?"
- "Which equation best models the data?"
- "What is the best interpretation of the slope / the number 1,850 in this context?"
- "For the data point at x = 6, how much greater is the actual value than the value predicted by the line of best fit?"
- "Which model, linear or exponential, fits the data in the table?"

Often the graph does most of the work, and the math is one substitution.

## The method

Read the graph first, then let the model do the work.

1. **Read the axes.** Note what x and y measure, their units, and what one gridline is worth. It's often 2, 5 or 10, not 1.
2. **Read the trend.** Up to the right means a positive slope, down to the right a negative one. A bending curve means exponential or quadratic, not linear.
3. **Use the model, not the dots.** Predictions come from the line or equation. A single dot is an *actual* value.
4. **To predict,** plug x into the equation, or go up from x to the line and across to the y-axis.
5. **To interpret a number,** decide whether it's the slope or the intercept. Then say it in the story's words, using "predicted" or "estimated."
6. **To pick an equation,** eliminate by the sign of the slope, then the y-intercept, then the steepness. Use Desmos if two choices are still close.

## Rules and formulas you need

Know what each part of a model means in the story, and how to tell linear from exponential.

### Linear models: `y = mx + b`

| Part | Meaning in context |
|---|---|
| slope m | *predicted* change in y for each +1 in x |
| intercept b | *predicted* y when x = 0 |

- The slope is a rate ("per year," "per hour"). The intercept is the starting value.
- Slope from two points on the line: `m = (y₂ − y₁)/(x₂ − x₁)`. Pick points where the line crosses gridlines cleanly, not data dots.

### Residuals

A **residual** is actual value − predicted value.

- Dot above the line: positive residual, so the model *underestimated*.
- Dot below the line: negative residual, so the model *overestimated*.
- Dot on the line: residual 0.

### Exponential models: `y = a·bˣ`

| Part | Meaning in context |
|---|---|
| a | starting value (y when x = 0) |
| b greater than 1 | growth of (b − 1) × 100% per step |
| b between 0 and 1 | decay of (1 − b) × 100% per step |

For example, b = 1.2 means +20% per step, and b = 0.85 means −15% per step.

### Linear or exponential?

Linear adds the same **amount** each step; exponential multiplies by the same factor each step.

| If y changes by… | the model is… |
|---|---|
| same amount (+30, +30, +30) | linear |
| same percent or factor (×1.5, ×1.5) | exponential |

- On a scatterplot, a straight band of dots is linear.
- A curve that gets steeper (growth) or flattens out toward zero (decay) is exponential.
- A U or upside-down U shape is quadratic.
- In the long run, a growing exponential always overtakes a growing linear model, even if it starts below it.

### Describing the trend

- **Positive association:** y tends to go up as x goes up. Negative: y tends to go down.
- Strong: dots hug the line. Weak: dots are loosely scattered.
- A trend can be negative *and* strong.

## Worked examples

### Example 1: Interpreting the slope

A dealership models the value of a certain used car with `y = −1,850x + 24,300`, where y is the predicted value, in dollars, of a car that is x years old, for cars between 1 and 10 years old. Which is the best interpretation of 1,850 in this context?

- (A) The predicted value of a brand-new car is $1,850.
- (B) For each additional year of age, the predicted value of the car decreases by $1,850.
- (C) Every car of this type loses exactly $1,850 in value each year.
- (D) For each additional year of age, the predicted value of the car increases by $1,850.

**Solution**

1,850 sits with x, so it's part of the slope: −1,850 dollars per year. The minus sign means the value goes *down* as age goes up. So the predicted value drops by $1,850 for each extra year.

(A) describes the intercept, and the intercept is 24,300, not 1,850. (C) is too strong: the model predicts a trend, it doesn't promise that every single car loses exactly that much. (D) ignores the negative sign.

**Answer:** (B)

### Example 2: Actual vs. predicted

A teacher recorded the hours five students studied and their test scores. The line of best fit for the data is `y = 4.5x + 54`, where y is the predicted score and x is the hours studied.

| Hours studied | Test score |
|---|---|
| 2 | 63 |
| 3 | 67 |
| 5 | 76 |
| 6 | 85 |
| 8 | 88 |

For the student who studied 6 hours, how many points greater is the actual score than the score predicted by the line of best fit?

- (A) −4
- (B) 4
- (C) 27
- (D) 81

**Solution**

Predicted score at x = 6: 4.5(6) + 54 = 27 + 54 = 81. Actual score from the table: 85. Actual − predicted = 85 − 81 = 4.

(A) is predicted − actual, the subtraction done backwards. The question asks how much *greater* the actual score is, which is a positive 4. (C) is just 4.5 × 6, forgetting the intercept. (D) is the predicted score itself, not the difference.

**Answer:** (B)

> **Tip:** If you ran your own regression in Desmos here, you'd get about `y = 4.46x + 54.37`, which is close but not the same. When the question *gives* you the line of best fit, always use the given equation.

### Example 3: Linear or exponential?

The table shows the number of members, y, in a hiking club x years after it started.

| Years, x | Members, y |
|---|---|
| 0 | 500 |
| 1 | 600 |
| 2 | 720 |
| 3 | 864 |

Which equation models this relationship?

- (A) `y = 500 + 100x`
- (B) `y = 500(1.2)ˣ`
- (C) `y = 600(1.2)ˣ`
- (D) `y = 500(0.2)ˣ`

**Solution**

Check the differences: 100, then 120, then 144. They're not constant, so it isn't linear. Check the ratios: 600/500 = 1.2, 720/600 = 1.2, 864/720 = 1.2. The same factor every year means exponential, with b = 1.2. The starting value (x = 0) is 500, so `y = 500(1.2)ˣ`.

(A) only matches the first step; at x = 2 it gives 700, not 720. (C) uses the year-1 value as the start, giving 600 at x = 0. (D) uses the 20% rate (0.2) instead of the growth factor (1.2), which would make the club shrink.

**Answer:** (B)

### Example 4: Choosing the line of best fit

The table shows six data points from a scatterplot.

| x | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| y | 9.8 | 8.1 | 7.2 | 5.9 | 4.6 | 3.1 |

Which equation best models the data?

- (A) `y = −1.3x + 11`
- (B) `y = 1.3x + 11`
- (C) `y = −1.3x + 3`
- (D) `y = −0.5x + 11`

**Solution**

*By reasoning:* y falls as x rises, so the slope is negative. That removes (B). At x = 1 the data is near 10, so the y-intercept (one step back, at x = 0) should be a little above 10, around 11. That removes (C). From x = 1 to x = 6, y drops from 9.8 to 3.1, about 6.7 over 5 steps, or roughly −1.3 per step. That removes (D), whose slope is far too gentle.

*By Desmos:* enter the table and type `y1 ~ mx1 + b`. Desmos gives m ≈ −1.29 and b ≈ 10.98, which matches (A).

**Answer:** (A)

## Traps to avoid

- **Reading a dot instead of the line.** "Predicted" means use the line or equation. "Actual" or "observed" means use the dot.
- **Backwards residuals.** Residual = actual − predicted, so a dot above the line has a positive residual.
- **Mixing up slope and intercept.** The number multiplied by x is a rate. The constant is the x = 0 value.
- **Dropping the sign.** A negative slope means "decreases by," not "increases by."
- **Overconfident wording.** Models predict; they don't guarantee. Choices saying "exactly," "every" or "always" about individuals are usually wrong.
- **Misreading the scale.** If each gridline is 5 units, a line that rises 2 boxes rose 10, not 2.
- **Rate vs. factor in exponentials.** 20% growth means multiply by 1.2, not 0.2. 15% decay means multiply by 0.85, not 0.15.
- **Trusting predictions far outside the data.** The trend might not continue there. An intercept at x = 0 can be meaningless if the data starts at x = 20.

## Desmos shortcut

Desmos can find the best-fit equation for you, the safest method when answer choices are close. But if the question already gives you the line of best fit, use that one: your own regression is for *choosing* a model, not replacing one you were handed.

1. Click **+** and choose **table**. Type the x-values in the x₁ column and the y-values in the y₁ column.
2. On a new line, type a regression with `~` (the tilde) instead of `=`, using one of the forms below. Desmos turns `x1` into x₁ automatically.
3. Read off m and b (or a and b) and r² (shown as R² for curved models). The closer it is to 1, the better the fit, so when comparing a linear and an exponential fit, the larger r² wins.
4. Use the values Desmos found like numbers. For a prediction at x = 12, type `12m + b`.

Regressions to type:

- Linear: `y1 ~ mx1 + b`
- Exponential: `y1 ~ ab^x1`
- Quadratic: `y1 ~ ax1^2 + bx1 + c`

Other quick moves:

- **Test answer choices.** Graph each choice over the table's points. The right one runs through the middle of the dots, with some above and some below.
- **Residuals.** Type the given model, like `f(x) = 4.5x + 54`, then `85 - f(6)` gives the residual in one line.
- **Use x₁ and y₁, not plain x and y.** `y ~ mx + b` won't fit the table.

## Quick checklist

- Did I read both axis labels, units and the gridline scale?
- Is the trend positive or negative, straight or curved?
- Does the question want a predicted value (line) or an actual value (dot)?
- For a residual, did I compute actual − predicted?
- For interpretation, did I match the number to slope (rate) or intercept (start) and keep its sign?
- For exponentials, is b the growth factor (1 + rate) and a the value at x = 0?
