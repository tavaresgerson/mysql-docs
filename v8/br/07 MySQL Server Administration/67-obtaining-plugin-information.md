### 7.6.2 Obtenção de informações sobre o plugin do servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

- A tabela de Esquema de Informação `PLUGINS` contém uma linha para cada plugin carregado. Qualquer que tenha um valor `PLUGIN_LIBRARY` de `NULL` é incorporado e não pode ser descarregado.

  ```
  mysql> TABLE INFORMATION_SCHEMA.PLUGINS\G
  *************************** 1. row ***************************
             PLUGIN_NAME: binlog
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 80100.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: This is a pseudo storage engine to represent the binlog in a transaction
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  *************************** 2. row ***************************
             PLUGIN_NAME: mysql_native_password
          PLUGIN_VERSION: 1.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: AUTHENTICATION
     PLUGIN_TYPE_VERSION: 2.1
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Native MySQL authentication
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: FORCE
  ...
  ```
- A instrução `SHOW PLUGINS` exibe uma linha para cada plugin carregado. Qualquer que tenha um valor `Library` de `NULL` é incorporado e não pode ser descarregado.

  ```
  mysql> SHOW PLUGINS\G
  *************************** 1. row ***************************
     Name: binlog
   Status: ACTIVE
     Type: STORAGE ENGINE
  Library: NULL
  License: GPL
  *************************** 2. row ***************************
     Name: mysql_native_password
   Status: ACTIVE
     Type: AUTHENTICATION
  Library: NULL
  License: GPL
  ...
  ```
- A tabela \[`mysql.plugin`] mostra quais plugins foram registrados com \[`INSTALL PLUGIN`]. A tabela contém apenas nomes de plugins e nomes de arquivos de biblioteca, então não fornece tantas informações quanto a tabela \[`PLUGINS`] ou a instrução \[`SHOW PLUGINS`].
