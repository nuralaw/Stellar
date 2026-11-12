---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratics and line-parabola systems, and count their solutions.
---

# Factor to zero
Get 0 on one side, then factor.

## Make it equal 0

**Get 0 on one side, then factor.** Each factor gives a solution.

```example
x² + 2x = 15. Find the solutions.
1. x² + 2x − 15 = 0 :: Move 15 over.
2. (x + 5)(x − 3) = 0 :: Factor.
3. x = −5 or x = 3 :: Set each factor equal to 0.
```

## Factor it yourself

```quiz
x² = 5x + 14. What are the solutions?
* x = 7 or x = −2
- x = −7 or x = 2 :: Signs flipped: x − 7 = 0 gives x = 7.
- x = 14 or x = 19 :: You factored without 0 on one side.
> x² − 5x − 14 = 0 factors as (x − 7)(x + 2) = 0.
~ type y=x^{2}-5x-14 :: Move everything to one side. Graph it as y.
~ zoom -6 11 -25 15
~ point (-2, 0) :: Solutions are where the graph crosses the x-axis.
~ point (7, 0) :: x = −2 or x = 7.
```

# Square roots keep ±
A square has two roots: + and −.

## A square hides ±

Square-root both sides and keep **both signs**.

```example
(x − 1)² = 25. Find the solutions.
1. x − 1 = 5 or x − 1 = −5 :: Root both sides: ±5.
2. x = 6 or x = −4 :: Add 1 to each.
```

## Keep both signs

```quiz
(x + 4)² = 36. What is the sum of the solutions?
- 2 :: You kept only +6. The root is ±6.
* −8
- −10 :: That's one solution. Add both.
> x + 4 = 6 or −6, so x = 2 or x = −10. Sum: −8.
~ type y=(x+4)^{2} :: Graph each side as its own y.
~ type y=36
~ zoom -14 6 -5 45
~ point (-10, 36) :: Two crossings, so two solutions.
~ point (2, 36) :: −10 + 2 = −8.
```

# Count the solutions
b² − 4ac: positive two, zero one, negative none.

## Count with b² − 4ac

For ax² + bx + c = 0, find **b² − 4ac**. Positive: two real solutions. Zero: one. Negative: none.

```example
How many real solutions does x² − 6x + 9 = 0 have?
1. a = 1, b = −6, c = 9 :: Read a, b and c.
2. (−6)² − 4(1)(9) = 0 :: Compute b² − 4ac.
3. Exactly one :: Zero means one solution.
```

## Count them yourself

```quiz
How many real solutions does 2x² − 3x + 5 = 0 have?
- Exactly one :: That needs b² − 4ac = 0.
- Two :: Sign slip: −4(2)(5) is −40, not +40.
* None
> b² − 4ac = 9 − 40 = −31. Negative, so no real solutions.
~ type y=2x^{2}-3x+5 :: Graph the left side as y.
~ zoom -4 5 -2 12
~ point (0.75, 3.875) :: The lowest point is above the x-axis.
~ say :: The graph never reaches y = 0: no solutions.
```

# Line meets parabola
Each crossing is a solution. One touch, one solution.

## Crossings are solutions

Set the two y's equal and solve, or graph both. Each crossing is a solution (x, y).

```desmos
y = x² and y = x + 2. Find the solutions (x, y).
type y=x^{2} :: Type both equations.
type y=x+2
point (2, 4) :: Click each crossing.
point (-1, 1) :: Two solutions: (2, 4) and (−1, 1).
```

## Find the crossings

```quiz
y = x² − 4 and y = 2x − 1. What are the solutions (x, y)?
- (−3, −7) and (1, 1) :: Signs flipped: (x − 3)(x + 1) = 0 gives 3 and −1.
* (3, 5) and (−1, −3)
- (3, 0) and (−1, 0) :: Right x's. Put each into y = 2x − 1.
> x² − 4 = 2x − 1 gives x² − 2x − 3 = 0, so x = 3 or −1.
~ type y=x^{2}-4 :: Type both equations.
~ type y=2x-1
~ zoom -6 7 -6 10
~ point (3, 5) :: Click each crossing.
~ point (-1, -3) :: (3, 5) and (−1, −3).
```

## Line touches once

```quiz
y = x² + 3x + 7
y = −x + k
The system has exactly one solution. What is the constant k?
- −2 :: That's x at the touching point, not k.
- 19/4 :: Move −x over first: b is 4, not 3.
* 3
> x² + 4x + (7 − k) = 0. Then 16 − 4(7 − k) = 0, so k = 3.
~ slider k = 0 :: Make k a slider.
~ type y=x^{2}+3x+7
~ type y=-x+k
~ zoom -8 5 -2 14
~ slider k = 0 .. 3 :: Drag k until the line just touches.
~ point (-2, 5) :: One touching point at k = 3.
```

# Trap: fake solutions
Squaring can add answers that fail. Check each.

## Check after squaring

Squaring both sides can create answers that don't work. Check each one in the original.

```example
sqrt(x + 6) = x. Find all solutions.
1. x + 6 = x² :: Square both sides.
2. (x − 3)(x + 2) = 0 :: Make it 0 and factor.
3. x = 3 or x = −2 :: Two candidates.
4. x = 3 only :: √9 = 3 works. √4 is 2, not −2.
```

## Spot the fake

```quiz
sqrt(3x + 10) = x. Which gives all the solutions?
* x = 5 only
- x = −2 and x = 5 :: Trap: √4 is 2, not −2.
- x = −2 only :: Wrong one out: √25 = 5 works.
> x² − 3x − 10 = 0 gives 5 and −2. Only 5 passes the check.
~ type y=\sqrt{3x+10} :: Graph each side as its own y.
~ type y=x
~ zoom -5 10 -3 10
~ point (5, 5) :: Only one crossing: x = 5. No fake to check.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Square-root both sides. Keep both signs.

```check
m-0520
```

## Your turn: medium

Get the root alone, square, then check each answer.

```check
m-0189
```

## Your turn: hard

Set equal, make it 0, then use b² − 4ac = 0.

```check
m-0343
```
