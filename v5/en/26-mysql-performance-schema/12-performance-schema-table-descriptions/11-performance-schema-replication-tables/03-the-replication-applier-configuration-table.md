#### 25.12.11.3 The replication\_applier\_configuration Table

This table shows the configuration parameters that affect transactions applied by the replica. Parameters stored in the table can be changed at runtime with the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement, as indicated in the column descriptions.

The [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "25.12.11.3 The replication_applier_configuration Table") table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

* `DESIRED_DELAY`

  The number of seconds that the replica must lag the source. (`CHANGE MASTER TO` option: `MASTER_DELAY`)

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "25.12.11.3 The replication_applier_configuration Table") table.

The following table shows the correspondence between [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "25.12.11.3 The replication_applier_configuration Table") columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

<table summary="Correspondence between replication_applier_configuration columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code class="literal">replication_applier_configuration</code> Column</th> <th><code class="literal">SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code class="literal">DESIRED_DELAY</code></td> <td><code class="literal">SQL_Delay</code></td> </tr></tbody></table>
