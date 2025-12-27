#### 25.6.15.60 Tabela `table_replicas`

A tabela `table_replicas` fornece informações sobre a cópia, distribuição e checkpointing dos fragmentos e réplicas de fragmentos da tabela `NDB`.

A tabela `table_replicas` contém as seguintes colunas:

* `node_id`

  ID do nó a partir do qual os dados são obtidos (`master` do DIH)

* `table_id`

  ID da tabela

* `fragment_id`

  ID do fragmento

* `initial_gci`

  GCI inicial para a tabela

* `replica_node_id`

  ID do nó onde a réplica do fragmento está armazenada

* `is_lcp_ongoing`

  1 se o LCP estiver em andamento neste fragmento, 0 caso contrário

* `num_crashed_replicas`

  Número de instâncias de réplica de fragmento que falharam

* `last_max_gci_started`

  GCI máximo iniciado no LCP mais recente

* `last_max_gci_completed`

  GCI máximo concluído no LCP mais recente

* `last_lcp_id`

  ID do LCP mais recente

* `prev_lcp_id`

  ID do LCP anterior

* `prev_max_gci_started`

  GCI máximo iniciado no LCP anterior

* `prev_max_gci_completed`

  GCI máximo concluído no LCP anterior

* `last_create_gci`

  Último GCI criado na última instância de réplica de fragmento que falhou

* `last_replica_gci`

  Último GCI da última instância de réplica de fragmento que falhou

* `is_replica_alive`

  1 se a réplica deste fragmento está viva, 0 caso contrário