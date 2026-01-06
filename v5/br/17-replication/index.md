# Capítulo 16 Replicação

**Índice**

16.1 Configurando a replicação:   16.1.1 Configuração de replicação baseada na posição do arquivo de log binário

```
16.1.2 Setting Up Binary Log File Position Based Replication

16.1.3 Replication with Global Transaction Identifiers

16.1.4 Changing Replication Modes on Online Servers

16.1.5 MySQL Multi-Source Replication

16.1.6 Replication and Binary Logging Options and Variables

16.1.7 Common Replication Administration Tasks
```

16.2 Implementação da replicação:   16.2.1 Formatos de replicação

```
16.2.2 Replication Channels

16.2.3 Replication Threads

16.2.4 Relay Log and Replication Metadata Repositories

16.2.5 How Servers Evaluate Replication Filtering Rules
```

16.3 Soluções de Replicação:   16.3.1 Uso da Replicação para Backup

```
16.3.2 Handling an Unexpected Halt of a Replica

16.3.3 Using Replication with Different Source and Replica Storage Engines

16.3.4 Using Replication for Scale-Out

16.3.5 Replicating Different Databases to Different Replicas

16.3.6 Improving Replication Performance

16.3.7 Switching Sources During Failover

16.3.8 Setting Up Replication to Use Encrypted Connections

16.3.9 Semisynchronous Replication

16.3.10 Delayed Replication
```

16.4 Notas e Dicas de Replicação:   16.4.1 Recursos e Problemas de Replicação

```
16.4.2 Replication Compatibility Between MySQL Versions

16.4.3 Upgrading a Replication Topology

16.4.4 Troubleshooting Replication

16.4.5 How to Report Replication Bugs or Problems
```

A replicação permite que os dados de um servidor de banco de dados MySQL (a fonte) sejam copiados para um ou mais servidores de banco de dados MySQL (as réplicas). A replicação é assíncrona por padrão; as réplicas não precisam estar permanentemente conectadas para receber atualizações da fonte. Dependendo da configuração, você pode replicar todos os bancos de dados, bancos de dados selecionados ou até mesmo tabelas selecionadas dentro de um banco de dados.

As vantagens da replicação no MySQL incluem:

- Soluções escaláveis - distribuindo a carga entre múltiplas réplicas para melhorar o desempenho. Nesse ambiente, todas as gravações e atualizações devem ocorrer no servidor de origem da replicação. As leituras, no entanto, podem ocorrer em uma ou mais réplicas. Esse modelo pode melhorar o desempenho das gravações (já que a fonte é dedicada às atualizações), ao mesmo tempo em que aumenta drasticamente a velocidade de leitura em um número crescente de réplicas.

- Segurança de dados - como os dados são replicados para a replica, e a replica pode pausar o processo de replicação, é possível executar serviços de backup na replica sem corromper os dados de origem correspondentes.

- Análise - dados em tempo real podem ser criados na fonte, enquanto a análise das informações pode ocorrer na replica sem afetar o desempenho da fonte.

- Distribuição de dados de longa distância: você pode usar a replicação para criar uma cópia local dos dados para que um site remoto possa usar, sem acesso permanente à fonte.

Para obter informações sobre como usar a replicação nesses cenários, consulte Seção 16.3, “Soluções de replicação”.

O MySQL 5.7 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos do log binário da fonte e requer que os arquivos de log e suas posições sejam sincronizados entre a fonte e a replica. O método mais recente, baseado em identificadores de transações globais (GTIDs), é transacional e, portanto, não requer o trabalho com arquivos de log ou suas posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante consistência entre a fonte e a replica, desde que todas as transações comprometidas na fonte também tenham sido aplicadas na replica. Para mais informações sobre GTIDs e replicação baseada em GTIDs no MySQL, consulte Seção 16.1.3, “Replicação com Identificadores de Transações Globais”. Para informações sobre o uso da replicação baseada na posição do arquivo de log binário, consulte Seção 16.1, “Configuração da Replicação”.

A replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação bidirecional, assíncrona, na qual um servidor atua como a fonte, enquanto um ou mais outros servidores atuam como réplicas. Isso contrasta com a replicação *síncrona*, que é uma característica do NDB Cluster (veja Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*). No MySQL 5.7, a replicação semiesincrônica é suportada, além da replicação assíncrona integrada. Com a replicação semiesincrônica, um commit realizado na fonte bloqueia antes de retornar à sessão que realizou a transação até que pelo menos uma réplica reconheça que recebeu e registrou os eventos da transação; veja Seção 16.3.9, “Replicação Semiesincrônica”. O MySQL 5.7 também suporta replicação atrasada, de modo que uma réplica fica deliberadamente atrasada em relação à fonte por pelo menos um período de tempo especificado; veja Seção 16.3.10, “Replicação Atrasada”. Para cenários em que a replicação *síncrona* é necessária, use o NDB Cluster (veja Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*).

Existem várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a ser utilizado depende da presença dos dados e dos tipos de motor que você está usando. Para obter mais informações sobre as opções disponíveis, consulte Seção 16.1.2, “Configuração da replicação com base na posição do arquivo de log binário”.

Existem dois tipos principais de formato de replicação: a Replicação Baseada em Declarações (SBR), que replica todas as declarações SQL, e a Replicação Baseada em Linhas (RBR), que replica apenas as linhas alteradas. Você também pode usar uma terceira variedade, a Replicação Baseada em Mistura (MBR). Para obter mais informações sobre os diferentes formatos de replicação, consulte Seção 16.2.1, “Formatos de Replicação”.

A replicação é controlada por várias opções e variáveis diferentes. Para mais informações, consulte Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

Você pode usar a replicação para resolver uma série de problemas diferentes, incluindo desempenho, suporte ao backup de diferentes bancos de dados e como parte de uma solução maior para aliviar falhas no sistema. Para obter informações sobre como resolver esses problemas, consulte Seção 16.3, “Soluções de Replicação”.

Para notas e dicas sobre como diferentes tipos de dados e declarações são tratados durante a replicação, incluindo detalhes sobre recursos de replicação, compatibilidade de versões, atualizações e problemas potenciais e suas resoluções, consulte Seção 16.4, “Notas e Dicas de Replicação”. Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos no MySQL Replication, consulte Seção A.14, “Perguntas Frequentes do MySQL 5.7: Replicação”.

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do log binário, os threads de segundo plano e as regras usadas para decidir como as instruções são registradas e replicadas, consulte Seção 16.2, “Implementação da Replicação”.
