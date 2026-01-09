#### 15.7.7.42 SHOW VARIABLES Statement

```
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

`SHOW VARIABLES` shows the values of MySQL system variables (see Section 7.1.8, “Server System Variables”). This statement does not require any privilege. It requires only the ability to connect to the server.

System variable information is also available from these sources:

* Performance Schema tables. See Section 29.12.14, “Performance Schema System Variable Tables”.

* The **mysqladmin variables** command. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

For `SHOW VARIABLES`, a `LIKE` clause, if present, indicates which variable names to match. A `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW VARIABLES` accepts an optional `GLOBAL` or `SESSION` variable scope modifier:

* With a `GLOBAL` modifier, the statement displays global system variable values. These are the values used to initialize the corresponding session variables for new connections to MySQL. If a variable has no global value, no value is displayed.

* With a `SESSION` modifier, the statement displays the system variable values that are in effect for the current connection. If a variable has no session value, the global value is displayed. `LOCAL` is a synonym for `SESSION`.

* If no modifier is present, the default is `SESSION`.

The scope for each system variable is listed at Section 7.1.8, “Server System Variables”.

`SHOW VARIABLES` is subject to a version-dependent display-width limit. For variables with very long values that are not completely displayed, use `SELECT` as a workaround. For example:

```
SELECT @@GLOBAL.innodb_data_file_path;
```

Most system variables can be set at server startup (read-only variables such as `version_comment` are exceptions). Many can be changed at runtime with the `SET` statement. See Section 7.1.9, “Using System Variables”, and Section 15.7.6.1, “SET Syntax for Variable Assignment”.

Partial output is shown here. The list of names and values may differ for your server. Section 7.1.8, “Server System Variables”, describes the meaning of each variable, and Section 7.1.1, “Configuring the Server”, provides information about tuning them.

```
mysql> SHOW VARIABLES;
+-------------------------------------------------------+-----------------------+
| Variable_name                                         | Value                 |
+-------------------------------------------------------+-----------------------+
| activate_all_roles_on_login                           | OFF                   |
| admin_address                                         |                       |
| admin_port                                            | 33062                 |
| admin_ssl_ca                                          |                       |
| admin_ssl_capath                                      |                       |
| admin_ssl_cert                                        |                       |
| admin_ssl_cipher                                      |                       |
| admin_ssl_crl                                         |                       |
| admin_ssl_crlpath                                     |                       |
| admin_ssl_key                                         |                       |
| admin_tls_ciphersuites                                |                       |
| admin_tls_version                                     | TLSv1.2,TLSv1.3       |
| authentication_policy                                 | *,,                   |
| auto_generate_certs                                   | ON                    |
| auto_increment_increment                              | 1                     |
| auto_increment_offset                                 | 1                     |
| autocommit                                            | ON                    |
| automatic_sp_privileges                               | ON                    |
| avoid_temporal_upgrade                                | OFF                   |
| back_log                                              | 151                   |
| basedir                                               | /local/mysql-8.4/     |
| big_tables                                            | OFF                   |
| bind_address                                          | 127.0.0.1             |
| binlog_cache_size                                     | 32768                 |
| binlog_checksum                                       | CRC32                 |
| binlog_direct_non_transactional_updates               | OFF                   |
| binlog_encryption                                     | OFF                   |
| binlog_error_action                                   | ABORT_SERVER          |
| binlog_expire_logs_auto_purge                         | ON                    |
| binlog_expire_logs_seconds                            | 2592000               |

...

| max_error_count                                       | 1024                  |
| max_execution_time                                    | 0                     |
| max_heap_table_size                                   | 16777216              |
| max_insert_delayed_threads                            | 20                    |
| max_join_size                                         | 18446744073709551615  |
| max_length_for_sort_data                              | 4096                  |
| max_points_in_geometry                                | 65536                 |
| max_prepared_stmt_count                               | 16382                 |
| max_relay_log_size                                    | 0                     |
| max_seeks_for_key                                     | 18446744073709551615  |
| max_sort_length                                       | 1024                  |
| max_sp_recursion_depth                                | 0                     |
| max_user_connections                                  | 0                     |
| max_write_lock_count                                  | 18446744073709551615  |

...

| time_zone                                             | SYSTEM                |
| timestamp                                             | 1682684938.710453     |
| tls_certificates_enforced_validation                  | OFF                   |
| tls_ciphersuites                                      |                       |
| tls_version                                           | TLSv1.2,TLSv1.3       |
| tmp_table_size                                        | 16777216              |
| tmpdir                                                | /tmp                  |
| transaction_alloc_block_size                          | 8192                  |
| transaction_allow_batching                            | OFF                   |
| transaction_isolation                                 | REPEATABLE-READ       |
| transaction_prealloc_size                             | 4096                  |
| transaction_read_only                                 | OFF                   |
| unique_checks                                         | ON                    |
| updatable_views_with_limit                            | YES                   |
| use_secondary_engine                                  | ON                    |
| version                                               | 9.5.0                 |
| version_comment                                       | Source distribution   |
| version_compile_machine                               | x86_64                |
| version_compile_os                                    | Linux                 |
| version_compile_zlib                                  | 1.2.13                |
| wait_timeout                                          | 28800                 |
| warning_count                                         | 0                     |
| windowing_use_high_precision                          | ON                    |
| xa_detach_on_prepare                                  | ON                    |
+-------------------------------------------------------+-----------------------+
```

With a `LIKE` clause, the statement displays only rows for those variables with names that match the pattern. To obtain the row for a specific variable, use a `LIKE` clause as shown:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

To get a list of variables whose name match a pattern, use the `%` wildcard character in a `LIKE` clause:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Wildcard characters can be used in any position within the pattern to be matched. Strictly speaking, because `_` is a wildcard that matches any single character, you should escape it as `_` to match it literally. In practice, this is rarely necessary.
