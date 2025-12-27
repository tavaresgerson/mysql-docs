#### 13.7.6.4 KILL Statement

```sql
KILL [CONNECTION | QUERY] processlist_id
```

Each connection to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") runs in a separate thread. You can kill a thread with the `KILL processlist_id` statement.

Thread processlist identifiers can be determined from the `ID` column of the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table, the `Id` column of [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output, and the `PROCESSLIST_ID` column of the Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table. The value for the current thread is returned by the [`CONNECTION_ID()`](information-functions.html#function_connection-id) function.

[`KILL`](kill.html "13.7.6.4 KILL Statement") permits an optional `CONNECTION` or `QUERY` modifier:

* [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement") is the same as [`KILL`](kill.html "13.7.6.4 KILL Statement") with no modifier: It terminates the connection associated with the given *`processlist_id`*, after terminating any statement the connection is executing.

* [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") terminates the statement the connection is currently executing, but leaves the connection itself intact.

The ability to see which threads are available to be killed depends on the [`PROCESS`](privileges-provided.html#priv_process) privilege:

* Without [`PROCESS`](privileges-provided.html#priv_process), you can see only your own threads.

* With [`PROCESS`](privileges-provided.html#priv_process), you can see all threads.

The ability to kill threads and statements depends on the [`SUPER`](privileges-provided.html#priv_super) privilege:

* Without [`SUPER`](privileges-provided.html#priv_super), you can kill only your own threads and statements.

* With [`SUPER`](privileges-provided.html#priv_super), you can kill all threads and statements.

You can also use the [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") and [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") commands to examine and kill threads.

Note

You cannot use [`KILL`](kill.html "13.7.6.4 KILL Statement") with the Embedded MySQL Server library because the embedded server merely runs inside the threads of the host application. It does not create any connection threads of its own.

When you use [`KILL`](kill.html "13.7.6.4 KILL Statement"), a thread-specific kill flag is set for the thread. In most cases, it might take some time for the thread to die because the kill flag is checked only at specific intervals:

* During [`SELECT`](select.html "13.2.9 SELECT Statement") operations, for `ORDER BY` and `GROUP BY` loops, the flag is checked after reading a block of rows. If the kill flag is set, the statement is aborted.

* [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations that make a table copy check the kill flag periodically for each few copied rows read from the original table. If the kill flag was set, the statement is aborted and the temporary table is deleted.

  The [`KILL`](kill.html "13.7.6.4 KILL Statement") statement returns without waiting for confirmation, but the kill flag check aborts the operation within a reasonably small amount of time. Aborting the operation to perform any necessary cleanup also takes some time.

* During [`UPDATE`](update.html "13.2.11 UPDATE Statement") or [`DELETE`](delete.html "13.2.2 DELETE Statement") operations, the kill flag is checked after each block read and after each updated or deleted row. If the kill flag is set, the statement is aborted. If you are not using transactions, the changes are not rolled back.

* [`GET_LOCK()`](locking-functions.html#function_get-lock) aborts and returns `NULL`.

* If the thread is in the table lock handler (state: `Locked`), the table lock is quickly aborted.

* If the thread is waiting for free disk space in a write call, the write is aborted with a “disk full” error message.

Warning

Killing a [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") or [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") operation on a `MyISAM` table results in a table that is corrupted and unusable. Any reads or writes to such a table fail until you optimize or repair it again (without interruption).
