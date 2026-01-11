#### 25.6.15.53 The ndbinfo restart\_info Table

The `restart_info` table contains information about node restart operations. Each entry in the table corresponds to a node restart status report in real time from a data node with the given node ID. Only the most recent report for any given node is shown.

The `restart_info` table contains the following columns:

* `node_id`

  Node ID in the cluster

* `node_restart_status`

  Node status; see text for values. Each of these corresponds to a possible value of `node_restart_status_int`.

* `node_restart_status_int`

  Node status code; see text for values.

* `secs_to_complete_node_failure`

  Time in seconds to complete node failure handling

* `secs_to_allocate_node_id`

  Time in seconds from node failure completion to allocation of node ID

* `secs_to_include_in_heartbeat_protocol`

  Time in seconds from allocation of node ID to inclusion in heartbeat protocol

* `secs_until_wait_for_ndbcntr_master`

  Time in seconds from being included in heartbeat protocol until waiting for `NDBCNTR` master began

* `secs_wait_for_ndbcntr_master`

  Time in seconds spent waiting to be accepted by `NDBCNTR` master for starting

* `secs_to_get_start_permitted`

  Time in seconds elapsed from receiving of permission for start from master until all nodes have accepted start of this node

* `secs_to_wait_for_lcp_for_copy_meta_data`

  Time in seconds spent waiting for LCP completion before copying metadata

* `secs_to_copy_meta_data`

  Time in seconds required to copy metadata from master to newly starting node

* `secs_to_include_node`

  Time in seconds waited for GCP and inclusion of all nodes into protocols

* `secs_starting_node_to_request_local_recovery`

  Time in seconds that the node just starting spent waiting to request local recovery

* `secs_for_local_recovery`

  Time in seconds required for local recovery by node just starting

* `secs_restore_fragments`

  Time in seconds required to restore fragments from LCP files

* `secs_undo_disk_data`

  Time in seconds required to execute undo log on disk data part of records

* `secs_exec_redo_log`

  Time in seconds required to execute redo log on all restored fragments

* `secs_index_rebuild`

  Time in seconds required to rebuild indexes on restored fragments

* `secs_to_synchronize_starting_node`

  Time in seconds required to synchronize starting node from live nodes

* `secs_wait_lcp_for_restart`

  Time in seconds required for LCP start and completion before restart was completed

* `secs_wait_subscription_handover`

  Time in seconds spent waiting for handover of replication subscriptions

* `total_restart_secs`

  Total number of seconds from node failure until node is started again

##### Notes

The following list contains values defined for the `node_restart_status_int` column with their internal status names (in parentheses), and the corresponding messages shown in the `node_restart_status` column:

* `0` (`ALLOCATED_NODE_ID`)

  `Allocated node id`

* `1` (`INCLUDED_IN_HB_PROTOCOL`)

  `Included in heartbeat protocol`

* `2` (`NDBCNTR_START_WAIT`)

  `Wait for NDBCNTR master to permit us to start`

* `3` (`NDBCNTR_STARTED`)

  `NDBCNTR master permitted us to start`

* `4` (`START_PERMITTED`)

  `All nodes permitted us to start`

* `5` (`WAIT_LCP_TO_COPY_DICT`)

  `Wait for LCP completion to start copying metadata`

* `6` (`COPY_DICT_TO_STARTING_NODE`)

  `Copying metadata to starting node`

* `7` (`INCLUDE_NODE_IN_LCP_AND_GCP`)

  `Include node in LCP and GCP protocols`

* `8` (`LOCAL_RECOVERY_STARTED`)

  `Restore fragments ongoing`

* `9` (`COPY_FRAGMENTS_STARTED`)

  `Synchronizing starting node with live nodes`

* `10` (`WAIT_LCP_FOR_RESTART`)

  `Wait for LCP to ensure durability`

* `11` (`WAIT_SUMA_HANDOVER`)

  `Wait for handover of subscriptions`

* `12` (`RESTART_COMPLETED`)

  `Restart completed`

* `13` (`NODE_FAILED`)

  `Node failed, failure handling in progress`

* `14` (`NODE_FAILURE_COMPLETED`)

  `Node failure handling completed`

* `15` (`NODE_GETTING_PERMIT`)

  `All nodes permitted us to start`

* `16` (`NODE_GETTING_INCLUDED`)

  `Include node in LCP and GCP protocols`

* `17` (`NODE_GETTING_SYNCHED`)

  `Synchronizing starting node with live nodes`

* `18` (`NODE_GETTING_LCP_WAITED`)

  [none]

* `19` (`NODE_ACTIVE`)

  `Restart completed`

* `20` (`NOT_DEFINED_IN_CLUSTER`)

  [none]

* `21` (`NODE_NOT_RESTARTED_YET`)

  `Initial state`

Status numbers 0 through 12 apply on master nodes only; the remainder of those shown in the table apply to all restarting data nodes. Status numbers 13 and 14 define node failure states; 20 and 21 occur when no information about the restart of a given node is available.

See also Section 25.6.4, “Summary of NDB Cluster Start Phases”.
