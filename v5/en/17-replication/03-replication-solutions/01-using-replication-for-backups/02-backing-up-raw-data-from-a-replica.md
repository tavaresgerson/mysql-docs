#### 16.3.1.2 Backing Up Raw Data from a Replica

To guarantee the integrity of the files that are copied, backing up the raw data files on your MySQL replica should take place while your replica server is shut down. If the MySQL server is still running, background tasks may still be updating the database files, particularly those involving storage engines with background processes such as `InnoDB`. With `InnoDB`, these problems should be resolved during crash recovery, but since the replica server can be shut down during the backup process without affecting the execution of the source it makes sense to take advantage of this capability.

To shut down the server and back up the files:

1. Shut down the replica MySQL server:

   ```sql
   $> mysqladmin shutdown
   ```

2. Copy the data files. You can use any suitable copying or archive utility, including **cp**, **tar** or **WinZip**. For example, assuming that the data directory is located under the current directory, you can archive the entire directory as follows:

   ```sql
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Start the MySQL server again. Under Unix:

   ```sql
   $> mysqld_safe &
   ```

   Under Windows:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
   ```

Normally you should back up the entire data directory for the replica MySQL server. If you want to be able to restore the data and operate as a replica (for example, in the event of failure of the replica), then in addition to the replica's data, you should also back up the replica status files, the replication metadata repositories, and the relay log files. These files are needed to resume replication after you restore the replica's data.

If you lose the relay logs but still have the `relay-log.info` file, you can check it to determine how far the replication SQL thread has executed in the source's binary logs. Then you can use [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") with the `MASTER_LOG_FILE` and `MASTER_LOG_POS` options to tell the replica to re-read the binary logs from that point. This requires that the binary logs still exist on the source server.

If your replica is replicating [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements, you should also back up any `SQL_LOAD-*` files that exist in the directory that the replica uses for this purpose. The replica needs these files to resume replication of any interrupted [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") operations. The location of this directory is the value of the [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) system variable. If the server was not started with that variable set, the directory location is the value of the [`tmpdir`](server-system-variables.html#sysvar_tmpdir) system variable.
