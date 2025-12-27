### 20.9.2 Variáveis de Status de Replicação em Grupo

Esta seção descreve as variáveis de status que fornecem informações sobre a Replicação em Grupo.

As variáveis de status e seus significados estão listados aqui:

* `Gr_all_consensus_proposals_count`

  Soma de todas as propostas iniciadas e encerradas neste nó.

* `Gr_all_consensus_time_sum`

  O tempo total decorrido para todas as rodadas de consenso iniciadas e concluídas neste nó. Comparando este valor com `Gr_all_consensus_proposals_count`, podemos determinar se um determinado tempo de consenso tem uma tendência ascendente, o que pode sinalizar um problema.

* `Gr_certification_garbage_collector_count`

  Número de vezes que a coleta de lixo de certificação foi executada.

* `Gr_certification_garbage_collector_time_sum`

  Soma dos tempos em microsegundos gastos pela coleta de lixo de certificação.

* `Gr_consensus_bytes_received_sum`

  Soma de todos os bytes de nível de socket recebidos de nós do grupo que têm este nó como destino.

* `Gr_consensus_bytes_sent_sum`

  Soma de todos os bytes de nível de socket originados neste nó que foram enviados para todos (outros) nós do grupo. Mais dados são relatados aqui do que para mensagens enviadas, pois elas são multiplexadas e enviadas para cada membro.

  Por exemplo, se temos um grupo com três membros e enviamos uma mensagem de 100 bytes, este valor representa 300 bytes, pois enviamos 100 bytes para cada nó.

* `Gr_control_messages_sent_count`

  Número de mensagens de controle enviadas por este membro.

* `Gr_control_messages_sent_bytes_sum`

  Soma do número de bytes usados em mensagens de controle enviadas por este membro; este é o tamanho em linha.

* `Gr_control_messages_sent_roundtrip_time_sum`

Soma dos tempos de ida e volta em microsegundos para as mensagens de controle enviadas por este membro; uma ida e volta é medida entre o envio e a entrega da mensagem no remetente. Isso deve fornecer o tempo entre o envio e a entrega das mensagens de controle para a maioria dos membros do grupo, incluindo o remetente.

* `Gr_data_messages_sent_count`

  Este é o número de mensagens de dados de transação enviadas por este membro.

* `Gr_data_messages_sent_bytes_sum`

  Soma em bytes usados por mensagens de dados enviadas por este membro; este é o tamanho em linha.

* `Gr_data_messages_sent_roundtrip_time_sum`

  Soma dos tempos de ida e volta em microsegundos para as mensagens de dados enviadas por este membro; uma ida e volta é medida entre o envio e a entrega da mensagem no remetente. Isso deve fornecer o tempo entre o envio e a entrega das mensagens de dados para a maioria dos membros do grupo, incluindo o remetente.

* `Gr_empty_consensus_proposals_count`

  Soma de todos os rounds de propostas vazias que foram iniciados e terminados neste nó.

* `Gr_extended_consensus_count`

  O número de rodadas de 3 fases completas que este nó iniciou. Se este número crescer ao longo do tempo, isso significa que pelo menos um nó está tendo problemas para responder às propostas, seja por estar executando lentamente ou por problemas de rede. Use este valor juntamente com a coluna `count_member_failure_suspicions` da tabela `replication_group_communication_information` do Schema de Desempenho quando diagnosticar tais problemas.

* `Gr_flow_control_throttle_active_count`

  Número de sessões atualmente sendo reprimidas pelo mecanismo de controle de fluxo de replicação em grupo.

Fornecido pelo componente de estatísticas de controle de fluxo de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”, para obter mais informações.

* `Gr_flow_control_throttle_count`

  O número de transações que foram controladas pelo mecanismo de controle de fluxo de replicação em grupo desde que o servidor foi reiniciado pela última vez.

  Fornecido pelo componente de estatísticas de controle de fluxo de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”, para obter mais informações.

* `Gr_flow_control_throttle_last_throttle_timestamp`

  Um timestamp que mostra quando uma transação foi controlada pela última vez pelo mecanismo de controle de fluxo de replicação em grupo.

  Fornecido pelo componente de estatísticas de controle de fluxo de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”, para obter mais informações.

* `Gr_flow_control_throttle_time_sum`

  O total de tempo que as transações foram controladas pelo mecanismo de controle de fluxo de replicação em grupo desde que o servidor foi reiniciado pela última vez, em microsegundos.

  Fornecido pelo componente de estatísticas de controle de fluxo de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”, para obter mais informações.

* `Gr_last_consensus_end_timestamp`

  O tempo em que a última proposta de consenso foi aprovada, em formato timestamp. Isso pode ser um indicador de se o grupo está fazendo progresso lento ou parou.

* `Gr_latest_primary_election_by_most_uptodate_member_timestamp`

  Este timestamp é atualizado sempre que um novo primário é escolhido usando o método de seleção mais atualizado.

Fornecido pelo componente de eleição primária de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.4, “Componente de eleição primária de replicação em grupo”, para obter mais informações.

* `Gr_latest_primary_election_by_most_uptodate_members_trx_delta`

  A diferença no número de transações entre a seleção primária mais atualizada e a secundária mais atualizada, quando a seleção primária mais atualizada foi usada. Este é o atraso de transações que estão esperando para serem processadas pelo secundário indicado.

  Fornecido pelo componente de gerenciamento de recursos de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.4, “Componente de eleição primária de replicação em grupo”, para obter mais informações.

* `Gr_resource_manager_applier_channel_eviction_timestamp`

  O timestamp da última vez que este membro foi expulso do grupo devido a problemas com o atraso do canal de aplicador.

  Fornecido pelo componente de gerenciamento de recursos de replicação em grupo, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Componente de gerenciamento de recursos de replicação em grupo”.

* `Gr_resource_manager_applier_channel_lag`

  Tempo, em segundos, pelo qual o canal de aplicador atualmente está atrasado. Este é o comprimento do atraso na aplicação das alterações ao sistema.

  Fornecido pelo componente de gerenciamento de recursos de replicação em grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.3, “Componente de gerenciamento de recursos de replicação em grupo”, para obter mais informações.

* `Gr_resource_manager_applier_channel_threshold_hits`

  O número de amostras que excederam `group_replication_resource_manager.applier_channel_lag`. Este métrico pode ajudar a identificar problemas frequentes de atraso do aplicador.

Este valor é zerado sempre que o membro é expulso.

Fornecido pelo componente Gerenciador de Recursos de Replicação em Grupo, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_resource_manager_channel_lag_monitoring_error_timestamp`

  O timestamp da última vez que este membro encontrou um erro ao tentar obter um valor para o atraso do canal. Vazio se nenhum erro ocorrer.

  Fornecido pelo componente Gerenciador de Recursos de Replicação em Grupo, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_resource_manager_memory_eviction_timestamp`

  O timestamp da última expulsão deste membro causada pelo uso excessivo de memória.

  Fornecido pelo componente Gerenciador de Recursos de Replicação em Grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos de Replicação em Grupo”, para mais informações.

* `Gr_resource_manager_memory_monitoring_error_timestamp`

  O timestamp da última vez que este membro encontrou um erro ao tentar obter um valor para o uso de memória do sistema. Vazio se nenhum erro ocorrer.

  Fornecido pelo componente Gerenciador de Recursos de Replicação em Grupo, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_resource_manager_memory_threshold_hits`

  O número de amostras que excederam `group_replication_resource_manager.memory_used_limit` desde a última vez que este membro foi expulso.

  Fornecido pelo componente Gerenciador de Recursos de Replicação em Grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_resource_manager_memory_used`

  A porcentagem de memória de sistema disponível atualmente em uso.

Fornecido pelo componente Group Replication Resource Manager, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos de Replicação em Grupo”, para obter mais informações.

* `Gr_resource_manager_recovery_channel_eviction_timestamp`

  O timestamp da última expulsão causada pelo atraso do canal de recuperação.

  Fornecido pelo componente Group Replication Resource Manager, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_resource_manager_recovery_channel_lag`

  Número de segundos em que o canal de recuperação deste secundário está atrasado em relação ao primário.

  Fornecido pelo componente Group Replication Resource Manager, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos de Replicação em Grupo”, para obter mais informações.

* `Gr_resource_manager_recovery_channel_threshold_hits`

  O número de amostras que excederam `group_replication_resource_manager.recovery_channel_lag`. Esta métrica pode ajudar a identificar problemas frequentes de atraso no canal de recuperação.

  Se o membro for expulso, esse valor é redefinido para `0`.

  Fornecido pelo componente Group Replication Resource Manager, parte da Edição Empresarial do MySQL. Para mais informações, consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos de Replicação em Grupo”.

* `Gr_total_messages_sent_count`

  O número de mensagens de alto nível enviadas por este nó para o grupo. Essas são as mensagens recebidas da API para propor ao grupo. O mecanismo de agrupamento XCom agrupa essas mensagens e as propõe juntas. O valor mostrado para essa variável reflete o número de mensagens antes do agrupamento.

* `Gr_transactions_consistency_after_sync_count`

Número de transações em secundários que aguardaram para começar, enquanto aguardavam que transações do primário com `group_replication_consistency` igual a `AFTER` ou `BEFORE_AND_AFTER` fossem confirmadas.

* `Gr_transactions_consistency_after_sync_time_sum`

  Soma dos tempos em microsegundos que as transações em secundários aguardaram transações do primário com `group_replication_consistency` igual a `AFTER` ou `BEFORE_AND_AFTER` para serem confirmadas, antes de começar.

* `Gr_transactions_consistency_after_termination_count`

  Número de transações executadas com `group_replication_consistency` igual a `AFTER` ou `BEFORE_AND_AFTER`.

* `Gr_transactions_consistency_after_termination_time_sum`

  Soma do tempo em microsegundos entre a entrega da transação executada com `group_replication_consistency` igual a `AFTER` ou `BEFORE_AND_AFTER` e o reconhecimento pelos outros membros do grupo de que a transação está pronta.

Este valor não inclui o tempo de ida e volta da transmissão da transação.

* `Gr_transactions_consistency_before_begin_count`

  Número de transações executadas com `group_replication_consistency` igual a `BEFORE` ou `BEFORE_AND_AFTER`.

* `Gr_transactions_consistency_before_begin_time_sum`

  Soma do tempo em microsegundos que o membro aguardou até que seu canal de aplicador de replicação em grupo fosse consumido antes de executar a transação com `group_replication_consistency` igual a `BEFORE` ou `BEFORE_AND_AFTER`.

Essas variáveis de status têm escopo de membro, pois refletem o que o membro local observa. Elas são redefinidas na inicialização do grupo, na junção de um novo membro, na reinserção automática de um membro existente e no reinício do servidor.

A lista exibida anteriormente inclui variáveis de status fornecidas pelo componente de Estatísticas de Controle de Fluxo de Replicação por Grupo e pelo componente Gerenciador de Recursos de Replicação por Grupo. Para obter mais informações sobre esses componentes, consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação por Grupo”, e a Seção 7.5.6.3, “Componente Gerenciador de Recursos de Replicação por Grupo”.