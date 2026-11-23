---
title: Linear Inequalities
skill: linear-inequalities
domain: algebra
section: math
summary: Solve, write and graph inequalities. Flip the sign at the right moment.
---

# Solve and flip
Divide by a negative? Flip the sign.

```visual
linear-inequalities--mirror
```

## Key ideas
Solve an inequality like an equation, with one extra rule: **multiply or divide both sides by a negative number, and flip (reverse) the sign.**

\[-2x + 3 > 11 \;\Rightarrow\; -2x > 8 \;\Rightarrow\; x < -4\]

Adding or subtracting never flips the sign. Dividing by a **positive** never flips it, even when the other side is negative.

A **compound inequality** has three parts, like \(-5 \le 3 - 2x < 9\). Do every step to **all three parts**. A negative divisor flips **both** signs.

The answer is a range of values. To check it, test one number from the range in the original inequality.

**Traps:** flipping after you divide by a positive, and missing the flip when the letter has a minus in front of it (in \(5 - 4x\), you divide by \(-4\)).

```example
Solve \(5 - 4x \le 17\).
1. \(-4x \le 12\) :: Subtract 5. No flip.
2. \(x \ge -3\) :: Divide by \(-4\): \(\le\) flips to \(\ge\).
3. Test \(x = 0\): \(5 \le 17\) is true :: \(0\) is in the range \(x \ge -3\).
```

```theory
**Symbols.** \(<\) means less than, \(>\) means greater than, \(\le\) means less than or equal to, \(\ge\) means greater than or equal to. The small end of the sign points to the smaller number.

**Why the sign flips.** Put 2 and 3 on a number line: \(2 < 3\). Multiply both by \(-1\) and they swap sides of zero: \(-2 > -3\). Multiplying or dividing by a negative mirrors the line, so the order turns around. Adding a number only slides everything along, so the order stays.

**Solution set.** An equation like \(x + 1 = 4\) has one solution. An inequality like \(x + 1 < 4\) has many: every \(x\) below 3. On a number line this is an open circle at 3 (not included, for \(<\) and \(>\)) with an arrow, or a filled circle (included, for \(\le\) and \(\ge\)).

**Equivalent inequalities.** Dividing \(6x - 9y > 12\) by 3 gives \(2x - 3y > 4\), the same direction. Dividing by \(-3\) would give \(-2x + 3y < -4\), the sign flipped.

**A constant in the inequality.** If \(ax \le 32\) is written as \(x \ge -8\), the sign turned around, so you divided by a negative: \(a\) is negative, and \(\frac{32}{a} = -8\). This is a favorite hard question.

**Compound.** In \(-8 \le -2x < 6\), dividing all three parts by \(-2\) gives \(4 \ge x > -3\). Write it from least to greatest: \(-3 < x \le 4\). The closed end that came from \(-8\) is now at 4, and the open end that came from 6 is now at \(-3\).

**Only numbers.** On the SAT, you divide only by plain numbers. Dividing by something with a letter in it could be positive or negative, so you cannot know whether to flip.
```

## Easy
```task
Which of the following inequalities is equivalent to \(-3x + 4 \ge 19\)?
* \(x \le -5\)
- \(x \ge -5\) :: You divided by \(-3\) but did not flip the sign.
- \(x \le 5\) :: \(15 \div (-3)\) is \(-5\), not 5.
- \(x \ge 5\) :: Two slips: no flip, and the wrong sign on the number.
highlight:
- "equivalent to" :: Same solutions: solve for \(x\).
- "\(-3x + 4 \ge 19\)" :: Subtract 4, then divide by \(-3\) and flip.
explain:
Solve it like an equation. First subtract 4 from both sides. This does not change the sign:

\[-3x \ge 15\]

Now divide both sides by \(-3\). Dividing by a negative flips the sign, so \(\ge\) becomes \(\le\):

\[x \le -5\]

The answer is the first choice, \(x \le -5\).

Test a number from the range, such as \(x = -6\): \(-3(-6) + 4 = 22\), and \(22 \ge 19\) is true. Test a number from the wrong range, \(x = 0\): \(4 \ge 19\) is false.
```

## Medium
```task
Which of the following inequalities gives all the values of \(x\) that satisfy \(-5 \le 3 - 2x < 9\)?
* \(-3 < x \le 4\)
- \(-4 \le x < 3\) :: You divided by 2 but dropped the minus sign.
- \(-3 \le x < 4\) :: Flip the signs too: the \(\le\) belongs next to 4.
- \(-8 \le x < 6\) :: You never divided by \(-2\).
highlight:
- "\(-5 \le 3 - 2x < 9\)" :: Three parts: do each step to all three.
- "all the values of \(x\)" :: The answer is a range of \(x\).
explain:
Start by subtracting 3 from all three parts. No flip yet:

\[-8 \le -2x < 6\]

Now divide all three parts by \(-2\). This flips both signs, and the numbers swap places:

\[4 \ge x > -3\]

Write it from least to greatest: \(-3 < x \le 4\). The answer is the first choice.

Check: \(x = 4\) gives \(3 - 8 = -5\), which is allowed by \(\le\). \(x = -3\) gives \(3 + 6 = 9\), which is not less than 9, so \(-3\) is not allowed. That matches the open end at \(-3\) and the closed end at 4.
```

## Hard
```task
bank: m-12833
highlight:
- "x ≥ −8 represents all solutions" :: The solutions point right, to larger values.
- "ax − 18 ≤ 14" :: Isolated, this is \(ax \le 32\): it points left.
- "greatest possible value of a" :: The sign flipped, so \(a\) is negative.
explain:
Add 18 to both sides of \(ax - 18 \le 14\):

\[ax \le 32\]

The given solutions, \(x \ge -8\), point the **opposite** way (right, not left). So dividing by \(a\) must have flipped the sign. That happens only when \(a\) is negative.

For negative \(a\), dividing gives \(x \ge \frac{32}{a}\). This must be the same as \(x \ge -8\), so

\[\frac{32}{a} = -8\]

\[a = -4\]

Check: with \(a = -4\), \(-4x \le 32\) gives \(x \ge -8\). Only this value works, so it is also the greatest possible value. Enter **\(-4\)**.
```

# Words to symbols
More than is \(>\). At least is \(\ge\).

```visual
linear-inequalities--words
```

## Key ideas
Turn the words into a symbol before you do anything else.

| Words | Symbol |
|---|---|
| more than, greater than, over, exceeds | \(>\) |
| less than, fewer than, under, below | \(<\) |
| at least, no less than, minimum, \(\ldots\) or more | \(\ge\) |
| at most, no more than, maximum, up to, cannot exceed | \(\le\) |

**At least 150** is a floor: 150 or more. **At most 900** is a ceiling: 900 or less. **More than** and **less than** leave the number out. **Inclusive** keeps both ends.

\[\text{between 3 and 9: } 3 < x < 9 \qquad \text{inclusive: } 3 \le x \le 9\]

**Trap:** "at least" and "at most" are opposites. Read the whole phrase, and watch **which quantity** the phrase describes.

```example
A truck's speed \(s\) is at least 30 but less than 55 miles per hour. Write an inequality.
1. \(s \ge 30\) :: "At least 30" is a floor.
2. \(s < 55\) :: "Less than 55" leaves 55 out.
3. \(30 \le s < 55\) :: Join them in order.
```

```theory
**Strict and inclusive.** The signs \(<\) and \(>\) are **strict**: the number itself is not allowed. The signs \(\le\) and \(\ge\) are **inclusive**: the number is allowed. "More than 4" excludes 4. "At least 4" includes it. "Inclusive" in a problem ("between 97.8 and 99, inclusive") tells you both ends count.

**Other cue words.** \(\ge\): "no fewer than", "not below", "a minimum of". \(\le\): "not more than", "cannot exceed", "a maximum of", "up to". "Positive" means \(> 0\), so "a positive mass less than 510" gives \(0 < m < 510\).

**Between and ranges.** "At least 25 but no more than 45" is one range: \(25 \le x \le 45\). "More than 2 but less than 3 pounds per day" is \(2 < g < 3\). After you apply it (for example, over 365 days), multiply the whole range.

**Comparisons.** "A number \(x\) is at least twice the value of \(y\)" means \(x \ge 2y\). Build the right side from what is described, then put the sign.

**Wording traps.**
- "5 less than twice \(y\)" is \(2y - 5\), not \(5 - 2y\).
- "The product of 12 and the fourth integer" means \(12\) times that integer.
- Consecutive odd integers differ by 2: \(x\), \(x + 2\), \(x + 4\), \(x + 6\).

**Check your sign.** Put in a number that clearly fits the words. If the story says "at most 900 kg" and you test 100 kg, your inequality must accept it.
```

## Easy
```task
bank: m-0733
highlight:
- "no more than 5,000 words" :: At most 5,000: the total is \(\le 5{,}000\).
- "already has 3,026 words" :: This much is used. Subtract it from the limit.
- "maximum number of additional words" :: Limit minus what you have: \(5{,}000 - 3{,}026\).
explain:
"No more than 5,000 words" means the essay can have at most 5,000. Let \(w\) be the number of additional words. The essay will have \(3{,}026 + w\) words:

\[3{,}026 + w \le 5{,}000\]

Subtract 3,026 from both sides:

\[w \le 1{,}974\]

The greatest number of additional words is **1,974** (choice A). Choice C, 5,000, is the whole limit, not the extra words. Choice B, 3,026, is what the essay already has.
```

## Medium
```task
bank: m-0791
highlight:
- "200 pounds at birth" :: The starting weight is added once.
- "more than 2 but less than 3 pounds per day" :: The gain per day is between 2 and 3.
- "365 days after birth" :: Multiply the daily gain by 365.
explain:
The gain each day is between 2 and 3 pounds, strictly (the words are "more than" and "less than"). Over 365 days the total gain is between \(2 \cdot 365\) and \(3 \cdot 365\):

\[730 < \text{gain} < 1{,}095\]

The elephant also weighs 200 pounds at birth, so add 200 to every part:

\[930 < w < 1{,}295\]

The answer is choice **D**. Choice C forgets the 200 pounds. The signs are strict, so the endpoints 930 and 1,295 are not included.
```

## Hard
```task
bank: m-0713
highlight:
- "base salary of x dollars per year" :: Base is \(x\), earned no matter what.
- "11% of the total sales" :: Commission is \(0.11s\).
- "at least 3 times and at most 4 times the base salary" :: Earnings between \(3x\) and \(4x\), inclusive.
- "possible values of total sales s" :: Solve for \(s\) in the middle.
explain:
Total earnings are the base salary plus the commission:

\[x + 0.11s\]

The goal is at least 3 times and at most 4 times the base salary, so the earnings are between \(3x\) and \(4x\), inclusive:

\[3x \le x + 0.11s \le 4x\]

Subtract \(x\) from all three parts:

\[2x \le 0.11s \le 3x\]

Divide all three parts by 0.11, a positive number, so no sign flips:

\[\frac{2}{0.11}x \le s \le \frac{3}{0.11}x\]

The answer is choice **B**. Choice D forgets to subtract the base salary, which is already part of the earnings.
```

# Fee plus rate
A fee stands alone. A rate multiplies.

```visual
linear-inequalities--fee-rate
```

## Key ideas
A story total is **a fixed fee plus rate times quantity**. The fee is paid once and stands alone. The rate multiplies the letter. Compare the total with the limit.

\[\text{fee} + \text{rate} \cdot t \;\le\; \text{limit}\]

A fee of $25 and $10 per hour, with at most $75 to spend, is \(25 + 10t \le 75\).

**Two plans:** write both totals, then compare them: "Plan A costs more than plan B" is (total A) \(>\) (total B).

**Whole numbers:** you cannot buy 8.67 games. Under a **limit**, round **down**: nine would go over. To reach a **goal**, round **up**: if you need 14.2 games, 14 would fall short, so buy 15. Never round to the nearest.

**Trap:** put the fee on the wrong side of the multiplication (\(10 + 25t\)).

```example
A studio charges a $15 setup fee plus $6 per hour. Eli can spend at most $50. What is the greatest whole number of hours \(h\)?
1. \(15 + 6h \le 50\) :: Fee alone, rate times \(h\). "At most" is \(\le\).
2. \(h \le \frac{35}{6} \approx 5.83\) :: Subtract 15, divide by 6.
3. \(h = 5\) :: A limit: round down. Six hours cost $51.
```

```theory
**Reading the story.** Words like "per", "each" and "an hour" mark a **rate**: it multiplies the letter. A **fee**, a **starting amount** or an **already have** number is added once. "In total" or "altogether" is the whole sum. So \(25 + 10t\) means: a $25 fee plus $10 for each of \(t\) hours.

**The number on the other side is the limit.** In \(25 + 10t \le 75\), the 75 is the limit. The 25 is not the limit, even though it is a number alone: it is the fixed fee.

**Already have.** "Julissa needs at least 100 hours and has 86" gives \(86 + h \ge 100\), so \(h \ge 14\). The minimum number of additional hours is 14.

**Comparing two plans.** Adam charges \(20 + 9.5x\) and Caroline charges \(17 + 10x\). Caroline costs more when \(17 + 10x > 20 + 9.5x\). Subtract \(9.5x\) and 17: \(0.5x > 3\), so \(x > 6\). At exactly 6 hours they are equal.

**Rounding.** Round down for the greatest number you can afford or fit. Round up for the least number you need. When the story fixes a minimum total number of items and asks for the maximum of one kind, buy the **minimum** total, because every extra item costs more.

**Checks.** Put your answer back. With 5 hours: \(15 + 6 \cdot 5 = 45\), under 50. With 6 hours: \(51\), over 50.
```

## Easy
```task
bank: m-0640
highlight:
- "$25 service fee" :: A fee paid once: it stands alone.
- "$10 per hour" :: A rate: it multiplies \(t\).
- "maximum of $75" :: Maximum means at most: \(\le 75\).
explain:
The cost has two parts. The **$25 service fee** is paid once, so it stands alone. The **$10 per hour** is a rate, so it multiplies the number of hours \(t\): \(10t\). The cost is

\[25 + 10t\]

The person intends to spend a **maximum** of $75, which means at most 75:

\[25 + 10t \le 75\]

The answer is the last choice. Choice B swaps the fee and the rate. Choice A leaves out the fee; choice C leaves out the hourly rate. Test \(t = 5\): \(25 + 50 = 75\), exactly the limit, which \(\le\) allows.
```

## Medium
```task
bank: m-0717
highlight:
- "fee of $20.00 for his equipment and $9.50 per hour" :: Adam: \(20 + 9.5x\).
- "fee of $17.00 for her equipment and $10.00 per hour" :: Caroline: \(17 + 10x\).
- "total charge is greater than" :: Caroline's total \(>\) Adam's total.
explain:
Write each person's total. Adam charges a $20 fee plus $9.50 per hour: \(20 + 9.5x\). Caroline charges a $17 fee plus $10 per hour: \(17 + 10x\).

We want Caroline's total to be greater than Adam's:

\[17 + 10x > 20 + 9.5x\]

Subtract \(9.5x\) from both sides: \(17 + 0.5x > 20\). Subtract 17: \(0.5x > 3\). Divide by 0.5, a positive number, so no flip:

\[x > 6\]

The answer is choice **D**. At exactly 6 hours, both charge \(20 + 57 = 77\) dollars, so they are equal. Caroline charges more only after that.
```

## Hard
```task
bank: m-0807
highlight:
- "$2,200" :: The budget is the limit for the total cost.
- "minimum of 200 candles" :: To get the most large candles, buy exactly 200 in all.
- "$4.90 per candle" :: Small candles: \(4.90(200 - L)\).
- "$11.60 per candle" :: Large candles: \(11.60L\).
explain:
Let \(L\) be the number of large candles. The owner needs at least 200 candles in total. Every extra candle costs money, so to buy the **most** large candles, buy exactly 200 candles in all. Then there are \(200 - L\) small candles.

The total cost must stay within the budget:

\[4.90(200 - L) + 11.60L \le 2{,}200\]

Distribute: \(980 - 4.90L + 11.60L \le 2{,}200\). Combine: \(980 + 6.70L \le 2{,}200\).

\[6.70L \le 1{,}220\]

\[L \le 182.09\ldots\]

Candles come in whole numbers, and this is a limit, so round **down**: \(L = 182\). Check 183: \(183(11.60) + 17(4.90) = 2{,}206.10\), which is over $2,200. Enter **182**.
```

# Two kinds of items
Add both costs. Know what each number means.

```visual
linear-inequalities--budget
```

## Key ideas
With two items, add both costs on the left side.

\[4x + 9y \le 90\]

Posters cost $4 each (\(x\) of them), banners cost $9 each (\(y\) of them), and the budget is $90.

**Each part has a job.** \(4x\) is the money spent on posters. \(4\) is the price of one poster. \(90\) is the limit. "In context" questions ask exactly this: the number in front of a letter is the price (or rate), and the letter's own term is the total for that item.

**A solution** is a point \((x, y)\) that makes the inequality true. Put the numbers in, work out the left side, and compare. Exactly 90 is allowed by \(\le\).

**Fix one letter** (say, 6 posters) and solve for the other: \(4(6) + 9y \le 90\) gives \(y \le 7.33\), so 7 banners.

```example
Sandwiches cost $7 and smoothies cost $4. A group spends at most $80: \(7s + 4m \le 80\). Is \((8, 7)\) allowed?
1. \(7(8) + 4(7)\) :: Put in \(s = 8\) and \(m = 7\).
2. \(56 + 28 = 84\) :: Add the two costs.
3. \(84 \le 80\) is false :: Over budget: not allowed.
```

```theory
**Setting it up.** Name each unknown. Multiply each by its price or weight. Add. Then compare with the limit using the sign the words give ("at most" is \(\le\)).

**A fixed amount.** If a load or fee is already used, either subtract it from the limit or add it on the left. A truck with a 5,000-pound limit that already carries 300 pounds can hold \(25x + 62y \le 4{,}700\), or equivalently \(300 + 25x + 62y \le 5{,}000\). Do not both subtract it and add it.

**Meaning questions.** Look at the term. \(14y\) with \(y\) large pizzas at $14 each is the total dollars on large pizzas. \(14\) alone is the price of one large pizza. \(115\) is the maximum spending. The wrong choices usually describe the number alone when the question asks about the whole term, or the other way round.

**Solutions.** The set of solutions is a region: many \((x, y)\) pairs work. To test a point, put in both numbers. On the SAT you may be told one coordinate and asked for the largest or smallest value of the other. Substitute the known letter and solve. Then think about whole numbers (rounding down for a limit, up for a goal).

**Maximum number of one kind.** If the story also says you must buy at least 10 items in total, then the largest number of the expensive kind is found by buying exactly the minimum number of items, because every extra item uses up budget.

**Check.** Test a point that is clearly fine (small numbers) and one that is clearly too large.
```

## Easy
```task
bank: m-0995
highlight:
- "11x + 14y ≤ 115" :: Each term is a price times a count.
- "x small cheese pizzas and y large cheese pizzas" :: \(y\) counts the large pizzas.
- "best interpretation of 14y" :: Asks about the whole term \(14y\), not the 14.
explain:
In \(11x + 14y \le 115\), each term is a price times a count. The letter \(y\) is the number of large pizzas. The 14 is the price of one large pizza in dollars.

So \(14y\) is the price per pizza times the number of pizzas: the **total amount spent on large pizzas**. That is the third choice.

The first choice describes the 14 alone (the price of one large pizza), but the question asks about the whole term \(14y\). The terms with small pizzas, \(11x\), are the other part of the cost, and 115 is the most Anthony can spend.
```

## Medium
```task
bank: m-0702
highlight:
- "maximum weight of 5,630 pounds" :: The limit: the total must be at most 5,630.
- "190-pound piece of equipment" :: Fixed load: take it off the limit first.
- "number of 25-pound crates, x" :: \(x\) crates at 25 pounds: \(25x\).
- "number of 62-pound crates, y" :: \(y\) crates at 62 pounds: \(62y\).
explain:
The truck hauls a maximum of 5,630 pounds. That total includes a 190-pound piece of equipment. So the crates alone can weigh at most

\[5{,}630 - 190 = 5{,}440\]

Each 25-pound crate adds 25 pounds, so \(x\) of them weigh \(25x\). Each 62-pound crate adds 62 pounds, so \(y\) of them weigh \(62y\). The crates together must weigh at most 5,440:

\[25x + 62y \le 5{,}440\]

This is the first choice. The choices with \(62x + 25y\) swap the weights. The choices with \(\ge\) say the crates must weigh at least that much, but the truck has a maximum.
```

## Hard
```task
A theater needs to raise at least $2,550 for a new stage. It already has $450 in donations. Adult tickets cost $18 each and child tickets cost $15 each. If the theater sells 90 adult tickets, what is the least number of child tickets it must sell to reach its goal?
answer: 32
- 62 :: You left out the $450 in donations.
- 170 :: That ignores both the donations and the adult tickets.
- 480 :: That is the money still needed. Divide it by $15.
highlight:
- "at least $2,550" :: At least: total money \(\ge 2{,}550\).
- "$450 in donations" :: Already have: add it once.
- "$18 each" :: Adult tickets: \(18 \cdot 90\).
- "90 adult tickets" :: 90 adult tickets bring \(18 \cdot 90\) dollars.
explain:
Let \(c\) be the number of child tickets. The total money is donations plus adult tickets plus child tickets:

\[450 + 18(90) + 15c \ge 2{,}550\]

Compute \(18 \cdot 90 = 1{,}620\), so \(450 + 1{,}620 = 2{,}070\):

\[2{,}070 + 15c \ge 2{,}550\]

\[15c \ge 480\]

\[c \ge 32\]

The least number of child tickets is **32**. Check: \(450 + 1{,}620 + 15 \cdot 32 = 2{,}550\), exactly the goal, which \(\ge\) allows. With 31 child tickets the total is $2,535, which falls short. The donations are money the theater already has, so they count once, on the left side, and they must not be forgotten: skipping them gives 62.
```

# Graphs and shading
Dashed or solid. Above or below.

```visual
linear-inequalities--shading
```

## Key ideas
The graph of a linear inequality is a **boundary line** plus a **shaded side**.

- **Solid** line: \(\le\) or \(\ge\). Points on the line count.
- **Dashed** line: \(<\) or \(>\). Points on the line do not count.
- Solve for \(y\) first. Then \(y >\) or \(y \ge\) shades **above** the line, and \(y <\) or \(y \le\) shades **below**.

\[4x - 8y > 5 \;\Rightarrow\; y < \frac{1}{2}x - \frac{5}{8}\]

Dividing by \(-8\) flipped the sign, so the shading goes **below**, not above. A negative \(y\)-coefficient is the classic trap.

Not sure? **Test a point** off the line, such as the origin \((0, 0)\). If it makes the inequality true, shade its side.

A point is a **solution** when it makes the inequality true: put \(x\) and \(y\) in.

```example
\(2x - y \ge 4\). Is \((3, 1)\) a solution? Describe the graph.
1. \(2(3) - 1 = 5\), and \(5 \ge 4\) is true :: Yes, \((3, 1)\) is a solution.
2. \(-y \ge 4 - 2x\) :: Move \(2x\) to the right.
3. \(y \le 2x - 4\) :: Divide by \(-1\): flip. Solid line, shade below.
```

```desmos
Graph it. \(2x - y \ge 4\). Is \((3, 1)\) in the shading?
type 2x-y\ge 4 :: Type it as it is. Desmos shades for you.
zoom -2 8 -6 6
point (3, 1) :: It sits in the shading: a solution.
```

```theory
**Boundary line.** Replace the inequality sign with \(=\) and draw that line. Every point on one side of it makes the inequality true. Every point on the other side makes it false.

**Solid or dashed.** The sign tells you whether the line itself is part of the answer. \(\le\) and \(\ge\) include it (solid). \(<\) and \(>\) do not (dashed).

**Which side?** In \(y = mx + b\) form, "greater than" means above and "less than" means below, because bigger \(y\) is higher. If the equation is not solved for \(y\), solve it first. Remember to flip the sign when you divide by a negative. Otherwise, test the point \((0, 0)\), unless it lies on the line (then use \((1, 0)\) or \((0, 1)\)).

**Vertical lines.** \(x > 3\) is shaded to the right of the vertical line \(x = 3\). \(x \le -1\) is shaded to the left of \(x = -1\).

**Region questions.** Some questions ask which region (a quadrant, an axis) contains no solutions. Check the signs. For \(5x - 7y > 35\): when \(x < 0\) and \(y > 0\), \(5x\) is negative and \(-7y\) is negative, so the sum is negative and can never exceed 35. That region has no solutions.

**Infinite solutions.** An inequality in two variables has infinitely many solutions: a whole region of points.

**Which point?** Often the choices are points. Test each one by substituting. One test is enough to reject a point.
```

## Easy
```task
bank: m-0775
highlight:
- "y < -4x + 4" :: A point works if its \(y\) is less than \(-4x + 4\).
- "Which point (x, y) is a solution" :: Test each choice.
explain:
A point is a solution if it makes the inequality true. Put each choice in for \(x\) and \(y\).

Try the first choice, \((-4, 0)\). Then \(-4x + 4 = -4(-4) + 4 = 20\). Is \(0 < 20\)? Yes. So \((-4, 0)\) is a solution.

Check the others to be sure. For \((0, 5)\): \(-4(0) + 4 = 4\), and \(5 < 4\) is false. For \((2, 1)\): \(-4(2) + 4 = -4\), and \(1 < -4\) is false. For \((2, -1)\): \(-4\) again, and \(-1 < -4\) is false.

The answer is **\((-4, 0)\)**, the first choice. In a graph, it lies below the dashed line \(y = -4x + 4\).
```

## Medium
```task
bank: m-0704
highlight:
- "5x - 7y > 35" :: For a solution, \(5x - 7y\) must be large and positive.
- "does NOT contain any points" :: Find the region where the inequality always fails.
- "part of the solution set" :: Check the signs of \(5x\) and \(-7y\) in each region.
explain:
We need the region with **no** solutions. A solution has \(5x - 7y > 35\), so \(5x - 7y\) must be positive and big.

Look at the signs in each region. When \(x < 0\) and \(y > 0\), \(5x\) is negative, and \(-7y\) is also negative. So \(5x - 7y\) is negative and can never exceed 35. No point in that region is a solution.

The other regions all have solutions. For example, \((8, 0)\) on the \(x\)-axis gives \(40 > 35\), \((10, 1)\) with both positive gives \(43 > 35\), and \((-1, -10)\) with both negative gives \(-5 + 70 = 65 > 35\).

The answer is the region where \(x < 0\) and \(y > 0\) (choice D).
```

## Hard
```task
The solution set to the inequality \(3x - 6y \ge 12\) is graphed in the \(xy\)-plane. Which of the following describes the graph?
- Solid line \(y = \frac{1}{2}x - 2\), shaded above :: Dividing by \(-6\) flips the sign, so shade below.
* Solid line \(y = \frac{1}{2}x - 2\), shaded below
- Dashed line \(y = \frac{1}{2}x - 2\), shaded below :: \(\ge\) includes the line, so it is solid.
- Solid line \(y = 2x - 4\), shaded below :: The slope is \(\frac{3}{6}\), not \(\frac{6}{3}\).
highlight:
- "\(3x - 6y \ge 12\)" :: Solve for \(y\): dividing by \(-6\) flips the sign.
- "solution set" :: Both the boundary line and the shaded side matter.
explain:
Solve for \(y\). Subtract \(3x\) from both sides:

\[-6y \ge 12 - 3x\]

Divide both sides by \(-6\). This flips the sign, so \(\ge\) becomes \(\le\):

\[y \le \frac{3x - 12}{6} = \frac{1}{2}x - 2\]

The sign is now \(\le\), so the boundary line \(y = \frac{1}{2}x - 2\) is **solid**, and \(y\) less than the line means the region **below** it is shaded.

The answer is the solid line shaded below. If you skipped the flip, you would shade above (the first choice), which is the trap.

Test with the origin: \(3(0) - 6(0) \ge 12\) becomes \(0 \ge 12\), which is false. The origin lies above the line (at \(x = 0\) the line is at \(y = -2\)), and it is not a solution, so the shading is on the other side: below.
```

# Systems of inequalities
Shade each one. The overlap is the answer.

```visual
linear-inequalities--overlap
```

## Key ideas
A system of inequalities has a **region** of solutions, not one point. A point is a solution when it makes **every** inequality true. One failure is enough to throw it out.

Test the choices: put \((x, y)\) in each inequality.

\[y > 3x - 2 \quad\text{and}\quad x + y \le 6\]

For \((1, 4)\): \(4 > 1\) is true and \(5 \le 6\) is true. It is a solution.

**A coordinate is given.** If the point is \((x, 53)\), put \(y = 53\) in each inequality and solve for \(x\). Flip the sign if you divide by a negative.

**Equation plus inequality.** Use the equation to remove one letter, then solve the inequality.

**Trap:** a point on a dashed (strict) boundary is not a solution.

```example
\(p + q = 20\) and \(3p + 5q \le 80\). What is the least value of \(p\)?
1. \(q = 20 - p\) :: Use the equation to remove \(q\).
2. \(3p + 5(20 - p) \le 80\) :: Substitute. Keep the brackets.
3. \(-2p \le -20\) :: Combine: \(3p - 5p = -2p\). Move 100.
4. \(p \ge 10\) :: Divide by \(-2\): flip the sign.
```

```desmos
See the overlap. \(y > 3x - 2\) and \(x + y \le 6\). Is \((1, 4)\) a solution?
type y>3x-2 :: Type each inequality on its own line.
type x+y\le 6
zoom -4 8 -4 8
point (1, 4) :: It sits in both shadings: a solution.
```

```theory
**Overlap.** Each inequality shades a half-plane. The solutions of the system are the points where all the shadings overlap. The overlap can be a wedge or a strip, and it can go on forever.

**Testing points.** The fastest way to answer "which point is a solution" is to test the choices, usually starting with the simplest numbers. The first inequality often rules out two choices, and the second rules out the rest.

**Table questions.** Some questions give a table of \(x\) and \(y\) values and ask for which table all pairs satisfy the system. Test each pair in both inequalities. One bad pair rejects the table.

**One coordinate given.** For "the point \((x, 53)\) is a solution", substitute \(y = 53\). The first inequality \(y > 14\) is already true. The second, \(4x + y < 18\), becomes \(4x + 53 < 18\), so \(4x < -35\) and \(x < -8.75\).

**Maximum and minimum.** To find the greatest or least \(x\) or \(y\) in the region, look at where the boundary lines **meet**. Solve the two boundary equations as a system to find that corner.

**Without numbers for \(k\).** In \(y > 2x + k\) and \(y < 9 - x\), a \(y\) exists only if \(2x + k < 9 - x\), so \(x < \frac{9 - k}{3}\). When two inequalities squeeze \(y\) between them, the lower bound must be less than the upper bound.

**Mixed systems.** With an equation like \(p + q = 20\), the solutions lie on a line, not a region. Use the equation to remove a letter, and solve the inequality for what is left.
```

## Easy
```task
bank: m-0689
highlight:
- "y ≤ x + 7" :: The point must pass this inequality.
- "y ≥ -2x - 1" :: And this one. A solution passes both.
- "Which point (x, y) is a solution to the given system of inequalities" :: Test each choice in both.
explain:
A solution must make **both** inequalities true. Test the choices one at a time.

Try \((14, 0)\). First inequality: \(y \le x + 7\) becomes \(0 \le 21\), which is true. Second: \(y \ge -2x - 1\) becomes \(0 \ge -29\), which is true. Both hold, so \((14, 0)\) is a solution.

Check the others. \((0, 14)\): \(14 \le 7\) is false. \((-14, 0)\): \(0 \le -7\) is false. \((0, -14)\): \(-14 \ge -1\) is false.

The answer is **\((14, 0)\)** (choice D). One failed inequality is enough to reject a point.
```

## Medium
```task
bank: m-0888
highlight:
- "y > 14" :: The \(y\)-value 53 passes this one.
- "4x + y < 18" :: Put \(y = 53\) in here.
- "The point (x, 53)" :: \(y\) is known: put \(y = 53\) in.
- "Which of the following could be the value of x?" :: Test each choice.
explain:
The point has \(y = 53\). Check the first inequality: \(53 > 14\) is true, so it does not limit \(x\).

Put \(y = 53\) in the second inequality:

\[4x + 53 < 18\]

\[4x < -35\]

\[x < -8.75\]

Only one choice is less than \(-8.75\): \(-9\). Choice B, \(-5\), gives \(4(-5) + 53 = 33\), which is not less than 18.

The answer is **\(-9\)** (choice A). Dividing by 4 is positive, so the sign does not flip.
```

## Hard
```task
bank: m-16233
highlight:
- "y > 2x + k" :: \(y\) must be above this line.
- "y < 9 − x" :: And below this one.
- "k is a positive constant" :: \(k\) is just a number: keep it as it is.
- "x-coordinates of all the points" :: Which \(x\) have a \(y\) that fits between the lines?
explain:
A point \((x, y)\) is a solution when \(y\) fits between the two lines:

\[2x + k < y < 9 - x\]

For a given \(x\), such a \(y\) exists only if the lower bound is less than the upper bound:

\[2x + k < 9 - x\]

Add \(x\) to both sides: \(3x + k < 9\). Subtract \(k\): \(3x < 9 - k\). Divide by 3, a positive number, so no flip:

\[x < \frac{9 - k}{3}\]

The answer is choice **D**. Check with \(k = 3\): \(x < 2\). At \(x = 1\), \(y\) must satisfy \(5 < y < 8\), which has solutions. At \(x = 3\), \(y\) must satisfy \(9 < y < 6\), which has none.
```

