## 25.20 Migrating to Performance Schema System and Status Variable Tables

The `INFORMATION_SCHEMA` has tables that contain system and status variable information (see [Section 24.3.11, “The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"), and [Section 24.3.10, “The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables")). The Performance Schema also contains system and status variable tables (see [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), and [Section 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables")). The Performance Schema tables are intended to replace the `INFORMATION_SCHEMA` tables, which are deprecated as of MySQL 5.7.6 and are removed in MySQL 8.0.

This section describes the intended migration path away from the `INFORMATION_SCHEMA` system and status variable tables to the corresponding Performance Schema tables. Application developers should use this information as guidance regarding the changes required to access system and status variables in MySQL 5.7.6 and up as the `INFORMATION_SCHEMA` tables become deprecated and eventually are removed.

**MySQL 5.6**

In MySQL 5.6, system and status variable information is available from these `SHOW` statements:

```sql
SHOW VARIABLES
SHOW STATUS
```

And from these `INFORMATION_SCHEMA` tables:

```sql
INFORMATION_SCHEMA.GLOBAL_VARIABLES
INFORMATION_SCHEMA.SESSION_VARIABLES

INFORMATION_SCHEMA.GLOBAL_STATUS
INFORMATION_SCHEMA.SESSION_STATUS
```

**MySQL 5.7**

As of MySQL 5.7.6, the Performance Schema includes these tables as new sources of system and status variable information:

```sql
performance_schema.global_variables
performance_schema.session_variables
performance_schema.variables_by_thread

performance_schema.global_status
performance_schema.session_status
performance_schema.status_by_thread
performance_schema.status_by_account
performance_schema.status_by_host
performance_schema.status_by_user
```

MySQL 5.7.6 also adds a [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable to control how the server makes system and status variable information available.

When [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `ON`, compatibility with MySQL 5.6 is enabled. The older system and status variable sources (`SHOW` statements, `INFORMATION_SCHEMA` tables) are available with semantics identical to MySQL 5.6. Applications should run as is, with no code changes, and should see the same variable names and values as in MySQL 5.6. Warnings occur under these circumstances:

* A deprecation warning is raised when selecting from the `INFORMATION_SCHEMA` tables.

* In MySQL 5.7.6 and 5.7.7, a deprecation warning is raised when using a `WHERE` clause with the `SHOW` statements. This behavior does not occur as of MySQL 5.7.8.

When [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `OFF`, compatibility with MySQL 5.6 is disabled and several changes result. Applications must be revised as follows to run properly:

* Selecting from the `INFORMATION_SCHEMA` tables produces an error. Applications that access the `INFORMATION_SCHEMA` tables should be revised to use the corresponding Performance Schema tables instead.

  Before MySQL 5.7.9, selecting from the `INFORMATION_SCHEMA` tables produces an empty result set plus a deprecation warning. This was not sufficient notice to signal the need to migrate to the corresponding Performance Schema system and status variable tables for the case that [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56). Producing an error in MySQL 5.7.9 and higher makes it more evident that an application is operating under conditions that require modification, as well as where the problem lies.

  In MySQL 5.7.6 and 5.7.7, the Performance Schema [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") and [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") tables do not fully reflect all variable values in effect for the current session; they include no rows for global variables that have no session counterpart. This is corrected in MySQL 5.7.8.

* Output for the `SHOW` statements is produced using the underlying Performance Schema tables. Applications written to use these statements can still use them, but it is best to use MySQL 5.7.8 or higher. In MySQL 5.7.6 and 5.7.7, the results may differ:

  + `SHOW [SESSION] VARIABLES` output does not include global variables that have no session counterpart.

  + Using a `WHERE` clause with the `SHOW` statements produces an error.

* These `Slave_xxx` status variables become unavailable through [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"):

  ```sql
  Slave_heartbeat_period
  Slave_last_heartbeat
  Slave_received_heartbeats
  Slave_retried_transactions
  Slave_running
  ```

  Applications that use these status variables should be revised to obtain this information using the replication-related Performance Schema tables. For details, see [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

* The Performance Schema does not collect statistics for `Com_xxx` status variables in the status variable tables. To obtain global and per-session statement execution counts, use the [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") and [`events_statements_summary_by_thread_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") tables, respectively.

**Migration and Privileges**

Initially, with the introduction of Performance Schema system and status variable tables in MySQL 5.7.6, access to those tables required the [`SELECT`](privileges-provided.html#priv_select) privilege, just as for other Performance Schema tables. However, this had the consequence that when [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56), the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statements also required the [`SELECT`](privileges-provided.html#priv_select) privilege: With compatibility disabled, output for those statements was taken from the Performance Schema [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"), and [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") tables.

As of MySQL 5.7.9, those Performance Schema tables are world readable and accessible without the [`SELECT`](privileges-provided.html#priv_select) privilege. Consequently, [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") do not require privileges on the underlying Performance Schema tables from which their output is produced when [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56).

**Beyond MySQL 5.7**

In a MySQL 8.0, the `INFORMATION_SCHEMA` variable tables and the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable are removed, and output from the `SHOW` statements is always based on the underlying Performance Schema tables.

Applications that have been revised to work in MySQL 5.7 when [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56) should work without further changes, except that it is not possible to test or set [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) because it does not exist.
