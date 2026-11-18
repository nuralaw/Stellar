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
2. (x + 5)(x − 3) = 0 :: Multiply to −15, add to 2: 5 and −3.
3. x = −5 or x = 3 :: Set each factor equal to 0.
```

```more
To factor x² + bx + c, find two numbers that multiply to c and add to b. Here c = −15 and b = 2, and 5 × (−3) = −15 and 5 + (−3) = 2. If two numbers multiply to 0, one of them must be 0. That is why each factor gives a solution.
```

## Factor it yourself

```quiz
x² = 5x + 14. What is the positive solution?
answer: 7
- 14 :: That is c. Move everything to one side, then factor.
- 2 :: The solutions are 7 and −2. Pick the positive one.
> x² − 5x − 14 = 0 factors as (x − 7)(x + 2) = 0. So x = 7 or x = −2.
~ type y=x^{2}-5x-14 :: Move everything to one side. Graph it as y.
~ zoom -6 11 -25 15
~ point (-2, 0) :: Solutions are where the graph crosses the x-axis.
~ point (7, 0) :: x = −2 or x = 7.
```

# Roots and absolute value
A square root and an absolute value give two cases.

## Keep both cases

Square-root both sides and keep **both signs**. An absolute value | | gives two cases too.

```example
(x − 1)² = 25. Find the solutions.
1. x − 1 = 5 or x − 1 = −5 :: Root both sides: ±5.
2. x = 6 or x = −4 :: Add 1 to each.
```

```more
**Absolute value** |a| is the distance of a from 0, so it is never negative. |x − 3| = 5 means x − 3 can be 5 or −5. Solve both: x = 8 or x = −2. If an absolute value equals a negative number, there is no solution.
```

## Keep both signs

```quiz
(x + 4)² = 36. What is the sum of the solutions?
answer: -8
- 2 :: You kept only +6. The root is ±6.
- −10 :: That is one solution. Add both.
> x + 4 = 6 or −6, so x = 2 or x = −10. Sum: −8.
~ type y=(x+4)^{2} :: Graph each side as its own y.
~ type y=36
~ zoom -14 6 -5 45
~ point (-10, 36) :: Two crossings, so two solutions.
~ point (2, 36) :: −10 + 2 = −8.
```

## Absolute value

```quiz
|2x − 3| = 9. What is the sum of the solutions?
answer: 3
- 6 :: That is only one solution. Add both.
- −3 :: That is only the other solution. Add both.
> 2x − 3 = 9 gives x = 6. 2x − 3 = −9 gives x = −3. Sum: 6 + (−3) = 3.
~ type y=\left|2x-3\right| :: Graph each side as its own y.
~ type y=9
~ zoom -8 10 -3 14
~ point (-3, 9) :: Two crossings: x = −3 and x = 6.
~ point (6, 9) :: Sum: −3 + 6 = 3.
```

# Quadratic formula
The formula is not on the reference sheet.

## Use the formula

For ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) ÷ (2a). It is not on the reference sheet.

```example
2x² − 3x − 5 = 0. Find the solutions.
1. a = 2, b = −3, c = −5 :: Read the numbers.
2. x = (3 ± √(9 + 40)) ÷ 4 :: −b = 3. b² − 4ac = 9 + 40.
3. x = (3 ± 7) ÷ 4 :: √49 = 7.
4. x = 5/2 or x = −1 :: (3 + 7) ÷ 4 and (3 − 7) ÷ 4.
```

```more
Use the formula when factoring is hard. Watch the signs: −b is the opposite of b, so if b = −3 then −b = 3. The ± sign gives two answers, one with + and one with −. Divide the whole top by (2a), not just the square root.
```

## Try the formula

```quiz
2x² + 7x − 4 = 0. What is the positive solution?
answer: 1/2
- 9 :: That is √(b² − 4ac), not x. Finish the formula.
- 2 :: −7 + 9 = 2. Now divide by 2a = 4.
> b² − 4ac = 49 + 32 = 81, so x = (−7 ± 9) ÷ 4. The positive one: 2 ÷ 4 = 1/2.
~ type y=2x^{2}+7x-4 :: Graph the left side as y.
~ zoom -6 3 -12 8
~ point (0.5, 0) :: The positive crossing: x = 1/2.
~ point (-4, 0) :: The other solution: x = −4.
```

# Sum and product
ax² + bx + c: sum −b/a, product c/a.

## Skip the solving

For ax² + bx + c = 0, the solutions add to −b/a and multiply to c/a.

```example
3x² − 12x + 7 = 0. Find the sum and product of the solutions.
1. a = 3, b = −12, c = 7 :: Read the numbers.
2. Sum = −b/a = 12/3 = 4 :: Opposite of b, over a.
3. Product = c/a = 7/3 :: c over a.
```

```more
This works because ax² + bx + c = a(x − r)(x − s), where r and s are the solutions. Expanding gives a(x² − (r + s)x + rs). So r + s = −b/a and rs = c/a. Check with x² − 5x + 6 = 0: the solutions 2 and 3 add to 5 and multiply to 6. You never need to find r and s.
```

## Find the sum

```quiz
What is the sum of the solutions of 2x² − 10x + 7 = 0?
answer: 5
- −5 :: The sign flips: −b/a with b = −10 gives +5.
- 7/2 :: That is the product, c/a.
> The sum is −b/a = −(−10)/2 = 5.
~ type y=2x^{2}-10x+7 :: Graph the left side as y.
~ zoom -1 7 -6 12
~ say :: Two crossings, about x = 0.8 and x = 4.2. They add to 5.
```

# Count the solutions
Discriminant: above 0, two. At 0, one. Below 0, none.

## Count with b² − 4ac

**b² − 4ac** is the discriminant. More than 0: two real solutions. Exactly 0: one. Less than 0: none.

```visual
nonlinear-equations--discriminant
```

```example
How many real solutions does x² − 6x + 9 = 0 have?
1. a = 1, b = −6, c = 9 :: Read a, b and c.
2. (−6)² − 4(1)(9) = 0 :: Compute b² − 4ac.
3. Exactly one :: Zero means one solution.
```

```more
A **real** solution is an ordinary number on the number line. If b² − 4ac is negative, the formula needs the square root of a negative number, which is not real. On the graph, two solutions means the parabola crosses the x-axis twice. One solution means it only touches the axis. None means it never reaches the axis.
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

## Find the constant

```quiz
x² − 6x + c = 0
In the given equation, c is a constant. The equation has exactly one real solution. What is the value of c?
answer: 9
- 6 :: That is −b. Set b² − 4ac equal to 0.
- 36 :: That is b². Divide it by 4a = 4.
> One solution: b² − 4ac = 0. So 36 − 4c = 0 and c = 9.
~ slider c = 0 :: Make c a slider.
~ type y=x^{2}-6x+c :: Graph the left side as y.
~ zoom -2 8 -4 12
~ slider c = 0 .. 9 :: At c = 9 the parabola just touches the x-axis.
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

```more
A **parabola** is the U-shaped graph of y = ax² + bx + c. A line can cross it twice, touch it once, or miss it. Each crossing is a point (x, y) that fits both equations. By algebra: set the two right sides equal, solve for x, then find y. The xy-plane is the plane with an x-axis and a y-axis.
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
The system has exactly one solution. What is the value of the constant k?
answer: 3
- −2 :: That is x at the touching point, not k.
- 19/4 :: Move −x over first: b is 4, not 3.
> x² + 3x + 7 = −x + k, so x² + 4x + (7 − k) = 0. One solution: 16 − 4(7 − k) = 0, so k = 3.
~ slider k = 0 :: Make k a slider.
~ type y=x^{2}+3x+7
~ type y=-x+k
~ zoom -8 5 -2 14
~ slider k = 0 .. 3 :: Drag k until the line just touches.
~ point (-2, 5) :: One touching point at k = 3.
```

```more
One solution means the quadratic has one repeated solution, so b² − 4ac = 0. Another way: a repeated solution sits at x = −b/(2a), halfway between the two solutions that merged. Here x² + 4x + (7 − k) = 0, so x = −4/2 = −2. Then k = (−2)² + 4(−2) + 7 = 3.
```

# Trap: fake solutions
Check every answer in the original equation.

## Check after squaring

Squaring can add fake answers. So can a 0 on the bottom of a fraction. Check each answer.

```visual
nonlinear-equations--extraneous
```

```example
sqrt(x + 6) = x. Find all solutions.
1. x + 6 = x² :: Square both sides.
2. (x − 3)(x + 2) = 0 :: Make it 0 and factor.
3. x = 3 or x = −2 :: Two candidates.
4. x = 3 only :: √9 = 3 works. √4 is 2, not −2.
```

```more
A fake answer is called an **extraneous** solution. It solves the new equation but not the original one. After squaring, a candidate that makes the root equal to a negative number is fake: a square root is never negative. In a fraction equation, a candidate that makes a denominator 0 is fake.
```

## Zero on the bottom

```quiz
x/(x − 3) = 3/(x − 3) + 2. How many solutions does the equation have?
* None
- Exactly one: x = 3 :: x = 3 makes the bottom 0. It is fake.
- Infinitely many :: The x terms do not cancel. One candidate, x = 3.
> Multiply by (x − 3): x = 3 + 2(x − 3), so x = 3. But then x − 3 = 0: not allowed.
~ type y=\frac{x}{x-3} :: Graph each side as its own y.
~ type y=\frac{3}{x-3}+2
~ zoom -6 10 -8 8
~ say :: The two graphs never cross: no solution.
```

## Spot the fake

```quiz
x is a real number and sqrt(3x + 10) = x. Which of the following gives all of the values of x that satisfy the given equation?
* x = 5 only
- x = −2 and x = 5 :: Trap: √4 is 2, not −2.
- x = −2 only :: Wrong one out: √25 = 5 works.
> x² − 3x − 10 = 0 gives 5 and −2. Only 5 passes the check.
~ type y=\sqrt{3x+10} :: Graph each side as its own y.
~ type y=x
~ zoom -5 10 -3 10
~ point (5, 5) :: Only one crossing: x = 5. The fake −2 never shows on the graph.
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

Exactly one point: x = −b ÷ (2 × x² coefficient).

```check
m-0343
```
