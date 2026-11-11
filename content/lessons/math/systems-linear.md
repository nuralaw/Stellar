---
title: Systems of Linear Equations
skill: systems-linear
domain: algebra
section: math
summary: Solve two-equation systems fast, get combos like x + y without solving, and spot no-solution and infinite-solution systems in seconds.
minutes: 11
---

> **Key idea:** Read what's asked before you solve. Combos like x + y often fall out by adding or subtracting the equations, and "how many solutions" only needs a coefficient check.

## What this question looks like

These questions give you two linear equations that must both be true at once, called a **system**. You'll usually see them stacked, like `3x + 2y = 12` and `x − y = 1`, with one of these stems:

- "What is the solution (x, y) to the system?" or "What is the value of y?"
- "What is the value of x + y?" (or 2x − y, or another mix)
- "How many solutions does the system have?" (exactly one, none, or infinitely many)
- "k is a constant. If the system has no solution, what is the value of k?"
- A word problem with two unknowns (tickets, coins, phone plans, mixtures) where you build both equations.

The solution of a system is the point where the two lines cross. Every method below finds that point or shows there isn't one.

## The method

Follow these steps on every system; step 3 picks the tool.

1. **Read the last line first.** Is it asking for x, y, x + y, a constant, or the number of solutions?
2. **Line the equations up** as `ax + by = c`: x under x, y under y, numbers on the right. Multiply through to clear fractions or decimals if they bother you.
3. **Pick the fastest tool** from the list below.
4. **For a combination, add or subtract the equations as they are** before solving. Often x + y appears in one step.
5. **Answer what was asked.** If you found x but they want y, take the last step.
6. **Check in both original equations,** or glance at the Desmos graph. It takes ten seconds.

How to pick the tool:

- **Substitution** when one variable is already alone (`y = 4x − 3`): put that expression in place of y in the other equation.
- **Elimination** when coefficients match, are opposites, or match after one multiplication: add or subtract so one variable disappears. It works because the sum or difference of two true equations is also true.
- **Desmos** for ugly decimals, or when you want certainty: graph both and click the crossing.
- **Compare coefficients** for "how many solutions" or an unknown constant. Don't solve at all (see the rules below).

## Rules and formulas you need

Write both equations as `a₁x + b₁y = c₁` and `a₂x + b₂y = c₂`. Then ask: is the left side of one just a multiple of the other's left side?

| What you see | Ratios | Graph | Solutions |
|---|---|---|---|
| Left sides not multiples | a₁/a₂ ≠ b₁/b₂ | cross once | one |
| Left sides multiples, right sides not | a₁/a₂ = b₁/b₂ ≠ c₁/c₂ | parallel | none |
| Whole equation a multiple | a₁/a₂ = b₁/b₂ = c₁/c₂ | same line | infinitely many |

Parallel lines have the same slope but different y-intercepts. The same line has the same slope and the same y-intercept.

### One example of each

- `2x + 3y = 7` and `x − y = 1`: 2/1 ≠ 3/(−1), so one solution.
- `2x + 3y = 7` and `4x + 6y = 9`: the left side doubled, but 7 doubled is 14, not 9, so no solution.
- `2x + 3y = 7` and `4x + 6y = 14`: everything doubled, so infinitely many solutions.

### What elimination leaves you with

| You end up with | Meaning |
|---|---|
| a value, like x = 3 | one solution |
| a false statement, like 0 = 5 | no solution |
| a true statement, like 0 = 0 | infinitely many |

### Facts to know cold

- Two different lines can never meet at exactly two points.
- The slope of `y = mx + b` is m. The slope of `ax + by = c` is −a/b.
- Whether there's exactly one solution depends only on the x and y coefficients, never on the numbers on the right.

## Worked examples

### Example 1: Asking for x + y

`5x + 3y = 31`
`3x + 5y = 33`

If (x, y) is the solution to the system above, what is the value of x + y?

- (A) −1
- (B) 4.5
- (C) 8
- (D) 64

**Solution**

The question wants x + y, not x or y. Look at the coefficients: 5 and 3 in one equation, 3 and 5 in the other. Adding the equations gives 8 of each:

`8x + 8y = 64`

Divide every term by 8: x + y = 8. No need to find x and y separately.

Double-check by solving fully: subtracting the equations gives `2x − 2y = −2`, so x − y = −1. Together with x + y = 8, that gives x = 3.5 and y = 4.5. Test: 5(3.5) + 3(4.5) = 17.5 + 13.5 = 31. Good.

Why the others are wrong: (A) is x − y, from subtracting instead of adding. (B) is y alone. (D) forgets to divide by 8.

**Answer:** (C)

### Example 2: A constant that makes no solution

`4x − 6y = 9`
`kx + 15y = 2`

In the system above, k is a constant. If the system has no solution, what is the value of k?

- (A) −45/2
- (B) −10
- (C) −5/2
- (D) 10

**Solution**

No solution means parallel lines: the left sides must be multiples of each other, but the right sides must not.

Find the multiplier using the y-terms, since both are known: to turn −6 into 15, multiply by 15 ÷ (−6) = −5/2.

Apply the same multiplier to the x-coefficient: k = 4 × (−5/2) = −10.

Now check the right side. Multiplying 9 by −5/2 gives −22.5, and the second equation has 2. Since −22.5 ≠ 2, the lines are parallel and never touch, so there really is no solution.

Why the others are wrong: (C) is the multiplier itself, not k. (D) drops the negative sign, which gives lines with opposite slopes that cross once. (A) comes from setting up the ratio upside down (4/(−6) = 15/k). With (A), (C) or (D) the slopes differ, so the system has exactly one solution.

**Answer:** (B)

### Example 3: Infinitely many solutions with fractions (student-produced response)

`(1/2)x + (3/4)y = 5`
`ax + 6y = b`

In the system above, a and b are constants. If the system has infinitely many solutions, what is the value of a + b?

**Solution**

Infinitely many solutions means the second equation is the first one multiplied by some number. *Everything* gets multiplied, including the 5.

Look at the y-terms: 3/4 becomes 6, so the multiplier is 6 ÷ (3/4) = 8.

- a = 8 × (1/2) = 4
- b = 8 × 5 = 40

So the second equation is `4x + 6y = 40`, and a + b = 4 + 40 = 44.

Second check, a different way: clear fractions in the first equation by multiplying by 4, giving `2x + 3y = 20`. Doubling that gives `4x + 6y = 40`. Same result.

A common slip is scaling only the left side and leaving b = 5 (giving 9), or stopping at `2x + 3y = 20` and using b = 20 (giving 24).

**Answer:** 44

### Example 4: Word problem

A school club sold small candles for $6 each and large candles for $10 each. The club sold 85 candles in total and collected $650. How many large candles did the club sell?

- (A) 35
- (B) 50
- (C) 65
- (D) 140

**Solution**

Name the unknowns: s = number of small candles, L = number of large candles. Each sentence gives one equation:

- Count: `s + L = 85`
- Money: `6s + 10L = 650`

Elimination is fastest. Multiply the count equation by 6: `6s + 6L = 510`. Subtract it from the money equation:

`4L = 140`, so L = 35.

Then s = 85 − 35 = 50. Check the money: 6(50) + 10(35) = 300 + 350 = 650. Correct.

Why the others are wrong: (B) is the number of *small* candles. (C) is 650 ÷ 10, what you'd get if every candle were large. (D) forgets to divide 140 by 4.

**Answer:** (A)

## Traps to avoid

Each of these mistakes has a matching wrong choice waiting for you.

- **Answering for the wrong thing.** You found x, but they asked for y, x + y, or a price instead of a count. Your half-finished number is in the choices.
- **Scaling only part of an equation.** When you multiply to line up coefficients, multiply the right side too. This is the most common elimination error.
- **Sign slips when subtracting.** Subtracting −4y means adding 4y. Write the subtraction in parentheses if unsure.
- **Mixing up "no solution" and "infinitely many".** Equal slopes alone don't decide it; compare the constants too.
- **Dropping a negative in a ratio.** −2 and 2 are different multipliers. A lost sign turns parallel lines into crossing ones.
- **Comparing before lining up.** For `y = 3x + 2` and `6x − 2y = −4`, first rewrite as `3x − y = −2`. Now the second is clearly double the first: infinitely many solutions.
- **Backwards word translations.** "3 times as many apples as oranges" is A = 3R, not R = 3A. Test it: 3 oranges should give 9 apples.
- **Picking "exactly two solutions".** Two lines can't do that, so it's always a trap choice.

## Desmos shortcut

Desmos is allowed on every Digital SAT math question, and it solves most systems in seconds.

- **Find the solution.** Type each equation on its own line, exactly as given. Click the crossing point to see its coordinates, then do the last step the question asks for.
- **Decimals.** By hand, `0.4x + 1.5y = 7` and `2.6x − 0.9y = 2.9` are slow. In Desmos you click the crossing, read (2.5, 4), and get x + y = 6.5.
- **Other letters.** Desmos only graphs x and y, so retype a system in a and b (or p and q) using x and y.
- **How many solutions?** One crossing: one solution. Parallel lines: none. Only one line visible: infinitely many (hide one equation with its color circle to see the other is still there).
- **Unknown constant.** Type `kx + 15y = 2` and add the slider for k. Exact values are hard to drag to, so work out k with the multiplier rule, then type `k = −10` in the slider box to confirm the lines are parallel.

> **Tip:** For constant questions, do the algebra first and use Desmos second. The ratio check is faster; Desmos catches sign errors.

> **Trap:** Desmos rounds. A crossing at (1.333, 2.667) is probably exactly 4/3 and 8/3. In a student-produced response, type the fraction or enough decimal places (1.333) to fill the box.

## Quick checklist

- What exactly is asked: x, y, a combination, a constant, or a count?
- Are both equations lined up as `ax + by = c`?
- For x + y questions, did I try adding or subtracting the equations first?
- When I scaled an equation, did I multiply every term, including the constant?
- For no-solution or infinitely-many questions, did I check the coefficients AND the constants?
- Did I check my answer in both equations, or on the Desmos graph?
