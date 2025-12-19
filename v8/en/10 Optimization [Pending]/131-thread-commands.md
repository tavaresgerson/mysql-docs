--- title: MySQL 8.4 Reference Manual :: 10.14.2 Thread Command Values url: https://dev.mysql.com/doc/refman/8.4/en/thread-commands.html order: 131 ---



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

