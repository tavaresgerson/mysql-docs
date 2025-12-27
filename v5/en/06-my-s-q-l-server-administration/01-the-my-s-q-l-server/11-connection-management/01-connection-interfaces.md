#### 5.1.11.1 Connection Interfaces

This section describes aspects of how the MySQL server manages client connections.

* [Network Interfaces and Connection Manager Threads](connection-interfaces.html#connection-interfaces-interfaces "Network Interfaces and Connection Manager Threads")
* [Client Connection Thread Management](connection-interfaces.html#connection-interfaces-thread-management "Client Connection Thread Management")
* [Connection Volume Management](connection-interfaces.html#connection-interfaces-volume-management "Connection Volume Management")

##### Network Interfaces and Connection Manager Threads

The server is capable of listening for client connections on multiple network interfaces. Connection manager threads handle client connection requests on the network interfaces that the server listens to:

* On all platforms, one manager thread handles TCP/IP connection requests.

* On Unix, the same manager thread also handles Unix socket file connection requests.

* On Windows, one manager thread handles shared-memory connection requests, and another handles named-pipe connection requests.

The server does not create threads to handle interfaces that it does not listen to. For example, a Windows server that does not have support for named-pipe connections enabled does not create a thread to handle them.

Individual server plugins or components may implement their own connection interface:

* X Plugin enables MySQL Server to communicate with clients using X Protocol. See [Section 19.4, “X Plugin”](x-plugin.html "19.4 X Plugin").

##### Client Connection Thread Management

Connection manager threads associate each client connection with a thread dedicated to it that handles authentication and request processing for that connection. Manager threads create a new thread when necessary but try to avoid doing so by consulting the thread cache first to see whether it contains a thread that can be used for the connection. When a connection ends, its thread is returned to the thread cache if the cache is not full.

In this connection thread model, there are as many threads as there are clients currently connected, which has some disadvantages when server workload must scale to handle large numbers of connections. For example, thread creation and disposal becomes expensive. Also, each thread requires server and kernel resources, such as stack space. To accommodate a large number of simultaneous connections, the stack size per thread must be kept small, leading to a situation where it is either too small or the server consumes large amounts of memory. Exhaustion of other resources can occur as well, and scheduling overhead can become significant.

MySQL Enterprise Edition includes a thread pool plugin that provides an alternative thread-handling model designed to reduce overhead and improve performance. It implements a thread pool that increases server performance by efficiently managing statement execution threads for large numbers of client connections. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

To control and monitor how the server manages threads that handle client connections, several system and status variables are relevant. (See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), and [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").)

* The [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) system variable determines the thread cache size. By default, the server autosizes the value at startup, but it can be set explicitly to override this default. A value of 0 disables caching, which causes a thread to be set up for each new connection and disposed of when the connection terminates. To enable *`N`* inactive connection threads to be cached, set [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) to *`N`* at server startup or at runtime. A connection thread becomes inactive when the client connection with which it was associated terminates.

* To monitor the number of threads in the cache and how many threads have been created because a thread could not be taken from the cache, check the [`Threads_cached`](server-status-variables.html#statvar_Threads_cached) and [`Threads_created`](server-status-variables.html#statvar_Threads_created) status variables.

* When the thread stack is too small, this limits the complexity of the SQL statements the server can handle, the recursion depth of stored procedures, and other memory-consuming actions. To set a stack size of *`N`* bytes for each thread, start the server with [`thread_stack`](server-system-variables.html#sysvar_thread_stack) set to *`N`*.

##### Connection Volume Management

To control the maximum number of clients the server permits to connect simultaneously, set the [`max_connections`](server-system-variables.html#sysvar_max_connections) system variable at server startup or at runtime. It may be necessary to increase [`max_connections`](server-system-variables.html#sysvar_max_connections) if more clients attempt to connect simultaneously then the server is configured to handle (see [Section B.3.2.5, “Too many connections”](too-many-connections.html "B.3.2.5 Too many connections")).

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") actually permits [`max_connections`](server-system-variables.html#sysvar_max_connections)

+ 1 client connections. The extra connection is reserved for use by accounts that have the [`SUPER`](privileges-provided.html#priv_super) privilege. By granting the privilege to administrators and not to normal users (who should not need it), an administrator who also has the [`PROCESS`](privileges-provided.html#priv_process) privilege can connect to the server and use [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") to diagnose problems even if the maximum number of unprivileged clients are connected. See [Section 13.7.5.29, “SHOW PROCESSLIST Statement”](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

If the server refuses a connection because the [`max_connections`](server-system-variables.html#sysvar_max_connections) limit is reached, it increments the [`Connection_errors_max_connections`](server-status-variables.html#statvar_Connection_errors_max_connections) status variable.

The maximum number of connections MySQL supports (that is, the maximum value to which [`max_connections`](server-system-variables.html#sysvar_max_connections) can be set) depends on several factors:

* The quality of the thread library on a given platform.
* The amount of RAM available.
* The amount of RAM is used for each connection.
* The workload from each connection.
* The desired response time.
* The number of file descriptors available.

Linux or Solaris should be able to support at least 500 to 1000 simultaneous connections routinely and as many as 10,000 connections if you have many gigabytes of RAM available and the workload from each is low or the response time target undemanding.

Increasing the [`max_connections`](server-system-variables.html#sysvar_max_connections) value increases the number of file descriptors that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") requires. If the required number of descriptors are not available, the server reduces the value of [`max_connections`](server-system-variables.html#sysvar_max_connections). For comments on file descriptor limits, see [Section 8.4.3.1, “How MySQL Opens and Closes Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables").

Increasing the [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) system variable may be necessary, which may also require raising the operating system limit on how many file descriptors can be used by MySQL. Consult your operating system documentation to determine whether it is possible to increase the limit and how to do so. See also [Section B.3.2.16, “File Not Found and Similar Errors”](not-enough-file-handles.html "B.3.2.16 File Not Found and Similar Errors").
