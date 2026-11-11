Research notes for the four data and statistics skills in Problem-Solving and Data Analysis (Math), gathered in November 2026 for the lessons `one-var-data`, `two-var-data`, `inference-sample` and `statistical-claims`.

Notes on access. Reddit blocks automated access from our research tools (both page fetches and site-limited searches were refused), so no Reddit thread could be opened and none is cited. Khan Academy's lesson pages sit behind a browser check and couldn't be opened; the names of Khan's Digital SAT lessons for these skills (Center, spread, and shape of distributions; Data representations; Scatterplots; Linear and exponential growth; Data inferences; Evaluating statistical claims) were confirmed through Scalar Learning's video series that works through them. Search results (not the pages themselves) also showed that Khan's course splits each skill into foundations, medium and advanced practice, and that its statistical claims unit uses "Data collection and conclusions" videos and a foundations exercise on choosing a sampling method, which matches the first claims example. YouTube transcripts couldn't be loaded, so every claim about a video below rests on its title, description and chapter list (and, for the James Lu video, a published summary). The shared web search budget ran out twice during the work, so the later sources were opened from links found earlier rather than from new searches. The College Board's practice test answer explanations (tests 4 to 10) were read for question patterns only; no official question is reproduced in the lessons.

## One-variable data

### Best sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the detailed testing points: data in frequency tables, histograms, dot plots and box plots; mean, median and range; distributions with the same and with different standard deviations; the effect of outliers. Also gives the domain size (15%, 5 to 7 questions) and a sample dot plot question where adding a constant moves the median but not the range.
- [Skills Insight for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — what students in each score band can do: mean, median and range in band 3, comparing with standard deviation in band 4, outliers in band 6, and how changes to a data set move the mean, median and range in band 7. Used to order the examples from easy to hard.
- [SAT Practice Test 8 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-8-answers-digital.pdf) — official reasoning for adding a value larger than all others to a long frequency table (mean up, median unchanged) and for comparing standard deviations of symmetric dot plots.
- [SAT Practice Test 10 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-10-answers-digital.pdf) — the histogram question type with whole-number intervals, solved with the smallest and greatest possible means; the wrong choices come from ranges, sums and the wrong pair of limits.
- [SAT Practice Test 6 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-6-answers-digital.pdf) and [SAT Practice Test 9 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-9-answers-digital.pdf) — a wrong choice that is the position of the median instead of its value, mean and range offered as distractors for a median question, and the rule that dot plots with the same shape have the same standard deviation.
- [Standard Deviation (1600.io)](https://1600.io/courses/1698988/lectures/53518736) — argues that the test only asks for comparisons that can be made by looking, and that Desmos can't read a frequency table directly, so typing data in is rarely worth the time.
- [Mastering Distributions and Measures of Center and Spread (Test Ninjas)](https://www.test-ninjas.com/sat-distribution-center-spread) — the (n + 1)/2 position rule, shift versus scale rules, and "compute only the measure asked for".
- [One-variable statistics (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/one-variable-statistics) — box plot quarters each hold 25% whatever their length, skew and the mean-median gap, and the Desmos functions `stdev` and `stdevp`.
- [What Is Standard Deviation? An SAT Student's Guide (IvyStrides)](https://www.ivystrides.com/blog/standard-deviation/) — what happens to the standard deviation when you add a value at the mean, add a far value or remove the farthest value; warns not to judge spread by range or by location.
- [Statistics on SAT Math: Strategies for Mean, Median, Mode (PrepScholar)](https://blog.prepscholar.com/statistics-on-sat-math-strategies-for-mean-median-and-mode) — the totals method (mean × count) for missing and removed values, and finding the median of a large frequency table by position. One worked example on the page has an arithmetic slip.
- [SAT Math Standard Deviation (Magoosh)](https://magoosh.com/sat/sat-math-standard-deviation/) — a two-step routine (find the center, then judge how tightly values cluster) and an example where the range misleads.
- [Center, Shape, and Spread of Data (Varsity Tutors)](https://www.varsitytutors.com/practice/subjects/sat/lessons/center-shape-and-spread-of-data) — skew direction, choosing mean or median, and the effect of adding one extreme value.
- [Standard Deviation: comparing two data sets on the SAT (Settele Tutoring, YouTube)](https://www.youtube.com/watch?v=Bxa0ooW-F2Q) — about 13,000 views; the description says no calculation is needed and the chapters cover reading spread from the shape of dot plots and histograms.
- [Frequency Charts (Settele Tutoring, YouTube)](https://www.youtube.com/watch?v=vWu8WjHQr4w) — chapters on dot plots, mean, median and range from frequency charts, and histograms with intervals, which the description calls a common source of lost points.
- [All of Problem Solving and Data Analysis on the SAT (James Lu, YouTube)](https://www.youtube.com/watch?v=rytygT3oFO4) — about 131,000 views (2026); the description lists the core rules: Desmos `mean()` and `stdev()`, the box plot line is the median, the top of each bar gives the greatest possible mean, and shifting versus multiplying the data.
- [All of SAT Problem-Solving and Data Analysis in 25 Minutes (The SAT Gamified, YouTube)](https://www.youtube.com/watch?v=i0bBokmVtWw) — about 47,000 views (2026); chapters on mean, median and skew, standard deviation and range, and "the shift rule".
- [Digital SAT Math: Desmos Lesson #13 Mean and Median (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=oOZeeiLe13g) — about 105,000 views; Desmos mean and median and missing-number problems.
- [Standard Deviation: ONE Simple Key To ALL The Questions (John Jung, YouTube)](https://www.youtube.com/watch?v=s9LDUDl2MwA) — about 167,000 views but from 2021, before the digital test; its chapters show the same "estimate spread from the graph" approach.

### What the best teachers agree on

- Standard deviation is never calculated on the test. You compare how far values sit from each data set's own center; a shifted copy of a data set has the same standard deviation.
- For a median, sort first, find the position, and count through a frequency table with a running total. Never answer with the position.
- Mean × count = total unlocks missing values, removed values and combined groups.
- Outliers pull the mean but barely move the median; the mean-median gap shows the direction of skew.
- Adding a constant moves the center only; multiplying moves center and spread.
- In a box plot the middle line is the median, each quarter holds about 25% of the data, and neither the mean nor the number of values is shown.
- For histograms with intervals, bound the mean with the interval ends and watch whole-number edges.
- Desmos is worth it for long raw lists; for frequency tables, counting by hand is usually faster.

### Disagreements and choices made

- Desmos for standard deviation: James Lu and Scalar Learning's Desmos guide push `stdev()`, while 1600.io says visual comparison is faster and Desmos can't read a frequency table. The official explanations (tests 8 and 9) solve these by looking, so the lesson teaches the visual rule as the method and Desmos as a check for short lists.
- `stdev` versus `stdevp`: Open Exam Prep lists both. For comparing two lists of the same size the ranking is the same, so the lesson only says to use the same function for both.
- Judging spread by shape: one IvyStrides page ranks shapes (bell, skewed, two-peaked) by spread, but its longer guide says shape names don't rank spread. The lesson uses only the distance-from-center rule, which works for every display.
- How many questions: James Lu's chapter labels give percentages per topic, IvyStrides says 1 to 2 standard deviation questions per test, and the College Board gives 5 to 7 questions for the whole domain. Counting the items in official practice tests 4 to 10 gave 1 to 3 one-variable items per test (about 2 on average), 0 to 2 two-variable items, 0 or 1 margin-of-error or sampling item, and no study-design item; the lessons use these counts.
- Mean from a frequency table in Desmos: no source gave exact syntax. The lesson uses two lists and `total(V*F)/total(F)`, which relies on Desmos multiplying lists value by value (documented list broadcasting). Desmos's own help pages couldn't be opened to double-check.
- One prep site says the test may ask how many values lie within one standard deviation of the mean. That isn't in the College Board's testing points, so it was left out.

## Two-variable data and scatterplots

### Best sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — testing points: read scatterplots with and without predictions, fit linear, quadratic and exponential models, read graphs that model a relationship, compare linear and exponential growth. Its sample question shows the classic wrong choices: the residual and the predictions at the neighboring x-values.
- [SAT Practice Test 5 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf) — counting points above the line as the points whose actual value is greater than predicted.
- [SAT Practice Test 6 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-6-answers-digital.pdf) — a good model follows the trend with points above and below it; and when every y-value is multiplied by a constant, both the slope and the intercept of the line of best fit are multiplied too.
- [SAT Practice Test 7 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-7-answers-digital.pdf) and [SAT Practice Test 10 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-10-answers-digital.pdf) — reading a prediction from the line, estimating the slope from two points on the line, and matching an equation by the signs of its slope and intercept.
- [Mastering Two-Variable Data and Scatterplots (Test Ninjas)](https://www.test-ninjas.com/sat-two-variable-data-scatterplots) — a trend, fit, estimate routine, direction versus strength, interpolation versus extrapolation.
- [Scatterplots and Line of Best Fit (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/scatterplots-line-best-fit) — residual = actual − predicted with its sign, a warning about intercepts outside the data, hedged wording, and Desmos regression forms. (It wrongly calls a parabola's turning point an inflection point.)
- [Scatter Plot: A Study Guide (Albert.io)](https://www.albert.io/blog/scatter-plot-a-study-guide-for-mastering-scatterplots-and-models/) — the table test: equal differences for linear, equal ratios for exponential, equal second differences for quadratic.
- [Scatter Plots (Varsity Tutors)](https://www.varsitytutors.com/practice/subjects/sat/lessons/scatter-plots) — slope and intercept in context and the meaning of residual signs.
- [Meaning of Model Components (JustLockedIn)](https://justlockedin-main.pages.dev/patterns/math/problem-solving-and-data-analysis/two-variable-data:-models-and-scatterplots/meaning-of-model-components.html) and [Model Evaluation (JustLockedIn)](https://justlockedin-main.pages.dev/patterns/math/problem-solving-and-data-analysis/two-variable-data:-models-and-scatterplots/model-evaluation.html) — question patterns: eliminate by the signs of slope and intercept, describe the slope as a per-unit rate, and choose increasing or decreasing, linear or exponential from word clues.
- [SAT Regression with Desmos (The Test Advantage)](https://thetestadvantage.com/blog/sat-regression-with-desmos-may-2026-data-tables-to-equations) — regression syntax for linear, quadratic and exponential models, typing `~` instead of `=`, and the starting-year trap.
- [Identifying an Exponential Equation from Values or Points (1600.io)](https://1600.io/courses/1698988/lectures/43506884) — test each answer choice in Desmos at t = 0, 1 and 2, or let a regression find the constants.
- [Using Desmos (OpenStax Algebra 1)](https://openstax.org/books/algebra-1/pages/using-desmos) — confirms the table columns x_1 and y_1, the `y1~mx1+b` form and that Desmos reports r and r².
- [SAT Problem Solving and Data Analysis (UWorld)](https://collegeprep.uworld.com/blog/sat-data-analysis-and-problem-solving/) — points above the line have actual values greater than predicted; don't assume trends beyond the data.
- [How to Cram for SAT Math (SupertutorTV)](https://supertutortv.com/sat/how-to-cram-for-sat-math/) — check where each axis starts and how it counts, then take two points that sit on the line to get an approximate equation; also stresses that a box plot's middle line is the median. The page predates the digital test (it suggests a handheld calculator program), so only the reasoning was used.
- [Digital SAT Math Official Guide #3: Problem-Solving and Data Analysis (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=rFVm6ABV73A) — chapters on scatterplots and lines of best fit, slope and intercept interpretation, modeling, and linear versus exponential growth.
- [Digital SAT Math Ottocento #32: Scatterplots + Lines of Best Fit (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=RwBTzwNYjog) — a lecture followed by 21 practice questions.
- [SAT Math on Khan Academy: Scatterplots (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=EBsGtgRs2YY) and [Linear and Exponential Growth (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=P_gS6MmfXG8) — worked problems from the matching Khan Academy lessons.
- [Desmos Bible for the Digital SAT Math (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=3l2hgANLQV8) — chapters on regressions from a table, custom regression models with the tilde, and data-set statistics.

### What the best teachers agree on

- Predicted values come from the line; actual values are the dots; residual = actual − predicted, positive above the line.
- Interpret the slope with a "for each additional unit of x, the predicted y changes by ..." sentence, and the intercept as the predicted value at x = 0, which may not be meaningful in context.
- Choose a model by shape, or by differences versus ratios in a table; a good model has data on both sides of it.
- Correlation is not causation, and predictions far outside the data are risky.
- When the data comes as a table, a Desmos regression with `~` is the fastest way to the equation.

### Disagreements and choices made

- Building the line by hand versus regression: Test Ninjas builds the line from two points on it, while Scalar Learning and The Test Advantage go straight to Desmos regression. Official questions usually show a drawn line with well-separated choices, so the lesson teaches estimating from signs and two points first and uses regression for tables (Example 4 shows both routes).
- Exponential regression settings: The Test Advantage says the College Board's version of Desmos uses log mode for exponential regressions. Desmos's help pages couldn't be opened to confirm, so the lesson only tells students to pick the closest choice and to check that the factor is above 1 for growth and below 1 for decay.
- Line notation: the test writes lines both as y = mx + b and as y = a + bx (Practice Test 6). The lesson teaches "the slope is the number multiplied by x" so both forms work.
- Transformations of the whole data set appear only in the hardest official items. The lesson includes one example (multiply and add to the y-values) built on the official rule, with different numbers and a different change.

## Inference from samples and margin of error

### Best sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — testing points: use a sample mean or proportion to estimate the population value, interpret margin of error, and know that a larger sample generally gives a smaller margin of error.
- [Skills Insight for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — band 5: choose plausible values of a population mean or proportion from a sample statistic and its margin of error.
- [SAT Practice Test 4 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf) — the official phrase "interval of plausible values" and the wrong choice that treats the estimate as exact.
- [SAT Practice Test 5 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf) — scaling a sample proportion to a population count; the wrong choices are counts from the sample and the number of people not sampled.
- [SAT Practice Test 8 answer explanations (College Board)](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-8-answers-digital.pdf) — a margin of error on a mean price, read as plausible values for the population mean.
- [Data Inference and Margin of Error (Test Ninjas)](https://www.test-ninjas.com/sat-data-inference-margin-of-error) — a sample, scale, interval routine; the margin of error doesn't cover bias, wording or nonresponse.
- [Study Design and Margin of Error (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/study-design-margin-error) — the margin of error shrinks with the square root of the sample size (4 times the sample halves it), population size barely matters, and a majority needs the whole interval above 50%.
- [Inferences and Claims from Statistics (Varsity Tutors)](https://www.varsitytutors.com/practice/subjects/sat/lessons/inferences-and-claims-from-statistics) — question types, the meaning of 95% confidence, and overlapping intervals that can't decide who leads.
- [SAT Math review: inference from samples (Albert.io)](https://www.albert.io/blog/?p=117755) — estimating counts, a majority example, comparing two estimates by overlap, and hedged answer wording.
- [Understanding the margin of error in election polls (Pew Research Center)](https://www.pewresearch.org/short-reads/2016/09/08/understanding-the-margin-of-error-in-election-polls/) — an authoritative explanation of what the margin of error measures (sampling error only) and why the gap between two numbers needs a larger margin than either number.
- [SAT Problem Solving and Data Analysis (Target Test Prep)](https://sat.blog.targettestprep.com/sat-problem-solving-and-data-analysis/) — the interval is about the population mean, not individual items or the sample. (The page contains arithmetic errors, so it was used only for the idea.)
- [Margin of Error (JustLockedIn)](https://justlockedin-main.pages.dev/patterns/math/problem-solving-and-data-analysis/inference-from-sample-statistics-and-margin-of-error/margin-of-error.html) and [Methods and Inferences (Achievable)](https://app.achievable.me/study/sat/learn/problem-solving-and-data-methods-inferences) — elimination of "every" and "exactly", and the note that these questions appear less than once per test on average.
- [Margin of Error: a rare but easy SAT topic (Settele Tutoring, YouTube)](https://www.youtube.com/watch?v=vGRch23Xui0) — about 6,000 views; the description and chapters center on what "plausible" means, with two example questions.
- [SAT Math on Khan Academy: Data Inferences (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=EpIglJ84NKk) — worked problems from Khan Academy's lesson for this skill.

### What the best teachers agree on

- Build the interval (estimate minus and plus the margin of error); plausible values are the ones inside it.
- The interval is about the population's mean or proportion, not about each person and not about the sample, whose value is known exactly.
- A larger random sample gives a smaller margin of error, but no margin of error fixes a biased sample.
- Estimate a count with sample proportion × population size.
- Correct answers use hedged words such as "plausible" and "likely".

### Disagreements and choices made

- How much the sample size matters: Varsity Tutors and Open Exam Prep teach the square-root rule (4 times the sample halves the margin), while the College Board only says "larger sample, smaller margin". The lesson makes the direction the main rule and uses the 4-times fact only to defeat the trap "doubling the sample halves the margin".
- Overlapping intervals: Albert.io and Varsity Tutors say overlap means no clear difference. Pew points out that a difference between two estimates has a larger margin than either one, so the overlap rule is a simplification. The lesson teaches "overlap: either could be larger" and words the non-overlap case carefully ("gives evidence"), because both statements are safe.
- Confidence level: PrepScholar says SAT intervals are always 95%, but official digital items often state no level. The lesson mentions 95% as typical without relying on it.
- A "sample larger than 30" rule (Target Test Prep) is not part of the College Board's testing points and was left out.

## Evaluating statistical claims

### Best sources

- [Assessment Framework for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — testing points: with random samples, describe the population the results extend to; with or without random assignment, decide whether there is evidence of cause; understand sampling problems. The skill is listed for the SAT only, not the PSAT tests.
- [Skills Insight for the Digital SAT Suite (College Board)](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf) — "identify or describe the population to which the results of a research study can reasonably be extended" sits in the top score band.
- [Evaluating Statistical Claims (Test Ninjas)](https://www.test-ninjas.com/sat-evaluating-statistical-claims) — a sample, assignment, claim routine, the common flaws, and "a large sample doesn't fix bias".
- [Study Design and Margin of Error (Open Exam Prep)](https://open-exam-prep.com/study-guides/sat-math/problem-solving-data-analysis/study-design-margin-error) — the four combinations of random sampling and random assignment, types of sampling bias, and confounding examples.
- [Random Selection vs. Random Assignment (Statology)](https://www.statology.org/random-selection-vs-random-assignment/) — a clean two-by-two table of what each kind of randomness supports.
- [SAT Math: Problem Solving and Data Analysis (Magoosh)](https://magoosh.com/sat/sat-math-problem-solving-and-data-analysis/) — groups formed by a coach's judgment block a causal conclusion, and random assignment of a non-random sample still supports cause for those subjects.
- [Inferences and Claims from Statistics (Varsity Tutors)](https://www.varsitytutors.com/practice/subjects/sat/lessons/inferences-and-claims-from-statistics) — volunteer bias and causal wording after a survey.
- [SAT practice question PSDA-030 (Manhattan Review)](https://www.manhattanreview.com/sat-practice-questions/sat-math-psda-030/) and [question 1387 (Manhattan Review)](https://www.manhattanreview.com/sat-practice-questions/1387/) — classic four-choice conclusion items whose wrong choices overgeneralize, deny the cause or reverse it.
- [Digital SAT Math Ottocento #15: Statistics Conclusions (Tutorllini Test Prep, YouTube)](https://www.youtube.com/watch?v=GqJsG_6y_Sk) — about 14,000 views; a full lecture followed by ten practice questions.
- [SAT Math on Khan Academy: Evaluating Statistical Claims (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=97sijd-hSG4) — worked problems from Khan Academy's lesson for this skill.
- [All of Problem Solving and Data Analysis on the SAT (James Lu, YouTube)](https://www.youtube.com/watch?v=rytygT3oFO4) — the "Generalization" chapter; the description states the two rules (generalize only to the group sampled; random assignment for cause).
- [Random sampling vs. random assignment (Mine Çetinkaya-Rundel, YouTube)](https://www.youtube.com/watch?v=S6y4QV7Kyl4) — about 36,000 views; a short explanation of generalizability versus causality by a statistics professor, not SAT-specific.

### What the best teachers agree on

- Ask two separate questions: random sampling decides who the results describe; random assignment decides whether a cause can be claimed.
- Observational studies support only associations, because confounding variables can explain the link.
- Voluntary response and convenience samples are biased, and a bigger sample doesn't help.
- Wrong choices either claim too much (cause, a bigger population, "every") or too little ("no conclusion").
- These questions are rare (none appear in the math sections of official practice tests 4 to 10), but they are quick once the two rules are automatic.

### Disagreements and choices made

- "Default to association" (Test Ninjas) versus always asking both questions (Open Exam Prep, Statology): the default fails for experiments, so the lesson teaches the two-question check every time.
- Volunteers with random assignment: some summaries treat volunteer samples as ruining a study, but the College Board's wording, Statology and Magoosh all support "a cause, but only for people like the volunteers". The lesson teaches this and makes it the hardest example.
- Technical terms such as internal and external validity were left out; "who can we talk about?" and "can we say it causes?" are easier for students who are still learning English.
