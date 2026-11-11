---
title: Linear equations in one variable
skill: linear-equations-one-var
domain: algebra
section: math
summary: Solve one-variable linear equations fast, find values like 6x + 9 without x, turn stories into equations, and spot no-solution cases.
minutes: 21
---

## What this question looks like

The equation has one unknown letter. It is usually x, but it can be t, n, p or any other letter. The letter is never squared, never under a root and never in a denominator. That is what *linear* means: the variable appears only to the first power, like 3x or −x/2.

You will see an equation, a short story, or both. Common question stems:

- "What value of x is the solution to the given equation?"
- "If 4x + 6 = 30, what is the value of 2x + 3?"
- "Which equation represents this situation?"
- "Which statement is the best interpretation of the solution in this context?"
- "How many solutions does the given equation have?"
- "For what value of k does the equation have no solution?"

College Board does not publish a count for each skill. Algebra is about 35% of the Math score: 13 to 15 of the 40 scored questions, shared by five linear skills. So expect around three questions of this type per test (our estimate). Many of them are student-produced response (SPR) questions: there are no answer choices, and you type your own answer. About a quarter of all math questions work this way.

| Sub-type | What you do |
|---|---|
| Straight solve | Clear fractions, distribute, collect, divide |
| Find an expression | Get 2x + 3 or 6x − 4 straight from the equation |
| Write the equation | Turn a story into an equation |
| Interpret | Say what a number, a term or the solution means in the story |
| Count the solutions | Decide: one, none, or infinitely many |
| Find the constant | Find k (or a and b) that gives no solution or infinitely many |

## The method

1. **Read the last line first.** Decide what you need: x, an expression like 2x + 3, a constant like k, a number of solutions, or a meaning. Write it at the top of your scratch paper.
2. **Look for a shortcut before you expand.** Is the expression they want a multiple of a piece of the equation? Does the same group, like (x − 3), appear twice? Then work with the whole group (see the rules below).
3. **Clear fractions and decimals.** Multiply *every* term on both sides by the lowest common denominator (LCD), or by 10 or 100 for decimals.
4. **Distribute and combine.** Multiply out the parentheses. A minus sign in front changes every sign inside. Then combine like terms on each side. Like terms have the same variable part, such as 5x and −2x.
5. **Collect.** Move the x-terms to one side and the plain numbers (the constants) to the other side. Pick the side that keeps the coefficient of x positive. The coefficient is the number in front of x.
6. **Divide** both sides by the coefficient of x.
7. **Answer the real question, then check.** Turn your x into what they asked for. Put the value back into the original equation, or check it in Desmos.

For **count-the-solutions** and **find-the-constant** questions, don't solve. Simplify each side to the form ax + b and compare the two sides (see the table below).

For **word problems**, first write what your letter means, with units: "h = hours of work". An amount that repeats (per hour, per item) multiplies the variable. A one-time amount (a fee, a starting value) stands alone.

## Rules and formulas you need

The reference sheet in the test has only geometry formulas, so you must know these by heart.

### Solving moves

- Whatever you do to one side, do to the other side.
- When you clear fractions, every term gets multiplied, including whole numbers that have no fraction.
- −3(x − 1) = −3x + 3. The minus sign reaches both terms.
- If only x has a fraction, like (3/5)x = 12, multiply both sides by the flipped fraction: x = 12 × 5/3 = 20.
- x = 0 is a real solution. It does not mean "no solution".

### Getting an expression without finding x

| Given | Wanted | Move | Result |
|---|---|---|---|
| 3x − 2 = 10 | 6x − 4 | multiply both sides by 2 | 20 |
| 8x − 12 = 20 | 2x − 3 | divide both sides by 4 | 5 |
| 4x + 7 = 31 | 4x − 2 | subtract 9 from both sides | 22 |
| (x − 3)/2 + (x − 3)/5 = 14 | x − 3 | call the block x − 3 "u": u/2 + u/5 = 14, so 7u/10 = 14 | 20 |

> **Tip:** Before you expand anything, ask: "Can one move turn the left side into what they want?" If the same group appears more than once, keep it together as one block.

### How many solutions?

Simplify both sides until the equation looks like ax + b = cx + d. Then compare:

| After simplifying | Number of solutions | Example |
|---|---|---|
| a ≠ c (different x-coefficients) | Exactly one | 5x + 2 = 3x + 2 gives x = 0 |
| a = c and b ≠ d | No solution | 4x + 1 = 4x − 6 gives 1 = −6, which is false |
| a = c and b = d | Infinitely many | 4x + 1 = 4x + 1 gives 0 = 0, which is always true |

> **Key idea:** When the x-terms cancel, read what is left. A false statement (1 = −6) means no solution. A true statement (0 = 0) means every number works. A linear equation never has exactly two solutions.

### Finding the constant

- **No solution:** make the x-coefficients equal, then check that the constants are different. If the constant is part of a coefficient, combine first: (k + 3)x − 5 = 7x + 2 has no solution when k + 3 = 7, so k = 4 (and −5 ≠ 2, as needed).
- **Infinitely many solutions:** make the x-coefficients equal *and* the constants equal.
- **Plug-in trick for infinitely many:** the equation is true for every x, so substitute x = 0 to get one fact and x = 1 to get another.
- **Exactly one solution:** the x-coefficients must be different. The constants don't matter.

### Words into math

| Words in the story | Math |
|---|---|
| "per", "each", "for every" | a rate that multiplies the variable |
| "fee", "starting", "initial", "one-time" | a constant that stands alone |
| "5 less than x" | x − 5 (not 5 − x) |
| "is", "equals", "the same as", "break even" | = |
| "twice", "half of" | 2 ×, ½ × |

## Worked examples

### Example 1: Clear the fractions first

2x/3 − (x − 1)/4 = 3

What value of x is the solution to the given equation?

- (A) 0
- (B) 33/5
- (C) 7
- (D) 39/5

**Solution.** The LCD of 3 and 4 is 12. Multiply every term by 12, including the 3 on the right side: 12 × 2x/3 = 8x, 12 × (x − 1)/4 = 3(x − 1), and 12 × 3 = 36. So 8x − 3(x − 1) = 36. The −3 multiplies both terms in the parentheses: 8x − 3x + 3 = 36. Combine: 5x + 3 = 36, so 5x = 33 and x = 33/5, which is 6.6.

Check: 2(6.6)/3 = 4.4 and (6.6 − 1)/4 = 1.4, and 4.4 − 1.4 = 3. Choice (D) comes from writing −3x − 3 instead of −3x + 3. Choice (C) comes from writing 3x − 1 instead of 3(x − 1). Choice (A) comes from forgetting to multiply the 3 on the right side by 12.

**Answer:** (B)

### Example 2: Find the expression, not x

If 5(2x + 3) = 45, what is the value of 6x + 9?

- (A) 3
- (B) 9
- (C) 27
- (D) 135

**Solution.** Look at what they want first: 6x + 9 = 3(2x + 3). So you only need the value of 2x + 3. Divide both sides of the given equation by 5: 2x + 3 = 9. Multiply by 3: 6x + 9 = 27.

The long way gives the same result: 2x + 3 = 9, so x = 3 and 6(3) + 9 = 27. Choice (A) is the value of x. Choice (B) is the value of 2x + 3. Choice (D) multiplies 45 by 3 without first dividing by 5.

**Answer:** (C)

### Example 3: What does the solution mean?

A food truck pays a fee of $180 each day to park at a festival, and it makes a profit of $6 on each meal it sells. The owner uses the equation 6m − 180 = 420 to find m, the number of meals the truck must sell in one day to have a total profit of $420 for that day after paying the fee. The solution to the equation is m = 100. Which statement is the best interpretation of this solution in this context?

- (A) The truck makes a profit of $100 on each meal.
- (B) The truck must sell 100 meals to pay for the $180 fee.
- (C) The truck must sell 100 meals in one day to have a total profit of $420 for that day.
- (D) The truck has a total profit of $100 for the day.

**Solution.** Give every part of the equation a meaning. m is the number of meals. 6 is the profit per meal, so 6m is the profit from all the meals. 180 is the daily fee, so it is subtracted. 420 is the total profit for the day. The solution is a value of m, so it must be a number of meals. It is the number of meals that makes the whole equation true: 6(100) − 180 = 600 − 180 = 420.

Choice (A) treats the solution as a profit per meal, but that rate is $6. Choice (B) is wrong because paying the fee needs only 6m = 180, which is 30 meals. Choice (D) mixes up the solution with the total profit, which is $420.

**Answer:** (C)

### Example 4: Build the equation yourself

Nadia bought 3 notebooks and 1 backpack for a total of $49. All the notebooks had the same price. The backpack cost $3 less than 5 times the price of one notebook. What was the price, in dollars, of one notebook?

*Student-produced response: enter your answer.*

**Solution.** Let n be the price of one notebook, in dollars. "5 times the price of one notebook" is 5n. "$3 less than" that means you take 3 away from 5n, so the backpack cost 5n − 3. The total is 49:

3n + (5n − 3) = 49

Combine like terms: 8n − 3 = 49, so 8n = 52 and n = 6.5.

Check: 3 notebooks cost 3 × 6.50 = 19.50 dollars. The backpack cost 5 × 6.50 − 3 = 29.50 dollars. Together that is 49 dollars. Enter 6.5 (or 13/2), with no dollar sign. If you write the backpack as 3 − 5n, you get 3n + 3 − 5n = 49, so n = −23. A negative price tells you the translation was wrong.

**Answer:** 6.5 or 13/2

### Example 5: Which equation has no solution?

Which of the following equations has no solution?

- (A) 4(x − 2) = 4x − 8
- (B) 4(x − 2) = 2(2x − 3)
- (C) 4(x − 2) = 2(x − 4)
- (D) 4(x − 2) = −4x + 8

**Solution.** Every left side is 4x − 8. Simplify each right side and compare it with 4x − 8.

- (A): 4x − 8. Same coefficient and same constant, so infinitely many solutions.
- (B): 4x − 6. Same coefficient, different constant. 4x − 8 = 4x − 6 becomes −8 = −6, which is false. No solution.
- (C): 2x − 8. Different coefficients, so exactly one solution, x = 0. Getting 0 does not mean "no solution".
- (D): −4x + 8. Different coefficients, so exactly one solution, x = 2.

**Answer:** (B)

### Example 6: Two constants, infinitely many solutions

2(ax − 5) + 4x = 10x + b

In the given equation, a and b are constants. The equation has infinitely many solutions. What is the value of a + b?

*Student-produced response: enter your answer.*

**Solution.** Simplify the left side first: 2ax − 10 + 4x, which is (2a + 4)x − 10. Infinitely many solutions means the two sides are the same expression. So the x-coefficients match and the constants match:

- x-coefficients: 2a + 4 = 10, so 2a = 6 and a = 3.
- constants: −10 = b.

So a + b = 3 + (−10) = −7.

The plug-in trick gives the same values, because the equation is true for every x. With x = 0: 2(0 − 5) + 0 = 0 + b, so b = −10. With x = 1: 2(a − 5) + 4 = 10 + b. The right side is 10 − 10 = 0, so 2a − 6 = 0 and a = 3. A common mistake is to forget the 4x and write 2a = 10. That gives a = 5 and the wrong total −5.

**Answer:** −7

## Traps to avoid

- **Answering x when they asked for something else.** The value of x often sits in the choices as a trap when the question wants 2x + 3, 6x + 9 or a constant.
- **Dropping a minus sign when distributing.** −3(x − 1) is −3x + 3, not −3x − 3. This one slip is behind many wrong choices.
- **Clearing only some fractions.** When you multiply by the LCD, the whole numbers get multiplied too.
- **Reversing "less than".** "3 less than 5n" is 5n − 3. Order matters for "less than", but not for "more than".
- **Swapping the fee and the rate.** "A $35 fee plus $18 per hour" is 35 + 18h, not 35h + 18.
- **Calling x = 0 "no solution".** If you end with 2x = 0, then x = 0 is one perfectly good solution.
- **Mixing up no solution and infinitely many.** Both happen when the x-terms cancel. Look at what is left: false means none, true means infinitely many.
- **Matching only the coefficients for infinitely many.** The constants must match too. Equal coefficients with different constants means no solution.
- **Reading constants from an unsimplified equation.** Combine like terms first. In Example 6, the extra 4x changes the answer.
- **Keeping an impossible answer.** A negative price, a fraction of a person or a negative time usually means a setup or sign error.

## Desmos shortcut

Desmos is available on every math question. For short equations, two lines of algebra are usually faster. Use Desmos for messy numbers, to check your work, or as a backup when you are stuck.

**Solve one equation.** Graph each side as its own line and click the point where they cross. The x-coordinate of that point is the solution. When you type a fraction, Desmos keeps you in the denominator until you press the right arrow key (→), so press it after each denominator that has more to follow. For Example 1, type `y=2x/3`, press →, then type `-(x-1)/4` on line 1, and `y=3` on line 2. The lines cross at (6.6, 3), so x = 6.6. (Without the →, Desmos reads 2x/(3 − (x − 1)/4), a different graph.) You can also type the whole equation on one line: type `3=2x/3`, press →, then type `-(x-1)/4`. Desmos then draws a vertical line at the solution, x = 6.6.

- Use x as your letter. Other letters, like t or n, make Desmos offer a slider instead.
- No crossing point on the screen? Zoom out.

**Count the solutions.** Graph `y=4(x-2)` and `y=2(2x-3)`. Lines that never cross (parallel lines) mean no solution. One crossing point means one solution. If you see only one line, the second line sits on top of the first: infinitely many solutions. Two lines with almost equal slopes can look parallel, so confirm by comparing the coefficients.

**Find two constants with a list.** For an "infinitely many solutions" question like Example 6, type `x1=[1...10]` on line 1 (Desmos turns the 1 into a small subscript by itself). On line 2, type the equation with x1 in place of x and ~ in place of =: `2(ax1-5)+4x1~10x1+b`. Don't type an underscore (x_1): the ~ would get stuck in the subscript and Desmos shows an error. Desmos finds the values that make both sides equal for all ten numbers in the list: a = 3 and b = −10.

**Check an answer.** Type the left side with your number in place of x: for example, type `2(6.6)/3`, press →, then type `-(6.6-1)/4`. If Desmos shows 3, your answer is right. (Without the →, Desmos shows 8.25.)

For a constant question with only one letter, comparing coefficients by hand is faster than playing with a slider.

## Quick checklist

- What does the question want: x, an expression, a constant, a count, or a meaning?
- When I cleared fractions, did I multiply every term, including whole numbers?
- Did a minus sign in front of parentheses change every sign inside?
- For a solution count, did I fully simplify both sides before comparing?
- If the x-terms cancelled, is the leftover statement true (infinitely many) or false (none)?
- In a story, does the rate multiply the variable, and does my answer make sense?
- Did I check my value in the original equation or in Desmos?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — official testing points for this skill, Math section counts and the SPR entry rules
- [College Board: SAT Math algebra question types](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/algebra) — the official list of the five Algebra question types
- [Khan Academy: Solving linear equations and linear inequalities (advanced lesson)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-harder/x0fcc98a58ba3bea7:solving-linear-equations-and-inequalities-harder/a/v2-sat-lesson-solving-linear-equations-and-inequalities) — when to clear fractions, finding an expression from the given equation, solution counts with constants
- [Test Ninjas: SAT Linear Equations in One Variable](https://www.test-ninjas.com/sat-linear-equations-in-one-variable) — the sub-types, a simplify-organize-solve-check routine and the common traps
- [JustLockedIn: Analyze Solutions](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-equations-in-one-variable/analyze-solutions.html) — variants of solution-count questions, the x = 0 trap and constants inside a coefficient
- [JustLockedIn: Evaluate Expression](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-equations-in-one-variable/evaluate-expression.html) — scaling, shared pieces and block substitution for expression questions
- [Magoosh: Solving Linear Equations](https://sat.magoosh.com/lessons/7546-solving-linear-equations) — clearing fractions with the LCM and solving straight for an expression
- [Open Exam Prep: Linear equations in one variable](https://open-exam-prep.com/study-guides/sat-math/algebra-linear/linear-equations-one-variable) — the minus-sign trap and checking in Desmos by graphing both sides
- [YouTube, James Lu SAT: The Last SAT Desmos Guide You'll Need](https://www.youtube.com/watch?v=e-O4nwVHQ-Y) — graphing both sides to count solutions and the x_1 list trick for constants (from the video's own summary)
- [YouTube, Penguin SAT Prep: Easily Solve SAT Constants Questions](https://www.youtube.com/watch?v=LJooEH4d434) — chapters on Desmos, plugging in values and infinite or no solutions for constant questions
