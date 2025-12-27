#### 25.6.15.58 Tabela `table_fragments`

A tabela `table_fragments` fornece informações sobre a fragmentação, particionamento, distribuição e (interna) replicação das tabelas `NDB`.

A tabela `table_fragments` contém as seguintes colunas:

* `node_id`

  ID do nó (`master` do DIH)

* `table_id`

  ID da tabela

* `partition_id`

  ID da partição

* `fragment_id`

  ID do fragmento (o mesmo que o ID da partição, a menos que a tabela esteja totalmente replicada)

* `partition_order`

  Ordem do fragmento na partição

* `log_part_id`

  ID da parte de log do fragmento

* `no_of_replicas`

  Número de réplicas do fragmento

* `current_primary`

  ID do nó primário atual

* `preferred_primary`

  ID do nó primário preferido

* `current_first_backup`

  ID do nó de backup primeiro atual

* `current_second_backup`

  ID do nó de backup segundo atual

* `current_third_backup`

  ID do nó de backup terceiro atual

* `num_alive_replicas`

  Número atual de réplicas de fragmentos vivas

* `num_dead_replicas`

  Número atual de réplicas de fragmentos mortas

* `num_lcp_replicas`

  Número de réplicas de fragmentos restantes a serem checkpointeadas