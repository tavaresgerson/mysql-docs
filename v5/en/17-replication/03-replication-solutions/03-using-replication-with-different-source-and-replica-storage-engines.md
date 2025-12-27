### 16.3.3 Using Replication with Different Source and Replica Storage Engines

It does not matter for the replication process whether the source table on the source and the replicated table on the replica use different engine types. In fact, the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) system variable is not replicated.

This provides a number of benefits in the replication process in that you can take advantage of different engine types for different replication scenarios. For example, in a typical scale-out scenario (see [Section 16.3.4, “Using Replication for Scale-Out”](replication-solutions-scaleout.html "16.3.4 Using Replication for Scale-Out")), you want to use `InnoDB` tables on the source to take advantage of the transactional functionality, but use `MyISAM` on the replicas where transaction support is not required because the data is only read. When using replication in a data-logging environment you may want to use the `Archive` storage engine on the replica.

Configuring different engines on the source and replica depends on how you set up the initial replication process:

* If you used [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to create the database snapshot on your source, you could edit the dump file text to change the engine type used on each table.

  Another alternative for [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") is to disable engine types that you do not want to use on the replica before using the dump to build the data on the replica. For example, you can add the [`--skip-federated`](innodb-parameters.html#option_mysqld_innodb) option on your replica to disable the `FEDERATED` engine. If a specific engine does not exist for a table to be created, MySQL uses the default engine type, usually `MyISAM`. (This requires that the [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) SQL mode is not enabled.) If you want to disable additional engines in this way, you may want to consider building a special binary to be used on the replica that supports only the engines you want.

* If you are using raw data files (a binary backup) to set up the replica, you cannot change the initial table format. Instead, use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to change the table types after the replica has been started.

* For new source/replica replication setups where there are currently no tables on the source, avoid specifying the engine type when creating new tables.

If you are already running a replication solution and want to convert your existing tables to another engine type, follow these steps:

1. Stop the replica from running replication updates:

   ```sql
   mysql> STOP SLAVE;
   ```

   This enables you to change engine types without interruptions.

2. Execute an `ALTER TABLE ... ENGINE='engine_type'` for each table to be changed.

3. Start the replication process again:

   ```sql
   mysql> START SLAVE;
   ```

Although the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) variable is not replicated, be aware that [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements that include the engine specification are correctly replicated to the replica. For example, if you have a CSV table and you execute:

```sql
mysql> ALTER TABLE csvtable Engine='MyISAM';
```

The previous statement is replicated to the replica and the engine type on the replica is converted to `MyISAM`, even if you have previously changed the table type on the replica to an engine other than CSV. If you want to retain engine differences on the source and replica, you should be careful to use the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) variable on the source when creating a new table. For example, instead of:

```sql
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Use this format:

```sql
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

When replicated, the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) variable will be ignored, and the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement executes on the replica using the replica's default engine.
