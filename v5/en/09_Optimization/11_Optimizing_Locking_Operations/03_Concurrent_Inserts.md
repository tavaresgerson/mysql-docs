### 8.11.3 Concurrent Inserts

The `MyISAM` storage engine supports concurrent
inserts to reduce contention between readers and writers for a
given table: If a `MyISAM` table has no holes
in the data file (deleted rows in the middle), an
[`INSERT`](insert.html "13.2.5 INSERT Statement") statement can be executed
to add rows to the end of the table at the same time that
[`SELECT`](select.html "13.2.9 SELECT Statement") statements are reading
rows from the table. If there are multiple
[`INSERT`](insert.html "13.2.5 INSERT Statement") statements, they are
queued and performed in sequence, concurrently with the
[`SELECT`](select.html "13.2.9 SELECT Statement") statements. The results of
a concurrent [`INSERT`](insert.html "13.2.5 INSERT Statement") may not be
visible immediately.

The [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert) system
variable can be set to modify the concurrent-insert processing.
By default, the variable is set to `AUTO` (or
1) and concurrent inserts are handled as just described. If
[`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert) is set to
`NEVER` (or 0), concurrent inserts are
disabled. If the variable is set to `ALWAYS`
(or 2), concurrent inserts at the end of the table are permitted
even for tables that have deleted rows. See also the description
of the [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert) system
variable.

If you are using the binary log, concurrent inserts are
converted to normal inserts for `CREATE ...
SELECT` or
[`INSERT ...
SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements. This is done to ensure that you can
re-create an exact copy of your tables by applying the log
during a backup operation. See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log"). In
addition, for those statements a read lock is placed on the
selected-from table such that inserts into that table are
blocked. The effect is that concurrent inserts for that table
must wait as well.

With [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), if you specify
`CONCURRENT` with a `MyISAM`
table that satisfies the condition for concurrent inserts (that
is, it contains no free blocks in the middle), other sessions
can retrieve data from the table while [`LOAD
DATA`](load-data.html "13.2.6 LOAD DATA Statement") is executing. Use of the
`CONCURRENT` option affects the performance of
[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") a bit, even if no other
session is using the table at the same time.

If you specify `HIGH_PRIORITY`, it overrides
the effect of the
[`--low-priority-updates`](server-system-variables.html#sysvar_low_priority_updates) option if
the server was started with that option. It also causes
concurrent inserts not to be used.

For [`LOCK
TABLE`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), the difference between `READ
LOCAL` and `READ` is that
`READ LOCAL` permits nonconflicting
[`INSERT`](insert.html "13.2.5 INSERT Statement") statements (concurrent
inserts) to execute while the lock is held. However, this cannot
be used if you are going to manipulate the database using
processes external to the server while you hold the lock.