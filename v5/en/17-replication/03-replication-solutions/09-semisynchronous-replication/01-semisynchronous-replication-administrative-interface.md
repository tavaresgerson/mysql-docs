#### 16.3.9.1 Semisynchronous Replication Administrative Interface

The administrative interface to semisynchronous replication has several components:

* Two plugins implement semisynchronous capability. There is one plugin for the source side and one for the replica side.

* System variables control plugin behavior. Some examples:

  + [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

    Controls whether semisynchronous replication is enabled on the source. To enable or disable the plugin, set this variable to 1 or 0, respectively. The default is 0 (off).

  + [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

    A value in milliseconds that controls how long the source waits on a commit for acknowledgment from a replica before timing out and reverting to asynchronous replication. The default value is 10000 (10 seconds).

  + [`rpl_semi_sync_slave_enabled`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled)

    Similar to [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled), but controls the replica plugin.

  All `rpl_semi_sync_xxx` system variables are described at [Section 16.1.6.2, “Replication Source Options and Variables”](replication-options-source.html "16.1.6.2 Replication Source Options and Variables") and [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

* From MySQL 5.7.33, you can improve the performance of semisynchronous replication by enabling the system variables [`replication_sender_observe_commit_only`](replication-options-replica.html#sysvar_replication_sender_observe_commit_only), which limits callbacks, and [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config), which adds shared locks and avoids unnecessary lock acquisitions. These settings help as the number of replicas increases, because contention for locks can slow down performance. Semisynchronous replication source servers can also get performance benefits from enabling these system variables, because they use the same locking mechanisms as the replicas.

* Status variables enable semisynchronous replication monitoring. Some examples:

  + [`Rpl_semi_sync_master_clients`](server-status-variables.html#statvar_Rpl_semi_sync_master_clients)

    The number of semisynchronous replicas.

  + [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status)

    Whether semisynchronous replication currently is operational on the source. The value is 1 if the plugin has been enabled and a commit acknowledgment has not occurred. It is 0 if the plugin is not enabled or the source has fallen back to asynchronous replication due to commit acknowledgment timeout.

  + [`Rpl_semi_sync_master_no_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_tx)

    The number of commits that were not acknowledged successfully by a replica.

  + [`Rpl_semi_sync_master_yes_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_yes_tx)

    The number of commits that were acknowledged successfully by a replica.

  + [`Rpl_semi_sync_slave_status`](server-status-variables.html#statvar_Rpl_semi_sync_slave_status)

    Whether semisynchronous replication currently is operational on the replica. This is 1 if the plugin has been enabled and the replication I/O thread is running, 0 otherwise.

  All `Rpl_semi_sync_xxx` status variables are described at [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

The system and status variables are available only if the appropriate source or replica plugin has been installed with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement").
