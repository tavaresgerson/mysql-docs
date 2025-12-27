### 25.2.1 Conceitos Básicos do NDB Cluster

O `NDBCLUSTER` (também conhecido como `NDB`) é um motor de armazenamento em memória que oferece recursos de alta disponibilidade e persistência de dados.

O motor de armazenamento `NDBCLUSTER` pode ser configurado com uma variedade de opções de failover e balanceamento de carga, mas é mais fácil começar com o motor de armazenamento no nível do cluster. O motor de armazenamento `NDB` do NDB Cluster contém um conjunto completo de dados, dependente apenas de outros dados dentro do próprio cluster.

A parte “Cluster” do NDB Cluster é configurada de forma independente dos servidores MySQL. Em um NDB Cluster, cada parte do cluster é considerada um nó.

Nota

Em muitos contextos, o termo “nó” é usado para indicar um computador, mas quando se discute o NDB Cluster, ele significa um *processo*. É possível executar vários nós em um único computador; para um computador em que um ou mais nós do cluster estão sendo executados, usamos o termo host do cluster.

Existem três tipos de nós do cluster, e em uma configuração mínima do NDB Cluster, há pelo menos três nós, um de cada um desses tipos:

* Nó de gerenciamento: O papel deste tipo de nó é gerenciar os outros nós dentro do NDB Cluster, realizando funções como fornecer dados de configuração, iniciar e parar nós e executar backups. Como este tipo de nó gerencia a configuração dos outros nós, um nó deste tipo deve ser iniciado primeiro, antes de qualquer outro nó. Um nó deste tipo é iniciado com o comando **ndb\_mgmd**.

* Nó de dados: Este tipo de nó armazena os dados do clúster. Há tantos nós de dados quanto há réplicas de fragmentos, multiplicadas pelo número de fragmentos (veja a Seção 25.2.2, “Nodos de clúster NDB, Grupos de nó, Réplicas de fragmentos e Partições”). Por exemplo, com duas réplicas de fragmentos, cada uma com dois fragmentos, você precisa de quatro nós de dados. Uma réplica de fragmento é suficiente para o armazenamento de dados, mas não oferece redundância; portanto, é recomendável ter duas (ou mais) réplicas de fragmentos para fornecer redundância e, assim, alta disponibilidade. Um nó de dados é iniciado com o comando **ndbd** (veja a Seção 25.5.1, “ndbd — O daemon de nó de dados do clúster NDB”) ou **ndbmtd**") (veja a Seção 25.5.3, “ndbmtd — O daemon de nó de dados do clúster NDB (multithreading)”).

As tabelas do clúster NDB são normalmente armazenadas completamente na memória, em vez de no disco (é por isso que chamamos o clúster NDB de um banco de dados em memória). No entanto, alguns dados do clúster NDB podem ser armazenados no disco; consulte a Seção 25.6.11, “Tabelas de dados de disco do clúster NDB”, para obter mais informações.

* Nó SQL: Este é um nó que acessa os dados do clúster. No caso do clúster NDB, um nó SQL é um servidor MySQL tradicional que usa o mecanismo de armazenamento `NDBCLUSTER`. Um nó SQL é um processo **mysqld** iniciado com as opções `--ndbcluster` e `--ndb-connectstring`, que são explicadas em outro lugar neste capítulo, possivelmente com opções adicionais do servidor MySQL também.

Na verdade, um nó SQL é apenas um tipo especializado de nó API, que designa qualquer aplicativo que acesse os dados do clúster NDB. Outro exemplo de um nó API é o utilitário **ndb\_restore** que é usado para restaurar uma cópia de segurança do clúster. É possível escrever tais aplicativos usando a API NDB. Para informações básicas sobre a API NDB, consulte Começando com a API NDB.

Importante

Não é realista esperar usar uma configuração de três nós em um ambiente de produção. Tal configuração não oferece redundância; para se beneficiar das características de alta disponibilidade do NDB Cluster, é necessário usar múltiplos nós de dados e SQL. O uso de múltiplos nós de gerenciamento também é altamente recomendado.

Para uma breve introdução às relações entre nós, grupos de nós, réplicas de fragmentos e partições no NDB Cluster, consulte a Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições”.

A configuração de um cluster envolve a configuração de cada nó individual no cluster e a configuração de links de comunicação individuais entre os nós. O NDB Cluster é atualmente projetado com a intenção de que os nós de dados sejam homogêneos em termos de poder do processador, espaço de memória e largura de banda. Além disso, para fornecer um único ponto de configuração, todos os dados de configuração para o cluster como um todo estão localizados em um arquivo de configuração.

O servidor de gerenciamento gerencia o arquivo de configuração do cluster e o log do cluster. Cada nó no cluster recupera os dados de configuração do servidor de gerenciamento e, portanto, requer uma maneira de determinar onde o servidor de gerenciamento reside. Quando eventos interessantes ocorrem nos nós de dados, os nós transferem informações sobre esses eventos para o servidor de gerenciamento, que então escreve as informações no log do cluster.

Além disso, pode haver qualquer número de processos ou aplicações de cliente do cluster. Estes incluem clientes padrão do MySQL, programas de API específicos do `NDB` e clientes de gerenciamento. Estes são descritos nos próximos parágrafos.

**Clientes padrão MySQL.** O NDB Cluster pode ser usado com aplicativos existentes MySQL escritos em PHP, Perl, C, C++, Java, Python, e assim por diante. Tais aplicativos de cliente enviam instruções SQL para os servidores MySQL que atuam como nós SQL do NDB Cluster e recebem respostas da mesma maneira que interagem com servidores MySQL autônomos.

Clientes MySQL que usam o NDB Cluster como fonte de dados podem ser modificados para aproveitar a capacidade de se conectar a vários servidores MySQL para alcançar o balanceamento de carga e a recuperação automática. Por exemplo, clientes Java que usam o Connector/J 5.0.6 e versões posteriores podem usar URLs `jdbc:mysql:loadbalance://` (melhoradas no Connector/J 5.1.7) para alcançar o balanceamento de carga de forma transparente; para mais informações sobre o uso do Connector/J com o NDB Cluster, consulte Usar o Connector/J com o NDB Cluster.

**Programas de clientes NDB.** Podem ser escritos programas de cliente que acessam os dados do NDB Cluster diretamente do motor de armazenamento `NDBCLUSTER`, ignorando quaisquer servidores MySQL que possam estar conectados ao cluster, usando a API NDB, uma API C++ de alto nível. Tais aplicativos podem ser úteis para fins especializados onde uma interface SQL para os dados não é necessária. Para mais informações, consulte A API NDB.

Aplicações Java específicas do `NDB` também podem ser escritas para o NDB Cluster usando o NDB Cluster Connector para Java. Este NDB Cluster Connector inclui o ClusterJ, uma API de banco de dados de alto nível semelhante a frameworks de persistência de mapeamento objeto-relacional, como Hibernate e JPA, que se conectam diretamente ao `NDBCLUSTER`, e, portanto, não requer acesso a um servidor MySQL. Consulte Java e NDB Cluster e A API ClusterJ e o Modelo de Objeto de Dados para mais informações.

**Clientes de gerenciamento.** Esses clientes se conectam ao servidor de gerenciamento e fornecem comandos para iniciar e parar os nós de forma suave, iniciar e parar o rastreamento de mensagens (apenas versões de depuração), mostrar as versões e o status dos nós, iniciar e parar os backups, e assim por diante. Um exemplo desse tipo de programa é o cliente de gerenciamento **ndb\_mgm** fornecido com o NDB Cluster (veja a Seção 25.5.5, “ndb\_mgm — O Cliente de Gerenciamento do NDB Cluster”). Tais aplicativos podem ser escritos usando a API MGM, uma API em linguagem C que se comunica diretamente com um ou mais servidores de gerenciamento do NDB Cluster. Para mais informações, consulte a API MGM.

A Oracle também disponibiliza o MySQL Cluster Manager, que fornece uma interface de linha de comando avançada que simplifica muitas tarefas complexas de gerenciamento do NDB Cluster, como reiniciar um NDB Cluster com um grande número de nós. O cliente MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 9.5.0, para mais informações.

**Diários de eventos.** O NDB Cluster registra eventos por categoria (inicialização, desligamento, erros, pontos de verificação, etc.), prioridade e gravidade. Uma lista completa de todos os eventos reportados pode ser encontrada na Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”. Os diários de eventos são dos dois tipos listados aqui:

* Diário do cluster: Mantem um registro de todos os eventos reportados desejados para o cluster como um todo.
* Diário do nó: Um diário separado que também é mantido para cada nó individual.

Nota

Sob circunstâncias normais, é necessário e suficiente manter e examinar apenas o diário do cluster. Os diários de nó precisam ser consultados apenas para fins de desenvolvimento de aplicativos e depuração.

**Ponto de Controle.** De modo geral, quando os dados são salvos no disco, diz-se que um ponto de controle foi alcançado. Mais especificamente para o NDB Cluster, um ponto de controle é um momento em que todas as transações confirmadas são armazenadas no disco. No que diz respeito ao motor de armazenamento `NDB`, existem dois tipos de pontos de controle que trabalham juntos para garantir que uma visão consistente dos dados do cluster seja mantida. Estes são mostrados na seguinte lista:

* Ponto de Controle Local (LCP): Este é um ponto de controle específico para um único nó; no entanto, os LCPs ocorrem para todos os nós do cluster mais ou menos simultaneamente. Um LCP geralmente ocorre a cada poucos minutos; o intervalo preciso varia e depende da quantidade de dados armazenados pelo nó, do nível de atividade do cluster e de outros fatores.

O NDB 9.5 suporta LCPs parciais, que podem melhorar significativamente o desempenho em algumas condições. Veja as descrições dos parâmetros de configuração `EnablePartialLcp` e `RecoveryWork` que habilitam LCPs parciais e controlam a quantidade de armazenamento que eles usam.

* Ponto de Controle Global (GCP): Um GCP ocorre a cada poucos segundos, quando as transações de todos os nós são sincronizadas e o log de revisão é descarregado no disco.

Para mais informações sobre os arquivos e diretórios criados pelos pontos de controle locais e globais, consulte o Diretório do Sistema de Arquivos do Nó de Dados do NDB Cluster.

**Transportador.** Usamos o termo transportador para o mecanismo de transporte de dados empregado entre os nós de dados. O MySQL NDB Cluster 9.5 suporta três desses, que estão listados aqui:

* *TCP/IP sobre Ethernet*. Veja a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”.

* *TCP/IP Direto*. Usa conexões máquina a máquina. Veja a Seção 25.4.3.11, “Conexões TCP/IP do NDB Cluster Usando Conexões Direitas”.

Embora este transportador use o mesmo protocolo TCP/IP mencionado no item anterior, ele requer a configuração do hardware de maneira diferente e também é configurado de forma diferente. Por essa razão, ele é considerado um mecanismo de transporte separado para o NDB Cluster.

* *Memória compartilhada (SHM)*. Veja a Seção 25.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”.

Como é onipresente, a maioria dos usuários utiliza TCP/IP sobre Ethernet para o NDB Cluster.

Independentemente do transportador utilizado, o `NDB` tenta garantir que a comunicação entre os processos dos nós de dados seja realizada usando blocos de dados o mais grandes possível, pois isso beneficia todos os tipos de transmissão de dados.