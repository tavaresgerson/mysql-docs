#### 21.6.15.37 A tabela ndbinfo table_fragments

A tabela `table_fragments` fornece informações sobre a fragmentação, particionamento, distribuição e (replicação interna) das tabelas `NDB`.

A tabela `table_fragments` contém as seguintes colunas:

- `node_id`

  ID do nó (`DIH` master))

- `table_id`

  Tabela ID

- `partition_id`

  ID de Partição

- `fragment_id`

  ID de fragmento (o mesmo que o ID de partição, a menos que a tabela seja totalmente replicada)

- `ordem_partição`

  Ordem do fragmento na partição

- `log_part_id`

  ID de registro da parte do fragmento

- `no_of_replicas`

  Número de réplicas de fragmentos

- `current_primary`

  ID atual do nó primário

- `preferido_primario`

  ID do nó primário preferido

- `current_first_backup`

  ID atual do primeiro nó de backup

- `current_second_backup`

  ID do segundo nó de backup atual

- `atual_terceiro_backup`

  ID do terceiro nó de backup atual

- `num_alive_replicas`

  Número atual de réplicas de fragmentos ao vivo

- `num_dead_replicas`

  Número atual de réplicas de fragmentos mortos

- `num_lcp_replicas`

  Número de réplicas de fragmentos que ainda precisam ser verificadas

##### Notas

A tabela `table_fragments` foi adicionada no NDB 7.5.4.
