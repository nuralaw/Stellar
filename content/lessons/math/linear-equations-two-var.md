---
title: Linear Equations in Two Variables
skill: linear-equations-two-var
domain: algebra
section: math
summary: Read slope and intercepts from any form of a line, use parallel and perpendicular slopes, and read Ax + By = C in a story.
---

## Spot it: two letters, one line

Equations like y = 3x − 5 or 4x + 7y = 140 have **two letters**, each to the first power. A *solution* is a pair (x, y) that makes the equation true. All the solutions together form a straight line.

To test a point, put its x and its y into the equation. In (x, y), x always comes first.

```quiz
Which point lies on the line 3x + 2y = 12?
* (2, 3)
- (3, 2) :: You swapped x and y. For (3, 2): 3(3) + 2(2) = 13, not 12.
- (0, 4) :: With x = 0, 2y = 12, so y = 6. You divided 12 by 3, the x-coefficient.
> Put x = 2 and y = 3 in: 3(2) + 2(3) = 6 + 6 = 12. True, so (2, 3) is on the line.
```

## Find the slope: get y alone

In **y = mx + b**, m is the slope and b is the y-intercept.

In **standard form**, Ax + By = C, the number in front of x is **not** the slope. Solve for y, or use the shortcut:

slope = −A/B, y-intercept = C/B

Example: 6x + 3y = 9 becomes 3y = −6x + 9, so y = −2x + 3. The shortcut agrees: −6/3 = −2.

```quiz
What is the slope of the line 3x + 4y = 20?
* −3/4
- 3 :: That's the x-coefficient. It is the slope only when y is alone.
- 3/4 :: Moving 3x across makes it −3x: 4y = −3x + 20.
- −4/3 :: Upside down. The slope is −A/B, with the x-coefficient on top.
> Solve for y: 4y = −3x + 20, so y = −(3/4)x + 5. The slope is −3/4.
> Shortcut: −A/B = −3/4.
```

## Intercepts: set the other to 0

- **x-intercept:** the line crosses the x-axis, so **y = 0**.
- **y-intercept:** the line crosses the y-axis, so **x = 0**.

In standard form, just cover the other term. In 3x + 5y = 30, x = 0 leaves 5y = 30, so the y-intercept is (0, 6).

> **Tip:** Ugly numbers? Type the equation into Desmos as given, like `3x+5y=30`, and click the line. Gray dots appear at both intercepts. Click one to see its coordinates.

```quiz
The line 2x − 5y = 20 crosses the x-axis at (a, 0). What is the value of a?
* 10
- −4 :: That's where it crosses the y-axis. For the x-axis, set y = 0.
- 4 :: Setting y = 0 removes the −5y term. You divided 20 by 5 instead of by 2.
> On the x-axis, y = 0: 2a − 5(0) = 20, so 2a = 20 and a = 10.
> The y-intercept is different: x = 0 gives −5y = 20, so y = −4.
```

## Line through two points

1. **Slope** from the two points: m = (y_2 − y_1)/(x_2 − x_1).
2. **Point-slope form** with either point: y − y_1 = m(x − x_1).
3. Simplify to match the choices.

Watch the signs. With the point (−1, 5), x − (−1) becomes **x + 1**.

```quiz
A line passes through (−1, 5) and (3, −3). What is the y-intercept of the line?
* 3
- 7 :: Sign slip: x − (−1) is x + 1, not x − 1.
- 4.5 :: Your slope is upside down. Rise over run is −8/4 = −2.
- 5 :: 5 is the y-value at x = −1. The y-intercept needs x = 0.
> Slope: (−3 − 5)/(3 − (−1)) = −8/4 = −2.
> Point-slope form with (−1, 5): y − 5 = −2(x + 1), so y = −2x − 2 + 5 = −2x + 3.
> The y-intercept is 3. Check (3, −3): −2(3) + 3 = −3.
```

## Parallel and perpendicular

- **Parallel** lines have the **same slope**.
- **Perpendicular** slopes are *negative reciprocals*: flip the fraction and change the sign. 2/3 becomes −3/2, and 4 becomes −1/4. The two slopes multiply to −1.

Often every choice passes through the given point. Then only the slope decides.

```quiz
Line k is parallel to the line 4x − 2y = 7 and passes through (1, 5). Which equation defines line k?
* y = 2x + 3
- y = −2x + 7 :: Lost a sign: −A/B = −4/(−2) = 2, which is positive.
- y = 4x + 1 :: 4 is the x-coefficient, not the slope. Solve for y first.
- y = −(1/2)x + 5.5 :: That's the perpendicular slope. Parallel lines share the slope 2.
> Slope of 4x − 2y = 7: −A/B = −4/(−2) = 2. Line k is parallel, so its slope is 2 too.
> Through (1, 5): 5 = 2(1) + b, so b = 3.
> All four choices pass through (1, 5). Only the slope picks the answer.
```

## Stories: Ax + By = C

Two items share one total. A club sells x T-shirts at $8 and y hats at $5 and takes in $200: 8x + 5y = 200.

| Part | Meaning |
|---|---|
| 8 | price of one T-shirt |
| 8x | money from all T-shirts |
| 200 | total money |

An intercept means **none of the other item**. Given one amount, substitute it and solve for the other.

```quiz
In 8x + 5y = 200, x is the number of T-shirts and y is the number of hats sold. What is the best interpretation of the y-intercept?
* 40 hats and no T-shirts were sold.
- 25 T-shirts and no hats were sold. :: That's the x-intercept, where y = 0. The y-intercept has x = 0.
- 25 hats and no T-shirts were sold. :: With x = 0, 5y = 200. You divided by 8, the T-shirt price.
- Each hat costs $40. :: 40 is a number of hats. Each hat costs $5.
> The y-intercept has x = 0: no T-shirts. Then 5y = 200, so y = 40.
> The point (0, 40) means 40 hats and no T-shirts bring in $200.
```

## Solve for one letter

Some questions give a formula and ask for one letter "in terms of" the others. Use the same moves as for x: distribute, move the other terms across, then divide. Treat the other letters like numbers.

```quiz
5a = 2(b + c). Which equation expresses b in terms of a and c?
* b = 5a/2 − c
- b = 5a/2 + c :: To undo + c, subtract c from both sides.
- b = (5a − c)/2 :: The 2 multiplies c too: 2(b + c) = 2b + 2c.
- b = 10a − c :: To undo × 2, divide by 2. You multiplied.
> Distribute: 5a = 2b + 2c. Subtract 2c: 5a − 2c = 2b.
> Divide by 2: b = (5a − 2c)/2, which is 5a/2 − c.
> Faster: divide by 2 first, so b + c = 5a/2, then subtract c.
```

## Trap: flip and change the sign

A perpendicular slope needs **both** moves. Doing only one gives a wrong answer that is usually among the choices.

```quiz
Line k is perpendicular to the line 3x + 2y = 8. What is the slope of line k?
* 2/3
- −1/3 :: 3 is the x-coefficient, not the slope. In standard form the slope is −A/B = −3/2.
- 3/2 :: Trap: you changed the sign of −3/2 but didn't flip it.
- −2/3 :: Trap: you flipped −3/2 but kept the sign. Perpendicular slopes have opposite signs.
> Slope of 3x + 2y = 8: −A/B = −3/2.
> Flip it and change the sign: 2/3. Check: (−3/2) × (2/3) = −1.
```

## Your turn: easy

Standard form: use −A/B, or solve for y.

```check
m-0718
```

## Your turn: medium

Set y = 0 for one intercept and x = 0 for the other.

```check
m-0812
```

## Your turn: hard

Find the slope of line s, take its negative reciprocal, then use the slope formula.

```check
m-15640
```

## Recap

- Test a point by putting both coordinates into the equation.
- Standard form Ax + By = C: the slope is −A/B, or solve for y.
- x-intercept: set y = 0. y-intercept: set x = 0.
- Two points: slope first, then y − y_1 = m(x − x_1).
- Parallel: same slope. Perpendicular: flip and change the sign.
- In a story, a coefficient is a price per item and the constant is the total.
