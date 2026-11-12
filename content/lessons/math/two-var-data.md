---
title: Two-Variable Data and Scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Use a line of best fit to predict, explain its slope and intercept in context, and tell linear data from exponential data.
---

## Spot a scatterplot question

A **scatterplot** shows one dot per pair of values (x, y), often with a line or curve of best fit through the middle. Sometimes the data comes as a table instead. You'll predict a value, explain a number in the model, or pick the model.

First read the axes: what x and y measure, their units, and what one gridline is worth.

Dots that rise to the right show a **positive** association; dots that fall show a **negative** one.

```quiz
A scatterplot shows the age x, in years, and the price y, in dollars, of 30 used bikes. The dots fall from left to right. Which statement is best supported?
* Older bikes tend to have lower prices.
- Every older bike costs less than every newer bike. :: A trend says what tends to happen. It makes no promise about every single bike.
- Newer bikes tend to have lower prices. :: Read it the other way round: as age (x) goes up, price (y) goes down.
> Falling dots mean a negative association: as x (age) goes up, y (price) tends to go down. *Tends to* matters, because a trend doesn't cover every single bike.
```

## Line predicts, dot is actual

The line, or its equation, gives **predicted** values. A dot is an **actual** value.

- To predict at some x, put x into the equation, or read the line at that x.
- Residual = actual − predicted.
- A dot above the line has actual > predicted, so its residual is positive.

```quiz
A line of best fit for a data set is y = 3x + 12. One data point is (8, 40). How much greater is the actual y-value than the predicted y-value at x = 8?
- −4 :: That's predicted − actual. *How much greater is the actual* means actual − predicted.
- 36 :: That's the predicted value itself. Subtract it from the actual value.
- 16 :: You left out the + 12. The predicted value is 3(8) + 12 = 36.
* 4
> Predicted: 3(8) + 12 = 36. Actual: 40.
> Actual − predicted = 40 − 36 = 4. The dot sits 4 units above the line.
```

## Read the line's equation

To get a line's equation from a graph:

1. **Sign:** a line that falls to the right has a negative slope.
2. **Slope:** pick two points **on the line** (not data dots), best where it passes through a grid corner. Slope = rise ÷ run.
3. **Intercept:** where the line crosses the y-axis, at x = 0.

A good line of best fit has dots both above and below it.

```quiz
A line of best fit passes through about (0, 50) and (20, 20). Which equation best represents it?
* y = −1.5x + 50
- y = 1.5x + 50 :: The line falls from 50 to 20, so its slope is negative.
- y = −1.5x + 20 :: 20 is the y-value at x = 20. The intercept is the value at x = 0.
- y = −0.67x + 50 :: That's run ÷ rise (20 ÷ 30). Slope is rise ÷ run: −30 ÷ 20.
> Slope: (20 − 50) ÷ (20 − 0) = −30 ÷ 20 = −1.5. The line crosses the y-axis at 50, so y = −1.5x + 50.
```

## Slope and intercept in context

The slope is the number **multiplied by x**, even when the SAT writes y = a + bx.

| Part | Meaning |
|---|---|
| slope | predicted change in y for each 1 more x |
| intercept | predicted y when x = 0 |

Say it as a sentence with units: "for each additional hour, the predicted score rises by 4 points". Keep *predicted*: a model describes a trend, not every case.

```quiz
A store uses y = 420 − 12.5x to estimate the price y, in dollars, of a used phone x months after its release. What is the best interpretation of 12.5?
- The estimated price at release is $12.50. :: That's the intercept's job, and the intercept here is 420.
* Each month after release, the estimated price drops by $12.50.
- Each month, every phone of this type loses exactly $12.50. :: A model estimates the trend. It can't promise *every* phone or *exactly*.
- Each month, the estimated price drops by 12.5%. :: A linear model changes by a fixed amount. A fixed percent belongs to an exponential model.
> 12.5 is multiplied by x, so it belongs to the slope: −12.5 dollars per month. The minus sign means the estimate falls by $12.50 for each extra month.
> The intercept, 420, is the estimated price at release (x = 0).
```

## Linear or exponential?

Check how y changes each time x goes up by 1.

| Pattern | Model |
|---|---|
| same amount added | linear, y = mx + b |
| same factor multiplied | exponential, y = a(b)^x |

In y = a(b)^x, a is the value at x = 0 and b is the factor: growth of 6% per step is b = 1.06.

```quiz
In a table, x = 0, 1, 2, 3 gives y = 80, 120, 180, 270. Which equation models the data?
- y = 80 + 40x :: That fits only the first step. The differences grow (40, 60, 90), so the data isn't linear.
* y = 80(1.5)^x
- y = 120(1.5)^x :: 120 is y at x = 1. The starting value a is y at x = 0.
- y = 80(0.5)^x :: 0.5 is the growth rate. The factor is 1 + 0.5 = 1.5; a factor of 0.5 would halve y each step.
> Differences: 40, 60, 90, not equal, so it isn't linear. Ratios: 120 ÷ 80, 180 ÷ 120 and 270 ÷ 180 all equal 1.5, so it's exponential with b = 1.5.
> At x = 0, y = 80, so a = 80.
```

## Let Desmos fit the line

Data in a table and close answer choices? Run a regression.

1. Click **+**, choose **table**, and type the x-values under x₁ and the y-values under y₁.
2. On a new line, type `y1~mx1+b` (on a US keyboard, ~ is Shift plus the key left of 1). Desmos turns each 1 into a subscript by itself. Don't type `_`: it traps the ~ in the subscript, and Desmos shows an error.
3. Read m and b, then pick the closest choice.

For an exponential model, type `y1~ab^x1`.

```quiz
Your data is in a Desmos table with columns x₁ and y₁. Which line makes Desmos fit a line of best fit to it?
* `y1~mx1+b`
- `y1=mx1+b` :: With an equals sign, Desmos doesn't fit anything. The tilde is what tells it to find the best m and b.
- `y~mx+b` :: Plain x and y aren't the table's columns, so Desmos has no data to fit. Use x1 and y1.
> The tilde means "fit this model to the data", and x1 and y1 point Desmos at the table columns. It then shows the best m and b.
```

## When every data point changes

If every y-value is changed the same way, do the same to the line.

| Change to every y | y = mx + b becomes |
|---|---|
| multiply by k | y = (km)x + kb |
| add k | y = mx + (b + k) |

Multiplying stretches the whole line, so the slope **and** the intercept are both multiplied.

```quiz
For data set A, a line of best fit is y = 6x + 40. Data set B is made by multiplying every y-value in A by 1.5. Which could be a line of best fit for B?
- y = 6x + 60 :: You scaled only the intercept. Every point of the line is multiplied by 1.5, so the slope is too.
- y = 9x + 40 :: You scaled only the slope. The y-value at x = 0 is multiplied too: 40 × 1.5.
* y = 9x + 60
- y = 7.5x + 41.5 :: You added 1.5 to both numbers. The y-values were multiplied by 1.5, not increased by it.
> Multiply the whole equation by 1.5: y = 1.5(6x + 40) = 9x + 60.
```

## Trap: first row isn't the intercept

> **Trap:** The y-intercept is the predicted y when x = 0. If a table starts at x = 1, its first y-value is not the intercept.

A club had y members x years after 2020.

| x | y |
|---|---|
| 1 | 46 |
| 2 | 52 |
| 3 | 58 |
| 4 | 64 |

```quiz
Which equation models the number of members?
- y = 6x + 46 :: 46 is y at x = 1. The intercept is y at x = 0, one step back: 46 − 6.
* y = 6x + 40
- y = 40x + 6 :: Swapped. The slope, 6 members per year, is the number multiplied by x.
> y goes up 6 each year, so the slope is 6. One step back from x = 1 to x = 0 gives 46 − 6 = 40.
> Check: 6(4) + 40 = 64.
```

## Your turn: easy

A predicted value comes from the model: put x into the equation.

```check
m-1079
```

## Your turn: medium

Get the slope from two points on the line, then say it as a "for each" sentence.

```check
m-1327
```

## Your turn: hard

Read the line's slope and intercept from the graph, then do to the line what was done to the data.

```check
m-1236
```

## Recap

- Read the axes: what x and y measure, and what one gridline is worth.
- The line gives predicted values; dots are actual. Residual = actual − predicted.
- Slope, the number times x: the predicted change in y for each 1 more x. Intercept: the predicted y at x = 0.
- Equal differences: linear. Equal ratios: exponential, y = a(b)^x.
- Data changed? Do the same to the line: multiplying y scales slope and intercept; adding to y moves only the intercept.
- Table and close choices: run `y1~mx1+b` in Desmos.
