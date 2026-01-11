#### 13.4.2.8 GeometryCollection Class

A `GeomCollection` is a geometry that is a collection of zero or more geometries of any class.

`GeomCollection` and `GeometryCollection` are synonymous, with `GeomCollection` the preferred type name.

All the elements in a geometry collection must be in the same spatial reference system (that is, in the same coordinate system). There are no other constraints on the elements of a geometry collection, although the subclasses of `GeomCollection` described in the following sections may restrict membership. Restrictions may be based on:

* Element type (for example, a `MultiPoint` may contain only `Point` elements)

* Dimension
* Constraints on the degree of spatial overlap between elements
