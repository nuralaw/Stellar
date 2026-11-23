---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Circle equations, arcs, sectors, radians, tangents and inscribed angles.
---

# Center and radius
Flip the signs. Root the right side.

```visual
circles--center-point
```

## Key ideas
In the \(xy\)-plane (the plane with an \(x\)-axis and a \(y\)-axis), a circle with center \((h, k)\) and radius \(r\) has the **standard form** equation

\[(x - h)^2 + (y - k)^2 = r^2\]

Read the center by **flipping the signs** inside the brackets: \((x + 3)^2\) means \(h = -3\). The number on the right is \(r^2\), so take its square root to get the radius: \(49\) means \(r = 7\).

To write an equation, put the center in the brackets and square the radius. If you know a point on the circle instead of the radius, the radius is the distance from the center to that point (use the distance formula or a right triangle).

Shifting a circle moves only the center: moving it right 4 adds 4 to \(h\); the radius does not change.

The classic trap: writing \(r\) on the right instead of \(r^2\).

```example
A circle has center \((1, -2)\) and passes through \((6, 10)\). Write its equation.
1. Across \(6 - 1 = 5\), up \(10 - (-2) = 12\) :: The steps from the center to the point.
2. \(r^2 = 5^2 + 12^2 = 169\) :: A 5-12-13 triangle, so \(r = 13\).
3. \((x - 1)^2 + (y + 2)^2 = 169\) :: Flip the sign of \(-2\) to get \(+2\).
```

```theory
Where the equation comes from. A point \((x, y)\) is on the circle exactly when its distance to the center \((h, k)\) equals \(r\). The distance formula, \(\sqrt{(x - h)^2 + (y - k)^2}\), set equal to \(r\) and squared gives the standard form. That is why the radius is hidden in \(r^2\) and why the equation is really the Pythagorean theorem: horizontal distance squared plus vertical distance squared equals radius squared.

Why the signs flip. The bracket \((x - h)\) is zero when \(x = h\). For \((x + 5)\), the bracket is zero at \(x = -5\), so the center's \(x\)-coordinate is \(-5\). The same holds for \(y\).

The other form. An equation such as \(x^2 + y^2 - 6x + 12y - 4 = 0\) is called the **general form**. It is the standard form with the brackets multiplied out. The next part shows how to go back. To go forward, expand the squares: \((x - 3)^2 + (y + 6)^2 = 49\) becomes \(x^2 - 6x + 9 + y^2 + 12y + 36 = 49\), then move 49 to the left: the constant is \(9 + 36 - 49 = -4\).

How the SAT words it. "Which equation represents the circle with center \((4, -3)\) passing through \((-4, 3)\)?" Wrong choices typically keep the original signs, write \(r\) instead of \(r^2\), or both. A circle with a diameter of 14 has \(r = 7\) and \(r^2 = 49\). Some questions use a constant such as \(k\): in \((x - 13)^2 + (y - k)^2 = 64\) the center is \((13, k)\) and the radius is 8.

Translations. Circle \(A\): \((x - 7)^2 + (y + 3)^2 = 1\) moved 4 units right has center \((11, -3)\), so \((x - 11)^2 + (y + 3)^2 = 1\). Moving down subtracts from \(k\).

Traps: forgetting to flip signs, forgetting to square the radius, and mixing up the order of \(h\) and \(k\).
```

## Easy
```task
bank: m-1808
highlight:
- "a circle with radius 5 has center (-8, 6)" :: Center \((-8, 6)\) and radius 5.
- "Which of the following is an equation of the circle?" :: Write \((x - h)^2 + (y - k)^2 = r^2\).
explain:
Use the standard form of a circle, \((x - h)^2 + (y - k)^2 = r^2\), where \((h, k)\) is the center and \(r\) is the radius.

The center is \((-8, 6)\), so \(h = -8\) and \(k = 6\). Subtracting a negative number gives a plus sign, so the \(x\)-bracket is \((x + 8)\) and the \(y\)-bracket is \((y - 6)\).

The radius is 5, so the right side is \(r^2 = 25\):

\[(x + 8)^2 + (y - 6)^2 = 25\]

Choices A and C flip the signs of the center, and choices C and D put \(r = 5\) on the right instead of \(r^2 = 25\). The answer is choice B.
```

## Medium
```task
bank: m-1913
highlight:
- "its center at (-4, 5)" :: The center gives \(h = -4\) and \(k = 5\).
- "the point (-8, 8) lies on the circle" :: Distance from the center to this point is the radius.
explain:
The center is \((-4, 5)\). The radius is not given, but a point on the circle is, so the radius is the distance from the center to that point.

From \((-4, 5)\) to \((-8, 8)\), the horizontal change is \(-8 - (-4) = -4\) and the vertical change is \(8 - 5 = 3\). A 3-4-5 triangle gives \(r = 5\), and

\[r^2 = (-4)^2 + 3^2 = 25\]

Now write the equation with the center's signs flipped:

\[(x + 4)^2 + (y - 5)^2 = 25\]

Choices A and B put 5 on the right, which is \(r\) and not \(r^2\). Choices A and C have the center's signs the wrong way. The answer is choice D.
```

## Hard
```task
bank: m-1825
highlight:
- "its center at (-5, 2) and has a radius of 9" :: Standard form: \((x + 5)^2 + (y - 2)^2 = 81\).
- "x^2 + y^2 + ax + by + c = 0" :: This is the general form. Expand the squares.
- "What is the value of c?" :: \(c\) is the constant after everything moves to the left.
explain:
Start with the standard form. The center is \((-5, 2)\) and the radius is 9, so

\[(x + 5)^2 + (y - 2)^2 = 81\]

The question writes the equation in general form, with everything on the left and 0 on the right. Expand both brackets:

\[x^2 + 10x + 25 + y^2 - 4y + 4 = 81\]

Move 81 to the left side and combine the constants: \(25 + 4 - 81 = -52\). The equation is

\[x^2 + y^2 + 10x - 4y - 52 = 0\]

So \(c = -52\). A common slip is to forget to subtract 81, which would give \(c = 29\).
```

# Complete the square
Messy equation? Rebuild the two squares first.

```visual
circles--tiles
```

## Key ideas
A circle may come as a messy **general form** equation, \(x^2 + y^2 + Ax + By + C = 0\). To read its center and radius, rebuild the squares:

1. Group the \(x\)-terms and the \(y\)-terms, and move the plain number to the right.
2. Add \(\left(\frac{A}{2}\right)^2\) to both sides to complete the \(x\)-square. Add \(\left(\frac{B}{2}\right)^2\) to both sides for \(y\). (\(A\) and \(B\) are the **coefficients**, the numbers in front of \(x\) and \(y\).)
3. Write each group as a square and read the center and \(r^2\).

If \(x^2\) and \(y^2\) have a number in front (say 3), **divide every term by it first**.

The classic trap: adding the new squares to the left side only. Whatever you add to one side, add to the other.

```example
\(x^2 + y^2 - 8x + 6y + 9 = 0\). Find the center and the radius.
1. \((x^2 - 8x) + (y^2 + 6y) = -9\) :: Group, and move the 9 to the right.
2. \((x - 4)^2 + (y + 3)^2 = -9 + 16 + 9\) :: Add \(4^2 = 16\) and \(3^2 = 9\) to both sides.
3. Center \((4, -3)\), \(r = \sqrt{16} = 4\) :: Flip the signs.
```

```theory
Why adding \(\left(\frac{A}{2}\right)^2\) works. Expanding \((x + p)^2\) gives \(x^2 + 2px + p^2\). So an expression \(x^2 + Ax\) is the start of a square with \(p = \frac{A}{2}\); it is missing only the corner \(p^2 = \left(\frac{A}{2}\right)^2\). Think of tiles: a big square of side \(x\), two strips of width \(p\), and a small \(p\) by \(p\) square missing from the corner. Adding that corner completes the big square \((x + p)^2\).

Step by step for \(x^2 + y^2 + 4x - 14y - 11 = 0\). Move 11 to the right: \(x^2 + 4x + y^2 - 14y = 11\). Half of 4 is 2, squared is 4. Half of \(-14\) is \(-7\), squared is 49. Add both to both sides: \((x + 2)^2 + (y - 7)^2 = 11 + 4 + 49 = 64\). So the center is \((-2, 7)\) and the radius is 8.

When the leading numbers are not 1. In \(3x^2 + 12x + 3y^2 - 18y = 108\), divide everything by 3 first: \(x^2 + 4x + y^2 - 6y = 36\). Then half of 4 is 2 (square 4) and half of \(-6\) is \(-3\) (square 9), so \((x + 2)^2 + (y - 3)^2 = 36 + 4 + 9 = 49\), and \(r = 7\). If you forget to divide, you get wrong answers that appear as distractors.

How the SAT words it. "The graph of the given equation in the \(xy\)-plane is a circle. What is the radius?" or "the area of the circle" (then give \(\pi r^2\), not \(r\)), or "the coordinates of the center", or "the circle's diameter". Read what is asked at the end.

Desmos. You can type the messy equation exactly as written, then read the center and radius by clicking the points at the left and right or the top and bottom of the circle. Top to bottom is the diameter.

A circle exists only if the right side \(r^2\) is positive. If it is zero or negative, there is no circle.

Traps: forgetting to move the constant, using the full coefficient instead of half, and answering \(r^2\) when the question wants \(r\).
```

## Easy
```task
In the \(xy\)-plane, the graph of \(x^2 + y^2 - 10x + 2y + 1 = 0\) is a circle. What are the coordinates of the center of the circle?
- \((-5, 1)\) :: That is half of each coefficient. The center flips both signs.
- \((10, -2)\) :: You did not halve the coefficients.
* \((5, -1)\)
- \((5, 1)\) :: Check the \(y\) sign: \((y + 1)\) means \(k = -1\).
highlight:
- "the graph of \(x^2 + y^2 - 10x + 2y + 1 = 0\) is a circle" :: General form: complete the square for \(x\) and for \(y\).
- "coordinates of the center" :: Only the center is asked, so flip the signs after completing the squares.
explain:
Group the \(x\)-terms and the \(y\)-terms and move the constant to the right:

\[(x^2 - 10x) + (y^2 + 2y) = -1\]

Half of \(-10\) is \(-5\), and \((-5)^2 = 25\). Half of 2 is 1, and \(1^2 = 1\). Add 25 and 1 to both sides:

\[(x - 5)^2 + (y + 1)^2 = -1 + 25 + 1 = 25\]

Now read the center by flipping the signs inside the brackets: \(h = 5\) and \(k = -1\). The radius is 5, but only the center was asked.

Choice A, \((-5, 1)\), is just half of each coefficient without the flip. The answer is \((5, -1)\), choice C.
```

## Medium
```task
bank: m-16533
highlight:
- "x^2 + y^2 − 12x + 16y + 64 = 0" :: General form. Complete the square twice.
- "What is the area of the circle, in square units?" :: Area is \(\pi r^2\). \(r^2\) is the number on the right.
explain:
Group the terms and move the constant:

\[(x^2 - 12x) + (y^2 + 16y) = -64\]

Half of \(-12\) is \(-6\) (square 36). Half of 16 is 8 (square 64). Add both to both sides:

\[(x - 6)^2 + (y + 8)^2 = -64 + 36 + 64 = 36\]

The right side is \(r^2 = 36\), so \(r = 6\). The question asks for the area, and the area is \(\pi r^2 = 36\pi\). Notice that you do not even need to take the square root: the number on the right side is already \(r^2\).

Choice C comes from forgetting to move the constant 64 to the other side. The answer is \(36\pi\), choice A.
```

## Hard
```task
bank: m-1744
highlight:
- "2x^2 - 6x + 2y^2 + 2y = 45" :: Both squared terms have 2 in front. Divide everything by 2 first.
- "What is the radius of the circle?" :: After completing the square, take the square root of the right side.
explain:
Both \(x^2\) and \(y^2\) have a 2 in front, so first divide every term by 2:

\[x^2 - 3x + y^2 + y = 22.5\]

Now complete the square. Half of \(-3\) is \(-1.5\), and its square is 2.25. Half of 1 is 0.5, and its square is 0.25. Add both to both sides:

\[(x - 1.5)^2 + (y + 0.5)^2 = 22.5 + 2.25 + 0.25 = 25\]

So \(r^2 = 25\) and \(r = 5\).

If you skip the division by 2, you complete the squares incorrectly and end up with distractors like \(\sqrt{40}\) or \(\sqrt{50}\). The radius is 5, choice A.
```

# Diameter and points
Endpoints give the center. Plug in points to test them.

```visual
circles--diameter
```

## Key ideas
If you know the endpoints of a diameter, the **center** is their midpoint and the **radius** is half the distance between them:

\[\text{center} = \left(\frac{x_1 + x_2}{2},\ \frac{y_1 + y_2}{2}\right)\]

The distance between two points is \(\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}\). When the endpoints share an \(x\) or a \(y\), just subtract the other coordinate.

To test a point \((x, y)\), plug it into the left side of \((x - h)^2 + (y - k)^2\) and compare with \(r^2\):

- equal to \(r^2\): the point is **on** the circle
- less than \(r^2\): **inside**
- greater than \(r^2\): **outside**

The classic trap: finding the diameter's length and using it as the radius.

```example
A circle has a diameter with endpoints \((-1, 3)\) and \((7, 9)\). Write its equation.
1. Center \(\left(\frac{-1 + 7}{2}, \frac{3 + 9}{2}\right) = (3, 6)\) :: The midpoint.
2. Diameter \(= \sqrt{8^2 + 6^2} = 10\), so \(r = 5\) :: Half the distance.
3. \((x - 3)^2 + (y - 6)^2 = 25\) :: Put the center and \(r^2\) in.
```

```theory
Why the midpoint. A diameter passes through the center, and the center is the same distance from each endpoint. That is exactly what a midpoint is. So averaging the two \(x\)-values and the two \(y\)-values gives the center.

Special case. When the two endpoints have the same \(x\)-coordinate (a vertical diameter), the diameter's length is the difference of the \(y\)-coordinates. For endpoints \((-6, 3)\) and \((-6, 17)\), the center is \((-6, 10)\) and the diameter is \(17 - 3 = 14\), so \(r = 7\) and \(r^2 = 49\).

Working backward. If a problem gives one endpoint and the center, the other endpoint is as far from the center on the opposite side: if the center is \((a, 17)\) and one endpoint is \((a, 11)\), the other is \((a, 23)\), since the center is the average of 11 and 23. Algebra with constants works the same way.

Testing points. A point inside a circle is closer to the center than \(r\), so its squared distance is less than \(r^2\). Take the circle \((x + 3)^2 + (y - 1)^2 = 25\) and the point \((3, 2)\). Then \((3 + 3)^2 + (2 - 1)^2 = 36 + 1 = 37 > 25\), so the point is outside. A point on the circle forms a right triangle with the center whose hypotenuse is \(r\). Pythagorean triples help: for \((x - 2)^2 + (y - 1)^2 = 169\), the point \((14, 6)\) has legs 12 and 5, and \(12^2 + 5^2 = 169\), so it lies on the circle.

"Intersects the axis at exactly one point" means the circle is tangent to the axis. That is covered in the tangent part.

How the SAT words it. "Which equation represents the circle?" with choices that differ in the center signs and in using \(r\) or \(r^2\), or "Which of the following points lies on this circle?" with several statements. Check each statement separately.

Traps: using the diameter as \(r\), averaging incorrectly when a coordinate is negative, and mixing up which side of the equals sign holds \(r^2\).
```

## Easy
```task
bank: m-1665
highlight:
- "a diameter with endpoints (2, 4) and (2, 14)" :: A vertical diameter. Its length is \(14 - 4\).
- "(x - 2)^2 + (y - 9)^2 = r^2" :: The center is \((2, 9)\), the midpoint of the endpoints.
- "What is the value of r?" :: The radius is half the diameter, not the diameter.
explain:
The endpoints \((2, 4)\) and \((2, 14)\) have the same \(x\)-coordinate, so the diameter is vertical. Its length is the difference of the \(y\)-coordinates:

\[14 - 4 = 10\]

The radius is half of the diameter:

\[r = \tfrac{10}{2} = 5\]

As a check, the center is the midpoint, \(\left(2, \frac{4 + 14}{2}\right) = (2, 9)\), which matches the center shown in the given equation. Notice that the question asks for \(r\), not \(r^2\), so the answer is 5, not 25.
```

## Medium
```task
bank: m-16126
highlight:
- "a diameter with endpoints (8,−9) and (8,−19)" :: A vertical diameter. Its midpoint is the center.
- "Which equation represents this circle?" :: Center, then \(r^2\). Signs flip; the right side is squared.
explain:
The center is the midpoint of the diameter:

\[\left(\frac{8 + 8}{2},\ \frac{-9 + (-19)}{2}\right) = (8, -14)\]

The endpoints have the same \(x\), so the diameter's length is the difference in \(y\): \(19 - 9 = 10\). The radius is 5, so \(r^2 = 25\).

Write the equation with the center's signs flipped: \((x - 8)^2 + (y + 14)^2 = 25\).

Choices A and B have the wrong signs for the center. Choice D uses 5, which is \(r\), not \(r^2\). The answer is choice C.
```

## Hard
```task
bank: m-16741
highlight:
- "(x − 3)^2 + (y − 9)^2 = 625" :: Center \((3, 9)\), \(r^2 = 625\).
- "Which of the following points lies on this circle?" :: Substitute each point. It is on the circle if the left side equals 625.
explain:
A point is on the circle if substituting it makes the left side equal \(625\). Test the three points one at a time.

I. \((10, -15)\): \((10 - 3)^2 + (-15 - 9)^2 = 7^2 + 24^2 = 49 + 576 = 625\). This point is on the circle.

II. \(\left(3 - \sqrt{300},\ 9 + 5\sqrt{3}\right)\): the horizontal change squared is 300 and the vertical change squared is \(25 \cdot 3 = 75\), so the sum is 375, not 625. Not on the circle.

III. \(\left(7 + \sqrt{3},\ 33\right)\): the horizontal change is \(4 + \sqrt{3}\), and its square is \(19 + 8\sqrt{3}\), while the vertical change squared is \(24^2 = 576\). The total is not 625. Not on the circle.

Only I works, so the answer is choice B.
```

# Arcs and sectors
Angle over 360 is the fraction of the circle.

```visual
circles--sector
```

## Key ideas
A **central angle** has its vertex at the center of the circle. It cuts off an **arc** (part of the edge) and a **sector** (the slice, like a slice of pizza). The arc's measure in degrees equals the central angle.

The fraction of the circle is the angle over a full turn:

\[\text{fraction} = \frac{\theta}{360}\]

Scale the whole circle by that fraction:

\[\text{arc length} = \frac{\theta}{360} \cdot 2\pi r \qquad \text{sector area} = \frac{\theta}{360} \cdot \pi r^2\]

The sheet gives the full circumference and area, and says a circle has \(360^\circ\). Arc and sector formulas are not on it, so use the fraction.

A name with two letters, "arc AB", means the shorter (minor) arc.

The classic trap: using \(\pi r^2\) for an arc, or \(2\pi r\) for a sector. Arcs are lengths; sectors are areas.

```example
A circle has radius 12. A central angle is \(150^\circ\). Find the arc length and the sector area.
1. \(\frac{150}{360} = \frac{5}{12}\) :: The fraction of the circle.
2. Arc: \(\frac{5}{12} \cdot 24\pi = 10\pi\) :: Fraction times circumference.
3. Sector: \(\frac{5}{12} \cdot 144\pi = 60\pi\) :: Fraction times area.
```

```theory
Why the fraction works. A circle is \(360^\circ\) all the way around. An angle of \(150^\circ\) takes up \(\frac{150}{360}\) of the turn, and the arc and the slice it cuts off take up the same fraction of the circumference and of the area. So the arc and sector scale linearly with the angle.

Going backward. Many SAT problems give the arc length and the angle and ask for the circumference or the radius. A \(60^\circ\) arc of length 5 inches is \(\frac{60}{360} = \frac{1}{6}\) of the circle, so the circumference is \(6 \cdot 5 = 30\) inches. A \(72^\circ\) arc of length \(6\pi\) is \(\frac{1}{5}\) of the circle, so the circumference is \(30\pi\), so \(2\pi r = 30\pi\) and \(r = 15\).

Diameters and half turns. A diameter cuts the circle into two halves of \(180^\circ\). If two diameters cross, the opposite arcs are equal, because vertical angles at the center are equal. So with diameters PR and QS, arcs PQ and RS are equal, and arcs QR and SP are equal. A half of the circumference holds two neighbouring arcs: \(PQ + QR = \frac{1}{2}C\).

Minor and major arcs. The minor arc is less than \(180^\circ\). A three-letter name such as arc ABC may be the major arc. The arc's measure never exceeds \(360^\circ\).

Ratio of arcs. If arc SP is three times arc PQ, you can use algebra: let arc PQ be \(x\) and arc SP be \(3x\), then use the half-circle relation.

Triangle area minus sector area is the usual "shaded region" problem: find the triangle's area and subtract the sector's. This is the same subtract-the-part idea as in the area lesson.

Traps: confusing arc length with arc measure (degrees), leaving out the \(2\) in \(2\pi r\), and answering with the circumference when the question asks for the radius.
```

## Easy
```task
bank: m-1806
highlight:
- "The measure of arc AB is 45° and the length of arc AB is 3 inches" :: A \(45^\circ\) arc is \(\tfrac{45}{360} = \tfrac{1}{8}\) of the circle.
- "What is the circumference, in inches, of the circle?" :: The whole circle is 8 times the arc.
explain:
An arc of \(45^\circ\) is \(\frac{45}{360} = \frac{1}{8}\) of the full circle, since a full turn is \(360^\circ\). So the arc length is one eighth of the circumference.

Arc length is \(\frac{1}{8}\) of the circumference, and the arc length is 3 inches. Multiply by 8 to get the whole circumference:

\[C = 8 \cdot 3 = 24\]

Choice A (3) just repeats the arc length, and choices B and C come from using the wrong fraction, such as \(\frac{1}{2}\) or \(\frac{1}{3}\). The circumference is 24 inches, choice D.
```

## Medium
```task
bank: m-1849
highlight:
- "The measure of arc AB is 45° and the length of arc AB is 4π units" :: \(45^\circ\) is \(\tfrac{1}{8}\) of the circle, so the circumference is \(8 \cdot 4\pi\).
- "length, in units, of the radius of the circle" :: Use \(C = 2\pi r\) at the end.
explain:
A \(45^\circ\) arc is \(\frac{45}{360} = \frac{1}{8}\) of the circle. So the arc length, \(4\pi\), is \(\frac{1}{8}\) of the circumference:

\[C = 8 \cdot 4\pi = 32\pi\]

The circumference formula is \(C = 2\pi r\). Set it equal to \(32\pi\):

\[2\pi r = 32\pi \quad\Rightarrow\quad r = 16\]

The radius is 16 units. Notice that the arc length gave you the circumference only after the fraction step, and that you must divide by \(2\pi\), not by \(\pi\), to get the radius.
```

## Hard
```task
bank: m-11637
highlight:
- "A circle has diameters AC and BD" :: Two diameters make two pairs of equal opposite arcs.
- "The circumference of the circle is 84π" :: A half circle is \(42\pi\).
- "the length of arc DA is 2 times the length of arc AB" :: Let arc AB be \(x\), then arc DA is \(2x\).
explain:
Each diameter splits the circle into two halves, so each half has length \(\frac{84\pi}{2} = 42\pi\).

The diameters AC and BD cross at the center. Opposite arcs between the same two diameters are equal, so arc BC equals arc DA. Let arc AB be \(x\). Then arc DA is \(2x\), and arc BC is also \(2x\).

Arcs AB and BC together make half of the circle, the half from A to C:

\[x + 2x = 42\pi \quad\Rightarrow\quad 3x = 42\pi \quad\Rightarrow\quad x = 14\pi\]

The question asks for arc BC, which is \(2x = 28\pi\).

Choice B (\(14\pi\)) is arc AB, not arc BC. The answer is \(28\pi\), choice D.
```

# Radians and sectors
\(s = r\theta\) when the angle is in radians.

```visual
circles--radians
```

## Key ideas
**Radians** measure angles by arcs: a full circle is \(2\pi\) radians, so

\[\pi \text{ radians} = 180^\circ\]

The sheet gives this too. To convert, multiply degrees by \(\frac{\pi}{180}\), or radians by \(\frac{180}{\pi}\).

When the central angle \(\theta\) is in radians, the arc and the sector are simple:

\[s = r\theta \qquad A_{\text{sector}} = \tfrac{1}{2}r^2\theta\]

Here \(s\) is arc length. These formulas are not on the sheet; if you forget them, use the fraction \(\frac{\theta}{2\pi}\) of the circle instead, which gives the same answers.

The classic trap: using \(s = r\theta\) with degrees. It works only in radians.

```example
A circle has radius 8. A central angle is \(\frac{3\pi}{4}\) radians. Find the arc length.
1. \(s = r\theta\) :: Radians, so the short formula works.
2. \(s = 8 \cdot \frac{3\pi}{4}\) :: Substitute.
3. \(s = 6\pi\) :: \(8 \cdot 3 \div 4 = 6\).
```

```theory
What a radian is. Lay the radius along the edge of the circle. The angle at the center that opens to that stretch of edge is 1 radian. A full circle has \(2\pi\) of those, because the circumference is \(2\pi r\). So the angle in radians is just the arc length measured in radius units: \(\theta = \frac{s}{r}\).

Check with fractions. For radius 8 and \(\theta = \frac{3\pi}{4}\), the angle is \(\frac{3\pi/4}{2\pi} = \frac{3}{8}\) of a full turn, so the arc is \(\frac{3}{8} \cdot 2\pi \cdot 8 = 6\pi\). The same answer, as it must be.

Benchmarks. \(30^\circ = \frac{\pi}{6}\), \(45^\circ = \frac{\pi}{4}\), \(60^\circ = \frac{\pi}{3}\), \(90^\circ = \frac{\pi}{2}\), \(180^\circ = \pi\), \(270^\circ = \frac{3\pi}{2}\), \(360^\circ = 2\pi\). Other angles are multiples of these, such as \(150^\circ = 5 \cdot 30^\circ\).

Sector area with the fraction. Area of a sector is \(\frac{\theta}{2\pi} \cdot \pi r^2 = \frac{1}{2}r^2\theta\). Problems sometimes give the arc length and the angle and ask for the area: find \(r\) with \(r = \frac{s}{\theta}\), then the area. For \(s = 4\pi\) and \(\theta = \frac{\pi}{3}\): \(r = 4\pi \div \frac{\pi}{3} = 12\), and the sector area is \(\frac{1}{2} \cdot 12^2 \cdot \frac{\pi}{3} = 24\pi\).

Adding angles. A problem may give two angles in radians and ask for the sum in degrees. Convert each: \(\frac{\pi}{6} = 30^\circ\) and \(\frac{3\pi}{4} = 135^\circ\), so their sum is \(165^\circ\).

Traps: converting with the wrong factor, forgetting that \(\theta\) must be in radians, and leaving out the one half in the sector formula.
```

## Easy
```task
bank: m-16211
highlight:
- "The measure of angle Z is 240°" :: The angle is in degrees.
- "in radians" :: Multiply by \(\tfrac{\pi}{180}\).
explain:
To change degrees to radians, multiply by \(\frac{\pi}{180}\), because \(180^\circ = \pi\) radians:

\[240 \cdot \frac{\pi}{180} = \frac{240\pi}{180} = \frac{4\pi}{3}\]

You can check this another way. A half turn is \(180^\circ = \pi\) radians. The angle \(240^\circ\) is \(60^\circ\) more than a half turn, and \(60^\circ = \frac{\pi}{3}\), so the angle is \(\pi + \frac{\pi}{3} = \frac{4\pi}{3}\).

Choice A, \(\frac{2\pi}{3}\), is \(120^\circ\), which is only half the given angle. Choices C and D are larger than a full turn or use the wrong conversion factor. The answer is \(\frac{4\pi}{3}\), choice B.
```

## Medium
```task
bank: m-1784
highlight:
- "The measure of angle R is (2π)/3 radians" :: Angle R in radians. Convert it to degrees.
- "(5π)/12 radians greater than the measure of angle R" :: Add this amount, also in radians.
- "in degrees" :: Convert at the end, or convert each part first.
explain:
Convert each angle to degrees with \(\pi\) radians \(= 180^\circ\), that is, multiply radians by \(\frac{180}{\pi}\).

Angle R: \(\frac{2\pi}{3} \cdot \frac{180}{\pi} = 120^\circ\).

The extra amount: \(\frac{5\pi}{12} \cdot \frac{180}{\pi} = 75^\circ\).

Angle T is 75 degrees greater than angle R:

\[\angle T = 120 + 75 = 195^\circ\]

Choice B (120) is angle R alone, so it forgets to add the extra 75. Choice D (390) doubles the answer. Choice A (75) is only the extra amount. The measure of angle T is 195 degrees, choice C.
```

## Hard
```task
A sector of a circle has a central angle of \(\frac{5\pi}{6}\) radians and an arc length of \(15\pi\). The area of the sector is \(k\pi\) square units. What is the value of \(k\)?
answer: 135
- 270 :: You forgot the one half in \(\tfrac{1}{2}r^2\theta\).
- 324 :: That is \(r^2\). The sector is only a fraction of the circle.
highlight:
- "central angle of \(\frac{5\pi}{6}\) radians" :: Angle in radians: use \(s = r\theta\).
- "an arc length of \(15\pi\)" :: This gives the radius: \(r = s \div \theta\).
- "The area of the sector" :: Sector area is \(\tfrac{1}{2}r^2\theta\).
explain:
The angle is in radians, so the arc length formula \(s = r\theta\) applies. Solve it for the radius:

\[r = \frac{s}{\theta} = 15\pi \div \frac{5\pi}{6} = 15\pi \cdot \frac{6}{5\pi} = 18\]

The sector is a fraction of the whole circle. The fraction is \(\frac{\theta}{2\pi} = \frac{5\pi/6}{2\pi} = \frac{5}{12}\). The whole circle has area \(\pi r^2 = 324\pi\), so

\[\text{sector area} = \frac{5}{12} \cdot 324\pi = 135\pi\]

Using the formula \(\frac{1}{2}r^2\theta = \frac{1}{2} \cdot 324 \cdot \frac{5\pi}{6} = 135\pi\) gives the same result, which is a good check. The area is written as \(k\pi\), so \(k = 135\).

If you got 270, you left out the one half in the sector formula. If you got 324, you used the area of the whole circle.
```

# Tangent lines
A tangent touches once, at \(90^\circ\) to the radius.

```visual
circles--tangent
```

## Key ideas
A **tangent** line touches a circle at exactly one point. At that point it is **perpendicular** to the radius: they meet at \(90^\circ\).

In the \(xy\)-plane, find the slope of the radius (rise over run, from the center to the touching point), then flip it and change its sign:

\[m_{\text{tangent}} = -\frac{1}{m_{\text{radius}}}\]

A circle **tangent to an axis** has a radius equal to the distance from its center to that axis: the absolute value of the center's \(y\)-coordinate for the \(x\)-axis, and of the center's \(x\)-coordinate for the \(y\)-axis.

Two tangent segments drawn to a circle from the same outside point are **equal** in length, and each is perpendicular to its radius, forming a right triangle with the line from the center to that point.

The classic trap: using the radius's slope for the tangent.

```example
A circle has center \((-1, 2)\). A line is tangent to it at \((3, 5)\). What is the slope of the line?
1. Radius slope \(= \frac{5 - 2}{3 - (-1)} = \frac{3}{4}\) :: Rise over run.
2. Tangent slope \(= -\frac{4}{3}\) :: Flip it, and change the sign.
```

```theory
Why \(90^\circ\). Any other line through the touching point would cut into the circle and cross it a second time. The tangent is the line that just grazes the circle, which makes it the line at a right angle to the radius.

Perpendicular slopes. Two lines at right angles have slopes whose product is \(-1\). If the radius has slope \(-2\), the tangent has slope \(\frac{1}{2}\), as in a circle centered at \((6, 2)\) with tangent point \((3, 8)\): the radius slope is \(\frac{8 - 2}{3 - 6} = -2\), so the tangent slope is \(\frac{1}{2}\). A horizontal radius has a vertical tangent, and the other way round.

Tangent to an axis. A circle with center \((-3, 7)\) tangent to the \(x\)-axis has radius 7, because the center is 7 units above the axis. The equation is \((x + 3)^2 + (y - 7)^2 = 49\). The \(x\)-coordinate \(-3\) gives the distance to the \(y\)-axis (3 units), which would be the radius only if the circle touched the \(y\)-axis instead. A circle intersects an axis at exactly one point when it is tangent to it, as in "Which equation represents a circle that intersects the \(y\)-axis at exactly one point?" Compare \(\lvert h \rvert\) with \(r\).

Two tangents from one point. Take a point \(P\) outside a circle with center \(O\). Tangent segments \(PA\) and \(PB\) are equal. The radii \(OA\) and \(OB\) are perpendicular to them, so \(OAP\) is a right triangle with hypotenuse \(OP\). So \(OP^2 = r^2 + PA^2\). If the perimeter of quadrilateral OAPB is given, then \(2r + 2PA\) equals it, which gives \(PA\).

Finding another point on the tangent line. Use the slope and the touching point to write the line, then test the choices.

Traps: not flipping the sign, using the diameter for the axis distance, and forgetting that \(r\) is positive even if the center's coordinate is negative.
```

## Easy
```task
In the \(xy\)-plane, a circle has center \((5, -4)\) and is tangent to the \(x\)-axis. An equation of the circle is \((x - 5)^2 + (y + 4)^2 = k\), where \(k\) is a constant. What is the value of \(k\)?
answer: 16
- 4 :: That is the radius. The equation needs \(r^2\).
- 25 :: You used the \(x\)-coordinate. The center is 4 from the axis.
highlight:
- "has center \((5, -4)\)" :: The center is 4 units from the \(x\)-axis.
- "is tangent to the \(x\)-axis" :: The radius reaches the axis, so \(r = 4\).
- "What is the value of \(k\)?" :: The right side of the equation is \(r^2\).
explain:
A circle that is tangent to the \(x\)-axis touches it at exactly one point. The radius to that point reaches from the center to the axis, so the radius equals the distance from the center to the \(x\)-axis.

The center is \((5, -4)\). The \(x\)-axis is the line \(y = 0\), and the center is 4 units below it (its \(y\)-coordinate has absolute value 4). So \(r = 4\).

The equation of a circle has \(r^2\) on the right side:

\[k = r^2 = 4^2 = 16\]

The value 4 is the radius, not \(r^2\). The value 25 comes from using the \(x\)-coordinate 5, which is the distance to the \(y\)-axis, not the \(x\)-axis. The answer is 16.
```

## Medium
```task
bank: m-1713
highlight:
- "its center at (-4, -6)" :: One end of the radius.
- "Line k is tangent to this circle at the point (-7, -7)" :: The radius ends here, and the tangent is perpendicular to it.
- "slope of line k" :: Find the radius slope, then flip and negate.
explain:
The radius to the touching point runs from the center \((-4, -6)\) to \((-7, -7)\). Its slope is rise over run:

\[\frac{-7 - (-6)}{-7 - (-4)} = \frac{-1}{-3} = \frac{1}{3}\]

A tangent line is perpendicular to the radius at the touching point. The slope of a perpendicular line is the negative reciprocal, so flip \(\frac{1}{3}\) and change its sign:

\[m = -3\]

Choice C, \(\frac{1}{3}\), is the slope of the radius, not of the tangent. The slope of line \(k\) is \(-3\), choice A.
```

## Hard
```task
bank: m-1798
highlight:
- "Line segments MH and NH are tangent to the circle at points M and N, respectively" :: Tangent segments from H are equal, and each is perpendicular to a radius.
- "the radius of the circle is 168 millimeters" :: GM and GN are radii, each 168.
- "the perimeter of quadrilateral GMHN is 3,856 millimeters" :: \(168 + 168 + MH + NH = 3{,}856\).
- "distance, in millimeters, between points G and H" :: GH is the hypotenuse of right triangle GMH.
explain:
The radii GM and GN each equal 168. The tangent segments MH and NH from the same outside point H are equal, so call each one \(t\). The perimeter of GMHN is

\[168 + 168 + t + t = 3{,}856 \quad\Rightarrow\quad 2t = 3{,}520 \quad\Rightarrow\quad t = 1{,}760\]

A tangent is perpendicular to the radius at the touching point, so triangle GMH has a right angle at M. The distance GH is its hypotenuse:

\[GH = \sqrt{168^2 + 1{,}760^2} = \sqrt{3{,}125{,}824} = 1{,}768\]

Choice C (1,760) is the tangent length itself. The distance is 1,768 millimeters, choice D.
```

# Inscribed angles
Vertex on the circle? Double the angle.

```visual
circles--inscribed
```

## Key ideas
An **inscribed angle** has its vertex on the circle. It is **half** its arc, so it is half the central angle that sees the same arc:

\[\text{central angle} = 2 \cdot \text{inscribed angle}\]

Two inscribed angles on the same arc are equal.

An angle inscribed in a **semicircle** (it sees a diameter) is \(90^\circ\), because half of \(180^\circ\) is \(90^\circ\). The reverse also holds: a right angle inscribed in a circle sees a diameter. So a rectangle inscribed in a circle has its diagonal as a diameter.

Double the inscribed angle first, then use the arc fractions from before.

The classic trap: using an inscribed angle as if it were central.

```example
A, B and C lie on a circle with radius 6. Angle ACB is \(30^\circ\). How long is minor arc AB?
1. Central angle \(= 2 \cdot 30^\circ = 60^\circ\) :: Double the inscribed angle.
2. \(\frac{60}{360} = \frac{1}{6}\) :: The fraction of the circle.
3. \(\frac{1}{6} \cdot 12\pi = 2\pi\) :: Fraction times circumference.
```

```theory
Why half. Take the case where one side of the inscribed angle is a diameter. The triangle formed with the center is isosceles (two radii), and the central angle is an exterior angle of that triangle, so it equals the sum of the two equal base angles, which is twice the inscribed angle. Any other inscribed angle on the same arc splits into two such cases or differs by two such cases, so the rule holds for all of them.

Angle on a diameter. If A and B are the endpoints of a diameter and C is any other point on the circle, then the arc from A to B is \(180^\circ\), so angle ACB is \(90^\circ\). Then triangle ABC is a right triangle with hypotenuse AB, the diameter. The other two angles add to \(90^\circ\).

Inscribed rectangle. The four corners of a rectangle on a circle: the diagonal makes right angles at the other two corners, so it is a diameter. If the diagonal is \(482\sqrt{3}\), the radius is \(241\sqrt{3}\). Combine this with the Pythagorean theorem and special triangles when other measurements are given. If the diagonal is twice the shortest side, you have a 30-60-90 triangle.

Inscribed square. The diagonal is a diameter, so the side is the radius times \(\sqrt{2}\).

Equal arcs, equal angles. Inscribed angles that see the same arc, or arcs of equal length, are equal. A triangle whose three corners lie on the circle has angles equal to half the arcs opposite them.

Reading the arcs. Names matter: angle ACB sees the arc AB that does not contain C. Make sure you know which arc, the minor or the major.

Traps: using the inscribed angle itself as the central angle, doubling twice, and taking the wrong arc.
```

## Easy
```task
Points A, B, and C lie on a circle with center O. Angle ACB measures \(28^\circ\). What is the measure, in degrees, of angle AOB?
- 28 :: That is the inscribed angle. The central angle is double.
* 56
- 14 :: You halved it. The central angle is twice the inscribed angle.
- 152 :: That is \(180 - 28\). Double the angle instead.
highlight:
- "Points A, B, and C lie on a circle with center O" :: C is on the circle, O is the center.
- "Angle ACB measures \(28^\circ\)" :: Vertex C is on the circle: an inscribed angle.
- "angle AOB" :: Vertex O is the center: a central angle, double the inscribed one.
explain:
Angle ACB has its vertex C on the circle, so it is an inscribed angle. Angle AOB has its vertex at the center O, so it is a central angle. Both look at the same arc AB.

A central angle is twice the inscribed angle on the same arc:

\[\angle AOB = 2 \cdot \angle ACB = 2 \cdot 28^\circ = 56^\circ\]

The value 28 would be the inscribed angle itself, and 14 halves it instead of doubling. The value 152 is the supplement of \(28^\circ\), which has nothing to do with the center.

The measure of angle AOB is 56 degrees.
```

## Medium
```task
Points A, B, and C lie on a circle with center O. Angle ACB measures \(45^\circ\), and the length of minor arc AB is \(5\pi\) centimeters. What is the radius, in centimeters, of the circle?
answer: 10
- 20 :: You used 45 as the central angle. Double it first.
- 5 :: The arc length is not the radius. Use the circle's fraction.
highlight:
- "Angle ACB measures \(45^\circ\)" :: Vertex C is on the circle: inscribed. The central angle is \(90^\circ\).
- "the length of minor arc AB is \(5\pi\) centimeters" :: A \(90^\circ\) arc is a quarter of the circle.
- "radius, in centimeters" :: Use \(C = 2\pi r\) at the end.
explain:
Angle ACB is an inscribed angle, so the central angle on the same arc is double it:

\[\angle AOB = 2 \cdot 45^\circ = 90^\circ\]

A \(90^\circ\) arc is \(\frac{90}{360} = \frac{1}{4}\) of the circle, so the circumference is four times the arc length:

\[C = 4 \cdot 5\pi = 20\pi\]

Now use \(C = 2\pi r\):

\[2\pi r = 20\pi \quad\Rightarrow\quad r = 10\]

If you used \(45^\circ\) as the central angle you would get a radius of 20, and that is the trap. The radius is 10 centimeters.
```

## Hard
```task
bank: m-1741
highlight:
- "A rectangle is inscribed in a circle" :: Each corner is a right angle on the circle, so the diagonal is a diameter.
- "The diagonal of the rectangle is twice the length of the shortest side of the rectangle" :: Short side \(s\), diagonal \(2s\): the other side is \(s\sqrt{3}\).
- "The area of the rectangle is 1,089sqrt(3) square units" :: \(s \cdot s\sqrt{3} = 1{,}089\sqrt{3}\), so \(s = 33\).
- "length, in units, of the diameter of the circle" :: The diameter is the diagonal, \(2s\).
explain:
A rectangle inscribed in a circle has right angles at its corners, and a right angle inscribed in a circle sees a diameter. So the rectangle's diagonal is a diameter, and the question asks for the diagonal.

Let the shortest side be \(s\). The diagonal is \(2s\), so the other side, by the Pythagorean theorem, is

\[\sqrt{(2s)^2 - s^2} = s\sqrt{3}\]

The area is length times width: \(s \cdot s\sqrt{3} = 1{,}089\sqrt{3}\). Divide by \(\sqrt{3}\): \(s^2 = 1{,}089\), so \(s = 33\).

The diameter equals the diagonal, \(2s = 66\). The answer is 66.
```
