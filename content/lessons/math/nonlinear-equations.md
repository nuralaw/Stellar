---
title: Nonlinear Equations and Systems
skill: nonlinear-equations
domain: advanced-math
section: math
summary: Solve quadratic, root and absolute value equations, count solutions with b² − 4ac, and find where a line meets a parabola.
---

## Spot it: read the last line

These aren't straight-line equations: x is **squared**, under a **root**, inside **absolute value bars** or in a denominator. Some are **systems**: a line and a curve that must both be true.

Read the question's last line first. It picks your tool:

| They ask for | Fastest tool |
|---|---|
| the solutions | factor, ± root or formula |
| how many solutions | b² − 4ac |
| the sum or product | −b/a or c/a |
| a constant like k | set up b² − 4ac |
| a crossing point | substitute |

```quiz
A question asks how many real solutions 4x² − 7x + 5 = 0 has. Which move answers it without solving the equation?
- Factor it :: Factoring finds the solutions, and this one doesn't factor with whole numbers anyway.
- Use the quadratic formula :: That finds the solutions too. You only need how many there are.
* Work out b² − 4ac
> b² − 4ac = (−7)² − 4(4)(5) = 49 − 80 = −31. It's negative, so there are no real solutions, and you never had to solve.
```

## Make it = 0, then factor

The **zero product rule**: if A × B = 0, then A = 0 or B = 0. It only works when one side is **0**.

1. Move every term to one side, so the other side is 0.
2. Factor.
3. Set each factor equal to 0.

> **Trap:** Never divide both sides by x. In x² = 7x that loses x = 0. Write x² − 7x = 0, so x(x − 7) = 0: x = 0 or x = 7.

```quiz
x² = 5x + 14. What are the solutions?
- x = −7 or x = 2 :: Sign slip. The factor x − 7 = 0 gives x = +7, and x + 2 = 0 gives x = −2.
* x = 7 or x = −2
- x = 14 or x = 19 :: You wrote x(x − 5) = 14 and set each factor equal to 14. The rule needs 0 on one side.
> Move everything left: x² − 5x − 14 = 0. Two numbers that multiply to −14 and add to −5 are −7 and 2.
> So (x − 7)(x + 2) = 0, which gives x = 7 or x = −2. Check x = 7: 49 = 35 + 14 ✓
```

## Two answers: ± and bars

A square hides the sign. If (x − 3)² = 25, then x − 3 = **5 or −5**, so x = 8 or x = −2.

Absolute value works the same way: |2x − 1| = 9 means 2x − 1 = 9 or 2x − 1 = −9.

Get the square or the bars alone first. If the other side is **negative**, stop: neither can be negative, so (x + 1)² = −4 has no real solutions.

```quiz
(x + 4)² = 36. What is the sum of the solutions?
- 2 :: You kept only x + 4 = 6. A square root gives ±6, so there are two solutions.
- −10 :: That's one of the solutions. The question wants the sum of both.
* −8
- 0 :: (x + 4)² is not x² + 16: you dropped the middle term, 8x. Faster: take the square root of both sides.
> x + 4 = 6 or x + 4 = −6, so x = 2 or x = −10.
> The sum is 2 + (−10) = −8.
```

## Won't factor? Use the formula

When no whole numbers work, or the choices contain a root, use the **quadratic formula**. It's not on the reference sheet:

x = (−b ± sqrt(b² − 4ac)) / (2a)

Read a, b and c **with their signs**, after one side equals 0.

> **Tip:** Asked only for the sum or the product of the solutions? Skip solving. Sum = −b/a and product = c/a.

```quiz
x² − 4x − 1 = 0. What are the solutions?
- x = 2 ± √3 :: Here c = −1, so −4ac = +4. Under the root is 16 + 4 = 20, not 16 − 4.
- x = −2 ± √5 :: −b with b = −4 is +4, so the answer starts with +2.
* x = 2 ± √5
- x = 4 ± 2√5 :: You forgot to divide everything by 2a = 2.
> a = 1, b = −4, c = −1. So x = (4 ± sqrt(16 + 4)) / 2 = (4 ± √20) / 2.
> √20 = 2√5, so x = (4 ± 2√5) / 2 = 2 ± √5.
```

## Count solutions with b² − 4ac

The **discriminant** b² − 4ac is the part under the root in the formula. Its sign tells you how many real solutions there are:

| b² − 4ac | Real solutions |
|---|---|
| positive | two |
| zero | exactly one |
| negative | none |

On the graph of y = ax² + bx + c, that's two x-intercepts, one touch at the vertex, or none.

```quiz
How many real solutions does 2x² − 3x − 5 = 0 have?
- None :: Sign slip. With c = −5, −4ac = −4(2)(−5) = +40, not −40.
- Exactly one :: That needs b² − 4ac to be exactly 0.
* Two
> b² − 4ac = (−3)² − 4(2)(−5) = 9 + 40 = 49. That's positive, so there are two solutions.
> Check: 2x² − 3x − 5 = (2x − 5)(x + 1), so x = 5/2 or x = −1.
```

## Line meets parabola: substitute

For a system like y = x² + … and y = mx + k:

1. Set the two right sides equal.
2. Move everything to one side, so it equals 0.
3. Solve for x, then get y from the line.

The number of **crossing points** equals the number of solutions of that one equation. "Exactly one solution" means the line just touches the curve: b² − 4ac = 0.

```quiz
y = x² + 3x + 7
y = −x + k
In the system above, k is a constant. The system has exactly one solution. What is the value of k?
- −2 :: That's the x-coordinate of the touching point. The question asks for k.
- −3 :: Moving k to the left flips its sign. The constant is 7 − k, not 7 + k.
- 19/4 :: You didn't move the −x. On the left, b is 3 + 1 = 4, not 3.
* 3
> Set them equal: x² + 3x + 7 = −x + k. Move everything left: x² + 4x + (7 − k) = 0.
> Exactly one solution means b² − 4ac = 0: 16 − 4(7 − k) = 0, so 16 − 28 + 4k = 0, and k = 3.
> Check: with k = 3 you get x² + 4x + 4 = (x + 2)² = 0, which has the one solution x = −2.
```

## Squared both sides? Check

Squaring both sides, or multiplying by something with x in it, can create **fake answers** (called *extraneous*).

- **Root equation:** get the root alone, square, solve, then plug every answer into the **original**. A square root is never negative.
- **x in a denominator:** any x that makes a denominator 0 is out.

> **Tip:** In Desmos, graph each side on its own line: `y=sqrt(3x+10)`, then `y=x`. The crossings are the true solutions; fake answers never show up.

```quiz
sqrt(3x + 10) = x. Which gives all the solutions?
- x = −2 and x = 5 :: You skipped the check. x = −2 gives √4 = 2, and 2 ≠ −2.
* x = 5 only
- x = −2 only :: You threw out the wrong one. x = 5 gives √25 = 5, which works.
- x = −5 and x = 2 :: Sign slip. (x − 5)(x + 2) = 0 gives x = 5 or x = −2.
> Square both sides: 3x + 10 = x², so x² − 3x − 10 = 0 and (x − 5)(x + 2) = 0.
> Check in the original: √25 = 5 ✓, but √4 = 2, not −2. So x = −2 is fake.
```

## The trap: reading b too early

Sum, product and b² − 4ac questions all start from a, b and c. This is where most points on them are lost.

```quiz
2x² − 7x = x + 6. What is the sum of the solutions?
- 7/2 :: Trap: you read b = −7 before moving x to the left. In 2x² − 8x − 6 = 0, b is −8.
* 4
- −4 :: The sum is −b/a, with a minus: −(−8)/2 = +4.
- −3 :: That's c/a, the product of the solutions.
> First make one side 0: 2x² − 8x − 6 = 0. Now a = 2, b = −8 and c = −6.
> Sum = −b/a = 8/2 = 4. (The solutions are 2 ± √7, and they do add to 4.)
```

## Your turn: easy

A square equals a number: take the square root and keep both signs.

```check
m-0520
```

## Your turn: medium

Get the root alone, square both sides, then check each answer in the original.

```check
m-0189
```

## Your turn: hard

Substitute, make it equal 0, and think about b² − 4ac. Then answer exactly what's asked.

```check
m-0343
```

## Recap

- Read the last line: solutions, how many, a sum, a constant or a point?
- Make one side 0 before you factor or read a, b and c.
- A square root or absolute value gives two cases: + and −.
- How many solutions, or a constant: b² − 4ac (positive two, zero one, negative none).
- System: set the two sides equal, solve for x, then get y from the line.
- Squared both sides or cleared a fraction? Check every answer in the original.
