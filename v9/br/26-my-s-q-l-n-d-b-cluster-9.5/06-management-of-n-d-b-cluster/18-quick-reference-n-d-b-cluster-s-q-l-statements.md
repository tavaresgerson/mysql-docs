### 25.6.18 Referência Rápida: Declarações SQL do NDB Cluster

Esta seção discute várias declarações SQL que podem ser úteis para gerenciar e monitorar um servidor MySQL conectado a um NDB Cluster, e, em alguns casos, fornecem informações sobre o próprio cluster.

* `SHOW ENGINE NDB STATUS`, `SHOW ENGINE NDBCLUSTER STATUS`

  A saída desta declaração contém informações sobre a conexão do servidor com o cluster, criação e uso de objetos do NDB Cluster e registro binário para a replicação do NDB Cluster.

  Veja a Seção 15.7.7.17, “Declaração SHOW”, para um exemplo de uso e informações mais detalhadas.

* `SHOW ENGINES`

  Esta declaração pode ser usada para determinar se o suporte a clustering está habilitado no servidor MySQL e, se sim, se está ativo.

  Veja a Seção 15.7.7.18, “Declaração SHOW ENGINES”, para informações mais detalhadas.

  Nota

  Esta declaração não suporta uma cláusula `LIKE`. No entanto, você pode usar `LIKE` para filtrar consultas na tabela `ENGINES` do Schema de Informações `ENGINES`, conforme discutido no próximo item.

* `SELECT * FROM INFORMATION_SCHEMA.ENGINES [WHERE ENGINE LIKE 'NDB%']`

  Este é o equivalente a `SHOW ENGINES`, mas usa a tabela `ENGINES` do banco de dados `INFORMATION_SCHEMA`. Ao contrário do caso da declaração `SHOW ENGINES`, é possível filtrar os resultados usando uma cláusula `LIKE` e selecionar colunas específicas para obter informações que podem ser úteis em scripts. Por exemplo, a seguinte consulta mostra se o servidor foi construído com suporte `NDB` e, se sim, se está habilitado:

  ```
  mysql> SELECT ENGINE, SUPPORT FROM INFORMATION_SCHEMA.ENGINES
      ->   WHERE ENGINE LIKE 'NDB%';
  +------------+---------+
  | ENGINE     | SUPPORT |
  +------------+---------+
  | ndbcluster | YES     |
  | ndbinfo    | YES     |
  +------------+---------+
  ```

  Se o suporte `NDB` não estiver habilitado, a consulta anterior retorna um conjunto vazio. Veja a Seção 28.3.13, “A Tabela INFORMATION_SCHEMA ENGINES”, para mais informações.

* `SHOW VARIABLES LIKE 'NDB%'`

Esta declaração fornece uma lista das variáveis do sistema do servidor relacionadas ao motor de armazenamento `NDB`, e seus valores, conforme mostrado aqui:

  ```
  mysql> SHOW VARIABLES LIKE 'NDB%';
  +--------------------------------------------+----------------------------------+
  | Variable_name                              | Value                            |
  +--------------------------------------------+----------------------------------+
  | ndb_allow_copying_alter_table              | ON                               |
  | ndb_applier_allow_skip_epoch               | OFF                              |
  | ndb_applier_conflict_role                  | NONE                             |
  | ndb_autoincrement_prefetch_sz              | 512                              |
  | ndb_batch_size                             | 32768                            |
  | ndb_blob_read_batch_bytes                  | 65536                            |
  | ndb_blob_write_batch_bytes                 | 65536                            |
  | ndb_clear_apply_status                     | ON                               |
  | ndb_cluster_connection_pool                | 1                                |
  | ndb_cluster_connection_pool_nodeids        |                                  |
  | ndb_connectstring                          | 127.0.0.1                        |
  | ndb_data_node_neighbour                    | 0                                |
  | ndb_default_column_format                  | FIXED                            |
  | ndb_deferred_constraints                   | 0                                |
  | ndb_distribution                           | KEYHASH                          |
  | ndb_eventbuffer_free_percent               | 20                               |
  | ndb_eventbuffer_max_alloc                  | 0                                |
  | ndb_extra_logging                          | 1                                |
  | ndb_force_send                             | ON                               |
  | ndb_fully_replicated                       | OFF                              |
  | ndb_index_stat_enable                      | ON                               |
  | ndb_index_stat_option                      | loop_enable=1000ms,
  loop_idle=1000ms,loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,
  check_batch=8,check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,
  error_delay=1m,evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,
  zero_total=0                                                                    |
  | ndb_join_pushdown                          | ON                               |
  | ndb_log_apply_status                       | OFF                              |
  | ndb_log_bin                                | OFF                              |
  | ndb_log_binlog_index                       | ON                               |
  | ndb_log_empty_epochs                       | OFF                              |
  | ndb_log_empty_update                       | OFF                              |
  | ndb_log_exclusive_reads                    | OFF                              |
  | ndb_log_fail_terminate                     | OFF                              |
  | ndb_log_orig                               | OFF                              |
  | ndb_log_transaction_compression            | OFF                              |
  | ndb_log_transaction_compression_level_zstd | 3                                |
  | ndb_log_transaction_dependency             | OFF                              |
  | ndb_log_transaction_id                     | OFF                              |
  | ndb_log_update_as_write                    | ON                               |
  | ndb_log_update_minimal                     | OFF                              |
  | ndb_log_updated_only                       | ON                               |
  | ndb_metadata_check                         | ON                               |
  | ndb_metadata_check_interval                | 60                               |
  | ndb_metadata_sync                          | OFF                              |
  | ndb_mgm_tls                                | relaxed                          |
  | ndb_mgmd_host                              | 127.0.0.1                        |
  | ndb_nodeid                                 | 0                                |
  | ndb_optimization_delay                     | 10                               |
  | ndb_optimized_node_selection               | 3                                |
  | ndb_read_backup                            | ON                               |
  | ndb_recv_thread_activation_threshold       | 8                                |
  | ndb_recv_thread_cpu_mask                   |                                  |
  | ndb_replica_batch_size                     | 2097152                          |
  | ndb_replica_blob_write_batch_bytes         | 2097152                          |
  | ndb_report_thresh_binlog_epoch_slip        | 10                               |
  | ndb_report_thresh_binlog_mem_usage         | 10                               |
  | ndb_row_checksum                           | 1                                |
  | ndb_schema_dist_lock_wait_timeout          | 30                               |
  | ndb_schema_dist_timeout                    | 120                              |
  | ndb_schema_dist_upgrade_allowed            | ON                               |
  | ndb_show_foreign_key_mock_tables           | OFF                              |
  | ndb_slave_conflict_role                    | NONE                             |
  | ndb_table_no_logging                       | OFF                              |
  | ndb_table_temporary                        | OFF                              |
  | ndb_tls_search_path                        | $HOME/ndb-tls                    |
  | ndb_use_copying_alter_table                | OFF                              |
  | ndb_use_exact_count                        | OFF                              |
  | ndb_use_transactions                       | ON                               |
  | ndb_version                                | 524544                           |
  | ndb_version_string                         | ndb-8.4.0                        |
  | ndb_wait_connected                         | 120                              |
  | ndb_wait_setup                             | 120                              |
  | ndbinfo_database                           | ndbinfo                          |
  | ndbinfo_max_bytes                          | 0                                |
  | ndbinfo_max_rows                           | 10                               |
  | ndbinfo_offline                            | OFF                              |
  | ndbinfo_show_hidden                        | OFF                              |
  | ndbinfo_table_prefix                       | ndb$                             |
  | ndbinfo_version                            | 524544                           |
  +--------------------------------------------+----------------------------------+
  74 rows in set (0.01 sec)
  ```

  Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”, para obter mais informações.

* `SELECT * FROM performance_schema.global_variables WHERE VARIABLE_NAME LIKE 'NDB%'`

  Esta declaração é o equivalente à declaração `SHOW VARIABLES` descrita no item anterior, e fornece uma saída quase idêntica, conforme mostrado aqui:

  ```
  mysql> SELECT * FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | VARIABLE_NAME                        | VARIABLE_VALUE                        |
  +--------------------------------------+---------------------------------------+
  | ndb_allow_copying_alter_table        | ON                                    |
  | ndb_autoincrement_prefetch_sz        | 512                                   |
  | ndb_batch_size                       | 32768                                 |
  | ndb_blob_read_batch_bytes            | 65536                                 |
  | ndb_blob_write_batch_bytes           | 65536                                 |
  | ndb_clear_apply_status               | ON                                    |
  | ndb_cluster_connection_pool          | 1                                     |
  | ndb_cluster_connection_pool_nodeids  |                                       |
  | ndb_connectstring                    | 127.0.0.1                             |
  | ndb_data_node_neighbour              | 0                                     |
  | ndb_default_column_format            | FIXED                                 |
  | ndb_deferred_constraints             | 0                                     |
  | ndb_distribution                     | KEYHASH                               |
  | ndb_eventbuffer_free_percent         | 20                                    |
  | ndb_eventbuffer_max_alloc            | 0                                     |
  | ndb_extra_logging                    | 1                                     |
  | ndb_force_send                       | ON                                    |
  | ndb_fully_replicated                 | OFF                                   |
  | ndb_index_stat_enable                | ON                                    |
  | ndb_index_stat_option                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | ndb_join_pushdown                    | ON                                    |
  | ndb_log_apply_status                 | OFF                                   |
  | ndb_log_bin                          | OFF                                   |
  | ndb_log_binlog_index                 | ON                                    |
  | ndb_log_empty_epochs                 | OFF                                   |
  | ndb_log_empty_update                 | OFF                                   |
  | ndb_log_exclusive_reads              | OFF                                   |
  | ndb_log_orig                         | OFF                                   |
  | ndb_log_transaction_id               | OFF                                   |
  | ndb_log_update_as_write              | ON                                    |
  | ndb_log_update_minimal               | OFF                                   |
  | ndb_log_updated_only                 | ON                                    |
  | ndb_metadata_check                   | ON                                    |
  | ndb_metadata_check_interval          | 60                                    |
  | ndb_metadata_sync                    | OFF                                   |
  | ndb_mgmd_host                        | 127.0.0.1                             |
  | ndb_nodeid                           | 0                                     |
  | ndb_optimization_delay               | 10                                    |
  | ndb_optimized_node_selection         | 3                                     |
  | ndb_read_backup                      | ON                                    |
  | ndb_recv_thread_activation_threshold | 8                                     |
  | ndb_recv_thread_cpu_mask             |                                       |
  | ndb_report_thresh_binlog_epoch_slip  | 10                                    |
  | ndb_report_thresh_binlog_mem_usage   | 10                                    |
  | ndb_row_checksum                     | 1                                     |
  | ndb_schema_dist_lock_wait_timeout    | 30                                    |
  | ndb_schema_dist_timeout              | 120                                   |
  | ndb_schema_dist_upgrade_allowed      | ON                                    |
  | ndb_show_foreign_key_mock_tables     | OFF                                   |
  | ndb_slave_conflict_role              | NONE                                  |
  | ndb_table_no_logging                 | OFF                                   |
  | ndb_table_temporary                  | OFF                                   |
  | ndb_use_copying_alter_table          | OFF                                   |
  | ndb_use_exact_count                  | OFF                                   |
  | ndb_use_transactions                 | ON                                    |
  | ndb_version                          | 524308                                |
  | ndb_version_string                   | ndb-9.5.0                            |
  | ndb_wait_connected                   | 30                                    |
  | ndb_wait_setup                       | 30                                    |
  | ndbinfo_database                     | ndbinfo                               |
  | ndbinfo_max_bytes                    | 0                                     |
  | ndbinfo_max_rows                     | 10                                    |
  | ndbinfo_offline                      | OFF                                   |
  | ndbinfo_show_hidden                  | OFF                                   |
  | ndbinfo_table_prefix                 | ndb$                                  |
  | ndbinfo_version                      | 524308                                |
  +--------------------------------------+---------------------------------------+
  ```

  Ao contrário do caso da declaração `SHOW VARIABLES`, é possível selecionar colunas individuais. Por exemplo:

  ```
  mysql> SELECT VARIABLE_VALUE
      ->   FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME = 'ndb_force_send';
  +----------------+
  | VARIABLE_VALUE |
  +----------------+
  | ON             |
  +----------------+
  ```

  Uma consulta mais útil é mostrada aqui:

  ```
  mysql> SELECT VARIABLE_NAME AS Name, VARIABLE_VALUE AS Value
       >   FROM performance_schema.global_variables
       >   WHERE VARIABLE_NAME
       >     IN ('version', 'ndb_version',
       >       'ndb_version_string', 'ndbinfo_version');
  +--------------------+---------------+
  | Name               | Value         |
  +--------------------+---------------+
  | ndb_version        | 524544        |
  | ndb_version_string | ndb-8.4.0     |
  | ndbinfo_version    | 524544        |
  | version            | 8.4.0-cluster |
  +--------------------+---------------+
  4 rows in set (0.00 sec)
  ```

  Para mais informações, consulte a Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”, e a Seção 7.1.8, “Variáveis de Sistemas do Servidor”.

* `SHOW STATUS LIKE 'NDB%'`

  Esta declaração mostra de uma só vez se o servidor MySQL está atuando como um nó SQL de cluster, e, se sim, fornece o ID do nó de cluster do servidor MySQL, o nome do host e a porta para o servidor de gerenciamento de cluster ao qual ele está conectado, e o número de nós de dados no cluster, conforme mostrado aqui:

  ```
  mysql> SHOW STATUS LIKE 'NDB%';
  +----------------------------------------------+-------------------------------+
  | Variable_name                                | Value                         |
  +----------------------------------------------+-------------------------------+
  | Ndb_metadata_detected_count                  | 0                             |
  | Ndb_cluster_node_id                          | 100                           |
  | Ndb_config_from_host                         | 127.0.0.1                     |
  | Ndb_config_from_port                         | 1186                          |
  | Ndb_number_of_data_nodes                     | 2                             |
  | Ndb_number_of_ready_data_nodes               | 2                             |
  | Ndb_connect_count                            | 0                             |
  | Ndb_execute_count                            | 0                             |
  | Ndb_scan_count                               | 0                             |
  | Ndb_pruned_scan_count                        | 0                             |
  | Ndb_schema_locks_count                       | 0                             |
  | Ndb_api_wait_exec_complete_count_session     | 0                             |
  | Ndb_api_wait_scan_result_count_session       | 0                             |
  | Ndb_api_wait_meta_request_count_session      | 1                             |
  | Ndb_api_wait_nanos_count_session             | 163446                        |
  | Ndb_api_bytes_sent_count_session             | 60                            |
  | Ndb_api_bytes_received_count_session         | 28                            |
  | Ndb_api_trans_start_count_session            | 0                             |
  | Ndb_api_trans_commit_count_session           | 0                             |
  | Ndb_api_trans_abort_count_session            | 0                             |
  | Ndb_api_trans_close_count_session            | 0                             |
  | Ndb_api_pk_op_count_session                  | 0                             |
  | Ndb_api_uk_op_count_session                  | 0                             |
  | Ndb_api_table_scan_count_session             | 0                             |
  | Ndb_api_range_scan_count_session             | 0                             |
  | Ndb_api_pruned_scan_count_session            | 0                             |
  | Ndb_api_scan_batch_count_session             | 0                             |
  | Ndb_api_read_row_count_session               | 0                             |
  | Ndb_api_trans_local_read_row_count_session   | 0                             |
  | Ndb_api_adaptive_send_forced_count_session   | 0                             |
  | Ndb_api_adaptive_send_unforced_count_session | 0                             |
  | Ndb_api_adaptive_send_deferred_count_session | 0                             |
  | Ndb_trans_hint_count_session                 | 0                             |
  | Ndb_sorted_scan_count                        | 0                             |
  | Ndb_pushed_queries_defined                   | 0                             |
  | Ndb_pushed_queries_dropped                   | 0                             |
  | Ndb_pushed_queries_executed                  | 0                             |
  | Ndb_pushed_reads                             | 0                             |
  | Ndb_last_commit_epoch_server                 | 37632503447571                |
  | Ndb_last_commit_epoch_session                | 0                             |
  | Ndb_system_name                              | MC_20191126162038             |
  | Ndb_api_event_data_count_injector            | 0                             |
  | Ndb_api_event_nondata_count_injector         | 0                             |
  | Ndb_api_event_bytes_count_injector           | 0                             |
  | Ndb_api_wait_exec_complete_count_slave       | 0                             |
  | Ndb_api_wait_scan_result_count_slave         | 0                             |
  | Ndb_api_wait_meta_request_count_slave        | 0                             |
  | Ndb_api_wait_nanos_count_slave               | 0                             |
  | Ndb_api_bytes_sent_count_slave               | 0                             |
  | Ndb_api_bytes_received_count_slave           | 0                             |
  | Ndb_api_trans_start_count_slave              | 0                             |
  | Ndb_api_trans_commit_count_slave             | 0                             |
  | Ndb_api_trans_abort_count_slave              | 0                             |
  | Ndb_api_trans_close_count_slave              | 0                             |
  | Ndb_api_pk_op_count_slave                    | 0                             |
  | Ndb_api_uk_op_count_slave                    | 0                             |
  | Ndb_api_table_scan_count_slave               | 0                             |
  | Ndb_api_range_scan_count_slave               | 0                             |
  | Ndb_api_pruned_scan_count_slave              | 0                             |
  | Ndb_api_scan_batch_count_slave               | 0                             |
  | Ndb_api_read_row_count_slave                 | 0                             |
  | Ndb_api_trans_local_read_row_count_slave     | 0                             |
  | Ndb_api_adaptive_send_forced_count_slave     | 0                             |
  | Ndb_api_adaptive_send_unforced_count_slave   | 0                             |
  | Ndb_api_adaptive_send_deferred_count_slave   | 0                             |
  | Ndb_slave_max_replicated_epoch               | 0                             |
  | Ndb_api_wait_exec_complete_count             | 4                             |
  | Ndb_api_wait_scan_result_count               | 7                             |
  | Ndb_api_wait_meta_request_count              | 172                           |
  | Ndb_api_wait_nanos_count                     | 1083548094028                 |
  | Ndb_api_bytes_sent_count                     | 4640                          |
  | Ndb_api_bytes_received_count                 | 109356                        |
  | Ndb_api_trans_start_count                    | 4                             |
  | Ndb_api_trans_commit_count                   | 1                             |
  | Ndb_api_trans_abort_count                    | 1                             |
  | Ndb_api_trans_close_count                    | 4                             |
  | Ndb_api_pk_op_count                          | 2                             |
  | Ndb_api_uk_op_count                          | 0                             |
  | Ndb_api_table_scan_count                     | 1                             |
  | Ndb_api_range_scan_count                     | 1                             |
  | Ndb_api_pruned_scan_count                    | 0                             |
  | Ndb_api_scan_batch_count                     | 1                             |
  | Ndb_api_read_row_count                       | 3                             |
  | Ndb_api_trans_local_read_row_count           | 2                             |
  | Ndb_api_adaptive_send_forced_count           | 1                             |
  | Ndb_api_adaptive_send_unforced_count         | 5                             |
  | Ndb_api_adaptive_send_deferred_count         | 0                             |
  | Ndb_api_event_data_count                     | 0                             |
  | Ndb_api_event_nondata_count                  | 0                             |
  | Ndb_api_event_bytes_count                    | 0                             |
  | Ndb_metadata_excluded_count                  | 0                             |
  | Ndb_metadata_synced_count                    | 0                             |
  | Ndb_conflict_fn_max                          | 0                             |
  | Ndb_conflict_fn_old                          | 0                             |
  | Ndb_conflict_fn_max_del_win                  | 0                             |
  | Ndb_conflict_fn_epoch                        | 0                             |
  | Ndb_conflict_fn_epoch_trans                  | 0                             |
  | Ndb_conflict_fn_epoch2                       | 0                             |
  | Ndb_conflict_fn_epoch2_trans                 | 0                             |
  | Ndb_conflict_trans_row_conflict_count        | 0                             |
  | Ndb_conflict_trans_row_reject_count          | 0                             |
  | Ndb_conflict_trans_reject_count              | 0                             |
  | Ndb_conflict_trans_detect_iter_count         | 0                             |
  | Ndb_conflict_trans_conflict_commit_count     | 0                             |
  | Ndb_conflict_epoch_delete_delete_count       | 0                             |
  | Ndb_conflict_reflected_op_prepare_count      | 0                             |
  | Ndb_conflict_reflected_op_discard_count      | 0                             |
  | Ndb_conflict_refresh_op_count                | 0                             |
  | Ndb_conflict_last_conflict_epoch             | 0                             |
  | Ndb_conflict_last_stable_epoch               | 0                             |
  | Ndb_index_stat_status                        | allow:1,enable:1,busy:0,
  loop:1000,list:(new:0,update:0,read:0,idle:0,check:0,delete:0,error:0,total:0),
  analyze:(queue:0,wait:0),stats:(nostats:0,wait:0),total:(analyze:(all:0,error:0),
  query:(all:0,nostats:0,error:0),event:(act:0,skip:0,miss:0),cache:(refresh:0,
  clean:0,pinned:0,drop:0,evict:0)),cache:(query:0,clean:0,drop:0,evict:0,
  usedpct:0.00,highpct:0.00)                                                     |
  | Ndb_index_stat_cache_query                   | 0                             |
  | Ndb_index_stat_cache_clean                   | 0                             |
  +----------------------------------------------+-------------------------------+
  ```

  Se o servidor MySQL foi construído com suporte `NDB`, mas atualmente não está conectado a um cluster, cada linha na saída desta declaração contém um zero ou uma string vazia para a coluna `Value`.

  Veja também a Seção 15.7.7.38, “Declaração SHOW STATUS”.

* `SELECT * FROM performance_schema.global_status WHERE VARIABLE_NAME LIKE 'NDB%'`

  Esta declaração fornece uma saída semelhante à declaração `SHOW STATUS` discutida no item anterior. Ao contrário do caso da `SHOW STATUS`, é possível usar declarações `SELECT` para extrair valores em SQL para uso em scripts de monitoramento e automação.

Para obter mais informações, consulte a Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”.

* `SELECT * FROM INFORMATION_SCHEMA.PLUGINS WHERE PLUGIN_NAME LIKE 'NDB%'`

  Esta declaração exibe informações da tabela do Schema de Informação `PLUGINS` sobre os plugins associados ao NDB Cluster, como versão, autor e licença, conforme mostrado aqui:

  ```
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS
       >     WHERE PLUGIN_NAME LIKE 'NDB%'\G
  *************************** 1. row ***************************
             PLUGIN_NAME: ndbcluster
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 90500.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Clustered, fault-tolerant tables
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 2. row ***************************
             PLUGIN_NAME: ndbinfo
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 90500.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: MySQL Cluster system information storage engine
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 3. row ***************************
             PLUGIN_NAME: ndb_transid_mysql_connection_map
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: INFORMATION SCHEMA
     PLUGIN_TYPE_VERSION: 90500.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Map between MySQL connection ID and NDB transaction ID
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ```

  Você também pode usar a declaração `SHOW PLUGINS` para exibir essas informações, mas o resultado dessa declaração não pode ser facilmente filtrado. Veja também A API de Plugin do MySQL, que descreve onde e como as informações na tabela `PLUGINS` são obtidas.

Você também pode consultar as tabelas no banco de dados de informações `ndbinfo` para obter dados em tempo real sobre muitas operações do NDB Cluster. Consulte a Seção 25.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.