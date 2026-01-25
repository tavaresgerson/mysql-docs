### 26.4.3 Views do Schema sys

26.4.3.1 As Views host_summary e x$host_summary

26.4.3.2 As Views host_summary_by_file_io e x$host_summary_by_file_io

26.4.3.3 As Views host_summary_by_file_io_type e x$host_summary_by_file_io_type

26.4.3.4 As Views host_summary_by_stages e x$host_summary_by_stages

26.4.3.5 As Views host_summary_by_statement_latency e x$host_summary_by_statement_latency

26.4.3.6 As Views host_summary_by_statement_type e x$host_summary_by_statement_type

26.4.3.7 As Views innodb_buffer_stats_by_schema e x$innodb_buffer_stats_by_schema

26.4.3.8 As Views innodb_buffer_stats_by_table e x$innodb_buffer_stats_by_table

26.4.3.9 As Views innodb_lock_waits e x$innodb_lock_waits

26.4.3.10 As Views io_by_thread_by_latency e x$io_by_thread_by_latency

26.4.3.11 As Views io_global_by_file_by_bytes e x$io_global_by_file_by_bytes

26.4.3.12 As Views io_global_by_file_by_latency e x$io_global_by_file_by_latency

26.4.3.13 As Views io_global_by_wait_by_bytes e x$io_global_by_wait_by_bytes

26.4.3.14 As Views io_global_by_wait_by_latency e x$io_global_by_wait_by_latency

26.4.3.15 As Views latest_file_io e x$latest_file_io

26.4.3.16 As Views memory_by_host_by_current_bytes e x$memory_by_host_by_current_bytes

26.4.3.17 As Views memory_by_thread_by_current_bytes e x$memory_by_thread_by_current_bytes

26.4.3.18 As Views memory_by_user_by_current_bytes e x$memory_by_user_by_current_bytes

26.4.3.19 As Views memory_global_by_current_bytes e x$memory_global_by_current_bytes

26.4.3.20 As Views memory_global_total e x$memory_global_total

26.4.3.21 A View metrics

26.4.3.22 As Views processlist e x$processlist

26.4.3.23 A View ps_check_lost_instrumentation

26.4.3.24 A View schema_auto_increment_columns

26.4.3.25 As Views schema_index_statistics e x$schema_index_statistics

26.4.3.26 A View schema_object_overview

26.4.3.27 As Views schema_redundant_indexes e x$schema_flattened_keys

26.4.3.28 As Views schema_table_lock_waits e x$schema_table_lock_waits

26.4.3.29 As Views schema_table_statistics e x$schema_table_statistics

26.4.3.30 As Views schema_table_statistics_with_buffer e x$schema_table_statistics_with_buffer

26.4.3.31 As Views schema_tables_with_full_table_scans e x$schema_tables_with_full_table_scans

26.4.3.32 A View schema_unused_indexes

26.4.3.33 As Views session e x$session

26.4.3.34 A View session_ssl_status

26.4.3.35 As Views statement_analysis e x$statement_analysis

26.4.3.36 As Views statements_with_errors_or_warnings e x$statements_with_errors_or_warnings

26.4.3.37 As Views statements_with_full_table_scans e x$statements_with_full_table_scans

26.4.3.38 As Views statements_with_runtimes_in_95th_percentile e x$statements_with_runtimes_in_95th_percentile

26.4.3.39 As Views statements_with_sorting e x$statements_with_sorting

26.4.3.40 As Views statements_with_temp_tables e x$statements_with_temp_tables

26.4.3.41 As Views user_summary e x$user_summary

26.4.3.42 As Views user_summary_by_file_io e x$user_summary_by_file_io

26.4.3.43 As Views user_summary_by_file_io_type e x$user_summary_by_file_io_type

26.4.3.44 As Views user_summary_by_stages e x$user_summary_by_stages

26.4.3.45 As Views user_summary_by_statement_latency e x$user_summary_by_statement_latency

26.4.3.46 As Views user_summary_by_statement_type e x$user_summary_by_statement_type

26.4.3.47 A View version

26.4.3.48 As Views wait_classes_global_by_avg_latency e x$wait_classes_global_by_avg_latency

26.4.3.49 As Views wait_classes_global_by_latency e x$wait_classes_global_by_latency

26.4.3.50 As Views waits_by_host_by_latency e x$waits_by_host_by_latency

26.4.3.51 As Views waits_by_user_by_latency e x$waits_by_user_by_latency

26.4.3.52 As Views waits_global_by_latency e x$waits_global_by_latency

As seções a seguir descrevem as Views do Schema `sys`.

O Schema `sys` contém muitas Views que resumem tabelas do Performance Schema de várias maneiras. A maioria dessas Views é apresentada em pares, de modo que um membro do par tem o mesmo nome do outro membro, mais um prefixo `x$`. Por exemplo, a View `host_summary_by_file_io` resume o I/O de arquivo agrupado por host e exibe as Latencies convertidas de picosegundos para valores mais legíveis (com unidades);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A View `x$host_summary_by_file_io` resume os mesmos dados, mas exibe Latencies em picosegundos não formatados:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A View sem o prefixo `x$` é destinada a fornecer uma saída mais amigável e fácil de ler. A View com o prefixo `x$`, que exibe os mesmos valores em formato bruto (raw), é mais destinada para uso com outras ferramentas que realizam seu próprio processamento dos dados.

As Views sem o prefixo `x$` diferem das Views `x$` correspondentes destas formas:

* As contagens de Byte são formatadas com unidades de tamanho usando a `format_bytes()` Function.

* Os valores de tempo são formatados com unidades temporais usando a `format_time()` Function.

* Os SQL statements são truncados para uma largura máxima de exibição usando a `format_statement()` Function.

* Os nomes de Path (caminho) são encurtados usando a `format_path()` Function.