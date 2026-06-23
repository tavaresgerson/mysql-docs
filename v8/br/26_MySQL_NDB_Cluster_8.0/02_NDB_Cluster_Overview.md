## 25.2 Visão Geral do Aglomerado NDB

O NDB Cluster é uma tecnologia que permite a agregação de bancos de dados em memória em um sistema sem nada compartilhado. A arquitetura sem nada compartilhado permite que o sistema trabalhe com hardware muito econômico e com um mínimo de requisitos específicos para hardware ou software.

O NDB Cluster foi projetado para não ter nenhum ponto único de falha. Em um sistema sem nada compartilhado, espera-se que cada componente tenha sua própria memória e disco, e o uso de mecanismos de armazenamento compartilhado, como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado ou suportado.

O NDB Cluster integra o servidor padrão MySQL com um motor de armazenamento agrupado de memória chamado `NDB` (que significa “*N*etwork *D*ata*B*ase”). Em nossa documentação, o termo `NDB` se refere à parte da configuração que é específica para o motor de armazenamento, enquanto “MySQL NDB Cluster” se refere à combinação de um ou mais servidores MySQL com o motor de armazenamento `NDB`.

Um NDB Cluster é composto por um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nós, podem incluir servidores MySQL (para acesso aos dados do NDB), nós de dados (para armazenamento dos dados), um ou mais servidores de gerenciamento e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 25.1 Componentes do NDB Cluster**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

Todos esses programas trabalham juntos para formar um NDB Cluster (consulte a Seção 25.5, “Programas de NDB Cluster”). Quando os dados são armazenados pelo motor de armazenamento `NDB`, as tabelas (e os dados das tabelas) são armazenadas nos nós de dados. Essas tabelas são diretamente acessíveis a todos os outros servidores MySQL (nós SQL) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualizar o salário de um funcionário, todos os outros servidores MySQL que consultam esses dados podem ver essa mudança imediatamente.

A partir da NDB 8.0.31, um nó SQL de NDB Cluster 8.0 usa o daemon do servidor **mysqld**, que é o mesmo que o **mysqld** fornecido com as distribuições do MySQL Server 8.0. Na NDB 8.0.30 e versões anteriores, diferia em vários aspectos críticos do **mysqld** binário fornecido com o MySQL Server, e as duas versões do **mysqld** não eram intercambiáveis. Você deve ter em mente que *uma instância do **mysqld**, independentemente da versão, que não esteja conectada a um NDB Cluster não pode usar o mecanismo de armazenamento `NDB` e não pode acessar quaisquer dados do NDB Cluster*.

Os dados armazenados nos nós de dados do NDB Cluster podem ser espelhados; o clúster pode lidar com falhas em nós de dados individuais sem outro impacto além de um pequeno número de transações serem abortadas devido à perda do estado da transação. Como se espera que as aplicações transacionais lidem com falhas de transação, isso não deve ser uma fonte de problemas.

Os nós individuais podem ser interrompidos e reiniciados, e depois podem se reconectar ao sistema (cluster). Reinicializações em rolagem (nas quais todos os nós são reiniciados em ordem) são usadas para fazer alterações de configuração e atualizações de software (veja Seção 25.6.5, “Realizando uma Reinicialização em Rolagem de um Cluster NDB”). Reinicializações em rolagem também são usadas como parte do processo de adição de novos nós de dados online (veja Seção 25.6.7, “Adição de Nodos de Dados de Cluster NDB Online”). Para mais informações sobre nós de dados, como eles são organizados em um Cluster NDB e como eles lidam e armazenam dados do Cluster NDB, veja Seção 25.2.2, “Nodos do Cluster NDB, Grupos de Nó, Replicas de Fragmento e Partições”.

Fazer backup e restaurar bancos de dados do NDB Cluster pode ser feito usando a funcionalidade nativa do `NDB` encontrada no cliente de gerenciamento do NDB Cluster e no programa **ndb_restore** incluído na distribuição do NDB Cluster. Para mais informações, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”, e a Seção 25.5.23, “ndb_restore — Restaurar um Backup de NDB Cluster”. Você também pode usar a funcionalidade padrão do MySQL fornecida para esse propósito no **mysqldump** e no servidor MySQL. Para mais informações, consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”, no manual do MySQL.

Os nós do cluster NDB podem empregar diferentes mecanismos de transporte para comunicações entre nós; TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é utilizado na maioria das implantações do mundo real.

### 25.2.1 Conceitos fundamentais do núcleo do cluster NDB

`NDBCLUSTER` (também conhecido como `NDB`) é um motor de armazenamento em memória que oferece recursos de alta disponibilidade e persistência de dados.

O motor de armazenamento `NDBCLUSTER` pode ser configurado com uma série de opções de falha e balanceamento de carga, mas é mais fácil começar com o motor de armazenamento no nível do clúster. O motor de armazenamento `NDB` do NDB Cluster contém um conjunto completo de dados, dependente apenas de outros dados dentro do próprio clúster.

A parte "Cluster" do NDB Cluster é configurada de forma independente dos servidores MySQL. Em um NDB Cluster, cada parte do cluster é considerada um nó.

Nota

Em muitos contextos, o termo "nó" é usado para indicar um computador, mas quando se discute o NDB Cluster, ele significa um *processo*. É possível executar vários nós em um único computador; para um computador em que um ou mais nós do cluster estão sendo executados, usamos o termo host do cluster.

Existem três tipos de nós de cluster, e em uma configuração mínima de NDB Cluster, há pelo menos três nós, um de cada um desses tipos:

* Nó de gerenciamento: O papel deste tipo de nó é gerenciar os outros nós dentro do NDB Cluster, realizando funções como fornecer dados de configuração, iniciar e parar nós e executar backups. Como este tipo de nó gerencia a configuração dos outros nós, um nó deste tipo deve ser iniciado primeiro, antes de qualquer outro nó. Um nó de gerenciamento é iniciado com o comando **ndb_mgmd**.

* Nó de dados: Este tipo de nó armazena dados do clúster. Há tantos nós de dados quanto réplicas de fragmentos, vezes o número de fragmentos (ver Seção 25.2.2, “Nodos de clúster do NDB, Grupos de nó, Replicatas de fragmentos e Partições”). Por exemplo, com duas réplicas de fragmentos, cada uma com dois fragmentos, você precisa de quatro nós de dados. Uma réplica de fragmento é suficiente para armazenamento de dados, mas não oferece redundância; portanto, é recomendável ter duas (ou mais) réplicas de fragmentos para fornecer redundância e, assim, alta disponibilidade. Um nó de dados é iniciado com o comando **ndbd** (ver Seção 25.5.1, “ndbd — O daemon de nó de dados do clúster NDB”) ou **ndbmtd” (ver Seção 25.5.3, “ndbmtd — O daemon de nó de dados do clúster NDB (multi-threaded)”).

As tabelas do NDB Cluster são normalmente armazenadas completamente na memória, em vez de no disco (é por isso que nos referimos ao NDB Cluster como um banco de dados em memória). No entanto, alguns dados do NDB Cluster podem ser armazenados em disco; consulte a Seção 25.6.11, “Tabelas de dados de disco do NDB Cluster”, para obter mais informações.

* Nó SQL: Este é um nó que acessa os dados do cluster. No caso do NDB Cluster, um nó SQL é um servidor MySQL tradicional que utiliza o mecanismo de armazenamento `NDBCLUSTER`. Um nó SQL é um processo **mysqld** iniciado com as opções `--ndbcluster` e `--ndb-connectstring`, que são explicadas em outro lugar neste capítulo, possivelmente com opções adicionais do servidor MySQL também.

Um nó SQL é, na verdade, apenas um tipo especializado de nó API, que designa qualquer aplicativo que acesse os dados do NDB Cluster. Outro exemplo de um nó API é o utilitário **ndb_restore** que é usado para restaurar um backup do cluster. É possível escrever tais aplicativos usando a API NDB. Para informações básicas sobre a API NDB, consulte Começando com a API NDB.

Importante

Não é realista esperar usar uma configuração de três nós em um ambiente de produção. Tal configuração não oferece redundância; para se beneficiar das características de alta disponibilidade do NDB Cluster, você deve usar vários nós de dados e SQL. O uso de vários nós de gerenciamento também é altamente recomendado.

Para uma breve introdução às relações entre nós, grupos de nós, réplicas de fragmentos e partições no NDB Cluster, consulte a Seção 25.2.2, “Nodos, Grupos de Nós, Replicatas de Fragmentos e Partições do NDB Cluster”.

A configuração de um clúster envolve a configuração de cada nó individual no clúster e a configuração de links de comunicação individuais entre os nós. O NDB Cluster é atualmente projetado com a intenção de que os nós de dados sejam homogêneos em termos de poder de processamento, espaço de memória e largura de banda. Além disso, para fornecer um único ponto de configuração, todos os dados de configuração para o clúster como um todo estão localizados em um arquivo de configuração.

O servidor de gerenciamento gerencia o arquivo de configuração do clúster e o log do clúster. Cada nó no clúster recupera os dados de configuração do servidor de gerenciamento e, portanto, requer uma maneira de determinar onde o servidor de gerenciamento reside. Quando eventos interessantes ocorrem nos nós de dados, os nós transfere informações sobre esses eventos para o servidor de gerenciamento, que então escreve as informações no log do clúster.

Além disso, pode haver qualquer número de processos ou aplicativos de cliente de cluster. Estes incluem clientes padrão de MySQL, programas de API específicos do `NDB` e clientes de gerenciamento. Estes são descritos nos próximos parágrafos.

**Clientes padrão do MySQL.** O NDB Cluster pode ser usado com aplicativos existentes do MySQL escritos em PHP, Perl, C, C++, Java, Python, e assim por diante. Esses aplicativos de cliente enviam instruções SQL para os servidores MySQL e recebem respostas deles, atuando como nós SQL do NDB Cluster, de maneira muito semelhante à forma como eles interagem com servidores MySQL autônomos.

Os clientes do MySQL que utilizam um NDB Cluster como fonte de dados podem ser modificados para aproveitar a capacidade de se conectar a vários servidores MySQL para alcançar o balanceamento de carga e a transição. Por exemplo, os clientes Java que utilizam o Connector/J 5.0.6 e versões posteriores podem usar URLs `jdbc:mysql:loadbalance://` (melhoria no Connector/J 5.1.7) para alcançar o balanceamento de carga de forma transparente; para mais informações sobre o uso do Connector/J com o NDB Cluster, consulte Usando o Connector/J com o NDB Cluster.

**Programas de cliente NDB.** Podem ser escritos programas de cliente que acessem os dados do NDB Cluster diretamente do motor de armazenamento `NDBCLUSTER`, ignorando quaisquer servidores MySQL que possam estar conectados ao clúster, usando a API NDB, uma API de alto nível em C++. Tais aplicativos podem ser úteis para fins especializados onde uma interface SQL para os dados não é necessária. Para mais informações, consulte a API NDB.

Aplicações Java específicas para `NDB` também podem ser escritas para o NDB Cluster usando o NDB Cluster Connector para Java. Este NDB Cluster Connector inclui ClusterJ, uma API de banco de dados de alto nível semelhante a frameworks de persistência de mapeamento objeto-relacional, como Hibernate e JPA, que se conectam diretamente ao `NDBCLUSTER`, e, portanto, não requer acesso a um servidor MySQL. Consulte Java e NDB Cluster e A API ClusterJ e o Modelo de Objeto de Dados para obter mais informações.

O NDB Cluster também suporta aplicações escritas em JavaScript usando Node.js. O Conectivo MySQL para JavaScript inclui adaptadores para acesso direto ao mecanismo de armazenamento `NDB`, bem como para o MySQL Server. As aplicações que utilizam este Conectivo são tipicamente baseadas em eventos e utilizam um modelo de objeto de domínio semelhante, de muitas maneiras, ao empregado pelo ClusterJ. Para mais informações, consulte o Conectivo NoSQL MySQL para JavaScript.

**Clientes de gerenciamento.** Esses clientes se conectam ao servidor de gerenciamento e fornecem comandos para iniciar e parar nós de forma graciosa, iniciar e parar o rastreamento de mensagens (apenas versões de depuração), mostrar versões e status dos nós, iniciar e parar backups, e assim por diante. Um exemplo desse tipo de programa é o cliente de gerenciamento **ndb_mgm** fornecido com o NDB Cluster (consulte Seção 25.5.5, “ndb_mgm — O cliente de gerenciamento do NDB Cluster”). Tais aplicativos podem ser escritos usando a API MGM, uma API em linguagem C que se comunica diretamente com um ou mais servidores de gerenciamento do NDB Cluster. Para mais informações, consulte a API MGM.

A Oracle também disponibiliza o MySQL Cluster Manager, que oferece uma interface avançada de linha de comando que simplifica muitas tarefas complexas de gerenciamento do NDB Cluster, como reiniciar um NDB Cluster com um grande número de nós. O cliente MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. O MySQL Cluster Manager 8.0 oferece suporte ao NDB 8.0. Consulte o Manual do Usuário do MySQL Cluster Manager 8.0.43 para obter mais informações.

**Registros de eventos.** Os registros de eventos do NDB Cluster registram eventos por categoria (inicialização, desligamento, erros, pontos de verificação, etc.), prioridade e gravidade. Uma lista completa de todos os eventos relatáveis pode ser encontrada na Seção 25.6.3, “Relatórios de eventos gerados no NDB Cluster”. Os registros de eventos são dos dois tipos listados aqui:

* Registro do grupo: Mantém um registro de todos os eventos desejados que devem ser relatados para o grupo como um todo.

* Registro do nó: Um registro separado que também é mantido para cada nó individual.

Nota

Sob circunstâncias normais, é necessário e suficiente manter e examinar apenas o log do cluster. Os logs do nó só precisam ser consultados para fins de desenvolvimento e depuração de aplicativos.

**Ponto de verificação.** De forma geral, quando os dados são salvos em disco, diz-se que um ponto de verificação foi alcançado. Mais especificamente para o NDB Cluster, um ponto de verificação é um momento em que todas as transações comprometidas são armazenadas em disco. No que diz respeito ao motor de armazenamento `NDB`, existem dois tipos de pontos de verificação que trabalham juntos para garantir que uma visão consistente dos dados do cluster seja mantida. Estes são mostrados na lista a seguir:

* Ponto de verificação local (LCP): Este é um ponto de verificação específico para um único nó; no entanto, os LCP ocorrem para todos os nós do clúster de forma mais ou menos concorrente. Um LCP geralmente ocorre a cada alguns minutos; o intervalo preciso varia e depende da quantidade de dados armazenados pelo nó, do nível de atividade do clúster e de outros fatores.

O NDB 8.0 suporta LCPs parciais, o que pode melhorar significativamente o desempenho em algumas condições. Consulte as descrições dos parâmetros de configuração `EnablePartialLcp` e `RecoveryWork` que permitem LCPs parciais e controlam a quantidade de armazenamento que utilizam.

* Ponto de verificação global (GCP): Um GCP ocorre a cada poucos segundos, quando as transações de todos os nós são sincronizadas e o log de revisão é descarregado no disco.

Para obter mais informações sobre os arquivos e diretórios criados por pontos de verificação locais e globais, consulte o diretório do sistema de arquivos do NDB Cluster Data Node.

**Transportador.** Usamos o termo transportador para o mecanismo de transporte de dados empregado entre os nós de dados. O MySQL NDB Cluster 8.0 suporta três desses, que estão listados aqui:

*TCP/IP sobre Ethernet*. Veja a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”.

* *Direto TCP/IP*. Usa conexões máquina a máquina. Veja a Seção 25.4.3.11, "Conexões de NDB Cluster TCP/IP usando conexões diretas".

Embora este transportador use o mesmo protocolo TCP/IP mencionado no item anterior, ele exige a configuração do hardware de maneira diferente e também é configurado de maneira diferente. Por esse motivo, é considerado um mecanismo de transporte separado para o NDB Cluster.

*Memória compartilhada (SHM)*. Veja a Seção 25.4.3.12, "Conexões de Memória Compartilhada de NDB Cluster".

Como é onipresente, a maioria dos usuários utiliza TCP/IP sobre Ethernet para NDB Cluster.

Independentemente do transportador utilizado, o `NDB` tenta garantir que a comunicação entre os processos dos nós de dados seja realizada utilizando blocos o mais grandes possível, pois isso beneficia todos os tipos de transmissão de dados.

### 25.2.2 NDB Cluster Nodes, Grupos de Nó, Replicação de Fragmento e Partições

Esta seção discute a maneira pela qual o NDB Cluster divide e duplica os dados para armazenamento.

Vários conceitos centrais para uma compreensão desse tópico são discutidos nos próximos parágrafos.

**Nodo de dados.** Um processo **ndbd** ou **ndbmtd**") que armazena uma ou mais réplicas de fragmentos, ou seja, cópias das partições (discutidas mais tarde nesta seção) atribuídas ao grupo de nós do qual o nó faz parte.

Cada nó de dados deve estar localizado em um computador separado. Embora seja possível hospedar vários processos de nó de dados em um único computador, essa configuração geralmente não é recomendada.

É comum que os termos "nó" e "nó de dados" sejam usados de forma intercambiável quando se refere a um processo **ndbd** ou **ndbmtd") onde são mencionados, os nós de gerenciamento (processos **ndb_mgmd**) e os nós SQL (processos **mysqld**) são especificados como tal nesta discussão.

**Grupo de nós.** Um grupo de nós consiste em um ou mais nós e armazena partições ou conjuntos de réplicas de fragmentos (consulte o próximo item).

O número de grupos de nós em um NDB Cluster não é diretamente configurável; é uma função do número de nós de dados e do número de réplicas de fragmentação (parâmetro de configuração `NoOfReplicas`), conforme mostrado aqui:

```
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Assim, um NDB Cluster com 4 nós de dados tem 4 grupos de nós se `NoOfReplicas` estiver definido como 1 no arquivo `config.ini`, 2 grupos de nós se `NoOfReplicas` estiver definido como 2 e 1 grupo de nós se `NoOfReplicas` estiver definido como 4. As réplicas de fragmentação são discutidas mais adiante nesta seção; para mais informações sobre `NoOfReplicas`, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Nota

Todos os grupos de nós em um NDB Cluster devem ter o mesmo número de nós de dados.

Você pode adicionar novos grupos de nós (e, portanto, novos nós de dados) online a um NDB Cluster em execução; consulte a Seção 25.6.7, “Adicionar nós de dados de NDB Cluster online”, para obter mais informações.

**Particionamento.** Esta é uma porção dos dados armazenados pelo clúster. Cada nó é responsável por manter pelo menos uma cópia de qualquer partição atribuída a ele (ou seja, pelo menos uma réplica de fragmento) disponível para o clúster.

O número de partições usado por padrão pelo NDB Cluster depende do número de nós de dados e do número de threads LDM em uso pelos nós de dados, conforme mostrado aqui:

```
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

Ao usar nós de dados que executam **ndbmtd**"), o número de threads do LDM é controlado pelo ajuste para `MaxNoOfExecutionThreads`. Ao usar **ndbd**, há um único thread do LDM, o que significa que há tantas partições de clúster quanto nós participando do clúster. Este é também o caso ao usar **ndbmtd**") com `MaxNoOfExecutionThreads` definido como 3 ou menos. (Você deve estar ciente de que o número de threads do LDM aumenta com o valor deste parâmetro, mas não de uma forma estritamente linear, e que há restrições adicionais para defini-lo; consulte a descrição de `MaxNoOfExecutionThreads` para mais informações.)

**NDB e particionamento definido pelo usuário.** O NDB Cluster normalmente particiona as tabelas `NDBCLUSTER` automaticamente. No entanto, também é possível empregar particionamento definido pelo usuário com as tabelas `NDBCLUSTER`. Isso está sujeito às seguintes limitações:

1. Apenas os esquemas de particionamento `KEY` e `LINEAR KEY` são suportados em produção com tabelas `NDB`.

2. O número máximo de partições que podem ser definidas explicitamente para qualquer tabela `NDB` é `8 * [number of LDM threads] * [number of node groups]`, o número de grupos de nós em um NDB Cluster sendo determinado conforme discutido anteriormente nesta seção. Ao executar o **ndbd** para processos de nó de dados, definir o número de threads LDM não tem efeito (já que `ThreadConfig` se aplica apenas ao **ndbmtd]]), nesses casos, esse valor pode ser tratado como se fosse igual a 1 para fins de realização deste cálculo.

Veja a Seção 25.5.3, “ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multi-Thread)”, para mais informações.

Para mais informações relacionadas ao NDB Cluster e à partição definida pelo usuário, consulte a Seção 25.2.7, “Limitações conhecidas do NDB Cluster”, e a Seção 26.6.2, “Limitações de partição relacionadas aos motores de armazenamento”.

**Replica de fragmento.** Esta é uma cópia de uma partição de cluster. Cada nó em um grupo de nós armazena uma replica de fragmento. Também às vezes conhecida como replica de partição. O número de réplicas de fragmento é igual ao número de nós por grupo de nós.

Um fragmento pertence inteiramente a um único nó; um nó pode (e geralmente faz) armazenar várias réplicas de fragmento.

O diagrama a seguir ilustra um NDB Cluster com quatro nós de dados executando **ndbd**, organizados em dois grupos de nós, cada um com dois nós; os nós 1 e 2 pertencem ao grupo de nós 0, e os nós 3 e 4 pertencem ao grupo de nós 1.

Nota

Apenas os nós de dados são mostrados aqui; embora um NDB Cluster funcional exija um processo **ndb_mgmd** para a gestão do cluster e pelo menos um nó SQL para acessar os dados armazenados pelo cluster, esses foram omitidos da figura por questões de clareza.

**Figura 25.2 Grupo NDB com Dois Grupos de Nó**

![Content is described in the surrounding text.](images/fragment-replicas-groups-1-1.png)

Os dados armazenados pelo clúster são divididos em quatro partições, numeradas 0, 1, 2 e 3. Cada partição é armazenada—em múltiplas cópias—no mesmo grupo de nós. As partições são armazenadas em grupos de nós alternados da seguinte forma:

* A partição 0 é armazenada no grupo de nós 0; uma replica primária de fragmento (cópia primária) é armazenada no nó 1, e uma replica de fragmento de backup (cópia de backup da partição) é armazenada no nó 2.

* A partição 1 é armazenada no outro grupo de nós (grupo de nós 1); a replica primária do fragmento dessa partição está no nó 3, e sua replica de fragmento de backup está no nó 4.

* A partição 2 é armazenada no grupo de nós 0. No entanto, a colocação de suas duas réplicas de fragmento é invertida em relação à da Partição 0; para a Partição 2, a réplica de fragmento primária é armazenada no nó 2, e o backup no nó 1.

* A partição 3 é armazenada no grupo de nós 1, e a colocação de suas duas réplicas de fragmento é invertida em relação àquelas da partição

Ou seja, sua replica primária de fragmento está localizada no nó 4, com o backup no nó 3.

O que isso significa em relação ao funcionamento contínuo de um NDB Cluster é o seguinte: enquanto cada grupo de nós que participa do cluster tiver pelo menos um nó em operação, o cluster terá uma cópia completa de todos os dados e permanecerá viável. Isso é ilustrado no próximo diagrama.

**Figura 25.3 Nodos necessários para um clúster NDB 2x2**

![Content is described in the surrounding text.](images/replicas-groups-1-2.png)

Neste exemplo, o clúster consiste em dois grupos de nós, cada um composto por dois nós de dados. Cada nó de dados está executando uma instância do **ndbd**. Qualquer combinação de pelo menos um nó do grupo de nós 0 e pelo menos um nó do grupo de nós 1 é suficiente para manter o clúster "vivo". No entanto, se ambos os nós de um único grupo de nós falharem, a combinação composta pelos dois nós restantes do outro grupo de nós não é suficiente. Nesta situação, o clúster perdeu uma partição inteira e, portanto, não pode mais fornecer acesso a um conjunto completo de todos os dados do NDB Cluster.

O número máximo de grupos de nós suportados para uma única instância do NDB Cluster é de 48.

### 25.2.3 Requisitos de hardware, software e redes do cluster NDB

Uma das principais vantagens do NDB Cluster é que ele pode ser executado em hardware comum e não tem requisitos incomuns nesse sentido, exceto para grandes quantidades de RAM, devido ao fato de que todo o armazenamento de dados ao vivo é feito em memória. (É possível reduzir essa exigência usando tabelas de dados de disco—consulte a Seção 25.6.11, "Tabelas de Dados de Disco do NDB Cluster", para mais informações sobre essas tabelas.) Naturalmente, CPUs múltiplas e mais rápidas podem melhorar o desempenho. Os requisitos de memória para outros processos do NDB Cluster são relativamente pequenos.

Pode-se esperar que o aumento do número de CPUs, o uso de CPUs mais rápidas ou ambos nos computadores que hospedam os nós de dados melhore o desempenho do NDB Cluster. Os requisitos de memória para os processos do cluster, exceto os nós de dados, são relativamente pequenos.

Os requisitos de software para o NDB Cluster também são modestos. Os sistemas operacionais de hospedagem não exigem módulos, serviços, aplicativos ou configurações incomuns para suportar o NDB Cluster. Para os sistemas operacionais suportados, uma instalação padrão deve ser suficiente. Os requisitos de software do MySQL são simples: tudo o que é necessário é uma versão de produção do NDB Cluster. Não é estritamente necessário compilar o MySQL você mesmo apenas para poder usar o NDB Cluster. Assumemos que você está usando os binários apropriados para sua plataforma, disponíveis na página de downloads do software do NDB Cluster em <https://dev.mysql.com/downloads/cluster/>.

Para a comunicação entre os nós, o NDB Cluster suporta redes TCP/IP em qualquer topologia padrão, e o mínimo esperado para cada host é um cartão Ethernet padrão de 100 Mbps, além de um switch, hub ou roteador para fornecer conectividade de rede para o clúster como um todo. Recomendamos fortemente que um NDB Cluster seja executado em sua própria sub-rede que não seja compartilhada com máquinas que não fazem parte do clúster, pelas seguintes razões:

* **Segurança.** As comunicações entre os nós do NDB Cluster não são criptografadas ou protegidas de qualquer maneira. O único meio de proteger as transmissões dentro de um NDB Cluster é executar seu NDB Cluster em uma rede protegida. Se você pretende usar o NDB Cluster para aplicações web, o cluster deve definitivamente residir atrás do seu firewall e não na Zona Desmilitarizada (DMZ) ou em outro lugar da sua rede.

Consulte a Seção 25.6.20.1, “Problemas de segurança e de rede do cluster NDB”, para obter mais informações.

* **Eficiência. Configurar um NDB Cluster em uma rede privada ou protegida permite que o cluster faça uso exclusivo da largura de banda entre os hosts do cluster. Usar um switch separado para o seu NDB Cluster não só ajuda a proteger contra acesso não autorizado aos dados do NDB Cluster, como também garante que os nós do NDB Cluster estejam blindados contra interferências causadas por transmissões entre outros computadores na rede. Para maior confiabilidade, você pode usar dois switches e duas placas para remover a rede como um único ponto de falha; muitos controladores de dispositivos suportam o failover para tais links de comunicação.

**Comunicação em rede e latência.** O NDB Cluster requer comunicação entre os nós de dados e os nós da API (incluindo nós SQL), bem como entre os nós de dados e outros nós de dados, para executar consultas e atualizações. A latência de comunicação entre esses processos pode afetar diretamente o desempenho e a latência observados das consultas dos usuários. Além disso, para manter a consistência e o serviço mesmo em caso de falha silenciosa dos nós, o NDB Cluster utiliza mecanismos de batida de coração e tempo de espera que tratam uma perda prolongada de comunicação de um nó como falha do nó. Isso pode levar a uma redução da redundância. Lembre-se de que, para manter a consistência dos dados, um NDB Cluster é desligado quando o último nó de um grupo de nós falha. Assim, para evitar aumentar o risco de desligamento forçado, as interrupções de comunicação entre os nós devem ser evitadas sempre que possível.

O falecimento de um nó de dados ou de uma API resulta no cancelamento de todas as transações não confirmadas que envolvem o nó falhado. A recuperação do nó de dados requer a sincronização dos dados do nó falhado de um nó de dados sobrevivente e o restabelecimento dos registros de redo e de verificação de disco, antes de o nó de dados voltar a funcionar. Essa recuperação pode levar algum tempo, durante o qual o Cluster opera com redundância reduzida.

O Heartbeating depende da geração oportuna de sinais de batimento cardíaco por todos os nós. Isso pode não ser possível se o nó estiver sobrecarregado, tiver CPU insuficiente devido ao compartilhamento com outros programas ou estiver experimentando atrasos devido ao swapping. Se a geração de batimento cardíaco for suficientemente atrasada, outros nós tratam o nó que é lento em responder como falhado.

Esse tratamento de um nó lento como um falho pode ou não ser desejável em algumas circunstâncias, dependendo do impacto da operação lenta do nó no resto do clúster. Ao definir valores de tempo de espera, como `HeartbeatIntervalDbDb` e `HeartbeatIntervalDbApi` para o NDB Cluster, é necessário ter cuidado para alcançar a rápida detecção, a falha e o retorno ao serviço, evitando, ao mesmo tempo, falsos positivos potencialmente caros.

Quando se espera que as latências de comunicação entre os nós de dados sejam maiores do que o esperado em um ambiente de LAN (da ordem de 100 µs), os parâmetros de tempo de espera devem ser aumentados para garantir que quaisquer períodos permitidos de latência estejam dentro dos tempos de espera configurados. Aumentar os tempos de espera dessa maneira tem um efeito correspondente no tempo máximo para detectar a falha e, portanto, no tempo para recuperação do serviço.

Os ambientes LAN geralmente podem ser configurados com baixa latência estável e de tal forma que possam oferecer redundância com tempos de falha rápida. Falhas individuais de link podem ser recuperadas com latência mínima e controlada visível no nível TCP (onde o NDB Cluster normalmente opera). Ambientes WAN podem oferecer uma gama de latências, bem como redundância com tempos de falha mais lentos. Falhas individuais de link podem exigir mudanças de rota para se propagar antes que a conectividade de ponta a ponta seja restaurada. No nível TCP, isso pode aparecer como grandes latências em canais individuais. A latência TCP observada no pior dos casos nesses cenários está relacionada ao tempo mais crítico para a camada de IP redirecionar ao redor das falhas.

### 25.2.4 O que há de novo no MySQL NDB Cluster 8.0

As seções a seguir descrevem as mudanças na implementação do MySQL NDB Cluster no NDB Cluster 8.0 até 8.0.44, em comparação com as séries de lançamentos anteriores.

O NDB Cluster 8.4 também está disponível para produção; enquanto o NDB 8.0 ainda é suportado, sugerimos que você use o NDB 8.4 para novas implantações; para mais informações, consulte MySQL NDB Cluster 8.4. O NDB Cluster 9.3 está disponível como uma versão de desenvolvimento para prévia e teste de novos recursos atualmente em desenvolvimento; consulte O que há de novo no NDB Cluster 9.4.

O NDB Cluster 7.6 (veja o que há de novo no NDB Cluster 7.6) é uma versão GA anterior que ainda é suportada em produção, embora recomenda que novas implantações para uso de produção do MySQL NDB Cluster 8.4 sejam feitas. O NDB Cluster 7.5, 7.4 e 7.3 foram versões GA anteriores que atingiram o fim de sua vida útil e não são mais suportadas ou mantidas. Recomendamos que novas implantações para uso de produção do MySQL NDB Cluster 8.4 sejam feitas.

#### O que há de novo no NDB Cluster 8.0

As principais mudanças e novas funcionalidades do NDB Cluster 8.0 que provavelmente serão de interesse estão listadas na lista a seguir:

* **Melhorias de compatibilidade.** As seguintes mudanças reduzem as diferenças não essenciais de longa data no comportamento de `NDB` em comparação com o de outros motores de armazenamento do MySQL:

+ **Desenvolvimento em paralelo com o servidor MySQL.** A partir desta versão, o MySQL NDB Cluster está sendo desenvolvido em paralelo com o servidor padrão MySQL 8.0, sob um novo modelo de lançamento unificado, com as seguintes características:

- O NDB 8.0 é desenvolvido a partir do código-fonte da árvore MySQL 8.0 e é lançado com ele.

- O esquema de numeração para as versões do NDB Cluster 8.0 segue o esquema para o MySQL 8.0.

- Ao construir a fonte com o aplicativo de suporte `NDB`, o `-cluster` é anexado à string de versão devolvida pelo **mysql** `-V`, conforme mostrado aqui:

      ```
      $> mysql -V
      mysql  Ver 8.0.44-cluster for Linux on x86_64 (Source distribution)
      ```

Os binários `NDB` continuam a exibir tanto a versão do MySQL Server quanto a versão do motor `NDB`, da seguinte forma:

      ```
      $> ndb_mgm -V
      MySQL distrib mysql-8.0.44 ndb-8.0.44, for Linux (x86_64)
      ```

No MySQL Cluster NDB 8.0, esses dois números de versão são sempre os mesmos.

Para construir a fonte do MySQL com suporte ao NDB Cluster, use a opção `-DWITH_NDB` do CMake (NDB 8.0.31 e versões posteriores; para versões anteriores, use `-DWITH_NDBCLUSTER`).

+ **Notas sobre suporte à plataforma.** O NDB 8.0 traz as seguintes mudanças no suporte à plataforma:

- `NDBCLUSTER` não suporta mais plataformas de 32 bits. A partir do NDB 8.0.21, o processo de construção do NDB verifica a arquitetura do sistema e interrompe se não for uma plataforma de 64 bits.

- Agora é possível construir `NDB` a partir de fonte para CPUs `ARM` de 64 bits. Atualmente, esse suporte é apenas de fonte e não fornecemos nenhum binário pré-compilado para essa plataforma.

+ **Nomes de banco de dados e tabelas.** O NDB 8.0 remove o limite anterior de 63 bytes nos identificadores para bancos de dados e tabelas. Esses identificadores podem agora usar até 64 bytes, assim como outros objetos que utilizam outros motores de armazenamento do MySQL. Veja a Seção 25.2.7.11, “Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0”.

+ **Nomes gerados para chaves estrangeiras.** `NDB` agora usa o padrão `tbl_name_fk_N` para nomear chaves estrangeiras geradas internamente. Isso é semelhante ao padrão usado por `InnoDB`.

* **Distribuição e sincronização de esquema e metadados.** O NDB 8.0 utiliza o dicionário de dados MySQL para distribuir informações de esquema para nós SQL que se juntam a um clúster e para sincronizar novas alterações de esquema entre nós SQL existentes. A lista a seguir descreve melhorias individuais relacionadas a este trabalho de integração:

+ **Melhorias na distribuição de esquemas.** O coordenador de distribuição de esquemas `NDB`, que lida com operações de esquema e acompanha seu progresso, foi estendido no NDB 8.0 para garantir que os recursos usados durante uma operação de esquema sejam liberados ao seu término. Anteriormente, parte desse trabalho era feita pelo cliente de distribuição de esquemas; isso foi alterado devido ao fato de que o cliente nem sempre tinha todas as informações de estado necessárias, o que poderia levar a vazamentos de recursos quando o cliente decidiu abandonar a operação de esquema antes do término e sem informar o coordenador.

Para ajudar a corrigir esse problema, a detecção do tempo limite de operação do esquema foi movida do cliente de distribuição do esquema para o coordenador, proporcionando ao coordenador a oportunidade de limpar quaisquer recursos usados durante a operação do esquema. O coordenador agora verifica as operações de esquema em andamento em intervalos regulares e marca os participantes que ainda não completaram uma determinada operação de esquema como falha quando detecta o tempo limite. Também fornece avisos adequados sempre que ocorre um tempo limite de operação do esquema. (Deve-se notar que, após tal detecção de tempo limite, a própria operação do esquema continua.) O relatório adicional é feito imprimindo uma lista de operações de esquema ativas em intervalos regulares sempre que uma ou mais dessas operações estão em andamento.

Como parte adicional deste trabalho, uma nova opção do **mysqld** `--ndb-schema-dist-timeout` permite definir o tempo de espera até que uma operação de esquema seja marcada como tendo esgotado o prazo.

+ **Distribuição de arquivos de dados do disco.** O NDB Cluster 8.0.14 utiliza o dicionário de dados MySQL para garantir que os arquivos de dados do disco e construções relacionadas, como espaços de tabela e grupos de arquivos de log, sejam distribuídos corretamente entre todos os nós SQL conectados.

+ **Sincronização de esquema de objetos do espaço de tabela.** Quando um servidor MySQL se conecta como um nó SQL a um clúster NDB, ele verifica seu dicionário de dados contra as informações encontradas no dicionário `NDB`.

Anteriormente, os únicos objetos `NDB` sincronizados na conexão de um novo nó SQL eram bancos de dados e tabelas; o MySQL NDB Cluster 8.0 também implementa a sincronização de esquemas de objetos de dados de disco, incluindo espaços de tabela e grupos de arquivos de registro. Entre outros benefícios, isso elimina a possibilidade de uma discrepância entre o dicionário de dados MySQL e o dicionário `NDB` após um backup e restauração nativas, na qual os espaços de tabela e grupos de arquivos de registro foram restaurados ao dicionário `NDB`, mas não ao dicionário de dados do MySQL Server.

Também não é mais possível emitir uma declaração `CREATE TABLE` que se refere a um espaço de tabela inexistente. Tal declaração agora falha com um erro.

+ Melhorias na sincronização DDL do banco de dados. O trabalho realizado para o NDB 8.0 garante que a sincronização dos bancos de dados por nós SQL recém-adicionados (ou reintegrados) com os de nós SQL existentes agora faça uso adequado do dicionário de dados, de modo que quaisquer operações de nível de banco (`CREATE DATABASE`, `ALTER DATABASE` ou `DROP DATABASE`) que possam ter sido ignoradas por este nó SQL sejam agora duplicadas corretamente quando ele se conecta (ou reconecta) ao clúster.

Como parte do procedimento de sincronização do esquema realizado ao iniciar, um nó SQL agora compara todos os bancos de dados nos nós de dados do clúster com os de seu próprio dicionário de dados, e se qualquer um desses for encontrado como ausente do dicionário de dados do nó SQL, o Nível SQL o instala localmente, executando uma declaração `CREATE DATABASE`. Um banco de dados assim criado usa as propriedades padrão do banco de dados do Servidor MySQL (como as determinadas por `character_set_database` e `collation_database`) que estão em vigor neste nó SQL no momento em que a declaração é executada.

+ **Detecção e sincronização de metadados do NDB.** O NDB 8.0 implementa um novo mecanismo para detecção de atualizações de metadados para objetos de dados, como tabelas, espaços de tabela e grupos de arquivos de registro, com o dicionário de dados MySQL. Isso é feito usando um fio, o fio de monitoramento de mudanças de metadados `NDB`, que funciona em segundo plano e verifica periodicamente por inconsistências entre o dicionário `NDB` e o dicionário de dados MySQL.

O monitor realiza verificações de metadados a cada 60 segundos por padrão. O intervalo de verificação pode ser ajustado definindo o valor da variável de sistema `ndb_metadata_check_interval`; a verificação pode ser desativada completamente definindo a variável de sistema `ndb_metadata_check` para `OFF`. A variável de status `Ndb_metadata_detected_count` mostra o número de vezes desde que o **mysqld** foi iniciado pela última vez que inconsistências foram detectadas.

`NDB` garante que os objetos do banco de dados `NDB`, tabela, grupo de arquivos de registro e tablespace enviados pelo monitor de alteração de metadados durante as operações após a inicialização sejam verificados automaticamente para possíveis desvios e sincronizados pelo thread `NDB` binlog.

O NDB 8.0 adiciona duas variáveis de status relacionadas à sincronização automática: `Ndb_metadata_synced_count` mostra o número de objetos sincronizados automaticamente; `Ndb_metadata_excluded_count` indica o número de objetos para os quais a sincronização falhou (anterior ao NDB 8.0.22, essa variável era chamada `Ndb_metadata_blacklist_size`). Além disso, você pode ver quais objetos foram sincronizados, inspecionando o log do cluster.

Definir a variável de sistema `ndb_metadata_sync` para `true` substitui quaisquer configurações que tenham sido feitas para `ndb_metadata_check_interval` e `ndb_metadata_check`, fazendo com que o thread de monitoramento de mudanças contínuas comece a detectar mudanças de metadados.

Em NDB 8.0.22 e versões posteriores, definir `ndb_metadata_sync` para `true` limpa a lista de objetos para os quais a sincronização falhou anteriormente, o que significa que não é mais necessário descobrir tabelas individuais ou reativar a sincronização reconectando o nó SQL ao clúster. Além disso, definir essa variável para `false` limpa a lista de objetos que estão esperando para serem reexecutados.

A partir do NDB 8.0.21, informações mais detalhadas sobre o estado atual da sincronização automática, que podem ser obtidas a partir de mensagens de log ou variáveis de status, são fornecidas por duas novas tabelas adicionadas ao Schema de Desempenho do MySQL. As tabelas estão listadas aqui:

- `ndb_sync_pending_objects`: Contém informações sobre objetos do banco de dados para os quais foram detectados desvios entre o dicionário `NDB` e o dicionário de dados MySQL (e que não foram excluídos da sincronização automática).

- `ndb_sync_excluded_objects`: Contém informações sobre os objetos do banco de dados `NDB` que foram excluídos porque não podem ser sincronizados entre o dicionário `NDB` e o dicionário de dados MySQL, e, portanto, requerem intervenção manual.

Uma linha em uma dessas tabelas fornece o esquema, o nome e o tipo do objeto do banco de dados. Os tipos de objetos incluem esquemas, espaços de armazenamento, grupos de arquivos de registro e tabelas. (Se o objeto for um grupo de arquivos de registro ou espaço de armazenamento, o esquema pai é `NULL`. Além disso, a tabela `ndb_sync_excluded_objects` mostra a razão pela qual o objeto foi excluído.

Essas tabelas estão presentes apenas se o suporte ao mecanismo de armazenamento `NDBCLUSTER` estiver habilitado. Para mais informações sobre essas tabelas, consulte a Seção 29.12.12, “Tabelas do Schema de Desempenho NDB Cluster”.

+ **Alterações no metadados extras da tabela NDB.** A propriedade de metadados extras de uma tabela `NDB` é usada para armazenar metadados serializados do dicionário de dados MySQL, em vez de armazenar a representação binária da tabela, como nas versões anteriores. (Este era um arquivo `.frm`, que não é mais usado pelo MySQL Server — consulte o Capítulo 16, *Dicionário de Dados MySQL.*) Como parte do trabalho para suportar essa mudança, o tamanho disponível dos metadados extras da tabela foi aumentado. Isso significa que as tabelas `NDB` criadas no NDB Cluster 8.0 não são compatíveis com as versões anteriores do NDB Cluster. As tabelas criadas em versões anteriores podem ser usadas com o NDB 8.0, mas não podem ser abertas posteriormente por uma versão anterior.

Esse metadados são acessíveis usando os métodos da API NDB `getExtraMetadata()` e `setExtraMetadata()`.

Para mais informações, consulte a Seção 25.3.7, “Atualização e Downgrading do NDB Cluster”.

+ **Atualizações em tempo real de tabelas usando arquivos .frm.** Uma tabela criada no NDB 7.6 e versões anteriores contém metadados na forma de um arquivo compactado `.frm`, que não é mais suportado no MySQL 8.0. Para facilitar atualizações online para o NDB 8.0, o `NDB` realiza uma tradução em tempo real desses metadados e os escreve no dicionário de dados do MySQL Server, o que permite que o **mysqld** no NDB Cluster 8.0 trabalhe com a tabela sem impedir o uso subsequente da tabela por uma versão anterior do software `NDB`.

Importante

Uma vez que a estrutura de uma tabela tenha sido modificada no NDB 8.0, seus metadados são armazenados usando o dicionário de dados, e não podem mais ser acessados pelo NDB 7.6 e versões anteriores.

Essa melhoria também permite restaurar um backup `NDB` feito usando uma versão anterior em um clúster que está executando o NDB 8.0 (ou posterior).

+ **Registro de erros de verificação de consistência de metadados.** Como parte do trabalho realizado anteriormente no NDB 8.0, a verificação de metadados realizada como parte da auto-sincronização entre a representação de uma tabela `NDB` no dicionário NDB e sua contraparte no dicionário de dados MySQL inclui o nome da tabela, o mecanismo de armazenamento e o ID interno. A partir do NDB 8.0.23, a faixa de propriedades verificadas é expandida para incluir propriedades dos seguintes objetos de dados:

- Colunas
- Índices
- Chaves estrangeiras

Além disso, os detalhes de quaisquer desalinhamentos nas propriedades de metadados são agora escritos no log de erro do servidor MySQL. Os formatos usados para as mensagens do log de erro diferem ligeiramente dependendo se a discrepância é encontrada no nível da tabela ou no nível de uma coluna, índice ou chave estrangeira. O formato para um erro de log resultante de um desalinhamento de propriedade em nível de tabela é mostrado aqui, onde *`property`* é o nome da propriedade, *`ndb_value`* é o valor da propriedade conforme armazenado no dicionário NDB, e *`mysqld_value`* é o valor da propriedade conforme armazenado no dicionário de dados MySQL:

    ```
    Diff in 'property' detected, 'ndb_value' != 'mysqld_value'
    ```

Para desalinhamentos nas propriedades de colunas, índices e chaves estrangeiras, o formato é o seguinte, onde *`obj_type`* é um dos *`column`*, *`index`* ou *`foreign key`*, e *`obj_name`* é o nome do objeto:

    ```
    Diff in obj_type 'obj_name.property' detected, 'ndb_value' != 'mysqld_value'
    ```

Os verificações de metadados são realizadas durante a sincronização automática das tabelas `NDB` quando elas são instaladas no dicionário de dados de qualquer **mysqld** que esteja atuando como um nó SQL em um NDB Cluster. Se o **mysqld** for compilado com depuração, as verificações também são feitas sempre que uma declaração `CREATE TABLE` é executada e sempre que uma tabela `NDB` é aberta.

* **Sincronização de privilégios do usuário com NDB_STORED_USER.** Um novo mecanismo para compartilhar e sincronizar usuários, papéis e privilégios entre nós SQL está disponível no NDB 8.0, usando o privilégio `NDB_STORED_USER`. Privilegios distribuídos, como implementados no NDB 7.6 e versões anteriores (veja Privilegios distribuídos usando tabelas de concessão compartilhadas), não são mais suportados.

Uma vez que uma conta de usuário é criada em um nó SQL, o usuário e seus privilégios podem ser armazenados em `NDB` e, assim, compartilhados entre todos os nós SQL no clúster, emitindo uma declaração `GRANT` como esta:

  ```
  GRANT NDB_STORED_USER ON *.* TO 'jon'@'localhost';
  ```

`NDB_STORED_USER` sempre tem escopo global e deve ser concedido usando `ON *.*`. Contas reservadas do sistema, como `mysql.session@localhost` ou `mysql.infoschema@localhost`, não podem receber este privilégio.

Os papéis também podem ser compartilhados entre os nós do SQL ao emitir a declaração apropriada `GRANT NDB_STORED_USER`. Atribuir tal papel a um usuário não faz com que o usuário seja compartilhado; o privilégio `NDB_STORED_USER` deve ser concedido explicitamente a cada usuário.

Um usuário ou papel com `NDB_STORED_USER`, juntamente com seus privilégios, é compartilhado com todos os nós SQL assim que eles se juntam a um NDB Cluster específico. É possível fazer tais alterações a partir de qualquer nó SQL conectado, mas a prática recomendada é fazer isso apenas a partir de um nó SQL designado, uma vez que a ordem de execução das declarações que afetam os privilégios de diferentes nós SQL não pode ser garantida como sendo a mesma em todos os nós SQL.

Antes da NDB 8.0.27, as alterações dos privilégios de um usuário ou papel eram sincronizadas imediatamente com todos os nós SQL conectados. A partir do MySQL 8.0.27, um nó SQL assume um bloqueio de leitura global ao atualizar os privilégios, o que impede que mudanças concorrentes executadas por vários nós SQL causem um impasse.

**Implicações para atualizações.** Devido às mudanças no sistema de privilégios do servidor MySQL (consulte a Seção 8.2.3, “Tabelas de Concessão”), as tabelas de privilégios que utilizam o mecanismo de armazenamento `NDB` não funcionam corretamente no NDB 8.0. É seguro, mas não necessário, manter tais tabelas de privilégios criadas no NDB 7.6 ou versões anteriores, mas elas não são mais usadas para controle de acesso. No NDB 8.0, um **mysqld** atuando como um nó SQL e detectando tais tabelas em `NDB` escreve um aviso no log do servidor MySQL e cria tabelas de sombra `InnoDB` locais para si mesmo; tais tabelas de sombra são criadas em cada servidor MySQL conectado ao clúster. Ao realizar uma atualização a partir do NDB 7.6 ou versões anteriores, as tabelas de privilégios que utilizam `NDB` podem ser removidas com segurança usando **ndb_drop_table** uma vez que todos os servidores MySQL atuando como nós SQL tenham sido atualizados (consulte a Seção 25.3.7, “Atualizando e Desatualizando o NDB Cluster”).

A opção `--restore-privilege-tables` do utilitário **ndb_restore** é desatualizada, mas continua sendo respeitada no NDB 8.0 e ainda pode ser usada para restaurar tabelas de privilégio distribuídas presentes em um backup feito a partir de uma versão anterior do NDB Cluster para um cluster que executa NDB 8.0. Essas tabelas são tratadas conforme descrito no parágrafo anterior.

Os usuários compartilhados e as concessões são armazenados na tabela `ndb_sql_metadata`, que o **ndb_restore** não restaura por padrão no NDB 8.0; você pode especificar a opção `--include-stored-grants` para fazer isso.

Veja a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”, para mais informações.

* **INFORMATION_SCHEMA muda.** As seguintes alterações são feitas na exibição de informações sobre arquivos de dados de disco na tabela do esquema de informação `FILES`:

+ Os espaços de tabela e os grupos de arquivos de registro não são mais representados na tabela `FILES`. (Esses construtos não são, na verdade, arquivos.)

+ Cada arquivo de dados é representado agora por uma única linha na tabela `FILES`. Cada arquivo de registro de desfazer também é representado agora nesta tabela por apenas uma única linha. (Anteriormente, uma linha era exibida para cada cópia de cada um desses arquivos em cada nó de dados.)

Além disso, as tabelas `INFORMATION_SCHEMA` agora são preenchidas com estatísticas do espaço de tabela para tabelas do MySQL Cluster. (Bug #27167728)

* **Informações de erro com ndb_perror.** A opção descontinuada `--ndb` para **perror** foi removida. Em vez disso, use **ndb_perror** para obter informações de mensagem de erro a partir dos códigos de erro `NDB`. (Bug #81704, Bug #81705, Bug #23523926, Bug #23523957)

* Melhorias no empurrão de condições. Anteriormente, o empurrão de condições era limitado a termos predicativos que se referissem a valores de coluna da mesma tabela para a qual a condição estava sendo empurrada. No NDB 8.0, essa restrição é removida, de modo que os valores de coluna de tabelas mais cedo no plano de consulta também podem ser referenciados a partir de condições empurradas. O NDB 8.0 suporta junções que comparam expressões de coluna, bem como comparações entre colunas na mesma tabela. As colunas e expressões de coluna a serem comparadas devem ser exatamente do mesmo tipo; isso significa que também devem ser da mesma sinalização, comprimento, conjunto de caracteres, precisão e escala, sempre que esses atributos se aplicarem. As condições que estão sendo empurradas não podiam fazer parte de junções empurradas antes do NDB 8.0.27, quando essa restrição é levantada.

Deslocando partes maiores de uma condição, é possível filtrar mais linhas pelos nós de dados, reduzindo assim o número de linhas que o **mysqld** deve lidar durante o processamento de junção. Outro benefício dessas melhorias é que o filtro pode ser realizado em paralelo nos threads do LDM, em vez de em um único processo do mysqld em um nó SQL; isso tem o potencial de melhorar significativamente o desempenho da consulta.

As regras existentes para a compatibilidade de tipo entre os valores das colunas que estão sendo comparados continuam a ser aplicadas (consulte a Seção 10.2.1.5, “Otimização de empurrão de condição do motor”).

**Desvio de junções externas e semijoins.** O trabalho realizado no NDB 8.0.20 permite que muitas junções externas e semijoins, e não apenas aquelas que utilizam uma chave primária ou pesquisa de chave única, sejam deslocadas para os nós de dados (ver Seção 10.2.1.5, “Otimização do Desvio do Condicionamento do Motor”).

As junções externas que podem ser impulsionadas por varreduras incluem aquelas que atendem às seguintes condições:

+ Não há condições não pressionadas na tabela
+ Não há condições não pressionadas em outras tabelas no mesmo nível de junção, ou em níveis de junção superiores nos quais ela depende

+ Todas as outras tabelas no mesmo conjunto de junção ou em conjuntos de junção superiores nos quais ela depende também são empurradas

Uma semijoia que utiliza uma varredura de índice pode agora ser empurrada se atender às condições mencionadas acima para uma junção externa empurrada, e utiliza a estratégia `firstMatch` (consulte [Seção 10.2.2.1, “Otimizando predicados de subconsultas IN e EXISTS com transformações de semijoia”](semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")).

Essas melhorias adicionais são feitas no NDB 8.0.21:

Os anticonjuntos produzidos pelo MySQL Optimizer através da transformação das consultas `NOT EXISTS` e `NOT IN` (ver [Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Semijoin”][(semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")]) podem ser empurrados para os nós de dados pelo `NDB`.

Isso pode ser feito quando não há uma condição não empurrada na tabela e a consulta atende a quaisquer outras condições que devem ser atendidas para que uma junção externa seja empurrada para baixo.

+ `NDB` tenta identificar e avaliar uma subconsulta escalar não dependente antes de tentar recuperar quaisquer linhas da tabela à qual ela está anexada. Quando puder fazê-lo, o valor obtido é usado como parte de uma condição empurrada, em vez de usar a subconsulta que forneceu o valor.

A partir do NDB 8.0.27, as condições pressionadas como parte de uma consulta empurrada agora podem se referir a colunas de tabelas ancestrais dentro da mesma consulta empurrada, desde que atendidas as seguintes condições:

As condições pressionadas podem incluir qualquer um dos operadores de comparação `<`, `<=`, `>`, `>=`, `=` e `<>`.

+ Os valores que estão sendo comparados devem ser do mesmo tipo, incluindo comprimento, precisão e escala.

+ O tratamento do `NULL` é realizado de acordo com a semântica de comparação especificada pelo padrão ISO SQL; qualquer comparação com `NULL` retorna `NULL`.

Considere a tabela criada usando a declaração mostrada aqui:

  ```
  CREATE TABLE t (
      x INT PRIMARY KEY,
      y INT
  ) ENGINE=NDB;
  ```

Uma consulta como [`SELECT

* DE t AS m JUNTO t AS n SOBRE m.x >= n.y`](select.html "15.2.13 SELECT Statement") can now use the engine condition pushdown optimization to push down the condition column `y`.

Quando uma associação não pode ser realizada, `EXPLAIN` deve fornecer o motivo ou motivos.

Consulte a Seção 10.2.1.5, “Otimização de empurrar o estado do motor”, para obter mais informações.

Os métodos da API NDB `branch_col_eq_param()`, `branch_col_ne_param()`, `branch_col_lt_param()`, `branch_col_le_param()`, `branch_col_gt_param()` e `branch_col_ge_param()` foram adicionados no NDB 8.0.27 como parte desse trabalho. Esses `NdbInterpretedCode` podem ser usados para comparar os valores das colunas com os valores dos parâmetros.

Além disso, `NdbScanFilter::cmp_param()`, também adicionado no NDB 8.0.27, permite definir comparações entre os valores das colunas e os valores dos parâmetros para uso na realização de varreduras.

* **Aumento do tamanho máximo da linha.** O NDB 8.0 aumenta o número máximo de bytes que podem ser armazenados em uma tabela `NDBCLUSTER` de 14.000 para 30.000 bytes.

Uma coluna `BLOB` ou `TEXT` continua a usar 264 bytes desse total, como antes.

O deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; isso também não mudou em relação às versões anteriores.

Consulte a Seção 25.2.7.5, “Limites associados a objetos de banco de dados no NDB Cluster”, para obter mais informações.

* **Comando ndb_mgm SHOW e modo de único usuário.** No NDB 8.0, quando o clúster está em modo de único usuário, a saída do comando do cliente de gerenciamento `SHOW` indica qual API ou nó SQL tem acesso exclusivo enquanto esse modo estiver em vigor.

* **Nome de coluna online é renomeado.** Colunas das tabelas `NDB` podem agora ser renomeadas online, usando `ALGORITHM=INPLACE`. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para mais informações.

* **Tempo de inicialização do ndb_mgmd melhorado.** Os tempos de inicialização dos nós de gerenciamento do daemon foram significativamente melhorados no NDB 8.0, da seguinte forma:

+ Devido à substituição da estrutura de dados da lista anteriormente utilizada por `ndb_mgmd` para o tratamento das propriedades dos nós a partir dos dados de configuração por uma tabela hash, os tempos de inicialização gerais do servidor de gestão foram reduzidos em um fator de 6 ou mais.

Além disso, nos casos em que os nomes de host dos nós de dados e SQL não estão presentes no arquivo `hosts` do servidor de gerenciamento, os horários de início do **ndb_mgmd** podem ser até 20 vezes mais curtos do que o que era anteriormente o caso.

* **Melhorias na API do NDB.** `NdbScanFilter::cmp()` e vários métodos de comparação do `NdbInterpretedCode` podem agora ser usados para comparar os valores das colunas da tabela entre si. Os métodos `NdbInterpretedCode` afetados estão listados aqui:

+ `branch_col_eq()`
+ `branch_col_ge()`
+ `branch_col_gt()`
+ `branch_col_le()`
+ `branch_col_lt()`
+ `branch_col_ne()`

Para todos os métodos listados acima, os valores das colunas da tabela que devem ser comparados devem ser exatamente do mesmo tipo, incluindo, conforme aplicável, em relação ao comprimento, precisão, sinalização, escala, conjunto de caracteres e ordenação.

Veja as descrições dos métodos individuais da API para obter mais informações.

* **Construções de índice multithread offline.** Agora é possível especificar um conjunto de núcleos a serem utilizados para os threads de E/S que realizam construções de índices ordenados multithread offline, em oposição a tarefas normais de E/S, como E/S de arquivos, compressão ou descompactação. “Offline” neste contexto refere-se à construção de índices ordenados realizada quando a tabela principal não está sendo escrita; tal construção ocorre quando um cluster `NDB` realiza um reinício de nó ou sistema, ou como parte da restauração de um cluster a partir de um backup usando **ndb_restore** `--rebuild-indexes`.

Além disso, o comportamento padrão para o trabalho de construção de índice offline é modificado para usar todas as cores disponíveis para **ndbmtd**"), em vez de se limitar ao núcleo reservado para o fio de E/S. Isso pode melhorar os tempos de reinício e restauração, bem como o desempenho, a disponibilidade e a experiência do usuário.

Essa melhoria é implementada da seguinte forma:

1. O valor padrão para `BuildIndexThreads` é alterado de 0 para 128. Isso significa que as construções de índice solicitadas offline são agora multithreadadas por padrão.

O valor padrão para `TwoPassInitialNodeRestartCopy` é alterado de `false` para `true`. Isso significa que um reinício inicial do nó primeiro copia todos os dados de um nó "ativo" para um que está começando—sem criar nenhum índice—constrói índices ordenados offline e, em seguida, sincroniza novamente seus dados com o nó ativo, ou seja, sincroniza duas vezes e constrói índices offline entre as duas sincronizações. Isso faz com que um reinício inicial do nó se comporte mais como o reinício normal de um nó e reduza o tempo necessário para construir índices.

3. Um novo tipo de fio (`idxbld`) é definido para o parâmetro de configuração `ThreadConfig`, para permitir o bloqueio de threads de construção de índice offline para CPUs específicas.

Além disso, `NDB` agora distingue os tipos de fio que são acessíveis a `ThreadConfig` por esses dois critérios:

1. Se o fio é um fio de execução. Os tipos de fios `main`, `ldm`, `recv`, `rep`, `tc` e `send` são fios de execução; os tipos de fios `io`, `watchdog` e `idxbld` não são.

2. Se a alocação do fio para uma tarefa dada é permanente ou temporária. Atualmente, todos os tipos de fio, exceto `idxbld`, são permanentes.

Para informações adicionais, consulte as descrições dos parâmetros indicados no Manual. (Bug #25835748, Bug #26928111)

* **Informações sobre o processo de backup da tabela logbuffers.** Ao realizar um backup do NDB, a tabela `ndbinfo.logbuffers` agora exibe informações sobre o uso do buffer pelo processo de backup em cada nó de dados. Isso é implementado como linhas que refletem dois novos tipos de log, além de `REDO` e `DD-UNDO`. Uma dessas linhas tem o tipo de log `BACKUP-DATA`, que mostra a quantidade de buffer de dados usado durante o backup para copiar fragmentos para arquivos de backup. A outra linha tem o tipo de log `BACKUP-LOG`, que exibe a quantidade de buffer de log usado durante o backup para registrar as alterações feitas após o início do backup. Uma de cada uma dessas linhas `log_type` é mostrada na tabela `logbuffers` para cada nó de dados no clúster. Linhas que possuem esses dois tipos de log estão presentes na tabela apenas enquanto um backup do NDB está em andamento. (Bug #25822988)

* **tabela ndbinfo.processes no Windows.** O ID de processo do processo de monitor utilizado nas plataformas do Windows pelo `RESTART` para gerar e reiniciar um **mysqld** agora é mostrado na tabela `processes` como um `angel_pid`.

* **Melhorias no hashing de strings.** Antes do NDB 8.0, todo o hashing de strings era baseado na transformação inicial da string em uma forma normalizada, e em seguida, em hashing MD5 da imagem binária resultante. Isso poderia gerar alguns problemas de desempenho, pelas seguintes razões:

+ A string normalizada é sempre preenchida com espaços até atingir seu comprimento total. Para um `VARCHAR`, isso muitas vezes exigiu adicionar mais espaços do que havia caracteres na string original.

+ As bibliotecas de strings não foram otimizadas para esse alinhamento de espaço, o que adicionou um custo considerável em alguns casos de uso.

+ A semântica de preenchimento variou entre os conjuntos de caracteres, alguns dos quais não foram preenchidos até o seu comprimento total.

+ A string transformada pode se tornar bastante grande, mesmo sem preenchimento de espaço; algumas codificações Unicode 9.0 podem transformar um único ponto de código em 100 bytes ou mais de dados de caracteres.

+ O hashing MD5 subsequente consistia principalmente em preenchimento com espaços e não era particularmente eficiente, podendo causar penalidades adicionais de desempenho ao limpar partes significativas da cache L1.

Uma agregação fornece sua própria função de hash, que faz o hashing da string diretamente, sem primeiro criar uma string normalizada. Além disso, para uma agregação Unicode 9.0, o hash é calculado sem preenchimento. `NDB` agora aproveita essa função embutida sempre que está fazendo o hashing de uma string identificada como usando uma agregação Unicode 9.0.

Como, para outras colatões, existem bancos de dados existentes que são particionados por hash na string transformada, o `NDB` continua a empregar o método anterior para hashing de strings que utilizam essas colatões, para manter a compatibilidade. (Bug #89590, Bug #89604, Bug #89609, Bug #27515000, Bug #27523758, Bug #27522732)

* Alterações nas mudanças do MASTER RESET. Como o MySQL Server agora executa `RESET MASTER` com um bloqueio de leitura global, o comportamento desta declaração quando usada com o NDB Cluster mudou nos seguintes dois aspectos:

+ Não é mais garantido que seja síncrono; ou seja, agora é possível que uma leitura que vem imediatamente antes de `RESET MASTER` não seja registrada até depois que o log binário tenha sido rotado.

+ Agora, ele se comporta exatamente da mesma maneira, independentemente de a declaração ser emitida no mesmo nó SQL que está escrevendo o log binário ou em um nó SQL diferente no mesmo clúster.

Nota

`SHOW BINLOG EVENTS`, `FLUSH LOGS`, e a maioria das declarações de definição de dados continuam, como fizeram nas versões anteriores do `NDB`, a operar de forma síncrona.

* Uso da opção **ndb_restore**. As opções `--nodeid` e `--backupid` são agora obrigatórias ao invocar **ndb_restore**.

* **ndb_log_bin padrão.** O NDB 8.0 altera o valor padrão da variável de sistema `ndb_log_bin` de `TRUE` para `FALSE`.

* **Alocação dinâmica de recursos transacionais.** A alocação de recursos no coordenador de transação é realizada agora usando pools de memória dinâmica. Isso significa que a alocação de recursos determinada por parâmetros de configuração do nó de dados, como `MaxDMLOperationsPerTransaction`, `MaxNoOfConcurrentIndexOperations`, `MaxNoOfConcurrentOperations`, `MaxNoOfConcurrentScans`, `MaxNoOfConcurrentTransactions`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans` e `TransactionBufferMemory` é realizada de tal forma que, se a carga representada por cada um desses parâmetros estiver dentro da carga alvo para todos esses recursos, outros desses recursos podem ser limitados para não exceder os recursos totais disponíveis.

Como parte desse trabalho, vários novos parâmetros de nó de dados que controlam os recursos transacionais em `DBTC`, listados aqui, foram adicionados:

+ `ReservedConcurrentIndexOperations`
  + `ReservedConcurrentOperations`
  + `ReservedConcurrentScans`
  + `ReservedConcurrentTransactions`
  + `ReservedFiredTriggers`
  + `ReservedLocalScans`
  + `ReservedTransactionBufferMemory`.

Veja as descrições dos parâmetros listados acima para mais informações.

* **Backup usando múltiplos LDMs por nó de dados.** Os backups `NDB` podem agora ser realizados de forma paralela em nós de dados individuais usando múltiplos gestores de dados locais (LDMs). (Anteriormente, os backups eram realizados em paralelo em nós de dados, mas sempre eram seriados dentro dos processos dos nós de dados.) Não é necessária sintaxe especial para o comando `START BACKUP` no cliente **ndb_mgm** para habilitar essa funcionalidade, mas todos os nós de dados devem estar usando múltiplos LDMs. Isso significa que os nós de dados devem estar rodando **ndbmtd**") (**ndbd** é monofilamento e, portanto, sempre tem apenas um LDM) e devem ser configurados para usar múltiplos LDMs antes de fazer o backup; você pode fazer isso escolhendo um ajuste apropriado para um dos parâmetros de configuração de nó de dados multifilamento `MaxNoOfExecutionThreads` ou `ThreadConfig`.

Os backups que utilizam múltiplos LDMs criam subdiretórios, um por LDM, sob o diretório `BACKUP/BACKUP-backup_id/`. O **ndb_restore** agora detecta esses subdiretórios automaticamente e, se existirem, tenta restaurar o backup em paralelo; consulte a Seção 25.5.23.3, “Restauração a partir de um backup realizado em paralelo”, para obter detalhes. (Os backups de único fio são restaurados como nas versões anteriores do `NDB`.) Também é possível restaurar backups realizados em paralelo usando um binário **ndb_restore** de uma versão anterior do NDB Cluster, modificando o procedimento de restauração usual; a Seção 25.5.23.3.2, “Restauração de um backup paralelo em série”, fornece informações sobre como fazer isso.

Você pode forçar a criação de backups monofilados definindo o parâmetro do nó de dados `EnableMultithreadedBackup` para 0 em todos os nós de dados na seção `[ndbd default]` do arquivo de configuração global do clúster (`config.ini`).

* **Melhorias no arquivo de configuração binário.** O NDB 8.0 utiliza um novo formato para o arquivo de configuração binário do servidor de gerenciamento. Anteriormente, um máximo de 16.381 seções poderia aparecer no arquivo de configuração do clúster; agora, o número máximo de seções é de 4G. Isso visa suportar um número maior de nós em um clúster do que era possível antes desta mudança.

As atualizações para o novo formato são relativamente sem problemas e raramente, ou nunca, exigem intervenção manual, pois o servidor de gerenciamento continua sendo capaz de ler o formato antigo sem problemas. Uma desvantagem do NDB 8.0 para uma versão mais antiga do software do NDB Cluster requer a remoção manual de quaisquer arquivos de configuração binários ou, como alternativa, iniciar o binário do servidor de gerenciamento mais antigo com a opção `--initial`.

Para mais informações, consulte a Seção 25.3.7, “Atualização e Downgrading do NDB Cluster”.

* **Número aumentado de nós de dados.** O NDB 8.0 aumenta o número máximo de nós de dados suportados por clúster para 144 (anteriormente, isso era 48). Os nós de dados agora podem usar IDs de nó na faixa de 1 a 144, inclusive.

Anteriormente, os IDs de nó recomendados para os nós de gerenciamento eram 49 e 50. Esses ainda são suportados para nós de gerenciamento, mas usá-los como tal limita o número máximo de nós de dados a 142; por essa razão, agora é recomendado que os IDs de nó 145 e 146 sejam usados para nós de gerenciamento.

Como parte desse trabalho, o formato usado para o nó de dados `sysfile` foi atualizado para a versão 2. Este arquivo registra informações como o último índice de ponto de verificação global, o status de reinício e a filiação ao grupo de nós de cada nó (consulte o Diretório do Sistema de Arquivo de Nó de Dados do NDB Cluster).

* Alterações no **RedoOverCommitCounter e RedoOverCommitLimit.** Devido a ambiguidades na semântica para defini-los como 0, o valor mínimo para cada um dos parâmetros de configuração do nó de dados `RedoOverCommitCounter` e `RedoOverCommitLimit` foi aumentado para 1.

* **mudanças no ndb_autoincrement_prefetch_sz.** O valor padrão da variável de sistema do servidor `ndb_autoincrement_prefetch_sz` é aumentado para 512.

* **Alterações nos máximos e valores padrão dos parâmetros.** O NDB 8.0 faz as seguintes alterações nos valores máximos e padrão dos parâmetros de configuração:

+ O máximo para `DataMemory` é aumentado para 16 terabytes.

+ O máximo para `DiskPageBufferMemory` também é aumentado para 16 terabytes.

+ O valor padrão para `StringMemory` é aumentado para 25%.

+ O padrão para `LcpScanProgressTimeout` é aumentado para 180 segundos.

* **Melhorias no controle de dados de disco.** O NDB Cluster 8.0 oferece várias novas melhorias que ajudam a reduzir a latência dos pontos de verificação de tabelas de dados de disco e espaços de tabela ao usar dispositivos de memória não volátil, como unidades de estado sólido e a especificação NVMe para esses dispositivos. Essas melhorias incluem as seguintes:

+ Evitar explosões de escritas de disco de ponto de verificação  
+ Acelerar os pontos de verificação para tabelas de espaço de dados de disco quando o log de refazer ou o log de desfazer ficam cheios

+ Equilibrar pontos de verificação de disco e pontos de verificação de memória contra outros, quando necessário

+ Proteger dispositivos de disco contra sobrecarga para ajudar a garantir baixa latência em cargas elevadas

Como parte desse trabalho, dois parâmetros de configuração de nó de dados foram adicionados. `MaxDiskDataLatency` estabelece um limite para o grau de latência permitido para o acesso ao disco e faz com que as transações que demoram mais que esse período sejam abortadas. `DiskDataUsingSameDisk` permite aproveitar o uso de tabelaspaces de dados de disco em discos separados, aumentando a taxa na qual os pontos de verificação desses tabelaspaces podem ser realizados.

Além disso, três novas tabelas no banco de dados `ndbinfo` fornecem informações sobre o desempenho dos dados do disco:

+ A tabela `diskstat` relata os registros nos espaços de dados de tabela de Dados de disco nos últimos segundos

+ A tabela `diskstats_1sec` relata os registros nos espaços de dados de tabela de Disco de Dados para cada um dos últimos 20 segundos

+ A tabela `pgman_time_track_stats` relata a latência das operações de disco relacionadas aos espaços de dados de disco

* **Alocação de memória e TransactionMemory.** Um novo parâmetro `TransactionMemory` simplifica a alocação de memória de nó de dados para transações, como parte do trabalho realizado para agrupar memória de gerenciador de dados locais (LDM) e de memória transacional. Este parâmetro destina-se a substituir vários parâmetros de memória de memória transacional mais antigos que foram descontinuados.

A memória de transação agora pode ser definida de qualquer uma das três formas listadas aqui:

+ Vários parâmetros de configuração são incompatíveis com `TransactionMemory`. Se algum desses for definido, `TransactionMemory` não pode ser definido (consulte Parâmetros incompatíveis com TransactionMemory), e a memória de transação do nó de dados é determinada como era anteriormente ao NDB 8.0.

Nota

Tentar definir `TransactionMemory` e qualquer um desses parâmetros simultaneamente no arquivo `config.ini` impede o início do servidor de gerenciamento.

+ Se `TransactionMemory` estiver definido, este valor é usado para determinar a memória de transação. `TransactionMemory` não pode ser definido se algum dos parâmetros incompatíveis mencionados no item anterior também tiver sido definido.

+ Se nenhum dos parâmetros incompatíveis estiverem definidos e `TransactionMemory` também não estiver definido, a memória de transação é definida por `NDB`.

Para mais informações, consulte a descrição de `TransactionMemory`, bem como a Seção 25.4.3.13, “Gestão de Memória do Nó de Dados”.

* **Suporte para réplicas de fragmentos adicionais.** O NDB 8.0 aumenta o número máximo de réplicas de fragmentos suportadas em produção de dois para quatro. (Anteriormente, era possível definir `NoOfReplicas` para 3 ou 4, mas isso não era oficialmente suportado ou verificado em testes.)

* **Restauração por fatias.** A partir do NDB 8.0.20, é possível dividir um backup em porções aproximadamente iguais (fatias) e restaurar essas fatias em paralelo usando duas novas opções implementadas para **ndb_restore**:

+ `--num-slices` determina o número de fatias em que o backup deve ser dividido.

+ `--slice-id` fornece o ID do corte que será restaurado pela instância atual de **ndb_restore**.

Isso permite que você utilize múltiplas instâncias de **ndb_restore** para restaurar subconjuntos do backup em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

Para mais informações, consulte a descrição da opção **ndb_restore** `--num-slices`.

* **Leia a partir de qualquer replica de fragmento habilitada.** Leia a partir de qualquer replica de fragmento é habilitado por padrão para todas as tabelas `NDB`. Isso significa que o valor padrão da variável do sistema `ndb_read_backup` agora é ON, e que o valor da opção de comentário `NDB_TABLE` `READ_BACKUP` é 1 ao criar uma nova tabela `NDB`. Habilitar a leitura a partir de qualquer replica de fragmento melhora significativamente o desempenho para leituras a partir de tabelas `NDB`, com impacto mínimo em escritas.

Para mais informações, consulte a descrição da variável de sistema `ndb_read_backup`, e a Seção 15.1.20.12, “Definindo as opções de comentário NDB”.

* **Melhorias na ferramenta ndb_blob_tool.** A partir do NDB 8.0.20, a ferramenta **ndb_blob_tool** pode detectar partes de blob ausentes para as quais existem partes em linha e substituí-las com partes de blob de espaço (compostas por caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes com marcadores, use a opção `--add-missing`.

Para mais informações, consulte [Seção 25.5.6, “ndb_blob_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”][(mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables")].

* **Versão do ndbinfo.** `NDB` 8.0.20 e versões posteriores suportam a versão para as tabelas `ndbinfo`, e mantém as definições atuais para suas tabelas internamente. Ao inicializar, `NDB` compara sua versão `ndbinfo` suportada com a versão armazenada no dicionário de dados. Se as versões forem diferentes, `NDB` descarta quaisquer tabelas antigas `ndbinfo` e as recria usando as definições atuais.

* **Suporte para Fedora Linux.** A partir do NDB 8.0.20, o Fedora Linux é uma plataforma compatível com as versões da Comunidade do NDB Cluster e pode ser instalado usando os RPMs fornecidos para esse propósito pela Oracle. Esses podem ser obtidos na página de downloads do NDB Cluster [(https://dev.mysql.com/downloads/cluster/)].

* **Programas do NDB—remoção da dependência do NDBT.** A dependência de vários programas de utilitário `NDB` da biblioteca `NDBT` foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nesses programas pode levar a problemas indesejados durante os testes.

Os programas afetados estão listados aqui, juntamente com as versões `NDB` nas quais a dependência foi removida:

+ **ndb_restore**
+ **ndb_delete_all**
+ **ndb_show_tables** (NDB 8.0.20)
+ **ndb_waiter** (NDB 8.0.20)

O principal efeito dessa alteração para os usuários é que esses programas não imprimem `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao atualizar para as versões indicadas.

* **Chaves estrangeiras e maiúsculas.** `NDB` armazena os nomes das chaves estrangeiras usando a maiúscula com a qual foram definidas. Anteriormente, quando o valor da variável do sistema `lower_case_table_names` era definido como 0, realizava comparações sensíveis ao caso das chaves estrangeiras, conforme usado em `SELECT` e outras declarações SQL, com os nomes armazenados. A partir do NDB 8.0.20, tais comparações são agora sempre realizadas de forma insensível ao caso, independentemente do valor de `lower_case_table_names`.

* **Múltiplos transportadores.** O NDB 8.0.20 introduz suporte para múltiplos transportadores para lidar com a comunicação entre nós, entre pares de nós de dados. Isso facilita taxas mais altas de operações de atualização para cada grupo de nós no clúster e ajuda a evitar restrições impostas pelo sistema ou outras limitações em comunicações entre nós usando um único soquete.

Por padrão, `NDB` agora utiliza um número de transportadores com base no número de threads de gerenciamento de dados locais (LDM) ou no número de threads de coordenador de transação (TC), o que for maior. Por padrão, o número de transportadores é igual a metade desse número. Embora o padrão deve funcionar bem para a maioria das cargas de trabalho, é possível ajustar o número de transportadores empregados por cada grupo de nós, definindo o parâmetro de configuração do nó de dados `NodeGroupTransporters` (também introduzido no NDB 8.0.20), até um máximo do maior número de threads de LDM ou threads de TC. Definindo-o em 0, o número de transportadores é o mesmo que o número de threads de LDM.

* **ndb_restore: mudanças no esquema da chave primária.** O NDB 8.0.21 (e versões posteriores) suporta diferentes definições de chave primária para as tabelas de origem e destino ao restaurar um backup nativo `NDB` com **ndb_restore** quando executado com a opção `--allow-pk-changes`. Ambos os casos de aumento e diminuição do número de colunas que compõem a chave primária original são suportados.

Quando a chave primária é estendida com uma ou mais colunas adicionais, todas as colunas adicionadas devem ser definidas como `NOT NULL`, e nenhum valor em quaisquer dessas colunas pode ser alterado durante o período em que o backup está sendo realizado. Como algumas aplicações definem todos os valores das colunas em uma linha ao atualizá-la, independentemente de todos os valores realmente serem alterados, isso pode causar o falha de uma operação de restauração, mesmo que nenhum valor na coluna que será adicionada à chave primária tenha sido alterado. Você pode sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates` também adicionada no NDB 8.0.21; nesse caso, você deve garantir que nenhum desses valores seja alterado.

Uma coluna pode ser removida da chave primária da tabela, independentemente de essa coluna permanecer ou não como parte da tabela.

Para mais informações, consulte a descrição da opção `--allow-pk-changes` para **ndb_restore**.

* **Mesclagem de backups com ndb_restore.** Em alguns casos, pode ser desejável consolidar os dados originalmente armazenados em diferentes instâncias do NDB Cluster (todos usando o mesmo esquema) em um único NDB Cluster de destino. Isso agora é suportado ao usar backups criados no cliente **ndb_mgm** (consulte Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e restaurá-los com **ndb_restore**, usando a opção `--remap-column` adicionada no NDB 8.0.21, juntamente com `--restore-data` (e possivelmente opções adicionais compatíveis, conforme necessário ou desejado). `--remap-column` pode ser empregado para lidar com casos em que os valores primários e exclusivos de chave estão sobrepostos entre os clusters de origem, e é necessário que eles não se sobreponham no cluster de destino, além de preservar outras relações entre tabelas, como chaves estrangeiras.

`--remap-column` aceita como argumento uma string com o formato `db.tbl.col:fn:args`, onde *`db`*, *`tbl`* e *`col`* são, respectivamente, os nomes do banco de dados, tabela e coluna, *`fn`* é o nome de uma função de mapeo, e *`args`* é um ou mais argumentos para *`fn`*. Não há valor padrão. Apenas *`offset`* é suportado como o nome da função, com *`args`* como o deslocamento inteiro a ser aplicado ao valor da coluna ao inseri-la na tabela de destino a partir do backup. Esta coluna deve ser uma das `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT); o intervalo permitido do valor do deslocamento é o mesmo que a versão assinada desse tipo (isso permite que o deslocamento seja negativo, se desejado).

A nova opção pode ser usada várias vezes na mesma invocação do **ndb_restore**, para que você possa remappear para novos valores várias colunas da mesma tabela, diferentes tabelas ou ambas. O valor de deslocamento não precisa ser o mesmo para todas as instâncias da opção.

Além disso, duas novas opções são fornecidas para **ndb_desc**, também começando no NDB 8.0.21:

+ `--auto-inc` (forma abreviada `-a`): Inclui o próximo valor de autoincremento na saída, se a tabela tiver uma coluna `AUTO_INCREMENT`.

+ `--context` (forma abreviada `-x`): Fornece informações adicionais sobre a tabela, incluindo o esquema, o nome do banco de dados, o nome da tabela e o ID interno.

Para mais informações e exemplos, consulte a descrição da opção `--remap-column`.

* **Envie melhorias no fluxo de envio.** A partir do NDB 8.0.20, cada thread de envio agora lida com envios para um subconjunto de transportadores, e cada thread de bloco agora auxilia apenas uma thread de envio, resultando em mais threads de envio e, assim, melhor desempenho e escalabilidade do nó de dados.

* **Controle adaptativo de rotação usando SpinMethod.** Uma interface simples para configurar rotação adaptativa da CPU em plataformas que a suportam, usando o parâmetro do nó de dados `SpinMethod`. Este parâmetro (adicionado no NDB 8.0.20, funcional a partir do NDB 8.0.24) tem quatro configurações, uma para cada tipo de rotação adaptativa: rotação estática, rotação adaptativa baseada em custo, rotação adaptativa otimizada para latência e rotação adaptativa otimizada para máquinas de banco de dados em que cada thread tem sua própria CPU. Cada uma dessas configurações faz com que o nó de dados use um conjunto de valores predeterminados para um ou mais parâmetros de rotação que permitem a rotação adaptativa, definem o tempo de rotação e definem o overhead de rotação, conforme apropriado para um cenário específico, evitando assim a necessidade de definir esses valores diretamente para casos de uso comuns.

Para ajustar finamente o comportamento do spin, também é possível definir esses e outros parâmetros de spin diretamente, usando o parâmetro de configuração do nó de dados existente `SchedulerSpinTimer` e os seguintes comandos `DUMP` no cliente **ndb_mgm**:

+ `DUMP 104000 (SetSchedulerSpinTimerAll)`(/doc/ndb-internals/en/dump-command-104000.html): Define o tempo de rotação para todos os threads

+ `DUMP 104001 (SetSchedulerSpinTimerThread)`(/doc/ndb-internals/en/dump-command-104001.html): Define o tempo de rotação para um fio especificado

+ `DUMP 104002 (SetAllowedSpinOverhead)`(/doc/ndb-internals/en/dump-command-104002.html): Define o overhead de rotação como o número de unidades de tempo de CPU permitidas para ganhar 1 unidade de latência

+ `DUMP 104003 (SetSpintimePerCall)`(/doc/ndb-internals/en/dump-command-104003.html): Define o tempo para uma chamada girar

+ `DUMP 104004 (EnableAdaptiveSpinning)`(/doc/ndb-internals/en/dump-command-104004.html): Habilita ou desabilita a rotação adaptativa

O NDB 8.0.20 também adiciona um novo parâmetro de configuração TCP `TcpSpinTime`, que define o tempo de rotação para uma conexão TCP específica.

A ferramenta **ndb_top** também foi aprimorada para fornecer informações sobre o tempo de rotação por thread.

Para informações adicionais, consulte a descrição do parâmetro `SpinMethod`, os comandos listados `DUMP` e a Seção 25.5.29, “ndb_top — Ver informações de uso de CPU para threads NDB”.

* **Reinício de dados do disco e do clúster.** A partir do NDB 8.0.21, um reinício inicial do clúster força a remoção de todos os objetos de dados do disco, como espaços de tabela e grupos de arquivos de registro, incluindo quaisquer arquivos de dados e arquivos de registro de desfazer associados a esses objetos.

Consulte a Seção 25.6.11, “Tabelas de dados de disco do cluster NDB”, para obter mais informações.

* **Alocação de extensão de dados do disco.** A partir do NDB 8.0.20, a alocação de extensões em arquivos de dados é feita de forma round-robin entre todos os arquivos de dados usados por um determinado espaço de tabela. Isso deve melhorar a distribuição de dados nos casos em que vários dispositivos de armazenamento são usados para armazenamento de Dados do disco.

Para mais informações, consulte a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”.

* **opção --ndb-log-fail-terminate.** A partir do NDB 8.0.21, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de linha completamente. Isso pode ser feito iniciando o **mysqld** com a opção `--ndb-log-fail-terminate`.

**Parâmetro AllowUnresolvedHostNames.** Por padrão, um nó de gerenciamento se recusa a iniciar quando não consegue resolver um nome de host presente no arquivo de configuração global, o que pode ser problemático em alguns ambientes, como o Kubernetes. A partir do NDB 8.0.22, é possível sobrepor esse comportamento definindo `AllowUnresolvedHostNames` como `true` na seção `[tcp default]` do arquivo de configuração global do clúster (arquivo `config.ini`). Isso faz com que tais erros sejam tratados como avisos, e permite que o **ndb_mgmd** continue a iniciar.

* **Melhorias no desempenho da escrita de blobs.** O NDB 8.0.22 implementa várias melhorias que permitem uma batching mais eficiente ao modificar várias colunas de blobs na mesma linha ou ao modificar várias linhas que contêm colunas de blobs na mesma declaração, reduzindo o número de viagens necessárias entre um nó SQL ou outro nó de API e os nós de dados ao aplicar essas modificações. O desempenho de muitas declarações `INSERT`, `UPDATE` e `DELETE` pode, assim, ser melhorado. Exemplos dessas declarações estão listados aqui, onde *`table`* é uma tabela `NDB` que contém uma ou mais colunas Blob:

+ `INSERT INTO table VALUES ROW(1, blob_value1, blob_value2, ...)`, ou seja, inserção de uma linha contendo uma ou mais colunas Blob

+ `INSERT INTO table VALUES ROW(1, blob_value1), ROW(2, blob_value2), ROW(3, blob_value3), ...`, ou seja, inserção de múltiplas linhas contendo uma ou mais colunas Blob

+ `UPDATE table SET blob_column1 = blob_value1, blob_column2 = blob_value2, ...`

+ `UPDATE table SET blob_column = blob_value WHERE primary_key_column in (value_list)`, onde a coluna da chave primária não é um tipo Blob

+ `DELETE FROM table WHERE primary_key_column = value`, onde a coluna da chave primária não é um tipo Blob

+ `DELETE FROM table WHERE primary_key_column IN (value_list)`, onde a coluna da chave primária não é um tipo Blob

Outras instruções SQL também podem se beneficiar dessas melhorias. Essas incluem `LOAD DATA INFILE`(load-data.html "15.2.9 LOAD DATA Statement") e `CREATE TABLE ... SELECT ...`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"). Além disso, `ALTER TABLE table ENGINE = NDB`(alter-table.html "15.1.9 ALTER TABLE Statement"), onde *`table`* usa um mecanismo de armazenamento diferente de `NDB` antes da execução da instrução, também pode executar de forma mais eficiente.

Essa melhoria se aplica a declarações que afetam as colunas do tipo MySQL `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. As declarações que atualizam as colunas `TINYBLOB` ou `TINYTEXT` (ou ambos os tipos) não são afetadas por este trabalho, e não devem ser esperadas mudanças em seu desempenho.

O desempenho de algumas instruções SQL não é notavelmente melhorado por essa melhoria, devido ao fato de que elas exigem varreduras de colunas de Blob da tabela, o que quebra o agrupamento. Tais instruções incluem as do tipo listadas aqui:

+ `SELECT FROM table [WHERE key_column IN (blob_value_list)]`(select.html "15.2.13 SELECT Statement"), onde as linhas são selecionadas por correspondência em uma chave primária ou coluna de chave única que utiliza um tipo Blob

+ `UPDATE table SET blob_column = blob_value WHERE condition`, utilizando um *`condition`* que não depende de um valor único

+ `DELETE FROM table WHERE condition` para excluir linhas que contenham uma ou mais colunas Blob, usando um *`condition`* que não dependa de um valor único

+ Uma declaração de cópia `ALTER TABLE` em uma tabela que já utilizou o mecanismo de armazenamento `NDB` antes de executar a declaração, e cujas linhas contêm uma ou mais colunas Blob antes ou depois da execução da declaração (ou em ambos os casos)

Para aproveitar essa melhoria ao máximo, você pode querer aumentar os valores usados para as opções `--ndb-batch-size` e `--ndb-blob-write-batch-bytes` para o **mysqld**, para minimizar o número de viagens necessárias para modificar blobs. Para a replicação, também é recomendável que você habilite a variável de sistema `slave_allow_batching`, que minimiza o número de viagens necessárias pelo clúster de replicação para aplicar transações de época.

Nota

Começando com o NDB 8.0.30, você também deve usar `ndb_replica_batch_size` em vez de `--ndb-batch-size`, e `ndb_replica_blob_write_batch_bytes` em vez de `--ndb-blob-write-batch-bytes`. Consulte as descrições dessas variáveis, bem como a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”, para obter mais informações.

* **Atualização do Node.js.** A partir do NDB 8.0.22, o adaptador `NDB` para Node.js é construído usando a versão 12.18.3, e agora é suportada apenas essa versão (ou uma versão posterior do Node.js).

* **Cópias de segurança criptografadas.** O NDB 8.0.22 adiciona suporte para arquivos de backup criptografados usando AES-256-CBC; isso é destinado a proteger contra a recuperação de dados de backups que tenham sido acessados por partes não autorizadas. Quando criptografado, os dados do backup são protegidos por uma senha fornecida pelo usuário. A senha pode ser qualquer string composta por até 256 caracteres do intervalo de caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`. A retenção da senha usada para criptografar qualquer backup do NDB Cluster deve ser realizada pelo usuário ou aplicativo; `NDB` não salva a senha. A senha pode ser vazia, embora isso não seja recomendado.

Ao fazer um backup de um NDB Cluster, você pode criptografá-lo usando o comando `ENCRYPT PASSWORD=password` com o cliente de gerenciamento `START BACKUP` (mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup"). Os usuários da API MGM também podem iniciar um backup criptografado, chamando `ndb_mgm_start_backup4()`.

Você pode criptografar arquivos de backup existentes usando o utilitário **ndbxfrm**, que foi adicionado à distribuição do NDB Cluster na versão 8.0.22; este programa também pode ser empregado para descriptografar arquivos de backup criptografados. Além disso, **ndbxfrm** pode comprimir arquivos de backup e descomprimir arquivos de backup comprimidos usando o mesmo método que é empregado pelo NDB Cluster para criar backups quando o parâmetro de configuração `CompressedBackup` é definido como 1.

Para restaurar a partir de um backup criptografado, use **ndb_restore** com as opções `--decrypt` e `--backup-password`. Ambas as opções são necessárias, juntamente com quaisquer outras que seriam necessárias para restaurar o mesmo backup se ele não fosse criptografado. **ndb_print_backup_file** e **ndbxfrm** também podem ler arquivos criptografados usando, respectivamente, `-P` *`password`* e `--decrypt-password=password`.

Em todos os casos em que uma senha é fornecida juntamente com uma opção de criptografia ou descriptografia, a senha deve ser citada; você pode usar aspas simples ou duplas para delimitar a senha.

A partir do NDB 8.0.24, vários dos programas `NDB` listados aqui também suportam a entrada da senha do padrão de entrada, de forma semelhante àquela realizada ao fazer login interativamente com o cliente **mysql** usando a opção `--password` (sem incluir a senha na linha de comando):

+ Para **ndb_restore** e **ndb_print_backup_file**, a opção `--backup-password-from-stdin` permite a entrada da senha de forma segura, de forma semelhante àquela realizada pelo cliente **mysql** com a opção `--password`. Para **ndb_restore**, use a opção juntamente com a opção [[`--decrypt`]; para **ndb_print_backup_file**, use a opção em substituição à opção [[`-P`].

Para **ndb_mgm**, a opção `--backup-password-from-stdin`, é suportada juntamente com `--execute "START BACKUP [options]"` e (mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute) para iniciar um backup de cluster a partir da linha de comandos do sistema.

+ Duas opções do **ndbxfrm**, `--encrypt-password-from-stdin` e `--decrypt-password-from-stdin`, causam comportamento semelhante ao usar esse programa para criptografar ou descriptografar um arquivo de backup.

Veja as descrições dos programas listados acima para mais informações.

É também possível, a partir da versão NDB 8.0.22, impor a criptografia dos backups definindo `RequireEncryptedBackup=1` na seção `[ndbd default]` do arquivo de configuração global do clúster. Quando isso é feito, o cliente **ndb_mgm** rejeita qualquer tentativa de realizar um backup que não esteja criptografado.

A partir do NDB 8.0.24, você pode fazer com que o **ndb_mgm** use criptografia sempre que cria um backup, iniciando-o com `--encrypt-backup`. Neste caso, o usuário é solicitado a fornecer uma senha ao invocar `START BACKUP`, se nenhuma for fornecida.

* **Suporte ao IPv6.** A partir do NDB 8.0.22, o endereçamento IPv6 é suportado para conexões a nós de gerenciamento e dados; isso inclui conexões entre nós de gerenciamento e dados com nós SQL. Ao configurar um clúster, você pode usar endereços IPv6 numéricos, nomes de host que resolvem em endereços IPv6 ou ambos.

Para que o endereçamento IPv6 funcione, a plataforma operacional e a rede na qual o clúster é implantado devem suportar IPv6. Assim como ao usar o endereçamento IPv4, a resolução de nomes de domínio para endereços IPv6 deve ser fornecida pela plataforma operacional.

Um problema conhecido nas plataformas Linux ao executar o NDB 8.0.22 e versões posteriores era que o kernel do sistema operacional precisava fornecer suporte ao IPv6, mesmo quando não havia endereços IPv6 em uso. Esse problema é corrigido no NDB 8.0.34 e versões posteriores, onde é seguro desativar o suporte ao IPv6 no kernel do Linux se você não pretende usar endereçamento IPv6 (Bug #33324817, Bug #33870642).

O endereçamento IPv4 continua a ser suportado por `NDB`. Não é recomendado usar endereços IPv4 e IPv6 simultaneamente, mas pode ser feito em os seguintes casos:

+ Quando o nó de gerenciamento é configurado com IPv6 e os nós de dados são configurados com endereços IPv4 no arquivo `config.ini`: Isso funciona se `--bind-address` não for usado com **mgmd**, e os nós de dados são iniciados com `--ndb-connectstring` definido para o endereço IPv4 dos nós de gerenciamento.

+ Quando o nó de gerenciamento é configurado com IPv4 e os nós de dados são configurados com endereços IPv6 em `config.ini`: Da mesma forma que no outro caso, isso funciona se `--bind-address` não for passado para **mgmd** e os nós de dados são iniciados com `--ndb-connectstring` definido para o endereço IPv6 do nó de gerenciamento.

Esses casos funcionam porque o **ndb_mgmd** não se vincula a nenhum endereço IP por padrão.

Para realizar uma atualização de uma versão do `NDB` que não suporta endereçamento IPv6 para uma que o faça, desde que a rede suporte IPv4 e IPv6, primeiro realize a atualização do software; após isso ter sido feito, você pode atualizar as endereços IPv4 usados no arquivo `config.ini` com endereços IPv6. Depois disso, para fazer com que as mudanças de configuração tenham efeito e para fazer com que o clúster comece a usar os endereços IPv6, é necessário realizar um reinício do sistema do clúster.

* **Depreciação e remoção do Auto-Installer.** A ferramenta de instalação baseada na web do MySQL NDB Cluster Auto-Installer (**ndb_setup.py**) é depreciada no NDB 8.0.22 e removida no NDB 8.0.23 e versões posteriores. Ela não é mais suportada.

* **descontinuidade e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi descontinuado no NDB 8.0.22 e removido no NDB 8.0.23.

* **tabela ndbinfo backup_id.** O NDB 8.0.24 adiciona uma tabela `backup_id` ao banco de dados de informações `ndbinfo`. Isso é destinado a substituir a obtenção dessas informações usando **ndb_select_all** para drenar o conteúdo da tabela interna `SYSTAB_0`, que é propenso a erros e leva um tempo excessivamente longo para ser realizado.

Esta tabela tem uma única coluna e uma única linha que contém o ID do backup mais recente do clúster, feito usando o comando do cliente de gerenciamento `START BACKUP`. No caso de não ser possível encontrar um backup deste clúster, a tabela contém uma única linha cujo valor da coluna é `0`.

* Melhorias no particionamento de tabelas. O NDB 8.0.23 introduz um novo método para lidar com particionamentos e fragmentos de tabelas, que pode determinar o número de gestores de dados locais (LDMs) para um nó de dados específico, independentemente do número de partes do log de revisão. Isso significa que o número de LDMs pode agora ser altamente variável. O `NDB` pode empregar esse método quando o parâmetro de configuração do nó de dados `ClassicFragmentation`, também implementado no NDB 8.0.23, é definido como `false`; quando isso é o caso, o número de LDMs não é mais usado para determinar quantas particionamentos devem ser criados para uma tabela por nó de dados, e o valor do parâmetro `PartitionsPerNode` (também introduzido no NDB 8.0.23) determina esse número, que também é usado para calcular o número de fragmentos usados para uma tabela.

Quando `ClassicFragmentation` tem seu valor padrão `true`, então o método tradicional de usar o número de LDMs é usado para determinar o número de fragmentos que uma tabela deve ter.

Para mais informações, consulte as descrições dos novos parâmetros referenciados anteriormente, em Parâmetros de configuração de multitarefa (ndbmtd)").

* **Atualizações de terminologia.** Para se alinhar ao trabalho iniciado no MySQL 8.0.21 e no NDB 8.0.21, o NDB 8.0.23 implementa várias mudanças na terminologia, listadas aqui:

+ A variável de sistema `ndb_slave_conflict_role` é agora descontinuada. Ela é substituída por `ndb_conflict_role`.

+ Muitas variáveis de status `NDB` estão desatualizadas. Essas variáveis e suas substituições estão mostradas na tabela a seguir:

**Tabela 25.1 Variáveis de status NDB obsoletas e suas substituições**

    <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Deprecated variable</th> <th>Replacement</th> </tr></thead><tbody><tr> <td><code>Ndb_api_adaptive_send_deferred_count_slave</code></td> <td><code>Ndb_api_adaptive_send_deferred_count_replica</code></td> </tr><tr> <td><code>Ndb_api_adaptive_send_forced_count_slave</code></td> <td><code>Ndb_api_adaptive_send_forced_count_replica</code></td> </tr><tr> <td><code>Ndb_api_adaptive_send_unforced_count_slave</code></td> <td><code>Ndb_api_adaptive_send_unforced_count_replica</code></td> </tr><tr> <td><code>Ndb_api_bytes_received_count_slave</code></td> <td><code>Ndb_api_bytes_received_count_replica</code></td> </tr><tr> <td><code>Ndb_api_bytes_sent_count_slave</code></td> <td><code>Ndb_api_bytes_sent_count_replica</code></td> </tr><tr> <td><code>Ndb_api_pk_op_count_slave</code></td> <td><code>Ndb_api_pk_op_count_replica</code></td> </tr><tr> <td><code>Ndb_api_pruned_scan_count_slave</code></td> <td><code>Ndb_api_pruned_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_range_scan_count_slave</code></td> <td><code>Ndb_api_range_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_read_row_count_slave</code></td> <td><code>Ndb_api_read_row_count_replica</code></td> </tr><tr> <td><code>Ndb_api_scan_batch_count_slave</code></td> <td><code>Ndb_api_scan_batch_count_replica</code></td> </tr><tr> <td><code>Ndb_api_table_scan_count_slave</code></td> <td><code>Ndb_api_table_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_abort_count_slave</code></td> <td><code>Ndb_api_trans_abort_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_close_count_slave</code></td> <td><code>Ndb_api_trans_close_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_commit_count_slave</code></td> <td><code>Ndb_api_trans_commit_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_local_read_row_count_slave</code></td> <td><code>Ndb_api_trans_local_read_row_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_start_count_slave</code></td> <td><code>Ndb_api_trans_start_count_replica</code></td> </tr><tr> <td><code>Ndb_api_uk_op_count_slave</code></td> <td><code>Ndb_api_uk_op_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_exec_complete_count_slave</code></td> <td><code>Ndb_api_wait_exec_complete_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_meta_request_count_slave</code></td> <td><code>Ndb_api_wait_meta_request_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_nanos_count_slave</code></td> <td><code>Ndb_api_wait_nanos_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_scan_result_count_slave</code></td> <td><code>Ndb_api_wait_scan_result_count_replica</code></td> </tr><tr> <td><code>Ndb_slave_max_replicated_epoch</code></td> <td><code>Ndb_replica_max_replicated_epoch</code></td> </tr></tbody></table>

As variáveis de status obsoletas continuam a ser exibidas na saída do `SHOW STATUS`, mas as aplicações devem ser atualizadas o mais rápido possível para não mais depender delas, uma vez que sua disponibilidade em futuras séries de lançamento não é garantida.

+ Os valores `ADD_TABLE_MASTER` e `ADD_TABLE_SLAVE` anteriormente mostrados na coluna `tab_copy_status` da tabela `ndbinfo` `ndbinfo.table_distribution_status` são desatualizados. Esses são substituídos, respectivamente, pelos valores `ADD_TABLE_COORDINATOR` e `ADD_TABLE_PARTICIPANT`.

+ A saída `--help` de alguns programas cliente e utilitários `NDB`, como o **ndb_restore**, foi modificada.

* **Melhorias no ThreadConfig.** A partir do NDB 8.0.23, a configuração do parâmetro `ThreadConfig` foi estendida com dois novos tipos de thread, listados aqui:

+ `query`: Um fio de consulta funciona (apenas) em consultas `READ COMMITTED`. Um fio de consulta também atua como um fio de recuperação. O número de fios de consulta deve ser 0, 1, 2 ou 3 vezes o número de fios LDM. 0 (o padrão, a menos que esteja usando `ThreadConfig`, ou `AutomaticThreadConfig` esteja habilitado) faz com que os LDMs se comportem como faziam antes do NDB 8.0.23.

+ `recover`: Um fio de recuperação recupera dados de um ponto de verificação local. Um fio de recuperação especificado como tal nunca atua como um fio de consulta.

É também possível combinar as threads existentes `main` e `rep` de duas maneiras:

+ Em um único fio, definindo um desses argumentos para 0. Quando isso é feito, o fio combinado resultante é exibido com o nome `main_rep` na tabela `ndbinfo.threads`.

+ Juntamente com o fio `recv`, definindo os dois `ldm` e `tc` como 0, e definindo `recv` como 1. Neste caso, o fio combinado é denominado `main_rep_recv`.

Além disso, o número máximo de vários tipos de threads existentes foi aumentado. Os novos máximos, incluindo os para threads de consulta e recuperação, estão listados aqui:

+ LDM: 332
  + Pergunta: 332
  + Recuperação: 332
  + TC: 128
  + Receber: 64
  + Enviar: 64
  + Principal: 2

Os máximos para outros tipos de fios permanecem inalterados.

Além disso, como resultado do trabalho realizado em relação a essa tarefa, o `NDB` agora utiliza mutantes para proteger os buffers de trabalho ao usar mais de 32 threads de bloco. Embora isso possa causar uma leve diminuição do desempenho (1 a 2 por cento na maioria dos casos), também reduz significativamente a quantidade de memória necessária em configurações muito grandes. Por exemplo, uma configuração com 64 threads que usava 2 GB de memória de buffer de trabalho antes do NDB 8.0.23 deve exigir apenas cerca de 1 GB no NDB 8.0.23 e versões posteriores. Em nossos testes, isso resultou em uma melhoria geral na ordem de 5 por cento na execução de consultas muito complexas.

Para mais informações, consulte as descrições do parâmetro `ThreadConfig` e da tabela `ndbinfo.threads`.

* Alterações na contagem de threads ThreadConfig. Como resultado do trabalho realizado no NDB 8.0.30, definir o valor de `ThreadConfig` requer incluir `main`, `rep`, `recv` e `ldm` na string de valor `ThreadConfig` explicitamente, neste e nos lançamentos subsequentes do NDB Cluster. Além disso, `count=0` deve ser definido explicitamente para cada tipo de thread (de `main`, `rep` ou `ldm`) que não será usado, e definir `count=1` para threads de replicação (`rep`) também requer definir `count=1` para `main`.

Essas mudanças podem ter um impacto significativo em atualizações de clusters NDB onde este parâmetro está em uso; consulte a Seção 25.3.7, “Atualizando e Desatualizando Clusters NDB”, para mais informações.

* **Configuração Automática de Fios ndbmtd.** A partir do NDB 8.0.23, é possível empregar a configuração automática de fios para nós de dados multi-filamento usando o parâmetro de configuração **ndbmtd**") `AutomaticThreadConfig`. Quando este parâmetro é definido como 1, `NDB` configura automaticamente as atribuições de fios, com base no número de processadores disponíveis para as aplicações, para todos os tipos de fios suportados, incluindo os novos tipos de fios `query` e `recover` descritos no item anterior. Se o sistema não limitar o número de processadores, você pode fazer isso, se desejar, definindo `NumCPUs` (também adicionado no NDB 8.0.23). Caso contrário, a configuração automática de fios acomoda até 1024 CPUs.

A configuração automática do fio ocorre independentemente de quaisquer valores definidos para `ThreadConfig` ou `MaxNoOfExecutionThreads` em `config.ini`; isso significa que não é necessário definir nenhum desses parâmetros.

Além disso, o NDB 8.0.23 implementa uma série de novas tabelas de banco de dados de informações `ndbinfo`, fornecendo informações sobre a disponibilidade de hardware e CPU, bem como o uso da CPU pelos nós de dados `NDB`. Essas tabelas estão listadas aqui:

+ `cpudata`
+ `cpudata_1sec`
+ `cpudata_20sec`
+ `cpudata_50ms`
+ `cpuinfo`
+ `hwinfo`

Algumas dessas tabelas não estão disponíveis em todas as plataformas suportadas pelo NDB Cluster; consulte as descrições individuais delas para mais informações.

* **Visões hierárquicas dos objetos do banco de dados NDB.** A tabela `dict_obj_tree`, adicionada ao banco de dados de informações `ndbinfo` no NDB 8.0.24, pode fornecer visões hierárquicas e semelhantes a uma árvore de muitos objetos do banco de dados `NDB`, incluindo o seguinte:

+ Tabelas e índices associados
+ Tabelaspaces e arquivos de dados associados
+ Grupos de arquivo de registro e arquivos de registro de desfazer associados

Para mais informações e exemplos, consulte a Seção 25.6.16.25, “A tabela ndbinfo dict_obj_tree”.

* **Melhorias nas estatísticas do índice.** O NDB 8.0.24 implementa as seguintes melhorias no cálculo das estatísticas do índice:

+ As estatísticas do índice eram coletadas anteriormente a partir de apenas um fragmento; isso foi alterado de modo que essa extrapolação seja estendida a fragmentos adicionais.

+ O algoritmo utilizado para tabelas muito pequenas, como aquelas com poucas linhas e em que os resultados são descartados, foi aprimorado, de modo que as estimativas para tais tabelas devem ser mais precisas do que anteriormente.

A partir da NDB 8.0.27, as tabelas de estatísticas do índice são criadas e atualizadas automaticamente por padrão, `IndexStatAutoCreate` e `IndexStatAutoUpdate` ambos padrão para `1` (ativado) em vez de `0` (desativado), e não é mais necessário executar `ANALYZE TABLE` para atualizar as estatísticas.

Para informações adicionais, consulte a Seção 25.6.15, “Contadores e variáveis de estatísticas da API NDB”.

* **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 8.0.26, o **ndb_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

+ Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

A coluna originalmente declarada como `NULL` não deve conter nenhuma linha `NULL`; se o fizer, o **ndb_restore** sai com um erro.

+ Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

Para mais informações, consulte as descrições das opções **ndb_restore** indicadas.

* Modo de comparação de NULL compatível com SQL para NdbScanFilter. Tradicionalmente, ao fazer comparações envolvendo `NULL`, `NdbScanFilter` trata `NULL` como igual a `NULL` (e, portanto, considera `NULL == NULL` como `TRUE`. Isso não é o mesmo que o especificado pelo Padrão SQL, que exige que qualquer comparação com `NULL` retorne `NULL`, incluindo `NULL == NULL`.

Anteriormente, não era possível que um aplicativo da API NDB sobrescrevesse esse comportamento; a partir do NDB 8.0.26, você pode fazer isso ao chamar `NdbScanFilter::setSqlCmpSemantics()` antes de criar um filtro de varredura. (Assim, esse método é sempre invocado como um método de classe e não como um método de instância.) Ao fazer isso, o próximo objeto `NdbScanFilter` é criado para empregar a comparação `NULL` compatível com SQL para todas as operações de comparação realizadas ao longo da vida útil da instância. Você deve invocar o método para cada objeto `NdbScanFilter` que deve usar comparações compatíveis com SQL.

Para mais informações, consulte NdbScanFilter::setSqlCmpSemantics().

* **Depreciação dos métodos do arquivo .FRM da API NDB.** O MySQL 8.0 e o NDB 8.0 não utilizam mais os arquivos `.FRM` para armazenar metadados de tabela. Por esse motivo, os métodos da API NDB `getFrmData()`, `getFrmLength()` e `setFrm()` são depreciados a partir do NDB 8.0.27 e estão sujeitos à remoção em uma versão futura. Para leitura e escrita de metadados de tabela, use `getExtraMetadata()` e `setExtraMetadata()` em vez disso.

* **Preferência para endereçamento IPv4 ou IPv6.** O NDB 8.0.26 adiciona o parâmetro de configuração `PreferIPVersion`, que controla a preferência de endereçamento para resolução DNS. IPv4 (`PreferIPVersion=4`) é o padrão. Como a recuperação de configuração no NDB exige que essa preferência seja a mesma para todas as conexões TCP, você deve configurá-la apenas na seção `[tcp default]` do arquivo de configuração global do clúster (`config.ini`).

Consulte a Seção 25.4.3.10, "Conexões de NDB Cluster TCP/IP", para obter mais informações.

* Melhorias no registro. Anteriormente, a análise dos logs dos nós de dados do NDB Cluster e dos nós de gerenciamento poderia ser prejudicada pelo fato de que diferentes mensagens de log usavam formatos diferentes e que nem todas as mensagens de log incluíam timestamps. Esses problemas eram, em parte, devidos ao fato de que o registro era realizado por vários mecanismos diferentes, como as funções `printf`, `fprintf`, `ndbout` e `ndbout_c`, o sobrecarregamento do operador `<<`, e assim por diante.

Resolvemos esses problemas ao padronizar o mecanismo `EventLogger`, que já está presente em `NDB`, e que começa cada mensagem de log com um timestamp no formato `YYYY-MM-DD HH:MM:SS`.

Consulte a Seção 25.6.3, “Relatórios de eventos gerados no NDB Cluster”, para obter mais informações sobre os registros de eventos do NDB Cluster e o formato da mensagem de registro `EventLogger`.

* **Copiar as melhorias da ALTER TABLE.** A partir do NDB 8.0.27, uma cópia `ALTER TABLE` em uma tabela `NDB` compara os números de comprometimento de fragmentos da tabela de origem antes e depois de realizar a cópia. Isso permite que o nó SQL que executa essa declaração determine se houve alguma atividade de escrita concorrente na tabela que está sendo alterada; se sim, o nó SQL pode então finalizar a operação.

Quando são detectadas gravações concorrentes sendo feitas na tabela que está sendo alterada, a declaração `ALTER TABLE` é rejeitada com o erro Alterações detectadas nos dados da tabela de origem durante a cópia ALTER TABLE. A alteração é abortada para evitar inconsistências (`ER_TABLE_DEF_CHANGED`). Parar a operação de alteração, em vez de permitir que ela prossiga com gravações concorrentes ocorrendo, pode ajudar a prevenir a perda silenciosa de dados ou corrupção.

* **tabela ndbinfo index_stats.** O NDB 8.0.28 adiciona a tabela `index_stats`, que fornece informações básicas sobre as estatísticas do índice NDB. Ela é destinada principalmente para testes internos, mas pode ser útil como um complemento para **ndb_index_stat**.

* **opção ndb_import --table.** Antes do NDB 8.0.28, o **ndb_import** sempre importava os dados lidos a partir de um arquivo CSV em uma tabela cujo nome era derivado do nome do arquivo que estava sendo lido. O NDB 8.0.28 adiciona uma opção `--table` (forma abreviada: `-t`) para que este programa especifique diretamente o nome da tabela de destino e substitua o comportamento anterior.

O comportamento padrão para **ndb_import** continua a usar o nome base do arquivo de entrada como o nome da tabela de destino.

* **opção ndb_import --missing-ai-column.** A partir do NDB 8.0.29, o **ndb_import** pode importar dados de um arquivo CSV que contém valores vazios para uma coluna `AUTO_INCREMENT`, usando a opção `--missing-ai-column` introduzida nessa versão. A opção pode ser usada com uma ou mais tabelas que contenham essa coluna.

Para que essa opção funcione, a coluna `AUTO_INCREMENT` no arquivo CSV não deve conter nenhum valor. Caso contrário, a operação de importação não pode prosseguir.

* **ndb_import e linhas vazias.** O **ndb_import** sempre rejeitou quaisquer linhas vazias encontradas em um arquivo CSV recebido. O NDB 8.0.30 adiciona suporte para importar linhas vazias em uma única coluna, desde que seja possível converter o valor vazio em um valor de coluna.

* **opção ndb_restore --with-apply-status.** A partir do NDB 8.0.29, é possível restaurar a tabela `ndb_apply_status` a partir de um backup do `NDB`, usando **ndb_restore** com a opção `--with-apply-status` adicionada nessa versão. Para usar essa opção, você também deve usar `--restore-data` ao invocar **ndb_restore**.

`--with-apply-status` restaura todas as linhas da tabela `ndb_apply_status`, exceto a linha que tem `server_id = 0`; para restaurar esta linha, use `--restore-epoch`. Para mais informações, consulte ndb_apply_status Table, como a descrição da opção `--with-apply-status`.

* **Acesso SQL a tabelas com índices ausentes.** Antes do NDB 8.0.29, quando uma consulta do usuário tentasse abrir uma tabela `NDB` com um índice ausente ou quebrado, o servidor MySQL gerava o erro `4243` (Índice não encontrado). Essa situação poderia ocorrer quando violações de restrição ou dados ausentes tornam impossível restaurar um índice em uma tabela `NDB`, e o **ndb_restore** `--disable-indexes` foi usado para restaurar os dados sem o índice.

Começando com o NDB 8.0.29, uma consulta SQL contra uma tabela `NDB` que tem índices ausentes é bem-sucedida se a consulta não usar nenhum dos índices ausentes. Caso contrário, a consulta é rejeitada com `ER_NOT_KEYFILE`. Neste caso, você pode usar `ALTER TABLE ... ALTER INDEX ... INVISIBLE`(alter-table.html#alter-table-index "Primary Keys and Indexes") para evitar que o Otimizador MySQL tente usar o índice, ou excluir o índice (e, em seguida, possivelmente recriá-lo) usando as declarações SQL apropriadas.

* **Método **NDB API List::clear()**. Os métodos da API NDB `Dictionary`, `listEvents()`, `listIndexes()` e `listObjects()` cada um requerem uma referência a um objeto `List` que está vazio. Anteriormente, reutilizar um `List` existente com qualquer um desses métodos era problemático por esse motivo. O NDB 8.0.29 facilita isso ao implementar um método `clear()` que remove todos os dados da lista.

Como parte desse trabalho, o destrutor da classe `List` agora chama `List::clear()` antes de remover quaisquer elementos ou atributos da lista.

* **Tabelas do dicionário NDB no ndbinfo.** O NDB 8.0.29 introduz várias novas tabelas no banco de dados `ndbinfo`, fornecendo informações do `NdbDictionary` que anteriormente exigiam o uso de **ndb_desc**, **ndb_select_all** e outros programas de utilitário **NDB**.

Dois desses tabelas são, na verdade, visualizações. A tabela `hash_maps` fornece informações sobre mapas de hash utilizados por `NDB`; a tabela `files` mostra informações sobre os arquivos utilizados para armazenar dados em disco (consulte Seção 25.6.11, “Tabelas de dados de disco do NDDB”).

As seis tabelas restantes `ndbinfo` adicionadas no NDB 8.0.29 são tabelas base. Essas tabelas não são ocultas e não são nomeadas usando o prefixo `ndb$`. Essas tabelas estão listadas aqui, com descrições dos objetos representados em cada tabela:

+ `blobs`: Tabelas de blobs usadas para armazenar as partes de tamanho variável das colunas `BLOB` e `TEXT`

+ `dictionary_columns`: Colunas das tabelas `NDB`

+ `dictionary_tables`: tabelas `NDB`

+ `events`: Assinaturas de eventos na API NDB

+ `foreign_keys`: Chave estrangeira nas tabelas `NDB`

+ `index_columns`: Índices em tabelas de `NDB`

O NDB 8.0.29 também faz alterações na implementação do armazenamento de chaves primárias do motor de armazenamento `ndbinfo` para melhorar a compatibilidade com `NdbDictionary`.

* **plugin ndbcluster e Performance Schema.** A partir do NDB 8.0.29, os threads do plugin `ndbcluster` são mostrados nas tabelas `threads` e `setup_threads` do Performance Schema, permitindo obter informações sobre o desempenho desses threads. Os três threads expostos nas tabelas `performance_schema` estão listados aqui:

+ `ndb_binlog`: Fuso horário de registro binário
  + `ndb_index_stat`: Fuso horário de estatísticas de índice
  + `ndb_metadata`: Fuso horário de metadados

Veja os Tópicos do Plugin ndbcluster para obter mais informações e exemplos.

Em NDB 8.0.30 e versões posteriores, o uso de memória de lote de transações é visível como `memory/ndbcluster/Thd_ndb::batch_mem_root` nas tabelas do Schema de Desempenho `memory_summary_by_thread_by_event_name` e `setup_instruments`. Você pode usar essas informações para ver quanto da memória está sendo usado pelas transações. Para informações adicionais, consulte Uso de Memória de Transação.

* **Tamanho inline de blob configurável.** A partir do NDB 8.0.30, é possível definir o tamanho inline de uma coluna de blob como parte de `CREATE TABLE` ou `ALTER TABLE`. O tamanho inline máximo suportado pelo NDB Cluster é de 29980 bytes.

Para informações adicionais e exemplos, consulte Opções de NDB_COLUMN, bem como Requisitos de Armazenamento de Tipo de String.

* **replica_allow_batching ativado por padrão.** O agrupamento de escrita de réplica melhora significativamente o desempenho da Replicação do NDB Cluster, especialmente ao replicar colunas do tipo blob (`TEXT`, `BLOB` e `JSON`), e, portanto, geralmente deve ser ativado sempre que se usa replicação com o NDB Cluster. Por essa razão, a partir do NDB 8.0.30, a variável de sistema `replica_allow_batching` é ativada por padrão, e definir-a para `OFF` gera um aviso.

* **Suporte para inserção de resolução de conflitos.** Antes do NDB 8.0.30, havia apenas duas estratégias disponíveis para resolver conflitos de chave primária para operações de atualização e exclusão, implementadas como as funções `NDB$MAX()` e `NDB$MAX_DELETE_WIN()`. Nenhuma dessas funções tem efeito em operações de escrita, exceto que uma operação de escrita com a mesma chave primária que uma escrita anterior é sempre rejeitada, e aceita e aplicada apenas se nenhuma operação com a mesma chave primária já existe. O NDB 8.0.30 introduz duas novas funções de resolução de conflitos `NDB$MAX_INS()` e `NDB$MAX_DEL_WIN_INS()` que lidam com conflitos de chave primária entre operações de inserção. Essas funções lidam com escritas conflitantes da seguinte forma:

1. Se não houver uma escrita em conflito, aplique esta (isso é o mesmo que `NDB$MAX()`).

2. Caso contrário, aplique a resolução de conflitos com o maior timestamp, conforme segue:

1. Se o timestamp do registro de entrada for maior que o do registro de escrita em conflito, aplique a operação de entrada.

2. Se o timestamp para a escrita de entrada *não* for maior, rejeite a operação de escrita de entrada.

Para operações de atualização e exclusão conflitantes, `NDB$MAX_INS()` se comporta da mesma forma que `NDB$MAX()` e `NDB$MAX_DEL_WIN_INS()` se comporta da mesma forma que `NDB$MAX_DELETE_WIN()`.

Essa melhoria oferece suporte para a configuração da detecção de conflitos ao lidar com operações de escrita replicadas conflitantes, de modo que um `INSERT` replicado com um valor de coluna de marcação de tempo mais alto seja aplicado de forma idempotente, enquanto um `INSERT` replicado com um valor de coluna de marcação de tempo mais baixo é rejeitado.

Assim como as outras funções de resolução de conflitos, as operações rejeitadas podem, opcionalmente, ser registradas em uma tabela de exceções; as operações rejeitadas incrementam um contador (variáveis de status `Ndb_conflict_fn_max` para “maior timestamp vence” e `Ndb_conflict_fn_old` para “mesmo timestamp vence”).

Para mais informações, consulte as descrições das novas funções de resolução de conflitos, bem como a Seção 25.7.12, “Resolução de conflitos de replicação de clúster NDB”.

* **Controle do tamanho do lote do aplicativo de replicação.** Anteriormente, o tamanho dos lotes usados ao gravar em um NDB Cluster de replica era controlado por `--ndb-batch-size`, e o tamanho do lote usado para gravar dados blob na replica era determinado por `ndb-blob-write-batch-bytes`. Um problema com essa configuração era que a replica usava os valores globais dessas variáveis, o que significava que alterar qualquer uma delas para a replica também afetava o valor usado por todas as outras sessões. Além disso, não era possível definir diferentes configurações padrão para esses valores exclusivos da replica, que, preferencialmente, deveriam ter um valor padrão mais alto do que os outros.

O NDB 8.0.30 adiciona duas novas variáveis de sistema que são específicas para o aplicativo replicador. `ndb_replica_batch_size` agora controla o tamanho do lote usado para o aplicativo replicador, e a variável `ndb_replica_blob_write_batch_bytes` agora determina o tamanho do lote de escrita de blobs usado para realizar escritas de blobs em lote no replicador.

Essa mudança deve melhorar o comportamento da replicação do MySQL NDB Cluster usando configurações padrão e permitir que o usuário ajuste o desempenho da replicação NDB sem afetar os próprios threads do usuário, como aqueles que realizam o processamento de consultas SQL.

Para mais informações, consulte as descrições das novas variáveis. Veja também a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”.

* **Compressão de transações de registro binário.** O NDB 8.0.31 adiciona suporte para registros binários usando transações compactadas com compressão `ZSTD`. Para habilitar essa funcionalidade, defina a variável de sistema `ndb_log_transaction_compression` introduzida nessa versão para `ON`. O nível de compressão utilizado pode ser controlado usando a variável de sistema `ndb_log_transaction_compression_level_zstd`, que também é adicionada naquela versão; o nível de compressão padrão é 3.

Embora as variáveis de sistema de servidor `binlog_transaction_compression` e `binlog_transaction_compression_level_zstd` não tenham efeito no registro binário das tabelas `NDB`, iniciar o **mysqld** com `--binlog-transaction-compression=ON` faz com que o `ndb_log_transaction_compression` seja habilitado automaticamente. Você pode desativá-lo em uma sessão do cliente MySQL usando `SET @@global.ndb_log_transaction_compression=OFF` após a inicialização do servidor ter sido concluída.

Veja a descrição de `ndb_log_transaction_compression` e também a Seção 7.4.4.5, “Compressão de Transação de Registro Binário”, para mais informações.

* **Replicação do NDB: Aplicativo multithread.** A partir do NDB 8.0.33, a replicação do NDB Cluster suporta o aplicador multithread do MySQL (MTA) nos servidores de replica (e valores não nulos de `replica_parallel_workers`), o que permite a aplicação de transações de log binário em paralelo na replica e, assim, aumentar o desempenho. (Para mais informações sobre o aplicador multithread no servidor MySQL, consulte a Seção 19.2.3, “Threads de replicação”.)

Para habilitar essa funcionalidade na replica, é necessário que a fonte seja iniciada com `--ndb-log-transaction-dependency` definido como `ON` (esta opção também é implementada no NDB 8.0.33). Além disso, é necessário na fonte definir `binlog_transaction_dependency_tracking` como `WRITESET`. Além disso, você deve garantir que `replica_parallel_workers` tenha um valor maior que 1 na replica, e, portanto, que a replica use vários threads de trabalho.

Para informações adicionais e requisitos, consulte a Seção 25.7.11, “Replicação de aglomerado NDB usando o Aplicativo Multithreaded”.

* **Alterações nas opções de compilação.** O NDB 8.0.31 faz as seguintes alterações nas opções do CMake usadas para a construção do MySQL Cluster.

+ A opção `WITH_NDBCLUSTER` é descontinuada e `WITH_PLUGIN_NDBCLUSTER` é removida.

+ Para construir o MySQL Cluster a partir do código-fonte, use a opção recentemente adicionada `WITH_NDB`.

+ `WITH_NDBCLUSTER_STORAGE_ENGINE` continua sendo suportado, mas não é mais necessário para a maioria das compilações.

Veja Opções do CMake para Compilar o NDB Cluster, para mais informações.

* **Encriptação do sistema de arquivos.** A Encriptação de Dados Transparente (TDE) oferece proteção através da encriptação dos dados `NDB` em repouso, ou seja, de todos os dados da tabela `NDB` e arquivos de registro que são persistidos no disco. Isso visa proteger contra a recuperação de dados após a obtenção de acesso não autorizado aos arquivos de dados do NDB Cluster, como arquivos de espaço de tabela ou logs.

A camada de sistema de arquivos NDB implementa criptografia de forma transparente (`NDBFS`) nos nós de dados; os dados são criptografados e descriptografados conforme lidos e escritos no arquivo, e os blocos internos de clientes `NDBFS` operam em arquivos como de costume.

`NDBFS` pode criptografar um arquivo de forma transparente diretamente a partir de uma senha fornecida pelo usuário, mas desacoplar a criptografia e descriptografia de arquivos individuais da senha fornecida pelo usuário pode ser vantajoso por razões de eficiência, usabilidade, segurança e flexibilidade. Veja a Seção 25.6.14.2, “Implementação de Criptografia do Sistema de Arquivos NDB”.

O TDE utiliza dois tipos de chaves. Uma chave secreta é usada para criptografar os dados reais e os arquivos de registro armazenados em disco (incluindo arquivos LCP, redo, undo e de tablespace). Uma chave mestre é então usada para criptografar a chave secreta.

O parâmetro de configuração do nó de dados `EncryptedFileSystem`, disponível a partir do NDB 8.0.29, quando definido como `1`, aplica criptografia aos arquivos que armazenam dados de tabela. Isso inclui arquivos de dados LCP, arquivos de log de refazer, arquivos de espaço de tabela e arquivos de log de desfazer.

Também é necessário fornecer uma senha para cada nó de dados ao iniciá-lo ou reiniciá-lo, usando uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`. Veja a Seção 25.6.14.1, “Configuração e Uso da Criptografia do Sistema de Arquivo NDB”. Essa senha usa o mesmo formato e está sujeita às mesmas restrições que a senha usada para um backup criptografado `NDB` (consulte a descrição da opção **ndb_restore** `--backup-password` para detalhes).

Somente as tabelas que utilizam o mecanismo de armazenamento `NDB` estão sujeitas à criptografia por meio deste recurso; consulte a Seção 25.6.14.3, “Limitações de Criptografia do Sistema de Arquivos NDB”. Outras tabelas, como as utilizadas para a distribuição do esquema `NDB`, replicação e registro binário, normalmente utilizam `InnoDB`; consulte a Seção 17.13, “Criptografia de Dados em Repouso no InnoDB”. Para informações sobre a criptografia de arquivos de registro binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Registro Binário e Arquivos de Registro Relay”.

Os arquivos gerados ou utilizados pelos processos do `NDB`, como logs do sistema operacional, logs de falha e dumps de núcleo, não são criptografados. Os arquivos utilizados pelo `NDB`, mas que não contêm nenhum dado da tabela de usuários, também não são criptografados; esses incluem arquivos de controle LCP, arquivos de esquema e arquivos do sistema (ver Sistema de Arquivo de Nó de Dados do NDB Cluster). O cache de configuração do servidor de gerenciamento também não é criptografado.

Além disso, o NDB 8.0.31 adiciona uma nova ferramenta **ndb_secretsfile_reader** para extrair informações-chave de um arquivo de segredos (`S0.sysfile`).

Essa melhoria se baseia no trabalho realizado no NDB 8.0.22 para implementar backups criptografados do `NDB`. Para mais informações sobre backups criptografados, consulte a descrição do parâmetro de configuração `RequireEncryptedBackup`, bem como a Seção 25.6.8.2, “Usando o NDB Cluster Management Client para criar um backup”.

* **Remoção de opções de programas desnecessárias.** Várias opções de linha de comando "desnecessárias" para o utilitário NDB e outros programas que nunca haviam sido implementadas foram removidas no NDB Cluster 8.0.31. As opções e os programas de onde elas foram removidas estão listados aqui:

+ `--ndb-optimized-node-selection`:

**ndbd**, **ndbmtd**"), **ndb_mgm**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**

+ `--character-sets-dir`:

**ndb_mgm**, **ndb_mgmd**, **ndb_config**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**, **ndb_waiter**

+ `--core-file`:

**ndb_mgm**, **ndb_mgmd**, **ndb_config**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**, **ndb_waiter**

+ `--connect-retries` e `--connect-retry-delay`:

    **ndb_mgmd**

+ `--ndb-nodeid`:

    **ndb_config**

Para mais informações, consulte as descrições dos programas e opções relevantes na Seção 25.5, “Programas de aglomerados NDB”.

* **Leitura de arquivos de cache de configuração.** A partir do NDB 8.0.32, é possível ler arquivos de cache de configuração binários criados pelo **ndb_mgmd** usando a opção **ndb_config** `--config-binary-file` introduzida nessa versão. Isso pode simplificar o processo de determinar se as configurações em um arquivo de configuração específico foram aplicadas ao clúster, ou de recuperação de configurações do cache binário após o arquivo `config.ini` ter sido danificado ou perdido de alguma forma.

Para mais informações e exemplos, consulte a descrição desta opção na Seção 25.5.7, “ndb_config — Extrair informações de configuração do NDB Cluster”.

* **tabela transporter_details ndbinfo.** Esta tabela `ndbinfo` fornece informações sobre os transportadores individuais utilizados em um clúster NDB. Adicionada no NDB 8.0.37, é, de outra forma, semelhante à tabela `ndbinfo` `transporters`.

Várias colunas adicionais foram adicionadas a esta tabela no NDB 8.0.38. Elas estão listadas aqui:

+ `sendbuffer_used_bytes`
  + `sendbuffer_max_used_bytes`
  + `sendbuffer_alloc_bytes`
  + `sendbuffer_max_alloc_bytes`
  + `type`

Consulte a Seção 25.6.16.64, “A tabela transporter_details ndbinfo”, para obter mais informações.

* **Dimensionamento do cache de transações de registro binário.** `NDB` 8.0.40 adiciona a variável de sistema do servidor `ndb_log_cache_size`, o que permite definir o tamanho do cache de transações usado para gravar o registro binário. Isso permite o uso de um cache grande para registrar transações NDB e, (usando `binlog_cache_size`) um cache menor para registrar outras transações, tornando assim um uso mais eficiente dos recursos.

* **Depreciação do arquivo Ndb.cfg.** O uso de um arquivo `Ndb.cfg` para definir a string de conexão para um processo NDB não foi bem documentado ou suportado. A partir do NDB 8.0.40, o uso deste arquivo é agora formalmente depreciado; você deve esperar que o suporte a ele seja removido em uma futura versão do MySQL Cluster.

O MySQL Cluster Manager oferece suporte ao NDB Cluster 8.0. O MySQL Cluster Manager possui uma interface avançada de linha de comando que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 8.0.43 para obter mais informações.

### 25.2.5 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 8.0

* Parâmetros Introduzidos no NDB 8.0
* Parâmetros Descontinuados no NDB 8.0
* Parâmetros Retirados no NDB 8.0
* Opções e Variáveis Introduzidas no NDB 8.0
* Opções e Variáveis Descontinuadas no NDB 8.0
* Opções e Variáveis Retiradas no NDB 8.0

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB **mysqld** que foram adicionadas, descontinuadas ou removidas do NDB 8.0.

#### Parâmetros Introduzidos no NDB 8.0

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 8.0.

* `AllowUnresolvedHostNames`: Quando falso (padrão), a falha do nó de gerenciamento em resolver o nome do host resulta em erro fatal; quando verdadeiro, os nomes de host não resolvidos são relatados apenas como avisos. Adicionado no NDB 8.0.22.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas no nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10. Adicionado no NDB 8.0.42.

* `AutomaticThreadConfig`: Use configuração automática de fio; substitui quaisquer configurações para ThreadConfig e MaxNoOfExecutionThreads, e desativa ClassicFragmentation. Adicionada no NDB 8.0.23.

* `ClassicFragmentation`: Quando verdadeiro, use fragmentação tradicional de tabela; defina como falso para habilitar a distribuição flexível dos fragmentos entre LDMs. Desabilitada por AutomaticThreadConfig. Adicionada no NDB 8.0.23.

* `DiskDataUsingSameDisk`: Defina como falso se as tabelaspaces de dados do disco estiverem localizadas em discos físicos separados. Adicionado no NDB 8.0.19.

* `EnableMultithreadedBackup`: Habilitar backup multi-threaded. Adicionado no NDB 8.0.16.

* `EncryptedFileSystem`: Criptografar arquivos de ponto de verificação local e tablespace. Adicionada no NDB 8.0.29.

* `KeepAliveSendInterval`: Tempo entre os sinais de manutenção de vida em links entre nós de dados, em milissegundos. Definido como 0 para desativar. Adicionado no NDB 8.0.27.

* `MaxDiskDataLatency`: Latência média máxima permitida de acesso ao disco (ms) antes de começar a abortar as transações. Adicionada no NDB 8.0.19.

* `NodeGroupTransporters`: Número de transportadores a serem usados entre nós no mesmo grupo de nós. Adicionado no NDB 8.0.20.

* `NumCPUs`: Especifique o número de CPUs a serem usadas com AutomaticThreadConfig. Adicionado no NDB 8.0.23.

* `PartitionsPerNode`: Determina o número de partições de tabela criadas em cada nó de dados; não é usado se a ClassicFragmentation estiver habilitada. Adicionada no NDB 8.0.23.

* `PreferIPVersion`: Indique a preferência do resolutor DNS para a versão 4 ou 6 do IP. Adicionada no NDB 8.0.26.

* `RequireEncryptedBackup`: Se os backups devem ser criptografados (1 = criptografia necessária, caso contrário 0). Adicionado no NDB 8.0.22.

* `ReservedConcurrentIndexOperations`: Número de operações de índice simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedConcurrentOperations`: Número de operações simultâneas com recursos dedicados em coordenadores de transação em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedConcurrentScans`: Número de varreduras simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedConcurrentTransactions`: Número de transações simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedFiredTriggers`: Número de gatilhos com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedLocalScans`: Número de varreduras de fragmentos simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

* `ReservedTransactionBufferMemory`: Espaço dinâmico de buffer (em bytes) para dados de chave e atributo alocados para cada nó de dados. Adicionado no NDB 8.0.16.

* `SpinMethod`: Determina o método de rotação usado pelo nó de dados; consulte a documentação para detalhes. Adicionada no NDB 8.0.20.

* `TcpSpinTime`: Tempo para girar antes de dormir ao receber. Adicionado no NDB 8.0.20.

* `TransactionMemory`: Memória alocada para transações em cada nó de dados. Adicionada no NDB 8.0.19.

#### Parâmetros descontinuados no NDB 8.0

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 8.0.

* `BatchSizePerLocalScan`: Usado para calcular o número de registros de bloqueio para varredura com bloqueio de retenção. Desatualizado no NDB 8.0.19.

* `MaxAllocate`: Não é mais utilizado; não tem efeito. Descontinuado no NDB 8.0.27.

* `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados. Desatualizado no NDB 8.0.19.

* `MaxNoOfConcurrentTransactions`: Número máximo de transações que podem ser executadas simultaneamente neste nó de dados. O número total de transações que podem ser executadas simultaneamente é este valor vezes o número de nós de dados no clúster. Desatualizado no NDB 8.0.19.

* `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser disparados simultaneamente em um nó de dados. Desatualizado no NDB 8.0.19.

* `MaxNoOfLocalOperations`: Número máximo de registros de operação definidos neste nó de dados. Desatualizado no NDB 8.0.19.

* `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados. Desatualizado no NDB 8.0.19.

* `ReservedTransactionBufferMemory`: Espaço dinâmico de buffer (em bytes) para dados de chave e atributo alocados para cada nó de dados. Desatualizado no NDB 8.0.19.

* `UndoDataBuffer`: Desutilizado; não tem efeito. Descontinuado no NDB 8.0.27.

* `UndoIndexBuffer`: Desutilizado; não tem efeito. Descontinuado no NDB 8.0.27.

#### Parâmetros removidos no NDB 8.0

Nenhum parâmetro de configuração de nó foi removido no NDB 8.0.

#### Opções e Variáveis Introduzidas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_replica`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_replica`: Número de envios adaptativos com o conjunto de envio forçado enviado por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_replica`: Número de envios adaptativos sem envios forçados enviados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_replica`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta replica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_replica`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_replica`: Número de operações com base em ou que utilizam chaves primárias por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_replica`: Número de varreduras que foram reduzidas a uma partição por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_replica`: Número de varreduras de intervalo que foram iniciadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_replica`: Número de lotes de linhas recebidos por esta réplica. Adicionado em NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_replica`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_replica`: Número de transações abortadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_replica`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_replica`: Número de transações realizadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_replica`: Número de transações iniciadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_replica`: Número de operações com base em ou que utilizam chaves únicas por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_replica`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica. Foi adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_replica`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_replica`: Tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_replica`: Número de vezes que o fio foi bloqueado enquanto aguardava um sinal baseado em varredura por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_config_generation`: Número de geração da configuração atual do clúster. Adicionada no NDB 8.0.24-ndb-8.0.24.

* `Ndb_conflict_fn_max_del_win_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX_DEL_WIN_INS() foi aplicada em operações de inserção. Adicionada no NDB 8.0.30-ndb-8.0.30.

* `Ndb_conflict_fn_max_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base na "maior marcação de tempo vence" foi aplicada em operações de inserção. Adicionada no NDB 8.0.30-ndb-8.0.30.

* `Ndb_fetch_table_stats`: Número de vezes que as estatísticas da tabela foram obtidas das tabelas em vez do cache. Foi adicionado no NDB 8.0.27-ndb-8.0.27.

* `Ndb_metadata_blacklist_size`: Número de objetos de metadados NDB que o NDB binlog não conseguiu sincronizar; renomeado no NDB 8.0.22 como Ndb_metadata_excluded_count. Adicionado no NDB 8.0.18-ndb-8.0.18.

* `Ndb_metadata_detected_count`: Número de vezes que o monitor de alterações de metadados do NDB detectou alterações. Adicionado no NDB 8.0.16-ndb-8.0.16.

* `Ndb_metadata_excluded_count`: Número de objetos de metadados NDB que o NDB binlog thread não conseguiu sincronizar. Adicionado no NDB 8.0.18-ndb-8.0.22.

* `Ndb_metadata_synced_count`: Número de objetos de metadados NDB que foram sincronizados. Adicionado no NDB 8.0.18-ndb-8.0.18.

* `Ndb_trans_hint_count_session`: Número de transações que utilizam dicas que foram iniciadas nesta sessão. Adicionado em NDB 8.0.17-ndb-8.0.17.

* `ndb-applier-allow-skip-epoch`: Permite que o aplicativo de replicação ignore épocas. Adicionado no NDB 8.0.28-ndb-8.0.28.

* `ndb-log-fail-terminate`: Finalize o processo mysqld se a registro completo de todos os eventos das linhas encontradas não for possível. Adicionada no NDB 8.0.21-ndb-8.0.21.

* `ndb-log-transaction-dependency`: Faça com que o thread de registro binário calcule as dependências das transações para cada transação que escreva no registro binário. Foi adicionado no NDB 8.0.33-ndb-8.0.33.

* `ndb-schema-dist-timeout`: Quanto tempo esperar antes de detectar o tempo de espera durante a distribuição do esquema. Foi adicionado no NDB 8.0.17-ndb-8.0.17.

* `ndb_conflict_role`: Papel que a replica deve desempenhar na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de replicação SQL é interrompido. Consulte a documentação para obter mais informações. Adicionado no NDB 8.0.23-ndb-8.0.23.

* `ndb_dbg_check_shares`: Verifique se há ações persistentes (apenas builds de depuração). Adicionada no NDB 8.0.13-ndb-8.0.13.

* `ndb_log_transaction_compression`: Se comprimir o log binário do NDB; também pode ser habilitado na inicialização ao habilitar a opção --binlog-transaction-compression. Adicionada no NDB 8.0.31-ndb-8.0.31.

* `ndb_log_transaction_compression_level_zstd`: O nível de compressão ZSTD a ser usado ao escrever transações comprimidas no log binário NDB. Adicionado no NDB 8.0.31-ndb-8.0.31.

* `ndb_metadata_check`: Habilitar a detecção automática de mudanças de metadados NDB em relação ao dicionário de dados MySQL; habilitado por padrão. Adicionado no NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_check_interval`: Intervalo em segundos para realizar verificação de mudanças de metadados do NDB em relação ao dicionário de dados do MySQL. Foi adicionado no NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_sync`: Desenha a sincronização imediata de todas as alterações entre o dicionário NDB e o dicionário de dados MySQL; faz com que os valores de ndb_metadata_check e ndb_metadata_check_interval sejam ignorados. Redefinido para falso quando a sincronização estiver completa. Adicionado no NDB 8.0.19-ndb-8.0.19.

* `ndb_replica_batch_size`: Tamanho do lote em bytes para o aplicativo replicador. Foi adicionado no NDB 8.0.30-ndb-8.0.30.

* `ndb_schema_dist_lock_wait_timeout`: Tempo durante a distribuição do esquema para esperar por bloqueio antes de retornar o erro. Foi adicionado no NDB 8.0.18-ndb-8.0.18.

* `ndb_schema_dist_timeout`: Tempo de espera antes de detectar o tempo de espera durante a distribuição do esquema. Adicionado no NDB 8.0.16-ndb-8.0.16.

* `ndb_schema_dist_upgrade_allowed`: Permitir atualização da tabela de distribuição do esquema ao se conectar ao NDB. Foi adicionado no NDB 8.0.17-ndb-8.0.17.

* `ndbinfo`: Habilitar o plugin ndbinfo, se suportado. Adicionado no NDB 8.0.13-ndb-8.0.13.

* `replica_allow_batching`: Ativa e desativa o agrupamento de atualização para replica. Foi adicionado no NDB 8.0.26-ndb-8.0.26.

#### Opções e variáveis descontinuadas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o conjunto de envio forçado enviado por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envios forçados enviados por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_slave`: Número de operações com base em ou que utilizam chaves primárias por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram reduzidas a uma partição por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo que foram iniciadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_slave`: Número de lotes de linhas recebidos por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_slave`: Número de transações realizadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_slave`: Número de operações com base em ou que utilizam chaves únicas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_slave`: O tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava um sinal baseado em varredura por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `Ndb_metadata_blacklist_size`: Número de objetos de metadados NDB que o NDB binlog thread não conseguiu sincronizar; renomeado em NDB 8.0.22 como Ndb_metadata_excluded_count. Desatualizado em NDB 8.0.21-ndb-8.0.21.

* `Ndb_replica_max_replicated_epoch`: Epoch da NDB mais recentemente comprometida nesta replica. Quando esse valor é maior ou igual a Ndb_conflict_last_conflict_epoch, ainda não foram detectados conflitos. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `ndb_slave_conflict_role`: Papel que a replica deve desempenhar na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de replicação SQL é interrompido. Consulte a documentação para obter mais informações. Desatualizado no NDB 8.0.23-ndb-8.0.23.

* `slave_allow_batching`: Ativa e desativa o agrupamento de atualização para replica. Depreendida no NDB 8.0.26-ndb-8.0.26.

#### Opções e variáveis removidas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no NDB 8.0.

* `Ndb_metadata_blacklist_size`: Número de objetos de metadados NDB que o NDB binlog não conseguiu sincronizar; renomeado em NDB 8.0.22 como Ndb_metadata_excluded_count. Removido em NDB 8.0.22-ndb-8.0.22.

### 25.2.6 Servidor MySQL usando InnoDB em comparação com NDB Cluster

O MySQL Server oferece várias opções de motores de armazenamento. Como tanto o `NDB` quanto o `InnoDB` podem servir como motores de armazenamento transacionais do MySQL, os usuários do MySQL Server às vezes se interessam pelo NDB Cluster. Eles veem o `NDB` como uma possível alternativa ou atualização para o motor de armazenamento padrão `InnoDB` no MySQL 8.0. Embora o `NDB` e o `InnoDB` compartilhem características comuns, há diferenças na arquitetura e implementação, de modo que algumas aplicações e cenários de uso existentes do MySQL Server podem ser adequados para o NDB Cluster, mas nem todas.

Nesta seção, discutimos e comparamos algumas características do motor de armazenamento `NDB` usado pelo NDB 8.0 com o `InnoDB` usado no MySQL 8.0. As próximas seções fornecem uma comparação técnica. Em muitos casos, as decisões sobre quando e onde usar o NDB Cluster devem ser tomadas caso a caso, levando em consideração todos os fatores. Embora esteja além do escopo desta documentação fornecer detalhes para cada cenário de uso concebível, também tentamos oferecer alguma orientação muito geral sobre a adequação relativa de alguns tipos comuns de aplicativos para `NDB` em oposição a `InnoDB` backends.

O NDB Cluster 8.0 utiliza um **mysqld** baseado no MySQL 8.0, incluindo suporte para `InnoDB` 1.1. Embora seja possível usar tabelas `InnoDB` com o NDB Cluster, essas tabelas não são agrupadas. Também não é possível usar programas ou bibliotecas de uma distribuição do NDB Cluster 8.0 com o MySQL Server 8.0, ou vice-versa.

Embora também seja verdade que alguns tipos de aplicações comerciais comuns podem ser executados tanto no NDB Cluster quanto no MySQL Server (com maior probabilidade usando o mecanismo de armazenamento `InnoDB`), existem algumas diferenças importantes de arquitetura e implementação. A Seção 25.2.6.1, “Diferenças entre os mecanismos de armazenamento NDB e InnoDB”, fornece um resumo dessas diferenças. Devido às diferenças, alguns cenários de uso são claramente mais adequados para um motor ou outro; veja a Seção 25.2.6.2, “Carga de trabalho NDB e InnoDB”. Isso, por sua vez, tem um impacto nos tipos de aplicações que são mais adequados para uso com `NDB` ou `InnoDB`. Consulte a Seção 25.2.6.3, “Resumo do uso de recursos NDB e InnoDB”, para uma comparação da adequação relativa de cada um para uso em tipos comuns de aplicações de banco de dados.

Para informações sobre as características relativas dos motores de armazenamento `NDB` e `MEMORY`, consulte Quando usar MEMÓRIA ou NDB Cluster.

Consulte o Capítulo 18, *Motores de Armazenamento Alternativos*, para obter informações adicionais sobre os motores de armazenamento do MySQL.

#### 25.2.6.1 Diferenças entre os motores de armazenamento NDB e InnoDB

O motor de armazenamento `NDB` é implementado usando uma arquitetura distribuída e sem compartilhamento, o que faz com que ele se comporte de maneira diferente do `InnoDB` de várias maneiras. Para aqueles não acostumados a trabalhar com `NDB`, comportamentos inesperados podem surgir devido à sua natureza distribuída em relação a transações, chaves estrangeiras, limites de tabela e outras características. Isso é mostrado na tabela a seguir:

**Tabela 25.2 Diferenças entre os motores de armazenamento InnoDB e NDB**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Feature</th> <th scope="col"><code>InnoDB</code> (MySQL 8.0)</th> <th scope="col"><code>NDB</code> 8.0</th> </tr></thead><tbody><tr> <th scope="row">MySQL Server Version</th> <td>8.0</td> <td>8.0</td> </tr><tr> <th scope="row"><code>InnoDB</code> Version</th> <td><code>InnoDB</code> 8.0.44</td> <td><code>InnoDB</code> 8.0.44</td> </tr><tr> <th scope="row">NDB Cluster Version</th> <td>N/A</td> <td><code>NDB</code> 8.0.44/8.0.44</td> </tr><tr> <th scope="row">Storage Limits</th> <td>64TB</td> <td>128TB</td> </tr><tr> <th scope="row">Foreign Keys</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Transactions</th> <td>All standard types</td> <td><code>READ COMMITTED</code></td> </tr><tr> <th scope="row">MVCC</th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Compressão de dados</th> <td>Sim</td> <td>Não (os arquivos de verificação e de backup do NDB podem ser comprimidos)</td> </tr><tr> <th scope="row">Suporte para linhas grandes (&gt; 14K)</th> <td>Suportado para<code>VARBINARY</code>,<code>VARCHAR</code>,<code>BLOB</code>, e<code>TEXT</code>colunas</td> <td>Suportado para<code>BLOB</code>e<code>TEXT</code>colunas apenas (Usar esses tipos para armazenar grandes quantidades de dados pode reduzir o desempenho do NDB)</td> </tr><tr> <th scope="row">Suporte à replicação</th> <td>Replicação assíncrona e semiesincrônica usando MySQL Replication; MySQL<a class="link" href="group-replication.html" title="Chapter 20 Group Replication">Replicação em grupo</a></td> <td>Replicação síncrona automática dentro de um NDB Cluster; replicação assíncrona entre NDB Clusters, usando MySQL Replication (A replicação semi-síncrona não é suportada)</td> </tr><tr> <th scope="row">Escalabilidade para operações de leitura</th> <td>Sim (Replicação MySQL)</td> <td>Sim (partição automática no NDB Cluster; Replicação do NDB Cluster)</td> </tr><tr> <th scope="row">Escalabilidade para operações de escrita</th> <td>Requer particionamento de nível de aplicativo (arqueamento)</td> <td>Sim (a partição automática no NDB Cluster é transparente para as aplicações)</td> </tr><tr> <th scope="row">Disponibilidade Alta (HA)</th> <td>Incorporado, do clúster InnoDB</td> <td>Sim (Projetado para 99,999% de tempo de atividade)</td> </tr><tr> <th scope="row">Recuperação de falha no nó e failover</th> <td>Do Grupo de Replicação MySQL</td> <td>Automático (elemento chave na arquitetura NDB)</td> </tr><tr> <th scope="row">Tempo para recuperação em caso de falha no nó</th> <td>30 segundos ou mais</td> <td>Normalmente &lt; 1 segundo</td> </tr><tr> <th scope="row">Real-Time Performance</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">Tabelas de Memória</th> <td>Não</td> <td>Sim (alguns dados podem ser armazenados opcionalmente em disco; tanto o armazenamento de dados em memória quanto o armazenamento de dados em disco são duráveis)</td> </tr><tr> <th scope="row">Acesso a motores de armazenamento NoSQL</th> <td>Sim</td> <td>Sim (Múltiplas APIs, incluindo Memcached, Node.js/JavaScript, Java, JPA, C++ e HTTP/REST)</td> </tr><tr> <th scope="row">Escritas concorrentes e paralelas</th> <td>Sim</td> <td>Até 48 escritores, otimizados para gravações concorrentes</td> </tr><tr> <th scope="row">Detecção e resolução de conflitos (múltiplas fontes)</th> <td>Sim (Replicação do Grupo MySQL)</td> <td>Sim</td> </tr><tr> <th scope="row">Hash Indexes</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">Adição online de nós</th> <td>Leia/escreva réplicas usando o MySQL Group Replication</td> <td>Sim (todos os tipos de nó)</td> </tr><tr> <th scope="row">Online Upgrades</th> <td>Yes (using replication)</td> <td>Yes</td> </tr><tr> <th scope="row">Modificações de esquema online</th> <td>Sim, como parte do MySQL 8.0</td> <td>Sim</td> </tr></tbody></table>

#### 25.2.6.2 Cargas de trabalho NDB e InnoDB

O NDB Cluster possui uma série de atributos únicos que o tornam ideal para atender aplicações que exigem alta disponibilidade, rápida recuperação, alto desempenho e baixa latência. Devido à sua arquitetura distribuída e implementação de vários nós, o NDB Cluster também possui restrições específicas que podem impedir o bom desempenho de algumas cargas de trabalho. Várias diferenças importantes no comportamento entre os motores de armazenamento `NDB` e `InnoDB` em relação a alguns tipos comuns de cargas de trabalho de aplicativos baseados em banco de dados são mostradas na tabela a seguir:

**Tabela 25.3 Diferenças entre os motores de armazenamento InnoDB e NDB, tipos comuns de cargas de trabalho de aplicativos baseados em dados.**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Workload</th> <th scope="col"><code>InnoDB</code></th> <th scope="col">NDB Cluster (<code>NDB</code>)</th> </tr></thead><tbody><tr> <th scope="row">High-Volume OLTP Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Aplicações DSS (data marts, análises)</th> <td>Sim</td> <td>Limitações (Operações de junção em conjuntos de dados OLTP que não excedam 3 TB de tamanho)</td> </tr><tr> <th scope="row">Custom Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Aplicações embaladas</th> <td>Sim</td> <td>Limitações (deve ser acesso principalmente em chave primária); o NDB Cluster 8.0 suporta chaves estrangeiras</td> </tr><tr> <th scope="row">Aplicações de telecomunicações na rede (HLR, HSS, SDP)</th> <td>Não</td> <td>Sim</td> </tr><tr> <th scope="row">Session Management and Caching</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">E-Commerce Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">User Profile Management, AAA Protocol</th> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

#### 25.2.6.3 Resumo do uso de recursos do NDB e do InnoDB

Ao comparar os requisitos de recursos do aplicativo com as capacidades do `InnoDB` com o `NDB`, alguns são claramente mais compatíveis com um motor de armazenamento do que com o outro.

A tabela a seguir lista as funcionalidades de aplicativos suportados de acordo com o mecanismo de armazenamento ao qual cada funcionalidade é tipicamente mais adequada.

**Tabela 25.4 Características de aplicativos suportados de acordo com o mecanismo de armazenamento ao qual cada característica é tipicamente mais adequada**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Requisitos de aplicação preferidos para<code>InnoDB</code></th> <th>Requisitos de aplicação preferidos para<code>NDB</code></th> </tr></thead><tbody><tr> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Chaves estrangeiras</p> <div class="note" style="margin-left: 0.5in; margin-right: 0.5in;"> <div class="admon-title">Nota</div> <p>O NDB Cluster 8.0 suporta chaves estrangeiras</p> </div> </li><li class="listitem"><p>Análises completas da tabela</p></li><li class="listitem"><p>Grandes bancos de dados, linhas ou transações muito grandes</p></li><li class="listitem"><p>Transações que não são<code>READ COMMITTED</code> </p></li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Escreva escalonamento</p></li><li class="listitem"><p>99,999% de tempo de atividade</p></li><li class="listitem"><p>Adição online de nós e operações online de esquema</p></li><li class="listitem"><p>Múltiplas APIs SQL e NoSQL (consulte APIs do NDB Cluster: Visão geral e conceitos)</p></li><li class="listitem"><p>Desempenho em tempo real</p></li><li class="listitem"><p>Uso limitado de<code>BLOB</code>colunas</p></li><li class="listitem"><p>As chaves estrangeiras são suportadas, embora seu uso possa ter um impacto no desempenho em alta taxa de transferência.</p></li></ul> </div> </td> </tr></tbody></table>

### 25.2.7 Limitações conhecidas do NDB Cluster

Nas seções a seguir, discutimos as limitações conhecidas nas versões atuais do NDB Cluster em comparação com as funcionalidades disponíveis ao usar os motores de armazenamento `MyISAM` e `InnoDB`. Se você verificar a categoria “Cluster” no banco de bugs do MySQL em <http://bugs.mysql.com>, poderá encontrar bugs conhecidos nas seguintes categorias sob “Servidor MySQL:” no banco de bugs do MySQL em <http://bugs.mysql.com>, que pretendemos corrigir nas próximas versões do NDB Cluster:

* NDB Cluster
* API Direta do Cluster (NDBAPI)
* Dados de Disco do Cluster
* Replicação do Cluster
* ClusterJ

Essas informações são destinadas a ser completas em relação às condições que acabamos de estabelecer. Você pode relatar quaisquer discrepâncias que encontrar no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Qualquer problema que não planejamos corrigir no NDB Cluster 8.0 é adicionado à lista.

Consulte a Seção 25.2.7.11, “Problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0”, para uma lista de problemas em versões anteriores que foram resolvidos no NDB Cluster 8.0.

Nota

As limitações e outros problemas específicos da Replicação de NDB Cluster são descritos na Seção 25.7.3, “Problemas Conhecidos na Replicação de NDB Cluster”.

#### 25.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certas funcionalidades do MySQL produzem erros quando usadas com as tabelas `NDB`, conforme descrito na lista a seguir:

* **Tabelas temporárias.** As tabelas temporárias não são suportadas. Tentar criar uma tabela temporária que use o mecanismo de armazenamento `NDB` ou alterar uma tabela temporária existente para usar `NDB` falha com o erro: O mecanismo de armazenamento de tabela 'ndbcluster' não suporta a opção 'TEMPORARY'.

* **Indekses e chaves em tabelas NDB.** Chaves e índices em tabelas do NDB Cluster estão sujeitos às seguintes limitações:

+ **Largura da coluna.** Tentativa de criar um índice em uma coluna de tabela `NDB` cuja largura é maior que 3072 bytes é rejeitada com `ER_TOO_LONG_KEY`: A chave especificada foi muito longa; o comprimento máximo da chave é de 3072 bytes.

Tentar criar um índice em uma coluna de tabela `NDB` cujo comprimento é maior que 3056 bytes tem sucesso com um aviso. Nesses casos, as informações estatísticas não são geradas, o que significa que um plano de execução não ótimo pode ser selecionado. Por esse motivo, você deve considerar fazer o comprimento do índice mais curto que 3056 bytes, se possível.

+ **Colunas TEXT e BLOB.** Não é possível criar índices nas colunas da tabela `NDB` que utilizem qualquer um dos tipos de dados `TEXT` ou `BLOB`.

+ **Indekses FULLTEXT.** O motor de armazenamento `NDB` não suporta índices `FULLTEXT`, que são possíveis apenas para as tabelas `MyISAM` e `InnoDB`.

No entanto, você pode criar índices nas colunas de `VARCHAR` das tabelas de `NDB`.

+ **USANDO CHAVES HASH e NULL.** Usar colunas nulas em chaves únicas e chaves primárias significa que as consultas que utilizam essas colunas são tratadas como varreduras completas da tabela. Para contornar esse problema, faça a coluna `NOT NULL`, ou recrie o índice sem a opção `USING HASH`.

+ **Prefixos. Não há índices de prefixo; apenas colunas inteiras podem ser indexadas. (O tamanho de um índice de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também a Seção 25.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”, para informações adicionais.)

+ Colunas BIT. Uma coluna `BIT` não pode ser uma chave primária, chave única ou índice, nem pode fazer parte de uma chave primária composta, chave única ou índice.

+ Colunas **AUTO_INCREMENT.** Como outros motores de armazenamento do MySQL, o motor de armazenamento `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem chave primária explícita, uma coluna `AUTO_INCREMENT` é definida automaticamente e usada como uma chave primária "oculta". Por esse motivo, você não pode criar uma tabela `NDB` com uma coluna `AUTO_INCREMENT` e sem chave primária explícita.

As seguintes declarações `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") não funcionam, conforme mostrado aqui:

    ```
    # No index on AUTO_INCREMENT column; table has no primary key
    # Raises ER_WRONG_AUTO_KEY
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT
        ->     )
        -> ENGINE=NDB;
    ERROR 1075 (42000): Incorrect table definition; there can be only one auto
    column and it must be defined as a key

    # Index on AUTO_INCREMENT column; table has no primary key
    # Raises NDB error 4335
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    ERROR 1296 (HY000): Got error 4335 'Only one autoincrement column allowed per
    table. Having a table without primary key uses an autoincr' from NDBCLUSTER
    ```

A seguinte declaração cria uma tabela com uma chave primária, uma coluna `AUTO_INCREMENT` e um índice nesta coluna, e tem sucesso:

    ```
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrições para chaves estrangeiras.** O suporte para restrições de chave estrangeira no NDB 8.0 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

+ Toda coluna referenciada como chave estrangeira requer uma chave única explícita, se não for a chave primária da tabela.

+ `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

Isso ocorre porque uma atualização de uma chave primária é implementada como uma exclusão da linha antiga (contendo a chave primária antiga) mais uma inserção da nova linha (com uma nova chave primária). Isso não é visível para o kernel `NDB`, que considera essas duas linhas como sendo a mesma, e, portanto, não tem como saber que essa atualização deve ser cascada.

+ `ON DELETE CASCADE` também não é suportado quando a tabela de crianças contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

+ `SET DEFAULT` não é suportado. (Também não é suportado por `InnoDB`.).

+ A palavra-chave `NO ACTION` é aceita, mas tratada como `RESTRICT`. `NO ACTION`, que é uma palavra-chave padrão do SQL, é o padrão no MySQL 8.0. (Também o mesmo que com `InnoDB`.

+ Em versões anteriores do NDB Cluster, ao criar uma tabela com chave estrangeira referenciando um índice em outra tabela, às vezes parecia possível criar a chave estrangeira mesmo que a ordem das colunas nos índices não combinasse, devido ao fato de que um erro apropriado não sempre era retornado internamente. Uma correção parcial para esse problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que essa situação ocorra no caso de o índice pai ser um índice único. (Bug #18094360)

Para mais informações, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”, e a Seção 1.6.3.2, “Restrições de Chave Estrangeira”.

* **Tipos de dados de clúster e geometria do NDB.** Os tipos de dados de geometria (`WKT` e `WKB`) são suportados para as tabelas `NDB`. No entanto, os índices espaciais não são suportados.

* **Conjunto de caracteres e arquivos de registro binário.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o conjunto de caracteres `latin1` (ASCII). Como os nomes dos arquivos de registro binário são registrados nesta tabela, os arquivos de registro binário com nomes que usam caracteres não latinos não são referenciados corretamente nessas tabelas. Este é um problema conhecido, e estamos trabalhando para corrigi-lo. (Bug #50226)

Para contornar esse problema, use apenas caracteres latinos ao nomear arquivos de registro binários ou ao definir qualquer uma das opções `--basedir`, `--log-bin` ou `--log-bin-index`.

* **Criando tabelas NDB com particionamento definido pelo usuário.**

O suporte para partição definida pelo usuário no NDB Cluster é restrito à partição `LINEAR`] `KEY` . O uso de qualquer outro tipo de partição com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma declaração `CREATE TABLE` resulta em um erro.

É possível ignorar essa restrição, mas isso não é suportado para uso em configurações de produção. Para obter detalhes, consulte "Particionamento definido pelo usuário e o motor de armazenamento NDB (NDB Cluster)").

**Scheme de particionamento padrão.** Todas as tabelas do NDB Cluster são, por padrão, particionadas por `KEY` usando a chave primária da tabela como chave de particionamento. Se nenhuma chave primária for explicitamente definida para a tabela, a chave primária “oculta” criada automaticamente pelo motor de armazenamento `NDB` é usada em vez disso. Para uma discussão adicional sobre essas e questões relacionadas, consulte a Seção 26.2.5, “Particionamento por CHAVE”.

`CREATE TABLE` e `ALTER TABLE` declarações que causariam uma tabela `NDBCLUSTER` particionada pelo usuário a não atender a um dos dois requisitos ou a ambos não são permitidas e falham com um erro:

1. A tabela deve ter uma chave primária explícita.  
2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDBCLUSTER` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`, então não é necessário uma chave primária explícita.

**Número máximo de partições para tabelas NDBCLUSTER.** O número máximo de partições que podem ser definidas para uma tabela `NDBCLUSTER` ao empregar partição definida pelo usuário é de 8 por grupo de nós. (Consulte a Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nós, Replicatas de Fragmento e Partições”, para obter mais informações sobre os grupos de nós do NDB Cluster.

**DROP PARTITION não é suportada.** Não é possível descartar partições das tabelas do `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de particionamento para as tabelas do `ALTER TABLE`—(alter-table.html "15.1.9 ALTER TABLE Statement")—`ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION`—são suportadas para tabelas NDB, mas utilizam cópia e, portanto, não são otimizadas. Veja a Seção 26.3.1, “Gestão de Partições RANGE e LIST” e a Seção 15.1.9, “Instrução ALTER TABLE”.

**Seleção de partição.** A seleção de partição não é suportada para as tabelas `NDB`. Consulte a Seção 26.5, “Seleção de partição”, para obter mais informações.

* **Tipo de dados JSON.** O tipo de dados `JSON` do MySQL é suportado para as tabelas `NDB` no **mysqld** fornecido com o NDB 8.0.

Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

A API do NDB não possui nenhuma disposição especial para trabalhar com dados do `JSON`, que ela considera simplesmente dados do `BLOB`. O tratamento dos dados como `JSON` deve ser realizado pelo aplicativo.

* **Expressões de valor padrão.** Expressões de valor padrão explícitas (como implementadas no MySQL 8.0.34 e versões posteriores) para as definições de coluna da tabela `NDB` não são suportadas. Isso significa, por exemplo, que a seguinte declaração `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") é rejeitada com um erro:

  ```
  mysql> CREATE TABLE t (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   cf FLOAT DEFAULT (RAND() * 10)
      -> ) ENGINE=NDBCLUSTER;
  ERROR 3774 (HY000): 'Specified storage engine' is not supported for default value expressions.
  ```

O NDBC Cluster suporta valores de coluna padrão literários, como mostrado aqui:

  ```
  mysql> CREATE TABLE t3 (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   ci INT DEFAULT 0,
      ->   cv VARCHAR(20) DEFAULT ''
      -> ) ENGINE=NDBCLUSTER;
  Query OK, 0 rows affected (0.17 sec)
  ```

Para mais informações, consulte a Seção 13.6, “Valores padrão do tipo de dados”.

#### 25.2.7.2 Limites e Diferenças do NDB Cluster em relação aos Limites do MySQL Padrão

Nesta seção, listamos os limites encontrados no NDB Cluster que diferem dos limites encontrados no MySQL padrão ou que não são encontrados no MySQL padrão.

**Uso e recuperação da memória.** A memória consumida quando os dados são inseridos em uma tabela `NDB` não é recuperada automaticamente quando excluída, como acontece com outros motores de armazenamento. Em vez disso, as seguintes regras se aplicam:

* Uma declaração `DELETE` em uma tabela `NDB` torna a memória anteriormente utilizada pelas linhas excluídas disponível para reutilização por inserções na mesma tabela. No entanto, essa memória pode ser disponibilizada para reutilização geral realizando `OPTIMIZE TABLE`.

Um reinício contínuo do clúster também libera toda a memória usada por linhas excluídas. Veja a Seção 25.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

* Uma operação `DROP TABLE` ou `TRUNCATE TABLE` em uma tabela `NDB` libera a memória que foi usada por esta tabela para reutilização por qualquer tabela `NDB`, seja pela mesma tabela ou por outra tabela `NDB`.

Nota

Lembre-se de que `TRUNCATE TABLE` exclui e recria a tabela. Veja a Seção 15.1.37, “Instrução TRUNCATE TABLE”.

* **Limites impostos pela configuração do cluster.** Existem vários limites rígidos que são configuráveis, mas a memória principal disponível no cluster define os limites. Consulte a lista completa dos parâmetros de configuração na Seção 25.4.3, "Arquivos de configuração do NDB Cluster". A maioria dos parâmetros de configuração pode ser atualizada online. Esses limites rígidos incluem:

+ Tamanho da memória do banco de dados e tamanho da memória do índice (`DataMemory` e `IndexMemory`, respectivamente).

`DataMemory` é alocado como páginas de 32 KB. À medida que cada página `DataMemory` é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto por meio da eliminação da tabela.

Veja a Seção 25.4.3.6, “Definindo nós de dados do NDB Cluster”, para mais informações.

+ O número máximo de operações que podem ser realizadas por transação é definido usando os parâmetros de configuração `MaxNoOfConcurrentOperations` e `MaxNoOfLocalOperations`.

Nota

O carregamento em massa, `TRUNCATE TABLE`(truncate-table.html "15.1.37 TRUNCATE TABLE Statement"), e `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") são tratados como casos especiais ao executar várias transações, e, portanto, não estão sujeitos a essa limitação.

+ Diferentes limites relacionados a tabelas e índices. Por exemplo, o número máximo de índices ordenados no clúster é determinado por `MaxNoOfOrderedIndexes`, e o número máximo de índices ordenados por tabela é 16.

* **Máximos de nós e objetos de dados.** Os seguintes limites se aplicam ao número de nós de cluster e objetos de metadados:

+ O número máximo de nós de dados é de 144. (No NDB 7.6 e versões anteriores, esse número era de 48.)

Um nó de dados deve ter um ID de nó no intervalo de 1 a 144, inclusive.

Os nós de gerenciamento e API podem usar IDs de nó no intervalo de 1 a 255, inclusive.

+ O número máximo total de nós em um NDB Cluster é de 255. Esse número inclui todos os nós SQL (servidores MySQL), nós API (aplicações que acessam o clúster, exceto servidores MySQL), nós de dados e servidores de gerenciamento.

+ O número máximo de objetos de metadados nas versões atuais do NDB Cluster é 20320. Esse limite é codificado de forma rígida.

Consulte a Seção 25.2.7.11, “Problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0”, para obter mais informações.

#### 25.2.7.3 Limites relacionados ao tratamento de transações no NDB Cluster

Há várias limitações no NDB Cluster em relação ao tratamento de transações, incluindo as seguintes:

* Nível de isolamento de transação.

O motor de armazenamento `NDBCLUSTER` suporta apenas o nível de isolamento de transação (innodb-transaction-isolation-levels.html#isolevel_read-committed) `READ COMMITTED`. (O `InnoDB`, por exemplo, suporta `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`). Você deve ter em mente que o `NDB` implementa o `READ COMMITTED` em uma base por linha; quando uma solicitação de leitura chega ao nó de dados que armazena a linha, o que é retornado é a última versão comprometida da linha naquela época.

Os dados não comprometidos nunca são devolvidos, mas quando uma transação que modifica vários registros é comprometida simultaneamente com uma transação que lê os mesmos registros, a transação que realiza a leitura pode observar valores "antes", valores "depois" ou ambos, para diferentes registros entre esses, devido ao fato de que um pedido de leitura de um registro específico pode ser processado antes ou depois do comprometimento da outra transação.

Para garantir que uma transação específica leia apenas antes ou depois dos valores, você pode impor bloqueios de linha usando `SELECT ... LOCK IN SHARE MODE`(select.html "15.2.13 SELECT Statement"). Nesses casos, o bloqueio é mantido até que a transação proprietária seja comprometida. O uso de bloqueios de linha também pode causar os seguintes problemas:

+ Aumento da frequência de erros de tempo de espera de bloqueio e redução da concorrência

+ Aumento do overhead de processamento de transações devido a leituras que exigem uma fase de commit

+ Posssibilidade de esgotar o número disponível de bloqueios concorrentes, que é limitado por `MaxNoOfConcurrentOperations`

`NDB` utiliza `READ COMMITTED` para todas as leituras, a menos que seja usado um modificador como `LOCK IN SHARE MODE` ou `FOR UPDATE`. `LOCK IN SHARE MODE` faz com que as chaves de fila compartilhadas sejam usadas; `FOR UPDATE` faz com que as chaves de fila exclusivas sejam usadas. As leituras de chave única têm suas chaves atualizadas automaticamente por `NDB` para garantir uma leitura autoconsistente; as leituras de `BLOB` também empregam bloqueio adicional para consistência.

Consulte a Seção 25.6.8.4, "Solução de problemas de backup do cluster NDB", para obter informações sobre como a implementação do nível de isolamento de transação do NDB Cluster pode afetar o backup e a restauração dos bancos de dados `NDB`.

* **Transações e colunas BLOB ou TEXT.** `NDBCLUSTER` armazena apenas parte do valor de uma coluna que utiliza qualquer um dos tipos de dados `BLOB` ou `TEXT` da MySQL na tabela visível para a MySQL; o restante do `BLOB` ou `TEXT` é armazenado em uma tabela interna separada que não é acessível para a MySQL. Isso gera dois problemas relacionados dos quais você deve estar ciente sempre que executar declarações `SELECT` em tabelas que contêm colunas desses tipos:

1. Para qualquer `SELECT` de uma tabela de NDB Cluster: Se o `SELECT` incluir uma coluna `BLOB` ou `TEXT`, o nível de isolamento de transação `READ COMMITTED` é convertido para uma leitura com bloqueio de leitura. Isso é feito para garantir a consistência.

2. Para qualquer `SELECT` que utilize uma pesquisa de chave única para recuperar quaisquer colunas que utilizem qualquer um dos tipos de dados `BLOB` ou `TEXT` e que seja executado dentro de uma transação, uma bloqueio de leitura compartilhada é mantido na tabela durante a duração da transação, ou seja, até que a transação seja comprometida ou abortado.

Este problema não ocorre para consultas que utilizam índices ou varreduras de tabela, mesmo contra tabelas `NDB` que possuem colunas `BLOB` ou `TEXT`.

Por exemplo, considere a tabela `t` definida pela seguinte declaração `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement"):

     ```
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

A consulta a seguir sobre `t` causa um bloqueio de leitura compartilhado, porque usa uma pesquisa de chave única:

     ```
     SELECT * FROM t WHERE c = 1;
     ```

No entanto, nenhuma das quatro consultas mostradas aqui causa um bloqueio de leitura compartilhado:

     ```
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

Isso ocorre porque, dessas quatro consultas, a primeira utiliza uma varredura de índice, a segunda e a terceira utilizam varreduras de tabela, e a quarta, embora utilize uma pesquisa de chave primária, não recupera o valor de nenhuma das colunas `BLOB` ou `TEXT`.

Você pode ajudar a minimizar problemas com bloqueios de leitura compartilhada evitando consultas que utilizam pesquisas de chave única que recuperam as colunas `BLOB` ou `TEXT`, ou, nos casos em que essas consultas não podem ser evitadas, realizando transações o mais rápido possível depois.

* **Consultas de chave únicas e isolamento de transações.** Índices únicos são implementados em `NDB` usando uma tabela de índice oculta que é mantida internamente. Quando uma tabela criada pelo usuário `NDB` é acessada usando um índice único, a tabela de índice oculta é lida primeiro para encontrar a chave primária que é então usada para ler a tabela criada pelo usuário. Para evitar a modificação do índice durante essa operação de leitura dupla, a linha encontrada na tabela de índice oculta é bloqueada. Quando uma linha referenciada por um índice único na tabela `NDB` criada pelo usuário é atualizada, a tabela de índice oculta está sujeita a um bloqueio exclusivo pela transação na qual a atualização é realizada. Isso significa que qualquer operação de leitura na mesma tabela (criada pelo usuário) `NDB` deve esperar que a atualização seja concluída. Isso é verdadeiro mesmo quando o nível de transação da operação de leitura é `READ COMMITTED`.

Uma solução que pode ser usada para contornar leituras potencialmente bloqueadoras é forçar o nó SQL a ignorar o índice único ao realizar a leitura. Isso pode ser feito usando a dica de índice `IGNORE INDEX` como parte da declaração `SELECT` que lê a tabela (consulte Seção 10.9.4, “Dicas de índice”). Como o servidor MySQL cria um índice ordenado de sombra para cada índice único criado em `NDB`, isso permite que o índice ordenado seja lido em vez disso, e evita o bloqueio do acesso ao índice único. A leitura resultante é tão consistente quanto uma leitura comprometida por chave primária, retornando o último valor comprometido no momento em que a linha é lida.

A leitura por meio de um índice ordenado utiliza menos recursos no clúster e pode ter maior latência.

Também é possível evitar o uso do índice único para acesso, realizando consultas por intervalos em vez de por valores únicos.

* **Reversões. Não há transações parciais e não há reversões parciais de transações. Uma chave duplicada ou um erro semelhante faz com que toda a transação seja revertida.

Esse comportamento difere do de outros motores de armazenamento transacional, como `InnoDB`, que podem reverter declarações individuais.

* **Transações e uso de memória.** Como mencionado em outros lugares deste capítulo, o NDB Cluster não lida bem com grandes transações; é melhor realizar várias pequenas transações com algumas operações cada uma do que tentar uma única grande transação que contenha muitas operações. Entre outras considerações, grandes transações exigem grandes quantidades de memória. Por isso, o comportamento transacional de vários comandos do MySQL é afetado, conforme descrito na lista a seguir:

+ `TRUNCATE TABLE` não é transacional quando usado em tabelas `NDB`. Se um `TRUNCATE TABLE` não conseguir esvaziar a tabela, ele deve ser executado novamente até que seja bem-sucedido.

+ `DELETE FROM` (mesmo sem a cláusula `WHERE`)* é* transacional. Para tabelas que contêm muitas linhas, você pode notar que o desempenho é melhorado ao usar várias instruções `DELETE FROM ... LIMIT ...` para "dividir" a operação de exclusão. Se o seu objetivo é esvaziar a tabela, então você pode querer usar [[`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement")] ao invés disso.

+ **declarações LOAD DATA.** `LOAD DATA` não é transacional quando usado em tabelas `NDB`.

Importante

Ao executar uma declaração `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement"), o motor `NDB` realiza commits em intervalos irregulares que permitem uma melhor utilização da rede de comunicação. Não é possível saber antecipadamente quando tais commits ocorrem.

+ **ALTER TABLE e transações.** Ao copiar uma tabela `NDB` como parte de um `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), a criação da cópia não é transacional. (Em qualquer caso, essa operação é revertida quando a cópia é excluída.)

* **Transações e a função COUNT().** Ao usar a Replicação do NDB Cluster, não é possível garantir a consistência transacional da função `COUNT()` na replica. Em outras palavras, ao realizar em fonte uma série de declarações (`INSERT`, `DELETE`, ou ambas) que altera o número de linhas em uma tabela dentro de uma única transação, executar consultas `SELECT COUNT(*) FROM table` na replica pode gerar resultados intermediários. Isso ocorre porque `SELECT COUNT(...)` pode realizar leituras sujas e não é um bug no motor de armazenamento `NDB`. (Consulte o Bug #31321 para mais informações.)

#### 25.2.7.4 Gerenciamento de Erros de Agrupamento NDB

Iniciar, parar ou reiniciar um nó pode gerar erros temporários que fazem com que algumas transações falhem. Esses casos incluem os seguintes:

* **Erros temporários.** Ao iniciar um nó pela primeira vez, é possível que você veja o Erro 1204 Falha temporária, distribuição alterada e outros erros temporários semelhantes.

* **Erros devido à falha do nó.** A interrupção ou falha de qualquer nó de dados pode resultar em vários tipos de erros de falha de nó. (No entanto, não deve haver transações abortadas ao realizar uma parada planejada do clúster.)

Em qualquer um desses casos, quaisquer erros gerados devem ser tratados dentro da aplicação. Isso deve ser feito tentando novamente a transação.

Veja também a Seção 25.2.7.2, “Limites e Diferenças do NDB Cluster em Relação aos Limites Padrão do MySQL”.

#### 25.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

Alguns objetos de banco de dados, como tabelas e índices, têm limitações diferentes ao usar o mecanismo de armazenamento `NDBCLUSTER`:

* **Número de objetos do banco de dados.** O número máximo de *todos os* objetos do banco de dados `NDB` em um único NDB Cluster — incluindo bancos de dados, tabelas e índices — é limitado a 20320.

* **Atributos por tabela.** O número máximo de atributos (ou seja, colunas e índices) que podem pertencer a uma determinada tabela é de 512.

* **Atributos por chave.** O número máximo de atributos por chave é de 32.

* **Tamanho da linha.** No NDB 8.0, o tamanho máximo permitido para qualquer uma das linhas é de 30000 bytes (aumentado de 14000 bytes nas versões anteriores).

Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para este total; isso inclui as colunas `JSON`. Consulte os Requisitos de Armazenamento de Tipo de String, bem como os Requisitos de Armazenamento de JSON, para obter mais informações relacionadas a esses tipos.

Além disso, o deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; tentar criar uma tabela que viole essa limitação falha com o erro NDB 851 O máximo deslocamento para colunas de tamanho fixo foi excedido. Para colunas baseadas em memória, você pode contornar essa limitação usando um tipo de coluna de largura variável, como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isso não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode fazer isso reordenando uma ou mais das colunas baseadas em disco da tabela de modo que a largura combinada de todas, exceto a coluna baseada em disco definida na última declaração `CREATE TABLE` usada para criar a tabela, não exceda 8188 bytes, menos qualquer arredondamento possível realizado para alguns tipos de dados, como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar armazenamento baseado em memória para uma ou mais das colunas ou colunas infratoras, em vez disso.

* **Armazenamento de coluna BIT por tabela.** A largura combinada máxima para todas as colunas `BIT` usadas em uma tabela `NDB` dada é de 4096.

* **Armazenamento de coluna FIXO.** O NDB Cluster 8.0 suporta um máximo de 128 TB por fragmento de dados nas colunas `FIXED`.

#### 25.2.7.6 Recursos não suportados ou ausentes no NDB Cluster

Vários recursos suportados por outros motores de armazenamento não são suportados para as tabelas do `NDB`. Tentar usar qualquer um desses recursos no NDB Cluster não causa erros por si só; no entanto, erros podem ocorrer em aplicativos que esperam que os recursos sejam suportados ou aplicados. Declarações que fazem referência a esses recursos, mesmo que efetivamente ignoradas por `NDB`, devem ser sintaticamente e de outra forma válidas.

* **Prefixos de índice.** Prefixo em índices não são suportados para as tabelas `NDB`. Se um prefixo é usado como parte de uma especificação de índice em uma declaração como `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, o prefixo não é criado por `NDB`.

Uma declaração que contenha um prefixo de índice e que crie ou modifique uma tabela `NDB` ainda deve ser sintaticamente válida. Por exemplo, a seguinte declaração sempre falha com Erro 1089 Chave de prefixo incorreta; a parte da chave usada não é uma string, a comprimento usado é maior que a parte da chave, ou o motor de armazenamento não suporta chaves de prefixo únicas, independentemente do motor de armazenamento:

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

Isso acontece devido à regra de sintaxe SQL de que nenhum índice pode ter um prefixo maior que ele mesmo.

* **Pontos de salvamento e recuos.** Pontos de salvamento e recuos para pontos de salvamento são ignorados como em `MyISAM`.

* **Durabilidade dos commits.** Não há commits duráveis no disco. Os commits são replicados, mas não há garantia de que os logs sejam apagados no disco ao commit.

* **Replicação. A replicação baseada em declarações não é suportada. Use `--binlog-format=ROW` (ou `--binlog-format=MIXED`) ao configurar a replicação em cluster. Consulte a Seção 25.7, “Replicação em Cluster NDB”, para obter mais informações.

A replicação usando identificadores de transação global (GTIDs) não é compatível com o NDB Cluster e não é suportada no NDB Cluster 8.0. Não ative GTIDs ao usar o mecanismo de armazenamento `NDB`, pois isso provavelmente causará problemas até o falha da replicação do NDB Cluster.

A replicação semiesincronizada não é suportada no NDB Cluster.

* **Colunas geradas.** O mecanismo de armazenamento `NDB` não suporta índices em colunas virtuais geradas.

Assim como em outros motores de armazenamento, você pode criar um índice em uma coluna gerada armazenada, mas deve ter em mente que `NDB` usa `DataMemory` para armazenamento da coluna gerada, bem como `IndexMemory` para o índice. Veja colunas JSON e indexação indireta no NDB Cluster, para um exemplo.

O NDB Cluster escreve as alterações nas colunas geradas armazenadas no log binário, mas não registra as alterações feitas nas colunas virtuais. Isso não deve afetar a Replicação do NDB Cluster ou a replicação entre `NDB` e outros motores de armazenamento MySQL.

Nota

Consulte a Seção 25.2.7.3, “Limites relacionados ao tratamento de transações no NDB Cluster”, para obter mais informações sobre as limitações relacionadas ao tratamento de transações em `NDB`.

#### 25.2.7.7 Limitações relacionadas ao desempenho no NDB Cluster

Os problemas de desempenho a seguir são específicos ou especialmente pronunciados no NDB Cluster:

* **Análises de intervalo.** Há problemas de desempenho das consultas devido ao acesso sequencial ao mecanismo de armazenamento `NDB`; também é relativamente mais caro realizar muitas análises de intervalo do que com `MyISAM` ou `InnoDB`.

* **Confiabilidade dos registros na faixa.** A estatística `Records in range` está disponível, mas não foi completamente testada ou oficialmente suportada. Isso pode resultar em planos de consulta não ótimos em alguns casos. Se necessário, você pode usar `USE INDEX` ou `FORCE INDEX` para alterar o plano de execução. Consulte a Seção 10.9.4, “Dicas de índice”, para obter mais informações sobre como fazer isso.

* **Indicadores de hash exclusivos.** Indicadores de hash exclusivos criados com `USING HASH` não podem ser usados para acessar uma tabela se `NULL` for fornecido como parte da chave.

#### 25.2.7.8 Questões exclusivas do cluster NDB

As seguintes são limitações específicas do motor de armazenamento `NDB`:

* **Arquitetura da máquina.** Todas as máquinas utilizadas no clúster devem ter a mesma arquitetura. Isso significa que todas as máquinas que hospedam nós devem ser big-endian ou little-endian, e não é possível usar uma mistura de ambas. Por exemplo, não é possível ter um nó de gerenciamento rodando em um PowerPC que direcione um nó de dados que esteja rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente executam **mysql** ou outros clientes que podem estar acessando os nós SQL do clúster.

* **Registro binário.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao registro binário:

+ O NDB Cluster não pode produzir um log binário para tabelas que possuem colunas `BLOB`, mas sem chave primária.

+ Apenas as seguintes operações de esquema são registradas em um log binário de cluster que não está no **mysqld** executando a declaração:

- `CREATE TABLE`
- `ALTER TABLE`
- `DROP TABLE`
- `CREATE DATABASE` / [`CREATE SCHEMA`](create-database.html "15.1.12 CREATE DATABASE Statement")

- `DROP DATABASE` / [`DROP SCHEMA`](drop-database.html "15.1.24 DROP DATABASE Statement")

- `CREATE TABLESPACE`
- `ALTER TABLESPACE`
- `DROP TABLESPACE`
- `CREATE LOGFILE GROUP`
- `ALTER LOGFILE GROUP`
- `DROP LOGFILE GROUP`
* **Operações de esquema. As operações de esquema (declarações DDL) são rejeitadas enquanto qualquer nó de dados é reiniciado. As operações de esquema também não são suportadas durante a realização de uma atualização ou redução online.

* **Número de réplicas de fragmentos.** O número de réplicas de fragmentos, determinado pelo parâmetro de configuração do nó de dados `NoOfReplicas`, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro para 1 significa que há apenas uma única cópia; neste caso, não é fornecida redundância e a perda de um nó de dados implica na perda de dados. Para garantir a redundância e, assim, a preservação dos dados mesmo se um nó de dados falhar, defina este parâmetro para 2, que é o valor padrão e recomendado em produção.

A configuração de `NoOfReplicas` para um valor maior que 2 é suportada (até um máximo de 4), mas é desnecessária para evitar a perda de dados.

Veja também a Seção 25.2.7.10, “Limitações relacionadas a múltiplos nós do cluster NDB”.

#### 25.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB

**Máximos e mínimos dos objetos de dados de disco.** Os objetos de dados de disco estão sujeitos aos seguintes máximos e mínimos:

* Número máximo de espaços de tabela: 232 (4294967296)

* Número máximo de arquivos de dados por espaço de tabela: 216 (65536)

* Os tamanhos mínimos e máximos possíveis dos extensões dos arquivos de dados do espaço de tabela são, respectivamente, 32K e 2G. Consulte a Seção 15.1.21, “Declaração CREATE TABLESPACE”, para obter mais informações.

Além disso, ao trabalhar com tabelas de dados de disco NDB, você deve estar ciente dos seguintes problemas relacionados a arquivos de dados e extensões:

* Os arquivos de dados utilizam `DataMemory`. O uso é o mesmo que para dados em memória.

* Os arquivos de dados utilizam descritores de arquivo. É importante ter em mente que os arquivos de dados estão sempre abertos, o que significa que os descritores de arquivo estão sempre em uso e não podem ser reutilizados para outras tarefas do sistema.

* Os extenções exigem `DiskPageBufferMemory` suficiente; você deve reservar espaço suficiente para que este parâmetro possa contabilizar toda a memória usada por todas as extenções (número de extenções vezes o tamanho das extenções).

Tabelas de dados de disco e modo sem disco. O uso de tabelas de dados de disco não é suportado quando o clúster está em modo sem disco.

#### 25.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB

**Nodos SQL múltiplos.** Os seguintes problemas estão relacionados ao uso de múltiplos servidores MySQL como nós SQL do NDB Cluster e são específicos ao mecanismo de armazenamento `NDBCLUSTER`:

* **Programas armazenados não são distribuídos.** Procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados são todos suportados por tabelas que utilizam o mecanismo de armazenamento `NDB`, mas esses não se propagam automaticamente entre Servidores MySQL que atuam como nós SQL Cluster, e devem ser recriados separadamente em cada nó SQL. Veja Rotinas e gatilhos armazenados no NDB Cluster.

* **Nenhuma bloqueio de tabela distribuído.** Uma declaração `LOCK TABLES` ou chamada `GET_LOCK()` funciona apenas para o nó SQL no qual o bloqueio é emitido; nenhum outro nó SQL no clúster "ve" este bloqueio. Isso é verdade para um bloqueio emitido por qualquer declaração que bloqueie tabelas como parte de suas operações. (Veja o próximo item para um exemplo.)

A implementação de bloqueios de tabela em `NDBCLUSTER` pode ser feita em um aplicativo de API, e garantir que todas as aplicações comecem definindo `LockMode` para `LM_Read` ou `LM_Exclusive`. Para mais informações sobre como fazer isso, consulte a descrição de `NdbOperation::getLockHandle()` no *Guia de API do NDB Cluster*.

* **Operações de ALTER TABLE.** `ALTER TABLE` não está totalmente bloqueado ao executar vários servidores MySQL (nós SQL). (Como discutido no item anterior, o NDB Cluster não suporta bloqueios de tabela distribuídos.)

**Nodos de gerenciamento múltiplos.** Ao usar múltiplos servidores de gerenciamento:

* Se algum dos servidores de gerenciamento estiver rodando no mesmo host, você deve fornecer IDs explícitos aos nós nas conexões, porque a alocação automática de IDs de nó não funciona em múltiplos servidores de gerenciamento no mesmo host. Isso não é necessário se cada servidor de gerenciamento estiver em um host diferente.

* Quando um servidor de gerenciamento é iniciado, ele primeiro verifica se há outros servidores de gerenciamento no mesmo NDB Cluster. Após a conexão bem-sucedida com o outro servidor de gerenciamento, ele utiliza os dados de configuração. Isso significa que as opções de inicialização do servidor de gerenciamento `--reload` e `--initial` são ignoradas, a menos que o servidor de gerenciamento seja o único em execução. Isso também significa que, ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento, o servidor de gerenciamento lê seu próprio arquivo de configuração se (e somente se) ele for o único servidor de gerenciamento em execução neste NDB Cluster. Consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”, para obter mais informações.

**Vários endereços de rede.** Não são suportados vários endereços de rede por nó de dados. O uso desses endereços pode causar problemas: em caso de falha de um nó de dados, um nó SQL espera confirmação de que o nó de dados caiu, mas nunca recebe, pois outra rota para esse nó de dados permanece aberta. Isso pode tornar o clúster inoperável.

Nota

É possível usar várias *interfaces* de hardware de rede (como placas Ethernet) para um único nó de dados, mas essas devem estar vinculadas ao mesmo endereço. Isso também significa que não é possível usar mais de uma seção `[tcp]` por conexão no arquivo `config.ini`. Consulte a Seção 25.4.3.10, “Conexões NDB Cluster TCP/IP”, para obter mais informações.

#### 25.2.7.11 Problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0

Várias limitações e problemas relacionados que existiam em versões anteriores do NDB Cluster foram resolvidos no NDB 8.0. Esses são descritos brevemente na lista a seguir:

* **Nomes de banco de dados e tabelas.** No NDB 7.6 e versões anteriores, ao usar o mecanismo de armazenamento `NDB`, o comprimento máximo permitido tanto para nomes de banco de dados quanto para nomes de tabelas era de 63 bytes, e uma declaração que usava um nome de banco de dados ou nome de tabela mais longo que esse limite falhou com um erro apropriado. No NDB 8.0, essa restrição é levantada; os identificadores para bancos de dados e tabelas `NDB` podem agora usar até 64 caracteres, como com outros nomes de banco de dados e tabelas do MySQL.

* **Suporte ao IPv6.** Antes do NDB 8.0.22, era necessário que todos os endereços de rede utilizados para conexões entre nós dentro de um NDB Cluster utilizassem ou fossem resolvíveis em endereços IPv4. A partir do NDB 8.0.22, o `NDB` suporta endereços IPv6 para todos os tipos de nós do cluster, bem como para aplicativos que utilizam a API NDB ou a API MGM.

Para mais informações, consulte Problemas conhecidos ao atualizar ou desatualizar um NDB Cluster.

* **Replicação multithread.** No NDB 8.0.32 e versões anteriores, a replicação multithread não era suportada para a Replicação de NDB Cluster. Essa restrição é eliminada no NDB Cluster 8.0.33.

Consulte a Seção 25.7.3, “Problemas Conhecidos na Replicação de NDB Cluster”, para obter mais informações.