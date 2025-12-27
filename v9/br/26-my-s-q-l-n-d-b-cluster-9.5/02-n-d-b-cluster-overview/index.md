## Visão Geral do NDB Cluster

25.2.1 Conceitos Básicos do NDB Cluster

25.2.2 Nodos, Grupos de Nodos, Replicas de Fragmento e Partições do NDB Cluster

25.2.3 Requisitos de Hardware, Software e Redes do NDB Cluster

25.2.4 O que há de Novo no MySQL NDB Cluster 9.5

25.2.5 Opções, Variáveis e Parâmetros Adicionados, Descontinuados ou Removidos no NDB 9.5

25.2.6 O Servidor MySQL Usando InnoDB Comparado com o NDB Cluster

25.2.7 Limitações Conhecidas do NDB Cluster

O NDB Cluster é uma tecnologia que permite o agrupamento de bancos de dados em memória em um sistema sem nada compartilhado. A arquitetura sem nada compartilhado permite que o sistema trabalhe com hardware muito econômico e com um mínimo de requisitos específicos para hardware ou software.

O NDB Cluster foi projetado para não ter nenhum ponto de falha único. Em um sistema sem nada compartilhado, espera-se que cada componente tenha sua própria memória e disco, e o uso de mecanismos de armazenamento compartilhados, como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado ou suportado.

O NDB Cluster integra o servidor padrão MySQL a um motor de armazenamento em memória agrupado chamado `NDB` (que significa “*N*etwork *D*ata*B*ase”). Em nossa documentação, o termo `NDB` refere-se à parte da configuração que é específica do motor de armazenamento, enquanto “MySQL NDB Cluster” refere-se à combinação de um ou mais servidores MySQL com o motor de armazenamento `NDB`.

Um NDB Cluster consiste em um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nós, podem incluir servidores MySQL (para acesso aos dados do NDB), nós de dados (para armazenamento dos dados), um ou mais servidores de gerenciamento e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 25.1 Componentes do NDB Cluster**

![Neste cluster, três servidores MySQL (programa mysqld) são nós SQL que fornecem acesso a quatro nós de dados (programa ndbd) que armazenam dados. Os nós SQL e os nós de dados estão sob o controle de um servidor de gerenciamento NDB (programa ndb_mgmd). Vários clientes e APIs podem interagir com os nós SQL - o cliente mysql, a API C do MySQL, PHP, Connector/J e Connector/NET. Clientes personalizados também podem ser criados usando a API NDB para interagir com os nós de dados ou o servidor de gerenciamento NDB. O cliente de gerenciamento NDB (programa ndb_mgm) interage com o servidor de gerenciamento NDB.](images/cluster-components-1.png)

Todos esses programas trabalham juntos para formar um NDB Cluster (veja a Seção 25.5, “Programas de NDB Cluster”. Quando os dados são armazenados pelo motor de armazenamento `NDB`, as tabelas (e os dados das tabelas) são armazenadas nos nós de dados. Tais tabelas são diretamente acessíveis de todos os outros servidores MySQL (nós SQL) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualizar o salário de um funcionário, todos os outros servidores MySQL que consultam esses dados podem ver essa mudança imediatamente.

Um nó SQL de NDB Cluster 9.5 usa o daemon do servidor **mysqld**, que é o mesmo que o **mysqld** fornecido com as distribuições do MySQL Server 9.5. Você deve ter em mente que *uma instância de **mysqld**, independentemente da versão, que não está conectada a um NDB Cluster não pode usar o motor de armazenamento `NDB` e não pode acessar nenhum dado do NDB Cluster*.

Os dados armazenados nos nós de dados para o NDB Cluster podem ser espelhados; o cluster pode lidar com falhas de nós de dados individuais sem outro impacto além de um pequeno número de transações serem abortadas devido à perda do estado da transação. Como se espera que aplicações transacionais lidem com falhas de transação, isso não deve ser uma fonte de problemas.

Os nós individuais podem ser parados e reiniciados, e depois podem se reiniciar no sistema (clã). Reinicializações em rolagem (nas quais todos os nós são reiniciados em ordem) são usadas para fazer alterações de configuração e atualizações de software (veja a Seção 25.6.5, “Realizando uma Reinicialização em Rolagem de um Clã NDB”). Reinicializações em rolagem também são usadas como parte do processo de adição de novos nós de dados online (veja a Seção 25.6.7, “Adição de Nodos de Dados de Clã NDB Online”). Para mais informações sobre nós de dados, como eles são organizados em um Clã NDB e como eles lidam e armazenam dados de um Clã NDB, veja a Seção 25.2.2, “Nodos do Clã NDB, Grupos de Nó, Replicas de Fragmento e Partições”.

Fazer backup e restaurar bancos de dados de um Clã NDB pode ser feito usando a funcionalidade nativa do `NDB` encontrada no cliente de gerenciamento do Clã NDB e no programa **ndb\_restore** incluído na distribuição do Clã NDB. Para mais informações, veja a Seção 25.6.8, “Backup Online do Clã NDB”, e a Seção 25.5.23, “ndb\_restore — Restaurar um Backup de um Clã NDB”. Você também pode usar a funcionalidade padrão do MySQL fornecida para esse propósito no **mysqldump** e no servidor MySQL. Veja a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”, para mais informações.

Os nós do Clã NDB podem empregar diferentes mecanismos de transporte para comunicações entre nós; TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é usado na maioria das implantações do mundo real.