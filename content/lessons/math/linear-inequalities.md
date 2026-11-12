---
title: Linear Inequalities
skill: linear-inequalities
domain: algebra
section: math
summary: Flip the sign at the right moment. Turn at least and at most into symbols.
---

# Flip the sign
Divide by a negative, flip the sign.

## Divide by a negative? Flip

Solve it like an equation. One extra rule: **multiply or divide by a negative → flip the sign.**

```example
Solve −2x + 3 > 11.
1. −2x > 8 :: Subtract 3. No flip.
2. x < −4 :: Divide by −2: > flips to <.
```

## Flip it yourself

```quiz
Solve 5 − 4x ≤ 17.
- x ≤ −3 :: You divided by −4 but didn't flip the sign.
- x ≥ 3 :: 12 ÷ (−4) = −3, not 3.
* x ≥ −3
> −4x ≤ 12. Divide by −4 and flip: x ≥ −3. Test 0: 5 ≤ 17 is true, and 0 ≥ −3.
~ type 5-4x\le 17 :: Type it as it is.
~ zoom -10 10 -5 5
~ point (-3, 0) :: The shading starts at −3 and goes right: x ≥ −3.
```

# Words to symbols
At least is ≥. At most is ≤.

## Turn words into symbols

**At least** means ≥. **At most** and **no more than** mean ≤.

```example
A van carries at most 900 kg. The driver weighs 80 kg and each box 20 kg. Write an inequality for b boxes.
1. 80 + 20b :: The driver counts once. 20 kg per box.
2. 80 + 20b ≤ 900 :: "At most" means ≤.
```

## Write it yourself

```quiz
Mia has $30 and saves $12 each week. She needs at least $150. Which inequality gives the number of weeks w she must save?
- 30 + 12w ≤ 150 :: "At least" is a floor, so use ≥.
- 12 + 30w ≥ 150 :: $12 comes every week, so 12 multiplies w.
- 30 + 12w > 150 :: Exactly $150 is enough, so 150 must count.
* 30 + 12w ≥ 150
> She starts with 30 and adds 12 per week: 30 + 12w. "At least 150" means ≥ 150.
```

# Greatest or least number
Limits round down. Goals round up.

## Round the right way

Under a limit, round **down**. To reach a goal, round **up**. Never to the nearest.

```example
Tickets cost $7 each. A club needs at least $100. What is the least number of tickets it must sell?
1. 7t ≥ 100 :: "At least" means ≥.
2. t ≥ 14.29 :: Divide by 7.
3. 15 tickets :: A goal: round up. 14 gives only $98.
```

## Round it yourself

```quiz
A bowling alley charges $4 for shoes plus $3 per game. Dana has $30. What is the greatest number of games she can play?
* 8
- 9 :: 9 games cost $31, over budget. Round down.
- 10 :: You left out the $4 for shoes.
> 4 + 3g ≤ 30, so g ≤ 8.67. She can't go over $30: round down to 8.
~ type y=4+3x :: The cost of x games.
~ type y=30 :: Her budget.
~ zoom 0 12 0 40
~ point (8, 28) :: 8 games cost $28. 9 games cost $31: over the line.
```

# Systems of inequalities
A solution passes every inequality.

## Test the point in each

A solution lies where **all** the shadings overlap. A dashed line (< or >) doesn't count.

```desmos
y ≥ x − 1 and y < −x + 5. Is (2, 2) a solution?
type y\ge x-1 :: Type each inequality on its own line.
type y<-x+5
point (2, 2) :: Inside both shadings: it is a solution.
```

## Test it yourself

```quiz
y > 3x − 2
x + y ≤ 6
Which point (x, y) is a solution to the system?
- (2, 4) :: 4 > 4 is false. On the line doesn't count for >.
* (1, 4)
- (1, 7) :: Passes the first, but 1 + 7 = 8 is over 6.
- (3, 1) :: Passes the second, but 1 > 7 is false.
> (1, 4): 4 > 3(1) − 2 = 1 is true, and 1 + 4 = 5 ≤ 6 is true.
~ type y>3x-2 :: Type both inequalities as they are.
~ type x+y\le 6
~ point (1, 4) :: Only (1, 4) sits where both shadings overlap.
```

# Trap: flipping too often
A negative on the other side changes nothing.

## Flip only for the divisor

The flip comes from what you divide **by**, not from the other side.

```example
Solve 2x − 9 > −15.
1. 2x > −6 :: Add 9.
2. x > −3 :: Divide by +2: no flip.
```

## Spot the trap

```quiz
Solve 3x + 10 < 4.
- x > −2 :: Trap: you divided by +3. A positive never flips.
- x < 2 :: 4 − 10 = −6, not 6.
* x < −2
> 3x < −6. Divide by 3, a positive: no flip. x < −2. Test −3: 1 < 4 is true.
~ type 3x+10<4 :: Type it as it is.
~ zoom -10 10 -5 5
~ point (-2, 0) :: The shading starts at −2 and goes left: x < −2.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

A fee stands alone. A rate multiplies the variable.

```check
m-0640
```

## Your turn: medium

Plug in what you know, then solve what's left.

```check
m-0888
```

## Your turn: hard

The sign flipped. What kind of number does that?

```check
m-12833
```
