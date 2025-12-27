#### 16.4.1.1 Replication and AUTO\_INCREMENT

Statement-based replication of `AUTO_INCREMENT`, [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values is done correctly, subject to the following exceptions:

* When using statement-based replication prior to MySQL 5.7.1, `AUTO_INCREMENT` columns in tables on the replica must match the same columns on the source; that is, `AUTO_INCREMENT` columns must be replicated to `AUTO_INCREMENT` columns.

* A statement invoking a trigger or function that causes an update to an `AUTO_INCREMENT` column is not replicated correctly using statement-based replication. These statements are marked as unsafe. (Bug #45677)

* An [`INSERT`](insert.html "13.2.5 INSERT Statement") into a table that has a composite primary key that includes an `AUTO_INCREMENT` column that is not the first column of this composite key is not safe for statement-based logging or replication. These statements are marked as unsafe. (Bug #11754117, Bug #45670)

  This issue does not affect tables using the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine, since an `InnoDB` table with an [AUTO\_INCREMENT](glossary.html#glos_auto_increment "auto-increment") column requires at least one key where the auto-increment column is the only or leftmost column.

* Adding an `AUTO_INCREMENT` column to a table with [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") might not produce the same ordering of the rows on the replica and the source. This occurs because the order in which the rows are numbered depends on the specific storage engine used for the table and the order in which the rows were inserted. If it is important to have the same order on the source and replica, the rows must be ordered before assigning an `AUTO_INCREMENT` number. Assuming that you want to add an `AUTO_INCREMENT` column to a table `t1` that has columns `col1` and `col2`, the following statements produce a new table `t2` identical to `t1` but with an `AUTO_INCREMENT` column:

  ```sql
  CREATE TABLE t2 LIKE t1;
  ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
  INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
  ```

  Important

  To guarantee the same ordering on both source and replica, the `ORDER BY` clause must name *all* columns of `t1`.

  The instructions just given are subject to the limitations of [`CREATE TABLE ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"): Foreign key definitions are ignored, as are the `DATA DIRECTORY` and `INDEX DIRECTORY` table options. If a table definition includes any of those characteristics, create `t2` using a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement that is identical to the one used to create `t1`, but with the addition of the `AUTO_INCREMENT` column.

  Regardless of the method used to create and populate the copy having the `AUTO_INCREMENT` column, the final step is to drop the original table and then rename the copy:

  ```sql
  DROP t1;
  ALTER TABLE t2 RENAME t1;
  ```

  See also [Section B.3.6.1, “Problems with ALTER TABLE”](alter-table-problems.html "B.3.6.1 Problems with ALTER TABLE").
