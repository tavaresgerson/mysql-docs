#### 13.4.2.1 The Geometry Class Hierarchy

The geometry classes define a hierarchy as follows:

* `Geometry` (noninstantiable)

  + `Point` (instantiable)
  + `Curve` (noninstantiable)

    - `LineString` (instantiable)

      * `Line`
      * `LinearRing`
  + `Surface` (noninstantiable)

    - `Polygon` (instantiable)
  + `GeometryCollection` (instantiable)

    - `MultiPoint` (instantiable)
    - `MultiCurve` (noninstantiable)

      * `MultiLineString` (instantiable)
    - `MultiSurface` (noninstantiable)

      * `MultiPolygon` (instantiable)

It is not possible to create objects in noninstantiable classes. It is possible to create objects in instantiable classes. All classes have properties, and instantiable classes may also have assertions (rules that define valid class instances).

`Geometry` is the base class. It is an abstract class. The instantiable subclasses of `Geometry` are restricted to zero-, one-, and two-dimensional geometric objects that exist in two-dimensional coordinate space. All instantiable geometry classes are defined so that valid instances of a geometry class are topologically closed (that is, all defined geometries include their boundary).

The base `Geometry` class has subclasses for `Point`, `Curve`, `Surface`, and `GeometryCollection`:

* `Point` represents zero-dimensional objects.
* `Curve` represents one-dimensional objects, and has subclass `LineString`, with sub-subclasses `Line` and `LinearRing`.
* `Surface` is designed for two-dimensional objects and has subclass `Polygon`.
* `GeometryCollection` has specialized zero-, one-, and two-dimensional collection classes named `MultiPoint`, `MultiLineString`, and `MultiPolygon` for modeling geometries corresponding to collections of `Points`, `LineStrings`, and `Polygons`, respectively. `MultiCurve` and `MultiSurface` are introduced as abstract superclasses that generalize the collection interfaces to handle `Curves` and `Surfaces`.

`Geometry`, `Curve`, `Surface`, `MultiCurve`, and `MultiSurface` are defined as noninstantiable classes. They define a common set of methods for their subclasses and are included for extensibility.

`Point`, `LineString`, `Polygon`, `GeometryCollection`, `MultiPoint`, `MultiLineString`, and `MultiPolygon` are instantiable classes.
