### 30.4.3 Visões do esquema sys

30.4.3.1 Visões host_summary e x$host_summary

30.4.3.2 Visões host_summary_by_file_io e x$host_summary_by_file_io

30.4.3.3 Visões host_summary_by_file_io_type e x$host_summary_by_file_io_type

30.4.3.4 Visões host_summary_by_stages e x$host_summary_by_stages

30.4.3.5 Visões host_summary_by_statement_latency e x$host_summary_by_statement_latency

30.4.3.6 Visões host_summary_by_statement_type e x$host_summary_by_statement_type

30.4.3.7 Visões innodb_buffer_stats_by_schema e x$innodb_buffer_stats_by_schema

30.4.3.8 Visões innodb_buffer_stats_by_table e x$innodb_buffer_stats_by_table

30.4.3.9 Visões innodb_lock_waits e x$innodb_lock_waits

30.4.3.10 Visões io_by_thread_by_latency e x$io_by_thread_by_latency

30.4.3.11 Visões io_global_by_file_by_bytes e x$io_global_by_file_by_bytes

30.4.3.12 Visões io_global_by_file_by_latency e x$io_global_by_file_by_latency

30.4.3.13 Visões io_global_by_wait_by_bytes e x$io_global_by_wait_by_bytes

30.4.3.14 Visões io_global_by_wait_by_latency e x$io_global_by_wait_by_latency

30.4.3.15 Visões latest_file_io e x$latest_file_io

30.4.3.16 Visões memory_by_host_by_current_bytes e x$memory_by_host_by_current_bytes

30.4.3.17 Visões memory_by_thread_by_current_bytes e x$memory_by_thread_by_current_bytes

30.4.3.18 Visões memory_by_user_by_current_bytes e x$memory_by_user_by_current_bytes

30.4.3.19 Visões memory_global_by_current_bytes e x$memory_global_by_current_bytes

30.4.3.20 Visões memory_global_total e x$memory_global_total

30.4.3.21 A métrica Visualizar

30.4.3.22 As visualizações processlist e x$processlist

30.4.3.23 A visualização ps_check_lost_instrumentation

30.4.3.24 A visualização schema_auto_increment_columns

30.4.3.25 As visualizações schema_index_statistics e x$schema_index_statistics

30.4.3.26 A visualização schema_object_overview

30.4.3.27 As visualizações schema_redundant_indexes e x$schema_flattened_keys

30.4.3.28 As visualizações schema_table_lock_waits e x$schema_table_lock_waits

30.4.3.29 As visualizações schema_table_statistics e x$schema_table_statistics

30.4.3.30 As visualizações schema_table_statistics_with_buffer e x$schema_table_statistics_with_buffer

30.4.3.31 As visualizações schema_tables_with_full_table_scans e x$schema_tables_with_full_table_scans

30.4.3.32 A visualização schema_unused_indexes

30.4.3.33 As visualizações session e x$session

30.4.3.34 A visualização session_ssl_status

30.4.3.35 As visualizações statement_analysis e x$statement_analysis

30.4.3.36 As visualizações statements_with_errors_or_warnings e x$statements_with_errors_or_warnings

30.4.3.37 As visualizações statements_with_full_table_scans e x$statements_with_full_table_scans

30.4.3.38 As visualizações statements_with_runtimes_in_95th_percentile e x$statements_with_runtimes_in_95th_percentile

30.4.3.39 As visualizações statements_with_sorting e x$statements_with_sorting

30.4.3.40 As visualizações statements_with_temp_tables e x$statements_with_temp_tables

30.4.3.41 As visualizações user_summary e x$user_summary

30.4.3.42 As visualizações user_summary_by_file_io e x$user_summary_by_file_io

30.4.3.43 As visualizações user_summary_by_file_io_type e x$user_summary_by_file_io_type

30.4.3.44 As visualizações user_summary_by_stages e x$user_summary_by_stages

30.4.3.45 A visualização `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency`

30.4.3.46 A visualização `user_summary_by_statement_type` e `x$user_summary_by_statement_type`

30.4.3.47 A visualização `version`

30.4.3.48 As visualizações `wait_classes_global_by_avg_latency` e `x$wait_classes_global_by_avg_latency`

30.4.3.49 As visualizações `wait_classes_global_by_latency` e `x$wait_classes_global_by_latency`

30.4.3.50 As visualizações `waits_by_host_by_latency` e `x$waits_by_host_by_latency`

30.4.3.51 As visualizações `waits_by_user_by_latency` e `x$waits_by_user_by_latency`

30.4.3.52 As visualizações `waits_global_by_latency` e `x$waits_global_by_latency`

As seções a seguir descrevem as visualizações do esquema `sys`.

O esquema `sys` contém muitas visualizações que resumem as tabelas do Performance Schema de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome que o outro membro, mais o prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências em picosegundos não formatadas:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visualização sem o prefixo `x$` é destinada a fornecer uma saída mais amigável ao usuário e mais fácil de ler. A visualização com o prefixo `x$` que exibe os mesmos valores em forma bruta é mais destinada para uso com outras ferramentas que realizam seu próprio processamento nos dados.

As visualizações sem o prefixo `x$` diferem das visualizações `x$` correspondentes das seguintes maneiras:

* Os contos de bytes são formatados com unidades de tamanho usando a função `format_bytes()`.

* Os valores de tempo são formatados com unidades temporais usando a função `format_time()`.

* As instruções SQL são truncadas a uma largura máxima de exibição usando a função `format_statement()"`).

* Os nomes de caminho são abreviados usando a função `format_path()"`).