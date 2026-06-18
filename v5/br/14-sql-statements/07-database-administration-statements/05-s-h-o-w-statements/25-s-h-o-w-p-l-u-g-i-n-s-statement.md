#### 13.7.5.25 SHOW PLUGINS Statement

```sql
SHOW PLUGINS
```

O comando `SHOW PLUGINS` exibe informações sobre os plugins do server.

Exemplo da saída de `SHOW PLUGINS`:

```sql
mysql> SHOW PLUGINS\G
*************************** 1. row ***************************
   Name: binlog
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 2. row ***************************
   Name: CSV
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 3. row ***************************
   Name: MEMORY
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 4. row ***************************
   Name: MyISAM
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
...
```

A saída de `SHOW PLUGINS` possui estas colunas:

* `Name`

  O nome usado para se referir ao plugin em comandos como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `Status`

  O Status do plugin, sendo um de `ACTIVE`, `INACTIVE`, `DISABLED` ou `DELETED`.

* `Type`

  O Type do plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `Library`

  O nome do arquivo de biblioteca compartilhada (shared library) do plugin. Este é o nome usado para se referir ao arquivo do plugin em comandos como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da Library for `NULL`, o plugin está compilado internamente e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `License`

  Como o plugin é licenciado (por exemplo, `GPL`).

Para plugins instalados com `INSTALL PLUGIN`, os valores de `Name` e `Library` também são registrados na tabela de sistema `mysql.plugin`.

Para informações sobre as estruturas de dados de plugin que formam a base das informações exibidas por `SHOW PLUGINS`, consulte The MySQL Plugin API.

Informações do plugin também estão disponíveis na tabela `INFORMATION_SCHEMA.PLUGINS`. Consulte Seção 24.3.17, “The INFORMATION_SCHEMA PLUGINS Table”.