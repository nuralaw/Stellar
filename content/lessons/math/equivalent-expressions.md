---
title: Equivalent Expressions
skill: equivalent-expressions
domain: advanced-math
section: math
summary: Expand, factor, simplify powers and fractions, and rewrite formulas.
---

# Expand and combine
Multiply every term by every term, then combine.

```visual
equivalent-expressions
```

## Key ideas
**Equivalent** expressions look different but give the same value for every \(x\). To expand a product, multiply each term of the first bracket by each term of the second (some books call this FOIL):
\[(a + b)(c + d) = ac + ad + bc + bd\]
Then add **like terms**: terms with the same letters and powers. \(2x + 3x = 5x\), but \(2x\) and \(2x^2\) are not like terms.

Two classic traps:
- A minus in front of a bracket changes **every** sign inside it: \(-(x^2 - 4x + 5) = -x^2 + 4x - 5\).
- A square means the bracket written twice, so the middle term appears: \((a + b)^2 = a^2 + 2ab + b^2\), and \((a - b)^2 = a^2 - 2ab + b^2\). It is never just \(a^2 + b^2\).

```example
Expand and simplify \((x - 4)^2 - (x^2 - 3x)\).
1. \((x - 4)(x - 4) = x^2 - 8x + 16\) :: Write the square twice.
2. \(-(x^2 - 3x) = -x^2 + 3x\) :: The minus flips both signs.
3. \(x^2 - 8x + 16 - x^2 + 3x = -5x + 16\) :: Combine like terms.
```

```theory
An **expression** is a mix of numbers and letters with no equals sign. Two expressions are equivalent when they have the same value for every number you put in. The SAT asks "Which expression is equivalent to...?" and wants the same expression in another form.

Expanding relies on the **distributive property**: \(a(b + c) = ab + ac\). With two brackets you use it twice, which gives four products. With a trinomial times a binomial you get six products, so be systematic and tick each one off.

Why is \((a + b)^2\) not \(a^2 + b^2\)? Draw a square with side \(a + b\): it holds a big square \(a^2\), a small square \(b^2\), and two rectangles \(ab\). The rectangles are the missing middle term. In contrast \((a + b)(a - b) = a^2 - b^2\): the two middle terms \(+ab\) and \(-ab\) cancel.

When several brackets are added, expand each one separately and then combine, keeping the signs in front of each bracket.

A safety check: put the same easy number, like \(x = 2\), into the question and into your answer. If the values differ, they are not equivalent. If they agree, try one more number, such as \(x = 3\), because two different expressions can agree at a single value.
```

## Easy
```task
bank: m-0197
highlight:
- "(2x^2 - 4)" :: The first bracket stays exactly as it is.
- "- (-3x^2 + 2x - 7)" :: This minus flips all three signs inside the second bracket.
explain:
Subtract the whole second bracket, which means every term in it changes sign:

\[(2x^2 - 4) - (-3x^2 + 2x - 7) = 2x^2 - 4 + 3x^2 - 2x + 7\]

Now combine like terms. The \(x^2\) terms: \(2x^2 + 3x^2 = 5x^2\). The \(x\) term: \(-2x\). The numbers: \(-4 + 7 = 3\).

The result is \(5x^2 - 2x + 3\), choice A. Check with \(x = 1\): the original is \((2 - 4) - (-3 + 2 - 7) = -2 - (-8) = 6\), and \(5 - 2 + 3 = 6\). They agree.

Choice D comes from forgetting to flip the signs of the second bracket, so it keeps \(-3x^2\) and \(+2x\) as they were.
```

## Medium
```task
bank: m-0040
highlight:
- "(2x + 5)^2" :: A square: write the bracket twice. The middle term is \(20x\).
- "- (x - 2)" :: The minus flips both signs: it gives \(-x + 2\).
- "2(x + 3)" :: Distribute the 2 over both terms: \(2x + 6\).
explain:
Expand each part on its own.

- \((2x + 5)^2 = (2x + 5)(2x + 5) = 4x^2 + 20x + 25\)
- \(-(x - 2) = -x + 2\)
- \(2(x + 3) = 2x + 6\)

Add them and combine like terms.

\(x^2\) terms: \(4x^2\). \(x\) terms: \(20x - x + 2x = 21x\). Numbers: \(25 + 2 + 6 = 33\).

The expression is \(4x^2 + 21x + 33\), choice A.

Two slips are common here: dropping the middle term \(20x\) of the square, and forgetting that subtracting \(x - 2\) adds 2. Choice B makes the second slip, because its constant is 29 instead of 33.
```

## Hard
```task
bank: m-0464
highlight:
- "-14(5x - 2)^2" :: Square the bracket first, then multiply by \(-14\). Mind the sign.
- "6(5x - 3)^2" :: Same again: square, then multiply by 6.
- "(a/6)x^2 + (b/6)x + c/6" :: Every coefficient is divided by 6, so multiply your result by 6.
explain:
Expand the squares.

\((5x - 2)^2 = 25x^2 - 20x + 4\) and \((5x - 3)^2 = 25x^2 - 30x + 9\).

Multiply by the outside numbers:

\(-14(25x^2 - 20x + 4) = -350x^2 + 280x - 56\)

\(6(25x^2 - 30x + 9) = 150x^2 - 180x + 54\)

Add: \(-200x^2 + 100x - 2\).

The target form divides every coefficient by 6, so \(a = 6 \cdot (-200) = -1200\), \(b = 6 \cdot 100 = 600\) and \(c = 6 \cdot (-2) = -12\). Then \(a + b + c = -612\).

Check the squares with \(x = 1\): \((5 - 2)^2 = 9 = 25 - 20 + 4\) and \((5 - 3)^2 = 4 = 25 - 30 + 9\).

Shortcut: put \(x = 1\) into the target form. It gives \(\frac{a + b + c}{6}\). At \(x = 1\) the original gives \(-14(9) + 6(4) = -102\), so \(a + b + c = 6 \cdot (-102) = -612\). The answer is A.
```

# Common factors and squares
Pull out what is shared. Spot the patterns.

```visual
equivalent-expressions--squares
```

## Key ideas
Factoring runs expanding backward: it writes an expression as a product. **Step 1 is always the greatest common factor**: the biggest number and the lowest power of each letter that every term shares.
\[ax + ay = a(x + y)\]
Then look for a pattern:
\[a^2 - b^2 = (a + b)(a - b)\]
\[a^2 + 2ab + b^2 = (a + b)^2 \qquad a^2 - 2ab + b^2 = (a - b)^2\]
Count the terms to choose the pattern. Two terms with a minus between two squares point to \(a^2 - b^2\). Three terms, with the first and last both squares, point to a perfect square. Otherwise try the trinomial method of the next part.

Traps: a **sum** of squares, \(a^2 + b^2\), does not factor. And keep going: \(x^4 - 16 = (x^2 + 4)(x^2 - 4) = (x^2 + 4)(x + 2)(x - 2)\), because \(x^2 - 4\) is still a difference of squares.

```example
Factor \(18x^3 - 8x\) completely.
1. \(2x(9x^2 - 4)\) :: Pull out the common factor \(2x\).
2. \(2x\left((3x)^2 - 2^2\right)\) :: \(9x^2\) and 4 are both squares.
3. \(2x(3x + 2)(3x - 2)\) :: Difference of squares.
```

```theory
A **factor** is something you multiply to build an expression: 3 and \(x + 2\) are factors of \(3x + 6\). A **term** is something you add. Do not mix them up: you can cancel or pull out factors, never terms.

The **greatest common factor** (GCF) of \(5x^2\) and \(50xy^2\) is \(5x\): the largest number dividing both (5) and the smallest power of each shared letter (\(x\)). The GCF can also be a power, as in \(49p^{19} - 121p^{17} = p^{17}(49p^2 - 121) = p^{17}(7p + 11)(7p - 11)\). Subtract the exponents to see what is left inside.

Why does \(a^2 - b^2 = (a + b)(a - b)\) work? Expand the right side: \(a^2 - ab + ab - b^2\). The middle terms cancel. A **perfect square trinomial** is the other direction: the first and last terms are squares and the middle term is twice the product of their roots, so \(4a^2 + 20ab + 25b^2 = (2a + 5b)^2\) because \(2 \cdot 2a \cdot 5b = 20ab\).

A common SAT form hides a shared bracket: \(y^2(x - 9) - 36(x - 9)^3\). Treat \((x - 9)\) as one block and pull it out: \((x - 9)\left[y^2 - 36(x - 9)^2\right]\). The inside is a difference of squares.

"Which expression is a factor of...?" means one of the pieces of the fully factored form. Check by multiplying back.
```

## Easy
```task
bank: m-0357
highlight:
- "5x^2" :: This term has a 5 and at least one \(x\).
- "50xy^2" :: This term also has a 5 and an \(x\), so the shared factor is \(5x\).
explain:
Find what both terms share. \(5x^2\) and \(50xy^2\) both contain a 5 and an \(x\), so the greatest common factor is \(5x\).

Divide each term by it:

- \(5x^2 \div 5x = x\)
- \(50xy^2 \div 5x = 10y^2\)

So \(5x^2 - 50xy^2 = 5x(x - 10y^2)\), choice A.

Check by multiplying back: \(5x \cdot x = 5x^2\) and \(5x \cdot 10y^2 = 50xy^2\). Nothing is left to share inside the bracket, since \(x - 10y^2\) has no common factor, so the factoring is complete.

Choice B forgets that \(50 \div 5 = 10\).
```

## Medium
```task
bank: m-0492
highlight:
- "256w^2" :: \(256 = 16^2\), so this is \((16w)^2\).
- "- 676" :: \(676 = 26^2\). A minus between two squares is a difference of squares.
explain:
Both terms are perfect squares: \(256w^2 = (16w)^2\) and \(676 = 26^2\).

A minus between two squares factors as \(a^2 - b^2 = (a + b)(a - b)\), here with \(a = 16w\) and \(b = 26\):

\[256w^2 - 676 = (16w - 26)(16w + 26)\]

That is choice D. Choice B, \((8w - 13)(8w + 13)\), expands to \(64w^2 - 169\), which is only one quarter of the expression. It is the same shape with a common factor 4 pulled out and then left behind.

You could also pull out 4 first: \(4(64w^2 - 169) = 4(8w - 13)(8w + 13)\). Both routes are right, but going straight to squares is shorter.
```

## Hard
```task
bank: m-15938
highlight:
- "NOT a factor" :: Three choices are factors. Find the one that is not.
- "5,670x^4 − 1,120" :: Both numbers are multiples of 70. Pull 70 out first.
explain:
Pull out the common factor: \(5{,}670 = 70 \cdot 81\) and \(1{,}120 = 70 \cdot 16\), so

\[5{,}670x^4 - 1{,}120 = 70(81x^4 - 16)\]

Now \(81x^4 = (9x^2)^2\) and \(16 = 4^2\), a difference of squares:

\[70(9x^2 + 4)(9x^2 - 4)\]

And \(9x^2 - 4 = (3x)^2 - 2^2 = (3x + 2)(3x - 2)\). The complete factorization is

\[70(9x^2 + 4)(3x + 2)(3x - 2)\]

So 70, \(9x^2 + 4\) and \(3x + 2\) are factors. \(3x^2 - 2\) never appears, so the answer is B.

Check the numbers: \(70 \cdot 81 = 5{,}670\) and \(70 \cdot 16 = 1{,}120\). Choice D, 70, is a factor because we pulled it out first. Always pull out the number before looking for squares.
```

# Factor trinomials
Find two numbers: product \(ac\), sum \(b\).

```visual
equivalent-expressions--tiles
```

## Key ideas
For \(x^2 + bx + c\), find two numbers that **multiply to \(c\)** and **add to \(b\)**:
\[x^2 + bx + c = (x + p)(x + q) \quad\text{where } pq = c \text{ and } p + q = b\]
When \(x^2\) has a number in front, \(ax^2 + bx + c\), find two numbers that **multiply to \(a \cdot c\)** and **add to \(b\)**. Split the middle term with them, then group.

**The sign rule uses the product \(a \cdot c\), not \(c\) alone.** If \(a \cdot c > 0\), the two numbers have the same sign (the sign of \(b\)). If \(a \cdot c < 0\), they have opposite signs, and the one with the bigger absolute value gets the sign of \(b\). For \(-2x^2 + 7x - 3\), \(c\) is negative but \(a \cdot c = 6\) is positive.

```example
Factor \(6x^2 + 11x - 10\).
1. \(a \cdot c = 6 \cdot (-10) = -60\) :: Need product \(-60\), sum 11.
2. \(15\) and \(-4\) :: Opposite signs. The bigger one is positive.
3. \(6x^2 + 15x - 4x - 10\) :: Split the middle term.
4. \(3x(2x + 5) - 2(2x + 5) = (3x - 2)(2x + 5)\) :: Group, pull out \((2x + 5)\).
```

```theory
A **trinomial** has three terms. If a pair of numbers with the right product and sum does not exist, the trinomial does not factor over the integers, and you use the quadratic formula instead.

Why does the \(a \cdot c\) method work? Expand \((px + r)(qx + s) = pq\,x^2 + (ps + rq)x + rs\). The outer and inner products \(ps\) and \(rq\) add to \(b\), and they multiply to \(pq \cdot rs = a \cdot c\). So the two numbers you search for are exactly those two products, and you split \(bx\) into them.

Speed trick: write the pairs of factors of \(|a \cdot c|\) and test which pair gives the right sum or difference. For \(3x^2 + 20x - 63\), \(a \cdot c = -189\), and \(27 - 7 = 20\), so the pair is 27 and \(-7\).

Hidden quadratics: \(x^4 - x^2 - 6\) looks hard but is \(u^2 - u - 6\) with \(u = x^2\), which gives \((x^2 - 3)(x^2 + 2)\). Letters can also sit in the middle: \(2x^2 + (18r + 5)x + 45r\) opens into \(2x^2 + 18rx + 5x + 45r\), and grouping gives \((2x + 5)(x + 9r)\).

Another shortcut for "is this a factor?": if \(x - r\) is a factor, then putting \(x = r\) into the expression gives 0. If a factor is \(3x - 7\), test \(x = \frac73\).

Always check by expanding.
```

## Easy
```task
Which expression is equivalent to \(x^2 + 3x - 28\)?
* \((x + 7)(x - 4)\)
- \((x - 7)(x + 4)\) :: The signs are swapped. This gives \(-3x\) in the middle.
- \((x + 7)(x + 4)\) :: That multiplies to \(+28\), but the last term is \(-28\).
- \((x + 14)(x - 2)\) :: These multiply to \(-28\) but add to 12, not 3.
highlight:
- "Which expression is equivalent to" :: Equivalent here means: the same expression written as a product.
- "\(x^2 + 3x - 28\)" :: Find two numbers with product \(-28\) and sum \(3\).
explain:
Look for two numbers that multiply to \(-28\) and add to \(+3\). The product is negative, so the numbers have opposite signs.

The pairs with product \(-28\) are \(1, -28\), \(-1, 28\), \(2, -14\), \(-2, 14\), \(4, -7\) and \(-4, 7\). Only \(7 + (-4) = 3\).

So \(x^2 + 3x - 28 = (x + 7)(x - 4)\).

Check: \((x + 7)(x - 4) = x^2 - 4x + 7x - 28 = x^2 + 3x - 28\). The answer is the first choice.

The other choices fail the same test. For example \((x - 7)(x + 4) = x^2 - 3x - 28\), so its middle sign is wrong.
```

## Medium
```task
bank: m-0046
highlight:
- "3x^2 + 20x - 63" :: \(a \cdot c = -189\). Find two numbers with product \(-189\) and sum 20.
- "I. x - 9" :: Compare with your factors. You should get \(x + 9\), not \(x - 9\).
- "II. 3x - 7" :: Does this match one of your two factors?
explain:
Here \(a = 3\) and \(c = -63\), so \(a \cdot c = -189\). We need two numbers with product \(-189\) and sum 20. Since the product is negative, they have opposite signs, and the bigger one is positive: 27 and \(-7\).

Split the middle term and group:

\[3x^2 + 27x - 7x - 63 = 3x(x + 9) - 7(x + 9) = (3x - 7)(x + 9)\]

So the factors are \(3x - 7\) and \(x + 9\). Statement II is true. Statement I says \(x - 9\), but the factor is \(x + 9\), so I is false.

The answer is B, II only.
```

## Hard
```task
bank: m-15737
highlight:
- "2x^2 + (18r + 5)x + 45r" :: Open the bracket: it holds two different \(x\)-terms, \(18rx\) and \(5x\).
- "where r is a nonzero constant" :: Treat \(r\) like a number while you group.
- "x + 9r" :: Check whether this appears after grouping.
explain:
Open the bracket so the expression has four terms:

\[2x^2 + (18r + 5)x + 45r = 2x^2 + 18rx + 5x + 45r\]

Group the first two terms and the last two terms:

\[2x(x + 9r) + 5(x + 9r)\]

Both groups contain \((x + 9r)\), so pull it out:

\[(2x + 5)(x + 9r)\]

Both \(x + 9r\) (statement I) and \(2x + 5\) (statement II) are factors.

Check II another way: if \(2x + 5\) is a factor, then \(x = -\frac52\) makes the expression 0. Substituting gives \(2 \cdot \frac{25}{4} - \frac52(18r + 5) + 45r = 12.5 - 45r - 12.5 + 45r = 0\). The answer is C.
```

# Exponent rules
Same base: add, subtract or multiply the exponents.

```visual
equivalent-expressions--powers
```

## Key ideas
Exponent rules work only when the **bases are the same** and the operation is multiplication or division:
\[x^a \cdot x^b = x^{a+b} \qquad \frac{x^a}{x^b} = x^{a-b} \qquad (x^a)^b = x^{ab} \qquad (xy)^a = x^a y^a\]
Zero, negative and fractional exponents:
\[x^0 = 1 \qquad x^{-n} = \frac{1}{x^n} \qquad x^{m/n} = \left(\sqrt[n]{x}\right)^m = \sqrt[n]{x^m}\]
In \(x^{m/n}\) the **bottom** is the root and the **top** is the power: \(16^{3/4}\) is the 4th root of 16 (that is 2), cubed: 8.

When numbers are powers of each other, rewrite them with one base first: \(9 = 3^2\) and \(27 = 3^3\).

Traps: \(x^2 + x^3\) is not \(x^5\), and \((x + y)^2\) is not \(x^2 + y^2\). A negative exponent flips the base to the other side of the fraction. It does not make the number negative.

```example
Simplify \(\dfrac{(x^2y^{-3})^2}{x^{-1}y}\). Use positive exponents.
1. \((x^2y^{-3})^2 = x^4y^{-6}\) :: Power of a power: multiply exponents.
2. \(x^{4-(-1)}\,y^{-6-1} = x^5y^{-7}\) :: Divide: subtract exponents.
3. \(\dfrac{x^5}{y^7}\) :: A negative exponent moves down.
```

```theory
An **exponent** says how many times a base is multiplied: \(x^3 = x \cdot x \cdot x\). The rules follow from counting. \(x^2 \cdot x^3\) is five \(x\)'s multiplied, so \(x^5\). For division, \(\frac{x^5}{x^2}\) cancels two \(x\)'s and leaves \(x^3\).

Why \(x^0 = 1\)? Because \(\frac{x^3}{x^3} = 1\) and, by the quotient rule, it equals \(x^{3-3} = x^0\). Why \(x^{-n} = \frac{1}{x^n}\)? \(\frac{x^2}{x^5} = x^{-3}\), and cancelling by hand leaves \(\frac{1}{x^3}\).

A fractional exponent is a root. \(x^{1/2} = \sqrt{x}\), and \(x^{1/3}\) is the cube root. The root of a product splits: \(\sqrt{16x^4y^8} = 4x^2y^4\) (halve each exponent). The root of a **sum** does not split: \(\sqrt{x^2 + 9} \neq x + 3\).

Same-base trick for equations and comparisons: rewrite numbers as powers of a common base, such as \(9 = 3^2\), \(27 = 3^3\), \(8 = 2^3\). Also split sums in exponents: \(4^{x+1} = 4 \cdot 4^x\), and \(a^{2x} = (a^2)^x\).

SAT forms: "which expression is equivalent to \(\sqrt[7]{x^9y^9}\)?" has answer \((xy)^{9/7}\): the index 7 goes under the exponent. Positivity conditions such as \(x > 0\) make the root rules safe.
```

## Easy
```task
bank: m-0004
highlight:
- "(m^4q^4z^(-1))" :: The first factor. A negative exponent adds like any other.
- "(mq^5z^3)" :: The second factor, with the same bases. Add the exponents letter by letter: \(-1 + 3 = 2\).
explain:
Multiply the two brackets letter by letter. For the same base, **add** the exponents.

- \(m\): \(4 + 1 = 5\) (a bare \(m\) is \(m^1\))
- \(q\): \(4 + 5 = 9\)
- \(z\): \(-1 + 3 = 2\)

The product is \(m^5q^9z^2\), choice B.

Choice A multiplies the \(q\) exponents instead of adding them. Multiplying exponents is the rule for a power of a power, like \((q^4)^5\), not for a product of powers.
```

## Medium
```task
bank: m-0141
highlight:
- "sqrt(16x^4y^8)" :: A square root halves every exponent: \(4x^2y^4\).
- "/x^3" :: Dividing by \(x^3\) subtracts 3 from the exponent of \(x\).
explain:
First simplify the root. A square root halves each exponent and takes the root of 16:

\[\sqrt{16x^4y^8} = 4x^2y^4\]

Now divide by \(x^3\). Same base, so subtract the exponents: \(x^{2-3} = x^{-1}\).

\[\frac{4x^2y^4}{x^3} = 4x^{-1}y^4\]

The answer is D. Choice C halves the \(y\) exponent a second time.

Check with \(x = 2\), \(y = 1\): the original is \(\frac{\sqrt{256}}{8} = \frac{16}{8} = 2\), and \(4x^{-1}y^4 = \frac42 = 2\). Choosing numbers like these is a fast safety net on the real test.
```

## Hard
```task
bank: m-0211
highlight:
- "(x^(-2)y^(1/2))/(x^(1/3)y^(-1))" :: Divide powers of the same base: subtract the bottom exponent from the top.
- "x > 1 and y > 1" :: Both are positive, so the fractional exponents are safe to use.
explain:
Handle each letter separately and subtract the bottom exponent from the top one.

- \(x\): \(-2 - \frac13 = -\frac{7}{3}\)
- \(y\): \(\frac12 - (-1) = \frac32\)

So the expression is \(\dfrac{y^{3/2}}{x^{7/3}}\).

Now turn the exponents back into roots. \(y^{3/2} = y \cdot y^{1/2} = y\sqrt{y}\). And \(x^{7/3} = x^2 \cdot x^{1/3} = x^2\sqrt[3]{x}\).

A negative exponent puts the letter in the denominator, and a positive one keeps it in the numerator. That is why \(x\) lands at the bottom and \(y\) stays on top.

Together:

\[\frac{y\sqrt{y}}{x^2\sqrt[3]{x}}\]

That is choice D. Choice B comes from adding \(-2\) and \(\frac13\) wrongly.
```

# Fractions with letters
Cancel factors, not terms. A minus flips the whole top.

```visual
equivalent-expressions--fractions
```

## Key ideas
**Simplify:** factor the top and the bottom, then cancel common **factors** (whole brackets or products), never single terms.
\[\frac{6x + 42}{12} = \frac{6(x + 7)}{12} = \frac{x + 7}{2}\]
**Add or subtract:** use a common denominator. Multiply each top by what its bottom is missing, then combine. A minus in front of a fraction flips **every** sign in its top:
\[\frac{A}{B} - \frac{C}{D} = \frac{AD - CB}{BD}\]
When a problem says \(x > 3\), the bottom \(x - 3\) is never zero, so cancelling it is safe.

**Divide:** if the top is bigger than the bottom, rewrite the top using the bottom: \(\frac{4x + 1}{x - 9} = \frac{4(x - 9) + 37}{x - 9} = 4 + \frac{37}{x - 9}\).

```example
Write \(\dfrac{5}{x + 1} - \dfrac{2}{x + 3}\) as one fraction.
1. \(\dfrac{5(x + 3) - 2(x + 1)}{(x + 1)(x + 3)}\) :: Each top times the other bottom.
2. \(5x + 15 - 2x - 2\) :: The minus flips both signs of \(2(x + 1)\).
3. \(\dfrac{3x + 13}{(x + 1)(x + 3)}\) :: Combine like terms.
```

```theory
A **rational expression** is a fraction with letters. It is not defined where its denominator is 0, so \(\frac{1}{x - 3}\) needs \(x \neq 3\). Questions often give a condition such as \(x > 3\) to keep the cancelling safe.

Why can you cancel only factors? Test with numbers: \(\frac{2 + 6}{2 + 4}\) is \(\frac86\), not \(\frac64\) as you would get by "cancelling" the 2's. A factor multiplies the whole top or bottom. A term is only a part of a sum.

Common denominators: factor each denominator first and use each factor once. For \(\frac{4}{x + 2} + \frac{8}{x^2 + 2x}\), note \(x^2 + 2x = x(x + 2)\). The common denominator is \(x(x + 2)\), not the product of both bottoms. Only the first fraction needs a multiplier: \(\frac{4x + 8}{x(x + 2)} = \frac{4(x + 2)}{x(x + 2)} = \frac4x\).

Differences of squares hide in denominators: \(\pi^2 - x^2 = (\pi - x)(\pi + x)\). Spotting them gives the common denominator at once.

Division of polynomials: write the top as (bottom \(\times\) quotient) \(+\) remainder. For \(\frac{x^2 + 5x + 9}{x + 2}\): \(x^2 + 5x + 9 = (x + 2)(x + 3) + 3\), so the result is \(x + 3 + \frac{3}{x + 2}\).

Check any answer with a number, for example \(x = 2\).
```

## Easy
```task
bank: m-0191
highlight:
- "24/(6x + 42)" :: Factor the bottom: \(6x + 42 = 6(x + 7)\).
- "4/(x + b)" :: After cancelling the 6, compare the bottom with \(x + b\).
explain:
Factor the denominator: \(6x + 42 = 6(x + 7)\).

Then cancel the common factor 6 from the top and the bottom:

\[\frac{24}{6(x + 7)} = \frac{4}{x + 7}\]

Compare with \(\frac{4}{x + b}\): \(b = 7\). The answer is A.

Choice D multiplies \(6 \cdot 42\) instead of factoring.

Check with \(x = 1\): \(\frac{24}{6 + 42} = \frac{24}{48} = \frac12\), and \(\frac{4}{1 + 7} = \frac12\). The two expressions agree.

The other choices fail this same test. For example choice B, 10, gives \(\frac{4}{1 + 10} = \frac{4}{11}\), which is not \(\frac12\).
```

## Medium
```task
bank: m-0392
highlight:
- "x^2 - 2x - 5" :: The top has a higher power than the bottom, so divide.
- "/(x - 3)" :: Write the top as (bottom times something) plus a leftover number.
explain:
Divide \(x^2 - 2x - 5\) by \(x - 3\). Look for a quotient that makes \((x - 3)(\text{quotient})\) close to the top.

Try \(x + 1\): \((x - 3)(x + 1) = x^2 - 2x - 3\).

That is 2 more than the top, so the top is that product minus 2:

\[x^2 - 2x - 5 = (x - 3)(x + 1) - 2\]

The leftover \(-2\) keeps the denominator \(x - 3\), so it stays as a fraction. Divide everything by \(x - 3\):

\[\frac{x^2 - 2x - 5}{x - 3} = x + 1 - \frac{2}{x - 3}\]

The answer is D. Check with \(x = 4\): the left side is \(\frac{16 - 8 - 5}{1} = 3\), and the right side is \(5 - 2 = 3\).
```

## Hard
```task
bank: m-12516
highlight:
- "π^2 − x^2" :: A difference of squares: \((\pi - x)(\pi + x)\).
- "20π/(x + π)" :: Its bottom is one of those factors. Multiply top and bottom by the missing one.
- "x > π" :: This keeps \(\pi - x\) from being zero, so cancelling is safe.
explain:
Factor the first denominator: \(\pi^2 - x^2 = (\pi - x)(\pi + x)\). The second denominator \(x + \pi\) is the same as \(\pi + x\), so it is missing the factor \(\pi - x\).

Rewrite the second fraction with the common denominator:

\[\frac{20\pi}{x + \pi} = \frac{20\pi(\pi - x)}{(\pi - x)(\pi + x)} = \frac{20\pi(\pi - x)}{\pi^2 - x^2}\]

Subtract the whole second top:

\[\frac{20\pi^2 - 20\pi(\pi - x)}{\pi^2 - x^2} = \frac{20\pi^2 - 20\pi^2 + 20\pi x}{\pi^2 - x^2} = \frac{20\pi x}{\pi^2 - x^2}\]

The answer is B. Choice C subtracts the tops without rewriting over the common denominator.

Subtract the numerators only after both fractions have the same denominator. Before that, the tops are measured in different "pieces".
```

# Solve for a letter
Same moves as an equation. Whole side each time.

```visual
equivalent-expressions--formula
```

## Key ideas
"Express \(W\) in terms of \(P\) and \(L\)" means: get \(W\) alone on one side. The other letters may stay. Treat them like numbers and undo the operations in reverse order.

Whatever you do, do it to the **whole** side: divide \(P - 2L\) by 2, not just \(P\).
\[P = 2L + 2W \;\Rightarrow\; W = \frac{P - 2L}{2}\]
If the letter is in a denominator, first isolate the fraction, then multiply and divide, or flip both sides once the fraction stands alone.
If the letter appears twice, collect those terms on one side and factor it out.

Trap: the reciprocal of a sum is not the sum of reciprocals. From \(\frac1R = \frac1a + \frac1b\) you get \(R = \frac{ab}{a + b}\), not \(R = a + b\).

```example
\(c = 3 + \dfrac{12}{m}\), where \(m \neq 0\). Write \(m\) in terms of \(c\).
1. \(c - 3 = \dfrac{12}{m}\) :: Isolate the fraction.
2. \(m(c - 3) = 12\) :: Multiply both sides by \(m\).
3. \(m = \dfrac{12}{c - 3}\) :: Divide by \(c - 3\).
```

```theory
A **formula** is an equation that relates several letters, like \(d = rt\) or \(F = \frac95 C + 32\). "In terms of" names the letters your answer may contain. It must not contain the letter you solved for.

The method is the same as for one-variable equations: do the same thing to both sides, one step at a time, and undo operations in the reverse of the usual order. For \(F = \frac95 C + 32\): subtract 32 first, then multiply by \(\frac59\), which gives \(C = \frac59(F - 32)\). The 32 must be removed before the multiplication, and the multiplication applies to the whole bracket.

Two letters in one term: \(\frac{1}{7b} = \frac{11x}{y}\). Cross-multiply to \(y = 77bx\), then divide by \(77b\): \(x = \frac{y}{77b}\).

Letter on both sides: \(ax + b = cx + d\). Move the \(x\)-terms together: \((a - c)x = d - b\), so \(x = \frac{d - b}{a - c}\).

Squares and roots: \(A = \pi r^2\) gives \(r = \sqrt{\frac{A}{\pi}}\). The problem usually says the letters are positive, which tells you to keep only the positive root.

Check your result by choosing numbers for the letters in the original and your answer. They must agree.
```

## Easy
```task
bank: m-0260
highlight:
- "8j = k + 15m" :: \(j\) is multiplied by 8. Divide the whole right side by 8.
- "expresses j in terms of k and m" :: \(j\) must be alone. \(k\) and \(m\) can stay on the other side.
explain:
We want \(j\) alone. Right now \(j\) is multiplied by 8, so divide both sides by 8. Divide the **whole** right side, not just one term:

\[j = \frac{k + 15m}{8}\]

Check with \(k = 2\) and \(m = 2\): then \(8j = 32\), so \(j = 4\), and \(\frac{2 + 30}{8} = 4\).

That is choice D. Choice B divides only \(15m\) by 8 and leaves \(k\) unchanged, which is a different expression. Dividing a sum means dividing every term, or dividing the sum as a whole.
```

## Medium
```task
bank: m-0286
highlight:
- "p = 20 + 16/n" :: \(n\) is in a denominator. Isolate the fraction \(\frac{16}{n}\) first.
- "p > 20" :: Then \(p - 20\) is positive, so dividing by it is safe.
explain:
Start with \(p = 20 + \frac{16}{n}\).

Subtract 20 to isolate the fraction:

\[p - 20 = \frac{16}{n}\]

Multiply both sides by \(n\):

\[n(p - 20) = 16\]

Divide both sides by \(p - 20\). This is allowed because \(p > 20\), so \(p - 20 \neq 0\):

\[n = \frac{16}{p - 20}\]

The answer is D. Choice A gives \(\frac1n\) instead of \(n\).

Check with \(n = 4\): \(p = 20 + \frac{16}{4} = 24\), and \(\frac{16}{24 - 20} = 4\). Ask yourself at the end: is the letter I want alone, and no longer in a denominator?
```

## Hard
```task
bank: m-0503
highlight:
- "12/n - 2/t = -2/w" :: Move the \(t\) fraction away so that \(n\) is the only unknown on the left.
- "n > 0, t > 0, and w > t" :: This means \(w - t\) is positive. You may divide by it.
explain:
Move the fraction with \(t\) to the right:

\[\frac{12}{n} = \frac{2}{t} - \frac{2}{w}\]

Combine the right side over the common denominator \(tw\):

\[\frac{12}{n} = \frac{2w - 2t}{tw} = \frac{2(w - t)}{tw}\]

Flip both sides (take reciprocals of each side as a whole):

\[\frac{n}{12} = \frac{tw}{2(w - t)}\]

Multiply by 12:

\[n = \frac{12tw}{2(w - t)} = \frac{6tw}{w - t}\]

The answer is D. Because \(w > t\), the denominator is not zero.

Check with \(t = 2\) and \(w = 4\): the right side is \(-\frac24 = -\frac12\), and \(n = \frac{6 \cdot 2 \cdot 4}{4 - 2} = 24\). Then \(\frac{12}{24} - \frac22 = \frac12 - 1 = -\frac12\). It works.
```

# Match coefficients
True for all x? Each power must match.

```visual
equivalent-expressions--match
```

## Key ideas
"True for all \(x\)" means both sides are the same expression in two disguises. So the coefficient of each power of \(x\) must be the same on both sides:
\[ax^2 + bx + c = dx^2 + ex + f \text{ for all } x \;\Rightarrow\; a = d,\; b = e,\; c = f\]
Plan: expand, collect like terms, then compare \(x^2\) with \(x^2\), \(x\) with \(x\), number with number.

Start with the piece that has **only one unknown**. Often that is the \(x^2\) or the constant term. Then use what you found in the next piece.

Equal expressions also give equal values, so you may put in \(x = 0\) to get the constant at once, or \(x = 1\) to get the sum of all the coefficients.

```example
\((3x + 4)(x + k) = 3x^2 + bx + 20\) for all \(x\). Find \(b\).
1. \(3x^2 + 3kx + 4x + 4k\) :: Expand the left side.
2. \(4k = 20\), so \(k = 5\) :: Match the plain numbers.
3. \(b = 3k + 4 = 19\) :: Match the \(x\)-terms.
```

```theory
Why must the coefficients match? If two quadratics are equal for every \(x\), subtract one from the other. You get a polynomial that is 0 for every \(x\). A nonzero quadratic has at most two zeros, so it must be 0 everywhere, meaning all its coefficients are 0.

A faster route sometimes: put in a smart number. \(x = 0\) kills every term with \(x\) and gives the constants at once. In \(\frac{29x + 102}{x(x + 51)} = \frac{p}{x} + \frac{w}{x + 51}\), clear the fractions to get \(p(x + 51) + wx = 29x + 102\). With \(x = 0\): \(51p = 102\), so \(p = 2\). Then the \(x\)-terms give \(p + w = 29\).

Constants can sit inside brackets and squares. Expand carefully; the \(x\)-coefficient often collects several pieces, like \(-13p - 64\) in \(3(2x^2 + px + 8) - 16x(p + 4)\).

Division also hides matching: if \(\frac{x^2 + 6x - 7}{x + 7} = ax + d\) for all \(x \neq -7\), factor the top as \((x + 7)(x - 1)\), cancel, and read \(a = 1\) and \(d = -1\).

On the SAT, the signal words are "true for all \(x\)", "equivalent to", "for all values of \(x\)", and "constants". Do not solve for \(x\). Solve for the constants.
```

## Easy
```task
bank: m-0243
highlight:
- "x(2x + 7)" :: Expand it: \(2x^2 + 7x\).
- "2x^2 + ax" :: Both expressions are equal, so the \(x\)-terms match: \(a\) equals 7.
explain:
Expand the product:

\[x(2x + 7) = 2x^2 + 7x\]

The problem says \(2x^2 + ax\) is equivalent to this, so the coefficients of \(x\) must be the same. The \(x^2\) terms already match (both have 2). The \(x\)-terms give \(a = 7\).

The answer is D. Choice A is the coefficient of \(x^2\), not of \(x\).

Another way: put \(x = 1\) into both sides. \(2 + a = 1 \cdot (2 + 7) = 9\), so \(a = 7\) again. Either way you only compare the \(x\)-terms, because the question asks for a constant, not for \(x\).
```

## Medium
```task
bank: m-0182
highlight:
- "3(2x^2 + px + 8) - 16x(p + 4)" :: Expand fully. Every term with \(p\) lands in the \(x\)-coefficient.
- "6x^2 - 155x + 24" :: Match the \(x\)-coefficient. The other two terms already agree.
explain:
Expand the given expression:

\[3(2x^2 + px + 8) = 6x^2 + 3px + 24\]
\[-16x(p + 4) = -16px - 64x\]

Add and collect like terms:

\[6x^2 + (3p - 16p - 64)x + 24 = 6x^2 + (-13p - 64)x + 24\]

This equals \(6x^2 - 155x + 24\) for all \(x\). The \(x^2\) terms and the constants already match, so match the \(x\)-coefficients:

\[-13p - 64 = -155\]

\[-13p = -91, \text{ so } p = 7\]

The answer is B.

Check with \(p = 7\): \(3(2x^2 + 7x + 8) - 16x \cdot 11 = 6x^2 + 21x + 24 - 176x = 6x^2 - 155x + 24\). It matches.

The wrong choices come from sign slips when collecting \(3p - 16p\). Write the \(x\)-coefficient out in full before you set it equal to \(-155\).
```

## Hard
```task
bank: m-0068
highlight:
- "(29x + 102)/(x(x + 51))" :: Its denominator is \(x(x + 51)\). That is what the two small fractions share after combining.
- "p/x + w/(x + 51)" :: Combine them over \(x(x + 51)\). The top becomes \(p(x + 51) + wx\).
- "p and w are constants" :: Match coefficients. Do not solve for \(x\).
explain:
Put the right side over the common denominator \(x(x + 51)\):

\[\frac{p}{x} + \frac{w}{x + 51} = \frac{p(x + 51) + wx}{x(x + 51)}\]

The denominators are equal, so the tops must be equal for all \(x\):

\[p(x + 51) + wx = 29x + 102\]

Put in \(x = 0\) to remove \(w\): \(51p = 102\), so \(p = 2\).

Now match the \(x\)-coefficients. Expanding gives \((p + w)x + 51p\), so \(p + w = 29\). With \(p = 2\), \(w = 27\).

Check: \(2(x + 51) + 27x = 29x + 102\). The answer is 27.

Putting in \(x = 0\) is legal here because the two tops are equal for every \(x\), including 0.
```
