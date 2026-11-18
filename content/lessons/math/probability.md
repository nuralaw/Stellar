---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Find the group you pick from, count what fits inside it, and divide.
---

# Pick the group
Probability = fit ÷ group. "Given that" names the group.

## Find the group first

**Probability = how many fit ÷ the group you pick from.** Totals are in the last row and column.

```visual
probability--table
```

```example
The table shows how 50 students get to school. One student is picked at random. What is the probability that the student is in grade 9, given that the student takes the bus?
1. Group: bus riders = 30 :: The Bus column total.
2. Fit: grade 9 on the bus = 18 :: Count inside the group only.
3. Probability = 18/30 = 3/5 :: Fit ÷ group.
```

```more
**Probability**: how likely something is, as a fraction from 0 to 1. "Given that the student takes the bus" means: only look at bus riders. They are now your whole group. The Total row and Total column save you from adding.
```

## Find the group yourself

| | Car | Bus | Total |
|---|---|---|---|
| Grade 9 | 6 | 18 | 24 |
| Grade 10 | 14 | 12 | 26 |
| Total | 20 | 30 | 50 |

```quiz
Same 50 students. A grade 10 student is picked at random. What is the probability that the student takes the car?
- 7/10 :: That is 14/20: you divided by the car riders.
* 7/13
- 7/25 :: That is 14/50: you divided by all the students.
> The group is grade 10: the row total is 26. Of them, 14 take the car: 14/26 = 7/13.
~ type \frac{14}{26} :: Fit on top, the whole group below: 0.538…
~ type \frac{7}{13} :: Type a choice. Same decimal, so it matches.
~ type \frac{7}{10} :: 0.7 is different. Not this one.
```

# Or, and not
"Or" and "at least" add rows. "Not" is 1 minus.

## Add every row that fits

"At least" or "or": add the rows. "Not": everything else.

| Books read | Students |
|---|---|
| 0 | 4 |
| 1 | 6 |
| 2 | 7 |
| 3 or more | 3 |
| Total | 20 |

```example
One of the 20 students is picked at random. What is the probability that the student read at least 2 books?
1. Fit: 7 + 3 = 10 :: "At least 2" is two rows.
2. Group: all 20 students :: No "given that".
3. Probability = 10/20 = 1/2
```

```more
"At least 2" means 2, or 3, or more. "Not 0" means 1, 2, or 3 or more: add those rows, or do 1 − (the probability of 0). Both ways give the same answer. Add rows only: rows never overlap, so each home is in one row. Never add a row total and a column total, because one home can be in both.
```

## Add the rows yourself

| Pets | Homes |
|---|---|
| 0 | 10 |
| 1 | 25 |
| 2 | 9 |
| 3 or more | 6 |

```quiz
A home is picked at random. What is the probability that it has at least 2 pets, given that it has at least 1 pet?
- 3/10 :: That is 15/50. Homes with 0 pets are out of the group.
- 9/40 :: "At least 2" includes "3 or more" too: 9 + 6.
* 3/8
> Group, at least 1 pet: 25 + 9 + 6 = 40. Fit, at least 2: 9 + 6 = 15. So 15/40 = 3/8.
~ type \frac{9+6}{25+9+6} :: Rows that fit on top, the group's rows below: 0.375.
~ type \frac{3}{8} :: Also 0.375. That is the choice.
```

## Say "not"

```quiz
Of 50 homes, 10 have 0 pets, 25 have 1, 9 have 2 and 6 have 3 or more. A home is picked at random. What is the probability that it does not have 0 pets?
answer: 4/5
- 1/5 :: That is the chance of 0 pets. "Not" means 1 minus that.
- 3/10 :: That is only the homes with 2 or more pets.
> Not 0 pets: 25 + 9 + 6 = 40 homes. 40/50 = 4/5. Or 1 − 10/50 = 4/5.
~ type 1-\frac{10}{50} :: Total 1 minus the chance of 0 pets: 0.8.
```

# Fill a missing cell
Each row and column adds to its Total.

## Use the totals

Each row and column adds up to its **Total**. Use that to find a missing cell.

```visual
probability--missing
```

```example
The table shows 50 students. What is the probability that a student who has a cat is in grade 9?
1. Missing cell: 30 − 12 = 18 :: Row total minus the known cell.
2. Group: students with a cat = 30 :: The Cat column total.
3. Probability = 18/30 = 3/5
```

```more
The table adds in both directions. Grade 9: 12 + ? = 30. Check with the column: 18 + 12 = 30. Always fill the missing cell first, from the row or the column that has only one unknown. Then find the group and the fit.
```

## Fill it yourself

| | Tutor | No tutor | Total |
|---|---|---|---|
| Juniors | 15 | ? | 40 |
| Seniors | 20 | 20 | 40 |
| Total | 35 | 45 | 80 |

```quiz
One of the 80 students is picked at random. What is the probability that the student is a junior, given that the student has no tutor?
answer: 5/9
- 5/8 :: You divided by all 40 juniors. The group is "no tutor".
- 5/16 :: You divided by all 80 students. Use the given group.
> Juniors with no tutor: 40 − 15 = 25. Group: no tutor = 45. So 25/45 = 5/9.
~ type \frac{40-15}{45} :: Missing cell on top, the No tutor total below: 0.555…
```

# Probability to count
Count = probability × total.

## Turn probability into a count

All the probabilities add up to 1.

```example
A bag holds 60 marbles, each red, blue or yellow. The probability of picking red is 0.5, and blue is 0.2. How many marbles are yellow?
1. Yellow: 1 − 0.5 − 0.2 = 0.3 :: The rest of 1.
2. Count: 0.3 × 60 = 18 :: Probability × total.
```

```more
A probability of 0.3 means 3 out of every 10. So 0.3 of 60 marbles is 18 marbles. The probabilities of all the possible results add to 1, so "the rest" is 1 minus the others.
```

## Count it yourself

```quiz
A box holds 200 pens, each red, blue or green. One pen is picked at random. The probability that it is red is 0.45. The probability that it is blue is 0.3. How many pens are green?
answer: 50
- 25 :: 0.25 is the probability of green. Multiply by 200.
- 150 :: That is red and blue together. Green is the rest.
> Green: 1 − 0.45 − 0.3 = 0.25. Count: 0.25 × 200 = 50.
~ type 1-0.45-0.3 :: The rest of 1 is green: 0.25.
~ type 200(1-0.45-0.3) :: Times the total: 50 pens.
```

# Count items, not shelves
Multiply each row into items. Then divide.

## Multiply into totals

```example
A bakery has 5 trays of muffins and 3 trays of cookies. Each muffin tray holds 2. Each cookie tray holds 10. One item is picked at random. What is the probability that it is a muffin?
1. Muffins: 5 × 2 = 10 :: Trays × each.
2. Cookies: 3 × 10 = 30
3. Probability = 10/40 = 1/4 :: You pick an item, not a tray.
```

```more
The question picks one item, so the group is all items, not all trays. Turn "each" into totals first: trays × items per tray. Then use fit ÷ group on the items. Counting trays instead (5 of 8) is the trap.
```

## Multiply it yourself

```quiz
A shop has 4 shelves of tea and 2 shelves of coffee. Each tea shelf holds 3 boxes. Each coffee shelf holds 9 boxes. One box is picked at random. What is the probability that it is tea?
* 2/5
- 2/3 :: That is 4 of 6 shelves. Pick a box, not a shelf.
- 1/4 :: That is one shelf of each: 3 of 12. Multiply first.
> Tea: 4 × 3 = 12 boxes. Coffee: 2 × 9 = 18. So 12/30 = 2/5.
~ type \frac{4\cdot 3}{4\cdot 3+2\cdot 9} :: Tea boxes over all boxes: 0.4.
~ type \frac{2}{5} :: Also 0.4. That is the choice.
```

## Add "given that"

```quiz
3 tea shelves and 4 coffee shelves hold boxes. Each tea shelf: 5 loose, 3 bagged. Each coffee shelf: 2 loose, 6 bagged. A box is picked at random. What is the probability it is coffee, given it is bagged?
answer: 8/11
- 4/7 :: That is 4 of 7 shelves. Count bagged boxes instead.
- 3/7 :: That is 24/56: you divided by all boxes. Use bagged boxes.
> Bagged tea: 3 × 3 = 9. Bagged coffee: 4 × 6 = 24. Group: 33. So 24/33 = 8/11.
~ type \frac{4\cdot 6}{3\cdot 3+4\cdot 6} :: Bagged coffee over all bagged boxes: 0.727…
```

# Trap: the flipped group
Same two numbers, different group, different answer.

## Who do you pick from?

A chess player picked from the club is not the same as a girl picked from the club.

```visual
probability--flipped
```

```example
A club has 30 members. 20 are girls. 10 play chess, and 8 of them are girls. A chess player is picked at random. What is the probability that the player is a girl?
1. Group: the 10 chess players :: The Chess column total.
2. Fit: 8 girls who play chess :: Inside the group.
3. Probability = 8/10 = 4/5 :: Not 8/20.
```

```more
Read the sentence for "picked" and "given that". The group is whatever comes right after. Here the player is picked from chess players, so the group is the Chess column (10). If a girl were picked, the group would be the Girls row (20). Same 8 on top, different bottom.
```

## Spot the group

```quiz
A school has 50 seniors, and 30 of them drive to school. In all, 40 students drive to school. One student who drives is picked at random. What is the probability that the student is a senior?
answer: 3/4
- 3/5 :: Trap: 30/50 is the chance that a senior drives.
- 4/5 :: That is drivers ÷ seniors. The top must be senior drivers: 30.
> You pick from the 40 drivers. 30 of them are seniors: 30/40 = 3/4.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

No "given that" here: the group is everyone.

```check
m-1278
```

## Your turn: medium

Which columns are "at least 10"? Add them.

```check
m-1503
```

## Your turn: hard

Multiply each row into totals, then find the group.

```check
m-1246
```
