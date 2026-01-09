#### 8.5.2.5 MySQL Enterprise Data Masking Component Variables

The MySQL Enterprise Data Masking components support the following system variables. Use these variables to configure related component operations. Variables are unavailable unless the appropriate MySQL Enterprise Data Masking components are installed (see Section 8.5.2.1, “MySQL Enterprise Data Masking Component Installation”).

* `component_masking.dictionaries_flush_interval_seconds`

  <table frame="box" rules="all" summary="Properties for component_masking.dictionaries_flush_interval_seconds"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--component-masking.dictionaries-flush-interval-seconds=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">component_masking.dictionaries_flush_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code class="literal">SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">60</code></td> </tr><tr><th>Maximum Value (Unix)</th> <td><code class="literal">18446744073709551615</code></td> </tr><tr><th>Maximum Value (Windows)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Sets the interval, in seconds, to wait before attempting to schedule another flush of the data masking dictionaries table to the memory data masking dictionaries cache following a restart or previous execution. The value is handled as listed here:

  + 0: No flushing
  + 1 - 59 inclusive: Round up to 60, with a warning
  + >= 60: Wait this many seconds to perform flush
* `component_masking.masking_database`

  <table frame="box" rules="all" summary="Properties for component_masking.masking_database"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--component-masking.masking-database[=value]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">component_masking.masking_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code class="literal">SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql</code></td> </tr></tbody></table>

  Specifies the database to use for data masking dictionaries at server startup. This variable is read only.

  Use this variable to set and persist a schema other than the default value (`mysql`). For additional information about setting up the data-masking components to use an alternative location for the data-masking table, see Install Using a Dedicated Schema. For general guidelines about using the `PERSIST ONLY` keyword, see Section 15.7.6.1, “SET Syntax for Variable Assignment”.
