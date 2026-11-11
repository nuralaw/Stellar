---
title: Linear Functions
skill: linear-functions
domain: algebra
section: math
summary: Read, build and use a linear function from an equation, a table, a graph or a story, and say exactly what its slope and intercept mean.
minutes: 10
---

## What this question looks like

Linear functions show up in both math modules. You will usually see one of these:

- A model like `C(t) = 850 − 40t` with a story, and the question asks what 850 or 40 *means*.
- Function notation: "If f(3) = 10 and f(7) = 22, what is f(12)?" or "For what value of x is f(x) = 50?"
- A table of x and f(x) values, and four equations to choose from.
- A graph of a line, and you must pick its equation or read off a value.
- A "how much does it change" question: "According to the model, how much does the cost increase when the number of guests goes up by 5?"

A **linear function** is a function whose graph is a straight line. Every time the input goes up by 1, the output changes by the same amount. That steady change is the whole idea.

## The method

1. **Name the input and the output.** Write them down with units, for example "t = minutes, C = dollars". Most mistakes start with mixing these up.
2. **Find the slope (the rate).** From two points, slope = (change in output) ÷ (change in input). From a story, look for words like *per*, *each*, *every* or *for every*.
3. **Find the intercept (the starting value).** This is the output when the input is 0. From a story, look for a flat fee, a starting amount or "initially".
4. **Write `f(x) = mx + b`** if you need the whole function. If you know the slope and one point, plug the point in to solve for b.
5. **Answer the exact question.** Is it asking for an output, an input, a meaning, or a change? Each needs a different move (see the table below).
6. **Check with a second point** from the table, graph or story before you lock in.

## Rules and formulas you need

| Idea | What to know |
|---|---|
| Form | `f(x) = mx + b`. m is the slope, b is the y-intercept. |
| Slope | m = (y₂ − y₁)/(x₂ − x₁). Subtract in the same order on top and bottom. |
| Intercept | b = f(0), the output when the input is 0. The point is (0, b). |
| Function notation | f(4) = 9 means "input 4 gives output 9", so the point (4, 9) is on the line. |
| f(0) vs f(x) = 0 | f(0) is an output (the y-intercept). f(x) = 0 asks for an input (the x-intercept). |
| Change in output | change in f = m × (change in x). You do not need b for this. |
| Sign of slope | Positive: rising, the output grows. Negative: falling, the output shrinks. 0: flat line. |

How to read slope and intercept in context:

- **Slope:** "For each 1 [input unit], the [output] goes up (or down) by m [output units]."
- **Intercept:** "When [input] is 0, the [output] is b." Usually a starting amount, a fixed fee or an initial value.
- A negative slope in a story is described with words like *decreases*, *loses* or *drains*. The question choices will say "decreases by 40", not "increases by −40".

What each question type is really asking:

| Question asks for | Your move |
|---|---|
| f(5) | Plug 5 in for x. |
| x when f(x) = 50 | Set mx + b = 50 and solve for x. |
| "What does 40 represent?" | Decide whether 40 is the slope or the intercept, then use the sentence patterns above. |
| "How much does it increase when x goes up by 3?" | 3 × slope. |
| A table or graph to an equation | Slope from two points, then b from one point. |

> **Key idea:** The slope never depends on where you start. Any two points on a line give the same slope, so pick the two with the friendliest numbers.

## Worked examples

### Example 1: What does the number mean?

A water tank is being drained. The function `W(t) = 840 − 35t` gives the number of gallons of water in the tank t minutes after draining begins. Which of the following is the best interpretation of 35 in this context?

- (A) The tank held 35 gallons of water when draining began.
- (B) The amount of water in the tank decreases by 35 gallons each minute.
- (C) The tank will be empty 35 minutes after draining begins.
- (D) The amount of water in the tank increases by 35 gallons each minute.

**Solution**

Input: t, in minutes. Output: W, in gallons. The 35 is multiplied by t, so it is the slope, a rate in gallons per minute. It has a minus sign, so the water goes *down* by 35 gallons each minute. (A) describes the intercept, and the starting amount is actually 840 gallons. (C) mixes up the rate with the time to empty: 840 ÷ 35 = 24 minutes, not 35. (D) has the direction backwards.

**Answer:** (B)

### Example 2: Two values of f, then work backward

For the linear function f, f(2) = 11 and f(6) = 23. If f(k) = 50, what is the value of k?

**Solution**

f(2) = 11 and f(6) = 23 are the points (2, 11) and (6, 23).

Slope: m = (23 − 11)/(6 − 2) = 12/4 = 3.

Intercept: 11 = 3(2) + b, so b = 5. The function is `f(x) = 3x + 5`. Check: f(6) = 18 + 5 = 23. Correct.

Now f(k) = 50 means the *output* is 50, so set 3k + 5 = 50. Then 3k = 45 and k = 15.

A common slip is to compute f(50) = 155 instead. The question gives you the output and asks for the input.

**Answer:** 15

### Example 3: Table to function

The table shows four values of x and their corresponding values of f(x) for the linear function f.

| x | f(x) |
|---|---|
| −2 | 17 |
| 1 | 8 |
| 4 | −1 |
| 7 | −10 |

Which equation defines f?

- (A) `f(x) = −3x + 11`
- (B) `f(x) = 3x + 11`
- (C) `f(x) = −3x + 17`
- (D) `f(x) = −(1/3)x + 11`

**Solution**

Slope from the first two rows: (8 − 17)/(1 − (−2)) = −9/3 = −3.

Intercept: use (1, 8). 8 = −3(1) + b, so b = 11. That gives `f(x) = −3x + 11`.

Check another row: f(7) = −21 + 11 = −10. Correct.

(B) has the wrong sign: as x goes up, f(x) goes down, so the slope must be negative. (C) uses 17 as the intercept, but 17 is the output at x = −2, not at x = 0. (D) flips the slope to change in x over change in y.

**Answer:** (A)

### Example 4: A change question with a unit switch

The height of a tree seedling, in centimeters, is modeled by `H(w) = 1.5w + 20`, where w is the number of weeks since it was planted. According to the model, how many **days** does it take the seedling to grow 9 centimeters?

- (A) 6
- (B) 13.5
- (C) 42
- (D) 94.5

**Solution**

"Grow 9 centimeters" is a *change* in height, so use only the slope. The seedling grows 1.5 cm per week. Weeks needed = 9 ÷ 1.5 = 6 weeks. The question asks for days, so 6 × 7 = 42 days.

(A) is the answer in weeks, so the conversion was skipped. (B) multiplies 9 × 1.5 instead of dividing. (D) multiplies instead of dividing and then converts to days.

**Answer:** (C)

## Traps to avoid

- **Slope and intercept swapped.** The number multiplied by the variable is the rate. The number standing alone is the starting value. Test makers love a choice that describes the other one.
- **Wrong direction.** `840 − 35t` *decreases* by 35. A choice that says "increases by 35" uses the right number with the wrong direction.
- **f(0) vs f(x) = 0.** These are opposite questions. One gives the y-intercept, the other gives the x-intercept.
- **Plugging in when you should solve.** If the question tells you the output, set the function equal to it. Don't plug it in as x.
- **First table row used as the intercept.** The intercept is the output at x = 0 only. If the table doesn't include x = 0, you have to calculate it.
- **Inverted slope.** Output change goes on top. Checking the units (dollars *per* ticket, not tickets per dollar) catches this.
- **Units and scaled inputs.** Watch for t in weeks when the question asks about days, or x in hundreds of items, or cost in thousands of dollars.
- **Using the whole function for a change.** "How much more for 4 extra hours?" is 4 × slope. The flat fee cancels out.

## Desmos shortcut

Desmos is built into every math question on the Digital SAT. It is great for linear functions when the numbers are messy or there are several points.

**Find the line from a table or from values like f(2) = 11:**

1. Click **+** and choose **table**. Type the inputs in the x₁ column and the outputs in the y₁ column.
2. On a new line type `y1 ~ m x1 + b`. Desmos turns the 1s into small subscripts. Use the tilde **~**, not =.
3. Desmos shows m and b. For exactly linear data, R² = 1. If R² isn't 1, the data isn't a perfect line, so check for a typo.
4. Desmos shows decimals. Turn −0.333333 into −1/3 before you compare with the choices.

**Evaluate or work backward:**

- Type `f(x) = 3x + 5`, then type `f(10)` on the next line to get the output.
- For f(k) = 50, graph `y = 3x + 5` and `y = 50` and click where they cross. The x-coordinate is k.
- Click a line's gray dots to see its intercepts. Click the dot on the y-axis to read b.

**Check a graph question:** type each answer choice and see which one lands on the points shown in the question's graph.

> **Tip:** For a simple model like `C = 12h + 30` with clean numbers, algebra is faster than typing. Save Desmos for tables, ugly decimals and checking your work. Start each new question with a blank graph so old values of m and b don't carry over.

## Quick checklist

- Did I label the input and output with units?
- Is the number I'm interpreting the slope (multiplied by x) or the intercept (alone)?
- Does the slope's sign match the story: growing or shrinking?
- Is the question asking for an output, an input, a meaning, or a change?
- Did I check my equation with a second point?
- Is my answer in the units the question asks for?

## Sources

- [College Board: What's on the SAT Math Section, Algebra](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/algebra)
- [Test Ninjas: Mastering Linear Functions Questions on the SAT](https://www.test-ninjas.com/sat-linear-functions)
- [Albert: Evaluating Linear Functions and Interpreting Them](https://www.albert.io/blog/evaluating-linear-functions-and-interpreting-them-a-guide/)
- [Albert: Creating Linear Functions, Connecting Representations](https://www.albert.io/blog/creating-linear-functions-connecting-representations-a-guide/)
- [The Test Advantage: SAT Linear Functions, Rate of Change and Desmos](https://thetestadvantage.com/blog/sat-linear-functions-rate-of-change-desmos-guide-2026)
- [The Test Advantage: Linear Equation From a Table](https://thetestadvantage.com/blog/digital-sat-math-linear-equation-from-table-slope-intercept)
- [Open Exam Prep: Linear Functions, Slope and Rate of Change](https://open-exam-prep.com/study-guides/sat-math/algebra-linear/linear-functions-slope)
- [Open Exam Prep: Mastering the Built-In Desmos Calculator](https://open-exam-prep.com/study-guides/sat-math/introduction/desmos-calculator-mastery)
- [UWorld: SAT Algebra Key Concepts and Question Types](https://collegeprep.uworld.com/blog/types-of-heart-of-algebra-sat-questions-and-strategies/)
- [Axiom Academy: Interpreting Linear Functions in Context](https://theaxiomacademy.org/learn/sat-interpreting-linear-functions-context)
- [Just Locked In: Linear Functions, Context and Models](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-functions/context-and-models.html)
- [Galvanize Test Prep: SAT Algebra Question Types](https://galvanizetestprep.com/blogs/sat-algebra/)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
