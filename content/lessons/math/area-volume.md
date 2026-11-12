---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Find volumes and surface areas, work backward, and scale with k² and k³.
---

# Volume formulas
Base area × height. Cones take a third.

## Volume = base × height

**Volume = base area × height.** Circle formulas use the radius, so halve a diameter first.

```example
A cylinder has a diameter of 6 and a height of 5. What is its volume?
1. r = 6 ÷ 2 = 3 :: Halve the diameter.
2. Base area = π × 3² = 9π :: The base is a circle: πr².
3. V = 9π × 5 = 45π :: Base area × height.
```

## Cones hold one third

A cone or pyramid holds **1/3** of base area × height.

```quiz
A cone has a diameter of 6 and a height of 4. What is its volume?
- 36π :: That's the cylinder. A cone holds 1/3 of it.
- 48π :: You used 6 as the radius. Halve it.
* 12π
> r = 3. V = 1/3 × π × 3² × 4 = 12π.
```

# Work backward
Volume given: plug in, divide, take the root.

## Solve for the missing length

Put the known numbers into the formula. Solve for the one left.

```example
A cone has a volume of 48π and a radius of 4. What is its height?
1. 1/3 × π × 4² × h = 48π :: Fill in the formula.
2. 16h = 144 :: Drop π. Multiply by 3.
3. h = 9 :: Divide by 16.
```

## Find the radius

```quiz
A cylinder has a volume of 80π and a height of 5. What is its radius?
* 4
- 16 :: That's r². Take the square root.
- 8 :: That's the diameter. The radius is half.
> πr² × 5 = 80π, so r² = 16 and r = 4.
~ type y=5x^{2} :: π cancels: 5r² = 80. Type each side, x for r.
~ type y=80
~ zoom -2 8 -20 120
~ point (4, 80) :: Click the crossing: r = 4.
```

## Cone radius

```quiz
A cone has a volume of 96π and a height of 8. What is its radius?
* 6
- 36 :: That's r². Take the square root.
- √12 :: You dropped the 1/3.
> 1/3 × πr² × 8 = 96π, so r² = 36 and r = 6.
~ type y=\frac{8}{3}x^{2} :: π cancels: 8/3 × r² = 96. x stands for r.
~ type y=96
~ zoom -2 10 -20 140
~ point (6, 96) :: Click the crossing: r = 6.
```

# Surface area
Add the area of every outside face.

## Add the faces

Surface area is the total area of all outside faces.

```example
A cube has edges of 5. What is its surface area?
1. One face = 5² = 25 :: Each face is a square.
2. 6 × 25 = 150 :: A cube has 6 equal faces.
```

## Box faces

```quiz
A closed box is 2 by 3 by 4. What is its surface area?
- 24 :: That's the volume, 2 × 3 × 4.
* 52
- 26 :: You counted 3 faces. A box has 6.
> Faces: 6, 8 and 12, each twice. 2 × (6 + 8 + 12) = 52.
```

## Back to the edge

```quiz
A cube has a surface area of 96. How long is one edge?
* 4
- 16 :: That's one face's area. Take the square root.
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

Similar solids: every length is multiplied by the same k.

```example
Two cones are similar. Each length of the larger is 2 times the smaller's. The smaller has surface area 10 and volume 6. Find the larger's.
1. k = 2 :: The length factor.
2. Area: 10 × 2² = 40 :: Areas grow by k².
3. Volume: 6 × 2³ = 48 :: Volumes grow by k³.
```

## From area to volume

```quiz
Two cylinders are similar. The larger has 9 times the surface area of the smaller. The smaller has a volume of 40. What is the volume of the larger?
- 120 :: You multiplied by k = 3. Volume uses k³.
- 360 :: 9 is k², the area factor. Volume uses k³.
* 1,080
> k² = 9, so k = 3. Volume grows by 3³ = 27: 40 × 27 = 1,080.
```

# Trap: one length changes
k³ needs every length scaled.

## Put it in the formula

Only one length changes? Skip k³. Put the change into the formula.

```example
A cylinder's height is tripled. Its radius stays the same. The new volume is how many times the old one?
1. New V = πr² × 3h = 3 × πr²h :: Swap h for 3h.
2. 3 times :: h is not squared or cubed.
```

## Radius doubles

```quiz
A cylinder's radius is doubled. Its height stays the same. The new volume is how many times the old one?
* 4
- 8 :: Trap: 2³ needs the height doubled too.
- 2 :: The radius is squared: 2² = 4.
> π(2r)²h = 4πr²h. Only r changed, and r is squared.
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
