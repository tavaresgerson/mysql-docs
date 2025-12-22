#### 7.6.3.2 Instalação de uma piscina de roscas

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, Instalar e Desinstalar Plugins.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório de plugins definindo o valor de `plugin_dir` na inicialização do servidor.

O nome do arquivo base da biblioteca de plugins é `thread_pool`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

As tabelas de monitoramento do pool de threads são tabelas do Performance Schema que são carregadas e descarregadas junto com o plugin do pool de threads.

Para habilitar a capacidade de pool de threads, carregue o plugin iniciando o servidor com a opção `--plugin-load-add`. Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela de esquema de informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (ver Seção 7.6.2, Obtenção de Informações do Plugin do Servidor).

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'thread%';
+-----------------------+---------------+
| PLUGIN_NAME           | PLUGIN_STATUS |
+-----------------------+---------------+
| thread_pool           | ACTIVE        |
+-----------------------+---------------+
```

Para verificar se as tabelas de monitorização do Esquema de Desempenho estão disponíveis, examine a tabela de Esquema de Informação `TABLES` ou use a instrução `SHOW TABLES`.

```
mysql> SELECT TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME LIKE 'tp%';
+-----------------------+
| TABLE_NAME            |
+-----------------------+
| tp_thread_group_state |
| tp_thread_group_stats |
| tp_thread_state       |
+-----------------------+
```

Se o servidor carregar o plugin do pool de tópicos com sucesso, ele define a variável de sistema `thread_handling` como `loaded-dynamically`.

Se o plug-in falhar na inicialização, verifique o log de erros do servidor para mensagens de diagnóstico.
