### 14.8.2 Configuring InnoDB for Read-Only Operation

You can query `InnoDB` tables where the MySQL
data directory is on read-only media by enabling the
[`--innodb-read-only`](innodb-parameters.html#sysvar_innodb_read_only) configuration
option at server startup.

#### How to Enable

To prepare an instance for read-only operation, make sure all the
necessary information is [flushed](glossary.html#glos_flush "flush")
to the data files before storing it on the read-only medium. Run
the server with change buffering disabled
([`innodb_change_buffering=0`](innodb-parameters.html#sysvar_innodb_change_buffering)) and
do a [slow shutdown](glossary.html#glos_slow_shutdown "slow shutdown").

To enable read-only mode for an entire MySQL instance, specify the
following configuration options at server startup:

* [`--innodb-read-only=1`](innodb-parameters.html#sysvar_innodb_read_only)
* If the instance is on read-only media such as a DVD or CD, or
  the `/var` directory is not writeable by
  all:
  [`--pid-file=path_on_writeable_media`](server-system-variables.html#sysvar_pid_file)
  and
  [`--event-scheduler=disabled`](server-system-variables.html#sysvar_event_scheduler)

* [`--innodb-temp-data-file-path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path).
  This option specifies the path, file name, and file size for
  `InnoDB` temporary tablespace data files. The
  default setting is `ibtmp1:12M:autoextend`,
  which creates the `ibtmp1` temporary
  tablespace data file in the data directory. To prepare an
  instance for read-only operation, set
  [`innodb_temp_data_file_path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path) to
  a location outside of the data directory. The path must be
  relative to the data directory. For example:

  ```sql
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

#### Usage Scenarios

This mode of operation is appropriate in situations such as:

* Distributing a MySQL application, or a set of MySQL data, on a
  read-only storage medium such as a DVD or CD.

* Multiple MySQL instances querying the same data directory
  simultaneously, typically in a data warehousing configuration.
  You might use this technique to avoid
  [bottlenecks](glossary.html#glos_bottleneck "bottleneck") that can
  occur with a heavily loaded MySQL instance, or you might use
  different configuration options for the various instances to
  tune each one for particular kinds of queries.

* Querying data that has been put into a read-only state for
  security or data integrity reasons, such as archived backup
  data.

Note

This feature is mainly intended for flexibility in distribution
and deployment, rather than raw performance based on the
read-only aspect. See
[Section 8.5.3, “Optimizing InnoDB Read-Only Transactions”](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions") for ways to tune the
performance of read-only queries, which do not require making
the entire server read-only.

#### How It Works

When the server is run in read-only mode through the
[`--innodb-read-only`](innodb-parameters.html#sysvar_innodb_read_only) option,
certain `InnoDB` features and components are
reduced or turned off entirely:

* No [change
  buffering](glossary.html#glos_change_buffering "change buffering") is done, in particular no merges from the
  change buffer. To make sure the change buffer is empty when
  you prepare the instance for read-only operation, disable
  change buffering
  ([`innodb_change_buffering=0`](innodb-parameters.html#sysvar_innodb_change_buffering))
  and do a [slow
  shutdown](glossary.html#glos_slow_shutdown "slow shutdown") first.

* There is no [crash
  recovery](glossary.html#glos_crash_recovery "crash recovery") phase at startup. The instance must have
  performed a [slow
  shutdown](glossary.html#glos_slow_shutdown "slow shutdown") before being put into the read-only state.

* Because the [redo log](glossary.html#glos_redo_log "redo log") is
  not used in read-only operation, you can set
  [`innodb_log_file_size`](innodb-parameters.html#sysvar_innodb_log_file_size) to the
  smallest size possible (1 MB) before making the instance
  read-only.

* Most background threads are turned off. I/O read threads
  remain, as well as I/O write threads and a page cleaner thread
  for writes to temporary files, which are permitted in
  read-only mode.

* Information about deadlocks, monitor output, and so on is not
  written to temporary files. As a consequence,
  [`SHOW ENGINE
  INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") does not produce any output.

* If the MySQL server is started with
  [`--innodb-read-only`](innodb-parameters.html#sysvar_innodb_read_only) but the
  data directory is still on writeable media, the root user can
  still perform [DCL](glossary.html#glos_dcl "DCL") operations
  such as [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and
  [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement").

* Changes to configuration option settings that would normally
  change the behavior of write operations, have no effect when
  the server is in read-only mode.

* The [MVCC](glossary.html#glos_mvcc "MVCC") processing to
  enforce [isolation
  levels](glossary.html#glos_isolation_level "isolation level") is turned off. All queries read the latest
  version of a record, because update and deletes are not
  possible.

* The [undo log](glossary.html#glos_undo_log "undo log") is not used.
  Disable any settings for the
  [`innodb_undo_tablespaces`](innodb-parameters.html#sysvar_innodb_undo_tablespaces) and
  [`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory)
  configuration options.