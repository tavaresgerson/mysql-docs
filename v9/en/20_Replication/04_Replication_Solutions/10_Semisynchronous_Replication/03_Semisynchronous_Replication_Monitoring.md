#### 19.4.10.3 Semisynchronous Replication Monitoring

The plugins for semisynchronous replication expose a number of status variables that enable you to monitor their operation. To check the current values of the status variables, use `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

All `Rpl_semi_sync_xxx` status variables are described at Section 7.1.10, “Server Status Variables”. Some examples are:

* `Rpl_semi_sync_source_clients`

  The number of semisynchronous replicas that are connected to the source server.

* `Rpl_semi_sync_source_status`

  Whether semisynchronous replication currently is operational on the source server. The value is 1 if the plugin has been enabled and a commit acknowledgment has not occurred. It is 0 if the plugin is not enabled or the source has fallen back to asynchronous replication due to commit acknowledgment timeout.

* `Rpl_semi_sync_source_no_tx`

  The number of commits that were not acknowledged successfully by a replica.

* `Rpl_semi_sync_source_yes_tx`

  The number of commits that were acknowledged successfully by a replica.

* `Rpl_semi_sync_replica_status`

  Whether semisynchronous replication currently is operational on the replica. This is 1 if the plugin has been enabled and the replication I/O (receiver) thread is running, 0 otherwise.

When the source switches between asynchronous or semisynchronous replication due to commit-blocking timeout or a replica catching up, it sets the value of the `Rpl_semi_sync_source_status` status variable appropriately. Automatic fallback from semisynchronous to asynchronous replication on the source means that it is possible for the `rpl_semi_sync_source_enabled` system variable to have a value of 1 on the source side even when semisynchronous replication is in fact not operational at the moment. You can monitor the `Rpl_semi_sync_source_status` status variable to determine whether the source currently is using asynchronous or semisynchronous replication.
