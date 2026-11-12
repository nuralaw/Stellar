---
title: Probability and Conditional Probability
skill: probability
domain: problem-solving
section: math
summary: Find any probability from a table or a story by picking the right group to divide by, including "given that" questions.
---

## Spot a probability question

You see a group of things (a table, a bag of marbles, a list of numbers) and the words **selected at random**: every item has the same chance. The question asks for the chance that the pick has some feature.

Every probability is one fraction between 0 and 1:

probability = (how many fit) / (how many you choose from)

The division is easy. Points are won or lost on the bottom number.

```quiz
A box holds 4 red, 6 blue and 10 green pens. One pen is selected at random. What is the probability that it is blue?
- 3/7 :: You divided by the 14 pens that aren't blue. The bottom is every pen you could pick.
- 1/3 :: Three colors doesn't mean equal chances. Count pens, not colors.
* 3/10 :: Right. 6 blue pens out of 20 pens.
> All 20 pens can be picked, so the bottom is 4 + 6 + 10 = 20. Six are blue: 6/20 = 3/10.
```

## Find the group first

Before any math, ask: **out of whom** am I choosing?

1. **Find the group.** No condition means everyone. A condition shrinks it.
2. **Count** the ones in that group with the feature. That's the top.
3. **Divide** by the group's total.

> **Tip:** Rewrite the question as "Out of the ___, how many are ___?" The first blank is your denominator (the bottom number).

```quiz
"If a student who owns a bike is selected at random, what is the probability that the student also owns a skateboard?" Which number goes on the bottom?
- All students :: "A student who owns a bike" shrinks the group. Not everyone can be picked.
- Students who own a skateboard :: Skateboards are what you count inside the group. The group itself is the bike owners.
* Students who own a bike
- Students who own both :: That's the top: bike owners who also own a skateboard.
> Out of the bike owners, how many own a skateboard? The bike owners are the group, so their total goes on the bottom.
```

## Read a two-way table

A **two-way table** sorts people by two features at once. How 60 students get to school:

| | Bus | Car |
|---|---|---|
| Grade 9 | 18 | 12 |
| Grade 10 | 14 | 16 |

- An **inside cell** has both features: grade 10 *and* car = 16.
- A **row or column total** has one feature: car = 12 + 16 = 28.
- The **grand total** is everyone: 60.

```quiz
One of the 60 students is selected at random. What is the probability that the student is in grade 10 and comes by car?
- 8/15 :: That's 16/30: you divided by the grade 10 row. That answers "given grade 10".
* 4/15
- 4/7 :: That's 16/28: you divided by the car column. Nothing shrank the group here.
> There's no condition, so the group is all 60 students. "Grade 10 and car" is one cell: 16. So 16/60 = 4/15.
```

## "Given that" shrinks the group

These words mean you choose only from one group: **given that**, **of the**, **among**, **if the person is**, **one of the ___ who ___**. That group's row or column total goes on the bottom.

A class of 80 students took a test:

| | Passed | Failed |
|---|---|---|
| Studied | 45 | 5 |
| Didn't study | 15 | 15 |

```quiz
One of the students who passed is selected at random. What is the probability that the student studied?
- 9/16 :: That's 45/80, the grand total. "One of the students who passed" shrinks the group.
- 9/10 :: That's 45/50, the chance that a student who studied passed. You flipped the condition.
* 3/4
- 1/4 :: That's 15/60: right group, wrong cell. You counted the students who didn't study.
> Out of the students who passed, how many studied?
> Group: everyone who passed, 45 + 15 = 60. Inside it, 45 studied. So 45/60 = 3/4.
```

## Add every category that fits

Some questions cover more than one cell. Add every category that matches the words:

- **not A:** everything except A, or 1 − P(A)
- **at least 2:** 2 and every category above it
- **A or B:** add both, but count the overlap only once

Pets in 80 households:

| Pets | Households |
|---|---|
| 0 | 22 |
| 1 | 25 |
| 2 | 18 |
| 3 or more | 15 |

```quiz
A household with at least 1 pet is selected at random. What is the probability that it has at least 2 pets?
- 33/80 :: You divided by all 80. "With at least 1 pet" drops the 22 homes with no pets.
- 9/29 :: That's 18/58: right group, but "at least 2" also includes "3 or more".
* 33/58
- 25/58 :: That's the opposite: homes with exactly 1 pet.
> Group: at least 1 pet is 25 + 18 + 15 = 58 households. Inside it, at least 2 pets is 18 + 15 = 33. So 33/58.
```

## No table? Build one

Stories give counts or percents instead of a table. Turn them into counts first:

- **Percents:** pretend there are 100 (or 1,000) people.
- **"In each of 3 classes":** multiply to get the full count.

Then find the group and divide as usual.

```quiz
At a school, 60% of students ride the bus. Of the bus riders, 25% live more than 5 miles away. Of the other students, 10% live more than 5 miles away. A student who lives more than 5 miles away is selected at random. What is the probability that the student rides the bus?
- 3/20 :: That's 15 out of all 100 students. The group is only the students who live far away.
- 1/4 :: That's 25%, the chance that a bus rider lives far away. You flipped the condition.
- 19/100 :: That's the chance that any student lives far away. It's the size of the group, not the answer.
* 15/19
> Pretend there are 100 students. Bus: 60, and 25% of 60 = 15 live far away. Others: 40, and 10% of 40 = 4 live far away.
> Group: the 15 + 4 = 19 students who live far away. Inside it, 15 ride the bus. So 15/19.
```

## Work backward to a count

Some questions give the probability and ask for a count.

- **count = probability × total.** If P(red) = 0.3 and there are 50 cards, there are 0.3 × 50 = 15 red cards.
- If the total is unknown, write an equation: P(red) = red ÷ total. A missing count is part of the total too: n red and 12 blue give n/(n + 12).

```quiz
A jar holds only red and blue marbles. There are 12 red marbles. If one marble is selected at random, the probability that it is red is 3/8. How many blue marbles are in the jar?
- 32 :: That's every marble in the jar. Subtract the 12 red ones.
* 20
- 4.5 :: You multiplied 12 by 3/8. That works only when 12 is the total, and it isn't.
> 12/total = 3/8, so total = 12 × 8/3 = 32 marbles. Blue = 32 − 12 = 20. Check: 12/32 = 3/8.
```

## The trap: the flipped condition

> **Trap:** "the chance a driver is a senior" and "the chance a senior drives" are different numbers, and the test puts both in the choices. The group after **given** or **of the** is the bottom. Point at it before you divide.

| | Drives | Doesn't drive |
|---|---|---|
| Junior | 10 | 50 |
| Senior | 30 | 20 |

```quiz
Using the table, what is the probability that a randomly selected driver is a senior?
- 3/5 :: The trap. 30/50 is the chance that a senior drives. You divided by seniors, not drivers.
- 3/11 :: That's 30/110, the grand total. "A driver" limits the group.
* 3/4
- 1/4 :: Right group, wrong cell: 10/40 counts the juniors.
> The group is the drivers: 10 + 30 = 40. Inside it, 30 are seniors. So 30/40 = 3/4.
```

## Your turn: easy

Is there a condition? If not, the group is everyone.

```check
m-1278
```

## Your turn: medium

Find the group after "given that" first. Its total goes on the bottom.

```check
m-1503
```

## Your turn: hard

No table here, so build the counts first. Then divide by the group you're given.

```check
m-1246
```

## Recap

- Find the group you choose from. No condition: everyone.
- "Given that", "of the", "among" or "who": only that group.
- Count inside the group, then divide by the group's total.
- "And" is one cell. "Not", "or" and "at least" add cells.
- No table? Pretend there are 100 people and build the counts.
- Check: between 0 and 1, and not the flipped condition.
