#### 21.6.15.38 A tabela ndbinfo table_info

A tabela `table_info` fornece informações sobre opções de registro, verificação de ponto de controle, distribuição e armazenamento em vigor para tabelas individuais de `NDB`.

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

- `completamente_replicado`

  Se a tabela for totalmente replicada, o valor é 1; caso contrário, é 0

- `tipo_de_armazenamento`

  Tipo de armazenamento de tabela; uma das opções `MEMORY` ou `DISK`

- `hashmap_id`

  ID do Hashmap

- `partição_balanço`

  Balanço de partições (tipo de contagem de fragmentos) usado para a tabela; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM` ou `FOR_RA_BY_LDM`

- `create_gci`

  GCI em que tabela foi criada

##### Notas

A tabela `table_info` foi adicionada no NDB 7.5.4.
