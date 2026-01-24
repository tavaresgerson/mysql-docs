#### 11.4.2.10 MultiCurve Class

A `MultiCurve` is a geometry collection composed of `Curve` elements. `MultiCurve` is a noninstantiable class.

**`MultiCurve` Properties**

* A `MultiCurve` is a one-dimensional geometry.

* A `MultiCurve` is simple if and only if all of its elements are simple; the only intersections between any two elements occur at points that are on the boundaries of both elements.

* A `MultiCurve` boundary is obtained by applying the “mod 2 union rule” (also known as the “odd-even rule”): A point is in the boundary of a `MultiCurve` if it is in the boundaries of an odd number of `Curve` elements.

* A `MultiCurve` is closed if all of its elements are closed.

* The boundary of a closed `MultiCurve` is always empty.
