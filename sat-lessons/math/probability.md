---
title: Probability and conditional probability
skill: probability
domain: problem-solving
section: math
summary: Find any probability from a table or a short story by choosing the right group first, including conditional and probability-to-count questions.
minutes: 19
---

## What this question looks like

Almost every probability question on the Digital SAT has the same shape: a group of people or things, one of them **selected at random**, and a question about the chance that it has some feature. You usually see one of these on screen:

- a **two-way table**: counts sorted by two features at once, like age group and favorite sport, with row and column totals;
- a **frequency table** for one feature, like the number of pets per household;
- a short **description**, like a bag of marbles, a set of numbers, or classes of students.

Typical stems:

- "If one of these students is selected at random, what is the probability that the student is in 11th grade?"
- "What is the probability of selecting a plant that received fertilizer B, given that the plant flowered?"
- "If a person who owns a bike is selected at random, what is the probability that the person also owns a car?"
- "Of the customers who ordered tea, what fraction ordered a muffin?"
- "The probability of selecting a red token is 0.2. How many red tokens are in the box?"

Problem-Solving and Data Analysis makes up about 5 to 7 of the 44 Math questions. Probability is a smaller part of it (49 of 421 questions in College Board's official question bank), so expect about one on your test, and sometimes none. College Board's Skills Insight puts simple probability from a table at one of the lowest score bands (370–410) and conditional probability at a high one (610–670). The math is only division. The points are lost on reading.

The sub-types:

1. Simple probability: favorable ÷ total.
2. "And" and "or" questions from a two-way table.
3. "Not", "neither" and "at least" questions.
4. Conditional probability: "given that", "of the ___", "if the person is ___".
5. Working backward: from a probability to a count, or to a missing number in a table.

## The method

1. **Find the group you are choosing from.** Read the question for a condition: "given that", "of the", "among", "if the selected person is", "one of the ___ who ___". If there is one, the group is only those things. If not, the group is everyone (the grand total).
2. **Write the group's total.** This is your denominator (the bottom of the fraction).
3. **Count the favorable outcomes inside that group.** These are the things that have the asked feature **and** are in the group. This is your numerator (the top).
4. **Divide:** probability = favorable ÷ group total.
5. **Check.** The answer must be between 0 and 1, and the top must be part of the bottom. Make sure you did not answer the reverse question. Give the asked form: fraction, decimal or percent.

> **Tip:** Rewrite the question as "Out of the ___, how many are ___?" The first blank is the denominator. "The probability of selecting a 10th grader, given that the student plays an instrument" becomes "Out of the students who play an instrument, how many are 10th graders?"

> **Key idea:** Every probability question is one fraction. The whole skill is choosing the right denominator: the group you are choosing from.

## Rules and formulas you need

### Basic probability

- **Probability** = number of favorable outcomes ÷ total number of possible outcomes. "Selected at random" means every item has the same chance.
- A probability is between 0 (impossible) and 1 (certain). It can be written as a fraction, a decimal or a percent: 1/4 = 0.25 = 25%.
- **Relative frequency** = count of a category ÷ total count. For an item picked at random from a data set, the probability of a category is its relative frequency.
- **Complement:** P(not A) = 1 − P(A). If the probability of rain is 0.3, the probability of no rain is 0.7.

### Reading a two-way table

| | Owns a pet | No pet | Total |
|---|---|---|---|
| Lives in a house | 45 | 15 | 60 |
| Lives in an apartment | 10 | 30 | 40 |
| Total | 55 | 45 | 100 |

- Each **inside cell** counts things with **both** features. "Lives in a house and owns a pet" = 45.
- Each **row or column total** counts things with **one** feature. "Owns a pet" = 55.
- The **grand total** (bottom right) counts everyone: 100.
- If cells are blank, fill them first: each row and column adds up to its total.

### Conditional probability

- **Conditional probability** is the probability of A when you already know B is true. You choose only from the B group:

P(A given B) = (number with A and B) ÷ (number with B)

- In the table above, P(owns a pet, given lives in an apartment) = 10/40 = 1/4. The group is the 40 apartment people, not all 100.
- **Signal words:** "given that", "of the", "among", "if the selected person is known to be", "one of the ___ who ___", "what fraction of the ___".
- **Order matters.** P(owns a pet, given apartment) = 10/40, but P(apartment, given owns a pet) = 10/55. The test puts both in the choices.

### And, or, not

- **A and B:** one cell, the things with both features. In the table: house and pet = 45, so 45/100.
- **A or B:** add, then subtract the overlap once: count(A) + count(B) − count(A and B). House or pet: 60 + 55 − 45 = 70, so 70/100. (Or add the cells that qualify: 45 + 15 + 10 = 70.)
- **Not A:** total − count(A). **Neither A nor B:** total − count(A or B). Neither a house nor a pet: 100 − 70 = 30, the apartment people with no pet.
- **At least, at most, more than, fewer than:** add every category that fits. "At least 3" includes 3. "More than 3" does not.

### From a probability back to a count

- count = probability × total. If the probability of drawing a red card from a pile of 80 cards is 0.15, there are 0.15 × 80 = 12 red cards. (This is also the **expected count**: about how many times to expect the event.)
- total = count ÷ probability.
- If the probabilities of two groups are given, the remaining group has probability 1 minus their sum.
- A missing number: write the probability as an equation. If a box holds n red pens and 15 blue pens, and P(red) = 0.25, then n/(n + 15) = 0.25, so n = 5.

### Two separate random picks (rare)

- If two picks don't affect each other (independent), multiply their probabilities: P(A, then B) = P(A) × P(B). Without replacement, the second pick has one item fewer. None of the 49 probability questions in College Board's question bank are of this kind, so this is low priority.

## Worked examples

### Example 1: An "and" question

A survey asked 200 people where they get most of their news. The results are shown by age group.

| Age group | Phone app | Television | Print | Total |
|---|---|---|---|---|
| Under 30 | 58 | 22 | 4 | 84 |
| 30 and over | 46 | 54 | 16 | 116 |
| Total | 104 | 76 | 20 | 200 |

If one of these people is selected at random, what is the probability that the person is in the 30-and-over group and gets most news from television?

- (A) 27/100
- (B) 19/50
- (C) 27/58
- (D) 27/38

**Solution.** There is no condition ("given that", "of the"), so the group is all 200 people. "30-and-over **and** television" is one cell: 54. Probability = 54/200 = 27/100. Choice (B) is 76/200, everyone who chose television, of any age. Choice (C) is 54/116: it divides by the 30-and-over row, which answers "given that the person is 30 and over". Choice (D) is 54/76: it divides by the television column.

**Answer:** (A)

### Example 2: A "given that" question

A gardener tested three fertilizers on 160 plants and recorded whether each plant flowered.

| Fertilizer | Flowered | Did not flower | Total |
|---|---|---|---|
| A | 36 | 14 | 50 |
| B | 42 | 18 | 60 |
| C | 27 | 23 | 50 |
| Total | 105 | 55 | 160 |

One of the plants that flowered will be selected at random. What is the probability that this plant received fertilizer B?

- (A) 21/80
- (B) 3/8
- (C) 2/5
- (D) 7/10

**Solution.** "One of the plants that flowered" is the condition. Out of the 105 plants that flowered, how many got fertilizer B? 42. Probability = 42/105 = 2/5. Choice (A) is 42/160: it ignores the condition and divides by all plants. Choice (B) is 60/160, the chance of fertilizer B among all plants. Choice (D) is 42/60, the reverse question: the chance that a plant flowered, given that it got fertilizer B.

**Answer:** (C)

### Example 3: An "or" question

The table shows the club choices of 120 students in grades 10 and 11. Each student is in at most one club.

| Grade | Robotics | Drama | Neither club | Total |
|---|---|---|---|---|
| Grade 10 | 14 | 20 | 26 | 60 |
| Grade 11 | 18 | 12 | 30 | 60 |
| Total | 32 | 32 | 56 | 120 |

If one of these students is selected at random, what is the probability that the student is in grade 11 or in the robotics club?

- (A) 3/20
- (B) 9/16
- (C) 37/60
- (D) 23/30

**Solution.** No condition, so the group is all 120 students. Grade 11 has 60 students and robotics has 32, but 18 students are in both, and they would be counted twice. So "grade 11 or robotics" = 60 + 32 − 18 = 74. (Check by cells: the whole grade 11 row, 60, plus the grade 10 robotics cell, 14, is 74.) Probability = 74/120 = 37/60. Choice (A) is 18/120, the "and" probability. Choice (B) is 18/32, a conditional probability (grade 11, given robotics). Choice (D) is 92/120: it adds 60 and 32 without removing the overlap.

**Answer:** (C)

### Example 4: From a probability to a count

A bag contains only green marbles and purple marbles. There are 18 green marbles in the bag. If one marble is selected at random, the probability that it is green is 3/8. How many purple marbles are in the bag?

*Student-produced response: enter your answer.*

**Solution.** P(green) = green ÷ total, so 3/8 = 18/total. Then total = 18 ÷ (3/8) = 18 × 8/3 = 48 marbles. Purple = 48 − 18 = 30. Check: 18/48 = 3/8. Two answers to avoid: 48 is all the marbles, not the purple ones, and 6.75 comes from multiplying 18 by 3/8.

**Answer:** 30

### Example 5: "At least" with a condition

The table shows the number of pets in each of 80 households.

| Number of pets | Number of households |
|---|---|
| 0 | 22 |
| 1 | 25 |
| 2 | 18 |
| 3 | 9 |
| 4 or more | 6 |

A household that has at least 1 pet will be selected at random. What is the probability that it has at least 3 pets?

- (A) 3/16
- (B) 9/58
- (C) 15/58
- (D) 43/58

**Solution.** The condition is "at least 1 pet", so the group is 25 + 18 + 9 + 6 = 58 households. (The 22 households with no pets are out.) Inside that group, "at least 3 pets" means 3 or 4 or more: 9 + 6 = 15. Probability = 15/58. Choice (A) is 15/80: it divides by all households and ignores the condition. Choice (B) counts only households with exactly 3 pets and forgets "4 or more". Choice (D) is the complement: households with 1 or 2 pets.

**Answer:** (C)

### Example 6: Build the table yourself

A school has three 9th-grade classes with 28 students each and two 10th-grade classes with 30 students each. In each 9th-grade class, 11 students play a musical instrument. In each 10th-grade class, 15 students play a musical instrument. One student who plays an instrument will be selected at random. What is the probability that this student is in 10th grade?

*Student-produced response: enter your answer.*

**Solution.** Turn the story into counts, then into a table.

| Grade | Plays an instrument | Does not | Total |
|---|---|---|---|
| 9th grade | 3 × 11 = 33 | 51 | 3 × 28 = 84 |
| 10th grade | 2 × 15 = 30 | 30 | 2 × 30 = 60 |
| Total | 63 | 81 | 144 |

The condition is "plays an instrument", so the group is the 63 players. Out of them, 30 are in 10th grade. Probability = 30/63 = 10/21, about 0.476. If you got 30/144, you used all students. If you got 30/60 = 1/2, you answered the reverse question (plays an instrument, given 10th grade). If you got 15/63, you used one class instead of two. A decimal answer can be cut off or rounded at the fourth digit, so .4761 and .4762 both work.

**Answer:** 10/21 or .4761 or .4762

## Traps to avoid

- **Dividing by the grand total when there is a condition.** "Given that", "of the" and "one of the ___ who ___" all shrink the group. This wrong answer is almost always a choice.
- **The reverse condition.** P(B given A) is not P(A given B). Ask yourself which group you are choosing from. That group is the denominator.
- **Mixing up "and" and "or".** "And" is one cell. "Or" adds two groups and must subtract the overlap once.
- **Leaving out part of a category.** "At least 3" includes 3 and every category above it, like "4 or more". "At least 18 seats" can cover several rows of a table.
- **Using one group's numbers instead of the totals.** When a story says "in each of 3 classes" or "in each row", multiply to get the full counts before you divide.
- **Answering the complement.** "Neither blue nor yellow" and "not in group 2" ask for the things outside a group. Reread the question before you choose.
- **The wrong row or column.** Tables often have similar labels. Put your finger on the row label and the column label before you take a number.
- **Probability vs count.** If the question asks "how many", multiply the probability by the total. If it asks for a probability, don't stop at a count.
- **The wrong answer form.** On a typed answer, enter a fraction or a decimal like 2/5 or .4, not 40%, unless the question asks for a percent. A probability is never greater than 1.

## Quick checklist

- Is there a condition ("given that", "of the", "among", "if the person is")?
- Is my denominator the total of exactly the group I am choosing from?
- Is my numerator inside that group and does it have the asked feature?
- For "or", did I subtract the overlap? For "at least", did I include every category that fits?
- Did I answer the asked direction, not the reverse condition?
- Is my answer between 0 and 1 and in the asked form?

## Sources

- [College Board: Assessment Framework for the Digital SAT Suite](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — official skill description: two-way tables, area models, and using a probability to find a frequency
- [College Board: Skills Insight for the Digital SAT Suite](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — simple probability at a low score band, conditional probability at 610–670
- [College Board: SAT Suite Question Bank](https://satsuitequestionbank.collegeboard.org/) — official questions, used to sort the sub-types and the typical wrong answers (wrong denominator, reverse condition)
- [Test Ninjas: Probability Questions on the SAT](https://test-ninjas.com/sat-probability) — choosing the right total and the main conditional-probability mistakes
- [PrepScholar: Complete Guide to Probability on SAT Math](https://blog.prepscholar.com/complete-guide-to-probability-on-sat-math-practice-questions) — the desired-over-total routine and filling incomplete tables
- [Larry Learns: SAT Probability Questions](https://www.larrylearns.com/blog/sat-probability-questions) — grouping probability questions into families with their usual traps
- [Varsity Tutors: SAT Math Probability lesson](https://www.varsitytutors.com/practice/subjects/sat-math/lessons/probability) — why P(A given B) and P(B given A) differ, and subtracting the overlap in "or" questions
- [Settele Tutoring: Probability on the SAT, including hard conditional probability (YouTube)](https://www.youtube.com/watch?v=G39Ae3bgoDM) — description: make a fraction, and conditional questions limit the outcomes
- [John Jung: Probability, Simple Technique to Solve Them All (YouTube)](https://www.youtube.com/watch?v=9Mu9Miy-Kc8) — description: identify the target and the total before dividing
- [James Lu SAT: All of Problem Solving and Data Analysis (YouTube)](https://www.youtube.com/watch?v=rytygT3oFO4) — summary note: with "given that", the total is only the group mentioned
