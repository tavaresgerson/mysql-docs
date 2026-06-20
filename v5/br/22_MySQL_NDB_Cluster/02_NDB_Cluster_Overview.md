## 21.2 Visão Geral do Aglomerado NDB

O NDB Cluster é uma tecnologia que permite a agregação de bancos de dados em memória em um sistema sem nada compartilhado. A arquitetura sem nada compartilhado permite que o sistema trabalhe com hardware muito econômico e com um mínimo de requisitos específicos para hardware ou software.

O NDB Cluster foi projetado para não ter nenhum ponto único de falha. Em um sistema sem nada compartilhado, espera-se que cada componente tenha sua própria memória e disco, e o uso de mecanismos de armazenamento compartilhado, como compartilhamentos de rede, sistemas de arquivos de rede e SANs, não é recomendado ou suportado.

O NDB Cluster integra o servidor padrão MySQL com um motor de armazenamento agrupado de memória chamado `NDB` (que significa “*N*etwork *D*ata*B*ase”). Em nossa documentação, o termo `NDB` se refere à parte da configuração que é específica para o motor de armazenamento, enquanto “MySQL NDB Cluster” se refere à combinação de um ou mais servidores MySQL com o motor de armazenamento `NDB`.

Um NDB Cluster é composto por um conjunto de computadores, conhecidos como hosts, cada um executando um ou mais processos. Esses processos, conhecidos como nós, podem incluir servidores MySQL (para acesso aos dados do NDB), nós de dados (para armazenamento dos dados), um ou mais servidores de gerenciamento e, possivelmente, outros programas especializados de acesso a dados. A relação desses componentes em um NDB Cluster é mostrada aqui:

**Figura 21.1 Componentes do NDB Cluster**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

Todos esses programas trabalham juntos para formar um NDB Cluster (consulte a Seção 21.5, “Programas de NDB Cluster”). Quando os dados são armazenados pelo motor de armazenamento `NDB`, as tabelas (e os dados das tabelas) são armazenadas nos nós de dados. Essas tabelas são diretamente acessíveis a todos os outros servidores MySQL (nós SQL) no cluster. Assim, em um aplicativo de folha de pagamento que armazena dados em um cluster, se um aplicativo atualizar o salário de um funcionário, todos os outros servidores MySQL que consultam esses dados podem ver essa mudança imediatamente.

Embora um nó do NDB Cluster SQL use o daemon do servidor `mysqld`, ele difere em vários aspectos críticos do binário `mysqld` fornecido com as distribuições do MySQL 5.7, e as duas versões do `mysqld` não são intercambiáveis.

Além disso, um servidor MySQL que não está conectado a um NDB Cluster não pode usar o mecanismo de armazenamento `NDB` e não pode acessar quaisquer dados do NDB Cluster.

Os dados armazenados nos nós de dados do NDB Cluster podem ser espelhados; o clúster pode lidar com falhas em nós de dados individuais sem outro impacto além de um pequeno número de transações serem abortadas devido à perda do estado da transação. Como se espera que as aplicações transacionais lidem com falhas de transação, isso não deve ser uma fonte de problemas.

Os nós individuais podem ser interrompidos e reiniciados, e depois podem se reconectar ao sistema (cluster). Reinicializações em rolagem (nas quais todos os nós são reiniciados em ordem) são usadas para fazer alterações de configuração e atualizações de software (veja Seção 21.6.5, “Realizando uma Reinicialização em Rolagem de um Cluster NDB”). Reinicializações em rolagem também são usadas como parte do processo de adição de novos nós de dados online (veja Seção 21.6.7, “Adição de Nodos de Dados de Cluster NDB Online”). Para mais informações sobre nós de dados, como eles são organizados em um Cluster NDB e como eles lidam e armazenam dados do Cluster NDB, veja Seção 21.2.2, “Nodos do Cluster NDB, Grupos de Nó, Replicas de Fragmento e Partições”.

Fazer backup e restaurar bancos de dados do NDB Cluster pode ser feito usando a funcionalidade nativa do `NDB` encontrada no cliente de gerenciamento do NDB Cluster e no programa **ndb\_restore** incluído na distribuição do NDB Cluster. Para mais informações, consulte a Seção 21.6.8, “Backup Online do NDB Cluster”, e a Seção 21.5.24, “ndb\_restore — Restaurar um Backup de NDB Cluster”. Você também pode usar a funcionalidade padrão do MySQL fornecida para esse propósito no **mysqldump** e no servidor MySQL. Para mais informações, consulte a Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

Os nós do cluster NDB podem empregar diferentes mecanismos de transporte para comunicações entre nós; TCP/IP sobre hardware Ethernet padrão de 100 Mbps ou mais rápido é utilizado na maioria das implantações do mundo real.

### 21.2.1 Conceitos fundamentais do núcleo do cluster NDB

`NDBCLUSTER` (também conhecido como `NDB`) é um motor de armazenamento em memória que oferece recursos de alta disponibilidade e persistência de dados.

O motor de armazenamento `NDBCLUSTER` pode ser configurado com uma série de opções de falha e balanceamento de carga, mas é mais fácil começar com o motor de armazenamento no nível do clúster. O motor de armazenamento `NDB` do NDB Cluster contém um conjunto completo de dados, dependente apenas de outros dados dentro do próprio clúster.

A parte "Cluster" do NDB Cluster é configurada de forma independente dos servidores MySQL. Em um NDB Cluster, cada parte do cluster é considerada um nó.

Nota

Em muitos contextos, o termo "nó" é usado para indicar um computador, mas quando se discute o NDB Cluster, ele significa um *processo*. É possível executar vários nós em um único computador; para um computador em que um ou mais nós do cluster estão sendo executados, usamos o termo host do cluster.

Existem três tipos de nós de cluster, e em uma configuração mínima de NDB Cluster, deve haver pelo menos três nós, um de cada um desses tipos:

* Nó de gerenciamento: O papel deste tipo de nó é gerenciar os outros nós dentro do NDB Cluster, realizando funções como fornecer dados de configuração, iniciar e parar nós e executar backups. Como este tipo de nó gerencia a configuração dos outros nós, um nó deste tipo deve ser iniciado primeiro, antes de qualquer outro nó. Um nó de gerenciamento é iniciado com o comando **ndb\_mgmd**.

* Nó de dados: Este tipo de nó armazena dados do clúster. Há tantos nós de dados quanto réplicas de fragmentos, vezes o número de fragmentos (ver Seção 21.2.2, “Nodos de clúster do NDB, Grupos de nó, Replicatas de fragmentos e Partições”). Por exemplo, com duas réplicas de fragmentos, cada uma com dois fragmentos, você precisa de quatro nós de dados. Uma réplica de fragmento é suficiente para armazenamento de dados, mas não oferece redundância; portanto, é recomendável ter duas (ou mais) réplicas de fragmentos para fornecer redundância e, assim, alta disponibilidade. Um nó de dados é iniciado com o comando **ndbd** (ver Seção 21.5.1, “ndbd — O daemon de nó de dados do clúster NDB”) ou **ndbmtd” (ver Seção 21.5.3, “ndbmtd — O daemon de nó de dados do clúster NDB (multi-threaded)”).

As tabelas do NDB Cluster são normalmente armazenadas completamente na memória, em vez de no disco (é por isso que nos referimos ao NDB Cluster como um banco de dados em memória). No entanto, alguns dados do NDB Cluster podem ser armazenados em disco; consulte a Seção 21.6.11, “Tabelas de dados de disco do NDB Cluster”, para obter mais informações.

* Nó SQL: Este é um nó que acessa os dados do cluster. No caso do NDB Cluster, um nó SQL é um servidor MySQL tradicional que utiliza o mecanismo de armazenamento `NDBCLUSTER`. Um nó SQL é um processo `mysqld` iniciado com as opções `--ndbcluster` e `--ndb-connectstring`, que são explicadas em outro lugar neste capítulo, possivelmente com opções adicionais do servidor MySQL também.

Um nó SQL é, na verdade, apenas um tipo especializado de nó API, que designa qualquer aplicativo que acesse os dados do NDB Cluster. Outro exemplo de um nó API é o utilitário **ndb_restore** que é usado para restaurar um backup do cluster. É possível escrever tais aplicativos usando a API NDB. Para informações básicas sobre a API NDB, consulte Começando com a API NDB.

Importante

Não é realista esperar usar uma configuração de três nós em um ambiente de produção. Tal configuração não oferece redundância; para se beneficiar das características de alta disponibilidade do NDB Cluster, você deve usar vários nós de dados e SQL. O uso de vários nós de gerenciamento também é altamente recomendado.

Para uma breve introdução às relações entre nós, grupos de nós, réplicas de fragmentos e partições no NDB Cluster, consulte a Seção 21.2.2, “Nodos, Grupos de Nós, Replicatas de Fragmentos e Partições do NDB Cluster”.

A configuração de um clúster envolve a configuração de cada nó individual no clúster e a configuração de links de comunicação individuais entre os nós. O NDB Cluster é atualmente projetado com a intenção de que os nós de dados sejam homogêneos em termos de poder de processamento, espaço de memória e largura de banda. Além disso, para fornecer um único ponto de configuração, todos os dados de configuração para o clúster como um todo estão localizados em um arquivo de configuração.

O servidor de gerenciamento gerencia o arquivo de configuração do clúster e o log do clúster. Cada nó no clúster recupera os dados de configuração do servidor de gerenciamento e, portanto, requer uma maneira de determinar onde o servidor de gerenciamento reside. Quando eventos interessantes ocorrem nos nós de dados, os nós transfere informações sobre esses eventos para o servidor de gerenciamento, que então escreve as informações no log do clúster.

Além disso, pode haver qualquer número de processos ou aplicativos de cliente de cluster. Estes incluem clientes padrão de MySQL, programas de API específicos do `NDB` e clientes de gerenciamento. Estes são descritos nos próximos parágrafos.

**Clientes padrão do MySQL.** O NDB Cluster pode ser usado com aplicativos existentes do MySQL escritos em PHP, Perl, C, C++, Java, Python, e assim por diante. Esses aplicativos de cliente enviam instruções SQL para os servidores MySQL e recebem respostas deles, atuando como nós SQL do NDB Cluster, de maneira muito semelhante à forma como eles interagem com servidores MySQL autônomos.

Os clientes do MySQL que utilizam um NDB Cluster como fonte de dados podem ser modificados para aproveitar a capacidade de se conectar a vários servidores MySQL para alcançar o balanceamento de carga e a transição. Por exemplo, os clientes Java que utilizam o Connector/J 5.0.6 e versões posteriores podem usar URLs `jdbc:mysql:loadbalance://` (melhoria no Connector/J 5.1.7) para alcançar o balanceamento de carga de forma transparente; para mais informações sobre o uso do Connector/J com o NDB Cluster, consulte Usando o Connector/J com o NDB Cluster.

**Programas de cliente NDB.** Podem ser escritos programas de cliente que acessem os dados do NDB Cluster diretamente do motor de armazenamento `NDBCLUSTER`, ignorando quaisquer servidores MySQL que possam estar conectados ao clúster, usando a API NDB, uma API de alto nível em C++. Tais aplicativos podem ser úteis para fins especializados onde uma interface SQL para os dados não é necessária. Para mais informações, consulte a API NDB.

Aplicações Java específicas para `NDB` também podem ser escritas para o NDB Cluster usando o NDB Cluster Connector para Java. Este NDB Cluster Connector inclui ClusterJ, uma API de banco de dados de alto nível semelhante a frameworks de persistência de mapeamento objeto-relacional, como Hibernate e JPA, que se conectam diretamente ao `NDBCLUSTER`, e, portanto, não requer acesso a um servidor MySQL. Consulte Java e NDB Cluster e A API ClusterJ e o Modelo de Objeto de Dados para obter mais informações.

**Clientes de gerenciamento.** Esses clientes se conectam ao servidor de gerenciamento e fornecem comandos para iniciar e parar nós de forma graciosa, iniciar e parar o rastreamento de mensagens (apenas versões de depuração), mostrar versões e status dos nós, iniciar e parar backups, e assim por diante. Um exemplo desse tipo de programa é o cliente de gerenciamento **ndb\_mgm** fornecido com o NDB Cluster (consulte Seção 21.5.5, “ndb\_mgm — O Cliente de Gerenciamento do NDB Cluster”). Tais aplicativos podem ser escritos usando a API MGM, uma API em linguagem C que se comunica diretamente com um ou mais servidores de gerenciamento do NDB Cluster. Para mais informações, consulte a API MGM.

A Oracle também disponibiliza o MySQL Cluster Manager, que oferece uma interface avançada de string de comando que simplifica muitas tarefas complexas de gerenciamento do NDB Cluster, como reiniciar um NDB Cluster com um grande número de nós. O cliente MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor `mysqld` relacionadas ao NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 1.4.8 para obter mais informações.

**Registros de eventos.** Os registros de eventos do NDB Cluster registram eventos por categoria (inicialização, desligamento, erros, pontos de verificação, etc.), prioridade e gravidade. Uma lista completa de todos os eventos relatáveis pode ser encontrada na Seção 21.6.3, “Relatórios de eventos gerados no NDB Cluster”. Os registros de eventos são dos dois tipos listados aqui:

* Registro do grupo: Mantém um registro de todos os eventos desejados que devem ser relatados para o grupo como um todo.

* Registro do nó: Um registro separado que também é mantido para cada nó individual.

Nota

Sob circunstâncias normais, é necessário e suficiente manter e examinar apenas o log do cluster. Os logs do nó só precisam ser consultados para fins de desenvolvimento e depuração de aplicativos.

**Ponto de verificação.** De forma geral, quando os dados são salvos em disco, diz-se que um ponto de verificação foi alcançado. Mais especificamente para o NDB Cluster, um ponto de verificação é um momento em que todas as transações comprometidas são armazenadas em disco. No que diz respeito ao motor de armazenamento `NDB`, existem dois tipos de pontos de verificação que trabalham juntos para garantir que uma visão consistente dos dados do cluster seja mantida. Estes são mostrados na lista a seguir:

* Ponto de verificação local (LCP): Este é um ponto de verificação específico para um único nó; no entanto, os LCP ocorrem para todos os nós do clúster de forma mais ou menos concorrente. Um LCP geralmente ocorre a cada alguns minutos; o intervalo preciso varia e depende da quantidade de dados armazenados pelo nó, do nível de atividade do clúster e de outros fatores.

Anteriormente, um LCP envolvia salvar todos os dados de um nó no disco. O NDB 7.6 introduz suporte para LCPs parciais, que podem melhorar significativamente o tempo de recuperação em algumas condições. Consulte a Seção 21.2.4.2, “O que há de novo no NDB Cluster 7.6”, para mais informações, bem como as descrições dos parâmetros de configuração `EnablePartialLcp` e `RecoveryWork` que permitem LCPs parciais e controlam a quantidade de armazenamento que utilizam.

* Ponto de verificação global (GCP): Um GCP ocorre a cada poucos segundos, quando as transações de todos os nós são sincronizadas e o log de revisão é descarregado no disco.

Para obter mais informações sobre os arquivos e diretórios criados por pontos de verificação locais e globais, consulte o diretório do sistema de arquivos do NDB Cluster Data Node.

**Transportador.** Usamos o termo transportador para o mecanismo de transporte de dados empregado entre os nós de dados. O MySQL NDB Cluster 7.5 e 7.6 suportam três desses mecanismos, que estão listados aqui:

*TCP/IP sobre Ethernet*. Veja a Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster”.

* *Direto TCP/IP*. Usa conexões máquina a máquina. Veja a Seção 21.4.3.11, "Conexões de NDB Cluster TCP/IP usando conexões diretas".

Embora este transportador use o mesmo protocolo TCP/IP mencionado no item anterior, ele exige a configuração do hardware de maneira diferente e também é configurado de maneira diferente. Por esse motivo, é considerado um mecanismo de transporte separado para o NDB Cluster.

*Memória compartilhada (SHM)*. Veja a Seção 21.4.3.12, "Conexões de Memória Compartilhada de NDB Cluster".

Como é onipresente, a maioria dos usuários utiliza TCP/IP sobre Ethernet para NDB Cluster.

Independentemente do transportador utilizado, `NDB` tenta garantir que a comunicação entre os processos dos nós de dados seja realizada utilizando blocos o mais grandes possível, pois isso beneficia todos os tipos de transmissão de dados.

### 21.2.2 NDB Cluster Nodes, Grupos de Nó, Replicação de Fragmento e Partições

Esta seção discute a maneira pela qual o NDB Cluster divide e duplica os dados para armazenamento.

Vários conceitos centrais para uma compreensão desse tópico são discutidos nos próximos parágrafos.

**Nodo de dados.** Um processo **ndbd** ou **ndbmtd**") que armazena uma ou mais réplicas de fragmentos, ou seja, cópias das partições (discutidas mais tarde nesta seção) atribuídas ao grupo de nós do qual o nó faz parte.

Cada nó de dados deve estar localizado em um computador separado. Embora seja possível hospedar vários processos de nó de dados em um único computador, essa configuração geralmente não é recomendada.

É comum que os termos "nó" e "nó de dados" sejam usados de forma intercambiável quando se refere a um processo **ndbd** ou **ndbmtd") onde são mencionados, os nós de gerenciamento (processos **ndb\_mgmd**) e os nós SQL (processos `mysqld`) são especificados como tal nesta discussão.

**Grupo de nós.** Um grupo de nós consiste em um ou mais nós e armazena partições ou conjuntos de réplicas de fragmentos (consulte o próximo item).

O número de grupos de nós em um NDB Cluster não é diretamente configurável; é uma função do número de nós de dados e do número de réplicas de fragmentação (parâmetro de configuração `NoOfReplicas`), conforme mostrado aqui:

```sql
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Assim, um NDB Cluster com 4 nós de dados tem 4 grupos de nós se `NoOfReplicas` estiver definido como 1 no arquivo `config.ini`, 2 grupos de nós se `NoOfReplicas` estiver definido como 2 e 1 grupo de nós se `NoOfReplicas` estiver definido como 4. As réplicas de fragmentação são discutidas mais adiante nesta seção; para mais informações sobre `NoOfReplicas`, consulte a Seção 21.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Nota

Todos os grupos de nós em um NDB Cluster devem ter o mesmo número de nós de dados.

Você pode adicionar novos grupos de nós (e, portanto, novos nós de dados) online a um NDB Cluster em execução; consulte a Seção 21.6.7, “Adicionar nós de dados de NDB Cluster online”, para obter mais informações.

**Particionamento.** Esta é uma porção dos dados armazenados pelo clúster. Cada nó é responsável por manter pelo menos uma cópia de qualquer partição atribuída a ele (ou seja, pelo menos uma réplica de fragmento) disponível para o clúster.

O número de partições usado por padrão pelo NDB Cluster depende do número de nós de dados e do número de threads LDM em uso pelos nós de dados, conforme mostrado aqui:

```sql
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

Ao usar nós de dados que executam **ndbmtd**"), o número de threads do LDM é controlado pelo ajuste para `MaxNoOfExecutionThreads`. Ao usar **ndbd**, há um único thread do LDM, o que significa que há tantas partições de clúster quanto nós participando do clúster. Este é também o caso ao usar **ndbmtd**") com `MaxNoOfExecutionThreads` definido como 3 ou menos. (Você deve estar ciente de que o número de threads do LDM aumenta com o valor deste parâmetro, mas não de uma forma estritamente linear, e que há restrições adicionais para defini-lo; consulte a descrição de `MaxNoOfExecutionThreads` para mais informações.)

**NDB e particionamento definido pelo usuário.** O NDB Cluster normalmente particiona as tabelas `NDBCLUSTER` automaticamente. No entanto, também é possível empregar particionamento definido pelo usuário com as tabelas `NDBCLUSTER`. Isso está sujeito às seguintes limitações:

1. Apenas os esquemas de particionamento `KEY` e `LINEAR KEY` são suportados em produção com tabelas `NDB`.

2. O número máximo de partições que podem ser definidas explicitamente para qualquer tabela `NDB` é `8 * [number of LDM threads] * [number of node groups]`, o número de grupos de nós em um NDB Cluster sendo determinado conforme discutido anteriormente nesta seção. Ao executar o **ndbd** para processos de nó de dados, definir o número de threads LDM não tem efeito (já que `ThreadConfig` se aplica apenas ao **ndbmtd]]), nesses casos, esse valor pode ser tratado como se fosse igual a 1 para fins de realização deste cálculo.

Veja a Seção 21.5.3, “ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multi-Thread)”, para mais informações.

Para mais informações relacionadas ao NDB Cluster e à partição definida pelo usuário, consulte a Seção 21.2.7, “Limitações conhecidas do NDB Cluster”, e a Seção 22.6.2, “Limitações de partição relacionadas aos motores de armazenamento”.

**Replica de fragmento.** Esta é uma cópia de uma partição de cluster. Cada nó em um grupo de nós armazena uma replica de fragmento. Também às vezes conhecida como replica de partição. O número de réplicas de fragmento é igual ao número de nós por grupo de nós.

Um fragmento pertence inteiramente a um único nó; um nó pode (e geralmente faz) armazenar várias réplicas de fragmento.

O diagrama a seguir ilustra um NDB Cluster com quatro nós de dados executando **ndbd**, organizados em dois grupos de nós, cada um com dois nós; os nós 1 e 2 pertencem ao grupo de nós 0, e os nós 3 e 4 pertencem ao grupo de nós 1.

Nota

Apenas os nós de dados são mostrados aqui; embora um NDB Cluster funcional exija um processo **ndb\_mgmd** para a gestão do cluster e pelo menos um nó SQL para acessar os dados armazenados pelo cluster, esses foram omitidos da figura por questões de clareza.

**Figura 21.2. NDB Cluster com Dois Grupos de Nó**

![Content is described in the surrounding text.](images/fragment-replicas-groups-1-1.png)

Os dados armazenados pelo clúster são divididos em quatro partições, numeradas 0, 1, 2 e 3. Cada partição é armazenada—em múltiplas cópias—no mesmo grupo de nós. As partições são armazenadas em grupos de nós alternados da seguinte forma:

* A partição 0 é armazenada no grupo de nós 0; uma replica primária de fragmento (cópia primária) é armazenada no nó 1, e uma replica de fragmento de backup (cópia de backup da partição) é armazenada no nó 2.

* A partição 1 é armazenada no outro grupo de nós (grupo de nós 1); a replica primária do fragmento dessa partição está no nó 3, e sua replica de fragmento de backup está no nó 4.

* A partição 2 é armazenada no grupo de nós 0. No entanto, a colocação de suas duas réplicas de fragmento é invertida em relação à da Partição 0; para a Partição 2, a réplica de fragmento primária é armazenada no nó 2, e o backup no nó 1.

* A partição 3 é armazenada no grupo de nós 1, e a colocação de suas duas réplicas de fragmento é invertida em relação àquelas da partição

Ou seja, sua replica primária de fragmento está localizada no nó 4, com o backup no nó 3.

O que isso significa em relação ao funcionamento contínuo de um NDB Cluster é o seguinte: enquanto cada grupo de nós que participa do cluster tiver pelo menos um nó em operação, o cluster terá uma cópia completa de todos os dados e permanecerá viável. Isso é ilustrado no próximo diagrama.

**Figura 21.3 Nodos necessários para um clúster NDB 2x2**

![Content is described in the surrounding text.](images/replicas-groups-1-2.png)

Neste exemplo, o clúster consiste em dois grupos de nós, cada um composto por dois nós de dados. Cada nó de dados está executando uma instância do **ndbd**. Qualquer combinação de pelo menos um nó do grupo de nós 0 e pelo menos um nó do grupo de nós 1 é suficiente para manter o clúster "vivo". No entanto, se ambos os nós de um único grupo de nós falharem, a combinação composta pelos dois nós restantes do outro grupo de nós não é suficiente. Nesta situação, o clúster perdeu uma partição inteira e, portanto, não pode mais fornecer acesso a um conjunto completo de todos os dados do NDB Cluster.

No NDB 7.5.4 e versões posteriores, o número máximo de grupos de nós suportados para uma única instância do NDB Cluster é de 48 (Bug#80845, Bug #22996305).

### 21.2.3 Requisitos de hardware, software e redes do cluster NDB

Uma das principais vantagens do NDB Cluster é que ele pode ser executado em hardware comum e não tem requisitos incomuns nesse sentido, exceto para grandes quantidades de RAM, devido ao fato de que todo o armazenamento de dados ao vivo é feito em memória. (É possível reduzir essa exigência usando tabelas de dados de disco—consulte a Seção 21.6.11, "Tabelas de Dados de Disco do NDB Cluster", para mais informações sobre essas tabelas.) Naturalmente, CPUs múltiplas e mais rápidas podem melhorar o desempenho. Os requisitos de memória para outros processos do NDB Cluster são relativamente pequenos.

Os requisitos de software para o NDB Cluster também são modestos. Os sistemas operacionais de hospedagem não exigem módulos, serviços, aplicativos ou configurações incomuns para suportar o NDB Cluster. Para os sistemas operacionais suportados, uma instalação padrão deve ser suficiente. Os requisitos de software do MySQL são simples: tudo o que é necessário é uma versão de produção do NDB Cluster. Não é estritamente necessário compilar o MySQL você mesmo apenas para poder usar o NDB Cluster. Assumemos que você está usando os binários apropriados para sua plataforma, disponíveis na página de downloads do software do NDB Cluster em <https://dev.mysql.com/downloads/cluster/>.

Para a comunicação entre os nós, o NDB Cluster suporta redes TCP/IP em qualquer topologia padrão, e o mínimo esperado para cada host é um cartão Ethernet padrão de 100 Mbps, além de um switch, hub ou roteador para fornecer conectividade de rede para o clúster como um todo. Recomendamos fortemente que um NDB Cluster seja executado em sua própria sub-rede que não seja compartilhada com máquinas que não fazem parte do clúster, pelas seguintes razões:

* **Segurança.** As comunicações entre os nós do NDB Cluster não são criptografadas ou protegidas de qualquer maneira. O único meio de proteger as transmissões dentro de um NDB Cluster é executar seu NDB Cluster em uma rede protegida. Se você pretende usar o NDB Cluster para aplicações web, o cluster deve definitivamente residir atrás do seu firewall e não na Zona Desmilitarizada (DMZ) ou em outro lugar da sua rede.

Consulte a Seção 21.6.18.1, “Problemas de segurança e de rede do cluster NDB”, para obter mais informações.

* **Eficiência. Configurar um NDB Cluster em uma rede privada ou protegida permite que o cluster faça uso exclusivo da largura de banda entre os hosts do cluster. Usar um switch separado para o seu NDB Cluster não só ajuda a proteger contra acesso não autorizado aos dados do NDB Cluster, como também garante que os nós do NDB Cluster estejam blindados contra interferências causadas por transmissões entre outros computadores na rede. Para maior confiabilidade, você pode usar dois switches e duas placas para remover a rede como um único ponto de falha; muitos controladores de dispositivos suportam o failover para tais links de comunicação.

**Comunicação em rede e latência.** O NDB Cluster requer comunicação entre os nós de dados e os nós da API (incluindo nós SQL), bem como entre os nós de dados e outros nós de dados, para executar consultas e atualizações. A latência de comunicação entre esses processos pode afetar diretamente o desempenho e a latência observados das consultas dos usuários. Além disso, para manter a consistência e o serviço mesmo em caso de falha silenciosa dos nós, o NDB Cluster utiliza mecanismos de batida de coração e tempo de espera que tratam uma perda prolongada de comunicação de um nó como falha do nó. Isso pode levar a uma redução da redundância. Lembre-se de que, para manter a consistência dos dados, um NDB Cluster é desligado quando o último nó de um grupo de nós falha. Assim, para evitar aumentar o risco de desligamento forçado, as interrupções de comunicação entre os nós devem ser evitadas sempre que possível.

O falecimento de um nó de dados ou de uma API resulta no cancelamento de todas as transações não confirmadas que envolvem o nó falhado. A recuperação do nó de dados requer a sincronização dos dados do nó falhado de um nó de dados sobrevivente e o restabelecimento dos registros de redo e de verificação de disco, antes de o nó de dados voltar a funcionar. Essa recuperação pode levar algum tempo, durante o qual o Cluster opera com redundância reduzida.

O Heartbeating depende da geração oportuna de sinais de batimento cardíaco por todos os nós. Isso pode não ser possível se o nó estiver sobrecarregado, tiver CPU insuficiente devido ao compartilhamento com outros programas ou estiver experimentando atrasos devido ao swapping. Se a geração de batimento cardíaco for suficientemente atrasada, outros nós tratam o nó que é lento em responder como falhado.

Esse tratamento de um nó lento como um falho pode ou não ser desejável em algumas circunstâncias, dependendo do impacto da operação lenta do nó no resto do clúster. Ao definir valores de tempo de espera, como `HeartbeatIntervalDbDb` e `HeartbeatIntervalDbApi` para o NDB Cluster, é necessário ter cuidado para alcançar a rápida detecção, a falha e o retorno ao serviço, evitando, ao mesmo tempo, falsos positivos potencialmente caros.

Quando se espera que as latências de comunicação entre os nós de dados sejam maiores do que o esperado em um ambiente de LAN (da ordem de 100 µs), os parâmetros de tempo de espera devem ser aumentados para garantir que quaisquer períodos permitidos de latência estejam dentro dos tempos de espera configurados. Aumentar os tempos de espera dessa maneira tem um efeito correspondente no tempo máximo para detectar a falha e, portanto, no tempo para recuperação do serviço.

Os ambientes LAN geralmente podem ser configurados com baixa latência estável e de tal forma que possam oferecer redundância com tempos de falha rápida. Falhas individuais de link podem ser recuperadas com latência mínima e controlada visível no nível TCP (onde o NDB Cluster normalmente opera). Ambientes WAN podem oferecer uma gama de latências, bem como redundância com tempos de falha mais lentos. Falhas individuais de link podem exigir mudanças de rota para se propagar antes que a conectividade de ponta a ponta seja restaurada. No nível TCP, isso pode aparecer como grandes latências em canais individuais. A latência TCP observada no pior dos casos nesses cenários está relacionada ao tempo mais crítico para a camada de IP redirecionar ao redor das falhas.

### 21.2.4 O que há de novo no MySQL NDB Cluster

As seções a seguir descrevem as mudanças na implementação do MySQL NDB Cluster nas versões 7.6 a 5.7.44-ndb-7.6.36 e NDB Cluster 7.5 a 5.7.44-ndb-7.5.36 em comparação com as séries de versões anteriores. O NDB Cluster 8.0 está disponível como uma versão de Disponibilidade Geral (GA), começando com o NDB 8.0.19; consulte O que há de novo no MySQL NDB Cluster 8.0, para mais informações sobre novos recursos e outras mudanças no NDB 8.0. O NDB Cluster 7.6 e 7.5 são versões anteriores de Disponibilidade Geral ainda suportadas em produção; consulte Seção 21.2.4.2, “O que há de novo no NDB Cluster 7.6” para informações sobre o NDB Cluster 7.6. Consulte Seção 21.2.4.1, “O que há de novo no NDB Cluster 7.5” para informações sobre o NDB Cluster 7.5. O NDB Cluster 7.4 e 7.3 foram versões anteriores de Disponibilidade Geral que atingiram o fim de sua vida útil e que não são mais suportadas ou mantidas. Recomendamos novas implantações para uso de produção do MySQL NDB Cluster 8.0.

#### 21.2.4.1 O que há de novo no NDB Cluster 7.5

As principais mudanças e novas funcionalidades do NDB Cluster 7.5 que provavelmente serão de interesse estão listadas na lista a seguir:

* **Melhorias do ndbinfo.** Várias mudanças são feitas no banco de dados `ndbinfo`, sendo a principal delas que ele agora fornece informações detalhadas sobre os parâmetros de configuração do nó do NDB Cluster.

A tabela `config_params` foi transformada em apenas de leitura e foi aprimorada com colunas adicionais que fornecem informações sobre cada parâmetro de configuração, incluindo o tipo do parâmetro, o valor padrão, os valores máximo e mínimo (quando aplicável), uma breve descrição do parâmetro e se o parâmetro é obrigatório. Esta tabela também fornece a cada parâmetro um `param_number` único.

Uma string na tabela `config_values` mostra o valor atual de um parâmetro dado no nó que possui um ID especificado. O parâmetro é identificado pelo valor da coluna `config_param`, que corresponde ao `config_params` da tabela `param_number`.

Usando essa relação, você pode escrever uma junção nessas duas tabelas para obter os valores padrão, máximo, mínimo e atual para um ou mais parâmetros de configuração do NDB Cluster por nome. Um exemplo de declaração SQL usando essa junção é mostrado aqui:

  ```sql
  SELECT  p.param_name AS Name,
          v.node_id AS Node,
          p.param_type AS Type,
          p.param_default AS 'Default',
          p.param_min AS Minimum,
          p.param_max AS Maximum,
          CASE p.param_mandatory WHEN 1 THEN 'Y' ELSE 'N' END AS 'Required',
          v.config_value AS Current
  FROM    config_params p
  JOIN    config_values v
  ON      p.param_number = v.config_param
  WHERE   p. param_name IN ('NodeId', 'HostName','DataMemory', 'IndexMemory');
  ```

Para mais informações sobre essas alterações, consulte a Seção 21.6.15.8, “A tabela ndbinfo config\_params”. Consulte a Seção 21.6.15.9, “A tabela ndbinfo config\_values”, para obter mais informações e exemplos.

Além disso, o banco de dados `ndbinfo` não depende mais do mecanismo de armazenamento `MyISAM`. Todas as tabelas e visualizações `ndbinfo` agora usam `NDB` (mostrado como `NDBINFO`).

Várias novas tabelas `ndbinfo` foram introduzidas no NDB 7.5.4. Essas tabelas estão listadas aqui, com descrições breves:

+ `dict_obj_info` fornece os nomes e os tipos de objetos de banco de dados em `NDB`, bem como informações sobre objetos parentes, quando aplicável.

+ `table_distribution_status` fornece informações sobre o status da distribuição da tabela `NDB`

+ `table_fragments` fornece informações sobre a distribuição dos fragmentos da tabela `NDB`

+ `table_info` fornece informações sobre registro, verificação, armazenamento e outras opções em vigor para cada tabela `NDB`

+ `table_replicas` fornece informações sobre réplicas de fragmentos

Veja as descrições das tabelas individuais para mais informações.

* Alterações no formato da string e coluna padrão. A partir do NDB 7.5.1, o valor padrão tanto para a opção `ROW_FORMAT` quanto para a opção `COLUMN_FORMAT` para `CREATE TABLE` pode ser definido como `DYNAMIC`, em vez de `FIXED`, usando uma nova variável do servidor MySQL `ndb_default_column_format` é adicionada como parte dessa mudança; defina isso como `FIXED` ou `DYNAMIC` (ou comece com `mysqld` com a opção equivalente `--ndb-default-column-format=FIXED`) para forçar que esse valor seja usado para `COLUMN_FORMAT` e `ROW_FORMAT`. Antes do NDB 7.5.4, o padrão para essa variável era `DYNAMIC`; nesta e em versões posteriores, o padrão é `FIXED`, que oferece compatibilidade reversa com versões anteriores (Bug #24487363).

O formato de string e o formato de coluna usados pelas colunas de tabela existentes não são afetados por essa alteração. Novas colunas adicionadas a essas tabelas usam os novos padrões para essas colunas (possivelmente sobrescritos por `ndb_default_column_format`), e as colunas existentes são alteradas para usar essas colunas também, desde que a declaração `ALTER TABLE` que realiza essa operação especifique `ALGORITHM=COPY`.

Nota

Uma cópia `ALTER TABLE` não pode ser feita implicitamente se `mysqld` for executada com `--ndb-allow-copying-alter-table=FALSE`.

* **ndb\_binlog\_index não depende mais do MyISAM.** A partir do NDB 7.5.2, a tabela `ndb_binlog_index` empregada na Replicação do NDB Cluster agora usa o mecanismo de armazenamento `InnoDB` em vez de `MyISAM`. Ao fazer a atualização, você pode executar `mysqld_upgrade` com `--force` [[`--upgrade-system-tables`] para fazer com que ele execute `ALTER TABLE ... ENGINE=INNODB` nesta tabela. O uso de `MyISAM` para esta tabela continua sendo suportado para compatibilidade reversa.

Uma vantagem dessa mudança é que ela permite depender do comportamento transacional e das leituras sem bloqueio para essa tabela, o que pode ajudar a aliviar problemas de concorrência durante operações de purga e rotação de log, e melhorar a disponibilidade dessa tabela.

* **Alterações na tabela ALTER**. O NDB Cluster anteriormente suportava uma sintaxe alternativa para online `ALTER TABLE`. Esse recurso não é mais suportado no NDB Cluster 7.5, que faz uso exclusivo de `ALGORITHM = DEFAULT|COPY|INPLACE` para DDL de tabela, como no servidor MySQL padrão.

Outra alteração que afeta o uso dessa declaração é que `ALTER TABLE ... ALGORITHM=INPLACE RENAME` pode agora conter operações DDL, além do renomeamento.

* **Parâmetro ExecuteOnComputer desatualizado.** O parâmetro de configuração `ExecuteOnComputer` para nós de gerenciamento, nós de dados e nós de API foi desatualizado e está sujeito à remoção em uma versão futura do NDB Cluster. Você deve usar o equivalente ao parâmetro `HostName` para todos os três tipos de nós.

* **Otimização de registros por chave.** O manipulador NDB agora utiliza a interface de registros por chave para estatísticas de índice implementadas para o otimizador no MySQL 5.7.5. Alguns dos benefícios dessa mudança incluem os listados aqui:

+ O otimizador agora escolhe planos de execução melhores em muitos casos em que um índice de junção menos ótimo ou uma ordem de junção de tabela anteriormente teria sido escolhida

As estimativas de string mostradas por `EXPLAIN` são mais precisas

As estimativas de cardinalidade mostradas por `SHOW INDEX` são aprimoradas

* **IDs dos nós do pool de conexão.** O NDB 7.5.0 adiciona as opções `mysqld` e `--ndb-cluster-connection-pool-nodeids`, que permitem definir um conjunto de IDs de nó para o pool de conexão. Essa configuração substitui `--ndb-nodeid`, o que significa que também substitui a opção `--ndb-connectstring` e a variável de ambiente `NDB_CONNECTSTRING`.

Nota

Você pode definir o tamanho do pool de conexão usando a opção `--ndb-cluster-connection-pool` para `mysqld`.

* **create\_old\_temporals removido.** A variável de sistema `create_old_temporals` foi descontinuada no NDB Cluster 7.4 e foi removida agora.

* **Comando PROMPT do cliente ndb\_mgm.** O NDB Cluster 7.5 adiciona um novo comando para definir o prompt de string de comando do cliente. O exemplo a seguir ilustra o uso do comando `PROMPT`:

  ```sql
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @10.100.1.1  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0, *)
  id=6    @10.100.1.3  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0)
  id=7    @10.100.1.9  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)
  id=8    @10.100.1.11  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @10.100.1.8  (mysql-5.7.44-ndb-7.5.36)

  [mysqld(API)]   2 node(s)
  id=100  @10.100.1.8  (5.7.44-ndb-7.5.36)
  id=101  @10.100.1.10  (5.7.44-ndb-7.5.36)

  mgm#1: PROMPT
  ndb_mgm> EXIT
  jon@valhaj:/usr/local/mysql/bin>
  ```

Para informações adicionais e exemplos, consulte a Seção 21.6.1, “Comandos no Cliente de Gerenciamento de NDB Cluster”.

* **Armazenamento de coluna FIXA aumentado por fragmento.** O NDB Cluster 7.5 e versões posteriores suportam um máximo de 128 TB por fragmento de dados nas colunas `FIXED`. No NDB Cluster 7.4 e versões anteriores, isso era de 16 GB por fragmento.

* **Parâmetros obsoletos removidos.** Os seguintes parâmetros de configuração de nó de dados do NDB Cluster foram obsoletos em versões anteriores do NDB Cluster e foram removidos no NDB 7.5.0:

+ `Id`: desatualizada no NDB 7.1.9; substituída por `NodeId`.

+ `NoOfDiskPagesToDiskDuringRestartTUP`, `NoOfDiskPagesToDiskDuringRestartACC`: ambos desatualizados, não tiveram efeito; substituídos no MySQL 5.1.6 por `DiskCheckpointSpeedInRestart`, que, por sua vez, foi posteriormente desatualizado (em NDB 7.4.1) e agora também foi removido.

+ `NoOfDiskPagesToDiskAfterRestartACC`, `NoOfDiskPagesToDiskAfterRestartTUP`: ambos desatualizados e sem efeito; substituídos no MySQL 5.1.6 por `DiskCheckpointSpeed`, que, por sua vez, foi posteriormente desatualizado (em NDB 7.4.1) e agora também removido.

+ `ReservedSendBufferMemory`: Desatualizado; não teve mais efeito.

+ `MaxNoOfIndexes`: arcaico (pré-MySQL 4.1), não teve efeito; há muito tempo substituído por `MaxNoOfOrderedIndexes` ou `MaxNoOfUniqueHashIndexes`.

+ `Discless`: sinônimo arcaico (pré-MySQL 4.1) e há muito substituído por `Diskless`.

O parâmetro de configuração de computador arcaico e não utilizado (e, por isso, também anteriormente não documentado) `ByteOrder` também foi removido no NDB 7.5.0.

Os parâmetros descritos acima não são suportados no NDB 7.5. A tentativa de usar qualquer um desses parâmetros em um arquivo de configuração de NDB Cluster agora resulta em um erro.

* Melhorias no exame DBTC. Os exames foram aprimorados ao reduzir o número de sinais utilizados para a comunicação entre os blocos de kernel `DBTC` e `DBDIH` em `NDB`, permitindo uma maior escalabilidade dos nós de dados quando utilizados para operações de exame, diminuindo o uso de recursos da CPU para operações de exame, em alguns casos, em um percentual estimado de cinco por cento.

Além disso, como resultado dessas mudanças, os tempos de resposta devem ser muito melhorados, o que poderia ajudar a prevenir problemas com sobrecarga dos principais threads. Além disso, as verificações feitas no bloco de kernel `BACKUP` também foram melhoradas e tornaram-se mais eficientes do que nas versões anteriores.

* **Suporte para coluna JSON.** O NDB 7.5.2 e versões posteriores suportam o tipo de coluna `JSON` para tabelas `NDB` e as funções JSON encontradas no MySQL Server, sujeito à limitação de que uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

* **Leia de qualquer fragmento de replica; especifique o número de fragmentos de partição do hashmap.** Anteriormente, todas as leituras eram direcionadas para a replica do fragmento primário, exceto para leituras simples. (Uma leitura simples é uma leitura que bloqueia a string enquanto a lê.) A partir do NDB 7.5.2, é possível habilitar leituras de qualquer replica de fragmento. Isso é desativado por padrão, mas pode ser habilitado para um determinado nó SQL usando a variável de sistema `ndb_read_backup` adicionada nesta versão.

Anteriormente, era possível definir tabelas com apenas um tipo de mapeamento de partição, com uma partição primária em cada LDM em cada nó, mas no NDB 7.5.2 torna-se possível ser mais flexível quanto à atribuição de partições, definindo um equilíbrio de partição (tipo de contagem de fragmentos). Os esquemas de equilíbrio possíveis são um por nó, um por grupo de nós, um por LDM por nó e um por LDM por grupo de nós.

Essa configuração pode ser controlada para tabelas individuais por meio de uma opção `PARTITION_BALANCE` (renomeada de `FRAGMENT_COUNT_TYPE` no NDB 7.5.4) embutida em comentários `NDB_TABLE` em declarações `CREATE TABLE` ou `ALTER TABLE`. Configurações para `READ_BACKUP` de nível de tabela também são suportadas usando essa sintaxe. Para mais informações e exemplos, consulte Seção 13.1.18.9, “Definindo opções de comentários NDB”.

Em aplicativos da API NDB, o equilíbrio de partição de uma tabela também pode ser obtido e ajustado usando métodos fornecidos para esse propósito; consulte Table::getPartitionBalance() e Table::setPartitionBalance(), além de Object::PartitionBalance, para obter mais informações sobre esses métodos.

Como parte desse trabalho, o NDB 7.5.2 também introduz a variável de sistema `ndb_data_node_neighbour`. Isso é destinado ao uso, em indicação de transação, para fornecer um nó de dados "próximo" a este nó SQL.

Além disso, ao restaurar esquemas de tabela, o **ndb\_restore** `--restore-meta` agora usa a partição padrão do clúster de destino, em vez de usar o mesmo número de partições que o clúster original do qual o backup foi feito. Consulte a Seção 21.5.24.2.2, “Restauração a Mais Nodos do que o Original”, para obter mais informações e um exemplo.

O NDB 7.5.3 adiciona uma melhoria adicional para `READ_BACKUP`: Neste e em versões posteriores, é possível definir `READ_BACKUP` para uma tabela específica online como parte de `ALTER TABLE ... ALGORITHM=INPLACE ...`.

* **Melhorias no ThreadConfig.** Vários aprimoramentos e adições de recursos são implementados no NDB 7.5.2 para o parâmetro de configuração do nó de dados multithread `ThreadConfig` (**ndbmtd**")) `ThreadConfig`, incluindo suporte para um número maior de plataformas. Essas mudanças são descritas nos próximos parágrafos.

O bloqueio exclusivo da CPU é agora suportado no FreeBSD e no Windows, usando `cpubind` e `cpuset`. O bloqueio exclusivo da CPU é agora suportado no Solaris (apenas) usando os parâmetros `cpubind_exclusive` e `cpuset_exclusive`, que são introduzidos nesta versão.

A priorização de thread está disponível agora, controlada pelo novo parâmetro `thread_prio`. `thread_prio` é suportado em Linux, FreeBSD, Windows e Solaris, e varia um pouco por plataforma. Para mais informações, consulte a descrição de `ThreadConfig`.

O parâmetro `realtime` é agora suportado em plataformas Windows.

* **Partições maiores que 16 GB.** Devido a uma melhoria na implementação do índice de hash utilizada pelos nós de dados do NDB Cluster, as partições das tabelas `NDB` podem agora conter mais de 16 GB de dados para colunas fixas, e o tamanho máximo da partição para colunas fixas é agora elevado para 128 TB. A limitação anterior era devida ao fato de que o bloco `DBACC` no kernel `NDB` usava apenas referências de 32 bits para a parte de tamanho fixo de uma string no bloco `DBTUP`, embora referências de 45 bits para esses dados sejam usadas no próprio `DBTUP` e em outros lugares no kernel fora de `DBACC`; todas essas referências nos dados tratados no bloco `DBACC` agora usam 45 bits.

* **Imprima declarações SQL do ndb_restore.** O NDB 7.5.4 adiciona a opção `--print-sql-log` para o utilitário **ndb_restore** fornecido com a distribuição do NDB Cluster. Esta opção permite o registro SQL para `stdout`. **Importante**: Toda tabela que será restaurada usando esta opção deve ter uma chave primária definida explicitamente.

Veja a Seção 21.5.24, “ndb\_restore — Restaurar um backup de um NDB Cluster”, para mais informações.

* **Organização dos pacotes RPM.** A partir do NDB 7.5.4, a nomenclatura e a organização dos pacotes RPM fornecidos para o NDB Cluster estão mais alinhados com os pacotes lançados para o servidor MySQL. Os nomes de todos os RPMs do NDB Cluster agora são prefixados com `mysql-cluster`. Os nós de dados são agora instalados usando o pacote `data-node`; os nós de gerenciamento são agora instalados a partir do pacote `management-server`; e os nós SQL requerem os pacotes `server` e `common`. Os programas cliente MySQL e `NDB`, incluindo o cliente **mysql** e o cliente de gerenciamento **ndb\_mgm**, agora estão incluídos no RPM `client`.

Para uma lista detalhada dos RPMs do NDB Cluster e outras informações, consulte a Seção 21.3.1.2, “Instalando o NDB Cluster a partir de RPM”.

* **ndbinfo processa e configura as tabelas nodes.** O NDB 7.5.7 adiciona duas tabelas ao banco de dados de informações `ndbinfo` para fornecer informações sobre os nós do cluster; essas tabelas estão listadas aqui:

+ `config_nodes`: Esta tabela fornece o ID do nó, o tipo de processo e o nome do host para cada nó listado no arquivo de configuração de um cluster NDB.

+ O `processes` mostra informações sobre os nós atualmente conectados ao clúster; essas informações incluem o nome do processo e o ID do processo do sistema; para cada nó de dados e nó SQL, também mostra o ID do processo do processo anjo do nó. Além disso, a tabela mostra um endereço de serviço para cada nó conectado; esse endereço pode ser definido em aplicativos da API NDB usando o método `Ndb_cluster_connection::set_service_uri()`, que também é adicionado no NDB 7.5.7.

* **Nome do sistema.** O nome do sistema de um clúster NDB pode ser usado para identificar um clúster específico. A partir do NDB 7.5.7, o MySQL Server exibe esse nome como o valor da variável de status `Ndb_system_name`; os aplicativos da API NDB podem usar o método `Ndb_cluster_connection::get_system_name()`, que é adicionado na mesma versão.

Um nome do sistema baseado no momento em que o servidor de gerenciamento foi iniciado é gerado automaticamente; você pode substituir esse valor adicionando uma seção `[system]` ao arquivo de configuração do clúster e definindo o parâmetro `Name` para um valor de sua escolha nesta seção, antes de iniciar o servidor de gerenciamento.

* **opções de ndb\_restore.** A partir do NDB 7.5.13, as opções `--nodeid` e `--backupid` são necessárias ao invocar **ndb\_restore**.

* **Melhorias na ferramenta ndb\_blob\_tool.** A partir do NDB 7.5.18, a ferramenta **ndb\_blob\_tool** pode detectar partes de blob ausentes para as quais existem partes em string e substituí-las com partes de blob de espaço (compostas por caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes com marcadores, use a opção `--add-missing`.

Para mais informações, consulte a Seção 21.5.6, “ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”.

* **opção --ndb-log-fail-terminate.** A partir do NDB 7.5.18, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de string completamente. Isso pode ser feito iniciando `mysqld` com a opção `--ndb-log-fail-terminate`.

* **Programas do NDB—remoção da dependência do NDBT.** A dependência de vários programas de utilitário `NDB` da biblioteca `NDBT` foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nesses programas pode levar a problemas indesejados durante os testes.

Os programas afetados estão listados aqui, juntamente com as versões `NDB` nas quais a dependência foi removida:

+ **ndb\_restore**, em NDB 7.5.15
  + **ndb\_show\_tables**, em NDB 7.5.18
  + **ndb\_waiter**, em NDB 7.5.18

O principal efeito dessa alteração para os usuários é que esses programas não imprimem `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao atualizar para as versões indicadas.

* **Depreciação e remoção do Auto-Installer.** A ferramenta de instalação baseada na web do MySQL NDB Cluster Auto-Installer (**ndb_setup.py**) é depreciada no NDB 7.5.20 e removida no NDB 7.5.21 e versões posteriores. Ela não é mais suportada.

* **descontinuidade e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi descontinuado no NDB 7.5.20 e removido no NDB 7.5.21.

* **Suporte ao Node.js removido.** A partir da versão NDB Cluster 7.5.20, o suporte ao Node.js pelo NDB 7.5 foi removido.

O suporte para Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

* **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 7.5.23, o **ndb_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

+ Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

A coluna originalmente declarada como `NULL` não deve conter nenhuma string `NULL`; se o fizer, o **ndb\_restore** sai com um erro.

+ Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

Para mais informações, consulte as descrições das opções de **ndb\_restore** indicadas.

* Suporte ao OpenSSL 3.0. A partir do NDB 7.5.31, todos os binários do servidor e cliente MySQL incluídos na distribuição `NDB` são compilados com suporte ao OpenSSL 3.0

O ClusterJPA não é mais suportado a partir do NDB 7.5.7; seu código-fonte e binário foram removidos da distribuição do NDB Cluster.

O NDB Cluster 7.5 também é suportado pelo MySQL Cluster Manager, que oferece uma interface avançada de string de comando que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 1.4.8 para obter mais informações.

#### 21.2.4.2 O que há de novo no NDB Cluster 7.6

Novas funcionalidades e outras mudanças importantes no NDB Cluster 7.6 que provavelmente serão de interesse estão listadas na lista a seguir:

* **Novo formato de arquivo de tabela de dados de disco.** Um novo formato de arquivo é usado no NDB 7.6 para tabelas de Dados de Disco NDB, o que permite que cada tabela de Dados de Disco seja identificada de forma única sem reutilizar quaisquer IDs de tabela. Isso deve ajudar a resolver problemas com o gerenciamento de páginas e extensões que eram visíveis para o usuário como problemas com a criação e eliminação rápida de tabelas de Dados de Disco, e para os quais o formato antigo não fornecia uma maneira pronta para corrigir.

O novo formato é usado sempre que novos grupos de arquivos de registro de desfazer e arquivos de dados de espaço de disco são criados. Os arquivos relacionados aos dados de tabela existentes do Disk Data continuam a usar o formato antigo até que seus espaços de tabela e grupos de arquivos de registro de desfazer sejam recriados.

Importante

Os formatos antigos e novos não são compatíveis; arquivos de dados diferentes ou arquivos de registro de desfazer que são usados pela mesma tabela ou espaço de dados do disco não podem usar uma mistura de formatos.

Para evitar problemas relacionados às mudanças no formato, você deve recriar quaisquer espaços de tabela existentes e desfazer grupos de arquivos de registro quando atualizar para o NDB 7.6. Você pode fazer isso realizando um reinício inicial de cada nó de dados (ou seja, usando a opção `--initial`) como parte do processo de atualização. Você pode esperar que este passo seja tornado obrigatório como parte da atualização de NDB 7.5 ou uma série de lançamento anterior para NDB 7.6 ou posterior.

Se você estiver usando tabelas de Dados de disco, uma desativação de qualquer versão do NDB 7.6 — independentemente do status da versão — para qualquer versão do NDB 7.5 ou anterior exige que você reinicie todos os nós de dados com `--initial` como parte do processo de desativação. Isso ocorre porque as séries de versões do NDB 7.5 e anteriores não são capazes de ler o novo formato de arquivo de Dados de disco.

Para mais informações, consulte a Seção 21.3.7, “Atualização e Downgrading do NDB Cluster”.

* **Pool de memória de dados e memória de índice dinâmica.** A memória necessária para índices nas colunas da tabela `NDB` é agora alocada dinamicamente a partir daquela alocada para `DataMemory`. Por essa razão, o parâmetro de configuração `IndexMemory` é agora desatualizado e está sujeito à remoção em uma série de versões futuras.

Importante

Em NDB 7.6, se `IndexMemory` estiver definido no arquivo `config.ini`, o servidor de gerenciamento emite o aviso "ÍndiceMemory é desatualizado, use bytes Número em cada nó ndbd(DB) alocado para armazenamento de índices em vez disso, e qualquer memória atribuída a este parâmetro é automaticamente adicionada a `DataMemory`."

Além disso, o valor padrão para `DataMemory` foi aumentado para 98M; o padrão para `IndexMemory` foi reduzido para 0.

A combinação da memória de índice com a memória de dados simplifica a configuração do `NDB`; um benefício adicional dessas mudanças é que a expansão, aumentando o número de threads LDM, não é mais limitada por ter um valor insuficiente definido para o `IndexMemory`. Isso ocorre porque a memória de índice não é mais uma quantidade estática que é alocada apenas uma vez (quando o clúster começa), mas agora pode ser alocada e realocada conforme necessário. Anteriormente, às vezes acontecia que o aumento do número de threads LDM poderia levar ao esgotamento da memória de índice, enquanto grandes quantidades de `DataMemory` permaneciam disponíveis.

Como parte desse trabalho, vários casos de uso de `DataMemory` que não estão diretamente relacionados ao armazenamento de dados de tabela agora usam memória de transação.

Por essa razão, em alguns sistemas, pode ser necessário aumentar `SharedGlobalMemory` para permitir que a memória de transação aumente quando necessário, como ao usar a Replicação em NDB Cluster, que requer uma grande quantidade de buffer nos nós de dados. Em sistemas que realizam cargas iniciais em massa de dados, pode ser necessário dividir transações muito grandes em partes menores.

Além disso, os nós de dados agora geram eventos `MemoryUsage` (consulte a Seção 21.6.3.2, “Eventos de registro do clúster NDB”) e escrevem mensagens apropriadas no registro do clúster quando o uso de recursos atinge 99%, bem como quando atinge 80%, 90% ou 100%, como antes.

Outras alterações relacionadas estão listadas aqui:

+ `IndexMemory` não está mais entre os valores exibidos na coluna `memory_type` da tabela `ndbinfo.memoryusage`; também não é exibido na saída do **ndb\_config**.

+ `REPORT MEMORYUSAGE` e outros comandos que exibem o consumo de memória agora mostram o consumo de memória de índice usando páginas de 32K (anteriormente eram páginas de 8K).

+ A tabela `ndbinfo.resources` agora mostra o recurso `DISK_OPERATIONS` como `TRANSACTION_MEMORY`, e o recurso `RESERVED` foi removido.

* **ndbinfo processa e configura as tabelas nodes.** O NDB 7.6 adiciona duas tabelas ao banco de dados de informações `ndbinfo` para fornecer informações sobre os nós do cluster; essas tabelas estão listadas aqui:

+ `config_nodes`: Esta tabela lista o ID do nó, o tipo de processo e o nome do host para cada nó listado no arquivo de configuração de um cluster NDB.

+ O `processes` mostra informações sobre os nós atualmente conectados ao clúster; essas informações incluem o nome do processo e o ID do processo do sistema; para cada nó de dados e nó SQL, também mostra o ID do processo do processo anjo do nó. Além disso, a tabela mostra um endereço de serviço para cada nó conectado; esse endereço pode ser definido em aplicativos da API NDB usando o método `Ndb_cluster_connection::set_service_uri()`, que também é adicionado no NDB 7.6.

* **Nome do sistema.** O nome do sistema de um clúster NDB pode ser usado para identificar um clúster específico. No NDB 7.6, o MySQL Server exibe esse nome como o valor da variável de status `Ndb_system_name`; os aplicativos da API NDB podem usar o método `Ndb_cluster_connection::get_system_name()`, que é adicionado na mesma versão.

Um nome do sistema baseado no momento em que o servidor de gerenciamento foi iniciado é gerado automaticamente; você pode substituir esse valor adicionando uma seção `[system]` ao arquivo de configuração do clúster e definindo o parâmetro `Name` para um valor de sua escolha nesta seção, antes de iniciar o servidor de gerenciamento.

* **ferramenta de importação CSV ndb\_import.** **ndb\_import**, adicionada no NDB Cluster 7.6, carrega dados formatados em CSV diretamente em uma tabela `NDB` usando a API NDB (um servidor MySQL é necessário apenas para criar a tabela e o banco de dados em que ela está localizada). **ndb\_import** pode ser considerado um análogo de **mysqlimport** ou da declaração SQL `LOAD DATA`, e suporta muitas das mesmas ou opções semelhantes para formatação dos dados.

Supondo que o banco de dados e a tabela alvo `NDB` existam, o **ndb\_import** precisa apenas de uma conexão com o servidor de gerenciamento do clúster (**ndb\_mgmd**) para realizar a importação; por essa razão, deve haver um slot `[api]` disponível para a ferramenta no arquivo do clúster `config.ini`.

Veja a Seção 21.5.14, “ndb\_import — Importar dados CSV no NDB”, para mais informações.

* **ferramenta de monitoramento ndb\_top.** Foi adicionado o utilitário **ndb\_top**, que exibe informações de carga e uso da CPU para um nó de dados `NDB` em tempo real. Essas informações podem ser exibidas em formato de texto, como um gráfico ASCII ou ambos. O gráfico pode ser exibido em cores ou usando escala de cinza.

**ndb\_top** se conecta a um nó SQL de NDB Cluster (ou seja, um servidor MySQL). Por essa razão, o programa deve ser capaz de se conectar como um usuário MySQL com o privilégio `SELECT` em tabelas no banco de dados `ndbinfo`.

**ndb\_top** está disponível para plataformas Linux, Solaris e macOS, mas atualmente não está disponível para plataformas Windows.

Para mais informações, consulte a Seção 21.5.29, “ndb\_top — Ver informações de uso de CPU para threads NDB”.

* **Limpeza do código.** Um número significativo de declarações de depuração e impressões não necessárias para operações normais foram movidas para código usado apenas durante testes ou depuração `NDB`, ou dispensadas completamente. Essa remoção de sobrecarga deve resultar em uma melhoria notável no desempenho dos threads LDM e TC na ordem de 10% em muitos casos.

* Melhorias no thread LDM e no LCP. Anteriormente, quando um thread de gerenciamento de dados local sofria com atraso de I/O, ele escrevia para pontos de verificação locais mais lentamente. Isso poderia acontecer, por exemplo, durante uma condição de sobrecarga de disco. Problemas poderiam ocorrer porque outros threads LDM nem sempre observavam esse estado, ou não faziam. `NDB` agora rastreia o modo de atraso de I/O globalmente, de modo que esse estado é relatado assim que pelo menos um thread está escrevendo no modo de atraso de I/O; então, ele garante que a velocidade de escrita reduzida para este LCP seja aplicada para todos os threads LDM durante a duração da condição de desaceleração. Como a redução na velocidade de escrita agora é observada por outras instâncias LDM, a capacidade geral é aumentada; isso permite que a sobrecarga de disco (ou outra condição que induz atraso de I/O) seja superada mais rapidamente nesses casos do que era anteriormente.

* **Identificação de erros do NDB.** Mensagens de erro e informações podem ser obtidas usando o cliente **mysql** no NDB 7.6 a partir de uma nova tabela `error_messages` no banco de dados de informações `ndbinfo`. Além disso, o NDB 7.6 introduz um novo cliente de string de comando **ndb_perror** para obter informações dos códigos de erro do NDB; isso substitui o uso de **perror** com `--ndb`, que agora é desatualizado e sujeito à remoção em uma versão futura.

Para mais informações, consulte a Seção 21.6.15.21, “A tabela ndbinfo error\_messages”, e a Seção 21.5.17, “ndb\_perror — Obtenha informações sobre mensagens de erro NDB”.

* **Melhorias no SPJ.** Ao executar um varrimento como uma junção empurrada (ou seja, a raiz da consulta é um varrimento), o bloco `DBTC` envia um pedido SPJ para uma instância `DBSPJ` no mesmo nó que o fragmento a ser varrido. Anteriormente, um desses pedidos era enviado para cada um dos fragmentos do nó. Como o número de instâncias `DBTC` e `DBSPJ` normalmente é definido menor que o número de instâncias LDM, isso significa que todas as instâncias SPJ estavam envolvidas na execução de uma única consulta, e, de fato, algumas instâncias SPJ poderiam (e fizeram) receber múltiplos pedidos da mesma consulta. O NDB 7.6 permite que um único pedido SPJ lide com um conjunto de fragmentos raiz a serem varridos, de modo que apenas um único pedido SPJ (`SCAN_FRAGREQ`) precisa ser enviado para qualquer instância SPJ (bloco `DBSPJ`) em cada nó.

Como o `DBSPJ` consome uma quantidade relativamente pequena da CPU total usada ao avaliar uma junção empurrada, ao contrário do bloco LDM (que é responsável pela maioria do uso da CPU), a introdução de vários blocos SPJ adiciona algum paralelismo, mas o custo adicional também aumenta. Ao permitir que um único pedido SPJ lide com um conjunto de fragmentos raiz a serem examinados, de modo que apenas um único pedido SPJ seja enviado para cada instância do `DBSPJ` em cada nó e tamanhos de lote sejam alocados por fragmento, a varredura de múltiplos fragmentos pode obter um tamanho total de lote maior, permitindo que algumas otimizações de agendamento sejam feitas dentro do bloco SPJ, que pode examinar um único fragmento de cada vez (dando-lhe a alocação total do tamanho do lote), varrendo todos os fragmentos em paralelo usando sub-lote menores, ou alguma combinação dos dois.

Espera-se que este trabalho aumente o desempenho das junções deslocadas pelas seguintes razões:

+ Como vários fragmentos de raiz podem ser verificados para cada solicitação SPJ, é necessário solicitar menos instâncias SPJ ao executar uma junção empurrada.

+ A alocação de tamanho de lote disponível aumentada, e para cada fragmento, também deve resultar, na maioria dos casos, em menos solicitações necessárias para completar uma junção.

* **Melhoria no tratamento do O\_DIRECT para logs de refazer.** O NDB 7.6 fornece um novo parâmetro de configuração do nó de dados `ODirectSyncFlag` que faz com que as escritas de logs de refazer concluídas usando `O_DIRECT` serem tratadas como chamadas de `fsync`. `ODirectSyncFlag` é desativado por padrão; para ativá-lo, configure-o para `true`.

Você deve ter em mente que o valor definido para este parâmetro é ignorado quando pelo menos uma das seguintes condições for verdadeira:

+ `ODirect` não está habilitado.

+ `InitFragmentLogFiles` é definido como `SPARSE`.

* **Bloqueio de CPUs para threads de construção de índices offline.** No NDB 7.6, as construções de índices offline, por padrão, usam todos os núcleos disponíveis para **ndbmtd"), em vez de serem limitadas ao único núcleo reservado para o thread de E/S. Também se torna possível especificar um conjunto desejado de núcleos a serem usados para threads de E/S que realizam construções multithread ordenadas de índices ordenados. Isso pode melhorar os tempos de reinício e restauração e o desempenho, além da disponibilidade.

Nota

"Offline", como usado aqui, refere-se a uma construção de índice ordenada que ocorre enquanto uma determinada tabela não está sendo escrita. Tais construções de índice ocorrem durante o reinício de um nó ou sistema, ou ao restaurar um clúster a partir de um backup usando **ndb\_restore** `--rebuild-indexes`.

Essa melhoria envolve várias mudanças relacionadas. A primeira delas é alterar o valor padrão do parâmetro de configuração `BuildIndexThreads` (de 0 para 128), o que significa que as construções de índices solicitados offline agora são multithreadadas por padrão. O valor padrão do `TwoPassInitialNodeRestartCopy` também é alterado (de `false` para `true`), de modo que um reinício inicial do nó primeiro copie todos os dados sem a criação de índices a partir de um nó "ativo" para o nó que está sendo iniciado, constrói os índices ordenados offline após os dados terem sido copiados, e depois, novamente, sincroniza com o nó ativo; isso pode reduzir significativamente o tempo necessário para a construção de índices. Além disso, para facilitar o bloqueio explícito de threads de construção de índices offline para CPUs específicas, um novo tipo de thread (`idxbld`) é definido para o parâmetro de configuração `ThreadConfig`.

Como parte desse trabalho, o `NDB` pode agora distinguir entre os tipos de threads de execução e outros tipos de threads, e entre os tipos de threads que são permanentemente atribuídos a tarefas específicas e aqueles cujas atribuições são meramente temporárias.

O NDB 7.6 também introduz o parâmetro `nosend` para `ThreadCOnfig`. Ao definir esse valor para 1, você pode manter um `main`, `ldm`, `rep` ou `tc` de thread que não ajude os threads de envio. Esse parâmetro é 0 por padrão e não pode ser usado com threads de E/S, threads de envio, threads de construção de índice ou threads de vigilância.

Para informações adicionais, consulte as descrições dos parâmetros.

* **Tamanhos variáveis de lote para operações de dados em lote DDL.** Como parte do trabalho em andamento para otimizar o desempenho de DDL em lote por **ndbmtd"), agora é possível obter melhorias de desempenho aumentando o tamanho do lote para as partes de dados em lote das operações DDL que processam dados usando varreduras. Os tamanhos de lote agora são configuráveis para construções de índice único, construções de chave estrangeira e reorganização online, definindo os respectivos parâmetros de configuração do nó de dados listados aqui:

+ `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura usado para criar chaves únicas.

+ `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura usado para a construção de chaves estrangeiras.

+ `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura usado para reorganização de partições de tabela.

Para cada um dos parâmetros listados acima, o valor padrão é 64, o mínimo é 16 e o máximo é 512.

Aumentar o tamanho ou os tamanhos apropriados do lote pode ajudar a amortizar as latências entre threads e entre nós e utilizar mais recursos paralelos (locais e remotos) para ajudar a escalar o desempenho do DDL. Em cada caso, pode haver um compromisso com o tráfego contínuo.

* **LCPs parciais.** O NDB 7.6 implementa pontos de verificação locais parciais. Anteriormente, um LCP sempre fazia uma cópia de todo o banco de dados. Ao trabalhar com terabytes de dados, esse processo poderia exigir um grande tempo, com um impacto adverso, especialmente em reinicializações de nós e clusters, além de mais espaço para os registros de revisão. Agora, não é mais estritamente necessário que os LCPs façam isso — em vez disso, um LCP agora, por padrão, salva apenas um número de registros que é baseado na quantidade de dados alterados desde o LCP anterior. Isso pode variar entre um ponto de verificação completo e um ponto de verificação que não altera nada. No caso de o ponto de verificação refletir quaisquer alterações, o mínimo é escrever uma parte dos 2048 que compõem um LCP local.

Como parte dessa mudança, dois novos parâmetros de configuração de nós de dados são introduzidos nesta versão: `EnablePartialLcp` (padrão `true`, ou ativado) habilita LCPs parciais. `RecoveryWork` controla a porcentagem de espaço dada para LCPs; ele aumenta com a quantidade de trabalho que deve ser realizada em LCPs durante reinicializações, em oposição àquela realizada durante operações normais. Aumentar esse valor faz com que LCPs durante operações normais precisem escrever menos registros e, portanto, diminui a carga de trabalho usual. Aumentar esse valor também significa que as reinicializações podem levar mais tempo.

Você deve desabilitar LCPs parciais explicitamente, definindo `EnablePartialLcp=false`. Isso utiliza a menor quantidade de disco, mas também tende a maximizar a carga de escrita para LCPs. Para otimizar a menor carga de trabalho em LCPs durante o funcionamento normal, use `EnablePartialLcp=true` e `RecoveryWork=100`. Para usar o menor espaço de disco para LCPs parciais, mas com escritas limitadas, use `EnablePartialLcp=true` e `RecoveryWork=25`, que é o mínimo para `RecoveryWork`. O padrão é `EnablePartialLcp=true` com `RecoveryWork=50`, o que significa que os arquivos LCP requerem aproximadamente 1,5 vezes `DataMemory`; usando `CompressedLcp=1`, isso pode ser reduzido pela metade. Os tempos de recuperação usando as configurações padrão também devem ser muito mais rápidos do que quando `EnablePartialLcp` é definido como `false`.

Nota

O valor padrão para `RecoveryWork` foi aumentado de 50 para 60.

Além disso, os parâmetros de configuração do nó de dados `BackupDataBufferSize`, `BackupWriteSize` e `BackupMaxWriteSize` são todos obsoletos e estarão sujeitos à remoção em uma versão futura do MySQL NDB Cluster.

Como parte dessa melhoria, foi feito um trabalho para corrigir vários problemas com reinício de nós, nos quais era possível ficar sem o registro de desfazer em várias situações, geralmente quando se restaura um nó que havia parado por um longo período durante um período de atividade de escrita intensiva.

Foi realizado um trabalho adicional para melhorar a sobrevivência dos nós de dados em longos períodos de sincronização sem expiração de tempo, atualizando o mecanismo de vigilância LCP durante esse processo e mantendo um melhor acompanhamento do progresso da sincronização dos dados do disco. Anteriormente, havia a possibilidade de alertas falsos ou até mesmo falhas nos nós se a sincronização durasse mais do que o tempo de expiração do mecanismo de vigilância LCP.

Importante

Ao atualizar um NDB Cluster que usa tabelas de dados em disco para o NDB 7.6 ou ao fazer uma atualização para uma versão anterior do NDB 7.6, é necessário reiniciar todos os nós de dados com `--initial`.

* **Processamento em paralelo de registros do log de desfazer.** Anteriormente, o bloco de kernel do nó de dados `LGMAN` processava os registros do log de desfazer de forma serial; agora, isso é feito em paralelo. O thread de replicação, que entrega os registros de desfazer para os threads do LDM, aguardava que um LDM terminasse a aplicação de um registro antes de buscar o próximo; agora, o thread de replicação não aguarda mais, mas prossegue imediatamente para o próximo registro e LDM.

Um contagem do número de registros de log pendentes para cada LDM em `LGMAN` é mantida e decrementada sempre que um LDM concluiu a execução de um registro. Todos os registros pertencentes a uma página são enviados para o mesmo thread do LDM, mas não há garantia de que sejam processados em ordem, portanto, um mapa de hash de páginas que têm registros pendentes mantém uma fila para cada uma dessas páginas. Quando a página está disponível no cache de página, todos os registros pendentes na fila são aplicados em ordem.

Alguns tipos de registros continuam a ser processados em série: `UNDO_LCP`, `UNDO_LCP_FIRST`, `UNDO_LOCAL_LCP`, `UNDO_LOCAL_LCP_FIRST`, `UNDO_DROP` e `UNDO_END`.

Não há alterações visíveis aos usuários na funcionalidade diretamente associadas a essa melhoria de desempenho; faz parte do trabalho realizado para melhorar o recurso de desfazer longas manipulações em suporte a pontos de verificação locais parciais no NDB Cluster 7.6.

* **Leitura de IDs da tabela e fragmentos do registro de desfazer para aplicador de registro de desfazer.** Ao aplicar um registro de desfazer, é necessário obter o ID da tabela e o ID do fragmento a partir do ID da página. Isso era feito anteriormente lendo a página do bloco do kernel `PGMAN` usando um thread adicional do trabalhador `PGMAN`, mas ao aplicar o registro de desfazer, era necessário ler a página novamente.

Ao usar `O_DIRECT`, isso era muito ineficiente, pois a página não estava cacheada no kernel do sistema operacional. Para corrigir esse problema, o mapeamento do ID da página para o ID da tabela e o ID do fragmento agora é feito usando informações do cabeçalho de extensão, os IDs de tabela e ID de fragmento para as páginas usadas dentro de uma determinada extensão. As páginas de extensão estão sempre presentes no cache de páginas, então não são necessárias leituras extras do disco para realizar o mapeamento. Além disso, as informações já podem ser lidas, usando estruturas de dados de blocos de kernel existentes `TSMAN`.

Veja a descrição do parâmetro de configuração do nó de dados `ODirect`, para mais informações.

* **Transportador de memória compartilhada.** As conexões de memória compartilhada (SHM) definidas pelo usuário entre um nó de dados e um nó de API no mesmo computador host são totalmente suportadas no NDB 7.6 e não são mais consideradas experimentais. Você pode habilitar uma conexão explícita de memória compartilhada definindo o parâmetro de configuração `UseShm` para `1` para o nó de dados relevante. Quando você define explicitamente a memória compartilhada como o método de conexão, também é necessário que tanto o nó de dados quanto o nó de API sejam identificados por `HostName`.

A execução de conexões SHM pode ser aprimorada ao definir parâmetros como `ShmSize`, `ShmSpintime` e `SendBufferMemory` em uma seção `[shm]` ou `[shm default]` do arquivo de configuração do clúster (`config.ini`). A configuração do SHM é, de outra forma, semelhante à do transportador TCP.

O parâmetro `SigNum` não é utilizado na nova implementação do SHM, e quaisquer configurações feitas para ele são ignoradas. A Seção 21.4.3.12, “Conexões de Memória Compartilhada de NDB Cluster”, fornece mais informações sobre esses parâmetros. Além disso, como parte desse trabalho, o código `NDB` relacionado ao antigo transportador SCI foi removido.

Para mais informações, consulte a Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”.

* **Otimização da junção interna do bloco SPJ.** No NDB 7.6, o bloco de kernel `SPJ` pode levar em consideração quando está avaliando uma solicitação de junção na qual pelo menos algumas das tabelas são JOINADAS INTERNAS. Isso significa que ele pode eliminar solicitações para strings, faixas ou ambas assim que se tornar conhecido que uma ou mais das solicitações anteriores não retornaram nenhum resultado para uma string pai. Isso economiza tanto os nós de dados quanto o bloco `SPJ` de terem que lidar com solicitações e strings de resultado que nunca participam de uma string de resultado JOINADA INTERNA.

Considere esta consulta de junção, onde `pk` é a chave primária nas tabelas t2, t3 e t4, e as colunas x, y e z são colunas não indexadas:

  ```sql
  SELECT * FROM t1
    JOIN t2 ON t2.pk = t1.x
    JOIN t3 ON t3.pk = t1.y
    JOIN t4 ON t4.pk = t1.z;
  ```

Anteriormente, isso resultava em um pedido `SPJ` que incluía uma varredura na tabela `t1`, e pesquisas em cada uma das tabelas `t2`, `t3` e `t4`; essas foram avaliadas para cada string retornada de `t1`. Para essas, `SPJ` criou pedidos `LQHKEYREQ` para as tabelas `t2`, `t3` e `t4`. Agora, `SPJ` leva em consideração a exigência de que, para produzir quaisquer strings de resultado, uma junção interna deve encontrar uma correspondência em todas as tabelas juncionadas; assim que não forem encontradas correspondências para uma das tabelas, quaisquer pedidos adicionais para tabelas com o mesmo pai ou tabelas são ignorados.

Nota

Essa otimização não pode ser aplicada até que todos os nós de dados e todos os nós da API no clúster tenham sido atualizados para o NDB 7.6.

* **Ferramenta de despertar do NDB.** `NDB` utiliza um receptor de sondagem para ler dos soquetes, executar mensagens dos soquetes e despertar outros threads. Ao fazer uso intermitente apenas de um thread de recepção, a propriedade do poll é dada em desuso antes de começar a despertar outros threads, o que proporciona algum grau de paralelismo no thread de recepção, mas, ao fazer uso constante do thread de recepção, o thread pode ser sobrecarregado por tarefas, incluindo o despertar de outros threads.

O NDB 7.6 suporta a transferência de carga do thread receptor da tarefa de acordar outros threads para um novo thread que acorda outros threads mediante solicitação (e, de outra forma, simplesmente dorme), tornando possível melhorar a capacidade de uma conexão única de cluster em aproximadamente de dez a vinte por cento.

* Controle adaptativo do LCP.

O NDB 7.6.7 implementa um mecanismo de controle LCP adaptativo que atua em resposta a mudanças no uso do espaço do log de revisão. Ao controlar a velocidade de escrita do disco LCP, você pode ajudar a proteger contra vários problemas relacionados a recursos, incluindo os seguintes:

+ Recursos insuficientes de CPU para aplicações de tráfego
+ Sobrecarga de disco
+ Buffer de log de revisão insuficiente
+ Condições de parada do GCP
+ Espaço insuficiente para o log de revisão
+ Espaço insuficiente para o log de desfazer

Este trabalho inclui as seguintes alterações relacionadas aos parâmetros de configuração de `NDB`:

+ O valor padrão do parâmetro do nó de dados `RecoveryWork` é aumentado de 50 para 60; ou seja, `NDB` agora usa 1,6 vezes o tamanho dos dados para armazenamento de LCPs.

Um novo parâmetro de configuração de nó de dados `InsertRecoveryWork` oferece capacidades de ajuste adicionais, controlando a porcentagem de `RecoveryWork` que é reservada para operações de inserção. O valor padrão é 40 (ou seja, 40% do espaço de armazenamento já reservado por `RecoveryWork`); o mínimo e o máximo são, respectivamente, 0 e 70. Aumentar esse valor permite que mais escritas sejam realizadas durante um LCP, enquanto limita o tamanho total do LCP. Diminuir `InsertRecoveryWork` limita o número de escritas utilizadas durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo.

Este trabalho implementa o controle da velocidade do LCP principalmente para minimizar o risco de esgotamento do log de refazer. Isso é feito de forma adaptativa, com base na quantidade de espaço de log de refazer utilizada, usando os níveis de alerta, com as respostas tomadas quando esses níveis são atingidos, mostrados aqui:

+ **Baixo**: O uso do espaço do log de refazer é maior que 25%, ou o uso estimado mostra espaço insuficiente para o log de refazer em uma taxa de transação muito alta. Em resposta, o uso dos buffers de dados LCP é aumentado durante as varreduras LCP, a prioridade das varreduras LCP é aumentada e a quantidade de dados que pode ser escrita por quebra em tempo real em uma varredura LCP também é aumentada.

+ **Alto**: O uso do espaço do log de refazer é maior que 40%, ou estima-se que o espaço do log de refazer acabe em uma taxa de transações alta. Quando esse nível de uso é atingido, `MaxDiskWriteSpeed` é aumentado para o valor de `MaxDiskWriteSpeedOtherNodeRestart`. Além disso, a velocidade mínima é duplicada e a prioridade dos varreduros LCP e o que pode ser escrito por quebra em tempo real são aumentados ainda mais.

+ **Crítica**: O uso do espaço do log de refazer é maior que 60%, ou o uso estimado mostra espaço insuficiente para o log de refazer em uma taxa de transação normal. Neste nível, `MaxDiskWriteSpeed` é aumentado para o valor de `MaxDiskWriteSpeedOwnRestart`; `MinDiskWriteSpeed` também é definido para este valor. A prioridade das varreduras LCP e a quantidade de dados que podem ser escritos por quebra em tempo real são aumentadas ainda mais, e o buffer de dados LCP está completamente disponível durante a varredura LCP.

Aumentar o nível também tem o efeito de aumentar a velocidade calculada do ponto de verificação.

O controle LCP oferece os seguintes benefícios para as instalações de `NDB`:

+ Os clusters devem agora sobreviver a cargas muito pesadas usando configurações padrão muito melhor do que antes.

Agora, deve ser possível que o `NDB` funcione de forma confiável em sistemas onde o espaço disponível no disco é (como mínimo) 2,1 vezes a quantidade de memória alocada para ele (`DataMemory`). Você deve notar que esse número *não* inclui qualquer espaço de disco usado para as tabelas de Dados do disco.

* **opções de ndb\_restore.** A partir do NDB 7.6.9, as opções `--nodeid` e `--backupid` são necessárias ao invocar **ndb\_restore**.

* **Restauração por fatias.** A partir do NDB 7.6.13, é possível dividir um backup em porções aproximadamente iguais (fatias) e restaurar essas fatias em paralelo usando duas novas opções implementadas para **ndb_restore**:

+ `--num-slices` determina o número de fatias em que o backup deve ser dividido.

+ `--slice-id` fornece o ID do corte que será restaurado pela instância atual de **ndb_restore**.

Isso permite que você utilize múltiplas instâncias de **ndb\_restore** para restaurar subconjuntos do backup em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

Para mais informações, consulte a descrição da opção **ndb\_restore** `--num-slices`.

* **ndb\_restore: mudanças no esquema da chave primária.** O NDB 7.6.14 (e versões posteriores) suporta diferentes definições de chave primária para as tabelas de origem e destino ao restaurar um backup nativo `NDB` com **ndb\_restore** quando executado com a opção `--allow-pk-changes`. Ambos os casos de aumento e diminuição do número de colunas que compõem a chave primária original são suportados.

Quando a chave primária é estendida com uma ou mais colunas adicionais, todas as colunas adicionadas devem ser definidas como `NOT NULL`, e nenhum valor em quaisquer dessas colunas pode ser alterado durante o período em que o backup está sendo realizado. Como algumas aplicações definem todos os valores das colunas em uma string ao atualizá-la, independentemente de todos os valores realmente serem alterados, isso pode causar o falha de uma operação de restauração, mesmo que nenhum valor na coluna que será adicionada à chave primária tenha sido alterado. Você pode sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates` também adicionada no NDB 7.6.14; nesse caso, você deve garantir que nenhum desses valores seja alterado.

Uma coluna pode ser removida da chave primária da tabela, independentemente de essa coluna permanecer ou não como parte da tabela.

Para mais informações, consulte a descrição da opção `--allow-pk-changes` para **ndb_restore**.

* **Melhorias na ferramenta ndb\_blob\_tool.** A partir do NDB 7.6.14, a ferramenta **ndb\_blob\_tool** pode detectar partes de blob ausentes para as quais existem partes em string e substituí-las com partes de blob de espaço (compostas por caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes com marcadores, use a opção `--add-missing`.

Para mais informações, consulte a Seção 21.5.6, “ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”.

* **Mesclagem de backups com ndb\_restore.** Em alguns casos, pode ser desejável consolidar os dados originalmente armazenados em diferentes instâncias do NDB Cluster (todos usando o mesmo esquema) em um único NDB Cluster de destino. Isso agora é suportado ao usar backups criados no cliente **ndb\_mgm** (consulte Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e restaurá-los com **ndb\_restore**, usando a opção `--remap-column` adicionada no NDB 7.6.14 juntamente com `--restore-data` (e possivelmente opções adicionais compatíveis, conforme necessário ou desejado). `--remap-column` pode ser empregado para lidar com casos em que os valores primários e exclusivos de chave estão sobrepostos entre os clusters de origem, e é necessário que eles não se sobreponham no cluster de destino, bem como para preservar outras relações entre tabelas, como chaves estrangeiras.

`--remap-column` aceita como argumento uma string com o formato `db.tbl.col:fn:args`, onde *`db`*, *`tbl`* e *`col`* são, respectivamente, os nomes do banco de dados, tabela e coluna, *`fn`* é o nome de uma função de mapeo, e *`args`* são um ou mais argumentos para *`fn`*. Não há valor padrão. Apenas *`offset`* é suportado como o nome da função, com *`args`* como o deslocamento inteiro a ser aplicado ao valor da coluna ao inseri-la na tabela de destino a partir do backup. Esta coluna deve ser uma das `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT); o intervalo permitido do valor do deslocamento é o mesmo que a versão assinada desse tipo (isso permite que o deslocamento seja negativo, se desejado).

A nova opção pode ser usada várias vezes na mesma invocação do **ndb\_restore**, para que você possa remappear para novos valores várias colunas da mesma tabela, diferentes tabelas ou ambas. O valor de deslocamento não precisa ser o mesmo para todas as instâncias da opção.

Além disso, duas novas opções são fornecidas para **ndb\_desc**, também começando no NDB 7.6.14:

+ `--auto-inc` (forma abreviada `-a`): Inclui o próximo valor de autoincremento na saída, se a tabela tiver uma coluna `AUTO_INCREMENT`.

+ `--context` (forma abreviada `-x`): Fornece informações adicionais sobre a tabela, incluindo o esquema, o nome do banco de dados, o nome da tabela e o ID interno.

Para mais informações e exemplos, consulte a descrição da opção `--remap-column`.

* **opção --ndb-log-fail-terminate.** A partir do NDB 7.6.14, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de string completamente. Isso pode ser feito iniciando `mysqld` com a opção `--ndb-log-fail-terminate`.

* **Programas do NDB—remoção da dependência do NDBT.** A dependência de vários programas de utilitário `NDB` da biblioteca `NDBT` foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nesses programas pode levar a problemas indesejados durante os testes.

Os programas afetados estão listados aqui, juntamente com as versões `NDB` nas quais a dependência foi removida:

+ **ndb\_restore**, em NDB 7.6.11
  + **ndb\_show\_tables**, em NDB 7.6.14
  + **ndb\_waiter**, em NDB 7.6.14

O principal efeito dessa alteração para os usuários é que esses programas não imprimem `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao atualizar para as versões indicadas.

* **Depreciação e remoção do Auto-Installer.** A ferramenta de instalação baseada na web do MySQL NDB Cluster Auto-Installer (**ndb_setup.py**) é depreciada no NDB 7.6.16 e removida no NDB 7.6.17 e versões posteriores. Ela não é mais suportada.

* **descontinuidade e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi descontinuado no NDB 7.6.16 e removido no NDB 7.6.17.

* **Suporte para Node.js removido.** A partir da versão NDB Cluster 7.6.16, o suporte para Node.js pelo NDB 7.6 foi removido.

O suporte para Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

* **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 7.6.19, o **ndb_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

+ Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

A coluna originalmente declarada como `NULL` não deve conter nenhuma string `NULL`; se o fizer, o **ndb\_restore** sai com um erro.

+ Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

Para mais informações, consulte as descrições das opções de **ndb\_restore** indicadas.

* Suporte ao OpenSSL 3.0. A partir do NDB 7.6.27, todos os binários do servidor e cliente MySQL incluídos na distribuição `NDB` são compilados com suporte ao OpenSSL 3.0

* **mysql client --commands opção.** A opção **mysql** client `--commands`, adicionada no NDB 7.6.35, habilita ou desabilita a maioria dos comandos do cliente **mysql**.

Essa opção é ativada por padrão. Para desativá-la, inicie o cliente **mysql** com `--commands=OFF` ou `--skip-commands`.

Para mais informações, consulte a Seção 4.5.1.1, “Opções do cliente do MySQL”.

### 21.2.5 NDB: Opções, variáveis e parâmetros adicionados, descontinuados e removidos

#### 21.2.5.1 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.5

* Parâmetros Introduzidos no NDB 7.5
* Parâmetros Descontinuados no NDB 7.5
* Parâmetros Retirados no NDB 7.5
* Opções e Variáveis Introduzidas no NDB 7.5
* Opções e Variáveis Descontinuadas no NDB 7.5
* Opções e Variáveis Retiradas no NDB 7.5

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB `mysqld` que foram adicionadas, descontinuadas ou removidas do NDB 7.5.

##### Parâmetros Introduzidos no NDB 7.5

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 7.5.

* `ApiVerbose`: Habilitar depuração da API NDB; para desenvolvimento do NDB. Adicionada no NDB 7.5.2.

##### Parâmetros descontinuados no NDB 7.5

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 7.5.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Descontinuada no NDB 7.5.0.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Descontinuada no NDB 7.5.0.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Descontinuada no NDB 7.5.0.

##### Parâmetros removidos na NDB 7.5

Os seguintes parâmetros de configuração de nó foram removidos no NDB 7.5.

* `DiskCheckpointSpeed`: Bytes permitidos para serem escritos por ponto de verificação, por segundo. Removido no NDB 7.5.0.

* `DiskCheckpointSpeedInRestart`: Bytes permitidos para serem escritos pelo ponto de verificação durante o reinício, por segundo. Removido no NDB 7.5.0.

* `Id`: Número que identifica o nó de dados. Agora desatualizado; use NodeId. Removido no NDB 7.5.0.

* `MaxNoOfSavedEvents`: Não utilizado. Removido na NDB 7.5.0.

* `PortNumber`: Porto utilizado para transportador de SCI. Removido no NDB 7.5.1.

* `PortNumber`: Porto utilizado para transportador SHM. Removido no NDB 7.5.1.

* `PortNumber`: Porto utilizado para transportador TCP. Removido no NDB 7.5.1.

* `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado. Removido no NDB 7.5.2.

##### Opções e Variáveis Introduzidas no NDB 7.5

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 7.5.

* `Ndb_system_name`: Nome do sistema de clúster configurado; vazio se o servidor não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.5.7.

* `ndb-allow-copying-alter-table`: Definido como OFF para evitar que a ALTER TABLE use operações de cópia em tabelas NDB. Adicionado no NDB 5.7.10-ndb-7.5.0.

* `ndb-cluster-connection-pool-nodeids`: Lista de IDs de nó separados por vírgula para conexões ao clúster usadas pelo MySQL; o número de nós na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool. Adicionada no NDB 5.7.10-ndb-7.5.0.

* `ndb-default-column-format`: Use este valor (FIXO ou DINÂMICO) como padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de tabela. Adicionado em NDB 5.7.11-ndb-7.5.1.

* `ndb-log-fail-terminate`: Finalize o processo mysqld se a registro completo de todos os eventos de string encontrados não for possível. Adicionada no NDB 5.7.29-ndb-7.5.18.

* `ndb-log-update-minimal`: Atualizações de log em formato mínimo. Adicionada no NDB 5.7.18-ndb-7.5.7.

* `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" a este servidor MySQL, para indicação de transações e tabelas totalmente replicadas. Adicionado no NDB 5.7.12-ndb-7.5.2.

* `ndb_default_column_format`: Define o formato de string e o formato de coluna padrão (FIXO ou DINÂMICO) usado para novas tabelas NDB. Adicionado no NDB 5.7.11-ndb-7.5.1.

* `ndb_fully_replicated`: Se as novas tabelas NDB são totalmente replicadas. Adicionada no NDB 5.7.12-ndb-7.5.2.

* `ndb_read_backup`: Habilitar a leitura em qualquer réplica para todas as tabelas NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais. Adicionado no NDB 5.7.12-ndb-7.5.2.

##### Opções e variáveis descontinuadas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção do servidor foi descontinuada no NDB 7.5.

##### Opções e variáveis removidas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção foi removida no NDB 7.5.

#### 21.2.5.2 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.6

* Parâmetros Introduzidos no NDB 7.6
* Parâmetros Descontinuados no NDB 7.6
* Parâmetros Retirados no NDB 7.6
* Opções e Variáveis Introduzidas no NDB 7.6
* Opções e Variáveis Descontinuadas no NDB 7.6
* Opções e Variáveis Retiradas no NDB 7.6

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB `mysqld` que foram adicionadas, descontinuadas ou removidas do NDB 7.6.

##### Parâmetros Introduzidos na NDB 7.6

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 7.6.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falha do nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é

10. Adicionada em NDB 7.6.34. * `EnablePartialLcp`: Habilitar LCP parcial (verdadeiro); se estiver desativado (falso), todos os LCP escrevem pontos de verificação completos. Adicionada em NDB 7.6.4.

* `EnableRedoControl`: Habilitar a velocidade de verificação adaptativa para o controle do uso do log de revisão. Adicionado no NDB 7.6.7.

* `InsertRecoveryWork`: Porcentagem de Trabalho de Recuperação usada para as strings inseridas; não tem efeito a menos que os pontos de verificação locais parciais estejam em uso. Adicionada no NDB 7.6.5.

* `LocationDomainId`: Atribua este nó da API a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo não definido. Adicionado no NDB 7.6.4.

* `LocationDomainId`: Atribua este nó de gerenciamento a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa isso não definido. Adicionado no NDB 7.6.4.

* `LocationDomainId`: Atribua este nó de dados a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo não definido. Adicionado no NDB 7.6.4.

* `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para reorganização de partições de tabela. Aumentar esse valor pode acelerar a reorganização de partições de tabela, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `ODirectSyncFlag`: As escritas O_DIRECT são tratadas como escritas sincronizadas; ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está configurado para SPARSE ou ambos. Adicionada no NDB 7.6.4.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros. Adicionado no NDB 7.6.6.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros. Adicionado no NDB 7.6.6.

* `RecoveryWork`: Porcentagem de sobrecarga de armazenamento para arquivos LCP: valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação. Adicionado no NDB 7.6.4.

* `SendBufferMemory`: Bytes no buffer de memória compartilhada para sinais enviados a partir deste nó. Adicionado no NDB 7.6.6.

* `ShmSpinTime`: Número de microsegundos para girar antes de dormir ao receber. Foi adicionado no NDB 7.6.6.

* `UseShm`: Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está sendo executado neste host. Adicionada no NDB 7.6.6.

* `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente mortos sempre que ocorrem problemas de watchdog; utilizado para testes e depuração. Adicionado no NDB 7.6.7.

##### Parâmetros descontinuados no NDB 7.6

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 7.6.

* `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes). Desatualizado no NDB 7.6.4.

* `BackupMaxWriteSize`: Tamanho máximo de escrita do sistema de arquivos feita pelo backup (em bytes). Desatualizado no NDB 7.6.4.

* `BackupWriteSize`: Tamanho padrão de escritas no sistema de arquivos feitas pelo backup (em bytes). Desatualizado no NDB 7.6.4.

* `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM disponível do sistema e ao tamanho da DataMemory. Desatualizado no NDB 7.6.2.

* `Signum`: Número de sinal a ser utilizado para sinalização. Desatualizado no NDB 7.6.6.

##### Parâmetros removidos na NDB 7.6

Nenhum parâmetro de configuração de nó foi removido no NDB 7.6.

##### Opções e Variáveis Introduzidas no NDB 7.6

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 7.6.

* `Ndb_system_name`: Nome do sistema de clúster configurado; vazio se o servidor não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.6.2.

* `ndb-log-fail-terminate`: Finalize o processo mysqld se a registro completo de todos os eventos de string encontrados não for possível. Adicionada no NDB 5.7.29-ndb-7.6.14.

* `ndb-log-update-minimal`: Atualizações de log em formato mínimo. Adicionada no NDB 5.7.18-ndb-7.6.3.

* `ndb_row_checksum`: Quando habilitado, defina verificações de checksum de string; habilitado por padrão. Adicionado no NDB 5.7.23-ndb-7.6.8.

##### Opções e variáveis descontinuadas no NDB 7.6

Nenhuma variável de sistema, variável de status ou opção do servidor foi descontinuada no NDB 7.6.

##### Opções e variáveis removidas no NDB 7.6

Nenhuma variável de sistema, variável de status ou opção foi removida no NDB 7.6.

### 21.2.6 Servidor MySQL usando InnoDB em comparação com NDB Cluster

O MySQL Server oferece várias opções de motores de armazenamento. Como tanto o `NDB` quanto o `InnoDB` podem servir como motores de armazenamento transacionais do MySQL, os usuários do MySQL Server às vezes se interessam pelo NDB Cluster. Eles veem o `NDB` como uma possível alternativa ou atualização para o motor de armazenamento padrão `InnoDB` no MySQL 5.7. Embora o `NDB` e o `InnoDB` compartilhem características comuns, há diferenças na arquitetura e implementação, de modo que algumas aplicações e cenários de uso existentes do MySQL Server podem ser adequados para o NDB Cluster, mas nem todas.

Nesta seção, discutimos e comparamos algumas características do motor de armazenamento `NDB` usado pelo NDB 7.5 com o `InnoDB` usado no MySQL 5.7. As próximas seções fornecem uma comparação técnica. Em muitos casos, as decisões sobre quando e onde usar o NDB Cluster devem ser tomadas caso a caso, levando em consideração todos os fatores. Embora esteja além do escopo desta documentação fornecer detalhes para cada cenário de uso concebível, também tentamos oferecer alguma orientação muito geral sobre a adequação relativa de alguns tipos comuns de aplicativos para `NDB` em oposição a `InnoDB` backends.

O NDB Cluster 7.5 utiliza um `mysqld` baseado no MySQL 5.7, incluindo suporte para `InnoDB` 1.1. Embora seja possível usar tabelas `InnoDB` com o NDB Cluster, essas tabelas não são agrupadas. Também não é possível usar programas ou bibliotecas de uma distribuição do NDB Cluster 7.5 com o MySQL Server 5.7, ou vice-versa.

Embora também seja verdade que alguns tipos de aplicações comerciais comuns podem ser executados tanto no NDB Cluster quanto no MySQL Server (com maior probabilidade usando o mecanismo de armazenamento `InnoDB`), existem algumas diferenças importantes de arquitetura e implementação. A Seção 21.2.6.1, “Diferenças entre os mecanismos de armazenamento NDB e InnoDB”, fornece um resumo dessas diferenças. Devido às diferenças, alguns cenários de uso são claramente mais adequados para um motor ou outro; veja a Seção 21.2.6.2, “Carga de trabalho NDB e InnoDB”. Isso, por sua vez, tem um impacto nos tipos de aplicações que são mais adequados para uso com `NDB` ou `InnoDB`. Consulte a Seção 21.2.6.3, “Resumo do uso de recursos NDB e InnoDB”, para uma comparação da adequação relativa de cada um para uso em tipos comuns de aplicações de banco de dados.

Para informações sobre as características relativas dos motores de armazenamento `NDB` e `MEMORY`, consulte Quando usar MEMÓRIA ou NDB Cluster.

Consulte o Capítulo 15, *Motores de Armazenamento Alternativos*, para obter informações adicionais sobre os motores de armazenamento do MySQL.

#### 21.2.6.1 Diferenças entre os motores de armazenamento NDB e InnoDB

O motor de armazenamento `NDB` é implementado usando uma arquitetura distribuída e sem compartilhamento, o que faz com que ele se comporte de maneira diferente do `InnoDB` de várias maneiras. Para aqueles não acostumados a trabalhar com `NDB`, comportamentos inesperados podem surgir devido à sua natureza distribuída em relação a transações, chaves estrangeiras, limites de tabela e outras características. Isso é mostrado na tabela a seguir:

**Tabela 21.1 Diferenças entre os motores de armazenamento InnoDB e NDB**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Feature</th> <th><code>InnoDB</code> (MySQL 5.7)</th> <th><code>NDB</code> 7.5/7.6</th> </tr></thead><tbody><tr> <th><em>MySQL Server Version</em></th> <td>5.7</td> <td>5.7</td> </tr><tr> <th><em><code>InnoDB</code> Version </em></th> <td><code>InnoDB</code> 5.7.44</td> <td><code>InnoDB</code> 5.7.44</td> </tr><tr> <th><em>NDB Cluster Version</em></th> <td>N/A</td> <td><code>NDB</code> 7.5.36/7.6.36</td> </tr><tr> <th><em>Limites de armazenamento</em></th> <td>64 TB</td> <td>128 TB (a partir da NDB 7.5.2)</td> </tr><tr> <th><em>Foreign Keys</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>Transactions</em></th> <td>All standard types</td> <td><code>READ COMMITTED</code></td> </tr><tr> <th><em>MVCC</em></th> <td>Yes</td> <td>No</td> </tr><tr> <th><em>Compressão de dados</em></th> <td>Sim</td> <td>Não (os arquivos de verificação e de backup do NDB podem ser comprimidos)</td> </tr><tr> <th><em>Suporte para strings grandes (&gt; 14K)</em></th> <td>Suportado para<code>VARBINARY</code>,<code>VARCHAR</code>,<code>BLOB</code>, e<code>TEXT</code>colunas</td> <td>Suportado para<code>BLOB</code>e<code>TEXT</code>colunas apenas (Usar esses tipos para armazenar grandes quantidades de dados pode reduzir o desempenho do NDB)</td> </tr><tr> <th><em>Suporte à replicação</em></th> <td>Replicação assíncrona e semiesincrônica usando MySQL Replication; MySQL<a class="link" href="group-replication.html" title="Chapter 17 Group Replication">Replicação em grupo</a></td> <td>Replicação síncrona automática dentro de um NDB Cluster; replicação assíncrona entre NDB Clusters, usando MySQL Replication (A replicação semi-síncrona não é suportada)</td> </tr><tr> <th><em>Escalabilidade para operações de leitura</em></th> <td>Sim (Replicação MySQL)</td> <td>Sim (partição automática no NDB Cluster; Replicação do NDB Cluster)</td> </tr><tr> <th><em>Escalabilidade para operações de escrita</em></th> <td>Requer particionamento de nível de aplicativo (arqueamento)</td> <td>Sim (a partição automática no NDB Cluster é transparente para as aplicações)</td> </tr><tr> <th><em>Disponibilidade Alta (HA)</em></th> <td>Incorporado, do clúster InnoDB</td> <td>Sim (Projetado para 99,999% de tempo de atividade)</td> </tr><tr> <th><em>Recuperação de falha no nó e failover</em></th> <td>Do Grupo de Replicação MySQL</td> <td>Automático (elemento chave na arquitetura NDB)</td> </tr><tr> <th><em>Tempo para recuperação em caso de falha no nó</em></th> <td>30 segundos ou mais</td> <td>Normalmente &lt; 1 segundo</td> </tr><tr> <th><em>Real-Time Performance</em></th> <td>No</td> <td>Yes</td> </tr><tr> <th><em>Tabelas de Memória</em></th> <td>Não</td> <td>Sim (alguns dados podem ser armazenados opcionalmente em disco; tanto o armazenamento de dados em memória quanto o armazenamento de dados em disco são duráveis)</td> </tr><tr> <th><em>Acesso a motores de armazenamento NoSQL</em></th> <td>Sim</td> <td>Sim (Múltiplas APIs, incluindo Memcached, Node.js/JavaScript, Java, JPA, C++ e HTTP/REST)</td> </tr><tr> <th><em>Escritas concorrentes e paralelas</em></th> <td>Sim</td> <td>Até 48 escritores, otimizados para gravações concorrentes</td> </tr><tr> <th><span class="emphasis"><em>Detecção e resolução de conflitos (Múltiplos recursos de replicação)</em></span></th> <td>Sim (Replicação do Grupo MySQL)</td> <td>Sim</td> </tr><tr> <th><em>Hash Indexes</em></th> <td>No</td> <td>Yes</td> </tr><tr> <th><em>Adição online de nós</em></th> <td>Leia/escreva réplicas usando o MySQL Group Replication</td> <td>Sim (todos os tipos de nó)</td> </tr><tr> <th><em>Online Upgrades</em></th> <td>Yes (using replication)</td> <td>Yes</td> </tr><tr> <th><em>Modificações de esquema online</em></th> <td>Sim, como parte do MySQL 5.7</td> <td>Sim</td> </tr></tbody></table>

#### 21.2.6.2 Cargas de trabalho NDB e InnoDB

O NDB Cluster possui uma série de atributos únicos que o tornam ideal para atender aplicações que exigem alta disponibilidade, rápida recuperação, alto desempenho e baixa latência. Devido à sua arquitetura distribuída e implementação de vários nós, o NDB Cluster também possui restrições específicas que podem impedir o bom desempenho de algumas cargas de trabalho. Várias diferenças importantes no comportamento entre os motores de armazenamento `NDB` e `InnoDB` em relação a alguns tipos comuns de cargas de trabalho de aplicativos baseados em banco de dados são mostradas na tabela a seguir:

**Tabela 21.2 Diferenças entre os motores de armazenamento InnoDB e NDB, tipos comuns de cargas de trabalho de aplicativos baseados em dados.**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Workload</th> <th><code>InnoDB</code></th> <th>NDB Cluster (<code>NDB</code>)</th> </tr></thead><tbody><tr> <th><em>High-Volume OLTP Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>Aplicações DSS (data marts, análises)</em></th> <td>Sim</td> <td>Limitações (Operações de junção em conjuntos de dados OLTP que não excedam 3 TB de tamanho)</td> </tr><tr> <th><em>Custom Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>Aplicações embaladas</em></th> <td>Sim</td> <td>Limitações (deve ser acesso principalmente em chave primária); o NDB Cluster 7.5 suporta chaves estrangeiras</td> </tr><tr> <th><em>Aplicações de telecomunicações na rede (HLR, HSS, SDP)</em></th> <td>Não</td> <td>Sim</td> </tr><tr> <th><em>Session Management and Caching</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>E-Commerce Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>User Profile Management, AAA Protocol</em></th> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

#### 21.2.6.3 Resumo do uso de recursos do NDB e do InnoDB

Ao comparar os requisitos de recursos do aplicativo com as capacidades do `InnoDB` com as do `NDB`, alguns são claramente mais compatíveis com um motor de armazenamento do que com o outro.

A tabela a seguir lista as funcionalidades de aplicativos suportados de acordo com o mecanismo de armazenamento ao qual cada funcionalidade é tipicamente mais adequada.

**Tabela 21.3 Características de aplicativos suportados de acordo com o mecanismo de armazenamento ao qual cada característica é tipicamente mais adequada**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Requisitos de aplicação preferidos para<code>InnoDB</code></th> <th>Requisitos de aplicação preferidos para<code>NDB</code></th> </tr></thead><tbody><tr> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Chaves estrangeiras</p> <div class="note" style="margin-left: 0.5in; margin-right: 0.5in;"> <div class="admon-title">Nota</div> <p>O NDB Cluster 7.5 suporta chaves estrangeiras</p> </div> </li><li class="listitem"><p>Análises completas da tabela</p></li><li class="listitem"><p>Grandes bancos de dados, strings ou transações muito grandes</p></li><li class="listitem"><p>Transações que não são<code>READ COMMITTED</code> </p></li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Escreva escalonamento</p></li><li class="listitem"><p>99,999% de tempo de atividade</p></li><li class="listitem"><p>Adição online de nós e operações online de esquema</p></li><li class="listitem"><p>Múltiplas APIs SQL e NoSQL (consulte APIs do NDB Cluster: Visão geral e conceitos)</p></li><li class="listitem"><p>Desempenho em tempo real</p></li><li class="listitem"><p>Uso limitado de<code>BLOB</code>colunas</p></li><li class="listitem"><p>As chaves estrangeiras são suportadas, embora seu uso possa ter um impacto no desempenho em alta taxa de transferência.</p></li></ul> </div> </td> </tr></tbody></table>

### 21.2.7 Limitações conhecidas do NDB Cluster

Nas seções a seguir, discutimos as limitações conhecidas nas versões atuais do NDB Cluster em comparação com as funcionalidades disponíveis ao usar os motores de armazenamento `MyISAM` e `InnoDB`. Se você verificar a categoria “Cluster” no banco de bugs do MySQL em <http://bugs.mysql.com>, poderá encontrar bugs conhecidos nas seguintes categorias sob “Servidor MySQL:” no banco de bugs do MySQL em <http://bugs.mysql.com>, que pretendemos corrigir nas próximas versões do NDB Cluster:

* NDB Cluster
* API Direta do Cluster (NDBAPI)
* Dados de Disco do Cluster
* Replicação do Cluster
* ClusterJ

Essas informações são destinadas a ser completas em relação às condições que acabamos de estabelecer. Você pode relatar quaisquer discrepâncias que encontrar no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Qualquer problema que não planejamos corrigir no NDB Cluster 7.5 é adicionado à lista.

Veja os problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0 para uma lista de problemas em versões anteriores que foram resolvidos no NDB Cluster 7.5.

Nota

As limitações e outros problemas específicos da Replicação de NDB Cluster são descritos na Seção 21.7.3, “Problemas Conhecidos na Replicação de NDB Cluster”.

#### 21.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certas funcionalidades do MySQL produzem erros quando usadas com as tabelas `NDB`, conforme descrito na lista a seguir:

* **Tabelas temporárias.** As tabelas temporárias não são suportadas. Tentar criar uma tabela temporária que use o mecanismo de armazenamento `NDB` ou alterar uma tabela temporária existente para usar `NDB` falha com o erro: O mecanismo de armazenamento de tabela 'ndbcluster' não suporta a opção 'TEMPORARY'.

* **Indekses e chaves em tabelas NDB.** Chaves e índices em tabelas do NDB Cluster estão sujeitos às seguintes limitações:

+ **Largura da coluna.** Tentativa de criar um índice em uma coluna da tabela `NDB` cuja largura é maior que 3072 bytes é rejeitada com `ER_TOO_LONG_KEY`: A chave especificada foi muito longa; o comprimento máximo da chave é de 3072 bytes.

Tentar criar um índice em uma coluna de tabela `NDB` cujo comprimento é maior que 3056 bytes tem sucesso com um aviso. Nesses casos, as informações estatísticas não são geradas, o que significa que um plano de execução não ótimo pode ser selecionado. Por esse motivo, você deve considerar fazer o comprimento do índice mais curto que 3056 bytes, se possível.

+ **Colunas TEXT e BLOB.** Não é possível criar índices nas colunas da tabela `NDB` que utilizem qualquer um dos tipos de dados `TEXT` ou `BLOB`.

+ **Indekses FULLTEXT.** O motor de armazenamento `NDB` não suporta índices `FULLTEXT`, que são possíveis apenas para as tabelas `MyISAM` e `InnoDB`.

No entanto, você pode criar índices nas colunas de `VARCHAR` das tabelas de `NDB`.

+ **USANDO chaves HASH e NULL.** Usar colunas nulas em chaves únicas e chaves primárias significa que as consultas que utilizam essas colunas são tratadas como varreduras completas da tabela. Para contornar esse problema, faça a coluna `NOT NULL`, ou recrie o índice sem a opção `USING HASH`.

+ **Prefixos. Não há índices de prefixo; apenas colunas inteiras podem ser indexadas. (O tamanho de um índice de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também a Seção 21.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”, para informações adicionais.)

+ Colunas BIT. Uma coluna `BIT` não pode ser uma chave primária, chave única ou índice, nem pode fazer parte de uma chave primária composta, chave única ou índice.

+ Colunas **AUTO\_INCREMENT.** Como outros motores de armazenamento do MySQL, o motor de armazenamento `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem chave primária explícita, uma coluna `AUTO_INCREMENT` é definida automaticamente e usada como uma chave primária "oculta". Por esse motivo, você não pode criar uma tabela `NDB` com uma coluna `AUTO_INCREMENT` e sem chave primária explícita.

As seguintes declarações `CREATE TABLE` não funcionam, conforme mostrado aqui:

    ```sql
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

    ```sql
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrições para chaves estrangeiras.** O suporte para restrições de chave estrangeira no NDB 7.5 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

+ Toda coluna referenciada como chave estrangeira requer uma chave única explícita, se não for a chave primária da tabela.

+ `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

Isso ocorre porque uma atualização de uma chave primária é implementada como uma exclusão da string antiga (contendo a chave primária antiga) mais uma inserção da nova string (com uma nova chave primária). Isso não é visível para o kernel `NDB`, que considera essas duas strings como sendo a mesma, e, portanto, não tem como saber que essa atualização deve ser cascada.

+ A partir do NDB 7.5.14 e do NDB 7.6.10: `ON DELETE CASCADE` não é suportado quando a tabela secundária contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

+ `SET DEFAULT` não é suportado. (Também não é suportado por `InnoDB`.)

+ As palavras-chave `NO ACTION` são aceitas, mas tratadas como `RESTRICT`. (Também o mesmo que com `InnoDB`.)

+ Em versões anteriores do NDB Cluster, ao criar uma tabela com chave estrangeira referenciando um índice em outra tabela, às vezes parecia possível criar a chave estrangeira mesmo que a ordem das colunas nos índices não combinasse, devido ao fato de que um erro apropriado não sempre era retornado internamente. Uma correção parcial para esse problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que essa situação ocorra no caso de o índice pai ser um índice único. (Bug #18094360)

+ Antes da NDB 7.5.6, ao adicionar ou remover uma chave estrangeira usando `ALTER TABLE`, os metadados da tabela pai não são atualizados, o que permite, posteriormente, executar as instruções `ALTER TABLE` na tabela pai, que devem ser inválidas. Para contornar esse problema, execute `SHOW CREATE TABLE` na tabela pai imediatamente após adicionar ou remover a chave estrangeira; isso força a recarga dos metadados do pai.

Este problema é corrigido no NDB 7.5.6. (Bug #82989, Bug #24666177)

Para mais informações, consulte a Seção 13.1.18.5, “Restrições de Chave Estrangeira”, e a Seção 1.6.3.2, “Restrições de Chave Estrangeira”.

* **Tipos de dados de clúster e geometria do NDB.** Os tipos de dados de geometria (`WKT` e `WKB`) são suportados para as tabelas `NDB`. No entanto, os índices espaciais não são suportados.

* **Conjunto de caracteres e arquivos de registro binário.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o conjunto de caracteres `latin1` (ASCII). Como os nomes dos arquivos de registro binário são registrados nesta tabela, os arquivos de registro binário com nomes que usam caracteres não latinos não são referenciados corretamente nessas tabelas. Este é um problema conhecido, e estamos trabalhando para corrigi-lo. (Bug #50226)

Para contornar esse problema, use apenas caracteres latim-1 ao nomear arquivos de registro binários ou ao definir qualquer uma das opções `--basedir`, `--log-bin` ou `--log-bin-index`.

* **Criando tabelas NDB com particionamento definido pelo usuário.**

O suporte para partição definida pelo usuário no NDB Cluster é restrito à partição `LINEAR` `KEY`. O uso de qualquer outro tipo de partição com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma declaração `CREATE TABLE` resulta em um erro.

É possível ignorar essa restrição, mas isso não é suportado para uso em configurações de produção. Para obter detalhes, consulte "Particionamento definido pelo usuário e o motor de armazenamento NDB (NDB Cluster)").

**Scheme de particionamento padrão.** Todas as tabelas do NDB Cluster são, por padrão, particionadas por `KEY` usando a chave primária da tabela como chave de particionamento. Se nenhuma chave primária for explicitamente definida para a tabela, a chave primária “oculta” criada automaticamente pelo motor de armazenamento `NDB` é usada em vez disso. Para uma discussão adicional sobre essas e questões relacionadas, consulte a Seção 22.2.5, “Particionamento por CHAVE”.

`CREATE TABLE` e `ALTER TABLE` declarações que causariam uma tabela `NDBCLUSTER` particionada pelo usuário a não atender a um dos dois requisitos ou a ambos não são permitidas e falham com um erro:

1. A tabela deve ter uma chave primária explícita.  
2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDBCLUSTER` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`, então não é necessário uma chave primária explícita.

**Número máximo de partições para tabelas NDBCLUSTER.** O número máximo de partições que podem ser definidas para uma tabela `NDBCLUSTER` ao empregar partição definida pelo usuário é de 8 por grupo de nós. (Consulte a Seção 21.2.2, “Nodos do NDB Cluster, Grupos de Nós, Replicatas de Fragmento e Partições”, para obter mais informações sobre os grupos de nós do NDB Cluster.

**DROP PARTITION não é suportada.** Não é possível descartar partições das tabelas do `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de particionamento para `ALTER TABLE`—`ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION`—são suportadas para tabelas NDB, mas utilizam cópia e, portanto, não são otimizadas. Veja a Seção 22.3.1, “Gestão de Partições RANGE e LIST” e a Seção 13.1.8, “Instrução ALTER TABLE”.

**Seleção de partição.** A seleção de partição não é suportada para as tabelas `NDB`. Consulte a Seção 22.5, “Seleção de partição”, para obter mais informações.

* **Tipo de dados JSON.** O tipo de dados `JSON` do MySQL é suportado para as tabelas `NDB` do `mysqld` fornecido com o NDB 7.5.2 e versões posteriores.

Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

A API do NDB não possui nenhuma disposição especial para trabalhar com os dados do `JSON`, que ela considera simplesmente dados do `BLOB`. O tratamento dos dados como `JSON` deve ser realizado pelo aplicativo.

* **Tabelas de informações de CPU e thread ndbinfo.** O NDB 7.5.2 adiciona várias novas tabelas ao banco de dados de informações `ndbinfo`, fornecendo informações sobre a atividade de CPU e thread por nó, ID de thread e tipo de thread. As tabelas estão listadas aqui:

+ `cpustat`: Fornece estatísticas de CPU por segundo e por thread

+ `cpustat_50ms`: Dados brutos de estatísticas de CPU por thread, coletados a cada 50 ms

+ `cpustat_1sec`: Dados brutos de estatísticas de CPU por thread, coletados a cada segundo

+ `cpustat_20sec`: Dados brutos de estatísticas de CPU por thread, coletados a cada 20 segundos

+ `threads`: Nomes e descrições dos tipos de threads

Para mais informações sobre essas tabelas, consulte a Seção 21.6.15, “ndbinfo: The NDB Cluster Information Database”.

* **Bloquear as tabelas ndbinfo.** O NDB 7.5.3 adiciona novas tabelas ao banco de dados de informações `ndbinfo`, fornecendo informações sobre bloqueios e tentativas de bloqueio em um NDB Cluster em execução. Essas tabelas estão listadas aqui:

+ `cluster_locks`: Solicitações de bloqueio atuais que estão aguardando ou mantendo bloqueios; essa informação pode ser útil ao investigar estalls e deadlocks. Análogo a `cluster_operations`.

+ `locks_per_fragment`: Contagem de solicitações de bloqueio e seus resultados por fragmento, bem como o tempo total gasto esperando por bloqueios com sucesso e sem sucesso. Análogo a `operations_per_fragment` e `memory_per_fragment`.

+ `server_locks`: Subconjunto de transações em grupo — aquelas que funcionam no local `mysqld`, mostrando um ID de conexão por transação. Análogo a `server_operations`.

#### 21.2.7.2 Limites e Diferenças do NDB Cluster em relação aos Limites do MySQL Padrão

Nesta seção, listamos os limites encontrados no NDB Cluster que diferem dos limites encontrados no MySQL padrão ou que não são encontrados no MySQL padrão.

**Uso e recuperação da memória.** A memória consumida quando os dados são inseridos em uma tabela `NDB` não é recuperada automaticamente quando excluída, como acontece com outros motores de armazenamento. Em vez disso, as seguintes regras se aplicam:

* Uma declaração `DELETE` em uma tabela `NDB` torna a memória anteriormente utilizada pelas strings excluídas disponível para reutilização por inserções na mesma tabela apenas. No entanto, essa memória pode ser disponibilizada para reutilização geral realizando `OPTIMIZE TABLE`.

Um reinício contínuo do clúster também libera toda a memória usada por strings excluídas. Veja a Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

Uma operação `DROP TABLE` ou `TRUNCATE TABLE` em uma tabela `NDB` libera a memória que foi usada por esta tabela para reutilização por qualquer tabela `NDB`, seja pela mesma tabela ou por outra tabela `NDB`.

Nota

Lembre-se de que `TRUNCATE TABLE` exclui e recria a tabela. Veja a Seção 13.1.34, “Instrução TRUNCATE TABLE”.

* **Limites impostos pela configuração do cluster.** Existem vários limites rígidos que são configuráveis, mas a memória principal disponível no cluster define os limites. Consulte a lista completa dos parâmetros de configuração na Seção 21.4.3, "Arquivos de configuração do NDB Cluster". A maioria dos parâmetros de configuração pode ser atualizada online. Esses limites rígidos incluem:

+ Tamanho da memória do banco de dados e tamanho da memória do índice (`DataMemory` e `IndexMemory`, respectivamente).

`DataMemory` é alocado como páginas de 32 KB. À medida que cada página `DataMemory` é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto por meio da eliminação da tabela.

Veja a Seção 21.4.3.6, “Definindo nós de dados do NDB Cluster”, para mais informações.

+ O número máximo de operações que podem ser realizadas por transação é definido usando os parâmetros de configuração `MaxNoOfConcurrentOperations` e `MaxNoOfLocalOperations`.

Nota

O carregamento em massa, `TRUNCATE TABLE` e `ALTER TABLE` são tratados como casos especiais ao executar várias transações, e, portanto, não estão sujeitos a essa limitação.

+ Diferentes limites relacionados a tabelas e índices. Por exemplo, o número máximo de índices ordenados no clúster é determinado por `MaxNoOfOrderedIndexes`, e o número máximo de índices ordenados por tabela é 16.

* **Máximos de nós e objetos de dados.** Os seguintes limites se aplicam ao número de nós de cluster e objetos de metadados:

+ O número máximo de nós de dados é 48.

Um nó de dados deve ter um ID de nó no intervalo de 1 a 48, inclusive. (Nodos de gerenciamento e API podem usar IDs de nó no intervalo de 1 a 255, inclusive.)

+ O número máximo total de nós em um NDB Cluster é de 255. Esse número inclui todos os nós SQL (servidores MySQL), nós API (aplicações que acessam o clúster, exceto servidores MySQL), nós de dados e servidores de gerenciamento.

+ O número máximo de objetos de metadados nas versões atuais do NDB Cluster é 20320. Esse limite é codificado de forma rígida.

Veja os problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0, para mais informações.

#### 21.2.7.3 Limites relacionados ao tratamento de transações no NDB Cluster

Há várias limitações no NDB Cluster em relação ao tratamento de transações, incluindo as seguintes:

* Nível de isolamento de transação.

O motor de armazenamento `NDBCLUSTER` suporta apenas o nível de isolamento de transação `READ COMMITTED`. (`InnoDB`, por exemplo, suporta `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`). Você deve ter em mente que `NDB` implementa `READ COMMITTED` em uma base por string; quando uma solicitação de leitura chega ao nó de dados que armazena a string, o que é retornado é a última versão comprometida da string naquela época.

Os dados não comprometidos nunca são devolvidos, mas quando uma transação que modifica vários registros é comprometida simultaneamente com uma transação que lê os mesmos registros, a transação que realiza a leitura pode observar valores "antes", valores "depois" ou ambos, para diferentes registros entre esses, devido ao fato de que um pedido de leitura de um registro específico pode ser processado antes ou depois do comprometimento da outra transação.

Para garantir que uma transação específica leia apenas antes ou depois dos valores, você pode impor bloqueios de string usando `SELECT ... LOCK IN SHARE MODE`. Nesses casos, o bloqueio é mantido até que a transação proprietária seja comprometida. O uso de bloqueios de string também pode causar os seguintes problemas:

+ Aumento da frequência de erros de tempo de espera de bloqueio e redução da concorrência

+ Aumento do overhead de processamento de transações devido a leituras que exigem uma fase de commit

+ Posssibilidade de esgotar o número disponível de bloqueios concorrentes, que é limitado por `MaxNoOfConcurrentOperations`

`NDB` utiliza `READ COMMITTED` para todas as leituras, a menos que seja usado um modificador como `LOCK IN SHARE MODE` ou `FOR UPDATE`. `LOCK IN SHARE MODE` faz com que as chaves de fila compartilhadas sejam usadas; `FOR UPDATE` faz com que as chaves de fila exclusivas sejam usadas. As leituras de chave única têm suas chaves atualizadas automaticamente por `NDB` para garantir uma leitura autoconsistente; as leituras de `BLOB` também empregam bloqueio adicional para consistência.

Consulte a Seção 21.6.8.4, “Solução de problemas de backup do cluster NDB”, para obter informações sobre como a implementação do nível de isolamento de transação do NDB Cluster pode afetar o backup e a restauração dos bancos de dados `NDB`.

* **Transações e colunas BLOB ou TEXT.** `NDBCLUSTER` armazena apenas parte do valor de uma coluna que utiliza qualquer um dos tipos de dados `BLOB` ou `TEXT` do MySQL na tabela visível ao MySQL; o restante do `BLOB` ou `TEXT` é armazenado em uma tabela interna separada que não é acessível ao MySQL. Isso gera dois problemas relacionados dos quais você deve estar ciente sempre que executar declarações `SELECT` em tabelas que contêm colunas desses tipos:

1. Para qualquer `SELECT` de uma tabela de NDB Cluster: Se o `SELECT` incluir uma coluna `BLOB` ou `TEXT`, o nível de isolamento de transação `READ COMMITTED` é convertido para uma leitura com bloqueio de leitura. Isso é feito para garantir a consistência.

2. Para qualquer `SELECT` que utilize uma pesquisa de chave única para recuperar quaisquer colunas que utilizem qualquer um dos tipos de dados `BLOB` ou `TEXT` e que seja executado dentro de uma transação, uma bloqueio de leitura compartilhada é mantido na tabela durante a duração da transação, ou seja, até que a transação seja comprometida ou abortado.

Este problema não ocorre para consultas que utilizam índices ou varreduras de tabela, mesmo contra tabelas `NDB` que possuem colunas `BLOB` ou `TEXT`.

Por exemplo, considere a tabela `t`, definida pela seguinte declaração `CREATE TABLE`:

     ```sql
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

A seguinte consulta sobre `t` causa um bloqueio de leitura compartilhado, porque usa uma pesquisa de chave única:

     ```sql
     SELECT * FROM t WHERE c = 1;
     ```

No entanto, nenhuma das quatro consultas mostradas aqui causa um bloqueio de leitura compartilhado:

     ```sql
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

Isso ocorre porque, dessas quatro consultas, a primeira utiliza uma varredura de índice, a segunda e a terceira utilizam varreduras de tabela, e a quarta, embora utilize uma pesquisa de chave primária, não recupera o valor de nenhuma das colunas `BLOB` ou `TEXT`.

Você pode ajudar a minimizar problemas com bloqueios de leitura compartilhada evitando consultas que utilizam pesquisas de chave única que recuperam as colunas `BLOB` ou `TEXT`, ou, nos casos em que essas consultas não podem ser evitadas, realizando transações o mais rápido possível depois.

* **Consultas de chave única e isolamento de transações.** Índices únicos são implementados em `NDB` usando uma tabela de índice oculta que é mantida internamente. Quando uma tabela criada pelo usuário `NDB` é acessada usando um índice único, a tabela de índice oculta é lida primeiro para encontrar a chave primária que é então usada para ler a tabela criada pelo usuário. Para evitar a modificação do índice durante essa operação de leitura dupla, a string encontrada na tabela de índice oculta é bloqueada. Quando uma string referenciada por um índice único na tabela `NDB` criada pelo usuário é atualizada, a tabela de índice oculta está sujeita a um bloqueio exclusivo pela transação na qual a atualização é realizada. Isso significa que qualquer operação de leitura na mesma tabela (criada pelo usuário) `NDB` deve esperar que a atualização seja concluída. Isso é verdade mesmo quando o nível de transação da operação de leitura é `READ COMMITTED`.

Uma solução que pode ser usada para contornar leituras potencialmente bloqueadoras é forçar o nó SQL a ignorar o índice único ao realizar a leitura. Isso pode ser feito usando a dica de índice `IGNORE INDEX` como parte da declaração `SELECT` que lê a tabela (consulte Seção 8.9.4, “Dicas de índice”). Como o servidor MySQL cria um índice ordenado de sombra para cada índice único criado em `NDB`, isso permite que o índice ordenado seja lido em vez disso, e evita o bloqueio do acesso ao índice único. A leitura resultante é tão consistente quanto uma leitura comprometida por chave primária, retornando o último valor comprometido no momento em que a string é lida.

A leitura por meio de um índice ordenado utiliza menos recursos no clúster e pode ter maior latência.

Também é possível evitar o uso do índice único para acesso, realizando consultas por intervalos em vez de por valores únicos.

* **Reversões. Não há transações parciais e não há reversões parciais de transações. Uma chave duplicada ou um erro semelhante faz com que toda a transação seja revertida.

Esse comportamento difere do de outros motores de armazenamento transacional, como `InnoDB`, que podem reverter declarações individuais.

* **Transações e uso de memória.** Como mencionado em outros lugares deste capítulo, o NDB Cluster não lida bem com grandes transações; é melhor realizar várias pequenas transações com algumas operações cada uma do que tentar uma única grande transação que contenha muitas operações. Entre outras considerações, grandes transações exigem grandes quantidades de memória. Por isso, o comportamento transacional de vários comandos do MySQL é afetado, conforme descrito na lista a seguir:

+ `TRUNCATE TABLE` não é transacional quando usado em tabelas `NDB`. Se um `TRUNCATE TABLE` não conseguir esvaziar a tabela, ele deve ser executado novamente até que seja bem-sucedido.

+ `DELETE FROM` (mesmo sem a cláusula `WHERE`)* é* transacional. Para tabelas que contêm muitas strings, você pode notar que o desempenho é melhorado ao usar várias declarações `DELETE FROM ... LIMIT ...` para "dividir" a operação de exclusão. Se o seu objetivo é esvaziar a tabela, então você pode querer usar `TRUNCATE TABLE` em vez disso.

+ **declarações LOAD DATA.** `LOAD DATA` não é transacional quando usado em tabelas `NDB`.

Importante

Ao executar uma declaração `LOAD DATA`, o motor `NDB` realiza commits em intervalos irregulares que permitem uma melhor utilização da rede de comunicação. Não é possível saber antecipadamente quando tais commits ocorrem.

+ **ALTER TABLE e transações.** Ao copiar uma tabela `NDB` como parte de um `ALTER TABLE`, a criação da cópia não é transacional. (Em qualquer caso, essa operação é revertida quando a cópia é excluída.)

* **Transações e a função COUNT().** Ao usar a Replicação do NDB Cluster, não é possível garantir a consistência transacional da função `COUNT()` na replica. Em outras palavras, ao realizar em fonte uma série de declarações (`INSERT`, `DELETE` ou ambas) que altera o número de strings em uma tabela dentro de uma única transação, executar consultas `SELECT COUNT(*) FROM table` na replica pode gerar resultados intermediários. Isso ocorre porque `SELECT COUNT(...)` pode realizar leituras sujas e não é um bug no motor de armazenamento `NDB`. (Consulte o Bug #31321 para mais informações.)

#### 21.2.7.4 Gerenciamento de Erros de Agrupamento NDB

Iniciar, parar ou reiniciar um nó pode gerar erros temporários que fazem com que algumas transações falhem. Esses casos incluem os seguintes:

* **Erros temporários.** Ao iniciar um nó pela primeira vez, é possível que você veja o Erro 1204 Falha temporária, distribuição alterada e outros erros temporários semelhantes.

* **Erros devido à falha do nó.** A interrupção ou falha de qualquer nó de dados pode resultar em vários tipos de erros de falha de nó. (No entanto, não deve haver transações abortadas ao realizar uma parada planejada do clúster.)

Em qualquer um desses casos, quaisquer erros gerados devem ser tratados dentro da aplicação. Isso deve ser feito tentando novamente a transação.

Veja também a Seção 21.2.7.2, “Limites e Diferenças do NDB Cluster em Relação aos Limites Padrão do MySQL”.

#### 21.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

Alguns objetos de banco de dados, como tabelas e índices, têm limitações diferentes ao usar o mecanismo de armazenamento `NDBCLUSTER`:

* **Nomes de banco de dados e tabelas.** Ao usar o mecanismo de armazenamento `NDB`, o comprimento máximo permitido tanto para nomes de banco de dados quanto para nomes de tabelas é de 63 caracteres. Uma declaração que utiliza um nome de banco de dados ou nome de tabela com mais de esse limite falha com um erro apropriado.

* **Número de objetos do banco de dados.** O número máximo de *todos* os objetos do banco de dados `NDB` em um único NDB Cluster — incluindo bancos de dados, tabelas e índices — é limitado a 20320.

* **Atributos por tabela.** O número máximo de atributos (ou seja, colunas e índices) que podem pertencer a uma determinada tabela é de 512.

* **Atributos por chave.** O número máximo de atributos por chave é de 32.

* **Tamanho da string.** O tamanho máximo permitido para qualquer uma das strings é de 14000 bytes.

Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para este total; isso inclui as colunas `JSON`. Consulte os Requisitos de Armazenamento de Tipo de String, bem como os Requisitos de Armazenamento de JSON, para obter mais informações relacionadas a esses tipos.

Além disso, o deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; tentar criar uma tabela que viole essa limitação falha com o erro NDB 851 O máximo deslocamento para colunas de tamanho fixo foi excedido. Para colunas baseadas em memória, você pode contornar essa limitação usando um tipo de coluna de largura variável, como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isso não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode fazer isso reordenando uma ou mais das colunas baseadas em disco da tabela de modo que a largura combinada de todas, exceto a coluna baseada em disco definida na última declaração `CREATE TABLE` usada para criar a tabela não exceda 8188 bytes, menos qualquer arredondamento possível realizado para alguns tipos de dados, como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar armazenamento baseado em memória para uma ou mais das colunas ou colunas infratoras em vez disso.

* **Armazenamento de coluna BIT por tabela.** A largura combinada máxima para todas as colunas `BIT` usadas em uma tabela `NDB` dada é de 4096.

* **Armazenamento de coluna FIXO.** O NDB Cluster 7.5 e versões posteriores suportam um máximo de 128 TB por fragmento de dados em colunas `FIXED`. (Anteriormente, isso era de 16 GB.)

#### 21.2.7.6 Recursos não suportados ou ausentes no NDB Cluster

Vários recursos suportados por outros motores de armazenamento não são suportados para as tabelas do `NDB`. Tentar usar qualquer um desses recursos no NDB Cluster não causa erros por si só; no entanto, erros podem ocorrer em aplicativos que esperam que os recursos sejam suportados ou aplicados. Declarações que fazem referência a esses recursos, mesmo que efetivamente ignoradas por `NDB`, devem ser sintaticamente e de outra forma válidas.

* **Prefixos de índice.** Prefixos em índices não são suportados para as tabelas `NDB`. Se um prefixo é usado como parte de uma especificação de índice em uma declaração como `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, o prefixo não é criado por `NDB`.

Uma declaração que contenha um prefixo de índice e que crie ou modifique uma tabela `NDB` ainda deve ser sintaticamente válida. Por exemplo, a seguinte declaração sempre falha com Erro 1089 Chave de prefixo incorreta; a parte da chave usada não é uma string, a extensão usada é mais longa que a parte da chave ou o motor de armazenamento não suporta chaves de prefixo únicas, independentemente do motor de armazenamento:

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

Isso acontece devido à regra de sintaxe SQL de que nenhum índice pode ter um prefixo maior que ele mesmo.

* **Pontos de salvamento e recuos.** Pontos de salvamento e recuos para pontos de salvamento são ignorados como em `MyISAM`.

* **Durabilidade dos commits.** Não há commits duráveis no disco. Os commits são replicados, mas não há garantia de que os logs sejam apagados no disco ao commit.

* **Replicação. A replicação baseada em declarações não é suportada. Use `--binlog-format=ROW` (ou `--binlog-format=MIXED`) ao configurar a replicação de cluster. Consulte a Seção 21.7, “Replicação de cluster NDB”, para obter mais informações.

A replicação usando identificadores de transação global (GTIDs) não é compatível com o NDB Cluster e não é suportada no NDB Cluster 7.5 ou no NDB Cluster 7.6. Não habilite GTIDs ao usar o mecanismo de armazenamento `NDB`, pois isso provavelmente causará problemas até o falha da replicação do NDB Cluster.

A replicação semiesincronizada não é suportada no NDB Cluster.

Ao replicar entre clusters, é possível usar endereços IPv6 entre os nós do SQL em diferentes clusters, mas todas as conexões dentro de um determinado cluster devem usar endereçamento IPv4. Para mais informações, consulte Replicação de NDB Cluster e IPv6.

* **Colunas geradas.** O mecanismo de armazenamento `NDB` não suporta índices em colunas virtuais geradas.

Assim como em outros motores de armazenamento, você pode criar um índice em uma coluna gerada armazenada, mas deve ter em mente que `NDB` usa `DataMemory` para armazenamento da coluna gerada, bem como `IndexMemory` para o índice. Veja colunas JSON e indexação indireta no NDB Cluster, para um exemplo.

O NDB Cluster escreve as alterações nas colunas geradas armazenadas no log binário, mas não registra as alterações feitas nas colunas virtuais. Isso não deve afetar a Replicação do NDB Cluster ou a replicação entre `NDB` e outros motores de armazenamento MySQL.

Nota

Consulte a Seção 21.2.7.3, “Limites relacionados ao tratamento de transações no NDB Cluster”, para obter mais informações sobre as limitações relacionadas ao tratamento de transações em `NDB`.

#### 21.2.7.7 Limitações relacionadas ao desempenho no NDB Cluster

Os problemas de desempenho a seguir são específicos ou especialmente pronunciados no NDB Cluster:

* **Análises de intervalo.** Há problemas de desempenho das consultas devido ao acesso sequencial ao mecanismo de armazenamento `NDB`; também é relativamente mais caro realizar muitas análises de intervalo do que com `MyISAM` ou `InnoDB`.

* **Confiabilidade dos registros na faixa.** A estatística `Records in range` está disponível, mas não foi completamente testada ou oficialmente suportada. Isso pode resultar em planos de consulta não ótimos em alguns casos. Se necessário, você pode usar `USE INDEX` ou `FORCE INDEX` para alterar o plano de execução. Consulte a Seção 8.9.4, “Dicas de índice”, para obter mais informações sobre como fazer isso.

* **Indicadores de hash exclusivos.** Indicadores de hash exclusivos criados com `USING HASH` não podem ser usados para acessar uma tabela se `NULL` for dado como parte da chave.

#### 21.2.7.8 Questões exclusivas do cluster NDB

As seguintes são limitações específicas do motor de armazenamento `NDB`:

* **Arquitetura da máquina.** Todas as máquinas utilizadas no clúster devem ter a mesma arquitetura. Isso significa que todas as máquinas que hospedam nós devem ser big-endian ou little-endian, e não é possível usar uma mistura de ambas. Por exemplo, não é possível ter um nó de gerenciamento rodando em um PowerPC que direcione um nó de dados que esteja rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente executam **mysql** ou outros clientes que podem estar acessando os nós SQL do clúster.

* **Registro binário.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao registro binário:

+ O NDB Cluster não pode produzir um log binário para tabelas que possuem colunas `BLOB`, mas sem chave primária.

+ Apenas as seguintes operações de esquema são registradas em um log binário de cluster que *não* está no `mysqld` executando a declaração:

- `CREATE TABLE`
- `ALTER TABLE`
- `DROP TABLE`
- `CREATE DATABASE` / `CREATE SCHEMA`

- `DROP DATABASE` / `DROP SCHEMA`

- `CREATE TABLESPACE`
- `ALTER TABLESPACE`
- `DROP TABLESPACE`
- `CREATE LOGFILE GROUP`
- `ALTER LOGFILE GROUP`
- `DROP LOGFILE GROUP`
* **Operações de esquema.** As operações de esquema (declarações DDL) são rejeitadas enquanto qualquer nó de dados é reiniciado. As operações de esquema também não são suportadas durante a realização de uma atualização ou redução online.

* **Número de réplicas de fragmentos.** O número de réplicas de fragmentos, determinado pelo parâmetro de configuração do nó de dados `NoOfReplicas`, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro para 1 significa que há apenas uma única cópia; neste caso, não é fornecida redundância e a perda de um nó de dados implica na perda de dados. Para garantir a redundância e, assim, a preservação dos dados mesmo se um nó de dados falhar, defina este parâmetro para 2, que é o valor padrão e recomendado em produção.

Definir `NoOfReplicas` para um valor maior que 2 é possível (até um máximo de 4), mas não é necessário para evitar a perda de dados. Além disso, *valores maiores que 2 para este parâmetro não são suportados na produção*.

Veja também a Seção 21.2.7.10, “Limitações relacionadas a múltiplos nós do cluster NDB”.

#### 21.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB

**Máximos e mínimos dos objetos de dados de disco.** Os objetos de dados de disco estão sujeitos aos seguintes máximos e mínimos:

* Número máximo de espaços de tabela: 232 (4294967296)

* Número máximo de arquivos de dados por espaço de tabela: 216 (65536)

* Os tamanhos mínimos e máximos possíveis dos extensões dos arquivos de dados do espaço de tabela são, respectivamente, 32K e 2G. Consulte a Seção 13.1.19, “Declaração CREATE TABLESPACE”, para obter mais informações.

Além disso, ao trabalhar com tabelas de dados de disco NDB, você deve estar ciente dos seguintes problemas relacionados a arquivos de dados e extensões:

* Os arquivos de dados utilizam `DataMemory`. O uso é o mesmo que para dados em memória.

* Os arquivos de dados utilizam descritores de arquivo. É importante ter em mente que os arquivos de dados estão sempre abertos, o que significa que os descritores de arquivo estão sempre em uso e não podem ser reutilizados para outras tarefas do sistema.

* Os extenções exigem `DiskPageBufferMemory` suficiente; você deve reservar espaço suficiente para que este parâmetro possa contabilizar toda a memória usada por todas as extenções (número de extenções vezes o tamanho das extenções).

Tabelas de dados de disco e modo sem disco. O uso de tabelas de dados de disco não é suportado quando o clúster está em modo sem disco.

#### 21.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB

**Nodos SQL múltiplos.** Os seguintes problemas estão relacionados ao uso de múltiplos servidores MySQL como nós SQL do NDB Cluster e são específicos ao mecanismo de armazenamento `NDBCLUSTER`:

* **Programas armazenados não são distribuídos.** Procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados são todos suportados por tabelas que utilizam o mecanismo de armazenamento `NDB`, mas esses não se propagam automaticamente entre Servidores MySQL que atuam como nós SQL de cluster, e devem ser recriados separadamente em cada nó SQL. Veja Programas armazenados no NDB Cluster.

* **Nenhuma bloqueio de tabela distribuído.** Uma declaração `LOCK TABLES` ou chamada `GET_LOCK()` funciona apenas para o nó SQL no qual o bloqueio é emitido; nenhum outro nó SQL no clúster "ve" este bloqueio. Isso é verdade para um bloqueio emitido por qualquer declaração que bloqueie tabelas como parte de suas operações. (Veja o próximo item para um exemplo.)

A implementação de bloqueios de tabela em `NDBCLUSTER` pode ser feita em um aplicativo de API, e garantir que todas as aplicações comecem definindo `LockMode` para `LM_Read` ou `LM_Exclusive`. Para mais informações sobre como fazer isso, consulte a descrição de `NdbOperation::getLockHandle()` no *Guia de API do NDB Cluster*.

* **Operações de ALTER TABLE.** `ALTER TABLE` não está totalmente bloqueado ao executar vários servidores MySQL (nós SQL). (Como discutido no item anterior, o NDB Cluster não suporta bloqueios de tabela distribuídos.)

**Nodos de gerenciamento múltiplos.** Ao usar múltiplos servidores de gerenciamento:

* Se algum dos servidores de gerenciamento estiver rodando no mesmo host, você deve fornecer IDs explícitos aos nós nas conexões, porque a alocação automática de IDs de nó não funciona em múltiplos servidores de gerenciamento no mesmo host. Isso não é necessário se cada servidor de gerenciamento estiver em um host diferente.

* Quando um servidor de gerenciamento é iniciado, ele primeiro verifica se há outros servidores de gerenciamento no mesmo NDB Cluster. Após a conexão bem-sucedida com o outro servidor de gerenciamento, ele utiliza os dados de configuração. Isso significa que as opções de inicialização do servidor de gerenciamento `--reload` e `--initial` são ignoradas, a menos que o servidor de gerenciamento seja o único em execução. Isso também significa que, ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento, o servidor de gerenciamento lê seu próprio arquivo de configuração se (e somente se) ele for o único servidor de gerenciamento em execução neste NDB Cluster. Consulte a Seção 21.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”, para obter mais informações.

**Vários endereços de rede.** Não são suportados vários endereços de rede por nó de dados. O uso desses endereços pode causar problemas: em caso de falha de um nó de dados, um nó SQL espera confirmação de que o nó de dados caiu, mas nunca recebe, pois outra rota para esse nó de dados permanece aberta. Isso pode tornar o clúster inoperável.

Nota

É possível usar várias *interfaces* de hardware de rede (como placas Ethernet) para um único nó de dados, mas essas devem estar vinculadas ao mesmo endereço. Isso também significa que não é possível usar mais de uma seção `[tcp]` por conexão no arquivo `config.ini`. Consulte a Seção 21.4.3.10, “Conexões NDB Cluster TCP/IP”, para obter mais informações.