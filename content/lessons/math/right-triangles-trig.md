---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Find any missing side or trig ratio in a right triangle fast, using the Pythagorean theorem, special triangles, SOH-CAH-TOA and the sin–cos swap rule.
minutes: 10
---

## What this question looks like

These questions almost always have a right triangle in them, either drawn or described in words ("triangle ABC has a right angle at C"). Typical stems:

- "What is the value of sin A?" or "What is tan R?" when some side lengths are given.
- "In right triangle PQR, cos P = 5/13. What is sin R?" (one ratio given, another one asked).
- "sin(3x + 4)° = cos(5x − 10)°. What is x?" (two angle expressions, one sine and one cosine).
- A triangle with a 30°, 45° or 60° angle and one side given, asking for another side, a perimeter or an area.
- Two similar right triangles, where a ratio from one triangle is used in the other.
- Occasionally a conversion between degrees and radians.

Expect about 2–4 of these per test. Most are medium difficulty, and the hard ones are usually just two easy steps chained together.

## The method

1. **Sketch and label.** If no figure is given, draw one. Mark the right angle and every side or angle you know.
2. **Pick your reference angle.** Circle the angle the question asks about. Label the three sides *from that angle*: the **hypotenuse** (across from the right angle, always the longest), the **opposite** leg (across from your angle) and the **adjacent** leg (touching your angle, not the hypotenuse).
3. **Fill in missing sides.** Use a Pythagorean triple you recognize, a special triangle, or `a² + b² = c²`.
4. **Choose the tool.** Ratio asked? Use SOH-CAH-TOA. One sine and one cosine set equal? Use the 90° rule. A 30°, 45° or 60° angle? Use the special-triangle ratios.
5. **Answer the exact question.** Check: did they ask for a side, a ratio, a perimeter, or an area? Is the answer for angle A or angle B?

> **Key idea:** A trig ratio depends only on the angle, not on how big the triangle is. If you know tan P = 7/24, you may simply *pretend* the legs are 7 and 24. Any real triangle with that angle is just a scaled copy.

## Rules and formulas you need

The Digital SAT reference sheet (the formula button in the test app) gives you the Pythagorean theorem, both special right triangles, and the facts that a circle has 360° or 2π radians and a triangle's angles add to 180°. It does **not** give SOH-CAH-TOA, the 90° rule, or degree–radian conversion. Learn those cold.

| Fact | What it says | On the sheet? |
|---|---|---|
| Pythagorean theorem | `a² + b² = c²`, c = hypotenuse | Yes |
| 45-45-90 triangle | sides x : x : x√2 | Yes |
| 30-60-90 triangle | sides x : x√3 : 2x (x is across from 30°) | Yes |
| SOH | sin θ = opposite / hypotenuse | No |
| CAH | cos θ = adjacent / hypotenuse | No |
| TOA | tan θ = opposite / adjacent | No |
| 90° rule | sin x° = cos(90 − x)°, so if sin A = cos B (both acute), then A + B = 90 | No |
| Radians | 180° = π radians; degrees × π/180 = radians | Half (360° = 2π is) |

**Pythagorean triples** to spot instantly (and any multiple of them, like 6-8-10 or 15-20-25):

| Triple | Common multiples |
|---|---|
| 3, 4, 5 | 6-8-10, 9-12-15, 12-16-20 |
| 5, 12, 13 | 10-24-26 |
| 8, 15, 17 | 16-30-34 |
| 7, 24, 25 | 14-48-50 |

**Special angle values** (these come straight from the special triangles):

| Angle | sin | cos | tan |
|---|---|---|---|
| 30° (π/6) | 1/2 | √3/2 | √3/3 |
| 45° (π/4) | √2/2 | √2/2 | 1 |
| 60° (π/3) | √3/2 | 1/2 | √3 |

Two more useful facts:

- In a right triangle, the two acute angles add to 90°. The leg opposite one acute angle is adjacent to the other. So sin A = cos B and tan A = 1 / tan B.
- In a 30-60-90 triangle, the shortest side sits across from 30°, the √3 side across from 60°, and the hypotenuse is exactly double the shortest side.

> **Tip:** Similar triangles have the same angles, so they have the same trig ratios. Questions that give you a scale factor, area or perimeter for the second triangle are often handing you information you don't need.

## Worked examples

### Example 1: The sine–cosine swap

For acute angles, `sin((4k + 6)°) = cos((2k + 24)°)`. What is the value of k?

- (A) 9
- (B) 10
- (C) 15
- (D) 25

**Solution**

A sine equals a cosine when the two angles are complementary, meaning they add to 90°. So set the sum equal to 90:

`(4k + 6) + (2k + 24) = 90`

`6k + 30 = 90`, so `6k = 60` and k = 10.

Check: the angles are 46° and 44°, which add to 90°. Choice (A) comes from setting the two angles *equal* (that only works for sin = sin). Choice (C) forgets the +6 and +24. Choice (D) uses 180 instead of 90.

**Answer:** (B)

### Example 2: One ratio gives you another

In right triangle PQR, angle Q is the right angle and tan P = 7/24. What is cos R?

- (A) 7/24
- (B) 7/25
- (C) 24/25
- (D) 24/7

**Solution**

From P, tan P = opposite / adjacent = QR / PQ = 7/24. Pretend QR = 7 and PQ = 24. The hypotenuse PR is 25 (it's the 7-24-25 triple).

Now switch to angle R. The leg touching R (besides the hypotenuse) is QR = 7. So cos R = adjacent / hypotenuse = 7/25.

Shortcut check: P and R are the two acute angles, so cos R = sin P = 7/25. (A) is tan P. (C) is cos P, which you get if you forget to switch the labels to angle R. (D) is tan R.

**Answer:** (B)

### Example 3: Two special triangles glued together

In triangle ABC, point D is on side AC and BD is perpendicular to AC. Angle A measures 45°, angle C measures 30°, and BD = 6. What is the length of AC?

- (A) 12
- (B) 6 + 2√3
- (C) 6 + 6√3
- (D) 12 + 6√2

**Solution**

The height BD splits the big triangle into two right triangles, which meet along BD.

- Triangle ABD is 45-45-90, so its legs are equal: AD = BD = 6.
- Triangle CBD is 30-60-90. BD is across from the 30° angle at C, so BD is the short side x = 6. DC is across from the 60° angle, so DC = 6√3.

AC = AD + DC = `6 + 6√3`.

(B) comes from dividing by √3 instead of multiplying (6/√3 = 2√3). (D) adds the two slanted sides, AB = 6√2 and BC = 12, instead of the base pieces. (A) treats both pieces as 6.

**Answer:** (C)

### Example 4: Similar triangles (student-produced response)

Right triangles ABC and DEF are similar, with angle C corresponding to angle F (both right angles), A corresponding to D, and B corresponding to E. In triangle ABC, AC = 36 and AB = 39. The longest side of triangle DEF is 13. What is the value of tan E?

**Solution**

Matching angles in similar triangles have equal trig ratios, so tan E = tan B. The size of DEF doesn't matter.

Find the missing side of ABC: `BC = √(39² − 36²) = √(1521 − 1296) = √225 = 15`. (It's the 5-12-13 triple times 3.)

From angle B, the opposite leg is AC = 36 and the adjacent leg is BC = 15. So tan B = 36/15 = 12/5.

Double check in DEF: the scale is 13/39 = 1/3, so DF = 12 and EF = 5, and tan E = DF/EF = 12/5. Same answer.

**Answer:** 12/5 (2.4 is also accepted)

## Traps to avoid

- **Labeling from the wrong angle.** "Opposite" and "adjacent" change when you change angles. Relabel every time the question switches from A to B.
- **sin A = sin B.** For the two acute angles, the true link is sin A = cos B. Equal sines only happen when the angles are equal.
- **Setting the angles equal in a sin = cos equation.** The angles must *add* to 90, not match.
- **Putting √3 on the wrong side.** In a 30-60-90 triangle, √3 goes across from 60°, and the side across from 30° is the shortest one.
- **Using the hypotenuse in tangent.** Tangent uses two legs. Only sine and cosine use the hypotenuse.
- **Answering the side when they want the ratio** (or the other way around). Reread the last line.
- **Calculator in the wrong mode.** sin(30) in degrees is 0.5. In radians it's about −0.99. The calculator gives no warning.
- **Forgetting to take the square root.** `a² + b² = c²` gives c², so finish with √.

## Desmos shortcut

- **Check the angle mode first.** Click the wrench (settings) and choose Degrees or Radians to match the question. A ° symbol means degrees. π or the word "radians" means radians. Quick test: type `sin(30)`. If you see 0.5, you're in degrees.
- **Let Desmos do the square roots.** Type `sqrt(39^2 - 36^2)` instead of doing the arithmetic by hand.
- **Graph a sin = cos equation.** In degree mode, type `y = sin(4x + 6)` and `y = cos(2x + 24)`, then click where they cross. There are many crossings, so pick the one where both angles are between 0° and 90°. Solving with the 90° rule by hand is usually faster, so use this only as a check.
- **Don't over-use it.** For most right-triangle questions, a quick sketch and SOH-CAH-TOA beat the calculator.

## Quick checklist

- Did I draw the triangle and mark the right angle?
- Did I label opposite and adjacent from the angle the question asks about?
- Can I see a triple (3-4-5, 5-12-13, 8-15-17, 7-24-25) or a special triangle?
- sin = cos with two angles? Do they add to 90?
- Is Desmos in the right mode (degrees vs radians)?
- Did I answer the exact thing asked (side, ratio, perimeter, area)?

## Sources

- [College Board: Geometry and Trigonometry on the SAT](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/geometry-trigonometry)
- [Magoosh: SAT Math Formula Sheet, Provided vs. Memorize](https://magoosh.com/sat/sat-math-formula-sheet/)
- [PrepScholar: SAT Trigonometry Guide](https://blog.prepscholar.com/sat-trigonometry)
- [PrepScholar: Critical SAT Math Formulas](https://blog.prepscholar.com/critical-sat-math-formulas-you-must-know)
- [Test Ninjas: SAT Trigonometry Question Types](https://test-ninjas.com/sat-trigonometry)
- [The Test Advantage: SAT Trig Ratios with Desmos](https://thetestadvantage.com/blog/sat-trig-ratios-with-desmos-may-2026-sin-cos-tan-step-by-step)
- [Open Exam Prep: Trigonometry and Radian Measure](https://open-exam-prep.com/study-guides/sat-math/geometry-trigonometry/trigonometry-radian-measure)
- [JustLockedIn: Right Triangles and Trigonometry Patterns](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/right-triangles-and-trigonometry/)
- [Acely: Desmos Cheat Sheet for the SAT](https://acely.com/sat-prep/desmos-cheat-sheet)
- [SAT Sphere: Geometry and Trig Tips](https://www.satsphere.com/resource/article/sat-geometry-trig-tips)