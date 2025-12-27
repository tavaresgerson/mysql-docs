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

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

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

6. Run **mysql\_upgrade**. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   **mysql\_upgrade** examines all tables in all databases for incompatibilities with the current version of MySQL. **mysql\_upgrade** also upgrades the `mysql` system database so that you can take advantage of new privileges or capabilities.

   Note

   **mysql\_upgrade** does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

7. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

#### Logical Upgrade

A logical upgrade involves exporting SQL from the old MySQL instance using a backup or export utility such as **mysqldump** or **mysqlpump**, installing the new MySQL server, and applying the SQL to your new MySQL instance.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld\_safe** is not installed. In such cases, use systemd for server startup and shutdown instead of the methods used in the following instructions. See Section 2.5.10, “Managing MySQL Server with systemd”.

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

9. Run **mysql\_upgrade**. For example:

   ```sql
   mysql_upgrade -u root -p
   ```

   **mysql\_upgrade** examines all tables in all databases for incompatibilities with the current version of MySQL. **mysql\_upgrade** also upgrades the `mysql` system database so that you can take advantage of new privileges or capabilities.

   Note

   **mysql\_upgrade** does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

10. Shut down and restart the MySQL server to ensure that any changes made to the system tables take effect. For example:

    ```sql
    mysqladmin -u root -p shutdown
    mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
    ```
