// Digital SAT content taxonomy (sections → domains → skills).

export type SectionId = "rw" | "math";

export interface Skill {
  id: string;
  name: string;
}

export interface Domain {
  id: string;
  section: SectionId;
  name: string;
  /** Approximate share of the section's questions. */
  weight: string;
  skills: Skill[];
}

export interface Section {
  id: SectionId;
  name: string;
  short: string;
  modules: number;
  questionsPerModule: number;
  minutesPerModule: number;
}

export const SECTIONS: Record<SectionId, Section> = {
  rw: {
    id: "rw",
    name: "Reading and Writing",
    short: "R&W",
    modules: 2,
    questionsPerModule: 27,
    minutesPerModule: 32,
  },
  math: {
    id: "math",
    name: "Math",
    short: "Math",
    modules: 2,
    questionsPerModule: 22,
    minutesPerModule: 35,
  },
};

export const DOMAINS: Domain[] = [
  {
    id: "information-ideas",
    section: "rw",
    name: "Information and Ideas",
    weight: "26%",
    skills: [
      { id: "central-ideas", name: "Central Ideas and Details" },
      { id: "command-of-evidence-textual", name: "Command of Evidence: Textual" },
      { id: "command-of-evidence-quantitative", name: "Command of Evidence: Quantitative" },
      { id: "inferences", name: "Inferences" },
    ],
  },
  {
    id: "craft-structure",
    section: "rw",
    name: "Craft and Structure",
    weight: "28%",
    skills: [
      { id: "words-in-context", name: "Words in Context" },
      { id: "text-structure-purpose", name: "Text Structure and Purpose" },
      { id: "cross-text-connections", name: "Cross-Text Connections" },
    ],
  },
  {
    id: "expression-ideas",
    section: "rw",
    name: "Expression of Ideas",
    weight: "20%",
    skills: [
      { id: "rhetorical-synthesis", name: "Rhetorical Synthesis" },
      { id: "transitions", name: "Transitions" },
    ],
  },
  {
    id: "conventions",
    section: "rw",
    name: "Standard English Conventions",
    weight: "26%",
    skills: [
      { id: "boundaries", name: "Boundaries" },
      { id: "form-structure-sense", name: "Form, Structure, and Sense" },
    ],
  },
  {
    id: "algebra",
    section: "math",
    name: "Algebra",
    weight: "35%",
    skills: [
      { id: "linear-equations-one-var", name: "Linear equations in one variable" },
      { id: "linear-functions", name: "Linear functions" },
      { id: "linear-equations-two-var", name: "Linear equations in two variables" },
      { id: "systems-linear", name: "Systems of two linear equations" },
      { id: "linear-inequalities", name: "Linear inequalities" },
    ],
  },
  {
    id: "advanced-math",
    section: "math",
    name: "Advanced Math",
    weight: "35%",
    skills: [
      { id: "nonlinear-functions", name: "Nonlinear functions" },
      { id: "nonlinear-equations", name: "Nonlinear equations and systems" },
      { id: "equivalent-expressions", name: "Equivalent expressions" },
    ],
  },
  {
    id: "problem-solving",
    section: "math",
    name: "Problem-Solving and Data Analysis",
    weight: "15%",
    skills: [
      { id: "ratios-rates", name: "Ratios, rates, proportions, and units" },
      { id: "percentages", name: "Percentages" },
      { id: "one-var-data", name: "One-variable data" },
      { id: "two-var-data", name: "Two-variable data and scatterplots" },
      { id: "probability", name: "Probability and conditional probability" },
      { id: "inference-sample", name: "Inference from samples and margin of error" },
      { id: "statistical-claims", name: "Evaluating statistical claims" },
    ],
  },
  {
    id: "geometry-trig",
    section: "math",
    name: "Geometry and Trigonometry",
    weight: "15%",
    skills: [
      { id: "area-volume", name: "Area and volume" },
      { id: "lines-angles-triangles", name: "Lines, angles, and triangles" },
      { id: "right-triangles-trig", name: "Right triangles and trigonometry" },
      { id: "circles", name: "Circles" },
    ],
  },
];

export function domainsFor(section: SectionId): Domain[] {
  return DOMAINS.filter((d) => d.section === section);
}

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === id);
}
