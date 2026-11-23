---
title: Evaluating Statistical Claims
skill: statistical-claims
domain: problem-solving
section: math
also-skills: inference-sample
summary: Decide who a study's results fit and whether it shows a cause.
---

# Who the results fit
A random sample fits its own group, no bigger.

```visual
statistical-claims--sample
```

## Key ideas

A **random sample** is picked by chance from a **population**, so every member of the population had the same chance of being chosen. That is why its results can be applied (**generalized**) to the whole population.

The results reach exactly as far as the group the sample was drawn from, and no further:

- not to a bigger group (other grades, other schools, other cities)
- not to a different time (batteries made on one day describe that day)
- not to a different type (a sample of bass says nothing about all fish)

The **largest group** the results apply to is the group the sample was randomly picked from. It is not the small sample itself, and it is not anything bigger.

```example
A forester randomly selects 40 of the 300 oak trees in a park that are 20 years old and measures their heights. What is the largest group the results can describe?
1. Sampled: 40 oaks, picked at random :: This is the sample.
2. Picked from: the park's 300 oaks, all 20 years old :: This is the population.
3. These 300 trees, not other parks or ages :: Nothing larger.
```

```theory
The **population** is the whole group the sample was randomly picked from. The **sample** is the part that was actually measured. To **generalize** means to apply the results of the sample to the whole population. Choosing by chance makes the sample a small copy of the population, so this is allowed.

The key question on the SAT is "what is the largest group to which the results can be generalized?" Read the description of the sample and notice every detail: the place (one school, one habitat), the type (night-shift nurses, 9-year-old dogs, history professors) and the time (one day, one week). Each detail narrows the group. The answer must keep all of them.

Typical wrong choices go too big: they drop one detail (all nurses instead of night-shift nurses), swap in a larger place (the whole state instead of one hospital), or widen the time. One wrong choice is often too small: "the 40 nurses who were surveyed". A random sample speaks for its whole population, so the sample itself is too small.

Sample size does not widen the group. A random sample of 40 and a random sample of 4,000 from the same school describe the same school.

Time and conditions count as part of the group. If 120 light bulbs were randomly picked from those made on one Tuesday on one production line, the results describe that line's bulbs on that Tuesday, not every bulb the factory makes.

If the sample was not random, the results cannot be generalized at all. That comes in the next part.

Traps: choosing a larger group because it sounds more useful, choosing the sample itself because it is "who was surveyed", and ignoring a detail such as the shift or the hospital.
```

## Easy

```task
bank: m-1177
highlight:
- "A sample of 40 fourth-grade students was selected at random from a certain school" :: Random sample of fourth graders from one school.
- "largest population to which the results of the survey can be applied" :: Find the group the sample was picked from.
explain:
A random sample can be generalized to the population it was picked from. Read the details of the sample: 40 students, selected at random, fourth-grade students, from one certain school.

So the population is all fourth-grade students at that school. The results can be applied to that whole group.

Check the choices. The 40 surveyed students (choice A) are too small, since a random sample speaks for its population. All students at the school (choice C) includes other grades, which had no chance of being selected. Fourth graders in the county (choice D) includes other schools, which also had no chance.

The answer is (B), all fourth-grade students at the school.
```

## Medium

```task
bank: m-1363
highlight:
- "random sample of 35 students from all of the students at one of the middle schools" :: The sample came from one middle school only.
- "largest group to which the results of the study can be generalized" :: The group the sample came from, no larger.
explain:
The psychologist chose a random sample of 35 students from all of the students at one of the middle schools in a large city. The results can be generalized to the group the sample was randomly drawn from.

That group is all students at that one middle school. The school is the place detail. It is not all middle school students in the city, and it is not all students in the city, because students at other schools had no chance of being picked.

The 35 students in the sample (choice A) is too small, since a random sample describes its whole population.

The answer is (B), all students at the school.
```

## Hard

```task
A university has 18,000 students, and 5,400 of them are first-year students. A researcher randomly selects 400 of the first-year students and asks each one how many hours per week the student studies. To how many students can the results of the survey be generalized?
answer: 5400
- 400 :: That is the sample. A random sample speaks for its whole group.
- 18000 :: Only first-year students had a chance of being picked.
highlight:
- "5,400 of them are first-year students" :: The sample was drawn from these 5,400 students.
- "randomly selects 400 of the first-year students" :: Random, so the results fit the whole group it came from.
- "To how many students can the results of the survey be generalized" :: Count the group the sample came from.
explain:
The results of a random sample can be generalized to the group the sample was picked from.

The researcher did not pick from all 18,000 university students. The 400 students were chosen at random from the first-year students only. So the group is the 5,400 first-year students.

Compare the three numbers in the problem.

- 400 is the sample. It is too small, because a random sample speaks for its whole group.
- 5,400 is the population the sample was drawn from.
- 18,000 includes second-year, third-year and fourth-year students, who had no chance of being picked.

The results can be generalized to all 5,400 first-year students.

The answer is 5400.
```

# Biased samples
Volunteers and hand-picked groups speak only for themselves.

```visual
statistical-claims--bias
```

## Key ideas

If a sample is **not random**, you cannot generalize its results to the population. The results describe only the people who were actually asked.

Common non-random samples:

- **Volunteers**: people who choose to answer often feel strongly.
- **Convenience**: whoever is easy to reach, such as shoppers inside the store.
- **Wrong group**: only part of the population is asked, such as only gym members about a new bike lane for the whole town.
- **Hand-picked or by position**: the first 80 names on a list.

A bigger sample does not fix this. 5,000 volunteers are still volunteers.

A sample picked at random from group X can also not be generalized to a bigger group Y, because members of Y had no chance of being picked.

```example
A café owner asks the first 100 customers who walk in on a Saturday if they like the new menu. 92% say yes. Can the owner say that about all 4,000 people in the neighborhood?
1. Sampled: customers who chose to come in :: Not picked by chance.
2. They probably like the café more than others :: The sample leans one way.
3. No. The results describe only those 100 customers :: A biased sample cannot be generalized.
```

```theory
A sample is **biased** when some members of the population were more likely to be included than others, so the sample leans one way. Names you may see: **self-selection** or **volunteer bias** (people chose to respond), **convenience sampling** (people were easy to reach), and **undercoverage** (part of the population had no chance to be picked).

Why does it matter? People who answer a voluntary survey are often the ones with strong feelings. Customers inside a café like the café. Gym members like gyms. The sample's answers then differ from the answers of the whole population, and more people of the same kind do not change that.

Size and randomness are different. A large biased sample is not better than a small biased one. A random sample of 80 can be fair, and a voluntary sample of 5,000 is not. If a question asks why the results cannot be generalized, the answer is about how people were chosen, not how many.

Position is not chance either. The last 80 names on a list, or all names starting with A, are picked by where they are. Members at other positions had no chance, so the sample is not random.

Note that "cannot be generalized" does not mean the numbers are false. They are true for the people asked. They just do not tell you about everyone else.

How SAT answer choices look: "The sample was biased because it was not representative of all residents", "The sample is too small" (usually wrong when the real problem is bias), and "The results can be generalized to all..." (wrong without random selection).

Traps: thinking a big sample is enough, and thinking a random sample from a smaller group fits a bigger group.
```

## Easy

```task
bank: m-1343
highlight:
- "assess the opinions of all city residents" :: The goal is every resident, not just some.
- "surveyed a sample of 500 city residents who own dogs" :: Dog owners only. Residents without dogs had no chance.
- "Which of the following is true about the city council" :: Look for the flaw in who was surveyed.
explain:
The council wanted the opinions of all city residents about converting a field into a dog park. But it surveyed only residents who own dogs.

Dog owners are more likely than other residents to favor a dog park. Residents who do not own dogs had no chance of being surveyed. So the sample is not representative of all city residents. It is biased.

A biased sample cannot show what the majority of all residents think, so choice (A) is wrong. Choice (B), adding more dog owners, would not remove the bias. Choice (C), surveying only residents without dogs, would be biased in the other direction.

The answer is (D): the survey sample is biased because it is not representative of all city residents.
```

## Medium

```task
bank: m-16938
highlight:
- "A total of 127 gamers were selected at random from three countries" :: Random, but only from three countries.
- "prevent the results from being generalized to all gamers" :: Find the flaw in how the sample was picked.
explain:
Results of a study can be generalized only to the population the sample was randomly drawn from. Here the gamers were selected at random from three countries, not from all gamers in the world.

Gamers in other countries had no chance of being selected, so the results cannot be generalized to all gamers. That is what prevents the generalization.

Check the other choices. Measuring over a longer time (choice A) would not change who the sample represents. Having a different number of gamers in each country (choice B) does not stop the results from being generalized. A sample of 127 is not too small (choice C), because size does not change which group a random sample can speak for.

The answer is (D): the gamers were not selected at random from all gamers.
```

## Hard

```task
A researcher wants to estimate the mean time that all 3,200 students at a university spend commuting each day. She posts a survey link on the university's social media page, and 640 students complete the survey. The mean commute time for these 640 students is 24 minutes. Which of the following is the most appropriate statement about the researcher's conclusion?
- The mean commute time for all 3,200 students is exactly 24 minutes. :: A sample cannot show an exact value, and this is not random.
- The 640 students are 20% of all students, so the results can be generalized to all 3,200 students. :: Size does not fix bias. Students chose to answer.
* The students chose to respond, so the results may not represent all 3,200 students.
- The results can be generalized to all university students in the country. :: Even a random sample could not reach beyond this university.
highlight:
- "all 3,200 students at a university" :: The population is every student at the university.
- "posts a survey link on the university's social media page" :: Only followers who saw the post could answer.
- "640 students complete the survey" :: Students chose to respond: a voluntary sample.
explain:
The researcher wants the mean commute of all 3,200 students. She posted a link, and 640 students chose to respond. That is a voluntary sample, so it is not random.

Students who follow the page and have time to answer may differ from other students, for example in how far they live from campus. Not every student had the same chance of being included, so the results may not represent all 3,200 students.

Check the other choices. "Exactly 24 minutes" claims an exact value that no sample can show. "20% of all students" sounds like a large share, but a large voluntary sample is still biased. "All university students in the country" goes beyond the university, which a random sample would not reach either.

The answer is: the students chose to respond, so the results may not represent all 3,200 students.
```

# Association, not cause
Watching two things together shows they go together.

```visual
statistical-claims--association
```

## Key ideas

An **association** (also called a **relationship** or **correlation**) means two things tend to go together: when one is higher, the other tends to be higher (positive) or lower (negative). **Causation** means one thing actually makes the other change.

A survey or an **observational study** only watches. Nobody is assigned to a group. People just report what they do. It can show an association, but never a cause, however big or random the sample is.

- Safe words: "is associated with", "is related to", "tends to", "there is a relationship between".
- Words that need an experiment: "causes", "leads to", "increases", "makes", "because of".

A random sample only tells you *who* the association fits.

```example
A random sample of 1,500 adults in a city reports how much coffee they drink and how many hours they work. Those who drink more coffee work longer hours. Does coffee make them work longer?
1. Did the researchers assign the coffee? No :: The adults chose. A survey only watches.
2. A busy job could change both coffee and hours :: Another factor could explain it.
3. Not shown. There is an association for the city's adults :: Random sample: the city. No cause.
```

```theory
In an **observational study**, researchers record what people do or what happens to them, and they do not decide who is in which group. A **survey** is the most common kind. In an **experiment**, researchers assign the groups and apply a treatment. Only experiments with random assignment can support a cause (next part).

Why can an association not show a cause? There are three usual reasons. **Reverse direction**: maybe long work hours make people drink more coffee, not the other way. **A third factor**: stress, age or income can change both things (see the part on confounding variables). **Coincidence**: with many measurements, some pairs line up by chance.

The direction of an association is positive when the two values rise together (more rain, taller grass), and negative when one rises as the other falls (more time in traffic, less time at home). Both are associations. Neither is a cause.

A question may add "randomly selected" to the survey. The random sample does one job: it lets you apply the association to the population the sample was drawn from. It does not turn an association into a cause. You need two checks in every choice: first, is it a cause or an association? Second, which group does it describe?

An answer such as "nothing can be concluded" is too weak when a random sample shows a clear association. An answer such as "X causes Y" is too strong without assignment.

Traps: believing that a large or random sample can prove a cause, and picking the choice with the words "leads to" or "increases" because it sounds like the point of the study.
```

## Easy

```task
A researcher surveyed a random sample of 800 teenagers from a large city about the number of hours per day they spend on social media and the number of hours they sleep. The data show that teenagers who spend more hours on social media tend to sleep fewer hours. Which of the following is the most appropriate conclusion?
- Spending more time on social media causes teenagers in the city to sleep less. :: Nobody was assigned to use social media. No cause is shown.
* There is an association between time on social media and hours of sleep among the city's teenagers.
- Sleeping less causes teenagers in the city to spend more time on social media. :: Same problem, reversed. A survey cannot show a cause.
- There is no relationship, because the teenagers were not assigned to groups. :: Assignment is needed for a cause, not for an association.
highlight:
- "surveyed a random sample of 800 teenagers from a large city" :: Random sample: the results fit the city's teenagers.
- "tend to sleep fewer hours" :: The data show a relationship, nothing more.
- "most appropriate conclusion" :: Check cause or association, then check the group.
explain:
Ask two questions. First, was a group assigned to do something? No. The researcher surveyed teenagers and recorded what they already did. That is an observational study, so it can show an association but not a cause.

Second, who do the results describe? The 800 teenagers were a random sample from a large city, so the results fit the teenagers of that city.

Check the choices. Both "causes" choices claim a cause in one direction or the other. Neither can be shown by a survey. The "no relationship" choice contradicts the data, which show that more social media goes with less sleep.

The correct choice names an association and the right group.

The answer is: there is an association between time on social media and hours of sleep among the city's teenagers.
```

## Medium

```task
In a study, 450 adults were selected at random from all adults in a state. Each adult reported how many cups of tea he or she drinks per week and gave a rating from 1 to 10 for how calm he or she feels. The adults who drink more tea gave higher calm ratings, on average. Which of the following conclusions is best supported by the study?
- Drinking more tea causes adults in the state to feel calmer. :: Nobody was assigned to drink tea. No cause is shown.
* There is an association between drinking tea and feeling calm among the state's adults.
- There is an association between drinking tea and feeling calm among all adults in the country. :: The sample came from one state only.
- Drinking tea caused the 450 adults in the sample to feel calmer. :: Still no assignment. Even for the sample, no cause.
highlight:
- "selected at random from all adults in a state" :: The results fit the state's adults, no bigger.
- "reported how many cups of tea" :: The adults only reported what they do. No one assigned it.
- "best supported by the study" :: Choose the right claim and the right group.
explain:
Check the claim first. The adults reported how much tea they drink. The researchers did not assign anyone to drink tea. So the study is observational, and it can show an association but not a cause. This rules out both "causes" choices, even the one that limits the cause to the 450 adults in the sample.

Check the group second. The 450 adults were selected at random from all adults in one state. So the results fit that state's adults. They do not fit all adults in the country, because adults in other states had no chance of being selected.

The correct choice combines an association with the state's adults.

The answer is: there is an association between drinking tea and feeling calm among the state's adults.
```

## Hard

```task
A researcher found that, in a random sample of 2,000 US high school students, students who own more books tend to earn higher grades. A newspaper wrote, "Buying more books will raise your child's grades." Which of the following is the best reason that the newspaper's claim is not supported by the study?
- The study was not large enough, because 2,000 students are too few to show any relationship. :: The sample is large enough to show an association.
* Students were not assigned to own more or fewer books, so the study shows only an association.
- The study showed no relationship between the number of books owned and grades. :: The study did show a relationship.
- Because the sample was random, the results cannot be used for any conclusion. :: A random sample supports conclusions about the whole population.
highlight:
- "random sample of 2,000 US high school students" :: Random sample: the association fits US high school students.
- "tend to earn higher grades" :: This is a relationship in observed data.
- "Buying more books will raise your child's grades" :: A cause claim. Was owning books assigned by chance?
explain:
The newspaper claims that buying books will raise grades. That is a cause-and-effect claim: more books lead to higher grades.

To support a cause, the study must have randomly assigned students to own more or fewer books. It did not. Students simply owned the number of books they owned, and the researcher recorded it. So the study is observational. It supports an association between book ownership and grades, and nothing more. Families with more books may also differ in income, reading habits and time at home, which could affect grades.

The other reasons do not work. 2,000 students is large enough to show an association. The study did find a relationship. A random sample does not block conclusions. It allows conclusions about the population.

The answer is: students were not assigned to own more or fewer books, so the study shows only an association.
```

# Random assignment
Chance picks the groups, so a cause can be shown.

```visual
statistical-claims--design
```

## Key ideas

In an **experiment**, the researchers decide who gets what. The factor being tested is the **treatment**. The group that does not get it is the comparison (control) group.

**Random assignment** means chance (a coin flip, a computer) puts each participant into a group.

Because chance made the groups, they start out alike in age, habits, health and everything else, even things nobody measured. So if the groups end up different, the likely reason is the treatment.

That is why **random assignment allows a cause-and-effect conclusion**.

If people chose their own group, there is no such protection. You can only say "associated with".

```example
A coach randomly assigns 30 of her 60 sprinters to a new stretching routine and gives the other 30 none. The stretching group has fewer injuries, on average. Did the routine cause the difference?
1. Who made the groups? Chance :: Random assignment.
2. The groups started out alike :: Only the routine differs.
3. Yes: it likely caused fewer injuries for these sprinters :: A cause, for this team.
```

```theory
The word **treatment** means any factor that researchers deliberately vary: a drug, a teaching method, a training routine, a new schedule. A **control** or **comparison group** does not get the treatment (or gets a placebo, an inactive version). **Random assignment** puts participants into groups by chance, so each participant has the same chance of getting the treatment.

Why does chance help? If you let people choose, healthier or more motivated people may choose the treatment. Then a difference in results could come from the people, not from the treatment. Chance spreads these differences about equally over the groups. This is the idea behind "controlling for" other factors without even knowing what they are.

Do not mix up the two kinds of randomness. **Random sampling** is about how people were picked to be in the study, and it decides who the results fit. **Random assignment** is about how people in the study were put into groups, and it decides whether a cause can be claimed. A study can have one without the other.

A study with random assignment can support a cause even if the participants were volunteers. The cause then fits those participants. To extend the cause to a larger population, the participants also need to be a random sample of it (the last part).

An experiment only supports a cause if the groups were made by chance. The word "experiment" is not enough. If people picked their own group, treat it as observational.

Traps: giving a cause when people chose their own group, and refusing to give a cause just because the participants were volunteers.
```

## Easy

```task
A farmer randomly assigned 60 of the 120 tomato plants in her garden to receive a new fertilizer, and the other 60 plants received no fertilizer. At harvest, the plants that received the fertilizer produced more tomatoes, on average, than the plants that did not. Which of the following conclusions is best supported by the study?
* The fertilizer likely increased tomato production for the plants in the garden.
- The study shows only an association, because the farmer did not select the plants from all tomato plants. :: Random assignment allows a cause. Sampling decides who it fits.
- The fertilizer increases tomato production for all tomato plants. :: The plants came from one garden only.
- The plants that received the fertilizer were healthier before the study. :: Chance made the groups, so they started out alike.
highlight:
- "randomly assigned 60 of the 120 tomato plants" :: Chance made the groups, so they start out alike.
- "produced more tomatoes, on average" :: The groups differ in the result. The fertilizer is the only difference.
- "best supported by the study" :: Cause is allowed. Keep it to the garden's plants.
explain:
The farmer randomly assigned the plants to the fertilizer group or the no-fertilizer group. Chance made the groups, so they started out alike in soil, sunlight and health. The only difference between them was the fertilizer. When the fertilized plants produced more tomatoes, the likely reason is the fertilizer. A cause-and-effect conclusion is supported.

Now the group. The 120 plants are the plants in the garden. So the cause fits the garden's plants, not all tomato plants.

Check the other choices. "Only an association" is wrong, because random assignment allows a cause. The sampling only decides who the cause fits. "All tomato plants" goes beyond the garden. "Healthier before the study" is unlikely, because random assignment makes the groups similar to begin with.

The answer is: the fertilizer likely increased tomato production for the plants in the garden.
```

## Medium

```task
A teacher allowed each of the 90 students in her class to choose either a new reading app or a printed book for 8 weeks. At the end, the students who chose the app improved their reading scores more, on average, than the students who chose the printed book. Which of the following conclusions is best supported?
- The reading app caused the students' scores to improve more. :: Students chose their group. No cause is shown.
* There is an association between using the app and a larger improvement in scores among these students.
- The reading app would improve scores for all students in the school. :: No cause is shown, and no random sample was taken.
- Printed books lower reading scores. :: The data do not show a drop, and there is no cause.
highlight:
- "allowed each of the 90 students in her class to choose" :: Students chose their group. There was no assignment by chance.
- "improved their reading scores more" :: A difference in results between groups, not proof of a cause.
- "best supported" :: Without random assignment, say "association".
explain:
Who made the groups? The students did, because each one chose the app or the printed book. That is not random assignment. Students who choose the app may already be more motivated or stronger readers, and that could explain the larger improvement. So the study shows an association between using the app and a larger improvement, but it cannot show that the app caused it.

The group: it was the teacher's class of 90 students, and they were not a random sample of the school. So the association describes these students only.

Check the choices. "The app caused" claims a cause. "All students in the school" claims both a cause and a wider group. "Printed books lower scores" is not supported by the data at all.

The answer is: there is an association between using the app and a larger improvement in scores among these students.
```

## Hard

```task
A school administrator wants to find out whether a new teaching method causes higher test scores for the 400 students in her school's ninth grade. Which of the following study designs would best allow her to conclude that the method causes higher scores?
- Survey the students and compare the scores of those who say their teacher uses the new method with the scores of those who say theirs does not. :: This only watches. No assignment.
- Compare the scores of the classes whose teachers chose to use the new method with the scores of the classes whose teachers did not. :: Teachers chose. The groups may differ in other ways.
* Randomly assign each of the 400 students to a class that uses the new method or a class that uses the old method, and compare their scores.
- Let each student choose a class with the new method or the old method, and compare their scores. :: Students chose. The groups may differ in other ways.
highlight:
- "whether a new teaching method causes higher test scores" :: She wants a cause, so groups must be made by chance.
- "400 students in her school's ninth grade" :: The group the cause would fit.
- "best allow her to conclude that the method causes" :: Choose the design with random assignment.
explain:
The administrator wants a cause-and-effect conclusion. Only random assignment can support one, because chance makes the groups alike in everything except the teaching method.

Check each design.

- Surveying students and comparing those who report different methods only watches. Nobody was assigned.
- Comparing classes whose teachers chose the method: the teachers chose, and teachers who choose a new method may differ from other teachers in other ways.
- Letting each student choose a class: students who choose the new method may be more motivated, so the groups may differ.
- Randomly assigning each student to a new-method class or an old-method class: chance makes the groups, so a difference in scores is likely due to the method.

The answer is: randomly assign each of the 400 students to a class that uses the new method or a class that uses the old method, and compare their scores.
```

# Confounding variables
A hidden third factor can fake a cause.

```visual
statistical-claims--confounder
```

## Key ideas

A **confounding variable** is a third factor linked to both the group and the outcome. It can create, or hide, a difference that looks like a cause.

Runners who wear expensive shoes also tend to train more often and work with a coach. If they finish races faster, the reason could be the shoes, or the extra training and coaching. Training is a confounder.

- **In a survey or observational study**, the groups differ in many ways, so confounders are a danger. That is another reason a survey cannot show a cause.
- **In an experiment**, random assignment spreads confounders evenly over the groups, so they cannot explain a difference.

A confounder must be connected to *both*: the thing being studied and the result.

```example
A survey finds that students who sleep 8 hours or more earn higher grades. Name a possible confounding variable.
1. Students who sleep more may also study regularly :: A factor linked to sleep.
2. Regular studying also raises grades :: It is also linked to the grades.
3. Study habits are a confounder :: Sleep may not be the cause. Random assignment would balance it.
```

```theory
A **confounding variable** (also called a lurking variable) is a variable that is related both to the factor you are studying and to the outcome, and that is not controlled. Because it travels with the factor, you cannot tell whether the factor or the confounder caused the change in the outcome.

A classic example: ice cream sales and drownings both rise in the summer. Eating ice cream does not cause drowning. Hot weather leads to more ice cream and more swimming, so temperature is the confounder.

To check a possible confounder, ask two questions. Is it linked to the factor (do runners with expensive shoes also train more)? Is it linked to the outcome (does training make runners faster)? If both answers are yes, it is a confounder, and it weakens a cause claim.

Random assignment is the fix. When chance forms the groups, the groups are alike in age, income, habits and everything else, including factors nobody thought of. So a confounder cannot be more common in one group than in the other, and any difference in the results is likely due to the treatment.

Notice what random *sampling* does not do: it does not remove confounders. A random sample of 5,000 adults in a survey still has runners with expensive shoes who also train more.

SAT wording: "which of the following is a possible confounding variable?", "which best explains why the study cannot show that X causes Y?", and "why are confounding variables less of a concern in this study?" The last one has the answer "because participants were randomly assigned to groups".

Traps: naming a variable that is linked to only one side, and thinking random selection (rather than random assignment) controls confounders.
```

## Easy

```task
Researchers surveyed a random sample of adults in a city and found that adults who own pets report lower stress levels, on average, than adults who do not. Which of the following is a possible confounding variable for the relationship between owning a pet and stress level?
- The number of adults in the sample :: This is not related to owning pets or to stress level.
- The stress level reported by each adult :: That is the outcome itself, not a third factor.
* The adults' household incomes, because higher income may allow pet ownership and may also lower stress
- The ages of the pets owned :: That applies only to pet owners.
highlight:
- "adults who own pets report lower stress levels" :: The factor is owning a pet. The outcome is stress level.
- "possible confounding variable" :: Look for a third factor linked to both.
explain:
A confounding variable is a third factor that is related to both the factor being studied (owning a pet) and the outcome (stress level).

Household income fits. Adults with higher incomes may find it easier to afford a pet, so income is linked to owning pets. Higher income may also reduce stress, so income is linked to the stress level. Because income is connected to both, the lower stress of pet owners might come from income, not from the pets.

Check the other choices. The number of adults in the sample is not connected to either the pets or the stress. The reported stress level is the outcome, not a third variable. The ages of the pets exist only for pet owners, so they cannot explain the difference between owners and non-owners.

The answer is: the adults' household incomes.
```

## Medium

```task
In a study of 400 adults selected at random from a city, adults who take vitamin supplements reported fewer colds in the last year than adults who do not. A blogger concluded that vitamin supplements prevent colds. Which of the following is the best reason that the study cannot show this?
- The study included only 400 adults, which is too few to find any difference. :: 400 is enough to show an association.
* Adults who take vitamins may also exercise more and eat better, and those habits may reduce colds.
- The adults were selected at random from the city. :: Random selection is not the problem. Missing assignment is.
- Some adults had more than one cold during the year. :: This does not stop the study from finding an association.
highlight:
- "adults who take vitamin supplements reported fewer colds" :: The factor is vitamins. The outcome is colds.
- "vitamin supplements prevent colds" :: A cause claim. No one was assigned to take vitamins.
- "best reason that the study cannot show this" :: Look for a third factor linked to both.
explain:
The blogger claims that vitamins cause fewer colds. The researchers only recorded who already took vitamins. They did not assign vitamins by chance. So other differences between the two groups could explain the result.

The best reason names such a difference: adults who take vitamins may also exercise more and eat better, and those habits may reduce colds. Exercise and diet are linked to taking vitamins and to having fewer colds, so they are confounding variables.

The other reasons fail. 400 adults are enough to show an association. A random sample is not a flaw. It tells you the association fits the city's adults. Some adults having more than one cold does not prevent a comparison.

The answer is: adults who take vitamins may also exercise more and eat better, and those habits may reduce colds.
```

## Hard

```task
A researcher recruited 200 volunteers and used a computer to randomly assign 100 of them to follow a new sleep schedule for a month. The other 100 kept their usual schedule. At the end of the month, the volunteers on the new schedule reported better focus, on average. Why are confounding variables, such as age or daily habits, less of a concern in this study?
- The study had 200 volunteers, which is a large number. :: Size alone does not balance other factors.
* The volunteers were randomly assigned to the two groups, so the groups were likely similar in age and habits.
- The volunteers were a random sample of all adults. :: They were volunteers, and sampling does not control confounders.
- The study lasted for a month, which is a long time. :: Length does not make the groups alike.
highlight:
- "recruited 200 volunteers" :: Volunteers, not a random sample of a population.
- "used a computer to randomly assign 100 of them" :: Chance made the groups. This controls confounders.
- "less of a concern" :: Find what makes the groups alike.
explain:
A confounding variable can be a problem when the two groups differ in more than the factor being studied. Here the question asks why that is less likely.

The researcher used a computer to randomly assign the volunteers to the new sleep schedule or to the usual schedule. When chance forms the groups, the two groups are likely similar in age, daily habits and other characteristics, including ones nobody measured. So those factors are unlikely to explain a difference in focus.

Check the other choices. A larger number of volunteers does not by itself make the groups alike. The volunteers were not a random sample of all adults, and random sampling would not control confounders anyway. A longer study also does not balance the groups.

The answer is: the volunteers were randomly assigned to the two groups, so the groups were likely similar in age and habits.
```

# Sample or assignment?
Who it fits, and whether a cause is shown.

```visual
statistical-claims--grid
```

## Key ideas

Ask two separate questions about any study.

1. **Was the sample random?** If yes, the results fit the whole population it came from. If no, they fit only the people in the study.
2. **Was the assignment random?** If yes, a cause can be shown. If no, only an association.

| | Random assignment | No random assignment |
|---|---|---|
| **Random sample** | cause, for the population | association, for the population |
| **Not a random sample** | cause, only for the participants | association, only for the participants |

Do not let one question answer the other. Each question picks its own row or column of the table.

```example
Researchers randomly select 200 of a city's 5,000 bus drivers and randomly assign 100 of them to a new rest-break schedule. That group reports fewer near-accidents. What can be concluded?
1. Random sample of the 5,000 drivers :: The results fit all 5,000.
2. Random assignment to two groups :: A cause can be shown.
3. The schedule likely reduced near-accidents for the city's drivers :: Cause, for this group.
```

```theory
The two kinds of randomness answer different questions. **Random sampling** is how participants were picked from the population, and it controls who the results can be applied to. **Random assignment** is how participants were split into groups, and it controls whether the difference between groups can be traced to the treatment.

Four combinations are possible. (1) Random sample and random assignment: the strongest study. A cause can be claimed, and it applies to the whole population the sample came from. (2) Random sample, no assignment (a survey): an association that fits the population. (3) No random sample, but random assignment (volunteers split by chance): a cause, but only for those participants. (4) Neither: an association, only for the participants.

When you read an SAT question, underline two phrases. One tells you how the people were chosen ("selected at random from all...", "volunteers", "customers who entered the store"). The other tells you how the groups were formed ("randomly assigned", "chose their own", "no groups at all"). Then answer the cause question and the group question separately.

Be exact with the group. "Selected at random from the second-grade classes at one elementary school" means the group is second graders at that school, not all elementary students in the state.

A study can therefore support a cause and still not generalize. A study can generalize and still not support a cause. A claim that goes beyond either answer is too strong.

Traps: using "random" for both without checking which one the sentence is about, claiming the cause fits everyone when the participants were volunteers, and refusing a cause because the participants were volunteers.
```

## Easy

```task
A university asked for student volunteers for a study about sleep. Of the 120 students who volunteered, 60 were randomly assigned to go to bed at a set time each night for a month, and the other 60 kept their usual schedule. At the end of the month, the students with the set bedtime reported better focus, on average. Which of the following is the most appropriate conclusion?
- The set bedtime likely improved the focus of all students at the university. :: The students were volunteers, not a random sample.
* The set bedtime likely improved the focus of these volunteers.
- There is only an association between a set bedtime and better focus among the volunteers. :: Random assignment allows a cause.
- No conclusion can be drawn, because the students were volunteers. :: Volunteers with random assignment can show a cause for themselves.
highlight:
- "asked for student volunteers" :: Volunteers: the results fit only these students.
- "60 were randomly assigned" :: Random assignment: a cause can be shown.
- "most appropriate conclusion" :: Cause, for the volunteers only.
explain:
Ask the two questions separately.

First, was the assignment random? Yes: 60 of the 120 volunteers were randomly assigned to the set bedtime. So the two groups started out alike, and a cause can be shown. The better focus was likely caused by the set bedtime.

Second, was the sample random? No. The students volunteered, so they are not a random sample of the university's students. The cause fits only these 120 volunteers.

Check the choices. "All students at the university" goes beyond the volunteers. "Only an association" ignores the random assignment. "No conclusion can be drawn" is too weak, since random assignment still supports a cause for the volunteers.

The answer is: the set bedtime likely improved the focus of these volunteers.
```

## Medium

```task
bank: m-1552
highlight:
- "randomly selected 50 baobab trees that were 17 years old" :: Random sample of 17-year-old trees from this habitat.
- "randomly assigned them to two groups" :: Random assignment: a cause can be shown for these trees.
- "largest group to which these results can be applied" :: The group the sample was picked from, no larger.
explain:
Look at the two kinds of randomness separately.

The scientist randomly selected 50 baobab trees that were 17 years old from a baobab tree habitat in South Africa. So the results can be applied to the group the trees were drawn from: the 17-year-old baobab trees in this habitat.

Then the trees were randomly assigned to two watering patterns, so a cause can be shown for that group.

Check the choices. The 50 selected trees (choice A) are too small, since a random sample speaks for its population. Trees that are 19 years old (choice B) were not sampled. All 17-year-old baobab trees in South Africa (choice C) goes beyond the habitat, because trees in other habitats had no chance of being picked.

The answer is (D), all the baobab trees that were 17 years old in this habitat.
```

## Hard

```task
The owner of a gym with 8,000 members wants to show that a new group class causes members to visit more often, and that this holds for all 8,000 members. Which of the following study designs would best allow the owner to draw both conclusions?
* Randomly select 400 of the 8,000 members, then randomly assign half of them to take the class and half not to.
- Ask all 8,000 members whether they want the class, then compare the visits of those who said yes with those who said no. :: Members chose their groups. No cause is shown.
- Randomly select 400 of the members, then let each one choose whether to take the class. :: Random sample, but no assignment. Only an association.
- Take the first 400 members who sign up for the class, then randomly assign half of them to take it. :: Volunteers. A cause fits only them.
highlight:
- "causes members to visit more often" :: A cause needs random assignment.
- "holds for all 8,000 members" :: Generalizing needs a random sample of the 8,000.
- "both conclusions" :: The design must have both kinds of randomness.
explain:
The owner wants two things, and each needs its own kind of randomness.

To claim a cause, the members must be randomly assigned to take the class or not. To apply the result to all 8,000 members, the members in the study must be a random sample of the 8,000.

Check each design.

- Randomly select 400 members and then randomly assign half to take the class: both kinds of randomness. This allows a cause that fits all 8,000 members.
- Ask all members and compare yes with no: members chose, so there is no assignment. At most an association.
- Randomly select 400, then let them choose: a random sample, but no assignment. An association for all 8,000.
- First 400 who sign up, then randomly assign: random assignment, but a volunteer sample. A cause only for those volunteers.

The answer is: randomly select 400 of the 8,000 members, then randomly assign half of them to take the class and half not to.
```
