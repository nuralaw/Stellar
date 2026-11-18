---
title: Inference from Samples and Margin of Error
skill: inference-sample
domain: problem-solving
section: math
summary: Turn a sample's result into a plausible range for the whole population.
---

# Estimate ± margin
Subtract and add the margin of error.

## Build the range

A random sample estimates the whole group (the **population**). **Plausible** values: estimate ± margin of error.

```visual
inference-sample--range
```

```example
In a random sample of a town's voters, 62% support a new park. The margin of error is 4%. Which range is plausible for all the town's voters?
1. 62 − 4 = 58 :: Subtract the margin.
2. 62 + 4 = 66 :: Add it.
3. 58% to 66% of all voters :: Plausible, not certain.
```

```more
A **population** is the whole group you want to know about. A **random sample** is a small part of it, picked by chance. The **margin of error** says how far off the estimate could be. **Plausible** means believable: it could really be true. Values outside the range are unlikely.
```

## Same move for a mean

```quiz
From a random sample, a city's mean commute is estimated at 27.4 minutes, with an associated margin of error of 2.1 minutes. What is the range of plausible values for the whole city's mean commute?
- 27.4 to 29.5 minutes :: The margin goes both ways. Subtract it too.
- Below 25.3 or above 29.5 minutes :: Those are outside the range: the least plausible values.
* 25.3 to 29.5 minutes
> 27.4 − 2.1 = 25.3 and 27.4 + 2.1 = 29.5.
~ type 27.4-2.1 :: Low end: 25.3.
~ type 27.4+2.1 :: High end: 29.5.
```

# Scale up a sample
Sample fraction × population size.

## Fraction times population

A random sample's fraction is the best estimate for the population.

```example
In a random sample of 40 of a school's 600 students, 10 walk to school. Estimate how many of all 600 students walk.
1. 10/40 = 0.25 :: Sample fraction.
2. 0.25 × 600 = 150 :: Times the population.
3. About 150 students :: Not 10.
```

```more
The sample is small, but it should look like the whole group. If 1 in 4 students in the sample walk, about 1 in 4 of all students walk. So multiply the sample fraction by the size of the whole population.
```

## Scale it yourself

```quiz
A library has 2,000 members. In a random sample of 50 members, 12 use its app. What is the best estimate of how many of the library's members use the app?
- 12 :: That is only the sample. Scale up to 2,000.
* 480
- 600 :: You multiplied 12 by 50. Use 12/50 × 2,000.
> 12/50 = 0.24, and 0.24 × 2,000 = 480.
~ type \frac{12}{50}\cdot 2000 :: Sample fraction times population. Desmos shows 480.
~ say :: 480 members, not 12.
```

# Range as a count
Percent range first, then multiply both ends.

## Both ends, then multiply

```example
A random sample estimates that 20% of a school's 1,000 students bike, with a margin of error of 5%. How many students plausibly bike?
1. 20 − 5 = 15 and 20 + 5 = 25 :: Percent range first.
2. 0.15 × 1,000 = 150 :: Low end.
3. 0.25 × 1,000 = 250 :: High end.
4. 150 to 250 students :: Use the population, not the sample.
```

```more
Do the margin of error on the percent first: 15% to 25%. Only then change each end into a number of students, using the whole population (1,000). The sample size is not used in this step.
```

## Pick a plausible count

```quiz
A random sample of 500 of a city's 8,000 households estimates that 45% own a pet, with a margin of error of 5%. Which is a plausible number of pet-owning households in the city?
- 225 :: That is 45% of the sample of 500. Use 8,000.
* 3,400
- 4,400 :: That is 55%. The range stops at 50%, or 4,000.
> 40% to 50% of 8,000 is 3,200 to 4,000. Only 3,400 is inside.
~ type 0.40\cdot 8000 :: Low end, 40%: 3,200.
~ type 0.50\cdot 8000 :: High end, 50%: 4,000.
~ say :: Only 3,400 is between them.
```

## Find the top end

```quiz
From a random sample of a town's 6,000 residents, it is estimated that 30% have a bike, with a margin of error of 4%. What is the greatest number of residents that plausibly have a bike?
answer: 2040
- 1800 :: That is 30% of 6,000, the estimate. Add the margin first.
- 240 :: That is the margin, 4% of 6,000. Use 34% of 6,000.
> The top of the range is 30% + 4% = 34%. 0.34 × 6,000 = 2,040.
~ type 0.34\cdot 6000 :: 34% of the population: 2,040.
```

# Sample size and margin
Bigger random sample: usually a smaller margin.

## More data, more precise

```visual
inference-sample--size
```

```example
Two random polls of one city ask the same question. Poll A asks 200 people. Poll B asks 2,000. Which has the smaller margin of error?
1. Same city, same method :: Only the size differs.
2. 2,000 > 200 :: More people, more precise.
3. Poll B :: Bigger sample, usually a smaller margin.
```

```more
**Precise** means the estimate is probably close to the true value. More people give a more precise estimate, so the margin of error gets smaller. "Usually" because the margin also depends on how the people vary, but on the SAT, bigger random sample means smaller margin.
```

## Repeat the poll

```quiz
A poll of 300 randomly chosen voters estimates 40% support for a law, with a margin of error of 5%. The poll is repeated the same way with 1,200 randomly chosen voters. What most likely happens?
* The margin of error gets smaller.
- The margin of error gets larger. :: Backwards. More data makes the estimate more precise.
- The estimate rises above 40%. :: Sample size does not push the estimate up or down.
> A larger random sample gives a more precise estimate, so a smaller margin of error.
```

# Compare two estimates
Overlapping ranges: no convincing difference.

## Do the ranges overlap?

Draw each plausible range. If they overlap, the true values could be equal.

```visual
inference-sample--overlap
```

```example
Random polls: Town A, 52% support a plan, margin 4%. Town B, 55%, margin 3%. Is it convincing that support is higher in Town B?
1. A: 52 ± 4 = 48% to 56% :: Plausible range for A.
2. B: 55 ± 3 = 52% to 58% :: Plausible range for B.
3. They overlap: 52% to 56% :: Both could have the same true value.
4. No, not convincing
```

```more
The estimates differ (52 and 55), but each is only an estimate. If one value, like 54%, is plausible for both towns, the data cannot show that the towns are different. Only ranges that do not touch give convincing evidence of a difference.
```

## Compare it yourself

```quiz
Random polls ask two groups the same question. Group X: 40% yes, margin of error 2%. Group Y: 47% yes, margin of error 3%. Which statement is best?
- The ranges overlap, so the groups may be equal. :: X is 38–42 and Y is 44–50. They do not touch.
* The ranges do not overlap, so Y's support is convincingly higher.
- Y's support is higher because 47 is more than 40. :: Compare the ranges, not only the estimates.
> X: 38% to 42%. Y: 44% to 50%. No overlap, so Y is plausibly higher.
```

# Trap: mean, not everyone
The range is for the mean, not each person.

## One person can differ

```example
From a random sample of a school's students, the mean quiz score is estimated at 80, with a margin of error of 3. Could one student have scored 50?
1. 80 − 3 = 77 and 80 + 3 = 83 :: Range for the school's mean.
2. 50 is one student's score :: The range says nothing about one student.
3. Yes, 50 is possible :: Only the mean is in 77–83.
```

```more
The **mean** is the average of everyone. Some students score far above it and some far below. The margin of error says how sure we are about the average, not how far each student is from it.
```

## Choose the conclusion

```quiz
From a random sample of a gym's members, the mean workout time is estimated at 4.2 hours a week, with a margin of error of 0.6 hours. Which conclusion is best?
- Every member works out between 3.6 and 4.8 hours a week. :: Trap: the range is for the mean, not each member.
* The mean for all members is plausibly between 3.6 and 4.8 hours a week.
- The mean for all members is exactly 4.2 hours a week. :: 4.2 is only an estimate. The true mean can differ.
> 4.2 − 0.6 = 3.6 and 4.2 + 0.6 = 4.8. That range is plausible for the mean of all members.
```

# Not random? No margin
Easy-to-reach samples can be biased.

## Convenience samples

A **convenience sample** is people who are easy to reach. It may not match the whole population.

```example
A shop owner asks 50 customers inside her shop if they like it. 90% say yes. Can she say 90% of the town likes the shop?
1. Sample: customers already in the shop :: Easy to reach, not random.
2. They likely like it more than others :: The sample leans one way.
3. No: the sample is biased :: A margin of error cannot fix it.
```

```more
A margin of error only works for a random sample, where everyone has a chance to be picked. People in the shop chose to be there, so people who dislike it are less likely to be asked. That is bias, and a bigger sample would not fix it.
```

## Biased or not?

```quiz
To estimate the mean number of books per household in a town, Dana surveyed 25 people leaving the town library. The mean for these 25 people was 6.2 books. Which statement must be true?
- The mean number of books in all households in the town is 6.2. :: This is only a sample, and not a random one.
* The method may give a biased estimate for the town.
- The method is fine because 25 people is enough. :: Who was asked matters more than how many.
> People at a library read more than most. The sample is not random, so it may be biased.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Sample fraction × population size.

```check
m-1505
```

## Your turn: medium

Build the range, then check what each choice describes.

```check
m-1238
```

## Your turn: hard

Percent range first. Then multiply both ends by the population.

```check
m-1339
```
