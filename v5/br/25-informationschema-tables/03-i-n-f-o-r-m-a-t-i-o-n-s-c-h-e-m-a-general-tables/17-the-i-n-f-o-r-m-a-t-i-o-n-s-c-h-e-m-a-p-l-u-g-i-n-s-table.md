### 24.3.17 A tabela INFORMATION_SCHEMA PLUGINS

A tabela `PLUGINS` fornece informações sobre os plugins do servidor.

A tabela `PLUGINS` tem as seguintes colunas:

- `PLUGIN_NAME`

  O nome usado para se referir ao plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

- `PLUGIN_VERSION`

  A versão do descritor de tipo geral do plugin.

- `PLUGIN_STATUS`

  O status do plugin, que pode ser um dos valores `ATIVO`, `INATIVO`, `DESATIVADO` ou `DELETADO`.

- `PLUGIN_TYPE`

  O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

- `PLUGIN_TYPE_VERSION`

  A versão do descritor específico do tipo do plugin.

- `PLUGIN_LIBRARY`

  O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para referenciar o arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin será compilado e não poderá ser desinstalado com `UNINSTALL PLUGIN`.

- `PLUGIN_LIBRARY_VERSION`

  A versão da interface da API do plugin.

- `PLUGIN_AUTHOR`

  O autor do plugin.

- `PLUGIN_DESCRIPTION`

  Uma breve descrição do plugin.

- `PLUGIN_LICENSE`

  Como o plugin é licenciado (por exemplo, `GPL`).

- `LOAD_OPTION`

  Como o plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

#### Notas

- `PLUGINS` é uma tabela `INFORMATION_SCHEMA` não padrão.

- Para plugins instalados com `INSTALL PLUGIN`, os valores `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

- Para obter informações sobre as estruturas de dados dos plugins que formam a base das informações na tabela `PLUGINS`, consulte A API de plugins do MySQL.

As informações sobre os plugins também estão disponíveis na declaração `SHOW PLUGINS`. Veja Seção 13.7.5.25, “Declaração SHOW PLUGINS”. Essas declarações são equivalentes:

```sql
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```
