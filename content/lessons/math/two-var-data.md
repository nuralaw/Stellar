---
title: Two-Variable Data and Scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Turn a line of best fit into an equation, then predict and explain with it.
---

# Predict with the line
Two points give the equation. Put x in.

## The line predicts

A **line of best fit** runs through the middle of the dots. Put x in to get the **predicted** y.

```example
A line of best fit passes through (0, 20) and (10, 50). Predict y at x = 6.
1. Intercept: 20 :: The line's y at x = 0.
2. Slope: (50 − 20)/(10 − 0) = 3 :: Rise ÷ run, two points on the line.
3. y = 3x + 20 :: Slope times x, plus intercept.
4. y = 3(6) + 20 = 38 :: Put x = 6 in.
```

## Predict it yourself

```quiz
A line of best fit passes through (0, 50) and (20, 20). What y does it predict at x = 12?
- 68 :: The line falls from 50 to 20: the slope is negative.
* 32
- 2 :: 20 is y at x = 20. The intercept is 50.
> Slope: (20 − 50)/20 = −1.5. So y = −1.5(12) + 50 = 32.
~ table x_1: 0, 20; y_1: 50, 20 :: Enter the two points on the line.
~ type y_{1}\sim mx_{1}+b :: Desmos finds the line: m = −1.5, b = 50.
~ type x=12 :: A vertical line at x = 12.
~ zoom -3 25 -5 60
~ point (12, 32) :: Click the crossing: y = 32.
```

# Slope and intercept
Slope is "for each". Intercept is the start.

## What the numbers mean

**Slope**: the predicted change in y for each 1 more x. **Intercept**: the predicted y at x = 0.

```example
y = 2.5x + 30 predicts a plant's height y, in cm, x weeks after planting. What do 2.5 and 30 mean?
1. 2.5 multiplies x: slope :: The change each week.
2. 30 stands alone: intercept :: The height at week 0.
3. It grows 2.5 cm per week, starting at 30 cm
```

## Name the number

```quiz
y = 420 − 12.5x estimates a used phone's price y, in dollars, x months after its release. What does 12.5 mean?
* Each month, the estimated price drops by $12.50.
- The estimated price at release is $12.50. :: That's the intercept, 420: the price at x = 0.
- Each month, the estimated price drops by 12.5%. :: A line changes by a fixed amount, not a percent.
> 12.5 multiplies x, so it's the slope: −$12.50 for each extra month.
```

# Line or curve
Same amount added: line. Same factor: exponential.

## Check the ratio

Same amount added each step: linear. Same factor multiplied: exponential, **y = a(b)^x**, where a is y at x = 0.

```example
x = 0, 1, 2, 3 gives y = 5, 10, 20, 40. Find the model.
1. Steps: +5, +10, +20 :: Not the same amount: not linear.
2. 10/5 = 20/10 = 40/20 = 2 :: Same factor: exponential, b = 2.
3. y = 5(2)^x :: a = 5, the y at x = 0.
```

## Pick the model

```quiz
x = 0, 1, 2, 3 gives y = 80, 120, 180, 270. Which equation models the data?
- y = 80 + 40x :: The steps grow (40, 60, 90), so it isn't linear.
- y = 80(0.5)^x :: 0.5 is the growth rate. The factor is 1.5.
* y = 80(1.5)^x
> Each y is 1.5 times the one before, and y = 80 at x = 0.
~ table x_1: 0, 1, 2, 3; y_1: 80, 120, 180, 270 :: Enter the data as a table.
~ zoom -1 4 0 300
~ type y=80+40x :: The line misses the last two dots.
~ type y=80(1.5)^{x} :: This curve passes through every dot.
~ point (3, 270) :: Even the last dot fits: 80(1.5)³ = 270.
```

# Scaled data
Multiply every y by k: scale slope and intercept.

## Scale the whole line

Every y multiplied by k? Multiply the slope and the intercept by k.

```example
A line of best fit is y = 2x + 10. Every y-value in the data is doubled. Find the new line.
1. y = 2(2x + 10) :: Double the whole right side.
2. y = 4x + 20 :: Slope and intercept both double.
```

## Scale it yourself

```quiz
A line of best fit for data set A is y = 6x + 40. Data set B multiplies every y-value in A by 1.5. Which could be a line of best fit for B?
* y = 9x + 60
- y = 6x + 60 :: You scaled only the intercept. Scale the slope too.
- y = 9x + 40 :: You scaled only the slope. Scale the intercept too.
> Multiply the whole right side: 1.5(6x + 40) = 9x + 60.
~ type y=1.5(6x+40) :: Type 1.5 times the whole line. No algebra.
~ type y=9x+60 :: This choice lands exactly on top: same line.
~ zoom -10 10 -20 130
~ point (0, 60) :: Both cross the y-axis at 60.
```

# Trap: dot or line
A dot is actual. The line predicts.

## Actual vs predicted

A dot is an **actual** value. Predictions come from the line.

```example
A line of best fit is y = 2x + 5. One data point is (10, 31). How far above the prediction is the dot?
1. Predicted: 2(10) + 5 = 25 :: From the line.
2. Actual: 31 :: From the dot.
3. 31 − 25 = 6 above :: Actual minus predicted.
```

## Dodge the trap

```quiz
A line of best fit is y = 3x + 12. One data point is (8, 40). What y does the line predict at x = 8?
* 36
- 40 :: Trap: 40 is the actual dot, not the line.
- 4 :: That's the gap, 40 − 36. The prediction is 36.
> Predicted: 3(8) + 12 = 36. The dot sits 4 above the line.
~ type y=3x+12 :: Type the line.
~ type (8,40) :: The actual dot sits above the line.
~ zoom -2 14 -5 60
~ point (8, 36) :: On the line at x = 8: y = 36.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Predicted value: put x into the equation.

```check
m-1079
```

## Your turn: medium

Find the slope from two points on the line.

```check
m-1327
```

## Your turn: hard

Read the line's equation first, then scale it.

```check
m-1236
```
