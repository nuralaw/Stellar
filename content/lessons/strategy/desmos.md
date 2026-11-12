---
title: Desmos on the Digital SAT
skill: desmos
domain: strategy
section: strategy
summary: Graph the equations and read the answer off the crossing.
---

## Graph it, click the crossing

Desmos is the graphing calculator inside every Math question. **Type a system as written. The crossing point is the solution.**

```example
3x + 2y = 12 and x − y = −1. What is (x, y)?
1. Line 1: 3x + 2y = 12 :: Type it as written. No rearranging.
2. Line 2: x − y = −1 :: Each equation gets its own line.
3. Click where the lines cross :: Desmos shows the point's coordinates.
4. (x, y) = (2, 3)
```

## Answer what's asked

```quiz
2x + y = 7 and x − y = 2. In Desmos the lines cross at (3, 1). What is x + y?
* 4
- 3 :: That's only x. Add y.
- 1 :: That's only y. Add x.
> The crossing gives x = 3 and y = 1, so x + y = 4.
```

## One equation? Graph both sides

Each crossing's x-value is a solution. Zoom out before you count them.

```quiz
You graph `y=2^x` and `y=3x+1` to solve 2^x = 3x + 1. You see one crossing, at (0, 1). What now?
* Zoom out and look for more
- Answer "one solution" :: A crossing can hide off the screen.
- Switch to the scientific calculator :: It draws no graphs.
> A second crossing sits near (3.54, 11.6), often off the screen. Two solutions.
```

## Click the top point

Desmos graphs only x and y, so retype t as x. The maximum **value** is the y-coordinate.

```quiz
A ball's height in meters after t seconds is h(t) = −4.9t² + 29.4t + 2. You graph `y=-4.9x^2+29.4x+2` and click the top point: (3, 46.1). What is the maximum height?
* 46.1 meters
- 3 meters :: 3 is x: the time of the peak, in seconds.
- 2 meters :: That's the starting height, at t = 0.
> Height is y, so the maximum is 46.1. It happens at x = 3 seconds.
```

## Fit a table with ~

Type `table` and enter the values. Then type a model with `~` instead of `=`, using the table's names x1 and y1.

```quiz
A table holds points of a line. Which input makes Desmos find the slope m and the y-intercept b?
* `y1~mx1+b`
- `y1=mx1+b` :: With = Desmos fits nothing. Use ~.
- `y~mx+b` :: Use the table's names: x1 and y1.
> The ~ tells Desmos to find the m and b that fit the table's points.
```

## Trap: runaway fractions

After `/`, everything you type lands in the bottom until you press →.

```quiz
You type `y=1/2x+3` without pressing →. What does Desmos graph?
* y = 1/(2x + 3)
- y = (1/2)x + 3 :: Trap: without →, nothing leaves the bottom.
- y = 1/(2x) + 3 :: The +3 lands in the bottom too.
> Type `y=1/2`, press →, then `x+3`. Check the neat line Desmos shows.
```

## Recap

- Systems: type as written, click the crossing.
- One equation: graph both sides, zoom out, count crossings.
- Press → to leave a fraction. Use `~` to fit a table.
