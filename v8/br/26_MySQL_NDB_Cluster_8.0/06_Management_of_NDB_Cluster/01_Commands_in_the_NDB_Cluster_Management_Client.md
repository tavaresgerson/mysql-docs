### 25.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

Além do arquivo de configuração central, um clúster também pode ser controlado por meio de uma interface de linha de comando disponível através do cliente de gerenciamento **ndb\_mgm**. Esta é a principal interface administrativa de um clúster em execução.

Os comandos para os registros de eventos estão descritos na Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”; os comandos para criar backups e restaurá-los estão fornecidos na Seção 25.6.8, “Backup Online do NDB Cluster”.

**Usando ndb\_mgm com o MySQL Cluster Manager.**

O MySQL Cluster Manager 1.4.8 oferece suporte experimental para o NDB 8.0. O MySQL Cluster Manager gerencia o início e o término de processos e acompanha seus estados internamente, portanto, não é necessário usar o **ndb\_mgm** para essas tarefas em um NDB Cluster sob controle do MySQL Cluster Manager. Recomenda-se *não* usar o cliente de linha de comando **ndb\_mgm** que vem com a distribuição do NDB Cluster para realizar operações que envolvam o início ou o término de nós. Isso inclui, mas não se limita aos comandos `START`, `STOP`, `RESTART` e `SHUTDOWN`. Para mais informações, consulte os comandos do MySQL Cluster Manager.

O cliente de gerenciamento possui os seguintes comandos básicos. Na lista a seguir, `node_id` denota o ID do nó de dados ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do clúster.

- `CONNECT connection-string`

  Conecta-se ao servidor de gerenciamento indicado pela cadeia de conexão. Se o cliente já estiver conectado a este servidor, ele se reconecta.

- `CREATE NODEGROUP nodeid[, nodeid, ...]`

  Cria um novo grupo de nós de cluster NDB e faz com que os nós de dados se juntem a ele.

  Este comando é usado após a adição de novos nós de dados online a um NDB Cluster e faz com que eles se juntem a um novo grupo de nós e, assim, comecem a participar plenamente do cluster. O comando aceita como único parâmetro uma lista de IDs de nós separados por vírgula — estes são os IDs dos nós recém-adicionados e iniciados, que devem se juntar ao novo grupo de nós. A lista não deve conter IDs duplicados; a partir do NDB 8.0.26, a presença de quaisquer duplicados faz com que o comando retorne um erro. O número de nós na lista deve ser o mesmo que o número de nós em cada grupo de nós que já faz parte do cluster (cada grupo de nós do NDB Cluster deve ter o mesmo número de nós). Em outras palavras, se o NDB Cluster consiste em 2 grupos de nós com 2 nós de dados cada, então o novo grupo de nós também deve ter 2 nós de dados.

  O ID do grupo de nós do novo grupo de nós criado por este comando é determinado automaticamente e sempre é o ID do grupo de nós não utilizado mais alto no clúster; não é possível configurá-lo manualmente.

  Para obter mais informações, consulte a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster Online”.

- `DROP NODEGROUP nodegroup_id`

  Descarte o grupo de nós do NDB Cluster com o código `nodegroup_id` fornecido.

  Esse comando pode ser usado para descartar um grupo de nós de um NDB Cluster. `DROP NODEGROUP` aceita como único argumento o ID do grupo de nós a ser descartado.

  `DROP NODEGROUP` atua apenas para remover os nós de dados do grupo de nós afetado desse grupo de nós. Ele não para os nós de dados, os atribui a um grupo de nós diferente ou os remove da configuração do clúster. Um nó de dados que não pertence a um grupo de nós é indicado na saída do comando do cliente de gerenciamento `SHOW` com `no nodegroup` no lugar do ID do grupo de nós, como este (indicado em negrito):

  ```
  id=3    @10.100.2.67  (8.0.44-ndb-8.0.44, no nodegroup)
  ```

  `DROP NODEGROUP` funciona apenas quando todos os nós de dados no grupo de nós a serem excluídos estão completamente vazios de qualquer dado da tabela e definições de tabela. Como atualmente não há como usar o **ndb\_mgm** ou o cliente **mysql** para remover todos os dados de um nó de dados específico ou grupo de nós, isso significa que o comando só terá sucesso nos dois casos seguintes:

  1. Após emitir `CREATE NODEGROUP` no cliente **ndb\_mgm**, mas antes de emitir quaisquer declarações `ALTER TABLE ... REORGANIZE PARTITION` no cliente **mysql**.

  2. Após a eliminação de todas as tabelas `NDBCLUSTER` usando `DROP TABLE`.

     `TRUNCATE TABLE` não funciona para esse propósito, pois isso remove apenas os dados da tabela; os nós de dados continuam a armazenar a definição de uma tabela `NDBCLUSTER` até que uma declaração `DROP TABLE` seja emitida, o que faz com que os metadados da tabela sejam eliminados.

  Para obter mais informações sobre `DROP NODEGROUP`, consulte a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster Online”.

- `ENTER SINGLE USER MODE node_id`

  Entra no modo de usuário único, onde apenas o servidor MySQL identificado pelo ID do nó `node_id` é autorizado a acessar o banco de dados.

  O cliente **ndb\_mgm** fornece um reconhecimento claro de que este comando foi emitido e entrou em vigor, conforme mostrado aqui:

  ```
  ndb_mgm> ENTER SINGLE USER MODE 100
  Single user mode entered
  Access is granted for API node 100 only.
  ```

  Além disso, o nó API ou SQL que tem acesso exclusivo quando no modo de usuário único é indicado na saída do comando `SHOW`, da seguinte forma:

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

- `EXIT SINGLE USER MODE`

  Saída do modo de usuário único, permitindo que todos os nós SQL (ou seja, todos os processos em execução do **mysqld**) acessem o banco de dados.

  Nota

  É possível usar `EXIT SINGLE USER MODE` mesmo quando não estiver no modo de usuário único, embora o comando não tenha efeito nesse caso.

- `HELP`

  Exibe informações sobre todos os comandos disponíveis.

- `node_id NODELOG DEBUG {ON|OFF}`

  Habilita o registro de depuração no log do nó, como se o(s) nó(s) de dados afetado(s) tivesse(m) sido iniciado(s) com a opção `--verbose`. `NODELOG DEBUG ON` inicia o registro de depuração; `NODELOG DEBUG OFF` desativa o registro de depuração.

- `PROMPT [prompt]`

  Altera o prompt exibido pelo **ndb\_mgm** para a literal de string `prompt`.

  `prompt` não deve ser citado (a menos que você queira que o prompt inclua as aspas). Ao contrário do caso do cliente **mysql**, sequências de caracteres especiais e escapamentos não são reconhecidos. Se chamado sem argumento, o comando redefini o prompt para o valor padrão (`ndb_mgm>`).

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

  Observe que os espaços iniciais e espaços dentro da string `prompt` não são eliminados. Os espaços finais são removidos.

- `QUIT`, `EXIT`

  Finaliza o gerenciamento do cliente.

  Este comando não afeta nenhum nó conectado ao cluster.

- `node_id REPORT report-type`

  Exibe um relatório do tipo `report-type` para o nó de dados identificado por `node_id`, ou para todos os nós de dados usando `ALL`.

  Atualmente, existem três valores aceitos para `report-type`:

  - `BackupStatus` fornece um relatório de status sobre um backup de cluster em andamento

  - `MemoryUsage` mostra quanto memória de dados e memória de índice está sendo usada por cada nó de dados, conforme mostrado neste exemplo:

    ```
    ndb_mgm> ALL REPORT MEMORY

    Node 1: Data usage is 5%(177 32K pages of total 3200)
    Node 1: Index usage is 0%(108 8K pages of total 12832)
    Node 2: Data usage is 5%(177 32K pages of total 3200)
    Node 2: Index usage is 0%(108 8K pages of total 12832)
    ```

    Essas informações também estão disponíveis na tabela `ndbinfo.memoryusage`.

  - O `EventLog` relata eventos dos buffers do log de eventos de um ou mais nós de dados.

  `report-type` é case-insensitive e “esborrafeado”; para `MemoryUsage`, você pode usar `MEMORY` (como mostrado no exemplo anterior), `memory`, ou até mesmo simplesmente `MEM` (ou `mem`). Você pode abreviar `BackupStatus` de maneira semelhante.

- `node_id RESTART [-n] [-i] [-a] [-f]`

  Reinicie o nó de dados identificado por `node_id` (ou todos os nós de dados).

  Usar a opção `-i` com `RESTART` faz com que o nó de dados realize um reinício inicial; ou seja, o sistema de arquivos do nó é excluído e recriado. O efeito é o mesmo obtido ao interromper o processo do nó de dados e, em seguida, iniciá-lo novamente usando **ndbd** `--initial` a partir da shell do sistema.

  Nota

  Os arquivos de backup e os arquivos de dados do disco não são removidos quando esta opção é usada.

  A opção `-n` faz com que o processo do nó de dados seja reiniciado, mas o nó de dados não é realmente colocado online até que o comando apropriado `START` seja emitido. O efeito desta opção é o mesmo que o obtido ao parar o nó de dados e, em seguida, iniciá-lo novamente usando **ndbd** `--nostart` ou **ndbd** `-n` a partir da shell do sistema.

  O uso do `-a` faz com que todas as transações atuais que dependem deste nó sejam abortadas. Não é realizada nenhuma verificação no GCP quando o nó se reconecta ao clúster.

  Normalmente, `RESTART` falha se a remoção do nó resultar em um clúster incompleto. A opção `-f` obriga o nó a reiniciar sem verificar isso. Se essa opção for usada e o resultado for um clúster incompleto, todo o clúster é reiniciado.

- `SHOW`

  Exibe informações básicas sobre o clúster e os nós do clúster. Para todos os nós, a saída inclui o ID do nó, o tipo e a versão do software `NDB`. Se o nó estiver conectado, seu endereço IP também é exibido; caso contrário, a saída mostra `not connected, accepting connect from ip_address`, com `any host` usado para nós que estão autorizados a se conectar a partir de qualquer endereço.

  Além disso, para os nós de dados, a saída inclui `starting` se o nó ainda não tiver sido iniciado e mostra o grupo de nós do qual o nó faz parte. Se o nó de dados estiver atuando como o nó mestre, isso é indicado com um asterisco (`*`).

  Considere um grupo cuja configuração inclui as informações mostradas aqui (as configurações adicionais possíveis foram omitidas para maior clareza):

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

  Depois que este cluster (incluindo um nó SQL) for iniciado, `SHOW` exibe a seguinte saída:

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

  A saída deste comando também indica quando o clúster está no modo de usuário único (consulte a descrição do comando `ENTER SINGLE USER MODE`, bem como a Seção 25.6.6, “Modo de Usuário Único do Clúster NDB”). No NDB 8.0, também indica qual API ou nó SQL tem acesso exclusivo quando este modo estiver em vigor; isso funciona apenas quando todos os nós de dados e nós de gerenciamento conectados ao clúster estão executando o NDB 8.0.

- `SHUTDOWN`

  Desliga todos os nós de dados do cluster e os nós de gerenciamento. Para sair do cliente de gerenciamento após isso, use `EXIT` ou `QUIT`.

  Esse comando *não* desativa nenhum nó SQL ou nó de API conectado ao cluster.

- `node_id START`

  Traz online o nó de dados identificado por `node_id` (ou todos os nós de dados).

  O `ALL START` funciona apenas em todos os nós de dados e não afeta os nós de gerenciamento.

  Importante

  Para usar este comando para colocar um nó de dados online, o nó de dados deve ter sido iniciado usando `--nostart` ou `-n`.

- `node_id STATUS`

  Exibe informações de status para o nó de dados identificado por `node_id` (ou para todos os nós de dados).

  Os possíveis valores de status do nó incluem `UNKNOWN`, `NO_CONTACT`, `NOT_STARTED`, `STARTING`, `STARTED`, `SHUTTING_DOWN` e `RESTARTING`.

  A saída deste comando também indica quando o clúster está no modo de usuário único.

- `node_id STOP [-a] [-f]`

  Para de funcionar o nó de dados ou de gerenciamento identificado por `node_id`.

  Nota

  O `ALL STOP` funciona para interromper apenas todos os nós de dados e não afeta os nós de gerenciamento.

  Um nó afetado por este comando se desconecta do clúster e seu processo associado **ndbd** ou **ndb\_mgmd** é encerrado.

  A opção `-a` faz com que o nó seja parado imediatamente, sem esperar a conclusão de quaisquer transações pendentes.

  Normalmente, `STOP` falha se o resultado causar um grupo incompleto. A opção `-f` obriga o nó a desligar sem verificar isso. Se essa opção for usada e o resultado for um grupo incompleto, o grupo é desligado imediatamente.

  Aviso

  O uso da opção `-a` também desabilita a verificação de segurança que, de outra forma, seria realizada quando o comando `STOP` é invocado, para garantir que a parada do nó não cause um grupo incompleto. Em outras palavras, você deve ter extremo cuidado ao usar a opção `-a` com o comando `STOP`, devido ao fato de que essa opção permite que o grupo seja desligado forçadamente, pois ele não tem mais uma cópia completa de todos os dados armazenados em `NDB`.

**Comandos adicionais.** Vários outros comandos disponíveis no cliente **ndb\_mgm** são descritos em outros lugares, conforme mostrado na lista a seguir:

- O `START BACKUP` é usado para realizar um backup online no cliente **ndb\_mgm**. O comando `ABORT BACKUP` é usado para cancelar um backup já em andamento. Para obter mais informações, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”.

- O comando `CLUSTERLOG` é usado para realizar várias funções de registro. Consulte a Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”, para obter mais informações e exemplos. `NODELOG DEBUG` ativa ou desativa impressões de depuração nos logs do nó, conforme descrito anteriormente nesta seção.

- Para testes e trabalhos de diagnóstico, o cliente suporta o comando `DUMP`, que pode ser usado para executar comandos internos no cluster. Ele nunca deve ser usado em um ambiente de produção, a menos que o suporte do MySQL o indique. Para mais informações, consulte os comandos DUMP do NDB Cluster Management Client.
