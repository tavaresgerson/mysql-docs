## 25.2 Visão geral do cluster do BND

25.2.1 Conceitos Básicos do Núcleo do Cluster NDB

25.2.2 Nodos do clúster do NDB, Grupos de nós, Replicas de fragmentos e Partições

25.2.3 Requisitos de hardware, software e redes do cluster NDB

25.2.4 O que há de novo no MySQL NDB Cluster 8.0

25.2.5 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 8.0

25.2.6 Servidor MySQL Usando InnoDB Comparado com NDB Cluster

25.2.7 Limitações conhecidas do NDB Cluster

O NDB Cluster é uma tecnologia que permite a aglomeração de bancos de dados em memória em um sistema sem nada compartilhado. A arquitetura sem nada compartilhado permite que o sistema trabalhe com hardware muito econômico e com um mínimo de requisitos específicos para hardware ou software.

O NDB Cluster foi projetado para não ter nenhum ponto único de falha. Em um sistema sem nada compartilhado, espera-se que cada componente tenha sua própria memória e disco, e o uso de mecanismos de armazenamento compartilhado, como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado ou suportado.

O NDB Cluster integra o servidor padrão MySQL com um motor de armazenamento em cluster de memória chamado `NDB` (que significa “*N*etwork *D*ata*B*ase”). Em nossa documentação, o termo `NDB` refere-se à parte da configuração que é específica do motor de armazenamento, enquanto “MySQL NDB Cluster” refere-se à combinação de um ou mais servidores MySQL com o motor de armazenamento `NDB`.

Um NDB Cluster é composto por um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nós, podem incluir servidores MySQL (para acesso aos dados do NDB), nós de dados (para armazenamento dos dados), um ou mais servidores de gerenciamento e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 25.1 Componentes do Cluster NDB**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb\_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb\_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

Todos esses programas trabalham juntos para formar um NDB Cluster (veja a Seção 25.5, “Programas de NDB Cluster”). Quando os dados são armazenados pelo motor de armazenamento `NDB`, as tabelas (e os dados das tabelas) são armazenadas nos nós de dados. Essas tabelas são diretamente acessíveis a partir de todos os outros servidores MySQL (nós SQL) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualizar o salário de um funcionário, todos os outros servidores MySQL que consultam esses dados podem ver essa mudança imediatamente.

A partir da NDB 8.0.31, um nó SQL do NDB Cluster 8.0 usa o daemon do servidor **mysqld**, que é o mesmo que o **mysqld** fornecido com as distribuições do MySQL Server 8.0. Na NDB 8.0.30 e em versões anteriores, ele diferia em vários aspectos críticos do binário **mysqld** fornecido com o MySQL Server, e as duas versões do **mysqld** não eram intercambiáveis. Você deve ter em mente que *uma instância do **mysqld**, independentemente da versão, que não está conectada a um NDB Cluster não pode usar o mecanismo de armazenamento `NDB` e não pode acessar nenhum dado do NDB Cluster*.

Os dados armazenados nos nós de dados do NDB Cluster podem ser espelhados; o clúster pode lidar com falhas de nós de dados individuais sem outro impacto além de um pequeno número de transações serem abortadas devido à perda do estado da transação. Como se espera que as aplicações transacionais lidem com falhas de transação, isso não deve ser uma fonte de problemas.

Os nós individuais podem ser parados e reiniciados, e depois podem se reiniciar no sistema (clã). Reinicializações em rotação (nas quais todos os nós são reiniciados em ordem) são usadas para fazer alterações de configuração e atualizações de software (veja a Seção 25.6.5, “Realizando uma Reinicialização em Rotação de um Clã NDB”). Reinicializações em rotação também são usadas como parte do processo de adição de novos nós de dados online (veja a Seção 25.6.7, “Adição de Nodos de Dados de Clã NDB Online”). Para mais informações sobre nós de dados, como eles são organizados em um Clã NDB e como eles lidam e armazenam dados do Clã NDB, veja a Seção 25.2.2, “Nodos do Clã NDB, Grupos de Nó, Replicas de Fragmento e Partições”.

A cópia de segurança e a restauração de bancos de dados do NDB Cluster podem ser realizadas usando a funcionalidade nativa do `NDB` encontrada no cliente de gerenciamento do NDB Cluster e no programa **ndb\_restore** incluído na distribuição do NDB Cluster. Para mais informações, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”, e a Seção 25.5.23, “ndb\_restore — Restaurar um Backup do NDB Cluster”. Você também pode usar a funcionalidade padrão do MySQL fornecida para esse propósito no **mysqldump** e no servidor MySQL. Consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”, para mais informações.

Os nós do cluster do NDB podem utilizar diferentes mecanismos de transporte para comunicações entre nós; o TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é utilizado na maioria das implantações do mundo real.
