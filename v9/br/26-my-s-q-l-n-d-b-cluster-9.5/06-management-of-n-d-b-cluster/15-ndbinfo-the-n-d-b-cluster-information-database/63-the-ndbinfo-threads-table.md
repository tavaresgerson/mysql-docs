#### 25.6.15.63 Tabela de threads ndbinfo

A tabela `threads` fornece informações sobre as threads em execução no kernel `NDB`.

A tabela `threads` contém as seguintes colunas:

* `node_id`

  ID do nó onde a thread está sendo executada

* `thr_no`

  ID da thread (específico para este nó)

* `thread_name`

  Nome da thread (tipo de thread)

* `thread_description`

  Descrição da thread (tipo)

##### Notas

A saída de exemplo de um clúster de cluster de 2 nós, incluindo descrições de threads, é mostrada aqui:

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

Também é possível definir qualquer um dos argumentos `ThreadConfig` `main` ou `rep` para 0, mantendo o outro em 1, caso em que o nome da thread é `main_rep` e sua descrição é `thread principal e de rep, esquema, distribuição, bloco de proxy e manipulação de replicação assíncrona`. Você também pode definir `main` e `rep` para 0, caso em que o nome da thread resultante é mostrado nesta tabela como `main_rep_recv`, e sua descrição é `thread principal, de rep e de recebimento, esquema, distribuição, bloco de proxy e manipulação de replicação assíncrona e manipulação de recebimento e sondagem para novos recebimentos`.