#### 21.6.15.42 Tabela de threads ndbinfo

A tabela `threads` fornece informações sobre os threads que estão em execução no kernel `NDB`.

A tabela `threads` contém as seguintes colunas:

- `node_id`

  ID do nó onde o fio está sendo executado

- `thr_no`

  ID do fio (específico para este nó)

- `nome_do_thread`

  Nome do fio (tipo de fio)

- `descrição_do_thread`

  Descrição do fio (tipo)

##### Notas

A saída de exemplo de um clúster de exemplo de 2 nós, incluindo descrições de threads, é mostrada aqui:

```sql
mysql> SELECT * FROM threads;
+---------+--------+-------------+------------------------------------------------------------------+
| node_id | thr_no | thread_name | thread_description                                               |
+---------+--------+-------------+------------------------------------------------------------------+
|       5 |      0 | main        | main thread, schema and distribution handling                    |
|       5 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       5 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       5 |      3 | recv        | receive thread, performing receive and polling for new receives |
|       6 |      0 | main        | main thread, schema and distribution handling                    |
|       6 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       6 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       6 |      3 | recv        | receive thread, performing receive and polling for new receives |
+---------+--------+-------------+------------------------------------------------------------------+
8 rows in set (0.01 sec)
```

Esta tabela foi adicionada no NDB 7.5.2.
