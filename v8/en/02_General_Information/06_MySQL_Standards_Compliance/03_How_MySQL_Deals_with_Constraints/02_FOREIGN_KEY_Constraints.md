#### 1.6.3.2 FOREIGN KEY Constraints

Foreign keys let you cross-reference related data across
tables, and
[foreign key
constraints](glossary.html#glos_foreign_key_constraint "FOREIGN KEY constraint") help keep this spread-out data consistent.

MySQL supports `ON UPDATE` and `ON
DELETE` foreign key references in
[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") and
[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statements. The
available referential actions are `RESTRICT`,
`CASCADE`, `SET NULL`, and
`NO ACTION` (the default).

`SET DEFAULT` is also supported by the MySQL
Server but is currently rejected as invalid by
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine"). Since MySQL does not
support deferred constraint checking, `NO
ACTION` is treated as `RESTRICT`.
For the exact syntax supported by MySQL for foreign keys, see
[Section 15.1.20.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "15.1.20.5 FOREIGN KEY Constraints").

`MATCH FULL`, `MATCH
PARTIAL`, and `MATCH SIMPLE` are
allowed, but their use should be avoided, as they cause the
MySQL Server to ignore any `ON DELETE` or
`ON UPDATE` clause used in the same
statement. `MATCH` options do not have any
other effect in MySQL, which in effect enforces `MATCH
SIMPLE` semantics full-time.

MySQL requires that foreign key columns be indexed; if you
create a table with a foreign key constraint but no index on a
given column, an index is created.

You can obtain information about foreign keys from the
Information Schema
[`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "28.3.16 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table") table. An
example of a query against this table is shown here:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
     > FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
     > WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+---------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME    | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+---------------+-------------+-----------------+
| fk1          | myuser        | myuser_id   | f               |
| fk1          | product_order | customer_id | f2              |
| fk1          | product_order | product_id  | f1              |
+--------------+---------------+-------------+-----------------+
3 rows in set (0.01 sec)
```

Information about foreign keys on `InnoDB`
tables can also be found in the
[`INNODB_FOREIGN`](information-schema-innodb-foreign-table.html "28.4.12 The INFORMATION_SCHEMA INNODB_FOREIGN Table") and
[`INNODB_FOREIGN_COLS`](information-schema-innodb-foreign-cols-table.html "28.4.13 The INFORMATION_SCHEMA INNODB_FOREIGN_COLS Table") tables, in
the `INFORMATION_SCHEMA` database.

`InnoDB` and `NDB` tables
support foreign keys.