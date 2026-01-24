#### 16.4.1.28 Replication and Server SQL Mode

Using different server SQL mode settings on the source and the replica may cause the same [`INSERT`](insert.html "13.2.5 INSERT Statement") statements to be handled differently on the source and the replica, leading the source and replica to diverge. For best results, you should always use the same server SQL mode on the source and on the replica. This advice applies whether you are using statement-based or row-based replication.

If you are replicating partitioned tables, using different SQL modes on the source and the replica is likely to cause issues. At a minimum, this is likely to cause the distribution of data among partitions to be different in the source's and replica's copies of a given table. It may also cause inserts into partitioned tables that succeed on the source to fail on the replica.

For more information, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes"). In particular, see [SQL Mode Changes in MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7"), which describes changes in MySQL 5.7, so that you can assess whether your applications are affected.
