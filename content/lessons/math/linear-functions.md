---
title: Linear Functions
skill: linear-functions
domain: algebra
section: math
summary: Use f(x) = mx + b: find outputs and inputs, build the rule from points or a story, and say what the slope and intercept mean.
---

## Spot it: input in, output out

A *function* turns each input into one output. A **linear** function changes by the same amount each time the input goes up by 1, so its graph is a straight line:

f(x) = mx + b

- **m**, the slope: the change for each 1 unit of input
- **b**, the starting value: the output when the input is 0

You'll see a rule, a table, a graph or a story with a steady rate. The letters can change: C(t), h(w).

```quiz
f(x) = 4x − 9. What is the value of f(5)?
* 11
- 3.5 :: That solves 4x − 9 = 5, treating 5 as the output. f(5) means the input is 5.
- 20 :: You stopped at 4 × 5. The −9 still applies: 20 − 9 = 11.
> f(5) means "put 5 in for x": f(5) = 4(5) − 9 = 20 − 9 = 11.
```

## Output given? Solve for input

Look at where the number sits:

| You see | It means |
|---|---|
| f(3) | input is 3: plug it in |
| f(k) = 11 | output is 11: solve for k |
| f(3) = 10 | the point (3, 10) is on the graph |

For f(k) = 11, set the rule equal to 11 and solve.

```quiz
f(x) = (2/5)x + 3. If f(k) = 11, what is the value of k?
* 20
- 7.4 :: That's f(11). Here 11 is the output, so set (2/5)k + 3 = 11.
- 3.2 :: To undo × 2/5, multiply by 5/2. You multiplied 8 by 2/5 instead.
- 35 :: Subtract the 3 from 11, don't add it: (2/5)k = 8.
> Set the rule equal to 11: (2/5)k + 3 = 11.
> Subtract 3: (2/5)k = 8. Multiply by the flipped fraction: k = 8 × 5/2 = 20.
> Check: (2/5)(20) + 3 = 8 + 3 = 11.
```

## Slope first, then b

Two points are enough to build the rule.

1. **Slope:** m = (y_2 − y_1)/(x_2 − x_1). Output change on top, input change below, same order in both.
2. **b:** put one point into y = mx + b and solve.
3. **Check** with the other point.

```quiz
For the linear function f, f(3) = 14 and f(7) = 26. What is the value of f(0)?
* 5
- 3 :: That's the slope m. f(0) is the starting value b.
- 13 :: Your slope is upside down. Output change goes on top: 12/4 = 3, not 4/12.
- 14 :: 14 is the output at x = 3. f(0) needs x = 0.
> The points are (3, 14) and (7, 26).
> Slope: (26 − 14)/(7 − 3) = 12/4 = 3.
> b: 14 = 3(3) + b, so b = 5. The rule is f(x) = 3x + 5, and f(0) = 5.
> Check: f(7) = 21 + 5 = 26.
```

## Read a table

A table is linear only if the rate, **change in f(x) ÷ change in x**, is the same between every pair of rows. If the x-steps are uneven, divide each change by its own x-step.

| x | f(x) |
|---|---|
| −1 | 9 |
| 2 | 3 |
| 7 | −7 |

The first row is **not** b unless its x is 0.

> **Tip:** Messy table? In Desmos, add a table and fill the x_1 and y_1 columns. On a new line, type `y1~mx1+b` (no underscore). Desmos shows m and b.

```quiz
The table above shows values of the linear function f. Which equation defines f?
* f(x) = −2x + 7
- f(x) = −2x + 9 :: 9 is f(−1), the output at x = −1. b is the output at x = 0.
- f(x) = 2x − 1 :: f falls as x rises, so the slope must be negative.
- f(x) = −(1/2)x + 4 :: Your slope is upside down. Output change goes on top: −6/3 = −2.
> Slope from the first two rows: (3 − 9)/(2 − (−1)) = −6/3 = −2. The last two rows agree: −10/5 = −2.
> b: 3 = −2(2) + b, so b = 7.
> Check row 1: −2(−1) + 7 = 9.
```

## What m and b mean

In a story, match each number to its job:

- **m** multiplies the input: "for each 1 more [input], the [output] goes up (or down) by m."
- **b** stands alone: "the [output] when the [input] is 0", a starting amount or fixed fee.

A minus sign on m means the output **decreases**. Choices say "decreases by 4", not "increases by −4".

```quiz
B(t) = 92 − 4t gives the percent of battery left on a phone t hours after it is unplugged. What is the best interpretation of 4?
- The battery was at 4% when it was unplugged. :: That describes b, the starting value. Here b is 92.
* The battery drops by 4 percentage points each hour.
- The battery rises by 4 percentage points each hour. :: The minus sign means the battery goes down.
- The battery is empty after 4 hours. :: Empty means B(t) = 0. That takes 92 ÷ 4 = 23 hours.
> 4 multiplies t, so it is the rate: percentage points per hour. The minus sign makes it a drop.
> 92 stands alone, so it is the starting charge: 92% at t = 0.
```

## Build a model from a story

Find the two pieces:

- **b** = the value at the start, when the input is 0.
- **m** = change ÷ time. "Rises 12 cm in 3 weeks" is 12 ÷ 3 = 4 cm per week, not 12.

If the amount goes down, drains or loses value, m is **negative**.

```quiz
A pool holds 800 liters of water when draining starts. It drains at a constant rate, and after 5 minutes it holds 650 liters. Which function gives the liters L(t) left after t minutes?
* L(t) = 800 − 30t
- L(t) = 800 − 150t :: 150 liters is the drop over 5 minutes. Per minute it is 150 ÷ 5 = 30.
- L(t) = 650 − 30t :: 650 is the amount after 5 minutes. The start, at t = 0, is 800.
- L(t) = 800 + 30t :: The pool is draining, so the slope must be negative.
> Start: L(0) = 800. Drop: 800 − 650 = 150 liters in 5 minutes, which is 150 ÷ 5 = 30 liters per minute, going down.
> So L(t) = 800 − 30t. Check: L(5) = 800 − 150 = 650.
```

## A change needs only m

When the input goes up by some amount, the output changes by **m × that amount**. The starting value b is in both outputs, so it cancels.

For C(h) = 18h + 45, 3 more hours add 3 × 18 = $54.

```quiz
P(n) = 12n + 150 gives a caterer's price, in dollars, for n guests. How much more does it cost for 25 guests than for 20 guests?
* $60
- $450 :: That's P(25), the whole price. The question asks for the difference.
- $210 :: The $150 is in both prices, so it cancels. Only 5 × 12 counts.
- $12 :: That's the extra cost for 1 guest. There are 5 more guests.
> 25 − 20 = 5 more guests, at $12 each: 5 × 12 = $60.
> The long way agrees: P(25) − P(20) = 450 − 390 = 60.
```

## Trap: "each additional" unit

Watch for prices like "$X for the first day and $Y for **each additional** day". The second rate only covers the days after the first. Test your rule at 1 unit.

```quiz
A bike rental costs $15 for the first hour and $6 for each additional hour. Which function gives the cost C(h), in dollars, for h hours, where h ≥ 1?
- C(h) = 6h + 15 :: Trap: this charges $6 for the first hour too. C(1) would be $21, not $15.
* C(h) = 6h + 9
- C(h) = 15h + 6 :: The $6 is the repeating rate, so it multiplies h. You swapped the two prices.
> The first hour costs $15, then h − 1 more hours cost $6 each: C(h) = 15 + 6(h − 1) = 6h + 9.
> Check: C(1) = 6 + 9 = 15, and C(3) = 18 + 9 = 27, which is 15 + 6 + 6.
```

## Your turn: easy

The y-intercept is the output when the input is 0.

```check
m-0753
```

## Your turn: medium

First day, then each additional day. Test your rule at d = 1.

```check
m-1122
```

## Your turn: hard

Build p from its slope and a point to find c. Then use two points of t.

```check
m-14032
```

## Recap

- f(3) is an output. f(k) = 11 means: solve for the input.
- Slope = output change ÷ input change. Then put a point in to find b.
- b is the output at input 0, not the first row of a table.
- In a story, m is the rate per 1 unit and b is the start. A drop means m is negative.
- A change in output is m × the change in input.
- "First…, each additional…": test your rule at 1 unit.
