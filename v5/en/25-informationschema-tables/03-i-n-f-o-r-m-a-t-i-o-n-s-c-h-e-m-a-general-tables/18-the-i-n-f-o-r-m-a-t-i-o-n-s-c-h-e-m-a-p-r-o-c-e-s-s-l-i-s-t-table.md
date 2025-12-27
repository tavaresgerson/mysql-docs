### 24.3.18 The INFORMATION\_SCHEMA PROCESSLIST Table

The MySQL process list indicates the operations currently being performed by the set of threads executing within the server. The [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table is one source of process information. For a comparison of this table with other sources, see [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

The [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table has these columns:

* `ID`

  The connection identifier. This is the same value displayed in the `Id` column of the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement, displayed in the `PROCESSLIST_ID` column of the Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table, and returned by the [`CONNECTION_ID()`](information-functions.html#function_connection-id) function within the thread.

* `USER`

  The MySQL user who issued the statement. A value of `system user` refers to a nonclient thread spawned by the server to handle tasks internally, for example, a delayed-row handler thread or an I/O or SQL thread used on replica hosts. For `system user`, there is no host specified in the `Host` column. `unauthenticated user` refers to a thread that has become associated with a client connection but for which authentication of the client user has not yet occurred. `event_scheduler` refers to the thread that monitors scheduled events (see [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler")).

* `HOST`

  The host name of the client issuing the statement (except for `system user`, for which there is no host). The host name for TCP/IP connections is reported in `host_name:client_port` format to make it easier to determine which client is doing what.

* `DB`

  The default database for the thread, or `NULL` if none has been selected.

* `COMMAND`

  The type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

* `TIME`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `STATE`

  An action, event, or state that indicates what the thread is doing. For descriptions of `STATE` values, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information").

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that needs to be investigated.

* `INFO`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, the `INFO` value shows the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

#### Notes

* [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") is a nonstandard `INFORMATION_SCHEMA` table.

* Like the output from the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement, the [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table provides information about all threads, even those belonging to other users, if you have the [`PROCESS`](privileges-provided.html#priv_process) privilege. Otherwise (without the [`PROCESS`](privileges-provided.html#priv_process) privilege), nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

* If an SQL statement refers to the [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table, MySQL populates the entire table once, when statement execution begins, so there is read consistency during the statement. There is no read consistency for a multi-statement transaction.

The following statements are equivalent:

```sql
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```
