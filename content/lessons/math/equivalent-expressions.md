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

```more
An **expression** has numbers and letters but no equals sign. **Like terms** have the same letter part: 2x and 3x are like terms, but 2x and 3x² are not. Add only like terms: 2x + 3x = 5x.
```

## Squared? Write it twice

```quiz
Which expression is equivalent to (x − 5)²?
- x² + 25 :: You squared each term. The middle −10x is missing.
* x² − 10x + 25
- x² − 25 :: That is (x − 5)(x + 5), not a square.
> (x − 5)(x − 5) = x² − 5x − 5x + 25 = x² − 10x + 25.
~ zoom -2 12 -5 30
~ type y=(x-5)^{2} :: Graph the question.
~ type y=x^{2}-10x+25 :: Graph a choice. One curve? Equivalent.
~ point (5, 0) :: Both touch (5, 0). x² + 25 never does.
```

## Minus before parentheses

```quiz
Which expression is equivalent to (3x² + 2x) − (x² − 4x + 5)?
- 2x² − 2x + 5 :: Trap: only x² got the minus. Flip −4x and +5 too.
* 2x² + 6x − 5
- 2x² + 6x + 5 :: The +5 flips too: it becomes −5.
> A minus flips every sign inside: 3x² + 2x − x² + 4x − 5 = 2x² + 6x − 5.
~ zoom -6 4 -12 10
~ type y=(3x^{2}+2x)-(x^{2}-4x+5) :: Type it as written.
~ type y=2x^{2}+6x-5 :: Same curve: equivalent.
~ point (0, -5) :: Both cross the y-axis at −5, not +5.
```

# Factor
Common factor out first. Then a² − b².

## Run it backward

Factoring undoes expanding. Pull out the common factor. Then a² − b² = (a + b)(a − b).

```visual
equivalent-expressions--squares
```

```example
Factor 3x² − 12.
1. 3(x² − 4) :: Pull out the common 3.
2. 3(x² − 2²) :: 4 is 2 squared.
3. 3(x + 2)(x − 2) :: Difference of squares.
```

```more
To **factor** means to write an expression as a product. A common factor can be a power: 49p^19 − 121p^17 = p^17(49p² − 121) = p^17(7p + 11)(7p − 11). Subtract the exponents (19 − 17 = 2) to see what is left. A **difference of squares** is one square minus another: x² − 9 = x² − 3².
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

# Factor trinomials
Two numbers multiply to a × c and add to b.

## Build the rectangle

To factor x² + bx + c, find two numbers that multiply to c and add to b. With ax² + bx + c, use a × c.

```visual
equivalent-expressions--tiles
```

```example
Factor x² + 7x + 12.
1. Pairs that multiply to 12 :: 1 and 12, 2 and 6, 3 and 4.
2. 3 + 4 = 7 :: Pick the pair that adds to 7.
3. (x + 3)(x + 4) :: Check: 3x + 4x = 7x.
```

```more
A **trinomial** has three terms. If x² has a number in front, multiply a × c and find two numbers with that product that add to b. For 2x² + 7x + 3: a × c = 6, and 1 and 6 add to 7. Split the middle: 2x² + x + 6x + 3 = x(2x + 1) + 3(2x + 1) = (2x + 1)(x + 3). If c is negative, the two numbers have opposite signs.
```

## Factor the trinomial

```quiz
Which expression is equivalent to x² − 2x − 15?
- (x + 5)(x − 3) :: That expands to x² + 2x − 15. Check the middle term.
- (x − 5)(x − 3) :: That gives +15, not −15.
* (x − 5)(x + 3)
> −5 × 3 = −15 and −5 + 3 = −2. So (x − 5)(x + 3).
~ zoom -6 8 -20 10
~ type y=x^{2}-2x-15 :: Graph the question.
~ type y=(x-5)(x+3) :: Same curve: equivalent.
~ point (5, 0) :: It crosses at x = 5 and x = −3.
```

## When x² has a number

```quiz
Which expression is equivalent to 2x² + 7x + 3?
- (2x + 3)(x + 1) :: That expands to 2x² + 5x + 3. Check the middle term.
- (2x − 1)(x − 3) :: b and c are positive, so both numbers are positive.
* (2x + 1)(x + 3)
> a × c = 6, and 1 + 6 = 7. 2x² + x + 6x + 3 = (2x + 1)(x + 3).
~ zoom -5 2 -4 10
~ type y=2x^{2}+7x+3 :: Graph the question.
~ type y=(2x+1)(x+3) :: Same curve: equivalent.
~ point (-3, 0) :: It crosses at x = −3 and x = −1/2.
```

# Exponents and roots
Same base: add. Fraction exponent: root and power.

## Exponent rules

Same base, multiply: add the exponents. Power of a power: multiply them. A fraction exponent means a root.

```visual
equivalent-expressions--exponents
```

```example
Simplify (x^(1/3))^6 · x^4.
1. x^(6/3) · x^4 :: Power of a power: 1/3 × 6.
2. x² · x^4 :: 6/3 = 2.
3. x^6 :: Same base: add 2 + 4.
```

```more
x^(m/n) means the n-th root of x, raised to the power m. So x^(1/2) = √x and x^(1/3) is the cube root of x. The **bottom** number of the fraction is the root. The **top** number is the power. Example: x^(3/2) = (√x)³ = √(x³).
```

## Evaluate a root power

```quiz
What is the value of 16^(3/4)?
answer: 8
- 12 :: That is 16 × 3/4. The fraction is an exponent.
- 2 :: That is only the 4th root. Raise it to the 3rd power.
> The bottom 4 is a 4th root: 16^(1/4) = 2. The top 3 is a power: 2³ = 8.
```

## Powers of a product

```quiz
Which expression is equivalent to (4x^(1/2))²?
- 8x :: You doubled the 4. Square it: 4² = 16.
- 4x :: You forgot to square the 4.
* 16x
> (4x^(1/2))² = 4² · x^((1/2)·2) = 16x.
```

# Trap: subtract fractions
Common denominator first. A minus flips the whole top.

## One common denominator

Multiply each top by the other denominator. A minus flips **every** sign in its top.

```example
Write 5/(x + 1) − 2/(x + 3) as one fraction.
1. 5(x + 3) − 2(x + 1) :: Each top times the other denominator.
2. 5x + 15 − 2x − 2 :: The minus flips −2(x + 1): −2x − 2.
3. (3x + 13)/((x + 1)(x + 3)) :: Combine like terms.
```

```more
To add or subtract fractions, they need the same bottom. The **common denominator** is a bottom that both fractions can have: here (x + 1)(x + 3). Multiply the top and bottom of each fraction by what is missing. For a plus, the tops add. For a minus, the second top is subtracted as a whole: put it in parentheses.
```

## Subtract it yourself

```quiz
Which expression is equivalent to 4/(x + 1) − 3/(x − 2)?
* (x − 11)/((x + 1)(x − 2))
- (x − 5)/((x + 1)(x − 2)) :: Trap: you flipped only the first sign of 3(x + 1).
- 1/((x + 1)(x − 2)) :: You subtracted the tops only. Use a common denominator.
> 4(x − 2) − 3(x + 1) = 4x − 8 − 3x − 3 = x − 11.
~ zoom -6 6 -8 8
~ type y=\frac{4}{x+1}-\frac{3}{x-2} :: Graph the question.
~ type y=\frac{x-11}{(x+1)(x-2)} :: Same curves: equivalent.
~ point (0, 5.5) :: Both pass through (0, 5.5).
```

# Rewrite a formula
Get the letter alone. Same moves as an equation.

## In terms of

"Solve for W" means get W alone. Use the same moves as in an equation.

```example
P = 2L + 2W. Write W in terms of P and L.
1. P − 2L = 2W :: Subtract 2L from both sides.
2. W = (P − 2L)/2 :: Divide the whole side by 2.
```

```more
**In terms of P and L** means the answer can contain P and L, but not W. Treat the other letters like numbers. When you divide, divide the whole side: (P − 2L) ÷ 2, not just P ÷ 2.
```

## Solve for C

```quiz
F = (9/5)C + 32. Which equation gives C in terms of F?
- C = (5/9)F − 32 :: Subtract 32 first. Then multiply the whole F − 32.
- C = (9/5)(F − 32) :: To undo × 9/5, multiply by 5/9.
* C = (5/9)(F − 32)
> F − 32 = (9/5)C. Multiply both sides by 5/9: C = (5/9)(F − 32).
```

## Find the missing value

```quiz
A = (1/2)bh gives the area of a triangle with base b and height h. If A = 24 and b = 6, what is the value of h?
answer: 8
- 4 :: That is 24 ÷ 6. Remember the 1/2.
- 48 :: That is 2A. Divide it by b = 6 too.
> 24 = (1/2)(6)h = 3h, so h = 8.
```

# Match coefficients
True for all x? Match each power.

## Expand, then match

True for all x? Match x² with x², x with x, number with number.

```example
(x + 2)(x + k) = x² + bx + 10 for all x. Find b.
1. x² + kx + 2x + 2k :: Expand the left side.
2. 2k = 10, so k = 5 :: Match the numbers.
3. b = k + 2 = 7 :: Match the x parts: kx + 2x = bx.
```

```more
**For all x** means the two sides are the same expression written two ways, so each power of x must have the same coefficient on both sides. The x² parts match, the x parts match, and the plain numbers match. Match the plain numbers first: they usually give a constant right away.
```

## Find the constant

```quiz
(2x + 3)(x + k) = 2x² + bx + 15
In the given equation, k and b are constants. If the equation is true for all values of x, what is the value of b?
answer: 13
- 5 :: That is k. The question asks for b.
- 10 :: You dropped 3x. The x parts are 2kx + 3x.
> Numbers: 3k = 15, so k = 5. x parts: 2kx + 3x = 13x, so b = 13.
~ zoom -8 4 -10 40
~ type y=(2x+3)(x+5) :: Numbers: 3k = 15, so k = 5.
~ slider b = 1
~ type y=2x^{2}+bx+15 :: The right side, with a slider for b.
~ point (0, 15) :: Both cross at 15. Now fit b.
~ slider b = 1 .. 13 :: Drag b until the curves overlap: b = 13.
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
