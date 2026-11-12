---
title: Equivalent Expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Expand, factor, combine fractions, use exponent rules and match coefficients to find the equivalent form, then check it with a number.
---

## Spot it: same value, every x

Two expressions are **equivalent** when they give the same value for **every** allowed x: (x + 3)(x − 3) and x² − 9 are one expression in two forms. Clue words: *equivalent*, *can be written as*, *true for all values of x*.

1. **Look at the choices first.** Expanded, factored, one fraction? That's your target form.
2. **Check with a number** like x = 3. Skip 0 and 1: many different expressions agree there.
3. **Long one?** Graph the original and a choice in Desmos. The equivalent choice lies exactly on top.

```quiz
Which expression is equivalent to x² − 16?
- (x − 4)² :: That's x² − 8x + 16. A square of a difference has a middle term.
* (x + 4)(x − 4)
- (x − 8)(x + 2) :: These multiply to −16 but add to −6, giving x² − 6x − 16. Here the middle term is 0.
- x(x − 16) :: That's x² − 16x. The 16 isn't multiplied by x.
> Plug in x = 5: x² − 16 = 9, and (5 + 4)(5 − 4) = 9 ✓.
> The others give (5 − 4)² = 1, (5 − 8)(5 + 2) = −21 and 5(5 − 16) = −55, so they're out.
```

## Subtract every term in the group

A minus sign before parentheses flips **every** sign inside, not just the first: −(x² − 4x + 1) = −x² + 4x − 1.

Then combine **like terms**: same letter, same power. 3x² and 5x² combine; 3x² and 5x don't.

```quiz
Which expression is equivalent to (5x² − 2x + 7) − (2x² − 6x − 3)?
- 3x² − 8x + 4 :: You flipped only the first sign. Subtracting −6x adds 6x, and subtracting −3 adds 3.
- 3x² + 4x + 4 :: The −3 flips too: 7 − (−3) = 10.
* 3x² + 4x + 10
- 7x² − 8x + 4 :: You added the two groups instead of subtracting.
> Flip every sign in the second group: 5x² − 2x + 7 − 2x² + 6x + 3.
> Combine like terms: (5 − 2)x² + (−2 + 6)x + (7 + 3) = 3x² + 4x + 10.
```

## Exponent rules: same base only

| You see | Do this | Example |
|---|---|---|
| x^a · x^b | add | x³ · x⁴ = x⁷ |
| x^a / x^b | subtract | x⁷ / x² = x⁵ |
| (x^a)^b | multiply | (x³)⁴ = x¹² |
| x^(−a) | flip | x^(−2) = 1/x² |
| x^(m/n) | root on the bottom | x^(2/3) = ∛(x²) |

A power also reaches the number in front: (2x)³ = 8x³. To combine roots, write each one as a fraction exponent: √x = x^(1/2) and ∛x = x^(1/3).

```quiz
For x > 0, which expression is equivalent to (x² · ∛x) / √x?
- x^(17/6) :: Dividing by √x subtracts its 1/2. You added it.
- x^(9/2) :: ∛x is x^(1/3), not x³. The root goes on the bottom of the fraction.
- x^(1/6) :: Multiplying powers adds exponents: 2 + 1/3, not 2 × 1/3.
* x^(11/6)
> Write the roots as exponents: ∛x = x^(1/3) and √x = x^(1/2).
> Multiplying adds and dividing subtracts: 2 + 1/3 − 1/2 = 12/6 + 2/6 − 3/6 = 11/6.
> So the expression is x^(11/6).
```

## Factor in a fixed order

1. **Common factor** first: 6x³ − 9x² = 3x²(2x − 3).
2. **Difference of squares:** a² − b² = (a + b)(a − b).
3. **Three terms:** for x² + bx + c, find two numbers that multiply to c and add to b. So x² + x − 12 = (x + 4)(x − 3).
4. **Keep going** until no factor breaks down further.

```quiz
Which expression is equivalent to 3x³ − 12x?
- 3x(x − 2)² :: That multiplies out to 3x³ − 12x² + 12x. A perfect square has a middle term.
- 3x(x − 4)(x + 4) :: You used 4 instead of its square root, 2. That gives 3x(x² − 16).
- 3(x − 2)(x + 2) :: You dropped the x from the common factor 3x. This equals 3x² − 12.
* 3x(x − 2)(x + 2)
> Take out the common factor 3x: 3x(x² − 4).
> x² − 4 is a difference of squares, x² − 2², so it factors as (x − 2)(x + 2).
```

## Fractions: factors, not terms

- **Simplify:** factor the top and the bottom, then cancel only common **factors** (things multiplied). In (x + 6)/x you can't cancel the x's.
- **Add or subtract:** use a common denominator, often the product of the two bottoms. Multiply each top by the factor its bottom is missing.

```quiz
Which expression is equivalent to 2/(x + 3) + 5/(x − 1)?
- 7/(2x + 2) :: You added the tops and added the bottoms. Fractions need a common denominator first.
- 7/((x + 3)(x − 1)) :: Each top must be multiplied by the factor its bottom is missing.
- (7x + 17)/((x + 3)(x − 1)) :: Sign slip: 2(x − 1) = 2x − 2, not 2x + 2.
* (7x + 13)/((x + 3)(x − 1))
> The common denominator is (x + 3)(x − 1).
> New tops: 2(x − 1) + 5(x + 3) = 2x − 2 + 5x + 15 = 7x + 13.
> Check with x = 2: 2/5 + 5/1 = 5.4, and 27/(5 · 1) = 5.4 ✓
```

## True for all x: match terms

If two polynomials are equal for **every** x, their parts match: x² terms with x² terms, x terms with x terms, constants with constants.

Expand the side with the unknowns, group it by powers of x, then set each pair equal. Shortcut: plug in x = 0 to match the constants in one step.

```quiz
(ax + 2)(x − 5) = 3x² + bx − 10 is true for all values of x, where a and b are constants. What is the value of b?
- 3 :: That's a. Finish the job: b is the coefficient of x.
- −15 :: You missed the 2 · x term. The x terms are −5ax and 2x.
- 17 :: Sign slip: −5a = −15, so b = 2 − 15.
* −13
> Expand: ax² − 5ax + 2x − 10 = ax² + (2 − 5a)x − 10.
> Match the x² terms: a = 3. Match the x terms: b = 2 − 5(3) = −13.
> Check: (3x + 2)(x − 5) = 3x² − 13x − 10 ✓
```

## Solve a formula for one letter

Treat every other letter as a number. Undo what was done to your letter in **reverse order**. If your letter sits in two terms, collect them and **factor it out**.

To check a choice, pick easy values, work out the result from the original formula, and see which choice gives it.

```quiz
A = P(1 + rt). Which equation gives t in terms of A, P and r?
- t = (A − P)/r :: You forgot to divide by P. From A = P + Prt you get Prt = A − P.
- t = (A − 1)/(Pr) :: The 1 is multiplied by P. Subtract P, not 1.
- t = Pr/(A − P) :: You flipped the fraction at the end. t is on top in Prt = A − P.
* t = (A − P)/(Pr)
> Distribute: A = P + Prt. Subtract P: Prt = A − P. Divide by Pr: t = (A − P)/(Pr).
> Check: P = 100, r = 0.05 and t = 2 give A = 110, and (110 − 100)/(100 × 0.05) = 2 ✓
```

## The trap: the missing middle term

Squaring a binomial is where most points go: (a − b)² means (a − b)(a − b), which is four products, not two.

```quiz
Which expression is equivalent to (3x − 2)² − 4?
- 9x² :: Trap: (3x − 2)² is not 9x² + 4. You dropped the middle term, −2(3x)(2) = −12x.
- 9x² − 6x :: The middle term is 2 · a · b = 2 · 3x · 2 = 12x. You dropped the 2.
- 9x² − 12x − 8 :: (−2)² is +4, not −4.
* 9x² − 12x
> (3x − 2)² = (3x)² − 2(3x)(2) + 2² = 9x² − 12x + 4.
> Subtract 4: 9x² − 12x.
> Check with x = 2: (6 − 2)² − 4 = 12, and 36 − 24 = 12 ✓
```

## Your turn: easy

Flip every sign in the second group, then combine like terms.

```check
m-0197
```

## Your turn: medium

Common denominator first, then subtract the whole second top.

```check
m-0107
```

## Your turn: hard

Expand the left side and match each power of x.

```check
m-0042
```

## Recap

- Look at the choices first: their form is your target.
- Expanding: a minus flips every sign in the group, and (a ± b)² has a middle term, ±2ab.
- Exponents: multiplying adds, dividing subtracts, a power of a power multiplies, and the root goes on the bottom.
- Fractions: cancel factors only, and add or subtract over a common denominator.
- True for all x: match each power of x.
- Check your pick with a number like x = 3, never 0 or 1.
