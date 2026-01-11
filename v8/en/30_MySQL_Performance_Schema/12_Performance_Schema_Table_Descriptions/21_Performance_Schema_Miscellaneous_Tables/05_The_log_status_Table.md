#### 29.12.21.5 The log_status Table

The `log_status` table provides information that enables an online backup tool to copy the required log files without locking those resources for the duration of the copy process.

When the `log_status` table is queried, the server blocks logging and related administrative changes for just long enough to populate the table, then releases the resources. The `log_status` table informs the online backup which point it should copy up to in the source's binary log and `gtid_executed` record, and the relay log for each replication channel. It also provides relevant information for individual storage engines, such as the last log sequence number (LSN) and the LSN of the last checkpoint taken for the `InnoDB` storage engine.

The `log_status` table has these columns:

* `SERVER_UUID`

  The server UUID for this server instance. This is the generated unique value of the read-only system variable `server_uuid`.

* `LOCAL`

  The log position state information from the source, provided as a single JSON object with the following keys:

  `binary_log_file` :   The name of the current binary log file.

  `binary_log_position` :   The current binary log position at the time the `log_status` table was accessed.

  `gtid_executed` :   The current value of the global server variable `gtid_executed` at the time the `log_status` table was accessed. This information is consistent with the `binary_log_file` and `binary_log_position` keys.

* `REPLICATION`

  A JSON array of channels, each with the following information:

  `channel_name` :   The name of the replication channel. The default replication channel's name is the empty string (“”).

  `relay_log_file` :   The name of the current relay log file for the replication channel.

  `relay_log_pos` :   The current relay log position at the time the `log_status` table was accessed.

* `STORAGE_ENGINES`

  Relevant information from individual storage engines, provided as a JSON object with one key for each applicable storage engine.

The `log_status` table has no indexes.

The `BACKUP_ADMIN` privilege, as well as the `SELECT` privilege, is required for access to the `log_status` table.

`TRUNCATE TABLE` is not permitted for the `log_status` table.
