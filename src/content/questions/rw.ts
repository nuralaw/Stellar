import type { Question } from "@/lib/types";

// Original Reading & Writing questions. People and studies named in passages are fictional unless noted.

export const RW_QUESTIONS: Question[] = [
  {
    id: "rw-cs-001",
    section: "rw",
    domain: "craft-structure",
    skill: "words-in-context",
    difficulty: "easy",
    type: "mcq",
    passage:
      "Marine biologist Ayana Brooks spent a decade tracking leatherback turtles across the Atlantic Ocean. Her findings about the turtles' migration routes were at first met with doubt, but as other researchers repeated her methods and reached the same results, her conclusions became widely ______.",
    prompt: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: { A: "disputed", B: "accepted", C: "hidden", D: "shortened" },
    answer: "B",
    explanation:
      "The text contrasts the early doubt (\"but\") with what happened after other researchers confirmed her results. Confirmation leads to acceptance, so \"accepted\" fits.\n\n\"Disputed\" repeats the early doubt instead of contrasting with it; \"hidden\" and \"shortened\" don't describe how people respond to conclusions.",
  },
  {
    id: "rw-cs-002",
    section: "rw",
    domain: "craft-structure",
    skill: "text-structure-purpose",
    difficulty: "medium",
    type: "mcq",
    passage:
      "Rooftop gardens are often praised as a way to supply fresh vegetables to people living in crowded cities. However, when a team of urban planners surveyed the rooftop gardens in one large city, they found that most produced only small harvests. The team concluded that the gardens' most important benefit is environmental: by absorbing sunlight, the plants keep the buildings beneath them noticeably cooler in summer.",
    prompt: "Which choice best describes the overall structure of the text?",
    choices: {
      A: "It presents a common view of rooftop gardens, then describes findings that point to a different main benefit.",
      B: "It explains how rooftop gardens are built, then describes why many of them fail.",
      C: "It compares two types of rooftop gardens, then recommends one over the other.",
      D: "It describes a problem in crowded cities, then argues that rooftop gardens cannot solve it.",
    },
    answer: "A",
    explanation:
      "The first sentence gives a common view (gardens supply food). \"However\" introduces survey findings that challenge it, and the last sentence names a different main benefit (cooling buildings). That matches A.\n\nThe text never explains construction (B), compares two types (C), or says the gardens can't help (D).",
  },
  {
    id: "rw-ii-001",
    section: "rw",
    domain: "information-ideas",
    skill: "central-ideas",
    difficulty: "medium",
    type: "mcq",
    passage:
      "Before a performance, the oboe in many orchestras plays a single note—an A—so that the other musicians can tune their instruments to it. The oboe is chosen partly because its bright, penetrating sound is easy to hear over the other instruments. Its pitch is also relatively stable: unlike string instruments, whose strings can stretch or loosen as the temperature changes, the oboe holds its tuning well.",
    prompt: "Which choice best states the main idea of the text?",
    choices: {
      A: "Qualities of its sound and pitch make the oboe a good instrument for giving an orchestra's tuning note.",
      B: "String instruments are more difficult to play than the oboe because their strings stretch.",
      C: "Many orchestras have recently replaced the oboe's tuning note with electronic tuners.",
      D: "The oboe is the loudest instrument in most orchestras.",
    },
    answer: "A",
    explanation:
      "Every sentence explains why the oboe gives the tuning note: its sound is easy to hear and its pitch is stable. A captures that.\n\nB mentions strings only as a comparison, C is never stated, and D overstates \"easy to hear\" as \"the loudest\".",
  },
  {
    id: "rw-ii-002",
    section: "rw",
    domain: "information-ideas",
    skill: "inferences",
    difficulty: "hard",
    type: "mcq",
    passage:
      "Ecologists studying a mountain lake noticed that a species of small fish had disappeared from the lake's shallow areas but remained common in deeper water. Over the same period, the number of wading birds that hunt in shallow water near the lake had grown sharply. The fish had not changed their diet, and the water temperature in the shallows had stayed the same. These observations suggest that ______",
    prompt: "Which choice most logically completes the text?",
    choices: {
      A: "the fish moved to deeper water mainly because the shallow water had become too warm for them.",
      B: "the increase in wading birds may have led the fish to avoid the shallow areas of the lake.",
      C: "the wading birds depend on this species of fish as their only source of food.",
      D: "the deeper water contains more of the food that this species of fish prefers.",
    },
    answer: "B",
    explanation:
      "The text rules out two explanations (diet and temperature didn't change) and points to one thing that did change: more birds hunting in shallow water. So the birds likely drove the fish away — B.\n\nA contradicts the stable temperature. C is far stronger than anything stated. D is unsupported; the text says the diet didn't change and says nothing about food in deep water.",
  },
  {
    id: "rw-sec-001",
    section: "rw",
    domain: "conventions",
    skill: "boundaries",
    difficulty: "medium",
    type: "mcq",
    passage:
      "The town's first public libraries were small, often just a single room in a church or ______ the end of the century, the town had built a three-story library with space for more than 20,000 books.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: { A: "school, by", B: "school; by", C: "school by", D: "school by," },
    answer: "B",
    explanation:
      "Both parts are complete sentences (independent clauses): \"The town's first public libraries were small…school\" and \"By the end of the century, the town had built…\". Two independent clauses can be joined with a semicolon — B.\n\nA is a comma splice; C and D run the clauses together without proper punctuation.",
  },
  {
    id: "rw-sec-002",
    section: "rw",
    domain: "conventions",
    skill: "form-structure-sense",
    difficulty: "easy",
    type: "mcq",
    passage:
      "The collection of handwritten letters, which includes notes from several well-known scientists, ______ on display at the city museum until June.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: { A: "are", B: "were", C: "is", D: "have been" },
    answer: "C",
    explanation:
      "The subject is \"collection\" (singular), not \"letters\" or \"scientists\", which sit inside phrases between the subject and the verb. A singular subject needs a singular verb, and \"until June\" points to the present: \"is\".\n\nA, B, and D are all plural verbs.",
  },
  {
    id: "rw-eoi-001",
    section: "rw",
    domain: "expression-ideas",
    skill: "transitions",
    difficulty: "medium",
    type: "mcq",
    passage:
      "Honeybees share the location of food with one another through a movement known as the waggle dance. The angle of the dance tells other bees which direction to fly relative to the sun. ______ the length of the dance tells them how far away the food is.",
    prompt: "Which choice completes the text with the most logical transition?",
    choices: { A: "However,", B: "In addition,", C: "For example,", D: "As a result," },
    answer: "B",
    explanation:
      "The last sentence adds a second piece of information the dance communicates (distance) to the first (direction). \"In addition\" signals adding a related point.\n\n\"However\" signals contrast, \"For example\" an illustration of the previous point, and \"As a result\" a consequence — none fit.",
  },
  {
    id: "rw-eoi-002",
    section: "rw",
    domain: "expression-ideas",
    skill: "rhetorical-synthesis",
    difficulty: "hard",
    type: "mcq",
    passage:
      "While researching a topic, a student has taken the following notes:\n\n• The Great Green Wall is a project to restore land across Africa's Sahel region.\n• It was launched in 2007 by the African Union.\n• Its goal is to restore 100 million hectares of degraded land by 2030.\n• Participating countries plant trees and support farming practices that protect soil.",
    prompt:
      "The student wants to emphasize the scale of the project's goal. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: {
      A: "The Great Green Wall, launched in 2007, is a project in Africa's Sahel region.",
      B: "The Great Green Wall aims to restore an enormous area—100 million hectares of degraded land—by 2030.",
      C: "Countries taking part in the Great Green Wall plant trees and support farming practices that protect soil.",
      D: "The African Union launched the Great Green Wall to restore land across the Sahel.",
    },
    answer: "B",
    explanation:
      "The goal is about scale, so the answer must include the size of the target. Only B states the 100-million-hectare goal and stresses how large it is.\n\nA and D give background, and C describes methods — none of them show the scale of the goal.",
  },
];
