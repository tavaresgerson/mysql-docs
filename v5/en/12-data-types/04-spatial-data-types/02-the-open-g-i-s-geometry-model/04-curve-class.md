#### 11.4.2.4 Curve Class

A `Curve` is a one-dimensional geometry, usually represented by a sequence of points. Particular subclasses of `Curve` define the type of interpolation between points. `Curve` is a noninstantiable class.

**`Curve` Properties**

* A `Curve` has the coordinates of its points.

* A `Curve` is defined as a one-dimensional geometry.

* A `Curve` is simple if it does not pass through the same point twice, with the exception that a curve can still be simple if the start and end points are the same.

* A `Curve` is closed if its start point is equal to its endpoint.

* The boundary of a closed `Curve` is empty.

* The boundary of a nonclosed `Curve` consists of its two endpoints.

* A `Curve` that is simple and closed is a `LinearRing`.
