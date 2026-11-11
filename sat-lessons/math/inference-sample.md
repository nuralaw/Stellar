---
title: Inference from samples and margin of error
skill: inference-sample
domain: problem-solving
section: math
summary: Use a random sample to estimate a value for a whole population, read a margin of error as a range of plausible values, and know what sample size changes.
minutes: 16
---

## What this question looks like

A short paragraph describes a survey or study of a **sample**, a smaller group chosen from a bigger group (the **population**). It gives a sample result, such as a percent, a proportion or a mean, and sometimes a **margin of error**. There is usually little or no calculation; the work is reading carefully.

Typical question stems:

- "Based on the sample, which of the following is the best estimate of the number of [members of the population] who ...?"
- "The estimate is 0.62, with an associated margin of error of 0.03. Which of the following is the most appropriate conclusion?"
- "Which of the following is a plausible value for the mean of all ...?"
- "If the sample had included more people, how would the margin of error most likely change?"
- "Which conclusion about the two groups is best supported by the data?"

How often: zero or one question per test. It is one of the quickest points on the test once you know the rules.

The sub-types: scaling a sample result up to the population; building and reading a margin of error interval; how sample size affects the margin of error; and comparing two estimates.

## The method

1. Find the population: who could have been chosen for the sample? The results describe that group, and only if the sample was chosen at random.
2. For a count: population estimate = (sample proportion) × (population size).
3. If there is a margin of error, build the interval: from estimate − margin of error to estimate + margin of error.
4. Read the interval as "plausible values for the mean (or proportion) of the whole population". It isn't about the sample, and it isn't about each person.
5. For sample-size questions: a larger random sample gives a smaller margin of error.
6. For two estimates: build both intervals. If they overlap, you can't say which true value is larger.
7. Prefer careful words ("plausible", "likely", "estimate") over words of certainty ("exactly", "all", "proves").

## Rules and formulas you need

### Sample and population

- **Population:** the whole group you want to learn about (all 2,400 students at a school). **Sample:** the part you actually measure (150 of those students).
- A number that describes the sample (a sample mean or sample proportion) is a **statistic**. The true value for the whole population is a **parameter**. You know the statistic exactly; you can only estimate the parameter.
- A **random sample** gives every member of the population the same chance of being chosen. Only a random sample lets you use the result for the whole population.

### Estimating a count

- Population estimate = (number in the sample with the trait ÷ sample size) × population size.
- Example: 30 of 200 light bulbs chosen at random from a factory's 5,000 bulbs are faulty. 30 ÷ 200 = 0.15, and 0.15 × 5,000 = 750, so about 750 of the 5,000 bulbs are faulty.

### Margin of error

- The **margin of error** tells you how far the true population value could reasonably be from the sample estimate.
- The interval of plausible values runs from (estimate − margin of error) to (estimate + margin of error). Example: 0.62 with a margin of error of 0.03 gives 0.59 to 0.65.
- Values inside the interval are **plausible** (reasonable to believe). Values outside are not plausible, though not impossible.
- The interval is about the population parameter (the mean or proportion for the whole population). It is not a range for individual people, and it is not about the sample, whose value is already known.
- A margin of error usually comes with a confidence level, such as 95%. SAT questions often just say "an associated margin of error".
- The margin of error only covers the chance differences that come from random sampling. It doesn't fix a biased sample, like one made only of volunteers.
- When the margin of error is given in **percentage points**, add and subtract it directly: 18% with a margin of error of 3 percentage points gives 15% to 21%.

> **Key idea:** A margin of error question is really an interval question. Add and subtract to get the interval, then find the choice that talks about the population and stays inside the interval.

### What changes the margin of error

| If you... | the margin of error... |
|---|---|
| use a larger random sample | gets smaller |
| use a smaller sample | gets larger |
| study a population with more variation (values more spread out) | gets larger |
| want a higher confidence level (99% instead of 95%) | gets larger |
| study a bigger population with the same sample size | barely changes |

- The change isn't proportional. It takes about 4 times the sample size to cut the margin of error in half, so doubling the sample doesn't halve it.

### Comparing two estimates

- Build both intervals.
- If the intervals overlap, it is plausible that the two true values are equal, so you can't conclude that one is greater.
- If they don't overlap, the data gives evidence that the true values are different.
- A claim that a majority (more than half) agrees is supported only if the whole interval is above 50%.

> **Remember:** Who the results apply to depends on how the sample was chosen. A random sample of one school's students tells you about that school only. The lesson on evaluating statistical claims covers this in detail.

## Worked examples

### Example 1: From a sample to a population count

A school has 2,400 students. For a survey, 150 of the students were selected at random, and 54 of them said they walk to school. Based on the survey, which of the following is the best estimate of the number of students at the school who walk to school?

- (A) 54
- (B) 864
- (C) 1,536
- (D) 2,250

**Solution.** The sample proportion is 54 ÷ 150 = 0.36, so about 36% of the sample walks. The sample was random, so use the same proportion for the whole school: 0.36 × 2,400 = 864. Choice (A) is the number of walkers in the sample, not in the school. Choice (C) is the estimate for students who don't walk (0.64 × 2,400). Choice (D) is the number of students who weren't surveyed (2,400 − 150).

**Answer:** (B)

### Example 2: Reading a margin of error

A researcher selected 500 adults at random from all the adults in a city and asked each one how many minutes their trip to work takes. The mean for the sample was 27.4 minutes, with an associated margin of error of 2.1 minutes. Which of the following is the most appropriate conclusion?

- (A) It is plausible that the mean trip time for all adults in the city is between 25.3 and 29.5 minutes.
- (B) Every adult in the city has a trip time between 25.3 and 29.5 minutes.
- (C) It is plausible that the mean trip time for the 500 adults in the sample is between 25.3 and 29.5 minutes.
- (D) It is plausible that the mean trip time for all adults in the country is between 25.3 and 29.5 minutes.

**Solution.** Build the interval: 27.4 − 2.1 = 25.3 and 27.4 + 2.1 = 29.5. This is a range of plausible values for the mean of the population the sample came from: all adults in the city. That is choice (A). Choice (B) talks about every person; the interval is about the mean, and many people's trips are much shorter or longer. Choice (C) talks about the sample, but the sample mean is known exactly: it is 27.4. Choice (D) uses the wrong population: the adults were chosen from one city, not from the whole country.

**Answer:** (A)

### Example 3: Sample size and the margin of error

Two polling groups each want to estimate the proportion of voters in a state who support building a new park. Both groups use the same method to select voters at random from the state's list of voters. Group A surveys 400 voters, and group B surveys 1,600 voters. Which of the following is most likely true?

- (A) The margin of error for group A's estimate is greater than the margin of error for group B's estimate.
- (B) The margin of error for group B's estimate is about one-fourth of the margin of error for group A's estimate.
- (C) Group B's estimate is equal to the true proportion of voters in the state who support the park.
- (D) The two margins of error are about the same, because both samples come from the same population.

**Solution.** A larger random sample gives a smaller margin of error, so group A, with the smaller sample, most likely has the greater margin of error. Choice (B) gets the size of the change wrong: 4 times the sample size cuts the margin of error to about one-half, not one-fourth. Choice (C) is too strong: no sample, however big, guarantees the exact true value. Choice (D) is wrong because the sample sizes are different, and the sample size, not the population, is what mainly sets the margin of error.

**Answer:** (A)

### Example 4: Two estimates whose intervals overlap

Researchers selected adults at random in two towns and asked whether they ride a bike to work. In town M, the estimated proportion who bike to work was 0.38, with an associated margin of error of 0.05. In town N, the estimated proportion was 0.45, with an associated margin of error of 0.04. Which of the following is the most appropriate conclusion?

- (A) The proportion of adults who bike to work is greater in town N than in town M.
- (B) It is plausible that the two towns have the same proportion of adults who bike to work.
- (C) The proportion of adults who bike to work in town N is exactly 0.07 greater than in town M.
- (D) No conclusion can be made about either town, because the two margins of error are different.

**Solution.** Build both intervals. Town M: 0.38 − 0.05 = 0.33 to 0.38 + 0.05 = 0.43. Town N: 0.45 − 0.04 = 0.41 to 0.45 + 0.04 = 0.49. The intervals overlap from 0.41 to 0.43, so a value such as 0.42 is plausible for both towns. That means the two proportions could be equal, and choice (B) is the appropriate conclusion. Choice (A) is too confident: the overlap means the data doesn't show which town is higher. Choice (C) treats both estimates as exact values. Choice (D) goes too far the other way: each interval still gives plausible values for its own town, and margins of different sizes can still be compared.

**Answer:** (B)

### Example 5: A plausible count with a margin of error

A town has 6,000 households. In a random sample of 250 of the households, 18% own a dog. The margin of error for this estimate is 3 percentage points. Which of the following is a plausible number of households in the town that own a dog?

- (A) 45
- (B) 840
- (C) 1,200
- (D) 1,380

**Solution.** First build the interval of plausible percents: 18% − 3% = 15% to 18% + 3% = 21%. Then turn it into numbers of households: 0.15 × 6,000 = 900 and 0.21 × 6,000 = 1,260. Any count from 900 to 1,260 is plausible, and only 1,200 (which is 20%) is in that range. Choice (A) is the number of dog owners in the sample (0.18 × 250), not in the town. Choice (B) is 14% of the households and choice (D) is 23%, and both are outside the interval.

**Answer:** (C)

## Traps to avoid

- **Sample count instead of population estimate.** The number in the sample (54, or 18% of 250) answers a different question. Scale up to the population.
- **The wrong group.** Some choices give the estimate for people without the trait, or the number of people who weren't surveyed. Re-read who the question asks about.
- **Every person instead of the mean.** An interval for a mean says nothing about each person's value.
- **The sample instead of the population.** The sample result is known exactly; the interval is for the population.
- **"Exactly".** An estimate with a margin of error never gives an exact population value.
- **Percent of a percent.** "18% with a margin of error of 3 percentage points" means 15% to 21%, not 18% plus or minus 3% of 18%.
- **Doubling the sample halves the margin of error.** False. It takes about 4 times the sample size to halve it.
- **A bigger sample fixes a biased method.** False. A margin of error, however small, only covers random chance, not bias.
- **Overlapping intervals show a difference.** They don't. If the intervals overlap, either true value could be larger.
- **The wrong population.** A random sample of one city's adults can't describe the whole country.

## Quick checklist

- Who is the population, and was the sample chosen at random?
- For a count: sample proportion × population size.
- Interval: estimate ± margin of error (percentage points are added and subtracted directly).
- The interval is about the population's mean or proportion, not about each person or the sample.
- A bigger random sample gives a smaller margin of error (4 times the sample, about half the margin).
- Overlapping intervals: no clear winner.

## Sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — official testing points: estimate population means and proportions, interpret margin of error, larger samples give smaller margins.
- [SAT Practice Test 4 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf) — the official "interval of plausible values" wording and why an estimate isn't an exact value.
- [SAT Practice Test 5 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf) — scaling a sample result up to a population and the typical wrong choices.
- [Data Inference and Margin of Error (Test Ninjas)](https://www.test-ninjas.com/sat-data-inference-margin-of-error) — the sample, scale, interval routine and what a margin of error doesn't cover.
- [Study Design and Margin of Error (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/study-design-margin-error) — sample size versus margin of error and the "whole interval above 50%" rule for majorities.
- [Inferences and Claims from Statistics (Varsity Tutors)](https://www.varsitytutors.com/practice/subjects/sat/lessons/inferences-and-claims-from-statistics) — common question types and the overlapping-interval case.
- [SAT Math review: inference from samples (Albert.io)](https://www.albert.io/blog/?p=117755) — comparing two estimates and choosing hedged answer wording.
- [Understanding the margin of error in election polls (Pew Research Center)](https://www.pewresearch.org/short-reads/2016/09/08/understanding-the-margin-of-error-in-election-polls/) — what a margin of error measures, and why it doesn't cover other errors.
- [Margin of Error: a rare but easy SAT topic (Settele Tutoring, YouTube)](https://www.youtube.com/watch?v=vGRch23Xui0) — the meaning of "plausible" and how the topic is tested.
