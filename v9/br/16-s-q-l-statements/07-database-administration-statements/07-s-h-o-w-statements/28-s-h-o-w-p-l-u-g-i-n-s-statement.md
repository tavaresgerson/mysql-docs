#### 15.7.7.28 Declaração de PLUGINS

```
SHOW PLUGINS
```

`SHOW PLUGINS` exibe informações sobre os plugins do servidor.

Exemplo de saída de `SHOW PLUGINS`:

```
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

A saída de `SHOW PLUGINS` tem estas colunas:

* `Name`

  O nome usado para referenciar o plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `Status`

  O status do plugin, um dos valores `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING` ou `DELETED`.

* `Type`

  O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `Library`

  O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para referenciar o arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin é compilado e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `License`

  Como o plugin é licenciado (por exemplo, `GPL`).

Para plugins instalados com `INSTALL PLUGIN`, os valores `Name` e `Library` também são registrados na tabela de sistema `mysql.plugin`.

Para informações sobre as estruturas de dados do plugin que formam a base das informações exibidas por `SHOW PLUGINS`, consulte A API de Plugin do MySQL.

As informações sobre os plugins também estão disponíveis na tabela `INFORMATION_SCHEMA`.PLUGINS`. Consulte a Seção 28.3.27, “A Tabela INFORMATION\_SCHEMA PLUGINS”.