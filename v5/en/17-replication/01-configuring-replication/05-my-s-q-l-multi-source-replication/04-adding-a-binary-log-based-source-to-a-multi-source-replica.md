#### 16.1.5.4 Adding a Binary Log Based Source to a Multi-Source Replica

These steps assume that you have enabled binary logging on the replication source server using [`--log-bin`](replication-options-binary-log.html#sysvar_log_bin), the replica is using `TABLE` based replication metadata repositories, and that you have enabled a replication user and noted the current binary log position. You need to know the current `MASTER_LOG_FILE` and `MASTER_LOG_POSITION`.

Use the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to configure a replication channel for each source on the replica (see [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels")). The `FOR CHANNEL` clause is used to specify the channel. For example, to add `source1` and `source2` as sources to the replica, use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to issue the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement twice on the replica, like this:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";
```

For the full syntax of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement and other available options, see [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").
