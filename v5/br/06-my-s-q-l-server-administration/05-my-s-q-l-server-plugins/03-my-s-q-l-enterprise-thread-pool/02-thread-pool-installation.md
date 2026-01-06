#### 5.5.3.2 Instalação do Pool de Fios

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `thread_pool`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para habilitar a capacidade de pool de threads, carregue os plugins que serão usados iniciando o servidor com a opção `--plugin-load-add`. Por exemplo, se você nomear apenas o arquivo da biblioteca do plugin, o servidor carrega todos os plugins que ele contém (ou seja, o plugin de pool de threads e todas as tabelas do `INFORMATION_SCHEMA`). Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=thread_pool.so
```

Isso é equivalente a carregar todos os plugins do pool de threads, nomeando-os individualmente:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
plugin-load-add=tp_thread_group_state=thread_pool.so
plugin-load-add=tp_thread_group_stats=thread_pool.so
```

Se desejar, você pode carregar plugins individuais a partir do arquivo de biblioteca. Para carregar o plugin de pool de threads, mas não as tabelas `INFORMATION_SCHEMA`, use uma opção como esta:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
```

Para carregar o plugin do pool de threads e apenas a tabela do esquema de informações `INFORMATION_SCHEMA` `TP_THREAD_STATE`, use as opções desta forma:

```sql
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
```

Nota

Se você não carregar todas as tabelas do `INFORMATION_SCHEMA`, alguns ou todos os gráficos do pool de threads do MySQL Enterprise Monitor ficarão vazios.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

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

Se o servidor carregar o plugin do pool de threads com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.
