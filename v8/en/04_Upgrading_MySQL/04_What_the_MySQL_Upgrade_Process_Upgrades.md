## 3.4 What the MySQL Upgrade Process Upgrades

Installing a new version of MySQL may require upgrading these parts of the existing installation:

* The `mysql` system schema, which contains tables that store information required by the MySQL server as it runs (see Section 7.3, “The mysql System Schema”). `mysql` schema tables fall into two broad categories:

  + Data dictionary tables, which store database object metadata.

  + System tables (that is, the remaining non-data dictionary tables), which are used for other operational purposes.

* Other schemas, some of which are built in and may be considered “owned” by the server, and others which are not:

  + The `performance_schema`, `INFORMATION_SCHEMA`, `ndbinfo`, and `sys` schemas.

  + User schemas.

Two distinct version numbers are associated with parts of the installation that may require upgrading:

* The data dictionary version. This applies to the data dictionary tables.

* The server version, also known as the MySQL version. This applies to the system tables and objects in other schemas.

In both cases, the actual version applicable to the existing MySQL installation is stored in the data dictionary, and the current expected version is compiled into the new version of MySQL. When an actual version is lower than the current expected version, those parts of the installation associated with that version must be upgraded to the current version. If both versions indicate an upgrade is needed, the data dictionary upgrade must occur first.

As a reflection of the two distinct versions just mentioned, the upgrade occurs in two steps:

* Step 1: Data dictionary upgrade.

  This step upgrades:

  + The data dictionary tables in the `mysql` schema. If the actual data dictionary version is lower than the current expected version, the server creates data dictionary tables with updated definitions, copies persisted metadata to the new tables, atomically replaces the old tables with the new ones, and reinitializes the data dictionary.

  + The Performance Schema, `INFORMATION_SCHEMA`, and `ndbinfo`.

* Step 2: Server upgrade.

  This step comprises all other upgrade tasks. If the server version of the existing MySQL installation is lower than that of the new installed MySQL version, everything else must be upgraded:

  + The system tables in the `mysql` schema (the remaining non-data dictionary tables).

  + The `sys` schema.
  + User schemas.

The data dictionary upgrade (step 1) is the responsibility of the server, which performs this task as necessary at startup unless invoked with an option that prevents it from doing so. The option is `--upgrade=NONE` as of MySQL 8.0.16, `--no-dd-upgrade` prior to MySQL 8.0.16.

If the data dictionary is out of date but the server is prevented from upgrading it, the server does not run, and exits with an error instead. For example:

```
[ERROR] [MY-013381] [Server] Server shutting down because upgrade is
required, yet prohibited by the command line option '--upgrade=NONE'.
[ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
[ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
```

Some changes to the responsibility for step 2 occurred in MySQL 8.0.16:

* Prior to MySQL 8.0.16, **mysql_upgrade** upgrades the Performance Schema, the `INFORMATION_SCHEMA`, and the objects described in step 2. The DBA is expected to invoke **mysql_upgrade** manually after starting the server.

* As of MySQL 8.0.16, the server performs all tasks previously handled by **mysql_upgrade**. Although upgrading remains a two-step operation, the server performs them both, resulting in a simpler process.

Depending on the version of MySQL to which you are upgrading, the instructions in In-Place Upgrade and Logical Upgrade indicate whether the server performs all upgrade tasks or whether you must also invoke **mysql_upgrade** after server startup.

Note

Because the server upgrades the Performance Schema, `INFORMATION_SCHEMA`, and the objects described in step 2 as of MySQL 8.0.16, **mysql_upgrade** is unneeded and is deprecated as of that version; expect it to be removed in a future version of MySQL.

Most aspects of what occurs during step 2 are the same prior to and as of MySQL 8.0.16, although different command options may be needed to achieve a particular effect.

As of MySQL 8.0.16, the `--upgrade` server option controls whether and how the server performs an automatic upgrade at startup:

* With no option or with `--upgrade=AUTO`, the server upgrades anything it determines to be out of date (steps 1 and 2).

* With `--upgrade=NONE`, the server upgrades nothing (skips steps 1 and 2), but also exits with an error if the data dictionary must be upgraded. It is not possible to run the server with an out-of-date data dictionary; the server insists on either upgrading it or exiting.

* With `--upgrade=MINIMAL`, the server upgrades the data dictionary, the Performance Schema, and the `INFORMATION_SCHEMA`, if necessary (step 1). Note that following an upgrade with this option, Group Replication cannot be started, because system tables on which the replication internals depend are not updated, and reduced functionality might also be apparent in other areas.

* With `--upgrade=FORCE`, the server upgrades the data dictionary, the Performance Schema, and the `INFORMATION_SCHEMA`, if necessary (step 1), and forces an upgrade of everything else (step 2). Expect server startup to take longer with this option because the server checks all objects in all schemas.

`FORCE` is useful to force step 2 actions to be performed if the server thinks they are not necessary. One way that `FORCE` differs from `AUTO` is that with `FORCE`, the server re-creates system tables such as help tables or time zone tables if they are missing.

The following list shows upgrade commands prior to MySQL 8.0.16 and the equivalent commands for MySQL 8.0.16 and higher:

* Perform a normal upgrade (steps 1 and 2 as necessary):

  + Prior to MySQL 8.0.16: **mysqld** followed by **mysql_upgrade**

  + As of MySQL 8.0.16: **mysqld**
* Perform only step 1 as necessary:

  + Prior to MySQL 8.0.16: It is not possible to perform all upgrade tasks described in step 1 while excluding those described in step 2. However, you can avoid upgrading user schemas and the `sys` schema using **mysqld** followed by **mysql_upgrade** with the `--upgrade-system-tables` and `--skip-sys-schema` options.

  + As of MySQL 8.0.16: **mysqld --upgrade=MINIMAL**

* Perform step 1 as necessary, and force step 2:

  + Prior to MySQL 8.0.16: **mysqld** followed by **mysql_upgrade --force**

  + As of MySQL 8.0.16: **mysqld --upgrade=FORCE**

Prior to MySQL 8.0.16, certain **mysql_upgrade** options affect the actions it performs. The following table shows which server `--upgrade` option values to use as of MySQL 8.0.16 to achieve similar effects. (These are not necessarily exact equivalents because a given `--upgrade` option value may have additional effects.)

<table summary="Server --upgrade option value equivalents to certain mysql_upgrade options."><thead><tr> <th>mysql_upgrade Option</th> <th>Server Option</th> </tr></thead><tbody><tr> <td><code>--skip-sys-schema</code></td> <td><code>--upgrade=NONE</code> or <code>--upgrade=MINIMAL</code></td> </tr><tr> <td><code>--upgrade-system-tables</code></td> <td><code>--upgrade=NONE</code> or <code>--upgrade=MINIMAL</code></td> </tr><tr> <td><code>--force</code></td> <td><code>--upgrade=FORCE</code></td> </tr></tbody></table>

Additional notes about what occurs during upgrade step 2:

* Step 2 installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. An error occurs if a `sys` schema exists but has no `version` view, on the assumption that its absence indicates a user-created schema:

  ```
  A sys schema exists with no sys.version view. If
  you have a user created sys schema, this must be renamed for the
  upgrade to succeed.
  ```

  To upgrade in this case, remove or rename the existing `sys` schema first. Then perform the upgrade procedure again. (It may be necessary to force step 2.)

  To prevent the `sys` schema check:

  + As of MySQL 8.0.16: Start the server with the `--upgrade=NONE` or `--upgrade=MINIMAL` option.

  + Prior to MySQL 8.0.16: Invoke **mysql_upgrade** with the `--skip-sys-schema` option.

* Step 2 upgrades the system tables to ensure that they have the current structure. This is true whether the server or **mysql_upgrade** performs the step. With respect to the content of the help tables and time zone tables, **mysql_upgrade** does not load either type of table, whereas the server loads the help tables, but not the time zone tables. (That is, prior to MySQL 8.0.16, the server loads the help tables only at data directory initialization time. As of MySQL 8.0.16, it loads the help tables at initialization and upgrade time.) The procedure for loading time zone tables is platform dependent and requires decision making by the DBA, so it cannot be done automatically.

* From MySQL 8.0.30, when Step 2 is upgrading the system tables in the `mysql` schema, the column order in the primary key of the `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv` and `mysql.procs_priv` tables is changed to place the host name and user name columns together. Placing the host name and user name together means that index lookup can be used, which improves performance for `CREATE USER`, `DROP USER`, and `RENAME USER` statements, and for ACL checks for multiple users with multiple privileges. Dropping and re-creating the index is necessary and might take some time if the system has a large number of users and privileges.

* Step 2 processes all tables in all user schemas as necessary. Table checking might take a long time to complete. Each table is locked and therefore unavailable to other sessions while it is being processed. Check and repair operations can be time-consuming, particularly for large tables. Table checking uses the `FOR UPGRADE` option of the `CHECK TABLE` statement. For details about what this option entails, see Section 15.7.3.2, “CHECK TABLE Statement”.

  To prevent table checking:

  + As of MySQL 8.0.16: Start the server with the `--upgrade=NONE` or `--upgrade=MINIMAL` option.

  + Prior to MySQL 8.0.16: Invoke **mysql_upgrade** with the `--upgrade-system-tables` option.

  To force table checking:

  + As of MySQL 8.0.16: Start the server with the `--upgrade=FORCE` option.

  + Prior to MySQL 8.0.16: Invoke **mysql_upgrade** with the `--force` option.

* Step 2 saves the MySQL version number in a file named `mysql_upgrade_info` in the data directory.

  To ignore the `mysql_upgrade_info` file and perform the check regardless:

  + As of MySQL 8.0.16: Start the server with the `--upgrade=FORCE` option.

  + Prior to MySQL 8.0.16: Invoke **mysql_upgrade** with the `--force` option.

  Note

  The `mysql_upgrade_info` file is deprecated; expect it to be removed in a future version of MySQL.

* Step 2 marks all checked and repaired tables with the current MySQL version number. This ensures that the next time upgrade checking occurs with the same version of the server, it can be determined whether there is any need to check or repair a given table again.
