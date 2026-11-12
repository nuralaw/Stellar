---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: Find and compare mean, median and spread in lists, tables and plots, and predict how changing the data moves each one.
---

## Spot a one-variable data question

You get one set of numbers: a list, a frequency table, a dot plot, a histogram or a box plot. The question asks about its **center** or its **spread**, often comparing two sets or asking what changes.

- Mean: sum ÷ number of values.
- Median: the middle value **after sorting**.
- Range: greatest − least.

Long list? In Desmos, type `median([9,2,14,5,4])`, or `mean` in place of `median`.

```quiz
What is the median of 9, 2, 14, 5, 4?
- 14 :: That's the middle of the unsorted list. Sort first: 2, 4, 5, 9, 14.
* 5
- 6.8 :: That's the mean, 34 ÷ 5. The question asks for the median.
> Sort: 2, 4, 5, 9, 14. The middle value (the 3rd of 5) is 5.
```

## Median from a frequency table

A frequency table lists each value and how many times it appears.

1. Add the counts to get n.
2. The median sits at position (n + 1)/2. If n is even, average the two middle values.
3. Keep a running total down the table until you reach that position.

| Pets | Students |
|---|---|
| 0 | 7 |
| 1 | 5 |
| 2 | 3 |
| 3 | 4 |
| 4 | 2 |

```quiz
The table shows how many pets each of 21 students has. What is the median number of pets?
- 11 :: That's the position of the median, not its value. Count down the table to position 11.
- 2 :: That's the middle row. The counts, not the rows, decide where the middle is.
- 0 :: That's the mode, the most common value. The median is the middle one.
* 1
> n = 21, so the median is at position (21 + 1)/2 = 11.
> Running total: the 0s fill positions 1–7 and the 1s fill 8–12. Position 11 is a 1.
```

## Think in totals

When a value is added, removed or missing, comparing means is hard. Totals are easy:

**total = mean × count**

Turn each mean into a total, then subtract.

```quiz
The mean of Ana's 6 test scores is 80. After a seventh test, the mean of all 7 scores is 82. What did Ana score on the seventh test?
- 82 :: That's the new mean. To pull the mean up, the new score must be above 82.
- 84 :: That's 82 + 2. The new score must make up 2 points for each of the 6 old scores: 82 + 12.
* 94
> Old total: 6 × 80 = 480. New total: 7 × 82 = 574.
> The seventh score is the difference: 574 − 480 = 94.
```

## Outliers pull the mean

The mean uses every value, so one extreme value (an **outlier**) drags it toward itself. The median only cares about the middle position, so it barely moves.

> **Key idea:** Mean greater than median? Usually a few large values are pulling the mean up. Mean less than median? A few small ones are pulling it down.

```quiz
A data set is 12, 14, 15, 15, 17, 18, 60. If 60 is removed, what happens to the mean and the median?
* The mean decreases, and the median stays the same.
- Both decrease. :: The median moves only if the middle changes. It's 15 before and (15 + 15)/2 = 15 after.
- The median decreases, and the mean stays the same. :: Swapped. Removing 60 cuts the sum a lot, so the mean falls.
- Neither changes. :: 60 sits far above the mean, so taking it out must pull the mean down.
> Median: 7 values, so the 4th is 15. After: 6 values, so the average of the 3rd and 4th: (15 + 15)/2 = 15.
> Mean: 151 ÷ 7 ≈ 21.6 before, 91 ÷ 6 ≈ 15.2 after.
```

## Compare SDs, don't compute

Standard deviation (SD) measures how far values typically sit from the mean. You never calculate it on the SAT; you compare.

Ask: which set has **more values far from its own center**?

Range is not the same thing. It uses only the two ends, so two sets can share a range and still have different SDs.

```quiz
Set P: 10, 20, 20, 20, 30
Set Q: 10, 10, 20, 30, 30
Both sets have a mean of 20. Which statement is true?
- The SDs are equal, because the ranges are equal. :: Range looks only at the ends. In between, P bunches at 20 while Q sits at the edges.
- P has the larger SD. :: Three of P's values sit exactly at the mean. That makes its spread smaller, not larger.
* Q has the larger SD.
> Both ranges are 30 − 10 = 20. But four of Q's five values are 10 away from the mean, and only two of P's are. More values far from the center means a larger SD.
```

## Shift and scale the data

| Change to every value | Center | Spread |
|---|---|---|
| add k | moves by k | no change |
| multiply by k > 0 | × k | × k |

Center means mean and median; spread means range and SD. Adding the same number slides the whole set, but the gaps between values stay the same.

```quiz
A teacher adds 5 points to every student's test score. Which statement is true?
* The mean goes up by 5, and the SD stays the same.
- The mean and the SD both go up by 5. :: Every score moved 5, so the gaps between scores didn't change. The spread stays the same.
- The mean stays the same, and the SD goes up by 5. :: Swapped. The center slides up 5; the spread doesn't change.
> Adding 5 to everything slides the data set up by 5. The mean and median move with it, but every distance from the mean is unchanged, so the SD is too.
```

## Box plots show five numbers

A box plot shows the minimum, Q1, median, Q3 and maximum.

- The line inside the box is the **median**, never the mean.
- Each of the four parts holds about 25% of the values, however long it looks.
- It doesn't show the mean or how many values there are.

A box plot of quiz scores shows: minimum 52, Q1 64, median 71, Q3 80, maximum 98.

```quiz
Based on this box plot, which statement must be true?
- The mean score is 71. :: The line in the box is the median. A box plot never shows the mean.
- More scores are between 80 and 98 than between 71 and 80. :: Each part holds about 25%. A long part means spread out, not more scores.
* About half of the scores are between 64 and 80.
> The box runs from Q1 = 64 to Q3 = 80 and holds the middle half of the data: about 25% between Q1 and the median, and 25% between the median and Q3.
```

## The trap: averaging two averages

> **Trap:** When two groups of different sizes are combined, the overall mean is not the average of the two means. The bigger group pulls harder.

Use totals again: add the two totals, then divide by the total count.

```quiz
A team of 10 runners has a mean time of 30 minutes. Another team of 30 runners has a mean time of 34 minutes. What is the mean time of all 40 runners?
- 32 :: That averages the two means as if the teams were the same size. The 30-runner team counts three times as much.
* 33
- 31 :: You gave the bigger weight to the smaller team. Multiply each mean by its own team size.
> Totals: 10 × 30 = 300 and 30 × 34 = 1,020, so all 40 runners took 1,320 minutes.
> Mean: 1,320 ÷ 40 = 33.
```

## Your turn: easy

Check what the change does to the sum, then to the middle value.

```check
m-15824
```

## Your turn: medium

Turn each mean into a total with total = mean × count.

```check
m-1305
```

## Your turn: hard

For each measure, ask whether the change moves the sum, the middle value or the distances from the center.

```check
m-1242
```

## Recap

- Name the measure first: mean, median, range or SD.
- Median: sort, find position (n + 1)/2, count through the frequencies, and report the value, not the position.
- Added, removed or missing values, or combined groups: total = mean × count.
- An outlier pulls the mean; the median barely moves.
- SD: which set has more values far from its own center? Adding k to every value leaves it unchanged.
- Box plot: the middle line is the median, and each part holds about 25%.
