### 11.4.2 The OpenGIS Geometry Model

[11.4.2.1 The Geometry Class Hierarchy](gis-geometry-class-hierarchy.html)

[11.4.2.2 Geometry Class](gis-class-geometry.html)

[11.4.2.3 Point Class](gis-class-point.html)

[11.4.2.4 Curve Class](gis-class-curve.html)

[11.4.2.5 LineString Class](gis-class-linestring.html)

[11.4.2.6 Surface Class](gis-class-surface.html)

[11.4.2.7 Polygon Class](gis-class-polygon.html)

[11.4.2.8 GeometryCollection Class](gis-class-geometrycollection.html)

[11.4.2.9 MultiPoint Class](gis-class-multipoint.html)

[11.4.2.10 MultiCurve Class](gis-class-multicurve.html)

[11.4.2.11 MultiLineString Class](gis-class-multilinestring.html)

[11.4.2.12 MultiSurface Class](gis-class-multisurface.html)

[11.4.2.13 MultiPolygon Class](gis-class-multipolygon.html)

The set of geometry types proposed by OGC's
**SQL with Geometry Types**
environment is based on the **OpenGIS
Geometry Model**. In this model, each geometric object
has the following general properties:

* It is associated with a spatial reference system, which
  describes the coordinate space in which the object is
  defined.

* It belongs to some geometry class.