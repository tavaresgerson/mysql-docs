## 10.14 Examining Server Thread (Process) Information

To ascertain what your MySQL server is doing, it can be helpful to examine the process list, which indicates the operations currently being performed by the set of threads executing within the server. For example:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 5
   User: event_scheduler
   Host: localhost
     db: NULL
Command: Daemon
   Time: 2756681
  State: Waiting on empty queue
   Info: NULL
*************************** 2. row ***************************
     Id: 20
   User: me
   Host: localhost:52943
     db: test
Command: Query
   Time: 0
  State: starting
   Info: SHOW PROCESSLIST
```

Threads can be killed with the `KILL` statement. See Section 15.7.8.4, “KILL Statement”.


### 10.14.1 Accessing the Process List

The following discussion enumerates the sources of process information, the privileges required to see process information, and describes the content of process list entries.

* Sources of Process Information
* Privileges Required to Access the Process List
* Content of Process List Entries

#### Sources of Process Information

Process information is available from these sources:

* The `SHOW PROCESSLIST` statement: Section 15.7.7.32, “SHOW PROCESSLIST Statement”

* The **mysqladmin processlist** command: Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”

* The `INFORMATION_SCHEMA` `PROCESSLIST` table: Section 28.3.28, “The INFORMATION_SCHEMA PROCESSLIST Table”

* The Performance Schema `processlist` table: Section 29.12.22.9, “The processlist Table”

* The Performance Schema `threads` table columns with names having a prefix of `PROCESSLIST_`: Section 29.12.22.10, “The threads Table”

* The `sys` schema `processlist` and `session` views: Section 30.4.3.22, “The processlist and x$processlist Views”, and Section 30.4.3.33, “The session and x$session Views”

The `threads` table compares to `SHOW PROCESSLIST`, `INFORMATION_SCHEMA` `PROCESSLIST`, and **mysqladmin processlist** as follows:

* Access to the `threads` table does not require a mutex and has minimal impact on server performance. The other sources have negative performance consequences because they require a mutex.

  Note

  An alternative implementation for `SHOW PROCESSLIST` is available based on the Performance Schema `processlist` table, which, like the `threads` table, does not require a mutex and has better performance characteristics. For details, see Section 29.12.22.9, “The processlist Table”.

* The `threads` table displays background threads, which the other sources do not. It also provides additional information for each thread that the other sources do not, such as whether the thread is a foreground or background thread, and the location within the server associated with the thread. This means that the `threads` table can be used to monitor thread activity the other sources cannot.

* You can enable or disable Performance Schema thread monitoring, as described in Section 29.12.22.10, “The threads Table”.

For these reasons, DBAs who perform server monitoring using one of the other thread information sources may wish to monitor using the `threads` table instead.

The `sys` schema `processlist` view presents information from the Performance Schema `threads` table in a more accessible format. The `sys` schema `session` view presents information about user sessions like the `sys` schema `processlist` view, but with background processes filtered out.

#### Privileges Required to Access the Process List

For most sources of process information, if you have the `PROCESS` privilege, you can see all threads, even those belonging to other users. Otherwise (without the `PROCESS` privilege), nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

The Performance Schema `threads` table also provides thread information, but table access uses a different privilege model. See Section 29.12.22.10, “The threads Table”.

#### Content of Process List Entries

Each process list entry contains several pieces of information. The following list describes them using the labels from `SHOW PROCESSLIST` output. Other process information sources use similar labels.

* `Id` is the connection identifier for the client associated with the thread.

* `User` and `Host` indicate the account associated with the thread.

* `db` is the default database for the thread, or `NULL` if none has been selected.

* `Command` and `State` indicate what the thread is doing.

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that needs to be investigated.

  The following sections list the possible `Command` values, and `State` values grouped by category. The meaning for some of these values is self-evident. For others, additional description is provided.

  Note

  Applications that examine process list information should be aware that the commands and states are subject to change.

* `Time` indicates how long the thread has been in its current state. The thread's notion of the current time may be altered in some cases: The thread can change the time with [`SET TIMESTAMP = value`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"). For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See Section 19.2.3, “Replication Threads”.

* `Info` indicates the statement the thread is executing, or `NULL` if it is executing no statement. For [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement"), this value contains only the first 100 characters of the statement. To see complete statements, use [`SHOW FULL PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") (or query a different process information source).


### 10.14.2 Thread Command Values

A thread can have any of the following `Command` values:

* `Binlog Dump`

  This is a thread on a replication source for sending binary log contents to a replica.

* `Change user`

  The thread is executing a change user operation.

* `Close stmt`

  The thread is closing a prepared statement.

* `Connect`

  Used by replication receiver threads connected to the source, and by replication worker threads.

* `Connect Out`

  A replica is connecting to its source.

* `Create DB`

  The thread is executing a create database operation.

* `Daemon`

  This thread is internal to the server, not a thread that services a client connection.

* `Debug`

  The thread is generating debugging information.

* `Delayed insert`

  The thread is a delayed insert handler.

* `Drop DB`

  The thread is executing a drop database operation.

* `Error`
* `Execute`

  The thread is executing a prepared statement.

* `Fetch`

  The thread is fetching the results from executing a prepared statement.

* `Field List`

  The thread is retrieving information for table columns.

* `Init DB`

  The thread is selecting a default database.

* `Kill`

  The thread is killing another thread.

* `Long Data`

  The thread is retrieving long data in the result of executing a prepared statement.

* `Ping`

  The thread is handling a server ping request.

* `Prepare`

  The thread is preparing a prepared statement.

* `Processlist`

  The thread is producing information about server threads.

* `Query`

  Employed for user clients while executing queries by single-threaded replication applier threads, as well as by the replication coordinator thread.

* `Quit`

  The thread is terminating.

* `Refresh`

  The thread is flushing table, logs, or caches, or resetting status variable or replication server information.

* `Register Slave`

  The thread is registering a replica server.

* `Reset stmt`

  The thread is resetting a prepared statement.

* `Set option`

  The thread is setting or resetting a client statement execution option.

* `Shutdown`

  The thread is shutting down the server.

* `Sleep`

  The thread is waiting for the client to send a new statement to it.

* `Statistics`

  The thread is producing server status information.

* `Time`

  Unused.


### 10.14.3 General Thread States

The following list describes thread `State` values that are associated with general query processing and not more specialized activities such as replication. Many of these are useful only for finding bugs in the server.

* `After create`

  This occurs when the thread creates a table (including internal temporary tables), at the end of the function that creates the table. This state is used even if the table could not be created due to some error.

* `altering table`

  The server is in the process of executing an in-place `ALTER TABLE`.

* `Analyzing`

  The thread is calculating a `MyISAM` table key distributions (for example, for `ANALYZE TABLE`).

* `checking permissions`

  The thread is checking whether the server has the required privileges to execute the statement.

* `Checking table`

  The thread is performing a table check operation.

* `cleaning up`

  The thread has processed one command and is preparing to free memory and reset certain state variables.

* `closing tables`

  The thread is flushing the changed table data to disk and closing the used tables. This should be a fast operation. If not, verify that you do not have a full disk and that the disk is not in very heavy use.

* `committing alter table to storage engine`

  The server has finished an in-place `ALTER TABLE` and is committing the result.

* `converting HEAP to ondisk`

  The thread is converting an internal temporary table from a `MEMORY` table to an on-disk table.

* `copy to tmp table`

  The thread is processing an [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement. This state occurs after the table with the new structure has been created but before rows are copied into it.

  For a thread in this state, the Performance Schema can be used to obtain about the progress of the copy operation. See Section 29.12.5, “Performance Schema Stage Event Tables”.

* `Copying to group table`

  If a statement has different `ORDER BY` and `GROUP BY` criteria, the rows are sorted by group and copied to a temporary table.

* `Copying to tmp table`

  The server is copying to a temporary table in memory.

* `Copying to tmp table on disk`

  The server is copying to a temporary table on disk. The temporary result set has become too large (see Section 10.4.4, “Internal Temporary Table Use in MySQL”). Consequently, the thread is changing the temporary table from in-memory to disk-based format to save memory.

* `Creating index`

  The thread is processing `ALTER TABLE ... ENABLE KEYS` for a `MyISAM` table.

* `Creating sort index`

  The thread is processing a `SELECT` that is resolved using an internal temporary table.

* `creating table`

  The thread is creating a table. This includes creation of temporary tables.

* `Creating tmp table`

  The thread is creating a temporary table in memory or on disk. If the table is created in memory but later is converted to an on-disk table, the state during that operation is `Copying to tmp table on disk`.

* `deleting from main table`

  The server is executing the first part of a multiple-table delete. It is deleting only from the first table, and saving columns and offsets to be used for deleting from the other (reference) tables.

* `deleting from reference tables`

  The server is executing the second part of a multiple-table delete and deleting the matched rows from the other tables.

* `discard_or_import_tablespace`

  The thread is processing an `ALTER TABLE ... DISCARD TABLESPACE` or `ALTER TABLE ... IMPORT TABLESPACE` statement.

* `end`

  This occurs at the end but before the cleanup of `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT`, or `UPDATE` statements.

  For the `end` state, the following operations could be happening:

  + Writing an event to the binary log
  + Freeing memory buffers, including for blobs
* `executing`

  The thread has begun executing a statement.

* `Execution of init_command`

  The thread is executing statements in the value of the `init_command` system variable.

* `freeing items`

  The thread has executed a command. This state is usually followed by `cleaning up`.

* `FULLTEXT initialization`

  The server is preparing to perform a natural-language full-text search.

* `init`

  This occurs before the initialization of `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT`, or `UPDATE` statements. Actions taken by the server in this state include flushing the binary log and the `InnoDB` log.

* `Killed`

  Someone has sent a `KILL` statement to the thread and it should abort next time it checks the kill flag. The flag is checked in each major loop in MySQL, but in some cases it might still take a short time for the thread to die. If the thread is locked by some other thread, the kill takes effect as soon as the other thread releases its lock.

* `Locking system tables`

  The thread is trying to lock a system table (for example, a time zone or log table).

* `logging slow query`

  The thread is writing a statement to the slow-query log.

* `login`

  The initial state for a connection thread until the client has been authenticated successfully.

* `manage keys`

  The server is enabling or disabling a table index.

* `Opening system tables`

  The thread is trying to open a system table (for example, a time zone or log table).

* `Opening tables`

  The thread is trying to open a table. This is should be very fast procedure, unless something prevents opening. For example, an `ALTER TABLE` or a [`LOCK TABLE`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement can prevent opening a table until the statement is finished. It is also worth checking that your `table_open_cache` value is large enough.

  For system tables, the `Opening system tables` state is used instead.

* `optimizing`

  The server is performing initial optimizations for a query.

* `preparing`

  This state occurs during query optimization.

* `preparing for alter table`

  The server is preparing to execute an in-place `ALTER TABLE`.

* `Purging old relay logs`

  The thread is removing unneeded relay log files.

* `query end`

  This state occurs after processing a query but before the `freeing items` state.

* `Receiving from client`

  The server is reading a packet from the client.

* `Removing duplicates`

  The query was using [`SELECT DISTINCT`](select.html "15.2.13 SELECT Statement") in such a way that MySQL could not optimize away the distinct operation at an early stage. Because of this, MySQL requires an extra stage to remove all duplicated rows before sending the result to the client.

* `removing tmp table`

  The thread is removing an internal temporary table after processing a `SELECT` statement. This state is not used if no temporary table was created.

* `rename`

  The thread is renaming a table.

* `rename result table`

  The thread is processing an [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement, has created the new table, and is renaming it to replace the original table.

* `Reopen tables`

  The thread got a lock for the table, but noticed after getting the lock that the underlying table structure changed. It has freed the lock, closed the table, and is trying to reopen it.

* `Repair by sorting`

  The repair code is using a sort to create indexes.

* `Repair done`

  The thread has completed a multithreaded repair for a `MyISAM` table.

* `Repair with keycache`

  The repair code is using creating keys one by one through the key cache. This is much slower than `Repair by sorting`.

* `Rolling back`

  The thread is rolling back a transaction.

* `Saving state`

  For `MyISAM` table operations such as repair or analysis, the thread is saving the new table state to the `.MYI` file header. State includes information such as number of rows, the `AUTO_INCREMENT` counter, and key distributions.

* `Searching rows for update`

  The thread is doing a first phase to find all matching rows before updating them. This has to be done if the `UPDATE` is changing the index that is used to find the involved rows.

* `Sending data`

  This state is now included in the `Executing` state.

* `Sending to client`

  The server is writing a packet to the client.

* `setup`

  The thread is beginning an [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") operation.

* `Sorting for group`

  The thread is doing a sort to satisfy a `GROUP BY`.

* `Sorting for order`

  The thread is doing a sort to satisfy an `ORDER BY`.

* `Sorting index`

  The thread is sorting index pages for more efficient access during a `MyISAM` table optimization operation.

* `Sorting result`

  For a `SELECT` statement, this is similar to `Creating sort index`, but for nontemporary tables.

* `starting`

  The first stage at the beginning of statement execution.

* `statistics`

  The server is calculating statistics to develop a query execution plan. If a thread is in this state for a long time, the server is probably disk-bound performing other work.

* `System lock`

  The thread has called `mysql_lock_tables()` and the thread state has not been updated since. This is a very general state that can occur for many reasons.

  For example, the thread is going to request or is waiting for an internal or external system lock for the table. This can occur when `InnoDB` waits for a table-level lock during execution of `LOCK TABLES`. If this state is being caused by requests for external locks and you are not using multiple **mysqld** servers that are accessing the same `MyISAM` tables, you can disable external system locks with the `--skip-external-locking` option. However, external locking is disabled by default, so it is likely that this option has no effect. For `SHOW PROFILE`, this state means the thread is requesting the lock (not waiting for it).

  For system tables, the `Locking system tables` state is used instead.

* `update`

  The thread is getting ready to start updating the table.

* `Updating`

  The thread is searching for rows to update and is updating them.

* `updating main table`

  The server is executing the first part of a multiple-table update. It is updating only the first table, and saving columns and offsets to be used for updating the other (reference) tables.

* `updating reference tables`

  The server is executing the second part of a multiple-table update and updating the matched rows from the other tables.

* `User lock`

  The thread is going to request or is waiting for an advisory lock requested with a `GET_LOCK()` call. For `SHOW PROFILE`, this state means the thread is requesting the lock (not waiting for it).

* `User sleep`

  The thread has invoked a `SLEEP()` call.

* `Waiting for commit lock`

  `FLUSH TABLES WITH READ LOCK` is waiting for a commit lock.

* `waiting for handler commit`

  The thread is waiting for a transaction to commit versus other parts of query processing.

* `Waiting for tables`

  The thread got a notification that the underlying structure for a table has changed and it needs to reopen the table to get the new structure. However, to reopen the table, it must wait until all other threads have closed the table in question.

  This notification takes place if another thread has used `FLUSH TABLES` or one of the following statements on the table in question: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, or `OPTIMIZE TABLE`.

* `Waiting for table flush`

  The thread is executing [`FLUSH TABLES`](flush.html#flush-tables) and is waiting for all threads to close their tables, or the thread got a notification that the underlying structure for a table has changed and it needs to reopen the table to get the new structure. However, to reopen the table, it must wait until all other threads have closed the table in question.

  This notification takes place if another thread has used `FLUSH TABLES` or one of the following statements on the table in question: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, or `OPTIMIZE TABLE`.

* `Waiting for lock_type lock`

  The server is waiting to acquire a `THR_LOCK` lock or a lock from the metadata locking subsystem, where *`lock_type`* indicates the type of lock.

  This state indicates a wait for a `THR_LOCK`:

  + `Waiting for table level lock`

  These states indicate a wait for a metadata lock:

  + `Waiting for event metadata lock`
  + `Waiting for global read lock`
  + `Waiting for schema metadata lock`
  + `Waiting for stored function metadata lock`

  + `Waiting for stored procedure metadata lock`

  + `Waiting for table metadata lock`
  + `Waiting for trigger metadata lock`

  For information about table lock indicators, see Section 10.11.1, “Internal Locking Methods”. For information about metadata locking, see Section 10.11.4, “Metadata Locking”. To see which locks are blocking lock requests, use the Performance Schema lock tables described at Section 29.12.13, “Performance Schema Lock Tables”.

* `Waiting on cond`

  A generic state in which the thread is waiting for a condition to become true. No specific state information is available.

* `Writing to net`

  The server is writing a packet to the network.


### 10.14.4 Replication Source Thread States

The following list shows the most common states you may see in the `State` column for the `Binlog Dump` thread of the replication source. If you see no `Binlog Dump` threads on a source, this means that replication is not running; that is, that no replicas are currently connected.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Finished reading one binlog; switching to next binlog`

  The thread has finished reading a binary log file and is opening the next one to send to the replica.

* `Master has sent all binlog to slave; waiting for more updates`

  `Source has sent all binlog to replica; waiting for more updates`

  The thread has read all remaining updates from the binary logs and sent them to the replica. The thread is now idle, waiting for new events to appear in the binary log resulting from new updates occurring on the source.

* `Sending binlog event to slave`

  `Sending binlog event to replica`

  Binary logs consist of *events*, where an event is usually an update plus some other information. The thread has read an event from the binary log and is now sending it to the replica.

* `Waiting to finalize termination`

  A very brief state that occurs as the thread is stopping.


### 10.14.5 Replication I/O (Receiver) Thread States

The following list shows the most common states you see in the `State` column for a replication I/O (receiver) thread on a replica server. This state also appears in the `Replica_IO_State` column displayed by [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"), so you can get a good view of what is happening by using that statement.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Checking master version`

  `Checking source version`

  A state that occurs very briefly, after the connection to the source is established.

* `Connecting to master`

  `Connecting to source`

  The thread is attempting to connect to the source.

* `Queueing master event to the relay log`

  `Queueing source event to the relay log`

  The thread has read an event and is copying it to the relay log so that the SQL thread can process it.

* `Reconnecting after a failed binlog dump request`

  The thread is trying to reconnect to the source.

* `Reconnecting after a failed master event read`

  `Reconnecting after a failed source event read`

  The thread is trying to reconnect to the source. When connection is established again, the state becomes `Waiting for master to send event`.

* `Registering slave on master`

  `Registering replica on source`

  A state that occurs very briefly after the connection to the source is established.

* `Requesting binlog dump`

  A state that occurs very briefly, after the connection to the source is established. The thread sends to the source a request for the contents of its binary logs, starting from the requested binary log file name and position.

* `Waiting for its turn to commit`

  A state that occurs when the replica thread is waiting for older worker threads to commit if `replica_preserve_commit_order` is enabled.

* `Waiting for master to send event`

  `Waiting for source to send event`

  The thread has connected to the source and is waiting for binary log events to arrive. This can last for a long time if the source is idle. If the wait lasts for `replica_net_timeout` seconds, a timeout occurs. At that point, the thread considers the connection to be broken and makes an attempt to reconnect.

* `Waiting for master update`

  `Waiting for source update`

  The initial state before `Connecting to master` or `Connecting to source`.

* `Waiting for slave mutex on exit`

  `Waiting for replica mutex on exit`

  A state that occurs briefly as the thread is stopping.

* `Waiting for the slave SQL thread to free enough relay log space`

  `Waiting for the replica SQL thread to free enough relay log space`

  You are using a nonzero `relay_log_space_limit` value, and the relay logs have grown large enough that their combined size exceeds this value. The I/O (receiver) thread is waiting until the SQL (applier) thread frees enough space by processing relay log contents so that it can delete some relay log files.

* `Waiting to reconnect after a failed binlog dump request`

  If the binary log dump request failed (due to disconnection), the thread goes into this state while it sleeps, then tries to reconnect periodically. The interval between retries can be specified using the `CHANGE REPLICATION SOURCE TO`.

* `Waiting to reconnect after a failed master event read`

  `Waiting to reconnect after a failed source event read`

  An error occurred while reading (due to disconnection). The thread is sleeping for the number of seconds set by the `CHANGE REPLICATION SOURCE TO` statement before attempting to reconnect.


### 10.14.6 Replication SQL Thread States

The following list shows the most common states you may see in the `State` column for a replication SQL thread on a replica server.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Making temporary file (append) before replaying LOAD DATA INFILE`

  The thread is executing a [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") statement and is appending the data to a temporary file containing the data from which the replica reads rows.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

  The thread is executing a [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") statement and is creating a temporary file containing the data from which the replica reads rows. This state can only be encountered if the original `LOAD DATA` statement was logged by a source running a version of MySQL lower than MySQL 5.0.3.

* `Reading event from the relay log`

  The thread has read an event from the relay log so that the event can be processed.

* `Slave has read all relay log; waiting for more updates`

  `Replica has read all relay log; waiting for more updates`

  The thread has processed all events in the relay log files, and is now waiting for the I/O (receiver) thread to write new events to the relay log.

* `Waiting for an event from Coordinator`

  Using the multithreaded replica (`replica_parallel_workers` is greater than 1), one of the replica worker threads is waiting for an event from the coordinator thread.

* `Waiting for slave mutex on exit`

  `Waiting for replica mutex on exit`

  A very brief state that occurs as the thread is stopping.

* `Waiting for Slave Workers to free pending events`

  `Waiting for Replica Workers to free pending events`

  This waiting action occurs when the total size of events being processed by Workers exceeds the size of the `replica_pending_jobs_size_max` system variable. The Coordinator resumes scheduling when the size drops below this limit.

* `Waiting for the next event in relay log`

  The initial state before `Reading event from the relay log`.

* `Waiting until SOURCE_DELAY seconds after source executed event`

  The SQL thread has read an event but is waiting for the replica delay to lapse. This delay is set with the `SOURCE_DELAY` option of the `CHANGE REPLICATION SOURCE TO`.

The `Info` column for the SQL thread may also show the text of a statement. This indicates that the thread has read an event from the relay log, extracted the statement from it, and may be executing it.


### 10.14.7 Replication Connection Thread States

These thread states occur on a replica server but are associated with connection threads, not with the I/O or SQL threads.

* `Changing master`

  `Changing replication source`

  The thread is processing a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

* `Killing slave`

  The thread is processing a `STOP REPLICA` statement.

* `Opening master dump table`

  This state occurs after `Creating table from master dump`.

* `Reading master dump table data`

  This state occurs after `Opening master dump table`.

* `Rebuilding the index on master dump table`

  This state occurs after `Reading master dump table data`.


### 10.14.8 NDB Cluster Thread States

* `Committing events to binlog`
* `Opening mysql.ndb_apply_status`
* `Processing events`

  The thread is processing events for binary logging.

* `Processing events from schema table`

  The thread is doing the work of schema replication.

* `Shutting down`
* `Syncing ndb table schema operation and binlog`

  This is used to have a correct binary log of schema operations for NDB.

* `Waiting for allowed to take ndbcluster global schema lock`

  The thread is waiting for permission to take a global schema lock.

* `Waiting for event from ndbcluster`

  The server is acting as an SQL node in an NDB Cluster, and is connected to a cluster management node.

* `Waiting for first event from ndbcluster`
* `Waiting for ndbcluster binlog update to reach current position`

* `Waiting for ndbcluster global schema lock`

  The thread is waiting for a global schema lock held by another thread to be released.

* `Waiting for ndbcluster to start`
* `Waiting for schema epoch`

  The thread is waiting for a schema epoch (that is, a global checkpoint).


### 10.14.9 Event Scheduler Thread States

These states occur for the Event Scheduler thread, threads that are created to execute scheduled events, or threads that terminate the scheduler.

* `Clearing`

  The scheduler thread or a thread that was executing an event is terminating and is about to end.

* `Initialized`

  The scheduler thread or a thread that executes an event has been initialized.

* `Waiting for next activation`

  The scheduler has a nonempty event queue but the next activation is in the future.

* `Waiting for scheduler to stop`

  The thread issued `SET GLOBAL event_scheduler=OFF` and is waiting for the scheduler to stop.

* `Waiting on empty queue`

  The scheduler's event queue is empty and it is sleeping.
