---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Find the group you pick from, count what fits inside it, and divide.
---

# Pick the group
Probability = fit ÷ group. "Given that" shrinks the group.

## Find the group first

**Probability = how many fit ÷ the group you pick from.**

| | Car | Bus |
|---|---|---|
| Grade 9 | 6 | 18 |
| Grade 10 | 14 | 12 |

```example
The table shows how 50 students get to school. One student is picked at random. What is the probability that the student is in grade 9, given that the student takes the bus?
1. Group: bus riders = 18 + 12 = 30 :: Only the Bus column counts.
2. Fit: grade 9 on the bus = 18 :: Count inside the group only.
3. Probability = 18/30 = 3/5 :: Fit ÷ group.
```

## Find the group yourself

| | Car | Bus |
|---|---|---|
| Grade 9 | 6 | 18 |
| Grade 10 | 14 | 12 |

```quiz
Same 50 students. A grade 10 student is picked at random. What is the probability that the student takes the car?
- 7/10 :: That's 14/20: you divided by the car riders.
* 7/13
- 7/25 :: That's 14/50: you divided by all the students.
> The group is grade 10: 12 + 14 = 26. Of them, 14 take the car: 14/26 = 7/13.
~ type \frac{14}{12+14} :: Fit on top, the whole group below: 0.538…
~ type \frac{7}{13} :: Type a choice. Same decimal, so it matches.
~ type \frac{7}{10} :: 0.7 is different. Not this one.
```

# Add the rows
"At least" and "not" cover several rows.

## Add every row that fits

| Books read | Students |
|---|---|
| 0 | 4 |
| 1 | 6 |
| 2 | 7 |
| 3 or more | 3 |

```example
One of the 20 students is picked at random. What is the probability that the student read at least 2 books?
1. Fit: 7 + 3 = 10 :: "At least 2" is two rows.
2. Group: all 20 students :: No "given that".
3. Probability = 10/20 = 1/2
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
- 3/10 :: That's 15/50. Homes with 0 pets are out of the group.
- 9/40 :: "At least 2" includes "3 or more" too: 9 + 6.
* 3/8
> Group, at least 1 pet: 25 + 9 + 6 = 40. Fit, at least 2: 9 + 6 = 15. So 15/40 = 3/8.
~ type \frac{9+6}{25+9+6} :: Rows that fit on top, the group's rows below: 0.375.
~ type \frac{3}{8} :: Also 0.375. That's the choice.
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

## Count it yourself

```quiz
A box holds 200 pens, each red, blue or green. One pen is picked at random. The probability that it is red is 0.45. The probability that it is blue is 0.3. How many pens are green?
* 50
- 25 :: 0.25 is the probability of green. Multiply by 200.
- 150 :: That's red and blue together. Green is the rest.
> Green: 1 − 0.45 − 0.3 = 0.25. Count: 0.25 × 200 = 50.
~ type 1-0.45-0.3 :: The rest of 1 is green: 0.25.
~ type 200(1-0.45-0.3) :: Times the total: 50 pens.
```

# "Each"? Multiply first
Turn "each" into totals before you divide.

## Multiply into totals

```example
A bakery has 5 trays of muffins and 3 trays of cookies. Each muffin tray holds 2. Each cookie tray holds 10. One item is picked at random. What is the probability that it is a muffin?
1. Muffins: 5 × 2 = 10 :: Trays × each.
2. Cookies: 3 × 10 = 30
3. Probability = 10/40 = 1/4 :: You pick an item, not a tray.
```

## Multiply it yourself

```quiz
A shop has 4 shelves of tea and 2 shelves of coffee. Each tea shelf holds 3 boxes. Each coffee shelf holds 9 boxes. One box is picked at random. What is the probability that it is tea?
* 2/5
- 2/3 :: That's 4 of 6 shelves. You pick a box, not a shelf.
- 1/4 :: That's one shelf of each: 3 of 12. Multiply first.
> Tea: 4 × 3 = 12 boxes. Coffee: 2 × 9 = 18. So 12/30 = 2/5.
~ type \frac{4\cdot 3}{4\cdot 3+2\cdot 9} :: Tea boxes over all boxes: 0.4.
~ type \frac{2}{5} :: Also 0.4. That's the choice.
```

# Trap: the flipped group
Same two numbers, different group, different answer.

## Who do you pick from?

The chance a chess player is a girl ≠ the chance a girl plays chess.

```example
A club has 20 girls, and 8 of them play chess. In all, 10 members play chess. A chess player is picked at random. What is the probability that the player is a girl?
1. Group: the 10 chess players :: You pick from them.
2. Fit: 8 girls who play :: Inside the group.
3. Probability = 8/10 = 4/5 :: Not 8/20.
```

## Spot the group

```quiz
A school has 50 seniors, and 30 of them drive. In all, 40 students drive. A student who drives is picked at random. What is the probability that the student is a senior?
- 3/5 :: Trap: 30/50 is the chance that a senior drives.
* 3/4
- 4/5 :: That's drivers ÷ seniors. The top must be senior drivers: 30.
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
