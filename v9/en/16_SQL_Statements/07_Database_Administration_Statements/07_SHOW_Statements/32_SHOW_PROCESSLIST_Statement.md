#### 15.7.7.32 SHOW PROCESSLIST Statement

```
SHOW [FULL] PROCESSLIST
```

Important

The INFORMATION SCHEMA implementation of
[`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") is deprecated
and subject to removal in a future MySQL release. It is
recommended to use the Performance Schema implementation of
`SHOW PROCESSLIST` instead.

The MySQL process list indicates the operations currently being
performed by the set of threads executing within the server. The
[`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") statement is one
source of process information. For a comparison of this
statement with other sources, see
[Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

Note

An alternative implementation for [`SHOW
PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") is available based on the Performance
Schema [`processlist`](performance-schema-processlist-table.html "29.12.22.9 The processlist Table") table, which,
unlike the default [`SHOW
PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") implementation, does not require a mutex
and has better performance characteristics. For details, see
[Section 29.12.22.9, “The processlist Table”](performance-schema-processlist-table.html "29.12.22.9 The processlist Table").

If you have the [`PROCESS`](privileges-provided.html#priv_process)
privilege, you can see all threads, even those belonging to
other users. Otherwise (without the
[`PROCESS`](privileges-provided.html#priv_process) privilege), nonanonymous
users have access to information about their own threads but not
threads for other users, and anonymous users have no access to
thread information.

Without the `FULL` keyword,
[`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") displays only
the first 100 characters of each statement in the
`Info` field.

The [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") statement is
very useful if you get the “too many connections”
error message and want to find out what is going on. MySQL
reserves one extra connection to be used by accounts that have
the [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) privilege
(or the deprecated [`SUPER`](privileges-provided.html#priv_super)
privilege), to ensure that administrators should always be able
to connect and check the system (assuming that you are not
giving this privilege to all your users).

Threads can be killed with the
[`KILL`](kill.html "15.7.8.4 KILL Statement") statement. See
[Section 15.7.8.4, “KILL Statement”](kill.html "15.7.8.4 KILL Statement").

Example of [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement")
output:

```
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for source to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the replica
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to replica; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to replica; waiting for binlog to be updated
   Info: NULL
*************************** 5. row ***************************
     Id: 3123
   User: stefan
   Host: localhost
     db: apollon
Command: Query
   Time: 0
  State: NULL
   Info: SHOW FULL PROCESSLIST
```

[`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") output has these
columns:

* `Id`

  The connection identifier. This is the same value displayed
  in the `ID` column of the
  `INFORMATION_SCHEMA`
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table") table, displayed in
  the `PROCESSLIST_ID` column of the
  Performance Schema [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table")
  table, and returned by the
  [`CONNECTION_ID()`](information-functions.html#function_connection-id) function
  within the thread.

* `User`

  The MySQL user who issued the statement. A value of
  `system user` refers to a nonclient thread
  spawned by the server to handle tasks internally, for
  example, a delayed-row handler thread or an I/O (receiver)
  or SQL (applier) thread used on replica hosts. For
  `system user`, there is no host specified
  in the `Host` column.
  `unauthenticated user` refers to a thread
  that has become associated with a client connection but for
  which authentication of the client user has not yet
  occurred. `event_scheduler` refers to the
  thread that monitors scheduled events (see
  [Section 27.5, “Using the Event Scheduler”](event-scheduler.html "27.5 Using the Event Scheduler")).

  Note

  A `User` value of `system
  user` is distinct from the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege. The
  former designates internal threads. The latter
  distinguishes the system user and regular user account
  categories (see [Section 8.2.11, “Account Categories”](account-categories.html "8.2.11 Account Categories")).

* `Host`

  The host name of the client issuing the statement (except
  for `system user`, for which there is no
  host). The host name for TCP/IP connections is reported in
  `host_name:client_port`
  format to make it easier to determine which client is doing
  what.

* `db`

  The default database for the thread, or
  `NULL` if none has been selected.

* `Command`

  The type of command the thread is executing on behalf of the
  client, or `Sleep` if the session is idle.
  For descriptions of thread commands, see
  [Section 10.14, “Examining Server Thread (Process) Information”](thread-information.html "10.14 Examining Server Thread (Process) Information"). The value of this
  column corresponds to the
  `COM_xxx`
  commands of the client/server protocol and
  `Com_xxx` status
  variables. See [Section 7.1.10, “Server Status Variables”](server-status-variables.html "7.1.10 Server Status Variables").

* `Time`

  The time in seconds that the thread has been in its current
  state. For a replica SQL thread, the value is the number of
  seconds between the timestamp of the last replicated event
  and the real time of the replica host. See
  [Section 19.2.3, “Replication Threads”](replication-threads.html "19.2.3 Replication Threads").

* `State`

  An action, event, or state that indicates what the thread is
  doing. For descriptions of `State` values,
  see [Section 10.14, “Examining Server Thread (Process) Information”](thread-information.html "10.14 Examining Server Thread (Process) Information").

  Most states correspond to very quick operations. If a thread
  stays in a given state for many seconds, there might be a
  problem that needs to be investigated.

* `Info`

  The statement the thread is executing, or
  `NULL` if it is executing no statement. The
  statement might be the one sent to the server, or an
  innermost statement if the statement executes other
  statements. For example, if a `CALL`
  statement executes a stored procedure that is executing a
  [`SELECT`](select.html "15.2.13 SELECT Statement") statement, the
  `Info` value shows the
  [`SELECT`](select.html "15.2.13 SELECT Statement") statement.