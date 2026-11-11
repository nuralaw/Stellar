---
title: One-variable data
skill: one-var-data
domain: problem-solving
section: math
summary: Find and compare mean, median, range and standard deviation in lists, tables and plots, and predict how changing the data moves them.
minutes: 22
---

## What this question looks like

You get one set of numbers (a **data set**) and questions about its center or its spread. The data can be a plain list, a frequency table, a dot plot, a histogram or a box plot. Often there are two data sets side by side and you have to compare them.

Typical question stems:

- "What is the median of the data shown?"
- "Which choice correctly compares the medians and the ranges of the two data sets?"
- "How does the standard deviation of data set A compare with that of data set B?"
- "A new value is added to the data set. Which of the following must be true?"
- "The mean of 8 scores is 81. ... What was the score that was removed?"
- "Which of the following could be the mean of the data in the histogram?"

How often: Problem-Solving and Data Analysis is about 15% of the Math section (5 to 7 of the 44 questions), and one-variable data is usually 1 to 3 of those, about 2 on average. They range from very easy (the median of a short list) to some of the hardest questions on the test.

The sub-types: finding a center or a spread; using totals (mean × count = total); predicting what happens when values are added, removed, shifted or scaled; comparing two data sets, often without calculating; and reading box plots or histograms whose bars cover intervals.

## The method

1. Underline the measure the question asks for: mean, median, range or standard deviation. Many wrong choices are the correct answer for a different measure.
2. Find n, the number of values. In a frequency table or dot plot, add up the frequencies (the counts), not the values.
3. For a median, find the position first: (n + 1)/2. If n is even, average the two values in the middle positions. Then count down the table to the value in that position.
4. For a mean, think in totals: total = mean × count. In a frequency table, the total is the sum of value × frequency.
5. For "what happens if..." questions, don't recompute everything. Ask: did every value shift by the same amount? Is the new value above or below the mean? Does the middle position land on a different value?
6. For standard deviation, find each data set's center and ask: which set has more of its values far from its own center? Ignore where the data sits on the number line.
7. Before you choose, check the exact wording: "must be true" needs a statement that is true in every possible case; "could be true" needs just one case.

## Rules and formulas you need

### Center: mean, median, mode

- **Mean** (average) = sum of the values ÷ number of values. Turned around: **total = mean × count**.
- **Median** = the middle value after you sort the data from least to greatest. Odd n: the value in position (n + 1)/2. Even n: the average of the values in positions n/2 and n/2 + 1.
- **Mode** = the value that appears most often. It is rarely tested.
- The median depends only on the order of the values, so one extreme value barely moves it. The mean uses every value, so one extreme value (an **outlier**) pulls the mean toward it.

> **Key idea:** If the mean is greater than the median, a few large values (a long tail on the right) are pulling the mean up. If the mean is less than the median, a few small values are pulling it down. If the data is symmetric, the mean equals the median.

### Spread: range, IQR, standard deviation

- **Range** = greatest value − least value. It uses only two values, so one outlier can make it large.
- **Interquartile range (IQR)** = Q3 − Q1. The first quartile, Q1, has about 25% of the data below it; the third quartile, Q3, has about 75% below it. So the IQR is the spread of the middle half of the data.
- **Standard deviation (SD)** measures how far the values typically are from the mean. You never calculate it on the SAT; you only compare it.
- More values far from the mean means a larger SD. More values bunched near the mean means a smaller SD.
- The same shape in a different place has the same SD, because moving the whole data set doesn't change any distance from the mean.
- Two data sets can have the same range and very different SDs: the range ignores everything between the two ends.

### Frequency tables and dot plots

- A frequency table lists each value and how many times it appears (its **frequency**). A dot plot shows the same thing with stacked dots, one dot per value.
- n = the sum of the frequencies.
- Mean = (sum of value × frequency) ÷ (sum of the frequencies).
- Median: keep a running total of the frequencies as you go down the table, and stop at the row that contains the middle position.

### Histograms with intervals

- Each bar covers an interval of values (like 20 to 29), and its height is how many values fall in that interval. You don't know the exact values.
- The median lies in the interval that contains the middle position.
- Smallest possible mean: pretend every value sits at the bottom of its interval. Greatest possible mean: pretend every value sits at the top. The real mean is somewhere between the two.
- Check the edges. If the values are whole numbers from 20 to 29, the top value is 29, not 30.

### Box plots

- A box plot shows five numbers: minimum, Q1, median, Q3 and maximum. The line inside the box is the median, never the mean.
- Each of the four parts (left whisker, left half of the box, right half of the box, right whisker) holds about 25% of the values, however long or short it looks. The box holds the middle 50%.
- A box plot doesn't show the mean, and it doesn't show how many values there are.

### What happens when the data changes

| Change to the data | Mean | Median | Range | SD |
|---|---|---|---|---|
| Add the same number k to every value | up by k | up by k | no change | no change |
| Multiply every value by the same positive number k | × k | × k | × k | × k |
| Add a new value greater than every other value | goes up | goes up or stays | goes up | goes up if the new value is far out |
| Add a new value less than every other value | goes down | goes down or stays | goes up | goes up if the new value is far out |
| Add a new value equal to the mean | no change | may change | no change | goes down |
| Remove a high outlier | goes down | goes down a little or stays | goes down | goes down |

> **Trap:** You can't just average two averages. If 20 students have a mean score of 70 and 30 students have a mean score of 80, the mean of all 50 students is (20 × 70 + 30 × 80) ÷ 50 = 3,800 ÷ 50 = 76, not 75. The bigger group pulls the overall mean toward its own mean.

## Worked examples

### Example 1: Median from a frequency table

The table shows the number of siblings of each of the 27 students in a class.

| Number of siblings | Number of students |
|---|---|
| 0 | 4 |
| 1 | 9 |
| 2 | 6 |
| 3 | 4 |
| 4 | 3 |
| 5 | 1 |

What is the median number of siblings for these 27 students?

- (A) 1
- (B) 2
- (C) 2.5
- (D) 14

**Solution.** There are 27 values, so the median is the value in position (27 + 1)/2 = 14. Count down the table with a running total: the 0s fill positions 1 to 4, the 1s fill positions 5 to 13, and the 2s fill positions 14 to 19. Position 14 holds a 2, so the median is 2. Choice (D) is the position of the median, not its value. Choice (A) is the mode, the most common value. Choice (C) is the middle of the first column (0 to 5), but that column only lists the possible values; the 27 data values are not spread evenly over it.

**Answer:** (B)

### Example 2: Using totals to find a removed value

The mean of Lena's 8 quiz scores is 81. After her lowest score is dropped, the mean of her other 7 scores is 84. What was Lena's lowest score?

*Student-produced response: enter your answer.*

**Solution.** Work with totals, not with means. The 8 scores add up to 8 × 81 = 648. The 7 remaining scores add up to 7 × 84 = 588. The dropped score is the difference: 648 − 588 = 60. Quick check with a balance idea: the other 7 scores average 3 points above 81, which is 7 × 3 = 21 points above in total, so the dropped score must sit 21 points below 81, and 81 − 21 = 60. A guess like 81 − 3 = 78 forgets that the 3 points are spread over 7 scores.

**Answer:** 60

### Example 3: Adding a value smaller than all the others

The table shows how many books each of the 15 members of a reading club read last month.

| Books read | Number of members |
|---|---|
| 3 | 2 |
| 4 | 3 |
| 5 | 5 |
| 6 | 3 |
| 7 | 2 |

A new member who read 1 book last month joins the club. Which of the following correctly compares the mean and the median of the 16 values with the mean and the median of the original 15 values?

- (A) The mean and the median both decrease.
- (B) The mean decreases, and the median stays the same.
- (C) The mean stays the same, and the median decreases.
- (D) The mean and the median both stay the same.

**Solution.** Mean: the new value, 1, is less than every value in the table, so it pulls the mean down. (Exactly: the old total is 3 × 2 + 4 × 3 + 5 × 5 + 6 × 3 + 7 × 2 = 75, so the old mean is 75 ÷ 15 = 5, and the new mean is 76 ÷ 16 = 4.75.)

Median: with 15 values, the median is the 8th value. The 3s fill positions 1 to 2, the 4s fill 3 to 5 and the 5s fill 6 to 10, so the old median is 5. With 16 values, the median is the average of the 8th and 9th values. The new 1 takes position 1 and pushes everything else down one place: the 3s now fill 2 to 3, the 4s fill 4 to 6 and the 5s fill 7 to 11. The 8th and 9th values are both 5, so the median is still 5. Choice (A) assumes the median moves like the mean. Choices (C) and (D) miss that a new value that isn't equal to the mean always moves the mean.

**Answer:** (B)

### Example 4: Comparing standard deviations without calculating

The table shows the quiz scores, out of 10, of the 16 students in each of two classes, P and Q.

| Score | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|
| Class P | 1 | 2 | 10 | 2 | 1 |
| Class Q | 5 | 2 | 2 | 2 | 5 |

Which of the following correctly compares the means and the standard deviations of the scores in the two classes?

- (A) The means are equal, and the standard deviation for class P is less than the standard deviation for class Q.
- (B) The means are equal, and the standard deviations are equal.
- (C) The mean for class P is greater than the mean for class Q, and the standard deviation for class P is less than the standard deviation for class Q.
- (D) The means are equal, and the standard deviation for class P is greater than the standard deviation for class Q.

**Solution.** Means: both rows are symmetric around 6 (the counts on the left of 6 mirror the counts on the right), so both means are 6. Spread: in class P, 10 of the 16 scores are exactly 6, right at the mean. In class Q, 10 of the 16 scores are 4 or 8, as far from the mean as the scores go. More values far from the mean means a larger standard deviation, so class Q's is larger and class P's is smaller. Choice (B) is the "same range" trap: both ranges are 8 − 4 = 4, but the range only looks at the two ends. Choice (D) reads the tall column at 6 as "more spread". Choice (C) is wrong because the means are equal. (Proof in Desmos: `stdev` gives about 0.89 for class P and 1.71 for class Q.)

**Answer:** (A)

### Example 5: What a box plot can and can't tell you

Two box plots summarize the number of text messages sent in one day by each student in group A and in group B. The five numbers shown by each box plot are listed in the table.

| Group | Minimum | Q1 | Median | Q3 | Maximum |
|---|---|---|---|---|---|
| A | 12 | 20 | 26 | 31 | 45 |
| B | 15 | 18 | 22 | 34 | 38 |

Which of the following statements must be true?

- (A) The mean number of messages for group A is greater than the mean number of messages for group B.
- (B) In group A, more students sent between 31 and 45 messages than between 26 and 31 messages.
- (C) About 75% of the students in group B sent 34 messages or fewer.
- (D) The interquartile range for group A is greater than the interquartile range for group B.

**Solution.** Check each statement against what a box plot really shows. (C): Q3 = 34 means about three quarters of the values are at or below 34, so (C) must be true. (A): a box plot shows medians, not means. Group A's median is greater, but the means could be in either order. (B): the part from 31 to 45 is long, but each of the four parts holds about 25% of the values whatever its length, so there's no reason for more students there. (D): the IQRs are 31 − 20 = 11 for group A and 34 − 18 = 16 for group B, so group A's is smaller.

**Answer:** (C)

### Example 6: Possible values from a histogram

A histogram shows the ages, in whole years, of the 20 people at a workshop. The bars cover these age intervals:

| Ages | 10 to 19 | 20 to 29 | 30 to 39 | 40 to 49 |
|---|---|---|---|---|
| Number of people | 2 | 5 | 8 | 5 |

Which of the following could be the mean age of the 20 people?

- (A) 5
- (B) 25
- (C) 31
- (D) 38

**Solution.** You don't know the exact ages, so find the smallest and the greatest possible means. Smallest: put every age at the bottom of its interval: (10 × 2 + 20 × 5 + 30 × 8 + 40 × 5) ÷ 20 = 560 ÷ 20 = 28. Greatest: put every age at the top of its interval. The ages are whole numbers, so the tops are 19, 29, 39 and 49: (19 × 2 + 29 × 5 + 39 × 8 + 49 × 5) ÷ 20 = 740 ÷ 20 = 37. The mean must be from 28 to 37, and only 31 is in that range. Choice (D) uses 20, 30, 40 and 50 as the tops, which gives 760 ÷ 20 = 38, but nobody in the 40-to-49 bar can be 50. Choice (B) averages 10, 20, 30 and 40 without weighting each one by its number of people. Choice (A) is the average of the bar heights, which are counts of people, not ages.

**Answer:** (C)

## Traps to avoid

- **Position instead of value.** (n + 1)/2 tells you where the median is, not what it is. Count to that position and read the value there.
- **The wrong measure.** Choices often include the mean when the question asks for the median, or the range when it asks for the SD. Re-read the last line of the question.
- **Unsorted lists.** The middle of a list is the median only after you sort it.
- **Counting rows instead of values.** In a frequency table, n is the sum of the frequencies, not the number of rows.
- **Same range means same spread.** It doesn't. The range uses two values; the SD uses all of them. A tall middle column means a small SD, even when the ends match.
- **Bigger numbers mean bigger spread.** They don't. Adding 10 to every value leaves the SD the same. Only distances from the center matter.
- **A long part of a box plot holds more values.** It doesn't. Each of the four parts holds about 25% of the data; a long part only means those values are more spread out.
- **Averaging averages.** When groups have different sizes, add the totals and divide by the total count.
- **Must versus could.** One working example is enough for "could be true", but "must be true" has to hold for every data set that fits the display.
- **Histogram edges.** Whole numbers in a "20 to 29" bar can't be 30. Check which end of each interval is included.

## Desmos shortcut

Desmos is fast for long lists and for checking a standard deviation comparison. For a frequency table, counting positions by hand is usually faster for the median, but Desmos can still give you the mean.

- **A plain list:** type `L = [12, 15, 15, 18, 40]` and then `mean(L)`, `median(L)`, `max(L) - min(L)` (the range) or `stdev(L)`. You can also type the numbers straight in: `median([12, 15, 15, 18, 40])`.
- **Comparing spreads:** type each data set as a list, for example `P = [4,5,5,6,6,6,6,6,6,6,6,6,6,7,7,8]` and `Q = [4,4,4,4,4,5,5,6,6,7,7,8,8,8,8,8]` from Example 4, then `stdev(P)` and `stdev(Q)`. The bigger number is the bigger spread. Use the same function for both lists (`stdev` and `stdevp` are two slightly different versions of the SD; either one ranks two lists of the same size the same way).
- **Mean from a frequency table:** type the values as one list and the frequencies as another, `V = [0, 1, 2, 3, 4, 5]` and `F = [4, 9, 6, 4, 3, 1]`, then `total(V*F)/total(F)`. Desmos multiplies the two lists value by value, so this is the sum of value × frequency divided by n. For Example 1 it gives about 1.85.

## Quick checklist

- Which measure does the question ask for: mean, median, range or SD?
- n is the sum of the frequencies, not the number of rows.
- Median: find the position (n + 1)/2 first, then read the value.
- Missing or removed value: total = mean × count.
- Shift every value: the center moves, the spread stays. Scale every value: both change.
- SD: which set has more values far from its own center?
- "Must be true" means true in every possible case.

## Sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — official testing points (data displays, comparing SDs, outliers) and question counts.
- [SAT Practice Test 8 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-8-answers-digital.pdf) — how official explanations handle a value added to a frequency table and SD comparisons.
- [SAT Practice Test 10 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-10-answers-digital.pdf) — smallest and greatest possible means for histograms of whole numbers.
- [Mastering Distributions and Measures of Center and Spread (Test Ninjas)](https://www.test-ninjas.com/sat-distribution-center-spread) — the median position rule and the shift and scale rules.
- [Standard Deviation (1600.io)](https://1600.io/courses/1698988/lectures/53518736) — SD questions as visual comparisons, and when Desmos isn't worth the time.
- [What Is Standard Deviation? An SAT Student's Guide (IvyStrides)](https://www.ivystrides.com/blog/standard-deviation/) — how adding or removing a value changes the SD.
- [Statistics on SAT Math: Strategies for Mean, Median, Mode (PrepScholar)](https://blog.prepscholar.com/statistics-on-sat-math-strategies-for-mean-median-and-mode) — mean × count = total for missing and removed values.
- [Standard Deviation: comparing two data sets on the SAT (Settele Tutoring, YouTube)](https://www.youtube.com/watch?v=Bxa0ooW-F2Q) — reading spread from the shape of dot plots and histograms.
- [All of Problem Solving and Data Analysis on the SAT (James Lu, YouTube)](https://www.youtube.com/watch?v=rytygT3oFO4) — box plot medians, the greatest-possible-mean trick, shift and scale rules.
- [Digital SAT Math: Desmos Lesson #13 Mean and Median (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=oOZeeiLe13g) — Desmos list functions for mean, median and missing numbers.
