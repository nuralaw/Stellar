---
title: Linear Inequalities
skill: linear-inequalities
domain: algebra
section: math
summary: Solve linear inequalities without sign mistakes, turn real-life limits into inequalities, and check which points fit a graph or system.
minutes: 12
---

> **Key idea:** Solve an inequality just like an equation, but flip the sign every time you multiply or divide both sides by a negative number. No other step flips it.

## What this question looks like

An inequality uses <, >, ≤ or ≥ instead of an equals sign, so its answer is usually a whole range of numbers. On the Digital SAT it comes in a few familiar forms:

- **Solve it.** One variable, like `7 − 3(x + 2) ≥ 2x − 9`. Choices look like "x ≤ 2" or "x ≥ 2," so the sign's direction is the whole question.
- **Word problem with a limit.** A budget, a weight limit or a minimum score, with phrases like "at most" or "at least." You write the inequality or find the greatest or least whole number that works.
- **Write the system.** Two limits at once, like a money limit and a minimum number of items. You pick the pair of inequalities that models the story.
- **Which point works?** Two-variable inequalities, or a graph with a shaded region. You pick the point (x, y) that's a solution.
- **Read the region.** A graph with a dashed or solid line and shading. Which inequality matches it, or what's the greatest possible y?

## The method

Pick the routine that matches the question type.

### One variable

1. Solve it like an equation: clear fractions, distribute, collect x on one side, divide.
2. Flip the sign on the exact step where you multiply or divide by a negative.
3. If the answer ends up backwards, like 4 > x, read it right to left: x < 4.
4. Test one easy number from your answer in the *original* inequality. If it fails, you made a sign error.

### Word problem

1. Name the variable, with units ("w = number of worksheets").
2. Build the expression as you would for an equation: flat amount plus rate × variable.
3. Pick the symbol from the wording (see the table below).
4. Solve. If the variable counts whole things, round in the direction that still meets the limit.

### Which point satisfies the system

1. Plug each choice into **every** inequality. A point must make all of them true.
2. As soon as a choice fails one inequality, cross it out and move on.

### Graphs

Rewrite the inequality as `y < mx + b` or `y > mx + b`. Then y > means shading **above** the line and y < means below. A dashed line means < or >; a solid line means ≤ or ≥.

## Rules and formulas you need

The sign stays the same for most moves. Know exactly which ones change it.

- **Keeps the sign:** adding or subtracting anything (even a negative), and multiplying or dividing by a positive.
- **Flips the sign:** multiplying or dividing by a negative.
- **Swapping the two sides** turns the symbol around with them: 5 < x means the same as x > 5.

### Words to symbols

| Words in the problem | Symbol |
|---|---|
| at least, no less than, a minimum of | ≥ |
| at most, no more than, a maximum of, cannot exceed | ≤ |
| more than, greater than, over | > |
| less than, fewer than, under | < |

> **Trap:** "5 less than x" is the expression x − 5, not an inequality. "5 is less than x" is the inequality 5 < x.

### Rounding whole-number answers

| Limit type | Example | Round |
|---|---|---|
| "At most" (budget, capacity) | h ≤ 6.2 | Down to 6 |
| "At least" (score, money raised) | w ≥ 8.4 | Up to 9 |

### More facts

- **Compound inequality** like `−3 < 2x + 1 ≤ 9`: do every step to all three parts. Subtract 1 to get −4 < 2x ≤ 8, then divide by 2 to get −2 < x ≤ 4.
- In a compound inequality, dividing by a negative flips **both** signs.
- **Number lines:** an open circle means the endpoint is not included (< or >). A closed dot means it is (≤ or ≥).
- **Test point for shading:** if the line doesn't pass through (0, 0), plug it in. If it makes the inequality true, shade the side with the origin.
- **Systems:** the solution is the region where all the shadings overlap. Every point there works, and no point outside it does.
- **If the x-terms cancel,** read what's left. A true statement (like 3 > 1) means every number works; a false one means none does.

## Worked examples

### Example 1: The sign flip

Which of the following describes all solutions to `7 − 3(x + 2) ≥ 2x − 9`?

- (A) x ≥ 2
- (B) x ≤ 2
- (C) x ≤ 22/5
- (D) x ≥ 22/5

**Solution**

Distribute the −3 to both terms inside: `7 − 3x − 6 ≥ 2x − 9`, which simplifies to `1 − 3x ≥ 2x − 9`.

Subtract 2x from both sides and subtract 1 from both sides: `−5x ≥ −10`.

Divide by −5. It's a negative, so flip: x ≤ 2.

Second method (no flip needed): add 3x and 9 to both sides of `1 − 3x ≥ 2x − 9` instead. You get 10 ≥ 5x, so 2 ≥ x, which is x ≤ 2. Same answer.

Check: x = 0 gives 1 ≥ −9, which is true, so 0 must be in the answer. That rules out (A) and (D). x = 3 gives −8 ≥ −3, which is false, so 3 can't be in the answer. That rules out (C), since 3 is less than 22/5.

Why the others are wrong: (A) forgets to flip. (C) distributes −3(+2) as +6 instead of −6. (D) makes both mistakes.

**Answer:** (B)

### Example 2: Least whole number

Priya has earned 78 points in a class so far. Each extra-credit project is worth 5 points. She needs a total of at least 120 points to get an A. What is the least number of extra-credit projects she must complete?

**Solution**

Let w = the number of projects. "At least" means ≥: `78 + 5w ≥ 120`.

Subtract 78 to get 5w ≥ 42, then divide by 5 to get w ≥ 8.4.

She can't complete 0.4 of a project, and 8 isn't enough (8.4 is the minimum). So round **up** to 9.

Check: 78 + 5(9) = 123, which reaches 120. But 78 + 5(8) = 118, which falls short.

**Answer:** 9

### Example 3: Write the system

A florist makes small bouquets that use 4 roses each and large bouquets that use 10 roses each. She has no more than 200 roses, and she must make at least 12 bouquets in total. If s is the number of small bouquets and l is the number of large bouquets, which system models this situation?

- (A) `4s + 10l ≤ 200` and `s + l ≥ 12`
- (B) `4s + 10l ≥ 200` and `s + l ≤ 12`
- (C) `10s + 4l ≤ 200` and `s + l ≥ 12`
- (D) `s + l ≤ 200` and `4s + 10l ≥ 12`

**Solution**

Build one inequality for each limit.

- **Roses:** each small bouquet uses 4 and each large one uses 10, so the roses used are `4s + 10l`. "No more than 200" means ≤ 200.
- **Bouquets:** the total number is s + l. "At least 12" means ≥ 12.

That's choice (A).

Why the others are wrong: (B) reverses both directions. (C) pairs each rate with the wrong bouquet size. (D) mixes up the two quantities: it limits the *number of bouquets* to 200 and the *roses* to at least 12.

**Answer:** (A)

### Example 4: Which point is in the solution region?

`y > 2x − 3`
`x + 2y ≤ 8`

Which point (x, y) is a solution to the system of inequalities above?

- (A) (0, −3)
- (B) (4, 2)
- (C) (1, 3)
- (D) (−2, 6)

**Solution**

Test every choice in both inequalities. Drop it the moment it fails one.

- (A) First inequality: is −3 > 2(0) − 3 = −3? No. −3 equals −3, and the sign is strict. The point lies on the boundary line, which isn't included for >, so it fails.
- (B) First inequality: is 2 > 2(4) − 3 = 5? No. It fails.
- (C) First inequality: is 3 > 2(1) − 3 = −1? Yes. Second inequality: is 1 + 2(3) = 7 ≤ 8? Yes. It passes both.
- (D) First inequality: is 6 > −7? Yes. Second inequality: is −2 + 12 = 10 ≤ 8? No. It fails.

Notice that (B) passes only the second inequality and (D) only the first. Those choices are there to catch students who check just one.

**Answer:** (C)

## Traps to avoid

- **Forgetting the flip** after dividing by a negative. It's the most common inequality mistake, and the trap choice is the same number with the sign facing the other way.
- **Flipping when you shouldn't.** Subtracting a negative, distributing a negative or moving terms across doesn't flip the sign.
- **Rounding the wrong way.** A budget ("at most") rounds down; a goal ("at least") rounds up. Plugging your whole number back in settles it.
- **Checking only one inequality.** In a system, a point must satisfy all of them. Wrong choices are often built to pass just one.
- **Points on the boundary.** For < or >, a point exactly on the line is *not* a solution. For ≤ or ≥, it is.
- **Shading from the wrong form.** "y >" means above only once y is alone. In `−2y > x + 4`, dividing by −2 flips the sign, so the region is *below* the line.
- **Swapping rates and items.** In a two-variable word problem, multiply each rate by the variable it belongs to.

## Desmos shortcut

Desmos is strongest on "which point" and "read the region" questions. For a short one-variable inequality, solving by hand is about as fast, but Desmos makes a good check.

### One variable

- Type it exactly as written, for example `7-3(x+2)>=2x-9`. Typing `>=` gives ≥ and `<=` gives ≤.
- Desmos shades a vertical band. Its edge is the boundary value (here x = 2), and the shaded side shows the direction.
- A solid edge means the endpoint is included; a dashed edge means it isn't.

### Systems of inequalities

- Type each inequality on its own line: `y>2x-3` and `x+2y<=8`. You don't need to solve for y first.
- The solution is the area where the two colors overlap.
- Cleaner view: type `y>2x-3{x+2y<=8}`, with the second inequality in curly braces as a restriction. Desmos then shades *only* the overlap.
- Add each answer choice as a point on its own line, like `(1,3)`. The correct choice sits inside the overlap.
- If a point lands right on a boundary, check whether that line is dashed or solid, or plug the point in by hand.

### Greatest or least value in a region

Graph the system, then click the corner where the boundary lines cross to see its coordinates. That corner is usually where the greatest or least y-value happens.

> **Remember:** Desmos won't translate a word problem or round to whole numbers. You still write the inequality and decide whether to round up or down.

## Quick checklist

- Did I multiply or divide by a negative? If so, did I flip the sign on that step?
- Does an easy test number from my answer work in the original inequality?
- Did I translate each phrase correctly (at least ≥, at most ≤, more than >, fewer than <)?
- For whole-number answers, did I round in the direction that still meets the limit?
- For a system, did my point pass *every* inequality, including any boundary?
- For a graph, is the line dashed or solid, and is the shaded side correct?
