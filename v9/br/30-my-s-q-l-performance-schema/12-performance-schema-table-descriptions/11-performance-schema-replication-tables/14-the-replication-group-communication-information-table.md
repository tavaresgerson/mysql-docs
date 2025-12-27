#### 29.12.11.14 Tabela de comunicação de grupo de replicação

Esta tabela mostra as opções de configuração do grupo para toda a replicação de grupo. A tabela está disponível apenas quando a Replicação de Grupo está instalada.

A tabela `replication_group_communication_information` tem as seguintes colunas:

* `WRITE_CONCURRENCY`

  O número máximo de instâncias de consenso que o grupo pode executar em paralelo. O valor padrão é 10. Veja a Seção 20.5.1.3, “Usando o consenso de escrita de grupo de replicação”.

* `PROTOCOL_VERSION`

  A versão do protocolo de comunicação da Replicação de Grupo, que determina quais capacidades de mensagens são usadas. Isso é definido para acomodar a versão mais antiga do servidor MySQL que você deseja que o grupo suporte. Veja a Seção 20.5.1.4, “Definindo a versão do protocolo de comunicação de um grupo”.

* `WRITE_CONSENSUS_LEADERS_PREFERRED`

  O líder ou líderes que a engine de comunicação do Grupo de Replicação instruiu para usar para impulsionar o consenso. Para um grupo no modo de único primário com a variável de sistema `group_replication_paxos_single_leader` definida como `ON` e a versão do protocolo de comunicação definida como 8.0.27 ou posterior, o único líder de consenso é o primário do grupo. Caso contrário, todos os membros do grupo são usados como líderes, então todos eles são mostrados aqui. Veja a Seção 20.7.3, “Lider de consenso único”.

* `WRITE_CONSENSUS_LEADERS_ACTUAL`

  O líder ou líder atual que a engine de comunicação do Grupo de Replicação está usando para impulsionar o consenso. Se um único líder de consenso estiver em uso para o grupo, e o primário estiver atualmente indisponível, a comunicação do grupo seleciona um líder de consenso alternativo. Nesta situação, o membro do grupo especificado aqui pode diferir do membro do grupo preferido.

* `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE`

Se o grupo de replicação é capaz de usar um único líder de consenso. 1 significa que o grupo foi iniciado com o uso de um único líder habilitado (`group_replication_paxos_single_leader = ON`), e isso ainda é exibido se o valor de `group_replication_paxos_single_leader` tiver sido alterado desde então nesse membro do grupo. 0 significa que o grupo foi iniciado com o modo de líder único desabilitado (`group_replication_paxos_single_leader = OFF`), ou tem uma versão do protocolo de comunicação de Replicação de Grupo que não suporta o uso de um único líder de consenso (antes da versão 8.0.27). Esta informação é retornada apenas para membros do grupo em estado `ONLINE` ou `RECOVERING`.

* `MEMBER_FAILURE_SUSPICIONS_COUNT`

  O endereço de cada membro do grupo emparelhado com o número de vezes que esse membro foi visto como suspeito pelo nó local. Esta informação é exibida no formato JSON. Para um grupo com três membros, o valor desta coluna deve aparecer semelhante ao que é mostrado aqui:

  ```
  {
    "d57da302-e404-4395-83b5-ff7cf9b7e055": 0,
    "6ace9d39-a093-4fe0-b24d-bacbaa34c339": 10,
    "9689c7c5-c71c-402a-a3a1-2f57bfc2ca62": 0
  }
  ```

A tabela `replication_group_communication_information` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `replication_group_communication_information`.