#### 21.6.15.36 A Tabela ndbinfo table_distribution_status

A tabela `table_distribution_status` fornece informações sobre o progresso da distribuição de tabelas para tabelas `NDB`.

A tabela `table_distribution_status` contém as seguintes colunas:

* `node_id`

  ID do Node

* `table_id`

  ID da Tabela (Table ID)

* `tab_copy_status`

  Status da cópia dos dados de distribuição da tabela para o disco; um de `IDLE`, `SR_PHASE1_READ_PAGES`, `SR_PHASE2_READ_TABLE`, `SR_PHASE3_COPY_TABLE`, `REMOVE_NODE`, `LCP_READ_TABLE`, `COPY_TAB_REQ`, `COPY_NODE_STATE`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP`, `ALTER_TABLE`, `COPY_TO_SAVE`, ou `GET_TABINFO`

* `tab_update_status`

  Status da atualização dos dados de distribuição da tabela; um de `IDLE`, `LOCAL_CHECKPOINT`, `LOCAL_CHECKPOINT_QUEUED`, `REMOVE_NODE`, `COPY_TAB_REQ`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP`, ou `CALLBACK`

* `tab_lcp_status`

  Status do LCP da tabela; um de `ACTIVE` (aguardando a execução do local checkpoint), `WRITING_TO_FILE` (checkpoint executado, mas ainda não escrito no disco), ou `COMPLETED` (checkpoint executado e persistido no disco)

* `tab_status`

  Status interno da tabela; um de `ACTIVE` (a tabela existe), `CREATING` (a tabela está sendo criada), ou `DROPPING` (a tabela está sendo descartada)

* `tab_storage`

  Recuperabilidade da tabela; um de `NORMAL` (totalmente recuperável com redo logging e checkpointing), `NOLOGGING` (recuperável de falha de Node, vazia após falha do Cluster), ou `TEMPORARY` (não recuperável)

* `tab_partitions`

  Número de Partitions na tabela

* `tab_fragments`

  Número de fragments na tabela; normalmente igual a `tab_partitions`; para tabelas totalmente replicadas, igual a `tab_partitions * [número de grupos de Node]`

* `current_scan_count`

  Número atual de Scans ativos

* `scan_count_wait`

  Número atual de Scans aguardando para serem executados antes que o `ALTER TABLE` possa ser concluído.

* `is_reorg_ongoing`

  Indica se a tabela está atualmente sendo reorganizada (1 se verdadeiro)

##### Notas

A tabela `table_distribution_status` foi adicionada no NDB 7.5.4.