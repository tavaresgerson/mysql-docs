### 24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables

Note

The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the information available from the tables described here. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Note

Information available from the tables described here is also available from the Performance Schema. The `INFORMATION_SCHEMA` tables are deprecated in preference to the Performance Schema tables and are removed in MySQL 8.0. For advice on migrating away from the `INFORMATION_SCHEMA` tables to the Performance Schema tables, see [Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables").

The [`GLOBAL_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") and [`SESSION_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") tables provide information about server status variables. Their contents correspond to the information produced by the [`SHOW GLOBAL VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW SESSION VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statements (see [Section 13.7.5.39, “SHOW VARIABLES Statement”](show-variables.html "13.7.5.39 SHOW VARIABLES Statement")).

#### Notes

* The `VARIABLE_VALUE` column for each of these tables is defined as `VARCHAR(1024)`. For variables with very long values that are not completely displayed, use [`SELECT`](select.html "13.2.9 SELECT Statement") as a workaround. For example:

  ```sql
  SELECT @@GLOBAL.innodb_data_file_path;
  ```
