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

## Build it yourself

```quiz
For the linear function f, f(3) = 14 and f(7) = 26. What is f(0)?
* 5
- 3 :: That's the slope. f(0) is b.
- 13 :: Slope upside down. Output change goes on top: 12/4.
> m = 12/4 = 3. Then 14 = 3(3) + b, so b = 5 = f(0).
~ table x_1: 3, 7; y_1: 14, 26 :: Put the two points in a table.
~ zoom -4 10 -5 30
~ type y_{1}\sim mx_{1}+b :: Desmos fits the line: m = 3, b = 5.
~ point (0, 5) :: f(0) is b: the line crosses the y-axis at 5.
```

# Output given, find x
Set the rule equal to the output.

## Output given? Solve for x

f(k) = 11 means the output is 11.

```example
f(x) = 3x − 4. If f(k) = 11, what is k?
1. 3k − 4 = 11 :: Set the rule equal to 11.
2. 3k = 15 :: Add 4 to both sides.
3. k = 5 :: Check: f(5) = 15 − 4 = 11.
```

## Find the input

```quiz
f(x) = (2/5)x + 3. If f(k) = 11, what is k?
- 7.4 :: That's f(11). Here 11 is the output.
- 3.2 :: To undo × 2/5, multiply 8 by 5/2.
* 20
> (2/5)k + 3 = 11, so (2/5)k = 8 and k = 8 × 5/2 = 20.
~ type y=\frac{2}{5}x+3 :: Type the rule.
~ type y=11 :: The output is 11: a flat line.
~ zoom -5 30 -2 16
~ point (20, 11) :: Click the crossing. Its x is k: 20.
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

## What the number means

```quiz
B(t) = 92 − 4t gives the percent of battery left t hours after a phone is unplugged. What does the 4 mean?
* The battery drops 4 percentage points each hour.
- The battery was at 4% when unplugged. :: That's b, the start. Here b is 92.
- The battery is empty after 4 hours. :: Empty means B(t) = 0. That's t = 23.
> 4 multiplies t, so it's the rate per hour. The minus sign makes it a drop.
```

## Build one yourself

```quiz
A pool holds 800 liters when draining starts. It drains at a constant rate and holds 650 liters after 5 minutes. Which function gives the liters left after t minutes?
* L(t) = 800 − 30t
- L(t) = 800 − 150t :: 150 is the drop in 5 minutes. Divide by 5.
- L(t) = 650 − 30t :: 650 is the amount at t = 5. The start is 800.
> Drop: 150 liters in 5 minutes = 30 per minute. Start: 800. Check: L(5) = 650.
~ table x_1: 0, 5; y_1: 800, 650 :: The story gives two points: (0, 800) and (5, 650).
~ zoom -3 30 -100 900
~ type y_{1}\sim mx_{1}+b :: Desmos fits the line: m = −30, b = 800.
~ point (0, 800) :: Start 800, drop 30 per minute: 800 − 30t.
```

# Trap: "each additional"
The second price skips the first unit.

## Test your rule at 1

The second price covers only the units after the first.

```example
A taxi costs $4 for the first km and $2 for each additional km. Which function gives the cost for d km (d ≥ 1)?
1. Additional km: d − 1 :: The first km is already paid.
2. C(d) = 4 + 2(d − 1) :: First km, then $2 for the rest.
3. C(d) = 2d + 2 :: Check: C(1) = 4.
```

## Spot the trap

```quiz
A bike rental costs $15 for the first hour and $6 for each additional hour. Which function gives the cost for h hours (h ≥ 1)?
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

The y-intercept is the output at x = 0.

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
