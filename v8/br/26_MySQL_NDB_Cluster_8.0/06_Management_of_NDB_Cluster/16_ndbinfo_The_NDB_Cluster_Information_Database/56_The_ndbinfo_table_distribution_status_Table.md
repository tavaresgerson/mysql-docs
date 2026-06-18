#### 25.6.16.56 A tabela ndbinfo table\_distribution\_status

A tabela `table_distribution_status` fornece informações sobre o progresso da distribuição de tabelas para as tabelas `NDB`.

A tabela `table_distribution_status` contém as seguintes colunas:

- `node_id`

  ID do nó

- `table_id`

  Tabela ID

- `tab_copy_status`

  Status da cópia dos dados de distribuição de tabela para disco; um dos `IDLE`, `SR_PHASE1_READ_PAGES`, `SR_PHASE2_READ_TABLE`, `SR_PHASE3_COPY_TABLE`, `REMOVE_NODE`, `LCP_READ_TABLE`, `COPY_TAB_REQ`, `COPY_NODE_STATE`, `ADD_TABLE_COORDINATOR` (*antes da NDB 8.0.23*: `ADD_TABLE_MASTER`), `ADD_TABLE_PARTICIPANT` (*antes da NDB 8.0.23*: `ADD_TABLE_SLAVE`), `INVALIDATE_NODE_LCP`, `ALTER_TABLE`, `COPY_TO_SAVE` ou `GET_TABINFO`

- `tab_update_status`

  Status da atualização dos dados da distribuição da tabela; um dos `IDLE`, `LOCAL_CHECKPOINT`, `LOCAL_CHECKPOINT_QUEUED`, `REMOVE_NODE`, `COPY_TAB_REQ`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP` ou `CALLBACK`

- `tab_lcp_status`

  Status da tabela LCP; um dos `ACTIVE` (esperando por verificação local ser realizada), `WRITING_TO_FILE` (verificação realizada, mas ainda não escrita no disco) ou `COMPLETED` (verificação realizada e persistente no disco)

- `tab_status`

  Status interno da tabela; um dos `ACTIVE` (tabela existe), `CREATING` (tabela está sendo criada) ou `DROPPING` (tabela está sendo excluída)

- `tab_storage`

  Recuperabilidade da tabela; um dos `NORMAL` (completamente recuperável com registro de redo e checkpointing), `NOLOGGING` (recuperável após o crash do nó, após o crash do cluster vazio) ou `TEMPORARY` (não recuperável)

- `tab_partitions`

  Número de partições na tabela

- `tab_fragments`

  Número de fragmentos na tabela; normalmente igual a `tab_partitions`; para tabelas totalmente replicadas iguais a `tab_partitions * [number of node groups]`

- `current_scan_count`

  Número atual de varreduras ativas

- `scan_count_wait`

  Número atual de varreduras aguardando para serem realizadas antes que `ALTER TABLE` possa concluir.

- `is_reorg_ongoing`

  Se a tabela está sendo reorganizada atualmente (1 se verdadeiro)
