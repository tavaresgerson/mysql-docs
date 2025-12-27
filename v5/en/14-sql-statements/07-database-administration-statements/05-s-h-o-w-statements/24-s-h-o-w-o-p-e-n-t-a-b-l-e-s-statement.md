#### 13.7.5.24 SHOW OPEN TABLES Statement

```sql
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement") lists the non-`TEMPORARY` tables that are currently open in the table cache. See [Section 8.4.3.1, “How MySQL Opens and Closes Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables"). The `FROM` clause, if present, restricts the tables shown to those present in the *`db_name`* database. The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement") output has these columns:

* `Database`

  The database containing the table.

* `Table`

  The table name.

* `In_use`

  The number of table locks or lock requests there are for the table. For example, if one client acquires a lock for a table using `LOCK TABLE t1 WRITE`, `In_use` is 1. If another client issues `LOCK TABLE t1 WRITE` while the table remains locked, the client blocks waiting for the lock, but the lock request causes `In_use` to be 2. If the count is zero, the table is open but not currently being used. `In_use` is also increased by the [`HANDLER ... OPEN`](handler.html "13.2.4 HANDLER Statement") statement and decreased by [`HANDLER ... CLOSE`](handler.html "13.2.4 HANDLER Statement").

* `Name_locked`

  Whether the table name is locked. Name locking is used for operations such as dropping or renaming tables.

If you have no privileges for a table, it does not show up in the output from [`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement").
