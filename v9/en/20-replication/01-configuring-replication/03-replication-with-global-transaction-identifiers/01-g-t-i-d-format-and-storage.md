#### 19.1.3.1 GTID Format and Storage

A global transaction identifier (GTID) is a unique identifier created and associated with each transaction committed on the server of origin (the source). This identifier is unique not only to the server on which it originated, but is unique across all servers in a given replication topology.

GTID assignment distinguishes between client transactions, which are committed on the source, and replicated transactions, which are reproduced on a replica. When a client transaction is committed on the source, it is assigned a new GTID, provided that the transaction was written to the binary log. Client transactions are guaranteed to have monotonically increasing GTIDs without gaps between the generated numbers. If a client transaction is not written to the binary log (for example, because the transaction was filtered out, or the transaction was read-only), it is not assigned a GTID on the server of origin.

Replicated transactions retain the same GTID that was assigned to the transaction on the server of origin. The GTID is present before the replicated transaction begins to execute, and is persisted even if the replicated transaction is not written to the binary log on the replica, or is filtered out on the replica. The `mysql.gtid_executed` system table is used to preserve the assigned GTIDs of all the transactions applied on a MySQL server, except those that are stored in a currently active binary log file.

The auto-skip function for GTIDs means that a transaction committed on the source can be applied no more than once on the replica, which helps to guarantee consistency. Once a transaction with a given GTID has been committed on a given server, any attempt to execute a subsequent transaction with the same GTID is ignored by that server. No error is raised, and no statement in the transaction is executed.

If a transaction with a given GTID has started to execute on a server, but has not yet committed or rolled back, any attempt to start a concurrent transaction on the server with the same GTID blocks. The server neither begins to execute the concurrent transaction nor returns control to the client. Once the first attempt at the transaction commits or rolls back, concurrent sessions that were blocking on the same GTID may proceed. If the first attempt rolled back, one concurrent session proceeds to attempt the transaction, and any other concurrent sessions that were blocking on the same GTID remain blocked. If the first attempt committed, all the concurrent sessions stop being blocked, and auto-skip all the statements of the transaction.

A GTID is represented as a pair of coordinates, separated by a colon character (`:`), as shown here:

```
GTID = source_id:transaction_id
```

The *`source_id`* identifies the originating server. Normally, the source's `server_uuid` is used for this purpose. The *`transaction_id`* is a sequence number determined by the order in which the transaction was committed on the source. For example, the first transaction to be committed has `1` as its *`transaction_id`*, and the tenth transaction to be committed on the same originating server is assigned a *`transaction_id`* of `10`. It is not possible for a transaction to have `0` as a sequence number in a GTID. For example, the twenty-third transaction to be committed originally on the server with the UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` has this GTID:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

The upper limit for sequence numbers for GTIDs on a server instance is the number of non-negative values for a signed 64-bit integer (`263 - 1`, or `9223372036854775807`). If the server runs out of GTIDs, it takes the action specified by `binlog_error_action`. A warning message is issued when the server instance is approaching the limit.

MySQL 9.5 also supports tagged GTIDs. A tagged GTID consists of three parts, separated by colon characters, as shown here:

```
GTID = source_id:tag:transaction_id
```

In this case, the *`source_id`* and *`transaction_id`* are as defined previously. The *`tag`* is a user-defined string used to identify a specific group of transactions; see the description of the `gtid_next` system variable for permitted syntax. *Example*: the one-hundred-seventeenth transaction to be committed originally on the server with the UUID `ed102faf-eb00-11eb-8f20-0c5415bfaa1d` and the tag `Domain_1` has this GTID:

```
ed102faf-eb00-11eb-8f20-0c5415bfaa1d:Domain_1:117
```

The GTID for a transaction is shown in the output from **mysqlbinlog**, and it is used to identify an individual transaction in the Performance Schema replication status tables, for example, `replication_applier_status_by_worker`. The value stored by the `gtid_next` system variable (`@@GLOBAL.gtid_next`) is a single GTID.

##### GTID Sets

A GTID set is a set comprising one or more single GTIDs or ranges of GTIDs. GTID sets are used in a MySQL server in several ways. For example, the values stored by the `gtid_executed` and `gtid_purged` system variables are GTID sets. The `START REPLICA` options `UNTIL SQL_BEFORE_GTIDS` and `UNTIL SQL_AFTER_GTIDS` can be used to make a replica process transactions only up to the first GTID in a GTID set, or stop after the last GTID in a GTID set. The built-in functions `GTID_SUBSET()` and `GTID_SUBTRACT()` require GTID sets as input.

A range of GTIDs originating from the same server can be collapsed into a single expression, as shown here:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

The above example represents the first through fifth transactions originating on the MySQL server whose `server_uuid` is `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Multiple single GTIDs or ranges of GTIDs originating from the same server can also be included in a single expression, with the GTIDs or ranges separated by colons, as in the following example:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

A GTID set can include any combination of single GTIDs and ranges of GTIDs, and it can include GTIDs originating from different servers. This example shows the GTID set stored in the `gtid_executed` system variable (`@@GLOBAL.gtid_executed`) of a replica that has applied transactions from more than one source:

```
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

When GTID sets are returned from server variables, UUIDs are in alphabetical order, and numeric intervals are merged and in ascending order.

When constructing a GTID set, a user-defined tag is treated as part of the UUID. This means that multiple GTIDs originating from the same server and having the same tag can be included in a single expression, as shown in this example:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_1:1-3:11:47-49
```

GTIDs originating from the same server but having different tags are treated in a manner similar to those originating from different servers, like this:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_1:1-3:15-21, 3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_2:8-52
```

The complete syntax for a GTID set is as follows:

```
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:[tag:]interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

tag:
    [a-z_][a-z0-9_]{0,31}

interval:
    m[-n]

    (m >= 1; n > m)
```

##### mysql.gtid\_executed Table

GTIDs are stored in a table named `gtid_executed`, in the `mysql` database. A row in this table contains, for each GTID or set of GTIDs that it represents, the UUID of the originating server, the user-defined tag (if there is one), and the starting and ending transaction IDs of the set; for a row referencing only a single GTID, these last two values are the same.

The `mysql.gtid_executed` table is created (if it does not already exist) when MySQL Server is installed or upgraded, using a `CREATE TABLE` statement similar to that shown here:

```
CREATE TABLE gtid_executed (
  source_uuid CHAR(36) NOT NULL,
  interval_start BIGINT NOT NULL,
  interval_end BIGINT NOT NULL,
  gtid_tag CHAR(32) NOT NULL,
  PRIMARY KEY (source_uuid, gtid_tag, interval_start)
);
```

Warning

As with other MySQL system tables, do not attempt to create or modify this table yourself.

The `mysql.gtid_executed` table is provided for internal use by the MySQL server. It enables a replica to use GTIDs when binary logging is disabled on the replica, and it enables retention of the GTID state when the binary logs have been lost. Note that the `mysql.gtid_executed` table is cleared if you issue `RESET BINARY LOGS AND GTIDS`.

GTIDs are stored in the `mysql.gtid_executed` table only when `gtid_mode` is `ON` or `ON_PERMISSIVE`. If binary logging is disabled (`log_bin` is `OFF`), or if `log_replica_updates` is disabled, the server stores the GTID belonging to each transaction together with the transaction in the buffer when the transaction is committed, and the background thread adds the contents of the buffer periodically as one or more entries to the `mysql.gtid_executed` table. In addition, the table is compressed periodically at a user-configurable rate, as described in mysql.gtid\_executed Table Compression.

If binary logging is enabled (`log_bin` is `ON`), for the `InnoDB` storage engine only, the server updates the `mysql.gtid_executed` table in the same way as when binary logging or replica update logging is disabled, storing the GTID for each transaction at transaction commit time. For other storage engines, the server updates the `mysql.gtid_executed` table only when the binary log is rotated or the server is shut down. At these times, the server writes GTIDs for all transactions that were written into the previous binary log into the `mysql.gtid_executed` table.

If the `mysql.gtid_executed` table cannot be accessed for writes, and the binary log file is rotated for any reason other than reaching the maximum file size (`max_binlog_size`), the current binary log file continues to be used. An error message is returned to the client that requested the rotation, and a warning is logged on the server. If the `mysql.gtid_executed` table cannot be accessed for writes and `max_binlog_size` is reached, the server responds according to its `binlog_error_action` setting. If `IGNORE_ERROR` is set, an error is logged on the server and binary logging is halted, or if `ABORT_SERVER` is set, the server shuts down.

##### mysql.gtid\_executed Table Compression

Over the course of time, the `mysql.gtid_executed` table can become filled with many rows referring to individual GTIDs that originate on the same server, have the same GTID tag (if any), and whose transaction IDs make up a range, similar to what is shown here:

```
+--------------------------------------+----------------+--------------+----------+
| source_uuid                          | interval_start | interval_end | gtid_tag |
|--------------------------------------+----------------+--------------|----------+
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 31             | 31           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 32             | 32           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 33             | 33           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 34             | 34           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 35             | 35           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 36             | 36           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 44             | 44           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 45             | 45           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 46             | 46           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 47             | 47           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 48             | 48           | Domain_1 |
...
```

To save space, the MySQL server can compress the `mysql.gtid_executed` table periodically by replacing each such set of rows with a single row that spans the entire interval of transaction identifiers, like this:

```
+--------------------------------------+----------------+--------------+----------+
| source_uuid                          | interval_start | interval_end | gtid_tag |
|--------------------------------------+----------------+--------------|----------+
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 31             | 35           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 36             | 39           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 43           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 44             | 46           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 47             | 48           | Domain_1 |
...
```

The server can carry out compression using a dedicated foreground thread named `thread/sql/compress_gtid_table`. This thread is not listed in the output of `SHOW PROCESSLIST`, but it can be viewed as a row in the `threads` table, as shown here:

```
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

When binary logging is enabled on the server, this compression method is not used, and instead the `mysql.gtid_executed` table is compressed on each binary log rotation. However, when binary logging is disabled on the server, the `thread/sql/compress_gtid_table` thread sleeps until a specified number of transactions have been executed, then wakes up to perform compression of the `mysql.gtid_executed` table. It then sleeps until the same number of transactions have taken place, then wakes up to perform the compression again, repeating this loop indefinitely. The number of transactions that elapse before the table is compressed, and thus the compression rate, is controlled by the value of the `gtid_executed_compression_period` system variable. Setting that value to 0 means that the thread never wakes up, meaning that this explicit compression method is not used. Instead, compression occurs implicitly as required.

`InnoDB` transactions are written to the `mysql.gtid_executed` table by a process separate from that used for transactions involving storage engines other than `InnoDB`. This process is controlled by a different thread, `innodb/clone_gtid_thread`. This GTID persister thread collects GTIDs in groups, flushes them to the `mysql.gtid_executed` table, then compresses the table. If the server has a mix of `InnoDB` transactions and non-`InnoDB` transactions, which are written to the `mysql.gtid_executed` table individually, the compression carried out by the `compress_gtid_table` thread interferes with the work of the GTID persister thread and can slow it significantly. For this reason, it is recommended that you set `gtid_executed_compression_period` to 0, so that the `compress_gtid_table` thread is never activated.

The default value for `gtid_executed_compression_period` is 0, and all transactions regardless of storage engine are written to the `mysql.gtid_executed` table by the GTID persister thread.

When a server instance is started, if `gtid_executed_compression_period` is set to a nonzero value and the `thread/sql/compress_gtid_table` thread is launched, in most server configurations, explicit compression is performed for the `mysql.gtid_executed` table. Compression is triggered by the thread launch.
