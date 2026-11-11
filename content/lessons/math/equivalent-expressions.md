---
title: Equivalent Expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Rewrite expressions with exponent rules, factoring and expanding, spot the equivalent answer fast, and use plug-in numbers or Desmos to check it.
minutes: 11
---

## What this question looks like

Two expressions are **equivalent** when they give the same value for *every* allowed value of the variable, not just one. They can look completely different: `(x − 3)(x + 3)` and `x² − 9` are the same expression in two forms.

You will usually see a few of these questions per test, mostly multiple choice, sometimes student-produced response (you type in a number). Typical stems:

- "Which expression is equivalent to `(2x − 5)² − 3x`?"
- "For x > 0, which expression is equivalent to `x^(3/2) · √x`?"
- "The equation `(ax + 2)(x − 4) = 3x² − 10x − 8` is true for all values of x, where a is a constant. What is the value of a?"
- "The expression `x² − 8x + 21` can be written as `(x − h)² + k`. What is k?"
- "Which expression is equivalent to `(x² − 4)/(x + 2)`, for x ≠ −2?"

Clue words: **equivalent**, **for all values of x**, **can be written as**, **where a and b are constants**. When you see them, you are rewriting, not solving.

## The method

1. **Look at the answer choices first.** They tell you the target form. Factored choices mean factor; expanded choices mean expand; fractional exponents mean convert radicals to exponents.
2. **Do the algebra one layer at a time.** Clear parentheses, distribute negatives to *every* term, then combine like terms (terms with the same variable and the same power).
3. **For "true for all x" questions, match coefficients.** Expand both sides, line up the x² terms, the x terms and the constants, and set each pair equal.
4. **If the algebra gets messy, plug in a number.** Pick x = 2 or x = 3 (not 0 or 1). Evaluate the original and each choice. Any choice that gives a different value is out.
5. **Or use Desmos.** Graph the original and the choices. The equivalent one lies exactly on top of the original (see the Desmos section below).
6. **Check the survivor.** If two choices tie on your plug-in number, test a second number.

> **Key idea:** Algebra is usually fastest on simple ones. Plugging in or graphing is your safety net when the expression is long, when you are unsure, or when you have time left to double-check.

## Rules and formulas you need

**Exponent rules** (they only work when the bases match):

| Rule | Example |
|---|---|
| `xᵃ · xᵇ = x^(a + b)` | x³ · x⁴ = x⁷ |
| `xᵃ / xᵇ = x^(a − b)` | x⁹ / x² = x⁷ |
| `(xᵃ)ᵇ = x^(ab)` | (x³)⁴ = x¹² |
| `(xy)ᵃ = xᵃyᵃ` | (2x)³ = 8x³, not 2x³ |
| `x⁰ = 1` (x ≠ 0) | 7⁰ = 1 |
| `x^(−a) = 1/xᵃ` | x^(−2) = 1/x² (a reciprocal, not a negative number) |
| `x^(m/n)` = n-th root of x, raised to the m | 8^(2/3) = (∛8)² = 2² = 4 |

Memory trick for fractional exponents: **power over root**. The top number is the power, the bottom number is the root. So √x = `x^(1/2)` and ∛x = `x^(1/3)`. To simplify a messy radical expression, turn every root into a fractional exponent, use the rules above, then turn it back if the choices use roots.

**Special products** (know them both ways, forward and backward):

| Pattern | Expanded form |
|---|---|
| `(a + b)²` | a² + 2ab + b² |
| `(a − b)²` | a² − 2ab + b² |
| `(a + b)(a − b)` | a² − b² (difference of squares) |

**Factoring checklist**, in this order:

1. Pull out the **greatest common factor** (GCF) first: `6x³ − 9x² = 3x²(2x − 3)`.
2. Two squared terms with a minus between them? Difference of squares: `25x² − 4 = (5x − 2)(5x + 2)`. It can repeat: `x⁴ − 16 = (x² + 4)(x + 2)(x − 2)`.
3. Three terms? Check for a perfect square first (`x² − 10x + 25 = (x − 5)²`), then look for two numbers that multiply to the constant and add to the middle coefficient: `x² + x − 12 = (x + 4)(x − 3)`.
4. Check your factoring by multiplying back out.

**Other must-knows:**

- **Multiplying polynomials:** every term in the first meets every term in the second. A 2-term times 3-term product has 6 pieces before combining.
- **Subtracting polynomials:** the minus sign flips *every* sign inside the second group: `(4x² − x + 3) − (x² − 5x − 2) = 3x² + 4x + 5`.
- **Rational expressions** (fractions with variables): factor the top and the bottom completely, then cancel common **factors** (things multiplied), never terms (things added).
- **Matching coefficients:** if `ax² + bx + c = dx² + ex + f` for all x, then a = d, b = e and c = f.
- **Rewriting to reveal a constant:** complete the square to show a hidden number, e.g. `x² − 8x + 21 = (x − 4)² + 5`. Or rewrite the top of a fraction to contain the bottom: `(x² + 5x + 7)/(x + 2) = x + 3 + 1/(x + 2)`.
- **Radicals:** pull out perfect squares, like √(50x³) = 5x√(2x) for x ≥ 0. Radicals multiply (√a · √b = √(ab)) but do not add (√a + √b ≠ √(a + b)).

## Worked examples

### Example 1: Expand and subtract

Which expression is equivalent to `(3x − 2)² − (x + 4)(x − 4)`?

- (A) `8x² + 20`
- (B) `8x² − 12x − 12`
- (C) `8x² − 12x + 20`
- (D) `10x² − 12x − 12`

**Solution**

Expand each piece on its own first.

- `(3x − 2)² = 9x² − 12x + 4` (don't forget the middle term: 2 · 3x · 2 = 12x).
- `(x + 4)(x − 4) = x² − 16` (difference of squares).

Now subtract the whole second piece: `9x² − 12x + 4 − x² + 16 = 8x² − 12x + 20`.

Quick plug-in check with x = 2: the original is (4)² − (6)(−2) = 16 + 12 = 28, and choice (C) gives 32 − 24 + 20 = 28. They match.

Why the others are wrong: (A) drops the middle term of the square. (B) forgets that subtracting −16 makes +16. (D) adds the second product instead of subtracting it.

**Answer:** (C)

### Example 2: Fractional exponents

For x > 0, which expression is equivalent to `(8x⁶)^(2/3) / √x`?

- (A) `4x⁴√x`
- (B) `4x³√x`
- (C) `8x³√x`
- (D) `2x³√x`

**Solution**

Apply the 2/3 power to *both* factors inside the parentheses.

- `8^(2/3)`: the cube root of 8 is 2, and 2² = 4.
- `(x⁶)^(2/3) = x^(6 · 2/3) = x⁴`.

So the top is 4x⁴. Write √x as `x^(1/2)` and divide by subtracting exponents: `x^(4 − 1/2) = x^(7/2)`. Since 7/2 = 3 + 1/2, that is x³ · √x. The whole thing is 4x³√x.

Check with x = 4: the top is (8 · 4096)^(2/3) = 32768^(2/3) = 1024, and 1024 / √4 = 512. Choice (B): 4 · 64 · 2 = 512. It matches.

Why the others are wrong: (A) adds the exponents (4 + 1/2) instead of subtracting. (C) never applies the 2/3 power to the 8. (D) takes the cube root of 8 but forgets to square it.

**Answer:** (B)

### Example 3: True for all values of x (student-produced response)

The equation `(ax + 5)(x − k) = 3x² − 7x − 20` is true for all values of x, where a and k are constants. What is the value of a + k?

**Solution**

Expand the left side: `ax² − akx + 5x − 5k`, which groups as `ax² + (5 − ak)x − 5k`.

Match it to `3x² − 7x − 20`, piece by piece:

- x² terms: a = 3.
- Constants: −5k = −20, so k = 4.
- x terms (use as a check): 5 − ak = 5 − 3 · 4 = −7. It works.

So a + k = 3 + 4 = 7.

> **Trap:** Seeing "x − k" next to "−20" tempts people to write k = −4. Always expand and match. Never guess the sign.

**Answer:** 7

### Example 4: Rational expression in disguise

Which expression is equivalent to `(x² − 9)/(x² + x − 6)`, for x ≠ −3 and x ≠ 2?

- (A) `1 − 1/(x − 2)`
- (B) `1 + 1/(x − 2)`
- (C) `(x + 3)/(x + 2)`
- (D) `−9/(x − 6)`

**Solution**

Factor top and bottom: `(x − 3)(x + 3) / ((x + 3)(x − 2))`. Cancel the common factor (x + 3) to get `(x − 3)/(x − 2)`.

None of the choices look like that, so rewrite the top to contain the bottom: x − 3 = (x − 2) − 1. That gives `(x − 2)/(x − 2) − 1/(x − 2) = 1 − 1/(x − 2)`.

Plug-in check with x = 4: the original is 7/14 = 1/2, and (A) gives 1 − 1/2 = 1/2. Choices (B), (C) and (D) give 3/2, 7/6 and 9/2.

Why the others are wrong: (B) has the sign of the leftover flipped. (C) comes from factoring the bottom wrong as (x − 3)(x + 2). (D) "cancels" the x² terms, which are added terms, not factors.

**Answer:** (A)

## Traps to avoid

- **Losing the middle term.** `(x + 5)² = x² + 10x + 25`, never x² + 25. Squaring a sum always makes a middle term.
- **Half-distributing a minus sign.** In `−(2x − 7)` the −7 becomes +7. Test makers always include the choice where only the first sign flipped.
- **Canceling terms instead of factors.** In `(x + 6)/x` you cannot cross out the x's, because the x on top is added to 6, not multiplied.
- **Forgetting the coefficient in a power.** `(3x²)³ = 27x⁶`. The 3 gets cubed too.
- **Treating a negative exponent as a negative number.** `x^(−3)` is 1/x³, and it stays positive when x is positive.
- **Adding exponents when you add terms.** `x³ + x⁴` does not simplify to x⁷. Exponent rules only work for multiplying and dividing.
- **Being fooled by a reordered answer.** `−4 + 3x` and `3x − 4` are the same. Rearranged correct answers are common.
- **Testing with 0 or 1.** Many different expressions agree at those values, so a "match" there proves nothing.
- **Solving when you should match.** "True for all x" means the coefficients must match. You are not solving for x.

## Desmos shortcut

Desmos is built into every math question, and it is a great check for "which is equivalent" questions.

1. **Overlap test.** Type the original expression on line 1 (as `y = …`) and each answer choice on the lines below. The equivalent choice sits exactly on top of the original. Click a line's colored circle to hide it and show it again, so you can see whether the curves truly match or just look close.
2. **Difference test (cleaner).** Type `y = (original) − (choice)`. If the result is the flat line y = 0 everywhere, they are equivalent. Any bump or slope means they are not.
3. **Table test.** Type `f(x) = original` and `g(x) = choice`, add a table with x-values like 2, 3, −1.5, 7, and compare the f and g columns.
4. **Find a constant with a slider.** For "true for all x" questions, type both sides as separate graphs and use a letter like k for the unknown. Desmos offers a slider. Drag it, or type values in, until the graphs overlap. Then confirm with quick coefficient matching.
5. **Regression for several constants (advanced).** Type `x₁ = [1, 2, 3, 4, 5]` and `y₁ = 3x₁² − 7x₁ − 20`, then `y₁ ~ (a x₁ + 5)(x₁ − k)`. Desmos reports a = 3 and k = 4. Check that R² = 1 (a perfect fit).

Desmos tips that save points:

- Use parentheses for fractional exponents: type `x^(2/3)`, because `x^2/3` means x² divided by 3.
- If the question uses a letter other than x (like t or r), retype it as x. Otherwise Desmos makes a slider instead of a graph.
- If the expression also contains constants like a or b, keep their sliders and move them around. The right choice must stay on top for every slider value.
- Graphs hide single missing points (holes), and a condition like "x > 0" means only the right half of the graph needs to match. Read the restriction before you judge.
- Typing four long choices takes time. On short questions, plain algebra is faster.

## Quick checklist

- Did I look at the answer choices to see which form they want?
- Did I distribute every negative sign to every term?
- Did I include the middle term when squaring a binomial?
- Did I apply exponents to the coefficients too?
- Did I cancel only factors, never terms?
- For "true for all x," did I match every power of x, and use one match as a check?
- Did I confirm with a plug-in number like 2 or 3, or a Desmos overlap?

## Sources

- [College Board: Advanced Math question types on the SAT](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/advanced)
- [Albert: Equivalent Expressions SAT Math Review](https://www.albert.io/blog/equivalent-expressions-sat-math-review/)
- [Albert: Rewriting Rational and Radical Expressions for SAT Math](https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/)
- [Test Ninjas: SAT Equivalent Expressions](https://www.test-ninjas.com/sat-equivalent-expressions)
- [Varsity Tutors: Equivalent Expressions lesson](https://www.varsitytutors.com/practice/subjects/sat-math/lessons/equivalent-expressions)
- [Open Exam Prep: Exponent Rules and Radicals](https://open-exam-prep.com/study-guides/sat-math/advanced-math-functions/exponent-rules-radicals)
- [Open Exam Prep: Algebra Strategy with Desmos and Answer Choices](https://open-exam-prep.com/study-guides/sat/math-algebra-and-advanced-math/algebra-strategy-with-desmos-and-answer-choices)
- [Just Locked In: Equating Coefficients pattern](https://justlockedin-main.pages.dev/patterns/math/advanced-math/equivalent-expressions/equating-coefficients.html)
- [Acely: Desmos Cheat Sheet for the SAT](https://acely.com/sat-prep/desmos-cheat-sheet)
- [Say Hello College: Guide to the Desmos SAT Calculator](https://sayhellocollege.com/blog/guide-to-using-the-desmos-sat-calculator/)
- [The Test Advantage: How to Use Desmos on the SAT](https://thetestadvantage.com/blog/how-to-use-desmos-on-the-sat-complete-may-2026-guide)
- [Open SAT: Desmos applications](https://open-sat.vercel.app/docs/math/desmos/applications)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [Khan Academy: Equivalent expressions (video)](https://www.khanacademy.org/test-prep/get-ready-for-sat-prep-math/x9eb58585c728c6ea:get-ready-advanced-math/x9eb58585c728c6ea:get-ready-isolating-quantities/v/equivalent-algebraic-expressions-exercise)
- [Khan Academy: Operations with polynomials (SAT lesson)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math-easier/x0fcc98a58ba3bea7:operations-with-polynomials-easier/a/v2-sat-lesson-operations-with-polynomials)
- [Khan Academy: Radicals and rational exponents (SAT lesson)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math-easier/x0fcc98a58ba3bea7:radicals-and-rational-exponents-easier/a/v2-sat-lesson-radicals-and-rational-exponents)
- [YouTube: Digital SAT Math factoring question, four different solutions](https://www.youtube.com/watch?v=uw_ML02Am9A)
- [YouTube: How the SAT makes a simple factoring question harder](https://www.youtube.com/watch?v=-FiMqkGGUS0)
- [YouTube: Factoring Quadratics Made Easy, SAT Math](https://www.youtube.com/watch?v=o2f4vmvEDS8)
