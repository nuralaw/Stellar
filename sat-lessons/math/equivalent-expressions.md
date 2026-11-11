---
title: Equivalent expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Rewrite expressions with exponent rules, radicals, expanding, factoring and fractions, match coefficients, and solve a formula for any letter.
minutes: 18
---

## What this question looks like

Two expressions are **equivalent** when they give the same value for every allowed value of the variable. For example, (x + 3)² and x² + 6x + 9 are equivalent: try any x and you get the same number. Most of these questions give you an expression and four choices that look alike, and you pick the one that is the same expression written another way. Others hide unknown constants in an equation that is "true for all values of x", or ask you to solve a formula for one letter.

Typical question stems:

- "Which expression is equivalent to (2x − 3)² − (x² − 4x)?"
- "Which of the following is equivalent to the given expression, where x > 0?"
- "The expression 8x² − 18 can be written as 2(ax − b)(ax + b), where a and b are positive constants. What is a + b?"
- "The equation is true for all values of x, where a and b are constants. What is the value of a + b?"
- "Which of the following correctly expresses q in terms of p and f?"

On screen you see an expression or a formula, and four choices that are usually all in the same form: all factored, all single fractions, or all powers of x. This skill is part of Advanced Math (13 to 15 of the 44 math questions), and you should expect a few questions from it on every test, from quick one-step rewrites to hard identities.

The sub-types:

1. Expanding and combining polynomials.
2. Exponent rules, fraction exponents and radicals.
3. Factoring.
4. Rational expressions (fractions with x in them).
5. Matching coefficients ("true for all x").
6. Solving a formula for one letter.

## The method

1. **Look at the choices first.** What form are they in: expanded, factored, one fraction, a single power of x? That form is your target.
2. **Do the step that moves you toward that form:** expand, factor, combine fractions or use exponent rules. Put parentheses around every group you subtract or substitute.
3. **Compare with the choices after each step.** You can often stop early, because only one choice has the right denominator or the right first term.
4. **Check by plugging in a number.** Pick a value like x = 3 (avoid 0 and 1, which make many different expressions look equal). Work out the original and your choice. Same value: keep it. If two choices match, try a second number.
5. **"True for all x" questions:** expand one side and match the parts: the x² terms, the x terms and the constant terms. Or plug in easy x-values such as 0 and −1.
6. **"Solve for one letter" questions:** treat every other letter as a number, undo the operations in reverse order, and factor out your letter if it appears in two terms.

## Rules and formulas you need

### Exponent rules

These are not on the reference sheet.

| Rule | Example |
|---|---|
| x^a × x^b = x^(a + b) | x³ × x⁴ = x⁷ |
| x^a ÷ x^b = x^(a − b) | x⁷ ÷ x² = x⁵ |
| (x^a)^b = x^(ab) | (x³)⁴ = x¹² |
| (xy)^a = x^a × y^a | (2x)³ = 8x³ |
| x^0 = 1 | 7^0 = 1 |
| x^(−a) = 1/x^a | x^(−2) = 1/x² |
| x^(m/n) = ⁿ√(x^m), the nth root of x^m | x^(2/3) = cbrt(x²), and 8^(2/3) = 4 |

- In a fraction exponent, the bottom number is the root and the top number is the power: x^(3/4) = ⁴√(x³), the fourth root of x³.
- A negative exponent means "flip it", not "make it negative": 2^(−3) = 1/8.
- Exponents don't spread over + or −: (x + 3)² is not x² + 9, and sqrt(x² + 9) is not x + 3.

### Radicals

- sqrt(ab) = sqrt(a) × sqrt(b), and sqrt(a/b) = sqrt(a)/sqrt(b).
- Simplify by pulling out perfect squares: √72 = √36 × √2 = 6√2.
- √x = x^(1/2) and cbrt(x) = x^(1/3).
- To clear a root from a denominator, multiply the top and the bottom by it: 6/√3 = 6√3/3 = 2√3.

### Expanding

- Distribute to every term, including a minus sign: −(x² − 4x) = −x² + 4x.
- (a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b². Don't forget the middle term.
- (a + b)(a − b) = a² − b².
- Two binomials: multiply each term by each term. (2x − 3)(x + 4) = 2x² + 8x − 3x − 12 = 2x² + 5x − 12.

### Factoring: check in this order

1. **Greatest common factor:** 6x³ − 9x² = 3x²(2x − 3).
2. **Difference of squares:** 4x² − 25 = (2x − 5)(2x + 5).
3. **Perfect-square trinomial:** x² − 10x + 25 = (x − 5)². Test: the first and last terms are squares, and the middle term is 2 × x × 5.
4. **Other trinomials:** for x² + bx + c, find two numbers that multiply to c and add to b. For ax² + bx + c, use the ac method: in 2x² + 5x − 12, ac = −24, and 8 and −3 multiply to −24 and add to 5. So 2x² + 8x − 3x − 12 = 2x(x + 4) − 3(x + 4) = (2x − 3)(x + 4).
5. **Factor fully:** x⁴ − 16 = (x² + 4)(x² − 4) = (x² + 4)(x + 2)(x − 2). A sum of squares like x² + 4 does not factor.

### Rational expressions (fractions with x)

- **Simplify:** factor the top and the bottom, then cancel common **factors**, never single terms. (x² − 9)/(x + 3) = (x − 3)(x + 3)/(x + 3) = x − 3, for x ≠ −3.
- **Add or subtract:** rewrite both fractions over a common denominator, then combine the tops. When you subtract, put the second top in parentheses.
- **Multiply:** top × top and bottom × bottom. **Divide:** multiply by the flipped fraction.
- 1/a + 1/b is not 1/(a + b). It is (a + b)/(ab).
- **Dividing a polynomial (less common):** rewrite the top using the bottom. Since x² + 5x + 9 = (x + 2)(x + 3) + 3, you get (x² + 5x + 9)/(x + 2) = x + 3 + 3/(x + 2). Quick check: the remainder when p(x) is divided by x − a equals p(a). Here p(−2) = 4 − 10 + 9 = 3.

### Matching coefficients ("true for all x")

If two polynomials are equal for every value of x, then the x² parts match, the x parts match and the constants match. Example: if (x + k)² = x² + 10x + 25 for all x, then 2k = 10, so k = 5. Shortcut: plug in x = 0 to match the constants in one step.

### Solving a formula for one letter

- Treat the other letters as numbers.
- Undo the operations in reverse order: the last thing done to your letter is the first thing you undo.
- If the letter appears in two terms, collect them on one side and factor it out: A = P + Prt → A = P(1 + rt) → P = A/(1 + rt).
- If the letter is squared, take a square root at the end (keep the positive root for lengths): V = πr²h → r² = V/(πh) → r = sqrt(V/(πh)).

### Seeing structure

- If 3x + 2y = 7, then 6x + 4y = 2 × 7 = 14. You never need x and y themselves.
- Treat a repeated chunk as one thing: (x − 4)² + 3(x − 4) = (x − 4)(x − 4 + 3) = (x − 4)(x − 1).

## Worked examples

### Example 1: Square, then subtract

Which expression is equivalent to (2x − 3)² − (x² − 4x)?

- (A) 3x² + 4x + 9
- (B) 3x² − 2x + 9
- (C) 3x² − 8x + 9
- (D) 3x² − 16x + 9

**Solution.** Square first: (2x − 3)² = 4x² − 12x + 9. The middle term is 2 × 2x × (−3) = −12x. Then subtract the whole second group, changing both of its signs: 4x² − 12x + 9 − x² + 4x = 3x² − 8x + 9. Check with x = 3: the original gives 3² − (9 − 12) = 9 + 3 = 12, and (C) gives 27 − 24 + 9 = 12.

Choice (A) drops the middle term, as if (2x − 3)² were 4x² + 9. Choice (D) subtracts x² but forgets to change −4x into +4x. Choice (B) uses −6x as the middle term instead of −12x.

**Answer:** (C)

### Example 2: Roots as exponents

Which expression is equivalent to (x³ × cbrt(x²))/sqrt(x), where x > 0?

- (A) x^(3/2)
- (B) x^(19/6)
- (C) x^4
- (D) x^(25/6)

**Solution.** Turn every root into a fraction exponent: cbrt(x²) = x^(2/3) and sqrt(x) = x^(1/2). Multiplying adds exponents and dividing subtracts them, so the exponent is 3 + 2/3 − 1/2. With the common denominator 6: 18/6 + 4/6 − 3/6 = 19/6. The expression is x^(19/6).

Choice (C) reads cbrt(x²) as x^(3/2), with the root and the power swapped. Choice (D) adds 1/2 instead of subtracting it. Choice (A) multiplies 3 × 2/3 instead of adding.

**Answer:** (B)

### Example 3: Factor completely

Which expression is equivalent to 12x³ − 27x?

- (A) 3x(2x − 3)²
- (B) 3x(4x − 3)(x + 3)
- (C) 3x(2x − 9)(2x + 9)
- (D) 3x(2x + 3)(2x − 3)

**Solution.** First take out the greatest common factor: 12x³ − 27x = 3x(4x² − 9). Then 4x² − 9 is a difference of squares, (2x)² − 3², so it factors as (2x + 3)(2x − 3). Choice (A) is a perfect square, which has a middle term: (2x − 3)² = 4x² − 12x + 9. Choice (C) uses 9 instead of its square root 3, which gives 4x² − 81. Choice (B) multiplies out to 4x² + 9x − 9. To check in Desmos, graph y = 12x³ − 27x together with each choice; only (D) lies exactly on top of it.

**Answer:** (D)

### Example 4: Subtracting fractions

Which expression is equivalent to 3/(x − 2) − 2/(x + 1), where x > 2?

- (A) (x + 7)/((x − 2)(x + 1))
- (B) (x − 1)/((x − 2)(x + 1))
- (C) (5x − 1)/((x − 2)(x + 1))
- (D) 1/(2x − 1)

**Solution.** All four choices are single fractions, so combine over the common denominator (x − 2)(x + 1). Multiply each fraction's top and bottom by the factor it is missing: 3(x + 1)/((x − 2)(x + 1)) − 2(x − 2)/((x − 2)(x + 1)). Now subtract the tops, keeping the second one in parentheses: 3(x + 1) − 2(x − 2) = 3x + 3 − 2x + 4 = x + 7. Check with x = 3: the original gives 3/1 − 2/4 = 2.5, and (A) gives 10/(1 × 4) = 2.5.

Choice (B) forgets that −2 times −2 is +4. Choice (C) adds the fractions instead of subtracting. Choice (D) subtracts the tops and adds the bottoms, which is never allowed.

**Answer:** (A)

### Example 5: Matching coefficients

The equation (ax + 3)(2x + b) = 10x² − 4x − 6 is true for all values of x, where a and b are constants. What is the value of a − b?

*Student-produced response: enter your answer.*

**Solution.** Expand the left side: (ax + 3)(2x + b) = 2ax² + abx + 6x + 3b = 2ax² + (ab + 6)x + 3b. Now match each part with the right side:

- x² terms: 2a = 10, so a = 5.
- constant terms: 3b = −6, so b = −2.
- x terms, as a check: ab + 6 = 5 × (−2) + 6 = −4, which matches −4x.

So a − b = 5 − (−2) = 7. Careful with the double minus: 5 − 2 = 3 is the most common wrong answer.

A faster way is to plug in numbers. With x = 0, the left side is 3b and the right side is −6, so b = −2 right away. With x = −1, the left side is (−a + 3)(−2 − 2) and the right side is 10 + 4 − 6 = 8, so (−a + 3)(−4) = 8, which gives a = 5.

**Answer:** 7

### Example 6: Solving a lens formula for one letter

A camera lens forms a sharp image when 1/f = 1/p + 1/q, where f is the focal length of the lens, p is the distance from the object to the lens and q is the distance from the lens to the image, all in centimeters, with p > f > 0. Which equation correctly gives q in terms of p and f?

- (A) q = f − p
- (B) q = (p − f)/(pf)
- (C) q = pf/(p − f)
- (D) q = pf/(f − p)

**Solution.** Get 1/q alone: 1/q = 1/f − 1/p. Combine the right side over the common denominator pf: 1/q = p/(pf) − f/(pf) = (p − f)/(pf). Now flip both sides: q = pf/(p − f). Check with numbers: if p = 6 and f = 2, then 1/q = 1/2 − 1/6 = 1/3, so q = 3, and (C) gives 12/4 = 3.

Choice (B) is 1/q: it forgets the final flip and gives 1/3. Choice (A) flips each term on its own, which is not allowed, since the flip of a difference is not the difference of the flips; it gives −4. Choice (D) subtracts in the wrong order and gives −3, a negative distance.

**Answer:** (C)

## Traps to avoid

- **Dropping the middle term.** (x + 3)² = x² + 6x + 9, not x² + 9.
- **Distributing a minus sign to only the first term.** −(x² − 4x) = −x² + 4x, not −x² − 4x.
- **Canceling terms instead of factors.** (x + 6)/(x + 2) is not 6/2: you can't cross out the x's. Factor first, and cancel only things that multiply the whole top and the whole bottom.
- **Mixing up exponent rules.** Multiplying powers adds the exponents, and a power of a power multiplies them: x³ × x² = x⁵, but (x³)² = x⁶.
- **Reading a negative exponent as a negative number.** x^(−2) = 1/x², which is positive.
- **Flipping a fraction exponent.** x^(2/3) is the cube root of x², not the square root of x³.
- **Splitting roots and flips over + or −.** sqrt(a + b) is not sqrt(a) + sqrt(b), and 1/(a + b) is not 1/a + 1/b.
- **Stopping factoring too soon.** 3x(4x² − 9) is equivalent, but if the choices are fully factored, keep going until nothing breaks down further.
- **Testing with 0 or 1.** Many wrong choices give the same value there. Use a number like 3 or 2.5, and a second number if two choices still match.
- **Trusting a graph near a hole.** Two fraction expressions can match everywhere except at one x-value where one of them is undefined. Read the "where x > 2" or "x ≠ 3" conditions in the question.

## Desmos shortcut

Desmos can't do algebra for you, but it is an excellent checker.

1. **Overlap test:** graph the original and a choice, for example `y=12x^3-27x` and `y=3x(2x+3)(2x-3)`. If the two curves lie exactly on top of each other, the expressions are equivalent. Try each choice; a wrong one shows up as a second, separate curve.
2. **Number test:** define both expressions and subtract them at an unusual value. Type `f(x)=(2x-3)^2-(x^2-4x)` and `g(x)=3x^2-8x+9`, then `f(3.7)-g(3.7)`. A result of 0 means they match there; test one more value to be safe.
3. **Find constants with lists:** type `x1=[-2,-1,0,1,2]` and `y1=10x1^2-4x1-6` to make points from the right side (Desmos turns each 1 into a small subscript by itself; don't type an underscore, or the ^2 and the ~ get stuck in the subscript). Then type `y1~(ax1+3)(2x1+b)`, and Desmos finds a = 5 and b = −2. Sliders also work: graph `y=(ax+3)(2x+b)` and `y=10x^2-4x-6`, then move a and b until the curves match.
4. **Check a rearranged formula with numbers:** pick values that fit the original formula (p = 6 and f = 2 give q = 3), then use Desmos as a calculator to see which choice gives 3 with those values.

> **Tip:** Desmos can keep typing inside an exponent, the bottom of a fraction or a root after you meant to leave it. For x^(2/3) + 1, type `x^2/3` (Desmos puts the whole fraction 2/3 up in the exponent), press the right arrow key twice to step out, then type `+1`. Always check the formatted line before you trust the graph.

> **Trap:** A graph only shows that two expressions have the same values. If the question asks for a specific form (fully factored, or a single power of x), you still have to pick the choice written in that form.

## Quick checklist

- What form are the choices in, and am I working toward that form?
- Did I put parentheses around everything I subtract or substitute?
- When squaring a sum or difference, did I include the middle term?
- With fractions, did I cancel only factors and subtract the whole second top?
- Exponents: add when multiplying, multiply for a power of a power, and the root goes on the bottom of a fraction exponent.
- Did I check my choice with a number other than 0 or 1?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official testing points (common factors, difference of squares, trinomials, rational expressions, rational exponents in radical form) and a sample fraction question.
- [College Board: Skills Insight for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — rewriting complex expressions with exponent, polynomial, rational and radical rules is a top score band (680–800) skill.
- [Test Ninjas: SAT Equivalent Expressions](https://www.test-ninjas.com/sat-equivalent-expressions) — the expand, factor or test routine, smart test numbers, and the classic traps.
- [Albert: Equivalent Expressions, SAT Math Review](https://www.albert.io/blog/?p=117715) — why 0 and 1 are bad test values, and the main factoring order.
- [Open Exam Prep: Factoring and equivalent algebraic expressions](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/factoring-equivalent-expressions) — factoring patterns in order, plus plug-in and Desmos checks.
- [Open Exam Prep: Exponent rules and radical expressions](https://open-exam-prep.com/study-guides/sat-math/advanced-math-functions/exponent-rules-radicals) — fraction exponents, rationalizing and exponent traps.
- [Just Locked In: Equating coefficients](https://justlockedin-main.pages.dev/patterns/math/advanced-math/equivalent-expressions/equating-coefficients.html) — the matching-coefficients pattern and its sign traps.
- [PWN Test Prep: Hi Mike, is there a best way to do #25 on dSAT 3 module 1?](https://pwntestprep.com/2025/02/hi-mike-is-there-a-best-way-to-do-25-on-dsat-3-module-1-thanks/) — using the denominators in the answer choices to skip most of the algebra on a fraction question.
- [JW Math Tutoring (YouTube): Ultimate Desmos Guide to Digital SAT Math, Part 5: Advanced Skills](https://www.youtube.com/watch?v=DdJUVn2zxnA) — Desmos regression to find constants that make two expressions match, and solving formulas.
- [r/Sat: Official Desmos thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/) — students' and tutors' Desmos syntax tips, including graphing both expressions to check equivalence.
