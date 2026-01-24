### 11.4.5 Creating Spatial Columns

MySQL provides a standard way of creating spatial columns for geometry types, for example, with `CREATE TABLE` or `ALTER TABLE`. Spatial columns are supported for `MyISAM`, `InnoDB`, `NDB`, and `ARCHIVE` tables. See also the notes about spatial indexes under Section 11.4.9, “Creating Spatial Indexes”.

* Use the `CREATE TABLE` statement to create a table with a spatial column:

  ```sql
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use the `ALTER TABLE` statement to add or drop a spatial column to or from an existing table:

  ```sql
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```
