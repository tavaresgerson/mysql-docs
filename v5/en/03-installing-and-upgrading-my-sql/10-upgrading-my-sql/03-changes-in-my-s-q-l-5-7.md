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

* **Incompatible change**: The `INFORMATION_SCHEMA` has tables that contain system and status variable information (see Section 24.3.11, “The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables”, and Section 24.3.10, “The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables”). As of MySQL 5.7.6, the Performance Schema also contains system and status variable tables (see Section 25.12.13, “Performance Schema System Variable Tables”, and Section 25.12.14, “Performance Schema Status Variable Tables”). The Performance Schema tables are intended to replace the `INFORMATION_SCHEMA` tables, which are deprecated as of MySQL 5.7.6 and are removed in MySQL 8.0.

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

* **Incompatible change**: As of MySQL 5.7.6, for some Linux platforms, when MySQL is installed using RPM and Debian packages, server startup and shutdown now is managed using systemd rather than **mysqld_safe**, and **mysqld_safe** is not installed. This may require some adjustment to the manner in which you specify server options. For details, see Section 2.5.10, “Managing MySQL Server with systemd”.

* **Incompatible change**: In MySQL 5.7.5, the executable binary version of **mysql_install_db** is located in the `bin` installation directory, whereas the Perl version was located in the `scripts` installation directory. For upgrades from an older version of MySQL, you may find a version in both directories. To avoid confusion, remove the version in the `scripts` directory. For fresh installations of MySQL 5.7.5 or later, **mysql_install_db** is only found in the `bin` directory, and the `scripts` directory is no longer present. Applications that expect to find **mysql_install_db** in the `scripts` directory should be updated to look in the `bin` directory instead.

  The location of **mysql_install_db** becomes less material as of MySQL 5.7.6 because as of that version it is deprecated in favor of **mysqld --initialize** (or **mysqld --initialize-insecure**). See Section 2.9.1, “Initializing the Data Directory”

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

* **Incompatible change**: The `Password` column of the `mysql.user` system table was removed in MySQL 5.7.6. All credentials are stored in the `authentication_string` column, including those formerly stored in the `Password` column. If performing an in-place upgrade to MySQL 5.7.6 or later, run **mysql_upgrade** as directed by the in-place upgrade procedure to migrate the `Password` column contents to the `authentication_string` column.

  If performing a logical upgrade using a **mysqldump** dump file from a pre-5.7.6 MySQL installation, you must observe these conditions for the **mysqldump** command used to generate the dump file:

  + You must include the `--add-drop-table` option

  + You must not include the `--flush-privileges` option

  As outlined in the logical upgrade procedure, load the pre-5.7.6 dump file into the 5.7.6 (or later) server before running **mysql_upgrade**.

#### Server Changes

* **Incompatible change**: As of MySQL 5.7.5, support for passwords that use the older pre-4.1 password hashing format is removed, which involves the following changes. Applications that use any feature no longer supported must be modified.

  + The `mysql_old_password` authentication plugin that used pre-4.1 password hash values is removed. Accounts that use this plugin are disabled at startup and the server writes an “unknown plugin” message to the error log. For instructions on upgrading accounts that use this plugin, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”.

  + For the `old_passwords` system variable, a value of 1 (produce pre-4.1 hash values) is no longer permitted.

  + The `--secure-auth` option to the server and client programs is the default, but is now a no-op. It is deprecated;expect it to be removed in a future MySQL release.

  + The `--skip-secure-auth` option to the server and client programs is no longer supported and using it produces an error.

  + The `secure_auth` system variable permits only a value of 1; a value of 0 is no longer permitted.

  + The `OLD_PASSWORD()` function is removed.

* **Incompatible change**: In MySQL 5.6.6, the 2-digit `YEAR(2)` data type was deprecated. In MySQL 5.7.5, support for `YEAR(2)` is removed. Once you upgrade to MySQL 5.7.5 or higher, any remaining 2-digit `YEAR(2)` columns must be converted to 4-digit `YEAR` columns to become usable again. For conversion strategies, see Section 11.2.5, “2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR” Limitations and Migrating to 4-Digit YEAR"). Running **mysql_upgrade** after upgrading is one of the possible conversion strategies.

* As of MySQL 5.7.7, `CHECK TABLE ... FOR UPGRADE` reports a table as needing a rebuild if it contains old temporal columns in pre-5.6.4 format (`TIME`, `DATETIME`, and `TIMESTAMP` columns without support for fractional seconds precision) and the `avoid_temporal_upgrade` system variable is disabled. This helps **mysql_upgrade** to detect and upgrade tables containing old temporal columns. If `avoid_temporal_upgrade` is enabled, `FOR UPGRADE` ignores the old temporal columns present in the table; consequently, **mysql_upgrade** does not upgrade them.

  As of MySQL 5.7.7, `REPAIR TABLE` upgrades a table if it contains old temporal columns in pre-5.6.4 format and the `avoid_temporal_upgrade` system variable is disabled. If `avoid_temporal_upgrade` is enabled, `REPAIR TABLE` ignores the old temporal columns present in the table and does not upgrade them.

  To check for tables that contain such temporal columns and need a rebuild, disable `avoid_temporal_upgrade` before executing `CHECK TABLE ... FOR UPGRADE`.

  To upgrade tables that contain such temporal columns, disable `avoid_temporal_upgrade` before executing `REPAIR TABLE` or **mysql_upgrade**.

* **Incompatible change**: As of MySQL 5.7.2, the server requires account rows in the `mysql.user` system table to have a nonempty `plugin` column value and disables accounts with an empty value. This requires that you upgrade your `mysql.user` table to fill in all `plugin` values. As of MySQL 5.7.6, use this procedure:

  If you plan to upgrade using the data directory from your existing MySQL installation:

  1. Stop the old (MySQL 5.6) server
  2. Upgrade the MySQL binaries in place by replacing the old binaries with the new ones

  3. Start the MySQL 5.7 server normally (no special options)
  4. Run **mysql_upgrade** to upgrade the system tables

  5. Restart the MySQL 5.7 server

  If you plan to upgrade by reloading a dump file generated from your existing MySQL installation:

  1. To generate the dump file, run **mysqldump** with the `--add-drop-table` option and without the `--flush-privileges` option

  2. Stop the old (MySQL 5.6) server
  3. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  4. Start the MySQL 5.7 server normally (no special options)
  5. Reload the dump file (**mysql < *`dump_file`***)

  6. Run **mysql_upgrade** to upgrade the system tables

  7. Restart the MySQL 5.7 server

  Before MySQL 5.7.6, the procedure is more involved:

  If you plan to upgrade using the data directory from your existing MySQL installation:

  1. Stop the old (MySQL 5.6) server
  2. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  3. Restart the server with the `--skip-grant-tables` option to disable privilege checking

  4. Run **mysql_upgrade** to upgrade the system tables

  5. Restart the server normally (without `--skip-grant-tables`)

  If you plan to upgrade by reloading a dump file generated from your existing MySQL installation:

  1. To generate the dump file, run **mysqldump** without the `--flush-privileges` option

  2. Stop the old (MySQL 5.6) server
  3. Upgrade the MySQL binaries in place (replace the old binaries with the new ones)

  4. Restart the server with the `--skip-grant-tables` option to disable privilege checking

  5. Reload the dump file (**mysql < *`dump_file`***)

  6. Run **mysql_upgrade** to upgrade the system tables

  7. Restart the server normally (without `--skip-grant-tables`)

  **mysql_upgrade** runs by default as the MySQL `root` user. For the preceding procedures, if the `root` password is expired when you run **mysql_upgrade**, it displays a message informing you that your password is expired and that **mysql_upgrade** failed as a result. To correct this, reset the `root` password and run **mysql_upgrade** again:

  ```sql
  $> mysql -u root -p
  Enter password: ****  <- enter root password here
  mysql> ALTER USER USER() IDENTIFIED BY 'root-password'; # MySQL 5.7.6 and up
  mysql> SET PASSWORD = PASSWORD('root-password');        # Before MySQL 5.7.6
  mysql> quit

  $> mysql_upgrade -p
  Enter password: ****  <- enter root password here
  ```

  The password-resetting statement normally does not work if the server is started with `--skip-grant-tables`, but the first invocation of **mysql_upgrade** flushes the privileges, so when you run **mysql**, the statement is accepted.

  If **mysql_upgrade** itself expires the `root` password, you must reset the password again in the same manner.

  After following the preceding instructions, DBAs are advised also to convert accounts that use the `mysql_old_password` authentication plugin to use `mysql_native_password` instead, because support for `mysql_old_password` has been removed. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”.

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

  + To upgrade all `InnoDB` tables that use the generic partitioning handler to use the native partitioning handler instead, run **mysql_upgrade**.

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
