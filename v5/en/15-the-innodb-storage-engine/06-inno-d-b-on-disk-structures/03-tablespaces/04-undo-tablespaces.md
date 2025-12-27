#### 14.6.3.4 Undo Tablespaces

Undo tablespaces contain undo logs, which are collections of records containing information about how to undo the latest change by a transaction to a clustered index record.

Undo logs are stored in the system tablespace by default but can be stored in one or more undo tablespaces instead. Using undo tablespaces can reducing the amount of space required for undo logs in any one tablespace. The I/O patterns for undo logs also make undo tablespaces good candidates for SSD storage.

The number of undo tablespaces used by `InnoDB` is controlled by the `innodb_undo_tablespaces` option. This option can only be configured when initializing the MySQL instance. It cannot be changed afterward.

Note

The `innodb_undo_tablespaces` option is deprecated; expect it to be removed in a future release.

Undo tablespaces and individual segments inside those tablespaces cannot be dropped. However, undo logs stored in undo tablespaces can be truncated. For more information, see Truncating Undo Tablespaces.

##### Configuring Undo Tablespaces

This procedure describes how to configure undo tablespaces. When undo tablespaces are configured, undo logs are stored in the undo tablespaces instead of the system tablespace.

The number of undo tablespaces can only be configured when initializing a MySQL instance and is fixed for the life of the instance, so it is recommended that you perform the following procedure on a test instance with a representative workload before deploying the configuration to a production system.

To configure undo tablespaces:

1. Specify a directory location for undo tablespaces using the `innodb_undo_directory` variable. If a directory location is not specified, undo tablespaces are created in the data directory.

2. Define the number of rollback segments using the `innodb_rollback_segments` variable. Start with a relatively low value and increase it incrementally over time to examine the effect on performance. The default setting for `innodb_rollback_segments` is 128, which is also the maximum value.

   One rollback segment is always assigned to the system tablespace, and 32 rollback segments are reserved for the temporary tablespace (`ibtmp1`). Therefore, to allocate rollback segments to undo tablespaces, set `innodb_rollback_segments` to a value greater than 33. For example, if you have two undo tablespaces, set `innodb_rollback_segments` to 35 to assign one rollback segment to each of the two undo tablespaces. Rollback segments are distributed among undo tablespaces in a circular fashion.

   When you add undo tablespaces, the rollback segment in the system tablespace is rendered inactive.

3. Define the number of undo tablespaces using the `innodb_undo_tablespaces` option. The specified number of undo tablespaces is fixed for the life of the MySQL instance, so if you are uncertain about an optimal value, estimate on the high side.

4. Create a new MySQL test instance using the configuration settings you have chosen.

5. Use a realistic workload on your test instance with data volume similar to your production servers to test the configuration.

6. Benchmark the performance of I/O intensive workloads.
7. Periodically increase the value of `innodb_rollback_segments` and rerun performance tests until there are no further improvements in I/O performance.

##### Truncating Undo Tablespaces

Truncating undo tablespaces requires that the MySQL instance have a minimum of two active undo tablespaces, which ensures that one undo tablespace remains active while the other is taken offline to be truncated. The number of undo tablespaces is defined by the `innodb_undo_tablespaces` variable. The default value is 0. Use this statement to check the value of `innodb_undo_tablespaces`:

```sql
mysql> SELECT @@innodb_undo_tablespaces;
+---------------------------+
| @@innodb_undo_tablespaces |
+---------------------------+
|                         2 |
+---------------------------+
```

To have undo tablespaces truncated, enable the `innodb_undo_log_truncate` variable. For example:

```sql
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

When the `innodb_undo_log_truncate` variable is enabled, undo tablespaces that exceed the size limit defined by the `innodb_max_undo_log_size` variable are subject to truncation. The `innodb_max_undo_log_size` variable is dynamic and has a default value of 1073741824 bytes (1024 MiB).

```sql
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

When the `innodb_undo_log_truncate` variable is enabled:

1. Undo tablespaces that exceed the `innodb_max_undo_log_size` setting are marked for truncation. Selection of an undo tablespace for truncation is performed in a circular fashion to avoid truncating the same undo tablespace each time.

2. Rollback segments residing in the selected undo tablespace are made inactive so that they are not assigned to new transactions. Existing transactions that are currently using rollback segments are permitted to finish.

3. The purge system empties rollback segments by freeing undo logs that are no longer in use.

4. After all rollback segments in the undo tablespace are freed, the truncate operation runs and truncates the undo tablespace to its initial size. The initial size of an undo tablespace depends on the `innodb_page_size` value. For the default 16KB page size, the initial undo tablespace file size is 10MiB. For 4KB, 8KB, 32KB, and 64KB page sizes, the initial undo tablespace files sizes are 7MiB, 8MiB, 20MiB, and 40MiB, respectively.

   The size of an undo tablespace after a truncate operation may be larger than the initial size due to immediate use following the completion of the operation.

   The `innodb_undo_directory` variable defines the location of undo tablespace files. If the `innodb_undo_directory` variable is undefined, undo tablespaces reside in the data directory.

5. Rollback segments are reactivated so that they can be assigned to new transactions.

###### Expediting Truncation of Undo Tablespaces

The purge thread is responsible for emptying and truncating undo tablespaces. By default, the purge thread looks for undo tablespaces to truncate once every 128 times that purge is invoked. The frequency with which the purge thread looks for undo tablespaces to truncate is controlled by the `innodb_purge_rseg_truncate_frequency` variable, which has a default setting of 128.

```sql
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

To increase the frequency, decrease the `innodb_purge_rseg_truncate_frequency` setting. For example, to have the purge thread look for undo tabespaces once every 32 timees that purge is invoked, set `innodb_purge_rseg_truncate_frequency` to 32.

```sql
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

When the purge thread finds an undo tablespace that requires truncation, the purge thread returns with increased frequency to quickly empty and truncate the undo tablespace.

###### Performance Impact of Truncating Undo Tablespace Files

When an undo tablespace is truncated, the rollback segments in the undo tablespace are deactivated. The active rollback segments in other undo tablespaces assume responsibility for the entire system load, which may result in a slight performance degradation. The extent to which performance is affected depends on a number of factors:

* Number of undo tablespaces
* Number of undo logs
* Undo tablespace size
* Speed of the I/O susbsystem
* Existing long running transactions
* System load

The easiest way to avoid the potential performance impact is to increase the number of undo tablespaces.

Also, two checkpoint operations are performed during an undo tablespace truncate operation. The first checkpoint operation removes the old undo tablespace pages from the buffer pool. The second checkpoint flushes the initial pages of the new undo tablespace to disk. On a busy system, the first checkpoint in particular can temporarily affect system performance if there is a large number of pages to remove.

###### Undo Tablespace Truncation Recovery

An undo tablespace truncate operation creates a temporary `undo_space_number_trunc.log` file in the server log directory. That log directory is defined by `innodb_log_group_home_dir`. If a system failure occurs during the truncate operation, the temporary log file permits the startup process to identify undo tablespaces that were being truncated and to continue the operation.
