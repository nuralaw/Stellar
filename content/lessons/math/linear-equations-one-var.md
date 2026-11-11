---
title: Linear Equations in One Variable
skill: linear-equations-one-var
domain: algebra
section: math
summary: Solve one-variable linear equations fast, build them from word problems, and tell if an equation has one, no, or infinitely many solutions.
minutes: 11
---

> **Key idea:** Simplify each side to the form `ax + b` before anything else. If the x-terms cancel, a false leftover (like 1 = 4) means no solution, and a true one (like 0 = 0) means infinitely many.

## What this question looks like

You'll see one variable (usually x, but maybe t, n or p) and no squares or other powers. That's what **linear** means: the variable only appears to the first power. These are some of the most common SAT Math questions, and many sit early in a module.

There are four main versions:

- **Straight solve.** Parentheses, fractions or x on both sides, like `4(x − 1) + 3 = 2x + 9`. You find x, or something built from it, like 3x or x + 5.
- **Word problem.** A story with a flat fee plus a rate per hour, per item or per mile. You build the equation, then solve it.
- **How many solutions?** Does the equation have exactly one solution, no solution, or infinitely many?
- **Find the constant.** A letter like a, k or c stands for a fixed number you don't know yet. Which value gives no solution (or infinitely many)?

Many of these are student-produced response questions. There are no choices; you type in your own number.

## The method

Use this routine on every straight solve and word problem.

1. **Read the last line first.** Find exactly what's wanted: x, 2x, x − 3 or a constant k. Note it on your scratch paper.
2. **Clear fractions and decimals.** Multiply *every* term on both sides by the lowest common denominator, or by 10 or 100 for decimals.
3. **Distribute and combine.** Multiply out the parentheses, watching any minus sign in front. Then combine like terms on each side.
4. **Collect.** Move the x-terms to one side and the plain numbers to the other. Pick the side that keeps the x-coefficient positive, so you track fewer negatives.
5. **Divide** by the number in front of x.
6. **Answer the question asked.** If it wants 2x, double your x.
7. **Check** your answer in the *original* equation, or with Desmos.

### How many solutions, or find the constant

Don't solve all the way. Simplify each side to the form `ax + b`, then compare the two sides using the table in the next section.

### Word problems

First write down what your letter stands for, with units ("h = hours of labor"). The amount multiplied by the variable is the **rate**. The amount that stays the same no matter what is the flat fee or starting value.

## Rules and formulas you need

After you simplify both sides, every linear equation looks like `ax + b = cx + d`. Comparing the pieces tells you how many solutions it has.

| After simplifying | Solutions | Example |
|---|---|---|
| a ≠ c | Exactly one | `3x + 1 = 5x + 1` gives x = 0 |
| a = c, b ≠ d | None | `3x + 1 = 3x + 4` gives 1 = 4 (false) |
| a = c, b = d | Infinitely many | `3x + 1 = 3x + 1` gives 0 = 0 (true) |

- A linear equation can have 0, 1 or infinitely many solutions. It **never** has exactly 2.
- A minus sign in front of parentheses changes the sign of *every* term inside: `−(2x − 5) = −2x + 5`.

### Finding the constant

- **No solution:** make the x-coefficients equal and check that the constants are different.
- **Infinitely many:** make the x-coefficients equal *and* the constants equal.
- **Plug-in shortcut** for infinitely many: the equation is true for every x, so x = 0 gives one condition and x = 1 gives another.

### Word problem phrases

| Phrase | Meaning |
|---|---|
| "flat fee," "initial," "one-time" | constant term (not times x) |
| "per hour," "each," "for every" | coefficient of x (the rate) |
| "5 less than x" | x − 5 (not 5 − x) |
| "the same cost," "equal," "break even" | set the two expressions equal |

## Worked examples

### Example 1: Solve, then answer the real question

`5(x − 3) − 2x = 4x − 22`

What is the value of 2x?

- (A) −14
- (B) 7
- (C) 14
- (D) 38

**Solution**

The question asks for 2x, not x, so note that first.

Distribute the 5: `5x − 15 − 2x = 4x − 22`. Combine the x-terms on the left: `3x − 15 = 4x − 22`.

Keep x positive by moving the 3x to the right and the −22 to the left: `−15 + 22 = 4x − 3x`, which gives 7 = x.

So 2x = 14. Check in the original equation: the left side is 5(4) − 14 = 6, and the right side is 28 − 22 = 6. They match.

Why the others are wrong: (B) is x, not 2x. (A) comes from flipping the sign of x by mistake. (D) comes from distributing the 5 to the x but not to the 3 (writing 5x − 3), which gives x = 19.

**Answer:** (C)

### Example 2: Two price plans

Studio A charges a one-time fee of $35 plus $18 per hour to rent a practice room. Studio B charges a one-time fee of $15 plus $23 per hour. For how many hours of rental will the two studios charge exactly the same total amount?

**Solution**

Let h = the number of hours. The fees are the constants and the hourly prices are the coefficients:

- Studio A: `35 + 18h`
- Studio B: `15 + 23h`

"Exactly the same total" means set them equal: `35 + 18h = 15 + 23h`.

Move the smaller h-term over: `35 − 15 = 23h − 18h`, so 20 = 5h, and h = 4.

Check: Studio A costs 35 + 72 = $107, and Studio B costs 15 + 92 = $107.

**Answer:** 4

### Example 3: Find the constant for no solution

`6x − 2(x + 5) = ax + 7`

In the equation above, a is a constant. For what value of a does the equation have no solution?

- (A) −4
- (B) 4
- (C) 6
- (D) 8

**Solution**

Don't solve. Simplify each side and compare. Left side: `6x − 2x − 10 = 4x − 10`. The equation is now `4x − 10 = ax + 7`.

For no solution, the x-coefficients must match and the constants must differ. The constants are −10 and 7, which are already different. So a = 4.

Check: with a = 4 you get `4x − 10 = 4x + 7`. Subtract 4x and you're left with −10 = 7, which is false. That means no solution.

Why the others are wrong: (C) skips the −2x that comes from distributing. (D) distributes the −2 as +2x. (A) has the wrong sign. With any value other than 4, the x-coefficients differ, so the equation has exactly one solution.

**Answer:** (B)

### Example 4: Two constants, infinitely many solutions

`2(3x + p) − x = qx + 14`

In the equation above, p and q are constants. If the equation has infinitely many solutions, what is the value of p + q?

**Solution**

Simplify the left side: `6x + 2p − x = 5x + 2p`. The equation is now `5x + 2p = qx + 14`.

Infinitely many solutions means both sides are identical:

- x-coefficients: q = 5
- constants: 2p = 14, so p = 7

So p + q = 7 + 5 = 12.

Second method (plug in): if the equation is true for every x, then at x = 0 it reads 2p = 14, so p = 7. At x = 1 it reads `2(3 + 7) − 1 = q + 14`, so 19 = q + 14 and q = 5. Same result.

**Answer:** 12

## Traps to avoid

- **Answering x when they asked for something else.** The test often asks for 2x, x + 4 or 1/x and puts the value of x among the choices. Re-read the last line.
- **Dropping a negative when distributing.** `10 − 3(x − 2)` is `10 − 3x + 6`, not `10 − 3x − 6`. Many wrong choices come from this one slip.
- **Clearing only some of the fractions.** *Every* term gets multiplied by the common denominator, including whole numbers with no fraction.
- **Mixing up no solution and infinitely many.** Both start with the x-terms canceling. Read the leftover statement before you pick.
- **Calling x = 0 "no solution."** If you end up with 4x = 0, then x = 0 is one perfectly good solution.
- **Comparing coefficients too early.** In Example 3, the 6x in front isn't the coefficient that matters. Combine like terms first, then compare.
- **Swapping fee and rate.** In "$35 plus $18 per hour," the 18 goes with the variable. `35h + 18` is a common trap answer.
- **Keeping an impossible answer.** Negative hours or a negative number of tickets usually means a sign error.

## Desmos shortcut

Desmos is best for checking your work and for messy numbers. For simple equations, two lines of algebra are often faster, and for find-the-constant questions, comparing coefficients by hand is faster and exact.

### Solve by typing the equation

- Type the whole equation on one line, for example `5(x-3)-2x=4x-22`.
- Desmos draws a vertical line at the solution (here x = 7). Read its x-value off the grid; if clicking the line shows no label, graph each side instead (below).
- If the variable isn't x (say t), retype it with x. Otherwise Desmos offers to make t a slider.
- No line showing? Zoom out. The answer might be off-screen.

### Graph each side to count solutions

- Line 1: `y=5(x-3)-2x`. Line 2: `y=4x-22`.
- Click the point where they cross. Its x-coordinate is the solution.
- Parallel lines that never cross mean no solution.
- See only one line? The two graphs may sit on top of each other (infinitely many). Click the colored circle next to one line to hide it and check.
- Lines with very close slopes can *look* parallel. For number-of-solutions questions, confirm by comparing coefficients.

### Check an answer

Type each side with your number in place of x, for example `5(7-3)-2(7)` and `4(7)-22`. If both show the same value, you're right.

### Slider for constants (backup only)

Type `y=4x-10` and `y=ax+7` and add a slider for a. The lines turn parallel at a = 4, but reading the coefficients is faster and exact.

## Quick checklist

- What exactly does the question ask for: x, an expression, or a constant?
- Did I clear *all* fractions and distribute every negative sign?
- Did I combine like terms on each side before comparing coefficients?
- Did the x-terms cancel? If so, is the leftover false (no solution) or true (infinitely many)?
- In a word problem, is the rate attached to the variable and the flat fee left alone?
- Did I check my answer in the original equation or in Desmos?
