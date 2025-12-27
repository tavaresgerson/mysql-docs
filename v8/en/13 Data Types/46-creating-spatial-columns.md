### 13.4.6 Creating Spatial Columns

MySQL provides a standard way of creating spatial columns for geometry types, for example, with `CREATE TABLE` or  `ALTER TABLE`. Spatial columns are supported for `MyISAM`, `InnoDB`, `NDB`, and `ARCHIVE` tables. See also the notes about spatial indexes under Section 13.4.10, “Creating Spatial Indexes”.

Columns with a spatial data type can have an SRID attribute, to explicitly indicate the spatial reference system (SRS) for values stored in the column. For implications of an SRID-restricted column, see Section 13.4.1, “Spatial Data Types”.

* Use the  `CREATE TABLE` statement to create a table with a spatial column:

  ```
  CREATE TABLE geom (g GEOMETRY);
  ```
* Use the  `ALTER TABLE` statement to add or drop a spatial column to or from an existing table:

  ```
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```

