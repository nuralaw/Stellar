Research notes for two Algebra skills (systems of two linear equations; linear inequalities) and the Desmos strategy lesson. Research date: November 2026.

How the research was done, and its limits:

- **Official material was the backbone.** The Assessment Framework (version 4, September 2026) gives the exact testing points for both skills, the size of the Algebra domain (about 35%, 13 to 15 of 44 questions), the calculator rule and the answer-entry rules. For Desmos, the College Board calculator policy, the Bluebook "new and updated features" page and the College Board and Desmos sheet "updated for SY2026-2027" were read.
- **Every Desmos input in the three lessons was tested in the real test-day calculator** (the College Board version at desmos.com/testing/collegeboard/graphing), in a separate headless browser. Each input was typed key by key, and the result was read back. The page's settings were read too: radians by default; images, folders and notes off; log mode on by default for regressions; sliders, points of interest and custom regressions on. Labels and menus were checked with screenshots.
- **Big typing finding.** Typing an underscore subscript keeps the cursor inside the subscript. The characters =, + and − leave it, but ~ and a space do not. So `y_1~mx_1+b`, typed literally, puts the ~ inside the subscript and Desmos shows an error ("Subscripts may only contain letters and digits"). Typing `y1~mx1+b` works, because Desmos turns a digit after a letter into a subscript by itself and leaves it at the next symbol. In the same way, a fraction keeps everything typed after / in its bottom part until the right arrow key is pressed: `y=1/2x+3` becomes 1/(2x + 3), and `1/3 + 1/4` becomes 1/(3 + 1/4). The lessons teach the forms that work.
- **Khan Academy** lesson pages are drawn by script, so they were read through a text-rendering reader (before the shared search budget ran out). Four medium-level Algebra lessons and the "Calculators on the SAT" article were read this way.
- **Reddit** (reddit.com, old.reddit.com and the .json route) refused every direct request, and mirrors refused too. Two r/Sat threads were read only through search-engine extracts, so nothing in the lessons is presented as Reddit advice.
- **YouTube transcripts** could not be downloaded (YouTube refused scripted transcript requests, and transcript sites refused or needed a login). Video notes below come from titles, view counts, descriptions, chapter lists and, for three videos, AI summaries with timestamps on summary sites.
- The shared web-search budget ran out once and the network dropped once, so some sources were opened directly by URL.

## Systems of two linear equations

### Best sources

- [College Board: Assessment Framework for the Digital SAT Suite, version 4](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — the official testing points: create and use a system in context; model constraints on two quantities; solve "making strategic use of algebraic structure" (the x + y shortcut); decide when a system has no solution, one solution or infinitely many; connect equations and graphs. Its sample question prices the same purchase at two stores, a context worth knowing.
- [College Board: SAT Math, Algebra](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types/algebra) — the five Algebra skills and the domain claim (analyze, solve and create linear equations and inequalities; solve systems with several techniques).
- [Khan Academy: Solving systems of linear equations (SAT, medium)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:solving-systems-of-linear-equations-medium/a/v2-sat-lesson-solving-systems-of-linear-equations) — substitution when a variable is isolated or can be in one step; elimination when terms match, are opposite or are a multiple; number of solutions by slopes and intercepts. Its "spot the mistake" item shows the error of checking only one equation.
- [Khan Academy: Systems of linear equations word problems (SAT, medium)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:systems-of-linear-equations-word-problems-medium/a/v2-sat-lesson-systems-of-linear-equations-word-problems) — the count equation plus value equation pattern; contexts include tickets, coins, points gained and lost, people in vehicles; "6 more years than" means s + 6.
- [Open Exam Prep: Special solutions and constants](https://open-exam-prep.com/study-guides/sat-math/algebra-systems/systems-special-solutions-constants) — the three ratio rules, the scalar-multiplier method, "clear fractions first", and the trap of stopping once the slopes match.
- [JustLockedIn: Structured systems](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/structured-systems.html) — combination questions in three kinds: direct sums, scaled combinations, and repeated grouped expressions treated as one unknown.
- [JustLockedIn: Systems word problems](https://justlockedin-main.pages.dev/patterns/math/algebra/systems-of-linear-equations-in-two-variables/word-problems.html) — templates (count plus value, count plus relationship, the same items at two prices) and the reversed-multiplier trap.
- [Test Ninjas: SAT systems of linear equations](https://www.test-ninjas.com/sat-systems-of-linear-equations) — clear traps list: forgetting to scale the constant, dropping parentheses, stopping at x, solving when comparing coefficients is faster.
- [PrepScholar: Systems of equations in SAT Math](https://blog.prepscholar.com/systems-of-equations-sat-math-algebra-prep-and-practice) — graphing, substitution and elimination side by side; a k-for-no-solution example with a warning about the "bait" positive answer.
- [Achievable: Systems of equations](https://app.achievable.me/study/sat/learn/algebra-systems) — calls Desmos graphing the fastest route for most students, but warns that nearly parallel lines are hard to judge on screen; also the trap of reading 3x = 2x as "no solution".
- [The Test Advantage: Infinite-solution systems on Desmos](https://thetestadvantage.com/blog/sat-infinite-solutions-systems-on-desmos-may-2026-full-guide) — type the computed constant into the slider line instead of dragging; ratios fail when a coefficient is 0.
- [The Test Advantage: System of equations solutions explained](https://thetestadvantage.com/blog/sat-system-of-equations-solution-explained) — estimate of 2 to 4 systems questions per test; "exactly two solutions" is impossible.
- [Albert.io: Systems of linear equations study guide](https://www.albert.io/blog/system-of-linear-equations-made-simple-a-sat-math-study-guide/) — the same system as a table, as equations and as a graph; graphing is imprecise when the crossing is between grid lines.
- [A Beginner's Guide to Desmos on the SAT Math (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ) — 2.7 million views. AI summary with timestamps: systems as crossing lines (1:55), infinite versus no solutions (3:04), a parallel-lines constant found by matching slopes (12:10), and a closing list that puts no-solution linear systems among the jobs better done without Desmos.
- [The Last SAT Desmos Guide You'll Need (James Lu SAT, YouTube)](https://www.youtube.com/watch?v=e-O4nwVHQ-Y) — 1.1 million views. The creator's own summary shows a list regression for systems, `[2x1+3y1, x1-y1] ~ [12, 4]`, and counting intersections for the number of solutions (he labels it about 6% of SAT Math).
- [Tutorllini Test Prep: Desmos Lesson #2, Systems of Equations (YouTube)](https://www.youtube.com/watch?v=oL9_EOn5x7w) — 199,000 views, by an 800 scorer; only the description could be read.
- [Penguin SAT Prep: Easily Solve SAT Constants Questions (YouTube)](https://www.youtube.com/watch?v=LJooEH4d434) — 120,000 views (April 2025); only the description could be read.

### What the best teachers agree on

- Read the question's last line first; many questions want a combination (x + y, 2x − y) or a constant, not the full solution.
- Try adding or subtracting the equations before solving. When the coefficients are "crossed" (5x + 2y and 2x + 5y), one step gives the answer.
- Substitution when a variable is already alone; elimination otherwise. When you scale an equation, scale every term, including the constant. Use parentheses when subtracting or substituting.
- Number of solutions: compare slopes (or coefficient ratios) first; equal slopes alone do not decide between none and infinitely many, the constants do. Elimination ending in 0 = 7 means none; 0 = 0 means infinitely many.
- Constant k: find the multiplier from the known pair of coefficients, apply it to the unknown one, then check the constant.
- Word problems: define each variable with units; one equation per total (count, money, amount of pure substance); check that the answer makes sense (whole numbers, not more than the total).
- Desmos: type both equations as given and click the crossing point; for k, use a slider as a check.
- Check the final pair in both original equations.

### Disagreements and choices made

- **Desmos first or algebra first?** Achievable says graphing is usually fastest; Test Ninjas, Open Exam Prep and the LearnSATMath video say constants and no-solution questions go faster with ratios. Choice: Desmos for solving systems with messy numbers, ratio algebra for k questions, and Desmos only to confirm (typing the exact value into the slider, as The Test Advantage advises).
- **Ratio rule versus cross-multiplying.** The usual a/p = b/q rule breaks when a coefficient is 0. The lesson adds the version a × q = b × p, which always works.
- **Typing standard form.** PrepScholar converts to y = mx + b before graphing; Desmos graphs ax + by = c directly (tested), so the lesson says "type each equation exactly as written".
- **List regression for systems** (James Lu) was left out of the systems lesson: graphing gives the same answer with less typing and fewer chances for a typo. List regressions appear in the Desmos lesson as an advanced tool, with warnings.
- **Frequency.** Only prep-site estimates exist (2 to 4 per test); the lesson says so.
- **Paper-era advice** (no-calculator tricks, older "matching rule" videos from 2019) was dropped.
- **Original examples.** The official framework sample (one purchase at two stores) inspired the story-type table, but every example in the lesson uses new contexts and numbers, checked with a script, including the reason behind every wrong choice.

## Linear inequalities

### Best sources

- [College Board: Assessment Framework for the Digital SAT Suite, version 4](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — testing points: create and use inequalities in context; model constraints on two quantities; interpret a constant, variable, factor, term or solution; interpret a point in the xy-plane in terms of the solution set; connect tables, algebra and graphs. Its sample asks which point satisfies a "y less than a line" inequality.
- [Khan Academy: Linear inequality word problems (SAT, medium)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:linear-inequality-word-problems-medium/a/v2-sat-lesson-linear-inequality-word-problems) — the phrase-to-symbol list, "least", "greatest" and "a possible value", round up for a minimum needed and down for a maximum affordable, systems in context solved by fixing one variable. Student comments flag a rounding error in one of its own videos.
- [Khan Academy: Graphs of linear systems and inequalities (SAT, medium)](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra-medium/x0fcc98a58ba3bea7:graphs-of-linear-systems-and-inequalities-medium/a/v2-sat-lesson-graphs-of-linear-systems-and-inequalities) — dashed versus solid, above versus below, test points, flipping when solving for y, and the four regions made by two crossing lines.
- [Test Ninjas: SAT linear inequalities](https://www.test-ninjas.com/sat-linear-inequalities-in-one-or-two-variables) — "isolate, flip, test"; adding a negative or distributing a negative never flips; compound inequalities; substituting choices is often faster than graphing.
- [Varsity Tutors: Linear inequalities (SAT lesson)](https://www.varsitytutors.com/practice/subjects/sat-math/lessons/linear-inequalities) — the forgotten flip as the most common error; restate a phrase in words before choosing the symbol.
- [Achievable: Linear inequalities](https://app.achievable.me/study/sat/learn/algebra-linear-inequalities) — about one inequality question per math section; plugging in 0 to cut choices; Desmos is often quickest but optional.
- [Axiom Academy: Linear inequalities and systems](https://theaxiomacademy.org/learn/sat-linear-inequalities-systems) — the (0, 0) test point and the overlap of regions.
- [Axiom Academy: SAT-style linear inequality word problems](https://theaxiomacademy.org/learn/sat-style-linear-inequality-word-problems) — budget, minimum and range problems; whole-number requirements; sanity checks.
- [JustLockedIn: Linear inequality patterns](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-inequalities/) — five patterns (translate, range, verify, interpret, solve) and a rounding-up example with buses.
- [JustLockedIn: Translate](https://justlockedin-main.pages.dev/patterns/math/algebra/linear-inequalities/translate.html) — fixed fees become constants; "10 less than 35 times g" is 35g − 10; swapped coefficients as a trap.
- [Quiz-Tree: Linear inequalities in 1 or 2 variables](https://www.quiz-tree.com/sat-algebra/topic/linear-inequalities-in-1-or-2-variables) — hard sets count integer solutions and stack constraints.
- [A Beginner's Guide to Desmos on the SAT Math (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ) — AI summary: systems of inequalities as shaded overlaps (3:46), budget constraints (4:10) and a maximizing purchase problem (4:32).
- [Unique Prep: SAT Math 10, Systems of Linear Inequalities (YouTube)](https://www.youtube.com/watch?v=7nAG1wLsc40) — 18,000 views, 36 minutes. Chapters: line type and shading, the graphing method, key translations. Built for the paper SAT; its own description admits a rise-and-run mix-up at 14:10, a good reminder to check graphs.
- [Scalar Learning: Linear Inequality Word Problems, Khan Academy foundations (YouTube)](https://www.youtube.com/watch?v=DiO2sPNgRJQ) — a walk-through of four Khan Academy questions; chapter list only.
- [Tutorllini Test Prep: Desmos Lesson #5, Inequalities (YouTube)](https://www.youtube.com/watch?v=uHuhHKY_wO8) — 155,000 views; only the description could be read.

### What the best teachers agree on

- Solve an inequality exactly like an equation; flip only when multiplying or dividing both sides by a negative.
- Test a simple value (usually 0) in the original inequality to confirm the direction.
- Translate words with care: at least ≥, at most ≤, more than >, fewer than <; strict symbols leave out the boundary.
- Whole-number answers: round toward the allowed side, then check the number and its neighbor.
- Graphs: solid for ≤ and ≥, dashed for < and >; with y alone, > is above and < is below; a test point settles any doubt.
- Systems: the solution is the overlap; a point must satisfy every inequality; substituting the choices is reliable.

### Disagreements and choices made

- **Flip or avoid the flip?** Most sources teach only the flip rule. The lesson teaches the rule and also the safer habit of moving x to the side where its coefficient stays positive, then shows both routes in Example 1.
- **Desmos or substitution for "which point" questions?** Achievable leans on Desmos; Test Ninjas says substituting is faster. Tests in Desmos showed that a point on a dashed corner looks like it is inside the region, so the lesson uses substitution for points and Desmos for seeing the region and checking the direction.
- **How many questions?** Achievable says about one per math section; a search summary of Fiveable said 3 to 5 per test; an even split of the 13 to 15 Algebra questions gives about 3. The lesson says "2 or 3, counts vary".
- **Rounding.** Because even Khan Academy commenters found a rounding slip, the lesson makes "test your number and the next one" a required step.
- **"Or" inequalities for extreme values** (mentioned by Achievable) are rare; the lesson keeps only "between ..., inclusive" to save space.

## Desmos on the Digital SAT

### Best sources

- [College Board: SAT Suite calculator policy](https://satsuite.collegeboard.org/digital/what-to-bring-do/calculator-policy) — the embedded Desmos calculator (graphing and scientific, switch at any time), handheld rules (no CAS), Desmos as a fallback if a handheld fails, and the reminder that some questions are better solved without a calculator.
- [College Board: Calculator use in the Math section](https://satsuite.collegeboard.org/digital/whats-on-the-test/math/calculator-use) — practice options: test preview, Bluebook practice tests and the free Desmos websites.
- [College Board: Bluebook new and updated features](https://bluebook.collegeboard.org/test-admin/new-updated-features) — fall 2026: the calculator can be resized, the reference sheet is more compact, and charts can be zoomed and panned.
- [College Board and Desmos: Desmos calculators on College Board tests (PDF, updated for SY2026-2027)](https://www.desmos.com/assessment-pdfs/CollegeBoard_Desmos_Calculator_AP_SAT.pdf) — the only differences from desmos.com: images, folders and notes off; log mode checked automatically for exponential, logarithmic and power regressions.
- [College Board: Assessment Framework, version 4](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf) — "available for the entire Math section", the answer-entry rules (5 characters, 6 with a minus sign; round or cut long decimals at the fourth digit), and statistics testing points (standard deviation is compared, not computed).
- [Desmos: College Board version of the graphing calculator](https://www.desmos.com/testing/collegeboard/graphing) — the test-day configuration. Older links (testing/cb-sat-ap and testing/cb-digital-sat) now redirect here. Used to test every input.
- [Khan Academy: Calculators on the SAT](https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:about-the-digital-sat/x0fcc98a58ba3bea7:preparing-for-the-sat/a/calculators-on-the-sat) — think before you calculate; pick and practice your calculator early.
- [Acely: Desmos cheat sheet](https://acely.com/sat/desmos-cheat-sheet) — keyboard shortcuts, the table's regression button, stdev versus stdevp, lcm, gcd and mod, domain restrictions, and test-day habits (check angle mode, zoom out if nothing shows).
- [Test Ninjas: Desmos calculator guide](https://test-ninjas.com/sat-desmos-calculator-guide) — syntax for each task, a "use algebra instead" list (sum and product of roots, discriminant, percent change, circles, geometry facts, word problems), and the `2^x+1` versus `2^(x+1)` mistake.
- [SupertutorTV: When NOT to use Desmos](https://supertutortv.com/?p=29849) — blog version of the video: ugly fraction or radical choices, sliders that only give approximate values, faster circle methods, graphing every choice; mark the question and come back.
- [SupertutorTV: New Desmos feature](https://supertutortv.com/?p=30644) — the regression button on tables (January 2025): linear by default, quadratic with a third point.
- [The Test Advantage: When not to use Desmos on SAT Math](https://thetestadvantage.com/blog/when-not-to-use-desmos-on-sat-math) — six cases and a 10-second "one line on paper?" check.
- [The Test Advantage: How to use Desmos on the SAT (May 2026 guide)](https://thetestadvantage.com/blog/how-to-use-desmos-on-the-sat-complete-may-2026-guide) — the College Board link, no log-in or saving on testing calculators, features fixed once a year.
- [The Test Advantage: SAT regression with Desmos](https://thetestadvantage.com/blog/sat-regression-with-desmos-may-2026-data-tables-to-equations) — choosing the model from the wording, vertex-form regression, starting each problem on a blank graph.
- [OpenStax Algebra 1: Using Desmos](https://openstax.org/books/algebra-1/pages/using-desmos) — confirms that typing 1 after x or y makes a subscript automatically, the meaning of ~, and Shift plus the backtick key for the tilde.
- [Resolve Prep: Desmos regression guide](https://resolveprep.com/blog/desmos-regression-sat-guide) — the regression button with its menu, custom regressions, and solving for constants with a short list of x-values.
- [1600.io: Using regression to find both solutions of a quadratic](https://1600.io/courses/1698988/lectures/47466973) — a regression gives one value per unknown, so graphing is better when two answers exist.
- [MathChops: A five-minute DSAT Desmos intro](https://mathchops.substack.com/p/a-five-minute-dsat-desmos-intro) — Desmos as a backup method; a reader's mean-equals-median trick.
- [Effortless Math: Digital SAT Math, May 2026](https://www.effortlessmath.com/blog/digital-sat-math-may-2026-what-changed/) — reports of more "Desmos-slow" questions, based on students' accounts (no official data).
- [PrepMaven: Desmos on the Digital SAT (updated September 2026)](https://prepmaven.com/blog/test-prep/desmos-on-the-digital-sat/) — a full feature tour; its quadratic regression example drops the squared term, a reminder to test every input.
- [Academic Approach: Conquer SAT Math one Desmos function at a time](https://www.academicapproach.com/how-to-conquer-the-sat-math-section-one-desmos-function-at-a-time/) — "useless in the hands of an unskilled user": Desmos adds to algebra skill, it does not replace it.
- [Galvanize Test Prep: Desmos SAT calculator](https://galvanizetestprep.com/blogs/desmos-sat-calculator-how-to-use-it/) — practice the calculator under time pressure, drag it away from the question, and decide case by case.
- [Open Exam Prep: Mastering the built-in Desmos calculator](https://open-exam-prep.com/study-guides/sat-math/introduction/desmos-calculator-mastery) — sliders for constants, the wrench menu for degrees and window size, regression forms; its fraction tip turned out to be wrong when tested (see below).
- [A Beginner's Guide to Desmos on the SAT Math (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=-pGNBb8M3LQ) — 2.7 million views (June 2024). AI summary: equations, systems, inequalities, intercepts and vertex, mean and median, tables, plus closing lists of when to use and when to avoid Desmos.
- [The only SAT Math Desmos Guide you'll ever need (LearnSATMath, YouTube)](https://www.youtube.com/watch?v=jCT0jTVzKy0) — 1 million views (July 2026). Chapters and AI summary: regressions, systems, one-variable equations, inequalities, equivalent expressions, "in terms of" questions, lists, statistics, geometry (radians warning), and limits. The presenter estimates that on one Bluebook test about 43% of questions could be solved almost entirely in Desmos and about 75% could use it somehow.
- [The Last SAT Desmos Guide You'll Need (James Lu SAT, YouTube)](https://www.youtube.com/watch?v=e-O4nwVHQ-Y) — 1.1 million views (October 2025). Creator's summary: sliders (avoid 0 and 1 as test values), ~ regressions, `x1=[1...10]` lists for constants, list regressions for systems, table regressions, counting intersections, distance and midpoint for circles; chapter labels give his estimated share of SAT Math for each technique.
- [Full SAT Desmos Guide in 7 Minutes (The SAT Gamified, YouTube)](https://www.youtube.com/watch?v=k2UZX09zwSQ) — 400,000 views; chapter list from basics to trigonometry and "when to use Desmos".
- [DESMOS Super HACKS for the Digital SAT (Scalar Learning, YouTube)](https://www.youtube.com/watch?v=T-hgOvYTBPU) — 51,000 views; chapters follow the College Board skill list, including systems and inequalities.
- [Why The 2026 SAT Is "Desmos Proof" (Hone Prep, YouTube)](https://www.youtube.com/watch?v=w8i3FKDzGck) — 30,000 views (January 2026); chapter titles only, useful as evidence of the debate.
- [r/Sat: Official Desmos Thread](https://www.reddit.com/r/Sat/comments/1c8at7a/official_desmos_thread/) — read only through search extracts: a tutor's tip to replace = with ~ so Desmos solves for unknowns, with the warning that Desmos returns the least-error values when no exact answer exists; x cannot be a regression parameter; moderators warn that Desmos traps students who don't understand the math.
- [r/Sat: What are people doing to learn Desmos](https://www.reddit.com/r/Sat/comments/1jwhsot/what_are_people_doing_to_learn_desmos) — read only through search extracts: a student with 690 in math who used Desmos only for roots and systems; replies point to reference sheets and long video guides.

### What the best teachers agree on

- Practice on the exact test version before test day; Desmos skill is a habit, not a trick you learn once.
- Desmos is strongest for crossings and zeros, tops and bottoms of parabolas, regressions from tables, inequality regions, checking constants with sliders, statistics in one line, and checking answers.
- Most errors are typing errors: the tilde, subscripts, parentheses in exponents, fractions. Always compare the formatted line with the question.
- Switch to degrees for triangle trigonometry.
- Don't use Desmos for one-step arithmetic, for questions about the form of an expression, or before you have turned a story into an equation.
- Read the coordinate the question asks for, zoom out to find every crossing, and convert decimals carefully.

### Disagreements and choices made

- **How much Desmos?** Claims range from "solve most of the test with Desmos" (several viral videos and posts; one tutor's fact-check called a "90%" claim a big overstatement) to "Desmos is a backup" (MathChops, Academic Approach). LearnSATMath's own count (about 43% fully, 75% partly, on one test) sits in between. Choice: a 10-second decision routine; algebra first for constants and forms; Desmos when the answer is a picture or a number.
- **Typing syntax.** Most guides (and this project's README example) print `y_1 ~ mx_1 + b`. Tests in the College Board calculator showed that this fails when typed literally (see the method notes above). Choice: teach `y1 ~ mx1 + b` and explain the underscore. Other lessons in this project that tell students to "type `y_1~mx_1+b`" should be changed to `y1~mx1+b`.
- **Fractions.** Open Exam Prep's Desmos guide says a typed 1/2x is read as x/2; the test showed that typing 1/2x gives 1/(2x), because the bottom part keeps everything until the right arrow key. Choice: teach the → rule with tested examples.
- **Sliders.** Everyone agrees that dragging gives only approximate values (SupertutorTV, The Test Advantage, LearnSATMath). Choice: type each answer choice, or the value found by algebra, into the slider line.
- **List regressions for constants** (James Lu, Resolve Prep) are powerful, but a test showed that an impossible identity still returns a confident-looking "best fit" (a = 3.0588...), and 1600.io notes that a regression returns only one value per unknown. Choice: include it as "advanced", with the warning to plug the numbers back in.
- **Mean with a missing value.** LearnSATMath adds an unknown to the list. A test showed that `mean([84, 91, 77, 88, x]) = 86` draws a vertical line at x = 90, off the normal screen, and clicking it shows no coordinates (a plain equation such as 0.45x = 216 does show (480, 0) when you click where its line meets the x-axis). Choice: the totals method, `5*86 - total([84, 91, 77, 88])`, which prints 90 at once.
- **Is the 2026 SAT "Desmos-proof"?** Hone Prep's video title and Effortless Math's report say recent tests resist Desmos, based on student memories; College Board still allows Desmos on every question and made it resizable in fall 2026. Choice: mention the reports as unconfirmed and teach both algebra and Desmos.
- **How precise are point labels?** Guides disagree; screenshots showed five decimal places at normal zoom (0.66667) and six after zooming in (0.666667).
- **Standard deviation.** Some guides drill stdev(); the framework only asks students to compare spreads. Choice: list stdev (sample) and stdevp (population), tested as 2.138 and 2 for the same list, and say they are rarely needed.
