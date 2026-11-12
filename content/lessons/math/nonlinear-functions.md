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

## Value or location?

The minimum **value** is k. **Where** it happens is h.

```quiz
f(x) = 2(x + 4)² − 7. What is the minimum value of f?
- −4 :: That's h: where the minimum is, not its value.
* −7
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

## Find the minimum

```quiz
f(x) = 2x² − 12x + 7. What is the minimum value of f?
- 3 :: That's x = −b/(2a). Plug it in for the value.
- 7 :: That's f(0), the y-intercept. The vertex is at x = 3.
* −11
- 61 :: You used x = −3. Here −b/(2a) = +3.
> x = −(−12)/(2 · 2) = 3. Then f(3) = 18 − 36 + 7 = −11.
~ type y=2x^{2}-12x+7 :: No formula needed: graph it.
~ zoom -4 10 -15 15 :: Zoom out until you see the bottom.
~ point (3, -11) :: Click the lowest point. Its y is −11.
```

# Exponential: start and factor
In a · b^x: a starts, b multiplies.

## Read a and b

In **a · b^x**, a is the start and b multiplies it each step.

```example
A town's population after x years is P = 300(1.2)^x. What do 300 and 1.2 mean?
1. x = 0 → P = 300 :: The start: 300 people.
2. 1.2 = 1 + 0.20 :: Each year: up 20%.
3. Starts at 300, grows 20% a year
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

# Exponent x/k
b multiplies once every k units.

## Every k units

With exponent **x/k**, b multiplies once every k units of x.

```example
A dish has P = 400(2)^(x/3) cells after x hours. How many after 6 hours?
1. x/3 = 1 when x = 3 :: Doubles every 3 hours.
2. x = 6 → exponent 6/3 = 2 :: Two doublings.
3. 400 · 2² = 1,600 cells
```

## Read the period

```quiz
A laptop's value, in dollars, after x months is V = 900(0.8)^(x/12). Which is true?
- It loses 80% of its value every 12 months. :: 0.8 is the part kept. The part lost is 20%.
- It loses 20% of its value every month. :: The exponent reaches 1 only when x = 12.
* It loses 20% of its value every 12 months.
> Factor 0.8: keeps 80%, loses 20%. Exponent x/12: once every 12 months.
~ type y=900(0.8)^{\frac{x}{12}} :: Type it as it is.
~ zoom -3 27 -100 1000 :: Months across, dollars up.
~ point (0, 900) :: Starts at 900.
~ point (12, 720) :: At 12 months: 720 = 80% of 900. Lost 20%.
```

# Trap: inside shifts
f(x + 3) moves the graph 3 left.

## Shifts go backward

**f(x + 2)** moves the graph 2 **left**, not right. Desmos shows it.

```desmos
f(x) = (x − 6)² + 1 and g(x) = f(x + 2). For what value of x does g(x) reach its minimum?
type f(x)=(x-6)^{2}+1 :: Type f by its name.
type g(x)=f(x+2) :: Then g, exactly as given.
zoom -2 12 -3 12
point (4, 1) :: g's lowest point: x = 4. That's 2 left of 6.
```

## Left or right?

```quiz
f(x) = (x − 4)² + 2 and g(x) = f(x + 3). For what value of x does g(x) reach its minimum?
* 1
- 7 :: Trap: + 3 inside moves left. Solve x + 3 = 4.
- 4 :: That's where f is smallest. g's graph sits 3 left.
> f is smallest when its input is 4. For g the input is x + 3, so x = 1.
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

Factor first, then the period.

```check
m-0208
```

## Your turn: hard

Find f's vertex. Then solve x + 5 = that x.

```check
m-0096
```
