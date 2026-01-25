#### 21.6.15.39 A Tabela ndbinfo table_replicas

A tabela `table_replicas` fornece informações sobre a cópia, distribuição e checkpointing de fragmentos de tabela `NDB` e réplicas de fragmentos.

A tabela `table_replicas` contém as seguintes colunas:

* `node_id`

  ID do node do qual os dados são buscados (master do [`DIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html))

* `table_id`

  ID da Tabela

* `fragment_id`

  ID do Fragmento

* `initial_gci`

  GCI Inicial para a tabela

* `replica_node_id`

  ID do node onde a réplica do fragmento está armazenada

* `is_lcp_ongoing`

  É 1 se um LCP estiver em andamento neste fragmento, 0 caso contrário

* `num_crashed_replicas`

  Número de instâncias de réplica de fragmento que falharam (crashed)

* `last_max_gci_started`

  GCI mais alto iniciado no LCP mais recente

* `last_max_gci_completed`

  GCI mais alto concluído no LCP mais recente

* `last_lcp_id`

  ID do LCP mais recente

* `prev_lcp_id`

  ID do LCP anterior

* `prev_max_gci_started`

  GCI mais alto iniciado no LCP anterior

* `prev_max_gci_completed`

  GCI mais alto concluído no LCP anterior

* `last_create_gci`

  Último GCI de Criação (Create GCI) da última instância de réplica de fragmento que falhou (crashed)

* `last_replica_gci`

  Último GCI da última instância de réplica de fragmento que falhou (crashed)

* `is_replica_alive`

  1 se esta réplica de fragmento estiver ativa (alive), 0 caso contrário

##### Notas

A tabela `table_replicas` foi adicionada no NDB 7.5.4.