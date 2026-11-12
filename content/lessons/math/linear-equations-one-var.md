---
title: Linear Equations in One Variable
skill: linear-equations-one-var
domain: algebra
section: math
summary: Solve one-variable linear equations, find the exact value asked for, and tell when there is one, no, or infinitely many solutions.
---

## One letter, first power only

The equation has **one unknown letter** (x, t, n…). It is never squared, under a root or in a denominator. That's what *linear* means.

The question asks for one of these:

- the value of x
- an expression, like 2x + 3
- how many solutions there are
- a constant, like k

Often it comes as a short story with a fee and a rate.

```quiz
Which of these is a linear equation in one variable?
- x² + 4 = 13 :: x is squared, so this is quadratic, not linear.
- 2x + y = 7 :: That has two letters, x and y. It's a linear equation in two variables.
* 3(x − 2) = 5x + 1 :: Right. One letter, and it only appears to the first power.
- 6/x = 2 :: x sits in a denominator, so this isn't linear.
> One letter, only to the first power. Parentheses and plain-number fractions are fine.
```

## Solve in four moves

1. **Clear fractions** (next step).
2. **Distribute.** A minus in front of parentheses flips **every** sign inside: −2(x − 3) = −2x + 6.
3. **Collect** x-terms on one side, numbers on the other. Keep the x-term positive if you can.
4. **Divide** by the number in front of x.

Then check your answer in the original equation.

> **Tip:** Messy numbers? Graph each side in Desmos: type `y=3(x-4)+2` on one line and `y=5x-16` on the next. Click the crossing point. Its x-coordinate is the answer.

```quiz
3(x − 4) + 2 = 5x − 16. What is the value of x?
* 3
- 7 :: The 3 multiplies both terms: 3(x − 4) = 3x − 12, not 3x − 4.
- 13 :: Moving −10 to the other side makes it +10. You kept it as −10.
- −3 :: Sign slip: −2x = −6 gives x = 3, because a negative divided by a negative is positive.
> Distribute: 3x − 12 + 2 = 5x − 16, so 3x − 10 = 5x − 16.
> Collect on the right to keep x positive: −10 + 16 = 5x − 3x, so 6 = 2x and x = 3.
> Check: 3(3 − 4) + 2 = −1 and 5(3) − 16 = −1. Both sides match.
```

## Clear fractions first

When several terms have fractions, multiply **every term on both sides** by the lowest common denominator (LCD). Whole numbers get multiplied too.

x/2 + x/3 = 5 → multiply by 6 → 3x + 2x = 30 → x = 6.

If only x has a fraction, like (2/3)x = 8, multiply by the flipped fraction: x = 8 × 3/2 = 12.

```quiz
(x + 1)/3 − x/4 = 1. What is the value of x?
* 8
- −3 :: The 1 on the right gets multiplied by 12 too. You left it as 1.
- 11 :: 12 × (x + 1)/3 is 4(x + 1) = 4x + 4. You multiplied only the x by 4.
- −9 :: You swapped the multipliers. 12 ÷ 3 = 4 goes with (x + 1)/3, and 12 ÷ 4 = 3 goes with x/4.
> The LCD of 3 and 4 is 12. Multiply every term: 4(x + 1) − 3x = 12.
> Distribute: 4x + 4 − 3x = 12, so x + 4 = 12 and x = 8.
> Check: 9/3 − 8/4 = 3 − 2 = 1.
```

## Find what they ask, not x

Read the **last line** first. If it asks for 2x + 3 or x + 2, the value of x is usually a wrong choice waiting for you.

Often you can skip x completely:

- **Scale:** 4x + 6 = 30. Divide both sides by 2, and 2x + 3 = 15.
- **Block:** if a group like (x + 2) appears twice, treat it as one thing. Call it u and solve for u.

```quiz
7(x + 2) − 5 = 4(x + 2) + 13. What is the value of x + 2?
* 6
- 4 :: That's x. The question asks for x + 2.
- 8/3 :: Moving −5 across makes it +5: 3u = 13 + 5 = 18. You subtracted instead.
- 18 :: 3u = 18 means u = 6. You stopped before dividing by 3.
> Call the block x + 2 "u": 7u − 5 = 4u + 13.
> Subtract 4u and add 5: 3u = 18, so u = 6. That's x + 2 = 6, and you never needed x.
```

## Turn the story into an equation

Name your letter first, with units: "s = number of sessions".

| Words | Math |
|---|---|
| "per", "each", "every" | rate × the letter |
| "fee", "starting", "one-time" | a number on its own |
| "total", "is", "same as" | = |

Then solve as usual. An impossible answer, like −4 hours or 2.5 tickets, means you should recheck the setup.

```quiz
A tutor charges a one-time $30 sign-up fee plus $15 per session. Ana paid $120 in total. How many sessions did she have?
* 6
- 3.5 :: You swapped the fee and the rate. The $15 repeats each session, so it multiplies s.
- 8 :: You left out the $30 fee. Only 120 − 30 = 90 dollars paid for sessions.
- 10 :: The fee is part of the $120, so subtract it. You added it.
> Let s = sessions. The $15 repeats, so it multiplies s. The $30 is paid once, so it stands alone: 30 + 15s = 120.
> Subtract 30: 15s = 90, so s = 6. Check: 30 + 15(6) = 120.
```

## Count the solutions

Simplify each side to the form ax + b. Then compare the x-coefficients (the numbers in front of x) and the plain numbers:

| After simplifying | Solutions |
|---|---|
| Different x-coefficients | Exactly one |
| Same x-coefficient, different numbers | None |
| Both sides identical | Infinitely many |

When the x-terms cancel, read what's left. A false statement like 3 = 7 means **none**. A true one like 0 = 0 means **infinitely many**.

```quiz
How many solutions does 4(x − 3) + x = 5x − 10 have?
- Exactly one :: Combine like terms first: 4x + x = 5x. Both sides have 5x, so the x-terms cancel.
* None
- Infinitely many :: The x-terms cancel, but −12 = −10 is false. Infinitely many needs a true leftover.
> Left side: 4x − 12 + x = 5x − 12. The equation is 5x − 12 = 5x − 10.
> Subtract 5x: −12 = −10. That's false, so no value of x works.
```

## Find the missing constant

Sometimes a letter like a, b or k stands for a fixed number you don't know yet.

- **No solution:** make the x-coefficients equal. The plain numbers must be different.
- **Infinitely many:** make the x-coefficients equal **and** the plain numbers equal.

Distribute and combine first. A hidden x-term changes the coefficient.

```quiz
2(ax − 3) + 4x = 10x + b. In the equation, a and b are constants, and it has infinitely many solutions. What is the value of a + b?
* −3
- −1 :: You missed the + 4x. The x-coefficient on the left is 2a + 4, not 2a.
- 9 :: 2 × (−3) = −6, so b = −6, not 6.
- 0 :: The 2 multiplies the −3 too. The left side's number is −6, so b = −6.
> Simplify the left side: 2ax − 6 + 4x = (2a + 4)x − 6.
> Infinitely many solutions means both sides match exactly.
> x-coefficients: 2a + 4 = 10, so a = 3. Plain numbers: b = −6.
> So a + b = 3 + (−6) = −3.
```

## Trap: x = 0 still counts

Ending with x = 0 does **not** mean "no solution". No solution only comes from a false statement, like 3 = 7.

```quiz
How many solutions does 5x + 3 = 2x + 3 have?
* Exactly one
- None :: Trap: x = 0 is a real answer. Check it: 5(0) + 3 = 3 and 2(0) + 3 = 3.
- Infinitely many :: That needs identical sides. Here the x-coefficients, 5 and 2, are different.
> Subtract 2x and 3 from both sides: 3x = 0, so x = 0.
> Different x-coefficients always mean exactly one solution, even when that solution is 0.
```

## Your turn: easy

Name the letter, put the rate on it, and keep the fee on its own.

```check
m-0865
```

## Your turn: medium

A group appears on both sides. Solve for the group as one block.

```check
m-1133
```

## Your turn: hard

Distribute first, then use the no-solution rule.

```check
m-0705
```

## Recap

- Read the last line: do they want x, an expression, a count or a constant?
- Clear fractions by multiplying every term, whole numbers too.
- A minus in front of parentheses flips every sign inside.
- Want an expression? Scale the equation or solve for the repeated block.
- Count solutions by simplifying both sides to ax + b and comparing.
- If the x-terms cancel: a false leftover means none, a true one means infinitely many.
