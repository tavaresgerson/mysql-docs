## 1.3 What Is New in MySQL 5.7

This section summarizes what has been added to, deprecated in, and removed from MySQL 5.7. A companion section lists MySQL server options and variables that have been added, deprecated, or removed in MySQL 5.7; see Section 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”.

### Features Added in MySQL 5.7

The following features have been added to MySQL 5.7:

* **Security improvements.** These security enhancements were added:

  + In MySQL 8.0, `caching_sha2_password` is the default authentication plugin. To enable MySQL 5.7 clients to connect to 8.0 servers using accounts that authenticate using `caching_sha2_password`, the MySQL 5.7 client library and client programs support the `caching_sha2_password` client-side authentication plugin as of MySQL 5.7.23. This improves compatibility of MySQL 5.7 with MySQL 8.0 and higher servers. See Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  + The server now requires account rows in the `mysql.user` system table to have a nonempty `plugin` column value and disables accounts with an empty value. For server upgrade instructions, see Section 2.10.3, “Changes in MySQL 5.7”. DBAs are advised to also convert accounts that use the `mysql_old_password` authentication plugin to use `mysql_native_password` instead, because support for `mysql_old_password` has been removed. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

  + MySQL now enables database administrators to establish a policy for automatic password expiration: Any user who connects to the server using an account for which the password is past its permitted lifetime must change the password. For more information, see Section 6.2.11, “Password Management”.

  + Administrators can lock and unlock accounts for better control over who can log in. For more information, see Section 6.2.15, “Account Locking”.

  + To make it easier to support secure connections, MySQL servers compiled using OpenSSL can automatically generate missing SSL and RSA certificate and key files at startup. See Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

    All servers, if not configured for SSL explicitly, attempt to enable SSL automatically at startup if they find the requisite SSL files in the data directory. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

    In addition, MySQL distributions include a **mysql\_ssl\_rsa\_setup** utility that can be invoked manually to create SSL and RSA key and certificate files. For more information, see Section 4.4.5, “mysql\_ssl\_rsa\_setup — Create SSL/RSA Files”.

  + MySQL deployments installed using **mysqld --initialize** are secure by default. The following changes have been implemented as the default deployment characteristics:

    - The installation process creates only a single `root` account, `'root'@'localhost'`, automatically generates a random password for this account, and marks the password expired. The MySQL administrator must connect as `root` using the random password and assign a new password. (The server writes the random password to the error log.)

    - Installation creates no anonymous-user accounts.
    - Installation creates no `test` database.

    For more information, see Section 2.9.1, “Initializing the Data Directory”.

  + MySQL Enterprise Edition now provides data masking and de-identification capabilities. Data masking hides sensitive information by replacing real values with substitutes. MySQL Enterprise Data Masking and De-Identification functions enable masking existing data using several methods such as obfuscation (removing identifying characteristics), generation of formatted random data, and data replacement or substitution. For more information, see Section 6.5, “MySQL Enterprise Data Masking and De-Identification”.

  + MySQL now sets the access control granted to clients on the named pipe to the minimum necessary for successful communication on Windows. Newer MySQL client software can open named pipe connections without any additional configuration. If older client software cannot be upgraded immediately, the new `named_pipe_full_access_group` system variable can be used to give a Windows group the necessary permissions to open a named pipe connection. Membership in the full-access group should be restricted and temporary.

* **SQL mode changes.** Strict SQL mode for transactional storage engines (`STRICT_TRANS_TABLES`) is now enabled by default.

  Implementation for the `ONLY_FULL_GROUP_BY` SQL mode has been made more sophisticated, to no longer reject deterministic queries that previously were rejected. In consequence, this mode is now enabled by default, to prohibit only nondeterministic queries containing expressions not guaranteed to be uniquely determined within a group.

  The `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE`, and `NO_ZERO_IN_DATE` SQL modes are now deprecated but enabled by default. The long term plan is to have them included in strict SQL mode and to remove them as explicit modes in a future MySQL release. See SQL Mode Changes in MySQL 5.7.

  The changes to the default SQL mode result in a default `sql_mode` system variable value with these modes enabled: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER`, and `NO_ENGINE_SUBSTITUTION`.

* **Online ALTER TABLE.** `ALTER TABLE` now supports a `RENAME INDEX` clause that renames an index. The change is made in place without a table-copy operation. It works for all storage engines. See Section 13.1.8, “ALTER TABLE Statement”.

* **ngram and MeCab full-text parser plugins.** MySQL provides a built-in full-text ngram parser plugin that supports Chinese, Japanese, and Korean (CJK), and an installable MeCab full-text parser plugin for Japanese.

  For more information, see Section 12.9.8, “ngram Full-Text Parser”, and Section 12.9.9, “MeCab Full-Text Parser Plugin”.

* **InnoDB enhancements.** These `InnoDB` enhancements were added:

  + `VARCHAR` column size can be increased using an in-place `ALTER TABLE`, as in this example:

    ```sql
    ALTER TABLE t1 ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(255);
    ```

    This is true as long as the number of length bytes required by a `VARCHAR` column remains the same. For `VARCHAR` columns of 0 to 255 bytes in size, one length byte is required to encode the value. For `VARCHAR` columns of 256 bytes in size or more, two length bytes are required. As a result, in-place `ALTER TABLE` only supports increasing `VARCHAR` column size from 0 to 255 bytes, or from 256 bytes to a greater size. In-place `ALTER TABLE` does not support increasing the size of a `VARCHAR` column from less than 256 bytes to a size equal to or greater than 256 bytes. In this case, the number of required length bytes changes from 1 to 2, which is only supported by a table copy (`ALGORITHM=COPY`).

    Decreasing `VARCHAR` size using in-place `ALTER TABLE` is not supported. Decreasing `VARCHAR` size requires a table copy (`ALGORITHM=COPY`).

    For more information, see Section 14.13.1, “Online DDL Operations”.

  + DDL performance for `InnoDB` temporary tables is improved through optimization of `CREATE TABLE`, `DROP TABLE`, `TRUNCATE TABLE`, and `ALTER TABLE` statements.

  + `InnoDB` temporary table metadata is no longer stored to `InnoDB` system tables. Instead, a new table, `INNODB_TEMP_TABLE_INFO`, provides users with a snapshot of active temporary tables. The table contains metadata and reports on all user and system-created temporary tables that are active within a given `InnoDB` instance. The table is created when the first `SELECT` statement is run against it.

  + `InnoDB` now supports MySQL-supported spatial data types. Prior to this release, `InnoDB` would store spatial data as binary `BLOB` data. `BLOB` remains the underlying data type but spatial data types are now mapped to a new `InnoDB` internal data type, `DATA_GEOMETRY`.

  + There is now a separate tablespace for all non-compressed `InnoDB` temporary tables. The new tablespace is always recreated on server startup and is located in `DATADIR` by default. A newly added configuration file option, `innodb_temp_data_file_path`, allows for a user-defined temporary data file path.

  + **innochecksum** functionality is enhanced with several new options and extended capabilities. See Section 4.6.1, “innochecksum — Offline InnoDB File Checksum Utility”.

  + A new type of non-redo undo log for both normal and compressed temporary tables and related objects now resides in the temporary tablespace. For more information, see Section 14.6.7, “Undo Logs”.

  + `InnoDB` buffer pool dump and load operations are enhanced. A new system variable, `innodb_buffer_pool_dump_pct`, allows you to specify the percentage of most recently used pages in each buffer pool to read out and dump. When there is other I/O activity being performed by `InnoDB` background tasks, `InnoDB` attempts to limit the number of buffer pool load operations per second using the `innodb_io_capacity` setting.

  + Support is added to `InnoDB` for full-text parser plugins. For information about full-text parser plugins, see Full-Text Parser Plugins and Writing Full-Text Parser Plugins.

  + `InnoDB` supports multiple page cleaner threads for flushing dirty pages from buffer pool instances. A new system variable, `innodb_page_cleaners`, is used to specify the number of page cleaner threads. The default value of `1` maintains the previous configuration in which there is a single page cleaner thread. This enhancement builds on work completed in MySQL 5.6, which introduced a single page cleaner thread to offload buffer pool flushing work from the `InnoDB` master thread.

  + Online DDL support is extended to the following operations for regular and partitioned `InnoDB` tables:

    - `OPTIMIZE TABLE`
    - `ALTER TABLE ... FORCE`

    - `ALTER TABLE ... ENGINE=INNODB` (when run on an `InnoDB` table)

      Online DDL support reduces table rebuild time and permits concurrent DML. See Section 14.13, “InnoDB and Online DDL”.

  + The Fusion-io Non-Volatile Memory (NVM) file system on Linux provides atomic write capability, which makes the `InnoDB` doublewrite buffer redundant. The `InnoDB` doublewrite buffer is automatically disabled for system tablespace files (ibdata files) located on Fusion-io devices that support atomic writes.

  + `InnoDB` supports the Transportable Tablespace feature for partitioned `InnoDB` tables and individual `InnoDB` table partitions. This enhancement eases backup procedures for partitioned tables and enables copying of partitioned tables and individual table partitions between MySQL instances. For more information, see Section 14.6.1.3, “Importing InnoDB Tables”.

  + The `innodb_buffer_pool_size` parameter is dynamic, allowing you to resize the buffer pool without restarting the server. The resizing operation, which involves moving pages to a new location in memory, is performed in chunks. Chunk size is configurable using the new `innodb_buffer_pool_chunk_size` configuration option. You can monitor resizing progress using the new `Innodb_buffer_pool_resize_status` status variable. For more information, see Configuring InnoDB Buffer Pool Size Online.

  + Multithreaded page cleaner support (`innodb_page_cleaners`) is extended to shutdown and recovery phases.

  + `InnoDB` supports indexing of spatial data types using `SPATIAL` indexes, including use of `ALTER TABLE ... ALGORITHM=INPLACE` for online operations (`ADD SPATIAL INDEX`).

  + `InnoDB` performs a bulk load when creating or rebuilding indexes. This method of index creation is known as a “sorted index build”. This enhancement, which improves the efficiency of index creation, also applies to full-text indexes. A new global configuration option, `innodb_fill_factor`, defines the percentage of space on each page that is filled with data during a sorted index build, with the remaining space reserved for future index growth. For more information, see Section 14.6.2.3, “Sorted Index Builds”.

  + A new log record type (`MLOG_FILE_NAME`) is used to identify tablespaces that have been modified since the last checkpoint. This enhancement simplifies tablespace discovery during crash recovery and eliminates scans on the file system prior to redo log application. For more information about the benefits of this enhancement, see Tablespace Discovery During Crash Recovery.

    This enhancement changes the redo log format, requiring that MySQL be shut down cleanly before upgrading to or downgrading from MySQL 5.7.5.

  + You can truncate undo logs that reside in undo tablespaces. This feature is enabled using the `innodb_undo_log_truncate` configuration option. For more information, see Truncating Undo Tablespaces.

  + `InnoDB` supports native partitioning. Previously, `InnoDB` relied on the `ha_partition` handler, which creates a handler object for each partition. With native partitioning, a partitioned `InnoDB` table uses a single partition-aware handler object. This enhancement reduces the amount of memory required for partitioned `InnoDB` tables.

    As of MySQL 5.7.9, **mysql\_upgrade** looks for and attempts to upgrade partitioned `InnoDB` tables that were created using the `ha_partition` handler. Also in MySQL 5.7.9 and later, you can upgrade such tables by name in the **mysql** client using `ALTER TABLE ... UPGRADE PARTITIONING`.

  + `InnoDB` supports the creation of general tablespaces using `CREATE TABLESPACE` syntax.

    ```sql
    CREATE TABLESPACE `tablespace_name`
      ADD DATAFILE 'file_name.ibd'
      [FILE_BLOCK_SIZE = n]
    ```

    General tablespaces can be created outside of the MySQL data directory, are capable of holding multiple tables, and support tables of all row formats.

    Tables are added to a general tablespace using `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` or `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` syntax.

    For more information, see Section 14.6.3.3, “General Tablespaces”.

  + `DYNAMIC` replaces `COMPACT` as the implicit default row format for `InnoDB` tables. A new configuration option, `innodb_default_row_format`, specifies the default `InnoDB` row format. For more information, see Defining the Row Format of a Table.

  + As of MySQL 5.7.11, `InnoDB` supports data-at-rest encryption for file-per-table tablespaces. Encryption is enabled by specifying the `ENCRYPTION` option when creating or altering an `InnoDB` table. This feature relies on a `keyring` plugin for encryption key management. For more information, see Section 6.4.4, “The MySQL Keyring”, and Section 14.14, “InnoDB Data-at-Rest Encryption”.

  + As of MySQL 5.7.24, the zlib library version bundled with MySQL was raised from version 1.2.3 to version 1.2.11. MySQL implements compression with the help of the zlib library.

    If you use `InnoDB` compressed tables, see Section 2.10.3, “Changes in MySQL 5.7” for related upgrade implications.

* **JSON support.** Beginning with MySQL 5.7.8, MySQL supports a native `JSON` type. JSON values are not stored as strings, instead using an internal binary format that permits quick read access to document elements. JSON documents stored in `JSON` columns are automatically validated whenever they are inserted or updated, with an invalid document producing an error. JSON documents are normalized on creation, and can be compared using most comparison operators such as `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=`, and `<=>`; for information about supported operators as well as precedence and other rules that MySQL follows when comparing `JSON` values, see Comparison and Ordering of JSON Values.

  MySQL 5.7.8 also introduces a number of functions for working with `JSON` values. These functions include those listed here:

  + Functions that create `JSON` values: `JSON_ARRAY()`, `JSON_MERGE()`, and `JSON_OBJECT()`. See Section 12.17.2, “Functions That Create JSON Values”.

  + Functions that search `JSON` values: `JSON_CONTAINS()`, `JSON_CONTAINS_PATH()`, `JSON_EXTRACT()`, `JSON_KEYS()`, and `JSON_SEARCH()`. See Section 12.17.3, “Functions That Search JSON Values”.

  + Functions that modify `JSON` values: `JSON_APPEND()`, `JSON_ARRAY_APPEND()`, `JSON_ARRAY_INSERT()`, `JSON_INSERT()`, `JSON_QUOTE()`, `JSON_REMOVE()`, `JSON_REPLACE()`, `JSON_SET()`, and `JSON_UNQUOTE()`. See Section 12.17.4, “Functions That Modify JSON Values”.

  + Functions that provide information about `JSON` values: `JSON_DEPTH()`, `JSON_LENGTH()`, `JSON_TYPE()`, and `JSON_VALID()`. See Section 12.17.5, “Functions That Return JSON Value Attributes”.

  In MySQL 5.7.9 and later, you can use `column->path` as shorthand for `JSON_EXTRACT(column, path)`. This works as an alias for a column wherever a column identifier can occur in an SQL statement, including `WHERE`, `ORDER BY`, and `GROUP BY` clauses. This includes `SELECT`, `UPDATE`, `DELETE`, `CREATE TABLE`, and other SQL statements. The left hand side must be a `JSON` column identifier (and not an alias). The right hand side is a quoted JSON path expression which is evaluated against the JSON document returned as the column value.

  MySQL 5.7.22 adds the following JSON functions:

  + Two JSON aggregation functions `JSON_ARRAYAGG()` and `JSON_OBJECTAGG()`. `JSON_ARRAYAGG()` takes a column or expression as its argument, and aggregates the result as a single `JSON` array. The expression can evaluate to any MySQL data type; this does not have to be a `JSON` value. `JSON_OBJECTAGG()` takes two columns or expressions which it interprets as a key and a value; it returns the result as a single `JSON` object. For more information and examples, see Section 12.19, “Aggregate Functions”.

  + The JSON utility function `JSON_PRETTY()`, which outputs an existing `JSON` value in an easy-to-read format; each JSON object member or array value is printed on a separate line, and a child object or array is intended 2 spaces with respect to its parent.

    This function also works with a string that can be parsed as a JSON value.

    See also Section 12.17.6, “JSON Utility Functions”.

  + The JSON utility function `JSON_STORAGE_SIZE()`, which returns the storage space in bytes used for the binary representation of a JSON document prior to any partial update (see previous item).

    This function also accepts a valid string representation of a JSON document. For such a value, `JSON_STORAGE_SIZE()` returns the space used by its binary representation following its conversion to a JSON document. For a variable containing the string representation of a JSON document, `JSON_STORAGE_FREE()` returns zero. Either function produces an error if its (non-null) argument cannot be parsed as a valid JSON document, and `NULL` if the argument is `NULL`.

    For more information and examples, see Section 12.17.6, “JSON Utility Functions”.

  + A JSON merge function intended to conform to RFC 7396. `JSON_MERGE_PATCH()`, when used on 2 JSON objects, merges them into a single JSON object that has as members a union of the following sets:

    - Each member of the first object for which there is no member with the same key in the second object.

    - Each member of the second object for which there is no member having the same key in the first object, and whose value is not the JSON `null` literal.

    - Each member having a key that exists in both objects, and whose value in the second object is not the JSON `null` literal.

    As part of this work, the `JSON_MERGE()` function has been renamed `JSON_MERGE_PRESERVE()`. `JSON_MERGE()` continues to be recognized as an alias for `JSON_MERGE_PRESERVE()` in MySQL 5.7, but is now deprecated and is subject to removal in a future version of MySQL.

    For more information and examples, see Section 12.17.4, “Functions That Modify JSON Values”.

  See Section 12.17.3, “Functions That Search JSON Values”, for more information about `->` and `JSON_EXTRACT()`. For information about JSON path support in MySQL 5.7, see Searching and Modifying JSON Values. See also Indexing a Generated Column to Provide a JSON Column Index.

* **System and status variables.** System and status variable information is now available in Performance Schema tables, in preference to use of `INFORMATION_SCHEMA` tables to obtain these variable. This also affects the operation of the `SHOW VARIABLES` and `SHOW STATUS` statements. The value of the `show_compatibility_56` system variable affects the output produced from and privileges required for system and status variable statements and tables. For details, see the description of that variable in Section 5.1.7, “Server System Variables”.

  Note

  The default for `show_compatibility_56` is `OFF`. Applications that require 5.6 behavior should set this variable to `ON` until such time as they have been migrated to the new behavior for system variables and status variables. See Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”

* **sys schema.** MySQL distributions now include the `sys` schema, which is a set of objects that help DBAs and developers interpret data collected by the Performance Schema. `sys` schema objects can be used for typical tuning and diagnosis use cases. For more information, see Chapter 26, *MySQL sys Schema*.

* **Condition handling.** MySQL now supports stacked diagnostics areas. When the diagnostics area stack is pushed, the first (current) diagnostics area becomes the second (stacked) diagnostics area and a new current diagnostics area is created as a copy of it. Within a condition handler, executed statements modify the new current diagnostics area, but `GET STACKED DIAGNOSTICS` can be used to inspect the stacked diagnostics area to obtain information about the condition that caused the handler to activate, independent of current conditions within the handler itself. (Previously, there was a single diagnostics area. To inspect handler-activating conditions within a handler, it was necessary to check this diagnostics area before executing any statements that could change it.) See Section 13.6.7.3, “GET DIAGNOSTICS Statement”, and Section 13.6.7.7, “The MySQL Diagnostics Area”.

* **Optimizer.** These optimizer enhancements were added:

  + `EXPLAIN` can be used to obtain the execution plan for an explainable statement executing in a named connection:

    ```sql
    EXPLAIN [options] FOR CONNECTION connection_id;
    ```

    For more information, see Section 8.8.4, “Obtaining Execution Plan Information for a Named Connection”.

  + It is possible to provide hints to the optimizer within individual SQL statements, which enables finer control over statement execution plans than can be achieved using the `optimizer_switch` system variable. Hints are also permitted in statements used with `EXPLAIN`, enabling you to see how hints affect execution plans. For more information, see Section 8.9.3, “Optimizer Hints”.

  + **prefer\_ordering\_index flag.** By default, MySQL attempts to use an ordered index for any `ORDER BY` or `GROUP BY` query that has a `LIMIT` clause, whenever the optimizer determines that this would result in faster execution. Because it is possible in some cases that choosing a different optimization for such queries actually performs better, it is possible as of MySQL 5.7.33 to disable this optimization by setting the `prefer_ordering_index` flag to `off`.

    The default value for this flag is `on`.

    For more information and examples, see Section 8.9.2, “Switchable Optimizations”, and Section 8.2.1.17, “LIMIT Query Optimization”.

* **Triggers.** Previously, a table could have at most one trigger for each combination of trigger event (`INSERT`, `UPDATE`, `DELETE`) and action time (`BEFORE`, `AFTER`). This limitation has been lifted and multiple triggers are permitted. For more information, see Section 23.3, “Using Triggers”.

* **Logging.** These logging enhancements were added:

  + Previously, on Unix and Unix-like systems, MySQL support for sending the server error log to `syslog` was implemented by having **mysqld\_safe** capture server error output and pass it to `syslog`. The server now includes native `syslog` support, which has been extended to include Windows. For more information about sending server error output to `syslog`, see Section 5.4.2, “The Error Log”.

  + The **mysql** client now has a `--syslog` option that causes interactive statements to be sent to the system `syslog` facility. Logging is suppressed for statements that match the default “ignore” pattern list (`"*IDENTIFIED*:*PASSWORD*"`), as well as statements that match any patterns specified using the `--histignore` option. See Section 4.5.1.3, “mysql Client Logging”.

* **Generated Columns.** MySQL now supports the specification of generated columns in `CREATE TABLE` and `ALTER TABLE` statements. Values of a generated column are computed from an expression specified at column creation time. Generated columns can be virtual (computed “on the fly” when rows are read) or stored (computed when rows are inserted or updated). For more information, see Section 13.1.18.7, “CREATE TABLE and Generated Columns”.

* **mysql client.** Previously, **Control+C** in mysql interrupted the current statement if there was one, or exited mysql if not. Now **Control+C** interrupts the current statement if there was one, or cancels any partial input line otherwise, but does not exit.

* **Database name rewriting with mysqlbinlog.** Renaming of databases by **mysqlbinlog** when reading from binary logs written using the row-based format is now supported using the `--rewrite-db` option added in MySQL 5.7.1.

  This option uses the format `--rewrite-db='dboldname->dbnewname'`. You can implement multiple rewrite rules, by specifying the option multiple times.

* **HANDLER with partitioned tables.** The `HANDLER` statement may now be used with user-partitioned tables. Such tables may use any of the available partitioning types (see Section 22.2, “Partitioning Types”).

* **Index condition pushdown support for partitioned tables.** Queries on partitioned tables using the `InnoDB` or `MyISAM` storage engine may employ the index condition pushdown optimization that was introduced in MySQL 5.6. See Section 8.2.1.5, “Index Condition Pushdown Optimization”, for more information.

* **WITHOUT VALIDATION support for ALTER TABLE ... EXCHANGE PARTITION.** As of MySQL 5.7.5, `ALTER TABLE ... EXCHANGE PARTITION` syntax includes an optional `{WITH|WITHOUT} VALIDATION` clause. When `WITHOUT VALIDATION` is specified, `ALTER TABLE ... EXCHANGE PARTITION` does not perform row-by-row validation when exchanging a populated table with the partition, permitting database administrators to assume responsibility for ensuring that rows are within the boundaries of the partition definition. `WITH VALIDATION` is the default behavior and need not be specified explicitly. For more information, see Section 22.3.3, “Exchanging Partitions and Subpartitions with Tables”.

* **Source dump thread improvements.** The source dump thread was refactored to reduce lock contention and improve source throughput. Previous to MySQL 5.7.2, the dump thread took a lock on the binary log whenever reading an event; in MySQL 5.7.2 and later, this lock is held only while reading the position at the end of the last successfully written event. This means both that multiple dump threads are now able to read concurrently from the binary log file, and that dump threads are now able to read while clients are writing to the binary log.

* **Character set support.** MySQL 5.7.4 includes a `gb18030` character set that supports the China National Standard GB18030 character set. For more information about MySQL character set support, see Chapter 10, *Character Sets, Collations, Unicode*.

* **Changing the replication source without STOP SLAVE.** In MySQL 5.7.4 and later, the strict requirement to execute `STOP SLAVE` prior to issuing any `CHANGE MASTER TO` statement is removed. Instead of depending on whether the replica is stopped, the behavior of `CHANGE MASTER TO` now depends on the states of the replica SQL thread and replica I/O threads; which of these threads is stopped or running now determines the options that can or cannot be used with a `CHANGE MASTER TO` statement at a given point in time. The rules for making this determination are listed here:

  + If the SQL thread is stopped, you can execute `CHANGE MASTER TO` using any combination of `RELAY_LOG_FILE`, `RELAY_LOG_POS`, and `MASTER_DELAY` options, even if the replica I/O thread is running. No other options may be used with this statement when the I/O thread is running.

  + If the I/O thread is stopped, you can execute `CHANGE MASTER TO` using any of the options for this statement (in any allowed combination) *except* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or `MASTER_DELAY`, even when the SQL thread is running. These three options may not be used when the I/O thread is running.

  + Both the SQL thread and the I/O thread must be stopped before issuing `CHANGE MASTER TO ... MASTER_AUTO_POSITION = 1`.

  You can check the current state of the replica SQL and I/O threads using `SHOW SLAVE STATUS`.

  If you are using statement-based replication and temporary tables, it is possible for a `CHANGE MASTER TO` statement following a `STOP SLAVE` statement to leave behind temporary tables on the replica. As part of this set of improvements, a warning is now issued whenever `CHANGE MASTER TO` is issued following `STOP SLAVE` when statement-based replication is in use and `Slave_open_temp_tables` remains greater than 0.

  For more information, see Section 13.4.2.1, “CHANGE MASTER TO Statement”, and Section 16.3.7, “Switching Sources During Failover”.

* **Test suite.** The MySQL test suite now uses `InnoDB` as the default storage engine.

* **Multi-source replication is now possible.** MySQL Multi-Source Replication adds the ability to replicate from multiple sources to a replica. MySQL Multi-Source Replication topologies can be used to back up multiple servers to a single server, to merge table shards, and consolidate data from multiple servers to a single server. See Section 16.1.5, “MySQL Multi-Source Replication”.

  As part of MySQL Multi-Source Replication, replication channels have been added. Replication channels enable a replica to open multiple connections to replicate from, with each channel being a connection to a source. See Section 16.2.2, “Replication Channels”.

* **Group Replication Performance Schema tables.** MySQL 5.7 adds a number of new tables to the Performance Schema to provide information about replication groups and channels. These include the following tables:

  + `replication_applier_configuration`
  + `replication_applier_status`
  + `replication_applier_status_by_coordinator`
  + `replication_applier_status_by_worker`
  + `replication_connection_configuration`
  + `replication_connection_status`
  + `replication_group_members`
  + `replication_group_member_stats`

  All of these tables were added in MySQL 5.7.2, except for `replication_group_members` and `replication_group_member_stats`, which were added in MySQL 5.7.6. For more information, see Section 25.12.11, “Performance Schema Replication Tables”.

* **Group Replication SQL.** The following statements were added in MySQL 5.7.6 for controlling Group Replication:

  + `START GROUP_REPLICATION`
  + `STOP GROUP_REPLICATION`

  For more information, see Section 13.4.3, “SQL Statements for Controlling Group Replication”.

### Features Deprecated in MySQL 5.7

The following features are deprecated in MySQL 5.7 and may be removed in a future series. Where alternatives are shown, applications should be updated to use them.

For applications that use features deprecated in MySQL 5.7 that have been removed in a higher MySQL series, statements may fail when replicated from a MySQL 5.7 source to a higher-series replica, or may have different effects on source and replica. To avoid such problems, applications that use features deprecated in 5.7 should be revised to avoid them and use alternatives when possible.

* The `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE`, and `NO_ZERO_IN_DATE` SQL modes are now deprecated but enabled by default. The long term plan is to have them included in strict SQL mode and to remove them as explicit modes in a future MySQL release.

  The deprecated `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE`, and `NO_ZERO_IN_DATE` SQL modes are still recognized so that statements that name them do not produce an error, but are expected to be removed in a future version of MySQL. To make advance preparation for versions of MySQL in which these mode names do not exist, applications should be modified not to refer to them. See SQL Mode Changes in MySQL 5.7.

* These SQL modes are now deprecated; expect them to be removed in a future version of MySQL: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. These deprecations have two implications:

  + Assigning a deprecated mode to the `sql_mode` system variable produces a warning.

  + With the `MAXDB` SQL mode enabled, using `CREATE TABLE` or `ALTER TABLE` to add a `TIMESTAMP` column to a table produces a warning.

* Changes to account-management statements make the following features obsolete. They are now deprecated:

  + Using `GRANT` to create users. Instead, use `CREATE USER`. Following this practice makes the `NO_AUTO_CREATE_USER` SQL mode immaterial for `GRANT` statements, so it too is deprecated.

  + Using `GRANT` to modify account properties other than privilege assignments. This includes authentication, SSL, and resource-limit properties. Instead, establish such properties at account-creation time with `CREATE USER` or modify them afterward with `ALTER USER`.

  + `IDENTIFIED BY PASSWORD 'auth_string'` syntax for `CREATE USER` and `GRANT`. Instead, use `IDENTIFIED WITH auth_plugin AS 'auth_string'` for `CREATE USER` and `ALTER USER`, where the `'auth_string'` value is in a format compatible with the named plugin.

  + The `PASSWORD()` function is deprecated and should be avoided in any context. Thus, `SET PASSWORD ... = PASSWORD('auth_string')` syntax is also deprecated. `SET PASSWORD ... = 'auth_string'` syntax is not deprecated; nevertheless, `ALTER USER` is now the preferred statement for assigning passwords.

  + The `old_passwords` system variable. Account authentication plugins can no longer be left unspecified in the `mysql.user` system table, so any statement that assigns a password from a cleartext string can unambiguously determine the hashing method to use on the string before storing it in the `mysql.user` table. This renders `old_passwords` superflous.

* The query cache is deprecated. Deprecation includes these items:

  + The `FLUSH QUERY CACHE` and `RESET QUERY CACHE` statements.

  + The `SQL_CACHE` and `SQL_NO_CACHE` `SELECT` modifiers.

  + These system variables: `have_query_cache`, `ndb_cache_check_time`, `query_cache_limit`, `query_cache_min_res_unit`, `query_cache_size`, `query_cache_type`, `query_cache_wlock_invalidate`.

  + These status variables: `Qcache_free_blocks`, `Qcache_free_memory`, `Qcache_hits`, `Qcache_inserts`, `Qcache_lowmem_prunes`, `Qcache_not_cached`, `Qcache_queries_in_cache`, `Qcache_total_blocks`.

* Previously, the `--transaction-isolation` and `--transaction-read-only` server startup options corresponded to the `tx_isolation` and `tx_read_only` system variables. For better name correspondence between startup option and system variable names, `transaction_isolation` and `transaction_read_only` have been created as aliases for `tx_isolation` and `tx_read_only`. The `tx_isolation` and `tx_read_only` variables are now deprecated;expect them to be removed in MySQL 8.0. Applications should be adjusted to use `transaction_isolation` and `transaction_read_only` instead.

* The `--skip-innodb` option and its synonyms (`--innodb=OFF`, `--disable-innodb`, and so forth) are deprecated. These options have no effect as of MySQL 5.7. because `InnoDB` cannot be disabled.

* The client-side `--ssl` and `--ssl-verify-server-cert` options are deprecated. Use `--ssl-mode=REQUIRED` instead of `--ssl=1` or `--enable-ssl`. Use `--ssl-mode=DISABLED` instead of `--ssl=0`, `--skip-ssl`, or `--disable-ssl`. Use `--ssl-mode=VERIFY_IDENTITY` instead of `--ssl-verify-server-cert` options. (The server-side `--ssl` option is *not* deprecated.)

  For the C API, `MYSQL_OPT_SSL_ENFORCE` and `MYSQL_OPT_SSL_VERIFY_SERVER_CERT` options for `mysql_options()` correspond to the client-side `--ssl` and `--ssl-verify-server-cert` options and are deprecated. Use `MYSQL_OPT_SSL_MODE` with an option value of `SSL_MODE_REQUIRED` or `SSL_MODE_VERIFY_IDENTITY` instead.

* The `log_warnings` system variable and `--log-warnings` server option are deprecated. Use the `log_error_verbosity` system variable instead.

* The `--temp-pool` server option is deprecated.

* The `binlog_max_flush_queue_time` system variable does nothing in MySQL 5.7, and is deprecated as of MySQL 5.7.9.

* The `innodb_support_xa` system variable, which enables `InnoDB` support for two-phase commit in XA transactions, is deprecated as of MySQL 5.7.10. `InnoDB` support for two-phase commit in XA transactions is always enabled as of MySQL 5.7.10.

* The `metadata_locks_cache_size` and `metadata_locks_hash_instances` system variables are deprecated. These do nothing as of MySQL 5.7.4.

* The `sync_frm` system variable is deprecated.

* The global `character_set_database` and `collation_database` system variables are deprecated; expect them to be removed in a future version of MySQL.

  Assigning a value to the session `character_set_database` and `collation_database` system variables is deprecated and assignments produce a warning. The session variables are expected to become read only in a future version of MySQL, and assignments to them to produce an error, while remaining possible to read the session variables to determine the database character set and collation for the default database.

* The global scope for the `sql_log_bin` system variable has been deprecated, and this variable can now be set with session scope only. The statement `SET GLOBAL SQL_LOG_BIN` now produces an error. It remains possible to read the global value of `sql_log_bin`, but doing so produces a warning. You should act now to remove from your applications any dependencies on reading this value; the global scope `sql_log_bin` is removed in MySQL 8.0.

* With the introduction of the data dictionary in MySQL 8.0, the `--ignore-db-dir` option and `ignore_db_dirs` system variable became superfluous and were removed in that version. Consequently, they are deprecated in MySQL 5.7.

* `GROUP BY` implicitly sorts by default (that is, in the absence of `ASC` or `DESC` designators), but relying on implicit `GROUP BY` sorting in MySQL 5.7 is deprecated. To achieve a specific sort order of grouped results, it is preferable to use To produce a given sort order, use explicit `ASC` or `DESC` designators for `GROUP BY` columns or provide an `ORDER BY` clause. `GROUP BY` sorting is a MySQL extension that may change in a future release; for example, to make it possible for the optimizer to order groupings in whatever manner it deems most efficient and to avoid the sorting overhead.

* The `EXTENDED` and `PARTITIONS` keywords for the `EXPLAIN` statement are deprecated. These keywords are still recognized but are now unnecessary because their effect is always enabled.

* The `ENCRYPT()`, `ENCODE()`, `DECODE()`, `DES_ENCRYPT()`, and `DES_DECRYPT()` encryption functions are deprecated. For `ENCRYPT()`, consider using `SHA2()` instead for one-way hashing. For the others, consider using `AES_ENCRYPT()` and `AES_DECRYPT()` instead. The `--des-key-file` option, the `have_crypt` system variable, the `DES_KEY_FILE` option for the `FLUSH` statement, and the `HAVE_CRYPT` **CMake** option also are deprecated.

* The `MBREqual()` spatial function is deprecated. Use `MBREquals()` instead.

* The functions described in Section 12.16.4, “Functions That Create Geometry Values from WKB Values” previously accepted either WKB strings or geometry arguments. Use of geometry arguments is deprecated. See that section for guidelines for migrating queries away from using geometry arguments.

* The `INFORMATION_SCHEMA` `PROFILING` table is deprecated. Use the Performance Schema instead; see Chapter 25, *MySQL Performance Schema*.

* The `INFORMATION_SCHEMA` `INNODB_LOCKS` and `INNODB_LOCK_WAITS` tables are deprecated, to be removed in MySQL 8.0, which provides replacement Performance Schema tables.

* The Performance Schema `setup_timers` table is deprecated and is removed in MySQL 8.0, as is the `TICK` row in the `performance_timers` table.

* The `sys` schema `sys.version` view is deprecated; expect it be removed in a future version of MySQL. Affected applications should be adjusted to use an alternative instead. For example, use the `VERSION()` function to retrieve the MySQL server version.

* Treatment of `\N` as a synonym for `NULL` in SQL statements is deprecated and is removed in MySQL 8.0; use `NULL` instead.

  This change does not affect text file import or export operations performed with `LOAD DATA` or `SELECT ... INTO OUTFILE`, for which `NULL` continues to be represented by `\N`. See Section 13.2.6, “LOAD DATA Statement”.

* `PROCEDURE ANALYSE()` syntax is deprecated.
* Comment stripping by the **mysql** client and the options to control it (`--skip-comments`, `--comments`) are deprecated.

* **mysqld\_safe** support for `syslog` output is deprecated. Use the native server `syslog` support used instead. See Section 5.4.2, “The Error Log”.

* Conversion of pre-MySQL 5.1 database names containing special characters to 5.1 format with the addition of a `#mysql50#` prefix is deprecated. Because of this, the `--fix-db-names` and `--fix-table-names` options for **mysqlcheck** and the `UPGRADE DATA DIRECTORY NAME` clause for the `ALTER DATABASE` statement are also deprecated.

  Upgrades are supported only from one release series to another (for example, 5.0 to 5.1, or 5.1 to 5.5), so there should be little remaining need for conversion of older 5.0 database names to current versions of MySQL. As a workaround, upgrade a MySQL 5.0 installation to MySQL 5.1 before upgrading to a more recent release.

* **mysql\_install\_db** functionality has been integrated into the MySQL server, **mysqld**. To use this capability to initialize a MySQL installation, if you previously invoked **mysql\_install\_db** manually, invoke **mysqld** with the `--initialize` or `--initialize-insecure` option, depending on whether you want the server to generate a random password for the initial `'root'@'localhost'` account.

  **mysql\_install\_db** is now deprecated, as is the special `--bootstrap` option that **mysql\_install\_db** passes to **mysqld**.

* The **mysql\_plugin** utility is deprecated. Alternatives include loading plugins at server startup using the `--plugin-load` or `--plugin-load-add` option, or at runtime using the `INSTALL PLUGIN` statement.

* The **resolveip** utility is deprecated. **nslookup**, **host**, or **dig** can be used instead.

* The **resolve\_stack\_dump** utility is deprecated. Stack traces from official MySQL builds are always symbolized, so there is no need to use **resolve\_stack\_dump**.

* The `mysql_kill()`, `mysql_list_fields()`, `mysql_list_processes()`, and `mysql_refresh()` C API functions are deprecated. The same is true of the corresponding `COM_PROCESS_KILL`, `COM_FIELD_LIST`, `COM_PROCESS_INFO`, and `COM_REFRESH` client/server protocol commands. Instead, use `mysql_query()` to execute a `KILL`, `SHOW COLUMNS`, `SHOW PROCESSLIST`, or `FLUSH` statement, respectively.

* The `mysql_shutdown()` C API function is deprecated. Instead, use `mysql_query()` to execute a `SHUTDOWN` statement.

* The `libmysqld` embedded server library is deprecated as of MySQL 5.7.19. These are also deprecated:

  + The **mysql\_config** `--libmysqld-libs`, `--embedded-libs`, and `--embedded` options

  + The **CMake** `WITH_EMBEDDED_SERVER`, `WITH_EMBEDDED_SHARED_LIBRARY`, and `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR` options

  + The (undocumented) **mysql** `--server-arg` option

  + The **mysqltest** `--embedded-server`, `--server-arg`, and `--server-file` options

  + The **mysqltest\_embedded** and **mysql\_client\_test\_embedded** test programs

  Because `libmysqld` uses an API comparable to that of `libmysqlclient`, the migration path away from `libmysqld` is straightforward:

  1. Bring up a standalone MySQL server (**mysqld**).

  2. Modify application code to remove API calls that are specific to `libmysqld`.

  3. Modify application code to connect to the standalone MySQL server.

  4. Modify build scripts to use `libmysqlclient` rather than `libmysqld`. For example, if you use **mysql\_config**, invoke it with the `--libs` option rather than `--libmysqld-libs`.

* The **replace** utility is deprecated.
* Support for DTrace is deprecated.
* The `JSON_MERGE()` function is deprecated as of MySQL 5.7.22. Use `JSON_MERGE_PRESERVE()` instead.

* Support for placing table partitions in shared `InnoDB` tablespaces is deprecated as of MySQL 5.7.24. Shared tablespaces include the `InnoDB` system tablespace and general tablespaces. For information about identifying partitions in shared tablespaces and moving them to file-per-table tablespaces, see Preparing Your Installation for Upgrade.

* Support for `TABLESPACE = innodb_file_per_table` and `TABLESPACE = innodb_temporary` clauses with `CREATE TEMPORARY TABLE` is deprecated as of MySQL 5.7.24.

* The `--ndb` **perror** option is deprecated. Use the **ndb\_perror** utility instead.

* The `myisam_repair_threads` system variable `myisam_repair_threads` are deprecated as of MySQL 5.7.38; expect support for both to be removed in a future release of MySQL.

  From MySQL 5.7.38, values other than 1 (the default) for `myisam_repair_threads` produce a warning.

### Features Removed in MySQL 5.7

The following items are obsolete and have been removed in MySQL 5.7. Where alternatives are shown, applications should be updated to use them.

For MySQL 5.6 applications that use features removed in MySQL 5.7, statements may fail when replicated from a MySQL 5.6 source to a MySQL 5.7 replica, or may have different effects on source and replica. To avoid such problems, applications that use features removed in MySQL 5.7 should be revised to avoid them and use alternatives when possible.

* Support for passwords that use the older pre-4.1 password hashing format is removed, which involves the following changes. Applications that use any feature no longer supported must be modified.

  + The `mysql_old_password` authentication plugin is removed. Accounts that use this plugin are disabled at startup and the server writes an “unknown plugin” message to the error log. For instructions on upgrading accounts that use this plugin, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

  + The `--secure-auth` option to the server and client programs is the default, but is now a no-op. It is deprecated; expect it to be removed in a future MySQL release.

  + The `--skip-secure-auth` option to the server and client programs is no longer supported and using it produces an error.

  + The `secure_auth` system variable permits only a value of 1; a value of 0 is no longer permitted.

  + For the `old_passwords` system variable, a value of 1 (produce pre-4.1 hashes) is no longer permitted.

  + The `OLD_PASSWORD()` function is removed.

* In MySQL 5.6.6, the 2-digit `YEAR(2)` data type was deprecated. Support for `YEAR(2)` is now removed. Once you upgrade to MySQL 5.7.5 or higher, any remaining 2-digit `YEAR(2)` columns must be converted to 4-digit `YEAR` columns to become usable again. For conversion strategies, see Section 11.2.5, “2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR” Limitations and Migrating to 4-Digit YEAR"). For example, run **mysql\_upgrade** after upgrading.

* The `innodb_mirrored_log_groups` system variable. The only supported value was 1, so it had no purpose.

* The `storage_engine` system variable. Use `default_storage_engine` instead.

* The `thread_concurrency` system variable.
* The `timed_mutexes` system variable, which had no effect.

* The `IGNORE` clause for `ALTER TABLE`.

* `INSERT DELAYED` is no longer supported. The server recognizes but ignores the `DELAYED` keyword, handles the insert as a nondelayed insert, and generates an `ER_WARN_LEGACY_SYNTAX_CONVERTED` warning. (“INSERT DELAYED is no longer supported. The statement was converted to INSERT.”) Similarly, `REPLACE DELAYED` is handled as a nondelayed replace. You should expect the `DELAYED` keyword to be removed in a future release.

  In addition, several `DELAYED`-related options or features were removed:

  + The `--delayed-insert` option for **mysqldump**.

  + The `COUNT_WRITE_DELAYED`, `SUM_TIMER_WRITE_DELAYED`, `MIN_TIMER_WRITE_DELAYED`, `AVG_TIMER_WRITE_DELAYED`, and `MAX_TIMER_WRITE_DELAYED` columns of the Performance Schema `table_lock_waits_summary_by_table` table.

  + **mysqlbinlog** no longer writes comments mentioning `INSERT DELAYED`.

* Database symlinking on Windows using `.sym` files has been removed because it is redundant with native symlink support available using **mklink**. Any `.sym` file symbolic links are now ignored and should be replaced with symlinks created using **mklink**. See Section 8.12.3.3, “Using Symbolic Links for Databases on Windows”.

* The unused `--basedir`, `--datadir`, and `--tmpdir` options for **mysql\_upgrade** were removed.

* Previously, program options could be specified in full or as any unambiguous prefix. For example, the `--compress` option could be given to **mysqldump** as `--compr`, but not as `--comp` because the latter is ambiguous. Option prefixes are no longer supported; only full options are accepted. This is because prefixes can cause problems when new options are implemented for programs and a prefix that is currently unambiguous might become ambiguous in the future. Some implications of this change:

  + The `--key-buffer` option must now be specified as `--key-buffer-size`.

  + The `--skip-grant` option must now be specified as `--skip-grant-tables`.

* `SHOW ENGINE INNODB MUTEX` output is removed. Comparable information can be generated by creating views on Performance Schema tables.

* The `InnoDB` Tablespace Monitor and `InnoDB` Table Monitor are removed. For the Table Monitor, equivalent information can be obtained from `InnoDB` `INFORMATION_SCHEMA` tables.

* The specially named tables used to enable and disable the standard `InnoDB` Monitor and `InnoDB` Lock Monitor (`innodb_monitor` and `innodb_lock_monitor`) are removed and replaced by two dynamic system variables: `innodb_status_output` and `innodb_status_output_locks`. For additional information, see Section 14.18, “InnoDB Monitors”.

* The `innodb_use_sys_malloc` and `innodb_additional_mem_pool_size` system variables, deprecated in MySQL 5.6.3, were removed.

* The **msql2mysql**, **mysql\_convert\_table\_format**, **mysql\_find\_rows**, **mysql\_fix\_extensions**, **mysql\_setpermission**, **mysql\_waitpid**, **mysql\_zap**, **mysqlaccess**, and **mysqlbug** utilities.

* The **mysqlhotcopy** utility. Alternatives include **mysqldump** and MySQL Enterprise Backup.

* The **binary-configure.sh** script.
* The `INNODB_PAGE_ATOMIC_REF_COUNT` **CMake** option is removed.

* The `innodb_create_intrinsic` option is removed.

* The `innodb_optimize_point_storage` option and related internal data types (`DATA_POINT` and `DATA_VAR_POINT`) are removed.

* The `innodb_log_checksum_algorithm` option is removed.

* The `myisam_repair_threads` system variable as of MySQL 5.7.39.
