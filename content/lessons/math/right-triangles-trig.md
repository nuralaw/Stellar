---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Find any side or ratio in a right triangle with triples, SOH-CAH-TOA, special triangles and the sine–cosine swap.
---

## Spot the right triangle

These questions show or describe a triangle with a 90° angle. Often it hides: a rectangle's diagonal, a ladder against a wall. Sketch it and mark the right angle.

The Pythagorean theorem, a² + b² = c², is on the reference sheet. **c is the hypotenuse**, the side across from the right angle and always the longest.

Before doing arithmetic, look for a **triple** (or a multiple of one): 3-4-5, 5-12-13, 8-15-17, 7-24-25.

```quiz
A 26-foot ladder leans against a wall. Its foot is on level ground, 10 feet from the wall. How high up the wall does the ladder reach?
* 24 feet
- 16 feet :: You subtracted the lengths, 26 − 10. Subtract the squares instead.
- √776 feet :: You added 26² and 10². The ladder is the hypotenuse c, so subtract: 26² − 10².
- 576 feet :: That's the height squared. Take the square root.
> The wall and the ground make the right angle, so the ladder is the hypotenuse: 26² − 10² = 676 − 100 = 576, and √576 = 24.
> Faster: 10 and 26 are 2 × 5 and 2 × 13. That's the 5-12-13 triple doubled, so the height is 2 × 12 = 24.
```

## Name the sides from your angle

Trig ratios start from one of the two **acute** angles (the ones smaller than 90°). The two sides that form the right angle are the **legs**. Stand at your angle and name the sides:

- **Hypotenuse:** across from the right angle.
- **Opposite:** the leg across from your angle.
- **Adjacent:** the leg that touches your angle.

When the question moves to the other acute angle, opposite and adjacent **trade places**. Relabel every time.

```quiz
In right triangle ABC, angle C is the right angle. Which side is adjacent to angle B?
- AC :: AC doesn't touch angle B. It's across from B, so it's the opposite side.
* BC
- AB :: AB is across from the right angle, so it's the hypotenuse.
> Angle B touches two sides, AB and BC. AB is the hypotenuse, so the adjacent leg is BC.
```

## SOH-CAH-TOA

These three ratios are **not** on the reference sheet. Learn them as SOH-CAH-TOA:

| Ratio | Equals |
|---|---|
| sin (SOH) | opposite / hypotenuse |
| cos (CAH) | adjacent / hypotenuse |
| tan (TOA) | opposite / adjacent |

For an acute angle, sine and cosine are always less than 1, because the hypotenuse is the longest side. A sine or cosine above 1 means you divided by a leg instead of the hypotenuse.

```quiz
In right triangle PQR, angle Q is the right angle. PQ = 8, QR = 15 and PR = 17. What is sin P?
* 15/17
- 8/17 :: That's cos P. PQ touches angle P, so it's the adjacent side, not the opposite.
- 15/8 :: That's tan P. Sine divides by the hypotenuse, not by a leg.
- 17/15 :: Upside down. A sine is never above 1, so the hypotenuse goes on the bottom.
> Stand at P. The side across from it is QR = 15, and the hypotenuse is PR = 17. So sin P = 15/17.
```

## One ratio? Build the triangle

A ratio depends only on the angle, not on the size of the triangle. So when you're given one ratio, **make up a triangle that fits it**. For cos A = 3/5, use adjacent side 3 and hypotenuse 5. Find the third side (4), then read any ratio you need.

> **Key idea:** Similar triangles have the same angles, so they have the same ratios. A scale factor or a side of the bigger triangle is often extra information.

```quiz
Right triangle ABC has its right angle at C, and tan A = 8/15. Triangle DEF is similar to triangle ABC, with D, E and F matching A, B and C. Each side of DEF is 4 times as long. What is sin D?
* 8/17
- 8/15 :: That's tan A, the ratio you were given. Sine needs the hypotenuse.
- 15/17 :: That's cos A: 15 is the leg touching A. Sine uses the opposite leg.
- 32/17 :: You scaled only the top by 4. Scaling both sides gives 32/68 = 8/17: size never changes a ratio.
> Build triangle ABC: the leg across from A is 8 and the leg touching A is 15.
> The hypotenuse is √(64 + 225) = √289 = 17, the 8-15-17 triple.
> D matches A, so sin D = sin A = opposite/hypotenuse = 8/17. The size of DEF changes nothing.
```

## Two acute angles add to 90°

In right triangle ABC with the right angle at C, angles A and B add to 90°. The leg across from A is the leg touching B, so:

- sin A = cos B, and cos A = sin B.
- In general, sin x° = cos(90 − x)°.
- tan A and tan B are reciprocals, like 3/4 and 4/3.

This swap is **not** on the reference sheet.

> **Trap:** If both angles are acute, sin a° = cos b° means **a + b = 90**. Don't set the angles equal.

```quiz
Both angles are acute, and sin(3k + 12)° = cos(2k − 2)°. What is the value of k?
* 16
- −14 :: You set the angles equal. A sine equals a cosine when the angles add to 90°.
- 18 :: You dropped the +12 and −2. Add the whole angles: 5k + 10 = 90.
- 34 :: You used 180. Sine and cosine swap for angles that add to 90°.
> Add the angles and set the sum to 90: (3k + 12) + (2k − 2) = 90.
> So 5k + 10 = 90, 5k = 80 and k = 16.
> Check: 3(16) + 12 = 60° and 2(16) − 2 = 30°. They add to 90°, and sin 60° = cos 30°.
```

## Special right triangles

Both are on the reference sheet. The skill is knowing **which side sits across from which angle**.

| Triangle | Sides | Hides in |
|---|---|---|
| 45°-45°-90° | s, s, s√2 | half a square |
| 30°-60°-90° | x, x√3, 2x | half an equilateral triangle |

In the 30°-60°-90° triangle, the shortest side x is across from 30°, x√3 is across from 60°, and the hypotenuse is 2x (no √3). These give exact values such as sin 30° = 1/2 and cos 30° = √3/2.

```quiz
In a 30°-60°-90° triangle, the side across from the 60° angle is 9. How long is the hypotenuse?
* 6√3
- 3√3 :: That's x, the shortest side. The hypotenuse is 2x.
- 18 :: You treated 9 as the shortest side. The side across from 60° is x√3.
- 9√2 :: That's the 45°-45°-90° rule. Here the hypotenuse is 2x.
> The side across from 60° is x√3, so x√3 = 9 and x = 9/√3 = 3√3.
> The hypotenuse is 2x = 6√3, about 10.4. It's longer than 9, as it must be.
```

## Degrees and radians

Radians are another unit for angles. The reference sheet says a circle has 360°, or 2π radians, so **180° = π**.

- Degrees to radians: multiply by π/180. So 60° = π/3.
- Radians to degrees: multiply by 180/π.

> **Remember:** Before any trig in Desmos, check the angle mode. Open the wrench (graph settings) and pick Degrees. Test it with `sin(30)`: degree mode shows 0.5, radian mode shows about −0.988.

```quiz
What is 150° in radians?
* 5π/6
- 5π/12 :: You used 360° = π. A full circle is 2π, so 180° = π.
- 6π/5 :: Upside down: that's 180/150. Multiply 150 by π/180.
> 150 × π/180 = 150π/180. Divide the top and bottom by 30 to get 5π/6.
```

## The trap: the wrong angle

Many questions name both acute angles, or give facts about one and ask about the other. Every ratio of the wrong angle is waiting among the choices, so label from the angle in the last line.

```quiz
In right triangle ABC, angle C is the right angle. AC = 20, BC = 21 and AB = 29. What is cos B?
* 21/29
- 20/29 :: That's cos A, the trap. You labeled from A. From B, the leg touching it is BC = 21.
- 20/21 :: That's tan B. Cosine divides by the hypotenuse.
- 21/20 :: That's tan A: two legs, and from the wrong angle.
> Stand at B. It touches AB, the hypotenuse, and BC, so BC is adjacent. cos B = BC/AB = 21/29.
> It equals sin A, as the 90° swap says.
```

## Your turn: easy

Build a triangle from the ratio you're given, then use TOA.

```check
m-17140
```

## Your turn: medium

A cosine equals a sine. What must the two angles add up to?

```check
m-1610
```

## Your turn: hard

Build the triangle from the ratio, then relabel from the angle the question asks about.

```check
m-1890
```

## Recap

- Sketch the triangle and mark the right angle. The hypotenuse is across from it.
- Label opposite and adjacent from the angle the question names, and relabel when it switches.
- Missing side: look for a triple, then use a² + b² = c².
- One ratio given: build a triangle with those sides. Size never changes a ratio.
- Acute angles with sin a° = cos b°: a + b = 90, not a = b.
- 30°-60°-90°: x across from 30°, x√3 across from 60°, 2x across from 90°.
