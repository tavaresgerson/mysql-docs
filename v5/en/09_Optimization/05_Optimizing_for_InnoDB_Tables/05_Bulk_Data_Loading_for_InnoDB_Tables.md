### 8.5.5 Bulk Data Loading for InnoDB Tables

These performance tips supplement the general guidelines for
fast inserts in [Section 8.2.4.1, “Optimizing INSERT Statements”](insert-optimization.html "8.2.4.1 Optimizing INSERT Statements").

* When importing data into `InnoDB`, turn off
  autocommit mode, because it performs a log flush to disk for
  every insert. To disable autocommit during your import
  operation, surround it with
  [`SET
  autocommit`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements:

  ```sql
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

  The [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") option
  [`--opt`](mysqldump.html#option_mysqldump_opt) creates dump files
  that are fast to import into an `InnoDB`
  table, even without wrapping them with the
  [`SET
  autocommit`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements.

* If you have `UNIQUE` constraints on
  secondary keys, you can speed up table imports by
  temporarily turning off the uniqueness checks during the
  import session:

  ```sql
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

  For big tables, this saves a lot of disk I/O because
  `InnoDB` can use its change buffer to write
  secondary index records in a batch. Be certain that the data
  contains no duplicate keys.

* If you have `FOREIGN KEY` constraints in
  your tables, you can speed up table imports by turning off
  the foreign key checks for the duration of the import
  session:

  ```sql
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

  For big tables, this can save a lot of disk I/O.

* Use the multiple-row [`INSERT`](insert.html "13.2.5 INSERT Statement")
  syntax to reduce communication overhead between the client
  and the server if you need to insert many rows:

  ```sql
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

  This tip is valid for inserts into any table, not just
  `InnoDB` tables.

* When doing bulk inserts into tables with auto-increment
  columns, set
  [`innodb_autoinc_lock_mode`](innodb-parameters.html#sysvar_innodb_autoinc_lock_mode) to
  2 instead of the default value 1. See
  [Section 14.6.1.6, “AUTO\_INCREMENT Handling in InnoDB”](innodb-auto-increment-handling.html "14.6.1.6 AUTO_INCREMENT Handling in InnoDB") for
  details.

* When performing bulk inserts, it is faster to insert rows in
  `PRIMARY KEY` order.
  `InnoDB` tables use a
  [clustered index](glossary.html#glos_clustered_index "clustered index"),
  which makes it relatively fast to use data in the order of
  the `PRIMARY KEY`. Performing bulk inserts
  in `PRIMARY KEY` order is particularly
  important for tables that do not fit entirely within the
  buffer pool.

* For optimal performance when loading data into an
  `InnoDB` `FULLTEXT` index,
  follow this set of steps:

  1. Define a column `FTS_DOC_ID` at table
     creation time, of type `BIGINT UNSIGNED NOT
     NULL`, with a unique index named
     `FTS_DOC_ID_INDEX`. For example:

     ```sql
     CREATE TABLE t1 (
     FTS_DOC_ID BIGINT unsigned NOT NULL AUTO_INCREMENT,
     title varchar(255) NOT NULL DEFAULT '',
     text mediumtext NOT NULL,
     PRIMARY KEY (`FTS_DOC_ID`)
     ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
     CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on t1(FTS_DOC_ID);
     ```

  2. Load the data into the table.
  3. Create the `FULLTEXT` index after the
     data is loaded.

  Note

  When adding `FTS_DOC_ID` column at table
  creation time, ensure that the
  `FTS_DOC_ID` column is updated when the
  `FULLTEXT` indexed column is updated, as
  the `FTS_DOC_ID` must increase
  monotonically with each
  [`INSERT`](insert.html "13.2.5 INSERT Statement") or
  [`UPDATE`](update.html "13.2.11 UPDATE Statement"). If you choose not
  to add the `FTS_DOC_ID` at table creation
  time and have `InnoDB` manage DOC IDs for
  you, `InnoDB` adds the
  `FTS_DOC_ID` as a hidden column with the
  next [`CREATE
  FULLTEXT INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") call. This approach, however,
  requires a table rebuild which can impact performance.