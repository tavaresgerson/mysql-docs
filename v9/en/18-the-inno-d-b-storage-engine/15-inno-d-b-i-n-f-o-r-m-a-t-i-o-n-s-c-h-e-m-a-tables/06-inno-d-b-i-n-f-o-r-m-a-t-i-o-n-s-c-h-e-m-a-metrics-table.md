### 17.15.6 InnoDB INFORMATION_SCHEMA Metrics Table

The `INNODB_METRICS` table provides information about `InnoDB` performance and resource-related counters.

`INNODB_METRICS` table columns are shown below. For column descriptions, see Section 28.4.21, “The INFORMATION_SCHEMA INNODB_METRICS Table”.

```
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

#### Enabling, Disabling, and Resetting Counters

You can enable, disable, and reset counters using the following variables:

* `innodb_monitor_enable`: Enables counters.

  ```
  SET GLOBAL innodb_monitor_enable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_disable`: Disables counters.

  ```
  SET GLOBAL innodb_monitor_disable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset`: Resets counter values to zero.

  ```
  SET GLOBAL innodb_monitor_reset = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset_all`: Resets all counter values. A counter must be disabled before using `innodb_monitor_reset_all`.

  ```
  SET GLOBAL innodb_monitor_reset_all = [counter-name|module_name|pattern|all];
  ```

Counters and counter modules can also be enabled at startup using the MySQL server configuration file. For example, to enable the `log` module, `metadata_table_handles_opened` and `metadata_table_handles_closed` counters, enter the following line in the `[mysqld]` section of the MySQL server configuration file.

```
[mysqld]
innodb_monitor_enable = log,metadata_table_handles_opened,metadata_table_handles_closed
```

When enabling multiple counters or modules in a configuration file, specify the `innodb_monitor_enable` variable followed by counter and module names separated by a comma, as shown above. Only the `innodb_monitor_enable` variable can be used in a configuration file. The `innodb_monitor_disable` and `innodb_monitor_reset` variables are supported on the command line only.

Note

Because each counter adds a degree of runtime overhead, use counters conservatively on production servers to diagnose specific issues or monitor specific functionality. A test or development server is recommended for more extensive use of counters.

#### Counters

The list of available counters is subject to change. Query the Information Schema `INNODB_METRICS` table for counters available in your MySQL server version.

The counters enabled by default correspond to those shown in `SHOW ENGINE INNODB STATUS` output. Counters shown in `SHOW ENGINE INNODB STATUS` output are always enabled at a system level but can be disabled for the `INNODB_METRICS` table. Counter status is not persistent. Unless configured otherwise, counters revert to their default enabled or disabled status when the server is restarted.

If you run programs that would be affected by the addition or removal of counters, it is recommended that you review the releases notes and query the `INNODB_METRICS` table to identify those changes as part of your upgrade process.

```
mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS ORDER BY NAME;
+---------------------------------------------+---------------------+----------+
| name                                        | subsystem           | status   |
+---------------------------------------------+---------------------+----------+
| adaptive_hash_pages_added                   | adaptive_hash_index | disabled |
| adaptive_hash_pages_removed                 | adaptive_hash_index | disabled |
| adaptive_hash_rows_added                    | adaptive_hash_index | disabled |
| adaptive_hash_rows_deleted_no_hash_entry    | adaptive_hash_index | disabled |
| adaptive_hash_rows_removed                  | adaptive_hash_index | disabled |
| adaptive_hash_rows_updated                  | adaptive_hash_index | disabled |
| adaptive_hash_searches                      | adaptive_hash_index | enabled  |
| adaptive_hash_searches_btree                | adaptive_hash_index | enabled  |
| buffer_data_reads                           | buffer              | enabled  |
| buffer_data_written                         | buffer              | enabled  |
| buffer_flush_adaptive                       | buffer              | disabled |
| buffer_flush_adaptive_avg_pass              | buffer              | disabled |
| buffer_flush_adaptive_avg_time_est          | buffer              | disabled |
| buffer_flush_adaptive_avg_time_slot         | buffer              | disabled |
| buffer_flush_adaptive_avg_time_thread       | buffer              | disabled |
| buffer_flush_adaptive_pages                 | buffer              | disabled |
| buffer_flush_adaptive_total_pages           | buffer              | disabled |
| buffer_flush_avg_page_rate                  | buffer              | disabled |
| buffer_flush_avg_pass                       | buffer              | disabled |
| buffer_flush_avg_time                       | buffer              | disabled |
| buffer_flush_background                     | buffer              | disabled |
| buffer_flush_background_pages               | buffer              | disabled |
| buffer_flush_background_total_pages         | buffer              | disabled |
| buffer_flush_batches                        | buffer              | disabled |
| buffer_flush_batch_num_scan                 | buffer              | disabled |
| buffer_flush_batch_pages                    | buffer              | disabled |
| buffer_flush_batch_scanned                  | buffer              | disabled |
| buffer_flush_batch_scanned_per_call         | buffer              | disabled |
| buffer_flush_batch_total_pages              | buffer              | disabled |
| buffer_flush_lsn_avg_rate                   | buffer              | disabled |
| buffer_flush_neighbor                       | buffer              | disabled |
| buffer_flush_neighbor_pages                 | buffer              | disabled |
| buffer_flush_neighbor_total_pages           | buffer              | disabled |
| buffer_flush_n_to_flush_by_age              | buffer              | disabled |
| buffer_flush_n_to_flush_by_dirty_page       | buffer              | disabled |
| buffer_flush_n_to_flush_requested           | buffer              | disabled |
| buffer_flush_pct_for_dirty                  | buffer              | disabled |
| buffer_flush_pct_for_lsn                    | buffer              | disabled |
| buffer_flush_sync                           | buffer              | disabled |
| buffer_flush_sync_pages                     | buffer              | disabled |
| buffer_flush_sync_total_pages               | buffer              | disabled |
| buffer_flush_sync_waits                     | buffer              | disabled |
| buffer_LRU_batches_evict                    | buffer              | disabled |
| buffer_LRU_batches_flush                    | buffer              | disabled |
| buffer_LRU_batch_evict_pages                | buffer              | disabled |
| buffer_LRU_batch_evict_total_pages          | buffer              | disabled |
| buffer_LRU_batch_flush_avg_pass             | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_est         | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_slot        | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_thread      | buffer              | disabled |
| buffer_LRU_batch_flush_pages                | buffer              | disabled |
| buffer_LRU_batch_flush_total_pages          | buffer              | disabled |
| buffer_LRU_batch_num_scan                   | buffer              | disabled |
| buffer_LRU_batch_scanned                    | buffer              | disabled |
| buffer_LRU_batch_scanned_per_call           | buffer              | disabled |
| buffer_LRU_get_free_loops                   | buffer              | disabled |
| buffer_LRU_get_free_search                  | Buffer              | disabled |
| buffer_LRU_get_free_waits                   | buffer              | disabled |
| buffer_LRU_search_num_scan                  | buffer              | disabled |
| buffer_LRU_search_scanned                   | buffer              | disabled |
| buffer_LRU_search_scanned_per_call          | buffer              | disabled |
| buffer_LRU_single_flush_failure_count       | Buffer              | disabled |
| buffer_LRU_single_flush_num_scan            | buffer              | disabled |
| buffer_LRU_single_flush_scanned             | buffer              | disabled |
| buffer_LRU_single_flush_scanned_per_call    | buffer              | disabled |
| buffer_LRU_unzip_search_num_scan            | buffer              | disabled |
| buffer_LRU_unzip_search_scanned             | buffer              | disabled |
| buffer_LRU_unzip_search_scanned_per_call    | buffer              | disabled |
| buffer_pages_created                        | buffer              | enabled  |
| buffer_pages_read                           | buffer              | enabled  |
| buffer_pages_written                        | buffer              | enabled  |
| buffer_page_read_blob                       | buffer_page_io      | disabled |
| buffer_page_read_fsp_hdr                    | buffer_page_io      | disabled |
| buffer_page_read_ibuf_bitmap                | buffer_page_io      | disabled |
| buffer_page_read_ibuf_free_list             | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_leaf            | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_non_leaf        | buffer_page_io      | disabled |
| buffer_page_read_index_inode                | buffer_page_io      | disabled |
| buffer_page_read_index_leaf                 | buffer_page_io      | disabled |
| buffer_page_read_index_non_leaf             | buffer_page_io      | disabled |
| buffer_page_read_other                      | buffer_page_io      | disabled |
| buffer_page_read_rseg_array                 | buffer_page_io      | disabled |
| buffer_page_read_system_page                | buffer_page_io      | disabled |
| buffer_page_read_trx_system                 | buffer_page_io      | disabled |
| buffer_page_read_undo_log                   | buffer_page_io      | disabled |
| buffer_page_read_xdes                       | buffer_page_io      | disabled |
| buffer_page_read_zblob                      | buffer_page_io      | disabled |
| buffer_page_read_zblob2                     | buffer_page_io      | disabled |
| buffer_page_written_blob                    | buffer_page_io      | disabled |
| buffer_page_written_fsp_hdr                 | buffer_page_io      | disabled |
| buffer_page_written_ibuf_bitmap             | buffer_page_io      | disabled |
| buffer_page_written_ibuf_free_list          | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_leaf         | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_non_leaf     | buffer_page_io      | disabled |
| buffer_page_written_index_inode             | buffer_page_io      | disabled |
| buffer_page_written_index_leaf              | buffer_page_io      | disabled |
| buffer_page_written_index_non_leaf          | buffer_page_io      | disabled |
| buffer_page_written_on_log_no_waits         | buffer_page_io      | disabled |
| buffer_page_written_on_log_waits            | buffer_page_io      | disabled |
| buffer_page_written_on_log_wait_loops       | buffer_page_io      | disabled |
| buffer_page_written_other                   | buffer_page_io      | disabled |
| buffer_page_written_rseg_array              | buffer_page_io      | disabled |
| buffer_page_written_system_page             | buffer_page_io      | disabled |
| buffer_page_written_trx_system              | buffer_page_io      | disabled |
| buffer_page_written_undo_log                | buffer_page_io      | disabled |
| buffer_page_written_xdes                    | buffer_page_io      | disabled |
| buffer_page_written_zblob                   | buffer_page_io      | disabled |
| buffer_page_written_zblob2                  | buffer_page_io      | disabled |
| buffer_pool_bytes_data                      | buffer              | enabled  |
| buffer_pool_bytes_dirty                     | buffer              | enabled  |
| buffer_pool_pages_data                      | buffer              | enabled  |
| buffer_pool_pages_dirty                     | buffer              | enabled  |
| buffer_pool_pages_free                      | buffer              | enabled  |
| buffer_pool_pages_misc                      | buffer              | enabled  |
| buffer_pool_pages_total                     | buffer              | enabled  |
| buffer_pool_reads                           | buffer              | enabled  |
| buffer_pool_read_ahead                      | buffer              | enabled  |
| buffer_pool_read_ahead_evicted              | buffer              | enabled  |
| buffer_pool_read_requests                   | buffer              | enabled  |
| buffer_pool_size                            | server              | enabled  |
| buffer_pool_wait_free                       | buffer              | enabled  |
| buffer_pool_write_requests                  | buffer              | enabled  |
| compression_pad_decrements                  | compression         | disabled |
| compression_pad_increments                  | compression         | disabled |
| compress_pages_compressed                   | compression         | disabled |
| compress_pages_decompressed                 | compression         | disabled |
| cpu_n                                       | cpu                 | disabled |
| cpu_stime_abs                               | cpu                 | disabled |
| cpu_stime_pct                               | cpu                 | disabled |
| cpu_utime_abs                               | cpu                 | disabled |
| cpu_utime_pct                               | cpu                 | disabled |
| dblwr_async_requests                        | dblwr               | disabled |
| dblwr_flush_requests                        | dblwr               | disabled |
| dblwr_flush_wait_events                     | dblwr               | disabled |
| dblwr_sync_requests                         | dblwr               | disabled |
| ddl_background_drop_tables                  | ddl                 | disabled |
| ddl_log_file_alter_table                    | ddl                 | disabled |
| ddl_online_create_index                     | ddl                 | disabled |
| ddl_pending_alter_table                     | ddl                 | disabled |
| ddl_sort_file_alter_table                   | ddl                 | disabled |
| dml_deletes                                 | dml                 | enabled  |
| dml_inserts                                 | dml                 | enabled  |
| dml_reads                                   | dml                 | disabled |
| dml_system_deletes                          | dml                 | enabled  |
| dml_system_inserts                          | dml                 | enabled  |
| dml_system_reads                            | dml                 | enabled  |
| dml_system_updates                          | dml                 | enabled  |
| dml_updates                                 | dml                 | enabled  |
| file_num_open_files                         | file_system         | enabled  |
| ibuf_merges                                 | change_buffer       | enabled  |
| ibuf_merges_delete                          | change_buffer       | enabled  |
| ibuf_merges_delete_mark                     | change_buffer       | enabled  |
| ibuf_merges_discard_delete                  | change_buffer       | enabled  |
| ibuf_merges_discard_delete_mark             | change_buffer       | enabled  |
| ibuf_merges_discard_insert                  | change_buffer       | enabled  |
| ibuf_merges_insert                          | change_buffer       | enabled  |
| ibuf_size                                   | change_buffer       | enabled  |
| icp_attempts                                | icp                 | disabled |
| icp_match                                   | icp                 | disabled |
| icp_no_match                                | icp                 | disabled |
| icp_out_of_range                            | icp                 | disabled |
| index_page_discards                         | index               | disabled |
| index_page_merge_attempts                   | index               | disabled |
| index_page_merge_successful                 | index               | disabled |
| index_page_reorg_attempts                   | index               | disabled |
| index_page_reorg_successful                 | index               | disabled |
| index_page_splits                           | index               | disabled |
| innodb_activity_count                       | server              | enabled  |
| innodb_background_drop_table_usec           | server              | disabled |
| innodb_dblwr_pages_written                  | server              | enabled  |
| innodb_dblwr_writes                         | server              | enabled  |
| innodb_dict_lru_count                       | server              | disabled |
| innodb_dict_lru_usec                        | server              | disabled |
| innodb_ibuf_merge_usec                      | server              | disabled |
| innodb_master_active_loops                  | server              | disabled |
| innodb_master_idle_loops                    | server              | disabled |
| innodb_master_purge_usec                    | server              | disabled |
| innodb_master_thread_sleeps                 | server              | disabled |
| innodb_mem_validate_usec                    | server              | disabled |
| innodb_page_size                            | server              | enabled  |
| innodb_rwlock_sx_os_waits                   | server              | enabled  |
| innodb_rwlock_sx_spin_rounds                | server              | enabled  |
| innodb_rwlock_sx_spin_waits                 | server              | enabled  |
| innodb_rwlock_s_os_waits                    | server              | enabled  |
| innodb_rwlock_s_spin_rounds                 | server              | enabled  |
| innodb_rwlock_s_spin_waits                  | server              | enabled  |
| innodb_rwlock_x_os_waits                    | server              | enabled  |
| innodb_rwlock_x_spin_rounds                 | server              | enabled  |
| innodb_rwlock_x_spin_waits                  | server              | enabled  |
| lock_deadlocks                              | lock                | enabled  |
| lock_deadlock_false_positives               | lock                | enabled  |
| lock_deadlock_rounds                        | lock                | enabled  |
| lock_rec_grant_attempts                     | lock                | enabled  |
| lock_rec_locks                              | lock                | disabled |
| lock_rec_lock_created                       | lock                | disabled |
| lock_rec_lock_removed                       | lock                | disabled |
| lock_rec_lock_requests                      | lock                | disabled |
| lock_rec_lock_waits                         | lock                | disabled |
| lock_rec_release_attempts                   | lock                | enabled  |
| lock_row_lock_current_waits                 | lock                | enabled  |
| lock_row_lock_time                          | lock                | enabled  |
| lock_row_lock_time_avg                      | lock                | enabled  |
| lock_row_lock_time_max                      | lock                | enabled  |
| lock_row_lock_waits                         | lock                | enabled  |
| lock_schedule_refreshes                     | lock                | enabled  |
| lock_table_locks                            | lock                | disabled |
| lock_table_lock_created                     | lock                | disabled |
| lock_table_lock_removed                     | lock                | disabled |
| lock_table_lock_waits                       | lock                | disabled |
| lock_threads_waiting                        | lock                | enabled  |
| lock_timeouts                               | lock                | enabled  |
| log_checkpoints                             | log                 | disabled |
| log_concurrency_margin                      | log                 | disabled |
| log_flusher_no_waits                        | log                 | disabled |
| log_flusher_waits                           | log                 | disabled |
| log_flusher_wait_loops                      | log                 | disabled |
| log_flush_avg_time                          | log                 | disabled |
| log_flush_lsn_avg_rate                      | log                 | disabled |
| log_flush_max_time                          | log                 | disabled |
| log_flush_notifier_no_waits                 | log                 | disabled |
| log_flush_notifier_waits                    | log                 | disabled |
| log_flush_notifier_wait_loops               | log                 | disabled |
| log_flush_total_time                        | log                 | disabled |
| log_free_space                              | log                 | disabled |
| log_full_block_writes                       | log                 | disabled |
| log_lsn_archived                            | log                 | disabled |
| log_lsn_buf_dirty_pages_added               | log                 | disabled |
| log_lsn_buf_pool_oldest_approx              | log                 | disabled |
| log_lsn_buf_pool_oldest_lwm                 | log                 | disabled |
| log_lsn_checkpoint_age                      | log                 | disabled |
| log_lsn_current                             | log                 | disabled |
| log_lsn_last_checkpoint                     | log                 | disabled |
| log_lsn_last_flush                          | log                 | disabled |
| log_max_modified_age_async                  | log                 | disabled |
| log_max_modified_age_sync                   | log                 | disabled |
| log_next_file                               | log                 | disabled |
| log_on_buffer_space_no_waits                | log                 | disabled |
| log_on_buffer_space_waits                   | log                 | disabled |
| log_on_buffer_space_wait_loops              | log                 | disabled |
| log_on_file_space_no_waits                  | log                 | disabled |
| log_on_file_space_waits                     | log                 | disabled |
| log_on_file_space_wait_loops                | log                 | disabled |
| log_on_flush_no_waits                       | log                 | disabled |
| log_on_flush_waits                          | log                 | disabled |
| log_on_flush_wait_loops                     | log                 | disabled |
| log_on_recent_closed_wait_loops             | log                 | disabled |
| log_on_recent_written_wait_loops            | log                 | disabled |
| log_on_write_no_waits                       | log                 | disabled |
| log_on_write_waits                          | log                 | disabled |
| log_on_write_wait_loops                     | log                 | disabled |
| log_padded                                  | log                 | disabled |
| log_partial_block_writes                    | log                 | disabled |
| log_waits                                   | log                 | enabled  |
| log_writer_no_waits                         | log                 | disabled |
| log_writer_on_archiver_waits                | log                 | disabled |
| log_writer_on_file_space_waits              | log                 | disabled |
| log_writer_waits                            | log                 | disabled |
| log_writer_wait_loops                       | log                 | disabled |
| log_writes                                  | log                 | enabled  |
| log_write_notifier_no_waits                 | log                 | disabled |
| log_write_notifier_waits                    | log                 | disabled |
| log_write_notifier_wait_loops               | log                 | disabled |
| log_write_requests                          | log                 | enabled  |
| log_write_to_file_requests_interval         | log                 | disabled |
| metadata_table_handles_closed               | metadata            | disabled |
| metadata_table_handles_opened               | metadata            | disabled |
| metadata_table_reference_count              | metadata            | disabled |
| module_cpu                                  | cpu                 | disabled |
| module_dblwr                                | dblwr               | disabled |
| module_page_track                           | page_track          | disabled |
| os_data_fsyncs                              | os                  | enabled  |
| os_data_reads                               | os                  | enabled  |
| os_data_writes                              | os                  | enabled  |
| os_log_bytes_written                        | os                  | enabled  |
| os_log_fsyncs                               | os                  | enabled  |
| os_log_pending_fsyncs                       | os                  | enabled  |
| os_log_pending_writes                       | os                  | enabled  |
| os_pending_reads                            | os                  | disabled |
| os_pending_writes                           | os                  | disabled |
| page_track_checkpoint_partial_flush_request | page_track          | disabled |
| page_track_full_block_writes                | page_track          | disabled |
| page_track_partial_block_writes             | page_track          | disabled |
| page_track_resets                           | page_track          | disabled |
| purge_del_mark_records                      | purge               | disabled |
| purge_dml_delay_usec                        | purge               | disabled |
| purge_invoked                               | purge               | disabled |
| purge_resume_count                          | purge               | disabled |
| purge_stop_count                            | purge               | disabled |
| purge_truncate_history_count                | purge               | disabled |
| purge_truncate_history_usec                 | purge               | disabled |
| purge_undo_log_pages                        | purge               | disabled |
| purge_upd_exist_or_extern_records           | purge               | disabled |
| sampled_pages_read                          | sampling            | disabled |
| sampled_pages_skipped                       | sampling            | disabled |
| trx_active_transactions                     | transaction         | disabled |
| trx_allocations                             | transaction         | disabled |
| trx_commits_insert_update                   | transaction         | disabled |
| trx_nl_ro_commits                           | transaction         | disabled |
| trx_on_log_no_waits                         | transaction         | disabled |
| trx_on_log_waits                            | transaction         | disabled |
| trx_on_log_wait_loops                       | transaction         | disabled |
| trx_rollbacks                               | transaction         | disabled |
| trx_rollbacks_savepoint                     | transaction         | disabled |
| trx_rollback_active                         | transaction         | disabled |
| trx_ro_commits                              | transaction         | disabled |
| trx_rseg_current_size                       | transaction         | disabled |
| trx_rseg_history_len                        | transaction         | enabled  |
| trx_rw_commits                              | transaction         | disabled |
| trx_undo_slots_cached                       | transaction         | disabled |
| trx_undo_slots_used                         | transaction         | disabled |
| undo_truncate_count                         | undo                | disabled |
| undo_truncate_done_logging_count            | undo                | disabled |
| undo_truncate_start_logging_count           | undo                | disabled |
| undo_truncate_usec                          | undo                | disabled |
+---------------------------------------------+---------------------+----------+
314 rows in set (0.00 sec)
```

#### Counter Modules

Each counter is associated with a particular module. Module names can be used to enable, disable, or reset all counters for a particular subsystem. For example, use `module_dml` to enable all counters associated with the `dml` subsystem.

```
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

Module names can be used with `innodb_monitor_enable` and related variables.

Module names and corresponding `SUBSYSTEM` names are listed below.

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

* `module_log` (subsystem = `log`)

* `module_metadata` (subsystem = `metadata`)

* `module_os` (subsystem = `os`)

* `module_purge` (subsystem = `purge`)

* `module_trx` (subsystem = `transaction`)

* `module_undo` (subsystem = `undo`)

**Example 17.11 Working with INNODB_METRICS Table Counters**

This example demonstrates enabling, disabling, and resetting a counter, and querying counter data in the `INNODB_METRICS` table.

1. Create a simple `InnoDB` table:

   ```
   mysql> USE test;
   Database changed

   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   Query OK, 0 rows affected (0.02 sec)
   ```

2. Enable the `dml_inserts` counter.

   ```
   mysql> SET GLOBAL innodb_monitor_enable = dml_inserts;
   Query OK, 0 rows affected (0.01 sec)
   ```

   A description of the `dml_inserts` counter can be found in the `COMMENT` column of the `INNODB_METRICS` table:

   ```
   mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts";
   +-------------+-------------------------+
   | NAME        | COMMENT                 |
   +-------------+-------------------------+
   | dml_inserts | Number of rows inserted |
   +-------------+-------------------------+
   ```

3. Query the `INNODB_METRICS` table for the `dml_inserts` counter data. Because no DML operations have been performed, the counter values are zero or NULL. The `TIME_ENABLED` and `TIME_ELAPSED` values indicate when the counter was last enabled and how many seconds have elapsed since that time.

   ```
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

4. Insert three rows of data into the table.

   ```
   mysql> INSERT INTO t1 values(1);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(2);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(3);
   Query OK, 1 row affected (0.00 sec)
   ```

5. Query the `INNODB_METRICS` table again for the `dml_inserts` counter data. A number of counter values have now incremented including `COUNT`, `MAX_COUNT`, `AVG_COUNT`, and `COUNT_RESET`. Refer to the `INNODB_METRICS` table definition for descriptions of these values.

   ```
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

6. Reset the `dml_inserts` counter and query the `INNODB_METRICS` table again for the `dml_inserts` counter data. The `%_RESET` values that were reported previously, such as `COUNT_RESET` and `MAX_RESET`, are set back to zero. Values such as `COUNT`, `MAX_COUNT`, and `AVG_COUNT`, which cumulatively collect data from the time the counter is enabled, are unaffected by the reset.

   ```
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

7. To reset all counter values, you must first disable the counter. Disabling the counter sets the `STATUS` value to `disabled`.

   ```
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

   Note

   Wildcard match is supported for counter and module names. For example, instead of specifying the full `dml_inserts` counter name, you can specify `dml_i%`. You can also enable, disable, or reset multiple counters or modules at once using a wildcard match. For example, specify `dml_%` to enable, disable, or reset all counters that begin with `dml_`.

8. After the counter is disabled, you can reset all counter values using the `innodb_monitor_reset_all` option. All values are set to zero or NULL.

   ```
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
