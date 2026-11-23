---
title: Two-Variable Data and Scatterplots
skill: two-var-data
domain: problem-solving
section: math
summary: Describe scatterplots, use lines of best fit and pick the right model.
---

# Describe the dots
Direction, strength and shape of the scatter.

```visual
two-var-data--association
```

## Key ideas
A **scatterplot** shows one dot for each observation, a pair \((x, y)\). **Association** describes how \(y\) tends to change as \(x\) increases.
- **Positive:** \(y\) tends to rise. **Negative:** \(y\) tends to fall. **None:** no pattern at all.
- **Strong:** the dots stay close to a line or curve. **Weak:** they are spread out.
- **Linear:** the pattern is a straight band. **Nonlinear:** it bends.

An **outlier** is a dot far from the pattern. One outlier can tilt a line of best fit toward itself, but it does not change the overall pattern.

A line is a good model only for a linear pattern. If the dots follow a curve, a line fits poorly, even when the association is strong.

An association is not a cause. Two variables can move together without one causing the other.

```example
Students recorded hours studied and test score. Scores tend to be higher for more hours, but the dots are widely scattered. Describe the association.
1. Higher scores for more hours :: As x rises, y tends to rise: positive.
2. Dots widely scattered :: Far from any line: weak.
3. Weak positive association :: Name the direction and the strength.
```

```theory
Each dot in a scatterplot is one observation, such as one car, one student or one day. The horizontal axis holds \(x\) (the variable you start from) and the vertical axis holds \(y\).

**Direction.** Read the dots from left to right. If they climb, the association is positive. If they sink, it is negative. If they look like a shapeless cloud, there is no association, such as shoe size against test score.

**Strength.** Imagine the best line or curve through the dots. If most dots touch or nearly touch it, the association is strong. If they are far from it, it is weak. Strength is about how tightly the dots follow the pattern, not about how steep it is.

**Shape.** A straight band is linear. A band that curves (flattening out, or rising then falling) is nonlinear. A nonlinear pattern can be strong too, so "strong" does not mean "a line fits".

**Outliers.** An outlier far from the rest can pull the line of best fit toward it, especially if it sits near an end of the data. Think about which end of the line it drags, and which way that tilts the line.

**Cause.** A scatterplot shows that two variables are related, not that one makes the other change. The SAT may offer a "causal" answer choice. It is usually wrong.

Typical SAT choices say things like "strong, negative, linear" or "a linear model is not appropriate". Match all parts of the description to the dots.

Traps:
- Calling a downhill pattern positive.
- Saying "weak" when the dots hug a line.
- Using a line for a curved pattern.
```

## Easy
```task
In a scatterplot, as the age of a used car increases, its selling price tends to decrease. Nearly all of the points lie close to a straight line. Which of the following best describes the association between age and price?
- Strong and positive :: Price falls as age rises, so it is negative.
- Weak and negative :: Points close to a line mean strong, not weak.
* Strong and negative
- No association :: The price clearly changes with age.
highlight:
- "as the age of a used car increases, its selling price tends to decrease" :: y falls as x rises: the association is negative.
- "close to a straight line" :: Dots that hug a line mean a strong linear association.
explain:
Read the direction first. As the age (\(x\)) of the car increases, the price (\(y\)) tends to decrease. When one goes up and the other goes down, the association is **negative**.

Next read the strength. Nearly all of the points lie close to a straight line, so the dots follow the pattern tightly. That is a **strong** association.

Put the two together: strong and negative.

Check: "weak" would describe dots scattered far from any line. "No association" would mean no pattern, but here the price clearly changes with age. The answer is strong and negative.
```

## Medium
```task
The points in a scatterplot of \(x\) and \(y\) rise steeply at first and then level off, following a curve that bends. Which statement about a line of best fit for these data is most reasonable?
- A linear model fits well, because \(y\) increases as \(x\) increases. :: Increasing does not mean straight. This pattern bends.
* A linear model fits poorly, because the points follow a curve instead of a straight band.
- A linear model fits well, because there is no association. :: There is a clear association: the points rise.
- A linear model fits well, because the association is negative. :: The points rise, so the association is positive.
highlight:
- "rise steeply at first and then level off" :: The pattern changes steepness, so it is not a straight band.
- "following a curve that bends" :: A curve means a linear model is a poor fit.
explain:
Look at the shape. The points rise steeply at first and then level off. A straight line has the same steepness everywhere, but this pattern changes steepness, so it follows a **curve**.

A line of best fit works well only when the dots form a straight band. For a bending curve, a line would be too high in some places and too low in others.

Check the other statements. The association is clearly positive (\(y\) rises with \(x\)), so a "negative" description is wrong, and "no association" is wrong too. And "\(y\) increases" alone does not prove a line fits.

The answer is the second statement: a linear model fits poorly because the points follow a curve.
```

## Hard
```task
A scatterplot of 12 points shows a strong positive linear association. A 13th point is added far below the line, near the right end of the data. Which statement is most likely true about the new line of best fit, compared with the original?
- Its slope is larger, because there are more points. :: More points do not tilt the line upward. This point is low.
- Its slope is the same, because a line of best fit ignores outliers. :: A line of best fit is pulled toward an outlier.
* Its slope is smaller, because the new point pulls the right end of the line down.
- Its slope is negative, because the new point is below the line. :: One low point cannot reverse a strong positive pattern.
highlight:
- "strong positive linear association" :: Twelve points follow a rising line closely.
- "far below the line, near the right end of the data" :: A low outlier at the right end pulls that end of the line down.
- "new line of best fit" :: Compare its slope with the old slope.
explain:
The original 12 points follow a rising line closely, so its slope is positive.

The 13th point is far below the line and near the right end. A line of best fit is pulled toward points that are far from it. Because this point is on the right and low, it pulls the right end of the line **down**. A line with a lower right end is flatter, so the slope gets **smaller**.

Check the other statements. The line is not unchanged, because a line of best fit uses every point, outliers included. The slope does not become larger, because the new point is below the old line, not above. And a strong 12-point pattern is not reversed by one point, so the slope stays positive.

The answer is the third statement: the slope is smaller.
```

# Predict with the line
Read two points. Find the equation. Put x in.

```visual
two-var-data--predict
```

## Key ideas
A **line of best fit** is the straight line that follows the dots. The SAT often writes it as

\[y = a + bx\]

Here \(a\) is the **intercept**, the value of \(y\) at \(x = 0\), and \(b\) is the **slope**. This is the same line as \(y = mx + b\), only with the intercept written first. Do not confuse these \(a\) and \(b\) with the \(a\) and \(b\) in \(y = a(b)^x\).

To **predict** \(y\), put \(x\) into the equation. If you only know two points on the line, find the slope first:

\[b = \frac{y_2 - y_1}{x_2 - x_1}\]

The line gives a **predicted** value. A dot is an actual value. Predictions are reliable inside the range of the data. Far outside it, they may not be.

```example
The line of best fit passes through \((0, 20)\) and \((10, 50)\). Predict \(y\) at \(x = 6\).
1. Intercept: 20 :: The line's \(y\) at \(x = 0\).
2. Slope: \(\frac{50 - 20}{10 - 0} = 3\) :: Rise divided by run.
3. \(y = 20 + 3x\) :: Intercept first, then slope times \(x\).
4. \(y = 20 + 3(6) = 38\) :: Put \(x = 6\) in.
```

```theory
The slope formula comes from rise over run. Between \((0, 20)\) and \((10, 50)\) the line rises \(50 - 20 = 30\) while it runs \(10 - 0 = 10\), so every 1 step right raises \(y\) by 3. That is why \(y\) at \(x = 6\) is \(20 + 6 \times 3\).

Reading a graph: pick two points where the line crosses a grid corner and use those. Do not use dots that are near the line but not on it.

Two forms of the same line: \(y = mx + b\) and \(y = a + bx\). In the second, the number added is the intercept and the number multiplying \(x\) is the slope. When an SAT choice reads \(y = 12.4 + 3.7x\), the intercept is 12.4 and the slope is 3.7.

**Interpolation and extrapolation.** Predicting for an \(x\) between the smallest and largest in the data (interpolation) is fairly safe. Predicting far beyond them (extrapolation) is risky, because the pattern may change. Some questions state the range, like \(20 \le x \le 110\), to tell you the model is meant for that range.

**Decreasing lines.** When \(y\) falls as \(x\) rises, the slope is negative. Between \((0, 80)\) and \((10, 50)\), the slope is \(\frac{50 - 80}{10 - 0} = -3\). A predicted value at \(x = 4\) is then \(80 - 12 = 68\).

**Working backward.** To find the \(x\) that gives a given predicted \(y\), write the equation and solve for \(x\).

Traps:
- Using the dot's \(y\)-value instead of the line's.
- Forgetting the intercept and giving \(bx\) only.
- Using the wrong sign for the slope of a falling line.
```

## Easy
```task
bank: m-1079
highlight:
- "y = 0.67x + 2.6" :: The line's equation: put x into this.
- "58 worker ants" :: The x-value is 58 workers.
- "predicted number of larvae" :: The answer is a predicted y, found by substitution.
explain:
The equation gives the predicted number of larvae \(y\) for a colony with \(x\) worker ants. The colony in the question has 58 worker ants, so \(x = 58\). Put it in:

\[y = 0.67(58) + 2.6 = 38.86 + 2.6 = 41.46\]

The question asks for the closest choice. 41.46 is closest to 41.

Check the choices: 58 is the number of workers, not larvae, and the equation's slope is less than 1, so \(y\) must be smaller than \(x\). That rules out 61, 83 and 190. The answer is A, 41.
```

## Medium
```task
A line of best fit for a data set passes through the points \((0, 90)\) and \((15, 30)\). According to the line, what is the predicted \(y\)-value when \(x = 11\)?
answer: 46
- 134 :: The line goes down, so the slope is negative.
- 30 :: That is \(y\) at \(x = 15\), not at \(x = 11\).
~ table x_1: 0, 15; y_1: 90, 30 :: Enter the two points on the line.
~ type y_{1}\sim mx_{1}+b :: Desmos finds the line: m is -4 and b is 90.
~ type x=11 :: A vertical line at x = 11.
~ zoom -3 20 -10 110
~ point (11, 46) :: Click the crossing: y = 46.
highlight:
- "passes through the points \((0, 90)\) and \((15, 30)\)" :: Two points give the slope and the intercept.
- "predicted \(y\)-value" :: Use the line's y, found by substituting x.
- "when \(x = 11\)" :: The x-value to put in the equation.
explain:
The point \((0, 90)\) is on the \(y\)-axis, so the intercept is 90.

The slope is the rise over the run between the two points:

\[b = \frac{30 - 90}{15 - 0} = \frac{-60}{15} = -4\]

So the line is \(y = 90 - 4x\). Put \(x = 11\) in:

\[y = 90 - 4(11) = 90 - 44 = 46\]

Check: \(x = 11\) lies between 0 and 15, so \(y\) must lie between 90 and 30. 46 does. A slope of +4 would give 134, which is not between them. The answer is 46.
```

## Hard
```task
A line of best fit passes through \((2, 19)\) and \((8, 43)\). For what value of \(x\) does the line predict a \(y\)-value of 75?
answer: 16
- 18.75 :: You divided 75 by the slope. Do not skip the intercept.
- 64 :: That is \(4x\). Divide by 4 to get \(x\).
highlight:
- "passes through \((2, 19)\) and \((8, 43)\)" :: Use both points to get the slope: 4.
- "For what value of \(x\)" :: This works backward: the y is given, the x is unknown.
- "predict a \(y\)-value of 75" :: Set the line's equation equal to 75 and solve.
explain:
First find the slope from the two points:

\[b = \frac{43 - 19}{8 - 2} = \frac{24}{6} = 4\]

Use one point to find the intercept. At \(x = 2\), \(y = 19\), so \(19 = a + 4(2)\) and \(a = 11\). The line is \(y = 11 + 4x\).

Now work backward. Set \(y = 75\):

\[75 = 11 + 4x \quad\Longrightarrow\quad 4x = 64 \quad\Longrightarrow\quad x = 16\]

Check: \(y = 11 + 4(16) = 75\). Because the slope is positive, a larger \(y\) needs a larger \(x\): the line reaches 43 at \(x = 8\), so it must reach 75 further right, and 16 is. The answer is 16.
```

# Slope and intercept
Slope: predicted change per 1 more x. Intercept: start.

```visual
two-var-data--slope
```

## Key ideas
In \(y = a + bx\), the slope \(b\) is the **predicted change in \(y\) for each 1-unit increase in \(x\)**. Its units are "units of \(y\) per unit of \(x\)", such as centimeters per week. A negative slope means \(y\) is predicted to fall.

The intercept \(a\) is the predicted \(y\) when \(x = 0\). Sometimes it has no real meaning, because \(x = 0\) may be outside the data.

SAT answer choices use the words **predicted** or **estimated**, and they name both variables with their units. The right choice says "is predicted to increase by 2.5 centimeters for each additional week", never "increases exactly".

Watch the axes. If a graph starts at \(x = 1.5\) or \(y = 70\) instead of 0, the lower-left corner is **not** the \(y\)-intercept. Find the intercept from the equation, or extend the line back to \(x = 0\).

```example
\(y = 30 + 2.5x\) predicts a plant's height \(y\), in cm, \(x\) weeks after planting. What do 30 and 2.5 mean?
1. 30 stands alone: intercept :: Predicted height at week 0.
2. 2.5 multiplies \(x\): slope :: Predicted cm per week.
3. Starts at 30 cm, grows 2.5 cm a week :: Say it with units.
```

```theory
**Reading the slope in words.** Take \(y = 30 + 2.5x\). If \(x\) goes up by 1 week, \(y\) goes up by 2.5 cm. So the slope is "2.5 centimeters per week". In a graph, go 4 weeks right and the line rises 10 cm: \(\frac{10}{4} = 2.5\).

**Why "predicted".** The line is a model fitted to the dots. It does not claim that every plant grows exactly 2.5 cm. It claims that **on average** each extra week goes with about 2.5 cm more height. College Board choices always use words like "predicted", "estimated" or "on average". Pick the choice that includes them and the right units.

**The intercept.** The intercept is the predicted \(y\) at \(x = 0\): here, 30 cm at week 0. If \(x\) is something like the number of days a store is open, \(x = 0\) may not make sense, and then the intercept is just a number the line needs.

**Percent or amount?** A line changes by a fixed amount for each step, not by a fixed percent. "Drops by $12.50 each month" fits a slope of \(-12.5\). "Drops by 12.5% each month" would need an exponential model.

**Axes that do not start at zero.** Suppose a graph's axes start at \(x = 2\) and \(y = 30\), and the line passes through \((2, 30)\) and \((6, 50)\). The slope is \(\frac{20}{4} = 5\). The line's value at \(x = 0\) is \(30 - 5(2) = 20\), not 30. The corner of the graph is where the axes begin, not where the line crosses the \(y\)-axis.

Traps:
- Mixing up the slope and the intercept when both appear in a sentence.
- Reading the slope in the wrong units (per month, not per dollar).
- Taking the graph's corner as the intercept.
```

## Easy
```task
The equation \(y = 380 - 9.5x\) models the predicted price \(y\), in dollars, of a used phone \(x\) months after its release. Which of the following is the best interpretation of 9.5 in this context?
* The predicted price drops by $9.50 for each additional month.
- The predicted price at release is $9.50. :: That is not the intercept. The price at release is 380.
- The predicted price drops by 9.5% each month. :: A line changes by a fixed amount, not a percent.
- The predicted price reaches $0 after 9.5 months. :: It reaches $0 at 40 months, not 9.5.
highlight:
- "\(y = 380 - 9.5x\)" :: The slope is the number multiplying x: negative 9.5.
- "predicted price \(y\), in dollars" :: The slope's units come from y: dollars.
- "\(x\) months after its release" :: And from x: per month.
explain:
In \(y = 380 - 9.5x\), the number multiplying \(x\) is the slope, \(-9.5\). The intercept is 380.

The slope is the predicted change in \(y\) for each 1-unit increase in \(x\). Here \(y\) is the price in dollars and \(x\) is months, so the slope is \(-9.5\) dollars per month. The negative sign means the price falls.

So the predicted price drops by $9.50 for each additional month.

Check: the price at release (\(x = 0\)) is 380, which is the intercept, not 9.5. A line cannot drop by a percent, because it changes by the same amount each step. And \(380 - 9.5x = 0\) gives \(x = 40\), not 9.5. The answer is the first choice.
```

## Medium
```task
bank: m-1327
highlight:
- "number of seeds planted, x, and the number of seeds that germinated, y" :: Slope is the change in y per 1 unit of x.
- "best interpretation of the slope" :: Say it with units: y units per x unit, as a prediction.
- "line of best fit" :: The slope describes predictions, not exact values.
explain:
The slope is the predicted change in \(y\) for each 1-unit increase in \(x\). Here \(x\) is seeds planted and \(y\) is seeds that germinated.

Read two points on the line. It passes through about \((0, 0)\) and \((500, 300)\):

\[\text{slope} = \frac{300 - 0}{500 - 0} = 0.6\]

So germinated seeds are predicted to increase by 0.6 seeds for each additional seed planted. Per 100 seeds planted, that is 60 more seeds that germinate.

Check the wording. The slope compares seeds to seeds, not to days, so choices A and B are wrong. The slope is 60 per 100, not 300 per 100, which rules out D. The answer is C.
```

## Hard
```task
A scatterplot shows the relationship between the number of hours, \(x\), that a store is open each day and its daily sales, \(y\), in hundreds of dollars. Both axes start at values greater than 0: the \(x\)-axis starts at 1.5 and the \(y\)-axis starts at 70. The line of best fit passes through \((1.5, 70)\) and \((4.5, 82)\). According to the line, what are the predicted daily sales, in hundreds of dollars, when the store is open 0 hours?
answer: 64
- 70 :: That is \(y\) at \(x = 1.5\), the graph's left edge.
- 4 :: That is the slope, not the predicted sales.
highlight:
- "Both axes start at values greater than 0" :: The corner of the graph is not the y-intercept.
- "passes through \((1.5, 70)\) and \((4.5, 82)\)" :: Two points on the line give the slope.
- "when the store is open 0 hours" :: This is x = 0: the intercept, found by going back 1.5 hours.
explain:
First find the slope from the two points on the line:

\[b = \frac{82 - 70}{4.5 - 1.5} = \frac{12}{3} = 4\]

The graph does not start at \(x = 0\), so \((1.5, 70)\) is **not** the \(y\)-intercept. To find the value at \(x = 0\), go back 1.5 hours from \(x = 1.5\). The line drops by \(4 \times 1.5 = 6\) over that distance:

\[70 - 6 = 64\]

So the line is \(y = 64 + 4x\), and the predicted sales at 0 hours are 64 hundred dollars.

Check: \(64 + 4(1.5) = 70\) and \(64 + 4(4.5) = 82\). Both points lie on the line. The answer is 64.
```

# Actual and predicted
A dot is actual. The line predicts.

```visual
two-var-data--gap
```

## Key ideas
A dot is an **actual** value. The line gives the **predicted** value at the same \(x\). The gap between them is

\[\text{gap} = \text{actual} - \text{predicted}\]

A dot **above** the line has a positive gap: the actual value is greater than predicted. A dot **below** the line has a negative gap. A dot on the line has no gap.

To count how many actual values are greater than predicted, count the dots above the line.

Always find the line's \(y\) first, from the equation or by reading the line, and never use the dot's \(y\) for the prediction. Then compare.

```example
A line of best fit is \(y = 3x + 12\). One data point is \((8, 40)\). How far is the dot above the line?
1. Predicted: \(3(8) + 12 = 36\) :: From the line.
2. Actual: 40 :: From the dot.
3. Gap: \(40 - 36 = 4\) :: Actual minus predicted: 4 above.
```

```theory
The line of best fit is a model. It gives one predicted \(y\) for every \(x\), even where no dot exists. A dot is one real measurement. Because real data are never perfectly on a line, almost every dot has a gap. Sometimes this gap is called a **residual**.

Sign of the gap: above the line, the gap is positive (actual greater than predicted). Below, it is negative (actual less than predicted). For a word problem, read the direction carefully. If the question says "how many fewer visitors came than the line predicts", the answer is positive: predicted minus actual.

Reading a graph: go up from the chosen \(x\) to the line to read the predicted value. Then go up or down to the dot to read the actual value. If the dot is above the line, count it as "actual greater than predicted".

Working backward: if a data point is 4 units below the line \(y = 2x + 5\) at \(x = 10\), the line's value there is 25, so the dot's \(y\) is \(25 - 4 = 21\). Subtract when the dot is below, add when it is above.

A model that fits well has small gaps. A model with large gaps fits poorly. Some points can have a large gap even in a strong association, but the line still describes the overall pattern.

Traps:
- Using the dot's \(y\) as the prediction.
- Getting the sign wrong: below the line means negative.
- Mixing "how many more" and "how many fewer".
```

## Easy
```task
bank: m-16415
highlight:
- "The scatterplot shows 9 data points and their line of best fit" :: Each dot is an actual value. The line gives the predicted value.
- "For how many of the 9 data points" :: Count dots one by one.
- "actual y-value greater than the y-value predicted by the line of best fit" :: Actual greater than predicted means the dot is above the line.
explain:
The line of best fit gives the predicted \(y\)-value at each \(x\). A dot is the actual \(y\)-value at that \(x\).

The actual value is **greater** than the predicted value exactly when the dot lies **above** the line. So the question is: how many of the 9 dots are above the line?

Count the dots above the line. Looking at the graph, 5 of the 9 dots are above the line and the other 4 are below it.

Check: \(5 + 4 = 9\), so every dot is counted once. Counting the dots below the line (4) would answer the opposite question. The answer is C, 5.
```

## Medium
```task
The equation \(y = 6x + 40\) is the line of best fit for the number of tickets, \(y\), sold at a festival on day \(x\). On day 7, 91 tickets were sold. By how many tickets did the actual number sold on day 7 exceed the number predicted by the line?
answer: 9
- 82 :: That is the predicted number. The question asks for the gap.
- 91 :: That is the actual number. Find the gap.
~ type y=6x+40 :: Type the line.
~ type (7,91) :: The dot sits above the line.
~ zoom -2 12 -5 120
~ point (7, 82) :: On the line at x = 7: y = 82.
highlight:
- "\(y = 6x + 40\)" :: The line gives the predicted tickets.
- "On day 7, 91 tickets were sold" :: Actual number: 91, at x = 7.
- "exceed the number predicted by the line" :: Gap: actual minus predicted.
explain:
Find the predicted number first. The line is \(y = 6x + 40\), and day 7 means \(x = 7\):

\[y = 6(7) + 40 = 42 + 40 = 82\]

The actual number of tickets sold on day 7 was 91. The question asks by how many the actual number **exceeded** the predicted number, so subtract:

\[\text{actual} - \text{predicted} = 91 - 82 = 9\]

Check: 91 is above the line's 82, so the dot is above the line and the gap is positive. The answer is 9.
```

## Hard
```task
A line of best fit for a data set is \(y = 3.5x + 12\). A data point has an \(x\)-coordinate of 14 and lies 6.5 units below the line. What is the \(y\)-coordinate of the data point?
answer: 54.5
- 67.5 :: You added 6.5. The point is below the line, so subtract.
- 61 :: That is the line's value. The point is 6.5 below it.
highlight:
- "\(y = 3.5x + 12\)" :: The line gives the predicted y at any x.
- "an \(x\)-coordinate of 14" :: Put 14 in the equation to find the line's y there.
- "6.5 units below the line" :: Below the line: subtract 6.5 from the predicted value.
explain:
First find the line's \(y\)-value at \(x = 14\), which is the predicted value:

\[y = 3.5(14) + 12 = 49 + 12 = 61\]

The data point is 6.5 units **below** the line, so its actual \(y\)-value is smaller than the prediction. Subtract:

\[61 - 6.5 = 54.5\]

Check: the gap is \(\text{actual} - \text{predicted} = 54.5 - 61 = -6.5\). A negative gap fits a point below the line. Adding would give 67.5, which is a point above the line. The answer is 54.5.
```

# Choose the model
Same amount added: line. Same factor: exponential.

```visual
two-var-data--curve
```

## Key ideas
Look at how \(y\) changes each time \(x\) goes up by 1.
- **Linear:** the same amount is **added** each step. \(y = a + bx\).
- **Exponential:** the same factor is **multiplied** each step. \(y = a(b)^x\). If \(b > 1\) it is growth. If \(0 < b < 1\) it is decay.
- **Quadratic:** the dots **turn around**, rising then falling or falling then rising, like a parabola \(y = ax^2 + bx + c\).

Test with a table: constant differences mean linear, constant ratios mean exponential. Exponential growth rises faster and faster. Exponential decay falls quickly at first, then **more and more slowly**, flattening toward zero. An exponential never turns around.

```example
\(x = 0, 1, 2, 3\) gives \(y = 5, 10, 20, 40\). Find the model.
1. Steps: +5, +10, +20 :: Not the same amount: not linear.
2. \(\frac{10}{5} = \frac{20}{10} = \frac{40}{20} = 2\) :: Same factor: exponential, \(b = 2\).
3. \(y = 5(2)^x\) :: \(a = 5\), the \(y\) at \(x = 0\).
```

```theory
In \(y = a(b)^x\), \(a\) is the value at \(x = 0\) and \(b\) is the factor for each step. Here \(a\) and \(b\) are different numbers from the \(a\) and \(b\) in \(y = a + bx\).

**Growth and decay.** If \(b = 1.5\), each step is 150% of the one before, so \(y\) grows by 50% per step. If \(b = 0.8\), each step is 80% of the one before, so \(y\) falls by 20% per step. Decay values never reach zero: 100, 80, 64, 51.2, 40.96, ... keep shrinking, but by a smaller amount each time. The amounts lost (20, 16, 12.8, 10.24) get smaller, so the graph flattens. It is wrong to say decay falls "faster and faster".

**Choosing from a table.** For \(y = 80, 120, 180, 270\) the differences are 40, 60, 90, which are not constant, but the ratios are 1.5 each time. So the model is \(y = 80(1.5)^x\).

**Choosing from a description.**
- "Constant increase of 3 per year": linear.
- "Increases 8% per year": exponential, \(b = 1.08\).
- "Rises to a peak and falls": quadratic.
- "Falls quickly at first, then slowly, always above zero": exponential decay.

**Choosing from the dots.** A line that keeps going down will eventually cross zero, so it cannot match dots that stay above zero while flattening out. A downward parabola falls faster and faster, so it cannot match dots that flatten.

A wrong factor often comes from reading a loss as the factor. If a quantity loses 30% each step, the factor is 0.7, not 0.3.

Traps:
- Using 0.3 as the factor for a 30% decrease.
- Choosing a line because the dots go down.
- Choosing a parabola for a curve that never turns.
```

## Easy
```task
A ball is thrown straight up. Its height is recorded every quarter second. The dots rise, reach a peak, and then fall. Which type of model fits the data best?
- A linear model :: A line only rises or only falls. These dots turn around.
- An exponential growth model :: Growth only rises. These dots fall after the peak.
- An exponential decay model :: Decay only falls. These dots rise first.
* A quadratic model (a parabola opening downward)
highlight:
- "rise, reach a peak, and then fall" :: A pattern that turns around is a parabola, not a line or an exponential.
- "Which type of model fits the data best" :: Match the shape of the dots to the model type.
explain:
Look at the shape of the dots. They rise, reach a peak and then fall. The pattern **turns around**.

A linear model goes in one direction only. An exponential model, growth or decay, also goes in one direction only: growth keeps rising and decay keeps falling. None of them can turn around.

A **quadratic** model, a parabola, rises to a peak and then falls when it opens downward. That matches a ball thrown into the air.

Check: the ball's height goes up and then comes back down, so a model with a peak is needed. The answer is a quadratic model, a parabola opening downward.
```

## Medium
```task
A table shows the \(x\)-values 0, 1, 2 and 3 with the \(y\)-values 64, 48, 36 and 27. Which equation best models the data?
- \(y = 64 - 16x\) :: The drops are 16, 12 and 9. A line drops equally.
- \(y = 64(0.25)^x\) :: 0.25 is the part lost each step. The factor kept is 0.75.
* \(y = 64(0.75)^x\)
- \(y = 64(1.25)^x\) :: A factor above 1 would make \(y\) grow.
highlight:
- "\(x\)-values 0, 1, 2 and 3" :: The x-values go up by 1, so compare each y with the one before.
- "\(y\)-values 64, 48, 36 and 27" :: Ratios are 0.75 each time: exponential decay.
explain:
Test for a line first. The differences between the \(y\)-values are \(48 - 64 = -16\), \(36 - 48 = -12\) and \(27 - 36 = -9\). They are not equal, so the data are not linear.

Now test the ratios:

\[\frac{48}{64} = 0.75, \qquad \frac{36}{48} = 0.75, \qquad \frac{27}{36} = 0.75\]

The ratios are equal, so the model is exponential: \(y = a(b)^x\) with \(b = 0.75\). The value at \(x = 0\) is 64, so \(a = 64\).

Check: \(64(0.75)^3 = 64 \times 0.421875 = 27\), which matches the last value. The drops 16, 12 and 9 shrink because each step takes 25% of a smaller number. The answer is \(y = 64(0.75)^x\).
```

## Hard
```task
A drug's concentration in a patient's blood is measured each hour. The dots fall quickly at first, then more and more slowly, and stay above zero. The first two measurements are 200 milligrams per liter at hour 0 and 150 milligrams per liter at hour 1. Which equation best models the concentration \(y\), in milligrams per liter, at hour \(x\)?
- \(y = 200 - 50x\) :: A line reaches zero at hour 4. The dots stay above zero.
- \(y = 200 - 50x^2\) :: That falls faster and faster and passes zero.
* \(y = 200(0.75)^x\)
- \(y = 200(1.25)^x\) :: A factor above 1 means growth. The dots fall.
highlight:
- "fall quickly at first, then more and more slowly" :: Falling and flattening is the shape of exponential decay.
- "stay above zero" :: A line or a downward parabola would pass below zero.
- "200 milligrams per liter at hour 0 and 150 milligrams per liter at hour 1" :: Start 200. Next over this: 150 over 200 is 0.75.
explain:
Match the shape first. The dots fall quickly at first and then more and more slowly, always staying above zero. That is **exponential decay**. A line would keep falling at the same rate and cross zero, and a downward parabola would fall faster and faster. Neither matches.

Now find the factor. The value at hour 0 is 200, so \(a = 200\). One hour later it is 150, so each hour multiplies the concentration by

\[\frac{150}{200} = 0.75\]

The model is \(y = 200(0.75)^x\).

Check: at hour 2 it gives \(200 \times 0.5625 = 112.5\). The drops are 50, then 37.5, then smaller each time, so the decay slows down. The answer is \(y = 200(0.75)^x\).
```

# Shift and scale data
Every y times k? Slope and intercept times k.

```visual
two-var-data--scale
```

## Key ideas
Changing every \(y\)-value changes the line of best fit in a predictable way.
- **Multiply** every \(y\) by \(k\): the line \(y = a + bx\) becomes \(y = ka + kbx\). The intercept and the slope are both multiplied by \(k\).
- **Add** \(c\) to every \(y\): the intercept goes up by \(c\) and the slope stays the same.
- **Multiply** every \(x\) by \(k\): the slope is divided by \(k\) and the intercept stays the same.

Changing units works this way. Converting \(y\) from feet to inches multiplies every \(y\) by 12.

An easy way to remember: multiply the whole right side by \(k\). If \(y = 2x + 10\) and every \(y\) doubles, the new line is \(y = 2(2x + 10) = 4x + 20\).

```example
A line of best fit is \(y = 2x + 10\). Every \(y\)-value is doubled. Find the new line.
1. \(y = 2(2x + 10)\) :: Double the whole right side.
2. \(y = 4x + 20\) :: The slope and the intercept both double.
```

```theory
Why does this work? If every dot moves straight up to twice its height, the line through them also moves to twice its height. At \(x = 0\) it goes from 10 to 20. For each 1 step right, it now rises 4 instead of 2. So both numbers double.

**Adding a constant.** Add 10 to every \(y\) of \(y = 1.8x + 6\). Every dot moves up 10, so the whole line moves up 10. The line is \(y = 1.8x + 16\). The steepness does not change, because the dots all moved by the same amount. The slope stays 1.8.

**Scaling \(x\).** If the \(x\)-axis changes from weeks to days (multiplying each \(x\) by 7), then 1 step in the new \(x\) is only one seventh of a week, so the slope becomes \(\frac{b}{7}\). The intercept stays, because \(x = 0\) is still \(x = 0\).

**Multiple choice strategy.** Compute what you expect, then compare with the choices. If every \(y\) is multiplied by 2.5 and the original line is \(y = 8 + 1.2x\), the new intercept is 20 and the new slope is 3. Only the choice with both numbers fits. The common wrong choices scale only one of them.

If a question gives the original line only as a graph, read two points to find it first. Then apply the rule.

Typical traps:
- Scaling only the slope or only the intercept.
- Adding \(k\) when the problem multiplies by \(k\).
- Applying the change to \(x\) when it is \(y\) that changes.
```

## Easy
```task
A line of best fit for data set A is \(y = 4x + 10\). Data set B is created by multiplying every \(y\)-value in data set A by 3. Which of the following could be a line of best fit for data set B?
* \(y = 12x + 30\)
- \(y = 12x + 10\) :: You scaled only the slope. Scale the intercept too.
- \(y = 4x + 30\) :: You scaled only the intercept. Scale the slope too.
- \(y = 7x + 13\) :: You added 3. The problem multiplies by 3.
highlight:
- "\(y = 4x + 10\)" :: The original line: slope 4 and intercept 10.
- "multiplying every \(y\)-value in data set A by 3" :: Multiply the whole right side by 3.
explain:
Every \(y\)-value in data set A is multiplied by 3, so every dot moves to three times its height. The line moves with them. Multiply the whole right side of the equation by 3:

\[y = 3(4x + 10) = 12x + 30\]

Both numbers are multiplied by 3. The slope goes from 4 to 12 and the intercept goes from 10 to 30.

Check: at \(x = 0\), A's line is at 10, and B's line should be at three times that, 30. At \(x = 1\), A's line gives 14 and B's should give 42, and \(12 + 30 = 42\). The answer is \(y = 12x + 30\).
```

## Medium
```task
A line of best fit for data set A is \(y = 2.4x + 8\). Data set B is created by adding 15 to every \(y\)-value in data set A. Which of the following could be a line of best fit for data set B?
- \(y = 17.4x + 8\) :: You added 15 to the slope. It goes to the intercept.
- \(y = 2.4x + 8\) :: Adding to every \(y\) moves the line up, so it changes.
* \(y = 2.4x + 23\)
- \(y = 36x + 120\) :: You multiplied by 15. The problem adds 15.
highlight:
- "\(y = 2.4x + 8\)" :: The original line: slope 2.4 and intercept 8.
- "adding 15 to every \(y\)-value" :: Every dot moves up 15, so the whole line moves up 15.
explain:
Adding 15 to every \(y\)-value moves every dot straight up by 15, so the whole line moves up by 15. A line moved straight up keeps its steepness. The slope stays 2.4.

The intercept is the value at \(x = 0\). It also goes up by 15:

\[8 + 15 = 23\]

So the new line is \(y = 2.4x + 23\).

Check: at \(x = 5\), A's line gives \(2.4(5) + 8 = 20\), and B's line should give \(20 + 15 = 35\). The new line gives \(2.4(5) + 23 = 35\). The answer is \(y = 2.4x + 23\).
```

## Hard
```task
bank: m-1236
highlight:
- "multiplying the y-coordinate of each data point from data set E by 3.9" :: Multiply the whole line by 3.9.
- "Which of the following could be an equation of a line of best fit for data set F" :: Both the slope and the intercept must change.
explain:
Read the line for data set E from the graph. It crosses the \(y\)-axis near 12 and rises about 1.5 per unit, so it is about \(y = 12 + 1.5x\).

Data set F multiplies every \(y\)-value by 3.9. That multiplies the whole right side of the equation, so both the intercept and the slope are multiplied by 3.9:

\[3.9 \times 12 = 46.8, \qquad 3.9 \times 1.5 \approx 5.9\]

So a line of best fit for F is \(y = 46.8 + 5.9x\).

Check: choice B, \(y = 46.8 + 1.5x\), scales only the intercept. Choice C scales only the slope. Choice D scales neither. Only the first choice has both numbers scaled. The answer is A.
```

# Line graphs
A segment's slope is the average rate of change.

```visual
two-var-data--line-graph
```

## Key ideas
A **line graph** joins points in order, often with time on the \(x\)-axis. The **average rate of change** between two points is the slope of the segment that joins them:

\[\text{average rate of change} = \frac{y_2 - y_1}{x_2 - x_1}\]

Its units are "units of \(y\) per unit of \(x\)", such as dollars per month. A positive rate means \(y\) went up. A negative rate means \(y\) went down.

The **steepest** segment has the greatest rate. For a longer interval, calculate that interval's own rate. Do not pick it just because it contains the steepest segment. The highest point on a graph is a large **value**, not a large rate of change.

```example
A line graph of a town's population, in thousands, has points at 2010: 40, 2012: 46, 2014: 48 and 2016: 60. What is the average rate of change from 2012 to 2016?
1. \(\frac{60 - 46}{2016 - 2012}\) :: Change in \(y\) over change in \(x\).
2. \(\frac{14}{4} = 3.5\) :: Divide.
3. 3.5 thousand people per year :: Add the units.
```

```theory
The **average rate of change** over an interval is how much \(y\) changed, divided by how much \(x\) changed. On the graph it is the slope of the straight segment joining the two ends of the interval, even if the graph bends in between.

For the population graph above, the three segments have rates \(\frac{6}{2} = 3\), \(\frac{2}{2} = 1\) and \(\frac{12}{2} = 6\) thousand per year. The 2014 to 2016 segment is steepest. The rate over 2012 to 2016 is the number between them, 3.5, because it averages the two segments in between (1 and 6) with the same widths.

**Choosing among intervals.** If two intervals of the same width both contain the steepest segment, calculate both. Suppose sales on days 0, 3, 6, 9, 12 are 10, 11, 14, 32, 45. From day 3 to day 9 the rate is \(\frac{32 - 11}{6} = 3.5\) per day. From day 6 to day 12 it is \(\frac{45 - 14}{6} \approx 5.17\). Both contain the steep jump from day 6 to 9, but day 6 to 12 wins because its other segment rises more.

**Negative rates.** A pool that goes from 150 liters at 0 minutes to 60 liters at 6 minutes has a rate of \(\frac{60 - 150}{6} = -15\) liters per minute. The minus sign means "falling". When a question says "decreases", you may need the positive size of the change.

**Reading versus computing.** "Which month had the highest profit" asks for the highest point. "Between which months did profit increase the most" asks for the steepest rise. They are different questions.

Traps:
- Using the \(y\)-values instead of their change.
- Dividing by the wrong interval length (counting points instead of the \(x\)-distance).
- Forgetting the sign for a decrease.
```

## Easy
```task
A line graph has points at \((1, 12)\), \((2, 20)\), \((3, 23)\), \((4, 41)\) and \((5, 47)\), where \(x\) is the month and \(y\) is the profit, in thousands of dollars. Between which two consecutive months did the profit increase the most?
- Months 1 and 2 :: That rise is 8. Another rise is bigger.
- Months 2 and 3 :: That rise is only 3.
* Months 3 and 4
- Months 4 and 5 :: That rise is only 6.
highlight:
- "points at \((1, 12)\), \((2, 20)\), \((3, 23)\), \((4, 41)\) and \((5, 47)\)" :: Subtract neighboring y-values to get each rise.
- "consecutive months" :: Each interval is 1 month wide, so the biggest rise is the steepest segment.
- "increase the most" :: Find the largest change in y.
explain:
Each pair of consecutive months is 1 month wide, so the biggest increase in profit is simply the biggest difference between neighboring \(y\)-values:
- Months 1 to 2: \(20 - 12 = 8\)
- Months 2 to 3: \(23 - 20 = 3\)
- Months 3 to 4: \(41 - 23 = 18\)
- Months 4 to 5: \(47 - 41 = 6\)

The largest rise is 18, from month 3 to month 4. That segment is the steepest one on the graph.

Check: month 5 has the highest profit (47), but the question asks for the biggest increase, not the highest value. The answer is months 3 and 4.
```

## Medium
```task
A line graph shows the water level in a tank. The graph passes through \((3, 90)\) and \((10, 20)\), where \(x\) is the time in minutes and \(y\) is the water level in liters. What is the average rate of change, in liters per minute, from \(x = 3\) to \(x = 10\)?
answer: -10
- 10 :: The level falls, so the rate of change is negative.
- -70 :: That is the total change. Divide by the 7 minutes.
highlight:
- "passes through \((3, 90)\) and \((10, 20)\)" :: These are the two ends of the interval.
- "average rate of change" :: Change in y divided by change in x.
- "from \(x = 3\) to \(x = 10\)" :: The interval is 7 minutes wide.
explain:
The average rate of change is the change in \(y\) divided by the change in \(x\):

\[\frac{20 - 90}{10 - 3} = \frac{-70}{7} = -10\]

The water level changes by \(-10\) liters per minute. The negative sign means the level is falling.

Check: over 7 minutes at 10 liters per minute, the tank loses 70 liters, and \(90 - 70 = 20\), which is the second point. The question gives the rate per minute, so the units are liters per minute. The answer is \(-10\).
```

## Hard
```task
A line graph of a website's daily visitors has points at \((0, 40)\), \((2, 52)\), \((4, 60)\), \((6, 84)\) and \((8, 90)\), where \(x\) is the day and \(y\) is the number of visitors. Over which of the following intervals is the average rate of change of visitors greatest?
- Day 0 to day 4 :: Its rate is \(\frac{20}{4} = 5\) visitors per day.
* Day 2 to day 6
- Day 4 to day 8 :: Its rate is \(\frac{30}{4} = 7.5\), just under the best.
- Day 0 to day 8 :: Its rate is \(\frac{50}{8} = 6.25\) visitors per day.
highlight:
- "points at \((0, 40)\), \((2, 52)\), \((4, 60)\), \((6, 84)\) and \((8, 90)\)" :: Use these points to find the change over each interval.
- "average rate of change of visitors" :: Change in visitors divided by the number of days.
- "greatest" :: Compare all four rates, not just which interval has the steepest segment.
explain:
Find each interval's rate: the change in visitors divided by the change in days.
- Day 0 to day 4: \(\frac{60 - 40}{4} = 5\)
- Day 2 to day 6: \(\frac{84 - 52}{4} = 8\)
- Day 4 to day 8: \(\frac{90 - 60}{4} = 7.5\)
- Day 0 to day 8: \(\frac{90 - 40}{8} = 6.25\)

The greatest is 8 visitors per day, from day 2 to day 6.

Check: day 4 to day 8 and day 2 to day 6 both contain the steep jump from day 4 to day 6 (a rise of 24). But day 2 to day 4 rises 8, while day 6 to day 8 rises only 6, so day 2 to day 6 wins. The answer is day 2 to day 6.
```
