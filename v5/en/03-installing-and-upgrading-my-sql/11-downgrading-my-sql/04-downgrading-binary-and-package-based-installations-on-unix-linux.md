### 2.11.4 Downgrading Binary and Package-based Installations on Unix/Linux

This section describes how to downgrade MySQL binary and package-based installations on Unix/Linux. In-place and logical downgrade methods are described.

* In-Place Downgrade
* Logical Downgrade

#### In-Place Downgrade

In-place downgrade involves shutting down the new MySQL version, replacing the new MySQL binaries or packages with the old ones, and restarting the old MySQL version on the existing data directory.

In-place downgrade is supported for downgrades between GA releases within the same release series.

In-place downgrade is not supported for MySQL APT, SLES, and Yum repository installations.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

To perform an in-place downgrade:

1. Review the information in Section 2.11.1, “Before You Begin”.

2. If you use XA transactions with `InnoDB`, run `XA RECOVER` before downgrading to check for uncommitted XA transactions. If results are returned, either commit or rollback the XA transactions by issuing an `XA COMMIT` or `XA ROLLBACK` statement.

3. Configure MySQL to perform a slow shutdown by setting `innodb_fast_shutdown` to `0`. For example:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   With a slow shutdown, `InnoDB` performs a full purge and change buffer merge before shutting down, which ensures that data files are fully prepared in case of file format differences between releases.

4. Shut down the newer MySQL server. For example:

   ```sql
   mysqladmin -u root -p shutdown
   ```

5. After the slow shutdown, remove the `InnoDB` redo log files (the `ib_logfile*` files) from the `data` directory to avoid downgrade issues related to redo log file format changes that may have occurred between releases.

   ```sql
   rm ib_logfile*
   ```

6. Downgrade the MySQL binaries or packages in-place by replacing the newer binaries or packages with the older ones.

7. Start the older (downgraded) MySQL server, using the existing data directory. For example:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

8. Run **mysql\_upgrade**. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   **mysql\_upgrade** examines all tables in all databases for incompatibilities with the current version of MySQL, and attempts to repair the tables if problems are found.

9. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

#### Logical Downgrade

Logical downgrade involves using **mysqldump** to dump all tables from the new MySQL version, and then loading the dump file into the old MySQL version.

Logical downgrades are supported for downgrades between releases within the same release series and for downgrades to the previous release level. Only downgrades between General Availability (GA) releases are supported. Before proceeding, review Section 2.11.1, “Before You Begin”.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

For MySQL APT, SLES, and Yum repository installations, only downgrades to the previous release level are supported. Where the instructions call for initializing an older instance, use the package management utility to remove MySQL 5.7 packages and install MySQL 5.6 packages.

To perform a logical downgrade:

1. Review the information in Section 2.11.1, “Before You Begin”.

2. Dump all databases. For example:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-downgrade.sql
   ```

3. Shut down the newer MySQL server. For example:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. To initialize a MySQL 5.7 instance, use **mysqld** with the `--initialize` or `--initialize-insecure` option.

   ```sql
   mysqld --initialize --user=mysql
   ```

5. Start the older MySQL server, using the new data directory. For example:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```

6. Load the dump file into the older MySQL server. For example:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

7. Run **mysql\_upgrade**. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   **mysql\_upgrade** examines all tables in all databases for incompatibilities with the current version of MySQL, and attempts to repair the tables if problems are found.

8. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```
