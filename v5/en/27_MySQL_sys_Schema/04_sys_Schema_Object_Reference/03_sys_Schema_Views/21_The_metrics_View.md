#### 26.4.3.21 The metrics View

This view summarizes MySQL server metrics to show variable
names, values, types, and whether they are enabled. By
default, rows are sorted by variable type and name.

The [`metrics`](sys-metrics.html "26.4.3.21 The metrics View") view includes this
information:

* Global status variables from the Performance Schema
  [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table

* `InnoDB` metrics from the
  `INFORMATION_SCHEMA`
  [`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") table

* Current and total memory allocation, based on the
  Performance Schema memory instrumentation

* The current time (human readable and Unix timestamp
  formats)

There is some duplication of information between the
[`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") and
[`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") tables, which the
[`metrics`](sys-metrics.html "26.4.3.21 The metrics View") view eliminates.

The [`metrics`](sys-metrics.html "26.4.3.21 The metrics View") view has these
columns:

* `Variable_name`

  The metric name. The metric type determines the source
  from which the name is taken:

  + For global status variables: The
    `VARIABLE_NAME` column of the
    [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table

  + For `InnoDB` metrics: The
    `NAME` column of the
    [`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") table

  + For other metrics: A view-provided descriptive string
* `Variable_value`

  The metric value. The metric type determines the source
  from which the value is taken:

  + For global status variables: The
    `VARIABLE_VALUE` column of the
    [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table

  + For `InnoDB` metrics: The
    `COUNT` column of the
    [`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") table

  + For memory metrics: The relevant column from the
    Performance Schema
    [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables")
    table

  + For the current time: The value of
    [`NOW(3)`](date-and-time-functions.html#function_now) or
    [`UNIX_TIMESTAMP(NOW(3))`](date-and-time-functions.html#function_unix-timestamp)

* `Type`

  The metric type:

  + For global status variables: `Global
    Status`

  + For `InnoDB` metrics: `InnoDB
    Metrics - %`, where `%` is
    replaced by the value of the
    `SUBSYSTEM` column of the
    [`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") table

  + For memory metrics: `Performance
    Schema`

  + For the current time: `System Time`
* `Enabled`

  Whether the metric is enabled:

  + For global status variables: `YES`
  + For `InnoDB` metrics:
    `YES` if the
    `STATUS` column of the
    [`INNODB_METRICS`](information-schema-innodb-metrics-table.html "24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table") table is
    `enabled`, `NO`
    otherwise

  + For memory metrics: `NO`,
    `YES`, or `PARTIAL`
    (currently, `PARTIAL` occurs only for
    memory metrics and indicates that not all
    `memory/%` instruments are enabled;
    Performance Schema memory instruments are always
    enabled)

  + For the current time: `YES`