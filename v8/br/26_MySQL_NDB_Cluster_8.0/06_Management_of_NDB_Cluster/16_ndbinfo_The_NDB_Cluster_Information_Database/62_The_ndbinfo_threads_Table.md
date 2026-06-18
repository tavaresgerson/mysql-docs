#### 25.6.16.62 Tabela de threads ndbinfo

A tabela `threads` fornece informações sobre os threads que estão em execução no kernel `NDB`.

A tabela `threads` contém as seguintes colunas:

- `node_id`

  ID do nó onde o fio está sendo executado

- `thr_no`

  ID do fio (específico para este nó)

- `thread_name`

  Nome do fio (tipo de fio)

- `thread_description`

  Descrição do fio (tipo)

##### Notas

A saída de exemplo de um clúster de exemplo de 2 nós, incluindo descrições de threads, é mostrada aqui:

```
mysql> SELECT * FROM threads;
+---------+--------+-------------+------------------------------------------------------------------+
| node_id | thr_no | thread_name | thread_description                                               |
+---------+--------+-------------+------------------------------------------------------------------+
|       5 |      0 | main        | main thread, schema and distribution handling                    |
|       5 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       5 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       5 |      3 | recv        | receive thread, performing receive and polling for new receives  |
|       6 |      0 | main        | main thread, schema and distribution handling                    |
|       6 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       6 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       6 |      3 | recv        | receive thread, performing receive and polling for new receives  |
+---------+--------+-------------+------------------------------------------------------------------+
8 rows in set (0.01 sec)
```

O NDB 8.0.23 introduz a possibilidade de definir qualquer um dos argumentos `ThreadConfig` `main` ou `rep` para 0, mantendo o outro em 1, caso em que o nome do thread é `main_rep` e sua descrição é `main and rep thread, schema, distribution, proxy block and asynch replication handling`. Também é possível, a partir do NDB 8.0.23, definir ambos os argumentos `main` e `rep` para 0, caso em que o nome do thread resultante é mostrado nesta tabela como `main_rep_recv`, e sua descrição é `main, rep and recv thread, schema, distribution, proxy block and asynch replication handling and handling receive and polling for new receives`.
