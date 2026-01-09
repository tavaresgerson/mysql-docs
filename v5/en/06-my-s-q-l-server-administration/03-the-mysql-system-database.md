## 5.3 The mysql System Database

The `mysql` database is the system database. It contains tables that store information required by the MySQL server as it runs.

Tables in the `mysql` database fall into these categories:

* [Grant System Tables](system-schema.html#system-schema-grant-tables "Grant System Tables")
* [Object Information System Tables](system-schema.html#system-schema-object-tables "Object Information System Tables")
* [Log System Tables](system-schema.html#system-schema-log-tables "Log System Tables")
* [Server-Side Help System Tables](system-schema.html#system-schema-help-tables "Server-Side Help System Tables")
* [Time Zone System Tables](system-schema.html#system-schema-time-zone-tables "Time Zone System Tables")
* [Replication System Tables](system-schema.html#system-schema-replication-tables "Replication System Tables")
* [Optimizer System Tables](system-schema.html#system-schema-optimizer-tables "Optimizer System Tables")
* [Miscellaneous System Tables](system-schema.html#system-schema-miscellaneous-tables "Miscellaneous System Tables")

The remainder of this section enumerates the tables in each category, with cross references for additional information. System tables use the `MyISAM` storage engine unless otherwise indicated.

Warning

Do *not* convert MySQL system tables in the `mysql` database from `MyISAM` to `InnoDB` tables. This is an unsupported operation. If you do this, MySQL does not restart until you restore the old system tables from a backup or regenerate them by reinitializing the data directory (see [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")).

### Grant System Tables

These system tables contain grant information about user accounts and the privileges held by them:

* `user`: User accounts, global privileges, and other nonprivilege columns.

* `db`: Database-level privileges.
* `tables_priv`: Table-level privileges.
* `columns_priv`: Column-level privileges.
* `procs_priv`: Stored procedure and function privileges.

* `proxies_priv`: Proxy-user privileges.

For more information about the structure, contents, and purpose of the grant tables, see [Section 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables").

### Object Information System Tables

These system tables contain information about stored programs, loadable functions, and server-side plugins:

* `event`: The registry for Event Scheduler events installed using [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"). If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, the event scheduler is disabled and events registered in the table do not run. See [Section 23.4.2, “Event Scheduler Configuration”](events-configuration.html "23.4.2 Event Scheduler Configuration").

* `func`: The registry for loadable functions installed using [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). During the normal startup sequence, the server loads functions registered in this table. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, functions registered in the table are not loaded and are unavailable. See [Section 5.6.1, “Installing and Uninstalling Loadable Functions”](function-loading.html "5.6.1 Installing and Uninstalling Loadable Functions").

* `plugin`: The registry for server-side plugins installed using [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). During the normal startup sequence, the server loads plugins registered in this table. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, plugins registered in the table are not loaded and are unavailable. See [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

  The `plugin` table uses the `InnoDB` storage engine as of MySQL 5.7.6, `MyISAM` before that.

* `proc`: Information about stored procedures and functions. See [Section 23.2, “Using Stored Routines”](stored-routines.html "23.2 Using Stored Routines").

### Log System Tables

The server uses these system tables for logging:

* `general_log`: The general query log table.
* `slow_log`: The slow query log table.

Log tables use the `CSV` storage engine.

For more information, see [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

### Server-Side Help System Tables

These system tables contain server-side help information:

* `help_category`: Information about help categories.

* `help_keyword`: Keywords associated with help topics.

* `help_relation`: Mappings between help keywords and topics.

* `help_topic`: Help topic contents.

These tables use the `InnoDB` storage engine as of MySQL 5.7.5, `MyISAM` before that.

For more information, see [Section 5.1.14, “Server-Side Help Support”](server-side-help-support.html "5.1.14 Server-Side Help Support").

### Time Zone System Tables

These system tables contain time zone information:

* `time_zone`: Time zone IDs and whether they use leap seconds.

* `time_zone_leap_second`: When leap seconds occur.

* `time_zone_name`: Mappings between time zone IDs and names.

* `time_zone_transition`, `time_zone_transition_type`: Time zone descriptions.

These tables use the `InnoDB` storage engine as of MySQL 5.7.5, `MyISAM` before that.

For more information, see [Section 5.1.13, “MySQL Server Time Zone Support”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

### Replication System Tables

The server uses these system tables to support replication:

* `gtid_executed`: Table for storing GTID values. See [mysql.gtid_executed Table](replication-gtids-concepts.html#replication-gtids-gtid-executed-table "mysql.gtid_executed Table").

  The `gtid_executed` table uses the `InnoDB` storage engine.

* `ndb_binlog_index`: Binary log information for NDB Cluster replication. See [Section 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").

  Prior to NDB 7.5.2, this table employed the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine. In NDB 7.5.2 and later, it uses [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). If you are planning an upgrade from a NDB Cluster previous release to NDB 7.5.2 or later, see [Section 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), for important information relating to this change.

* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Used to store replication information on replica servers. See [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  All three of these tables use the `InnoDB` storage engine.

### Optimizer System Tables

These system tables are for use by the optimizer:

* `innodb_index_stats`, `innodb_table_stats`: Used for `InnoDB` persistent optimizer statistics. See [Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

* `server_cost`, `engine_cost`: The optimizer cost model uses tables that contain cost estimate information about operations that occur during query execution. `server_cost` contains optimizer cost estimates for general server operations. `engine_cost` contains estimates for operations specific to particular storage engines. See [Section 8.9.5, “The Optimizer Cost Model”](cost-model.html "8.9.5 The Optimizer Cost Model").

These tables use the `InnoDB` storage engine.

### Miscellaneous System Tables

Other system tables do not fall into the preceding categories:

* `audit_log_filter`, `audit_log_user`: If MySQL Enterprise Audit is installed, these tables provide persistent storage of audit log filter definitions and user accounts. See [Audit Log Tables](audit-log-reference.html#audit-log-tables "Audit Log Tables").

* `firewall_users`, `firewall_whitelist`: If MySQL Enterprise Firewall is installed, these tables provide persistent storage for information used by the firewall. See [Section 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* `servers`: Used by the `FEDERATED` storage engine. See [Section 15.8.2.2, “Creating a FEDERATED Table Using CREATE SERVER”](federated-create-server.html "15.8.2.2 Creating a FEDERATED Table Using CREATE SERVER").

  The `servers` table uses the `InnoDB` storage engine as of MySQL 5.7.6, `MyISAM` before that.
