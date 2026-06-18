#### 21.2.6.1 Differences Between the NDB and InnoDB Storage Engines

The [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is
implemented using a distributed, shared-nothing architecture,
which causes it to behave differently from
[`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") in a number of ways. For
those unaccustomed to working with
[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), unexpected behaviors can arise
due to its distributed nature with regard to transactions,
foreign keys, table limits, and other characteristics. These are
shown in the following table:

**Table 21.1
Differences between InnoDB and NDB storage engines**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th>Feature</th>
<th><code>InnoDB</code> (MySQL 5.7)</th>
<th><code>NDB</code> 7.5/7.6</th>
</tr></thead><tbody><tr>
<th><em>MySQL Server Version</em></th>
<td>5.7</td>
<td>5.7</td>
</tr><tr>
<th><em><code>InnoDB</code> Version </em></th>
<td><code>InnoDB</code> 5.7.44</td>
<td><code>InnoDB</code> 5.7.44</td>
</tr><tr>
<th><em>NDB Cluster Version</em></th>
<td>N/A</td>
<td><code>NDB</code>
              7.5.36/7.6.36</td>
</tr><tr>
<th><em>Storage Limits</em></th>
<td>64TB</td>
<td>128TB (as of NDB 7.5.2)</td>
</tr><tr>
<th><em>Foreign Keys</em></th>
<td>Yes</td>
<td>Yes</td>
</tr><tr>
<th><em>Transactions</em></th>
<td>All standard types</td>
<td><code>READ COMMITTED</code></td>
</tr><tr>
<th><em>MVCC</em></th>
<td>Yes</td>
<td>No</td>
</tr><tr>
<th><em>Data Compression</em></th>
<td>Yes</td>
<td>No (NDB checkpoint and backup files can be compressed)</td>
</tr><tr>
<th><em>Large Row Support (&gt; 14K)</em></th>
<td>Supported for <code>VARBINARY</code>,
              <code>VARCHAR</code>,
              <code>BLOB</code>, and
              <code>TEXT</code> columns</td>
<td>Supported for <code>BLOB</code> and
              <code>TEXT</code> columns only (Using
              these types to store very large amounts of data can lower
              NDB performance)</td>
</tr><tr>
<th><em>Replication Support</em></th>
<td>Asynchronous and semisynchronous replication using MySQL Replication;
              MySQL <a class="link" href="group-replication.html" title="Chapter 17 Group Replication">Group
              Replication</a></td>
<td>Automatic synchronous replication within an NDB Cluster; asynchronous
              replication between NDB Clusters, using MySQL Replication
              (Semisynchronous replication is not supported)</td>
</tr><tr>
<th><em>Scaleout for Read Operations</em></th>
<td>Yes (MySQL Replication)</td>
<td>Yes (Automatic partitioning in NDB Cluster; NDB Cluster Replication)</td>
</tr><tr>
<th><em>Scaleout for Write Operations</em></th>
<td>Requires application-level partitioning (sharding)</td>
<td>Yes (Automatic partitioning in NDB Cluster is transparent to
              applications)</td>
</tr><tr>
<th><em>High Availability (HA)</em></th>
<td>Built-in, from InnoDB cluster</td>
<td>Yes (Designed for 99.999% uptime)</td>
</tr><tr>
<th><em>Node Failure Recovery and Failover</em></th>
<td>From MySQL Group Replication</td>
<td>Automatic (Key element in NDB architecture)</td>
</tr><tr>
<th><em>Time for Node Failure Recovery</em></th>
<td>30 seconds or longer</td>
<td>Typically &lt; 1 second</td>
</tr><tr>
<th><em>Real-Time Performance</em></th>
<td>No</td>
<td>Yes</td>
</tr><tr>
<th><em>In-Memory Tables</em></th>
<td>No</td>
<td>Yes (Some data can optionally be stored on disk; both in-memory and disk
              data storage are durable)</td>
</tr><tr>
<th><em>NoSQL Access to Storage Engine</em></th>
<td>Yes</td>
<td>Yes (Multiple APIs, including Memcached, Node.js/JavaScript, Java, JPA,
              C++, and HTTP/REST)</td>
</tr><tr>
<th><em>Concurrent and Parallel Writes</em></th>
<td>Yes</td>
<td>Up to 48 writers, optimized for concurrent writes</td>
</tr><tr>
<th><span class="emphasis"><em>Conflict Detection and Resolution (Multiple Replication
              Surces)</em></span></th>
<td>Yes (MySQL Group Replication)</td>
<td>Yes</td>
</tr><tr>
<th><em>Hash Indexes</em></th>
<td>No</td>
<td>Yes</td>
</tr><tr>
<th><em>Online Addition of Nodes</em></th>
<td>Read/write replicas using MySQL Group Replication</td>
<td>Yes (all node types)</td>
</tr><tr>
<th><em>Online Upgrades</em></th>
<td>Yes (using replication)</td>
<td>Yes</td>
</tr><tr>
<th><em>Online Schema Modifications</em></th>
<td>Yes, as part of MySQL 5.7</td>
<td>Yes</td>
</tr></tbody></table>