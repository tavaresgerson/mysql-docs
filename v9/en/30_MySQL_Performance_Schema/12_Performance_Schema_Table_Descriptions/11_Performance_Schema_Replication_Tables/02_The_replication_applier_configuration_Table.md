#### 29.12.11.2 The replication\_applier\_configuration Table

This table shows the configuration parameters that affect transactions applied by the replica. Parameters stored in the table can be changed at runtime with the `CHANGE REPLICATION SOURCE TO` statement.

The `replication_applier_configuration` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `DESIRED_DELAY`

  The number of seconds that the replica must lag the source (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_DELAY`). See Section 19.4.11, “Delayed Replication” for more information.

* `PRIVILEGE_CHECKS_USER`

  The user account that provides the security context for the channel (`CHANGE REPLICATION SOURCE TO` option: `PRIVILEGE_CHECKS_USER`). This is escaped so that it can be copied into an SQL statement to execute individual transactions. See Section 19.3.3, “Replication Privilege Checks” for more information.

* `REQUIRE_ROW_FORMAT`

  Whether the channel accepts only row-based events (`CHANGE REPLICATION SOURCE TO` option: `REQUIRE_ROW_FORMAT`). See Section 19.3.3, “Replication Privilege Checks” for more information.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK`

  Whether the channel requires primary keys always, never, or according to the source's setting (`CHANGE REPLICATION SOURCE TO` option: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`). See Section 19.3.3, “Replication Privilege Checks” for more information.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_TYPE`

  Whether the channel assigns a GTID to replicated transactions that do not already have one (`CHANGE REPLICATION SOURCE TO` option: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). `OFF` means no GTIDs are assigned. `LOCAL` means a GTID is assigned that includes the replica's own UUID (the `server_uuid` setting). `UUID` means a GTID is assigned that includes a manually set UUID. See Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs” for more information.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_VALUE`

  The UUID that is used as part of the GTIDs assigned to anonymous transactions (`CHANGE REPLICATION SOURCE TO` option: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). See Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs” for more information.

The `replication_applier_configuration` table has these indexes:

* Primary key on (`CHANNEL_NAME`)

`TRUNCATE TABLE` is not permitted for the `replication_applier_configuration` table.

The following table shows the correspondence between `replication_applier_configuration` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_applier_configuration columns and SHOW REPLICA STATUS columns"><thead><tr> <th><code>replication_applier_configuration</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>
