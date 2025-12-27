### 13.1.33 RENAME TABLE Statement

```sql
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

[`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") renames one or more tables. You must have [`ALTER`](privileges-provided.html#priv_alter) and [`DROP`](privileges-provided.html#priv_drop) privileges for the original table, and [`CREATE`](privileges-provided.html#priv_create) and [`INSERT`](privileges-provided.html#priv_insert) privileges for the new table.

For example, to rename a table named `old_table` to `new_table`, use this statement:

```sql
RENAME TABLE old_table TO new_table;
```

That statement is equivalent to the following [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement:

```sql
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, unlike [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), can rename multiple tables within a single statement:

```sql
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

Renaming operations are performed left to right. Thus, to swap two table names, do this (assuming that a table with the intermediary name `tmp_table` does not already exist):

```sql
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

Metadata locks on tables are acquired in name order, which in some cases can make a difference in operation outcome when multiple transactions execute concurrently. See [Section 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking").

To execute `RENAME TABLE`, there must be no active transactions or tables locked with `LOCK TABLES`. With the transaction table locking conditions satisfied, the rename operation is done atomically; no other session can access any of the tables while the rename is in progress.

If any errors occur during a `RENAME TABLE`, the statement fails and no changes are made.

You can use `RENAME TABLE` to move a table from one database to another:

```sql
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Using this method to move all tables from one database to a different one in effect renames the database (an operation for which MySQL has no single statement), except that the original database continues to exist, albeit with no tables.

Like `RENAME TABLE`, `ALTER TABLE ... RENAME` can also be used to move a table to a different database. Regardless of the statement used, if the rename operation would move the table to a database located on a different file system, the success of the outcome is platform specific and depends on the underlying operating system calls used to move table files.

If a table has triggers, attempts to rename the table into a different database fail with a Trigger in wrong schema ([`ER_TRG_IN_WRONG_SCHEMA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_trg_in_wrong_schema)) error.

To rename `TEMPORARY` tables, `RENAME TABLE` does not work. Use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") instead.

`RENAME TABLE` works for views, except that views cannot be renamed into a different database.

Any privileges granted specifically for a renamed table or view are not migrated to the new name. They must be changed manually.

`RENAME TABLE tbl_name TO new_tbl_name` changes internally generated foreign key constraint names and user-defined foreign key constraint names that begin with the string “*`tbl_name`*\_ibfk\_” to reflect the new table name. `InnoDB` interprets foreign key constraint names that begin with the string “*`tbl_name`*\_ibfk\_” as internally generated names.

Foreign key constraint names that point to the renamed table are automatically updated unless there is a conflict, in which case the statement fails with an error. A conflict occurs if the renamed constraint name already exists. In such cases, you must drop and re-create the foreign keys for them to function properly.
