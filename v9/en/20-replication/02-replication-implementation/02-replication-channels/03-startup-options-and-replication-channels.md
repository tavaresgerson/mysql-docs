#### 19.2.2.3 Startup Options and Replication Channels

This section describes startup options which are impacted by the addition of replication channels.

The following startup options now affect *all* channels in a replication topology.

* `--log-replica-updates`

  All transactions received by the replica (even from multiple sources) are written in the binary log.

* `--relay-log-purge`

  When set, each channel purges its own relay log automatically.

* `--replica-transaction-retries`

  The specified number of transaction retries can take place on all applier threads of all channels.

* `--skip-replica-start`

  No replication threads start on any channels.

* `--replica-skip-errors`

  Execution continues and errors are skipped for all channels.

The values set for the following startup options apply on each channel; since these are **mysqld** startup options, they are applied on every channel.

* `--max-relay-log-size=size`

  Maximum size of the individual relay log file for each channel; after reaching this limit, the file is rotated.

* `--relay-log-space-limit=size`

  Upper limit for the total size of all relay logs combined, for each individual channel. For *`N`* channels, the combined size of these logs is limited to `relay_log_space_limit * N`.

* `--replica-parallel-workers=value`

  Number of replication applier threads per channel.

* `replica_checkpoint_group`

  Waiting time by an receiver thread for each source.

* `--relay-log-index=filename`

  Base name for each channel's relay log index file. See Section 19.2.2.4, “Replication Channel Naming Conventions”.

* `--relay-log=filename`

  Denotes the base name of each channel's relay log file. See Section 19.2.2.4, “Replication Channel Naming Conventions”.

* `--replica-net-timeout=N`

  This value is set per channel, so that each channel waits for *`N`* seconds to check for a broken connection.

* `--replica-skip-counter=N`

  This value is set per channel, so that each channel skips *`N`* events from its source.
