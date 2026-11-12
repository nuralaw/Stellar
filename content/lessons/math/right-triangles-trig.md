---
title: Right Triangles and Trigonometry
skill: right-triangles-trig
domain: geometry-trig
section: math
summary: Turn one trig ratio into a triangle and read any side or ratio.
---

## SOH-CAH-TOA

From your angle: **sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent**. The hypotenuse faces the right angle.

```example
In right triangle ABC, angle C is 90° and sin(A) = 3/5. What is tan(A)?
1. Opposite = 3, hypotenuse = 5 :: Read sin as opposite/hypotenuse.
2. Adjacent = √(5² − 3²) = 4 :: Pythagorean theorem gives the third side.
3. tan(A) = 3/4 :: Opposite over adjacent.
```

## Build the triangle

```quiz
In right triangle PQR, angle R is 90° and cos(P) = 8/17. What is sin(P)?
* 15/17
- 8/15 :: That's adjacent/opposite. Sine is opposite/hypotenuse.
- 8/17 :: That's cos(P) again. Find the opposite side.
> Adjacent 8, hypotenuse 17. Opposite = √(17² − 8²) = 15, so sin(P) = 15/17.
```

## Angle and side known

Pick the ratio that holds your two sides: the one you know and the one you want.

```quiz
A 10-foot ladder leans on a wall and makes a 35° angle with the ground. Which expression gives the height, in feet, it reaches on the wall?
* 10 sin(35°)
- 10 cos(35°) :: That's the distance along the ground, the adjacent side.
- 10/sin(35°) :: That's longer than the ladder. Multiply, don't divide.
> The height is opposite 35°, the ladder is the hypotenuse: sin(35°) = height/10.
```

## Sine equals cosine

The two acute angles add to 90°, so **sin(x°) = cos(90° − x°)**.

```quiz
sin(41°) = cos(k°), where 0 < k < 90. What is k?
* 49
- 41 :: Sine and cosine match only at 45°.
- 139 :: That's 180 − 41. Subtract from 90.
> The angles must add to 90°: k = 90 − 41 = 49.
```

## Special triangles

On the reference sheet: 30-60-90 sides are x, x√3, 2x. 45-45-90 sides are x, x, x√2.

```quiz
The hypotenuse of a 30-60-90 triangle is 12. How long is the side opposite the 60° angle?
* 6√3
- 6 :: That's the side opposite 30°.
- 12√3 :: Halve the hypotenuse first: x = 6.
> 2x = 12, so x = 6. The side opposite 60° is x√3 = 6√3.
```

## Trap: the other angle

Opposite and adjacent swap when the angle changes. Label them from the angle asked.

```quiz
In triangle ABC, angle B is 90°, AB = 8, BC = 15 and AC = 17. What is tan(C)?
* 8/15
- 15/8 :: Trap: that's tan(A). From C, the opposite side is AB.
- 8/17 :: That's sin(C). Tangent is opposite/adjacent.
> From C: opposite AB = 8, adjacent BC = 15. tan(C) = 8/15.
```

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

## Recap

- Label opposite and adjacent from your angle, then SOH-CAH-TOA.
- One ratio given? The Pythagorean theorem finds the third side.
- sin(x°) = cos(90° − x°).
