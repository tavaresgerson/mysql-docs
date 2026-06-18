## 2.10 Upgrading MySQL

This section describes the steps to upgrade a MySQL installation.

Upgrading is a common procedure, as you pick up bug fixes within the same MySQL release series or significant features between major MySQL releases. You perform this procedure first on some test systems to make sure everything works smoothly, and then on the production systems.

Note

In the following discussion, MySQL commands that must be run using a MySQL account with administrative privileges include `-u root` on the command line to specify the MySQL `root` user. Commands that require a password for `root` also include a `-p` option. Because `-p` is followed by no option value, such commands prompt for the password. Type the password when prompted and press Enter.

SQL statements can be executed using the **mysql** command-line client (connect as `root` to ensure that you have the necessary privileges).

### 2.10.1 Before You Begin

Review the information in this section before upgrading. Perform any recommended actions.

* Protect your data by creating a backup. The backup should include the `mysql` system database, which contains the MySQL system tables. See Section 7.2, “Database Backup Methods”.

* Review Section 2.10.2, “Upgrade Paths” to ensure that your intended upgrade path is supported.

* Review Section 2.10.3, “Changes in MySQL 5.7” for changes that you should be aware of before upgrading. Some changes may require action.

* Review Section 1.3, “What Is New in MySQL 5.7” for deprecated and removed features. An upgrade may require changes with respect to those features if you use any of them.

* Review Section 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”. If you use deprecated or removed variables, an upgrade may require configuration changes.

* Review the Release Notes for information about fixes, changes, and new features.

* If you use replication, review Section 16.4.3, “Upgrading a Replication Topology”.

* Upgrade procedures vary by platform and how the initial installation was performed. Use the procedure that applies to your current MySQL installation:

  + For binary and package-based installations on non-Windows platforms, refer to Section 2.10.4, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”.

    Note

    For supported Linux distributions, the preferred method for upgrading package-based installations is to use the MySQL software repositories (MySQL Yum Repository, MySQL APT Repository, and MySQL SLES Repository).

  + For installations on an Enterprise Linux platform or Fedora using the MySQL Yum Repository, refer to Section 2.10.5, “Upgrading MySQL with the MySQL Yum Repository”.

  + For installations on Ubuntu using the MySQL APT repository, refer to Section 2.10.6, “Upgrading MySQL with the MySQL APT Repository”.

  + For installations on SLES using the MySQL SLES repository, refer to Section 2.10.7, “Upgrading MySQL with the MySQL SLES Repository”.

  + For installations performed using Docker, refer to Section 2.10.9, “Upgrading a Docker Installation of MySQL”.

  + For installations on Windows, refer to Section 2.10.8, “Upgrading MySQL on Windows”.

* If your MySQL installation contains a large amount of data that might take a long time to convert after an in-place upgrade, it may be useful to create a test instance for assessing the conversions that are required and the work involved to perform them. To create a test instance, make a copy of your MySQL instance that contains the `mysql` database and other databases without the data. Run the upgrade procedure on the test instance to assess the work involved to perform the actual data conversion.

* Rebuilding and reinstalling MySQL language interfaces is recommended when you install or upgrade to a new release of MySQL. This applies to MySQL interfaces such as PHP `mysql` extensions and the Perl `DBD::mysql` module.

### 2.10.2 Upgrade Paths

* Upgrade is only supported between General Availability (GA) releases.

* Upgrade from MySQL 5.6 to 5.7 is supported. Upgrading to the latest release is recommended before upgrading to the next version. For example, upgrade to the latest MySQL 5.6 release before upgrading to MySQL 5.7.

* Upgrade that skips versions is not supported. For example, upgrading directly from MySQL 5.5 to 5.7 is not supported.

* Upgrade within a release series is supported. For example, upgrading from MySQL 5.7.*`x`* to 5.7.*`y`* is supported. Skipping a release is also supported. For example, upgrading from MySQL 5.7.*`x`* to 5.7.*`z`* is supported.

### 2.10.3 Changes in MySQL 5.7

Before upgrading to MySQL 5.7, review the changes described in this section to identify those that apply to your current MySQL installation and applications. Perform any recommended actions.

Changes marked as **Incompatible change** are incompatibilities with earlier versions of MySQL, and may require your attention *before upgrading*. Our aim is to avoid these changes, but occasionally they are necessary to correct problems that would be worse than an incompatibility between releases. If an upgrade issue applicable to your installation involves an incompatibility, follow the instructions given in the description. Sometimes this involves dumping and reloading tables, or use of a statement such as `CHECK TABLE` or `REPAIR TABLE`.

For dump and reload instructions, see Section 2.10.12, “Rebuilding or Repairing Tables or Indexes”. Any procedure that involves `REPAIR TABLE` with the `USE_FRM` option *must* be done before upgrading. Use of this statement with a version of MySQL different from the one used to create the table (that is, using it after upgrading) may damage the table. See Section 13.7.2.5, “REPAIR TABLE Statement”.

* Configuration Changes
* System Table Changes
* Server Changes
* InnoDB Changes
* SQL Changes

#### Configuration Changes

* **Incompatible change**: In MySQL 5.7.11, the default `--early-plugin-load` value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default `--early-plugin-load` value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

  `InnoDB` tablespace encryption requires that the keyring plugin to be used be loaded prior to `InnoDB` initialization, so this change of default `--early-plugin-load` value introduces an incompatibility for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an `--early-plugin-load` option that names the plugin library file. For additional information, see Section 6.4.4.1, “Keyring Plugin Installation”.

* **Incompatible change**: The `INFORMATION_SCHEMA` has tables that contain system and status variable information (see Section 24.3.11, “The INFORMATION\_SCHEMA GLOBAL\_VARIABLES and SESSION\_VARIABLES Tables”, and Section 24.3.10, “The INFORMATION\_SCHEMA GLOBAL\_STATUS and SESSION\_STATUS Tables”). As of MySQL 5.7.6, the Performance Schema also contains system and status variable tables (see Section 25.12.13, “Performance Schema System Variable Tables”, and Section 25.12.14, “Performance Schema Status Variable Tables”). The Performance Schema tables are intended to replace the `INFORMATION_SCHEMA` tables, which are deprecated as of MySQL 5.7.6 and are removed in MySQL 8.0.

  For advice on migrating away from the `INFORMATION_SCHEMA` tables to the Performance Schema tables, see Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”. To assist in the migration, you can use the `show_compatibility_56` system variable, which affects how system and status variable information is provided by the `INFORMATION_SCHEMA` and Performance Schema tables, and also by the `SHOW VARIABLES` and `SHOW STATUS` statements. `show_compatibility_56` is enabled by default in 5.7.6 and 5.7.7, and disabled by default in MySQL 5.7.8.

  For details about the effects of `show_compatibility_56`, see Section 5.1.7, “Server System Variables” For better understanding, it is strongly recommended that you read also these sections:

  + Section 25.12.13, “Performance Schema System Variable Tables”
  + Section 25.12.14, “Performance Schema Status Variable Tables”
  + Section 25.12.15.10, “Status Variable Summary Tables”
* **Incompatible change**: As of MySQL 5.7.6, data directory initialization creates only a single `root` account, `'root'@'localhost'`. (See Section 2.9.1, “Initializing the Data Directory”.) An attempt to connect to the host `127.0.0.1` normally resolves to the `localhost` account. However, this fails if the server is run with `skip_name_resolve` enabled. If you plan to do that, make sure that an account exists that can accept a connection. For example, to be able to connect as `root` using `--host=127.0.0.1` or `--host=::1`, create these accounts:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

* **Incompatible change**: As of MySQL 5.7.6, for some Linux platforms, when MySQL is installed using RPM and Debian packages, server startup and shutdown now is managed using systemd rather than `mysqld_safe`, and `mysqld_safe` is not installed. This may require some adjustment to the manner in which you specify server options. For details, see Section 2.5.10, “Managing MySQL Server with systemd”.

* **Incompatible change**: In MySQL 5.7.5, the executable binary version of **mysql\_install\_db** is located in the `bin` installation directory, whereas the Perl version was located in the `scripts` installation directory. For upgrades from an older version of MySQL, you may find a version in both directories. To avoid confusion, remove the version in the `scripts` directory. For fresh installations of MySQL 5.7.5 or later, **mysql\_install\_db** is only found in the `bin` directory, and the `scripts` directory is no longer present. Applications that expect to find **mysql\_install\_db** in the `scripts` directory should be updated to look in the `bin` directory instead.

  The location of **mysql\_install\_db** becomes less material as of MySQL 5.7.6 because as of that version it is deprecated in favor of **mysqld --initialize** (or **mysqld --initialize-insecure**). See Section 2.9.1, “Initializing the Data Directory”

* **Incompatible change**: In MySQL 5.7.5, these SQL mode changes were made:

  + Strict SQL mode for transactional storage engines (`STRICT_TRANS_TABLES`) is now enabled by default.

  + Implementation of the `ONLY_FULL_GROUP_BY` SQL mode has been made more sophisticated, to no longer reject deterministic queries that previously were rejected. In consequence, `ONLY_FULL_GROUP_BY` is now enabled by default, to prohibit nondeterministic queries containing expressions not guaranteed to be uniquely determined within a group.

  + The changes to the default SQL mode result in a default `sql_mode` system variable value with these modes enabled: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ENGINE_SUBSTITUTION`.

  + The `ONLY_FULL_GROUP_BY` mode is also now included in the modes comprised by the `ANSI` SQL mode.

  If you find that having `ONLY_FULL_GROUP_BY` enabled causes queries for existing applications to be rejected, either of these actions should restore operation:

  + If it is possible to modify an offending query, do so, either so that nondeterministic nonaggregated columns are functionally dependent on `GROUP BY` columns, or by referring to nonaggregated columns using `ANY_VALUE()`.

  + If it is not possible to modify an offending query (for example, if it is generated by a third-party application), set the `sql_mode` system variable at server startup to not enable `ONLY_FULL_GROUP_BY`.

  For more information about SQL modes and `GROUP BY` queries, see Section 5.1.10, “Server SQL Modes”, and Section 12.19.3, “MySQL Handling of GROUP BY”.

#### System Table Changes

* **Incompatible change**: The `Password` column of the `mysql.user` system table was removed in MySQL 5.7.6. All credentials are stored in the `authentication_string` column, including those formerly stored in the `Password` column. If performing an in-place upgrade to MySQL 5.7.6 or later, run `mysqld_upgrade` as directed by the in-place upgrade procedure to migrate the `Password` column contents to the `authentication_string` column.

  If performing a logical upgrade using a **mysqldump** dump file from a pre-5.7.6 MySQL installation, you must observe these conditions for the **mysqldump** command used to generate the dump file:

  + You must include the `--add-drop-table` option

  + You must not include the `--flush-privileges` option

  As outlined in the logical upgrade procedure, load the pre-5.7.6 dump file into the 5.7.6 (or later) server before running `mysqld_upgrade`.

#### Server Changes

* **Incompatible change**: As of MySQL 5.7.5, support for passwords that use the older pre-4.1 password hashing format is removed, which involves the following changes. Applications that use any feature no longer supported must be modified.

  + The `mysql_old_password` authentication plugin that used pre-4.1 password hash values is removed. Accounts that use this plugin are disabled at startup and the server writes an “unknown plugin” message to the error log. For instructions on upgrading accounts that use this plugin, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

  + For the `old_passwords` system variable, a value of 1 (produce pre-4.1 hash values) is no longer permitted.

  + The `--secure-auth` option to the server and client programs is the default, but is now a no-op. It is deprecated;expect it to be removed in a future MySQL release.

  + The `--skip-secure-auth` option to the server and client programs is no longer supported and using it produces an error.

  + The `secure_auth` system variable permits only a value of 1; a value of 0 is no longer permitted.

  + The `OLD_PASSWORD()` function is removed.

* **Incompatible change**: In MySQL 5.6.6, the 2-digit `YEAR(2)` data type was deprecated. In MySQL 5.7.5, support for `YEAR(2)` is removed. Once you upgrade to MySQL 5.7.5 or higher, any remaining 2-digit `YEAR(2)` columns must be converted to 4-digit `YEAR` columns to become usable again. For conversion strategies, see Section 11.2.5, “2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR” Limitations and Migrating to 4-Digit YEAR"). Running `mysqld_upgrade` after upgrading is one of the possible conversion strategies.

* As of MySQL 5.7.7, `CHECK TABLE ... FOR UPGRADE` reports a table as needing a rebuild if it contains old temporal columns in pre-5.6.4 format (`TIME`, `DATETIME`, and `TIMESTAMP` columns without support for fractional seconds precision) and the `avoid_temporal_upgrade` system variable is disabled. This helps `mysqld_upgrade` to detect and upgrade tables containing old temporal columns. If `avoid_temporal_upgrade` is enabled, `FOR UPGRADE` ignores the old temporal columns present in the table; consequently, `mysqld_upgrade` does not upgrade them.

  As of MySQL 5.7.7, `REPAIR TABLE` upgrades a table if it contains old temporal columns in pre-5.6.4 format and the `avoid_temporal_upgrade` system variable is disabled. If `avoid_temporal_upgrade` is enabled, `REPAIR TABLE` ignores the old temporal columns present in the table and does not upgrade them.

  To check for tables that contain such temporal columns and need a rebuild, disable `avoid_temporal_upgrade` before executing `CHECK TABLE ... FOR UPGRADE`.

  To upgrade tables that contain such temporal columns, disable `avoid_temporal_upgrade` before executing `REPAIR TABLE` or `mysqld_upgrade`.

* **Incompatible change**: As of MySQL 5.7.2, the server requires account rows in the `mysql.user` system table to have a nonempty `plugin` column value and disables accounts with an empty value. This requires that you upgrade your `mysql.user` table to fill in all `plugin` values. As of MySQL 5.7.6, use this procedure:

  If you plan to upgrade using the data directory from your existing MySQL installation:

  1. Stop the old (MySQL 5.6) server
  2. Upgrade the MySQL binaries in place by replacing the old binaries with the new ones

  3. Start the MySQL 5.7 server normally (no special options)
  4. Run `mysqld_upgrade` to upgrade the system tables

  5. Restart the MySQL 5.7 server

  If you plan to upgrade by reloading a dump file generated from your existing MySQL installation:

  1. To generate the dump file, run **mysqldump** with the `--add-drop-table` option and without the `--flush-privileges` option

  2. Stop the old (MySQL 5.6) server
  3. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  4. Start the MySQL 5.7 server normally (no special options)
  5. Reload the dump file (**mysql < *`dump_file`***)

  6. Run `mysqld_upgrade` to upgrade the system tables

  7. Restart the MySQL 5.7 server

  Before MySQL 5.7.6, the procedure is more involved:

  If you plan to upgrade using the data directory from your existing MySQL installation:

  1. Stop the old (MySQL 5.6) server
  2. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  3. Restart the server with the `--skip-grant-tables` option to disable privilege checking

  4. Run `mysqld_upgrade` to upgrade the system tables

  5. Restart the server normally (without `--skip-grant-tables`)

  If you plan to upgrade by reloading a dump file generated from your existing MySQL installation:

  1. To generate the dump file, run **mysqldump** without the `--flush-privileges` option

  2. Stop the old (MySQL 5.6) server
  3. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  4. Restart the server with the `--skip-grant-tables` option to disable privilege checking

  5. Reload the dump file (**mysql < *`dump_file`***)

  6. Run `mysqld_upgrade` to upgrade the system tables

  7. Restart the server normally (without `--skip-grant-tables`)

  `mysqld_upgrade` runs by default as the MySQL `root` user. For the preceding procedures, if the `root` password is expired when you run `mysqld_upgrade`, it displays a message informing you that your password is expired and that `mysqld_upgrade` failed as a result. To correct this, reset the `root` password and run `mysqld_upgrade` again:

  ```sql
  $> mysql -u root -p
  Enter password: ****  <- enter root password here
  mysql> ALTER USER USER() IDENTIFIED BY 'root-password'; # MySQL 5.7.6 and up
  mysql> SET PASSWORD = PASSWORD('root-password');        # Before MySQL 5.7.6
  mysql> quit

  $> mysql_upgrade -p
  Enter password: ****  <- enter root password here
  ```

  The password-resetting statement normally does not work if the server is started with `--skip-grant-tables`, but the first invocation of `mysqld_upgrade` flushes the privileges, so when you run **mysql**, the statement is accepted.

  If `mysqld_upgrade` itself expires the `root` password, you must reset the password again in the same manner.

  After following the preceding instructions, DBAs are advised also to convert accounts that use the `mysql_old_password` authentication plugin to use `mysql_native_password` instead, because support for `mysql_old_password` has been removed. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* **Incompatible change**: It is possible for a column `DEFAULT` value to be valid for the `sql_mode` value at table-creation time but invalid for the `sql_mode` value when rows are inserted or updated. Example:

  ```sql
  SET sql_mode = '';
  CREATE TABLE t (d DATE DEFAULT 0);
  SET sql_mode = 'NO_ZERO_DATE,STRICT_ALL_TABLES';
  INSERT INTO t (d) VALUES(DEFAULT);
  ```

  In this case, 0 should be accepted for the `CREATE TABLE` but rejected for the `INSERT`. However, previously the server did not evaluate `DEFAULT` values used for inserts or updates against the current `sql_mode`. In the example, the `INSERT` succeeds and inserts `'0000-00-00'` into the `DATE` column.

  As of MySQL 5.7.2, the server applies the proper `sql_mode` checks to generate a warning or error at insert or update time.

  A resulting incompatibility for replication if you use statement-based logging (`binlog_format=STATEMENT`) is that if a replica is upgraded, a source which has not been upgraded executes the preceding example without error, whereas the `INSERT` fails on the replica and replication stops.

  To deal with this, stop all new statements on the source and wait until the replicas catch up. Then upgrade the replicas followed by the source. Alternatively, if you cannot stop new statements, temporarily change to row-based logging on the source (`binlog_format=ROW`) and wait until all replicas have processed all binary logs produced up to the point of this change. Then upgrade the replicas followed by the source and change the source back to statement-based logging.

* **Incompatible change**: Several changes were made to the audit log plugin for better compatibility with Oracle Audit Vault. For upgrading purpose, the main issue is that the default format of the audit log file has changed: Information within `<AUDIT_RECORD>` elements previously written using attributes now is written using subelements.

  Example of old `<AUDIT_RECORD>` format:

  ```sql
  <AUDIT_RECORD
   TIMESTAMP="2013-04-15T15:27:27"
   NAME="Query"
   CONNECTION_ID="3"
   STATUS="0"
   SQLTEXT="SELECT 1"
  />
  ```

  Example of new format:

  ```sql
  <AUDIT_RECORD>
   <TIMESTAMP>2013-04-15T15:27:27 UTC</TIMESTAMP>
   <RECORD_ID>3998_2013-04-15T15:27:27</RECORD_ID>
   <NAME>Query</NAME>
   <CONNECTION_ID>3</CONNECTION_ID>
   <STATUS>0</STATUS>
   <STATUS_CODE>0</STATUS_CODE>
   <USER>root[root] @ localhost [127.0.0.1]</USER>
   <OS_LOGIN></OS_LOGIN>
   <HOST>localhost</HOST>
   <IP>127.0.0.1</IP>
   <COMMAND_CLASS>select</COMMAND_CLASS>
   <SQLTEXT>SELECT 1</SQLTEXT>
  </AUDIT_RECORD>
  ```

  If you previously used an older version of the audit log plugin, use this procedure to avoid writing new-format log entries to an existing log file that contains old-format entries:

  1. Stop the server.
  2. Rename the current audit log file manually. This file contains log entries using only the old format.

  3. Update the server and restart it. The audit log plugin creates a new log file, which contains log entries using only the new format.

  For information about the audit log plugin, see Section 6.4.5, “MySQL Enterprise Audit”.

* As of MySQL 5.7.7, the default connection timeout for a replica was changed from 3600 seconds (one hour) to 60 seconds (one minute). The new default is applied when a replica without a setting for the `slave_net_timeout` system variable is upgraded to MySQL 5.7. The default setting for the heartbeat interval, which regulates the heartbeat signal to stop the connection timeout occurring in the absence of data if the connection is still good, is calculated as half the value of `slave_net_timeout`. The heartbeat interval is recorded in the replica's source info log (the `mysql.slave_master_info` table or `master.info` file), and it is not changed automatically when the value or default setting of `slave_net_timeout` is changed. A MySQL 5.6 replica that used the default connection timeout and heartbeat interval, and was then upgraded to MySQL 5.7, therefore has a heartbeat interval that is much longer than the connection timeout.

  If the level of activity on the source is such that updates to the binary log are sent to the replica at least once every 60 seconds, this situation is not an issue. However, if no data is received from the source, because the heartbeat is not being sent, the connection timeout expires. The replica therefore thinks the connection to the source has been lost and makes multiple reconnection attempts (as controlled by the `MASTER_CONNECT_RETRY` and `MASTER_RETRY_COUNT` settings, which can also be seen in the source info log). The reconnection attempts spawn numerous zombie dump threads that the source must kill, causing the error log on the source to contain multiple errors of the form While initializing dump thread for slave with UUID *`uuid`*, found a zombie dump thread with the same UUID. Master is killing the zombie dump thread *`threadid`*. To avoid this issue, immediately before upgrading a replica to MySQL 5.7, check whether the `slave_net_timeout` system variable is using the default setting. If so, issue `CHANGE MASTER TO` with the `MASTER_HEARTBEAT_PERIOD` option, and set the heartbeat interval to 30 seconds, so that it works with the new connection timeout of 60 seconds that applies after the upgrade.

* **Incompatible change**: MySQL 5.6.22 and later recognized the `REFERENCES` privilege but did not entirely enforce it; a user with at least one of `SELECT`, `INSERT`, `UPDATE`, `DELETE`, or `REFERENCES` could create a foreign key constraint on a table. MySQL 5.7 (and later) requires the user to have the `REFERENCES` privilege to do this. This means that if you migrate users from a MySQL 5.6 server (any version) to one running MySQL 5.7, you must make sure to grant this privilege explicitly to any users which need to be able to create foreign keys. This includes the user account employed to import dumps containing tables with foreign keys.

#### InnoDB Changes

* As of MySQL 5.7.24, the zlib library version bundled with MySQL was raised from version 1.2.3 to version 1.2.11.

  The zlib `compressBound()` function in zlib 1.2.11 returns a slightly higher estimate of the buffer size required to compress a given length of bytes than it did in zlib version 1.2.3. The `compressBound()` function is called by `InnoDB` functions that determine the maximum row size permitted when creating compressed `InnoDB` tables or inserting rows into compressed `InnoDB` tables. As a result, `CREATE TABLE ... ROW_FORMAT=COMPRESSED` or `INSERT` operations with row sizes very close to the maximum row size that were successful in earlier releases could now fail.

  If you have compressed `InnoDB` tables with large rows, it is recommended that you test compressed table `CREATE TABLE` statements on a MySQL 5.7 test instance prior to upgrading.

* **Incompatible change**: To simplify `InnoDB` tablespace discovery during crash recovery, new redo log record types were introduced in MySQL 5.7.5. This enhancement changes the redo log format. Before performing an in-place upgrade, perform a clean shutdown using an `innodb_fast_shutdown` setting of `0` or `1`. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Upgrade.

* **Incompatible change**: MySQL 5.7.8 and 5.7.9 undo logs may contain insufficient information about spatial columns, which could result in a upgrade failure (Bug #21508582). Before performing an in-place upgrade from MySQL 5.7.8 or 5.7.9 to 5.7.10 or higher, perform a slow shutdown using `innodb_fast_shutdown=0` to clear the undo logs. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Upgrade.

* **Incompatible change**: MySQL 5.7.8 undo logs may contain insufficient information about virtual columns and virtual column indexes, which could result in a upgrade failure (Bug #21869656). Before performing an in-place upgrade from MySQL 5.7.8 to MySQL 5.7.9 or higher, perform a slow shutdown using `innodb_fast_shutdown=0` to clear the undo logs. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Upgrade.

* **Incompatible change**: As of MySQL 5.7.9, the redo log header of the first redo log file (`ib_logfile0`) includes a format version identifier and a text string that identifies the MySQL version that created the redo log files. This enhancement changes the redo log format, requiring that MySQL be shutdown cleanly using an `innodb_fast_shutdown` setting of `0` or `1` before performing an in-place upgrade to MySQL 5.7.9 or higher. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Upgrade.

* In MySQL 5.7.9, `DYNAMIC` replaces `COMPACT` as the implicit default row format for `InnoDB` tables. A new configuration option, `innodb_default_row_format`, specifies the default `InnoDB` row format. Permitted values include `DYNAMIC` (the default), `COMPACT`, and `REDUNDANT`.

  After upgrading to 5.7.9, any new tables that you create use the row format defined by `innodb_default_row_format` unless you explicitly define a row format (`ROW_FORMAT`).

  For existing tables that do not explicitly define a `ROW_FORMAT` option or that use `ROW_FORMAT=DEFAULT`, any operation that rebuilds a table also silently changes the row format of the table to the format defined by `innodb_default_row_format`. Otherwise, existing tables retain their current row format setting. For more information, see Defining the Row Format of a Table.

* Beginning with MySQL 5.7.6, the `InnoDB` storage engine uses its own built-in (“native”) partitioning handler for any new partitioned tables created using `InnoDB`. Partitioned `InnoDB` tables created in previous versions of MySQL are not automatically upgraded. You can easily upgrade such tables to use `InnoDB` native partitioning in MySQL 5.7.9 or later using either of the following methods:

  + To upgrade an individual table from the generic partitioning handler to *`InnoDB`* native partitioning, execute the statement `ALTER TABLE table_name UPGRADE PARTITIONING`.

  + To upgrade all `InnoDB` tables that use the generic partitioning handler to use the native partitioning handler instead, run `mysqld_upgrade`.

#### SQL Changes

* **Incompatible change**: The `GET_LOCK()` function was reimplemented in MySQL 5.7.5 using the metadata locking (MDL) subsystem and its capabilities have been extended:

  + Previously, `GET_LOCK()` permitted acquisition of only one named lock at a time, and a second `GET_LOCK()` call released any existing lock. Now `GET_LOCK()` permits acquisition of more than one simultaneous named lock and does not release existing locks.

    Applications that rely on the behavior of `GET_LOCK()` releasing any previous lock must be modified for the new behavior.

  + The capability of acquiring multiple locks introduces the possibility of deadlock among clients. The MDL subsystem detects deadlock and returns an `ER_USER_LOCK_DEADLOCK` error when this occurs.

  + The MDL subsystem imposes a limit of 64 characters on lock names, so this limit now also applies to named locks. Previously, no length limit was enforced.

  + Locks acquired with `GET_LOCK()` now appear in the Performance Schema `metadata_locks` table. The `OBJECT_TYPE` column says `USER LEVEL LOCK` and the `OBJECT_NAME` column indicates the lock name.

  + A new function, `RELEASE_ALL_LOCKS()` permits release of all acquired named locks at once.

  For more information, see Section 12.14, “Locking Functions”.

* The optimizer now handles derived tables and views in the `FROM` clause in consistent fashion to better avoid unnecessary materialization and to enable use of pushed-down conditions that produce more efficient execution plans.

  However in MySQL 5.7 before MySQL 5.7.11, and for statements such as `DELETE` or `UPDATE` that modify tables, using the merge strategy for a derived table that previously was materialized can result in an `ER_UPDATE_TABLE_USED` error:

  ```sql
  mysql> DELETE FROM t1
      -> WHERE id IN (SELECT id
      ->              FROM (SELECT t1.id
      ->                    FROM t1 INNER JOIN t2 USING (id)
      ->                    WHERE t2.status = 0) AS t);
  ERROR 1093 (HY000): You can't specify target table 't1'
  for update in FROM clause
  ```

  The error occurs when merging a derived table into the outer query block results in a statement that both selects from and modifies a table. (Materialization does not cause the problem because, in effect, it converts the derived table to a separate table.) The workaround to avoid this error was to disable the `derived_merge` flag of the `optimizer_switch` system variable before executing the statement:

  ```sql
  SET optimizer_switch = 'derived_merge=off';
  ```

  The `derived_merge` flag controls whether the optimizer attempts to merge subqueries and views in the `FROM` clause into the outer query block, assuming that no other rule prevents merging. By default, the flag is `on` to enable merging. Setting the flag to `off` prevents merging and avoids the error just described. For more information, see Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”.

* Some keywords may be reserved in MySQL 5.7 that were not reserved in MySQL 5.6. See Section 9.3, “Keywords and Reserved Words”. This can cause words previously used as identifiers to become illegal. To fix affected statements, use identifier quoting. See Section 9.2, “Schema Object Names”.

* After upgrading, it is recommended that you test optimizer hints specified in application code to ensure that the hints are still required to achieve the desired optimization strategy. Optimizer enhancements can sometimes render certain optimizer hints unnecessary. In some cases, an unnecessary optimizer hint may even be counterproductive.

* In `UNION` statements, to apply `ORDER BY` or `LIMIT` to an individual `SELECT`, place the clause inside the parentheses that enclose the `SELECT`:

  ```sql
  (SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
  UNION
  (SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
  ```

  Previous versions of MySQL may permit such statements without parentheses. In MySQL 5.7, the requirement for parentheses is enforced.

### 2.10.4 Upgrading MySQL Binary or Package-based Installations on Unix/Linux

This section describes how to upgrade MySQL binary and package-based installations on Unix/Linux. In-place and logical upgrade methods are described.

* In-Place Upgrade
* Logical Upgrade

#### In-Place Upgrade

An in-place upgrade involves shutting down the old MySQL server, replacing the old MySQL binaries or packages with the new ones, restarting MySQL on the existing data directory, and upgrading any remaining parts of the existing installation that require upgrading.

Note

Only upgrade a MySQL server instance that was properly shut down. If the instance unexpectedly shutdown, then restart the instance and shut it down with `innodb_fast_shutdown=0` before upgrade.

Note

If you upgrade an installation originally produced by installing multiple RPM packages, upgrade all the packages, not just some. For example, if you previously installed the server and client RPMs, do not upgrade just the server RPM.

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, `mysqld_safe` is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

To perform an in-place upgrade:

1. If you use XA transactions with `InnoDB`, run `XA RECOVER` before upgrading to check for uncommitted XA transactions. If results are returned, either commit or rollback the XA transactions by issuing an `XA COMMIT` or `XA ROLLBACK` statement.

2. Configure MySQL to perform a slow shutdown by setting `innodb_fast_shutdown` to `0`. For example:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   With a slow shutdown, `InnoDB` performs a full purge and change buffer merge before shutting down, which ensures that data files are fully prepared in case of file format differences between releases.

3. Shut down the old MySQL server. For example:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Upgrade the MySQL binary installation or packages. If upgrading a binary installation, unpack the new MySQL binary distribution package. See Obtain and Unpack the Distribution. For package-based installations, install the new packages.

5. Start the MySQL 5.7 server, using the existing data directory. For example:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

6. Run `mysqld_upgrade`. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   `mysqld_upgrade` examines all tables in all databases for incompatibilities with the current version of MySQL. `mysqld_upgrade` also upgrades the `mysql` system database so that you can take advantage of new privileges or capabilities.

   Note

   `mysqld_upgrade` does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

7. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

#### Logical Upgrade

A logical upgrade involves exporting SQL from the old MySQL instance using a backup or export utility such as **mysqldump** or **mysqlpump**, installing the new MySQL server, and applying the SQL to your new MySQL instance.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, `mysqld_safe` is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

To perform a logical upgrade:

1. Review the information in Section 2.10.1, “Before You Begin”.

2. Export your existing data from the previous MySQL installation:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   Note

   Use the `--routines` and `--events` options with **mysqldump** (as shown above) if your databases include stored programs. The `--all-databases` option includes all databases in the dump, including the `mysql` database that holds the system tables.

   Important

   If you have tables that contain generated columns, use the **mysqldump** utility provided with MySQL 5.7.9 or higher to create your dump files. The **mysqldump** utility provided in earlier releases uses incorrect syntax for generated column definitions (Bug #20769542). You can use the Information Schema `COLUMNS` table to identify tables with generated columns.

3. Shut down the old MySQL server. For example:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Install MySQL 5.7. For installation instructions, see Chapter 2, *Installing and Upgrading MySQL*.

5. Initialize a new data directory, as described at Section 2.9.1, “Initializing the Data Directory”. For example:

   ```sql
   mysqld --initialize --datadir=/path/to/5.7-datadir
   ```

   Copy the temporary `'root'@'localhost'` password displayed to your screen or written to your error log for later use.

6. Start the MySQL 5.7 server, using the new data directory. For example:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
   ```

7. Reset the `root` password:

   ```sql
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```sql
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```

8. Load the previously created dump file into the new MySQL server. For example:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

   Note

   It is not recommended to load a dump file when GTIDs are enabled on the server (`gtid_mode=ON`), if your dump file includes system tables. **mysqldump** issues DML instructions for the system tables which use the non-transactional MyISAM storage engine, and this combination is not permitted when GTIDs are enabled. Also be aware that loading a dump file from a server with GTIDs enabled, into another server with GTIDs enabled, causes different transaction identifiers to be generated.

9. Run `mysqld_upgrade`. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   `mysqld_upgrade` examines all tables in all databases for incompatibilities with the current version of MySQL. `mysqld_upgrade` also upgrades the `mysql` system database so that you can take advantage of new privileges or capabilities.

   Note

   `mysqld_upgrade` does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

10. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

    ```sql
    mysqladmin -u root -p shutdown
    mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
    ```

### 2.10.5 Upgrading MySQL with the MySQL Yum Repository

For supported Yum-based platforms (see Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”, for a list), you can perform an in-place upgrade for MySQL (that is, replacing the old version and then running the new version using the old data files) with the MySQL Yum repository.

Notes

* Before performing any update to MySQL, follow carefully the instructions in Section 2.10, “Upgrading MySQL”. Among other instructions discussed there, it is especially important to back up your database before the update.

* The following instructions assume you have installed MySQL with the MySQL Yum repository or with an RPM package directly downloaded from [MySQL Developer Zone's MySQL Download page](https://dev.mysql.com/downloads/); if that is not the case, following the instructions in Section 2.5.2, “Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository”.

1. #### Selecting a Target Series

   By default, the MySQL Yum repository updates MySQL to the latest version in the release series you have chosen during installation (see Selecting a Release Series for details), which means, for example, a 5.6.x installation is *not* updated to a 5.7.x release automatically. To update to another release series, you need first to disable the subrepository for the series that has been selected (by default, or by yourself) and enable the subrepository for your target series. To do that, see the general instructions given in Selecting a Release Series. For upgrading from MySQL 5.6 to 5.7, perform the *reverse* of the steps illustrated in Selecting a Release Series, disabling the subrepository for the MySQL 5.6 series and enabling that for the MySQL 5.7 series.

   As a general rule, to upgrade from one release series to another, go to the next series rather than skipping a series. For example, if you are currently running MySQL 5.5 and wish to upgrade to 5.7, upgrade to MySQL 5.6 first before upgrading to 5.7.

   Important

   For important information about upgrading from MySQL 5.6 to 5.7, see Upgrading from MySQL 5.6 to 5.7.

2. #### Upgrading MySQL

   Upgrade MySQL and its components by the following command, for platforms that are not dnf-enabled:

   ```sql
   sudo yum update mysql-server
   ```

   For platforms that are dnf-enabled:

   ```sql
   sudo dnf upgrade mysql-server
   ```

   Alternatively, you can update MySQL by telling Yum to update everything on your system, which might take considerably more time. For platforms that are not dnf-enabled:

   ```sql
   sudo yum update
   ```

   For platforms that are dnf-enabled:

   ```sql
   sudo dnf upgrade
   ```

3. #### Restarting MySQL

   The MySQL server always restarts after an update by Yum. Once the server restarts, run `mysqld_upgrade` to check and possibly resolve any incompatibilities between the old data and the upgraded software. `mysqld_upgrade` also performs other functions; see Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables” for details.

You can also update only a specific component. Use the following command to list all the installed packages for the MySQL components (for dnf-enabled systems, replace **yum** in the command with **dnf**):

```sql
sudo yum list installed | grep "^mysql"
```

After identifying the package name of the component of your choice, update the package with the following command, replacing *`package-name`* with the name of the package. For platforms that are not dnf-enabled:

```sql
sudo yum update package-name
```

For dnf-enabled platforms:

```sql
sudo dnf upgrade package-name
```

#### Upgrading the Shared Client Libraries

After updating MySQL using the Yum repository, applications compiled with older versions of the shared client libraries should continue to work.

*If you recompile applications and dynamically link them with the updated libraries:*  As typical with new versions of shared libraries where there are differences or additions in symbol versioning between the newer and older libraries (for example, between the newer, standard 5.7 shared client libraries and some older—prior or variant—versions of the shared libraries shipped natively by the Linux distributions' software repositories, or from some other sources), any applications compiled using the updated, newer shared libraries require those updated libraries on systems where the applications are deployed. If those libraries are not in place, the applications requiring the shared libraries fail. For this reason, be sure to deploy the packages for the shared libraries from MySQL on those systems. To do this, add the MySQL Yum repository to the systems (see Adding the MySQL Yum Repository) and install the latest shared libraries using the instructions given in Installing Additional MySQL Products and Components with Yum.

### 2.10.6 Upgrading MySQL with the MySQL APT Repository

On Debian and Ubuntu platforms, to perform an in-place upgrade of MySQL and its components, use the MySQL APT repository. See Upgrading MySQL with the MySQL APT Repository in A Quick Guide to Using the MySQL APT Repository.

### 2.10.7 Upgrading MySQL with the MySQL SLES Repository

On the SUSE Linux Enterprise Server (SLES) platform, to perform an in-place upgrade of MySQL and its components, use the MySQL SLES repository. See Upgrading MySQL with the MySQL SLES Repository in A Quick Guide to Using the MySQL SLES Repository.

### 2.10.8 Upgrading MySQL on Windows

There are two approaches for upgrading MySQL on Windows:

* Using MySQL Installer
* Using the Windows ZIP archive distribution

The approach you select depends on how the existing installation was performed. Before proceeding, review Section 2.10, “Upgrading MySQL” for additional information on upgrading MySQL that is not specific to Windows.

Note

Whichever approach you choose, always back up your current MySQL installation before performing an upgrade. See Section 7.2, “Database Backup Methods”.

Upgrades between milestone releases (or from a milestone release to a GA release) are not supported. Significant development changes take place in milestone releases and you may encounter compatibility issues or problems starting the server. For instructions on how to perform a logical upgrade with a milestone release, see Logical Upgrade.

Note

MySQL Installer does not support upgrades between *Community* releases and *Commercial* releases. If you require this type of upgrade, perform it using the ZIP archive approach.

#### Upgrading MySQL with MySQL Installer

Performing an upgrade with MySQL Installer is the best approach when the current server installation was performed with it and the upgrade is within the current release series. MySQL Installer does not support upgrades between release series, such as from 5.6 to 5.7, and it does not provide an upgrade indicator to prompt you to upgrade. For instructions on upgrading between release series, see Upgrading MySQL Using the Windows ZIP Distribution.

To perform an upgrade using MySQL Installer:

1. Start MySQL Installer.
2. From the dashboard, click Catalog to download the latest changes to the catalog. The installed server can be upgraded only if the dashboard displays an arrow next to the version number of the server.

3. Click Upgrade. All products that have a newer version now appear in a list.

   Note

   MySQL Installer deselects the server upgrade option for milestone releases (Pre-Release) in the same release series. In addition, it displays a warning to indicate that the upgrade is not supported, identifies the risks of continuing, and provides a summary of the steps to perform a logical upgrade manually. You can reselect server upgrade and proceed at your own risk.

4. Deselect all but the MySQL server product, unless you intend to upgrade other products at this time, and click Next.

5. Click Execute to start the download. When the download finishes, click Next to begin the upgrade operation.

6. Configure the server.

#### Upgrading MySQL Using the Windows ZIP Distribution

To perform an upgrade using the Windows ZIP archive distribution:

1. Download the latest Windows ZIP Archive distribution of MySQL from <https://dev.mysql.com/downloads/>.

2. If the server is running, stop it. If the server is installed as a service, stop the service with the following command from the command prompt:

   ```sql
   C:\> SC STOP mysqld_service_name
   ```

   Alternatively, use **NET STOP *`mysqld_service_name`***.

   If you are not running the MySQL server as a service, use **mysqladmin** to stop it. For example, before upgrading from MySQL 5.6 to 5.7, use **mysqladmin** from MySQL 5.6 as follows:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.6\bin\mysqladmin" -u root shutdown
   ```

   Note

   If the MySQL `root` user account has a password, invoke **mysqladmin** with the `-p` option and enter the password when prompted.

3. Extract the ZIP archive. You may either overwrite your existing MySQL installation (usually located at `C:\mysql`), or install it into a different directory, such as `C:\mysql5`. Overwriting the existing installation is recommended.

4. Restart the server. For example, use the **SC START *`mysqld_service_name`*** or **NET START *`mysqld_service_name`*** command if you run MySQL as a service, or invoke `mysqld` directly otherwise.

5. As Administrator, run `mysqld_upgrade` to check your tables, attempt to repair them if necessary, and update your grant tables if they have changed so that you can take advantage of any new capabilities. See Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”.

6. If you encounter errors, see Section 2.3.5, “Troubleshooting a Microsoft Windows MySQL Server Installation”.

### 2.10.9 Upgrading a Docker Installation of MySQL

To upgrade a Docker installation of MySQL, refer to Upgrading a MySQL Server Container.

### 2.10.10 Upgrading MySQL with Directly-Downloaded RPM Packages

It is preferable to use the MySQL Yum repository or [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/) to upgrade MySQL on RPM-based platforms. However, if you have to upgrade MySQL using the RPM packages downloaded directly from the [MySQL Developer Zone](https://dev.mysql.com/) (see Section 2.5.5, “Installing MySQL on Linux Using RPM Packages from Oracle” for information on the packages), go to the folder that contains all the downloaded packages (and, preferably, no other RPM packages with similar names), and issue the following command:

```sql
yum install mysql-community-{server,client,common,libs}-*
```

Replace **yum** with **zypper** for SLES systems, and with **dnf** for dnf-enabled systems.

While it is much preferable to use a high-level package management tool like **yum** to install the packages, users who preferred direct **rpm** commands can replace the **yum install** command with the **rpm -Uvh** command; however, using **rpm -Uvh** instead makes the installation process more prone to failure, due to potential dependency issues the installation process might run into.

For an upgrade installation using RPM packages, the MySQL server is automatically restarted at the end of the installation if it was running when the upgrade installation began. If the server was not running when the upgrade installation began, you have to restart the server yourself after the upgrade installation is completed; do that with, for example, the follow command:

```sql
service mysqld start
```

Once the server restarts, run `mysqld_upgrade` to check and possibly resolve any incompatibilities between the old data and the upgraded software. `mysqld_upgrade` also performs other functions; see Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables” for details.

Note

Because of the dependency relationships among the RPM packages, all of the installed packages must be of the same version. Therefore, always update all your installed packages for MySQL. For example, do not just update the server without also upgrading the client, the common files for server and client libraries, and so on.

**Migration and Upgrade from installations by older RPM packages.** Some older versions of MySQL Server RPM packages have names in the form of MySQL-\* (for example, MySQL-server-\* and MySQL-client-\*). The latest versions of RPMs, when installed using the standard package management tool (**yum**, **dnf**, or **zypper**), seamlessly upgrade those older installations, making it unnecessary to uninstall those old packages before installing the new ones. Here are some differences in behavior between the older and the current RPM packages:

**Table 2.16 Differences Between the Previous and the Current RPM Packages for Installing MySQL**

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Behavior of Previous Packages</th>
      <th>Behavior of Current Packages</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Service starts after installation is finished</th>
      <td>Yes</td>
      <td>No, unless it is an upgrade installation, and the server was running when the upgrade began.</td>
    </tr>
    <tr>
      <th>Service name</th>
      <td>mysql</td>
      <td>
        For RHEL, Oracle Linux, CentOS, and Fedora: <strong>mysqld</strong> 
        For SLES: <strong>mysql</strong> 
      </td>
    </tr>
    <tr>
      <th>Error log file</th>
      <td>At <code>/var/lib/mysql/<code>hostname</code>.err</code></td>
      <td>
         For RHEL, Oracle Linux, CentOS, and Fedora: at <code>/var/log/mysqld.log</code> 
         For SLES: at <code>/var/log/mysql/mysqld.log</code> 
      </td>
    </tr>
    <tr>
      <th>Shipped with the <code>/etc/my.cnf</code> file</th>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>Multilib support</th>
      <td>No</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>

Note

Installation of previous versions of MySQL using older packages might have created a configuration file named `/usr/my.cnf`. It is highly recommended that you examine the contents of the file and migrate the desired settings inside to the file `/etc/my.cnf` file, then remove `/usr/my.cnf`.

**Upgrading to MySQL Enterprise Server.** Upgrading from a community version to a commercial version of MySQL requires that you first uninstall the community version and then install the commercial version. In this case, you must restart the server manually after the upgrade.

**Interoperability with operating system native MySQL packages.** Many Linux distributions ship MySQL as an integrated part of the operating system. The latest versions of RPMs from Oracle, when installed using the standard package management tool (**yum**, **dnf**, or **zypper**), seamlessly upgrades and replaces the version of MySQL that comes with the operating system, and the package manager automatically replaces system compatibility packages such as `mysql-community-libs-compat` with the relevant new versions.

**Upgrading from non-native MySQL packages.** If you have installed MySQL with third-party packages NOT from your Linux distribution's native software repository (for example, packages directly downloaded from the vendor), you must uninstall all those packages before you can upgrade using the packages from Oracle.

### 2.10.11 Upgrade Troubleshooting

* If problems occur, such as that the new `mysqld` server does not start, verify that you do not have an old `my.cnf` file from your previous installation. You can check this with the `--print-defaults` option (for example, **mysqld --print-defaults**). If this command displays anything other than the program name, you have an active `my.cnf` file that affects server or client operation.

* If, after an upgrade, you experience problems with compiled client programs, such as `Commands out of sync` or unexpected core dumps, you probably have used old header or library files when compiling your programs. In this case, check the date for your `mysql.h` file and `libmysqlclient.a` library to verify that they are from the new MySQL distribution. If not, recompile your programs with the new headers and libraries. Recompilation might also be necessary for programs compiled against the shared client library if the library major version number has changed (for example, from `libmysqlclient.so.15` to `libmysqlclient.so.16`).

* If you have created a loadable function with a given name and upgrade MySQL to a version that implements a new built-in function with the same name, the loadable function becomes inaccessible. To correct this, use `DROP FUNCTION` to drop the loadable function, and then use `CREATE FUNCTION` to re-create the loadable function with a different nonconflicting name. The same is true if the new version of MySQL implements a built-in function with the same name as an existing stored function. See Section 9.2.5, “Function Name Parsing and Resolution”, for the rules describing how the server interprets references to different kinds of functions.

### 2.10.12 Rebuilding or Repairing Tables or Indexes

This section describes how to rebuild or repair tables or indexes, which may be necessitated by:

* Changes to how MySQL handles data types or character sets. For example, an error in a collation might have been corrected, necessitating a table rebuild to update the indexes for character columns that use the collation.

* Required table repairs or upgrades reported by `CHECK TABLE`, **mysqlcheck**, or `mysqld_upgrade`.

Methods for rebuilding a table include:

* Dump and Reload Method
* ALTER TABLE Method
* REPAIR TABLE Method

#### Dump and Reload Method

If you are rebuilding tables because a different version of MySQL cannot handle them after a binary (in-place) upgrade or downgrade, you must use the dump-and-reload method. Dump the tables *before* upgrading or downgrading using your original version of MySQL. Then reload the tables *after* upgrading or downgrading.

If you use the dump-and-reload method of rebuilding tables only for the purpose of rebuilding indexes, you can perform the dump either before or after upgrading or downgrading. Reloading still must be done afterward.

If you need to rebuild an `InnoDB` table because a `CHECK TABLE` operation indicates that a table upgrade is required, use **mysqldump** to create a dump file and **mysql** to reload the file. If the `CHECK TABLE` operation indicates that there is a corruption or causes `InnoDB` to fail, refer to Section 14.22.2, “Forcing InnoDB Recovery” for information about using the `innodb_force_recovery` option to restart `InnoDB`. To understand the type of problem that `CHECK TABLE` may be encountering, refer to the `InnoDB` notes in Section 13.7.2.2, “CHECK TABLE Statement”.

To rebuild a table by dumping and reloading it, use **mysqldump** to create a dump file and **mysql** to reload the file:

```sql
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

To rebuild all the tables in a single database, specify the database name without any following table name:

```sql
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

To rebuild all tables in all databases, use the `--all-databases` option:

```sql
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

#### ALTER TABLE Method

To rebuild a table with `ALTER TABLE`, use a “null” alteration; that is, an `ALTER TABLE` statement that “changes” the table to use the storage engine that it already has. For example, if `t1` is an `InnoDB` table, use this statement:

```sql
ALTER TABLE t1 ENGINE = InnoDB;
```

If you are not sure which storage engine to specify in the `ALTER TABLE` statement, use `SHOW CREATE TABLE` to display the table definition.

#### REPAIR TABLE Method

The `REPAIR TABLE` method is only applicable to `MyISAM`, `ARCHIVE`, and `CSV` tables.

You can use `REPAIR TABLE` if the table checking operation indicates that there is a corruption or that an upgrade is required. For example, to repair a `MyISAM` table, use this statement:

```sql
REPAIR TABLE t1;
```

**mysqlcheck --repair** provides command-line access to the `REPAIR TABLE` statement. This can be a more convenient means of repairing tables because you can use the `--databases` or `--all-databases` option to repair all tables in specific databases or all databases, respectively:

```sql
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```

### 2.10.13 Copying MySQL Databases to Another Machine

In cases where you need to transfer databases between different architectures, you can use **mysqldump** to create a file containing SQL statements. You can then transfer the file to the other machine and feed it as input to the **mysql** client.

Use **mysqldump --help** to see what options are available.

The easiest (although not the fastest) way to move a database between two machines is to run the following commands on the machine on which the database is located:

```sql
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

If you want to copy a database from a remote machine over a slow network, you can use these commands:

```sql
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

You can also store the dump in a file, transfer the file to the target machine, and then load the file into the database there. For example, you can dump a database to a compressed file on the source machine like this:

```sql
mysqldump --quick db_name | gzip > db_name.gz
```

Transfer the file containing the database contents to the target machine and run these commands there:

```sql
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

You can also use **mysqldump** and **mysqlimport** to transfer the database. For large tables, this is much faster than simply using **mysqldump**. In the following commands, *`DUMPDIR`* represents the full path name of the directory you use to store the output from **mysqldump**.

First, create the directory for the output files and dump the database:

```sql
mkdir DUMPDIR
mysqldump --tab=DUMPDIR db_name
```

Then transfer the files in the *`DUMPDIR`* directory to some corresponding directory on the target machine and load the files into MySQL there:

```sql
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name DUMPDIR/*.txt   # load data into tables
```

Do not forget to copy the `mysql` database because that is where the grant tables are stored. You might have to run commands as the MySQL `root` user on the new machine until you have the `mysql` database in place.

After you import the `mysql` database on the new machine, execute **mysqladmin flush-privileges** so that the server reloads the grant table information.

Note

You can copy the `.frm`, `.MYI`, and `.MYD` files for `MyISAM` tables between different architectures that support the same floating-point format. (MySQL takes care of any byte-swapping issues.) See Section 15.2, “The MyISAM Storage Engine”.

