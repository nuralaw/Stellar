---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Graph, slide and fit: the Desmos moves that save SAT Math time.
---

# Systems and crossings
Type both equations. Click the crossing.

```visual
desmos
```

## Key ideas

Desmos is the graphing calculator built into the Math section of Bluebook. (You may bring your own approved calculator instead.)

For a system, **type each equation exactly as written**, one per line. You do not have to solve for \(y\) first. **The crossing is the solution**: click the gray dot there to read its coordinates.

Then **answer what the question asks**. If it asks for \(x + y\), add the two coordinates yourself.

For a system of inequalities, type each inequality. The solutions are in the **darkest overlap**. A dashed boundary line is not included, and a solid one is.

Count the crossings: one crossing is one solution, parallel lines never meet (no solution), and lines on top of each other share every point (infinitely many).

```desmos
\(3x + 2y = 12\) and \(x - y = -1\). Find \((x, y)\).
type 3x+2y=12 :: Type it as written. No rearranging.
type x-y=-1 :: Each equation gets its own line.
point (2, 3) :: Click the crossing: (2, 3).
```

```theory
A **system** is two or more equations that share the same unknowns. A **solution** is a pair \((x, y)\) that makes every equation true at once. On a graph, each equation draws a line or curve, and a point on both is a point of **intersection**. That is why the crossing is the solution: its coordinates fit both equations.

You can always check the answer by substituting it. For \(3x + 2y = 12\) and \(x - y = -1\), the point \((2, 3)\) gives \(3 \cdot 2 + 2 \cdot 3 = 12\) and \(2 - 3 = -1\). Both work.

The gray dots appear when you click or hover on a curve. If you cannot see one, zoom out, or click a little closer. A crossing can be off the screen.

Desmos works with curves, not only lines. A circle and a line can cross twice, once (a tangent) or not at all, and a parabola and a line behave in the same way. Count the crossings to count the solutions.

For inequalities, Desmos shades each one. Where two shaded regions overlap, the colour is darkest, and every point there satisfies both. You can test a point by clicking it or by substituting it.

The usual traps are answering with \(x\) when the question wants \(y\) (or their sum), and typing a sign wrongly. If the picture looks strange, check what you typed.

Desmos is not always the fastest tool. If one variable cancels at once when you add the equations, doing it by hand takes seconds.
```

## Easy
```task
\(x + 2y = 11\) and \(3x - y = 5\). What is the value of \(x + y\)?
- 3 :: That is only \(x\). The question asks for the sum.
- 4 :: That is only \(y\). The question asks for the sum.
* 7
- 12 :: You multiplied \(x\) and \(y\) instead of adding.
~ type x+2y=11 :: Type both equations as they are.
~ type 3x-y=5
~ point (3, 4) :: Click the crossing: \(x = 3\), \(y = 4\).
~ say :: The question asks for \(x + y\): \(3 + 4 = 7\).
highlight:
- "\(x + 2y = 11\) and \(3x - y = 5\)" :: Two equations form a system: graph both and find the crossing.
- "the value of \(x + y\)" :: The answer is a sum, not one coordinate.
explain:
Type both equations into Desmos exactly as they are, each on its own line. The two lines cross at \((3, 4)\), so \(x = 3\) and \(y = 4\). Check it: \(3 + 2 \cdot 4 = 11\) and \(3 \cdot 3 - 4 = 5\).

Now read the question again. It asks for \(x + y\), not for \(x\) or \(y\) alone. So add the coordinates: \(3 + 4 = 7\).

The choices 3 and 4 are the single coordinates, and 12 is their product. The answer is 7.
```

## Medium
```task
Which point is a solution to the system of inequalities \(y > 2x - 3\) and \(y < -x + 6\)?
- \((4, 6)\) :: It fails \(y < -x + 6\), because 6 is not less than 2.
- \((0, 7)\) :: It fails \(y < -x + 6\), because 7 is not less than 6.
* \((1, 2)\)
- \((3, 2)\) :: It fails \(y > 2x - 3\), because 2 is not greater than 3.
~ type y>2x-3 :: Type each inequality as written.
~ type y<-x+6
~ zoom -4 8 -2 10 :: Zoom so that the overlap is on screen.
~ point (1, 2) :: Inside the darkest overlap: a solution of both.
highlight:
- "system of inequalities" :: A solution must satisfy both inequalities at once.
- "\(y > 2x - 3\)" :: The first condition: the point must be above this line.
- "\(y < -x + 6\)" :: The second condition: the point must be below this line.
explain:
Type both inequalities into Desmos. Each one shades a region, and the **darkest overlap** holds the points that satisfy both. Only one of the four points sits inside it: \((1, 2)\).

You can confirm by substituting. For \((1, 2)\): \(2 > 2 \cdot 1 - 3 = -1\) is true, and \(2 < -1 + 6 = 5\) is true. Each other point breaks one inequality. For example, \((4, 6)\) gives \(6 < -4 + 6 = 2\), which is false.

Both lines are dashed because the signs are \(>\) and \(<\), so points on a line would not count either. The answer is \((1, 2)\).
```

## Hard
```task
In the \(xy\)-plane, the circle \(x^2 + y^2 = 25\) and the line \(y = x + 7\) intersect at two points. What is the sum of the \(y\)-coordinates of the two points?
- -7 :: That is the \(x\)-sum. The question asks for \(y\).
* 7
- 12 :: That is the product of the \(y\)-coordinates, not their sum.
- 25 :: That is \(r^2\), not a coordinate sum.
~ type x^{2}+y^{2}=25 :: Type the circle as written.
~ type y=x+7
~ zoom -8 6 -6 8 :: The line cuts the circle twice.
~ point (-3, 4) :: First crossing: \(y = 4\).
~ point (-4, 3) :: Second crossing: \(y = 3\). Sum: 7.
highlight:
- "the circle \(x^2 + y^2 = 25\) and the line \(y = x + 7\)" :: A circle and a line: graph both and read the crossings.
- "intersect at two points" :: Two crossings, so two points to read.
- "sum of the \(y\)-coordinates" :: Add only the \(y\)-values of the two points.
explain:
Type the circle \(x^2 + y^2 = 25\) and the line \(y = x + 7\) as they are. Desmos draws a circle of radius 5 and a line that cuts it in two places. Click both gray dots: \((-3, 4)\) and \((-4, 3)\).

You can check by hand. Put \(y = x + 7\) into the circle: \(x^2 + (x + 7)^2 = 25\), which simplifies to \(x^2 + 7x + 12 = 0\), so \(x = -3\) or \(x = -4\). Then \(y = 4\) or \(y = 3\).

The question asks for the sum of the \(y\)-coordinates: \(4 + 3 = 7\). The \(x\)-coordinates add to \(-7\), and the product of the \(y\)-values is 12. The answer is 7.
```

# Graph both sides
Crossings solve it. Overlap shows equal.

```visual
desmos--both-sides
```

## Key ideas

To solve an equation in \(x\), graph each side as its own \(y\). **The \(x\)-value of each crossing is a solution.**

**Zoom out before you count.** A second crossing can hide off the screen.

If one side is 0, as in \(x^2 - 5x + 6 = 0\), graph the other side as \(y = \) and click the \(x\)-intercepts (the zeros).

For **equivalent expressions**, graph the original as \(y = \), then graph each answer choice as \(y = \). The choice that lies exactly on top of the original, so that you see only one curve, is equivalent. A near miss shows two curves.

**Trap:** the solution is the \(x\)-coordinate, not the \(y\)-coordinate of the crossing.

```desmos
Solve \(x^2 - 4 = 3x\).
type y=x^{2}-4 :: The left side.
type y=3x :: The right side.
zoom -6 8 -8 20 :: Zoom out so that both crossings show.
point (-1, -3) :: First crossing: \(x = -1\).
point (4, 12) :: Second crossing: \(x = 4\).
```

```theory
To **solve** an equation means to find every \(x\) that makes the two sides equal. When you graph the left side and the right side as two separate \(y\)-values, each point where the graphs meet has the same \(y\) for both sides, which means that the sides are equal at that \(x\). That is why the \(x\) of a crossing is a solution. The \(y\) of the crossing is only the common value of the two sides.

The same idea tells you how many solutions there are. Two crossings mean two solutions, one crossing means one, and no crossing means none. For curved graphs, scan the whole picture: an exponential curve and a parabola can cross three times.

A quick alternative for an equation like \(x^2 + 3x - 4 = 0\) is to type the whole equation. Desmos then draws vertical lines at the solutions. Or type the left side as \(y\) and click the \(x\)-intercepts. Both methods give the same \(x\)-values.

Two expressions are **equivalent** if they give the same output for every \(x\). So their graphs coincide. When you graph an answer choice and it covers the original exactly, it is equivalent. When there are two curves, even if they are close, it is not. Check the whole screen, because a wrong choice can look the same near the origin and split apart farther away.

This method also works for questions that say "which value of \(x\)", for equations with absolute values, and for equations with exponents, where algebra can be slow.
```

## Easy
```task
What is the larger solution of the equation \(x^2 - 2x = 8\)?
- -2 :: That is the smaller solution. The question asks for the larger.
- 2 :: That is the sum of the two solutions, not a solution.
* 4
- 8 :: That is the right side, the \(y\)-value of the crossings.
~ type y=x^{2}-2x :: The left side.
~ type y=8 :: The right side.
~ zoom -5 7 -3 12
~ point (4, 8) :: The larger crossing: \(x = 4\).
highlight:
- "larger solution" :: Pick the greater \(x\)-value of the two crossings.
- "\(x^2 - 2x = 8\)" :: Graph each side as its own \(y\).
explain:
Graph each side of the equation as its own \(y\): \(y = x^2 - 2x\) and \(y = 8\). The parabola and the horizontal line cross at two points, \((-2, 8)\) and \((4, 8)\).

The solutions are the \(x\)-values of the crossings: \(x = -2\) and \(x = 4\). The question asks for the larger one, which is 4.

Check by hand: \(4^2 - 2 \cdot 4 = 8\). It works. The value 8 is only the common \(y\)-value, and 2 is the sum of the two solutions. The answer is 4.
```

## Medium
```task
Which expression is equivalent to \((x + 3)^2 - 2x\)?
- \(x^2 + 8x + 9\) :: You added \(2x\) instead of subtracting it.
* \(x^2 + 4x + 9\)
- \(x^2 + 6x + 9\) :: You forgot to subtract \(2x\).
- \(x^2 + 4x + 6\) :: You doubled the 3. The constant is \(3^2 = 9\).
~ type y=(x+3)^{2}-2x :: Type the original as y = ...
~ type y=x^{2}+6x+9 :: A separate curve: not equivalent.
~ type y=x^{2}+4x+9 :: This one covers the original exactly.
highlight:
- "Which expression is equivalent" :: Equivalent means the same output for every \(x\).
- "\((x + 3)^2 - 2x\)" :: The original. Graph it first, then each choice.
explain:
Type the original as \(y = (x + 3)^2 - 2x\). Then type each choice as its own \(y\). Only \(y = x^2 + 4x + 9\) lies exactly on top of the original, so you see one curve. The other choices each make a second curve.

By hand, the same result: \((x + 3)^2 = x^2 + 6x + 9\), and subtracting \(2x\) leaves \(x^2 + 4x + 9\).

The wrong choices come from usual slips. Adding \(2x\) gives \(8x\), forgetting to subtract it leaves \(6x\), and a doubled 3 gives a constant of 6. The answer is \(x^2 + 4x + 9\).
```

## Hard
```task
How many real solutions does the equation \(2^x = x^2\) have?
- 1 :: Two crossings are easy to see. Zoom out for more.
- 2 :: The graphs also cross once to the left of the \(y\)-axis.
* 3
- 4 :: Zoom out far enough and the graphs stop crossing again.
~ type y=2^{x} :: The left side.
~ type y=x^{2} :: The right side.
~ zoom -3 6 -2 18 :: Zoom out to see every crossing.
~ point (-0.767, 0.588) :: A crossing left of the axis, easy to miss.
~ point (2, 4) :: A second crossing.
~ point (4, 16) :: A third crossing.
highlight:
- "How many real solutions" :: Count crossings, not just the first one or two you see.
- "\(2^x = x^2\)" :: Graph each side: an exponential and a parabola.
explain:
Graph \(y = 2^x\) and \(y = x^2\). Near the origin you see one crossing at \((2, 4)\) and another at \((4, 16)\). That is the trap: it feels like two solutions.

Zoom out and look left of the \(y\)-axis. At \(x = -1\) the parabola is higher (1 against 0.5), but at \(x = 0\) the exponential is higher (1 against 0). So the curves must cross in between, at \(x \approx -0.77\), where both equal about 0.59.

After \(x = 4\), the exponential grows faster than the parabola, so they never meet again. That gives 3 crossings, so 3 solutions. The answer is 3.
```

# Max, min and \(f(x)\)
Click the turning point. Read the right coordinate.

```visual
desmos--turning-point
```

## Key ideas

Type the function as `y=` or as `f(x)=`. If the problem uses another letter, such as \(h(t)\), retype it with \(x\) and \(y\). That is the safest habit.

**Click the turning point** (the top or bottom of the curve). The **max or min value** is the point's \(y\). The \(x\) tells you **when** or **where** it happens. Read the question to see which one it wants.

- **Zeros** (where the function is 0): click the \(x\)-intercepts.
- **\(y\)-intercept**: where the graph crosses the \(y\)-axis.
- **Value at a number**: type `f(7)` on a new line and Desmos shows the result.

Zoom out until the whole turning point is on screen.

```desmos
A ball's height in meters, \(t\) seconds after launch, is \(h(t) = -5t^2 + 30t + 4\). What is its maximum height?
type y=-5x^{2}+30x+4 :: Retype \(t\) as \(x\).
zoom -2 10 -10 60 :: Zoom out until you see the top.
point (3, 49) :: Click the top point: \((3, 49)\).
say :: Height is \(y\): 49 meters, reached at 3 seconds.
```

```theory
A **maximum** is the highest value a function reaches, and a **minimum** is the lowest. For a parabola, this is the **vertex**, the turning point. A parabola that opens downward (a negative number in front of \(x^2\)) has a maximum, and one that opens upward has a minimum.

The vertex has two coordinates, and they answer two different questions. In \((3, 49)\), the **49** is the maximum value (the height) and the **3** is when it happens (the time). SAT questions often ask for one and offer the other as a trap. Read the last sentence: "maximum height" wants \(y\), and "at what time" wants \(x\).

A **zero** of a function is an \(x\) where the output is 0. It is also called a root or an \(x\)-intercept. The vertex always lies halfway between two zeros, so the axis of symmetry is the average of the zeros.

In function notation, \(f(7)\) means "put 7 in for \(x\)". To get it, type \(f(x)\) once, and then type \(f(7)\) on a new line.

Desmos shows gray dots for the vertex and the intercepts only after you click on the curve. If you see no dot, click the curve, or zoom in, or zoom out. When the curve opens too high or too low to show its turning point, change the window.

Word problems often use letters such as \(t\) and \(h\). Retyping them as \(x\) and \(y\) avoids errors.
```

## Easy
```task
For the function \(f(x) = x^2 - 8x + 10\), what is the minimum value of \(f\)?
- -8 :: That is the coefficient of \(x\), not the minimum.
- 4 :: That is where the minimum happens, not the minimum value.
- 10 :: That is the \(y\)-intercept, where \(x = 0\).
* -6
~ type f(x)=x^{2}-8x+10 :: Type \(f(x)\) as written.
~ zoom -4 12 -10 20
~ point (4, -6) :: Click the lowest point: \((4, -6)\).
~ say :: The minimum value is \(y = -6\).
highlight:
- "minimum value" :: The value is the \(y\)-coordinate of the lowest point.
- "\(f(x) = x^2 - 8x + 10\)" :: Type this and click the bottom of the curve.
explain:
Type \(f(x) = x^2 - 8x + 10\) into Desmos. The parabola opens upward, so its turning point is a minimum. Click the lowest point: \((4, -6)\).

The question asks for the minimum **value** of \(f\). A value is an output, so it is the \(y\)-coordinate: \(-6\). The number 4 is the \(x\) where the minimum happens.

Check by hand: \(f(4) = 16 - 32 + 10 = -6\). The choice 10 is \(f(0)\), the \(y\)-intercept, and \(-8\) is just a coefficient. The answer is \(-6\).
```

## Medium
```task
A ball's height in meters, \(t\) seconds after launch, is given by \(h(t) = -4t^2 + 32t + 5\). How many seconds after launch does the ball reach its maximum height?
- 5 :: That is the starting height, in meters.
- 32 :: That is a coefficient, not a time.
* 4
- 69 :: That is the maximum height in meters, not the time.
~ type y=-4x^{2}+32x+5 :: Retype \(t\) as \(x\).
~ zoom -2 10 -10 80 :: Zoom out until you see the top.
~ point (4, 69) :: The top is \((4, 69)\).
~ say :: Time is \(x\): 4 seconds. The height 69 is \(y\).
highlight:
- "How many seconds" :: The answer is a time, so it is an \(x\)-value.
- "maximum height" :: The turning point is the top of the curve.
- "\(t\) seconds after launch" :: \(t\) is the input. Retype it as \(x\).
explain:
Retype the function with \(x\) in place of \(t\): \(y = -4x^2 + 32x + 5\). The parabola opens downward, so the vertex is the maximum. Click it: \((4, 69)\).

The vertex gives two numbers. The \(y\)-value, 69, is the maximum height in meters. The \(x\)-value, 4, is the time at which the ball reaches it. The question asks for the number of seconds, so it wants the \(x\)-value.

Check by hand: the vertex is at \(x = -\frac{32}{2 \cdot (-4)} = 4\). The choice 5 is the starting height, and 32 is a coefficient. The answer is 4.
```

## Hard
```task
The function \(g\) is defined by \(g(x) = -(x + 2)(x - 6)\). What is the maximum value of \(g\)?
- 2 :: That is where the maximum happens, not its value.
- 4 :: That is the distance from the vertex to each zero.
- 12 :: That is \(g(0)\), the \(y\)-intercept.
* 16
~ type y=-(x+2)(x-6) :: Type it in factored form. No expanding.
~ zoom -4 8 -4 20
~ point (-2, 0) :: One zero.
~ point (6, 0) :: The other zero.
~ point (2, 16) :: The top, halfway between the zeros: \(y = 16\).
highlight:
- "\(g(x) = -(x + 2)(x - 6)\)" :: Factored form: type it exactly as it is.
- "maximum value" :: The value is the \(y\)-coordinate of the top point.
explain:
Type \(g(x) = -(x + 2)(x - 6)\) exactly as it is. The graph opens downward, because of the minus sign, and crosses the \(x\)-axis at \(-2\) and \(6\). The top of the curve is the vertex, \((2, 16)\).

The vertex lies halfway between the zeros: \(x = \frac{-2 + 6}{2} = 2\). Then \(g(2) = -(4)(-4) = 16\).

The question asks for the maximum **value**, which is the \(y\)-coordinate. The number 2 is where it happens, and 12 is \(g(0)\). The answer is 16.
```

# Sliders for constants
Unknown constant? Make it a slider.

```visual
desmos--slider
```

## Key ideas

When a problem has an unknown constant such as \(k\), type the equation **with the letter in it**. Desmos offers to **add a slider**: click it. Drag the slider (or type a value) until the graph does what the problem says: touches the axis once, passes through a point, or stops crossing a line.

Read the value of \(k\) at that moment. Use a slider when there is **one constant** and the answer is a simple number.

**Do it by hand instead** when there are several constants, the answer is an awkward fraction, or a quick rule applies, such as parallel lines having equal slopes.

**Trap:** a slider picture can look right while \(k\) is slightly off. If the graph only seems to touch, set \(k\) to the value you read and check that it works.

```desmos
The graph of \(y = x^2 - 6x + k\) touches the \(x\)-axis exactly once. What is \(k\)?
slider k = 0 :: Make \(k\) a slider.
type y=x^{2}-6x+k :: At \(k = 0\), the parabola crosses the axis twice.
slider k = 0 .. 9 :: Drag \(k\) up until the bottom sits on the axis.
point (3, 0) :: One touch at \(k = 9\).
```

```theory
A **constant** is a number that does not change, such as \(k\) in \(y = 2x + k\). In a problem, it is a number you do not know yet. A **slider** is a control that changes the constant's value while you watch the graph. Typing an unknown letter makes Desmos offer one. You can also set the slider's range, so that it moves in small steps or over a wide range.

Look for the picture that matches the words. "Touches the axis exactly once" means the graph is tangent: the vertex sits on the axis. "Has exactly one solution" means the two graphs touch at one point. "Passes through a point" means the graph goes through that point. "No solution" means the lines are parallel and never meet. "Infinitely many solutions" means the lines are on top of each other.

Sliders are good for one unknown, but they have limits. The value you read is only as exact as the picture. An answer such as \(\frac{11}{4}\) is hard to read off a slider. When there are two or three unknown constants, dragging them all at once takes a long time. For "no solution" in a system, the coefficients give the answer in one line: the ratios of the \(x\)- and \(y\)-coefficients must match, but the constants must not.

A useful rule for a quadratic with one solution: the discriminant is 0. For \(x^2 + bx + c = 0\) it is \(b^2 - 4c\), so this gives \(c = \frac{b^2}{4}\). Knowing that, you can confirm a slider answer in seconds.

Decide quickly. If you cannot see a plan for the slider within a few seconds, solve by hand or guess and flag.
```

## Easy
```task
The equation \(x^2 + 4x + k = 0\) has exactly one real solution. What is the value of \(k\)?
- -4 :: At \(k = -4\), the parabola crosses the axis twice.
- 2 :: That is half of the 4, not the value of \(k\).
* 4
- 16 :: That is \(4^2\). Divide by 4: \(k = \frac{16}{4}\).
~ slider k = 0 :: Make \(k\) a slider.
~ type y=x^{2}+4x+k :: At \(k = 0\), it crosses the \(x\)-axis twice.
~ slider k = 0 .. 4 :: Drag \(k\) up until the bottom touches the axis.
~ point (-2, 0) :: One touch at \(k = 4\).
highlight:
- "exactly one real solution" :: One solution means the parabola only touches the \(x\)-axis.
- "\(x^2 + 4x + k = 0\)" :: Graph the left side with \(k\) as a slider.
explain:
Graph \(y = x^2 + 4x + k\) with \(k\) as a slider. The equation \(x^2 + 4x + k = 0\) asks where the graph meets the \(x\)-axis. Exactly one solution means the parabola only touches the axis, so its bottom point sits on it.

Drag \(k\) from 0 upward. At \(k = 4\) the vertex is exactly on the axis, at \((-2, 0)\).

Check by hand: \(x^2 + 4x + 4 = (x + 2)^2\), which is 0 only at \(x = -2\). The discriminant also agrees: \(16 - 4k = 0\) gives \(k = 4\). The answer is 4.
```

## Medium
```task
In the \(xy\)-plane, the graphs of \(y = x^2\) and \(y = 4x + k\) intersect at exactly one point. What is the value of \(k\)?
- 4 :: Right size, wrong sign. The line must move down.
- 2 :: That is the \(x\)-coordinate of the touching point, not \(k\).
* -4
- 16 :: That is the discriminant of \(x^2 - 4x - k\) at \(k = 0\).
~ slider k = 0 :: Make \(k\) a slider.
~ type y=x^{2}
~ type y=4x+k :: At \(k = 0\), the line crosses the parabola twice.
~ zoom -4 8 -6 12
~ slider k = 0 .. -4 :: Drag \(k\) down until the line only touches.
~ point (2, 4) :: One shared point at \(k = -4\).
highlight:
- "intersect at exactly one point" :: One shared point means the line is tangent to the parabola.
- "\(y = 4x + k\)" :: Make \(k\) a slider and watch the line move.
explain:
Type \(y = x^2\) and \(y = 4x + k\), and make \(k\) a slider. At \(k = 0\) the line passes through the origin and crosses the parabola twice. Drag \(k\) downward, which moves the line down. At \(k = -4\), the line just touches the parabola, at \((2, 4)\).

By hand, set \(x^2 = 4x + k\), so \(x^2 - 4x - k = 0\). One solution means the discriminant is 0: \(16 + 4k = 0\), so \(k = -4\).

The line moves down, so \(k\) is negative. The answer is \(-4\).
```

## Hard
```task
The system \(3x + ky = 12\) and \(9x + 6y = 5\) has no solution. What is the value of \(k\)?
- 6 :: That copies the 6 from the second equation.
- 9 :: That copies the 9 from the second equation.
* 2
- 18 :: You flipped the ratio. It is \(\frac{3}{9} = \frac{k}{6}\).
~ slider k = 1 :: Make \(k\) a slider.
~ type 3x+ky=12
~ type 9x+6y=5 :: At \(k = 1\), the lines cross.
~ zoom -6 6 -4 8
~ slider k = 1 .. 2 :: Drag \(k\) to 2 and the lines stop meeting.
highlight:
- "has no solution" :: No solution means the lines are parallel.
- "\(3x + ky = 12\) and \(9x + 6y = 5\)" :: Compare the \(x\)-coefficients and the \(y\)-coefficients.
explain:
You can drag \(k\) in Desmos until the lines look parallel: at \(k = 2\) they never meet. But a quicker route is by hand, because parallel lines have equal slopes.

Match the ratios of the coefficients: \(\frac{3}{9} = \frac{k}{6}\), so \(k = 2\). The constants must not match in the same ratio, or the lines would be the same line. Here \(\frac{12}{5}\) is not \(\frac{1}{3}\), so the lines are parallel, not identical.

A slider works, but it is slower for this kind of question, and it can mislead if the answer is an awkward fraction. The answer is 2.
```

# Tables and regression
Fit points with ~ and read the constants.

```visual
desmos--regression
```

## Key ideas

When a problem gives points and asks for an equation, let Desmos find the constants.

1. Add a **table**. Name the columns `x1` and `y1`, and enter the points.
2. Type a model with **`~`** (tilde) instead of `=`. It looks for the constants that make the model fit.
3. Read the constants Desmos shows.

Models to type: a line is `y1~mx1+b`, an exponential is `y1~ab^x1`, and a quadratic is `y1~ax1^2+bx1+c`.

Use `x1` and `y1`, not `x` and `y`. A line or an exponential needs **2 points**, and a quadratic needs **3**. The fit is exact when the report shows \(R^2 = 1\) or an error of 0.

```desmos
A line passes through \((1, 7)\), \((3, 13)\) and \((4, 16)\). What is its equation?
table x_1: 1, 3, 4; y_1: 7, 13, 16 :: Enter the points in a table.
zoom -2 8 -2 20
type y_{1}\sim mx_{1}+b :: Use ~, not =. Desmos finds m = 3 and b = 4.
say :: The line is \(y = 3x + 4\).
```

```theory
A **regression** finds the constants of a model, such as the slope and intercept of a line, that fit a set of points as well as possible. The tilde `~` tells Desmos: "do not draw this, find the numbers that make it fit". With `=`, every letter must already be known, and Desmos draws a graph. With `~`, the unknown letters can be anything except \(x\) and \(y\), and Desmos solves for them.

Which model? Read the problem. A constant rate of change means a line. A quantity that is multiplied by the same factor each step means an exponential, \(y = a \cdot b^x\), where \(a\) is the starting value and \(b\) is the factor. A quantity with a turning point means a quadratic. Typing the wrong model gives a poor fit, which you can see in the report.

How many points? A line has 2 unknowns, so 2 points are enough. An exponential also needs 2. A quadratic has 3 unknowns, \(a\), \(b\) and \(c\), so it needs 3 points. If you are given only the two zeros of a parabola, a regression cannot find it. Use \(y = a(x - p)(x - q)\) with a third point, or solve by hand.

The names `x1` and `y1` are required because they are **constants** (lists of data), while \(x\) and \(y\) are **variables**. The same trick works for other letters, and the table can also be typed as a list.

Before you trust the result, look at the fit. If you used exactly the right number of points, the match is perfect. If the report shows an error that is not 0, you may have chosen the wrong model, typed a point wrongly, or the data is only approximate, as in a line of best fit for a scatterplot.

Then answer the actual question: the equation, one constant, or a value of the function.
```

## Easy
```task
The points \((2, 11)\) and \((5, 20)\) lie on a line with equation \(y = mx + b\). What is the value of \(m\)?
- \(\frac{1}{3}\) :: You divided the change in \(x\) by the change in \(y\).
- 5 :: That is the \(y\)-intercept \(b\), not the slope.
* 3
- 9 :: That is the change in \(y\). Divide by the change in \(x\).
~ table x_1: 2, 5; y_1: 11, 20 :: Enter the two points.
~ zoom -2 8 -2 24
~ type y_{1}\sim mx_{1}+b :: Desmos finds \(m = 3\) and \(b = 5\).
highlight:
- "The points \((2, 11)\) and \((5, 20)\)" :: Two points are enough to find a line.
- "the value of \(m\)" :: \(m\) is the slope, not the intercept.
explain:
Add a table with the points \((2, 11)\) and \((5, 20)\), then type `y1~mx1+b`. Desmos reports \(m = 3\) and \(b = 5\).

By hand, the slope is the change in \(y\) over the change in \(x\): \(\frac{20 - 11}{5 - 2} = \frac{9}{3} = 3\). Then \(11 = 3 \cdot 2 + b\) gives \(b = 5\).

The question asks for \(m\), the slope. The choice 5 is the intercept \(b\), and 9 is the change in \(y\) before dividing. The answer is 3.
```

## Medium
```task
For an exponential function \(f(x) = a \cdot b^x\), \(f(1) = 12\) and \(f(2) = 36\). What is the value of \(f(0)\)?
- 3 :: That is \(b\), the growth factor, not \(f(0)\).
* 4
- 6 :: You halved 12. Divide by \(b = 3\), not 2.
- 12 :: That is \(f(1)\), not \(f(0)\).
~ table x_1: 1, 2; y_1: 12, 36 :: Enter the two known values.
~ type y_{1}\sim ab^{x_{1}} :: Desmos finds \(a = 4\) and \(b = 3\).
~ say :: \(f(0) = a \cdot b^0 = a = 4\).
highlight:
- "\(f(1) = 12\) and \(f(2) = 36\)" :: Two points on an exponential: enter them in a table.
- "the value of \(f(0)\)" :: \(f(0)\) is the starting value \(a\).
explain:
Two points are enough for an exponential. Add a table with \((1, 12)\) and \((2, 36)\) and type `y1~ab^x1`. Desmos finds \(a = 4\) and \(b = 3\).

Now use what the question asks: \(f(0) = a \cdot b^0 = a \cdot 1 = 4\). The starting value is \(a\), because any number to the power 0 is 1.

By hand: \(\frac{f(2)}{f(1)} = \frac{36}{12} = 3 = b\), and then \(a = \frac{12}{3} = 4\). The choice 3 is the factor and 12 is \(f(1)\). The answer is 4.
```

## Hard
```task
The quadratic function \(g(x) = ax^2 + bx + c\) passes through the points \((0, 3)\), \((1, 6)\) and \((2, 11)\). What is the value of \(g(4)\)?
- 18 :: That is \(g(3)\), not \(g(4)\).
- 24 :: That is \(g(4)\) without the constant term.
* 27
- 38 :: That is \(g(5)\), not \(g(4)\).
~ table x_1: 0, 1, 2; y_1: 3, 6, 11 :: Three points fit a quadratic.
~ type y_{1}\sim ax_{1}^{2}+bx_{1}+c :: Desmos finds \(a = 1\), \(b = 2\), \(c = 3\).
~ type y=x^{2}+2x+3 :: Type the fitted equation.
~ zoom -3 6 -2 30
~ point (4, 27) :: \(g(4) = 27\).
highlight:
- "passes through the points \((0, 3)\), \((1, 6)\) and \((2, 11)\)" :: Three points make a quadratic regression possible.
- "the value of \(g(4)\)" :: Find the equation first, then put in \(x = 4\).
explain:
Add a table with the three points and type `y1~ax1^2+bx1+c`. A quadratic has three unknown constants, and three points give exactly enough information. Desmos finds \(a = 1\), \(b = 2\) and \(c = 3\), so \(g(x) = x^2 + 2x + 3\).

Now put in 4: \(g(4) = 16 + 8 + 3 = 27\).

By hand: \(g(0) = 3\) gives \(c = 3\). Then \(a + b = 3\) from \(g(1) = 6\), and \(4a + 2b = 8\) from \(g(2) = 11\). Solving gives \(a = 1\), \(b = 2\). The choice 18 is \(g(3)\) and 38 is \(g(5)\). The answer is 27.
```

# Lists and restrictions
Brackets pair items. Braces limit values.

```visual
desmos--lists-restrictions
```

## Key ideas

Three moves for harder problems:

**Restriction `{ }`.** Add a condition after a formula to keep only part of it. With a regression, it chooses the answer that fits the words, such as "\(a\) is positive": `y1~ax1^2+bx1+c{a>0}`.

**List regression `[ ]`.** To solve a system, put the left sides in one list and the right sides in another. The items pair up in order: `[x1+2y1,3x1-y1]~[10,2]` finds `x1` and `y1` at once. Never type the equations on separate lines.

**Identity.** For "equivalent for every \(x\)" with unknown constants, type `expression~target`, then `x1=[1...100]`. Desmos must make it true for 100 values of \(x\), so the constants are exact.

```desmos
\((x + 2)(ax + 3)\) is equivalent to \(4x^2 + 11x + 6\). What is \(a\)?
type (x_{1}+2)(ax_{1}+3)\sim4x_{1}^{2}+11x_{1}+6 :: Use ~, and name the variable x1.
type x_{1}=\left[1...100\right] :: Now it must work for 100 values of x.
say :: Desmos finds \(a = 4\).
```

```theory
Square brackets make a **list**: a row of values such as `[2,5,9]`. Curly braces make a **restriction**: a condition that limits where a formula applies, as in `y=2x{x>0}`, which draws the line only for positive \(x\).

**Why one list for the whole system?** A list regression fits all the pairs together. If you type `x1+2y1~10` and `3x1-y1~2` on two lines, Desmos fits each line separately, and the answers may not agree. In a list, the first item on the left pairs with the first item on the right, the second with the second, and so on. That is why the sides must be in the same order.

**Why 100 values?** An identity must hold for every \(x\). If you give Desmos only one \(x1\), many different constants fit. A long list makes only the true constants work. Any list of many different values would do, but `[1...100]` is quick to type.

Lists also hold data. After `L=[12,7,9,15,7,10]`, the input `median(L)` gives 9.5 and `mean(L)` gives 10, and Desmos does not need the list sorted first. For function values, `f([1,3])~[5,9]` after `f(x)=kx+b` finds \(k = 2\) and \(b = 3\), because \(f(1) = 5\) and \(f(3) = 9\).

A regression can only be exact when the information agrees. If the report shows an error that is not 0, check that you typed the data and the model correctly.

Constants have to be letters other than \(x\) and \(y\) (and not \(e\)). Names such as \(a\), \(b\), \(c\), `x1` and `y1` work.
```

## Easy
```task
A question says that the constant \(a\) is positive. After you type a regression, which addition tells Desmos to keep only positive values of \(a\)?
- `[a>0]` :: Square brackets make lists. Conditions go in curly braces.
* `{a>0}`
- `(a>0)` :: Round brackets only group things. They do not set a condition.
- `a>0~` :: The tilde goes between the two sides of the regression.
~ type y=x^{2}\left\{x>0\right\} :: Braces after a formula keep only the part where \(x > 0\).
~ say :: After a regression, add `{a>0}` the same way. Braces hold conditions.
highlight:
- "the constant \(a\) is positive" :: This is a condition on \(a\).
- "keep only positive values" :: A condition on a value goes in curly braces.
explain:
A condition on a value is a **restriction**, and restrictions go in curly braces after the formula. To keep only positive \(a\), add `{a>0}`.

Square brackets, as in `[a>0]`, make lists. Round brackets only group terms. And the tilde `~` belongs between the two sides of the regression, so `a>0~` makes no sense.

The restriction is helpful when a regression has more than one solution and the question says which one it wants, for example "\(a\) is positive" or "\(a > 1\)". The answer is `{a>0}`.
```

## Medium
```task
The system \(x + 2y = 10\) and \(3x - y = 2\) is entered into Desmos. Which single input finds \(x\) and \(y\) at once?
- `x1+2y1~10` and `3x1-y1~2` on two lines :: Separate lines fit each equation alone, not both together.
- `[x1+2y1,10]~[3x1-y1,2]` :: This pairs the wrong things. Put left sides together.
* `[x1+2y1,3x1-y1]~[10,2]`
- `x+2y~10` :: \(x\) and \(y\) are variables. Use `x1` and `y1`.
~ type \left[x_{1}+2y_{1},3x_{1}-y_{1}\right]\sim\left[10,2\right] :: Left sides in one list, right sides in the other.
~ say :: Desmos finds \(x1 = 2\) and \(y1 = 4\).
highlight:
- "The system \(x + 2y = 10\) and \(3x - y = 2\)" :: Two equations in two unknowns: put them in lists.
- "Which single input" :: One input for the whole system, not one per equation.
explain:
For a system, put all the left sides in one list and all the right sides in another, in the same order. The first item on the left equals the first on the right, and the second equals the second: `[x1+2y1,3x1-y1]~[10,2]`.

Separate lines fit each equation alone, so they would not find one pair that fits both. The list with `[x1+2y1,10]` mixes sides, and `x` and `y` cannot be found by a regression because they are variables.

Desmos finds \(x1 = 2\) and \(y1 = 4\). Check: \(2 + 8 = 10\) and \(6 - 4 = 2\). The correct input is `[x1+2y1,3x1-y1]~[10,2]`.
```

## Hard
```task
\((x + 3)(ax - 2)\) is equivalent to \(5x^2 + bx - 6\), where \(a\) and \(b\) are constants. What is the value of \(b\)?
- 5 :: That is \(a\), not \(b\).
- 8 :: You added 3 and 5. The \(x\)-term is \(3a - 2\).
- 15 :: You forgot to subtract 2: \(3a - 2\), not \(3a\).
* 13
~ type (x_{1}+3)(ax_{1}-2)\sim5x_{1}^{2}+bx_{1}-6 :: Constants \(a\) and \(b\) are unknown. Use x1.
~ type x_{1}=\left[1...100\right] :: The identity must hold for 100 values of x.
~ say :: Desmos shows \(a = 5\) and \(b = 13\).
highlight:
- "is equivalent to" :: Equivalent means equal for every \(x\), the identity setup.
- "where \(a\) and \(b\) are constants" :: Two unknown constants: let Desmos find both.
- "the value of \(b\)" :: The answer is \(b\), not \(a\).
explain:
Type the identity as a regression and give \(x1\) a long list: `(x1+3)(ax1-2)~5x1^2+bx1-6`, then `x1=[1...100]`. Desmos finds \(a = 5\) and \(b = 13\).

By hand, expand: \((x + 3)(ax - 2) = ax^2 + (3a - 2)x - 6\). Matching the \(x^2\) terms gives \(a = 5\). Matching the \(x\) terms gives \(b = 3a - 2 = 3 \cdot 5 - 2 = 13\).

The choice 5 is \(a\). The choice 15 forgets the \(-2\). And 8 adds instead of working out \(3a - 2\). The answer is 13.
```

# Settings and typing
Right button, right unit, right arrow.

```visual
desmos--settings-typing
```

## Key ideas

**Fraction or decimal.** Desmos shows results as decimals. Click the fraction/decimal button next to a result to switch. Use it when the answer choices are fractions.

**Degrees or radians.** Open the wrench (Graph Settings) and choose the angle unit. If a problem uses \(^\circ\), pick degrees. If it uses \(\pi\), pick radians. In radians, `sin(30)` is \(-0.988\), and in degrees it is 0.5.

**Typing.** After `/`, everything you type stays in the denominator until you press **→** (the right arrow key). An exponent ends at `+`, `-` or `=`, or at →. For a longer exponent, use brackets: `2^(x+1)`. Always compare the picture Desmos shows with the problem.

**Not everything needs Desmos.** Use pencil when a rule is quicker, for example the product of the solutions of a quadratic is \(\frac{c}{a}\).

```desmos
Graph \(y = \frac{1}{2}x + 3\).
type y=\frac{1}{2}x+3 :: Type 1/2, press the right arrow, then x+3.
point (0, 3) :: A line through \((0, 3)\), as the problem says.
say :: Check the shape against the problem before using it.
```

```theory
Desmos draws what you type, not what you mean. So typing is a skill. A **fraction** has a top and a bottom, and when you type `/`, Desmos moves the cursor into the bottom. Everything you type next stays there, so `y=1/2x+3` is read as \(y = \frac{1}{2x + 3}\). Press → to step out of the denominator before you type `x+3`. An **exponent** works the same way, but it also ends by itself at a `+`, `-` or `=` sign. So `2^x+1` is \(2^x + 1\), and for \(2^{x+1}\) you need brackets: `2^(x+1)`. A square root opens when you type `sqrt`, and you press → to close it.

The **fraction/decimal button** appears beside a numeric result. It helps when the SAT choices are fractions, and it gives an exact fraction for a repeating decimal, such as \(\frac{2}{3}\). It also helps with the answer box, which accepts fractions.

**Radians and degrees** are two units for angles. A full circle is \(360^\circ\) or \(2\pi\) radians. Desmos starts in radians, so \(\sin(30)\) means the sine of 30 radians, which is \(-0.988\). For \(\sin 30^\circ\), switch to degrees in the wrench menu, and you get 0.5. Switch back if a later question uses \(\pi\).

When is pencil quicker? Prep books list a few cases: a system where one variable cancels at once, problems with fractions that need a common denominator, a parabola when only the zeros are given, the product of solutions (\(\frac{c}{a}\)), many unknown constants, and "no solution" questions that have an awkward answer. If you do not see a Desmos route in a few seconds, use algebra.
```

## Easy
```task
Desmos shows the result 0.875, but the answer choices on the test are fractions. What is the fastest way to see the matching fraction?
- Round the decimal to 0.88 and guess :: Rounding loses the exact value.
- Switch to degrees in the settings :: Degrees change angle units, not fractions.
* Click the fraction/decimal button next to the result
- Zoom out until a fraction appears :: Zooming changes the graph window, not the result.
~ type 0.875 :: Desmos shows the decimal.
~ say :: Click the fraction/decimal button beside the result to see 7/8.
highlight:
- "the answer choices on the test are fractions" :: The choices need an exact fraction.
- "fastest way" :: Desmos has a one-click switch.
explain:
Desmos displays results as decimals, but it has a fraction/decimal button that appears next to a numeric result. Clicking it changes 0.875 into \(\frac{7}{8}\), which you can match with the choices.

Rounding to 0.88 loses the exact value. The degrees setting only changes how angles are measured, and zooming only changes the graph window. Neither one touches the result.

The button also helps with typed answers, because the answer box accepts fractions that fit. The answer is to click the fraction/decimal button.
```

## Medium
```task
A student types sin(30) into Desmos to find the sine of \(30^\circ\), and Desmos shows -0.988. What is the most likely cause?
- She typed the 30 in the wrong place :: The input is fine. The unit is wrong.
* Desmos is set to radians, not degrees
- Sine is always negative in Desmos :: The sine of \(30^\circ\) is 0.5, which is positive.
- The calculator needs a larger window :: The window does not change a calculated value.
~ type \sin\left(30\right) :: In radians mode this shows -0.988.
~ say :: In the wrench menu, choose degrees: then it shows 0.5.
highlight:
- "sine of \(30^\circ\)" :: The degree sign says the angle is in degrees.
- "shows -0.988" :: The correct value, 0.5, is positive. The unit setting is off.
explain:
The sine of \(30^\circ\) is 0.5. Desmos starts in radians, so `sin(30)` means the sine of 30 **radians**, which is about -0.988. That number is what the student sees.

To fix it, open the wrench (Graph Settings) and choose degrees. Then `sin(30)` gives 0.5. If a later problem uses \(\pi\), switch back to radians.

The input itself was fine, and the window size does not change a calculated value. The answer is that Desmos is set to radians.
```

## Hard
```task
Which keystrokes graph \(y = \frac{3}{x} + 2\) in Desmos, where \(+2\) is added to the fraction \(\frac{3}{x}\)?
- `y=3/x+2` :: The +2 stays in the denominator: this is \(\frac{3}{x + 2}\).
* `y=3/x→+2`
- `y=3/(x+2)` :: This is \(\frac{3}{x + 2}\), with a different denominator.
- `y=3x+2` :: This is a line, not a fraction.
~ type y=\frac{3}{x}+2 :: Press the right arrow after x, then type +2.
~ zoom -6 6 -4 8
~ point (1, 5) :: The curve passes through \((1, 5)\), which fits \(\frac{3}{1} + 2\).
highlight:
- "\(y = \frac{3}{x} + 2\)" :: Only the 3 is divided by \(x\). The 2 is added after.
- "\(+2\) is added to the fraction" :: The +2 must be outside the denominator.
explain:
After you type `/`, Desmos keeps everything in the denominator until you press the right arrow. So `y=3/x+2` is read as \(y = \frac{3}{x + 2}\), with the +2 inside the denominator. That is not the graph you want.

To keep the +2 outside, press → after the \(x\): `y=3/x→+2`. Check the picture Desmos shows: a fraction \(\frac{3}{x}\) followed by \(+ 2\), not \(\frac{3}{x + 2}\).

A test point helps: at \(x = 1\), \(\frac{3}{1} + 2 = 5\), so the graph should pass through \((1, 5)\). The correct keystrokes are `y=3/x→+2`.
```
