---
title: Ratios, Rates, Proportions, and Units
skill: ratios-rates
domain: problem-solving
section: math
summary: Set up ratio, rate, unit conversion, density and scale questions so the units cancel and the answer comes out right.
---

## Spot it: units on every number

Short word problems about recipes, speeds, prices, maps or mass. Clues: *ratio of A to B*, *per*, *at this rate*, *proportional*, *density*, or a conversion in parentheses like (1 mile = 1,760 yards).

Almost every mistake here is a **setup** mistake, so:

1. Write the target with its unit: "? liters".
2. Write every number with its unit: 18 liters per 4 minutes.
3. For *at this rate*, find the **unit rate** (the amount for one unit), then multiply.

```quiz
A pump fills 18 liters in 4 minutes. At this rate, how many liters does it fill in 10 minutes?
- About 2.2 :: Liters and minutes swapped places on one side. Keep liters on top on both sides: 18/4 = x/10.
- 180 :: The 18 liters took 4 minutes, not 1. Divide by 4 first.
* 45
> Unit rate: 18 ÷ 4 = 4.5 liters per minute.
> In 10 minutes: 4.5 × 10 = 45 liters.
```

## Ratio with a total: use k

If red : blue = 3 : 5, call the parts **3k** and **5k**, where k is the size of one part. The total is 8k and the difference is 2k. Solve for k, then multiply.

Red is 3/8 of the whole, **not 3/5**. The ratio 3 : 5 compares two parts, not a part and the total.

```quiz
A jar holds only red and blue beads. The ratio of red beads to blue beads is 3 to 5, and there are 64 beads in all. How many red beads are there?
- 8 :: That's k, the size of one part. Red is 3k.
- 40 :: That's the blue beads. Reread what's asked.
- 38.4 :: 3 : 5 is part to part. Red is 3/8 of the total, not 3/5.
* 24
> 3k + 5k = 8k = 64, so k = 8.
> Red = 3k = 24. Check: blue = 5k = 40, and 24 + 40 = 64 ✓
```

## Convert with fractions equal to 1

A **conversion factor** is a fraction worth 1, like (3 ft)/(1 yd) or (1 yd)/(3 ft). Pick the version that puts the unit you want gone on the **opposite** level (top or bottom), so it cancels. Chain as many as you need.

Size check: a smaller unit means a bigger number.

```quiz
A garden hose is 1,080 inches long. How long is it in yards? (1 foot = 12 inches and 1 yard = 3 feet)
- 90 :: That's the length in feet. One more step: feet to yards.
- 270 :: The second factor is upside down. To cancel feet, use (1 yd)/(3 ft): divide by 3.
- 38,880 :: Both factors are upside down. Yards are bigger than inches, so the number must get smaller.
* 30
> 1,080 in × (1 ft)/(12 in) × (1 yd)/(3 ft) = 1,080 ÷ 12 ÷ 3 = 30 yards.
> Inches cancel, feet cancel, and yards are left.
```

## A rate needs two conversions

In meters per second, **both** units may need to change: the top (meters) and the bottom (seconds). Give each one its own factor. And 1 hour = 60 × 60 = **3,600** seconds.

> **Tip:** In Desmos, type the multiplications first and the division last, like `6*3600/1000`. Everything typed after `/` goes into the bottom of the fraction until you press the right arrow key.

```quiz
A drone flies at 6 meters per second. What is its speed in kilometers per hour? (1 kilometer = 1,000 meters)
- 0.36 :: You used 60 seconds per hour. An hour is 60 × 60 = 3,600 seconds.
- 21,600 :: That's meters per hour. You still need to turn meters into kilometers.
- 0.006 :: You converted only the top unit. That's kilometers per second.
* 21.6
> Target: kilometers per hour. Convert the top and the bottom:
> 6 m/s × (3,600 s)/(1 h) × (1 km)/(1,000 m) = 6 × 3,600 ÷ 1,000 = 21.6 km/h.
> Seconds cancel and meters cancel, which leaves kilometers per hour.
```

## Letters? Treat them like numbers

Some rates use letters: *a printer makes p pages in m minutes*. Do exactly what you'd do with numbers. The unit rate is p/m pages per minute; then multiply by the time, in the **same unit**.

To check, plug in easy numbers for the letters and compare the choices.

```quiz
A bakery fills 6c boxes in t hours, where c and t are positive constants. At this rate, how many boxes does it fill in 20 minutes?
- t/(18c) :: That uses hours per box, the rate upside down.
- 120c/t :: You multiplied by 20 as if it were 20 hours. 20 minutes is 1/3 hour.
- 2ct :: The unit rate is 6c ÷ t. You multiplied by t instead of dividing.
* 2c/t
> Unit rate: 6c/t boxes per hour. Time in hours: 20 minutes = 1/3 hour.
> Boxes: (6c/t) × 1/3 = 2c/t.
> Check: c = 3 and t = 2 mean 18 boxes in 2 hours, or 9 per hour, so 3 in 20 minutes. And 2(3)/2 = 3 ✓
```

## Area and volume: square or cube

1 yd = 3 ft, so a square yard is a 3-by-3 grid: **9** ft². A cubic yard is 3 × 3 × 3 = **27** ft³.

| Length | Area | Volume |
|---|---|---|
| 1 yd = 3 ft | 1 yd² = 9 ft² | 1 yd³ = 27 ft³ |
| 1 ft = 12 in | 1 ft² = 144 in² | 1 ft³ = 1,728 in³ |
| 1 m = 100 cm | 1 m² = 10,000 cm² | 1 m³ = 1,000,000 cm³ |

Maps and models work the same way: if 1 cm stands for 4 km, then 1 cm² stands for 16 km².

```quiz
A floor has an area of 30 square yards. Tile costs $4 per square foot. How much does tile for the whole floor cost? (1 yard = 3 feet)
- $120 :: You treated square yards as square feet. Convert first.
- $360 :: You multiplied by 3 once. Square units need the factor twice: 1 yd² = 9 ft².
* $1,080
- $3,240 :: 27 is the factor for cubic yards. A floor is an area, so use 9.
> 30 yd² × 9 ft² per yd² = 270 ft².
> 270 ft² × $4 per ft² = $1,080.
```

## Density: amount per size

**Density = mass ÷ volume**, in units like grams per cubic centimeter (g/cm³). **Population density = people ÷ area**. Rearrange as needed: mass = density × volume.

Same material means same density, so you can find it from one object and use it for another.

```quiz
A solid metal cube has edges 2 centimeters long and a mass of 64.8 grams. What is its density, in grams per cubic centimeter?
- 32.4 :: You divided by the edge, 2 cm. Density needs the volume: 2³ = 8 cm³.
- 16.2 :: 2² = 4 is the area of one face. A cube's volume is 2³ = 8.
* 8.1
- About 0.12 :: That's volume ÷ mass, upside down. Density is mass ÷ volume.
> Volume: 2 × 2 × 2 = 8 cm³.
> Density: 64.8 g ÷ 8 cm³ = 8.1 g/cm³.
```

## The trap: seconds squared

Hard questions hide a squared unit inside a rate. Read the unit word by word before you convert.

```quiz
A car's speed increases at a rate of 3 meters per second squared. What is this rate in meters per minute squared?
- 180 :: Trap: you used 60 once. "Per second squared" means per second per second, so the factor 60 is needed twice.
- 0.05 :: A minute is longer than a second, so the rate per minute squared is bigger. Multiply, don't divide.
* 10,800
> m/s² means meters per second per second. Each "per second" needs its own (60 s)/(1 min).
> 3 × 60 × 60 = 10,800 meters per minute squared.
```

## Your turn: easy

Find the unit rate first, then use it.

```check
m-1309
```

## Your turn: medium

Chain the conversion factors so each unit cancels.

```check
m-1451
```

## Your turn: hard

Square units take the length factor twice, and the time unit needs its own factor.

```check
m-1510
```

## Recap

- Write the target unit, and a unit next to every number.
- Ratio with a total: the parts are 3k and 5k, and the whole is 8k.
- At this rate: find the unit rate, then multiply, with the time in matching units.
- Convert with fractions equal to 1. A rate needs one for the top unit and one for the bottom.
- Area: square the factor. Volume: cube it. Per second squared: 60 × 60.
- Check the size of the answer, and answer in the unit asked.
