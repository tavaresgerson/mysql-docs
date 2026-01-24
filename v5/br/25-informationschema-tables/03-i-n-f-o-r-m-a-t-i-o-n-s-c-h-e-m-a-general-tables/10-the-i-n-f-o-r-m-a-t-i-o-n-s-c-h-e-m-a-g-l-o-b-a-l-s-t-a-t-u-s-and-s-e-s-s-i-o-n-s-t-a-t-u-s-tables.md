### 24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables

Note

The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the information available from the tables described here. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Note

Information available from the tables described here is also available from the Performance Schema. The `INFORMATION_SCHEMA` tables are deprecated in preference to the Performance Schema tables and are removed in MySQL 8.0. For advice on migrating away from the `INFORMATION_SCHEMA` tables to the Performance Schema tables, see [Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables").

The [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") and [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") tables provide information about server status variables. Their contents correspond to the information produced by the [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") and [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statements (see [Section 13.7.5.35, “SHOW STATUS Statement”](show-status.html "13.7.5.35 SHOW STATUS Statement")).

#### Notes

* The `VARIABLE_VALUE` column for each of these tables is defined as `VARCHAR(1024)`.
