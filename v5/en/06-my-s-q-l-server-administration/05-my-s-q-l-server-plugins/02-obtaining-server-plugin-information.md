### 5.5.2 Obtendo Informações de Plugins do Servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

* A tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema contém uma linha para cada plugin carregado. Quaisquer plugins que possuam um valor `PLUGIN_LIBRARY` de `NULL` são embutidos (built in) e não podem ser descarregados (unloaded).

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

* O comando [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") exibe uma linha para cada plugin carregado. Quaisquer plugins que possuam um valor `Library` de `NULL` são embutidos (built in) e não podem ser descarregados (unloaded).

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

* A tabela `mysql.plugin` mostra quais plugins foram registrados com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). A tabela contém apenas nomes de plugins e nomes de arquivos de library, portanto, ela não fornece tantas informações quanto a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou o comando [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement").