#### 25.6.16.58 A tabela ndbinfo table\_info

A tabela `table_info` fornece informações sobre opções de registro, verificação de ponto, distribuição e armazenamento em vigor para as tabelas individuais `NDB`.

A tabela `table_info` contém as seguintes colunas:

- `table_id`

  Tabela ID

- `logged_table`

  Se a tabela está registrada (1) ou não (0)

- `row_contains_gci`

  Se as linhas da tabela contêm GCI (1 verdadeiro, 0 falso)

- `row_contains_checksum`

  Se as linhas da tabela contêm o checksum (1 verdadeiro, 0 falso)

- `read_backup`

  Se as réplicas de fragmentos de backup forem lidas, o valor será 1; caso contrário, será 0

- `fully_replicated`

  Se a tabela for totalmente replicada, o valor é 1; caso contrário, é 0

- `storage_type`

  Tipo de armazenamento em tabela; um dos `MEMORY` ou `DISK`

- `hashmap_id`

  ID do Hashmap

- `partition_balance`

  Balanço de partição (tipo de contagem de fragmentos) usado para a tabela; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM` ou `FOR_RA_BY_LDM`

- `create_gci`

  GCI em que tabela foi criada
