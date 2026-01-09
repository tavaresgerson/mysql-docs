#### 29.12.11.4 The replication_applier_global_filters Table

This table shows the global replication filters configured on this replica. The `replication_applier_global_filters` table has these columns:

* `FILTER_NAME`

  The type of replication filter that has been configured.

* `FILTER_RULE`

  The rules configured for the replication filter type using either `--replicate-*` command options or `CHANGE REPLICATION FILTER`.

* `CONFIGURED_BY`

  The method used to configure the replication filter, can be one of:

  + `CHANGE_REPLICATION_FILTER` configured by a global replication filter using a `CHANGE REPLICATION FILTER` statement.

  + `STARTUP_OPTIONS` configured by a global replication filter using a `--replicate-*` option.

* `ACTIVE_SINCE`

  Timestamp of when the replication filter was configured.
