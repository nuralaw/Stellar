---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read a parabola's vertex and an exponential's start and factor from the formula.
---

## Read the vertex (h, k)

**y = a(x − h)² + k** is a parabola with vertex (h, k): its maximum if a < 0, its minimum if a > 0.

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
* −7
- −4 :: That's h: where the minimum is, not its value.
- 7 :: Only the inside sign flips. Outside, k stays −7.
> Vertex (−4, −7), and a = 2 > 0 opens up. The lowest value is k = −7.
```

## Standard form: x = −b/(2a)

In **ax² + bx + c**, the vertex is at **x = −b/(2a)**. Plug it in for the value.

```quiz
f(x) = 2x² − 12x + 7. What is the minimum value of f?
* −11
- 3 :: That's x = −b/(2a). Plug it in for the value.
- 7 :: That's f(0), the y-intercept. The vertex is at x = 3.
- 61 :: You used x = −3. Here −b/(2a) = +3.
> x = −(−12)/(2 · 2) = 3. Then f(3) = 18 − 36 + 7 = −11.
```

## Exponential: start and factor

In **a · b^x**, a is the start and b multiplies it each step. Up 5% means b = 1.05.

```quiz
A club has 200 members. Each year it has 5% more than the year before. Which function gives its members after x years?
* 200(1.05)^x
- 200(0.05)^x :: That keeps only 5% each year. Growth is 1 + 0.05.
- 1.05(200)^x :: Swapped: the start goes in front, the factor is the base.
- 200 + 10x :: That adds 10 every year. 5% of a growing club keeps growing.
> Start: a = 200. Up 5% means multiply by 1.05 each year, so b = 1.05.
```

## Exponent x/k: every k units

With exponent **x/k**, b multiplies once every k units of x.

```quiz
A laptop's value, in dollars, after x months is V = 900(0.8)^(x/12). Which is true?
* It loses 20% of its value every 12 months.
- It loses 80% of its value every 12 months. :: 0.8 is the part kept. The part lost is 20%.
- It loses 20% of its value every month. :: The exponent reaches 1 only when x = 12.
> Factor 0.8: keeps 80%, loses 20%. Exponent x/12: once every 12 months.
```

## Trap: inside shifts go backward

**f(x + 3)** moves the graph 3 **left**, not right.

```quiz
f(x) = (x − 4)² + 2 and g(x) = f(x + 3). For what value of x does g(x) reach its minimum?
* 1
- 7 :: Trap: + 3 inside moves left. Solve x + 3 = 4.
- 4 :: That's where f is smallest. g's graph sits 3 left.
> f is smallest when its input is 4. For g the input is x + 3, so x = 1.
```

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

## Recap

- Vertex form: vertex (h, k). Value k, at x = h.
- a · b^x: start a, factor b; x/k: every k units.
- f(x + 3): graph moves 3 left.
