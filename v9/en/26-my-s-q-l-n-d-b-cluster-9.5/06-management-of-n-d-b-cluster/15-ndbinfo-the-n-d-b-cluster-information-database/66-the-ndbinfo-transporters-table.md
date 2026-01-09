#### 25.6.15.66 The ndbinfo transporters Table

This table contains information about NDB transporters. For similar information about individual transporters, see the `transporter_details` table.

The `transporters` table contains the following columns:

* `node_id`

  This data node's unique node ID in the cluster

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

##### Notes

For each running data node in the cluster, the `transporters` table displays a row showing the status of each of that node's connections with all nodes in the cluster, *including itself*. This information is shown in the table's *status* column, which can have any one of the following values: `CONNECTING`, `CONNECTED`, `DISCONNECTING`, or `DISCONNECTED`.

Connections to API and management nodes which are configured but not currently connected to the cluster are shown with status `DISCONNECTED`. Rows where the `node_id` is that of a data node which is not currently connected are not shown in this table. (This is similar omission of disconnected nodes in the `ndbinfo.nodes` table.

The `remote_address` is the host name or address for the node whose ID is shown in the `remote_node_id` column. The `bytes_sent` from this node and `bytes_received` by this node are the numbers, respectively, of bytes sent and received by the node using this connection since it was established. For nodes whose status is `CONNECTING` or `DISCONNECTED`, these columns always display `0`.

Assume you have a 5-node cluster consisting of 2 data nodes, 2 SQL nodes, and 1 management node, as shown in the output of the `SHOW` command in the **ndb_mgm** client:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.100.10.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @10.100.10.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @10.100.10.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @10.100.10.20  (9.5.0-ndb-9.5.0)
id=21   @10.100.10.21  (9.5.0-ndb-9.5.0)
```

There are 10 rows in the `transporters` table—5 for the first data node, and 5 for the second—assuming that all data nodes are running, as shown here:

```
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
| node_id | remote_node_id | status     | remote_address | bytes_sent | bytes_received | connect_count | overloaded | overload_count | slowdown | slowdown_count | encrypted |
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
|       5 |              6 | CONNECTED  | 127.0.0.1      |   15509748 |       15558204 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |             50 | CONNECTED  | 127.0.0.1      |    1058220 |         284316 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |            100 | CONNECTED  | 127.0.0.1      |     574796 |         402208 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |            101 | CONNECTING | -              |          0 |              0 |             0 |          0 |              0 |        0 |              0 |         0 |
|       6 |              5 | CONNECTED  | 127.0.0.1      |   15558204 |       15509748 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |             50 | CONNECTED  | 127.0.0.1      |    1054548 |         283812 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |            100 | CONNECTED  | 127.0.0.1      |     529948 |         397444 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |            101 | CONNECTING | -              |          0 |              0 |             0 |          0 |              0 |        0 |              0 |         0 |
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
```

```
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTED     |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
|       2 |              1 | CONNECTED     |
|       2 |              2 | DISCONNECTED  |
|       2 |             10 | CONNECTED     |
|       2 |             20 | CONNECTED     |
|       2 |             21 | CONNECTED     |
+---------+----------------+---------------+
10 rows in set (0.04 sec)
```

If you shut down one of the data nodes in this cluster using the command `2 STOP` in the **ndb_mgm** client, then repeat the previous query (again using the **mysql** client), this table now shows only 5 rows—1 row for each connection from the remaining management node to another node, including both itself and the data node that is currently offline—and displays `CONNECTING` for the status of each remaining connection to the data node that is currently offline, as shown here:

```
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTING    |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
+---------+----------------+---------------+
5 rows in set (0.02 sec)
```

The `connect_count`, `overloaded`, `overload_count`, `slowdown`, and `slowdown_count` counters are reset on connection, and retain their values after the remote node disconnects. The `bytes_sent` and `bytes_received` counters are also reset on connection, and so retain their values following disconnection (until the next connection resets them).

The *overload* state referred to by the `overloaded` and `overload_count` columns occurs when this transporter's send buffer contains more than `OVerloadLimit` bytes (default is 80% of `SendBufferMemory`, that is, 0.8 \* 2097152 = 1677721 bytes). When a given transporter is in a state of overload, any new transaction that tries to use this transporter fails with Error 1218 (Send Buffers overloaded in NDB kernel). This affects both scans and primary key operations.

The *slowdown* state referenced by the `slowdown` and `slowdown_count` columns of this table occurs when the transporter's send buffer contains more than 60% of the overload limit (equal to 0.6 \* 2097152 = 1258291 bytes by default). In this state, any new scan using this transporter has its batch size reduced to minimize the load on the transporter.

Common causes of send buffer slowdown or overloading include the following:

* Data size, in particular the quantity of data stored in `TEXT` columns or `BLOB` columns (or both types of columns)

* Having a data node (ndbd or ndbmtd) on the same host as an SQL node that is engaged in binary logging

* Large number of rows per transaction or transaction batch
* Configuration issues such as insufficient `SendBufferMemory`

* Hardware issues such as insufficient RAM or poor network connectivity

See also Section 25.4.3.14, “Configuring NDB Cluster Send Buffer Parameters”.

If TLS is used for the connection, the `encrypted` column is `1`, as shown here:

```
mysql> SELECT node_id, remote_node_id, status, encrypted
    -> FROM ndbinfo.transporters;
+---------+----------------+------------+-----------+
| node_id | remote_node_id | status     | encrypted |
+---------+----------------+------------+-----------+
|       5 |              6 | CONNECTED  |         1 |
|       5 |             50 | CONNECTED  |         1 |
|       5 |            100 | CONNECTED  |         1 |
|       5 |            101 | CONNECTING |         0 |
|       6 |              5 | CONNECTED  |         1 |
|       6 |             50 | CONNECTED  |         1 |
|       6 |            100 | CONNECTED  |         1 |
|       6 |            101 | CONNECTING |         0 |
+---------+----------------+------------+-----------+
8 rows in set (0.04 sec)
```

Otherwise, the value of this column is `0`.

The `certificates` table can be used to obtain certificate information about each node connected using link encryption.

For more information, see Section 25.6.19.5, “TLS Link Encryption for NDB Cluster”.
