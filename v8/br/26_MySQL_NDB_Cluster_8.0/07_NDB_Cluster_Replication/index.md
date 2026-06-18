## 25.7 Replicação em cluster do NDB

25.7.1 Replicação em cluster do NDB: Abreviações e Símbolos

25.7.2 Requisitos Gerais para a Replicação em Clúster do NDB

25.7.3 Problemas conhecidos na replicação em cluster do NDB

25.7.4 Esquema e tabelas de replicação de clúster do NDB

25.7.5 Preparando o NDB Cluster para Replicação

25.7.6 Início da replicação de clusters do NDB (canal de replicação único)

25.7.7 Uso de dois canais de replicação para replicação de clusters NDB

25.7.8 Implementação de Failover com Replicação de NDB Cluster

25.7.9 Resgate de clusters NDB Com a Replicação do NDB Cluster

25.7.10 Replicação em cluster do NDB: Replicação bidirecional e circular

25.7.11 Replicação de clúster do NDB usando o aplicativo multithread

25.7.12 Resolução de conflitos na replicação em cluster do NDB

O NDB Cluster suporta replicação assíncrona, mais comumente referida simplesmente como “replicação”. Esta seção explica como configurar e gerenciar uma configuração na qual um grupo de computadores operando como um NDB Cluster replica para um segundo computador ou grupo de computadores. Assumemos que o leitor tem alguma familiaridade com a replicação padrão do MySQL, conforme discutido em outros lugares deste Manual. (Veja o Capítulo 19, *Replicação*).

Nota

O NDB Cluster não suporta replicação usando GTIDs; a replicação semiesincrônica e a replicação em grupo também não são suportadas pelo motor de armazenamento `NDB`.

A replicação normal (não agrupada) envolve um servidor fonte e um servidor replica, sendo o servidor fonte denominado dessa forma porque as operações e os dados a serem replicados têm origem nele, e o replica é o destinatário desses dados. No NDB Cluster, a replicação é conceitualmente muito semelhante, mas pode ser mais complexa na prática, pois pode ser estendida para cobrir várias configurações diferentes, incluindo a replicação entre dois clusters completos. Embora um NDB Cluster em si dependa do motor de armazenamento `NDB` para a funcionalidade de agrupamento, não é necessário usar `NDB` como o motor de armazenamento para as cópias das tabelas replicadas do replica (veja Replicação do NDB para outros motores de armazenamento). No entanto, para a máxima disponibilidade, é possível (e preferível) replicar de um NDB Cluster para outro, e é esse cenário que discutimos, conforme mostrado na figura a seguir:

**Figura 25.10 Estrutura de replicação de cluster para cluster do NDB**

![Much of the content is described in the surrounding text. It visualizes how a MySQL source is replicated. The replica differs in that it shows an I/O (receiver) thread pointing to a relay binary log which points to an SQL (applier) thread. In addition, while the binary log points to and from the NDBCLUSTER engine on the source server, on the replica it points directly to an SQL node (MySQL server).](images/cluster-replication-overview.png)

Nesse cenário, o processo de replicação é aquele em que os estados sucessivos de um cluster de origem são registrados e salvos em um cluster de replica. Esse processo é realizado por um fio especial conhecido como fio de injeção de log binário NDB, que é executado em cada servidor MySQL e produz um log binário (`binlog`). Esse fio garante que todas as alterações no cluster que produz o log binário — e não apenas as alterações efetuadas através do MySQL Server — sejam inseridas no log binário com a ordem de serialização correta. Referenciamos os servidores de origem e replica MySQL como servidores de replicação ou nós de replicação, e o fluxo de dados ou linha de comunicação entre eles como um canal de replicação.

Para obter informações sobre a realização da recuperação em um ponto no tempo com o NDB Cluster e a Replicação do NDB Cluster, consulte a Seção 25.7.9.2, “Recuperação em um Ponto no Tempo Usando a Replicação do NDB Cluster”.

**Variáveis de status da API NDB.** Os contadores da API NDB podem fornecer capacidades de monitoramento aprimoradas em clusters replicados. Esses contadores são implementados como variáveis de status de estatísticas NDB `_slave`, conforme visto na saída de `SHOW STATUS`, ou nos resultados de consultas contra a tabela do Schema de Desempenho `session_status` ou `global_status` em uma sessão de cliente **mysql** conectada a um servidor MySQL que está atuando como replica no NDB Cluster Replication. Ao comparar os valores dessas variáveis de status antes e depois da execução de instruções que afetam as tabelas replicadas `NDB`, você pode observar as ações correspondentes tomadas no nível da API NDB pela replica, o que pode ser útil ao monitorar ou solucionar problemas na NDB Cluster Replication. A seção 25.6.15, “Contadores e Variáveis de Estatísticas da API NDB”, fornece informações adicionais.

**Replicação de tabelas NDB para tabelas não NDB.** É possível replicar as tabelas `NDB` de um NDB Cluster que atua como fonte de replicação para tabelas que utilizam outros motores de armazenamento MySQL, como `InnoDB` ou `MyISAM`, em uma replica **mysqld**. Isso está sujeito a várias condições; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional para obter mais informações.
