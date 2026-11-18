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

**Mean**: sum ÷ count. **Median**: the middle value in order. An **outlier** is a value far from the rest.

```visual
one-var-data--mean-median
```

```example
Data: 2, 4, 6, 8, 10. The 10 is changed to 20. What happens to the mean and the median?
1. Mean before: 30 ÷ 5 = 6 :: Sum ÷ count.
2. Mean after: 40 ÷ 5 = 8 :: The sum grew by 10.
3. Median: 6 before, 6 after :: The middle value did not change.
4. The mean rises by 2. The median stays 6.
```

```more
The **mean** is the balance point of the dots: a far-away dot pulls it. The **median** only cares about the order. It is the 3rd of 5 values, and the 3rd value did not move. An **outlier** is a value much larger or smaller than the others.
```

## Change the outlier

```quiz
Data: 12, 14, 15, 15, 17, 18, 60. The 60 is changed to 20. What happens?
- Both decrease. :: The middle value is still 15. Only the mean falls.
- The median decreases. The mean stays the same. :: Swapped. Changing 60 to 20 shrinks the sum a lot.
* The mean decreases. The median stays the same.
> Mean: 151 ÷ 7 ≈ 21.6, then 111 ÷ 7 ≈ 15.9. Median: 15 both times.
~ type L=\left[12,14,15,15,17,18,60\right] :: Put the data in a list.
~ type \mean\left(L\right) :: Mean with the 60: about 21.6.
~ type \median\left(L\right) :: Median with the 60: 15.
~ type M=\left[12,14,15,15,17,18,20\right] :: Now the list with 20.
~ type \mean\left(M\right) :: The mean drops to about 15.9.
~ type \median\left(M\right) :: The median is still 15.
```

# Median from a table
Count to the middle. A bar's height is its count.

## Count to the middle

A bar's height tells how many. Median position: (n + 1)/2. If n is even, average the two middle values.

```visual
one-var-data--median-table
```

```example
15 quiz scores: 4 students scored 6, 5 scored 7, 3 scored 8 and 3 scored 9. Find the median.
1. Position: (15 + 1)/2 = 8 :: The 8th score is the middle.
2. The 6s fill positions 1–4 :: Add up the counts.
3. The 7s fill positions 5–9 :: Position 8 is in here.
4. Median = 7
```

```more
A table or a histogram (a graph of bars) tells you the values in order. Count along the bars from the left until you reach the middle position. With 20 values, the middle is between the 10th and the 11th. Find both, then average them.
```

## Median in a table

```quiz
21 students were asked how many pets they have. 7 said 0, 5 said 1, 3 said 2, 4 said 3 and 2 said 4. What is the median?
- 11 :: That is the median's position, not its value.
* 1
- 2 :: That is the middle row. The counts decide the middle.
- 0 :: That is the most common value, not the middle one.
> Position (21 + 1)/2 = 11. The 0s fill positions 1–7 and the 1s fill 8–12.
```

## Even count

```quiz
In a frequency table, the value 1 appears 3 times, 2 appears 5 times, 3 appears 2 times and 4 appears 10 times. What is the median?
answer: 3.5
- 2.5 :: That averages 1, 2, 3, 4. Count positions instead.
- 3 :: That is only the 10th value. Average the 10th and 11th.
> 20 values: the middle is between the 10th (3) and the 11th (4). (3 + 4)/2 = 3.5.
```

# Read a graph
Dot plots and box plots: read the numbers.

## Dots and boxes

A **dot plot** has one dot per value. A **box plot** shows min, Q1, median, Q3, max. **Range** = largest − smallest.

```visual
one-var-data--read-plots
```

```example
The dot plot and the box plot show the same 11 values. Find the median and the range.
1. Median: the 6th dot = 5 :: Five dots on each side.
2. Range: 9 − 1 = 8 :: Largest minus smallest.
3. Median 5, range 8
```

```more
**Q1** is the median of the lower half. **Q3** is the median of the upper half. The box runs from Q1 to Q3, so it holds the middle half of the data. The line in the box is the median. The lines, called whiskers, reach the smallest and largest values.
```

## Read a box plot

```quiz
A box plot shows a smallest value of 12, Q1 of 20, a median of 26, Q3 of 30 and a largest value of 47. What is the range of the data?
answer: 35
- 26 :: That is the median. Range uses the smallest and largest.
- 10 :: That is Q3 − Q1, the box width. Use the two ends.
> Range = largest − smallest = 47 − 12 = 35.
```

# Read a histogram
Bar height = how many values are in that bin.

## Bars are counts

A **histogram** groups values into bins. A bar's height is how many values are in that bin.

```visual
one-var-data--histogram
```

```example
The histogram shows how many minutes 20 students studied. How many studied 20 to 29 minutes? Which bin holds the median?
1. The 20–29 bar is 8 tall :: Read the height.
2. Total: 2 + 5 + 8 + 4 + 1 = 20 :: Add every bar.
3. Median: 10th and 11th values :: Counts add up: 2, 7, 15.
4. 8 students. The median is in 20–29.
```

```more
A **bin** is a range of values, such as 20 to 29. The histogram does not show each exact value, only how many fall in each bin. To find the median bin, add the bar heights from the left until you pass the middle position.
```

## Find the median bin

```quiz
A histogram of 30 wait times, in minutes, has these bar heights: 9 for 0–4, 7 for 5–9, 8 for 10–14 and 6 for 15–19. Which bin contains the median?
- 0–4 :: That is the tallest bar, not the middle value.
* 5–9
- 10–14 :: The 15th and 16th values are already reached in 5–9.
- 15–19 :: That bin holds only the last 6 values.
> 30 values: the median is between the 15th and 16th. Counts: 9, then 16 by the end of 5–9.
```

# Think in totals
Total = mean × count. Then add or subtract.

## Mean to total

A value is added, removed or missing? Find the total first.

```visual
one-var-data--totals
```

```example
The mean of 4 numbers is 10. One of them, 16, is removed. What is the new mean?
1. Total: 4 × 10 = 40 :: Mean × count.
2. New total: 40 − 16 = 24 :: Take out the 16.
3. New mean: 24 ÷ 3 = 8 :: Three numbers are left.
```

```more
The mean tells you the total, even when you do not know the numbers: mean × count = total. After you add or remove a value, change the total first. Then divide by the new count.
```

## Find the new score

```quiz
The mean of Ana's 6 test scores is 80. After a seventh test, the mean of all 7 scores is 82. What was the seventh score?
answer: 94
- 82 :: That is the new mean, not the new score.
- 84 :: 82 + 6 × 2 = 94: it must lift six scores by 2 each.
> New total: 7 × 82 = 574. Old total: 6 × 80 = 480. Seventh score: 574 − 480 = 94.
~ type 6\cdot 80+x=7\cdot 82 :: Old total + new score x = new total.
~ zoom 80 110 -5 5 :: Desmos draws the solution as a vertical line.
~ point (94, 0) :: It crosses the x-axis at 94.
```

# Standard deviation
Spread: how far the values sit from the mean.

## Compare, don't compute

**Standard deviation (SD)**: the typical distance from the mean. Values farther out mean a larger SD.

```visual
one-var-data--sd
```

```example
Set A: 4, 5, 5, 5, 6. Set B: 1, 3, 5, 7, 9. Both means are 5. Which set has the larger SD?
1. A: distances 1, 0, 0, 0, 1 :: How far each value is from 5.
2. B: distances 4, 2, 0, 2, 4 :: B's values sit farther out.
3. B has the larger SD.
```

```more
Do not calculate SD on the SAT. Compare the distances from the mean. The set with more values far from the mean has the larger SD. **Range** is only the two ends, so it can be equal while the SDs differ.
```

## Which spreads more?

```quiz
Set P: 10, 20, 20, 20, 30
Set Q: 10, 10, 20, 30, 30
Both means are 20. Which is true?
* Q has the larger SD.
- P has the larger SD. :: Three of P's values sit exactly at the mean.
- The SDs are equal. :: Both ranges are 20, but SD uses every value.
> Four of Q's values are 10 away from the mean. Only two of P's are.
~ type \stdev\left(10,20,20,20,30\right) :: Set P: SD is about 7.07.
~ type \stdev\left(10,10,20,30,30\right) :: Set Q: SD is 10. Larger.
```

## Add an outlier

```quiz
Data set M: 18, 20, 21, 22, 24. Data set N is the same as M, but the 24 is changed to 60. Which statement is true?
- N has a larger range, but the same SD. :: One value moved far away, so the SD grows too.
- N has the same range and a larger SD. :: The largest value moved, so the range grows too.
* N has a larger range and a larger SD.
> Range: 24 − 18 = 6 becomes 60 − 18 = 42. The 60 sits far from the mean, so the SD grows.
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

```more
77.5 is the plain average of 70 and 85. It treats both classes as equal in size. But Class A has twice as many students, so its mean must count twice as much. That is why the true mean, 75, is closer to 70.
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

## Say it like the SAT

```quiz
A teacher has two classes. The 12 students in the first class have a mean quiz score of 80. The 18 students in the second class have a mean quiz score of 70. What is the mean quiz score, in points, of all 30 students?
answer: 74
- 75 :: That is the plain average of 80 and 70. Count the students.
- 70 :: That is the second class only. Combine both classes.
> Totals: 12 × 80 = 960 and 18 × 70 = 1,260. Mean: 2,220 ÷ 30 = 74.
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
