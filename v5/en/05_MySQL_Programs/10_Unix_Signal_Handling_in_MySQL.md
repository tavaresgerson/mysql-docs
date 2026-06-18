## 4.10 Unix Signal Handling in MySQL

On Unix and Unix-like systems, a process can be the recipient of
signals sent to it by the `root` system account
or the system account that owns the process. Signals can be sent
using the [**kill**](kill.html "13.7.6.4 KILL Statement") command. Some command
interpreters associate certain key sequences with signals, such as
**Control+C** to send a `SIGINT`
signal. This section describes how the MySQL server and client
programs respond to signals.

* [Server Response to Signals](unix-signal-response.html#server-signal-response "Server Response to Signals")
* [Client Response to Signals](unix-signal-response.html#client-signal-response "Client Response to Signals")

### Server Response to Signals

[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") responds to signals as follows:

* `SIGTERM` causes the server to shut down.
  This is like executing a
  [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") statement without
  having to connect to the server (which for shutdown requires
  an account that has the
  [`SHUTDOWN`](privileges-provided.html#priv_shutdown) privilege).

* `SIGHUP` causes the server to reload the
  grant tables and to flush tables, logs, the thread cache,
  and the host cache. These actions are like various forms of
  the [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement. Sending
  the signal enables the flush operations to be performed
  without having to connect to the server, which requires a
  MySQL account that has privileges sufficient for those
  operations. The server also writes a status report to the
  error log that has this format:

  ```sql
  Status information:

  Current dir: /var/mysql/data/
  Running threads: 4  Stack size: 262144
  Current locks:
  lock: 0x7f742c02c0e0:

  lock: 0x2cee2a20:
  :
  lock: 0x207a080:

  Key caches:
  default
  Buffer_size:       8388608
  Block_size:           1024
  Division_limit:        100
  Age_limit:             300
  blocks used:             4
  not flushed:             0
  w_requests:              0
  writes:                  0
  r_requests:              8
  reads:                   4

  handler status:
  read_key:           13
  read_next:           4
  read_rnd             0
  read_first:         13
  write:               1
  delete               0
  update:              0

  Table status:
  Opened tables:        121
  Open tables:          114
  Open files:            18
  Open streams:           0

  Memory status:
  <malloc version="1">
  <heap nr="0">
  <sizes>
    <size from="17" to="32" total="32" count="1"/>
    <size from="33" to="48" total="96" count="2"/>
    <size from="33" to="33" total="33" count="1"/>
    <size from="97" to="97" total="6014" count="62"/>
    <size from="113" to="113" total="904" count="8"/>
    <size from="193" to="193" total="193" count="1"/>
    <size from="241" to="241" total="241" count="1"/>
    <size from="609" to="609" total="609" count="1"/>
    <size from="16369" to="16369" total="49107" count="3"/>
    <size from="24529" to="24529" total="98116" count="4"/>
    <size from="32689" to="32689" total="32689" count="1"/>
    <unsorted from="241" to="7505" total="7746" count="2"/>
  </sizes>
  <total type="fast" count="3" size="128"/>
  <total type="rest" count="84" size="195652"/>
  <system type="current" size="690774016"/>
  <system type="max" size="690774016"/>
  <aspace type="total" size="690774016"/>
  <aspace type="mprotect" size="690774016"/>
  </heap>
  :
  <total type="fast" count="85" size="5520"/>
  <total type="rest" count="116" size="316820"/>
  <total type="mmap" count="82" size="939954176"/>
  <system type="current" size="695717888"/>
  <system type="max" size="695717888"/>
  <aspace type="total" size="695717888"/>
  <aspace type="mprotect" size="695717888"/>
  </malloc>

  Events status:
  LLA = Last Locked At  LUA = Last Unlocked At
  WOC = Waiting On Condition  DL = Data Locked

  Event scheduler status:
  State      : INITIALIZED
  Thread id  : 0
  LLA        : n/a:0
  LUA        : n/a:0
  WOC        : NO
  Workers    : 0
  Executed   : 0
  Data locked: NO

  Event queue status:
  Element count   : 0
  Data locked     : NO
  Attempting lock : NO
  LLA             : init_queue:95
  LUA             : init_queue:103
  WOC             : NO
  Next activation : never
  ```

* `SIGINT` normally is ignored by the server.
  Starting the server with the
  [`--gdb`](server-options.html#option_mysqld_gdb) option installs an
  interrupt handler for `SIGINT` for
  debugging purposes. See
  [Section 5.8.1.4, “Debugging mysqld under gdb”](using-gdb-on-mysqld.html "5.8.1.4 Debugging mysqld under gdb").

### Client Response to Signals

MySQL client programs respond to signals as follows:

* The [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client interprets
  `SIGINT` (typically the result of typing
  **Control+C**) as instruction to interrupt the
  current statement if there is one, or to cancel any partial
  input line otherwise. This behavior can be disabled using
  the [`--sigint-ignore`](mysql-command-options.html#option_mysql_sigint-ignore) option to
  ignore `SIGINT` signals.

* Client programs that use the MySQL client library block
  `SIGPIPE` signals by default. These
  variations are possible:

  + Client can install their own `SIGPIPE`
    handler to override the default behavior. See
    [Writing C API Threaded Client Programs](/doc/c-api/5.7/en/c-api-threaded-clients.html).

  + Clients can prevent installation of
    `SIGPIPE` handlers by specifying the
    `CLIENT_IGNORE_SIGPIPE` option to
    [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) at
    connect time. See [mysql\_real\_connect()](/doc/c-api/5.7/en/mysql-real-connect.html).