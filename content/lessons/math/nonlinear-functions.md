---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read quadratic and exponential functions from equations, graphs and stories, including shifts and what each number in a model means.
minutes: 15
---

> **Key idea:** Name the family first, then use the form that shows what you need: vertex form for a max or min, factored form for the zeros, and a · b^t for the start value and the growth factor.

## What this question looks like

A nonlinear function is any function whose graph isn't a straight line. On the SAT it's almost always a **quadratic** (a U-shaped graph called a parabola) or an **exponential** (a curve that rises or falls faster and faster). Now and then you'll see a factored polynomial or a simple rational function (a fraction with x in the bottom).

Typical things on screen:

- An equation such as `f(x) = −3(x − 2)² + 9` or `P(t) = 500(1.04)^t`
- "What is the minimum value of f?" or "What is the y-intercept of the graph?"
- "Which of the following best describes the meaning of 0.85 in this model?"
- "Which equivalent form shows the x-intercepts as constants?"
- `g(x) = f(x + 3) − 2`, with "How does the graph of g compare to the graph of f?"
- A graph, a table of values, or a story: a ball's height, a population, a car losing value

Advanced Math is about 35% of the Math section (around 13–15 questions), and nonlinear functions are a big part of it. They appear in both modules, from easy "plug in x = 2" questions to hard "find the constant" ones.

## The method

1. **Name the family.** x squared means quadratic. The variable in the exponent means exponential. Factored pieces or a fraction mean polynomial or rational.
2. **Pin down the target.** The x-value of the vertex, or the minimum *value* (a y-value)? The starting amount, or the percent change?
3. **Pick the form that shows the answer.** Each quadratic form shows a different feature (see the table below). If the one you need isn't visible, rewrite the function or graph it.
4. **Turn words into numbers.** "Increases by 6%" means multiply by 1.06. "Every 5 years" means the exponent is t/5. "Vertex at (4, −1)" means `a(x − 4)² − 1`.
5. **Solve by hand if it's quick, in Desmos if it isn't.** Graphing is often the fastest safe route to vertices, zeros and crossings.
6. **Check against the question.** Did you give a y-value when they wanted one? Does your model give the start amount at t = 0?

## Rules and formulas you need

### The three forms of a quadratic

| Form | Looks like | What it shows |
|---|---|---|
| Standard | `y = ax² + bx + c` | y-intercept (0, c); axis x = −b/(2a) |
| Vertex | `y = a(x − h)² + k` | vertex (h, k); min or max value k, at x = h |
| Factored | `y = a(x − p)(x − q)` | zeros p and q; vertex x = (p + q)/2 |

In every form, the sign of a sets the direction. If a > 0 the parabola opens up and the vertex is a **minimum**; if a < 0 it opens down and the vertex is a maximum. The farther a is from 0, the narrower the parabola.

More quadratic facts to know cold:

- **Vertex x-coordinate:** x = −b/(2a). Plug that x back in to get the y-coordinate.
- **Symmetry:** two points with the same output sit the same distance from the axis. If f(1) = f(9), the axis is x = 5.
- **Discriminant:** `b² − 4ac`. Positive means 2 real zeros, zero means exactly 1 (the vertex touches the x-axis), negative means none.
- **Sum and product of zeros:** for `ax² + bx + c`, the zeros add to −b/a and multiply to c/a.

### Exponential models

| Model | What each part means |
|---|---|
| `f(t) = a · b^t` | start at a = f(0); multiply by b each time unit |
| `f(t) = a(1 + r)^t` | grow by r (as a decimal) each time unit |
| `f(t) = a(1 − r)^t` | shrink by r each time unit |
| `f(t) = a · b^(t/k)` | multiply by b once every k time units |

- b > 1 means growth; 0 < b < 1 means decay.
- **Percent to factor:** +8% → 1.08, −8% → 0.92, +0.5% → 1.005, "doubles" → 2, "halves" or "half-life" → 1/2.
- **Factor to percent:** 1.35 means +35%. 0.35 means −65%, because you keep 35%.
- **Linear or exponential in a table?** Equal differences (add the same amount) mean linear. Equal ratios (multiply by the same amount) mean exponential.
- **The graph:** a · b^t crosses the y-axis at a and levels off toward the line y = 0. For a · b^t + d, it levels off toward y = d instead.

### Transformations (moving a graph)

| New function | What happens to the graph of f |
|---|---|
| `f(x) + k` | up k |
| `f(x) − k` | down k |
| `f(x − h)` | right h |
| `f(x + h)` | left h |
| `−f(x)` | flips over the x-axis |
| `f(−x)` | flips over the y-axis |
| `c · f(x)` | stretches vertically by c (squashes if 0 < c < 1) |

Changes *inside* the parentheses act on x and move the opposite way you'd expect, so `f(x + 3)` moves the graph left 3. Changes *outside* act on y and move the way they look.

Every point moves together. If f has its vertex at (2, 5), then `f(x − 4) + 1` has its vertex at (6, 6).

### Polynomials, rational functions and notation

- **Polynomial zeros:** `p(x) = (x − 1)(x + 4)²` has zeros 1 and −4. A squared factor means the graph touches the x-axis and turns around there instead of crossing.
- **Factor theorem:** if p(3) = 0, then (x − 3) is a factor, and the graph meets the x-axis at (3, 0).
- **Rational functions:** `f(x) = 5/(x − 2)` is undefined at x = 2, because you can't divide by zero. Such x-values are not in the domain.
- **Function notation:** f(4) means "put in 4 for x." f(x) = 4 means "find the x that makes the output 4."
- **Composition:** f(g(2)) works from the inside out. Find g(2) first, then put that answer into f.

## Worked examples

### Example 1: Maximum profit

A theater's daily profit P, in dollars, is modeled by `P(x) = −2(x − 10)(x − 50)`, where x is the ticket price in dollars and 10 ≤ x ≤ 50. What is the theater's maximum daily profit, in dollars?

- (A) 30
- (B) 400
- (C) 800
- (D) 1,000

**Solution**

The function is a quadratic in factored form, and a = −2 is negative, so the parabola opens down and the vertex is a maximum. The question asks for the maximum *profit*, which is the y-value of the vertex.

The zeros are 10 and 50, so the vertex is halfway between them: x = (10 + 50)/2 = 30. Plug in: P(30) = −2(30 − 10)(30 − 50) = −2(20)(−20) = 800.

Why the others are wrong: (A) 30 is the ticket price that gives the maximum, not the profit itself. (B) 400 comes from dropping the 2 and using only the minus sign: −(20)(−20) = 400. (D) 1,000 is the size of P(0) = −1,000, the y-intercept, which isn't even a price the model allows.

**Answer:** (C)

### Example 2: Reading an exponential model

The area A, in square meters, covered by a plant on a pond is modeled by `A(t) = 40(1.5)^(t/4)`, where t is the number of days since the area was first measured. Which statement is the best interpretation of the model?

- (A) The area increases by 50% each day.
- (B) The area increases by 50% every 4 days.
- (C) The area increases by 150% every 4 days.
- (D) The area increases by 40% every 4 days.

**Solution**

Match the parts to `a · b^(t/k)`: a = 40 is the starting area, b = 1.5 is the factor, and k = 4 is how often you multiply by it. The exponent t/4 goes up by 1 each time t goes up by 4, so the area is multiplied by 1.5 once every 4 days. A factor of 1.5 means the new amount is 150% of the old one, which is an increase of 50%.

Check: A(0) = 40 and A(4) = 40 × 1.5 = 60. From 40 to 60 is up 20, and 20 is 50% of 40.

Why the others are wrong: (A) ignores the /4 in the exponent. (C) mixes up "150% of" with "increases by 150%" (that would be a factor of 2.5). (D) uses the starting value 40 as if it were the rate.

**Answer:** (B)

### Example 3: Shifting a parabola (student-produced response)

The function f is defined by `f(x) = x² − 6x + 5`. The function g is defined by `g(x) = f(x + 4) − 3`. The graph of y = g(x) in the xy-plane has its vertex at (h, k). What is the value of h + k?

**Solution**

First find the vertex of f. Here a = 1 and b = −6, so x = −(−6)/(2 · 1) = 3. Then f(3) = 9 − 18 + 5 = −4. The vertex of f is (3, −4).

Now apply the shifts. The `+ 4` is inside, so it moves the graph **left** 4: x goes from 3 to −1. The `− 3` is outside, so it moves the graph down 3: y goes from −4 to −7. The vertex of g is (−1, −7).

Check by expanding: `g(x) = (x + 4)² − 6(x + 4) + 5 − 3 = x² + 2x − 6`. Its vertex x is −2/(2 · 1) = −1, and g(−1) = 1 − 2 − 6 = −7. It matches.

So h + k = −1 + (−7) = −8. (If you shifted right by mistake, you'd get (7, −7) and an answer of 0.)

**Answer:** −8

### Example 4: Building a decay model (student-produced response)

A machine loses value by the same percentage each year. It was worth $12,000 when it was new and $7,680 two years later. To the nearest dollar, what is the machine worth 3 years after it was new?

**Solution**

"Same percentage each year" means exponential: `V(t) = 12000 · b^t`. Use the second fact: 12000 · b² = 7680, so b² = 7680/12000 = 0.64, and b = 0.8. (We take the positive root because a value can't flip sign.) The machine keeps 80% of its value each year, which is a 20% loss per year.

After 3 years: V(3) = 12000 · 0.8³ = 12000 · 0.512 = 6,144.

The trap answer is a straight-line guess. The machine lost $4,320 over 2 years, or $2,160 per year, and assuming the same dollar loss each year gives $5,520. That would be linear, but the question says "same percentage," so it's exponential.

**Answer:** 6144

## Traps to avoid

- **Giving x when they asked for y.** "Minimum value" and "maximum height" are y-values (k in vertex form). "When" or "at what time" asks for x (h). Example 1 puts both in the choices.
- **Sign mix-up in vertex form.** `y = (x + 5)² − 2` has its vertex at (−5, −2), not (5, −2). The form is x *minus* h, so x + 5 means h = −5.
- **Shifting the wrong way.** `f(x − 2)` moves right and `f(x + 2)` moves left. Only changes outside the parentheses move the way they look.
- **Using the rate instead of the factor.** A 7% increase is 1.07, not 0.07 or 7. A 30% decrease is 0.70, because you keep 70%.
- **"Decreases by 80%" vs "decreases to 80%".** The first is a factor of 0.2; the second is 0.8.
- **Getting the period backwards.** "Triples every 5 years" is `3^(t/5)`, not `3^(5t)` and not `5^(t/3)`.
- **Swapping the start value and the base.** `200(3)^t` starts at 200 and triples. `3(200)^t` starts at 3 and multiplies by 200.
- **Assuming linear change.** "Same percent" or "doubles" means exponential, even when two data points make a straight-line guess look tempting.
- **Dropping a when converting forms.** `2(x − 3)² + 5` and `(x − 3)² + 5` share a vertex but are different functions.
- **Mixing up f(4) and f(x) = 4.** One gives you an output; the other asks for an input.

## Desmos shortcut

Desmos saves real time on this skill, because the graph shows vertices, zeros and crossings directly.

### Read key points off the graph

1. Type the function, for example `y = -2(x - 10)(x - 50)`.
2. Click the curve. Gray dots appear at the vertex, the x-intercepts and the y-intercept.
3. Click a dot to see its coordinates.

This answers most vertex, zero and max/min questions in seconds. When values are large (like 800), zoom out or set the window with the wrench.

### Other quick moves

- **Function notation:** type `f(x) = x^2 - 6x + 5`, then `g(x) = f(x + 4) - 3` on the next line. Desmos graphs g, and you can click its vertex.
- **Values:** type `f(3)` or `f(g(2))` to get a number.
- **Equivalent forms:** put the given function on line 1 and a choice on line 2. The right choice lands exactly on top; a wrong one shows up as a second curve.
- **Solving f(x) = a number:** for `500(1.04)^t = 800`, graph `y = 500(1.04)^x` and `y = 800`, then click where they cross.
- **Unknown constants:** type `y = a(x - 3)^2 + 1` and add the slider Desmos offers. Drag until the graph passes through the given point, then confirm the exact value with algebra.

### Regression from data

1. Add a table (the + button, then "table") and enter the points, such as (0, 12000) and (2, 7680).
2. On the next line type `y_1 ~ ab^(x_1)`. Desmos reports a = 12000 and b = 0.8.
3. For a quadratic through three points, use `y_1 ~ ax_1^2 + bx_1 + c` instead.

> **Tip:** Gray dots show decimals. If the choices use exact forms like 3 ± √2, compare decimals (3 + √2 ≈ 4.414) or use the algebra rules above.

> **Trap:** Desmos shows *where* things are, not what they *mean*. On "what does 0.85 represent?" questions you still need the rules: 0.85 is the factor, so the amount drops by 15% each time unit.

## Quick checklist

- Did I name the family: quadratic, exponential, polynomial or rational?
- Am I answering for x or for y (where the vertex is, or the min/max value)?
- Did I use the form that shows the feature, or graph it in Desmos?
- For exponentials: is my factor 1 + r or 1 − r, and does the exponent match the time period (t/k)?
- For shifts: did I move inside changes the opposite way?
- Does my model give the right starting value at t = 0 (or pass through the given point)?
