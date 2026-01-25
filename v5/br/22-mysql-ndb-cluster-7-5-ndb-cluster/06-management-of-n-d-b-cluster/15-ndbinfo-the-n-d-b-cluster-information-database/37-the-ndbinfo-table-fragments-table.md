#### 21.6.15.37 A Tabela ndbinfo table_fragments

A tabela `table_fragments` fornece informações sobre a fragmentação, o partitioning, a distribuição e a replication (interna) de tabelas `NDB`.

A tabela `table_fragments` contém as seguintes colunas:

* `node_id`

  ID do Node (master [`DIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html))

* `table_id`

  ID da Tabela

* `partition_id`

  ID da Partition

* `fragment_id`

  ID do Fragment (o mesmo que o ID da Partition, a menos que a tabela esteja totalmente replicada)

* `partition_order`

  Ordem do fragment na partition

* `log_part_id`

  ID da parte do Log do fragment

* `no_of_replicas`

  Número de réplicas do fragment

* `current_primary`

  ID do Node primary atual

* `preferred_primary`

  ID do Node primary preferencial

* `current_first_backup`

  ID do Node de primeiro backup atual

* `current_second_backup`

  ID do Node de segundo backup atual

* `current_third_backup`

  ID do Node de terceiro backup atual

* `num_alive_replicas`

  Número atual de réplicas de fragment ativas (`live`)

* `num_dead_replicas`

  Número atual de réplicas de fragment inativas (`dead`)

* `num_lcp_replicas`

  Número de réplicas de fragment restantes para serem submetidas a Checkpoint

##### Notas

A tabela `table_fragments` foi adicionada no NDB 7.5.4.