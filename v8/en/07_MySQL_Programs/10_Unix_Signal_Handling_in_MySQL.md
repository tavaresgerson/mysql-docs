## 6.10 Unix Signal Handling in MySQL

On Unix and Unix-like systems, a process can be the recipient of signals sent to it by the `root` system account or the system account that owns the process. Signals can be sent using the **kill** command. Some command interpreters associate certain key sequences with signals, such as **Control+C** to send a `SIGINT` signal. This section describes how the MySQL server and client programs respond to signals.

* Server Response to Signals
* Client Response to Signals

### Server Response to Signals

**mysqld** responds to signals as follows:

* `SIGTERM` causes the server to shut down. This is like executing a `SHUTDOWN` statement without having to connect to the server (which for shutdown requires an account that has the `SHUTDOWN` privilege).

* `SIGHUP` causes the server to reload the grant tables and to flush tables, logs, the thread cache, and the host cache. These actions are like various forms of the `FLUSH` statement. Sending the signal enables the flush operations to be performed without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. Prior to MySQL 8.0.20, the server also writes a status report to the error log that has this format:

  ```
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

* As of MySQL 8.0.19, `SIGUSR1` causes the server to flush the error log, general query log, and slow query log. One use for `SIGUSR1` is to implement log rotation without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. For information about log rotation, see Section 7.4.6, “Server Log Maintenance”.

  The server response to `SIGUSR1` is a subset of the response to `SIGHUP`, enabling `SIGUSR1` to be used as a more “lightweight” signal that flushes certain logs without the other `SIGHUP` effects such as flushing the thread and host caches and writing a status report to the error log.

* `SIGINT` normally is ignored by the server. Starting the server with the `--gdb` option installs an interrupt handler for `SIGINT` for debugging purposes. See Section 7.9.1.4, “Debugging mysqld under gdb”.

### Client Response to Signals

MySQL client programs respond to signals as follows:

* The **mysql** client interprets `SIGINT` (typically the result of typing **Control+C**) as instruction to interrupt the current statement if there is one, or to cancel any partial input line otherwise. This behavior can be disabled using the `--sigint-ignore` option to ignore `SIGINT` signals.

* Client programs that use the MySQL client library block `SIGPIPE` signals by default. These variations are possible:

  + Client can install their own `SIGPIPE` handler to override the default behavior. See Writing C API Threaded Client Programs.

  + Clients can prevent installation of `SIGPIPE` handlers by specifying the `CLIENT_IGNORE_SIGPIPE` option to `mysql_real_connect()` at connect time. See mysql_real_connect().
