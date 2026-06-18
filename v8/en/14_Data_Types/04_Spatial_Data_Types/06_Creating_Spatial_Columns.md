### 13.4.6 Creating Spatial Columns

MySQL provides a standard way of creating spatial columns for
geometry types, for example, with [`CREATE
TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement").
Spatial columns are supported for
[`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine"),
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine"),
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0"), and
[`ARCHIVE`](archive-storage-engine.html "18.5 The ARCHIVE Storage Engine") tables. See also the notes
about spatial indexes under
[Section 13.4.10, “Creating Spatial Indexes”](creating-spatial-indexes.html "13.4.10 Creating Spatial Indexes").

Columns with a spatial data type can have an SRID attribute, to
explicitly indicate the spatial reference system (SRS) for
values stored in the column. For implications of an
SRID-restricted column, see
[Section 13.4.1, “Spatial Data Types”](spatial-type-overview.html "13.4.1 Spatial Data Types").

* Use the [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
  statement to create a table with a spatial column:

  ```
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use the [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statement
  to add or drop a spatial column to or from an existing
  table:

  ```
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```