### 7.9.3 The LOCK\_ORDER Tool

The MySQL server is a multithreaded application that uses numerous internal locking and lock-related primitives, such as mutexes, rwlocks (including prlocks and sxlocks), conditions, and files. Within the server, the set of lock-related objects changes with implementation of new features and code refactoring for performance improvements. As with any multithreaded application that uses locking primitives, there is always a risk of encountering a deadlock during execution when multiple locks are held at once. For MySQL, the effect of a deadlock is catastrophic, causing a complete loss of service.

To enable detection of lock-acquisition deadlocks and enforcement that runtime execution is free of them, MySQL supports `LOCK_ORDER` tooling. This enables a lock-order dependency graph to be defined as part of server design, and server runtime checking to ensure that lock acquisition is acyclic and that execution paths comply with the graph.

This section provides information about using the `LOCK_ORDER` tool, but only at a basic level. For complete details, see the Lock Order section of the MySQL Server Doxygen documentation, available at https://dev.mysql.com/doc/index-other.html.

The `LOCK_ORDER` tool is intended for debugging the server, not for production use.

To use the `LOCK_ORDER` tool, follow this procedure:

1. Build MySQL from source, configuring it with the `-DWITH_LOCK_ORDER=ON` **CMake** option so that the build includes `LOCK_ORDER` tooling.

   Note

   With the `WITH_LOCK_ORDER` option enabled, MySQL builds require the **flex** program.

2. To run the server with the `LOCK_ORDER` tool enabled, enable the `lock_order` system variable at server startup. Several other system variables for `LOCK_ORDER` configuration are available as well.

3. For MySQL test suite operation, **mysql-test-run.pl** has a `--lock-order` option that controls whether to enable the `LOCK_ORDER` tool during test case execution.

The system variables described following configure operation of the `LOCK_ORDER` tool, assuming that MySQL has been built to include `LOCK_ORDER` tooling. The primary variable is `lock_order`, which indicates whether to enable the `LOCK_ORDER` tool at runtime:

* If `lock_order` is disabled (the default), no other `LOCK_ORDER` system variables have any effect.

* If `lock_order` is enabled, the other system variables configure which `LOCK_ORDER` features to enable.

Note

In general, it is intended that the `LOCK_ORDER` tool be configured by executing **mysql-test-run.pl** with the `--lock-order` option, and for **mysql-test-run.pl** to set `LOCK_ORDER` system variables to appropriate values.

All `LOCK_ORDER` system variables must be set at server startup. At runtime, their values are visible but cannot be changed.

Some system variables exist in pairs, such as `lock_order_debug_loop` and `lock_order_trace_loop`. For such pairs, the variables are distinguished as follows when the condition occurs with which they are associated:

* If the `_debug_` variable is enabled, a debug assertion is raised.

* If the `_trace_` variable is enabled, an error is printed to the logs.

**Table 7.13 LOCK\_ORDER System Variable Summary**

<table frame="box" rules="all" summary="Reference for LOCK_ORDER system variables."><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th>Variable Name</th> <th>Variable Type</th> <th>Variable Scope</th> </tr></thead><tbody><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_loop">lock_order_debug_loop</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_arc">lock_order_debug_missing_arc</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_key">lock_order_debug_missing_key</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_unlock">lock_order_debug_missing_unlock</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_dependencies">lock_order_dependencies</a></th> <td>File name</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_extra_dependencies">lock_order_extra_dependencies</a></th> <td>File name</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_output_directory">lock_order_output_directory</a></th> <td>Directory name</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_print_txt">lock_order_print_txt</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_loop">lock_order_trace_loop</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_arc">lock_order_trace_missing_arc</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_key">lock_order_trace_missing_key</a></th> <td>Boolean</td> <td>Global</td> </tr><tr><th><a class="link" href="lock-order-tool.html#sysvar_lock_order_trace_missing_unlock">lock_order_trace_missing_unlock</a></th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

* `lock_order`

  <table frame="box" rules="all" summary="Properties for lock_order"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether to enable the `LOCK_ORDER` tool at runtime. If `lock_order` is disabled (the default), no other `LOCK_ORDER` system variables have any effect. If `lock_order` is enabled, the other system variables configure which `LOCK_ORDER` features to enable.

  If `lock_order` is enabled, an error is raised if the server encounters a lock-acquisition sequence that is not declared in the lock-order graph.

* `lock_order_debug_loop`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_loop"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-debug-loop[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_loop">lock_order_debug_loop</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters a dependency that is flagged as a loop in the lock-order graph.

* `lock_order_debug_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_arc"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-debug-missing-arc[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_arc">lock_order_debug_missing_arc</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the LOCK\_ORDER tool causes a debug assertion failure when it encounters a dependency that is not declared in the lock-order graph.

* `lock_order_debug_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_key"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-debug-missing-key[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_key">lock_order_debug_missing_key</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters an object that is not properly instrumented with the Performance Schema.

* `lock_order_debug_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_unlock"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-debug-missing-unlock[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_debug_missing_unlock">lock_order_debug_missing_unlock</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters a lock that is destroyed while still held.

* `lock_order_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_dependencies"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-dependencies=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_dependencies">lock_order_dependencies</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty string</code></td> </tr></tbody></table>

  The path to the `lock_order_dependencies.txt` file that defines the server lock-order dependency graph.

  It is permitted to specify no dependencies. An empty dependency graph is used in this case.

* `lock_order_extra_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_extra_dependencies"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-extra-dependencies=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_extra_dependencies">lock_order_extra_dependencies</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty string</code></td> </tr></tbody></table>

  The path to a file containing additional dependencies for the lock-order dependency graph. This is useful to amend the primary server dependency graph, defined in the `lock_order_dependencies.txt` file, with additional dependencies describing the behavior of third party code. (The alternative is to modify `lock_order_dependencies.txt` itself, which is not encouraged.)

  If this variable is not set, no secondary file is used.

* `lock_order_output_directory`

  <table frame="box" rules="all" summary="Properties for lock_order_output_directory"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-output-directory=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_output_directory">lock_order_output_directory</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty string</code></td> </tr></tbody></table>

  The directory where the `LOCK_ORDER` tool writes its logs. If this variable is not set, the default is the current directory.

* `lock_order_print_txt`

  <table frame="box" rules="all" summary="Properties for lock_order_print_txt"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order-print-txt[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order_print_txt">lock_order_print_txt</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool performs a lock-order graph analysis and prints a textual report. The report includes any lock-acquisition cycles detected.

* `lock_order_trace_loop`

  <table frame="box" rules="all" summary="Properties for lock_order"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a dependency that is flagged as a loop in the lock-order graph.

* `lock_order_trace_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a dependency that is not declared in the lock-order graph.

* `lock_order_trace_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters an object that is not properly instrumented with the Performance Schema.

* `lock_order_trace_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="lock-order-tool.html#sysvar_lock_order">lock_order</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a lock that is destroyed while still held.
