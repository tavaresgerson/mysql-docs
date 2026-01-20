## 21.7 Replicação em cluster do NDB

21.7.1 Replicação de clúster do NDB: Abreviações e Símbolos

21.7.2 Requisitos Gerais para a Replicação de Clustos do NDB

21.7.3 Problemas Conhecidos na Replicação de NDB Cluster

21.7.4 Esquema e tabelas de replicação de clúster do NDB

21.7.5 Preparando o NDB Cluster para Replicação

21.7.6 Começando a replicação de clusters NDB (canal de replicação único)

21.7.7 Uso de dois canais de replicação para replicação de clusters NDB

21.7.8 Implementação de Failover com a Replicação do NDB Cluster

21.7.9 Resgate de clusters do NDB Cluster com replicação do NDB Cluster

21.7.10 Replicação em cluster do NDB: Replicação bidirecional e circular

21.7.11 Resolução de conflitos de replicação de cluster do NDB

O NDB Cluster suporta replicação assíncrona, mais comumente referida simplesmente como “replicação”. Esta seção explica como configurar e gerenciar uma configuração na qual um grupo de computadores operando como um NDB Cluster replica para um segundo computador ou grupo de computadores. Assumemos que o leitor tem alguma familiaridade com a replicação padrão do MySQL, conforme discutido em outros lugares deste Manual. (Veja Capítulo 16, *Replicação*).

Nota

O NDB Cluster não suporta replicação usando GTIDs; a replicação semiesincrônica e a replicação em grupo também não são suportadas pelo mecanismo de armazenamento `NDB`.

A replicação normal (não agrupada) envolve um servidor de origem (anteriormente chamado de "mestre") e um servidor de replica (anteriormente referido como "escravo"), sendo o servidor de origem chamado assim porque as operações e os dados a serem replicados têm origem nele, e o servidor de replica é o destinatário desses dados. No NDB Cluster, a replicação é conceitualmente muito semelhante, mas pode ser mais complexa na prática, pois pode ser estendida para cobrir várias configurações diferentes, incluindo a replicação entre dois clusters completos. Embora um NDB Cluster em si dependa do mecanismo de armazenamento `NDB` para a funcionalidade de agrupamento, não é necessário usar `NDB` como o mecanismo de armazenamento para as cópias das tabelas replicadas do replica (veja Replicação do NDB para outros mecanismos de armazenamento). No entanto, para a máxima disponibilidade, é possível (e preferível) replicar de um NDB Cluster para outro, e é este cenário que discutimos, conforme mostrado na figura a seguir:

**Figura 21.12 Estrutura de replicação de cluster a cluster do NDB**

![Grande parte do conteúdo é descrito no texto ao redor. Ele visualiza como um banco de dados MySQL é replicado. A réplica difere porque mostra uma thread de E/S apontando para um log binário de retransmissão que aponta para uma thread SQL. Além disso, enquanto o log binário aponta para e a partir do motor NDBCLUSTER no servidor de origem, na réplica, ele aponta diretamente para um nó SQL (servidor MySQL).](images/cluster-replication-overview.png)

Nesse cenário, o processo de replicação é aquele em que estados sucessivos de um cluster de origem são registrados e salvos em um cluster de replica. Esse processo é realizado por um thread especial conhecido como thread de injeção de log binário NDB, que roda em cada servidor MySQL e produz um log binário (`binlog`). Esse thread garante que todas as alterações no cluster que produz o log binário — e não apenas as alterações efetuadas através do MySQL Server — sejam inseridas no log binário com a ordem de serialização correta. Referenciamos os servidores de origem e replica MySQL como servidores de replicação ou nós de replicação, e o fluxo de dados ou linha de comunicação entre eles como um canal de replicação.

Para obter informações sobre a realização de recuperação em um ponto no tempo com o NDB Cluster e a Replicação do NDB Cluster, consulte Seção 21.7.9.2, “Recuperação em um Ponto no Tempo Usando a Replicação do NDB Cluster”.

Variáveis de status da replicação da API NDB. Os contadores da API NDB podem fornecer capacidades de monitoramento aprimoradas em clusters replicados. Esses contadores são implementados como variáveis de status de estatísticas NDB `_slave`, conforme visto na saída de `SHOW STATUS`, ou nos resultados de consultas contra a tabela `SESSION_STATUS` ou `GLOBAL_STATUS` em uma sessão de cliente **mysql** conectada a um servidor MySQL que está atuando como replica no NDB Cluster Replication. Ao comparar os valores dessas variáveis de status antes e depois da execução de instruções que afetam as tabelas replicadas de `NDB`, você pode observar as ações correspondentes tomadas no nível da API NDB pela replica, o que pode ser útil ao monitorar ou solucionar problemas na replicação do NDB Cluster. Seção 21.6.14, “Contadores e Variáveis de Estatísticas da API NDB” fornece informações adicionais.

**Replicação de tabelas NDB para tabelas não NDB.** É possível replicar tabelas `NDB` de um NDB Cluster atuando como fonte de replicação para tabelas usando outros motores de armazenamento MySQL, como `InnoDB` ou `MyISAM` em uma replica **mysqld**. Isso está sujeito a várias condições; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional para obter mais informações.
