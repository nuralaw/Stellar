---
title: Percentages
skill: percentages
domain: problem-solving
section: math
summary: Turn any percent change into one multiplier, then multiply or divide.
---

# One multiplier
Up 20% is × 1.2. Down 20% is × 0.8.

## Percent to multiplier

**Up r%: × (1 + r/100). Down r%: × (1 − r/100).**

```example
A ticket costs $50. The price rises 20%. What is the new price?
1. 100% + 20% = 120% = 1.2 :: The old price is 100%. Add the rise.
2. 50 × 1.2 = 60 :: Multiply the old price.
3. New price: $60
```

## 8% off? Keep 92%.

```quiz
A $25 shirt is 8% off. What is the sale price?
- $2 :: That's the discount. You pay what's left: 92%.
- $5 :: 8% is 0.08, not 0.8. You keep 92%.
* $23
> 100% − 8% = 92%, so multiply by 0.92: 25 × 0.92 = 23.
```

# Over 100%
Up 150% is × 2.5, not × 1.5.

## Keep the original 100%

Up 300% means 100% + 300% = 400%: **× 4, not × 3.**

```example
A town of 200 people grows 300%. What is the new population?
1. 100% + 300% = 400% = 4 :: Add the rise to the original 100%.
2. 200 × 4 = 800 :: Multiply.
3. New population: 800
```

## Rise of 150%

```quiz
A $40 stock rises 150%. What is its new price?
- $60 :: That's 150% *of* $40. A rise adds it to the original.
* $100
- $190 :: You added 150 dollars. 150% of $40 is $60.
> 100% + 150% = 250%, so multiply by 2.5: 40 × 2.5 = 100.
```

# Going back
Know the result? Divide by the multiplier.

## Divide to go back

**old = new ÷ multiplier.**

```example
After a 10% discount, a bag costs $72. What was the original price?
1. old × 0.9 = 72 :: 10% off keeps 90%.
2. old = 72 ÷ 0.9 = 80 :: Divide by the multiplier.
3. Original price: $80
```

## Before the raise

```quiz
After a 25% raise, Mia earns $60 an hour. What did she earn before?
- $45 :: You subtracted 25% of $60, not 25% of the old pay.
* $48
- $75 :: That's another 25% raise. Go back: divide by 1.25.
> old × 1.25 = 60, so old = 60 ÷ 1.25 = 48.
~ type y=1.25x :: x is the old pay. A 25% raise is × 1.25.
~ type y=60 :: The new pay.
~ zoom 0 80 0 80
~ point (48, 60) :: Click the crossing: x = 48.
```

# Percent change
new ÷ old is the multiplier.

## New over old

**new ÷ old** is the multiplier. 1.08 means up 8%; 0.92 means down 8%.

```example
A plant grows from 20 cm to 23 cm. What is the percent increase?
1. 23 ÷ 20 = 1.15 :: New over old.
2. 1.15 − 1 = 0.15 :: Subtract 1.
3. Up 15%
```

## How far did it fall?

```quiz
A store sold 50 umbrellas in March and 40 in April. By what percent did sales fall?
* 20%
- 25% :: You divided by 40, the new value. Divide by the old.
- 80% :: April is 80% of March. The fall is 100% − 80%.
> 40 ÷ 50 = 0.8, which is 0.2 below 1: a 20% fall.
~ type y=50(1-\frac{x}{100}) :: 50 falls by x percent.
~ type y=40 :: April's sales.
~ zoom 0 50 0 60
~ point (20, 40) :: Click the crossing: x = 20, a 20% fall.
```

# Trap: adding percents
Two changes? Multiply the multipliers. Never add.

## Multiply, never add

Up 20%, then down 20% doesn't cancel. **Multiply the multipliers.**

```example
A $100 coat goes up 20%, then down 20%. What is the final price?
1. 100 × 1.2 = 120 :: Up 20%.
2. 120 × 0.8 = 96 :: Down 20% of the bigger price.
3. $96: a 4% loss, not $100
```

## Net change

```quiz
A price rises 50%, then falls 30%. What is the net change?
* Up 5%
- Up 20% :: Trap: 50 − 30. The 30% is taken from the bigger price.
- Up 105% :: 1.05 is the multiplier. Subtract 1 to get the change.
> 1.5 × 0.7 = 1.05, and 1.05 means up 5%.
```

## Back to the start

```quiz
A price rises 20%, then falls 20%. It ends at $48. What was the starting price?
- $48 :: Trap: up 20%, then down 20% doesn't cancel.
* $50
- $46.08 :: You applied both changes again. Go back: divide by 0.96.
> 1.2 × 0.8 = 0.96, so start = 48 ÷ 0.96 = 50.
~ type y=1.2\cdot0.8x :: x is the starting price. Multiply both multipliers.
~ type y=48 :: The final price.
~ zoom 0 80 0 80
~ point (50, 48) :: Click the crossing: x = 50.
```

# Real SAT questions
Three real questions, easy to hard.

## Your turn: easy

Result given? Divide by the multiplier.

```check
m-1386
```

## Your turn: medium

Find the original, then answer what's asked.

```check
m-1459
```

## Your turn: hard

Multiply the two multipliers, then subtract 1.

```check
m-1569
```
