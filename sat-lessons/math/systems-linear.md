---
title: Systems of two linear equations
skill: systems-linear
domain: algebra
section: math
summary: Solve two linear equations fast, find x + y without solving, spot no-solution and infinite-solution systems, and turn word problems into systems.
minutes: 24
---

## What this question looks like

A *system of equations* is a pair of equations that must both be true at the same time. In this skill both equations are *linear*: each one is a straight line in the xy-plane. The *solution* of the system is the pair (x, y) that makes both equations true. On a graph, it is the point where the two lines cross.

You usually see the two equations stacked, one above the other:

3x + 2y = 16

x − y = 2

Here the solution is (4, 2), because 3(4) + 2(2) = 16 and 4 − 2 = 2. The question then asks for one of these things:

- **The solution.** "What is the solution (x, y) to the system?" or "What is the value of y?"
- **A combination.** "What is the value of x + y?" or "What is 2x − y?" Often you never need x and y on their own.
- **The number of solutions.** Exactly one, none, or infinitely many?
- **A missing constant.** "In the system, k is a constant. For what value of k does the system have no solution?" (or infinitely many solutions)
- **A word problem.** Tickets at two prices, coins, a mixture of two liquids, the same order at two stores. You write the equations yourself, or pick the system that matches the story.
- **A graph or a table.** Two lines are shown, and the solution is the point where they meet.

About 13 to 15 of the 44 math questions are algebra, and prep sites estimate that 2 to 4 of them are systems. They come both as multiple choice and as student-produced response, where you type the answer yourself.

## The method

1. **Read the last line first.** Find exactly what the question wants: x, y, a combination such as x + y, a constant such as k, the number of solutions, or the system that matches a story. Write it on your scratch paper.
2. **Line up the equations.** Put both in the form ax + by = c: x-terms under x-terms, y-terms under y-terms, numbers on the right. If there are fractions or decimals, multiply the whole equation to clear them.
3. **Pick the fastest tool** from the table below. Combinations and constants have their own shortcuts, so check for them before you start solving.
4. **Work carefully.** When you multiply an equation, multiply every term, including the number on the right. When you subtract one equation from another, put the second one in parentheses so every sign changes.
5. **Answer the real question.** If you found x but they asked for y, x + y or "the number of adult tickets", take the last step.
6. **Check in both equations.** Put your x and y back into both original equations, or look at the Desmos graph. It takes 15 seconds and catches most sign errors.

| What you see | Fastest tool |
|---|---|
| The question asks for x + y, x − y or another mix of x and y | Add or subtract the equations as they are, before anything else |
| The question asks how many solutions, or for a constant like k | Compare the coefficients (rules below). Don't solve. |
| One variable is already alone, like y = 2x − 7 | Substitution |
| Two coefficients are equal, opposite, or easy to make equal | Elimination |
| Decimals, big numbers, or you just want a check | Desmos: graph both lines and click the crossing point |

## Rules and formulas you need

### Substitution and elimination

*Substitution*: one equation tells you what a variable equals, so you replace that variable in the other equation. Always put the replacement in parentheses. If y = 2x − 7, then 3x + 2y becomes 3x + 2(2x − 7).

*Elimination*: you add or subtract the two equations so that one variable disappears. This works because if two equations are true, their sum and their difference are true too. You may first multiply a whole equation by any number except 0.

- Same terms (4y and 4y): subtract. Opposite terms (4y and −4y): add.
- Different coefficients: multiply first. To cancel y in 2x + 3y = 7 and 5x − 2y = 8, multiply the first equation by 2 and the second by 3. You get 6y and −6y, so you add.

### Asking for a combination

Look at the coefficients before you solve anything. If the question asks for x + y and the coefficients are "crossed", like 5x + 2y and 2x + 5y, adding gives 7x + 7y, so divide by 7. If it asks for x − y, try subtracting. If it asks for something like 4x + 6y, check whether it is a multiple of one equation: 4x + 6y is just 2(2x + 3y).

### How many solutions?

Write the first equation as ax + by = c and the second as px + qy = r. Then ask one question: is the left side of the second equation the left side of the first, times one number?

| What you find | The two lines | Number of solutions |
|---|---|---|
| a/p ≠ b/q (x-part and y-part not in the same ratio) | different slopes, they cross once | exactly one |
| a/p = b/q, but c/r is different | same slope, different lines (parallel) | none |
| a/p = b/q = c/r (the whole equation is a multiple) | the same line twice | infinitely many |

A version without division, which also works when a coefficient is 0: the lines are parallel or the same exactly when a × q = b × p.

If you solve by elimination anyway, the last line tells you the answer:

| You end with | Meaning |
|---|---|
| a value, like x = 3 | exactly one solution |
| a false statement, like 0 = 7 | no solution |
| a statement that is always true, like 0 = 0 | infinitely many solutions |

Facts to know cold:

- The slope of ax + by = c is −a/b. Two lines with different slopes always cross exactly once, whatever the numbers on the right are.
- In the form y = mx + b: same m and different b means no solution; same m and same b means infinitely many.
- Two different straight lines can never cross twice. "Exactly two solutions" is always wrong for a linear system.

### Finding a constant k

Find the multiplier from a pair of coefficients you know (both x-coefficients or both y-coefficients), then apply it to the unknown one.

- **No solution:** the x-part and the y-part match by that multiplier, but the number on the right does not.
- **Infinitely many solutions:** everything matches by that multiplier, including the number on the right.
- **Exactly one solution:** k can be anything except the value that makes the lines parallel.

### Turning words into a system

Name the two unknowns first, with units ("a = number of adult tickets"). Each sentence with a total in it usually gives one equation.

| Story type | Equation 1 | Equation 2 |
|---|---|---|
| Two kinds of tickets or items | count: a + s = number of items | money: (price of one a) × a + (price of one s) × s = total money |
| Coins | count: q + d = number of coins | value: 0.25q + 0.10d = total dollars |
| The same order at two stores | prices at store A give the total at A | prices at store B give the total at B |
| A mixture of two liquids | amounts: x + y = total amount | pure part: (percent as a decimal) × x + (percent) × y = percent × total |
| One amount compared to another | total: x + y = given total | "x is 5 more than twice y" means x = 2y + 5 |

> **Trap:** "The school has 4 times as many students as teachers" means S = 4T, not T = 4S. Test it with small numbers: 10 teachers should give 40 students.

## Worked examples

### Example 1: Substitution with y already alone

y = 2x − 7

3x + 2y = 14

If (x, y) is the solution to the system of equations above, what is the value of y?

- (A) −7
- (B) −1
- (C) 1
- (D) 4

**Solution.** The first equation already tells you what y is, so substitute. Replace y with (2x − 7), in parentheses:

3x + 2(2x − 7) = 14

Multiply the 2 into both terms: 3x + 4x − 14 = 14. So 7x = 28 and x = 4. Now use the first equation: y = 2(4) − 7 = 1.

Check in the second equation: 3(4) + 2(1) = 12 + 2 = 14. Correct.

Why the others are wrong: (D) is x, not y. (B) comes from forgetting to multiply the −7 by 2: then 7x − 7 = 14 gives x = 3 and y = −1. (A) comes from a sign slip, writing +14 instead of −14, which gives x = 0 and y = −7.

**Answer:** (C)

### Example 2: Find x − y without finding x and y

5x + 2y = 23

3x + 4y = 11

If (x, y) is the solution to the system of equations above, what is the value of x − y?

- (A) −1
- (B) 5
- (C) 6
- (D) 12

**Solution.** The question asks for x − y, so look at the coefficients first. Subtract the second equation from the first, term by term:

(5x − 3x) + (2y − 4y) = 23 − 11

2x − 2y = 12

Divide every term by 2: x − y = 6. That is the answer, and you never needed x or y alone.

If you want to check: the solution of the system is x = 5 and y = −1, and 5 − (−1) = 6.

Why the others are wrong: (A) is y and (B) is x, the values you get if you solve the whole system and stop one step early. (D) is 2x − 2y: you forgot to divide by 2.

**Answer:** (C)

### Example 3: Tickets (a count and a total)

A school theater sold adult tickets for $9 each and student tickets for $5 each. It sold 240 tickets in total and collected $1,640. How many adult tickets did it sell?

- (A) 110
- (B) 130
- (C) 350
- (D) 440

**Solution.** Name the unknowns: a = number of adult tickets and s = number of student tickets. Each sentence with a total gives one equation:

- Count: a + s = 240
- Money: 9a + 5s = 1,640

Use elimination. Multiply the whole count equation by 5: 5a + 5s = 1,200. Subtract it from the money equation:

(9a − 5a) + (5s − 5s) = 1,640 − 1,200, so 4a = 440 and a = 110.

Then s = 240 − 110 = 130. Check the money: 9(110) + 5(130) = 990 + 650 = 1,640. Correct.

Why the others are wrong: (B) is the number of student tickets (you also get 130 if you swap the two prices). (D) forgets to divide 440 by 4. (C) comes from multiplying only the left side of the count equation by 5 (5a + 5s = 240), which gives 4a = 1,400. That is more than the 240 tickets sold, so it can't be right.

**Answer:** (A)

### Example 4: The value of k that gives no solution

2x + 5y = 3

3x + ky = 8

In the system of equations above, k is a constant. If the system has no solution, what is the value of k?

*Student-produced response: enter your answer.*

**Solution.** No solution means the two lines are parallel: the x-part and the y-part match by one multiplier, but the number on the right does not.

Find the multiplier from the x-coefficients, which you know: 2 becomes 3, so the multiplier is 3/2. Apply it to the y-coefficient: k = 5 × 3/2 = 15/2.

Now check the right side: 3 × 3/2 = 4.5, but the second equation has 8. Since 4.5 ≠ 8, the lines are parallel and different, so there really is no solution. (If the 8 were 4.5, the two lines would be the same and there would be infinitely many solutions.)

A quick second check with cross-multiplying: a × q = b × p gives 2 × k = 5 × 3, so 2k = 15 and k = 7.5.

Common mistakes: using the multiplier upside down (5 × 2/3 = 10/3), or entering −7.5. With either value the slopes are different, so the lines cross once. Enter the answer as 15/2 or 7.5.

**Answer:** 15/2 or 7.5

### Example 5: Infinitely many solutions when the forms don't match

y = (2/3)x − 4

ax + 9y = c

In the system of equations above, a and c are constants. If the system has infinitely many solutions, what is the value of c?

- (A) −36
- (B) −12
- (C) −4
- (D) 36

**Solution.** Infinitely many solutions means both equations describe the same line. First write the first equation in the same form as the second one.

Multiply every term by 3 to clear the fraction: 3y = 2x − 12. Move the x-term to the left side: −2x + 3y = −12.

The second equation has 9y, and 3y × 3 = 9y, so the multiplier is 3. Multiply every term, including the right side: −6x + 9y = −36. So a = −6 and c = −36.

Why the others are wrong: (B) stops at −2x + 3y = −12 and never scales up to 9y. (C) copies the y-intercept −4. (D) comes from a sign slip while moving 2x to the left side (writing −2x + 3y = 12).

**Answer:** (A)

### Example 6: A mixture

A chemist mixes a 10% salt solution with a 35% salt solution to make 50 liters of a 20% salt solution. How many liters of the 10% solution does she use?

*Student-produced response: enter your answer.*

**Solution.** Let x = liters of the 10% solution and y = liters of the 35% solution. A mixture always gives two equations: one for the total amount and one for the pure part (here, the salt).

- Amount: x + y = 50
- Salt: 0.10x + 0.35y = 0.20 × 50 = 10

Multiply the salt equation by 100 to clear the decimals: 10x + 35y = 1,000. From the first equation, x = 50 − y. Substitute: 10(50 − y) + 35y = 1,000, so 500 + 25y = 1,000. That gives y = 20 and x = 30.

Check the salt: 0.10(30) + 0.35(20) = 3 + 7 = 10 liters of salt, and 10 is 20% of 50. Correct.

In Desmos you can type `x + y = 50` and `0.1x + 0.35y = 10` and click the crossing point, (30, 20).

Common mistakes: answering 20 (that is the 35% solution), or writing the salt total as 20 instead of 0.20 × 50 = 10. The second mistake gives a negative amount of liquid, which tells you the setup is wrong.

**Answer:** 30

## Traps to avoid

- **Answering the wrong quantity.** You find x, but the question asks for y, x + y, or the student tickets instead of the adult tickets. The test puts your half-finished number among the choices.
- **Multiplying only part of an equation.** When you scale an equation for elimination, the number on the right must be multiplied too. This is the most common elimination error.
- **Sign errors.** Subtracting −4y means adding 4y, and 2(2x − 7) is 4x − 14, not 4x − 7. Use parentheses whenever you subtract or substitute.
- **Deciding from slopes alone.** Equal slopes only tell you the lines are parallel or the same. Compare the numbers on the right to choose between "no solution" and "infinitely many".
- **Losing a negative sign in k.** A multiplier of −3/2 and one of 3/2 give different lines. A lost sign turns parallel lines into crossing lines.
- **Comparing before lining up.** If one equation is y = 4x − 1 and the other is 8x − 2y = 2, first rewrite the first as 4x − y = 1. Now you can see that the second is twice the first, so there are infinitely many solutions.
- **Percents in mixtures.** Use decimals (20% = 0.20). The right side of the pure-part equation is the percent times the total amount.
- **"Exactly two solutions".** Two straight lines can't do that. It is always a wrong choice.

## Desmos shortcut

Desmos is open on every math question, and systems are one of the places where it saves the most time.

**Find the solution.** Type each equation on its own line, exactly as it is written. You don't need to solve for y first. Click one of the lines and gray dots appear at special points; click the gray dot where the lines cross to see its coordinates. Then finish the question by hand, for example by adding x and y.

Try it with `1.2x + 0.5y = 8.6` and `0.3x - 1.5y = -14.1`. By hand this is slow and full of decimals. In Desmos you click the crossing point and read (3, 10).

**Letters other than x and y.** Desmos only graphs x and y, so 3a + 2b = 12 gives an error. Retype the system with x for the first letter and y for the second, and write down which is which.

**How many solutions.** The lines cross once: one solution. They never meet (parallel): no solution. You see only one line because the second lies exactly on top of the first: infinitely many. To be sure, click the colored circle next to one equation to hide it; if the line is still there, they are the same line.

**An unknown constant.** Type `3x + ky = 8`. Desmos shows a button "add slider: k". Click it, and a slider k = 1 (from −10 to 10) appears. Drag it and watch the line turn; when the two lines become parallel, the crossing point disappears. Dragging only gives a rough value, so do the algebra (Example 4) and then type the exact value into the slider line, like `k = 7.5`, to confirm.

**Fractions.** When you type /, Desmos starts a fraction, and everything you type next stays in the bottom part until you press the right arrow key (→). So typing `y = 2/3x - 4` gives y = 2/(3x − 4), which is wrong. Type `y = 2/3`, press →, then type `x - 4`. Always look at the formatted line before you trust the graph.

**Reading the point.** Desmos rounds the coordinates in the label (to five decimal places at normal zoom). A label like (0.66667, 1.33333) means (2/3, 4/3). In a student-produced response, type the fraction or a decimal that fills the box, like .6667. Don't type 0.67: it is not accurate enough.

> **Trap:** Lines with slopes 0.50 and 0.52 look parallel near the origin but cross far off the screen. If you need to know whether two lines ever meet, compare their slopes (−a/b) instead of trusting the picture.

## Quick checklist

- Did I write down exactly what the question asks for: x, y, x + y, k, or a count?
- Are both equations lined up as ax + by = c before I compare or eliminate?
- For a combination, did I try adding or subtracting the equations first?
- When I multiplied an equation, did I multiply the number on the right too?
- For no-solution or infinitely-many questions, did I check the coefficients and the numbers on the right?
- Did I check my answer in both original equations, or on the graph?

## Sources

- [Assessment Framework for the Digital SAT Suite, version 4 (College Board, PDF)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — what systems questions officially test, how many algebra questions there are, answer-entry rules
- [Khan Academy: Solving systems of linear equations (SAT lesson)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:solving-systems-of-linear-equations-medium/a/v2-sat-lesson-solving-systems-of-linear-equations) — choosing substitution or elimination; number-of-solutions rules
- [Khan Academy: Systems of linear equations word problems (SAT lesson)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:systems-of-linear-equations-word-problems-medium/a/v2-sat-lesson-systems-of-linear-equations-word-problems) — the count equation plus value equation pattern
- [Open Exam Prep: Systems with special solutions and constants](https://open-exam-prep.com/study-guides/sat-math/algebra-systems/systems-special-solutions-constants) — ratio rules and the "check the constants too" trap
- [JustLockedIn: Structured systems](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/structured-systems.html) — questions that ask for x + y or another combination
- [Test Ninjas: SAT systems of linear equations](https://www.test-ninjas.com/sat-systems-of-linear-equations) — traps: scaling the constant, parentheses, stopping at x
- [Achievable: Systems of equations](https://app.achievable.me/study/sat/learn/algebra-systems) — nearly parallel lines in Desmos
- [The Test Advantage: Infinite-solution systems on Desmos](https://thetestadvantage.com/blog/sat-infinite-solutions-systems-on-desmos-may-2026-full-guide) — typing the exact constant into the slider
- [A Beginner's Guide to Desmos on the SAT Math (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ) — graphing systems; no-solution versus infinite-solution graphs
- [Desmos graphing calculator, College Board version](https://www.desmos.com/testing/collegeboard/graphing) — the test-day calculator, used to check every Desmos input here
