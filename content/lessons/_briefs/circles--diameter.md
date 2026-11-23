# circles--diameter

**Shows:** the center of a circle is the midpoint of any diameter, the radius is half of it, and a point is on, inside or outside the circle depending on how its squared distance to the center compares with \(r^2\).

**Storyboard:**
1. A coordinate grid with a diameter segment from \(P(-1, 3)\) to \(Q(7, 9)\). The two endpoints are dots in the accent colour.
2. Two small arrows show "average the x's" and "average the y's". The midpoint appears as a larger dot labelled \(C(3, 6)\), with \(\frac{-1 + 7}{2} = 3\) and \(\frac{3 + 9}{2} = 6\) next to it.
3. A right triangle is drawn under the diameter (legs 8 and 6). The diameter is labelled 10, then half of it, 5, is drawn from \(C\) as the radius. The circle draws itself around \(C\) and the equation \((x - 3)^2 + (y - 6)^2 = 25\) appears.
4. Three test points appear one at a time: \((3, 10)\) inside, \((6, 10)\) on the circle, \((9, 11)\) outside. For each, a dashed segment to \(C\) and the squared distance: \(16 < 25\) inside, \(25 = 25\) on, \(45 > 25\) outside. Inside is green, on is accent, outside is red.

**Labels & formulas:** \(\text{center} = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)\), \((x - 3)^2 + (y - 6)^2 = 25\), "\(<r^2\) inside", "\(=r^2\) on", "\(>r^2\) outside", "radius = half the diameter, not the whole diameter".

**Stress:** the midpoint dot appearing between the two endpoints, and the colour change for the three test points. The equation should not appear before the center and radius are found. Keep the grid coarse (1 unit = 16 px or more) and labels at least 12 px on a phone.
