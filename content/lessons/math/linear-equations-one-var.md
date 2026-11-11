---
title: Linear Equations in One Variable
skill: linear-equations-one-var
domain: algebra
section: math
summary: Solve any one-variable linear equation fast, turn word problems into equations, and tell at a glance whether an equation has one solution, no solution, or infinitely many.
minutes: 9
---

## What this question looks like

These are some of the most common questions in SAT Math, and many of them sit early in a module. You'll see one letter (usually x, but it could be t, n or p) and no squares or powers. The question is linear, which means the variable only ever shows up to the first power.

You'll usually meet one of four versions:

- **Straight solve.** An equation with parentheses, fractions or the variable on both sides, like `4(x − 1) + 3 = 2x + 9`. The question asks for x, or sometimes for something built from x, like 3x or x + 5.
- **Word problem.** A story with a flat fee plus a rate per hour, per item or per mile. You build the equation yourself and solve it.
- **How many solutions?** The question asks whether the equation has exactly one solution, no solution, or infinitely many solutions.
- **Find the constant.** A letter like a, k or c is a fixed number you don't know yet. The question asks which value of it makes the equation have no solution (or infinitely many).

Many of these are student-produced response questions, so there are no answer choices. You type in your own number.

## The method

Use this routine on every straight solve and word problem:

1. **Read the last line first.** Find out exactly what the question wants: x, 2x, x − 3, or the constant k. Circle it on your scratch paper.
2. **Clear fractions and decimals.** Multiply *every* term on both sides by the lowest common denominator, or by 10 or 100 for decimals. Now you're working with whole numbers.
3. **Distribute and combine.** Multiply out the parentheses, paying close attention to a minus sign in front. Then combine like terms on each side separately.
4. **Collect.** Move the x-terms to one side and the plain numbers to the other. Tip: move x to whichever side keeps its coefficient positive. That means fewer negative signs to track.
5. **Divide** by the number in front of x.
6. **Answer the question that was asked.** If it wanted 2x, double your x before you answer.
7. **Check** by putting your answer back into the *original* equation, or by using Desmos (see below).

For **how-many-solutions** and **find-the-constant** questions, use a different routine. Simplify each side all the way down to the form `ax + b`, then compare the two sides. You don't need to finish solving. The table below tells you the answer.

For **word problems**, first write down what your letter stands for, with units (say, "h = hours of labor"). The amount that gets multiplied by the variable is the *rate*. The amount that stays the same no matter what is the *flat fee* or *starting value*.

## Rules and formulas you need

After you simplify both sides, every linear equation looks like `ax + b = cx + d`:

| What you see after simplifying | Number of solutions | Example |
|---|---|---|
| The x-coefficients are different (a ≠ c) | Exactly one | `3x + 1 = 5x + 1` gives x = 0 |
| Same x-coefficients, different constants (a = c, b ≠ d) | No solution | `3x + 1 = 3x + 4` turns into 1 = 4, which is false |
| Both sides are identical (a = c and b = d) | Infinitely many | `3x + 1 = 3x + 1` turns into 0 = 0, which is always true |

> **Key idea:** When the x-terms cancel out, look at what's left. A **false** statement (like 1 = 4) means **no solution**. A **true** statement (like 0 = 0) means **infinitely many** solutions.

More facts to know cold:

- A linear equation in one variable can have 0, 1 or infinitely many solutions. It **never** has exactly 2.
- x = 0 counts as a real solution. Getting 0 doesn't mean "no solution."
- A minus sign in front of parentheses changes the sign of *every* term inside: `−(2x − 5) = −2x + 5`.
- To find the constant for **no solution**, make the x-coefficients equal and check that the constants are different. To find the constants for **infinitely many**, make the x-coefficients equal *and* the constants equal.
- Quick trick for infinitely many: since the equation is true for every x, you can plug in x = 0 to get one condition, and x = 1 to get another.

| Word problem phrase | Meaning |
|---|---|
| "flat fee," "initial," "one-time" | constant term (not multiplied by x) |
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

- **Answering x when they asked for something else.** The test often asks for 2x, x + 4 or 1/x, and the value of x is planted in the answer choices. Re-read the last line before you click.
- **Dropping a negative when distributing.** `10 − 3(x − 2)` is `10 − 3x + 6`, not `10 − 3x − 6`. This single mistake is behind many wrong choices.
- **Clearing only some of the fractions.** When you multiply by the common denominator, *every* term gets multiplied, including whole numbers that have no fraction.
- **Mixing up no solution and infinitely many.** Both happen when the x-terms cancel. Look at the leftover statement: false means none, true means infinitely many.
- **Calling x = 0 "no solution."** If you end up with 4x = 0, then x = 0 is one perfectly good solution.
- **Finding the constant from an unsimplified equation.** In Example 3, the 6x in front isn't the coefficient that matters. Combine like terms first, then compare.
- **Swapping fee and rate.** In "$35 plus $18 per hour," the 18 goes with the variable. Writing `35h + 18` is a common trap answer.
- **Keeping an impossible answer.** Negative hours or a negative number of tickets usually means a sign error.

## Desmos shortcut

Desmos is great for checking your work and for messy numbers. For simple equations, it's often slower than two lines of algebra. For find-the-constant questions, comparing coefficients by hand is faster and safer.

**Solve an equation by typing it in as written.**

- Type the whole equation into one line, for example `5(x-3)-2x=4x-22`.
- Desmos draws a vertical line. Click it or hover over it to read its x-value. Here it's x = 7.
- If the problem uses a letter other than x (say t), retype it with x. Otherwise Desmos will offer to make t a slider.
- No line showing? Zoom out. The answer might be off-screen.

**Graph each side separately to count solutions.**

- Line 1: `y=5(x-3)-2x`. Line 2: `y=4x-22`.
- Click the point where they cross. The x-coordinate is the solution.
- Lines that never cross (parallel) mean no solution. If you see only one line, the two graphs may be sitting on top of each other, which means infinitely many solutions. Click the colored circle next to one line to hide it and check.
- Be careful: two lines with very close slopes can *look* parallel. When the question is about the number of solutions, confirm by comparing coefficients.

**Check an answer.** Type the original equation with your number in place of x, for example `5(7-3)-2(7)` and `4(7)-22`. If both show the same value, you're right.

**Slider for constants (backup only).** Type `y=4x-10` and `y=ax+7` and add a slider for a. The lines turn parallel at a = 4, but reading coefficients is faster and exact.

## Quick checklist

- What exactly does the question ask for: x, an expression, or a constant?
- Did I clear *all* fractions and distribute every negative sign?
- Did I combine like terms on each side before comparing coefficients?
- Did the x-terms cancel? If so, is the leftover statement false (no solution) or true (infinitely many)?
- In a word problem, is the rate attached to the variable and the flat fee left alone?
- Did I check my answer in the original equation or in Desmos?

## Sources

- [College Board: SAT Math, Algebra question types](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/algebra)
- [College Board: SAT content domains](https://satsuite.collegeboard.org/higher-ed-professionals/sat-validity/content-domains)
- [Test Ninjas: SAT Linear Equations in One Variable](https://www.test-ninjas.com/sat-linear-equations-in-one-variable)
- [JustLockedIn: Analyze Solutions (linear equations in one variable)](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-equations-in-one-variable/analyze-solutions.html)
- [Open Exam Prep: Linear Equations in One Variable](https://open-exam-prep.com/study-guides/sat-math/algebra-linear/linear-equations-one-variable)
- [Varsity Tutors: SAT Equations with One Variable](https://www.varsitytutors.com/practice/subjects/sat-math/lessons/equations-with-one-variable)
- [Acely: Desmos Cheat Sheet for the SAT](https://acely.com/sat-prep/desmos-cheat-sheet)
- [Say Hello College: Step-by-Step Guide to the Desmos SAT Calculator](https://sayhellocollege.com/blog/guide-to-using-the-desmos-sat-calculator/)
- [MathChops: A Five Minute DSAT Desmos Intro](https://mathchops.substack.com/p/a-five-minute-dsat-desmos-intro)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [YouTube: The Only SAT Math Desmos Guide You'll Ever Need](https://www.youtube.com/watch?v=-pGNBb8M3LQ)
- [The Test Advantage: Fact-checking the viral "1500 in 2 weeks" Reddit guide](https://thetestadvantage.com/blog/pro-tutor-fact-checks-viral-1500-sat-in-2-weeks-reddit-guide)
