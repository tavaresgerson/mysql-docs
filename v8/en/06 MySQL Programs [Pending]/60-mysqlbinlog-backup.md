#### 6.6.9.3 Using mysqlbinlog to Back Up Binary Log Files

By default,  **mysqlbinlog** reads binary log files and displays their contents in text format. This enables you to examine events within the files more easily and to re-execute them (for example, by using the output as input to `mysql`).  **mysqlbinlog** can read log files directly from the local file system, or, with the `--read-from-remote-server` option, it can connect to a server and request binary log contents from that server.  **mysqlbinlog** writes text output to its standard output, or to the file named as the value of the `--result-file=file_name` option if that option is given.

*  mysqlbinlog Backup Capabilities
*  mysqlbinlog Backup Options
*  Static and Live Backups
*  Output File Naming
*  Example: mysqldump + mysqlbinlog for Backup and Restore
*  mysqlbinlog Backup Restrictions

##### mysqlbinlog Backup Capabilities

**mysqlbinlog** can read binary log files and write new files containing the same content—that is, in binary format rather than text format. This capability enables you to easily back up a binary log in its original format. **mysqlbinlog** can make a static backup, backing up a set of log files and stopping when the end of the last file is reached. It can also make a continuous (“live”) backup, staying connected to the server when it reaches the end of the last log file and continuing to copy new events as they are generated. In continuous-backup operation, **mysqlbinlog** runs until the connection ends (for example, when the server exits) or **mysqlbinlog** is forcibly terminated. When the connection ends,  **mysqlbinlog** does not wait and retry the connection, unlike a replica server. To continue a live backup after the server has been restarted, you must also restart  **mysqlbinlog**.

Important

 **mysqlbinlog** can back up both encrypted and unencrypted binary log files . However, copies of encrypted binary log files that are generated using **mysqlbinlog** are stored in an unencrypted format.

##### mysqlbinlog Backup Options

Binary log backup requires that you invoke **mysqlbinlog** with two options at minimum:

* The `--read-from-remote-server` (or `-R`) option tells **mysqlbinlog** to connect to a server and request its binary log. (This is similar to a replica server connecting to its replication source server.)
* The  `--raw` option tells **mysqlbinlog** to write raw (binary) output, not text output.

Along with `--read-from-remote-server`, it is common to specify other options: `--host` indicates where the server is running, and you may also need to specify connection options such as  `--user` and `--password`.

Several other options are useful in conjunction with `--raw`:

*  `--stop-never`: Stay connected to the server after reaching the end of the last log file and continue to read new events.
*  `--connection-server-id=id`: The server ID that  **mysqlbinlog** reports when it connects to a server. When `--stop-never` is used, the default reported server ID is 1. If this causes a conflict with the ID of a replica server or another **mysqlbinlog** process, use `--connection-server-id` to specify an alternative server ID. See Section 6.6.9.4, “Specifying the mysqlbinlog Server ID”.
*  `--result-file`: A prefix for output file names, as described later.

##### Static and Live Backups

To back up a server's binary log files with **mysqlbinlog**, you must specify file names that actually exist on the server. If you do not know the names, connect to the server and use the `SHOW BINARY LOGS` statement to see the current names. Suppose that the statement produces this output:

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000130 |     27459 | No        |
| binlog.000131 |     13719 | No        |
| binlog.000132 |     43268 | No        |
+---------------+-----------+-----------+
```

With that information, you can use **mysqlbinlog** to back up the binary log to the current directory as follows (enter each command on a single line):

* To make a static backup of `binlog.000130` through `binlog.000132`, use either of these commands:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

  The first command specifies every file name explicitly. The second names only the first file and uses `--to-last-log` to read through the last. A difference between these commands is that if the server happens to open `binlog.000133` before **mysqlbinlog** reaches the end of `binlog.000132`, the first command does not read it, but the second command does.
* To make a live backup in which **mysqlbinlog** starts with `binlog.000130` to copy existing log files, then stays connected to copy new events as the server generates them:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  With  `--stop-never`, it is not necessary to specify `--to-last-log` to read to the last log file because that option is implied.

##### Output File Naming

Without  `--raw`, **mysqlbinlog** produces text output and the `--result-file` option, if given, specifies the name of the single file to which all output is written. With  `--raw`, **mysqlbinlog** writes one binary output file for each log file transferred from the server. By default, **mysqlbinlog** writes the files in the current directory with the same names as the original log files. To modify the output file names, use the `--result-file` option. In conjunction with  `--raw`, the `--result-file` option value is treated as a prefix that modifies the output file names.

Suppose that a server currently has binary log files named `binlog.000999` and up. If you use **mysqlbinlog --raw** to back up the files, the `--result-file` option produces output file names as shown in the following table. You can write the files to a specific directory by beginning the `--result-file` value with the directory path. If the `--result-file` value consists only of a directory name, the value must end with the pathname separator character. Output files are overwritten if they exist.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code class="option">--result-file</code> Option</th> <th>Output File Names</th> </tr></thead><tbody><tr> <td><code class="option">--result-file=x</code></td> <td><code>xbinlog.000999</code> and up</td> </tr><tr> <td><code class="option">--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code> and up</td> </tr><tr> <td><code class="option">--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code> and up</td> </tr></tbody></table>

##### Example: mysqldump + mysqlbinlog for Backup and Restore

The following example describes a simple scenario that shows how to use  `mysqldump` and **mysqlbinlog** together to back up a server's data and binary log, and how to use the backup to restore the server if data loss occurs. The example assumes that the server is running on host *`host_name`* and its first binary log file is named `binlog.000999`. Enter each command on a single line.

Use  **mysqlbinlog** to make a continuous backup of the binary log:

```
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use  `mysqldump` to create a dump file as a snapshot of the server's data. Use `--all-databases`, `--events`, and `--routines` to back up all data, and  `--source-data=2` to include the current binary log coordinates in the dump file.

```
mysqldump --host=host_name --all-databases --events --routines --source-data=2> dump_file
```

Execute the  `mysqldump` command periodically to create newer snapshots as desired.

If data loss occurs (for example, if the server unexpectedly exits), use the most recent dump file to restore the data:

```
mysql --host=host_name -u root -p < dump_file
```

Then use the binary log backup to re-execute events that were written after the coordinates listed in the dump file. Suppose that the coordinates in the file look like this:

```
-- CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='binlog.001002', SOURCE_LOG_POS=27284;
```

If the most recent backed-up log file is named `binlog.001004`, re-execute the log events like this:

```
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

You might find it easier to copy the backup files (dump file and binary log files) to the server host to make it easier to perform the restore operation, or if MySQL does not allow remote `root` access.

##### mysqlbinlog Backup Restrictions

Binary log backups with  **mysqlbinlog** are subject to these restrictions:

*  **mysqlbinlog** does not automatically reconnect to the MySQL server if the connection is lost (for example, if a server restart occurs or there is a network outage).
* The delay for a backup is similar to the delay for a replica server.
