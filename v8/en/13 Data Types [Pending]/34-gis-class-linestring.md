--- title: MySQL 8.4 Reference Manual :: 13.4.2.5 LineString Class url: https://dev.mysql.com/doc/refman/8.4/en/gis-class-linestring.html order: 34 ---



#### 13.4.2.5 LineString Class

A `LineString` is a `Curve` with linear interpolation between points.

**`LineString` Examples**

* On a world map, `LineString` objects could represent rivers.
* In a city map, `LineString` objects could represent streets.

**`LineString` Properties**

* A `LineString` has coordinates of segments, defined by each consecutive pair of points.
* A `LineString` is a `Line` if it consists of exactly two points.
* A `LineString` is a `LinearRing` if it is both closed and simple.

