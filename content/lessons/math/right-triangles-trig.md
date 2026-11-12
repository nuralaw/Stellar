---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Turn one trig ratio into a triangle and read any side or ratio.
---

# SOH-CAH-TOA
Name the sides from your angle, then divide.

## Three ratios

From your angle: **sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent**. The hypotenuse faces the right angle.

```example
A right triangle has legs 7 and 24 and hypotenuse 25. Angle A is opposite the 7. Find sin(A), cos(A) and tan(A).
1. sin(A) = 7/25 :: Opposite over hypotenuse.
2. cos(A) = 24/25 :: Adjacent over hypotenuse.
3. tan(A) = 7/24 :: Opposite over adjacent.
```

## Pick the ratio

```quiz
A 10-foot ladder leans on a wall and makes a 35° angle with the ground. Which expression gives the height, in feet, it reaches on the wall?
* 10 sin(35°)
- 10 cos(35°) :: That's the distance along the ground, the adjacent side.
- 10/sin(35°) :: That's longer than the ladder. Multiply, don't divide.
> The height is opposite 35°, the ladder is the hypotenuse: sin(35°) = height/10.
```

# Build the triangle
One ratio gives two sides. Pythagoras finds the third.

## From one ratio

Write the ratio as two sides. Find the third. Read the ratio you need.

```example
In right triangle ABC, angle C is 90° and sin(A) = 3/5. What is tan(A)?
1. Opposite = 3, hypotenuse = 5 :: Read sin as opposite/hypotenuse.
2. Adjacent = √(5² − 3²) = 4 :: The Pythagorean theorem.
3. tan(A) = 3/4 :: Opposite over adjacent.
```

## Cosine to sine

```quiz
In right triangle PQR, angle R is 90° and cos(P) = 8/17. What is sin(P)?
* 15/17
- 8/15 :: That's adjacent/opposite. Sine is opposite/hypotenuse.
- 8/17 :: That's cos(P) again. Find the opposite side.
> Adjacent 8, hypotenuse 17. Opposite = √(17² − 8²) = 15, so sin(P) = 15/17.
~ type x^{2}+y^{2}=17^{2} :: Hypotenuse 17: a circle of radius 17.
~ type x=8 :: Adjacent side 8: the line x = 8.
~ zoom -28 28 -21 21
~ point (8, 15) :: The crossing is 15 high: opposite = 15.
~ say :: sin(P) = opposite/hypotenuse = 15/17.
```

## Tangent to sine

```quiz
In a right triangle, tan(A) = 9/40. What is sin(A)?
- 40/41 :: That's cos(A). Sine uses the opposite side, 9.
* 9/41
- 9/40 :: That's tan(A) again. Find the hypotenuse.
> Opposite 9, adjacent 40. Hypotenuse = √(9² + 40²) = 41, so sin(A) = 9/41.
~ type \sqrt{9^{2}+40^{2}} :: Type the Pythagorean theorem. Desmos shows 41.
~ say :: Hypotenuse 41, so sin(A) = 9/41.
```

# Sine equals cosine
Angles that add to 90° swap sine and cosine.

## Complementary angles

The two acute angles add to 90°, so **sin(x°) = cos(90° − x°)**.

```example
A right triangle has acute angles A and B, and sin(A) = 0.6. What is cos(B)?
1. A + B = 90° :: The right angle takes the other 90°.
2. Opposite A = adjacent to B :: One side, two names.
3. cos(B) = 0.6 :: Same side over the same hypotenuse.
```

## Find the angle

```quiz
sin(41°) = cos(k°), where 0 < k < 90. What is k?
* 49
- 41 :: Sine and cosine match only at 45°.
- 139 :: That's 180 − 41. Subtract from 90.
> The angles must add to 90°: k = 90 − 41 = 49.
```

# Special triangles
Two side patterns from the reference sheet.

## Two patterns

30-60-90 sides are x, x√3, 2x. 45-45-90 sides are x, x, x√2.

```example
A square has side 5. How long is its diagonal?
1. Two 45-45-90 triangles :: The diagonal splits the square.
2. Legs: x = 5 :: The legs are the square's sides.
3. Diagonal = x√2 = 5√2 :: The hypotenuse is x√2.
```

## Use 30-60-90

```quiz
The hypotenuse of a 30-60-90 triangle is 12. How long is the side opposite the 60° angle?
- 6 :: That's the side opposite 30°.
- 12√3 :: Halve the hypotenuse first: x = 6.
* 6√3
> 2x = 12, so x = 6. The side opposite 60° is x√3 = 6√3.
```

# Trap: the other angle
Change the angle and opposite and adjacent swap.

## Label from the angle

Opposite never touches your angle. Label the sides from the angle asked.

```example
In triangle ABC, angle B is 90°, AB = 5 and BC = 12. Find tan(A) and tan(C).
1. From A: opposite BC = 12, adjacent AB = 5 :: BC doesn't touch A.
2. From C: opposite AB = 5, adjacent BC = 12 :: The sides swap roles.
3. tan(A) = 12/5, tan(C) = 5/12 :: Flipped fractions.
```

## Which tangent?

```quiz
In triangle ABC, angle B is 90°, AB = 8, BC = 15 and AC = 17. What is tan(C)?
* 8/15
- 15/8 :: Trap: that's tan(A). From C, the opposite side is AB.
- 8/17 :: That's sin(C). Tangent is opposite/adjacent.
> From C: opposite AB = 8, adjacent BC = 15. tan(C) = 8/15.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Build the triangle from the cosine, then read the tangent.

```check
m-17140
```

## Your turn: medium

cos = sin means the two angles add to 90°.

```check
m-1610
```

## Your turn: hard

Find the third side, then label the sides from angle L.

```check
m-1890
```
