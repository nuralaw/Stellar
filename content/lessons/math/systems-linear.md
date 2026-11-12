---
title: Systems of Two Linear Equations
skill: systems-linear
domain: algebra
section: math
summary: Solve two-equation systems by substitution, elimination or Desmos, get x + y in one step, and count solutions without solving.
---

## Spot it: two equations, one point

A **system** is two equations that must both be true. Its **solution** (x, y) makes both true at once. On a graph, it's the point where the two lines cross.

The question may ask for x, y, a mix like x + y, the number of solutions, or a missing constant. Read the last line before you start.

```quiz
Which point is the solution to this system?
x + y = 7
2x − y = 5
- (5, 2) :: It fits x + y = 7, but 2(5) − 2 = 8, not 5. A solution must fit both equations.
- (3, 1) :: It fits 2x − y = 5, but 3 + 1 = 4, not 7.
- (3, 4) :: x and y are swapped: 2(3) − 4 = 2, not 5.
* (4, 3) :: Right. 4 + 3 = 7 and 2(4) − 3 = 5.
> Test each point in both equations. Wrong choices are often built to fit just one of them.
```

## Substitute when a variable is alone

If one equation already says **y = …** (or x = …), put that expression in place of y in the other equation. Keep it **in parentheses**, so the number in front multiplies every term. Solve for x, then go back for y.

```quiz
y = 3x − 2
4x + 2y = 26
What is the value of y?
* 7
- 3 :: That's x. The question asks for y, so take one more step.
- 6.4 :: You wrote 2(3x − 2) as 6x − 2. The 2 multiplies both terms.
- 10 :: You dropped the 2 in 2y. Replace y but keep its coefficient: 2(3x − 2).
> Replace y: 4x + 2(3x − 2) = 26. Distribute: 4x + 6x − 4 = 26, so 10x = 30 and x = 3.
> Then y = 3(3) − 2 = 7. Check: 4(3) + 2(7) = 12 + 14 = 26.
```

## Eliminate: add or subtract

When no variable is alone, stack the equations (x under x, y under y). Then add or subtract them so one variable cancels.

- Opposite terms, like 3y and −3y: **add**.
- Equal terms, like 3y and 3y: **subtract**.
- Neither: multiply one or both equations first, and multiply **every term, including the right side**.

```quiz
2x + 3y = 13
x − y = −1
What is the value of x?
- 3 :: That's y. Finish with the variable the question asks for.
- 2.4 :: You tripled x − y but not the −1. Multiply every term: 3x − 3y = −3.
* 2
- 3.2 :: 3 × (−1) is −3, not 3. Watch the sign on the right side.
> Multiply the second equation by 3: 3x − 3y = −3. Now the y-terms are opposites, so add: 5x = 10, and x = 2.
> Then 2 − y = −1 gives y = 3. Check: 2(2) + 3(3) = 13.
```

## Want x + y? Combine first

If the question wants **x + y**, **x − y** or another mix, try adding or subtracting the equations exactly as they are, before you solve anything.

Crossed coefficients, like 5x + 2y and 2x + 5y, are the signal: adding them gives the same number of x's and y's.

```quiz
7x + 3y = 29
3x + 7y = 21
What is the value of x + y?
- 2 :: That's x − y, from subtracting. Adding gives the sum.
* 5
- 50 :: That's 10x + 10y. Divide by 10 to get x + y.
- 3.5 :: That's x alone. The question asks for x + y.
> Add the equations: 10x + 10y = 50. Divide every term by 10: x + y = 5.
> You never need x = 3.5 and y = 1.5 on their own.
```

## Messy numbers? Graph both lines

Desmos solves any system. Type each equation on its own line **exactly as given** (no need to solve for y), then click the point where the lines cross. Finish the question from that (x, y).

Desmos graphs only x and y, so retype other letters, like a and b, as x and y.

> **Trap:** after `/`, everything you type stays in the denominator, even `)`, until you press →.

```quiz
You want Desmos to graph y = (2/3)x − 4. What do you type?
- `y=2/3x-4` :: Everything after / stays in the denominator, so Desmos graphs y = 2/(3x − 4).
- `y=(2/3)x-4` :: The ) lands in the denominator too, so the fraction never closes.
* `y=2/3`, then →, then `x-4` :: Right. → steps out of the denominator, so x − 4 lands on the main line.
> Always look at the formatted line before you trust the graph.
```

## How many solutions? Compare, don't solve

| The two lines | Solutions |
|---|---|
| different slopes | exactly one |
| same slope, different intercepts | none (parallel) |
| same slope, same intercept | infinitely many (same line) |

In ax + by = c form, look for one multiplier that turns the first equation's x- and y-coefficients into the second's. If one number works for both, the slopes match. Then the right side decides: times that same number, same line; anything else, parallel.

```quiz
3x − 5y = 4
kx + 10y = 9
In the system, k is a constant. If the system has no solution, what is the value of k?
- 6 :: −5 becomes 10, so the multiplier is −2, not 2. Keep the sign.
- −2 :: That's the multiplier. Apply it to the x-coefficient: 3 × (−2).
* −6
- −3/2 :: You flipped the multiplier. It's 10 ÷ (−5) = −2, not −5 ÷ 10.
> No solution means parallel lines: the left sides match by one multiplier, the right sides don't.
> The y-terms give the multiplier: 10 ÷ (−5) = −2. So k = 3 × (−2) = −6.
> Check the right side: 4 × (−2) = −8, but the second equation has 9. Parallel lines, so no solution.
```

## Word problems: one equation per total

Name both unknowns, like a = adult tickets and c = child tickets. Each **total** in the story gives one equation:

- **Count:** a + c = number of tickets
- **Value:** (price) × a + (price) × c = money collected

Solve, then answer the quantity they asked for. The other one is waiting in the choices.

```quiz
A museum sold adult tickets for $12 and child tickets for $7. It sold 150 tickets and collected $1,450. How many adult tickets did it sell?
- 70 :: That's the number of child tickets. Reread what the question asks for.
- 400 :: That's 5a. Divide by 5. (400 is also more than the 150 tickets sold.)
* 80
- 260 :: You multiplied a + c by 7 but left 150 as it was. Multiply every term.
> Count: a + c = 150. Money: 12a + 7c = 1,450.
> Multiply the count by 7: 7a + 7c = 1,050. Subtract it from the money equation: 5a = 400, so a = 80 and c = 70.
> Check: 12(80) + 7(70) = 960 + 490 = 1,450.
```

## The trap: same slope, same line?

Equal slopes only tell you the lines are parallel **or the same line**. Before you pick "no solution", put both equations in the same form and compare the intercepts too.

```quiz
y = 4x − 3
8x − 2y = 6
How many solutions does this system have?
- None :: Trap. The slopes match, but so do the intercepts. It's one line written twice, not two parallel lines.
- Exactly one :: That needs different slopes. Both slopes are 4.
- Exactly two :: Two straight lines can never cross exactly twice.
* Infinitely many
> Solve the second equation for y: −2y = −8x + 6, so y = 4x − 3. That's the first equation again.
> Same slope and same intercept: every point on the line solves both equations.
```

## Your turn: easy

One variable is already alone. Substitute, then answer what they ask.

```check
m-0721
```

## Your turn: medium

Look at what's asked before you start solving.

```check
m-0746
```

## Your turn: hard

Line both up as ax + by = c, then match the multiplier.

```check
m-1019
```

## Recap

- Read the last line first: x, y, a mix, a count, or a constant?
- A variable alone? Substitute it in parentheses. Otherwise stack and eliminate.
- Asked for x + y or x − y? Add or subtract the equations before solving.
- Scaling an equation? Multiply every term, including the right side.
- Counting solutions: different slopes, one. Same slope: different intercepts, none; same intercept, infinitely many.
- Messy numbers? Graph both lines in Desmos and click the crossing.
