### 11.4.5 Creating Spatial Columns

MySQL provides a standard way of creating spatial columns for
geometry types, for example, with [`CREATE
TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement").
Spatial columns are supported for
[`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"),
[`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"),
[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), and
[`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine") tables. See also the notes
about spatial indexes under
[Section 11.4.9, “Creating Spatial Indexes”](creating-spatial-indexes.html "11.4.9 Creating Spatial Indexes").

* Use the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")
  statement to create a table with a spatial column:

  ```sql
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement
  to add or drop a spatial column to or from an existing
  table:

  ```sql
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```