#### 21.6.15.1 The ndbinfo arbitrator\_validity\_detail Table

The `arbitrator_validity_detail` table shows the view that each data node in the cluster has of the arbitrator. It is a subset of the [`membership`](mysql-cluster-ndbinfo-membership.html "21.6.15.25 The ndbinfo membership Table") table.

The `arbitrator_validity_detail` table contains the following columns:

* `node_id`

  This node's node ID

* `arbitrator`

  Node ID of arbitrator

* `arb_ticket`

  Internal identifier used to track arbitration

* `arb_connected`

  Whether this node is connected to the arbitrator; either of `Yes` or `No`

* `arb_state`

  Arbitration state

##### Notes

The node ID is the same as that reported by [**ndb\_mgm -e "SHOW"**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client").

All nodes should show the same `arbitrator` and `arb_ticket` values as well as the same `arb_state` value. Possible `arb_state` values are `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH`, and `UNKNOWN`.

`arb_connected` shows whether the current node is connected to the `arbitrator`.
