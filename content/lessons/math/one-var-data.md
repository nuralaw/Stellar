---
title: One-Variable Data
skill: one-var-data
domain: problem-solving
section: math
summary: Find and compare mean, median, range and spread from lists, tables and plots, and predict how changing the data moves each one.
minutes: 12
---

> **Key idea:** These questions test what each measure does, not hard math. Outliers drag the mean, the median only cares about the middle position, and standard deviation measures spread, not size.

## What this question looks like

You get one list of numbers (one *variable*) and are asked about its center or its spread. The data comes in a few forms:

- a plain list of values ("the ages of 9 players are…")
- a **frequency table**: one column of values, one column of how many times each appears
- a dot plot: each dot is one value, stacked above a number line
- a histogram: bars that count how many values fall in each interval (like 10–20, 20–30)
- a box plot: a box and two "whiskers" that show five key numbers

Typical stems:

- "What is the median of the data?"
- "Which statement about the mean and median is true?"
- "If the value 48 is removed, how do the mean and median change?"
- "Which data set has the larger standard deviation?"

## The method

Work out only the measure that's asked, and reason instead of recalculating when you can.

1. **Name the measure.** Is it center (mean, median, mode) or spread (range, standard deviation)?
2. **Check the format.** In a frequency table or dot plot, the data is *the values, repeated*, not the numbers in the count column.
3. **Count the total.** Add the frequencies (or dots). This tells you where the middle is.
4. **For "what changes" questions, reason it out.** Does the change touch the middle position (median)? The total (mean)? The distance from the center (spread)?
5. **For standard deviation, look, don't calculate.** Pick the set with more values far from its own center.
6. **Use Desmos for any raw list** longer than about five numbers.

## Rules and formulas you need

These are the facts to know cold, grouped by type.

### The measures

| Measure | How to get it | Pulled by an outlier? |
|---|---|---|
| Mean | sum ÷ number of values | Yes, a lot |
| Median | middle value after sorting | Barely or not at all |
| Mode | most common value | No |
| Range | maximum − minimum | Yes, a lot |
| Standard deviation (SD) | about the typical distance from the mean | Yes |
| Interquartile range (IQR) | Q3 − Q1, the width of the middle half | Barely |

- **Median position:** with n sorted values, the median is value number `(n + 1)/2`. If n = 25, it's the 13th value.
- With an even count, average the two middle values. If n = 24, it's halfway between the 12th and 13th.
- **Mean from a frequency table:** `mean = (sum of value × frequency) ÷ (sum of frequencies)`.
- **The sum trick:** `sum = mean × count`. Use it whenever a value is added, removed or missing.

### Shifting and scaling every value

| Change to every value | Mean and median | Range and SD |
|---|---|---|
| Add or subtract k | move by k | don't change |
| Multiply by positive k | multiplied by k | multiplied by k |

> **Remember:** Adding 10 points to every score slides the whole data set right, but the values stay just as far apart, so the SD doesn't change.

### How changes affect standard deviation

- Remove a value far from the mean → SD goes down. Add one far away → SD goes up.
- Add a value equal to the mean → SD goes down slightly (same spread, more values in the middle).
- Two sets can share the same range but have very different SDs. SD depends on where most of the data sits, not just the ends.

### Shape

- **Symmetric:** mean ≈ median.
- **Skewed right** (long tail toward big values): mean > median.
- **Skewed left** (long tail toward small values): mean < median.

### Reading box plots and histograms

- A **box plot** shows five numbers: minimum, Q1, median, Q3 and maximum.
- Each of its four pieces (whisker, half-box, half-box, whisker) holds about 25% of the data.
- The line inside the box is the median, not the mean. You can't find the mean from a box plot.
- In a histogram each bar is an interval, so you usually can't name an exact mean or median.
- You *can* find which interval holds the median by counting up to the middle position.

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

Each of these leads to an answer that test makers love to include.

- **Taking the median of an unsorted list.** Sort first, or let Desmos do it.
- **Using the count column as the data.** In a frequency table, the mean and median are about the *values*, weighted by how often they occur.
- **Picking the middle row of a frequency table.** It's only the median if the counts happen to balance. Always count positions.
- **Forgetting to average for an even count.** With 24 values the median sits between the 12th and 13th, which may differ.
- **Treating range as spread.** Equal ranges can hide very different SDs. Look at where most of the data is.
- **Thinking a shift changes the SD.** Adding the same number to every value moves only the center.
- **Calling the box plot's middle line the mean.** It's the median.

## Desmos shortcut

Desmos has built-in functions for lists, so type the data once and ask for any measure.

### A plain list

- Name it with square brackets: `L = [21, 23, 24, 24, 26, 27, 48]`
- Then type `mean(L)`, `median(L)` or `stdev(L)`.
- `max(L) - min(L)` gives the range.
- Order doesn't matter; Desmos sorts for you.

### What-if questions

- Make a second list without the outlier, like `M = [21, 23, 24, 24, 26, 27]`, and compare `mean(L)` with `mean(M)`.
- To add a value instead, `join(L, [30])` makes a new list with 30 on the end.

### A frequency table

- Put the values in one list and the counts in another, in the same order: `V = [0, 1, 2, 3, 4]` and `F = [4, 8, 5, 4, 3]`.
- Mean: `total(V*F)/total(F)`. Desmos multiplies the lists pair by pair; for Example 1 this gives 1.75.
- Median: `median(repeat(V, F))` expands the table into all 24 values first, giving 1.5 for Example 1.
- If your Desmos doesn't recognize `repeat`, count positions by hand as in Example 1.

### Standard deviation

`stdev` (sample) and `stdevp` (population) give slightly different numbers. For two sets of the same size they always rank the same way, so either works for "which is greater?" questions.

> **Tip:** Don't type a 30-value dot plot into Desmos; count positions instead. Desmos pays off for lists of about 5–15 numbers or a short frequency table.

## Quick checklist

- Does the question ask about center or spread?
- For a table or dot plot, did I add the frequencies to get the total count?
- Did I find the median *position*, and average two values if the count is even?
- For changes, did I use sums (`mean × count`) instead of guessing?
- For SD, did I compare distances from each set's *own* mean, not the range?
- Does the display actually show the number the choice claims (box plot ≠ mean)?
