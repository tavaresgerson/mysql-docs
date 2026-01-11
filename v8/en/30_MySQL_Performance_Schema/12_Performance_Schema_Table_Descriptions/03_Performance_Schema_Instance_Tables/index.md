### 29.12.3 Performance Schema Instance Tables

29.12.3.1 The cond_instances Table

29.12.3.2 The file_instances Table

29.12.3.3 The mutex_instances Table

29.12.3.4 The rwlock_instances Table

29.12.3.5 The socket_instances Table

Instance tables document what types of objects are instrumented. They provide event names and explanatory notes or status information:

* `cond_instances`: Condition synchronization object instances

* `file_instances`: File instances
* `mutex_instances`: Mutex synchronization object instances

* `rwlock_instances`: Lock synchronization object instances

* `socket_instances`: Active connection instances

These tables list instrumented synchronization objects, files, and connections. There are three types of synchronization objects: `cond`, `mutex`, and `rwlock`. Each instance table has an `EVENT_NAME` or `NAME` column to indicate the instrument associated with each row. Instrument names may have multiple parts and form a hierarchy, as discussed in Section 29.6, “Performance Schema Instrument Naming Conventions”.

The `mutex_instances.LOCKED_BY_THREAD_ID` and `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` columns are extremely important for investigating performance bottlenecks or deadlocks. For examples of how to use them for this purpose, see Section 29.19, “Using the Performance Schema to Diagnose Problems”
