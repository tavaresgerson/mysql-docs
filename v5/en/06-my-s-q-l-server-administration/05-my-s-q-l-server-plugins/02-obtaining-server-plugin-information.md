### 5.5.2 Obtaining Server Plugin Information

There are several ways to determine which plugins are installed in the server:

* The Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table contains a row for each loaded plugin. Any that have a `PLUGIN_LIBRARY` value of `NULL` are built in and cannot be unloaded.

  ```sql
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS\G
  *************************** 1. row ***************************
             PLUGIN_NAME: binlog
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50158.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: MySQL AB
      PLUGIN_DESCRIPTION: This is a pseudo storage engine to represent the binlog in a transaction
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  ...
  *************************** 10. row ***************************
             PLUGIN_NAME: InnoDB
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50158.0
          PLUGIN_LIBRARY: ha_innodb_plugin.so
  PLUGIN_LIBRARY_VERSION: 1.0
           PLUGIN_AUTHOR: Innobase Oy
      PLUGIN_DESCRIPTION: Supports transactions, row-level locking,
                          and foreign keys
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ...
  ```

* The [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement displays a row for each loaded plugin. Any that have a `Library` value of `NULL` are built in and cannot be unloaded.

  ```sql
  mysql> SHOW PLUGINS\G
  *************************** 1. row ***************************
     Name: binlog
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: NULL
  License: GPL
  ...
  *************************** 10. row ***************************
     Name: InnoDB
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: ha_innodb_plugin.so
  License: GPL
  ...
  ```

* The `mysql.plugin` table shows which plugins have been registered with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). The table contains only plugin names and library file names, so it does not provide as much information as the [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement.
