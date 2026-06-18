#### 8.10.3.1 How the Query Cache Operates

Note

The query cache is deprecated as of MySQL 5.7.20, and is
removed in MySQL 8.0.

This section describes how the query cache works when it is
operational. [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration"),
describes how to control whether it is operational.

Incoming queries are compared to those in the query cache
before parsing, so the following two queries are regarded as
different by the query cache:

```sql
SELECT * FROM tbl_name
Select * from tbl_name
```

Queries must be *exactly* the same (byte
for byte) to be seen as identical. In addition, query strings
that are identical may be treated as different for other
reasons. Queries that use different databases, different
protocol versions, or different default character sets are
considered different queries and are cached separately.

The cache is not used for queries of the following types:

* Queries that are a subquery of an outer query
* Queries executed within the body of a stored function,
  trigger, or event

Before a query result is fetched from the query cache, MySQL
checks whether the user has
[`SELECT`](select.html "13.2.9 SELECT Statement") privilege for all
databases and tables involved. If this is not the case, the
cached result is not used.

If a query result is returned from query cache, the server
increments the [`Qcache_hits`](server-status-variables.html#statvar_Qcache_hits)
status variable, not `Com_select`. See
[Section 8.10.3.4, “Query Cache Status and Maintenance”](query-cache-status-and-maintenance.html "8.10.3.4 Query Cache Status and Maintenance").

If a table changes, all cached queries that use the table
become invalid and are removed from the cache. This includes
queries that use `MERGE` tables that map to
the changed table. A table can be changed by many types of
statements, such as [`INSERT`](insert.html "13.2.5 INSERT Statement"),
[`UPDATE`](update.html "13.2.11 UPDATE Statement"),
[`DELETE`](delete.html "13.2.2 DELETE Statement"),
[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"),
[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"),
[`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), or
[`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement").

The query cache also works within transactions when using
`InnoDB` tables.

The result from a [`SELECT`](select.html "13.2.9 SELECT Statement") query
on a view is cached.

The query cache works for `SELECT SQL_CALC_FOUND_ROWS
...` queries and stores a value that is returned by a
following `SELECT FOUND_ROWS()` query.
[`FOUND_ROWS()`](information-functions.html#function_found-rows) returns the
correct value even if the preceding query was fetched from the
cache because the number of found rows is also stored in the
cache. The `SELECT FOUND_ROWS()` query itself
cannot be cached.

Prepared statements that are issued using the binary protocol
using [`mysql_stmt_prepare()`](/doc/c-api/5.7/en/mysql-stmt-prepare.html) and
[`mysql_stmt_execute()`](/doc/c-api/5.7/en/mysql-stmt-execute.html) (see
[C API Prepared Statement Interface](/doc/c-api/5.7/en/c-api-prepared-statement-interface.html)), are
subject to limitations on caching. Comparison with statements
in the query cache is based on the text of the statement after
expansion of `?` parameter markers. The
statement is compared only with other cached statements that
were executed using the binary protocol. That is, for query
cache purposes, prepared statements issued using the binary
protocol are distinct from prepared statements issued using
the text protocol (see
[Section 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements")).

A query cannot be cached if it uses any of the following
functions:

* [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt)
* [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt)
* [`BENCHMARK()`](information-functions.html#function_benchmark)
* [`CONNECTION_ID()`](information-functions.html#function_connection-id)
* [`CONVERT_TZ()`](date-and-time-functions.html#function_convert-tz)
* [`CURDATE()`](date-and-time-functions.html#function_curdate)
* [`CURRENT_DATE()`](date-and-time-functions.html#function_current-date)
* [`CURRENT_TIME()`](date-and-time-functions.html#function_current-time)
* [`CURRENT_TIMESTAMP()`](date-and-time-functions.html#function_current-timestamp)
* [`CURRENT_USER()`](information-functions.html#function_current-user)
* [`CURTIME()`](date-and-time-functions.html#function_curtime)
* [`DATABASE()`](information-functions.html#function_database)
* [`ENCRYPT()`](encryption-functions.html#function_encrypt) with one
  parameter

* [`FOUND_ROWS()`](information-functions.html#function_found-rows)
* [`GET_LOCK()`](locking-functions.html#function_get-lock)
* [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock)
* [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock)
* [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id)
* [`LOAD_FILE()`](string-functions.html#function_load-file)
* [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
* [`NOW()`](date-and-time-functions.html#function_now)
* [`PASSWORD()`](encryption-functions.html#function_password)
* [`RAND()`](mathematical-functions.html#function_rand)
* [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes)
* [`RELEASE_ALL_LOCKS()`](locking-functions.html#function_release-all-locks)
* [`RELEASE_LOCK()`](locking-functions.html#function_release-lock)
* [`SLEEP()`](miscellaneous-functions.html#function_sleep)
* [`SYSDATE()`](date-and-time-functions.html#function_sysdate)
* [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) with no
  parameters

* [`USER()`](information-functions.html#function_user)
* [`UUID()`](miscellaneous-functions.html#function_uuid)
* [`UUID_SHORT()`](miscellaneous-functions.html#function_uuid-short)

A query also is not cached under these conditions:

* It refers to loadable functions or stored functions.
* It refers to user variables or local stored program
  variables.

* It refers to tables in the `mysql`,
  `INFORMATION_SCHEMA`, or
  `performance_schema` database.

* It refers to any partitioned tables.
* It is of any of the following forms:

  ```sql
  SELECT ... LOCK IN SHARE MODE
  SELECT ... FOR UPDATE
  SELECT ... INTO OUTFILE ...
  SELECT ... INTO DUMPFILE ...
  SELECT * FROM ... WHERE autoincrement_col IS NULL
  ```

  The last form is not cached because it is used as the ODBC
  workaround for obtaining the last insert ID value. See the
  Connector/ODBC section of
  [Chapter 27, *Connectors and APIs*](connectors-apis.html "Chapter 27 Connectors and APIs").

  Statements within transactions that use
  [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable) isolation
  level also cannot be cached because they use `LOCK
  IN SHARE MODE` locking.

* It uses `TEMPORARY` tables.
* It does not use any tables.
* It generates warnings.
* The user has a column-level privilege for any of the
  involved tables.