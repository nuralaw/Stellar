---
title: Lines, Angles, and Triangles
skill: lines-angles-triangles
domain: geometry-trig
section: math
summary: Spot the angle or triangle rule in a figure, turn it into one equation, and solve for missing angles and side lengths.
minutes: 12
---

> **Key idea:** Before you calculate, say the relationship in words (these angles are equal, these add to 180°, these triangles are similar). Then turn it into one equation.

## What this question looks like

You'll see a figure with lines, angles and triangles, and a question like "What is the value of x?" or "What is the length of BC?" Common setups:

- **Two parallel lines cut by a third line,** called a *transversal*. One or two angles are labeled, often with expressions like (3x + 10)°.
- **A triangle with a missing angle.** It may be isosceles (two equal sides, shown by tick marks or stated in the text) or have one side extended past a corner.
- **Similar triangles:** a small triangle tucked inside a big one, two triangles meeting at a point like a bowtie, or a word problem about shadows or ramps.
- **"Which of the following is sufficient to prove…":** you pick the one extra fact that makes two triangles congruent or similar.
- **Side-length limits:** "Two sides of a triangle are 7 and 12. Which could be the third side?"

Figures are drawn to scale unless a note says otherwise, so a quick look can rule out silly answers. Still, prove your answer from the given facts, never by eyeballing.

## The method

1. **Mark up the figure.** Sketch it on scratch paper and write every given value on it. Note which lines are stated (or marked) as parallel and which sides are equal.
2. **Name the relationship before you calculate.** For example: "these two angles make a straight line, so they add to 180°" or "DE is parallel to BC, so the triangles are similar."
3. **Write one equation** from that relationship, either "equal" or "adds to 180°."
4. **Solve, then fill in more angles.** Each angle you find can unlock the next one. Work toward the angle you need.
5. **For similar triangles, match corners first.** Line up equal angles, then write a ratio with the small triangle on top on both sides: `small/big = small/big`.
6. **Answer the exact question.** If it asks for an angle measure, plug x back in. If it asks for a whole side, add the pieces.

## Rules and formulas you need

Only one fact here, the 180° triangle sum, is on the reference sheet. Learn the rest by heart.

### Angle facts

| Angles | Rule |
|---|---|
| Vertical angles | equal |
| On a straight line | add to 180° |
| All the way around a point | add to 360° |
| Complementary | add to 90° |
| Corresponding (parallel lines) | equal |
| Alternate interior or exterior (parallel lines) | equal |
| Same-side interior (parallel lines) | add to 180° |

What the names mean:

- **Vertical angles** sit opposite each other where two lines cross.
- Corresponding angles are in the same position at each crossing, like both top-right.
- Alternate angles are on opposite sides of the transversal: *interior* means between the parallel lines, *exterior* means outside them.
- Same-side interior angles are between the parallel lines, on the same side of the transversal.

> **Remember:** A transversal across two parallel lines makes only two angle sizes, a "small" one and a "big" one (all eight are 90° if it's perpendicular). Every small angle equals every other small angle, and small + big = 180°. This works only when the lines are given as parallel.

### Triangle facts

| Fact | Rule |
|---|---|
| Angle sum | the three angles add to 180° |
| Exterior angle | equals the two far interior angles added |
| Isosceles | equal sides face equal angles |
| Equilateral | all sides equal, every angle 60° |
| Longest side | faces the biggest angle |
| Third side | between a − b and a + b |
| Polygon angle sum | (n − 2) × 180° for n sides |

- An **exterior angle** is made by extending one side past a corner.
- In an isosceles triangle, the two equal sides sit opposite the two equal angles, and the reverse is true too.
- The **triangle inequality** says each side is shorter than the other two added together. So if two sides are a and b with a > b, then `a − b < third side < a + b`.

### Similar and congruent triangles

**Similar triangles** have the same shape: equal angles, and every side multiplied by the same scale factor k. Their areas differ by a factor of k². Two triangles are similar if any of these is true:

- **AA:** two pairs of angles are equal. This is by far the most common. A shared angle, vertical angles, or a parallel line usually hands you the second pair.
- **SAS similarity:** two pairs of sides have the same ratio, and the angles between them are equal.
- **SSS similarity:** all three pairs of sides have the same ratio.

**Congruent triangles** are exact copies: same size and shape. They're congruent by SSS, SAS, ASA, AAS, or HL (right triangles with equal hypotenuses and one equal leg). AAA proves only similarity, and SSA (an angle that's not between the two sides) proves nothing.

> **Tip:** Letter order is a map. If triangle ABC is similar to triangle DEF, then A matches D, B matches E, C matches F, and side AB matches side DE.

The two classic similar-triangle pictures:

- **Triangle inside a triangle:** segment DE crosses triangle ABC parallel to side BC, cutting off a small triangle ADE at the top. It's similar to ABC, and they share angle A.
- **Bowtie:** two segments cross at a point, and the segments joining their ends on each side are parallel. The two triangles have equal vertical angles at the crossing and equal alternate interior angles.

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

- **Setting same-side interior angles equal.** They add to 180°. If the two angles look different in size, they can't be equal.
- **Using parallel-line rules on lines that aren't parallel.** Looking parallel doesn't count. The problem must say so or mark the lines with matching arrows.
- **Reporting x when they asked for the angle** (or the reverse). The choices often include both.
- **Using part of a side in a similarity ratio.** In a triangle inside a triangle, the big triangle's side is the *whole* side, so add the pieces first.
- **Matching the wrong sides.** Match sides by the equal angles across from them, or by the letter order, never by where they sit on the page.
- **Mixing up an isosceles triangle's base angles and top angle.** The equal angles are across from the equal sides.
- **Thinking AAA proves congruence.** Equal angles mean same shape, not same size.
- **Allowing "equal to" in the triangle inequality.** With sides 7 and 12, a third side of 5 or 19 is impossible. The inequality is strict.
- **Scaling angles.** A scale factor stretches sides, but angles never change.

## Quick checklist

- Did I mark every given angle, equal side, and parallel line on my sketch?
- Did I name the relationship (equal, adds to 180°, similar, isosceles) before writing an equation?
- Are the lines actually given as parallel?
- Similar triangles: did I match corners, use whole sides, and keep small-over-big on both sides?
- Did I plug x back in if the question wants an angle?
- Does my answer make sense: angles add to 180°, and the biggest side faces the biggest angle?
