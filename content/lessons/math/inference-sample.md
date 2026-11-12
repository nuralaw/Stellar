---
title: Inference from Samples and Margin of Error
skill: inference-sample
domain: problem-solving
section: math
summary: Scale a random sample up to a whole population and read a margin of error as a range of plausible values.
---

## Spot a sample question

A paragraph describes a survey or study of a **sample**: a smaller group chosen, usually at random, from a bigger group, the **population**. It gives a result, like a percent, a proportion or a mean, and sometimes a **margin of error**.

There's little or no math. The work is knowing what the sample can tell you about the population.

```quiz
A researcher selects 200 of a city's 9,000 bus riders at random and asks how long they usually wait for a bus. What is the population?
- The 200 riders who were asked :: That's the sample: the people actually asked.
* All 9,000 bus riders in the city
- Everyone who lives in the city :: People who don't ride the bus had no chance of being picked.
- All bus riders in the country :: Only this city's riders could be chosen.
> The population is the group the sample was chosen from: the city's 9,000 bus riders. The results describe them, and only them.
```

## Scale up to the population

To estimate a count for the whole population:

1. **Sample proportion** = number with the trait ÷ sample size.
2. **Multiply** by the population size, not the sample size.

This works because the sample was random, so the population should have about the same share.

```quiz
A town has 3,000 households. In a random sample of 80 of them, 12 households own a cat. Based on the sample, what is the best estimate of the number of households in the town that own a cat?
- 12 :: That's the count in the sample. Scale it up to all 3,000 households.
* 450
- 2,550 :: That's the households without a cat: 85% of 3,000.
- 2,920 :: That's 3,000 − 80, the households that weren't surveyed.
> Sample proportion: 12/80 = 0.15, so 15% of the sample owns a cat.
> Scale up: 0.15 × 3,000 = 450 households.
```

## Build the interval

A **margin of error** says how far the true population value could reasonably be from the sample's estimate. Build the interval:

**estimate − margin** to **estimate + margin**

Values inside are **plausible** (reasonable to believe). A margin in percent is added and subtracted directly: 40% with a margin of error of 3% gives 37% to 43%.

```quiz
A random sample estimates that 62% of a town's voters support a new park, with an associated margin of error of 4%. Which range gives plausible values for the percent of all the town's voters who support the park?
- 62% to 66% :: The margin goes both ways. Subtract it too.
- 59.52% to 64.48% :: You took 4% of 62. Add and subtract 4 percentage points directly.
* 58% to 66%
> 62 − 4 = 58 and 62 + 4 = 66. Any value from 58% to 66% is plausible for the whole town.
```

## It's about the population's mean

The interval is about one number: the **mean or proportion of the whole population**. It is not about:

- **each person:** individuals can be far outside it
- **the sample:** its mean is already known exactly
- **a group that wasn't sampled:** other schools, cities or countries

```quiz
In a random sample of 120 members of a gym, the mean workout time last week was 4.2 hours, with an associated margin of error of 0.6 hours. Which conclusion is most appropriate?
- Every member of the gym worked out between 3.6 and 4.8 hours last week. :: The interval is about the mean. Many members worked out far more or less.
- The mean for the 120 members in the sample could be anywhere from 3.6 to 4.8 hours. :: The sample mean isn't uncertain: it's exactly 4.2. The interval is for the population.
* It is plausible that the mean for all members of the gym is between 3.6 and 4.8 hours.
- It is plausible that the mean for all gym members in the country is between 3.6 and 4.8 hours. :: Only this gym's members could be chosen.
> Interval: 4.2 − 0.6 = 3.6 to 4.2 + 0.6 = 4.8.
> The sample came from this gym, so the interval gives plausible values for the mean of all its members. Only one choice names the right number (the mean) for the right group (all of this gym's members).
```

## Careful words win

A sample gives an **estimate**, never a certainty. Right answers use words like **plausible**, **likely** and **estimate**. Wrong answers often say **exactly**, **must** or **impossible**.

- Values outside the interval are unlikely, not impossible.
- Another random sample would most likely give a slightly different result.

```quiz
A random sample of a city's adults estimates that 30% of them bike to work, with an associated margin of error of 3%. Which statement is best supported?
- Exactly 30% of the city's adults bike to work. :: 30% is only an estimate. Plausible values run from 27% to 33%.
- It is impossible that fewer than 27% of the city's adults bike to work. :: Values outside the interval are unlikely, not impossible.
- Another random sample of the city's adults would also find 30%. :: A new random sample would most likely give a slightly different percent.
* It is plausible that 32% of the city's adults bike to work.
> The interval is 27% to 33%. 32% is inside it, so it's plausible. The other choices claim a certainty a sample can't give.
```

## Bigger sample, smaller margin

With the same method, a **larger random sample** gives a **smaller margin of error**: a narrower, more precise interval.

- It isn't proportional: about **4 times** the sample halves the margin. Doubling doesn't.
- The margin covers only random chance. It doesn't fix a biased sample, like volunteers.

```quiz
Two groups use the same method to estimate the mean commute time in a city. Group A surveys 300 adults chosen at random, and group B surveys 1,200. Which is most likely true?
- Group B's margin of error is about one-fourth of group A's. :: 4 times the sample cuts the margin to about half, not a fourth.
* Group B's margin of error is smaller than group A's.
- The two margins are about the same, since both samples come from the same city. :: The sample size, not the city, mainly sets the margin.
- Group B's estimate equals the true mean commute time. :: No sample, however big, guarantees the exact value.
> Group B's sample is larger, so its margin of error is most likely smaller: with 4 times the people, about half as big.
```

## Turn the interval into counts

To find a plausible **count**, build the percent interval, then multiply both ends by the population size. Any count between the two results is plausible.

```quiz
In a random sample of 200 of a town's 8,000 households, 25% have solar panels, with an associated margin of error of 5%. Which is a plausible number of households in the town with solar panels?
- 50 :: That's 25% of the 200 in the sample. Scale up to all 8,000 households.
- 1,500 :: The interval starts at 20% of 8,000 = 1,600. 1,500 is below it.
* 2,200
- 2,500 :: The interval ends at 30% of 8,000 = 2,400. 2,500 is above it.
> Interval: 20% to 30%. Counts: 0.20 × 8,000 = 1,600 and 0.30 × 8,000 = 2,400. Only 2,200 is between them.
```

## The trap: an interval across 50%

> **Trap:** A claim like "a majority" needs the **whole interval** above 50%. If the interval crosses the line, neither side is shown. Same for two groups: if their intervals overlap, you can't say which true value is higher.

```quiz
A random sample of a state's voters finds that 52% support a new law, with an associated margin of error of 3%. Which conclusion is best supported?
- A majority of the state's voters support the law. :: The trap. 49% is still plausible, so the data doesn't show a majority.
* It is plausible that between 49% and 55% of the state's voters support the law.
- Fewer than half of the state's voters support the law. :: Most of the interval is above 50%. This isn't shown either.
> 52 − 3 = 49 and 52 + 3 = 55. Values below and above 50% are both plausible, so the data can't settle "majority". The interval itself is the safe conclusion.
```

## Your turn: easy

Find the sample proportion, then multiply by the population size.

```check
m-1505
```

## Your turn: medium

Build the interval. Then ask what each choice is about: the population's mean, each item, or the sample?

```check
m-1238
```

## Your turn: hard

Build the percent interval, then turn both ends into counts for the whole population.

```check
m-1339
```

## Recap

- The population is the group the random sample was drawn from.
- Count: sample proportion × population size.
- Interval: estimate − margin to estimate + margin.
- It's about the population's mean or proportion: not each person, not the sample.
- Pick "plausible" over "exactly", "must" and "every".
- Bigger random sample, smaller margin (4 times the sample, about half the margin).
