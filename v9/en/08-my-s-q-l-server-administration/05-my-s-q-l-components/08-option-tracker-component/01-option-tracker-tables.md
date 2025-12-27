#### 7.5.8.1 Option Tracker Tables

The Option Tracker supplies option information in the form of two tables, listed here:

* `performance_schema.mysql_option`: For each option implemented by a component or plugin installed on the system, this Performance Schema table shows the name of the option, the name or the component or plugin that provides the associated feature, and whether this feature is currently enabled. This table is installed by executing `INSTALL COMPONENT 'file://component_option_tracker'`.

  This table, like other Performance Schema tables, is read-only, and thus cannot be updated or truncated by users.

  See Section 29.12.22.7, “The mysql\_option Table”, for more detailed information about this table, such as columns and their possible values.

* `mysql_option.option_usage`: Shows, for each option installed, the name of the associated feature, feature usage data in `JSON` format, and other information. This table is installed by executing the SQL script `option_tracker_install.sql`, and uninstalled by executing `option_tracker_uninstall.sql`, both found in the MySQL `share` directory.

  This table should be regarded as read-only. Reading `mysql_option.option_usage` requires the `OPTION_TRACKER_UPDATER` privilege or the `OPTION_TRACKER_OBSERVER` privilege.

  While it is possible to write to this table, *we strongly recommend that you not attempt to do so*.

  More detailed information about this table is given later in this section.

Important

`INSTALL COMPONENT 'file://component_option_tracker'` installs the component library and the Performance Schema `mysql_option` table, but does *not* install the `mysql_option.option_usage` table, which requires executing the installation SQL script found in the MySQL Server `share` directory as described in the next few paragraphs.

To perform a complete installation of the Option Tracker component, execute the installation script from the system shell like this:

```
$> mysql -uusername -ppassword < path/to/option_tracker_install.sql
```

(You may need to use additional options, such as `-h`, for the **mysql** client when running the installation script in this way, depending on the circumstances.)

Alternatively, you can execute the script from within a MySQL client session using the `source` or `\.` command, as shown here:

```
mysql> source path/to/option_tracker_install.sql

mysql> \. path/to/option_tracker_install.sql
```

The path is relative to the directory in which the **mysql** client is run.

For more information, see Section 6.5.1.5, “Executing SQL Statements from a Text File”.

The `mysql_option.option_usage` table provides usage information about options available in the MySQL Server, components, and plugins:

```
mysql> TABLE mysql_option.option_usage\G
*************************** 1. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Library
 USAGE_DATA: {"usedCounter": "2", "usedDate": "2025-03-11T17:08:31Z"}
*************************** 2. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Stored Program
 USAGE_DATA: {"usedCounter": "5", "usedDate": "2025-03-11T17:08:31Z"}
```

The `option_usage` table has the following columns:

* `CLUSTER_ID`

  The UUID of the MySQL Group Replication cluster of which this server is part. Currently left empty.

* `SERVER_ID`

  The server UUID if it is part of a MySQL Group Replication cluster . Currently left empty.

* `OPTION_NAME`

  The unique name of the feature.

* `USAGE_DATA`

  Option usage data in `JSON` object format. This data uses 2 keys, listed here:

  + `usedCounter`: An integer indicating the number of times the feature has been used.

  + `usedDate`: A UTC date and time indicating when the feature was most recently used.

  This information is persistent between server restarts, and may be present even though the corresponding option is not currently enabled (or even if it is not installed).

This table has a primary key on the `CLUSTER_ID`, `SERVER_ID`, and `OPTION_NAME` columns. The `OPTION_NAME` column value in this table for a given option is the same as the `OPTION_NAME` column value for the same feature in the `performance_schema.mysql_option` table. Thus, you can join the two tables in a manner similar to what is shown here:

```
mysql> SELECT * FROM performance_schema.mysql_option o
    -> JOIN mysql_option.option_usage u
    -> ON o.OPTION_NAME=u.OPTION_NAME\G
*************************** 1. row ***************************
     OPTION_NAME: JavaScript Library
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Library
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
*************************** 2. row ***************************
     OPTION_NAME: JavaScript Stored Program
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Stored Program
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
```

Unlike the Performance Schema `mysql_option` table, the `option_usage` table is writeable and can be updated using SQL statements.

In Group Replication, option usage data originates on the primary. It is neither written to the binary log nor replicated, but it is propagated to secondaries using the Group Replication protocol. Individual replicas can write their own option usage data into this table. This includes read/write nodes in Group Replication clusters; read-only nodes cannot write to this table.

User accounts must be granted the necessary privileges to access this table.
