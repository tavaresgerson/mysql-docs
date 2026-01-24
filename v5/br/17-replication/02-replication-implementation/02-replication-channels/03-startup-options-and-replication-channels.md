#### 16.2.2.3 Startup Options and Replication Channels

This section describes startup options which are impacted by the addition of replication channels.

The following startup settings *must* be configured correctly to use multi-source replication.

* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository).

  This must be set to `TABLE`. If this variable is set to `FILE`, attempting to add more sources to a replica fails with [`ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_new_channel_wrong_repository).

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)

  This must be set to `TABLE`. If this variable is set to `FILE`, attempting to add more sources to a replica fails with [`ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_new_channel_wrong_repository).

The following startup options now affect *all* channels in a replication topology.

* [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates)

  All transactions received by the replica (even from multiple sources) are written in the binary log.

* [`--relay-log-purge`](replication-options-replica.html#sysvar_relay_log_purge)

  When set, each channel purges its own relay log automatically.

* [`--slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries)

  Applier threads of all channels retry transactions.

* [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start)

  No replication threads start on any channels.

* [`--slave-skip-errors`](replication-options-replica.html#sysvar_slave_skip_errors)

  Execution continues and errors are skipped for all channels.

The values set for the following startup options apply on each channel; since these are [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") startup options, they are applied on every channel.

* `--max-relay-log-size=size`

  Maximum size of the individual relay log file for each channel; after reaching this limit, the file is rotated.

* `--relay-log-space-limit=size`

  Upper limit for the total size of all relay logs combined, for each individual channel. For *`N`* channels, the combined size of these logs is limited to [`relay_log_space_limit * N`](replication-options-replica.html#sysvar_relay_log_space_limit).

* `--slave-parallel-workers=value`

  Number of worker threads per channel.

* [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group)

  Waiting time by an I/O thread for each source.

* `--relay-log-index=filename`

  Base name for each channel's relay log index file. See [Section 16.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "16.2.2.4 Replication Channel Naming Conventions").

* `--relay-log=filename`

  Denotes the base name of each channel's relay log file. See [Section 16.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "16.2.2.4 Replication Channel Naming Conventions").

* `--slave_net-timeout=N`

  This value is set per channel, so that each channel waits for *`N`* seconds to check for a broken connection.

* `--slave-skip-counter=N`

  This value is set per channel, so that each channel skips *`N`* events from its source.
