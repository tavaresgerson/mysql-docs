#### 19.2.2.3 Startup Options and Replication Channels

This section describes startup options which are impacted by the
addition of replication channels.

The [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) and
[`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) system
variables must *not* be set to
`FILE` when you use replication channels. In
MySQL 8.0, the `FILE` setting is deprecated, and
`TABLE` is the default, so the system variables
can be omitted. From MySQL 8.0.23, they must be omitted because
their use is deprecated from that release. If these system
variables are set to `FILE`, attempting to add
more sources to a replica fails with
[`ER_REPLICA_NEW_CHANNEL_WRONG_REPOSITORY`](/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_replica_new_channel_wrong_repository).

The following startup options now affect *all*
channels in a replication topology.

* [`--log-replica-updates`](replication-options-binary-log.html#sysvar_log_replica_updates) or
  [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates)

  All transactions received by the replica (even from multiple
  sources) are written in the binary log.

* [`--relay-log-purge`](replication-options-replica.html#sysvar_relay_log_purge)

  When set, each channel purges its own relay log automatically.

* [`--replica-transaction-retries`](replication-options-replica.html#sysvar_replica_transaction_retries)
  or
  [`--slave-transaction-retries`](replication-options-replica.html#sysvar_slave_transaction_retries)

  The specified number of transaction retries can take place on
  all applier threads of all channels.

* [`--skip-replica-start`](replication-options-replica.html#option_mysqld_skip-replica-start) or
  [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) (or
  [`skip_replica_start`](replication-options-replica.html#sysvar_skip_replica_start) or
  [`skip_slave_start`](replication-options-replica.html#sysvar_skip_slave_start) system
  variable set)

  No replication threads start on any channels.

* [`--replica-skip-errors`](replication-options-replica.html#sysvar_replica_skip_errors) or
  [`--slave-skip-errors`](replication-options-replica.html#sysvar_slave_skip_errors)

  Execution continues and errors are skipped for all channels.

The values set for the following startup options apply on each
channel; since these are [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") startup
options, they are applied on every channel.

* `--max-relay-log-size=size`

  Maximum size of the individual relay log file for each
  channel; after reaching this limit, the file is rotated.

* `--relay-log-space-limit=size`

  Upper limit for the total size of all relay logs combined, for
  each individual channel. For *`N`*
  channels, the combined size of these logs is limited to
  [`relay_log_space_limit *
  N`](replication-options-replica.html#sysvar_relay_log_space_limit).

* `--replica-parallel-workers=value`
  or
  `--slave-parallel-workers=value`

  Number of replication applier threads per channel.

* [`replica_checkpoint_group`](replication-options-replica.html#sysvar_replica_checkpoint_group) or
  [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group)

  Waiting time by an receiver thread for each source.

* `--relay-log-index=filename`

  Base name for each channel's relay log index file. See
  [Section 19.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "19.2.2.4 Replication Channel Naming Conventions").

* `--relay-log=filename`

  Denotes the base name of each channel's relay log file.
  See [Section 19.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "19.2.2.4 Replication Channel Naming Conventions").

* `--replica-net-timeout=N` or
  `--slave-net-timeout=N`

  This value is set per channel, so that each channel waits for
  *`N`* seconds to check for a broken
  connection.

* `--replica-skip-counter=N` or
  `--slave-skip-counter=N`

  This value is set per channel, so that each channel skips
  *`N`* events from its source.