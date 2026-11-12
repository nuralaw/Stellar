---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: See what moves the mean, the median and the spread of a data set.
---

## Mean moves, median stays

**Mean** = sum ÷ count. **Median** = the middle value after sorting. An extreme value pulls the mean, not the median.

```example
Data: 2, 4, 6, 8, 10. The 10 is changed to 20. What happens to the mean and the median?
1. Mean before: 30 ÷ 5 = 6 :: Sum ÷ count.
2. Median before: 6 :: The middle of the sorted list.
3. Mean after: 40 ÷ 5 = 8 :: The sum grew by 10.
4. Median after: still 6 :: The middle value didn't change.
5. The mean rises by 2. The median stays 6.
```

## Remove the outlier

```quiz
Data: 12, 14, 15, 15, 17, 18, 60. The 60 is removed. What happens?
* The mean decreases. The median stays the same.
- Both decrease. :: The middle is 15 before and (15 + 15)/2 after.
- The median decreases. The mean stays the same. :: Swapped. Removing 60 shrinks the sum a lot.
> Mean: 151 ÷ 7 ≈ 21.6, then 91 ÷ 6 ≈ 15.2. Median: 15, then (15 + 15)/2 = 15.
```

## Median in a table

With n values, the median sits at position (n + 1)/2. Add up the counts until you reach it.

```quiz
21 students were asked how many pets they have. 7 said 0, 5 said 1, 3 said 2, 4 said 3 and 2 said 4. What is the median?
* 1
- 11 :: That's the median's position, not its value.
- 2 :: That's the middle row. The counts decide the middle.
- 0 :: That's the most common value, not the middle one.
> Position (21 + 1)/2 = 11. The 0s fill positions 1–7 and the 1s fill 8–12.
```

## Think in totals

A value is added, removed or missing? Use **total = mean × count**, then subtract.

```quiz
The mean of Ana's 6 test scores is 80. After a seventh test, the mean of all 7 is 82. What was the seventh score?
* 94
- 82 :: That's the new mean, not the new score.
- 84 :: Lifting 7 scores by 2 takes 14 extra points, not 4.
> New total: 7 × 82 = 574. Old total: 6 × 80 = 480. Seventh score: 574 − 480 = 94.
```

## Standard deviation: compare, don't compute

Standard deviation (SD) is spread: how far the values sit from the mean. More values far from the mean, larger SD.

```quiz
Set P: 10, 20, 20, 20, 30
Set Q: 10, 10, 20, 30, 30
Both means are 20. Which is true?
* Q has the larger SD.
- P has the larger SD. :: Three of P's values sit exactly at the mean.
- The SDs are equal. :: Equal ranges only compare the two ends.
> Four of Q's values are 10 away from the mean. Only two of P's are.
```

## Trap: averaging two averages

Groups of different sizes? Add the totals, then divide by the total count.

```quiz
10 runners have a mean time of 30 minutes. Another 30 runners have a mean time of 34 minutes. What is the mean time of all 40?
* 33
- 32 :: Trap: the bigger group counts three times as much.
- 31 :: You swapped the weights. Multiply each mean by its own count.
> Totals: 10 × 30 = 300 and 30 × 34 = 1,020. Mean: 1,320 ÷ 40 = 33.
```

## Your turn: easy

What happens to the sum? To the middle value?

```check
m-15824
```

## Your turn: medium

Turn each mean into a total, then subtract.

```check
m-1305
```

## Your turn: hard

Check the sum, the middle value, then the distances from the mean.

```check
m-1242
```

## Recap

- An extreme value pulls the mean. The median barely moves.
- Changed or combined data: total = mean × count.
- SD: more values far from the mean, larger SD.
