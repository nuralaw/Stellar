---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratics, roots and absolute values, and line-parabola systems.
---

# Factor to zero
Make one side 0. Factor. Set each factor to 0.

```visual
nonlinear-equations--zero-product
```

## Key ideas
A **quadratic equation** has an \(x^2\) term. To solve it by factoring, first move everything to one side so the other side is exactly 0. Then factor, and use the **zero-product property**: if a product equals 0, one of its factors is 0.
\[(x - p)(x - q) = 0 \;\Rightarrow\; x = p \text{ or } x = q\]
The words *solutions*, *roots*, *zeros* and *\(x\)-intercepts* all mean the same thing here: the \(x\)-values that make the expression equal 0.

Two traps. First, the other side **must** be 0. From \((x - 1)(x - 2) = 6\) you cannot say \(x - 1 = 6\). Second, never divide both sides by an expression that contains \(x\). From \(x(x - 3) = 2(x - 3)\), dividing by \(x - 3\) loses the solution \(x = 3\). Move everything over and factor: \((x - 3)(x - 2) = 0\).

```example
Solve \(2x^2 + x = 15\).
1. \(2x^2 + x - 15 = 0\) :: Move 15 to the left side.
2. \((2x - 5)(x + 3) = 0\) :: \(ac = -30\): the numbers 6 and \(-5\).
3. \(x = \dfrac52\) or \(x = -3\) :: Set each factor equal to 0.
```

```theory
Factoring turns one hard equation into two easy ones. The **zero-product property** is the reason: the only way two numbers multiply to 0 is if one of them is 0. That is why the other side has to be 0 first. Products equal to 6, or 15, tell you nothing about the individual factors.

If the quadratic does not factor easily, use the quadratic formula (a later part). On the SAT, equations that factor usually have whole-number or simple-fraction answers. A trinomial like \(5x^2 - 37x - 24\) factors as \((5x + 3)(x - 8)\) using the method of the previous lesson: find two numbers with product \(ac\) and sum \(b\).

More factors give more solutions: \((x - 4)(x + 2)(x - 1) = 0\) has three solutions, 4, \(-2\) and 1. Factors may also hide a letter, as in \(x - 29 = (x - a)(x - 29)\). Move all terms to one side and pull out the shared bracket \((x - 29)\).

Word problems turn into quadratics. "The product of two integers is 546 and one is 11 more than twice the other" becomes \(x(2x + 11) = 546\). Build the equation, move everything to the left, factor, and keep only the answers that make sense (positive integers, for example).

A repeated bracket can be treated as one letter. In \((x + 1)^2 - 5(x + 1) + 6 = 0\), let \(u = x + 1\). Then \(u^2 - 5u + 6 = 0\) gives \(u = 2\) or \(u = 3\), so \(x = 1\) or \(x = 2\).

Always check your solutions by putting them back into the original equation. On the SAT, wrong choices are often the other solution, or a solution with the wrong sign.
```

## Easy
```task
bank: m-0216
highlight:
- "5x^2 - 37x - 24 = 0" :: It already equals 0. Factor the left side with \(ac = -120\).
- "positive solution" :: There are two solutions. Only one is positive.
explain:
The equation already has 0 on the right, so factor the left side. Here \(a \cdot c = 5 \cdot (-24) = -120\). We need two numbers with product \(-120\) and sum \(-37\): they are \(-40\) and \(3\).

\[5x^2 - 40x + 3x - 24 = 5x(x - 8) + 3(x - 8) = (5x + 3)(x - 8)\]

Set each factor equal to 0:

- \(5x + 3 = 0\) gives \(x = -\frac35\)
- \(x - 8 = 0\) gives \(x = 8\)

The positive solution is 8, choice C. Choice A has the right size but the wrong sign: \(\frac35\) is not a solution, \(-\frac35\) is.
```

## Medium
```task
bank: m-0207
highlight:
- "The product of two positive integers is 546" :: Product 546 gives the equation. Use one letter for the second integer.
- "11 greater than twice the second integer" :: The first integer is \(2x + 11\).
- "the smaller of the two integers" :: Compare your two integers at the end. Answer with the smaller.
explain:
Let the second integer be \(x\). Then the first is \(2x + 11\), and their product is 546:

\[x(2x + 11) = 546\]

Move everything to one side:

\[2x^2 + 11x - 546 = 0\]

This factors as \((x - 14)(2x + 39) = 0\). So \(x = 14\) or \(x = -\frac{39}{2}\). The integers are positive, so \(x = 14\).

The first integer is \(2 \cdot 14 + 11 = 39\). Check: \(14 \cdot 39 = 546\).

The question asks for the **smaller** integer, which is 14. That is choice B. Choice C, 39, is the larger one.
```

## Hard
```task
bank: m-0336
highlight:
- "x - 29 = (x - a)(x - 29)" :: \(x - 29\) appears on both sides. Do not divide by it: move everything left and factor.
- "a > 30" :: So \(a\) is not 29. Use this to test statement I.
- "Which of the following are solutions" :: Test each statement in the original equation.
explain:
Move everything to one side and pull out the shared bracket \((x - 29)\):

\[(x - a)(x - 29) - (x - 29) = 0\]
\[(x - 29)\left[(x - a) - 1\right] = 0\]
\[(x - 29)(x - a - 1) = 0\]

So \(x = 29\) or \(x = a + 1\).

- I. \(x = a\): the right side is 0 (because of the factor \(x - a\)), but the left side is \(a - 29\). Since \(a > 30\), that is not 0. Not a solution.
- II. \(x = a + 1\): a solution.
- III. \(x = 29\): a solution.

The answer is C, II and III only. Dividing both sides by \(x - 29\) would have lost the solution 29.
```

# Squares and absolute value
Undo a square with ±. Undo | | with two cases.

```visual
nonlinear-equations--two-cases
```

## Key ideas
First **isolate** the squared bracket, or the absolute value, on one side. Then undo it:
\[(x - h)^2 = k \;\Rightarrow\; x - h = \pm\sqrt{k}\]
\[\vert x - h \vert = k \;\Rightarrow\; x - h = k \text{ or } x - h = -k\]
Both rules need \(k > 0\) to give two solutions. If \(k = 0\), there is exactly one solution (\(x = h\)). If \(k < 0\), there is **no** solution, because a square and an absolute value are never negative.

Isolate first: \(7\vert x - 7\vert = 42\) becomes \(\vert x - 7\vert = 6\), so \(x = 13\) or \(x = 1\).

Trap: on its own, \(\sqrt{9}\) means only 3. The \(\pm\) appears when you *solve* \(x^2 = 9\), because both 3 and \(-3\) square to 9.

```example
Solve \(4(x - 2)^2 = 100\).
1. \((x - 2)^2 = 25\) :: Divide by 4 first.
2. \(x - 2 = 5\) or \(x - 2 = -5\) :: Undo the square: both signs.
3. \(x = 7\) or \(x = -3\) :: Add 2 to each.
```

```theory
**Absolute value** \(\vert a \vert\) is the distance of \(a\) from 0, so it is never negative. \(\vert x - 3 \vert = 5\) says: \(x\) is 5 units away from 3, which gives 8 and \(-2\). That picture also gives a shortcut: the two solutions are the same distance either side of the middle number, so their **sum is twice the middle**. For \(\vert x - 7 \vert = 6\), the sum is \(2 \cdot 7 = 14\). For \((x + 4)^2 = 36\), the solutions are \(-4 \pm 6\) and their sum is \(-8\).

A square can hide inside a bracket with a coefficient. In \(\left(\frac12 x - \frac{33}{2}\right)^2 = 64\), factor out \(\frac12\): the bracket is \(\frac12(x - 33)\), so the equation is \(\frac14(x - 33)^2 = 64\). When the question asks for \((x - 33)^2\) you do not even need \(x\): it is 256.

Equations with powers of the same base work similarly. Rewrite both sides with one base and set the exponents equal: \(4^{3x} = 8^{x + 2}\) becomes \(2^{6x} = 2^{3x + 6}\), so \(6x = 3x + 6\) and \(x = 2\).

SAT wording: "What is the sum of the solutions?", "Which is a possible value of \(x\)?" (only one of the two solutions is listed), "How many solutions?" (zero for an equation like \(\vert 4x - 3 \vert = -9\)).

Remember to isolate first. The 7 in \(7\vert x - 7\vert\) is outside the bars, so you divide by it before you split into two cases.
```

## Easy
```task
bank: m-0520
highlight:
- "(x + 5)^2 = 4" :: A square equals 4, so the bracket is 2 or \(-2\).
- "possible value" :: There are two solutions. Only one is in the list.
explain:
The square of \(x + 5\) equals 4, so \(x + 5\) is either 2 or \(-2\). Both numbers square to 4.

- \(x + 5 = 2\) gives \(x = -3\)
- \(x + 5 = -2\) gives \(x = -7\)

The equation has two solutions, \(-3\) and \(-7\). The question asks for a **possible** value, and only \(-3\) appears among the choices. That is choice D.

Check: \((-3 + 5)^2 = 2^2 = 4\). The other choices are not solutions. For example \(x = -2\) gives \((-2 + 5)^2 = 9\), not 4.
```

## Medium
```task
bank: m-11617
highlight:
- "7|x − 7| = 42" :: Divide by 7 first to isolate the absolute value: \(\vert x - 7 \vert = 6\).
- "sum of the solutions" :: Find both solutions, then add them.
explain:
Isolate the absolute value by dividing both sides by 7:

\[\vert x - 7 \vert = 6\]

An absolute value of 6 means \(x - 7\) is 6 or \(-6\):

- \(x - 7 = 6\) gives \(x = 13\)
- \(x - 7 = -6\) gives \(x = 1\)

The sum is \(13 + 1 = 14\), choice C.

Shortcut: the solutions sit 6 units either side of 7, so their sum is \(2 \cdot 7 = 14\). Choice B, 0, adds 6 and \(-6\), which are not the solutions.
```

## Hard
```task
bank: m-13215
highlight:
- "((1/2)x − 33/2)^2" :: Factor \(\frac12\) out of the bracket: it equals \(\frac12(x - 33)\).
- "− 64 = 0" :: Move 64 over to isolate the square.
- "(x − 33)^2" :: You are asked for this square, not for \(x\).
explain:
The bracket has a common factor \(\frac12\): \(\frac12 x - \frac{33}{2} = \frac12(x - 33)\).

Square it. The \(\frac12\) becomes \(\frac14\):

\[\left(\tfrac12(x - 33)\right)^2 = \tfrac14(x - 33)^2\]

So the equation is \(\frac14(x - 33)^2 - 64 = 0\). Move 64 over and multiply by 4:

\[(x - 33)^2 = 4 \cdot 64 = 256\]

The question asks for \((x - 33)^2\), so the answer is 256, choice D. You never need the two values of \(x\). Choice C, 128, comes from forgetting that \(\left(\frac12\right)^2 = \frac14\). A good habit: before you solve, look at what the question asks for. Here it saves two steps.
```

# Quadratic formula
Plug \(a\), \(b\), \(c\) in. Watch the signs.

```visual
nonlinear-equations--formula
```

## Key ideas
For any equation \(ax^2 + bx + c = 0\):
\[x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\]
It is not on the SAT reference sheet, so memorize it. Get the equation equal to 0 first. Then read \(a\), \(b\) and \(c\) **with their signs**, work out \(b^2 - 4ac\), and finish with the \(\pm\).

Use it when the equation does not factor nicely. SAT answers are often radicals: \(x^2 - 10x + 7 = 0\) gives \(\frac{10 \pm \sqrt{72}}{2}\), and since \(\sqrt{72} = 6\sqrt2\), the solutions are \(5 \pm 3\sqrt2\).

Sign traps: if \(b = -3\), then \(-b = +3\). Write \((-3)^2 = 9\) in brackets. If \(c\) is negative, \(-4ac\) becomes positive. Divide the **whole** top by \(2a\), not only the square root.

```example
Solve \(x^2 - 6x + 4 = 0\).
1. \(a = 1,\ b = -6,\ c = 4\) :: Read the numbers with their signs.
2. \(x = \dfrac{6 \pm \sqrt{36 - 16}}{2}\) :: \(-b = 6\) and \(b^2 - 4ac = 36 - 16\).
3. \(x = \dfrac{6 \pm 2\sqrt5}{2}\) :: \(\sqrt{20} = 2\sqrt5\).
4. \(x = 3 \pm \sqrt5\) :: Divide both terms by 2.
```

```theory
The formula comes from **completing the square**. Starting from \(ax^2 + bx + c = 0\), divide by \(a\), add \(\left(\frac{b}{2a}\right)^2\) to both sides to build a perfect square, and take the square root. You do not need the proof on the SAT, but knowing it gives you a second method that is sometimes faster: for \(x^2 - 2x - 9 = 0\), write \(x^2 - 2x + 1 = 10\), so \((x - 1)^2 = 10\) and \(x = 1 \pm \sqrt{10}\).

The part under the root, \(b^2 - 4ac\), is called the **discriminant**. If it is a perfect square (like 49 or 81), the equation factors over the integers and the solutions are rational. If not, the solutions have a square root in them.

Simplify radicals by pulling out square factors: \(\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt2\). Then divide each term of the top by the bottom: \(\frac{10 \pm 6\sqrt2}{2} = 5 \pm 3\sqrt2\).

SAT questions often say "one solution can be written as \(h - \frac12\sqrt{k}\), where \(h\) and \(k\) are integers" and ask for \(h + k\). Solve with the formula, then match: \(\frac{12 \pm \sqrt{248}}{4}\) simplifies to \(3 \pm \frac12\sqrt{62}\), so \(h = 3\) and \(k = 62\).

If the equation has a number in front of the squares or is not equal to 0, fix that first. And if factoring takes more than a few seconds, switch to the formula.
```

## Easy
```task
\(2x^2 - 5x - 3 = 0\)
What is the positive solution to the given equation?
answer: 3
- 6 :: You divided by 2 instead of by \(2a = 4\).
- 7 :: That is \(\sqrt{b^2 - 4ac}\). Finish the formula.
- -1/2 :: That is the negative solution. The question asks for the positive one.
~ type y=2x^{2}-5x-3 :: Graph the left side as y.
~ zoom -3 5 -12 8
~ point (3, 0) :: The positive crossing: x = 3.
highlight:
- "\(2x^2 - 5x - 3 = 0\)" :: Read \(a = 2\), \(b = -5\), \(c = -3\).
- "positive solution" :: The formula gives two values. Keep the positive one.
explain:
Read the coefficients with their signs: \(a = 2\), \(b = -5\), \(c = -3\).

First the discriminant: \(b^2 - 4ac = (-5)^2 - 4(2)(-3) = 25 + 24 = 49\).

Now the formula. Since \(b = -5\), \(-b = 5\):

\[x = \frac{5 \pm \sqrt{49}}{2 \cdot 2} = \frac{5 \pm 7}{4}\]

The two solutions are \(\frac{5 + 7}{4} = 3\) and \(\frac{5 - 7}{4} = -\frac12\).

The positive solution is 3. A quick check: \(2(9) - 5(3) - 3 = 18 - 15 - 3 = 0\).

The wrong values show typical slips. 6 comes from dividing by 2 instead of by \(2a = 4\). 7 is the square root of the discriminant, and the formula is not finished yet. \(-\frac12\) is the other solution.
```

## Medium
```task
bank: m-0029
highlight:
- "x^2 - 2x - 9 = 0" :: Here \(a = 1\), \(b = -2\), \(c = -9\). Use the formula or complete the square.
- "1 + sqrt(k)" :: Match the formula's answer to this form. The 1 comes from \(\frac{-b}{2a}\).
explain:
Use the quadratic formula with \(a = 1\), \(b = -2\), \(c = -9\):

\[x = \frac{2 \pm \sqrt{4 + 36}}{2} = \frac{2 \pm \sqrt{40}}{2}\]

Simplify the root: \(\sqrt{40} = 2\sqrt{10}\). Then divide both terms by 2:

\[x = 1 \pm \sqrt{10}\]

One solution is \(1 + \sqrt{10}\), so \(k = 10\), choice B.

Completing the square gives the same: \(x^2 - 2x + 1 = 10\), so \((x - 1)^2 = 10\). Choice D, 40, is the number under the root before simplifying and dividing by 2. When the middle coefficient is even, completing the square is often quicker than the formula, so keep both methods ready.
```

## Hard
```task
bank: m-13236
highlight:
- "2x^2 − 12x − 13 = 0" :: Here \(a = 2\), \(b = -12\), \(c = -13\). Divide the top by \(2a = 4\).
- "x = h − (1/2)sqrt(k)" :: Match this form: a number minus half a square root.
- "h + k" :: Find \(h\) and \(k\) separately, then add.
explain:
Quadratic formula with \(a = 2\), \(b = -12\), \(c = -13\):

\[x = \frac{12 \pm \sqrt{144 + 104}}{4} = \frac{12 \pm \sqrt{248}}{4}\]

Simplify: \(\sqrt{248} = \sqrt{4 \cdot 62} = 2\sqrt{62}\). Divide each term by 4:

\[x = 3 \pm \frac{2\sqrt{62}}{4} = 3 \pm \frac12\sqrt{62}\]

The solution \(3 - \frac12\sqrt{62}\) matches \(h - \frac12\sqrt{k}\), so \(h = 3\) and \(k = 62\).

Then \(h + k = 65\), choice D. Choice C mistakes 31, half of 62, for \(k\). Keep \(k\) as the number under the root, because the \(\frac12\) is already in the form.

Notice the order: pull the square factor 4 out of 248 first, then divide each term of the top by 4.
```

# Sum and product
Two different solutions? Read them off the coefficients.

```visual
nonlinear-equations--sum-product
```

## Key ideas
If \(ax^2 + bx + c = 0\) has **two different** solutions \(r\) and \(s\), then
\[r + s = -\frac{b}{a} \qquad r \cdot s = \frac{c}{a}\]
You do not need to solve anything. When \(a = 1\), this is just: sum \(= -b\), product \(= c\).

Get the equation equal to 0 first, and keep the signs: for \(2x^2 - 10x = -7\), move the \(-7\) to get \(2x^2 - 10x + 7 = 0\).

Trap: the rule counts two *different* solutions. \(x^2 - 6x + 9 = 0\) has only one solution, \(x = 3\), so its "sum of the solutions" is 3, not \(-b/a = 6\). And with no real solutions, there is no sum at all. Check the discriminant when in doubt.

```example
Find the sum and product of the solutions of \(5x^2 - 30x + 8 = 0\).
1. \(a = 5,\ b = -30,\ c = 8\) :: Read the numbers with signs.
2. Sum \(= -\dfrac{b}{a} = \dfrac{30}{5} = 6\) :: Opposite of \(b\), over \(a\).
3. Product \(= \dfrac{c}{a} = \dfrac85\) :: \(c\) over \(a\).
```

```theory
Why does it work? If the solutions are \(r\) and \(s\), the equation can be written \(a(x - r)(x - s) = 0\). Expand: \(a\left(x^2 - (r + s)x + rs\right) = ax^2 - a(r + s)x + a\,rs\). Compare with \(ax^2 + bx + c\): \(b = -a(r + s)\) and \(c = a\,rs\). Divide by \(a\) and you get the two formulas.

The College Board states the rule for \(a = 1\): for \(x^2 + bx + c = 0\), the sum of the distinct solutions is \(-b\) and the product is \(c\). The form with \(a\) is the same idea, and it saves you from dividing first. If a question gives \(4x^2 + 8x - 60 = 0\) and asks for the product, the answer is \(\frac{-60}{4} = -15\), not \(-60\).

Letters can hide in the coefficients. For \(57x^2 + (57b + a)x + ab = 0\), the product of the solutions is \(\frac{ab}{57}\), which is \(\frac{1}{57}\) times \(ab\).

Useful by-products: if one solution is known, the sum or the product gives the other one. And the vertex of the parabola \(y = ax^2 + bx + c\) is at \(x = \frac{r + s}{2} = -\frac{b}{2a}\), halfway between the solutions.

Always make sure the solutions exist and differ. If the discriminant \(b^2 - 4ac\) is positive, you are safe.
```

## Easy
```task
\(3x^2 - 18x + 5 = 0\)
What is the sum of the solutions to the given equation?
answer: 6
- 18 :: That is \(-b\). Divide by \(a = 3\) as well.
- -6 :: The sign is wrong: the sum is \(-\frac{b}{a}\), and \(b = -18\).
- 5/3 :: That is the product \(\frac{c}{a}\), not the sum.
highlight:
- "\(3x^2 - 18x + 5 = 0\)" :: Read \(a = 3\) and \(b = -18\). The equation already equals 0.
- "sum of the solutions" :: Sum \(= -\frac{b}{a}\). No solving needed.
explain:
The equation is already equal to 0, with \(a = 3\), \(b = -18\), \(c = 5\).

The two solutions are different, because \(b^2 - 4ac = 324 - 60 = 264 > 0\). So the sum rule applies:

\[r + s = -\frac{b}{a} = -\frac{-18}{3} = \frac{18}{3} = 6\]

The answer is 6.

Notice what the wrong answers did. 18 stops after taking \(-b\). 5/3 is the product, \(\frac{c}{a}\). And \(-6\) has lost the minus sign that comes from \(b\) itself being negative. You can also confirm by solving: the solutions are \(3 \pm \frac{\sqrt{66}}{3}\), and the radical parts cancel when you add.
```

## Medium
```task
bank: m-11939
highlight:
- "4x^2 + 8x − 60 = 0" :: Here \(a = 4\) and \(c = -60\). The leading number is not 1.
- "product of the solutions" :: Product \(= \frac{c}{a}\), not just \(c\).
explain:
For \(ax^2 + bx + c = 0\), the product of the solutions is \(\frac{c}{a}\). Here \(a = 4\) and \(c = -60\):

\[\frac{c}{a} = \frac{-60}{4} = -15\]

The discriminant \(64 + 960 = 1024\) is positive, so there are two different solutions and the rule applies.

You can confirm by solving. Divide by 4: \(x^2 + 2x - 15 = 0\), which factors as \((x + 5)(x - 3) = 0\). The solutions are \(-5\) and 3, and their product is \(-15\). The answer is B.

Choice A, \(-60\), forgets to divide by the leading coefficient 4.
```

## Hard
```task
bank: m-0137
highlight:
- "57x^2 + (57b + a)x + ab = 0" :: The \(x^2\) coefficient is 57. The constant term is \(ab\).
- "The product of the solutions" :: Product \(= \frac{c}{a}\), here \(\frac{ab}{57}\).
- "kab" :: Compare \(kab\) with \(\frac{ab}{57}\) to read \(k\).
explain:
The product of the solutions of \(ax^2 + bx + c = 0\) is \(\frac{c}{a}\). In this equation the \(x^2\) coefficient is 57 and the constant term is \(ab\). (The letters \(a\) and \(b\) here are just constants in the middle coefficient, not the rule's \(a\), \(b\).)

\[\text{product} = \frac{ab}{57}\]

The problem says the product is \(kab\). So \(kab = \frac{ab}{57}\). Divide both sides by \(ab\), which is not zero because \(a\) and \(b\) are positive:

\[k = \frac{1}{57}\]

The answer is A.

You can check by factoring: \(57x^2 + (57b + a)x + ab = (57x + a)(x + b)\), with solutions \(-\frac{a}{57}\) and \(-b\). Their product is \(\frac{ab}{57}\). Choice D inverts the fraction.
```

# Count with the discriminant
The sign of \(b^2 - 4ac\) tells you how many.

```visual
nonlinear-equations--discriminant
```

## Key ideas
The **discriminant** is the part of the quadratic formula under the root: \(b^2 - 4ac\). Its sign decides how many real solutions \(ax^2 + bx + c = 0\) has.

| \(b^2 - 4ac\) | Real solutions | Graph |
|---|---|---|
| \(> 0\) | two different | crosses the \(x\)-axis twice |
| \(= 0\) | exactly one | just touches the axis |
| \(< 0\) | none | never reaches the axis |

Always put the equation in the form \(ax^2 + bx + c = 0\) first. A constant on the right moves over: \(2x^2 - 4x = t\) is \(2x^2 - 4x - t = 0\), so \(c = -t\).

SAT wording: "exactly one real solution" means discriminant \(= 0\). "No real solutions" means \(< 0\). "More than one" or "two distinct" means \(> 0\). Often one letter is unknown, and you solve an equation or inequality for it.

```example
For what value of \(c\) does \(4x^2 + 12x + c = 0\) have exactly one real solution?
1. \(a = 4,\ b = 12\) :: \(c\) is the unknown.
2. \(12^2 - 4 \cdot 4 \cdot c = 0\) :: One solution: discriminant 0.
3. \(144 - 16c = 0\), so \(c = 9\) :: Solve for \(c\).
```

```theory
A **real** solution is an ordinary number on the number line. If \(b^2 - 4ac < 0\), the formula asks for the square root of a negative number, which is not real, so there are no real solutions. If it equals 0, the \(\pm\) gives the same number twice, so there is one solution (a "double root"). If it is positive, the \(\pm\) gives two different numbers.

The graph tells the same story. The graph of \(y = ax^2 + bx + c\) is a parabola, and the solutions are where it meets the \(x\)-axis: twice, once (touching) or never.

Quick check without computing: if \(a\) and \(c\) have opposite signs, then \(-4ac\) is positive, so the discriminant is positive and there are always two solutions. Also, an equation like \(x^2 = -841\) or \((x - 1)^2 = -4\) has no real solutions because a square cannot be negative.

When an equation has a parameter, boundaries matter. "No real solution" needs \(b^2 - 4ac < 0\), strictly. For \(-x^2 + bx - 676 = 0\), the discriminant is \(b^2 - 2704\). It is negative for \(b < 52\), but \(b = 52\) gives 0, which means one solution. So the greatest integer \(b\) is 51.

Multiply an equation by \(-1\) if it helps: the solutions stay the same, and the discriminant keeps its value.
```

## Easy
```task
bank: m-0043
highlight:
- "x^2 - 12x + 27 = 0" :: Here \(a = 1\), \(b = -12\), \(c = 27\). Compute \(b^2 - 4ac\).
- "distinct real solutions" :: Count the different real values of \(x\).
explain:
Read the coefficients: \(a = 1\), \(b = -12\), \(c = 27\). Compute the discriminant:

\[b^2 - 4ac = (-12)^2 - 4(1)(27) = 144 - 108 = 36\]

It is positive, so the equation has **two** different real solutions. The answer is A, exactly two.

You can also factor: \((x - 3)(x - 9) = 0\), so \(x = 3\) or \(x = 9\). Two different numbers, as predicted.

Choice B would need a discriminant of exactly 0, and choice C a negative one.

The word *distinct* only means different. Two solutions that are the same number would count once.
```

## Medium
```task
bank: m-0158
highlight:
- "2x^2 - 4x = t" :: Move \(t\) to the left: \(2x^2 - 4x - t = 0\). So \(c = -t\).
- "no real solutions" :: The discriminant must be negative.
explain:
Rewrite the equation with 0 on one side:

\[2x^2 - 4x - t = 0\]

So \(a = 2\), \(b = -4\), \(c = -t\). The discriminant is

\[b^2 - 4ac = 16 - 4(2)(-t) = 16 + 8t\]

No real solutions means the discriminant is negative:

\[16 + 8t < 0 \;\Rightarrow\; t < -2\]

Only \(-3\) is less than \(-2\). The answer is A.

Check choice B: \(t = -1\) gives \(16 - 8 = 8 > 0\), so two real solutions. That is why it fails.

Be careful with the sign of \(c\). The equation was \(2x^2 - 4x = t\), so after moving \(t\) the constant is \(-t\), and \(-4ac\) turns into \(+8t\).
```

## Hard
```task
bank: m-0138
highlight:
- "-x^2 + bx - 676 = 0" :: Here \(a = -1\), \(b = b\), \(c = -676\). Write the discriminant.
- "no real solution" :: The discriminant must be negative, strictly.
- "greatest possible value of b" :: Solve the inequality, then pick the largest allowed whole number.
explain:
The equation is \(-x^2 + bx - 676 = 0\), so \(a = -1\), the middle coefficient is \(b\), and \(c = -676\).

\[b^2 - 4(-1)(-676) = b^2 - 2704\]

No real solution means the discriminant is negative:

\[b^2 - 2704 < 0 \;\Rightarrow\; b^2 < 2704 \;\Rightarrow\; b < 52\]

since \(b\) is positive and \(52^2 = 2704\).

\(b\) must be an integer less than 52, so the greatest value is 51.

Do not give 52. At \(b = 52\) the discriminant is exactly 0, which means one real solution, and the problem says there is none. The answer is 51.
```

# Line meets parabola
Set the \(y\)'s equal. Each crossing is a solution.

```visual
nonlinear-equations
```

## Key ideas
A system of one quadratic and one linear equation has as many solutions as the graphs have crossings. To solve it, **set the two expressions for \(y\) equal**, move everything to one side, solve for \(x\), then put each \(x\) back to find \(y\). A solution is a point \((x, y)\).

The discriminant of the combined equation counts the crossings: \(>0\) two, \(=0\) one (the line just touches), \(<0\) none.

To make a line touch a parabola **exactly once**, set the \(y\)'s equal and make the discriminant 0. The repeated solution is at \(x = -\frac{b}{2a}\) of the *combined* quadratic. Trap: use the \(b\) after subtracting the line, not the \(b\) of the original parabola.
\[ax^2 + bx + c = mx + k \;\Rightarrow\; ax^2 + (b - m)x + (c - k) = 0\]

```example
\(y = x^2 + 2x + 6\) and \(y = 4x + a\) touch exactly once. Find \(a\).
1. \(x^2 + 2x + 6 = 4x + a\) :: Set the right sides equal.
2. \(x^2 - 2x + (6 - a) = 0\) :: Move everything to one side.
3. \(4 - 4(6 - a) = 0\) :: One touch: discriminant 0.
4. \(a = 5\) :: Solve for \(a\).
```

```desmos
\(y = x^2 + 2x + 6\) and \(y = 4x + a\). For which \(a\) do they touch exactly once?
slider a = 0
type y=x^{2}+2x+6 :: Type both equations. The line has a slider.
type y=4x+a
zoom -4 6 -2 16
slider a = 0 .. 5 :: Drag a up until the line just touches.
point (1, 9) :: One touching point at a = 5.
```

```theory
Why set the \(y\)'s equal? A solution is a point that satisfies both equations, so it has the same \(y\) in both. Equating the two right-hand sides gives one equation in \(x\) alone. Its solutions are the \(x\)-coordinates of the crossings. Then use either original equation (the linear one is easier) to find \(y\).

Counting solutions: the line crosses the parabola twice, touches it once, or misses it. The discriminant of the combined quadratic is positive, zero or negative. Systems that ask "how many solutions?" are really discriminant questions. For \(y = x^2 + 3x - 7\) and \(y = 5x - 8\), the combined equation is \(x^2 - 2x + 1 = 0\), so the discriminant is 0 and there is exactly one solution.

A **horizontal** line \(y = c\) meets a parabola in at most two points, and in exactly one point only at the vertex. So "the line \(y = c\) touches the parabola once" asks for the vertex's \(y\)-value.

For a touching line, you can skip the discriminant: the double solution is \(x = -\frac{b}{2a}\) of the combined equation. For \(y = 2x^2 - 21x + 64\) and \(y = 3x + a\), the combined equation is \(2x^2 - 24x + (64 - a) = 0\), so \(x = \frac{24}{4} = 6\). Using \(-21\) from the original parabola would give a wrong answer.

When a line crosses a parabola at two points, the solutions satisfy both equations, so you can also find the \(x\)-values by factoring the combined equation.
```

## Easy
```task
bank: m-0094
highlight:
- "y = 5x + 4" :: One expression for \(y\).
- "y = 5x^2 + 4" :: Another expression for \(y\). Set the two equal.
- "ordered pair (x, y)" :: The answer needs both coordinates. Find \(x\), then \(y\).
explain:
Both equations equal \(y\), so set the right sides equal:

\[5x + 4 = 5x^2 + 4\]

Subtract \(5x + 4\) from both sides: \(0 = 5x^2 - 5x\), which factors as \(5x(x - 1) = 0\). So \(x = 0\) or \(x = 1\).

Find \(y\) with the line \(y = 5x + 4\):

- \(x = 0\) gives \(y = 4\), the point \((0, 4)\)
- \(x = 1\) gives \(y = 9\), the point \((1, 9)\)

Only \((0, 4)\) appears among the choices, which is choice B. Choice A has the right \(x\) but the wrong \(y\): remember that \(y\) is not the same as \(x\).
```

## Medium
```task
bank: m-0423
highlight:
- "y = x^2 + 3x - 7" :: The parabola.
- "y - 5x + 8 = 0" :: A line. Solve it for \(y\): \(y = 5x - 8\).
- "How many solutions" :: Substitute and use the discriminant, or count crossings.
explain:
Solve the second equation for \(y\): \(y = 5x - 8\).

Set the two expressions for \(y\) equal:

\[x^2 + 3x - 7 = 5x - 8\]

Move everything to the left:

\[x^2 - 2x + 1 = 0\]

The discriminant is \((-2)^2 - 4(1)(1) = 0\). Another way to see it: \(x^2 - 2x + 1 = (x - 1)^2 = 0\), so the only solution is \(x = 1\), with \(y = 5(1) - 8 = -3\).

A discriminant of 0 means the line just touches the parabola once. The system has exactly one solution, choice C. The other choices describe two crossings or none.
```

## Hard
```task
bank: m-0343
highlight:
- "y = 2x^2 - 21x + 64" :: The parabola. Do not take \(b\) from here.
- "y = 3x + a" :: Set equal to the parabola, then move \(3x\) over: \(b\) becomes \(-24\).
- "exactly one point" :: One crossing means a repeated solution: \(x = -\frac{b}{2a}\) of the combined equation.
- "What is the value of x?" :: You need the \(x\) of the touching point, not \(a\).
explain:
Set the two expressions for \(y\) equal:

\[2x^2 - 21x + 64 = 3x + a\]

Move everything to one side:

\[2x^2 - 24x + (64 - a) = 0\]

The graphs meet at exactly one point, so this quadratic has one repeated solution. A repeated solution is at \(x = -\frac{b}{2a}\) for the **new** equation, where \(b = -24\) and \(a = 2\):

\[x = \frac{24}{2 \cdot 2} = 6\]

The answer is C. (This happens when \(a = -8\), which makes the equation \(2(x - 6)^2 = 0\).) Choice A, \(-8\), is the value of the constant \(a\), but the question asks for \(x\).
```

# Extraneous solutions
Squaring or clearing fractions can add fake answers.

```visual
nonlinear-equations--extraneous
```

## Key ideas
An **extraneous solution** solves the new equation you made but not the original one. Two moves create them, so check every answer in the *original* equation.

**Square roots.** Isolate the root first, then square the **whole** side. A candidate that makes the root equal a negative number is fake, because a square root is never negative.
\[\sqrt{x + 12} = x \;\Rightarrow\; x + 12 = x^2 \;\Rightarrow\; (x - 4)(x + 3) = 0\]
\(x = 4\) works since \(\sqrt{16} = 4\). \(x = -3\) is fake since \(\sqrt{9} = 3\), not \(-3\).

**Fractions.** Multiply by the common denominator, then reject any candidate that makes a denominator 0. Cancelling a factor like \(\frac{(x + 9)(x - 9)}{x + 9}\) also excludes \(x = -9\).

```example
Solve \(\sqrt{x + 12} = x\) and check.
1. \(x + 12 = x^2\) :: Square both sides.
2. \((x - 4)(x + 3) = 0\) :: Make it 0 and factor.
3. \(x = 4\) works: \(\sqrt{16} = 4\) :: Check in the original.
4. \(x = -3\) fails: \(\sqrt{9} \ne -3\) :: Fake. Only \(x = 4\).
```

```theory
Squaring is not reversible. The equations \(a = b\) and \(a^2 = b^2\) are not equivalent: \(a^2 = b^2\) also allows \(a = -b\). So squaring \(\sqrt{x + 12} = x\) also admits \(-\sqrt{x + 12} = x\), and the extra solution comes from there. On the graph, squaring adds the lower half of the parabola \(x + 12 = y^2\), and the line \(y = x\) meets that lower half at the fake point.

For an equation like \(\sqrt{2x + 6} + 4 = x + 3\), do not square at once. First get the root alone: \(\sqrt{2x + 6} = x - 1\). Then square the whole right side, including the middle term: \((x - 1)^2 = x^2 - 2x + 1\), never \(x^2 - 1\). You get \(x^2 - 4x - 5 = 0\), so \(x = 5\) or \(x = -1\). Test both: \(x = 5\) gives \(\sqrt{16} = 4 = 5 - 1\), true. \(x = -1\) gives \(\sqrt{4} = 2\) but \(-1 - 1 = -2\), false.

With fractions, the excluded values show up before you start. In \(\frac{4x^2}{x^2 - 9} - \frac{2x}{x + 3} = \frac{1}{x - 3}\), the denominators are zero at \(x = 3\) and \(x = -3\). After multiplying you get \(2x^2 + 5x - 3 = 0\), so \(x = \frac12\) or \(x = -3\). Throw out \(-3\).

SAT wording: "What is the solution?", "solution set", "all values of \(x\)", "how many solutions". A result of "no solution" is possible when every candidate is extraneous.
```

## Easy
```task
bank: m-0315
highlight:
- "((x + 9)(x - 9))/(x + 9)" :: The bracket \(x + 9\) cancels, but only when \(x \ne -9\).
- "= 7" :: After cancelling: \(x - 9 = 7\).
explain:
The numerator and the denominator share the factor \(x + 9\). As long as \(x \ne -9\) (otherwise the denominator is 0), it cancels:

\[\frac{(x + 9)(x - 9)}{x + 9} = x - 9\]

So the equation becomes \(x - 9 = 7\), and \(x = 16\).

Check that 16 is allowed: it is not \(-9\), so the denominator is not 0. Then \(\frac{25 \cdot 7}{25} = 7\). The answer is C.

Choice A, 7, is what you get if you forget to add 9 back after reading the right side. The key habit: write the excluded value before you cancel.
```

## Medium
```task
bank: m-0189
highlight:
- "sqrt(2x + 6) + 4" :: Isolate the root first: \(\sqrt{2x + 6} = x - 1\).
- "x + 3" :: Subtract 4 from both sides: the right side becomes \(x - 1\).
- "solution set" :: Check every candidate in the original equation. Keep only those that work.
explain:
Isolate the square root. Subtract 4 from both sides:

\[\sqrt{2x + 6} = x - 1\]

Square the whole of each side. Remember \((x - 1)^2 = x^2 - 2x + 1\):

\[2x + 6 = x^2 - 2x + 1\]

Move everything to one side: \(x^2 - 4x - 5 = 0\), which factors as \((x - 5)(x + 1) = 0\). The candidates are \(x = 5\) and \(x = -1\).

Check them in the original equation:

- \(x = 5\): \(\sqrt{16} + 4 = 8\) and \(5 + 3 = 8\). It works.
- \(x = -1\): \(\sqrt{4} + 4 = 6\) but \(-1 + 3 = 2\). It fails, so it is extraneous.

The solution set is \(\{5\}\), choice B.
```

## Hard
```task
bank: m-0432
highlight:
- "(4x^2)/(x^2 - 9)" :: \(x^2 - 9 = (x + 3)(x - 3)\). This is the common denominator.
- "(2x)/(x + 3)" :: Its denominator is zero at \(x = -3\). That value is not allowed.
- "1/(x - 3)" :: This denominator rules out \(x = 3\).
- "What value of x satisfies" :: Check each candidate against the excluded values.
explain:
Factor the first denominator: \(x^2 - 9 = (x + 3)(x - 3)\). It is the common denominator. The excluded values are \(x = 3\) and \(x = -3\), because they make a denominator 0.

Multiply every term by \((x + 3)(x - 3)\):

\[4x^2 - 2x(x - 3) = x + 3\]

Expand: \(4x^2 - 2x^2 + 6x = x + 3\), so \(2x^2 + 5x - 3 = 0\). Factor: \((2x - 1)(x + 3) = 0\).

The candidates are \(x = \frac12\) and \(x = -3\).

\(x = -3\) is on the excluded list, so it is extraneous. The only solution is \(x = \frac12\), choice C. Choice A, \(-3\), is the trap.
```
