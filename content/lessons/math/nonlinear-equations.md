---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratics and line-parabola systems, and count their solutions.
---

## Make it equal 0

**Get 0 on one side, then factor.** Each factor gives a solution. In a system, set the two y's equal first.

```example
y = x² and y = x + 2. Find the solutions (x, y).
1. x² = x + 2 :: Both equal y. Set them equal.
2. x² − x − 2 = 0 :: Move everything to one side.
3. (x − 2)(x + 1) = 0 :: Factor.
4. x = 2 or x = −1 :: Set each factor equal to 0.
5. (2, 4) and (−1, 1) :: Put each x into y = x + 2.
```

## Factor it yourself

```quiz
x² = 5x + 14. What are the solutions?
* x = 7 or x = −2
- x = −7 or x = 2 :: Signs flipped: x − 7 = 0 gives x = 7.
- x = 14 or x = 19 :: You factored without 0 on one side.
> x² − 5x − 14 = 0 factors as (x − 7)(x + 2) = 0.
```

## A square hides ±

Square-root both sides and keep **both signs**.

```quiz
(x + 4)² = 36. What is the sum of the solutions?
* −8
- 2 :: You kept only +6. The root is ±6.
- −10 :: That's one solution. Add both.
> x + 4 = 6 or −6, so x = 2 or x = −10. Sum: −8.
```

## Count with b² − 4ac

For ax² + bx + c = 0: positive means two real solutions, zero means one, negative means none.

```quiz
How many real solutions does 2x² − 3x + 5 = 0 have?
* None
- Exactly one :: That needs b² − 4ac = 0.
- Two :: Sign slip: −4(2)(5) is −40, not +40.
> b² − 4ac = 9 − 40 = −31. Negative, so no real solutions.
```

## Line touches parabola once

One crossing point means one solution: set b² − 4ac = 0.

```quiz
y = x² + 3x + 7
y = −x + k
The system has exactly one solution. What is the constant k?
* 3
- −2 :: That's x at the touching point, not k.
- 19/4 :: Move −x over first: b is 4, not 3.
> x² + 4x + (7 − k) = 0. Then 16 − 4(7 − k) = 0, so k = 3.
```

## Trap: fake solutions

Squaring both sides can create answers that don't work. Check each one in the original.

```quiz
sqrt(3x + 10) = x. Which gives all the solutions?
* x = 5 only
- x = −2 and x = 5 :: Trap: √4 is 2, not −2.
- x = −2 only :: Wrong one out: √25 = 5 works.
> x² − 3x − 10 = 0 gives 5 and −2. Only 5 passes the check.
```

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

## Recap

- Get 0 on one side, then factor.
- Square root: keep ±. Squared both sides: check every answer.
- b² − 4ac: positive two, zero one, negative none.
