### 12.16.7 Geometry Property Functions

[12.16.7.1 General Geometry Property Functions](gis-general-property-functions.html)

[12.16.7.2 Point Property Functions](gis-point-property-functions.html)

[12.16.7.3 LineString and MultiLineString Property Functions](gis-linestring-property-functions.html)

[12.16.7.4 Polygon and MultiPolygon Property Functions](gis-polygon-property-functions.html)

[12.16.7.5 GeometryCollection Property Functions](gis-geometrycollection-property-functions.html)

Each function that belongs to this group takes a geometry value as
its argument and returns some quantitative or qualitative property
of the geometry. Some functions restrict their argument type. Such
functions return `NULL` if the argument is of an
incorrect geometry type. For example, the
[`ST_Area()`](gis-polygon-property-functions.html#function_st-area) polygon function returns
`NULL` if the object type is neither
`Polygon` nor `MultiPolygon`.