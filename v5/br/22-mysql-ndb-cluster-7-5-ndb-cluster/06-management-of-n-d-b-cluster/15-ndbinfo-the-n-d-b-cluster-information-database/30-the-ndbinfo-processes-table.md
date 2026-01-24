#### 21.6.15.30 The ndbinfo processes Table

This table contains information about NDB Cluster node processes; each node is represented by the row in the table. Only nodes that are connected to the cluster are shown in this table. You can obtain information about nodes that are configured but not connected to the cluster from the [`nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") and [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table") tables.

The `processes` table contains the following columns:

* `node_id`

  The node's unique node ID in the cluster

* `node_type`

  Type of node (management, data, or API node; see text)

* `node_version`

  Version of the `NDB` software program running on this node.

* `process_id`

  This node's process ID

* `angel_process_id`

  Process ID of this node's angel process

* `process_name`

  Name of the executable

* `service_URI`

  Service URI of this node (see text)

##### Notes

`node_id` is the ID assigned to this node in the cluster.

The `node_type` column displays one of the following three values:

* `MGM`: Management node.
* `NDB`: Data node.
* `API`: API or SQL node.

For an executable shipped with the NDB Cluster distribution, `node_version` shows the two-part MySQL NDB Cluster version string, such as `5.7.44-ndb-7.5.36` or `5.7.44-ndb-7.6.36`, that it was compiled with. See [Version strings used in NDB Cluster software](mysql-cluster-general-info.html#mysql-cluster-version-strings "Version strings used in NDB Cluster software"), for more information.

`process_id` is the node executable's process ID as shown by the host operating system using a process display application such as **top** on Linux, or the Task Manager on Windows platforms.

`angel_process_id` is the system process ID for the node's angel process, which ensures that a data node or SQL is automatically restarted in cases of failures. For management nodes and API nodes other than SQL nodes, the value of this column is `NULL`.

The `process_name` column shows the name of the running executable. For management nodes, this is `ndb_mgmd`. For data nodes, this is `ndbd` (single-threaded) or `ndbmtd` (multithreaded). For SQL nodes, this is `mysqld`. For other types of API nodes, it is the name of the executable program connected to the cluster; NDB API applications can set a custom value for this using [`Ndb_cluster_connection::set_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-name).

`service_URI` shows the service network address. For management nodes and data nodes, the scheme used is `ndb://`. For SQL nodes, this is `mysql://`. By default, API nodes other than SQL nodes use `ndb://` for the scheme; NDB API applications can set this to a custom value using `Ndb_cluster_connection::set_service_uri()`. regardless of the node type, the scheme is followed by the IP address used by the NDB transporter for the node in question. For management nodes and SQL nodes, this address includes the port number (usually 1186 for management nodes and 3306 for SQL nodes). If the SQL node was started with the [`bind_address`](server-system-variables.html#sysvar_bind_address) system variable set, this address is used instead of the transporter address, unless the bind address is set to `*`, `0.0.0.0`, or `::`.

Additional path information may be included in the `service_URI` value for an SQL node reflecting various configuration options. For example, `mysql://198.51.100.3/tmp/mysql.sock` indicates that the SQL node was started with the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable enabled, and `mysql://198.51.100.3:3306/?server-id=1` shows that replication is enabled for this SQL node.

The `processes` table was added in NDB 7.5.7.
