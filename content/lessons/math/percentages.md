---
title: Percentages
skill: percentages
domain: problem-solving
section: math
summary: Turn percents into multipliers; find parts, wholes and changes.
---

# Percent of a number
"Of" means times. "Is" means equals.

```visual
percentages--part-whole
```

## Key ideas
**Percent** means "per hundred": 30% is \(\frac{30}{100} = 0.3\). Turn a percent sentence into one equation, with "of" as times and "is" as equals:

\[\text{part} = \frac{p}{100} \times \text{whole}\]

That one equation answers three kinds of questions:
- Find the part: 20% of 440 is \(0.2 \times 440 = 88\).
- Find the whole: 18 is 30% of what number? \(18 = 0.3w\), so \(w = 60\).
- Find the percent: what percent of 80 is 20? \(\frac{20}{80} \times 100 = 25\), so 25%.

The number after "of" is the whole. The number before "is" is the part. A percent over 100% only means the part is bigger than the whole.

If a grid-in asks for a percent, type the percent number (25), not the decimal (0.25), unless the question says otherwise.

```example
18 is 30% of what number?
1. \(18 = \frac{30}{100} \times w\) :: "Is" means equals. "Of" means times.
2. \(18 = 0.3w\) :: \(30 \div 100 = 0.3\).
3. \(w = 18 \div 0.3 = 60\) :: Divide both sides by 0.3.
```

```theory
The three numbers in a percent problem have fixed jobs. The **whole** is the amount you are taking a percent of. The **part** is the piece. The **percent** says how big the part is compared with the whole. Their relationship is always part = percent times whole, so you can rearrange it:
- percent = part divided by whole, times 100
- whole = part divided by the percent as a decimal

Do not confuse **percent** with **percentage points**. If a rate rises from 20% to 25%, it rises 5 percentage points. But the rate itself rose by \(\frac{5}{20} = 25\)%. The SAT words these differently, so read carefully.

Percents over 100% are fine. 140% of a number is 1.4 times it. If a school has 90 laptops and that is 150% of the laptops in the library, the library has \(\frac{90}{1.5} = 60\) laptops. You divide because the library's number is the whole.

Quick mental checks: 10% of a number moves the decimal one place left, 50% is half, 1% is one hundredth. Estimate first. If the part must be smaller than the whole and your answer is bigger, something is flipped.

Traps:
- Using the wrong number as the whole. It follows "of".
- Multiplying when you need to divide to find the whole.
- Forgetting to divide the percent by 100.
```

## Easy
```task
bank: m-1228
highlight:
- "of 300" :: The whole comes after "of": it is 300.
- "is 75" :: The part comes before "is": 75 is the part.
- "What percentage" :: Percent equals part divided by whole, times 100.
explain:
Match each number with its job. The whole follows "of", so the whole is 300. The part is 75.

Percent is part divided by whole, then times 100:

\[\frac{75}{300} \times 100 = 0.25 \times 100 = 25\]

So 75 is 25% of 300.

Check: 25% is one quarter, and \(\frac{300}{4} = 75\). Choice D (225%) mixes up the two numbers: 225 is 75% of 300. The answer is A, 25%.
```

## Medium
```task
A warehouse has 210 crates. This is 140% of the number of crates in a shed. How many crates are in the shed?
* 150
- 294 :: You multiplied 210 by 1.4. The shed is the whole, so divide.
- 84 :: That is 40% of 210. The percent here is 140%.
- 525 :: You divided by 0.4. The percent as a decimal is 1.4.
highlight:
- "210 crates" :: This is the part: it equals 140% of the shed.
- "140% of the number of crates in a shed" :: The shed is the whole. The equation is 210 = 1.4 times the shed.
- "How many crates are in the shed" :: Solve for the whole by dividing 210 by 1.4.
explain:
The shed is the whole, because the 140% is "of the number of crates in a shed." The warehouse's 210 crates are the part.

Write the equation, with \(s\) for the crates in the shed:

\[210 = 1.4s\]

Divide both sides by 1.4:

\[s = \frac{210}{1.4} = 150\]

Check: 140% of 150 is \(1.4 \times 150 = 210\). The warehouse has more crates than the shed, which fits a percent above 100%. Choice B (294) multiplies 210 by 1.4 instead, which would be 140% of the warehouse. The answer is 150.
```

## Hard
```task
A store reduces the price of every item by the same percent. A scarf that originally cost $48 now costs $38.40. A jacket now costs $68. What was the original price, in dollars, of the jacket?
answer: 85
- 54.4 :: You took 80% of $68. The $68 is already the sale price.
- 81.6 :: You added 20% of $68. The 20% is taken from the original.
- 88 :: You added 20 dollars. A percent discount is not a dollar amount.
highlight:
- "reduces the price of every item by the same percent" :: One discount percent applies to every item.
- "$48 now costs $38.40" :: Use the scarf to find the discount: 38.40 is what part of 48?
- "A jacket now costs $68" :: This is the sale price, which is the part, not the whole.
- "original price, in dollars, of the jacket" :: The original is the whole: divide the sale price by the multiplier.
explain:
Use the scarf to find the multiplier, since the same percent applies to every item:

\[\frac{38.40}{48} = 0.8\]

Each item now costs 80% of its original price (a 20% discount).

For the jacket, $68 is 80% of the original price \(J\):

\[0.8J = 68, \qquad J = \frac{68}{0.8} = 85\]

Check: 20% of 85 is 17, and \(85 - 17 = 68\), which matches the jacket's price. The scarf gives the same 80%: 20% of 48 is 9.60, and \(48 - 9.60 = 38.40\). The answer is 85.
```

# One multiplier
Up 20%: times 1.2. Down 20%: times 0.8.

```visual
percentages--multiplier
```

## Key ideas
Start every percent change from the old amount, which is **100%**. Add the percent for an increase, subtract it for a decrease, then multiply once:

\[\text{new} = \text{old} \times \left(1 \pm \frac{p}{100}\right)\]

Up 20% is \(1 + 0.20 = 1.2\). Down 8% is \(1 - 0.08 = 0.92\). A rise over 100% still starts from 100%: up 150% is \(1 + 1.5 = 2.5\), so multiply by 2.5, not 1.5.

When the percent is a letter, divide it by 100 inside the bracket. A price of 240 reduced by \(p\)% is \(240\left(1 - \frac{p}{100}\right)\), **not** \(240(1 - p)\).

The SAT also says "the result is \(k\) times the original". Then \(k\) is the multiplier. If a question gives no amounts, pick 100 to start.

```example
A ticket costs $50. The price rises 20%. What is the new price?
1. \(100\% + 20\% = 120\% = 1.2\) :: The old price is 100%. Add the rise.
2. \(50 \times 1.2 = 60\) :: Multiply the old price.
3. $60 :: The new price.
```

```theory
Why one multiplier works: an increase of \(p\)% adds \(p\)% of the old amount to the old amount: \(\text{old} + \frac{p}{100}\,\text{old} = \text{old}\left(1 + \frac{p}{100}\right)\). A decrease takes it away, giving \(1 - \frac{p}{100}\). Doing it as one multiplication avoids the common mistake of working out the discount and forgetting to subtract it.

Read a multiplier back as a percent change. 1.43 means up 43%. 0.35 means 35% of the original is left, so it is down 65%. A question like "0.35\(x\) represents decreasing \(x\) by what percent?" has the answer 65%, not 35%.

Everyday cases:
- A 5% sales tax multiplies by 1.05.
- A 20% discount multiplies by 0.8, and the shopper pays 80%.
- "Doubled" is up 100%, multiplier 2. "Tripled" is up 200%, multiplier 3.

Letters work the same way, so keep the \(\frac{p}{100}\). Choosing 240\((1 - p)\) would mean a decrease of \(100p\)%, which is far more than the price itself.

Plugging in 100 is a safe backup for expression questions. If the original is 100, the new amount is just 100 plus or minus the percent. Test each choice with one value of \(p\), like 10, and see which one matches.

Traps:
- Using 0.8 instead of 0.08 for 8%.
- Reading "up 150%" as 1.5 instead of 2.5.
- Giving the discount ($2) instead of the price you pay.
```

## Easy
```task
bank: m-1295
highlight:
- "increasing" :: An increase means the multiplier is above 1.
- "a positive quantity w" :: The old amount is w, the one that is 100%.
- "by 43%" :: Add 43% to 100%: the multiplier is 1.43.
explain:
Start with the old quantity \(w\), which is 100% of itself. Increasing by 43% means adding 43% of \(w\):

\[w + 0.43w = 1.43w\]

So the result is 1.43 times the old quantity.

Check with \(w = 100\): up 43% gives 143, and \(1.43 \times 100 = 143\). Choice D (0.43\(w\)) is only the amount of the increase, not the new total. Choice B (0.57\(w\)) would be a decrease. The answer is A, 1.43\(w\).
```

## Medium
```task
bank: m-1388
highlight:
- "increasing the quantity x by 400%" :: Up 400% means the multiplier is 1 + 4 = 5, not 4.
- "is 60" :: The new amount is 60, so 5 times x equals 60.
- "value of x" :: Divide 60 by the multiplier to get back to the old quantity.
explain:
A rise of 400% starts at 100% and adds 400%, so the new amount is 500% of \(x\). The multiplier is 5:

\[5x = 60\]

Divide both sides by 5:

\[x = 12\]

Check: 400% of 12 is 48, and \(12 + 48 = 60\). Choice B (15) comes from \(4x = 60\), which forgets that the increase is added to the original amount. Choice C (240) multiplies 60 by 4. The answer is 12.
```

## Hard
```task
A speaker's regular price is \(d\) dollars. During a sale, the price is reduced by \(p\)%, where \(p\) is between 0 and 100. A sales tax of 8% is then added to the sale price. Which expression gives the total cost, in dollars, of the speaker?
* \(1.08d\left(1 - \frac{p}{100}\right)\)
- \(1.08d(1 - p)\) :: The percent must be \(\frac{p}{100}\), not \(p\).
- \(d\left(1 - \frac{p}{100} + 0.08\right)\) :: Do not add the changes. Multiply the two multipliers.
- \(1.08d \cdot \frac{p}{100}\) :: That keeps only \(p\)% of the price, not \(1 - \frac{p}{100}\).
highlight:
- "reduced by \(p\)%" :: A decrease: multiplier \(1 - \frac{p}{100}\).
- "sales tax of 8% is then added to the sale price" :: A second change on the new price: multiply by 1.08.
- "total cost" :: Multiply the original price by both multipliers.
explain:
Take the two changes in order, as multipliers.

The sale reduces the price by \(p\)%. Dividing the percent by 100, the multiplier is \(1 - \frac{p}{100}\), so the sale price is \(d\left(1 - \frac{p}{100}\right)\).

The tax of 8% is added to the sale price, so multiply that by \(1 + 0.08 = 1.08\):

\[1.08 \cdot d\left(1 - \frac{p}{100}\right)\]

Check with \(d = 100\) and \(p = 10\): the sale price is 90, with tax \(90 \times 1.08 = 97.2\). The expression gives \(1.08 \times 100 \times 0.9 = 97.2\). The wrong choice with \(1 - p\) gives a negative number. The answer is the first choice.
```

# Percent change
Change over original. The base follows "than".

```visual
percentages--change
```

## Key ideas
Percent change always compares the change with the **old** (original) value:

\[\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%\]

A plant growing from 20 cm to 23 cm gains 3 cm, and \(\frac{3}{20} = 0.15\), so it grew 15%. The shortcut: \(\frac{\text{new}}{\text{old}}\) is the multiplier, so subtract 1. Here \(\frac{23}{20} = 1.15\).

In "\(p\)% greater than \(X\)" and "\(p\)% less than \(X\)", the base is the number after the word "than". So "45 is \(p\)% greater than 30" means the increase, 15, is \(p\)% of 30, so \(p = \frac{15}{30} \times 100 = 50\).

"Is 400% **of**" and "is 400% **greater than**" are different. 200 is 400% of 50, but 200 is only 300% greater than 50, because 200 is 150 more than 50.

```example
A plant grows from 20 cm to 23 cm. What is the percent increase?
1. \(\frac{23 - 20}{20}\) :: Change over the old value.
2. \(0.15 = 15\%\) :: Write the decimal as a percent.
3. Up 15% :: A positive change is an increase.
```

```theory
**Percent increase** and **percent decrease** are both percent change. The sign tells which one: a positive result is an increase, a negative one is a decrease. In a store, sales falling from 50 to 40 are a change of \(\frac{40 - 50}{50} = -0.2\), a 20% fall. Dividing by the new value (40) gives 25%, the classic wrong answer.

Direction matters, because the base changes. Going from 40 to 50 is up 25%, but from 50 to 40 is down 20%. The same pair of numbers gives different percents.

When a question says "\(a\) is \(p\)% greater than \(b\)", write \(a = b\left(1 + \frac{p}{100}\right)\). The thing after "than" is \(b\), the base. For "less than", use \(1 - \frac{p}{100}\). When two of these are chained, such as "\(a\) is 150% greater than \(b\), and \(b\) is 60% less than 50", work from the base you know: first \(b = 0.40 \times 50 = 20\), then \(a = 2.5 \times 20 = 50\).

A percent over 100% for an increase is possible: going from 9 to 90 is an increase of 81, and \(\frac{81}{9} = 9 = 900\%\). But a decrease can never be more than 100%.

If the question gives a multiplier instead, like "\(z\) is 1.25 times 80", then \(z\) is 25% greater than 80.

Traps:
- Using the new value as the base.
- Confusing "400% of" with "400% greater than".
- Reporting the multiplier (1.15) instead of the change (15%).
```

## Easy
```task
bank: m-1365
highlight:
- "1.13 times 100" :: The multiplier is 1.13, which is 100 plus 13% of 100.
- "what percent greater than 100" :: The base is the number after "than": 100.
explain:
Find the value: \(z = 1.13 \times 100 = 113\).

The base is the number after "than", which is 100. The increase is \(113 - 100 = 13\). As a percent of the base:

\[\frac{13}{100} \times 100\% = 13\%\]

So \(z\) is 13% greater than 100.

Check: a multiplier of 1.13 means up 13%. Choice A (11.3) misreads 1.13 as 11.3%. Choice D (213) adds 100 and 113, which is not a percent of anything here. The answer is B, 13.
```

## Medium
```task
bank: m-1467
highlight:
- "p% greater than 10" :: The number after "than" is the base: 10.
- "140 is" :: 140 is the new amount, so the increase is 140 minus 10.
explain:
"Greater than 10" makes 10 the base. The new amount is 140, so the increase is

\[140 - 10 = 130\]

Write the increase as a percent of the base:

\[p = \frac{130}{10} \times 100 = 1300\]

Check: a 1,300% increase means multiplying by \(1 + 13 = 14\), and \(10 \times 14 = 140\). Choice A (1,400) says 140 is 1,400% of 10, which is a different statement from "1,400% greater than 10." The answer is B, 1,300.
```

## Hard
```task
bank: m-1287
highlight:
- "190% greater than the number b" :: Base is b: a equals b times (1 + 1.90) = 2.90b.
- "80% less than 24" :: Base is 24: b equals 24 times (1 - 0.80) = 0.20 times 24.
- "value of a" :: Find b first, then use it to find a.
explain:
Work from the number you know. The base is whatever follows "than".

First, b is 80% less than 24. A decrease of 80% keeps 20%:

\[b = 0.20 \times 24 = 4.8\]

Next, a is 190% greater than b. An increase of 190% gives a multiplier of \(1 + 1.9 = 2.9\):

\[a = 2.9 \times 4.8 = 13.92\]

Check: \(190\%\) of 4.8 is 9.12, and \(4.8 + 9.12 = 13.92\). Choice A (9.12) is only the increase, which would be 190% **of** b. The answer is B, 13.92.
```

# Going back
Know the result? Divide by the multiplier.

```visual
percentages--go-back
```

## Key ideas
When you know the **result** of a percent change and need the original, divide by the multiplier:

\[\text{old} = \frac{\text{new}}{\text{multiplier}}\]

A bag costs $72 after a 10% discount. The 10% was taken from the unknown original, so write \(\text{old} \times 0.9 = 72\) and divide: \(\text{old} = \frac{72}{0.9} = 80\). Do not take 10% of 72, because 72 is not the original price.

The same idea answers "how many were removed": find the original first, then subtract.

Percent changes are **not symmetric**. If \(x\) is 50% greater than \(y\), then \(x = 1.5y\), so \(y = \frac{x}{1.5} \approx 0.667x\). That makes \(y\) about 33.3% less than \(x\), not 50% less. Each percent uses its own base.

Check every answer by running the change forward again.

```example
After a 10% discount, a bag costs $72. What was the original price?
1. \(\text{old} \times 0.9 = 72\) :: A 10% discount keeps 90%.
2. \(\text{old} = \frac{72}{0.9} = 80\) :: Divide by the multiplier.
3. $80 :: Check: \(80 \times 0.9 = 72\).
```

```theory
The unknown number is the **old** amount, because the percent change was applied to it. The result is a different number, so you cannot take the percent of the result. That is why going back means dividing by the multiplier, not subtracting the percent from the result.

Common wrong moves and why they fail:
- Taking 25% off $60 to undo a 25% raise. A 25% raise multiplies by 1.25, so undoing it divides by 1.25, which gives $48. Taking 25% off $60 gives $45, because 25% of the bigger number is too much.
- Adding the percent to the result, such as \(60 \times 1.25 = 75\). That makes a second raise.

For decreases, the same method works. "After 30% of the seats were removed, 280 remained" means 70% remained: \(0.7s = 280\), so \(s = 400\). The question may then ask how many were removed, \(400 - 280 = 120\). Always read the final question: it may be the original, the result or the difference.

Why the asymmetry? Percent change depends on the base. If machine A makes 20% less than machine B, then \(A = 0.8B\). Machine B makes \(\frac{1}{0.8} = 1.25\) times as much as A, which is 25% more, not 20% more.

When no number is given, pick 100 for the original. It turns the relationship into easy arithmetic: with an original of 100 and a result of 60, the bigger is \(\frac{100}{60}\) of the smaller.
```

## Easy
```task
bank: m-1386
highlight:
- "A number n is increased 6%" :: A 6% increase means multiply n by 1.06.
- "the result is 318" :: The result is the new amount: 1.06n equals 318.
- "value of n" :: n is the original. Divide the result by 1.06.
explain:
Increasing \(n\) by 6% multiplies it by 1.06. The result is 318, so

\[1.06n = 318\]

The unknown \(n\) is the original number, so divide by the multiplier:

\[n = \frac{318}{1.06} = 300\]

Check: \(1.06 \times 300 = 318\). Choice D (337) adds 6% to 318, which is a second increase. Choice A (199) is not close, because the original must be a bit below 318. The answer is 300.
```

## Medium
```task
bank: m-1459
highlight:
- "20% of the original number of marbles" :: The 20% is taken from the original, which is unknown.
- "360 marbles remained" :: This is the result. It is 80% of the original.
- "How many marbles were removed" :: Find the original first, then subtract 360.
explain:
Removing 20% leaves 80% of the original. If \(n\) is the original number of marbles:

\[0.8n = 360, \qquad n = \frac{360}{0.8} = 450\]

The question asks how many were **removed**, not how many there were:

\[450 - 360 = 90\]

Check: 20% of 450 is 90. Choice A (72) is 20% of 360, which uses the wrong base, because 360 is what is left and not the original. Choice C (450) is the original number, not the number removed. The answer is B, 90.
```

## Hard
```task
Tank A holds 40% less water than tank B. Tank B holds approximately what percent more water than tank A?
- About 40%  :: You reused 40%. Each percent uses its own base.
- About 60% :: That is A over B. The base must be A.
* About 66.7%
- About 166.7% :: That is B as a percent of A. Subtract 100%.
highlight:
- "40% less water than tank B" :: Base is tank B: A holds 0.6 of B.
- "what percent more water than tank A" :: The base switches to tank A, the number after "than".
explain:
Let tank B hold \(B\). Tank A holds 40% less than B, so \(A = 0.6B\).

Now the base is A. Tank B compared with A:

\[\frac{B}{A} = \frac{B}{0.6B} = \frac{1}{0.6} \approx 1.667\]

So B holds about 166.7% of what A holds. "More than A" means subtract the 100% that A itself represents:

\[1.667 - 1 = 0.667\]

Tank B holds about 66.7% more than tank A. Check with numbers: if B is 100 liters, A is 60 liters, and the extra 40 is \(\frac{40}{60} \approx 66.7\%\) of 60. The answer is 66.7%.
```

# Successive changes
Two changes? Multiply the multipliers. Never add.

```visual
percentages--bars
```

## Key ideas
Two changes in a row? Turn each into a multiplier and **multiply**. Never add the percents, because the second change works on the new amount, not the old one:

\[\text{final} = \text{start} \times m_1 \times m_2\]

A $100 coat that rises 20% and then falls 20% costs \(100 \times 1.2 \times 0.8 = 96\), not $100. For the net percent change, subtract 1 from the product: \(1.2 \times 0.8 = 0.96\), which is a 4% drop.

A **percent of a percent** works the same way. 30% of 40% is \(0.3 \times 0.4 = 0.12\), so it is 12% of the whole. If "40% of the items are red and 30% of the red ones are striped", then 12% of all items are red and striped.

The same change repeated \(n\) times uses a power: 5% growth for 3 years is \(\text{start} \times 1.05^3\).

```example
A $100 coat goes up 20%, then down 20%. What is the final price?
1. \(100 \times 1.2 = 120\) :: Up 20%.
2. \(120 \times 0.8 = 96\) :: Down 20% of the bigger price.
3. $96, a 4% loss :: Not $100.
```

```theory
The second percent is taken from a different amount than the first. After rising 20%, the coat is worth $120. Twenty percent of 120 is $24, which is more than the $20 it just gained, so the price ends lower. Adding or subtracting percents only works when both are taken from the same base.

Use multipliers for any number of steps. A stock that rises 80% (multiplier 1.8) and then falls 25% (multiplier 0.75) has a net multiplier of \(1.8 \times 0.75 = 1.35\). That is a 35% net increase, not \(80 - 25 = 55\%\).

The order of the multipliers does not matter for the final number. Rising 10% then falling 10% gives the same total as falling 10% then rising 10%: \(1.1 \times 0.9 = 0.99\), a 1% fall either way.

Words you may meet: "net change", "overall change", "in total", "from 2011 to 2013". They all ask for the product of the multipliers, then the subtraction of 1.

For salaries, populations and prices over several years, the question usually asks for "\(y\) times as much". Then \(y\) is the product of the multipliers, with no subtraction. Earning 10% more one year and 5% more the next gives \(1.10 \times 1.05 = 1.155\) times as much, not \(1.15\).

Traps:
- Adding the percents (the most common wrong choice).
- Applying the second change to the original amount.
- Forgetting to subtract 1 when the question asks for a percent.
```

## Easy
```task
The population of a town was 5,000 at the start of 2020. It increased by 10% during 2020 and by another 10% during 2021. What was the population at the end of 2021?
answer: 6050
- 6000 :: You added the percents. The second 10% is of the new total.
- 5500 :: That is the end of 2020. Apply the second 10% too.
highlight:
- "5,000 at the start of 2020" :: The starting value, 100%.
- "increased by 10% during 2020" :: First multiplier: 1.1.
- "another 10% during 2021" :: Second multiplier: 1.1, applied to the 2020 total.
explain:
Turn each increase into a multiplier. A 10% increase multiplies by 1.1, and there are two of them.

After 2020: \(5000 \times 1.1 = 5500\).

After 2021: the second 10% is taken from 5,500, not from 5,000:

\[5500 \times 1.1 = 6050\]

In one step: \(5000 \times 1.1 \times 1.1 = 5000 \times 1.21 = 6050\).

Check: adding the percents would give 20%, or 6,000. That is too low, because the second 10% is worth 550, not 500. The answer is 6050.
```

## Medium
```task
bank: m-1331
highlight:
- "14% more than in 2007" :: First change: multiplier 1.14.
- "4% more than in 2008" :: Second change on the 2008 amount: multiplier 1.04.
- "y times as much in 2009 as in 2007" :: y is the product of the two multipliers.
explain:
Turn each change into a multiplier. Earning 14% more in 2008 multiplies the 2007 amount by 1.14. Earning 4% more in 2009 multiplies the 2008 amount by 1.04.

The question asks for \(y\), the number of times as much in 2009 as in 2007. That is the product:

\[y = 1.14 \times 1.04 = 1.1856\]

Check: adding the percents gives 1.18, choice C, which is the common mistake. The extra 0.0056 is the 4% increase working on the 14% gain. Choice A (0.56) is far too small, since earnings rose. The answer is D, 1.1856.
```

## Hard
```task
bank: m-1569
highlight:
- "increased by 167%" :: The multiplier is 1 + 1.67 = 2.67.
- "decreased by 16%" :: The second multiplier is 1 - 0.16 = 0.84, applied to the larger 2012 value.
- "net percentage increase" :: Multiply the multipliers, then subtract 1 and write as a percent.
explain:
Turn the two changes into multipliers. A 167% increase multiplies by \(1 + 1.67 = 2.67\). A 16% decrease multiplies by \(1 - 0.16 = 0.84\).

Multiply them to get the net effect from 2011 to 2013:

\[2.67 \times 0.84 = 2.2428\]

A multiplier of 2.2428 means the value is 224.28% of the start, an increase of \(2.2428 - 1 = 1.2428\):

\[1.2428 \times 100\% = 124.28\%\]

Check: simply subtracting \(167 - 16 = 151\), choice C, ignores that the 16% is taken from the much bigger 2012 value. The answer is A, 124.28%.
```

# Same number, two percents
Two statements share one number. Set them equal.

```visual
percentages--chain
```

## Key ideas
When two statements share one number, write each as an equation and set them equal. If \(a\) is 60% of \(b\) and \(a\) is also 150% of \(c\):

\[0.6b = a = 1.5c\]

To find what percent \(c\) is of \(b\), solve for \(c\) in terms of \(b\): \(c = \frac{0.6}{1.5}b = 0.4b\). So \(c\) is 40% of \(b\).

**Divide** the multipliers to go from one number to the other. Multiplying them (\(0.6 \times 1.5\)) is the classic wrong answer.

Read the last words of the question first. "\(c\) is what percent of \(b\)" means \(c = (\text{something}) \times b\), so \(b\) is the base. If a sum appears, such as \(a\) is a percent of \(b + c\), replace one variable first, then simplify.

Finally, write the multiplier as a percent: 0.4 is 40%, and 3.14 is 314%.

```example
\(a\) is 60% of \(b\). \(a\) is also 150% of \(c\). \(c\) is what percent of \(b\)?
1. \(a = 0.6b\) and \(a = 1.5c\) :: Both equal \(a\).
2. \(0.6b = 1.5c\) :: Set them equal.
3. \(c = \frac{0.6}{1.5}b = 0.4b\) :: Divide both sides by 1.5.
4. \(c\) is 40% of \(b\) :: Write 0.4 as a percent.
```

```theory
The shared number is the bridge. Each statement ties it to a different number: \(a\) to \(b\) in one, \(a\) to \(c\) in the other. Because \(a\) is the same number in both, the two expressions for \(a\) are equal. That gives a relation between \(b\) and \(c\) with \(a\) gone.

Why divide? From \(0.6b = 1.5c\), the number \(c\) is smaller, because \(1.5c\) is already as big as \(0.6b\). So \(c\) must be a fraction of \(b\): \(\frac{0.6}{1.5} = 0.4\). The wrong move, \(0.6 \times 1.5 = 0.9\), mixes the two percents as though they described one chain of changes. They do not. They describe two different relations to the same \(a\).

A longer example: \(a\) is 180% of \(b\) and 60% of \(c\). Then \(1.8b = 0.6c\), so \(c = \frac{1.8}{0.6}b = 3b\), which is 300% of \(b\).

With a sum: "\(a\) is 300% of the sum of \(b\) and \(c\), and \(b\) is 50% of \(c\). What percent of \(b\) is \(a\)?" Replace \(c\) using \(b = 0.5c\), so \(c = 2b\). Then \(a = 3(b + 2b) = 9b\). That is 900% of \(b\), not 9%. Percent means "times 100", so a multiplier of 9 is 900%.

Percent of a percent is another way these questions are phrased. It multiplies: 20% of 40% is 8%.

Plug-in backup: pick \(a = 100\). Then \(b\) and \(c\) become plain numbers you can compare.
```

## Easy
```task
The number \(x\) is 50% of \(y\), and \(x\) is also 25% of \(z\). \(z\) is what percent of \(y\)?
answer: 200
- 50 :: That is \(y\) as a percent of \(z\). Flip it.
- 12.5 :: You multiplied the percents. Set \(0.5y\) equal to \(0.25z\).
- 75 :: You added the percents. Set the two expressions for \(x\) equal.
highlight:
- "\(x\) is 50% of \(y\)" :: First equation: x equals 0.5y.
- "\(x\) is also 25% of \(z\)" :: Second equation: x equals 0.25z. Both equal x.
- "\(z\) is what percent of \(y\)" :: y is the base. Solve for z in terms of y.
explain:
Both statements give \(x\):

\[x = 0.5y \quad\text{and}\quad x = 0.25z\]

Set them equal:

\[0.5y = 0.25z\]

The question asks about \(z\) as a percent of \(y\), so solve for \(z\):

\[z = \frac{0.5}{0.25}y = 2y\]

Check with numbers: let \(y = 100\). Then \(x = 50\), and 50 is 25% of 200, so \(z = 200\), which is twice \(y\). The multiplier 2 is 200%. The wrong answer 50 flips the question: it is \(y\) as a percent of \(z\). The answer is 200.
```

## Medium
```task
bank: m-15118
highlight:
- "220% of the number b" :: First equation: a = 2.2b.
- "a is 70% of the number c" :: Second equation: a = 0.7c. Both equal a.
- "c is p% of b" :: b is the base: solve for c in terms of b.
explain:
Write both statements as equations for \(a\):

\[a = 2.2b \quad\text{and}\quad a = 0.7c\]

Set them equal, then solve for \(c\) in terms of \(b\):

\[0.7c = 2.2b, \qquad c = \frac{2.2}{0.7}b \approx 3.14b\]

So \(c\) is about 3.14 times \(b\), which is 314% of \(b\). Then \(p \approx 314\).

Check: the wrong choice A (154) comes from multiplying \(2.2 \times 0.7 = 1.54\). But \(a = 0.7c\) makes \(c\) bigger than \(a\), and \(a = 2.2b\), so \(c > a = 2.2b\). Then \(p\) must be above 220, and 154 is impossible. The answer is D, 314.
```

## Hard
```task
bank: m-1197
highlight:
- "2,241% of the sum of the positive numbers b and c" :: First equation: a = 22.41(b + c).
- "b is 83% of c" :: Second equation: b = 0.83c, so c = b over 0.83.
- "What percent of b is a" :: b is the base. Write a as a multiple of b.
explain:
Write the two statements:

\[a = 22.41(b + c) \quad\text{and}\quad b = 0.83c\]

Everything must end up in terms of \(b\), the base the question asks about. From \(b = 0.83c\), we get \(c = \frac{b}{0.83} \approx 1.2048b\). Put that in the first equation:

\[a = 22.41(b + 1.2048b) = 22.41 \times 2.2048b \approx 49.41b\]

So \(a\) is about 49.41 times \(b\). As a percent, multiply by 100: \(4941\%\).

Check: the choice 49.41% would mean \(a\) is smaller than \(b\), but \(a\) is more than 22 times a sum that already exceeds \(b\). The answer is D, 4,941%.
```
