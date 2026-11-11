---
title: Area and Volume
skill: area-volume
domain: geometry-trig
section: math
summary: Pick the right formula fast, work forward or backward through it, and know exactly how area and volume change when a shape is scaled.
minutes: 9
---

## What this question looks like

These questions ask you to measure a shape: the area or perimeter of a flat figure, or the volume or surface area of a solid. You'll usually see one of four setups:

- **Plug in:** "A cone has radius 4 and height 9. What is its volume?" Pick the formula and calculate.
- **Work backward:** you're given the area or volume and asked for a missing length, like a radius, height or side.
- **Composite shapes:** a rectangle with a semicircle on one end, a box with a hole drilled through it, a cylinder topped by a half-sphere. You split the shape into simple pieces.
- **Scaling:** "Every edge of the cube is tripled" or "the radius increases by 20%." You're asked how the area or volume changes, often without any actual lengths.

Real-world wording is common: tanks, pools, gardens, boxes, cans. Under the story, it's always one of the four setups above.

## The method

1. **Name the shape and the quantity.** Write it down: "cylinder, volume" or "rectangle + semicircle, perimeter." Many wrong answers come from finding area when the question asked for perimeter.
2. **Write the formula before plugging in.** Open the reference sheet if you need it (the icon is at the top of the screen in both Math modules).
3. **Check radius vs. diameter.** If you're given a diameter, halve it before you touch any formula.
4. **Substitute, then solve.** For backward problems, plug the numbers in first and then isolate the unknown. Keep π as a letter if the answer choices use it, and it will often cancel.
5. **For composite shapes, add the pieces or subtract the cutouts.** Do one piece at a time and write each result down.
6. **For scaling, find the length factor k first.** Then area changes by k² and volume by k³. You don't need the actual dimensions.
7. **Reread the question.** Did it ask for the diameter, the total, the area of only the shaded part? Answer that exact thing.

> **Tip:** The built-in Desmos calculator is great for the arithmetic. Type the whole expression, like `(1/3)π(4)²(9)`, in one go instead of doing it in pieces, so you make fewer slips.

## Rules and formulas you need

The reference sheet gives you the basic formulas, but not all of them. Know which ones are missing so you don't waste time looking.

| Shape | Formula | On the reference sheet? |
|---|---|---|
| Circle | area = πr², circumference = 2πr | Yes |
| Rectangle | area = ℓw | Yes |
| Triangle | area = ½bh (h is perpendicular to b) | Yes |
| Rectangular box | volume = ℓwh | Yes |
| Cylinder | volume = πr²h | Yes |
| Sphere | volume = (4/3)πr³ | Yes |
| Cone | volume = (1/3)πr²h | Yes |
| Rectangular pyramid | volume = (1/3)ℓwh | Yes |
| Any polygon | perimeter = add up all the sides | No |
| Square / cube | area = s², volume = s³ | No |
| Parallelogram | area = bh | No |
| Trapezoid | area = ½(b₁ + b₂)h | No |
| Rhombus or square from diagonals | area = (d₁ × d₂)/2 | No |
| Any prism or cylinder | volume = (area of base) × height | No |
| Box surface area | `2(ℓw + ℓh + wh)` | No |
| Cube surface area | 6s² | No |
| Cylinder surface area | `2πr² + 2πrh` (two circles plus the wrapped side) | No |
| Sphere surface area | 4πr² (usually given in the question when needed) | No |

**Surface area** just means the total area of every outside face. If you forget a formula, list the faces and add their areas. Watch for an "open box" (no lid), which has one fewer face.

**Scaling rules.** If every length of a shape is multiplied by k, the new shape is *similar* to the old one (same shape, different size):

| Quantity | Multiplied by | Example with k = 3 |
|---|---|---|
| Any length (side, radius, perimeter, height) | k | 3 times as long |
| Any area (including surface area) | k² | 9 times as much |
| Volume | k³ | 27 times as much |

Going backward: if the areas are in a ratio of 25 to 1, the lengths are in a ratio of √25 = 5 to 1, so the volumes are in a ratio of 5³ = 125 to 1.

Percent changes work the same way. "Each length increases by 20%" means k = 1.2, so the area is multiplied by 1.2² = 1.44 (44% more) and the volume by 1.2³ = 1.728.

> **Key idea:** If only ONE dimension changes, use only that change. Doubling a cylinder's height doubles its volume. Doubling its radius multiplies the volume by 4, because r is squared in πr²h. Tripling the radius and halving the height gives 9 × ½ = 4.5 times the volume.

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

- **Diameter for radius.** Plugging in the diameter makes an area 4 times too big and a sphere's volume 8 times too big. Halve the diameter first.
- **Answering the radius when they asked for the diameter** (or the reverse). Circle the word the question ends with.
- **Forgetting the 1/3** in cones and pyramids. A cone holds exactly one-third of the cylinder with the same base and height.
- **Using k instead of k² or k³.** Doubling every edge of a cube does not double its volume; it multiplies it by 8.
- **Cubing or squaring the wrong ratio.** If you're given an area ratio, take its square root to get k before you cube.
- **Counting a shared edge in a perimeter.** Sides where two pieces touch are inside the shape, not on its boundary.
- **Mixing units.** Convert before you square or cube. 1 foot = 12 inches, but 1 square foot = 144 square inches and 1 cubic foot = 1,728 cubic inches.
- **Area vs. perimeter, volume vs. surface area.** The choices usually include the "other" quantity, so reread the last line.

## Quick checklist

- Did I name the shape and the exact quantity asked for?
- Am I using the radius, not the diameter?
- Did I include the 1/3 for a cone or pyramid?
- For scaling: did I find the length factor k first, then use k² for area and k³ for volume?
- For a composite shape: did I add the pieces, subtract the cutouts, and skip shared edges?
- Are my units consistent, and does my answer match the form of the choices (with π or as a decimal)?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (skill descriptions and reference sheet)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf)
- [College Board: Geometry and Trigonometry on the SAT](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/geometry-trigonometry)
- [Magoosh: SAT Math Formula Sheet, Provided vs. Memorize](https://magoosh.com/sat/sat-math-formula-sheet/)
- [PrepScholar: The Critical SAT Math Formulas You Must Know](https://blog.prepscholar.com/critical-sat-math-formulas-you-must-know)
- [Test Ninjas: Mastering Area and Volume Problems on the SAT](https://test-ninjas.com/sat-area-and-volume)
- [Just Locked In: Area and Volume, Inverse Calculation](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/area-and-volume/inverse-calculation.html)
- [Just Locked In: Area and Volume, Scaling and Proportionality](https://justlockedin-main.pages.dev/patterns/math/geometry-and-trigonometry/area-and-volume/scaling-proportionality.html)
- [The Test Advantage: SAT Geometry Questions](https://thetestadvantage.com/blog/sat-geometry-questions)
- [UWorld: What Geometry Is on the SAT?](https://collegeprep.uworld.com/blog/what-geometry-do-i-need-to-know-for-the-sat/)
- [PrepMaven: SAT Geometry Guide](https://prepmaven.com/blog/test-prep/sat-geometry/)
- [Target Test Prep: SAT Geometry Topics, Formulas and Study Tips](https://sat.blog.targettestprep.com/sat-geometry/)
