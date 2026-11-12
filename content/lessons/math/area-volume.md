---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Pick the right formula, work backward from an area or volume to a length, and scale shapes with k, k² and k³.
---

## Name the shape and the quantity

These questions measure a shape, often a real object like a tank or a can. Most fit one of four setups:

- **Plug in:** lengths given, find the area or volume.
- **Work backward:** area or volume given, find a length.
- **Shaded or combined shapes:** add pieces or subtract a cutout.
- **Scaling:** every length is multiplied by the same number.

Before any math, name the shape and the exact quantity: **area** (flat space inside), **perimeter** (distance around), **volume** (space inside a solid) or **surface area** (total area of its outside).

```quiz
A company wants to know how much cardboard it takes to make one closed box. Which quantity does it need?
- The volume of the box :: Volume is how much the box holds, not how much material wraps it.
* The surface area of the box :: Right. The cardboard covers every outside face, so you add the areas of all six faces.
- The perimeter of the box's bottom :: Perimeter is a length around one flat face, not the material for the whole box.
> Material that covers or wraps an object is surface area. What fits inside is volume.
```

## Open the reference sheet

The **Reference** button at the top of the screen opens these formulas any time:

| Shape | Formula |
|---|---|
| Rectangle, triangle | A = ℓw, A = ½bh |
| Circle | A = πr², circumference 2πr |
| Box, cylinder | V = ℓwh, V = πr²h |
| Sphere | V = (4/3)πr³ |
| Cone, pyramid | V = (1/3)πr²h, V = (1/3)ℓwh |

Not on it: perimeter, squares and cubes (s², s³), surface area, and **volume = base area × height** for any prism. A cone or pyramid holds **one third** of the cylinder or box with the same base and height.

```quiz
A cone and a cylinder have the same radius and the same height. The cylinder holds 600 cubic centimeters of water. How much does the cone hold?
- 600 cm³ :: Same base and height doesn't mean same volume. The cone's formula has an extra 1/3.
- 300 cm³ :: A cone isn't half a cylinder. Compare the sheet formulas: the cone has 1/3 in front.
* 200 cm³ :: Right. (1/3)πr²h is one third of πr²h, so the cone holds 600 ÷ 3.
- 1,800 cm³ :: You multiplied by 3. The cone fits inside the cylinder, so it must hold less.
> Cylinder: πr²h. Cone: (1/3)πr²h. With the same r and h, the cone is exactly one third: 600 ÷ 3 = 200.
```

## Radius, not diameter

Write the formula with letters first, then substitute. Most mistakes happen in that substitution:

- **Diameter given?** Halve it. Every circle formula uses the radius r.
- **Height** is the straight-up height, at a right angle to the base, not a slanted edge.
- **Keep π** as a letter when the choices have it. A typed answer can't contain π: if the area is kπ and they ask for k, enter only k.

```quiz
A circular rug has a diameter of 12 feet. What is its area, in square feet?
- 144π :: You used the diameter as the radius. Halve 12 first.
* 36π :: Right. r = 12 ÷ 2 = 6, so the area is π(6)² = 36π.
- 12π :: That's the circumference (2πr), the distance around the rug, not the space it covers.
- 6π :: You forgot to square the radius. πr² means π × 6 × 6.
> Halve the diameter: r = 6. Then A = πr² = π × 36 = 36π square feet.
```

## Work backward to a length

When the area or volume is given and a length is missing:

1. Write the formula and plug in everything you know.
2. Divide until the unknown, like r³, stands alone. π usually cancels.
3. Undo the power: square root for r² or s², **cube root** for r³ or s³. In Desmos, `cbrt(64)` gives 4.
4. Reread the last line: radius or diameter? Edge or face?

```quiz
A ball shaped like a sphere has a volume of 288π cubic inches. What is the diameter of the ball, in inches?
- 6 :: That's the radius. The question asks for the diameter, which is twice as long.
* 12 :: Right. r³ = 216, so r = 6, and the diameter is 2 × 6 = 12.
- 72 :: You divided 216 by 3. A cube is undone by a cube root: 6 × 6 × 6 = 216.
- 216 :: That's r³. Take the cube root to get r.
> Sheet formula: (4/3)πr³ = 288π.
> Divide both sides by π, then multiply by 3/4: r³ = 216.
> Cube root: r = 6, because 6 × 6 × 6 = 216. The question wants the diameter: 2 × 6 = 12.
```

## Surface area: add the faces

Surface area isn't on the reference sheet, and you don't need a formula. Unfold the solid in your head and add the area of every outside face.

| Solid | Faces |
|---|---|
| Box | 3 pairs of rectangles |
| Cube | 6 equal squares: 6s² |
| Cylinder | 2 circles + side: 2πr² + 2πrh |

A cylinder's side unrolls into a rectangle, 2πr long and h tall. An **open** box or can has no top, so leave that face out.

```quiz
A closed box is 2 inches by 3 inches by 4 inches. What is its surface area, in square inches?
- 24 :: That's the volume, 2 × 3 × 4. Surface area adds the areas of the faces.
- 26 :: You counted 3 faces. A box has 6: top and bottom, front and back, left and right.
* 52 :: Right. The faces are 6, 8 and 12, each twice: 2(6 + 8 + 12) = 52.
> The three different faces are 2 × 3 = 6, 2 × 4 = 8 and 3 × 4 = 12. Each appears twice, so the total is 2(6 + 8 + 12) = 52 square inches.
```

## Shaded regions: whole minus part

For a shape with a piece cut out, find the **whole** area, then subtract the **cutout**. For a shape built from pieces, add the pieces.

Perimeter is different: it counts only the outside edge. A line where two pieces meet is inside the shape, so it doesn't count.

```quiz
A circular pond has a radius of 3 meters. A path 2 meters wide runs all the way around it. What is the area of the path, in square meters?
- 4π :: You squared the width, 5 − 3 = 2. Square each radius first, then subtract: 25π − 9π.
- 25π :: That's the pond and the path together. Subtract the pond, 9π.
- 40π :: The path adds 2 to the radius, not 4. The outer radius is 3 + 2 = 5.
* 16π :: Right. Outer circle π(5)² = 25π, minus the pond π(3)² = 9π.
> The path's outer edge is a circle with radius 3 + 2 = 5. Path = big circle − pond = 25π − 9π = 16π square meters.
```

## Scaling: k, k², k³

If **every** length of a shape is multiplied by the same number k, the new shape is **similar**: same shape, new size.

| Measure | Multiplied by |
|---|---|
| Length, perimeter, radius | k |
| Area, surface area | k² |
| Volume | k³ |

Given an area or volume ratio, **find k first**. An area ratio of 25 means k = √25 = 5. A volume ratio of 8 means k = ∛8 = 2. A 20% increase means k = 1.2.

```quiz
Two cylinders are similar. The larger one has 9 times the surface area of the smaller one. The smaller one has a volume of 40 cubic centimeters. What is the volume of the larger one, in cubic centimeters?
- 120 :: You multiplied by k = 3. Volume grows by k³, not k.
- 360 :: You multiplied by the area ratio, 9. Volume doesn't grow like area.
* 1,080 :: Right. k² = 9, so k = 3, and volume grows by 3³ = 27.
- 29,160 :: You cubed 9, but 9 is the area ratio, not k. Take √9 = 3 first.
> Surface area is an area, so k² = 9 and k = 3.
> Volume grows by k³ = 3 × 3 × 3 = 27, so the larger cylinder holds 40 × 27 = 1,080 cubic centimeters.
```

## The trap: one length changes

k² and k³ only work when **every** length is multiplied by k. If just one length changes, put that change into the formula and see what factor comes out.

Example: triple only a box's height. ℓw(3h) = 3ℓwh, so the volume triples, not 27 times.

```quiz
The radius of a cylinder is doubled, and its height stays the same. The new volume is how many times the old volume?
- 2 :: The radius is squared in πr²h, so doubling it multiplies the volume by 2².
* 4 :: Right. π(2r)²h = 4πr²h.
- 8 :: That's k³, which needs every length doubled. The height didn't change, so only r² grows.
> Put the change into the formula: π(2r)²h = π × 4r² × h = 4πr²h. Only the radius changed, and it's squared, so the volume is 2² = 4 times as large.
```

## Your turn: easy

Find the radius first, then use the cylinder formula.

```check
m-1651
```

## Your turn: medium

A cube has six equal square faces. Work back to the edge length first.

```check
m-1923
```

## Your turn: hard

Similar solids: turn the surface-area ratio into k before you touch the volumes.

```check
m-13942
```

## Recap

- Name the shape and the exact quantity: area, perimeter, volume or surface area.
- Write the formula with letters, then substitute. Radius, not diameter; cones and pyramids get 1/3.
- Working backward: plug in, divide, then take a square root or cube root.
- Surface area: add the faces. Shaded region: whole minus cutout.
- Every length × k: areas × k², volumes × k³. Only one length changed? Put it into the formula.
- Reread the last line: radius or diameter, one face or all of them.
