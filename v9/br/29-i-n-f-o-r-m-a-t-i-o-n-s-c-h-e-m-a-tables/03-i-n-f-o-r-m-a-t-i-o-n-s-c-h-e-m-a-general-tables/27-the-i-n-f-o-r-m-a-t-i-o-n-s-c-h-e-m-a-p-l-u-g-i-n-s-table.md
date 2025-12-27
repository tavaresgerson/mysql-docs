### 28.3.27 A Tabela PLUGINS da INFORMATION_SCHEMA

A tabela `PLUGINS` fornece informações sobre os plugins do servidor.

A tabela `PLUGINS` possui as seguintes colunas:

* `PLUGIN_NAME`

  O nome usado para referenciar o plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

  A versão do plugin, conforme o descritor do tipo geral do plugin.

* `PLUGIN_STATUS`

  O status do plugin, um dos valores `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING` ou `DELETED`.

* `PLUGIN_TYPE`

  O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

  A versão do descritor específico do tipo do plugin.

* `PLUGIN_LIBRARY`

  O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para referenciar o arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin é compilado e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

  A versão da interface da API do plugin.

* `PLUGIN_AUTHOR`

  O autor do plugin.

* `PLUGIN_DESCRIPTION`

  Uma breve descrição do plugin.

* `PLUGIN_LICENSE`

  Como o plugin é licenciado (por exemplo, `GPL`).

* `LOAD_OPTION`

  Como o plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

#### Notas

* `PLUGINS` é uma tabela não padrão da INFORMATION_SCHEMA.

* Para plugins instalados com `INSTALL PLUGIN`, os valores de `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

* Para informações sobre as estruturas de dados do plugin que formam a base das informações na tabela `PLUGINS`, consulte a API do Plugin MySQL.

As informações sobre os plugins também estão disponíveis na instrução `SHOW PLUGINS`. Veja a Seção 15.7.7.28, “Instrução SHOW PLUGINS”. Essas instruções são equivalentes:

```
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```