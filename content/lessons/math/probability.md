---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Find the group you pick from, count what fits inside it, and divide.
---

## Find the group first

**Probability = how many fit ÷ the group you pick from.** "Given that" shrinks the group.

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
* 7/13
- 7/10 :: That's 14/20: you divided by the car riders.
- 7/25 :: That's 14/50: you divided by all the students.
> The group is grade 10: 12 + 14 = 26. Of them, 14 take the car: 14/26 = 7/13.
```

## Add every row that fits

"At least" and "not" can cover several rows.

| Pets | Homes |
|---|---|
| 0 | 10 |
| 1 | 25 |
| 2 | 9 |
| 3 or more | 6 |

```quiz
A home is picked at random. What is the probability that it has at least 2 pets, given that it has at least 1 pet?
* 3/8
- 3/10 :: That's 15/50. Homes with 0 pets are out of the group.
- 9/40 :: "At least 2" includes "3 or more" too: 9 + 6.
> Group, at least 1 pet: 25 + 9 + 6 = 40. Fit, at least 2: 9 + 6 = 15. So 15/40 = 3/8.
```

## From probability to count

**Count = probability × total.** All the probabilities add up to 1.

```quiz
A box holds 200 pens, each red, blue or green. One pen is picked at random. The probability that it is red is 0.45. The probability that it is blue is 0.3. How many pens are green?
* 50
- 25 :: 0.25 is the probability of green. Multiply by 200.
- 150 :: That's red and blue together. Green is the rest.
> Green: 1 − 0.45 − 0.3 = 0.25. Count: 0.25 × 200 = 50.
```

## "Each"? Multiply first

Counts for **each** shelf or row? Multiply into totals first.

```quiz
A shop has 4 shelves of tea and 2 shelves of coffee. Each tea shelf holds 3 boxes. Each coffee shelf holds 9 boxes. One box is picked at random. What is the probability that it is tea?
* 2/5
- 2/3 :: That's 4 of 6 shelves. You pick a box, not a shelf.
- 1/4 :: That's one shelf of each: 3 of 12. Multiply first.
> Tea: 4 × 3 = 12 boxes. Coffee: 2 × 9 = 18. So 12/30 = 2/5.
```

## Trap: the flipped group

The chance a driver is a senior ≠ the chance a senior drives.

```quiz
A school has 50 seniors, and 30 of them drive. In all, 40 students drive. A student who drives is picked at random. What is the probability that the student is a senior?
* 3/4
- 3/5 :: Trap: 30/50 is the chance that a senior drives.
- 4/5 :: That's drivers ÷ seniors. The top must be senior drivers: 30.
> You pick from the 40 drivers. 30 of them are seniors: 30/40 = 3/4.
```

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

## Recap

- Find the group first. "Given that" shrinks it.
- Probability = how many fit ÷ the group.
- Count = probability × total. "Each": multiply first.
