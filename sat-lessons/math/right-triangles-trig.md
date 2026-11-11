---
title: Right triangles and trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Use the Pythagorean theorem, special right triangles and SOH-CAH-TOA, swap sine and cosine of complementary angles, and convert degrees and radians.
minutes: 19
---

## What this question looks like

These questions involve a **right triangle**: a triangle with one angle of exactly 90°, shown by a small square in the corner. Sometimes the right triangle is hidden inside another shape: the diagonal of a rectangle, the height of an equilateral triangle, a ladder against a wall, a ramp, or the distance between two points.

Typical stems:

- "In right triangle ABC, what is the length of BC?"
- "What is the value of sin A?" or "What is cos B?"
- "In a right triangle, sin x° = 0.6. What is the value of cos(90 − x)°?"
- "Both angles are acute and sin(2k + 10)° = cos(3k)°. What is the value of k?"
- "A ramp makes a 30° angle with the ground. How long is the ramp?"
- "What is the measure of the angle in radians?"

Expect about one or two of these per test. Some are student-produced responses, where the answer is often a fraction like 8/17 that you type as a fraction or a decimal.

Words to know:

- **Hypotenuse:** the side across from the right angle. It is always the longest side.
- **Legs:** the two sides that form the right angle.
- **Opposite** and **adjacent:** pick one of the two smaller angles. The opposite side is the side across from it. The adjacent side is the leg that touches it.
- **Acute angle:** an angle smaller than 90°.

The main sub-types:

- **Pythagorean theorem:** find a missing side.
- **Special right triangles:** 45°-45°-90° and 30°-60°-90°.
- **SOH-CAH-TOA:** find a ratio from the sides, or a side from a ratio.
- **One ratio given, find another.**
- **Complementary angles:** the sine of one angle equals the cosine of the other.
- **Similar right triangles:** the ratios stay the same when the triangle changes size.
- **Degrees and radians.**

## The method

1. **Sketch the right triangle on scratch paper.** Mark the right angle. If the triangle is hidden (a rectangle's diagonal, a ladder, a height), draw it in.
2. **Stand at the angle the question names.** Label the three sides from that angle: H (hypotenuse), O (opposite) and A (adjacent). If the question switches to the other angle, label again, because O and A trade places.
3. **Pick your tool.** Two sides known and the third wanted: the Pythagorean theorem (look for a triple first). An angle of 30°, 45° or 60°: the special right triangles. A ratio, or an angle with a side: SOH-CAH-TOA.
4. **If you are given one ratio, build the triangle.** For sin A = 5/13, draw a triangle with opposite side 5 and hypotenuse 13, find the missing side (12), and then read any ratio you want.
5. **If two angles add up to 90°, sine and cosine swap:** the sine of one is the cosine of the other.
6. **Check.** The hypotenuse must be the longest side. For an acute angle, sine and cosine are between 0 and 1. In Desmos, make sure the calculator is in degree mode.

> **Key idea:** Sine, cosine and tangent depend only on the angle, not on the size of the triangle. That's why you can make up easy side lengths that fit a given ratio.

## Rules and formulas you need

### The Pythagorean theorem and triples

In a right triangle with legs a and b and hypotenuse c: a² + b² = c². To find a leg, subtract: b² = c² − a².

These **Pythagorean triples** are right triangles with whole-number sides. Spotting one saves time.

| Triple | Multiples you may see |
|---|---|
| 3, 4, 5 | 6-8-10, 9-12-15, 12-16-20, 15-20-25 |
| 5, 12, 13 | 10-24-26, 15-36-39 |
| 8, 15, 17 | 16-30-34 |
| 7, 24, 25 | 14-48-50 |

The largest number in each triple is the hypotenuse. A triangle with legs 5 and 13 is **not** a 5-12-13 triangle: its hypotenuse is √194.

It works backward too: if a² + b² = c² for the three sides, the triangle has a right angle.

### Special right triangles

Both of these are on the reference sheet.

| Triangle | Sides | Where it hides |
|---|---|---|
| 45°-45°-90° | s, s, s√2 | half of a square, cut along its diagonal |
| 30°-60°-90° | x, x√3, 2x | half of an equilateral triangle, cut by its height |

In the 30°-60°-90° triangle, the shortest side x is opposite the 30° angle, the side x√3 is opposite the 60° angle, and the hypotenuse 2x is opposite the 90° angle. The hypotenuse has no √3.

Results worth knowing: a square with side s has a diagonal of s√2. An equilateral triangle with side s has a height of (s√3)/2 and an area of (√3/4)s².

### SOH-CAH-TOA

For an acute angle in a right triangle:

| Ratio | Meaning | Memory word |
|---|---|---|
| sine (sin) | opposite ÷ hypotenuse | SOH |
| cosine (cos) | adjacent ÷ hypotenuse | CAH |
| tangent (tan) | opposite ÷ adjacent | TOA |

Values for the special angles come straight from the special triangles:

| Angle | sin | cos | tan |
|---|---|---|---|
| 30° | 1/2 | √3/2 | √3/3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |

Also good to know: tan = sin ÷ cos, and sin²x + cos²x = 1 for any angle x.

### The two acute angles: sine and cosine swap

In right triangle ABC with the right angle at C, angles A and B add up to 90°. Two angles like this are **complementary**. The side opposite A is the side adjacent to B, so:

- sin A = cos B, and cos A = sin B.
- In general, sin x° = cos(90 − x)° and cos x° = sin(90 − x)°.
- If sin a° = cos b° and both angles are acute, then a + b = 90. Add the angles; don't set them equal.
- tan A and tan B are reciprocals (flipped fractions). If tan A = 3/4, then tan B = 4/3.

### Similar right triangles

If two right triangles are similar, matching angles have the same sine, cosine and tangent. If triangle ABC ∼ triangle DEF, then sin A = sin D, cos B = cos E, and so on. A side length or a perimeter that only tells you how big a triangle is does not change any ratio.

The height drawn from the right angle to the hypotenuse splits a right triangle into two smaller right triangles. All three triangles are similar to each other.

### Degrees and radians

Radians are another unit for measuring angles. A full turn is 360° = 2π radians, so 180° = π radians.

- Degrees to radians: multiply by π/180. Radians to degrees: multiply by 180/π.
- 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 360° = 2π.
- sin(π/6) is the same as sin 30°, which is 1/2.
- In radians, sin x = cos(π/2 − x).

Radians also appear with arcs and the unit circle; the Circles lesson covers those.

## Worked examples

### Example 1: A ladder against a wall

A 20-foot ladder leans against a vertical wall. The bottom of the ladder is on level ground, 12 feet from the base of the wall. How high up the wall does the top of the ladder reach, in feet?

- (A) 8
- (B) 16
- (C) 4√34
- (D) 256

**Solution.** The wall, the ground and the ladder form a right triangle with the right angle where the wall meets the ground. The ladder is the hypotenuse (20) and the ground distance is a leg (12). So h² = 20² − 12² = 400 − 144 = 256, and h = 16. Faster: 12 = 4 × 3 and 20 = 4 × 5, so this is a 3-4-5 triangle made 4 times bigger, and the missing side is 4 × 4 = 16. Choice (A) subtracts the lengths instead of their squares. Choice (C) adds the squares, as if the ladder were a leg. Choice (D) forgets the square root.

**Answer:** (B)

### Example 2: A ratio from two sides

In right triangle RST, angle S is the right angle. RS = 20 and RT = 29. What is the value of tan R?

- (A) 20/29
- (B) 21/29
- (C) 20/21
- (D) 21/20

**Solution.** The right angle is at S, so the hypotenuse is RT = 29. Find the third side: ST² = 29² − 20² = 841 − 400 = 441, so ST = 21. Now stand at angle R. The opposite side is ST = 21 and the adjacent side is RS = 20. So tan R = opposite ÷ adjacent = 21/20. Choice (A) is cos R and choice (B) is sin R. Choice (C) is the right fraction upside down; it is tan T.

**Answer:** (D)

### Example 3: A 30-60-90 triangle

In triangle PQR, angle Q measures 90° and angle P measures 30°. The length of PQ is 9. What is the length of PR?

- (A) 3
- (B) 3√3
- (C) 6√3
- (D) 9√3

**Solution.** First decide which side is which. Angle R is 180° − 90° − 30° = 60°. PR is across from the 90° angle, so it is the hypotenuse, 2x. QR is across from the 30° angle at P, so it is the shortest side, x. PQ is across from the 60° angle at R, so PQ is the x√3 side. That gives x√3 = 9, so x = 9/√3 = 3√3. The hypotenuse is 2x = 6√3, about 10.4. Check with cosine: cos 30° = PQ/PR, so PR = 9 ÷ (√3/2) = 18/√3 = 6√3. Choice (B) is QR, the shortest side. Choice (D) treats 9 as the shortest side. Choice (A) divides 9 by 3 instead of by √3.

**Answer:** (C)

### Example 4: Sine and cosine of complementary angles

The angles (5t + 4)° and (3t − 2)° are both acute, and sin(5t + 4)° = cos(3t − 2)°. What is the value of t?

*Student-produced response: enter your answer.*

**Solution.** When the sine of one acute angle equals the cosine of another, the two angles are complementary, so they add up to 90°: (5t + 4) + (3t − 2) = 90. That gives 8t + 2 = 90, so 8t = 88 and t = 11. Check: the angles are 5(11) + 4 = 59° and 3(11) − 2 = 31°, and 59° + 31° = 90°. If you set the angles equal instead, you get t = −3 and negative angles, which tells you something went wrong.

**Answer:** 11

### Example 5: Ratios in similar triangles

Right triangle ABC has its right angle at C, and tan A = 8/15. Triangle DEF is similar to triangle ABC, with vertices D, E and F corresponding to vertices A, B and C. The length of DE is 51. What is the value of sin E?

- (A) 8/17
- (B) 8/15
- (C) 15/17
- (D) 15/8

**Solution.** Build triangle ABC from the ratio. tan A = opposite ÷ adjacent = 8/15, so you can use BC = 8 and AC = 15. The hypotenuse is AB = √(64 + 225) = √289 = 17, an 8-15-17 triple. Angle E matches angle B, and similar triangles have the same ratios, so sin E = sin B. Stand at angle B: the opposite side is AC = 15 and the hypotenuse is AB = 17. So sin E = 15/17. The length DE = 51 only tells you that triangle DEF is 3 times as big, so it doesn't change any ratio. Choice (A) is sin A, the ratio for the wrong angle. Choice (B) is tan A, which was given. Choice (D) is tan B.

**Answer:** (C)

### Example 6: The height to the hypotenuse

In right triangle ABC, angle C is the right angle. Point D lies on the hypotenuse AB, and segment CD is perpendicular to AB. AD = 4 and DB = 9. What is the value of tan A?

*Student-produced response: enter your answer.*

**Solution.** Segment CD splits the big triangle into two right triangles, ADC and CDB, each with its right angle at D. Angle A equals angle BCD, because each one adds to angle B to make 90° (in triangle ABC and in triangle CDB). Now write the tangent of these equal angles. In triangle ADC, tan A = CD/AD = CD/4. In triangle CDB, tan(angle BCD) = DB/CD = 9/CD. The angles are equal, so CD/4 = 9/CD. Cross-multiply: CD² = 36, so CD = 6. Then tan A = 6/4 = 3/2. Check with the big triangle: AC = √(4² + 6²) = √52 and BC = √(9² + 6²) = √117, and √117 ÷ √52 = √(9/4) = 3/2.

**Answer:** 3/2 or 1.5

## Traps to avoid

- **Opposite and adjacent from the wrong angle.** They trade places when you move from angle A to angle B. Relabel every time.
- **Using the hypotenuse as a leg.** In a² + b² = c², c is always the side across from the right angle.
- **Forgetting the square root,** or giving c² as the answer.
- **√3 in the wrong place.** In a 30°-60°-90° triangle, √3 goes on the side opposite 60°. The hypotenuse is simply 2x.
- **Setting complementary angles equal.** sin a° = cos b° means a + b = 90, not a = b.
- **Being distracted by size.** Similar triangles have the same ratios no matter how big they are. A given side length or perimeter may be extra information.
- **A sine or cosine bigger than 1.** That means you divided by a leg instead of the hypotenuse.
- **Radian mode.** If Desmos is in radians, sin(30) gives −0.988 instead of 0.5.
- **Using these rules without a right angle.** SOH-CAH-TOA and a² + b² = c² need a 90° angle. Look for one, or make one by drawing a height.

## Desmos shortcut

Desmos won't solve a triangle for you, but it checks your numbers fast.

- **Check the angle mode first.** Click the wrench icon (graph settings) and choose Degrees. Quick test: type `sin(30)`. In degree mode the result is 0.5. In radian mode it is −0.988.
- **Check a radical answer.** Type `6sqrt(3)` to get 10.392, and compare it with a direct calculation such as `9/cos(30)`, which also gives 10.392 in degree mode.
- **See the complementary swap.** `sin(59)` and `cos(31)` both give 0.857.
- **Find an angle from a ratio.** In degree mode, `arctan(1.5)` gives 56.31° (1.5 is 3/2; a decimal avoids typing a fraction). You rarely need this, but it is a good way to check a drawing.
- **Convert units.** `150pi/180` and `5pi/6` both give 2.618, so 150° = 5π/6 radians.

## Quick checklist

- Did I sketch the triangle and mark the right angle?
- Did I label O, A and H from the angle the question names?
- Did I check for a triple or a special triangle before doing long math?
- Is the hypotenuse the longest side, and is my sine or cosine less than 1?
- Complementary angles: did I add them to 90?
- Is Desmos in degree mode?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite, version 4 (2026)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official testing points: Pythagorean theorem, special right triangles, trig ratios from similarity, and complementary angles
- [Galvanize Test Prep: SAT Trigonometry, What's Tested](https://galvanizetestprep.com/blogs/sat-trigonometry/) — what is and isn't on the test (no law of sines, no inverse trig) and the Desmos degree-mode warning
- [Test Ninjas: SAT Trigonometry](https://test-ninjas.com/sat-trigonometry) — the label, choose, solve routine and common labeling traps
- [Varsity Tutors: SAT Trigonometry lesson](https://www.varsitytutors.com/practice/subjects/sat/lessons/trigonometry) — "identify your reference angle first," the triples list and complementary-angle algebra
- [JustLockedIn: Ratio Conversion pattern](https://justlockedin.com/patterns/math/geometry-and-trigonometry/right-triangles-and-trigonometry/ratio-conversion.html) — building a triangle from one ratio, and why scale information is a distractor
- [JustLockedIn: Special Triangles pattern](https://justlockedin.com/patterns/math/geometry-and-trigonometry/right-triangles-and-trigonometry/special-triangles.html) — where 45-45-90 and 30-60-90 triangles hide and the √3 placement trap
- [PrepScholar: SAT Trigonometry, SOHCAHTOA and Radians](https://blog.prepscholar.com/sat-trigonometry) — radian conversions, benchmark angles and the complementary rule in radians
- [Settele Tutoring: Trigonometry, SAT Math Geometry Lesson (YouTube)](https://www.youtube.com/watch?v=l8bVS3hDHxs) — a tutor's view that SOH-CAH-TOA and the complementary angle rule are the two key ideas
- [Settele Tutoring: Radians, SAT Math Geometry Lesson (YouTube)](https://www.youtube.com/watch?v=ElTwedhmY_U) — few radian questions, mostly conversions, plus checking the Desmos angle setting
- [r/Sat: is heron's formula about triangles on the SAT?](https://www.reddit.com/r/Sat/comments/1e90kph/is_herons_formula_about_trianglesgeometry_on_the/) — tutors agreeing that advanced triangle formulas are never needed and special right triangles usually are
