### 17.6.5 Redo Log

The redo log is a disk-based data structure used during crash recovery to correct data written by incomplete transactions. During normal operations, the redo log encodes requests to change table data that result from SQL statements or low-level API calls. Modifications that did not finish updating data files before an unexpected shutdown are replayed automatically during initialization and before connections are accepted. For information about the role of the redo log in crash recovery, see Section 17.18.2, “InnoDB Recovery”.

The redo log is physically represented on disk by redo log files. Data that is written to redo log files is encoded in terms of records affected, and this data is collectively referred to as redo. The passage of data through redo log files is represented by an ever-increasing LSN value. Redo log data is appended as data modifications occur, and the oldest data is truncated as the checkpoint progresses.

Information and procedures related to redo logs are described under the following topics in the section:

* Configuring Redo Log Capacity
* Automatic Redo Log Capacity Configuration
* Redo Log Archiving
* Disabling Redo Logging
* Related Topics

#### Configuring Redo Log Capacity

The `innodb_redo_log_capacity` system variable controls the amount of disk space occupied by redo log files. You can set this variable in an option file at startup or at runtime using a `SET GLOBAL` statement; for example, the following statement sets the redo log capacity to 8GB:

```
SET GLOBAL innodb_redo_log_capacity = 8589934592;
```

When set at runtime, the configuration change occurs immediately but it may take some time for the new limit to be fully implemented. If the redo log files occupy less space than the specified value, dirty pages are flushed from the buffer pool to tablespace data files less aggressively, eventually increasing the disk space occupied by the redo log files. If the redo log files occupy more space than the specified value, dirty pages are flushed more aggressively, eventually decreasing the disk space occupied by redo log files.

The `Innodb_redo_log_capacity_resized` server status variable indicates the total redo log capacity for all redo log files.

Redo log files reside in the `#innodb_redo` directory in the data directory unless a different directory was specified by the `innodb_log_group_home_dir` variable. If `innodb_log_group_home_dir` was defined, the redo log files reside in the `#innodb_redo` directory in that directory. There are two types of redo log files, ordinary and spare. Ordinary redo log files are those being used. Spare redo log files are those waiting to be used. `InnoDB` tries to maintain 32 redo log files in total, with each file equal in size to 1/32 \* `innodb_redo_log_capacity`; however, file sizes may differ for a time after modifying the `innodb_redo_log_capacity` setting.

Redo log files use an `#ib_redoN` naming convention, where *`N`* is the redo log file number. Spare redo log files are denoted by a `_tmp` suffix. The following example shows the redo log files in an `#innodb_redo` directory, where there are 21 active redo log files and 11 spare redo log files, numbered sequentially.

```
'#ib_redo582'  '#ib_redo590'  '#ib_redo598'      '#ib_redo606_tmp'
'#ib_redo583'  '#ib_redo591'  '#ib_redo599'      '#ib_redo607_tmp'
'#ib_redo584'  '#ib_redo592'  '#ib_redo600'      '#ib_redo608_tmp'
'#ib_redo585'  '#ib_redo593'  '#ib_redo601'      '#ib_redo609_tmp'
'#ib_redo586'  '#ib_redo594'  '#ib_redo602'      '#ib_redo610_tmp'
'#ib_redo587'  '#ib_redo595'  '#ib_redo603_tmp'  '#ib_redo611_tmp'
'#ib_redo588'  '#ib_redo596'  '#ib_redo604_tmp'  '#ib_redo612_tmp'
'#ib_redo589'  '#ib_redo597'  '#ib_redo605_tmp'  '#ib_redo613_tmp'
```

Each ordinary redo log file is associated with a particular range of LSN values; for example, the following query shows the `START_LSN` and `END_LSN` values for the active redo log files listed in the previous example:

```
mysql> SELECT FILE_NAME, START_LSN, END_LSN FROM performance_schema.innodb_redo_log_files;
+----------------------------+--------------+--------------+
| FILE_NAME                  | START_LSN    | END_LSN      |
+----------------------------+--------------+--------------+
| ./#innodb_redo/#ib_redo582 | 117654982144 | 117658256896 |
| ./#innodb_redo/#ib_redo583 | 117658256896 | 117661531648 |
| ./#innodb_redo/#ib_redo584 | 117661531648 | 117664806400 |
| ./#innodb_redo/#ib_redo585 | 117664806400 | 117668081152 |
| ./#innodb_redo/#ib_redo586 | 117668081152 | 117671355904 |
| ./#innodb_redo/#ib_redo587 | 117671355904 | 117674630656 |
| ./#innodb_redo/#ib_redo588 | 117674630656 | 117677905408 |
| ./#innodb_redo/#ib_redo589 | 117677905408 | 117681180160 |
| ./#innodb_redo/#ib_redo590 | 117681180160 | 117684454912 |
| ./#innodb_redo/#ib_redo591 | 117684454912 | 117687729664 |
| ./#innodb_redo/#ib_redo592 | 117687729664 | 117691004416 |
| ./#innodb_redo/#ib_redo593 | 117691004416 | 117694279168 |
| ./#innodb_redo/#ib_redo594 | 117694279168 | 117697553920 |
| ./#innodb_redo/#ib_redo595 | 117697553920 | 117700828672 |
| ./#innodb_redo/#ib_redo596 | 117700828672 | 117704103424 |
| ./#innodb_redo/#ib_redo597 | 117704103424 | 117707378176 |
| ./#innodb_redo/#ib_redo598 | 117707378176 | 117710652928 |
| ./#innodb_redo/#ib_redo599 | 117710652928 | 117713927680 |
| ./#innodb_redo/#ib_redo600 | 117713927680 | 117717202432 |
| ./#innodb_redo/#ib_redo601 | 117717202432 | 117720477184 |
| ./#innodb_redo/#ib_redo602 | 117720477184 | 117723751936 |
+----------------------------+--------------+--------------+
```

When doing a checkpoint, `InnoDB` stores the checkpoint LSN in the header of the file which contains this LSN. During recovery, all redo log files are checked and recovery starts at the latest checkpoint LSN.

Several status variables are provided for monitoring the redo log and redo log capacity resize operations; for example, you can query `Innodb_redo_log_resize_status` to view the status of a resize operation:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_resize_status';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_redo_log_resize_status | OK    |
+-------------------------------+-------+
```

The `Innodb_redo_log_capacity_resized` status variable shows the current redo log capacity limit:

```
mysql> SHOW STATUS LIKE 'Innodb_redo_log_capacity_resized';
 +----------------------------------+-----------+
| Variable_name                    | Value     |
+----------------------------------+-----------+
| Innodb_redo_log_capacity_resized | 104857600 |
+----------------------------------+-----------+
```

Other applicable status variables include:

* `Innodb_redo_log_checkpoint_lsn`
* `Innodb_redo_log_current_lsn`
* `Innodb_redo_log_flushed_to_disk_lsn`
* `Innodb_redo_log_logical_size`
* `Innodb_redo_log_physical_size`
* `Innodb_redo_log_read_only`
* `Innodb_redo_log_uuid`

Refer to the status variable descriptions for more information.

You can view information about active redo log files by querying the `innodb_redo_log_files` Performance Schema table. The following query retrieves data from all of the table's columns:

```
SELECT FILE_ID, START_LSN, END_LSN, SIZE_IN_BYTES, IS_FULL, CONSUMER_LEVEL
FROM performance_schema.innodb_redo_log_files;
```

#### Automatic Redo Log Capacity Configuration

When the server is started with `--innodb-dedicated-server`, `InnoDB` automatically calculates and the sets the values for certain `InnoDB` parameters, including redo log capacity. Automated configuration is intended for MySQL instances that reside on a server dedicated to MySQL, where the MySQL server can use all available system resources. For more information, see Section 17.8.13, “Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server”.

#### Redo Log Archiving

Backup utilities that copy redo log records may sometimes fail to keep pace with redo log generation while a backup operation is in progress, resulting in lost redo log records due to those records being overwritten. This issue most often occurs when there is significant MySQL server activity during the backup operation, and the redo log file storage media operates at a faster speed than the backup storage media. The redo log archiving feature addresses this issue by sequentially writing redo log records to an archive file in addition to the redo log files. Backup utilities can copy redo log records from the archive file as necessary, thereby avoiding the potential loss of data.

If redo log archiving is configured on the server, MySQL Enterprise Backup, available with [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/), uses the redo log archiving feature when backing up a MySQL server.

Enabling redo log archiving on the server requires setting a value for the `innodb_redo_log_archive_dirs` system variable. The value is specified as a semicolon-separated list of labeled redo log archive directories. The `label:directory` pair is separated by a colon (`:`). For example:

```
mysql> SET GLOBAL innodb_redo_log_archive_dirs='label1:directory_path1[;label2:directory_path2;…]';
```

The *`label`* is an arbitrary identifier for the archive directory. It can be any string of characters, with the exception of colons (:), which are not permitted. An empty label is also permitted, but the colon (:) is still required in this case. A *`directory_path`* must be specified. The directory selected for the redo log archive file must exist when redo log archiving is activated, or an error is returned. The path can contain colons (':'), but semicolons (;) are not permitted.

The `innodb_redo_log_archive_dirs` variable must be configured before redo log archiving can be activated. The default value is `NULL`, which does not permit activating redo log archiving.

Notes

The archive directories that you specify must satisfy the following requirements. (The requirements are enforced when redo log archiving is activated.):

* Directories must exist. Directories are not created by the redo log archive process. Otherwise, the following error is returned:

  ERROR 3844 (HY000): Redo log archive directory '*`directory_path1`*' does not exist or is not a directory

* Directories must not be world-accessible. This is to prevent the redo log data from being exposed to unauthorized users on the system. Otherwise, the following error is returned:

  ERROR 3846 (HY000): Redo log archive directory '*`directory_path1`*' is accessible to all OS users

* Directories cannot be those defined by `datadir`, `innodb_data_home_dir`, `innodb_directories`, `innodb_log_group_home_dir`, `innodb_temp_tablespaces_dir`, `innodb_tmpdir` `innodb_undo_directory`, or `secure_file_priv`, nor can they be parent directories or subdirectories of those directories. Otherwise, an error similar to the following is returned:

  ERROR 3845 (HY000): Redo log archive directory '*`directory_path1`*' is in, under, or over server directory 'datadir' - '*`/path/to/data_directory`*'

When a backup utility that supports redo log archiving initiates a backup, the backup utility activates redo log archiving by invoking the `innodb_redo_log_archive_start()` function.

If you are not using a backup utility that supports redo log archiving, redo log archiving can also be activated manually, as shown:

```
mysql> SELECT innodb_redo_log_archive_start('label', 'subdir');
+------------------------------------------+
| innodb_redo_log_archive_start('label') |
+------------------------------------------+
| 0                                        |
+------------------------------------------+
```

Or:

```
mysql> DO innodb_redo_log_archive_start('label', 'subdir');
Query OK, 0 rows affected (0.09 sec)
```

Note

The MySQL session that activates redo log archiving (using `innodb_redo_log_archive_start()`) must remain open for the duration of the archiving. The same session must deactivate redo log archiving (using `innodb_redo_log_archive_stop()`). If the session is terminated before the redo log archiving is explicitly deactivated, the server deactivates redo log archiving implicitly and removes the redo log archive file.

where *`label`* is a label defined by `innodb_redo_log_archive_dirs`; `subdir` is an optional argument for specifying a subdirectory of the directory identified by *`label`* for saving the archive file; it must be a simple directory name (no slash (/), backslash (\), or colon (:) is permitted). `subdir` can be empty, null, or it can be left out.

Only users with the `INNODB_REDO_LOG_ARCHIVE` privilege can activate redo log archiving by invoking `innodb_redo_log_archive_start()`, or deactivate it using `innodb_redo_log_archive_stop()`. The MySQL user running the backup utility or the MySQL user activating and deactivating redo log archiving manually must have this privilege.

The redo log archive file path is `directory_identified_by_label/[subdir/]archive.serverUUID.000001.log`, where `directory_identified_by_label` is the archive directory identified by the `label` argument for `innodb_redo_log_archive_start()`. `subdir` is the optional argument used for `innodb_redo_log_archive_start()`.

For example, the full path and name for a redo log archive file appears similar to the following:

```
/directory_path/subdirectory/archive.e71a47dc-61f8-11e9-a3cb-080027154b4d.000001.log
```

After the backup utility finishes copying `InnoDB` data files, it deactivates redo log archiving by calling the `innodb_redo_log_archive_stop()` function.

If you are not using a backup utility that supports redo log archiving, redo log archiving can also be deactivated manually, as shown:

```
mysql> SELECT innodb_redo_log_archive_stop();
+--------------------------------+
| innodb_redo_log_archive_stop() |
+--------------------------------+
| 0                              |
+--------------------------------+
```

Or:

```
mysql> DO innodb_redo_log_archive_stop();
Query OK, 0 rows affected (0.01 sec)
```

After the stop function completes successfully, the backup utility looks for the relevant section of redo log data from the archive file and copies it into the backup.

After the backup utility finishes copying the redo log data and no longer needs the redo log archive file, it deletes the archive file.

Removal of the archive file is the responsibility of the backup utility in normal situations. However, if the redo log archiving operation quits unexpectedly before `innodb_redo_log_archive_stop()` is called, the MySQL server removes the file.

##### Performance Considerations

Activating redo log archiving typically has a minor performance cost due to the additional write activity.

On Unix and Unix-like operating systems, the performance impact is typically minor, assuming there is not a sustained high rate of updates. On Windows, the performance impact is typically a bit higher, assuming the same.

If there is a sustained high rate of updates and the redo log archive file is on the same storage media as the redo log files, the performance impact may be more significant due to compounded write activity.

If there is a sustained high rate of updates and the redo log archive file is on slower storage media than the redo log files, performance is impacted arbitrarily.

Writing to the redo log archive file does not impede normal transactional logging except in the case that the redo log archive file storage media operates at a much slower rate than the redo log file storage media, and there is a large backlog of persisted redo log blocks waiting to be written to the redo log archive file. In this case, the transactional logging rate is reduced to a level that can be managed by the slower storage media where the redo log archive file resides.

#### Disabling Redo Logging

You can disable redo logging using the `ALTER INSTANCE DISABLE INNODB REDO_LOG` statement. This functionality is intended for loading data into a new MySQL instance. Disabling redo logging speeds up data loading by avoiding redo log writes and doublewrite buffering.

Warning

This feature is intended only for loading data into a new MySQL instance. *Do not disable redo logging on a production system.* It is permitted to shutdown and restart the server while redo logging is disabled, but an unexpected server stoppage while redo logging is disabled can cause data loss and instance corruption.

Attempting to restart the server after an unexpected server stoppage while redo logging is disabled is refused with the following error:

```
[ERROR] [MY-013598] [InnoDB] Server was killed when Innodb Redo
logging was disabled. Data files could be corrupt. You can try
to restart the database with innodb_force_recovery=6
```

In this case, initialize a new MySQL instance and start the data loading procedure again.

The `INNODB_REDO_LOG_ENABLE` privilege is required to enable and disable redo logging.

The `Innodb_redo_log_enabled` status variable permits monitoring redo logging status.

Cloning operations and redo log archiving are not permitted while redo logging is disabled and vice versa.

An `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG` operation requires an exclusive backup metadata lock, which prevents other `ALTER INSTANCE` operations from executing concurrently. Other `ALTER INSTANCE` operations must wait for the lock to be released before executing.

The following procedure demonstrates how to disable redo logging when loading data into a new MySQL instance.

1. On the new MySQL instance, grant the `INNODB_REDO_LOG_ENABLE` privilege to the user account responsible for disabling redo logging.

   ```
   mysql> GRANT INNODB_REDO_LOG_ENABLE ON *.* to 'data_load_admin';
   ```

2. As the `data_load_admin` user, disable redo logging:

   ```
   mysql> ALTER INSTANCE DISABLE INNODB REDO_LOG;
   ```

3. Check the `Innodb_redo_log_enabled` status variable to ensure that redo logging is disabled.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | OFF   |
   +-------------------------+-------+
   ```

4. Run the data load operation.
5. As the `data_load_admin` user, enable redo logging after the data load operation finishes:

   ```
   mysql> ALTER INSTANCE ENABLE INNODB REDO_LOG;
   ```

6. Check the `Innodb_redo_log_enabled` status variable to ensure that redo logging is enabled.

   ```
   mysql> SHOW GLOBAL STATUS LIKE 'Innodb_redo_log_enabled';
   +-------------------------+-------+
   | Variable_name           | Value |
   +-------------------------+-------+
   | Innodb_redo_log_enabled | ON    |
   +-------------------------+-------+
   ```

#### Related Topics

* Redo Log Configuration
* Section 10.5.4, “Optimizing InnoDB Redo Logging”
* Redo Log Encryption
