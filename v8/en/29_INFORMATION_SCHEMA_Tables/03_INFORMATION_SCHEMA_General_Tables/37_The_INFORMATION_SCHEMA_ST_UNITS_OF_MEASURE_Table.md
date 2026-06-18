### 28.3.37 The INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE Table

The [`ST_UNITS_OF_MEASURE`](information-schema-st-units-of-measure-table.html "28.3.37 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table") table
(available as of MySQL 8.0.14) provides information about
acceptable units for the
[`ST_Distance()`](spatial-relation-functions-object-shapes.html#function_st-distance) function.

The [`ST_UNITS_OF_MEASURE`](information-schema-st-units-of-measure-table.html "28.3.37 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table") table has
these columns:

* `UNIT_NAME`

  The name of the unit.

* `UNIT_TYPE`

  The unit type (for example, `LINEAR`).

* `CONVERSION_FACTOR`

  A conversion factor used for internal calculations.

* `DESCRIPTION`

  A description of the unit.