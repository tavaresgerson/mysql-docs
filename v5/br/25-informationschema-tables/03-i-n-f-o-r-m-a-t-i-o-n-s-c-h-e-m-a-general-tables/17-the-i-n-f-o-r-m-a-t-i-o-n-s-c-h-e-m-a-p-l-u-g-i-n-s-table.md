### 24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA

A tabela `PLUGINS` fornece informações sobre os Plugins do servidor.

A tabela `PLUGINS` possui as seguintes colunas:

* `PLUGIN_NAME`

  O nome usado para referenciar o Plugin em Statements como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

  A versão do descritor de tipo geral do Plugin.

* `PLUGIN_STATUS`

  O status do Plugin, sendo um dos seguintes: `ACTIVE`, `INACTIVE`, `DISABLED` ou `DELETED`.

* `PLUGIN_TYPE`

  O tipo de Plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

  A versão do descritor específico do tipo de Plugin.

* `PLUGIN_LIBRARY`

  O nome do arquivo de biblioteca compartilhada do Plugin. Este é o nome usado para referenciar o arquivo do Plugin em Statements como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o Plugin é compilado internamente e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

  A versão da interface API do Plugin.

* `PLUGIN_AUTHOR`

  O autor do Plugin.

* `PLUGIN_DESCRIPTION`

  Uma breve descrição do Plugin.

* `PLUGIN_LICENSE`

  Como o Plugin está licenciado (por exemplo, `GPL`).

* `LOAD_OPTION`

  Como o Plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

#### Notas

* `PLUGINS` é uma tabela `INFORMATION_SCHEMA` não padrão.

* Para Plugins instalados com `INSTALL PLUGIN`, os valores de `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

* Para obter informações sobre as estruturas de dados de Plugin que formam a base das informações na tabela `PLUGINS`, consulte The MySQL Plugin API.

As informações do Plugin também estão disponíveis por meio do Statement `SHOW PLUGINS`. Consulte Seção 13.7.5.25, “SHOW PLUGINS Statement”. Estes Statements são equivalentes:

```sql
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```
