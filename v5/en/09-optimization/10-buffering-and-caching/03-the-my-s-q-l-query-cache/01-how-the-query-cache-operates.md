#### 8.10.3.1 How the Query Cache Operates

Note

The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0.

This section describes how the query cache works when it is operational. Section 8.10.3.3, “Query Cache Configuration”, describes how to control whether it is operational.

Incoming queries are compared to those in the query cache before parsing, so the following two queries are regarded as different by the query cache:

```sql
SELECT * FROM tbl_name
Select * from tbl_name
```

Queries must be *exactly* the same (byte for byte) to be seen as identical. In addition, query strings that are identical may be treated as different for other reasons. Queries that use different databases, different protocol versions, or different default character sets are considered different queries and are cached separately.

The cache is not used for queries of the following types:

* Queries that are a subquery of an outer query
* Queries executed within the body of a stored function, trigger, or event

Before a query result is fetched from the query cache, MySQL checks whether the user has `SELECT` privilege for all databases and tables involved. If this is not the case, the cached result is not used.

If a query result is returned from query cache, the server increments the `Qcache_hits` status variable, not `Com_select`. See Section 8.10.3.4, “Query Cache Status and Maintenance”.

If a table changes, all cached queries that use the table become invalid and are removed from the cache. This includes queries that use `MERGE` tables that map to the changed table. A table can be changed by many types of statements, such as `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE`, `ALTER TABLE`, `DROP TABLE`, or `DROP DATABASE`.

The query cache also works within transactions when using `InnoDB` tables.

The result from a `SELECT` query on a view is cached.

The query cache works for `SELECT SQL_CALC_FOUND_ROWS ...` queries and stores a value that is returned by a following `SELECT FOUND_ROWS()` query. `FOUND_ROWS()` returns the correct value even if the preceding query was fetched from the cache because the number of found rows is also stored in the cache. The `SELECT FOUND_ROWS()` query itself cannot be cached.

Prepared statements that are issued using the binary protocol using `mysql_stmt_prepare()` and `mysql_stmt_execute()` (see C API Prepared Statement Interface), are subject to limitations on caching. Comparison with statements in the query cache is based on the text of the statement after expansion of `?` parameter markers. The statement is compared only with other cached statements that were executed using the binary protocol. That is, for query cache purposes, prepared statements issued using the binary protocol are distinct from prepared statements issued using the text protocol (see Section 13.5, “Prepared Statements”).

A query cannot be cached if it uses any of the following functions:

* `AES_DECRYPT()`
* `AES_ENCRYPT()`
* `BENCHMARK()`
* `CONNECTION_ID()`
* `CONVERT_TZ()`
* `CURDATE()`
* `CURRENT_DATE()`
* `CURRENT_TIME()`
* `CURRENT_TIMESTAMP()`
* `CURRENT_USER()`
* `CURTIME()`
* `DATABASE()`
* `ENCRYPT()` with one parameter

* `FOUND_ROWS()`
* `GET_LOCK()`
* `IS_FREE_LOCK()`
* `IS_USED_LOCK()`
* `LAST_INSERT_ID()`
* `LOAD_FILE()`
* `MASTER_POS_WAIT()`
* `NOW()`
* `PASSWORD()`
* `RAND()`
* `RANDOM_BYTES()`
* `RELEASE_ALL_LOCKS()`
* `RELEASE_LOCK()`
* `SLEEP()`
* `SYSDATE()`
* `UNIX_TIMESTAMP()` with no parameters

* `USER()`
* `UUID()`
* `UUID_SHORT()`

A query also is not cached under these conditions:

* It refers to loadable functions or stored functions.
* It refers to user variables or local stored program variables.

* It refers to tables in the `mysql`, `INFORMATION_SCHEMA`, or `performance_schema` database.

* It refers to any partitioned tables.
* It is of any of the following forms:

  ```sql
  SELECT ... LOCK IN SHARE MODE
  SELECT ... FOR UPDATE
  SELECT ... INTO OUTFILE ...
  SELECT ... INTO DUMPFILE ...
  SELECT * FROM ... WHERE autoincrement_col IS NULL
  ```

  The last form is not cached because it is used as the ODBC workaround for obtaining the last insert ID value. See the Connector/ODBC section of Chapter 27, *Connectors and APIs*.

  Statements within transactions that use `SERIALIZABLE` isolation level also cannot be cached because they use `LOCK IN SHARE MODE` locking.

* It uses `TEMPORARY` tables.
* It does not use any tables.
* It generates warnings.
* The user has a column-level privilege for any of the involved tables.
