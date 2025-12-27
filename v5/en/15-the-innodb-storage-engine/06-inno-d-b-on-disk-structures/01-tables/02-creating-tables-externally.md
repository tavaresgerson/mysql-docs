#### 14.6.1.2 Creating Tables Externally

There are different reasons for creating `InnoDB` tables externally; that is, creating tables outside of the data directory. Those reasons might include space management, I/O optimization, or placing tables on a storage device with particular performance or capacity characteristics, for example.

`InnoDB` supports the following methods for creating tables externally:

* Using the DATA DIRECTORY Clause
* Using CREATE TABLE ... TABLESPACE Syntax
* Creating a Table in an External General Tablespace

##### Using the DATA DIRECTORY Clause

You can create an `InnoDB` table in an external directory by specifying a `DATA DIRECTORY` clause in the `CREATE TABLE` statement.

```sql
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

The `DATA DIRECTORY` clause is supported for tables created in file-per-table tablespaces. Tables are implicitly created in file-per-table tablespaces when the `innodb_file_per_table` variable is enabled, which it is by default.

```sql
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

For more information about file-per-table tablespaces, see Section 14.6.3.2, “File-Per-Table Tablespaces”.

Be sure of the directory location you choose, as the `DATA DIRECTORY` clause cannot be used with `ALTER TABLE` to change the location later.

When you specify a `DATA DIRECTORY` clause in a `CREATE TABLE` statement, the table's data file (`table_name.ibd`) is created in a schema directory under the specified directory, and an `.isl` file (`table_name.isl`) that contains the data file path is created in the schema directory under the MySQL data directory. An `.isl` file is similar in function to a symbolic link. (Actual symbolic links are not supported for use with `InnoDB` data files.)

The following example demonstrates creating a table in an external directory using the `DATA DIRECTORY` clause. It is assumed that the `innodb_file_per_table` variable is enabled.

```sql
mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';

# MySQL creates the table's data file in a schema directory
# under the external directory

$> cd /external/directory/test
$> ls
t1.ibd

# An .isl file that contains the data file path is created
# in the schema directory under the MySQL data directory

$> cd /path/to/mysql/data/test
$> ls
db.opt  t1.frm  t1.isl
```

###### Usage Notes:

* MySQL initially holds the tablespace data file open, preventing you from dismounting the device, but might eventually close the file if the server is busy. Be careful not to accidentally dismount an external device while MySQL is running, or start MySQL while the device is disconnected. Attempting to access a table when the associated data file is missing causes a serious error that requires a server restart.

  A server restart might fail if the data file is not found at the expected path. In this case, manually remove the `.isl` file from the schema directory. After restarting, drop the table to remove the `.frm` file and the information about the table from the data dictionary.

* Before placing a table on an NFS-mounted volume, review potential issues outlined in Using NFS with MySQL.

* If using an LVM snapshot, file copy, or other file-based mechanism to back up the table's data file, always use the `FLUSH TABLES ... FOR EXPORT` statement first to ensure that all changes buffered in memory are flushed to disk before the backup occurs.

* Using the `DATA DIRECTORY` clause to create a table in an external directory is an alternative to using symbolic links, which `InnoDB` does not support.

* The `DATA DIRECTORY` clause is not supported in a replication environment where the source and replica reside on the same host. The `DATA DIRECTORY` clause requires a full directory path. Replicating the path in this case would cause the source and replica to create the table in same location.

##### Using CREATE TABLE ... TABLESPACE Syntax

`CREATE TABLE ... TABLESPACE` syntax can be used in combination with the `DATA DIRECTORY` clause to create a table in an external directory. To do so, specify `innodb_file_per_table` as the tablespace name.

```sql
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

This method is supported only for tables created in file-per-table tablespaces, but does not require the `innodb_file_per_table` variable to be enabled. In all other respects, this method is equivalent to the `CREATE TABLE ... DATA DIRECTORY` method described above. The same usage notes apply.

##### Creating a Table in an External General Tablespace

You can create a table in a general tablespace that resides in an external directory.

* For information about creating a general tablespace in an external directory, see Creating a General Tablespace.

* For information about creating a table in a general tablespace, see Adding Tables to a General Tablespace.
