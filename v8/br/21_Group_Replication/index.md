# Capítulo 20 Replicação em Grupo

**Índice**

20.1 Contexto da Replicação em Grupo:   20.1.1 Tecnologias de Replicação

```
20.1.2 Group Replication Use Cases

20.1.3 Multi-Primary and Single-Primary Modes

20.1.4 Group Replication Services

20.1.5 Group Replication Plugin Architecture
```

20.2 Começando:   20.2.1 Implementando a Replicação em Grupo no Modo de Primárias Únicas

```
20.2.2 Deploying Group Replication Locally
```

20.3 Requisitos e Limitações:   20.3.1 Requisitos de Replicação em Grupo

```
20.3.2 Group Replication Limitations
```

20.4 Replicação do Grupo de Monitoramento:   20.4.1 GTIDs e Replicação de Grupo

```
20.4.2 Group Replication Server States

20.4.3 The replication_group_members Table

20.4.4 The replication_group_member_stats Table
```

20.5 Operações de Replicação em Grupo:   20.5.1 Configuração de um Grupo Online

```
20.5.2 Restarting a Group

20.5.3 Transaction Consistency Guarantees

20.5.4 Distributed Recovery

20.5.5 Support For IPv6 And For Mixed IPv6 And IPv4 Groups

20.5.6 Using MySQL Enterprise Backup with Group Replication
```

20.6 Segurança da Replicação em Grupo:   20.6.1 Pilha de Comunicação para Gerenciamento de Segurança de Conexão

```
20.6.2 Securing Group Communication Connections with Secure Socket Layer (SSL)

20.6.3 Securing Distributed Recovery Connections

20.6.4 Group Replication IP Address Permissions
```

20.7 Desempenho e solução de problemas da replicação em grupo:   20.7.1 Ajuste fino do fio de comunicação do grupo

```
20.7.2 Flow Control

20.7.3 Single Consensus Leader

20.7.4 Message Compression

20.7.5 Message Fragmentation

20.7.6 XCom Cache Management

20.7.7 Responses to Failure Detection and Network Partitioning

20.7.8 Handling a Network Partition and Loss of Quorum

20.7.9 Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation
```

20.8 Atualização da Replicação em Grupo:   20.8.1 Combinando Diferentes Versões de Membros em um Grupo

```
20.8.2 Group Replication Offline Upgrade

20.8.3 Group Replication Online Upgrade
```

20.9 Variáveis de Replicação em Grupo:   20.9.1 Variáveis do Sistema de Replicação em Grupo

```
20.9.2 Group Replication Status Variables
```

20.10 Perguntas Frequentes

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication permite que você crie topologias de replicação elásticas, altamente disponíveis e resistentes a falhas.

Os grupos podem operar no modo primário único com eleição primária automática, onde apenas um servidor aceita atualizações de cada vez. Alternativamente, os grupos podem ser implantados no modo primário múltiplo, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente.

Existe um serviço de associação de grupos integrado que mantém a visualização do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visualização é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falhas detecta isso e notifica o grupo de que a visualização foi alterada. Tudo isso é automático.

A Replicação em Grupo garante que o serviço de banco de dados esteja continuamente disponível. No entanto, é importante entender que, se um dos membros do grupo ficar indisponível, os clientes conectados a esse membro do grupo devem ser redirecionados ou substituídos por outro servidor diferente no grupo, usando um conector, um equilibrador de carga, um roteador ou alguma forma de middleware. A Replicação em Grupo não possui um método integrado para fazer isso. Por exemplo, veja o MySQL Router 8.0.

A replicação em grupo é fornecida como um plugin para o MySQL Server. Você pode seguir as instruções neste capítulo para configurar o plugin em cada uma das instâncias do servidor que deseja no grupo, iniciar o grupo e monitorar e administrar o grupo. Uma maneira alternativa de implementar um grupo de instâncias do MySQL Server é usando o InnoDB Cluster.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

O capítulo está estruturado da seguinte forma:

- A seção 20.1, "Contexto da Replicação em Grupo", fornece uma introdução sobre grupos e como a Replicação em Grupo funciona.

- A seção 20.2, "Começando", explica como configurar várias instâncias do Servidor MySQL para criar um grupo.

- A Seção 20.3, “Requisitos e Limitações”, explica os requisitos e as limitações de arquitetura e configuração para a Replicação em Grupo.

- A seção 20.4, “Monitoramento do Grupo de Replicação”, explica como monitorar um grupo.

- A seção 20.5, “Operações de Replicação em Grupo”, explica como trabalhar com um grupo.

- A Seção 20.6, “Segurança da Replicação em Grupo”, explica como proteger um grupo.

- A Seção 20.7, “Desempenho e solução de problemas da replicação em grupo”, explica como ajustar o desempenho de um grupo.

- A seção 20.8, “Atualização da Replicação em Grupo”, explica como atualizar um grupo.

- A Seção 20.9, “Variáveis de Replicação em Grupo”, é uma referência para as variáveis do sistema específicas para a Replicação em Grupo.

- A seção 20.10, “Perguntas Frequentes”, fornece respostas para algumas perguntas técnicas sobre a implantação e operação da Replicação em Grupo.
