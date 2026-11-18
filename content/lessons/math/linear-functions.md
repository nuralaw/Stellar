---
title: Linear Functions
skill: linear-functions
domain: algebra
section: math
summary: Build f(x) = mx + b from two points and say what m and b mean.
---

# Rule from two points
Slope first, then b.

## Slope first, then b

**f(x) = mx + b.** m is the change in output per 1 unit of x. b is the output at x = 0.

```example
For the linear function f, f(1) = 3 and f(3) = 7. Which equation defines f?
1. Points: (1, 3) and (3, 7) :: f(1) = 3 means input 1, output 3.
2. m = (7 − 3)/(3 − 1) = 2 :: Output change over input change.
3. 3 = 2(1) + b → b = 1 :: Put one point into the rule.
4. f(x) = 2x + 1
```

```more
A **function** gives one output for each input. In f(x), x is the input and f(x) is the output, so f(1) = 3 is the point (1, 3). A **linear** function has a straight-line graph. Its slope m is the output change divided by the input change.
```

## Build it yourself

```quiz
For the linear function f, f(3) = 14 and f(7) = 26. What is f(0)?
answer: 5
- 3 :: That is the slope. f(0) is b.
- 13 :: Slope upside down. Output change goes on top: 12/4.
> m = 12/4 = 3. Then 14 = 3(3) + b, so b = 5 = f(0).
~ table x_1: 3, 7; y_1: 14, 26 :: Put the two points in a table.
~ zoom -4 10 -5 30
~ type y_{1}\sim mx_{1}+b :: Desmos fits the line: m = 3, b = 5.
~ point (0, 5) :: f(0) is b: the line crosses the y-axis at 5.
```

# Read m and b
From a table or a graph.

## Read it from a table

b is the output at x = 0. m is how much the output changes for 1 step of x.

```visual
linear-functions--read-graph
```

```example
x = 0, 2, 4 give f(x) = 7, 13, 19. Which function f fits the table?
1. b = 7 :: The output at x = 0.
2. m = (13 − 7) ÷ 2 = 3 :: Output rises 6 when x rises 2.
3. f(x) = 3x + 7 :: Check: f(4) = 12 + 7 = 19.
```

```more
In the picture, the table and the graph show the same line. The y-intercept is the point on the y-axis where x = 0, so its output is b. To read the slope from a graph, start at a point and count how far up you go for each 1 step to the right.
```

## Read it from a graph

```quiz
The graph of y = f(x) in the xy-plane is a line through (0, 4) and (3, 10). Which equation defines f?
* f(x) = 2x + 4
- f(x) = 3x + 4 :: 3 is the x-coordinate. Slope is 6 ÷ 3.
- f(x) = 2x + 10 :: 10 is the output at x = 3, not at x = 0.
> b = 4 (the point with x = 0). Slope = (10 − 4) ÷ 3 = 2.
~ type y=2x+4 :: Type the correct choice.
~ point (0, 4) :: It starts at b = 4.
~ point (3, 10) :: Up 6 for 3 across: slope 2.
```

# Input and output
f(k) = 11: the output is 11. Solve for k.

## Output given? Solve for x

f(k) = 11 means the output is 11. f(3) = 50 means input 3 gives output 50.

```example
f(x) = 3x − 4. If f(k) = 11, what is k?
1. 3k − 4 = 11 :: Set the rule equal to 11.
2. 3k = 15 :: Add 4 to both sides.
3. k = 5 :: Check: f(5) = 15 − 4 = 11.
```

```more
In f(x), the **input** is the number inside the parentheses and the **output** is the value of f. f(3) = 50 is the point (3, 50). When a problem gives f(k) = 11, the output is known and the input k is not. So write the rule equal to 11 and solve for k.
```

## Find the input

```quiz
f(x) = (2/5)x + 3. If f(k) = 11, what is the value of k?
answer: 20
- 7.4 :: That is f(11). Here 11 is the output.
- 3.2 :: To undo × 2/5, multiply 8 by 5/2.
> (2/5)k + 3 = 11, so (2/5)k = 8 and k = 8 × 5/2 = 20.
~ type y=\frac{2}{5}x+3 :: Type the rule.
~ type y=11 :: The output is 11: a flat line.
~ zoom -5 30 -2 16
~ point (20, 11) :: Click the crossing. Its x is k: 20.
```

## Meaning of f(3) = 50

```quiz
The function f gives the cost, in dollars, of renting a kayak for h hours. What does f(3) = 50 mean?
* Renting the kayak for 3 hours costs $50.
- Renting the kayak for 50 hours costs $3. :: The input is inside the parentheses: 3 hours.
- Each hour of renting costs $50. :: That would be the slope, not f(3).
> The input 3 is the hours. The output 50 is the cost in dollars.
```

# Rate and start
m is the rate. b is the start.

## Build from a story

In a story, m is the rate per 1 unit and b is the amount at time 0.

```example
A candle is 20 cm tall when lit. It burns at a constant rate and is 12 cm tall after 4 hours. Which function gives its height after t hours?
1. b = 20 :: The height at t = 0.
2. m = (12 − 20)/4 = −2 :: Change ÷ time. Minus means a drop.
3. h(t) = 20 − 2t :: Check: h(4) = 12.
```

```more
A **constant rate** means the same change every hour, so the graph is a straight line. The **start** is the value at time 0. The rate is the change in height divided by the change in time. A drop in height gives a negative rate.
```

## What the number means

```quiz
B(t) = 92 − 4t gives the percent of battery left t hours after a phone is unplugged. What does the 4 mean?
* The battery drops 4 percentage points each hour.
- The battery was at 4% when unplugged. :: That is b, the start. Here b is 92.
- The battery is empty after 4 hours. :: Empty means B(t) = 0. That is t = 23.
> 4 multiplies t, so it is the rate per hour. The minus sign makes it a drop.
```

## Predict with the rule

```quiz
A pool holds 800 liters when draining starts. It drains at a constant rate and holds 650 liters after 5 minutes. How many liters will it hold 12 minutes after draining starts?
answer: 440
- 150 :: That is the drop in the first 5 minutes.
- 30 :: That is the drain rate per minute.
> Rate: 150 ÷ 5 = 30 liters per minute. L(12) = 800 − 30(12) = 440.
~ table x_1: 0, 5; y_1: 800, 650 :: The story gives two points.
~ zoom -3 30 -100 900
~ type y_{1}\sim mx_{1}+b :: Desmos fits the line: m = −30, b = 800.
~ point (12, 440) :: At 12 minutes the pool holds 440 liters.
```

# Graph the story
Start is the y-intercept. Rate is the slope.

## Graph the candle

Graph a story: the start is the y-intercept, the rate is the slope.

```desmos
A candle's height in cm is h(t) = 20 − 2t, where t is the hours since it was lit. Graph it.
type y=20-2x :: Type h(t) with x for t.
zoom -2 12 -2 24
point (0, 20) :: Start: 20 cm at t = 0.
point (4, 12) :: Down 8 in 4 hours: slope −2 per hour.
point (10, 0) :: Height 0: burned out at t = 10.
```

```more
The graph of h(t) = 20 − 2t is a line. The **y-intercept** (0, 20) is the start. The **slope** −2 means the height falls 2 cm each hour. The **x-intercept** (10, 0) is where the height reaches 0. To find it, solve 20 − 2t = 0.
```

## Read the point

```quiz
The function h(t) = 20 − 2t gives a candle's height, in centimeters, t hours after it is lit. What does the point (10, 0) on the graph of y = h(t) mean?
* After 10 hours the candle's height is 0 cm.
- The candle is 10 cm tall when it is lit. :: That would be (0, 10). The first number is time.
- The candle burns 10 cm each hour. :: The burn rate is 2 cm per hour: the slope.
> The point (10, 0) means t = 10 and h = 0: the candle is used up after 10 hours.
```

# Shift a graph
Add to the output: the graph moves up or down.

## Up or down

y = f(x) + 5 moves the graph up 5. y = f(x) − 3 moves it down 3.

```example
f(x) = 2x + 5. The graph of y = g(x) is the graph of y = f(x) shifted down 3 units. Write g(x).
1. g(x) = f(x) − 3 :: Down 3: subtract 3 from the output.
2. g(x) = 2x + 5 − 3 :: Put in f(x).
3. g(x) = 2x + 2 :: Same slope. New y-intercept.
```

```more
A **shift** moves the whole graph without turning it. Every output changes by the same amount, so the slope stays the same. Only the y-intercept moves: up if you add, down if you subtract.
```

## Shift it yourself

```quiz
The graph of y = g(x) in the xy-plane is the graph of y = f(x) shifted up 6 units, where f(x) = 3x + 4. What is the y-coordinate of the y-intercept of y = g(x)?
answer: 10
- 6 :: That is the shift. Add it to f's y-intercept.
- 4 :: That is the y-intercept of f, before the shift.
> g(x) = f(x) + 6 = 3x + 10. The y-intercept is (0, 10).
~ type y=3x+4 :: Type f.
~ type y=3x+10 :: Shifted up 6: same slope, new start.
~ point (0, 10) :: The new y-intercept: 10.
```

# Trap: "each additional"
'Each additional' starts after the first km.

## Test your rule at 1

The second price covers only what comes after the first unit.

```visual
linear-functions--extend-back
```

```example
A taxi costs $4 for the first km and $2 for each additional km. Which function gives the cost for d km (d ≥ 1)?
1. Additional km: d − 1 :: The first km is already paid.
2. C(d) = 4 + 2(d − 1) :: First km, then $2 for the rest.
3. C(d) = 4 + 2d − 2 :: Distribute: 2(d − 1) = 2d − 2.
4. C(d) = 2d + 2 :: Combine 4 − 2. Check: C(1) = 4.
```

```more
For d = 1 there are 0 additional km, for d = 2 there is 1, so the additional km are always d − 1. The y-intercept 2 is not a price. It is where the line would meet the cost axis at 0 km, if you carried the line back.
```

## Spot the trap

```quiz
The cost of renting a bike is $15 for the first hour and $6 for each additional hour. Which of the following functions gives the cost C(h), in dollars, of renting the bike for h hours, where h is a positive integer?
- C(h) = 6h + 15 :: Trap: that charges $21 for one hour, not $15.
* C(h) = 6h + 9
- C(h) = 15h + 6 :: $6 is the repeating price, so it multiplies h.
> C(h) = 15 + 6(h − 1) = 6h + 9. Check: C(1) = 15.
~ table x_1: 1, 2; y_1: 15, 21 :: Two sure prices: 1 hour $15, 2 hours $21.
~ zoom -1 6 -5 45
~ type y_{1}\sim mx_{1}+b :: Desmos fits the line: m = 6, b = 9.
~ point (1, 15) :: The line 6h + 9 passes through (1, 15).
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

xy-plane: the plane with an x-axis and a y-axis.

```check
m-0753
```

## Your turn: medium

Test your rule at d = 1.

```check
m-1122
```

## Your turn: hard

Find c from p first. Then use two points of t.

```check
m-14032
```
