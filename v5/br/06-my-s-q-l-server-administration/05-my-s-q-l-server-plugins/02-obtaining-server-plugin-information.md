### 5.5.2 Obter informações do plugin do servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

- A tabela Schema de Informações `PLUGINS` contém uma linha para cada plugin carregado. Aqueles que têm um valor `PLUGIN_LIBRARY` de `NULL` são integrados e não podem ser descarregados.

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

- A declaração `SHOW PLUGINS` exibe uma linha para cada plugin carregado. Qualquer um que tenha um valor `Library` de `NULL` é integrado e não pode ser descarregado.

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

- A tabela `mysql.plugin` mostra quais plugins foram registrados com `INSTALL PLUGIN`. A tabela contém apenas nomes de plugins e nomes de arquivos de biblioteca, portanto, não fornece tanta informação quanto a tabela `[PLUGINS]`(information-schema-plugins-table.html) ou a instrução `[SHOW PLUGINS]`(show-plugins.html).
