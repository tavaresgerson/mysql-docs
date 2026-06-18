#### 15.7.7.25. EXIBIR PLUGINS Declaração

```
SHOW PLUGINS
```

`SHOW PLUGINS` exibe informações sobre os plugins do servidor.

Exemplo de saída do `SHOW PLUGINS`:

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

A saída `SHOW PLUGINS` tem essas colunas:

- `Name`

  O nome usado para se referir ao plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

- `Status`

  O status do plugin, um dos `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING` ou `DELETED`.

- `Type`

  O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

- `Library`

  O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para referenciar o arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin será compilado e não poderá ser desinstalado com `UNINSTALL PLUGIN`.

- `License`

  Como o plugin está licenciado (por exemplo, `GPL`).

Para os plugins instalados com `INSTALL PLUGIN`, os valores `Name` e `Library` também são registrados na tabela do sistema `mysql.plugin`.

Para obter informações sobre as estruturas de dados dos plugins que formam a base das informações exibidas pelo `SHOW PLUGINS`, consulte a API do Plugin MySQL.

As informações dos plugins também estão disponíveis na tabela `INFORMATION_SCHEMA` `.PLUGINS`. Veja a Seção 28.3.22, “A Tabela INFORMATION\_SCHEMA PLUGINS”.
