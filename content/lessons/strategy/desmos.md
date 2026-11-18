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

```more
A **system** is two or more equations that share the same unknowns. A solution must make every equation true at the same time. On a graph, that is the point where the lines cross. Click the gray dot at the crossing to see its coordinates.
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

# Graph both sides
Crossings solve it. Overlap shows equal.

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

```more
To **solve** an equation is to find the x that makes both sides equal. Where the two graphs cross, both sides have the same value. So the x of each crossing is a solution. A crossing can sit off the screen, so zoom out before you count.
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

## Same graph, same value

Equivalent expressions have the same value for every x. Graph both. Do the graphs overlap?

```quiz
Which expression is equivalent to (x − 2)² + 4x?
* x² + 4
- x² − 4 :: The constant is +4, because (−2)² = 4.
- x² + 8x + 4 :: That comes from (x + 2)². The sign inside is −.
> Graph each choice. Only y = x² + 4 lies exactly on top of y = (x − 2)² + 4x.
~ type y=(x-2)^{2}+4x :: Type the original.
~ type y=x^{2}-4 :: Not on top of the original: not equivalent.
~ type y=x^{2}+4 :: This one covers the original exactly.
```

# Max and min
Click the top or bottom point.

## Click the turning point

Type the function as y = …, or as f(x) = …. Other letters? Retype them as x. The max or min **value** is the point's y.

```desmos
f(x) = x² − 6x + 5. Find f(7) and the minimum value of f.
type f(x)=x^{2}-6x+5 :: Type f(x) as written. Desmos graphs it.
point (3, -4) :: Click the lowest point: (3, −4).
say :: The minimum value is y: −4. It happens at x = 3.
type f(7) :: Type f(7): Desmos shows 12.
```

```more
**f(x)** is a function. f(7) means: put 7 in for x. Type f(x) once, then type f(7) on a new line to get its value. A **maximum** is the highest value, a **minimum** the lowest. Desmos can also graph h(t) = … directly, but retyping with x and y is the safest habit.
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

```more
A **slider** is a control that changes a letter's value while you watch the graph. A **constant** is a number you do not know yet, like k. Drag the slider and look for the moment the graph does what the question describes, such as touching a line once.
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

# Tables and lists
Fit points with ~. Mean and median in one line.

## Fit a table with ~

Type `table` and enter the points. Then type a model with `~` instead of `=`, using the table's names x1 and y1.

```desmos
A line passes through (1, 5), (2, 8) and (3, 11). What is its equation?
table x_1: 1, 2, 3; y_1: 5, 8, 11 :: Enter the points in a table.
zoom -2 6 -2 14
type y_{1}\sim mx_{1}+b :: Use ~, not =. Desmos finds m = 3 and b = 2.
say :: The line is y = 3x + 2.
```

```more
A **regression** finds the line or curve that fits points best. The ~ sign tells Desmos: find the numbers that make this model fit the table. For exponential data, which grows by the same factor each step, type y1~ab^x1 and read a and b.
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

## Mean and median

A table or list holds numbers. Desmos finds a mean or a median in one line, and sorts the list for you.

```quiz
What is the median of 12, 7, 9, 15, 7 and 10?
* 9.5
- 9 :: The list has 6 numbers. Average the two middle ones.
- 10 :: That is the mean. The question asks for the median.
> Sorted: 7, 7, 9, 10, 12, 15. The middle two are 9 and 10. Their average is 9.5.
~ type L=\left[12,7,9,15,7,10\right] :: Put the data in a list called L.
~ type \median\left(L\right) :: Desmos sorts the list and shows 9.5.
~ type \mean\left(L\right) :: The mean is a different number: 10.
```

```more
The **mean** is the sum divided by how many numbers: the average. The **median** is the middle value of the sorted list. With an even count, it is the average of the two middle values. Type mean(L) or median(L) after you name a list L.
```

# Shading
Shade the inequality. Test a point.

## Shade the solutions

Type the inequality. Desmos shades where it is true. A dashed line is not included. A solid line is.

```desmos
Which point is a solution of y < 2x + 1: (0, 3), (1, 3) or (2, 4)?
type y<2x+1 :: Desmos shades the side where it is true.
point (2, 4) :: (2, 4) sits in the shading: 4 < 5.
say :: (1, 3) is on the dashed line, so it is not included.
```

```more
An **inequality** compares two sides with <, >, ≤ or ≥. A **solution** is a point that makes it true. The shaded region holds all the solutions. For < and >, the boundary line is dashed and its points are not solutions. For ≤ and ≥, it is solid and they are.
```

## Solid or dashed?

```quiz
Which point is a solution of y ≥ 3x − 2?
* (1, 1)
- (1, 0) :: It is below the line: 0 ≥ 1 is false.
- (0, −3) :: Below the line: −3 ≥ −2 is false.
> (1, 1) is on the solid line, and ≥ includes the line: 1 ≥ 1 is true.
~ type y\ge3x-2 :: A solid line: the line itself is included.
~ point (1, 1) :: On the solid line: a solution.
~ point (1, 0) :: Below the line, outside the shading: not a solution.
```

# Trap: typing slips
Press → to leave a fraction. Brackets for long exponents.

## Escape the bottom

After `/`, everything you type lands in the bottom until you press →.

```desmos
Graph y = (1/2)x + 3.
type y=\frac{1}{2x+3} :: No →: everything lands in the bottom. A curve, not a line.
type y=\frac{1}{2}x+3 :: Type `y=1/2`, press →, then `x+3`.
point (0, 3) :: A line through (0, 3). That's the right graph.
```

```more
The key → is the right arrow key. In a fraction, it moves the cursor out of the bottom part. Desmos shows your input as neat math, so always compare that picture with the question before you trust the graph.
```

## Spot the runaway

```quiz
You type `y=1/2x+3` without pressing →. What does Desmos graph?
- y = (1/2)x + 3 :: Without →, nothing leaves the bottom.
- y = 1/(2x) + 3 :: The +3 lands in the bottom too.
* y = 1/(2x + 3)
> Type `y=1/2`, press →, then `x+3`. Check the neat line Desmos shows.
~ type y=\frac{1}{2x+3} :: Without →, x+3 stays in the bottom.
~ type y=\frac{1}{2}x+3 :: With → after the 2, you get the line.
```

## Brackets in exponents

A + sign ends an exponent by itself. For a longer exponent, use brackets.

```quiz
You want the graph of y = 2^(x + 1). Which input is right?
* `y=2^(x+1)`
- `y=2^x+1` :: The + leaves the exponent. This graphs 2^x + 1.
- `y=2^x→+1` :: → also leaves the exponent. Same wrong graph.
> Brackets keep x + 1 together up in the exponent.
~ type y=2^{x+1} :: With brackets: 2^(x+1).
~ type y=2^{x}+1 :: This is 2^x + 1. The two graphs differ.
```
