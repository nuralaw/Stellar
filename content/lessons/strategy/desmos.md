---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Graph the equations and read the answer off the crossing.
---

# Systems
Type both equations. Click the crossing.

## Graph it, click the crossing

Desmos is the graphing calculator inside every Math question. **Type a system as written. The crossing is the solution.**

```desmos
3x + 2y = 12 and x − y = −1. What is (x, y)?
type 3x+2y=12 :: Type it as written. No rearranging.
type x-y=-1 :: Each equation gets its own line.
point (2, 3) :: Click the crossing: (x, y) = (2, 3).
```

## Answer what's asked

```quiz
2x + y = 7 and x − y = 2. What is x + y?
- 3 :: That's only x. Add y.
- 1 :: That's only y. Add x.
* 4
> The lines cross at (3, 1): x = 3 and y = 1, so x + y = 4.
~ type 2x+y=7 :: Type both equations as they are.
~ type x-y=2
~ point (3, 1) :: Click the crossing: x = 3, y = 1.
~ say :: The question asks for x + y: 3 + 1 = 4.
```

# One equation
Graph both sides. Zoom out. Count crossings.

## Graph both sides

Graph each side as its own y. **Each crossing's x is a solution.** Zoom out before you count.

```desmos
Solve x² = 2x + 8.
type y=x^{2} :: The left side.
type y=2x+8 :: The right side.
point (-2, 4) :: One crossing on screen: x = −2.
zoom -10 10 -5 25 :: Zoom out. A second crossing was hiding.
point (4, 16) :: Two solutions: x = −2 and x = 4.
```

## Zoom before you count

```quiz
You graph `y=2^x` and `y=3x+1` to solve 2^x = 3x + 1. You see one crossing, at (0, 1). What now?
- Answer "one solution" :: A crossing can hide off the screen.
* Zoom out and look for more
- Switch to the scientific calculator :: It draws no graphs.
> A second crossing sits near (3.54, 11.6), off the screen. Two solutions.
~ type y=2^{x} :: The left side.
~ type y=3x+1 :: The right side.
~ point (0, 1) :: The only crossing you see at first.
~ zoom -5 8 -5 25 :: Zoom out.
~ point (3.538, 11.613) :: A second crossing: two solutions.
```

# Max and min
Click the top or bottom point.

## Click the turning point

Desmos graphs only x and y: retype other letters as x. The max or min **value** is the point's y.

```desmos
f(x) = x² − 6x + 5. What is the minimum value of f?
type y=x^{2}-6x+5 :: Type f(x) as y.
point (3, -4) :: Click the lowest point: (3, −4).
say :: The minimum value is y: −4. It happens at x = 3.
```

## Read the right number

```quiz
A ball's height in meters after t seconds is h(t) = −4.9t² + 29.4t + 2. What is its maximum height?
- 3 meters :: 3 is x: the time of the peak, in seconds.
- 2 meters :: That's the starting height, at t = 0.
* 46.1 meters
> The top point is (3, 46.1). Height is y, so the maximum is 46.1, at 3 seconds.
~ type y=-4.9x^{2}+29.4x+2 :: Retype t as x.
~ zoom -1 8 -10 60 :: Zoom out until you see the top.
~ point (3, 46.1) :: Click the top point: (3, 46.1).
~ say :: Height is y: 46.1 meters, at x = 3 seconds.
```

# Sliders
Unknown constant? Make it a slider and drag.

## Drag the unknown

Type the equation with the letter in it. Desmos offers a **slider**. Drag it until the graph does what the question says.

```desmos
y = x² and y = 2x + k have exactly one solution. What is k?
slider k = 3 :: Make k a slider.
type y=x^{2}
type y=2x+k :: At k = 3 the line crosses twice.
slider k = 3 .. -1 :: Drag k down until the line just touches.
point (1, 1) :: One shared point at k = −1.
```

## No solution

```quiz
2x + ky = 6 and 4x + 6y = 5 have no solution. What is k?
* 3
- 6 :: That copies the 6. Match the ratios: 2/4 = k/6.
- 12 :: Halve the 6, don't double it: 2 is half of 4.
> No solution means parallel lines: 2/4 = k/6, so k = 3.
~ slider k = 1 :: Make k a slider.
~ type 2x+ky=6
~ type 4x+6y=5 :: At k = 1 the lines cross.
~ zoom -4 6 -3 5
~ slider k = 1 .. 3 :: Drag k until the lines never meet.
~ say :: Parallel at k = 3: no solution.
```

## Exactly one

```quiz
The graph of y = x² − 4x + c touches the x-axis exactly once. What is c?
* 4
- −4 :: At c = −4 the parabola crosses the x-axis twice.
- 2 :: 2 is the x where it touches, not c.
> At c = 4, y = (x − 2)²: it touches the x-axis only at x = 2.
~ slider c = 0 :: Make c a slider.
~ type y=x^{2}-4x+c :: At c = 0 it crosses the x-axis twice.
~ slider c = 0 .. 4 :: Drag c up until the bottom sits on the axis.
~ point (2, 0) :: One touch at c = 4.
```

# Tables and regression
Enter the points. Fit them with ~.

## Fit a table with ~

Type `table` and enter the points. Then type a model with `~` instead of `=`, using the table's names x1 and y1.

```desmos
A line passes through (1, 5), (2, 8) and (3, 11). What is its equation?
table x_1: 1, 2, 3; y_1: 5, 8, 11 :: Enter the points in a table.
zoom -2 6 -2 14
type y_{1}\sim mx_{1}+b :: Use ~, not =. Desmos finds m = 3 and b = 2.
say :: The line is y = 3x + 2.
```

## Which input fits?

```quiz
A table holds points of a line. Which input makes Desmos find the slope m and the y-intercept b?
- `y1=mx1+b` :: With = Desmos fits nothing. Use ~.
* `y1~mx1+b`
- `y~mx+b` :: Use the table's names: x1 and y1.
> The ~ tells Desmos to find the m and b that fit the table's points.
~ table x_1: 0, 2, 4; y_1: 1, 7, 13 :: A table of points on a line.
~ zoom -2 6 -2 16
~ type y_{1}\sim mx_{1}+b :: With ~ Desmos shows m = 3 and b = 1.
```

## Two points are enough

```quiz
f is linear, f(2) = 7 and f(6) = 19. What is f(0)?
* 1
- 3 :: That's the slope m. f(0) is b.
- 7 :: That's f(2). The question asks for f(0).
> Slope = (19 − 7)/(6 − 2) = 3. Then 7 = 3(2) + b, so b = f(0) = 1.
~ table x_1: 2, 6; y_1: 7, 19 :: Enter the two points.
~ zoom -3 9 -3 22
~ type y_{1}\sim mx_{1}+b :: Desmos shows m = 3 and b = 1.
~ point (0, 1) :: f(0) is the y-intercept b: 1.
```

# Trap: runaway fractions
Press → to leave the fraction.

## Escape the bottom

After `/`, everything you type lands in the bottom until you press →.

```desmos
Graph y = (1/2)x + 3.
type y=\frac{1}{2x+3} :: No →: everything lands in the bottom. A curve, not a line.
type y=\frac{1}{2}x+3 :: Type `y=1/2`, press →, then `x+3`.
point (0, 3) :: A line through (0, 3). That's the right graph.
```

## Spot the runaway

```quiz
You type `y=1/2x+3` without pressing →. What does Desmos graph?
- y = (1/2)x + 3 :: Trap: without →, nothing leaves the bottom.
- y = 1/(2x) + 3 :: The +3 lands in the bottom too.
* y = 1/(2x + 3)
> Type `y=1/2`, press →, then `x+3`. Check the neat line Desmos shows.
~ type y=\frac{1}{2x+3} :: Without →, x+3 stays in the bottom.
~ type y=\frac{1}{2}x+3 :: With → after the 2, you get the line.
```
