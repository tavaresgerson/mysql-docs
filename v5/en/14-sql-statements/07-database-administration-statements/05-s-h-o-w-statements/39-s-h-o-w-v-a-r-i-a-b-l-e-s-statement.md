#### 13.7.5.39 SHOW VARIABLES Statement

```sql
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

Note

The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the information available from and privileges required for the statement described here. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

[`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") shows the values of MySQL system variables (see [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")). This statement does not require any privilege. It requires only the ability to connect to the server.

System variable information is also available from these sources:

* Performance Schema tables. See [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables").

* The [`GLOBAL_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") and [`SESSION_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") tables. See [Section 24.3.11, “The INFORMATION\_SCHEMA GLOBAL\_VARIABLES and SESSION\_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables").

* The [**mysqladmin variables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command. See [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

For [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"), a [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which variable names to match. A `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") accepts an optional `GLOBAL` or `SESSION` variable scope modifier:

* With a `GLOBAL` modifier, the statement displays global system variable values. These are the values used to initialize the corresponding session variables for new connections to MySQL. If a variable has no global value, no value is displayed.

* With a `SESSION` modifier, the statement displays the system variable values that are in effect for the current connection. If a variable has no session value, the global value is displayed. `LOCAL` is a synonym for `SESSION`.

* If no modifier is present, the default is `SESSION`.

The scope for each system variable is listed at [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

[`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") is subject to a version-dependent display-width limit. For variables with very long values that are not completely displayed, use [`SELECT`](select.html "13.2.9 SELECT Statement") as a workaround. For example:

```sql
SELECT @@GLOBAL.innodb_data_file_path;
```

Most system variables can be set at server startup (read-only variables such as [`version_comment`](server-system-variables.html#sysvar_version_comment) are exceptions). Many can be changed at runtime with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. See [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables"), and [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

Partial output is shown here. The list of names and values may differ for your server. [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), describes the meaning of each variable, and [Section 5.1.1, “Configuring the Server”](server-configuration.html "5.1.1 Configuring the Server"), provides information about tuning them.

```sql
mysql> SHOW VARIABLES;
+-----------------------------------------+---------------------------+
| Variable_name                           | Value                     |
+-----------------------------------------+---------------------------+
| auto_increment_increment                | 1                         |
| auto_increment_offset                   | 1                         |
| autocommit                              | ON                        |
| automatic_sp_privileges                 | ON                        |
| back_log                                | 50                        |
| basedir                                 | /home/jon/bin/mysql-5.5   |
| big_tables                              | OFF                       |
| binlog_cache_size                       | 32768                     |
| binlog_direct_non_transactional_updates | OFF                       |
| binlog_format                           | STATEMENT                 |
| binlog_stmt_cache_size                  | 32768                     |
| bulk_insert_buffer_size                 | 8388608                   |
...
| max_allowed_packet                      | 4194304                   |
| max_binlog_cache_size                   | 18446744073709547520      |
| max_binlog_size                         | 1073741824                |
| max_binlog_stmt_cache_size              | 18446744073709547520      |
| max_connect_errors                      | 100                       |
| max_connections                         | 151                       |
| max_delayed_threads                     | 20                        |
| max_error_count                         | 64                        |
| max_heap_table_size                     | 16777216                  |
| max_insert_delayed_threads              | 20                        |
| max_join_size                           | 18446744073709551615      |
...

| thread_handling                         | one-thread-per-connection |
| thread_stack                            | 262144                    |
| time_format                             | %H:%i:%s                  |
| time_zone                               | SYSTEM                    |
| timestamp                               | 1316689732                |
| tmp_table_size                          | 16777216                  |
| tmpdir                                  | /tmp                      |
| transaction_alloc_block_size            | 8192                      |
| transaction_isolation                   | REPEATABLE-READ           |
| transaction_prealloc_size               | 4096                      |
| transaction_read_only                   | OFF                       |
| tx_isolation                            | REPEATABLE-READ           |
| tx_read_only                            | OFF                       |
| unique_checks                           | ON                        |
| updatable_views_with_limit              | YES                       |
| version                                 | 5.7.44                    |
| version_comment                         | Source distribution       |
| version_compile_machine                 | x86_64                    |
| version_compile_os                      | Linux                     |
| wait_timeout                            | 28800                     |
| warning_count                           | 0                         |
+-----------------------------------------+---------------------------+
```

With a [`LIKE`](string-comparison-functions.html#operator_like) clause, the statement displays only rows for those variables with names that match the pattern. To obtain the row for a specific variable, use a [`LIKE`](string-comparison-functions.html#operator_like) clause as shown:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

To get a list of variables whose name match a pattern, use the `%` wildcard character in a [`LIKE`](string-comparison-functions.html#operator_like) clause:

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Wildcard characters can be used in any position within the pattern to be matched. Strictly speaking, because `_` is a wildcard that matches any single character, you should escape it as `\_` to match it literally. In practice, this is rarely necessary.
