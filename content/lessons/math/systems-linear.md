---
title: Systems of Two Linear Equations
skill: systems-linear
domain: algebra
section: math
summary: Find the one point (x, y) that fits both equations, or count the solutions.
---

# Elimination
Add or subtract so one variable cancels.

## Cancel one variable

The solution (x, y) fits both equations: the point where the lines cross.

```example
x + y = 7 and 2x − y = 5. Find (x, y).
1. 3x = 12 :: Add the equations. +y and −y cancel.
2. x = 4 :: Divide by 3.
3. 4 + y = 7 → y = 3 :: Put x back in.
4. (x, y) = (4, 3)
```

## Eliminate it yourself

```quiz
5x + y = 17 and 3x − y = 7. What is y?
* 2
- 3 :: That's x. The question asks for y.
- 5 :: That's x + y, from subtracting. Add instead.
> Add: 8x = 24, so x = 3. Then 5(3) + y = 17 gives y = 2.
~ type 5x+y=17 :: Type both equations as they are.
~ type 3x-y=7
~ zoom -2 8 -3 7
~ point (3, 2) :: Click the crossing: y = 2.
```

# Substitution
One variable alone? Plug it into the other.

## Swap y out

Put the expression for y, in parentheses, in place of y.

```example
y = 2x and 3x + y = 10. Find (x, y).
1. 3x + (2x) = 10 :: Replace y with 2x.
2. 5x = 10 → x = 2 :: Combine, divide by 5.
3. y = 2(2) = 4 :: Put x back in.
4. (x, y) = (2, 4)
```

## Substitute it yourself

```quiz
y = 3x − 2 and 4x + 2y = 26. What is y?
- 3 :: That's x. Go back for y.
* 7
- 6.4 :: 2(3x − 2) is 6x − 4, not 6x − 2.
> 4x + 2(3x − 2) = 26, so 10x = 30 and x = 3. Then y = 3(3) − 2 = 7.
~ type y=3x-2 :: Type both equations as they are.
~ type 4x+2y=26
~ zoom -2 8 -2 12
~ point (3, 7) :: Click the crossing: y = 7.
```

# Asked for x + y
Combine the equations. Skip solving.

## Add them whole

Coefficients swapped? Add the equations as they are.

```example
2x + 3y = 13 and 3x + 2y = 17. What is x + y?
1. 5x + 5y = 30 :: Add the equations.
2. x + y = 6 :: Divide by 5.
```

## Combine it yourself

```quiz
7x + 3y = 29 and 3x + 7y = 21. What is x + y?
* 5
- 2 :: That's x − y. You subtracted.
- 50 :: That's 10x + 10y. Divide by 10.
> Add: 10x + 10y = 50. Divide by 10: x + y = 5.
~ type 7x+3y=29 :: Type both equations as they are.
~ type 3x+7y=21
~ zoom -1 7 -1 5
~ point (3.5, 1.5) :: Click the crossing. 3.5 + 1.5 = 5.
```

# No solution
Same left sides, different right: parallel lines.

## Match the left sides

Multiply one equation so its x- and y-terms match the other's.

```example
2x + 3y = 5 and 4x + 6y = 7. How many solutions?
1. 4x + 6y = 10 :: Multiply the first by 2.
2. 10 ≠ 7 :: Same left side, different right.
3. No solution :: Parallel lines never cross.
```

## Find k

```quiz
3x − 5y = 4 and kx + 10y = 9. The system has no solution. What is k?
- 6 :: −5 becomes 10, so multiply by −2, not 2.
- −2 :: That's the multiplier. Use it: 3 × (−2).
* −6
> Multiply the first by −2: −6x + 10y = −8. The left sides match when k = −6, and −8 ≠ 9.
~ slider k = 0 :: Make k a slider.
~ type 3x-5y=4
~ type kx+10y=9
~ slider k = 0 .. -6 :: At k = −6 the lines are parallel: no crossing.
```

# Trap: the same line
Right sides match too: infinitely many solutions.

## One line, written twice

Everything matches? Every point on the line works.

```example
x + 2y = 4 and 3x + 6y = 12. How many solutions?
1. 3x + 6y = 12 :: Multiply the first by 3.
2. 12 = 12 :: Both sides match the second equation.
3. Infinitely many :: It is the same line.
```

## Count the solutions

```quiz
y = 4x − 3 and 8x − 2y = 6. How many solutions?
* Infinitely many
- None :: Trap: the right sides match too. Same line.
- Exactly one :: That needs different slopes. Both are 4.
> Solve the second for y: −2y = −8x + 6, so y = 4x − 3. The same line.
~ type y=4x-3 :: Type both equations as they are.
~ type 8x-2y=6 :: The second lands exactly on the first.
~ say :: One line, not two: every point on it works.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

y is alone. Substitute, then answer what is asked.

```check
m-0721
```

## Your turn: medium

Read what is asked before you solve.

```check
m-0746
```

## Your turn: hard

Write both as ax + by = c, then match the left sides.

```check
m-1019
```
