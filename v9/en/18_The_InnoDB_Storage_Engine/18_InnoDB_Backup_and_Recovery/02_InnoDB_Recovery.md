### 17.18.2 InnoDB Recovery

This section describes `InnoDB` recovery. Topics
include:

* [Point-in-Time Recovery](innodb-recovery.html#innodb-recovery-point-in-time "Point-in-Time Recovery")
* [Recovery from Data Corruption or Disk Failure](innodb-recovery.html#innodb-corruption-disk-failure-recovery "Recovery from Data Corruption or Disk Failure")
* [InnoDB Crash Recovery](innodb-recovery.html#innodb-crash-recovery "InnoDB Crash Recovery")
* [Tablespace Discovery During Crash Recovery](innodb-recovery.html#innodb-recovery-tablespace-discovery "Tablespace Discovery During Crash Recovery")

#### Point-in-Time Recovery

To recover an `InnoDB` database to the present
from the time at which the physical backup was made, you must
run MySQL server with binary logging enabled, even before taking
the backup. To achieve point-in-time recovery after restoring a
backup, you can apply changes from the binary log that occurred
after the backup was made. See
[Section 9.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "9.5 Point-in-Time (Incremental) Recovery").

#### Recovery from Data Corruption or Disk Failure

If your database becomes corrupted or disk failure occurs, you
must perform the recovery using a backup. In the case of
corruption, first find a backup that is not corrupted. After
restoring the base backup, do a point-in-time recovery from the
binary log files using [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") and
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to restore the changes that occurred
after the backup was made.

In some cases of database corruption, it is enough to dump,
drop, and re-create one or a few corrupt tables. You can use the
[`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") statement to check
whether a table is corrupt, although [`CHECK
TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") naturally cannot detect every possible kind of
corruption.

In some cases, apparent database page corruption is actually due
to the operating system corrupting its own file cache, and the
data on disk may be okay. It is best to try restarting the
computer first. Doing so may eliminate errors that appeared to
be database page corruption. If MySQL still has trouble starting
because of `InnoDB` consistency problems, see
[Section 17.20.3, “Forcing InnoDB Recovery”](forcing-innodb-recovery.html "17.20.3 Forcing InnoDB Recovery") for steps to start the
instance in recovery mode, which permits you to dump the data.

#### InnoDB Crash Recovery

To recover from an unexpected MySQL server exit, the only
requirement is to restart the MySQL server.
`InnoDB` automatically checks the logs and
performs a roll-forward of the database to the present.
`InnoDB` automatically rolls back uncommitted
transactions that were present at the time of the crash.

`InnoDB`
[crash recovery](glossary.html#glos_crash_recovery "crash recovery")
consists of several steps:

* Tablespace discovery

  Tablespace discovery is the process that
  `InnoDB` uses to identify tablespaces that
  require redo log application. See
  [Tablespace Discovery During Crash Recovery](innodb-recovery.html#innodb-recovery-tablespace-discovery "Tablespace Discovery During Crash Recovery").

* [Redo log](glossary.html#glos_redo_log "redo log") application

  Redo log application is performed during initialization,
  before accepting any connections. If all changes are flushed
  from the [buffer pool](glossary.html#glos_buffer_pool "buffer pool")
  to the [tablespaces](glossary.html#glos_tablespace "tablespace")
  (`ibdata*` and `*.ibd`
  files) at the time of the shutdown or crash, redo log
  application is skipped. `InnoDB` also skips
  redo log application if redo log files are missing at
  startup.

  + The current maximum auto-increment counter value is
    written to the redo log each time the value changes,
    which makes it crash-safe. During recovery,
    `InnoDB` scans the redo log to collect
    counter value changes and applies the changes to the
    in-memory table object.

    For more information about how `InnoDB`
    handles auto-increment values, see
    [Section 17.6.1.6, “AUTO\_INCREMENT Handling in InnoDB”](innodb-auto-increment-handling.html "17.6.1.6 AUTO_INCREMENT Handling in InnoDB"), and
    [InnoDB AUTO\_INCREMENT Counter Initialization](innodb-auto-increment-handling.html#innodb-auto-increment-initialization "InnoDB AUTO_INCREMENT Counter Initialization").

  + When encountering index tree corruption,
    `InnoDB` writes a corruption flag to
    the redo log, which makes the corruption flag
    crash-safe. `InnoDB` also writes
    in-memory corruption flag data to an engine-private
    system table on each checkpoint. During recovery,
    `InnoDB` reads corruption flags from
    both locations and merges results before marking
    in-memory table and index objects as corrupt.

  + Removing redo logs to speed up recovery is not
    recommended, even if some data loss is acceptable.
    Removing redo logs should only be considered after a
    clean shutdown, with
    [`innodb_fast_shutdown`](innodb-parameters.html#sysvar_innodb_fast_shutdown)
    set to `0` or `1`.

* [Roll back](glossary.html#glos_rollback "rollback") of incomplete
  [transactions](glossary.html#glos_transaction "transaction")

  Incomplete transactions are any transactions that were
  active at the time of unexpected exit or
  [fast shutdown](glossary.html#glos_fast_shutdown "fast shutdown"). The
  time it takes to roll back an incomplete transaction can be
  three or four times the amount of time a transaction is
  active before it is interrupted, depending on server load.

  You cannot cancel transactions that are being rolled back.
  In extreme cases, when rolling back transactions is expected
  to take an exceptionally long time, it may be faster to
  start `InnoDB` with an
  [`innodb_force_recovery`](innodb-parameters.html#sysvar_innodb_force_recovery)
  setting of `3` or greater. See
  [Section 17.20.3, “Forcing InnoDB Recovery”](forcing-innodb-recovery.html "17.20.3 Forcing InnoDB Recovery").

* [Change buffer](glossary.html#glos_change_buffer "change buffer")
  merge

  Applying changes from the change buffer (part of the
  [system
  tablespace](/doc/refman/8.4/en/glossary.html#glos_system_tablespace)) to leaf pages of secondary indexes, as
  the index pages are read to the buffer pool.

* [Purge](/doc/refman/8.4/en/glossary.html#glos_purge)

  Deleting delete-marked records that are no longer visible to
  active transactions.

The steps that follow redo log application do not depend on the
redo log (other than for logging the writes) and are performed
in parallel with normal processing. Of these, only rollback of
incomplete transactions is special to crash recovery. The insert
buffer merge and the purge are performed during normal
processing.

After redo log application, `InnoDB` attempts
to accept connections as early as possible, to reduce downtime.
As part of crash recovery, `InnoDB` rolls back
transactions that were not committed or in `XA
PREPARE` state when the server exited. The rollback is
performed by a background thread, executed in parallel with
transactions from new connections. Until the rollback operation
is completed, new connections may encounter locking conflicts
with recovered transactions.

In most situations, even if the MySQL server was killed
unexpectedly in the middle of heavy activity, the recovery
process happens automatically and no action is required of the
DBA. If a hardware failure or severe system error corrupted
`InnoDB` data, MySQL might refuse to start. In
this case, see [Section 17.20.3, “Forcing InnoDB Recovery”](forcing-innodb-recovery.html "17.20.3 Forcing InnoDB Recovery").

For information about the binary log and
`InnoDB` crash recovery, see
[Section 7.4.4, “The Binary Log”](binary-log.html "7.4.4 The Binary Log").

#### Tablespace Discovery During Crash Recovery

If, during recovery, `InnoDB` encounters redo
logs written since the last checkpoint, the redo logs must be
applied to affected tablespaces. The process that identifies
affected tablespaces during recovery is referred to as
*tablespace discovery*.

Tablespace discovery relies on the
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) setting,
which defines the directories to scan at startup for tablespace
files. The [`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories)
default setting is NULL, but the directories defined by
[`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir),
[`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory), and
[`datadir`](server-system-variables.html#sysvar_datadir) are always appended to
the [`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) argument
value when InnoDB builds a list of directories to scan at
startup. These directories are appended regardless of whether an
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) setting is
specified explicitly. Tablespace files defined with an absolute
path or that reside outside of the directories appended to the
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) setting
should be added to the
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) setting.
Recovery is terminated if any tablespace file referenced in a
redo log has not been discovered previously.