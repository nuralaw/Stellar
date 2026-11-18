---
title: Two-Variable Data and Scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Read a line of best fit, predict with it, and explain what it means.
---

# Predict with the line
Read two points. Find the equation. Put x in.

## Read the line

**Line of best fit**: a straight line close to the dots. Read two points on it.

```visual
two-var-data--predict
```

```example
The line of best fit passes through (0, 20) and (10, 50). Predict y at x = 6.
1. Intercept: 20 :: The line's y at x = 0.
2. Slope: (50 − 20)/(10 − 0) = 3 :: Rise ÷ run, from two points.
3. y = 3x + 20 :: Slope times x, plus intercept.
4. y = 3(6) + 20 = 38 :: Put x = 6 in.
```

```more
**Line of best fit**: one straight line that follows the dots. Read two points where it crosses grid corners. **Rise** = how far up. **Run** = how far right. **Slope** = rise ÷ run. **Intercept**: y where the line crosses the y-axis. **Predicted** y is the line's y, not a dot's y.
```

## Predict it yourself

```quiz
A line of best fit passes through (0, 50) and (20, 20). What y does it predict at x = 12?
answer: 32
- 68 :: The line goes down, so the slope is negative.
- 20 :: That is y at x = 20. Use x = 12.
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

**Slope**: the change in y for 1 more x. **Intercept**: the predicted y when x = 0.

```visual
two-var-data--slope
```

```example
y = 2.5x + 30 predicts a plant's height y, in cm, x weeks after planting. What do 2.5 and 30 mean?
1. 2.5 multiplies x: slope :: Change in height each week.
2. 30 stands alone: intercept :: Height at week 0.
3. It grows 2.5 cm per week, starting at 30 cm
```

```more
Slope units are "y units per x unit": here cm per week. On the graph, go 4 weeks right and the line goes 10 cm up: 10 ÷ 4 = 2.5. The intercept is where the line meets the y-axis, at week 0.
```

## Name the number

```quiz
y = 420 − 12.5x estimates a used phone's price y, in dollars, x months after its release. What does 12.5 mean?
* Each month, the estimated price drops by $12.50.
- The estimated price at release is $12.50. :: That is the intercept, 420: the price at x = 0.
- Each month, the estimated price drops by 12.5%. :: A line changes by a fixed amount, not a percent.
> 12.5 multiplies x, so it is the slope: −$12.50 for each extra month.
```

# Describe the dots
Direction, strength and shape of the dots.

## Association words

**Association**: how y changes as x changes. Positive: both rise. Negative: y falls. Strong: close to a curve or line. Weak: spread out.

```visual
two-var-data--association
```

```more
When the dots follow a line, the association is **linear**. When they follow a curve, it is **nonlinear**, and a line is a poor model. **Strong** means the dots stay close to the line or curve. **Weak** means they are far from it.
```

## Describe it yourself

```quiz
As x increases, y decreases. The dots lie very close to a straight line. Which describes the association?
- Weak, negative :: Dots close to a line mean strong, not weak.
- Strong, positive :: y decreases as x increases. That is negative.
* Strong, negative
> y falls as x rises: negative. The dots hug a line: strong.
```

# Line or curve
Add the same: line. Multiply by the same: exponential.

## Pick the model

Same amount added: linear. Same factor multiplied: exponential, y = a(b)^x. Rises, then falls: quadratic.

```visual
two-var-data--curve
```

```example
x = 0, 1, 2, 3 gives y = 5, 10, 20, 40. Find the model.
1. Steps: +5, +10, +20 :: Not the same amount: not linear.
2. 10/5 = 20/10 = 40/20 = 2 :: Same factor: exponential, b = 2.
3. y = 5(2)^x :: a = 5, the y at x = 0.
```

```more
**Exponential**: y = a(b)^x. Each step to the right multiplies y by b. a is y at x = 0. A **quadratic** model y = ax² + bx + c is a parabola, a U-shaped curve. With a < 0 it opens down: it rises, peaks, then falls.
```

## Pick the numbers

```quiz
x = 0, 1, 2, 3 gives y = 80, 120, 180, 270. Which equation models the data?
- y = 80 + 40x :: The steps grow (40, 60, 90), so it is not linear.
- y = 80(0.5)^x :: 0.5 is the growth rate. The factor is 1.5.
* y = 80(1.5)^x
> Each y is 1.5 times the one before, and y = 80 at x = 0.
~ table x_1: 0, 1, 2, 3; y_1: 80, 120, 180, 270 :: Enter the data as a table.
~ zoom -1 4 0 300
~ type y=80+40x :: The line misses the last two dots.
~ type y=80(1.5)^{x} :: This curve passes through every dot.
~ point (3, 270) :: Even the last dot fits: 80(1.5)³ = 270.
```

## Pick the shape

```quiz
A ball is thrown up. Its height is measured every half second. The dots rise, reach a peak, then fall. Which model fits best?
- A linear model :: A line only rises or only falls. These dots turn around.
- An exponential model :: Exponential dots rise or fall faster and faster. They never turn.
* A quadratic model (a parabola opening down)
> A curve that rises, peaks and falls is a parabola opening down.
```

# Scaled data
Every y times k? Slope and intercept times k.

## Scale the whole line

Every y multiplied by k? Multiply the slope and the intercept by k.

```visual
two-var-data--scale
```

```example
A line of best fit is y = 2x + 10. Every y-value is doubled. Find the new line.
1. y = 2(2x + 10) :: Double the whole right side.
2. y = 4x + 20 :: Slope and intercept both double.
```

```more
Each dot moves straight up to twice its height, so the line moves with it. At x = 0 the line goes from y = 10 to y = 20. For every 1 step right, it now rises 4 instead of 2.
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

A dot is an **actual** value. The line gives the **predicted** value. Gap = actual − predicted.

```visual
two-var-data--gap
```

```example
A line of best fit is y = 3x + 12. One data point is (8, 40). How far is the dot above the line?
1. Predicted: 3(8) + 12 = 36 :: From the line.
2. Actual: 40 :: From the dot.
3. Gap: 40 − 36 = 4 above :: Actual minus predicted.
```

```more
A dot is one real measurement. The line is a model: it gives one predicted y for each x. A dot above the line has a positive gap. A dot below has a negative gap. Always read the line's y first.
```

## Find the gap

```quiz
The equation y = 4x + 25 is the line of best fit for the number of visitors, y, to a museum on day x of an exhibit. On day 10, there were 61 visitors. How many fewer visitors came on day 10 than the line predicts?
answer: 4
- 65 :: That is the predicted number. The question asks for the gap.
- 61 :: That is the actual number of visitors. Find the gap.
> Predicted: 4(10) + 25 = 65. Actual: 61. The gap is 65 − 61 = 4.
~ type y=4x+25 :: Type the line.
~ type (10,61) :: The actual dot is below the line.
~ zoom -2 14 -5 80
~ point (10, 65) :: On the line at x = 10: y = 65.
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
