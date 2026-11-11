---
title: Nonlinear Functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read and use quadratic, exponential, polynomial and rational functions, including their graphs, shifts and meaning in a real situation.
minutes: 14
---

## What this question looks like

A "nonlinear function" is any function whose graph is not a straight line. On the Digital SAT that almost always means a **quadratic** (graph is a U-shaped parabola) or an **exponential** (graph that curves up or down faster and faster). Sometimes you'll see a polynomial in factored form or a simple rational function (a fraction with x in the bottom).

You're probably looking at this skill when you see things like:

- an equation such as `f(x) = −3(x − 2)² + 9` or `P(t) = 500(1.04)^t`
- "What is the minimum value of f?" or "What is the y-intercept of the graph?"
- "Which of the following best describes the meaning of 0.85 in this model?"
- "Which equivalent form shows the x-intercepts as constants?"
- a graph, a table of values, or a story (a ball's height, a population, a car losing value)
- `g(x) = f(x + 3) − 2`: "How does the graph of g compare to the graph of f?"

Advanced Math is about 35% of the Math section (around 13–15 questions), and nonlinear functions are a big part of it. They show up in both modules, from easy "plug in x = 2" questions to hard "find the constant" questions.

## The method

Use this routine on every question:

1. **Name the family.** Is x squared (quadratic), is the variable in the exponent (exponential), or is it factored pieces or a fraction (polynomial or rational)? The family tells you which facts apply.
2. **Find out exactly what they're asking.** Underline the target: the *x*-value of the vertex, or the minimum *value* (a y-value)? The starting amount, or the percent change? Many wrong answers are the right number for a different question.
3. **Pick the form that shows the answer.** Each form of a quadratic shows a different feature (see the table below). Exponential models show the start value and the growth factor. If the needed feature isn't visible, rewrite it or graph it.
4. **Translate words into numbers.** "Increases by 6%" means multiply by 1.06. "Every 5 years" means the exponent is t/5. "Vertex at (4, −1)" means `a(x − 4)² − 1`.
5. **Solve: by hand if it's quick, in Desmos if it isn't.** Graphing is often the fastest safe route for vertices, zeros and intersections.
6. **Check against the question and the choices.** Did you give the y-value when they wanted it? Does your model give the start amount at t = 0?

## Rules and formulas you need

### The three forms of a quadratic

| Form | Looks like | What you can read straight off it |
|---|---|---|
| Standard | `y = ax² + bx + c` | y-intercept is (0, c); axis of symmetry is x = −b/(2a) |
| Vertex | `y = a(x − h)² + k` | vertex is (h, k); min or max value is k, and it happens at x = h |
| Factored | `y = a(x − p)(x − q)` | x-intercepts (zeros) are p and q; vertex x is (p + q)/2 |

> **Key idea:** In all three forms, a tells you the direction. If a > 0 the parabola opens up and the vertex is a **minimum**. If a < 0 it opens down and the vertex is a **maximum**. A bigger |a| makes the parabola narrower.

More quadratic facts to know cold:

- **Vertex x-coordinate:** x = −b/(2a). Then plug that x back in to get the y-coordinate.
- **Symmetry:** the two zeros sit the same distance from the axis of symmetry. If f(1) = f(9), the axis is x = 5.
- **Discriminant:** `b² − 4ac`. Positive means 2 real zeros, zero means exactly 1 (the vertex touches the x-axis), and negative means no real zeros.
- **Sum and product of zeros:** for `ax² + bx + c`, the zeros add to −b/a and multiply to c/a.

### Exponential models

| Model | What each part means |
|---|---|
| `f(t) = a · b^t` | a is the starting amount, f(0); b is the factor you multiply by each time unit |
| `f(t) = a(1 + r)^t` | growth by r (as a decimal) each time unit |
| `f(t) = a(1 − r)^t` | decay by r each time unit |
| `f(t) = a · b^(t/k)` | multiply by b once every k time units |

- b > 1 means growth; 0 < b < 1 means decay.
- Percent to factor: +8% → 1.08, −8% → 0.92, +0.5% → 1.005, "doubles" → 2, "halves" or "half-life" → 1/2.
- Factor to percent: 1.35 means +35%, and 0.35 means −65% (you *keep* 35%).
- Linear vs exponential in a table: equal **differences** (add the same amount) means linear; equal **ratios** (multiply by the same amount) means exponential.
- The graph of `a · b^t` crosses the y-axis at a and flattens toward the line y = 0. If the model is `a · b^t + d`, it flattens toward y = d instead.

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

> **Trap:** Changes *inside* the parentheses act on x and go the opposite way you'd expect. `f(x + 3)` moves the graph **left** 3. Changes *outside* act on y and go the way they look.

Every point moves together. If f has its vertex at (2, 5), then `f(x − 4) + 1` has its vertex at (6, 6).

### Polynomials, rational functions and notation

- **Polynomial zeros:** if `p(x) = (x − 1)(x + 4)²`, the zeros are 1 and −4. A squared factor means the graph *touches* the x-axis and turns around there instead of crossing it.
- **Factor theorem:** if p(3) = 0, then (x − 3) is a factor, and the graph crosses the x-axis at (3, 0).
- **Rational functions:** `f(x) = 5/(x − 2)` is undefined at x = 2 (you can't divide by zero). Those x-values are not in the domain.
- **Function notation:** f(4) means "put 4 in for x." f(x) = 4 means "find the x that makes the output 4." Those are different questions.
- **Composition:** f(g(2)) means work from the inside out: find g(2) first, then put that answer into f.

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

- **Giving x when they asked for y.** "Minimum value" and "maximum height" are y-values (k in vertex form). "When" or "at what time" asks for x (h). Example 1 puts both in the choices on purpose.
- **Sign mix-up in vertex form.** `y = (x + 5)² − 2` has its vertex at (−5, −2), not (5, −2). The form is x *minus* h, so x + 5 means h = −5.
- **Shifting the wrong way.** `f(x − 2)` moves right, and `f(x + 2)` moves left. Only changes outside the parentheses move the way they look.
- **Using the rate instead of the factor.** A 7% increase is 1.07, not 0.07 or 7. A 30% *decrease* is 0.70, because you keep 70%.
- **"Decreases by 80%" vs "decreases to 80%".** The first is a factor of 0.2. The second is 0.8.
- **Getting the period backwards.** "Triples every 5 years" is `3^(t/5)`, not `3^(5t)` and not `5^(t/3)`.
- **Swapping the start value and the base.** `200(3)^t` starts at 200 and triples. `3(200)^t` starts at 3 and multiplies by 200. Choices often swap them.
- **Assuming linear change.** If the story says "same percent" or "doubles," it's exponential, even when two data points make a straight-line guess look tempting.
- **Forgetting a when converting forms.** `2(x − 3)² + 5` and `(x − 3)² + 5` have the same vertex but are different functions.
- **Mixing up f(4) and f(x) = 4.** One gives you an output; the other asks for an input.

## Desmos shortcut

Desmos is built into every Math question on the Digital SAT, and for this skill it's a real time-saver. These are the moves top scorers use most:

1. **Click the curve to read key points.** Type the function, for example `y = −2(x − 10)(x − 50)`, and click the graph. Desmos shows gray dots at the vertex, the x-intercepts and the y-intercept. Click a dot to see its coordinates. This answers most "vertex," "zeros" and "max/min" questions in seconds. You may need to zoom out (or use the wrench to change the window) when values are large, like 800.
2. **Use function notation directly.** Type `f(x) = x² − 6x + 5` on one line and `g(x) = f(x + 4) − 3` on the next. Desmos graphs g for you, and you can click its vertex. You can also type `f(3)` or `f(g(2))` to get a value.
3. **Overlay to test equivalent forms.** Put the given function on line 1 and each answer choice on the lines below. The right choice lands exactly on top of the original graph, while a wrong one shows up as a second curve.
4. **Solve f(x) = something by intersecting.** To solve `500(1.04)^t = 800`, graph `y = 500(1.04)^x` and `y = 800` and click where they cross.
5. **Use sliders for unknown constants.** Type `y = a(x − 3)² + 1` and Desmos offers to add a slider for a. Drag it until the graph passes through the given point, then confirm the exact value with algebra.
6. **Regression for models from data.** Make a table (the + button, then "table") with the points, such as (0, 12000) and (2, 7680). On the next line type `y₁ ~ a·b^(x₁)`. Desmos reports a = 12000 and b = 0.8. For a quadratic through three points, use `y₁ ~ a·x₁² + b·x₁ + c`.

> **Tip:** Gray dots give decimals. If the choices use exact forms like 3 ± √2, check the decimals against each choice (3 + √2 ≈ 4.414) or use the algebra rules above.

> **Trap:** Desmos tells you *where* things are, not what they *mean*. On "what does 0.85 represent?" questions, you still need the rules: 0.85 is the factor, so the amount drops by 15% each time unit.

## Quick checklist

- Did I name the family: quadratic, exponential, polynomial or rational?
- Am I answering for x or for y (the vertex location or the min/max value)?
- Did I use the form that shows the feature, or graph it in Desmos?
- For exponentials: is my factor 1 + r or 1 − r, and does the exponent match the time period (t/k)?
- For shifts: did I move inside changes the opposite way?
- Does my model give the right starting value at t = 0 (or the right point on the graph)?

## Sources

- [College Board: Advanced Math question types on the Digital SAT](https://satsuite.collegeboard.org/digital/whats-on-the-test/math/types/advanced)
- [College Board: Skills Insight for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [1600.io: Using regression to find both solutions to a quadratic](https://1600.io/courses/1698988/lectures/47466973)
- [The College Panda: SAT Function Transformations, The Definitive Guide](https://thecollegepanda.com/sat-function-transformations-definitive-guide/)
- [Test Ninjas: SAT Nonlinear Functions](https://www.test-ninjas.com/sat-nonlinear-functions)
- [Open Exam Prep: Quadratic forms and features](https://open-exam-prep.com/study-guides/sat-math/advanced-math-quadratics/quadratic-forms-features)
- [Open Exam Prep: Exponential growth and decay](https://open-exam-prep.com/study-guides/sat-math/advanced-math-functions/exponential-growth-decay)
- [The Test Advantage: SAT quadratic vertex form on Desmos, step by step](https://thetestadvantage.com/blog/sat-quadratic-vertex-form-on-desmos-may-2026-step-by-step)
- [Just Locked In: Identify exponential models](https://justlockedin-main.pages.dev/patterns/math/advanced-math/non-linear-functions/identify-models.html)
- [Just Locked In: Function transformations](https://justlockedin-main.pages.dev/patterns/math/advanced-math/non-linear-functions/function-transforms.html)
- [Larry Learns: SAT Advanced Math practice and common traps](https://www.larrylearns.com/blog/sat-advanced-math-practice)
- [Method Learning: The most common Digital SAT Math topics](https://www.methodlearning.com/blog/the-most-common-digital-sat-math-topics-part-1)
- [SAT Sphere: Exponential functions on the Digital SAT](https://www.satsphere.com/blog/exponential-functions-growth-and-decay-digital-sat)
- [Albert: Digital SAT Math review of exponential functions](https://www.albert.io/blog/?p=117759)
- [YouTube: Digital SAT Practice, Exponential Growth and Decay Word Problems](https://www.youtube.com/watch?v=Btk-1YErEFo)
- [YouTube: Solving the hardest SAT Math questions using only Desmos](https://www.youtube.com/watch?v=SAIZErXDrK0)
