# Capítulo 19 Replicação

**Índice**

19.1 Configurando a Replicação:   19.1.1 Configuração de Replicação Baseada na Posição do Arquivo de Log Binário Visão Geral

```
19.1.2 Setting Up Binary Log File Position Based Replication

19.1.3 Replication with Global Transaction Identifiers

19.1.4 Changing GTID Mode on Online Servers

19.1.5 MySQL Multi-Source Replication

19.1.6 Replication and Binary Logging Options and Variables

19.1.7 Common Replication Administration Tasks
```

19.2 Implementação da Replicação:   19.2.1 Formulários de Replicação

```
19.2.2 Replication Channels

19.2.3 Replication Threads

19.2.4 Relay Log and Replication Metadata Repositories

19.2.5 How Servers Evaluate Replication Filtering Rules
```

19.3 Segurança da replicação:   19.3.1 Configuração da replicação para usar conexões criptografadas

```
19.3.2 Encrypting Binary Log Files and Relay Log Files

19.3.3 Replication Privilege Checks
```

19.4 Soluções de Replicação:   19.4.1 Uso da Replicação para Backup

```
19.4.2 Handling an Unexpected Halt of a Replica

19.4.3 Monitoring Row-based Replication

19.4.4 Using Replication with Different Source and Replica Storage Engines

19.4.5 Using Replication for Scale-Out

19.4.6 Replicating Different Databases to Different Replicas

19.4.7 Improving Replication Performance

19.4.8 Switching Sources During Failover

19.4.9 Switching Sources and Replicas with Asynchronous Connection Failover

19.4.10 Semisynchronous Replication

19.4.11 Delayed Replication
```

19.5 Notas e dicas de replicação:   19.5.1 Recursos e problemas de replicação

```
19.5.2 Replication Compatibility Between MySQL Versions

19.5.3 Upgrading a Replication Topology

19.5.4 Troubleshooting Replication

19.5.5 How to Report Replication Bugs or Problems
```

A replicação permite que os dados de um servidor de banco de dados MySQL (conhecido como fonte) sejam copiados para um ou mais servidores de banco de dados MySQL (conhecidos como réplicas). A replicação é assíncrona por padrão; as réplicas não precisam estar permanentemente conectadas para receber atualizações de uma fonte. Dependendo da configuração, você pode replicar todos os bancos de dados, bancos de dados selecionados ou até mesmo tabelas selecionadas dentro de um banco de dados.

As vantagens da replicação no MySQL incluem:

- Soluções escaláveis - distribuindo a carga entre múltiplas réplicas para melhorar o desempenho. Nesse ambiente, todas as gravações e atualizações devem ocorrer no servidor de origem. As leituras, no entanto, podem ocorrer em uma ou mais réplicas. Esse modelo pode melhorar o desempenho das gravações (já que o servidor de origem é dedicado às atualizações), ao mesmo tempo em que aumenta drasticamente a velocidade de leitura em um número crescente de réplicas.

- Segurança de dados - como a replica pode pausar o processo de replicação, é possível executar serviços de backup na replica sem corromper os dados de origem correspondentes.

- Análise - dados em tempo real podem ser criados na fonte, enquanto a análise das informações pode ocorrer na replica sem afetar o desempenho da fonte.

- Distribuição de dados de longa distância: você pode usar a replicação para criar uma cópia local dos dados para que um site remoto possa usar, sem acesso permanente à fonte.

Para obter informações sobre como usar a replicação nesses cenários, consulte a Seção 19.4, “Soluções de replicação”.

O MySQL 8.0 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos do log binário da fonte e requer que os arquivos de log e suas posições sejam sincronizados entre a fonte e a replica. O método mais recente, baseado em identificadores de transações globais (GTIDs), é transacional e, portanto, não requer o trabalho com arquivos de log ou suas posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante consistência entre a fonte e a replica, desde que todas as transações comprometidas na fonte também tenham sido aplicadas na replica. Para mais informações sobre GTIDs e replicação baseada em GTIDs no MySQL, consulte a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”. Para informações sobre o uso da replicação baseada na posição do arquivo de log binário, consulte a Seção 19.1, “Configurando a Replicação”.

A replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação unidirecional, assíncrona, na qual um servidor atua como a fonte, enquanto um ou mais outros servidores atuam como réplicas. Isso contrasta com a replicação *síncrona*, que é uma característica do NDB Cluster (veja o Capítulo 25, *MySQL NDB Cluster 8.0*). No MySQL 8.0, a replicação semissíncrona é suportada, além da replicação assíncrona integrada. Com a replicação semissíncrona, um commit realizado na fonte bloqueia antes de retornar à sessão que realizou a transação até que pelo menos uma réplica reconheça que recebeu e registrou os eventos da transação; veja a Seção 19.4.10, “Replicação Semissíncrona”. O MySQL 8.0 também suporta replicação atrasada, de modo que uma réplica fica deliberadamente atrasada em relação à fonte por pelo menos um período de tempo especificado; veja a Seção 19.4.11, “Replicação Atrasada”. Para cenários em que a replicação *síncrona* é necessária, use o NDB Cluster (veja o Capítulo 25, *MySQL NDB Cluster 8.0*).

Existem várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a ser utilizado depende da presença de dados e dos tipos de motor que você está usando. Para obter mais informações sobre as opções disponíveis, consulte a Seção 19.1.2, “Configurando a replicação com base na posição do arquivo de log binário”.

Existem dois tipos principais de formato de replicação: a Replicação Baseada em Declarações (SBR), que replica todas as declarações SQL, e a Replicação Baseada em Linhas (RBR), que replica apenas as linhas alteradas. Você também pode usar uma terceira variedade, a Replicação Baseada em Mistura (MBR). Para obter mais informações sobre os diferentes formatos de replicação, consulte a Seção 19.2.1, “Formatos de Replicação”.

A replicação é controlada por várias opções e variáveis diferentes. Para obter mais informações, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”. Medidas de segurança adicionais podem ser aplicadas a uma topologia de replicação, conforme descrito na Seção 19.3, “Segurança da replicação”.

Você pode usar a replicação para resolver uma série de problemas diferentes, incluindo desempenho, suporte ao backup de diferentes bancos de dados e como parte de uma solução maior para aliviar falhas no sistema. Para obter informações sobre como resolver esses problemas, consulte a Seção 19.4, “Soluções de Replicação”.

Para notas e dicas sobre como diferentes tipos de dados e declarações são tratados durante a replicação, incluindo detalhes sobre recursos de replicação, compatibilidade de versões, atualizações e problemas potenciais e suas resoluções, consulte a Seção 19.5, “Notas e Dicas de Replicação”. Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos no MySQL Replication, consulte a Seção A.14, “Perguntas Frequentes do MySQL 8.0: Replicação”.

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do log binário, os threads de segundo plano e as regras usadas para decidir como as instruções são registradas e replicadas, consulte a Seção 19.2, “Implementação da Replicação”.
