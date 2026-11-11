---
title: Systems of Linear Equations
skill: systems-linear
domain: algebra
section: math
summary: Solve any system of two linear equations quickly, find combinations like x + y without solving, and spot no-solution and infinite-solution systems in seconds.
minutes: 11
---

## What this question looks like

A *system* is two equations that must both be true at the same time. On the Digital SAT you'll usually see two lines stacked on top of each other, like `3x + 2y = 12` and `x − y = 1`, and one of these questions:

- "What is the solution (x, y) to the system?" or "What is the value of y?"
- "What is the value of x + y?" (or 2x − y, or some other mix of x and y)
- "How many solutions does the system have?" (exactly one, none, or infinitely many)
- "In the system, k is a constant. If the system has no solution, what is the value of k?"
- A word problem with two unknowns: tickets and prices, coins, two phone plans, mixtures. You build the two equations yourself.

The *solution* of a system is the point where the two lines cross. Every method below is a way of finding that point, or of showing there isn't one.

## The method

1. **Read the last line first.** Find out exactly what is asked: x, y, x + y, a constant, or the number of solutions. This decides your method.
2. **Line the equations up.** Move things so both look like `ax + by = c`: x-terms over x-terms, y-terms over y-terms, numbers on the right. Clear fractions or decimals by multiplying the whole equation if they bother you.
3. **Pick the fastest tool.**
   - One variable already alone (`y = 4x − 3`) → **substitution**: put that expression in place of y in the other equation.
   - Coefficients that match, are opposites, or match after one multiplication → **elimination**: add or subtract the equations so one variable disappears.
   - Ugly decimals, or you just want certainty → **Desmos**: graph both, click the crossing point.
   - Question about *how many* solutions or an unknown constant → **compare coefficients** (see the rules below). Don't solve at all.
4. **For combinations, try adding or subtracting the equations as they are** before solving. Very often x + y falls out in one step.
5. **Answer the question that was asked.** If you found x but they want y, or a count but they want money, take the last step.
6. **Check in both original equations** (or glance at the Desmos graph). It takes ten seconds and catches sign errors.

> **Key idea:** Elimination works because if two equations are true, their sum and difference are true too. When you scale an equation, multiply *every* term, including the number on the right.

## Rules and formulas you need

Write both equations as `a₁x + b₁y = c₁` and `a₂x + b₂y = c₂`. Then ask one question: **is the left side of one equation just a multiple of the left side of the other?**

| What you see | Slopes and intercepts | Graph | Number of solutions |
|---|---|---|---|
| Left sides are NOT multiples (a₁/a₂ ≠ b₁/b₂) | different slopes | lines cross once | exactly one |
| Left sides are multiples, right sides are not (a₁/a₂ = b₁/b₂ ≠ c₁/c₂) | same slope, different y-intercept | parallel lines | none |
| Whole equation is a multiple (a₁/a₂ = b₁/b₂ = c₁/c₂) | same slope, same y-intercept | the same line twice | infinitely many |

Examples of each:

- `2x + 3y = 7` and `x − y = 1` → 2/1 ≠ 3/(−1), so **one solution**.
- `2x + 3y = 7` and `4x + 6y = 9` → the left side doubled, but 7 doubled is 14, not 9, so **no solution**.
- `2x + 3y = 7` and `4x + 6y = 14` → everything doubled, so **infinitely many solutions**.

What elimination tells you:

| You end up with | Meaning |
|---|---|
| a real value, like x = 3 | one solution |
| a false statement, like 0 = 5 | no solution |
| a true statement, like 0 = 0 | infinitely many solutions |

More facts to know cold:

- Two different lines can never meet at exactly two points. "Exactly two solutions" is always wrong for a linear system.
- In slope-intercept form `y = mx + b`, the slope is m. From `ax + by = c`, the slope is `−a/b`.
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

- **Answering for the wrong thing.** You solve for x, but the question asks for y, x + y, or the price instead of the count. The test puts your half-finished number in the choices.
- **Scaling only part of an equation.** When you multiply to line up coefficients, the number on the right side gets multiplied too. Forgetting it is the most common elimination error.
- **Sign mistakes when subtracting.** Subtracting −4y is adding 4y. Write the subtraction out in parentheses if you're unsure.
- **Mixing up "no solution" and "infinitely many."** Equal slopes alone don't decide it. You must also compare the constants.
- **Dropping a negative in a ratio.** −2 and +2 are different multipliers. A lost sign can flip parallel lines into crossing lines.
- **Comparing coefficients before lining the equations up.** If one equation is `y = 3x + 2` and the other is `6x − 2y = −4`, rewrite the first as `3x − y = −2` first. Now you can see the second is double the first, so there are infinitely many solutions.
- **Backwards translations in word problems.** "There are 3 times as many apples as oranges" means A = 3R, not R = 3A. Test it with small numbers: 3 oranges should give 9 apples.
- **Picking "exactly two solutions."** Two lines can't do that. It's always a trap choice.

## Desmos shortcut

Desmos is allowed on every Digital SAT math question, and for systems it is a real weapon.

**Finding the solution.** Type each equation on its own line, exactly as given. You don't need to solve for y first. Click the point where the lines cross and Desmos shows its coordinates. Then do the last step the question asks for (x + y, 2x − y, and so on) with those numbers.

Try it with `0.4x + 1.5y = 7` and `2.6x − 0.9y = 2.9`. Doing this by hand is slow and full of decimals. In Desmos you click the crossing and read (2.5, 4), so x + y = 6.5.

**Variables not called x and y?** If the system uses a and b, or p and q, retype it with x and y. Desmos only graphs x and y.

**How many solutions?** Graph both lines and look:

- they cross once → one solution
- they never meet (parallel) → no solution
- you only see one line, because the second sits exactly on top of the first → infinitely many (hide one equation with its color circle to confirm the other is still there)

**Unknown constant (sliders).** Type `kx + 15y = 2` and Desmos offers to add a slider for k. Drag it and watch the second line turn. When the lines go parallel, the crossing point disappears. Dragging is a good check, but exact values are hard to land on. A better move is to work out k with the multiplier rule (it takes 20 seconds), then type `k = −10` into the slider box to confirm the lines are parallel.

> **Tip:** For constant questions, algebra first and Desmos second. The ratio check is faster, but Desmos is great for catching a sign error.

> **Trap:** Desmos rounds. If a crossing shows as (1.333, 2.667), the exact values are probably 4/3 and 8/3. In a student-produced response, type the fraction or enough decimal places (1.333) to fill the answer box.

## Quick checklist

- Did I read exactly what the question asks for: x, y, a combination, a constant, or a count?
- Are both equations lined up as `ax + by = c` before I compare anything?
- For x + y type questions, did I try simply adding or subtracting the equations first?
- When I scaled an equation, did I multiply every term, including the constant?
- For no-solution or infinitely-many questions, did I check both the coefficients AND the constants?
- Did I plug my answer back into both equations, or confirm it on the Desmos graph?

## Sources

- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [The only SAT Math DESMOS Guide you'll ever need (YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ)
- [Acely: Linear systems with no solutions using a slider](https://acely.com/desmos-guide-library/linear-systems-of-equations-no-solutions-w-slider-spr)
- [PrepScholar: Systems of Equations in SAT Math](https://blog.prepscholar.com/systems-of-equations-sat-math-algebra-prep-and-practice)
- [Test Ninjas: SAT Systems of Linear Equations](https://www.test-ninjas.com/sat-systems-of-linear-equations)
- [Open Exam Prep: Special solutions and constants](https://open-exam-prep.com/study-guides/sat-math/algebra-systems/systems-special-solutions-constants)
- [JustLockedIn: Number of solutions patterns](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/number-of-solutions.html)
- [JustLockedIn: Structured systems (asking for combinations)](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/structured-systems.html)
- [JustLockedIn: Systems word problems](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/word-problems.html)
- [Varsity Tutors: SAT Math systems of equations lesson](https://www.varsitytutors.com/practice/subjects/sat-math/lessons/systems-of-equations)
- [The Test Advantage: SAT system of equations solutions explained](https://thetestadvantage.com/blog/sat-system-of-equations-solution-explained)
- [Albert.io: System of linear equations SAT study guide](https://www.albert.io/blog/system-of-linear-equations-made-simple-a-sat-math-study-guide/)
- [Axiom Academy: SAT systems of linear equations](https://theaxiomacademy.org/learn/sat-systems-of-linear-equations)
- [Quiz-Tree: Systems of 2 linear equations in 2 variables](https://www.quiz-tree.com/sat-algebra/topic/systems-of-2-linear-equations-in-2-variables)
- [College Board: What's on the SAT Math section](https://satsuite.collegeboard.org/sat/whats-on-the-test/math)
