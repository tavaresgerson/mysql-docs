#### 25.6.15.53 Tabela ndbinfo restart_info

A tabela `restart_info` contém informações sobre operações de reinício de nós. Cada entrada na tabela corresponde a um relatório de status de reinício de nó em tempo real de um nó de dados com o ID de nó fornecido. Apenas o relatório mais recente para qualquer nó dado é mostrado.

A tabela `restart_info` contém as seguintes colunas:

* `node_id`

  ID de nó no cluster

* `node_restart_status`

  Status do nó; veja o texto para os valores. Cada um desses corresponde a um valor possível de `node_restart_status_int`.

* `node_restart_status_int`

  Código de status de nó; veja o texto para os valores.

* `secs_to_complete_node_failure`

  Tempo em segundos para completar o tratamento da falha do nó

* `secs_to_allocate_node_id`

  Tempo em segundos após a conclusão da falha do nó até a alocação do ID de nó

* `secs_to_include_in_heartbeat_protocol`

  Tempo em segundos após a alocação do ID de nó até a inclusão no protocolo de batida de coração

* `secs_until_wait_for_ndbcntr_master`

  Tempo em segundos após a inclusão no protocolo de batida de coração até a espera pelo `NDBCNTR` mestre

* `secs_wait_for_ndbcntr_master`

  Tempo em segundos gasto esperando para ser aceito pelo `NDBCNTR` mestre para começar

* `secs_to_get_start_permitted`

  Tempo em segundos decorrido desde a recepção da permissão para iniciar do mestre até que todos os nós tenham aceitado o início deste nó

* `secs_to_wait_for_lcp_for_copy_meta_data`

  Tempo em segundos gasto esperando pela conclusão do LCP antes da cópia dos metadados

* `secs_to_copy_meta_data`

  Tempo em segundos necessário para copiar os metadados do mestre para o nó recém-iniciando

* `secs_to_include_node`

  Tempo em segundos aguardado para que o GCP e a inclusão de todos os nós nos protocolos ocorram

* `secs_starting_node_to_request_local_recovery`

Tempo em segundos que o nó recém-iniciado passou esperando para solicitar a recuperação local

* `secs_for_local_recovery`

  Tempo em segundos necessário para a recuperação local pelo nó recém-iniciado

* `secs_restore_fragments`

  Tempo em segundos necessário para restaurar fragmentos de arquivos LCP

* `secs_undo_disk_data`

  Tempo em segundos necessário para executar o log de desfazer na parte de dados do disco de registros

* `secs_exec_redo_log`

  Tempo em segundos necessário para executar o log de refazer em todos os fragmentos restaurados

* `secs_index_rebuild`

  Tempo em segundos necessário para reconstruir índices em fragmentos restaurados

* `secs_to_synchronize_starting_node`

  Tempo em segundos necessário para sincronizar o nó inicializador dos nós ativos

* `secs_wait_lcp_for_restart`

  Tempo em segundos necessário para o início e término do LCP antes que o reinício fosse concluído

* `secs_wait_subscription_handover`

  Tempo em segundos gasto esperando pela transferência de assinaturas de replicação

* `total_restart_secs`

  Número total de segundos da falha do nó até que o nó seja iniciado novamente

##### Notas

A lista a seguir contém valores definidos para a coluna `node_restart_status_int` com seus nomes de status internos (em parênteses) e as mensagens correspondentes mostradas na coluna `node_restart_status`:

* `0` (`ALLOCATED_NODE_ID`)

  `ID de nó alocado`

* `1` (`INCLUDED_IN_HB_PROTOCOL`)

  `Incluído no protocolo de batida de coração`

* `2` (`NDBCNTR_START_WAIT`)

  `Aguarde o mestre NDBCNTR para nos permitir iniciar`

* `3` (`NDBCNTR_STARTED`)

  `O mestre NDBCNTR nos permitiu iniciar`

* `4` (`START_PERMITTED`)

  `Todos os nós nos permitiram iniciar`

* `5` (`WAIT_LCP_TO_COPY_DICT`)

  `Aguarde a conclusão do LCP para iniciar a cópia de metadados`

* `6` (`COPY_DICT_TO_STARTING_NODE`)

  `Copiando metadados para o nó inicializador`

* `7` (`INCLUDE_NODE_IN_LCP_AND_GCP`)

`Incluir nó nos protocolos LCP e GCP`

* `8` (`LOCAL_RECOVERY_STARTED`)

  `Restauração de fragmentos em andamento`

* `9` (`COPY_FRAGMENTS_STARTED`)

  `Sincronizando o nó inicial com os nós ativos`

* `10` (`WAIT_LCP_FOR_RESTART`)

  `Aguarde o LCP para garantir a durabilidade`

* `11` (`WAIT_SUMA_HANDOVER`)

  `Aguarde a transferência de assinaturas`

* `12` (`RESTART_COMPLETED`)

  `Reinício concluído`

* `13` (`NODE_FAILED`)

  `O nó falhou, a recuperação está em andamento`

* `14` (`NODE_FAILURE_COMPLETED`)

  `Recuperação do nó falhado concluída`

* `15` (`NODE_GETTING_PERMIT`)

  `Todos os nós nos permitiram iniciar`

* `16` (`NODE_GETTING_INCLUDED`)

  `Incluir o nó nos protocolos LCP e GCP`

* `17` (`NODE_GETTING_SYNCHED`)

  `Sincronizando o nó inicial com os nós ativos`

* `18` (`NODE_GETTING_LCP_WAITED`)

  [nenhum]

* `19` (`NODE_ACTIVE`)

  `Reinício concluído`

* `20` (`NOT_DEFINED_IN_CLUSTER`)

  [nenhum]

* `21` (`NODE_NOT_RESTARTED_YET`)

  `Estado inicial`

Os números de status de 0 a 12 aplicam-se apenas aos nós mestre; o restante dos números mostrados na tabela aplica-se a todos os nós de dados que estão sendo reiniciados. Os números de status 13 e 14 definem os estados de falha do nó; os números 20 e 21 ocorrem quando não há informações sobre o reinício de um nó específico.

Veja também a Seção 25.6.4, “Resumo das fases de início do cluster NDB”.