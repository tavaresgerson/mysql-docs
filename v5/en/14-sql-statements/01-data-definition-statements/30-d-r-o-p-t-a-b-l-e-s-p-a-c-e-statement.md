### 13.1.30 DROP TABLESPACE Statement

```sql
DROP TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

This statement drops a tablespace that was previously created using [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"). It is supported with all MySQL NDB Cluster 7.5 releases, and with `InnoDB` in the standard MySQL Server as well.

`ENGINE` sets the storage engine that uses the tablespace, where *`engine_name`* is the name of the storage engine. Currently, the values `InnoDB` and `NDB` are supported. If not set, the value of [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) is used. If it is not the same as the storage engine used to create the tablespace, the `DROP TABLESPACE` statement fails.

For an `InnoDB` tablespace, all tables must be dropped from the tablespace prior to a `DROP TABLESPACE` operation. If the tablespace is not empty, `DROP TABLESPACE` returns an error.

As with the `InnoDB` system tablespace, truncating or dropping `InnoDB` tables stored in a general tablespace creates free space in the tablespace [.ibd data file](glossary.html#glos_ibd_file ".ibd file"), which can only be used for new `InnoDB` data. Space is not released back to the operating system by such operations as it is for file-per-table tablespaces.

An `NDB` tablespace to be dropped must not contain any data files; in other words, before you can drop an `NDB` tablespace, you must first drop each of its data files using [`ALTER TABLESPACE ... DROP DATAFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

#### Notes

* Tablespaces are not deleted automatically. A tablespace must be dropped explicitly using `DROP TABLESPACE`. [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") has no effect in this regard, even if the operation drops all tables belonging to the tablespace.

* A [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") operation can drop tables that belong to a general tablespace but it cannot drop the tablespace, even if the operation drops all tables that belong to the tablespace. The tablespace must be dropped explicitly using `DROP TABLESPACE tablespace_name`.

* Similar to the system tablespace, truncating or dropping tables stored in a general tablespace creates free space internally in the general tablespace [.ibd data file](glossary.html#glos_ibd_file ".ibd file") which can only be used for new `InnoDB` data. Space is not released back to the operating system as it is for file-per-table tablespaces.

#### InnoDB Example

This example demonstrates how to drop an `InnoDB` general tablespace. The general tablespace `ts1` is created with a single table. Before dropping the tablespace, the table must be dropped.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

#### NDB Example

This example shows how to drop an `NDB` tablespace `myts` having a data file named `mydata-1.dat` after first creating the tablespace, and assumes the existence of a log file group named `mylg` (see [Section 13.1.15, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")).

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

You must remove all data files from the tablespace using [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement"), as shown here, before it can be dropped:

```sql
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```
