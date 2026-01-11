#### 17.6.1.2 Creating Tables Externally

There are different reasons for creating `InnoDB` tables externally; that is, creating tables outside of the data directory. Those reasons might include space management, I/O optimization, or placing tables on a storage device with particular performance or capacity characteristics, for example.

`InnoDB` supports the following methods for creating tables externally:

* Using the DATA DIRECTORY Clause
* Using CREATE TABLE ... TABLESPACE Syntax
* Creating a Table in an External General Tablespace

##### Using the DATA DIRECTORY Clause

You can create an `InnoDB` table in an external directory by specifying a `DATA DIRECTORY` clause in the `CREATE TABLE` statement.

```
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

The `DATA DIRECTORY` clause is supported for tables created in file-per-table tablespaces. Tables are implicitly created in file-per-table tablespaces when the `innodb_file_per_table` variable is enabled, which it is by default.

```
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

For more information about file-per-table tablespaces, see Section 17.6.3.2, “File-Per-Table Tablespaces”.

When you specify a `DATA DIRECTORY` clause in a `CREATE TABLE` statement, the table's data file (`table_name.ibd`) is created in a schema directory under the specified directory.

As of MySQL 8.0.21, tables and table partitions created outside of the data directory using the `DATA DIRECTORY` clause are restricted to directories known to `InnoDB`. This requirement permits database administrators to control where tablespace data files are created and ensures that data files can be found during recovery (see Tablespace Discovery During Crash Recovery). Known directories are those defined by the `datadir`, `innodb_data_home_dir`, and `innodb_directories` variables. You can use the following statement to check those settings:

```
mysql> SELECT @@datadir,@@innodb_data_home_dir,@@innodb_directories;
```

If the directory you want to use is unknown, add it to the `innodb_directories` setting before you create the table. The `innodb_directories` variable is read-only. Configuring it requires restarting the server. For general information about setting system variables, see Section 7.1.9, “Using System Variables”.

The following example demonstrates creating a table in an external directory using the `DATA DIRECTORY` clause. It is assumed that the `innodb_file_per_table` variable is enabled and that the directory is known to `InnoDB`.

```
mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';

# MySQL creates the table's data file in a schema directory
# under the external directory

$> cd /external/directory/test
$> ls
t1.ibd
```

###### Usage Notes:

* MySQL initially holds the tablespace data file open, preventing you from dismounting the device, but might eventually close the file if the server is busy. Be careful not to accidentally dismount an external device while MySQL is running, or start MySQL while the device is disconnected. Attempting to access a table when the associated data file is missing causes a serious error that requires a server restart.

  A server restart might fail if the data file is not found at the expected path. In this case, you can restore the tablespace data file from a backup or drop the table to remove the information about it from the data dictionary.

* Before placing a table on an NFS-mounted volume, review potential issues outlined in Using NFS with MySQL.

* If using an LVM snapshot, file copy, or other file-based mechanism to back up the table's data file, always use the `FLUSH TABLES ... FOR EXPORT` statement first to ensure that all changes buffered in memory are flushed to disk before the backup occurs.

* Using the `DATA DIRECTORY` clause to create a table in an external directory is an alternative to using symbolic links, which `InnoDB` does not support.

* The `DATA DIRECTORY` clause is not supported in a replication environment where the source and replica reside on the same host. The `DATA DIRECTORY` clause requires a full directory path. Replicating the path in this case would cause the source and replica to create the table in same location.

* As of MySQL 8.0.21, tables created in file-per-table tablespaces can no longer be created in the undo tablespace directory (`innodb_undo_directory`) unless that directly is known to `InnoDB`. Known directories are those defined by the `datadir`, `innodb_data_home_dir`, and `innodb_directories` variables.

##### Using CREATE TABLE ... TABLESPACE Syntax

`CREATE TABLE ... TABLESPACE` syntax can be used in combination with the `DATA DIRECTORY` clause to create a table in an external directory. To do so, specify `innodb_file_per_table` as the tablespace name.

```
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

This method is supported only for tables created in file-per-table tablespaces, but does not require the `innodb_file_per_table` variable to be enabled. In all other respects, this method is equivalent to the `CREATE TABLE ... DATA DIRECTORY` method described above. The same usage notes apply.

##### Creating a Table in an External General Tablespace

You can create a table in a general tablespace that resides in an external directory.

* For information about creating a general tablespace in an external directory, see Creating a General Tablespace.

* For information about creating a table in a general tablespace, see Adding Tables to a General Tablespace.
