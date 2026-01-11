#### 25.6.15.60 The ndbinfo table\_replicas Table

The `table_replicas` table provides information about the copying, distribution, and checkpointing of `NDB` table fragments and fragment replicas.

The `table_replicas` table contains the following columns:

* `node_id`

  ID of the node from which data is fetched (`DIH` master)

* `table_id`

  Table ID

* `fragment_id`

  Fragment ID

* `initial_gci`

  Initial GCI for table

* `replica_node_id`

  ID of node where fragment replica is stored

* `is_lcp_ongoing`

  Is 1 if LCP is ongoing on this fragment, 0 otherwise

* `num_crashed_replicas`

  Number of crashed fragment replica instances

* `last_max_gci_started`

  Highest GCI started in most recent LCP

* `last_max_gci_completed`

  Highest GCI completed in most recent LCP

* `last_lcp_id`

  ID of most recent LCP

* `prev_lcp_id`

  ID of previous LCP

* `prev_max_gci_started`

  Highest GCI started in previous LCP

* `prev_max_gci_completed`

  Highest GCI completed in previous LCP

* `last_create_gci`

  Last Create GCI of last crashed fragment replica instance

* `last_replica_gci`

  Last GCI of last crashed fragment replica instance

* `is_replica_alive`

  1 if this fragment replica is alive, 0 otherwise
