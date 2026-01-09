#### 21.6.15.36 A tabela ndbinfo table_distribution_status

A tabela `table_distribution_status` fornece informações sobre o progresso da distribuição de tabelas para tabelas `NDB`.

A tabela `table_distribution_status` contém as seguintes colunas:

- `node_id`

  ID do nó

- `table_id`

  Tabela ID

- `tab_copy_status`

  Status da cópia dos dados de distribuição da tabela para o disco; uma das opções `IDLE`, `SR_PHASE1_READ_PAGES`, `SR_PHASE2_READ_TABLE`, `SR_PHASE3_COPY_TABLE`, `REMOVE_NODE`, `LCP_READ_TABLE`, `COPY_TAB_REQ`, `COPY_NODE_STATE`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP`, `ALTER_TABLE`, `COPY_TO_SAVE` ou `GET_TABINFO`

- `tab_update_status`

  Status da atualização dos dados de distribuição da tabela; um dos `IDLE`, `LOCAL_CHECKPOINT`, `LOCAL_CHECKPOINT_QUEUED`, `REMOVE_NODE`, `COPY_TAB_REQ`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP` ou `CALLBACK`

- `tab_lcp_status`

  Status da tabela LCP; um dos valores `ATIVO` (esperando por o ponto de verificação local ser executado), `ESCREVENDO NO ARQUIVO` (o ponto de verificação foi executado, mas ainda não foi escrito no disco) ou `CONCLUSO` (o ponto de verificação foi executado e persistido no disco)

- `tab_status`

  Status interno da tabela; uma das opções `ATIVO` (a tabela existe), `CRIANDO` (a tabela está sendo criada) ou `DESCARTANDO` (a tabela está sendo descartada)

- `tab_storage`

  Recuperabilidade da tabela; uma das opções é `NORMAL` (totalmente recuperável com registro de redo e checkpointing), `NOLOGGING` (recuperável após o desligamento do nó, após o desligamento do cluster) ou `TEMPORARY` (não recuperável)

- `tab_partitions`

  Número de partições na tabela

- `tab_fragments`

  Número de fragmentos na tabela; normalmente igual a `tab_partitions`; para tabelas totalmente replicadas iguais a `tab_partitions * [número de grupos de nós]`

- `contagem_de_varredura_atual`

  Número atual de varreduras ativas

- `scan_count_wait`

  Número atual de varreduras aguardando para serem executadas antes que a `ALTER TABLE` possa ser concluída.

- `is_reorg_ongoing`

  Se a tabela está sendo reorganizada atualmente (1 se verdadeiro)

##### Notas

A tabela `table_distribution_status` foi adicionada no NDB 7.5.4.
