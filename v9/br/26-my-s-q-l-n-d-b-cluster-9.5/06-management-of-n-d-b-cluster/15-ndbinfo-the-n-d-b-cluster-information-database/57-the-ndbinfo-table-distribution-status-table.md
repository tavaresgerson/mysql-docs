#### 25.6.15.57 Tabela ndbinfo_status_distribuição

A tabela `table_distribution_status` fornece informações sobre o progresso da distribuição de tabelas para tabelas `NDB`.

A tabela `table_distribution_status` contém as seguintes colunas:

* `node_id`

  ID do nó

* `table_id`

  ID da tabela

* `tab_copy_status`

  Status da cópia dos dados de distribuição de tabela para o disco; um dos `IDLE`, `SR_PHASE1_READ_PAGES`, `SR_PHASE2_READ_TABLE`, `SR_PHASE3_COPY_TABLE`, `REMOVE_NODE`, `LCP_READ_TABLE`, `COPY_TAB_REQ`, `COPY_NODE_STATE`, `ADD_TABLE_COORDINATOR`, `ADD_TABLE_PARTICIPANT`, `INVALIDATE_NODE_LCP`, `ALTER_TABLE`, `COPY_TO_SAVE`, ou `GET_TABINFO`

* `tab_update_status`

  Status da atualização dos dados de distribuição de tabela; um dos `IDLE`, `LOCAL_CHECKPOINT`, `LOCAL_CHECKPOINT_QUEUED`, `REMOVE_NODE`, `COPY_TAB_REQ`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP`, ou `CALLBACK`

* `tab_lcp_status`

  Status do LCP da tabela; um dos `ACTIVE` (esperando pelo checkpoint local ser realizado), `WRITING_TO_FILE` (checkpoint realizado, mas ainda não escrito no disco), ou `COMPLETED` (checkpoint realizado e persistido no disco)

* `tab_status`

  Status interno da tabela; um dos `ACTIVE` (tabela existe), `CREATING` (tabela está sendo criada), ou `DROPPING` (tabela está sendo removida)

* `tab_storage`

  Recuperabilidade da tabela; um dos `NORMAL` (completamente recuperável com log de redo e checkpointing), `NOLOGGING` (recuperável de um crash no nó, vazio após um crash no cluster), ou `TEMPORARY` (não recuperável)

* `tab_partitions`

  Número de partições na tabela

* `tab_fragments`

  Número de fragmentos na tabela; normalmente igual a `tab_partitions`; para tabelas totalmente replicadas igual a `tab_partitions * [número de grupos de nó]`

* `current_scan_count`

  Número atual de varreduras ativas

* `scan_count_wait`

Número atual de varreduras em espera para serem executadas antes que a `ALTER TABLE` possa ser concluída.

* `is_reorg_ongoing`

Se a tabela está sendo reorganizada atualmente (1 se verdadeiro)