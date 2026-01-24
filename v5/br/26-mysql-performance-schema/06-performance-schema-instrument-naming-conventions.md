## 25.6 Performance Schema Instrument Naming Conventions

An instrument name consists of a sequence of elements separated by `'/'` characters. Example names:

```sql
wait/io/file/myisam/log
wait/io/file/mysys/charset
wait/lock/table/sql/handler
wait/synch/cond/mysys/COND_alarm
wait/synch/cond/sql/BINLOG::update_cond
wait/synch/mutex/mysys/BITMAP_mutex
wait/synch/mutex/sql/LOCK_delete
wait/synch/rwlock/sql/Query_cache_query::lock
stage/sql/closing tables
stage/sql/Sorting result
statement/com/Execute
statement/com/Query
statement/sql/create_table
statement/sql/lock_tables
```

The instrument name space has a tree-like structure. The elements of an instrument name from left to right provide a progression from more general to more specific. The number of elements a name has depends on the type of instrument.

The interpretation of a given element in a name depends on the elements to the left of it. For example, `myisam` appears in both of the following names, but `myisam` in the first name is related to file I/O, whereas in the second it is related to a synchronization instrument:

```sql
wait/io/file/myisam/log
wait/synch/cond/myisam/MI_SORT_INFO::cond
```

Instrument names consist of a prefix with a structure defined by the Performance Schema implementation and a suffix defined by the developer implementing the instrument code. The top-level element of an instrument prefix indicates the type of instrument. This element also determines which event timer in the `setup_timers` table applies to the instrument. For the prefix part of instrument names, the top level indicates the type of instrument.

The suffix part of instrument names comes from the code for the instruments themselves. Suffixes may include levels such as these:

* A name for the major element (a server module such as `myisam`, `innodb`, `mysys`, or `sql`) or a plugin name.

* The name of a variable in the code, in the form *`XXX`* (a global variable) or `CCC::MMM` (a member *`MMM`* in class *`CCC`*). Examples: `COND_thread_cache`, `THR_LOCK_myisam`, `BINLOG::LOCK_index`.

* [Top-Level Instrument Elements](performance-schema-instrument-naming.html#performance-schema-top-level-instrument-elements "Top-Level Instrument Elements")
* [Idle Instrument Elements](performance-schema-instrument-naming.html#performance-schema-idle-instrument-elements "Idle Instrument Elements")
* [Memory Instrument Elements](performance-schema-instrument-naming.html#performance-schema-memory-instrument-elements "Memory Instrument Elements")
* [Stage Instrument Elements](performance-schema-instrument-naming.html#performance-schema-stage-instrument-elements "Stage Instrument Elements")
* [Statement Instrument Elements](performance-schema-instrument-naming.html#performance-schema-statement-instrument-elements "Statement Instrument Elements")
* [Wait Instrument Elements](performance-schema-instrument-naming.html#performance-schema-wait-instrument-elements "Wait Instrument Elements")

### Top-Level Instrument Elements

* `idle`: An instrumented idle event. This instrument has no further elements.

* `memory`: An instrumented memory event.
* `stage`: An instrumented stage event.
* `statement`: An instrumented statement event.

* `transaction`: An instrumented transaction event. This instrument has no further elements.

* `wait`: An instrumented wait event.

### Idle Instrument Elements

The `idle` instrument is used for idle events, which The Performance Schema generates as discussed in the description of the `socket_instances.STATE` column in [Section 25.12.3.5, “The socket_instances Table”](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table").

### Memory Instrument Elements

Most memory instrumentation is disabled by default, and can be enabled or disabled at startup, or dynamically at runtime by updating the `ENABLED` column of the relevant instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table. Memory instruments have names of the form `memory/code_area/instrument_name` where *`code_area`* is a value such as `sql` or `myisam`, and *`instrument_name`* is the instrument detail.

Instruments named with the prefix `memory/performance_schema/` expose how much memory is allocated for internal buffers in the Performance Schema. The `memory/performance_schema/` instruments are built in, always enabled, and cannot be disabled at startup or runtime. Built-in memory instruments are displayed only in the [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables") table. For more information, see [Section 25.17, “The Performance Schema Memory-Allocation Model”](performance-schema-memory-model.html "25.17 The Performance Schema Memory-Allocation Model").

### Stage Instrument Elements

Stage instruments have names of the form `stage/code_area/stage_name`, where *`code_area`* is a value such as `sql` or `myisam`, and *`stage_name`* indicates the stage of statement processing, such as `Sorting result` or `Sending data`. Stages correspond to the thread states displayed by [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") or that are visible in the Information Schema [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table.

### Statement Instrument Elements

* `statement/abstract/*`: An abstract instrument for statement operations. Abstract instruments are used during the early stages of statement classification before the exact statement type is known, then changed to a more specific statement instrument when the type is known. For a description of this process, see [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

* `statement/com`: An instrumented command operation. These have names corresponding to `COM_xxx` operations (see the `mysql_com.h` header file and `sql/sql_parse.cc`. For example, the `statement/com/Connect` and `statement/com/Init DB` instruments correspond to the `COM_CONNECT` and `COM_INIT_DB` commands.

* `statement/scheduler/event`: A single instrument to track all events executed by the Event Scheduler. This instrument comes into play when a scheduled event begins executing.

* `statement/sp`: An instrumented internal instruction executed by a stored program. For example, the `statement/sp/cfetch` and `statement/sp/freturn` instruments are used cursor fetch and function return instructions.

* `statement/sql`: An instrumented SQL statement operation. For example, the `statement/sql/create_db` and `statement/sql/select` instruments are used for [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") and [`SELECT`](select.html "13.2.9 SELECT Statement") statements.

### Wait Instrument Elements

* `wait/io`

  An instrumented I/O operation.

  + `wait/io/file`

    An instrumented file I/O operation. For files, the wait is the time waiting for the file operation to complete (for example, a call to `fwrite()`). Due to caching, the physical file I/O on the disk might not happen within this call.

  + `wait/io/socket`

    An instrumented socket operation. Socket instruments have names of the form `wait/io/socket/sql/socket_type`. The server has a listening socket for each network protocol that it supports. The instruments associated with listening sockets for TCP/IP or Unix socket file connections have a *`socket_type`* value of `server_tcpip_socket` or `server_unix_socket`, respectively. When a listening socket detects a connection, the server transfers the connection to a new socket managed by a separate thread. The instrument for the new connection thread has a *`socket_type`* value of `client_connection`.

  + `wait/io/table`

    An instrumented table I/O operation. These include row-level accesses to persistent base tables or temporary tables. Operations that affect rows are fetch, insert, update, and delete. For a view, waits are associated with base tables referenced by the view.

    Unlike most waits, a table I/O wait can include other waits. For example, table I/O might include file I/O or memory operations. Thus, [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") for a table I/O wait usually has two rows. For more information, see [Section 25.8, “Performance Schema Atom and Molecule Events”](performance-schema-atom-molecule-events.html "25.8 Performance Schema Atom and Molecule Events").

    Some row operations might cause multiple table I/O waits. For example, an insert might activate a trigger that causes an update.

* `wait/lock`

  An instrumented lock operation.

  + `wait/lock/table`

    An instrumented table lock operation.

  + `wait/lock/metadata/sql/mdl`

    An instrumented metadata lock operation.

* `wait/synch`

  An instrumented synchronization object. For synchronization objects, the `TIMER_WAIT` time includes the amount of time blocked while attempting to acquire a lock on the object, if any.

  + `wait/synch/cond`

    A condition is used by one thread to signal to other threads that something they were waiting for has happened. If a single thread was waiting for a condition, it can wake up and proceed with its execution. If several threads were waiting, they can all wake up and compete for the resource for which they were waiting.

  + `wait/synch/mutex`

    A mutual exclusion object used to permit access to a resource (such as a section of executable code) while preventing other threads from accessing the resource.

  + `wait/synch/rwlock`

    A [read/write lock](glossary.html#glos_rw_lock "rw-lock") object used to lock a specific variable for access while preventing its use by other threads. A shared read lock can be acquired simultaneously by multiple threads. An exclusive write lock can be acquired by only one thread at a time.

  + `wait/synch/sxlock`

    A shared-exclusive (SX) lock is a type of [rwlock](glossary.html#glos_rw_lock "rw-lock") lock object that provides write access to a common resource while permitting inconsistent reads by other threads. `sxlocks` optimize concurrency and improve scalability for read-write workloads.
