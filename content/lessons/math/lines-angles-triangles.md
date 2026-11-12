---
title: Lines, Angles, and Triangles
skill: lines-angles-triangles
domain: geometry-trig
section: math
summary: Name the angle or triangle rule, turn it into one equation, and set up similar-triangle ratios with matching sides.
---

## Name the rule first

You see crossing lines, parallel lines or triangles and are asked for x, an angle or a side. Some ask which fact is **enough to prove** two triangles congruent or similar.

The method: name the rule before you write any number. Then turn the rule into one equation.

- **Straight line:** the angles add to 180°.
- **Vertical angles** (opposite each other where two lines cross): equal.
- **Around a point:** 360°.

For angles, the reference sheet gives only 360° in a circle and 180° in a triangle. Learn the rest.

```quiz
Two straight lines cross and make four angles. One of them measures 70°. What are the other three, going around the point?
- 70°, 70°, 70° :: Only the opposite (vertical) angle is 70°. The two neighbors sit on a straight line with it.
- 20°, 70°, 20° :: 20° + 70° = 90°. Neighbors on a straight line add to 180°, not 90°.
* 110°, 70°, 110° :: Right. Each neighbor is 180° − 70°, and the opposite angle is equal.
> Next to the 70° angle: 180° − 70° = 110° (straight line). Opposite it: 70° (vertical angles). The last one is opposite the 110°. Check: 70 + 110 + 70 + 110 = 360.
```

## Parallel lines: two sizes

A line that crosses two **parallel** lines (a **transversal**) makes eight angles but only two sizes, a small one and a big one, that add to 180°.

| Pair | Where | Rule |
|---|---|---|
| Corresponding | same spot at each crossing | equal |
| Alternate interior | between the lines, opposite sides | equal |
| Same-side interior | between the lines, same side | add to 180° |

These rules need the lines to be **stated** parallel (or marked with arrows). Looking parallel isn't enough.

```quiz
Parallel lines ℓ and m are drawn with ℓ above m, and line t crosses both. Where t crosses ℓ, the angle below ℓ and to the right of t is 65°. Where t crosses m, what is the angle above m and to the left of t?
- 115° :: You used the same-side rule (add to 180°). These two angles are on opposite sides of t.
* 65° :: Right. Both angles are between the lines, on opposite sides of t: alternate interior angles are equal.
- 25° :: 25° + 65° = 90°. Parallel-line angles are either equal or add to 180°.
> Both angles sit between ℓ and m, one right of t and one left of it. That makes them alternate interior angles, so they're equal: 65°.
```

## Triangle and polygon rules

- The three angles add to **180°** (on the reference sheet). In a right triangle, the other two add to 90°.
- **Exterior angle:** extend one side past a corner. The outside angle equals the **two far inside angles** added.
- Any two sides add to more than the third side.
- A polygon with n sides has inside angles adding to (n − 2) × 180°.

```quiz
In triangle ABC, side BC is extended past C to a point D. Angle A measures 50° and angle B measures 70°. What is the measure of angle ACD?
- 60° :: That's angle ACB, the inside angle at C. Angle ACD is the outside angle next to it.
- 110° :: That's 180° − 70°. Angle ACD makes a straight line with angle ACB, not with angle B.
* 120° :: Right. The exterior angle equals the two far inside angles: 50° + 70°.
> Exterior angle rule: ACD = A + B = 50° + 70° = 120°.
> Long way to check: angle ACB = 180° − 50° − 70° = 60°, and ACD is on a straight line with it, so 180° − 60° = 120°.
```

## Isosceles: equal sides, equal angles

An **isosceles** triangle has two equal sides. The angles **opposite** those sides are equal, and it works backward too: two equal angles mean two equal sides.

The angle between the two equal sides is the odd one out. An **equilateral** triangle has all sides equal and every angle 60°.

```quiz
In triangle PQR, PQ = PR, and angle P measures 40°. What is the measure of angle Q?
- 40° :: Angle P sits between the equal sides, so it's the odd one out. Angles Q and R are the equal pair.
* 70° :: Right. Q and R are opposite the equal sides, so each is (180° − 40°) ÷ 2.
- 100° :: That treats P as one of the equal angles. P is between the equal sides; Q and R face them.
- 140° :: That's what Q and R share together. Split it between the two equal angles.
> Angle Q faces side PR, and angle R faces side PQ. Those sides are equal, so Q = R.
> Q + R = 180° − 40° = 140°, so each is 70°.
```

## Similar triangles: match, then ratio

**Similar** triangles have equal angles, and every side is multiplied by the same k. Prove it with **AA**: two pairs of equal angles. A shared angle, vertical angles or parallel lines usually supply them.

1. Match corners by equal angles. In triangle ABC ∼ triangle DEF, the letter order is the map: A↔D, B↔E, so AB↔DE.
2. Write `small/big = small/big` with matching sides.
3. Use **whole** sides, not pieces.

```quiz
In triangle ABC, point D is on side AB and point E is on side AC, so that DE is parallel to BC. AD = 3, DB = 6 and DE = 4. What is the length of BC?
- 8 :: You used the piece DB = 6 as the big triangle's side. Its side is the whole AB = 9.
- 6 :: You paired DB with AB. DB isn't a side of the small triangle; AD is.
* 12 :: Right. 3/9 = 4/BC, so BC = 12.
> DE ∥ BC, so angle ADE = angle ABC (corresponding angles), and both triangles share angle A. By AA, triangle ADE ∼ triangle ABC.
> Small over big: AD/AB = DE/BC. The whole side AB = 3 + 6 = 9.
> 3/9 = 4/BC, so BC = 12. Check: the big triangle is 3 times the small one, and 4 × 3 = 12.
```

## Congruent: same size too

**Congruent** triangles are exact copies. The tests:

| Test | Equal parts |
|---|---|
| SSS | three sides |
| SAS | two sides and the angle between them |
| ASA, AAS | two angles and one matching side |
| HL | right triangles: hypotenuse and one leg |

Not enough: **AAA** (proves only similar) and **SSA** (the angle isn't between the sides). In "which fact is sufficient" questions, a fact that is always true, like vertical angles, adds nothing.

```quiz
In triangles ABC and DEF, angle A equals angle D and angle B equals angle E. Which extra fact proves the triangles are congruent?
- Angle C equals angle F :: That's already true once two pairs match. Equal angles prove only similar, not congruent.
* AB = DE :: Right. Two angles and the side between them: ASA.
- AB = 2 × DE :: That makes ABC twice as big as DEF. They're similar, but not congruent.
> Two pairs of equal angles already make the triangles similar. A pair of equal matching sides fixes the size too. AB sits between angles A and B, and DE between D and E, so ASA applies.
```

## The trap: equal or 180?

The tempting move is to set any two angle expressions equal. Stop first and decide: are these the **same size** (equal), or one big and one small (**add to 180°**)?

Then reread the last line: they may want x, one of the angles, or a different angle.

```quiz
Lines ℓ and m are parallel, and line t crosses both. The two angles between ℓ and m on the right side of t measure (3x + 15)° and (x + 45)°. What is the measure of the larger angle?
- 60° :: You set the angles equal. Between the lines on the same side of t, angles add to 180°.
- 30° :: That's x. Plug it back in to get the angle.
- 75° :: That's the smaller angle, x + 45.
* 105° :: Right. 4x + 60 = 180, so x = 30 and 3x + 15 = 105.
> Same-side interior angles add to 180°: (3x + 15) + (x + 45) = 180, so 4x = 120 and x = 30.
> The angles are 3(30) + 15 = 105° and 30 + 45 = 75°. The larger one is 105°.
```

## Your turn: easy

Triangle sum first, then share what's left between the two equal angles.

```check
m-1756
```

## Your turn: medium

Name the rule for each step: vertical angles, then parallel lines. Check which angle they want.

```check
m-1735
```

## Your turn: hard

Find two pairs of equal angles, then match the sides by the corners they connect.

```check
m-13342
```

## Recap

- Name the rule before each number: straight line 180°, vertical angles equal, triangle 180°.
- Parallel lines (only when stated): equal, or add to 180°? Decide before writing the equation.
- Isosceles: the equal angles face the equal sides. Exterior angle = the two far inside angles.
- Similar triangles: AA, match corners by letter order, use whole sides, small/big = small/big.
- Congruent needs at least one pair of equal sides. AAA and SSA don't prove it.
- Answer the exact question: x, an angle, or a side.
