### 24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA

A tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA") fornece informações sobre os Plugins do servidor.

A tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA") possui as seguintes colunas:

* `PLUGIN_NAME`

  O nome usado para referenciar o Plugin em Statements como [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") e [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

* `PLUGIN_VERSION`

  A versão do descritor de tipo geral do Plugin.

* `PLUGIN_STATUS`

  O status do Plugin, sendo um dos seguintes: `ACTIVE`, `INACTIVE`, `DISABLED` ou `DELETED`.

* `PLUGIN_TYPE`

  O tipo de Plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

  A versão do descritor específico do tipo de Plugin.

* `PLUGIN_LIBRARY`

  O nome do arquivo de biblioteca compartilhada do Plugin. Este é o nome usado para referenciar o arquivo do Plugin em Statements como [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") e [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"). Este arquivo está localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir). Se o nome da biblioteca for `NULL`, o Plugin é compilado internamente e não pode ser desinstalado com [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

* `PLUGIN_LIBRARY_VERSION`

  A versão da interface API do Plugin.

* `PLUGIN_AUTHOR`

  O autor do Plugin.

* `PLUGIN_DESCRIPTION`

  Uma breve descrição do Plugin.

* `PLUGIN_LICENSE`

  Como o Plugin está licenciado (por exemplo, `GPL`).

* `LOAD_OPTION`

  Como o Plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

#### Notas

* [`PLUGINS`](information-schema-plugins-table.html "24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA") é uma tabela `INFORMATION_SCHEMA` não padrão.

* Para Plugins instalados com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), os valores de `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

* Para obter informações sobre as estruturas de dados de Plugin que formam a base das informações na tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 A Tabela PLUGINS do INFORMATION_SCHEMA"), consulte [The MySQL Plugin API](/doc/extending-mysql/5.7/en/plugin-api.html).

As informações do Plugin também estão disponíveis por meio do Statement [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"). Consulte [Seção 13.7.5.25, “SHOW PLUGINS Statement”](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"). Estes Statements são equivalentes:

```sql
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```
