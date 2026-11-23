---
title: Linear Functions
skill: linear-functions
domain: algebra
section: math
summary: Write f(x) = mx + b, read tables and stories, and shift graphs.
---

# Function notation
\(f(3)\) is the output for input 3.

```visual
linear-functions--input-output
```

## Key ideas
\[f(a) = b \quad\Longleftrightarrow\quad \text{the point } (a, b) \text{ is on the graph}\]

In \(f(x)\), \(x\) is the **input**, inside the brackets, and \(f(x)\) is the **output**. To find an output, put the input in place of \(x\) everywhere: if \(f(x) = 4x - 5\), then \(f(3) = 4(3) - 5 = 7\).

When the **output** is given, as in \(f(k) = 19\), set the rule equal to 19 and solve for \(k\).

If the input is an expression, such as \(f(c + 7)\), put the whole expression in brackets where \(x\) was. Trap: a number inside the brackets is an input, a number after the equals sign is an output. Do not swap them.

```example
\(f(x) = 4x - 5\). Find \(f(3)\), and find \(k\) when \(f(k) = 19\).
1. \(f(3) = 4(3) - 5 = 7\) :: Input 3: replace \(x\) by 3.
2. \(4k - 5 = 19\) :: \(f(k) = 19\) means the output is 19.
3. \(k = 6\) :: Add 5, then divide by 4.
```

```theory
A **function** gives exactly one output for each input. The letter \(f\) is just its name, and \(f(x)\) is read "\(f\) of \(x\)". A **linear function** has a straight-line graph and a rule of the form \(f(x) = mx + b\).

The notation \(f(3) = 7\) says three things at once: the input is 3, the output is 7, and the point \((3, 7)\) is on the graph of \(y = f(x)\). That is why the SAT can describe the same fact as a table row, a point or an equation.

In a story, the meaning follows the units. If \(f\) gives the cost in dollars of renting a kayak for \(h\) hours, then \(f(3) = 50\) means that renting it for 3 hours costs $50. It does not mean 50 hours, and it is not the price per hour.

Substituting an expression needs brackets. If \(f(x) = 2x - 1\), then \(f(t + 3) = 2(t + 3) - 1 = 2t + 5\). Forgetting the brackets gives \(2t + 3 - 1\), which is wrong.

When a question gives two facts about a function with a constant \(b\) or \(c\) inside, such as \(g(x) = b - 15x\) and \(g(c + 7) = \frac{c}{4}\), substitute the input, write the equation, and solve for the unknown asked for. Do not look for numbers: the answer can be an expression with letters.

In Desmos, type the rule and the line \(y = 19\); the crossing's \(x\)-coordinate is \(k\).
```

## Easy
```task
bank: m-0734
highlight:
- "f(x) = 80 - 6x" :: This is the rule. Put the input in place of \(x\).
- "f(7)" :: The input is 7, so \(x = 7\).
explain:
The question asks for \(f(7)\), so the input is 7. Substitute \(x = 7\) into the rule \(f(x) = 80 - 6x\).

\(f(7) = 80 - 6(7) = 80 - 42 = 38\).

The answer is 38, choice B. Do the multiplication before the subtraction. Choice C, 74, comes from computing \(80 - 6\): the 6 must be multiplied by the input 7 first.

A habit worth building: write the substitution out with brackets, \(80 - 6(7)\), before you calculate. It makes sign and order mistakes much less likely.
```

## Medium
```task
The function \(f\) is defined by \(f(x) = \frac{3}{4}x - 2\). If \(f(k) = 10\), what is the value of \(k\)?
answer: 16
- 5.5 :: That is \(f(10)\). Here 10 is the output, not the input.
- 9 :: To undo \(\times \frac{3}{4}\), multiply by \(\frac{4}{3}\).
~ type y=\frac{3}{4}x-2 :: Type the rule.
~ type y=10 :: The output is 10: a flat line.
~ zoom -4 24 -6 14
~ point (16, 10) :: Click the crossing. Its \(x\) is \(k\): 16.
highlight:
- "\(f(x) = \frac{3}{4}x - 2\)" :: This is the rule: output \(= \frac{3}{4}\) times input, minus 2.
- "If \(f(k) = 10\)" :: The output is 10. Set the rule equal to 10 and solve for \(k\).
explain:
\(f(k) = 10\) means that the input \(k\) gives the output 10. Put \(k\) into the rule: \(\frac{3}{4}k - 2 = 10\).

Add 2 to both sides: \(\frac{3}{4}k = 12\). To remove \(\frac{3}{4}\), multiply both sides by its reciprocal \(\frac{4}{3}\): \(k = 12 \cdot \frac{4}{3} = 16\).

Check: \(f(16) = \frac{3}{4}(16) - 2 = 12 - 2 = 10\). The answer is 16. The value 5.5 is \(f(10)\): it uses 10 as the input instead of the output. The value 9 comes from multiplying by \(\frac{3}{4}\) instead of by its reciprocal \(\frac{4}{3}\).
```

## Hard
```task
bank: m-1062
highlight:
- "g(x) = b - 15x" :: This is the rule. The constant \(b\) is the unknown to find.
- "g(c + 7) = c/4" :: The input is \(c + 7\). Put the whole expression in brackets.
- "expressions represents the value of b" :: Solve for \(b\): the answer will contain \(c\).
explain:
Substitute the input \(c + 7\) into the rule: \(g(c + 7) = b - 15(c + 7) = b - 15c - 105\).

The problem says this equals \(\frac{c}{4}\), so \(b - 15c - 105 = \frac{c}{4}\).

Solve for \(b\): add \(15c\) and 105 to both sides. Then \(b = \frac{c}{4} + 15c + 105\). Combine the \(c\)-terms: \(\frac{c}{4} + \frac{60c}{4} = \frac{61c}{4}\). So \(b = \frac{61c}{4} + 105\), choice C.

The key is the bracket: \(-15(c + 7)\) gives \(-15c - 105\), not \(-15c + 7\).

Test with a number: let \(c = 4\). Then \(b = \frac{61 \cdot 4}{4} + 105 = 166\), and \(g(11) = 166 - 15(11) = 1\), which equals \(\frac{c}{4} = 1\). The other choices fail the same test.
```

# Rule from two points
Slope first. Then plug in a point for \(b\).

```visual
linear-functions
```

## Key ideas
\[m = \frac{f(x_2) - f(x_1)}{x_2 - x_1} \qquad f(x) = mx + b\]

Facts like \(f(2) = 5\) and \(f(6) = 17\) are the points \((2, 5)\) and \((6, 17)\). Two points are all a line needs.

1. **Slope:** the output change over the input change.
2. **\(b\):** put one point into \(f(x) = mx + b\) and solve.

The number \(b\) is \(f(0)\), the output at input 0. If a question asks for \(f(0)\), it is asking for \(b\).

Traps: using the input as the slope, or using the output change without dividing by the input change. Always finish by checking the second point.

```example
For the linear function \(f\), \(f(2) = 5\) and \(f(6) = 17\). Which equation defines \(f\)?
1. \(m = \frac{17 - 5}{6 - 2} = 3\) :: Output change over input change.
2. \(5 = 3(2) + b\) :: Put the first point into \(f(x) = mx + b\).
3. \(b = -1\), so \(f(x) = 3x - 1\) :: Check: \(f(6) = 18 - 1 = 17\).
```

```theory
The **slope** \(m\) of a linear function is the change in the output for each 1 step in the input. Two points are enough to find it, because a straight line has the same slope everywhere. The order of the two points does not matter as long as you subtract in the same order on the top and the bottom.

The number \(b\) is the **\(y\)-intercept**: the output at input 0. You can often find it without solving: from \((2, 5)\), going back 2 steps of \(m = 3\) lowers the output by 6, giving \(f(0) = -1\).

Why does plugging in a point work? A point is on the graph exactly when its coordinates satisfy the rule. Once \(m\) is known, \(b\) is the only unknown.

The SAT words this in several ways: "the graph contains the points (0, 3) and (7, 31)", "\(h(28) = 15\) and \(h(26) = 22\)", or a table. They are all two points. Be careful with negative slopes: from \((26, 22)\) to \((28, 15)\) the output goes down 7 while the input goes up 2, so \(m = -\frac{7}{2}\).

Harder questions chain two functions. For example, one function gives you an unknown constant \(c\), and you use \(c\) as an input of a second function. Find \(c\) first, then build the second rule.

In Desmos, type a table with the two points and then \(y_1 \sim mx_1 + b\). Desmos fits the line and shows \(m\) and \(b\).
```

## Easy
```task
bank: m-0616
highlight:
- "contains the points (0, 3) and (7, 31)" :: The point with input 0 gives \(b = 3\). The other gives the slope.
- "Which equation defines f" :: Slope \(= \frac{31 - 3}{7 - 0}\), then write \(f(x) = mx + b\).
explain:
The point \((0, 3)\) has input 0, so the \(y\)-intercept is \(b = 3\).

The slope is the output change over the input change: \(\frac{31 - 3}{7 - 0} = \frac{28}{7} = 4\). So \(f(x) = 4x + 3\), choice C.

Check with the second point: \(f(7) = 4(7) + 3 = 31\). Choice D uses the input 7 as the slope, and choice A uses the output change 28 without dividing by the input change. Choice B uses the output 3 as the slope, which is the \(y\)-intercept.
```

## Medium
```task
bank: m-0905
highlight:
- "h(28) = 15 and h(26) = 22" :: Two points: \((28, 15)\) and \((26, 22)\).
- "Which equation defines h" :: Find the slope, then plug a point in for \(b\).
explain:
The facts give the points \((28, 15)\) and \((26, 22)\). The slope is \(\frac{22 - 15}{26 - 28} = \frac{7}{-2} = -\frac{7}{2}\).

Put \((28, 15)\) into \(h(x) = -\frac{7}{2}x + b\): \(15 = -\frac{7}{2}(28) + b = -98 + b\), so \(b = 113\). The equation is \(h(x) = -\frac{7}{2}x + 113\), choice D.

Check with the other point: \(-\frac{7}{2}(26) + 113 = -91 + 113 = 22\). Choice C has the right slope but the wrong intercept. Choices A and B have the slope upside down: the output change goes on top, the input change on the bottom.
```

## Hard
```task
bank: m-14032
highlight:
- "p(5) = 42" :: With the slope 8, this point gives the rule of \(p\).
- "the slope of the graph of y = p(x) in the xy-plane is 8" :: Write \(p(x) = 8x + b\) and find \(b\).
- "t(c) = −7 and t(6) = 5c" :: Two points of \(t\), but \(c\) is still unknown. Find \(c\) from \(p\).
- "What is the slope of the graph of y = t(x)" :: After you know \(c\), use the slope formula for \(t\).
explain:
Start with \(p\). Its slope is 8, so \(p(x) = 8x + b\). From \(p(5) = 42\): \(40 + b = 42\), so \(b = 2\) and \(p(x) = 8x + 2\).

Now use \(p(c) = -6\): \(8c + 2 = -6\), so \(8c = -8\) and \(c = -1\).

For \(t\), the facts become \(t(-1) = -7\) and \(t(6) = 5c = -5\). The points are \((-1, -7)\) and \((6, -5)\). The slope is \(\frac{-5 - (-7)}{6 - (-1)} = \frac{2}{7}\), choice C.

Choice B, 2, is the output change without dividing by the input change of 7.

The chain is the trick: the slope of \(p\) is given, so \(p\) leads to \(c\), and \(c\) leads to the points of \(t\). Take the questions one function at a time and write each result down.
```

# Tables and graphs
\(b\) is the output at 0. \(m\) is the step.

```visual
linear-functions--read-graph
```

## Key ideas
From a table or a graph, read two things.

- **\(b\)** is the output at \(x = 0\): where the line crosses the \(y\)-axis.
- **\(m\)** is the output change divided by the input change between two points.

\[m = \frac{\text{output change}}{\text{input change}}\]

Pick two points with exact coordinates and use the numbers on the axes. **Never count grid squares:** the two axes can have different scales. If \(x = 0\) is not in the table, find \(m\) first, then step back to \(x = 0\) or plug in a point.

Trap: a table whose inputs jump by 2. The output change is for 2 steps, so divide by 2.

```example
A table gives \(f(2) = 11\), \(f(4) = 7\) and \(f(6) = 3\). Which function \(f\) fits the table?
1. \(m = \frac{7 - 11}{4 - 2} = -2\) :: Output change over input change.
2. \(11 = -2(2) + b\) :: Put the first row into \(f(x) = mx + b\).
3. \(b = 15\), so \(f(x) = -2x + 15\) :: Check: \(f(6) = -12 + 15 = 3\).
```

```theory
A table is a list of points. A function is **linear** when equal steps of input always change the output by equal amounts. In the example, each step of 2 in \(x\) lowers the output by 4, so the slope is \(-\frac{4}{2} = -2\).

Check a table for linearity: compare two different pairs of rows. If the slopes differ, the relationship is not linear and the SAT will not describe it with a line.

If \(x = 0\) is missing, you can step back. In the example, the output at \(x = 2\) is 11; one step back (to \(x = 1\)) adds 2, and one more step back (to \(x = 0\)) adds 2 again, so \(f(0) = 15\).

From a graph, \(b\) is where the line crosses the \(y\)-axis, and you find \(m\) from two clear points. Here is why counting squares fails. Suppose one square along the \(x\)-axis is 1 unit and one square along the \(y\)-axis is 10 units. Going 1 square right and 3 squares up looks like a slope of 3, but the true slope is 30. Always read the axis labels.

Tables can come with a story: "the population in 2000 and in 2010". The input is the year, but the function may use "\(t\) years after 2000", so that \(t = 0\) is the starting year and \(b\) is the 2000 value. Convert before you subtract.

When the table has fractions, like \(-\frac{183}{10}\), do not convert to decimals: keep fractions, find the slope, and find the \(x\)-intercept by asking how far the output must climb to reach 0.
```

## Easy
```task
bank: m-0777
highlight:
- "Some values of the linear function f" :: Linear: equal steps in \(x\) give equal steps in \(f(x)\).
- "Which of the following defines f" :: Slope from two rows, then \(b\) from one row.
explain:
Use two rows of the table. The rows \((1, 5)\) and \((3, 13)\) give the slope \(\frac{13 - 5}{3 - 1} = \frac{8}{2} = 4\). Note that the inputs jump by 2, so you must divide by 2.

Put the first row into \(f(x) = 4x + b\): \(5 = 4(1) + b\), so \(b = 1\). The function is \(f(x) = 4x + 1\), choice C.

Check with the third row: \(f(5) = 4(5) + 1 = 21\), which matches the table. If you forget to divide by 2 you get a slope of 8, which does not fit the other rows.
```

## Medium
```task
bank: m-1131
highlight:
- "for the years 2000 and 2010" :: Ten years pass between the two rows. Divide the change by 10.
- "t years after 2000" :: So \(t = 0\) is the year 2000, and \(b\) is the 2000 population.
- "the relationship between population and year is linear" :: A constant rate: slope \(= \frac{-16}{10}\).
explain:
Between 2000 and 2010 the population changes from 862 to 846, a change of \(846 - 862 = -16\). That happened over 10 years, so the rate is \(-\frac{16}{10} = -1.6\) people per year.

The function counts \(t\) years after 2000, so \(t = 0\) is the year 2000 and the start is \(P(0) = 862\). Therefore \(P(t) = 862 - 1.6t\), choice A.

Choice B uses the total change \(-16\) as if it were the yearly rate. Choice D treats \(t\) as the calendar year, but \(t\) counts years after 2000, not the year itself.
```

## Hard
```task
bank: m-13421
highlight:
- "The table shows three values of x and their corresponding values of y." :: Three points. The fractions have denominator 10.
- "There is a linear relationship between x and y." :: Constant slope: use two rows to find it.
- "the x-coordinate of the x-intercept" :: Where \(y = 0\). Find how far the output must climb.
explain:
Take the rows \((2, -\frac{183}{10})\) and \((4, -\frac{171}{10})\). The slope is \(\frac{-\frac{171}{10} - (-\frac{183}{10})}{4 - 2} = \frac{\frac{12}{10}}{2} = \frac{3}{5}\).

Find \(b\): \(-\frac{183}{10} = \frac{3}{5}(2) + b = \frac{12}{10} + b\), so \(b = -\frac{195}{10} = -\frac{39}{2}\). The line is \(y = \frac{3}{5}x - \frac{39}{2}\).

The \(x\)-intercept has \(y = 0\): \(\frac{3}{5}x = \frac{39}{2}\), so \(x = \frac{39}{2} \cdot \frac{5}{3} = \frac{65}{2}\).

Check with the third row: \(\frac{3}{5}(7) - \frac{39}{2} = \frac{42 - 195}{10} = -\frac{153}{10}\). Enter 65/2 or 32.5.

Another route: from \((2, -\frac{183}{10})\), the output must climb \(\frac{183}{10}\) to reach 0. At a slope of \(\frac{3}{5}\) per unit of \(x\), that takes \(\frac{183}{10} \cdot \frac{5}{3} = \frac{61}{2}\) units, so \(x = 2 + \frac{61}{2} = \frac{65}{2}\). Keeping fractions avoids rounding errors.
```

# Rate and start
Rate: change per 1. Start: amount at 0.

```visual
linear-functions--rate-start
```

## Key ideas
\[f(t) = \text{start} + \text{rate} \cdot t\]

In a story, \(b\) is the **start**, also called the **initial value**: the amount at \(t = 0\). The slope \(m\) is the **rate**: the change in the output for **one** unit of input, with its units. A decrease gives a negative rate.

- **Rate per several units.** A battery that loses 36 points in 6 minutes has rate \(\frac{-36}{6} = -6\) per minute. Divide first.
- **Units.** If the output is in thousands, a rate of 0.5 means 0.5 thousand.
- **Years after.** "\(t\) years after 2014" means \(t = 0\) is the year 2014.
- A rule such as \(f(x) = 2.74 - 0.19(x - 3)\) shows the value 2.74 at \(x = 3\), not at \(x = 0\).

```example
A drone's battery is at 100% when it takes off and at 64% after 6 minutes. Which function \(B\) gives the battery level after \(t\) minutes?
1. \(m = \frac{64 - 100}{6} = -6\) :: Change over time. A drop is negative.
2. \(b = 100\) :: The level at \(t = 0\).
3. \(B(t) = 100 - 6t\) :: Check: \(B(6) = 64\).
```

```theory
The **initial value** is the output at time 0, the starting amount. The **rate of change** is how much the output changes per one unit of input. For a linear function the rate is the same everywhere, so the graph is a straight line and the slope is the rate.

To read a number in a rule, match it to what it multiplies. In \(B(t) = 100 - 6t\), the 100 stands alone, so it is the amount at \(t = 0\); the 6 multiplies the time, so it is the amount lost per minute.

Rates can be scaled. The battery loses 6 per minute, so it loses \(6 \cdot 4 = 24\) every 4 minutes. A question may ask for the change over several units; multiply the rate by the number of units. Going the other way, "how many minutes for the battery to lose 1 point?" is the reciprocal, \(\frac{1}{6}\) minute.

Watch the units of the output. For \(S(t) = 2.4 + 0.5t\) in thousands, the weekly gain is 0.5 thousand, which is 500 subscribers. Convert before you answer if the question asks for a count.

A rule can also be written around a different starting point. \(F(x) = 2.74 - 0.19(x - 3)\) is a line whose value at \(x = 3\) is 2.74 and whose slope is \(-0.19\). The constant is the value at \(x = 3\), three months after the start, not the initial price.

When the output reaches zero, you have the \(x\)-intercept: for \(B(t) = 100 - 6t\), the battery is empty when \(t = \frac{50}{3}\) minutes. A point on the graph, like \((6, 64)\), says "after 6 minutes the level is 64".
```

## Easy
```task
bank: m-0701
highlight:
- "at sea level is 14.70" :: The start: the pressure at depth 0 is 14.70.
- "increases by 0.44 psi" :: The rate: 0.44 psi for each 1 foot.
- "105 feet below sea level" :: The input is 105: \(14.70 + 0.44(105)\).
explain:
The pressure at sea level (depth 0) is 14.70 psi, so that is the start. Each foot of depth adds 0.44 psi, so the rate is 0.44 per foot.

The pressure at depth \(d\) feet is \(P(d) = 14.70 + 0.44d\). At 105 feet: \(0.44 \cdot 105 = 46.20\), and \(14.70 + 46.20 = 60.90\).

The answer is 60.90, choice A. Choice C, 14.70, is only the start and ignores the increase, and choice D, 0.44, is only the rate per foot.
```

## Medium
```task
bank: m-0755
highlight:
- "x months after September 1" :: The input counts months from September 1, so \(x = 0\) is September 1.
- "F(x) = 2.74 - 0.19(x - 3)" :: The bracket \(x - 3\) is 0 when \(x = 3\).
- "The constant 2.74" :: It is the output at \(x = 3\), not at \(x = 0\).
explain:
The rule is \(F(x) = 2.74 - 0.19(x - 3)\), and \(x\) is the number of months after September 1.

The term \(-0.19(x - 3)\) vanishes when \(x - 3 = 0\), that is when \(x = 3\). Then \(F(3) = 2.74\). So 2.74 is the price when \(x = 3\), three months after September 1, which is December 1.

The answer is choice D. The price on September 1 is \(F(0) = 2.74 - 0.19(-3) = 2.74 + 0.57 = 3.31\), so choice C is wrong: it would be the constant only if the rule were written as \(2.74 - 0.19x\).
```

## Hard
```task
The function \(S(t) = 2.4 + 0.5t\) gives the number of subscribers, in thousands, of a podcast \(t\) weeks after it launched. According to the function, by how many subscribers does the podcast grow every 4 weeks?
answer: 2000
- 2 :: That is in thousands. Convert to subscribers.
- 500 :: That is one week's growth. Multiply by 4 weeks.
highlight:
- "in thousands" :: Units: every output is a number of thousands.
- "every 4 weeks" :: The rate 0.5 is per 1 week. Multiply by 4.
- "by how many subscribers" :: Convert thousands into subscribers at the end.
explain:
The slope of \(S(t) = 2.4 + 0.5t\) is 0.5. It is the change in \(S\) per one week, and \(S\) is measured in thousands of subscribers. So the podcast grows by 0.5 thousand each week.

Over 4 weeks the growth is \(4 \cdot 0.5 = 2\) thousand.

The question asks for subscribers, not thousands, so convert: \(2 \cdot 1000 = 2000\).

Check: after one week the growth is 500 subscribers, and after four weeks it is \(4 \cdot 500 = 2000\). The value 2.4 is the starting level in thousands and is not needed.
```

# Shift a graph
\(f(x) + k\) moves up. \(f(x - h)\) moves right.

```visual
linear-functions--translate
```

## Key ideas
\[f(x) + k \ \text{moves up } k \qquad f(x - h) \ \text{moves right } h\]

**Shifted** and **translated** mean the same: the whole graph slides without turning. Add to the output and the graph moves up (subtract and it moves down). Replace \(x\) by \(x - h\) and it moves right \(h\) (\(x + h\) moves left).

For a line the slope never changes. A shift up or down changes the \(y\)-intercept by that amount. Shifting the line right by \(h\) changes the \(y\)-intercept by \(-mh\) (no change for a flat line).

Trap: \(f(x - 4)\) moves right, not left. The sign inside looks backwards. Another trap is changing the slope: a shift never does.

```example
\(f(x) = 2x + 5\). Write \(g(x) = f(x) - 3\) and \(h(x) = f(x - 4)\).
1. \(g(x) = 2x + 5 - 3 = 2x + 2\) :: Down 3: subtract 3 from the output.
2. \(h(x) = 2(x - 4) + 5\) :: Right 4: replace \(x\) by \(x - 4\).
3. \(h(x) = 2x - 3\) :: Same slope, new \(y\)-intercept.
```

```theory
A **translation** (shift) moves every point of a graph the same distance in the same direction. The shape, and for a line the slope, stay the same.

**Up and down.** Adding \(k\) to every output lifts each point by \(k\). So \(y = f(x) + k\) is the graph of \(f\) moved up \(k\); with \(k\) negative it moves down. Every point \((a, b)\) becomes \((a, b + k)\).

**Left and right.** For \(f(x - h)\) to give the same output as \(f\) did at the old input, \(x\) must be \(h\) larger. So the graph moves \(h\) to the **right**. For a line, moving right by \(h\) has the same effect as moving down by \(mh\): in the example \(m = 2\) and \(h = 4\), so the \(y\)-intercept falls from 5 to \(-3\).

**Standard form.** To shift the graph of \(ax + by = c\) down \(k\), replace \(y\) by \(y + k\): \(ax + b(y + k) = c\). Shifting \(9x - 10y = 19\) down 4 gives \(9x - 10(y + 4) = 19\), which is \(9x - 10y = 59\). Often it is quicker to move an intercept directly: the \(y\)-intercept goes down 4, and the slope stays the same.

The SAT words it: "translated up 6 units", "shifted down 4 units", "translated 96 units to the right". For a question about intercepts, find the original intercept first, then move it.

A table can hide a shift: find the line from the table, then apply the shift to its equation.
```

## Easy
```task
bank: m-15627
highlight:
- "y = g(x) − 5" :: The graph of \(g\) shifted down 5. Subtract 5 from every output.
- "y-coordinate of the y-intercept" :: Put \(x = 0\): this is \(g(0) - 5\).
explain:
The \(y\)-intercept of a graph is at \(x = 0\). For \(g(x) = 2(14x - 15)\), \(g(0) = 2(0 - 15) = -30\).

The graph of \(y = g(x) - 5\) is the graph of \(g\) shifted down 5, so its \(y\)-intercept is \(-30 - 5 = -35\).

The answer is \(-35\), choice A. Choice B, \(-30\), is the \(y\)-intercept of \(g\) itself, before the shift.

The question gives \(g\) in an unsimplified form, but you do not need to simplify it. Putting \(x = 0\) makes the bracket \(14x - 15\) equal \(-15\) at once, and the shift is a final subtraction.
```

## Medium
```task
The function \(f\) is defined by \(f(x) = 3x + 2\). The graph of \(y = g(x)\) is the graph of \(y = f(x)\) translated 4 units to the right in the \(xy\)-plane. What is the \(y\)-coordinate of the \(y\)-intercept of the graph of \(y = g(x)\)?
answer: -10
- 14 :: That is \(f(x + 4)\), a move left. Right is \(x - 4\).
- 2 :: The \(y\)-intercept of \(f\). A shift right moves it too.
~ type y=3x+2 :: Type \(f\).
~ type y=3(x-4)+2 :: Right 4: replace \(x\) by \(x - 4\).
~ zoom -6 10 -14 10
~ point (0, -10) :: The new \(y\)-intercept: \(-10\).
highlight:
- "translated 4 units to the right" :: Right 4 means replacing \(x\) by \(x - 4\).
- "\(f(x) = 3x + 2\)" :: Put \(x - 4\) into this rule to get \(g\).
- "the \(y\)-coordinate of the \(y\)-intercept" :: Put \(x = 0\) into \(g\).
explain:
Moving a graph 4 units to the right means that \(g(x) = f(x - 4)\). Put \(x - 4\) into the rule: \(g(x) = 3(x - 4) + 2 = 3x - 12 + 2 = 3x - 10\).

The \(y\)-intercept is \(g(0) = -10\).

Check with the slope idea: moving right by 4 is the same as moving down by \(mh = 3 \cdot 4 = 12\), and \(2 - 12 = -10\). The value 14 comes from moving left, \(f(x + 4)\), and 2 is the intercept before the shift. Always decide the direction first: right means subtract inside the bracket.
```

## Hard
```task
bank: m-0567
highlight:
- "For line h, the table shows three values of x and their corresponding values of y." :: Three points of line \(h\). Find its slope and \(b\).
- "Line k is the result of translating line h down 5 units" :: Subtract 5 from the \(y\)-intercept of \(h\). The slope stays.
- "What is the x-intercept of line k?" :: Set \(y = 0\) in the equation of line \(k\).
explain:
First write line \(h\). Use the rows \((18, 130)\) and \((23, 160)\): the slope is \(\frac{160 - 130}{23 - 18} = \frac{30}{5} = 6\). Put \((18, 130)\) in: \(130 = 6(18) + b\), so \(b = 22\) and line \(h\) is \(y = 6x + 22\).

Check the third row: \(6(26) + 22 = 178\). It matches.

Translating down 5 gives line \(k\): \(y = 6x + 17\). The slope stays 6.

For the \(x\)-intercept of \(k\) set \(y = 0\): \(6x = -17\), so \(x = -\frac{17}{6}\). The point is \(\left(-\frac{17}{6}, 0\right)\), choice D. Choice C is the \(x\)-intercept of line \(h\) itself.
```

# Trap: first N units
The first price covers the first units.

```visual
linear-functions--first-n-units
```

## Key ideas
\[C(x) = \text{first price} + \text{extra rate} \cdot (x - N)\]

"$5 for the first 2 km and $3 for each additional km" means the first price covers \(N = 2\) units. Only the units after them pay the second rate, and there are \(x - N\) of them. So \(C(d) = 5 + 3(d - 2) = 3d - 1\).

**Test your rule at \(x = N\).** It must give the first price: \(C(2) = 5\). The popular wrong rule \(5 + 3d\) fails the test, because it gives 11.

In the simplified \(3d - 1\), the \(y\)-intercept \(-1\) is not a price. It is only where the line would cross the axis if it were extended back to 0 km.

```example
A courier charges $9 for the first 3 kilometers and $2 for each additional kilometer. Which function gives the cost for \(d \ge 3\)?
1. \(C(d) = 9 + 2(d - 3)\) :: The \(d - 3\) extra kilometers pay $2 each.
2. \(C(d) = 2d + 3\) :: Distribute and combine: \(9 - 6\).
3. \(C(3) = 9\) :: Test at \(d = 3\): it matches.
```

```theory
Many SAT price stories say "the first \(N\) units cost one price, and each additional unit costs another". The key word is "additional" (or "after"): it counts only the units beyond the first \(N\).

Why \((x - N)\)? At \(x = N\) there are zero additional units, at \(x = N + 1\) there is one, and so on. The count of additional units is \(x - N\). If the first unit alone has its own price (\(N = 1\)), the count is \(x - 1\).

Domains matter: the formula is for \(x \ge N\) (or for whole units). The wording "where \(x \ge 2\)" in the question tells you the formula applies only from the first block onward.

Two ways to build the rule. (1) Write first price \(+\) extra rate \(\cdot\) \((x - N)\) and simplify. (2) Use two sure points: the cost at \(x = N\) and the cost at \(x = N + 1\) differ by the extra rate, which is the slope; then find \(b\) from either point. Both give the same line.

Variations: "the first session is free, the second is half off, and the rest are full price" gives \(f(x) = \text{full}\cdot(x - 2) + \text{half}\). A model with two phases, like "120 bees per week for 2 weeks, then 180", adds the first phase as a fixed amount (\(2 \cdot 120\)) and then the second rate times the weeks after week 2.

Check the wrong choices by testing \(x = N\): rules that charge the extra rate for every unit fail.
```

## Easy
```task
bank: m-13012
highlight:
- "$950 for the first 2 hours" :: One price for the first 2 hours. It stands alone.
- "an additional $50 per hour for each hour after the first 2 hours" :: The $50 multiplies only the hours after 2: \(t - 2\).
- "t > 2" :: The rule applies to more than 2 hours.
- "is $1,150" :: The total cost is the right side of the equation.
explain:
The first 2 hours cost a flat $950. Each hour after that costs $50, and the number of hours after the first 2 is \(t - 2\). So the cost is \(950 + 50(t - 2)\).

The total is $1,150, so \(950 + 50(t - 2) = 1{,}150\), which is choice C.

Test the rule at \(t = 2\): \(950 + 50(0) = 950\), the first price, as it should be. Choice A multiplies the flat $950 by a number of hours, which cannot be right: you pay it once.
```

## Medium
```task
bank: m-0563
highlight:
- "$220 for the first two hours" :: The first price covers 2 hours. Extra hours are \(x - 2\).
- "The total cost for 5 hours of repair is $400" :: Use \(x = 5\) and a total of 400 to find the hourly fee.
- "each additional hour" :: The unknown fee multiplies \(x - 2\).
explain:
Five hours of repair cost $400. The first two hours cost $220, so the 3 additional hours cost \(400 - 220 = 180\) dollars. The hourly fee is \(\frac{180}{3} = 60\) dollars.

The function is \(f(x) = 220 + 60(x - 2)\). Distribute: \(f(x) = 220 + 60x - 120 = 60x + 100\), choice A.

Test: \(f(2) = 220\), and \(f(5) = 400\). Choice B adds 220 without taking into account that the first 2 hours are already included in \(x\). That rule gives \(f(5) = 520\), which is not 400.
```

## Hard
```task
bank: m-13836
highlight:
- "increases by 120 bees per week in the first two weeks" :: Phase 1: after week 2 the colony has \(1{,}100 + 2(120)\) bees.
- "then increases by 180 bees per week" :: Phase 2: only the weeks after 2 count, \(w - 2\), at 180 each.
- "where w > 2" :: The second phase formula applies from week 2 on.
- "the predicted number of bees still needed to reach the beekeeper's goal" :: Goal minus the predicted population.
explain:
After the first two weeks, the colony has \(1{,}100 + 2(120) = 1{,}340\) bees. For \(w > 2\), the weeks after week 2 number \(w - 2\), and each adds 180 bees: the population is \(1{,}340 + 180(w - 2) = 980 + 180w\).

The question asks for the bees still needed to reach the goal of 2,600. That is the goal minus the population: \(2{,}600 - (980 + 180w) = 1{,}620 - 180w\), choice C.

Test at \(w = 2\): \(1{,}620 - 360 = 1{,}260\), and \(2{,}600 - 1{,}340 = 1{,}260\). It matches. Choice A ignores the starting population and the slower first two weeks.
```
