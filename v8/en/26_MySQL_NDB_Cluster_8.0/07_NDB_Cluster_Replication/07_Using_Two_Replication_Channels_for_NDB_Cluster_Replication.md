### 25.7.7 Using Two Replication Channels for NDB Cluster Replication

In a more complete example scenario, we envision two replication channels to provide redundancy and thereby guard against possible failure of a single replication channel. This requires a total of four replication servers, two source servers on the source cluster and two replica servers on the replica cluster. For purposes of the discussion that follows, we assume that unique identifiers are assigned as shown here:

**Table 25.73 NDB Cluster replication servers described in the text**

<table><thead><tr> <th>Server ID</th> <th>Description</th> </tr></thead><tbody><tr> <td>1</td> <td>Source - primary replication channel (<span><em>S</em></span>)</td> </tr><tr> <td>2</td> <td>Source - secondary replication channel (<span><em>S'</em></span>)</td> </tr><tr> <td>3</td> <td>Replica - primary replication channel (<span><em>R</em></span>)</td> </tr><tr> <td>4</td> <td>replica - secondary replication channel (<span><em>R'</em></span>)</td> </tr></tbody></table>

Setting up replication with two channels is not radically different from setting up a single replication channel. First, the **mysqld** processes for the primary and secondary replication source servers must be started, followed by those for the primary and secondary replicas. The replication processes can be initiated by issuing the `START REPLICA` statement on each of the replicas. The commands and the order in which they need to be issued are shown here:

1. Start the primary replication source:

   ```
   shellS> mysqld --ndbcluster --server-id=1 \
                  --log-bin &
   ```

2. Start the secondary replication source:

   ```
   shellS'> mysqld --ndbcluster --server-id=2 \
                  --log-bin &
   ```

3. Start the primary replica server:

   ```
   shellR> mysqld --ndbcluster --server-id=3 \
                  --skip-slave-start &
   ```

4. Start the secondary replica server:

   ```
   shellR'> mysqld --ndbcluster --server-id=4 \
                   --skip-slave-start &
   ```

5. Finally, initiate replication on the primary channel by executing the `START REPLICA` statement on the primary replica as shown here:

   ```
   mysqlR> START SLAVE;
   ```

   Beginning with NDB 8.0.22, you can also use the following statement:

   ```
   mysqlR> START REPLICA;
   ```

   Warning

   Only the primary channel must be started at this point. The secondary replication channel needs to be started only in the event that the primary replication channel fails, as described in Section 25.7.8, “Implementing Failover with NDB Cluster Replication”. Running multiple replication channels simultaneously can result in unwanted duplicate records being created on the replicas.

As mentioned previously, it is not necessary to enable binary logging on the replicas.
