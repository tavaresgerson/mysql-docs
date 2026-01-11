### 28.3.37 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table

The `ST_UNITS_OF_MEASURE` table (available as of MySQL 8.0.14) provides information about acceptable units for the `ST_Distance()` function.

The `ST_UNITS_OF_MEASURE` table has these columns:

* `UNIT_NAME`

  The name of the unit.

* `UNIT_TYPE`

  The unit type (for example, `LINEAR`).

* `CONVERSION_FACTOR`

  A conversion factor used for internal calculations.

* `DESCRIPTION`

  A description of the unit.
