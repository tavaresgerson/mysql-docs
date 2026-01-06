# Capítulo 17 Replicação em Grupo

**Índice**

17.1 Contexto da Replicação em Grupo:   17.1.1 Tecnologias de Replicação

```
17.1.2 Group Replication Use Cases

17.1.3 Group Replication Details
```

17.2 Começando:   17.2.1 Implementando a Replicação em Grupo no Modo de Primárias Únicas

```
17.2.2 Deploying Group Replication Locally
```

17.3 Requisitos e Limitações:   17.3.1 Requisitos de Replicação em Grupo

```
17.3.2 Group Replication Limitations
```

17.4 Monitoramento do Grupo de Replicação:   17.4.1 Estados dos Servidores de Replicação do Grupo

```
17.4.2 The replication\_group\_members Table

17.4.3 The replication\_group\_member\_stats Table
```

Operações de Replicação em Grupo:   17.5.1 Implantação no Modo Multi-Primario ou Simples-Primario

```
17.5.2 Tuning Recovery

17.5.3 Network Partitioning

17.5.4 Restarting a Group

17.5.5 Using MySQL Enterprise Backup with Group Replication
```

17.6 Segurança da Replicação em Grupo :   17.6.1 Permissão de endereços IP da replicação em grupo

```
17.6.2 Group Replication Secure Socket Layer (SSL) Support

17.6.3 Group Replication and Virtual Private Networks (VPNs)
```

17.7 Variáveis de Replicação em Grupo :   17.7.1 Variáveis do Sistema de Replicação em Grupo

```
17.7.2 Group Replication Status Variables
```

17.8 Perguntas Frequentes

Detalhes técnicos da replicação em grupo:   Arquitetura da extensão de replicação em grupo

```
17.9.2 The Group

17.9.3 Data Manipulation Statements

17.9.4 Data Definition Statements

17.9.5 Distributed Recovery

17.9.6 Observability

17.9.7 Group Replication Performance
```

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication é um plugin do MySQL Server que permite criar topologias de replicação elásticas, altamente disponíveis e resistentes a falhas.

Os grupos podem operar no modo primário único com eleição primária automática, onde apenas um servidor aceita atualizações de cada vez. Como alternativa, para usuários mais avançados, os grupos podem ser implantados no modo primário múltiplo, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente.

Existe um serviço de associação de grupos integrado que mantém a visualização do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visualização é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falhas detecta isso e notifica o grupo de que a visualização foi alterada. Tudo isso é automático.

O capítulo está estruturado da seguinte forma:

- A seção 17.1, “Contexto da Replicação em Grupo” (group-replication-background.html), fornece uma introdução sobre grupos e como a Replicação em Grupo funciona.

- A seção 17.2, “Começando”, explica como configurar várias instâncias do MySQL Server para criar um grupo.

- A seção 17.3, “Requisitos e Limitações” (group-replication-requirements-and-limitations.html), explica os requisitos e as limitações de arquitetura e configuração para a Replicação em Grupo.

- A seção 17.4, “Monitoramento do grupo de replicação” (group-replication-monitoring.html), explica como monitorar um grupo.

- A seção 17.5, “Operações de Replicação em Grupo” (group-replication-operations.html) explica como trabalhar com um grupo.

- A seção 17.6, “Segurança da Replicação em Grupo” (group-replication-security.html), explica como proteger um grupo.

- Atualização da Replicação em Grupo explica como atualizar um grupo.

- Seção 17.7, “Variáveis de Replicação em Grupo” é uma referência para as variáveis do sistema específicas para a Replicação em Grupo.

- A seção 17.8, “Perguntas Frequentes” (group-replication-frequently-asked-questions.html), fornece respostas para algumas perguntas técnicas sobre a implantação e operação da Replicação em Grupo.

- A seção 17.9, “Detalhes técnicos da replicação em grupo” (group-replication-technical-details.html), fornece informações detalhadas sobre como a replicação em grupo funciona.
