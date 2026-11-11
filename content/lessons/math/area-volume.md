---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Pick the right area or volume formula, solve it forward or backward, and know how area and volume change when a shape is scaled.
minutes: 10
---

> **Key idea:** Name the shape, write its formula, then plug in. When every length is multiplied by k, area is multiplied by k² and volume by k³.

## What this question looks like

These questions ask you to measure a shape: the area or perimeter of a flat figure, or the volume or surface area of a solid. Most come in one of four setups:

- **Plug in:** "A cone has radius 4 and height 9. What is its volume?" Pick the formula and calculate.
- **Work backward:** you're given the area or volume and asked for a missing length, like a radius, height or side.
- **Composite shapes:** a rectangle with a semicircle on one end, a box with a hole drilled through it, a cylinder topped by a half-sphere.
- **Scaling:** "Every edge of the cube is tripled" or "the radius increases by 20%." You find how the area or volume changes, often with no actual lengths.

Real-world stories about tanks, pools, gardens, boxes and cans are common. Under the story, it's always one of these four setups.

## The method

1. **Name the shape and the quantity.** Write it down: "cylinder, volume" or "rectangle + semicircle, perimeter."
2. **Write the formula before plugging in.** Open the reference sheet if you need it (the formula icon at the top of the screen in both Math modules).
3. **Use the radius.** If you're given a diameter, halve it before it goes into any formula.
4. **Substitute, then solve.** For backward problems, plug in first, then isolate the unknown. Keep π as a letter if the choices use it, since it often cancels.
5. **Composite shape?** Add the pieces or subtract the cutouts, one piece at a time. Write each result down.
6. **Scaling?** Find the length factor k first. Area changes by k² and volume by k³, so you don't need the actual dimensions.
7. **Reread the last line.** Diameter or radius? The total, or only the shaded part? Answer that exact thing.

> **Tip:** Let the built-in Desmos calculator do the arithmetic. Type the whole expression at once, like `(1/3)π(4)^2(9)`, instead of in pieces, so you make fewer slips.

## Rules and formulas you need

The reference sheet gives the basic formulas, but not all of them. Know which ones are missing so you don't waste time looking.

### Formulas

| Shape | Formula | On reference sheet? |
|---|---|---|
| Circle | area πr², circumference 2πr | Yes |
| Rectangle | area ℓw | Yes |
| Triangle | area ½bh | Yes |
| Rectangular box | volume ℓwh | Yes |
| Cylinder | volume πr²h | Yes |
| Sphere | volume (4/3)πr³ | Yes |
| Cone | volume (1/3)πr²h | Yes |
| Rectangular pyramid | volume (1/3)ℓwh | Yes |
| Any polygon | perimeter = sum of sides | No |
| Square / cube | area s², volume s³ | No |
| Parallelogram | area bh | No |
| Trapezoid | area ½(b₁ + b₂)h | No |
| Rhombus or square | area (d₁ × d₂)/2 | No |
| Any prism or cylinder | volume = base area × h | No |
| Box surface area | `2(ℓw + ℓh + wh)` | No |
| Cube surface area | 6s² | No |
| Cylinder surface area | `2πr² + 2πrh` | No |
| Sphere surface area | 4πr² | No |

A few notes on the table:

- In a triangle or parallelogram, the height h is measured perpendicular to the base b.
- In the rhombus formula, d₁ and d₂ are the two diagonals.
- A cylinder's surface is two circles (2πr²) plus the side, which unrolls into a rectangle (2πrh).
- The sphere's surface area formula is usually given in the question when you need it.

**Surface area** is the total area of every outside face. If you forget a formula, list the faces and add their areas. An "open box" (no lid) has one fewer face.

### Scaling

If every length of a shape is multiplied by k, the new shape is **similar** to the old one: same shape, different size.

| Quantity | Multiplied by | When k = 3 |
|---|---|---|
| Length (side, radius, perimeter) | k | 3 times |
| Area (including surface area) | k² | 9 times |
| Volume | k³ | 27 times |

- **Going backward:** areas in a ratio of 25 to 1 mean lengths in a ratio of √25 = 5 to 1, so volumes are in a ratio of 5³ = 125 to 1.
- **Percent changes:** "each length increases by 20%" means k = 1.2. Area is multiplied by 1.2² = 1.44 (44% more) and volume by 1.2³ = 1.728.

> **Remember:** If only one dimension changes, apply only that change. Doubling a cylinder's height doubles its volume, but doubling its radius multiplies the volume by 4, because r is squared in πr²h. Tripling the radius and halving the height gives 9 × ½ = 4.5 times the volume.

## Worked examples

### Example 1: Working backward from a volume

A cylindrical water tank has a volume of 360π cubic feet and a height of 10 feet. What is the diameter of the tank, in feet?

- (A) 3
- (B) 6
- (C) 12
- (D) 36

**Solution**

Shape: cylinder. Given: volume. Asked: diameter. Write the formula and plug in: `πr²(10) = 360π`. Divide both sides by 10π: r² = 36, so r = 6. The question asks for the diameter, so double it: 2 × 6 = 12.

(B) is the radius, the classic "stopped one step early" trap. (A) halves the radius instead of doubling it. (D) is r², which means forgetting the square root.

**Answer:** (C)

### Example 2: Similar solids

Two rectangular boxes are similar. The surface area of the larger box is 4 times the surface area of the smaller box. The smaller box has a volume of 30 cubic centimeters. What is the volume of the larger box, in cubic centimeters?

- (A) 120
- (B) 240
- (C) 480
- (D) 1,920

**Solution**

Surface area is an area, so it scales by k². That means k² = 4, so the length factor is k = 2. Volume scales by k³ = 2³ = 8. The larger box has a volume of 30 × 8 = 240.

(A) multiplies by the area factor 4, as if volume scaled like area. (C) multiplies by 4² = 16, which squares the area ratio. (D) multiplies by 4³ = 64, which cubes the area ratio instead of the length ratio. Always get back to k (the length factor) first.

**Answer:** (B)

### Example 3: Perimeter of a composite shape

A garden is made of a rectangle that is 12 meters long and 8 meters wide, with a semicircle attached to one of its 8-meter sides. The diameter of the semicircle is that entire 8-meter side. What is the perimeter of the garden, in meters?

- (A) 32 + 4π
- (B) 40 + 4π
- (C) 32 + 8π
- (D) 96 + 8π

**Solution**

Picture walking around the outside edge. You walk two long sides (12 + 12), the one short side with no semicircle (8), and the curved edge of the semicircle. The 8-meter side where the semicircle attaches is inside the garden, so it doesn't count.

The semicircle has diameter 8, so radius 4. A full circle would have circumference 2π(4) = 8π, and half of that is 4π. Perimeter = 12 + 12 + 8 + 4π = 32 + 4π.

(B) counts the hidden 8-meter side too. (C) uses the full circle's circumference. (D) is the garden's *area*: 12 × 8 = 96 plus half of π(4)² = 8π.

**Answer:** (A)

### Example 4: Equal volumes (student-produced response)

A solid metal sphere with a radius of 3 centimeters is melted down, and all of the metal is recast into a solid cone. The cone's base has a radius of 3 centimeters. What is the height of the cone, in centimeters?

**Solution**

Melting and recasting doesn't change the amount of metal, so the two volumes are equal.

Sphere: `(4/3)π(3)³ = (4/3)π(27) = 36π`.

Cone: `(1/3)π(3)²h = (1/3)π(9)h = 3πh`.

Set them equal: 3πh = 36π. Divide by 3π: h = 12.

Check: a cone 12 cm tall with radius 3 has volume (1/3)π(9)(12) = 36π. It matches.

**Answer:** 12

## Traps to avoid

- **Diameter for radius.** Plugging in the diameter makes a circle's area 4 times too big and a sphere's volume 8 times too big.
- **Giving the radius when they asked for the diameter** (or the reverse). Circle the word the question ends with.
- **Forgetting the 1/3** in cones and pyramids. A cone holds exactly one-third of a cylinder with the same base and height.
- **Using k instead of k² or k³.** Doubling every edge of a cube multiplies its volume by 8, not 2.
- **Cubing or squaring the wrong ratio.** Given an area ratio, take its square root to get k before you cube.
- **Counting a shared edge in a perimeter.** Where two pieces touch, the edge is inside the shape, not on its boundary.
- **Mixing units.** Convert before you square or cube: 1 foot = 12 inches, but 1 square foot = 144 square inches and 1 cubic foot = 1,728 cubic inches.
- **Area vs. perimeter, volume vs. surface area.** The choices usually include the "other" quantity, so reread the last line.

## Quick checklist

- Did I name the shape and the exact quantity asked for?
- Am I using the radius, not the diameter?
- Did I include the 1/3 for a cone or pyramid?
- Scaling: did I find k first, then use k² for area and k³ for volume?
- Composite shape: did I add the pieces, subtract the cutouts, and skip shared edges?
- Are my units consistent, and does my answer match the form of the choices (with π or as a decimal)?
