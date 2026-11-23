---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Probability from counts and tables, given that, and independent events.
---

# Fit over total
Count what fits, divide by everything possible.

```visual
probability--fraction
```

## Key ideas

**Probability** tells how likely an event is. When every outcome is equally likely, count the outcomes that fit and divide by all the outcomes:

\[P = \frac{\text{outcomes that fit}}{\text{all possible outcomes}}\]

The answer is always between 0 (impossible) and 1 (certain). For "not", take the rest:

\[P(\text{not } A) = 1 - P(A)\]

The probabilities of all the possible results add up to 1.

On a student-produced response, type a fraction or a decimal, never a percent. If a fraction doesn't fit the grid (e.g. 18/120), reduce it or enter the decimal.

A ratio works too. Pens to pencils in a drawer is \(3 : 1\), so 3 of every 4 items is a pen, and \(P(\text{pen}) = \frac{3}{4}\).

```example
A jar holds 5 red, 7 green and 8 blue marbles. One marble is picked at random. What is the probability that it is not green?
1. \(5 + 7 + 8 = 20\) :: All the marbles are the group.
2. \(5 + 8 = 13\) :: The marbles that are not green.
3. \(\frac{13}{20}\) :: Same as \(1 - \frac{7}{20}\).
```

```theory
An **outcome** is one possible result of the random pick, such as drawing one particular marble. An **event** is the set of outcomes you are asking about, such as "the marble is red". "At random" means every outcome is equally likely, which is exactly why counting works.

The bottom of the fraction is the whole group you pick from. The top is the part of that group that fits. If your top is bigger than your bottom, you have mixed them up, because a probability can never be above 1.

"Not" asks for the **complement**: everything that is outside the event. Use \(1 - P(A)\) when the "not" group is long to count. A machine makes 100 beads and 29 are defective. Then \(P(\text{defective}) = \frac{29}{100}\) and \(P(\text{not defective}) = \frac{71}{100}\).

The SAT says "selected at random", "randomly chosen" or "picked without looking". Watch the wording: "neither red nor blue" means outside both groups, so count what is left. "At least 3" means 3, 4, 5 and so on, all added together.

A ratio such as \(3 : 5\) means 3 parts and 5 parts, so there are 8 parts in all. A group of 3 parts has probability \(\frac{3}{8}\).

Answer format: never a percent. The SAT accepts any equivalent form that fits the grid, so \(\frac{3}{4}\), 6/8 and .75 all count. If a fraction is too long to fit, such as 18/120, reduce it or enter the decimal. A decimal that does not end, like \(\frac{2}{3}\), is accepted only if it fills the grid (.6666 or .6667).

Classic traps: dividing by the size of one group instead of everyone, forgetting the word "not", and leaving a count on top without its group below.
```

## Easy

```task
bank: m-1302
highlight:
- "A band with 45 members" :: The whole group is 45 members.
- "11 members who play saxophone" :: These fit the event: 11.
- "probability of selecting a band member who plays saxophone" :: Fit over group: 11 over 45.
explain:
Probability is the outcomes that fit divided by all the outcomes.

The group you pick from is the whole band: 45 members. The members that fit the event are the ones who play saxophone: 11.

\[P = \frac{11}{45}\]

The fraction cannot be reduced, so it stays \(\frac{11}{45}\). Choice (C), \(\frac{34}{45}\), is the chance of NOT playing saxophone, since \(45 - 11 = 34\). Choice (A) uses one member on top, and choice (D) says the event is certain.

The answer is (B), \(\frac{11}{45}\).
```

## Medium

```task
bank: m-1394
highlight:
- "positive integers that are less than or equal to 160" :: The group is 1 through 160: 160 numbers.
- "even and less than or equal to 50" :: Fit: the even numbers from 2 to 50.
- "what is the probability of selecting" :: Fit over group, then reduce.
explain:
First find the group. Set K holds every positive integer from 1 to 160, so it has 160 numbers.

Next count the numbers that fit: they must be even and at most 50. The even numbers up to 50 are 2, 4, 6, and so on to 50. Every second number counts, so there are \(50 \div 2 = 25\) of them.

\[P = \frac{25}{160} = \frac{5}{32}\]

Divide the top and bottom by 5 to reduce. Choice (B), \(\frac{3}{16}\), and the others do not match the counts of 25 and 160.

The answer is (A), \(\frac{5}{32}\).
```

## Hard

```task
A jar contains only red, blue and green marbles. There are twice as many red marbles as blue marbles, and 3 more green marbles than blue marbles. The jar holds 27 marbles in all. If one marble is selected at random, what is the probability that it is not blue? (Express your answer as a decimal or fraction, not as a percent.)
answer: 7/9
- 2/9 :: That is the chance of blue. "Not blue" is the rest.
- 1/3 :: That is the chance of green only.
- 4/9 :: That is the chance of red only.
highlight:
- "twice as many red marbles as blue marbles" :: Let blue be \(b\). Then red is \(2b\).
- "3 more green marbles than blue marbles" :: Green is \(b + 3\).
- "27 marbles in all" :: \(b + 2b + (b + 3) = 27\).
- "not blue" :: Count the others, or take 1 minus the chance of blue.
explain:
Let \(b\) be the number of blue marbles. Red is \(2b\) and green is \(b + 3\). The total is 27:

\[b + 2b + (b + 3) = 27\]

So \(4b + 3 = 27\), which gives \(4b = 24\) and \(b = 6\). That means 6 blue, 12 red and 9 green marbles. Check: \(6 + 12 + 9 = 27\).

"Not blue" means red or green: \(12 + 9 = 21\) marbles. The probability is

\[P = \frac{21}{27} = \frac{7}{9}\]

Or use the rest: \(P(\text{blue}) = \frac{6}{27} = \frac{2}{9}\), and \(1 - \frac{2}{9} = \frac{7}{9}\).

The answer is 7/9.
```

# Rows, columns, cells
Totals give rows and columns; one cell means both.

```visual
probability--cells
```

## Key ideas

A **two-way table** sorts the same people in two ways at once. **Rows** go across, **columns** go down, and each **cell** counts the people who fit one row and one column. The **Total** row and column are added for you.

| | Car | Bus | Total |
|---|---|---|---|
| Grade 9 | 6 | 18 | 24 |
| Grade 10 | 14 | 12 | 26 |
| Total | 20 | 30 | 50 |

Pick one student at random. Unless the question says "given that", the bottom of the fraction is the whole table, 50.

- **A row or a column:** use its total. \(P(\text{grade 9}) = \frac{24}{50}\).
- **A single cell** ("grade 9 *and* bus"): use that cell. \(P = \frac{18}{50}\).

A cell is missing? Every row and column adds up to its total, so subtract the known cells from the total.

```example
A survey of 60 students asks about sports and music. 25 students play a sport, and 12 of them also play music. 20 students play music in all. What is the probability that a student picked at random plays music but no sport?
1. \(20 - 12 = 8\) :: Music total minus the students who do both.
2. Group: all 60 students :: There is no "given that".
3. \(\frac{8}{60} = \frac{2}{15}\) :: One cell over the whole table.
```

```theory
A **row total** counts everyone in one category of the rows (all of grade 9). A **column total** counts everyone in one category of the columns (all bus riders). The number in the bottom-right corner is the **grand total**: everyone in the table. A single **cell** counts people in both a row category and a column category.

The rule "fit over group" stays the same. Only the question decides which number is the fit and which is the group. "A grade 9 student" asks for a row. "A student who takes the bus" asks for a column. "A grade 9 student who takes the bus" asks for one cell. When the question does not say "given that", the group is everyone, so divide by the grand total.

Some SAT tables have no Total row or column. Add the cells yourself before you divide. If the four cells of a table are 9, 6, 4 and 11, the group is \(9 + 6 + 4 + 11 = 30\), so the cell 11 gives \(\frac{11}{30}\), not \(\frac{11}{15}\), which divides by only one row.

Missing cell: pick a row or column that has only one unknown and subtract. Check your result with the other direction. If a row has 12 and a total of 30, the cell is 18, and the column should still add up.

Percent tables work the same way. If a table gives each cell as a percent of all participants, the whole table adds to 100%, and a cell's percent is already the probability.

Traps: using a row total when the question asks for a single cell, and using the wrong total as the group.
```

## Easy

```task
bank: m-1164
highlight:
- "14 cars listed for sale" :: The group is the whole table: 14 cars.
- "a hybrid car priced at no more than $25,000" :: One cell: the Hybrid row and the first price column.
explain:
The question does not say "given that", so the group is everyone in the table: 14 cars.

"A hybrid car priced at no more than $25,000" needs both facts at once. That is one cell: the Hybrid row and the "no more than $25,000" column. That cell holds 2 cars.

\[P = \frac{2}{14} = \frac{1}{7}\]

Choice (C), \(\frac{1}{3}\), is \(\frac{2}{6}\): it divides by the Hybrid row total instead of the whole table. Choice (D) is the non-hybrid row total over 14.

The answer is (A), \(\frac{1}{7}\).
```

## Medium

```task
The table shows the number of sophomores and juniors in a language program, sorted by the language each student studies.

| | Spanish | French | Total |
|---|---|---|---|
| Sophomores | 18 | ? | 45 |
| Juniors | 22 | 13 | 35 |
| Total | 40 | 40 | 80 |

One of these 80 students will be selected at random. What is the probability that the student is a sophomore who studies French?
* \(\frac{27}{80}\)
- \(\frac{27}{45}\) :: You divided by the sophomores. Use all 80 students.
- \(\frac{27}{40}\) :: You divided by the French column. Use all 80 students.
- \(\frac{13}{80}\) :: That is the juniors who study French.
highlight:
- "One of these 80 students" :: There is no "given that", so the group is all 80.
- "a sophomore who studies French" :: One cell: the Sophomores row and the French column.
explain:
The question has no "given that", so the group is the whole table: 80 students.

"A sophomore who studies French" is the single cell where the Sophomores row meets the French column. That cell is missing, so use the row total. Sophomores add to 45, and 18 study Spanish:

\[45 - 18 = 27\]

Check with the column: \(27 + 13 = 40\), which matches the French total.

\[P = \frac{27}{80}\]

The fraction cannot be reduced. Choice (B) divides by the sophomore total, 45, and choice (C) divides by the French total, 40. Both choose the wrong group.

The answer is \(\frac{27}{80}\).
```

## Hard

```task
The table shows the percent of all participants in a survey who chose each drink at each time of day. Every participant is in exactly one cell.

| | Tea | Coffee | Juice |
|---|---|---|---|
| Morning | 12% | 18% | 10% |
| Evening | 20% | ?% | 15% |

One participant will be selected at random. What is the probability that the participant chose coffee in the evening? (Express your answer as a decimal or fraction, not as a percent.)
answer: 1/4
- 9/50 :: That is the morning coffee cell, 18%.
- 1/5 :: That is the evening tea cell, 20%.
highlight:
- "percent of all participants" :: Each cell is a share of the whole table, so the cells add to 100%.
- "coffee in the evening" :: One cell: the Evening row, the Coffee column. It is missing.
explain:
Each cell is a percent of all participants, and every participant is in exactly one cell. So the six cells must add up to 100%.

The known cells add up to

\[12 + 18 + 10 + 20 + 15 = 75\]

The missing cell is the rest: \(100 - 75 = 25\), so 25% of the participants chose coffee in the evening.

A cell that is a percent of the whole table is already the probability: \(25\% = 0.25 = \frac{1}{4}\).

Do not divide again. The total is 100%, so dividing by it changes nothing. The cell 18% is morning coffee (\(\frac{9}{50}\)), and 20% is evening tea (\(\frac{1}{5}\)).

The answer is 1/4 (or 0.25).
```

# Conditional probability
The condition names the group you divide by.

```visual
probability--table
```

## Key ideas

A **conditional probability** is the probability of an event *given that* another event is known to have happened. Words that signal it: "given that", "if the person is", "of the students who", "among those who".

The condition is the new group. Throw away everything outside it:

\[P(A \text{ given } B) = \frac{\text{number that are } A \text{ and } B}{\text{number that are } B}\]

On a table, the condition picks a row or a column, and its total goes on the bottom. The cell inside that row or column goes on top.

| | Car | Bus | Total |
|---|---|---|---|
| Grade 9 | 6 | 18 | 24 |
| Grade 10 | 14 | 12 | 26 |
| Total | 20 | 30 | 50 |

Given that the student takes the bus: \(\frac{18}{30} = \frac{3}{5}\). Given that the student is in grade 9: \(\frac{18}{24} = \frac{3}{4}\). Same cell, different group, different answer.

```example
A club has 40 members, and 25 of them are girls. 12 members play chess, and 9 of the chess players are girls. A chess player is picked at random. What is the probability that the player is a girl?
1. Group: the 12 chess players :: The condition is the new group.
2. Fit: 9 girls who play chess :: Count inside the group only.
3. \(\frac{9}{12} = \frac{3}{4}\) :: Not \(\frac{9}{25}\) or \(\frac{9}{40}\).
```

```theory
"Conditional" means "under a condition". The condition shrinks the world you pick from. After you hear "given that the student takes the bus", the car riders no longer exist for this question, and the bus riders are your whole group.

How to find the group: the words after "given that", "if", "of those who" or "from" name it. The words in "what is the probability that..." name the part that fits. For example, "a member of club X, given that the member is at least 30 years old" means: the group is everyone at least 30, and club X is the fit.

A condition can cover more than one column. "At least 30 years" in a table with columns 18-29, 30-44 and 45+ means the last two columns, so add their totals. "Not in group 2" means add the other two rows.

Tables with percents or proportions work the same way. Add the percents of the group for the bottom, and take the part of them that fits for the top. Given that a room has at least 18 seats, when the rooms with 18 or more seats are 74% of all rooms and the largest ones are 24%, the answer is \(\frac{0.24}{0.74}\).

Do not add a row total and a column total to build a group. They share a cell, and you would count it twice.

Traps: forgetting the condition and dividing by the grand total, and flipping the group: P(grade 9 given bus) is not P(bus given grade 9).
```

## Easy

```task
bank: m-1548
highlight:
- "If the person chosen works in the Human Resources department" :: The condition: look only at the Human Resources column.
- "completed is a master" :: Fit: the master's degree cell in that column.
explain:
The condition is "works in the Human Resources department". That makes the Human Resources column the new group. Ignore the Accounting column.

Group: \(4 + 2 = 6\) people (bachelor's plus master's). Fit: the master's degree cell in that column, which is 2.

\[P = \frac{2}{6} = \frac{1}{3}\]

Choice (A), \(\frac{2}{15}\), divides by all 15 people and ignores the condition. Choice (C), \(\frac{1}{4}\), is \(\frac{2}{8}\): it divides by all 8 master's holders, so the condition is flipped.

The answer is (B), \(\frac{1}{3}\).
```

## Medium

```task
bank: m-1503
highlight:
- "given that the participant is at least 10 years of age" :: The condition: only the 10–19 and 20+ columns are the group.
- "a participant from group A" :: Fit: the group A cells inside those two columns.
explain:
The condition is "at least 10 years of age". In the table, that means the 10–19 column and the 20+ column. The 0–9 column is out.

Group: each of those columns totals 30, so the group is \(30 + 30 = 60\) participants.

Fit: group A inside the group, which is \(17 + 8 = 25\) participants.

\[P = \frac{25}{60} = \frac{5}{12}\]

Choice (A), \(\frac{5}{18}\), is \(\frac{25}{90}\): it divides by all 90 participants and ignores the condition. Choice (C), \(\frac{17}{30}\), uses only the 10–19 column.

The answer is (B), \(\frac{5}{12}\).
```

## Hard

```task
A factory made 120 bolts. The table shows the number of bolts from each of three machines, sorted by length.

| | Short | Medium | Long |
|---|---|---|---|
| Machine 1 | 14 | 20 | 6 |
| Machine 2 | 8 | 24 | 18 |
| Machine 3 | 10 | 12 | 8 |

One of these bolts will be selected at random. What is the probability of selecting a bolt that is not long, given that it was not made by machine 2? (Express your answer as a decimal or fraction, not as a percent.)
answer: 4/5
- 7/15 :: You divided by all 120 bolts. The group is "not machine 2".
- 11/15 :: That ignores the condition. It is "not long" among all bolts.
highlight:
- "given that it was not made by machine 2" :: The condition: the group is machines 1 and 3.
- "not long" :: Fit: Short and Medium cells only, inside the group.
explain:
The condition is "not made by machine 2", so the group is machine 1 and machine 3.

Group: machine 1 has \(14 + 20 + 6 = 40\) bolts and machine 3 has \(10 + 12 + 8 = 30\), so the group is \(40 + 30 = 70\) bolts.

Fit: "not long" means short or medium. Machine 1 gives \(14 + 20 = 34\), and machine 3 gives \(10 + 12 = 22\), so the fit is \(34 + 22 = 56\).

\[P = \frac{56}{70} = \frac{4}{5}\]

Check by the rest: the long bolts in the group are \(6 + 8 = 14\), and \(\frac{14}{70} = \frac{1}{5}\), so \(1 - \frac{1}{5} = \frac{4}{5}\).

If you divided by all 120 bolts you would get \(\frac{56}{120} = \frac{7}{15}\). That ignores the condition.

The answer is 4/5 (or 0.8).
```

# Or, and, not
Add groups, then subtract the overlap.

```visual
probability--or-overlap
```

## Key ideas

**And** means both: one cell of a table, or the overlap of two groups.

**Or** means either one, or both. Add the two groups, then subtract the overlap, because the overlap was counted twice:

\[P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)\]

If A and B cannot happen together (a card cannot be a heart and a spade), the overlap is 0, so you just add.

**Not** means the rest:

\[P(\text{not } A) = 1 - P(A)\]

On a table, never add a row total and a column total without subtracting the cell they share. You can also add the cells that fit, one time each.

```example
Among 40 students, 22 take art, 15 take music, and 6 take both. One student is picked at random. What is the probability that the student takes art or music?
1. \(22 + 15 = 37\) :: Add the two groups.
2. \(37 - 6 = 31\) :: The 6 who take both were counted twice.
3. \(\frac{31}{40}\) :: Over all 40 students.
```

```theory
Two events are **mutually exclusive** when they cannot happen at the same time, like picking a red marble or a blue marble in one pick. For these, \(P(A \text{ or } B) = P(A) + P(B)\), because the overlap is empty. Rows of a table never overlap each other, and neither do columns, so a row plus another row can just be added.

Events that can happen together overlap. In the art and music example, 6 students are in both groups. Adding 22 and 15 counts them twice, so subtract them once.

Two ways to do "or" on a table. (1) List the cells that fit and add each cell once. (2) Add the row total and the column total, then subtract the cell where they cross. Both give the same answer. A third way is to use "not": find the group that is in neither, and take 1 minus it.

"At least one" is "or". "Neither A nor B" is the opposite of "A or B", so \(P(\text{neither}) = 1 - P(A \text{ or } B)\).

The probabilities of every possible result add up to 1. If three groups cover everyone, the third is \(1 - P(\text{first}) - P(\text{second})\). Then a count is the probability times the total.

Real questions often say "did not buy a ticket" or "is not in group 2". These add the rows or columns that are left, or use 1 minus the probability.

Traps: adding a row total and a column total, and adding probabilities of events that overlap. If your answer is above 1, you double counted.
```

## Easy

```task
bank: m-1185
highlight:
- "135 customers" :: The group is all customers: 135.
- "did not purchase gasoline" :: "Not" means the other row: Gasoline not purchased.
explain:
There is no "given that", so the group is all 135 customers.

"Did not purchase gasoline" is the whole bottom row of the table, "Gasoline not purchased". Its total is 50 customers, counting both those who bought a beverage and those who did not.

\[P = \frac{50}{135}\]

You can also take the rest: \(P(\text{gasoline}) = \frac{85}{135}\), and \(1 - \frac{85}{135} = \frac{50}{135}\).

Choice (C), \(\frac{35}{50}\), looks only at customers who did not buy gasoline and picks those who bought a beverage. That is a conditional probability, not what the question asks.

The answer is (D), \(\frac{50}{135}\).
```

## Medium

```task
bank: m-1396
highlight:
- "either group A, group B, or group C" :: Every attendee is in exactly one group, so the probabilities add to 1.
- "group A is 0.44" :: P(A) = 0.44.
- "group B is 0.24" :: P(B) = 0.24.
- "How many attendees are assigned to group C" :: Find P(C) as the rest, then multiply by 275.
explain:
Each attendee is in exactly one of the groups A, B or C, so the three probabilities add up to 1.

\[P(C) = 1 - 0.44 - 0.24 = 0.32\]

This is the "not A and not B" part. The question asks for a number of people, not a probability. Multiply the probability by the total:

\[0.32 \cdot 275 = 88\]

Check: group A has \(0.44 \cdot 275 = 121\) people, group B has \(0.24 \cdot 275 = 66\), and \(121 + 66 + 88 = 275\).

The answer is 88.
```

## Hard

```task
The table shows the number of households in a neighborhood that have a cat or a dog.

| | Has a dog | No dog |
|---|---|---|
| Has a cat | 14 | 26 |
| No cat | 18 | 22 |

One of these 80 households will be selected at random. What is the probability that the household has a cat or a dog, or both? (Express your answer as a decimal or fraction, not as a percent.)
answer: 29/40
- 9/10 :: You added the cat total and the dog total. Subtract the overlap.
- 11/40 :: That is the chance of no cat and no dog.
highlight:
- "has a cat or a dog, or both" :: "Or" with overlap: households with a cat, a dog, or both.
- "80 households" :: The group is the whole table: 80.
explain:
"A cat or a dog, or both" is an "or" with an overlap. The cat row has \(14 + 26 = 40\) households. The dog column has \(14 + 18 = 32\) households. The 14 households in both were counted twice.

\[40 + 32 - 14 = 58\]

\[P = \frac{58}{80} = \frac{29}{40}\]

Check by the rest: the only households that fit neither are the "no cat, no dog" cell, 22. So \(80 - 22 = 58\) households have a cat or a dog, or both.

If you add 40 and 32 without subtracting 14 you get \(\frac{72}{80} = \frac{9}{10}\). The cell \(\frac{22}{80} = \frac{11}{40}\) is the "neither" group.

The answer is 29/40 (or 0.725).
```

# Probability to counts
Probability times the total gives how many.

```visual
probability--counts
```

## Key ideas

A probability is a share of a group. Multiply it by the size of the group to get a count:

\[\text{count} = P \cdot \text{total}\]

If 30% of 80 marbles are blue, then \(0.3 \cdot 80 = 24\) marbles are blue. The other way around is the usual fraction: \(P = \frac{\text{count}}{\text{total}}\).

All the possible results add to 1, so the last one is what is left: with \(P(\text{red}) = 0.5\) and \(P(\text{blue}) = 0.2\), green is \(1 - 0.5 - 0.2 = 0.3\).

When a problem lists rows (trays, shelves, rows of trees), **multiply first**: rows times items per row gives the items. Then divide. You pick one item, not one row.

```example
A florist has 4 buckets of roses and 6 buckets of tulips. Each rose bucket holds 5 flowers and each tulip bucket holds 12. One flower is picked at random. What is the probability that it is a rose?
1. Roses: \(4 \cdot 5 = 20\) :: Buckets times flowers per bucket.
2. Tulips: \(6 \cdot 12 = 72\) :: The same for tulips.
3. \(\frac{20}{92} = \frac{5}{23}\) :: Flowers, not buckets: \(20 + 72 = 92\).
```

```theory
A probability of 0.3 means 30 out of every 100. In a group of 80, that is \(\frac{30}{100}\) of 80, which is 24. This is the **expected number** of items: what you expect from the whole group when each pick is random.

Real questions mix two steps. They give you a probability and a total, and ask for a count (how many marbles are blue). Or they give counts and ask for a probability. Write the sentence "count equals probability times total" and fill in the two numbers you know.

If a problem gives probabilities for most groups, the missing group is 1 minus the rest. Then multiply that probability by the total. In a camp of 200 children with \(P(A) = 0.5\) and \(P(B) = 0.3\), group C has \(0.2 \cdot 200 = 40\) children.

Some problems give extra numbers you do not need, like a population from an earlier month. Use the numbers of the group that the question picks from.

When items come in rows, each row total is "rows times items per row". The group of the probability is all the items. If the question also says "given that", the group is only the items that fit the condition, and you multiply for each row inside it.

A ratio is another way to give probabilities. If red to blue is \(3 : 2\), then \(P(\text{red}) = \frac{3}{5}\).

Traps: counting rows instead of items, using a percent as if it were a count, and forgetting that the answer must be a whole number of items.
```

## Easy

```task
bank: m-1511
highlight:
- "total of 60 marbles" :: The group is 60 marbles.
- "probability that a blue marble will be chosen is 0.35" :: 35% of the marbles are blue.
- "how many marbles in the bag are blue" :: Count equals 0.35 times 60.
explain:
A probability is the share of the group that fits. Here the probability of blue is 0.35, so 35% of the marbles are blue.

The question asks for a count, so multiply the probability by the total:

\[0.35 \cdot 60 = 21\]

Check by going back: \(\frac{21}{60} = 0.35\).

Choice (C), 35, uses the percent as if it were a count. Choice (B), 25, does not come from \(0.35 \cdot 60\). Choice (D), 39, is the marbles that are not blue (\(60 - 21\)).

The answer is (A), 21.
```

## Medium

```task
bank: m-1246
highlight:
- "6 rows of birch trees and 5 rows of maple trees" :: These are rows, not trees. Multiply by the trees in each row.
- "Each row of birch trees has 8 trees 20 feet or taller" :: Tall birch trees: \(6 \cdot 8 = 48\).
- "given that the tree is 20 feet or taller" :: The condition: count only the tall trees.
explain:
The condition is "20 feet or taller", so only the tall trees are in the group. The problem lists rows, so multiply first.

Birch trees that are tall: 6 rows with 8 each, so \(6 \cdot 8 = 48\).
Maple trees that are tall: 5 rows with 9 each, so \(5 \cdot 9 = 45\).

Group: all tall trees, \(48 + 45 = 93\). Fit: tall maples, 45.

\[P = \frac{45}{93} = \frac{15}{31}\]

Choice (D), \(\frac{9}{17}\), uses one row of each kind of tree instead of all the rows. The short trees (6 and 7 per row) are not part of the group.

The answer is (C), \(\frac{15}{31}\).
```

## Hard

```task
A bag holds 120 marbles, each red, blue or green. If one marble is selected at random, the probability of selecting a red marble is 0.35 and the probability of selecting a blue marble is 0.4. All the green marbles are removed from the bag. If one of the remaining marbles is selected at random, what is the probability that it is red? (Express your answer as a decimal or fraction, not as a percent.)
answer: 7/15
- 0.35 :: That is the chance before the green marbles were removed.
- 7/8 :: You divided red by blue only. The group is red plus blue.
highlight:
- "red marble is 0.35" :: Red marbles: \(0.35 \cdot 120 = 42\).
- "blue marble is 0.4" :: Blue marbles: \(0.4 \cdot 120 = 48\).
- "All the green marbles are removed" :: The new group is red plus blue only.
explain:
Turn each probability into a count of the 120 marbles.

Red: \(0.35 \cdot 120 = 42\). Blue: \(0.4 \cdot 120 = 48\). Green is the rest: \(120 - 42 - 48 = 30\).

When all 30 green marbles are removed, only red and blue are left, so the new group has \(42 + 48 = 90\) marbles.

\[P(\text{red}) = \frac{42}{90} = \frac{7}{15}\]

The old probability, 0.35, does not apply any more, because the group changed. Dividing 42 by 48 gives \(\frac{7}{8}\), which compares red with blue instead of with all remaining marbles.

The answer is 7/15 (about .4666).
```

# Independent events
Independent events multiply. Watch for replacement.

```visual
probability--independent
```

## Key ideas

Two events are **independent** if one happening does not change the chance of the other, like a coin flip and a die roll. For independent events, "and" means multiply:

\[P(A \text{ and } B) = P(A) \cdot P(B)\]

A coin lands heads with \(\frac{1}{2}\), and a spinner with 5 equal sections stops on the shaded one with \(\frac{1}{5}\), so both happen with \(\frac{1}{2} \cdot \frac{1}{5} = \frac{1}{10}\).

Picking two items from a bag, one at a time:

- **With replacement:** the first item goes back, so the bag is the same for the second pick. The picks are independent: multiply the same fractions.
- **Without replacement:** the first item stays out, so the group is one smaller. The second fraction changes.

```example
A bag holds 3 red and 5 blue marbles. Two marbles are picked at random, without replacement. What is the probability that both are blue?
1. First blue: \(\frac{5}{8}\) :: 5 blue marbles out of 8.
2. Second blue: \(\frac{4}{7}\) :: One blue is gone: 4 of 7 are left.
3. \(\frac{5}{8} \cdot \frac{4}{7} = \frac{5}{14}\) :: Multiply the two picks.
```

```theory
**Independent** events do not affect each other. Two different coins, two spins of a spinner, and picks with replacement are independent. Events that do affect each other are **dependent**. Picks without replacement are dependent, because the first pick changes what is left.

The multiplication rule for any two events is \(P(A \text{ and } B) = P(A) \cdot P(B \text{ given } A)\). The second factor is a conditional probability: the chance of B after A has happened. For independent events, \(P(B \text{ given } A) = P(B)\), so the rule is the short one. This is why a without-replacement pick uses the next fraction, such as \(\frac{4}{7}\): that is the chance of blue given that one blue was already taken.

With replacement, a bag of 5 red and 3 blue marbles gives \(P(\text{red, red}) = \frac{5}{8} \cdot \frac{5}{8}\). Without replacement it gives \(\frac{5}{8} \cdot \frac{4}{7}\). The top and bottom both drop by 1 when the item you took is the kind you want, and only the bottom drops when it is not.

To find "different colors" or "exactly one of each", add every order. Red then blue and blue then red are two separate ways, so add their probabilities. It is often faster to use "not": the chance of different colors is 1 minus the chance both match.

"At least one" is \(1 - P(\text{none})\).

Independent-event questions are less common on the SAT, but they are quick marks if you know the rule.

Traps: adding instead of multiplying for "and", keeping the same denominator when the item is not replaced, and forgetting that the order of picks can be different.
```

## Easy

```task
A fair coin is flipped, and then a fair six-sided die with faces numbered 1 through 6 is rolled. The two results do not affect each other. What is the probability of getting heads and a number greater than 4?
* \(\frac{1}{6}\)
- \(\frac{5}{6}\) :: You added \(\frac{1}{2}\) and \(\frac{1}{3}\). "And" means multiply.
- \(\frac{1}{3}\) :: That is the die only. Multiply by the coin's \(\frac{1}{2}\).
- \(\frac{1}{12}\) :: You used only the face 6. Count 5 and 6.
highlight:
- "do not affect each other" :: The events are independent, so "and" means multiply.
- "numbered 1 through 6" :: Six faces. Greater than 4 means 5 or 6: 2 of 6.
- "heads and a number greater than 4" :: Both must happen: \(P(\text{heads}) \cdot P(5 \text{ or } 6)\).
explain:
The two results do not affect each other, so the events are independent. For independent events, "and" means multiply the probabilities.

The coin: \(P(\text{heads}) = \frac{1}{2}\).

The die: the numbers greater than 4 are 5 and 6, so 2 of the 6 faces fit and \(P = \frac{2}{6} = \frac{1}{3}\).

\[P(\text{heads and greater than 4}) = \frac{1}{2} \cdot \frac{1}{3} = \frac{1}{6}\]

Choice (B) adds the two probabilities, which is the mistake of treating "and" as "or". Choice (C) is only the die. Choice (D) counts only the face 6.

The answer is \(\frac{1}{6}\).
```

## Medium

```task
A bag contains 5 red marbles and 7 blue marbles. Two marbles are selected at random, one at a time, without replacement. What is the probability that both marbles are red?
* \(\frac{5}{33}\)
- \(\frac{25}{144}\) :: That is with replacement. The first marble stays out.
- \(\frac{5}{12}\) :: That is only the first pick. The second must be red too.
- \(\frac{4}{11}\) :: That is only the second pick, after one red is gone.
highlight:
- "5 red marbles and 7 blue marbles" :: 12 marbles. First pick red: 5 of 12.
- "without replacement" :: The first marble stays out, so the bag shrinks to 11.
- "both marbles are red" :: Multiply: first red, then red again.
explain:
There are \(5 + 7 = 12\) marbles. The first marble must be red: \(\frac{5}{12}\).

The marbles are picked without replacement, so the first red marble stays out. Now the bag has 4 red marbles out of 11 marbles, and the second pick is red with probability \(\frac{4}{11}\).

Both events must happen, so multiply:

\[\frac{5}{12} \cdot \frac{4}{11} = \frac{20}{132} = \frac{5}{33}\]

Choice (B), \(\frac{25}{144}\), is \(\frac{5}{12} \cdot \frac{5}{12}\). That would be correct with replacement. Choices (C) and (D) give only one of the two picks.

The answer is \(\frac{5}{33}\).
```

## Hard

```task
A box contains 6 red, 4 blue and 2 green marbles. Two marbles are selected at random, one at a time, without replacement. What is the probability that the two marbles are different colors? (Express your answer as a decimal or fraction, not as a percent.)
answer: 2/3
- 1/3 :: That is the chance that both marbles match. Take 1 minus it.
- 11/18 :: That is with replacement. The box shrinks after each pick.
highlight:
- "6 red, 4 blue and 2 green marbles" :: 12 marbles. Count each color.
- "without replacement" :: The box shrinks: 12 marbles, then 11.
- "different colors" :: Easier: 1 minus the chance that both match.
explain:
There are \(6 + 4 + 2 = 12\) marbles. "Different colors" has many cases (red then blue, blue then green, and so on). Use "not" instead: find the chance that both marbles match, and subtract it from 1.

The picks are without replacement, so the second fraction has 11 marbles on the bottom.

Both red: \(\frac{6}{12} \cdot \frac{5}{11} = \frac{30}{132}\).
Both blue: \(\frac{4}{12} \cdot \frac{3}{11} = \frac{12}{132}\).
Both green: \(\frac{2}{12} \cdot \frac{1}{11} = \frac{2}{132}\).

The marbles match with probability \(\frac{30 + 12 + 2}{132} = \frac{44}{132} = \frac{1}{3}\).

\[P(\text{different colors}) = 1 - \frac{1}{3} = \frac{2}{3}\]

Answer \(\frac{1}{3}\) is the chance of matching. Answer \(\frac{11}{18}\) comes from putting each marble back before the second pick.

The answer is 2/3 (or .6666 or .6667).
```
