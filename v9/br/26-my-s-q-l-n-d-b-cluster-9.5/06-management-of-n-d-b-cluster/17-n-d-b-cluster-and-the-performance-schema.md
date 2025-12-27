### 25.6.17 NDB Cluster e o Schema de Desempenho

O NDB fornece informações no Schema de Desempenho MySQL sobre os threads do plugin `ndbcluster` e a instrumentação para a memória de lote de transações. Essas funcionalidades são descritas com mais detalhes nas seções que se seguem.

#### Threads do Plugin `ndbcluster`

Os threads do plugin `ndbcluster` são visíveis na tabela `threads` do Schema de Desempenho `performance_schema`, conforme mostrado na seguinte consulta:

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

A tabela `threads` mostra todos os três threads listados aqui:

* `ndb_binlog`: Thread de log binário
* `ndb_index_stat`: Thread de estatísticas de índices
* `ndb_metadata`: Thread de metadados

Esses threads também são mostrados pelo nome na tabela `setup_threads`.

Os nomes dos threads são mostrados na coluna `name` das tabelas `threads` e `setup_threads`, usando o formato `prefix/plugin_name/thread_name`. *`prefix`*, o tipo de objeto determinado pelo motor `performance_schema`, é `thread` para threads de plugins (veja Elementos de Instrumento de Thread). O *`plugin_name`* é `ndbcluster`. *`thread_name`* é o nome autônomo do thread (`ndb_binlog`, `ndb_index_stat` ou `ndb_metadata`).

Usando o ID do thread ou o ID do thread do sistema operacional para um determinado thread na tabela `threads` ou `setup_threads`, é possível obter informações consideráveis do Schema de Desempenho sobre a execução do plugin e o uso de recursos. Este exemplo mostra como obter a quantidade de memória alocada pelos threads criados pelo plugin `ndbcluster` a partir da arena `mem_root`, juntando as tabelas `threads` e `memory_summary_by_thread_by_event_name`:

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

Você pode ver a quantidade de memória usada para a batching de transações consultando a tabela `memory_summary_by_thread_by_event_name` do Schema de Desempenho, de forma semelhante à que é mostrada aqui:

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

O instrumento de memória de transação `ndbcluster` também é visível na tabela `setup_instruments` do Schema de Desempenho, conforme mostrado aqui:

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