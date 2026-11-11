---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read a circle's center and radius from any equation, and find arc lengths, sector areas, angles and tangent lines.
minutes: 11
---

> **Key idea:** For an equation, get it into `(x − h)² + (y − k)² = r²` and read the center and radius. For a figure, an arc or sector is just a fraction of the circle: angle/360 times the full circumference or area.

## What this question looks like

Circle questions come in two flavors: an equation in the xy-plane, or a drawn circle with angles and arcs. Expect about 1–3 per test. The equation type shows up most often and is a favorite in the harder second module.

### Circles in the xy-plane

You see an equation like `(x − 2)² + (y + 7)² = 16` or a messier one like `x² + y² + 6x − 10y = 2`. The question asks for one of these:

- the center, radius or diameter
- a missing coefficient
- whether a point is inside the circle
- the line that touches the circle at one point (a tangent line)

### Circles in a figure

You see a circle with center O, some radii, **chords** (segments joining two points on the circle) or **arcs** (pieces of the edge). The question asks for an arc length, a sector area (a "pizza slice"), an angle, or a conversion between degrees and radians.

## The method

### For an equation

1. **Get it into standard form,** `(x − h)² + (y − k)² = r²`. If it's already there, skip to step 4.
2. **Make x² and y² have coefficient 1.** If they don't, divide every term by that number.
3. **Complete the square.** Group the x terms and the y terms, and move the plain number to the right. For each group, take half the middle coefficient, square it, and add it to both sides.
4. **Read the center with flipped signs.** `(x + 4)²` means h = −4. `(y − 3)²` means k = 3.
5. **Take the square root** of the right side to get r.
6. **Answer the actual question.** Center? Radius? Diameter (2r)? Area (πr²)?

### For a figure

1. **Mark every radius as the same length.** Many hard questions hide an isosceles triangle made of two radii.
2. **Find the central angle** (the angle at the center). If you're given an inscribed angle (vertex on the circle), double it.
3. **Turn the angle into a fraction of the circle:** angle/360 in degrees, or angle/(2π) in radians.
4. **Multiply that fraction** by the circumference (for arc length) or by the area (for sector area).

## Rules and formulas you need

The reference sheet gives only the area `A = πr²`, the circumference `C = 2πr`, and the facts that a circle has 360° and 2π radians. Everything else here you must know yourself.

### Equations

- **Standard form:** `(x − h)² + (y − k)² = r²` has center (h, k) and radius r.
- **Completing the square:** `x² + bx` becomes `(x + b/2)² − (b/2)²`.
- **Point test:** plug the point into `(x − h)² + (y − k)²`. Less than r² means inside, equal means on, greater means outside.
- **Diameter endpoints given?** The center is their midpoint, and the radius is half the distance between them.
- **Tangent to an axis?** Touching the x-axis means r = |k|, the distance from the center to that axis. Touching the y-axis means r = |h|.

### Arcs and sectors

| Find | Angle in degrees | Angle in radians |
|---|---|---|
| Arc length | (θ/360) × 2πr | rθ |
| Sector area | (θ/360) × πr² | ½r²θ |

- **Degrees to radians:** multiply by π/180, so 180° = π.
- **One radian** is the angle whose arc is exactly one radius long. That's why arc length in radians is simply rθ.

> **Tip:** Radians are often quicker. For a circle with radius 9 and central angle 2π/3 radians, the arc is 9 × 2π/3 = 6π and the sector area is ½ × 81 × 2π/3 = 27π. No 360 anywhere.

### Angles, chords and tangents

- An **inscribed angle** (vertex on the circle) is half the central angle on the same arc.
- An inscribed angle that stands on a diameter is 90°.
- A **tangent line** is perpendicular to the radius at the point where it touches.
- A radius perpendicular to a chord cuts that chord in half. This often creates a right triangle you can solve with the Pythagorean theorem.

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
- **Reading r² as r.** The right side of standard form is the radius squared: `= 49` means the radius is 7. Double that for the diameter.
- **Adding to only one side.** When you complete the square, whatever you add on the left must also go on the right.
- **Skipping the divide step.** In `2x² + 2y² − 8x = 10`, divide by 2 first. Otherwise the center and radius both come out wrong.
- **Inscribed versus central.** The central angle matches its arc. The inscribed angle is only half.
- **Arc length versus sector area.** Length uses 2πr. Area uses πr². Read the last line twice.
- **Radians in a 360 formula.** If the angle is in radians, use rθ and ½r²θ, or divide by 2π instead of 360. Never mix the two.

## Desmos shortcut

Desmos is excellent for circle equations because it graphs them exactly as written, with no rearranging.

- **Find the center and radius by looking.** Type the equation as given, like `x^2 + y^2 + 10x - 4y + 4 = 0`, then zoom in and read the center and edges off the grid.
- **Use the gray points.** Clicking the curve often shows gray points, such as the circle's top and bottom. Their midpoint is the center, and half the distance between them is the radius.
- **Test answer choices directly.** Graph each choice, like `(x+5)^2 + (y-2)^2 = 25`. The correct one lands exactly on top of the original circle.
- **Inside or outside.** Change the = to < and Desmos shades the inside: `x^2 + y^2 - 8y < 9`. Then type each point, like `(-3, 1)`, and see which one sits in the shaded region. A point on the dashed edge is *on* the circle, not inside.
- **Check a tangent line.** Graph the line with the circle. A tangent touches at exactly one point and doesn't cross into the circle.
- **Find a missing constant.** For an unknown, like `x^2 + y^2 - 6x + c = 0`, Desmos offers a slider for c. Drag it until the circle has the given radius or passes through the given point, then confirm with algebra.

> **Tip:** Desmos is a great checker, but completing the square by hand usually takes under a minute. Learn both so you can use the faster one on test day.

## Quick checklist

- Is the equation in standard form? If not, did I divide first and complete the square on both sides?
- Did I flip the signs to get the center?
- Did I take the square root of the right side for the radius?
- Is my angle central (not inscribed) before I use it for an arc or sector?
- Degrees or radians? Did I use the matching formula?
- Did they ask for length, area, radius or diameter?
