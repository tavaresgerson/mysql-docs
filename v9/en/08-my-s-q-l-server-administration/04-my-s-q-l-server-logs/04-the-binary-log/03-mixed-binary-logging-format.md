#### 7.4.4.3 Mixed Binary Logging Format

When running in `MIXED` logging format, the server automatically switches from statement-based to row-based logging under the following conditions:

* When a function contains `UUID()`.

* When one or more tables with `AUTO_INCREMENT` columns are updated and a trigger or stored function is invoked. Like all other unsafe statements, this generates a warning if `binlog_format = STATEMENT`.

  For more information, see Section 19.5.1.1, “Replication and AUTO\_INCREMENT”.

* When the body of a view requires row-based replication, the statement creating the view also uses it. For example, this occurs when the statement creating a view uses the `UUID()` function.

* When a call to a loadable function is involved.
* When `FOUND_ROWS()` or `ROW_COUNT()` is used. (Bug
  #12092, Bug #30244)

* When `USER()`, `CURRENT_USER()`, or `CURRENT_USER` is used. (Bug
  #28086)

* When one of the tables involved is a log table in the `mysql` database.

* When the `LOAD_FILE()` function is used. (Bug #39701)

* When a statement refers to one or more system variables. (Bug #31168)

  **Exception.** The following system variables, when used with session scope (only), do not cause the logging format to switch:

  + `auto_increment_increment`
  + `auto_increment_offset`
  + `character_set_client`
  + `character_set_connection`
  + `character_set_database`
  + `character_set_server`
  + `collation_connection`
  + `collation_database`
  + `collation_server`
  + `foreign_key_checks`
  + `identity`
  + `last_insert_id`
  + `lc_time_names`
  + `pseudo_thread_id`
  + `sql_auto_is_null`
  + `time_zone`
  + `timestamp`
  + `unique_checks`

  For information about determining system variable scope, see Section 7.1.9, “Using System Variables”.

  For information about how replication treats `sql_mode`, see Section 19.5.1.40, “Replication and Variables”.

In releases prior to MySQL 8.0, when mixed binary logging format was in use, if a statement was logged by row and the session that executed the statement had any temporary tables, all subsequent statements were treated as unsafe and logged in row-based format until all temporary tables in use by that session were dropped. In MySQL 9.5, operations on temporary tables are not logged in mixed binary logging format, and the presence of temporary tables in the session has no impact on the logging mode used for each statement.

Note

A warning is generated if you try to execute a statement using statement-based logging that should be written using row-based logging. The warning is shown both in the client (in the output of `SHOW WARNINGS`) and through the **mysqld** error log. A warning is added to the `SHOW WARNINGS` table each time such a statement is executed. However, only the first statement that generated the warning for each client session is written to the error log to prevent flooding the log.

In addition to the decisions above, individual engines can also determine the logging format used when information in a table is updated. The logging capabilities of an individual engine can be defined as follows:

* If an engine supports row-based logging, the engine is said to be row-logging capable.

* If an engine supports statement-based logging, the engine is said to be statement-logging capable.

A given storage engine can support either or both logging formats. The following table lists the formats supported by each engine.

<table summary="Logging formats supported by each storage engine."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Storage Engine</th> <th>Row Logging Supported</th> <th>Statement Logging Supported</th> </tr></thead><tbody><tr> <th><code class="literal">ARCHIVE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">BLACKHOLE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">CSV</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">EXAMPLE</code></th> <td>Yes</td> <td>No</td> </tr><tr> <th><code class="literal">FEDERATED</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">HEAP</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">InnoDB</code></th> <td>Yes</td> <td>Yes when the transaction isolation level is <a class="link" href="innodb-transaction-isolation-levels.html#isolevel_repeatable-read"><code class="literal">REPEATABLE READ</code></a> or <a class="link" href="innodb-transaction-isolation-levels.html#isolevel_serializable"><code class="literal">SERIALIZABLE</code></a>; No otherwise.</td> </tr><tr> <th><code class="literal">MyISAM</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code class="literal">MERGE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><a class="link" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 9.5"><code class="literal">NDB</code></a></th> <td>Yes</td> <td>No</td> </tr></tbody></table>

Whether a statement is to be logged and the logging mode to be used is determined according to the type of statement (safe, unsafe, or binary injected), the binary logging format (`STATEMENT`, `ROW`, or `MIXED`), and the logging capabilities of the storage engine (statement capable, row capable, both, or neither). (Binary injection refers to logging a change that must be logged using `ROW` format.)

Statements may be logged with or without a warning; failed statements are not logged, but generate errors in the log. This is shown in the following decision table. **Type**, **binlog\_format**, **SLC**, and **RLC** columns outline the conditions, and **Error / Warning** and **Logged as** columns represent the corresponding actions. **SLC** stands for “statement-logging capable”, and **RLC** stands for “row-logging capable”.

<table summary="The information in this table is used to determine if a statement is to be logged and the logging mode to be used. The table outlines conditions (Safe/unsafe, binlog_format, SLC, RLR) and corresponding actions."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>Type</th> <th><a class="link" href="replication-options-binary-log.html#sysvar_binlog_format"><code class="literal">binlog_format</code></a></th> <th>SLC</th> <th>RLC</th> <th>Error / Warning</th> <th>Logged as</th> </tr></thead><tbody><tr> <th>*</th> <td><code class="literal">*</code></td> <td>No</td> <td>No</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging is impossible since at least one engine is involved that is both row-incapable and statement-incapable.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span>, since <code class="literal">BINLOG_FORMAT = STATEMENT</code></td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging of an unsafe statement is impossible when the storage engine is limited to statement-based logging, even if <code class="literal">BINLOG_FORMAT = MIXED</code>.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th>Safe</th> <td><code class="literal">STATEMENT</code></td> <td>No</td> <td>Yes</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">STATEMENT</code></td> <td>No</td> <td>Yes</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td>-</td> </tr><tr> <th>Unsafe</th> <td><code class="literal">MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code class="literal">STATEMENT</code></td> <td>No</td> <td>Yes</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging is not possible since <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Row Injection</th> <td><code class="literal">MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code class="literal">ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span> since <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code class="literal">STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging is not possible because <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code class="literal">MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code class="literal">ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code class="literal">ROW</code></td> </tr></tbody></table>

When a warning is produced by the determination, a standard MySQL warning is produced (and is available using `SHOW WARNINGS`). The information is also written to the **mysqld** error log. Only one error for each error instance per client connection is logged to prevent flooding the log. The log message includes the SQL statement that was attempted.

If a replica has `log_error_verbosity` set to display warnings, the replica prints messages to the error log to provide information about its status, such as the binary log and relay log coordinates where it starts its job, when it is switching to another relay log, when it reconnects after a disconnect, statements that are unsafe for statement-based logging, and so forth.
