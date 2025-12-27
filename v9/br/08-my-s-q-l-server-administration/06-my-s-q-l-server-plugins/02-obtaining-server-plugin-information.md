### 7.6.2 Obter Informações sobre Plugins do Servidor

Existem várias maneiras de determinar quais plugins estão instalados no servidor:

* A tabela `PLUGINS` do Schema de Informações contém uma linha para cada plugin carregado. Aqueles que têm um valor `PLUGIN_LIBRARY` de `NULL` são construídos e não podem ser descarregados.

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

* A instrução `SHOW PLUGINS` exibe uma linha para cada plugin carregado. Aqueles que têm um valor `Library` de `NULL` são construídos e não podem ser descarregados.

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

* A tabela `mysql.plugin` mostra quais plugins foram registrados com `INSTALL PLUGIN`. A tabela contém apenas os nomes dos plugins e os nomes dos arquivos de biblioteca, portanto, não fornece tanta informação quanto a tabela `PLUGINS` ou a instrução `SHOW PLUGINS`.