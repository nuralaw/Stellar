---
title: Ratios, Rates, Proportions, and Units
skill: ratios-rates
domain: problem-solving
section: math
summary: Set up rates, ratios, scales and conversions so the units cancel.
---

# Rates and units
Write every unit. Multiply so they cancel.

```visual
ratios-rates
```

## Key ideas
A **rate** compares two different quantities, such as liters per minute. The word *per* (also *each*, *every*, *in*) marks the fraction bar: 15 liters in 3 minutes is \(\frac{15\ \text{L}}{3\ \text{min}}\). Divide to get the **unit rate**, the amount for exactly 1 of the bottom unit: 5 liters per minute.

To use a rate, multiply it by the amount you are given and let the units cancel:

\[\text{amount} = \text{rate} \times \text{time}\]

Need the time instead? Divide: \(\text{time} = \text{amount} \div \text{rate}\). Write the unit next to every number. The unit left over after cancelling must be the one the question asks for.

Rates also come with letters: "87 millimeters every \(m\) months" is \(\frac{87}{m}\) millimeters per month. Two machines running at the same time? **Add their rates.**

The classic trap is multiplying when you should divide. Estimate first: more time means a bigger amount.

```example
A pump fills 15 liters in 3 minutes. At this rate, how many liters does it fill in 8 minutes?
1. \(\frac{15\ \text{L}}{3\ \text{min}} = 5\ \frac{\text{L}}{\text{min}}\) :: The unit rate: divide.
2. \(5\ \frac{\text{L}}{\text{min}} \times 8\ \text{min}\) :: Minutes cancel.
3. 40 liters :: Only liters are left.
```

```theory
A **ratio** compares two quantities of the same kind (boys to girls). A **rate** compares quantities with different units (miles to hours). A **unit rate** has 1 on the bottom, so it is the single number you multiply by. Speed is a rate: distance divided by time. So are price per item, words per minute and people per square mile.

Why do units cancel? Units multiply and divide just like numbers: \(\frac{\text{L}}{\text{min}} \times \text{min} = \text{L}\). If the wrong unit is left over, the rate is upside down.

One idea, three questions:
- Find the amount: rate times time.
- Find the time: amount divided by rate.
- Find the rate: amount divided by time.

When a question uses letters, treat them like numbers. If a candle burns 6 cm every \(h\) hours, one hour burns \(\frac{6}{h}\) cm. In \(d\) days there are \(24d\) hours, so it burns \(\frac{6}{h} \times 24d = \frac{144d}{h}\) cm. Change days to hours first.

**Combined rates.** When two taps fill one tub together, their rates add, because both put water in during the same minute. If tap A makes 6 L per minute and tap B makes 2 L per minute, together they make 8 L per minute. Do not average the rates and do not add the times.

The SAT words rates many ways: "at this rate", "constant speed", "per", "each", "on average". They all mean the same unit-rate idea.
```

## Easy
```task
bank: m-1309
highlight:
- "12 pounds of cherries in 3 minutes" :: This is the rate: 12 pounds per 3 minutes, which is 4 pounds per minute.
- "96 pounds of cherries" :: This is the amount. Divide it by the rate to get time.
- "how many minutes" :: The answer unit is minutes, so amount divided by rate.
explain:
Write the rate with units: \(\frac{12\ \text{lb}}{3\ \text{min}} = 4\) pounds per minute.

The question gives an amount (96 pounds) and asks for time. Divide the amount by the rate, so that pounds cancel:

\[\frac{96\ \text{lb}}{4\ \text{lb/min}} = 24\ \text{min}\]

Check: 96 pounds is 8 times 12 pounds, so it takes 8 times as long as 3 minutes, and \(8 \times 3 = 24\). Choice D (36) multiplies the time by 12 instead. The answer is 24.
```

## Medium
```task
bank: m-1397
highlight:
- "87 millimeters every m months" :: The rate: 87 mm for each m months, so 87 over m mm per month.
- "every k years" :: The time is k years. Change years to months first.
- "number of millimeters" :: The answer is a length in mm: rate in mm per month times months.
explain:
First write the rate per month: 87 mm every \(m\) months is \(\frac{87}{m}\) mm per month.

The question asks about \(k\) years. One year has 12 months, so \(k\) years is \(12k\) months.

Multiply the rate by the time so that months cancel:

\[\frac{87}{m}\ \frac{\text{mm}}{\text{month}} \times 12k\ \text{months} = \frac{1044k}{m}\ \text{mm}\]

Check with numbers: let \(m = 3\) and \(k = 1\). The plant grows 29 mm per month, so 348 mm in a year, and \(\frac{1044 \cdot 1}{3} = 348\). The answer is \(\frac{1044k}{m}\).
```

## Hard
```task
Pump A fills 15 liters in 3 minutes. Pump B fills 40 liters in 10 minutes. Both pumps run at the same time at these rates. How many minutes will it take them to fill a 270-liter tank?
answer: 30
- 54 :: That is pump A alone. Both pumps are working.
- 67.5 :: That is pump B alone. Add the two rates.
- 60 :: You averaged the rates. Rates add when machines work together.
highlight:
- "Pump A fills 15 liters in 3 minutes" :: Pump A's rate is 15 divided by 3, which is 5 liters per minute.
- "Pump B fills 40 liters in 10 minutes" :: Pump B's rate is 40 divided by 10, which is 4 liters per minute.
- "at the same time" :: Rates that run together add: 5 plus 4 is 9 liters per minute.
- "270-liter tank" :: Divide the tank's size by the combined rate to get minutes.
explain:
Find each pump's unit rate.

Pump A: \(\frac{15}{3} = 5\) liters per minute. Pump B: \(\frac{40}{10} = 4\) liters per minute.

The pumps run at the same time, so their rates add: \(5 + 4 = 9\) liters per minute.

The tank holds 270 liters, so the time is the amount divided by the rate:

\[\frac{270\ \text{L}}{9\ \text{L/min}} = 30\ \text{min}\]

Check: in 30 minutes pump A adds 150 liters and pump B adds 120 liters, and \(150 + 120 = 270\). The answer is 30.
```

# Unit conversions
A conversion factor is a fraction equal to 1.

```visual
ratios-rates--cancel
```

## Key ideas
A **conversion factor** is a fraction that equals 1, such as \(\frac{1000\ \text{m}}{1\ \text{km}}\). Multiplying by it changes the unit, not the amount. Put the unit you want to remove **on the bottom** so it cancels. Chain as many factors as you need.

A rate has two units, so change them one at a time: the top unit with one factor, the bottom unit with another.

\[\text{old unit} \times \frac{\text{new unit}}{\text{old unit}} = \text{new unit}\]

Memorize the time facts: 1 hour = 60 minutes = 3,600 seconds. For everything else the SAT prints the conversion in the question, like 1 kilometer = 1,000 meters, so use exactly what it gives.

Sense check: a smaller unit means a bigger number. Meters are smaller than kilometers, so 90 km is 90,000 m.

```example
A car drives at 90 kilometers per hour. What is its speed in meters per second? (1 kilometer = 1,000 meters)
1. \(90\ \frac{\text{km}}{\text{h}} \times \frac{1000\ \text{m}}{1\ \text{km}} = 90000\ \frac{\text{m}}{\text{h}}\) :: Kilometers cancel.
2. \(90000\ \frac{\text{m}}{\text{h}} \times \frac{1\ \text{h}}{3600\ \text{s}}\) :: Hours cancel.
3. \(25\ \frac{\text{m}}{\text{s}}\) :: Only meters per second are left.
```

```theory
Changing units by cancelling is called **dimensional analysis**. It works because a conversion factor is a fraction with the same length on top and bottom: 1 km and 1,000 m are the same distance, so \(\frac{1000\ \text{m}}{1\ \text{km}} = 1\). Multiplying by 1 never changes the quantity, only its unit.

How to build a factor: look at the unit you want to cancel. If it is on top in your number, it goes on the bottom of the factor. If it is on the bottom (like hours in km per hour), it goes on top.

Two or more steps are common. If 1 mile = 5,280 feet and 1 foot = 12 inches, chain them: miles to feet to inches. The feet cancel in the middle, so one mile is 63,360 inches.

Many SAT conversion questions are rates, such as miles per hour to feet per second. Do the top and bottom units separately, writing every unit. Check at the end that only the unit you want is left.

Common traps:
- Dividing when you should multiply. Use the size check: smaller unit, bigger number.
- Using 60 seconds for one hour. It is 3,600.
- Stopping after one step of a chain, such as leaving the answer in yards.

The SAT usually gives non-time conversions in the question. It may use unusual units (furlongs, fathoms), but the method never changes.
```

## Easy
```task
bank: m-1442
highlight:
- "64 yards per second" :: This is the starting rate: yards on top, seconds on the bottom.
- "speed, in feet per second" :: Only the top unit changes, from yards to feet.
- "(1 yard = 3 feet)" :: Each yard is 3 feet, so multiply by 3 feet per yard.
explain:
Only the top unit changes, from yards to feet. The seconds stay.

Multiply by a factor that cancels yards:

\[64\ \frac{\text{yd}}{\text{s}} \times \frac{3\ \text{ft}}{1\ \text{yd}} = 192\ \frac{\text{ft}}{\text{s}}\]

Size check: feet are smaller than yards, so the number must get bigger, which rules out choices A and B (61 and 67). They only subtract or add 3, and units never convert that way. The answer is 192 feet per second.
```

## Medium
```task
bank: m-1451
highlight:
- "354 furlongs" :: This is the amount you start with.
- "1 furlong = 220 yards and 1 yard = 3 feet" :: Two facts, so chain two factors: furlongs to yards, then yards to feet.
- "how many feet" :: The last unit must be feet. Do not stop at yards.
explain:
Chain the two conversion factors so that furlongs and then yards cancel:

\[354\ \text{furlongs} \times \frac{220\ \text{yd}}{1\ \text{furlong}} \times \frac{3\ \text{ft}}{1\ \text{yd}}\]

Furlongs cancel with the first factor, and yards cancel with the second. Only feet are left.

Multiply the numbers: \(220 \times 3 = 660\) feet in one furlong, and \(354 \times 660 = 233640\).

Check: stopping after the first factor gives \(354 \times 220 = 77880\), which is in yards, not feet, so one more factor is needed. The answer is 233,640 feet.
```

## Hard
```task
A conveyor belt moves boxes at a constant speed of 0.45 meters per second. At this speed, how many kilometers does the belt move in 8 hours? (1 kilometer = 1,000 meters)
answer: 12.96
- 12960 :: That is meters. Divide by 1,000 to get kilometers.
- 1.62 :: That is one hour only. Multiply by 8 hours.
- 0.216 :: One hour has 3,600 seconds, not 60.
highlight:
- "0.45 meters per second" :: The speed is in meters on the top and seconds on the bottom.
- "8 hours" :: The time is in hours, but the speed uses seconds. Convert one of them.
- "how many kilometers" :: The answer needs a different top unit: kilometers.
- "(1 kilometer = 1,000 meters)" :: The only conversion given. Hours and seconds you must know.
explain:
The speed is in meters per second, the time is in hours, and the answer must be in kilometers. Convert in one chain so that every unwanted unit cancels:

\[0.45\ \frac{\text{m}}{\text{s}} \times \frac{3600\ \text{s}}{1\ \text{h}} \times 8\ \text{h} \times \frac{1\ \text{km}}{1000\ \text{m}}\]

Seconds cancel, hours cancel, and meters cancel. Only kilometers are left.

Multiply: \(0.45 \times 3600 = 1620\) meters in one hour. In 8 hours that is \(1620 \times 8 = 12960\) meters. Divide by 1,000: \(12.96\) kilometers.

Check: 0.45 m/s is about half a meter every second, so about 1.6 km per hour, and 8 hours is about 13 km. The answer is 12.96.
```

# Square and cube units
Area: square the factor. Volume: cube it.

```visual
ratios-rates--square
```

## Key ideas
A length factor is not an area factor. Since 1 yard = 3 feet, a square yard is a 3 by 3 grid of square feet:

\[1\ \text{yd}^2 = 3^2\ \text{ft}^2 = 9\ \text{ft}^2 \qquad 1\ \text{yd}^3 = 3^3\ \text{ft}^3 = 27\ \text{ft}^3\]

So **square** the length factor for area and **cube** it for volume. Never use the plain 3 or 12 once.

This works inside rates too. "Square feet per hour" has an area on top: square the length factor there, and convert the hour with the plain time factor. Acceleration, like "meters per second squared", has time twice: use the time factor twice.

Sense check: a smaller unit means a bigger number. 30 square yards is 30 times 9, which is 270 square feet. The number grows because feet are smaller.

```example
A floor has an area of 30 square yards. What is its area in square feet? (1 yard = 3 feet)
1. \(1\ \text{yd}^2 = 3^2\ \text{ft}^2 = 9\ \text{ft}^2\) :: Square the length factor.
2. \(30 \times 9 = 270\) :: Feet are smaller, so the number grows.
3. 270 square feet :: The answer.
```

```theory
Area counts squares. A square yard is 3 feet wide and 3 feet tall, so it holds \(3 \times 3 = 9\) square feet. Volume counts cubes: a cubic yard is 3 feet in each of three directions, so it holds 27 cubic feet. That is why the factor is squared or cubed, never used once.

In factor form, \(\frac{9\ \text{ft}^2}{1\ \text{yd}^2}\) is a conversion factor equal to 1, just like \(\frac{3\ \text{ft}}{1\ \text{yd}}\). Use it to cancel square yards.

Two ways to do the same problem:
- Convert first: find that 1 square foot is 144 square inches, then divide or multiply.
- Multiply the length factor in the chain twice: \(\frac{1\ \text{ft}}{12\ \text{in}} \times \frac{1\ \text{ft}}{12\ \text{in}}\).

For a rate such as 90 square feet per minute, change the top and the bottom separately. If 1 meter = 3 feet (kept small here), then 1 square meter = \(3^2 = 9\) square feet, so 90 square feet per minute is 10 square meters per minute. For square meters per hour, multiply by 60: 600.

Typical traps:
- Dividing by 12 once when converting square inches to square feet. Divide by 144.
- Choosing the direction wrong. A bigger unit gives a smaller number, so square inches to square feet shrinks.
- Converting the area but forgetting the time part of a rate.
```

## Easy
```task
bank: m-1405
highlight:
- "area of 3,168 square inches" :: This is an area in square inches. Square the length factor.
- "area, in square feet" :: The answer unit is square feet, a bigger unit, so the number shrinks.
- "(1 foot = 12 inches)" :: One square foot is 12 times 12 square inches.
explain:
The length factor is 12 inches per foot, but this is an area, so square it:

\[1\ \text{ft}^2 = 12^2\ \text{in}^2 = 144\ \text{in}^2\]

Square feet are a bigger unit than square inches, so the number gets smaller. Divide:

\[\frac{3168}{144} = 22\]

Dividing by 12 only once gives 264, which would be right for a length, not an area. Always square the factor for area. The answer is 22 square feet.
```

## Medium
```task
bank: m-1382
highlight:
- "4.36 square miles" :: This is an area, so the length factor will be squared.
- "area, in square yards" :: The answer is square yards: a smaller unit, so the number grows.
- "(1 mile = 1,760 yards)" :: Square this: one square mile is 1,760 times 1,760 square yards.
explain:
The length factor is 1,760 yards per mile. The quantity is an area, so square the factor:

\[1\ \text{mi}^2 = 1760^2\ \text{yd}^2 = 3097600\ \text{yd}^2\]

Square yards are smaller than square miles, so multiply:

\[4.36 \times 3097600 = 13505536\]

Choice B (7,674) comes from multiplying by 1,760 once, which converts a length. Choice A is far too small, because converting to a smaller unit must give a bigger number. The answer is 13,505,536 square yards.
```

## Hard
```task
bank: m-1510
highlight:
- "increasing at a rate of 250 square feet per hour" :: An area per time. The top is square feet, the bottom is hours.
- "square meters per minute" :: Change the top to square meters (square the length factor) and the bottom to minutes.
- "(Use 1 meter = 3.28 feet.)" :: A square meter is 3.28 times 3.28 square feet, not 3.28.
explain:
Convert the top and the bottom separately.

**Top: square feet to square meters.** The length factor is 3.28 feet per meter, so 1 square meter = \(3.28^2\) square feet, about 10.76. Divide:

\[\frac{250\ \text{ft}^2}{10.76\ \text{ft}^2/\text{m}^2} \approx 23.24\ \text{m}^2\]

So the rate is about 23.24 square meters per hour.

**Bottom: hours to minutes.** One hour is 60 minutes, so the rate per minute is 60 times smaller:

\[\frac{23.24}{60} \approx 0.39\]

Choice D (23.24) stops after the first step and is still per hour. The answer is about 0.39 square meters per minute.
```

# Ratios and parts
Ratio \(a\) to \(b\): parts \(ak\) and \(bk\).

```visual
ratios-rates--parts
```

## Key ideas
A **ratio** compares two amounts. "3 to 5", "3:5" and \(\frac{3}{5}\) all mean the same ratio. The ratio of red to blue is 3 to 5, but red is only \(\frac{3}{8}\) of **all** the beads. A part-to-part ratio is not a part-to-whole fraction, so always add the parts for the whole.

Turn a ratio into real amounts with one unknown size \(k\) for a single part:

\[\text{parts: } ak \text{ and } bk \qquad \text{total} = (a + b)k\]

Use the total to find \(k\), then multiply by the parts you want. If a ratio is given with one amount known, divide: 8 black to 1 red with 40 black means one part is \(\frac{40}{8} = 5\), so 5 red.

Two ratios that share a term, like \(a:b\) and \(b:c\)? Rewrite both so the shared term has the same number, then join them.

```example
Paint mixes blue and white in a ratio of 2 to 7. A batch is 36 liters. How many liters are white?
1. \(2k + 7k = 36\) :: Blue is \(2k\), white is \(7k\).
2. \(9k = 36\), so \(k = 4\) :: One part is 4 liters.
3. White \(= 7k = 28\) liters :: Take the white parts.
```

```theory
A ratio can be written in words ("3 to 5"), with a colon (3:5) or as a fraction (\(\frac{3}{5}\)). The order matters: "red to blue" is 3:5, so "blue to red" is 5:3. Reading the order carefully is the most common fix on easy SAT ratio questions.

The letter \(k\) is just "the size of one part". If blue and white are 2 and 7 parts, a batch has 9 parts. Ratios keep the same relationship when both amounts are multiplied by the same number, so 2:7 equals 4:14 equals 20:70.

**Ratios that share a term.** Suppose the ratio of A to B is 2:3 and the ratio of B to C is 6:7. B has 3 parts in one ratio and 6 in the other. Make both 6: multiply the first ratio by 2. Then A:B = 4:6 and B:C = 6:7, so A:B:C = 4:6:7.

**Equal ratios and proportions.** If a rectangle's length to width stays at 35 to 10 and the width grows by 7, the length must grow by \(3.5 \times 7\), not by 7. Keep the same factor, not the same amount. A statement like "the ratio of \(x\) to \(y\) equals the ratio of 12 to \(t\)" gives \(\frac{x}{y} = \frac{12}{t}\).

Traps:
- Using the ratio numbers as the real amounts.
- Dividing the total by one part of the ratio instead of by the sum of the parts.
- Reversing the order.
```

## Easy
```task
bank: m-1202
highlight:
- "ratio of black pens to red pens is 8 to 1" :: Black comes first: for every 8 black pens there is 1 red pen.
- "40 black pens" :: The known amount is the black pens, which are 8 parts.
- "How many red pens" :: Red is 1 part. Divide the 40 by 8 to find one part.
explain:
The ratio of black pens to red pens is 8 to 1, so black is 8 parts and red is 1 part.

The 40 black pens are 8 parts, so one part is

\[\frac{40}{8} = 5\]

Red is 1 part, so there are 5 red pens.

Check: 40 black to 5 red simplifies to 8 to 1. Choice D (320) multiplies by 8 instead of dividing, but there are fewer red pens than black. The answer is 5.
```

## Medium
```task
bank: m-1553
highlight:
- "mixing 2 ounces of blue paint with 3 ounces of yellow paint" :: The first batch sets the ratio: 2 blue to 3 yellow.
- "same ratio of blue and yellow paint" :: The second batch must keep yellow equal to 1.5 times blue.
- "5 ounces of blue paint for the second batch" :: Blue is 5 ounces here. Scale the ratio from this number.
- "how much yellow paint" :: Find the yellow amount that keeps the 3 to 2 relation.
explain:
In the first batch the ratio of blue to yellow is 2 to 3. So yellow is always \(\frac{3}{2} = 1.5\) times blue.

In the second batch blue is 5 ounces, so yellow must be

\[1.5 \times 5 = 7.5\ \text{ounces}\]

Choice D says "1.5 times the amount of blue paint used in the second batch", which is exactly this. Choice C multiplies the first batch's yellow (3 ounces) by 1.5, which gives 4.5 ounces and uses the wrong batch. Choice A, 5 ounces, is the blue amount, not the yellow. The answer is D.
```

## Hard
```task
In a school club, the ratio of juniors to seniors is 3 to 4, and the ratio of seniors to sophomores is 6 to 5. The club has 93 members, all of whom are juniors, seniors, or sophomores. How many seniors are in the club?
answer: 36
- 12 :: That is the number of parts for seniors. Multiply by \(k = 3\).
- 31 :: You read it as 3, 4, 5. Match the seniors first.
- 18 :: That uses 6 parts only. Make seniors equal in both ratios.
highlight:
- "ratio of juniors to seniors is 3 to 4" :: Seniors have 4 parts here.
- "ratio of seniors to sophomores is 6 to 5" :: Seniors have 6 parts here. Make both 12.
- "93 members" :: The total of all the parts, from which you find \(k\).
explain:
Seniors are 4 parts in the first ratio and 6 parts in the second. Make both 12: multiply the first ratio by 3 and the second by 2.

Juniors to seniors: \(3:4 = 9:12\). Seniors to sophomores: \(6:5 = 12:10\).

Now the three groups are juniors : seniors : sophomores = \(9:12:10\), which is 31 parts in all. The club has 93 members, so

\[31k = 93, \qquad k = 3\]

Seniors are 12 parts: \(12 \times 3 = 36\).

Check: juniors 27, seniors 36, sophomores 30, and \(27 + 36 + 30 = 93\). The answer is 36.
```

# Proportions and scale
Equal ratios: cross-multiply, or scale by one factor.

```visual
ratios-rates--scale
```

## Key ideas
A **proportion** says two ratios are equal. Put matching units in matching places, then cross-multiply:

\[\frac{a}{b} = \frac{c}{d} \quad\Longrightarrow\quad ad = bc\]

Two quantities are **directly proportional** when \(y = kx\). Then \(\frac{y}{x} = k\) never changes (the **constant of proportionality**), and the graph is a line through the origin. If \(x\) doubles, \(y\) doubles. For an **inverse** relationship \(xy = k\), when \(x\) doubles, \(y\) halves.

A **scale** such as "2 cm stands for 5 km" is a ratio of lengths. Use it for any length on the drawing. For area, first convert the lengths, then find the area, or square the scale factor.

```example
On a map, 2 centimeters stand for 5 kilometers. Two towns are 7 centimeters apart on the map. How far apart are they in real life?
1. \(\frac{2\ \text{cm}}{5\ \text{km}} = \frac{7\ \text{cm}}{x\ \text{km}}\) :: Same unit in the same place.
2. \(2x = 35\) :: Cross-multiply.
3. \(x = 17.5\) km :: Divide by 2.
```

```theory
Why cross-multiplying works: multiply both sides of \(\frac{a}{b} = \frac{c}{d}\) by \(bd\) and you get \(ad = bc\). Any time you can write two equal fractions, you can solve for the missing number this way.

**Direct proportion.** \"There is a proportional relationship between \(y\) and \(x\)\" means \(\frac{y}{x}\) is constant. If \(y = 84\) when \(x = 120\), the constant is \(\frac{84}{120} = 0.7\), so \(y = 0.7x\) for every \(x\). Check that you divided \(y\) by \(x\) and not the other way round.

**Scale drawings.** A scale says how a drawing length compares with the real length. Read it carefully: \"1 inch represents 20 miles\" means each inch is 20 miles. If a bigger version is printed with sides 25% longer (a factor of 1.25), the same drawing inch now covers less real distance, because the same real distance takes more inches. So 1 inch now stands for \(\frac{20}{1.25} = 16\) miles.

**Areas on scale drawings.** Scale applies to each length. If a room is 4 inches by 6 inches on a plan where 1 inch = 2 feet, the real room is 8 feet by 12 feet, so its area is 96 square feet. Do not multiply the plan area by 2.

Common traps:
- Flipping the scale (using km per cm when you need cm per km).
- Scaling area with the length factor.
- Mixing up which ratio part belongs to the drawing.
```

## Easy
```task
On a map, 3 centimeters represent 20 kilometers. Two cities are 10.5 centimeters apart on the map. How many kilometers apart are the cities in real life?
answer: 70
- 1.575 :: You flipped the scale. Each centimeter is more than 1 kilometer.
- 210 :: You skipped dividing by 3. The 20 km is for 3 cm.
- 30.5 :: You added the numbers. A scale multiplies.
highlight:
- "3 centimeters represent 20 kilometers" :: The scale: 3 cm on the map is 20 km in real life.
- "10.5 centimeters apart on the map" :: The map distance. Use it with the same scale.
- "How many kilometers" :: The answer is in kilometers, so put km on the unknown's side.
explain:
Write the scale as a proportion with matching units in matching places:

\[\frac{3\ \text{cm}}{20\ \text{km}} = \frac{10.5\ \text{cm}}{x\ \text{km}}\]

Cross-multiply: \(3x = 20 \times 10.5 = 210\), so \(x = 70\).

Another way: 10.5 cm is \(\frac{10.5}{3} = 3.5\) times 3 cm, so the real distance is 3.5 times 20 km, which is 70 km.

Check: 70 km is bigger than 10.5, as it must be, since the map shrinks real distances. The answer is 70.
```

## Medium
```task
bank: m-1286
highlight:
- "proportional relationship between p and t" :: A proportional relationship means \(p \div t\) never changes.
- "p = 5,130 when t = 6,840" :: Use this pair to find the constant: 5,130 divided by 6,840.
- "when t = 5,472" :: Now multiply the constant by this new t.
explain:
In a proportional relationship the ratio \(\frac{p}{t}\) is always the same. Use the known pair to find it:

\[\frac{p}{t} = \frac{5130}{6840} = 0.75\]

So \(p = 0.75t\). Put in the new value:

\[p = 0.75 \times 5472 = 4104\]

Check: \(t\) went down from 6,840 to 5,472, so \(p\) must go down from 5,130. A proportional relationship moves both numbers by the same factor. Choice A (7,296) is bigger, because it uses \(\frac{t}{p}\) instead of \(\frac{p}{t}\). The answer is 4,104.
```

## Hard
```task
bank: m-1194
highlight:
- "1inch on the drawing represents an actual distance of 19 miles" :: This is the original scale: one inch is 19 miles.
- "65% longer than the side length of the previous drawing" :: The new drawing is 1.65 times as long as the old one.
- "actual distance, in miles, represented by 1inch" :: Find what one inch covers on the larger drawing.
explain:
The larger drawing shows the same real square, but its side is 65% longer, so it is 1.65 times as long as before. The same real distance takes 1.65 times as many inches.

That means one inch on the larger drawing stands for **less** real distance than before: the old 19 miles divided by 1.65.

\[\frac{19}{1.65} \approx 11.52\ \text{miles}\]

Choice C (31.35) multiplies instead of dividing, which would make one inch cover more, but a bigger drawing spreads the same land over more paper. The answer is about 11.52 miles.
```

# Density
Amount per space: always total over total.

```visual
ratios-rates--density
```

## Key ideas
**Density** is a rate that tells how much is packed into one unit of space:

\[\text{density} = \frac{\text{amount}}{\text{space}}\]

Mass density is grams per cubic centimeter (mass divided by volume). Population density is people per square mile (people divided by area). Solve for any piece: amount = density times space, and space = amount divided by density.

Use the space the question names. If the density is "per square mile of land area", subtract the water first.

**Combined density = total amount divided by total space.** Never average two densities, and never add them. Two places with different sizes must be weighted by their sizes, which the totals do automatically.

```example
A metal has a density of 8 grams per cubic centimeter. A block of this metal has a volume of 45 cubic centimeters. What is its mass, in grams?
1. \(8\ \frac{\text{g}}{\text{cm}^3}\) :: 8 grams in every 1 cubic centimeter.
2. \(8\ \frac{\text{g}}{\text{cm}^3} \times 45\ \text{cm}^3\) :: Cubic centimeters cancel.
3. 360 grams :: Only grams are left.
```

```theory
Density is an ordinary rate with a special name. The units tell you the formula: "grams per cubic centimeter" is grams divided by cubic centimeters. "People per square mile" is people divided by square miles. If you remember what "per" means (division), you never need to memorize the formula.

Three questions, one formula:
- Find the density: amount divided by space.
- Find the amount: density times space (volume times density gives mass).
- Find the space: amount divided by density.

**Parts of a whole.** A lake town has 50 square miles of area, but 10 of it is water. If the question asks for people per square mile of **land** area, the space is \(50 - 10 = 40\) square miles. Using the total area is the trap.

**Combined density.** Town A has 9,000 people on 30 square miles (300 per square mile). Town B has 2,000 people on 20 square miles (100 per square mile). The density of both together is \(\frac{11000}{50} = 220\), not the average of 300 and 100, which is 200. The average is wrong because the towns have different areas, so they count differently. Always add the amounts, add the spaces, then divide.

Units can also hide: "2.5 ounces of chocolate for each muffin" is a rate of ounces per muffin. Convert ounces to pounds only at the end.

Density questions also use ordinary unit conversion (grams to kilograms, square miles to square kilometers). Use the factors you were given and square the length factor for areas.
```

## Easy
```task
bank: m-1288
highlight:
- "mass of 168 grams" :: This is the amount on top of the density.
- "volume of 24 cubic centimeters" :: This is the space on the bottom of the density.
- "density, in grams per cubic centimeter" :: Grams per cubic centimeter means grams divided by cm cubed.
explain:
Density is mass divided by volume. The question asks for grams per cubic centimeter, so grams go on top and cubic centimeters on the bottom:

\[\frac{168\ \text{g}}{24\ \text{cm}^3} = 7\ \frac{\text{g}}{\text{cm}^3}\]

Check: \(7 \times 24 = 168\), so the density times the volume gives back the mass. The units tell you the setup. Choice D (4,032) multiplies mass by volume, and grams times cubic centimeters is not a density. The answer is 7.
```

## Medium
```task
bank: m-1447
highlight:
- "92.1 square miles, of which 11.3 square miles is water" :: Water is not land. Subtract it to get the land area.
- "621,000 people" :: This is the amount, the people on top of the density.
- "people per square mile of land area" :: The space is land area only, not the total area.
explain:
The question asks for people per square mile of **land** area, so the space is the land.

Land area: \(92.1 - 11.3 = 80.8\) square miles.

Density is the amount divided by the space:

\[\frac{621000\ \text{people}}{80.8\ \text{mi}^2} \approx 7686\ \text{people per square mile}\]

The closest choice is 7,690.

Choice A (6,740) divides by the total area of 92.1 square miles, which includes the water, so it is too small. The answer is B, 7,690.
```

## Hard
```task
County X has 18,000 people living on 60 square miles of land. County Y has 30,000 people living on 40 square miles of land. What is the population density, in people per square mile, of the two counties combined?
answer: 480
- 525 :: You averaged 300 and 750. Use total people over total area.
- 1050 :: You added the two densities. Combine the people and the area instead.
- 48000 :: That is the total people. Divide by the 100 square miles.
highlight:
- "18,000 people living on 60 square miles" :: County X: 18,000 people and 60 square miles.
- "30,000 people living on 40 square miles" :: County Y: 30,000 people and 40 square miles.
- "two counties combined" :: Combined means add the people and add the areas, then divide.
explain:
Do not average the two densities. Counties of different sizes count differently, so add the totals first.

Total people: \(18000 + 30000 = 48000\).

Total area: \(60 + 40 = 100\) square miles.

Combined density:

\[\frac{48000\ \text{people}}{100\ \text{mi}^2} = 480\ \text{people per square mile}\]

Check: the separate densities are 300 and 750. The combined density must lie between them, and it sits closer to 300 because County X has more land (60 square miles against 40). The plain average, 525, ignores that. The answer is 480.
```
