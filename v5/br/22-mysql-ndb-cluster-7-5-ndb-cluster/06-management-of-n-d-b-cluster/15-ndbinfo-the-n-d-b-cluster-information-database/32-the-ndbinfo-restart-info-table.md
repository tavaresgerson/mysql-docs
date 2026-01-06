#### 21.6.15.32 Tabela ndbinfo restart\_info

A tabela `restart_info` contém informações sobre operações de reinício de nós. Cada entrada na tabela corresponde a um relatório de status de reinício de nó em tempo real de um nó de dados com o ID de nó fornecido. Apenas o relatório mais recente para qualquer nó específico é exibido.

A tabela `restart_info` contém as seguintes colunas:

- `node_id`

  ID do nó no cluster

- `node_restart_status`

  Status do nó; consulte o texto para os valores. Cada um deles corresponde a um valor possível de `node_restart_status_int`.

- `node_restart_status_int`

  Código de status do nó; consulte o texto para os valores.

- `secs_to_complete_node_failure`

  Tempo em segundos para completar o gerenciamento de falha de nó

- `secs_to_allocate_node_id`

  Tempo em segundos desde a conclusão da falha do nó até a alocação do ID do nó

- `secs_to_include_in_heartbeat_protocol`

  Tempo em segundos desde a alocação do ID do nó até a inclusão no protocolo de batida de coração

- `segundos_até_esperar_por_ndbcntr_master`

  Tempo em segundos desde que foi incluído no protocolo de batimentos cardíacos até o início da espera pelo mestre `NDBCNTR`

- `secs_wait_for_ndbcntr_master`

  Tempo em segundos gasto esperando ser aceito pelo mestre `NDBCNTR` para iniciar

- `secs_to_get_start_permitted`

  Tempo em segundos decorrido desde a recepção da permissão para iniciar a partir do mestre até que todos os nós tenham aceitado o início deste nó

- `secs_to_wait_for_lcp_for_copy_meta_data`

  Tempo em segundos gasto esperando a conclusão do LCP antes de copiar os metadados

- `secs_to_copy_meta_data`

  Tempo em segundos necessário para copiar metadados do mestre para o nó recém-iniciado

- `secs_to_include_node`

  Tempo em segundos aguardado pelo GCP e inclusão de todos os nós nos protocolos

- `secs_starting_node_to_request_local_recovery`

  Tempo em segundos que o nó recém-iniciado passou esperando para solicitar a recuperação local

- `secs_for_local_recovery`

  Tempo em segundos necessário para a recuperação local pelo nó que acabou de começar

- `secs_restore_fragments`

  Tempo em segundos necessário para restaurar fragmentos de arquivos LCP

- `secs_undo_disk_data`

  Tempo em segundos necessário para executar o registro de desfazer na parte de dados do disco dos registros

- `secs_exec_redo_log`

  Tempo em segundos necessário para executar o log de refazer em todos os fragmentos restaurados

- `secs_index_rebuild`

  Tempo em segundos necessário para reconstruir índices em fragmentos restaurados

- `secs_to_synchronize_starting_node`

  Tempo em segundos necessário para sincronizar o nó inicial a partir dos nós ao vivo

- `secs_wait_lcp_for_restart`

  Tempo em segundos necessário para o início e conclusão do LCP antes do reinício ser concluído

- `secs_wait_subscription_handover`

  Tempo em segundos gasto esperando pela entrega das assinaturas de replicação

- `total_restart_secs`

  Número total de segundos entre a falha do nó e o início do nó novamente

##### Notas

A lista a seguir contém os valores definidos para a coluna `node_restart_status_int` com seus nomes de status internos (em parênteses) e as mensagens correspondentes exibidas na coluna `node_restart_status`:

- `0` (`ALLOCATED_NODE_ID`)

  `ID de nó atribuído`

- `1` (`INCLUÍDO_NO_PROTOCOLO_HB`)

  Incluído no protocolo de batimentos cardíacos

- `2` (`NDBCNTR_START_WAIT`)

  "Aguarde o mestre NDBCNTR nos permitir começar"

- `3` (`NDBCNTR_STARTED`)

  O mestre NDBCNTR nos permitiu começar

- `4` (`START_PERMITTED`)

  "Todos os nós nos permitiram começar"

- `5` (`WAIT_LCP_TO_COPY_DICT`)

  "Aguarde a conclusão do LCP para começar a copiar os metadados"

- `6` (`COPY_DICT_TO_STARTING_NODE`)

  `Copiar metadados para o nó inicial`

- `7` (`INCLUDE_NODE_IN_LCP_AND_GCP`)

  `Incluir nó nos protocolos LCP e GCP`

- `8` (`LOCAL_RECOVERY_STARTED`)

  `Restaurar fragmentos em andamento`

- `9` (`COPY_FRAGMENTS_STARTED`)

  `Sincronizando o nó inicial com os nós ao vivo`

- `10` (`WAIT_LCP_FOR_RESTART`)

  "Aguarde o LCP para garantir a durabilidade"

- `11` (`WAIT_SUMA_HANDOVER`)

  "Aguarde a entrega das assinaturas"

- `12` (`RESTART_COMPLETED`)

  `Reinício concluído`

- `13` (`NODE_FAILED`)

  "O nó falhou, a gestão do erro está em andamento"

- `14` (`NODE_FAILURE_COMPLETED`)

  "O tratamento de falha no nó foi concluído"

- `15` (`NODE_GETTING_PERMIT`)

  "Todos os nós nos permitiram começar"

- `16` (`NODE_GETTING_INCLUDED`)

  `Incluir nó nos protocolos LCP e GCP`

- `17` (`NODE_GETTING_SYNCHED`)

  `Sincronizando o nó inicial com os nós ao vivo`

- `18` (`NODE_GETTING_LCP_WAITED`)

  \[nenhum]

- `19` (`NODE_ACTIVE`)

  `Reinício concluído`

- `20` (`NOT_DEFINIDO_NO_CLUSTERO`)

  \[nenhum]

- `21` (`NODE_NOT_RESTARTED_YET`)

  "Estado inicial"

Os números de status de 0 a 12 se aplicam apenas aos nós principais; o restante dos números mostrados na tabela se aplica a todos os nós de dados que estão sendo reiniciados. Os números de status 13 e 14 definem os estados de falha do nó; os números 20 e 21 ocorrem quando não há informações sobre o reinício de um nó específico.

Veja também Seção 21.6.4, “Resumo das Fases de Início do NDB Cluster”.
