---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read quadratic and exponential functions: start value and factor, vertex and zeros, maximum or minimum, and graph shifts.
---

## Spot it: name the family first

A **nonlinear** function's graph isn't a straight line. On the SAT it's usually one of two families:

- **Quadratic:** x² is the highest power. The graph is a U-shaped curve called a **parabola**.
- **Exponential:** x sits in the **exponent**, like 3(2)^x. Each step multiplies by the same number.

Name the family first; it tells you which rules apply.

```quiz
Which function is exponential?
- f(x) = 5x² :: Here x is the base, squared. That's a quadratic.
- f(x) = (x + 5)(x − 2) :: Multiply it out and you get an x² term, so it's a quadratic.
* f(x) = 5(2)^x
- f(x) = 5x + 2 :: That's linear: it adds 5 each step instead of multiplying.
> In 5(2)^x the variable is in the exponent, so each time x goes up by 1 the output doubles: 5, 10, 20, 40.
```

## Exponential: start value and factor

In **f(t) = a · b^t**, **a** is the start value, f(0), and **b** is the factor you multiply by each time unit.

| Words | Factor b |
|---|---|
| grows 6% | 1.06 |
| shrinks 6% | 0.94 |
| doubles | 2 |
| halves | 0.5 |

If b is above 1, it's growth; between 0 and 1, decay. A factor of 0.94 means you **keep** 94% and lose 6%.

```quiz
A town's population t years from now is modeled by P(t) = 8,000(0.95)^t. What does 0.95 mean?
- The population drops by 95% each year. :: 0.95 is the part kept, 95%. The part lost is 5%.
- The population grows by 95% each year. :: A factor below 1 means decay. Growth needs b above 1.
* The population drops by 5% each year.
- The population drops by 0.95 people each year. :: That's linear thinking. A factor multiplies; it doesn't subtract.
> Each year P is multiplied by 0.95: the town keeps 95% and loses 100% − 95% = 5%. The 8,000 is today's population, P(0).
```

## Exponent t/k: once every k units

When the exponent is **t/k**, the factor is applied once every k units of t, because t/k only reaches 1 when t = k.

- triples every 4 years: 3^(t/4)
- grows 10% every 2 years: 1.1^(t/2)

Read the factor first (what is gained or lost), then the period (how often).

```quiz
The amount of a medicine in the blood, in milligrams, t hours after a dose is M(t) = 1,200(0.5)^(t/8). Which statement is true?
- Half of the medicine is left after every hour. :: That ignores the /8. The exponent reaches 1 only at t = 8.
* Half of the medicine is left after every 8 hours.
- The amount drops by 0.5 mg every 8 hours. :: A factor multiplies; it doesn't subtract. 0.5 means half is left.
- The amount drops by 8% each hour. :: 8 is the period in hours, not a percent.
> The factor 0.5 means half is left. The exponent t/8 means that happens once every 8 hours.
> Check: M(0) = 1,200, M(8) = 600, M(16) = 300.
```

## Vertex form: maximum or minimum

**y = a(x − h)² + k** has its vertex at **(h, k)**.

- a > 0: opens up, so k is the **minimum** value.
- a < 0: opens down, so k is the **maximum** value.

The max or min **value** is k, a y-value. **When** or **where** it happens is h, an x-value. Both numbers usually appear in the choices.

```quiz
A ball's height, in meters, t seconds after it is thrown is h(t) = −5(t − 3)² + 50. What is the ball's maximum height?
- 3 :: That's when the ball is highest, t = 3, not how high it gets.
- 5 :: That's h(0), the height when it was thrown: −5(9) + 50 = 5.
* 50
> a = −5 is negative, so the parabola opens down and the vertex (3, 50) is the top. The maximum height is k = 50 meters, reached at t = 3 seconds.
```

## Factored form: zeros, vertex halfway

**y = a(x − p)(x − q)** shows the **zeros** p and q: the x-values where y = 0, which are the x-intercepts.

A parabola is symmetric, so its vertex sits **halfway** between the zeros, at x = (p + q)/2. Plug that x back in for the maximum or minimum value.

```quiz
A theater's daily profit, in dollars, at a ticket price of x dollars is P(x) = −3(x − 20)(x − 60). What is the maximum daily profit?
- 40 :: That's the best ticket price, the x of the vertex. The question asks for the profit.
- 400 :: You dropped the 3: −(20)(−20) = 400. Keep a.
* 1,200
- −3,600 :: That's P(0), the y-intercept: the profit at a $0 price, not the top of the graph.
> The zeros are 20 and 60, and a = −3 makes the parabola open down, so the vertex is the maximum.
> Halfway: x = (20 + 60)/2 = 40. Then P(40) = −3(20)(−20) = 1,200.
```

## Standard form: −b/(2a) or Desmos

**y = ax² + bx + c** shows the **y-intercept**, (0, c). The vertex is at **x = −b/(2a)**; plug that x in for the y-value.

Faster with messy numbers: type the function in Desmos, like `y=2x^2-12x+7`, click the curve, then click the gray dot at the vertex to read its coordinates.

```quiz
f(x) = 2x² − 12x + 7. What is the minimum value of f?
- 3 :: That's where the minimum happens, x = 3. Plug it in for the value.
- 7 :: That's f(0), the y-intercept. The vertex isn't on the y-axis here.
* −11
- 61 :: You used x = −3. −b/(2a) = −(−12)/(2 · 2) = +3.
> a = 2 is positive, so the vertex is a minimum. x = −(−12)/(2 · 2) = 3, and f(3) = 2(9) − 36 + 7 = −11.
```

## Shifts: inside moves the opposite way

| Change | Graph moves |
|---|---|
| f(x) + k | up k |
| f(x) − k | down k |
| f(x − h) | **right** h |
| f(x + h) | **left** h |

Outside changes move the way they look; inside changes move the **opposite** way. Not sure? Plug in: if g(x) = f(x − 3), then g(5) = f(2). What f does at 2, g does at 5: 3 units right.

```quiz
The minimum of f is at the point (4, −1). The function g is defined by g(x) = f(x + 2) + 5. Where is the minimum of g?
- (6, 4) :: + 2 inside moves the graph left, not right.
- (2, −6) :: + 5 outside moves the graph up, so −1 becomes 4.
* (2, 4)
- (6, −6) :: Both moves went the wrong way.
> Inside + 2: left 2, so x goes from 4 to 2. Outside + 5: up 5, so y goes from −1 to 4.
> Check: g(2) = f(2 + 2) + 5 = f(4) + 5 = −1 + 5 = 4.
```

## The trap: signs in vertex form

Vertex form uses **x − h**, so the sign inside flips when you read h: (x + 5)² means h = −5. The k outside keeps its sign.

```quiz
What is the vertex of the graph of y = 2(x + 3)² − 5?
- (3, −5) :: Trap. x + 3 is x − (−3), so h = −3, not 3.
* (−3, −5)
- (−3, 5) :: The k outside keeps its sign: −5.
- (3, 5) :: Both signs are off. The inside sign flips (h = −3); the outside one stays (k = −5).
> Write x + 3 as x − (−3): h = −3 and k = −5. Check: y is smallest when x + 3 = 0, at x = −3, and then y = −5.
```

## Your turn: easy

The minimum value is a y-value. Think vertex form.

```check
m-0143
```

## Your turn: medium

Read the factor, then the period in the exponent.

```check
m-0208
```

## Your turn: hard

Find the vertex of f first, then apply the inside change.

```check
m-0096
```

## Recap

- Name the family: x² means quadratic; x in the exponent means exponential.
- In a · b^t, a is the start and b the factor; t/k means once every k units.
- A max or min value is a y-value (k); "when" or "where" is an x-value (h).
- Vertex form shows (h, k); flip the inside sign. Factored form shows the zeros; the vertex is halfway.
- Standard form: the vertex is at x = −b/(2a), or click it in Desmos.
- Shifts: outside moves as it looks, inside moves the opposite way.
