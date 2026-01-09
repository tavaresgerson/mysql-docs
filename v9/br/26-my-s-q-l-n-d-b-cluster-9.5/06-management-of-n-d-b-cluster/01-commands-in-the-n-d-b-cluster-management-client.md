### 25.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

Além do arquivo de configuração central, um cluster também pode ser controlado por meio de uma interface de linha de comando disponível através do cliente de gerenciamento **ndb_mgm**. Esta é a interface administrativa principal para um cluster em execução.

Os comandos para os logs de eventos estão fornecidos na Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”; os comandos para criar backups e restaurá-los estão fornecidos na Seção 25.6.8, “Backup Online do NDB Cluster”.

**Usando o ndb_mgm com o MySQL Cluster Manager.**

O MySQL Cluster Manager gerencia o início e o término de processos e rastreia seus estados internamente, portanto, não é necessário usar **ndb_mgm** para essas tarefas em um NDB Cluster sob controle do MySQL Cluster Manager. Recomenda-se *não* usar o cliente de linha de comando **ndb_mgm** que vem com a distribuição do NDB Cluster para realizar operações que envolvam o início ou o término de nós. Isso inclui, mas não se limita aos comandos `START`, `STOP`, `RESTART` e `SHUTDOWN`. Para mais informações, consulte os comandos de processo do MySQL Cluster Manager.

O cliente de gerenciamento tem os seguintes comandos básicos. Na lista a seguir, *`node_id`* denota um ID de nó de dados ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do cluster.

* `CONNECT connection-string`

  Conecta-se ao servidor de gerenciamento indicado pela string de conexão. Se o cliente já estiver conectado a este servidor, o cliente se reconecta.

* `CREATE NODEGROUP nodeid[, nodeid, ...]`

  Cria um novo grupo de nós do NDB Cluster e faz com que os nós de dados se juntem a ele.

Este comando é usado após a adição de novos nós de dados online a um NDB Cluster e faz com que eles se juntem a um novo grupo de nós e, assim, comecem a participar plenamente do cluster. O comando aceita como único parâmetro uma lista de IDs de nós separados por vírgula — estes são os IDs dos nós recém-adicionados e iniciados, que devem se juntar ao novo grupo de nós. A lista não deve conter IDs duplicados; a presença de quaisquer duplicados faz com que o comando retorne um erro. O número de nós na lista deve ser o mesmo que o número de nós em cada grupo de nós que já faz parte do cluster (cada grupo de nós de NDB Cluster deve ter o mesmo número de nós). Em outras palavras, se o NDB Cluster consiste em 2 grupos de nós com 2 nós de dados cada, então o novo grupo de nós também deve ter 2 nós de dados.

O ID do grupo de nós do novo grupo de nós criado por este comando é determinado automaticamente e sempre o próximo ID de grupo de nós não utilizado no cluster; não é possível configurá-lo manualmente.

Para mais informações, consulte a Seção 25.6.7, “Adicionar NDB Cluster Data Nodes Online”.

* `DROP NODEGROUP nodegroup_id`

  Remove o grupo de nós do NDB Cluster com o ID de *`nodegroup_id`` fornecido.

Este comando pode ser usado para remover um grupo de nós de um NDB Cluster. `DROP NODEGROUP` aceita como único argumento o ID do grupo de nós do grupo de nós a ser removido.

`DROP NODEGROUP` atua apenas para remover os nós de dados no grupo de nós afetado daquele grupo de nós. Não para os nós de dados, atribui-os a um grupo de nós diferente ou os remove da configuração do cluster. Um nó de dados que não pertence a um grupo de nós é indicado na saída do comando `SHOW` do cliente de gerenciamento com `no nodegroup` no lugar do ID do grupo de nós, assim (indicado usando texto em negrito):

```
  id=3    @10.100.2.67  (9.5.0-ndb-9.5.0, no nodegroup)
  ```

`DROP NODEGROUP` só funciona quando todos os nós de dados do grupo de nós a serem removidos estão completamente vazios de qualquer dado de tabela e definições de tabela. Como atualmente não há como usar o **ndb_mgm** ou o cliente **mysql** para remover todos os dados de um nó de dados específico ou grupo de nós, isso significa que o comando só tem sucesso nos dois casos seguintes:

  1. Após emitir `CREATE NODEGROUP` no cliente **ndb_mgm**, mas antes de emitir quaisquer declarações `ALTER TABLE ... REORGANIZE PARTITION` no cliente **mysql**.

  2. Após remover todas as tabelas `NDBCLUSTER` usando `DROP TABLE`.

  `TRUNCATE TABLE` não funciona para esse propósito, pois isso remove apenas os dados da tabela; os nós de dados continuam a armazenar a definição de uma tabela `NDBCLUSTER` até que uma declaração `DROP TABLE` seja emitida, o que faz com que os metadados da tabela sejam removidos.

Para obter mais informações sobre `DROP NODEGROUP`, consulte a Seção 25.6.7, “Adicionar Nodos de Dados do NDB Cluster Online”.

* `ENTER SINGLE USER MODE node_id`

  Entra no modo de usuário único, permitindo que apenas o servidor MySQL identificado pelo ID de nó *`node_id`* acesse o banco de dados.

  O cliente **ndb_mgm** fornece um reconhecimento claro de que este comando foi emitido e teve efeito, conforme mostrado aqui:

  ```
  ndb_mgm> ENTER SINGLE USER MODE 100
  Single user mode entered
  Access is granted for API node 100 only.
  ```

  Além disso, o nó da API ou do SQL que tem acesso exclusivo quando no modo de usuário único é indicado na saída do comando `SHOW`, assim:

  ```
  ndb_mgm> SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     2 node(s)
  id=5    @127.0.0.1  (mysql-9.5.0 ndb-9.5.0, single user mode, Nodegroup: 0, *)
  id=6    @127.0.0.1  (mysql-9.5.0 ndb-9.5.0, single user mode, Nodegroup: 0)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @127.0.0.1  (mysql-9.5.0 ndb-9.5.0)

  [mysqld(API)]   2 node(s)
  id=100  @127.0.0.1  (mysql-9.5.0 ndb-9.5.0, allowed single user)
  id=101 (not connected, accepting connect from any host)
  ```

* `EXIT SINGLE USER MODE`

  Sai do modo de usuário único, permitindo que todos os nós SQL (ou seja, todos os processos **mysqld** em execução) acessem o banco de dados.

  Nota

  É possível usar `EXIT SINGLE USER MODE` mesmo quando não está no modo de usuário único, embora o comando não tenha efeito nesse caso.

* `HELP`

  Exibe informações sobre todos os comandos disponíveis.

* `node_id NODELOG DEBUG {ON|OFF}`

  Ativa ou desativa o registro de depuração no log do nó, como se o(s) nó(s) de dados afetado(s) tivesse(m) sido iniciado(s) com a opção `--verbose`. `NODELOG DEBUG ON` inicia o registro de depuração; `NODELOG DEBUG OFF` desativa o registro de depuração.

* `PROMPT [prompt]`

  Altera o prompt exibido pelo **ndb_mgm** para a literal de string *`prompt`*.

  *`prompt`* não deve ser citado (a menos que você queira que o prompt inclua as aspas). Ao contrário do caso do cliente **mysql**, sequências de caracteres especiais e escapamentos não são reconhecidos. Se chamado sem argumento, o comando redefini o prompt para o valor padrão (`ndb_mgm>`).

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

  Observe que espaços em branco no início e espaços dentro da string *`prompt`* não são limpos. Espaços em branco no final são removidos.

* `QUIT`, `EXIT`

  Termina o cliente de gerenciamento.

  Este comando não afeta nenhum nó conectado ao cluster.

* `node_id REPORT report-type`

  Exibe um relatório do tipo *`report-type`* para o nó de dados identificado por *`node_id`*, ou para todos os nós de dados usando `ALL`.

  Atualmente, há três valores aceitos para *`report-type`*:

  + `BackupStatus` fornece um relatório de status sobre um backup de cluster em andamento

  + `MemoryUsage` exibe quanto memória de dados e memória de índice está sendo usada por cada nó de dados, como mostrado neste exemplo:

    ```
    ndb_mgm> ALL REPORT MEMORY

    Node 1: Data usage is 5%(177 32K pages of total 3200)
    Node 1: Index usage is 0%(108 8K pages of total 12832)
    Node 2: Data usage is 5%(177 32K pages of total 3200)
    Node 2: Index usage is 0%(108 8K pages of total 12832)
    ```

    Esta informação também está disponível na tabela `ndbinfo.memoryusage`.

  + `EventLog` relata eventos dos buffers de log de eventos de um ou mais nós de dados.

  *`report-type`* é case-insensitive e "fuzzy"; para `MemoryUsage`, você pode usar `MEMORY` (como mostrado no exemplo anterior), `memory`, ou até mesmo simplesmente `MEM` (ou `mem`). Você pode abreviar `BackupStatus` de maneira semelhante.

* `node_id RESTART [-n] [-i] [-a] [-f]`

  Reinicia o nó de dados identificado por *`node_id`* (ou todos os nós de dados).

  Usando a opção `-i` com `RESTART`, o nó de dados é reiniciado inicialmente; ou seja, o sistema de arquivos do nó é excluído e recriado. O efeito é o mesmo que o obtido ao parar o processo do nó de dados e, em seguida, reiniciá-lo novamente usando **ndbd** `--initial` a partir da shell do sistema.

  Nota

  Os arquivos de backup e os arquivos de dados do disco não são removidos quando esta opção é usada.

  Usando a opção `-n`, o processo do nó de dados é reiniciado, mas o nó de dados não é realmente colocado online até que o comando apropriado `START` seja emitido. O efeito desta opção é o mesmo que o obtido ao parar o nó de dados e, em seguida, reiniciá-lo novamente usando **ndbd** `--nostart` ou **ndbd** `-n` a partir da shell do sistema.

  Usando a opção `-a`, todas as transações atuais que dependem deste nó são abortadas. Não é feita uma verificação do GCP quando o nó se reconecta ao clúster.

  Normalmente, `RESTART` falha se a desconexão do nó resultar em um clúster incompleto. A opção `-f` força o nó a reiniciar sem verificar isso. Se esta opção for usada e o resultado for um clúster incompleto, todo o clúster é reiniciado.

* `SHOW`

  Exibe informações básicas sobre o clúster e os nós do clúster. Para todos os nós, a saída inclui o ID do nó, o tipo e a versão do software `NDB`. Se o nó estiver conectado, seu endereço IP também é mostrado; caso contrário, a saída mostra `não conectado, aceitando conexão de ip_address`, com `qualquer host` usado para nós que são permitidos a se conectar de qualquer endereço.

Além disso, para os nós de dados, a saída inclui `starting` se o nó ainda não tiver sido iniciado e mostra o grupo de nós de que o nó é membro. Se o nó de dados estiver atuando como o nó mestre, isso é indicado com um asterisco (`*`).

Considere um clúster cuja configuração inclui as informações mostradas aqui (possíveis configurações adicionais foram omitidas para clareza):

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

Após este clúster (incluindo um nó SQL) ter sido iniciado, o `SHOW` exibe a seguinte saída:

```
  ndb_mgm> SHOW
  Connected to Management Server at: localhost:1186 (using cleartext)
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @198.51.100.10  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0, *)
  id=6    @198.51.100.20  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0)
  id=7    @198.51.100.30  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 1)
  id=8    @198.51.100.40  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @198.51.100.150  (mysql-9.5.0 ndb-9.5.0)

  [mysqld(API)]   2 node(s)
  id=100  @198.51.100.100  (mysql-9.5.0 ndb-9.5.0)
  id=101 (not connected, accepting connect from any host)
  ```

A saída deste comando também indica quando o clúster está no modo de usuário único (veja a descrição do comando `ENTER SINGLE USER MODE`, bem como a Seção 25.6.6, “Modo de Usuário Único do Clúster NDB”). Também indica qual API ou nó SQL tem acesso exclusivo quando este modo estiver em vigor.

* `SHUTDOWN`

Desliga todos os nós de dados do clúster e os nós de gerenciamento. Para sair do cliente de gerenciamento após isso ter sido feito, use `EXIT` ou `QUIT`.

Este comando *não* desliga quaisquer nós SQL ou nós API conectados ao clúster.

* `node_id START`

Torna online o nó de dados identificado por *`node_id`* (ou todos os nós de dados).

`ALL START` funciona apenas em todos os nós de dados e não afeta os nós de gerenciamento.

Importante

Para usar este comando para tornar um nó de dados online, o nó de dados deve ter sido iniciado usando `--nostart` ou `-n`.

* `node_id STATUS`

Exibe informações de status para o nó de dados identificado por *`node_id`* (ou para todos os nós de dados).

Os possíveis valores de status do nó incluem `UNKNOWN`, `NO_CONTACT`, `NOT_STARTED`, `STARTING`, `STARTED`, `SHUTTING_DOWN` e `RESTARTING`.

A saída deste comando também indica quando o clúster está no modo de usuário único.

* `node_id STOP [-a] [-f]`

Para interromper o nó de dados ou de gerenciamento identificado por *`node_id`*.

Nota

`ALL STOP` funciona para interromper apenas todos os nós de dados e não afeta os nós de gerenciamento.

Um nó afetado por este comando se desconecta do clúster e seu processo associado **ndbd** ou **ndb_mgmd** é encerrado.

A opção `-a` faz com que o nó seja interrompido imediatamente, sem esperar pela conclusão de quaisquer transações pendentes.

Normalmente, `STOP` falha se o resultado causar um clúster incompleto. A opção `-f` força o nó a desligar sem verificar isso. Se esta opção for usada e o resultado for um clúster incompleto, o clúster é desligado imediatamente.

Aviso

O uso da opção `-a` também desabilita a verificação de segurança que, de outra forma, seria realizada quando `STOP` é invocado, para garantir que interromper o nó não cause um clúster incompleto. Em outras palavras, você deve ter extremo cuidado ao usar a opção `-a` com o comando `STOP`, devido ao fato de que esta opção permite que o clúster seja desligado forçadamente porque não tem mais uma cópia completa de todos os dados armazenados no `NDB`.

* `TLS INFO`

Exibe informações do TLS do clúster, como se a conexão atual esteja usando TLS, os certificados TLS atualmente conhecidos pelo nó de gerenciamento e as contagens do nó de gerenciamento de conexões totais, conexões atualizadas para TLS e falhas de autorização. A saída de exemplo é mostrada aqui:

```
  ndb_mgm> TLS INFO

  Session ID:          1
  Peer address:        127.0.0.1
  Certificate name:    NDB Management Node Jun 2023
  Certificate serial:  B5:23:8F:D1:11:85:E5:93:ED
  Certificate expires: 23-Nov-2023

  Server statistics since restart
  Total accepted connections:        6
  Total connections upgraded to TLS: 2
  Current connections:               3
  Current connections using TLS:     2
  Authorization failures:            0

  ndb_mgm>
  ```

Para mais informações, consulte a Seção 25.6.19.5, “Encriptação de Link TLS para Clúster NDB”.

**Comandos adicionais.** Vários outros comandos disponíveis no cliente **ndb_mgm** são descritos em outros lugares, conforme mostrado na lista a seguir:

* O comando `START BACKUP` é usado para realizar um backup online no cliente **ndb_mgm**. O comando `ABORT BACKUP` é usado para cancelar um backup já em andamento. Para obter mais informações, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”.

* O comando `CLUSTERLOG` é usado para realizar várias funções de registro. Consulte a Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”, para obter mais informações e exemplos. O `NODELOG DEBUG` ativa ou desativa impressões de depuração nos logs dos nós, conforme descrito anteriormente nesta seção.

* Para testes e trabalho de diagnóstico, o cliente suporta o comando `DUMP`, que pode ser usado para executar comandos internos no cluster. Ele nunca deve ser usado em um ambiente de produção, a menos que orientado a fazê-lo pelo Suporte do MySQL. Para obter mais informações, consulte os comandos de DUMP do NDB Cluster Management Client.