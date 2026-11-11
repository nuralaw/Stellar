---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Find basic and "given that" probabilities from tables and word problems by always picking the right group to divide by.
minutes: 9
---

## What this question looks like

You get some data and are asked about something chosen **at random**. The data usually comes as:

- a **two-way table**: rows for one category (like grade), columns for another (like favorite sport), with totals
- a short story with counts or percents ("60% of the members are…, and of those, 25%…")
- a bag, jar or list of items

Typical question stems:

- "If one of these people is selected at random, what is the probability that…"
- "If a person who **owns a bike** is selected at random, what is the probability that…"
- "What is the probability that a randomly selected student is a junior, **given that** the student plays chess?"
- Less often, the reverse: "The probability of choosing a yellow marble is 1/5. How many yellow marbles are there?"

The math is almost never hard. These questions are really about **reading carefully** and dividing by the right number.

## The method

1. **Find the group you are choosing from.** Read the "selected at random" part slowly. Is the person chosen from *everyone*, or only from one group (people who own a bike, seniors, people who liked the movie)? That group's total is your **denominator** (the bottom of the fraction).
2. **Find what you want inside that group.** Count only the people in the chosen group who also have the feature asked about. That is your **numerator** (the top).
3. **Divide:** probability = numerator / denominator.
4. **Sanity check.** The answer must be between 0 and 1. Ask: "Does this match the group I picked in step 1?"
5. **For word problems with percents,** invent a nice total (100 or 1,000 people), turn every percent into a count, and build your own small table. Then use steps 1–3.

> **Key idea:** The question tells you the denominator. "Selected at random from all…" → grand total. "Selected at random from those who…" or "given that…" → only that row or column total.

## Rules and formulas you need

| Idea | Rule | Signal words |
|---|---|---|
| Basic probability | P(A) = (number of ways A happens) / (total number of outcomes) | "selected at random from all" |
| Conditional probability | P(A given B) = (number in both A and B) / (number in B) | "given that", "of those who", "among the", "if a ___ is selected" |
| Complement ("not") | P(not A) = 1 − P(A) | "not", "does not" |
| "Or" (overlap) | P(A or B) = P(A) + P(B) − P(A and B) | "or", "either" |
| "And" from a table | P(A and B) = (number in the A-and-B cell) / (grand total) | "and", "both" |

More facts to know cold:

- A probability is always between 0 and 1. 0 means impossible, 1 means certain.
- **P(A given B) is usually not the same as P(B given A).** "The chance a child likes dinosaurs" and "the chance a dinosaur fan is a child" have different denominators.
- In a two-way table, each row total and column total is a ready-made denominator for a "given" question.
- Missing table cells: each row and each column must add up to its total, so you can fill blanks by subtracting.
- **Relative frequency** is the same idea as probability: a part divided by a whole, often written as a decimal or percent.
- Two events are **independent** if knowing one doesn't change the chance of the other: P(A given B) = P(A). The SAT rarely asks this by name.
- Drawing **without replacement** (not putting it back): the second draw has one fewer item in the total.

## Worked examples

### Example 1: Two-way table, "given" question

A science museum asked 220 visitors which exhibit they liked best. The results are shown.

| | Space | Dinosaurs | Oceans | Total |
|---|---|---|---|---|
| Child | 30 | 54 | 16 | 100 |
| Adult | 50 | 26 | 44 | 120 |
| Total | 80 | 80 | 60 | 220 |

If one of the visitors whose favorite exhibit was Dinosaurs is selected at random, what is the probability that the visitor is a child?

- (A) 27/110
- (B) 27/50
- (C) 27/40
- (D) 13/40

**Solution**

Step 1: we choose only from visitors whose favorite was Dinosaurs. That's the Dinosaurs column, total **80**. Step 2: inside that column, children = **54**. Step 3: 54/80 = 27/40.

Why the others are wrong: (A) is 54/220, using the grand total. (B) is 54/100, the chance a *child* picked Dinosaurs (the condition flipped). (D) is 26/80, the adults in the column instead of the children.

**Answer:** (C)

### Example 2: Working backward from a probability

A jar contains only red, green and yellow marbles. There are 12 red marbles and 20 green marbles. If one marble is chosen at random from the jar, the probability that it is yellow is 1/5. How many yellow marbles are in the jar?

**Solution**

Let y = the number of yellow marbles. The total number of marbles is 12 + 20 + y = 32 + y, because the yellow marbles are part of the jar too.

So `y / (32 + y) = 1/5`. Cross-multiply: 5y = 32 + y, so 4y = 32 and y = 8.

Check: 8 yellow out of 40 marbles = 8/40 = 1/5. ✓

The common mistake is to take 1/5 of 32 and get 6.4. That forgets that the yellow marbles also count in the total. (And a marble count can't be a decimal anyway.)

**Answer:** 8

### Example 3: Percents, no table given

At a high school, 60% of the students take Spanish and the rest take French. No student takes both. Of the Spanish students, 25% are in the drama club. Of the French students, 40% are in the drama club. If a student in the drama club is selected at random, what is the probability that the student takes French?

- (A) 2/5
- (B) 4/25
- (C) 16/31
- (D) 31/100

**Solution**

Pretend the school has 1,000 students and build a table.

| | Drama | Not drama | Total |
|---|---|---|---|
| Spanish | 150 | 450 | 600 |
| French | 160 | 240 | 400 |
| Total | 310 | 690 | 1,000 |

Spanish: 60% of 1,000 = 600, and 25% of 600 = 150 in drama. French: 400 students, and 40% of 400 = 160 in drama.

We choose from **drama club members only**: denominator = 310. French students among them = 160. Probability = 160/310 = 16/31.

Why the others are wrong: (A) is 40%, the chance a *French student* is in drama (condition flipped). (B) is 160/1,000, the chance a random student is French **and** in drama. (D) is 310/1,000, the chance a random student is in drama at all.

**Answer:** (C)

## Traps to avoid

- **Dividing by the grand total on a "given" question.** This is the number one mistake, and the wrong answer is almost always sitting in the choices. If the stem limits the group, the grand total is wrong.
- **Flipping the condition.** "Probability a dinosaur fan is a child" divides by dinosaur fans. "Probability a child is a dinosaur fan" divides by children. Test makers put both in the choices.
- **Reading "and" as "given".** "A child **and** a dinosaur fan" chosen from everyone uses the grand total. Only "given / of those / among" shrinks the group.
- **Using the wrong row or column.** You picked the right group but grabbed the neighboring cell (adults instead of children). Point at the cell before you divide.
- **Answering the complement.** The question asks for "not in the drama club" and you give the chance of being in it. Underline the word "not".
- **Adding "or" probabilities without removing the overlap.** People in both groups get counted twice. A probability above 1 is a sure sign.
- **Forgetting the unknown is in the total** (Example 2). When you work backward, the missing count belongs in the denominator too.
- **Typing a percent into a student-produced response.** If the answer is 0.25, don't enter 25.

## Quick checklist

- Who exactly is being chosen at random? That group's total is my denominator.
- Did I count only people inside that group for the top of the fraction?
- Is my answer between 0 and 1?
- Did I check for flipped-condition, grand-total and complement answers in the choices?
- For percents, did I use 100 or 1,000 people and build a table?
- Working backward? The unknown goes in the total too.

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite (skill descriptions, Appendix B)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf)
- [Test Ninjas: SAT Probability question type](https://test-ninjas.com/sat-probability)
- [Albert.io: Probability and Conditional Probability, a Friendly SAT Math Guide](https://www.albert.io/blog/probability-and-conditional-probability-a-friendly-sat-math-guide/)
- [Varsity Tutors: SAT Math Probability lesson](https://www.varsitytutors.com/practice/subjects/sat/lessons/probability)
- [Larry Learns: SAT Probability Questions](https://www.larrylearns.com/blog/sat-probability-questions)
- [JustLockedIn: Conditional probability patterns](https://justlockedin-main.pages.dev/patterns/math/problem-solving-and-data-analysis/probability-and-conditional-probability/conditional-probability.html)
- [Open Exam Prep: Statistics, Probability, and Inference](https://open-exam-prep.com/study-guides/sat/math-data-geometry-and-final-review/statistics-probability-and-inference)
