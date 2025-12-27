#### 1.7.2.3 FOREIGN KEY Constraint Differences

The MySQL implementation of foreign key constraints differs from the SQL standard in the following key respects:

* If there are several rows in the parent table with the same referenced key value, `InnoDB` performs a foreign key check as if the other parent rows with the same key value do not exist. For example, if you define a `RESTRICT` type constraint, and there is a child row with several parent rows, `InnoDB` does not permit the deletion of any of the parent rows. This is shown in the following example:

  ```
  mysql> CREATE TABLE parent (
      ->     id INT,
      ->     INDEX (id)
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.04 sec)

  mysql> CREATE TABLE child (
      ->     id INT,
      ->     parent_id INT,
      ->     INDEX par_ind (parent_id),
      ->     FOREIGN KEY (parent_id)
      ->         REFERENCES parent(id)
      ->         ON DELETE RESTRICT
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.02 sec)

  mysql> INSERT INTO parent (id)
      ->     VALUES ROW(1), ROW(2), ROW(3), ROW(1);
  Query OK, 4 rows affected (0.01 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> INSERT INTO child (id,parent_id)
      ->     VALUES ROW(1,1), ROW(2,2), ROW(3,3);
  Query OK, 3 rows affected (0.01 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> DELETE FROM parent WHERE id=1;
  ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key
  constraint fails (`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY
  (`parent_id`) REFERENCES `parent` (`id`) ON DELETE RESTRICT)
  ```

* If `ON UPDATE CASCADE` or `ON UPDATE SET NULL` recurses to update the *same table* it has previously updated during the same cascade, it acts like `RESTRICT`. This means that you cannot use self-referential `ON UPDATE CASCADE` or `ON UPDATE SET NULL` operations. This is to prevent infinite loops resulting from cascaded updates. A self-referential `ON DELETE SET NULL`, on the other hand, is possible, as is a self-referential `ON DELETE CASCADE`. Cascading operations may not be nested more than 15 levels deep.

* In an SQL statement that inserts, deletes, or updates many rows, foreign key constraints (like unique constraints) are checked row-by-row. When performing foreign key checks, `InnoDB` sets shared row-level locks on child or parent records that it must examine. MySQL checks foreign key constraints immediately; the check is not deferred to transaction commit. According to the SQL standard, the default behavior should be deferred checking. That is, constraints are only checked after the *entire SQL statement* has been processed. This means that it is not possible to delete a row that refers to itself using a foreign key.

* No storage engine, including `InnoDB`, recognizes or enforces the `MATCH` clause used in referential-integrity constraint definitions. Use of an explicit `MATCH` clause does not have the specified effect, and it causes `ON DELETE` and `ON UPDATE` clauses to be ignored. Specifying the `MATCH` should be avoided.

  The `MATCH` clause in the SQL standard controls how `NULL` values in a composite (multiple-column) foreign key are handled when comparing to a primary key in the referenced table. MySQL essentially implements the semantics defined by `MATCH SIMPLE`, which permits a foreign key to be all or partially `NULL`. In that case, a (child table) row containing such a foreign key can be inserted even though it does not match any row in the referenced (parent) table. (It is possible to implement other semantics using triggers.)

* A `FOREIGN KEY` constraint that references a non-`UNIQUE` key is not standard SQL but rather an `InnoDB` extension that is now deprecated, and must be enabled by setting `restrict_fk_on_non_standard_key`. You should expect support for use of nonstandard keys to be removed in a future version of MySQL, and migrate away from them now.

  The `NDB` storage engine requires an explicit unique key (or primary key) on any column referenced as a foreign key, as per the SQL standard.

* For storage engines that do not support foreign keys (such as `MyISAM`), MySQL Server parses and ignores foreign key specifications.

* Previous versions of MySQL parsed but ignored “inline `REFERENCES` specifications” (as defined in the SQL standard) where the references were defined as part of the column specification. MySQL 9.5 accepts such `REFERENCES` clauses and enforces the foreign keys thus created. In addition, MySQL 9.5 allows implicit references to the parent table's primary key. This means that the following syntax is valid:

  ```
  CREATE TABLE person (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name CHAR(60) NOT NULL,
      PRIMARY KEY (id)
  );

  CREATE TABLE shirt (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      style ENUM('tee', 'polo', 'dress') NOT NULL,
      color ENUM('red', 'blue', 'yellow', 'white', 'black') NOT NULL,
      owner SMALLINT UNSIGNED NOT NULL REFERENCES person,
      PRIMARY KEY (id)
  );
  ```

  You can see that this works by checking the output of `SHOW CREATE TABLE` or `DESCRIBE`, like this:

  ```
  mysql> SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
         Table: shirt
  Create Table: CREATE TABLE `shirt` (
    `id` smallint unsigned NOT NULL AUTO_INCREMENT,
    `style` enum('tee','polo','dress') NOT NULL,
    `color` enum('red','blue','yellow','white','black') NOT NULL,
    `owner` smallint unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `owner` (`owner`),
    CONSTRAINT `shirt_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `person` (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

For more information about foreign key constraints, see Section 15.1.24.5, “FOREIGN KEY Constraints”.
