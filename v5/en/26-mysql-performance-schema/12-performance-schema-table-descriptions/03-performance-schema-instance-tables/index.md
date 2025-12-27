### 25.12.3 Performance Schema Instance Tables

[25.12.3.1 The cond\_instances Table](performance-schema-cond-instances-table.html)

[25.12.3.2 The file\_instances Table](performance-schema-file-instances-table.html)

[25.12.3.3 The mutex\_instances Table](performance-schema-mutex-instances-table.html)

[25.12.3.4 The rwlock\_instances Table](performance-schema-rwlock-instances-table.html)

[25.12.3.5 The socket\_instances Table](performance-schema-socket-instances-table.html)

Instance tables document what types of objects are instrumented. They provide event names and explanatory notes or status information:

* [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table"): Condition synchronization object instances

* [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table"): File instances
* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table"): Mutex synchronization object instances

* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table"): Lock synchronization object instances

* [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table"): Active connection instances

These tables list instrumented synchronization objects, files, and connections. There are three types of synchronization objects: `cond`, `mutex`, and `rwlock`. Each instance table has an `EVENT_NAME` or `NAME` column to indicate the instrument associated with each row. Instrument names may have multiple parts and form a hierarchy, as discussed in [Section 25.6, “Performance Schema Instrument Naming Conventions”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

The `mutex_instances.LOCKED_BY_THREAD_ID` and `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` columns are extremely important for investigating performance bottlenecks or deadlocks. For examples of how to use them for this purpose, see [Section 25.19, “Using the Performance Schema to Diagnose Problems”](performance-schema-examples.html "25.19 Using the Performance Schema to Diagnose Problems")
