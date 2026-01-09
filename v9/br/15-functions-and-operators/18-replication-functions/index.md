## 14.18 Funções de Replicação

14.18.1 Funções de Replicação em Grupo

14.18.2 Funções Usadas com Identificadores de Transação Global (GTIDs)

14.18.3 Funções de Failover do Canal de Replicação Assíncrona

14.18.4 Funções de Sincronização Baseadas em Posição

As funções descritas nas seções a seguir são usadas com a Replicação do MySQL.

**Tabela 14.24 Funções de Replicação**

<table frame="box" rules="all" summary="Uma referência que lista as funções usadas com a replicação do MySQL.">
<tr><th>Nome</th> <th>Descrição</th> <th>Deprecado</th> </tr>
<tr><th><a class="link" href="replication-functions-async-failover.html#function_asynchronous-connection-failover-add-managed"><code>asynchronous_connection_failover_add_managed()</code></a></th> <td> Adiciona informações de configuração do servidor de origem do grupo ao grupo de listas de origem de canais de replicação </td> <td></td> </tr>
<tr><th><a class="link" href="replication-functions-async-failover.html#function_asynchronous-connection-failover-add-source"><code>asynchronous_connection_failover_add_source()</code></a></th> <td> Adiciona informações de configuração do servidor de origem ao grupo de listas de origem de canais de replicação </td> <td></td> </tr>
<tr><th><a class="link" href="replication-functions-async-failover.html#function_asynchronous-connection-failover-delete-managed"><code>asynchronous_connection_failover_delete_managed()</code></a></th> <td> Remove um grupo gerenciado do grupo de listas de origem de canais de replicação </td> <td></td> </tr>
<tr><th><a class="link" href="replication-functions-async-failover.html#function_asynchronous-connection-failover-delete-source"><code>asynchronous_connection_failover_delete_source()</code></a></th> <td> Remove um servidor de origem do grupo de listas de origem de canais de replicação </td> <td></td> </tr>
<tr><th><a class="link" href="replication-functions-async-failover.html#function_asynchronous-connection-failover-reset"><code>asynchronous_connection_failover_reset()</code></a></th> <td> Remove todas as configurações relacionadas à replicação de falha de falha de conexão assíncrona </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-member-actions.html#function_group-replication-disable-member-action"><code>group_replication_disable_member_action()</code></a></th> <td> Desabilita a ação do membro para o evento especificado </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-member-actions.html#function_group-replication-enable-member-action"><code>group_replication_enable_member_action()</code></a></th> <td> Habilita a ação do membro para o evento especificado </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-communication-protocol.html#function_group-replication-get-communication-protocol"><code>group_replication_get_communication_protocol()</code></a></th> <td> Obtém a versão do protocolo de comunicação da replicação do grupo atualmente em uso </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-maximum-consensus.html#function_group-replication-get-write-concurrency"><code>group_replication_get_write_concurrency()</code></a></th> <td> Obtém o número máximo de instâncias de consenso atualmente configuradas para o grupo </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-member-actions.html#function_group-replication-reset-member-actions"><code>group_replication_reset_member_actions()</code></a></th> <td> Redefinir todas as ações do membro para os valores padrão e o número de versão de configuração 1 </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-new-primary.html#function_group-replication-set-as-primary"><code>group_replication_set_as_primary()</code></a></th> <td> Torna um membro específico o primário </td> <td></td> </tr>
<tr><th><a class="link" href="group-replication-functions-for-communication-protocol.html#function_group-replication-set-communication-protocol"><code>group_replication_set_communication_protocol()</code></a></th> <td> Define a versão para o protocolo de comunicação da replicação do grupo a ser usada 