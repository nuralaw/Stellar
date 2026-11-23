---
title: Linear Equations in Two Variables
skill: linear-equations-two-var
domain: algebra
section: math
summary: Read slopes and intercepts, write lines, and use parallel and perpendicular.
---

# Slope-intercept form
\(m\) is the steepness. \(b\) is where the line starts.

```visual
linear-equations-two-var--slope-intercept
```

## Key ideas
\[y = mx + b\]

- \(m\) is the **slope**: how much \(y\) changes when \(x\) goes up by 1. A positive slope rises to the right; a negative slope falls.
- \(b\) is the **\(y\)-intercept**: the point \((0, b)\) where the line crosses the \(y\)-axis. The SAT often asks for its \(y\)-coordinate, which is just \(b\).

If the equation is not in this form, simplify first: open brackets, combine like terms, then read the number in front of \(x\) and the plain number.

Two traps: reading the number in front of \(y\) as the slope, and reading the slope before the equation is simplified.

```example
\(y = 3(2x - 5) + 4\). Find the slope and the \(y\)-intercept.
1. \(y = 6x - 15 + 4\) :: Open the bracket.
2. \(y = 6x - 11\) :: Combine the plain numbers.
3. Slope 6, \(y\)-intercept \((0, -11)\) :: Read \(m\) and \(b\). The slope is not 3.
```

```theory
A **linear equation in two variables** has two letters, usually \(x\) and \(y\), each to the first power. A **solution** is a pair \((x, y)\) that makes it true, and all the solutions together form a straight line, the **graph** of the equation.

The **slope** measures steepness: **rise over run**, the change in \(y\) divided by the change in \(x\). If \(y\) goes up 3 when \(x\) goes up 1, the slope is 3. If \(y\) goes down 2 when \(x\) goes up 1, the slope is \(-2\). A slope of 0 is a flat line.

The **\(y\)-intercept** is where the line meets the \(y\)-axis. Every point on the \(y\)-axis has \(x = 0\), so put \(x = 0\) in the equation and you get \(y = b\).

Why simplify first? The formula \(y = mx + b\) needs \(y\) alone on one side and the \(x\)-terms collected on the other. In \(y = 3(2x - 5) + 4\), the 3 multiplies a bracket, so \(x\) is really multiplied by 6.

If the question gives a slope and a point on the \(y\)-axis, you can write the equation at once: slope 6 and the point \((0, 8)\) give \(y = 6x + 8\). A common wrong choice swaps the two numbers: \(y = 8x + 6\).

The SAT words it: "What is the slope of the graph of...", "What is the \(y\)-coordinate of the \(y\)-intercept...". In Desmos, type the equation and click where the line meets the \(y\)-axis.
```

## Easy
```task
bank: m-0853
highlight:
- "a slope of 6" :: The slope is \(m = 6\).
- "passes through the point (0, 8)" :: A point with \(x = 0\) is the \(y\)-intercept, so \(b = 8\).
explain:
Use \(y = mx + b\). The slope is \(m = 6\), the number that multiplies \(x\).

The point \((0, 8)\) has \(x = 0\), so it is where the line crosses the \(y\)-axis. That means \(b = 8\). Put \(m\) and \(b\) together: \(y = 6x + 8\), choice A.

Choice C swaps the two numbers (\(y = 8x + 6\)), which would be a line with slope 8 and \(y\)-intercept 6. Choices B and D have 48, which does not appear anywhere in the problem.
```

## Medium
```task
bank: m-17127
highlight:
- "y = (1/3)(26x + 11) + 9x" :: Not in \(y = mx + b\) form yet. Open the bracket first.
- "What is the slope" :: Add every \(x\)-term, including \(9x\).
explain:
Open the bracket: \(\frac{1}{3}(26x + 11) = \frac{26}{3}x + \frac{11}{3}\). The equation is \(y = \frac{26}{3}x + \frac{11}{3} + 9x\).

Combine the \(x\)-terms: \(\frac{26}{3}x + 9x = \frac{26}{3}x + \frac{27}{3}x = \frac{53}{3}x\). So \(y = \frac{53}{3}x + \frac{11}{3}\), and the slope is \(\frac{53}{3}\), choice B.

Choice A forgets the \(9x\) term, and choice C is the number inside the bracket. Always read the slope after everything is combined: bracket opened, like terms added, \(y\) alone on one side.

A sense check: \(\frac{53}{3}\) is about 17.7, a steep line, which fits a slope built from \(\frac{26}{3} \approx 8.7\) plus 9.
```

## Hard
```task
Line \(\ell\) is defined by \(6x + 9y = 5(2x - 3) + 4y\). What is the slope of line \(\ell\)?
answer: 4/5
- 4 :: That is the \(x\)-coefficient. Divide it by 5 first.
- -4/5 :: Sign slip: \(10x - 6x\) is \(+4x\).
~ type 6x+9y=5(2x-3)+4y :: Type the equation as it is.
~ zoom -4 12 -8 6
~ point (0, -3) :: It crosses the \(y\)-axis at \(-3\).
~ point (5, 1) :: Right 5, up 4: slope \(\frac{4}{5}\).
highlight:
- "\(6x + 9y = 5(2x - 3) + 4y\)" :: Open the bracket, then collect the \(y\)-terms on one side.
- "What is the slope" :: Get \(y\) alone, then read the number in front of \(x\).
explain:
Open the bracket: \(6x + 9y = 10x - 15 + 4y\). Collect the \(y\)-terms on the left and the \(x\)-terms on the right: \(9y - 4y = 10x - 6x - 15\), so \(5y = 4x - 15\).

Divide every term by 5: \(y = \frac{4}{5}x - 3\). The slope is \(\frac{4}{5}\).

Check with two points: \((0, -3)\) and \((5, 1)\) both satisfy the original equation (for \((5, 1)\): \(30 + 9 = 39\) and \(5(7) + 4 = 39\)). Going from one to the other is right 5, up 4, which is a slope of \(\frac{4}{5}\).
```

# Slope from two points
Rise over run. Read the numbers on the axes.

```visual
linear-equations-two-var--slope-formula
```

## Key ideas
\[m = \frac{y_2 - y_1}{x_2 - x_1}\]

Slope is **rise over run**: the change in \(y\) divided by the change in \(x\). Subtract in the **same order** on the top and the bottom.

On a graph, pick two points whose coordinates you can read exactly, and use the numbers on the axes. Never count grid squares: SAT graphs often use different scales on the two axes, so one square across is not one square up.

Special lines: a horizontal line like \(y = 3\) has slope 0. A vertical line like \(x = 3\) has an **undefined** slope (the run is 0, and you cannot divide by 0).

If a coordinate is unknown, put it in the formula, set it equal to the given slope, and solve.

```example
Find the slope of the line through \((-1, 5)\) and \((3, -3)\).
1. \(\frac{-3 - 5}{3 - (-1)}\) :: Same order on top and bottom.
2. \(\frac{-8}{4}\) :: Subtracting \(-1\) adds 1.
3. Slope \(= -2\) :: The line falls, so the slope is negative.
```

```theory
**Rise** is the change in height, \(y_2 - y_1\), and **run** is the change in the horizontal direction, \(x_2 - x_1\). The labels 1 and 2 only say which point you call first. The order does not matter as long as you use it on both the top and the bottom: \(\frac{-8}{4}\) and \(\frac{8}{-4}\) are both \(-2\). Mixing the orders flips the sign.

A positive slope means the line rises as you move right, and a negative slope means it falls. The bigger the number (ignoring the sign), the steeper the line.

Why not count squares? Suppose the \(x\)-axis goes 0, 1, 2, 3 and the \(y\)-axis goes 0, 10, 20, 30. Moving one square right and one square up would be a slope of 10, not 1. Read the labels on the axes.

Intercepts are points too. A line with \(x\)-intercept \((-6, 0)\) and \(y\)-intercept \((0, p)\) has slope \(\frac{p - 0}{0 - (-6)} = \frac{p}{6}\). If that slope is \(\frac{6}{13}\), then \(p = \frac{36}{13}\).

A horizontal line has run, but no rise: slope 0. A vertical line has rise, but no run: the slope is undefined.

On the SAT, an unknown coordinate is often hidden inside the points: "passes through \((1, -4)\) and \((5, 2k)\)". Write the slope formula with \(2k\) in it and solve.
```

## Easy
```task
bank: m-15524
highlight:
- "the points (4,7) and (18,28)" :: Two points are given. Use rise over run.
- "What is the slope" :: Slope \(= \frac{28 - 7}{18 - 4}\). Keep the order on top and bottom.
explain:
Slope is the change in \(y\) divided by the change in \(x\). Subtract the two points in the same order.

The change in \(y\) is \(28 - 7 = 21\). The change in \(x\) is \(18 - 4 = 14\). So the slope is \(\frac{21}{14} = \frac{3}{2}\).

Enter 3/2 or 1.5. Both are accepted. If you subtract in the other order, you get \(\frac{7 - 28}{4 - 18} = \frac{-21}{-14}\), which is the same \(\frac{3}{2}\). Only mixing the orders (21 over \(-14\)) gives a wrong sign.
```

## Medium
```task
bank: m-15830
highlight:
- "a slope of 6/13" :: This is the rise over run between any two points on the line.
- "an x-intercept of (−6, 0)" :: This is a point on the line: \((-6, 0)\).
- "a y-intercept of (0, p)" :: This is another point: \((0, p)\). Use it in the slope formula.
explain:
The line passes through the two points \((-6, 0)\) and \((0, p)\). Use them in the slope formula: \(\frac{p - 0}{0 - (-6)} = \frac{p}{6}\).

The slope is given as \(\frac{6}{13}\), so \(\frac{p}{6} = \frac{6}{13}\). Multiply both sides by 6: \(p = \frac{36}{13}\).

Sense check: the slope is positive, so the line rises to the right and the \(y\)-intercept is above the \(x\)-axis. \(\frac{36}{13}\) is about 2.77, so \(p\) is positive.

Enter 36/13, or the decimal 2.769, which fills the answer grid. A shorter decimal such as 2.77 is not accurate enough.
```

## Hard
```task
In the \(xy\)-plane, line \(\ell\) passes through the points \((1, -4)\) and \((5, 2k)\), where \(k\) is a constant. The slope of line \(\ell\) is \(\frac{3}{2}\). What is the value of \(k\)?
answer: 1
- 2 :: That is \(2k\), the \(y\)-coordinate. Divide by 2 to get \(k\).
- 5 :: You wrote \(2k - 4\). Subtracting \(-4\) adds 4.
highlight:
- "passes through the points \((1, -4)\) and \((5, 2k)\)" :: Use these two points in the slope formula. The unknown sits in the rise.
- "The slope of line \(\ell\) is \(\frac{3}{2}\)" :: Set the rise over run equal to \(\frac{3}{2}\).
- "What is the value of \(k\)?" :: Solve for \(k\), not for \(2k\).
explain:
The slope between the points is \(\frac{2k - (-4)}{5 - 1} = \frac{2k + 4}{4}\).

Set it equal to the given slope: \(\frac{2k + 4}{4} = \frac{3}{2}\). Multiply both sides by 4: \(2k + 4 = 6\). Subtract 4: \(2k = 2\). Divide by 2: \(k = 1\).

Check: the second point is \((5, 2)\). From \((1, -4)\), the run is 4 and the rise is 6, so the slope is \(\frac{6}{4} = \frac{3}{2}\). The answer is 1.

Remember that the point is \((5, 2k)\), so its \(y\)-coordinate is \(2k = 2\). The question asks for \(k\), not for the \(y\)-coordinate: that is why 2 is a trap.
```

# Standard form
\(Ax + By = C\): slope \(-\frac{A}{B}\), intercepts \(\frac{C}{A}\) and \(\frac{C}{B}\).

```visual
linear-equations-two-var
```

## Key ideas
\[Ax + By = C\]

Solve for \(y\): \(By = -Ax + C\), so \(y = -\frac{A}{B}x + \frac{C}{B}\). That gives three shortcuts:

- slope \(= -\dfrac{A}{B}\)
- \(y\)-intercept \(= \left(0, \dfrac{C}{B}\right)\)
- \(x\)-intercept \(= \left(\dfrac{C}{A}, 0\right)\)

The intercepts come from putting 0 in for the other letter: on the \(x\)-axis \(y = 0\), and on the \(y\)-axis \(x = 0\).

Keep each sign with its number. In \(10x - 5y = -12\), \(B = -5\), so the slope is \(-\frac{10}{-5} = 2\). Dropping the sign of \(B\) gives \(-2\), a classic wrong choice.

Use the shortcuts when the equation is already in standard form. They save the two steps of solving for \(y\), which is where most sign slips happen.

```example
\(3x + 2y = 12\). Find the slope and both intercepts.
1. Slope \(= -\frac{3}{2}\) :: \(-\frac{A}{B}\), with \(A = 3\) and \(B = 2\).
2. \(y = 0\): \(3x = 12\), so \(x = 4\) :: The \(x\)-intercept is \((4, 0)\).
3. \(x = 0\): \(2y = 12\), so \(y = 6\) :: The \(y\)-intercept is \((0, 6)\).
```

```theory
**Standard form** puts both letters on the left and a number on the right: \(Ax + By = C\). Equations like \(\frac{1}{2}x + \frac{1}{5}y - 40 = 0\) are the same thing with the number moved over: here \(A = \frac{1}{2}\), \(B = \frac{1}{5}\), and \(C = 40\). The slope is \(-\frac{1/2}{1/5} = -\frac{5}{2}\).

An **intercept** is a point where the line crosses an axis. On the \(x\)-axis every point has \(y = 0\), and on the \(y\)-axis every point has \(x = 0\). That is why you "zero the other letter". For \(7x + 2y = -31\): with \(y = 0\), \(x = -\frac{31}{7}\); with \(x = 0\), \(y = -\frac{31}{2}\).

The slope shortcut comes from solving for \(y\), so it works only when \(B \ne 0\). If \(B = 0\), the line is vertical (for instance \(2x = 8\) is \(x = 4\)). If \(A = 0\), the line is horizontal (\(2y = 8\) is \(y = 4\), slope 0).

Shifting a line up or down by \(k\) changes only the \(y\)-intercept, by \(k\). The slope stays the same. A line \(27x + 33y = 297\) has \(y\)-intercept \((0, 9)\); shifted down 5, it is \((0, 4)\).

The SAT words it: "What is the slope of the graph of...", "has an \(x\)-intercept at \((a, 0)\) and a \(y\)-intercept at \((0, b)\)". If you forget the shortcut, solve for \(y\) in two steps, or type the equation in Desmos and click the points.
```

## Easy
```task
bank: m-0718
highlight:
- "10x - 5y = -12" :: Standard form: \(A = 10\), \(B = -5\). Slope is \(-\frac{A}{B}\).
- "What is the slope" :: Watch the sign: dividing by \(-5\) flips it.
explain:
Use the shortcut: slope \(= -\frac{A}{B}\). Here \(A = 10\) and \(B = -5\), so the slope is \(-\frac{10}{-5} = 2\).

Or solve for \(y\): \(-5y = -10x - 12\), so \(y = 2x + \frac{12}{5}\). The slope is the number in front of \(x\), which is 2, choice D.

Choice A, \(-2\), misses the sign change from dividing by \(-5\). Keep the sign of \(B\) with its number. Check with the points: \(x = 0\) gives \(y = \frac{12}{5}\), and \(x = 1\) gives \(y = \frac{22}{5}\), which is 2 higher, so the slope is 2.
```

## Medium
```task
bank: m-0812
highlight:
- "7x + 2y = -31" :: Standard form. Both intercepts come from putting 0 in for the other letter.
- "an x-intercept at (a, 0)" :: Set \(y = 0\): then \(7a = -31\).
- "a y-intercept at (0, b)" :: Set \(x = 0\): then \(2b = -31\).
explain:
For the \(x\)-intercept \((a, 0)\), set \(y = 0\): \(7a = -31\), so \(a = -\frac{31}{7}\).

For the \(y\)-intercept \((0, b)\), set \(x = 0\): \(2b = -31\), so \(b = -\frac{31}{2}\).

Now divide: \(\frac{b}{a} = \frac{-31/2}{-31/7}\). The \(-31\) cancels, leaving \(\frac{1/2}{1/7} = \frac{7}{2}\), choice D.

Notice that \(\frac{C}{B} \div \frac{C}{A} = \frac{A}{B}\), here \(\frac{7}{2}\), so you can skip the arithmetic, because \(C\) cancels. The other choices, \(\frac{2}{7}\) and the negatives, come from flipping the ratio or dropping the signs.
```

## Hard
```task
The graph of \(5x + ky = 40\), where \(k\) is a constant, has a slope of \(-\frac{5}{6}\) in the \(xy\)-plane. What is the \(y\)-coordinate of the \(y\)-intercept of the graph?
answer: 20/3
- 8 :: That is the \(x\)-coordinate of the \(x\)-intercept, \(\frac{40}{5}\).
- 6 :: That is \(k\). The \(y\)-intercept is \(\frac{40}{k}\).
~ type 5x+6y=40 :: The line, once \(k = 6\).
~ zoom -4 12 -4 10
~ point (0, 6.667) :: The \(y\)-intercept: \(\frac{20}{3}\), about 6.67.
highlight:
- "has a slope of \(-\frac{5}{6}\)" :: The slope of \(5x + ky = 40\) is \(-\frac{5}{k}\). Set them equal.
- "the \(y\)-coordinate of the \(y\)-intercept" :: Put \(x = 0\): this is \(\frac{40}{k}\).
explain:
In \(5x + ky = 40\), \(A = 5\) and \(B = k\), so the slope is \(-\frac{5}{k}\). It equals \(-\frac{5}{6}\), so \(k = 6\).

The equation is \(5x + 6y = 40\). For the \(y\)-intercept, put \(x = 0\): \(6y = 40\), so \(y = \frac{40}{6} = \frac{20}{3}\).

Enter 20/3 (or the decimal 6.666 or 6.667). Note that 8 is the \(x\)-intercept's \(x\)-coordinate, and 6 is just \(k\).

Check with the other intercept: with \(y = 0\), \(5x = 40\), so \(x = 8\). The line passes through \((8, 0)\) and \((0, \frac{20}{3})\), a rise of \(\frac{20}{3}\) over a run of \(-8\): slope \(-\frac{20}{24} = -\frac{5}{6}\), as given. The question asks for the \(y\)-coordinate of the \(y\)-intercept, so the \(x\)-coordinate 0 is not part of the answer.
```

# Write the equation
Slope first. Then plug in a point to find \(b\).

```visual
linear-equations-two-var--write-equation
```

## Key ideas
To write a line you need a slope and one point.

1. Find the slope \(m\): it is given, or it is \(\frac{y_2 - y_1}{x_2 - x_1}\) from two points.
2. Put \(m\) and a point \((x_1, y_1)\) into \(y = mx + b\) and solve for \(b\).

The same idea in one line is the point-slope form:

\[y - y_1 = m(x - x_1)\]

Trap: the \(y\)-value of a point is \(b\) only when the point has \(x = 0\). Otherwise solve for \(b\).

Finish by testing the other point in your equation. If the numbers do not match, the slope or \(b\) has an arithmetic slip. This check takes ten seconds and catches most mistakes.

```example
A line passes through \((2, 5)\) and \((6, 17)\). Write its equation.
1. \(m = \frac{17 - 5}{6 - 2} = 3\) :: Rise over run.
2. \(5 = 3(2) + b\) :: Put the point \((2, 5)\) into \(y = mx + b\).
3. \(b = -1\), so \(y = 3x - 1\) :: Check: \(3(6) - 1 = 17\).
```

```theory
A line is determined by two points, or by one point and a slope. **Slope-intercept form** \(y = mx + b\) shows the slope and the \(y\)-intercept. **Point-slope form** \(y - y_1 = m(x - x_1)\) shows the slope and any point. They describe the same line: expand \(y - 5 = 3(x - 2)\) and you get \(y = 3x - 1\).

Why does plugging in a point find \(b\)? A point is on the line exactly when its coordinates make the equation true. Once \(m\) is known, the only unknown is \(b\).

The slope may be hidden in words: "\(y\) increases by 5 for each increase of 2 in \(x\)" means \(m = \frac{5}{2}\).

When you have choices, test them. Plug a point into each equation and cross out the choices that fail; if two survive, test the second point. This is often faster than deriving the equation, and Desmos can check the same way: type the choice and see whether the line goes through both points.

For a table, check that equal steps in \(x\) give equal steps in \(y\); then the slope is the step in \(y\) divided by the step in \(x\). In Desmos you can type the table and use a regression, \(y_1 \sim mx_1 + b\), to get \(m\) and \(b\).

Two-point questions can hide an unknown in a point, like \((k, 21)\). Write the equation first, then put the unknown point in.
```

## Easy
```task
bank: m-13513
highlight:
- "a slope of −1/3" :: This is \(m\). Put it in \(y = mx + b\).
- "passes through the point (9, 4)" :: Put \(x = 9\) and \(y = 4\) in to find \(b\).
explain:
Start with \(y = -\frac{1}{3}x + b\). The line passes through \((9, 4)\), so \(4 = -\frac{1}{3}(9) + b\). That is \(4 = -3 + b\), so \(b = 7\).

The equation is \(y = -\frac{x}{3} + 7\), choice D.

Choice C has the right slope, but its line passes through \((9, 1)\), not \((9, 4)\), because it used \(b = 4\), the \(y\)-value of the point. The \(y\)-value of a point is \(b\) only when \(x = 0\).

Quick test: at \(x = 9\) the line \(y = -\frac{x}{3} + 7\) gives \(-3 + 7 = 4\), as required.
```

## Medium
```task
In the \(xy\)-plane, line \(\ell\) passes through the points \((1, 7)\) and \((4, -2)\). Which equation defines line \(\ell\)?
* \(y = -3x + 10\)
- \(y = -3x + 7\) :: 7 is a \(y\)-value, not the \(y\)-intercept. Solve for \(b\).
- \(y = 3x + 4\) :: The line falls from left to right, so the slope is negative.
- \(y = -\frac{1}{3}x + \frac{22}{3}\) :: You flipped the slope. Rise over run is \(\frac{-9}{3}\).
~ type y=-3x+10 :: Type the correct choice.
~ zoom -2 8 -4 14
~ point (1, 7) :: It passes through the first point.
~ point (4, -2) :: And the second.
highlight:
- "passes through the points \((1, 7)\) and \((4, -2)\)" :: Two points give the slope: \(\frac{-2 - 7}{4 - 1}\).
- "Which equation defines line \(\ell\)?" :: After the slope, plug one point in to find \(b\), and check the other.
explain:
First find the slope: \(\frac{-2 - 7}{4 - 1} = \frac{-9}{3} = -3\).

Put the slope and the point \((1, 7)\) into \(y = mx + b\): \(7 = -3(1) + b\), so \(b = 10\). The equation is \(y = -3x + 10\).

Check with the other point: \(-3(4) + 10 = -2\), which matches \((4, -2)\). In a multiple-choice question you can also test the first point in every choice: three choices give 7 at \(x = 1\), and the second point then removes \(y = 3x + 4\) and \(y = -\frac{1}{3}x + \frac{22}{3}\).

The choice \(y = -3x + 7\) has the right slope but a wrong \(b\): at \(x = 1\) it gives 4, not 7. The choice \(y = 3x + 4\) passes through \((1, 7)\) but not through \((4, -2)\).
```

## Hard
```task
Line \(\ell\) passes through the points \((-2, 3)\) and \((4, -9)\). The point \((k, 21)\) also lies on line \(\ell\). What is the value of \(k\)?
answer: -11
- 11 :: Sign slip. \(-2k - 1 = 21\) gives \(-2k = 22\), so \(k\) is negative.
- -9 :: You used 3 as \(b\). Find \(b\) from the slope first.
~ type y=-2x-1 :: The line through both points.
~ type y=21 :: The height of the point \((k, 21)\).
~ zoom -14 6 -6 24
~ point (-11, 21) :: Click the crossing: \(k = -11\).
highlight:
- "passes through the points \((-2, 3)\) and \((4, -9)\)" :: Slope: \(\frac{-9 - 3}{4 - (-2)} = -2\).
- "The point \((k, 21)\) also lies on line \(\ell\)" :: Put \(y = 21\) into your equation and solve for \(k\).
explain:
The slope is \(\frac{-9 - 3}{4 - (-2)} = \frac{-12}{6} = -2\).

Find \(b\) with the point \((-2, 3)\): \(3 = -2(-2) + b\), so \(3 = 4 + b\) and \(b = -1\). The line is \(y = -2x - 1\).

The point \((k, 21)\) is on the line, so \(21 = -2k - 1\). Add 1: \(22 = -2k\). Divide by \(-2\): \(k = -11\).

Check: \(-2(-11) - 1 = 21\). Also \((4, -9)\): \(-2(4) - 1 = -9\). The answer is \(-11\).

Notice the order of the work: slope, then \(b\), then the unknown point. The wrong value 11 is a sign slip at the end, and \(-9\) comes from using 3 (a \(y\)-value) as if it were \(b\). A line with slope \(-2\) falls, so a high \(y\) of 21 must be at a negative \(x\).
```

# Parallel lines
Same slope, different intercept.

```visual
linear-equations-two-var--parallel
```

## Key ideas
\[m_1 = m_2\]

Parallel lines never meet. They have the **same slope** and different \(y\)-intercepts (the same slope and the same intercept is one line, not two).

To write a parallel line: copy the slope, then find \(b\) from the point you are given.

Standard form works too. The lines \(3x + 4y = 28\) and \(24x + ry = 24\) are parallel when their slopes match: \(-\frac{3}{4} = -\frac{24}{r}\), so \(r = 32\). A shortcut: \(24x + 32y\) is 8 times \(3x + 4y\), so the coefficients are in the same ratio.

Trap: parallel does not mean the same number in front of \(y\). Get the slope first.

```example
Line \(j\) is parallel to \(4x + 2y = 9\) and passes through \((0, 5)\). Write line \(j\).
1. Slope of \(4x + 2y = 9\): \(-\frac{4}{2} = -2\) :: Use \(-\frac{A}{B}\).
2. \(m = -2\) :: Parallel lines share the slope.
3. \(y = -2x + 5\) :: \((0, 5)\) is the \(y\)-intercept.
```

```theory
Two lines in the \(xy\)-plane are **parallel** if they never meet. Lines with different slopes always cross somewhere, so parallel lines must have equal slopes. Two lines with equal slopes and equal \(y\)-intercepts are the same line.

Vertical lines have no slope, but they can still be parallel: \(x = 2\) and \(x = 7\) are parallel. The slope rule is for lines that are not vertical.

Standard form: \(A_1x + B_1y = C_1\) and \(A_2x + B_2y = C_2\) are parallel when \(\frac{A_1}{A_2} = \frac{B_1}{B_2}\) but the \(C\) ratio is different. In other words, multiplying one equation by a number gives the same left side but not the same right side.

How the SAT asks it: "Line \(k\) is parallel to line \(j\). What is the slope of line \(k\)?" Find the slope of the line you are given, and you are done. A harder version has an unknown constant, such as \(r\) in \(24x + ry = 24\): match the slopes to find \(r\), then use the point to find the missing coordinate. If line \(k\) passes through \((0, b)\), then \(rb = 24\) once you know \(r\).

Trap: using the coefficient of \(y\), or the slope of the wrong line, as the answer. Another trap is the sign: \(x - 38y = 38\) has slope \(+\frac{1}{38}\), because \(-\frac{1}{-38}\) is positive.
```

## Easy
```task
bank: m-13608
highlight:
- "y = 7x + 2" :: The slope of line \(k\) is 7.
- "parallel to line k" :: Parallel lines have the same slope, so line \(j\) also has slope 7.
- "passes through the point (0,3)" :: A point with \(x = 0\): the \(y\)-intercept is 3.
explain:
Line \(k\) is \(y = 7x + 2\), so its slope is 7. Parallel lines have the same slope, so line \(j\) also has slope 7.

Line \(j\) passes through \((0, 3)\), a point on the \(y\)-axis, so its \(y\)-intercept is 3. Put them together: \(y = 7x + 3\), choice A.

Choice C uses the slope \(-7\): that line leans the other way, so it is not parallel. Parallel means equal slopes, not opposite ones.
```

## Medium
```task
bank: m-15914
highlight:
- "x − 38y = 38" :: Standard form with \(A = 1\) and \(B = -38\). The slope is \(-\frac{A}{B}\).
- "parallel to line p" :: The slope of line \(w\) equals the slope of line \(p\).
- "What is the slope of line w" :: Be careful with the sign of \(B\).
explain:
Solve line \(p\) for \(y\): \(-38y = -x + 38\), so \(y = \frac{1}{38}x - 1\). The slope is \(\frac{1}{38}\).

With the shortcut: \(-\frac{A}{B} = -\frac{1}{-38} = \frac{1}{38}\).

Parallel lines have equal slopes, so line \(w\) also has slope \(\frac{1}{38}\), choice B. Choices A and D, 38 and \(-38\), are numbers copied from the equation: they are not the slope. Choice C has the wrong sign: dividing by \(-38\) makes the slope positive.
```

## Hard
```task
bank: m-12321
highlight:
- "3x + 4y = 28" :: The slope of line \(j\) is \(-\frac{3}{4}\).
- "24x + ry = 24" :: The slope of line \(k\) is \(-\frac{24}{r}\). Match it to line \(j\).
- "passes through the point (0,b)" :: This is the \(y\)-intercept: put \(x = 0\) in line \(k\).
explain:
Line \(j\) is \(3x + 4y = 28\), so its slope is \(-\frac{3}{4}\). Line \(k\) is \(24x + ry = 24\), so its slope is \(-\frac{24}{r}\).

Parallel lines have equal slopes: \(-\frac{24}{r} = -\frac{3}{4}\). Cross-multiply: \(3r = 96\), so \(r = 32\).

Line \(k\) is now \(24x + 32y = 24\). The point \((0, b)\) is on it, so put \(x = 0\): \(32b = 24\), and \(b = \frac{24}{32} = \frac{3}{4}\).

Enter 3/4 or .75. A shortcut: \(24x + 32y\) is 8 times \(3x + 4y\), so \(r = 4 \cdot 8 = 32\). The \(y\)-intercepts differ (7 for line \(j\), \(\frac{3}{4}\) for line \(k\)), so these are two parallel lines, not one line twice.
```

# Perpendicular lines
Flip the slope, then change its sign.

```visual
linear-equations-two-var--perpendicular
```

## Key ideas
\[m_1 \cdot m_2 = -1 \qquad\text{so}\qquad m_{\perp} = -\frac{1}{m}\]

Perpendicular lines meet at a right angle. The new slope is the **negative reciprocal**: flip the fraction **and** change the sign. Slope \(\frac{2}{5}\) becomes \(-\frac{5}{2}\), and slope \(-3\) becomes \(\frac{1}{3}\). Check: the two slopes multiply to \(-1\).

Special cases: a line perpendicular to a horizontal line is vertical, and a line perpendicular to a vertical line, like \(x = 2\), is horizontal with slope 0.

In standard form there is a shortcut: the line \(Ax + By = C\) has slope \(-\frac{A}{B}\), so a perpendicular line has slope \(\frac{B}{A}\).

Trap: doing only one of the two moves.

```example
\(5x - 2y = 6\). What is the slope of a line perpendicular to it?
1. \(y = \frac{5}{2}x - 3\) :: Solve for \(y\): divide by \(-2\).
2. \(m = \frac{5}{2}\) :: Read the slope.
3. \(m_{\perp} = -\frac{2}{5}\) :: Flip it, then change the sign.
```

```theory
A **reciprocal** is a number flipped: the reciprocal of \(\frac{2}{5}\) is \(\frac{5}{2}\), and of 3 is \(\frac{1}{3}\). The **negative reciprocal** also changes the sign. Some books say "opposite reciprocal".

Why does it work? Draw the slope triangle of a line, with run 5 and rise 2 (slope \(\frac{2}{5}\)). Turn the whole picture a quarter turn: the run and the rise swap places, and one of them changes direction. The new triangle has run 2 and rise \(-5\), so the perpendicular slope is \(-\frac{5}{2}\).

The test that two lines are perpendicular: the product of their slopes is \(-1\), as long as neither line is vertical.

For standard form, there is a neat shortcut: the line \(Ax + By = C\) has slope \(-\frac{A}{B}\), so a perpendicular line has slope \(\frac{B}{A}\). For \(3x + 2y = 8\) that is \(\frac{2}{3}\).

How the SAT asks it: "Line \(j\) is perpendicular to line \(h\). What is the slope of line \(j\)?", sometimes with fractions in the equation, such as \(\frac{1}{3}x + \frac{1}{2}y - 30 = 0\), whose slope is \(-\frac{1/3}{1/2} = -\frac{2}{3}\). Hard versions add unknown coordinates: find the perpendicular slope first, then set the rise over run through the given points equal to it.

Traps: flipping but keeping the sign, changing the sign but not flipping, and answering with the slope of the line you were given. Expect all three among the wrong choices.
```

## Easy
```task
bank: m-16807
highlight:
- "y = −3x + 17" :: The slope of line \(k\) is \(-3\).
- "perpendicular to line k" :: The slope of line \(j\) is the negative reciprocal.
explain:
Line \(k\) has slope \(-3\). A perpendicular line has the negative reciprocal slope: flip \(-3\) (which is \(\frac{-3}{1}\)) to get \(\frac{1}{-3}\), then change the sign to get \(\frac{1}{3}\).

Check: \(-3 \cdot \frac{1}{3} = -1\). The answer is \(\frac{1}{3}\), choice D.

Choice B, \(-\frac{1}{3}\), is only the flipped slope; it keeps the wrong sign. Choice C is the slope of line \(k\) itself. Choice A, 3, changes the sign but does not flip. All three wrong choices are the usual traps, so always do both moves.
```

## Medium
```task
bank: m-17131
highlight:
- "(1/3)x + (1/2)y − 30 = 0" :: Standard form with fractions. The slope is \(-\frac{A}{B}\).
- "perpendicular to line h" :: Take the negative reciprocal of line \(h\)'s slope.
explain:
Line \(h\) is \(\frac{1}{3}x + \frac{1}{2}y - 30 = 0\). Solve for \(y\): \(\frac{1}{2}y = -\frac{1}{3}x + 30\). Multiply by 2: \(y = -\frac{2}{3}x + 60\). The slope of \(h\) is \(-\frac{2}{3}\).

A perpendicular line has the negative reciprocal slope: flip \(-\frac{2}{3}\) to \(-\frac{3}{2}\), then change the sign to \(\frac{3}{2}\).

Check: \(-\frac{2}{3} \cdot \frac{3}{2} = -1\). The answer is \(\frac{3}{2}\), choice D. Choice A is the slope of line \(h\) itself, and choice B only flips it. With the shortcut, \(A = \frac{1}{3}\) and \(B = \frac{1}{2}\), so the perpendicular slope is \(\frac{B}{A} = \frac{3}{2}\).
```

## Hard
```task
bank: m-15640
highlight:
- "x − 4y = 24" :: Line \(s\) has slope \(\frac{1}{4}\). Line \(t\) therefore has slope \(-4\).
- "perpendicular to line s" :: Use the negative reciprocal.
- "(k,0) and (60,−k)" :: Two points on line \(t\): the slope is \(\frac{-k - 0}{60 - k}\).
explain:
Line \(s\) is \(x - 4y = 24\), so \(y = \frac{x}{4} - 6\) and its slope is \(\frac{1}{4}\). Line \(t\) is perpendicular, so its slope is the negative reciprocal, \(-4\).

Line \(t\) passes through \((k, 0)\) and \((60, -k)\), so its slope is \(\frac{-k - 0}{60 - k} = \frac{-k}{60 - k}\).

Set it equal to \(-4\): \(\frac{-k}{60 - k} = -4\). Multiply both sides by \(60 - k\): \(-k = -4(60 - k) = -240 + 4k\). Add \(k\) and 240: \(240 = 5k\), so \(k = 48\).

Check: the points are \((48, 0)\) and \((60, -48)\). The run is 12 and the rise is \(-48\), a slope of \(-4\).
```

# Equations from stories
Price times count, added up, equals the total.

```visual
linear-equations-two-var--story-equation
```

## Key ideas
\[(\text{price of item 1})\cdot x + (\text{price of item 2})\cdot y = \text{total}\]

In \(8x + 5y = 200\), \(x\) and \(y\) count items, 8 and 5 are the price of **one** of each, \(8x\) is the money spent on item 1, and 200 is the total. A number belongs to the letter it multiplies.

- Given one count, substitute it and solve for the other.
- An intercept means "none of the other item": the point \((25, 0)\) means 25 of item 1 and none of item 2, because \(8 \cdot 25 = 200\).
- "How much more is one item than the other?" asks for the difference of the two coefficients.

```example
\(8x + 5y = 200\): \(x\) T-shirts at $8 and \(y\) hats at $5. The club sold 15 T-shirts. How many hats?
1. \(8(15) + 5y = 200\) :: Put in \(x = 15\).
2. \(5y = 80\) :: Subtract 120.
3. \(y = 16\) :: Divide by 5.
```

```theory
Real SAT stories use the same pattern in many forms: tickets and prices, minutes spent on two jobs, ounces of two ingredients, points for two kinds of tokens. Always decide what \(x\) and \(y\) count, then match each coefficient to the quantity of **one** of that kind.

The right side is the total of whatever the coefficients measure. If the coefficients are prices, the total is money. If they are minutes per task, the total is minutes. Check that the units on both sides agree.

Questions ask three things. First, "if the customer bought 3 of one item, how many of the other?" Substitute and solve. Second, "what does the 6 mean?" The coefficient is the amount of the total used by one unit of that item. Third, "how much more is one item than the other?" Read the two coefficients off the equation and subtract them; you do not need to solve for anything.

Intercepts have meaning: setting \(y = 0\) says "buy only item 1", so the \(x\)-intercept is the most of item 1 you could get for the whole total. The slope is \(-\frac{8}{5}\): each extra T-shirt means \(\frac{8}{5}\), or 1.6, fewer hats.

Fractions and decimals can be the coefficients, for example \(\frac{x}{5} + \frac{y}{9} = \frac{47}{45}\). Read it the same way: \(\frac{1}{5}\) is the amount per unit of \(x\), and \(\frac{1}{9}\) the amount per unit of \(y\).
```

## Easy
```task
bank: m-0642
highlight:
- "3a + 4b = 25" :: \(a\) counts small boxes and \(b\) counts large boxes.
- "had 3 small boxes shipped" :: So \(a = 3\). Substitute it.
explain:
The equation \(3a + 4b = 25\) says: 3 dollars for each small box plus 4 dollars for each large box makes $25 in all.

The customer had 3 small boxes shipped, so \(a = 3\). Substitute: \(3(3) + 4b = 25\), which is \(9 + 4b = 25\). Subtract 9: \(4b = 16\). Divide by 4: \(b = 4\).

Check: \(9 + 16 = 25\). So 4 large boxes were shipped, choice B. Choice A, 3, is the number of small boxes, which the question already gave.
```

## Medium
```task
bank: m-0976
highlight:
- "5G + 45R = 380" :: Each coefficient is the points for one token of that colour.
- "How many more points is a red token worth than a green token" :: Subtract the two per-token values: \(45 - 5\).
explain:
In \(5G + 45R = 380\), \(G\) counts green tokens and \(R\) counts red tokens. The coefficient of each letter is the number of points that one token of that colour is worth.

So a green token is worth 5 points and a red token is worth 45 points. A red token is worth \(45 - 5 = 40\) more points.

You do not need to find \(G\) or \(R\), and the total 380 is not needed either. The answer is 40.
```

## Hard
```task
bank: m-15440
highlight:
- "x/5 + y/9 = 47/45" :: The coefficients \(\frac{1}{5}\) and \(\frac{1}{9}\) are the per-resistor amounts.
- "x resistors of type A, which each have a resistance of a ohms" :: One type A resistor contributes \(a\), so \(a\) is the coefficient of \(x\).
- "positive difference between the value of a and the value of b" :: Subtract the two coefficients.
explain:
The total resistance is \(x \cdot a + y \cdot b\), because there are \(x\) resistors of \(a\) ohms each and \(y\) resistors of \(b\) ohms each.

The given equation is \(\frac{x}{5} + \frac{y}{9} = \frac{47}{45}\), which is \(x \cdot \frac{1}{5} + y \cdot \frac{1}{9} = \frac{47}{45}\). Match the coefficients: \(a = \frac{1}{5}\) and \(b = \frac{1}{9}\). You never need to find \(x\) or \(y\): the question is about the per-resistor values.

The positive difference is \(\frac{1}{5} - \frac{1}{9} = \frac{9}{45} - \frac{5}{45} = \frac{4}{45}\), choice D. Choice B, 4, is only the numerator of the difference.
```
