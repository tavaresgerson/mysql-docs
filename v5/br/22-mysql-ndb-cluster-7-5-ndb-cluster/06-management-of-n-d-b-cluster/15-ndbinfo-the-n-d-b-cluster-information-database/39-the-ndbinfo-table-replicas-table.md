#### 21.6.15.39 A tabela ndbinfo table\_replicas

A tabela `table_replicas` fornece informações sobre a cópia, distribuição e checkpointing de fragmentos de tabela `NDB` e réplicas de fragmentos.

A tabela `table_replicas` contém as seguintes colunas:

- `node_id`

  ID do nó a partir do qual os dados são obtidos (`DIH` master)

- `table_id`

  Tabela ID

- `fragment_id`

  ID do fragmento

- `inicial_gci`

  GCI inicial para a tabela

- `replica_node_id`

  ID do nó onde a replica do fragmento é armazenada

- `is_lcp_ongoing`

  1 se o LCP estiver em andamento neste fragmento, 0 caso contrário

- `num_crashed_replicas`

  Número de instâncias de réplica de fragmentos quebras

- `last_max_gci_started`

  O maior GCI começou no LCP mais recente

- `last_max_gci_completed`

  Maior GCI concluído no LCP mais recente

- `last_lcp_id`

  ID do LCP mais recente

- `prev_lcp_id`

  ID do LCP anterior

- `prev_max_gci_started`

  O maior GCI começou no LCP anterior

- `prev_max_gci_completed`

  Maior GCI concluído no LCP anterior

- `last_create_gci`

  Criar o último GCI da última instância de replica de fragmento que caiu

- `last_replica_gci`

  Última GCI da última instância de replica de fragmento que caiu

- `is_replica_alive`

  1 se essa réplica do fragmento estiver viva, 0 caso contrário

##### Notas

A tabela `table_replicas` foi adicionada no NDB 7.5.4.
