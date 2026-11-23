---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read parabolas and exponentials: vertex, zeros, growth, decay and shifts.
---

# Vertex form
Vertex \((h, k)\): the value is \(k\), at \(x = h\).

```visual
nonlinear-functions
```

## Key ideas
A parabola in **vertex form** is
\[y = a(x - h)^2 + k\]
Its **vertex**, the turning point, is \((h, k)\). If \(a > 0\) the parabola opens up and the vertex is the **minimum**. If \(a < 0\) it opens down and the vertex is the **maximum**. The line \(x = h\) is the **axis of symmetry**.

Keep the two jobs apart: the minimum or maximum **value** is \(k\); **where** it happens is \(x = h\).

To read \(h\), ask: *which \(x\) makes the bracket 0?* For \((x + 4)^2\) it is \(x = -4\). Trap: if \(x\) has a number in front inside the bracket, as in \(y = -(2x - 4)^2 + 7\), the bracket is 0 at \(x = 2\). The vertex is \((2, 7)\), not \((4, 7)\).

```example
A ball's height, in meters, \(x\) seconds after a throw is \(y = -5(x - 3)^2 + 45\). Find its maximum height.
1. \(a = -5 < 0\) :: Opens down, so the vertex is the maximum.
2. \(x - 3 = 0\) at \(x = 3\) :: \(h\): the \(x\) that makes the bracket 0.
3. \(k = 45\) :: Outside the bracket: the value, sign kept.
4. Maximum 45 meters, at 3 seconds :: The vertex is \((3, 45)\).
```

```theory
A **parabola** is the U-shaped graph of a quadratic function. The **vertex** is its lowest point if it opens up and its highest point if it opens down. Because the square \((x - h)^2\) is never negative and equals 0 only at \(x = h\), the function \(a(x - h)^2 + k\) with \(a > 0\) is smallest exactly there, and its smallest value is \(k\). That is why \(x^2 + 55\), which is \((x - 0)^2 + 55\), has minimum value 55 at \(x = 0\).

The number \(a\) sets the direction and the width: bigger \(\vert a \vert\) makes the parabola narrower. It never moves the vertex.

Why does the bracket have a minus? Because the vertex is where the bracket is zero: \(x - h = 0\). That is the safe way to read \(h\), and it also handles brackets with coefficients, such as \((2x - 10)^2\), which is 0 at \(x = 5\). You can also factor first: \(-3(2x - 10)^2 = -12(x - 5)^2\).

In a story, the vertex has a meaning: the maximum height and the time it is reached, or the lowest cost and the number of items. The SAT asks for the "best interpretation of the vertex", where the \(x\)-coordinate is a time and the \(y\)-coordinate is a height.

Writing the equation from a vertex and one more point: put the vertex in, \(y = a(x - 1)^2 + 9\), then use the other point to find \(a\). With the point \((2, 33)\), \(a + 9 = 33\), so \(a = 24\).
```

## Easy
```task
bank: m-0143
highlight:
- "g(x) = x^2 + 55" :: This is \((x - 0)^2 + 55\): the vertex is \((0, 55)\).
- "minimum value" :: Value means the \(y\)-coordinate of the vertex, not the \(x\)-coordinate.
explain:
The function is \(g(x) = x^2 + 55\), which is vertex form with \(h = 0\) and \(k = 55\). The coefficient of \(x^2\) is 1, which is positive, so the parabola opens up and the vertex is the lowest point.

The vertex is \((0, 55)\). The question asks for the minimum **value** of the function, which is the \(y\)-coordinate: 55.

You can also reason directly. The square \(x^2\) is never negative and is smallest, 0, when \(x = 0\). So the smallest possible value of \(x^2 + 55\) is \(0 + 55 = 55\).

The answer is B. Choice A, 0, is the \(x\)-value where the minimum happens, not the minimum value itself.
```

## Medium
```task
bank: m-0238
highlight:
- "(1/9)(x - 7)^2 + 3" :: Vertex form with \(h = 7\) and \(k = 3\). The coefficient \(\frac19\) is positive, so it opens up.
- "height above the ground f(x), in inches, x seconds" :: The output \(y\) is a height. The input \(x\) is time.
- "best interpretation of the vertex" :: The vertex is \((7, 3)\): a time of 7 seconds and a height of 3 inches.
explain:
The function \(f(x) = \frac19(x - 7)^2 + 3\) is in vertex form, so the vertex is \((h, k) = (7, 3)\).

The coefficient \(\frac19\) is positive, so the parabola opens upward and the vertex is the **lowest** point. That makes it a minimum.

Now read the units. In this model \(x\) is the number of seconds, and \(f(x)\) is the height in inches. So the vertex says: at 7 seconds, the height is at its lowest, 3 inches.

The question asks for the best interpretation, and choice A states that the ball's minimum height was 3 inches above the ground. Choice B uses the \(x\)-coordinate 7 as a height, but 7 is a time, in seconds. Choices C and D confuse the vertex with the starting point, which would be \(x = 0\).
```

## Hard
```task
The function \(f\) is defined by \(f(x) = -3(2x - 10)^2 + 12\). For what value of \(x\) does \(f(x)\) reach its maximum?
answer: 5
- 10 :: That is the constant in the bracket. Solve \(2x - 10 = 0\).
- 12 :: That is the maximum value. The question asks where it happens.
- 2 :: That is the coefficient of \(x\) inside the bracket. Solve \(2x - 10 = 0\).
~ type y=-3(2x-10)^{2}+12 :: Type it as it is.
~ zoom -2 12 -60 20
~ point (5, 12) :: The top of the graph is at x = 5.
highlight:
- "\(f(x) = -3(2x - 10)^2 + 12\)" :: The bracket holds \(2x\), not \(x\). So the vertex is not at \(x = 10\).
- "reach its maximum" :: This asks where the top is, which is an \(x\)-value. Not the height.
explain:
The coefficient \(-3\) is negative, so the parabola opens down and its vertex is a maximum.

The question asks **where** the maximum happens, which is the \(x\)-coordinate of the vertex. The function reaches its top when the bracket is zero, because the squared bracket is never negative and \(-3\) times a smaller square is larger:

\[2x - 10 = 0 \;\Rightarrow\; x = 5\]

The number 10 inside the bracket is not the vertex, because \(x\) is multiplied by 2 there. Another way to see it: \(-3(2x - 10)^2 = -12(x - 5)^2\), which shows \(h = 5\) at once.

The maximum value is \(k = 12\), reached at \(x = 5\). The question asks for the \(x\), so the answer is 5.
```

# Standard form
The vertex is at \(x = -\frac{b}{2a}\). Plug in for the value.

```visual
nonlinear-functions--axis
```

## Key ideas
In standard form \(f(x) = ax^2 + bx + c\), the vertex is at
\[x = -\frac{b}{2a}\]
That is the *where*. For the *value*, put that \(x\) back into \(f\). Again two jobs: first find where, then find the value. If \(a > 0\) it is a minimum, if \(a < 0\) a maximum. The number \(c\) is the \(y\)-intercept, since \(f(0) = c\).

Two more tools. A parabola is symmetric about its axis \(x = -\frac{b}{2a}\), so if two points have the **same \(y\)-value**, the axis is halfway between their \(x\)-values. And a horizontal line \(y = k\) touches a parabola only once when it passes through the vertex.

```example
Find the maximum value of \(f(x) = -2x^2 + 8x + 3\).
1. \(a = -2,\ b = 8\) :: \(a < 0\): opens down, so a maximum.
2. \(x = -\dfrac{8}{2(-2)} = 2\) :: Where the maximum is.
3. \(f(2) = -8 + 16 + 3 = 11\) :: Plug in for the value.
```

```theory
Why \(-\frac{b}{2a}\)? Complete the square: \(ax^2 + bx + c = a\left(x + \frac{b}{2a}\right)^2 + \left(c - \frac{b^2}{4a}\right)\). Compare with vertex form \(a(x - h)^2 + k\): \(h = -\frac{b}{2a}\). The formula is the quadratic formula without the square root part, \(\frac{-b \pm \sqrt{\cdots}}{2a}\): the two solutions sit at \(h\) plus and minus the root, so \(h\) is exactly halfway between them.

That halfway property gives a no-formula shortcut. Any two points on a parabola with the same \(y\)-value are mirror images, so the vertex's \(x\) is their average. A ball launched from 7 meters up that peaks at 3 seconds is back at 7 meters at 6 seconds, because 0 and 6 average to 3. If a parabola has an \(x\)-intercept at \(-\frac{17}{4}\) and vertex at \(x = -3\), the other intercept is as far right of \(-3\) as the first is left.

Sometimes the SAT wants the minimum value as an expression, not a number. For \(g(x) = x^2 + \frac{27}{2}x\), complete the square: half of \(\frac{27}{2}\) is \(\frac{27}{4}\), so \(g(x) = \left(x + \frac{27}{4}\right)^2 - \left(\frac{27}{4}\right)^2\), and the minimum value is \(-\left(\frac{27}{4}\right)^2\).

Always answer what is asked: the \(x\) of the vertex, or the \(y\).
```

## Easy
```task
\(f(x) = x^2 - 8x + 3\)
For what value of \(x\) does \(f(x)\) reach its minimum?
answer: 4
- 8 :: That is \(-b\). Now divide it by \(2a = 2\).
- -13 :: That is the minimum value, \(f(4)\). The question asks where.
- 3 :: That is \(f(0)\), the \(y\)-intercept, not the vertex.
~ type y=x^{2}-8x+3 :: Type it as it is.
~ zoom -3 11 -16 14
~ point (4, -13) :: The lowest point is at x = 4.
highlight:
- "\(f(x) = x^2 - 8x + 3\)" :: Standard form. Here \(a = 1\) and \(b = -8\).
- "reach its minimum" :: The question asks where. That is \(x = -\frac{b}{2a}\), not the value.
explain:
The function is in standard form with \(a = 1\) and \(b = -8\). Since \(a > 0\), the parabola opens up and has a minimum.

The \(x\)-coordinate of the vertex is

\[x = -\frac{b}{2a} = -\frac{-8}{2 \cdot 1} = 4\]

The question asks for the value of \(x\) where the minimum is reached, so the answer is 4.

If you also want the minimum value, put \(x = 4\) back in: \(f(4) = 16 - 32 + 3 = -13\). That is the \(y\)-coordinate of the vertex. Keep the two apart: 4 is **where**, \(-13\) is **how low**.
```

## Medium
```task
bank: m-0122
highlight:
- "launched from an initial height of 7 meters" :: At time 0 the height is 7. That is one point with height 7.
- "maximum height of 51.1 meters above the ground 3 seconds after the launch" :: The vertex is at \(t = 3\). The axis of symmetry is \(t = 3\).
- "return to a height of 7 meters" :: Same height as at the start, so it is the mirror image of \(t = 0\).
explain:
A quadratic model is a parabola, and a parabola is symmetric about the vertical line through its vertex. The maximum height is reached at \(t = 3\) seconds, so the axis of symmetry is \(t = 3\).

The projectile starts at height 7 meters when \(t = 0\). That point is 3 seconds to the left of the axis. By symmetry, the height is 7 meters again at the mirror point, 3 seconds to the right of the axis:

\[t = 3 + 3 = 6\]

Equivalently, the two times with equal height average to the axis time: \(\frac{0 + 6}{2} = 3\).

The projectile returns to 7 meters at 6 seconds, choice B. Choice A, 3, is the time of the maximum height, not the return to 7 meters.
```

## Hard
```task
bank: m-0510
highlight:
- "y = -x^2 + 9x - 100" :: Standard form: \(a = -1\), \(b = 9\). It opens down, so it has a top point.
- "the line y = c" :: A horizontal line.
- "exactly one point" :: A horizontal line meets a parabola once only at the vertex.
explain:
A horizontal line \(y = c\) meets a downward parabola in two points when it is below the top, in no point when it is above the top, and in exactly **one** point only when it passes through the vertex. So \(c\) is the \(y\)-coordinate of the vertex.

Find the vertex's \(x\)-coordinate:

\[x = -\frac{b}{2a} = -\frac{9}{2(-1)} = \frac92\]

Put it back in:

\[y = -\left(\frac92\right)^2 + 9 \cdot \frac92 - 100 = -\frac{81}{4} + \frac{81}{2} - 100 = \frac{81}{4} - 100 = -\frac{319}{4}\]

So \(c = -\frac{319}{4}\), choice C. Choice D, \(-\frac92\), is the \(x\)-coordinate of the vertex up to a sign, not its height.
```

# Zeros and the three forms
Each form shows one thing: zeros, vertex, or intercept.

```visual
nonlinear-functions--forms
```

## Key ideas
The same parabola can be written three ways, and each way **shows** something at a glance:

| Form | Looks like | Shows |
|---|---|---|
| Factored | \(a(x - r)(x - s)\) | zeros \(r\) and \(s\) |
| Vertex | \(a(x - h)^2 + k\) | vertex \((h, k)\) |
| Standard | \(ax^2 + bx + c\) | \(y\)-intercept \(c\) |

A **zero** of \(f\) is an \(x\) with \(f(x) = 0\): the graph meets the \(x\)-axis there. The vertex is halfway between the zeros, \(h = \frac{r + s}{2}\), so you can find a minimum or maximum from the factored form: find \(h\), then plug in.

Trap: set each factor equal to 0 to find the zeros. For \((2x - 7)(2x + 11)\) the zeros are \(\frac72\) and \(-\frac{11}{2}\), not 7 and \(-11\).

```example
Find the minimum value of \(f(x) = (x - 1)(x - 9)\).
1. \(x = 1\) and \(x = 9\) :: The zeros: each factor equals 0.
2. \(h = \dfrac{1 + 9}{2} = 5\) :: The vertex is halfway between them.
3. \(f(5) = 4 \cdot (-4) = -16\) :: Plug in for the value.
```

```theory
The **factored form** is also called intercept form. It comes from the zeros: if \(r\) and \(s\) are the zeros, then \(a(x - r)(x - s)\) is zero at both. The **vertex form** comes from completing the square, and the **standard form** is what you get when you multiply everything out.

All three describe the same function, so the number \(a\) is the same in every form. You can move between them by expanding (factored to standard) or by completing the square (standard to vertex). For \(x^2 - 8x + 12\): factoring gives \((x - 2)(x - 6)\), and completing the square gives \((x - 4)^2 - 4\).

SAT wording: "Which of the following equivalent forms of \(f\) displays the zeros of \(f\) as constants or coefficients?" means: choose the factored form. "...displays the minimum value of \(f\) as a constant or coefficient" means: choose the vertex form. Only the form with the right feature visible is correct, even though the others are equivalent. Another detail: each choice might have a plausible-looking sign error, so expand one choice to confirm.

When the zeros are given and the question asks for something about the coefficients, use \(f(x) = a(x - r)(x - s)\). For zeros 7 and \(-3\), \(f(x) = a(x - 7)(x + 3) = ax^2 - 4ax - 21a\), so \(b = -4a\) and \(c = -21a\). Then \(a + b = a - 4a = -3a\).

A negative \(a\) flips the parabola: the vertex is then a maximum.
```

## Easy
```task
\(f(x) = x^2 - 10x + 16\)
Which of the following equivalent forms of \(f\) displays the zeros of \(f\) as constants or coefficients?
* \(f(x) = (x - 2)(x - 8)\)
- \(f(x) = (x - 5)^2 - 9\) :: That form displays the vertex, \((5, -9)\).
- \(f(x) = x^2 - 10x + 16\) :: That form displays the \(y\)-intercept, 16.
- \(f(x) = (x + 2)(x + 8)\) :: That is \(x^2 + 10x + 16\). It is not equivalent.
~ type y=x^{2}-10x+16 :: Graph f.
~ zoom -2 12 -12 20
~ point (2, 0) :: The graph meets the x-axis at 2 and 8.
~ point (8, 0) :: So the zeros are 2 and 8.
highlight:
- "\(f(x) = x^2 - 10x + 16\)" :: Standard form. It shows \(c = 16\), not the zeros.
- "displays the zeros" :: Zeros are shown by the factored form: a product of brackets \(x - r\).
explain:
The question asks for the form that displays the **zeros** as constants. That is the factored form, \(a(x - r)(x - s)\), because each bracket gives a zero at once.

Factor \(x^2 - 10x + 16\). Find two numbers with product 16 and sum \(-10\): they are \(-2\) and \(-8\). So \(f(x) = (x - 2)(x - 8)\), and the zeros are 2 and 8.

The other choices fail for different reasons. \((x - 5)^2 - 9\) is equivalent to \(f\), but it shows the vertex \((5, -9)\). The original shows the \(y\)-intercept 16. And \((x + 2)(x + 8)\) expands to \(x^2 + 10x + 16\), which is a different function with zeros \(-2\) and \(-8\).

The answer is the first choice.
```

## Medium
```task
bank: m-15936
highlight:
- "(2x − 7)(2x + 11)" :: Factored form. Each bracket equal to 0 gives a zero: \(\frac72\) and \(-\frac{11}{2}\).
- "minimum value" :: First find where the vertex is (halfway between the zeros). Then plug in to get the value.
explain:
The function is in factored form, so read the zeros by setting each bracket to 0:

- \(2x - 7 = 0\) gives \(x = \frac72\)
- \(2x + 11 = 0\) gives \(x = -\frac{11}{2}\)

The parabola opens up (the \(x^2\) coefficient is \(2 \cdot 2 = 4 > 0\)), so the vertex is a minimum. The vertex is halfway between the zeros:

\[x = \frac{\frac72 + \left(-\frac{11}{2}\right)}{2} = \frac{-2}{2} = -1\]

Now plug \(x = -1\) into \(f\): \((2(-1) - 7)(2(-1) + 11) = (-9)(9) = -81\).

The minimum value is \(-81\), choice A. Choice B is one of the zeros, not the minimum value. The trap is using 7 and \(-11\) as zeros; the coefficient 2 inside the brackets changes them.
```

## Hard
```task
bank: m-0321
highlight:
- "passes through the points (7, 0) and (-3, 0)" :: Both points have \(y = 0\), so 7 and \(-3\) are the zeros.
- "a is an integer greater than 1" :: \(a\) can be 2, 3, 4, and so on.
- "a + b" :: Expand the factored form to find \(b\) in terms of \(a\).
explain:
The graph passes through \((7, 0)\) and \((-3, 0)\), so 7 and \(-3\) are the zeros of \(f\). Write the factored form:

\[f(x) = a(x - 7)(x + 3)\]

Expand: \((x - 7)(x + 3) = x^2 - 4x - 21\), so

\[f(x) = ax^2 - 4ax - 21a\]

Compare with \(ax^2 + bx + c\): \(b = -4a\). Then

\[a + b = a - 4a = -3a\]

Since \(a\) is an integer greater than 1, \(a + b\) can be \(-6\) (for \(a = 2\)), \(-9\), \(-12\), and so on. Only \(-6\) appears among the choices. The answer is A.

Choice B, \(-3\), would need \(a = 1\), which is not allowed.
```

# Growth and decay
Start \(a\), multiplier \(b\): above 1 grows, below 1 shrinks.

```visual
nonlinear-functions--grow-decay
```

## Key ideas
An exponential function has the form
\[f(x) = a \cdot b^x\]
The number \(a\) is the **initial value**: \(f(0) = a\), the \(y\)-intercept. The number \(b\) is the **multiplier** (growth factor): the amount is multiplied by \(b\) each time \(x\) goes up by 1.

- \(b > 1\): **growth**, which gets faster and faster.
- \(0 < b < 1\): **decay**, which shrinks, more and more slowly, and never reaches 0.

For a percent change use \(b = 1 + r\) (growth) or \(b = 1 - r\) (decay), where \(r\) is the percent as a decimal. Trap: the percent must be a decimal first, so 0.6% is 0.006 and \(b = 1.006\), not 1.06. And \(b = 0.87\) means a **13%** loss each step, not 87%.

```example
A used car is worth $18,000 and loses 12% of its value each year. Write its value after \(x\) years.
1. \(a = 18000\) :: The start, at \(x = 0\).
2. \(b = 1 - 0.12 = 0.88\) :: It loses 12%, so it keeps 88%.
3. \(V = 18000(0.88)^x\) :: Start times the multiplier to the power \(x\).
```

```theory
A linear function **adds** the same amount each step. An exponential function **multiplies** by the same number each step, which is why its graph curves. With \(b > 1\) the graph rises faster and faster. With \(0 < b < 1\) it falls toward the \(x\)-axis but never touches it: the \(x\)-axis (\(y = 0\)) is a **horizontal asymptote**.

A table shows the multiplier directly: divide any output by the one before it. If \(f(0) = 5\), \(f(1) = 15\), \(f(2) = 45\), then \(b = \frac{15}{5} = 3\).

The meaning of a percent comes from \(b\). If \(f(n) = 0.19 \cdot f(n - 1)\), the value keeps 19%, so it is \(100\% - 19\% = 81\%\) **less**. "150% more" means \(b = 1 + 1.5 = 2.5\), because the new amount is 250% of the old one.

Initial values need care. If a year is labelled \(t\) years after 2015 and a value is given for 2016, that is \(t = 1\), not \(t = 0\). Divide by \(b\) to go back one step: \(\frac{180}{2.5} = 72\).

Equivalent forms can hide \(a\): \(22(1.5)^{x+1} = 22 \cdot 1.5 \cdot 1.5^x = 33 \cdot 1.5^x\). The form with 33 in front shows the initial value as a coefficient. SAT questions ask "which equation shows the initial value as a coefficient or base".

Interpreting statements: \(f(8) \approx 32.91\) means "when \(x = 8\), the output is 32.91".
```

## Easy
```task
bank: m-0016
highlight:
- "7,400(0.87)^x" :: Form \(a \cdot b^x\). The number in front, \(a\), is the value when \(x = 0\).
- "at the time it was purchased" :: Purchase time is \(x = 0\), because \(x\) counts years after purchase.
explain:
The function is \(y = 7{,}400(0.87)^x\), in the form \(a \cdot b^x\), where \(x\) is the number of years after the purchase.

At the time of purchase, no years have passed: \(x = 0\). Anything to the power 0 is 1, so

\[y = 7{,}400 \cdot (0.87)^0 = 7{,}400 \cdot 1 = 7{,}400\]

The initial value is the coefficient \(a = 7{,}400\). The answer is C.

Choice B, 6,438, is the value after 1 year: \(7{,}400 \cdot 0.87 = 6{,}438\). The multiplier 0.87 also tells you the equipment loses 13% of its value each year, but the question asks only for the starting value.
```

## Medium
```task
bank: m-0234
highlight:
- "56(0.19)^x" :: The multiplier is \(b = 0.19\). It is below 1, so this is decay.
- "p% less than" :: Percent lost \(= 100\% - 19\%\), because 0.19 is what remains.
explain:
In \(f(x) = 56(0.19)^x\), each time \(x\) goes up by 1 the value is multiplied by \(b = 0.19\). So \(f(n) = 0.19 \cdot f(n - 1)\).

The value of \(f(n)\) is 19% **of** \(f(n - 1)\). The question asks how much **less** it is, as a percent:

\[100\% - 19\% = 81\%\]

So \(p = 81\), choice D.

Another way: \(b = 1 - r\) for decay, so \(r = 1 - 0.19 = 0.81\), or 81%. Choice A, 19, is the percent that remains, not the percent lost. Choice C, 56, is the initial value \(a\), which does not affect the percent change.
```

## Hard
```task
bank: m-0177
highlight:
- "150% more than the number of squirrels in the population at the end of the previous year" :: 100% + 150% = 250%. The multiplier is 2.5, not 1.5.
- "at the end of 2016, there were 180 squirrels" :: This is one year after 2015, so \(t = 1\), not \(t = 0\).
- "t years after the end of 2015" :: So \(t = 0\) is the end of 2015. The start \(a\) is the 2015 value.
explain:
Each year the population is 150% **more** than the year before, so it becomes \(100\% + 150\% = 250\%\) of the year before. The multiplier is \(b = 2.5\).

The model is \(n = a(2.5)^t\), where \(t\) counts years after the end of 2015. The value \(a\) is the population at \(t = 0\), the end of 2015.

We are told the end of 2016 has 180 squirrels. That is \(t = 1\):

\[180 = a(2.5)^1 \;\Rightarrow\; a = \frac{180}{2.5} = 72\]

So \(n = 72(2.5)^t\), choice B.

Choice D uses 180 as the starting value, but 180 is the value after one year. Choice A uses 1.5, which would be only 50% more each year.
```

# Exponent \(x/k\)
\(b\) multiplies once every \(k\) units of \(x\).

```visual
nonlinear-functions--timeline
```

## Key ideas
\[f(x) = a \cdot b^{x/k}\]
The exponent goes up by 1 each time \(x\) goes up by \(k\). So \(b\) multiplies the amount **once every \(k\) units**. The number \(k\) is the **period**: the doubling time when \(b = 2\), the half-life when \(b = \frac12\).

An exponent like \(3x\) works the other way: \(b^{3x}\) multiplies three times per unit of \(x\), so once every \(\frac13\) unit. In general \(b^{cx}\) has period \(\frac1c\).

Units must match. If \(x\) is in years and the question says "every 8 months", convert: 8 months is \(\frac23\) of a year. Also \(b^{x/k} = \left(b^{1/k}\right)^x\), so one unit of \(x\) multiplies by \(b^{1/k}\).

```example
\(N = 250(3)^{t/4}\) is the number of bacteria after \(t\) minutes. Find \(N\) at \(t = 12\).
1. \(t/4\): period 4 minutes :: Triples every 4 minutes.
2. \(12 \div 4 = 3\) periods :: Three triplings.
3. \(N = 250 \cdot 3^3 = 6750\) :: Start times the multiplier cubed.
```

```theory
The **period** is how many units of \(x\) one step takes. In \(2^{t/790}\) the exponent reaches 1 when \(t = 790\), so the amount doubles every 790 minutes. In \(\left(\frac12\right)^{t/12}\), it halves every 12 millimetres, minutes or whatever the unit of \(t\) is.

Fractions inside the exponent can be written two ways. \(P(t) = 290(1.04)^{(4/6)t}\) has the exponent \(\frac46 t\). It reaches 1 when \(t = \frac64 = 1.5\) years, which is 18 months. So the population grows 4% every 18 months. The exponent \(\frac64 t\) would mean the opposite: it reaches 1 at \(t = \frac46\) of a year, which is 8 months.

Shortcut: set the exponent equal to 1 and solve for the input. That input is the period.

Rewriting: \(2000(1.005)^{3x}\) with \(x\) in years multiplies by 1.005 three times a year, once every 4 months, and each step adds 0.5% of the balance at the start of that step. Not a fixed $5.

Building a function from a story: "every 2 days the views increase by 70%" means \(b = 1.70\) and the exponent is \(\frac{x}{2}\), giving \(233(1.70)^{x/2}\).

Be careful to put the right number in the exponent's denominator: it is the length of one period, in the same unit as \(x\).
```

## Easy
```task
bank: m-0053
highlight:
- "40,000(2)^(t/790)" :: The base 2 doubles the amount. The exponent \(t/790\) grows by 1 every 790 minutes.
- "to double" :: One doubling is one period.
explain:
In \(f(t) = 40{,}000 \cdot 2^{t/790}\) the base is 2, so every time the exponent goes up by 1 the population doubles.

The exponent is \(\frac{t}{790}\). It goes up by 1 when \(t\) goes up by 790. So the population doubles every 790 minutes.

Check by putting in \(t = 790\): \(f(790) = 40{,}000 \cdot 2^1 = 80{,}000\), exactly double the starting 40,000.

The answer is B, 790 minutes. Choice C, 1,580, is the time to quadruple (two doublings), and choice A, 2, is just the base.
```

## Medium
```task
bank: m-0221
highlight:
- "Every 2 days after April 1" :: The period is 2 days, so the exponent is \(\frac{x}{2}\).
- "increased by 70%" :: Multiplier \(b = 1 + 0.70 = 1.70\), not 0.70.
- "233 views" :: The start \(a = 233\), when \(x = 0\) on April 1.
explain:
Use \(f(x) = a \cdot b^{x/k}\) and find each piece.

- Start: there were 233 views on April 1, so \(a = 233\).
- Period: the views grow every 2 days, so the exponent is \(\frac{x}{2}\).
- Multiplier: an increase of 70% means each period's views are \(100\% + 70\% = 170\%\) of the earlier ones, so \(b = 1.70\).

Put them together:

\[f(x) = 233(1.70)^{x/2}\]

That is choice C. Choice A uses 0.70, which would be a 30% decrease. Choice D has the exponent \(2x\), which applies the growth twice a day instead of once every two days.
```

## Hard
```task
bank: m-0297
highlight:
- "290(1.04)^((4/6)t)" :: The multiplier 1.04 is applied each time the exponent \(\frac46 t\) rises by 1.
- "every 18 months" :: Change to years first, because \(t\) is in years: 1.5 years.
explain:
The multiplier is 1.04, meaning a 4% increase, and it is applied each time the exponent \(\frac46 t\) goes up by 1.

The unit of \(t\) is years, so convert the 18 months in the question: 18 months is \(1.5\) years.

Over 1.5 years, the exponent increases by

\[\frac46 \cdot 1.5 = 1\]

So during 18 months the factor 1.04 is applied exactly once. That is a 4% increase every 18 months, so \(n = 4\), choice C.

Choice B, 1.04, is the multiplier, not the percent. A good check: the exponent \(\frac46 t\) reaches 1 at \(t = \frac64 = 1.5\) years, which is 18 months.
```

# Trap: several periods
Multiply the multipliers. Never add the percents.

```visual
nonlinear-functions--periods
```

## Key ideas
Over several periods, **multiply**. After \(n\) periods the multiplier is \(b^n\), and the percent change is that number minus 1:
\[\text{percent change} = \left(b^n - 1\right) \cdot 100\%\]
Two increases of 20% give \(1.2 \cdot 1.2 = 1.44\), a **44%** increase, not 40%. The second 20% is taken from a bigger amount.

Going the other way, to find the multiplier for **one** unit when the function grows by \(b\) over \(k\) units, take a root: \(b^{1/k}\). If \(f(x) = (1.84)^{x/4}\), the yearly growth is \(1.84^{1/4} \approx 1.165\), about 16.5%, **not** \(84\% \div 4 = 21\%\).

Counting doublings is the same idea: from 275,000 to 1,100,000 is times 4, which is \(2^2\), so two doublings.

```example
\(f(x) = 50(1.5)^{x/4}\). By what percent does \(f\) increase every 8 units of \(x\)?
1. \(8 \div 4 = 2\) periods :: The exponent goes up by 2.
2. \(1.5^2 = 2.25\) :: Multiply 1.5 twice.
3. \(2.25 - 1 = 1.25\), so 125% :: Not 50% + 50% = 100%.
```

```theory
Why not add percents? After one 20% increase, 100 becomes 120. The second 20% is 20% **of 120**, which is 24, not 20. So you reach 144. The same happens with decreases: two 10% drops give \(0.9 \cdot 0.9 = 0.81\), a 19% drop, not 20%.

The formula \(a \cdot b^{x/k}\) handles any number of periods automatically: put the elapsed \(x\) in, and the exponent counts the periods, even if it is not a whole number. To get the change over a different length of time, replace \(x\) by \(x + \text{length}\) and divide: the amount is multiplied by \(b^{\text{length}/k}\).

For "closest to" questions like \((1.84)^{x/4} = \left(1 + \frac{p}{100}\right)^x\), rewrite as \(\left(1.84^{1/4}\right)^x\). Then \(1 + \frac{p}{100} = 1.84^{1/4}\). Use the calculator (or Desmos) to see that this is about 1.165, so \(p\) is about 16. The shortcut \(84 \div 4\) works only for small percents and linear growth, and it is exactly the trap.

Decay works the same way: a function \(500(0.8)^{x/3}\) multiplies by 0.8 every 3 hours. After 6 hours, it has been multiplied by \(0.8^2 = 0.64\). It has lost \(100\% - 64\% = 36\%\), not 40%.

Check every answer for size: the final multiplier must be above 1 for growth and below 1 for decay.
```

## Easy
```task
The function \(g(x) = 500(0.8)^{x/3}\) models the amount of a substance, in grams, \(x\) hours after an experiment begins. By what percent does the amount of the substance decrease every 6 hours?
answer: 36
- 40 :: You added 20% + 20%. Multiply 0.8 by 0.8 instead.
- 64 :: That is the percent remaining after 6 hours, not lost.
- 20 :: That is the decrease every 3 hours, not 6.
~ type y=500(0.8)^{\frac{x}{3}} :: Type it as it is.
~ zoom -3 20 -50 550
~ point (6, 320) :: At 6 hours: 320 g, which is 64% of 500.
highlight:
- "\(g(x) = 500(0.8)^{x/3}\)" :: The multiplier 0.8 applies once every 3 hours.
- "decrease every 6 hours" :: 6 hours is two periods of 3 hours. Multiply 0.8 twice.
explain:
In \(g(x) = 500(0.8)^{x/3}\), the exponent is \(\frac{x}{3}\), so the multiplier 0.8 is applied once every 3 hours. That is a 20% decrease per 3 hours.

The question asks about 6 hours, which is two periods of 3 hours (\(6 \div 3 = 2\)). Over two periods you multiply:

\[0.8^2 = 0.64\]

After 6 hours, the amount is 64% of what it was. It has decreased by

\[100\% - 64\% = 36\%\]

The answer is 36.

Do not add: \(20\% + 20\% = 40\%\) is wrong, because the second 20% is taken from a smaller amount than the first.
```

## Medium
```task
bank: m-0351
highlight:
- "doubles every 2 years" :: Each doubling takes 2 years.
- "275,000 transistors" :: The starting amount.
- "1.1 million" :: Compare with the start: \(1{,}100{,}000 \div 275{,}000 = 4\), which is two doublings.
explain:
The number of transistors doubles every 2 years, and it starts at 275,000.

Find how many times it must double to reach 1.1 million. Divide:

\[\frac{1{,}100{,}000}{275{,}000} = 4 = 2^2\]

So it must double **twice**.

Each doubling takes 2 years, so the total time is \(2 \cdot 2 = 4\) years. The year is \(1985 + 4 = 1989\), choice B.

Choice A, 1987, counts only one doubling (2 years), which gives 550,000 transistors. The multiplier over several periods is the product: doubling twice means times 4, not times 2 plus 2.
```

## Hard
```task
bank: m-0521
highlight:
- "(1.84)^(x/4)" :: The factor 1.84 (84% growth) happens every 4 units of \(x\), not every unit.
- "(1 + p/100)^x" :: This form shows growth per single unit. Its base equals \(1.84^{1/4}\).
- "closest to" :: Estimate the fourth root of 1.84 and compare the choices.
explain:
We need the multiplier for **one** unit of \(x\). Rewrite the exponent:

\[(1.84)^{x/4} = \left(1.84^{1/4}\right)^x\]

So \(1 + \frac{p}{100} = 1.84^{1/4}\). The fourth root of 1.84 is about 1.165. You can check: \(1.165^2 \approx 1.357\) and \(1.357^2 \approx 1.842\).

So \(1 + \frac{p}{100} \approx 1.165\), and \(p \approx 16.5\). The closest choice is 16, choice A.

The tempting wrong answer is 21: it comes from dividing 84 by 4. But growth is multiplicative. Four equal steps that multiply to 1.84 are not four steps of 21%. Check: \(1.21^4 \approx 2.14\), which is far above 1.84.
```

# Shifts and reflections
\(f(x + h)\) moves left. \(f(x) + k\) moves up.

```visual
nonlinear-functions--shifts
```

## Key ideas
A **translation** slides a graph without changing its shape.

| New function | The graph of \(f\) moves |
|---|---|
| \(f(x) + k\) | up \(k\) |
| \(f(x) - k\) | down \(k\) |
| \(f(x + h)\) | left \(h\) |
| \(f(x - h)\) | right \(h\) |
| \(-f(x)\) | flips upside down |

Outside the function is **vertical** and does what it says. Inside the bracket is **horizontal** and goes "backward". To find where \(g(x) = f(x + 2)\) has its minimum, make the **input** equal \(f\)'s minimum input: if \(f\) is lowest at \(x = 6\), solve \(x + 2 = 6\), so \(x = 4\).

A horizontal shift moves *where* the minimum is. A vertical shift changes the minimum *value*.

```example
\(f(x) = (x - 5)^2 + 2\) and \(g(x) = f(x + 3) - 4\). Find the vertex of \(g\).
1. \(x + 3 = 5\), so \(x = 2\) :: \(g\)'s input must hit \(f\)'s lowest input.
2. Minimum value \(2 - 4 = -2\) :: The \(-4\) drops every point by 4.
3. Vertex of \(g\): \((2, -2)\) :: Left 3, down 4 from \((5, 2)\).
```

```theory
Why does \(f(x + 2)\) move the graph **left**? Because \(g(x) = f(x + 2)\) puts the number \(x + 2\) into \(f\). To get the output that \(f\) gives at 6, \(g\) needs \(x + 2 = 6\), that is \(x = 4\). So every point of \(f\) shows up 2 units earlier on the \(x\)-axis for \(g\).

The vertical shift is easier: \(f(x) + 4\) adds 4 to every output, so every point of the graph moves up 4. In SAT figures, "the graph of \(y = f(x) + 4\) is shown" means: the picture is already shifted up 4, so subtract 4 from the equation to get \(f\).

You can combine shifts. Down 3 and left 5 is \(f(x + 5) - 3\). The vertex of a parabola moves exactly the same way: \((h, k)\) becomes \((h - 5, k - 3)\).

A horizontal shift never changes the minimum **value**. For \(f(x) = 4x^2 + 56x + 197\) with \(g(x) = f(x + 6)\), \(f\)'s minimum value is 1, so \(g\)'s minimum value is also 1. It is where the minimum happens that changes.

For exponentials a horizontal shift turns into a change of the starting number: \(f(x) = 9(4)^x\) gives \(f(x + 2) = 9 \cdot 4^2 \cdot 4^x = 144 \cdot 4^x\). The base stays 4; the coefficient is multiplied by \(4^2\).

Reflection: \(-f(x)\) turns a minimum into a maximum.
```

## Easy
```task
The function \(f\) is defined by \(f(x) = x^2 + 3\). The function \(g\) is defined by \(g(x) = f(x) - 5\). What is the minimum value of \(g\)?
answer: -2
- 3 :: That is the minimum value of \(f\). \(g\) is shifted down 5.
- 8 :: You added 5. A minus outside the function moves the graph down.
- -5 :: That is only the shift. Add it to 3.
~ type f(x)=x^{2}+3 :: Type f by its name.
~ type g(x)=f(x)-5 :: Then g, as given.
~ zoom -5 5 -4 8
~ point (0, -2) :: The lowest point of g is at y = -2.
highlight:
- "\(f(x) = x^2 + 3\)" :: The vertex is \((0, 3)\), so its minimum value is 3.
- "\(g(x) = f(x) - 5\)" :: A number outside the function moves the graph down by 5.
- "minimum value of \(g\)" :: A vertical shift changes the minimum value: \(3 - 5\).
explain:
The function \(f(x) = x^2 + 3\) has its vertex at \((0, 3)\), so its minimum value is 3.

The function \(g(x) = f(x) - 5\) subtracts 5 from every output of \(f\). That moves the whole graph **down** by 5 units. So the lowest point moves from \((0, 3)\) to \((0, -2)\).

The minimum value of \(g\) is

\[3 - 5 = -2\]

The answer is \(-2\).

You can check by writing \(g\) out: \(g(x) = x^2 + 3 - 5 = x^2 - 2\). The smallest value of \(x^2 - 2\) is \(-2\), at \(x = 0\).
```

## Medium
```task
bank: m-0445
highlight:
- "f(x) = 9(4)^x" :: An exponential with start 9 and multiplier 4.
- "g(x) = f(x + 2)" :: Replace every \(x\) in \(f\) by \(x + 2\). Then use \(4^{x+2} = 4^2 \cdot 4^x\).
explain:
The function \(g(x) = f(x + 2)\) puts \(x + 2\) wherever \(f\) has \(x\):

\[g(x) = 9(4)^{x + 2}\]

Split the exponent with the rule \(b^{m + n} = b^m \cdot b^n\):

\[9 \cdot 4^{x + 2} = 9 \cdot 4^2 \cdot 4^x = 9 \cdot 16 \cdot 4^x = 144 \cdot 4^x\]

So \(g(x) = 144(4)^x\), choice B.

The base 4 stays the same because the growth rate does not change when you slide the graph. What changes is the starting value, which is multiplied by \(4^2\). Choice A multiplies 9 by 2, which is the number in the shift, instead of by \(4^2\).
```

## Hard
```task
bank: m-0096
highlight:
- "f(x) = 4x^2 + 64x + 262" :: Standard form: \(f\) has its minimum at \(x = -\frac{b}{2a} = -8\).
- "g(x) = f(x + 5)" :: \(g\) is lowest when its input \(x + 5\) equals \(f\)'s lowest input.
- "reach its minimum" :: The question asks for \(x\), where the minimum is, not the value.
explain:
First find where \(f\) reaches its minimum. In standard form, the vertex is at

\[x = -\frac{b}{2a} = -\frac{64}{2 \cdot 4} = -8\]

The function \(g(x) = f(x + 5)\) gives \(f\) the input \(x + 5\). So \(g\) is lowest when that input is the one where \(f\) is lowest:

\[x + 5 = -8 \;\Rightarrow\; x = -13\]

The answer is \(-13\).

Picture it: the graph of \(g\) is the graph of \(f\) shifted 5 units to the **left**, so the vertex moves from \(x = -8\) to \(x = -8 - 5 = -13\). A wrong answer of \(-3\) comes from shifting the wrong way, solving \(x - 5 = -8\).
```
