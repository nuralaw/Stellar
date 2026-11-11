---
title: Inference from Samples and Margin of Error
skill: inference-sample
domain: problem-solving
section: math
summary: Use a random sample to estimate a whole population, read a margin of error as a range of believable values, and know what a bigger sample changes.
minutes: 9
---

## What this question looks like

A short paragraph describes a **survey or study of a sample**: a smaller group picked from a bigger one. Then you're asked one of these:

- "Based on the sample, which is the best estimate of the number of [people/items] in the whole [town/school/factory] that…?"
- "The estimate has an associated **margin of error** of 3%. Which of the following is the most appropriate conclusion?"
- "Which of the following values is plausible for…?" or "…is NOT plausible?"
- "Which change would most likely **decrease the margin of error**?"

The calculations are small. Most points are lost by reading the conclusion choices too quickly.

Words to know:

- **Population**: the whole group you care about (all 48,000 households in a city).
- **Sample**: the smaller group that was actually measured (400 of those households).
- **Random sample**: everyone in the population had a fair chance to be picked. Only a random sample lets you make estimates about the population.
- **Sample statistic**: a number from the sample, like a sample mean (average) or sample proportion (fraction).
- **Margin of error**: how far the true population value could plausibly be from the sample's number, just from the luck of which people got picked.

## The method

**For "best estimate" questions:**

1. Find the sample proportion: part / sample size.
2. Multiply it by the **population** size, not the sample size.
3. Check that the result is sensible (smaller than the population, roughly the right share).

**For margin-of-error questions:**

1. Build the interval: (estimate − margin) to (estimate + margin). Write both numbers down before reading the choices.
2. Note what the interval is about: a **population mean** or **population proportion**, for the population that was sampled. Not individuals, and not some other group.
3. Pick the choice that says the true value is **plausibly / likely** inside that interval. Cross out choices that say "exactly", "all", "every" or "definitely".
4. For a claim like "a majority" or "more than 40%", check the **whole interval**. The claim is supported only if every value in the interval agrees with it.

> **Key idea:** A margin of error turns one number into a range of believable values for the population. It describes the group's average or share, never every single member.

## Rules and formulas you need

| Fact | What it means for you |
|---|---|
| Estimate = sample proportion × population size | 34% of the sample → about 34% of the population |
| Interval = estimate ± margin of error | 52% ± 3% → from 49% to 55% |
| Margin of error = half the width of the interval | Interval 0.31 to 0.39 → margin 0.04, estimate 0.35 (the midpoint) |
| Larger sample → smaller margin of error | Bigger random samples give more precise estimates |
| Smaller margin of error = narrower interval = more precise | A smaller margin is better, not worse |
| Higher confidence level → larger margin of error | Being more sure costs you a wider range |
| Results extend only to the population that was sampled | A random sample of one school says nothing sure about other schools |
| Margin of error does not fix bias | A huge but non-random sample is still unreliable |

Good to know: the margin of error shrinks with the **square root** of the sample size. To cut it roughly in half, you need about **4 times** as many people, not 2 times. The SAT mostly just tests the direction (bigger sample, smaller margin), so you will not need a margin-of-error formula.

## Worked examples

### Example 1: Best estimate for a population

A city has 48,000 households. A random sample of 400 households in the city was surveyed, and 136 of them reported owning a dog. Based on the survey, which of the following is the best estimate of the number of households in the city that own a dog?

- (A) 120
- (B) 136
- (C) 16,320
- (D) 31,680

**Solution**

Sample proportion: 136/400 = 0.34. Scale up to the population: 0.34 × 48,000 = 16,320.

Why the others are wrong: (A) is 48,000 ÷ 400, which is the scale factor, not a count of dog owners. (B) is just the sample count, not scaled up. (D) is 0.66 × 48,000, the households that do **not** own a dog.

**Answer:** (C)

### Example 2: What a margin of error really says

A researcher selected 150 members of a large running club at random and recorded how far each one ran in one week. The sample mean was 18.4 miles, with an associated margin of error of 1.2 miles. Which of the following is the most appropriate conclusion?

- (A) Every member of the running club ran between 17.2 and 19.6 miles that week.
- (B) The mean distance run that week by all members of the running club was exactly 18.4 miles.
- (C) It is plausible that the mean distance run that week by all members of the running club is between 17.2 and 19.6 miles.
- (D) It is plausible that the mean weekly distance for all adult runners in the country is between 17.2 and 19.6 miles.

**Solution**

Interval: 18.4 − 1.2 = 17.2 and 18.4 + 1.2 = 19.6. The sample came from the running club, so the interval is about the **mean** for **club members**. Choice (C) says exactly that, using "plausible".

Why the others are wrong: (A) talks about every individual. The interval is about the average, and plenty of members could run 5 or 40 miles. (B) says "exactly". A sample only gives an estimate. (D) jumps to all runners in the country, a group that was never sampled.

**Answer:** (C)

### Example 3: Can you claim a majority?

A random sample of likely voters in a town was asked about a plan to build a new library. Of those surveyed, 53% supported the plan. The margin of error for this estimate is 4 percentage points. Which conclusion is best supported by the survey?

- (A) A majority of the town's likely voters support the plan.
- (B) Fewer than half of the town's likely voters support the plan.
- (C) Exactly 53% of the town's likely voters support the plan.
- (D) It is plausible that between 49% and 57% of the town's likely voters support the plan.

**Solution**

Interval: 53 − 4 = 49 and 53 + 4 = 57. So the believable range is 49% to 57%.

Why the others are wrong: (A) needs every value in the interval to be above 50%, but 49% is still plausible, so a majority is not proven. (B) is also not supported, because most of the interval is above 50%. (C) treats the estimate as exact.

**Answer:** (D)

### Example 4: Effect of sample size

Two students each surveyed a random sample of the 2,000 students at their school about how many hours they sleep on school nights. Priya surveyed 100 students and Marco surveyed 400 students. Both used the same method and the same confidence level. Which statement is most likely true?

- (A) Priya's estimate will have a smaller margin of error, because her sample is easier to measure.
- (B) The two estimates will have the same margin of error, because both samples come from the same school.
- (C) Marco's estimate will have a smaller margin of error, because his sample is larger.
- (D) Marco's sample mean will be exactly equal to the mean for the whole school.

**Solution**

With the same method and confidence level, a larger random sample gives a smaller margin of error. Marco's sample is 4 times bigger, so his margin is likely about half of Priya's.

Why the others are wrong: (A) has the rule backward. (B) ignores sample size, which is what drives the margin of error. (D) says "exactly". Even a big sample only estimates.

**Answer:** (C)

## Traps to avoid

- **Scaling with the wrong number.** Multiply the sample proportion by the population size. Using the sample size, or dividing the wrong way, gives a choice that is waiting for you.
- **Mean vs. individuals.** An interval for the mean says nothing about every member. "All", "every" or "each" in a choice is almost always wrong.
- **"Exactly" answers.** A sample never pins the population value down exactly. Look for "plausible", "likely" or "approximately".
- **Claiming a direction the interval doesn't support.** If the interval crosses the line (like 50%), neither side is proven.
- **Generalizing to an unsampled group.** A sample from one club, school or city only speaks for that club, school or city.
- **Thinking a bigger margin is better.** Bigger margin means less precise.
- **Thinking a big sample fixes a bad sample.** A large online poll of volunteers can still be biased. Random selection matters more than size.
- **Mixing up width and margin.** The full width of the interval is twice the margin of error.
- **Comparing overlapping intervals.** If two groups' intervals overlap, you can't confidently say one group's true value is higher.

## Quick checklist

- Was the sample random? From which population?
- For estimates: proportion × population size.
- For margins: write both ends of the interval before reading the choices.
- Is the interval about a mean or proportion, not individuals?
- Does the claim hold for the whole interval?
- Cross out "exactly", "all", "every" and any group that wasn't sampled.

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (skill descriptions, Appendix B)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf)
- [Test Ninjas: SAT Data Inference and Margin of Error](https://www.test-ninjas.com/sat-data-inference-margin-of-error)
- [Varsity Tutors: SAT Inferences and Claims from Statistics](https://www.varsitytutors.com/practice/subjects/sat/lessons/inferences-and-claims-from-statistics)
- [Albert.io: Digital SAT Math, Inference from Sample Statistics and Margin of Error](https://www.albert.io/blog/?p=117755)
- [Achievable: SAT Problem-Solving and Data, Inferences](https://app.achievable.me/study/sat/learn/problem-solving-and-data-methods-inferences)
- [TestPrepKart: SAT Margin of Error Practice Questions](https://testprepkart.com/sat/blog/sat-margin-of-error-practice-questions)
- [Open Exam Prep: Study Design and Margin of Error](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/study-design-margin-error)
