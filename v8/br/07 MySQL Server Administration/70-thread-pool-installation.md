#### 7.6.3.2 Instalação do Pool de Fios

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

O nome base do arquivo da biblioteca do plugin é `thread_pool`. O sufixo do nome do arquivo difere conforme a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

As tabelas de monitoramento do pool de fios são tabelas do Schema de Desempenho que são carregadas e descarregadas juntamente com o plugin do pool de fios.

Para habilitar a capacidade do pool de fios, carregue o plugin iniciando o servidor com a opção `--plugin-load-add`. Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` conforme necessário para sua plataforma:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Para verificar se as tabelas de monitoramento do Schema de Desempenho estão disponíveis, examine a tabela do Schema de Informações `TABLES` ou use a declaração `SHOW TABLES`. Por exemplo:

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

Se o servidor carregar o plugin do pool de fios com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se o plugin não conseguir inicializar, verifique o log de erro do servidor para mensagens de diagnóstico.