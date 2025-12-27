### 5.1.16 The Server Shutdown Process

The server shutdown process takes place as follows:

1. The shutdown process is initiated.

   This can occur initiated several ways. For example, a user with the [`SHUTDOWN`](privileges-provided.html#priv_shutdown) privilege can execute a [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command. [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") can be used on any platform supported by MySQL. Other operating system-specific shutdown initiation methods are possible as well: The server shuts down on Unix when it receives a `SIGTERM` signal. A server running as a service on Windows shuts down when the services manager tells it to.

2. The server creates a shutdown thread if necessary.

   Depending on how shutdown was initiated, the server might create a thread to handle the shutdown process. If shutdown was requested by a client, a shutdown thread is created. If shutdown is the result of receiving a `SIGTERM` signal, the signal thread might handle shutdown itself, or it might create a separate thread to do so. If the server tries to create a shutdown thread and cannot (for example, if memory is exhausted), it issues a diagnostic message that appears in the error log:

   ```sql
   Error: Can't create thread to kill server
   ```

3. The server stops accepting new connections.

   To prevent new activity from being initiated during shutdown, the server stops accepting new client connections by closing the handlers for the network interfaces to which it normally listens for connections: the TCP/IP port, the Unix socket file, the Windows named pipe, and shared memory on Windows.

4. The server terminates current activity.

   For each thread associated with a client connection, the server breaks the connection to the client and marks the thread as killed. Threads die when they notice that they are so marked. Threads for idle connections die quickly. Threads that currently are processing statements check their state periodically and take longer to die. For additional information about thread termination, see [Section 13.7.6.4, “KILL Statement”](kill.html "13.7.6.4 KILL Statement"), in particular for the instructions about killed [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") or [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") operations on `MyISAM` tables.

   For threads that have an open transaction, the transaction is rolled back. If a thread is updating a nontransactional table, an operation such as a multiple-row [`UPDATE`](update.html "13.2.11 UPDATE Statement") or [`INSERT`](insert.html "13.2.5 INSERT Statement") may leave the table partially updated because the operation can terminate before completion.

   If the server is a source replication server, it treats threads associated with currently connected replicas like other client threads. That is, each one is marked as killed and exits when it next checks its state.

   If the server is a replica, it stops the I/O and SQL threads, if they are active, before marking client threads as killed. The SQL thread is permitted to finish its current statement (to avoid causing replication problems), and then stops. If the SQL thread is in the middle of a transaction at this point, the server waits until the current replication event group (if any) has finished executing, or until the user issues a [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") or [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement") statement. See also [Section 13.4.2.6, “STOP SLAVE Statement”](stop-slave.html "13.4.2.6 STOP SLAVE Statement"). Since nontransactional statements cannot be rolled back, in order to guarantee crash-safe replication, only transactional tables should be used.

   Note

   To guarantee crash safety on the replica, you must run the replica with [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) enabled.

   See also [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")).

5. The server shuts down or closes storage engines.

   At this stage, the server flushes the table cache and closes all open tables.

   Each storage engine performs any actions necessary for tables that it manages. `InnoDB` flushes its buffer pool to disk (unless [`innodb_fast_shutdown`](innodb-parameters.html#sysvar_innodb_fast_shutdown) is 2), writes the current LSN to the tablespace, and terminates its own internal threads. `MyISAM` flushes any pending index writes for a table.

6. The server exits.

To provide information to management processes, the server returns one of the exit codes described in the following list. The phrase in parentheses indicates the action taken by systemd in response to the code, for platforms on which systemd is used to manage the server.

* 0 = successful termination (no restart done)
* 1 = unsuccessful termination (no restart done)
* 2 = unsuccessful termination (restart done)
