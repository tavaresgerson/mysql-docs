#### 7.5.7.1 MLE Component Option and Variable Reference

The following table lists all MySQL system variables and status variables supported by the ML component. Detailed descriptions of these variables can be found in the next two sections.

**Table 7.7 Multilingual Engine Component Variable Reference**

<table frame="box" rules="all" summary="Reference for MLE command-line options, system variables, and status variables."><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th>mle_heap_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_languages_supported</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_memory_used</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_oom_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_session_resets</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_sessions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_sessions_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_stored_functions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_stored_procedures</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_stored_program_bytes_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_stored_program_sql_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_stored_programs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_threads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle_threads_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>mle.memory_max</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>

##### MLE Component System Variables

This section provides a description of each system variable specific to the MLE component. For a summary table that lists all system variables supported by the MySQL server, see Section 7.1.5, “Server System Variable Reference”. For general information regarding manipulation of system variables, see Section 7.1.9, “Using System Variables”.

* `mle.memory_max`

  <table frame="box" rules="all" summary="Properties for mle.memory_max"><tbody><tr><th>Command-Line Format</th> <td><code>--mle.memory-max=value</code></td> </tr><tr><th>System Variable</th> <td><code>mle.memory_max</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Platform Specific</th> <td>Linux</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>(0.05) * (total physical memory in GB)</code></td> </tr><tr><th>Minimum Value</th> <td><code>320M</code></td> </tr><tr><th>Maximum Value</th> <td><code>64G</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Determines the maximum amount of memory to allocate to the MLE component. This variable is dynamic, but can be set only when the component is inactive; you can determine whether this is the case by checking the value of the `mle_status` system status variable.

  When increasing the value for this variable, you should be bear in mid that you must allow sufficient memory for other uses by the MySQL server such as buffer pools, connection memory, join buffers, and so on. In addition, there must be enough memory to allow system processes to operate correctly.

  Important

  Setting this value greater than the amount of memory available on the system causes undefined behavior.

  For more information about memory usage by the MLE component, see Section 7.5.7.3, “MLE Component Memory and Thread Usage”.

##### MLE Component Status Variables

This section provides a description of each status variable specific to the MLE component. For general information about MySQL server status variables, see Section 7.1.10, “Server Status Variables”. For a summary table that lists all status variables supported by the MySQL server, see Section 7.1.6, “Server Status Variable Reference”.

The status variables have the following meanings:

* `mle_languages_supported`

  Lists the languages supported by the MLE component. In MySQL 9.5, this is always `JavaScript`.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_heap_status`

  Current status of the heap used by the MLE component. The value is one of: `Not Allocated`, `Allocated`, or `Garbage Collection`. The heap is allocated only if the MLE component is active (that is, if `mle_status` is equal to `Active`).

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_memory_used`

  Percentage of allocated memory used by the MLE component, rounded up to the nearest whole number.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_oom_errors`

  The total number of out-of-memory errors thrown by MLE stored programs, across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_session_resets`

  The number of times MLE sessions have been cleared using the `mle_session_reset()` function.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_sessions`

  Current number of active MLE sessions. An MLE session is created within a given MySQL user session once the MySQL user creates or executes a JavaScript stored program. It is dropped when the MySQL user calls `mle_session_reset()`, or when the MySQL session ends.

  If the MySQL user calls `mle_session_reset()`, then later creates or executes a JavaScript stored program within the same MySQL user session, a new MLE session is created. There can be at most one MLE session per MySQL session.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_sessions_max`

  Maximum number of MLE sessions active at any one time since the MLE component became active.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_status`

  Current status of the MLE component. The value is one of: `Initializing`, `Inactive`, `Active`, or `Pending Shutdown`.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_stored_functions`

  This is the number of MLE stored functions currently cached across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_procedures`

  The number of MLE stored procedures currently cached across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_programs`

  Returns the number of stored programs (stored procedures and stored functions) currently cached across all sessions. An MLE stored program is cached as soon it is executed for the first time, in each session in which it was executed. It is dropped from its session's cache when any of the following happens:

  + The stored program is explicitly dropped.
  + The MLE session is dropped (see the description of `mle_sessions`)

  + An out-of-memory error is thrown in a current MLE session.

  If the same stored program is executed again after being dropped from the cache, it is cached again as usual.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_program_bytes_max`

  The size of the largest MLE stored program, in bytes. This value is equal to the size of the stored program's source text, expressed in bytes.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_program_sql_max`

  The maximum number of SQL statements executed by any MLE stored program.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_threads`

  Returns the current number of physical threads attached to GraalVM. A physical thread, provided by the MySQL server's thread manager, is attached to GraalVM whenever it starts executing an operation inside GraalVM. Such operations include heap creation, code parsing, code execution, arguments conversion, memory usage queries, and deinitialization of stored programs. A thread is detached from GraalVM after it exits if the number of threads already attached exceeds the number of megabytes of heap allocated to Graal. The number of attached physical threads cannot exceed 1.5 times the number of megabytes of allocated Graal heap.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_threads_max`

  The maximum number of MLE threads active at any given time, since the MLE component last became active.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

In addition to those listed here, a number of status variables providing counts of JavaScript library SQL statements are supported. See Com\_xxx Variables, for information about these.
