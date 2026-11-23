---
title: Systems of Two Linear Equations
skill: systems-linear
domain: algebra
section: math
summary: Solve systems, count the solutions, and find the missing constant.
---

# Substitution
One letter alone? Plug it into the other.

```visual
systems-linear--substitute
```

## Key ideas
A **system** is two equations with the same unknowns. Its **solution** is the pair \((x, y)\) that makes both true: the point where the two lines cross.

Use **substitution** when one equation already has a letter alone, like \(y = 2x\). Write that expression, in parentheses, wherever the letter appears in the other equation.

\[3x + y = 10 \;\longrightarrow\; 3x + (2x) = 10\]

Now only one letter is left. Solve it, then put the answer back to find the other letter.

**Set equal.** If both equations start with \(y =\), their right sides are equal to each other. Solve \(2x + 1 = 5x - 8\) directly. This works for any expression that both equations equal, even a constant like \(c\).

**Trap:** the SAT often asks for \(x + y\), \(2y\) or \(x - y\), not just \(x\). Re-read the question before you choose.

```example
\(y = 2x\) and \(3x + y = 10\). Find \((x, y)\).
1. \(3x + (2x) = 10\) :: Replace \(y\) with \(2x\).
2. \(5x = 10\), so \(x = 2\) :: Combine, then divide by 5.
3. \(y = 2(2) = 4\) :: Put \(x\) back in.
4. \((x, y) = (2, 4)\) :: Check: \(3(2) + 4 = 10\).
```

```desmos
Check it on the graph. \(y = 2x\) and \(3x + y = 10\).
type y=2x :: Type each equation on its own line.
type 3x+y=10
zoom -2 6 -2 8
point (2, 4) :: Click the crossing: \((2, 4)\).
```

```theory
**Why it works.** An equation like \(y = 2x\) says that \(y\) and \(2x\) are the same number. So you may write \(2x\) anywhere \(y\) appears, and nothing changes. After the swap, the second equation has only \(x\), which you can solve.

**Use parentheses.** The swapped expression must stay together. In \(4y\), replacing \(y\) with \(3x - 2\) gives \(4(3x - 2) = 12x - 8\), not \(4 \cdot 3x - 2\). A minus sign in front of the letter, like \(-y\), flips every sign inside.

**No letter alone?** Make one. Rearrange so a letter with coefficient 1 stands alone: \(x + 3y = 7\) becomes \(x = 7 - 3y\). If every coefficient is messy, use elimination instead (next part).

**Set equal.** When both equations are solved for the same letter, drop the middle step: \(2x + 1 = 5x - 8\) gives \(3x = 9\), so \(x = 3\). The same idea works when two different left sides equal the same constant \(c\). For \(50x + 49y = c\) and \(49x - 50y = c\), the left sides are equal to each other, so you can set them equal and the unknown \(c\) disappears.

**Finish the job.** After you have one letter, put it into either original equation to get the other. Then check the pair in both equations. If the choices are points, you can also test each point in both equations.

**On the SAT.** The question usually says "the solution to the given system is \((x, y)\)" and then asks for a value like \(x - y\) or \(2x\). Find what it asks for, not just \(x\). Desmos finds the crossing instantly: type both equations and click the intersection.
```

## Easy
```task
bank: m-0630
highlight:
- "y = 3x" :: \(y\) is alone, so swap \(3x\) in for \(y\).
- "2x + y = 12" :: Substitute here: \(2x + 3x = 12\).
- "What is the value of 5x?" :: It asks for \(5x\), not \(x\). You already have it.
explain:
\(y\) is alone in the first equation, so substitute \(3x\) for \(y\) in the second:

\[2x + 3x = 12\]

Combine like terms: \(5x = 12\). The question asks for the value of \(5x\), so you are done: the answer is **12** (choice C). You do not need to find \(x\) at all.

If you solve for \(x\) anyway, \(x = 2.4\) and \(y = 7.2\). Check: \(2(2.4) + 7.2 = 12\). In Desmos, type both equations and the crossing is \((2.4, 7.2)\); then \(5 \cdot 2.4 = 12\).
```

## Medium
```task
bank: m-0904
highlight:
- "y = 3x + 9" :: \(y\) is alone: this whole expression replaces \(y\).
- "3y = 8x - 6" :: There is \(3y\) here, so write \(3(3x + 9)\).
- "What is the value of x - y?" :: Find both \(x\) and \(y\), then subtract.
explain:
The first equation has \(y\) alone, so substitute \(3x + 9\) for \(y\) in the second. Keep the parentheses:

\[3(3x + 9) = 8x - 6\]

Distribute: \(9x + 27 = 8x - 6\). Subtract \(8x\) and \(27\): \(x = -33\).

Now \(y = 3(-33) + 9 = -90\).

The question asks for \(x - y\):

\[-33 - (-90) = -33 + 90 = 57\]

The answer is **57** (choice D). Check in the second equation: \(3y = -270\) and \(8x - 6 = -264 - 6 = -270\). Watch the double negative: subtracting \(-90\) adds 90. The wrong choice \(-123\) comes from adding \(x\) and \(y\) instead of subtracting.
```

## Hard
```task
bank: m-16132
highlight:
- "50x + 49y = c" :: Both left sides equal the same \(c\).
- "49x − 50y = c" :: So set the two left sides equal to each other.
- "c is a positive constant" :: After you find a point, check that \(c\) comes out positive.
- "could be the point where the graphs" :: At the crossing, \(x\) and \(y\) satisfy both equations.
explain:
Both equations equal the same number \(c\), so their left sides equal each other at the crossing point:

\[50x + 49y = 49x - 50y\]

Move the terms: \(x = -99y\). So the \(x\)-coordinate must be \(-99\) times the \(y\)-coordinate.

Test the choices. For \((10, -\frac{10}{99})\): \(-99 \cdot \left(-\frac{10}{99}\right) = 10\), which matches \(x = 10\). The other choices fail: \((10, 990)\) would need \(x = -98{,}010\), and \((c, 0)\) and \((c, \frac{c}{99})\) need \(x = 0\) or \(x = -c\), not \(c\).

Last check: \(c = 50(10) + 49\left(-\frac{10}{99}\right) \approx 495\), which is positive. The answer is **\((10, -\frac{10}{99})\)** (choice A).
```

# Elimination
Add or subtract so one letter cancels.

```visual
systems-linear--multiply
```

## Key ideas
**Elimination** (the SAT books also call it **combination**) adds or subtracts the two equations so one letter disappears. First write both as \(ax + by = c\), with the letters lined up.

- Same letter, opposite signs (\(+2y\) and \(-2y\)): **add**.
- Same letter, same sign and number: **subtract**.
- Nothing matches? **Multiply** one whole equation, every term and the right side, so one pair matches. Sometimes you must multiply both.

\[4x + 3y = 18 \quad\text{and}\quad 2x - 5y = -4\]

Multiply the second by 2 to get \(4x - 10y = -8\). Now subtract: the \(4x\) terms cancel.

When one letter is found, put it in an original equation to get the other. **Trap:** when you subtract, subtract every term, including the right side, and watch the minus signs.

```example
\(4x + 3y = 18\) and \(2x - 5y = -4\). Find \((x, y)\).
1. \(4x - 10y = -8\) :: Multiply the second equation by 2.
2. \(13y = 26\), so \(y = 2\) :: Subtract it from the first.
3. \(4x + 3(2) = 18\) :: Put \(y = 2\) in the first equation.
4. \(x = 3\) :: \(4x = 12\), divide by 4.
```

```theory
**Why it works.** If two numbers are equal, you can add the same thing to both sides. Adding two equations adds equal things to equal things, so the result is still true. The new equation holds for the solution \((x, y)\), and you chose it so one letter is gone.

**Multiplying.** Multiplying a whole equation by a number never changes its solutions. But you must multiply **every** term. In \(3x + 2y = 13\), times 2 gives \(6x + 4y = 26\), not \(6x + 4y = 13\).

**Which letter to cancel?** Pick the letter that needs the simplest multiplier. If \(x\) has coefficients 3 and 5 and \(y\) has 2 and \(-4\), then multiplying the first equation by 2 cancels \(y\) in one step. If neither is easy, multiply both equations: for \(2x + 3y\) and \(3x + 5y\), use \(\times 3\) and \(\times 2\) to make both \(x\) terms \(6x\), then subtract.

**Fractions and decimals.** Clear them first. Multiply a whole equation by the common denominator so all coefficients are whole numbers.

**Out of order.** The SAT likes to hide equations: terms on both sides, or the letters in a different order (\(5y + 3x = 9\)). Move terms until each equation is \(ax + by = c\) before you combine.

**Elimination or substitution?** Substitution is faster when a letter is already alone. Elimination is faster when both equations are in \(ax + by = c\) form.

**Check.** Put your pair into the other original equation. If it works in both, you are done. On the SAT, you can also type both equations into Desmos and click the crossing.
```

## Easy
```task
bank: m-0867
highlight:
- "x + 2y = 6" :: This has \(+2y\).
- "x - 2y = 4" :: This has \(-2y\). Add the equations: \(y\) cancels.
- "What is the value of x?" :: Once \(y\) cancels, one step gives \(x\).
explain:
The \(y\) terms are \(+2y\) and \(-2y\), so adding the equations cancels \(y\):

\[(x + 2y) + (x - 2y) = 6 + 4\]

\[2x = 10\]

Divide by 2: \(x = 5\). The answer is **5** (choice B).

Check: put \(x = 5\) in the first equation. \(5 + 2y = 6\), so \(y = \frac{1}{2}\). Then the second equation gives \(5 - 2\left(\frac{1}{2}\right) = 4\), which is true. Choice D (10) is the value of \(2x\), a stopping-too-early mistake: divide by 2 before you answer. Choice C (6) is only the number on the right of the first equation, not a solution.
```

## Medium
```task
bank: m-12306
highlight:
- "(5/2)x − (1/5)y = 48" :: Fractions: multiply by 10 to clear them.
- "x + 2y = −12" :: After that, \(-2y\) and \(+2y\) cancel when you add.
- "What is the value of x + y?" :: Find both letters, then add them.
explain:
First clear the fractions in the top equation. Multiply every term by 10:

\[25x - 2y = 480\]

The second equation has \(+2y\), and the new first equation has \(-2y\). Add the two equations and \(y\) cancels:

\[26x = 468\]

So \(x = 18\). Put it in the second equation: \(18 + 2y = -12\), so \(2y = -30\) and \(y = -15\).

The question asks for \(x + y = 18 + (-15) = 3\). The answer is **3** (choice C).

Choice A, \(-12\), is only the number on the right of the second equation. Check in the first original equation: \(\frac{5}{2}(18) - \frac{1}{5}(-15) = 45 + 3 = 48\).
```

## Hard
```task
bank: m-13420
highlight:
- "22x − 21y = 43" :: Its \(y\) coefficient is \(-21\).
- "5x + 14y = 59" :: Its \(y\) coefficient is \(14\). The least match is 42.
- "(x, y) = (p/59, w/826)" :: \(x = \frac{p}{59}\), so \(p\) is the numerator of \(x\).
- "What is the value of p?" :: Only \(x\) is needed: cancel \(y\).
explain:
The answer needs only \(x\), so cancel \(y\). The \(y\) coefficients are \(-21\) and \(14\). Both go into 42, so multiply the first equation by 2 and the second by 3:

\[44x - 42y = 86\]
\[15x + 42y = 177\]

Add the equations. The \(y\) terms cancel:

\[59x = 263\]

So \(x = \frac{263}{59}\). The problem says \(x = \frac{p}{59}\), so \(p = 263\). Enter **263**.

Notice that you never need \(y\), and \(w\) is a distraction. Checking in Desmos would give a messy crossing, so elimination is faster here.
```

# Asked for a combo
Asked for x + y? Add or subtract first.

```visual
systems-linear--combine
```

## Key ideas
The SAT often asks for \(x + y\), \(3x + 3y\) or \(2y\), not for \(x\) alone. Read the question first. Then add or subtract the whole equations, and divide if you need to.

\[4x + 5y = 100 \quad\text{and}\quad 5x + 4y = 62\]

Adding gives \(9x + 9y = 162\). Divide by 9: \(x + y = 18\).

- **Swapped coefficients** (like 4 and 5, then 5 and 4): add for \(x + y\) and subtract for \(y - x\).
- **A repeated chunk:** if one equation says \(x + y = 20\) and another contains \(2(x + y) + 3y\), put 20 in for the chunk.
- **Grouped terms:** treat \(x - 2\) or \(8(y + 3)\) as one unknown.

**Trap:** if the question asks for \(x\) or \(y\) alone, you still have to solve fully.

```example
\(6x + 2y = 34\) and \(2x + 6y = 22\). Find \(x + y\) and \(x - y\).
1. \(8x + 8y = 56\), so \(x + y = 7\) :: Add, then divide by 8.
2. \(4x - 4y = 12\), so \(x - y = 3\) :: Subtract, then divide by 4.
```

```theory
**Coefficient.** The coefficient is the number in front of a letter. In \(5x + 4y\), the coefficient of \(x\) is 5. **Like terms** have the same letter, so \(5x\) and \(4x\) combine to \(9x\).

**Why combine?** Solving for \(x\) and \(y\) one at a time takes several steps and can create ugly fractions. If you only need \(x + y\), one addition does it. The SAT writes these questions so the shortcut works: the numbers are chosen so that adding or subtracting gives a clean multiple of what you want.

**How to spot it.** Look at the coefficients of both equations. If they are the same numbers in swapped order (3 and 7, then 7 and 3), adding gives equal coefficients, so you can divide to get \(x + y\). If one letter has the same coefficient in both (like \(6y\) and \(6y\)), subtracting cancels it.

**A repeated chunk.** Sometimes one equation hands you a value for a whole expression, like \(x + y = 20\). Anywhere that expression appears, replace it. This is substitution with a chunk instead of a letter.

**Grouped unknowns.** If the equations contain \(8(y + 3)\) or \((x - 2)\), you do not need to expand. Think of \(x - 2\) as one letter, say \(A\), and \(y + 3\) as \(B\). Add or subtract to find \(A\) or \(B\), then answer what is asked.

**When this fails.** If the question wants \(y\) or \(x\) alone, or a combination that does not match what adding or subtracting gives, solve the system fully and compute the answer. Always check what is being asked before you start.
```

## Easy
```task
bank: m-0963
highlight:
- "x + y = 20" :: This is a chunk you can reuse.
- "2(x + y) + 3y = 85" :: Replace \((x + y)\) here with 20.
- "what is the value of y ?" :: After replacing the chunk, only \(y\) is left.
explain:
The first equation tells you that \(x + y = 20\). The second equation contains the same chunk, \(x + y\), inside the parentheses. Replace it with 20:

\[2(20) + 3y = 85\]

\[40 + 3y = 85\]

\[3y = 45\]

\[y = 15\]

The answer is **15** (choice B).

Check: \(x = 20 - 15 = 5\). Then \(2(5 + 15) + 3(15) = 40 + 45 = 85\). It works. You never had to solve for \(x\) first. This is the same move as substitution, with the whole chunk \(x + y\) swapped for its value, so look for repeated chunks before you expand anything.
```

## Medium
```task
bank: m-0784
highlight:
- "7x - 5y = 4" :: The \(x\) coefficient is 7 and the \(y\) coefficient is \(-5\).
- "4x - 8y = 9" :: Subtract this one: \(7 - 4 = 3\) and \(-5 - (-8) = 3\).
- "what is the value of 3x + 3y ?" :: Subtracting gives exactly \(3x + 3y\).
explain:
Look at what is asked: \(3x + 3y\). Subtract the second equation from the first, term by term:

\[(7x - 4x) + (-5y - (-8y)) = 4 - 9\]

The \(x\) terms give \(3x\). The \(y\) terms give \(-5y + 8y = 3y\). The right side is \(-5\).

\[3x + 3y = -5\]

That is exactly the expression in the question, so the answer is **\(-5\)** (choice B). There is no need to solve for \(x\) and \(y\).

The trap is subtracting \(-8y\): it becomes \(+8y\). Always subtract every term of the second equation, including the right side.
```

## Hard
```task
bank: m-12521
highlight:
- "(x − 2) − 8(y + 3) = 123" :: Treat \(x - 2\) as one unknown and \(y + 3\) as another.
- "(x − 2) + 8(y + 3) = 432" :: Adding cancels the \(8(y + 3)\) terms.
- "What is the value of 10(x − 2)?" :: Find \(x - 2\), then multiply by 10.
explain:
Do not expand. Treat \(x - 2\) as one unknown, \(A\), and \(8(y + 3)\) as another, \(B\). The system is

\[A - B = 123 \quad\text{and}\quad A + B = 432\]

Add the equations. The \(B\) terms cancel:

\[2A = 555\]

So \(A = x - 2 = 277.5\). The question asks for \(10(x - 2)\):

\[10 \cdot 277.5 = 2775\]

Enter **2775**. You never need to find \(x\) or \(y\) separately. This is a typed answer, so give the number only. Check by putting \(A = 277.5\) back: \(B = 432 - 277.5 = 154.5\), and \(277.5 - 154.5 = 123\), which matches the first equation.
```

# Systems from stories
Name the unknowns. One equation per fact.

```visual
systems-linear--story
```

## Key ideas
Name each unknown with a letter. Then write **one equation per fact**. Most SAT stories give two kinds of facts: **how many** things, and **how much** they are worth.

\[s + a = 90 \qquad 6s + 11a = 715\]

The first equation counts students and adults. The second adds money: price times number, for each kind. A price **per item** multiplies the letter, and the equation ends with the **total**.

Solve with substitution (use the count equation to write \(s = 90 - a\)) or with elimination.

**Traps:**
- Answer the question asked. Choices often include the other unknown.
- A percent gives a multiplier: an 8% tax is \(\times 1.08\).
- In Desmos, **rename the letters to \(x\) and \(y\)**. Desmos treats other letters, like \(s\) and \(a\), as sliders, not unknowns.

```example
A museum sold 90 tickets for $715. Student tickets cost $6 and adult tickets cost $11. How many adult tickets were sold?
1. \(s + a = 90\) :: Count: students plus adults.
2. \(6s + 11a = 715\) :: Money: price times number.
3. \(6(90 - a) + 11a = 715\) :: Replace \(s\) with \(90 - a\).
4. \(540 + 5a = 715\), so \(a = 35\) :: Combine and solve.
```

```desmos
Same story, in Desmos. Let \(x\) be students and \(y\) be adults.
type x+y=90 :: Rename the letters: \(x\) students, \(y\) adults.
type 6x+11y=715
zoom 0 100 0 100
point (55, 35) :: The crossing: 55 students, 35 adults.
```

```theory
**Facts become equations.** Read the story one sentence at a time. Each sentence that gives a number is a fact. Two unknowns need two facts. If you find a third number you did not use, check whether it belongs in a different equation.

**Common shapes.**
- **Count:** \(a + c = 50\) (items add up).
- **Value:** \(12a + 8c = 520\) (price times number, added).
- **Distance:** \(r_1 t_1 + r_2 t_2 = d\) (rate times time).
- **Comparison:** "twice as many" gives \(b = 2r\), not \(r = 2b\). Be careful about which one is bigger.
- **Percent:** if a price \(p\) has 8% tax added, the total is \(1.08p\). If two items have different tax rates, use two multipliers.

**Example with percent.** A shirt \(s\) and a hat \(h\) cost $50 together before tax. With 8% tax on the shirt and 5% on the hat, the total is $53.40. The system is \(s + h = 50\) and \(1.08s + 1.05h = 53.40\). It gives \(s = 30\) and \(h = 20\).

**Which method?** Often the count equation lets you write one letter alone (\(s = 90 - a\)), so substitution works. If both equations are in \(ax + by = c\) form, elimination is fine.

**Choose-the-system questions.** Some questions give four systems and ask which one matches the story. Check each fact. The wrong choices usually swap prices, or swap the count with the total money. In the example above, "90 tickets" must end up next to \(s + a\), and "$715" next to the prices.

**Check.** Put your answers back into the story. Does the total come out right? Is each value possible (not negative, whole if it counts people)?
```

## Easy
```task
bank: m-0646
highlight:
- "costs $5" :: Standard tickets: $5 each, so \(5s\).
- "costs $12" :: Premium tickets: $12 each, so \(12p\).
- "a total of 250 tickets" :: Count equation: \(s + p = 250\).
- "$2,300 from ticket sales" :: Money equation: total is $2,300.
explain:
There are two facts. Match each to an equation.

**Fact 1, how many.** The zoo sold 250 tickets in total, so \(s + p = 250\).

**Fact 2, how much.** Standard tickets cost $5 each, so \(s\) of them cost \(5s\). Premium tickets cost $12 each, so \(p\) of them cost \(12p\). Together the sales were $2,300:

\[5s + 12p = 2{,}300\]

The system is \(s + p = 250\) and \(5s + 12p = 2{,}300\), which is choice **A**. Choice B swaps the prices. Choices C and D swap the counts and the dollar amounts.
```

## Medium
```task
bank: m-0644
highlight:
- "202 people" :: Total people: the second equation counts people.
- "60 tents" :: Total tents: \(t + f = 60\).
- "2 people each" :: Two-person tents hold 2 each: \(2t\).
- "4 people each" :: Four-person tents hold 4 each: \(4f\).
explain:
Let \(t\) be the number of 2-person tents and \(f\) the number of 4-person tents.

Tents: \(t + f = 60\). People: \(2t + 4f = 202\).

From the first equation, \(f = 60 - t\). Substitute into the second:

\[2t + 4(60 - t) = 202\]

\[2t + 240 - 4t = 202\]

\[-2t = -38\]

\[t = 19\]

There are **19** two-person tents (choice C). Check: 19 tents hold 38 people, and the other 41 tents hold \(41 \cdot 4 = 164\). \(38 + 164 = 202\). The question asks for the 2-person tents, so do not answer with \(f\) (41).
```

## Hard
```task
bank: m-0738
highlight:
- "5 miles per hour" :: Running time is \(\frac{r}{5}\) hours.
- "10 miles per hour" :: Biking time is \(\frac{b}{10}\) hours.
- "200 miles" :: First equation: \(r + b = 200\).
- "biked for twice as many hours as she ran" :: Compare times, not miles: \(\frac{b}{10} = 2 \cdot \frac{r}{5}\).
explain:
Distance equals rate times time, so time equals distance over rate. Morgan ran for \(\frac{r}{5}\) hours and biked for \(\frac{b}{10}\) hours.

Fact 1: the total distance is 200, so \(r + b = 200\).

Fact 2: biking took twice as many hours as running:

\[\frac{b}{10} = 2 \cdot \frac{r}{5}\]

Multiply both sides by 10: \(b = 4r\).

Substitute into the first equation: \(r + 4r = 200\), so \(r = 40\) and \(b = 160\).

The question asks for the miles she biked: **160** (choice D). Check: running took \(\frac{40}{5} = 8\) hours, biking took \(\frac{160}{10} = 16\) hours, and 16 is twice 8.
```

# Count the solutions
Cross once, never, or always: compare slopes.

```visual
systems-linear--three-cases
```

## Key ideas
Two lines can do only three things.

| Lines | Solutions |
|---|---|
| Different slopes: they cross once | exactly one |
| Same slope, different intercepts: parallel | zero (none) |
| The same line written twice | infinitely many |

Never "exactly two". Put both equations in \(y = mx + b\) form and compare the slopes \(m\) first.

In \(ax + by = c\) form, compare the ratios of the coefficients:

\[\frac{a_1}{a_2} \ne \frac{b_1}{b_2}: \text{ one} \qquad \frac{a_1}{a_2} = \frac{b_1}{b_2} \ne \frac{c_1}{c_2}: \text{ none} \qquad \frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}: \text{ infinitely many}\]

Easier in practice: multiply one equation so the left sides match. Right sides different means none. Right sides the same means infinitely many.

**Trap:** rewrite first. The SAT hides parallel lines with terms out of order or on both sides.

```example
\(2x + 5y = 7\) and \(6x + 15y = 20\). How many solutions?
1. \(6x + 15y = 21\) :: Multiply the first equation by 3.
2. \(21 \ne 20\) :: Same left side, different right side.
3. Zero solutions :: Parallel lines never cross.
```

```desmos
See it. \(x + 2y = 4\) and \(2x + 4y = 3\).
type x+2y=4 :: Type each equation on its own line.
type 2x+4y=3
zoom -4 8 -3 5
say :: Parallel: they never meet, so no solution.
```

```theory
**Terms.** A **solution** of a system is a point on both lines. **Parallel** lines have the same slope and never meet. **Equivalent** equations have the same graph, so each point on the line is a solution.

**Why exactly three cases.** Two different lines in a plane either cross at one point or never touch (parallel). Two lines that are the same have every point in common. Two straight lines can never cross twice, so "exactly two" is never right.

**Exactly one solution.** Any two lines with different slopes cross exactly once. You do not need to find the crossing to know this. For \(y = 3x + 2\) and \(y = -x + 7\), the slopes 3 and \(-1\) differ, so there is exactly one solution.

**Slope from \(ax + by = c\).** Solve for \(y\): \(y = -\frac{a}{b}x + \frac{c}{b}\). So the slope is \(-\frac{a}{b}\). Two equations in this form have the same slope when \(\frac{a_1}{b_1} = \frac{a_2}{b_2}\).

**Zero versus infinitely many.** Suppose the left sides match after you multiply. If the right sides match too, the equations are the same line: infinitely many solutions. If they do not match, the same expression would have to equal two different numbers, which is impossible: zero solutions.

**Questions are worded in many ways.** "How many solutions?", "At how many points do the graphs intersect?", "Which system has no solution?" and "Which system has infinitely many solutions?" all test the same idea.

**Hidden forms.** Equations like \(3x = 2y + 5\) are not in standard form yet. Move terms: \(3x - 2y = 5\). Divide out common factors before you compare.
```

## Easy
```task
bank: m-0626
highlight:
- "y = x + 20" :: This line has slope 1.
- "y = 8x" :: This line has slope 8.
- "intersect" :: Different slopes always cross exactly once.
explain:
Both equations are in \(y = mx + b\) form, so read the slopes. The first, \(y = x + 20\), has slope 1. The second, \(y = 8x\), has slope 8.

The slopes are different, so the lines are not parallel and they are not the same line. They cross at exactly one point.

The answer is **1** (choice B).

If you want to see where, set the right sides equal: \(x + 20 = 8x\), so \(7x = 20\) and \(x = \frac{20}{7}\). But the question only asks how many points.
```

## Medium
```task
bank: m-0614
highlight:
- "-12x + 14y = 36" :: Make the other left side match \(-12x + 14y\).
- "-6x + 7y = -18" :: Multiply by 2: \(-12x + 14y = -36\).
- "How many solutions" :: Same left side, different right side: parallel.
explain:
Make the left sides match. The first equation has \(-12x + 14y\). Multiply the second equation, every term, by 2:

\[-12x + 14y = -36\]

Now the two equations say

\[-12x + 14y = 36 \quad\text{and}\quad -12x + 14y = -36\]

The same expression cannot equal both 36 and \(-36\). The lines have the same slope but different intercepts, so they are parallel and never meet.

The system has **zero** solutions (choice D). Choice C, infinitely many, would need the right sides to match too.
```

## Hard
```task
bank: m-0603
highlight:
- "7x + 6y = 5" :: The first line.
- "28x + 24y = 20" :: This is the first equation times 4: the same line.
- "lies on the graph of each equation" :: Need a point on both lines, so any point of this one line.
explain:
Compare the equations: \(28 = 4 \cdot 7\), \(24 = 4 \cdot 6\) and \(20 = 4 \cdot 5\). The second equation is the first multiplied by 4, so both equations have the same graph. A point lies on both graphs exactly when it lies on \(7x + 6y = 5\).

Now test the choices. Take choice D, \(\left(-\frac{6r}{7} + \frac{5}{7},\; r\right)\). Then \(7x = -6r + 5\) and \(y = r\), so

\[7x + 6y = -6r + 5 + 6r = 5\]

It works for every \(r\). The other choices fail. For choice A, \(7r + 6\left(-\frac{6r}{7} + \frac{5}{7}\right) = \frac{13r + 30}{7}\), which is not 5 for every \(r\).

The answer is choice **D**.
```

# Find the constant
Match the left sides. Then read the right.

```visual
systems-linear--lines
```

## Key ideas
A letter like \(k\) or \(a\) hides in one equation. Decide what the question wants, then match the lines.

- **No solution:** the left sides match (after you multiply), the right sides differ.
- **Infinitely many:** everything matches, right sides too. If two letters are unknown, set both.
- **Exactly one:** the slopes differ. The constant can be **anything except** the one value that makes them equal.
- **Given solution \((p, q)\):** put \(x = p\) and \(y = q\) into the equation and solve for the letter.

\[3x - 5y = 4 \quad\text{and}\quad kx + 10y = 9\]

Multiply the first by \(-2\): \(-6x + 10y = -8\). The left sides match when \(k = -6\), and \(-8 \ne 9\): no solution.

**Trap:** rewrite each equation as \(ax + by = c\) first. The SAT puts terms on both sides or in a different order.

```example
\(5x - 2y = 8\) and \(15x + ky = 30\). For which \(k\) is there no solution?
1. \(15x - 6y = 24\) :: Multiply the first equation by 3.
2. \(k = -6\) :: The \(y\) coefficients must match.
3. \(24 \ne 30\) :: Right sides differ: no solution.
```

```desmos
Find \(k\) with a slider. \(5x - 2y = 8\) and \(15x + ky = 30\).
slider k = 0
type 5x-2y=8 :: Type the first line.
type 15x+ky=30 :: The second line moves with \(k\).
zoom -5 7 -12 8
slider k = 0 .. -6 :: At \(k = -6\) the lines are parallel.
```

```theory
**Constants.** A constant is a number that is fixed but unknown, like \(k\). Your job is to find which values of it give the case in the question.

**No solution means parallel.** The slopes must match, so the left sides are multiples of each other. The right sides must **not** match. When the question says "no solution", first find the \(k\) that matches the left sides. Then check that the right sides differ (they usually do automatically).

**Infinitely many means the same line.** Everything must match, including the constant on the right. If the second equation is \(ax + 9y = b\) and the first is \(2x + 3y = 6\), multiply the first by 3: \(6x + 9y = 18\). So \(a = 6\) and \(b = 18\).

**Exactly one means different slopes.** For \(kx + 4y = 9\) and \(3x + 2y = 5\), the slopes are \(-\frac{k}{4}\) and \(-\frac{3}{2}\). They are equal only when \(k = 6\), so exactly one solution for every \(k\) except 6. The SAT may ask "which value can NOT \(k\) be", or "which of these gives exactly one solution". "At least one solution" means one or infinitely many: just avoid the zero case.

**Given the solution.** If you are told the system has solution \((3, 2)\) and one equation is \(kx + 2y = 11\), put in \(x = 3\) and \(y = 2\): \(3k + 4 = 11\).

**Hidden forms.** Equations like \(48x - 64y = 48y + 24\) need rearranging first: \(48x - 112y = 24\). Divide by a common factor if you like. Then compare with the other equation in the same form.
```

## Easy
```task
bank: m-0964
highlight:
- "y = 2x + 1" :: Slope 2, intercept 1.
- "y = ax - 8" :: Slope \(a\), intercept \(-8\).
- "no solution" :: Parallel: same slope, different intercept.
explain:
Both equations are in \(y = mx + b\) form. The first has slope 2 and \(y\)-intercept 1. The second has slope \(a\) and \(y\)-intercept \(-8\).

A system has no solution when the lines are parallel and different. The intercepts \(1\) and \(-8\) already differ, so the lines are different. For them to be parallel, the slopes must be equal:

\[a = 2\]

The answer is **2** (choice D). If \(a\) were anything else, the slopes would differ and the lines would cross once.
```

## Medium
```task
\(kx + 4y = 9\)
\(3x + 2y = 5\)
In the given system of equations, \(k\) is a constant. If the system has exactly one solution, which of the following CANNOT be the value of \(k\)?
- \(-6\) :: The slopes are \(\frac{3}{2}\) and \(-\frac{3}{2}\): different, so one solution.
- \(0\) :: A horizontal line crosses the other line once.
- \(3\) :: The slopes are \(-\frac{3}{4}\) and \(-\frac{3}{2}\): different.
* \(6\)
highlight:
- "\(kx + 4y = 9\)" :: Its slope is \(-\frac{k}{4}\).
- "\(3x + 2y = 5\)" :: Its slope is \(-\frac{3}{2}\).
- "exactly one solution" :: The slopes must be different.
- "CANNOT" :: Look for the one value that makes the slopes equal.
explain:
Exactly one solution means the lines have different slopes. Write each slope from \(ax + by = c\) as \(-\frac{a}{b}\).

First equation: slope \(-\frac{k}{4}\). Second equation: slope \(-\frac{3}{2}\).

The slopes are equal when \(-\frac{k}{4} = -\frac{3}{2}\), so \(k = 6\). For every other \(k\) the slopes differ, and there is exactly one solution.

So \(k\) cannot be **6** (the last choice). Check: with \(k = 6\), the first equation is \(6x + 4y = 9\) and the second doubled is \(6x + 4y = 10\). These are parallel lines, so the system has no solution. The values \(-6\), \(0\) and \(3\) all give different slopes.
```

## Hard
```task
bank: m-0638
highlight:
- "48x - 64y = 48y + 24" :: Move \(y\) terms together: \(48x - 112y = 24\).
- "ry = 1/8 - 12x" :: Rewrite as \(12x + ry = \frac{1}{8}\).
- "no solution" :: Left sides must match; right sides must differ.
explain:
First put both equations in \(ax + by = c\) form.

Equation 1: \(48x - 64y = 48y + 24\). Move \(48y\) to the left: \(48x - 112y = 24\). Divide by 8: \(6x - 14y = 3\).

Equation 2: \(ry = \frac{1}{8} - 12x\). Move \(12x\) to the left: \(12x + ry = \frac{1}{8}\).

No solution means the left sides are proportional. The \(x\) coefficient doubled (6 to 12), so the \(y\) coefficient must double too:

\[r = 2(-14) = -28\]

Check the right sides: doubling the first gives \(12x - 28y = 6\), and \(6 \ne \frac{1}{8}\). The lines are parallel and different, so there is no solution.

Enter **\(-28\)**.
```

