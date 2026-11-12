---
title: Linear Inequalities
skill: linear-inequalities
domain: algebra
section: math
summary: Solve inequalities without sign slips, turn limit words into symbols, round whole-number answers the right way, and test points.
---

## Spot it: answers are ranges

Inequality questions use <, >, ≤ or ≥, or limit words like **at least** and **at most**. The answer is usually a range: x < 3 means every number below 3, including decimals and negatives.

Expect five shapes: solve for x, write one from a story, find the greatest or least whole number, pick a point (x, y) that works, or match a graph.

```quiz
Which value of x is NOT a solution to 2x + 1 < 9?
- 3.9 :: 2(3.9) + 1 = 8.8, which is less than 9, so it works.
- 0 :: 2(0) + 1 = 1, and 1 < 9 is true.
- −10 :: Negatives work too: 2(−10) + 1 = −19, which is less than 9.
* 4
> Solve: 2x < 8, so x < 4. Every number below 4 works.
> 4 itself gives 9 < 9, which is false. A strict < or > leaves out the boundary; ≤ and ≥ include it.
```

## Solve it like an equation

Use the same moves as for an equation. Only one move flips the sign:

| Move | Flip the sign? |
|---|---|
| add or subtract anything | no |
| multiply or divide by a positive | no |
| multiply or divide by a **negative** | **yes** |

If the variable ends up on the right, read it from the variable's side: 3 < x means x > 3.

```quiz
Which describes all solutions to −3x + 5 > 17?
- x > −4 :: You divided by −3 without flipping the sign.
* x < −4
- x < −22/3 :: You added 5 instead of subtracting it: 17 − 5 = 12, not 22.
- x < 4 :: 12 ÷ (−3) is −4, not 4.
> Subtract 5: −3x > 12. Divide by −3, a negative, so flip: x < −4.
> Check with x = −5: −3(−5) + 5 = 20, and 20 > 17 is true.
```

## Dodge the flip, then test 0

You can skip the flip entirely: collect x on the side where its coefficient stays **positive**.

Either way, finish with a test. Put an easy number, usually 0, into the **original** inequality. If it makes the inequality true, 0 must be inside your answer; if false, it must be outside.

```quiz
Which describes all solutions to 4 − 3(x − 2) ≥ x + 2?
- x ≥ 2 :: You divided by a negative without flipping. Test 0: 4 − 3(−2) = 10 ≥ 2 is true, so 0 must be a solution.
- x ≤ −1 :: −3 times −2 is +6, not −6. Distribute the negative to both terms.
* x ≤ 2
> Distribute: 4 − 3x + 6 ≥ x + 2, so 10 − 3x ≥ x + 2.
> Keep x on the right, where it stays positive: add 3x and subtract 2 to get 8 ≥ 4x. Divide by 4: 2 ≥ x, which is x ≤ 2.
> Test 0: 10 ≥ 2 is true, and 0 is in x ≤ 2.
```

## Turn limit words into symbols

| Words | Symbol |
|---|---|
| at least, no less than, minimum | ≥ |
| at most, no more than, maximum | ≤ |
| more than, greater than, over | > |
| less than, fewer than, under | < |

Build the expression as you would for an equation: a one-time **fee** or starting amount stands alone, and a **rate** multiplies the variable.

```quiz
A plant is 12 cm tall and grows 1.5 cm per week. Which inequality shows the numbers of weeks w for which the plant is more than 30 cm tall?
- 12 + 1.5w ≥ 30 :: "More than 30" leaves out 30 itself, so the symbol is >, not ≥.
- 1.5 + 12w > 30 :: The start height and the weekly rate are swapped. The rate multiplies w.
* 12 + 1.5w > 30
- 12 + 1.5w < 30 :: That's when the plant is still shorter than 30 cm.
> The height after w weeks is 12 + 1.5w: the start plus the rate times w. "More than" is >, so 12 + 1.5w > 30.
```

## Whole numbers: which way to round

When the answer must be a whole number (tickets, people, whole miles), solve, then round toward the side the limit allows:

- an upper limit (budget, capacity): round **down**
- a lower limit (goal, minimum): round **up**

Then test your number and the next one in the story.

```quiz
A taxi charges $9 plus $2.50 per mile. Rosa has $60. What is the greatest whole number of miles she can ride?
- 21 :: You rounded 20.4 up. 21 miles cost 9 + 2.5(21) = $61.50, which is over $60.
- 24 :: You left out the $9 fee: 60 ÷ 2.5 = 24.
* 20
- 27 :: You added the fee instead of subtracting it: 69 ÷ 2.5 = 27.6.
> At most $60: 9 + 2.5m ≤ 60. Subtract 9: 2.5m ≤ 51. Divide by 2.5: m ≤ 20.4.
> She can't go over, so round down to 20. Test: 20 miles cost $59, which fits; 21 miles cost $61.50, which doesn't.
```

## Which point works? Test every inequality

Plug each choice into **every** inequality and cross it out at the first one it fails. Wrong choices are often built to pass just one.

A point exactly on a boundary line counts only for ≤ or ≥, never for < or >.

```quiz
y > 2x − 1
x + y ≤ 5
Which point (x, y) is a solution to the system?
- (3, 6) :: It passes the first, but 3 + 6 = 9, which is more than 5.
- (3, 1) :: It passes the second, but 1 > 2(3) − 1 = 5 is false.
- (2, 3) :: 3 > 2(2) − 1 = 3 is false. The point sits on the first boundary, and > leaves the boundary out.
* (1, 3)
> (1, 3): 3 > 2(1) − 1 = 1 is true, and 1 + 3 = 4 ≤ 5 is true. It passes both.
```

## Graphs: the line, then the side

On a graph, the boundary line shows the symbol and the shading shows the direction:

- **Solid** line: ≤ or ≥. **Dashed** line: < or >.
- With y alone, y > or y ≥ is shaded **above** the line; y < or y ≤ is shaded **below** it.

Getting y alone can mean dividing by a negative, and then the sign flips.

```quiz
An inequality's graph has the dashed boundary line y = 3x + 1, and the region below the line is shaded. Which inequality is it?
- y ≤ 3x + 1 :: ≤ draws a solid line. A dashed line means < or >.
- y > 3x + 1 :: y > is shaded above the line, not below.
* y < 3x + 1
- −y < −3x − 1 :: Multiply by −1 and flip: y > 3x + 1, which is shaded above.
> Dashed means strict (< or >), and shaded below means y is less than the line: y < 3x + 1.
```

## The trap: the hidden flip

The flip hides in stories about amounts that **go down**: a draining tank, a melting candle, money being spent. The rate is negative, so solving means dividing by a negative. Check your answer with one number from it.

```quiz
A tank holds 200 liters and drains 8 liters per minute. Which describes the times t, in minutes, when the tank holds less than 40 liters?
- t < 20 :: Trap: you divided by −8 without flipping. At t = 10 the tank still holds 120 liters.
- t > 25 :: 200 ÷ 8 = 25 is when the tank is empty. The question asks when it drops below 40.
- t ≥ 20 :: At t = 20 the tank holds exactly 40 liters, which isn't less than 40.
* t > 20
> Water left after t minutes: 200 − 8t. Set it below 40: 200 − 8t < 40. Subtract 200: −8t < −160.
> Divide by −8 and flip: t > 20. Check t = 22: 200 − 176 = 24 liters, which is less than 40.
```

## Your turn: easy

A fee stands alone, a rate multiplies the variable, then pick the symbol.

```check
m-0640
```

## Your turn: medium

Plug in what you know, then solve the inequality that's left.

```check
m-0888
```

## Your turn: hard

Ask yourself: what kind of number flips the sign?

```check
m-12833
```

## Recap

- Solve like an equation; flip only when you multiply or divide by a negative.
- Test 0 (or another easy number) in the original inequality.
- At least ≥, at most ≤, more than >, fewer than <.
- Whole-number answers: budgets round down, goals round up. Test your number and the next.
- A point must pass every inequality; a boundary counts only for ≤ and ≥.
- Graphs: solid for ≤ and ≥, dashed for < and >; y > is above, y < is below.
