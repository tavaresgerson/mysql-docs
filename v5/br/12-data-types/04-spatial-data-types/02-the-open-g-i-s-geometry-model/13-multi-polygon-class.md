#### 11.4.2.13 MultiPolygon Class

A `MultiPolygon` is a `MultiSurface` object composed of `Polygon` elements.

**`MultiPolygon` Examples**

* On a region map, a `MultiPolygon` could represent a system of lakes.

**`MultiPolygon` Assertions**

* A `MultiPolygon` has no two `Polygon` elements with interiors that intersect.

* A `MultiPolygon` has no two `Polygon` elements that cross (crossing is also forbidden by the previous assertion), or that touch at an infinite number of points.

* A `MultiPolygon` may not have cut lines, spikes, or punctures. A `MultiPolygon` is a regular, closed point set.

* A `MultiPolygon` that has more than one `Polygon` has an interior that is not connected. The number of connected components of the interior of a `MultiPolygon` is equal to the number of `Polygon` values in the `MultiPolygon`.

**`MultiPolygon` Properties**

* A `MultiPolygon` is a two-dimensional geometry.

* A `MultiPolygon` boundary is a set of closed curves (`LineString` values) corresponding to the boundaries of its `Polygon` elements.

* Each `Curve` in the boundary of the `MultiPolygon` is in the boundary of exactly one `Polygon` element.

* Every `Curve` in the boundary of an `Polygon` element is in the boundary of the `MultiPolygon`.
