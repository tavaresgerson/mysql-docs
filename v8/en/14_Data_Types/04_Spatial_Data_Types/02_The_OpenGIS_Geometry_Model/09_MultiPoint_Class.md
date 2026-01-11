#### 13.4.2.9 MultiPoint Class

A `MultiPoint` is a geometry collection composed of `Point` elements. The points are not connected or ordered in any way.

**`MultiPoint` Examples**

* On a world map, a `MultiPoint` could represent a chain of small islands.

* On a city map, a `MultiPoint` could represent the outlets for a ticket office.

**`MultiPoint` Properties**

* A `MultiPoint` is a zero-dimensional geometry.

* A `MultiPoint` is simple if no two of its `Point` values are equal (have identical coordinate values).

* The boundary of a `MultiPoint` is the empty set.
