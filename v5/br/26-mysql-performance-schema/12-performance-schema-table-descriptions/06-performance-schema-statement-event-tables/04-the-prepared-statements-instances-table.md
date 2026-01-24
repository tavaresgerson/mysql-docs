#### 25.12.6.4 The prepared_statements_instances Table

The Performance Schema provides instrumentation for prepared statements, for which there are two protocols:

* The binary protocol. This is accessed through the MySQL C API and maps onto underlying server commands as shown in the following table.

  <table summary="How the binary protocol accessed through the MySQL C API maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>C API Function</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>mysql_stmt_prepare()</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>mysql_stmt_execute()</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>mysql_stmt_close()</code></td> <td><code>COM_STMT_CLOSE</code></td> </tr></tbody></table>

* The text protocol. This is accessed using SQL statements and maps onto underlying server commands as shown in the following table.

  <table summary="How the text protocol accessed using SQL statements maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>SQL Statement</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>PREPARE</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>EXECUTE</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr><tr> <td><code>DEALLOCATE PREPARE</code>, <code>DROP PREPARE</code></td> <td><code>SQLCOM_DEALLOCATE PREPARE</code></td> </tr></tbody></table>

Performance Schema prepared statement instrumentation covers both protocols. The following discussion refers to the server commands rather than the C API functions or SQL statements.

Information about prepared statements is available in the [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table. This table enables inspection of prepared statements used in the server and provides aggregated statistics about them. To control the size of this table, set the [`performance_schema_max_prepared_statements_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_prepared_statements_instances) system variable at server startup.

Collection of prepared statement information depends on the statement instruments shown in the following table. These instruments are enabled by default. To modify them, update the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table.

<table summary="Collection of prepared statement information depends on the statement instruments shown in this table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrument</th> <th>Server Command</th> </tr></thead><tbody><tr> <td><code>statement/com/Prepare</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>statement/com/Execute</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>statement/sql/prepare_sql</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>statement/sql/execute_sql</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr></tbody></table>

The Performance Schema manages the contents of the [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table as follows:

* Statement preparation

  A `COM_STMT_PREPARE` or `SQLCOM_PREPARE` command creates a prepared statement in the server. If the statement is successfully instrumented, a new row is added to the [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table. If the statement cannot be instrumented, [`Performance_schema_prepared_statements_lost`](performance-schema-status-variables.html#statvar_Performance_schema_prepared_statements_lost) status variable is incremented.

* Prepared statement execution

  Execution of a `COM_STMT_EXECUTE` or `SQLCOM_PREPARE` command for an instrumented prepared statement instance updates the corresponding [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table row.

* Prepared statement deallocation

  Execution of a `COM_STMT_CLOSE` or `SQLCOM_DEALLOCATE_PREPARE` command for an instrumented prepared statement instance removes the corresponding [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table row. To avoid resource leaks, removal occurs even if the prepared statement instruments described previously are disabled.

The [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table has these columns:

* `OBJECT_INSTANCE_BEGIN`

  The address in memory of the instrumented prepared statement.

* `STATEMENT_ID`

  The internal statement ID assigned by the server. The text and binary protocols both use statement IDs.

* `STATEMENT_NAME`

  For the binary protocol, this column is `NULL`. For the text protocol, this column is the external statement name assigned by the user. For example, for the following SQL statement, the name of the prepared statement is `stmt`:

  ```sql
  PREPARE stmt FROM 'SELECT 1';
  ```

* `SQL_TEXT`

  The prepared statement text, with `?` placeholder markers.

* `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

  These columns indicate the event that created the prepared statement.

* `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

  For a prepared statement created by a client session, these columns are `NULL`. For a prepared statement created by a stored program, these columns point to the stored program. A typical user error is forgetting to deallocate prepared statements. These columns can be used to find stored programs that leak prepared statements:

  ```sql
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

* `TIMER_PREPARE`

  The time spent executing the statement preparation itself.

* `COUNT_REPREPARE`

  The number of times the statement was reprepared internally (see [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs")). Timing statistics for repreparation are not available because it is counted as part of statement execution, not as a separate operation.

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Aggregated statistics for executions of the prepared statement.

* `SUM_xxx`

  The remaining `SUM_xxx` columns are the same as for the statement summary tables (see [Section 25.12.15.3, “Statement Summary Tables”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")).

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") resets the statistics columns of the [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table.
