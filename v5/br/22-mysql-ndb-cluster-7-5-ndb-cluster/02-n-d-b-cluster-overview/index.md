## 21.2 Visão geral do cluster do BND

21.2.1 Conceitos Básicos do Núcleo do NDB Cluster

21.2.2 Nodos do clúster do NDB, Grupos de nós, Replicas de fragmentos e Partições

21.2.3 Requisitos de hardware, software e de rede do cluster NDB

21.2.4 O que há de novo no MySQL NDB Cluster

21.2.5 NDB: Opções, variáveis e parâmetros adicionados, descontinuados e removidos

21.2.6 Servidor MySQL Usando InnoDB Comparado com NDB Cluster

21.2.7 Limitações Conhecidas do NDB Cluster

O NDB Cluster é uma tecnologia que permite a aglomeração de bancos de dados em memória em um sistema sem nada compartilhado. A arquitetura sem nada compartilhado permite que o sistema trabalhe com hardware muito econômico e com um mínimo de requisitos específicos para hardware ou software.

O NDB Cluster foi projetado para não ter nenhum ponto único de falha. Em um sistema sem nada compartilhado, espera-se que cada componente tenha sua própria memória e disco, e o uso de mecanismos de armazenamento compartilhado, como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado ou suportado.

O NDB Cluster integra o servidor padrão MySQL com um motor de armazenamento em cluster de memória chamado `NDB` (que significa “*N*etwork *D*ata*B*ase“). Em nossa documentação, o termo `NDB` refere-se à parte da configuração que é específica do motor de armazenamento, enquanto “MySQL NDB Cluster” refere-se à combinação de um ou mais servidores MySQL com o motor de armazenamento `NDB`.

Um NDB Cluster é composto por um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nós, podem incluir servidores MySQL (para acesso aos dados do NDB), nós de dados (para armazenamento dos dados), um ou mais servidores de gerenciamento e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 21.1 Componentes do Cluster NDB**

![Neste cluster, três servidores MySQL (programa mysqld) são nós SQL que fornecem acesso a quatro nós de dados (programa ndbd) que armazenam dados. Os nós SQL e os nós de dados estão sob o controle de um servidor de gerenciamento NDB (programa ndb\_mgmd). Vários clientes e APIs podem interagir com os nós SQL - o cliente mysql, a API C do MySQL, PHP, Connector/J e Connector/NET. Clientes personalizados também podem ser criados usando a API NDB para interagir com os nós de dados ou o servidor de gerenciamento NDB. O cliente de gerenciamento NDB (programa ndb\_mgm) interage com o servidor de gerenciamento NDB.](images/cluster-components-1.png)

Todos esses programas trabalham juntos para formar um NDB Cluster (veja Seção 21.5, “Programas de NDB Cluster”. Quando os dados são armazenados pelo mecanismo de armazenamento `NDB`, as tabelas (e os dados das tabelas) são armazenadas nos nós de dados. Essas tabelas são diretamente acessíveis a partir de todos os outros servidores MySQL (nós SQL) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualizar o salário de um funcionário, todos os outros servidores MySQL que consultam esses dados podem ver essa mudança imediatamente.

Embora um nó do NDB Cluster SQL use o daemon do servidor **mysqld**, ele difere em vários aspectos críticos do binário **mysqld** fornecido com as distribuições do MySQL 5.7, e as duas versões do **mysqld** não são intercambiáveis.

Além disso, um servidor MySQL que não está conectado a um NDB Cluster não pode usar o mecanismo de armazenamento `NDB` e não pode acessar nenhum dado do NDB Cluster.

Os dados armazenados nos nós de dados do NDB Cluster podem ser espelhados; o clúster pode lidar com falhas de nós de dados individuais sem outro impacto além de um pequeno número de transações serem abortadas devido à perda do estado da transação. Como se espera que as aplicações transacionais lidem com falhas de transação, isso não deve ser uma fonte de problemas.

Os nós individuais podem ser parados e reiniciados e, em seguida, podem se reiniciar no sistema (clã). Reinicializações em rotação (nas quais todos os nós são reiniciados em ordem) são usadas para fazer alterações de configuração e atualizações de software (veja Seção 21.6.5, “Realizando uma Reinicialização em Rotação de um Clã NDB”). Reinicializações em rotação também são usadas como parte do processo de adição de novos nós de dados online (veja Seção 21.6.7, “Adição de Nodos de Dados de Clã NDB Online”). Para mais informações sobre nós de dados, como eles são organizados em um Clã NDB e como eles lidam e armazenam dados do Clã NDB, veja Seção 21.2.2, “Nodos do Clã NDB, Grupos de Nó, Replicas de Fragmento e Partições”.

A cópia de segurança e a restauração de bancos de dados do NDB Cluster podem ser realizadas usando a funcionalidade nativa do `NDB` encontrada no cliente de gerenciamento do NDB Cluster e no programa **ndb\_restore** incluído na distribuição do NDB Cluster. Para mais informações, consulte Seção 21.6.8, “Backup Online do NDB Cluster” e Seção 21.5.24, “ndb\_restore — Restaurar um Backup do NDB Cluster”. Você também pode usar a funcionalidade padrão do MySQL fornecida para esse propósito no **mysqldump** e no servidor MySQL. Consulte Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados” para mais informações.

Os nós do cluster do NDB podem utilizar diferentes mecanismos de transporte para comunicações entre nós; o TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é utilizado na maioria das implantações do mundo real.
