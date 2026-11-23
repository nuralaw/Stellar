---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Pythagorean theorem, special triangles, sine, cosine, tangent and radians.
---

# Pythagorean theorem
Square the legs, add, and you get the hypotenuse squared.

```visual
right-triangles-trig--pythagoras
```

## Key ideas
In a right triangle, the **hypotenuse** is the longest side, the one opposite the right angle. The other two sides are the **legs**. The reference sheet gives the theorem:

\[a^2 + b^2 = c^2\]

Here \(a\) and \(b\) are the legs and \(c\) is the hypotenuse. Use it to find any missing side. To find a leg, subtract: \(a^2 = c^2 - b^2\).

Some whole-number sets (**Pythagorean triples**) show up again and again, together with their multiples:

- 3, 4, 5 (and 6, 8, 10; 9, 12, 15; 15, 20, 25)
- 5, 12, 13 (and 10, 24, 26)
- 8, 15, 17 and 7, 24, 25

Spot a triple and skip the squaring. A rectangle's diagonal is a hypotenuse, so the same rule applies.

The classic trap: forgetting the square root. If \(c^2 = 130\), the side is \(\sqrt{130}\), not 130.

```example
A rectangle is 15 by 20. How long is its diagonal?
1. \(15 = 5 \cdot 3\) and \(20 = 5 \cdot 4\) :: This is a 3-4-5 triangle, scaled by 5.
2. \(c = 5 \cdot 5 = 25\) :: Scale the hypotenuse 5 as well.
3. Check: \(15^2 + 20^2 = 225 + 400 = 625 = 25^2\) :: It works.
```

```theory
Why it works. Draw a square on each side of a right triangle. The areas of the two small squares, \(a^2\) and \(b^2\), together equal the area of the big square on the hypotenuse, \(c^2\). That is the theorem. It only holds for right triangles, so check for a right angle (or the words "right triangle") before you use it.

Which side is which. The hypotenuse is always across from the right angle and is always the longest side. If you are given two sides and one of them is longer than the other, check whether the longer one is a leg or the hypotenuse. If the problem tells you the hypotenuse, find the missing leg by subtracting. Adding the squares when you should subtract (or the reverse) gives an answer that is too big or too small, and it often appears among the choices.

Recognising triples. If two sides of a right triangle form a triple, the third is automatic. For legs 9 and 40 the hypotenuse is 41, because \(81 + 1600 = 1681\). Multiples work too: legs 30 and 40 have hypotenuse 50.

Where the theorem hides. A rectangle with sides 9 and 12 has diagonal 15. A square with side \(s\) has diagonal \(s\sqrt{2}\). The distance between two points on a coordinate plane is also a hypotenuse: the horizontal and vertical differences are the legs. A ladder against a wall, a ramp, a kite string and a slanted roof are right triangles in word problems.

Non-integer answers. Many SAT answers stay in radical form: \(\sqrt{7^2 + 6^2} = \sqrt{85}\). To simplify, pull out perfect-square factors: \(\sqrt{1184} = \sqrt{16 \cdot 74} = 4\sqrt{74}\).

Multi-step problems. When something changes (a ladder slides, a pole is moved), you can have two right triangles, and you must use the theorem twice. Draw each one and write down which side stays the same, usually the ladder's length, which is the hypotenuse both times.
```

## Easy
```task
bank: m-1815
highlight:
- "A right triangle has legs with lengths of 11 centimeters and 9 centimeters" :: Two legs: \(a = 11\) and \(b = 9\).
- "hypotenuse" :: The unknown is the longest side, \(c\).
explain:
The two given sides are the legs, and the question asks for the hypotenuse, so use the Pythagorean theorem from the reference sheet:

\[c^2 = a^2 + b^2 = 11^2 + 9^2 = 121 + 81 = 202\]

Take the square root to get the side itself:

\[c = \sqrt{202}\]

Choice D (202) forgets the square root, so it is \(c^2\) rather than \(c\). Choice C (20) simply adds the legs, which is wrong because the hypotenuse is shorter than the sum of the legs. The hypotenuse is \(\sqrt{202}\) centimeters, choice B.
```

## Medium
```task
bank: m-1850
highlight:
- "The length of a rectangle’s diagonal is 5sqrt(17)" :: The diagonal is the hypotenuse of a right triangle.
- "the length of the rectangle’s shorter side is 5" :: One leg is 5.
- "What is the length of the rectangle’s longer side?" :: Find the other leg.
explain:
A rectangle's diagonal cuts it into two right triangles, with the two sides of the rectangle as legs and the diagonal as the hypotenuse. Let \(L\) be the longer side. Then

\[5^2 + L^2 = \left(5\sqrt{17}\right)^2\]

The right side is \(25 \cdot 17 = 425\). So \(25 + L^2 = 425\), which gives \(L^2 = 400\).

Take the square root: \(L = 20\).

Choice D (400) is \(L^2\), not \(L\). Choice A, \(\sqrt{17}\), only divides the diagonal by 5. The longer side is 20, choice B.
```

## Hard
```task
A 25-foot ladder leans against a vertical wall. The base of the ladder is 7 feet from the wall. The top of the ladder slides down the wall 4 feet. How many feet farther from the wall is the base of the ladder after the slide?
answer: 8
- 4 :: That is how far the top slid. The base moves differently.
- 15 :: That is the new distance from the wall. Subtract the old 7.
highlight:
- "A 25-foot ladder leans against a vertical wall" :: The ladder is the hypotenuse both times: 25.
- "The base of the ladder is 7 feet from the wall" :: First triangle: legs 7 and \(h\).
- "slides down the wall 4 feet" :: The new height is the old height minus 4.
explain:
The ladder, the wall and the ground form a right triangle with the ladder as the hypotenuse. It has the same length, 25 feet, before and after the slide, so use the theorem twice.

Before: the base is 7 feet out, so the height is \(\sqrt{25^2 - 7^2} = \sqrt{576} = 24\) feet. (This is the 7-24-25 triple.)

After: the top is 4 feet lower, so the height is \(24 - 4 = 20\) feet. The base distance is now

\[\sqrt{25^2 - 20^2} = \sqrt{225} = 15\]

(This is the 15-20-25 triple, which is 3-4-5 times 5.) The base moved from 7 to 15 feet, so it moved \(15 - 7 = 8\) feet farther from the wall.
```

# Special right triangles
Two shapes with fixed side ratios.

```visual
right-triangles-trig--special
```

## Key ideas
The reference sheet gives two right triangles whose sides come in fixed ratios. Name the shortest side \(x\).

\[45^\circ\text{-}45^\circ\text{-}90^\circ:\quad x,\ x,\ x\sqrt{2} \qquad 30^\circ\text{-}60^\circ\text{-}90^\circ:\quad x,\ x\sqrt{3},\ 2x\]

In the 45-45-90 triangle the two legs are equal, and the hypotenuse is a leg times \(\sqrt{2}\). It is half of a square cut along its diagonal. The 30-60-90 triangle is half of an equilateral triangle. The short leg \(x\) sits opposite \(30^\circ\), the longer leg \(x\sqrt{3}\) opposite \(60^\circ\), and the hypotenuse \(2x\) opposite \(90^\circ\).

Trap: match the side to its angle. The smallest side faces the smallest angle. And an equilateral triangle's height is \(\frac{\sqrt{3}}{2}\) times its side.

```example
An equilateral triangle has side 10. What is its height?
1. Drop the height: two 30-60-90 triangles :: It splits the triangle in half.
2. Hypotenuse \(2x = 10\), so \(x = 5\) :: The short leg is half the side.
3. Height \(= x\sqrt{3} = 5\sqrt{3}\) :: The longer leg faces \(60^\circ\).
```

```theory
Where the ratios come from. Cut a square along its diagonal. You get two 45-45-90 triangles. If the side of the square is \(x\), the Pythagorean theorem gives the diagonal \(\sqrt{x^2 + x^2} = x\sqrt{2}\). Cut an equilateral triangle of side \(2x\) down the middle with its height. You get two 30-60-90 triangles with hypotenuse \(2x\) and short leg \(x\). The height is \(\sqrt{(2x)^2 - x^2} = x\sqrt{3}\).

How to use them. If you know one side, identify which side it is (short leg, long leg, hypotenuse, or a leg of the 45 triangle) and read off the others. Going from a leg to the hypotenuse of a 45-45-90 triangle you multiply by \(\sqrt{2}\); going back from the hypotenuse to a leg you divide by \(\sqrt{2}\), which is the same as multiplying by \(\frac{\sqrt{2}}{2}\). A hypotenuse of 58 gives legs of \(\frac{58}{\sqrt{2}} = 29\sqrt{2}\).

Equilateral triangle formulas. Side \(s\): height \(\frac{s\sqrt{3}}{2}\), area \(\frac{s^2\sqrt{3}}{4}\), all angles \(60^\circ\). If the height is given, divide by \(\frac{\sqrt{3}}{2}\), or equivalently multiply by \(\frac{2}{\sqrt{3}}\), to find the side. When a height is \(9\sqrt{3}\), the side is 18.

Perimeter puzzles. For an isosceles right triangle with legs \(s\), the perimeter is \(2s + s\sqrt{2} = s(2 + \sqrt{2})\). If a problem gives the perimeter in the form \(30 + 30\sqrt{2}\), you can factor it as \(15\sqrt{2}(\sqrt{2} + 2)\) to read off the leg, or divide each term by the matching ratio.

Other approach: when answer choices contain radicals, plug a choice back in. The result must satisfy both the ratio and the given condition.

Traps: attaching \(\sqrt{3}\) to the wrong side, using the 45 ratio for a 30-60-90 triangle, and forgetting that the shortest side faces the smallest angle.
```

## Easy
```task
In a right triangle, the angles measure \(30^\circ\), \(60^\circ\), and \(90^\circ\). The shortest side of the triangle has length 7. What is the length of the hypotenuse?
- 7\(\sqrt{3}\) :: That is the longer leg. The hypotenuse is longer.
- 7\(\sqrt{2}\) :: That ratio is for a 45-45-90 triangle.
* 14
- 21 :: You multiplied by 3. The hypotenuse is twice the short leg.
highlight:
- "angles measure \(30^\circ\), \(60^\circ\), and \(90^\circ\)" :: A 30-60-90 triangle: sides \(x\), \(x\sqrt{3}\), \(2x\).
- "The shortest side" :: The shortest side is opposite \(30^\circ\), so \(x = 7\).
- "length of the hypotenuse" :: The hypotenuse is \(2x\).
explain:
The reference sheet gives the sides of a 30-60-90 triangle as \(x\), \(x\sqrt{3}\) and \(2x\). The shortest side is opposite the \(30^\circ\) angle, so it is the \(x\) side, and \(x = 7\).

The hypotenuse is always the longest side and equals \(2x\):

\[2x = 2 \cdot 7 = 14\]

The other choices are traps. The length \(7\sqrt{3}\) is the longer leg, opposite \(60^\circ\). The length \(7\sqrt{2}\) uses the 45-45-90 ratio. The value 21 multiplies by 3 for no reason.

The hypotenuse is 14.
```

## Medium
```task
bank: m-13334
highlight:
- "An equilateral triangle has a height of 47sqrt(3) units" :: The height splits the triangle into two 30-60-90 triangles.
- "one side of this triangle" :: The side is the hypotenuse \(2x\) of each half.
explain:
Drop the height of the equilateral triangle. It splits the triangle into two 30-60-90 triangles, and the height is the longer leg, opposite the \(60^\circ\) angle. If the side of the equilateral triangle is \(s\), then the hypotenuse of each half is \(s\), the short leg is \(\frac{s}{2}\), and the longer leg is \(\frac{s}{2}\sqrt{3}\).

Set the longer leg equal to the given height:

\[\frac{s}{2}\sqrt{3} = 47\sqrt{3}\]

Divide both sides by \(\sqrt{3}\): \(\frac{s}{2} = 47\), so \(s = 94\).

Choice D (47) is only half of a side, and choice C repeats the height. The side is 94 units, choice B.
```

## Hard
```task
bank: m-13042
highlight:
- "The perimeter of an isosceles right triangle" :: Legs are equal; the hypotenuse is a leg times \(\sqrt{2}\).
- "52 + 52√2 inches" :: Write the perimeter as \(s(2 + \sqrt{2})\) and solve for \(s\).
- "length, in inches, of the hypotenuse" :: The question asks for the hypotenuse, not a leg.
explain:
An isosceles right triangle is a 45-45-90 triangle. Let each leg be \(s\). The hypotenuse is \(s\sqrt{2}\), so the perimeter is

\[s + s + s\sqrt{2} = s(2 + \sqrt{2})\]

Set it equal to the given perimeter and solve for \(s\):

\[s(2 + \sqrt{2}) = 52 + 52\sqrt{2}\]

Notice that \(52 + 52\sqrt{2} = 26\sqrt{2}(\sqrt{2} + 2)\), because \(26\sqrt{2} \cdot \sqrt{2} = 52\) and \(26\sqrt{2} \cdot 2 = 52\sqrt{2}\). So \(s = 26\sqrt{2}\).

The hypotenuse is \(s\sqrt{2} = 26\sqrt{2} \cdot \sqrt{2} = 52\). Choice B, \(26\sqrt{2}\), is only a leg. The answer is 52, choice C.
```

# SOH-CAH-TOA
Pick the ratio from the sides you know.

```visual
right-triangles-trig--ratios
```

## Key ideas
In a right triangle, the trig ratios compare two sides of an acute angle. The reference sheet does **not** give them, so memorise **SOH-CAH-TOA**:

\[\sin A = \frac{\text{opposite}}{\text{hypotenuse}} \qquad \cos A = \frac{\text{adjacent}}{\text{hypotenuse}} \qquad \tan A = \frac{\text{opposite}}{\text{adjacent}}\]

From angle \(A\): the **opposite** side is across from \(A\). The **adjacent** side is the leg that touches \(A\), not the hypotenuse (the hypotenuse touches \(A\) too, but it is never "adjacent"). The hypotenuse faces the right angle.

Move to the other acute angle and "opposite" and "adjacent" swap. Label the sides again for each angle.

The ratios only work in right triangles. If a question gives one ratio, build the triangle: \(\sin A = \frac{8}{17}\) means opposite 8, hypotenuse 17, and the missing leg comes from the Pythagorean theorem.

```example
In right triangle \(ABC\), the right angle is at \(C\), \(AB = 10\) and \(BC = 6\). Find \(\tan A\).
1. \(BC\) is opposite \(A\) :: It is across from \(A\).
2. \(AC = \sqrt{10^2 - 6^2} = 8\) :: The other leg (a 3-4-5 triple, doubled).
3. \(\tan A = \frac{6}{8} = \frac{3}{4}\) :: Opposite over adjacent.
```

```theory
Naming the sides. Hold the angle you are using and look at the three sides. The hypotenuse is the long one opposite the right angle. The opposite side does not touch the angle: it is on the far side. The adjacent side is the remaining leg, the one that forms the angle together with the hypotenuse. Adjacent just means "next to" but in this context it means the leg, so the hypotenuse is excluded.

Why the ratios are fixed. All right triangles with the same acute angle are similar, so the ratio of any two of their sides is the same, whatever the size. That is why \(\sin 30^\circ\) is always \(\frac{1}{2}\): the opposite side of a 30-60-90 triangle is half the hypotenuse.

Using a given ratio. A ratio tells you the shape, not the actual lengths. If \(\cos A = \frac{3}{5}\), the sides may be 3, 4, 5, or 6, 8, 10, or 30, 40, 50. Use the ratio to get a second ratio (for example \(\sin A = \frac{4}{5}\)), or to scale: if the hypotenuse is really 20, then the adjacent side is \(\frac{3}{5} \cdot 20 = 12\).

Finding a side with a ratio. For a triangle with a known angle, write the ratio that has the known side and the unknown side, then solve. For instance, if the adjacent side is 18 and you want the opposite side of a \(41^\circ\) angle, use \(\tan 41^\circ = \frac{\text{opposite}}{18}\), so the opposite side is \(18 \tan 41^\circ\). SAT problems sometimes leave answers in the form \(k \tan 41^\circ\) and ask for \(k\).

Calculators. When the angle is in degrees, use degree mode (or type the degree sign in Desmos). Radian mode gives a different answer.

Traps: using "adjacent" for the hypotenuse, swapping opposite and adjacent when you move to the other angle, and treating a ratio like \(\frac{11}{60}\) as the actual side lengths.
```

## Easy
```task
bank: m-17140
highlight:
- "angle C measures 90°" :: The right angle is at C, so the hypotenuse is AB.
- "cos(A) = 5/13" :: Adjacent to A is 5, hypotenuse is 13.
- "what is the value of tan(A)?" :: Tangent is opposite over adjacent. Find the opposite side.
explain:
Cosine is adjacent over hypotenuse, so \(\cos A = \frac{5}{13}\) tells you the side next to \(A\) is 5 and the hypotenuse is 13 (or a multiple of these). The missing side is the one opposite \(A\), and the Pythagorean theorem gives it:

\[\text{opposite} = \sqrt{13^2 - 5^2} = \sqrt{144} = 12\]

Now tangent is opposite over adjacent:

\[\tan A = \frac{12}{5}\]

Choice B, \(\frac{5}{12}\), is the tangent of the other acute angle. The answer is \(\frac{12}{5}\), choice A.
```

## Medium
```task
bank: m-1599
highlight:
- "angle Z is a right angle and the length of YZ is 24 units" :: YZ is a leg, and it is opposite angle X.
- "tan X = 12/35" :: Opposite over adjacent: \(YZ\) over \(XZ\).
- "perimeter, in units, of triangle XYZ" :: You need all three sides.
explain:
Angle Z is the right angle, so XY is the hypotenuse. From angle X, the side YZ is opposite and XZ is adjacent. Tangent is opposite over adjacent:

\[\tan X = \frac{YZ}{XZ} = \frac{12}{35}\]

The ratio is not the actual lengths. Since \(YZ = 24 = 2 \cdot 12\), the triangle is scaled by 2, so \(XZ = 2 \cdot 35 = 70\).

The hypotenuse is \(XY = \sqrt{24^2 + 70^2} = \sqrt{5{,}476} = 74\).

The perimeter is \(24 + 70 + 74 = 168\). Choice C (84) is the perimeter of the unscaled 12-35-37 triangle; the real triangle is twice as large. The answer is 168, choice B.
```

## Hard
```task
bank: m-1640
highlight:
- "angle Y is a right angle" :: The legs are XY and YZ.
- "the length of YZ is 26 units" :: YZ touches the \(33^\circ\) angle at Z, so it is adjacent.
- "k tan 33°" :: Opposite \(= 26 \tan 33^\circ\). Put it in the area formula.
explain:
The right angle is at Y, so XY and YZ are the legs. The area is \(\tfrac{1}{2}(XY)(YZ)\). We know \(YZ = 26\) but not \(XY\).

From angle Z, the side YZ touches the angle, so it is the adjacent side, and XY is across from it, the opposite side. Tangent links them:

\[\tan 33^\circ = \frac{XY}{26} \quad\Rightarrow\quad XY = 26 \tan 33^\circ\]

Now the area is

\[\tfrac{1}{2} \cdot 26 \cdot 26 \tan 33^\circ = 338 \tan 33^\circ\]

The area has the form \(k \tan 33^\circ\), so \(k = 338\).
```

# Same angle, same ratio
Similar right triangles share their sine, cosine and tangent.

```visual
right-triangles-trig--similar
```

## Key ideas
If two right triangles are similar, matching angles are equal, so their trig values match: if angle \(A\) matches angle \(D\), then \(\sin A = \sin D\), \(\cos A = \cos D\), \(\tan A = \tan D\).

A scale factor changes lengths only, never angles, so a long "3 times as big" remark is a distraction.

A trig ratio gives the shape of a triangle up to scale. It is **not** the real side lengths. If \(\cos A = \frac{8}{17}\), the sides are \(8k\), \(15k\), \(17k\) for some scale \(k\). Use a given real length to find \(k\), then the length you need.

\[\text{sides} = (8k,\ 15k,\ 17k)\]

The classic trap: reading \(\frac{8}{17}\) as "the side is 8". Always ask which real length is known, and solve for \(k\).

```example
In right triangle \(ABC\), the right angle is at \(B\), \(\cos A = \frac{4}{5}\), and \(AC = 30\). Find \(AB\).
1. \(\cos A = \frac{AB}{AC} = \frac{4}{5}\) :: Adjacent over hypotenuse.
2. Hypotenuse \(5k = 30\), so \(k = 6\) :: Scale factor.
3. \(AB = 4k = 24\) :: Use the same \(k\).
```

```theory
Why the ratios match. Two right triangles with one equal acute angle have all three angles equal, because the right angles are equal and the angles add to \(180^\circ\). By the AA rule they are similar, so all their side ratios are the same. A trig ratio is just a ratio of sides, so it is the same for the two triangles.

The SAT turns this into questions like: "Triangle ABC is similar to triangle DEF, where A corresponds to D and C and F are right angles. If \(\tan A = \frac{9}{40}\), what is \(\sin D\)?" The sizes do not matter: \(D\) matches \(A\), so \(\tan D = \tan A\). Then build one triangle with legs 9 and 40 (hypotenuse 41, since \(9^2 + 40^2 = 1681 = 41^2\)). So \(\sin D = \frac{9}{41}\).

Check which letters match. Match by correspondence, as in the lesson on similar triangles. In this question, \(D\) corresponds to \(A\) and \(E\) to \(B\). So \(\cos B = \cos E\), not \(\cos D\). A very common mistake is to compare the wrong pair of angles.

Using scale. When a real side length is known, set up the proportion. For example, with \(\cos A = \frac{8}{17}\), a leg of 75 opposite angle \(A\) is the "15" side of the 8-15-17 shape. Then \(15k = 75\), so \(k = 5\), and the side next to \(A\) is \(8 \cdot 5 = 40\).

Triples help: 3-4-5, 5-12-13, 8-15-17, 7-24-25 and 20-21-29 all produce friendly trig values.

Traps: using the ratio as a length, using the scale factor on a ratio (a ratio does not change), and mixing up which angle matches which.
```

## Easy
```task
bank: m-1583
highlight:
- "Triangle FGH is similar to triangle JKL" :: Similar triangles have equal angles.
- "angle F corresponds to angle J" :: So \(F = J\), and \(\sin F = \sin J\).
- "sin(F) = 308/317" :: Copy this value for \(\sin J\).
explain:
Similar triangles have equal corresponding angles. The problem says angle F corresponds to angle J, so the two angles are equal in measure.

Equal angles have equal trig values, because a trig ratio depends only on the angle, not on the size of the triangle. So

\[\sin J = \sin F = \frac{308}{317}\]

There is no need to find any side. Choice A, \(\frac{75}{317}\), is the cosine of these angles, \(\cos F\). Choices C and D are flipped fractions, which are larger than 1 and cannot be sines.

The answer is \(\frac{308}{317}\), choice B.
```

## Medium
```task
bank: m-1664
highlight:
- "∠B is a right angle" :: The hypotenuse is AC, across from B.
- "the length of BC is 136 millimeters" :: BC is the leg opposite A. This real length lets you find \(k\).
- "cos A = 3/5" :: Adjacent over hypotenuse: AB is \(3k\), AC is \(5k\).
explain:
Cosine is adjacent over hypotenuse. With the right angle at B, \(\cos A = \frac{AB}{AC} = \frac{3}{5}\), so the sides are in the ratio \(AB : AC = 3 : 5\). That is a 3-4-5 triangle, so the third side is \(BC = 4k\) when \(AB = 3k\) and \(AC = 5k\).

The ratio is not the length. The real length given is \(BC = 136\), so

\[4k = 136 \quad\Rightarrow\quad k = 34\]

Now \(AB = 3k = 3 \cdot 34 = 102\).

Choice D (170) is \(AC = 5k\), the hypotenuse, which is a different side. The length of AB is 102 millimeters, choice B.
```

## Hard
```task
bank: m-1856
highlight:
- "angle A corresponds to angle D and angles C and F are right angles" :: \(A\) and \(D\) are equal acute angles, so \(\sin A = \sin D\).
- "The length of AB is 2.9 times the length of DE" :: A scale factor. It does not change any angle.
- "tan A = 21/20" :: Opposite 21, adjacent 20. Find the hypotenuse.
explain:
Two right triangles with equal angles are similar, so \(\sin D = \sin A\). The scale factor 2.9 only changes the lengths and is a distraction.

Now use \(\tan A = \frac{21}{20}\). Tangent is opposite over adjacent, so a triangle with this ratio has legs 21 and 20. Its hypotenuse is

\[\sqrt{21^2 + 20^2} = \sqrt{841} = 29\]

Sine is opposite over hypotenuse:

\[\sin A = \frac{21}{29}\]

Therefore \(\sin D = \frac{21}{29}\). Enter 21/29 (or .7241). The numbers 21, 20 and 29 form a Pythagorean triple, which is why the hypotenuse comes out whole.
```

# Sine equals cosine
\(\sin x^\circ = \cos(90 - x)^\circ\): complementary angles swap them.

```visual
right-triangles-trig--complement
```

## Key ideas
The two acute angles of a right triangle add to \(90^\circ\); they are **complementary**. The side opposite one is the side adjacent to the other, so

\[\sin x^\circ = \cos(90 - x)^\circ \qquad \cos x^\circ = \sin(90 - x)^\circ\]

For example \(\sin 20^\circ = \cos 70^\circ\), and \(\sin 35^\circ = \cos 55^\circ\).

This works for any two angles that add to \(90^\circ\), not only angles in one triangle. So if \(\cos Q = \sin R\) for acute angles, then \(Q + R = 90^\circ\).

Set up an equation: add the two angle expressions and set the sum to 90. And in a right triangle, \(\tan A\) and \(\tan B\) are reciprocals.

The classic trap: believing \(\sin x = \cos x\). That is only true at \(45^\circ\). The match is with the **complement**.

```example
For acute angles, \(\sin(3x + 10)^\circ = \cos(2x + 5)^\circ\). Find \(x\).
1. \(3x + 10 + 2x + 5 = 90\) :: The angles are complementary.
2. \(5x + 15 = 90\) :: Combine like terms.
3. \(x = 15\) :: Check: \(55^\circ\) and \(35^\circ\).
```

```theory
Why it works. In a right triangle with acute angles \(A\) and \(B\), the side opposite \(A\) is the side adjacent to \(B\), and the hypotenuse is the same for both. Then \(\sin A = \frac{\text{opposite }A}{\text{hyp}} = \frac{\text{adjacent }B}{\text{hyp}} = \cos B\). Since \(B = 90^\circ - A\), this is \(\sin A = \cos(90^\circ - A)\).

Where you will see it. Questions often say "For two acute angles \(Q\) and \(R\), \(\cos Q = \sin R\)" and give both angle measures as expressions in \(x\). Because the sine of one equals the cosine of the other, the angles are complementary. Add them and set the sum to \(90\). You can also be asked about a number of the form \(\sin 24^\circ \cos 66^\circ + \cos 24^\circ \sin 66^\circ\): since \(24 + 66 = 90\), you can replace \(\cos 66^\circ\) with \(\sin 24^\circ\) and \(\sin 66^\circ\) with \(\cos 24^\circ\). You then get \(\sin^2 24^\circ + \cos^2 24^\circ\), which is 1.

Right triangle shortcut. If you know \(\cos K = \frac{15}{39}\) in a right triangle \(JKL\) with the right angle at \(J\), then \(K\) and \(L\) are complementary, so \(\cos L = \sin K\). Find \(\sin K\) from the third side: \(\sqrt{39^2 - 15^2} = 36\), so \(\sin K = \frac{36}{39} = \frac{12}{13}\).

Tangent. The tangent of one acute angle is the reciprocal of the tangent of the other: \(\tan A = \frac{\text{opp}}{\text{adj}}\) and \(\tan B = \frac{\text{adj}}{\text{opp}}\). If \(\tan A = \frac{\sqrt{3}}{3}\), then \(\tan B = \sqrt{3}\).

Traps: setting the two angles equal instead of adding to \(90^\circ\), and using \(180\) instead of \(90\).

Check your answer by plugging in: after you solve for \(x\), both angles must be positive and less than \(90^\circ\).
```

## Easy
```task
For an acute angle \(A\), \(\sin A = \cos 38^\circ\). What is the measure of angle \(A\), in degrees?
answer: 52
- 38 :: That would be \(\sin 38\). Use the complement of 38.
- 142 :: That is \(180 - 38\). Complementary angles add to 90.
highlight:
- "acute angle" :: An acute angle is under \(90^\circ\), so the complement rule applies.
- "\(\sin A = \cos 38^\circ\)" :: Sine of one angle equals cosine of its complement.
explain:
The sine of an angle equals the cosine of its complement. So if \(\sin A = \cos 38^\circ\), the angle \(A\) is the complement of \(38^\circ\):

\[A = 90^\circ - 38^\circ = 52^\circ\]

Check with the identity in the other direction: \(\sin 52^\circ = \cos(90^\circ - 52^\circ) = \cos 38^\circ\). It matches.

Do not answer 38. Sine and cosine of the same angle are only equal at \(45^\circ\). And do not use 180: the rule involves 90, because the two acute angles of a right triangle add to 90.

The answer is 52.
```

## Medium
```task
bank: m-1610
highlight:
- "For two acute angles, ∠Q and ∠R, cos(Q) = sin(R)" :: Cosine of one equals sine of the other: the angles are complementary.
- "x + 52 and 4x + 13, respectively" :: Add them and set the sum equal to 90.
explain:
For acute angles, \(\cos Q = \sin R\) means the angles are complementary, because the sine of an angle equals the cosine of its complement. So their measures add to \(90^\circ\):

\[(x + 52) + (4x + 13) = 90\]

Combine like terms: \(5x + 65 = 90\). Subtract 65 from both sides: \(5x = 25\). Divide by 5: \(x = 5\).

Check: \(\angle Q = 5 + 52 = 57^\circ\) and \(\angle R = 4(5) + 13 = 33^\circ\). They add to \(90^\circ\), and both are acute.

If you set the angles equal (\(x + 52 = 4x + 13\)) you get \(x = 13\), which is choice B and is wrong. The answer is 5, choice A.
```

## Hard
```task
bank: m-1890
highlight:
- "cos(K) = 24/51" :: Adjacent over hypotenuse for angle K.
- "angle J is a right angle" :: K and L are the two acute angles, so they are complementary.
- "value of cos(L)" :: \(\cos L = \sin K\). Find the missing side.
explain:
Angle J is the right angle, so KL is the hypotenuse and the two acute angles K and L are complementary. That means \(\cos L = \sin K\).

From \(\cos K = \frac{JK}{KL} = \frac{24}{51}\), the side next to K is 24 and the hypotenuse is 51. The third side is

\[JL = \sqrt{51^2 - 24^2} = \sqrt{2025} = 45\]

For angle L, the side adjacent to L is JL, so

\[\cos L = \frac{JL}{KL} = \frac{45}{51} = \frac{15}{17}\]

Enter 15/17 (or .8823, .8824 or 0.882).
```

# Radians
\(\pi\) radians is \(180^\circ\). Numbers with \(\pi\) are radians.

```visual
right-triangles-trig--radians
```

## Key ideas
Angles can be measured in degrees or **radians**. A full turn is \(360^\circ = 2\pi\) radians, so

\[\pi \text{ radians} = 180^\circ\]

Convert with these two rules:

\[\text{degrees} \to \text{radians: multiply by } \frac{\pi}{180} \qquad \text{radians} \to \text{degrees: multiply by } \frac{180}{\pi}\]

Learn the benchmarks: \(30^\circ = \frac{\pi}{6}\), \(60^\circ = \frac{\pi}{3}\), \(90^\circ = \frac{\pi}{2}\), \(180^\circ = \pi\). Other angles are fractions of these.

An angle written with \(\pi\) is in radians. A bare number such as 2.5 is also radians unless it has a degree sign. In Desmos, the calculator starts in radians; to compute \(\sin 35^\circ\), type the degree sign or switch the mode, or you will get the wrong answer.

The classic trap: \(\frac{33}{5}\) radians and \(\frac{33\pi}{5}\) radians are different angles.

```example
Convert \(150^\circ\) to radians.
1. \(150 \cdot \frac{\pi}{180}\) :: Multiply degrees by \(\frac{\pi}{180}\).
2. \(\frac{150\pi}{180} = \frac{5\pi}{6}\) :: Divide top and bottom by 30.
```

```theory
What a radian is. Place the radius of a circle along its edge. The angle at the center that opens up to that arc is 1 radian. The whole circumference is \(2\pi\) radii long, so a full circle is \(2\pi\) radians. Half of it, a straight angle, is \(\pi\) radians. That is why the conversion factor is \(\frac{\pi}{180}\).

Doing it quickly. Because \(\pi\) radians is \(180^\circ\), you can treat \(\pi\) as 180 in a fraction. Half a turn is \(\pi\); a quarter turn is \(\frac{\pi}{2}\); a sixth of \(180\) is \(30\), so \(\frac{\pi}{6}\) is \(30^\circ\). To convert \(\frac{5\pi}{13}\) radians to degrees, replace \(\pi\) with 180: \(\frac{5 \cdot 180}{13}\).

How the SAT asks. Many questions do not need the final number. They ask for an expression: "Which expression represents the measure in degrees of angle \(T\)?" with choices such as \(\frac{5}{13}(180)(2)\) (when \(T\) is twice an angle of \(\frac{5\pi}{13}\) radians). You convert by multiplying by \(\frac{180}{\pi}\) and cancelling the \(\pi\). A tempting wrong choice multiplies by \(\frac{\pi}{180}\) instead, or uses 90 or 360 in place of 180.

Mixed units. Sometimes the angle is given in degrees in one place and radians in another. Convert everything to the same unit before solving an equation. For example, if \((2x + 10)^\circ\) equals \(\frac{5\pi}{9}\) radians, first turn \(\frac{5\pi}{9}\) into \(100^\circ\), then solve \(2x + 10 = 100\).

Beyond a half turn. An angle larger than \(2\pi\) is more than one full turn. Subtract multiples of \(2\pi\) to get an angle you recognise. This is useful with the unit circle in the next part.

Traps: forgetting that \(\pi\) is part of the number, mixing up the two conversion factors (a size in degrees is a bigger number than the same size in radians: \(180^\circ\) is only about \(3.14\) radians), and leaving a calculator in the wrong mode.
```

## Easy
```task
bank: m-15243
highlight:
- "The measure of angle Z is 45°" :: The angle is in degrees.
- "in radians" :: Convert: multiply by \(\tfrac{\pi}{180}\).
explain:
The angle is given in degrees and the question wants radians. To change degrees into radians, multiply by \(\frac{\pi}{180}\), since \(180^\circ = \pi\) radians:

\[45 \cdot \frac{\pi}{180} = \frac{45\pi}{180} = \frac{\pi}{4}\]

You can also think of it as a fraction of a half turn: \(45^\circ\) is one quarter of \(180^\circ\), so it is one quarter of \(\pi\).

Choice A, \(\frac{1}{2}\pi\), is \(90^\circ\), and choice C, \(\frac{1}{8}\pi\), is \(22.5^\circ\). The measure of angle Z is \(\frac{\pi}{4}\) radians, choice D.
```

## Medium
```task
bank: m-14810
highlight:
- "4π/11 radians" :: S is in radians. The answer must be in degrees.
- "3 times the measure of angle S" :: Triple it.
- "the measure, in degrees, of angle T" :: Multiply the radians by \(\tfrac{180}{\pi}\); the \(\pi\) cancels.
explain:
Angle T is three times angle S, so in radians it is \(3 \cdot \frac{4\pi}{11}\).

The question wants degrees, so multiply by \(\frac{180}{\pi}\) to convert radians to degrees:

\[3 \cdot \frac{4\pi}{11} \cdot \frac{180}{\pi} = \frac{4}{11}(180)(3)\]

The \(\pi\) in the angle cancels the \(\pi\) in the conversion factor. That leaves an expression with no \(\pi\), exactly as in choice B.

Choice D keeps a \(\pi\), which means it forgot to cancel. Choices A and C use 90 where the conversion needs 180. The answer is choice B.
```

## Hard
```task
The measure of angle P is \((3x + 15)^\circ\). The measure of angle P is also \(\frac{7\pi}{12}\) radians. What is the value of \(x\)?
answer: 30
- 105 :: That is the angle in degrees. Solve \(3x + 15 = 105\) for \(x\).
- 35 :: You forgot to subtract 15 before dividing by 3.
highlight:
- "\((3x + 15)^\circ\)" :: This is angle P in degrees.
- "\(\frac{7\pi}{12}\) radians" :: This is angle P in radians. Convert it to degrees.
explain:
The same angle is given in two units, so convert one of them. Change \(\frac{7\pi}{12}\) radians to degrees by multiplying by \(\frac{180}{\pi}\):

\[\frac{7\pi}{12} \cdot \frac{180}{\pi} = 7 \cdot 15 = 105\]

So the angle is \(105^\circ\). Now set the degree expression equal to it:

\[3x + 15 = 105\]

Subtract 15: \(3x = 90\). Divide by 3: \(x = 30\).

Check: \(3(30) + 15 = 105\). The value 105 is the angle, not \(x\), and 35 comes from skipping the 15.
```

# The unit circle
Angle \(\theta\) lands on the point \((\cos\theta, \sin\theta)\).

```visual
right-triangles-trig--unit-circle
```

## Key ideas
The **unit circle** has radius 1 and its center at \((0, 0)\). Start at \((1, 0)\) and turn counterclockwise by angle \(\theta\). You land on the point

\[(\cos\theta,\ \sin\theta)\]

The \(x\)-coordinate is the cosine and the \(y\)-coordinate is the sine. Also \(\tan\theta = \frac{\sin\theta}{\cos\theta}\).

Benchmark values:

| \(\theta\) | \(\cos\theta\) | \(\sin\theta\) |
|---|---|---|
| \(0\) | \(1\) | \(0\) |
| \(\frac{\pi}{6}\) | \(\frac{\sqrt{3}}{2}\) | \(\frac{1}{2}\) |
| \(\frac{\pi}{4}\) | \(\frac{\sqrt{2}}{2}\) | \(\frac{\sqrt{2}}{2}\) |
| \(\frac{\pi}{3}\) | \(\frac{1}{2}\) | \(\frac{\sqrt{3}}{2}\) |
| \(\frac{\pi}{2}\) | \(0\) | \(1\) |

Past \(\frac{\pi}{2}\), use the same size with the sign of the quadrant. A full turn is \(2\pi\), and values repeat every \(2\pi\). The classic trap: the right size with the wrong sign.

```example
Find \(\cos\frac{7\pi}{6}\).
1. \(\frac{7\pi}{6} = \pi + \frac{\pi}{6}\) :: A half turn plus \(30^\circ\): third quadrant.
2. Size \(= \frac{\sqrt{3}}{2}\) :: Same as for \(\frac{\pi}{6}\).
3. In quadrant III, \(x < 0\), so \(-\frac{\sqrt{3}}{2}\) :: Cosine is the \(x\)-coordinate.
```

```theory
Where the point comes from. In the unit circle, the radius to the point is the hypotenuse of a right triangle with hypotenuse 1. For an acute angle \(\theta\), the leg next to the angle is \(\cos\theta\) and the leg across from it is \(\sin\theta\), by SOH-CAH-TOA with hypotenuse 1. So the point is \((\cos\theta, \sin\theta)\). Beyond \(90^\circ\) the same point formula keeps working, and the coordinates can become negative.

Signs by quadrant. Going counterclockwise from the positive \(x\)-axis: quadrant I has \(x > 0\), \(y > 0\), so all three ratios are positive. Quadrant II has \(x < 0\), \(y > 0\): only sine is positive. Quadrant III has \(x < 0\), \(y < 0\): only tangent is positive. Quadrant IV has \(x > 0\), \(y < 0\): only cosine is positive. A way to remember it is "All Students Take Calculus".

Reference angle. To find a value for an angle in another quadrant, find the acute angle it makes with the \(x\)-axis (the reference angle), read the size from the table, and fix the sign. For \(\frac{5\pi}{3}\) the reference angle is \(\frac{\pi}{3}\), and the point is in quadrant IV, so \(\cos\frac{5\pi}{3} = +\frac{1}{2}\) while \(\sin\frac{5\pi}{3} = -\frac{\sqrt{3}}{2}\).

Big angles. Because a full turn is \(2\pi\), subtract whole turns first. For \(\cos 30\pi\), \(30\pi\) is 15 full turns, so it lands where \(0\) does: \(\cos 30\pi = 1\). For \(\tan\frac{41\pi}{6}\), note that \(\frac{41\pi}{6} = 6\pi + \frac{5\pi}{6}\). Tangent repeats every \(\pi\), so it equals \(\tan\frac{5\pi}{6}\), which is negative in quadrant II: \(-\frac{\sqrt{3}}{3}\).

Traps: the wrong sign, using degrees where radians are needed, and forgetting that tangent repeats every \(\pi\) while sine and cosine repeat every \(2\pi\).
```

## Easy
```task
bank: m-1920
highlight:
- "What is the value of" :: Sine of a big angle: look for full turns.
- "sin 42π" :: \(42\pi\) is 21 full turns of \(2\pi\), so it lands at angle 0.
explain:
A full turn around the unit circle is \(2\pi\). The angle \(42\pi\) is a whole number of full turns, \(42\pi = 21 \cdot 2\pi\), so it ends up at the same place as angle 0.

At angle 0 the point on the unit circle is \((1, 0)\). Sine is the \(y\)-coordinate of that point, which is 0:

\[\sin 42\pi = \sin 0 = 0\]

You do not need a calculator. Choices B, C and D are sine values at \(\frac{\pi}{6}\), \(\frac{\pi}{4}\) and \(\frac{\pi}{2}\), which are different angles.

The answer is 0, choice A.
```

## Medium
```task
bank: m-13917
highlight:
- "3π/4 radians" :: \(\tfrac{3\pi}{4}\) is \(135^\circ\), in quadrant II. The reference angle is \(\tfrac{\pi}{4}\).
- "cos(C)" :: Cosine is the \(x\)-coordinate, which is negative in quadrant II.
explain:
Convert the angle to degrees to see where it is: \(\frac{3\pi}{4} = 135^\circ\). This lies between \(90^\circ\) and \(180^\circ\), so it is in the second quadrant. The reference angle, the acute angle to the \(x\)-axis, is \(180^\circ - 135^\circ = 45^\circ\).

The size of cosine at the reference angle is \(\cos 45^\circ = \frac{\sqrt{2}}{2}\).

Cosine is the \(x\)-coordinate, and \(x\) is negative in quadrant II. So

\[\cos\frac{3\pi}{4} = -\frac{\sqrt{2}}{2}\]

Choice C has the right size but the wrong sign. The answer is choice A.
```

## Hard
```task
bank: m-1792
highlight:
- "What is the value of" :: A big angle: reduce it first.
- "tan((92π)/3)" :: \(\tfrac{92\pi}{3} = 30\pi + \tfrac{2\pi}{3}\). Tangent repeats every \(\pi\).
explain:
First reduce the angle. Write \(\frac{92\pi}{3}\) as a whole number of \(\pi\)'s plus a remainder:

\[\frac{92\pi}{3} = \frac{90\pi}{3} + \frac{2\pi}{3} = 30\pi + \frac{2\pi}{3}\]

The tangent function repeats every \(\pi\), and \(30\pi\) is a whole number of \(\pi\)'s, so it can be dropped:

\[\tan\frac{92\pi}{3} = \tan\frac{2\pi}{3}\]

The angle \(\frac{2\pi}{3} = 120^\circ\) is in quadrant II, where sine is positive and cosine is negative, so tangent is negative. The reference angle is \(\frac{\pi}{3}\), and \(\tan\frac{\pi}{3} = \sqrt{3}\).

So the value is \(-\sqrt{3}\), choice A.
```
