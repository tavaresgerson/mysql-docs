#### 29.12.11.3 The replication\_applier\_filters Table

This table shows the replication channel specific filters configured on this replica. Each row provides information on a replication channel's configured type of filter. The `replication_applier_filters` table has these columns:

* `CHANNEL_NAME`

  The name of replication channel with a replication filter configured.

* `FILTER_NAME`

  The type of replication filter that has been configured for this replication channel.

* `FILTER_RULE`

  The rules configured for the replication filter type using either `--replicate-*` command options or `CHANGE REPLICATION FILTER`.

* `CONFIGURED_BY`

  The method used to configure the replication filter, can be one of:

  + `CHANGE_REPLICATION_FILTER` configured by a global replication filter using a `CHANGE REPLICATION FILTER` statement.

  + `STARTUP_OPTIONS` configured by a global replication filter using a `--replicate-*` option.

  + `CHANGE_REPLICATION_FILTER_FOR_CHANNEL` configured by a channel specific replication filter using a `CHANGE REPLICATION FILTER FOR CHANNEL` statement.

  + `STARTUP_OPTIONS_FOR_CHANNEL` configured by a channel specific replication filter using a `--replicate-*` option.

* `ACTIVE_SINCE`

  Timestamp of when the replication filter was configured.

* `COUNTER`

  The number of times the replication filter has been used since it was configured.
