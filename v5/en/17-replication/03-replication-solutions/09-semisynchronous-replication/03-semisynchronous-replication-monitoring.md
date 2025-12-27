#### 16.3.9.3 Semisynchronous Replication Monitoring

The plugins for the semisynchronous replication capability expose several system and status variables that you can examine to determine its configuration and operational state.

The system variable reflect how semisynchronous replication is configured. To check their values, use [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"):

```sql
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

The status variables enable you to monitor the operation of semisynchronous replication. To check their values, use [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"):

```sql
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

When the source switches between asynchronous or semisynchronous replication due to commit-blocking timeout or a replica catching up, it sets the value of the [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status) status variable appropriately. Automatic fallback from semisynchronous to asynchronous replication on the source means that it is possible for the [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled) system variable to have a value of 1 on the source side even when semisynchronous replication is in fact not operational at the moment. You can monitor the [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status) status variable to determine whether the source currently is using asynchronous or semisynchronous replication.

To see how many semisynchronous replicas are connected, check [`Rpl_semi_sync_master_clients`](server-status-variables.html#statvar_Rpl_semi_sync_master_clients).

The number of commits that have been acknowledged successfully or unsuccessfully by replicas are indicated by the [`Rpl_semi_sync_master_yes_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_yes_tx) and [`Rpl_semi_sync_master_no_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_tx) variables.

On the replica side, [`Rpl_semi_sync_slave_status`](server-status-variables.html#statvar_Rpl_semi_sync_slave_status) indicates whether semisynchronous replication currently is operational.
