#### 7.6.3.2 Instalação do Pool de Fios

Esta seção descreve como instalar o MySQL Enterprise Thread Pool. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `thread_pool`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

- Piscina de threads na versão 8.0.14 do MySQL
- Instalação do Pool de Fios Antes do MySQL 8.0.14

##### Piscina de threads na versão 8.0.14 do MySQL

No MySQL 8.0.14 e versões superiores, as tabelas de monitoramento do pool de threads são tabelas do Gerenciamento de Desempenho que são carregadas e descarregadas juntamente com o plugin do pool de threads. As versões `INFORMATION_SCHEMA` das tabelas são desaconselhadas, mas ainda estão disponíveis; elas são instaladas de acordo com as instruções na Instalação do Pool de Threads Antes do MySQL 8.0.14.

Para habilitar a capacidade de pool de threads, carregue o plugin iniciando o servidor com a opção `--plugin-load-add`. Para fazer isso, coloque essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Para verificar se as tabelas de monitoramento do Schema de Desempenho estão disponíveis, examine a tabela do Schema de Informações `TABLES` ou use a instrução `SHOW TABLES`. Por exemplo:

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

Se o servidor carregar o plugin da pilha de threads com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

##### Instalação do Pool de Fios Antes do MySQL 8.0.14

Antes do MySQL 8.0.14, as tabelas de monitoramento do pool de threads eram plugins separados do plugin do pool de threads e podiam ser instaladas separadamente.

Para habilitar a capacidade de pool de threads, carregue os plugins que serão usados iniciando o servidor com a opção `--plugin-load-add`. Por exemplo, se você nomear apenas o arquivo da biblioteca do plugin, o servidor carrega todos os plugins que ele contém (ou seja, o plugin de pool de threads e todas as tabelas `INFORMATION_SCHEMA`). Para fazer isso, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=thread_pool.so
```

Isso é equivalente a carregar todos os plugins do pool de threads, nomeando-os individualmente:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
plugin-load-add=tp_thread_group_state=thread_pool.so
plugin-load-add=tp_thread_group_stats=thread_pool.so
```

Se desejar, você pode carregar plugins individuais a partir do arquivo de biblioteca. Para carregar o plugin de pool de threads, mas não as tabelas `INFORMATION_SCHEMA`, use uma opção como esta:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
```

Para carregar o plugin do pool de threads e apenas a tabela `TP_THREAD_STATE` `INFORMATION_SCHEMA`, use opções como esta:

```
[mysqld]
plugin-load-add=thread_pool=thread_pool.so
plugin-load-add=tp_thread_state=thread_pool.so
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
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

Se o servidor carregar o plugin da pilha de threads com sucesso, ele define a variável de sistema `thread_handling` para `loaded-dynamically`.

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.
