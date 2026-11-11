---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read a circle's center and radius from any equation, and find arc lengths, sector areas, angles and tangent lines without mixing up r and r² or degrees and radians.
minutes: 11
---

## What this question looks like

Circle questions come in two flavors.

**Circles in the xy-plane.** You see an equation like `(x − 2)² + (y + 7)² = 16` or a messier one like `x² + y² + 6x − 10y = 2`. The question asks for the center, the radius, the diameter, a missing coefficient, whether a point is inside the circle, or the line that touches the circle at one point.

**Circles in a figure.** You see a circle with a center O, some radii, chords (segments joining two points on the circle) or arcs (pieces of the edge). The question asks for an arc length, a sector area (a "pizza slice"), an angle, or a conversion between degrees and radians.

Expect about 1–3 circle questions per test. The equation type shows up most often and is a favorite for the harder second module.

## The method

**For an equation:**

1. **Get it into standard form** `(x − h)² + (y − k)² = r²`. If it's already there, skip ahead. If not, complete the square (step 2).
2. **Complete the square.** Make sure x² and y² both have coefficient 1 (divide everything if not). Group the x terms and the y terms, and move the plain number to the right side. For each group, take half the middle coefficient, square it, and add it to **both** sides.
3. **Read the center with flipped signs.** `(x + 4)²` means h = −4. `(y − 3)²` means k = 3.
4. **Take the square root** of the right side to get r.
5. **Answer the actual question.** Center? Radius? Diameter (2r)? Area (πr²)?

**For a figure:**

1. **Mark every radius as the same length.** Many hard questions hide an isosceles triangle made of two radii.
2. **Find the central angle** (the angle at the center). If you're given an inscribed angle (vertex on the circle), double it.
3. **Turn the angle into a fraction of the circle**: angle/360 in degrees, or angle/(2π) in radians.
4. **Multiply that fraction** by the circumference (for arc length) or by the area (for sector area).

> **Key idea:** An arc or sector is just a fraction of the whole circle. Find the fraction, then take that fraction of the full circumference or full area.

## Rules and formulas you need

The reference sheet gives you only the area `A = πr²`, the circumference `C = 2πr`, and the facts that a circle has 360° and 2π radians. Everything else in this table you must know yourself.

| Rule | Formula or fact |
|---|---|
| Standard form | `(x − h)² + (y − k)² = r²`, center (h, k), radius r |
| Completing the square | `x² + bx` becomes `(x + b/2)² − (b/2)²` |
| Arc length (degrees) | (θ/360) × 2πr |
| Sector area (degrees) | (θ/360) × πr² |
| Arc length (radians) | s = rθ |
| Sector area (radians) | ½r²θ |
| Degrees to radians | multiply by π/180 (so 180° = π) |
| Inscribed angle | half of the central angle on the same arc |
| Angle in a semicircle | an inscribed angle that stands on a diameter is 90° |
| Tangent line | perpendicular to the radius at the touching point |
| Point test | plug the point into the left side: less than r² is inside, equal is on, greater is outside |

Handy extra facts:

- **Diameter endpoints given?** The center is their midpoint, and the radius is half the distance between them.
- **Circle tangent to the x-axis?** The radius equals the distance from the center to the axis, so r = |k|. Tangent to the y-axis means r = |h|.
- **A radius that's perpendicular to a chord cuts that chord in half.** This often creates a right triangle you can solve with the Pythagorean theorem.
- **One radian** is the angle whose arc is exactly one radius long. That's why arc length in radians is simply s = rθ.

> **Trap:** The number on the right side of standard form is r², not r. If you see `= 49`, the radius is 7.

## Worked examples

### Example 1: Completing the square

The equation `x² + y² + 10x − 4y + 4 = 0` defines a circle in the xy-plane. What are the center and radius of the circle?

- (A) center (5, −2), radius 5
- (B) center (−5, 2), radius 25
- (C) center (−5, 2), radius 5
- (D) center (−5, 2), radius √21

**Solution**

Group and move the constant: `(x² + 10x) + (y² − 4y) = −4`.

Half of 10 is 5, and 5² = 25. Half of −4 is −2, and (−2)² = 4. Add both to each side:

`(x² + 10x + 25) + (y² − 4y + 4) = −4 + 25 + 4`

`(x + 5)² + (y − 2)² = 25`

Flip the signs to get center (−5, 2). The radius is √25 = 5.

(A) keeps the signs from inside the parentheses. (B) reports r² as the radius. (D) forgets to add the 4 to the right side, leaving 21.

**Answer:** (C)

### Example 2: From an inscribed angle to an arc

Points A, B and C lie on a circle with center O and radius 12. Inscribed angle ACB measures 35°, and point C is not on minor arc AB. What is the length of minor arc AB?

- (A) 7π/3
- (B) 14π/3
- (C) 28π/3
- (D) 28π

**Solution**

The inscribed angle is half the central angle on the same arc, so central angle AOB = 2 × 35° = 70°.

The arc is 70/360 of the circle. The full circumference is 2π(12) = 24π.

Arc length = `(70/360) × 24π = 1680π/360 = 14π/3`.

(A) uses 35° as if it were the central angle. (C) doubles twice and uses 140°. (D) is the sector *area*, (70/360) × 144π, not the arc length.

**Answer:** (B)

> **Tip:** The same idea in radians is even quicker. For a circle with radius 9 and central angle 2π/3 radians, the arc is s = 9 × 2π/3 = 6π and the sector area is ½ × 81 × 2π/3 = 27π. No 360 anywhere.

### Example 3: Tangent line

The circle `(x − 3)² + (y + 1)² = 25` passes through the point (6, 3). Which equation is the line tangent to the circle at (6, 3)?

- (A) `y = (4/3)x − 5`
- (B) `y = −(3/4)x + 15/2`
- (C) `y = (3/4)x − 3/2`
- (D) `y = −(4/3)x + 11`

**Solution**

The center is (3, −1). The radius to (6, 3) has slope `(3 − (−1)) / (6 − 3) = 4/3`.

A tangent line is perpendicular to that radius, so its slope is the negative reciprocal: −3/4.

Use the point (6, 3): `y − 3 = −(3/4)(x − 6)`, so `y = −(3/4)x + 9/2 + 3 = −(3/4)x + 15/2`.

(A) is the line along the radius itself. (C) flips the fraction but drops the negative sign. (D) is negative but not flipped. All four lines pass through (6, 3), so checking the point alone won't help.

**Answer:** (B)

### Example 4: Inside, on or outside?

The equation `x² + y² − 8y = 9` defines a circle. Which of the following points lies inside the circle?

- (A) (5, 4)
- (B) (4, 8)
- (C) (−3, 1)
- (D) (0, −2)

**Solution**

Complete the square on y: `x² + (y² − 8y + 16) = 9 + 16`, so `x² + (y − 4)² = 25`. The center is (0, 4) and r² = 25.

Test each point in `x² + (y − 4)²` and compare with 25:

- (5, 4): 25 + 0 = 25, so it's **on** the circle, not inside.
- (4, 8): 16 + 16 = 32, which is more than 25, so it's outside.
- (−3, 1): 9 + 9 = 18, which is less than 25, so it's inside.
- (0, −2): 0 + 36 = 36, which is outside. (If you wrongly put the center at (0, −4), this point would look inside.)

**Answer:** (C)

## Traps to avoid

- **Keeping the signs.** `(x + 6)²` means the center's x-coordinate is −6, not 6.
- **r² versus r.** The right side is the radius squared. Take the square root before answering "radius," and double that for "diameter."
- **Adding to only one side.** When you complete the square, whatever you add on the left must also go on the right.
- **Skipping the divide step.** In `2x² + 2y² − 8x = 10`, divide by 2 first. Otherwise the center and radius both come out wrong.
- **Inscribed versus central.** The central angle equals its arc. The inscribed angle is only half.
- **Arc length versus sector area.** Length uses 2πr. Area uses πr². Read the last line twice.
- **Radians in a 360 formula.** If the angle is in radians, use s = rθ and ½r²θ, or divide by 2π instead of 360. Never mix the two.

## Desmos shortcut

Desmos is excellent for circle equations because it graphs them exactly as written, with no rearranging.

- **Find the center and radius by looking.** Type the equation as given, for example `x^2 + y^2 + 10x - 4y + 4 = 0`. Desmos draws the circle. Zoom in and read the center and edges off the grid. Clicking the curve often shows gray points (such as the top and bottom of the circle, or where it crosses an axis). The top and bottom points sit straight above and below the center. Their midpoint is the center, and half the distance between them is the radius.
- **Test answer choices directly.** Graph each choice, like `(x+5)^2 + (y-2)^2 = 25`. The correct one lands exactly on top of the original circle.
- **Inside or outside.** Change the = to < and Desmos shades the inside: `x^2 + y^2 - 8y < 9`. Then type each point, like `(-3, 1)`, and see which one sits in the shaded region. A point on the dashed edge is *on* the circle, not inside.
- **Check a tangent line.** Graph the line along with the circle. A tangent touches at exactly one point and does not cross into the circle.
- **Find a missing constant.** If the equation has an unknown like `x^2 + y^2 - 6x + c = 0`, type it and Desmos offers a slider for c. Drag it until the circle matches the given radius or passes through the given point. Then confirm with algebra.
> **Tip:** Desmos is a great checker, but completing the square by hand usually takes under a minute. Learn both so you can use the faster one on test day.

## Quick checklist

- Is the equation in standard form? If not, did I divide first and complete the square on both sides?
- Did I flip the signs to get the center?
- Did I take the square root of the right side for the radius?
- Is my angle central (not inscribed) before I use it for an arc or sector?
- Degrees or radians? Did I use the matching formula?
- Did they ask for length, area, radius or diameter?

## Sources

- [College Board: Geometry and Trigonometry on the SAT](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/geometry-trigonometry)
- [Magoosh: SAT Math Formula Sheet, Provided vs. Memorize](https://magoosh.com/sat/sat-math-formula-sheet/)
- [Magoosh: SAT Math Equation of a Circle](https://magoosh.com/sat/sat-math-equation-circle/)
- [PrepScholar: Circles on SAT Math, Formulas, Review and Practice](https://blog.prepscholar.com/circles-sat-math-formulas-review-practice)
- [Test Ninjas: SAT Circles Question Types](https://www.test-ninjas.com/sat-circles)
- [Open Exam Prep: Circle Equations in the Coordinate Plane](https://open-exam-prep.com/study-guides/sat-math/geometry-trigonometry/circle-equations-coordinate-plane)
- [Albert.io: Circle Properties and Circle Theorems Study Guide](https://www.albert.io/blog/circle-power-a-study-guide-to-properties-and-circle-theorems/)
- [JustLockedIn: Circle Equation Patterns](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/circles/circle-equation.html)
- [Acely: Desmos Cheat Sheet for the SAT](https://acely.com/sat-prep/desmos-cheat-sheet)
- [Acely Desmos Guide: Coordinates of a Circle's Center](https://acely.com/desmos-guide-library/circles-coordinates-of-center)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [Ultimate Desmos Guide to Digital SAT Math, Part 4 (video)](https://rumble.com/v68sk27-ultimate-desmos-guide-to-digital-sat-math-part-4-intermediate-skills.html)