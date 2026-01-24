#### 11.4.2.6 Surface Class

A `Surface` is a two-dimensional geometry. It is a noninstantiable class. Its only instantiable subclass is `Polygon`.

Simple surfaces in three-dimensional space are isomorphic to planar surfaces.

Polyhedral surfaces are formed by “stitching” together simple surfaces along their boundaries, polyhedral surfaces in three-dimensional space may not be planar as a whole.

**`Surface` Properties**

* A `Surface` is defined as a two-dimensional geometry.

* The OpenGIS specification defines a simple `Surface` as a geometry that consists of a single “patch” that is associated with a single exterior boundary and zero or more interior boundaries.

* The boundary of a simple `Surface` is the set of closed curves corresponding to its exterior and interior boundaries.
