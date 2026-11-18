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

```more
A **system** is two equations that use the same unknowns. Its **solution** is the pair (x, y) that makes both equations true. **Elimination** means adding or subtracting the equations so that one letter disappears. Here +y and −y add up to 0.
```

## Eliminate it yourself

```quiz
5x + y = 17 and 3x − y = 7. What is the value of y?
answer: 2
- 3 :: That is x. The question asks for y.
- 5 :: That is x + y, from subtracting. Add instead.
> Add: 8x = 24, so x = 3. Then 5(3) + y = 17 gives y = 2.
~ type 5x+y=17 :: Type both equations as they are.
~ type 3x-y=7
~ zoom -2 8 -3 7
~ point (3, 2) :: Click the crossing: y = 2.
```

# Multiply first
Nothing cancels? Multiply one equation first.

## Match a pair of terms

Nothing cancels yet? Multiply a whole equation so one pair of terms matches.

```visual
systems-linear--multiply
```

```example
3x + 2y = 13 and 5x − 4y = 7. Find x.
1. 6x + 4y = 26 :: Multiply the first equation by 2.
2. 11x = 33 :: Add. 4y and −4y cancel.
3. x = 3 :: Divide by 11.
```

```more
Multiply **every** term of that equation, including the number on the right. If no pair can be matched with one multiplier, multiply both equations. For 2x + 3y and 3x + 5y, multiply the first by 3 and the second by 2: both x terms become 6x, and then you subtract.
```

## Multiply both

```quiz
2x + 3y = 12 and 3x + 5y = 19. What is the value of x?
answer: 3
- 2 :: That is y. The question asks for x.
- 5 :: That is x + y. Find x alone.
> × 3 and × 2 make 6x + 9y = 36 and 6x + 10y = 38. Subtract: y = 2. Then x = 3.
~ type 2x+3y=12 :: Type both equations as they are.
~ type 3x+5y=19
~ zoom -1 8 -1 6
~ point (3, 2) :: Click the crossing: x = 3.
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

```more
**Substitution** means replacing a letter with what it equals. Since y = 2x, you can write 2x wherever y appears. Use parentheses so the whole expression is multiplied correctly, for example 4y becomes 4(2x). Now only one letter is left, so you can solve.
```

## Substitute it yourself

```quiz
y = 3x − 2 and 4x + 2y = 26. What is the value of y?
answer: 7
- 3 :: That is x. Go back for y.
- 6.4 :: 2(3x − 2) is 6x − 4, not 6x − 2.
> 4x + 2(3x − 2) = 26, so 10x = 30 and x = 3. Then y = 3(3) − 2 = 7.
~ type y=3x-2 :: Type both equations as they are.
~ type 4x+2y=26
~ zoom -2 8 -2 12
~ point (3, 7) :: Click the crossing: y = 7.
```

# Systems from stories
Name the unknowns. One equation per fact.

## Write the system

Name the unknowns. Write one equation for each fact in the story.

```example
A theater sold 50 tickets for $520. Adult tickets cost $12, child tickets $8. Let a = adults and c = children. Write and solve a system.
1. a + c = 50 :: Count: adults plus children.
2. 12a + 8c = 520 :: Money: price × number, added.
3. a = 30 and c = 20 :: Put a = 50 − c in line 2.
```

```more
Each fact in a story gives one equation. One fact is about **how many** things there are: a + c = 50. Another fact is about **money**: each kind costs price × number, and the costs add up to the total: 12a + 8c = 520. Check the answer: 12(30) + 8(20) = 360 + 160 = 520.
```

## Pick the system

```quiz
A shop sells pens for $2 and notebooks for $5. Mia buys 9 items and pays $30. If p is the number of pens and n is the number of notebooks, which system represents this situation?
* p + n = 9 and 2p + 5n = 30
- p + n = 30 and 2p + 5n = 9 :: Swapped: 9 is the item count, 30 is the money.
- p + n = 9 and 5p + 2n = 30 :: The prices are swapped. A pen costs $2.
> Items: p + n = 9. Money: 2 per pen and 5 per notebook add to 30.
```

# Asked for x + y
Combine the equations. Skip solving.

## Add them whole

Coefficients swapped, like 7x + 3y and 3x + 7y? Add them: 10x + 10y.

```example
2x + 3y = 13 and 3x + 2y = 17. What is x + y?
1. 5x + 5y = 30 :: Add the equations.
2. x + y = 6 :: Divide by 5.
```

```more
A **coefficient** is the number in front of a letter. When the coefficients of x and y are swapped between the equations, adding them gives the same number in front of x and y. Then you can divide, and you get x + y without ever finding x or y alone.
```

## Combine it yourself

```quiz
7x + 3y = 29 and 3x + 7y = 21. What is the value of x + y?
answer: 5
- 2 :: That is x − y. You subtracted.
- 50 :: That is 10x + 10y. Divide by 10.
> Add: 10x + 10y = 50. Divide by 10: x + y = 5.
~ type 7x+3y=29 :: Type both equations as they are.
~ type 3x+7y=21
~ zoom -1 7 -1 5
~ point (3.5, 1.5) :: Click the crossing. 3.5 + 1.5 = 5.
```

# No solution
Same left sides, different right: parallel lines.

## Match the left sides

Multiply so the left sides match. Same left, different right: no solution.

```visual
systems-linear--lines
```

```example
2x + 3y = 5 and 4x + 6y = 7. How many solutions?
1. 4x + 6y = 10 :: Multiply the first by 2.
2. 10 ≠ 7 :: Same left side, different right side.
3. No solution :: Parallel lines never cross.
```

```more
Lines with the same slope are **parallel**. If they sit in different places, they never cross, so no point fits both equations. If the left sides are the same but the right sides are different, one number cannot equal two different numbers: that is the sign of parallel lines.
```

## Find k

```quiz
3x − 5y = 4 and kx + 10y = 9. The system has no solution. What is the value of k?
answer: -6
- 6 :: −5 becomes 10, so multiply by −2, not 2.
- −2 :: That is the multiplier. Use it: 3 × (−2).
> Multiply the first by −2: −6x + 10y = −8. The left sides match when k = −6, and −8 ≠ 9.
~ slider k = 0 :: Make k a slider.
~ type 3x-5y=4
~ type kx+10y=9
~ slider k = 0 .. -6 :: At k = −6 the lines are parallel: no crossing.
```

# Trap: the same line
Right sides match too: infinitely many solutions.

## One line, written twice

Left and right sides all match? It is one line: every point works.

```example
x + 2y = 4 and 3x + 6y = 12. How many solutions?
1. 3x + 6y = 12 :: Multiply the first by 3.
2. Same as the second equation :: Both sides match.
3. Infinitely many :: Every point on the line works.
```

```more
When one equation is a multiple of the other, they describe the same line. Each point on that line fits both equations, and a line has infinitely many points. Compare with parallel lines: there the left sides match but the right sides do not.
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

## Two unknown constants

```quiz
2x + 3y = 6
ax + 9y = b
In the given system of equations, a and b are constants. The system has infinitely many solutions. What is the value of a + b?
answer: 24
- 18 :: That is only b. Add a as well.
- 6 :: That is only a. Add b as well.
> Multiply the first equation by 3: 6x + 9y = 18. So a = 6 and b = 18, and a + b = 24.
~ slider a = 0 :: Make a slider for a.
~ slider b = 0 :: And one for b.
~ type 2x+3y=6
~ type ax+9y=b
~ slider a = 0 .. 6 :: The slopes match at a = 6.
~ slider b = 0 .. 18 :: One line at b = 18.
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
