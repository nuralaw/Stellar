---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Turn one trig ratio into a triangle. Use angles in degrees and radians.
---

# SOH-CAH-TOA
Name the sides from your angle, then divide.

## Name the sides

From angle A: **opposite** is across from A. **Adjacent** touches A. The **hypotenuse** faces the right angle.

```visual
right-triangles-trig--ratios
```

```example
In right triangle ABC, angle B is 90°, AB = 4, BC = 3 and AC = 5. Find sin(A), cos(A) and tan(A).
1. sin(A) = 3/5 :: Opposite over hypotenuse.
2. cos(A) = 4/5 :: Adjacent over hypotenuse.
3. tan(A) = 3/4 :: Opposite over adjacent.
```

```more
**SOH-CAH-TOA** helps you remember: **S**in = **O**pposite/**H**ypotenuse, **C**os = **A**djacent/**H**ypotenuse, **T**an = **O**pposite/**A**djacent. *Adjacent* means "next to". The hypotenuse is always the longest side. △ABC means triangle ABC. ∠A means angle A.
```

## Pick the ratio

```quiz
A 10-foot ladder leans on a wall and makes a 35° angle with the ground. Which expression gives the height, in feet, that it reaches on the wall?
* 10 sin(35°)
- 10 cos(35°) :: That is the distance along the ground, the adjacent side.
- 10/sin(35°) :: That is longer than the ladder. Multiply, do not divide.
> The height is opposite 35° and the ladder is the hypotenuse: sin(35°) = height/10.
```

# Build the triangle
One ratio gives two sides. Pythagoras gives the third.

## From one ratio

A ratio is two sides. Write them, find the third side, then read the ratio you need.

```visual
right-triangles-trig--build
```

```example
In right triangle ABC, angle B is 90° and sin(A) = 8/17. What is tan(A)?
1. Opposite = 8, hypotenuse = 17 :: Sine is opposite over hypotenuse.
2. Adjacent = √(17² − 8²) = 15 :: The Pythagorean theorem.
3. tan(A) = 8/15 :: Opposite over adjacent.
```

```more
The **Pythagorean theorem**: a² + b² = c², where c is the hypotenuse. Here 8² + b² = 17², so b² = 289 − 64 = 225 and b = 15. Check your work: the hypotenuse must be the longest side.
```

## Tangent to sine

```quiz
In right triangle ABC, angle C is 90° and tan(A) = 7/24. What is sin(A)?
answer: 7/25
- 7/24 :: That is tan(A) again. Find the hypotenuse first.
- 24/25 :: That is cos(A). Sine uses the opposite side, 7.
> Opposite 7, adjacent 24. Hypotenuse = √(7² + 24²) = 25, so sin(A) = 7/25.
```

# Same angle, same ratio
Same angle, same sin, cos and tan.

## Scale the sides

Similar right triangles have equal angles, so they have equal sin, cos and tan. Only the side lengths change.

```visual
right-triangles-trig--similar
```

```example
Right triangle ABC has sides 3, 4, 5, and A is opposite the 3. A similar triangle has hypotenuse 10. Find sin(A) there.
1. sin(A) = 3/5 in ABC :: Opposite over hypotenuse.
2. The angles are the same :: Similar triangles.
3. sin(A) = 6/10 = 3/5 :: The sides double. The ratio stays.
```

```more
**Similar** triangles have the same shape: equal angles, and every side multiplied by the same number. Here that number is 2. The ratio of two sides stays the same, because both sides are multiplied by 2.
```

## Match the triangles

```quiz
Right triangles ABC and DEF are similar, with right angles at C and F. Angle A corresponds to angle D. In triangle ABC, AB = 10 and BC = 6. In triangle DEF, DE = 25. What is the value of sin(D)?
answer: 3/5
- 6/25 :: You mixed the two triangles. Use one triangle's sides.
- 4/5 :: That is cos(D). Sine uses the side opposite D.
> Similar triangles share ratios. sin(D) = sin(A) = BC/AB = 6/10 = 3/5.
```

# Special triangles
Two side patterns. Each side faces its own angle.

## Two patterns

45-45-90: sides x, x, x√2. 30-60-90: x faces 30°, x√3 faces 60°, 2x faces 90°. The reference sheet shows both.

```visual
right-triangles-trig--special
```

```example
A square has side 5. How long is its diagonal?
1. The diagonal makes two 45-45-90 triangles :: Each has legs 5 and 5.
2. x = 5 :: The legs are the square's sides.
3. Diagonal = x√2 = 5√2 :: The hypotenuse is x√2.
```

```more
The shortest side of a 30-60-90 triangle is x, and it faces the smallest angle, 30°. The hypotenuse is twice as long: 2x. The remaining side, x√3, faces 60°. Always match each side with the angle across from it.
```

## Use 30-60-90

```quiz
The hypotenuse of a 30-60-90 triangle is 12. How long is the side opposite the 60° angle?
- 6 :: That is the side opposite 30°. The 60° side is x√3.
- 12√3 :: Halve the hypotenuse first: 2x = 12, so x = 6.
* 6√3
> 2x = 12, so x = 6. The side opposite 60° is x√3 = 6√3.
```

# Radians and the unit circle
π radians = 180°. Cos is across, sin is up.

## Radians

**Radians** are another unit for angles: π radians = 180°. The **unit circle** has radius 1. Its point at angle θ is (cos θ, sin θ).

```visual
right-triangles-trig--unit-circle
```

```example
On the unit circle, the angle π/6 meets the circle at point P. Find the coordinates of P.
1. π/6 = 180°/6 = 30° :: Change radians to degrees.
2. cos 30° = √3/2, sin 30° = 1/2 :: A 30-60-90 triangle, hypotenuse 1.
3. P = (√3/2, 1/2) :: The point is (cos, sin).
```

```more
The angle θ starts at the positive x-axis and turns counterclockwise (standard position). Degrees to radians: multiply by π/180. Radians to degrees: multiply by 180/π. Tangent repeats every π radians, so tan(π/6) = tan(7π/6).
```

## Degrees to radians

```quiz
An angle measures 150°. What is its measure in radians?
* 5π/6
- 3π/4 :: That is 135°. Multiply 150 by π/180.
- 6π/5 :: You flipped the fraction. Multiply by π/180.
> 150° × π/180 = 150π/180 = 5π/6.
```

# Sine equals cosine
Angles that add to 90° swap sine and cosine.

## Complementary angles

The two acute angles of a right triangle add to 90°, so **sin(x°) = cos(90° − x°)**. In radians, 90° is π/2.

```visual
right-triangles-trig--complement
```

```example
Right triangle ABC has a right angle at C and sin(A) = 0.6. What is cos(B)?
1. A + B = 90° :: The right angle takes the other 90°.
2. Opposite A = adjacent to B :: One side, two names.
3. cos(B) = 0.6 :: Same side, same hypotenuse.
```

```more
Two angles that add to 90° are **complementary**. Because the side opposite A touches B, the same fraction is sin(A) and cos(B). In radians the rule is sin(θ) = cos(π/2 − θ). A *radian* is another unit for angles: π radians = 180°.
```

## Find the angle

```quiz
sin(41°) = cos(k°), where 0 < k < 90. What is the value of k?
answer: 49
- 41 :: That is the same angle. Subtract it from 90.
- 139 :: That is 180 − 41. Use 90 for sine and cosine.
> The angles must add to 90°, so k = 90 − 41 = 49.
```

## Radians version

```quiz
sin(π/3) = cos(k), where k is an angle between 0 and π/2 radians. What is k?
* π/6
- π/3 :: That is the same angle. Subtract it from π/2.
- 2π/3 :: That is π − π/3. Use π/2 for sine and cosine.
> k = π/2 − π/3 = 3π/6 − 2π/6 = π/6.
```

# Trap: the other angle
Change the angle and opposite and adjacent swap.

## Label from the angle

Opposite and adjacent depend on the angle you want. Label the sides again for each angle.

```visual
right-triangles-trig--ratios
```

```example
In triangle ABC, angle B is 90°, AB = 4 and BC = 3. Find tan(A) and tan(C).
1. From A: opposite BC = 3, adjacent AB = 4 :: BC does not touch A.
2. From C: opposite AB = 4, adjacent BC = 3 :: The names swap.
3. tan(A) = 3/4, tan(C) = 4/3 :: The fractions flip.
```

```more
The sides do not change. Only the angle you stand at changes. Stand at A: BC is across from you (opposite). Stand at C: AB is across from you. In each case, adjacent is the leg that touches your angle.
```

## Which tangent?

```quiz
In triangle ABC, angle B is 90°, AB = 8, BC = 15 and AC = 17. What is tan(C)?
* 8/15
- 15/8 :: That is tan(A). From C, the opposite side is AB.
- 8/17 :: That is sin(C). Tangent is opposite over adjacent.
> From C: opposite AB = 8, adjacent BC = 15. tan(C) = 8/15.
```

## Sine of the other angle

```quiz
In triangle XYZ, the measure of angle Y is 90°. The hypotenuse has length 37 and sin(Z) = 12/37. What is the value of sin(X)?
answer: 35/37
- 12/37 :: That is sin(Z). Find sin(X): the side across from X.
- 35/12 :: That is a tangent. Sine is opposite over hypotenuse.
> XY = 12 is opposite Z. YZ = √(37² − 12²) = 35 is opposite X, so sin(X) = 35/37.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

△ABC means triangle ABC. ∠A means angle A.

```check
m-17140
```

## Your turn: medium

Complementary angles add to 90°. Respectively means in that order.

```check
m-1610
```

## Your turn: hard

Find the third side. Then label the sides from angle L.

```check
m-1890
```
