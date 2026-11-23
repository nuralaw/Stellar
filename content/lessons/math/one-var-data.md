---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: Mean, median, spread, tables and plots: what moves, what stays.
---

# Mean, median, mode
An extreme value pulls the mean more than the median.

```visual
one-var-data--mean-median
```

## Key ideas
The **mean** is the sum divided by the count:

\[\text{mean} = \frac{\text{sum of the values}}{\text{number of values}}\]

The **median** is the middle value once the data are in order. With an even count, average the two middle values. The **mode** is the value that appears most often. The **range** is the largest value minus the smallest.

An **outlier** is a value far from the rest. It drags the mean toward itself much more than it moves the median. If you **change** an extreme value, the median stays put but the mean shifts. If you **add or remove** one, the median shifts only a little, to the next value or halfway to it. A big outlier on the high side makes the mean larger than the median.

A new value above the current mean raises the mean. A new value below it lowers the mean.

```example
Data: 2, 4, 6, 8, 10. The 10 is changed to 20. What happens to the mean and the median?
1. Mean before: \(\frac{30}{5} = 6\) :: Sum divided by count.
2. Mean after: \(\frac{40}{5} = 8\) :: The sum grew by 10.
3. Median: 6 before, 6 after :: The middle value did not change.
4. The mean rises by 2. The median stays 6. :: Only the mean feels the outlier.
```

```theory
Always **order the data first** before you look for the median. A list like 4, 10, 18, 4, 4, 5, 6, 5 has a median of 5, found only after sorting to 4, 4, 4, 5, 5, 6, 10, 18 and averaging the 4th and 5th values.

Why does an outlier pull the mean? The mean adds every value, so one huge value adds a lot to the sum. The median only looks at the order, so a value that was already the largest and becomes even larger is still just the largest.

Adding or removing a value is different from changing one. For 1, 2, 3, 4 the median is 2.5. Add 100 and the list 1, 2, 3, 4, 100 has median 3: the median moved only half a step. Changing the 4 to 100 leaves the median at 2.5. Learn both cases, because the SAT asks about both.

**Skew.** If a few values are much larger than the rest, the mean is greater than the median. If a few are much smaller, the mean is less than the median. In a perfectly symmetric list, such as 0, 10, 20, 30, 40, the mean and median are equal.

**Adding a value.** Adding a value equal to the mean leaves the mean unchanged. A value larger than the mean raises it. If the new value is smaller than every old value, it also lowers the median or leaves it the same, never raises it.

SAT wording: "must be greater", "could be", "which measure stays the same". "Must" means true for every possible list, so test a few lists.

Traps:
- Treating the middle position of an unsorted list as the median.
- Thinking the median moves when an extreme value is only changed.
- Forgetting that the mode can be any value in the list, not the biggest.
```

## Easy
```task
bank: m-1403
highlight:
- "Data set A: 5, 5, 5, 5, 5, 5, 5, 5, 5" :: Every value is 5, so mean and median are both 5.
- "Data set B: 5, 5, 5, 5, 5, 5, 5, 5, 5, 100" :: Set B adds one huge value, 100.
- "means and medians" :: Check both. Here the outlier lifts the mean to 14.5, while the median stays 5.
explain:
Set A has nine 5s, so its mean is 5 and its median is 5.

Set B is the same list with one outlier, 100, added.

**Median of B.** There are 10 values. The 5th and 6th values are both 5, so the median is still 5. The median did not change.

**Mean of B.** The sum is \(9 \times 5 + 100 = 145\), so the mean is \(\frac{145}{10} = 14.5\). The outlier pulled the mean up from 5.

So the means are different (5 and 14.5) and the medians are the same (5). Only the means differ. The answer is A.
```

## Medium
```task
bank: m-1325
highlight:
- "For which of the following data sets" :: Check each list in turn and compare its mean with its median.
- "the mean greater than the median" :: The mean is above the median when a few large values pull it up.
explain:
Compare the mean and the median of each list. Each list has 9 values, so the median is the 5th.

A: all 5s, so mean and median are both 5. No.

B: 0, 10, ..., 80 is evenly spaced, so the mean and median are both 40. No.

C: 2, 4, 8, 16, 32, 64, 128, 256, 512. The median is the 5th value, 32. The sum is 1,022, so the mean is about 113.6. The large values on the right pull the mean above the median. Yes.

D: most values are large, with the median at 207 and a mean of about 195.9. The small values at the left pull the mean down. No.

Only list C has a mean greater than its median. The answer is C.
```

## Hard
```task
bank: m-1454
highlight:
- "as well as the integer 10" :: The new value 10 is far below every value in F.
- "between 170 and 290" :: All of F's values are far above 10.
- "must be less for data set F than for data set G" :: Test each statement. If G's mean and median drop, F's are greater.
explain:
Data set G is data set F plus the number 10. Every value in F is between 170 and 290, so 10 is much smaller than all of them.

**Mean.** Adding a value below the mean pulls the mean down. So the mean of G is **less** than the mean of F. The statement says the mean of F must be less than G's, which is false.

**Median.** Putting a very small value at the front of the ordered list shifts the middle position down. The median of G is the same as or lower than the median of F. So F's median is not less than G's. That statement is false too.

Neither statement must be true. The answer is D, neither I nor II.
```

# Frequency tables
Add the counts to find the middle.

```visual
one-var-data--median-table
```

## Key ideas
A **frequency table** lists each value and how many times it appears. Add the frequencies to get the count \(n\). The median sits at position

\[\frac{n + 1}{2}\]

If \(n\) is even, this lands halfway between two positions: average the \(\frac{n}{2}\)th and \(\left(\frac{n}{2} + 1\right)\)th values. To find the value at a position, go down the table and keep a running total of the frequencies until you reach it.

The **mode** is the value with the greatest frequency. For the mean, multiply each value by its frequency, add them up and divide by \(n\):

\[\text{mean} = \frac{\sum (\text{value} \times \text{frequency})}{n}\]

The middle **row** of the table is not the median, and the plain average of the values ignores the counts.

```example
15 quiz scores: 4 students scored 6, 5 scored 7, 3 scored 8 and 3 scored 9. Find the median.
1. Position: \(\frac{15 + 1}{2} = 8\) :: The 8th score is the middle.
2. The 6s fill positions 1 to 4 :: Keep a running total.
3. The 7s fill positions 5 to 9 :: Position 8 is in here.
4. Median = 7 :: The value at position 8.
```

```theory
A frequency table is a compressed list. The table "6: four times, 7: five times" is the list 6, 6, 6, 6, 7, 7, 7, 7, 7. So the median is still the middle of the ordered list, and the table already keeps the values in order.

A **bar graph of single values** (a bar for each value) shows the same information as a frequency table. Count along the bars from the left, adding heights, until you pass the middle position. A bar graph is not the same as a histogram, where bars stand for ranges of values.

With an even count, such as 20 values, the median is the average of the 10th and 11th values. If both are the same, that is the median. If they are 3 and 4, the median is 3.5, even though 3.5 is not a value in the table.

For the mean, a table is faster than a list: if 7 students have 0 pets and 5 have 1 pet, the total is \(0 \times 7 + 1 \times 5\), not \(0 + 1\). Dividing by the number of students, not the number of rows, is a common slip.

Questions about "could be the median" use the counts to trap the middle position. If 10 fish are in the lowest group and 11 in the next, with 33 fish in all, the median is the 17th fish, which falls in the second group. Then the median must lie in that group's range.

Traps:
- Using the middle row instead of the middle position.
- Averaging the values and ignoring how many times each appears.
- Reading the position (like 11) as the median.
```

## Easy
```task
A club recorded the number of pets owned by each of its 25 members. 6 members have 0 pets, 8 have 1 pet, 5 have 2 pets, 4 have 3 pets and 2 have 4 pets. What is the median number of pets?
- 0 :: That is the first row, not the middle value.
* 1
- 2 :: That is the middle row of the table. Use the counts instead.
- 13 :: That is the position of the median, not its value.
highlight:
- "25 members" :: The count is 25, so the median is at position 13.
- "6 members have 0 pets, 8 have 1 pet, 5 have 2 pets, 4 have 3 pets and 2 have 4 pets" :: Add the counts as a running total: 6, then 14, and so on.
- "median number of pets" :: The answer is a number of pets, not a position.
explain:
There are 25 members, so the median is at position \(\frac{25 + 1}{2} = 13\).

Keep a running total of the frequencies:
- 0 pets: positions 1 to 6
- 1 pet: positions 7 to 14
- 2 pets: positions 15 to 19

Position 13 falls in the group with 1 pet. So the median is 1 pet.

Check: the middle row of the table (2 pets) is the trap, because it ignores how many members are in each row. The number 13 is the position, not the value. The answer is 1.
```

## Medium
```task
bank: m-1182
highlight:
- "the 20 students enrolled in a college class" :: There are 20 students, so the median is the average of the 10th and 11th ages.
- "the correct order of the mean, median, and mode" :: Find all three, then order them.
explain:
Use the frequencies from the table. The ages are 18 (6 students), 19 (5), 20 (4), 21 (2), 22 (1), 23 (1) and 30 (1).

**Mode.** The most common age is 18 (6 students).

**Median.** With 20 values, average the 10th and 11th. Ages 18 fill positions 1 to 6, and ages 19 fill positions 7 to 11. So the 10th and 11th are both 19, and the median is 19.

**Mean.** The total is \(18 \times 6 + 19 \times 5 + 20 \times 4 + 21 \times 2 + 22 + 23 + 30 = 400\). Divide by 20 to get 20.

So mode 18 is less than median 19, which is less than mean 20. The age of 30 pulls the mean up. The answer is A.
```

## Hard
```task
A data set has the value 0 five times, the value 1 nine times, the value 2 four times, and the value 3 exactly \(k\) times, where \(k\) is a positive integer. The median of the data set is 1. What is the greatest possible value of \(k\)?
answer: 9
- 8 :: That works, but a larger \(k\) also works. Check \(k = 9\).
- 10 :: Then the middle values are 1 and 2: median 1.5.
- 14 :: That is the last position of the 1s, not \(k\).
highlight:
- "the value 0 five times, the value 1 nine times, the value 2 four times" :: In order, the 1s fill positions 6 to 14.
- "exactly \(k\) times" :: The count is \(5 + 9 + 4 + k = 18 + k\), and k only adds positions at the end.
- "The median of the data set is 1" :: The middle position or positions must stay inside positions 6 to 14.
explain:
In order, the 0s fill positions 1 to 5 and the 1s fill positions 6 to 14. The 2s fill positions 15 to 18, and the 3s come after.

The count is \(n = 18 + k\). For the median to be 1, the middle position (or both middle positions) must lie in positions 6 to 14.

Try \(k = 9\): \(n = 27\), so the median is position \(\frac{27 + 1}{2} = 14\). That is a 1. It works.

Try \(k = 10\): \(n = 28\), so the median is the average of positions 14 and 15, which is \(\frac{1 + 2}{2} = 1.5\). It does not work.

Larger \(k\) pushes the middle even further right, so none works either. The greatest possible value of \(k\) is 9.
```

# Histograms
Bar height is how many values fall in that bin.

```visual
one-var-data--histogram
```

## Key ideas
A **histogram** groups values into **bins**, which are ranges such as 20 to 29. The height of a bar is the **count**: how many values lie in that bin. Add the heights to get \(n\).

A histogram shows how many values are in each bin, not the exact values. So you can find the **bin** that holds the median, but not the median itself.

To find the median bin, work out the median position \(\frac{n + 1}{2}\) (or the two middle positions), then add the bar heights from the left until you pass it. The tallest bar is the **modal bin**, and it may not hold the median.

For an estimated mean or range, use the bin edges. The least possible mean uses every bin's lowest value. The greatest possible mean uses every bin's highest value. The SAT states the bin edges, so check them.

```example
The histogram shows how many minutes 20 students studied. The bars are 2, 5, 8, 4 and 1 tall. Which bin holds the median? How many studied 20 to 29 minutes?
1. The 20 to 29 bar is 8 tall :: Read the height.
2. Total: \(2 + 5 + 8 + 4 + 1 = 20\) :: Add every bar.
3. Median: 10th and 11th values :: The running totals are 2, 7, 15.
4. 8 students. The median is in 20 to 29. :: Positions 8 to 15 are in that bin.
```

```theory
A **bin** is a range of values. In a histogram the bins touch each other, and each bar's height is a count. It looks like a bar graph, but a bar graph has one bar per value, while a histogram has one bar per range.

Because a histogram hides the exact values, many answers are about **possible** values. If the median lies in the 10 to 19 bin, then the median could be any number from 10 to 19, but it cannot be 25.

**The mean from a histogram.** Pick a value in each bin, multiply by the bar height, add, and divide by \(n\). The exact mean is not known. Using each bin's lowest value gives the least possible mean. Using each bin's highest value gives the greatest possible one. Using the bin midpoints gives a good estimate in between.

**Adding a value.** If an extra value larger than all the others is added to the data in a histogram, the mean must rise. The median may or may not change, because the old middle values could be equal.

Two warnings. A tall bar is not a high value: it just means many values in that bin. And two histograms with the same shape can sit at different places on the number line.

Traps:
- Treating bar height as the value itself.
- Taking the middle bar (the one in the middle of the picture) as the median bin. Use the counts.
- Forgetting to add every bar before halving.
```

## Easy
```task
A histogram shows 30 customer wait times, in minutes. The bins and bar heights are 0 to 9 minutes, 7; 10 to 19 minutes, 4; 20 to 29 minutes, 9; and 30 to 39 minutes, 10. Which bin contains the median wait time?
- 0 to 9 minutes :: That bin holds only the 7 shortest waits.
- 10 to 19 minutes :: Running total there is 11, short of the 15th value.
* 20 to 29 minutes
- 30 to 39 minutes :: That is the tallest bar, not the middle value.
highlight:
- "30 customer wait times" :: With 30 values, the median is between the 15th and 16th values.
- "0 to 9 minutes, 7; 10 to 19 minutes, 4; 20 to 29 minutes, 9" :: Add the bar heights from the left: 7, then 11, then 20.
- "median wait time" :: Find the bin that contains the 15th and 16th values.
explain:
There are 30 values, so the median lies between the 15th and 16th values.

Add the bar heights from the left:
- 0 to 9: 7 values, running total 7
- 10 to 19: 4 values, running total 11
- 20 to 29: 9 values, running total 20

The 15th and 16th values are both inside the third bin, because its running total passes 15 (positions 12 to 20). So the median is in 20 to 29 minutes.

Check: the tallest bar, 30 to 39, is the trap. Its height is a count, and it comes after the middle position. The answer is 20 to 29 minutes.
```

## Medium
```task
bank: m-1291
highlight:
- "the number of employees at each of the 17 restaurants in a town" :: There are 17 values, so the median is the 9th.
- "could be the median number of employees" :: Find the bin that holds the 9th value. The median can be any value in it.
explain:
There are 17 restaurants, so the median is the 9th value.

The table groups restaurants by number of employees. Add the counts from the first group:
- 2 to 7 employees: 2 restaurants, running total 2
- 8 to 13: 4 restaurants, running total 6
- 14 to 19: 2 restaurants, running total 8
- 20 to 25: 7 restaurants, running total 15

The 9th value is inside the 20 to 25 group (positions 9 to 15). So the median is a number from 20 to 25.

Only 21 lies in that range. The other choices fall in other groups. The answer is D, 21.
```

## Hard
```task
A histogram of 40 whole-number values has these bins and bar heights: 0 to 9, 8 values; 10 to 19, 12 values; 20 to 29, 14 values; and 30 to 39, 6 values. What is the least possible value of the mean of the data?
answer: 14.5
- 23.5 :: That is the greatest possible mean, using each bin's highest value.
- 19 :: That uses the middle of each bin, not the lowest values.
- 15 :: You averaged the four lowest values. Weight each by its count.
highlight:
- "40 whole-number values" :: Divide the total by 40 at the end.
- "0 to 9, 8 values; 10 to 19, 12 values; 20 to 29, 14 values; and 30 to 39, 6 values" :: Each count is a weight. Use the lowest value of each bin.
- "least possible value of the mean" :: The smallest total comes from the lowest value in every bin.
explain:
The mean is smallest when every value is as low as its bin allows. So use each bin's lowest value: 0, 10, 20 and 30. Weight each by its count:

\[\frac{0 \times 8 + 10 \times 12 + 20 \times 14 + 30 \times 6}{40}\]

The total is \(0 + 120 + 280 + 180 = 580\), so the least possible mean is

\[\frac{580}{40} = 14.5\]

Check: the greatest possible mean uses the highest values (9, 19, 29, 39) and gives 23.5. The bin midpoints give 19. The plain average of the four lowest values (15) ignores the counts. The answer is 14.5.
```

# Dot and box plots
Read the numbers, then range, median and IQR.

```visual
one-var-data--read-plots
```

## Key ideas
A **dot plot** has one dot for each value, so you can count dots to find the median and the range. A **box plot** shows five numbers: the minimum, \(Q_1\), the median, \(Q_3\) and the maximum. \(Q_1\) is the median of the lower half and \(Q_3\) the median of the upper half, so each quarter of the data lies between two neighboring marks.

\[\text{range} = \text{max} - \text{min} \qquad \text{IQR} = Q_3 - Q_1\]

The **interquartile range (IQR)** is the width of the box: how far the middle half of the data spreads. The range uses the two extreme values, so an outlier changes it a lot, but an outlier barely moves the IQR.

A box plot cannot show the mean, the count or any single value, so statements about those cannot be proved from it.

```example
The dot plot and the box plot show the same 11 values. Find the median, the range and the IQR.
1. Median: the 6th dot is 5 :: Five dots on each side.
2. Range: \(9 - 1 = 8\) :: Largest minus smallest.
3. IQR: \(7 - 2 = 5\) :: \(Q_3\) minus \(Q_1\).
4. Median 5, range 8, IQR 5 :: Read each from the plot.
```

```theory
To read a box plot, find the five marks on the number line: the left whisker end (minimum), the left edge of the box (\(Q_1\)), the line inside the box (median), the right edge of the box (\(Q_3\)) and the right whisker end (maximum). The line need not sit in the center of the box. If it sits near the left edge, the data in the lower middle quarter are packed tightly.

Each of the four sections (min to \(Q_1\), \(Q_1\) to median, median to \(Q_3\), \(Q_3\) to max) holds about a quarter of the data. A long whisker is not many values. It is just a wide spread within a quarter of the data. With 72 values, about 18 lie in each section.

**Range vs IQR.** The range depends on two values only, the largest and the smallest. If the single largest value changes, the range changes. The IQR depends on the middle half, so it often stays the same when only the largest value changes. In 3, 5, 8, 9, 12, 14, 15, 17, 40, \(Q_1 = 6.5\) and \(Q_3 = 16\). If 40 becomes 25, the range falls from 37 to 22, but \(Q_3\) is still 16, so the IQR is 9.5 both times.

**Comparing plots.** Compare the median lines for the typical value, the box widths for spread and the whisker ends for the extremes. The plots do not show means, so a "mean" answer choice from a box plot is usually the wrong one.

Dot plots, unlike box plots, show every value. You can find the mean from them: multiply each value by its number of dots.

Traps:
- Mixing up the IQR (box width) and the range (the whole plot).
- Reading the median line as the mean.
- Thinking the longer half of a box holds more data. Each half holds the same share.
```

## Easy
```task
A box plot shows a minimum of 14, \(Q_1\) of 21, a median of 27, \(Q_3\) of 33 and a maximum of 52. What is the range of the data?
answer: 38
- 12 :: That is the IQR, \(Q_3 - Q_1\). The range uses the two ends.
- 27 :: That is the median. Range is largest minus smallest.
highlight:
- "minimum of 14" :: The smallest value is 14.
- "a maximum of 52" :: The largest value is 52.
- "range of the data" :: Range is the largest value minus the smallest.
explain:
The range is the largest value minus the smallest value. The box plot gives both ends: the minimum is 14 and the maximum is 52.

\[\text{range} = 52 - 14 = 38\]

The other numbers (\(Q_1\), the median and \(Q_3\)) are for other questions. Subtracting \(Q_3 - Q_1 = 33 - 21 = 12\) gives the IQR, not the range, and the median 27 is only the middle of the data. The range uses the two ends of the plot. The answer is 38.
```

## Medium
```task
bank: m-1171
highlight:
- "The box plots summarize the masses, in kilograms, of two groups of gazelles" :: Two box plots: compare the lines, the boxes and the ends.
- "which of the following statements must be true" :: Use only what a box plot shows: it does not show the mean.
explain:
Read each statement against what a box plot can show. The line inside each box is the median. Group 1's median line is at 25 kg and group 2's is at 24 kg, so group 1 has the greater median.

A box plot does not show the mean. A mean could be above or below the median, so the two statements about the mean (choices A and B) cannot be known from the plot.

That leaves the two median statements. Group 1's median is greater than group 2's, so choice C is true and choice D is false.

The answer is C: the median mass of group 1 is greater than the median mass of group 2.
```

## Hard
```task
Data set M: 4, 6, 7, 9, 10, 12, 13, 15, 30
Data set N has the same values as M, except that the 30 is replaced with 20. Which of the following is true?
- The range and the IQR both decrease. :: The IQR stays 7.5, because \(Q_3\) stays the same.
* The range decreases, and the IQR stays the same.
- The range stays the same, and the IQR decreases. :: The largest value changed, so the range changes.
- The range and the IQR both stay the same. :: The 30 became 20, so the range changes.
highlight:
- "4, 6, 7, 9, 10, 12, 13, 15, 30" :: Nine values: the median is the 5th, and the halves are four values each.
- "the 30 is replaced with 20" :: Only the largest value changes. Check what the range and \(Q_3\) do.
explain:
Find the median, \(Q_1\) and \(Q_3\) for each set. M has 9 values, so the median is the 5th value (10). The lower half is 4, 6, 7, 9, so \(Q_1 = \frac{6 + 7}{2} = 6.5\). The upper half is 12, 13, 15, 30, so \(Q_3 = \frac{13 + 15}{2} = 14\).

For M: range \(= 30 - 4 = 26\), and IQR \(= 14 - 6.5 = 7.5\).

For N: replace 30 with 20. The median and the lower half are the same. The upper half is 12, 13, 15, 20, so \(Q_3 = \frac{13 + 15}{2} = 14\) again.

For N: range \(= 20 - 4 = 16\), and IQR \(= 7.5\).

The range fell from 26 to 16, and the IQR did not change. The answer is the second choice.
```

# Totals and new values
Mean times count gives the total.

```visual
one-var-data--totals
```

## Key ideas
The mean tells you the **total**, even when you do not know the numbers:

\[\text{sum} = \text{mean} \times \text{count}\]

When a value is added, removed or missing, work with totals. Find the old total, change it, then divide by the new count. A mean of 10 for 4 numbers means a total of 40. Remove a 16 and the total is 24 for 3 numbers, so the new mean is 8.

For a missing value, take the total from the mean and subtract the known values. A new value above the old mean raises the mean. One below it lowers the mean.

If the question also gives the median or the range, sort the values and use the positions. The median of 7 sorted values is the 4th one, and the range is the largest value minus the smallest.

```example
The mean of 4 numbers is 10. One of them, 16, is removed. What is the new mean?
1. Total: \(4 \times 10 = 40\) :: Mean times count.
2. New total: \(40 - 16 = 24\) :: Take out the 16.
3. New mean: \(\frac{24}{3} = 8\) :: Three numbers are left.
```

```theory
The mean is defined as sum divided by count, so sum equals mean times count. This is useful whenever the individual values are hidden. "The mean of 6 scores is 13.5" tells you the 6 scores add up to 81.

**Removing a value.** When the mean of 6 numbers is 20 and the mean of the remaining 5 is 17, the totals are 120 and 85. The removed number is \(120 - 85 = 35\). Always subtract the two totals, not the two means.

**Adding a value.** When a sixth test score lifts the mean of 5 scores (mean 70) to 72, the new total is \(6 \times 72 = 432\). The old total was 350. So the new score was \(432 - 350 = 82\). You can also see it as "5 old scores each rise by 2 (total gain 10), and the new score must also reach the new mean of 72", which is \(72 + 10 = 82\).

**Direction.** If removing a value lowers the mean, the removed value was above the old mean. If adding a value lowers the mean, the new value is below the old mean.

**With a median and a range.** For a sorted list of 7 values, the median is the 4th value and the range is the largest minus the smallest. The mean gives the total. Together these facts give equations you can solve one unknown at a time.

Traps:
- Subtracting the two means instead of the two totals.
- Dividing by the old count after removing a value.
- Assuming the new value equals the change in the mean.
```

## Easy
```task
The mean of five numbers is 12. Four of the numbers are 10, 8, 15 and 11. What is the fifth number?
answer: 16
- 12 :: That is the mean, not the missing number.
- 11 :: That is the mean of the four known numbers. Use the total.
- 44 :: That is the sum of the four. Subtract it from 60.
highlight:
- "mean of five numbers is 12" :: The total is 5 times 12, which is 60.
- "10, 8, 15 and 11" :: These four add up to 44.
- "fifth number" :: The missing number is the total minus the known sum.
explain:
Turn the mean into a total. Five numbers with a mean of 12 add up to

\[5 \times 12 = 60\]

The four known numbers add up to \(10 + 8 + 15 + 11 = 44\).

The fifth number is what is left:

\[60 - 44 = 16\]

Check: \(\frac{10 + 8 + 15 + 11 + 16}{5} = \frac{60}{5} = 12\), which matches the given mean. A mean of 12 is only possible if the five numbers add up to exactly 60, so the missing number is forced. The answer is 16.
```

## Medium
```task
bank: m-1305
highlight:
- "mean score of 8 players in a basketball game was 14.5 points" :: Total of all 8 scores: 8 times 14.5.
- "the highest individual score is removed" :: Take that score out of the total.
- "the remaining 7 players becomes 12 points" :: Total of the other 7: 7 times 12.
- "What was the highest score" :: Subtract the two totals.
explain:
Turn each mean into a total.

All 8 players: \(8 \times 14.5 = 116\) points.

The 7 remaining players: \(7 \times 12 = 84\) points.

The highest score is the difference between the two totals:

\[116 - 84 = 32\]

Check: the mean fell from 14.5 to 12, which tells us the removed score was well above the old mean, and 32 is. Also, the other 7 scores average 12, so a 32 is a big outlier on the high side. The answer is C, 32.
```

## Hard
```task
bank: m-1559
highlight:
- "the data values are listed in ascending order" :: The 4th of 7 values is the median, so b is the median.
- "the mean is 36, the median is 29, and the range is 72" :: Mean gives the total 252. Median gives b = 29. Range gives c minus a.
- "What is the value of c" :: Build two equations in a and c, then solve.
explain:
There are 7 values in ascending order, so the median is the 4th value. The median is 29, so \(b = 29\).

The mean is 36, so the total is \(7 \times 36 = 252\):

\[a + 26 + 29 + 29 + 31 + 47 + c = 252, \quad\text{so}\quad a + c = 90\]

The range is the largest minus the smallest, so \(c - a = 72\).

Add the two equations:

\[(a + c) + (c - a) = 90 + 72, \quad 2c = 162, \quad c = 81\]

Check: \(a = 90 - 81 = 9\), and the list 9, 26, 29, 29, 31, 47, 81 has a mean of 36 and a range of 72. The answer is C, 81.
```

# Trap: averaging averages
Different group sizes? Weigh each mean by its count.

```visual
one-var-data--weighted
```

## Key ideas
The mean of two group means is not the mean of everyone, unless the groups are the same size. Bigger groups count more. This is a **weighted mean**:

\[\text{combined mean} = \frac{n_1 m_1 + n_2 m_2}{n_1 + n_2}\]

Here \(n_1\) and \(n_2\) are the group sizes and \(m_1\) and \(m_2\) are their means. In words: turn each mean into a total (mean times count), add the totals, then divide by all the people.

The combined mean always lies between the two group means, **closer to the bigger group's mean**.

```example
Class A: 20 students, mean score 70. Class B: 10 students, mean score 85. Find the mean of all 30.
1. \(20 \times 70 = 1400\) and \(10 \times 85 = 850\) :: Each total is mean times count.
2. \(\frac{1400 + 850}{30} = 75\) :: All points divided by all students.
3. Mean = 75, not 77.5 :: The bigger class counts more.
```

```theory
The number 77.5 is the plain average of 70 and 85. It treats both classes as equal in size. But Class A has twice as many students, so its mean must count twice as much. That is why the true mean, 75, sits closer to 70. The distance from 70 to 75 is 5, and from 75 to 85 is 10, in the ratio 1 to 2, the reverse of the class sizes.

This "balance" idea runs backward too. Suppose group P has a mean of 30, group Q a mean of 70, and the combined mean is 40. The combined mean is 10 above P and 30 below Q. The balance point is closer to the bigger group, so P has three times as many values as Q. Algebra confirms it: \(30p + 70q = 40(p + q)\) gives \(30q = 10p\), so \(p = 3q\).

The same formula covers three or more groups: add every mean times its size, then divide by all the members.

The SAT also uses the weighted idea for percents and rates, such as the average speed of a trip with different parts or a mixture of two solutions. The key is always to **weight by the amount**, not to average the labels.

Another form is "a table of values with counts", which is a weighted mean as well. See the frequency-table part for that version.

Traps:
- Adding the means and dividing by 2.
- Using the weights the wrong way round (multiplying each mean by the other group's size).
- Dividing the total by the number of groups rather than the number of values.
```

## Easy
```task
A coach recorded the mean sprint times of two groups. The 5 runners in group A had a mean time of 12 seconds. The 15 runners in group B had a mean time of 16 seconds. What was the mean time, in seconds, of all 20 runners?
answer: 15
- 14 :: That is the plain average of 12 and 16. Weight by size.
- 13 :: You swapped the weights. Group B is larger, so it counts more.
- 28 :: You added the two means. Divide the total time by all runners.
highlight:
- "5 runners in group A had a mean time of 12 seconds" :: Group A's total time: 5 times 12.
- "15 runners in group B had a mean time of 16 seconds" :: Group B's total time: 15 times 16.
- "all 20 runners" :: Divide the combined total by 20.
explain:
Turn each mean into a total time, then combine.

Group A: \(5 \times 12 = 60\) seconds.

Group B: \(15 \times 16 = 240\) seconds.

All 20 runners: the total is \(60 + 240 = 300\) seconds, so the mean is

\[\frac{300}{20} = 15\]

Check: the answer must lie between 12 and 16 and be closer to 16, because group B has three times as many runners. 15 does that. The plain average, 14, ignores the group sizes. The answer is 15.
```

## Medium
```task
bank: m-1535
highlight:
- "the mean length of the 240 gray seals from Muskeget Island was 88 inches" :: First total: 240 times 88.
- "the mean length of the 120 gray seals from Sable Island was 94 inches" :: Second total: 120 times 94.
- "mean length of all 360 gray seals" :: Add the totals and divide by 360, not by 2.
explain:
Use a weighted mean. Turn each group's mean into a total length:

\[240 \times 88 = 21120 \qquad 120 \times 94 = 11280\]

Add the totals and divide by all 360 seals:

\[\frac{21120 + 11280}{360} = \frac{32400}{360} = 90\]

Check: there are twice as many Muskeget seals, so the answer must be closer to 88 than to 94. 90 is. Choice C (91) is the plain average of 88 and 94, which treats both islands as the same size. The answer is B, 90 inches.
```

## Hard
```task
Group P has a mean of 50. Group Q has a mean of 80. When the two groups are combined, the mean is 70. How many times as many values are in group Q as in group P?
answer: 2
- 1/2 :: You flipped it. The mean is nearer Q, so Q is bigger.
- 1 :: Equal groups would give a combined mean of 65, not 70.
highlight:
- "mean of 50" :: Group P's mean. Its total is 50 times its count.
- "mean of 80" :: Group Q's mean. Its total is 80 times its count.
- "the mean is 70" :: The combined total is 70 times the combined count.
- "How many times as many values are in group Q as in group P" :: Find the ratio of the counts.
explain:
Let group P have \(p\) values and group Q have \(q\) values. The combined total is the sum of the two group totals, and it also equals 70 times the combined count:

\[50p + 80q = 70(p + q)\]

Expand: \(50p + 80q = 70p + 70q\). Collect terms: \(10q = 20p\). So \(q = 2p\).

Group Q has 2 times as many values as group P.

Check with numbers: let \(p = 10\) and \(q = 20\). The total is \(500 + 1600 = 2100\) for 30 values, and \(\frac{2100}{30} = 70\). The balance view agrees: 70 is 20 above 50 and 10 below 80, so the group at 80 carries twice the weight. The answer is 2.
```

# Standard deviation
Spread: how far values sit from the mean.

```visual
one-var-data--sd
```

## Key ideas
The **standard deviation (SD)** measures spread: the typical distance of the values from the mean. Values farther from the mean mean a larger SD. You do **not** calculate it on the SAT. You compare data sets.

To compare, find each mean and list how far each value is from it. The set with more values far from the mean has the larger SD.

Key facts:
- SD depends on **spread**, not on how big the numbers are. 100, 101, 102, 103 and 5, 6, 7, 8 have the same SD.
- Adding the same number to every value does **not** change the SD.
- Multiplying every value by a positive number \(k\) multiplies the SD by \(k\).
- If all values are equal, the SD is 0.
- A far-away outlier increases the SD (and the range).

```example
Set A: 4, 5, 5, 5, 6. Set B: 1, 3, 5, 7, 9. Both means are 5. Which set has the larger SD?
1. A: distances 1, 0, 0, 0, 1 :: How far each value sits from 5.
2. B: distances 4, 2, 0, 2, 4 :: B's values sit farther out.
3. B has the larger SD. :: More distance from the mean.
```

```theory
**Why not just the range?** The range uses only the two extreme values. Two sets can have the same range and different SDs, because SD uses every value. P: 10, 20, 20, 20, 30 and Q: 10, 10, 20, 30, 30 both have range 20 and mean 20. In P, three values sit on the mean. In Q, four values sit 10 away. So Q has the larger SD.

**Shifting and scaling.** Moving every value up by 20 (such as 1, 2, 3 becoming 21, 22, 23) keeps every distance the same, so the SD is unchanged. Doubling every value doubles every distance, so the SD doubles. This is the key to dot-plot comparison questions: the same shape in a different place means the same SD.

**Changing some values.** If 24 in 18, 20, 21, 22, 24 is changed to 60, the new value is far from the mean, so the SD grows (and so does the range). If instead you move several values closer to the mean, the SD shrinks.

**On a calculator.** Desmos has two spread functions. The standard one, \(\operatorname{stdev}\), divides by \(n - 1\) (sample SD), while \(\operatorname{stdevp}\) divides by \(n\) (population SD). They give different numbers for the same list, but for lists of the same size they always put sets in the same order. The SAT only asks you to compare, so the choice never changes the answer. Do not trust a decimal from a textbook unless you know which formula it uses.

**Variability words.** "Greater variability around the mean" and "more spread out" both mean a larger SD.

Traps:
- Thinking a larger mean means a larger SD.
- Judging by the range alone.
- Believing a shifted copy of a data set has a different SD.
```

## Easy
```task
bank: m-1253
highlight:
- "Which of the following lists" :: Four lists. Compare how far each is from its own mean.
- "smallest standard deviation" :: The least spread: most values sit close to the mean.
explain:
All four lists add to 270, so each has a mean of 54. Compare how far the values sit from 54:

- A: 51, 52, 54, 56, 57 gives distances 3, 2, 0, 2, 3
- B: 52, 52, 54, 56, 56 gives distances 2, 2, 0, 2, 2
- C: 52, 53, 54, 55, 56 gives distances 2, 1, 0, 1, 2
- D: 53, 54, 54, 54, 55 gives distances 1, 0, 0, 0, 1

List D has three values on the mean and two only 1 away, so it is the least spread out. Choice C looks tidy because it is evenly spaced, but its values are up to 2 away.

The answer is D.
```

## Medium
```task
bank: m-1330
highlight:
- "Each of the dot plots shown represents the number of glue sticks" :: Two dot plots with the same pattern of dots.
- "standard deviations" :: SD measures spread, not the position on the number line.
explain:
Compare the shapes of the two dot plots. Class A has dots at 1 to 7 with heights 1, 1, 3, 4, 5, 6, 7. Class B has dots at 14 to 20 with exactly the same heights, 1, 1, 3, 4, 5, 6, 7.

Class B is Class A shifted 13 units to the right. Adding the same number to every value moves the mean by the same amount and leaves every distance from the mean unchanged. So the spread is the same.

The standard deviations are equal. The numbers in class B are larger, but the standard deviation does not depend on how large the numbers are, only on how spread out they are.

The answer is B.
```

## Hard
```task
bank: m-1242
highlight:
- "adding 7 to each number in the original data set that is greater than the median" :: Values above the median move up by 7.
- "subtracting 7 from each number in the original data set that is less than the median" :: Values below the median move down by 7.
- "does NOT have the same value in both" :: Check each measure: median, mean, sum and standard deviation.
explain:
The set has 27 different numbers, so the median is the 14th value. It is neither above nor below the median, so it does not change. The median stays 33.

Thirteen numbers are greater than the median and go up by 7. Thirteen are less than the median and go down by 7. The total change is \(13 \times 7 - 13 \times 7 = 0\). So the sum stays the same, and the mean (sum divided by 27) stays 33.

The standard deviation is different. Every number except the median moves **7 farther** from the center. All distances from the mean grow, so the spread grows.

Median, mean and sum are unchanged. Only the standard deviation increases. The answer is D.
```
