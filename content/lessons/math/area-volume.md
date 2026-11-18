---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Use area, perimeter, volume and surface area. Scale solids with k, k², k³.
---

# Area and perimeter
Perimeter goes around. Area fills the inside.

## Around and inside

**Perimeter** is the distance around a shape. **Area** is the space inside. Rectangle area = length × width.

```visual
area-volume--rect
```

```example
A rectangle has a perimeter of 30 and a length of 9. What is its area?
1. 2 × (9 + w) = 30 :: Perimeter: two lengths and two widths.
2. 9 + w = 15, so w = 6 :: Divide by 2. Subtract 9.
3. Area = 9 × 6 = 54 :: Length × width.
```

```more
The reference sheet gives: rectangle area A = ℓw, triangle area A = ½bh (b is the base, h is the height), circle area A = πr² and circumference C = 2πr. To find the perimeter of a rectangle, add all four sides: 2 × (length + width).
```

## Circle: area to circumference

```quiz
The area of a circle is 49π. What is its circumference?
* 14π
- 7π :: That is r × π. Circumference is 2πr.
- 49π :: That is the area. Find r first: πr² = 49π.
> πr² = 49π, so r = 7. Circumference = 2πr = 14π.
```

# Volume formulas
The sheet gives them. Cones and pyramids take a third.

## Use the sheet

The reference sheet gives these volumes. Circle formulas need the radius: halve a diameter first.

```visual
area-volume--sheet
```

```example
A cylinder has a diameter of 6 and a height of 5. What is its volume?
1. r = 6 ÷ 2 = 3 :: Halve the diameter.
2. Base area = π × 3² = 9π :: The base is a circle: πr².
3. V = 9π × 5 = 45π :: Base area × height.
```

```more
**Volume** is the space inside a solid. A right rectangular prism is a box with square corners. For prisms and cylinders: volume = base area × height. Cones and pyramids hold one third of that. A sphere holds 4/3 πr³.
```

## Pyramids hold one third

Cones and pyramids hold 1/3 of base area × height.

```quiz
A pyramid has a rectangular base that is 6 by 5 and a height of 9. What is its volume?
answer: 90
- 270 :: You forgot the 1/3. A pyramid holds a third.
- 30 :: That is the base area. Multiply by the height, then by 1/3.
> Base area = 6 × 5 = 30. V = 1/3 × 30 × 9 = 90.
```

## Spheres

```quiz
A sphere has a diameter of 6. Its volume is kπ cubic units. What is the value of k?
answer: 36
- 288 :: You used 6 as the radius. Halve the diameter first.
- 108 :: You forgot the 1/3 in 4/3. Use 4/3 × 27.
> r = 3. V = 4/3 × π × 3³ = 4/3 × 27π = 36π, so k = 36.
```

# Combine solids
Add the volumes of the pieces.

## Add the pieces

Split a combined solid into pieces from the sheet. Add their volumes. A hemisphere is half a sphere.

```visual
area-volume--silo
```

```example
A silo is a cylinder with radius 3 and height 10, topped by a hemisphere with radius 3. What is its volume?
1. Cylinder: π × 3² × 10 = 90π :: Base area × height.
2. Hemisphere: ½ × 4/3 × π × 3³ = 18π :: Half a sphere.
3. Total: 90π + 18π = 108π :: Add the pieces.
```

```more
A **hemisphere** is half of a sphere, cut straight through the middle. Its volume is half of 4/3 πr³, which is 2/3 πr³. Here r = 3, so 2/3 × π × 27 = 18π. If a piece is cut out of a solid, subtract its volume instead of adding it.
```

## Cylinder and cone

```quiz
A solid is a cylinder with radius 2 and height 5, with a cone of radius 2 and height 3 on top. The volume of the solid is kπ. What is the value of k?
answer: 24
- 20 :: That is the cylinder only. Add the cone.
- 32 :: You forgot the 1/3 for the cone. Cone = 1/3 × 4 × 3.
> Cylinder: π × 4 × 5 = 20π. Cone: 1/3 × π × 4 × 3 = 4π. Total 24π, so k = 24.
```

# Work backward
Volume given? Plug in, divide, take the root.

## Solve for the missing length

Put the known numbers into the formula. Solve for the one left.

```visual
area-volume--backward
```

```example
A cone has a volume of 48π and a radius of 4. What is its height?
1. ⅓ × π × 4² × h = 48π :: Fill in the formula.
2. 16h = 144 :: Drop π. Multiply by 3.
3. h = 9 :: Divide by 16.
```

```more
"Drop π" means divide both sides by π. Then 1/3 × 16 × h = 48. Multiply both sides by 3: 16h = 144. Divide by 16: h = 9. Check: 1/3 × π × 16 × 9 = 48π. ✓
```

## Prism height

```quiz
A right rectangular prism has a volume of 120 and a base that is 4 by 5. What is the height of the prism?
answer: 6
- 30 :: You divided by only one side. The base area is 4 × 5.
- 24 :: That is 120 ÷ 5. Divide by the whole base area, 20.
> Base area = 4 × 5 = 20. V = base area × height, so h = 120 ÷ 20 = 6.
```

## Find the radius

```quiz
A cylinder has a volume of 80π and a height of 5. What is its radius?
* 4
- 16 :: That is r². Take the square root.
- 8 :: That is the diameter. The radius is half.
> πr² × 5 = 80π, so r² = 16 and r = 4.
~ type y=5x^{2} :: π cancels: 5r² = 80. Type each side, x for r.
~ type y=80
~ zoom -2 8 -20 120
~ point (4, 80) :: Click the crossing: r = 4.
```

# Surface area
Add the area of every outside face.

## Add the faces

**Surface area** is the total area of all outside faces. The sheet does not give it. Picture the net.

```visual
area-volume--net
```

```example
A closed box is 2 by 3 by 4. What is its surface area?
1. Faces 2×3, 2×4, 3×4 = 6, 8, 12 :: Three different faces.
2. Each face appears twice :: Opposite faces match.
3. 2 × (6 + 8 + 12) = 52 :: Add the pairs.
```

```more
A **net** is the solid unfolded flat. A box has 6 faces, and opposite faces are equal: find three areas and double the total. A cube has 6 equal squares, so its surface area is 6s². A closed cylinder has two circles (2πr²) and one curved side (2πrh).
```

## Cylinder surface

```quiz
A closed cylinder has a radius of 3 and a height of 5. What is its surface area?
- 30π :: That is only the side, 2πrh. Add the two circles.
* 48π
- 18π :: That is only the two circles, 2πr². Add the side.
> Two circles: 2π × 9 = 18π. Side: 2π × 3 × 5 = 30π. Total 48π.
```

## Back to the edge

```quiz
A cube has a surface area of 96. What is the length of one edge?
answer: 4
- 16 :: That is one face's area. Take the square root.
- 8 :: You halved 16. Take the square root.
> 6s² = 96, so s² = 16 and s = 4.
~ type y=6x^{2} :: Six faces of x² each.
~ type y=96
~ zoom -2 8 -20 140
~ point (4, 96) :: Click the crossing: edge = 4.
```

# Scaling: k, k², k³
Lengths × k: areas × k², volumes × k³.

## Similar solids

**Similar** solids: every length is multiplied by the same k. Areas grow by k². Volumes grow by k³.

```visual
area-volume--similar
```

```example
Two cones are similar. Each length of the larger is 2 times the smaller's. The smaller has surface area 10 and volume 6. Find the larger's.
1. k = 2 :: The length factor.
2. Area: 10 × 2² = 40 :: Areas grow by k².
3. Volume: 6 × 2³ = 48 :: Volumes grow by k³.
```

```more
**Similar** means the same shape in a different size, like a photo and its enlargement. Lengths (edge, radius, height) are × k. Areas (surface area, base area) are × k². Volumes are × k³. With k = 2: 4 times the area and 8 times the volume.
```

## From area to volume

```quiz
Two cylinders are similar. The larger has 9 times the surface area of the smaller. The smaller has a volume of 40. What is the volume of the larger?
answer: 1080
- 120 :: You multiplied by k = 3. Volume uses k³.
- 360 :: 9 is k², the area factor. Volume uses k³.
> k² = 9, so k = 3. Volume grows by 3³ = 27: 40 × 27 = 1,080.
```

# Trap: one length changes
k³ needs every length scaled.

## Put it in the formula

Only one length changes? Skip k³. Put the change into the formula.

```visual
area-volume--trap
```

```example
A cylinder's radius is doubled. Its height stays the same. The new volume is how many times the old one?
1. New V = π(2r)²h = 4 × πr²h :: Swap r for 2r.
2. 4 times :: r is squared, so 2 becomes 4.
```

```more
When every length is multiplied by k (similar solids), volume is × k³. Here only the radius changes. The radius appears squared in πr²h, and the height h appears once. So read the formula: it shows what happens.
```

## Height triples

```quiz
A cylinder's height is tripled. Its radius stays the same. The new volume is how many times the old one?
* 3
- 27 :: Trap: 3³ needs every length tripled. Only h changed.
- 9 :: h is not squared. It appears once in πr²h.
> V = πr²h. Replace h with 3h: πr² × 3h = 3 × πr²h.
```

## Radius doubles

```quiz
A right circular cylinder has a radius of 4 and a height of 6. A second cylinder has the same height, but its radius is doubled. The volume of the first cylinder is 96π. The volume of the second cylinder is kπ. What is the value of k?
answer: 384
- 768 :: You multiplied by 8. Only the radius changed: × 4.
- 192 :: You multiplied by 2. The radius is squared: × 4.
> Doubling r multiplies πr²h by 2² = 4. So 96π × 4 = 384π and k = 384.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Halve the diameter, then base area × height.

```check
m-1651
```

## Your turn: medium

Six equal faces give the edge. Then cube it.

```check
m-1923
```

## Your turn: hard

Area ratio → k → k³. Then add both volumes.

```check
m-13942
```
