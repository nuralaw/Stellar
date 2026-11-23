# desmos--lists-restrictions

**Shows:** square brackets pair the sides of a system in one regression, a list of 100 values forces an identity to hold for every x, and curly braces keep only the part of an answer or graph where a condition holds.

**Storyboard:**
1. Frame "Lists": two stacked equations \(x + 2y = 10\) and \(3x - y = 2\) are pulled apart into two rows of boxes (left sides, right sides). Matching boxes are joined by thin lines. The code line `[x1+2y1, 3x1-y1] ~ [10, 2]` is assembled from them. A red cross over "two separate lines".
2. Frame "Identity": the expression \((x+2)(ax+3)\) and the target \(4x^2 + 11x + 6\) with a tilde between them. Below, a strip of dots labelled `x1 = [1...100]` fills in left to right. The result "a = 4" appears.
3. Frame "Restriction": a parabola drawn fully, then the part left of the y-axis fades while `{x>0}` is typed after the formula; only the right half stays solid. A second small panel shows two regression answers a = -2 and a = 3, with `{a>0}` crossing out the first.

**Labels & formulas:** `[x1+2y1, 3x1-y1] ~ [10, 2]`, `x1=[1...100]`, `{x>0}`, `{a>0}`, \(a = 4\), "lists pair in order", "100 values", "braces = condition".

**Stress:** the pairing lines in frame 1 (accent colour) and the fade of the excluded half in frame 3. Square brackets and curly braces drawn in two different colours across the whole animation so they never get confused. Keep code text at least 12 units.
