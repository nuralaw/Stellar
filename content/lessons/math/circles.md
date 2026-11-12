---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read a circle's center and radius from any equation, and find arcs, sectors and tangent lines in degrees or radians.
---

## Spot a circle question

Circle questions come in two kinds:

- **An equation** in the xy-plane, like (x − 2)² + (y + 5)² = 36, asking for the center, the radius or a tangent line.
- **A figure** with a center, **arcs** (pieces of the edge) and **sectors** (pizza slices), asking for a length, an area or an angle.

The reference sheet gives A = πr², C = 2πr, and 360° = 2π radians. It does **not** give the circle equation or the arc formulas.

```quiz
A circle has a circumference of 10π. What is its area?
* 25π
- 100π :: You used 10 as the radius. 10 is the diameter: 2πr = 10π gives r = 5.
- 5π :: You forgot to square. πr² means π × 5 × 5.
> From C = 2πr: 2πr = 10π, so r = 5. Then A = πr² = π × 5² = 25π.
```

## Read the center and radius

The circle equation is

**(x − h)² + (y − k)² = r²**

with center (h, k) and radius r. Two things to watch:

- **Flip the signs.** (x + 4)² means x − (−4), so h = −4. A plain x² means h = 0.
- **The right side is r².** If it's 49, the radius is 7 and the diameter is 14.

```quiz
What are the center and radius of the circle (x − 6)² + (y + 1)² = 16?
* Center (6, −1), radius 4
- Center (−6, 1), radius 4 :: You kept the signs from inside the parentheses. Flip them: (y + 1)² means k = −1.
- Center (6, −1), radius 16 :: 16 is r². The radius is √16 = 4.
- Center (−6, 1), radius 16 :: Two slips: flip the signs, and take the square root of 16.
> (x − 6)² gives h = 6, and (y + 1)² gives k = −1. The right side is r² = 16, so r = 4.
```

## Complete the square

When the equation isn't in that form, rebuild it:

1. If x² and y² have a number in front, **divide every term** by it.
2. Group the x-terms and the y-terms. Move the plain number to the right.
3. Take half of the number in front of x, square it, and **add it to both sides**. Do the same for y.
4. Rewrite as (x − h)² + (y − k)² = r² and read the center and radius.

```quiz
x² + y² − 6x + 10y + 9 = 0 is a circle in the xy-plane. What are its center and radius?
* Center (3, −5), radius 5
- Center (−3, 5), radius 5 :: Sign slip. x² − 6x becomes (x − 3)², and (x − 3)² means h = 3.
- Center (3, −5), radius √34 :: You dropped the +9. Move it to the right first: −9 + 9 + 25 = 25.
- Center (3, −5), radius 25 :: 25 is r². The radius is √25 = 5.
> Move the 9: (x² − 6x) + (y² + 10y) = −9.
> Half of −6 is −3, and (−3)² = 9. Half of 10 is 5, and 5² = 25. Add 9 and 25 to both sides: (x − 3)² + (y + 5)² = −9 + 9 + 25 = 25.
> So the center is (3, −5) and the radius is √25 = 5.
```

## Check it in Desmos

Desmos graphs any circle exactly as typed.

- **Which equation?** Type the given one, like `x^2+y^2-6x+10y+9=0`, then a choice, like `(x-3)^2+(y+5)^2=25`. The right choice lands exactly on top.
- **Inside or outside?** Type `<` in place of `=`, and Desmos shades the inside. Then type the point, like `(1,4)`, and see where it lands.

By hand, put the point into (x − h)² + (y − k)². Less than r² means inside, equal means on the circle, more means outside.

```quiz
Is the point (1, 4) inside, on or outside the circle (x + 3)² + (y − 1)² = 25?
- Inside :: You forgot to square. (1 + 3) and (4 − 1) become 16 and 9.
* On the circle
- Outside :: You compared with 5. Compare with the right side, r² = 25.
> (1 + 3)² + (4 − 1)² = 16 + 9 = 25. That equals r², so the point is on the circle.
```

## Arcs and sectors are fractions

A **central angle** has its vertex at the center. It tells you what fraction of the circle you have:

**fraction = central angle ÷ 360°**

- Arc length = fraction × 2πr
- Sector area = fraction × πr²

Find the fraction first. Then take that much of the circumference for a length, or of the area for a slice.

```quiz
A circle has radius 6. A sector of the circle has a central angle of 120°. What is the area of the sector?
* 12π
- 4π :: That's the arc length, 1/3 of 2π × 6. A sector's area uses πr².
- 36π :: That's the whole circle. The sector is only 120/360 of it.
> 120° ÷ 360° = 1/3. The whole area is π × 6² = 36π, so the sector is 1/3 × 36π = 12π.
```

## Radians: arc length is rθ

When the central angle θ (theta) is in radians, skip the 360:

- Arc length = rθ
- Sector area = ½r²θ

> **Trap:** Never put a radian angle into a 360° formula. To switch units, use 180° = π.

```quiz
In a circle with radius 12, a central angle of 5π/6 radians cuts off an arc. How long is the arc?
* 10π
- 20π :: You used the diameter, 24. Arc length is rθ with the radius, 12.
- 60π :: That's the sector area, ½r²θ. The arc length is rθ.
> Arc length = rθ = 12 × 5π/6 = 10π.
> Check in degrees: 5π/6 is 150°, and 150/360 of the circumference 24π is also 10π.
```

## Tangent meets radius at 90°

A **tangent line** touches the circle at exactly one point. It is **perpendicular** to the radius drawn to that point.

- In a figure, that right angle lets you use a² + b² = c².
- In the xy-plane, the tangent's slope is the **negative reciprocal** of the radius's slope: flip the fraction and change the sign. A radius with slope 2/5 means a tangent with slope −5/2.

```quiz
A circle has center (2, 1). Line k is tangent to the circle at the point (5, 5). What is the slope of line k?
* −3/4
- 4/3 :: That's the slope of the radius. The tangent is perpendicular to it.
- 3/4 :: You flipped the fraction but kept the sign. Change the sign too.
- −4/3 :: You changed the sign but didn't flip the fraction.
> The radius goes from (2, 1) to (5, 5), so its slope is (5 − 1)/(5 − 2) = 4/3.
> The tangent is perpendicular to it, so its slope is the negative reciprocal, −3/4.
```

## The trap: inscribed angles

Before using an angle, check where its vertex sits. At the center, it's a central angle: use it as is. On the circle, it's an **inscribed angle**, and the central angle on the same arc is **twice** as big. An inscribed angle whose sides end at the two ends of a diameter is always 90°.

```quiz
Points A, B and C lie on a circle with radius 9, and angle ACB measures 40°. What is the length of arc AB, the arc that doesn't contain C?
* 4π
- 2π :: The trap: you used 40° as the central angle. Angle ACB is inscribed, so the central angle is 80°.
- 18π :: That's the sector area for 80°. Arc length uses 2πr, not πr².
> Vertex C is on the circle, so angle ACB is inscribed. The central angle on arc AB is 2 × 40° = 80°.
> Arc length = 80/360 × 2π × 9 = 2/9 × 18π = 4π.
```

## Your turn: easy

Find what fraction of the circle the arc is, then scale up to the whole.

```check
m-1806
```

## Your turn: medium

Complete the square, read the radius, then answer what's asked.

```check
m-16533
```

## Your turn: hard

Check the numbers in front of x² and y² before you complete the square.

```check
m-1744
```

## Recap

- Equation: aim for (x − h)² + (y − k)² = r². Divide first if needed, then complete the square on both sides.
- Flip the signs for the center. Take the square root of the right side for the radius.
- Arc or sector: central angle ÷ 360°, times 2πr or πr². In radians: rθ and ½r²θ.
- Vertex on the circle? Double the inscribed angle first.
- Tangent: perpendicular to the radius, so its slope is the negative reciprocal.
- In Desmos, graph the given equation and each choice, and look for the exact overlap.
