#### 21.6.15.2 The ndbinfo arbitrator_validity_summary Table

The `arbitrator_validity_summary` table provides a composite view of the arbitrator with regard to the cluster's data nodes.

The `arbitrator_validity_summary` table contains the following columns:

* `arbitrator`

  Node ID of arbitrator

* `arb_ticket`

  Internal identifier used to track arbitration

* `arb_connected`

  Whether this arbitrator is connected to the cluster; either of `Yes` or `No`

* `consensus_count`

  Number of data nodes that see this node as arbitrator

##### Notes

In normal operations, this table should have only 1 row for any appreciable length of time. If it has more than 1 row for longer than a few moments, then either not all nodes are connected to the arbitrator, or all nodes are connected, but do not agree on the same arbitrator.

The `arbitrator` column shows the arbitrator's node ID.

`arb_ticket` is the internal identifier used by this arbitrator.

`arb_connected` shows whether this node is connected to the cluster as an arbitrator.
