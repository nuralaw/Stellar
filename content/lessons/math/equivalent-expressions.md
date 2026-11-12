---
title: Equivalent Expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Expand, factor and combine fractions to find the equivalent form.
---

# Expand
Each term times each term. Then combine.

## Multiply out

**Equivalent** expressions give the same value for every x.

```example
Which expression is equivalent to (x + 3)(x + 2)?
1. x·x + x·2 + 3·x + 3·2 :: Each term times each term.
2. x² + 2x + 3x + 6 :: Four products.
3. x² + 5x + 6 :: Like terms: 2x + 3x = 5x.
```

## Squared? Write it twice

```quiz
Which expression is equivalent to (x − 5)²?
- x² + 25 :: You squared each term. The middle −10x is missing.
* x² − 10x + 25
- x² − 25 :: That's (x − 5)(x + 5), not a square.
> (x − 5)(x − 5) = x² − 5x − 5x + 25 = x² − 10x + 25.
~ zoom -2 12 -5 30
~ type y=(x-5)^{2} :: Graph the question.
~ type y=x^{2}-10x+25 :: Graph a choice. One curve? Equivalent.
~ point (5, 0) :: Both touch (5, 0). x² + 25 never does.
```

# Factor
Common factor out first. Then a² − b².

## Run it backward

Factoring undoes expanding. a² − b² = (a + b)(a − b).

```example
Factor 3x² − 12.
1. 3(x² − 4) :: Pull out the common 3.
2. 3(x² − 2²) :: 4 is 2 squared.
3. 3(x + 2)(x − 2) :: Difference of squares.
```

## Factor it yourself

```quiz
Which expression is equivalent to 2x² − 18?
- 2(x − 3)² :: That expands to 2x² − 12x + 18.
- 2(x + 9)(x − 9) :: Use √9 = 3, not 9.
* 2(x + 3)(x − 3)
> 2x² − 18 = 2(x² − 9), and x² − 9 = (x + 3)(x − 3).
~ zoom -6 6 -20 10
~ type y=2x^{2}-18 :: Graph the question.
~ type y=2(x+3)(x-3) :: Same curve: equivalent.
~ point (3, 0) :: Zero at x = 3 means a factor (x − 3).
```

# Add fractions
Common denominator first, then add the tops.

## One common denominator

Multiply each top by the other fraction's denominator.

```example
Write 1/x + 2/(x + 1) as one fraction.
1. Denominator: x(x + 1) :: Multiply the two denominators.
2. Tops: 1(x + 1) + 2(x) :: Each top times the other denominator.
3. (3x + 1)/(x(x + 1)) :: Add the tops: x + 1 + 2x.
```

## Add them yourself

```quiz
Which expression is equivalent to 2/(x + 1) + 1/(x + 3)?
* (3x + 7)/((x + 1)(x + 3))
- 3/((x + 1)(x + 3)) :: The tops change too: 2(x + 3) and 1(x + 1).
- 3/(2x + 4) :: You added tops and bottoms. Get a common denominator.
> 2(x + 3) + 1(x + 1) = 3x + 7, over (x + 1)(x + 3).
> Check with x = 2: 2/3 + 1/5 = 13/15, and 13/(3 · 5) = 13/15.
~ zoom -6 4 -6 6
~ type y=\frac{2}{x+1}+\frac{1}{x+3} :: Graph the question.
~ type y=\frac{3x+7}{(x+1)(x+3)} :: Same curves: equivalent.
~ point (1, 1.25) :: Both pass through (1, 1.25).
```

# Match coefficients
True for all x? Match each power.

## Expand, then match

Expand one side. Match the x² parts, the x parts and the numbers.

```example
(x + 2)(x + k) = x² + bx + 10 for all x. Find b.
1. x² + kx + 2x + 2k :: Expand the left side.
2. 2k = 10, so k = 5 :: Match the numbers.
3. b = k + 2 = 7 :: Match the x parts: kx + 2x = bx.
```

## Find the constant

```quiz
(2x + 3)(x + k) = 2x² + bx + 15 is true for all x, where k and b are constants. What is b?
- 5 :: That's k. The question asks for b.
- 10 :: You dropped 3x. The x parts are 2kx + 3x.
* 13
> Numbers: 3k = 15, so k = 5. x parts: 2kx + 3x = 13x, so b = 13.
~ zoom -8 4 -10 40
~ type y=(2x+3)(x+5) :: Numbers: 3k = 15, so k = 5.
~ slider b = 1
~ type y=2x^{2}+bx+15 :: The right side, with a slider for b.
~ point (0, 15) :: Both cross at 15. Now fit b.
~ slider b = 1 .. 13 :: Drag b until the curves overlap: b = 13.
```

# Trap: the minus sign
A minus flips every sign inside.

## Flip every sign

A minus before parentheses flips **every** sign inside, not just the first.

```example
Simplify (5x + 1) − (2x − 3).
1. 5x + 1 − 2x + 3 :: Flip both: 2x → −2x, −3 → +3.
2. 3x + 4 :: Combine like terms.
```

## Spot the trap

```quiz
Which expression is equivalent to (3x² + 2x) − (x² − 4x + 5)?
- 2x² − 2x + 5 :: Trap: only x² got the minus. Flip −4x and +5 too.
* 2x² + 6x − 5
- 2x² + 6x + 5 :: The +5 flips too: it becomes −5.
> 3x² + 2x − x² + 4x − 5 = 2x² + 6x − 5.
~ zoom -6 4 -12 10
~ type y=(3x^{2}+2x)-(x^{2}-4x+5) :: Type it as written.
~ type y=2x^{2}+6x-5 :: Same curve: equivalent.
~ point (0, -5) :: Both cross the y-axis at −5, not +5.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Flip every sign in the second parentheses, then combine like terms.

```check
m-0197
```

## Your turn: medium

Common denominator first. Then subtract the whole second top.

```check
m-0107
```

## Your turn: hard

Expand the left side, then match each power of x.

```check
m-0042
```
