## 7.5 Point-in-Time (Incremental) Recovery

Point-in-time recovery refers to recovery of data changes up to a given point in time. Typically, this type of recovery is performed after restoring a full backup that brings the server to its state as of the time the backup was made. (The full backup can be made in several ways, such as those listed in Section 7.2, “Database Backup Methods”.) Point-in-time recovery then brings the server up to date incrementally from the time of the full backup to a more recent time.


### 7.5.1 Point-in-Time Recovery Using Binary Log

This section explains the general idea of using the binary log to perform a point-in-time-recovery. The next section, Section 7.5.2, “Point-in-Time Recovery Using Event Positions”, explains the operation in details with an example.

Note

Many of the examples in this and the next section use the **mysql** client to process binary log output produced by **mysqlbinlog**. If your binary log contains `\0` (null) characters, that output cannot be parsed by **mysql** unless you invoke it with the `--binary-mode` option.

The source of information for point-in-time recovery is the set of binary log files generated subsequent to the full backup operation. Therefore, to allow a server to be restored to a point-in-time, binary logging must be enabled on it (see Section 5.4.4, “The Binary Log” for details).

To restore data from the binary log, you must know the name and location of the current binary log files. By default, the server creates binary log files in the data directory, but a path name can be specified with the `--log-bin` option to place the files in a different location. To see a listing of all binary log files, use this statement:

```sql
mysql> SHOW BINARY LOGS;
```

To determine the name of the current binary log file, issue the following statement:

```sql
mysql> SHOW MASTER STATUS;
```

The **mysqlbinlog** utility converts the events in the binary log files from binary format to text so that they can be viewed or applied. **mysqlbinlog** has options for selecting sections of the binary log based on event times or position of events within the log. See Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.

Applying events from the binary log causes the data modifications they represent to be reexecuted. This enables recovery of data changes for a given span of time. To apply events from the binary log, process **mysqlbinlog** output using the **mysql** client:

```sql
$> mysqlbinlog binlog_files | mysql -u root -p
```

Viewing log contents can be useful when you need to determine event times or positions to select partial log contents prior to executing events. To view events from the log, send **mysqlbinlog** output into a paging program:

```sql
$> mysqlbinlog binlog_files | more
```

Alternatively, save the output in a file and view the file in a text editor:

```sql
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

After editing the file, apply the contents as follows:

```sql
$> mysql -u root -p < tmpfile
```

If you have more than one binary log to apply on the MySQL server, use a single connection to apply the contents of all binary log files that you want to process. Here is one way to do so:

```sql
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Another approach is to write the whole log to a single file and then process the file:

```sql
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```


### 7.5.2 Point-in-Time Recovery Using Event Positions

The last section, Section 7.5.1, “Point-in-Time Recovery Using Binary Log”, explains the general idea of using the binary log to perform a point-in-time-recovery. The section explains the operation in details with an example.

As an example, suppose that around 13:00:00 on May 27, 2020, an SQL statement was executed that deleted a table. You can perform a point-in-time recovery to restore the server up to its state right before the table deletion. These are some sample steps to achieve that:

1. Restore the last full backup created before the point-in-time of interest (call it `tp`, which is 13:00:00 on May 27, 2020 in our example). When finished, note the binary log position up to which you have restored the server for later use, and restart the server.

   Note

   While the last binary log position recovered is also displayed by InnoDB after the restore and server restart, that is *not* a reliable means for obtaining the ending log position of your restore, as there could be DDL events and non-InnoDB changes that have taken place after the time reflected by the displayed position. Your backup and restore tool should provide you with the last binary log position for your recovery: for example, if you are using **mysqlbinlog** for the task, check the stop position of the binary log replay; if you are using MySQL Enterprise Backup, the last binary log position has been saved in your backup. See Point-in-Time Recovery.

2. Find the precise binary log event position corresponding to the point in time up to which you want to restore your database. In our example, given that we know the rough time where the table deletion took place (`tp`), we can find the log position by checking the log contents around that time using the **mysqlbinlog** utility. Use the `--start-datetime` and `--stop-datetime` options to specify a short time period around `tp`, and then look for the event in the output. For example:

   ```sql
   $> mysqlbinlog   --start-datetime="2020-05-27 12:59:00" --stop-datetime="2020-05-27 13:06:00" \
     --verbose /var/lib/mysql/bin.123456 | grep -C 12 "DROP TABLE"
   # at 1868
   #200527 13:00:30 server id 2  end_log_pos 1985 CRC32 0x8b894489 	Query	thread_id=8	exec_time=0	error_code=0
   use `pets`/*!*/;
   SET TIMESTAMP=1590598830/*!*/;
   SET @@session.pseudo_thread_id=8/*!*/;
   SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
   SET @@session.sql_mode=1436549152/*!80005 &~0x1003ff00*//*!*/;
   SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
   /*!\C latin1 *//*!*/;
   SET @@session.character_set_client=8,@@session.collation_connection=8,@@session.collation_server=8/*!*/;
   SET @@session.lc_time_names=0/*!*/;
   SET @@session.collation_database=DEFAULT/*!*/;
   DROP TABLE `cats` /* generated by server */
   /*!*/;
   # at 1985
   #200527 13:05:06 server id 2  end_log_pos 2050 CRC32 0x2f8d0249 	Anonymous_GTID	last_committed=6	sequence_number=7	rbr_only=yes	original_committed_timestamp=0	immediate_commit_timestamp=0	transaction_length=0
   /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
   # original_commit_timestamp=0 (1969-12-31 19:00:00.000000 EST)
   # immediate_commit_timestamp=0 (1969-12-31 19:00:00.000000 EST)
   /*!80001 SET @@session.original_commit_timestamp=0*//*!*/;
   /*!80014 SET @@session.original_server_version=0*//*!*/;
   /*!80014 SET @@session.immediate_server_version=0*//*!*/;
   SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
   # at 2050
   #200527 13:05:06 server id 2  end_log_pos 2122 CRC32 0x56280bb1 	Query	thread_id=8	exec_time=0	error_code=0
   ```

   From the output of **mysqlbinlog**, the `` DROP TABLE `pets`.`cats` `` statement can be found in the segment of the binary log between the line `# at 1868` and `# at 1985`, which means the statement takes place *after* the log position 1868, and the log is at position 1985 after the `DROP TABLE` statement.

   Note

   Only use the `--start-datetime` and `--stop-datetime` options to help you find the actual event positions of interest. Using the two options to specify the range of binary log segment to apply is not recommended: there is a higher risk of missing binary log events when using the options. Use `--start-position` and `--stop-position` instead.

3. Apply the events in binary log file to the server, starting with the log position your found in step 1 (assume it is
   1006) and ending at the position you have found in step 2 that is *before* your point-in-time of interest (which is 1868):

   ```sql
   $> mysqlbinlog --start-position=1006 --stop-position=1868 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

   The command recovers all the transactions from the starting position until just before the stop position. Because the output of **mysqlbinlog** includes `SET TIMESTAMP` statements before each SQL statement recorded, the recovered data and related MySQL logs reflect the original times at which the transactions were executed.

   Your database has now been restored to the point-in-time of interest, `tp`, right before the table `pets.cats` was dropped.

4. Beyond the point-in-time recovery that has been finished, if you also want to reexecute all the statements *after* your point-in-time of interest, use **mysqlbinlog** again to apply all the events after `tp` to the server. We noted in step 2 that after the statement we wanted to skip, the log is at position 1985; we can use it for the `--start-position` option, so that any statements after the position are included:

   ```sql
   $> mysqlbinlog --start-position=1985 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

   Your database has been restored the latest statement recorded in the binary log file, but with the selected event skipped.
