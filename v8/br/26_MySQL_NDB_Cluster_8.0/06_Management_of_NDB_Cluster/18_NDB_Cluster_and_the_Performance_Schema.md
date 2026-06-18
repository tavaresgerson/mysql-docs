### 25.6.18 Clúster NDB e o Schema de Desempenho

O NDB 8.0 fornece informações no Schema de Desempenho do MySQL sobre threads e uso da memória de transações; o NDB 8.0.29 adiciona threads do plugin `ndbcluster`, e o NDB 8.0.30 adiciona instrumentação para a memória de lotes de transações. Essas funcionalidades são descritas com mais detalhes nas seções a seguir.

#### ndbcluster Plugin Threads

A partir da versão 8.0.29 do NDB, os tópicos dos plugins `ndbcluster` são visíveis na tabela do Schema de Desempenho `threads`, conforme mostrado na seguinte consulta:

```
mysql> SELECT name, type, thread_id, thread_os_id
    -> FROM performance_schema.threads
    -> WHERE name LIKE '%ndbcluster%'\G
+----------------------------------+------------+-----------+--------------+
| name                             | type       | thread_id | thread_os_id |
+----------------------------------+------------+-----------+--------------+
| thread/ndbcluster/ndb_binlog     | BACKGROUND |        30 |        11980 |
| thread/ndbcluster/ndb_index_stat | BACKGROUND |        31 |        11981 |
| thread/ndbcluster/ndb_metadata   | BACKGROUND |        32 |        11982 |
+----------------------------------+------------+-----------+--------------+
```

A tabela `threads` mostra os três fios listados aqui:

- `ndb_binlog`: Fundo de registro binário
- `ndb_index_stat`: Fóssil de estatísticas de índice
- `ndb_metadata`: Fóssil de metadados

Esses fios também são mostrados pelo nome na tabela `setup_threads`.

Os nomes dos tópicos são exibidos na coluna `name` das tabelas `threads` e `setup_threads` usando o formato `prefix/plugin_name/thread_name`. `prefix`, o tipo de objeto determinado pelo motor `performance_schema`, é `thread` para tópicos de plugin (veja Elementos de Instrumento de Tópico). O `plugin_name` é `ndbcluster`. `thread_name` é o nome autônomo do tópico (`ndb_binlog`, `ndb_index_stat` ou `ndb_metadata`).

Usando o ID do thread ou o ID do thread do sistema operacional para um determinado thread na tabela `threads` ou `setup_threads`, é possível obter informações consideráveis sobre a execução do plugin e o uso de recursos no Gerenciador de Desempenho. Este exemplo mostra como obter a quantidade de memória alocada pelos threads criados pelo plugin `ndbcluster` na arena `mem_root` ao juntar as tabelas `threads` e `memory_summary_by_thread_by_event_name`:

```
mysql> SELECT
    ->   t.name,
    ->   m.sum_number_of_bytes_alloc,
    ->   IF(m.sum_number_of_bytes_alloc > 0, "true", "false") AS 'Has allocated memory'
    -> FROM performance_schema.memory_summary_by_thread_by_event_name m
    -> JOIN performance_schema.threads t
    -> ON m.thread_id = t.thread_id
    -> WHERE t.name LIKE '%ndbcluster%'
    ->   AND event_name LIKE '%THD::main_mem_root%';
+----------------------------------+---------------------------+----------------------+
| name                             | sum_number_of_bytes_alloc | Has allocated memory |
+----------------------------------+---------------------------+----------------------+
| thread/ndbcluster/ndb_binlog     |                     20576 | true                 |
| thread/ndbcluster/ndb_index_stat |                         0 | false                |
| thread/ndbcluster/ndb_metadata   |                      8240 | true                 |
+----------------------------------+---------------------------+----------------------+
```

#### Uso da Memória de Transação

A partir da versão NDB 8.0.30, você pode ver a quantidade de memória usada para o agrupamento de transações consultando a tabela do Schema de Desempenho `memory_summary_by_thread_by_event_name`, de forma semelhante ao que é mostrado aqui:

```
mysql> SELECT EVENT_NAME
    ->   FROM performance_schema.memory_summary_by_thread_by_event_name
    ->   WHERE THREAD_ID = PS_CURRENT_THREAD_ID()
    ->     AND EVENT_NAME LIKE 'memory/ndbcluster/%';
+-------------------------------------------+
| EVENT_NAME                                |
+-------------------------------------------+
| memory/ndbcluster/Thd_ndb::batch_mem_root |
+-------------------------------------------+
1 row in set (0.01 sec)
```

O instrumento de memória de transação `ndbcluster` também é visível na tabela do Schema de Desempenho `setup_instruments`, conforme mostrado aqui:

```
mysql> SELECT * from performance_schema.setup_instruments
    ->   WHERE NAME LIKE '%ndb%'\G
*************************** 1. row ***************************
         NAME: memory/ndbcluster/Thd_ndb::batch_mem_root
      ENABLED: YES
        TIMED: NULL
   PROPERTIES:
   VOLATILITY: 0
DOCUMENTATION: Memory used for transaction batching
1 row in set (0.01 sec)
```
