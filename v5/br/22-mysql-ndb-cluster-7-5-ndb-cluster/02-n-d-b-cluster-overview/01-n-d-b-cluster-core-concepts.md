### 21.2.1 Conceitos centrais do Núcleo do Cluster NDB

`NDBCLUSTER` (também conhecido como `NDB`) é um motor de armazenamento em memória que oferece recursos de alta disponibilidade e persistência de dados.

O mecanismo de armazenamento `NDBCLUSTER` pode ser configurado com uma variedade de opções de recuperação e balanceamento de carga, mas é mais fácil começar com o mecanismo de armazenamento no nível do cluster. O mecanismo de armazenamento `NDB` do NDB Cluster contém um conjunto completo de dados, dependente apenas de outros dados dentro do próprio cluster.

A parte "Cluster" do NDB Cluster é configurada de forma independente dos servidores MySQL. Em um NDB Cluster, cada parte do cluster é considerada um nó.

Nota

Em muitos contextos, o termo "nó" é usado para indicar um computador, mas quando se trata do NDB Cluster, ele significa um *processo*. É possível executar vários nós em um único computador; para um computador em que um ou mais nós do cluster estão sendo executados, usamos o termo host do cluster.

Existem três tipos de nós de cluster, e em uma configuração mínima de NDB Cluster, deve haver pelo menos três nós, um de cada um desses tipos:

- Nó de gerenciamento: O papel deste tipo de nó é gerenciar os outros nós dentro do NDB Cluster, realizando funções como fornecer dados de configuração, iniciar e parar nós e executar backups. Como este tipo de nó gerencia a configuração dos outros nós, um nó deste tipo deve ser iniciado primeiro, antes de qualquer outro nó. Um nó deste tipo é iniciado com o comando **ndb_mgmd**.

- Núcleo de dados: Este tipo de nó armazena os dados do clúster. Há tantos nós de dados quanto há réplicas de fragmentos, vezes o número de fragmentos (veja Seção 21.2.2, “Nó de clúster NDB, Grupos de nó, Réplicas de fragmentos e Partições”). Por exemplo, com duas réplicas de fragmentos, cada uma com dois fragmentos, são necessários quatro nós de dados. Uma réplica de fragmento é suficiente para o armazenamento de dados, mas não oferece redundância; portanto, recomenda-se ter duas (ou mais) réplicas de fragmentos para fornecer redundância e, assim, alta disponibilidade. Um nó de dados é iniciado com o comando **ndbd** (veja Seção 21.5.1, “ndbd — O daemon de nó de dados do clúster NDB”) ou **ndbmtd** (veja Seção 21.5.3, “ndbmtd — O daemon de nó de dados do clúster NDB (multi-threaded)”).

  As tabelas do NDB Cluster são normalmente armazenadas completamente na memória, em vez de no disco (é por isso que chamamos o NDB Cluster de banco de dados em memória). No entanto, alguns dados do NDB Cluster podem ser armazenados no disco; consulte Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster” para obter mais informações.

- Nó SQL: Este é um nó que acessa os dados do cluster. No caso do NDB Cluster, um nó SQL é um servidor MySQL tradicional que utiliza o mecanismo de armazenamento `NDBCLUSTER`. Um nó SQL é um processo **mysqld** iniciado com as opções `--ndbcluster` e `--ndb-connectstring`, que são explicadas em outro lugar neste capítulo, possivelmente com opções adicionais do servidor MySQL também.

  Um nó SQL é, na verdade, apenas um tipo especializado de nó de API, que designa qualquer aplicativo que acesse os dados do NDB Cluster. Outro exemplo de um nó de API é o utilitário **ndb_restore** que é usado para restaurar uma cópia de segurança do cluster. É possível escrever tais aplicativos usando a API NDB. Para informações básicas sobre a API NDB, consulte Começando com a API NDB.

Importante

Não é realista esperar usar uma configuração de três nós em um ambiente de produção. Essa configuração não oferece redundância; para se beneficiar das características de alta disponibilidade do NDB Cluster, você deve usar vários nós de dados e SQL. O uso de vários nós de gerenciamento também é altamente recomendado.

Para uma breve introdução às relações entre nós, grupos de nós, réplicas de fragmentos e partições no NDB Cluster, consulte Seção 21.2.2, “Nodos do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições”.

A configuração de um clúster envolve a configuração de cada nó individual no clúster e a configuração de links de comunicação individuais entre os nós. O NDB Cluster é atualmente projetado com a intenção de que os nós de dados sejam homogêneos em termos de poder do processador, espaço de memória e largura de banda. Além disso, para fornecer um único ponto de configuração, todos os dados de configuração para o clúster como um todo estão localizados em um arquivo de configuração.

O servidor de gerenciamento gerencia o arquivo de configuração do clúster e o log do clúster. Cada nó no clúster recupera os dados de configuração do servidor de gerenciamento e, portanto, requer uma maneira de determinar onde o servidor de gerenciamento reside. Quando eventos interessantes ocorrem nos nós de dados, os nós transferem informações sobre esses eventos para o servidor de gerenciamento, que, em seguida, escreve as informações no log do clúster.

Além disso, pode haver qualquer número de processos ou aplicativos de cliente de cluster. Estes incluem clientes padrão do MySQL, programas de API específicos do `NDB` e clientes de gerenciamento. Estes são descritos nos próximos parágrafos.

**Clientes padrão MySQL.** O NDB Cluster pode ser usado com aplicativos MySQL existentes escritos em PHP, Perl, C, C++, Java, Python, e assim por diante. Essas aplicações de cliente enviam instruções SQL para os servidores MySQL e recebem respostas deles, atuando como nós SQL do NDB Cluster, de maneira muito semelhante à forma como interagem com servidores MySQL autônomos.

Os clientes MySQL que utilizam um NDB Cluster como fonte de dados podem ser modificados para aproveitar a capacidade de se conectar a vários servidores MySQL para alcançar o balanceamento de carga e a recuperação em caso de falha. Por exemplo, os clientes Java que utilizam o Connector/J 5.0.6 e versões posteriores podem usar URLs `jdbc:mysql:loadbalance://` (melhoradas no Connector/J 5.1.7) para alcançar o balanceamento de carga de forma transparente; para obter mais informações sobre o uso do Connector/J com o NDB Cluster, consulte Usando o Connector/J com o NDB Cluster.

**Programas de cliente do NDB.** Podem ser escritos programas de cliente que acessem os dados do NDB Cluster diretamente do motor de armazenamento `NDBCLUSTER`, ignorando quaisquer servidores MySQL que estejam conectados ao clúster, usando a API do NDB, uma API C++ de alto nível. Tais aplicativos podem ser úteis para fins especializados onde uma interface SQL para os dados não é necessária. Para mais informações, consulte A API do NDB.

Aplicações Java específicas para NDB também podem ser escritas para o NDB Cluster usando o NDB Cluster Connector para Java. Este NDB Cluster Connector inclui o ClusterJ, uma API de banco de dados de alto nível semelhante a frameworks de persistência de mapeamento objeto-relacional, como Hibernate e JPA, que se conectam diretamente ao `NDBCLUSTER`, e, portanto, não requer acesso a um servidor MySQL. Consulte Java e NDB Cluster e A API ClusterJ e o Modelo de Objetos de Dados para obter mais informações.

**Clientes de gerenciamento.** Esses clientes se conectam ao servidor de gerenciamento e fornecem comandos para iniciar e parar os nós de forma suave, iniciar e parar o rastreamento de mensagens (apenas versões de depuração), exibir as versões e o status dos nós, iniciar e parar os backups, e assim por diante. Um exemplo desse tipo de programa é o cliente de gerenciamento **ndb_mgm** fornecido com o NDB Cluster (veja Seção 21.5.5, “ndb_mgm — O Cliente de Gerenciamento do NDB Cluster”). Tais aplicativos podem ser escritos usando a API MGM, uma API em linguagem C que se comunica diretamente com um ou mais servidores de gerenciamento do NDB Cluster. Para mais informações, consulte A API MGM.

A Oracle também disponibiliza o MySQL Cluster Manager, que oferece uma interface avançada de linha de comando que simplifica muitas tarefas complexas de gerenciamento do NDB Cluster, como reiniciar um NDB Cluster com um grande número de nós. O cliente MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 1.4.8, para obter mais informações.

**Registros de eventos.** Os registros do NDB Cluster registram eventos por categoria (inicialização, desligamento, erros, pontos de verificação, etc.), prioridade e gravidade. Uma lista completa de todos os eventos reportáveis pode ser encontrada em Seção 21.6.3, “Relatórios de eventos gerados no NDB Cluster”. Os registros de eventos são dos dois tipos listados aqui:

- Registro do cluster: Mantém um registro de todos os eventos relatáveis desejados para o cluster como um todo.

- Registro do nó: Um registro separado que também é mantido para cada nó individual.

Nota

Em circunstâncias normais, é necessário e suficiente manter e examinar apenas o log do cluster. Os logs do nó só precisam ser consultados para fins de desenvolvimento e depuração de aplicativos.

**Ponto de verificação.** De forma geral, quando os dados são salvos no disco, diz-se que um ponto de verificação foi alcançado. Mais especificamente, no NDB Cluster, um ponto de verificação é um momento no tempo em que todas as transações confirmadas são armazenadas no disco. No que diz respeito ao mecanismo de armazenamento `NDB`, existem dois tipos de pontos de verificação que trabalham juntos para garantir que uma visão consistente dos dados do cluster seja mantida. Estes são mostrados na seguinte lista:

- Ponto de Controle Local (LCP): Este é um ponto de controle específico para um único nó; no entanto, os LCPs ocorrem para todos os nós do clúster de forma mais ou menos simultânea. Um LCP geralmente ocorre a cada poucos minutos; o intervalo preciso varia e depende da quantidade de dados armazenados pelo nó, do nível de atividade do clúster e de outros fatores.

  Anteriormente, um LCP envolvia o armazenamento de todos os dados de um nó no disco. O NDB 7.6 introduz suporte para LCPs parciais, o que pode melhorar significativamente o tempo de recuperação em algumas condições. Consulte Seção 21.2.4.2, “O que há de novo no NDB Cluster 7.6” para obter mais informações, bem como as descrições dos parâmetros de configuração `EnablePartialLcp` e `RecoveryWork` que habilitam LCPs parciais e controlam a quantidade de armazenamento que eles usam.

- Ponto de verificação global (GCP): Um GCP ocorre a cada poucos segundos, quando as transações de todos os nós são sincronizadas e o log de revisão é descarregado no disco.

Para obter mais informações sobre os arquivos e diretórios criados por pontos de verificação locais e globais, consulte Diretório do Sistema de Arquivos do Nó de Dados do NDBC Cluster.

**Transportador**. Usamos o termo transportador para o mecanismo de transporte de dados empregado entre os nós de dados. O MySQL NDB Cluster 7.5 e 7.6 suportam três desses mecanismos, que estão listados aqui:

- *TCP/IP sobre Ethernet*. Veja Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster”.

- *TCP/IP direto*. Utiliza conexões máquina a máquina. Consulte Seção 21.4.3.11, “Conexões TCP/IP do NDB Cluster usando conexões diretas”.

  Embora este transportador use o mesmo protocolo TCP/IP mencionado no item anterior, ele exige a configuração do hardware de maneira diferente e também é configurado de forma diferente. Por essa razão, ele é considerado um mecanismo de transporte separado para o NDB Cluster.

- *Memória compartilhada (SHM)*. Consulte Seção 21.4.3.12, "Conexões de Memória Compartilhada de NDB Cluster".

Como é onipresente, a maioria dos usuários utiliza o TCP/IP sobre Ethernet para o NDB Cluster.

Independentemente do transportador utilizado, o `NDB` tenta garantir que a comunicação entre os processos dos nós de dados seja realizada usando blocos o mais grandes possível, pois isso beneficia todos os tipos de transmissão de dados.
