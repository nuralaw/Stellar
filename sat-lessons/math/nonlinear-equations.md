---
title: Nonlinear equations and systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratic, radical, rational, absolute value and exponential equations, count solutions with the discriminant, and solve line–parabola systems.
minutes: 22
---

## What this question looks like

These questions give you an equation that is not linear (x is squared, under a root, in a denominator, inside absolute value bars or in an exponent), or a system of two equations where at least one is not linear. You either solve it or say something about its solutions. A **solution** is a value of x, or a point (x, y), that makes the equation true.

Typical question stems:

- "What are the solutions to x² − 6x + 4 = 0?"
- "How many distinct real solutions does the given equation have?"
- "What is the sum of the solutions to the given equation?"
- "In the given equation, k is a constant. The equation has exactly one real solution. What is the value of k?"
- "The graphs of the two equations intersect at the point (a, b). What is the value of b?"
- "Which of the following gives all the solutions to the given equation?"

On screen you see one or two equations, sometimes a graph, and sometimes a short story: a ball reaching a certain height, or revenue equal to cost. This skill is part of Advanced Math (13 to 15 of the 44 math questions), and you should expect a few questions from it on every test. The "find the constant" and "how many solutions" versions are favorites near the end of module 2.

The sub-types:

1. Quadratic equations: factoring, square roots, completing the square, the quadratic formula.
2. The number of solutions and the discriminant, including finding a constant.
3. The sum and product of the solutions.
4. Systems with a line and a parabola (or another curve).
5. Radical and rational equations, where some answers turn out to be fake.
6. Absolute value equations.
7. Exponential equations, and polynomial equations in factored form.

## The method

1. **Read the last line first.** Do they want the solutions, how many there are, their sum or product, a point, or a constant like k? That decides your tool.
2. **Rewrite into a clean shape.** Quadratic: move everything to one side so it equals 0, in the order ax² + bx + c = 0. Radical: get the root alone. Fraction: write down which x-values make a bottom equal 0. Absolute value: get the bars alone. System: substitute one equation into the other.
3. **Pick the tool** from the table below.
4. **Solve.**
5. **Check your answers in the original equation** whenever you squared both sides, multiplied by something with x in it, or the story limits the answer (a time can't be negative).
6. **Answer exactly what was asked:** x, y, a sum, a product or k.

| They ask for | Fastest tool |
|---|---|
| the solutions | factor; if that fails, complete the square, use the quadratic formula, or graph |
| how many real solutions | the discriminant b² − 4ac, or count crossings in Desmos |
| the sum or the product | −b/a or c/a, with no solving needed |
| a constant k | set the discriminant = 0, < 0 or > 0, or plug in a solution you know |
| an intersection point | substitute, solve for x, then get y from the simpler equation |

## Rules and formulas you need

### Solving quadratic equations

| Tool | Best when | Example |
|---|---|---|
| Factoring | it factors with small whole numbers | x² − 5x − 14 = 0 → (x − 7)(x + 2) = 0 → x = 7 or x = −2 |
| Square roots | the equation is (something)² = a number | (x − 3)² = 25 → x − 3 = 5 or x − 3 = −5 → x = 8 or x = −2 |
| Completing the square | a = 1 and b is even | x² + 6x = 7 → x² + 6x + 9 = 16 → (x + 3)² = 16 → x = 1 or x = −7 |
| Quadratic formula | always works; best for messy answers | x = (−b ± sqrt(b² − 4ac))/(2a) |

- The quadratic formula is **not** on the reference sheet, so learn it by heart.
- **Zero product rule:** if A × B = 0, then A = 0 or B = 0. That is why you set each factor equal to 0. It only works when one side is 0.
- **Never divide both sides by x** (or by anything with x in it). You lose the solution x = 0. Factor instead: x³ = 9x → x³ − 9x = 0 → x(x − 3)(x + 3) = 0 → x = 0, 3 or −3.
- A square root gives two answers: x² = 49 means x = 7 or x = −7.

### How many real solutions? The discriminant

For ax² + bx + c = 0, the **discriminant** is D = b² − 4ac, the part under the root in the quadratic formula.

| D | Number of real solutions | Graph of y = ax² + bx + c |
|---|---|---|
| D > 0 | two | crosses the x-axis twice |
| D = 0 | exactly one | touches the x-axis at its vertex |
| D < 0 | none | never reaches the x-axis |

- First move everything to one side. Then read a, b and c **with their signs**.
- **Finding a constant:** "exactly one real solution" means D = 0. "No real solutions" means D < 0. "Two distinct real solutions" means D > 0. Write D with the constant in it, then solve.
- **Shortcut without D:** a square can never be negative. (x − 1)² = −4 has no real solutions, and (x − 1)² = 0 has exactly one.
- If the constant sits in front of x², think about what happens when it is 0: the equation becomes linear, and D no longer applies.

### Sum and product of the solutions

For ax² + bx + c = 0:

- the sum of the solutions is −b/a
- the product of the solutions is c/a

For example, 2x² − 8x + 3 = 0 has solutions that add up to 8/2 = 4 and multiply to 3/2, even though the solutions themselves are messy. Use these only after the equation is in "= 0" form.

### Systems: a line and a curve

1. Substitute: set the two expressions for y equal (or put the line into the curve's equation).
2. Move everything to one side and solve for x.
3. Find each y by putting x into the **line's** equation; it's the simpler one.

- The number of intersection points equals the number of real solutions of the equation in step 2, so the discriminant tells you how many points there are.
- A line that touches a parabola at exactly one point (a tangent line) means D = 0.
- For a parabola that opens up, a horizontal line y = k crosses it twice if k is above the vertex, touches it once if k equals the vertex's y-value, and misses it if k is below.
- **Some systems need a shortcut, not substitution.** If x + y = 8 and xy = 15, then x² + y² = (x + y)² − 2xy = 64 − 30 = 34. Look for a squared sum or a difference of squares before you start solving.

### Radical equations

1. Get the square root alone on one side.
2. Square both sides.
3. Solve.
4. **Check every answer in the original equation.** Squaring can create fake answers, called **extraneous solutions**. The symbol sqrt(…) always means the root that is 0 or positive, so a square root can never equal a negative number.

### Rational equations (x in a denominator)

1. Write down the x-values that make any denominator 0. They can never be solutions.
2. Multiply every term by the common denominator.
3. Solve.
4. Throw out any answer from step 1.

### Absolute value equations

The absolute value of a number is its distance from 0, so it is never negative.

- Get the absolute value alone first: 2|x − 1| + 3 = 11 → |x − 1| = 4.
- Then split into two cases: x − 1 = 4 or x − 1 = −4, so x = 5 or x = −3.
- An absolute value equal to 0 gives one solution. An absolute value equal to a negative number gives none.
- If the other side has an x in it, check both answers. For |x − 5| = 2x + 1, the two cases give x = −6 and x = 4/3, but x = −6 makes the right side −11, which is negative, so only 4/3 works.

### Exponential equations

- If both sides can be written as powers of the same number, set the exponents equal: 4^(x + 1) = 8^x → (2²)^(x + 1) = (2³)^x → 2^(2x + 2) = 2^(3x) → 2x + 2 = 3x → x = 2.
- If that isn't possible, graph both sides in Desmos and read the intersection.

### Polynomial equations in factored form

- Set each factor equal to 0: (x − 2)(x + 5)(3x − 1) = 0 gives x = 2, x = −5 or x = 1/3.
- **Distinct** solutions count each value once: (x − 4)²(x + 1) = 0 has two distinct solutions, 4 and −1.
- **Hidden quadratics:** if the same chunk appears twice, call it u. (x − 3)² − 5(x − 3) + 6 = 0 becomes u² − 5u + 6 = 0, so u = 2 or u = 3. Then x − 3 = 2 or x − 3 = 3, so x = 5 or x = 6.

### Solving a formula for one letter

Some questions in this skill give a formula with several letters and ask you to solve for one of them. Treat the other letters as numbers and undo the operations in reverse order. For example, K = ½mv² becomes v² = 2K/m, so v = sqrt(2K/m) (a speed is positive). The Equivalent expressions lesson covers this in more detail.

## Worked examples

### Example 1: The quadratic formula

What are the solutions to x² − 6x + 4 = 0?

- (A) x = −3 ± √5
- (B) x = 3 ± √5
- (C) x = 3 ± √13
- (D) x = 6 ± 2√5

**Solution.** No two whole numbers multiply to 4 and add to −6, and the choices contain square roots, so don't try to factor. Completing the square is quick because a = 1 and b is even: x² − 6x = −4, then x² − 6x + 9 = 5, so (x − 3)² = 5. Take the square root: x − 3 = ±√5, so x = 3 ± √5. The quadratic formula gives the same thing: x = (6 ± sqrt(36 − 16))/2 = (6 ± √20)/2 = (6 ± 2√5)/2 = 3 ± √5.

Choice (C) comes from adding 4ac instead of subtracting it: sqrt(36 + 16) = √52 = 2√13. Choice (A) drops the minus sign in −b. Choice (D) forgets to divide by 2a.

**Answer:** (B)

### Example 2: A square root equation with a fake answer

Which of the following gives all the solutions to the equation sqrt(2x + 9) = x + 3?

- (A) x = −4 only
- (B) x = −4 and x = 0
- (C) There is no solution.
- (D) x = 0 only

**Solution.** The root is already alone, so square both sides: 2x + 9 = (x + 3)² = x² + 6x + 9. Move everything to one side: 0 = x² + 4x = x(x + 4). So x = 0 or x = −4. Now check both in the original equation. For x = 0: sqrt(9) = 3 and 0 + 3 = 3, so it works. For x = −4: sqrt(1) = 1, but −4 + 3 = −1, so it fails. A square root can't equal a negative number, which makes x = −4 extraneous.

Choice (B) skips the check. Choice (A) comes from dividing x² + 4x = 0 by x, which throws away x = 0 and keeps only the fake answer. Choice (C) is what you get if you divide by x and then do the check: the only answer left fails.

**Answer:** (D)

### Example 3: Sum of the solutions

3x² − 12x = 2x + 5

What is the sum of the solutions to the given equation?

*Student-produced response: enter your answer.*

**Solution.** First make one side 0: subtract 2x and 5 from both sides to get 3x² − 14x − 5 = 0. Now a = 3, b = −14 and c = −5. The sum of the solutions is −b/a = 14/3. Check by factoring: 3x² − 14x − 5 = (3x + 1)(x − 5), so the solutions are −1/3 and 5, and −1/3 + 5 = 14/3.

If you read b = −12 straight from the original equation, you get 4, the most common wrong answer. If you get −14/3, you dropped the minus sign in −b/a.

**Answer:** 14/3 or 4.666 or 4.667

### Example 4: When revenue equals cost

A company's daily revenue R and daily cost C, both in thousands of dollars, from making and selling x tons of a product are modeled by R(x) = −2x² + 60x and C(x) = 10x + 200. The company breaks even when its revenue equals its cost. What is the greater of the two amounts of product, in tons, at which the company breaks even?

- (A) 5
- (B) 12.5
- (C) 20
- (D) 30

**Solution.** Set the two functions equal: −2x² + 60x = 10x + 200. Move everything to the left: −2x² + 50x − 200 = 0. Divide every term by −2: x² − 25x + 100 = 0. Factor: (x − 5)(x − 20) = 0, so x = 5 or x = 20. The greater amount is 20 tons. Check: R(20) = −800 + 1,200 = 400 and C(20) = 200 + 200 = 400.

Choice (A) is the smaller break-even amount. Choice (B) is where profit (revenue minus cost) is largest: the vertex of −2x² + 50x − 200 is at x = 50/4 = 12.5. Choice (D) is where the revenue alone is 0.

**Answer:** (C)

### Example 5: A constant that gives no solutions

y = 2x² − 3x + 5

y = x + k

In the given system of equations, k is a constant. For which of the following values of k does the system have no real solutions?

- (A) 1
- (B) 3
- (C) 5
- (D) 7

**Solution.** Put the line into the parabola: 2x² − 3x + 5 = x + k. Move everything to the left: 2x² − 4x + (5 − k) = 0. So a = 2, b = −4 and c = 5 − k. No real solutions means D < 0:

(−4)² − 4(2)(5 − k) < 0, so 16 − 40 + 8k < 0, so 8k − 24 < 0, so k < 3.

Only 1 is less than 3. Check the boundary: at k = 3 the equation becomes 2x² − 4x + 2 = 2(x − 1)² = 0, with exactly one solution, so the line just touches the parabola at (1, 4). That is choice (B), the right answer to an "exactly one solution" question. Choices (C) and (D) make D positive, so the line crosses the parabola twice. Watch the −4: if you forget to subtract x and keep b = −3, you get k < 31/8, and both 1 and 3 seem to work.

**Answer:** (A)

### Example 6: A fraction equation with a fake answer

x/(x − 2) + 3/(x + 1) = 6/(x² − x − 2)

What value of x is the solution to the given equation?

*Student-produced response: enter your answer.*

**Solution.** Factor the denominator on the right: x² − x − 2 = (x − 2)(x + 1). So the common denominator is (x − 2)(x + 1), and x can't be 2 or −1. Multiply every term by it: x(x + 1) + 3(x − 2) = 6. Expand and simplify: x² + x + 3x − 6 = 6, so x² + 4x − 12 = 0, so (x + 6)(x − 2) = 0. That gives x = −6 or x = 2. But x = 2 makes two denominators 0, so it is extraneous. The only solution is −6. Check: −6/(−8) + 3/(−5) = 0.75 − 0.6 = 0.15, and 6/(36 + 6 − 2) = 6/40 = 0.15.

**Answer:** −6

## Traps to avoid

- **Reading a, b and c too early.** If the equation isn't in "= 0" form yet, b and c are wrong (Example 3).
- **Sign slips in b² − 4ac.** When a or c is negative, −4ac turns positive. Write the numbers in with parentheses: (−4)² − 4(2)(5 − k).
- **Losing a solution.** Dividing by x loses x = 0. Taking a square root without ± loses the negative answer.
- **Keeping fake solutions.** After squaring both sides or multiplying by an expression with x, check every answer in the original equation.
- **Misreading "exactly one solution".** For a system, it means the combined equation has D = 0: the line touches the curve once. It does not mean the parabola has only one x-intercept.
- **Flipping the inequality.** "No real solutions" is D < 0, and "two solutions" is D > 0. If you're unsure which side you need, test one of the choices.
- **Mixing up sum and product.** The sum is −b/a (with a minus sign); the product is c/a (no minus sign).
- **Answering the wrong thing.** If they ask for y, for x + y or for k, finish the job after you find x.
- **Splitting an impossible absolute value.** |x + 2| = −3 has no solutions, so there are no cases to split.
- **Counting a repeated solution twice.** (x − 4)² = 0 has one distinct solution, not two.

## Desmos shortcut

1. **Any equation in one variable:** graph each side as its own function and click the intersections. For Example 2, type `y=sqrt(2x+9)` and `y=x+3`. Only one intersection appears, at (0, 3). Fake solutions never show up as intersections, so this catches them for you.
2. **Quadratics with messy answers:** graph `y=x^2-6x+4` and click the x-intercepts: about 0.764 and 5.236. Then type `3+sqrt(5)` to see that it is also about 5.236, and pick the matching choice.
3. **Systems:** type both equations, `y=-2x^2+60x` and `y=10x+200`, and click the intersection points: (5, 250) and (20, 400). Zoom out if you can't see them.
4. **How many solutions:** count how many times the graphs cross. Two crossings mean two solutions, a single touch means one, and no contact means none.
5. **Find a constant with a slider:** type `y=2x^2-3x+5` and `y=x+k`, and accept the slider for k. Drag k and watch: below k = 3 the line misses the parabola, at k = 3 it just touches, and above it the line crosses twice. Then confirm with algebra.
6. **Graph the discriminant:** to see which values of the constant work, write D with x in place of k and graph it: `y=16-8(5-x)`. It equals 0 at x = 3 and is negative to the left of it, so k < 3 gives no solutions.
7. **Exponential equations:** graph `y=4^(x+1)` and `y=8^x`, zoom out (the crossing is high above the normal view) and click the intersection, (2, 64). So x = 2.

> **Tip:** For sum and product questions, −b/a and c/a take ten seconds; that is faster than finding both solutions in Desmos and adding them.

> **Tip:** After you type a fraction, Desmos keeps typing in its bottom until you press the right arrow key. For Example 6, type `y=x/(x-2)`, press the right arrow, then type `+3/(x+1)`. Graph `y=6/(x^2-x-2)` on the next line: the only intersection is at x = −6, and nothing appears at x = 2.

> **Trap:** Desmos shows decimals. If the choices are exact, like 3 ± √5 or 14/3, compare the decimals carefully or finish with algebra.

## Quick checklist

- What exactly do they want: the solutions, how many, a sum or product, a point, or a constant?
- Is the equation in "= 0" form before I read a, b and c?
- Did I keep both answers from a square root or an absolute value?
- Did I check my answers in the original equation after squaring or clearing fractions?
- For "exactly one", "no" or "two" solutions, did I use D = 0, D < 0 or D > 0?
- Did I answer the variable they asked for?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official testing points for this skill, with sample questions on a square equal to a negative number and a line meeting a parabola at one point.
- [College Board: Skills Insight for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — finding an unknown constant in nonlinear equations is a top score band (680–800) skill.
- [Test Ninjas: SAT Nonlinear Equations](https://test-ninjas.com/sat-nonlinear-equations) — overview of the sub-types, the find-the-constant patterns and the common traps.
- [Open Exam Prep: The discriminant and nature of roots](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/discriminant-nature-of-roots) — turning "exactly one", "no" and "two" solutions into D = 0, D < 0 and D > 0.
- [Open Exam Prep: Radical equations and extraneous solutions](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/radical-equations-extraneous) — why squaring creates fake answers, and checking with graphs.
- [The Test Advantage: SAT sum of solutions on Desmos](https://thetestadvantage.com/blog/sat-sum-of-solutions-on-desmos-may-2026-10-second-method) — when −b/a beats Desmos, and the "not in = 0 form" trap.
- [1600.io: Using regression to find both solutions to a quadratic equation](https://1600.io/courses/1698988/lectures/47466973) — the limits of Desmos decimals when the choices are exact.
- [JW Math Tutoring (YouTube): Summary of Advanced Quadratic Constant Techniques](https://www.youtube.com/watch?v=QMsEdNOzzAA) — Desmos methods for constants that give no, one or two solutions, and for a line meeting a parabola once.
- [r/Sat: Does the SAT test the discriminant and vertex formula often?](https://www.reddit.com/r/Sat/comments/1vh3f56/) — tutors and recent test takers on how often these appear and when Desmos is quicker.
- [r/Sat: Question bank fc3d783a, why the discriminant is zero](https://www.reddit.com/r/Sat/comments/1h4ocq0/) — the common confusion between "one intersection point" and "one x-intercept".
