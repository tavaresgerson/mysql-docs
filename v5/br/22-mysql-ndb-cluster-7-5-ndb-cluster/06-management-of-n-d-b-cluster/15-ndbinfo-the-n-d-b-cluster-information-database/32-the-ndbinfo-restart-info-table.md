#### 21.6.15.32 A Tabela ndbinfo restart_info

A tabela `restart_info` contém informações sobre operações de restart de nó (node restart). Cada entrada na tabela corresponde a um relatório de status de restart de nó em tempo real de um nó de dados com o `node_id` fornecido. Apenas o relatório mais recente para um determinado nó é exibido.

A tabela `restart_info` contém as seguintes colunas:

* `node_id`

  ID do Nó no Cluster

* `node_restart_status`

  Status do Nó; veja o texto para os valores. Cada um corresponde a um valor possível de `node_restart_status_int`.

* `node_restart_status_int`

  Código de status do Nó; veja o texto para os valores.

* `secs_to_complete_node_failure`

  Tempo em segundos para completar o tratamento de falha do nó (node failure)

* `secs_to_allocate_node_id`

  Tempo em segundos desde a conclusão da falha do nó até a alocação do ID do nó

* `secs_to_include_in_heartbeat_protocol`

  Tempo em segundos desde a alocação do ID do nó até a inclusão no protocolo heartbeat

* `secs_until_wait_for_ndbcntr_master`

  Tempo em segundos desde a inclusão no protocolo heartbeat até o início da espera pelo master [`NDBCNTR`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbcntr.html)

* `secs_wait_for_ndbcntr_master`

  Tempo em segundos gasto esperando para ser aceito pelo master [`NDBCNTR`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbcntr.html) para iniciar

* `secs_to_get_start_permitted`

  Tempo em segundos decorrido desde o recebimento da permissão de início do master até que todos os nós tenham aceitado o início deste nó

* `secs_to_wait_for_lcp_for_copy_meta_data`

  Tempo em segundos gasto esperando a conclusão do LCP antes de copiar metadados

* `secs_to_copy_meta_data`

  Tempo em segundos necessário para copiar metadados do master para o nó que está reiniciando

* `secs_to_include_node`

  Tempo em segundos esperado pelo GCP e inclusão de todos os nós nos protocolos

* `secs_starting_node_to_request_local_recovery`

  Tempo em segundos que o nó que acabou de iniciar gastou esperando para solicitar local recovery

* `secs_for_local_recovery`

  Tempo em segundos necessário para o local recovery pelo nó que acabou de iniciar

* `secs_restore_fragments`

  Tempo em segundos necessário para restaurar fragments de arquivos LCP

* `secs_undo_disk_data`

  Tempo em segundos necessário para executar o log de undo na parte dos dados em disco dos registros

* `secs_exec_redo_log`

  Tempo em segundos necessário para executar o log de redo em todos os fragments restaurados

* `secs_index_rebuild`

  Tempo em segundos necessário para reconstruir Indexes nos fragments restaurados

* `secs_to_synchronize_starting_node`

  Tempo em segundos necessário para sincronizar o nó que está iniciando com os nós ativos (live nodes)

* `secs_wait_lcp_for_restart`

  Tempo em segundos necessário para o início e conclusão do LCP antes que o restart fosse concluído

* `secs_wait_subscription_handover`

  Tempo em segundos gasto esperando pela transferência (handover) de replication subscriptions

* `total_restart_secs`

  Número total de segundos desde a falha do nó até o novo início do nó

##### Notas

A lista a seguir contém os valores definidos para a coluna `node_restart_status_int` com seus nomes de status internos (entre parênteses) e as mensagens correspondentes exibidas na coluna `node_restart_status`:

* `0` (`ALLOCATED_NODE_ID`)

  `Allocated node id` (ID de nó alocado)

* `1` (`INCLUDED_IN_HB_PROTOCOL`)

  `Included in heartbeat protocol` (Incluído no protocolo heartbeat)

* `2` (`NDBCNTR_START_WAIT`)

  `Wait for NDBCNTR master to permit us to start` (Espera pelo master NDBCNTR para permitir nosso início)

* `3` (`NDBCNTR_STARTED`)

  `NDBCNTR master permitted us to start` (Master NDBCNTR permitiu nosso início)

* `4` (`START_PERMITTED`)

  `All nodes permitted us to start` (Todos os nós permitiram nosso início)

* `5` (`WAIT_LCP_TO_COPY_DICT`)

  `Wait for LCP completion to start copying metadata` (Espera pela conclusão do LCP para iniciar a cópia de metadados)

* `6` (`COPY_DICT_TO_STARTING_NODE`)

  `Copying metadata to starting node` (Copiando metadados para o nó que está iniciando)

* `7` (`INCLUDE_NODE_IN_LCP_AND_GCP`)

  `Include node in LCP and GCP protocols` (Incluir nó nos protocolos LCP e GCP)

* `8` (`LOCAL_RECOVERY_STARTED`)

  `Restore fragments ongoing` (Restauração de fragments em andamento)

* `9` (`COPY_FRAGMENTS_STARTED`)

  `Synchronizing starting node with live nodes` (Sincronizando o nó que está iniciando com os nós ativos)

* `10` (`WAIT_LCP_FOR_RESTART`)

  `Wait for LCP to ensure durability` (Espera pelo LCP para garantir durabilidade)

* `11` (`WAIT_SUMA_HANDOVER`)

  `Wait for handover of subscriptions` (Espera pela transferência de subscriptions)

* `12` (`RESTART_COMPLETED`)

  `Restart completed` (Restart concluído)

* `13` (`NODE_FAILED`)

  `Node failed, failure handling in progress` (Nó falhou, tratamento de falha em andamento)

* `14` (`NODE_FAILURE_COMPLETED`)

  `Node failure handling completed` (Tratamento de falha do nó concluído)

* `15` (`NODE_GETTING_PERMIT`)

  `All nodes permitted us to start` (Todos os nós permitiram nosso início)

* `16` (`NODE_GETTING_INCLUDED`)

  `Include node in LCP and GCP protocols` (Incluir nó nos protocolos LCP e GCP)

* `17` (`NODE_GETTING_SYNCHED`)

  `Synchronizing starting node with live nodes` (Sincronizando o nó que está iniciando com os nós ativos)

* `18` (`NODE_GETTING_LCP_WAITED`)

  [nenhum]

* `19` (`NODE_ACTIVE`)

  `Restart completed` (Restart concluído)

* `20` (`NOT_DEFINED_IN_CLUSTER`)

  [nenhum]

* `21` (`NODE_NOT_RESTARTED_YET`)

  `Initial state` (Estado inicial)

Os números de status de 0 a 12 aplicam-se apenas aos nós master; os demais mostrados na tabela aplicam-se a todos os nós de dados que estão reiniciando. Os números de status 13 e 14 definem estados de falha de nó; 20 e 21 ocorrem quando nenhuma informação sobre o restart de um determinado nó está disponível.

Veja também [Section 21.6.4, “Summary of NDB Cluster Start Phases”](mysql-cluster-start-phases.html "21.6.4 Summary of NDB Cluster Start Phases").