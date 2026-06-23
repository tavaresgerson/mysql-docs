## 25.6 Gerenciamento do NDB Cluster

Gerenciar um NDB Cluster envolve uma série de tarefas, sendo a primeira delas configurar e iniciar o NDB Cluster. Isso é abordado na Seção 25.4, “Configuração do NDB Cluster”, e na Seção 25.5, “Programas do NDB Cluster”.

As próximas seções abordam a gestão de um NDB Cluster em execução.

Para informações sobre questões de segurança relacionadas à gestão e implantação de um NDB Cluster, consulte a Seção 25.6.20, “Questões de segurança do NDB Cluster”.

Existem, essencialmente, dois métodos para gerenciar ativamente um NDB Cluster em execução. O primeiro deles é o uso de comandos inseridos no cliente de gerenciamento, através do qual o status do cluster pode ser verificado, os níveis de log alterados, os backups iniciados e interrompidos, e os nós parados e iniciados. O segundo método envolve o estudo do conteúdo do log do cluster `ndb_node_id_cluster.log`; esse geralmente é encontrado no diretório do servidor de gerenciamento `DataDir`, mas essa localização pode ser substituída usando a opção `LogDestination`. (Lembre-se de que *`node_id`* representa o identificador único do nó cuja atividade está sendo registrada.) O log do cluster contém relatórios de eventos gerados pelo **ndbd**. Também é possível enviar entradas do log do cluster para um log de sistema Unix.

Alguns aspectos do funcionamento do cluster também podem ser monitorados a partir de um nó SQL usando a declaração `SHOW ENGINE NDB STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement").

Informações mais detalhadas sobre as operações do NDB Cluster estão disponíveis em tempo real por meio de uma interface SQL usando o banco de dados `ndbinfo`. Para mais informações, consulte a Seção 25.6.16, “ndbinfo: O banco de dados de informações do NDB Cluster”.

Os contadores de estatísticas do NDB fornecem monitoramento aprimorado usando o cliente **mysql**. Esses contadores, implementados no kernel do NDB, estão relacionados às operações realizadas por ou que afetam objetos `Ndb`, como iniciar, fechar e abortar transações; operações de chave primária e chave única; varreduras de tabela, intervalo e aparadas; threads bloqueadas esperando por várias operações serem concluídas; e dados e eventos enviados e recebidos pelo NDB Cluster. Os contadores são incrementados pelo kernel do NDB sempre que chamadas da API do NDB são feitas ou dados são enviados ou recebidos pelos nós de dados.

O **mysqld** expõe os contadores de estatísticas da API NDB como variáveis de status do sistema, que podem ser identificados a partir do prefixo comum a todos os seus nomes (`Ndb_api_`). Os valores dessas variáveis podem ser lidos no cliente **mysql** a partir da saída de uma declaração `SHOW STATUS`, ou consultando a tabela do Schema de Desempenho `session_status` ou `global_status`. Ao comparar os valores das variáveis de status antes e depois da execução de uma declaração SQL que atua nas tabelas `NDB`, você pode observar as ações realizadas no nível da API NDB que correspondem a essa declaração, o que pode ser benéfico para o monitoramento e o ajuste de desempenho do NDB Cluster.

O MySQL Cluster Manager oferece uma interface avançada de linha de comando que simplifica muitas tarefas de gerenciamento do NDB Cluster que, de outra forma, seriam complexas, como iniciar, parar ou reiniciar um NDB Cluster com um grande número de nós. O cliente do MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. O MySQL Cluster Manager 8.0 oferece suporte ao NDB 8.0. Consulte o Manual do Usuário do MySQL Cluster Manager 8.0.43 para obter mais informações.

### 25.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

Além do arquivo de configuração central, um clúster também pode ser controlado através de uma interface de linha de comando disponível através do cliente de gerenciamento **ndb_mgm**. Esta é a principal interface administrativa de um clúster em execução.

Os comandos para os registros de eventos estão descritos na Seção 25.6.3, "Relatórios de eventos gerados no NDB Cluster"; os comandos para criar backups e restaurá-los estão fornecidos na Seção 25.6.8, "Backup online do NDB Cluster".

**Usando ndb_mgm com o MySQL Cluster Manager.**

O MySQL Cluster Manager 1.4.8 oferece suporte experimental para o NDB 8.0. O MySQL Cluster Manager gerencia o início e o término dos processos e acompanha seus estados internamente, portanto, não é necessário usar o **ndb_mgm** para essas tarefas em um NDB Cluster que está sob controle do MySQL Cluster Manager. É recomendado *não* usar o cliente de linha de comando **ndb_mgm** que vem com a distribuição do NDB Cluster para realizar operações que envolvam o início ou término de nós. Isso inclui, mas não está limitado aos comandos `START`, `STOP`, `RESTART` e `SHUTDOWN`. Para mais informações, consulte os comandos de processo do MySQL Cluster Manager.

O cliente de gerenciamento tem os seguintes comandos básicos. Na lista a seguir, *`node_id`* denota ou o ID do nó de dados ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do clúster.

* `CONNECT connection-string`(mysql-cluster-mgm-client-commands.html#ndbclient-connect)

Conecta-se ao servidor de gerenciamento indicado pela cadeia de conexão. Se o cliente já estiver conectado a este servidor, o cliente se reconecta.

* `CREATE NODEGROUP nodeid[, nodeid, ...]`(mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup)

Cria um novo grupo de nós de cluster NDB e faz com que os nós de dados se juntem a ele.

Este comando é usado após adicionar novos nós de dados online a um NDB Cluster e faz com que eles se juntem a um novo grupo de nós e, assim, comecem a participar plenamente no cluster. O comando leva como único parâmetro uma lista de IDs de nós separados por vírgula — estes são os IDs dos nós que foram adicionados e iniciados e que devem se juntar ao novo grupo de nós. A lista não deve conter IDs duplicados; começando com o NDB 8.0.26, a presença de quaisquer duplicatas faz com que o comando retorne um erro. O número de nós na lista deve ser o mesmo que o número de nós em cada grupo de nós que já faz parte do cluster (cada grupo de nós do NDB Cluster deve ter o mesmo número de nós). Em outras palavras, se o NDB Cluster consiste em 2 grupos de nós com 2 nós de dados cada, então o novo grupo de nós também deve ter 2 nós de dados.

O ID do grupo de nós do novo grupo de nós criado por este comando é determinado automaticamente e sempre o ID do grupo de nós não utilizado mais alto no clúster; não é possível configurá-lo manualmente.

Para mais informações, consulte a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster online”.

* `DROP NODEGROUP nodegroup_id`(mysql-cluster-mgm-client-commands.html#ndbclient-drop-nodegroup)

Descarte o grupo de nós do cluster NDB com o dado *`nodegroup_id`*.

Esse comando pode ser usado para descartar um grupo de nós de um NDB Cluster. `DROP NODEGROUP` leva como único argumento o ID do grupo de nós que será descartado.

`DROP NODEGROUP` atua apenas para remover os nós de dados do grupo de nós afetado nesse grupo de nós. Não para os nós de dados, não os atribui a um grupo de nós diferente ou não os remove da configuração do clúster. Um nó de dados que não pertence a um grupo de nós é indicado na saída do comando do cliente de gerenciamento `SHOW` com `no nodegroup` no lugar do ID do grupo de nós, como este (indicado em texto em negrito):

  ```
  id=3    @10.100.2.67  (8.0.44-ndb-8.0.44, no nodegroup)
  ```

`DROP NODEGROUP` funciona apenas quando todos os nós de dados no grupo de nós a serem descartados estão completamente vazios de qualquer dados de tabela e definições de tabela. Como atualmente não há nenhuma maneira de usar **ndb_mgm** ou o cliente **mysql** para remover todos os dados de um nó de dados específico ou grupo de nós, isso significa que o comando só tem sucesso nos dois casos seguintes:

1. Após emitir `CREATE NODEGROUP` no cliente **ndb_mgm**, mas antes de emitir quaisquer declarações `ALTER TABLE ... REORGANIZE PARTITION` no cliente **mysql**.

2. Após descartar todas as tabelas `NDBCLUSTER` usando `DROP TABLE`.

`TRUNCATE TABLE` não funciona para esse propósito, porque isso remove apenas os dados da tabela; os nós de dados continuam a armazenar a definição de uma tabela `NDBCLUSTER` até que uma declaração [`DROP TABLE`(drop-table.html "15.1.32 DROP TABLE Statement")]] seja emitida, o que faz com que os metadados da tabela sejam descartados.

Para mais informações sobre `DROP NODEGROUP`, consulte a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster Online”.

* `ENTER SINGLE USER MODE node_id`(mysql-cluster-mgm-client-commands.html#ndbclient-enter-single-user-mode)

Entra no modo de usuário único, pelo qual apenas o servidor MySQL identificado pelo ID do nó *`node_id`* é permitido acessar o banco de dados.

O cliente **ndb_mgm** fornece um reconhecimento claro de que este comando foi emitido e teve efeito, conforme mostrado aqui:

  ```
  ndb_mgm> ENTER SINGLE USER MODE 100
  Single user mode entered
  Access is granted for API node 100 only.
  ```

Além disso, o nó API ou SQL que tem acesso exclusivo quando no modo de usuário único é indicado na saída do comando `SHOW`, como este:

  ```
  ndb_mgm> SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     2 node(s)
  id=5    @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, single user mode, Nodegroup: 0, *)
  id=6    @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, single user mode, Nodegroup: 0)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @127.0.0.1  (mysql-8.0.44 ndb-8.0.44)

  [mysqld(API)]   2 node(s)
  id=100  @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, allowed single user)
  id=101 (not connected, accepting connect from any host)
  ```

* `EXIT SINGLE USER MODE`

Saída do modo de usuário único, permitindo que todos os nós SQL (ou seja, todos os processos em execução do **mysqld**) acessem o banco de dados.

Nota

É possível usar `EXIT SINGLE USER MODE` mesmo quando não estiver no modo de usuário único, embora o comando não tenha efeito nesse caso.

* `HELP`

Exibe informações sobre todos os comandos disponíveis.

* `node_id NODELOG DEBUG {ON|OFF}`(mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug)

Ativa a registro de depuração no log do nó, como se o nó ou nós afetados tivessem sido iniciados com a opção `--verbose`. `NODELOG DEBUG ON` inicia o registro de depuração; `NODELOG DEBUG OFF` desativa o registro de depuração.

* `PROMPT [prompt]`(mysql-cluster-mgm-client-commands.html#ndbclient-prompt)

Altera o prompt exibido pelo **ndb_mgm** para a literal de string *`prompt`*.

*`prompt`* não deve ser citado (a menos que você queira que o prompt inclua as aspas). Ao contrário do caso com o cliente **mysql**, sequências de caracteres especiais e escapamentos não são reconhecidos. Se chamado sem argumento, o comando redefiniu o prompt para o valor padrão (`ndb_mgm>`).

Alguns exemplos são mostrados aqui:

  ```
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ...
  mgm#1: PROMPT mymgm >
  mymgm > PROMPT 'mymgm:'
  'mymgm:' PROMPT  mymgm:
  mymgm: PROMPT
  ndb_mgm> EXIT
  $>
  ```

Observe que os espaços em branco no início e nos espaços dentro da string *`prompt`* não são cortados. Os espaços finais são removidos.

* `QUIT`, `EXIT`

Finaliza o cliente de gerenciamento.

Este comando não afeta nenhum nó conectado ao clúster.

* `node_id REPORT report-type`(mysql-cluster-mgm-client-commands.html#ndbclient-report)

Exibe um relatório do tipo *`report-type`* para o nó de dados identificado por *`node_id`*, ou para todos os nós de dados usando `ALL`.

Atualmente, existem três valores aceitos para *`report-type`*:

+ `BackupStatus` fornece um relatório de status sobre um backup de cluster em andamento

+ `MemoryUsage` exibe quanto espaço de memória de dados e memória de índice está sendo utilizado por cada nó de dados, conforme mostrado neste exemplo:

    ```
    ndb_mgm> ALL REPORT MEMORY

    Node 1: Data usage is 5%(177 32K pages of total 3200)
    Node 1: Index usage is 0%(108 8K pages of total 12832)
    Node 2: Data usage is 5%(177 32K pages of total 3200)
    Node 2: Index usage is 0%(108 8K pages of total 12832)
    ```

Essa informação também está disponível na tabela `ndbinfo.memoryusage`.

+ `EventLog` relata eventos dos buffers do log de eventos de um ou mais nós de dados.

*`report-type`* é sensível a maiúsculas e minúsculas e "borboleta"; para `MemoryUsage`, você pode usar `MEMORY` (como mostrado no exemplo anterior), `memory`, ou até mesmo simplesmente `MEM` (ou `mem`). Você pode abreviar `BackupStatus` de uma maneira semelhante.

* `node_id RESTART [-n] [-i] [-a] [-f]`(mysql-cluster-mgm-client-commands.html#ndbclient-restart)

Reinicia o nó de dados identificado por *`node_id`* (ou todos os nós de dados).

Usar a opção `-i` com `RESTART` faz com que o nó de dados realize um reinício inicial; ou seja, o sistema de arquivos do nó é apagado e recriado. O efeito é o mesmo que o obtido ao parar o processo do nó de dados e, em seguida, iniciá-lo novamente usando **ndbd** `--initial` a partir da concha do sistema.

Nota

Os arquivos de backup e os arquivos de dados do disco não são removidos quando esta opção é usada.

Usar a opção `-n` faz com que o processo do nó de dados seja reiniciado, mas o nó de dados não é realmente colocado online até que o comando apropriado `START` seja emitido. O efeito desta opção é o mesmo que o obtido ao parar o nó de dados e, em seguida, iniciá-lo novamente usando **ndbd** `--nostart` ou **ndbd** `-n` a partir da concha do sistema.

Usar `-a` faz com que todas as transações atuais que dependem deste nó sejam abortadas. Não é realizada nenhuma verificação no GCP quando o nó se reconecta ao clúster.

Normalmente, `RESTART` falha se a retirada do nó resultar em um grupo incompleto. A opção `-f` obriga o nó a reiniciar sem verificar isso. Se essa opção for usada e o resultado for um grupo incompleto, o grupo inteiro é reiniciado.

* `SHOW`

Exibe informações básicas sobre o clúster e os nós do clúster. Para todos os nós, a saída inclui o ID do nó, o tipo e a versão do software `NDB`. Se o nó estiver conectado, seu endereço IP também é mostrado; caso contrário, a saída mostra `not connected, accepting connect from ip_address`, com `any host` usado para nós que são permitidos para se conectar a partir de qualquer endereço.

Além disso, para os nós de dados, a saída inclui `starting` se o nó ainda não tiver iniciado, e mostra o grupo de nós do qual o nó faz parte. Se o nó de dados estiver atuando como o nó mestre, isso é indicado com um asterisco (`*`).

Considere um grupo cuja configuração inclui as informações mostradas aqui (configurações adicionais possíveis são omitidas por questões de clareza):

  ```
  [ndbd default]
  DataMemory= 128G
  NoOfReplicas= 2

  [ndb_mgmd]
  NodeId=50
  HostName=198.51.100.150

  [ndbd]
  NodeId=5
  HostName=198.51.100.10
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=6
  HostName=198.51.100.20
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=7
  HostName=198.51.100.30
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=8
  HostName=198.51.100.40
  DataDir=/var/lib/mysql-cluster

  [mysqld]
  NodeId=100
  HostName=198.51.100.100

  [api]
  NodeId=101
  ```

Após o agrupamento (incluindo um nó SQL) ter sido iniciado, `SHOW` exibe a seguinte saída:

  ```
  ndb_mgm> SHOW
  Connected to Management Server at: localhost:1186
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @198.51.100.10  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0, *)
  id=6    @198.51.100.20  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0)
  id=7    @198.51.100.30  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 1)
  id=8    @198.51.100.40  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @198.51.100.150  (mysql-8.0.44 ndb-8.0.44)

  [mysqld(API)]   2 node(s)
  id=100  @198.51.100.100  (mysql-8.0.44 ndb-8.0.44)
  id=101 (not connected, accepting connect from any host)
  ```

A saída deste comando também indica quando o clúster está no modo de usuário único (consulte a descrição do comando `ENTER SINGLE USER MODE`, bem como a Seção 25.6.6, “Modo de Usuário Único do Clúster NDB”). No NDB 8.0, também indica qual API ou nó SQL tem acesso exclusivo quando este modo está em vigor; isso funciona apenas quando todos os nós de dados e nós de gerenciamento conectados ao clúster estão executando o NDB 8.0.

* `SHUTDOWN`

Desliga todos os nós de dados do cluster e os nós de gerenciamento. Para sair do cliente de gerenciamento após isso ter sido feito, use `EXIT` ou `QUIT`.

Este comando *não* interrompe nenhum dos nós SQL ou nós API que estão conectados ao clúster.

* `node_id START`(mysql-cluster-mgm-client-commands.html#ndbclient-start)

Traz online o nó de dados identificado por *`node_id`* (ou todos os nós de dados).

`ALL START` funciona apenas em todos os nós de dados e não afeta os nós de gerenciamento.

Importante

Para usar este comando para colocar um nó de dados online, o nó de dados deve ter sido iniciado usando `--nostart` ou `-n`.

* `node_id STATUS`(mysql-cluster-mgm-client-commands.html#ndbclient-status)

Exibe informações de status para o nó de dados identificado por *`node_id`* (ou para todos os nós de dados).

Os possíveis valores de estado do nó incluem `UNKNOWN`, `NO_CONTACT`, `NOT_STARTED`, `STARTING`, `STARTED`, `SHUTTING_DOWN` e `RESTARTING`.

A saída deste comando também indica quando o clúster está no modo de usuário único.

* `node_id STOP [-a] [-f]`(mysql-cluster-mgm-client-commands.html#ndbclient-stop)

Para de funcionar o nó de dados ou de gerenciamento identificado por *`node_id`*.

Nota

`ALL STOP` funciona para parar apenas todos os nós de dados e não afeta os nós de gerenciamento.

Um nó afetado por este comando se desconecta do clúster e seu processo associado **ndbd** ou **ndb_mgmd** é encerrado.

A opção `-a` faz com que o nó seja parado imediatamente, sem esperar a conclusão de quaisquer transações pendentes.

Normalmente, `STOP` falha se o resultado causar um grupo incompleto. A opção `-f` força o nó a desligar sem verificar isso. Se esta opção for usada e o resultado for um grupo incompleto, o grupo é imediatamente desligado.

Aviso

O uso da opção `-a` também desativa a verificação de segurança que, de outra forma, seria realizada quando o comando `STOP` é invocado, para garantir que a parada do nó não cause um grupo incompleto. Em outras palavras, você deve ter extremo cuidado ao usar a opção `-a` com o comando `STOP`, devido ao fato de que essa opção permite que o grupo sofra um desligamento forçado, pois ele não tem mais uma cópia completa de todos os dados armazenados em `NDB`.

**Comandos adicionais.** Vários outros comandos disponíveis no cliente **ndb_mgm** são descritos em outros lugares, conforme mostrado na lista a seguir:

* `START BACKUP` é usado para realizar um backup online no cliente **ndb_mgm; o comando `ABORT BACKUP` é usado para cancelar um backup já em andamento. Para mais informações, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”.

O comando `CLUSTERLOG` é usado para realizar várias funções de registro. Consulte a Seção 25.6.3, “Relatórios de eventos gerados no NDB Cluster”, para obter mais informações e exemplos. `NODELOG DEBUG` ativa ou desativa impressões de depuração nos logs do nó, conforme descrito anteriormente nesta seção.

* Para trabalhos de teste e diagnóstico, o cliente suporta um comando `DUMP` que pode ser usado para executar comandos internos no clúster. Ele nunca deve ser usado em um ambiente de produção, a menos que orientado a fazê-lo pelo Suporte MySQL. Para mais informações, consulte os comandos DUMP do NDB Cluster Management Client.

### 25.6.2 Mensagens de registro do cluster do NDB

Esta seção contém informações sobre as mensagens escritas no log do clúster em resposta a diferentes eventos do log do clúster. Ela fornece informações adicionais e mais específicas sobre os erros do transportador `NDB`.

#### 25.6.2.1 NDB Cluster: Mensagens no Log do Cluster

A tabela a seguir lista as mensagens de log do cluster mais comuns do `NDB`. Para informações sobre o log do cluster, eventos de log e tipos de eventos, consulte a Seção 25.6.3, “Relatórios de eventos gerados no NDB Cluster”. Essas mensagens de log também correspondem aos tipos de eventos de log na API MGM; consulte O tipo Ndb_logevent_type, para informações relacionadas de interesse para os desenvolvedores da API de cluster.

**Tabela 25.53 Mensagens comuns do log do cluster NDB**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 25%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 10%"/><thead><tr> <th scope="col">Log Message</th> <th scope="col">Description</th> <th scope="col">Event Name</th> <th scope="col">Event Type</th> <th scope="col">Priority</th> <th scope="col">Severity</th> </tr></thead><tbody><tr> <th scope="row"><code>Node <em class="replaceable"><code>mgm_node_id</code></em>: Node <em class="replaceable"><code>data_node_id</code></em> Connected</code></th> <td>The data node having node ID <em class="replaceable"><code>node_id</code></em> has connected to the management server (node <em class="replaceable"><code>mgm_node_id</code></em>).</td> <td><code>Connected</code></td> <td><code>Connection</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>mgm_node_id</code></em>: Node <em class="replaceable"><code>data_node_id</code></em> Disconnected</code></th> <td>The data node having node ID <em class="replaceable"><code>data_node_id</code></em> has disconnected from the management server (node <em class="replaceable"><code>mgm_node_id</code></em>).</td> <td><code>Disconnected</code></td> <td><code>Connection</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>data_node_id</code></em>: Communication to Node <em class="replaceable"><code>api_node_id</code></em> closed</code></th> <td>The API node or SQL node having node ID <em class="replaceable"><code>api_node_id</code></em> is no longer communicating with data node <em class="replaceable"><code>data_node_id</code></em>.</td> <td><code>CommunicationClosed</code></td> <td><code>Connection</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>data_node_id</code></em>: Communication to Node <em class="replaceable"><code>api_node_id</code></em> opened</code></th> <td>The API node or SQL node having node ID <em class="replaceable"><code>api_node_id</code></em> is now communicating with data node <em class="replaceable"><code>data_node_id</code></em>.</td> <td><code>CommunicationOpened</code></td> <td><code>Connection</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>mgm_node_id</code></em>: Node <em class="replaceable"><code>api_node_id</code></em>: API <em class="replaceable"><code>version</code></em></code></th> <td>The API node having node ID <em class="replaceable"><code>api_node_id</code></em> has connected to management node <em class="replaceable"><code>mgm_node_id</code></em> using <code>NDB</code> API version <em class="replaceable"><code>version</code></em> (generally the same as the MySQL version number).</td> <td><code>ConnectedApiVersion</code></td> <td><code>Connection</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Global checkpoint <em class="replaceable"><code>gci</code></em> started</code></th> <td>A global checkpoint with the ID <em class="replaceable"><code>gci</code></em> has been started; node <em class="replaceable"><code>node_id</code></em> is the master responsible for this global checkpoint.</td> <td><code>GlobalCheckpointStarted</code></td> <td><code>Checkpoint</code></td> <td>9</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Global checkpoint <em class="replaceable"><code>gci</code></em> completed</code></th> <td>The global checkpoint having the ID <em class="replaceable"><code>gci</code></em> has been completed; node <em class="replaceable"><code>node_id</code></em> was the master responsible for this global checkpoint.</td> <td><code>GlobalCheckpointCompleted</code></td> <td><code>Checkpoint</code></td> <td>10</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Local checkpoint <em class="replaceable"><code>lcp</code></em> started. Keep GCI = <em class="replaceable"><code>current_gci</code></em> oldest restorable GCI = <em class="replaceable"><code>old_gci</code></em></code></th> <td>The local checkpoint having sequence ID <em class="replaceable"><code>lcp</code></em> has been started on node <em class="replaceable"><code>node_id</code></em>. The most recent GCI that can be used has the index <em class="replaceable"><code>current_gci</code></em>, and the oldest GCI from which the cluster can be restored has the index <em class="replaceable"><code>old_gci</code></em>.</td> <td><code>LocalCheckpointStarted</code></td> <td><code>Checkpoint</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Local checkpoint <em class="replaceable"><code>lcp</code></em> completed</code></th> <td>The local checkpoint having sequence ID <em class="replaceable"><code>lcp</code></em> on node <em class="replaceable"><code>node_id</code></em> has been completed.</td> <td><code>LocalCheckpointCompleted</code></td> <td><code>Checkpoint</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Local Checkpoint stopped in CALCULATED_KEEP_GCI</code></th> <td>The node was unable to determine the most recent usable GCI.</td> <td><code>LCPStoppedInCalcKeepGci</code></td> <td><code>Checkpoint</code></td> <td>0</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Table ID = <em class="replaceable"><code>table_id</code></em>, fragment <em class="replaceable"><code>ID = fragment_id</code></em> has completed LCP on Node <em class="replaceable"><code>node_id</code></em> maxGciStarted: <em class="replaceable"><code>started_gci</code></em> maxGciCompleted: <em class="replaceable"><code>completed_gci</code></em></code></th> <td>A table fragment has been checkpointed to disk on node <em class="replaceable"><code>node_id</code></em>. The GCI in progress has the index <em class="replaceable"><code>started_gci</code></em>, and the most recent GCI to have been completed has the index <em class="replaceable"><code>completed_gci</code></em>.</td> <td><code>LCPFragmentCompleted</code></td> <td><code>Checkpoint</code></td> <td>11</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: ACC Blocked <em class="replaceable"><code>num_1</code></em> and TUP Blocked <em class="replaceable"><code>num_2</code></em> times last second</code></th> <td>Undo logging is blocked because the log buffer is close to overflowing.</td> <td><code>UndoLogBlocked</code></td> <td><code>Checkpoint</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Start initiated <em class="replaceable"><code>version</code></em></code></th> <td>Data node <em class="replaceable"><code>node_id</code></em>, running <code>NDB</code> version <em class="replaceable"><code>version</code></em>, is beginning its startup process.</td> <td><code>NDBStartStarted</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Started <em class="replaceable"><code>version</code></em></code></th> <td>Data node <em class="replaceable"><code>node_id</code></em>, running <code>NDB</code> version <em class="replaceable"><code>version</code></em>, has started successfully.</td> <td><code>NDBStartCompleted</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: STTORRY received after restart finished</code></th> <td>The node has received a signal indicating that a cluster restart has completed.</td> <td><code>STTORRYRecieved</code></td> <td><code>StartUp</code></td> <td>15</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Start phase <em class="replaceable"><code>phase</code></em> completed (<em class="replaceable"><code>type</code></em>)</code></th> <td>The node has completed start phase <em class="replaceable"><code>phase</code></em> of a <em class="replaceable"><code>type</code></em> start. For a listing of start phases, see Section 25.6.4, “Summary of NDB Cluster Start Phases”. (<em class="replaceable"><code>type</code></em> is one of <code>initial</code>, <code>system</code>, <code>node</code>, <code>initial node</code>, or <code>&lt;Unknown&gt;</code>.)</td> <td><code>StartPhaseCompleted</code></td> <td><code>StartUp</code></td> <td>4</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: CM_REGCONF president = <em class="replaceable"><code>president_id</code></em>, own Node = <em class="replaceable"><code>own_id</code></em>, our dynamic id = <em class="replaceable"><code>dynamic_id</code></em></code></th> <td>Node <em class="replaceable"><code>president_id</code></em> has been selected as “president”. <em class="replaceable"><code>own_id</code></em> and <em class="replaceable"><code>dynamic_id</code></em> should always be the same as the ID (<em class="replaceable"><code>node_id</code></em>) of the reporting node.</td> <td><code>CM_REGCONF</code></td> <td><code>StartUp</code></td> <td>3</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: CM_REGREF from Node <em class="replaceable"><code>president_id</code></em> to our Node <em class="replaceable"><code>node_id</code></em>. Cause = <em class="replaceable"><code>cause</code></em></code></th> <td>The reporting node (ID <em class="replaceable"><code>node_id</code></em>) was unable to accept node <em class="replaceable"><code>president_id</code></em> as president. The <em class="replaceable"><code>cause</code></em> of the problem is given as one of <code>Busy</code>, <code>Election with wait = false</code>, <code>Not president</code>, <code class="literal">Election without selecting new candidate</code>, or <code class="literal">No such cause</code>.</td> <td><code>CM_REGREF</code></td> <td><code>StartUp</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: We are Node <em class="replaceable"><code>own_id</code></em> with dynamic ID <em class="replaceable"><code>dynamic_id</code></em>, our left neighbor is Node <em class="replaceable"><code>id_1</code></em>, our right is Node <em class="replaceable"><code>id_2</code></em></code></th> <td>The node has discovered its neighboring nodes in the cluster (node <em class="replaceable"><code>id_1</code></em> and node <em class="replaceable"><code>id_2</code></em>). <em class="replaceable"><code>node_id</code></em>, <em class="replaceable"><code>own_id</code></em>, and <em class="replaceable"><code>dynamic_id</code></em> should always be the same; if they are not, this indicates a serious misconfiguration of the cluster nodes.</td> <td><code>FIND_NEIGHBOURS</code></td> <td><code>StartUp</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: <em class="replaceable"><code>type</code></em> shutdown initiated</code></th> <td>The node has received a shutdown signal. The <em class="replaceable"><code>type</code></em> of shutdown is either <code>Cluster</code> or <code>Node</code>.</td> <td><code>NDBStopStarted</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node shutdown completed </code>[<code class="literal">, <em class="replaceable"><code>action</code></em></code>] [<code class="literal">Initiated by signal <em class="replaceable"><code>signal</code></em>.</code>]</th> <td>The node has been shut down. This report may include an <em class="replaceable"><code>action</code></em>, which if present is one of <code>restarting</code>, <code class="literal">no start</code>, or <code>initial</code>. The report may also include a reference to an <code>NDB</code> Protocol <em class="replaceable"><code>signal</code></em>; for possible signals, refer to Operations and Signals.</td> <td><code>NDBStopCompleted</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Forced node shutdown completed </code>[<code class="literal">, action</code>]<code>.</code> [<code class="literal">Occurred during startphase <em class="replaceable"><code>start_phase</code></em>.</code>] [<code class="literal"> Initiated by <em class="replaceable"><code>signal</code></em>.</code>] [<code class="literal">Caused by error <em class="replaceable"><code>error_code</code></em>: '<em class="replaceable"><code>error_message</code></em>(<em class="replaceable"><code>error_classification</code></em>). <em class="replaceable"><code>error_status</code></em>'.</code> [<code class="literal">(extra info <em class="replaceable"><code>extra_code</code></em>)</code>]]</th> <td>The node has been forcibly shut down. The <em class="replaceable"><code>action</code></em> (one of <code>restarting</code>, <code class="literal">no start</code>, or <code>initial</code>) subsequently being taken, if any, is also reported. If the shutdown occurred while the node was starting, the report includes the <em class="replaceable"><code>start_phase</code></em> during which the node failed. If this was a result of a <em class="replaceable"><code>signal</code></em> sent to the node, this information is also provided (see Operations and Signals, for more information). If the error causing the failure is known, this is also included; for more information about <code>NDB</code> error messages and classifications, see NDB Cluster API Errors.</td> <td><code>NDBStopForced</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node shutdown aborted</code></th> <td>The node shutdown process was aborted by the user.</td> <td><code>NDBStopAborted</code></td> <td><code>StartUp</code></td> <td>1</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: StartLog: [GCI Keep: <em class="replaceable"><code>keep_pos</code></em> LastCompleted: <em class="replaceable"><code>last_pos</code></em> NewestRestorable: <em class="replaceable"><code>restore_pos</code></em>]</code></th> <td>This reports global checkpoints referenced during a node start. The redo log prior to <em class="replaceable"><code>keep_pos</code></em> is dropped. <em class="replaceable"><code>last_pos</code></em> is the last global checkpoint in which data node the participated; <em class="replaceable"><code>restore_pos</code></em> is the global checkpoint which is actually used to restore all data nodes.</td> <td><code>StartREDOLog</code></td> <td><code>StartUp</code></td> <td>4</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><em class="replaceable"><code>startup_message</code></em> [<span class="emphasis"><em>Listed separately; see below.</em></span>]</th> <td>There are a number of possible startup messages that can be logged under different circumstances. These are listed separately; see Section 25.6.2.2, “NDB Cluster Log Startup Messages”.</td> <td><code>StartReport</code></td> <td><code>StartUp</code></td> <td>4</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node restart completed copy of dictionary information</code></th> <td>Copying of data dictionary information to the restarted node has been completed.</td> <td><code>NR_CopyDict</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node restart completed copy of distribution information</code></th> <td>Copying of data distribution information to the restarted node has been completed.</td> <td><code>NR_CopyDistr</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node restart starting to copy the fragments to Node <em class="replaceable"><code>node_id</code></em></code></th> <td>Copy of fragments to starting data node <em class="replaceable"><code>node_id</code></em> has begun</td> <td><code>NR_CopyFragsStarted</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Table ID = <em class="replaceable"><code>table_id</code></em>, fragment ID = <em class="replaceable"><code>fragment_id</code></em> have been copied to Node <em class="replaceable"><code>node_id</code></em></code></th> <td>Fragment <em class="replaceable"><code>fragment_id</code></em> from table <em class="replaceable"><code>table_id</code></em> has been copied to data node <em class="replaceable"><code>node_id</code></em></td> <td><code>NR_CopyFragDone</code></td> <td><code>NodeRestart</code></td> <td>10</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node restart completed copying the fragments to Node <em class="replaceable"><code>node_id</code></em></code></th> <td>Copying of all table fragments to restarting data node <em class="replaceable"><code>node_id</code></em> has been completed</td> <td><code>NR_CopyFragsCompleted</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Node <em class="replaceable"><code>node1_id</code></em> completed failure of Node <em class="replaceable"><code>node2_id</code></em></code></th> <td>Data node <em class="replaceable"><code>node1_id</code></em> has detected the failure of data node <em class="replaceable"><code>node2_id</code></em></td> <td><code>NodeFailCompleted</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code class="literal">All nodes completed failure of Node <em class="replaceable"><code>node_id</code></em></code></th> <td>All (remaining) data nodes have detected the failure of data node <em class="replaceable"><code>node_id</code></em></td> <td><code>NodeFailCompleted</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code class="literal">Node failure of <em class="replaceable"><code>node_id</code></em><em class="replaceable"><code>block</code></em> completed</code></th> <td>The failure of data node <em class="replaceable"><code>node_id</code></em> has been detected in the <em class="replaceable"><code>block</code></em><code>NDB</code> kernel block, where block is 1 of <code>DBTC</code>, <code>DBDICT</code>, <code>DBDIH</code>, or <code>DBLQH</code>; for more information, see NDB Kernel Blocks</td> <td><code>NodeFailCompleted</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>mgm_node_id</code></em>: Node <em class="replaceable"><code>data_node_id</code></em> has failed. The Node state at failure was <em class="replaceable"><code>state_code</code></em></code></th> <td>A data node has failed. Its state at the time of failure is described by an arbitration state code <em class="replaceable"><code>state_code</code></em>: possible state code values can be found in the file <code>include/kernel/signaldata/ArbitSignalData.hpp</code>.</td> <td><code>NODE_FAILREP</code></td> <td><code>NodeRestart</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code class="literal">President restarts arbitration thread [state=<em class="replaceable"><code>state_code</code></em>]</code> or <code class="literal">Prepare arbitrator node <em class="replaceable"><code>node_id</code></em> [ticket=<em class="replaceable"><code>ticket_id</code></em>]</code> or <code class="literal">Receive arbitrator node <em class="replaceable"><code>node_id</code></em> [ticket=<em class="replaceable"><code>ticket_id</code></em>]</code> or <code class="literal">Started arbitrator node <em class="replaceable"><code>node_id</code></em> [ticket=<em class="replaceable"><code>ticket_id</code></em>]</code> or <code class="literal">Lost arbitrator node <em class="replaceable"><code>node_id</code></em> - process failure [state=<em class="replaceable"><code>state_code</code></em>]</code> or <code class="literal">Lost arbitrator node <em class="replaceable"><code>node_id</code></em> - process exit [state=<em class="replaceable"><code>state_code</code></em>]</code> or <code class="literal">Lost arbitrator node <em class="replaceable"><code>node_id</code></em> - <em class="replaceable"><code>error_message</code></em> [state=<em class="replaceable"><code>state_code</code></em>]</code></th> <td>This is a report on the current state and progress of arbitration in the cluster. <em class="replaceable"><code>node_id</code></em> is the node ID of the management node or SQL node selected as the arbitrator. <em class="replaceable"><code>state_code</code></em> is an arbitration state code, as found in <code>include/kernel/signaldata/ArbitSignalData.hpp</code>. When an error has occurred, an <em class="replaceable"><code>error_message</code></em>, also defined in <code>ArbitSignalData.hpp</code>, is provided. <em class="replaceable"><code>ticket_id</code></em> is a unique identifier handed out by the arbitrator when it is selected to all the nodes that participated in its selection; this is used to ensure that each node requesting arbitration was one of the nodes that took part in the selection process.</td> <td><code>ArbitState</code></td> <td><code>NodeRestart</code></td> <td>6</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Arbitration check lost - less than 1/2 nodes left</code> or <code class="literal">Arbitration check won - all node groups and more than 1/2 nodes left</code> or <code class="literal">Arbitration check won - node group majority</code> or <code class="literal">Arbitration check lost - missing node group</code> or <code class="literal">Network partitioning - arbitration required</code> or <code class="literal">Arbitration won
              - positive reply from node <em class="replaceable"><code>node_id</code></em></code> or <code class="literal">Arbitration lost - negative reply from node <em class="replaceable"><code>node_id</code></em></code> or <code class="literal">Network partitioning - no arbitrator available</code> or <code class="literal">Network partitioning - no arbitrator configured</code> or <code class="literal">Arbitration failure - <em class="replaceable"><code>error_message</code></em> [state=<em class="replaceable"><code>state_code</code></em>]</code></th> <td>This message reports on the result of arbitration. In the event of arbitration failure, an <em class="replaceable"><code>error_message</code></em> and an arbitration <em class="replaceable"><code>state_code</code></em> are provided; definitions for both of these are found in <code>include/kernel/signaldata/ArbitSignalData.hpp</code>.</td> <td><code>ArbitResult</code></td> <td><code>NodeRestart</code></td> <td>2</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: GCP Take over started</code></th> <td>This node is attempting to assume responsibility for the next global checkpoint (that is, it is becoming the master node)</td> <td><code>GCP_TakeoverStarted</code></td> <td><code>NodeRestart</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: GCP Take over completed</code></th> <td>This node has become the master, and has assumed responsibility for the next global checkpoint</td> <td><code>GCP_TakeoverCompleted</code></td> <td><code>NodeRestart</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: LCP Take over started</code></th> <td>This node is attempting to assume responsibility for the next set of local checkpoints (that is, it is becoming the master node)</td> <td><code>LCP_TakeoverStarted</code></td> <td><code>NodeRestart</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: LCP Take over completed</code></th> <td>This node has become the master, and has assumed responsibility for the next set of local checkpoints</td> <td><code>LCP_TakeoverCompleted</code></td> <td><code>NodeRestart</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Trans. Count = <em class="replaceable"><code>transactions</code></em>, Commit Count = <em class="replaceable"><code>commits</code></em>, Read Count = <em class="replaceable"><code>reads</code></em>, Simple Read Count = <em class="replaceable"><code>simple_reads</code></em>, Write Count = <em class="replaceable"><code>writes</code></em>, AttrInfo Count = <em class="replaceable"><code>AttrInfo_objects</code></em>, Concurrent Operations = <em class="replaceable"><code>concurrent_operations</code></em>, Abort Count = <em class="replaceable"><code>aborts</code></em>, Scans = <em class="replaceable"><code>scans</code></em>, Range scans = <em class="replaceable"><code>range_scans</code></em></code></th> <td>This report of transaction activity is given approximately once every 10 seconds</td> <td><code>TransReportCounters</code></td> <td><code>Statistic</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Operations=<em class="replaceable"><code>operations</code></em></code></th> <td>Number of operations performed by this node, provided approximately once every 10 seconds</td> <td><code>OperationReportCounters</code></td> <td><code>Statistic</code></td> <td>8</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Table with ID = <em class="replaceable"><code>table_id</code></em> created</code></th> <td>A table having the table ID shown has been created</td> <td><code>TableCreated</code></td> <td><code>Statistic</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Mean loop Counter in doJob last 8192 times = <em class="replaceable"><code>count</code></em></code></th> <td></td> <td><code>JobStatistic</code></td> <td><code>Statistic</code></td> <td>9</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Mean send size to Node = <em class="replaceable"><code>node_id</code></em> last 4096 sends = <em class="replaceable"><code>bytes</code></em> bytes</code></th> <td>This node is sending an average of <em class="replaceable"><code>bytes</code></em> bytes per send to node <em class="replaceable"><code>node_id</code></em></td> <td><code>SendBytesStatistic</code></td> <td><code>Statistic</code></td> <td>9</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Mean receive size to Node = <em class="replaceable"><code>node_id</code></em> last 4096 sends = <em class="replaceable"><code>bytes</code></em> bytes</code></th> <td>This node is receiving an average of <em class="replaceable"><code>bytes</code></em> of data each time it receives data from node <em class="replaceable"><code>node_id</code></em></td> <td><code>ReceiveBytesStatistic</code></td> <td><code>Statistic</code></td> <td>9</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Data usage is <em class="replaceable"><code>data_memory_percentage</code></em>% (<em class="replaceable"><code>data_pages_used</code></em> 32K pages of total <em class="replaceable"><code>data_pages_total</code></em>)</code> / <code>Node <em class="replaceable"><code>node_id</code></em>: Index usage is <em class="replaceable"><code>index_memory_percentage</code></em>% (<em class="replaceable"><code>index_pages_used</code></em> 8K pages of total <em class="replaceable"><code>index_pages_total</code></em>) </code></th> <td>This report is generated when a <a class="ulink" href="/doc/ndb-internals/en/dump-command-1000.html" target="_top"><code class="literal">DUMP 1000</code></a> command is issued in the cluster management client</td> <td><code>MemoryUsage</code></td> <td><code>Statistic</code></td> <td>5</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node1_id</code></em>: Transporter to node <em class="replaceable"><code>node2_id</code></em> reported error <em class="replaceable"><code>error_code</code></em>: <em class="replaceable"><code>error_message</code></em></code></th> <td>A transporter error occurred while communicating with node <em class="replaceable"><code>node2_id</code></em>; for a listing of transporter error codes and messages, see NDB Transporter Errors, in MySQL NDB Cluster Internals Manual</td> <td><code>TransporterError</code></td> <td><code>Error</code></td> <td>2</td> <td><code>ERROR</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node1_id</code></em>: Transporter to node <em class="replaceable"><code>node2_id</code></em> reported error <em class="replaceable"><code>error_code</code></em>: <em class="replaceable"><code>error_message</code></em></code></th> <td>A warning of a potential transporter problem while communicating with node <em class="replaceable"><code>node2_id</code></em>; for a listing of transporter error codes and messages, see NDB Transporter Errors, for more information</td> <td><code>TransporterWarning</code></td> <td><code>Error</code></td> <td>8</td> <td><code>WARNING</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node1_id</code></em>: Node <em class="replaceable"><code>node2_id</code></em> missed heartbeat <em class="replaceable"><code>heartbeat_id</code></em></code></th> <td>This node missed a heartbeat from node <em class="replaceable"><code>node2_id</code></em></td> <td><code>MissedHeartbeat</code></td> <td><code>Error</code></td> <td>8</td> <td><code>WARNING</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node1_id</code></em>: Node <em class="replaceable"><code>node2_id</code></em> declared dead due to missed heartbeat</code></th> <td>This node has missed at least 3 heartbeats from node <em class="replaceable"><code>node2_id</code></em>, and so has declared that node “dead”</td> <td><code>DeadDueToHeartbeat</code></td> <td><code>Error</code></td> <td>8</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node1_id</code></em>: Node Sent Heartbeat to node = <em class="replaceable"><code>node2_id</code></em></code></th> <td>This node has sent a heartbeat to node <em class="replaceable"><code>node2_id</code></em></td> <td><code>SentHeartbeat</code></td> <td><code>Info</code></td> <td>12</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Event buffer status (<em class="replaceable"><code>object_id</code></em>): used=<em class="replaceable"><code>bytes_used</code></em> (<em class="replaceable"><code>percent_used</code></em>% of alloc) alloc=<em class="replaceable"><code>bytes_allocated</code></em> max=<em class="replaceable"><code>bytes_available</code></em> latest_consumed_epoch=<em class="replaceable"><code>latest_consumed_epoch</code></em> latest_buffered_epoch=<em class="replaceable"><code>latest_buffered_epoch</code></em> report_reason=<em class="replaceable"><code>report_reason</code></em></code></th> <td>This report is seen during heavy event buffer usage, for example, when many updates are being applied in a relatively short period of time; the report shows the number of bytes and the percentage of event buffer memory used, the bytes allocated and percentage still available, and the latest buffered and consumed epochs; for more information, see Section 25.6.2.3, “Event Buffer Reporting in the Cluster Log”</td> <td><code>EventBufferStatus2</code></td> <td><code>Info</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Entering single user mode</code>, <code class="literal">Node <em class="replaceable"><code>node_id</code></em>: Entered single user mode Node <em class="replaceable"><code>API_node_id</code></em> has exclusive access</code>, <code class="literal">Node <em class="replaceable"><code>node_id</code></em>: Entering single user mode</code></th> <td>These reports are written to the cluster log when entering and exiting single user mode; <em class="replaceable"><code>API_node_id</code></em> is the node ID of the API or SQL having exclusive access to the cluster (for more information, see Section 25.6.6, “NDB Cluster Single User Mode”); the message <code class="literal">Unknown single user report <em class="replaceable"><code>API_node_id</code></em></code> indicates an error has taken place and should never be seen in normal operation</td> <td><code>SingleUser</code></td> <td><code>Info</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Backup <em class="replaceable"><code>backup_id</code></em> started from node <em class="replaceable"><code>mgm_node_id</code></em></code></th> <td>A backup has been started using the management node having <em class="replaceable"><code>mgm_node_id</code></em>; this message is also displayed in the cluster management client when the <code>START BACKUP</code> command is issued; for more information, see Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”</td> <td><code>BackupStarted</code></td> <td><code>Backup</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Backup <em class="replaceable"><code>backup_id</code></em> started from node <em class="replaceable"><code>mgm_node_id</code></em> completed. StartGCP: <em class="replaceable"><code>start_gcp</code></em> StopGCP: <em class="replaceable"><code>stop_gcp</code></em> #Records: <em class="replaceable"><code>records</code></em> #LogRecords: <em class="replaceable"><code>log_records</code></em> Data: <em class="replaceable"><code>data_bytes</code></em> bytes Log: <em class="replaceable"><code>log_bytes</code></em> bytes</code></th> <td>The backup having the ID <em class="replaceable"><code>backup_id</code></em> has been completed; for more information, see Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”</td> <td><code>BackupCompleted</code></td> <td><code>Backup</code></td> <td>7</td> <td><code>INFO</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Backup request from <em class="replaceable"><code>mgm_node_id</code></em> failed to start. Error: <em class="replaceable"><code>error_code</code></em></code></th> <td>The backup failed to start; for error codes, see MGM API Errors</td> <td><code>BackupFailedToStart</code></td> <td><code>Backup</code></td> <td>7</td> <td><code>ALERT</code></td> </tr><tr> <th scope="row"><code>Node <em class="replaceable"><code>node_id</code></em>: Backup <em class="replaceable"><code>backup_id</code></em> started from <em class="replaceable"><code>mgm_node_id</code></em> has been aborted. Error: <em class="replaceable"><code>error_code</code></em></code></th> <td>The backup was terminated after starting, possibly due to user intervention</td> <td><code>BackupAborted</code></td> <td><code>Backup</code></td> <td>7</td> <td><code>ALERT</code></td> </tr></tbody></table>

#### 25.6.2.2 Mensagens de inicialização do log do cluster do NDB

Possíveis mensagens de inicialização com descrições estão fornecidas na lista a seguir:

* `Initial start, waiting for %s to connect, nodes [ all: %s connected: %s no-wait: %s ]`

* `Waiting until nodes: %s connects, nodes [ all: %s connected: %s no-wait: %s ]`

* `Waiting %u sec for nodes %s to connect, nodes [ all: %s connected: %s no-wait: %s ]`

* `Waiting for non partitioned start, nodes [ all: %s connected: %s missing: %s no-wait: %s ]`

* `Waiting %u sec for non partitioned start, nodes [ all: %s connected: %s missing: %s no-wait: %s ]`

* `Initial start with nodes %s [ missing: %s no-wait: %s ]`

* `Start with all nodes %s`
* `Start with nodes %s [ missing: %s no-wait: %s ]`

* `Start potentially partitioned with nodes %s [ missing: %s no-wait: %s ]`

* `Unknown startreport: 0x%x [ %s %s %s %s ]`

#### 25.6.2.3 Relatório do buffer de eventos no log do cluster

`NDB` utiliza um ou mais buffers de memória para eventos recebidos dos nós de dados. Há um buffer para cada objeto `Ndb` que se submete a eventos de tabela, o que significa que geralmente há dois buffers para cada **mysqld** que realiza registro binário (um buffer para eventos de esquema e outro para eventos de dados). Cada buffer contém épocas compostas por eventos. Esses eventos consistem em tipos de operação (inserir, atualizar, excluir) e dados de linha (imagens antes e depois, além de metadados).

`NDB` gera mensagens no log do clúster para descrever o estado desses buffers. Embora esses relatórios apareçam no log do clúster, eles se referem a buffers em nós da API (ao contrário da maioria das outras mensagens do log do clúster, que são geradas por nós de dados).

Os relatórios de registro de buffer de evento no log do clúster utilizam o formato mostrado aqui:

```
Node node_id: Event buffer status (object_id):
used=bytes_used (percent_used% of alloc)
alloc=bytes_allocated (percent_alloc% of max) max=bytes_available
latest_consumed_epoch=latest_consumed_epoch
latest_buffered_epoch=latest_buffered_epoch
report_reason=report_reason
```

Os campos que compõem este relatório estão listados aqui, com descrições:

* *`node_id`*: ID do nó onde o relatório foi gerado.

* *`object_id`*: ID do objeto `Ndb` onde o relatório foi gerado.

* *`bytes_used`*: Número de bytes utilizados pelo buffer.

* *`percent_used`*: Porcentagem de bytes alocados utilizados.

* *`bytes_allocated`*: Número de bytes alocados para este buffer.

* *`percent_alloc`*: Porcentagem de bytes disponíveis utilizados; não impressa se `ndb_eventbuffer_max_alloc` for igual a 0 (sem limite).

* *`bytes_available`*: Número de bytes disponíveis; este é 0 se `ndb_eventbuffer_max_alloc` for 0 (sem limite).

* *`latest_consumed_epoch`*: A época mais recentemente consumida até o término. (Em aplicativos da API NDB, isso é feito chamando `nextEvent()`.)

* *`latest_buffered_epoch`*: A época mais recentemente armazenada (completamente) no buffer de eventos.

* *`report_reason`*: A razão para a elaboração do relatório. As possíveis razões são mostradas mais adiante nesta seção.

As possíveis razões para o relato estão descritas na lista a seguir:

* `ENOUGH_FREE_EVENTBUFFER`: O buffer do evento tem espaço suficiente.

`LOW_FREE_EVENTBUFFER`: O buffer de eventos está com pouco espaço livre.

O nível de porcentagem livre do limiar que desencadeia esses relatórios pode ser ajustado definindo a variável do servidor `ndb_report_thresh_binlog_mem_usage`.

* `BUFFERED_EPOCHS_OVER_THRESHOLD`: Se o número de épocas bufferadas excedeu o limite configurado. Esse número é a diferença entre a última época que foi recebida na íntegra e a época que foi consumida mais recentemente (em aplicativos da API NDB, isso é feito ao chamar `nextEvent()` ou `nextEvent2()`). O relatório é gerado a cada segundo até que o número de épocas bufferadas vá abaixo do limite, que pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_epoch_slip`. Você também pode ajustar o limite em aplicativos da API NDB chamando `setEventBufferQueueEmptyEpoch()`.

* `PARTIALLY_DISCARDING`: A memória de buffer de eventos está esgotada, ou seja, 100% de `ndb_eventbuffer_max_alloc` foi utilizado. Qualquer época parcialmente bufferizada é bufferizada até o término, mesmo que o uso exceda 100%, mas quaisquer novas épocas recebidas são descartadas. Isso significa que ocorreu uma lacuna no fluxo de eventos.

* `COMPLETELY_DISCARDING`: Nenhuma época está em buffer.

* `PARTIALLY_BUFFERING`: A porcentagem de buffer livre após a lacuna aumentou para o limite, que pode ser definido no cliente **mysql** usando a variável de sistema do sistema de servidor `ndb_eventbuffer_free_percent` ou em aplicativos da API NDB, chamando `set_eventbuffer_free_percent()`. Novos períodos são bufferizados. Períodos que não puderam ser concluídos devido à lacuna são descartados.

* `COMPLETELY_BUFFERING`: Todos os períodos recebidos estão sendo armazenados em buffer, o que significa que há memória de buffer de eventos suficiente. A lacuna no fluxo de eventos foi fechada.

#### 25.6.2.4 NDB Cluster: Erros do Transportador NDB

Esta seção lista códigos de erro, nomes e mensagens que são escritos no log do cluster em caso de erros de transportador.

0x00 :   TE_NO_ERROR

Nenhuma falha

0x01: TE_ERROR_CLOSING_SOCKET

Erro encontrado durante a fechamento da conexão de rede

0x02 :   TE_ERROR_IN_SELECT_BEFORE_ACCEPT

Erro encontrado antes de aceitar. O transportador tentará novamente

0x03 :   TE_INVALID_MESSAGE_LENGTH

Erro encontrado na mensagem (comprimento da mensagem inválido)

0x04 :   TE_INVALID_CHECKSUM

Erro encontrado na mensagem (checksum)

0x05:   TE_COULD_NOT_CREATE_SOCKET

Erro encontrado ao criar socket (não foi possível criar socket)

0x06:   TE_COULD_NOT_BIND_SOCKET

Erro encontrado ao vincular o socket do servidor

0x07 :   TE_LISTEN_FAILED

Erro encontrado ao ouvir a conexão do servidor

0x08 :   TE_ACCEPT_RETURN_ERROR

Erro encontrado durante accept(erro de retorno aceito)

0x0b :   TE_SHM_DISCONNECT

O nó remoto se desconectou

0x0c :   TE_SHM_IPC_STAT

Incapaz de verificar o segmento shm

0x0d :   TE_SHM_UNABLE_TO_CREATE_SEGMENT

Incapaz de criar segmento shm

0x0e :   TE_SHM_UNABLE_TO_ATTACH_SEGMENT

Incapaz de anexar o segmento shm

0x0f: TE_SHM_UNABLE_TO_REMOVE_SEGMENT

Incapaz de remover o segmento shm

0x10: TE_TOO_SMALL_SIGID

ID de assinatura muito pequeno

0x11: TE_TOO_LARGE_SIGID

ID de assinatura muito grande

0x12: TE_WAIT_STACK_FULL

A pilha de espera estava cheia

0x13 :   TE_RECEIVE_BUFFER_FULL

O buffer foi preenchido

0x14: TE_SIGNAL_LOST_SEND_BUFFER_FULL

O buffer foi preenchido e a tentativa de enviar com força falhou

0x15: TE_SIGNAL_LOST

O envio falhou por motivo desconhecido (perdeu sinal)

0x16: TE_SEND_BUFFER_FULL

O buffer de envio estava cheio, mas dormir por um tempo resolveu o problema.

0x21: TE_SHM_IPC_PERMANENTE

Erro permanente do Shm ipc

Nota

Os códigos de erro do transportador de 0x17 a 0x20 e 0x22 são reservados para conexões SCI, que não são suportadas nesta versão do NDB Cluster, e, portanto, não estão incluídos aqui.

### 25.6.3 Relatórios de eventos gerados em NDB Cluster

Nesta seção, discutimos os tipos de registros de eventos fornecidos pelo NDB Cluster e os tipos de eventos que são registrados.

O NDB Cluster oferece dois tipos de registro de eventos:

* O log do clúster, que inclui eventos gerados por todos os nós do clúster. O log do clúster é o log recomendado para a maioria dos usos, pois fornece informações de registro para um clúster inteiro em um único local.

Por padrão, o log do clúster é salvo em um arquivo chamado `ndb_node_id_cluster.log`, (onde *`node_id`* é o ID do nó do servidor de gerenciamento) no `DataDir` do servidor de gerenciamento.

As informações de registro do cluster também podem ser enviadas para `stdout` ou para uma instalação `syslog`, além de serem salvas em um arquivo, conforme determinado pelos valores definidos para os parâmetros de configuração `DataDir` e `LogDestination`. Consulte a Seção 25.4.3.5, “Definindo um servidor de gerenciamento de cluster NDB”, para obter mais informações sobre esses parâmetros.

* Os logs do nó são locais para cada nó.

A saída gerada pelo registro de eventos do nó é escrita no arquivo `ndb_node_id_out.log` (onde *`node_id`* é o ID do nó) no `DataDir` do nó. Os registros de eventos do nó são gerados tanto para nós de gerenciamento quanto para nós de dados.

Os logs do nó são destinados a serem usados apenas durante o desenvolvimento da aplicação ou para depuração do código da aplicação.

Cada evento que deve ser relatado pode ser distinguido de acordo com três critérios diferentes:

* *Categoria*: Isso pode ser qualquer um dos seguintes valores: `STARTUP`, `SHUTDOWN`, `STATISTICS`, `CHECKPOINT`, `NODERESTART`, `CONNECTION`, `ERROR` ou `INFO`.

* *Prioridade*: Isso é representado por um dos números de 0 a 15, inclusive, onde 0 indica “mais importante” e 15 “menos importante”.

* *Nível de gravidade*: Pode ser qualquer um dos seguintes valores: `ON`, `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT` ou `ALL`. (Isso também é às vezes referido como o nível de log.)

O log do clúster pode ser filtrado nessas propriedades usando o comando do cliente de gerenciamento NDB `CLUSTERLOG`. Esse comando afeta apenas o log do clúster e não tem efeito nos logs dos nós; o registro de depuração em um ou mais logs dos nós pode ser ativado e desativado usando o comando **ndb_mgm `NODELOG DEBUG`.

O formato usado em uma mensagem de log gerada pelo NDB Cluster (a partir do NDB 8.0.26) é o mostrado aqui:

```
timestamp [node_type] level -- Node node_id: message
```

Cada linha do log, ou mensagem de log, contém as seguintes informações:

* Um *`timestamp`* no formato `YYYY-MM-DD HH:MM:SS`. O valor do timestamp atualmente resolve apenas em segundos inteiros; os segundos fracionários não são suportados.

* O *`node_type`*, ou tipo de nó ou aplicativo que está realizando o registro. No log do clúster, este é sempre `[MgmSrvr]`; no log do nó de dados, é sempre `[ndbd]`. `[NdbApi]` e outros valores são possíveis em logs gerados por aplicativos e ferramentas da API NDB.

* O *`level`* do evento, que às vezes também é referido como seu nível de gravidade ou nível de log. Consulte mais informações sobre os níveis de gravidade anteriormente nesta seção, bem como na Seção 25.6.3.1, “Comandos de Gerenciamento de Registro de Agrupamento NDB”, para mais informações.

* O ID do nó que relata o evento (*`node_id`*).

* Um *`message`* contendo uma descrição do evento. Os tipos mais comuns de eventos que aparecem no log são as conexões e desconexões entre diferentes nós no clúster, e quando os pontos de verificação ocorrem. Em alguns casos, a descrição pode conter status ou outras informações.

Uma amostra de um registro de cluster real é mostrada aqui:

```
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 5 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 5 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 6 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 6 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: President restarts arbitration thread [state=1]
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 7 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 7 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 8 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 8 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 9 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 9 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 50 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 50 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 101 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 101 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Started (mysql-8.0.44 ndb-8.0.44)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Started (mysql-8.0.44 ndb-8.0.44)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Node 50: API mysql-8.0.44 ndb-8.0.44
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Node 50: API mysql-8.0.44 ndb-8.0.44
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Prepare arbitrator node 50 [ticket=75fd00010fa8b608]
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Started arbitrator node 50 [ticket=75fd00010fa8b608]
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Communication to Node 100 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Communication to Node 101 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Communication to Node 100 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Communication to Node 101 opened
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Alloc node id 100 succeeded
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Nodeid 100 allocated for API at 127.0.0.1
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 100: mysqld --server-id=1
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 5: Node 100 Connected
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 6: Node 100 Connected
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 5: Node 100: API mysql-8.0.44 ndb-8.0.44
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 6: Node 100: API mysql-8.0.44 ndb-8.0.44
```

Para informações adicionais, consulte a Seção 25.6.3.2, “Eventos de registro do cluster NDB”.

#### 25.6.3.1 Comandos de Gerenciamento de Registro de Agrupamento NDB

O **ndb_mgm** suporta uma série de comandos de gerenciamento relacionados ao log do clúster e aos logs dos nós. Na lista a seguir, *`node_id`* denota ou o ID do nó de armazenamento ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do clúster.

* `CLUSTERLOG ON`

Ativa o registro do cluster.

* `CLUSTERLOG OFF`

Desativa o registro do cluster.

* `CLUSTERLOG INFO`

Fornece informações sobre as configurações do log do cluster.

* `node_id CLUSTERLOG category=threshold`

Registre eventos *`category`* com prioridade igual a ou menor que *`threshold`* no log do clúster.

* `CLUSTERLOG TOGGLE severity_level`

Ativa a registro de eventos do clúster do *`severity_level`* especificado.

A tabela a seguir descreve a configuração padrão (para todos os nós de dados) do limite da categoria de registro do clúster. Se um evento tiver uma prioridade com um valor menor ou igual ao limite de prioridade, ele é relatado no registro do clúster.

Nota

Os eventos são relatados por nó de dados, e o limite pode ser ajustado a diferentes valores em diferentes nós.

**Tabela 25.54 Categorias de registro de clúster, com definição de limite padrão**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Category</th> <th>Default threshold (All data nodes)</th> </tr></thead><tbody><tr> <td><code>STARTUP</code></td> <td><code>7</code></td> </tr><tr> <td><code>SHUTDOWN</code></td> <td><code>7</code></td> </tr><tr> <td><code>STATISTICS</code></td> <td><code>7</code></td> </tr><tr> <td><code>CHECKPOINT</code></td> <td><code>7</code></td> </tr><tr> <td><code>NODERESTART</code></td> <td><code>7</code></td> </tr><tr> <td><code>CONNECTION</code></td> <td><code>8</code></td> </tr><tr> <td><code>ERROR</code></td> <td><code>15</code></td> </tr><tr> <td><code>INFO</code></td> <td><code>7</code></td> </tr><tr> <td><code>BACKUP</code></td> <td><code>15</code></td> </tr><tr> <td><code>CONGESTION</code></td> <td><code>7</code></td> </tr><tr> <td><code>SCHEMA</code></td> <td><code>7</code></td> </tr></tbody></table>

A categoria `STATISTICS` pode fornecer uma grande quantidade de dados úteis. Consulte a Seção 25.6.3.3, “Usando CLUSTERLOG STATISTICS no NDB Cluster Management Client”, para mais informações.

Os limites são usados para filtrar eventos dentro de cada categoria. Por exemplo, um evento `STARTUP` com uma prioridade de 3 não é registrado a menos que o limite para `STARTUP` esteja definido em 3 ou superior. Apenas eventos com prioridade 3 ou inferior são enviados se o limite for de 3.

A tabela a seguir mostra os níveis de gravidade do evento.

Nota

Esses correspondem aos níveis `syslog` do Unix, exceto para `LOG_EMERG` e `LOG_NOTICE`, que não são utilizados ou mapeados.

**Tabela 25.55 Níveis de gravidade do evento**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Severity Level Value</th> <th scope="col">Severity</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row">1</th> <td><code>ALERT</code></td> <td>Uma condição que deve ser corrigida imediatamente, como um banco de dados do sistema corrompido</td> </tr><tr> <th scope="row">2</th> <td><code>CRITICAL</code></td> <td>Condições críticas, como erros de dispositivo ou recursos insuficientes</td> </tr><tr> <th scope="row">3</th> <td><code>ERROR</code></td> <td>Condições que devem ser corrigidas, como erros de configuração</td> </tr><tr> <th scope="row">4</th> <td><code>WARNING</code></td> <td>Condições que não são erros, mas que podem exigir um tratamento especial</td> </tr><tr> <th scope="row">5</th> <td><code>INFO</code></td> <td>Informational messages</td> </tr><tr> <th scope="row">6</th> <td><code>DEBUG</code></td> <td>Mensagens de depuração usadas para<code>NDBCLUSTER</code>desenvolvimento</td> </tr></tbody></table>

Os níveis de gravidade do evento podem ser ativados ou desativados usando `CLUSTERLOG TOGGLE`. Se um nível de gravidade for ativado, todos os eventos com uma prioridade menor ou igual aos limiares da categoria serão registrados. Se o nível de gravidade for desativado, então nenhum evento pertencente a esse nível de gravidade será registrado.

Importante

Os níveis de registro do clúster são definidos por **ndb_mgmd**, por subscritor. Isso significa que, em um NDB Cluster com vários servidores de gerenciamento, o uso de um comando `CLUSTERLOG` em uma instância de **ndb_mgm** conectada a um servidor de gerenciamento afeta apenas os registros gerados por esse servidor de gerenciamento, mas não por nenhum dos outros. Isso também significa que, se um dos servidores de gerenciamento for reiniciado, apenas os registros gerados por esse servidor de gerenciamento são afetados pelo reajuste dos níveis de registro causado pelo reinício.

#### 25.6.3.2 Eventos de registro do cluster NDB

Um relatório de evento relatado nos registros de evento tem o seguinte formato:

```
datetime [string] severity -- message
```

Por exemplo:

```
09:19:30 2005-07-24 [NDB] INFO -- Node 4 Start phase 4 completed
```

Esta seção discute todos os eventos que devem ser reportados, ordenados por categoria e nível de gravidade dentro de cada categoria.

Nas descrições de pontos de verificação, GCP e LCP significam “Ponto de verificação global” e “Ponto de verificação local”, respectivamente.

##### CONEXÃO Eventos

Esses eventos estão associados a conexões entre os nós do Cluster.

**Tabela 25.56 Eventos associados a conexões entre nós do cluster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>Connected</code></th> <td>8</td> <td><code>INFO</code></td> <td>Data nodes connected</td> </tr><tr> <th scope="row"><code>Disconnected</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Data nodes disconnected</td> </tr><tr> <th scope="row"><code>CommunicationClosed</code></th> <td>8</td> <td><code>INFO</code></td> <td>SQL node or data node connection closed</td> </tr><tr> <th scope="row"><code>CommunicationOpened</code></th> <td>8</td> <td><code>INFO</code></td> <td>SQL node or data node connection open</td> </tr><tr> <th scope="row"><code>ConnectedApiVersion</code></th> <td>8</td> <td><code>INFO</code></td> <td>Connection using API version</td> </tr></tbody></table>

##### CHECKPOINT Eventos

As mensagens de registro mostradas aqui estão associadas a pontos de verificação.

**Tabela 25.57 Eventos associados a pontos de controle**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>GlobalCheckpointStarted</code></th> <td>9</td> <td><code>INFO</code></td> <td>Start of GCP: REDO log is written to disk</td> </tr><tr> <th scope="row"><code>GlobalCheckpointCompleted</code></th> <td>10</td> <td><code>INFO</code></td> <td>GCP finished</td> </tr><tr> <th scope="row"><code>LocalCheckpointStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Start of LCP: data written to disk</td> </tr><tr> <th scope="row"><code>LocalCheckpointCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP completed normally</td> </tr><tr> <th scope="row"><code>LCPStoppedInCalcKeepGci</code></th> <td>0</td> <td><code>ALERT</code></td> <td>LCP stopped</td> </tr><tr> <th scope="row"><code>LCPFragmentCompleted</code></th> <td>11</td> <td><code>INFO</code></td> <td>LCP on a fragment has been completed</td> </tr><tr> <th scope="row"><code>UndoLogBlocked</code></th> <td>7</td> <td><code>INFO</code></td> <td>UNDO logging blocked; buffer near overflow</td> </tr><tr> <th scope="row"><code>RedoStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Redo status</td> </tr></tbody></table>

##### Eventos Startup

Os seguintes eventos são gerados em resposta ao início de um nó ou do clúster e ao seu sucesso ou falha. Eles também fornecem informações relacionadas ao progresso do processo de inicialização, incluindo informações sobre atividades de registro.

**Tabela 25.58 Eventos relacionados ao início de um nó ou grupo**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>NDBStartStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node start phases initiated (all nodes starting)</td> </tr><tr> <th scope="row"><code>NDBStartCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Start phases completed, all data nodes</td> </tr><tr> <th scope="row"><code>STTORRYRecieved</code></th> <td>15</td> <td><code>INFO</code></td> <td>Blocks received after completion of restart</td> </tr><tr> <th scope="row"><code>StartPhaseCompleted</code></th> <td>4</td> <td><code>INFO</code></td> <td>Data node start phase <em class="replaceable"><code>X</code></em> completed</td> </tr><tr> <th scope="row"><code>CM_REGCONF</code></th> <td>3</td> <td><code>INFO</code></td> <td>Node has been successfully included into the cluster; shows the node, managing node, and dynamic ID</td> </tr><tr> <th scope="row"><code>CM_REGREF</code></th> <td>8</td> <td><code>INFO</code></td> <td>Node has been refused for inclusion in the cluster; cannot be included in cluster due to misconfiguration, inability to establish communication, or other problem</td> </tr><tr> <th scope="row"><code>FIND_NEIGHBOURS</code></th> <td>8</td> <td><code>INFO</code></td> <td>Shows neighboring data nodes</td> </tr><tr> <th scope="row"><code>NDBStopStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node shutdown initiated</td> </tr><tr> <th scope="row"><code>NDBStopCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node shutdown complete</td> </tr><tr> <th scope="row"><code>NDBStopForced</code></th> <td>1</td> <td><code>ALERT</code></td> <td>Forced shutdown of data node</td> </tr><tr> <th scope="row"><code>NDBStopAborted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Unable to shut down data node normally</td> </tr><tr> <th scope="row"><code>StartREDOLog</code></th> <td>4</td> <td><code>INFO</code></td> <td>New redo log started; GCI keep <em class="replaceable"><code>X</code></em>, newest restorable GCI <em class="replaceable"><code>Y</code></em></td> </tr><tr> <th scope="row"><code>StartLog</code></th> <td>10</td> <td><code>INFO</code></td> <td>New log started; log part <em class="replaceable"><code>X</code></em>, start MB <em class="replaceable"><code>Y</code></em>, stop MB <em class="replaceable"><code>Z</code></em></td> </tr><tr> <th scope="row"><code>UNDORecordsExecuted</code></th> <td>15</td> <td><code>INFO</code></td> <td>Undo records executed</td> </tr><tr> <th scope="row"><code>StartReport</code></th> <td>4</td> <td><code>INFO</code></td> <td>Report started</td> </tr><tr> <th scope="row"><code>LogFileInitStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Log file initialization status</td> </tr><tr> <th scope="row"><code>LogFileInitCompStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Log file completion status</td> </tr><tr> <th scope="row"><code>StartReadLCP</code></th> <td>10</td> <td><code>INFO</code></td> <td>Start read for local checkpoint</td> </tr><tr> <th scope="row"><code>ReadLCPComplete</code></th> <td>10</td> <td><code>INFO</code></td> <td>Read for local checkpoint completed</td> </tr><tr> <th scope="row"><code>RunRedo</code></th> <td>8</td> <td><code>INFO</code></td> <td>Running the redo log</td> </tr><tr> <th scope="row"><code>RebuildIndex</code></th> <td>10</td> <td><code>INFO</code></td> <td>Rebuilding indexes</td> </tr></tbody></table>

##### NODERESTART Eventos

Os seguintes eventos são gerados ao reiniciar um nó e estão relacionados ao sucesso ou ao fracasso do processo de reinício do nó.

**Tabela 25.59 Eventos relacionados ao recomeçar de um nó**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>NR_CopyDict</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying of dictionary information</td> </tr><tr> <th scope="row"><code>NR_CopyDistr</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying distribution information</td> </tr><tr> <th scope="row"><code>NR_CopyFragsStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Starting to copy fragments</td> </tr><tr> <th scope="row"><code>NR_CopyFragDone</code></th> <td>10</td> <td><code>INFO</code></td> <td>Completed copying a fragment</td> </tr><tr> <th scope="row"><code>NR_CopyFragsCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying all fragments</td> </tr><tr> <th scope="row"><code>NodeFailCompleted</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Node failure phase completed</td> </tr><tr> <th scope="row"><code>NODE_FAILREP</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Reports that a node has failed</td> </tr><tr> <th scope="row"><code>ArbitState</code></th> <td>6</td> <td><code>INFO</code></td> <td>Report whether an arbitrator is found or not; there are seven different possible outcomes when seeking an arbitrator, listed here: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Management server restarts arbitration thread [state=<em class="replaceable"><code>X</code></em>] </p></li><li class="listitem"><p> Prepare arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Receive arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Started arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> - process failure [state=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> - process exit [state=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> &lt;error msg&gt; [state=<em class="replaceable"><code>Y</code></em>] </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>ArbitResult</code></th> <td>2</td> <td><code>ALERT</code></td> <td>Report arbitrator results; there are eight different possible results for arbitration attempts, listed here: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Arbitration check failed: less than 1/2 nodes left </p></li><li class="listitem"><p> Arbitration check succeeded: node group majority </p></li><li class="listitem"><p> Arbitration check failed: missing node group </p></li><li class="listitem"><p> Network partitioning: arbitration required </p></li><li class="listitem"><p> Arbitration succeeded: affirmative response from node <em class="replaceable"><code>X</code></em> </p></li><li class="listitem"><p> Arbitration failed: negative response from node <em class="replaceable"><code>X</code></em> </p></li><li class="listitem"><p> Network partitioning: no arbitrator available </p></li><li class="listitem"><p> Network partitioning: no arbitrator configured </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>GCP_TakeoverStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>GCP takeover started</td> </tr><tr> <th scope="row"><code>GCP_TakeoverCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>GCP takeover complete</td> </tr><tr> <th scope="row"><code>LCP_TakeoverStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP takeover started</td> </tr><tr> <th scope="row"><code>LCP_TakeoverCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP takeover complete (state = <em class="replaceable"><code>X</code></em>)</td> </tr><tr> <th scope="row"><code>ConnectCheckStarted</code></th> <td>6</td> <td><code>INFO</code></td> <td>Connection check started</td> </tr><tr> <th scope="row"><code>ConnectCheckCompleted</code></th> <td>6</td> <td><code>INFO</code></td> <td>Connection check completed</td> </tr><tr> <th scope="row"><code>NodeFailRejected</code></th> <td>6</td> <td><code>ALERT</code></td> <td>Node failure phase failed</td> </tr></tbody></table>

##### ESTATÍSTICAS Eventos

Os seguintes eventos são de natureza estatística. Eles fornecem informações como números de transações e outras operações, quantidade de dados enviados ou recebidos por nós individuais e uso de memória.

**Tabela 25.60 Eventos de natureza estatística**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>TransReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Report transaction statistics, including numbers of transactions, commits, reads, simple reads, writes, concurrent operations, attribute information, and aborts</td> </tr><tr> <th scope="row"><code>OperationReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Number of operations</td> </tr><tr> <th scope="row"><code>TableCreated</code></th> <td>7</td> <td><code>INFO</code></td> <td>Report number of tables created</td> </tr><tr> <th scope="row"><code>JobStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean internal job scheduling statistics</td> </tr><tr> <th scope="row"><code>ThreadConfigLoop</code></th> <td>9</td> <td><code>INFO</code></td> <td>Number of thread configuration loops</td> </tr><tr> <th scope="row"><code>SendBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean number of bytes sent to node <em class="replaceable"><code>X</code></em></td> </tr><tr> <th scope="row"><code>ReceiveBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean number of bytes received from node <em class="replaceable"><code>X</code></em></td> </tr><tr> <th scope="row"><code>MemoryUsage</code></th> <td>5</td> <td><code>INFO</code></td> <td>Data and index memory usage (80%, 90%, and 100%)</td> </tr><tr> <th scope="row"><code>MTSignalStatistics</code></th> <td>9</td> <td><code>INFO</code></td> <td>Multithreaded signals</td> </tr></tbody></table>

##### ESQUEMA Eventos

Esses eventos estão relacionados a operações do esquema do NDB Cluster.

**Tabela 25.61 Eventos relacionados a operações do esquema do NDB Cluster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>CreateSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema objected created</td> </tr><tr> <th scope="row"><code>AlterSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema object updated</td> </tr><tr> <th scope="row"><code>DropSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema object dropped</td> </tr></tbody></table>

##### ERRO Eventos

Esses eventos estão relacionados a erros e avisos do Cluster. A presença de um ou mais desses geralmente indica que ocorreu um mau funcionamento ou falha grave.

**Tabela 25.62 Eventos relacionados a erros e avisos de agrupamento**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>TransporterError</code></th> <td>2</td> <td><code>ERROR</code></td> <td>Transporter error</td> </tr><tr> <th scope="row"><code>TransporterWarning</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Transporter warning</td> </tr><tr> <th scope="row"><code>MissedHeartbeat</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Node <em class="replaceable"><code>X</code></em> missed heartbeat number <em class="replaceable"><code>Y</code></em></td> </tr><tr> <th scope="row"><code>DeadDueToHeartbeat</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Node <em class="replaceable"><code>X</code></em> declared “dead” due to missed heartbeat</td> </tr><tr> <th scope="row"><code>WarningEvent</code></th> <td>2</td> <td><code>WARNING</code></td> <td>General warning event</td> </tr><tr> <th scope="row"><code>SubscriptionStatus</code></th> <td>4</td> <td><code>WARNING</code></td> <td>Change in subscription status</td> </tr></tbody></table>

##### INFO Eventos

Esses eventos fornecem informações gerais sobre o estado do clúster e atividades associadas à manutenção do clúster, como registro e transmissão de batimentos cardíacos.

**Tabela 25.63 Eventos de informação**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>SentHeartbeat</code></th> <td>12</td> <td><code>INFO</code></td> <td>Sent heartbeat</td> </tr><tr> <th scope="row"><code>CreateLogBytes</code></th> <td>11</td> <td><code>INFO</code></td> <td>Create log: Log part, log file, size in MB</td> </tr><tr> <th scope="row"><code>InfoEvent</code></th> <td>2</td> <td><code>INFO</code></td> <td>General informational event</td> </tr><tr> <th scope="row"><code>EventBufferStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Event buffer status</td> </tr><tr> <th scope="row"><code>EventBufferStatus2</code></th> <td>7</td> <td><code>INFO</code></td> <td>Improved event buffer status information</td> </tr></tbody></table>

Nota

Os eventos `SentHeartbeat` estão disponíveis apenas se o NDB Cluster foi compilado com o `VM_TRACE` habilitado.

##### Eventos SINGLEUSER

Esses eventos estão associados à entrada e saída do modo de usuário único.

**Tabela 25.64 Eventos relacionados ao modo de usuário único**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>SingleUser</code></th> <td>7</td> <td><code>INFO</code></td> <td>Entering or exiting single user mode</td> </tr></tbody></table>

BACKUP Eventos

Esses eventos fornecem informações sobre backups sendo criados ou restaurados.

**Tabela 25.65 Eventos de backup**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th scope="col">Event</th> <th scope="col">Priority</th> <th scope="col">Severity Level</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>BackupStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup started</td> </tr><tr> <th scope="row"><code>BackupStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup status</td> </tr><tr> <th scope="row"><code>BackupCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup completed</td> </tr><tr> <th scope="row"><code>BackupFailedToStart</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup failed to start</td> </tr><tr> <th scope="row"><code>BackupAborted</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup aborted by user</td> </tr><tr> <th scope="row"><code>RestoreStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Started restoring from backup</td> </tr><tr> <th scope="row"><code>RestoreMetaData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring metadata</td> </tr><tr> <th scope="row"><code>RestoreData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring data</td> </tr><tr> <th scope="row"><code>RestoreLog</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring log files</td> </tr><tr> <th scope="row"><code>RestoreCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed restoring from backup</td> </tr><tr> <th scope="row"><code>SavedEvent</code></th> <td>7</td> <td><code>INFO</code></td> <td>Event saved</td> </tr></tbody></table>

#### 25.6.3.3 Usando CLUSTERLOG STATISTICS no Cliente de Gerenciamento de NDB Cluster

O comando `CLUSTERLOG STATISTICS` do cliente de gerenciamento `NDB` pode fornecer vários dados estatísticos úteis em sua saída. Os contadores que fornecem informações sobre o estado do clúster são atualizados em intervalos de relatórios de 5 segundos pelo coordenador de transação (TC) e pelo manipulador de consulta local (LQH), e são escritos no log do clúster.

**Estatísticas do coordenador de transação.** Cada transação tem um coordenador de transação, que é escolhido por um dos seguintes métodos:

* de forma round-robin;
* por proximidade de comunicação;
* fornecendo um aviso de colocação de dados quando a transação é iniciada;

Nota

Você pode determinar qual método de seleção de TC é usado para transações iniciadas a partir de um nó SQL específico usando a variável de sistema `ndb_optimized_node_selection`.

Todas as operações dentro da mesma transação utilizam o mesmo coordenador de transação, que reporta as seguintes estatísticas:

* **Contagem de transações.** Este é o número de transações iniciadas no último intervalo usando este TC como coordenador de transações. Qualquer uma dessas transações pode ter sido comprometida, ter sido abortada ou permanecer não comprometida no final do intervalo de relatório.

Nota

As transações não migram entre os TC.

* **Número de transações. Este é o número de transações que utilizam este TC como coordenador de transações que foram comprometidas no último intervalo de relatórios. Como algumas transações comprometidas neste intervalo de relatórios podem ter começado em um intervalo de relatórios anterior, é possível que `Commit count` seja maior que `Trans count`.

* **Número de leituras.** Este é o número de operações de leitura de chave primária usando esta TC (Transação Coordenadora) que foram iniciadas no último intervalo de relatório, incluindo leituras simples. Este contagem também inclui leituras realizadas como parte de operações de índice único. Uma operação de leitura de índice único gera 2 operações de leitura de chave primária — 1 para a tabela de índice único oculta e 1 para a tabela na qual a leitura ocorre.

* **Número de leituras simples.** Este é o número de operações de leitura simples que utilizam esta TC (Transação Coordenadora) como coordenadora da transação e que foram iniciadas no último intervalo de relatório.

* **Escreva o número.** Este é o número de operações de escrita da chave primária usando esta TC (Transação Coordenadora) que foram iniciadas no último intervalo de relatório. Isso inclui todas as inserções, atualizações, escritas e apagamentos, bem como escritas realizadas como parte de operações de índice único.

Nota

Uma operação única de atualização de índice pode gerar várias operações de leitura e escrita de PK na tabela de índice e na tabela base.

* **AttrInfoCount.** Este é o número de palavras de dados de 32 bits recebidas no último intervalo de relatório para operações de chave primária usando este TC como coordenador de transação. Para leituras, isso é proporcional ao número de colunas solicitadas. Para inserções e atualizações, isso é proporcional ao número de colunas escritas e ao tamanho de seus dados. Para operações de exclusão, geralmente é zero.

As operações de índice únicas geram múltiplas operações PK e, portanto, aumentam esse contagem. No entanto, as palavras de dados enviadas para descrever a própria operação PK e as informações-chave enviadas *não* são contadas aqui. As informações de atributo enviadas para descrever as colunas a serem lidas em varreduras ou para descrever ScanFilters também não são contadas em `AttrInfoCount`.

* **Operações Consecutivas.** Este é o número de operações de chave primária ou de varredura que utilizam esta TC como coordenador de transação e que foram iniciadas durante o último intervalo de relatório, mas que não foram concluídas. As operações incrementam este contador quando são iniciadas e decrementam-no quando são concluídas; isso ocorre após a transação ser confirmada. Leitura e escrita sujas, bem como operações falhadas, decrementam este contador.

O valor máximo que `Concurrent Operations` pode ter é o número máximo de operações que um bloco de TC pode suportar; atualmente, isso é `(2 * MaxNoOfConcurrentOperations) + 16 + MaxNoOfConcurrentTransactions`. (Para mais informações sobre esses parâmetros de configuração, consulte a seção *Parâmetros de Transação* da Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.)

* **Número de abortos.** Este é o número de transações que utilizaram este TC como coordenador de transação e que foram abortadas durante o último intervalo de relatório. Como algumas transações que foram abortadas no último intervalo de relatório podem ter começado em um intervalo de relatório anterior, `Abort count` pode, às vezes, ser maior que `Trans count`.

* **Escansos de tabela.** Este é o número de escansos de tabela que utilizam esta TC (Transação Coordenadora) que foram iniciados durante o último intervalo de relatório. Isso não inclui escansos de intervalo (ou seja, escansos de índice ordenados).

* **Escaneios de intervalo.** Este é o número de escaneios de índice solicitados usando este TC como coordenador de transação que foram iniciados no último intervalo de relatório.

* **Leitura local.** Este é o número de operações de leitura de chave primária realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Esse contagem também pode ser obtida a partir do contador `LOCAL_READS` na tabela `ndbinfo.counters`.

* **Localizações de escrita.** Isso contém o número de operações de leitura de chave primária que foram realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Esse contagem também pode ser obtida a partir do contador `LOCAL_WRITES` na tabela `ndbinfo.counters`.

**Estatísticas do manipulador de consultas locais (Operações).** Há um evento de clúster por bloco de manipulador de consultas locais (ou seja, 1 por processo do nó de dados). As operações são registradas no LQH onde os dados sobre os quais elas operam residem.

Nota

Uma única transação pode operar em dados armazenados em múltiplos blocos LQH.

A estatística `Operations` fornece o número de operações locais realizadas por este bloco LQH no último intervalo de relatórios e inclui todos os tipos de operações de leitura e escrita (operações de inserção, atualização, escrita e exclusão). Isso também inclui operações usadas para replicar escritas. Por exemplo, em um clúster com duas réplicas de fragmento, a escrita na réplica do fragmento primário é registrada no LQH primário, e a escrita no backup é registrada no LQH de backup. Operações de chave única podem resultar em múltiplas operações locais; no entanto, isso *não* inclui operações locais geradas como resultado de uma varredura de tabela ou varredura de índice ordenado, que não são contadas.

**Estatísticas do planejador de processos.**

Além das estatísticas relatadas pelo coordenador de transações e pelo manipulador de consultas locais, cada processo **ndbd** possui um planejador que também fornece métricas úteis relacionadas ao desempenho de um NDB Cluster. Esse planejador executa um loop infinito; durante cada loop, o planejador realiza as seguintes tarefas:

1. Leia quaisquer mensagens recebidas dos soquetes em um buffer de trabalho.  
2. Verifique se há mensagens com prazos a serem executadas; se houver, coloque-as também no buffer de trabalho.

3. Execute (em um loop) quaisquer mensagens no buffer do trabalho. 4. Envie quaisquer mensagens distribuídas que foram geradas ao executar as mensagens no buffer do trabalho.

5. Aguarde quaisquer mensagens recebidas.

As estatísticas do planejador de processos incluem o seguinte:

* **Contador de Looper Médio.** Este é o número de loops executados no terceiro passo a partir da lista anterior. Esta estatística aumenta de tamanho à medida que a utilização do buffer TCP/IP melhora. Você pode usar isso para monitorar mudanças no desempenho à medida que adiciona novos processos de nó de dados.

* **Tamanho médio do envio e tamanho médio da recepção.** Essas estatísticas permitem que você avalie a eficiência, respectivamente, das escritas e das leituras entre os nós. Os valores são dados em bytes. Valores mais altos significam um custo menor por byte enviado ou recebido; o valor máximo é de 64 K.

Para fazer com que todas as estatísticas de registro de clúster sejam registradas, você pode usar o seguinte comando no cliente de gerenciamento `NDB`:

```
ndb_mgm> ALL CLUSTERLOG STATISTICS=15
```

Nota

Definir o limite para `STATISTICS` em 15 faz com que o log do clúster se torne muito detalhado e cresça rapidamente em tamanho, em proporção direta ao número de nós do clúster e à quantidade de atividade no NDB Cluster.

Para obter mais informações sobre os comandos do cliente de gerenciamento do NDB Cluster relacionados ao registro e relatórios, consulte a Seção 25.6.3.1, “Comandos de gerenciamento de registro do NDB Cluster”.

### 25.6.4 Resumo das fases de início do cluster do NDB

Esta seção fornece um esquema simplificado dos passos envolvidos ao iniciar os nós de dados do NDB Cluster. Informações mais completas podem ser encontradas em Fases de Início do NDB Cluster, no *`NDB` Internals Guide*.

Essas fases são as mesmas que as relatadas na saída do comando `node_id STATUS`(mysql-cluster-mgm-client-commands.html#ndbclient-status) no cliente de gerenciamento (consulte Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”). Essas fases iniciais também são relatadas na coluna `start_phase` da tabela `ndbinfo.nodes`.

**Tipos de startups.** Existem vários tipos e modos diferentes de startup, conforme mostrado na lista a seguir:

* **Início inicial.** O clúster começa com um sistema de arquivos limpo em todos os nós de dados. Isso ocorre quando o clúster é iniciado pela primeira vez ou quando todos os nós de dados são reiniciados usando a opção `--initial`.

Nota

Os arquivos de dados do disco não são removidos ao reiniciar um nó usando `--initial`.

* **Reinício do sistema.** O clúster é iniciado e lê os dados armazenados nos nós de dados. Isso ocorre quando o clúster é desligado após ter sido utilizado, quando se deseja que o clúster retome as operações a partir do ponto em que parou.

* **Reinício do nó.** Este é o reinício online de um nó do cluster enquanto o próprio cluster está em execução.

* **Reinício inicial do nó.** Isso é o mesmo que um reinício de nó, exceto que o nó é reiniciado e iniciado com um sistema de arquivos limpo.

**Configuração e inicialização (fase -1).** Antes da inicialização, cada nó de dados (processo **ndbd**) deve ser inicializado. A inicialização consiste nos seguintes passos:

1. Obtenha um ID de nó
2. Pegue dados de configuração
3. Aloque portas a serem usadas para comunicações entre nós
4. Aloque memória de acordo com as configurações obtidas do arquivo de configuração

Quando um nó de dados ou um nó SQL se conecta pela primeira vez ao nó de gerenciamento, ele reserva um ID de nó do cluster. Para garantir que nenhum outro nó aloje o mesmo ID de nó, esse ID é mantido até que o nó tenha conseguido se conectar ao cluster e pelo menos um **ndbd** informe que esse nó está conectado. Essa retenção do ID de nó é protegida pela conexão entre o nó em questão e **ndb_mgmd**.

Após cada nó de dados ter sido inicializado, o processo de inicialização do clúster pode prosseguir. As etapas pelas quais o clúster passa durante esse processo estão listadas aqui:

* **Fase 0.** Os blocos `NDBFS` e `NDBCNTR` começam. Os sistemas de arquivos de nós de dados são limpos nos nós de dados que foram iniciados com a opção `--initial`.

* **Fase 1.** Nesta etapa, todos os blocos restantes do kernel `NDB` são iniciados. As conexões do NDB Cluster são configuradas, as comunicações entre blocos são estabelecidas e os batimentos cardíacos são iniciados. No caso de um reinício do nó, as conexões do nó API também são verificadas.

Nota

Quando um ou mais nós ficam em fase 1 enquanto o restante do nó ou nós ficam em fase 2, isso geralmente indica problemas na rede. Uma possível causa desses problemas é que um ou mais hosts do clúster tenham múltiplas interfaces de rede. Outra fonte comum de problemas que causam essa condição é o bloqueio de portas TCP/IP necessárias para comunicações entre nós do clúster. No último caso, isso geralmente é devido a um firewall mal configurado.

* **Fase 2.** O bloco de kernel `NDBCNTR` verifica os estados de todos os nós existentes. O nó mestre é escolhido e o arquivo do esquema do clúster é inicializado.

* **Fase 3.** Os blocos de kernel `DBLQH` e `DBTC` configuram as comunicações entre eles. O tipo de inicialização é determinado; se se trata de um reinício, o bloco `DBDIH` obtém permissão para realizar o reinício.

* **Fase 4.** Para um início inicial ou reinício inicial do nó, os arquivos de log de refazer são criados. O número desses arquivos é igual a `NoOfFragmentLogFiles`.

Para um reinício do sistema:

+ Leia o esquema ou esquemas.  
+ Leia os dados do ponto de verificação local.  
+ Aplique todas as informações de redo até que o último ponto de verificação global restaurável seja alcançado.

Para um reinício do nó, encontre a cauda do log de refazer.

* **Fase 5.** A maior parte da parte relacionada ao banco de dados de um início de nó de dados é realizada durante esta fase. Para um início inicial ou reinício do sistema, um ponto de verificação local é executado, seguido por um ponto de verificação global. Verificações periódicas do uso de memória começam durante esta fase, e quaisquer retomadas de nó necessárias são realizadas.

* **Fase 6.** Nesta fase, os grupos de nós são definidos e configurados.

* **Fase 7.** O nó árbitro é selecionado e começa a funcionar. A próxima ID de backup é definida, assim como a velocidade de gravação do disco de backup. Os nós que atingem esta fase inicial são marcados como `Started`. Agora é possível que os nós da API (incluindo nós SQL) se conectem ao clúster.

* **Fase 8.** Se este for um reinício do sistema, todos os índices são reconstruídos (por `DBDIH`).

* **Fase 9.** As variáveis de inicialização internas do nó são redefinidas.

* **Fase 100 (DESAFIADA).** Anteriormente, era nesse ponto durante o reinício de um nó ou o reinício inicial do nó que os nós da API podiam se conectar ao nó e começar a receber eventos. Atualmente, essa fase está vazia.

* **Fase 101.** Neste ponto, em um reinício de nó ou reinício inicial de nó, a entrega de eventos é entregue ao nó que está se juntando ao clúster. O nó recém-juntado assume a responsabilidade de entregar seus dados primários aos assinantes. Esta fase também é referida como fase de entrega `SUMA`.

Após este processo ser concluído para um início inicial ou reinício do sistema, o gerenciamento de transações é habilitado. Para um reinício do nó ou um reinício inicial do nó, a conclusão do processo de inicialização significa que o nó pode agora atuar como um coordenador de transações.

### 25.6.5 Realizar um Reinício Rotativo de um NDB Cluster

Esta seção discute como realizar um reinício contínuo de uma instalação de NDB Cluster, chamado assim porque envolve a parada e o início (ou reinício) de cada nó em sua vez, para que o próprio cluster permaneça operacional. Isso é frequentemente feito como parte de uma atualização contínua ou uma atualização contínua, onde a alta disponibilidade do cluster é obrigatória e nenhum tempo de inatividade do cluster como um todo é permitido. Quando nos referimos a atualizações, as informações fornecidas aqui geralmente se aplicam também a atualizações.

Há várias razões pelas quais um reinício em andamento pode ser desejável. Essas razões são descritas nos próximos parágrafos.

**Alterações na configuração.** Para fazer uma alteração na configuração do cluster, como adicionar um nó SQL ao cluster ou definir um parâmetro de configuração para um novo valor.

Atualização ou redução do nível do software do NDB Cluster. Para atualizar o cluster para uma versão mais recente do software do NDB Cluster (ou para reduzi-lo a uma versão mais antiga). Isso geralmente é referido como uma “atualização contínua” (ou “redução contínua”, quando se reverte para uma versão mais antiga do NDB Cluster).

**Alterações no host do nó.** Para fazer alterações no hardware ou no sistema operacional em que um ou mais processos do NDB Cluster estão em execução.

**Redefinir o sistema (redefinição do clúster).** Para redefinir o clúster porque ele atingiu um estado indesejável. Nesses casos, é frequentemente desejável recarregar os dados e metadados de um ou mais nós de dados. Isso pode ser feito de qualquer uma das três maneiras:

* Inicie cada processo do nó de dados (**ndbd** ou possivelmente **ndbmtd**)) com a opção `--initial`, que obriga o nó de dados a limpar seu sistema de arquivos e a recarregar todos os dados e metadados do NDB Cluster dos outros nós de dados.

Começando com o NDB 8.0.21, isso também força a remoção de todos os objetos e arquivos de Dados de disco associados a esses objetos.

* Crie um backup usando o comando do cliente **ndb_mgm** `START BACKUP` antes de realizar o reinício. Após a atualização, restaure o nó ou nós usando **ndb_restore**.

Consulte a Seção 25.6.8, “Backup Online de NDB Cluster”, e a Seção 25.5.23, “ndb_restore — Restaurar um Backup de NDB Cluster”, para obter mais informações.

* Use o **mysqldump** para criar um backup antes da atualização; depois, restaure o dump usando `LOAD DATA`.

**Recuperação de recursos.** Para liberar a memória previamente alocada para uma tabela por operações consecutivas de `INSERT` e `DELETE`, para reutilizar por outras tabelas do NDB Cluster.

O processo para realizar um reinício contínuo pode ser generalizado da seguinte forma:

1. Parar todos os nós de gerenciamento de clúster (processos **ndb_mgmd**), reconfigurá-los e, em seguida, reiniciá-los. (Veja Reinicializações em rolagem com múltiplos servidores de gerenciamento.)

2. Pare, reconfigure e, em seguida, reinicie cada nó de dados do cluster (processo **ndbd**) por sua vez.

Alguns parâmetros de configuração de nó podem ser atualizados emitindo `RESTART` para cada um dos nós de dados no cliente **ndb_mgm**, seguindo o passo anterior. Outros parâmetros exigem que o nó de dados seja parado completamente usando o comando do cliente de gerenciamento `STOP`, e depois reiniciado a partir de uma janela do sistema, invocando o executável **ndbd** ou **ndbmtd**") conforme apropriado. (Um comando de shell, como **kill**, também pode ser usado na maioria dos sistemas Unix para parar um processo de nó de dados, mas o comando `STOP` é preferido e geralmente mais simples.)

Nota

Em Windows, você também pode usar os comandos **SC STOP** e **SC START**, os comandos `NET STOP` e `NET START`, ou o Gerenciador de Serviços do Windows para parar e iniciar nós que foram instalados como serviços do Windows (consulte Seção 25.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”).

O tipo de reinício necessário é indicado na documentação para cada parâmetro de configuração do nó. Veja a Seção 25.4.3, “Arquivos de configuração do clúster NDB”.

3. Pare, reconfigure e, em seguida, reinicie cada nó do cluster SQL (processo **mysqld**) por sua vez.

O NDB Cluster suporta uma ordem um tanto flexível para a atualização dos nós. Ao atualizar um NDB Cluster, você pode atualizar os nós da API (incluindo nós SQL) antes de atualizar os nós de gerenciamento, nós de dados ou ambos. Em outras palavras, você tem permissão para atualizar os nós da API e SQL em qualquer ordem. Isso está sujeito às seguintes disposições:

* Essa funcionalidade é destinada ao uso como parte de uma atualização online apenas. Uma mistura de binários de nó de diferentes lançamentos do NDB Cluster não é pretendida nem suportada para uso contínuo e de longo prazo em um ambiente de produção.

* Você deve atualizar todos os nós do mesmo tipo (de gerenciamento, dados ou API) antes de atualizar quaisquer nós de um tipo diferente. Isso permanece verdadeiro, independentemente da ordem em que os nós são atualizados.

* Você deve atualizar todos os nós de gerenciamento antes de atualizar quaisquer nós de dados. Isso permanece verdadeiro, independentemente da ordem em que você atualiza os nós de API e SQL do cluster.

* As características específicas da versão “nova” não devem ser utilizadas até que todos os nós de gerenciamento e nós de dados tenham sido atualizados.

Isso também se aplica a qualquer mudança na versão do servidor MySQL que possa ser aplicada, além da mudança da versão do motor NDB, então não se esqueça de levar isso em conta ao planejar a atualização. (Isso é verdade para atualizações online do NDB Cluster em geral.)

Não é possível que qualquer nó da API realize operações de esquema (como declarações de definição de dados) durante uma reinicialização do nó. Devido, em parte, a essa limitação, as operações de esquema também não são suportadas durante uma atualização ou redução online. Além disso, não é possível realizar backups nativos enquanto uma atualização ou redução está em andamento.

**Reinício em rolagem com vários servidores de gerenciamento.**

Ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento, você deve ter em mente que o **ndb_mgmd** verifica se algum outro nó de gerenciamento está em execução e, se sim, tenta usar os dados de configuração desse nó. Para evitar que isso ocorra e para forçar o **ndb_mgmd** a reler seu arquivo de configuração, realize as etapas a seguir:

1. Parar todos os processos do NDB Cluster **ndb_mgmd**.
2. Atualizar todos os arquivos `config.ini`.
3. Iniciar um único **ndb_mgmd** com `--reload`, `--initial` ou ambas as opções conforme desejado.

4. Se você iniciou o primeiro **ndb_mgmd** com a opção `--initial`, também deve iniciar quaisquer processos restantes de **ndb_mgmd** usando `--initial`.

Independentemente de quaisquer outras opções usadas ao iniciar o primeiro **ndb_mgmd**, você não deve iniciar quaisquer processos restantes do **ndb_mgmd** após o primeiro usando `--reload`.

5. Complete os reinícios contínuos dos nós de dados e dos nós de API como de costume.

Ao realizar uma reinicialização contínua para atualizar a configuração do clúster, você pode usar a coluna `config_generation` da tabela `ndbinfo.nodes` para acompanhar quais nós de dados foram reiniciados com sucesso com a nova configuração. Veja a Seção 25.6.16.47, “A tabela de nós ndbinfo”.

### 25.6.6 Modo de Cluster do NDB com um único usuário

O modo de usuário único permite que o administrador do banco de dados restrinja o acesso ao sistema do banco de dados a um único nó da API, como um servidor MySQL (nó SQL) ou uma instância de **ndb_restore**. Ao entrar no modo de usuário único, as conexões a todos os outros nós da API são fechadas de forma graciosa e todas as transações em execução são abortadas. Nenhuma nova transação é permitida para começar.

Uma vez que o grupo tenha entrado no modo de usuário único, apenas o nó da API designado recebe acesso ao banco de dados.

Você pode usar o comando `ALL STATUS` no cliente **ndb_mgm** para ver quando o clúster entrou no modo de único usuário. Você também pode verificar a coluna `status` da tabela `ndbinfo.nodes` (consulte a Seção 25.6.16.47, “A tabela de nós ndbinfo”, para mais informações).

Exemplo:

```
ndb_mgm> ENTER SINGLE USER MODE 5
```

Após a execução deste comando e a entrada do clúster no modo de usuário único, o nó da API cujo ID de nó é `5` torna-se o único usuário permitido do clúster.

O nó especificado no comando anterior deve ser um nó API; tentar especificar qualquer outro tipo de nó é rejeitado.

Nota

Quando o comando anterior é invocado, todas as transações em execução no nó designado são abortadas, a conexão é fechada e o servidor deve ser reiniciado.

O comando `EXIT SINGLE USER MODE` altera o estado dos nós de dados do cluster do modo de único usuário para o modo normal. Os nós da API, como Servidores MySQL, que estão aguardando uma conexão (ou seja, aguardando que o cluster esteja pronto e disponível), podem se conectar novamente. O nó da API denotado como o nó de único usuário continua a ser executado (se ainda estiver conectado) durante e após a mudança de estado.

Exemplo:

```
ndb_mgm> EXIT SINGLE USER MODE
```

Existem duas maneiras recomendadas de lidar com a falha de um nó quando executado em modo de usuário único:

* Método 1:

1. Finalize todas as transações no modo de usuário único
2. Emitir o comando `EXIT SINGLE USER MODE`
3. Reinicie os nós de dados do clúster
* Método 2:

Reinicie os nós de armazenamento antes de entrar no modo de usuário único.

### 25.6.7 Adicionando nós de dados do NDB Cluster online

Esta seção descreve como adicionar nós de dados do NDB Cluster "online", ou seja, sem precisar desligar completamente o cluster e reiniciá-lo como parte do processo.

Importante

Atualmente, você deve adicionar novos nós de dados a um NDB Cluster como parte de um novo grupo de nós. Além disso, não é possível alterar o número de réplicas de fragmentação (ou o número de nós por grupo de nós) online.

#### 25.6.7.1 Adicionando nós de dados do NDB Cluster online: Problemas gerais

Esta seção fornece informações gerais sobre o comportamento e as limitações atuais na adição de nós do NDB Cluster online.

**Redistribuição de dados.** A capacidade de adicionar novos nós online inclui uma maneira de reorganizar os dados da tabela `NDBCLUSTER` e índices para que eles sejam distribuídos em todos os nós de dados, incluindo os novos, por meio da declaração `ALTER TABLE ... REORGANIZE PARTITION`(alter-table-partition-operations.html "15.1.9.1 ALTER TABLE Partition Operations"). A reorganização de tabelas de dados em memória e de dados em disco é suportada. Essa redistribuição atualmente não inclui índices exclusivos (apenas índices ordenados são redistribuídos).

A redistribuição para as tabelas `NDBCLUSTER` que já existiam antes da adição dos novos nós de dados não é automática, mas pode ser realizada usando simples declarações SQL no **mysql** ou em outra aplicação de cliente do MySQL. No entanto, todos os dados e índices adicionados às tabelas criadas após a adição de um novo grupo de nós são distribuídos automaticamente entre todos os nós de dados do cluster, incluindo aqueles adicionados como parte do novo grupo de nós.

**Inícios parciais.** É possível adicionar um novo grupo de nós sem que todos os novos nós de dados sejam iniciados. Também é possível adicionar um novo grupo de nós a um clúster degradado, ou seja, um clúster que está apenas parcialmente iniciado, ou onde um ou mais nós de dados não estão em execução. Neste último caso, o clúster deve ter nós suficientes em execução para ser viável antes que o novo grupo de nós possa ser adicionado.

**Efeitos nas operações em andamento.** As operações normais de MDO usando dados do NDB Cluster não são impedidas pela criação ou adição de um novo grupo de nós, ou pela reorganização de tabelas. No entanto, não é possível realizar DDL de forma concorrente com a reorganização de tabelas — ou seja, não é possível emitir outras declarações de DDL enquanto uma declaração `ALTER TABLE ... REORGANIZE PARTITION` (alter-table.html "15.1.9 ALTER TABLE Statement") estiver sendo executada. Além disso, durante a execução de `ALTER TABLE ... REORGANIZE PARTITION` (ou a execução de qualquer outra declaração de DDL), não é possível reiniciar os nós de dados do cluster.

**Tratamento de falhas.** As falhas dos nós de dados durante a criação do grupo de nós e a reorganização da tabela são tratadas conforme mostrado na tabela a seguir:

**Tabela 25.66 Tratamento de falhas no nó de dados durante a criação do grupo de nós e reorganização da tabela**

<table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Falha durante</th> <th scope="col">Falha no nó de dados "antigo"</th> <th scope="col">Falha no nó de dados "Novo"</th> <th scope="col">Falha no sistema</th> </tr></thead><tbody><tr> <th scope="row">Criação de grupo de nós</th> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se um nó, que não seja o mestre, falhar:</b>A criação do grupo de nós é sempre avançada.</p></li><li class="listitem"><p><b>Se o mestre falhar:</b></p> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: circle; "><li class="listitem"><p><b>Se o ponto de comprometimento interno tiver sido alcançado:</b>A criação do grupo de nós é avançada.</p></li><li class="listitem"><p><b>Se o ponto de comprometimento interno ainda não tiver sido alcançado.</b>A criação do grupo de nós é revertida</p></li></ul> </div> </li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se um nó, que não seja o mestre, falhar:</b>A criação do grupo de nós é sempre avançada.</p></li><li class="listitem"><p><b>Se o mestre falhar:</b></p> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: circle; "><li class="listitem"><p><b>Se o ponto de comprometimento interno tiver sido alcançado:</b>A criação do grupo de nós é avançada.</p></li><li class="listitem"><p><b>Se o ponto de comprometimento interno ainda não tiver sido alcançado.</b>A criação do grupo de nós é revertida</p></li></ul> </div> </li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se a execução da operação CREATE NODEGROUP tiver atingido o ponto de compromisso interno:</b>Quando reiniciado, o clúster inclui o novo grupo de nós. Caso contrário, não inclui.</p></li><li class="listitem"><p><b>Se a execução da operação CREATE NODEGROUP ainda não atingiu o ponto de compromisso interno:</b>Quando reiniciado, o clúster não inclui o novo grupo de nós.</p></li></ul> </div> </td> </tr><tr> <th scope="row">Reorganização da tabela</th> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se um nó, que não seja o mestre, falhar:</b>A reorganização da tabela é sempre avançada.</p></li><li class="listitem"><p><b>Se o mestre falhar:</b></p> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: circle; "><li class="listitem"><p><b>Se o ponto de comprometimento interno tiver sido alcançado:</b>A reorganização da tabela é avançada.</p></li><li class="listitem"><p><b>Se o ponto de comprometimento interno ainda não tiver sido alcançado.</b>A reorganização da tabela é revertida.</p></li></ul> </div> </li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se um nó, que não seja o mestre, falhar:</b>A reorganização da tabela é sempre avançada.</p></li><li class="listitem"><p><b>Se o mestre falhar:</b></p> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: circle; "><li class="listitem"><p><b>Se o ponto de comprometimento interno tiver sido alcançado:</b>A reorganização da tabela é avançada.</p></li><li class="listitem"><p><b>Se o ponto de comprometimento interno ainda não tiver sido alcançado.</b>A reorganização da tabela é revertida.</p></li></ul> </div> </li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p><b>Se a execução de uma declaração ALTER TABLE ... REORGANIZE PARTITION tiver alcançado o ponto de compromisso interno:</b>Quando o grupo é reiniciado, os dados e índices pertencentes a<em class="replaceable"><code>table</code></em>são distribuídos usando os nós de dados "novos".</p></li><li class="listitem"><p><b>Se a execução de uma declaração ALTER TABLE ... REORGANIZE PARTITION ainda não tiver atingido o ponto de compromisso interno:</b>Quando o grupo é reiniciado, os dados e índices pertencentes a<em class="replaceable"><code>table</code></em>são distribuídos usando apenas os nós de dados "antigos".</p></li></ul> </div> </td> </tr></tbody></table>

**Deixar grupos de nós.** O cliente **ndb_mgm** suporta o comando `DROP NODEGROUP`, mas é possível deixar um grupo de nós apenas quando nenhum nó de dados no grupo de nós contém dados. Como atualmente não há como "esvaziar" um nó de dados ou grupo de nós específico, este comando funciona apenas nos seguintes dois casos:

1. Após emitir `CREATE NODEGROUP` no cliente **ndb_mgm**, mas antes de emitir quaisquer declarações `ALTER TABLE ... REORGANIZE PARTITION` no cliente **mysql**.

2. Após descartar todas as tabelas `NDBCLUSTER` usando `DROP TABLE`.

`TRUNCATE TABLE` não funciona para esse propósito, porque os nós de dados continuam a armazenar as definições da tabela.

#### 25.6.7.2 Adicionando nós de dados do NDB Cluster online: procedimento básico

Nesta seção, listamos os passos básicos necessários para adicionar novos nós de dados a um NDB Cluster. Este procedimento se aplica, independentemente de você estar usando os binários **ndbd** ou **ndbmtd**") para os processos dos nós de dados. Para um exemplo mais detalhado, consulte a Seção 25.6.7.3, “Adicionando Nodos de Dados de NDB Cluster Online: Exemplo Detalhado”.

Supondo que você já tenha um NDB Cluster em funcionamento, adicionar nós de dados online requer os seguintes passos:

1. Editar o arquivo de configuração do cluster `config.ini`, adicionando novas seções `[ndbd]` correspondentes aos nós a serem adicionados. No caso em que o cluster utiliza vários servidores de gerenciamento, essas alterações precisam ser feitas em todos os arquivos `config.ini` utilizados pelos servidores de gerenciamento.

Você deve ter cuidado para que os IDs dos nós para quaisquer novos nós de dados adicionados no arquivo `config.ini` não se sobreponham aos IDs dos nós usados pelos nós existentes. No caso de você ter nós API usando IDs de nó alocados dinamicamente e esses IDs corresponderem aos IDs de nó que você deseja usar para novos nós de dados, é possível forçar quaisquer desses nós API a "migrar", conforme descrito mais adiante neste procedimento.

2. Realize um reinício contínuo de todos os servidores de gerenciamento do NDB Cluster.

Importante

Todos os servidores de gerenciamento devem ser reiniciados com a opção `--reload` ou `--initial` para forçar a leitura da nova configuração.

3. Realize um reinício contínuo de todos os nós de dados do NDB Cluster existentes. Não é necessário (ou geralmente desejável) usar `--initial` ao reiniciar os nós de dados existentes.

Se você estiver usando nós da API com IDs dinamicamente alocados que correspondem a quaisquer IDs de nó que você deseja atribuir a novos nós de dados, você deve reiniciar todos os nós da API (incluindo nós SQL) antes de reiniciar qualquer um dos processos dos nós de dados neste passo. Isso faz com que quaisquer nós da API com IDs de nó que não foram explicitamente atribuídos anteriormente desistam desses IDs de nó e adquiram novos.

4. Realize um reinício contínuo de quaisquer nós SQL ou API conectados ao NDB Cluster.

5. Inicie os novos nós de dados.

Os novos nós de dados podem ser iniciados em qualquer ordem. Eles também podem ser iniciados simultaneamente, desde que sejam iniciados após a conclusão dos reinícios contínuos de todos os nós de dados existentes e antes de prosseguir para o próximo passo.

6. Execute um ou mais comandos `CREATE NODEGROUP` (mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no cliente de gerenciamento do NDB Cluster para criar o novo grupo de nós ou grupos de nós aos quais os novos nós de dados pertencem.

7. Redistribua os dados do cluster entre todos os nós de dados, incluindo os novos. Normalmente, isso é feito emitindo uma declaração `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` (alter-table.html "15.1.9 ALTER TABLE Statement") no cliente **mysql** para cada tabela `NDBCLUSTER`.

*Exceção*: Para tabelas criadas usando a opção `MAX_ROWS`, esta declaração não funciona; em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE MAX_ROWS=...` para reorganizar essas tabelas. Também deve ter em mente que usar `MAX_ROWS` para definir o número de partições dessa maneira é desaconselhável e deve usar `PARTITION_BALANCE` em vez disso; consulte Seção 15.1.20.12, “Definindo opções de comentário NDB”, para mais informações.

Nota

Isso precisa ser feito apenas para tabelas que já existem no momento em que o novo grupo de nós é adicionado. Os dados em tabelas criadas após a adição do novo grupo de nós são distribuídos automaticamente; no entanto, os dados adicionados a qualquer tabela `tbl` que existiam antes dos novos nós serem adicionados não são distribuídos usando os novos nós até que essa tabela tenha sido reorganizada.

8. `ALTER TABLE ... REORGANIZE PARTITION ALGORITHM=INPLACE` reorganiza as partições, mas não recupera o espaço liberado nos nós “antigos”. Você pode fazer isso emitindo, para cada tabela `NDBCLUSTER`, uma declaração `OPTIMIZE TABLE` no cliente **mysql**.

Isso funciona para o espaço usado por colunas de largura variável das tabelas `NDB` de memória. `OPTIMIZE TABLE` não é suportada para colunas de largura fixa das tabelas de memória; também não é suportada para tabelas de dados em disco.

Você pode adicionar todos os nós desejados e, em seguida, emitir vários comandos `CREATE NODEGROUP` consecutivamente para adicionar os novos grupos de nós ao clúster.

#### 25.6.7.3 Adicionando nós de dados do NDB Cluster online: exemplo detalhado

Nesta seção, fornecemos um exemplo detalhado que ilustra como adicionar novos nós de dados do NDB Cluster online, começando com um NDB Cluster que tem 2 nós de dados em um único grupo de nós e concluindo com um cluster que tem 4 nós de dados em 2 grupos de nós.

**Configuração inicial.** Para fins ilustrativos, assumimos uma configuração mínima e que o clúster utilize um arquivo `config.ini` contendo apenas as seguintes informações:

```
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Nota

Deixamos uma lacuna na sequência entre os IDs dos nós de dados e outros nós. Isso facilita a atribuição de IDs de nós que não estão sendo usados a nós de dados que são recém adicionados.

Também assumimos que você já iniciou o clúster usando o comando apropriado ou as opções `my.cnf`, e que ao executar `SHOW` no cliente de gerenciamento, o resultado é semelhante ao que é mostrado aqui:

```
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=2    @198.51.100.2  (8.0.44-ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (8.0.44-ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (8.0.44-ndb-8.0.44)
id=21   @198.51.100.21  (8.0.44-ndb-8.0.44)
```

Por fim, assumimos que o conjunto contém uma única tabela `NDBCLUSTER` criada conforme mostrado aqui:

```
USE n;

CREATE TABLE ips (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    type CHAR(4) NOT NULL,
    ip_address VARCHAR(15) NOT NULL,
    addresses BIGINT UNSIGNED DEFAULT NULL,
    date BIGINT UNSIGNED DEFAULT NULL
)   ENGINE NDBCLUSTER;
```

O uso da memória e as informações relacionadas mostradas mais adiante nesta seção foram geradas após inserir aproximadamente 50.000 linhas nesta tabela.

Nota

Neste exemplo, mostramos o **ndbd** monofilamento sendo usado para os processos dos nós de dados. Você também pode aplicar este exemplo, se estiver usando o **ndbmtd** multifilamento ")", substituindo **ndbmtd** ") por **ndbd** onde quer que apareça nos passos que se seguem.

**Passo 1: Atualize o arquivo de configuração.** Abra o arquivo de configuração global do cluster em um editor de texto e adicione as seções `[ndbd]` correspondentes aos 2 novos nós de dados. (Damos esses nós de dados os IDs 3 e 4, e assumimos que eles devem ser executados em máquinas hospedeiras nos endereços 198.51.100.3 e 198.51.100.4, respectivamente.) Após adicionar as novas seções, o conteúdo do arquivo `config.ini` deve parecer o que é mostrado aqui, onde as adições ao arquivo são mostradas em negrito:

```
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[ndbd]
Id = 3
HostName = 198.51.100.3

[ndbd]
Id = 4
HostName = 198.51.100.4

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Depois de fazer as alterações necessárias, salve o arquivo.

**Passo 2: Reinicie o servidor de gerenciamento.** Para reiniciar o servidor de gerenciamento do clúster, você precisa emitir comandos separados para parar o servidor de gerenciamento e, em seguida, iniciá-lo novamente, conforme segue:

1. Parar o servidor de gerenciamento usando o comando do cliente de gerenciamento `STOP`, conforme mostrado aqui:

   ```
   ndb_mgm> 10 STOP
   Node 10 has shut down.
   Disconnecting to allow Management Server to shutdown

   $>
   ```

2. Como o encerramento do servidor de gerenciamento faz com que o cliente de gerenciamento seja encerrado, você deve iniciar o servidor de gerenciamento a partir da concha do sistema. Por simplicidade, assumimos que `config.ini` esteja no mesmo diretório que o binário do servidor de gerenciamento, mas na prática, você deve fornecer o caminho correto para o arquivo de configuração. Você também deve fornecer a opção `--reload` ou `--initial` para que o servidor de gerenciamento leia a nova configuração do arquivo em vez de sua cache de configuração. Se o diretório atual da sua concha também for o mesmo que o diretório onde o binário do servidor de gerenciamento está localizado, então você pode invocar o servidor de gerenciamento como mostrado aqui:

   ```
   $> ndb_mgmd -f config.ini --reload
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- NDB Cluster Management Server. 8.0.44-ndb-8.0.44
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- Reading cluster configuration from 'config.ini'
   ```

Se você verificar a saída de `SHOW` no cliente de gerenciamento após reiniciar o processo **ndb_mgm**, você deve ver algo como este:

```
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=2    @198.51.100.2  (8.0.44-ndb-8.0.44, Nodegroup: 0)
id=3 (not connected, accepting connect from 198.51.100.3)
id=4 (not connected, accepting connect from 198.51.100.4)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (8.0.44-ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (8.0.44-ndb-8.0.44)
id=21   @198.51.100.21  (8.0.44-ndb-8.0.44)
```

**Passo 3: Realize um reinício contínuo dos nós de dados existentes.** Esse passo pode ser realizado totalmente dentro do cliente de gerenciamento de clúster usando o comando `RESTART`, conforme mostrado aqui:

```
ndb_mgm> 1 RESTART
Node 1: Node shutdown initiated
Node 1: Node shutdown completed, restarting, no start.
Node 1 is being restarted

ndb_mgm> Node 1: Start initiated (version 8.0.44)
Node 1: Started (version 8.0.44)

ndb_mgm> 2 RESTART
Node 2: Node shutdown initiated
Node 2: Node shutdown completed, restarting, no start.
Node 2 is being restarted

ndb_mgm> Node 2: Start initiated (version 8.0.44)

ndb_mgm> Node 2: Started (version 8.0.44)
```

Importante

Após emitir cada comando `X RESTART`, espere até que o cliente de gerenciamento informe `Node X: Started (version ...)` *antes* de prosseguir.

Você pode verificar se todos os nós de dados existentes foram reiniciados usando a configuração atualizada, verificando a tabela `ndbinfo.nodes` no cliente **mysql**.

**Passo 4: Realize um reinício contínuo de todos os nós da API do cluster.** Desligue e reinicie cada servidor MySQL que atua como um nó SQL no cluster usando **mysqladmin shutdown**, seguido por **mysqld_safe** (ou outro script de inicialização). Isso deve ser semelhante ao que é mostrado aqui, onde *`password`* é a senha do MySQL `root` para uma instância específica do servidor MySQL:

```
$> mysqladmin -uroot -ppassword shutdown
081208 20:19:56 mysqld_safe mysqld from pid file
/usr/local/mysql/var/tonfisk.pid ended
$> mysqld_safe --ndbcluster --ndb-connectstring=198.51.100.10 &
081208 20:20:06 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
081208 20:20:06 mysqld_safe Starting mysqld daemon with databases
from /usr/local/mysql/var
```

Claro, a entrada e a saída exata dependem de como e onde o MySQL está instalado no sistema, bem como das opções que você escolhe para iniciá-lo (e se alguma ou todas essas opções são especificadas em um arquivo `my.cnf`).

**Passo 5: Realize um início inicial dos novos nós de dados.** Em uma janela de sistema em cada um dos hosts para os novos nós de dados, inicie os nós de dados conforme mostrado aqui, usando a opção `--initial`:

```
$> ndbd -c 198.51.100.10 --initial
```

Nota

Ao contrário do caso em que os nós de dados existentes são reiniciados, você pode iniciar os novos nós de dados simultaneamente; você não precisa esperar que um deles termine antes de iniciar o outro.

*Espere até que ambos os novos nós de dados tenham começado antes de prosseguir com o próximo passo*. Uma vez que os novos nós de dados tenham começado, você pode ver na saída do comando do cliente de gerenciamento `SHOW` que eles ainda não pertencem a nenhum grupo de nós (como indicado em itálico aqui):

```
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=2    @198.51.100.2  (8.0.44-ndb-8.0.44, Nodegroup: 0)
id=3    @198.51.100.3  (8.0.44-ndb-8.0.44, no nodegroup)
id=4    @198.51.100.4  (8.0.44-ndb-8.0.44, no nodegroup)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (8.0.44-ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (8.0.44-ndb-8.0.44)
id=21   @198.51.100.21  (8.0.44-ndb-8.0.44)
```

**Passo 6: Crie um novo grupo de nós.** Você pode fazer isso emitindo o comando `CREATE NODEGROUP` (mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no cliente de gerenciamento de clúster. Esse comando recebe como argumento uma lista de IDs de nós separados por vírgula dos nós de dados a serem incluídos no novo grupo de nós, conforme mostrado aqui:

```
ndb_mgm> CREATE NODEGROUP 3,4
Nodegroup 1 created
```

Ao emitir novamente `SHOW`, você pode verificar que os nós de dados 3 e 4 se juntaram ao novo grupo de nós (novamente indicado em negrito):

```
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=2    @198.51.100.2  (8.0.44-ndb-8.0.44, Nodegroup: 0)
id=3    @198.51.100.3  (8.0.44-ndb-8.0.44, Nodegroup: 1)
id=4    @198.51.100.4  (8.0.44-ndb-8.0.44, Nodegroup: 1)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (8.0.44-ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (8.0.44-ndb-8.0.44)
id=21   @198.51.100.21  (8.0.44-ndb-8.0.44)
```

**Passo 7: Redistribua os dados do cluster.** Quando um grupo de nós é criado, os dados e índices existentes não são distribuídos automaticamente para os nós de dados do novo grupo de nós, como você pode ver ao emitir o comando apropriado `REPORT` no cliente de gerenciamento:

```
ndb_mgm> ALL REPORT MEMORY

Node 1: Data usage is 5%(177 32K pages of total 3200)
Node 1: Index usage is 0%(108 8K pages of total 12832)
Node 2: Data usage is 5%(177 32K pages of total 3200)
Node 2: Index usage is 0%(108 8K pages of total 12832)
Node 3: Data usage is 0%(0 32K pages of total 3200)
Node 3: Index usage is 0%(0 8K pages of total 12832)
Node 4: Data usage is 0%(0 32K pages of total 3200)
Node 4: Index usage is 0%(0 8K pages of total 12832)
```

Ao usar **ndb_desc** com a opção `-p`, o que faz com que a saída inclua informações de partição, você pode ver que a tabela ainda usa apenas 2 partições (na seção `Per partition info` da saída, mostrada aqui em texto em negrito):

```
$> ndb_desc -c 198.51.100.10 -d n ips -p
-- ips --
Version: 1
Fragment type: 9
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 6
Number of primary keys: 1
Length of frm data: 340
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
TableStatus: Retrieved
-- Attributes --
id Bigint PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
country_code Char(2;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
type Char(4;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
ip_address Varchar(15;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
addresses Bigunsigned NULL AT=FIXED ST=MEMORY
date Bigunsigned NULL AT=FIXED ST=MEMORY

-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex

-- Per partition info --
Partition   Row count   Commit count  Frag fixed memory   Frag varsized memory
0           26086       26086         1572864             557056
1           26329       26329         1605632             557056
```

Você pode fazer com que os dados sejam redistribuídos entre todos os nós de dados, executando, para cada tabela `NDB`, uma declaração `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` (alter-table.html "15.1.9 ALTER TABLE Statement") no cliente **mysql**.

Importante

`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona em tabelas que foram criadas com a opção `MAX_ROWS`. Em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=...` para reorganizar essas tabelas.

Tenha em mente que o uso de `MAX_ROWS` para definir o número de partições por tabela é desaconselhável e você deve usar `PARTITION_BALANCE` em vez disso; consulte a Seção 15.1.20.12, “Definindo opções de comentário NDB”, para mais informações.

Após emitir a declaração `ALTER TABLE ips ALGORITHM=INPLACE, REORGANIZE PARTITION`, você pode ver usando **ndb_desc** que os dados para esta tabela agora são armazenados usando 4 partições, como mostrado aqui (com as partes relevantes do resultado em negrito):

```
$> ndb_desc -c 198.51.100.10 -d n ips -p
-- ips --
Version: 16777217
Fragment type: 9
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 6
Number of primary keys: 1
Length of frm data: 341
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 4
TableStatus: Retrieved
-- Attributes --
id Bigint PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
country_code Char(2;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
type Char(4;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
ip_address Varchar(15;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
addresses Bigunsigned NULL AT=FIXED ST=MEMORY
date Bigunsigned NULL AT=FIXED ST=MEMORY

-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex

-- Per partition info --
Partition   Row count   Commit count  Frag fixed memory   Frag varsized memory
0           12981       52296         1572864             557056
1           13236       52515         1605632             557056
2           13105       13105         819200              294912
3           13093       13093         819200              294912
```

Nota

Normalmente, `ALTER TABLE table_name [ALGORITHM=INPLACE,] REORGANIZE PARTITION` é usado com uma lista de identificadores de partição e um conjunto de definições de partição para criar um novo esquema de partição para uma tabela que já foi explicitamente particionada. Seu uso aqui para redistribuir dados em um novo grupo de nós do NDB Cluster é uma exceção a esse respeito; quando usado dessa maneira, nenhum outro termo ou identificador segue `REORGANIZE PARTITION`.

Para mais informações, consulte a Seção 15.1.9, “Instrução ALTER TABLE”.

Além disso, para cada tabela, a declaração `ALTER TABLE` deve ser seguida por uma (alter-table.html "15.1.9 ALTER TABLE Statement") para recuperar o espaço desperdiçado. Você pode obter uma lista de todas as tabelas `OPTIMIZE TABLE` usando a seguinte consulta contra a tabela do Esquema de Informação `TABLES`:

```
SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE ENGINE = 'NDBCLUSTER';
```

Nota

O valor `INFORMATION_SCHEMA.TABLES.ENGINE` para uma tabela de NDB Cluster é sempre `NDBCLUSTER`, independentemente de a declaração `CREATE TABLE` usada para criar a tabela (ou a declaração `ALTER TABLE` usada para converter uma tabela existente de um motor de armazenamento diferente) ter usado `NDB` ou `NDBCLUSTER` em sua opção `ENGINE`.

Você pode ver após realizar essas declarações na saída de `ALL REPORT MEMORY` que os dados e índices agora são redistribuídos entre todos os nós de dados do cluster, conforme mostrado aqui:

```
ndb_mgm> ALL REPORT MEMORY

Node 1: Data usage is 5%(176 32K pages of total 3200)
Node 1: Index usage is 0%(76 8K pages of total 12832)
Node 2: Data usage is 5%(176 32K pages of total 3200)
Node 2: Index usage is 0%(76 8K pages of total 12832)
Node 3: Data usage is 2%(80 32K pages of total 3200)
Node 3: Index usage is 0%(51 8K pages of total 12832)
Node 4: Data usage is 2%(80 32K pages of total 3200)
Node 4: Index usage is 0%(50 8K pages of total 12832)
```

Nota

Como apenas uma operação DDL nas tabelas `NDBCLUSTER` pode ser executada de cada vez, você deve esperar que cada declaração `ALTER TABLE ... REORGANIZE PARTITION`](alter-table.html "15.1.9 ALTER TABLE Statement") termine antes de emitir a próxima.

Não é necessário emitir declarações `ALTER TABLE ... REORGANIZE PARTITION`(alter-table.html "15.1.9 ALTER TABLE Statement") para tabelas `NDBCLUSTER` criadas *após* a adição dos novos nós de dados; os dados adicionados a tais tabelas são distribuídos automaticamente entre todos os nós de dados. No entanto, em tabelas `NDBCLUSTER` que existiam *antes* da adição dos novos nós, nem os dados existentes nem os novos são distribuídos usando os novos nós até que essas tabelas tenham sido reorganizadas usando `ALTER TABLE ... REORGANIZE PARTITION`(alter-table.html "15.1.9 ALTER TABLE Statement").

**Procedimento alternativo, sem reinício em rotação.** É possível evitar a necessidade de um reinício em rotação configurando os nós de dados adicionais, mas sem iniciá-los, ao iniciar o clúster pela primeira vez. Assumemos, como antes, que você deseja começar com dois nós de dados — os nós 1 e 2 — em um grupo de nós e, posteriormente, expandir o clúster para quatro nós de dados, adicionando um segundo grupo de nós, consistindo nos nós 3 e 4:

```
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[ndbd]
Id = 3
HostName = 198.51.100.3
Nodegroup = 65536

[ndbd]
Id = 4
HostName = 198.51.100.4
Nodegroup = 65536

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Os nós de dados que serão colocados online em um momento posterior (os nós 3 e 4) podem ser configurados com `NodeGroup = 65536`, nesse caso, os nós 1 e 2 podem ser iniciados cada um conforme mostrado aqui:

```
$> ndbd -c 198.51.100.10 --initial
```

Os nós de dados configurados com `NodeGroup = 65536` são tratados pelo servidor de gerenciamento como se você tivesse iniciado os nós 1 e 2 usando `--nowait-nodes=3,4` após esperar um período de tempo determinado pelo ajuste do parâmetro de configuração do nó de dados `StartNoNodeGroupTimeout`. Por padrão, isso é de 15 segundos (15000 milissegundos).

Nota

`StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no clúster; por essa razão, você deve sempre defini-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para nós de dados individuais.

Quando estiver pronto para adicionar o segundo grupo de nós, basta realizar as seguintes etapas adicionais:

1. Inicie os nós de dados 3 e 4, invocando o processo do nó de dados uma vez para cada novo nó:

   ```
   $> ndbd -c 198.51.100.10 --initial
   ```

2. Emite o comando apropriado `CREATE NODEGROUP` (mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no cliente de gerenciamento:

   ```
   ndb_mgm> CREATE NODEGROUP 3,4
   ```

3. No cliente **mysql**, emita as declarações `ALTER TABLE ... REORGANIZE PARTITION` (alter-table.html "15.1.9 ALTER TABLE Statement") e `OPTIMIZE TABLE` para cada tabela existente `NDBCLUSTER`. (Como observado em outras partes desta seção, as tabelas existentes do NDB Cluster não podem usar os novos nós para distribuição de dados até que isso tenha sido feito.)

### 25.6.8 Backup Online de NDB Cluster

As próximas seções descrevem como preparar e, em seguida, criar um backup de um NDB Cluster. Para distinguir esse tipo de backup de um backup feito usando o **ndb_mgm** cliente de gerenciamento, às vezes o chamamos de backup "nativo" do NDB Cluster. (Para informações sobre a criação de backups com o **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”.) A restauração de backups de NDB Cluster é feita usando o utilitário **ndb_restore** fornecido com a distribuição do NDB Cluster; para informações sobre **ndb_restore** e seu uso na restauração de backups do NDB Cluster, consulte a Seção 25.5.23, “ndb_restore — Restaurar um backup de NDB Cluster”.

O NDB 8.0 permite criar backups usando vários LDMs para alcançar paralelismo nos nós de dados. Veja a Seção 25.6.8.5, “Fazendo um backup do NDB com nós de dados paralelos”.

#### 25.6.8.1 Conceitos de backup de cluster do NDB

Um backup é um instantâneo do banco de dados em um determinado momento. O backup consiste em três partes principais:

* **Metadados.** Os nomes e definições de todas as tabelas do banco de dados

* **Registros de tabela.** Os dados que estão armazenados na tabela do banco de dados no momento em que o backup foi feito.

* **Registro de transação.** Um registro sequencial que indica como e quando os dados foram armazenados no banco de dados.

Cada uma dessas partes é salva em todos os nós que participam do backup. Durante o backup, cada nó salva essas três partes em três arquivos no disco:

* `BACKUP-backup_id.node_id.ctl`

Um arquivo de controle que contém informações de controle e metadados. Cada nó salva as mesmas definições de tabela (para todas as tabelas no clúster) em sua própria versão desse arquivo.

* `BACKUP-backup_id-0.node_id.data`

Um arquivo de dados que contém os registros da tabela, que são salvos por fragmento. Ou seja, diferentes nós salvam diferentes fragmentos durante o backup. O arquivo salvo por cada nó começa com um cabeçalho que indica as tabelas às quais os registros pertencem. Seguindo a lista de registros, há um rodapé que contém um checksum para todos os registros.

* `BACKUP-backup_id.node_id.log`

Um arquivo de registro que contém registros de transações realizadas. Apenas as transações em tabelas armazenadas no backup são armazenadas no log. Os nós envolvidos no backup armazenam diferentes registros, pois diferentes nós hospedam diferentes fragmentos de banco de dados.

Na lista mostrada acima, *`backup_id`* representa o identificador de backup e *`node_id`* é o identificador único do nó que cria o arquivo.

A localização dos arquivos de backup é determinada pelo parâmetro `BackupDataDir`.

#### 25.6.8.2 Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup

Antes de começar um backup, certifique-se de que o clúster está corretamente configurado para realizar um. (Veja a Seção 25.6.8.3, “Configuração para backups de clúster NDB”.)

O comando `START BACKUP` é usado para criar um backup e tem a sintaxe mostrada aqui:

```
START BACKUP [backup_id]
    [encryption_option]
    [wait_option]
    [snapshot_option]

encryption_option:
ENCRYPT [PASSWORD=password]

password:
{'password_string' | "password_string"}

wait_option:
WAIT {STARTED | COMPLETED} | NOWAIT

snapshot_option:
SNAPSHOTSTART | SNAPSHOTEND
```

Os backups sucessivos são identificados automaticamente sequencialmente, portanto, o *`backup_id`*, um número inteiro maior ou igual a 1, é opcional; se for omitido, o próximo valor disponível é usado. Se um valor existente de *`backup_id`* for usado, o backup falha com o erro "Backup falhou: arquivo já existe". Se usado, o *`backup_id`* deve seguir imediatamente após as palavras-chave `START BACKUP`, antes que quaisquer outras opções sejam usadas.

No NDB 8.0.22 e versões posteriores, `START BACKUP` suporta a criação de backups criptografados usando `ENCRYPT PASSWORD=password`. O *`password`* deve atender a todos os seguintes requisitos:

* Usa qualquer um dos caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`

* Não tem mais de 256 caracteres de comprimento; * Está encerrado por aspas simples ou duplas.

Quando o `ENCRYPT PASSWORD='password'` é usado, o registro de dados de backup e os arquivos de registro escritos por cada nó de dados são criptografados com uma chave derivada do *`password`* fornecido pelo usuário e um sal gerado aleatoriamente usando uma função de derivação de chave (KDF) que emprega o algoritmo PBKDF2-SHA256 para gerar uma chave de criptografia simétrica para aquele arquivo. Essa função tem a forma mostrada aqui:

```
key = KDF(random_salt, password)
```

A chave gerada é então usada para criptografar os dados de backup usando AES 256 CBC inline, e a criptografia simétrica é empregada para criptografar o conjunto de arquivos de backup (com a chave gerada).

Nota

O NDB Cluster *nunca* salva a senha fornecida pelo usuário ou a chave de criptografia gerada.

A partir do NDB 8.0.24, a opção `PASSWORD` pode ser omitida do *`encryption_option`*. Nesse caso, o cliente de gerenciamento solicita ao usuário uma senha.

É possível usar `PASSWORD` para definir uma senha vazia (`''` ou `""`), mas isso não é recomendado.

Um backup criptografado pode ser descriptografado usando qualquer um dos seguintes comandos:

* **ndb_restore** `--decrypt` `--backup-password=password`

* **ndbxfrm** `--decrypt-password=password` *`input_file`* *`output_file`*

* **ndb_print_backup_file** `-P` *`password`* *`file_name`*

O NDB 8.0.24 e versões posteriores suportam os comandos adicionais listados aqui:

* **ndb_restore** `--decrypt` `--backup-password-from-stdin`

* **ndbxfrm** `--decrypt-password-from-stdin` *`input_file`* *`output_file`*

* **ndb_print_backup_file** `--backup-password=password` *`file_name`*

* **ndb_print_backup_file** `--backup-password-from-stdin` *`file_name`*

* **ndb_mgm** `--backup-password-from-stdin` `--execute "START BACKUP ..."`

Veja as descrições desses programas para obter mais informações, como opções adicionais que podem ser necessárias.

O *`wait_option` pode ser usado para determinar quando o controle é devolvido ao cliente de gerenciamento após a emissão de um comando `START BACKUP`, conforme mostrado na lista a seguir:

* Se o `NOWAIT` for especificado, o cliente de gerenciamento exibe um prompt imediatamente, como visto aqui:

  ```
  ndb_mgm> START BACKUP NOWAIT
  ndb_mgm>
  ```

Neste caso, o cliente de gerenciamento pode ser usado mesmo enquanto imprime informações de progresso do processo de backup.

* Com `WAIT STARTED`, o cliente de gerenciamento espera até que o backup tenha começado antes de retornar o controle ao usuário, como mostrado aqui:

  ```
  ndb_mgm> START BACKUP WAIT STARTED
  Waiting for started, this may take several minutes
  Node 2: Backup 3 started from node 1
  ndb_mgm>
  ```

* **`WAIT COMPLETED`** faz com que o cliente de gerenciamento espere até que o processo de backup esteja completo antes de retornar o controle ao usuário.

`WAIT COMPLETED` é o padrão.

Um *`snapshot_option`* pode ser usado para determinar se o backup corresponde ao estado do clúster quando o `START BACKUP` foi emitido ou quando foi concluído. `SNAPSHOTSTART` faz com que o backup corresponda ao estado do clúster quando o backup começou; `SNAPSHOTEND` faz com que o backup reflita o estado do clúster quando o backup foi concluído. `SNAPSHOTEND` é o padrão e corresponde ao comportamento encontrado em versões anteriores do NDB Cluster.

Nota

Se você usar a opção `SNAPSHOTSTART` com `START BACKUP`, e o parâmetro `CompressedBackup` estiver habilitado, apenas os arquivos de dados e de controle são comprimidos — o arquivo de registro não é comprimido.

Se ambos os *`wait_option`* e *`snapshot_option`* forem usados, eles podem ser especificados em qualquer ordem. Por exemplo, todos os comandos a seguir são válidos, assumindo que não há um backup existente com 4 como seu ID:

```
START BACKUP WAIT STARTED SNAPSHOTSTART
START BACKUP SNAPSHOTSTART WAIT STARTED
START BACKUP 4 WAIT COMPLETED SNAPSHOTSTART
START BACKUP SNAPSHOTEND WAIT COMPLETED
START BACKUP 4 NOWAIT SNAPSHOTSTART
```

O procedimento para criar um backup consiste nos seguintes passos:

1. Inicie o cliente de gerenciamento (**ndb_mgm**), se ainda não estiver em execução.

2. Execute o comando **`START BACKUP`**. Isso produz várias linhas de saída indicando o progresso do backup, conforme mostrado aqui:

   ```
   ndb_mgm> START BACKUP
   Waiting for completed, this may take several minutes
   Node 2: Backup 1 started from node 1
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ndb_mgm>
   ```

3. Quando o backup tiver começado, o cliente de gerenciamento exibe esta mensagem:

   ```
   Backup backup_id started from node node_id
   ```

*`backup_id`* é o identificador único para este backup específico. Este identificador é salvo no log do clúster, se não tiver sido configurado de outra forma. *`node_id`* é o identificador do servidor de gerenciamento que está coordenando o backup com os nós de dados. Neste ponto do processo de backup, o clúster recebeu e processou a solicitação de backup. Isso não significa que o backup tenha terminado. Um exemplo desta declaração é mostrado aqui:

   ```
   Node 2: Backup 1 started from node 1
   ```

4. O cliente de gerenciamento indica com uma mensagem como esta que o backup começou:

   ```
   Backup backup_id started from node node_id completed
   ```

Assim como no caso da notificação de que o backup foi iniciado, *`backup_id`* é o identificador único para este backup específico, e *`node_id`* é o ID do nó do servidor de gerenciamento que está coordenando o backup com os nós de dados. Essa saída é acompanhada por informações adicionais, incluindo pontos de verificação globais relevantes, o número de registros respaldados e o tamanho dos dados, conforme mostrado aqui:

   ```
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ```

É também possível realizar um backup a partir da linha de comandos do sistema, invocando o **ndb_mgm** com a opção `-e` ou `--execute`, conforme mostrado neste exemplo:

```
$> ndb_mgm -e "START BACKUP 6 WAIT COMPLETED SNAPSHOTSTART"
```

Ao usar `START BACKUP` dessa forma, você deve especificar o ID de backup.

Os backups em cluster são criados por padrão no subdiretório `BACKUP` do diretório `DataDir` em cada nó de dados. Isso pode ser sobrescrito para um ou mais nós de dados individualmente, ou para todos os nós de dados do cluster no arquivo `config.ini` usando o parâmetro de configuração `BackupDataDir`. Os arquivos de backup criados para um backup com um *`backup_id`* específico são armazenados em um subdiretório chamado `BACKUP-backup_id` no diretório de backup.

**Cancelamento de backups.** Para cancelar ou abortar um backup que já está em andamento, siga os passos a seguir:

1. Inicie o cliente de gerenciamento. 2. Execute este comando:

   ```
   ndb_mgm> ABORT BACKUP backup_id
   ```

O número *`backup_id`* é o identificador do backup que foi incluído na resposta do cliente de gerenciamento quando o backup foi iniciado (na mensagem `Backup backup_id started from node management_node_id`).

3. O cliente de gerenciamento reconhece o pedido de interrupção com `Abort of backup backup_id ordered`.

Nota

Neste momento, o cliente de gerenciamento ainda não recebeu uma resposta dos nós de dados do clúster para essa solicitação, e o backup ainda não foi realmente interrompido.

4. Após o backup ter sido interrompido, o cliente de gerenciamento relata esse fato de uma maneira semelhante àquela mostrada aqui:

   ```
   Node 1: Backup 3 started from 5 has been aborted.
     Error: 1321 - Backup aborted by user request: Permanent error: User defined error
   Node 3: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 2: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 4: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   ```

Neste exemplo, mostramos a saída de amostra para um clúster com 4 nós de dados, onde o número de sequência do backup a ser abortado é `3`, e o nó de gestão ao qual o cliente de gestão do clúster está conectado tem o ID de nó `5`. O primeiro nó a completar sua parte no aborto do backup relata que a razão do aborto foi devido a um pedido do usuário. (Os nós restantes relatam que o backup foi abortado devido a um erro interno não especificado.)

Nota

Não há garantia de que os nós do cluster respondam a um comando `ABORT BACKUP` em qualquer ordem específica.

As mensagens `Backup backup_id started from node management_node_id has been aborted` significam que o backup foi terminado e que todos os arquivos relacionados a este backup foram removidos do sistema de arquivos do clúster.

É também possível abortar um backup em andamento a partir de uma janela de sistema usando este comando:

```
$> ndb_mgm -e "ABORT BACKUP backup_id"
```

Nota

Se não houver um backup com o ID *`backup_id` em execução quando um `ABORT BACKUP` é emitido, o cliente de gerenciamento não faz nenhuma resposta, e também não é indicado no log do clúster que um comando de interrupção inválido foi enviado.

#### 25.6.8.3 Configuração para backups do NDB Cluster

Cinco parâmetros de configuração são essenciais para o backup:

* `BackupDataBufferSize`

A quantidade de memória usada para bufferizar dados antes de serem escritos em disco.

* `BackupLogBufferSize`

O volume de memória usado para bufferar os registros do log antes de serem escritos no disco.

* `BackupMemory`

A memória total alocada em um nó de dados para backups. Isso deve ser a soma da memória alocada para o buffer de dados de backup e o buffer de log de backup.

* `BackupWriteSize`

O tamanho padrão dos blocos escritos no disco. Isso se aplica tanto ao buffer de dados de backup quanto ao buffer de log de backup.

* `BackupMaxWriteSize`

O tamanho máximo dos blocos escritos no disco. Isso se aplica tanto ao buffer de dados de backup quanto ao buffer de log de backup.

Além disso, `CompressedBackup` faz com que `NDB` use compressão ao criar e escrever em arquivos de backup.

Informações mais detalhadas sobre esses parâmetros podem ser encontradas em [Parâmetros de backup][(mysql-cluster-ndbd-definition.html#mysql-cluster-backup-parameters "Backup parameters")].

Você também pode definir um local para os arquivos de backup usando o parâmetro de configuração `BackupDataDir`. O padrão é `FileSystemPath``/BACKUP/BACKUP-backup_id`.

No NDB 8.0.22 e versões posteriores, você pode impor a criptografia dos arquivos de backup habilitando `RequireEncryptedBackup`. Quando este parâmetro é definido como 1, os backups não podem ser criados sem especificar `ENCRYPT PASSWORD=password` como parte de um comando `START BACKUP`.

#### 25.6.8.4 Solução de problemas de backup do cluster NDB

Se um código de erro for retornado ao emitir uma solicitação de backup, a causa mais provável é a memória ou espaço em disco insuficiente. Você deve verificar se há memória suficiente alocada para o backup.

Importante

Se você definiu `BackupDataBufferSize` e `BackupLogBufferSize` e a soma deles é maior que 4 MB, então você também deve definir `BackupMemory`.

Você também deve garantir que haja espaço suficiente na partição do disco rígido do alvo de backup.

`NDB` não suporta leituras repetidas, o que pode causar problemas com o processo de restauração. Embora o processo de backup seja "quente", restaurar um NDB Cluster a partir de um backup não é um processo 100% "quente". Isso ocorre porque, durante a duração do processo de restauração, as transações em execução obtêm leituras não repetidas dos dados restaurados. Isso significa que o estado dos dados é inconsistente enquanto a restauração está em andamento.

#### 25.6.8.5 Fazer um backup do NDB com nós de dados paralelos

É possível no NDB 8.0 fazer um backup com vários gestores de dados locais (LDMs) atuando em paralelo nos nós de dados. Para que isso funcione, todos os nós de dados no clúster devem usar vários LDMs, e cada nó de dados deve usar o mesmo número de LDMs. Isso significa que todos os nós de dados devem rodar **ndbmtd**") (**ndbd** é monofilamento e, portanto, sempre tem apenas um LDM) e devem ser configurados para usar vários LDMs antes de fazer o backup; **ndbmtd**") por padrão, executa em modo monofilamento. Você pode fazer com que eles usem vários LDMs escolhendo uma configuração apropriada para um dos parâmetros de configuração de nó de dados multifilamento `MaxNoOfExecutionThreads` ou `ThreadConfig`. Tenha em mente que alterar esses parâmetros requer um reinício do clúster; isso pode ser um reinício contínuo. Além disso, o parâmetro `EnableMultithreadedBackup` deve ser definido para 1 em cada nó de dados (este é o padrão).

Dependendo do número de LDMs e de outros fatores, você também pode precisar aumentar `NoOfFragmentLogParts`. Se você estiver usando tabelas de dados de disco grandes, também pode precisar aumentar `DiskPageBufferMemory`. Assim como em backups de único fio, você também pode querer ou precisar fazer ajustes nas configurações de `BackupDataBufferSize`, `BackupMemory` e outros parâmetros de configuração relacionados a backups (consulte Parâmetros de backup).

Uma vez que todos os nós de dados estejam usando múltiplos LDMs, você pode realizar o backup paralelo usando o comando `START BACKUP` (mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") no cliente de gerenciamento NDB, assim como faria se os nós de dados estivessem executando **ndbd** (ou **ndbmtd**") no modo de thread único); não é necessária sintaxe adicional ou especial, e você pode especificar um ID de backup, opção de espera ou opção de instantâneo em qualquer combinação conforme necessário ou desejado.

Os backups utilizando múltiplos LDMs criam subdiretórios, um por LDM, sob o diretório `BACKUP/BACKUP-backup_id/` (que, por sua vez, reside sob o `BackupDataDir`) em cada nó de dados; esses subdiretórios são nomeados `BACKUP-backup_id-PART-1-OF-N/`, `BACKUP-backup_id-PART-2-OF-N/`, e assim por diante, até `BACKUP-backup_id-PART-N-OF-N/`, onde *`backup_id`* é o ID de backup usado para este backup e *`N`* é o número de LDMs por nó de dados. Cada um desses subdiretórios contém os arquivos de backup usuais `BACKUP-backup_id-0.node_id.Data`, `BACKUP-backup_id.node_id.ctl`, e `BACKUP-backup_id.node_id.log`, onde *`node_id`* é o ID do nó deste nó de dados.

O **ndb_restore** verifica automaticamente a presença dos subdiretórios descritos acima; se os encontrar, ele tenta restaurar o backup em paralelo. Para informações sobre a restauração de backups feitos com múltiplos LDMs, consulte a Seção 25.5.23.3, “Restauração a partir de um backup feito em paralelo”.

Para forçar a criação de um backup monofilamentar que possa ser facilmente importado pelo **ndb_restore** a partir de uma versão do NDB anterior à 8.0, você pode definir `EnableMultithreadedBackup = 0` (mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-enablemultithreadedbackup) para todos os nós de dados (você pode fazer isso definindo o parâmetro na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Também é possível restaurar um backup paralelo a um clúster que esteja executando uma versão anterior do `NDB`. Consulte a Seção 25.5.23.1.1, “Restaurando um backup do NDB para uma versão anterior do NDB Cluster”, para obter mais informações.

### 25.6.9 Importando dados no MySQL Cluster

É comum, ao configurar uma nova instância do NDB Cluster, precisar importar dados de uma instância existente do NDB Cluster, de uma instância do MySQL ou de outra fonte. Esses dados geralmente estão disponíveis em um ou mais dos seguintes formatos:

* Um arquivo de exclusão SQL, como o produzido pelo **mysqldump** ou **mysqlpump**. Este pode ser importado usando o cliente **mysql**, como mostrado mais adiante nesta seção.

* Um arquivo CSV produzido por **mysqldump** ou outro programa de exportação. Esses arquivos podem ser importados em `NDB` usando `LOAD DATA INFILE` no cliente **mysql**, ou com o utilitário **ndb_import** fornecido com a distribuição do NDB Cluster. Para mais informações sobre este último, consulte a Seção 25.5.13, “ndb_import — Importar dados CSV no NDB”.

* Um backup nativo `NDB` produzido usando `START BACKUP` no cliente de gerenciamento `NDB`. Para importar um backup nativo, você deve usar o programa **ndb_restore** que vem como parte do NDB Cluster. Consulte a Seção 25.5.23, “ndb_restore — Restaurar um backup de NDB Cluster”, para mais informações sobre o uso deste programa.

Ao importar dados de um arquivo SQL, muitas vezes não é necessário impor transações ou chaves estrangeiras, e desabilitar temporariamente esses recursos pode acelerar muito o processo de importação. Isso pode ser feito usando o cliente **mysql**, seja em uma sessão de cliente, ou invocando-o na linha de comando. Dentro de uma sessão do cliente **mysql**, você pode realizar a importação usando as seguintes instruções SQL:

```
SET ndb_use_transactions=0;
SET foreign_key_checks=0;

source path/to/dumpfile;

SET ndb_use_transactions=1;
SET foreign_key_checks=1;
```

Ao realizar a importação dessa forma, você *deve* habilitar novamente `ndb_use_transaction` e `foreign_key_checks` após a execução do comando `source` do cliente **mysql**. Caso contrário, é possível que declarações posteriores na mesma sessão também sejam executadas sem impor transações ou restrições de chave estrangeira, o que pode levar a inconsistências nos dados.

Na linha de comandos do sistema, você pode importar o arquivo SQL enquanto desabilita a aplicação de transações e chaves estrangeiras usando o cliente `--init-command` do **mysql**, da seguinte forma:

```
$> mysql --init-command='SET ndb_use_transactions=0; SET foreign_key_checks=0' < path/to/dumpfile
```

Também é possível carregar os dados em uma tabela `InnoDB` e, em seguida, convertê-los para usar o mecanismo de armazenamento NDB usando ALTER TABLE ... ENGINE NDB). Você deve levar em consideração, especialmente para muitas tabelas, que isso pode exigir vários desses processos; além disso, se chaves estrangeiras forem usadas, você deve prestar atenção à ordem das declarações `ALTER TABLE` cuidadosamente, devido ao fato de que as chaves estrangeiras não funcionam entre tabelas que usam diferentes mecanismos de armazenamento MySQL.

Você deve estar ciente de que os métodos descritos anteriormente nesta seção não são otimizados para conjuntos de dados muito grandes ou transações grandes. Se uma aplicação realmente precisar de grandes transações ou muitas transações concorrentes como parte do funcionamento normal, você pode querer aumentar o valor do parâmetro de configuração do nó de dados `MaxNoOfConcurrentOperations`, que reserva mais memória para permitir que um nó de dados assuma uma transação se seu coordenador de transação parar inesperadamente.

Você também pode querer fazer isso ao realizar operações em massa de `DELETE` ou `UPDATE` em tabelas do NDB Cluster. Se possível, tente fazer com que as aplicações realizem essas operações em partes, por exemplo, adicionando `LIMIT` a tais declarações.

Se uma operação de importação de dados não for concluída com sucesso, por qualquer motivo, você deve estar preparado para realizar qualquer limpeza necessária, incluindo possivelmente uma ou mais declarações `DROP TABLE` (drop-table.html "15.1.32 DROP TABLE Statement"), `DROP DATABASE` (drop-database.html "15.1.24 DROP DATABASE Statement") ou ambas. Não fazer isso pode deixar o banco de dados em um estado inconsistente.

### 25.6.10 Uso do MySQL Server para NDB Cluster

**mysqld** é o processo tradicional do servidor MySQL. Para ser usado com o NDB Cluster, **mysqld** precisa ser compilado com suporte ao mecanismo de armazenamento `NDB`, pois está nos binários pré-compilados disponíveis em <https://dev.mysql.com/downloads/>. Se você compilar o MySQL a partir do código-fonte, você deve invocar o **CMake** com a opção `-DWITH_NDB=1` (ou (desatualizada) `-DWITH_NDBCLUSTER=1`) para incluir suporte ao `NDB`.

Para obter mais informações sobre a compilação do NDB Cluster a partir de fonte, consulte a Seção 25.3.1.4, “Construindo o NDB Cluster a partir de fonte no Linux”, e a Seção 25.3.2.2, “Compilando e Instalando o NDB Cluster a partir de fonte no Windows”.

(Para informações sobre as opções e variáveis do **mysqld**, além das discutidas nesta seção, que são relevantes para o NDB Cluster, consulte a Seção 25.4.3.9, “Opções e variáveis do servidor MySQL para NDB Cluster”.)

Se o binário **mysqld** foi construído com suporte ao Cluster, o mecanismo de armazenamento `NDBCLUSTER` ainda está desativado por padrão. Você pode usar uma das duas opções possíveis para ativar esse mecanismo:

* Use `--ndbcluster` como uma opção de inicialização na linha de comando ao iniciar o **mysqld**.

* Insira uma linha contendo `ndbcluster` na seção `[mysqld]` do seu arquivo `my.cnf`.

Uma maneira fácil de verificar se seu servidor está rodando com o motor de armazenamento `NDBCLUSTER` habilitado é emitir a declaração `SHOW ENGINES` no Monitor MySQL (**mysql**). Você deve ver o valor `YES` como o valor `Support` na linha para `NDBCLUSTER`. Se você ver `NO` nesta linha ou se não houver uma linha desse tipo exibida na saída, você não está executando uma versão do MySQL habilitada para `NDB`. Se você ver `DISABLED` nesta linha, você precisa habilitá-la de uma das duas maneiras descritas acima.

Para ler os dados de configuração do clúster, o servidor MySQL requer, no mínimo, três informações:

* O próprio ID do nó do cluster do servidor MySQL
* O nome do host ou endereço IP do servidor de gerenciamento
* O número da porta TCP/IP na qual ele pode se conectar ao servidor de gerenciamento

Os IDs dos nós podem ser alocados dinamicamente, portanto, não é estritamente necessário especificá-los explicitamente.

O parâmetro **mysqld** `ndb-connectstring` é usado para especificar a string de conexão, seja na linha de comando ao iniciar o **mysqld** ou em `my.cnf`. A string de conexão contém o nome do host ou endereço IP onde o servidor de gerenciamento pode ser encontrado, bem como a porta TCP/IP que ele usa.

No exemplo a seguir, `ndb_mgmd.mysql.com` é o host onde o servidor de gerenciamento reside, e o servidor de gerenciamento escuta mensagens de cluster na porta 1186:

```
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Consulte a Seção 25.4.3.3, “Strings de Conexão de Agrupamento NDB”, para obter mais informações sobre as strings de conexão.

Dada essa informação, o servidor MySQL pode atuar como um participante completo no clúster. (Frequentemente, referimos a um processo **mysqld** que está em execução dessa maneira como um nó SQL.) Ele está totalmente ciente de todos os nós de dados do clúster, bem como de seu status, e estabelece conexões a todos os nós de dados. Neste caso, é capaz de usar qualquer nó de dados como um coordenador de transação e de ler e atualizar dados do nó.

Você pode ver no cliente **mysql** se um servidor MySQL está conectado ao clúster usando `SHOW PROCESSLIST` (show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"). Se o servidor MySQL estiver conectado ao clúster e você tiver o privilégio `PROCESS`, a primeira linha do resultado será mostrada aqui:

```
mysql> SHOW PROCESSLIST \G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db:
Command: Daemon
   Time: 1
  State: Waiting for event from ndbcluster
   Info: NULL
```

Importante

Para participar de um NDB Cluster, o processo **mysqld** deve ser iniciado com *ambas* as opções `--ndbcluster` e `--ndb-connectstring` (ou seus equivalentes em `my.cnf`). Se o **mysqld** for iniciado apenas com a opção `--ndbcluster`, ou se não conseguir entrar em contato com o cluster, não é possível trabalhar com as tabelas `NDB`, *nem é possível criar quaisquer novas tabelas, independentemente do motor de armazenamento*. Esta última restrição é uma medida de segurança destinada a impedir a criação de tabelas com os mesmos nomes das tabelas `NDB` enquanto o nó SQL não estiver conectado ao cluster. Se você deseja criar tabelas usando um motor de armazenamento diferente enquanto o processo **mysqld** não estiver participando de um NDB Cluster, você deve reiniciar o servidor *sem* a opção `--ndbcluster`.

### 25.6.11 Tabelas de dados de disco do cluster NDB

O NDB Cluster suporta o armazenamento de colunas não indexadas das tabelas `NDB` no disco, em vez de na RAM. Os dados das colunas e os metadados de registro são mantidos em arquivos de dados e arquivos de registro de desfazer, conceituados como espaços de tabela e grupos de arquivos de registro, conforme descrito na próxima seção — veja Seção 25.6.11.1, "Objetos de dados de disco do NDB Cluster".

O desempenho dos dados do disco do NDB Cluster pode ser influenciado por vários parâmetros de configuração. Para obter informações sobre esses parâmetros e seus efeitos, consulte Parâmetros de configuração dos dados do disco e Erros de parada dos dados do disco e GCP.

Você também deve definir o parâmetro de configuração do nó de dados `DiskDataUsingSameDisk` para `false` ao usar discos separados para arquivos de dados do disco.

Veja também os parâmetros do sistema de arquivos de dados de disco.

O NDB 8.0 oferece suporte aprimorado ao usar tabelas de Dados de disco com unidades de estado sólido, em particular aquelas que utilizam NVMe. Consulte a documentação a seguir para obter mais informações:

* Parâmetros de latência de dados do disco
* Seção 25.6.16.31, “A tabela ndbinfo diskstat”
* Seção 25.6.16.32, “A tabela ndbinfo diskstats_1sec”
* Seção 25.6.16.49, “A tabela ndbinfo pgman_time_track_stats”

#### 25.6.11.1 Objetos de dados de disco de cluster NDB

O armazenamento de dados do disco do NDB Cluster é implementado usando os seguintes objetos:

* Tablespace: Age como recipientes para outros objetos de dados de disco. Um tablespace contém um ou mais arquivos de dados e um ou mais grupos de arquivos de log de desfazer.

* Arquivo de dados: Armazena dados de coluna. Um arquivo de dados é atribuído diretamente a um espaço de tabela.

* Desfazer arquivo de registro: Contém informações de desfazer necessárias para o retorno de transações. Atribuído a um grupo de arquivo de registro de desfazer.

* grupo de arquivo de registro: Contém um ou mais arquivos de registro de desfazer. Atribuído a um espaço de tabelas.

Os arquivos de registro e os arquivos de dados são arquivos reais no sistema de arquivos de cada nó de dados; por padrão, eles são colocados em `ndb_node_id_fs` no *`DataDir`* especificado no arquivo NDB Cluster `config.ini`, e onde *`node_id`* é o ID do nó do nó de dados. É possível colocá-los em outro lugar, especificando uma rota absoluta ou relativa como parte do nome do arquivo ao criar o arquivo de registro de desfazer ou o arquivo de dados. As declarações que criam esses arquivos são mostradas mais tarde nesta seção.

Os arquivos de registro desfazer são usados apenas pelas tabelas de Dados de disco e não são necessários ou usados pelas tabelas `NDB` que são armazenadas apenas na memória.

Os espaços de tabela e grupos de arquivos de registro do NDB Cluster não são implementados como arquivos.

Embora nem todos os objetos de Dados em Disco sejam implementados como arquivos, todos compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de Dados em Disco* deve ser nomeado de forma única (e não apenas cada objeto de Dados em Disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de registro com os nomes `dd1` ambos.

Supondo que você já tenha configurado um NDB Cluster com todos os nós (incluindo nós de gerenciamento e SQL), os passos básicos para criar uma tabela de NDB Cluster em disco são os seguintes:

1. Crie um grupo de arquivos de registro e atribua um ou mais arquivos de registro de desfazer a ele (um arquivo de registro de desfazer também é às vezes referido como um undofile).

2. Crie um tablespace; atribua o grupo de arquivos de registro, bem como um ou mais arquivos de dados, ao tablespace.

3. Crie uma tabela de dados de disco que utilize este espaço de tabela para armazenamento de dados.

Cada uma dessas tarefas pode ser realizada usando declarações SQL no cliente **mysql** ou em outra aplicação de cliente MySQL, conforme mostrado no exemplo a seguir.

1. Criamos um grupo de arquivos de registro denominado `lg_1` usando `CREATE LOGFILE GROUP`. Este grupo de arquivos de registro deve ser composto por dois arquivos de registro de desfazer, que denominamos `undo_1.log` e `undo_2.log`, cujos tamanhos iniciais são, respectivamente, 16 MB e 12 MB. (O tamanho inicial padrão para um arquivo de registro de desfazer é de 128 MB.) Opcionalmente, você também pode especificar um tamanho para o buffer de desfazer do grupo de arquivos de registro, ou permitir que ele assuma o valor padrão de 8 MB. Neste exemplo, definimos o tamanho do buffer de DESFAZER em 2 MB. Um grupo de arquivos de registro deve ser criado com um arquivo de registro de desfazer; portanto, adicionamos `undo_1.log` a `lg_1` nesta declaração `CREATE LOGFILE GROUP`:

   ```
   CREATE LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_1.log'
       INITIAL_SIZE 16M
       UNDO_BUFFER_SIZE 2M
       ENGINE NDBCLUSTER;
   ```

Para adicionar `undo_2.log` ao grupo de arquivos de registro, use a seguinte declaração `ALTER LOGFILE GROUP`(alter-logfile-group.html "15.1.6 ALTER LOGFILE GROUP Statement"):

   ```
   ALTER LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_2.log'
       INITIAL_SIZE 12M
       ENGINE NDBCLUSTER;
   ```

Algumas observações:

* A extensão de arquivo `.log` usada aqui não é necessária. Nós a empregamos apenas para tornar os arquivos de registro facilmente reconhecíveis.

* Cada declaração `CREATE LOGFILE GROUP`(create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement") e `ALTER LOGFILE GROUP`(alter-logfile-group.html "15.1.6 ALTER LOGFILE GROUP Statement") deve incluir uma opção `ENGINE`. Os únicos valores permitidos para esta opção são `NDBCLUSTER` e `NDB`.

Importante

Pode existir, no máximo, um grupo de arquivos de registro no mesmo NDB Cluster em qualquer momento.

* Quando você adiciona um arquivo de registro de desfazer a um grupo de arquivos de registro usando `ADD UNDOFILE 'filename'`, um arquivo com o nome *`filename`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó de dados. Cada arquivo de registro de desfazer tem o tamanho especificado na declaração SQL. Por exemplo, se um NDB Cluster tem 4 nós de dados, então a declaração [`ALTER LOGFILE GROUP`(alter-logfile-group.html "15.1.6 ALTER LOGFILE GROUP Statement")]] mostrada acima cria 4 arquivos de registro de desfazer, 1 em cada um do diretório de dados de cada um dos 4 nós de dados; cada um desses arquivos é denominado *`undo_2.log`* e cada arquivo tem 12 MB de tamanho.

* `UNDO_BUFFER_SIZE` é limitado pela quantidade de memória do sistema disponível.

* Consulte a Seção 15.1.16, "Declaração CREATE LOGFILE GROUP", e a Seção 15.1.6, "Declaração ALTER LOGFILE GROUP", para obter mais informações sobre essas declarações.

2. Agora, podemos criar um tablespace — um recipiente abstrato para arquivos usados pelas tabelas de Dados de disco para armazenar dados. Um tablespace está associado a um grupo de arquivos de registro específico; ao criar um novo tablespace, você deve especificar o grupo de arquivos de registro que ele usa para registro de desfazer. Você também deve especificar pelo menos um arquivo de dados; é possível adicionar mais arquivos de dados ao tablespace após a criação do tablespace. Também é possível descartar arquivos de dados de um tablespace (veja o exemplo mais adiante nesta seção).

Suponha que deseje criar um espaço de tabelas denominado `ts_1` que use `lg_1` como seu grupo de arquivos de log. Queremos que o espaço de tabelas contenha dois arquivos de dados, denominados `data_1.dat` e `data_2.dat`, cujos tamanhos iniciais são, respectivamente, 32 MB e 48 MB. (O valor padrão para `INITIAL_SIZE` é 128 MB.) Podemos fazer isso usando duas instruções SQL, como mostrado aqui:

   ```
   CREATE TABLESPACE ts_1
       ADD DATAFILE 'data_1.dat'
       USE LOGFILE GROUP lg_1
       INITIAL_SIZE 32M
       ENGINE NDBCLUSTER;

   ALTER TABLESPACE ts_1
       ADD DATAFILE 'data_2.dat'
       INITIAL_SIZE 48M;
   ```

A declaração `CREATE TABLESPACE` cria um espaço de tabelas `ts_1` com o arquivo de dados `data_1.dat`, e associa `ts_1` ao grupo de arquivos de registro `lg_1`. O [`ALTER TABLESPACE`(alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement")]] adiciona o segundo arquivo de dados (`data_2.dat`).

Algumas observações:

* Como é o caso da extensão de arquivo `.log` usada neste exemplo para arquivos de registro de desfazer, não há um significado especial para a extensão de arquivo `.dat`; ela é usada apenas para reconhecimento fácil.

* Quando você adiciona um arquivo de dados a um espaço de tabelas usando `ADD DATAFILE 'filename'`, um arquivo com o nome *`filename`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó do nó de dados. Cada arquivo de dados tem o tamanho especificado na declaração SQL. Por exemplo, se um NDB Cluster tiver 4 nós de dados, então a declaração [`ALTER TABLESPACE`(alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement")]] mostrada acima cria 4 arquivos de dados, 1 em cada diretório de dados de cada um dos 4 nós de dados; cada um desses arquivos é denominado *`data_2.dat`* e cada arquivo tem 48 MB de tamanho.

* `NDB` reserva 4% de cada espaço de tabela para uso durante os reinícios dos nós de dados. Esse espaço não está disponível para armazenamento de dados.

As declarações `CREATE TABLESPACE` devem conter uma cláusula `ENGINE`; apenas tabelas que utilizam o mesmo mecanismo de armazenamento que o espaço de tabela podem ser criadas no espaço de tabela. Para `ALTER TABLESPACE`, uma cláusula `ENGINE` é aceita, mas é desaconselhada e sujeita à remoção em uma versão futura. Para espaços de tabela `NDB`, os únicos valores permitidos para esta opção são `NDBCLUSTER` e `NDB`.

* No NDB 8.0.20 e versões posteriores, a alocação de extensões é realizada de forma round-robin entre todos os arquivos de dados utilizados por um determinado espaço de tabela.

* Para mais informações sobre as declarações `CREATE TABLESPACE` e `ALTER TABLESPACE`, consulte a Seção 15.1.21, “Declaração CREATE TABLESPACE”, e a Seção 15.1.10, “Declaração ALTER TABLESPACE”.

3. Agora é possível criar uma tabela cujos campos não indexados são armazenados em disco usando arquivos no espaço de tabela `ts_1`:

   ```
   CREATE TABLE dt_1 (
       member_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
       last_name VARCHAR(50) NOT NULL,
       first_name VARCHAR(50) NOT NULL,
       dob DATE NOT NULL,
       joined DATE NOT NULL,
       INDEX(last_name, first_name)
       )
       TABLESPACE ts_1 STORAGE DISK
       ENGINE NDBCLUSTER;
   ```

`TABLESPACE ts_1 STORAGE DISK` informa ao motor de armazenamento `NDB` que deve usar o espaço de tabela `ts_1` para armazenamento de dados no disco.

Uma vez que a tabela `ts_1` tenha sido criada conforme mostrado, você pode realizar as instruções `INSERT`, `SELECT`, `UPDATE` e `DELETE` nela, assim como faria com qualquer outra tabela MySQL.

É também possível especificar se uma coluna individual é armazenada em disco ou na memória usando uma cláusula `STORAGE` como parte da definição da coluna em uma declaração `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"). `STORAGE DISK` faz com que a coluna seja armazenada em disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. Consulte a Seção 15.1.20, “Declaração CREATE TABLE”, para obter mais informações.

Você pode obter informações sobre os arquivos de dados do disco `NDB` e os arquivos de registro desfeito recém-criados consultando a tabela `FILES` no banco de dados `INFORMATION_SCHEMA`, conforme mostrado aqui:

```
mysql> SELECT
              FILE_NAME AS File, FILE_TYPE AS Type,
              TABLESPACE_NAME AS Tablespace, TABLE_NAME AS Name,
              LOGFILE_GROUP_NAME AS 'File group',
              FREE_EXTENTS AS Free, TOTAL_EXTENTS AS Total
          FROM INFORMATION_SCHEMA.FILES
          WHERE ENGINE='ndbcluster';
+--------------+----------+------------+------+------------+------+---------+
| File         | Type     | Tablespace | Name | File group | Free | Total   |
+--------------+----------+------------+------+------------+------+---------+
| ./undo_1.log | UNDO LOG | lg_1       | NULL | lg_1       |    0 | 4194304 |
| ./undo_2.log | UNDO LOG | lg_1       | NULL | lg_1       |    0 | 3145728 |
| ./data_1.dat | DATAFILE | ts_1       | NULL | lg_1       |   32 |      32 |
| ./data_2.dat | DATAFILE | ts_1       | NULL | lg_1       |   48 |      48 |
+--------------+----------+------------+------+------------+------+---------+
4 rows in set (0.00 sec)
```

Para mais informações e exemplos, consulte a Seção 28.3.15, “A Tabela INFORMATION_SCHEMA FILES”.

**Indexação de colunas armazenadas implicitamente em disco.** Para a tabela `dt_1` conforme definida no exemplo mostrado anteriormente, apenas as colunas `dob` e `joined` são armazenadas em disco. Isso ocorre porque existem índices nas colunas `id`, `last_name` e `first_name`, e, portanto, os dados pertencentes a essas colunas são armazenados em RAM. Apenas colunas não indexadas podem ser mantidas em disco; índices e dados de colunas indexadas continuam sendo armazenados em memória. Esse compromisso entre o uso de índices e a conservação da RAM é algo que você deve ter em mente ao projetar tabelas de Dados de Disco.

Você não pode adicionar um índice a uma coluna que tenha sido explicitamente declarada `STORAGE DISK`, sem primeiro alterar seu tipo de armazenamento para `MEMORY`; qualquer tentativa de fazer isso falha com um erro. Uma coluna que *implicitamente* usa armazenamento em disco pode ser indexada; quando isso é feito, o tipo de armazenamento da coluna é alterado automaticamente para `MEMORY`. Por “implicitamente”, entendemos uma coluna cujo tipo de armazenamento não é declarado, mas que é herdada da tabela pai. Na seguinte declaração CREATE TABLE (usando o tablespace `ts_1` definido anteriormente), as colunas `c2` e `c3` usam armazenamento em disco implicitamente:

```
mysql> CREATE TABLE ti (
    ->     c1 INT PRIMARY KEY,
    ->     c2 INT,
    ->     c3 INT,
    ->     c4 INT
    -> )
    ->     STORAGE DISK
    ->     TABLESPACE ts_1
    ->     ENGINE NDBCLUSTER;
Query OK, 0 rows affected (1.31 sec)
```

Como `c2`, `c3` e `c4` não são declarados com `STORAGE DISK`, é possível indexá-los. Aqui, adicionamos índices a `c2` e `c3`, usando, respectivamente, `CREATE INDEX` e `ALTER TABLE`:

```
mysql> CREATE INDEX i1 ON ti(c2);
Query OK, 0 rows affected (2.72 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE ti ADD INDEX i2(c3);
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

`SHOW CREATE TABLE` confirma que os índices foram adicionados.

```
mysql> SHOW CREATE TABLE ti\G
*************************** 1. row ***************************
       Table: ti
Create Table: CREATE TABLE `ti` (
  `c1` int(11) NOT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  `c4` int(11) DEFAULT NULL,
  PRIMARY KEY (`c1`),
  KEY `i1` (`c2`),
  KEY `i2` (`c3`)
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Você pode ver usando **ndb_desc** que as colunas indexadas (texto destacado) agora usam armazenamento em memória em vez de armazenamento em disco:

```
$> ./ndb_desc -d test t1
-- t1 --
Version: 33554433
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 317
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 4
FragmentCount: 4
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-4
-- Attributes --
c1 Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c2 Int NULL AT=FIXED ST=MEMORY
c3 Int NULL AT=FIXED ST=MEMORY
c4 Int NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(c1) - UniqueHashIndex
i2(c3) - OrderedIndex
PRIMARY(c1) - OrderedIndex
i1(c2) - OrderedIndex
```

**Observação de desempenho.** O desempenho de um clúster que utiliza o armazenamento de Dados de disco é muito melhorado se os arquivos de Dados de disco forem mantidos em um disco físico separado do sistema de arquivos do nó de dados. Isso deve ser feito para cada nó de dados no clúster para obter qualquer benefício notável.

Você pode usar caminhos absolutos e relativos do sistema de arquivos com `ADD UNDOFILE` e `ADD DATAFILE`; os caminhos relativos são calculados em relação ao diretório de dados do nó de dados.

Um grupo de arquivos de registro, um espaço de tabelas e quaisquer tabelas de Dados em Disco que utilizem esses objetos devem ser criados em uma ordem específica. Isso também é válido para a remoção desses objetos, sujeito às seguintes restrições:

* Um grupo de arquivo de registro não pode ser excluído enquanto houver quaisquer espaços de tabela que o utilizem.

* Um espaço de tabela não pode ser excluído enquanto contiver quaisquer arquivos de dados.

* Você não pode descartar arquivos de dados de um espaço de tabela enquanto houver quaisquer tabelas que estejam usando o espaço de tabela.

* Não é possível excluir arquivos criados em associação com outro tablespace, exceto aquele com o qual os arquivos foram criados.

Por exemplo, para descartar todos os objetos criados até agora nesta seção, você pode usar as seguintes declarações:

```
mysql> DROP TABLE dt_1;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_2.dat'
    -> ENGINE NDBCLUSTER;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_1.dat'
    -> ENGINE NDBCLUSTER;

mysql> DROP TABLESPACE ts_1
    -> ENGINE NDBCLUSTER;

mysql> DROP LOGFILE GROUP lg_1
    -> ENGINE NDBCLUSTER;
```

Essas declarações devem ser realizadas na ordem mostrada, exceto que as duas declarações `ALTER TABLESPACE ... DROP DATAFILE` podem ser executadas em qualquer ordem.

#### 25.6.11.2 Requisitos de armazenamento de dados de disco do cluster NDB

Os seguintes itens se aplicam aos requisitos de armazenamento de dados em disco:

* Colunas de comprimento variável de tabelas de Dados de disco ocupam um espaço fixo. Para cada linha, isso é igual ao espaço necessário para armazenar o valor maior possível para essa coluna.

Para informações gerais sobre o cálculo desses valores, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipo de Dados”.

Você pode obter uma estimativa do espaço disponível em arquivos de dados e arquivos de registro de desfazer consultando a tabela do esquema de informações `FILES`. Para mais informações e exemplos, consulte a Seção 28.3.15, “A tabela do esquema de informações FILES”.

Nota

A declaração `OPTIMIZE TABLE` não tem qualquer efeito sobre as tabelas de Dados de disco.

* Em uma tabela de dados em disco, os primeiros 256 bytes de uma coluna `TEXT` ou `BLOB` são armazenados na memória; apenas o restante é armazenado em disco.

* Cada linha de uma tabela de Dados de disco usa 8 bytes de memória para apontar para os dados armazenados no disco. Isso significa que, em alguns casos, a conversão de uma coluna em memória para o formato baseado em disco pode resultar na utilização de mais memória. Por exemplo, a conversão de uma coluna `CHAR(4)` de memória para o formato baseado em disco aumenta a quantidade de `DataMemory` usada por linha de 4 para 8 bytes.

Importante

Iniciar o clúster com a opção `--initial` *não* remove os arquivos de dados do disco. Você deve removê-los manualmente antes de realizar uma reinicialização inicial do clúster.

O desempenho das tabelas de dados de disco pode ser melhorado minimizando o número de buscas no disco, garantindo que `DiskPageBufferMemory` tenha tamanho suficiente. Você pode consultar a tabela `diskpagebuffer` para ajudar a determinar se o valor desse parâmetro precisa ser aumentado.

### 25.6.12 Operações online com ALTER TABLE no NDB Cluster

O MySQL NDB Cluster 8.0 suporta mudanças de esquema de tabela online usando `ALTER TABLE ... ALGORITHM=DEFAULT|INPLACE|COPY` e (alter-table.html#alter-table-performance "Performance and Space Requirements"). O NDB Cluster lida com `COPY` e `INPLACE` conforme descrito nos próximos parágrafos.

Para `ALGORITHM=COPY`, o manipulador NDB Cluster do **mysqld** realiza as seguintes ações:

* Diz aos nós de dados que criem uma cópia vazia da tabela e que façam as alterações necessárias no esquema nesta cópia.

* Lê as linhas da tabela original e as escreve na cópia.

* Diz aos nós de dados que descartem a tabela original e, em seguida, renomeiem a cópia.

Às vezes, chamamos isso de "cópia" ou `ALTER TABLE` "offline".

As operações de DML não são permitidas simultaneamente com uma cópia `ALTER TABLE`.

O **mysqld** no qual a declaração de cópia `ALTER TABLE` é emitida assume um bloqueio de metadados, mas isso ocorre apenas nesse **mysqld**. Outros clientes `NDB` podem modificar os dados das linhas durante uma cópia `ALTER TABLE`, resultando em inconsistência.

Para `ALGORITHM=INPLACE`, o manipulador do cluster NDB informa aos nós de dados que devem realizar as alterações necessárias e não realiza nenhuma cópia de dados.

Também nos referimos a isso como uma `ALTER TABLE` "não copiada" ou "online".

Um não-cópia `ALTER TABLE` permite operações DML concorrentes.

`ALGORITHM=INSTANT` não é suportado pelo NDB 8.0.

Independentemente do algoritmo utilizado, o **mysqld** obtém um Bloqueio de Esquema Global (GSL) ao executar **ALTER TABLE**; isso impede a execução de qualquer (outro) DDL ou backups simultaneamente neste ou em qualquer outro nó SQL do clúster. Isso normalmente não é problemático, a menos que o `ALTER TABLE` demore muito tempo.

Nota

Algumas versões mais antigas do NDB Cluster utilizavam uma sintaxe específica para operações online de `ALTER TABLE` `NDB`. Essa sintaxe foi removida desde então.

As operações que adicionam e removem índices em colunas de largura variável das tabelas `NDB` ocorrem online. As operações online não são de cópia; ou seja, não é necessário que os índices sejam recriados. Elas não bloqueiam a tabela que está sendo alterada do acesso por outros nós da API em um NDB Cluster (mas veja as Limitações das operações online do NDB, mais adiante nesta seção). Tais operações não requerem o modo de usuário único para as alterações da tabela `NDB` feitas em um NDB cluster com vários nós da API; as transações podem continuar sem interrupção durante as operações DDL online.

`ALGORITHM=INPLACE` pode ser usado para realizar operações online `ADD COLUMN`, `ADD INDEX` (incluindo declarações `CREATE INDEX`), e `DROP INDEX` em tabelas `NDB`. O renomeamento online de tabelas `NDB` também é suportado (antes do NDB 8.0, tais colunas não podiam ser renomeadas online).

Colunas baseadas em disco não podem ser adicionadas às tabelas `NDB` online. Isso significa que, se você deseja adicionar uma coluna de memória a uma tabela `NDB` que usa uma opção de nível de tabela `STORAGE DISK`, você deve declarar explicitamente que a nova coluna usa armazenamento baseado em memória. Por exemplo, supondo que você já tenha criado o espaço de tabela `ts1`, imagine que você crie a tabela `t1` da seguinte forma:

```
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL PRIMARY KEY,
     >     c2 VARCHAR(30)
     >     )
     >     TABLESPACE ts1 STORAGE DISK
     >     ENGINE NDB;
Query OK, 0 rows affected (1.73 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode adicionar uma nova coluna de memória a esta tabela online, conforme mostrado aqui:

```
mysql> ALTER TABLE t1
     >     ADD COLUMN c3 INT COLUMN_FORMAT DYNAMIC STORAGE MEMORY,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected (1.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Essa declaração falha se a opção `STORAGE MEMORY` for omitida:

```
mysql> ALTER TABLE t1
     >     ADD COLUMN c4 INT COLUMN_FORMAT DYNAMIC,
     >     ALGORITHM=INPLACE;
ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason:
Adding column(s) or add/reorganize partition not supported online. Try
ALGORITHM=COPY.
```

Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato dinâmico da coluna é empregado automaticamente, mas uma advertência é emitida, conforme mostrado aqui:

```
mysql> ALTER ONLINE TABLE t1 ADD COLUMN c4 INT STORAGE MEMORY;
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: DYNAMIC column c4 with STORAGE DISK is not supported, column will
become FIXED


mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) NOT NULL,
  `c2` varchar(30) DEFAULT NULL,
  `c3` int(11) /*!50606 STORAGE MEMORY */ /*!50606 COLUMN_FORMAT DYNAMIC */ DEFAULT NULL,
  `c4` int(11) /*!50606 STORAGE MEMORY */ DEFAULT NULL,
  PRIMARY KEY (`c1`)
) /*!50606 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.03 sec)
```

Nota

As palavras-chave `STORAGE` e `COLUMN_FORMAT` são suportadas apenas no NDB Cluster; em qualquer outra versão do MySQL, tentar usar qualquer uma dessas palavras-chave em uma declaração `CREATE TABLE` ou (create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE` resulta em um erro.

Também é possível usar a declaração `ALTER TABLE ... REORGANIZE PARTITION, ALGORITHM=INPLACE` sem a opção `partition_names INTO (partition_definitions)` nas tabelas `NDB`. Isso pode ser usado para redistribuir os dados do NDB Cluster entre novos nós de dados que foram adicionados ao clúster online. Isso *não* realiza nenhuma desfragmentação, o que requer uma declaração `OPTIMIZE TABLE` ou `ALTER TABLE` nulo. Para mais informações, consulte a Seção 25.6.7, “Adicionando Nodos de Dados do NDB Cluster Online”.

#### Limitações das operações online do NDB

As operações online `DROP COLUMN` não são suportadas.

As declarações online `ALTER TABLE`, `CREATE INDEX` ou `DROP INDEX` que adicionam colunas ou adicionam ou excluem índices estão sujeitas às seguintes limitações:

* Um dado `ALTER TABLE` pode usar apenas um dos `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX`. Uma ou mais colunas podem ser adicionadas online em uma única declaração; apenas um índice pode ser criado ou descartado online em uma única declaração.

* A tabela que está sendo alterada não está bloqueada em relação aos nós da API, exceto pelo que está sendo executado uma operação online `ALTER TABLE`, `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX` (ou uma declaração `CREATE INDEX` ou `DROP INDEX`). No entanto, a tabela está bloqueada contra quaisquer outras operações que tenham origem no *mesmo* nó da API enquanto a operação online está sendo executada.

* A tabela que será alterada deve ter uma chave primária explícita; a chave primária oculta criada pelo mecanismo de armazenamento `NDB` não é suficiente para esse propósito.

* O mecanismo de armazenamento usado pela tabela não pode ser alterado online. * O tablespace usado pela tabela não pode ser alterado online. A partir do NDB 8.0.21, uma declaração como `ALTER TABLE ndb_table ... ALGORITHM=INPLACE, TABLESPACE=new_tablespace`(alter-table.html "15.1.9 ALTER TABLE Statement") é especificamente proibida. (Bug #99269, Bug #31180526)

* Quando usado com tabelas de dados de disco do NDB Cluster, não é possível alterar o tipo de armazenamento (`DISK` ou `MEMORY`) de uma coluna online. Isso significa que, quando você adicionar ou remover um índice de forma que a operação seja realizada online e você queira alterar o tipo de armazenamento da coluna ou colunas, você deve usar `ALGORITHM=COPY` na declaração que adiciona ou remove o índice.

As colunas que serão adicionadas online não podem usar os tipos `BLOB` ou `TEXT` e devem atender aos seguintes critérios:

* As colunas devem ser dinâmicas; ou seja, deve ser possível criá-las usando `COLUMN_FORMAT DYNAMIC`. Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato dinâmico da coluna é empregado automaticamente.

* As colunas devem permitir os valores de `NULL` e não devem ter nenhum valor padrão explícito, exceto `NULL`. As colunas adicionadas online são automaticamente criadas como `DEFAULT NULL`, como pode ser visto aqui:

  ```
  mysql> CREATE TABLE t2 (
       >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
       >     ) ENGINE=NDB;
  Query OK, 0 rows affected (1.44 sec)

  mysql> ALTER TABLE t2
       >     ADD COLUMN c2 INT,
       >     ADD COLUMN c3 INT,
       >     ALGORITHM=INPLACE;
  Query OK, 0 rows affected, 2 warnings (0.93 sec)

  mysql> SHOW CREATE TABLE t1\G
  *************************** 1. row ***************************
         Table: t1
  Create Table: CREATE TABLE `t2` (
    `c1` int(11) NOT NULL AUTO_INCREMENT,
    `c2` int(11) DEFAULT NULL,
    `c3` int(11) DEFAULT NULL,
    PRIMARY KEY (`c1`)
  ) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  1 row in set (0.00 sec)
  ```

* As colunas devem ser adicionadas após quaisquer colunas existentes. Se você tentar adicionar uma coluna online antes de quaisquer colunas existentes ou usando a palavra-chave `FIRST`, a declaração falha com um erro.

* As colunas de tabela existentes não podem ser reordenadas online.

Para operações online de `ALTER TABLE` em tabelas de `NDB`, as colunas de formato fixo são convertidas em dinâmicas quando são adicionadas online, ou quando índices são criados ou excluídos online, conforme mostrado aqui (repetido as declarações `CREATE TABLE` e `ALTER TABLE` apenas para fins de clareza):

```
mysql> CREATE TABLE t2 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (1.44 sec)

mysql> ALTER TABLE t2
     >     ADD COLUMN c2 INT,
     >     ADD COLUMN c3 INT,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected, 2 warnings (0.93 sec)

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
*************************** 2. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c3' to DYNAMIC to enable online ADD COLUMN
2 rows in set (0.00 sec)
```

Apenas as colunas ou colunas que serão adicionadas online devem ser dinâmicas. As colunas existentes não precisam ser; isso inclui a chave primária da tabela, que também pode ser `FIXED`, conforme mostrado aqui:

```
mysql> CREATE TABLE t3 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY COLUMN_FORMAT FIXED
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (2.10 sec)

mysql> ALTER TABLE t3 ADD COLUMN c2 INT, ALGORITHM=INPLACE;
Query OK, 0 rows affected, 1 warning (0.78 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
1 row in set (0.00 sec)
```

As colunas não são convertidas de `FIXED` para o formato de coluna `DYNAMIC` por meio de operações de renomeamento. Para mais informações sobre `COLUMN_FORMAT`, consulte a Seção 15.1.20, “Instrução CREATE TABLE”.

As palavras-chave `KEY`, `CONSTRAINT` e `IGNORE` são suportadas nas declarações `ALTER TABLE` usando `ALGORITHM=INPLACE`.

Definir `MAX_ROWS` para 0 usando uma declaração online `ALTER TABLE` não é permitido. Você deve usar uma cópia `ALTER TABLE` para realizar essa operação. (Bug #21960004)

### 25.6.13 Sincronização de privilégios e NDB_STORED_USER

O NDB 8.0 introduz um novo mecanismo para compartilhar e sincronizar usuários, papéis e privilégios entre nós SQL conectados a um NDB Cluster. Isso pode ser habilitado concedendo o privilégio `NDB_STORED_USER`. Consulte a descrição do privilégio para obter informações sobre o uso.

`NDB_STORED_USER` é impresso na saída de `SHOW GRANTS` como qualquer outro privilégio, conforme mostrado aqui:

```
mysql> SHOW GRANTS for 'jon'@'localhost';
+---------------------------------------------------+
| Grants for jon@localhost                          |
+---------------------------------------------------+
| GRANT USAGE ON *.* TO `jon`@`localhost`           |
| GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost` |
+---------------------------------------------------+
```

Você também pode verificar se os privilégios são compartilhados para essa conta usando o utilitário **ndb_select_all**, fornecido com o NDB Cluster, como este (algum resultado é enrolado para preservar a formatação):

```
$> ndb_select_all -d mysql ndb_sql_metadata | grep '`jon`@`localhost`'
12      "'jon'@'localhost'"     0       [NULL]  "GRANT USAGE ON *.* TO `jon`@`localhost`"
11      "'jon'@'localhost'"     0       2       "CREATE USER `jon`@`localhost`
IDENTIFIED WITH 'caching_sha2_password' AS
0x2441243030352466014340225A107D590E6E653B5D587922306102716D752E6656772F3038512F
6C5072776D30376D37347A384B557A4C564F70495158656A31382E45324E33
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT"
12      "'jon'@'localhost'"     1       [NULL]  "GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost`"
```

`ndb_sql_metadata` é uma tabela especial `NDB` que não é visível usando o **mysql** ou outro cliente MySQL.

Uma declaração que concede o privilégio `NDB_STORED_USER`, como `GRANT NDB_STORED_USER ON *.* TO 'cluster_app_user'@'localhost'`, funciona direcionando o `NDB` para criar um instantâneo usando as consultas `SHOW CREATE USER cluster_app_user@localhost` e `SHOW GRANTS FOR cluster_app_user@localhost`, e, em seguida, armazenando os resultados em `ndb_sql_metadata`. Qualquer outro nó SQL é então solicitado para ler e aplicar o instantâneo. Sempre que um servidor MySQL é iniciado e se junta ao clúster como um nó SQL, ele executa essas declarações armazenadas `CREATE USER` e `GRANT` como parte do processo de sincronização do esquema do clúster.

Sempre que uma instrução SQL é executada em um nó SQL que não é o mesmo onde ela foi originada, a instrução é executada em um fio de utilidade do mecanismo de armazenamento `NDBCLUSTER`; isso é feito dentro de um ambiente de segurança equivalente ao do fio do aplicável de réplica de replica MySQL.

A partir do NDB 8.0.27, um nó SQL que realiza uma alteração nos privilégios do usuário obtém um bloqueio global antes de fazer isso, o que previne deadlocks por operações ACL concorrentes em diferentes nós SQL. Antes do NDB 8.0.27, as alterações nos usuários com `NDB_STORED_USER` eram atualizadas de forma completamente assíncrona, sem qualquer bloqueio sendo realizado.

Deve-se ter em mente que, como as operações de mudança de esquema compartilhado são realizadas de forma síncrona, a próxima mudança de esquema compartilhado após uma alteração em qualquer usuário ou usuários compartilhados serve como um ponto de sincronização. Quaisquer alterações de usuário pendentes são concluídas antes que a distribuição da mudança de esquema possa começar; após isso, a própria mudança de esquema é realizada de forma síncrona. Por exemplo, se uma declaração `DROP DATABASE` segue uma declaração `DROP USER` de um usuário distribuído, a eliminação do banco de dados não pode ocorrer até que a eliminação do usuário tenha sido concluída em todos os nós SQL.

Caso múltiplos `GRANT`, `REVOKE` ou outros registros de administração de usuários de vários nós SQL causem que os privilégios de um usuário específico se desviem em diferentes nós SQL, você pode resolver esse problema emitindo `GRANT NDB_STORED_USER` para esse usuário em um nó SQL onde os privilégios são conhecidos como corretos; isso faz com que um novo instantâneo dos privilégios seja tomado e sincronizado com os outros nós SQL.

O NDB Cluster 8.0 não suporta a distribuição de usuários e privilégios do MySQL em nós SQL em um NDB Cluster alterando as tabelas de privilégios do MySQL de modo que elas utilizem o mecanismo de armazenamento `NDB` como no NDB 7.6 e versões anteriores (consulte Privilegios Distribuídos Usando Tabelas de Concessão Compartilhada). Para informações sobre o impacto dessa alteração em atualizações do NDB 8.0 a partir de uma versão anterior, consulte a Seção 25.3.7, “Atualização e Desatualização do NDB Cluster”.

### 25.6.14 Encriptação do sistema de arquivos para NDB Cluster

As seções a seguir fornecem informações sobre o sistema de criptografia de arquivos de nó de dados `NDB`, conforme implementado no NDB 8.0.31 e versões posteriores.

#### 25.6.14.1 Configuração e uso da criptografia do sistema de arquivos NDB

*Encriptação do sistema de arquivos*: Para habilitar a encriptação de um sistema de arquivos que não estava previamente encriptado, são necessários os seguintes passos:

1. Defina os parâmetros do nó de dados necessários na seção `[ndbd default]` do arquivo `config.ini`, conforme mostrado aqui:

   ```
   [ndbd default]
   EncryptedFileSystem= 1
   ```

Esses parâmetros devem ser configurados conforme mostrado em todos os nós de dados.

2. Inicie o servidor de gerenciamento com `--initial` ou `--reload` para fazer com que ele leia o arquivo de configuração atualizado.

3. Realize um início inicial (ou reinício) contínuo de todos os nós de dados (consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”): Inicie cada processo de nó de dados com `--initial`; além disso, forneça uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`, além de uma senha, a cada processo de nó de dados. Quando você fornece a senha na linha de comando, uma mensagem de aviso é exibida, semelhante a esta:

   ```
   > ndbmtd -c 127.0.0.1 --filesystem-password=ndbsecret
   ndbmtd: [Warning] Using a password on the command line interface can be insecure.
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel allocated nodeid: 5
   ```

`--filesystem-password` pode aceitar a senha de um arquivo, `tty`, ou `stdin`; `--filesystem-password-from-stdin` aceita a senha de `stdin` apenas. Este último protege a senha da exposição na linha de comando do processo ou no sistema de arquivos, e permite a possibilidade de passá-la de outra aplicação segura.

Você também pode colocar a senha em um arquivo `my.cnf` que pode ser lido pelo processo do nó de dados, mas não por outros usuários do sistema. Usando a mesma senha do exemplo anterior, a parte relevante do arquivo deve parecer assim:

   ```
   [ndbd]

   filesystem-password=ndbsecret
   ```

Você também pode solicitar que o usuário que inicia o processo do nó de dados forneça a senha de criptografia ao fazer isso, usando a opção `--filesystem-password-from-stdin` no arquivo `my.cnf`, assim:

   ```
   [ndbd]

   filesystem-password-from-stdin
   ```

Neste caso, o usuário é solicitado a digitar a senha ao iniciar o processo do nó de dados, conforme mostrado aqui:

   ```
   > ndbmtd -c 127.0.0.1
   Enter filesystem password: *********
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel allocated nodeid: 5
   >
   ```

Independentemente do método utilizado, o formato da senha de criptografia é o mesmo utilizado para senhas de backups criptografados (ver Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”); a senha deve ser fornecida ao iniciar cada processo do nó de dados; caso contrário, o processo do nó de dados não pode ser iniciado. Isso é indicado pela seguinte mensagem no log do nó de dados:

   ```
   > tail -n2 ndb_5_out.log
   2022-08-22 16:08:30 [ndbd] INFO     -- Data node configured to have encryption but password not provided
   2022-08-22 16:08:31 [ndbd] ALERT    -- Node 5: Forced node shutdown completed. Occurred during startphase 0.
   ```

Quando reiniciado como descrito acima, cada nó de dados limpa seu estado no disco e o reconstrui em forma criptografada.

*Rotacionar a senha do sistema de arquivos*: Para atualizar a senha de criptografia usada pelos nós de dados, realize um reinício inicial rotativo dos nós de dados, fornecendo a nova senha a cada nó de dados ao reiniciá-lo usando `--filesystem-password` ou `--filesystem-password-from-stdin`.

*Descritpção do sistema de arquivos*: Para remover a criptografia de um sistema de arquivos criptografado, faça o seguinte:

1. Na seção `[ndbd default]` do arquivo `config.ini`, defina `EncryptedFileSystem = OFF`.

2. Reinicie o servidor de gerenciamento com `--initial` ou `--reload`.

3. Realize um reinício inicial em rolagem dos nós de dados. Não use nenhuma opção relacionada a senhas ao reiniciar os binários do nó.

Quando reiniciado, cada nó de dados limpa seu estado no disco e o reconstrui em forma não criptografada.

Para verificar se a criptografia do sistema de arquivos está configurada corretamente, você pode usar uma consulta nas tabelas `ndbinfo` `config_values` e `config_params` semelhante a esta:

```
mysql> SELECT v.node_id AS Node, p.param_name AS Parameter, v.config_value AS Value
    ->    FROM ndbinfo.config_values v
    ->  JOIN ndbinfo.config_params p
    ->    ON v.config_param=p.param_number
    ->  WHERE p.param_name='EncryptedFileSystem';
+------+----------------------+-------+
| Node | Parameter            | Value |
+------+----------------------+-------+
|    5 | EncryptedFileSystem  | 1     |
|    6 | EncryptedFileSystem  | 1     |
|    7 | EncryptedFileSystem  | 1     |
|    8 | EncryptedFileSystem  | 1     |
+------+----------------------+-------+
4 rows in set (0.10 sec)
```

Aqui, `EncryptedFileSystem` é igual a `1` em todos os nós de dados, o que significa que a criptografia do sistema de arquivos está habilitada para este clúster.

#### 25.6.14.2 Implementação de criptografia do sistema de arquivos NDB

Para `NDB` Encriptação de Dados Transparente (TDE), os nós de dados encriptam os dados dos usuários em repouso, com segurança fornecida por uma senha (senha do sistema de arquivos), que é usada para encriptar e descriptografar um arquivo de segredos em cada nó de dados. O arquivo de segredos contém uma Chave Mestre de Nó (NMK), uma chave usada mais tarde para encriptar os diferentes tipos de arquivos usados para persistência. `NDB` A TDE encripta arquivos de dados dos usuários, incluindo arquivos LCP, arquivos de log de correção, arquivos de espaço de tabela e arquivos de log de desfazer.

Você pode usar o utilitário **ndbxfrm** para verificar se um arquivo está criptografado, conforme mostrado aqui:

```
> ndbxfrm -i ndb_5_fs/LCP/0/T2F0.Data
File=ndb_5_fs/LCP/0/T2F0.Data, compression=no, encryption=yes
> ndbxfrm -i ndb_6_fs/LCP/0/T2F0.Data
File=ndb_6_fs/LCP/0/T2F0.Data, compression=no, encryption=no
```

A partir do NDB 8.0.31, é possível obter a chave do arquivo de segredos usando o programa **ndb_secretsfile_reader** adicionado nessa versão, da seguinte forma:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

A hierarquia de chave por nó pode ser representada da seguinte forma:

* Uma senha fornecida pelo usuário (P) é processada por uma função de derivação de chave usando um sal aleatório para gerar uma chave de fase única (PK).

* O PK (único para cada nó) criptografa os dados em cada nó em seu próprio arquivo de segredos.

* Os dados no arquivo de segredos incluem uma Chave Mestre de Nó (NMK) única e gerada aleatoriamente.

* O NMK criptografa (usando enrolamento) um ou mais valores de chave de criptografia de dados gerados aleatoriamente (DEK) no cabeçalho de cada arquivo criptografado (incluindo arquivos LCP e TS, e registros de refazer e desfazer).

* Os valores das chaves de criptografia de dados (DEK0, ..., DEKn) são usados para criptografar [subconjuntos de] dados em cada arquivo.

A senha criptografa indiretamente o arquivo de segredos que contém o NMK aleatório, que criptografa uma porção do cabeçalho de cada arquivo criptografado no nó. O cabeçalho do arquivo criptografado contém chaves de dados aleatórios usadas para os dados nesse arquivo.

A criptografia é implementada de forma transparente pela camada `NDBFS` nos nós de dados. Os blocos internos de clientes `NDBFS` operam com seus arquivos como de costume; `NDBFS` envolve o arquivo físico com informações de cabeçalho e rodapé extras que suportam a criptografia, e criptografa e descriptografa os dados conforme eles são lidos e escritos no arquivo. O formato de arquivo envolvido é referido como `ndbxfrm1`.

A senha do nó é processada com PBKDF2 e o sal aleatório para criptografar o arquivo de segredos, que contém o NMK gerado aleatoriamente, que é usado para criptografar a chave de criptografia de dados gerada aleatoriamente em cada arquivo criptografado.

O trabalho de criptografia e descriptografia é realizado nas threads de E/S do NDBFS (e não em threads de execução de sinal, como main, tc, ldm ou rep). Isso é semelhante ao que acontece com LCPs comprimidos e backups comprimidos, e normalmente resulta em aumento do uso do CPU das threads de E/S; você pode querer ajustar `ThreadConfig` (se estiver em uso) em relação às threads de E/S.

#### 25.6.14.3 Limitações de criptografia do sistema de arquivos NDB

A criptografia de dados transparente no NDB Cluster está sujeita às seguintes restrições e limitações:

* A senha do sistema de arquivos deve ser fornecida a cada nó de dados individual.

* A rotação da senha do sistema de arquivos requer um reinício inicial dos nós de dados; isso deve ser feito manualmente ou por uma aplicação externa a `NDB`).

* Para um grupo com apenas uma única replica (`NoOfReplicas = 1`), é necessário fazer um backup completo e restaurar a senha do sistema de arquivos.

* A rotação de todas as chaves de criptografia de dados requer um reinício inicial do nó.

**NDB TDE e Replicação NDB.** O uso de um sistema de arquivos criptografado não afeta a Replicação NDB. Todos os seguintes cenários são suportados:

* Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não é criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos é criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

* Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.

### 25.6.15 Contadores e variáveis de estatísticas da API do BND

Existem vários tipos de contadores estatísticos relacionados às ações realizadas por ou que afetam os objetos de `Ndb`. Essas ações incluem o início e o encerramento (ou interrupção) de transações; operações de chave primária e chave única; varreduras de tabela, intervalo e poda; threads bloqueadas enquanto aguardam a conclusão de várias operações; e dados e eventos enviados e recebidos por `NDBCLUSTER`. Os contadores são incrementados dentro do kernel NDB sempre que chamadas da API NDB são feitas ou dados são enviados ou recebidos pelos nós de dados. O **mysqld** expõe esses contadores como variáveis de status do sistema; seus valores podem ser lidos na saída de `SHOW STATUS`, ou consultando a tabela do Schema de Desempenho `session_status` ou `global_status`. Ao comparar os valores antes e depois das declarações que operam em tabelas de `NDB`, você pode observar as ações correspondentes realizadas no nível da API, e, assim, o custo de realizar a declaração.

Você pode listar todas essas variáveis de status usando a seguinte declaração `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'ndb_api%';
+----------------------------------------------+-----------+
| Variable_name                                | Value     |
+----------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count             | 297       |
| Ndb_api_wait_scan_result_count               | 0         |
| Ndb_api_wait_meta_request_count              | 321       |
| Ndb_api_wait_nanos_count                     | 228438645 |
| Ndb_api_bytes_sent_count                     | 33988     |
| Ndb_api_bytes_received_count                 | 66236     |
| Ndb_api_trans_start_count                    | 148       |
| Ndb_api_trans_commit_count                   | 148       |
| Ndb_api_trans_abort_count                    | 0         |
| Ndb_api_trans_close_count                    | 148       |
| Ndb_api_pk_op_count                          | 151       |
| Ndb_api_uk_op_count                          | 0         |
| Ndb_api_table_scan_count                     | 0         |
| Ndb_api_range_scan_count                     | 0         |
| Ndb_api_pruned_scan_count                    | 0         |
| Ndb_api_scan_batch_count                     | 0         |
| Ndb_api_read_row_count                       | 147       |
| Ndb_api_trans_local_read_row_count           | 37        |
| Ndb_api_adaptive_send_forced_count           | 3         |
| Ndb_api_adaptive_send_unforced_count         | 294       |
| Ndb_api_adaptive_send_deferred_count         | 0         |
| Ndb_api_event_data_count                     | 0         |
| Ndb_api_event_nondata_count                  | 0         |
| Ndb_api_event_bytes_count                    | 0         |
| Ndb_api_wait_exec_complete_count_slave       | 0         |
| Ndb_api_wait_scan_result_count_slave         | 0         |
| Ndb_api_wait_meta_request_count_slave        | 0         |
| Ndb_api_wait_nanos_count_slave               | 0         |
| Ndb_api_bytes_sent_count_slave               | 0         |
| Ndb_api_bytes_received_count_slave           | 0         |
| Ndb_api_trans_start_count_slave              | 0         |
| Ndb_api_trans_commit_count_slave             | 0         |
| Ndb_api_trans_abort_count_slave              | 0         |
| Ndb_api_trans_close_count_slave              | 0         |
| Ndb_api_pk_op_count_slave                    | 0         |
| Ndb_api_uk_op_count_slave                    | 0         |
| Ndb_api_table_scan_count_slave               | 0         |
| Ndb_api_range_scan_count_slave               | 0         |
| Ndb_api_pruned_scan_count_slave              | 0         |
| Ndb_api_scan_batch_count_slave               | 0         |
| Ndb_api_read_row_count_slave                 | 0         |
| Ndb_api_trans_local_read_row_count_slave     | 0         |
| Ndb_api_adaptive_send_forced_count_slave     | 0         |
| Ndb_api_adaptive_send_unforced_count_slave   | 0         |
| Ndb_api_adaptive_send_deferred_count_slave   | 0         |
| Ndb_api_wait_exec_complete_count_replica     | 0         |
| Ndb_api_wait_scan_result_count_replica       | 0         |
| Ndb_api_wait_meta_request_count_replica      | 0         |
| Ndb_api_wait_nanos_count_replica             | 0         |
| Ndb_api_bytes_sent_count_replica             | 0         |
| Ndb_api_bytes_received_count_replica         | 0         |
| Ndb_api_trans_start_count_replica            | 0         |
| Ndb_api_trans_commit_count_replica           | 0         |
| Ndb_api_trans_abort_count_replica            | 0         |
| Ndb_api_trans_close_count_replica            | 0         |
| Ndb_api_pk_op_count_replica                  | 0         |
| Ndb_api_uk_op_count_replica                  | 0         |
| Ndb_api_table_scan_count_replica             | 0         |
| Ndb_api_range_scan_count_replica             | 0         |
| Ndb_api_pruned_scan_count_replica            | 0         |
| Ndb_api_scan_batch_count_replica             | 0         |
| Ndb_api_read_row_count_replica               | 0         |
| Ndb_api_trans_local_read_row_count_replica   | 0         |
| Ndb_api_adaptive_send_forced_count_replica   | 0         |
| Ndb_api_adaptive_send_unforced_count_replica | 0         |
| Ndb_api_adaptive_send_deferred_count_replica | 0         |
| Ndb_api_event_data_count_injector            | 0         |
| Ndb_api_event_nondata_count_injector         | 0         |
| Ndb_api_event_bytes_count_injector           | 0         |
| Ndb_api_wait_exec_complete_count_session     | 0         |
| Ndb_api_wait_scan_result_count_session       | 0         |
| Ndb_api_wait_meta_request_count_session      | 0         |
| Ndb_api_wait_nanos_count_session             | 0         |
| Ndb_api_bytes_sent_count_session             | 0         |
| Ndb_api_bytes_received_count_session         | 0         |
| Ndb_api_trans_start_count_session            | 0         |
| Ndb_api_trans_commit_count_session           | 0         |
| Ndb_api_trans_abort_count_session            | 0         |
| Ndb_api_trans_close_count_session            | 0         |
| Ndb_api_pk_op_count_session                  | 0         |
| Ndb_api_uk_op_count_session                  | 0         |
| Ndb_api_table_scan_count_session             | 0         |
| Ndb_api_range_scan_count_session             | 0         |
| Ndb_api_pruned_scan_count_session            | 0         |
| Ndb_api_scan_batch_count_session             | 0         |
| Ndb_api_read_row_count_session               | 0         |
| Ndb_api_trans_local_read_row_count_session   | 0         |
| Ndb_api_adaptive_send_forced_count_session   | 0         |
| Ndb_api_adaptive_send_unforced_count_session | 0         |
| Ndb_api_adaptive_send_deferred_count_session | 0         |
+----------------------------------------------+-----------+
90 rows in set (0.01 sec)
```

Essas variáveis de status também estão disponíveis nas tabelas do Schema de desempenho `session_status` e `global_status`, conforme mostrado aqui:

```
mysql> SELECT * FROM performance_schema.session_status
    ->   WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 617            |
| Ndb_api_wait_scan_result_count               | 0              |
| Ndb_api_wait_meta_request_count              | 649            |
| Ndb_api_wait_nanos_count                     | 335663491      |
| Ndb_api_bytes_sent_count                     | 65764          |
| Ndb_api_bytes_received_count                 | 86940          |
| Ndb_api_trans_start_count                    | 308            |
| Ndb_api_trans_commit_count                   | 308            |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 308            |
| Ndb_api_pk_op_count                          | 311            |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 0              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 307            |
| Ndb_api_trans_local_read_row_count           | 77             |
| Ndb_api_adaptive_send_forced_count           | 3              |
| Ndb_api_adaptive_send_unforced_count         | 614            |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_wait_exec_complete_count_replica     | 0              |
| Ndb_api_wait_scan_result_count_replica       | 0              |
| Ndb_api_wait_meta_request_count_replica      | 0              |
| Ndb_api_wait_nanos_count_replica             | 0              |
| Ndb_api_bytes_sent_count_replica             | 0              |
| Ndb_api_bytes_received_count_replica         | 0              |
| Ndb_api_trans_start_count_replica            | 0              |
| Ndb_api_trans_commit_count_replica           | 0              |
| Ndb_api_trans_abort_count_replica            | 0              |
| Ndb_api_trans_close_count_replica            | 0              |
| Ndb_api_pk_op_count_replica                  | 0              |
| Ndb_api_uk_op_count_replica                  | 0              |
| Ndb_api_table_scan_count_replica             | 0              |
| Ndb_api_range_scan_count_replica             | 0              |
| Ndb_api_pruned_scan_count_replica            | 0              |
| Ndb_api_scan_batch_count_replica             | 0              |
| Ndb_api_read_row_count_replica               | 0              |
| Ndb_api_trans_local_read_row_count_replica   | 0              |
| Ndb_api_adaptive_send_forced_count_replica   | 0              |
| Ndb_api_adaptive_send_unforced_count_replica | 0              |
| Ndb_api_adaptive_send_deferred_count_replica | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
90 rows in set (0.01 sec)

mysql> SELECT * FROM performance_schema.global_status
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 741            |
| Ndb_api_wait_scan_result_count               | 0              |
| Ndb_api_wait_meta_request_count              | 777            |
| Ndb_api_wait_nanos_count                     | 373888309      |
| Ndb_api_bytes_sent_count                     | 78124          |
| Ndb_api_bytes_received_count                 | 94988          |
| Ndb_api_trans_start_count                    | 370            |
| Ndb_api_trans_commit_count                   | 370            |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 370            |
| Ndb_api_pk_op_count                          | 373            |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 0              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 369            |
| Ndb_api_trans_local_read_row_count           | 93             |
| Ndb_api_adaptive_send_forced_count           | 3              |
| Ndb_api_adaptive_send_unforced_count         | 738            |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_wait_exec_complete_count_replica     | 0              |
| Ndb_api_wait_scan_result_count_replica       | 0              |
| Ndb_api_wait_meta_request_count_replica      | 0              |
| Ndb_api_wait_nanos_count_replica             | 0              |
| Ndb_api_bytes_sent_count_replica             | 0              |
| Ndb_api_bytes_received_count_replica         | 0              |
| Ndb_api_trans_start_count_replica            | 0              |
| Ndb_api_trans_commit_count_replica           | 0              |
| Ndb_api_trans_abort_count_replica            | 0              |
| Ndb_api_trans_close_count_replica            | 0              |
| Ndb_api_pk_op_count_replica                  | 0              |
| Ndb_api_uk_op_count_replica                  | 0              |
| Ndb_api_table_scan_count_replica             | 0              |
| Ndb_api_range_scan_count_replica             | 0              |
| Ndb_api_pruned_scan_count_replica            | 0              |
| Ndb_api_scan_batch_count_replica             | 0              |
| Ndb_api_read_row_count_replica               | 0              |
| Ndb_api_trans_local_read_row_count_replica   | 0              |
| Ndb_api_adaptive_send_forced_count_replica   | 0              |
| Ndb_api_adaptive_send_unforced_count_replica | 0              |
| Ndb_api_adaptive_send_deferred_count_replica | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
90 rows in set (0.01 sec)
```

Cada objeto `Ndb` tem seus próprios contadores. As aplicações da API NDB podem ler os valores dos contadores para uso na otimização ou monitoramento. Para clientes multithread que usam mais de um objeto `Ndb` simultaneamente, também é possível obter uma visão resumida dos contadores de todos os objetos `Ndb` que pertencem a um `Ndb_cluster_connection` dado.

Quatro conjuntos desses contadores estão expostos. Um conjunto se aplica apenas à sessão atual; os outros 3 são globais. *Isso ocorre apesar do fato de que seus valores podem ser obtidos como variáveis de status de sessão ou global no cliente **mysql*. Isso significa que especificar a palavra-chave `SESSION` ou `GLOBAL` com `SHOW STATUS` não tem efeito nos valores reportados para as variáveis de status de estatísticas da API NDB, e o valor de cada uma dessas variáveis é o mesmo, independentemente do valor ser obtido da coluna equivalente da tabela `session_status` ou `global_status`.

*Contadores de sessão (específicos para sessão)*

Os contadores de sessão estão relacionados aos objetos `Ndb` utilizados (apenas) pela sessão atual. O uso desses objetos por outros clientes do MySQL não influencia esses contagem.

Para minimizar a confusão com as variáveis de sessão padrão do MySQL, referenciamos as variáveis que correspondem a esses contadores de sessão da API NDB como “`_session` variáveis”, com um underscore no início.

*Contas de réplica (global)*

Este conjunto de contagem está relacionado aos objetos `Ndb` usados pelo fio de replicação SQL, se houver. Se este **mysqld** não atuar como uma replica ou não usar as tabelas `NDB`, então todos esses contagem são 0.

Referimos às variáveis de status relacionadas como “`_slave`” (com uma sublinhadura no início).

*Contatores de injetor (global)

Os contadores de injetores estão relacionados ao objeto `Ndb` usado para ouvir eventos de cluster pelo thread do injetor de registro binário. Mesmo quando não está escrevendo um registro binário, os **mysqld** que estão conectados a um NDB Cluster continuam a ouvir alguns eventos, como mudanças de esquema.

Nos referimos às variáveis de status que correspondem aos contadores do injetor da API NDB como “`_injector` variáveis” (com uma sublinhadura no início).

* Contadores de servidor (Global) (global)

Este conjunto de contadores está relacionado a todos os objetos `Ndb` atualmente utilizados por este **mysqld**. Isso inclui todas as aplicações de cliente MySQL, o fio de replicação SQL (se houver), o injetor de log binário e o fio de utilitário `NDB`.

Referimos às variáveis de status que correspondem a esses contadores como "variáveis globais" ou "variáveis de nível **mysqld**".

Você pode obter valores para um conjunto específico de variáveis filtrando adicionalmente a substring `session`, `slave` ou `injector` no nome da variável (junto com o prefixo comum `Ndb_api`). Para as variáveis `_session`, isso pode ser feito conforme mostrado aqui:

```
mysql> SHOW STATUS LIKE 'ndb_api%session';
+--------------------------------------------+---------+
| Variable_name                              | Value   |
+--------------------------------------------+---------+
| Ndb_api_wait_exec_complete_count_session   | 2       |
| Ndb_api_wait_scan_result_count_session     | 0       |
| Ndb_api_wait_meta_request_count_session    | 1       |
| Ndb_api_wait_nanos_count_session           | 8144375 |
| Ndb_api_bytes_sent_count_session           | 68      |
| Ndb_api_bytes_received_count_session       | 84      |
| Ndb_api_trans_start_count_session          | 1       |
| Ndb_api_trans_commit_count_session         | 1       |
| Ndb_api_trans_abort_count_session          | 0       |
| Ndb_api_trans_close_count_session          | 1       |
| Ndb_api_pk_op_count_session                | 1       |
| Ndb_api_uk_op_count_session                | 0       |
| Ndb_api_table_scan_count_session           | 0       |
| Ndb_api_range_scan_count_session           | 0       |
| Ndb_api_pruned_scan_count_session          | 0       |
| Ndb_api_scan_batch_count_session           | 0       |
| Ndb_api_read_row_count_session             | 1       |
| Ndb_api_trans_local_read_row_count_session | 1       |
+--------------------------------------------+---------+
18 rows in set (0.50 sec)
```

Para obter uma lista das variáveis de status do nível NDB API **mysqld**, filtre por nomes de variáveis que comecem com `ndb_api` e terminem em `_count`, como este:

```
mysql> SELECT * FROM performance_schema.session_status
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%count';
+------------------------------------+----------------+
| VARIABLE_NAME                      | VARIABLE_VALUE |
+------------------------------------+----------------+
| NDB_API_WAIT_EXEC_COMPLETE_COUNT   | 4              |
| NDB_API_WAIT_SCAN_RESULT_COUNT     | 3              |
| NDB_API_WAIT_META_REQUEST_COUNT    | 28             |
| NDB_API_WAIT_NANOS_COUNT           | 53756398       |
| NDB_API_BYTES_SENT_COUNT           | 1060           |
| NDB_API_BYTES_RECEIVED_COUNT       | 9724           |
| NDB_API_TRANS_START_COUNT          | 3              |
| NDB_API_TRANS_COMMIT_COUNT         | 2              |
| NDB_API_TRANS_ABORT_COUNT          | 0              |
| NDB_API_TRANS_CLOSE_COUNT          | 3              |
| NDB_API_PK_OP_COUNT                | 2              |
| NDB_API_UK_OP_COUNT                | 0              |
| NDB_API_TABLE_SCAN_COUNT           | 1              |
| NDB_API_RANGE_SCAN_COUNT           | 0              |
| NDB_API_PRUNED_SCAN_COUNT          | 0              |
| NDB_API_SCAN_BATCH_COUNT           | 0              |
| NDB_API_READ_ROW_COUNT             | 2              |
| NDB_API_TRANS_LOCAL_READ_ROW_COUNT | 2              |
| NDB_API_EVENT_DATA_COUNT           | 0              |
| NDB_API_EVENT_NONDATA_COUNT        | 0              |
| NDB_API_EVENT_BYTES_COUNT          | 0              |
+------------------------------------+----------------+
21 rows in set (0.09 sec)
```

Nem todos os contadores são refletidos em todos os 4 conjuntos de variáveis de status. Para os contadores de evento `DataEventsRecvdCount`, `NondataEventsRecvdCount` e `EventBytesRecvdCount`, apenas as variáveis de status da API NDB do nível `_injector` e **mysqld** estão disponíveis:

```
mysql> SHOW STATUS LIKE 'ndb_api%event%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
| Ndb_api_event_data_count             | 0     |
| Ndb_api_event_nondata_count          | 0     |
| Ndb_api_event_bytes_count            | 0     |
+--------------------------------------+-------+
6 rows in set (0.00 sec)
```

As variáveis de status `_injector` não são implementadas para quaisquer outros contadores da API NDB, conforme mostrado aqui:

```
mysql> SHOW STATUS LIKE 'ndb_api%injector%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
+--------------------------------------+-------+
3 rows in set (0.00 sec)
```

Os nomes das variáveis de status podem ser facilmente associados aos nomes dos respectivos contadores correspondentes. Cada contador de estatísticas da API NDB está listado na tabela a seguir, com uma descrição, bem como os nomes de quaisquer variáveis de status do servidor MySQL correspondentes a este contador.

**Tabela 25.67 Contadores de estatísticas da API do NDB**

<table><col style="width: 30%"/><col style="width: 35%"/><col style="width: 40%"/><thead><tr> <th scope="col">Nome do caixa</th> <th scope="col">Descrição</th> <th scope="col">Variáveis de status (por tipo estatístico):<div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Sessão</p></li><li class="listitem"><p>Escravo (replica)</p></li><li class="listitem"><p>Injetor</p></li><li class="listitem"><p>Servidor</p></li></ul> </div> </th> </tr></thead><tbody><tr> <th scope="row"><code>WaitExecCompleteCount</code></th> <td>Número de vezes que o fio foi bloqueado enquanto aguardava a execução de uma operação para ser concluída. Inclui todos<code>execute()</code>chamadas, bem como execuções implícitas para operações de blob e auto-incremento não visíveis para os clientes.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>WaitScanResultCount</code></th> <td>Número de vezes que o fio foi bloqueado enquanto aguardava um sinal baseado em varredura, como aguardar resultados adicionais ou para que a varredura seja concluída.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>WaitMetaRequestCount</code></th> <td>Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados; isso pode ocorrer quando está esperando uma operação de DDL ou para que uma época seja iniciada (ou encerrada).</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>WaitNanosCount</code></th> <td>Tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_nanos_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_nanos_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_wait_nanos_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>BytesSentCount</code></th> <td>Quantidade de dados (em bytes) enviados para os nós de dados</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_bytes_sent_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_bytes_sent_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_bytes_sent_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>BytesRecvdCount</code></th> <td>Quantidade de dados (em bytes) recebidos dos nós de dados</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_bytes_received_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_bytes_received_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_bytes_received_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TransStartCount</code></th> <td>Número de transações iniciadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_start_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_start_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_trans_start_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TransCommitCount</code></th> <td>Número de transações realizadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_commit_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_commit_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_trans_commit_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TransAbortCount</code></th> <td>Número de transações abortadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_abort_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_abort_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_trans_abort_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TransCloseCount</code></th> <td>Número de transações abortadas. (Esse valor pode ser maior que a soma<code>TransCommitCount</code>e<code>TransAbortCount</code>.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_close_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_close_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_trans_close_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>PkOpCount</code></th> <td>Número de operações com base em ou que utilizam chaves primárias. Esse contagem inclui operações de tabela blob-part, operações de desbloqueio implícitas e operações de auto-incremento, além das operações de chave primária normalmente visíveis aos clientes do MySQL.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_pk_op_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_pk_op_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_pk_op_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>UkOpCount</code></th> <td>Número de operações baseadas em ou que utilizam chaves únicas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_uk_op_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_uk_op_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_uk_op_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TableScanCount</code></th> <td>Número de varreduras de tabela que foram iniciadas. Isso inclui varreduras de tabelas internas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_table_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_table_scan_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_table_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>RangeScanCount</code></th> <td>Número de varreduras de alcance que foram iniciadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_range_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_range_scan_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_range_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>PrunedScanCount</code></th> <td>Número de varreduras que foram reduzidas a uma única partição.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_pruned_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_pruned_scan_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_pruned_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>ScanBatchCount</code></th> <td>Número de lotes de linhas recebidos. (Um lote, neste contexto, é um conjunto de resultados de varredura de um único fragmento.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_scan_batch_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_scan_batch_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_scan_batch_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>ReadRowCount</code></th> <td>Número total de linhas que foram lidas. Inclui linhas lidas usando chave primária, chave única e operações de varredura.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_read_row_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_read_row_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_read_row_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>TransLocalReadRowCount</code></th> <td>Número de linhas lidas a partir do mesmo nó de dados no qual a transação estava sendo executada.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count_slave</code> </p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>DataEventsRecvdCount</code></th> <td>Número de eventos de mudança de linha recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_event_data_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_data_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>NondataEventsRecvdCount</code></th> <td>Número de eventos recebidos, exceto eventos de mudança de linha.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_event_nondata_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_nondata_count</code> </p></li></ul> </div> </td> </tr><tr> <th scope="row"><code>EventBytesRecvdCount</code></th> <td>Número de bytes de eventos recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p>[nenhum]</p></li><li class="listitem"><p> <code>Ndb_api_event_bytes_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_bytes_count</code> </p></li></ul> </div> </td> </tr></tbody></table>

Para ver todas as contagens de transações comprometidas, ou seja, todas as variáveis de status do contador `TransCommitCount`, você pode filtrar os resultados de `SHOW STATUS` para a subcadeia `trans_commit_count`, da seguinte forma:

```
mysql> SHOW STATUS LIKE '%trans_commit_count%';
+------------------------------------+-------+
| Variable_name                      | Value |
+------------------------------------+-------+
| Ndb_api_trans_commit_count_session | 1     |
| Ndb_api_trans_commit_count_slave   | 0     |
| Ndb_api_trans_commit_count         | 2     |
+------------------------------------+-------+
3 rows in set (0.00 sec)
```

A partir disso, você pode determinar que 1 transação foi comprometida na sessão atual do cliente **mysql** e 2 transações foram comprometidas neste **mysqld** desde que foi reiniciado pela última vez.

Você pode ver como vários contadores da API NDB são incrementados por uma determinada declaração SQL, comparando os valores das variáveis de status correspondentes `_session` imediatamente antes e depois de realizar a declaração. Neste exemplo, após obter os valores iniciais de `SHOW STATUS`(show-status.html "15.7.7.37 SHOW STATUS Statement"), criamos no banco de dados `test` uma tabela `NDB`, denominada `t`, que tem uma única coluna:

```
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+--------+
| Variable_name                              | Value  |
+--------------------------------------------+--------+
| Ndb_api_wait_exec_complete_count_session   | 2      |
| Ndb_api_wait_scan_result_count_session     | 0      |
| Ndb_api_wait_meta_request_count_session    | 3      |
| Ndb_api_wait_nanos_count_session           | 820705 |
| Ndb_api_bytes_sent_count_session           | 132    |
| Ndb_api_bytes_received_count_session       | 372    |
| Ndb_api_trans_start_count_session          | 1      |
| Ndb_api_trans_commit_count_session         | 1      |
| Ndb_api_trans_abort_count_session          | 0      |
| Ndb_api_trans_close_count_session          | 1      |
| Ndb_api_pk_op_count_session                | 1      |
| Ndb_api_uk_op_count_session                | 0      |
| Ndb_api_table_scan_count_session           | 0      |
| Ndb_api_range_scan_count_session           | 0      |
| Ndb_api_pruned_scan_count_session          | 0      |
| Ndb_api_scan_batch_count_session           | 0      |
| Ndb_api_read_row_count_session             | 1      |
| Ndb_api_trans_local_read_row_count_session | 1      |
+--------------------------------------------+--------+
18 rows in set (0.00 sec)

mysql> USE test;
Database changed
mysql> CREATE TABLE t (c INT) ENGINE NDBCLUSTER;
Query OK, 0 rows affected (0.85 sec)
```

Agora, você pode executar uma nova declaração `SHOW STATUS` (show-status.html "15.7.7.37 SHOW STATUS Statement") e observar as mudanças, conforme mostrado aqui (com as linhas alteradas destacadas na saída):

```
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 8         |
| Ndb_api_wait_scan_result_count_session     | 0         |
| Ndb_api_wait_meta_request_count_session    | 17        |
| Ndb_api_wait_nanos_count_session           | 706871709 |
| Ndb_api_bytes_sent_count_session           | 2376      |
| Ndb_api_bytes_received_count_session       | 3844      |
| Ndb_api_trans_start_count_session          | 4         |
| Ndb_api_trans_commit_count_session         | 4         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 4         |
| Ndb_api_pk_op_count_session                | 6         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 0         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 2         |
| Ndb_api_trans_local_read_row_count_session | 1         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

Da mesma forma, você pode ver as mudanças nos contadores de estatísticas da API NDB causadas pela inserção de uma linha no `t`: Insira a linha, em seguida, execute a mesma declaração `SHOW STATUS` (show-status.html "15.7.7.37 SHOW STATUS Statement") usada no exemplo anterior, conforme mostrado aqui:

```
mysql> INSERT INTO t VALUES (100);
Query OK, 1 row affected (0.00 sec)

mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 11        |
| Ndb_api_wait_scan_result_count_session     | 6         |
| Ndb_api_wait_meta_request_count_session    | 20        |
| Ndb_api_wait_nanos_count_session           | 707370418 |
| Ndb_api_bytes_sent_count_session           | 2724      |
| Ndb_api_bytes_received_count_session       | 4116      |
| Ndb_api_trans_start_count_session          | 7         |
| Ndb_api_trans_commit_count_session         | 6         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 7         |
| Ndb_api_pk_op_count_session                | 8         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 1         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 3         |
| Ndb_api_trans_local_read_row_count_session | 2         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

Podemos fazer várias observações a partir desses resultados:

* Embora tenhamos criado `t` sem uma chave primária explícita, foram realizadas 5 operações de chave primária nesse processo (a diferença nos valores de “antes” e “depois” de `Ndb_api_pk_op_count_session`, ou 6 menos 1). Isso reflete a criação da chave primária oculta, que é uma característica de todas as tabelas que utilizam o mecanismo de armazenamento `NDB`.

* Ao comparar os valores sucessivos para `Ndb_api_wait_nanos_count_session`, podemos ver que as operações da API NDB que implementam a declaração `CREATE TABLE` esperaram muito mais tempo (706871709 - 820705 = 706051004 nanosegundos, ou aproximadamente 0,7 segundo) para respostas dos nós de dados do que as executadas pelo `INSERT` (707370418 - 706871709 = 498709 ns ou aproximadamente 0,0005 segundo). Os tempos de execução relatados para essas declarações no cliente **mysql** correspondem aproximadamente a essas figuras.

Em plataformas sem resolução de tempo (nanosegundos) suficiente, pequenas mudanças no valor do contador da API NDB `WaitNanosCount` devido a declarações SQL que são executadas muito rapidamente podem não ser sempre visíveis nos valores de `Ndb_api_wait_nanos_count_session`, `Ndb_api_wait_nanos_count_slave` ou `Ndb_api_wait_nanos_count`.

* A declaração `INSERT` aumentou tanto os contadores de estatísticas da API NDB `ReadRowCount` quanto `TransLocalReadRowCount`, conforme refletido pelos valores aumentados de `Ndb_api_read_row_count_session` e `Ndb_api_trans_local_read_row_count_session`.

### 25.6.16 ndbinfo: A Base de Dados de Informação do NDB Cluster

`ndbinfo` é um banco de dados que contém informações específicas para o NDB Cluster.

Este banco de dados contém vários quadros, cada um dos quais fornece um tipo diferente de dados sobre o estado do nó do NDB Cluster, o uso de recursos e as operações. Você pode encontrar informações mais detalhadas sobre cada um desses quadros nas próximas seções.

`ndbinfo` está incluído com suporte ao NDB Cluster no MySQL Server; não são necessários passos de compilação ou configuração especiais; as tabelas são criadas pelo MySQL Server quando ele se conecta ao clúster. Você pode verificar que o suporte ao `ndbinfo` está ativo em uma instância específica do MySQL Server usando `SHOW PLUGINS`; se o suporte ao `ndbinfo` estiver habilitado, você deve ver uma linha contendo `ndbinfo` na coluna `Name` e `ACTIVE` na coluna `Status`, como mostrado aqui (texto destacado):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha2_cache_cleaner               | ACTIVE | AUDIT              | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX             | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX_RESET       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE_LRU           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_POOL_STATS         | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TEMP_TABLE_INFO           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_METRICS                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DEFAULT_STOPWORD       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DELETED                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_BEING_DELETED          | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_CONFIG                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_CACHE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_TABLE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLES                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESTATS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_INDEXES                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESPACES               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_COLUMNS                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_VIRTUAL                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CACHED_INDEXES            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE | DAEMON             | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
47 rows in set (0.00 sec)
```

Você também pode fazer isso verificando a saída de `SHOW ENGINES` em busca de uma linha que inclua `ndbinfo` na coluna `Engine` e `YES` na coluna `Support`, conforme mostrado aqui (texto destacado):

```
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: ndbcluster
     Support: YES
     Comment: Clustered, fault-tolerant tables
Transactions: YES
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: ndbinfo
     Support: YES
     Comment: NDB Cluster system information storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 10. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
10 rows in set (0.00 sec)
```

Se o suporte ao `ndbinfo` estiver habilitado, você pode acessar o `ndbinfo` usando instruções SQL no **mysql** ou em outro cliente MySQL. Por exemplo, você pode ver o `ndbinfo` listado na saída do `SHOW DATABASES`, como mostrado aqui (texto destacado):

```
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| ndbinfo            |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.04 sec)
```

Se o processo **mysqld** não foi iniciado com a opção `--ndbcluster`, `ndbinfo` não está disponível e não é exibido por `SHOW DATABASES`. Se **mysqld** estava anteriormente conectado a um NDB Cluster, mas o cluster se torna indisponível (devido a eventos como desligamento do cluster, perda de conectividade de rede, etc.), `ndbinfo` e suas tabelas permanecem visíveis, mas uma tentativa de acessar quaisquer tabelas (exceto `blocks` ou `config_params`) falha com o erro 157 'Conexão ao NDB falhou' do NDBINFO.

Com exceção das tabelas `blocks` e `config_params`, o que chamamos de "tabelas" `ndbinfo` são, na verdade, visualizações geradas a partir de tabelas internas `NDB` que normalmente não são visíveis ao servidor MySQL. Você pode tornar essas tabelas visíveis definindo a variável de sistema `ndbinfo_show_hidden` para `ON` (ou `1`), mas isso normalmente não é necessário.

Todas as tabelas `ndbinfo` são somente leitura e são geradas sob demanda quando solicitadas. Como muitas delas são geradas em paralelo pelos nós de dados, enquanto outras são específicas para um determinado nó SQL, não é garantido que elas forneçam um instantâneo consistente.

Além disso, a exclusão de junções não é suportada em tabelas `ndbinfo`; portanto, a junção de grandes tabelas `ndbinfo` pode exigir a transferência de uma grande quantidade de dados para o nó da API solicitante, mesmo quando a consulta faz uso de uma cláusula `WHERE`.

As tabelas `ndbinfo` não são incluídas no cache de consulta. (Bug #59831)

Você pode selecionar o banco de dados `ndbinfo` com uma declaração `USE`, e, em seguida, emitir uma declaração `SHOW TABLES` para obter uma lista de tabelas, assim como para qualquer outro banco de dados, como este:

```
mysql> USE ndbinfo;
Database changed

mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_ndbinfo               |
+---------------------------------+
| arbitrator_validity_detail      |
| arbitrator_validity_summary     |
| backup_id                       |
| blobs                           |
| blocks                          |
| cluster_locks                   |
| cluster_operations              |
| cluster_transactions            |
| config_nodes                    |
| config_params                   |
| config_values                   |
| counters                        |
| cpudata                         |
| cpudata_1sec                    |
| cpudata_20sec                   |
| cpudata_50ms                    |
| cpuinfo                         |
| cpustat                         |
| cpustat_1sec                    |
| cpustat_20sec                   |
| cpustat_50ms                    |
| dict_obj_info                   |
| dict_obj_tree                   |
| dict_obj_types                  |
| dictionary_columns              |
| dictionary_tables               |
| disk_write_speed_aggregate      |
| disk_write_speed_aggregate_node |
| disk_write_speed_base           |
| diskpagebuffer                  |
| diskstat                        |
| diskstats_1sec                  |
| error_messages                  |
| events                          |
| files                           |
| foreign_keys                    |
| hash_maps                       |
| hwinfo                          |
| index_columns                   |
| index_stats                     |
| locks_per_fragment              |
| logbuffers                      |
| logspaces                       |
| membership                      |
| memory_per_fragment             |
| memoryusage                     |
| nodes                           |
| operations_per_fragment         |
| pgman_time_track_stats          |
| processes                       |
| resources                       |
| restart_info                    |
| server_locks                    |
| server_operations               |
| server_transactions             |
| table_distribution_status       |
| table_fragments                 |
| table_info                      |
| table_replicas                  |
| tc_time_track_stats             |
| threadblocks                    |
| threads                         |
| threadstat                      |
| transporter_details             |
| transporters                    |
+---------------------------------+
65 rows in set (0.00 sec)
```

Todas as tabelas `ndbinfo` utilizam o mecanismo de armazenamento `NDB`; no entanto, uma entrada `ndbinfo` ainda aparece na saída de `SHOW ENGINES` e `SHOW PLUGINS` como descrito anteriormente.

Você pode executar as instruções `SELECT` nessas tabelas, exatamente como você normalmente esperaria:

```
mysql> SELECT * FROM memoryusage;
+---------+---------------------+--------+------------+------------+-------------+
| node_id | memory_type         | used   | used_pages | total      | total_pages |
+---------+---------------------+--------+------------+------------+-------------+
|       5 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       5 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       6 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       6 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       7 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       7 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       8 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       8 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
+---------+---------------------+--------+------------+------------+-------------+
8 rows in set (0.09 sec)
```

Consultas mais complexas, como as duas seguintes `SELECT` usando a tabela `memoryusage`, são possíveis:

```
mysql> SELECT SUM(used) as 'Data Memory Used, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Data memory';
+-----------------------------+
| Data Memory Used, All Nodes |
+-----------------------------+
|                        6460 |
+-----------------------------+
1 row in set (0.09 sec)

mysql> SELECT SUM(used) as 'Long Message Buffer, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Long message buffer';
+-------------------------------------+
| Long Message Buffer Used, All Nodes |
+-------------------------------------+
|                             1179648 |
+-------------------------------------+
1 row in set (0.08 sec)
```

Os nomes da tabela e das colunas do `ndbinfo` são sensíveis a maiúsculas e minúsculas (assim como o nome do próprio banco de dados `ndbinfo`). Esses identificadores estão em minúsculas. Tentar usar a letra incorreta resulta em um erro, como mostrado neste exemplo:

```
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       5 |  17707 | STARTED |           0 |                 1 |
|       6 |  17706 | STARTED |           0 |                 1 |
|       7 |  17705 | STARTED |           0 |                 1 |
|       8 |  17704 | STARTED |           0 |                 1 |
+---------+--------+---------+-------------+-------------------+
4 rows in set (0.06 sec)

mysql> SELECT * FROM Nodes;
ERROR 1146 (42S02): Table 'ndbinfo.Nodes' doesn't exist
```

O **mysqldump** ignora completamente o banco de dados `ndbinfo` e o exclui de qualquer saída. Isso é verdadeiro mesmo quando se usa a opção `--databases` ou `--all-databases`.

O NDB Cluster também mantém tabelas no banco de dados de informações `INFORMATION_SCHEMA`, incluindo a tabela `FILES`, que contém informações sobre os arquivos usados para armazenamento de dados do NDB Cluster Disk, e a tabela `ndb_transid_mysql_connection_map`, que mostra as relações entre as transações, os coordenadores de transação e os nós da API do NDB Cluster. Para mais informações, consulte as descrições das tabelas ou a Seção 25.6.17, “Tabelas do esquema de informações para NDB Cluster”.

#### 25.6.16.1 A tabela ndbinfo arbitrator_validity_detail

A tabela `arbitrator_validity_detail` mostra a visão que cada nó de dados no clúster tem sobre o árbitro. É um subconjunto da tabela `membership`.

A tabela `arbitrator_validity_detail` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `arbitrator`

ID do nó do árbitro

* `arb_ticket`

Identificador interno usado para rastrear a arbitragem

* `arb_connected`

Se este nó está conectado ao árbitro; qualquer um dos `Yes` ou `No`

* `arb_state`

Estado de arbitragem

##### Notas

O ID do nó é o mesmo que o relatado por [**ndb_mgm -e "SHOW"**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client").

Todos os nós devem exibir os mesmos valores de `arbitrator` e `arb_ticket`, bem como o mesmo valor de `arb_state`. Os possíveis valores de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se o nó atual está conectado ao `arbitrator`.

#### 25.6.16.2 A tabela ndbinfo arbitrator_validity_summary

A tabela `arbitrator_validity_summary` oferece uma visão composta do árbitro em relação aos nós de dados do clúster.

A tabela `arbitrator_validity_summary` contém as seguintes colunas:

* `arbitrator`

ID do nó do árbitro

* `arb_ticket`

Identificador interno usado para rastrear a arbitragem

* `arb_connected`

Se esse árbitro está conectado ao clúster

* `consensus_count`

Número de nós de dados que veem esse nó como árbitro; qualquer um dos `Yes` ou `No`

##### Notas

Em operações normais, esta tabela deve ter apenas 1 linha por um período apreciável de tempo. Se tiver mais de 1 linha por mais de alguns momentos, então ou não todos os nós estão conectados ao árbitro, ou todos os nós estão conectados, mas não concordam no mesmo árbitro.

A coluna `arbitrator` mostra o ID do nó do árbitro.

`arb_ticket` é o identificador interno utilizado por este árbitro.

`arb_connected` mostra se este nó está conectado ao clúster como árbitro.

#### 25.6.16.3 A tabela ndbinfo backup_id

Esta tabela fornece uma maneira de encontrar o ID do backup iniciado mais recentemente para este clúster.

A tabela `backup_id` contém uma única coluna `id`, que corresponde a um ID de backup obtido usando o comando do cliente **ndb_mgm** `START BACKUP`. Esta tabela contém uma única linha.

*Exemplo*: Suponha a seguinte sequência de comandos `START BACKUP` emitidos no cliente de gerenciamento NDB, sem outros backups realizados desde que o clúster foi iniciado pela primeira vez:

```
ndb_mgm> START BACKUP
Waiting for completed, this may take several minutes
Node 5: Backup 1 started from node 50
Node 5: Backup 1 started from node 50 completed
 StartGCP: 27894 StopGCP: 27897
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP 5
Waiting for completed, this may take several minutes
Node 5: Backup 5 started from node 50
Node 5: Backup 5 started from node 50 completed
 StartGCP: 27905 StopGCP: 27908
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP
Waiting for completed, this may take several minutes
Node 5: Backup 6 started from node 50
Node 5: Backup 6 started from node 50 completed
 StartGCP: 27912 StopGCP: 27915
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP 3
Connected to Management Server at: localhost:1186
Waiting for completed, this may take several minutes
Node 5: Backup 3 started from node 50
Node 5: Backup 3 started from node 50 completed
 StartGCP: 28149 StopGCP: 28152
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm>
```

Após isso, a tabela `backup_id` contém a única linha mostrada aqui, usando o cliente **mysql**:

```
mysql> USE ndbinfo;

Database changed
mysql> SELECT * FROM backup_id;
+------+
| id   |
+------+
|    3 |
+------+
1 row in set (0.00 sec)
```

Se não forem encontrados backups, a tabela contém uma única linha com `0` como o valor `id`.

A tabela `backup_id` foi adicionada no NDB 8.0.24.

#### 25.6.16.4 A tabela ndbinfo blobs

Esta tabela fornece informações sobre os valores de blob armazenados em `NDB`. A tabela `blobs` tem as colunas listadas aqui:

* `table_id`

ID único da tabela que contém a coluna

* `database_name`

Nome do banco de dados em que esta tabela reside

* `table_name`

Nome da tabela

* `column_id`

O ID único da coluna na tabela

* `column_name`

Nome da coluna

* `inline_size`

Tamanho em linha da coluna

* `part_size`

Tamanho da coluna

* `stripe_size`

Tamanho da faixa da coluna

* `blob_table_name`

Nome da tabela blob que contém os dados blob desta coluna, se houver

Existem linhas nesta tabela para as colunas da tabela `NDB` que armazenam valores de `BLOB`, `TEXT` que ocupam mais de 255 bytes e, portanto, requerem o uso de uma tabela blob. Parte dos valores de `JSON` que excedem 4000 bytes de tamanho também são armazenados nesta tabela. Para mais informações sobre como o NDB Cluster armazena colunas desses tipos, consulte Requisitos de armazenamento de tipos de string.

As partes e os tamanhos em linha da coluna blob `NDB` (NDB 8.0.30 e versões posteriores) podem ser definidas usando as declarações `CREATE TABLE` e `ALTER TABLE` que contêm comentários da coluna de tabela `NDB` (consulte Opções de COLUNA NDB); isso também pode ser feito em aplicativos da API NDB (consulte `Column::setPartSize()` e `setInlineSize()`).

A tabela `blobs` foi adicionada no NDB 8.0.29.

#### 25.6.16.5 Blocos ndbinfo da Tabela

A tabela `blocks` é uma tabela estática que simplesmente contém os nomes e os IDs internos de todos os blocos do kernel NDB (consulte Blocos de Kernel NDB). Ela é usada pelas outras tabelas `ndbinfo` (a maioria das quais são, na verdade, vistas) para mapear os números dos blocos aos nomes dos blocos para produzir saída legível para humanos.

A tabela `blocks` contém as seguintes colunas:

* `block_number`

Número do bloco

* `block_name`

Nome do bloco

##### Notas

Para obter uma lista de todos os nomes de bloco, basta executar `SELECT block_name FROM ndbinfo.blocks`. Embora se trate de uma tabela estática, seu conteúdo pode variar entre diferentes versões do NDB Cluster.

#### 25.6.16.6 A tabela ndbinfo cluster_locks

A tabela `cluster_locks` fornece informações sobre os pedidos de bloqueio atuais que estão segurando e aguardando bloqueios nas tabelas `NDB` em um NDB Cluster, e é destinada como uma tabela complementar à `cluster_operations`. As informações obtidas da tabela `cluster_locks` podem ser úteis na investigação de travamentos e deadlocks.

A tabela `cluster_locks` contém as seguintes colunas:

* `node_id`

ID do nó de relatório

* `block_instance`

ID da instância do LDM que reporta

* `tableid`

ID da tabela que contém esta linha

* `fragmentid`

ID do fragmento que contém a linha bloqueada

* `rowid`

ID da linha bloqueada

* `transid`

ID da transação

* `mode`

Modo de solicitação de bloqueio

* `state`

Estado de bloqueio

* `detail`

Se esta é a primeira retenção de bloqueio na fila de bloqueio de linha

* `op`

Tipo de operação

* `duration_millis`

Milisegundos gastos esperando ou segurando o bloqueio

* `lock_num`

ID do objeto de bloqueio

* `waiting_for`

Esperando bloqueio com este ID

##### Notas

A coluna ID da tabela (`tableid`) é atribuída internamente e é a mesma que a usada em outras tabelas `ndbinfo`. Ela também é exibida na saída de **ndb_show_tables**.

O ID da transação (coluna `transid`) é o identificador gerado pela API NDB para a transação que solicita ou mantém o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio; este é sempre um dos `S` (indicando um bloqueio compartilhado) ou `X` (um bloqueio exclusivo). Se uma transação mantém um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha têm o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre um dos `H` (mantendo) ou `W` (esperando). Um pedido de bloqueio em espera aguarda um bloqueio mantido por uma transação diferente.

Quando a coluna `detail` contém um `*` (caractere estrela), isso significa que este bloqueio é o primeiro bloqueio de retenção na fila de bloqueio da linha afetada; caso contrário, esta coluna está vazia. Esta informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de bloqueio.

A coluna `op` mostra o tipo de operação que solicita o bloqueio. Isso é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos em que este pedido de bloqueio está aguardando ou mantendo o bloqueio. Isso é redefinido para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (coluna `lockid`) é único para este nó e para a instância do bloco.

O estado do bloqueio é mostrado na coluna `lock_state`; se este for `W`, o bloqueio está à espera de ser concedido, e a coluna `waiting_for` mostra o ID do bloqueio do objeto para o qual este pedido está à espera. Caso contrário, a coluna `waiting_for` está vazia. `waiting_for` pode se referir apenas a bloqueios na mesma linha, conforme identificado por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`.

#### 25.6.16.7 A tabela ndbinfo cluster_operations

A tabela `cluster_operations` fornece uma visão de per-operação (chave primária estatal) de toda a atividade no NDB Cluster do ponto de vista dos blocos de gerenciamento de dados locais (LQH) (consulte o Bloco DBLQH).

A tabela `cluster_operations` contém as seguintes colunas:

* `node_id`

ID do nó do bloco LQH de relatório

* `block_instance`

Instância do bloco LQH

* `transid`

ID da transação

* `operation_type`

Tipo de operação (consulte o texto para os possíveis valores)

* `state`

Estado da operação (consulte o texto para os possíveis valores)

* `tableid`

Tabela ID

* `fragmentid`

ID do fragmento

* `client_node_id`

ID do nó do cliente

* `client_block_ref`

Referência do bloqueio do cliente

* `tc_node_id`

ID do nó do coordenador de transação

* `tc_block_no`

Número do bloco do coordenador de transação

* `tc_block_instance`

Instância de bloco do coordenador de transação

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX` ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar esta lista de estados selecionando a tabela `ndb$dblqh_tcconnect_state`, que normalmente é oculta.)

Você pode obter o nome de uma tabela `NDB` a partir de seu ID de tabela, verificando a saída de **ndb_show_tables**.

O `fragid` é o mesmo número de partição visto na saída do **ndb_desc** `--extra-partition-info` (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API de NDB Cluster ou um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem, respectivamente, os números de instância do bloco `DBLQH` e `DBTC`. Você pode usar essas informações juntamente com os nomes dos blocos para obter informações sobre os threads específicos da tabela `threadblocks`.

#### 25.6.16.8 A tabela ndbinfo cluster_transactions

A tabela `cluster_transactions` mostra informações sobre todas as transações em andamento em um NDB Cluster.

A tabela `cluster_transactions` contém as seguintes colunas:

* `node_id`

ID do nó do coordenador de transação

* `block_instance`

Instância do bloco TC

* `transid`

ID da transação

* `state`

Estado da operação (consulte o texto para os possíveis valores)

* `count_operations`

Número de operações de chave primária estendida na transação (inclui leituras com bloqueios, bem como operações de DML)

* `outstanding_operations`

Operações ainda sendo executadas em blocos locais de gerenciamento de dados

* `inactive_seconds`

Tempo gasto esperando a API

* `client_node_id`

ID do nó do cliente

* `client_block_ref`

Referência do bloqueio do cliente

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

`block_instance` refere-se a uma instância de um bloco do kernel. Junto com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar esta lista de estados selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente é oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API de NDB Cluster ou um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

A coluna `tc_block_instance` fornece o número da instância do bloco `DBTC`. Você pode usar isso juntamente com o nome do bloco para obter informações sobre os threads específicos da tabela `threadblocks`.

#### 25.6.16.9 A tabela ndbinfo config_nodes

A tabela `config_nodes` mostra os nós configurados em um arquivo de NDB Cluster `config.ini`. Para cada nó, a tabela exibe uma linha contendo o ID do nó, o tipo de nó (nó de gerenciamento, nó de dados ou nó de API) e o nome ou endereço IP do host no qual o nó está configurado para ser executado.

Esta tabela não indica se um nó está realmente em execução ou se está conectado atualmente ao clúster. Informações sobre os nós conectados a um NDB Cluster podem ser obtidas nas tabelas `nodes` e `processes`.

A tabela `config_nodes` contém as seguintes colunas:

* `node_id`

O ID do nó

* `node_type`

O tipo de nó

* `node_hostname`

O nome ou endereço IP do host no qual o nó reside

##### Notas

A coluna `node_id` mostra o ID do nó usado no arquivo `config.ini` para este nó; se não for especificado, é exibido o ID do nó que seria atribuído automaticamente a este nó.

A coluna `node_type` exibe um dos seguintes três valores:

* `MGM`: Nó de gerenciamento.
* `NDB`: Nó de dados.
* `API`: Nó de API; isso inclui nós SQL.

A coluna `node_hostname` mostra o host do nó conforme especificado no arquivo `config.ini`. Isso pode estar vazio para um nó de API, se `HostName` não tiver sido definido no arquivo de configuração do clúster. Se `HostName` não tiver sido definido para um nó de dados no arquivo de configuração, `localhost` é usado aqui. `localhost` também é usado se `HostName` não tiver sido especificado para um nó de gerenciamento.

#### 25.6.16.10 A tabela ndbinfo config_params

A tabela `config_params` é uma tabela estática que fornece os nomes e os números de ID internos dos parâmetros de configuração do NDB Cluster e outras informações sobre esses parâmetros. Essa tabela também pode ser usada em conjunto com a tabela `config_values` para obter informações em tempo real sobre os parâmetros de configuração do nó.

A tabela `config_params` contém as seguintes colunas:

* `param_number`

O número interno de identificação do parâmetro

* `param_name`

O nome do parâmetro

* `param_description`

Uma breve descrição do parâmetro

* `param_type`

O tipo de dados do parâmetro

* `param_default`

O valor padrão do parâmetro, se houver

* `param_min`

O valor máximo do parâmetro, se houver

* `param_max`

O valor mínimo do parâmetro, se houver

* `param_mandatory`

1 se o parâmetro for necessário, caso contrário, 0

* `param_status`

Atualmente não utilizada

##### Notas

Esta tabela é somente de leitura.

Embora se trate de uma tabela estática, seu conteúdo pode variar entre as instalações do NDB Cluster, uma vez que os parâmetros suportados podem variar devido a diferenças entre as versões do software, as configurações de hardware do cluster e outros fatores.

#### 25.6.16.11 Tabela ndbinfo config_values

A tabela `config_values` fornece informações sobre o estado atual dos valores dos parâmetros de configuração do nó. Cada linha da tabela corresponde ao valor atual de um parâmetro em um nó específico.

A tabela `config_values` contém as seguintes colunas:

* `node_id`

ID do nó no clúster

* `config_param`

O número interno de identificação do parâmetro

* `config_value`

Valor atual do parâmetro

##### Notas

A coluna `config_param` da tabela e a coluna `param_number` da tabela `config_params` usam os mesmos identificadores de parâmetros. Ao unir as duas tabelas nessas colunas, você pode obter informações detalhadas sobre os parâmetros de configuração do nó desejado. A consulta mostrada aqui fornece os valores atuais para todos os parâmetros em cada nó de dados no clúster, ordenados por ID de nó e nome do parâmetro:

```
SELECT    v.node_id AS 'Node Id',
          p.param_name AS 'Parameter',
          v.config_value AS 'Value'
FROM      config_values v
JOIN      config_params p
ON        v.config_param=p.param_number
WHERE     p.param_name NOT LIKE '__%'
ORDER BY  v.node_id, p.param_name;
```

Saída parcial da consulta anterior quando executada em um pequeno exemplo de cluster utilizado para testes simples:

```
+---------+------------------------------------------+----------------+
| Node Id | Parameter                                | Value          |
+---------+------------------------------------------+----------------+
|       2 | Arbitration                              | 1              |
|       2 | ArbitrationTimeout                       | 7500           |
|       2 | BackupDataBufferSize                     | 16777216       |
|       2 | BackupDataDir                            | /home/jon/data |
|       2 | BackupDiskWriteSpeedPct                  | 50             |
|       2 | BackupLogBufferSize                      | 16777216       |

...

|       3 | TotalSendBufferMemory                    | 0              |
|       3 | TransactionBufferMemory                  | 1048576        |
|       3 | TransactionDeadlockDetectionTimeout      | 1200           |
|       3 | TransactionInactiveTimeout               | 4294967039     |
|       3 | TwoPassInitialNodeRestartCopy            | 0              |
|       3 | UndoDataBuffer                           | 16777216       |
|       3 | UndoIndexBuffer                          | 2097152        |
+---------+------------------------------------------+----------------+
248 rows in set (0.02 sec)
```

A cláusula `WHERE` filtra parâmetros cujos nomes comecem com um duplo underscore (`__`); esses parâmetros são reservados para testes e outros usos internos pelos desenvolvedores do NDB, e não são destinados ao uso em um NDB Cluster de produção.

Você pode obter resultados mais específicos, mais detalhados ou ambos, ao emitir as consultas adequadas. Este exemplo fornece todos os tipos de informações disponíveis sobre os parâmetros `NodeId`, `NoOfReplicas`, `HostName`, `DataMemory`, `IndexMemory` e `TotalSendBufferMemory`, conforme configurados atualmente para todos os nós de dados no clúster:

```
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
WHERE   p. param_name
  IN ('NodeId', 'NoOfReplicas', 'HostName',
      'DataMemory', 'IndexMemory', 'TotalSendBufferMemory')\G
```

A saída dessa consulta, quando executada em um pequeno NDB Cluster com 2 nós de dados usados para testes simples, é mostrada aqui:

```
*************************** 1. row ***************************
    Name: NodeId
    Node: 2
    Type: unsigned
 Default:
 Minimum: 1
 Maximum: 144
Required: Y
 Current: 2
*************************** 2. row ***************************
    Name: HostName
    Node: 2
    Type: string
 Default: localhost
 Minimum:
 Maximum:
Required: N
 Current: 127.0.0.1
*************************** 3. row ***************************
    Name: TotalSendBufferMemory
    Node: 2
    Type: unsigned
 Default: 0
 Minimum: 262144
 Maximum: 4294967039
Required: N
 Current: 0
*************************** 4. row ***************************
    Name: NoOfReplicas
    Node: 2
    Type: unsigned
 Default: 2
 Minimum: 1
 Maximum: 4
Required: N
 Current: 2
*************************** 5. row ***************************
    Name: DataMemory
    Node: 2
    Type: unsigned
 Default: 102760448
 Minimum: 1048576
 Maximum: 1099511627776
Required: N
 Current: 524288000
*************************** 6. row ***************************
    Name: NodeId
    Node: 3
    Type: unsigned
 Default:
 Minimum: 1
 Maximum: 144
Required: Y
 Current: 3
*************************** 7. row ***************************
    Name: HostName
    Node: 3
    Type: string
 Default: localhost
 Minimum:
 Maximum:
Required: N
 Current: 127.0.0.1
*************************** 8. row ***************************
    Name: TotalSendBufferMemory
    Node: 3
    Type: unsigned
 Default: 0
 Minimum: 262144
 Maximum: 4294967039
Required: N
 Current: 0
*************************** 9. row ***************************
    Name: NoOfReplicas
    Node: 3
    Type: unsigned
 Default: 2
 Minimum: 1
 Maximum: 4
Required: N
 Current: 2
*************************** 10. row ***************************
    Name: DataMemory
    Node: 3
    Type: unsigned
 Default: 102760448
 Minimum: 1048576
 Maximum: 1099511627776
Required: N
 Current: 524288000
10 rows in set (0.01 sec)
```

#### 25.6.16.12 Contadores ndbinfo da Tabela

A tabela `counters` fornece totalizações em andamento de eventos, como leituras e escritas para blocos específicos do kernel e nós de dados. Os contagem são mantidas a partir do início ou reinício mais recente do nó; um início ou reinício de nó redefiniu todos os contadores nesse nó. Nem todos os blocos do kernel têm todos os tipos de contadores.

A tabela `counters` contém as seguintes colunas:

* `node_id`

O ID do nó de dados

* `block_name`

Nome do bloco de kernel NDB associado (consulte Blocos de kernel NDB).

* `block_instance`

Instância de bloco

* `counter_id`

O número de identificação interno do caixa; normalmente um número inteiro entre 1 e 10, inclusive.

* `counter_name`

O nome do contador. Veja o texto para os nomes dos contadores individuais e o bloco do kernel NDB com o qual cada contador está associado.

* `val`

O valor do balcão

##### Notas

Cada contador está associado a um bloco específico do kernel NDB.

O contador `OPERATIONS` está associado ao bloco de kernel `DBLQH` (gerador de consultas locais). Uma leitura de chave primária é considerada uma operação, assim como uma atualização de chave primária. Para leituras, há uma operação em `DBLQH` por operação em `DBTC`. Para escritas, há uma operação contada por replica de fragmento.

Os contadores `ATTRINFO`, `TRANSACTIONS`, `COMMITS`, `READS`, `LOCAL_READS`, `SIMPLE_READS`, `WRITES`, `LOCAL_WRITES`, `ABORTS`, `TABLE_SCANS` e `RANGE_SCANS` estão associados ao bloco de kernel `DBTC` (coordenador de transação).

`LOCAL_WRITES` e `LOCAL_READS` são operações de chave primária que utilizam um coordenador de transação em um nó que também contém a replica primária do fragmento do registro.

O contador `READS` inclui todas as leituras. `LOCAL_READS` inclui apenas aquelas leituras do fragmento primário na mesma instância do nó que este coordenador de transação. `SIMPLE_READS` inclui apenas aquelas leituras nas quais a operação de leitura é a operação de início e fim para uma transação dada. As leituras simples não mantêm bloqueios, mas fazem parte de uma transação, na medida em que observam as alterações não confirmadas feitas pela transação que as contém, mas não de nenhuma outra transação não confirmada. Tais leituras são “simples” do ponto de vista do bloco TC; uma vez que não mantêm bloqueios, não são duráveis, e uma vez que `DBTC` as tenha roteado para o bloco LQH relevante, não mantém nenhum estado para elas.

`ATTRINFO` mantém um contador do número de vezes que um programa interpretado é enviado ao nó de dados. Consulte Mensagens de Mensagens do Protocolo NDB, para obter mais informações sobre as mensagens de `ATTRINFO` no kernel `NDB`.

Os contadores `LOCAL_TABLE_SCANS_SENT`, `READS_RECEIVED`, `PRUNED_RANGE_SCANS_RECEIVED`, `RANGE_SCANS_RECEIVED`, `LOCAL_READS_SENT`, `CONST_PRUNED_RANGE_SCANS_RECEIVED`, `LOCAL_RANGE_SCANS_SENT`, `REMOTE_READS_SENT`, `REMOTE_RANGE_SCANS_SENT`, `READS_NOT_FOUND`, `SCAN_BATCHES_RETURNED`, `TABLE_SCANS_RECEIVED` e `SCAN_ROWS_RETURNED` estão associados ao bloco de kernel `DBSPJ` (conjunção de empurrar para baixo).

As colunas `block_name` e `block_instance` fornecem, respectivamente, o nome do bloco do kernel NDB aplicável e o número de instância. Você pode usar essas informações para obter informações sobre os threads específicos da tabela `threadblocks`.

Vários contadores fornecem informações sobre sobrecarga do transportador e enviam dimensionamento de buffer ao solucionar tais problemas. Para cada instância do LQH, há uma instância de cada contador na lista a seguir:

* `LQHKEY_OVERLOAD`: Número de solicitações de chave primária rejeitadas na instância de bloco LQH devido ao sobrecarga do transportador

* `LQHKEY_OVERLOAD_TC`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o transportador de nó TC foi sobrecarregado

* `LQHKEY_OVERLOAD_READER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o nó leitor de API (leia apenas) foi sobrecarregado.

* `LQHKEY_OVERLOAD_NODE_PEER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o próximo nó de dados de backup (apenas gravações) foi sobrecarregado

* `LQHKEY_OVERLOAD_SUBSCRIBER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde um assinante de eventos (escreve apenas) foi sobrecarregado.

* `LQHSCAN_SLOWDOWNS`: Contagem de casos em que o tamanho do lote de varredura de fragmentos foi reduzido devido ao sobrecarregamento do transportador da API de varredura.

#### 25.6.16.13 Tabela ndbinfo cpudata

A tabela `cpudata` fornece dados sobre o uso da CPU durante o último segundo.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

ID do nó

* `cpu_no`

ID do CPU

* `cpu_online`

1 se a CPU estiver online atualmente, caso contrário, 0

* `cpu_userspace_time`

Tempo do CPU gasto no espaço do usuário

* `cpu_idle_time`

Tempo de CPU gasto em modo de espera

* `cpu_system_time`

Tempo do CPU gasto no tempo do sistema

* `cpu_interrupt_time`

Tempo do CPU gasto no processamento de interrupções (hardware e software)

* `cpu_exec_vm_time`

Tempo do CPU gasto na execução da máquina virtual

##### Notas

A tabela `cpudata` está disponível apenas nos sistemas operacionais Linux e Solaris.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.14 Tabela ndbinfo cpudata_1sec

A tabela `cpudata_1sec` fornece dados sobre o uso da CPU por segundo nos últimos 20 segundos.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

ID do nó

* `measurement_id`

ID da sequência de medição; as medições subsequentes têm IDs menores

* `cpu_no`

ID do CPU

* `cpu_online`

1 se a CPU estiver online atualmente, caso contrário, 0

* `cpu_userspace_time`

Tempo do CPU gasto no espaço do usuário

* `cpu_idle_time`

Tempo de CPU gasto em modo de espera

* `cpu_system_time`

Tempo do CPU gasto no tempo do sistema

* `cpu_interrupt_time`

Tempo do CPU gasto no processamento de interrupções (hardware e software)

* `cpu_exec_vm_time`

Tempo do CPU gasto na execução da máquina virtual

* `elapsed_time`

Tempo em microsegundos utilizado para esta medição

##### Notas

A tabela `cpudata_1sec` está disponível apenas nos sistemas operacionais Linux e Solaris.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.15 Tabela ndbinfo cpudata_20sec

A tabela `cpudata_20sec` fornece dados sobre o uso da CPU por intervalo de 20 segundos nos últimos 400 segundos.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

ID do nó

* `measurement_id`

ID da sequência de medição; as medições subsequentes têm IDs menores

* `cpu_no`

ID do CPU

* `cpu_online`

1 se a CPU estiver online atualmente, caso contrário, 0

* `cpu_userspace_time`

Tempo do CPU gasto no espaço do usuário

* `cpu_idle_time`

Tempo de CPU gasto em modo de espera

* `cpu_system_time`

Tempo do CPU gasto no tempo do sistema

* `cpu_interrupt_time`

Tempo do CPU gasto no processamento de interrupções (hardware e software)

* `cpu_exec_vm_time`

Tempo do CPU gasto na execução da máquina virtual

* `elapsed_time`

Tempo em microsegundos utilizado para esta medição

##### Notas

A tabela `cpudata_20sec` está disponível apenas nos sistemas operacionais Linux e Solaris.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.16 Tabela ndbinfo cpudata_50ms

A tabela `cpudata_50ms` fornece dados sobre o uso da CPU por intervalo de 50 milissegundos no último segundo.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

ID do nó

* `measurement_id`

ID da sequência de medição; as medições subsequentes têm IDs menores

* `cpu_no`

ID do CPU

* `cpu_online`

1 se a CPU estiver online atualmente, caso contrário, 0

* `cpu_userspace_time`

Tempo do CPU gasto no espaço do usuário

* `cpu_idle_time`

Tempo de CPU gasto em modo de espera

* `cpu_system_time`

Tempo do CPU gasto no tempo do sistema

* `cpu_interrupt_time`

Tempo do CPU gasto no processamento de interrupções (hardware e software)

* `cpu_exec_vm_time`

Tempo do CPU gasto na execução da máquina virtual

* `elapsed_time`

Tempo em microsegundos utilizado para esta medição

##### Notas

A tabela `cpudata_50ms` está disponível apenas nos sistemas operacionais Linux e Solaris.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.17 Tabela ndbinfo cpuinfo

A tabela `cpuinfo` fornece informações sobre a CPU na qual um nó de dados específico é executado.

A tabela `cpuinfo` contém as seguintes colunas:

* `node_id`

ID do nó

* `cpu_no`

ID do CPU

* `cpu_online`

1 se a CPU estiver online, caso contrário, 0

* `core_id`

ID do núcleo do CPU

* `socket_id`

ID do soquete do CPU

##### Notas

A tabela `cpuinfo` está disponível em todos os sistemas operacionais suportados por `NDB`, com exceção do MacOS e do FreeBSD.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.18 Tabela ndbinfo cpustat

A tabela `cpustat` fornece estatísticas de CPU por fio coletadas a cada segundo, para cada fio que está em execução no kernel `NDB`.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

ID do nó onde o thread está sendo executado

* `thr_no`

ID do fio (específico para este nó)

* `OS_user`

Tempo de uso do sistema operacional

* `OS_system`

Horário do sistema OS

* `OS_idle`

Tempo de inatividade

* `thread_exec`

Tempo de execução do fio

* `thread_sleeping`

Tempo de sono do fio

* `thread_spinning`

Tempo de rotação do fio

* `thread_send`

Tempo de envio do fio

* `thread_buffer_full`

Buffer de fio cheio em tempo integral

* `elapsed_time`

Tempo decorrido

#### 25.6.16.19 Tabela ndbinfo cpustat_50ms

A tabela `cpustat_50ms` fornece dados brutos de CPU por fio obtidos a cada 50 milissegundos para cada fio que está em execução no kernel `NDB`.

Assim como `cpustat_1sec` e `cpustat_20sec`, esta tabela mostra 20 conjuntos de medição por fio, cada um referenciando um período da duração indicada. Assim, `cpsustat_50ms` fornece 1 segundo de histórico.

A tabela `cpustat_50ms` contém as seguintes colunas:

* `node_id`

ID do nó onde o thread está sendo executado

* `thr_no`

ID do fio (específico para este nó)

* `OS_user_time`

Tempo de uso do sistema operacional

* `OS_system_time`

Horário do sistema OS

* `OS_idle_time`

Tempo de inatividade

* `exec_time`

Tempo de execução do fio

* `sleep_time`

Tempo de sono do fio

* `spin_time`

Tempo de rotação do fio

* `send_time`

Tempo de envio do fio

* `buffer_full_time`

Buffer de fio cheio em tempo integral

* `elapsed_time`

Tempo decorrido

#### 25.6.16.20 Tabela ndbinfo cpustat_1sec

A tabela `cpustat-1sec` fornece dados brutos de CPU por fio obtidos a cada segundo para cada fio que está em execução no kernel `NDB`.

Assim como `cpustat_50ms` e `cpustat_20sec`, esta tabela mostra 20 conjuntos de medição por fio, cada um referenciando um período da duração indicada. Assim, `cpsustat_1sec` fornece 20 segundos de histórico.

A tabela `cpustat_1sec` contém as seguintes colunas:

* `node_id`

ID do nó onde o thread está sendo executado

* `thr_no`

ID do fio (específico para este nó)

* `OS_user_time`

Tempo de uso do sistema operacional

* `OS_system_time`

Horário do sistema OS

* `OS_idle_time`

Tempo de inatividade

* `exec_time`

Tempo de execução do fio

* `sleep_time`

Tempo de sono do fio

* `spin_time`

Tempo de rotação do fio

* `send_time`

Tempo de envio do fio

* `buffer_full_time`

Buffer de fio cheio em tempo integral

* `elapsed_time`

Tempo decorrido

#### 25.6.16.21 Tabela ndbinfo cpustat_20sec

A tabela `cpustat_20sec` fornece dados brutos de CPU por fio obtidos a cada 20 segundos, para cada fio que está em execução no kernel `NDB`.

Assim como `cpustat_50ms` e `cpustat_1sec`, esta tabela mostra 20 conjuntos de medição por fio, cada um referenciando um período da duração indicada. Assim, `cpsustat_20sec` fornece 400 segundos de histórico.

A tabela `cpustat_20sec` contém as seguintes colunas:

* `node_id`

ID do nó onde o thread está sendo executado

* `thr_no`

ID do fio (específico para este nó)

* `OS_user_time`

Tempo de uso do sistema operacional

* `OS_system_time`

Horário do sistema OS

* `OS_idle_time`

Tempo de inatividade

* `exec_time`

Tempo de execução do fio

* `sleep_time`

Tempo de sono do fio

* `spin_time`

Tempo de rotação do fio

* `send_time`

Tempo de envio do fio

* `buffer_full_time`

Buffer de fio cheio em tempo integral

* `elapsed_time`

Tempo decorrido

#### 25.6.16.22 Tabela ndbinfo dictionary_columns

A tabela fornece informações do dicionário `NDB` sobre as colunas das tabelas `NDB`. `dictionary_columns` tem as colunas listadas aqui (com descrições breves):

* `table_id`

ID da tabela que contém a coluna

* `column_id`

O ID único da coluna

* `name`

Nome da coluna

* `column_type`

Tipo de dados da coluna da API NDB; veja Column::Type, para os possíveis valores

* `default_value`

O valor padrão da coluna, se houver

* `nullable`

Ou `NULL` ou `NOT NULL`

* `array_type`

O formato de armazenamento de atributos internos da coluna; um dos `FIXED`, `SHORT_VAR` ou `MEDIUM_VAR`; para mais informações, consulte Column::ArrayType, na documentação da API NDB

* `storage_type`

Tipo de armazenamento utilizado pela tabela; ou `MEMORY` ou `DISK`

* `primary_key`

`1` se esta for uma coluna de chave primária, caso contrário, `0`

* `partition_key`

`1` se esta for uma coluna de chave de particionamento, caso contrário, `0`

* `dynamic`

`1` se a coluna for dinâmica, caso contrário, `0`

* `auto_inc`

`1` se esta for uma coluna `AUTO_INCREMENT`, caso contrário, `0`

Você pode obter informações sobre todas as colunas de uma tabela específica ao combinar `dictionary_columns` com a tabela `dictionary_tables`, da seguinte forma:

```
SELECT dc.*
  FROM dictionary_columns dc
JOIN dictionary_tables dt
  ON dc.table_id=dt.table_id
WHERE dt.table_name='t1'
  AND dt.database_name='mydb';
```

A tabela `dictionary_columns` foi adicionada no NDB 8.0.29.

Nota

As colunas de Blob não são exibidas nesta tabela. Esse é um problema conhecido.

#### 25.6.16.23 A tabela ndbinfo dictionary_tables

Esta tabela fornece informações do dicionário `NDB` para as tabelas `NDB`. `dictionary_tables` contém as colunas listadas aqui:

* `table_id`

O ID único da tabela

* `database_name`

Nome do banco de dados que contém a tabela

* `table_name`

Nome da tabela

* `status`

O status da tabela; um dos `New`, `Changed`, `Retrieved`, `Invalid` ou `Altered`. (Consulte Objeto::Status, para mais informações sobre os valores de status do objeto.)

* `attributes`

Número de atributos de tabela

* `primary_key_cols`

Número de colunas na chave primária da tabela

* `primary_key`

Uma lista de colunas separadas por vírgula na chave primária da tabela

* `storage`

Tipo de armazenamento utilizado pela tabela; um dos `memory`, `disk` ou `default`

* `logging`

Se o registro está habilitado para esta tabela

* `dynamic`

`1` se a tabela for dinâmica, caso contrário, `0`; a tabela é considerada dinâmica se `table->``getForceVarPart()` é verdadeiro, ou se pelo menos uma coluna da tabela for dinâmica

* `read_backup`

`1` se lido a partir de qualquer replica (a opção `READ_BACKUP` está habilitada para esta tabela, caso contrário, `0`; veja Seção 15.1.20.12, “Definindo Opções de Comentário NDB”)

* `fully_replicated`

`1` se `FULLY_REPLICATED` estiver habilitado para esta tabela (cada nó de dados no clúster tem uma cópia completa da tabela), `0` se não; consulte Seção 15.1.20.12, “Definindo as Opções de Comentário NDB”

* `checksum`

Se esta tabela utilizar um checksum, o valor nesta coluna é `1`; se não, é `0`

* `row_size`

O volume de dados, em bytes que podem ser armazenados em uma linha, sem incluir quaisquer dados blob armazenados separadamente em tabelas blob; consulte Table::getRowSizeInBytes(), na documentação da API, para mais informações

* `min_rows`

Número mínimo de linhas, conforme utilizado para calcular as partições; consulte Table::getMinRows() na documentação da API, para mais informações

* `max_rows`

Número máximo de linhas, conforme utilizado para calcular as partições; consulte Table::getMaxRows() na documentação da API, para mais informações

* `tablespace`

ID do espaço de tabela ao qual a tabela pertence, se houver; este é `0`, se a tabela não usar dados em disco

* `fragment_type`

O tipo de fragmento da tabela; um dos `Single`, `AllSmall`, `AllMedium`, `AllLarge`, `DistrKeyHash`, `DistrKeyLin`, `UserDefined`, `unused` ou `HashMapPartition`; para mais informações, consulte Object::FragmentType, na documentação da API NDB

* `hash_map`

O mapa de hash utilizado pela tabela

* `fragments`

Número de fragmentos de mesa

* `partitions`

Número de partições usadas pela tabela

* `partition_balance`

Tipo de equilíbrio de partição utilizado, se houver; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, `FOR_RA_BY_LDM`, `FOR_RA_BY_LDM_X_2`, `FOR_RA_BY_LDM_X_3` ou `FOR_RA_BY_LDM_X_4`; consulte a Seção 15.1.20.12, “Definindo as Opções de Comentário NDB”

* `contains_GCI`

`1` se a tabela incluir um índice de ponto de verificação global, caso contrário, `0`

* `single_user_mode`

Tipo de acesso permitido à tabela quando o modo de único usuário está em vigor; um dos `locked`, `read_only` ou `read_write`; estes são equivalentes aos valores `SingleUserModeLocked`, `SingleUserModeReadOnly` e `SingleUserModeReadWrite`, respectivamente, do tipo `Table::SingleUserMode` na API NDB

* `force_var_part`

Isso é `1` se `table->``getForceVarPart()` for verdadeiro para esta tabela, e `0` se não for

* `GCI_bits`

Utilizado em testes

* `author_bits`

Utilizado em testes

A tabela `dictionary_tables` foi adicionada no NDB 8.0.29.

#### 25.6.16.24 Tabela ndbinfo dict_obj_info

A tabela `dict_obj_info` fornece informações sobre os objetos do dicionário de dados `NDB` (`DICT`) como tabelas e índices. (A tabela `dict_obj_types` pode ser consultada para obter uma lista de todos os tipos.) Essas informações incluem o tipo do objeto, o estado, o objeto pai (se houver) e o nome totalmente qualificado.

A tabela `dict_obj_info` contém as seguintes colunas:

* `type`

Tipo de objeto `DICT`; junção com `dict_obj_types` para obter o nome

* `id`

Identificador do objeto; para arquivos de registro de desfazer de dados de disco e arquivos de dados, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` do esquema de informações da tabela `FILES`; para arquivos de registro de desfazer, também é o mesmo valor mostrado para a coluna `log_id` nas tabelas `ndbinfo` `logbuffers` e `logspaces`

* `version`

Versão do objeto

* `state`

Estado do objeto; veja Object::State para valores e descrições.

* `parent_obj_type`

Tipo do objeto pai (um ID de tipo `dict_obj_types`); 0 indica que o objeto não tem pai

* `parent_obj_id`

ID do objeto pai (como uma tabela base); 0 indica que o objeto não tem pai

* `fq_name`

Nome de objeto totalmente qualificado; para uma tabela, este tem a forma `database_name/def/table_name`, para uma chave primária, o formato é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`

#### 25.6.16.25 Tabela ndbinfo dict_obj_tree

A tabela `dict_obj_tree` oferece uma visão baseada em árvore das informações da tabela da tabela [[`dict_obj_info`]. Isso é destinado principalmente para uso em testes, mas pode ser útil na visualização de hierarquias dos objetos de banco de dados `NDB`.

A tabela `dict_obj_tree` contém as seguintes colunas:

* `type`

Tipo de objeto `DICT`; junção com `dict_obj_types` para obter o nome do tipo de objeto

* `id`

Identificador do objeto; o mesmo que a coluna `id` em `dict_obj_info`

Para arquivos de registro de desfazer de dados de disco e arquivos de dados, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` da tabela do Esquema de Informações `FILES`; para arquivos de registro de desfazer, também é o mesmo valor mostrado para a coluna `log_id` nas tabelas ndbinfo `logbuffers` e `logspaces`

* `name`

O nome totalmente qualificado do objeto; o mesmo que a coluna `fq_name` em `dict_obj_info`

Para uma tabela, isso é `database_name/def/table_name` (o mesmo que seu *`parent_name`*); para um índice de qualquer tipo, isso assume a forma `NDB$INDEX_index_id_CUSTOM`

* `parent_type`

O tipo de objeto *`DICT`* do objeto pai deste objeto; faça uma junção com `dict_obj_types` para obter o nome do tipo de objeto

* `parent_id`

Identificador do objeto pai deste objeto; o mesmo que a coluna `id` da tabela `dict_obj_info`

* `parent_name`

Nome totalmente qualificado do objeto pai deste objeto; o mesmo que a coluna `fq_name` da tabela `dict_obj_info`

Para uma tabela, isso tem a forma `database_name/def/table_name`. Para um índice, o nome é `sys/def/table_id/index_name`. Para uma chave primária, é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`

* `root_type`

O tipo de objeto *`DICT`* do objeto raiz; faça uma junção com `dict_obj_types` para obter o nome do tipo de objeto

* `root_id`

Identificador para o objeto raiz; o mesmo que a coluna `id` da tabela `dict_obj_info`

* `root_name`

Nome totalmente qualificado do objeto raiz; o mesmo que a coluna `fq_name` da tabela `dict_obj_info`

* `level`

Nível do objeto na hierarquia

* `path`

Caminho completo para o objeto na hierarquia do objeto *`NDB`*; os objetos são separados por uma seta para a direita (representada como `->`), começando com o objeto raiz à esquerda

* `indented_name`

O `name` prefixado com uma seta para a direita (representado como `->`) com um número de espaços que o precedem correspondendo à profundidade do objeto na hierarquia

A coluna `path` é útil para obter um caminho completo para um objeto de banco de dados `NDB` em uma única linha, enquanto a coluna `indented_name` pode ser usada para obter um layout semelhante a uma árvore de informações de hierarquia completa para um objeto desejado.

*Exemplo*: Suponha que exista um banco de dados `test` e não exista uma tabela existente com o nome `t1` neste banco de dados. Execute a seguinte instrução SQL:

```
CREATE TABLE test.t1 (
    a INT PRIMARY KEY,
    b INT,
    UNIQUE KEY(b)
)   ENGINE = NDB;
```

Você pode obter o caminho para a tabela recém-criada usando a consulta mostrada aqui:

```
mysql> SELECT path FROM ndbinfo.dict_obj_tree
    -> WHERE name LIKE 'test%t1';
+-------------+
| path        |
+-------------+
| test/def/t1 |
+-------------+
1 row in set (0.14 sec)
```

Você pode ver os caminhos para todos os objetos dependentes desta tabela usando o caminho da tabela como o nome raiz em uma consulta como esta:

```
mysql> SELECT path FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/t1';
+----------------------------------------------------------+
| path                                                     |
+----------------------------------------------------------+
| test/def/t1                                              |
| test/def/t1 -> sys/def/13/b                              |
| test/def/t1 -> sys/def/13/b -> NDB$INDEX_15_CUSTOM       |
| test/def/t1 -> sys/def/13/b$unique                       |
| test/def/t1 -> sys/def/13/b$unique -> NDB$INDEX_16_UI    |
| test/def/t1 -> sys/def/13/PRIMARY                        |
| test/def/t1 -> sys/def/13/PRIMARY -> NDB$INDEX_14_CUSTOM |
+----------------------------------------------------------+
7 rows in set (0.16 sec)
```

Para obter uma visão hierárquica da tabela `t1` com todos os seus objetos dependentes, execute uma consulta semelhante à seguinte, que seleciona o nome indentado de cada objeto que tem `test/def/t1` como o nome do seu objeto raiz:

```
mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/t1';
+----------------------------+
| indented_name              |
+----------------------------+
| test/def/t1                |
|   -> sys/def/13/b          |
|     -> NDB$INDEX_15_CUSTOM |
|   -> sys/def/13/b$unique   |
|     -> NDB$INDEX_16_UI     |
|   -> sys/def/13/PRIMARY    |
|     -> NDB$INDEX_14_CUSTOM |
+----------------------------+
7 rows in set (0.15 sec)
```

Ao trabalhar com tabelas de Dados de disco, observe que, neste contexto, um espaço de tabelas ou grupo de arquivos de registro é considerado um objeto raiz. Isso significa que você deve conhecer o nome de qualquer espaço de tabelas ou grupo de arquivos de registro associado a uma tabela específica, ou obter essas informações de `SHOW CREATE TABLE` e, em seguida, consultar `INFORMATION_SCHEMA.FILES`, ou meios semelhantes, como mostrado aqui:

```
mysql> SHOW CREATE TABLE test.dt_1\G
*************************** 1. row ***************************
       Table: dt_1
Create Table: CREATE TABLE `dt_1` (
  `member_id` int unsigned NOT NULL AUTO_INCREMENT,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `joined` date NOT NULL,
  PRIMARY KEY (`member_id`),
  KEY `last_name` (`last_name`,`first_name`)
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SELECT DISTINCT TABLESPACE_NAME, LOGFILE_GROUP_NAME
    -> FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='ts_1';
+-----------------+--------------------+
| TABLESPACE_NAME | LOGFILE_GROUP_NAME |
+-----------------+--------------------+
| ts_1            | lg_1               |
+-----------------+--------------------+
1 row in set (0.00 sec)
```

Agora você pode obter informações hierárquicas para a tabela, o tablespace e o grupo de arquivos de registro da seguinte forma:

```
mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/dt_1';
+----------------------------+
| indented_name              |
+----------------------------+
| test/def/dt_1              |
|   -> sys/def/23/last_name  |
|     -> NDB$INDEX_25_CUSTOM |
|   -> sys/def/23/PRIMARY    |
|     -> NDB$INDEX_24_CUSTOM |
+----------------------------+
5 rows in set (0.15 sec)

mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'ts_1';
+-----------------+
| indented_name   |
+-----------------+
| ts_1            |
|   -> data_1.dat |
|   -> data_2.dat |
+-----------------+
3 rows in set (0.17 sec)

mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name LIKE 'lg_1';
+-----------------+
| indented_name   |
+-----------------+
| lg_1            |
|   -> undo_1.log |
|   -> undo_2.log |
+-----------------+
3 rows in set (0.16 sec)
```

A tabela `dict_obj_tree` foi adicionada no NDB 8.0.24.

#### 25.6.16.26 A tabela ndbinfo dict_obj_types

A tabela `dict_obj_types` é uma tabela estática que lista os possíveis tipos de objetos do dicionário utilizados no kernel NDB. Estes são os mesmos tipos definidos por `Object::Type` na API NDB.

A tabela `dict_obj_types` contém as seguintes colunas:

* `type_id`

O ID do tipo para este tipo

* `type_name`

O nome deste tipo

#### 25.6.16.27 Tabela ndbinfo disk_write_speed_base

A tabela `disk_write_speed_base` fornece informações básicas sobre a velocidade de escrita em disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_base` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `thr_no`

ID do fio deste fio LDM

* `millis_ago`

Milissegundos desde o término deste período de relatórios

* `millis_passed`

Houve milissegundos nesse período de relatórios

* `backup_lcp_bytes_written`

Número de bytes escritos no disco por pontos de verificação locais e processos de backup durante este período

* `redo_bytes_written`

Número de bytes escritos no log REDO durante este período

* `target_disk_write_speed`

Velocidade real de escrita de disco por fio LDM (dados básicos)

#### 25.6.16.28 Tabela ndbinfo disk_write_speed_aggregate

A tabela `disk_write_speed_aggregate` fornece informações agregadas sobre a velocidade de escrita em disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `thr_no`

ID do fio deste fio LDM

* `backup_lcp_speed_last_sec`

Número de bytes escritos no disco pelos processos de backup e LCP no último segundo

* `redo_speed_last_sec`

Número de bytes escritos no log REDO na última segunda-feira

* `backup_lcp_speed_last_10sec`

Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 10 segundos

* `redo_speed_last_10sec`

Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_10sec`

Desvio padrão no número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

* `std_dev_redo_speed_last_10sec`

Desvio padrão no número de bytes escritos no log do REDO por segundo, calculado em média nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 60 segundos

* `redo_speed_last_60sec`

Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_60sec`

Desvio padrão no número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

* `std_dev_redo_speed_last_60sec`

Desvio padrão no número de bytes escritos no log do REDO por segundo, calculado em média nos últimos 60 segundos

* `slowdowns_due_to_io_lag`

Número de segundos desde a última vez que os escritos no disco foram retardados devido ao atraso do I/O do log REDO

* `slowdowns_due_to_high_cpu`

Número de segundos desde a última vez que os escritos no disco foram retardados devido ao uso elevado da CPU

* `disk_write_speed_set_to_min`

Número de segundos desde a última vez que a velocidade de escrita do disco foi definida como mínima

* `current_target_disk_write_speed`

Velocidade real de escrita de disco por thread do LDM (agregada)

#### 25.6.16.29 A tabela ndbinfo disk_write_speed_aggregate_node

A tabela `disk_write_speed_aggregate_node` fornece informações agregadas por nó sobre a velocidade das gravações de disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate_node` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `backup_lcp_speed_last_sec`

Número de bytes escritos no disco pelos processos de backup e LCP no último segundo

* `redo_speed_last_sec`

Número de bytes escritos no log de refazer no último segundo

* `backup_lcp_speed_last_10sec`

Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 10 segundos

* `redo_speed_last_10sec`

Número de bytes escritos no log de refazer a cada segundo, calculado em média nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 60 segundos

* `redo_speed_last_60sec`

Número de bytes escritos no log de refazer a cada segundo, calculado em média nos últimos 60 segundos

#### 25.6.16.30 A tabela ndbinfo diskpagebuffer

A tabela `diskpagebuffer` fornece estatísticas sobre o uso do buffer de página do disco pelas tabelas de dados de disco do NDB Cluster.

A tabela `diskpagebuffer` contém as seguintes colunas:

* `node_id`

O ID do nó de dados

* `block_instance`

Instância de bloco

* `pages_written`

Número de páginas escritas no disco.

* `pages_written_lcp`

Número de páginas escritas por pontos de controle locais.

* `pages_read`

Número de páginas lidas do disco

* `log_waits`

Número de escritas de página esperando para o log ser escrito no disco

* `page_requests_direct_return`

Número de solicitações para páginas que estavam disponíveis no buffer

* `page_requests_wait_queue`

Número de solicitações que tiveram que esperar até que as páginas se tornem disponíveis no buffer

* `page_requests_wait_io`

Número de solicitações que tiveram que ser lidas a partir de páginas no disco (as páginas não estavam disponíveis no buffer)

##### Notas

Você pode usar esta tabela com tabelas de dados de disco do NDB Cluster para determinar se `DiskPageBufferMemory` é suficientemente grande para permitir que os dados sejam lidos do buffer em vez do disco; minimizar os acessos ao disco pode ajudar a melhorar o desempenho dessas tabelas.

Você pode determinar a proporção de leituras de `DiskPageBufferMemory` em relação ao número total de leituras usando uma consulta como esta, que obtém essa proporção como uma porcentagem:

```
SELECT
  node_id,
  100 * page_requests_direct_return /
    (page_requests_direct_return + page_requests_wait_io)
      AS hit_ratio
FROM ndbinfo.diskpagebuffer;
```

O resultado dessa consulta deve ser semelhante ao que é mostrado aqui, com uma linha para cada nó de dados no clúster (neste exemplo, o clúster tem 4 nós de dados):

```
+---------+-----------+
| node_id | hit_ratio |
+---------+-----------+
|       5 |   97.6744 |
|       6 |   97.6879 |
|       7 |   98.1776 |
|       8 |   98.1343 |
+---------+-----------+
4 rows in set (0.00 sec)
```

Valores de `hit_ratio` próximos a 100% indicam que apenas um número muito pequeno de leituras está sendo feito a partir do disco em vez do buffer, o que significa que o desempenho de leitura de Dados do Disco está se aproximando de um nível ótimo. Se algum desses valores for menor que 95%, isso é um forte indicador de que o ajuste para `DiskPageBufferMemory` precisa ser aumentado no arquivo `config.ini`.

Nota

Uma mudança em `DiskPageBufferMemory` exige um reinício contínuo de todos os nós de dados do cluster antes que ela entre em vigor.

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`. Usando essas informações, você pode obter informações sobre métricas de buffer de página de disco relacionadas a cada thread; um exemplo de consulta usando `LIMIT 1` para limitar a saída a um único thread é mostrado aqui:

```
mysql> SELECT
     >   node_id, thr_no, block_name, thread_name, pages_written,
     >   pages_written_lcp, pages_read, log_waits,
     >   page_requests_direct_return, page_requests_wait_queue,
     >   page_requests_wait_io
     > FROM ndbinfo.diskpagebuffer
     >   INNER JOIN ndbinfo.threadblocks USING (node_id, block_instance)
     >   INNER JOIN ndbinfo.threads USING (node_id, thr_no)
     > WHERE block_name = 'PGMAN' LIMIT 1\G
*************************** 1. row ***************************
                    node_id: 1
                     thr_no: 1
                 block_name: PGMAN
                thread_name: rep
              pages_written: 0
          pages_written_lcp: 0
                 pages_read: 1
                  log_waits: 0
page_requests_direct_return: 4
   page_requests_wait_queue: 0
      page_requests_wait_io: 1
1 row in set (0.01 sec)
```

#### 25.6.16.31 Tabela ndbinfo diskstat

A tabela `diskstat` fornece informações sobre os registros nos espaços de dados de tabela de Disco durante o último segundo.

A tabela `diskstat` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `block_instance`

ID da instância de relato de `PGMAN`

* `pages_made_dirty`

Número de páginas que ficaram sujas durante o último segundo

* `reads_issued`

Leitura emitida durante o último segundo

* `reads_completed`

Leitura concluída durante o último segundo

* `writes_issued`

Publicações emitidas durante o último segundo

* `writes_completed`

Escreve concluído durante o último segundo

* `log_writes_issued`

Número de vezes que uma escrita na página exigiu uma escrita no log nos últimos segundos

* `log_writes_completed`

Número de registros de escrita concluídos durante o último segundo

* `get_page_calls_issued`

Número de chamadas `get_page()` emitidas durante o último segundo

* `get_page_reqs_issued`

Número de vezes que uma chamada `get_page()` resultou em uma espera por I/O ou conclusão de I/O já iniciada no último segundo

* `get_page_reqs_completed`

Número de chamadas `get_page()` em espera por I/O ou conclusão de I/O que foram concluídas no último segundo

##### Notas

Cada linha desta tabela corresponde a uma instância de `PGMAN`; há uma instância por cada fio do LDM, além de uma instância adicional para cada nó de dados.

#### 25.6.16.32 A tabela ndbinfo diskstats_1sec

A tabela `diskstats_1sec` fornece informações sobre os registros nos espaços de dados de tabela de Disco nos últimos 20 segundos.

A tabela `diskstat` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `block_instance`

ID da instância de relato de `PGMAN`

* `pages_made_dirty`

Páginas que ficaram sujas durante o intervalo designado de 1 segundo

* `reads_issued`

Leitura emitida durante o intervalo designado de 1 segundo

* `reads_completed`

Leitura concluída durante o intervalo designado de 1 segundo

* `writes_issued`

Escrutas emitidas durante o intervalo designado de 1 segundo

* `writes_completed`

Escreve concluído durante o intervalo designado de 1 segundo

* `log_writes_issued`

Número de vezes que uma escrita na página exigiu uma escrita no log durante o intervalo designado de 1 segundo

* `log_writes_completed`

Número de gravações de log concluídas durante o intervalo designado de 1 segundo

* `get_page_calls_issued`

Número de chamadas `get_page()` emitidas durante o intervalo designado de 1 segundo

* `get_page_reqs_issued`

Número de vezes que uma chamada `get_page()` resultou em espera para I/O ou conclusão de I/O já iniciada durante o intervalo designado de 1 segundo

* `get_page_reqs_completed`

Número de chamadas `get_page()` em espera de I/O ou conclusão de I/O que foram concluídas durante o intervalo designado de 1 segundo

* `seconds_ago`

Número de intervalos de 1 segundo no passado do intervalo ao qual esta linha se aplica

##### Notas

Cada linha desta tabela corresponde a uma instância de `PGMAN` durante um intervalo de 1 segundo que ocorreu entre 0 e 19 segundos atrás; há uma dessas instâncias por cada thread do LDM, além de uma instância adicional para cada nó de dados.

#### 25.6.16.33 Tabela de mensagens de erro ndbinfo_info

A tabela `error_messages` fornece informações sobre

A tabela `error_messages` contém as seguintes colunas:

* `error_code`

Código de erro numérico

* `error_description`

Descrição do erro

* `error_status`

Código de status de erro

* `error_classification`

Código de classificação de erro

##### Notas

`error_code` é um código de erro numérico do NDB. Este é o mesmo código de erro que pode ser fornecido ao **ndb_perror**.

`error_description` fornece uma descrição básica da condição que está causando o erro.

A coluna `error_status` fornece informações de status relacionadas ao erro. Os valores possíveis para esta coluna estão listados aqui:

* `No error`
* `Illegal connect string`
* `Illegal server handle`
* `Illegal reply from server`
* `Illegal number of nodes`
* `Illegal node status`
* `Out of memory`
* `Management server not connected`
* `Could not connect to socket`
* `Start failed`
* `Stop failed`
* `Restart failed`
* `Could not start backup`
* `Could not abort backup`
* `Could not enter single user mode`
* `Could not exit single user mode`
* `Failed to complete configuration change`
* `Failed to get configuration`
* `Usage error`
* `Success`
* `Permanent error`
* `Temporary error`
* `Unknown result`
* `Temporary error, restart node`
* `Permanent error, external action needed`
* `Ndbd file system error, restart node initial`

* `Unknown`

A coluna error_classification mostra a classificação do erro. Consulte as Classificações de Erro NDB, para obter informações sobre os códigos de classificação e seus significados.

#### 25.6.16.34 Tabela de eventos ndbinfo

Esta tabela fornece informações sobre as assinaturas de eventos em `NDB`. As colunas da tabela `events` estão listadas aqui, com descrições breves de cada uma:

* `event_id`

O ID do evento

* `name`

O nome do evento

* `table_id`

O ID da tabela em que o evento ocorreu

* `reporting`

Um dos `updated`, `all`, `subscribe` ou `DDL`

* `columns`

Uma lista de colunas separadas por vírgula afetadas pelo evento

* `table_event`

Um ou mais dos `INSERT`, `DELETE`, `UPDATE`, `SCAN`, `DROP`, `ALTER`, `CREATE`, `GCP_COMPLETE`, `CLUSTER_FAILURE`, `STOP`, `NODE_FAILURE`, `SUBSCRIBE`, `UNSUBSCRIBE`, e `ALL` (definidos por `Event::TableEvent` na API NDB)

A tabela `events` foi adicionada no NDB 8.0.29.

#### 25.6.16.35 Tabela dos arquivos ndbinfo

As tabelas `files` fornecem informações sobre os arquivos e outros objetos utilizados pelas tabelas de dados de disco `NDB`, e contêm as colunas listadas aqui:

* `id`

ID do objeto

* `type`

O tipo de objeto; um dos `Log file group`, `Tablespace`, `Undo file` ou `Data file`

* `name`

O nome do objeto

* `parent`

ID do objeto pai

* `parent_name`

Nome do objeto pai

* `free_extents`

Número de extensões gratuitas

* `total_extents`

Número total de extensões

* `extent_size`

Tamanho do arquivo (MB)

* `initial_size`

Tamanho inicial (bytes)

* `maximum_size`

Tamanho máximo (bytes)

* `autoextend_size`

Tamanho automático de extensão (bytes)

Para grupos de arquivos de registro e espaços de tabela, `parent` é sempre `0`, e as colunas `parent_name`, `free_extents`, `total_extents`, `extent_size`, `initial_size`, `maximum_size` e `autoentend_size` são todas `NULL`.

A tabela `files` está vazia se nenhum objeto de dados de disco tiver sido criado em `NDB`. Consulte a Seção 25.6.11.1, “Objetos de dados de disco de cluster NDB”, para obter mais informações.

A tabela `files` foi adicionada no NDB 8.0.29.

Veja também a Seção 28.3.15, “A Tabela INFORMATION_SCHEMA FILES”.

#### 25.6.16.36 A tabela ndbinfo foreign_keys estrangeira

A tabela `foreign_keys` fornece informações sobre as chaves estrangeiras nas tabelas `NDB`. Esta tabela tem as seguintes colunas:

* `object_id`

O ID do objeto da chave estrangeira

* `name`

Nome da chave estrangeira

* `parent_table`

O nome da tabela-mãe da chave estrangeira

* `parent_columns`

Uma lista delimitada por vírgula de colunas parentes

* `child_table`

O nome da tabela de crianças

* `child_columns`

Uma lista de colunas infantis separadas por vírgula

* `parent_index`

Nome do índice principal

* `child_index`

Nome do índice de crianças

* `on_update_action`

A ação `ON UPDATE` especificada para a chave estrangeira; uma das `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`

* `on_delete_action`

A ação `ON DELETE` especificada para a chave estrangeira; uma das `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`

A tabela `foreign_keys` foi adicionada no NDB 8.0.29.

#### 25.6.16.37 Tabela ndbinfo hash_maps

* `id`

ID único do mapa de hash

* `version`

Versão do mapa de hash (número inteiro)

* `state`

Mapa de estado de hash; veja Object::State para valores e descrições.

* `fq_name`

O nome totalmente qualificado do mapa de hash

A tabela `hash_maps` é, na verdade, uma visão que consiste nas quatro colunas com os mesmos nomes da tabela `dict_obj_info`, conforme mostrado aqui:

```
CREATE VIEW hash_maps AS
  SELECT id, version, state, fq_name
  FROM dict_obj_info
  WHERE type=24;  # Hash map; defined in dict_obj_types
```

Veja a descrição de `dict_obj_info` para mais informações.

A tabela `hash_maps` foi adicionada no NDB 8.0.29.

#### 25.6.16.38 Tabela ndbinfo hwinfo

A tabela `hwinfo` fornece informações sobre o hardware no qual um nó de dados específico é executado.

A tabela `hwinfo` contém as seguintes colunas:

* `node_id`

ID do nó

* `cpu_cnt_max`

Número de processadores neste host

* `cpu_cnt`

Número de processadores disponíveis para este nó

* `num_cpu_cores`

Número de núcleos da CPU neste host

* `num_cpu_sockets`

Número de soquetes do CPU neste host

* `HW_memory_size`

Quantidade de memória disponível neste host

* `model_name`

Nome do modelo do processador

##### Notas

A tabela `hwinfo` está disponível em todos os sistemas operacionais suportados por `NDB`.

Essa tabela foi adicionada no NDB 8.0.23.

#### 25.6.16.39 A tabela ndbinfo index_columns

Esta tabela fornece informações sobre índices nas tabelas `NDB`. As colunas da tabela `index_columns` estão listadas aqui, juntamente com descrições breves:

* `table_id`

ID único da tabela `NDB` para a qual o índice é definido

* Nome do banco de dados que contém esta tabela

  `varchar(64)`

* `table_name`

Nome da tabela

* `index_object_id`

ID do objeto deste índice

* `index_name`

Nome do índice; se o índice não tiver um nome, o nome da primeira coluna do índice é usado

* `index_type`

Tipo de índice; normalmente, este é 3 (índice de hash único) ou 6 (índice ordenado); os valores são os mesmos que os da coluna `type_id` da tabela `dict_obj_types`

* `status`

Um dos `new`, `changed`, `retrieved`, `invalid` ou `altered`

* `columns`

Uma lista delimitada por vírgula de colunas que compõem o índice

A tabela `index_columns` foi adicionada no NDB 8.0.29.

#### 25.6.16.40 A tabela ndbinfo index_stats

A tabela `index_stats` fornece informações básicas sobre as estatísticas do índice `NDB`.

Mais informações completas sobre estatísticas de índice podem ser obtidas usando o utilitário **ndb_index_stat**.

A tabela `index_stats` contém as seguintes colunas:

* `index_id`

ID do índice

* `index_version`

Versão do índice

* `sample_version`

Versão de amostra

##### Notas

Esta tabela foi adicionada no NDB 8.0.28.

#### 25.6.16.41 A tabela ndbinfo locks_per_fragment

A tabela `locks_per_fragment` fornece informações sobre o número de solicitações de bloqueio e os resultados dessas solicitações, em uma base por fragmento, servindo como uma tabela complementar para `operations_per_fragment` e `memory_per_fragment`. Esta tabela também mostra o tempo total gasto esperando por bloqueios com sucesso e sem sucesso desde a criação do fragmento ou da tabela, ou desde o mais recente reinício.

A tabela `locks_per_fragment` contém as seguintes colunas:

* `fq_name`

Nome de tabela totalmente qualificado

* `parent_fq_name`

Nome totalmente qualificado do objeto pai

* `type`

Tipo de tabela; veja o texto para os possíveis valores

* `table_id`

Tabela ID

* `node_id`

ID do nó de relatório

* `block_instance`

ID da instância do LDM

* `fragment_num`

Identificador do fragmento

* `ex_req`

Solicitações de bloqueio exclusivo iniciadas

* `ex_imm_ok`

Pedidos de bloqueio exclusivo concedidos imediatamente

* `ex_wait_ok`

Solicitações de bloqueio exclusivo concedidas após espera

* `ex_wait_fail`

Pedidos de bloqueio exclusivo não concedidos

* `sh_req`

Solicitações de bloqueio compartilhado iniciadas

* `sh_imm_ok`

Pedidos de bloqueio compartilhado concedidos imediatamente

* `sh_wait_ok`

Solicitações de bloqueio compartilhado concedidas após espera

* `sh_wait_fail`

Solicitações de bloqueio compartilhado não concedidas

* `wait_ok_millis`

Tempo gasto esperando por solicitações de bloqueio que foram concedidas, em milissegundos

* `wait_fail_millis`

Tempo gasto esperando por solicitações de bloqueio que falharam, em milissegundos

##### Notas

`block_instance` refere-se a uma instância de um bloco do kernel. Junto com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

`fq_name` é um nome de objeto de banco de dados totalmente qualificado no formato *`database`*/*`schema`*/*`name`* e assim por diante, como `test/def/t1` ou `sys/def/10/b$unique`.

`parent_fq_name` é o nome totalmente qualificado do objeto pai (tabela) deste objeto.

`table_id` é o ID interno da tabela gerado por `NDB`. Este é o mesmo ID interno da tabela mostrado em outras tabelas `ndbinfo`; também é visível na saída de **ndb_show_tables**.

A coluna `type` mostra o tipo de tabela. Isso é sempre um dos `System table`, `User table`, `Unique hash index`, `Hash index`, `Unique ordered index`, `Ordered index`, `Hash index trigger`, `Subscription trigger`, `Read only constraint`, `Index trigger`, `Reorganize trigger`, `Tablespace`, `Log file group`, `Data file`, `Undo file`, `Hash map`, `Foreign key definition`, `Foreign key parent trigger`, `Foreign key child trigger`, ou `Schema transaction`.

Os valores exibidos em todas as colunas `ex_req`, `ex_req_imm_ok`, `ex_wait_ok`, `ex_wait_fail`, `sh_req`, `sh_req_imm_ok`, `sh_wait_ok` e `sh_wait_fail` representam números acumulados de solicitações desde que a tabela ou fragmento foi criada, ou desde o último reinício deste nó, o que ocorrer posteriormente. Isso também é válido para os valores de tempo exibidos nas colunas `wait_ok_millis` e `wait_fail_millis`.

Cada solicitação de bloqueio é considerada como estando em andamento ou como tendo sido concluída de alguma forma (ou seja, como tendo sido bem-sucedida ou falha). Isso significa que as seguintes relações são verdadeiras:

```
ex_req >= (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

sh_req >= (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

O número de solicitações atualmente em andamento é o número atual de solicitações incompletas, que podem ser encontradas conforme mostrado aqui:

```
[exclusive lock requests in progress] =
    ex_req - (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

[shared lock requests in progress] =
    sh_req - (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

Um pedido de espera falhado indica uma transação abortada, mas o abort pode ou não ser causado por um timeout de espera de bloqueio. Você pode obter o número total de abortos enquanto espera por bloqueios, conforme mostrado aqui:

```
[aborts while waiting for locks] = ex_wait_fail + sh_wait_fail
```

#### 25.6.16.42 Tabela ndbinfo logbuffers

A tabela `logbuffer` fornece informações sobre o uso do buffer de registro do NDB Cluster.

A tabela `logbuffers` contém as seguintes colunas:

* `node_id`

O ID deste nó de dados.

* `log_type`

Tipo de registro. Um dos seguintes: `REDO`, `DD-UNDO`, `BACKUP-DATA` ou `BACKUP-LOG`.

* `log_id`

O ID do log; para arquivos de registro de desfazer de dados de disco, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` do esquema de informações `FILES` tabela, bem como o valor mostrado para a coluna `log_id` da tabela `ndbinfo` `logspaces`

* `log_part`

O número do item do log

* `total`

Espaço total disponível para este log

* `used`

Espaço utilizado por este log

##### Notas

As linhas da tabela `logbuffers` que refletem dois tipos adicionais de log estão disponíveis ao realizar um backup do NDB. Uma dessas linhas tem o tipo de log `BACKUP-DATA`, que mostra a quantidade de buffer de dados usado durante o backup para copiar fragmentos para arquivos de backup. A outra linha tem o tipo de log `BACKUP-LOG`, que exibe a quantidade de buffer de log usado durante o backup para registrar as alterações feitas após o início do backup. Cada uma dessas linhas `log_type` é mostrada na tabela `logbuffers` para cada nó de dados no clúster. Essas linhas não estão presentes a menos que um backup do NDB esteja sendo realizado atualmente.

#### 25.6.16.43 Tabela ndbinfo logspaces

Esta tabela fornece informações sobre o uso do espaço de registro do NDB Cluster.

A tabela `logspaces` contém as seguintes colunas:

* `node_id`

O ID deste nó de dados.

* `log_type`

Tipo de registro; um dos seguintes: `REDO` ou `DD-UNDO`.

* `node_id`

O ID do log; para arquivos de registro de desfazer de dados de disco, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` do esquema de informações `FILES` tabela, bem como o valor mostrado para a coluna `log_id` da tabela `ndbinfo` `logbuffers`

* `log_part`

O número do item do registro.

* `total`

Espaço total disponível para este log.

* `used`

Espaço utilizado por este log.

#### 25.6.16.44 Tabela de membros do ndbinfo

A tabela `membership` descreve a visão que cada nó de dados tem sobre todos os outros no clúster, incluindo a filiação ao grupo de nós, o nó presidente, o árbitro, o sucessor do árbitro, os estados de conexão do árbitro e outras informações.

A tabela `membership` contém as seguintes colunas:

* `node_id`

ID do nó deste nó

* `group_id`

Grupo de nós ao qual este nó pertence

* `left node`

ID do nó do nó anterior

* `right_node`

ID do nó do próximo nó

* `president`

ID do nó do presidente

* `successor`

ID do nó do sucessor do presidente

* `succession_order`

Ordem em que este nó sucede à presidência

* `Conf_HB_order`

  -

* `arbitrator`

ID do nó do árbitro

* `arb_ticket`

Identificador interno usado para rastrear a arbitragem

* `arb_state`

Estado de arbitragem

* `arb_connected`

Se este nó está conectado ao árbitro; qualquer um dos `Yes` ou `No`

* `connected_rank1_arbs`

Arbitristas conectados de grau 1

* `connected_rank2_arbs`

Arbitristas conectados de grau 1

##### Notas

O ID do nó e o ID do grupo de nó são os mesmos que relatados por **ndb_mgm -e "SHOW"**.

`left_node` e `right_node` são definidos em termos de um modelo que conecta todos os nós de dados em um círculo, na ordem de seus IDs de nó, semelhante à ordem dos números em um mostrador de relógio, conforme mostrado aqui:

**Figura 25.6. Disposição circular dos nós do cluster NDB**

![Content is described in the surrounding text.](images/cluster-left-right.png)

Neste exemplo, temos 8 nós de dados, numerados 5, 6, 7, 8, 12, 13, 14 e 15, ordenados no sentido horário em um círculo. Determinamos “esquerda” e “direita” do interior do círculo. O nó à esquerda do nó 5 é o nó 15, e o nó à direita do nó 5 é o nó 6. Você pode ver todas essas relações executando a seguinte consulta e observando a saída:

```
mysql> SELECT node_id,left_node,right_node
    -> FROM ndbinfo.membership;
+---------+-----------+------------+
| node_id | left_node | right_node |
+---------+-----------+------------+
|       5 |        15 |          6 |
|       6 |         5 |          7 |
|       7 |         6 |          8 |
|       8 |         7 |         12 |
|      12 |         8 |         13 |
|      13 |        12 |         14 |
|      14 |        13 |         15 |
|      15 |        14 |          5 |
+---------+-----------+------------+
8 rows in set (0.00 sec)
```

As designações “esquerda” e “direita” são usadas no registro de eventos da mesma forma.

O nó `president` é o nó que o nó atual considera responsável por definir um árbitro (veja as fases de início do NDB Cluster). Se o presidente falhar ou se desconectar, o nó atual espera que o nó cuja ID é mostrado na coluna `successor` se torne o novo presidente. A coluna `succession_order` mostra o lugar na fila de sucessão que o nó atual considera que possui.

Em um NDB Cluster normal, todos os nós de dados devem ver o mesmo nó como `president`, e o mesmo nó (exceto o presidente) como seu `successor`. Além disso, o presidente atual deve se ver como `1` na ordem de sucessão, o nó `successor` deve se ver como `2`, e assim por diante.

Todos os nós devem exibir os mesmos valores de `arb_ticket` e os mesmos valores de `arb_state`. Os possíveis valores de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se este nó está conectado ao nó mostrado como `arbitrator` deste nó.

As colunas `connected_rank1_arbs` e `connected_rank2_arbs` exibem, cada uma, uma lista de 0 ou mais árbitros que possuem um `ArbitrationRank` igual a 1, ou a 2, respectivamente.

Nota

Tanto os nós de gerenciamento quanto os nós de API são elegíveis para se tornarem árbitros.

#### 25.6.16.45 A tabela ndbinfo memoryusage

A consulta a esta tabela fornece informações semelhantes às fornecidas pelo comando `ALL REPORT MemoryUsage` (mysql-cluster-mgm-client-commands.html#ndbclient-report) no cliente **ndb_mgm**, ou registradas por `ALL DUMP 1000` (/doc/ndb-internals/en/dump-command-1000.html).

A tabela `memoryusage` contém as seguintes colunas:

* `node_id`

O ID do nó deste nó de dados.

* `memory_type`

Um dos `Data memory`, `Index memory` ou `Long message buffer`.

* `used`

Número de bytes atualmente utilizados para memória de dados ou memória de índice por este nó de dados.

* `used_pages`

Número de páginas atualmente utilizadas para memória de dados ou memória de índice por este nó de dados; veja o texto.

* `total`

Número total de bytes de memória de dados ou memória de índice disponíveis para este nó de dados; veja o texto.

* `total_pages`

Número total de páginas de memória disponíveis para memória de dados ou memória de índice neste nó de dados; veja o texto.

##### Notas

A coluna `total` representa o valor total de memória em bytes disponível para o recurso dado (memória de dados ou memória de índice) em um nó de dados específico. Esse número deve ser aproximadamente igual ao ajuste do parâmetro de configuração correspondente no arquivo `config.ini`.

Suponha que o cluster tenha 2 nós de dados com IDs de nó `5` e `6`, e o arquivo `config.ini` contenha o seguinte:

```
[ndbd default]
DataMemory = 1G
IndexMemory = 1G
```

Suponha também que o valor do parâmetro de configuração `LongMessageBuffer` seja permitido assumir seu valor padrão (64 MB).

A consulta a seguir mostra aproximadamente os mesmos valores:

```
mysql> SELECT node_id, memory_type, total
     > FROM ndbinfo.memoryusage;
+---------+---------------------+------------+
| node_id | memory_type         | total      |
+---------+---------------------+------------+
|       5 | Data memory         | 1073741824 |
|       5 | Index memory        | 1074003968 |
|       5 | Long message buffer |   67108864 |
|       6 | Data memory         | 1073741824 |
|       6 | Index memory        | 1074003968 |
|       6 | Long message buffer |   67108864 |
+---------+---------------------+------------+
6 rows in set (0.00 sec)
```

Neste caso, os valores da coluna `total` para memória de índice são ligeiramente maiores que o valor definido para `IndexMemory`, devido à arredondamento interno.

Para as colunas `used_pages` e `total_pages`, os recursos são medidos em páginas, que têm 32K de tamanho para `DataMemory` e 8K para `IndexMemory`. Para a memória de buffer de mensagens longa, o tamanho da página é de 256 bytes.

#### 25.6.16.46 A tabela ndbinfo memory_per_fragment

* tabela memory_per_fragment: Notas
* tabela memory_per_fragment: Exemplos

A tabela `memory_per_fragment` fornece informações sobre o uso da memória por fragmentos individuais. Veja as Notas mais adiante nesta seção para ver como você pode usar isso para descobrir quanto da memória é usado pelas tabelas `NDB`.

A tabela `memory_per_fragment` contém as seguintes colunas:

* `fq_name`

Nome deste fragmento

* `parent_fq_name`

Nome do pai deste fragmento

* `type`

Tipo de objeto do dicionário (`Object::Type`, na API NDB) usado para este fragmento; um dos `System table`, `User table`, `Unique hash index`, `Hash index`, `Unique ordered index`, `Ordered index`, `Hash index trigger`, `Subscription trigger`, `Read only constraint`, `Index trigger`, `Reorganize trigger`, `Tablespace`, `Log file group`, `Data file`, `Undo file`, `Hash map`, `Foreign key definition`, `Foreign key parent trigger`, `Foreign key child trigger`, ou `Schema transaction`.

Você também pode obter essa lista executando `TABLE` `ndbinfo.dict_obj_types` no cliente **mysql**.

* `table_id`

ID da tabela para esta tabela

* `node_id`

ID do nó para este nó

* `block_instance`

ID do bloco do núcleo do NDB; você pode usar esse número para obter informações sobre os threads específicos da tabela `threadblocks`.

* `fragment_num`

ID de fragmento (número)

* `fixed_elem_alloc_bytes`

Número de bytes alocados para elementos de tamanho fixo

* `fixed_elem_free_bytes`

Bytes livres restantes em páginas alocadas para elementos de tamanho fixo

* `fixed_elem_size_bytes`

Comprimento de cada elemento de tamanho fixo em bytes

* `fixed_elem_count`

Número de elementos de tamanho fixo

* `fixed_elem_free_count`

Número de linhas livres para elementos de tamanho fixo

* `var_elem_alloc_bytes`

Número de bytes alocados para elementos de tamanho variável

* `var_elem_free_bytes`

Bytes livres restantes em páginas alocadas para elementos de tamanho variável

* `var_elem_count`

Número de elementos de tamanho variável

* `hash_index_alloc_bytes`

Número de bytes alocados para índices de hash

##### tabela_memoria_por_fragmento: Notas

A tabela `memory_per_fragment` contém uma linha para cada réplica de fragmento de tabela e cada réplica de fragmento de índice no sistema; isso significa, por exemplo, que, quando `NoOfReplicas=2`, normalmente existem duas réplicas de fragmento para cada fragmento. Isso é verdade enquanto todos os nós de dados estão em execução e conectados ao clúster; para um nó de dados que está faltando, não existem linhas para as réplicas de fragmento que ele hospeda.

As colunas da tabela `memory_per_fragment` podem ser agrupadas de acordo com sua função ou propósito da seguinte forma:

* Colunas principais: `fq_name`, `type`, `table_id`, `node_id`, `block_instance` e `fragment_num`

* Coluna de relacionamento: `parent_fq_name`

* Colunas de armazenamento de tamanho fixo: `fixed_elem_alloc_bytes`, `fixed_elem_free_bytes`, `fixed_elem_size_bytes`, `fixed_elem_count` e `fixed_elem_free_count`

* Colunas de armazenamento de tamanho variável: `var_elem_alloc_bytes`, `var_elem_free_bytes` e `var_elem_count`

*Coluna de índice de hash*: `hash_index_alloc_bytes`

As colunas `parent_fq_name` e `fq_name` podem ser usadas para identificar índices associados a uma tabela. Informações semelhantes sobre a hierarquia de objetos do esquema estão disponíveis em outras tabelas `ndbinfo`.

As réplicas de fragmentos de tabela e índice alocam `DataMemory` em páginas de 32 KB. Essas páginas de memória são gerenciadas conforme listado aqui:

*Páginas de tamanho fixo*: Elas armazenam as partes de tamanho fixo das linhas armazenadas em um fragmento dado. Cada linha tem uma parte de tamanho fixo.

*Páginas de tamanho variável*: Elas armazenam partes de tamanho variável para as linhas no fragmento. Cada linha que possui uma ou mais colunas dinâmicas de tamanho variável (ou ambas) tem uma parte de tamanho variável.

*Páginas de índice de hash*: Elas são alocadas como subpáginas de 8 KB e armazenam a estrutura do índice de hash da chave primária.

Cada linha de uma tabela `NDB` tem uma parte de tamanho fixo, composta por um cabeçalho de linha e uma ou mais colunas de tamanho fixo. A linha também pode conter uma ou mais referências de parte de tamanho variável, uma ou mais referências de parte de disco ou ambas. Cada linha também tem uma entrada de índice de hash de chave primária (correspondente à chave primária oculta que faz parte de cada tabela `NDB`).

A partir do que foi dito acima, podemos ver que cada fragmento de tabela e cada fragmento de índice alocam juntos a quantidade de `DataMemory`, calculada conforme mostrado aqui:

```
DataMemory =
  (number_of_fixed_pages + number_of_var_pages) * 32KB
    + number_of_hash_pages * 8KB
```

Como `fixed_elem_alloc_bytes` e `var_elem_alloc_bytes` são sempre múltiplos de 32768 bytes, podemos determinar ainda que `number_of_fixed_pages = fixed_elem_alloc_bytes / 32768` e `number_of_var_pages = var_elem_alloc_bytes / 32768`. `hash_index_alloc_bytes` é sempre um múltiplo de 8192 bytes, então `number_of_hash_pages = hash_index_alloc_bytes / 8192`.

Uma página de tamanho fixo possui um cabeçalho interno e um número de faixas de tamanho fixo, cada uma das quais pode conter a parte de tamanho fixo de uma linha. O tamanho da parte de tamanho fixo de uma determinada linha depende do esquema e é fornecido pela coluna `fixed_elem_size_bytes`; o número de faixas de tamanho fixo por página pode ser determinado calculando o número total de faixas e o número total de páginas, da seguinte forma:

```
fixed_slots = fixed_elem_count + fixed_elem_free_count

fixed_pages = fixed_elem_alloc_bytes / 32768

slots_per_page = total_slots / total_pages
```

`fixed_elem_count` é, na verdade, o número de linhas de um fragmento de tabela dado, já que cada linha tem 1 elemento fixo, `fixed_elem_free_count` é o número total de slots livres de tamanho fixo em todas as páginas alocadas. `fixed_elem_free_bytes` é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Um fragmento pode ter qualquer número de páginas de tamanho fixo; quando a última linha em uma página de tamanho fixo é excluída, a página é liberada para o pool de páginas `DataMemory`. Páginas de tamanho fixo podem ser fragmentadas, com mais páginas alocadas do que o necessário pelo número de slots de tamanho fixo em uso. Você pode verificar se este é o caso, comparando as páginas necessárias com as páginas alocadas, que você pode calcular da seguinte forma:

```
fixed_pages_required = 1 + (fixed_elem_count / slots_per_page)

fixed_page_utilization = fixed_pages_required / fixed_pages
```

Uma página de tamanho variável tem um cabeçalho interno e utiliza o espaço restante para armazenar uma ou mais partes de linha de tamanho variável; o número de partes armazenadas depende do esquema e dos dados reais armazenados. Como nem todos os esquemas ou linhas têm uma parte de tamanho variável, `var_elem_count` pode ser menor que `fixed_elem_count`. O espaço livre total disponível em todas as páginas de tamanho variável no fragmento é mostrado pela coluna `var_elem_free_bytes`; porque esse espaço pode ser espalhado por várias páginas, ele não pode necessariamente ser usado para armazenar uma entrada de um tamanho específico. Cada página de tamanho variável é reorganizada conforme necessário para se ajustar ao tamanho variável das partes de linha à medida que são inseridas, atualizadas e excluídas; se uma parte de linha dada se torna muito grande para a página em que está, ela pode ser movida para uma página diferente.

A utilização de páginas de tamanho variável pode ser calculada conforme mostrado aqui:

```
var_page_used_bytes =  var_elem_alloc_bytes - var_elem_free_bytes

var_page_utilisation = var_page_used_bytes / var_elem_alloc_bytes

avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Podemos obter o tamanho médio da parte variável por linha da seguinte forma:

```
avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Os índices únicos secundários são implementados internamente como tabelas independentes com o seguinte esquema:

*Chave primária*: Colunas indexadas na tabela base.

* *Valores*: Colunas da chave primária da tabela base.

Essas tabelas são distribuídas e fragmentadas normalmente. Isso significa que suas réplicas de fragmento usam páginas de índice fixo, variável e hash, como qualquer outra tabela `NDB`.

Os índices ordenados secundários são fragmentados e distribuídos da mesma maneira que a tabela base. Os fragmentos de índice ordenados são estruturas de T-tree que mantêm uma árvore equilibrada contendo referências de linha na ordem implícita pelas colunas indexadas. Como a árvore contém referências em vez de dados reais, o custo de armazenamento do T-tree não depende do tamanho ou número de colunas indexadas, mas é uma função do número de linhas. A árvore é construída usando estruturas de nó de tamanho fixo, cada uma das quais pode conter um número de referências de linha; o número de nós necessários depende do número de linhas na tabela, e da estrutura de árvore necessária para representar a ordenação. Na tabela `memory_per_fragment`, podemos ver que os índices ordenados alocam apenas páginas de tamanho fixo, portanto, como de costume, as colunas relevantes desta tabela estão listadas aqui:

* `fixed_elem_alloc_bytes`: Isso é igual a 32768 vezes o número de páginas de tamanho fixo.

* `fixed_elem_count`: O número de nós do T-tree em uso.

* `fixed_elem_size_bytes`: O número de bytes por nó do T-tree.

* `fixed_elem_free_count`: O número de slots de nós T-tree disponíveis nas páginas alocadas.

* `fixed_elem_free_bytes`: Isso é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Se o espaço livre em uma página estiver fragmentado, a página será desfragmentada. `OPTIMIZE TABLE` pode ser usado para desfragmentar páginas de variável tamanho de uma tabela; isso move partes variáveis de tamanho de linha entre páginas, de modo que algumas páginas inteiras possam ser liberadas para reutilização.

##### tabela_memoria_por_fragmento Exemplos

* Obter informações gerais sobre fragmentos e uso de memória
* Encontrar uma tabela e seus índices
* Encontrar a memória alocada por elementos do esquema
* Encontrar a memória alocada para uma tabela e todos os índices
* Encontrar a memória alocada por linha
* Encontrar a memória alocada por linha
* Encontrar a memória alocada por tabela
* Encontrar a memória em uso por cada elemento do esquema
* Encontrar a memória média alocada por linha, por elemento
* Encontrar a memória média alocada por linha
* Encontrar a memória média alocada por linha para uma tabela
* Encontrar a memória em uso por cada elemento do esquema
* Encontrar a memória média em uso por cada elemento do esquema
* Encontrar a memória média em uso por linha, por elemento
* Encontrar a média total de memória em uso por linha

Para os exemplos a seguir, criamos uma tabela simples com três colunas inteiras, uma das quais tem uma chave primária, outra com um índice único e outra sem índices, além de uma coluna `VARCHAR` sem índices, conforme mostrado aqui:

```
mysql> CREATE DATABASE IF NOT EXISTS test;
Query OK, 1 row affected (0.06 sec)

mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (
    ->    c1 BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->    c2 INT,
    ->    c3 INT UNIQUE,
    -> )  ENGINE=NDBCLUSTER;
Query OK, 0 rows affected (0.27 sec)
```

Após a criação da tabela, inserimos 50.000 linhas contendo dados aleatórios; o método preciso de gerar e inserir essas linhas não faz diferença prática, e deixamos o método de realização como um exercício para o usuário.

###### Obtenha informações gerais sobre fragmentos e uso de memória

Essa consulta mostra informações gerais sobre o uso de memória para cada fragmento:

```
mysql> SELECT
    ->   fq_name, node_id, block_instance, fragment_num, fixed_elem_alloc_bytes,
    ->   fixed_elem_free_bytes, fixed_elem_size_bytes, fixed_elem_count,
    ->   fixed_elem_free_count, var_elem_alloc_bytes, var_elem_free_bytes,
    ->   var_elem_count
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = "test/def/t1"\G
*************************** 1. row ***************************
               fq_name: test/def/t1
               node_id: 5
        block_instance: 1
          fragment_num: 0
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 11836
 fixed_elem_size_bytes: 44
      fixed_elem_count: 24925
 fixed_elem_free_count: 269
  var_elem_alloc_bytes: 1245184
   var_elem_free_bytes: 32552
        var_elem_count: 24925
*************************** 2. row ***************************
               fq_name: test/def/t1
               node_id: 5
        block_instance: 1
          fragment_num: 1
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 5236
 fixed_elem_size_bytes: 44
      fixed_elem_count: 25075
 fixed_elem_free_count: 119
  var_elem_alloc_bytes: 1277952
   var_elem_free_bytes: 54232
        var_elem_count: 25075
*************************** 3. row ***************************
               fq_name: test/def/t1
               node_id: 6
        block_instance: 1
          fragment_num: 0
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 11836
 fixed_elem_size_bytes: 44
      fixed_elem_count: 24925
 fixed_elem_free_count: 269
  var_elem_alloc_bytes: 1245184
   var_elem_free_bytes: 32552
        var_elem_count: 24925
*************************** 4. row ***************************
               fq_name: test/def/t1
               node_id: 6
        block_instance: 1
          fragment_num: 1
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 5236
 fixed_elem_size_bytes: 44
      fixed_elem_count: 25075
 fixed_elem_free_count: 119
  var_elem_alloc_bytes: 1277952
   var_elem_free_bytes: 54232
        var_elem_count: 25075
4 rows in set (0.12 sec)
```

###### Encontrar uma tabela e seus índices

Essa consulta pode ser usada para encontrar uma tabela específica e seus índices:

```
mysql> SELECT fq_name
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+
| fq_name              |
+----------------------+
| test/def/t1          |
| sys/def/13/PRIMARY   |
| sys/def/13/c3        |
| sys/def/13/c3$unique |
+----------------------+
4 rows in set (0.13 sec)

mysql> SELECT COUNT(*) FROM t1;
+----------+
| COUNT(*) |
+----------+
|    50000 |
+----------+
1 row in set (0.00 sec)
```

###### Encontrando a memória alocada pelos elementos do esquema

Essa consulta mostra a memória alocada por cada elemento do esquema (no total em todas as réplicas):

```
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+---------+---------+---------+----------+
| Name                 | Fixed   | Var     | Hash    | Total    |
+----------------------+---------+---------+---------+----------+
| test/def/t1          | 4456448 | 5046272 | 1425408 | 10928128 |
| sys/def/13/PRIMARY   | 1966080 |       0 |       0 |  1966080 |
| sys/def/13/c3        | 1441792 |       0 |       0 |  1441792 |
| sys/def/13/c3$unique | 3276800 |       0 | 1425408 |  4702208 |
+----------------------+---------+---------+---------+----------+
4 rows in set (0.11 sec)
```

###### Encontrando a memória alocada para uma tabela e todos os índices

A soma da memória alocada para a tabela e todos os seus índices (no total em todas as réplicas) pode ser obtida usando a consulta mostrada aqui:

```
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+----------+---------+---------+----------+
| Fixed    | Var     | Hash    | Total    |
+----------+---------+---------+----------+
| 11141120 | 5046272 | 2850816 | 19038208 |
+----------+---------+---------+----------+
1 row in set (0.12 sec)
```

Esta é uma versão abreviada da consulta anterior que mostra apenas a memória total usada pela tabela:

```
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+----------+
| Total    |
+----------+
| 19038208 |
+----------+
1 row in set (0.12 sec)
```

###### Encontrando a memória alocada por linha

A consulta a seguir mostra a memória total alocada por linha (em todas as réplicas):

```
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes)
    ->   /
    ->   SUM(fixed_elem_count) AS Total_alloc_per_row
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1';
+---------------------+
| Total_alloc_per_row |
+---------------------+
|            109.2813 |
+---------------------+
1 row in set (0.12 sec)
```

###### Encontrar a memória total em uso por linha

Para obter a memória total em uso por linha (em todas as réplicas), precisamos do total de memória usada dividido pelo número de linhas, que é o `fixed_elem_count` para a tabela base, da seguinte forma:

```
mysql> SELECT
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes
    ->   )
    ->   /
    ->   SUM(fixed_elem_count)
    ->   AS total_in_use_per_row
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1';
+----------------------+
| total_in_use_per_row |
+----------------------+
|             107.2042 |
+----------------------+
1 row in set (0.12 sec)
```

###### Encontrando a memória alocada por elemento

A memória alocada por cada elemento do esquema (no total em todas as réplicas) pode ser encontrada usando a seguinte consulta:

```
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->     AS Total_alloc
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+---------+---------+---------+-------------+
| Name                 | Fixed   | Var     | Hash    | Total_alloc |
+----------------------+---------+---------+---------+-------------+
| test/def/t1          | 4456448 | 5046272 | 1425408 |    10928128 |
| sys/def/13/PRIMARY   | 1966080 |       0 |       0 |     1966080 |
| sys/def/13/c3        | 1441792 |       0 |       0 |     1441792 |
| sys/def/13/c3$unique | 3276800 |       0 | 1425408 |     4702208 |
+----------------------+---------+---------+---------+-------------+
4 rows in set (0.11 sec)
```

###### Encontrar a memória média alocada por linha, por elemento

Para obter a memória média alocada por linha de cada elemento do esquema (no total em todas as réplicas), usamos uma subconsulta para obter o número fixo de elementos da tabela base cada vez que se deseja obter uma média por linha, já que `fixed_elem_count` para os índices não é necessariamente o mesmo que para a tabela base, como mostrado aqui:

```
mysql> SELECT
    ->   fq_name AS Name,
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_fixed_alloc,
    ->
    ->   SUM(var_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_var_alloc,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_hash_alloc,
    ->
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' or parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+------------+-----------------+---------------+----------------+-----------------+
| Name                 | Table_rows | Avg_fixed_alloc | Avg_var_alloc | Avg_hash_alloc | Avg_total_alloc |
+----------------------+------------+-----------------+---------------+----------------+-----------------+
| test/def/t1          |     100000 |         44.5645 |       50.4627 |        14.2541 |        109.2813 |
| sys/def/13/PRIMARY   |     100000 |         19.6608 |        0.0000 |         0.0000 |         19.6608 |
| sys/def/13/c3        |     100000 |         14.4179 |        0.0000 |         0.0000 |         14.4179 |
| sys/def/13/c3$unique |     100000 |         32.7680 |        0.0000 |        14.2541 |         47.0221 |
+----------------------+------------+-----------------+---------------+----------------+-----------------+
4 rows in set (0.70 sec)
```

###### Encontrando a memória média alocada por linha

Média de memória alocada por linha (total em todas as réplicas):

```
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_fixed_alloc,
    ->
    ->   SUM(var_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_var_alloc,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_hash_alloc,
    ->
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+---------------+----------------+-----------------+
| Table_rows | Avg_fixed_alloc | Avg_var_alloc | Avg_hash_alloc | Avg_total_alloc |
+------------+-----------------+---------------+----------------+-----------------+
|     100000 |        111.4112 |       50.4627 |        28.5082 |        190.3821 |
+------------+-----------------+---------------+----------------+-----------------+
1 row in set (0.71 sec)
```

###### Encontrar a memória média alocada por linha para uma tabela

Para obter o valor médio de memória alocada por linha para toda a tabela em todas as réplicas, podemos usar a consulta mostrada aqui:

```
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+
| table_rows | avg_total_alloc |
+------------+-----------------+
|     100000 |        190.3821 |
+------------+-----------------+
1 row in set (0.33 sec)
```

###### Encontrando a memória utilizada por cada elemento do esquema

Para obter a memória em uso por elemento de esquema em todas as réplicas, é necessário somar a diferença entre a memória alocada e a memória livre para cada elemento, da seguinte forma:

```
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes) AS fixed_inuse,
    ->   SUM(var_elem_alloc_bytes-var_elem_free_bytes) AS var_inuse,
    ->   SUM(hash_index_alloc_bytes) AS hash_memory,
    ->   SUM(  (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->       + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->       + hash_index_alloc_bytes) AS total_alloc
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+-------------+-----------+---------+-------------+
| fq_name              | fixed_inuse | var_inuse | hash    | total_alloc |
+----------------------+-------------+-----------+---------+-------------+
| test/def/t1          |     4422304 |   4872704 | 1425408 |    10720416 |
| sys/def/13/PRIMARY   |     1950848 |         0 |       0 |     1950848 |
| sys/def/13/c3        |     1428736 |         0 |       0 |     1428736 |
| sys/def/13/c3$unique |     3212800 |         0 | 1425408 |     4638208 |
+----------------------+-------------+-----------+---------+-------------+
4 rows in set (0.13 sec)
```

###### Encontrar a memória média utilizada por cada elemento do esquema

Essa consulta obtém a memória média em uso por elemento do esquema em todas as réplicas:

```
mysql> SELECT
    ->   fq_name AS Name,
    ->
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_fixed_inuse,
    ->
    ->   SUM(var_elem_alloc_bytes - var_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_var_inuse,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_hash,
    ->
    ->   SUM(
    ->       (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes) + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_inuse
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+------------+-----------------+---------------+----------+-----------------+
| Name                 | table_rows | avg_fixed_inuse | avg_var_inuse | avg_hash | avg_total_inuse |
+----------------------+------------+-----------------+---------------+----------+-----------------+
| test/def/t1          |     100000 |         44.2230 |       48.7270 |  14.2541 |        107.2042 |
| sys/def/13/PRIMARY   |     100000 |         19.5085 |        0.0000 |   0.0000 |         19.5085 |
| sys/def/13/c3        |     100000 |         14.2874 |        0.0000 |   0.0000 |         14.2874 |
| sys/def/13/c3$unique |     100000 |         32.1280 |        0.0000 |  14.2541 |         46.3821 |
+----------------------+------------+-----------------+---------------+----------+-----------------+
4 rows in set (0.72 sec)
```

###### Encontrar a memória média em uso por linha, por elemento

Essa consulta obtém a memória média em uso por linha, por elemento, em todas as réplicas:

```
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_fixed_inuse,
    ->
    ->   SUM(var_elem_alloc_bytes - var_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_var_inuse,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_hash,
    ->
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_inuse
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+---------------+----------+-----------------+
| table_rows | avg_fixed_inuse | avg_var_inuse | avg_hash | avg_total_inuse |
+------------+-----------------+---------------+----------+-----------------+
|     100000 |        110.1469 |       48.7270 |  28.5082 |        187.3821 |
+------------+-----------------+---------------+----------+-----------------+
1 row in set (0.68 sec)
```

###### Encontrar a média total de memória em uso por linha

Essa consulta obtém a média total de memória em uso, por linha:

```
mysql> SELECT
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT
    ->       SUM(fixed_elem_count)
    ->       FROM ndbinfo.memory_per_fragment
    ->       WHERE fq_name='test/def/t1') AS avg_total_in_use
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------------+
| avg_total_in_use |
+------------------+
|         187.3821 |
+------------------+
1 row in set (0.24 sec)
```

#### 25.6.16.47 Tabela de nós ndbinfo

Esta tabela contém informações sobre o status dos nós de dados. Para cada nó de dados que está em execução no clúster, uma linha correspondente nesta tabela fornece o ID do nó, o status e o tempo de atividade. Para nós que estão começando, também mostra a fase atual de início.

A tabela `nodes` contém as seguintes colunas:

* `node_id`

O ID único do nó do nó de dados no clúster.

* `uptime`

Tempo desde que o nó foi iniciado pela última vez, em segundos.

* `status`

Status atual do nó de dados; veja o texto para os possíveis valores.

* `start_phase`

Se o nó de dados está começando, a fase atual de início.

* `config_generation`

A versão do arquivo de configuração do cluster em uso neste nó de dados.

##### Notas

A coluna `uptime` mostra o tempo em segundos que este nó está em execução desde que foi iniciado ou reiniciado pela última vez. Este é um valor de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") . Este número inclui o tempo realmente necessário para iniciar o nó; em outras palavras, este contador começa a contar a partir do momento em que **ndbd** ou **ndbmtd") é invocado pela primeira vez; assim, mesmo para um nó que ainda não terminou de iniciar, `uptime` pode mostrar um valor não nulo.

A coluna `status` mostra o status atual do nó. Isso é um dos seguintes: `NOTHING`, `CMVMI`, `STARTING`, `STARTED`, `SINGLEUSER`, `STOPPING_1`, `STOPPING_2`, `STOPPING_3`, ou `STOPPING_4`. Quando o status é `STARTING`, você pode ver a fase atual de início na coluna `start_phase` (veja mais adiante nesta seção). `SINGLEUSER` é exibido na coluna `status` para todos os nós de dados quando o clúster está no modo de usuário único (veja Seção 25.6.6, “Modo de Usuário Único do Clúster NDB”). Ver um dos estados `STOPPING` não significa necessariamente que o nó está desligando, mas pode significar que ele está entrando em um novo estado. Por exemplo, se você colocar o clúster em modo de usuário único, às vezes pode-se ver nós de dados relatando seu estado brevemente como `STOPPING_2` antes de o status mudar para `SINGLEUSER`.

A coluna `start_phase` utiliza a mesma faixa de valores que os utilizados na saída do comando do cliente de gerenciamento do NDB cluster `node_id STATUS` (mysql-cluster-mgm-client-commands.html#ndbclient-status) (consulte Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”). Se o nó não estiver iniciando atualmente, então esta coluna exibe `0`. Para uma lista dos estágios de início do NDB Cluster com descrições, consulte Seção 25.6.4, “Resumo dos estágios de início do NDB Cluster”.

A coluna `config_generation` mostra qual versão da configuração do clúster está em vigor em cada nó de dados. Isso pode ser útil ao realizar um reinício contínuo do clúster para fazer alterações nos parâmetros de configuração. Por exemplo, a partir da saída da seguinte declaração `SELECT`, você pode ver que o nó 3 ainda não está usando a versão mais recente da configuração do clúster (`6`) embora os nós 1, 2 e 4 estejam fazendo isso:

```
mysql> USE ndbinfo;
Database changed
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  10462 | STARTED |           0 |                 6 |
|       2 |  10460 | STARTED |           0 |                 6 |
|       3 |  10457 | STARTED |           0 |                 5 |
|       4 |  10455 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
2 rows in set (0.04 sec)
```

Portanto, para o caso que acabamos de mostrar, você deve reiniciar o nó 3 para completar o reinício contínuo do clúster.

Os nós que estão parados não são contabilizados nesta tabela. Suponha que você tenha um NDB Cluster com 4 nós de dados (IDs de nó 1, 2, 3 e 4), e todos os nós estão funcionando normalmente, então esta tabela contém 4 linhas, 1 para cada nó de dados:

```
mysql> USE ndbinfo;
Database changed
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  11776 | STARTED |           0 |                 6 |
|       2 |  11774 | STARTED |           0 |                 6 |
|       3 |  11771 | STARTED |           0 |                 6 |
|       4 |  11769 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
4 rows in set (0.04 sec)
```

Se você desligar um dos nós, apenas os nós que ainda estão em funcionamento serão representados na saída desta declaração `SELECT`, conforme mostrado aqui:

```
ndb_mgm> 2 STOP
Node 2: Node shutdown initiated
Node 2: Node shutdown completed.
Node 2 has shutdown.
```

```
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  11807 | STARTED |           0 |                 6 |
|       3 |  11802 | STARTED |           0 |                 6 |
|       4 |  11800 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
3 rows in set (0.02 sec)
```

#### 25.6.16.48 Tabela ndbinfo operations_per_fragment

A tabela `operations_per_fragment` fornece informações sobre as operações realizadas em fragmentos individuais e réplicas de fragmentos, bem como sobre alguns dos resultados dessas operações.

A tabela `operations_per_fragment` contém as seguintes colunas:

* `fq_name`

Nome deste fragmento

* `parent_fq_name`

Nome do pai deste fragmento

* `type`

Tipo de objeto; veja o texto para os possíveis valores

* `table_id`

ID da tabela para esta tabela

* `node_id`

ID do nó para este nó

* `block_instance`

ID do bloco do kernel

* `fragment_num`

ID de fragmento (número)

* `tot_key_reads`

Número total de leituras de chave para esta replica do fragmento

* `tot_key_inserts`

Número total de inserções de chave para esta réplica do fragmento

* `tot_key_updates`

número total de atualizações-chave para esta réplica do fragmento

* `tot_key_writes`

Número total de gravações de chave para esta replica do fragmento

* `tot_key_deletes`

Número total de apagamentos de chave para esta replica do fragmento

* `tot_key_refs`

Número de operações-chave recusadas

* `tot_key_attrinfo_bytes`

Tamanho total de todos os atributos `attrinfo`

* `tot_key_keyinfo_bytes`

Tamanho total de todos os atributos `keyinfo`

* `tot_key_prog_bytes`

Tamanho total de todos os programas interpretados carregados pelos atributos `attrinfo`

* `tot_key_inst_exec`

Número total de instruções executadas por programas interpretados para operações-chave

* `tot_key_bytes_returned`

Tamanho total de todos os dados e metadados retornados de operações de leitura de chave

* `tot_frag_scans`

Número total de varreduras realizadas neste fragmento de réplica

* `tot_scan_rows_examined`

Número total de linhas examinadas por varreduras

* `tot_scan_rows_returned`

Número total de linhas devolvidas ao cliente

* `tot_scan_bytes_returned`

Tamanho total dos dados e metadados retornados ao cliente

* `tot_scan_prog_bytes`

Tamanho total dos programas interpretados para operações de varredura

* `tot_scan_bound_bytes`

Tamanho total de todos os limites utilizados em varreduras de índice ordenadas

* `tot_scan_inst_exec`

Número total de instruções executadas para varreduras

* `tot_qd_frag_scans`

Número de vezes que as cópias de este fragmento foram colocadas em fila

* `conc_frag_scans`

Número de varreduras atualmente ativas neste fragmento de replica (excluindo varreduras em fila)

* `conc_qd_frag_scans`

Número de varreduras atualmente em fila para esta réplica do fragmento

* tot_commits

Número total de alterações de linha comprometidas nesta replica do fragmento

##### Notas

O `fq_name` contém o nome totalmente qualificado do objeto do esquema ao qual esta replica de fragmento pertence. Atualmente, tem os seguintes formatos:

* Tabela base: `DbName/def/TblName`

* tabela `BLOB`: `DbName/def/NDB$BLOB_BaseTblId_ColNo`

* Índice solicitado: `sys/def/BaseTblId/IndexName`

* Índice único: `sys/def/BaseTblId/IndexName$unique`

O sufixo `$unique` mostrado para índices únicos é adicionado pelo **mysqld**. Para um índice criado por um aplicativo de cliente de API NDB diferente, isso pode diferir ou não estar presente.

A sintaxe mostrada acima para nomes de objetos totalmente qualificados é uma interface interna que está sujeita a alterações em versões futuras.

Considere uma tabela `t1` criada e modificada pelos seguintes comandos SQL:

```
CREATE DATABASE mydb;

USE mydb;

CREATE TABLE t1 (
  a INT NOT NULL,
  b INT NOT NULL,
  t TEXT NOT NULL,
  PRIMARY KEY (b)
) ENGINE=ndbcluster;

CREATE UNIQUE INDEX ix1 ON t1(b) USING HASH;
```

Se o `t1` receber o ID de tabela 11, isso resulta nos valores do `fq_name` mostrados aqui:

* Tabela base: `mydb/def/t1`
* Tabela `BLOB`: `mydb/def/NDB$BLOB_11_2`

* Índice ordenado (chave primária): `sys/def/11/PRIMARY`

* Índice único: `sys/def/11/ix1$unique`

Para índices ou tabelas `BLOB`, a coluna `parent_fq_name` contém o `fq_name` da tabela base correspondente. Para as tabelas de base, essa coluna é sempre `NULL`.

A coluna `type` mostra o tipo de objeto do esquema utilizado para este fragmento, que pode assumir qualquer um dos valores `System table`, `User table`, `Unique hash index` ou `Ordered index`. As tabelas `BLOB` são mostradas como `User table`.

O valor da coluna `table_id` é único em qualquer momento, mas pode ser reutilizado se o objeto correspondente tiver sido excluído. O mesmo ID pode ser visto usando o utilitário **ndb_show_tables**.

A coluna `block_instance` mostra a qual instância do LDM pertence este fragmento de replica. Você pode usar isso para obter informações sobre os threads específicos da tabela [[`threadblocks`]. A primeira dessas instâncias é sempre numerada como 0.

Como normalmente existem duas réplicas de fragmento e assumindo que isso é o caso, cada valor do `fragment_num` deve aparecer duas vezes na tabela, em dois nós de dados diferentes do mesmo grupo de nós.

Como o `NDB` não utiliza acesso de chave única para índices ordenados, as contagens para os índices `tot_key_reads`, `tot_key_inserts`, `tot_key_updates`, `tot_key_writes` e `tot_key_deletes` não são incrementadas por operações de índice ordenado.

Nota

Ao usar `tot_key_writes`, você deve ter em mente que uma operação de escrita neste contexto atualiza a linha se a chave existir e insere uma nova linha caso contrário. (Uma utilização desta é na implementação `NDB` da declaração SQL `REPLACE`.

A coluna `tot_key_refs` mostra o número de operações chave recusadas pelo LDM. Geralmente, essa recusa ocorre devido a chaves duplicadas (inserções), erros de chave não encontrada (atualizações, exclusões e leituras), ou a operação foi rejeitada por um programa interpretado usado como um predicado na linha que corresponde à chave.

Os atributos `attrinfo` e `keyinfo` contados pelas colunas `tot_key_attrinfo_bytes` e `tot_key_keyinfo_bytes` são atributos de um sinal `LQHKEYREQ` (ver O Protocolo de Comunicação NDB) usado para iniciar uma operação chave pelo LDM. Um `attrinfo` normalmente contém valores de campos tupla (inserções e atualizações) ou especificações de projeção (para leituras); `keyinfo` contém a chave primária ou única necessária para localizar uma tupla dada neste objeto do esquema.

O valor exibido por `tot_frag_scans` inclui tanto varreduras completas (que examinam cada linha) quanto varreduras de subconjuntos. Índices únicos e as tabelas `BLOB` nunca são varridas, portanto, esse valor, assim como outros contagem relacionadas a varredura, é 0 para réplicas de fragmentos desses.

`tot_scan_rows_examined` pode exibir menos que o número total de linhas em um fragmento de replica, uma vez que as consultas de índice ordenadas podem ser limitadas por limites. Além disso, um cliente pode optar por encerrar uma consulta antes que todas as linhas que podem corresponder tenham sido examinadas; isso ocorre quando se usa uma declaração SQL que contém uma cláusula `LIMIT` ou `EXISTS`, por exemplo. `tot_scan_rows_returned` é sempre igual a ou menor que `tot_scan_rows_examined`.

`tot_scan_bytes_returned` inclui, no caso de junções empurradas, projeções devolvidas ao bloco `DBSPJ` no kernel NDB.

`tot_qd_frag_scans` pode ser realizado pela configuração do parâmetro do nó de dados `MaxParallelScansPerFragment`, que limita o número de varreduras que podem ser executadas simultaneamente em uma replica de fragmento.

#### 25.6.16.49 Tabela ndbinfo pgman_time_track_stats

Esta tabela fornece informações sobre a latência das operações de disco para os espaços de dados de disco do NDB Cluster.

A tabela `pgman_time_track_stats` contém as seguintes colunas:

* `node_id`

ID único do nó deste nó no clúster

* `block_number`

Número do bloco (da tabela `blocks`)

* `block_instance`

Número da instância do bloco

* `upper_bound`

limite superior

* `page_reads`

Latência de leitura da página (ms)

* `page_writes`

Latência de escrita da página (ms)

* `log_waits`

Latência de espera (ms)

* `get_page`

Latência das chamadas de `get_page()` (ms)

##### Notas

A latência de leitura (coluna `page_reads`) mede o tempo entre o envio do pedido de leitura ao thread do sistema de arquivos até o momento em que a leitura é concluída e retorna ao thread de execução. A latência de escrita (`page_writes`) é calculada de maneira semelhante. O tamanho da página lida ou escrita em um espaço de dados de tabela de Disk Data é sempre de 32 KB.

A latência de espera (coluna `log_waits`) é o tempo que uma escrita de página deve esperar para que o registro de desfazer seja esvaziado, o que deve ser feito antes de cada escrita de página.

#### 25.6.16.50 O ndbinfo processa a tabela

Esta tabela contém informações sobre os processos dos nós do NDB Cluster; cada nó é representado pela linha da tabela. Apenas os nós que estão conectados ao cluster são mostrados nesta tabela. Você pode obter informações sobre nós que estão configurados, mas não conectados ao cluster, nas tabelas `nodes` e `config_nodes`.

A tabela `processes` contém as seguintes colunas:

* `node_id`

O ID único do nó no clúster

* `node_type`

Tipo de nó (nó de gerenciamento, de dados ou de API; veja o texto)

* `node_version`

Versão do programa de software `NDB` em execução neste nó.

* `process_id`

ID do processo deste nó

* `angel_process_id`

ID de processo do processo do anjo deste nó

* `process_name`

Nome do executável

* `service_URI`

URI de serviço deste nó (ver texto)

##### Notas

`node_id` é o ID atribuído a este nó no clúster.

A coluna `node_type` exibe um dos seguintes três valores:

* `MGM`: Nó de gerenciamento.
* `NDB`: Nó de dados.
* `API`: Nó API ou SQL.

Para um executável entregue com a distribuição do NDB Cluster, `node_version` mostra a string de versão do software Cluster, como `8.0.44-ndb-8.0.44`.

`process_id` é o ID do processo do executável do nó, conforme mostrado pelo sistema operacional do host usando um aplicativo de exibição de processos, como o **top** no Linux, ou o Gerenciador de Tarefas nas plataformas Windows.

`angel_process_id` é o ID do processo do sistema para o processo do anjo do nó, que garante que um nó de dados ou SQL seja automaticamente reiniciado em casos de falhas. Para nós de gerenciamento e nós de API, exceto nós SQL, o valor desta coluna é `NULL`.

A coluna `process_name` mostra o nome do executável em execução. Para nós de gerenciamento, isso é `ndb_mgmd`. Para nós de dados, isso é `ndbd` (monotrilhado) ou `ndbmtd` (multitrilhado). Para nós de SQL, isso é `mysqld`. Para outros tipos de nós de API, é o nome do programa executável conectado ao clúster; os aplicativos da NDB API podem definir um valor personalizado para isso usando `Ndb_cluster_connection::set_name()`.

`service_URI` mostra o endereço da rede de serviço. Para nós de gerenciamento e nós de dados, o esquema utilizado é `ndb://`. Para nós SQL, este é `mysql://`. Por padrão, os nós API que não são nós SQL utilizam `ndb://` para o esquema; os aplicativos da API NDB podem definir isso em um valor personalizado usando `Ndb_cluster_connection::set_service_uri()`. independentemente do tipo de nó, o esquema é seguido pelo endereço IP utilizado pelo transportador NDB para o nó em questão. Para nós de gerenciamento e nós SQL, este endereço inclui o número de porta (geralmente 1186 para nós de gerenciamento e 3306 para nós SQL). Se o nó SQL foi iniciado com a variável de sistema `bind_address` definida, este endereço é usado em vez do endereço do transportador, a menos que o endereço de vinculação seja definido em `*`, `0.0.0.0` ou `::`.

Informações adicionais sobre o caminho podem ser incluídas no valor `service_URI` para um nó SQL que reflete várias opções de configuração. Por exemplo, `mysql://198.51.100.3/tmp/mysql.sock` indica que o nó SQL foi iniciado com a variável de sistema `skip_networking` habilitada, e `mysql://198.51.100.3:3306/?server-id=1` mostra que a replicação está habilitada para este nó SQL.

#### 25.6.16.51 Tabela dos recursos ndbinfo

Esta tabela fornece informações sobre a disponibilidade e o uso dos recursos do nó de dados.

Esses recursos são, por vezes, conhecidos como super-pools.

A tabela `resources` contém as seguintes colunas:

* `node_id`

O ID único do nó deste nó de dados.

* `resource_name`

Nome do recurso; veja o texto.

* `reserved`

O valor reservado para este recurso, como número de páginas de 32 KB.

* `used`

O valor realmente utilizado por este recurso, como número de páginas de 32 KB.

* `max`

O valor máximo (número de páginas de 32 KB) deste recurso que está disponível para este nó de dados.

##### Notas

O `resource_name` pode ser qualquer um dos nomes mostrados na tabela a seguir:

* `RESERVED`: Reservado pelo sistema; não pode ser ignorado.

* `TRANSACTION_MEMORY`: Memória alocada para transações neste nó de dados. No NDB 8.0.19 e versões posteriores, isso pode ser controlado usando o parâmetro de configuração `TransactionMemory`.

* `DISK_OPERATIONS`: Se um grupo de arquivo de registro for alocado, o tamanho do buffer do registro de desfazer é usado para definir o tamanho deste recurso. Este recurso é usado apenas para alocar o buffer de registro de desfazer para um grupo de arquivo de registro de desfazer; pode haver apenas um grupo desse tipo. A sobrealocação ocorre conforme necessário por `CREATE LOGFILE GROUP` (create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement").

* `DISK_RECORDS`: Registros alocados para operações de dados em disco.

* `DATA_MEMORY`: Usado para tuplas de memória principal, índices e índices de hash. Soma de DataMemory e IndexMemory, mais 8 páginas de 32 KB cada, se a IndexMemory tiver sido definida. Não pode ser sobrealocate.

* `JOBBUFFER`: Usado para alocar buffers de trabalho pelo planejador NDB; não pode ser sobrealocionado. Isso é aproximadamente 2 MB por thread mais um buffer de 1 MB em ambas as direções para todos os threads que podem se comunicar. Para configurações grandes, isso consome vários GB.

* `FILE_BUFFERS`: Usado pelo manipulador do log de refazer no bloco do kernel `DBLQH`; não pode ser sobrealogrado. O tamanho é `NoOfFragmentLogParts` * `RedoBuffer`, mais 1 MB por parte do arquivo de registro.

* `TRANSPORTER_BUFFERS`: Usado para buffers de envio por **ndbmtd"); a soma de `TotalSendBufferMemory` e `ExtraSendBufferMemory`. Este recurso que pode ser sobrealinhado em até 25 por cento. `TotalSendBufferMemory` é calculado somando a memória do buffer de envio por nó, cujo valor padrão é de 2 MB. Assim, em um sistema com quatro nós de dados e oito nós de API, os nós de dados têm 12 * 2 MB de memória do buffer de envio. `ExtraSendBufferMemory` é usado por **ndbmtd") e equivale a 2 MB de memória extra por thread. Assim, com 4 threads LDM, 2 threads TC, 1 thread principal, 1 thread de replicação e 2 threads de recebimento, `ExtraSendBufferMemory` é 10 * 2 MB. A sobrealinhamento deste recurso pode ser realizado definindo o parâmetro de configuração do nó de dados `SharedGlobalMemory`.

* `DISK_PAGE_BUFFER`: Usado para o buffer de página do disco; determinado pelo parâmetro de configuração `DiskPageBufferMemory`. Não pode ser sobrealogrado.

* `QUERY_MEMORY`: Usado pelo bloco de kernel `DBSPJ`.

* `SCHEMA_TRANS_MEMORY`: O mínimo é de 2 MB; pode ser sobrealogrado para usar qualquer memória disponível restante.

#### 25.6.16.52 Tabela ndbinfo restart_info

A tabela `restart_info` contém informações sobre operações de reinício de nós. Cada entrada na tabela corresponde a um relatório de status de reinício de nó em tempo real de um nó de dados com o ID de nó fornecido. Apenas o relatório mais recente para qualquer nó fornecido é mostrado.

A tabela `restart_info` contém as seguintes colunas:

* `node_id`

ID do nó no clúster

* `node_restart_status`

Estado do nó; veja o texto para os valores. Cada um desses corresponde a um valor possível de `node_restart_status_int`.

* `node_restart_status_int`

Código de status do nó; veja o texto para os valores.

* `secs_to_complete_node_failure`

Tempo em segundos para completar o tratamento de falha de nó

* `secs_to_allocate_node_id`

Tempo em segundos desde a conclusão da falha do nó até a alocação do ID do nó

* `secs_to_include_in_heartbeat_protocol`

Tempo em segundos desde a alocação do ID do nó até a inclusão no protocolo de batida de coração

* `secs_until_wait_for_ndbcntr_master`

Tempo em segundos desde que foi incluído no protocolo de batimento cardíaco até a espera pelo mestre `NDBCNTR` começar

* `secs_wait_for_ndbcntr_master`

Tempo em segundos gasto esperando ser aceito pelo mestre `NDBCNTR` para iniciar

* `secs_to_get_start_permitted`

Tempo em segundos decorrido desde a recepção da permissão para o início do mestre até que todos os nós tenham aceitado o início deste nó.

* `secs_to_wait_for_lcp_for_copy_meta_data`

Tempo em segundos gasto esperando a conclusão do LCP antes da cópia dos metadados

* `secs_to_copy_meta_data`

Tempo em segundos necessário para copiar metadados do mestre para o nó recém-iniciado

* `secs_to_include_node`

Tempo em segundos aguardado para GCP e inclusão de todos os nós nos protocolos

* `secs_starting_node_to_request_local_recovery`

Tempo em segundos que o nó acabou de gastar esperando para solicitar recuperação local

* `secs_for_local_recovery`

Tempo em segundos necessário para recuperação local pelo nó que acaba de começar

* `secs_restore_fragments`

Tempo em segundos necessário para restaurar fragmentos de arquivos LCP

* `secs_undo_disk_data`

Tempo em segundos necessário para executar a desfazer log de dados de disco de uma parte dos registros

* `secs_exec_redo_log`

Tempo em segundos necessário para executar o log de refazer em todos os fragmentos restaurados

* `secs_index_rebuild`

Tempo em segundos necessário para reconstruir índices em fragmentos restaurados

* `secs_to_synchronize_starting_node`

Tempo em segundos necessário para sincronizar o nó inicial a partir de nós ao vivo

* `secs_wait_lcp_for_restart`

Tempo em segundos necessário para o início e término do LCP antes do reinício ser concluído

* `secs_wait_subscription_handover`

Tempo em segundos gasto esperando pela entrega de assinaturas de replicação

* `total_restart_secs`

Número total de segundos entre a falha do nó e o início do nó novamente

##### Notas

A lista a seguir contém os valores definidos para a coluna `node_restart_status_int` com seus nomes de status internos (em parênteses) e as mensagens correspondentes exibidas na coluna `node_restart_status`:

* `0` (`ALLOCATED_NODE_ID`)

  `Allocated node id`

* `1` (`INCLUDED_IN_HB_PROTOCOL`)

  `Included in heartbeat protocol`

* `2` (`NDBCNTR_START_WAIT`)

  `Wait for NDBCNTR master to permit us to start`

* `3` (`NDBCNTR_STARTED`)

  `NDBCNTR master permitted us to start`

* `4` (`START_PERMITTED`)

  `All nodes permitted us to start`

* `5` (`WAIT_LCP_TO_COPY_DICT`)

  `Wait for LCP completion to start copying metadata`

* `6` (`COPY_DICT_TO_STARTING_NODE`)

  `Copying metadata to starting node`

* `7` (`INCLUDE_NODE_IN_LCP_AND_GCP`)

  `Include node in LCP and GCP protocols`

* `8` (`LOCAL_RECOVERY_STARTED`)

  `Restore fragments ongoing`

* `9` (`COPY_FRAGMENTS_STARTED`)

  `Synchronizing starting node with live nodes`

* `10` (`WAIT_LCP_FOR_RESTART`)

  `Wait for LCP to ensure durability`

* `11` (`WAIT_SUMA_HANDOVER`)

  `Wait for handover of subscriptions`

* `12` (`RESTART_COMPLETED`)

  `Restart completed`

* `13` (`NODE_FAILED`)

  `Node failed, failure handling in progress`

* `14` (`NODE_FAILURE_COMPLETED`)

  `Node failure handling completed`

* `15` (`NODE_GETTING_PERMIT`)

  `All nodes permitted us to start`

* `16` (`NODE_GETTING_INCLUDED`)

  `Include node in LCP and GCP protocols`

* `17` (`NODE_GETTING_SYNCHED`)

  `Synchronizing starting node with live nodes`

* `18` (`NODE_GETTING_LCP_WAITED`)

[nenhum]

* `19` (`NODE_ACTIVE`)

  `Restart completed`

* `20` (`NOT_DEFINED_IN_CLUSTER`)

[nenhum]

* `21` (`NODE_NOT_RESTARTED_YET`)

  `Initial state`

Os números de status de 0 a 12 se aplicam apenas aos nós principais; o restante dos números mostrados na tabela se aplica a todos os nós de dados que estão sendo reativados. Os números de status 13 e 14 definem estados de falha do nó; os números 20 e 21 ocorrem quando não há informações sobre o recomeço de um nó específico disponíveis.

Veja também a Seção 25.6.4, “Resumo dos Fases de Início do NDB Cluster”.

#### 25.6.16.53 Tabela ndbinfo server_locks

A tabela `server_locks` tem uma estrutura semelhante à da tabela `cluster_locks`, e fornece um subconjunto das informações encontradas na última tabela, mas que é específico para o nó SQL (servidor MySQL) onde reside. (A tabela `cluster_locks` fornece informações sobre todos os bloqueios no clúster.) Mais precisamente, `server_locks` contém informações sobre os bloqueios solicitados por threads pertencentes à instância atual de **mysqld**, e serve como uma tabela complementar à `server_operations`. Isso pode ser útil para correlacionar padrões de bloqueio com sessões específicas de usuários MySQL, consultas ou casos de uso.

A tabela `server_locks` contém as seguintes colunas:

* `mysql_connection_id`

ID de conexão do MySQL

* `node_id`

ID do nó de relatório

* `block_instance`

ID da instância do LDM que reporta

* `tableid`

ID da tabela que contém esta linha

* `fragmentid`

ID do fragmento que contém a linha bloqueada

* `rowid`

ID da linha bloqueada

* `transid`

ID da transação

* `mode`

Modo de solicitação de bloqueio

* `state`

Estado de bloqueio

* `detail`

Se esta é a primeira retenção de bloqueio na fila de bloqueio de linha

* `op`

Tipo de operação

* `duration_millis`

Milisegundos gastos esperando ou segurando o bloqueio

* `lock_num`

ID do objeto de bloqueio

* `waiting_for`

Esperando bloqueio com este ID

##### Notas

A coluna `mysql_connection_id` mostra a ID de conexão ou o ID de thread do MySQL conforme mostrado por `SHOW PROCESSLIST`.

`block_instance` refere-se a uma instância de um bloco do kernel. Junto com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O `tableid` é atribuído à tabela pelo `NDB`; o mesmo ID é usado para esta tabela em outras tabelas `ndbinfo`, bem como na saída do **ndb_show_tables**.

O ID de transação mostrado na coluna `transid` é o identificador gerado pela API NDB para a transação que solicita ou mantém o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio, que é sempre um dos `S` (bloqueio compartilhado) ou `X` (bloqueio exclusivo). Se uma transação tiver um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha terão o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre um dos `H` (mantendo) ou `W` (esperando). Um pedido de bloqueio em espera aguarda um bloqueio mantido por uma transação diferente.

A coluna `detail` indica se este bloqueio é o primeiro bloqueio de retenção na fila de bloqueio da linha afetada, no caso, ela contém um `*` (caractere estrela); caso contrário, essa coluna está vazia. Essa informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de bloqueio.

A coluna `op` mostra o tipo de operação que solicita o bloqueio. Isso é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos em que este pedido de bloqueio está aguardando ou mantendo o bloqueio. Isso é redefinido para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (coluna `lockid`) é único para este nó e para a instância do bloco.

Se o valor da coluna `lock_state` for `W`, este bloqueio está à espera de ser concedido, e a coluna `waiting_for` mostra o ID do bloqueio do objeto para o qual este pedido está à espera. Caso contrário, `waiting_for` está vazio. `waiting_for` pode se referir apenas a bloqueios na mesma linha (identificados por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`).

#### 25.6.16.54 Tabela ndbinfo server_operations

A tabela `server_operations` contém entradas para todas as operações em andamento `NDB` nas quais o nó SQL atual (MySQL Server) está atualmente envolvido. Ela é, efetivamente, um subconjunto da tabela `cluster_operations`, na qual as operações para outros nós SQL e API não são mostradas.

A tabela `server_operations` contém as seguintes colunas:

* `mysql_connection_id`

ID de conexão do MySQL Server

* `node_id`

ID do nó

* `block_instance`

Instância de bloco

* `transid`

ID da transação

* `operation_type`

Tipo de operação (consulte o texto para os possíveis valores)

* `state`

Estado da operação (consulte o texto para os possíveis valores)

* `tableid`

Tabela ID

* `fragmentid`

ID do fragmento

* `client_node_id`

ID do nó do cliente

* `client_block_ref`

Referência do bloqueio do cliente

* `tc_node_id`

ID do nó do coordenador de transação

* `tc_block_no`

Número do bloco do coordenador de transação

* `tc_block_instance`

Instância de bloco do coordenador de transação

##### Notas

O `mysql_connection_id` é o mesmo que o ID de conexão ou sessão mostrado na saída do `SHOW PROCESSLIST`. Ele é obtido a partir da tabela `INFORMATION_SCHEMA` `NDB_TRANSID_MYSQL_CONNECTION_MAP`.

`block_instance` refere-se a uma instância de um bloco do kernel. Junto com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O ID da transação (`transid`) é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX` ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar esta lista de estados selecionando a tabela `ndb$dblqh_tcconnect_state`, que normalmente é oculta.)

Você pode obter o nome de uma tabela `NDB` a partir de seu ID de tabela, verificando a saída de **ndb_show_tables**.

O `fragid` é o mesmo número de partição visto na saída do **ndb_desc** `--extra-partition-info` (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API de NDB Cluster ou um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem números de instâncias de bloco do kernel NDB. Você pode usar essas informações para obter informações sobre os threads específicos da tabela `threadblocks`.

#### 25.6.16.55 Tabela ndbinfo server_transactions

A tabela `server_transactions` é um subconjunto da tabela `cluster_transactions`, mas inclui apenas as transações nas quais o nó SQL atual (MySQL Server) é um participante, incluindo os IDs de conexão relevantes.

A tabela `server_transactions` contém as seguintes colunas:

* `mysql_connection_id`

ID de conexão do MySQL Server

* `node_id`

ID do nó do coordenador de transação

* `block_instance`

Instância de bloco do coordenador de transação

* `transid`

ID da transação

* `state`

Estado da operação (consulte o texto para os possíveis valores)

* `count_operations`

Número de operações estatais na transação

* `outstanding_operations`

Operações ainda sendo executadas pela camada local de gerenciamento de dados (blocos LQH)

* `inactive_seconds`

Tempo gasto esperando a API

* `client_node_id`

ID do nó do cliente

* `client_block_ref`

Referência do bloqueio do cliente

##### Notas

O `mysql_connection_id` é o mesmo que o ID de conexão ou sessão mostrado na saída do `SHOW PROCESSLIST`. Ele é obtido a partir da tabela `INFORMATION_SCHEMA` `NDB_TRANSID_MYSQL_CONNECTION_MAP`.

`block_instance` refere-se a uma instância de um bloco do kernel. Junto com o nome do bloco, este número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O ID da transação (`transid`) é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar esta lista de estados selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente é oculta.)

Em `client_node_id` e `client_block_ref`, `client` se refere a uma API de NDB Cluster ou um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

A coluna `block_instance` fornece o número da instância do bloco do kernel `DBTC`. Você pode usar isso para obter informações sobre os threads específicos da tabela `threadblocks`.

#### 25.6.16.56 A tabela ndbinfo table_distribution_status

A tabela `table_distribution_status` fornece informações sobre o progresso da distribuição de tabelas para as tabelas `NDB`.

A tabela `table_distribution_status` contém as seguintes colunas:

* `node_id`

ID do nó

* `table_id`

Tabela ID

* `tab_copy_status`

Status da cópia dos dados de distribuição de tabela para disco; um dos `IDLE`, `SR_PHASE1_READ_PAGES`, `SR_PHASE2_READ_TABLE`, `SR_PHASE3_COPY_TABLE`, `REMOVE_NODE`, `LCP_READ_TABLE`, `COPY_TAB_REQ`, `COPY_NODE_STATE`, `ADD_TABLE_COORDINATOR` (*antes do NDB 8.0.23*: `ADD_TABLE_MASTER`), `ADD_TABLE_PARTICIPANT` (*antes do NDB 8.0.23*: `ADD_TABLE_SLAVE`), `INVALIDATE_NODE_LCP`, `ALTER_TABLE`, `COPY_TO_SAVE`, ou `GET_TABINFO`

* `tab_update_status`

Status da atualização dos dados de distribuição de tabela; um dos `IDLE`, `LOCAL_CHECKPOINT`, `LOCAL_CHECKPOINT_QUEUED`, `REMOVE_NODE`, `COPY_TAB_REQ`, `ADD_TABLE_MASTER`, `ADD_TABLE_SLAVE`, `INVALIDATE_NODE_LCP`, ou `CALLBACK`

* `tab_lcp_status`

Status da tabela LCP; um dos `ACTIVE` (esperando que o ponto de verificação local seja executado), `WRITING_TO_FILE` (ponto de verificação executado, mas ainda não escrito em disco) ou `COMPLETED` (ponto de verificação executado e persistido em disco)

* `tab_status`

Status interno da tabela; um dos `ACTIVE` (tabela existe), `CREATING` (tabela está sendo criada) ou `DROPPING` (tabela está sendo descartada)

* `tab_storage`

Recuperabilidade da tabela; uma das `NORMAL` (completamente recuperável com registro de refazer e verificação de ponto de controle), `NOLOGGING` (recuperável após o crash do nó, vazio após o crash do cluster), ou `TEMPORARY` (não recuperável)

* `tab_partitions`

Número de partições na tabela

* `tab_fragments`

Número de fragmentos na tabela; normalmente igual a `tab_partitions`; para tabelas totalmente replicadas iguais a `tab_partitions * [number of node groups]`

* `current_scan_count`

Número atual de varreduras ativas

* `scan_count_wait`

Número atual de exames aguardando para serem realizados antes que `ALTER TABLE` possa ser concluído.

* `is_reorg_ongoing`

Se a tabela está atualmente sendo reorganizada (1 se verdadeiro)

#### 25.6.16.57 A tabela ndbinfo table_fragments

A tabela `table_fragments` fornece informações sobre fragmentação, particionamento, distribuição e (interna) replicação das tabelas `NDB`.

A tabela `table_fragments` contém as seguintes colunas:

* `node_id`

ID do nó (mestre `DIH`)

* `table_id`

Tabela ID

* `partition_id`

ID de Partição

* `fragment_id`

ID de fragmento (mesmo que o ID de partição, a menos que a tabela seja totalmente replicada)

* `partition_order`

Ordem do fragmento na partição

* `log_part_id`

ID de parte do registro do fragmento

* `no_of_replicas`

Número de réplicas de fragmentos

* `current_primary`

ID do nó primário atual

* `preferred_primary`

ID do nó primário preferido

* `current_first_backup`

ID do primeiro nó de backup atual

* `current_second_backup`

ID do segundo nó de backup atual

* `current_third_backup`

ID do atual terceiro nó de backup

* `num_alive_replicas`

Número atual de réplicas de fragmentos ao vivo

* `num_dead_replicas`

Número atual de réplicas de fragmentos mortos

* `num_lcp_replicas`

Número de réplicas de fragmentos que ainda precisam ser verificadas

#### 25.6.16.58 A tabela ndbinfo table_info

A tabela `table_info` fornece informações sobre opções de registro, verificação de ponto, distribuição e armazenamento em vigor para as tabelas individuais `NDB`.

A tabela `table_info` contém as seguintes colunas:

* `table_id`

Tabela ID

* `logged_table`

Se a tabela está registrada (1) ou não (0)

* `row_contains_gci`

Se as linhas da tabela contêm GCI (1 verdadeiro, 0 falso)

* `row_contains_checksum`

Se as linhas da tabela contêm checksum (1 verdadeiro, 0 falso)

* `read_backup`

Se as réplicas de fragmentos de backup forem lidas, o valor é 1; caso contrário, é 0

* `fully_replicated`

Se a tabela for totalmente replicada, é 1, caso contrário, 0

* `storage_type`

Tipo de armazenamento de tabela; um dos `MEMORY` ou `DISK`

* `hashmap_id`

ID do Hashmap

* `partition_balance`

Balanço de partição (tipo de contagem de fragmentos) usado para a tabela; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM` ou `FOR_RA_BY_LDM`

* `create_gci`

GCI em qual tabela foi criado

#### 25.6.16.59 A tabela ndbinfo table_replicas

A tabela `table_replicas` fornece informações sobre a cópia, distribuição e verificação de `NDB` de fragmentos da tabela e réplicas de fragmentos.

A tabela `table_replicas` contém as seguintes colunas:

* `node_id`

ID do nó a partir do qual os dados são obtidos (`DIH` master)

* `table_id`

Tabela ID

* `fragment_id`

ID do fragmento

* `initial_gci`

GCI inicial para tabela

* `replica_node_id`

ID do nó onde a replica do fragmento é armazenada

* `is_lcp_ongoing`

1 se o LCP estiver em andamento neste fragmento, 0 caso contrário

* `num_crashed_replicas`

Número de instâncias de réplica de fragmentos que foram descartadas

* `last_max_gci_started`

O GCI mais alto começou na maioria dos LCP mais recentes

* `last_max_gci_completed`

Maior GCI concluído na maioria dos LCP mais recentes

* `last_lcp_id`

ID do LCP mais recente

* `prev_lcp_id`

ID do LCP anterior

* `prev_max_gci_started`

O GCI mais alto começou no LCP anterior

* `prev_max_gci_completed`

Maior GCI concluído no LCP anterior

* `last_create_gci`

Criar o último GCI da última instância de replica de fragmento que caiu

* `last_replica_gci`

Última GCI da última instância de réplica de fragmento que caiu

* `is_replica_alive`

1 se essa réplica do fragmento está viva, 0 caso contrário

#### 25.6.16.60 A tabela ndbinfo tc_time_track_stats

A tabela `tc_time_track_stats` fornece informações de rastreamento de tempo obtidas das instâncias do bloco (TC) `DBTC` nos nós de dados, através do acesso aos nós da API `NDB`. Cada instância de TC rastrea latências para um conjunto de atividades que ela realiza em nome dos nós da API ou outros nós de dados; essas atividades incluem transações, erros de transação, leituras de chave, escritas de chave, operações de índice único, operações de chave falhadas de qualquer tipo, varreduras, varreduras falhadas, varreduras de fragmento e varreduras de fragmento falhadas.

Um conjunto de contadores é mantido para cada atividade, cada contador cobrindo uma faixa de latências de menos ou igual a um limite superior. Ao término de cada atividade, sua latência é determinada e o contador apropriado é incrementado. `tc_time_track_stats` apresenta essas informações como linhas, com uma linha para cada instância dos seguintes itens:

* Nó de dados, usando seu ID
* Instância de bloco TC
* Outro nó de dados comunicando ou nó de API, usando seu ID
* Valor superior

Cada linha contém um valor para cada tipo de atividade. Esse é o número de vezes que essa atividade ocorreu com uma latência dentro do intervalo especificado pela linha (ou seja, onde a latência não excede o limite superior).

A tabela `tc_time_track_stats` contém as seguintes colunas:

* `node_id`

Solicitar ID do nó

* `block_number`

Número do bloco do TC

* `block_instance`

Número da instância do bloco TC

* `comm_node_id`

ID do nó da API ou nó de dados que está comunicando

* `upper_bound`

Limite superior do intervalo (em microssegundos)

* `scans`

Baseado na duração das varreduras bem-sucedidas, desde a abertura até o fechamento, rastreado contra a API ou nós de dados que as solicitam.

* `scan_errors`

Com base na duração dos escaneios que falharam, desde a abertura até o fechamento, rastreados contra a API ou os nós de dados que os solicitam.

* `scan_fragments`

Com base na duração das varreduras de fragmentos bem-sucedidas, desde a abertura até o fechamento, acompanhada dos nós de dados que as executam

* `scan_fragment_errors`

Com base na duração das análises de fragmentos falhas, desde a abertura até o fechamento, acompanhada dos nós de dados que as executam

* `transactions`

Baseado na duração das transações bem-sucedidas, desde o início até o envio do commit `ACK`, rastreado contra a API ou nós de dados que os solicitam. As transações sem estado não são incluídas.

* `transaction_errors`

Com base na duração das transações que falharam, do início até o ponto de falha, rastreada contra a API ou os nós de dados que as solicitam.

* `read_key_ops`

Baseado na duração de leituras bem-sucedidas de chave primária com bloqueios. Acompanhado tanto da API ou do nó de dados que as solicitam quanto do nó de dados que as executa.

* `write_key_ops`

Baseado na duração das escritas bem-sucedidas de chave primária, rastreadas tanto contra a API ou o nó de dados que as solicitou quanto contra o nó de dados que as executou.

* `index_key_ops`

Com base na duração das operações de chave de índice única bem-sucedidas, rastreadas tanto pelo API ou nó de dados que as solicitam quanto pelo nó de dados que executa leituras de tabelas de base.

* `key_op_errors`

Com base na duração de todas as operações de leitura ou escrita de chave não bem-sucedidas, rastreadas tanto pelo nó de dados que as solicitou quanto pelo nó de dados que as executou.

##### Notas

A coluna `block_instance` fornece o número da instância do bloco do kernel `DBTC`. Você pode usar isso juntamente com o nome do bloco para obter informações sobre os threads específicos da tabela `threadblocks`.

#### 25.6.16.61 Tabelas de blocos de informações ndbinfo

A tabela `threadblocks` associa nós de dados, threads e instâncias de blocos de kernel `NDB`.

A tabela `threadblocks` contém as seguintes colunas:

* `node_id`

ID do nó

* `thr_no`

ID do fio

* `block_name`

Nome do bloco

* `block_instance`

Número da instância do bloco

##### Notas

O valor do `block_name` nesta tabela é um dos valores encontrados na coluna `block_name` ao selecionar a partir da tabela `ndbinfo.blocks`. Embora a lista de valores possíveis seja estática para um determinado lançamento do NDB Cluster, a lista pode variar entre os lançamentos.

A coluna `block_instance` fornece o número da instância do bloco do kernel.

#### 25.6.16.62 Tabela de threads ndbinfo

A tabela `threads` fornece informações sobre os threads que estão em execução no kernel `NDB`.

A tabela `threads` contém as seguintes colunas:

* `node_id`

ID do nó onde o thread está sendo executado

* `thr_no`

ID do fio (específico para este nó)

* `thread_name`

Nome do fio (tipo de fio)

* `thread_description`

Descrição do fio (tipo)

##### Notas

A saída de amostra de um clúster de exemplo de 2 nós, incluindo descrições de thread, é mostrada aqui:

```
mysql> SELECT * FROM threads;
+---------+--------+-------------+------------------------------------------------------------------+
| node_id | thr_no | thread_name | thread_description                                               |
+---------+--------+-------------+------------------------------------------------------------------+
|       5 |      0 | main        | main thread, schema and distribution handling                    |
|       5 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       5 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       5 |      3 | recv        | receive thread, performing receive and polling for new receives  |
|       6 |      0 | main        | main thread, schema and distribution handling                    |
|       6 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       6 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       6 |      3 | recv        | receive thread, performing receive and polling for new receives  |
+---------+--------+-------------+------------------------------------------------------------------+
8 rows in set (0.01 sec)
```

O NDB 8.0.23 introduz a possibilidade de definir qualquer um dos argumentos `ThreadConfig` `main` ou `rep` para 0, mantendo o outro em 1, nesse caso, o nome do thread é `main_rep` e sua descrição é `main and rep thread, schema, distribution, proxy block and asynch replication handling`. Também é possível, a partir do NDB 8.0.23, definir ambos os argumentos `main` e `rep` para 0, nesse caso, o nome do thread resultante é mostrado nesta tabela como `main_rep_recv`, e sua descrição é `main, rep and recv thread, schema, distribution, proxy block and asynch replication handling and handling receive and polling for new receives`.

#### 25.6.16.63 A tabela ndbinfo threadstat

A tabela `threadstat` fornece um instantâneo aproximado das estatísticas para os threads que estão em execução no kernel `NDB`.

A tabela `threadstat` contém as seguintes colunas:

* `node_id`

ID do nó

* `thr_no`

ID do fio

* `thr_nm`

Nome do tópico

* `c_loop`

Número de laços no loop principal

* `c_exec`

Número de sinais executados

* `c_wait`

Número de vezes em que você está esperando por uma entrada adicional

* `c_l_sent_prioa`

Número de sinais de prioridade A enviados para o próprio nó

* `c_l_sent_priob`

Número de sinais de prioridade B enviados para o próprio nó

* `c_r_sent_prioa`

Número de sinais de prioridade A enviados ao nó remoto

* `c_r_sent_priob`

Número de sinais de prioridade B enviados ao nó remoto

* `os_tid`

ID do fio do sistema operacional

* `os_now`

tempo do sistema (ms)

* `os_ru_utime`

Tempo do CPU do usuário do OS (µs)

* `os_ru_stime`

Tempo do sistema operacional no CPU (µs)

* `os_ru_minflt`

OS reclames de página (falhas de página suaves)

* `os_ru_majflt`

Falhas de página (falhas de página física)

* `os_ru_nvcsw`

OS trocas voluntárias de contexto

* `os_ru_nivcsw`

OS trocas involuntárias de contexto

##### Notas

`os_time` utiliza a chamada do sistema `gettimeofday()`.

Os valores das colunas `os_ru_utime`, `os_ru_stime`, `os_ru_minflt`, `os_ru_majflt`, `os_ru_nvcsw` e `os_ru_nivcsw` são obtidos utilizando a chamada do sistema `getrusage()`, ou equivalente.

Como esta tabela contém contagens coletadas em um determinado momento, para obter os melhores resultados, é necessário consultar essa tabela periodicamente e armazenar os resultados em uma ou mais tabelas intermediárias. O Cronograma de Eventos do MySQL Server pode ser empregado para automatizar esse monitoramento. Para mais informações, consulte a Seção 27.4, “Usando o Cronograma de Eventos”.

#### 25.6.16.64 A tabela ndbinfo transporter_details

Esta tabela contém informações sobre transportadores individuais NDB, em vez de informações agregadas, como mostrado na tabela `transporters`. A tabela `transporter_details` foi adicionada no NDB 8.0.37.

A tabela `transporter_details` contém as seguintes colunas:

* `node_id`

O ID único do nó desse nó de dados no clúster

* `block_instance`
* `trp_id`

O ID do transportador

* `remote_node_id`

O ID do nó do nó de dados remoto

* `status`

Status da conexão

* `remote_address`

Nome ou endereço IP do host remoto

* `bytes_sent`

Número de bytes enviados usando esta conexão

* `bytes_received`

Número de bytes recebidos usando essa conexão

* `connect_count`

Número de vezes que a conexão foi estabelecida neste transportador

* `overloaded`

1 se este transportador estiver sobrecarregado atualmente, caso contrário, 0

* `overload_count`

Número de vezes que este transportador entrou em estado de sobrecarga desde a conexão

* `slowdown`

1 se este transportador estiver em estado de desaceleração, caso contrário, 0

* `slowdown_count`

Número de vezes que esse transportador entrou no estado de redução de velocidade desde a conexão

* `encrypted`

Se este transportador for conectado usando TLS, esta coluna é `1`, caso contrário, é `0`.

* `sendbuffer_used_bytes`

O valor, em bytes, dos dados do sinal que estão atualmente aguardando para serem enviados por este transportador.

* `sendbuffer_max_used_bytes`

O valor máximo, em bytes, de dados de sinal aguardando envio em qualquer momento por este transportador.

* `sendbuffer_alloc_bytes`

Quantidade de buffer de envio, em bytes, atualmente alocada para armazenamento de dados de sinal para este transportador.

* `sendbuffer_max_alloc_bytes`

Quantidade máxima de buffer de envio, em bytes, alocada para armazenamento de dados de sinal em qualquer momento para este transportador.

* `type`

O tipo de conexão utilizado por este transportador (`TCP` ou `SHM`).

A tabela `transporter_details` exibe uma linha que mostra o status de cada transportador no clúster. Consulte as Notas para a tabela `transporters` para obter mais informações sobre cada uma das colunas desta tabela.

As colunas `sendbuffer_used_bytes`, `sendbuffer_max_used_bytes`, `sendbuffer_alloc_bytes`, `sendbuffer_max_alloc_bytes` e `type` foram adicionadas no NDB 8.0.38.

#### 25.6.16.65 A tabela de transportadores ndbinfo

Esta tabela contém informações agregadas sobre os transportadores NDB. No NDB 8.0.37 e versões posteriores, você pode obter informações semelhantes sobre transportadores individuais a partir da tabela `transporter_details`.

A tabela `transporters` contém as seguintes colunas:

* `node_id`

O ID único do nó desse nó de dados no clúster

* `remote_node_id`

O ID do nó do nó de dados remoto

* `status`

Status da conexão

* `remote_address`

Nome ou endereço IP do host remoto

* `bytes_sent`

Número de bytes enviados usando esta conexão

* `bytes_received`

Número de bytes recebidos usando essa conexão

* `connect_count`

Número de vezes que a conexão foi estabelecida neste transportador

* `overloaded`

1 se este transportador estiver sobrecarregado atualmente, caso contrário, 0

* `overload_count`

Número de vezes que este transportador entrou em estado de sobrecarga desde a conexão

* `slowdown`

1 se este transportador estiver em estado de desaceleração, caso contrário, 0

* `slowdown_count`

Número de vezes que esse transportador entrou no estado de redução de velocidade desde a conexão

##### Notas

Para cada nó de dados em execução no clúster, a tabela `transporters` exibe uma linha que mostra o status de cada uma das conexões desse nó com todos os nós no clúster, *incluindo o próprio*. Essas informações são exibidas na coluna *status* da tabela, que pode ter qualquer um dos seguintes valores: `CONNECTING`, `CONNECTED`, `DISCONNECTING` ou `DISCONNECTED`.

As conexões aos nós de API e de gerenciamento que estão configurados, mas atualmente não conectados ao clúster, são exibidas com o status `DISCONNECTED`. As linhas onde o `node_id` é o de um nó de dados que atualmente não está conectado não são exibidas nesta tabela. (Essa é uma omissão semelhante de nós desconectados na tabela `ndbinfo.nodes`.

O `remote_address` é o nome de host ou endereço do nó cuja ID é mostrado na coluna `remote_node_id`. Os `bytes_sent` deste nó e `bytes_received` por este nó são, respectivamente, os números de bytes enviados e recebidos pelo nó usando esta conexão desde que foi estabelecida. Para nós cujo status é `CONNECTING` ou `DISCONNECTED`, estas colunas sempre exibem `0`.

Suponha que você tenha um clúster de 5 nós, composto por 2 nós de dados, 2 nós SQL e 1 nó de gerenciamento, conforme mostrado na saída do comando `SHOW` no cliente **ndb_mgm**:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.100.10.1  (8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=2    @10.100.10.2  (8.0.44-ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @10.100.10.10  (8.0.44-ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=20   @10.100.10.20  (8.0.44-ndb-8.0.44)
id=21   @10.100.10.21  (8.0.44-ndb-8.0.44)
```

Há 10 linhas na tabela `transporters` — 5 para o primeiro nó de dados e 5 para o segundo — assumindo que todos os nós de dados estão em execução, conforme mostrado aqui:

```
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTED     |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
|       2 |              1 | CONNECTED     |
|       2 |              2 | DISCONNECTED  |
|       2 |             10 | CONNECTED     |
|       2 |             20 | CONNECTED     |
|       2 |             21 | CONNECTED     |
+---------+----------------+---------------+
10 rows in set (0.04 sec)
```

Se você desligar um dos nós de dados neste clúster usando o comando `2 STOP` no cliente **ndb_mgm**, então repita a consulta anterior (novamente usando o cliente **mysql**), esta tabela agora mostra apenas 5 linhas — 1 linha para cada conexão do nó de gerenciamento restante para outro nó, incluindo tanto a si mesmo quanto o nó de dados que está atualmente fora de linha — e exibe `CONNECTING` para o status de cada conexão restante ao nó de dados que está atualmente fora de linha, conforme mostrado aqui:

```
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTING    |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
+---------+----------------+---------------+
5 rows in set (0.02 sec)
```

Os contadores `connect_count`, `overloaded`, `overload_count`, `slowdown` e `slowdown_count` são resetados na conexão e retêm seus valores após o nó remoto se desconectar. Os contadores `bytes_sent` e `bytes_received` também são resetados na conexão e, portanto, retêm seus valores após a desconexão (até a próxima conexão os resetear).

O estado de *sobrecarga* referido pelas colunas `overloaded` e `overload_count` ocorre quando o buffer de envio deste transportador contém mais de `OVerloadLimit` bytes (o padrão é 80% de `SendBufferMemory`, ou seja, 0,8 * 2097152 = 1677721 bytes). Quando um transportador específico está em estado de sobrecarga, qualquer nova transação que tente usar este transportador falha com o erro 1218 (Buffers de envio sobrecarregados no kernel NDB). Isso afeta tanto as pesquisas quanto as operações de chave primária.

O estado de *redução de velocidade* referido pelas colunas `slowdown` e `slowdown_count` desta tabela ocorre quando o buffer de envio do transportador contém mais de 60% do limite de sobrecarga (igual a 0,6 * 2097152 = 1258291 bytes por padrão). Neste estado, qualquer nova varredura usando este transportador tem seu tamanho de lote reduzido para minimizar a carga no transportador.

As causas comuns de lentidão ou sobrecarga do buffer de envio incluem as seguintes:

* Tamanho dos dados, em particular, a quantidade de dados armazenados nas colunas `TEXT` ou `BLOB` (ou ambos os tipos de colunas)

* Ter um nó de dados (ndbd ou ndbmtd) no mesmo host que um nó SQL que está envolvido em registro binário

* Grande número de linhas por transação ou lote de transação * Problemas de configuração, como insuficiente `SendBufferMemory`

Problemas de hardware, como RAM insuficiente ou conectividade de rede ruim

Veja também a Seção 25.4.3.14, “Configurando parâmetros do buffer de envio do NDB Cluster”.

### 25.6.17 TABELAS DO SCHEMA DE INFORMAÇÃO PARA CLUSTRE NDB

Duas tabelas `INFORMATION_SCHEMA` fornecem informações que são particularmente úteis ao gerenciar um NDB Cluster. A tabela `FILES` fornece informações sobre os arquivos de dados de disco do NDB Cluster (consulte Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster”). A tabela `ndb_transid_mysql_connection_map` fornece uma mapeo entre transações, coordenadores de transações e nós da API.

Dados estatísticos adicionais e outros dados sobre transações, operações, threads, blocos e outros aspectos do desempenho do NDB Cluster podem ser obtidos das tabelas no banco de dados `ndbinfo`. Para informações sobre essas tabelas, consulte a Seção 25.6.16, “ndbinfo: O banco de dados de informações do NDB Cluster”.

### 25.6.18 Clúster do NDB e o Schema de Desempenho

O NDB 8.0 fornece informações sobre o esquema de desempenho do MySQL sobre o uso de threads e memória de transação; o NDB 8.0.29 adiciona threads do plugin `ndbcluster`, e o NDB 8.0.30 adiciona instrumentação para memória de lote de transação. Esses recursos são descritos em detalhes nas seções que seguem.

#### Ndbcluster Plugin Threads

A partir do NDB 8.0.29, os tópicos dos plugins `ndbcluster` são visíveis na tabela do Schema de Desempenho `threads`, conforme mostrado na seguinte consulta:

```
mysql> SELECT name, type, thread_id, thread_os_id
    -> FROM performance_schema.threads
    -> WHERE name LIKE '%ndbcluster%'\G
+----------------------------------+------------+-----------+--------------+
| name                             | type       | thread_id | thread_os_id |
+----------------------------------+------------+-----------+--------------+
| thread/ndbcluster/ndb_binlog     | BACKGROUND |        30 |        11980 |
| thread/ndbcluster/ndb_index_stat | BACKGROUND |        31 |        11981 |
| thread/ndbcluster/ndb_metadata   | BACKGROUND |        32 |        11982 |
+----------------------------------+------------+-----------+--------------+
```

A tabela `threads` mostra todos os três fios listados aqui:

* `ndb_binlog`: Fuso horário de registro binário
* `ndb_index_stat`: Fuso horário de estatísticas de índice
* `ndb_metadata`: Fuso horário de metadados

Esses fios também são mostrados pelo nome na tabela `setup_threads`.

Os nomes dos fios são mostrados na coluna `name` das tabelas `threads` e `setup_threads` usando o formato `prefix/plugin_name/thread_name`. *`prefix`*, o tipo de objeto determinado pelo motor `performance_schema`, é `thread` para fios de plugin (ver Elementos de Instrumento de Fios). O *`plugin_name`* é `ndbcluster`. *`thread_name`* é o nome independente do fio (`ndb_binlog`, `ndb_index_stat` ou `ndb_metadata`).

Usando o ID do thread ou o ID do thread do sistema operacional para um determinado thread na tabela `threads` ou `setup_threads`, é possível obter informações consideráveis sobre a execução do plugin e o uso de recursos no Gerenciador de desempenho. Este exemplo mostra como obter a quantidade de memória alocada pelos threads criados pelo plugin `ndbcluster` na arena `mem_root` ao unir as tabelas `threads` e `memory_summary_by_thread_by_event_name`:

```
mysql> SELECT
    ->   t.name,
    ->   m.sum_number_of_bytes_alloc,
    ->   IF(m.sum_number_of_bytes_alloc > 0, "true", "false") AS 'Has allocated memory'
    -> FROM performance_schema.memory_summary_by_thread_by_event_name m
    -> JOIN performance_schema.threads t
    -> ON m.thread_id = t.thread_id
    -> WHERE t.name LIKE '%ndbcluster%'
    ->   AND event_name LIKE '%THD::main_mem_root%';
+----------------------------------+---------------------------+----------------------+
| name                             | sum_number_of_bytes_alloc | Has allocated memory |
+----------------------------------+---------------------------+----------------------+
| thread/ndbcluster/ndb_binlog     |                     20576 | true                 |
| thread/ndbcluster/ndb_index_stat |                         0 | false                |
| thread/ndbcluster/ndb_metadata   |                      8240 | true                 |
+----------------------------------+---------------------------+----------------------+
```

#### Uso da Memória de Transação

A partir do NDB 8.0.30, você pode ver a quantidade de memória usada para o agrupamento de transações consultando a tabela do Gerenciador de desempenho `memory_summary_by_thread_by_event_name`, de forma semelhante à que é mostrada aqui:

```
mysql> SELECT EVENT_NAME
    ->   FROM performance_schema.memory_summary_by_thread_by_event_name
    ->   WHERE THREAD_ID = PS_CURRENT_THREAD_ID()
    ->     AND EVENT_NAME LIKE 'memory/ndbcluster/%';
+-------------------------------------------+
| EVENT_NAME                                |
+-------------------------------------------+
| memory/ndbcluster/Thd_ndb::batch_mem_root |
+-------------------------------------------+
1 row in set (0.01 sec)
```

A memória de transação do instrumento `ndbcluster` também é visível na tabela do Schema de Desempenho `setup_instruments`, conforme mostrado aqui:

```
mysql> SELECT * from performance_schema.setup_instruments
    ->   WHERE NAME LIKE '%ndb%'\G
*************************** 1. row ***************************
         NAME: memory/ndbcluster/Thd_ndb::batch_mem_root
      ENABLED: YES
        TIMED: NULL
   PROPERTIES:
   VOLATILITY: 0
DOCUMENTATION: Memory used for transaction batching
1 row in set (0.01 sec)
```

### 25.6.19 Referência Rápida: Declarações SQL do NDB Cluster

Esta seção discute várias instruções SQL que podem ser úteis na gestão e monitoramento de um servidor MySQL conectado a um NDB Cluster, e, em alguns casos, fornece informações sobre o próprio cluster.

* `SHOW ENGINE NDB STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement"), `SHOW ENGINE NDBCLUSTER STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement")

A saída deste comunicado contém informações sobre a conexão do servidor com o clúster, criação e uso de objetos do NDB Cluster e registro binário para replicação do NDB Cluster.

Veja a Seção 15.7.7.15, “Declaração SHOW ENGINE”, para um exemplo de uso e informações mais detalhadas.

* `SHOW ENGINES`

Essa declaração pode ser usada para determinar se o suporte de agrupamento está habilitado no servidor MySQL, e, se sim, se ele está ativo.

Consulte a Seção 15.7.7.16, “Declaração de MOTORES DE EXIBIÇÃO”, para obter informações mais detalhadas.

Nota

Esta declaração não suporta uma cláusula `LIKE`. No entanto, você pode usar `LIKE` para filtrar consultas contra a tabela do esquema de informações `ENGINES`, conforme discutido no próximo item.

* `SELECT * FROM INFORMATION_SCHEMA.ENGINES [WHERE ENGINE LIKE 'NDB%']`

Isto é equivalente a `SHOW ENGINES`(show-engines.html "15.7.7.16 SHOW ENGINES Statement"), mas utiliza a tabela `ENGINES` do banco de dados `INFORMATION_SCHEMA`. Ao contrário do caso da declaração `SHOW ENGINES`, é possível filtrar os resultados usando uma cláusula `LIKE`, e selecionar colunas específicas para obter informações que podem ser úteis em scripts. Por exemplo, a seguinte consulta mostra se o servidor foi construído com suporte ao `NDB` e, se sim, se está habilitado:

  ```
  mysql> SELECT ENGINE, SUPPORT FROM INFORMATION_SCHEMA.ENGINES
      ->   WHERE ENGINE LIKE 'NDB%';
  +------------+---------+
  | ENGINE     | SUPPORT |
  +------------+---------+
  | ndbcluster | YES     |
  | ndbinfo    | YES     |
  +------------+---------+
  ```

Se o suporte ao `NDB` não estiver habilitado, a consulta anterior retorna um conjunto vazio. Consulte a Seção 28.3.13, “A Tabela de ENGINES do INFORMATION_SCHEMA”, para obter mais informações.

* `SHOW VARIABLES LIKE 'NDB%'`

Esta declaração fornece uma lista das variáveis do sistema do servidor relacionadas ao motor de armazenamento `NDB`, e seus valores, conforme mostrado aqui:

  ```
  mysql> SHOW VARIABLES LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | Variable_name                        | Value                                 |
  +--------------------------------------+---------------------------------------+
  | ndb_allow_copying_alter_table        | ON                                    |
  | ndb_autoincrement_prefetch_sz        | 512                                   |
  | ndb_batch_size                       | 32768                                 |
  | ndb_blob_read_batch_bytes            | 65536                                 |
  | ndb_blob_write_batch_bytes           | 65536                                 |
  | ndb_clear_apply_status               | ON                                    |
  | ndb_cluster_connection_pool          | 1                                     |
  | ndb_cluster_connection_pool_nodeids  |                                       |
  | ndb_connectstring                    | 127.0.0.1                             |
  | ndb_data_node_neighbour              | 0                                     |
  | ndb_default_column_format            | FIXED                                 |
  | ndb_deferred_constraints             | 0                                     |
  | ndb_distribution                     | KEYHASH                               |
  | ndb_eventbuffer_free_percent         | 20                                    |
  | ndb_eventbuffer_max_alloc            | 0                                     |
  | ndb_extra_logging                    | 1                                     |
  | ndb_force_send                       | ON                                    |
  | ndb_fully_replicated                 | OFF                                   |
  | ndb_index_stat_enable                | ON                                    |
  | ndb_index_stat_option                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | ndb_join_pushdown                    | ON                                    |
  | ndb_log_apply_status                 | OFF                                   |
  | ndb_log_bin                          | OFF                                   |
  | ndb_log_binlog_index                 | ON                                    |
  | ndb_log_empty_epochs                 | OFF                                   |
  | ndb_log_empty_update                 | OFF                                   |
  | ndb_log_exclusive_reads              | OFF                                   |
  | ndb_log_orig                         | OFF                                   |
  | ndb_log_transaction_id               | OFF                                   |
  | ndb_log_update_as_write              | ON                                    |
  | ndb_log_update_minimal               | OFF                                   |
  | ndb_log_updated_only                 | ON                                    |
  | ndb_metadata_check                   | ON                                    |
  | ndb_metadata_check_interval          | 60                                    |
  | ndb_metadata_sync                    | OFF                                   |
  | ndb_mgmd_host                        | 127.0.0.1                             |
  | ndb_nodeid                           | 0                                     |
  | ndb_optimization_delay               | 10                                    |
  | ndb_optimized_node_selection         | 3                                     |
  | ndb_read_backup                      | ON                                    |
  | ndb_recv_thread_activation_threshold | 8                                     |
  | ndb_recv_thread_cpu_mask             |                                       |
  | ndb_report_thresh_binlog_epoch_slip  | 10                                    |
  | ndb_report_thresh_binlog_mem_usage   | 10                                    |
  | ndb_row_checksum                     | 1                                     |
  | ndb_schema_dist_lock_wait_timeout    | 30                                    |
  | ndb_schema_dist_timeout              | 120                                   |
  | ndb_schema_dist_upgrade_allowed      | ON                                    |
  | ndb_show_foreign_key_mock_tables     | OFF                                   |
  | ndb_slave_conflict_role              | NONE                                  |
  | ndb_table_no_logging                 | OFF                                   |
  | ndb_table_temporary                  | OFF                                   |
  | ndb_use_copying_alter_table          | OFF                                   |
  | ndb_use_exact_count                  | OFF                                   |
  | ndb_use_transactions                 | ON                                    |
  | ndb_version                          | 524308                                |
  | ndb_version_string                   | ndb-8.0.44                            |
  | ndb_wait_connected                   | 30                                    |
  | ndb_wait_setup                       | 30                                    |
  | ndbinfo_database                     | ndbinfo                               |
  | ndbinfo_max_bytes                    | 0                                     |
  | ndbinfo_max_rows                     | 10                                    |
  | ndbinfo_offline                      | OFF                                   |
  | ndbinfo_show_hidden                  | OFF                                   |
  | ndbinfo_table_prefix                 | ndb$                                  |
  | ndbinfo_version                      | 524308                                |
  +--------------------------------------+---------------------------------------+
  ```

Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”, para mais informações.

* `SELECT * FROM performance_schema.global_variables WHERE VARIABLE_NAME LIKE 'NDB%'`

Essa declaração é equivalente à declaração `SHOW VARIABLES` descrita no item anterior e fornece uma saída quase idêntica, conforme mostrado aqui:

  ```
  mysql> SELECT * FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | VARIABLE_NAME                        | VARIABLE_VALUE                        |
  +--------------------------------------+---------------------------------------+
  | ndb_allow_copying_alter_table        | ON                                    |
  | ndb_autoincrement_prefetch_sz        | 512                                   |
  | ndb_batch_size                       | 32768                                 |
  | ndb_blob_read_batch_bytes            | 65536                                 |
  | ndb_blob_write_batch_bytes           | 65536                                 |
  | ndb_clear_apply_status               | ON                                    |
  | ndb_cluster_connection_pool          | 1                                     |
  | ndb_cluster_connection_pool_nodeids  |                                       |
  | ndb_connectstring                    | 127.0.0.1                             |
  | ndb_data_node_neighbour              | 0                                     |
  | ndb_default_column_format            | FIXED                                 |
  | ndb_deferred_constraints             | 0                                     |
  | ndb_distribution                     | KEYHASH                               |
  | ndb_eventbuffer_free_percent         | 20                                    |
  | ndb_eventbuffer_max_alloc            | 0                                     |
  | ndb_extra_logging                    | 1                                     |
  | ndb_force_send                       | ON                                    |
  | ndb_fully_replicated                 | OFF                                   |
  | ndb_index_stat_enable                | ON                                    |
  | ndb_index_stat_option                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | ndb_join_pushdown                    | ON                                    |
  | ndb_log_apply_status                 | OFF                                   |
  | ndb_log_bin                          | OFF                                   |
  | ndb_log_binlog_index                 | ON                                    |
  | ndb_log_empty_epochs                 | OFF                                   |
  | ndb_log_empty_update                 | OFF                                   |
  | ndb_log_exclusive_reads              | OFF                                   |
  | ndb_log_orig                         | OFF                                   |
  | ndb_log_transaction_id               | OFF                                   |
  | ndb_log_update_as_write              | ON                                    |
  | ndb_log_update_minimal               | OFF                                   |
  | ndb_log_updated_only                 | ON                                    |
  | ndb_metadata_check                   | ON                                    |
  | ndb_metadata_check_interval          | 60                                    |
  | ndb_metadata_sync                    | OFF                                   |
  | ndb_mgmd_host                        | 127.0.0.1                             |
  | ndb_nodeid                           | 0                                     |
  | ndb_optimization_delay               | 10                                    |
  | ndb_optimized_node_selection         | 3                                     |
  | ndb_read_backup                      | ON                                    |
  | ndb_recv_thread_activation_threshold | 8                                     |
  | ndb_recv_thread_cpu_mask             |                                       |
  | ndb_report_thresh_binlog_epoch_slip  | 10                                    |
  | ndb_report_thresh_binlog_mem_usage   | 10                                    |
  | ndb_row_checksum                     | 1                                     |
  | ndb_schema_dist_lock_wait_timeout    | 30                                    |
  | ndb_schema_dist_timeout              | 120                                   |
  | ndb_schema_dist_upgrade_allowed      | ON                                    |
  | ndb_show_foreign_key_mock_tables     | OFF                                   |
  | ndb_slave_conflict_role              | NONE                                  |
  | ndb_table_no_logging                 | OFF                                   |
  | ndb_table_temporary                  | OFF                                   |
  | ndb_use_copying_alter_table          | OFF                                   |
  | ndb_use_exact_count                  | OFF                                   |
  | ndb_use_transactions                 | ON                                    |
  | ndb_version                          | 524308                                |
  | ndb_version_string                   | ndb-8.0.44                            |
  | ndb_wait_connected                   | 30                                    |
  | ndb_wait_setup                       | 30                                    |
  | ndbinfo_database                     | ndbinfo                               |
  | ndbinfo_max_bytes                    | 0                                     |
  | ndbinfo_max_rows                     | 10                                    |
  | ndbinfo_offline                      | OFF                                   |
  | ndbinfo_show_hidden                  | OFF                                   |
  | ndbinfo_table_prefix                 | ndb$                                  |
  | ndbinfo_version                      | 524308                                |
  +--------------------------------------+---------------------------------------+
  ```

Ao contrário do caso da declaração `SHOW VARIABLES`(show-variables.html "15.7.7.41 SHOW VARIABLES Statement"), é possível selecionar colunas individuais. Por exemplo:

  ```
  mysql> SELECT VARIABLE_VALUE
      ->   FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME = 'ndb_force_send';
  +----------------+
  | VARIABLE_VALUE |
  +----------------+
  | ON             |
  +----------------+
  ```

Aqui está uma consulta mais útil:

  ```
  mysql> SELECT VARIABLE_NAME AS Name, VARIABLE_VALUE AS Value
       >   FROM performance_schema.global_variables
       >   WHERE VARIABLE_NAME
       >     IN ('version', 'ndb_version',
       >       'ndb_version_string', 'ndbinfo_version');

  +--------------------+----------------+
  | Name               | Value          |
  +--------------------+----------------+
  | ndb_version        | 524317         |
  | ndb_version_string | ndb-8.0.29     |
  | ndbinfo_version    | 524317         |
  | version            | 8.0.29-cluster |
  +--------------------+----------------+
  4 rows in set (0.00 sec)
  ```

Para mais informações, consulte a Seção 29.12.15, “Tabelas de Variáveis de Estado do Schema de Desempenho”, e a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `SHOW STATUS LIKE 'NDB%'`

Essa declaração mostra, de uma só vez, se o servidor MySQL está atuando como um nó SQL de cluster ou não, e, se sim, fornece o ID do nó de cluster do servidor MySQL, o nome do host e a porta para o servidor de gerenciamento de cluster ao qual está conectado, e o número de nós de dados no cluster, conforme mostrado aqui:

  ```
  mysql> SHOW STATUS LIKE 'NDB%';
  +----------------------------------------------+-------------------------------+
  | Variable_name                                | Value                         |
  +----------------------------------------------+-------------------------------+
  | Ndb_metadata_detected_count                  | 0                             |
  | Ndb_cluster_node_id                          | 100                           |
  | Ndb_config_from_host                         | 127.0.0.1                     |
  | Ndb_config_from_port                         | 1186                          |
  | Ndb_number_of_data_nodes                     | 2                             |
  | Ndb_number_of_ready_data_nodes               | 2                             |
  | Ndb_connect_count                            | 0                             |
  | Ndb_execute_count                            | 0                             |
  | Ndb_scan_count                               | 0                             |
  | Ndb_pruned_scan_count                        | 0                             |
  | Ndb_schema_locks_count                       | 0                             |
  | Ndb_api_wait_exec_complete_count_session     | 0                             |
  | Ndb_api_wait_scan_result_count_session       | 0                             |
  | Ndb_api_wait_meta_request_count_session      | 1                             |
  | Ndb_api_wait_nanos_count_session             | 163446                        |
  | Ndb_api_bytes_sent_count_session             | 60                            |
  | Ndb_api_bytes_received_count_session         | 28                            |
  | Ndb_api_trans_start_count_session            | 0                             |
  | Ndb_api_trans_commit_count_session           | 0                             |
  | Ndb_api_trans_abort_count_session            | 0                             |
  | Ndb_api_trans_close_count_session            | 0                             |
  | Ndb_api_pk_op_count_session                  | 0                             |
  | Ndb_api_uk_op_count_session                  | 0                             |
  | Ndb_api_table_scan_count_session             | 0                             |
  | Ndb_api_range_scan_count_session             | 0                             |
  | Ndb_api_pruned_scan_count_session            | 0                             |
  | Ndb_api_scan_batch_count_session             | 0                             |
  | Ndb_api_read_row_count_session               | 0                             |
  | Ndb_api_trans_local_read_row_count_session   | 0                             |
  | Ndb_api_adaptive_send_forced_count_session   | 0                             |
  | Ndb_api_adaptive_send_unforced_count_session | 0                             |
  | Ndb_api_adaptive_send_deferred_count_session | 0                             |
  | Ndb_trans_hint_count_session                 | 0                             |
  | Ndb_sorted_scan_count                        | 0                             |
  | Ndb_pushed_queries_defined                   | 0                             |
  | Ndb_pushed_queries_dropped                   | 0                             |
  | Ndb_pushed_queries_executed                  | 0                             |
  | Ndb_pushed_reads                             | 0                             |
  | Ndb_last_commit_epoch_server                 | 37632503447571                |
  | Ndb_last_commit_epoch_session                | 0                             |
  | Ndb_system_name                              | MC_20191126162038             |
  | Ndb_api_event_data_count_injector            | 0                             |
  | Ndb_api_event_nondata_count_injector         | 0                             |
  | Ndb_api_event_bytes_count_injector           | 0                             |
  | Ndb_api_wait_exec_complete_count_slave       | 0                             |
  | Ndb_api_wait_scan_result_count_slave         | 0                             |
  | Ndb_api_wait_meta_request_count_slave        | 0                             |
  | Ndb_api_wait_nanos_count_slave               | 0                             |
  | Ndb_api_bytes_sent_count_slave               | 0                             |
  | Ndb_api_bytes_received_count_slave           | 0                             |
  | Ndb_api_trans_start_count_slave              | 0                             |
  | Ndb_api_trans_commit_count_slave             | 0                             |
  | Ndb_api_trans_abort_count_slave              | 0                             |
  | Ndb_api_trans_close_count_slave              | 0                             |
  | Ndb_api_pk_op_count_slave                    | 0                             |
  | Ndb_api_uk_op_count_slave                    | 0                             |
  | Ndb_api_table_scan_count_slave               | 0                             |
  | Ndb_api_range_scan_count_slave               | 0                             |
  | Ndb_api_pruned_scan_count_slave              | 0                             |
  | Ndb_api_scan_batch_count_slave               | 0                             |
  | Ndb_api_read_row_count_slave                 | 0                             |
  | Ndb_api_trans_local_read_row_count_slave     | 0                             |
  | Ndb_api_adaptive_send_forced_count_slave     | 0                             |
  | Ndb_api_adaptive_send_unforced_count_slave   | 0                             |
  | Ndb_api_adaptive_send_deferred_count_slave   | 0                             |
  | Ndb_slave_max_replicated_epoch               | 0                             |
  | Ndb_api_wait_exec_complete_count             | 4                             |
  | Ndb_api_wait_scan_result_count               | 7                             |
  | Ndb_api_wait_meta_request_count              | 172                           |
  | Ndb_api_wait_nanos_count                     | 1083548094028                 |
  | Ndb_api_bytes_sent_count                     | 4640                          |
  | Ndb_api_bytes_received_count                 | 109356                        |
  | Ndb_api_trans_start_count                    | 4                             |
  | Ndb_api_trans_commit_count                   | 1                             |
  | Ndb_api_trans_abort_count                    | 1                             |
  | Ndb_api_trans_close_count                    | 4                             |
  | Ndb_api_pk_op_count                          | 2                             |
  | Ndb_api_uk_op_count                          | 0                             |
  | Ndb_api_table_scan_count                     | 1                             |
  | Ndb_api_range_scan_count                     | 1                             |
  | Ndb_api_pruned_scan_count                    | 0                             |
  | Ndb_api_scan_batch_count                     | 1                             |
  | Ndb_api_read_row_count                       | 3                             |
  | Ndb_api_trans_local_read_row_count           | 2                             |
  | Ndb_api_adaptive_send_forced_count           | 1                             |
  | Ndb_api_adaptive_send_unforced_count         | 5                             |
  | Ndb_api_adaptive_send_deferred_count         | 0                             |
  | Ndb_api_event_data_count                     | 0                             |
  | Ndb_api_event_nondata_count                  | 0                             |
  | Ndb_api_event_bytes_count                    | 0                             |
  | Ndb_metadata_excluded_count                  | 0                             |
  | Ndb_metadata_synced_count                    | 0                             |
  | Ndb_conflict_fn_max                          | 0                             |
  | Ndb_conflict_fn_old                          | 0                             |
  | Ndb_conflict_fn_max_del_win                  | 0                             |
  | Ndb_conflict_fn_epoch                        | 0                             |
  | Ndb_conflict_fn_epoch_trans                  | 0                             |
  | Ndb_conflict_fn_epoch2                       | 0                             |
  | Ndb_conflict_fn_epoch2_trans                 | 0                             |
  | Ndb_conflict_trans_row_conflict_count        | 0                             |
  | Ndb_conflict_trans_row_reject_count          | 0                             |
  | Ndb_conflict_trans_reject_count              | 0                             |
  | Ndb_conflict_trans_detect_iter_count         | 0                             |
  | Ndb_conflict_trans_conflict_commit_count     | 0                             |
  | Ndb_conflict_epoch_delete_delete_count       | 0                             |
  | Ndb_conflict_reflected_op_prepare_count      | 0                             |
  | Ndb_conflict_reflected_op_discard_count      | 0                             |
  | Ndb_conflict_refresh_op_count                | 0                             |
  | Ndb_conflict_last_conflict_epoch             | 0                             |
  | Ndb_conflict_last_stable_epoch               | 0                             |
  | Ndb_index_stat_status                        | allow:1,enable:1,busy:0,
  loop:1000,list:(new:0,update:0,read:0,idle:0,check:0,delete:0,error:0,total:0),
  analyze:(queue:0,wait:0),stats:(nostats:0,wait:0),total:(analyze:(all:0,error:0),
  query:(all:0,nostats:0,error:0),event:(act:0,skip:0,miss:0),cache:(refresh:0,
  clean:0,pinned:0,drop:0,evict:0)),cache:(query:0,clean:0,drop:0,evict:0,
  usedpct:0.00,highpct:0.00)                                                     |
  | Ndb_index_stat_cache_query                   | 0                             |
  | Ndb_index_stat_cache_clean                   | 0                             |
  +----------------------------------------------+-------------------------------+
  ```

Se o servidor MySQL foi construído com suporte ao `NDB`, mas atualmente não está conectado a um clúster, cada linha no resultado desta declaração contém um zero ou uma string vazia para a coluna `Value`.

Veja também a Seção 15.7.7.37, “Declaração de Status”.

* `SELECT * FROM performance_schema.global_status WHERE VARIABLE_NAME LIKE 'NDB%'`

Essa declaração fornece uma saída semelhante à da declaração `SHOW STATUS`, discutida no item anterior. Ao contrário do caso com a declaração `SHOW STATUS`, é possível usar declarações `SELECT` para extrair valores em SQL para uso em scripts de monitoramento e automação.

Para mais informações, consulte a Seção 29.12.15, “Tabelas de Variáveis de Estado do Schema de Desempenho”.

* `SELECT * FROM INFORMATION_SCHEMA.PLUGINS WHERE PLUGIN_NAME LIKE 'NDB%'`

Essa declaração exibe informações da tabela do esquema de informações `PLUGINS` sobre plugins associados ao NDB Cluster, como versão, autor e licença, conforme mostrado aqui:

  ```
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS
       >     WHERE PLUGIN_NAME LIKE 'NDB%'\G
  *************************** 1. row ***************************
             PLUGIN_NAME: ndbcluster
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 80044.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Clustered, fault-tolerant tables
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 2. row ***************************
             PLUGIN_NAME: ndbinfo
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 80044.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: MySQL Cluster system information storage engine
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 3. row ***************************
             PLUGIN_NAME: ndb_transid_mysql_connection_map
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: INFORMATION SCHEMA
     PLUGIN_TYPE_VERSION: 80044.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Map between MySQL connection ID and NDB transaction ID
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ```

Você também pode usar a declaração `SHOW PLUGINS`(show-plugins.html "15.7.7.25 SHOW PLUGINS Statement") para exibir essas informações, mas o resultado dessa declaração não pode ser facilmente filtrado. Veja também a API do Plugin MySQL, que descreve onde e como as informações na tabela `PLUGINS` são obtidas.

Você também pode consultar as tabelas no banco de dados de informações `ndbinfo` para obter dados em tempo real sobre muitas operações do NDB Cluster. Veja a Seção 25.6.16, “ndbinfo: O banco de dados de informações do NDB Cluster”.

### 25.6.20 Problemas de segurança do cluster do NDB

Esta seção discute as considerações de segurança a serem levadas em conta ao configurar e executar o NDB Cluster.

Os tópicos abordados nesta seção incluem os seguintes:

* Problemas de segurança de rede e do NDB Cluster
* Problemas de configuração relacionados ao funcionamento seguro do NDB Cluster
* NDB Cluster e o sistema de privilégios do MySQL
* Procedimentos de segurança padrão do MySQL, conforme aplicável ao NDB Cluster

#### 25.6.20.1 Problemas de segurança e de rede do cluster do NDB

Nesta seção, discutimos questões básicas de segurança de rede, pois elas se relacionam com o NDB Cluster. É extremamente importante lembrar que o NDB Cluster "do jeito que vem" não é seguro; você ou seu administrador de rede deve tomar as medidas adequadas para garantir que seu clúster não possa ser comprometido pela rede.

Os protocolos de comunicação em cluster são inerentemente inseguros e não há criptografia ou medidas de segurança semelhantes utilizadas nas comunicações entre os nós do cluster. Como a velocidade e a latência da rede têm um impacto direto na eficiência do cluster, também não é aconselhável empregar SSL ou outras criptografias em conexões de rede entre os nós, pois tais esquemas causam comunicações lentas.

Também é verdade que nenhuma autenticação é usada para controlar o acesso ao nó da API em um NDB Cluster. Assim como na criptografia, o custo de impor requisitos de autenticação teria um impacto negativo no desempenho do Cluster.

Além disso, não há verificação do endereço IP de origem para nenhum dos seguintes casos ao acessar o clúster:

* Nós SQL ou nós API usando "locais livres" criados por seções vazias `[mysqld]` ou `[api]` no arquivo `config.ini`

Isso significa que, se houver quaisquer seções vazias de `[mysqld]` ou `[api]` no arquivo `config.ini`, então quaisquer nós da API (incluindo nós SQL) que conheçam o nome do host (ou endereço IP) do servidor de gerenciamento podem se conectar ao clúster e acessar seus dados sem restrições. (Consulte a Seção 25.6.20.2, “Clúster NDB e Privilégios MySQL”, para mais informações sobre isso e questões relacionadas.)

Nota

Você pode exercer algum controle sobre o acesso ao nó SQL e API do cluster, especificando um parâmetro `HostName` para todas as seções `[mysqld]` e `[api]` no arquivo `config.ini`. No entanto, isso também significa que, se você deseja conectar um nó da API ao cluster a partir de um host que não foi usado anteriormente, você precisa adicionar uma seção `[api]` contendo seu nome de host ao arquivo `config.ini`.

Mais informações estão disponíveis [em outro lugar neste capítulo][(mysql-cluster-api-definition.html#ndbparam-api-hostname)] sobre o parâmetro `HostName`. Veja também a Seção 25.4.1, “Configuração rápida do NDB Cluster”, para exemplos de configuração usando `HostName` com nós da API.

* Qualquer cliente **ndb_mgm**

Isso significa que qualquer cliente de gerenciamento de clúster que receber o nome do host (ou endereço IP) do servidor de gerenciamento e a porta (se não for a porta padrão) pode se conectar ao clúster e executar qualquer comando do cliente de gerenciamento. Isso inclui comandos como `ALL STOP` (mysql-cluster-mgm-client-commands.html#ndbclient-stop) e `SHUTDOWN`.

Por essas razões, é necessário proteger o clúster em nível de rede. A configuração de rede mais segura para o Clúster é aquela que isola as conexões entre os nós do Clúster de qualquer outra comunicação de rede. Isso pode ser feito por qualquer um dos seguintes métodos:

1. Manter os nós do cluster em uma rede que é fisicamente separada de qualquer rede pública. Esta opção é a mais confiável; no entanto, é a mais cara de implementar.

Mostramos um exemplo de configuração de um NDB Cluster usando uma rede fisicamente segregada aqui:

**Figura 25.7 Grupo NDB com Firewall de Hardware**

   ![Content is described in the surrounding text.](images/cluster-security-network-1.png)

Essa configuração tem duas redes, uma privada (caixa sólida) para os servidores de gerenciamento do cluster e os nós de dados, e uma pública (caixa pontilhada) onde os nós SQL residem. (Mostramos os nós de gerenciamento e dados conectados usando um switch de gigabit, pois isso oferece o melhor desempenho.) Ambas as redes são protegidas do exterior por um firewall de hardware, às vezes também conhecido como firewall baseado em rede.

Essa configuração de rede é a mais segura, pois nenhum pacote pode alcançar os nós de gerenciamento ou dados do clúster de fora da rede — e nenhuma das comunicações internas do clúster pode alcançar o exterior — sem passar pelos nós SQL, desde que os nós SQL não permitam que nenhum pacote seja encaminhado. Isso significa, claro, que todos os nós SQL devem ser protegidos contra tentativas de hacking.

Importante

Em relação a potenciais vulnerabilidades de segurança, um nó SQL não é diferente de qualquer outro servidor MySQL. Consulte a Seção 8.1.3, “Tornando o MySQL seguro contra atacantes”, para uma descrição das técnicas que você pode usar para proteger os servidores MySQL.

2. Utilizar um ou mais firewalls de software (também conhecidos como firewalls baseados em host) para controlar quais pacotes passam para o clúster a partir de partes da rede que não exigem acesso a ele. Nesse tipo de configuração, um firewall de software deve ser instalado em cada host do clúster, que, de outra forma, pode ser acessível de fora da rede local.

A opção baseada no host é a menos dispendiosa de implementar, mas depende exclusivamente de software para fornecer proteção e, portanto, é a mais difícil de manter segura.

Este tipo de configuração de rede para o NDB Cluster é ilustrado aqui:

**Figura 25.8 Grupo NDB com firewalls de software**

   ![Content is described in the surrounding text.](images/cluster-security-network-2.png)

Usar esse tipo de configuração de rede significa que existem duas zonas de hosts do NDB Cluster. Cada host do clúster deve ser capaz de se comunicar com todas as outras máquinas do clúster, mas apenas aqueles que hospedam nós SQL (caixa pontilhada) podem ser autorizados a ter qualquer contato com o exterior, enquanto aqueles na zona que contém os nós de dados e os nós de gerenciamento (caixa sólida) devem ser isolados de quaisquer máquinas que não fazem parte do clúster. As aplicações que utilizam o clúster e os usuários dessas aplicações não devem ter acesso direto aos hosts dos nós de gerenciamento e dados.

Para isso, você deve configurar firewalls de software que limitem o tráfego ao tipo ou aos tipos mostrados na tabela a seguir, de acordo com o tipo de nó que está sendo executado em cada computador hospedeiro do clúster:

**Tabela 25.68 Tipos de nós em uma configuração de clúster de firewall baseado em host**

   <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de nó</th> <th>Permitido o tráfego</th> </tr></thead><tbody><tr> <td>nó SQL ou API</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Ela origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP).</p></li><li class="listitem"><p>Ela se origina dentro da rede na qual o clúster reside e está no porto que sua aplicação está usando.</p></li></ul> </div> </td> </tr><tr> <td>Núcleo de dados ou Núcleo de gerenciamento</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Ela origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP).</p></li><li class="listitem"><p>Ela se origina do endereço IP de um nó SQL ou API.</p></li></ul> </div> </td> </tr></tbody></table>

Qualquer tráfego que não seja o mostrado na tabela para um determinado tipo de nó deve ser negado.

Os detalhes de configuração de um firewall variam de aplicação de firewall para aplicação de firewall e estão além do escopo deste Manual. **iptables** é uma aplicação de firewall muito comum e confiável, que é frequentemente usada com **APF** como uma frente para facilitar a configuração. Você pode (e deve) consultar a documentação do firewall de software que você emprega, caso opte por implementar uma configuração de rede de NDB Cluster deste tipo, ou de um tipo "misturado", conforme discutido no próximo item.

3. Também é possível empregar uma combinação dos dois primeiros métodos, utilizando tanto hardware quanto software para proteger o clúster — ou seja, utilizando tanto firewalls baseados em rede quanto baseados no host. Isso está entre os dois primeiros esquemas em termos de nível de segurança e custo. Esse tipo de configuração de rede mantém o clúster atrás do firewall de hardware, mas permite que os pacotes de entrada percorram além do roteador que conecta todos os hosts do clúster para alcançar os nós do SQL.

Uma possível implantação de rede de um NDB Cluster usando firewalls de hardware e software em combinação é mostrada aqui:

**Figura 25.9 Grupo NDB com uma combinação de firewalls de hardware e software**

   ![Content is described in the surrounding text.](images/cluster-security-network-3.png)

Nesse caso, você pode definir as regras no firewall de hardware para negar qualquer tráfego externo, exceto para os nós SQL e os nós API, e, em seguida, permitir o tráfego para eles apenas nas portas necessárias para sua aplicação.

Independentemente da configuração de rede que você use, lembre-se de que seu objetivo, do ponto de vista da segurança do clúster, permanece o mesmo: impedir que qualquer tráfego desnecessário alcance o clúster, garantindo a comunicação mais eficiente entre os nós do clúster.

Como o NDB Cluster exige que um grande número de portas esteja aberto para comunicações entre os nós, a opção recomendada é usar uma rede segregada. Isso representa a maneira mais simples de impedir que o tráfego indesejado alcance o clúster.

Nota

Se você deseja administrar um NDB Cluster remotamente (ou seja, de fora da rede local), a maneira recomendada para fazer isso é usar o **ssh** ou outro shell de login seguro para acessar um host de nó SQL. A partir deste host, você pode então executar o cliente de gerenciamento para acessar o servidor de gerenciamento com segurança, dentro da própria rede local do cluster.

Embora seja possível fazer isso em teoria, não é recomendado usar **ndb_mgm** para gerenciar um cluster diretamente de fora da rede local em que o cluster está em execução. Como nem autenticação nem criptografia ocorrem entre o cliente de gerenciamento e o servidor de gerenciamento, isso representa um meio extremamente inseguro de gerenciar o cluster, e é quase certo que seja comprometido cedo ou tarde.

#### 25.6.20.2 Grupo NDB e privilégios do MySQL

Nesta seção, discutimos como o sistema de privilégios do MySQL funciona em relação ao NDB Cluster e as implicações disso para manter um NDB Cluster seguro.

Os privilégios padrão do MySQL são aplicados às tabelas do NDB Cluster. Isso inclui todos os tipos de privilégio do MySQL (`SELECT` privilégio, `UPDATE` privilégio, `DELETE` privilégio, e assim por diante) concedidos no nível do banco de dados, tabela e coluna. Como em qualquer outro servidor MySQL, as informações de usuário e privilégio são armazenadas no banco de dados do sistema `mysql`. As instruções SQL usadas para conceder e revogar privilégios em tabelas `NDB`, bancos que contêm tais tabelas e colunas dentro dessas tabelas são idênticas em todos os aspectos com as instruções `GRANT` e `REVOKE` usadas em conexão com objetos de banco de dados que envolvem qualquer (outro) motor de armazenamento MySQL. O mesmo vale para as instruções `CREATE USER` e `DROP USER`.

É importante ter em mente que, por padrão, as tabelas de concessão do MySQL utilizam o mecanismo de armazenamento `InnoDB`. Por isso, essas tabelas normalmente não são duplicadas ou compartilhadas entre os servidores MySQL que atuam como nós SQL em um NDB Cluster. Em outras palavras, as alterações nos usuários e seus privilégios não se propagam automaticamente por padrão entre os nós SQL. Se desejar, pode habilitar a sincronização dos usuários e privilégios do MySQL entre os nós SQL do NDB Cluster; consulte a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”, para obter detalhes.

Por outro lado, como não é possível negar privilégios no MySQL (os privilégios podem ser revogados ou não concedidos em primeiro lugar, mas não negados como tal), não há proteção especial para as tabelas `NDB` em um nó SQL contra usuários que têm privilégios em outro nó SQL; isso é verdade mesmo que você não esteja usando a distribuição automática de privilégios de usuário. O exemplo definitivo disso é a conta MySQL `root`, que pode realizar qualquer ação em qualquer objeto de banco de dados. Em combinação com seções `[mysqld]` ou `[api]` vazias do arquivo `config.ini`, essa conta pode ser especialmente perigosa. Para entender por que, considere o seguinte cenário:

* O arquivo `config.ini` contém pelo menos uma seção `[mysqld]` ou `[api]` vazia. Isso significa que o servidor de gerenciamento do NDB Cluster não realiza nenhuma verificação do host a partir do qual um servidor MySQL (ou outro nó da API) acessa o NDB Cluster.

* Não há firewall, ou o firewall não consegue proteger contra o acesso ao NDB Cluster de hosts externos à rede.

* O nome de domínio ou o endereço IP do servidor de gerenciamento do NDB Cluster é conhecido ou pode ser determinado fora da rede.

Se essas condições forem verdadeiras, qualquer pessoa, em qualquer lugar, pode iniciar um servidor MySQL com `--ndbcluster` `--ndb-connectstring=management_host` e acessar este NDB Cluster. Usando a conta MySQL `root`, essa pessoa pode, então, realizar as seguintes ações:

* Execute declarações de metadados, como a declaração `SHOW DATABASES` (para obter uma lista de todas as bases de dados `NDB` no servidor) ou a declaração [`SHOW TABLES FROM some_ndb_database`](show-tables.html "15.7.7.39 SHOW TABLES Statement") para obter uma lista de todas as tabelas `NDB` em uma determinada base de dados

* Execute qualquer declaração legal do MySQL em qualquer uma das tabelas descobertas, como:

+ `SELECT * FROM some_table` ou `TABLE some_table` para ler todos os dados de qualquer tabela

+ `DELETE FROM some_table` ou TRUNCATE TABLE para excluir todos os dados de uma tabela

+ `DESCRIBE some_table` ou `SHOW CREATE TABLE some_table` para determinar o esquema da tabela

+ `UPDATE some_table SET column1 = some_value` para preencher uma coluna de tabela com dados de "lixo"; isso pode causar danos muito maiores do que simplesmente excluir todos os dados

Variantes mais insidiosas podem incluir declarações como essas:

    ```
    UPDATE some_table SET an_int_column = an_int_column + 1
    ```

ou

    ```
    UPDATE some_table SET a_varchar_column = REVERSE(a_varchar_column)
    ```

Tais declarações maliciosas são limitadas apenas pela imaginação do atacante.

As únicas tabelas que seriam seguras desse tipo de caos seriam aquelas que foram criadas usando motores de armazenamento que não são o `NDB`, e, portanto, não são visíveis para um nó SQL "espião".

Um usuário que pode fazer login como `root` também pode acessar o banco de dados `INFORMATION_SCHEMA` e suas tabelas, e assim obter informações sobre bancos de dados, tabelas, rotinas armazenadas, eventos agendados e quaisquer outros objetos de banco de dados para os quais os metadados são armazenados em `INFORMATION_SCHEMA`.

É também uma boa ideia usar senhas diferentes para as contas do `root` em diferentes nós do NDB Cluster SQL, a menos que você esteja usando privilégios compartilhados.

Em resumo, você não pode ter um NDB Cluster seguro se ele estiver diretamente acessível de fora da sua rede local.

Importante

*Nunca deixe a senha da conta raiz do MySQL em branco*. Isso é igualmente verdadeiro ao executar o MySQL como um nó SQL do NDB Cluster, assim como ao executá-lo como um servidor MySQL independente (não Cluster), e deve ser feito como parte do processo de instalação do MySQL antes de configurar o servidor MySQL como um nó SQL em um NDB Cluster.

Se você precisar sincronizar as tabelas do sistema `mysql` entre os nós do SQL, você pode usar a replicação padrão do MySQL para fazer isso, ou usar um script para copiar as entradas das tabelas entre os servidores do MySQL. Usuários e seus privilégios podem ser compartilhados e mantidos sincronizados usando o privilégio `NDB_STORED_USER`.

**Resumo.** Os pontos mais importantes a lembrar em relação ao sistema de privilégios do MySQL em relação ao NDB Cluster estão listados aqui:

1. Os usuários e privilégios estabelecidos em um nó SQL não existem ou não se aplicam automaticamente em outros nós SQL do clúster. Por outro lado, a remoção de um usuário ou privilégio em um nó SQL do clúster não remove o usuário ou privilégio de quaisquer outros nós SQL.

2. Você pode compartilhar usuários e privilégios MySQL entre nós SQL usando `NDB_STORED_USER`.

3. Uma vez que um usuário do MySQL receba privilégios em uma tabela `NDB` de um nó SQL em um NDB Cluster, esse usuário pode "ver" qualquer dado nessa tabela, independentemente do nó SQL do qual os dados se originaram, mesmo que esse usuário não seja compartilhado.

#### 25.6.20.3 Procedimentos de segurança do NDBS e do MySQL Cluster

Nesta seção, discutimos os procedimentos de segurança padrão do MySQL, conforme eles se aplicam ao funcionamento do NDB Cluster.

Em geral, qualquer procedimento padrão para executar o MySQL de forma segura também se aplica à execução de um servidor MySQL como parte de um NDB Cluster. Em primeiro lugar, você deve sempre executar um servidor MySQL como o usuário do sistema operacional `mysql`; isso não difere da execução do MySQL em um ambiente padrão (não Cluster). A conta de sistema `mysql` deve ser definida de forma única e clara. Felizmente, esse é o comportamento padrão para uma nova instalação do MySQL. Você pode verificar que o processo **mysqld** está sendo executado como o usuário do sistema operacional `mysql` usando o comando do sistema, como o mostrado aqui:

```
$> ps aux | grep mysql
root     10467  0.0  0.1   3616  1380 pts/3    S    11:53   0:00 \
  /bin/sh ./mysqld_safe --ndbcluster --ndb-connectstring=localhost:1186
mysql    10512  0.2  2.5  58528 26636 pts/3    Sl   11:53   0:00 \
  /usr/local/mysql/libexec/mysqld --basedir=/usr/local/mysql \
  --datadir=/usr/local/mysql/var --user=mysql --ndbcluster \
  --ndb-connectstring=localhost:1186 --pid-file=/usr/local/mysql/var/mothra.pid \
  --log-error=/usr/local/mysql/var/mothra.err
jon      10579  0.0  0.0   2736   688 pts/0    S+   11:54   0:00 grep mysql
```

Se o processo **mysqld** estiver rodando como qualquer outro usuário que não seja `mysql`, você deve imediatamente desligá-lo e reiniciá-lo como o usuário `mysql`. Se esse usuário não existir no sistema, a conta de usuário `mysql` deve ser criada, e esse usuário deve fazer parte do grupo de usuários `mysql`; nesse caso, você também deve garantir que o diretório de dados do MySQL neste sistema (definido usando a opção `--datadir` para **mysqld**) seja de propriedade do usuário `mysql`, e que o arquivo `my.cnf` do nó SQL inclua `user=mysql` na seção `[mysqld]`. Alternativamente, você pode iniciar o processo do servidor MySQL com `--user=mysql` na linha de comando, mas é preferível usar a opção `my.cnf`, pois você pode esquecer de usar a opção de linha de comando e, assim, ter **mysqld** rodando como outro usuário sem intenção. O script de inicialização **mysqld_safe** força o MySQL a rodar como o usuário `mysql`.

Importante

Nunca execute o **mysqld** como usuário raiz do sistema. Isso significa que qualquer arquivo no sistema pode ser lido pelo MySQL, e, portanto, se o MySQL for comprometido, por um atacante.

Como mencionado na seção anterior (ver Seção 25.6.20.2, “NBD Cluster e Privilegios do MySQL”), você deve sempre definir uma senha de raiz para o servidor MySQL assim que ele estiver em execução. Você também deve excluir a conta de usuário anônimo que é instalada por padrão. Você pode realizar essas tarefas usando as seguintes declarações:

```
$> mysql -u root

mysql> UPDATE mysql.user
    ->     SET Password=PASSWORD('secure_password')
    ->     WHERE User='root';

mysql> DELETE FROM mysql.user
    ->     WHERE User='';

mysql> FLUSH PRIVILEGES;
```

Tenha muito cuidado ao executar a declaração `DELETE` para não omitir a cláusula `WHERE`, pois corre o risco de *deletar* todos os usuários do MySQL. Certifique-se de executar a declaração `FLUSH PRIVILEGES` assim que tiver modificado a tabela `mysql.user`, para que as alterações tenham efeito imediato. Sem `FLUSH PRIVILEGES`, as alterações não terão efeito até que o servidor seja reiniciado da próxima vez.

Nota

Muitos dos utilitários do NDB Cluster, como **ndb_show_tables**, **ndb_desc** e **ndb_select_all**, também funcionam sem autenticação e podem revelar nomes de tabelas, esquemas e dados. Por padrão, esses são instalados em sistemas de estilo Unix com as permissões `wxr-xr-x` (755), o que significa que podem ser executados por qualquer usuário que possa acessar o diretório `mysql/bin`.

Consulte a Seção 25.5, “Programas de Clúster NDB”, para obter mais informações sobre esses utilitários.