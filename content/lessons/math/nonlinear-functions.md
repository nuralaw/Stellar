---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read a parabola's vertex and an exponential's start and factor from the formula.
---

# Vertex form
Vertex (h, k): value k, at x = h.

## Read the vertex (h, k)

**y = a(x − h)² + k** has vertex (h, k): the maximum if a < 0, the minimum if a > 0.

```example
A ball's height, in meters, x seconds after a throw is y = −5(x − 3)² + 45. What is its maximum height?
1. −5 is negative → the parabola opens down :: So the vertex is the maximum.
2. x − 3 → h = 3 :: Inside: flip the sign.
3. + 45 → k = 45 :: Outside: keep the sign.
4. Maximum height: 45 meters, at 3 seconds
```

```more
A **parabola** is the U-shaped graph of a quadratic function. The **vertex** is its turning point: the highest point if the U opens down (a < 0), the lowest point if it opens up (a > 0). The vertex has two numbers: where it happens (x = h) and its value (y = k).
```

## Value or location?

The minimum **value** is k. **Where** it happens is h.

```quiz
f(x) = 2(x + 4)² − 7. What is the minimum value of f?
answer: -7
- −4 :: That is h: where the minimum is, not its value.
- 7 :: Only the inside sign flips. Outside, k stays −7.
> Vertex (−4, −7), and a = 2 > 0 opens up. The lowest value is k = −7.
~ type y=2(x+4)^{2}-7 :: Type it as it is.
~ point (-4, -7) :: Click the lowest point. Its y is the value: −7.
```

# Standard form
Vertex at x = −b/(2a). Plug in for the value.

## x = −b/(2a)

In **ax² + bx + c**, the vertex is at **x = −b/(2a)**.

```example
f(x) = −x² + 4x + 1. What is the maximum value of f?
1. a = −1, b = 4 :: a < 0: opens down, so a maximum.
2. x = −4/(2 · (−1)) = 2 :: Where the maximum is.
3. f(2) = −4 + 8 + 1 = 5 :: Plug in for the value.
4. Maximum value: 5
```

```more
**Standard form** is ax² + bx + c. The formula −b/(2a) gives the x-value of the vertex. To get the value of the function, put that x back into f. Remember the two jobs: first find where, then find the value. Also, c is the y-intercept, because f(0) = c.
```

## Find the minimum

```quiz
f(x) = 2x² − 12x + 7. What is the minimum value of f?
answer: -11
- 3 :: That is x = −b/(2a). Plug it in for the value.
- 7 :: That is f(0), the y-intercept. Use x = 3.
> x = −(−12)/(2 · 2) = 3. Then f(3) = 18 − 36 + 7 = −11.
~ type y=2x^{2}-12x+7 :: No formula needed: graph it.
~ zoom -4 10 -15 15 :: Zoom out until you see the bottom.
~ point (3, -11) :: Click the lowest point. Its y is −11.
```

# Read graphs and forms
Zeros, vertex, y-intercept: each form shows one.

## One function, three forms

Factored form shows the zeros. Vertex form shows the vertex. Standard form shows the y-intercept.

```desmos
f(x) = x² − 6x + 5 = (x − 1)(x − 5) = (x − 3)² − 4. Read the zeros, the vertex and the y-intercept.
type y=x^{2}-6x+5 :: Type f(x) in standard form.
point (1, 0) :: Zeros are where the graph meets the x-axis.
point (5, 0) :: Zeros: x = 1 and x = 5.
point (3, -4) :: The vertex is halfway between the zeros.
point (0, 5) :: The y-intercept is the constant 5.
```

```more
A **zero** of f is an x-value where f(x) = 0: the graph crosses the x-axis there. In factored form (x − 1)(x − 5), the zeros are 1 and 5. The vertex of a parabola is halfway between its zeros: (1 + 5) ÷ 2 = 3. In vertex form (x − 3)² − 4, you read the vertex (3, −4).
```

## Which form shows it?

```quiz
f(x) = x² − 8x + 12. Which equivalent form of f shows the zeros of f as constants?
* f(x) = (x − 2)(x − 6)
- f(x) = (x − 4)² − 4 :: That shows the vertex (4, −4).
- f(x) = x² − 8x + 12 :: That shows the y-intercept, 12.
> (x − 2)(x − 6) = x² − 8x + 12, and each factor gives a zero: x = 2 and x = 6.
~ type y=x^{2}-8x+12 :: Graph f.
~ zoom -2 10 -6 14
~ point (2, 0) :: The graph crosses the x-axis at 2 and 6.
~ point (6, 0) :: So the zeros are 2 and 6.
```

## Halfway between zeros

```quiz
The graph of y = f(x) in the xy-plane is a parabola that crosses the x-axis at (−2, 0) and (6, 0). The vertex is on the line x = k. What is the value of k?
answer: 2
- 4 :: That is half the distance between the zeros, not the middle.
- 8 :: That is the distance between the zeros.
> The vertex is halfway between the zeros: (−2 + 6) ÷ 2 = 2.
```

# Exponential: start and multiplier
In a · b^x, a starts, b multiplies.

## Read a and b

In **a · b^x**, a is the start. b is the multiplier: it multiplies the amount each step.

```visual
nonlinear-functions--growth
```

```example
A town's population after x years is P = 300(1.2)^x. What do 300 and 1.2 mean?
1. x = 0 → P = 300 :: The start: 300 people.
2. 1.2 = 1 + 0.20 :: Each year: up 20%.
3. Starts at 300, grows 20% a year
```

```more
An **exponential** function multiplies by the same number each step, so it grows faster and faster. A linear function adds the same amount each step. A multiplier of 1.2 = 1 + 0.20 means up 20%. A multiplier of 0.8 = 1 − 0.20 means down 20%.
```

## Build the function

```quiz
A club has 200 members. Each year it has 5% more than the year before. Which function gives its members after x years?
- 200(0.05)^x :: That keeps only 5% each year. Growth is 1 + 0.05.
* 200(1.05)^x
- 1.05(200)^x :: Swapped: the start goes in front, the factor is the base.
- 200 + 10x :: That adds 10 every year. 5% of a growing club keeps growing.
> Start: a = 200. Up 5% means multiply by 1.05 each year, so b = 1.05.
```

## Read a table

```quiz
For f(x) = a · b^x, the table gives f(0) = 5, f(1) = 15 and f(2) = 45. What is the value of b?
answer: 3
- 10 :: That is 15 − 5. b multiplies, so divide.
- 5 :: That is a = f(0), the start.
> Each step multiplies by b: b = f(1) ÷ f(0) = 15 ÷ 5 = 3. Check: 15 × 3 = 45.
```

# Exponent x/k
b multiplies once every k units.

## Every k units

With exponent **x/k**, b multiplies once every k units of x.

```visual
nonlinear-functions--timeline
```

```example
A dish has P = 400(2)^(x/3) cells after x hours. How many after 6 hours?
1. x/3 = 1 when x = 3 :: Doubles every 3 hours.
2. x = 6 → exponent 6/3 = 2 :: Two doublings.
3. 400 · 2² = 1,600 cells
```

```more
The **period** is how many units of x one step takes. In the exponent x/3, the period is 3: the exponent goes up by 1 each time x goes up by 3. So a multiplier b is applied once every 3 hours. If the exponent were x/12, it would be applied once every 12 months.
```

## Read the period

```quiz
A laptop's value, in dollars, after x months is V = 900(0.8)^(x/12). Which is true?
- It loses 80% of its value every 12 months. :: 0.8 is the part kept. The part lost is 20%.
- It loses 20% of its value every month. :: The exponent reaches 1 only when x = 12.
* It loses 20% of its value every 12 months.
> The base 0.8 keeps 80%, so it loses 20%. The exponent x/12 steps once every 12 months.
~ type y=900(0.8)^{\frac{x}{12}} :: Type it as it is.
~ zoom -3 27 -100 1000 :: Months across, dollars up.
~ point (0, 900) :: Starts at 900.
~ point (12, 720) :: At 12 months: 720 = 80% of 900. Lost 20%.
```

# Trap: several periods
Multiply the factors. Do not add the percents.

## 44%, not 40%

Over several periods, multiply the multiplier each time. Do not add percents.

```example
P = 27(1.2)^(x/3). By what percent does P increase every 6 units of x?
1. 6 ÷ 3 = 2 periods :: The exponent x/3 goes up by 2.
2. 1.2² = 1.44 :: Multiply 1.2 twice.
3. 1.44 − 1 = 0.44, so 44% :: Not 20% + 20% = 40%.
```

```more
Each period multiplies by 1.2. After two periods the multiplier is 1.2 × 1.2 = 1.44. The increase is 1.44 − 1 = 0.44, which is 44%. Adding 20% + 20% = 40% is wrong, because the second 20% is taken of a bigger amount than the first.
```

## Two periods

```quiz
The function f(x) = 200(1.1)^(x/5) models an amount after x days. By what percent does the amount increase every 10 days?
answer: 21
- 20 :: Trap: you added 10% + 10%. Multiply 1.1 × 1.1.
- 121 :: That is 1.21 as a percent. Subtract the 100%.
> 10 days is 2 periods of 5 days: 1.1² = 1.21. The increase is 21%.
~ type y=200(1.1)^{\frac{x}{5}} :: Type it as it is.
~ zoom -3 25 -50 400
~ point (0, 200) :: Starts at 200.
~ point (10, 242) :: At 10 days: 242 = 1.21 × 200. Up 21%.
```

# Inside shifts
f(x + 3) moves the graph 3 left.

## Shifts go backward

**f(x + 2)** moves the graph 2 **left**, not right. Desmos shows it.

```desmos
f(x) = (x − 6)² + 1 and g(x) = f(x + 2). For what value of x does g(x) reach its minimum?
type f(x)=(x-6)^{2}+1 :: Type f by its name.
type g(x)=f(x+2) :: Then g, exactly as given.
zoom -2 12 -3 12
point (4, 1) :: g's lowest point: x = 4. That is 2 left of 6.
```

```more
In g(x) = f(x + 2), g puts the number x + 2 into f. f is lowest when its input is 6. So g is lowest when x + 2 = 6, that is x = 4. The graph of g is the graph of f moved 2 units to the left. A plus inside means left; a minus inside means right.
```

## Left or right?

```quiz
f(x) = (x − 4)² + 2
The function g is defined by g(x) = f(x + 3). For what value of x does g(x) reach its minimum?
answer: 1
- 7 :: Trap: + 3 inside moves left. Solve x + 3 = 4.
- 4 :: That is where f is smallest. g's graph sits 3 left.
> f is smallest when its input is 4. For g the input is x + 3, so x + 3 = 4 and x = 1.
~ type f(x)=(x-4)^{2}+2 :: Type f by its name.
~ type g(x)=f(x+3) :: Then g, exactly as given.
~ zoom -4 10 -2 12
~ point (1, 2) :: Click g's lowest point: x = 1.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

x² is (x − 0)². Read k.

```check
m-0143
```

## Your turn: medium

The base 0.64 is the part kept each year.

```check
m-0208
```

## Your turn: hard

Find f's vertex. Then solve x + 5 = that x.

```check
m-0096
```
