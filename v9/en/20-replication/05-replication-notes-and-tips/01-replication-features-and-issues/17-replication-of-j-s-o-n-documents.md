#### 19.5.1.17 Replication of JSON Documents

In MySQL 9.5, it is possible to log partial updates to JSON documents (see Partial Updates of JSON Values). The logging behavior depends on the format used, as described here:

**Statement-based replication.** JSON partial updates are always logged as partial updates. This cannot be disabled when using statement-based logging.

**Row-based replication.** JSON partial updates are not logged as such by default, but instead are logged as complete documents. To enable logging of partial updates, set `binlog_row_value_options=PARTIAL_JSON`. If a replication source has this variable set, partial updates received from that source are handled and applied by a replica regardless of the replica's own setting for the variable.
