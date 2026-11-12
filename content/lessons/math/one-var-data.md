---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: See what moves the mean, the median and the spread of a data set.
---

# Mean and median
An extreme value pulls the mean, not the median.

## Mean moves, median stays

**Mean** = sum ÷ count. **Median** = the middle value after sorting.

```example
Data: 2, 4, 6, 8, 10. The 10 is changed to 20. What happens to the mean and the median?
1. Mean before: 30 ÷ 5 = 6 :: Sum ÷ count.
2. Mean after: 40 ÷ 5 = 8 :: The sum grew by 10.
3. Median: 6 before, 6 after :: The middle value didn't change.
4. The mean rises by 2. The median stays 6.
```

## Remove the outlier

```quiz
Data: 12, 14, 15, 15, 17, 18, 60. The 60 is removed. What happens?
- Both decrease. :: The middle is 15 before and (15 + 15)/2 after.
- The median decreases. The mean stays the same. :: Swapped. Removing 60 shrinks the sum a lot.
* The mean decreases. The median stays the same.
> Mean: 151 ÷ 7 ≈ 21.6, then 91 ÷ 6 ≈ 15.2. Median: 15, then (15 + 15)/2 = 15.
~ type L=\left[12,14,15,15,17,18,60\right] :: Put the data in a list.
~ type \mean\left(L\right) :: Mean with the 60: about 21.6.
~ type \median\left(L\right) :: Median with the 60: 15.
~ type M=\left[12,14,15,15,17,18\right] :: Now the list without 60.
~ type \mean\left(M\right) :: The mean drops to about 15.2.
~ type \median\left(M\right) :: The median is still 15.
```

# Median from a table
Add up the counts until you reach the middle.

## Count to the middle

With n values, the median sits at position (n + 1)/2.

```example
15 quiz scores: 4 students scored 6, 5 scored 7, 3 scored 8 and 3 scored 9. Find the median.
1. Position: (15 + 1)/2 = 8 :: The 8th score is the middle.
2. The 6s fill positions 1–4 :: Add up the counts.
3. The 7s fill positions 5–9 :: Position 8 is in here.
4. Median = 7
```

## Median in a table

```quiz
21 students were asked how many pets they have. 7 said 0, 5 said 1, 3 said 2, 4 said 3 and 2 said 4. What is the median?
- 11 :: That's the median's position, not its value.
* 1
- 2 :: That's the middle row. The counts decide the middle.
- 0 :: That's the most common value, not the middle one.
> Position (21 + 1)/2 = 11. The 0s fill positions 1–7 and the 1s fill 8–12.
```

# Think in totals
Total = mean × count. Then add or subtract.

## Mean to total

A value is added, removed or missing? Find the total first.

```example
The mean of 4 numbers is 10. One of them, 16, is removed. What is the new mean?
1. Total: 4 × 10 = 40 :: Mean × count.
2. New total: 40 − 16 = 24 :: Take out the 16.
3. New mean: 24 ÷ 3 = 8 :: Three numbers are left.
```

## Find the new score

```quiz
The mean of Ana's 6 test scores is 80. After a seventh test, the mean of all 7 is 82. What was the seventh score?
- 82 :: That's the new mean, not the new score.
- 84 :: Lifting 7 scores by 2 takes 14 extra points, not 4.
* 94
> New total: 7 × 82 = 574. Old total: 6 × 80 = 480. Seventh score: 574 − 480 = 94.
~ type 6\cdot 80+x=7\cdot 82 :: Old total + new score x = new total.
~ zoom 80 110 -5 5 :: Desmos draws the solution as a vertical line.
~ point (94, 0) :: It crosses the x-axis at 94.
```

# Standard deviation
Spread: how far the values sit from the mean.

## Compare, don't compute

More values far from the mean, larger standard deviation (SD).

```example
Set A: 4, 5, 5, 5, 6. Set B: 1, 3, 5, 7, 9. Both means are 5. Which set has the larger SD?
1. A: distances 1, 0, 0, 0, 1 :: How far each value is from 5.
2. B: distances 4, 2, 0, 2, 4 :: B's values sit farther out.
3. B has the larger SD.
```

## Which spreads more?

```quiz
Set P: 10, 20, 20, 20, 30
Set Q: 10, 10, 20, 30, 30
Both means are 20. Which is true?
* Q has the larger SD.
- P has the larger SD. :: Three of P's values sit exactly at the mean.
- The SDs are equal. :: Equal ranges only compare the two ends.
> Four of Q's values are 10 away from the mean. Only two of P's are.
~ type \stdev\left(10,20,20,20,30\right) :: Set P: SD is about 7.07.
~ type \stdev\left(10,10,20,30,30\right) :: Set Q: SD is 10. Larger.
```

# Trap: averaging averages
Different group sizes? Add the totals first.

## Add totals, then divide

```example
Class A: 20 students, mean score 70. Class B: 10 students, mean score 85. Find the mean of all 30.
1. 20 × 70 = 1,400 and 10 × 85 = 850 :: Each total = mean × count.
2. 2,250 ÷ 30 = 75 :: All points ÷ all students.
3. Mean = 75, not 77.5 :: The bigger class counts more.
```

## Mix two groups

```quiz
10 runners have a mean time of 30 minutes. Another 30 runners have a mean time of 34 minutes. What is the mean time of all 40?
* 33
- 32 :: Trap: the bigger group counts three times as much.
- 31 :: You swapped the weights. Multiply each mean by its own count.
> Totals: 10 × 30 = 300 and 30 × 34 = 1,020. Mean: 1,320 ÷ 40 = 33.
~ type T=10\cdot 30+30\cdot 34 :: Total minutes: each mean × its count.
~ type \frac{T}{40} :: Divide by all 40 runners: 33.
```

# Real SAT questions
Three real questions, easy to hard.

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
