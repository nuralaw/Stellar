---
title: Nonlinear functions
skill: nonlinear-functions
domain: advanced-math
section: math
summary: Read quadratic, exponential and polynomial functions in any form, shift their graphs, and explain what each number means in a real situation.
minutes: 26
---

## What this question looks like

A function is **nonlinear** when its graph is not a straight line. On the Digital SAT that mostly means **quadratics** (the graph is a U-shaped curve called a parabola) and **exponentials** (the output is multiplied by the same number at every step, so the graph curves up faster and faster, or drops and then levels off). You also meet **polynomials** with several zeros and, now and then, a square-root or fraction function.

What you see on screen is one of these:

- an equation, such as f(x) = −2(x − 3)² + 50 or V(t) = 24,000(0.81)^(t/2)
- a table of x and f(x) values
- a graph of the function
- a short story: the height of a thrown ball, the value of a car, a population, a company's revenue

Typical question stems:

- "What is the minimum value of f?" or "What is the y-intercept of the graph of y = f(x)?"
- "Which of the following equivalent forms of f(x) displays the maximum value of f as a constant or coefficient?"
- "Which statement is the best interpretation of 0.81 in this context?"
- "The function g is defined by g(x) = f(x + 3) − 2. What is the value of g(1)?"
- "Which of the following must be a factor of p(x)?"
- "Which equation models the population m months after the study began?"

The Math section has 44 questions, and Advanced Math is about 35% of them (13 to 15 questions). College Board does not publish a count for each skill, but this is the broadest of the three Advanced Math skills, so expect several questions on every test. Some are multiple choice and some are student-produced response (you type the answer). Inside each module the questions go from easier to harder, so the toughest function questions sit near the end of module 2.

The sub-types:

1. Quadratic features: vertex, zeros, y-intercept, maximum or minimum, symmetry.
2. Exponential models: starting value, growth or decay factor, percent change, changing the time unit.
3. Polynomials: zeros and factors.
4. Transformations: moving, flipping and stretching graphs.
5. Function notation and composition.
6. Models in context: what a number, a point or a part of the graph means.

## The method

1. **Name the family.** Is x squared, with no higher power? Quadratic. Is the variable in the exponent? Exponential. Several factors like (x − 1)(x + 4)(x − 6)? Polynomial. In stories, "height of a thrown ball", "area" or "price × number sold" point to a quadratic. "Percent per year", "doubles", "half-life" and "loses value at the same rate" point to an exponential.
2. **Circle the target and decide: input or output?** The input is x (a time, a price, a position). The output is f(x) (a height, a value, the maximum itself). The test almost always offers the right number for the other one as a wrong choice.
3. **Find the form that shows the target.** Each form of a function shows some features for free (see the tables below). If your form doesn't show the target, rewrite it or graph it.
4. **Translate the words into math.** "Grows 6% a year" means multiply by 1.06 each year. "Every 3 years" means the exponent is t/3. "Shifted 2 units left" means replace x with x + 2.
5. **Solve.** If the form shows the answer, just read it. If it doesn't, use Desmos: graph the function and click the gray points.
6. **Check against the question.** Input or output? Right units? Does your model give the starting value at t = 0? If a time or a length comes out negative, throw it out.

## Rules and formulas you need

### Quadratics: three forms, three features

| Form | Example | What it shows directly |
|---|---|---|
| Standard: y = ax² + bx + c | y = x² − 2x − 8 | the y-intercept (0, c) |
| Vertex: y = a(x − h)² + k | y = (x − 1)² − 9 | the vertex (h, k): the minimum or maximum value k, which happens at x = h |
| Factored: y = a(x − p)(x − q) | y = (x − 4)(x + 2) | the zeros (x-intercepts) p and q |

The three examples in the table are the same function written three ways.

> **Key idea:** The sign of a decides the shape. If a > 0, the parabola opens up and the vertex is the **minimum**. If a < 0, it opens down and the vertex is the **maximum**. The bigger the size of a (ignoring its sign), the narrower the parabola.

More facts to know cold:

- **Vertex from standard form:** x = −b/(2a). Put that x back into the function to get the y-value, which is the maximum or minimum value.
- **Signs in vertex form:** y = (x + 5)² − 2 has its vertex at (−5, −2), because x + 5 is the same as x − (−5).
- **Symmetry:** a parabola is a mirror image of itself across its axis, the vertical line through the vertex. Points at the same height are the same distance from the axis. If f(1) = f(9), the axis is x = 5. The vertex x-value is also the average of the two zeros.
- **Vertex plus one zero gives the other zero:** if the vertex is at x = 3 and one zero is at x = −2 (5 units to the left), the other zero is 5 units to the right, at x = 8.
- **How many x-intercepts, from vertex form:** y = a(x − h)² + k has two x-intercepts when a and k have opposite signs (for example, the vertex is below the x-axis and the parabola opens up), none when they have the same sign, and one when k = 0.

### Reading a, b and c from a graph

Some hard questions show a parabola and ask what must be true about a, b and c in y = ax² + bx + c.

- **a:** opens up means a > 0; opens down means a < 0.
- **c:** the y-intercept. If the graph crosses the y-axis above the x-axis, c > 0; below, c < 0.
- **b:** use x = −b/(2a). If the vertex is to the right of the y-axis, b and a have opposite signs. If it is to the left, they have the same sign. If the vertex is on the y-axis, b = 0.

### Exponential models

| Model | What the parts mean |
|---|---|
| f(t) = a × b^t | a is the starting value f(0), which is also the y-intercept; b is the factor you multiply by for each 1 unit of t |
| f(t) = a(1 + r)^t | grows by r (as a decimal) each unit: 6% growth gives 1.06 |
| f(t) = a(1 − r)^t | shrinks by r each unit: 6% decay gives 0.94 |
| f(t) = a × b^(t/k) | multiplied by b once every k units |

- b > 1 means growth. A b between 0 and 1 means decay.
- **Percent to factor:** up 8% → 1.08; down 8% → 0.92; up 0.5% → 1.005; up 150% → 2.5; doubles → 2; triples → 3; half-life → 0.5.
- **Factor to percent:** 1.35 means up 35%. 0.35 means down 65%: you keep 35% and lose 65%.
- **Model from two points:** f(0) gives a. Then divide to find b. If f(0) = 10 and f(2) = 90, then b² = 90/10 = 9, so b = 3 (b is always positive).
- **The graph** of a × b^x crosses the y-axis at a and flattens out toward the line y = 0 without ever touching it. For a × b^x + d, it flattens out toward y = d.
- **Largest or smallest value on a limited domain:** an exponential only goes up (growth) or only goes down (decay); it never turns around. So for x ≥ 0, a growing exponential has its **smallest** value at x = 0, and a decaying one has its **largest** value at x = 0. In the form a × b^x, that value is a. A question like "which form displays the maximum value for x ≥ 0 as a constant" about a decay model wants the form a × b^x.

### Changing the time unit

The exponent tells you how often the factor is applied.

| Words (t in years) | Model |
|---|---|
| grows 8% per year | a(1.08)^t |
| grows 8% per month | a(1.08)^(12t) |
| grows 8% every 3 years | a(1.08)^(t/3) |
| doubles every 5 years | a × 2^(t/5) |
| half is left every 30 years | a(0.5)^(t/30) |

- **Shorter period: take a root.** A yearly factor of 1.12 gives a monthly factor of (1.12)^(1/12) ≈ 1.0095. That is about 0.95% per month, **not** 1%.
- **New variable: substitute.** If m is the number of months, then t = m/12, so a(1.12)^t becomes a(1.12)^(m/12).
- **Percents multiply; they don't add.** Growing 10% two years in a row is 1.1 × 1.1 = 1.21, a 21% increase, not 20%. Going the other way, 21% every 2 years is exactly 10% per year, not 10.5%.

### Linear, exponential or quadratic? Read the table

Look at the outputs for inputs that are equally spaced:

- The same **difference** at each step (you add the same number): linear. Example: 5, 8, 11, 14.
- The same **ratio** at each step (you multiply by the same number): exponential. Example: 5, 10, 20, 40. A list like this is called a geometric sequence, and its nth term is 5 × 2^(n − 1): the first term times the ratio, n − 1 times.
- The differences themselves change by the same amount at each step, and the values often fall and rise again in a mirror pattern: quadratic. Example: 7, 4, 3, 4, 7 has differences −3, −1, 1, 3, which grow by 2 each time.

### Polynomials: zeros and factors

- **Factor theorem:** if p(a) = 0, then (x − a) is a factor of p(x), and the graph meets the x-axis at (a, 0). It works backward too: if (x − a) is a factor, then p(a) = 0.
- **From a table:** look for an output of 0. If p(−3) = 0, then x + 3 is a factor, because x − (−3) = x + 3.
- p(x) = (x − 2)(x + 5)² has zeros 2 and −5. A squared factor means the graph only touches the x-axis there and turns back.
- The y-intercept is p(0). For p(x) = (x − 2)(x + 5)², p(0) = (−2)(25) = −50.

### Transformations

| New function | What happens to the graph of f | A point (x, y) of f moves to |
|---|---|---|
| f(x) + k | moves up k units | (x, y + k) |
| f(x) − k | moves down k units | (x, y − k) |
| f(x − h) | moves right h units | (x + h, y) |
| f(x + h) | moves left h units | (x − h, y) |
| −f(x) | flips over the x-axis | (x, −y) |
| f(−x) | flips over the y-axis | (−x, y) |
| c × f(x), with c > 1 | stretches away from the x-axis | (x, cy) |

> **Remember:** Changes **outside** the parentheses act on y and move the way they look. Changes **inside** the parentheses act on x and move the opposite way.

Why do inside changes go "backward"? Take g(x) = f(x − 3). Whatever f does at x = 0, g does when x − 3 = 0, that is, at x = 3. Every point shows up 3 units later, so the graph moves **right**. The safe rule: set the inside equal to the old x-value and solve.

Two more facts:

- A sideways shift never changes the maximum or minimum **value**. An up-or-down shift never changes **where** (at which x) it happens.
- For exponentials, a sideways shift changes the starting value: 3 × 2^(x + 1) = 3 × 2 × 2^x = 6 × 2^x.

### Function notation and composition

- f(4) means "put 4 in for x." f(x) = 4 means "find the x that gives an output of 4." They are different questions.
- f(x + 2) means replace **every** x with (x + 2), in parentheses.
- f(g(3)) works from the inside out: find g(3) first, then put that number into f.
- f(2) × f(3) is not f(6), and 2f(x) is not f(2x).

### What the parts mean in a story

| Part of the model | What it usually means |
|---|---|
| f(0), the y-intercept, the a in a × b^t | the starting amount |
| the vertex (h, k) | the maximum or minimum amount k, reached at time or price h |
| the x-intercepts (zeros) | when the amount is 0: the ball lands, the profit is zero |
| a point such as (3, 410) | after 3 units of time, the amount is 410 |
| the base b | the factor per time unit |

## Worked examples

### Example 1: Pick the form that shows the minimum

The function f is defined by f(x) = (x + 2)(x − 4). Which of the following equivalent forms of f(x) displays the minimum value of f as a constant or coefficient?

- (A) x² − 2x − 8
- (B) x(x − 2) − 8
- (C) −(4 − x)(x + 2)
- (D) (x − 1)² − 9

**Solution.** The minimum value of a parabola that opens up is the y-value of its vertex: the k in vertex form a(x − h)² + k. Only choice (D) is in vertex form, and it shows k = −9. So the minimum value is −9, and it happens at x = 1. You can check (D) by expanding it: (x − 1)² − 9 = x² − 2x + 1 − 9 = x² − 2x − 8, which matches. Choices (A) and (B) show −8, but −8 is f(0), the y-intercept, not the lowest point. Choice (C) shows the zeros, 4 and −2. All four choices are the same function; the question only asks which one *shows* the minimum.

**Answer:** (D)

### Example 2: What the base means when the exponent is t/2

The value V, in dollars, of a delivery van t years after it was bought is modeled by V(t) = 24,000(0.81)^(t/2). Which statement is the best interpretation of 0.81 in this context?

- (A) The van's value decreases by 81% every 2 years.
- (B) The van's value decreases by 19% every 2 years.
- (C) The van's value decreases by 19% every year.
- (D) The van's value decreases by 9.5% every year.

**Solution.** The base 0.81 is less than 1, so this is decay. Multiplying by 0.81 means the van keeps 81% of its value and loses 100% − 81% = 19%. The exponent t/2 goes up by 1 only when t goes up by 2, so this happens once every 2 years. Check: V(0) = 24,000 and V(2) = 24,000 × 0.81 = 19,440. The drop is 4,560, which is 19% of 24,000.

(A) mixes up the part kept (81%) with the part lost. (C) ignores the /2 in the exponent. (D) splits 19% into two equal halves, but percent changes multiply: 0.9 × 0.9 = 0.81, so the real yearly drop is exactly 10%, not 9.5%.

**Answer:** (B)

### Example 3: A shifted function from a table

The table shows some values of the function f.

| x | f(x) |
|---|---|
| 0 | 7 |
| 1 | 4 |
| 2 | 3 |
| 3 | 4 |
| 4 | 7 |
| 5 | 12 |

The function g is defined by g(x) = f(x − 2) + 1. What is the value of g(5)?

- (A) 3
- (B) 4
- (C) 5
- (D) 13

**Solution.** Use the notation exactly as written and put 5 in for every x: g(5) = f(5 − 2) + 1 = f(3) + 1. The table gives f(3) = 4, so g(5) = 4 + 1 = 5. Choice (D) ignores the change inside the parentheses and uses f(5) + 1 = 13. Choice (B) is f(3) without the + 1. Choice (A) subtracts 1 instead of adding it. Notice that you never had to think about "left" or "right": plugging in does the shifting for you.

**Answer:** (C)

### Example 4: Back at the same height

A rock is thrown upward from the edge of a cliff. Its height above the water, in meters, t seconds after it is thrown is modeled by h(t) = −4.9t² + 19.6t + 58.8. How many seconds after it is thrown is the rock again at the height from which it was thrown?

*Student-produced response: enter your answer.*

**Solution.** The rock is thrown at t = 0 from the height h(0) = 58.8 meters (the constant term). A parabola is symmetric around its vertex. The vertex time is t = −b/(2a) = −19.6/(2 × (−4.9)) = 2 seconds. The time t = 0 is 2 seconds before the vertex, so the matching time is 2 seconds after it: t = 4.

Check with algebra: set h(t) = 58.8. Then −4.9t² + 19.6t = 0, so −4.9t(t − 4) = 0, and t = 0 or t = 4.

The other features of this model are worth knowing, because a different question could ask for any of them. The maximum height is h(2) = 78.4 meters, reached at t = 2. The rock hits the water when h(t) = 0, which gives t = 6. The other solution of that equation, t = −2, is a negative time, so it doesn't count.

**Answer:** 4

### Example 5: Factors after a shift

The table shows some values of the polynomial function p.

| x | p(x) |
|---|---|
| −6 | 0 |
| −3 | 42 |
| −1 | 0 |
| 0 | −24 |
| 2 | −48 |
| 4 | 0 |

The function g is defined by g(x) = p(x + 3). Which of the following must be a factor of g(x)?

- (A) x − 7
- (B) x − 4
- (C) x + 4
- (D) x + 3

**Solution.** The table shows p(−6) = 0, p(−1) = 0 and p(4) = 0, so −6, −1 and 4 are zeros of p. A zero of g is an x that makes the inside, x + 3, equal to one of these:

- x + 3 = 4 gives x = 1
- x + 3 = −1 gives x = −4
- x + 3 = −6 gives x = −9

So g(−4) = p(−1) = 0, which means x − (−4) = x + 4 is a factor of g(x). Choice (B) is a factor of p, not of g: it skips the shift. Choice (A) moves the zero 4 the wrong way (4 + 3 = 7). Choice (D) uses the shift number itself, but g(−3) = p(0) = −24, not 0. The + 3 inside moves the whole graph 3 units left, and every zero moves left with it.

**Answer:** (C)

### Example 6: Rewriting a yearly model in half-years

The number of members S of an online club t years after the club started is modeled by S(t) = 5,000(1.21)^t. The same model can be written as S = 5,000(b)^h, where h is the number of half-years (6-month periods) since the club started and b is a constant. What is the value of b?

*Student-produced response: enter your answer.*

**Solution.** Each year has 2 half-years, so h = 2t, which means t = h/2. Substitute: S = 5,000(1.21)^(h/2) = 5,000((1.21)^(1/2))^h. The square root of 1.21 is 1.1, so b = 1.1. In words: growing 21% per year is the same as growing 10% every half-year, because 1.1 × 1.1 = 1.21.

There are two traps. Splitting 21% in half gives 1.105, which is wrong because the growth compounds. Using h = t/2 instead of t = h/2 gives (1.21)² = 1.4641, the factor for 2 years, not for half a year. To check in Desmos, graph y = 5000(1.21)^x and y = 5000(1.1)^(2x): the two curves lie exactly on top of each other.

**Answer:** 1.1 or 11/10

## Traps to avoid

- **Giving x when they asked for y.** "Minimum value", "maximum height" and "how much" ask for an output (k). "When" and "at what price" ask for an input (h). Both numbers are usually among the choices.
- **Reading the vertex sign wrong.** In a(x − h)² + k the vertex is (h, k), so (x + 5)² puts the vertex at x = −5.
- **Taking c for the minimum.** In standard form, c is the y-intercept. It is the minimum only if the vertex sits on the y-axis.
- **Moving an inside change the wrong way.** f(x − 2) moves right and f(x + 2) moves left. Set the inside equal to the old x-value to be sure.
- **Using the rate instead of the factor.** A 6% increase multiplies by 1.06, not by 0.06 or 6. A 30% decrease multiplies by 0.70.
- **"Decreases by 80%" vs "decreases to 80%".** The first multiplies by 0.20; the second by 0.80.
- **Splitting a percent across time.** 19% every 2 years is not 9.5% per year, and 12% a year is not 1% a month. Use roots: (0.81)^(1/2) and (1.12)^(1/12).
- **Mixing up t/k and kt.** "Every 5 years" is b^(t/5); "5 times a year" is b^(5t).
- **Swapping the start value and the base.** 200(3)^t starts at 200 and triples. 3(200)^t starts at 3.
- **Linear vs exponential.** "The same amount each year" is linear. "The same percent each year" is exponential, even if two data points seem to fit a line.
- **Keeping impossible answers.** A negative time, length or number of people is not an answer in a story, even if it solves the equation.
- **Mixing up notation.** f(2a) is not 2f(a), f(x) + 3 is not f(x + 3), and f(g(x)) is not g(f(x)).

## Desmos shortcut

Desmos is built into every math question, and for nonlinear functions it does these jobs very well:

1. **Read the key points.** Type the function, for example `y=-4.9x^2+19.6x+58.8`, and click the curve. Gray dots appear at the vertex, the x-intercepts and the y-intercept; click a dot to see its coordinates. Here they are (2, 78.4), (−2, 0), (6, 0) and (0, 58.8). If you can't see the curve, zoom out or set the window with the wrench button.
2. **Use function notation.** Type `f(x)=x^2-4x+7` on one line and `g(x)=f(x-2)+1` on the next. Desmos graphs g for you. Then type `g(5)` and Desmos shows 5. Composition works the same way: `f(g(2))`.
3. **Test equivalent forms.** Graph the given function and a choice, for example `y=(x+2)(x-4)` and `y=(x-1)^2-9`. If the two graphs lie exactly on top of each other, the forms are equivalent.
4. **Find factors for a new time unit.** Type `0.81^0.5` to get the yearly factor 0.9, or type `1.12^1/12` to get the monthly factor, about 1.0095 (after ^ the whole fraction 1/12 goes up into the exponent). To see when an amount reaches a level, graph both, for example `y=24000(0.81)^(0.5x)` and `y=12000`, zoom out until you see where they meet (y = 12000 is far above the normal view), and click the intersection.
5. **Build a model from data.** Click + and choose "table". Type the inputs in the x_1 column and the outputs in the y_1 column. Then type `y1~ab^x1` for an exponential or `y1~ax1^2+bx1+c` for a quadratic, and Desmos shows the values of a, b and c. Desmos turns each 1 into a small subscript by itself; don't type an underscore, or the ~ gets stuck in the subscript and you get an error.
6. **Find an unknown constant with a slider.** Type something like `y=a(x-3)^2+5` and accept the slider for a. Drag a until the graph passes through the given point, then confirm the exact value with algebra.

> **Tip:** Desmos can keep typing inside an exponent, the bottom of a fraction or a root after you meant to leave it. Put exponents with more than one character in parentheses, like `(1.1)^(2x)`, and press the right arrow key to step out before you type the next part.

> **Trap:** Desmos tells you where things are, not what they mean. For "best interpretation" questions you still need the rules above: 0.81 means "keeps 81%, loses 19%".

## Quick checklist

- Which family is it: quadratic, exponential or polynomial?
- Do they want an input (x, a time, a price) or an output (a value, a height, the maximum)?
- Which form shows that number as a constant? Do I need to rewrite it or graph it?
- Exponential: is the factor 1 + r or 1 − r? Is the exponent t, kt or t/k?
- Shift: did I set the inside equal to the old x-value?
- Does my answer make sense in the story (positive time, right starting value at t = 0)?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (PDF)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official list of what nonlinear-function questions test, including "the most suitable form" questions, and sample questions.
- [College Board: Digital SAT Suite and Classroom Practice, Math (PDF)](https://satsuite.collegeboard.org/media/pdf/sat-suite-classroom-practice-math.pdf) — why each quadratic form shows different features, and why horizontal shifts seem to go backward.
- [College Board: SAT Math overview](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/overview) — 13 to 15 Advanced Math questions, about 30% in context, questions ordered from easy to hard.
- [Mr. McGrinder (YouTube): Every HARD Nonlinear Functions SAT question (1–22)](https://www.youtube.com/watch?v=Oyeq8rTHcnk) — a map of the hardest official question types: time-unit rewrites, "which form shows", shifts and factors from tables.
- [Test Ninjas: SAT Nonlinear Functions](https://www.test-ninjas.com/sat-nonlinear-functions) — the family-first method and the most common traps.
- [Open Exam Prep: Exponential growth and decay](https://open-exam-prep.com/study-guides/sat-math/advanced-math-functions/exponential-growth-decay) — rewriting exponential models between time units.
- [Varsity Tutors: Interpret exponential functions and growth rate](https://www.varsitytutors.com/practice/subjects/algebra/lessons/interpret-exponential-functions-and-growth-rate) — monthly vs yearly rates and why you can't just divide a percent.
- [The College Panda: SAT Function Transformations, the definitive guide](https://thecollegepanda.com/sat-function-transformations-definitive-guide/) — the full set of shift, flip and stretch rules.
- [Tutorllini Test Prep (YouTube): Digital SAT Desmos Lesson #12, Function Translations](https://www.youtube.com/watch?v=TIC6oYtvBGU) — solving shift questions with Desmos.
- [r/Sat: Top 75 math question types from Bluebook tests 4–11](https://www.reddit.com/r/Sat/comments/1sm4lms/) — a student's count showing exponential growth and function transformations among the most frequent question types.
