## 21.7 Replicação de NDB Cluster

[21.7.1 Replicação de NDB Cluster: Abreviaturas e Símbolos](mysql-cluster-replication-abbreviations.html)

[21.7.2 Requisitos Gerais para Replicação de NDB Cluster](mysql-cluster-replication-general.html)

[21.7.3 Problemas Conhecidos na Replicação de NDB Cluster](mysql-cluster-replication-issues.html)

[21.7.4 Schema e Tabelas da Replicação de NDB Cluster](mysql-cluster-replication-schema.html)

[21.7.5 Preparando o NDB Cluster para Replicação](mysql-cluster-replication-preparation.html)

[21.7.6 Iniciando a Replicação de NDB Cluster (Canal de Replicação Único)](mysql-cluster-replication-starting.html)

[21.7.7 Usando Dois Canais de Replicação para NDB Cluster Replication](mysql-cluster-replication-two-channels.html)

[21.7.8 Implementando Failover com Replicação de NDB Cluster](mysql-cluster-replication-failover.html)

[21.7.9 Backups de NDB Cluster com Replicação de NDB Cluster](mysql-cluster-replication-backups.html)

[21.7.10 Replicação de NDB Cluster: Replicação Bidirecional e Circular](mysql-cluster-replication-multi-source.html)

[21.7.11 Resolução de Conflitos na Replicação de NDB Cluster](mysql-cluster-replication-conflict-resolution.html)

O NDB Cluster suporta replicação assíncrona, mais comumente referida simplesmente como “replicação”. Esta seção explica como configurar e gerenciar uma configuração na qual um grupo de computadores operando como um NDB Cluster replica para um segundo computador ou grupo de computadores. Presumimos que o leitor tenha alguma familiaridade com a replicação padrão do MySQL, conforme discutido em outras partes deste Manual. (Consulte [Capítulo 16, *Replication*](replication.html "Chapter 16 Replication")).

Nota

O NDB Cluster não suporta replicação usando GTIDs; replicação semi-síncrona e group replication também não são suportadas pela storage engine `NDB`.

A replicação normal (não-clusterizada) envolve um servidor source (anteriormente chamado de “master”) e um servidor replica (anteriormente chamado de “slave”), o source sendo assim chamado porque as operações e dados a serem replicados se originam nele, e o replica sendo o destinatário destes. No NDB Cluster, a replicação é conceitualmente muito semelhante, mas pode ser mais complexa na prática, pois pode ser estendida para cobrir várias configurações diferentes, incluindo a replicação entre dois Clusters completos. Embora um NDB Cluster dependa da storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para a funcionalidade de cluster, não é necessário usar [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como a storage engine para as cópias das tabelas replicadas no replica (consulte [Replication from NDB to other storage engines](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-non-ndb "Replication from NDB to other storage engines")). No entanto, para disponibilidade máxima, é possível (e preferível) replicar de um NDB Cluster para outro, e é este cenário que discutimos, conforme mostrado na figura a seguir:

**Figura 21.12 Layout de Replicação Cluster-para-Cluster do NDB**

![Grande parte do conteúdo é descrito no texto circundante. Ele visualiza como um source MySQL é replicado. O replica difere ao mostrar uma I/O Thread apontando para um relay binary log que aponta para uma SQL Thread. Além disso, embora o binary log aponte para e a partir da engine NDBCLUSTER no servidor source, no replica ele aponta diretamente para um SQL node (servidor MySQL).](images/cluster-replication-overview.png)

Neste cenário, o processo de replicação é aquele em que estados sucessivos de um cluster source são logados e salvos em um cluster replica. Este processo é realizado por uma Thread especial conhecida como Thread injetora de Binary Log do NDB, que é executada em cada MySQL server e produz um Binary Log (`binlog`). Esta Thread garante que todas as alterações no cluster que está produzindo o Binary Log — e não apenas aquelas alterações efetuadas através do MySQL Server — sejam inseridas no Binary Log com a ordem de serialização correta. Nós nos referimos aos servidores MySQL source e replica como servidores de replicação ou nodes de replicação, e ao fluxo de dados ou linha de comunicação entre eles como um canal de replicação.

Para obter informações sobre como realizar a point-in-time recovery (recuperação pontual) com NDB Cluster e NDB Cluster Replication, consulte [Seção 21.7.9.2, “Point-In-Time Recovery Usando NDB Cluster Replication”](mysql-cluster-replication-pitr.html "21.7.9.2 Point-In-Time Recovery Using NDB Cluster Replication").

**Variáveis de status replica da NDB API.** Contadores da NDB API podem fornecer recursos aprimorados de monitoramento em clusters replica. Esses contadores são implementados como variáveis de status `_slave` das estatísticas do NDB, conforme visto na saída de [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), ou nos resultados de Queries contra a tabela [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") ou [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") em uma sessão de cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") conectada a um MySQL Server que está atuando como replica na Replicação de NDB Cluster. Ao comparar os valores dessas variáveis de status antes e depois da execução de Statements que afetam tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") replicadas, você pode observar as ações correspondentes tomadas no nível da NDB API pelo replica, o que pode ser útil ao monitorar ou solucionar problemas na Replicação de NDB Cluster. [Seção 21.6.14, “Contadores e Variáveis de Estatísticas da NDB API”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables"), fornece informações adicionais.

**Replicação de NDB para tabelas não-NDB.** É possível replicar tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") de um NDB Cluster atuando como source de replicação para tabelas usando outras storage engines MySQL, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") ou [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") em um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") replica. Isto está sujeito a uma série de condições; consulte [Replication from NDB to other storage engines](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-non-ndb "Replication from NDB to other storage engines") e [Replication from NDB to a nontransactional storage engine](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-nontransactional "Replication from NDB to a nontransactional storage engine"), para mais informações.