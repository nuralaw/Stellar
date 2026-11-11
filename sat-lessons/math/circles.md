---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read the center and radius from any circle equation, complete the square, find arcs and sectors in degrees or radians, and use tangent and angle rules.
minutes: 20
---

## What this question looks like

Circle questions come in two kinds.

**Circles in the xy-plane.** You see an equation such as (x − 4)² + (y + 3)² = 49, or a messier one such as x² + y² − 8x + 6y − 24 = 0. The question asks for the center, the radius, the diameter, a missing number in the equation, whether a point is inside the circle, or a **tangent line** (a line that touches the circle at exactly one point).

**Circles in a figure.** You see a circle with its center (often called O), **radii** (segments from the center to the circle), **chords** (segments that join two points on the circle) and **arcs** (pieces of the circle itself). The question asks for an arc length, the area of a **sector** (a slice shaped like a piece of pizza), an angle, or a length.

Typical stems:

- "What are the coordinates of the center of the circle?"
- "What is the radius of the circle?"
- "What is the length of minor arc AB?"
- "The area of the circle is kπ square units. What is the value of k?"
- "Line ℓ is tangent to the circle at point P. Which of the following points lies on line ℓ?"
- "An angle measures 5π/12 radians. What is its measure in degrees?"

Circles are tested only on the SAT (not on the PSAT tests), and they are often among the harder geometry questions, especially in Module 2. Expect about one or two per test. Equation questions are common, and they are the kind where Desmos helps most.

## The method

**For an equation:**

1. **Divide first** if x² and y² have a number in front, like 3x² + 3y². Divide every term by that number.
2. **Group and move.** Put the x terms together and the y terms together, and move the plain number to the right side.
3. **Complete the square.** Take half of the number in front of x, square it, and add it to **both** sides. Do the same for y.
4. **Read the answer.** Write the equation as (x − h)² + (y − k)² = r². The center is (h, k): flip the signs you see inside the parentheses. The radius is the square root of the right side.
5. **Answer the question asked:** center, radius, diameter (2r), area (πr²) or circumference (2πr).

**For a figure:**

1. **Sketch the circle on scratch paper** and mark the center.
2. **Draw a radius to every point on the circle** that the question names. All radii are equal, so you often get an isosceles triangle.
3. **Find the central angle** (the angle at the center). If you are given an inscribed angle (vertex on the circle), double it.
4. **Turn the angle into a fraction of the circle:** the angle ÷ 360°, or the angle ÷ 2π in radians.
5. **Multiply.** Arc length = fraction × circumference. Sector area = fraction × area.
6. **Tangent line?** Draw the radius to the point where it touches. The radius and the tangent meet at a right angle, so you can use the Pythagorean theorem or slopes.

> **Key idea:** An arc or a sector is a fraction of the whole circle. Find the fraction first, then take that fraction of the circumference or of the area.

## Rules and formulas you need

### Basic facts

| Fact | Formula | On the reference sheet? |
|---|---|---|
| Area | A = πr² | yes |
| Circumference | C = 2πr, or πd | yes |
| A full circle | 360°, which equals 2π radians | yes |
| Diameter | d = 2r | no |
| Arc length (degrees) | (central angle ÷ 360°) × 2πr | no |
| Sector area (degrees) | (central angle ÷ 360°) × πr² | no |
| Arc length (radians) | s = rθ | no |
| Sector area (radians) | ½r²θ | no |

### Angles in circles

- A **central angle** (vertex at the center) has the same degree measure as the arc it cuts off.
- An **inscribed angle** (vertex on the circle) is half of the central angle that cuts off the same arc.
- An inscribed angle whose sides end at the two ends of a diameter is 90°.
- Inscribed angles that cut off the same arc are equal.
- Two radii and a chord make an isosceles triangle. If the central angle is 60°, the triangle is equilateral, and the chord equals the radius.
- A radius that is perpendicular to a chord cuts the chord in half. Then (half the chord)² + (distance from the center to the chord)² = r².
- **Arc measure vs arc length:** the arc measure is in degrees and equals the central angle. The arc length is a distance, and it also depends on the radius.

> **Tip:** Here is the whole chain with numbers. In a circle with radius 9, an inscribed angle of 40° cuts off an arc. The central angle on that arc is 2 × 40° = 80°, so the arc is 80/360 of the circle. Arc length = 80/360 × 2π(9) = 4π, and the sector area = 80/360 × π(9²) = 18π.

### Tangent lines

- A tangent line touches the circle at one point and is perpendicular (at 90°) to the radius drawn to that point.
- Two tangent segments drawn from the same outside point to a circle have equal lengths.
- In the xy-plane, the slope of the tangent is the negative reciprocal of the slope of the radius. A radius with slope 4/3 means a tangent with slope −3/4.
- A circle with center (h, k) that touches the x-axis has a radius equal to the distance from the center to that axis, so r = |k|. If it touches the y-axis, r = |h|.

### Circle equations in the xy-plane

- **Standard form:** (x − h)² + (y − k)² = r², with center (h, k) and radius r.
- **Flip the signs:** (x + 5)² means h = −5, and (y − 2)² means k = 2. Just x² means h = 0.
- **The right side is r², not r.** If it is 36, the radius is 6.
- **Completing the square:** x² + bx becomes a perfect square when you add (b/2)². For x² − 8x, add 16 to get (x − 4)².
- **Diameter endpoints given:** the center is their midpoint, and the radius is half the distance between them.
- **Inside, on or outside?** Put the point into (x − h)² + (y − k)². Less than r² means inside, equal means on the circle, and more than r² means outside.
- **Top, bottom, left and right points:** (h, k + r), (h, k − r), (h − r, k) and (h + r, k). So every point on the circle has a y-value between k − r and k + r.
- **Changing the equation:** replacing x with (x − 3) moves the circle 3 units to the right. Multiplying the radius by n multiplies the right side by n².
- After you complete the square, the right side must be positive. If it is 0 or negative, the equation is not a circle.

### Radians and the unit circle

- 180° = π radians. Multiply by π/180 to change degrees to radians, and by 180/π to change radians to degrees. For example, 150° = 150 × π/180 = 5π/6 radians.
- With θ in radians, arc length is s = rθ. One radian is the angle whose arc is exactly one radius long.
- The **unit circle** has center (0, 0) and radius 1. The point on it at angle θ, measured counterclockwise from the positive x-axis, is (cos θ, sin θ). On the left half, cos θ is negative. On the bottom half, sin θ is negative.
- Adding 2π (a full turn) brings you back to the same point.

## Worked examples

### Example 1: Writing the equation

A circle in the xy-plane has its center at (−2, 5) and passes through the point (1, 1). Which equation represents the circle?

- (A) (x − 2)² + (y + 5)² = 25
- (B) (x + 2)² + (y − 5)² = 25
- (C) (x + 2)² + (y − 5)² = 5
- (D) (x − 1)² + (y − 1)² = 25

**Solution.** The center (−2, 5) gives (x + 2)² + (y − 5)², because the signs flip. To find r², put the point (1, 1) into the left side: (1 + 2)² + (1 − 5)² = 9 + 16 = 25. So the equation is (x + 2)² + (y − 5)² = 25. Choice (A) keeps the signs of the center instead of flipping them. Choice (C) puts r = 5 where r² belongs. Choice (D) uses the point on the circle as the center.

**Answer:** (B)

### Example 2: Completing the square

What is the radius of the circle with equation 3x² + 3y² − 24x + 18y − 72 = 0?

- (A) 2√6
- (B) 5
- (C) 7
- (D) 49

**Solution.** First divide every term by 3: x² + y² − 8x + 6y − 24 = 0. Group and move the constant: (x² − 8x) + (y² + 6y) = 24. Half of −8 is −4, and (−4)² = 16. Half of 6 is 3, and 3² = 9. Add both numbers to both sides: (x² − 8x + 16) + (y² + 6y + 9) = 24 + 16 + 9. So (x − 4)² + (y + 3)² = 49. The center is (4, −3) and the radius is √49 = 7. Choice (D) is r², not r. Choice (A) is √24: it forgets to add 16 and 9 to the right side. Choice (B) drops the 24.

**Answer:** (C)

### Example 3: From an arc to the whole circle

In a circle with center O, central angle POQ measures 5π/12 radians, and minor arc PQ has a length of 5π. What is the area of the circle?

- (A) 12π
- (B) 24π
- (C) 30π
- (D) 144π

**Solution.** With radians, arc length is s = rθ. So 5π = r × 5π/12. Divide both sides by 5π/12: r = 12. The area is π(12²) = 144π. You can check in degrees: 5π/12 radians is 5π/12 × 180/π = 75°, and 75/360 of the circumference 2π(12) = 24π is 5π. It matches. Choice (B) is the circumference, not the area. Choice (C) is the area of the sector (the slice), not the whole circle. Choice (A) uses πr instead of πr².

**Answer:** (D)

### Example 4: A right angle hidden in a circle

Points A, B and C lie on a circle, and segment AB is a diameter of the circle. AC = 10 and BC = 24. The area of the circle is kπ. What is the value of k?

*Student-produced response: enter your answer.*

**Solution.** Angle ACB is an inscribed angle whose sides end at the two ends of the diameter AB, so angle ACB = 90°. That makes AB the hypotenuse of right triangle ACB: AB² = 10² + 24² = 100 + 576 = 676, so AB = 26. (This is a 5-12-13 triangle made twice as big.) The radius is half the diameter, so r = 13. The area is π(13²) = 169π, so k = 169.

**Answer:** 169

### Example 5: A tangent line in the xy-plane

A circle in the xy-plane has its center at (−1, 2) and passes through point P(4, 14). Line ℓ is tangent to the circle at P. Which of the following points lies on line ℓ?

- (A) (16, 9)
- (B) (16, 19)
- (C) (9, 2)
- (D) (9, 26)

**Solution.** The radius from the center to P has slope (14 − 2) ÷ (4 − (−1)) = 12/5. The tangent line is perpendicular to this radius, so its slope is the negative reciprocal, −5/12. Now find the slope from P to each choice. For (16, 9), the slope is (9 − 14) ÷ (16 − 4) = −5/12, which matches. For (16, 19), the slope is 5/12: flipped, but without the negative sign. For (9, 2), the slope is −12/5: negative, but not flipped. For (9, 26), the slope is 12/5, so that point is on the radius line, not the tangent.

**Answer:** (A)

### Example 6: A missing number in the equation

In the xy-plane, the graph of x² + y² − 6x + 14y + c = 0 is a circle with a radius of 8. What is the value of c?

*Student-produced response: enter your answer.*

**Solution.** Complete the square and keep c as a letter. Move c to the right: x² − 6x + y² + 14y = −c. Half of −6 is −3, and (−3)² = 9. Half of 14 is 7, and 7² = 49. Add 9 and 49 to both sides: (x − 3)² + (y + 7)² = 58 − c. The right side must equal r² = 8² = 64. So 58 − c = 64, and c = −6. A common slip is setting 58 − c equal to 8 instead of 64, which gives c = 50.

**Answer:** −6

## Traps to avoid

- **Not flipping the signs.** (x + 5)² means the center's x-coordinate is −5, not 5.
- **r² vs r.** The right side of standard form is the radius squared. Take the square root before you answer "radius," and double it for "diameter."
- **Adding to only one side.** When you complete the square, every number you add on the left must also go on the right.
- **Skipping the divide step.** With 3x² + 3y² + …, divide by 3 before completing the square.
- **Inscribed vs central angle.** The central angle equals its arc. An inscribed angle is only half.
- **Arc, sector or whole circle?** Arc length uses 2πr and sector area uses πr². Read the last line again to see whether they want the arc, the slice or the whole circle.
- **Arc measure vs arc length.** 75° is a measure. 5π is a length.
- **Degrees in a radian formula.** s = rθ works only with θ in radians. With degrees, use (angle ÷ 360°) × 2πr.
- **Tangent slope.** It is the negative reciprocal of the radius slope: flip it and change the sign. Choices that do only one of the two, or neither, are planted wrong answers.

## Desmos shortcut

Desmos is excellent for circle equations, because it graphs them exactly as they are written.

- **Center and radius without algebra.** Type the equation as given, for example `3x^2+3y^2-24x+18y-72=0`. Click the circle (zoom out if you can't see all of it). Desmos puts gray dots at the very top and very bottom of the circle, and also at every point where the circle crosses the x-axis or the y-axis. Use the top and bottom dots, (4, 4) and (4, −10). Don't confuse them with the two dots on the y-axis, (0, 2.74456) and (0, −8.74456): those are also straight above each other, but they are only where the circle cuts the axis. The center is halfway between the top and bottom points, (4, −3), and the radius is half the distance between them: (4 − (−10)) ÷ 2 = 7.
- **Check answer choices.** Type the original equation, then each choice, for example `(x-4)^2+(y+3)^2=49`. The correct choice lands exactly on top of the original circle.
- **Inside or outside.** Change = to <, for example `x^2+y^2-8x+6y-24<0`, and Desmos shades the inside. Then type the point, like `(9,1)`. A point in the shaded area is inside. A point on the dashed edge is on the circle.
- **Missing constant.** Type `x^2+y^2-6x+14y+c=0` and click "add slider" for c. Drag c until the top and bottom points are 16 apart (a diameter of 16, so a radius of 8). That happens at c = −6.
- **Tangent line.** Graph the circle and the line together, for example `(x+1)^2+(y-2)^2=169` and `12(y-14)=-5(x-4)`. Clear the fraction before you type the line: if you type `(-5/12)(x-4)`, Desmos puts (x − 4) into the denominator, even with the parentheses. A tangent touches the circle at one point and does not cut through it.
- **Unit circle point.** In degree mode, type `(cos(150),sin(150))` to plot the point at 150°, which is (−0.866, 0.5).

Desmos doesn't help much with arcs, sectors and inscribed angles in a figure. Use the fraction-of-the-circle method for those.

## Quick checklist

- Is the equation in standard form? If not, did I divide first and complete the square on both sides?
- Did I flip the signs to get the center?
- Did I take the square root of the right side for the radius?
- Is my angle a central angle before I use it for an arc or a sector?
- Degrees or radians: did I use the matching formula?
- Did they ask for the radius, diameter, arc length, sector area or the whole area?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite, version 4 (2026)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official circle testing points: equations, completing the square, the distance formula, radians and the unit circle
- [College Board: Skills Insight for the SAT Suite](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — circle properties and degree-radian conversion sit in the top score band
- [Test Ninjas: SAT Circles Question Types](https://www.test-ninjas.com/sat-circles) — the five circle sub-types, the point test and the "never mix degrees and radians" rule
- [Open Exam Prep: Circle Equations in the Coordinate Plane](https://open-exam-prep.com/study-guides/sat-math/geometry-trigonometry/circle-equations-coordinate-plane) — completing the square step by step and the divide-first trap
- [JustLockedIn: Applying Equations pattern](https://justlockedin.com/patterns/math/geometry-and-trigonometry/circles/applying-equations.html) — the y-range k − r to k + r and the n² rule when the radius is scaled
- [JustLockedIn: Tangent Lines pattern](https://justlockedin.com/patterns/math/geometry-and-trigonometry/circles/tangent-lines.html) — testing which point is on a tangent line by its slope
- [Penguin SAT Prep: Every SAT Circle Rule in 14 Minutes (YouTube)](https://www.youtube.com/watch?v=seaJGoBzcnM) — chapter list of a full circle review: radians, arcs, inscribed angles, the equation, completing the square, tangents
- [Tutorllini: Digital SAT Math Desmos Lesson #11, Equation of a Circle (YouTube)](https://www.youtube.com/watch?v=XIrg5fyIHL4) — a widely watched Desmos lesson on circle equations and checking points
- [r/Sat: Official DESMOS Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/) — the top-and-bottom-points trick for reading a circle's center and radius in Desmos
- [PrepMaven: SAT Geometry guide](https://prepmaven.com/blog/test-prep/sat-geometry/) — arc length vs arc measure, inscribed angles, and finding a diameter's endpoint from the center
