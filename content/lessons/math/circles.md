---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Write circle equations, complete the square, and find arcs and tangents.
---

# Center and radius
Flip the signs. Root the right side.

## Read the equation

**(x − h)² + (y − k)² = r²**: center (h, k), radius r. Know a point on the circle? Its distance to the center is r.

```visual
circles--center-point
```

```example
A circle has center (1, 2) and passes through (4, 6). Write its equation.
1. Distance = √(3² + 4²) = 5 :: A right triangle with legs 3 and 4.
2. r = 5, so r² = 25 :: The distance is the radius.
3. (x − 1)² + (y − 2)² = 25 :: Center (1, 2): put 1 and 2 in the brackets.
```

```more
The **xy-plane** is the plane with an x-axis and a y-axis. The **distance formula** is √((x₂ − x₁)² + (y₂ − y₁)²): the steps across and up, squared and added. In the equation the signs flip: center (−5, 2) gives (x + 5)² + (y − 2)².
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

## Equation from a point

```quiz
In the xy-plane, a circle has center (−2, 3) and passes through the point (3, 15). The equation of the circle is (x + 2)² + (y − 3)² = k. What is the value of k?
answer: 169
- 13 :: That is the radius. The equation needs r².
- 17 :: You added the distances 5 and 12. Square them first, then add.
> Across: 3 − (−2) = 5. Up: 15 − 3 = 12. k = r² = 5² + 12² = 169.
```

# Complete the square
Messy equation? Rebuild the two squares first.

## Build the squares

Move the number right. Then add (half the x-number)² to both sides. Do the same for y.

```visual
circles--tiles
```

```example
x² + y² + 4x − 2y − 4 = 0. Find the radius.
1. (x² + 4x) + (y² − 2y) = 4 :: Group x and y. Move the number.
2. (x + 2)² + (y − 1)² = 4 + 4 + 1 :: Add 2² and (−1)² to both sides.
3. (x + 2)² + (y − 1)² = 9, so r = 3 :: √9 = 3.
```

```more
Half of 4 is 2, 2² = 4. Half of −2 is −1, (−1)² = 1. Add these squares to **both** sides. Why does it work? (x + 2)² = x² + 4x + 4, so the tiles need the corner 4.
```

## Find the radius

```quiz
x² + y² − 6x + 10y + 9 = 0. What is the radius?
answer: 5
- 25 :: That is r². Take the square root.
- 34 :: You ignored the +9. Move it to the right first.
> (x − 3)² + (y + 5)² = −9 + 9 + 25 = 25, so r = 5.
~ type x^{2}+y^{2}-6x+10y+9=0 :: No algebra: type the messy equation.
~ zoom -7 13 -13 2
~ point (3, 0) :: Click the top of the circle.
~ point (3, -10) :: Top to bottom is 10. Half of it: radius 5.
```

## Not 1 in front?

A number in front of x² and y²? Divide every term by it first.

```quiz
In the xy-plane, the graph of 3x² + 3y² − 12x + 6y = 12 is a circle. What is the radius of the circle?
answer: 3
- 9 :: That is r². Take the square root.
- 2 :: You forgot to add 4 and 1 to the right side.
> Divide by 3: x² + y² − 4x + 2y = 4. Then (x − 2)² + (y + 1)² = 4 + 4 + 1 = 9, so r = 3.
~ type 3x^{2}+3y^{2}-12x+6y=12 :: Type the equation as it is.
~ zoom -4 8 -6 4
~ point (2, 2) :: Click the top of the circle.
~ point (2, -4) :: Top to bottom is 6. Half of it: radius 3.
```

# Arcs and sectors
Angle ÷ 360 is your fraction of the circle.

## Take a fraction

Arc length = fraction × 2πr. Sector area = fraction × πr². A **minor arc** is the shorter arc between two points.

```visual
circles--sector
```

```example
A circle has radius 10. A central angle is 72°. How long is its minor arc?
1. 72/360 = 1/5 :: The fraction of the circle.
2. 2π × 10 = 20π :: The whole circumference.
3. 1/5 × 20π = 4π :: Take the fraction.
```

```more
A **central angle** has its vertex at the center. The **circumference** is the distance around the circle: 2πr. A **sector** is a slice, like a slice of pizza. A full circle is 360°, so a 72° slice is 72/360 = 1/5 of it.
```

## Sector area

```quiz
A circle has radius 6. A sector of the circle has a central angle of 120°. The area of the sector is kπ square units. What is the value of k?
answer: 12
- 4 :: That is the arc length, 4π. Area uses πr².
- 36 :: That is the whole circle. Take 120/360 of it.
> 120/360 = 1/3, and 1/3 × 36π = 12π, so k = 12.
```

# Radians
π radians = 180°. Arc length is s = rθ.

## Degrees and radians

**Radians** measure angles: π radians = 180°. Multiply degrees by π/180. Arc length: **s = rθ**, with θ in radians.

```visual
circles--radians
```

```example
A circle has radius 6. A central angle is 60°. How long is its arc?
1. θ = 60 × π/180 = π/3 :: Change degrees to radians.
2. s = rθ = 6 × π/3 :: The arc-length formula.
3. s = 2π :: Same as 60/360 × 12π.
```

```more
A full circle is 2π radians, so 180° = π radians. An angle of 1 radian cuts an arc as long as the radius. The formula s = rθ works only when θ is in radians. Check with fractions: 60/360 × 12π = 2π too.
```

## Find the angle

```quiz
An arc has length 5π. The circle has radius 10. What is the central angle, in radians?
* π/2
- 50π :: You multiplied. Divide: θ = s/r.
- π/4 :: That is half the answer. A quarter circle is π/2.
> θ = s/r = 5π/10 = π/2 radians, which is 90°.
```

# Tangent lines
A tangent touches once, at 90° to the radius.

## Radius meets tangent at 90°

A **tangent** line touches a circle at one point. It is perpendicular (at 90°) to the radius there.

```visual
circles--tangent
```

```example
A circle has center (1, 2). A line is tangent to it at (3, 3). What is the slope of the line?
1. Radius slope = (3 − 2)/(3 − 1) = 1/2 :: Rise over run.
2. Tangent slope = −2 :: Flip it. Change the sign.
```

```more
**Slope** is how steep a line is: rise (up) ÷ run (across). **Perpendicular** lines meet at 90°, and their slopes multiply to −1. A circle that touches the x-axis has a radius equal to the distance from its center straight down to the axis.
```

## Tangent to an axis

A circle tangent to the x-axis: its radius is the distance from the center to the axis.

```quiz
In the xy-plane, a circle has center (5, −4) and is tangent to the x-axis. The equation of the circle is (x − 5)² + (y + 4)² = k. What is the value of k?
answer: 16
- 4 :: That is the radius. The equation needs r².
- 25 :: You used the x-coordinate. The axis is 4 below.
> The center is 4 units from the x-axis, so r = 4 and k = r² = 16.
```

## Slope of the tangent

```quiz
A circle has center (2, 1). Line k is tangent to it at (5, 5). What is the slope of k?
* −3/4
- 4/3 :: That is the radius's slope. Flip it and change the sign.
- 3/4 :: You flipped it, but the sign must change too.
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

An angle with its vertex on the circle is **half** the central angle on the same arc.

```visual
circles--inscribed
```

```example
A, B and C lie on a circle with radius 9. Angle ACB is 40°. How long is minor arc AB?
1. 2 × 40° = 80° :: The central angle is double.
2. 80/360 = 2/9 :: The fraction of the circle.
3. 2/9 × 18π = 4π :: Fraction × circumference.
```

```more
An **inscribed** angle has its vertex on the circle. A **central** angle has its vertex at the center. Both look at the same arc AB. The central angle equals the arc's measure, and the inscribed angle is half of it.
```

## Spot the trap

```quiz
A, B and C lie on a circle with radius 12. Angle ACB is 15°. How long is minor arc AB?
- π :: Trap: 15° is inscribed. The central angle is 30°.
- 4π :: You doubled twice. The central angle is 30°, not 60°.
* 2π
> Central angle = 2 × 15° = 30°. Arc = 30/360 × 24π = 2π.
```

## Find the radius

```quiz
Points A, B and C lie on a circle with center O. Angle ACB measures 30°, and the length of minor arc AB is 6π centimeters. What is the radius, in centimeters, of the circle?
answer: 18
- 36 :: You used 30° as the central angle. Double it first.
> Central angle = 60°, so the arc is 1/6 of the circumference: 2πr/6 = 6π, so r = 18.
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
