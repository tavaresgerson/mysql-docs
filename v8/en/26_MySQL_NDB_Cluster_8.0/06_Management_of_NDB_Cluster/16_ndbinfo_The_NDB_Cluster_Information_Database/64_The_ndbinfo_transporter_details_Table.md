#### 25.6.16.64 The ndbinfo transporter_details Table

This table contains information about individual NDB transporters, rather than aggregate information as shown by the `transporters` table. The `transporter_details` table was added in NDB 8.0.37.

The `transporter_details` table contains the following columns:

* `node_id`

  This data node's unique node ID in the cluster

* `block_instance`
* `trp_id`

  The transporter ID

* `remote_node_id`

  The remote data node's node ID

* `status`

  Status of the connection

* `remote_address`

  Name or IP address of the remote host

* `bytes_sent`

  Number of bytes sent using this connection

* `bytes_received`

  Number of bytes received using this connection

* `connect_count`

  Number of times connection established on this transporter

* `overloaded`

  1 if this transporter is currently overloaded, otherwise 0

* `overload_count`

  Number of times this transporter has entered overload state since connecting

* `slowdown`

  1 if this transporter is in slowdown state, otherwise 0

* `slowdown_count`

  Number of times this transporter has entered slowdown state since connecting

* `encrypted`

  If this transporter is connected using TLS, this column is `1`, otherwise it is `0`.

* `sendbuffer_used_bytes`

  The amount, in bytes, of signal data currently awaiting send by this transporter.

* `sendbuffer_max_used_bytes`

  The maximum amount, in bytes, of signal data awaiting send at any one time by this transporter.

* `sendbuffer_alloc_bytes`

  Amount of send buffer, in bytes, currently allocated for signal data storage for this transporter.

* `sendbuffer_max_alloc_bytes`

  Maxmimum amount of send buffer, in bytes, allocated for signal data storage at any one time for this transporter.

* `type`

  The connection type used by this transporter (`TCP` or `SHM`).

The `transporter_details` table displays a row showing the status of each transporter in the cluster. See the Notes for the `transporters` table for more information about each of the columns in this table.

The `sendbuffer_used_bytes`, `sendbuffer_max_used_bytes`, `sendbuffer_alloc_bytes`, `sendbuffer_max_alloc_bytes`, and `type` columns were added in NDB 8.0.38.
