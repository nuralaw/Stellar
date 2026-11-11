---
title: Equivalent Expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Rewrite expressions with exponent rules, factoring and expanding, find the equivalent choice fast, and check it with a plug-in number or Desmos.
minutes: 12
---

> **Key idea:** Equivalent means equal for every allowed x. Rewrite toward the form the choices use, then confirm by plugging in x = 2 or 3 or by overlapping graphs in Desmos.

## What this question looks like

These questions ask you to rewrite an expression, not solve an equation. Two expressions are **equivalent** when they give the same value for *every* allowed value of the variable: `(x − 3)(x + 3)` and `x² − 9` are one expression in two forms.

Expect a few per test, mostly multiple choice, sometimes student-produced response (you type a number). Typical stems:

- "Which expression is equivalent to `(2x − 5)² − 3x`?"
- "For x > 0, which expression is equivalent to x^(3/2) · √x?"
- "`(ax + 2)(x − 4) = 3x² − 10x − 8` is true for all values of x, where a is a constant. What is a?"
- "`x² − 8x + 21` can be written as `(x − h)² + k`. What is k?"
- "Which expression is equivalent to `(x² − 4)/(x + 2)`, for x ≠ −2?"

Clue words are *equivalent*, *for all values of x*, *can be written as*, and *where a and b are constants*.

## The method

Let the answer choices tell you where to go, then do the algebra in small steps.

1. **Look at the choices first.** They show the target form: factored, expanded, or with fractional exponents.
2. **Work one layer at a time.** Clear parentheses, distribute negatives to *every* term, then combine like terms (same variable, same power).
3. **For "true for all x", match coefficients.** Expand both sides, line up the x² terms, x terms and constants, and set each pair equal.
4. **If the algebra gets messy, plug in a number.** Pick x = 2 or 3, evaluate the original and each choice, and cross out any choice that differs.
5. **Or graph in Desmos.** The equivalent choice lies exactly on top of the original.
6. **Break ties.** If two choices match your number, test a second number.

Algebra is usually fastest on short expressions. Plugging in and graphing are your safety net for long ones or a final double-check.

## Rules and formulas you need

### Exponent rules

These rules only work when the bases match.

| Rule | Example |
|---|---|
| x^a · x^b = x^(a + b) | x³ · x⁴ = x⁷ |
| x^a / x^b = x^(a − b) | x⁹ / x² = x⁷ |
| (x^a)^b = x^(ab) | (x³)⁴ = x¹² |
| (xy)^a = x^a · y^a | (2x)³ = 8x³, not 2x³ |
| x⁰ = 1 (x ≠ 0) | 7⁰ = 1 |
| x^(−a) = 1/x^a | x^(−2) = 1/x² |
| x^(m/n) = (n-th root of x)^m | 8^(2/3) = (∛8)² = 4 |

For fractional exponents, remember **power over root**: the top number is the power, the bottom is the root. So √x = x^(1/2) and ∛x = x^(1/3). To simplify messy radicals, turn every root into an exponent, apply the rules, then turn it back if the choices use roots.

### Special products

Know these both ways, forward and backward.

| Pattern | Expanded form |
|---|---|
| (a + b)² | a² + 2ab + b² |
| (a − b)² | a² − 2ab + b² |
| (a + b)(a − b) | a² − b² (difference of squares) |

### Factoring, in this order

1. Pull out the **greatest common factor** (GCF): `6x³ − 9x² = 3x²(2x − 3)`.
2. Two squares with a minus between them: `25x² − 4 = (5x − 2)(5x + 2)`. It can repeat: `x⁴ − 16 = (x² + 4)(x + 2)(x − 2)`.
3. Three terms: check for a perfect square (`x² − 10x + 25 = (x − 5)²`), then find two numbers that multiply to the constant and add to the middle coefficient: `x² + x − 12 = (x + 4)(x − 3)`.
4. Multiply back out to check.

### Other must-knows

- **Multiplying polynomials:** every term in the first meets every term in the second. A 2-term times 3-term product has 6 pieces before combining.
- **Subtracting polynomials:** the minus flips every sign in the second group: `(4x² − x + 3) − (x² − 5x − 2) = 3x² + 4x + 5`.
- **Rational expressions** (fractions with variables): factor the top and bottom fully, then cancel common factors (things multiplied).
- **Matching coefficients:** if `ax² + bx + c = dx² + ex + f` for all x, then a = d, b = e and c = f.
- **Completing the square** reveals a hidden constant: `x² − 8x + 21 = (x − 4)² + 5`.
- **Splitting a fraction:** rewrite the top to contain the bottom: `(x² + 5x + 7)/(x + 2) = x + 3 + 1/(x + 2)`.
- **Radicals:** pull out perfect squares, like √(50x³) = 5x√(2x) for x ≥ 0. Radicals multiply (√a · √b = √(ab)) but don't add (√a + √b ≠ √(a + b)).

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

Test makers build a wrong choice around each of these slips.

- **Losing the middle term.** `(x + 5)² = x² + 10x + 25`, never x² + 25. Squaring a sum always makes a middle term.
- **Half-distributing a minus sign.** In `−(2x − 7)` the −7 becomes +7. There's always a choice where only the first sign flipped.
- **Canceling terms instead of factors.** In `(x + 6)/x` you can't cross out the x's, because the top x is added to 6, not multiplied.
- **Forgetting the coefficient in a power.** `(3x²)³ = 27x⁶`. The 3 gets cubed too.
- **Treating a negative exponent as a negative number.** x^(−3) is 1/x³, which is positive when x is positive.
- **Adding exponents when you add terms.** x³ + x⁴ is not x⁷. Exponent rules are for multiplying and dividing only.
- **Missing a reordered answer.** `−4 + 3x` and `3x − 4` are the same, and the right choice is often rearranged.
- **Testing with 0 or 1.** Many different expressions agree there, so a match proves nothing.
- **Solving when you should match.** "True for all x" means matching coefficients, not solving for x.

## Desmos shortcut

Desmos is built into every math question and is a strong check for "which is equivalent" questions.

1. **Overlap test.** Type the original as `y = …` on line 1 and each choice below it. The equivalent choice sits exactly on top. Click a line's colored circle to hide and show it, so you can tell a true match from a near miss.
2. **Difference test (cleaner).** Type `y = (original) − (choice)`. A flat line at y = 0 means equivalent; any bump or slope means not.
3. **Table test.** Type `f(x) = original` and `g(x) = choice`, add a table with x-values like 2, 3, −1.5 and 7, and compare the f and g columns.
4. **Slider for a constant.** For "true for all x", graph both sides with a letter like k for the unknown. Drag the slider (or type values) until the graphs overlap, then confirm by matching coefficients.
5. **Regression for several constants (advanced).** Type `x₁ = [1, 2, 3, 4, 5]`, then `y₁ = 3x₁² − 7x₁ − 20`, then `y₁ ~ (a x₁ + 5)(x₁ − k)`. Desmos reports a = 3 and k = 4; check that R² = 1 (a perfect fit).

### Desmos tips that save points

- If the question uses another letter (like t or n), retype it as x, or Desmos makes a slider instead of a graph.
- If the expression has constants like a or b, keep their sliders and move them. The right choice must stay on top for every value.
- Graphs hide single missing points (holes), and "x > 0" means only the right half must match. Read the restriction first.
- Typing four long choices takes time. On short questions, plain algebra is faster.

> **Tip:** Wrap fractional exponents in parentheses: type `x^(2/3)`. Then check that the whole 2/3 sits up in the exponent, not x² divided by 3.

## Quick checklist

- Did I check the choices to see which form they want?
- Did I distribute every negative sign to every term?
- Did I include the middle term when squaring a binomial?
- Did I apply exponents to the coefficients too?
- Did I cancel only factors, never terms?
- For "true for all x", did I match every power of x and use one match as a check?
- Did I confirm with x = 2 or 3, or a Desmos overlap?
