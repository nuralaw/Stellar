---
title: Inference from Samples and Margin of Error
skill: inference-sample
domain: problem-solving
section: math
summary: Use a random sample to estimate a population and read the margin of error.
---

# Random samples
Every member needs the same chance of being picked.

```visual
inference-sample--fair-pick
```

## Key ideas

A **population** is the whole group you want to know about. A **sample** is the small part you actually ask or measure. In a **random sample**, every member of the population has the *same* chance of being picked, like names drawn from a hat. Then the sample is a small copy of the population, and its results can speak for it.

A sample is **biased** when some members are more likely to be chosen than others:

- people who choose to answer (a poll on a store's website)
- people who are easy to reach (students in the school cafeteria)
- only one part of the group (asking only dog owners about a dog park)
- people picked by position (the first 60 names on a list)

A bigger sample helps only if it is random. A big biased sample is still biased.

```example
The principal of a school with 900 students wants to know how all of them feel about a later start time. A computer picks 50 names from the full student list. Is the sample random?
1. Every student is on the list :: So every student can be picked.
2. The computer picks with no pattern :: Each student has the same chance.
3. Yes, so the results describe all 900 students :: The group the names came from.
```

```theory
The **population** is defined by the question. If a city wants the opinion of all residents, the population is all residents. The **sample** is the part you actually reach. "Random" does not mean "without a plan" or "looks mixed". It means chance alone decides who is in, and each member of the population has the same chance.

These are the usual ways a sample goes wrong. **Self-selection**: people choose to take part, such as shoppers who answer a website poll, and they often have strong opinions. **Convenience**: people are easy to reach, such as customers inside a shop or students in a cafeteria. **Wrong group**: the sample leaves out part of the population, such as a survey of dog owners about a dog park for all residents. **Position**: taking the first 60 on a list or the people whose names start with A and B. Members at other positions have no chance, so the pick is not random.

Sample size and randomness are different things. A random sample of 40 can still be fair, and a biased sample of 5,000 cannot be made fair by its size. If a question compares a larger sample with a better-designed one, the way people were chosen matters first.

On the SAT, the margin of error is always given to you. It only makes sense for a random sample. If the sample is biased, no margin of error can repair it.

Typical wording: "selected at random", "randomly chosen", "is representative of", "the sample is biased because...". The right answer to "why are the results unlikely to represent the population" names who was left out or who chose to answer.
```

## Easy

```task
bank: m-1437
highlight:
- "Near the end of a US cable news show" :: Only viewers of one show can see the poll.
- "invited viewers to respond to a poll" :: Viewers chose whether to answer: a self-selected group.
- "unlikely to represent the sentiments of the population of the United States" :: Look for the flaw in who answered.
explain:
The question asks why the poll result is unlikely to represent the whole country.

The poll was shown near the end of one cable news show, and viewers chose whether to answer. So the people who answered are viewers of that show who wanted to take part. That group is not picked by chance from all Americans, so it is not a random sample of the population.

Now check the choices. The percentages not adding to 100% (choice A) only means some people did not answer or were undecided, and does not make the poll invalid. A 50-50 split (choice C) is not needed for a poll to be fair. The time given to respond (choice D) is not the problem.

The answer is (B): those who responded were not a random sample of the population of the United States.
```

## Medium

```task
bank: m-1464
highlight:
- "mean number of children per household in a community" :: The population is every household in the community.
- "Tabitha surveyed 20 families at a playground" :: Playground families are easy to reach, not picked by chance.
- "the mean number of children per household was 2.4" :: This describes only these 20 families.
explain:
The goal is the mean number of children in all households of the community. That is the population.

Tabitha surveyed 20 families at a playground. Families at a playground are more likely to have children than households in general, so not every household had the same chance of being picked. The sample is not random, and it can give a biased estimate.

Check the choices. Choice (A) treats 2.4 as the community's exact mean, which a sample can never prove. Choice (B) blames the size, but the main flaw is how the families were picked, since even a large playground sample would be biased. Choice (D) says the method is fine, which is false.

The answer is (C): the sampling method is flawed and may produce a biased estimate.
```

## Hard

```task
A town council wants to estimate the mean number of hours per week that all 12,000 town residents spend on the town's bike paths. Which of the following sampling methods is most likely to give a representative estimate?
- Surveying all 150 members of the local cycling club :: Cyclists use the paths more than most residents do.
- Posting a survey on the council's website and using the first 2,000 responses :: Bigger, but people chose to answer. Size cannot fix bias.
* Surveying 800 residents chosen by a computer from the list of all town residents
- Surveying the first 800 names on the alphabetical list of residents :: Names later in the alphabet had no chance.
highlight:
- "all 12,000 town residents" :: The population is every resident, not only cyclists.
- "most likely to give a representative estimate" :: Look for a method where every resident has the same chance.
explain:
The council wants an estimate for all 12,000 residents, so the sample must give every resident the same chance of being picked.

The cycling club (first choice) is a convenience group: its members use bike paths more than most residents, so the estimate would be too high. The website survey (second choice) has 2,000 people, but they chose to answer, so it is self-selected. A bigger biased sample is still biased. The first 800 names on an alphabetical list (fourth choice) means that residents whose names come later have no chance of being included.

A computer picking 800 names from the list of all residents gives every resident the same chance. That is a random sample, so it is the one most likely to be representative.

The answer is: surveying 800 residents chosen by a computer from the list of all town residents.
```

# Estimate plus or minus margin
Subtract and add the margin of error.

```visual
inference-sample--range
```

## Key ideas

A random sample gives an **estimate** of a population value: a mean, or a percent. The estimate is rarely exact, so the SAT gives you a **margin of error**: how far the true value could be from the estimate. You never calculate it. It is given.

\[\text{estimate} - \text{margin} \quad\text{to}\quad \text{estimate} + \text{margin}\]

This is the range of **plausible** (believable) values for the whole population.

A mean of 27.4 minutes with a margin of error of 2.1 minutes gives \(27.4 - 2.1 = 25.3\) and \(27.4 + 2.1 = 29.5\). The population mean is plausibly between 25.3 and 29.5 minutes.

Values inside the range are plausible. Values outside it are unlikely, but not impossible. And the true value is not guaranteed to equal the estimate.

```example
A random sample of a city's commuters gives a mean commute of 31.2 minutes, with a margin of error of 2.5 minutes. What range of means is plausible for all the city's commuters?
1. \(31.2 - 2.5 = 28.7\) :: Subtract the margin.
2. \(31.2 + 2.5 = 33.7\) :: Add the margin.
3. 28.7 to 33.7 minutes :: Plausible, not certain.
```

```theory
The **estimate** is what the sample shows. The **margin of error** is the distance on either side of it. Together they build an interval: the lower end is estimate minus margin, and the upper end is estimate plus margin. A margin of 4 percentage points on an estimate of 47% gives 43% to 51%.

"Plausible" means that the data do not rule the value out. A value outside the interval is possible but unlikely. That is why a question that asks "which is most plausible" wants the choice inside the interval, and a choice such as "it is not possible that the value is below 43%" is too strong.

You can also read the interval backward. If the plausible values run from 15.86 to 17.32, the estimate is the midpoint, 16.59, and the margin of error is half the width: \(17.32 - 16.59 = 0.73\).

The SAT sometimes adds a **confidence level**, such as "a margin of error of 2.8% at a 95% confidence level". Read the interval in the same way. The 95% describes how reliable the method is. It is not a 95% chance for any single person, and it is not a percent of voters.

The margin of error is for the population mean or percent. It never tells you the mean of the sample (you already know that) and it is not a statement about each member (see the part on individuals).

Traps: adding the margin only, so you give one end of the interval; using the margin as if it were the estimate; and choosing "exactly" statements, such as "exactly 47% of all voters support it". A sample can never show an exact population value.
```

## Easy

```task
bank: m-1521
highlight:
- "a mean of 37" :: The estimate of the population mean is 37.
- "margin of error of 3" :: Go 3 below and 3 above: 34 to 40.
- "conclusion that can be made about the population mean" :: The interval is about the population mean.
explain:
The sample gives an estimate of 37 for the population mean, with a margin of error of 3.

The plausible values for the population mean run from the estimate minus the margin to the estimate plus the margin:

\[37 - 3 = 34 \quad\text{and}\quad 37 + 3 = 40\]

So the population mean is plausibly between 34 and 40.

Choices (A) and (B) claim a direction (less than 37 or greater than 37), but a margin of error goes both ways and does not show a direction. Choice (D) describes the values outside the interval, which are the least plausible.

The answer is (C): it is between 34 and 40.
```

## Medium

```task
bank: m-16639
highlight:
- "62% of the voters supported the proposal" :: The estimate is 62%.
- "associated margin of error of 3.3%" :: Plausible range: 62 minus 3.3 to 62 plus 3.3.
- "most appropriate conclusion from this result" :: Look for a plausible range, not an exact value.
explain:
The sample estimate is 62%, and the margin of error is 3.3%. The plausible range for all registered voters in the region is

\[62 - 3.3 = 58.7 \quad\text{to}\quad 62 + 3.3 = 65.3\]

The "95% confidence level" does not change how you read the interval. It describes how reliable the method is.

Now check the choices. Choice (A) says "exactly 62%", but a sample never proves an exact value. Choice (C) claims another sample would give exactly 62%, but a new sample would probably differ a little. Choice (D) turns the 95% into a chance for one voter, which it is not.

The answer is (B): it is plausible that the true proportion is between 58.7% and 65.3%.
```

## Hard

```task
A random sample of a farm's apple trees was used to estimate the mean number of apples per tree. The estimate was 54.3 apples, with an associated margin of error of 1.8 apples. Which of the following values is least plausible for the mean number of apples per tree for all the farm's apple trees?
- 52.6 :: It is above 52.5, the low end of the range.
- 53.0 :: It is inside the range.
- 55.9 :: It is below 56.1, the high end of the range.
* 56.4
highlight:
- "estimate was 54.3 apples" :: The center of the plausible range is 54.3.
- "margin of error of 1.8 apples" :: Range: \(54.3 - 1.8 = 52.5\) to \(54.3 + 1.8 = 56.1\).
- "least plausible" :: Find the value outside the range.
explain:
The estimate is 54.3 and the margin of error is 1.8, so the plausible values for the mean run from

\[54.3 - 1.8 = 52.5 \quad\text{to}\quad 54.3 + 1.8 = 56.1\]

"Least plausible" means the value that falls outside this range. Check each choice:

- 52.6 is above 52.5, so it is inside.
- 53.0 is inside.
- 55.9 is below 56.1, so it is inside.
- 56.4 is above 56.1, so it is outside.

Be careful with the close values: 52.6 and 55.9 are near the ends, but they are still within the interval. Only 56.4 goes past an end.

The answer is 56.4.
```

# Scale up to everyone
Sample fraction times population; margin first.

```visual
inference-sample--scale
```

## Key ideas

To estimate a count for the whole population, find the fraction in the sample, then multiply by the population size:

\[\text{estimate} = \frac{\text{number in sample}}{\text{sample size}} \cdot \text{population}\]

A random sample of 50 library members finds that 12 use the app. The library has 2,000 members:

\[\frac{12}{50} \cdot 2000 = 480\]

Use the **population** size at the end, never the sample size. About 480 members, not 12. The sample size only helps you build the fraction.

The margin of error is usually a **percent**. Build the percent range first, then multiply both ends by the population.

```example
A random sample estimates that 40% of a town's 2,500 residents ride a bike, with a margin of error of 3%. What numbers of riders are plausible?
1. \(40 - 3 = 37\) and \(40 + 3 = 43\) :: Percent range first.
2. \(0.37 \cdot 2500 = 925\) :: The low end, as a count.
3. \(0.43 \cdot 2500 = 1075\) :: The high end.
4. 925 to 1,075 riders :: Use the population, not the sample.
```

```theory
The idea is that a random sample is a small copy of the population, so the **sample fraction** (the share in the sample that fit) is the best estimate of the **population fraction**. To turn the fraction into a number of people, multiply by the total population.

If the problem already gives you a percent (such as "28% of the sample"), skip the division and go straight to multiplying: \(0.28 \cdot \text{population}\). If it gives a count and a sample size, divide first.

An estimate is not exact. The SAT says "best estimate", "about", or "is expected". Choices that say "exactly" or "must be" are traps.

With a margin of error, the question asks for a plausible count or the least or greatest plausible count. Do the margin on the percent: estimate minus margin for the low end, estimate plus margin for the high end. Then change each end into a count with the population. The sample size is not used in this step.

If the margin of error is given in percentage points, subtract and add percentage points. Do not take the margin as a percent of the estimate.

Sometimes the sample gives a **mean per unit**, such as trees per acre. Multiply by the number of units: a forest of 253 acres with a sample mean of 56 trees per acre has about \(56 \cdot 253 = 14{,}168\) trees.

Traps: multiplying the sample count by the sample size, using the sample size where the population belongs, and using only one end of the interval.
```

## Easy

```task
bank: m-1505
highlight:
- "20 employees at random from all 400 employees" :: Sample: 20. Population: 400.
- "16 of the employees in this sample" :: Sample fraction: \(\frac{16}{20} = 0.8\).
- "best estimate of the number of employees at the company" :: Multiply the fraction by the population, 400.
explain:
The sample has 20 employees, chosen at random from a company of 400. In the sample, 16 are enrolled in exactly three courses. The sample fraction is

\[\frac{16}{20} = 0.8\]

A random sample is a small copy of the whole company, so about 80% of all employees are enrolled in exactly three courses. Multiply by the population:

\[0.8 \cdot 400 = 320\]

Choice (A), 4, is \(20 - 16\). Choice (D), 384, is \(400 - 16\), which does not use the sample fraction. Choice (C), 380, is \(400 - 20\).

The answer is (B), 320.
```

## Medium

```task
bank: m-1339
highlight:
- "From a population of 50,000 people, 1,000 were chosen at random" :: Population: 50,000. The sample of 1,000 is not used for the count.
- "35% of people in the population support the legislation" :: The estimate is 35%.
- "margin of error of 3%" :: Percent range: 32% to 38%.
- "a plausible value for the total number" :: Multiply both ends of the range by 50,000.
explain:
Start with the percent range. The estimate is 35% and the margin of error is 3%, so the plausible percent of supporters runs from

\[35 - 3 = 32 \quad\text{to}\quad 35 + 3 = 38\]

Now change each end into a number of people, using the whole population of 50,000:

\[0.32 \cdot 50000 = 16000 \qquad 0.38 \cdot 50000 = 19000\]

So the plausible number of supporters is between 16,000 and 19,000. Only 16,750 is in that range.

Choices (A) and (B), 350 and 650, come from using the sample of 1,000 instead of the population. Choice (D), 31,750, is far above the high end.

The answer is (C), 16,750.
```

## Hard

```task
A random sample of 500 of the 8,000 employees at a company was surveyed. In the sample, 120 employees commute by bike. From the sample, the percent of all the company's employees who commute by bike is estimated, with an associated margin of error of 2 percentage points. Based on this estimate and margin of error, what is the least number of the company's employees that plausibly commute by bike?
answer: 1760
- 1920 :: That is the estimate, 24% of 8,000. Subtract the margin first.
- 160 :: That is only the margin, 2% of 8,000.
highlight:
- "500 of the 8,000 employees" :: Sample 500, population 8,000.
- "120 employees commute by bike" :: Sample percent: \(\frac{120}{500} = 24\%\).
- "margin of error of 2 percentage points" :: Percent range: 22% to 26%.
- "least number" :: Use the low end, 22%, times the population.
explain:
First find the estimated percent from the sample:

\[\frac{120}{500} = 0.24 = 24\%\]

The margin of error is 2 percentage points, so the plausible percent runs from \(24 - 2 = 22\) to \(24 + 2 = 26\).

The question asks for the least number of employees, so use the low end, 22%, and the whole population of 8,000 employees (not the sample of 500):

\[0.22 \cdot 8000 = 1760\]

For reference, the high end would be \(0.26 \cdot 8000 = 2080\). The value 1,920 is the estimate itself (24%), and 160 is only the margin.

The answer is 1760.
```

# Size, spread and margin
Bigger random samples and calmer data give smaller margins.

```visual
inference-sample--margin-factors
```

## Key ideas

Two things change the margin of error, when the same method is used:

- **Sample size.** A bigger *random* sample usually gives a *smaller* margin of error. More data means a more precise estimate.
- **Spread.** If the data are more spread out (a larger standard deviation), the margin of error is *larger*.

The estimate itself does not go up or down just because the sample is bigger. Only its precision changes.

To shrink the margin of error, take a larger random sample from the same population. A larger sample from a different group, or a larger sample that is not random, does not do that.

```example
Two random polls ask the same question in the same city, using the same method. Poll A asks 400 people and has a margin of error of 4.8%. Poll B asks 1,600 people. What is true about Poll B's margin of error?
1. Same city, same method :: Only the size differs.
2. 1,600 is more than 400 :: More data, a more precise estimate.
3. It is smaller than 4.8% :: Only "smaller". The SAT does not ask for the exact value.
```

```theory
The **margin of error** measures how much a sample estimate could differ from the true value. It depends on two things you can think about without a formula.

**Sample size.** Each extra random member gives more information about the population, so estimates from large samples bunch more tightly around the true value. Roughly, the margin shrinks like one over the square root of the sample size: to cut the margin in half, you need about four times as many people. The SAT never asks you to calculate this. It only asks which sample has the smaller margin.

**Spread.** The **standard deviation** measures how far values typically sit from the mean. If the individual values vary a lot (plant heights from 5 cm to 60 cm), the sample mean is less certain, so the margin is bigger. If they are close together, the margin is smaller. Two samples of the same size from the same population can have different margins because one has more spread.

Both statements assume the samples are random, drawn from the same population and calculated the same way. SAT questions say "assuming the margins of error were calculated in the same way" for this reason.

A larger sample does not change the estimate in a predictable direction. Choices such as "the estimate will be higher" are wrong.

Some questions ask which change would produce a smaller margin. The answer is a larger random sample of the same group. A larger sample from a bigger region changes the population, a larger voluntary sample is biased, and a smaller sample does the opposite.

Higher confidence levels (99% rather than 95%) also give wider margins. This is rare on the SAT.

Traps: believing the estimate moves, mixing up "larger sample" with "larger population", and ignoring whether the larger sample is random.
```

## Easy

```task
bank: m-1432
highlight:
- "random sample of either 115 or 230 participants" :: Same method. Only the sample size changes.
- "using the larger random sample compared to the smaller random sample" :: More data gives a more precise estimate, so a smaller margin.
explain:
The researcher can use a random sample of 115 or 230 participants from the same training course. Everything else is the same, so only the size changes.

A larger random sample gives more information about the whole group. The estimate is then more precise, which means the reported margin of error becomes smaller.

Now check the choices. Choice (B) says the margin would be higher, which is backward. Choices (C) and (D) say the reported average hours would be lower or higher, but the size of a sample does not push the estimated average in a particular direction. The mean can come out a little higher or a little lower in any sample.

The answer is (A): the reported margin of error would be lower.
```

## Medium

```task
A biologist selected two random samples of 100 trout each from the same lake and recorded the length of each trout. The lengths in sample A had a standard deviation of 2.1 centimeters, and the lengths in sample B had a standard deviation of 4.6 centimeters. Each sample was used to estimate the mean length of all trout in the lake, and the margins of error were calculated the same way. Which of the following is most likely true?
* The margin of error for sample A is smaller than the margin of error for sample B.
- The margin of error for sample B is smaller than the margin of error for sample A. :: Backward. More spread gives a larger margin.
- The margins of error are equal because both samples have 100 trout. :: Spread also changes the margin, not only the size.
- The estimated mean for sample A must be less than the estimated mean for sample B. :: Spread says nothing about which mean is bigger.
highlight:
- "standard deviation of 2.1 centimeters" :: Sample A: the lengths are closer together.
- "standard deviation of 4.6 centimeters" :: Sample B: the lengths are more spread out.
- "margins of error were calculated the same way" :: Same method and same size, so spread decides.
explain:
Both samples are random, come from the same lake, have the same size (100 trout), and have margins of error calculated the same way. The only difference is the spread of the data.

The standard deviation measures spread. Sample A has a standard deviation of 2.1 cm, and sample B has 4.6 cm, so the lengths in sample B are more spread out. When data are more spread out, the sample mean is less certain, so the margin of error is larger.

That means sample B has the larger margin of error, and sample A has the smaller one.

Check the other choices. Equal margins (third choice) would need equal spread as well as equal size. Spread tells you nothing about which sample has the larger mean, so the last choice is not supported.

The answer is: the margin of error for sample A is smaller than the margin of error for sample B.
```

## Hard

```task
A county official used a random sample of 200 of the county's 40,000 registered voters to estimate the percent who support a new tax. The margin of error was 6.9%. The official wants a smaller margin of error for the estimate about the same group of voters. Assuming the margin is calculated in the same way, which change would most likely give a smaller margin of error?
* Selecting a random sample of 800 of the county's registered voters
- Selecting a random sample of 200 of the registered voters in the whole state :: A bigger region changes the group. The size stays 200.
- Selecting 800 voters from one neighborhood of the county :: That is not a random sample of the county's voters.
- Using the first 800 people who answer an online advertisement :: Bigger, but people chose to answer. It is biased.
highlight:
- "random sample of 200 of the county's 40,000 registered voters" :: This is the original sample: random, size 200.
- "smaller margin of error for the estimate about the same group of voters" :: Keep the same population and keep it random.
- "calculated in the same way" :: Only the sample size can change the margin.
explain:
To shrink the margin of error, the official needs more information about the same group of voters, collected randomly. That means a larger random sample from the same population.

Check each option.

- 800 random voters from the county: larger, random, same population. This works.
- 200 random voters from the whole state: the sample is still 200, and the population is now different. It does not reduce the margin for the county.
- 800 voters from one neighborhood: larger, but it is not a random sample of all the county's voters, so it is biased.
- The first 800 people who answer an online ad: they chose to answer, so the sample is self-selected.

Size lowers the margin only when the sample stays random and comes from the same group.

The answer is: selecting a random sample of 800 of the county's registered voters.
```

# Mean, not each person
The range is for the population mean, not individuals.

```visual
inference-sample--mean-vs-person
```

## Key ideas

The margin of error is about the **population mean** (or percent). It does not say where each person falls.

\[\text{mean} \pm \text{margin} \;\Rightarrow\; \text{plausible values for the mean}\]

A mean quiz score of 80 with a margin of error of 3 means that the population mean is plausibly 77 to 83. One student can still score 50, and some students may score above 83.

A result also fits only the population that the sample came from. A random sample of bags filled on Tuesday describes Tuesday's bags, not every bag the machine will ever fill.

Wrong conclusions to avoid: "every member is between...", "most members are within...", "the mean is exactly the estimate", and "all products ever made".

```example
A random sample of loaves baked on one Monday gives a mean weight of 452 grams, with a margin of error of 6 grams. Does every loaf from that Monday weigh between 446 and 458 grams?
1. \(452 - 6 = 446\) and \(452 + 6 = 458\) :: The range for the mean weight.
2. One loaf can be lighter or heavier :: The mean says nothing about each loaf.
3. No. Only the mean of that Monday's loaves is plausibly 446 to 458 g :: Not each loaf.
```

```theory
Two different ideas often get mixed up. **How spread out the individuals are** describes the loaves themselves. Some weigh 440 g and some weigh 465 g. **How sure we are about the mean** is what the margin of error describes. Even if individual loaves vary by 20 g, a large random sample can pin down the mean to within 6 g.

So a margin of error can be small while individuals vary widely. Statements about "every", "each", "most" or "any" individual are almost never supported by a margin of error. Statements about "the mean of all" are.

The estimate is of the **population the sample came from**. If bottles were sampled on one particular day, the plausible range is for the mean volume of the bottles filled that day. It says nothing about other days, other factories or other products.

When you read the answer choices, split each one into two parts: which quantity (the mean or each member) and which group (what the sample came from). A choice is correct only when both parts match the sample.

Typical correct wording: "It is plausible that the mean for all ... is between ... and ...". Typical wrong wording: "The actual weights of all ... are between...", "most ... are ...", "the mean ... is exactly ...".

Traps: applying the interval to every member, widening the claim to a bigger group, and treating the estimate as the exact mean.
```

## Easy

```task
bank: m-1455
highlight:
- "mean value of a certain variable for the population is 20.5" :: The estimate of the population mean is 20.5.
- "margin of error of 1" :: Range: 19.5 to 21.5.
- "most appropriate conclusion" :: Pick the choice that says "plausible" about the mean, not every value.
explain:
The researcher estimated that the population mean is 20.5, with a margin of error of 1. The plausible values for the population mean run from

\[20.5 - 1 = 19.5 \quad\text{to}\quad 20.5 + 1 = 21.5\]

Now read each choice carefully. Choice (A) says it is plausible that the population mean is between 19.5 and 21.5, which matches. Choice (B) says it is not possible that the mean is outside the range. That is too strong: values outside are unlikely, not impossible. Choice (C) says every value in the population is in the range, but the interval is about the mean, not each value. Choice (D) says the mean is exactly 20.5, which a sample cannot show.

The answer is (A).
```

## Medium

```task
bank: m-1238
highlight:
- "mean weight of all handbags made by the company on that day is 27.8 ounces" :: The estimate is about the mean, and only for that day.
- "associated margin of error of 0.02 oz" :: Range: 27.78 to 27.82 oz.
- "most plausible conclusion" :: The conclusion must be about the mean, not each handbag.
explain:
The sample was selected at random from the handbags made on one particular day. So the result is about the mean weight of the handbags made that day.

The estimate is 27.8 oz and the margin of error is 0.02 oz, so the plausible values for the mean run from

\[27.8 - 0.02 = 27.78 \quad\text{to}\quad 27.8 + 0.02 = 27.82\]

Now check the choices. Choices (B) and (C) say that the actual weights of the handbags are all between 27.78 and 27.82. The range is for the mean, not for each handbag, so these are wrong. Choice (D) says the mean is exactly 27.8, but an estimate is not exact.

Choice (A) says the mean weight of all handbags made that day is between 27.78 oz and 27.82 oz. It names the mean, the right range and the right group.

The answer is (A).
```

## Hard

```task
To estimate the mean thickness of all the tiles in a shipment of 20,000 tiles delivered on a Monday, a supervisor measured 150 tiles selected at random from that shipment. The mean thickness of the sample was 8.4 millimeters, with an associated margin of error of 0.3 millimeter. Which of the following is the most appropriate conclusion?
* It is plausible that the mean thickness of all tiles in Monday's shipment is between 8.1 and 8.7 millimeters.
- Every tile in Monday's shipment is between 8.1 and 8.7 millimeters thick. :: The range is for the mean, not each tile.
- It is plausible that the mean thickness of all tiles the company has ever made is between 8.1 and 8.7 millimeters. :: The sample came from one shipment only.
- Most tiles in Monday's shipment are exactly 8.4 millimeters thick. :: An estimated mean says nothing about individual tiles.
highlight:
- "shipment of 20,000 tiles delivered on a Monday" :: The population is that one shipment.
- "mean thickness of the sample was 8.4 millimeters" :: Estimate: 8.4 millimeters.
- "margin of error of 0.3 millimeter" :: Range: 8.1 to 8.7 for the mean.
explain:
Check two things in each choice: which quantity it talks about, and which group.

The estimate is 8.4 mm with a margin of error of 0.3 mm. So the plausible values for the mean thickness are \(8.4 - 0.3 = 8.1\) to \(8.4 + 0.3 = 8.7\) millimeters.

The sample was selected at random from the shipment delivered on a Monday, so the group is that shipment.

- "Every tile ... between 8.1 and 8.7": the interval is about the mean, not each tile.
- "All tiles the company has ever made": the sample came from one shipment, so the result cannot be widened to every tile.
- "Most tiles ... exactly 8.4": this claims something about individual tiles, and exact values are never shown by an estimate.
- "The mean thickness of all tiles in Monday's shipment is between 8.1 and 8.7": right quantity, right group, hedged with "plausible".

The answer is the first choice.
```

# Estimates are not guarantees
A sample estimates. It never proves an exact value.

```visual
inference-sample--not-guarantee
```

## Key ideas

A random sample gives an **estimate**, not a fact. Two things follow.

- The true value is probably *near* the estimate, but it is not necessarily equal to it. "Exactly 71% of all students" is wrong. "Plausibly between 68% and 74%" is right.
- Another random sample would give a *different* result, a little higher or a little lower. "A new sample would give the same percent" is wrong.

A sample from one population says nothing about a different one, such as another city or another year.

So read the choices for strong words (*exactly, must, every, all, never*). They are usually wrong. Hedged words (*plausible, estimate, likely, about*) fit a sample.

```example
A random sample of 400 students at a college estimates that 46% own a car, with a margin of error of 5%. Which statements must be true?
I. Exactly 46% of all students at the college own a car.
II. A second random sample of 400 students would also show 46%.
III. It is plausible that between 41% and 51% of all students own a car.
1. I is false :: A sample cannot prove an exact value.
2. II is false :: A new sample will probably differ a little.
3. III is true :: \(46 - 5 = 41\) and \(46 + 5 = 51\). Only III.
```

```theory
A sample is one of many samples you could have drawn. If you drew another random sample of the same size, you would very likely get a slightly different percent. That difference is **sampling variation**, and the margin of error is the way the SAT describes how large it is likely to be. Because of it, the estimate from one sample is never exactly the population value.

For this reason there are three kinds of statements:

- Statements about the sample itself ("46% of the 400 students in the sample own a car") are certain, because you counted them.
- Statements about the population with hedging ("it is plausible that between 41% and 51%...") are supported.
- Statements about the population with certainty ("exactly 46%"), statements about the next sample ("another sample would show 46%"), and statements about a different group ("students at other colleges") are not supported.

The **confidence level** (often 95%) says how reliable the method is: if the method were repeated many times, about 95% of the intervals would contain the true value. It is not the probability that one voter says yes, and it is not the percent of voters who say yes.

Also remember the group: a sample from one county tells you about that county, not about the state. A sample from one year tells you about that year.

When a question says "must be true", the answer is often "none of the statements", because very few statements about the whole population must be true after a sample. When the question says "most appropriate conclusion" or "plausible", pick the one with the interval and the right group.

Traps: choosing "exactly", treating the range as a promise about the next sample, and widening the group.
```

## Easy

```task
bank: m-1367
highlight:
- "300 students were selected at random" :: A random sample, so the results describe the whole school.
- "38% of the students were in support of a menu change, with a margin of error of 5.5%" :: Range: 32.5% to 43.5%.
- "best interpretation of the survey results" :: Pick the plausible range, not an exact value.
explain:
The sample is random and the estimate is 38% with a margin of error of 5.5%. The plausible values for the percent of all students who support the change run from

\[38 - 5.5 = 32.5 \quad\text{to}\quad 38 + 5.5 = 43.5\]

Now check the choices. Choice (A) says the percent is exactly 38%, but a sample cannot show an exact population value. Choice (B) says it is greater than 38%, but the range goes below 38 too. Choice (D) applies the margin to a number of students (295 to 305), which mixes up the percent with the sample size.

Choice (C) states plausible values between 32.5% and 43.5%, which is the correct reading.

The answer is (C).
```

## Medium

```task
bank: m-1366
highlight:
- "1,000 adults who were selected at random from a large city" :: The population is that one city.
- "78 percent responded that they were satisfied" :: Only the sample result. An estimate, not a fact.
- "which of the following statements must be true" :: Test each statement: exact? next sample? other city?
explain:
A random sample of 1,000 adults from one city shows 78% satisfied. Test each statement.

Statement I says that 78% of all adults in the city are satisfied. A sample only gives an estimate, so the true percent can be a little different. It need not be true.

Statement II says that another random sample of 1,000 adults would show exactly 78%. Another sample would likely give a slightly different percent. It need not be true.

Statement III talks about a different city. The sample came from one city, so it says nothing certain about another.

None of the three statements must be true.

The answer is (A), none.
```

## Hard

```task
A polling agency surveyed 600 registered voters selected at random from a county and found that 54% favor building a new library. The associated margin of error is 4%. Which of the following is the most appropriate conclusion?
* It is plausible that between 50% and 58% of all registered voters in the county favor building the library.
- Exactly 54% of all registered voters in the county favor building the library. :: A sample cannot show an exact value.
- A second random sample of 600 voters would show between 50% and 58% in favor. :: The range is about the county's voters, not the next sample.
- It is plausible that between 50% and 58% of all registered voters in the state favor building the library. :: The sample came from one county, not the state.
highlight:
- "selected at random from a county" :: The population is one county only.
- "54% favor building a new library" :: The estimate is 54%.
- "margin of error is 4%" :: Range: 50% to 58%.
explain:
The sample is random and comes from one county, so the results describe the registered voters of that county. The estimate is 54% and the margin of error is 4%, so the plausible percent runs from

\[54 - 4 = 50 \quad\text{to}\quad 54 + 4 = 58\]

Check each choice. "Exactly 54%" claims more than a sample can show. "A second random sample would show between 50% and 58%" confuses the range: the margin of error describes where the county's true percent could be, not where the next sample result will land. "All registered voters in the state" goes beyond the group the sample was drawn from.

The only choice that names the right group (the county), uses a plausible range and does not claim to be exact is the first one.

The answer is: it is plausible that between 50% and 58% of all registered voters in the county favor building the library.
```
