## 29.15 Performance Schema System Variables

The Performance Schema implements several system variables that provide configuration information:

```
mysql> SHOW VARIABLES LIKE 'perf%';
+----------------------------------------------------------+-------+
| Variable_name                                            | Value |
+----------------------------------------------------------+-------+
| performance_schema                                       | ON    |
| performance_schema_accounts_size                         | -1    |
| performance_schema_digests_size                          | 10000 |
| performance_schema_error_size                            | 5377  |
| performance_schema_events_stages_history_long_size       | 10000 |
| performance_schema_events_stages_history_size            | 10    |
| performance_schema_events_statements_history_long_size   | 10000 |
| performance_schema_events_statements_history_size        | 10    |
| performance_schema_events_transactions_history_long_size | 10000 |
| performance_schema_events_transactions_history_size      | 10    |
| performance_schema_events_waits_history_long_size        | 10000 |
| performance_schema_events_waits_history_size             | 10    |
| performance_schema_hosts_size                            | -1    |
| performance_schema_max_cond_classes                      | 150   |
| performance_schema_max_cond_instances                    | -1    |
| performance_schema_max_digest_length                     | 1024  |
| performance_schema_max_digest_sample_age                 | 60    |
| performance_schema_max_file_classes                      | 80    |
| performance_schema_max_file_handles                      | 32768 |
| performance_schema_max_file_instances                    | -1    |
| performance_schema_max_index_stat                        | -1    |
| performance_schema_max_memory_classes                    | 470   |
| performance_schema_max_metadata_locks                    | -1    |
| performance_schema_max_meter_classes                     | 30    |
| performance_schema_max_metric_classes                    | 600   |
| performance_schema_max_mutex_classes                     | 350   |
| performance_schema_max_mutex_instances                   | -1    |
| performance_schema_max_prepared_statements_instances     | -1    |
| performance_schema_max_program_instances                 | -1    |
| performance_schema_max_rwlock_classes                    | 100   |
| performance_schema_max_rwlock_instances                  | -1    |
| performance_schema_max_socket_classes                    | 10    |
| performance_schema_max_socket_instances                  | -1    |
| performance_schema_max_sql_text_length                   | 1024  |
| performance_schema_max_stage_classes                     | 175   |
| performance_schema_max_statement_classes                 | 220   |
| performance_schema_max_statement_stack                   | 10    |
| performance_schema_max_table_handles                     | -1    |
| performance_schema_max_table_instances                   | -1    |
| performance_schema_max_table_lock_stat                   | -1    |
| performance_schema_max_thread_classes                    | 100   |
| performance_schema_max_thread_instances                  | -1    |
| performance_schema_session_connect_attrs_size            | 512   |
| performance_schema_setup_actors_size                     | -1    |
| performance_schema_setup_objects_size                    | -1    |
| performance_schema_show_processlist                      | OFF   |
| performance_schema_users_size                            | -1    |
+----------------------------------------------------------+-------+
```

Performance Schema system variables can be set at server startup on the command line or in option files, and many can be set at runtime. See Section 29.13, “Performance Schema Option and Variable Reference”.

The Performance Schema automatically sizes the values of several of its parameters at server startup if they are not set explicitly. For more information, see Section 29.3, “Performance Schema Startup Configuration”.

Performance Schema system variables have the following meanings:

* `performance_schema`

  <table frame="box" rules="all" summary="Properties for performance_schema"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema">performance_schema</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  The value of this variable is `ON` or `OFF` to indicate whether the Performance Schema is enabled. By default, the value is `ON`. At server startup, you can specify this variable with no value or a value of `ON` or 1 to enable it, or with a value of `OFF` or 0 to disable it.

  Even when the Performance Schema is disabled, it continues to populate the `global_variables`, `session_variables`, `global_status`, and `session_status` tables. This occurs as necessary to permit the results for the `SHOW VARIABLES` and `SHOW STATUS` statements to be drawn from those tables. The Performance Schema also populates some of the replication tables when disabled.

* `performance_schema_accounts_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The number of rows in the `accounts` table. If this variable is 0, the Performance Schema does not maintain connection statistics in the `accounts` table or status variable information in the `status_by_account` table.

* `performance_schema_digests_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The maximum number of rows in the `events_statements_summary_by_digest` table. If this maximum is exceeded such that a digest cannot be instrumented, the Performance Schema increments the `Performance_schema_digest_lost` status variable.

  For more information about statement digesting, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

* `performance_schema_error_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The number of instrumented server error codes. The default value is the actual number of server error codes. Although the value can be set anywhere from 0 to its maximum, the intended use is to set it to either its default (to instrument all errors) or 0 (to instrument no errors).

  Error information is aggregated in summary tables; see Section 29.12.20.11, “Error Summary Tables”. If an error occurs that is not instrumented, information for the occurrence is aggregated to the `NULL` row in each summary table; that is, to the row with `ERROR_NUMBER=0`, `ERROR_NAME=NULL`, and `SQLSTATE=NULL`.

* `performance_schema_events_stages_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The number of rows in the `events_stages_history_long` table.

* `performance_schema_events_stages_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1024</code></td> </tr></tbody></table>

  The number of rows per thread in the `events_stages_history` table.

* `performance_schema_events_statements_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_statements_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-statements-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size">performance_schema_events_statements_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The number of rows in the `events_statements_history_long` table.

* `performance_schema_events_statements_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_statements_history_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-statements-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_size">performance_schema_events_statements_history_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1024</code></td> </tr></tbody></table>

  The number of rows per thread in the `events_statements_history` table.

* `performance_schema_events_transactions_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_transactions_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-transactions-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size">performance_schema_events_transactions_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>

  The number of rows in the `events_transactions_history_long` table.

* `performance_schema_events_transactions_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_transactions_history_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-transactions-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_size">performance_schema_events_transactions_history_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1024</code></td> </tr></tbody></table>

  The number of rows per thread in the `events_transactions_history` table.

* `performance_schema_events_waits_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>0

  The number of rows in the `events_waits_history_long` table.

* `performance_schema_events_waits_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>1

  The number of rows per thread in the `events_waits_history` table.

* `performance_schema_hosts_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>2

  The number of rows in the `hosts` table. If this variable is 0, the Performance Schema does not maintain connection statistics in the `hosts` table or status variable information in the `status_by_host` table.

* `performance_schema_max_cond_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>3

  The maximum number of condition instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_cond_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>4

  The maximum number of instrumented condition objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_digest_length`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>5

  The maximum number of bytes of memory reserved per statement for computation of normalized statement digest values in the Performance Schema. This variable is related to `max_digest_length`; see the description of that variable in Section 7.1.8, “Server System Variables”.

  For more information about statement digesting, including considerations regarding memory use, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

* `performance_schema_max_digest_sample_age`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>6

  This variable affects statement sampling for the `events_statements_summary_by_digest` table. When a new table row is inserted, the statement that produced the row digest value is stored as the current sample statement associated with the digest. Thereafter, when the server sees other statements with the same digest value, it determines whether to use the new statement to replace the current sample statement (that is, whether to resample). Resampling policy is based on the comparative wait times of the current sample statement and new statement and, optionally, the age of the current sample statement:

  + Resampling based on wait times: If the new statement wait time has a wait time greater than that of the current sample statement, it becomes the current sample statement.

  + Resampling based on age: If the `performance_schema_max_digest_sample_age` system variable has a value greater than zero and the current sample statement is more than that many seconds old, the current statement is considered “too old” and the new statement replaces it. This occurs even if the new statement wait time is less than that of the current sample statement.

  For information about statement sampling, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

* `performance_schema_max_file_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>7

  The maximum number of file instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_file_handles`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>8

  The maximum number of opened file objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

  The value of `performance_schema_max_file_handles` should be greater than the value of `open_files_limit`: `open_files_limit` affects the maximum number of open file handles the server can support and `performance_schema_max_file_handles` affects how many of these file handles can be instrumented.

* `performance_schema_max_file_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>9

  The maximum number of instrumented file objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_index_stat`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>0

  The maximum number of indexes for which the Performance Schema maintains statistics. If this maximum is exceeded such that index statistics are lost, the Performance Schema increments the `Performance_schema_index_stat_lost` status variable. The default value is autosized using the value of `performance_schema_max_table_instances`.

* `performance_schema_max_memory_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>1

  The maximum number of memory instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_metadata_locks`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>2

  The maximum number of metadata lock instruments. This value controls the size of the `metadata_locks` table. If this maximum is exceeded such that a metadata lock cannot be instrumented, the Performance Schema increments the `Performance_schema_metadata_lock_lost` status variable.

* `performance_schema_max_meter_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>3

  Maximum number of meter instruments which can be created

* `performance_schema_max_metric_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>4

  Maximum number of metric instruments which can be created.

* `performance_schema_max_mutex_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>5

  The maximum number of mutex instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_mutex_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>6

  The maximum number of instrumented mutex objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_prepared_statements_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>7

  The maximum number of rows in the `prepared_statements_instances` table. If this maximum is exceeded such that a prepared statement cannot be instrumented, the Performance Schema increments the `Performance_schema_prepared_statements_lost` status variable. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

  The default value of this variable is autosized based on the value of the `max_prepared_stmt_count` system variable.

* `performance_schema_max_rwlock_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>8

  The maximum number of rwlock instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_program_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>9

  The maximum number of stored programs for which the Performance Schema maintains statistics. If this maximum is exceeded, the Performance Schema increments the `Performance_schema_program_lost` status variable. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_rwlock_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>0

  The maximum number of instrumented rwlock objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_socket_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>1

  The maximum number of socket instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_socket_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>2

  The maximum number of instrumented socket objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_sql_text_length`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>3

  The maximum number of bytes used to store SQL statements. The value applies to storage required for these columns:

  + The `SQL_TEXT` column of the `events_statements_current`, `events_statements_history`, and `events_statements_history_long` statement event tables.

  + The `QUERY_SAMPLE_TEXT` column of the `events_statements_summary_by_digest` summary table.

  Any bytes in excess of `performance_schema_max_sql_text_length` are discarded and do not appear in the column. Statements differing only after that many initial bytes are indistinguishable in the column.

  Decreasing the `performance_schema_max_sql_text_length` value reduces memory use but causes more statements to become indistinguishable if they differ only at the end. Increasing the value increases memory use but permits longer statements to be distinguished.

* `performance_schema_max_stage_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>4

  The maximum number of stage instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_statement_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>5

  The maximum number of statement instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

  The default value is calculated at server build time based on the number of commands in the client/server protocol and the number of SQL statement types supported by the server.

  This variable should not be changed, unless to set it to 0 to disable all statement instrumentation and save all memory associated with it. Setting the variable to nonzero values other than the default has no benefit; in particular, values larger than the default cause more memory to be allocated then is needed.

* `performance_schema_max_statement_stack`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>6

  The maximum depth of nested stored program calls for which the Performance Schema maintains statistics. When this maximum is exceeded, the Performance Schema increments the `Performance_schema_nested_statement_lost` status variable for each stored program statement executed.

* `performance_schema_max_table_handles`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>7

  The maximum number of opened table objects. This value controls the size of the `table_handles` table. If this maximum is exceeded such that a table handle cannot be instrumented, the Performance Schema increments the `Performance_schema_table_handles_lost` status variable. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_table_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>8

  The maximum number of instrumented table objects. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_table_lock_stat`

  <table frame="box" rules="all" summary="Properties for performance_schema_error_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-error-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">number of server error codes</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>9

  The maximum number of tables for which the Performance Schema maintains lock statistics. If this maximum is exceeded such that table lock statistics are lost, the Performance Schema increments the `Performance_schema_table_lock_stat_lost` status variable.

* `performance_schema_max_thread_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>0

  The maximum number of thread instruments. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

* `performance_schema_max_thread_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>1

  The maximum number of instrumented thread objects. The value controls the size of the `threads` table. If this maximum is exceeded such that a thread cannot be instrumented, the Performance Schema increments the `Performance_schema_thread_instances_lost` status variable. For information about how to set and use this variable, see Section 29.7, “Performance Schema Status Monitoring”.

  The `max_connections` system variable affects how many threads can run in the server. `performance_schema_max_thread_instances` affects how many of these running threads can be instrumented.

  The `variables_by_thread` and `status_by_thread` tables contain system and status variable information only about foreground threads. If not all threads are instrumented by the Performance Schema, this table misses some rows. In this case, the `Performance_schema_thread_instances_lost` status variable is greater than zero.

* `performance_schema_session_connect_attrs_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>2

  The amount of preallocated memory per thread reserved to hold connection attribute key-value pairs. If the aggregate size of connection attribute data sent by a client is larger than this amount, the Performance Schema truncates the attribute data, increments the `Performance_schema_session_connect_attrs_lost` status variable, and writes a message to the error log indicating that truncation occurred if the `log_error_verbosity` system variable is greater than 1. A `_truncated` attribute is also added to the session attributes with a value indicating how many bytes were lost, if the attribute buffer has sufficient space. This enables the Performance Schema to expose per-connection truncation information in the connection attribute tables. This information can be examined without having to check the error log.

  The default value of `performance_schema_session_connect_attrs_size` is autosized at server startup. This value may be small, so if truncation occurs (`Performance_schema_session_connect_attrs_lost` becomes nonzero), you may wish to set `performance_schema_session_connect_attrs_size` explicitly to a larger value.

  Although the maximum permitted `performance_schema_session_connect_attrs_size` value is 1MB, the effective maximum is 64KB because the server imposes a limit of 64KB on the aggregate size of connection attribute data it accepts. If a client attempts to send more than 64KB of attribute data, the server rejects the connection. For more information, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.

* `performance_schema_setup_actors_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>3

  The number of rows in the `setup_actors` table.

* `performance_schema_setup_objects_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>4

  The number of rows in the `setup_objects` table.

* `performance_schema_show_processlist`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>5

  The `SHOW PROCESSLIST` statement provides process information by collecting thread data from all active threads. The `performance_schema_show_processlist` variable determines which `SHOW PROCESSLIST` implementation to use:

  + The default implementation iterates across active threads from within the thread manager while holding a global mutex. This has negative performance consequences, particularly on busy systems.

  + The alternative `SHOW PROCESSLIST` implementation is based on the Performance Schema `processlist` table. This implementation queries active thread data from the Performance Schema rather than the thread manager and does not require a mutex.

  To enable the alternative implementation, enable the `performance_schema_show_processlist` system variable. To ensure that the default and alternative implementations yield the same information, certain configuration requirements must be met; see Section 29.12.22.9, “The processlist Table”.

* `performance_schema_users_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>6

  The number of rows in the `users` table. If this variable is 0, the Performance Schema does not maintain connection statistics in the `users` table or status variable information in the `status_by_user` table.

* `performance_schema_max_logger_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code> (signifies autoscaling; do not assign this literal value)</td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr></tbody></table>7

  The value indicates the maximum number of logger client instruments that can be created. Modifying this setting requires server restart.
