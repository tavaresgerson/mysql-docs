### 25.12.15 Performance Schema Summary Tables

[25.12.15.1 Wait Event Summary Tables](performance-schema-wait-summary-tables.html)

[25.12.15.2 Stage Summary Tables](performance-schema-stage-summary-tables.html)

[25.12.15.3 Statement Summary Tables](performance-schema-statement-summary-tables.html)

[25.12.15.4 Transaction Summary Tables](performance-schema-transaction-summary-tables.html)

[25.12.15.5 Object Wait Summary Table](performance-schema-objects-summary-global-by-type-table.html)

[25.12.15.6 File I/O Summary Tables](performance-schema-file-summary-tables.html)

[25.12.15.7 Table I/O and Lock Wait Summary Tables](performance-schema-table-wait-summary-tables.html)

[25.12.15.8 Socket Summary Tables](performance-schema-socket-summary-tables.html)

[25.12.15.9 Memory Summary Tables](performance-schema-memory-summary-tables.html)

[25.12.15.10 Status Variable Summary Tables](performance-schema-status-variable-summary-tables.html)

Summary tables provide aggregated information for terminated events over time. The tables in this group summarize event data in different ways.

Each summary table has grouping columns that determine how to group the data to be aggregated, and summary columns that contain the aggregated values. Tables that summarize events in similar ways often have similar sets of summary columns and differ only in the grouping columns used to determine how events are aggregated.

Summary tables can be truncated with [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Generally, the effect is to reset the summary columns to 0 or `NULL`, not to remove rows. This enables you to clear collected values and restart aggregation. That might be useful, for example, after you have made a runtime configuration change. Exceptions to this truncation behavior are noted in individual summary table sections.

#### Wait Event Summaries

**Table 25.3 Performance Schema Wait Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema wait event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_account_by_event_name</code></a></td> <td>Wait events per account and event name</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_host_by_event_name</code></a></td> <td>Wait events per host name and event name</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_instance</code></a></td> <td>Wait events per instance</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_thread_by_event_name</code></a></td> <td>Wait events per thread and event name</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_user_by_event_name</code></a></td> <td>Wait events per user name and event name</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="25.12.15.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_global_by_event_name</code></a></td> <td>Wait events per event name</td> </tr></tbody></table>

#### Stage Summaries

**Table 25.4 Performance Schema Stage Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema stage event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="25.12.15.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_account_by_event_name</code></a></td> <td>Stage events per account and event name</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="25.12.15.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_host_by_event_name</code></a></td> <td>Stage events per host name and event name</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="25.12.15.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_thread_by_event_name</code></a></td> <td>Stage waits per thread and event name</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="25.12.15.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_user_by_event_name</code></a></td> <td>Stage events per user name and event name</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="25.12.15.2 Stage Summary Tables"><code class="literal">events_stages_summary_global_by_event_name</code></a></td> <td>Stage waits per event name</td> </tr></tbody></table>

#### Statement Summaries

**Table 25.5 Performance Schema Statement Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema statement event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_account_by_event_name</code></a></td> <td>Statement events per account and event name</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_digest</code></a></td> <td>Statement events per schema and digest value</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_host_by_event_name</code></a></td> <td>Statement events per host name and event name</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_program</code></a></td> <td>Statement events per stored program</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_thread_by_event_name</code></a></td> <td>Statement events per thread and event name</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_user_by_event_name</code></a></td> <td>Statement events per user name and event name</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="25.12.15.3 Statement Summary Tables"><code class="literal">events_statements_summary_global_by_event_name</code></a></td> <td>Statement events per event name</td> </tr><tr><td><a class="link" href="performance-schema-prepared-statements-instances-table.html" title="25.12.6.4 The prepared_statements_instances Table"><code class="literal">prepared_statements_instances</code></a></td> <td>Prepared statement instances and statistics</td> </tr></tbody></table>

#### Transaction Summaries

**Table 25.6 Performance Schema Transaction Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema transaction event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="25.12.15.4 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_account_by_event_name</code></a></td> <td>Transaction events per account and event name</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="25.12.15.4 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_host_by_event_name</code></a></td> <td>Transaction events per host name and event name</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="25.12.15.4 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_thread_by_event_name</code></a></td> <td>Transaction events per thread and event name</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="25.12.15.4 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_user_by_event_name</code></a></td> <td>Transaction events per user name and event name</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="25.12.15.4 Transaction Summary Tables"><code class="literal">events_transactions_summary_global_by_event_name</code></a></td> <td>Transaction events per event name</td> </tr></tbody></table>

#### Object Wait Summaries

**Table 25.7 Performance Schema Object Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema object event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-objects-summary-global-by-type-table.html" title="25.12.15.5 Object Wait Summary Table"><code class="literal">objects_summary_global_by_type</code></a></td> <td>Object summaries</td> </tr></tbody></table>

#### File I/O Summaries

**Table 25.8 Performance Schema File I/O Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema file I/O event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-file-summary-tables.html" title="25.12.15.6 File I/O Summary Tables"><code class="literal">file_summary_by_event_name</code></a></td> <td>File events per event name</td> </tr><tr><td><a class="link" href="performance-schema-file-summary-tables.html" title="25.12.15.6 File I/O Summary Tables"><code class="literal">file_summary_by_instance</code></a></td> <td>File events per file instance</td> </tr></tbody></table>

#### Table I/O and Lock Wait Summaries

**Table 25.9 Performance Schema Table I/O and Lock Wait Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema table I/O and lock event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table" title="25.12.15.7.2 The table_io_waits_summary_by_index_usage Table"><code class="literal">table_io_waits_summary_by_index_usage</code></a></td> <td>Table I/O waits per index</td> </tr><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table" title="25.12.15.7.1 The table_io_waits_summary_by_table Table"><code class="literal">table_io_waits_summary_by_table</code></a></td> <td>Table I/O waits per table</td> </tr><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table" title="25.12.15.7.3 The table_lock_waits_summary_by_table Table"><code class="literal">table_lock_waits_summary_by_table</code></a></td> <td>Table lock waits per table</td> </tr></tbody></table>

#### Socket Summaries

**Table 25.10 Performance Schema Socket Event Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema socket event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-socket-summary-tables.html" title="25.12.15.8 Socket Summary Tables"><code class="literal">socket_summary_by_event_name</code></a></td> <td>Socket waits and I/O per event name</td> </tr><tr><td><a class="link" href="performance-schema-socket-summary-tables.html" title="25.12.15.8 Socket Summary Tables"><code class="literal">socket_summary_by_instance</code></a></td> <td>Socket waits and I/O per instance</td> </tr></tbody></table>

#### Memory Summaries

**Table 25.11 Performance Schema Memory Operation Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema memory operation summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-memory-summary-tables.html" title="25.12.15.9 Memory Summary Tables"><code class="literal">memory_summary_by_account_by_event_name</code></a></td> <td>Memory operations per account and event name</td> </tr><tr><td><a class="link" href="performance-schema-memory-summary-tables.html" title="25.12.15.9 Memory Summary Tables"><code class="literal">memory_summary_by_host_by_event_name</code></a></td> <td>Memory operations per host and event name</td> </tr><tr><td><a class="link" href="performance-schema-memory-summary-tables.html" title="25.12.15.9 Memory Summary Tables"><code class="literal">memory_summary_by_thread_by_event_name</code></a></td> <td>Memory operations per thread and event name</td> </tr><tr><td><a class="link" href="performance-schema-memory-summary-tables.html" title="25.12.15.9 Memory Summary Tables"><code class="literal">memory_summary_by_user_by_event_name</code></a></td> <td>Memory operations per user and event name</td> </tr><tr><td><a class="link" href="performance-schema-memory-summary-tables.html" title="25.12.15.9 Memory Summary Tables"><code class="literal">memory_summary_global_by_event_name</code></a></td> <td>Memory operations globally per event name</td> </tr></tbody></table>

#### Status Variable Summaries

**Table 25.12 Performance Schema Error Status Variable Summary Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema status variable summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-status-variable-summary-tables.html" title="25.12.15.10 Status Variable Summary Tables"><code class="literal">status_by_account</code></a></td> <td>Session status variables per account</td> </tr><tr><td><a class="link" href="performance-schema-status-variable-summary-tables.html" title="25.12.15.10 Status Variable Summary Tables"><code class="literal">status_by_host</code></a></td> <td>Session status variables per host name</td> </tr><tr><td><a class="link" href="performance-schema-status-variable-summary-tables.html" title="25.12.15.10 Status Variable Summary Tables"><code class="literal">status_by_user</code></a></td> <td>Session status variables per user name</td> </tr></tbody></table>
