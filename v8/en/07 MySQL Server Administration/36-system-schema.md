## 7.3 The `mysql` System Schema

The `mysql` schema is the system schema. It contains tables that store information required by the MySQL server as it runs. A broad categorization is that the `mysql` schema contains data dictionary tables that store database object metadata, and system tables used for other operational purposes. The following discussion further subdivides the set of system tables into smaller categories.

*  Data Dictionary Tables
*  Grant System Tables
*  Object Information System Tables
*  Log System Tables
*  Server-Side Help System Tables
*  Time Zone System Tables
*  Replication System Tables
*  Optimizer System Tables
*  Miscellaneous System Tables

The remainder of this section enumerates the tables in each category, with cross references for additional information. Data dictionary tables and system tables use the `InnoDB` storage engine unless otherwise indicated.

`mysql` system tables and data dictionary tables reside in a single `InnoDB` tablespace file named `mysql.ibd` in the MySQL data directory. Previously, these tables were created in individual tablespace files in the `mysql` database directory.

Data-at-rest encryption can be enabled for the `mysql` system schema tablespace. For more information, see  Section 17.13, “InnoDB Data-at-Rest Encryption”.

### Data Dictionary Tables

These tables comprise the data dictionary, which contains metadata about database objects. For additional information, see Chapter 16, *MySQL Data Dictionary*.

* `catalogs`: Catalog information.
* `character_sets`: Information about available character sets.
* `check_constraints`: Information about `CHECK` constraints defined on tables. See Section 15.1.20.6, “CHECK Constraints”.
* `collations`: Information about collations for each character set.
* `column_statistics`: Histogram statistics for column values. See Section 10.9.6, “Optimizer Statistics”.
* `column_type_elements`: Information about types used by columns.
* `columns`: Information about columns in tables.
* `dd_properties`: A table that identifies data dictionary properties, such as its version. The server uses this to determine whether the data dictionary must be upgraded to a newer version.
* `events`: Information about Event Scheduler events. See  Section 27.4, “Using the Event Scheduler”. If the server is started with the `--skip-grant-tables` option, the event scheduler is disabled and events registered in the table do not run. See Section 27.4.2, “Event Scheduler Configuration”.
* `foreign_keys`, `foreign_key_column_usage`: Information about foreign keys.
* `index_column_usage`: Information about columns used by indexes.
* `index_partitions`: Information about partitions used by indexes.
* `index_stats`: Used to store dynamic index statistics generated when `ANALYZE TABLE` is executed.
* `indexes`: Information about table indexes.
* `innodb_ddl_log`: Stores DDL logs for crash-safe DDL operations.
* `parameter_type_elements`: Information about stored procedure and function parameters, and about return values for stored functions.
* `parameters`: Information about stored procedures and functions. See Section 27.2, “Using Stored Routines”.
* `resource_groups`: Information about resource groups. See  Section 7.1.16, “Resource Groups”.
* `routines`: Information about stored procedures and functions. See Section 27.2, “Using Stored Routines”.
* `schemata`: Information about schemata. In MySQL, a schema is a database, so this table provides information about databases.
* `st_spatial_reference_systems`: Information about available spatial reference systems for spatial data.
* `table_partition_values`: Information about values used by table partitions.
* `table_partitions`: Information about partitions used by tables.
* `table_stats`: Information about dynamic table statistics generated when `ANALYZE TABLE` is executed.
* `tables`: Information about tables in databases.
* `tablespace_files`: Information about files used by tablespaces.
* `tablespaces`: Information about active tablespaces.
* `triggers`: Information about triggers.
* `view_routine_usage`: Information about dependencies between views and stored functions used by them.
* `view_table_usage`: Used to track dependencies between views and their underlying tables.

Data dictionary tables are invisible. They cannot be read with `SELECT`, do not appear in the output of  `SHOW TABLES`, are not listed in the `INFORMATION_SCHEMA.TABLES` table, and so forth. However, in most cases there are corresponding `INFORMATION_SCHEMA` tables that can be queried. Conceptually, the `INFORMATION_SCHEMA` provides a view through which MySQL exposes data dictionary metadata. For example, you cannot select from the `mysql.schemata` table directly:

```
mysql> SELECT * FROM mysql.schemata;
ERROR 3554 (HY000): Access to data dictionary table 'mysql.schemata' is rejected.
```

Instead, select that information from the corresponding `INFORMATION_SCHEMA` table:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA\G
*************************** 1. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: mysql
DEFAULT_CHARACTER_SET_NAME: utf8mb4
    DEFAULT_COLLATION_NAME: utf8mb4_0900_ai_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
*************************** 2. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: information_schema
DEFAULT_CHARACTER_SET_NAME: utf8mb3
    DEFAULT_COLLATION_NAME: utf8mb3_general_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
*************************** 3. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: performance_schema
DEFAULT_CHARACTER_SET_NAME: utf8mb4
    DEFAULT_COLLATION_NAME: utf8mb4_0900_ai_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
...
```

There is no Information Schema table that corresponds exactly to `mysql.indexes`, but `INFORMATION_SCHEMA.STATISTICS` contains much of the same information.

As of yet, there are no `INFORMATION_SCHEMA` tables that correspond exactly to `mysql.foreign_keys`, `mysql.foreign_key_column_usage`. The standard SQL way to obtain foreign key information is by using the `INFORMATION_SCHEMA` `REFERENTIAL_CONSTRAINTS` and `KEY_COLUMN_USAGE` tables; these tables are now implemented as views on the `foreign_keys`, `foreign_key_column_usage`, and other data dictionary tables.

### Grant System Tables

These system tables contain grant information about user accounts and the privileges held by them. For additional information about the structure, contents, and purpose of the these tables, see  Section 8.2.3, “Grant Tables”.

The MySQL 8.4 grant tables are `InnoDB` (transactional) tables. Account-management statements are transactional and either succeed for all named users or roll back and have no effect if any error occurs.

* `user`: User accounts, global privileges, and other nonprivilege columns.
* `global_grants`: Assignments of dynamic global privileges to users; see Static Versus Dynamic Privileges.
* `db`: Database-level privileges.
* `tables_priv`: Table-level privileges.
* `columns_priv`: Column-level privileges.
* `procs_priv`: Stored procedure and function privileges.
* `proxies_priv`: Proxy-user privileges.
* `default_roles`: This table lists default roles to be activated after a user connects and authenticates, or executes `SET ROLE DEFAULT`.
* `role_edges`: This table lists edges for role subgraphs.

  A given `user` table row might refer to a user account or a role. The server can distinguish whether a row represents a user account, a role, or both by consulting the `role_edges` table for information about relations between authentication IDs.
* `password_history`: Information about password changes.

### Object Information System Tables

These system tables contain information about components, loadable functions, and server-side plugins:

* `component`: The registry for server components installed using `INSTALL COMPONENT`. Any components listed in this table are installed by a loader service during the server startup sequence. See  Section 7.5.1, “Installing and Uninstalling Components”.
* `func`: The registry for loadable functions installed using `CREATE FUNCTION`. During the normal startup sequence, the server loads functions registered in this table. If the server is started with the `--skip-grant-tables` option, functions registered in the table are not loaded and are unavailable. See  Section 7.7.1, “Installing and Uninstalling Loadable Functions”.

  ::: info Note

  Like the `mysql.func` system table, the Performance Schema `user_defined_functions` table lists loadable functions installed using `CREATE FUNCTION`. Unlike the `mysql.func` table, the `user_defined_functions` table also lists functions installed automatically by server components or plugins. This difference makes `user_defined_functions` preferable to `mysql.func` for checking which functions are installed. See Section 29.12.22.10, “The user_defined_functions Table”.

  :::

* `plugin`: The registry for server-side plugins installed using `INSTALL PLUGIN`. During the normal startup sequence, the server loads plugins registered in this table. If the server is started with the `--skip-grant-tables` option, plugins registered in the table are not loaded and are unavailable. See  Section 7.6.1, “Installing and Uninstalling Plugins”.

### Log System Tables

The server uses these system tables for logging:

* `general_log`: The general query log table.
* `slow_log`: The slow query log table.

Log tables use the `CSV` storage engine.

For more information, see  Section 7.4, “MySQL Server Logs”.

### Server-Side Help System Tables

These system tables contain server-side help information:

* `help_category`: Information about help categories.
* `help_keyword`: Keywords associated with help topics.
* `help_relation`: Mappings between help keywords and topics.
* `help_topic`: Help topic contents.

For more information, see Section 7.1.17, “Server-Side Help Support”.

### Time Zone System Tables

These system tables contain time zone information:

* `time_zone`: Time zone IDs and whether they use leap seconds.
* `time_zone_leap_second`: When leap seconds occur.
* `time_zone_name`: Mappings between time zone IDs and names.
* `time_zone_transition`, `time_zone_transition_type`: Time zone descriptions.

For more information, see  Section 7.1.15, “MySQL Server Time Zone Support”.

### Replication System Tables

The server uses these system tables to support replication:

* `gtid_executed`: Table for storing GTID values. See mysql.gtid_executed Table.
* `ndb_binlog_index`: Binary log information for NDB Cluster replication. This table is created only if the server is built with `NDBCLUSTER` support. See Section 25.7.4, “NDB Cluster Replication Schema and Tables”.
* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Used to store replication information on replica servers. See Section 19.2.4, “Relay Log and Replication Metadata Repositories”.

All of the tables just listed use the `InnoDB` storage engine.

### Optimizer System Tables

These system tables are for use by the optimizer:

* `innodb_index_stats`, `innodb_table_stats`: Used for `InnoDB` persistent optimizer statistics. See  Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”.
* `server_cost`, `engine_cost`: The optimizer cost model uses tables that contain cost estimate information about operations that occur during query execution. `server_cost` contains optimizer cost estimates for general server operations. `engine_cost` contains estimates for operations specific to particular storage engines. See Section 10.9.5, “The Optimizer Cost Model”.

### Miscellaneous System Tables

Other system tables do not fit the preceding categories:

* `audit_log_filter`, `audit_log_user`: If MySQL Enterprise Audit is installed, these tables provide persistent storage of audit log filter definitions and user accounts. See Audit Log Tables.
* `firewall_group_allowlist`, `firewall_groups`, `firewall_memebership`, `firewall_users`, `firewall_whitelist`: If MySQL Enterprise Firewall is installed, these tables provide persistent storage for information used by the firewall. See Section 8.4.7, “MySQL Enterprise Firewall”.
* `servers`: Used by the `FEDERATED` storage engine. See Section 18.8.2.2, “Creating a FEDERATED Table Using CREATE SERVER”.
* `innodb_dynamic_metadata`: Used by the `InnoDB` storage engine to store fast-changing table metadata such as auto-increment counter values and index tree corruption flags. Replaces the data dictionary buffer table that resided in the `InnoDB` system tablespace.
