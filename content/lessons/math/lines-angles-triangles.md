---
title: Lines, Angles, and Triangles
skill: lines-angles-triangles
domain: geometry-trig
section: math
summary: Name the angle or triangle relationship in a figure, turn it into one equation, and solve for missing angles and side lengths.
minutes: 10
---

## What this question looks like

You'll usually see a figure with lines, angles and triangles, and a question like "What is the value of x?" or "What is the length of BC?" Common setups:

- **Two parallel lines cut by a third line** (called a *transversal*), with one or two angles labeled, often with expressions like (3x + 10)°.
- **A triangle with a missing angle**, sometimes isosceles (two equal sides, shown by tick marks or stated in the text) or with one side extended past a corner.
- **Similar triangles:** a small triangle tucked inside a big one, two triangles meeting at a point like a bowtie, or a word problem about shadows or ramps.
- **"Which of the following is sufficient to prove…"**: you pick the one extra fact that makes two triangles congruent or similar.
- **Side-length limits:** "Two sides of a triangle are 7 and 12. Which could be the third side?"

Figures on the Digital SAT are drawn to scale unless a note says otherwise, so a quick look can rule out silly answers. Still, prove your answer from the given facts, never by eyeballing.

## The method

1. **Mark up the figure.** Sketch the figure on scratch paper and write every given value on it. Note which lines are stated (or marked) as parallel and which sides are equal.
2. **Name the relationship before you calculate.** Say it in words: "these two angles are a straight line, so they add to 180°" or "DE is parallel to BC, so the triangles are similar."
3. **Write one equation** from that relationship, either "equal" or "adds to 180°."
4. **Solve, then fill in more angles.** Each angle you find can unlock the next one. Work toward the angle you need.
5. **For similar triangles, match corners first.** Line up equal angles, then write a ratio with the small triangle on top on both sides: `small/big = small/big`.
6. **Answer the exact question.** If it asks for an angle measure, plug x back in. If it asks for a whole side, add the pieces.

## Rules and formulas you need

Only one of these, the 180° triangle sum, is on the reference sheet. Learn the rest by heart.

| Angle fact | Rule |
|---|---|
| Vertical angles (opposite each other where two lines cross) | equal |
| Angles forming a straight line | add to 180° |
| Angles all the way around a point | add to 360° |
| Complementary angles | add to 90° |
| Parallel lines: corresponding, alternate interior, alternate exterior angles | equal |
| Parallel lines: same-side interior angles (between the lines, same side of the transversal) | add to 180° |

> **Key idea:** When a transversal crosses two parallel lines, it makes only two angle sizes: a "small" one and a "big" one (unless the transversal is perpendicular, when all eight are 90°). Every small angle equals every other small angle, and small + big = 180°. This only works when the lines are given as parallel.

| Triangle fact | Rule |
|---|---|
| Angle sum | the three angles add to 180° |
| Exterior angle (made by extending one side) | equals the sum of the two far-away interior angles |
| Isosceles | the two equal sides sit opposite the two equal angles (and the reverse) |
| Equilateral | all sides equal, every angle 60° |
| Biggest side | is always opposite the biggest angle |
| Triangle inequality | each side is shorter than the other two added together |
| Third side range | if two sides are a and b with a > b, then `a − b < third side < a + b` |
| Polygon angle sum | an n-sided polygon's angles add to (n − 2) × 180° |

**Similar triangles** have the same shape: equal angles, and every side multiplied by the same scale factor k. Their areas differ by k². Two triangles are similar if any of these is true:

- **AA:** two pairs of angles are equal. This is by far the most common one. A shared angle, vertical angles, or a parallel line usually hands you the second pair.
- **SAS similarity:** two pairs of sides have the same ratio, and the angles between them are equal.
- **SSS similarity:** all three pairs of sides have the same ratio.

**Congruent triangles** are exact copies: same size and shape. They're congruent by SSS, SAS, ASA, AAS, or HL (right triangles with equal hypotenuses and one equal leg). AAA proves only similarity, and SSA (an angle that's not between the two sides) proves nothing.

> **Tip:** Letter order is a map. If triangle ABC is similar to triangle DEF, then A matches D, B matches E, C matches F, and side AB matches side DE.

The two classic similar-triangle pictures:

- **Triangle inside a triangle:** a segment DE drawn across triangle ABC, parallel to side BC, cuts off a small triangle ADE at the top. It's similar to ABC, and they share angle A.
- **Bowtie:** two segments cross at a point, and the segments joining their ends on each side are parallel. The two triangles have equal vertical angles at the crossing point and equal alternate interior angles.

## Worked examples

### Example 1: Parallel lines and algebra

Line ℓ is parallel to line m, and line ℓ is drawn above line m. Line t crosses both lines. Where t crosses ℓ, the angle below ℓ and to the right of t measures (3x − 6)°. Where t crosses m, the angle above m and to the right of t measures (2x + 16)°. What is the value of x?

- (A) 22
- (B) 34
- (C) 84
- (D) 96

**Solution**

Both angles are between the parallel lines and on the same side (right) of t, so they're same-side interior angles. Those add to 180°, not equal.

`(3x − 6) + (2x + 16) = 180`, so 5x + 10 = 180, 5x = 170, and x = 34.

Check: the angles are 3(34) − 6 = 96° and 2(34) + 16 = 84°, which add to 180°. One is "big" and one is "small," as expected.

(A) comes from setting the angles equal. (C) and (D) are the two angle measures, not x.

**Answer:** (B)

### Example 2: A triangle inside a triangle

In triangle ABC, point D lies on side AB and point E lies on side AC, so that segment DE is parallel to side BC. AD = 6, DB = 4, and DE = 9. What is the length of BC?

- (A) 6
- (B) 13.5
- (C) 15
- (D) 22.5

**Solution**

DE is parallel to BC, so angle ADE equals angle ABC (corresponding angles), and both triangles share angle A. By AA, triangle ADE is similar to triangle ABC.

Match the sides: AD goes with AB, and DE goes with BC. The whole side AB = 6 + 4 = 10.

`AD/AB = DE/BC`, so 6/10 = 9/BC. Cross-multiply: 6 × BC = 90, so BC = 15.

Sense check: BC should be longer than DE, and the big triangle is 10/6 times the small one. 9 × 10/6 = 15.

(B) uses the pieces 6 and 4 as if they were matching sides (9 × 6/4). (D) pairs DB with DE (9 × 10/4). (A) flips the piece ratio (9 × 4/6) and gives a BC shorter than DE, which can't happen.

**Answer:** (C)

### Example 3: Isosceles triangle with an extended side

In triangle PQR, PQ = QR. Side PR is extended past R to a point S, so P, R and S lie on one straight line. Angle QRS measures 115°. What is the measure of angle PQR?

- (A) 50°
- (B) 57.5°
- (C) 65°
- (D) 115°

**Solution**

Angles QRP and QRS form a straight line, so angle QRP = 180° − 115° = 65°.

PQ = QR, so the angles opposite those sides are equal. Angle QRP is opposite side PQ, and angle QPR is opposite side QR. So angle QPR = 65° too.

Angle PQR = 180° − 65° − 65° = 50°.

Check with the exterior angle rule: 115° should equal the two far-away angles, 65° + 50° = 115°. It does.

(C) is a base angle, not the top angle. (B) treats 65° as the top angle and splits the rest: (180 − 65)/2. (D) is the outside angle.

**Answer:** (A)

### Example 4: Triangle inequality (student-produced response)

Two sides of a triangle have lengths 7 and 12. The length of the third side is a whole number. What is the greatest possible perimeter of the triangle?

**Solution**

The third side must be longer than 12 − 7 = 5 and shorter than 12 + 7 = 19. It can't equal 19, because then the two short sides would lie flat along the long side and there'd be no triangle.

The greatest whole number less than 19 is 18. Perimeter = 7 + 12 + 18 = 37.

**Answer:** 37

## Traps to avoid

- **Same-side interior angles set equal.** They add to 180°. If your two angles look different in size, they can't be equal.
- **Using parallel-line rules on lines that aren't parallel.** Lines that merely look parallel don't count. The problem must say so or mark them with matching arrows.
- **Reporting x when they asked for the angle** (or the reverse). The choices often include both.
- **Using part of a side in a similarity ratio.** In a triangle inside a triangle, the big triangle's side is the *whole* side, so add the pieces first.
- **Matching the wrong sides.** Match sides by the equal angles across from them, or by the letter order in the similarity statement, never by where they sit on the page.
- **Mixing up the base angles and the top angle of an isosceles triangle.** The equal angles are across from the equal sides.
- **Thinking AAA proves congruence.** Equal angles mean same shape, not same size.
- **Allowing "equal to" in the triangle inequality.** With sides 7 and 12, a third side of 5 or 19 is impossible. The inequality is strict.
- **Scaling angles.** A scale factor stretches sides, but angles never change.

## Quick checklist

- Did I mark every given angle, equal side, and parallel line on my sketch?
- Did I name the relationship (equal, adds to 180°, similar, isosceles) before writing an equation?
- Are the lines actually given as parallel?
- For similar triangles: did I match corners, use whole sides, and keep small-over-big on both sides?
- Did I plug x back in if the question wants an angle?
- Does my answer make sense: angles add to 180°, the biggest side is across from the biggest angle?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (Geometry and Trigonometry testing points)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf)
- [College Board: Geometry and Trigonometry on the SAT](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/geometry-trigonometry)
- [Just Locked In: Angle and Line Relationships](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/lines-angles-and-triangles/angle-and-line-relationships.html)
- [Just Locked In: Similar and Congruent Triangle Analysis](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/lines-angles-and-triangles/similar-and-congruent-triangle-analysis.html)
- [Just Locked In: Triangle Properties Application](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/lines-angles-and-triangles/triangle-properties-application.html)
- [Just Locked In: Conceptual Geometric Reasoning](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/lines-angles-and-triangles/conceptual-geometric-reasoning.html)
- [Test Ninjas: Mastering Lines, Angles, and Triangles Questions on the SAT](https://test-ninjas.com/sat-lines-angles-triangles)
- [Target Test Prep: Similar Triangles on the SAT](https://sat.blog.targettestprep.com/sat-similar-triangles/)
- [SAT Sphere: Geometry on the Digital SAT, Similarity, Circles and Coordinates](https://www.satsphere.com/blog/geometry-on-the-digital-sat-similarity-circles-and-coordinates)
- [Varsity Tutors: SAT Lines, Angles, and Triangles](https://www.varsitytutors.com/practice/subjects/sat/lessons/lines-angles-and-triangles)
- [The Axiom Academy: SAT Lines, Angles, and Triangles](https://theaxiomacademy.org/learn/sat-lines-angles-triangles)
- [PrepMaven: SAT Geometry Guide](https://prepmaven.com/blog/test-prep/sat-geometry/)
- [Galvanize Test Prep: SAT Geometry Questions on Lines, Triangles and Circles](https://galvanizetestprep.com/blogs/sat-geometry-questions-lines-triangles-circles-guide/)
