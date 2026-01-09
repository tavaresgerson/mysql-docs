### 14.18.1 Funções de Replicação em Grupo

14.18.1.1 Função que Configura a Primazia da Replicação em Grupo

14.18.1.2 Funções que Configuram o Modo de Replicação em Grupo

14.18.1.3 Funções para Inspecionar e Configurar as Instâncias Máximas de Consenso de um Grupo

14.18.1.4 Funções para Inspecionar e Definir a Versão do Protocolo de Comunicação da Replicação em Grupo

14.18.1.5 Funções para Definir e Redefinir as Ações dos Membros da Replicação em Grupo

As funções descritas nas seções a seguir são utilizadas com a Replicação em Grupo.

**Tabela 14.25 Funções de Replicação em Grupo**

<table frame="box" rules="all" summary="Uma referência que lista as funções usadas com a replicação de grupo do MySQL.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>group_replication_disable_member_action()</code></td> <td> Desabilitar ação de membro para evento especificado </td> </tr><tr><td><code>group_replication_enable_member_action()</code></td> <td> Habilitar ação de membro para evento especificado </td> </tr><tr><td><code>group_replication_get_communication_protocol()</code></td> <td> Obter a versão do protocolo de comunicação da replicação de grupo atualmente em uso </td> </tr><tr><td><code>group_replication_get_write_concurrency()</code></td> <td> Obter o número máximo de instâncias de consenso atualmente configuradas para o grupo </td> </tr><tr><td><code>group_replication_reset_member_actions()</code></td> <td> Redefinir todas as ações de membro para os valores padrão e o número de versão da configuração para 1 </td> </tr><tr><td><code>group_replication_set_as_primary()</code></td> <td> Tornar um membro específico do grupo o primário </td> </tr><tr><td><code>group_replication_set_communication_protocol()</code></td> <td> Definir a versão para o protocolo de comunicação da replicação de grupo a ser usada </td> </tr><tr><td><code>group_replication_set_write_concurrency()</code></td> <td> Definir o número máximo de instâncias de consenso que podem ser executadas em paralelo </td> </tr><tr><td><code>group_replication_switch_to_multi_primary_mode()</code></td> <td> Altera o modo de um grupo que está em modo único primário para modo multi-primário </td> </tr><tr><td><code>group_replication_switch_to_single_primary_mode()</code></td> <td> Altera o modo de um grupo que está em modo multi-primário para modo único primário </td> </tr></tbody></table>