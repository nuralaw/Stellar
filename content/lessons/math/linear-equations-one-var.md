---
title: Linear Equations in One Variable
skill: linear-equations-one-var
domain: algebra
section: math
summary: Solve for x, clear fractions, count solutions, and rearrange formulas.
---

# Solve step by step
Same move on both sides until \(x\) stands alone.

```visual
linear-equations-one-var--balance
```

## Key ideas
An equation is a balance: whatever you do to one side, do to the other, and it stays true. The goal is to get the unknown \(x\) alone.

1. **Open brackets.** The number outside multiplies every term inside. A minus sign in front flips every sign inside.
2. **Collect.** Put the \(x\)-terms on one side and the plain numbers on the other.
3. **Divide** by the number in front of \(x\).

\[ax + b = c \quad\Rightarrow\quad x = \frac{c - b}{a}\]

For instance, \(5x - 4 = 2x + 11\) becomes \(3x = 15\), so \(x = 5\). The classic trap is a minus before a bracket: \(-2(x - 4)\) is \(-2x + 8\), not \(-2x - 8\). Always put your answer back into the original equation to check it.

```example
\(9 - 2(x - 4) = 3\). Find \(x\).
1. \(9 - 2x + 8 = 3\) :: The minus flips both signs inside.
2. \(17 - 2x = 3\) :: Combine \(9 + 8\).
3. \(-2x = -14\) :: Subtract 17 from both sides.
4. \(x = 7\) :: Divide by \(-2\). Check: \(9 - 2(3) = 3\).
```

```theory
A **variable** is a letter, like \(x\), that stands for a number. A **term** is a piece joined by plus or minus: \(5x\) and \(-4\) are terms. **Like terms** have the same letter part, so \(5x\) and \(2x\) combine into \(7x\). The **coefficient** is the number multiplying the letter: in \(5x\) it is 5. A **constant** is a plain number.

Why may you do the same thing to both sides? An equation says two amounts are equal. Adding, subtracting, multiplying or dividing both amounts by the same number keeps them equal. Each move undoes one operation: subtraction undoes addition, and division undoes multiplication.

When \(x\) is on both sides, subtract the smaller \(x\)-term. In \(5x - 4 = 2x + 11\), subtract \(2x\); the coefficient stays positive and sign slips are rarer. Dividing by a negative number changes the sign: \(-2x = -14\) gives \(x = 7\), not \(-7\).

Check by substituting into the original equation, never into your last line.

Two SAT shortcuts. **Backsolving:** when the choices are numbers, plug them in. Start with B or C: the choices are in order, so one test tells you whether to go up or down. **Desmos:** type each side as its own line, for example \(y = 5x - 4\) and \(y = 2x + 11\). The \(x\)-coordinate of the crossing is the answer.

The SAT words this as "What value of \(p\) satisfies the equation...", "For what value of \(w\) does...". Wrong choices are often a middle result, like 15 for \(3x = 15\).
```

## Easy
```task
bank: m-0874
highlight:
- "For what value of w" :: Solve for \(w\). The answer must make both sides equal.
- "2(w + 5)" :: The 2 multiplies both terms: \(2w + 10\), not \(2w + 5\).
- "w - 10" :: Subtract \(w\) from both sides, then deal with the numbers.
explain:
Open the bracket: \(2(w + 5) = 2w + 10\), so the equation is \(w - 10 = 2w + 10\). Subtract \(w\) from both sides: \(-10 = w + 10\). Subtract 10 from both sides: \(-20 = w\).

Check: the left side is \(-20 - 10 = -30\). The right side is \(2(-20 + 5) = 2(-15) = -30\). Both sides match, so \(w = -20\), which is choice D.

Choice C, \(-15\), is the value of \(w + 5\), not of \(w\). Whenever a question asks for the letter itself, make sure you stop at the letter and not at a bracket you built along the way.
```

## Medium
```task
The equation \(-3(x - 2) + 1 = 5x - 17\) is true for exactly one value of \(x\). What is that value?
- \(\frac{3}{2}\) :: You wrote \(-3x - 6\). A minus times a minus is plus.
* 3
- \(-3\) :: Sign slip. After collecting, \(24 = 8x\), which is positive.
- 24 :: That is \(8x\). Divide both sides by 8.
~ type y=-3(x-2)+1 :: Type each side as its own line.
~ type y=5x-17
~ zoom -5 10 -30 30
~ point (3, -2) :: Click the crossing: \(x = 3\).
highlight:
- "\(-3(x - 2) + 1 = 5x - 17\)" :: Open the bracket first: \(-3 \cdot -2 = +6\).
- "What is that value?" :: Collect the \(x\)-terms on one side, the numbers on the other.
explain:
Open the bracket: \(-3(x - 2) = -3x + 6\). The left side becomes \(-3x + 6 + 1 = -3x + 7\), so the equation is \(-3x + 7 = 5x - 17\).

Add \(3x\) to both sides: \(7 = 8x - 17\). Add 17 to both sides: \(24 = 8x\). Divide by 8: \(x = 3\).

Check: the left side is \(-3(3 - 2) + 1 = -2\), and the right side is \(5(3) - 17 = -2\). The answer is 3.

Where the wrong choices come from: \(\frac{3}{2}\) results from writing \(-3x - 6\) for the bracket, 24 is the value of \(8x\) before the last division, and \(-3\) is a sign slip at the very end.
```

## Hard
```task
What is the solution to the equation \(5(x - 2) - 3(4 - x) = 2(3x + 1) + 8\)?
answer: 16
- -8 :: The minus before \(3(4 - x)\) flips both signs: \(-12 + 3x\).
- 4 :: After collecting you have \(2x = 32\). Divide by 2, not 8.
~ type y=5(x-2)-3(4-x) :: Type each side as its own line.
~ type y=2(3x+1)+8
~ zoom -2 24 -40 160
~ point (16, 106) :: Click the crossing: \(x = 16\).
highlight:
- "What is the solution" :: Solve for \(x\), then check it in the original equation.
- "\(5(x - 2) - 3(4 - x) = 2(3x + 1) + 8\)" :: Open all brackets. The minus before \(3(4 - x)\) flips both signs.
explain:
Open each bracket. \(5(x - 2) = 5x - 10\). \(-3(4 - x) = -12 + 3x\): the minus flips both signs. The left side is \(5x - 10 - 12 + 3x = 8x - 22\).

The right side is \(2(3x + 1) + 8 = 6x + 2 + 8 = 6x + 10\).

Now \(8x - 22 = 6x + 10\). Subtract \(6x\): \(2x - 22 = 10\). Add 22: \(2x = 32\). Divide by 2: \(x = 16\).

Check: the left side is \(5(14) - 3(-12) = 70 + 36 = 106\). The right side is \(2(49) + 8 = 106\). The answer is 16.

With three brackets, write every line and keep the signs in brackets as you go. The two wrong values come from the usual slips: a sign error on \(-3(4 - x)\) gives \(-8\), and dividing by the wrong coefficient gives 4.
```

# Fractions and decimals
Multiply every term to clear the denominators.

```visual
linear-equations-one-var--clear-denominators
```

## Key ideas
Fractions and decimals are easier to remove than to fight. Multiply **every** term, on both sides, by a number that makes them all whole.

- **Fractions:** use the least common denominator, the smallest number that every denominator divides into. For \(\frac{x}{2}\) and \(\frac{x}{3}\) it is 6.
- **Decimals:** use 10, 100 or 1000: one zero for each decimal place of the longest decimal.
- **One fraction on a letter:** \(\frac{4x}{5} = 20\) needs only a \(\times 5\), then a division by 4.

\[\frac{x}{2} + \frac{x}{3} = 10 \quad\Rightarrow\quad 3x + 2x = 60\]

Trap: clearing the fractions but forgetting the plain number. The 10 here must become 60.

```example
\(0.4x + 1.5 = 0.25x + 3\). Find \(x\).
1. \(40x + 150 = 25x + 300\) :: Multiply every term by 100.
2. \(15x = 150\) :: Subtract \(25x\) and 150.
3. \(x = 10\) :: Divide by 15.
```

```theory
The **denominator** is the bottom number of a fraction. A **common denominator** is a number that all the denominators divide into, and the **least** common denominator is the smallest one. Multiplying a whole equation by a nonzero number gives an equation with the same solution, so you may multiply both sides. But you must multiply **every** term, including whole numbers: \(6 \cdot 10\), not just 10.

If a fraction has a sum on top, such as \(\frac{x + 1}{3}\), the bracket survives: \(3 \cdot \frac{x + 1}{3} = x + 1\).

For decimals, count the digits after the point. \(1.5\) has one and \(0.25\) has two, so use 100. Every term is then a whole number.

A fraction coefficient can also be removed with its **reciprocal**, the fraction flipped. In \(\frac{2}{5}k = 8\), multiply both sides by \(\frac{5}{2}\): \(k = 20\).

Look for a repeated group before you start. In \(\frac{1}{4}(x + 5) - \frac{1}{3}(x + 5) = -7\), multiply by 12 and the two groups combine.

SAT answers can be fractions. A repeating decimal must fill the answer grid (for \(\frac{2}{3}\): .6666 or .6667), so type a fraction whenever you can.
```

## Easy
```task
bank: m-0700
highlight:
- "(4x)/5 = 20" :: A fraction on \(x\). Multiply both sides by 5 to remove it.
- "what is the value of x" :: After \(4x = 100\), divide by 4.
explain:
The fraction \(\frac{4x}{5}\) means "\(4x\) divided by 5". Undo the division by multiplying both sides by 5: \(4x = 100\). Now \(x\) is multiplied by 4, so divide both sides by 4: \(x = 25\).

Check: \(\frac{4(25)}{5} = \frac{100}{5} = 20\), which matches the right side. The answer is 25, choice A. A quick sense check: if \(x\) were 15 (choice D), \(\frac{4x}{5}\) would be 12, which is too small.
```

## Medium
```task
bank: m-1107
highlight:
- "(1/4)(x + 5) - (1/3)(x + 5)" :: Multiply by 12 to clear both fractions: \(3(x + 5) - 4(x + 5)\).
- "= -7" :: Multiply this side by 12 too: it becomes \(-84\).
- "What value of x" :: The group \(x + 5\) comes out as 84. Subtract 5 to get \(x\).
explain:
Multiply every term by 12, the least common denominator of 4 and 3: \(3(x + 5) - 4(x + 5) = -84\).

The same group appears twice, so combine: \((3 - 4)(x + 5) = -84\), which is \(-(x + 5) = -84\). So \(x + 5 = 84\) and \(x = 79\).

Check: \(\frac{1}{4}(84) - \frac{1}{3}(84) = 21 - 28 = -7\), which matches the right side. The answer is 79, choice C.

Choice B, \(-5\), would make \(x + 5\) equal 0, and then the left side would be 0, not \(-7\). The last step matters: 84 is the value of \(x + 5\), so subtract 5 to reach \(x\).
```

## Hard
```task
bank: m-14416
highlight:
- "7(w − 0.001)" :: The 7 multiplies both terms: \(7w - 0.007\).
- "0.7w − 0.57" :: Decimals: collect the \(w\)-terms carefully, or multiply everything by 1000.
- "What value of w" :: Solve for \(w\). Expect a small fraction or decimal.
explain:
Distribute the 7 to both terms: \(7(w - 0.001) = 7w - 0.007\). The equation is \(0.7w - 0.57 = 7w - 0.007\).

Subtract \(0.7w\) from both sides and add 0.007 to both sides: \(-0.563 = 6.3w\).

Divide by 6.3: \(w = -\frac{0.563}{6.3} = -\frac{563}{6300}\), about \(-0.0894\). Enter \(-563/6300\), or the decimal \(-.0893\) or \(-.0894\).

The trap is multiplying the 7 by \(w\) only and forgetting the 0.001. Another way in is to multiply every term by 1000 first, which gives whole numbers: \(700w - 570 = 7000w - 7\).
```

# Fees and rates
A fee stands alone. A rate multiplies the units.

```visual
linear-equations-one-var--fee-rate
```

## Key ideas
Most word problems here follow one pattern.

\[\text{total} = \text{fee} + \text{rate} \cdot \text{units}\]

A **fee** is paid once, so it stands alone. A **rate** is the price for **one** unit ("$5 per hour"), so it multiplies the number of units. Name your variable by what it counts, and answer what the question asks.

Two traps:

- **A rate per several units.** "25 miles per gallon" or "3 gallons for every 40 miles" is not a rate per 1 unit. Divide first: 3 gallons per 40 miles is \(\frac{3}{40}\) gallon per mile.
- **A fee that covers the first N units.** If $12 pays for the first 2 hours and each later hour costs $4, only the hours after 2 pay the rate: \(12 + 4(h - 2)\).

```example
A bike rental costs an $8 fee plus $5 per hour. Sam paid $33. For how many hours did he rent it?
1. \(8 + 5h = 33\) :: Fee plus rate times hours equals the total.
2. \(5h = 25\) :: Subtract the fee.
3. \(h = 5\) :: Divide by 5.
```

```theory
A **fee** is a charge you pay once. Words that signal it: "one-time", "initial", "enrollment", "down payment", "deposit", "flat". A **rate** is a price or amount **per one unit**: "per hour", "each", "every". The word "per" means "divided by", so "$5 per hour" is \(\frac{5}{1}\), the cost of one hour.

The rule "rate times the letter" holds only when the rate is per 1 unit. "2 scoops per 15 pounds" means \(\frac{2}{15}\) scoop per pound. "25 miles per gallon" means each mile uses \(\frac{1}{25}\) gallon, and gas at $4 per gallon costs \(\frac{4}{25}\) dollars per mile. Convert before you build the equation.

When one price covers the first N units, the rate applies only to the extra units, \(x - N\). Test your rule at \(x = N\): it must give the first price.

The solution of the equation is the value of the variable, so it has units: "5" means 5 hours. If a question asks what a number in the equation means, match it to the unit it multiplies or the thing it stands alone as.

Backsolving works well here: test a choice in the story, such as "36 + 19 times 8 months".
```

## Easy
```task
bank: m-0865
highlight:
- "onetime $36 enrollment fee" :: Charged once, so it stands alone in the equation.
- "$19 per month" :: A rate per 1 month: it multiplies the number of months.
- "a total of $188" :: Fee plus rate times months equals this total.
explain:
Let \(m\) be the number of months. The fee is paid once and the membership costs $19 for each month, so \(36 + 19m = 188\).

Subtract 36 from both sides: \(19m = 152\). Divide by 19: \(m = 8\).

Check: \(36 + 19(8) = 36 + 152 = 188\). The answer is 8 months, choice C.

Choice D, about 10, comes from dividing 188 by 19 and forgetting the fee. The fee is part of the $188, so remove it before you divide by the rate.
```

## Medium
```task
bank: m-0657
highlight:
- "25 miles per gallon of gasoline" :: One gallon covers 25 miles, so each mile uses \(\frac{1}{25}\) gallon.
- "$4 per gallon" :: Each mile costs \(\frac{4}{25}\) dollars of gas.
- "reduce his weekly expenditure on gasoline by $5" :: Driving \(m\) fewer miles saves \(\frac{4}{25}m\), and that must equal 5.
explain:
The equation must measure money saved. First find the cost of one mile. The car uses \(\frac{1}{25}\) gallon per mile, and gas costs $4 per gallon, so one mile costs \(4 \cdot \frac{1}{25} = \frac{4}{25}\) dollars.

Driving \(m\) fewer miles saves \(\frac{4}{25}m\) dollars. Alan wants to save $5, so \(\frac{4}{25}m = 5\), choice D.

Choice B uses \(\frac{25}{4}\), miles per dollar, instead of dollars per mile. The number 100 miles and the 95 in choices A and C are not needed: the question asks for the miles he should cut, not the miles left.
```

## Hard
```task
A parking garage charges a $3 booking fee, plus $12 for the first 2 hours of parking and $4 for each additional hour. Dee paid $39 in total. For how many hours did she park?
answer: 8
- 6 :: That is the number of extra hours. Add the first 2 hours.
- 9 :: You charged $4 for every hour. The first 2 hours cost $12.
~ type y=15+4(x-2) :: Cost after \(x\) hours (for \(x\) at least 2).
~ type y=39
~ zoom 0 14 0 50
~ point (8, 39) :: Click the crossing: 8 hours.
highlight:
- "$3 booking fee" :: Charged once, so it stands alone.
- "$12 for the first 2 hours" :: One price covers 2 hours. Only later hours pay the rate.
- "$4 for each additional hour" :: This rate multiplies \(h - 2\), the hours after the first 2.
- "$39 in total" :: Fee plus first price plus extra-hour cost equals 39.
explain:
Let \(h\) be the number of hours, with \(h > 2\). The booking fee is $3 and the first 2 hours cost $12. The hours after the first 2 number \(h - 2\), and each costs $4. So

\[3 + 12 + 4(h - 2) = 39\]

Combine the fixed charges: \(15 + 4(h - 2) = 39\). Subtract 15: \(4(h - 2) = 24\). Divide by 4: \(h - 2 = 6\). So \(h = 8\).

Check: \(3 + 12 + 4(6) = 39\). Dee parked for 8 hours. The answer 6 is only the extra hours.
```

# Solve for the block
Spot the repeated group. Solve for it, not for \(x\).

```visual
linear-equations-one-var--block
```

## Key ideas
Some questions ask for a whole expression, such as \(x - 4\) or \(4 - 3x\), instead of \(x\). Don't solve for \(x\). Call the repeated group \(u\), solve for \(u\), and stop.

\[a(E) + c = b(E) + d \quad\Rightarrow\quad (a - b)\,E = d - c\]

Here \(E\) is the repeated group. In \(5(x + 4) = 4(x + 4) + 29\), take \(E = x + 4\): then \(5E = 4E + 29\), so \(E = 29\) at once.

Groups can hide. If the question asks for \(x - 7\) and the equation has \(4x - 28\), factor it: \(4x - 28 = 4(x - 7)\).

Special case: \(a(E) = b(E)\) with \(a \ne b\) forces \(E = 0\), because only zero equals two different multiples of itself. Then solve \(E = 0\) for \(x\).

```example
\(3(x - 4) + 2 = 20\). Find the value of \(x - 4\).
1. \(3(x - 4) = 18\) :: Subtract 2 from both sides.
2. \(x - 4 = 6\) :: Divide by 3. Stop here.
```

```theory
An **expression** is a group of terms like \(x - 4\); an **equation** says two expressions are equal. When a question asks for the value of an expression, the equation was built so that this expression is easy to reach. Replacing it with a single letter \(u\) turns a messy equation into a one-step or two-step equation: \(3u + 2 = 20\) gives \(u = 6\).

Solving for \(x\) first still works, but it takes more steps, and the answer choices include the value of \(x\) as a trap. For \(3(x - 4) + 2 = 20\), \(x = 10\) is a wrong choice if the question asks for \(x - 4\).

Ask yourself: what is repeated, and what does the question want? Sometimes the match is hidden, as with \(4x - 28\) and \(x - 7\). Factor the equation until the wanted group appears.

The \(a(E) = b(E)\) case: \(7(2x - 1) = 3(2x - 1)\) means \(4(2x - 1) = 0\) after subtracting, so \(2x - 1 = 0\) and \(x = \frac{1}{2}\). Dividing both sides by \(2x - 1\) would lose that solution, so subtract instead.

The SAT words it: "what is the value of \(x + 4\)?", "what is the value of \(4 - 3x\)?", "If \(x\) is the solution to the equation above, what is the value of \(x - 3\)?".
```

## Easy
```task
bank: m-0566
highlight:
- "4x - 28 = -24" :: The left side factors: \(4x - 28 = 4(x - 7)\).
- "what is the value of x - 7" :: Stop at the group \(x - 7\). You do not need \(x\).
explain:
Factor the left side: \(4x - 28 = 4(x - 7)\). The equation becomes \(4(x - 7) = -24\). Divide both sides by 4: \(x - 7 = -6\).

The question asks for \(x - 7\), so the answer is \(-6\), choice C.

Solving for \(x\) the long way also works: \(4x = 4\), so \(x = 1\), and then \(1 - 7 = -6\). It gives the same answer with an extra step. Notice that \(x = 1\) is not among the choices, because the question asks for the group, not for \(x\).
```

## Medium
```task
bank: m-1133
highlight:
- "9(4 - 3x) + 2 = 8(4 - 3x) + 18" :: The group \(4 - 3x\) repeats on both sides. Call it \(u\).
- "what is the value of 4 - 3x" :: The question wants \(u\) itself, not \(x\).
explain:
Let \(u = 4 - 3x\). The equation becomes \(9u + 2 = 8u + 18\).

Subtract \(8u\) from both sides: \(u + 2 = 18\). Subtract 2 from both sides: \(u = 16\).

So \(4 - 3x = 16\). There is no need to find \(x\). The answer is 16, choice D.

Notice how little work this took compared with expanding both brackets and solving for \(x\). Check: with \(u = 16\), the left side is \(9(16) + 2 = 146\) and the right side is \(8(16) + 18 = 146\). Choice B, \(-4\), is the value of \(x\) (since \(4 - 3(-4) = 16\)), not of \(4 - 3x\).
```

## Hard
```task
What is the solution to the equation \(-4(3x + 5) = -9(3x + 5)\)?
answer: -5/3
- 0 :: The group \(3x + 5\) is 0, not \(x\). Solve \(3x + 5 = 0\).
- 5/3 :: Sign slip. \(3x + 5 = 0\) gives \(3x = -5\).
~ type y=-4(3x+5) :: Type each side as its own line.
~ type y=-9(3x+5)
~ zoom -4 2 -12 12
~ point (-5/3, 0) :: They cross on the \(x\)-axis: \(x = -\frac{5}{3}\).
highlight:
- "What is the solution" :: Look for a repeated group before expanding anything.
- "\(-4(3x + 5) = -9(3x + 5)\)" :: The group \(3x + 5\) has different multipliers on each side.
explain:
The group \(3x + 5\) is on both sides. Let \(E = 3x + 5\). Then \(-4E = -9E\).

Add \(9E\) to both sides: \(5E = 0\), so \(E = 0\). Two different multiples of the same quantity are equal only when the quantity is zero.

Now \(3x + 5 = 0\), so \(3x = -5\) and \(x = -\frac{5}{3}\).

Check: both sides equal \(-4(0) = 0\). The answer is \(-\frac{5}{3}\), entered as -5/3.

Do not expand first. Expanding gives \(-12x - 20 = -27x - 45\), which also leads to \(15x = -25\) and the same \(x = -\frac{5}{3}\), but it takes longer and invites slips. The wrong value 0 is the value of the group, not of \(x\).
```

# Count the solutions
Simplify. Same \(x\)-terms? Compare the plain numbers.

```visual
linear-equations-one-var--solutions
```

## Key ideas
Simplify both sides to \(ax + b = cx + d\), then compare:

| \(x\)-terms | Plain numbers | Solutions |
|---|---|---|
| \(a \ne c\) | any | exactly one |
| \(a = c\) | \(b \ne d\) | zero |
| \(a = c\) | \(b = d\) | infinitely many |

If \(x\) cancels and you get a false line like \(4 = 7\), there are **zero** solutions. If you get a true line like \(6 = 6\), there are **infinitely many**: the equation is true for all values of \(x\).

A constant can hide in a coefficient. In \((b - 2)x = 8\), the case \(b = 2\) gives \(0 \cdot x = 8\), which is false for every \(x\): zero solutions.

For "no solution", make the \(x\)-coefficients equal and keep the plain numbers different. For "infinitely many", make both parts equal.

```example
\(kx + 5 = 3x + 9\) has no solution. What is \(k\)?
1. \(k = 3\) :: Equal \(x\)-coefficients make \(x\) cancel.
2. \(3x + 5 = 3x + 9\) :: Put \(k = 3\) in.
3. \(5 = 9\) :: False for every \(x\): no solution.
```

```theory
A **solution** is a value of \(x\) that makes the equation true. Picture each side as a line: the solutions are the \(x\)-values where the lines meet. Lines with different slopes cross once (one solution). Parallel lines never meet (zero). Two copies of the same line meet everywhere (infinitely many).

A linear equation never has exactly two solutions. The SAT lists choices like "Zero, Exactly one, Exactly two, Infinitely many". Say "zero", not "none".

In "In the given equation, \(k\) is a constant", the letters \(k\), \(a\), \(b\) are constants, numbers you choose to make the statement true, while \(x\) is the variable. Two constants at once: \(ax + 6 = 4x + b\) has infinitely many solutions only if both sides are identical, so \(a = 4\) and \(b = 6\).

"True for all values of \(x\)" means the same as infinitely many solutions.

For "which of the following must be true" questions, such as \(9x + 5 = a(x + b)\) with no solution: expand to \(9x + 5 = ax + ab\). Then \(a = 9\) and \(ab \ne 5\), so \(b \ne \frac{5}{9}\).

In Desmos, type each side as a line, or put a slider on the constant and watch when the lines become parallel.
```

## Easy
```task
bank: m-0838
highlight:
- "12(x - 3) = -3(x + 12)" :: Open both brackets: \(12x - 36\) and \(-3x - 36\).
- "How many solutions" :: Compare the \(x\)-coefficients: 12 and \(-3\) differ, so \(x\) does not cancel.
explain:
Open the brackets: \(12(x - 3) = 12x - 36\) and \(-3(x + 12) = -3x - 36\). The equation is \(12x - 36 = -3x - 36\).

The \(x\)-coefficients, 12 and \(-3\), are different, so \(x\) does not cancel. Add \(3x\) to both sides: \(15x - 36 = -36\). Add 36: \(15x = 0\), so \(x = 0\).

There is exactly one solution, choice A.

The two sides share the number \(-36\), but that does not matter when the \(x\)-coefficients differ. Only when the \(x\)-terms cancel do the plain numbers decide the answer.
```

## Medium
```task
bank: m-0673
highlight:
- "(b - 2)x = 8" :: The coefficient of \(x\) is \(b - 2\).
- "has no solution" :: For no solution, the \(x\)-term must vanish and leave a false line.
- "what is the value of b" :: Make the coefficient zero: \(b - 2 = 0\).
explain:
Write the left side as \(b - 2\) times \(x\). If \(b - 2\) is any number except 0, divide both sides by it and get exactly one solution, \(x = \frac{8}{b - 2}\).

If \(b - 2 = 0\), the equation becomes \(0 \cdot x = 8\), which says \(0 = 8\). That is false for every \(x\), so there is no solution.

Set \(b - 2 = 0\): \(b = 2\), choice A.

This is the big idea behind "no solution" questions: the coefficient of \(x\) becomes zero, and the plain number on the other side is not zero.
```

## Hard
```task
bank: m-0705
highlight:
- "3(kx + 13) = (48/17)x + 36" :: Open the bracket: \(3kx + 39\).
- "The equation has no solution" :: The \(x\)-coefficients must be equal, with different plain numbers.
- "What is the value of k?" :: Set \(3k = \frac{48}{17}\) and solve.
explain:
Open the bracket on the left: \(3kx + 39 = \frac{48}{17}x + 36\).

An equation like this has no solution when the \(x\)-coefficients are equal but the plain numbers differ. The plain numbers, 39 and 36, already differ.

Set the coefficients equal: \(3k = \frac{48}{17}\). Divide by 3: \(k = \frac{16}{17}\).

Check: with this \(k\), \(x\) cancels and the line reads \(39 = 36\), which is false. Enter 16/17 (or .9411, .9412, 0.941).
```

# Solve for a letter
Same balance moves, but the answer contains letters.

```visual
linear-equations-one-var--rearrange
```

## Key ideas
Sometimes the answer is an expression, not a number. The moves are the same: treat every other letter as a number, then undo the operations around your target in reverse order.

\[F = \frac{9}{5}C + 32 \quad\Rightarrow\quad C = \frac{5}{9}(F - 32)\]

Subtract 32 first, then multiply by \(\frac{5}{9}\), the flip of \(\frac{9}{5}\). Everything on the left gets multiplied, so keep \(F - 32\) in brackets.

If the target letter appears **more than once**, collect those terms on one side and factor the letter out. For \(ab = c(b - 5)\) solving for \(b\): \(ab = cb - 5c\), then \(ab - cb = -5c\), then \(b(a - c) = -5c\), so \(b = \frac{5c}{c - a}\).

```example
\(P = 2(\ell + w)\). Solve for \(w\).
1. \(\frac{P}{2} = \ell + w\) :: Divide both sides by 2.
2. \(w = \frac{P}{2} - \ell\) :: Subtract \(\ell\) from both sides.
3. \(P = 20, \ell = 6\) gives \(w = 4\) :: Check: \(2(6 + 4) = 20\).
```

```theory
These are called **literal equations** or formulas. "Express \(x\) in terms of \(b\) and \(y\)" means get \(x\) alone on one side, with only \(b\) and \(y\) on the other. The skill is the same as solving for a number, with letters in place of numbers.

Order of operations is the key. In \(F = \frac{9}{5}C + 32\), \(C\) is first multiplied by \(\frac{9}{5}\) and then 32 is added. To get \(C\) back, undo the last step first: subtract 32, then divide by \(\frac{9}{5}\) (multiply by \(\frac{5}{9}\)).

Frequent errors: multiplying only one term. From \(b - 22 = \frac{x}{y}\), multiply the whole left side by \(y\): \(x = y(b - 22) = by - 22y\), not \(by - 22\). Dividing only one term of a sum is the mirror mistake.

When the target letter appears twice, a bracket helps: move every term containing it to one side, factor it out, then divide by the bracket.

If you are unsure, **pick numbers**. For \(6r = 7s + t\), choose \(r = 2\) and \(t = 5\): then \(12 = 7s + 5\), so \(s = 1\). Test each choice with these values and cross out the ones that do not give 1. Desmos can also check two forms: type both and see if the graphs coincide.

The SAT words it: "The given equation relates the variables \(r\), \(s\) and \(t\). Which equation correctly expresses \(s\) in terms of \(r\) and \(t\)?"
```

## Easy
```task
The equation \(F = \frac{9}{5}C + 32\) gives the temperature \(F\), in degrees Fahrenheit, that corresponds to a temperature of \(C\) degrees Celsius. Which equation correctly expresses \(C\) in terms of \(F\)?
* \(C = \frac{5}{9}(F - 32)\)
- \(C = \frac{5}{9}F - 32\) :: Subtract 32 first. The 32 must be inside the bracket.
- \(C = \frac{9}{5}(F - 32)\) :: Dividing by \(\frac{9}{5}\) means multiplying by \(\frac{5}{9}\).
- \(C = \frac{5}{9}(F + 32)\) :: The 32 is added in the formula, so subtract it.
highlight:
- "\(F = \frac{9}{5}C + 32\)" :: First \(C\) is multiplied by \(\frac{9}{5}\), then 32 is added. Undo in reverse.
- "expresses \(C\) in terms of \(F\)" :: Get \(C\) alone, with only \(F\) on the other side.
explain:
In \(F = \frac{9}{5}C + 32\), \(C\) is first multiplied by \(\frac{9}{5}\) and then 32 is added. Undo the steps in reverse order.

Subtract 32 from both sides: \(F - 32 = \frac{9}{5}C\). Multiply both sides by \(\frac{5}{9}\), the flip of \(\frac{9}{5}\): \(C = \frac{5}{9}(F - 32)\), the first choice.

Check with numbers: water boils at \(F = 212\). Then \(C = \frac{5}{9}(180) = 100\), which is right. The second choice only multiplies \(F\) by \(\frac{5}{9}\) and then subtracts 32, which gives the wrong value (about 85.8 for 212).
```

## Medium
```task
bank: m-12529
highlight:
- "b − 22 = x/y" :: \(x\) is divided by \(y\). Undo that by multiplying by \(y\).
- "expresses x in terms of b and y" :: Multiply the WHOLE left side by \(y\): both \(b\) and \(22\).
explain:
The equation is \(b - 22 = \frac{x}{y}\). Multiply both sides by \(y\): \(x = y(b - 22)\).

Distribute \(y\) to both terms: \(x = by - 22y\), choice C.

Choice B forgets to multiply the 22 by \(y\). Choice D divides by \(y\) instead of multiplying.

Quick check by picking numbers: let \(y = 2\) and \(b = 30\). Then \(b - 22 = 8 = \frac{x}{2}\), so \(x = 16\). Choice C gives \(30 \cdot 2 - 22 \cdot 2 = 16\), which matches. Choice B gives \(60 - 22 = 38\), which does not.
```

## Hard
```task
\(T(r + 2) = 5r + w\)
The given equation relates the variables \(T\), \(r\), and \(w\), where \(T \ne 5\). Which equation correctly expresses \(r\) in terms of \(T\) and \(w\)?
* \(r = \frac{w - 2T}{T - 5}\)
- \(r = \frac{w + 2T}{T - 5}\) :: \(2T\) changes sign when it crosses the equals sign.
- \(r = \frac{w - 2T}{T + 5}\) :: \(5r\) must be subtracted from both sides, giving \(Tr - 5r\).
- \(r = \frac{w}{T - 5} - 2T\) :: Divide the whole right side by \(T - 5\), \(2T\) included.
highlight:
- "\(T(r + 2) = 5r + w\)" :: The letter \(r\) appears twice. Collect both \(r\)-terms on one side.
- "in terms of \(T\) and \(w\)" :: The final expression may contain only \(T\) and \(w\).
explain:
Open the bracket: \(Tr + 2T = 5r + w\). The letter \(r\) is on both sides, so collect the \(r\)-terms on the left and the others on the right.

Subtract \(5r\) and \(2T\) from both sides: \(Tr - 5r = w - 2T\).

Factor \(r\) out of the left side: \(r(T - 5) = w - 2T\). Divide both sides by \(T - 5\), which is allowed because \(T \ne 5\):

\[r = \frac{w - 2T}{T - 5}\]

This is the first choice.

Check by picking numbers: \(T = 7\) and \(r = 3\). Then \(7(5) = 35 = 15 + w\), so \(w = 20\). The formula gives \(\frac{20 - 14}{7 - 5} = 3\), which is right.
```
