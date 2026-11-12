---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read the center and radius from the equation. Find arcs and sectors.
---

# Center and radius
Flip the signs, root the right side.

## Read center and radius

**(x − h)² + (y − k)² = r²** is a circle with center (h, k) and radius r.

```example
(x − 3)² + (y + 1)² = 16. Find the center and the radius.
1. x − 3 → h = 3 :: Flip the sign.
2. y + 1 → k = −1 :: Flip the sign.
3. r² = 16 → r = 4 :: Square-root the right side.
4. Center (3, −1), radius 4
```

## Read it yourself

```quiz
(x + 5)² + (y − 2)² = 49. What are the center and the radius?
* Center (−5, 2), radius 7
- Center (5, −2), radius 7 :: You kept the signs. Flip them.
- Center (−5, 2), radius 49 :: 49 is r². Take √49.
> Flip the signs: (−5, 2). The radius is √49 = 7.
~ type (x+5)^{2}+(y-2)^{2}=49 :: Type the equation as it is.
~ zoom -17 7 -7 11
~ point (-5, 2) :: The middle of the circle: center (−5, 2).
~ point (2, 2) :: The right edge is 7 from the center: radius 7.
```

# Complete the square
Messy equation? Rebuild the two squares first.

## Build the squares

Move the plain number right. Add (half of each x and y coefficient)² to both sides.

```example
x² + y² + 4x − 2y − 4 = 0. Find the radius.
1. (x² + 4x) + (y² − 2y) = 4 :: Group x and y. Move the number.
2. (x + 2)² + (y − 1)² = 9 :: Add 4 and 1 to both sides.
3. Radius 3 :: √9 = 3.
```

## Find the radius

```quiz
x² + y² − 6x + 10y + 9 = 0. What is the radius?
* 5
- 25 :: That's r². Take the square root.
- √34 :: You dropped the +9. Move it right first.
> (x − 3)² + (y + 5)² = −9 + 9 + 25 = 25, so r = 5.
~ type x^{2}+y^{2}-6x+10y+9=0 :: No algebra: type the messy equation.
~ zoom -7 13 -13 2
~ point (3, 0) :: Click the top of the circle.
~ point (3, -10) :: Top to bottom is 10. Half of it: radius 5.
```

# Arcs and sectors
Angle ÷ 360 is your fraction of the circle.

## Take a fraction

Arc = fraction × 2πr. Sector area = fraction × πr².

```example
A circle has radius 10. A central angle is 72°. How long is its arc?
1. 72/360 = 1/5 :: The fraction of the circle.
2. 2π × 10 = 20π :: The whole circumference.
3. 1/5 × 20π = 4π :: Take the fraction.
```

## Sector area

```quiz
A circle has radius 6. A sector has a central angle of 120°. What is its area?
- 4π :: That's the arc length. Area uses πr².
* 12π
- 36π :: That's the whole circle. Take 120/360 of it.
> 120/360 = 1/3, and 1/3 × 36π = 12π.
```

# Tangent lines
A tangent meets the radius at 90°.

## Flip the radius's slope

Tangent slope = negative reciprocal of the radius's slope.

```example
A circle has center (1, 2). A line is tangent to it at (3, 3). Find the line's slope.
1. (3 − 2)/(3 − 1) = 1/2 :: Slope of the radius.
2. −2 :: Flip it, change the sign.
```

## Slope of the tangent

```quiz
A circle has center (2, 1). Line k is tangent to it at (5, 5). What is the slope of k?
* −3/4
- 4/3 :: That's the radius's slope.
- 3/4 :: Flip the fraction and change the sign.
> Radius slope: (5 − 1)/(5 − 2) = 4/3. Perpendicular: −3/4.
~ type (x-2)^{2}+(y-1)^{2}=25 :: Radius: (2, 1) to (5, 5) is 5.
~ zoom -8 12 -6 9
~ point (5, 5) :: The tangent touches here.
~ slider m = 0
~ type y-5=m(x-5) :: A line through (5, 5) with slope m.
~ slider m = 0 .. -0.75 :: At m = −0.75 it only touches: slope −3/4.
```

# Trap: inscribed angles
Vertex on the circle? Double the angle.

## Double it first

An angle with its vertex on the circle is half the central angle on the same arc.

```example
A, B and P lie on a circle with radius 6. Angle APB is 30°. How long is arc AB, the arc without P?
1. 2 × 30° = 60° :: The central angle is double.
2. 60/360 = 1/6 :: The fraction of the circle.
3. 1/6 × 12π = 2π :: Fraction × circumference.
```

## Spot the trap

```quiz
A, B and C lie on a circle with radius 9. Angle ACB is 40°. How long is arc AB, the arc without C?
- 2π :: Trap: 40° is inscribed. The central angle is 80°.
- 18π :: That's 80/360 of the area. Arcs use 2πr.
* 4π
> Central angle = 2 × 40° = 80°. Arc = 80/360 × 18π = 4π.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Find the arc's fraction of the circle, then scale.

```check
m-1806
```

## Your turn: medium

Complete the square, then read the radius.

```check
m-16533
```

## Your turn: hard

Not 1 in front of x²? Divide everything first.

```check
m-1744
```
