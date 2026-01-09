#### 14.6.3.5 The Temporary Tablespace

Non-compressed, user-created temporary tables and on-disk internal temporary tables are created in a shared temporary tablespace. The `innodb_temp_data_file_path` variable defines the relative path, name, size, and attributes for temporary tablespace data files. If no value is specified for `innodb_temp_data_file_path`, the default behavior is to create an auto-extending data file named `ibtmp1` in the `innodb_data_home_dir` directory that is slightly larger than 12MB.

Note

In MySQL 5.6, non-compressed temporary tables are created in individual file-per-table tablespaces in the temporary file directory, or in the `InnoDB` system tablespace in the data directory if `innodb_file_per_table` is disabled. The introduction of a shared temporary tablespace in MySQL 5.7 removes performance costs associated with creating and removing a file-per-table tablespace for each temporary table. A dedicated temporary tablespace also means that it is no longer necessary to save temporary table metadata to the `InnoDB` system tables.

Compressed temporary tables, which are temporary tables created using the `ROW_FORMAT=COMPRESSED` attribute, are created in file-per-table tablespaces in the temporary file directory.

The temporary tablespace is removed on normal shutdown or on an aborted initialization, and is recreated each time the server is started. The temporary tablespace receives a dynamically generated space ID when it is created. Startup is refused if the temporary tablespace cannot be created. The temporary tablespace is not removed if the server halts unexpectedly. In this case, a database administrator can remove the temporary tablespace manually or restart the server, which removes and recreates the temporary tablespace automatically.

The temporary tablespace cannot reside on a raw device.

The Information Schema `FILES` table provides metadata about the `InnoDB` temporary tablespace. Issue a query similar to this one to view temporary tablespace metadata:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

The Information Schema `INNODB_TEMP_TABLE_INFO` table provides metadata about user-created temporary tables that are currently active within an `InnoDB` instance.

##### Managing Temporary Tablespace Data File Size

By default, the temporary tablespace data file is autoextending and increases in size as necessary to accommodate on-disk temporary tables. For example, if an operation creates a temporary table that is 20MB in size, the temporary tablespace data file, which is 12MB in size by default when created, extends in size to accommodate it. When temporary tables are dropped, freed space can be reused for new temporary tables, but the data file remains at the extended size.

An autoextending temporary tablespace data file can become large in environments that use large temporary tables or that use temporary tables extensively. A large data file can also result from long running queries that use temporary tables.

To determine if a temporary tablespace data file is autoextending, check the `innodb_temp_data_file_path` setting:

```sql
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

To check the size of temporary tablespace data files, query the Information Schema `FILES` table using a query similar to this:

```sql
mysql> SELECT FILE_NAME, TABLESPACE_NAME, ENGINE, INITIAL_SIZE, TOTAL_EXTENTS*EXTENT_SIZE
       AS TotalSizeBytes, DATA_FREE, MAXIMUM_SIZE FROM INFORMATION_SCHEMA.FILES
       WHERE TABLESPACE_NAME = 'innodb_temporary'\G
*************************** 1. row ***************************
      FILE_NAME: ./ibtmp1
TABLESPACE_NAME: innodb_temporary
         ENGINE: InnoDB
   INITIAL_SIZE: 12582912
 TotalSizeBytes: 12582912
      DATA_FREE: 6291456
   MAXIMUM_SIZE: NULL
```

The `TotalSizeBytes` value reports the current size of the temporary tablespace data file. For information about other field values, see Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”.

Alternatively, check the temporary tablespace data file size on your operating system. By default, the temporary tablespace data file is located in the directory defined by the `innodb_temp_data_file_path` configuration option. If a value was not specified for this option explicitly, a temporary tablespace data file named `ibtmp1` is created in `innodb_data_home_dir`, which defaults to the MySQL data directory if unspecified.

To reclaim disk space occupied by a temporary tablespace data file, restart the MySQL server. Restarting the server removes and recreates the temporary tablespace data file according to the attributes defined by `innodb_temp_data_file_path`.

To prevent the temporary data file from becoming too large, you can configure the `innodb_temp_data_file_path` variable to specify a maximum file size. For example:

```sql
[mysqld]
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:500M
```

When the data file reaches the maximum size, queries fail with an error indicating that the table is full. Configuring `innodb_temp_data_file_path` requires restarting the server.

Alternatively, configure the `default_tmp_storage_engine` and `internal_tmp_disk_storage_engine` variables, which define the storage engine to use for user-created and on-disk internal temporary tables, respectively. Both variables are set to `InnoDB` by default. The `MyISAM` storage engine uses an individual file for each temporary table, which is removed when the temporary table is dropped.
