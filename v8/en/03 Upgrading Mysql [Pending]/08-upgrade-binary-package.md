## 3.7 Upgrading MySQL Binary or Package-based Installations on Unix/Linux

This section describes how to upgrade MySQL binary and package-based installations on Unix/Linux. In-place and logical upgrade methods are described.

*  In-Place Upgrade
*  Logical Upgrade
*  MySQL Cluster Upgrade

### In-Place Upgrade

An in-place upgrade involves shutting down the old MySQL server, replacing the old MySQL binaries or packages with the new ones, restarting MySQL on the existing data directory, and upgrading any remaining parts of the existing installation that require upgrading. For details about what may need upgrading, see Section 3.4, “What the MySQL Upgrade Process Upgrades”.

::: info Note

If you are upgrading an installation originally produced by installing multiple RPM packages, upgrade all the packages, not just some. For example, if you previously installed the server and client RPMs, do not upgrade just the server RPM.

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.9, “Managing MySQL Server with systemd”.

For upgrades to MySQL Cluster installations, see also MySQL Cluster Upgrade.

:::

To perform an in-place upgrade:

1. Review the information in Section 3.1, “Before You Begin”.
2. Ensure the upgrade readiness of your installation by completing the preliminary checks in Section 3.6, “Preparing Your Installation for Upgrade”.
3. If you use XA transactions with `InnoDB`, run `XA RECOVER` before upgrading to check for uncommitted XA transactions. If results are returned, either commit or rollback the XA transactions by issuing an `XA COMMIT` or `XA ROLLBACK` statement.
4. If you normally run your MySQL server configured with `innodb_fast_shutdown` set to `2` (cold shutdown), configure it to perform a fast or slow shutdown by executing either of these statements:

   ```
   SET GLOBAL innodb_fast_shutdown = 1; -- fast shutdown
   SET GLOBAL innodb_fast_shutdown = 0; -- slow shutdown
   ```

   With a fast or slow shutdown, `InnoDB` leaves its undo logs and data files in a state that can be dealt with in case of file format differences between releases.
5. Shut down the old MySQL server. For example:

   ```
   mysqladmin -u root -p shutdown
   ```
6. Upgrade the MySQL binaries or packages. If upgrading a binary installation, unpack the new MySQL binary distribution package. See Obtain and Unpack the Distribution. For package-based installations, install the new packages.
7. Start the MySQL 8.4 server, using the existing data directory. For example:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

   If there are encrypted `InnoDB` tablespaces, use the `--early-plugin-load` option to load the keyring plugin.

   When you start the MySQL 8.4 server, it automatically detects whether data dictionary tables are present. If not, the server creates them in the data directory, populates them with metadata, and then proceeds with its normal startup sequence. During this process, the server upgrades metadata for all database objects, including databases, tablespaces, system and user tables, views, and stored programs (stored procedures and functions, triggers, and Event Scheduler events). The server also removes files that previously were used for metadata storage. For example, after upgrading from MySQL 8.3 to MySQL 8.4, you may notice that tables no longer have `.frm` files.

   If this step fails, the server reverts all changes to the data directory. In this case, you should remove all redo log files, start your MySQL 8.3 server on the same data directory, and fix the cause of any errors. Then perform another slow shutdown of the 8.3 server and start the MySQL 8.4 server to try again.
8. In the previous step, the server upgrades the data dictionary as necessary, making any changes required in the `mysql` system database between MySQL 8.3 and MySQL 8.4, so that you can take advantage of new privileges or capabilities. It also brings the Performance Schema, `INFORMATION_SCHEMA`, and `sys` databases up to date for MySQL 8.4, and examines all user databases for incompatibilities with the current version of MySQL. 

::: info Note

The upgrade process does not upgrade the contents of the time zone tables. For upgrade instructions, see Section 7.1.15, “MySQL Server Time Zone Support”.

:::

### Logical Upgrade

A logical upgrade involves exporting SQL from the old MySQL instance using a backup or export utility such as `mysqldump`, installing the new MySQL server, and applying the SQL to your new MySQL instance. For details about what may need upgrading, see Section 3.4, “What the MySQL Upgrade Process Upgrades”.

::: info Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.9, “Managing MySQL Server with systemd”.

::: 

Warning

Applying SQL extracted from a previous MySQL release to a new MySQL release may result in errors due to incompatibilities introduced by new, changed, deprecated, or removed features and capabilities. Consequently, SQL extracted from a previous MySQL release may require modification to enable a logical upgrade.

To identify incompatibilities before upgrading to the latest MySQL 8.4 release, perform the steps described in Section 3.6, “Preparing Your Installation for Upgrade”.

To perform a logical upgrade:

1. Review the information in Section 3.1, “Before You Begin”.
2. Export your existing data from the previous MySQL installation:

   ```
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   ::: info Note

   Use the  `--routines` and `--events` options with `mysqldump` (as shown above) if your databases include stored programs. The `--all-databases` option includes all databases in the dump, including the `mysql` database that holds the system tables.

   ::: 
   
   Important

   If you have tables that contain generated columns, use the `mysqldump` utility provided with MySQL 5.7.9 or higher to create your dump files. The `mysqldump` utility provided in earlier releases uses incorrect syntax for generated column definitions (Bug #20769542). You can use the Information Schema  `COLUMNS` table to identify tables with generated columns.
3. Shut down the old MySQL server. For example:

   ```
   mysqladmin -u root -p shutdown
   ```
4. Install MySQL 8.4. For installation instructions, see  Chapter 2, *Installing MySQL*.
5. Initialize a new data directory, as described in Section 2.9.1, “Initializing the Data Directory”. For example:

   ```
   mysqld --initialize --datadir=/path/to/8.4-datadir
   ```

   Copy the temporary `'root'@'localhost'` password displayed to your screen or written to your error log for later use.
6. Start the MySQL 8.4 server, using the new data directory. For example:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/8.4-datadir &
   ```
7. Reset the `root` password:

   ```
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```
8. Load the previously created dump file into the new MySQL server. For example:

   ```
   mysql -u root -p --force < data-for-upgrade.sql
   ```

   ::: info Note

   It is not recommended to load a dump file when GTIDs are enabled on the server ( `gtid_mode=ON`), if your dump file includes system tables. `mysqldump` issues DML instructions for the system tables which use the non-transactional MyISAM storage engine, and this combination is not permitted when GTIDs are enabled. Also be aware that loading a dump file from a server with GTIDs enabled, into another server with GTIDs enabled, causes different transaction identifiers to be generated.

   :::

9. Perform any remaining upgrade operations:

   Shut down the server, then restart it with the `--upgrade=FORCE` option to perform the remaining upgrade tasks:

   ```
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/8.4-datadir --upgrade=FORCE &
   ```

   Upon restart with `--upgrade=FORCE`, the server makes any changes required in the `mysql` system schema between MySQL 8.3 and MySQL 8.4, so that you can take advantage of new privileges or capabilities. It also brings the Performance Schema, `INFORMATION_SCHEMA`, and `sys` schema up to date for MySQL 8.4, and examines all user schemas for incompatibilities with the current version of MySQL. 
   
::: info Note

The upgrade process does not upgrade the contents of the time zone tables. For upgrade instructions, see Section 7.1.15, “MySQL Server Time Zone Support”.

:::

### MySQL Cluster Upgrade

The information in this section is an adjunct to the in-place upgrade procedure described in In-Place Upgrade, for use if you are upgrading MySQL Cluster.

A MySQL Cluster upgrade can be performed as a regular rolling upgrade, following the usual three ordered steps:

1. Upgrade MGM nodes.
2. Upgrade data nodes one at a time.
3. Upgrade API nodes one at a time (including MySQL servers).

There are two steps to upgrading each individual `mysqld`:

1. Import the data dictionary.

   Start the new server with the `--upgrade=MINIMAL` option to upgrade the data dictionary but not the system tables.

   The MySQL server must be connected to `NDB` for this phase to complete. If any `NDB` or `NDBINFO` tables exist, and the server cannot connect to the cluster, it exits with an error message:

   ```
   Failed to Populate DD tables.
   ```
2. Upgrade the system tables by restarting each individual `mysqld` without the `--upgrade=MINIMAL` option.

