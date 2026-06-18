#### 29.12.11.12 A tabela replication\_group\_communication\_information

Esta tabela mostra as opções de configuração do grupo para todo o grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada.

A tabela `replication_group_communication_information` tem essas colunas:

- `WRITE_CONCURRENCY`

  O número máximo de instâncias de consenso que o grupo pode executar em paralelo. O valor padrão é 10. Consulte a Seção 20.5.1.3, “Usando o Consenso de Escrita de Grupo de Replicação de Grupo”.

- `PROTOCOL_VERSION`

  A versão do protocolo de comunicação de replicação de grupo, que determina quais capacidades de mensagens são usadas. Isso é configurado para acomodar a versão mais antiga do servidor MySQL que você deseja que o grupo suporte. Veja a Seção 20.5.1.4, “Configurando a Versão do Protocolo de Comunicação de um Grupo”.

- `WRITE_CONSENSUS_LEADERS_PREFERRED`

  O líder ou líderes que o mecanismo de comunicação do grupo instruiu a usar para alcançar o consenso. Para um grupo no modo de primário único com a variável de sistema `group_replication_paxos_single_leader` definida como `ON` e a versão do protocolo de comunicação definida como 8.0.27 ou superior, o líder de consenso único é o primário do grupo. Caso contrário, todos os membros do grupo são usados como líderes, então todos eles são mostrados aqui. Veja a Seção 20.7.3, “Líder de Consenso Único”.

- `WRITE_CONSENSUS_LEADERS_ACTUAL`

  O líder real ou o líder que o motor de comunicação de grupo está usando para impulsionar o consenso. Se um único líder de consenso estiver sendo usado para o grupo e o principal estiver atualmente insalubre, a comunicação do grupo seleciona um líder de consenso alternativo. Nesta situação, o membro do grupo especificado aqui pode diferir do membro do grupo preferido.

- `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE`

  Se o grupo de replicação é capaz de usar um único líder de consenso. 1 significa que o grupo foi iniciado com o uso de um único líder habilitado (`group_replication_paxos_single_leader = ON`), e isso ainda é mostrado se o valor de `group_replication_paxos_single_leader` tiver sido alterado posteriormente neste membro do grupo. 0 significa que o grupo foi iniciado com o modo de líder único desabilitado (`group_replication_paxos_single_leader = OFF`), ou tem uma versão do protocolo de comunicação de replicação de grupo que não suporta o uso de um único líder de consenso (abaixo de 8.0.27). Esta informação é retornada apenas para membros do grupo no estado `ONLINE` ou `RECOVERING`.

A tabela `replication_group_communication_information` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_communication_information`.
