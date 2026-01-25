#### 5.5.3.2 Instalação do Thread Pool

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de Plugins, consulte [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para ser utilizável pelo Server, o arquivo da biblioteca do Plugin deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela System Variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do Server.

O nome base do arquivo da biblioteca do Plugin é `thread_pool`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e semelhantes a Unix, `.dll` para Windows).

Para habilitar a capacidade de Thread Pool, carregue os Plugins a serem usados iniciando o Server com a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). Por exemplo, se você nomear apenas o arquivo da biblioteca do Plugin, o Server carrega todos os Plugins que ele contém (ou seja, o Plugin do Thread Pool e todas as tabelas `INFORMATION_SCHEMA`). Para fazer isso, insira estas linhas no arquivo `my.cnf` do Server, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=thread_pool.so
```

Isso é equivalente a carregar todos os Plugins do Thread Pool nomeando-os individualmente:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
plugin-load-add=tp_thread_group_state=thread_pool.so
plugin-load-add=tp_thread_group_stats=thread_pool.so
```

Se desejar, você pode carregar Plugins individuais do arquivo da biblioteca. Para carregar o Plugin do Thread Pool, mas não as tabelas `INFORMATION_SCHEMA`, use uma opção como esta:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
```

Para carregar o Plugin do Thread Pool e apenas a tabela `INFORMATION_SCHEMA` [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"), use opções como esta:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
```

Nota

Se você não carregar todas as tabelas `INFORMATION_SCHEMA`, alguns ou todos os gráficos de Thread Pool do MySQL Enterprise Monitor estarão vazios.

Para verificar a instalação do Plugin, examine a tabela `INFORMATION_SCHEMA` [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'thread%' OR PLUGIN_NAME LIKE 'tp%';
+-----------------------+---------------+
| PLUGIN_NAME           | PLUGIN_STATUS |
+-----------------------+---------------+
| thread_pool           | ACTIVE        |
| TP_THREAD_STATE       | ACTIVE        |
| TP_THREAD_GROUP_STATE | ACTIVE        |
| TP_THREAD_GROUP_STATS | ACTIVE        |
+-----------------------+---------------+
```

Se o Server carregar o Plugin do Thread Pool com sucesso, ele define a System Variable `thread_handling` como `loaded-dynamically`.

Se um Plugin falhar ao inicializar, verifique o log de erros do Server em busca de mensagens de diagnóstico.