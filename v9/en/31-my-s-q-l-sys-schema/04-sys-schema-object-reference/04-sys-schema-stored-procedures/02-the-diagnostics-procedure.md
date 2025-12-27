#### 30.4.4.2 The diagnostics() Procedure

Creates a report of the current server status for diagnostic purposes.

This procedure disables binary logging during its execution by manipulating the session value of the `sql_log_bin` system variable. That is a restricted operation, so the procedure requires privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

Data collected for `diagnostics()` Procedure") includes this information:

* Information from the `metrics` view (see Section 30.4.3.21, “The metrics View”)

* Information from other relevant `sys` schema views, such as the one that determines queries in the 95th percentile

* Information from the `ndbinfo` schema, if the MySQL server is part of NDB Cluster

* Replication status (both source and replica)

Some of the sys schema views are calculated as initial (optional), overall, and delta values:

* The initial view is the content of the view at the start of the `diagnostics()` Procedure") procedure. This output is the same as the start values used for the delta view. The initial view is included if the `diagnostics.include_raw` configuration option is `ON`.

* The overall view is the content of the view at the end of the `diagnostics()` Procedure") procedure. This output is the same as the end values used for the delta view. The overall view is always included.

* The delta view is the difference from the beginning to the end of procedure execution. The minimum and maximum values are the minimum and maximum values from the end view, respectively. They do not necessarily reflect the minimum and maximum values in the monitored period. Except for the `metrics` view, the delta is calculated only between the first and last outputs.

##### Parameters

* `in_max_runtime INT UNSIGNED`: The maximum data collection time in seconds. Use `NULL` to collect data for the default of 60 seconds. Otherwise, use a value greater than 0.

* `in_interval INT UNSIGNED`: The sleep time between data collections in seconds. Use `NULL` to sleep for the default of 30 seconds. Otherwise, use a value greater than 0.

* `in_auto_config ENUM('current', 'medium', 'full')`: The Performance Schema configuration to use. Permitted values are:

  + `current`: Use the current instrument and consumer settings.

  + `medium`: Enable some instruments and consumers.

  + `full`: Enable all instruments and consumers.

  Note

  The more instruments and consumers enabled, the more impact on MySQL server performance. Be careful with the `medium` setting and especially the `full` setting, which has a large performance impact.

  Use of the `medium` or `full` setting requires the `SUPER` privilege.

  If a setting other than `current` is chosen, the current settings are restored at the end of the procedure.

##### Configuration Options

`diagnostics()` Procedure") operation can be modified using the following configuration options or their corresponding user-defined variables (see Section 30.4.2.1, “The sys\_config Table”):

* `debug`, `@sys.debug`

  If this option is `ON`, produce debugging output. The default is `OFF`.

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  If this option is `ON`, the `diagnostics()` Procedure") procedure is permitted to perform table scans on the Information Schema `TABLES` table. This can be expensive if there are many tables. The default is `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  If this option is `ON`, the `diagnostics()` Procedure") procedure output includes the raw output from querying the `metrics` view. The default is `OFF`.

* `statement_truncate_len`, `@sys.statement_truncate_len`

  The maximum length of statements returned by the `format_statement()` Function") function. Longer statements are truncated to this length. The default is 64.

##### Example

Create a diagnostics report that starts an iteration every 30 seconds and runs for at most 120 seconds using the current Performance Schema settings:

```
mysql> CALL sys.diagnostics(120, 30, 'current');
```

To capture the output from the `diagnostics()` procedure in a file as it runs, use the **mysql** client `tee filename` and `notee` commands (see Section 6.5.1.2, “mysql Client Commands”):

```
mysql> tee diag.out;
mysql> CALL sys.diagnostics(120, 30, 'current');
mysql> notee;
```
