### 7.6.2 Obtaining Server Plugin Information

There are several ways to determine which plugins are installed in the server:

* The Information Schema `PLUGINS` table contains a row for each loaded plugin. Any that have a `PLUGIN_LIBRARY` value of `NULL` are built in and cannot be unloaded.

  ```
  mysql> TABLE INFORMATION_SCHEMA.PLUGINS\G
  *************************** 1. row ***************************
             PLUGIN_NAME: binlog
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 90100.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: This is a pseudo storage engine to represent the binlog in a transaction
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  *************************** 2. row ***************************
             PLUGIN_NAME: sha256_password
          PLUGIN_VERSION: 1.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: AUTHENTICATION
     PLUGIN_TYPE_VERSION: 2.1
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: SHA256 password authentication
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  ...
  ```

* The `SHOW PLUGINS` statement displays a row for each loaded plugin. Any that have a `Library` value of `NULL` are built in and cannot be unloaded.

  ```
  mysql> SHOW PLUGINS\G
  *************************** 1. row ***************************
     Name: binlog
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: NULL
  License: GPL
  *************************** 2. row ***************************
     Name: sha256_password
   Status: ACTIVE
     Type: AUTHENTICATION
  Library: NULL
  License: GPL
  ...
  ```

* The `mysql.plugin` table shows which plugins have been registered with `INSTALL PLUGIN`. The table contains only plugin names and library file names, so it does not provide as much information as the `PLUGINS` table or the `SHOW PLUGINS` statement.
