### 30.4.3 sys Schema Views

30.4.3.1 The host_summary and x$host_summary Views

30.4.3.2 The host_summary_by_file_io and x$host_summary_by_file_io Views

30.4.3.3 The host_summary_by_file_io_type and x$host_summary_by_file_io_type Views

30.4.3.4 The host_summary_by_stages and x$host_summary_by_stages Views

30.4.3.5 The host_summary_by_statement_latency and x$host_summary_by_statement_latency Views

30.4.3.6 The host_summary_by_statement_type and x$host_summary_by_statement_type Views

30.4.3.7 The innodb_buffer_stats_by_schema and x$innodb_buffer_stats_by_schema Views

30.4.3.8 The innodb_buffer_stats_by_table and x$innodb_buffer_stats_by_table Views

30.4.3.9 The innodb_lock_waits and x$innodb_lock_waits Views

30.4.3.10 The io_by_thread_by_latency and x$io_by_thread_by_latency Views

30.4.3.11 The io_global_by_file_by_bytes and x$io_global_by_file_by_bytes Views

30.4.3.12 The io_global_by_file_by_latency and x$io_global_by_file_by_latency Views

30.4.3.13 The io_global_by_wait_by_bytes and x$io_global_by_wait_by_bytes Views

30.4.3.14 The io_global_by_wait_by_latency and x$io_global_by_wait_by_latency Views

30.4.3.15 The latest_file_io and x$latest_file_io Views

30.4.3.16 The memory_by_host_by_current_bytes and x$memory_by_host_by_current_bytes Views

30.4.3.17 The memory_by_thread_by_current_bytes and x$memory_by_thread_by_current_bytes Views

30.4.3.18 The memory_by_user_by_current_bytes and x$memory_by_user_by_current_bytes Views

30.4.3.19 The memory_global_by_current_bytes and x$memory_global_by_current_bytes Views

30.4.3.20 The memory_global_total and x$memory_global_total Views

30.4.3.21 The metrics View

30.4.3.22 The processlist and x$processlist Views

30.4.3.23 The ps_check_lost_instrumentation View

30.4.3.24 The schema_auto_increment_columns View

30.4.3.25 The schema_index_statistics and x$schema_index_statistics Views

30.4.3.26 The schema_object_overview View

30.4.3.27 The schema_redundant_indexes and x$schema_flattened_keys Views

30.4.3.28 The schema_table_lock_waits and x$schema_table_lock_waits Views

30.4.3.29 The schema_table_statistics and x$schema_table_statistics Views

30.4.3.30 The schema_table_statistics_with_buffer and x$schema_table_statistics_with_buffer Views

30.4.3.31 The schema_tables_with_full_table_scans and x$schema_tables_with_full_table_scans Views

30.4.3.32 The schema_unused_indexes View

30.4.3.33 The session and x$session Views

30.4.3.34 The session_ssl_status View

30.4.3.35 The statement_analysis and x$statement_analysis Views

30.4.3.36 The statements_with_errors_or_warnings and x$statements_with_errors_or_warnings Views

30.4.3.37 The statements_with_full_table_scans and x$statements_with_full_table_scans Views

30.4.3.38 The statements_with_runtimes_in_95th_percentile and x$statements_with_runtimes_in_95th_percentile Views

30.4.3.39 The statements_with_sorting and x$statements_with_sorting Views

30.4.3.40 The statements_with_temp_tables and x$statements_with_temp_tables Views

30.4.3.41 The user_summary and x$user_summary Views

30.4.3.42 The user_summary_by_file_io and x$user_summary_by_file_io Views

30.4.3.43 The user_summary_by_file_io_type and x$user_summary_by_file_io_type Views

30.4.3.44 The user_summary_by_stages and x$user_summary_by_stages Views

30.4.3.45 The user_summary_by_statement_latency and x$user_summary_by_statement_latency Views

30.4.3.46 The user_summary_by_statement_type and x$user_summary_by_statement_type Views

30.4.3.47 The version View

30.4.3.48 The wait_classes_global_by_avg_latency and x$wait_classes_global_by_avg_latency Views

30.4.3.49 The wait_classes_global_by_latency and x$wait_classes_global_by_latency Views

30.4.3.50 The waits_by_host_by_latency and x$waits_by_host_by_latency Views

30.4.3.51 The waits_by_user_by_latency and x$waits_by_user_by_latency Views

30.4.3.52 The waits_global_by_latency and x$waits_global_by_latency Views

The following sections describe `sys` schema views.

The `sys` schema contains many views that summarize Performance Schema tables in various ways. Most of these views come in pairs, such that one member of the pair has the same name as the other member, plus a `x$` prefix. For example, the `host_summary_by_file_io` view summarizes file I/O grouped by host and displays latencies converted from picoseconds to more readable values (with units);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

The `x$host_summary_by_file_io` view summarizes the same data but displays unformatted picosecond latencies:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

The view without the `x$` prefix is intended to provide output that is more user friendly and easier to read. The view with the `x$` prefix that displays the same values in raw form is intended more for use with other tools that perform their own processing on the data.

Views without the `x$` prefix differ from the corresponding `x$` views in these ways:

* Byte counts are formatted with size units using `format_bytes()` Function").

* Time values are formatted with temporal units using `format_time()` Function").

* SQL statements are truncated to a maximum display width using `format_statement()` Function").

* Path name are shortened using `format_path()` Function").
