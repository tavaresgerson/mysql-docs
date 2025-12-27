#### 21.6.15.7 The ndbinfo config\_nodes Table

The `config_nodes` table shows nodes configured in an NDB Cluster `config.ini` file. For each node, the table displays a row containing the node ID, the type of node (management node, data node, or API node), and the name or IP address of the host on which the node is configured to run.

This table does not indicate whether a given node is actually running, or whether it is currently connected to the cluster. Information about nodes connected to an NDB Cluster can be obtained from the [`nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") and [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") table.

The `config_nodes` table contains the following columns:

* `node_id`

  The node's ID

* `node_type`

  The type of node

* `node_hostname`

  The name or IP address of the host on which the node resides

##### Notes

The `node_id` column shows the node ID used in the `config.ini` file for this node; if none is specified, the node ID that would be assigned automatically to this node is displayed.

The `node_type` column displays one of the following three values:

* `MGM`: Management node.
* `NDB`: Data node.
* `API`: API node; this includes SQL nodes.

The `node_hostname` column shows the node host as specified in the `config.ini` file. This can be empty for an API node, if [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) has not been set in the cluster configuration file. If [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) has not been set for a data node in the configuration file, `localhost` is used here. `localhost` is also used if [`HostName`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-hostname) has not been specified for a management node.

The `config_nodes` table was added in NDB 7.5.7.
