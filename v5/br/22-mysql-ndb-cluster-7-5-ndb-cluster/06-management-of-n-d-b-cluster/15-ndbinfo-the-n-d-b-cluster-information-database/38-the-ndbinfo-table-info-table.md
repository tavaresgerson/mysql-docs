#### 21.6.15.38 A Tabela ndbinfo table_info

A tabela `table_info` fornece informações sobre as opções de logging, checkpointing, distribuição e armazenamento em vigor para tabelas `NDB` individuais.

A tabela `table_info` contém as seguintes colunas:

* `table_id`

  ID da Table

* `logged_table`

  Indica se a table está logged (1) ou não (0)

* `row_contains_gci`

  Indica se as linhas da table contêm GCI (1 true, 0 false)

* `row_contains_checksum`

  Indica se as linhas da table contêm checksum (1 true, 0 false)

* `read_backup`

  Se as réplicas de fragmentos de backup são lidas, este valor é 1; caso contrário, é 0

* `fully_replicated`

  Se a table estiver fully replicated, este valor é 1; caso contrário, é 0

* `storage_type`

  Tipo de storage da Table; um de `MEMORY` ou `DISK`

* `hashmap_id`

  ID do Hashmap

* `partition_balance`

  Balanceamento de Partition (tipo de contagem de fragmentos) usado para a table; um de `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, ou `FOR_RA_BY_LDM`

* `create_gci`

  GCI no qual a table foi criada

##### Notas

A tabela `table_info` foi adicionada no NDB 7.5.4.