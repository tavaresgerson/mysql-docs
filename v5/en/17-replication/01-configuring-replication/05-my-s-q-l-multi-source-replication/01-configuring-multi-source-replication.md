#### 16.1.5.1 Configuring Multi-Source Replication

A multi-source replication topology requires at least two sources and one replica configured. In these tutorials, we assume you have two sources `source1` and `source2`, and a replica `replicahost`. The replica replicates one database from each of the sources, `db1` from `source1` and `db2` from `source2`.

Sources in a multi-source replication topology can be configured to use either GTID-based replication, or binary log position-based replication. See [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs") for how to configure a source using GTID-based replication. See [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration") for how to configure a source using file position based replication.

Replicas in a multi-source replication topology require `TABLE` repositories for the connection metadata repository and applier metadata repository, as specified by the [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) and [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) system variables. Multi-source replication is not compatible with `FILE` repositories.

To modify an existing replica that is using `FILE` repositories for the replication metadata repositories to use `TABLE` repositories, you can convert the existing repositories dynamically by using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to issue the following statements on the replica:

```sql
mysql> STOP SLAVE;
mysql> SET GLOBAL master_info_repository = 'TABLE';
mysql> SET GLOBAL relay_log_info_repository = 'TABLE';
```

Create a suitable user account on all the replication source servers that the replica can use to connect. You can use the same account on all the sources, or a different account on each. If you create an account solely for the purposes of replication, that account needs only the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege. For example, to set up a new user, `ted`, that can connect from the replica `replicahost`, use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to issue these statements on each of the sources:

```sql
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

For more details, see [Section 16.1.2.2, “Creating a User for Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication").
