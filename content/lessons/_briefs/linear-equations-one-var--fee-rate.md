# linear-equations-one-var--fee-rate

**Shows:** a total is built as a one-time fee plus rate times units, and when the fee covers the first N units only the units beyond N pay the rate.

**Storyboard:**
1. A bar for "Total" is built left to right: a fixed block "fee $8" appears once.
2. Equal blocks "$5" stack one per hour (hour 1, 2, 3...). A bracket under them reads "rate × hours = \(5h\)".
3. The two parts join: \(8 + 5h = 33\). Blocks fill until the bar reaches 33; a counter shows \(h = 5\).
4. Second row: a parking bar "$12 covers the first 2 hours": two hours are shaded grey and folded into one big block "$12". Only hours 3, 4, 5... get "$4" blocks. Formula \(12 + 4(h - 2)\).
5. A tiny check mark at \(h = 2\): the formula gives exactly 12.

**Labels & formulas:** "fee (once)", "rate (each hour)", \(8 + 5h = 33\), "first 2 hours", \(12 + 4(h - 2)\).

**Stress:** the fee block is neutral and appears once; the repeating blocks use the accent. In row 2 the grey "included" hours are visibly NOT priced again. Readable at phone width: at most 6 blocks per row.
