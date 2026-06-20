## 9.5 Point-in-Time (Incremental) Recovery

Point-in-time recovery refers to recovery of data changes up to a given point in time. Typically, this type of recovery is performed after restoring a full backup that brings the server to its state as of the time the backup was made. (The full backup can be made in several ways, such as those listed in Section 9.2, “Database Backup Methods”.) Point-in-time recovery then brings the server up to date incrementally from the time of the full backup to a more recent time.


### 9.5.1 Point-in-Time Recovery Using Binary Log

This section explains the general idea of using the binary log to perform a point-in-time-recovery. The next section, Section 9.5.2, “Point-in-Time Recovery Using Event Positions”, explains the operation in details with an example.

Note

Many of the examples in this and the next section use the **mysql** client to process binary log output produced by **mysqlbinlog**. If your binary log contains `\0` (null) characters, that output cannot be parsed by **mysql** unless you invoke it with the `--binary-mode` option.

The source of information for point-in-time recovery is the set of binary log files generated subsequent to the full backup operation. Therefore, to allow a server to be restored to a point-in-time, binary logging must be enabled on it, which is the default setting for MySQL 8.0 (see Section 7.4.4, “The Binary Log”).

To restore data from the binary log, you must know the name and location of the current binary log files. By default, the server creates binary log files in the data directory, but a path name can be specified with the `--log-bin` option to place the files in a different location. To see a listing of all binary log files, use this statement:

```
mysql> SHOW BINARY LOGS;
```

To determine the name of the current binary log file, issue the following statement:

```
mysql> SHOW MASTER STATUS;
```

The **mysqlbinlog** utility converts the events in the binary log files from binary format to text so that they can be viewed or applied. **mysqlbinlog** has options for selecting sections of the binary log based on event times or position of events within the log. See Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”.

Applying events from the binary log causes the data modifications they represent to be reexecuted. This enables recovery of data changes for a given span of time. To apply events from the binary log, process **mysqlbinlog** output using the **mysql** client:

```
$> mysqlbinlog binlog_files | mysql -u root -p
```

If binary log files have been encrypted, which can be done from MySQL 8.0.14 onwards, **mysqlbinlog** cannot read them directly as in the above example, but can read them from the server using the `--read-from-remote-server` (`-R`) option. For example:

```
$> mysqlbinlog --read-from-remote-server --host=host_name --port=3306  --user=root --password --ssl-mode=required  binlog_files | mysql -u root -p
```

Here, the option `--ssl-mode=required` has been used to ensure that the data from the binary log files is protected in transit, because it is sent to **mysqlbinlog** in an unencrypted format.

Important

`VERIFY_CA` and `VERIFY_IDENTITY` are better choices than `REQUIRED` for the SSL mode, because they help prevent man-in-the-middle attacks. To implement one of these settings, you must first ensure that the CA certificate for the server is reliably available to all the clients that use it in your environment, otherwise availability issues will result. See Command Options for Encrypted Connections.

Viewing log contents can be useful when you need to determine event times or positions to select partial log contents prior to executing events. To view events from the log, send **mysqlbinlog** output into a paging program:

```
$> mysqlbinlog binlog_files | more
```

Alternatively, save the output in a file and view the file in a text editor:

```
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

After editing the file, apply the contents as follows:

```
$> mysql -u root -p < tmpfile
```

If you have more than one binary log to apply on the MySQL server, use a single connection to apply the contents of all binary log files that you want to process. Here is one way to do so:

```
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Another approach is to write the whole log to a single file and then process the file:

```
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```


### 9.5.2 Point-in-Time Recovery Using Event Positions

The last section, Section 9.5.1, “Point-in-Time Recovery Using Binary Log”, explains the general idea of using the binary log to perform a point-in-time-recovery. The section explains the operation in details with an example.

As an example, suppose that around 20:06:00 on March 11, 2020, an SQL statement was executed that deleted a table. You can perform a point-in-time recovery to restore the server up to its state right before the table deletion. These are some sample steps to achieve that:

1. Restore the last full backup created before the point-in-time of interest (call it `tp`, which is 20:06:00 on March 11, 2020 in our example). When finished, note the binary log position up to which you have restored the server for later use, and restart the server.

   Note

   While the last binary log position recovered is also displayed by InnoDB after the restore and server restart, that is *not* a reliable means for obtaining the ending log position of your restore, as there could be DDL events and non-InnoDB changes that have taken place after the time reflected by the displayed position. Your backup and restore tool should provide you with the last binary log position for your recovery: for example, if you are using **mysqlbinlog** for the task, check the stop position of the binary log replay; if you are using MySQL Enterprise Backup, the last binary log position has been saved in your backup. See Point-in-Time Recovery.

2. Find the precise binary log event position corresponding to the point in time up to which you want to restore your database. In our example, given that we know the rough time where the table deletion took place (`tp`), we can find the log position by checking the log contents around that time using the **mysqlbinlog** utility. Use the `--start-datetime` and `--stop-datetime` options to specify a short time period around `tp`, and then look for the event in the output. For example:

   ```
   $> mysqlbinlog --start-datetime="2020-03-11 20:05:00" \
                      --stop-datetime="2020-03-11 20:08:00" --verbose \
            /var/lib/mysql/bin.123456 | grep -C 15 "DROP TABLE"

   /*!80014 SET @@session.original_server_version=80019*//*!*/;
   /*!80014 SET @@session.immediate_server_version=80019*//*!*/;
   SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
   # at 232
   #200311 20:06:20 server id 1  end_log_pos 355 CRC32 0x2fc1e5ea 	Query	thread_id=16	exec_time=0	error_code=0
   SET TIMESTAMP=1583971580/*!*/;
   SET @@session.pseudo_thread_id=16/*!*/;
   SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
   SET @@session.sql_mode=1168113696/*!*/;
   SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
   /*!\C utf8mb4 *//*!*/;
   SET @@session.character_set_client=255,@@session.collation_connection=255,@@session.collation_server=255/*!*/;
   SET @@session.lc_time_names=0/*!*/;
   SET @@session.collation_database=DEFAULT/*!*/;
   /*!80011 SET @@session.default_collation_for_utf8mb4=255*//*!*/;
   DROP TABLE `pets`.`cats` /* generated by server */
   /*!*/;
   # at 355
   #200311 20:07:48 server id 1  end_log_pos 434 CRC32 0x123d65df 	Anonymous_GTID	last_committed=1	sequence_number=2	rbr_only=no	original_committed_timestamp=1583971668462467	immediate_commit_timestamp=1583971668462467	transaction_length=473
   # original_commit_timestamp=1583971668462467 (2020-03-11 20:07:48.462467 EDT)
   # immediate_commit_timestamp=1583971668462467 (2020-03-11 20:07:48.462467 EDT)
   /*!80001 SET @@session.original_commit_timestamp=1583971668462467*//*!*/;
   /*!80014 SET @@session.original_server_version=80019*//*!*/;
   /*!80014 SET @@session.immediate_server_version=80019*//*!*/;
   SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
   # at 434
   #200311 20:07:48 server id 1  end_log_pos 828 CRC32 0x57fac9ac 	Query	thread_id=16	exec_time=0	error_code=0	Xid = 217
   use `pets`/*!*/;
   SET TIMESTAMP=1583971668/*!*/;
   /*!80013 SET @@session.sql_require_primary_key=0*//*!*/;
   CREATE TABLE dogs
   ```

   From the output of **mysqlbinlog**, the `` DROP TABLE `pets`.`cats` `` statement can be found in the segment of the binary log between the line `# at 232` and `# at 355`, which means the statement takes place *after* the log position 232, and the log is at position 355 after the `DROP TABLE` statement.

   Note

   Only use the `--start-datetime` and `--stop-datetime` options to help you find the actual event positions of interest. Using the two options to specify the range of binary log segment to apply is not recommended: there is a higher risk of missing binary log events when using the options. Use `--start-position` and `--stop-position` instead.

3. Apply the events in binary log file to the server, starting with the log position your found in step 1 (assume it is
   155) and ending at the position you have found in step 2 that is *before* your point-in-time of interest (which is 232):

   ```
   $> mysqlbinlog --start-position=155 --stop-position=232 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

   The command recovers all the transactions from the starting position until just before the stop position. Because the output of **mysqlbinlog** includes `SET TIMESTAMP` statements before each SQL statement recorded, the recovered data and related MySQL logs reflect the original times at which the transactions were executed.

   Your database has now been restored to the point-in-time of interest, `tp`, right before the table `pets.cats` was dropped.

4. Beyond the point-in-time recovery that has been finished, if you also want to reexecute all the statements *after* your point-in-time of interest, use **mysqlbinlog** again to apply all the events after `tp` to the server. We noted in step 2 that after the statement we wanted to skip, the log is at position 355; we can use it for the `--start-position` option, so that any statements after the position are included:

   ```
   $> mysqlbinlog --start-position=355 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

   Your database has been restored the latest statement recorded in the binary log file, but with the selected event skipped.
