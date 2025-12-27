#### 16.2.4.1 The Relay Log

The relay log, like the binary log, consists of a set of numbered files containing events that describe database changes, and an index file that contains the names of all used relay log files.

The term “relay log file” generally denotes an individual numbered file containing database events. The term “relay log” collectively denotes the set of numbered relay log files plus the index file.

Relay log files have the same format as binary log files and can be read using [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") (see [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files")).

By default, relay log file names have the form `host_name-relay-bin.nnnnnn` in the data directory, where *`host_name`* is the name of the replica server host and *`nnnnnn`* is a sequence number. Successive relay log files are created using successive sequence numbers, beginning with `000001`. The replica uses an index file to track the relay log files currently in use. The default relay log index file name is `host_name-relay-bin.index` in the data directory.

The default relay log file and relay log index file names can be overridden with, respectively, the [`relay_log`](replication-options-replica.html#sysvar_relay_log) and [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variables (see [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables")).

If a replica uses the default host-based relay log file names, changing a replica's host name after replication has been set up can cause replication to fail with the errors Failed to open the relay log and Could not find target log during relay log initialization. This is a known issue (see Bug #2122). If you anticipate that a replica's host name might change in the future (for example, if networking is set up on the replica such that its host name can be modified using DHCP), you can avoid this issue entirely by using the [`relay_log`](replication-options-replica.html#sysvar_relay_log) and [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variables to specify relay log file names explicitly when you initially set up the replica. This makes the names independent of server host name changes.

If you encounter the issue after replication has already begun, one way to work around it is to stop the replica server, prepend the contents of the old relay log index file to the new one, and then restart the replica. On a Unix system, this can be done as shown here:

```sql
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

A replica server creates a new relay log file under the following conditions:

* Each time the replication I/O thread starts.
* When the logs are flushed (for example, with [`FLUSH LOGS`](flush.html#flush-logs) or [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program")).

* When the size of the current relay log file becomes too large, determined as follows:

  + If the value of [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) is greater than 0, that is the maximum relay log file size.

  + If the value of [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) is 0, [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) determines the maximum relay log file size.

The replication SQL thread automatically deletes each relay log file after it has executed all events in the file and no longer needs it. There is no explicit mechanism for deleting relay logs because the replication SQL thread takes care of doing so. However, [`FLUSH LOGS`](flush.html#flush-logs) rotates relay logs, which influences when the replication SQL thread deletes them.
