---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Area, perimeter, volume and surface area, plus scaling with k, k² and k³.
---

# Perimeter and area
Perimeter goes around. Area fills the inside.

```visual
area-volume--rect
```

## Key ideas
**Perimeter** is the distance around a shape. **Area** is the amount of flat space inside it, measured in square units.

The reference sheet gives these (you do not have to memorise them):

\[A = \ell w \qquad A = \tfrac{1}{2}bh \qquad A = \pi r^2 \qquad C = 2\pi r\]

They are the area of a rectangle, the area of a triangle, the area of a circle and its circumference. In the triangle formula, \(h\) is the height measured at a right angle to the base \(b\), not a slanted side.

The sheet does not give perimeter. For a rectangle it is \(P = 2\ell + 2w\); for a square, \(A = s^2\) and \(P = 4s\).

The classic traps: using the diameter where the formula wants the radius (halve it first), and mixing up area (square units) with perimeter (plain units).

```example
A rectangle has a perimeter of 38 and a length of 11. What is its area?
1. \(2(11 + w) = 38\) :: Perimeter: two lengths and two widths.
2. \(11 + w = 19\), so \(w = 8\) :: Divide by 2, then subtract 11.
3. \(A = 11 \cdot 8 = 88\) :: Length times width.
```

```theory
A rectangle's two long sides are equal and its two short sides are equal, so its perimeter is two lengths plus two widths. Perimeter is a length, so it is measured in units such as inches. Area counts unit squares, so it is measured in square units such as square inches. That is why doubling every side doubles the perimeter but quadruples the area.

For a triangle, any side can be the base. The height is the straight distance from the opposite corner to the line holding that base, at a right angle. In a right triangle the two legs already meet at a right angle, so one leg is the base and the other is the height.

A circle's radius \(r\) is the distance from the center to the edge. The diameter is \(2r\). The circumference \(C = 2\pi r\) is the distance around, and the area \(A = \pi r^2\) is the inside. If a question gives you one, you can always recover \(r\) and find the other: \(C = 10\pi\) gives \(r = 5\) and \(A = 25\pi\).

How the SAT words these: "What is the area, in square units...", "the length is 3 more than the width", "the perimeter is 40". Often you must write two unknowns in terms of one letter, then use the given perimeter or area to solve for it. When the unknown ends up inside an area formula, you get an equation such as \(x(x + 4) = 60\).

Extra traps: a question may give the area of a square and ask for its perimeter, so take the square root first (\(A = 64\) gives \(s = 8\) and \(P = 32\)). Also check what is asked: sometimes you find the width but the question wants the area.
```

## Easy
```task
bank: m-1906
highlight:
- "The width of a rectangle is 7 centimeters" :: Start with the width: 7.
- "40 centimeters longer than the width" :: Length is width plus 40, so 47.
- "What is the area" :: Area, not perimeter: length times width.
explain:
The question gives the width directly and describes the length in words. The length is 40 centimeters longer than the width, so the length is \(7 + 40 = 47\) centimeters.

The area of a rectangle is length times width, so multiply the two sides:

\[A = 47 \cdot 7 = 329\]

Now check the choices. Choice C (54) is \(47 + 7\), which adds the sides instead of multiplying them. Choice A (7) is just the width, and choice B (14) is twice the width. Neither uses the length at all. The area is 329 square centimeters, choice D.
```

## Medium
```task
bank: m-1596
highlight:
- "same area as a circle with radius 2" :: Find the circle's area first: \(\pi r^2\).
- "length of one side of a square" :: A square with area \(A\) has side \(\sqrt{A}\).
explain:
This problem links two shapes through one number, their shared area. First find the circle's area from the formula on the reference sheet. With radius 2, \(A = \pi r^2 = \pi \cdot 2^2 = 4\pi\).

The square has the same area, and a square's area is its side squared, so \(s^2 = 4\pi\). Take the square root of both sides:

\[s = \sqrt{4\pi} = 2\sqrt{\pi}\]

Choice B, \(\sqrt{2\pi}\), uses \(\pi r = 2\pi\), forgetting to square \(r\). Choice D, \(2\pi\), forgets the square root. The side length is \(2\sqrt{\pi}\), choice C.
```

## Hard
```task
bank: m-0500
highlight:
- "The area of a triangle is equal to x^2 square centimeters" :: Area is given as \(x^2\). Use \(\tfrac{1}{2}bh\) and set it equal.
- "The length of the base of the triangle is 2x + 22 centimeters" :: Base is \(2x + 22\).
- "the height of the triangle is x - 10 centimeters" :: Height is \(x - 10\).
explain:
The area is given as an expression, so build an equation. Use the triangle formula \(A = \tfrac{1}{2}bh\) with the given base and height, and set it equal to the given area:

\[\tfrac{1}{2}(2x + 22)(x - 10) = x^2\]

Half of \(2x + 22\) is \(x + 11\), so the equation becomes

\[(x + 11)(x - 10) = x^2\]

Expand the left side to get \(x^2 + x - 110 = x^2\). The \(x^2\) terms cancel on both sides, which leaves a simple equation, \(x - 110 = 0\).

So \(x = 110\). As a check, the base is 242, the height is 100, and \(\tfrac{1}{2} \cdot 242 \cdot 100 = 12{,}100 = 110^2\).
```

# Beyond the sheet
Parallelogram and trapezoid are not on the sheet.

```visual
area-volume--trapezoid
```

## Key ideas
Two area formulas are **not** on the reference sheet. Memorise them:

\[A_{\text{parallelogram}} = bh \qquad A_{\text{trapezoid}} = \tfrac{1}{2}(b_1 + b_2)\,h\]

A **parallelogram** has two pairs of parallel sides. A **trapezoid** has one pair of parallel sides, called the bases \(b_1\) and \(b_2\). In both formulas, \(h\) is the straight distance between the parallel sides, at a right angle. It is never the slanted side.

A trapezoid's area is the average of its two bases times the height.

For a shaded or combined shape, split it into pieces you know, then add the pieces, or subtract a cut-out part from the whole.

If a question needs a formula that is neither on the sheet nor in this lesson, the question gives it to you.

```example
A trapezoid has parallel sides of 7 and 13 and a height of 5. What is its area?
1. \(\tfrac{1}{2}(7 + 13) \cdot 5\) :: Average of the bases, times the height.
2. \(10 \cdot 5 = 50\) :: Half of 20 is 10.
```

```theory
Why these formulas work. Cut a right triangle off one end of a parallelogram and slide it to the other end: you get a rectangle with the same base and the same height, so the area is \(bh\). That is why the slanted side does not matter. Two parallelograms with the same base and height have the same area, even if one leans more.

For a trapezoid, take a second copy, turn it upside down, and attach it to the first. Together they form a parallelogram with base \(b_1 + b_2\) and the same height. Its area is \((b_1 + b_2)h\), and one trapezoid is half of that. This gives \(\tfrac{1}{2}(b_1 + b_2)h\).

Special cases: a rectangle and a rhombus are both parallelograms. If a trapezoid's two bases are equal, it is a parallelogram and the formula becomes \(bh\).

Shaded regions: label the whole shape and the removed shape, find each area with a formula you know, and subtract. A common case is a square with a circle cut out, which leaves \(s^2 - \pi r^2\). Another is a rectangle with a triangle cut from one corner.

Traps: using the slanted side as the height, forgetting the one half in the trapezoid formula, and adding the bases but not halving the sum. On the SAT, an answer that is "too big by a factor of 2" is often the missing \(\tfrac{1}{2}\).
```

## Easy
```task
A parallelogram has a base of 14 centimeters, a slanted side of 9 centimeters, and a height of 6 centimeters. What is the area, in square centimeters, of the parallelogram?
* 84
- 126 :: You used the slanted side. Use the height, 6.
- 54 :: You multiplied the slanted side by the height. Use the base.
- 46 :: That is the perimeter. Area is base times height.
highlight:
- "a base of 14 centimeters" :: This is the base \(b\).
- "a height of 6 centimeters" :: The height is the perpendicular distance, so use 6, not 9.
explain:
The parallelogram formula is not on the reference sheet, so you have to remember it: \(A = bh\). The base is 14 centimeters and the height is 6 centimeters.

\[A = 14 \cdot 6 = 84\]

The slanted side, 9 centimeters, is a distractor. It is longer than the height, and it does not measure the distance between the two parallel sides at a right angle. Using it would give \(14 \cdot 9 = 126\), which is wrong. Multiplying 9 by 6 gives 54, which uses the wrong pair of lengths.

The area is 84 square centimeters.
```

## Medium
```task
A garden bed is shaped like a trapezoid. Its two parallel sides are 8 meters and 14 meters long, and the distance between them is 5 meters. What is the area, in square meters, of the garden bed?
answer: 55
- 110 :: You forgot the one half in the formula.
- 70 :: You used only the longer base. Average the two bases.
- 40 :: You used only the shorter base. Average the two bases.
highlight:
- "two parallel sides are 8 meters and 14 meters long" :: These are the bases \(b_1\) and \(b_2\).
- "the distance between them is 5 meters" :: That is the height \(h\).
explain:
The two parallel sides are the bases, and the distance between them is the height. The trapezoid formula is not on the reference sheet, so it has to come from memory:

\[A = \tfrac{1}{2}(b_1 + b_2)\,h = \tfrac{1}{2}(8 + 14)(5)\]

First average the bases: \(\tfrac{1}{2}(22) = 11\). Then multiply by the height: \(11 \cdot 5 = 55\).

The area is 55 square meters. If you got 110, you skipped the \(\tfrac{1}{2}\). If you got 70 or 40, you used only one of the two bases.
```

## Hard
```task
The area of a trapezoid is 108 square units. The height of the trapezoid is 9 units, and one of its parallel sides is 8 units long. What is the length, in units, of the other parallel side?
* 16
- 24 :: That is the sum of the bases. Subtract the 8.
- 12 :: You divided area by height and skipped the factor 2.
- 32 :: You added 8 to the sum of the bases instead of subtracting.
highlight:
- "area of a trapezoid is 108 square units" :: Put 108 on the left of \(\tfrac{1}{2}(b_1 + b_2)h\).
- "height of the trapezoid is 9 units" :: \(h = 9\).
- "one of its parallel sides is 8 units long" :: One base is 8. Solve for the other.
explain:
This is the trapezoid formula run backward. Write it with the known values and call the missing base \(b\):

\[108 = \tfrac{1}{2}(8 + b)(9)\]

Multiply both sides by 2 to clear the half: \(216 = 9(8 + b)\). Divide both sides by 9: \(24 = 8 + b\). Notice that 24 is the sum of the two bases, not the missing base, so one more step is needed.

Subtract 8: \(b = 16\).

Check: \(\tfrac{1}{2}(8 + 16)(9) = 12 \cdot 9 = 108\). The other parallel side is 16 units long.
```

# Volume formulas
The sheet gives them. Cones and pyramids take a third.

```visual
area-volume--sheet
```

## Key ideas
**Volume** is the space inside a solid, in cubic units. The reference sheet gives all five of these:

\[V_{\text{box}} = \ell w h \qquad V_{\text{cylinder}} = \pi r^2 h\]
\[V_{\text{sphere}} = \tfrac{4}{3}\pi r^3 \qquad V_{\text{cone}} = \tfrac{1}{3}\pi r^2 h \qquad V_{\text{pyramid}} = \tfrac{1}{3}\ell w h\]

For a prism or cylinder, volume is base area times height. A cone or pyramid holds exactly one third of that.

Two habits save points. First, halve a diameter to get the radius, because every formula with \(r\) wants the radius. Second, when the volume is given and a length is missing, put every known number into the formula and solve for the one left.

In a **right** solid (a right cylinder, a right prism), the sides stand straight up at a right angle to the base, so the height is simply the side length.

```example
A cylinder has a diameter of 10 and a height of 3. What is its volume?
1. \(r = 10 \div 2 = 5\) :: Halve the diameter.
2. \(V = \pi \cdot 5^2 \cdot 3\) :: Base area times height.
3. \(V = 75\pi\) :: \(25 \cdot 3 = 75\).
```

```theory
A box, a cylinder and any other "straight" solid with the same base on the top and bottom can be built by stacking identical layers. Each layer has the base area, so the volume is base area times height. For a box the base area is \(\ell w\); for a cylinder it is \(\pi r^2\).

A cone and a pyramid come to a point. They hold exactly one third of the matching prism or cylinder with the same base and height, which is why the sheet shows \(\tfrac{1}{3}\) in front. The sphere's formula, \(\tfrac{4}{3}\pi r^3\), has no height because every direction measures \(r\).

Working backward. If the volume is given, treat the formula as an equation. For a cone with \(V = 48\pi\) and \(r = 4\): \(\tfrac{1}{3}\pi(16)h = 48\pi\). Divide both sides by \(\pi\), multiply by 3, and divide by 16 to get \(h = 9\). Cancelling \(\pi\) early makes the arithmetic much lighter.

A right circular cone also has a slant height \(s\), the distance from the tip down the side to the base's edge. It is not the height. The height, the radius and the slant height form a right triangle, so \(s^2 = r^2 + h^2\).

How the SAT words these: "right circular cylinder" means a cylinder standing straight up; "right rectangular prism" is a box. A question may give the circumference of the base instead of the radius: use \(2\pi r = C\) first. Also check units: if the lengths are in different units, convert before using a formula.

Traps: using the diameter as the radius, forgetting the \(\tfrac{1}{3}\) for a cone or pyramid, and answering with the height when the question asks for the slant height.
```

## Easy
```task
bank: m-1651
highlight:
- "diameter of 8 inches" :: The radius is half of the diameter: 4.
- "height of 12 inches" :: Height \(h = 12\).
- "What is the volume" :: Use \(V = \pi r^2 h\).
explain:
The cylinder formula is on the reference sheet: \(V = \pi r^2 h\). The question gives the diameter, 8 inches, but the formula needs the radius, so first halve it: \(r = 8 \div 2 = 4\).

Now put the radius and the height into the formula and multiply:

\[V = \pi \cdot 4^2 \cdot 12 = \pi \cdot 16 \cdot 12 = 192\pi\]

Choice D, \(768\pi\), is what you get by using the diameter 8 as the radius (\(64 \cdot 12 = 768\)). The volume is \(192\pi\) cubic inches, choice C.
```

## Medium
```task
bank: m-1604
highlight:
- "The circumference of the base of a right circular cylinder is 20πmeters" :: You know \(C = 2\pi r\). Find \(r\) first.
- "the height of the cylinder is 6 meters" :: Height \(h = 6\).
explain:
The question does not give the radius. It gives the circumference of the base instead, so find the radius first. The base of a cylinder is a circle, and its circumference is \(2\pi r\). Set it equal to \(20\pi\) and divide by \(2\pi\):

\[2\pi r = 20\pi \quad\Rightarrow\quad r = 10\]

Now use the volume formula from the reference sheet with \(r = 10\) and \(h = 6\):

\[V = \pi r^2 h = \pi \cdot 100 \cdot 6 = 600\pi\]

Choice B, \(120\pi\), comes from mixing up the circumference and the base area. The volume is \(600\pi\) cubic meters, choice C.
```

## Hard
```task
bank: m-1811
highlight:
- "volume of 71,148π cubic centimeters" :: Use \(V = \tfrac{1}{3}\pi r^2 h\) to find the height.
- "the area of its base is 5,929π square centimeters" :: \(\pi r^2 = 5{,}929\pi\), so \(r = 77\).
- "slant height" :: Not the height. Use the right triangle with \(r\) and \(h\).
explain:
This is a two-stage problem. First find the cone's height, then use it to find the slant height.

The base area is \(\pi r^2 = 5{,}929\pi\), so \(r^2 = 5{,}929\) and \(r = 77\). Use the cone volume with the base area in place of \(\pi r^2\), so \(V = \tfrac{1}{3}(\text{base area})\,h\):

\[71{,}148\pi = \tfrac{1}{3}(5{,}929\pi)\,h \quad\Rightarrow\quad h = 36\]

The question asks for the slant height \(s\), which is the hypotenuse of the right triangle with legs \(r = 77\) and \(h = 36\):

\[s = \sqrt{77^2 + 36^2} = \sqrt{7{,}225} = 85\]

Choice B (36) is the height, not the slant height. The slant height is 85 centimeters, choice D.
```

# Combine solids
Split into sheet solids. Add or subtract.

```visual
area-volume--silo
```

## Key ideas
Many SAT solids are two or three simple solids joined together. Name each piece, find its volume with a sheet formula, then add.

If a piece is cut out of a solid (a drilled hole, a scooped dent), subtract its volume instead.

A **hemisphere** is half of a sphere, cut straight through the middle. The sheet has no hemisphere formula, so halve the sphere's:

\[V_{\text{hemisphere}} = \tfrac{1}{2}\cdot\tfrac{4}{3}\pi r^3 = \tfrac{2}{3}\pi r^3\]

Watch the shared dimensions. A hemisphere's radius equals the cylinder's radius when they are joined end to end, and the hemisphere's radius also uses up part of the total length.

```example
A tank is a cylinder (radius 6, height 10) with a hemisphere (radius 6) on top. What is its volume?
1. Cylinder: \(\pi \cdot 6^2 \cdot 10 = 360\pi\) :: Base area times height.
2. Hemisphere: \(\tfrac{2}{3}\pi \cdot 6^3 = 144\pi\) :: Half of a sphere.
3. Total: \(360\pi + 144\pi = 504\pi\) :: Add the pieces.
```

```theory
Volume is additive: if two solids touch but do not overlap, the volume of the combined solid is the sum of their volumes. This only works if you count each region once, so make sure the pieces do not overlap and that nothing is left out.

Common combinations on the SAT: a cylinder with a cone on top (a silo or a pencil tip), a cylinder with a hemisphere on top, a capsule (a cylinder with a hemisphere at each end), a cube or box with a sphere or cylinder inside, and a block with a hole drilled through it.

The capsule is a good example of a shared dimension. If the whole capsule is 30 long and each end is a hemisphere of radius 4, then the two hemispheres use up \(4 + 4 = 8\) of the length. The cylinder part is only \(30 - 8 = 22\) long. The two hemispheres together make one full sphere of radius 4, so you can add one sphere's volume.

For a hole, use the hole's own dimensions. A square hole 3 by 3 drilled through a block of height 5 removes a box that is 3 by 3 by 5, which is 45.

For "the space not taken up", subtract: the volume of the container minus the volume of the object inside. Sometimes the question asks for a decimal answer; use a calculator and round only at the end.

Traps: using the full height for the cylinder, forgetting to halve the sphere for a hemisphere, adding when the question wants a difference, and mixing up the diameter and the radius when a sphere fits snugly inside a cube (the sphere's diameter equals the cube's edge).
```

## Easy
```task
A solid block is a right rectangular prism that measures 10 centimeters by 6 centimeters by 4 centimeters. A square hole 2 centimeters by 2 centimeters is drilled straight through the block along the 4-centimeter side. What is the volume, in cubic centimeters, of the block after the hole is drilled?
answer: 224
- 240 :: That is the block before drilling. Subtract the hole.
- 16 :: That is the hole only. Subtract it from the block.
- 236 :: Your hole is only 1 tall. It goes through all 4.
highlight:
- "10 centimeters by 6 centimeters by 4 centimeters" :: Block volume is the product of these three.
- "2 centimeters by 2 centimeters is drilled straight through the block along the 4-centimeter side" :: The hole is a 2 by 2 by 4 box.
- "after the hole is drilled" :: Subtract the hole from the block.
explain:
Treat the block with a hole as a whole block minus the piece that was removed. The block's volume is \(\ell w h = 10 \cdot 6 \cdot 4 = 240\).

The hole goes straight through the 4-centimeter side, so the removed piece is itself a small box that is 2 by 2 by 4:

\[2 \cdot 2 \cdot 4 = 16\]

Subtract the hole from the block, because that material is gone:

\[240 - 16 = 224\]

The remaining volume is 224 cubic centimeters.
```

## Medium
```task
bank: m-1621
highlight:
- "A cube has an edge length of 68 inches" :: Cube volume is \(68^3\).
- "A solid sphere with a radius of 34 inches is inside the cube" :: The sphere has radius 34, half the edge.
- "volume of the space in the cube not taken up by the sphere" :: Subtract: cube minus sphere.
explain:
The question asks for the space left over, so subtract the sphere's volume from the cube's volume. The sphere touches every face, so its diameter, 68, equals the cube's edge, which matches the given radius of 34.

Cube: \(68^3 = 314{,}432\) cubic inches.

Sphere with radius 34, using the formula on the reference sheet:

\[\tfrac{4}{3}\pi \cdot 34^3 \approx 164{,}636\]

Space not taken up:

\[314{,}432 - 164{,}636 \approx 149{,}796\]

Choice B (about 164,500) is roughly the sphere's own volume, so it answers the wrong question. The space left is about 149,796 cubic inches, choice A.
```

## Hard
```task
A medicine capsule is a cylinder with a hemisphere attached to each end. The radius of the cylinder is 3 millimeters, and the total length of the capsule, from tip to tip, is 22 millimeters. The volume of the capsule is \(k\pi\) cubic millimeters. What is the value of \(k\)?
answer: 180
- 234 :: You used 22 as the cylinder's length. The ends take up 6.
- 144 :: That is the cylinder only. Add the two hemispheres.
- 216 :: You doubled the sphere. Two hemispheres make one sphere.
highlight:
- "a hemisphere attached to each end" :: Two hemispheres make one full sphere of radius 3.
- "The radius of the cylinder is 3 millimeters" :: Radius 3 for the cylinder and for both ends.
- "the total length of the capsule, from tip to tip, is 22 millimeters" :: The ends use up 3 + 3 = 6, so the cylinder is 16 long.
explain:
Split the capsule into three pieces: a cylinder in the middle and a hemisphere at each end.

Each hemisphere has radius 3, so the two ends together use \(3 + 3 = 6\) millimeters of the total length. The cylinder part is therefore only \(22 - 6 = 16\) millimeters long, not 22.

Cylinder:

\[V = \pi r^2 h = \pi \cdot 9 \cdot 16 = 144\pi\]

Two hemispheres make one whole sphere of radius 3:

\[V = \tfrac{4}{3}\pi \cdot 3^3 = 36\pi\]

Add the pieces: \(144\pi + 36\pi = 180\pi\), so \(k = 180\).
```

# Surface area
Add the area of every outside face.

```visual
area-volume--net
```

## Key ideas
**Surface area** is the total area of the outside of a solid. The sheet does not give it, so build it from faces, or use the formula the question provides.

Picture the solid unfolded flat (its **net**), find each piece's area, and add. Opposite faces of a box match, so double three areas:

\[SA_{\text{box}} = 2(\ell w + \ell h + wh) \qquad SA_{\text{cube}} = 6s^2\]

A closed cylinder has two circles and one curved side that unrolls into a rectangle:

\[SA_{\text{cylinder}} = 2\pi r^2 + 2\pi r h\]

Surface area is in square units, volume in cubic units. If the problem gives the surface area and asks for a length, set the formula equal to it and solve.

```example
A closed box measures 3 by 5 by 6. What is its surface area?
1. Faces: \(3 \cdot 5 = 15\), \(3 \cdot 6 = 18\), \(5 \cdot 6 = 30\) :: Three different faces.
2. Each appears twice :: Opposite faces match.
3. \(2(15 + 18 + 30) = 126\) :: Add the three, then double.
```

```theory
A net is the solid cut along some edges and laid flat. The surface area is simply the area of the net. For a box, the net has six rectangles: top and bottom, front and back, left and right. Because opposite faces are equal, you only need three different areas.

A cylinder's net is two circles and one rectangle. The rectangle's height is the cylinder's height, and its width is the circumference of the base, \(2\pi r\), so its area is \(2\pi r h\). Add the two circles, \(2 \cdot \pi r^2\).

A pyramid's net is a base plus triangles. For a right square pyramid with base side \(s\) and slant height \(\ell\), each triangle has area \(\tfrac{1}{2}s\ell\), so the four lateral faces total \(2s\ell\). The slant height is the height of a face, not the pyramid's height. To connect them, use the right triangle formed by the pyramid's height, the slant height, and half the base side.

If a sphere's surface area appears, its formula is \(4\pi r^2\), and the SAT gives it in the question when needed. The general rule from the test makers is that rarely used formulas are provided.

"Open" versus "closed": a closed box has all six faces; an open-top box has five. A can with no lid has one circle. Read the wording and count faces.

Working backward: if a cube has surface area 96, then \(6s^2 = 96\), \(s^2 = 16\), \(s = 4\). Note that this is a different answer from \(s = 96 \div 6\).

Traps: forgetting to double, forgetting a face, and mixing up the volume and the surface area when the dimensions are the same.
```

## Easy
```task
bank: m-1877
highlight:
- "right rectangular prism are 4 inches by 5 inches by 6 inches" :: Three dimensions give three different faces.
- "surface area, in square inches" :: Add the area of all six faces.
explain:
Surface area is not on the reference sheet, so build it from the faces. A box has three pairs of matching faces. With dimensions 4, 5 and 6, the three different faces have areas

\[4 \cdot 5 = 20, \qquad 4 \cdot 6 = 24, \qquad 5 \cdot 6 = 30\]

Each of these appears twice, once on each side of the box, so add them and double:

\[SA = 2(20 + 24 + 30) = 2(74) = 148\]

Choice B (74) forgets to double. Choice C (120) is the volume, \(4 \cdot 5 \cdot 6\), not the surface area. The surface area is 148 square inches, choice D.
```

## Medium
```task
bank: m-1923
highlight:
- "A cube has a surface area of 54 square meters" :: A cube has 6 equal faces, so \(6s^2 = 54\).
- "volume" :: After you find the edge \(s\), cube it.
explain:
The question gives the surface area but asks for the volume, so you need the edge length as a bridge. A cube has six identical square faces, so \(SA = 6s^2\). Set that equal to 54 and solve for \(s\):

\[6s^2 = 54 \quad\Rightarrow\quad s^2 = 9 \quad\Rightarrow\quad s = 3\]

Now use the edge to get the volume with \(V = s^3\):

\[V = 3^3 = 27\]

Choice A (18) comes from dividing 54 by 3 instead of finding the edge first. The volume is 27 cubic meters, choice B.
```

## Hard
```task
bank: m-1814
highlight:
- "total surface area of 70,560 square inches" :: This includes the square base.
- "four lateral faces of this pyramid is 38,160 square inches" :: Subtract to get the base area.
- "What is the height" :: Not the slant height. Use the right triangle.
explain:
Total surface area equals the base plus the four lateral faces, so the base area is \(70{,}560 - 38{,}160 = 32{,}400\). The base is a square, so its side is \(\sqrt{32{,}400} = 180\).

Each lateral face has area \(38{,}160 \div 4 = 9{,}540\). A face is a triangle with base 180, so

\[\tfrac{1}{2}(180)\,\ell = 9{,}540 \quad\Rightarrow\quad \ell = 106\]

The slant height \(\ell\) is the hypotenuse of a right triangle whose legs are the pyramid's height \(h\) and half the base side, 90:

\[h = \sqrt{106^2 - 90^2} = \sqrt{3{,}136} = 56\]

Choice C (106) is the slant height. The height is 56 inches, choice A.
```

# Scale factor
Lengths \(\times k\), areas \(\times k^2\), volumes \(\times k^3\).

```visual
area-volume--similar
```

## Key ideas
Two solids are **similar** if one is an enlargement of the other: every length is multiplied by the same **scale factor** \(k\). Then

\[\text{lengths} \times k \qquad \text{areas} \times k^2 \qquad \text{volumes} \times k^3\]

Lengths are edges, radii, heights and perimeters. Areas are surface area and base area. Volumes are volumes.

Working backward, take a root: if the area ratio is 16, then \(k = \sqrt{16} = 4\), and the volume ratio is \(4^3 = 64\).

The classic trap: \(k^3\) only applies when **every** length is scaled. If only the radius or only the height changes, put the change into the formula. Doubling only the radius of a cylinder gives \(\pi(2r)^2 h = 4\pi r^2 h\): times 4, not times 8.

```example
Two cones are similar. Each length of the larger is 3 times the matching length of the smaller. The smaller has surface area 20 and volume 8. Find the larger's.
1. \(k = 3\) :: The scale factor.
2. Area: \(20 \cdot 3^2 = 180\) :: Areas grow by \(k^2\).
3. Volume: \(8 \cdot 3^3 = 216\) :: Volumes grow by \(k^3\).
```

```theory
Why the powers. Doubling every length of a rectangle makes it twice as long and twice as wide, so it needs \(2 \cdot 2 = 4\) times as many unit squares. A solid that is stretched in three directions needs \(2 \cdot 2 \cdot 2 = 8\) times as many unit cubes. In general, each extra direction multiplies by \(k\): one direction for lengths, two for areas, three for volumes.

On the SAT this shows up as "A scale model has lengths 1/10 of the real thing. What is the area of the model?" The area is multiplied by \((\tfrac{1}{10})^2 = \tfrac{1}{100}\). Another version gives areas or volumes of two similar solids and asks for a length: take a square root for an area ratio and a cube root for a volume ratio.

Percent changes. If a radius increases by 30%, then \(k = 1.3\), so the area of the circle is multiplied by \(1.3^2 = 1.69\), which is a 69% increase. The percent is not 30% and not 60%.

Perimeters scale like lengths (\(k\)), because a perimeter is a sum of lengths. Do not square them.

Not all changes are similar. If a cylinder's radius doubles and its height stays the same, the new volume is \(\pi(2r)^2 h = 4\pi r^2 h\), four times the original. If instead the radius triples and the height is divided by 3, the volume becomes \(\pi(3r)^2(\tfrac{h}{3}) = 3\pi r^2 h\), three times the original. Always rewrite the formula with the new values rather than reaching for \(k^3\).

Traps: using \(k\) for area, using \(k^2\) for volume, and applying \(k^3\) when only one length changed.
```

## Easy
```task
bank: m-12921
highlight:
- "Parallelogram ABCD is similar to parallelogram PQRS" :: Similar shapes: lengths scale by \(k\), areas by \(k^2\).
- "The length of each side of parallelogram PQRS is 2 times" :: So \(k = 2\).
- "The area of parallelogram ABCD is 30 square centimeters" :: Start from 30, then scale it.
explain:
The two parallelograms are similar, so one is an enlargement of the other. Every side of PQRS is 2 times the matching side of ABCD, which gives a scale factor \(k = 2\) for lengths.

Areas do not grow by the length factor. They grow by \(k^2\):

\[k^2 = 2^2 = 4\]

So the area of PQRS is \(4 \cdot 30 = 120\) square centimeters.

Choice B (60) only doubles the area, which treats an area like a length. Choice D (900) squares the area instead of the scale factor. The area of PQRS is 120 square centimeters, choice C.
```

## Medium
```task
bank: m-1840
highlight:
- "The volume of right circular cylinder A is 22 cubic centimeters" :: Volume of A is 22.
- "twice the radius and half the height of cylinder A" :: Only two changes, so put them in \(\pi r^2 h\).
explain:
The new cylinder is not similar to cylinder A, because the radius and the height change by different factors. That means \(k^3\) does not apply, so put the new values into the formula \(V = \pi r^2 h\) instead.

New radius \(2r\), new height \(\tfrac{h}{2}\):

\[V_{\text{new}} = \pi (2r)^2 \cdot \tfrac{h}{2} = \pi \cdot 4r^2 \cdot \tfrac{h}{2} = 2\pi r^2 h\]

That is twice the original volume, \(2 \cdot 22 = 44\).

Choice B (22) wrongly assumes the changes cancel. Doubling the radius multiplies the base area by 4, and halving the height only halves it. The new volume is 44 cubic centimeters, choice C.
```

## Hard
```task
bank: m-13942
highlight:
- "Right rectangular prism X is similar to right rectangular prism Y" :: Similar solids: use \(k\), \(k^2\), \(k^3\).
- "The surface area of right rectangular prism X is 59 square centimeters (cm^2)" :: Surface area of X is 59.
- "the surface area of right rectangular prism Y is 1,475 cm^2" :: \(1475 \div 59 = 25 = k^2\), so \(k = 5\).
- "The volume of right rectangular prism Y is 1,500 cm^3" :: Volume of Y is 1,500. X's volume is \(\tfrac{1}{125}\) of it.
explain:
The prisms are similar, so their surface areas are in the ratio \(k^2\). Divide the larger surface area by the smaller to find it:

\[\frac{1{,}475}{59} = 25 = k^2 \quad\Rightarrow\quad k = 5\]

Volumes are in the ratio \(k^3 = 5^3 = 125\). Prism Y is the larger one, so prism X has a volume that is 125 times smaller:

\[\frac{1{,}500}{125} = 12\]

The question asks for the sum of the two volumes, so add them:

\[12 + 1{,}500 = 1{,}512\]

The answer is 1,512 cubic centimeters.
```
