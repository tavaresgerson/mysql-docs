### 14.16.7 Geometry Property Functions

Each function that belongs to this group takes a geometry value as
its argument and returns some quantitative or qualitative property
of the geometry. Some functions restrict their argument type. Such
functions return `NULL` if the argument is of an
incorrect geometry type. For example, the
[`ST_Area()`](gis-polygon-property-functions.html#function_st-area) polygon function returns
`NULL` if the object type is neither
`Polygon` nor `MultiPolygon`.