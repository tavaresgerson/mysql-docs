### 29.12.20 Performance Schema Summary Tables

29.12.20.1 Wait Event Summary Tables

29.12.20.2 Stage Summary Tables

29.12.20.3 Statement Summary Tables

29.12.20.4 Statement Histogram Summary Tables

29.12.20.5 Transaction Summary Tables

29.12.20.6 Object Wait Summary Table

29.12.20.7 File I/O Summary Tables

29.12.20.8 Table I/O and Lock Wait Summary Tables

29.12.20.9 Socket Summary Tables

29.12.20.10 Memory Summary Tables

29.12.20.11 Error Summary Tables

29.12.20.12 Status Variable Summary Tables

Summary tables provide aggregated information for terminated events over time. The tables in this group summarize event data in different ways.

Each summary table has grouping columns that determine how to group the data to be aggregated, and summary columns that contain the aggregated values. Tables that summarize events in similar ways often have similar sets of summary columns and differ only in the grouping columns used to determine how events are aggregated.

Summary tables can be truncated with `TRUNCATE TABLE`. Generally, the effect is to reset the summary columns to 0 or `NULL`, not to remove rows. This enables you to clear collected values and restart aggregation. That might be useful, for example, after you have made a runtime configuration change. Exceptions to this truncation behavior are noted in individual summary table sections.

#### Wait Event Summaries

**Table 29.7 Performance Schema Wait Event Summary Tables**

<table summary="A reference that lists all Performance Schema wait event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_waits_summary_by_account_by_event_name</code></td> <td>Wait events per account and event name</td> </tr><tr><td><code>events_waits_summary_by_host_by_event_name</code></td> <td>Wait events per host name and event name</td> </tr><tr><td><code>events_waits_summary_by_instance</code></td> <td>Wait events per instance</td> </tr><tr><td><code>events_waits_summary_by_thread_by_event_name</code></td> <td>Wait events per thread and event name</td> </tr><tr><td><code>events_waits_summary_by_user_by_event_name</code></td> <td>Wait events per user name and event name</td> </tr><tr><td><code>events_waits_summary_global_by_event_name</code></td> <td>Wait events per event name</td> </tr></tbody></table>

#### Stage Summaries

**Table 29.8 Performance Schema Stage Event Summary Tables**

<table summary="A reference that lists all Performance Schema stage event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Stage events per account and event name</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Stage events per host name and event name</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Stage waits per thread and event name</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Stage events per user name and event name</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Stage waits per event name</td> </tr></tbody></table>

#### Statement Summaries

**Table 29.9 Performance Schema Statement Event Summary Tables**

<table summary="A reference that lists all Performance Schema statement event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_statements_histogram_by_digest</code></td> <td>Statement histograms per schema and digest value</td> </tr><tr><td><code>events_statements_histogram_global</code></td> <td>Statement histogram summarized globally</td> </tr><tr><td><code>events_statements_summary_by_account_by_event_name</code></td> <td>Statement events per account and event name</td> </tr><tr><td><code>events_statements_summary_by_digest</code></td> <td>Statement events per schema and digest value</td> </tr><tr><td><code>events_statements_summary_by_host_by_event_name</code></td> <td>Statement events per host name and event name</td> </tr><tr><td><code>events_statements_summary_by_program</code></td> <td>Statement events per stored program</td> </tr><tr><td><code>events_statements_summary_by_thread_by_event_name</code></td> <td>Statement events per thread and event name</td> </tr><tr><td><code>events_statements_summary_by_user_by_event_name</code></td> <td>Statement events per user name and event name</td> </tr><tr><td><code>events_statements_summary_global_by_event_name</code></td> <td>Statement events per event name</td> </tr><tr><td><code>prepared_statements_instances</code></td> <td>Prepared statement instances and statistics</td> </tr></tbody></table>

#### Transaction Summaries

**Table 29.10 Performance Schema Transaction Event Summary Tables**

<table summary="A reference that lists all Performance Schema transaction event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_transactions_summary_by_account_by_event_name</code></td> <td>Transaction events per account and event name</td> </tr><tr><td><code>events_transactions_summary_by_host_by_event_name</code></td> <td>Transaction events per host name and event name</td> </tr><tr><td><code>events_transactions_summary_by_thread_by_event_name</code></td> <td>Transaction events per thread and event name</td> </tr><tr><td><code>events_transactions_summary_by_user_by_event_name</code></td> <td>Transaction events per user name and event name</td> </tr><tr><td><code>events_transactions_summary_global_by_event_name</code></td> <td>Transaction events per event name</td> </tr></tbody></table>

#### Object Wait Summaries

**Table 29.11 Performance Schema Object Event Summary Tables**

<table summary="A reference that lists all Performance Schema object event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>objects_summary_global_by_type</code></td> <td>Object summaries</td> </tr></tbody></table>

#### File I/O Summaries

**Table 29.12 Performance Schema File I/O Event Summary Tables**

<table summary="A reference that lists all Performance Schema file I/O event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>file_summary_by_event_name</code></td> <td>File events per event name</td> </tr><tr><td><code>file_summary_by_instance</code></td> <td>File events per file instance</td> </tr></tbody></table>

#### Table I/O and Lock Wait Summaries

**Table 29.13 Performance Schema Table I/O and Lock Wait Event Summary Tables**

<table summary="A reference that lists all Performance Schema table I/O and lock event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>table_io_waits_summary_by_index_usage</code></td> <td>Table I/O waits per index</td> </tr><tr><td><code>table_io_waits_summary_by_table</code></td> <td>Table I/O waits per table</td> </tr><tr><td><code>table_lock_waits_summary_by_table</code></td> <td>Table lock waits per table</td> </tr></tbody></table>

#### Socket Summaries

**Table 29.14 Performance Schema Socket Event Summary Tables**

<table summary="A reference that lists all Performance Schema socket event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>socket_summary_by_event_name</code></td> <td>Socket waits and I/O per event name</td> </tr><tr><td><code>socket_summary_by_instance</code></td> <td>Socket waits and I/O per instance</td> </tr></tbody></table>

#### Memory Summaries

**Table 29.15 Performance Schema Memory Operation Summary Tables**

<table summary="A reference that lists all Performance Schema memory operation summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>memory_summary_by_account_by_event_name</code></td> <td>Memory operations per account and event name</td> </tr><tr><td><code>memory_summary_by_host_by_event_name</code></td> <td>Memory operations per host and event name</td> </tr><tr><td><code>memory_summary_by_thread_by_event_name</code></td> <td>Memory operations per thread and event name</td> </tr><tr><td><code>memory_summary_by_user_by_event_name</code></td> <td>Memory operations per user and event name</td> </tr><tr><td><code>memory_summary_global_by_event_name</code></td> <td>Memory operations globally per event name</td> </tr></tbody></table>

#### Error Summaries

**Table 29.16 Performance Schema Error Summary Tables**

<table summary="A reference that lists all Performance Schema error summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_errors_summary_by_account_by_error</code></td> <td>Errors per account and error code</td> </tr><tr><td><code>events_errors_summary_by_host_by_error</code></td> <td>Errors per host and error code</td> </tr><tr><td><code>events_errors_summary_by_thread_by_error</code></td> <td>Errors per thread and error code</td> </tr><tr><td><code>events_errors_summary_by_user_by_error</code></td> <td>Errors per user and error code</td> </tr><tr><td><code>events_errors_summary_global_by_error</code></td> <td>Errors per error code</td> </tr></tbody></table>

#### Status Variable Summaries

**Table 29.17 Performance Schema Error Status Variable Summary Tables**

<table summary="A reference that lists all Performance Schema stage event summary tables."><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Stage events per account and event name</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Stage events per host name and event name</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Stage waits per thread and event name</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Stage events per user name and event name</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Stage waits per event name</td> </tr></tbody></table>0
