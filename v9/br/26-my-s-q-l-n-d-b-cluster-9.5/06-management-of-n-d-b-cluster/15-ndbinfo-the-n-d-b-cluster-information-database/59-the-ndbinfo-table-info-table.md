#### 25.6.15.59 Tabela ndbinfo_info

A tabela `table_info` fornece informações sobre as opções de registro, checkpointing, distribuição e armazenamento em vigor para as tabelas individuais `NDB`.

A tabela `table_info` contém as seguintes colunas:

* `table_id`

  ID da tabela

* `logged_table`

  Se a tabela está registrada (1) ou não (0)

* `row_contains_gci`

  Se as linhas da tabela contêm GCI (1 verdadeiro, 0 falso)

* `row_contains_checksum`

  Se as linhas da tabela contêm checksum (1 verdadeiro, 0 falso)

* `read_backup`

  Se os fragmentos de backup são lidos, este é 1, caso contrário 0

* `fully_replicated`

  Se a tabela está totalmente replicada, este é 1, caso contrário 0

* `storage_type`

  Tipo de armazenamento da tabela; um dos `MEMORY` ou `DISK`

* `hashmap_id`

  ID do hashmap

* `partition_balance`

  Equilíbrio de partição (tipo de contagem de fragmentos) usado para a tabela; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM` ou `FOR_RA_BY_LDM`

* `create_gci`

  GCI em que a tabela foi criada