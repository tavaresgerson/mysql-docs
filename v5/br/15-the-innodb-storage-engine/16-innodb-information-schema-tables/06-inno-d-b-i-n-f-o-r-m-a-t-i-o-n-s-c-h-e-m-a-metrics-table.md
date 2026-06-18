### 14.16.6 Tabela de Métricas INFORMATION_SCHEMA do InnoDB

A tabela `INNODB_METRICS` fornece informações sobre desempenho e contadores relacionados a recursos do `InnoDB`.

As colunas da tabela `INNODB_METRICS` são mostradas abaixo. Para descrições das colunas, consulte a Seção 24.4.16, “A Tabela INFORMATION_SCHEMA INNODB_METRICS”.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 46273
      MAX_COUNT: 46273
      MIN_COUNT: NULL
      AVG_COUNT: 492.2659574468085
    COUNT_RESET: 46273
MAX_COUNT_RESET: 46273
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-11-28 16:07:53
  TIME_DISABLED: NULL
   TIME_ELAPSED: 94
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Habilitando, Desabilitando e Reiniciando Counters

Você pode habilitar, desabilitar e reiniciar counters usando as seguintes variáveis:

* `innodb_monitor_enable`: Habilita counters.

  ```sql
  SET GLOBAL innodb_monitor_enable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_disable`: Desabilita counters.

  ```sql
  SET GLOBAL innodb_monitor_disable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset`: Reinicia (Resets) os valores dos counters para zero.

  ```sql
  SET GLOBAL innodb_monitor_reset = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset_all`: Reinicia todos os valores de counter. Um counter deve ser desabilitado antes de usar `innodb_monitor_reset_all`.

  ```sql
  SET GLOBAL innodb_monitor_reset_all = [counter-name|module_name|pattern|all];
  ```

Counters e módulos de counter também podem ser habilitados na inicialização usando o arquivo de configuração do servidor MySQL. Por exemplo, para habilitar o módulo `log`, os counters `metadata_table_handles_opened` e `metadata_table_handles_closed`, insira a seguinte linha na seção `[mysqld]` do arquivo de configuração do servidor MySQL.

```sql
[mysqld]
innodb_monitor_enable = module_recovery,metadata_table_handles_opened,metadata_table_handles_closed
```

Ao habilitar múltiplos counters ou módulos em um arquivo de configuração, especifique a variável `innodb_monitor_enable` seguida pelos nomes do counter e do módulo separados por vírgula, conforme mostrado acima. Apenas a variável `innodb_monitor_enable` pode ser usada em um arquivo de configuração. As variáveis `innodb_monitor_disable` e `innodb_monitor_reset` são suportadas apenas na linha de comando.

Nota

Como cada counter adiciona um certo grau de sobrecarga de tempo de execução (runtime overhead), use os counters de forma conservadora em servidores de produção para diagnosticar problemas específicos ou monitorar funcionalidades específicas. Recomenda-se um servidor de teste ou desenvolvimento para um uso mais extenso dos counters.

#### Counters

A lista de counters disponíveis está sujeita a alterações. Faça uma Query na tabela `INNODB_METRICS` do Information Schema para verificar os counters disponíveis na sua versão do servidor MySQL.

Os counters habilitados por padrão correspondem àqueles mostrados na saída de `SHOW ENGINE INNODB STATUS`. Os counters mostrados na saída de `SHOW ENGINE INNODB STATUS` estão sempre habilitados em nível de sistema, mas podem ser desabilitados para a tabela `INNODB_METRICS`. O STATUS do counter não é persistente. A menos que configurados de outra forma, os counters revertem para o seu STATUS padrão, habilitado ou desabilitado, quando o servidor é reiniciado.

Se você executa programas que seriam afetados pela adição ou remoção de counters, é recomendável que você revise as notas de lançamento e faça Query na tabela `INNODB_METRICS` para identificar essas alterações como parte do seu processo de upgrade.

```sql
mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS ORDER BY NAME;
+------------------------------------------+---------------------+----------+
| name                                     | subsystem           | status   |
+------------------------------------------+---------------------+----------+
| adaptive_hash_pages_added                | adaptive_hash_index | disabled |
| adaptive_hash_pages_removed              | adaptive_hash_index | disabled |
| adaptive_hash_rows_added                 | adaptive_hash_index | disabled |
| adaptive_hash_rows_deleted_no_hash_entry | adaptive_hash_index | disabled |
| adaptive_hash_rows_removed               | adaptive_hash_index | disabled |
| adaptive_hash_rows_updated               | adaptive_hash_index | disabled |
| adaptive_hash_searches                   | adaptive_hash_index | enabled  |
| adaptive_hash_searches_btree             | adaptive_hash_index | enabled  |
| buffer_data_reads                        | buffer              | enabled  |
| buffer_data_written                      | buffer              | enabled  |
| buffer_flush_adaptive                    | buffer              | disabled |
| buffer_flush_adaptive_avg_pass           | buffer              | disabled |
| buffer_flush_adaptive_avg_time_est       | buffer              | disabled |
| buffer_flush_adaptive_avg_time_slot      | buffer              | disabled |
| buffer_flush_adaptive_avg_time_thread    | buffer              | disabled |
| buffer_flush_adaptive_pages              | buffer              | disabled |
| buffer_flush_adaptive_total_pages        | buffer              | disabled |
| buffer_flush_avg_page_rate               | buffer              | disabled |
| buffer_flush_avg_pass                    | buffer              | disabled |
| buffer_flush_avg_time                    | buffer              | disabled |
| buffer_flush_background                  | buffer              | disabled |
| buffer_flush_background_pages            | buffer              | disabled |
| buffer_flush_background_total_pages      | buffer              | disabled |
| buffer_flush_batches                     | buffer              | disabled |
| buffer_flush_batch_num_scan              | buffer              | disabled |
| buffer_flush_batch_pages                 | buffer              | disabled |
| buffer_flush_batch_scanned               | buffer              | disabled |
| buffer_flush_batch_scanned_per_call      | buffer              | disabled |
| buffer_flush_batch_total_pages           | buffer              | disabled |
| buffer_flush_lsn_avg_rate                | buffer              | disabled |
| buffer_flush_neighbor                    | buffer              | disabled |
| buffer_flush_neighbor_pages              | buffer              | disabled |
| buffer_flush_neighbor_total_pages        | buffer              | disabled |
| buffer_flush_n_to_flush_by_age           | buffer              | disabled |
| buffer_flush_n_to_flush_requested        | buffer              | disabled |
| buffer_flush_pct_for_dirty               | buffer              | disabled |
| buffer_flush_pct_for_lsn                 | buffer              | disabled |
| buffer_flush_sync                        | buffer              | disabled |
| buffer_flush_sync_pages                  | buffer              | disabled |
| buffer_flush_sync_total_pages            | buffer              | disabled |
| buffer_flush_sync_waits                  | buffer              | disabled |
| buffer_LRU_batches_evict                 | buffer              | disabled |
| buffer_LRU_batches_flush                 | buffer              | disabled |
| buffer_LRU_batch_evict_pages             | buffer              | disabled |
| buffer_LRU_batch_evict_total_pages       | buffer              | disabled |
| buffer_LRU_batch_flush_avg_pass          | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_est      | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_slot     | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_thread   | buffer              | disabled |
| buffer_LRU_batch_flush_pages             | buffer              | disabled |
| buffer_LRU_batch_flush_total_pages       | buffer              | disabled |
| buffer_LRU_batch_num_scan                | buffer              | disabled |
| buffer_LRU_batch_scanned                 | buffer              | disabled |
| buffer_LRU_batch_scanned_per_call        | buffer              | disabled |
| buffer_LRU_get_free_loops                | buffer              | disabled |
| buffer_LRU_get_free_search               | Buffer              | disabled |
| buffer_LRU_get_free_waits                | buffer              | disabled |
| buffer_LRU_search_num_scan               | buffer              | disabled |
| buffer_LRU_search_scanned                | buffer              | disabled |
| buffer_LRU_search_scanned_per_call       | buffer              | disabled |
| buffer_LRU_single_flush_failure_count    | Buffer              | disabled |
| buffer_LRU_single_flush_num_scan         | buffer              | disabled |
| buffer_LRU_single_flush_scanned          | buffer              | disabled |
| buffer_LRU_single_flush_scanned_per_call | buffer              | disabled |
| buffer_LRU_unzip_search_num_scan         | buffer              | disabled |
| buffer_LRU_unzip_search_scanned          | buffer              | disabled |
| buffer_LRU_unzip_search_scanned_per_call | buffer              | disabled |
| buffer_pages_created                     | buffer              | enabled  |
| buffer_pages_read                        | buffer              | enabled  |
| buffer_pages_written                     | buffer              | enabled  |
| buffer_page_read_blob                    | buffer_page_io      | disabled |
| buffer_page_read_fsp_hdr                 | buffer_page_io      | disabled |
| buffer_page_read_ibuf_bitmap             | buffer_page_io      | disabled |
| buffer_page_read_ibuf_free_list          | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_leaf         | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_non_leaf     | buffer_page_io      | disabled |
| buffer_page_read_index_inode             | buffer_page_io      | disabled |
| buffer_page_read_index_leaf              | buffer_page_io      | disabled |
| buffer_page_read_index_non_leaf          | buffer_page_io      | disabled |
| buffer_page_read_other                   | buffer_page_io      | disabled |
| buffer_page_read_system_page             | buffer_page_io      | disabled |
| buffer_page_read_trx_system              | buffer_page_io      | disabled |
| buffer_page_read_undo_log                | buffer_page_io      | disabled |
| buffer_page_read_xdes                    | buffer_page_io      | disabled |
| buffer_page_read_zblob                   | buffer_page_io      | disabled |
| buffer_page_read_zblob2                  | buffer_page_io      | disabled |
| buffer_page_written_blob                 | buffer_page_io      | disabled |
| buffer_page_written_fsp_hdr              | buffer_page_io      | disabled |
| buffer_page_written_ibuf_bitmap          | buffer_page_io      | disabled |
| buffer_page_written_ibuf_free_list       | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_leaf      | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_non_leaf  | buffer_page_io      | disabled |
| buffer_page_written_index_inode          | buffer_page_io      | disabled |
| buffer_page_written_index_leaf           | buffer_page_io      | disabled |
| buffer_page_written_index_non_leaf       | buffer_page_io      | disabled |
| buffer_page_written_other                | buffer_page_io      | disabled |
| buffer_page_written_system_page          | buffer_page_io      | disabled |
| buffer_page_written_trx_system           | buffer_page_io      | disabled |
| buffer_page_written_undo_log             | buffer_page_io      | disabled |
| buffer_page_written_xdes                 | buffer_page_io      | disabled |
| buffer_page_written_zblob                | buffer_page_io      | disabled |
| buffer_page_written_zblob2               | buffer_page_io      | disabled |
| buffer_pool_bytes_data                   | buffer              | enabled  |
| buffer_pool_bytes_dirty                  | buffer              | enabled  |
| buffer_pool_pages_data                   | buffer              | enabled  |
| buffer_pool_pages_dirty                  | buffer              | enabled  |
| buffer_pool_pages_free                   | buffer              | enabled  |
| buffer_pool_pages_misc                   | buffer              | enabled  |
| buffer_pool_pages_total                  | buffer              | enabled  |
| buffer_pool_reads                        | buffer              | enabled  |
| buffer_pool_read_ahead                   | buffer              | enabled  |
| buffer_pool_read_ahead_evicted           | buffer              | enabled  |
| buffer_pool_read_requests                | buffer              | enabled  |
| buffer_pool_size                         | server              | enabled  |
| buffer_pool_wait_free                    | buffer              | enabled  |
| buffer_pool_write_requests               | buffer              | enabled  |
| compression_pad_decrements               | compression         | disabled |
| compression_pad_increments               | compression         | disabled |
| compress_pages_compressed                | compression         | disabled |
| compress_pages_decompressed              | compression         | disabled |
| ddl_background_drop_indexes              | ddl                 | disabled |
| ddl_background_drop_tables               | ddl                 | disabled |
| ddl_log_file_alter_table                 | ddl                 | disabled |
| ddl_online_create_index                  | ddl                 | disabled |
| ddl_pending_alter_table                  | ddl                 | disabled |
| ddl_sort_file_alter_table                | ddl                 | disabled |
| dml_deletes                              | dml                 | enabled  |
| dml_inserts                              | dml                 | enabled  |
| dml_reads                                | dml                 | disabled |
| dml_updates                              | dml                 | enabled  |
| file_num_open_files                      | file_system         | enabled  |
| ibuf_merges                              | change_buffer       | enabled  |
| ibuf_merges_delete                       | change_buffer       | enabled  |
| ibuf_merges_delete_mark                  | change_buffer       | enabled  |
| ibuf_merges_discard_delete               | change_buffer       | enabled  |
| ibuf_merges_discard_delete_mark          | change_buffer       | enabled  |
| ibuf_merges_discard_insert               | change_buffer       | enabled  |
| ibuf_merges_insert                       | change_buffer       | enabled  |
| ibuf_size                                | change_buffer       | enabled  |
| icp_attempts                             | icp                 | disabled |
| icp_match                                | icp                 | disabled |
| icp_no_match                             | icp                 | disabled |
| icp_out_of_range                         | icp                 | disabled |
| index_page_discards                      | index               | disabled |
| index_page_merge_attempts                | index               | disabled |
| index_page_merge_successful              | index               | disabled |
| index_page_reorg_attempts                | index               | disabled |
| index_page_reorg_successful              | index               | disabled |
| index_page_splits                        | index               | disabled |
| innodb_activity_count                    | server              | enabled  |
| innodb_background_drop_table_usec        | server              | disabled |
| innodb_checkpoint_usec                   | server              | disabled |
| innodb_dblwr_pages_written               | server              | enabled  |
| innodb_dblwr_writes                      | server              | enabled  |
| innodb_dict_lru_count                    | server              | disabled |
| innodb_dict_lru_usec                     | server              | disabled |
| innodb_ibuf_merge_usec                   | server              | disabled |
| innodb_log_flush_usec                    | server              | disabled |
| innodb_master_active_loops               | server              | disabled |
| innodb_master_idle_loops                 | server              | disabled |
| innodb_master_purge_usec                 | server              | disabled |
| innodb_master_thread_sleeps              | server              | disabled |
| innodb_mem_validate_usec                 | server              | disabled |
| innodb_page_size                         | server              | enabled  |
| innodb_rwlock_sx_os_waits                | server              | enabled  |
| innodb_rwlock_sx_spin_rounds             | server              | enabled  |
| innodb_rwlock_sx_spin_waits              | server              | enabled  |
| innodb_rwlock_s_os_waits                 | server              | enabled  |
| innodb_rwlock_s_spin_rounds              | server              | enabled  |
| innodb_rwlock_s_spin_waits               | server              | enabled  |
| innodb_rwlock_x_os_waits                 | server              | enabled  |
| innodb_rwlock_x_spin_rounds              | server              | enabled  |
| innodb_rwlock_x_spin_waits               | server              | enabled  |
| lock_deadlocks                           | lock                | enabled  |
| lock_rec_locks                           | lock                | disabled |
| lock_rec_lock_created                    | lock                | disabled |
| lock_rec_lock_removed                    | lock                | disabled |
| lock_rec_lock_requests                   | lock                | disabled |
| lock_rec_lock_waits                      | lock                | disabled |
| lock_row_lock_current_waits              | lock                | enabled  |
| lock_row_lock_time                       | lock                | enabled  |
| lock_row_lock_time_avg                   | lock                | enabled  |
| lock_row_lock_time_max                   | lock                | enabled  |
| lock_row_lock_waits                      | lock                | enabled  |
| lock_table_locks                         | lock                | disabled |
| lock_table_lock_created                  | lock                | disabled |
| lock_table_lock_removed                  | lock                | disabled |
| lock_table_lock_waits                    | lock                | disabled |
| lock_timeouts                            | lock                | enabled  |
| log_checkpoints                          | recovery            | disabled |
| log_lsn_buf_pool_oldest                  | recovery            | disabled |
| log_lsn_checkpoint_age                   | recovery            | disabled |
| log_lsn_current                          | recovery            | disabled |
| log_lsn_last_checkpoint                  | recovery            | disabled |
| log_lsn_last_flush                       | recovery            | disabled |
| log_max_modified_age_async               | recovery            | disabled |
| log_max_modified_age_sync                | recovery            | disabled |
| log_num_log_io                           | recovery            | disabled |
| log_padded                               | recovery            | enabled  |
| log_pending_checkpoint_writes            | recovery            | disabled |
| log_pending_log_flushes                  | recovery            | disabled |
| log_waits                                | recovery            | enabled  |
| log_writes                               | recovery            | enabled  |
| log_write_requests                       | recovery            | enabled  |
| metadata_table_handles_closed            | metadata            | disabled |
| metadata_table_handles_opened            | metadata            | disabled |
| metadata_table_reference_count           | metadata            | disabled |
| os_data_fsyncs                           | os                  | enabled  |
| os_data_reads                            | os                  | enabled  |
| os_data_writes                           | os                  | enabled  |
| os_log_bytes_written                     | os                  | enabled  |
| os_log_fsyncs                            | os                  | enabled  |
| os_log_pending_fsyncs                    | os                  | enabled  |
| os_log_pending_writes                    | os                  | enabled  |
| os_pending_reads                         | os                  | disabled |
| os_pending_writes                        | os                  | disabled |
| purge_del_mark_records                   | purge               | disabled |
| purge_dml_delay_usec                     | purge               | disabled |
| purge_invoked                            | purge               | disabled |
| purge_resume_count                       | purge               | disabled |
| purge_stop_count                         | purge               | disabled |
| purge_undo_log_pages                     | purge               | disabled |
| purge_upd_exist_or_extern_records        | purge               | disabled |
| trx_active_transactions                  | transaction         | disabled |
| trx_commits_insert_update                | transaction         | disabled |
| trx_nl_ro_commits                        | transaction         | disabled |
| trx_rollbacks                            | transaction         | disabled |
| trx_rollbacks_savepoint                  | transaction         | disabled |
| trx_rollback_active                      | transaction         | disabled |
| trx_ro_commits                           | transaction         | disabled |
| trx_rseg_current_size                    | transaction         | disabled |
| trx_rseg_history_len                     | transaction         | enabled  |
| trx_rw_commits                           | transaction         | disabled |
| trx_undo_slots_cached                    | transaction         | disabled |
| trx_undo_slots_used                      | transaction         | disabled |
+------------------------------------------+---------------------+----------+
235 rows in set (0.01 sec)
```

#### Módulos de Counter

Cada counter está associado a um módulo específico. Nomes de módulos podem ser usados para habilitar, desabilitar ou reiniciar todos os counters para um SUBSYSTEM específico. Por exemplo, use `module_dml` para habilitar todos os counters associados ao SUBSYSTEM `dml`.

```sql
mysql> SET GLOBAL innodb_monitor_enable = module_dml;

mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE subsystem ='dml';
+-------------+-----------+---------+
| name        | subsystem | status  |
+-------------+-----------+---------+
| dml_reads   | dml       | enabled |
| dml_inserts | dml       | enabled |
| dml_deletes | dml       | enabled |
| dml_updates | dml       | enabled |
+-------------+-----------+---------+
```

Nomes de módulos podem ser usados com `innodb_monitor_enable` e variáveis relacionadas.

Os nomes dos módulos e os nomes correspondentes dos `SUBSYSTEM` estão listados abaixo.

* `module_adaptive_hash` (subsystem = `adaptive_hash_index`)

* `module_buffer` (subsystem = `buffer`)

* `module_buffer_page` (subsystem = `buffer_page_io`)

* `module_compress` (subsystem = `compression`)

* `module_ddl` (subsystem = `ddl`)

* `module_dml` (subsystem = `dml`)

* `module_file` (subsystem = `file_system`)

* `module_ibuf_system` (subsystem = `change_buffer`)

* `module_icp` (subsystem = `icp`)

* `module_index` (subsystem = `index`)

* `module_innodb` (subsystem = `innodb`)

* `module_lock` (subsystem = `lock`)

* `module_log` (subsystem = `recovery`)

* `module_metadata` (subsystem = `metadata`)

* `module_os` (subsystem = `os`)

* `module_purge` (subsystem = `purge`)

* `module_trx` (subsystem = `transaction`)

**Exemplo 14.11 Trabalhando com Counters da Tabela INNODB_METRICS**

Este exemplo demonstra como habilitar, desabilitar e reiniciar (reset) um counter, e como fazer Query dos dados do counter na tabela `INNODB_METRICS`.

1. Crie uma tabela `InnoDB` simples:

   ```sql
   mysql> USE test;
   Database changed

   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   Query OK, 0 rows affected (0.02 sec)
   ```

2. Habilite o counter `dml_inserts`.

   ```sql
   mysql> SET GLOBAL innodb_monitor_enable = dml_inserts;
   Query OK, 0 rows affected (0.01 sec)
   ```

   Uma descrição do counter `dml_inserts` pode ser encontrada na coluna `COMMENT` da tabela `INNODB_METRICS`:

   ```sql
   mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts";
   +-------------+-------------------------+
   | NAME        | COMMENT                 |
   +-------------+-------------------------+
   | dml_inserts | Number of rows inserted |
   +-------------+-------------------------+
   ```

3. Faça Query na tabela `INNODB_METRICS` para obter os dados do counter `dml_inserts`. Como nenhuma operação DML foi realizada, os valores do counter são zero ou NULL. Os valores `TIME_ENABLED` e `TIME_ELAPSED` indicam quando o counter foi habilitado pela última vez e quantos segundos se passaram desde então.

   ```sql
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: 0
         MIN_COUNT: NULL
         AVG_COUNT: 0
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 28
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

4. Insira três linhas de dados na tabela.

   ```sql
   mysql> INSERT INTO t1 values(1);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(2);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(3);
   Query OK, 1 row affected (0.00 sec)
   ```

5. Faça Query na tabela `INNODB_METRICS` novamente para obter os dados do counter `dml_inserts`. Vários valores de counter agora foram incrementados, incluindo `COUNT`, `MAX_COUNT`, `AVG_COUNT` e `COUNT_RESET`. Consulte a definição da tabela `INNODB_METRICS` para descrições desses valores.

   ```sql
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.046153846153846156
       COUNT_RESET: 3
   MAX_COUNT_RESET: 3
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 65
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

6. Reinicie (Reset) o counter `dml_inserts` e faça Query na tabela `INNODB_METRICS` novamente para obter os dados do counter `dml_inserts`. Os valores `%_RESET` que foram relatados anteriormente, como `COUNT_RESET` e `MAX_RESET`, são redefinidos para zero. Valores como `COUNT`, `MAX_COUNT` e `AVG_COUNT`, que coletam dados cumulativamente desde o momento em que o counter é habilitado, não são afetados pelo reset.

   ```sql
   mysql> SET GLOBAL innodb_monitor_reset = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.03529411764705882
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 85
        TIME_RESET: 2014-12-04 14:19:44
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

7. Para reiniciar todos os valores de counter, você deve primeiro desabilitar o counter. Desabilitar o counter define o valor `STATUS` como `disabled`.

   ```sql
   mysql> SET GLOBAL innodb_monitor_disable = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.030612244897959183
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: 2014-12-04 14:20:06
      TIME_ELAPSED: 98
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

   Nota

   A correspondência por curinga (wildcard match) é suportada para nomes de counter e módulo. Por exemplo, em vez de especificar o nome completo do counter `dml_inserts`, você pode especificar `dml_i%`. Você também pode habilitar, desabilitar ou reiniciar múltiplos counters ou módulos de uma só vez usando uma correspondência por curinga. Por exemplo, especifique `dml_%` para habilitar, desabilitar ou reiniciar todos os counters que começam com `dml_`.

8. Depois que o counter for desabilitado, você pode reiniciar todos os valores de counter usando a opção `innodb_monitor_reset_all`. Todos os valores são definidos como zero ou NULL.

   ```sql
   mysql> SET GLOBAL innodb_monitor_reset_all = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: NULL
         MIN_COUNT: NULL
         AVG_COUNT: NULL
       COUNT_RESET: 0
   MAX_COUNT_RESET: NULL
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: NULL
     TIME_DISABLED: NULL
      TIME_ELAPSED: NULL
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```