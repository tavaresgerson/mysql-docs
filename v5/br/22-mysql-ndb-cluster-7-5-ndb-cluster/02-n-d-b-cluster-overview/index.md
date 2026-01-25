## 21.2 Visão Geral do NDB Cluster

[21.2.1 Conceitos Centrais do NDB Cluster](mysql-cluster-basics.html)

[21.2.2 Nós do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições](mysql-cluster-nodes-groups.html)

[21.2.3 Requisitos de Hardware, Software e Rede do NDB Cluster](mysql-cluster-overview-requirements.html)

[21.2.4 Novidades no MySQL NDB Cluster](mysql-cluster-what-is-new.html)

[21.2.5 NDB: Opções, Variáveis e Parâmetros Adicionados, Obsoletos e Removidos](mysql-cluster-added-deprecated-removed.html)

[21.2.6 MySQL Server Usando InnoDB Comparado com NDB Cluster](mysql-cluster-compared.html)

[21.2.7 Limitações Conhecidas do NDB Cluster](mysql-cluster-limitations.html)

O NDB Cluster é uma tecnologia que permite o clustering de Databases in-memory em um sistema shared-nothing (sem compartilhamento). A arquitetura shared-nothing permite que o sistema funcione com hardware de baixo custo e com requisitos mínimos específicos de hardware ou software.

O NDB Cluster é projetado para não ter nenhum ponto único de falha (*single point of failure*). Em um sistema shared-nothing, espera-se que cada componente tenha sua própria memory e disk, e o uso de mecanismos de shared storage (armazenamento compartilhado), como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado nem suportado.

O NDB Cluster integra o MySQL server padrão com um storage engine de clustering in-memory chamado [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (que significa “*N*etwork *D*ata*B*ase”). Em nossa documentação, o termo [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") se refere à parte da configuração que é específica do storage engine, enquanto “MySQL NDB Cluster” se refere à combinação de um ou mais MySQL servers com o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

Um NDB Cluster consiste em um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nodes (nós), podem incluir MySQL servers (para acesso aos dados NDB), data nodes (nós de dados) (para armazenamento dos dados), um ou mais management servers (servidores de gerenciamento) e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 21.1 Componentes do NDB Cluster**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

Todos esses programas trabalham em conjunto para formar um NDB Cluster (consulte [Seção 21.5, “Programas do NDB Cluster”](mysql-cluster-programs.html "21.5 Programas do NDB Cluster"). Quando os dados são armazenados pelo storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), as tables (e os dados da table) são armazenadas nos data nodes. Tais tables são diretamente acessíveis de todos os outros MySQL servers (SQL nodes) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualiza o salário de um funcionário, todos os outros MySQL servers que fazem Query desses dados podem ver essa alteração imediatamente.

Embora um SQL node do NDB Cluster use o daemon do server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), ele difere em vários aspectos cruciais do binário [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") fornecido nas distribuições do MySQL 5.7, e as duas versões do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não são intercambiáveis.

Além disso, um MySQL server que não está conectado a um NDB Cluster não pode usar o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e não pode acessar nenhum dado do NDB Cluster.

Os dados armazenados nos data nodes para o NDB Cluster podem ser espelhados (*mirrored*); o cluster pode lidar com falhas de data nodes individuais sem outro impacto além do aborto de um pequeno número de transactions devido à perda do estado da transaction. Como se espera que os aplicativos transacionais lidem com falhas de transaction, isso não deve ser uma fonte de problemas.

Nodes individuais podem ser parados e reiniciados, podendo então se reintegrar ao sistema (cluster). *Rolling restarts* (reinicializações em que todos os nodes são reiniciados em sequência) são usados para fazer alterações de configuração e upgrades de software (consulte [Seção 21.6.5, “Realizando um Rolling Restart de um NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Realizando um Rolling Restart de um NDB Cluster")). *Rolling restarts* também são usados como parte do processo de adição online de novos data nodes (consulte [Seção 21.6.7, “Adicionando Data Nodes do NDB Cluster Online”](mysql-cluster-online-add-node.html "21.6.7 Adicionando Data Nodes do NDB Cluster Online")). Para obter mais informações sobre data nodes, como eles são organizados em um NDB Cluster, e como eles manipulam e armazenam dados do NDB Cluster, consulte [Seção 21.2.2, “Nós do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições”](mysql-cluster-nodes-groups.html "21.2.2 Nós do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições").

Fazer Backup e Restore de Databases do NDB Cluster pode ser feito usando a funcionalidade nativa do `NDB` encontrada no NDB Cluster management client e no programa [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") incluído na distribuição do NDB Cluster. Para mais informações, consulte [Seção 21.6.8, “Online Backup do NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup do NDB Cluster") e [Seção 21.5.24, “ndb_restore — Restore de um Backup do NDB Cluster”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore de um Backup do NDB Cluster"). Você também pode usar a funcionalidade padrão do MySQL fornecida para esse fim em [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e no MySQL server. Consulte [Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") para obter mais informações.

Os nodes do NDB Cluster podem empregar diferentes mecanismos de transporte para comunicações inter-node; TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é usado na maioria das implantações no mundo real.