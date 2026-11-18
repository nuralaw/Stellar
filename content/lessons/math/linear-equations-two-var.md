---
title: Linear Equations in Two Variables
skill: linear-equations-two-var
domain: algebra
section: math
summary: Get y alone, then read the slope and intercept of any line.
---

# Slope and y-intercept
Get y alone, then read m and b.

## Get y alone

In **y = mx + b**, m is the slope (how steep) and b is the y-intercept. Another form? Solve for y first.

```example
2x + 3y = 12. Find the slope and the y-intercept.
1. 3y = −2x + 12 :: Subtract 2x from both sides.
2. y = −(2/3)x + 4 :: Divide every term by 3.
3. Slope −2/3, y-intercept 4 :: Read m and b.
```

```more
The **slope** tells how much y changes when x goes up by 1. A negative slope means the line goes down to the right. The **y-intercept** is the point where the line crosses the y-axis. To get y alone, move the x term to the other side, then divide every term by the number in front of y.
```

## Read the slope yourself

```quiz
What is the slope of the line 3x + 4y = 20?
- 3 :: That is the x-coefficient. Get y alone first.
* −3/4
- 3/4 :: Subtracting 3x makes it −3x.
- −4/3 :: Upside down. Divide −3 by 4.
> 4y = −3x + 20, so y = −(3/4)x + 5. The slope is −3/4.
~ type 3x+4y=20 :: Type the equation as it is.
~ point (0, 5) :: Click two points on the line.
~ point (4, 2) :: Right 4, down 3: slope −3/4.
```

# Slope from two points
Rise over run: change in y over change in x.

## Use the slope formula

Slope is **rise over run**: the change in y divided by the change in x.

```visual
linear-equations-two-var--slope-formula
```

```example
Find the slope of the line through (−1, 5) and (3, −3).
1. (−3 − 5) ÷ (3 − (−1)) :: Same order on top and bottom.
2. −8 ÷ 4 :: Subtracting −1 adds 1.
3. Slope = −2 :: The line goes down, so it is negative.
```

```more
The **run** is how far you move right (the change in x). The **rise** is how far you move up (the change in y). Call one point first and the other second, then use that same order on top and on bottom. If you swap the order on only one of them, the sign comes out wrong.
```

## Find the slope

```quiz
A line in the xy-plane passes through the points (2, 1) and (6, 10). What is the slope of the line?
answer: 9/4, 2.25
- 4/9 :: Upside down. The rise goes on top.
- 11/8 :: You added the coordinates. Subtract them.
> Rise: 10 − 1 = 9. Run: 6 − 2 = 4. Slope = 9/4 = 2.25.
~ zoom 0 8 0 12 :: Set the window.
~ point (2, 1) :: Click both points.
~ point (6, 10) :: Rise 9, run 4: slope 9/4.
```

# Intercepts
Zero the other letter.

## Set the other to 0

x-intercept: set y = 0. y-intercept: set x = 0.

```example
3x + 2y = 12. Find both intercepts.
1. y = 0: 3x = 12, x = 4 :: x-intercept (4, 0).
2. x = 0: 2y = 12, y = 6 :: y-intercept (0, 6).
3. (4, 0) and (0, 6) :: One zero in each point.
```

```more
An **intercept** is a point where the line crosses an axis. On the x-axis, every point has y = 0. On the y-axis, every point has x = 0. So to find one intercept, put 0 in for the other letter and solve.
```

## Find the x-intercept

```quiz
The line 2x − 5y = 20 crosses the x-axis at (a, 0). What is the value of a?
answer: 10
- −4 :: That is the y-intercept. On the x-axis, y = 0.
- 4 :: With y = 0, divide 20 by 2, not 5.
> Set y = 0: 2a = 20, so a = 10.
~ type 2x-5y=20 :: Type the equation as it is.
~ zoom -4 14 -8 6
~ point (10, 0) :: Click where it crosses the x-axis: a = 10.
```

# Match a table or graph
Find b first. Then the slope.

## Read b and m

At x = 0 the output is b. Then find how much y changes for 1 step of x.

```example
A table gives (0, 5), (2, 1) and (4, −3). Which equation fits?
1. b = 5 :: At x = 0, y is 5.
2. m = (1 − 5) ÷ 2 = −2 :: y drops 4 when x grows by 2.
3. y = −2x + 5 :: Check (4, −3): −8 + 5 = −3.
```

```more
A graph works the same way. The place where the line crosses the y-axis is b. If the line goes up as you move right, m is positive. If it goes down, m is negative. When two equations look alike, test one more point from the table or graph in each equation.
```

## Match the equation

```quiz
A line in the xy-plane crosses the y-axis at (0, −2) and the x-axis at (3, 0). Which equation defines this line?
- y = (3/2)x − 2 :: Slope is rise ÷ run: 2 ÷ 3.
* y = (2/3)x − 2
- y = −(2/3)x − 2 :: The line goes up to the right: positive slope.
> b = −2. Slope = (0 − (−2)) ÷ (3 − 0) = 2/3.
~ type y=\frac{2}{3}x-2 :: Type the correct choice.
~ point (0, -2) :: It crosses the y-axis here.
~ point (3, 0) :: And the x-axis here.
```

# Parallel lines
Same slope, new y-intercept.

## Keep the slope

Parallel lines have the same slope. Plug in the point to find b.

```example
A line is parallel to y = 3x − 1 and passes through (2, 10). Find its equation.
1. Slope = 3 :: Parallel: copy the slope.
2. 10 = 3(2) + b, so b = 4 :: Plug in the point.
3. y = 3x + 4 :: Put m and b together.
```

```more
**Parallel** lines never cross, because they lean the same amount. So they have the same slope m but different y-intercepts b. To find b, put the given point (x, y) into y = mx + b and solve for b.
```

## Build the parallel line

```quiz
Line k is parallel to the line 4x − 2y = 7 and passes through (1, 5). Which equation defines line k?
- y = −2x + 7 :: Sign slip: −4x ÷ −2 is +2x.
- y = 4x + 1 :: 4 is the x-coefficient, not the slope.
* y = 2x + 3
> −2y = −4x + 7, so the slope is 2. Through (1, 5): 5 = 2(1) + b, so b = 3.
~ type 4x-2y=7 :: Type the given line.
~ slider b = 0 :: Make a slider for b.
~ type y=2x+b :: Same slope as the given line.
~ slider b = 0 .. 3 :: Slide b until the line passes through (1, 5).
~ point (1, 5) :: At b = 3 it does.
```

# Equations from stories
Price times count adds up to the total.

## Read the story equation

In 3x + 2y = 24, x and y count items. 3 and 2 are prices. 24 is the total.

```example
Pens cost $3 and notebooks $2. Sam spends $24: 3x + 2y = 24, where x is pens and y is notebooks. He buys 4 pens. How many notebooks?
1. 3(4) + 2y = 24 :: Put in x = 4.
2. 2y = 12 :: Subtract 12.
3. y = 6 notebooks :: Divide by 2.
```

```more
Here x is the **number of pens** and y is the **number of notebooks**. The term 3x is the money spent on pens: price × number. The term 2y is the money spent on notebooks. Adding them gives the total money, 24. A number in front of a letter is the price (or rate) of that item.
```

## What does the 6 mean?

```quiz
A bakery sells muffins for $3 and cakes for $6. A customer pays $63 for x muffins and y cakes: 3x + 6y = 63. What does the 6 mean?
* Each cake costs $6.
- The customer bought 6 cakes. :: The number of cakes is y. 6 is a price.
- The customer paid $6 in total. :: The total is 63.
> 6 multiplies y, the number of cakes. So 6 is the price of one cake.
```

## Count the hats

```quiz
A club sells x T-shirts at $8 each and y hats at $5 each for $200 in total: 8x + 5y = 200. It sold 15 T-shirts. How many hats did it sell?
answer: 16
- 40 :: You ignored the T-shirts. Put in x = 15 first.
- 10 :: You divided the $80 left by 8. Hats cost $5.
> 8(15) = 120. Then 5y = 200 − 120 = 80, so y = 16.
~ type 8x+5y=200 :: Type the equation as it is.
~ type x=15 :: 15 T-shirts is the line x = 15.
~ zoom -5 30 -5 45
~ point (15, 16) :: Click the crossing: y = 16 hats.
```

# Trap: perpendicular slopes
Flip the fraction and change the sign.

## Do both moves

A perpendicular slope needs **both** moves: flip it, then change the sign.

```visual
linear-equations-two-var--perpendicular
```

```example
A line is perpendicular to y = (2/5)x + 1. Find its slope.
1. Given slope: 2/5 :: Read m.
2. Flip: 5/2 :: Turn the fraction upside down.
3. Slope −5/2 :: Change the sign.
```

```more
**Perpendicular** lines meet at a right angle (90°). Turn the slope triangle a quarter turn: the run and the rise swap places, and one of them changes direction. That is why the new slope is the flipped fraction with the opposite sign. Check: 2/5 × (−5/2) = −1.
```

## Flip and change sign

```quiz
Line k is perpendicular to the line 3x + 2y = 8. What is the slope of line k?
* 2/3
- 3/2 :: Trap: you changed the sign but did not flip.
- −2/3 :: Trap: you flipped but kept the sign.
- −3/2 :: That is the slope of the given line itself.
> 2y = −3x + 8, so the slope is −3/2. Flip and change sign: 2/3.
~ zoom -8 8 -2 10
~ type 3x+2y=8 :: Type the given line.
~ type y=\frac{2}{3}x+4 :: A line with slope 2/3.
~ point (0, 4) :: They cross at a right angle. Other slopes do not.
```

## Put it all together

```quiz
Line s is defined by 2x − 5y = 10. Line t is perpendicular to line s in the xy-plane and passes through the points (0, 0) and (4, k). What is the value of k?
answer: -10
- 10 :: The slope of line t is negative, so k is negative.
- −8/5 :: You changed the sign but did not flip the fraction.
> Line s has slope 2/5, so line t has slope −5/2. From (0, 0) to (4, k): k ÷ 4 = −5/2, so k = −10.
~ type 2x-5y=10 :: Type line s.
~ type y=-\frac{5}{2}x :: Line t: slope −5/2 through (0, 0).
~ point (4, -10) :: At x = 4, the line is at y = −10.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

xy-plane: the plane with an x-axis and a y-axis.

```check
m-0718
```

## Your turn: medium

Set y = 0 to find a, then x = 0 for b.

```check
m-0812
```

## Your turn: hard

Find the perpendicular slope, then use the slope formula.

```check
m-15640
```
