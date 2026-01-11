#### 13.4.2.12 MultiSurface Class

A `MultiSurface` is a geometry collection composed of surface elements. `MultiSurface` is a noninstantiable class. Its only instantiable subclass is `MultiPolygon`.

**`MultiSurface` Assertions**

* Surfaces within a `MultiSurface` have no interiors that intersect.

* Surfaces within a `MultiSurface` have boundaries that intersect at most at a finite number of points.
