---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: Find and compare mean, median, range and spread from lists, tables and plots, and predict how changing the data moves each one.
minutes: 10
---

## What this question looks like

These questions give you one list of numbers (one *variable*) and ask about its center or its spread. The data shows up in a few forms:

- a plain list of values ("the ages of 9 players are…")
- a **frequency table**: one column of values, one column saying how many times each value appears
- a **dot plot**: each dot is one data value stacked above a number line
- a **histogram**: bars that count how many values fall in each interval (like 10–20, 20–30)
- a **box plot**: a box and two "whiskers" that show five key numbers

Typical stems: "What is the median of the data?", "Which statement about the mean and median is true?", "If the value 48 is removed, how do the mean and median change?", "Which data set has the larger standard deviation?" They're rarely hard math. They test whether you know what each measure *does*.

## The method

1. **Name the measure.** Is the question about center (mean, median, mode) or spread (range, standard deviation)? Only work out what's asked.
2. **Check the format.** For a frequency table or dot plot, remember the data is *the values, repeated*, not the numbers in the count column.
3. **Count the total.** Add up the frequencies (or dots). This tells you where the middle is.
4. **For "what changes" questions, don't recalculate everything.** Ask: does the change touch the middle position (median)? Does it change the total (mean)? Does it move values toward or away from the center (spread)?
5. **For standard deviation, look, don't calculate.** Decide which set has more values far from its own center.
6. **Use Desmos for any raw list** longer than about five numbers.

## Rules and formulas you need

| Measure | How to get it | Pulled by an outlier? |
|---|---|---|
| Mean | sum of values ÷ number of values | Yes, a lot |
| Median | middle value after sorting (average the two middle values if the count is even) | Barely or not at all |
| Mode | the value that appears most often | No |
| Range | maximum − minimum | Yes, a lot |
| Standard deviation (SD) | roughly the typical distance from the mean | Yes |
| Interquartile range (IQR) | Q3 − Q1, the width of the middle half | Barely |

**Finding the median position.** With n values in order, the median is value number `(n + 1)/2`. If n = 25, it's the 13th value. If n = 24, it's halfway between the 12th and 13th values.

**Mean from a frequency table.** Multiply each value by its frequency, add those products, then divide by the total frequency: `mean = (sum of value × frequency) ÷ (sum of frequencies)`.

**The "sum" trick.** `sum = mean × count`. Use it whenever a value is added, removed or missing.

**Shifting and scaling every value:**

| You do this to every value | Mean and median | Range and SD |
|---|---|---|
| Add or subtract the same number k | move by k | do not change |
| Multiply by a positive number k | multiplied by k | multiplied by k |

> **Key idea:** Standard deviation measures spread, not size. Adding 10 points to every score slides the whole data set right, but the values stay just as far apart, so the SD is unchanged.

**How changes affect standard deviation:**

- Remove a value far from the mean → SD goes down. Add one far away → SD goes up.
- Add a value equal to the mean → SD goes down slightly (same spread, more values crowding the middle).
- Two sets can have the *same range* but very different SDs. The SD depends on where the bulk of the data sits, not just the two ends.

**Shape:**

- **Symmetric**: mean ≈ median.
- **Skewed right** (long tail toward big values): mean > median.
- **Skewed left** (long tail toward small values): mean < median.

**Reading a box plot.** The five numbers are minimum, Q1, median, Q3 and maximum. Each of the four pieces (whisker, half-box, half-box, whisker) holds about 25% of the data. The line inside the box is the **median, not the mean**. A box plot does not let you find the mean.

**Reading a histogram.** Each bar is an interval, so you usually can't name an exact median or mean. You *can* find which interval holds the median by counting up to the middle position.

## Worked examples

### Example 1: Median from a frequency table

A librarian asked 24 students how many books they read last month. The results are shown.

| Books read | Number of students |
|---|---|
| 0 | 4 |
| 1 | 8 |
| 2 | 5 |
| 3 | 4 |
| 4 | 3 |

What is the median number of books read? (Student-produced response.)

**Solution**

The total is 4 + 8 + 5 + 4 + 3 = 24 students. With an even count, the median is the average of the 12th and 13th values when they're in order.

Count up the rows (a running total):

- value 0 covers students 1–4
- value 1 covers students 5–12
- value 2 covers students 13–17

So the 12th value is 1 and the 13th value is 2. The median is (1 + 2)/2 = 1.5.

The median doesn't have to be a value anyone reported. Classic wrong answers: 2 (the middle row) and 4 (the median of the count column).

**Answer:** 1.5 (also accepted as 3/2)

### Example 2: Removing an outlier

The finishing times, in minutes, of 7 runners are 21, 23, 24, 24, 26, 27 and 48. If the time of 48 minutes is removed, which statement describes how the mean and median change?

- (A) Both the mean and the median decrease.
- (B) The mean decreases, and the median stays the same.
- (C) The mean stays the same, and the median decreases.
- (D) Neither the mean nor the median changes.

**Solution**

*Median.* Before: 7 values, so the 4th value, which is 24. After: 6 values (21, 23, 24, 24, 26, 27), so the average of the 3rd and 4th values: (24 + 24)/2 = 24. The median doesn't change.

*Mean.* Before: the sum is 193, so the mean is 193/7 ≈ 27.6. After: the sum is 145, so the mean is 145/6 ≈ 24.2. The mean drops.

Without numbers: 48 was dragging the mean up, so removing it lets the mean fall, while the middle stays at 24.

(A) is the trap for students who assume "everything goes down." (C) has the two measures swapped. (D) ignores the big drop in the sum.

**Answer:** (B)

### Example 3: Comparing standard deviations

Two classes of 20 students rated a movie from 1 to 5.

| Rating | Class P | Class Q |
|---|---|---|
| 1 | 1 | 6 |
| 2 | 2 | 3 |
| 3 | 14 | 2 |
| 4 | 2 | 3 |
| 5 | 1 | 6 |

Which statement is true?

- (A) The means are equal, and the standard deviation of class P's ratings is greater.
- (B) The means are equal, and the standard deviation of class Q's ratings is greater.
- (C) The mean of class P's ratings is greater, and the standard deviations are equal.
- (D) The mean of class Q's ratings is greater, and the standard deviation of class Q's ratings is greater.

**Solution**

Both tables are perfectly symmetric around 3, so both means are 3. (Check P: 1 + 4 + 42 + 8 + 5 = 60, and 60/20 = 3. Check Q: 6 + 6 + 6 + 12 + 30 = 60, and 60/20 = 3.) That eliminates (C) and (D).

Now spread. In class P, 14 of the 20 ratings sit exactly at the mean. In class Q, 12 of the 20 ratings sit at the extremes, 1 and 5, as far from the mean as possible. Q's values are typically farther from the center, so Q has the larger SD.

Don't be fooled by the range: both classes have a range of 5 − 1 = 4. Same range, very different SD.

**Answer:** (B)

### Example 4: Adding a value

The mean of 8 numbers is 15. When a ninth number is added, the mean of all 9 numbers becomes 16. What is the ninth number? (Student-produced response.)

**Solution**

Use sums, not means. The first 8 numbers add up to 8 × 15 = 120. All 9 numbers add up to 9 × 16 = 144. The new number is 144 − 120 = 24.

Sense check: the new number must be 16 itself plus 1 extra for each of the 8 old numbers: 16 + 8 = 24. Guessing 16 or 17 ("a bit above the mean") is the common mistake.

**Answer:** 24

## Traps to avoid

- **Taking the median of an unsorted list.** Sort first, or let Desmos do it.
- **Using the count column as the data.** In a frequency table, the median and mean are about the *values*, weighted by how often they occur, not about the frequency numbers.
- **Picking the middle row of a frequency table.** The middle row is only the median if the counts happen to balance. Always count positions.
- **Forgetting to average for an even count.** With 24 values the median sits between the 12th and 13th, which may be two different values.
- **Treating range as spread.** Equal ranges can hide very different standard deviations. Look at where most of the data is.
- **Thinking a shift changes the SD.** Adding the same number to every value moves only the center.
- **Calling the box plot's middle line the mean.** It's the median. The mean can't be read from a box plot.

## Desmos shortcut

**A plain list.** Name it with square brackets, then use the built-in functions:

- `L = [21, 23, 24, 24, 26, 27, 48]`
- `mean(L)`, `median(L)`, `stdev(L)`
- `max(L) − min(L)` gives the range.

Order doesn't matter; Desmos sorts for you.

**What-if questions.** Make a second list without the outlier, for example `M = [21, 23, 24, 24, 26, 27]`, and compare `mean(L)` with `mean(M)` side by side. To add a value instead, `join(L, [30])` makes a new list with 30 on the end.

**A frequency table.** Put the values in one list and the counts in another, in the same order:

- `V = [0, 1, 2, 3, 4]`
- `F = [4, 8, 5, 4, 3]`
- Mean: `total(V*F)/total(F)` (Desmos multiplies the lists pair by pair). For Example 1 this gives 1.75.
- Median: `median(repeat(V, F))` expands the table into the full list of 24 values first. This gives 1.5 for Example 1. If your version of Desmos doesn't recognize `repeat`, count positions by hand as in Example 1.

**Standard deviation.** `stdev` and `stdevp` give slightly different numbers (sample vs. population), but they always rank two data sets the same way, so either one works for "which is greater?" questions.

> **Tip:** Don't type a 30-value dot plot into Desmos. Count positions instead. Desmos pays off for lists of about 5–15 numbers or a short frequency table.

## Quick checklist

- Did I identify whether the question asks about center or spread?
- For a table or dot plot, did I add up the frequencies to get the total count?
- Did I find the median *position* (and average two values if the count is even)?
- For changes, did I use sums (`mean × count`) instead of guessing?
- For SD, did I compare how far values are from their *own* mean, not the range?
- Does the display actually show the number the answer choice claims (box plot ≠ mean)?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (skill descriptions)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf)
- [Varsity Tutors: Center, Shape, and Spread of Data (SAT lesson)](https://www.varsitytutors.com/practice/subjects/sat/lessons/center-shape-and-spread-of-data)
- [Test Ninjas: SAT Distribution, Center and Spread](https://test-ninjas.com/sat-distribution-center-spread)
- [Magoosh: SAT Math Standard Deviation](https://magoosh.com/sat/sat-math-standard-deviation/)
- [1600.io: Standard Deviation on the Digital SAT](https://1600.io/courses/1698988/lectures/53518736)
- [Desmos workshop deck for the SAT: lists, frequency tables and regression](https://s3.us-east-2.amazonaws.com/hpt-crm-public/workshops/web/decks/12-desmos-2/index.html)
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/)
- [Desmos Help Center: Lists](https://help.desmos.com/hc/en-us/articles/4407889068557-Lists)
- [Desmos Community: building a list from values and frequencies](https://cl.desmos.com/t/attempting-to-create-a-new-list-from-a-list-of-values-and-frequencies/3876)
- [JustLockedIn: One-Variable Data question patterns](https://justlockedin-main.pages.dev/patterns/math/problem-solving-and-data-analysis/one-variable-data:-distributions-and-measures-of-center-and-spread/)
- [Quiz-Tree: SAT One-Variable Data](https://www.quiz-tree.com/sat-problem-solving-and-data-analysis/topic/one-variable-data)
- [MathChops: A Five-Minute DSAT Desmos Intro](https://mathchops.substack.com/p/a-five-minute-dsat-desmos-intro)
