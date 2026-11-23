---
title: Lines, Angles, and Triangles
skill: lines-angles-triangles
domain: geometry-trig
section: math
summary: Angle rules, triangle sides, congruent and similar triangles.
---

# Angles and parallel lines
A line is \(180^\circ\). Parallel lines make two sizes.

```visual
lines-angles-triangles--transversal
```

## Key ideas
Two angles are **supplementary** if they add to \(180^\circ\). Angles on a straight line are supplementary. Angles around one point add to \(360^\circ\). **Vertical angles**, the opposite angles where two lines cross, are equal ("congruent" means the same measure).

When a line (a **transversal**) crosses two **parallel** lines, it makes eight angles but only two sizes: every acute angle is equal, every obtuse angle is equal, and an acute plus an obtuse is \(180^\circ\).

\[\text{acute} + \text{obtuse} = 180^\circ\]

The textbook names for equal pairs are corresponding angles and alternate interior angles. Angles on the same side between the lines are supplementary.

The classic trap: two expressions in \(x\) that look like a matching pair. Decide first whether the angles are equal or supplementary by checking which is acute and which is obtuse.

```example
Two parallel lines are cut by a transversal. An acute angle is \((2x + 5)^\circ\) and an obtuse angle is \((3x + 5)^\circ\). Find \(x\).
1. \((2x + 5) + (3x + 5) = 180\) :: Acute plus obtuse is \(180^\circ\).
2. \(5x + 10 = 180\) :: Combine like terms.
3. \(x = 34\) :: Check: \(73^\circ + 107^\circ = 180^\circ\).
```

```theory
Why two sizes? Where the transversal crosses the first parallel line, two lines meet and form a pair of supplementary angles and a pair of vertical angles. The second parallel line is just a copy of the first, shifted along the transversal, so it repeats the same four angles in the same positions. That copy is why the angles are called corresponding angles.

Vocabulary you may meet on the SAT: corresponding angles are in the same position at the two crossings (equal). Alternate interior angles lie between the parallel lines on opposite sides of the transversal (equal). Same-side interior angles lie between the lines on the same side (supplementary). Vertical angles are opposite each other at one crossing (equal). Supplementary means the sum is \(180^\circ\). Complementary means the sum is \(90^\circ\).

If the lines are not parallel, none of these relationships holds, except for vertical angles and angles on a straight line, which always work. So look for the word "parallel" in the problem or an arrow mark on the lines in the figure.

How the SAT writes this: "A line intersects two parallel lines, forming four acute angles and four obtuse angles. The measure of one of the acute angles is \((7x - 120)^\circ\)." The next sentence then asks for a sum of several of the eight angles. Every acute angle is the same size, and every obtuse angle is \(180^\circ\) minus it, so you can name any sum with one expression.

Solving a pair of expressions: if both angles are acute (or both obtuse), set them equal. If one is acute and one is obtuse, add them and set the sum to \(180^\circ\). A quick sanity check at the end: the acute angle must be less than \(90^\circ\) and the obtuse greater than \(90^\circ\).

Extra: angles around a point add to \(360^\circ\). A straight angle is \(180^\circ\), a right angle is \(90^\circ\), and the symbol for "is perpendicular to" means the lines meet at \(90^\circ\).
```

## Easy
```task
Two lines intersect at a point, forming four angles. One of the angles measures \(112^\circ\). What is the measure, in degrees, of the smallest of the four angles?
- 56 :: You halved 112. Subtract it from 180 instead.
- 112 :: That is the largest angle. The other pair is smaller.
* 68
- 248 :: That is 360 minus 112: the other three angles together.
highlight:
- "Two lines intersect at a point, forming four angles" :: Crossing lines: vertical angles are equal, neighbours sum to \(180^\circ\).
- "the smallest of the four angles" :: The smallest is the acute pair, \(180^\circ - 112^\circ\).
explain:
When two lines cross, they form two pairs of vertical angles. Vertical angles are equal, so two of the angles measure \(112^\circ\). Each of these is next to an angle that lies on the same straight line, so the neighbouring angle is supplementary:

\[180^\circ - 112^\circ = 68^\circ\]

The other pair of vertical angles is therefore \(68^\circ\) each. As a check, all four angles add to \(112 + 112 + 68 + 68 = 360\), as angles around a point must.

The smallest angle is \(68^\circ\). The value 56 comes from halving 112, and 248 is \(360 - 112\), the sum of the other three angles.
```

## Medium
```task
A line intersects two parallel lines, forming four acute angles and four obtuse angles. The measure of one acute angle is \((2x + 14)^\circ\), and the measure of one obtuse angle is \((4x - 26)^\circ\). What is the value of \(x\)?
- 20 :: You set them equal. Acute plus obtuse is 180.
* 32
- 28 :: Sign slip: \(14 + (-26)\) is \(-12\), not \(+12\).
- 17 :: You made them add to 90. Supplementary angles add to 180.
highlight:
- "four acute angles and four obtuse angles" :: A transversal and parallel lines: only two sizes exist.
- "one acute angle" :: This is the small size.
- "one obtuse angle" :: This is the large size, so the pair adds to \(180^\circ\), not equal.
explain:
Parallel lines cut by a transversal make only two angle sizes, acute and obtuse, and any acute angle plus any obtuse angle is \(180^\circ\). The two given angles are one of each, so they are supplementary, not equal.

\[(2x + 14) + (4x - 26) = 180\]

Combine like terms: \(6x - 12 = 180\). Add 12 to both sides: \(6x = 192\). Divide by 6: \(x = 32\).

Check: the acute angle is \(2(32) + 14 = 78^\circ\) and the obtuse angle is \(4(32) - 26 = 102^\circ\). They add to \(180^\circ\), and 78 is acute while 102 is obtuse, so the answer makes sense.

If you set them equal you get \(x = 20\), which would make both angles \(54^\circ\), not an acute-obtuse pair.
```

## Hard
```task
bank: m-1911
highlight:
- "four acute angles and four obtuse angles" :: Only two sizes: acute \(a\) and obtuse \(180 - a\).
- "The measure of one of the acute angles is (9x - 560)°" :: Call this \(a\).
- "one of the acute angles and three of the obtuse angles" :: One \(a\) plus three \((180 - a)\).
explain:
All eight angles are one of two sizes. Call the acute size \(a = 9x - 560\). Every obtuse angle is supplementary to it:

\[180 - a = 180 - (9x - 560) = 740 - 9x\]

The sum the question describes is one acute angle plus three obtuse angles:

\[a + 3(180 - a) = (9x - 560) + 3(740 - 9x)\]

Expand: \(9x - 560 + 2220 - 27x\). Combine like terms: \(1660 - 18x\).

The question writes this sum as \(-18x + w\). Matching the constant terms gives \(w = 1660\).

The \(x\)-terms match as a check: \(9x - 27x = -18x\), as the problem says.
```

# Inside a triangle
Angles add to \(180^\circ\). Exterior equals two inside.

```visual
lines-angles-triangles--exterior
```

## Key ideas
The three angles of a triangle add to \(180^\circ\).

\[A + B + C = 180^\circ\]

An **exterior angle** is formed when you extend one side. It equals the sum of the two **remote interior angles**, the two inside angles that do not touch it. It is also \(180^\circ\) minus the inside angle next to it.

An **isosceles** triangle has two equal sides, and the angles opposite them are equal. An **equilateral** triangle has three equal sides, so every angle is \(60^\circ\). In a right triangle the two acute angles add to \(90^\circ\).

More sides: the angles of a polygon with \(n\) sides add to \((n - 2) \cdot 180^\circ\).

The classic trap: "an isosceles triangle has a \(70^\circ\) angle". That angle could be the top angle or one of the two equal base angles, so check both cases.

```example
In \(\triangle ABC\), \(\angle A = 48^\circ\) and \(\angle B = 71^\circ\). Side BC is extended past C. What is the exterior angle at C?
1. \(\angle C = 180 - 48 - 71 = 61\) :: Angles of a triangle add to \(180^\circ\).
2. Exterior \(= 180 - 61 = 119\) :: Next to \(\angle C\) on a straight line.
3. Check: \(48 + 71 = 119\) :: The two remote angles add to it.
```

```theory
Why 180? Draw a line through one corner of the triangle parallel to the opposite side. The two angles that appear on either side of the corner equal the other two triangle angles, because of alternate interior angles. Together with the corner's own angle they make a straight line, \(180^\circ\).

The exterior angle follows from this: the exterior angle and the inside angle at the same corner lie on a straight line, so they add to \(180^\circ\). But the inside angle plus the other two inside angles also adds to \(180^\circ\). So the exterior angle equals the other two inside angles added together.

Isosceles. If the two equal sides meet at a top corner, that is the apex, and the two other corners are the base angles. In an isosceles triangle with apex \(P\) equal to \(70^\circ\), the base angles are each \((180 - 70) \div 2 = 55^\circ\). If instead \(70^\circ\) is a base angle, then the other base angle is \(70^\circ\) too, and the apex is \(40^\circ\). Questions such as "which of these could NOT be an angle of the triangle" test whether you tried every case. So an isosceles triangle with one \(70^\circ\) angle has its other angles equal to \(70^\circ\) and \(40^\circ\), or \(55^\circ\) and \(55^\circ\). A \(90^\circ\) angle cannot appear.

Polygons. Split a polygon with \(n\) sides into triangles by drawing all diagonals from one corner. You get \(n - 2\) triangles, each adding \(180^\circ\). A pentagon has \(3 \cdot 180 = 540^\circ\). If a polygon has equal angles, divide by \(n\) to get each one. The exterior angles of any polygon, one at each corner, add to \(360^\circ\).

Algebra. SAT problems often write the angles as \((4x + 3)^\circ\), \((x + 12)^\circ\) and so on. Add them, set the sum to \(180\), and solve. Double-check by plugging back: every angle should be positive.
```

## Easy
```task
bank: m-1625
highlight:
- "the measure of ∠Xis 24°" :: One angle: 24.
- "the measure of ∠Yis 98°" :: Another angle: 98.
- "What is the measure of ∠Z?" :: The third angle is what is left of \(180^\circ\).
explain:
The three angles of any triangle add to \(180^\circ\). Two of them are given, so subtract their sum from 180.

\[\angle Z = 180^\circ - 24^\circ - 98^\circ = 58^\circ\]

Choice C (122) is the sum of the two given angles, \(24 + 98\). That would be the exterior angle at Z, not \(\angle Z\) itself. Choice D (212) is more than 180, so it is impossible for a triangle's angles.

The measure of \(\angle Z\) is \(58^\circ\), choice A.
```

## Medium
```task
bank: m-1733
highlight:
- "In triangle ABC, the measure of angle A is 50°." :: One angle is 50 degrees.
- "If triangle ABC is isosceles" :: Two angles are equal, but which two is not stated.
- "NOT a possible measure of angle B" :: Try each case. The choice that fits none is the answer.
explain:
An isosceles triangle has two equal angles, but the question does not say which two. Try each case with \(\angle A = 50^\circ\).

Case 1: \(\angle A = \angle B\). Then \(\angle B = 50^\circ\).

Case 2: \(\angle B = \angle C\). Then each is \((180 - 50) \div 2 = 65^\circ\), so \(\angle B = 65^\circ\).

Case 3: \(\angle A = \angle C = 50^\circ\). Then \(\angle B = 180 - 50 - 50 = 80^\circ\).

So \(\angle B\) can be 50, 65 or 80. Could it be 100? Then A and B differ, so the equal pair must be B and C, and two angles of 100 already pass 180. Or A and C are equal at 50 each, which makes B equal to 80, not 100. No case works.

The answer is 100 degrees, choice D.
```

## Hard
```task
bank: m-12039
highlight:
- "the measure of angle P is (3x + 5)°, the measure of angle Q is (2x + 9)°, and the measure of angle R is (4y + 5)°" :: The three inside angles add to 180.
- "side QR is extended through point R to point S" :: This creates an exterior angle at R.
- "the measure of angle PRS is (x + y)°" :: An exterior angle equals P plus Q.
explain:
Extending QR past R creates the exterior angle \(\angle PRS\). An exterior angle equals the sum of the two remote interior angles, which here are \(\angle P\) and \(\angle Q\):

\[x + y = (3x + 5) + (2x + 9) = 5x + 14\]

So \(y = 4x + 14\).

The three inside angles also add to \(180^\circ\), which gives a second equation:

\[(3x + 5) + (2x + 9) + (4y + 5) = 180 \quad\Rightarrow\quad 5x + 4y = 161\]

Substitute \(y = 4x + 14\) into it: \(5x + 16x + 56 = 161\), so \(21x = 105\) and \(x = 5\). Then \(y = 4(5) + 14 = 34\).

The question asks for \(x + y = 5 + 34 = 39\). This works because the exterior angle and the angle sum each supply one equation for the two unknowns.
```

# Triangle sides
Any side is shorter than the other two put together.

```visual
lines-angles-triangles--inequality
```

## Key ideas
The **triangle inequality**: every side is shorter than the sum of the other two sides. If two sides are \(a\) and \(b\), the third side \(c\) must be between their difference and their sum:

\[\lvert a - b \rvert < c < a + b\]

The ends are not allowed. A third side exactly equal to \(a + b\) lies flat and makes no triangle.

Two more facts. The longest side is opposite the largest angle, and the shortest side is opposite the smallest angle. Equal sides sit opposite equal angles.

The classic trap: an isosceles triangle with sides 3 and 10 has perimeter 23 (sides 3, 10, 10), never 16 (sides 3, 3, 10), because \(3 + 3 < 10\).

```example
Two sides of a triangle are 6 and 9. How many whole-number lengths can the third side have?
1. \(9 - 6 < c < 9 + 6\) :: Between the difference and the sum.
2. \(3 < c < 15\) :: Ends not allowed.
3. \(c = 4, 5, \dots, 14\), so 11 values :: Count the whole numbers.
```

```theory
Why the inequality holds. A straight path between two points is the shortest path. In a triangle with corners \(A\), \(B\), \(C\), going from \(A\) to \(B\) directly (side \(c\)) must be shorter than going around through \(C\) (sides \(a\) and \(b\)), so \(c < a + b\). The same argument works for all three sides, but you only need to check the largest side: if the longest side is shorter than the other two put together, the other two cases are automatic.

The lower bound \(\lvert a - b \rvert\) is the same statement rearranged. From \(a < b + c\) you get \(c > a - b\). So the third side is bigger than the difference of the other two (taken as a positive number).

Whole numbers. When a problem asks "how many integer values", count the integers strictly between the bounds. Between 3 and 15 you have 4 through 14, which is 11 values. A common slip is counting the endpoints too, or subtracting incorrectly: the number of integers from \(m\) to \(n\) inclusive is \(n - m + 1\).

Largest angle, longest side. If a triangle has angles of \(40^\circ\), \(60^\circ\) and \(80^\circ\), the longest side faces the \(80^\circ\) angle. This also works in reverse: the largest angle is opposite the longest side. This is how you decide which side is "the base" in some problems, or how you compare two sides when only angles are given.

How the SAT words these: "Which of the following could NOT be the length of the third side?" or "which inequality represents the possible lengths of the third side?" Work out the interval first, then test each choice. Another version asks for the greatest or smallest possible perimeter: use the largest or smallest allowed side, and remember that for integer sides the largest allowed is one less than the sum.

Trap: when a triangle is isosceles, check which equal-sides case works. Always test with the triangle inequality, not just with arithmetic.
```

## Easy
```task
bank: m-16134
highlight:
- "In triangle EFG, EF = 8 and EG = 10." :: Two sides are known: 8 and 10.
- "could NOT be the length of FG" :: Find the allowed range, then pick the value outside it.
explain:
The third side \(FG\) must satisfy the triangle inequality. It has to be longer than the difference of the other two sides and shorter than their sum:

\[10 - 8 < FG < 10 + 8\]

That gives \(2 < FG < 18\). The ends, 2 and 18, are not allowed, because a side of exactly 2 would make the three sides lie flat.

Now test the choices. The values 16, 9 and 3 are all strictly between 2 and 18, so each could be \(FG\). The value 2 is not strictly greater than 2, so it cannot be a side.

The answer is 2, choice D.
```

## Medium
```task
An isosceles triangle has two sides with lengths 5 and 12. What is the perimeter of the triangle?
- 17 :: That is \(5 + 12\). A triangle has three sides.
- 22 :: Sides 5, 5, 12 cannot form a triangle: \(5 + 5 < 12\).
* 29
- 24 :: That is \(12 + 12\). Add the third side, 5.
highlight:
- "isosceles triangle" :: Two sides are equal, so the third is 5 or 12.
- "two sides with lengths 5 and 12" :: Try both cases and test each with the triangle inequality.
explain:
An isosceles triangle has two equal sides, and the two given lengths, 5 and 12, are different. So the repeated side is either 5 or 12. Test both.

Case 1: sides 5, 5, 12. The two short sides add to \(5 + 5 = 10\), which is less than 12. That breaks the triangle inequality, so no triangle exists.

Case 2: sides 5, 12, 12. Check: \(5 + 12 = 17 > 12\), so this works.

The perimeter is \(5 + 12 + 12 = 29\). The value 22 is the trap, because it belongs to the impossible triangle.
```

## Hard
```task
The lengths of two sides of a triangle are 8 and 15. The length of the third side is a whole number \(k\). How many different values of \(k\) are possible?
answer: 15
- 17 :: You counted 7 and 23. Those two ends make no triangle.
- 14 :: You dropped one value. Count all whole numbers from 8 to 22.
highlight:
- "lengths of two sides of a triangle are 8 and 15" :: The third side is between the difference and the sum.
- "is a whole number" :: Only count integers strictly between the two bounds.
- "How many different values" :: Count the integers; the formula is last minus first plus 1.
explain:
By the triangle inequality, the third side is greater than the difference of the other two sides and less than their sum:

\[15 - 8 < k < 15 + 8 \quad\Rightarrow\quad 7 < k < 23\]

Both ends are excluded, so the whole numbers that work run from 8 to 22. The count of whole numbers from \(m\) to \(n\) inclusive is \(n - m + 1\), so here it is \(22 - 8 + 1 = 15\).

A common mistake is to include 7 and 23, which gives 17. A side of 7 would make \(7 + 8 = 15\), so the three sides would lie flat, and the same happens with 23.

The answer is 15.
```

# Congruent triangles
Same size and shape: SSS, SAS, ASA or AAS.

```visual
lines-angles-triangles--congruence
```

## Key ideas
Two triangles are **congruent** if they have the same shape and size. You do not need all six matching parts. These checks are enough:

- **SSS**: all three sides match.
- **SAS**: two sides and the angle **between** them match.
- **ASA**: two angles and the side **between** them match.
- **AAS**: two angles and a side **not** between them match.

Two checks do **not** work. **SSA** (two sides and an angle that is not between them) can fit two different triangles. **AAA** (three equal angles) only gives similar triangles, which can be different sizes.

The classic trap: an answer choice that gives the right number of parts in the wrong arrangement, such as a side next to the angle instead of between two sides.

```example
\(\angle K = \angle R = 55^\circ\), \(\angle L = \angle S = 70^\circ\), and \(KL = RS = 9\). Are triangles KLM and RST congruent?
1. Side KL lies between the angles at K and L :: It is the side between the two angles.
2. Same for RS, between R and S :: The arrangement matches.
3. Congruent by ASA :: Two angles and the included side.
```

```theory
Why these work. If you know SAS, you can draw only one triangle: two sides meeting at a fixed angle, then join the free ends. The third side and the other two angles are forced. ASA and AAS work for a similar reason: two angles fix the third (they add to \(180^\circ\)), so the situation is really angle-side-angle either way. SSS works because three side lengths can close up in only one shape, apart from flipping it over.

Why SSA fails. Fix an angle and the side next to it, then swing the second side around. A side that is long enough to reach the base in two places makes two different triangles. If the known angle is acute and the opposite side is shorter than the adjacent side but longer than the height, there are two triangles. So "two sides and a non-included angle" never proves congruence on the SAT.

Why AAA fails. A tiny triangle and a huge triangle can have the same three angles. They are similar, which is the next topic, but not congruent unless one matching side is also equal.

What a question looks like. The SAT usually gives some equal parts and asks "which additional piece of information is sufficient to prove the triangles congruent?" For each choice, list all the equal parts you would then have, and check whether they match one of the four rules in the right arrangement. Be careful with statements that only describe one triangle (like "angles B and C are equal"): they say nothing about the other triangle.

Corresponding parts of congruent triangles are equal. That is why, once you prove congruence, you can say \(\angle B = \angle E\) or \(BC = EF\).

Hypotenuse and leg: for right triangles, two matching sides (hypotenuse and one leg) are enough. This is a special case of the Pythagorean theorem plus SSS.
```

## Easy
```task
In triangles ABC and DEF, \(\angle A = \angle D\), \(\angle B = \angle E\), and \(BC = EF\). Which of the following proves that triangle ABC is congruent to triangle DEF?
- SAS :: SAS needs two sides and the angle between them.
- SSA :: SSA does not prove congruence.
* AAS
- AAA :: Equal angles give similar triangles, not congruent ones.
highlight:
- "\(\angle A = \angle D\), \(\angle B = \angle E\)" :: Two pairs of equal angles.
- "\(BC = EF\)" :: One pair of equal sides, not between the angles.
explain:
List what is given. There are two pairs of equal angles, \(\angle A = \angle D\) and \(\angle B = \angle E\), and one pair of equal sides, \(BC = EF\).

Where is the side? Side BC runs from B to C. It touches \(\angle B\) but not \(\angle A\), so it is not between the two given angles. Two angles and a side that is not between them is the rule **AAS**.

Why not the others? SAS would need two sides and the angle between them, and there is only one side. SSA is not a valid rule. AAA only proves that the triangles are similar.

The answer is AAS.
```

## Medium
```task
bank: m-1638
highlight:
- "angles B and E each have measure 27° and angles C and F each have measure 41°" :: Two equal angle pairs, so the triangles are at least similar.
- "sufficient to determine whether triangle ABC is congruent to triangle DEF" :: Congruence needs one matching side as well.
explain:
Two pairs of equal angles (\(27^\circ\) and \(41^\circ\)) make the triangles similar, but not necessarily congruent: a small and a large triangle can have the same angles. To prove congruence you need one pair of matching sides as well.

Which side? The two known angles are at B and C, so the side between them is BC. Knowing the lengths of BC and EF tells you whether the sides between the matching angles are equal. If they are equal, the triangles are congruent by ASA. If not, they are not congruent.

Choice B gives the length of one side of one triangle only, which cannot be compared. Choice A adds nothing, because \(\angle A\) is already forced to be \(112^\circ\) by the angle sum.

The answer is choice C.
```

## Hard
```task
bank: m-11644
highlight:
- "sides AB and DE each have a side length of 6 inches and angles A and D each have an angle measure of 40°" :: Given: one equal side pair and one equal angle pair at A and D.
- "sufficient to prove whether triangle ABC is congruent to triangle DEF" :: Check which statement completes SAS, ASA or AAS.
- "II. The lengths of sides AC and DF are equal." :: Sides AB and AC enclose angle A, so this gives SAS.
explain:
Known: \(AB = DE = 6\) and \(\angle A = \angle D = 40^\circ\). Angle A sits between sides AB and AC, and angle D sits between DE and DF.

Statement I says angles B and C are equal. That only describes triangle ABC and says nothing about triangle DEF, so it cannot prove anything.

Statement II says \(AC = DF\). Now both triangles have two sides and the angle between them equal, which is SAS. So II is sufficient.

Statement III says \(BC = EF\). The angle \(40^\circ\) is not between AB and BC, so this is side-side-angle. SSA can fit two different triangles, so III is not sufficient.

Only II works, so the answer is choice B.
```

# Similar triangles
Same angles, proportional sides.

```visual
lines-angles-triangles--aa
```

## Key ideas
Two triangles are **similar** if their angles are equal and their sides are in the same ratio \(k\). Matching sides lie opposite equal angles. Any one of these proves similarity:

- **AA**: two angles match (the third is forced).
- **SAS**: two pairs of sides are in the same ratio and the angle between them matches.
- **SSS**: all three pairs of sides are in the same ratio.

For similar triangles with scale factor \(k\), sides and perimeters scale by \(k\), and areas by \(k^2\).

A line parallel to one side of a triangle cuts off a small triangle that is similar to the big one:

\[\frac{AD}{AB} = \frac{AE}{AC} = \frac{DE}{BC}\]

Use the small side over the **whole** side (\(AD\) over \(AB\)), not the small piece over the leftover piece, when you are comparing with \(DE\) and \(BC\).

```example
\(DE \parallel BC\), with D on AB and E on AC. \(AD = 4\), \(AB = 10\), \(BC = 15\). Find DE.
1. \(\triangle ADE \sim \triangle ABC\) :: Shared angle A, and parallel lines make equal angles.
2. \(\frac{DE}{BC} = \frac{AD}{AB} = \frac{4}{10}\) :: Small side over whole side.
3. \(DE = 15 \cdot \frac{4}{10} = 6\) :: Multiply 15 by the ratio.
```

```theory
Why AA is enough. The angles of a triangle add to \(180^\circ\), so two matching angles force the third to match as well. With all three angles equal, the shape is fixed and only the size can change, which is exactly what similar means. That is why the SAT often gives just two angles and asks you to conclude similarity.

Why SAS and SSS work for similarity. If two sides are scaled by the same factor and the angle between them is unchanged, the third side must also scale by that factor. If all three sides scale by the same factor, the angles cannot change.

Parallel line inside a triangle. A line \(DE\) parallel to \(BC\) makes \(\angle ADE = \angle ABC\) (corresponding angles) and shares \(\angle A\), so \(\triangle ADE \sim \triangle ABC\) by AA. All the proportions from similarity then apply. Pieces also work: \(\frac{AD}{DB} = \frac{AE}{EC}\). But \(\frac{AD}{DB}\) does not equal \(\frac{DE}{BC}\); to compare \(DE\) with \(BC\) you need \(AD\) with the whole \(AB\).

Perimeter and area. If the scale factor is 3, then perimeters are 3 times larger and areas are 9 times larger. If the areas have ratio 25, the sides have ratio 5, because \(\sqrt{25} = 5\). Another common trap: the ratio of two sides must be computed for **corresponding** sides, so write a small table: small triangle sides on one row, big triangle sides below, and divide.

On the SAT, the question may also give a right triangle cut by a line parallel to a leg. Then the small and large triangles are similar, and you can find missing pieces. If the area of the whole triangle is given, use \(\frac{1}{2}bh\) to get a missing side first, as in the hard task below.

Language: "triangle ABC is similar to triangle XYZ" is written \(\triangle ABC \sim \triangle XYZ\). When the problem says "A, B and C correspond to X, Y and Z, respectively", it tells you which sides and angles match.
```

## Easy
```task
bank: m-1743
highlight:
- "AB and DE are corresponding sides" :: AB matches DE, so \(k = 2\).
- "DE = 2AB" :: Sides of DEF are twice as long.
- "the perimeter of triangle ABC is 20" :: Perimeter scales by the same factor as the sides.
explain:
Similar triangles have all their lengths in the same ratio. Since AB and DE are corresponding sides and \(DE = 2AB\), the scale factor from ABC to DEF is \(k = 2\).

A perimeter is a sum of lengths, so it scales by \(k\), not by \(k^2\):

\[\text{perimeter of } DEF = 2 \cdot 20 = 40\]

Choice C (80) would be the result if you used \(k^2 = 4\), which is the factor for areas, not for perimeters. Choice A (10) divides instead of multiplying. The perimeter of triangle DEF is 40, choice B.
```

## Medium
```task
bank: m-1642
highlight:
- "angles L and R each have measure 60°" :: One matching angle pair: 60.
- "sufficient to prove that triangle LMN is similar to triangle RST" :: Find a second equal angle pair for AA.
explain:
Triangle LMN and triangle RST already share one pair of equal angles, \(\angle L = \angle R = 60^\circ\). The quickest way to prove similarity is AA, which needs a second pair of equal angles.

Check choice D: if \(\angle M = 70^\circ\) and \(\angle T = 50^\circ\), then \(\angle N = 180 - 60 - 70 = 50^\circ\) and \(\angle S = 180 - 60 - 50 = 70^\circ\). Both triangles then have angles \(60^\circ\), \(70^\circ\) and \(50^\circ\), so they are similar by AA.

Choice C gives triangle RST two angles of \(60^\circ\), which does not match triangle LMN. Choices A and B give a side from each triangle, but not the sides next to the \(60^\circ\) angle, so they do not give SAS.

The answer is choice D.
```

## Hard
```task
bank: m-1805
highlight:
- "angle T is a right angle" :: RT and ST are the legs, so the area is \(\tfrac{1}{2}(RT)(ST)\).
- "LK is parallel to RT" :: Small triangle SKL is similar to big triangle STR.
- "the length of RT is 72 units, the length of LK is 24 units, and the area of triangle RST is 792 square units" :: The ratio \(24 : 72\) is \(1 : 3\). The area gives side ST.
explain:
The right angle is at T, so RT and ST are the legs of the big triangle. Use the area to find ST:

\[\tfrac{1}{2}(72)(ST) = 792 \quad\Rightarrow\quad ST = 22\]

Because LK is parallel to RT, the small triangle SKL is similar to the big triangle STR. The ratio of the matching sides LK and RT is

\[\frac{24}{72} = \frac{1}{3}\]

So \(SK = \tfrac{1}{3}(22) = \tfrac{22}{3}\). The segment KT is what remains of side ST after removing SK:

\[KT = 22 - \tfrac{22}{3} = \tfrac{44}{3}\]

Enter 44/3 (or 14.66 or 14.67).
```

# Trap: matching sides
Match sides by equal angles, not letter order.

```visual
lines-angles-triangles--similar
```

## Key ideas
Before you write a proportion, decide which sides match. Corresponding sides lie opposite equal angles.

On the SAT, the match is usually spelled out: "\(A\), \(B\) and \(C\) correspond to \(X\), \(Y\) and \(Z\), **respectively**" means \(A \leftrightarrow X\), \(B \leftrightarrow Y\), \(C \leftrightarrow Z\). Then side \(AB\) matches \(XY\), and \(BC\) matches \(YZ\).

If the match is **not** spelled out, do not trust the order of the letters. Find the equal angles and match by those. The longest side matches the longest side, and the shortest matches the shortest.

\[\frac{\text{side of one triangle}}{\text{matching side of the other}} = k\]

The classic trap: writing \(\frac{AB}{XY} = \frac{BC}{XZ}\) because the letters look similar. Write the correspondence first, then the ratios.

```example
\(\triangle PQR \sim \triangle XYZ\), where \(P\), \(Q\), \(R\) correspond to \(Z\), \(Y\), \(X\). \(PQ = 6\), \(QR = 9\), \(ZY = 15\). Find YX.
1. \(PQ \leftrightarrow ZY\) and \(QR \leftrightarrow YX\) :: Read each pair off the correspondence.
2. \(k = \frac{15}{6} = 2.5\) :: Big over small.
3. \(YX = 9 \cdot 2.5 = 22.5\) :: Scale \(QR\).
```

```theory
Why order can mislead. In "triangle ABC is similar to triangle DEF" the letters often come in matching order, but the SAT does not promise it. The official guide even says that the order of the vertices does not necessarily show how they correspond, which is why problems add the words "respectively" or "A corresponds to D". Always take the correspondence from the text of the problem, or from the equal angles in the figure, never from how the names look.

A reliable method. Write the correspondence as two rows, for example top row P, Q, R and bottom row U, T, S. Each column is a matching pair. Then every side is a pair of letters from one row and the matching pair from the other: \(PQ\) matches \(UT\), \(QR\) matches \(TS\), \(PR\) matches \(US\).

Another reliable check: the side opposite the matching angle. If \(\angle P = \angle U\), then the side opposite P (that is QR) matches the side opposite U (that is TS).

Setting up the proportion. Put the same triangle on the same side of the fraction each time: \(\frac{\text{triangle 1 side}}{\text{triangle 2 side}} = \frac{\text{triangle 1 side}}{\text{triangle 2 side}}\). Flipping one fraction upside down, as in \(\frac{AB}{XY} = \frac{ZY}{BC}\), is the most common mistake and produces a wrong answer that appears in the choices.

Parallel lines. When a line cuts a triangle parallel to a side, the small triangle shares a vertex with the large one, and the match goes with the shared vertex: in \(\triangle XBY\) inside \(\triangle ABC\) with \(XY \parallel AC\), side BY matches BC and side XY matches AC. A frequent slip is to pair BY with AC.

Check by size: the match must make the longest side correspond to the longest. If your answer makes the "small" triangle larger than the "big" one, you flipped the ratio.
```

## Easy
```task
bank: m-1698
highlight:
- "X, Y, and Z correspond to R, S, and T, respectively" :: Z matches T. Read the correspondence from the text.
- "The measure of ∠Z is 20°" :: Angle Z is 20 degrees.
- "What is the measure of ∠T?" :: Matching angles in similar triangles are equal.
explain:
The sentence tells you exactly how the triangles match: X goes with R, Y with S and Z with T. So \(\angle Z\) corresponds to \(\angle T\).

Corresponding angles of similar triangles are equal, so \(\angle T = \angle Z = 20^\circ\).

The extra condition \(2XY = RS\) is about the sides: it says triangle RST is twice as large as triangle XYZ. A scale factor changes lengths, never angles, so it does not affect \(\angle T\).

The answer is \(20^\circ\), choice C.
```

## Medium
```task
bank: m-15214
highlight:
- "DE is parallel to AC" :: The small triangle DBE is similar to ABC.
- "BD = AD" :: D is the midpoint of AB, so the ratio is 1 to 2.
- "BE = 9, and AC = 17" :: BE matches BC. AC matches DE, not BE.
explain:
Because DE is parallel to AC, triangle DBE is similar to triangle ABC. They share the angle at B, and the parallel lines give equal angles at D and A.

Next, find the ratio. \(BD = AD\), so D is the midpoint of AB and

\[\frac{BD}{BA} = \frac{1}{2}\]

The matching side to BE (in the small triangle) is BC (in the big one), so \(\frac{BE}{BC} = \frac{1}{2}\) as well. With \(BE = 9\), that gives \(BC = 18\).

The trap is the length 17. AC matches DE, not BE, so doubling 17 to get 34 (choice B) pairs the wrong sides. The answer is 18, choice D.
```

## Hard
```task
Triangle ABC is similar to triangle DEF, where A, B, and C correspond to F, E, and D, respectively. AB = 12, BC = 20, and EF = 9. What is the length of DE?
answer: 15
- 5.4 :: You matched DE with AB. D corresponds to C.
- 80/3 :: You flipped the ratio. Scale down: DE is shorter than BC.
highlight:
- "A, B, and C correspond to F, E, and D, respectively" :: A goes to F, B to E, C to D.
- "AB = 12, BC = 20, and EF = 9" :: AB matches FE. BC matches ED.
- "length of DE" :: DE is the same segment as ED, so it matches BC.
explain:
Start with the correspondence: A goes with F, B with E, C with D. Write each side of triangle ABC with its match:

\[AB \leftrightarrow FE, \qquad BC \leftrightarrow ED, \qquad AC \leftrightarrow FD\]

The known pair is \(AB = 12\) and \(FE = 9\), so the scale factor from ABC to DEF is

\[k = \frac{9}{12} = \frac{3}{4}\]

The side we want, DE (which is the same segment as ED), matches BC. So

\[DE = 20 \cdot \tfrac{3}{4} = 15\]

If you had matched DE with AB because of the letters D-E and A-B, you would get a different, wrong number.
```
