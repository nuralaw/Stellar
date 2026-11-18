@AGENTS.md

## Workflow for tasks and design work
1. Main session (Fable 5.2; fallback Opus 5.5 at xhigh effort) researches, analyses and writes a concrete plan. It does not write code itself.
2. It hands the plan to the `coder` agent (Sonnet 5.5, high effort), which writes the code.
3. Then the `reviewer` agent (Opus 5.5, high effort) checks the diff; the main session sends real issues back to `coder` and repeats until the review is clean.
4. Small things (a question, a one-line fix, reading a file) the main session does directly, without agents.
