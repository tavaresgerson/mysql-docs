#### 16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates

To configure the replica to start the replication process at the correct point, you need to note the source's current coordinates within its binary log.

Warning

This procedure uses [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock), which blocks [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") operations for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables.

If you are planning to shut down the source to create a data snapshot, you can optionally skip this procedure and instead store a copy of the binary log index file along with the data snapshot. In that situation, the source creates a new binary log file on restart. The source's binary log coordinates where the replica must start the replication process are therefore the start of that new file, which is the next binary log file on the source following after the files that are listed in the copied binary log index file.

To obtain the source's binary log coordinates, follow these steps:

1. Start a session on the source by connecting to it with the command-line client, and flush all tables and block write statements by executing the [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) statement:

   ```sql
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

   Warning

   Leave the client from which you issued the [`FLUSH TABLES`](flush.html#flush-tables) statement running so that the read lock remains in effect. If you exit the client, the lock is released.

2. In a different session on the source, use the [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") statement to determine the current binary log file name and position:

   ```sql
   mysql> SHOW MASTER STATUS\G
   *************************** 1. row ***************************
                File: mysql-bin.000003
            Position: 73
        Binlog_Do_DB: test
    Binlog_Ignore_DB: manual, mysql
   Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
   1 row in set (0.00 sec)
   ```

   The `File` column shows the name of the log file and the `Position` column shows the position within the file. In this example, the binary log file is `mysql-bin.000003` and the position is 73. Record these values. You need them later when you are setting up the replica. They represent the replication coordinates at which the replica should begin processing new updates from the source.

   If the source has been running previously without binary logging enabled, the log file name and position values displayed by [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") or [**mysqldump --master-data**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") are empty. In that case, the values that you need to use later when specifying the source's log file and position are the empty string (`''`) and `4`.

You now have the information you need to enable the replica to start reading from the binary log in the correct place to start replication.

The next step depends on whether you have existing data on the source. Choose one of the following options:

* If you have existing data that needs be to synchronized with the replica before you start replication, leave the client running so that the lock remains in place. This prevents any further changes being made, so that the data copied to the replica is in synchrony with the source. Proceed to [Section 16.1.2.4, “Choosing a Method for Data Snapshots”](replication-snapshot-method.html "16.1.2.4 Choosing a Method for Data Snapshots").

* If you are setting up a new replication topology, you can exit the first session to release the read lock. See [Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas") for how to proceed.
