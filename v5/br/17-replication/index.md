# Capítulo 16 Replicação

**Índice**

[16.1 Configurando a Replicação](replication-configuration.html) : [16.1.1 Visão Geral da Configuração de Replicação Baseada em Posição de Arquivo de Binary Log](binlog-replication-configuration-overview.html)

    [16.1.2 Configurando a Replicação Baseada em Posição de Arquivo de Binary Log](replication-howto.html)

    [16.1.3 Replicação com Global Transaction Identifiers (GTIDs)](replication-gtids.html)

    [16.1.4 Alterando Modos de Replicação em Servidores Online](replication-mode-change-online.html)

    [16.1.5 Replicação Multi-Source do MySQL](replication-multi-source.html)

    [16.1.6 Opções e Variáveis de Replicação e Binary Logging](replication-options.html)

    [16.1.7 Tarefas Comuns de Administração de Replicação](replication-administration.html)

[16.2 Implementação da Replicação](replication-implementation.html) : [16.2.1 Formatos de Replicação](replication-formats.html)

    [16.2.2 Canais de Replicação](replication-channels.html)

    [16.2.3 Threads de Replicação](replication-threads.html)

    [16.2.4 Relay Log e Repositórios de Metadata de Replicação](replica-logs.html)

    [16.2.5 Como os Servidores Avaliam Regras de Filtragem de Replicação](replication-rules.html)

[16.3 Soluções de Replicação](replication-solutions.html) : [16.3.1 Usando Replicação para Backups](replication-solutions-backups.html)

    [16.3.2 Lidando com uma Parada Inesperada de uma Replica](replication-solutions-unexpected-replica-halt.html)

    [16.3.3 Usando Replicação com Diferentes Storage Engines no Source e na Replica](replication-solutions-diffengines.html)

    [16.3.4 Usando Replicação para Scale-Out](replication-solutions-scaleout.html)

    [16.3.5 Replicando Databases Diferentes para Replicas Diferentes](replication-solutions-partitioning.html)

    [16.3.6 Melhorando a Performance da Replicação](replication-solutions-performance.html)

    [16.3.7 Trocando Sources Durante um Failover](replication-solutions-switch.html)

    [16.3.8 Configurando a Replicação para Usar Conexões Criptografadas](replication-encrypted-connections.html)

    [16.3.9 Replicação Semisíncrona](replication-semisync.html)

    [16.3.10 Replicação Atrasada](replication-delayed.html)

[16.4 Notas e Dicas de Replicação](replication-notes.html) : [16.4.1 Recursos e Questões de Replicação](replication-features.html)

    [16.4.2 Compatibilidade de Replicação Entre Versões do MySQL](replication-compatibility.html)

    [16.4.3 Atualizando uma Topologia de Replicação](replication-upgrade.html)

    [16.4.4 Troubleshooting de Replicação](replication-problems.html)

    [16.4.5 Como Reportar Bugs ou Problemas de Replicação](replication-bugs.html)

A Replicação permite que dados de um servidor de Database MySQL (o Source) sejam copiados para um ou mais servidores de Database MySQL (as Replicas). A Replicação é assíncrona por padrão; as Replicas não precisam estar conectadas permanentemente para receber atualizações do Source. Dependendo da configuração, você pode replicar todos os Databases, Databases selecionados ou até mesmo Tables selecionadas dentro de um Database.

As vantagens da Replicação no MySQL incluem:

*   **Soluções de Scale-out** - distribuindo a carga entre múltiplas Replicas para melhorar a performance. Neste ambiente, todas as operações de escrita (*writes*) e atualizações (*updates*) devem ocorrer no servidor Source de replicação. As leituras (*reads*), no entanto, podem ocorrer em uma ou mais Replicas. Este modelo pode melhorar a performance das escritas (já que o Source é dedicado a atualizações), ao mesmo tempo em que aumenta drasticamente a velocidade de leitura através de um número crescente de Replicas.

*   **Segurança de dados** - como os dados são replicados para a Replica, e a Replica pode pausar o processo de replicação, é possível executar serviços de Backup na Replica sem corromper os dados correspondentes do Source.

*   **Analytics** - dados em tempo real (*live data*) podem ser criados no Source, enquanto a análise da informação pode ocorrer na Replica sem afetar a performance do Source.

*   **Distribuição de dados de longa distância** - você pode usar a replicação para criar uma cópia local de dados para ser usada por um site remoto, sem a necessidade de acesso permanente ao Source.

Para obter informações sobre como usar a replicação em tais cenários, consulte [Seção 16.3, “Soluções de Replicação”](replication-solutions.html "16.3 Soluções de Replicação").

O MySQL 5.7 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos a partir do Binary Log do Source e requer que os arquivos de log e suas posições sejam sincronizados entre o Source e a Replica. O método mais recente, baseado em Global Transaction Identifiers (GTIDs), é transacional e, portanto, não exige trabalhar com arquivos de log ou posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante a consistência entre o Source e a Replica, desde que todas as Transactions confirmadas (*committed*) no Source também tenham sido aplicadas na Replica. Para mais informações sobre GTIDs e replicação baseada em GTID no MySQL, consulte [Seção 16.1.3, “Replicação com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replicação com Global Transaction Identifiers"). Para obter informações sobre o uso da replicação baseada em posição de arquivo de Binary Log, consulte [Seção 16.1, “Configurando a Replicação”](replication-configuration.html "16.1 Configurando a Replicação").

A Replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação assíncrona, unidirecional (*one-way*), na qual um servidor atua como Source, enquanto um ou mais outros servidores atuam como Replicas. Isso é o oposto da replicação *síncrona*, que é uma característica do NDB Cluster (consulte [Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*](mysql-cluster.html "Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6")). No MySQL 5.7, a replicação semisíncrona é suportada, além da replicação assíncrona embutida. Com a replicação semisíncrona, um `commit` executado no Source é bloqueado antes de retornar à sessão que executou a Transaction, até que pelo menos uma Replica reconheça que recebeu e registrou os eventos para a Transaction; consulte [Seção 16.3.9, “Replicação Semisíncrona”](replication-semisync.html "16.3.9 Replicação Semisíncrona"). O MySQL 5.7 também suporta a replicação atrasada (*delayed replication*), onde uma Replica intencionalmente fica defasada em relação ao Source por pelo menos uma quantidade de tempo especificada; consulte [Seção 16.3.10, “Replicação Atrasada”](replication-delayed.html "16.3.10 Replicação Atrasada"). Para cenários onde a replicação *síncrona* é necessária, use o NDB Cluster (consulte [Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*](mysql-cluster.html "Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6")).

Existem várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a ser usado depende da presença de dados e dos tipos de Storage Engine que você está utilizando. Para mais informações sobre as opções disponíveis, consulte [Seção 16.1.2, “Configurando a Replicação Baseada em Posição de Arquivo de Binary Log”](replication-howto.html "16.1.2 Configurando a Replicação Baseada em Posição de Arquivo de Binary Log").

Existem dois tipos principais de formato de replicação, o Statement Based Replication (SBR), que replica instruções SQL inteiras, e o Row Based Replication (RBR), que replica apenas as Rows alteradas. Você também pode usar uma terceira variedade, o Mixed Based Replication (MBR). Para mais informações sobre os diferentes formatos de replicação, consulte [Seção 16.2.1, “Formatos de Replicação”](replication-formats.html "16.2.1 Formatos de Replicação").

A replicação é controlada por meio de várias opções e variáveis diferentes. Para mais informações, consulte [Seção 16.1.6, “Opções e Variáveis de Replicação e Binary Logging”](replication-options.html "16.1.6 Opções e Variáveis de Replicação e Binary Logging").

Você pode usar a replicação para resolver vários problemas diferentes, incluindo performance, suporte ao Backup de diferentes Databases e como parte de uma solução maior para mitigar falhas de sistema. Para obter informações sobre como abordar essas questões, consulte [Seção 16.3, “Soluções de Replicação”](replication-solutions.html "16.3 Soluções de Replicação").

Para notas e dicas sobre como diferentes tipos de dados e instruções são tratados durante a replicação, incluindo detalhes dos recursos de replicação, compatibilidade de versão, upgrades e problemas potenciais e sua resolução, consulte [Seção 16.4, “Notas e Dicas de Replicação”](replication-notes.html "16.4 Notas e Dicas de Replicação"). Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos na Replicação do MySQL, consulte [Seção A.14, “MySQL 5.7 FAQ: Replicação”](faqs-replication.html "A.14 MySQL 5.7 FAQ: Replicação").

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do Binary Log, as Threads em segundo plano e as regras usadas para decidir como as instruções são registradas e replicadas, consulte [Seção 16.2, “Implementação da Replicação”](replication-implementation.html "16.2 Implementação da Replicação").