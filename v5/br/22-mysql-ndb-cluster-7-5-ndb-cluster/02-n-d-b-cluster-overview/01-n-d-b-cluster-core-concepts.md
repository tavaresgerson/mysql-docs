### 21.2.1 Conceitos Centrais do NDB Cluster

O `NDBCLUSTER` (também conhecido como `NDB`) é um *storage engine in-memory* que oferece recursos de *high-availability* e *data-persistence*.

O storage engine `NDBCLUSTER` pode ser configurado com diversas opções de *failover* e *load-balancing*, mas é mais fácil começar com o *storage engine* no nível do Cluster. O *storage engine* `NDB` do NDB Cluster contém um conjunto completo de dados, dependente apenas de outros dados dentro do próprio Cluster.

A porção “Cluster” do NDB Cluster é configurada independentemente dos servidores MySQL. Em um NDB Cluster, cada parte do Cluster é considerada um Node.

Nota

Na maioria dos contextos, o termo “Node” é usado para indicar um computador, mas ao discutir o NDB Cluster, ele significa um *process*. É possível executar múltiplos Nodes em um único computador; para um computador no qual um ou mais Nodes do Cluster estão sendo executados, usamos o termo *cluster host*.

Existem três tipos de Nodes de Cluster e, em uma configuração mínima do NDB Cluster, deve haver pelo menos três Nodes, um de cada um destes tipos:

*   Node de Management (Management node): A função deste tipo de Node é gerenciar os outros Nodes dentro do NDB Cluster, executando funções como fornecer dados de configuração, iniciar e parar Nodes e executar *backups*. Como este tipo de Node gerencia a configuração dos outros Nodes, um Node deste tipo deve ser iniciado primeiro, antes de qualquer outro Node. Um Node de Management é iniciado com o comando [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon").

*   Node de Dados (Data node): Este tipo de Node armazena os dados do Cluster. Há tantos Data nodes quanto há réplicas de fragmentos, vezes o número de fragmentos (veja [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions")). Por exemplo, com duas réplicas de fragmentos, cada uma com dois fragmentos, você precisa de quatro Data nodes. Uma réplica de fragmento é suficiente para armazenamento de dados, mas não oferece redundância; portanto, é recomendado ter duas (ou mais) réplicas de fragmentos para fornecer redundância e, consequentemente, *high availability*. Um Data node é iniciado com o comando [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") (veja [Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon”](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")) ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") (veja [Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")).

  As tabelas NDB Cluster são normalmente armazenadas completamente na memória em vez de em disco (é por isso que nos referimos ao NDB Cluster como um *in-memory database*). No entanto, alguns dados do NDB Cluster podem ser armazenados em disco; veja [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables"), para mais informações.

*   Node SQL (SQL node): Este é um Node que acessa os dados do Cluster. No caso do NDB Cluster, um SQL node é um servidor MySQL tradicional que usa o *storage engine* `NDBCLUSTER`. Um SQL node é um processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") iniciado com as opções [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) e `--ndb-connectstring`, que são explicadas em outras partes deste capítulo, possivelmente com opções adicionais do servidor MySQL.

  Um SQL node é, na verdade, apenas um tipo especializado de API node, que designa qualquer aplicação que acesse dados do NDB Cluster. Outro exemplo de API node é o utilitário [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") que é usado para restaurar um *backup* do Cluster. É possível escrever tais aplicações usando a NDB API. Para informações básicas sobre a NDB API, veja [Getting Started with the NDB API](/doc/ndbapi/en/ndb-getting-started.html).

Importante

Não é realista esperar empregar uma configuração de três Nodes em um *production environment*. Tal configuração não fornece redundância; para se beneficiar dos recursos de *high-availability* do NDB Cluster, você deve usar múltiplos Nodes de Dados e SQL. O uso de múltiplos Nodes de Management também é altamente recomendado.

Para uma breve introdução às relações entre Nodes, grupos de Nodes, réplicas de fragmentos e partições no NDB Cluster, veja [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions").

A configuração de um Cluster envolve configurar cada Node individual no Cluster e configurar links de comunicação individuais entre os Nodes. O NDB Cluster é atualmente projetado com a intenção de que os Data nodes sejam *homogeneous* em termos de poder de processamento (*processor power*), espaço de memória (*memory space*) e largura de banda (*bandwidth*). Além disso, para fornecer um único ponto de configuração, todos os dados de configuração para o Cluster como um todo estão localizados em um único arquivo de configuração.

O Management Server gerencia o arquivo de configuração do Cluster e o *cluster log*. Cada Node no Cluster recupera os dados de configuração do Management Server e, portanto, requer uma maneira de determinar onde o Management Server reside. Quando eventos interessantes ocorrem nos Data nodes, os Nodes transferem informações sobre esses eventos para o Management Server, que então escreve as informações no *cluster log*.

Além disso, pode haver qualquer número de processos ou aplicações *client* do Cluster. Estes incluem *clients* MySQL padrão, programas API específicos do `NDB` e *management clients*. Estes são descritos nos próximos parágrafos.

**Standard MySQL clients.** O NDB Cluster pode ser usado com aplicações MySQL existentes escritas em PHP, Perl, C, C++, Java, Python, e assim por diante. Tais aplicações *client* enviam *SQL statements* e recebem respostas de servidores MySQL atuando como SQL nodes do NDB Cluster, de maneira muito semelhante à interação com servidores MySQL *standalone*.

MySQL clients que usam um NDB Cluster como fonte de dados podem ser modificados para tirar proveito da capacidade de conectar-se a múltiplos servidores MySQL para alcançar *load balancing* e *failover*. Por exemplo, *clients* Java usando Connector/J 5.0.6 e posterior podem usar URLs `jdbc:mysql:loadbalance://` (melhorado no Connector/J 5.1.7) para alcançar *load balancing* de forma transparente; para mais informações sobre o uso do Connector/J com NDB Cluster, veja [Using Connector/J with NDB Cluster](/doc/ndbapi/en/mccj-using-connectorj.html).

**Programas client NDB.** Programas *client* podem ser escritos para acessar dados do NDB Cluster diretamente do *storage engine* `NDBCLUSTER`, ignorando quaisquer servidores MySQL que possam estar conectados ao Cluster, usando a NDB API, uma API C++ de alto nível. Tais aplicações podem ser úteis para propósitos especializados onde uma interface SQL para os dados não é necessária. Para mais informações, veja [The NDB API](/doc/ndbapi/en/ndbapi.html).

Aplicações Java específicas para `NDB` também podem ser escritas para o NDB Cluster usando o NDB Cluster Connector for Java. Este NDB Cluster Connector inclui ClusterJ, uma API de *database* de alto nível similar a *object-relational mapping persistence frameworks* como Hibernate e JPA que se conectam diretamente ao `NDBCLUSTER`, e, portanto, não requer acesso a um Servidor MySQL. Veja [Java and NDB Cluster](/doc/ndbapi/en/mccj-overview-java.html) e [The ClusterJ API and Data Object Model](/doc/ndbapi/en/mccj-overview-clusterj-object-models.html), para mais informações.

**Management clients.** Estes *clients* se conectam ao Management Server e fornecem comandos para iniciar e parar Nodes de forma graciosa, iniciar e parar o rastreamento de mensagens (somente versões de *debug*), mostrar versões e *status* de Nodes, iniciar e parar *backups*, e assim por diante. Um exemplo deste tipo de programa é o *management client* [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") fornecido com o NDB Cluster (veja [Section 21.5.5, “ndb_mgm — The NDB Cluster Management Client”](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")). Tais aplicações podem ser escritas usando a MGM API, uma API C-language que se comunica diretamente com um ou mais Management Servers do NDB Cluster. Para mais informações, veja [The MGM API](/doc/ndbapi/en/mgm-api.html).

A Oracle também disponibiliza o MySQL Cluster Manager, que oferece uma interface de linha de comando avançada, simplificando muitas tarefas complexas de *management* do NDB Cluster, como reiniciar um NDB Cluster com um grande número de Nodes. O *client* do MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração de Node, bem como opções e variáveis do servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") relacionadas ao NDB Cluster. Veja [MySQL Cluster Manager 1.4.8 User Manual](/doc/mysql-cluster-manager/1.4/en/), para mais informações.

**Event logs.** O NDB Cluster registra eventos por categoria (*startup*, *shutdown*, *errors*, *checkpoints*, e assim por diante), prioridade e severidade. Uma lista completa de todos os eventos reportáveis pode ser encontrada em [Section 21.6.3, “Event Reports Generated in NDB Cluster”](mysql-cluster-event-reports.html "21.6.3 Event Reports Generated in NDB Cluster"). Os *Event logs* são dos dois tipos listados aqui:

*   Cluster log: Mantém um registro de todos os eventos reportáveis desejados para o Cluster como um todo.

*   Node log: Um *log* separado que também é mantido para cada Node individual.

Nota

Em circunstâncias normais, é necessário e suficiente manter e examinar apenas o *cluster log*. Os *node logs* precisam ser consultados apenas para fins de desenvolvimento e *debugging* de aplicações.

**Checkpoint.** De modo geral, quando os dados são salvos em disco, diz-se que um *checkpoint* foi alcançado. Mais especificamente para o NDB Cluster, um *checkpoint* é um ponto no tempo onde todas as *committed transactions* são armazenadas em disco. Em relação ao *storage engine* `NDB`, existem dois tipos de *checkpoints* que trabalham juntos para garantir que uma visão consistente dos dados do Cluster seja mantida. Estes são mostrados na lista a seguir:

*   *Local Checkpoint* (LCP): Este é um *checkpoint* que é específico para um único Node; no entanto, os LCPs ocorrem para todos os Nodes no Cluster de forma mais ou menos simultânea. Um LCP geralmente ocorre a cada poucos minutos; o intervalo preciso varia e depende da quantidade de dados armazenados pelo Node, do nível de atividade do Cluster e de outros fatores.

    Anteriormente, um LCP envolvia salvar todos os dados de um Node em disco. O NDB 7.6 introduz suporte para LCPs parciais, o que pode melhorar significativamente o tempo de recuperação em algumas condições. Veja [Section 21.2.4.2, “What is New in NDB Cluster 7.6”](mysql-cluster-what-is-new-7-6.html "21.2.4.2 What is New in NDB Cluster 7.6"), para mais informações, bem como as descrições dos parâmetros de configuração [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) e [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) que habilitam LCPs parciais e controlam a quantidade de armazenamento que eles utilizam.

*   *Global Checkpoint* (GCP): Um GCP ocorre a cada poucos segundos, quando as *transactions* para todos os Nodes são sincronizadas e o *redo-log* é descarregado para o disco.

Para mais informações sobre os arquivos e diretórios criados por *local checkpoints* e *global checkpoints*, veja [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

**Transporter.** Usamos o termo *Transporter* para o mecanismo de transporte de dados empregado entre Data nodes. O MySQL NDB Cluster 7.5 e 7.6 suportam três deles, listados aqui:

*   *TCP/IP over Ethernet*. Veja [Section 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections").

*   *Direct TCP/IP*. Usa conexões *machine-to-machine*. Veja [Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”](mysql-cluster-tcp-definition-direct.html "21.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections").

  Embora este *transporter* utilize o mesmo protocolo *TCP/IP* mencionado no item anterior, ele requer uma configuração de hardware diferente e também é configurado de maneira distinta. Por esta razão, é considerado um mecanismo de transporte separado para o NDB Cluster.

*   *Shared memory (SHM)*. Veja [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections").

Por ser ubíquo, a maioria dos usuários emprega *TCP/IP over Ethernet* para o NDB Cluster.

Independentemente do *transporter* usado, o `NDB` tenta garantir que a comunicação entre os processos do Data node seja realizada usando *chunks* que sejam o maior possível, pois isso beneficia todos os tipos de transmissão de dados.