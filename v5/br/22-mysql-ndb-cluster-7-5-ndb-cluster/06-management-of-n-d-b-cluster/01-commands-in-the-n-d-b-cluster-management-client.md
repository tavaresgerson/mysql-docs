### 21.6.1 Comandos no Client de Gerenciamento do NDB Cluster

Além do arquivo de configuração central, um cluster também pode ser controlado por meio de uma interface de linha de comando disponível através do management client **ndb_mgm**. Esta é a principal interface administrativa para um cluster em execução.

Comandos para os event logs são apresentados na Seção 21.6.3, “Relatórios de Eventos Gerados no NDB Cluster”; comandos para criar backups e restaurar a partir deles são fornecidos na Seção 21.6.8, “Online Backup do NDB Cluster”.

**Usando ndb_mgm com o MySQL Cluster Manager.**

O MySQL Cluster Manager lida com o início e a parada de processos e rastreia seus estados internamente, portanto, não é necessário usar **ndb_mgm** para essas tarefas em um NDB Cluster que está sob o controle do MySQL Cluster Manager. É recomendado *não* usar o command-line client **ndb_mgm** que acompanha a distribuição do NDB Cluster para realizar operações que envolvam iniciar ou parar nodes. Estes incluem, mas não se limitam aos comandos `START`, `STOP`, `RESTART` e `SHUTDOWN`. Para mais informações, consulte MySQL Cluster Manager Process Commands.

O management client possui os seguintes comandos básicos. Na listagem a seguir, *`node_id`* denota ou um ID de data node ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os data nodes do cluster.

* `CONNECT connection-string`

  Conecta-se ao management server indicado pela connection string. Se o client já estiver conectado a este server, o client se reconecta.

* `CREATE NODEGROUP nodeid[, nodeid, ...]`

  Cria um novo node group do NDB Cluster e faz com que os data nodes se juntem a ele.

  Este comando é usado após adicionar novos data nodes online a um NDB Cluster, fazendo com que eles se juntem a um novo node group e, assim, comecem a participar totalmente do cluster. O comando aceita como único parâmetro uma lista de IDs de node separada por vírgulas—estes são os IDs dos nodes que acabaram de ser adicionados e iniciados, e que devem se juntar ao novo node group. A lista não deve conter IDs duplicados; a partir do NDB 7.5.23 e NDB 7.6.19, a presença de quaisquer duplicatas faz com que o comando retorne um error. O número de nodes na lista deve ser o mesmo que o número de nodes em cada node group que já faz parte do cluster (cada node group do NDB Cluster deve ter o mesmo número de nodes). Em outras palavras, se o NDB Cluster consiste em 2 node groups com 2 data nodes cada, o novo node group também deve ter 2 data nodes.

  O ID do node group do novo node group criado por este comando é determinado automaticamente, sendo sempre o próximo ID de node group não utilizado mais alto no cluster; não é possível defini-lo manualmente.

  Para mais informações, consulte Seção 21.6.7, “Adicionando Data Nodes NDB Cluster Online”.

* `DROP NODEGROUP nodegroup_id`

  Descarta (Drops) o node group do NDB Cluster com o *`nodegroup_id`* fornecido.

  Este comando pode ser usado para descartar um node group de um NDB Cluster. O `DROP NODEGROUP` usa como único argumento o ID do node group a ser descartado.

  O `DROP NODEGROUP` atua apenas para remover os data nodes no node group afetado daquele node group. Ele não para os data nodes, não os atribui a um node group diferente, nem os remove da configuração do cluster. Um data node que não pertence a um node group é indicado na saída do comando `SHOW` do management client com `no nodegroup` no lugar do ID do node group, conforme mostrado aqui (indicado em negrito):

  ```sql
  id=3    @10.100.2.67  (5.7.44-ndb-7.5.36, no nodegroup)
  ```

  O `DROP NODEGROUP` funciona apenas quando todos os data nodes no node group a ser descartado estão completamente vazios de quaisquer dados de tabela e definições de tabela. Como atualmente não há como, usando **ndb_mgm** ou o client **mysql**, remover todos os dados de um data node ou node group específico, isso significa que o comando só é bem-sucedido nos dois casos a seguir:

  1. Após executar `CREATE NODEGROUP` no client **ndb_mgm**, mas antes de executar quaisquer instruções `ALTER TABLE ... REORGANIZE PARTITION` no client **mysql**.

  2. Após descartar todas as tabelas `NDBCLUSTER` usando `DROP TABLE`.

     O `TRUNCATE TABLE` não funciona para este propósito porque remove apenas os dados da tabela; os data nodes continuam a armazenar a definition de uma tabela `NDBCLUSTER` até que uma instrução `DROP TABLE` seja emitida, o que faz com que os metadados da tabela sejam descartados.

  Para mais informações sobre `DROP NODEGROUP`, consulte Seção 21.6.7, “Adicionando Data Nodes NDB Cluster Online”.

* `ENTER SINGLE USER MODE node_id`

  Entra no single user mode, pelo qual apenas o MySQL server identificado pelo node ID *`node_id`* tem permissão para acessar o database.

* `EXIT SINGLE USER MODE`

  Sai do single user mode, permitindo que todos os SQL nodes (ou seja, todos os processos **mysqld** em execução) acessem o database.

  Note

  É possível usar `EXIT SINGLE USER MODE` mesmo quando não estiver no single user mode, embora o comando não tenha efeito neste caso.

* `HELP`

  Exibe informações sobre todos os comandos disponíveis.

* `node_id NODELOG DEBUG {ON|OFF}`

  Alterna o debug logging no node log, como se o(s) data node(s) afetado(s) tivessem sido iniciados com a opção `--verbose`. `NODELOG DEBUG ON` inicia o debug logging; `NODELOG DEBUG OFF` desliga o debug logging.

  Este comando foi adicionado no NDB 7.6.

* `PROMPT [prompt]`

  Muda o prompt exibido por **ndb_mgm** para a string literal *`prompt`*.

  *`prompt`* não deve ser citado (a menos que você queira que o prompt inclua as aspas). Ao contrário do que acontece com o client **mysql**, sequências de caracteres especiais e escapes não são reconhecidos. Se chamado sem um argumento, o comando redefine o prompt para o valor padrão (`ndb_mgm>`).

  Alguns exemplos são mostrados aqui:

  ```sql
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

  Note que espaços iniciais e espaços dentro da string *`prompt`* não são removidos. Espaços finais são removidos.

  O comando `PROMPT` foi adicionado no NDB 7.5.0.

* `QUIT`, `EXIT`

  Encerra o management client.

  Este comando não afeta nenhum node conectado ao cluster.

* `node_id REPORT report-type`

  Exibe um report do tipo *`report-type`* para o data node identificado por *`node_id`*, ou para todos os data nodes usando `ALL`.

  Atualmente, existem três valores aceitos para *`report-type`*:

  + `BackupStatus` fornece um status report de um cluster backup em andamento

  + `MemoryUsage` exibe a quantidade de data memory e index memory que está sendo usada por cada data node, conforme mostrado neste exemplo:

    ```sql
    ndb_mgm> ALL REPORT MEMORY

    Node 1: Data usage is 5%(177 32K pages of total 3200)
    Node 1: Index usage is 0%(108 8K pages of total 12832)
    Node 2: Data usage is 5%(177 32K pages of total 3200)
    Node 2: Index usage is 0%(108 8K pages of total 12832)
    ```

    Esta informação também está disponível na tabela `ndbinfo.memoryusage`.

  + `EventLog` reporta eventos dos event log buffers de um ou mais data nodes.

  *`report-type`* não diferencia maiúsculas de minúsculas e é “flexível”; para `MemoryUsage`, você pode usar `MEMORY` (como mostrado no exemplo anterior), `memory`, ou mesmo simplesmente `MEM` (ou `mem`). Você pode abreviar `BackupStatus` de maneira semelhante.

* `node_id RESTART [-n] [-i] [-a] [-f]`

  Reinicia (Restarts) o data node identificado por *`node_id`* (ou todos os data nodes).

  Usar a opção `-i` com `RESTART` faz com que o data node execute um initial restart; ou seja, o file system do node é deletado e recriado. O efeito é o mesmo obtido ao parar o data node process e iniciá-lo novamente usando **ndbd** `--initial` a partir do shell do sistema.

  Note

  Arquivos de Backup e Disk Data files não são removidos quando esta opção é usada.

  Usar a opção `-n` faz com que o data node process seja reiniciado, mas o data node não é realmente colocado online até que o comando `START` apropriado seja emitido. O efeito desta opção é o mesmo obtido ao parar o data node e iniciá-lo novamente usando **ndbd** `--nostart` ou **ndbd** `-n` a partir do shell do sistema.

  Usar o `-a` faz com que todas as transactions atuais que dependem deste node sejam aborted. Nenhum GCP check é feito quando o node se junta novamente ao cluster.

  Normalmente, `RESTART` falha se colocar o node offline resultar em um cluster incompleto. A opção `-f` força o node a reiniciar sem verificar isso. Se esta opção for usada e o resultado for um cluster incompleto, todo o cluster é reiniciado (restarted).

* `SHOW`

  Exibe informações básicas sobre o cluster e os cluster nodes. Para todos os nodes, a saída inclui o ID, o type e a versão do software `NDB` do node. Se o node estiver conectado, seu IP address também é mostrado; caso contrário, a saída mostra `not connected, accepting connect from ip_address`, com `any host` usado para nodes que têm permissão para conectar a partir de qualquer address.

  Além disso, para data nodes, a saída inclui `starting` se o node ainda não iniciou, e mostra o node group do qual o node é membro. Se o data node estiver atuando como master node, isso é indicado com um asterisco (`*`).

  Considere um cluster cujo arquivo de configuração inclui as informações mostradas aqui (configurações adicionais possíveis são omitidas para maior clareza):

  ```sql
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

  Depois que este cluster (incluindo um SQL node) for iniciado, `SHOW` exibe a seguinte saída:

  ```sql
  ndb_mgm> SHOW
  Connected to Management Server at: localhost:1186
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @198.51.100.10  (5.7.44-ndb-7.6.36, Nodegroup: 0, *)
  id=6    @198.51.100.20  (5.7.44-ndb-7.6.36, Nodegroup: 0)
  id=7    @198.51.100.30  (5.7.44-ndb-7.6.36, Nodegroup: 1)
  id=8    @198.51.100.40  (5.7.44-ndb-7.6.36, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @198.51.100.150  (5.7.44-ndb-7.6.36)

  [mysqld(API)]   2 node(s)
  id=100  @198.51.100.100  (5.7.44-ndb-7.6.36)
  id=101 (not connected, accepting connect from any host)
  ```

  A saída deste comando também indica quando o cluster está em single user mode (consulte a descrição do comando `ENTER SINGLE USER MODE`, bem como a Seção 21.6.6, “Single User Mode do NDB Cluster”).

* `SHUTDOWN`

  Desliga (Shuts down) todos os data nodes e management nodes do cluster. Para sair do management client depois que isso for feito, use `EXIT` ou `QUIT`.

  Este comando *não* desliga quaisquer SQL nodes ou API nodes que estejam conectados ao cluster.

* `node_id STATUS`

  Exibe informações de status para o data node identificado por *`node_id`* (ou para todos os data nodes).

  Os possíveis valores de node status incluem `UNKNOWN`, `NO_CONTACT`, `NOT_STARTED`, `STARTING`, `STARTED`, `SHUTTING_DOWN` e `RESTARTING`.

  A saída deste comando também indica quando o cluster está em single user mode (status `SINGLE USER MODE`).

* `node_id START`

  Coloca online o data node identificado por *`node_id`* (ou todos os data nodes).

  `ALL START` funciona apenas em todos os data nodes e não afeta os management nodes.

  Importante

  Para usar este comando para colocar um data node online, o data node deve ter sido iniciado usando `--nostart` ou `-n`.

* `node_id STOP [-a] [-f]`

  Para (Stops) o data node ou management node identificado por *`node_id`*.

  Note

  `ALL STOP` funciona para parar apenas todos os data nodes e não afeta os management nodes.

  Um node afetado por este comando se desconecta do cluster, e seu processo **ndbd** ou **ndb_mgmd** associado é encerrado.

  A opção `-a` faz com que o node seja parado imediatamente, sem esperar pela conclusão de quaisquer pending transactions.

  Normalmente, `STOP` falha se o resultado causar um cluster incompleto. A opção `-f` força o node a desligar sem verificar isso. Se esta opção for usada e o resultado for um cluster incompleto, o cluster é imediatamente desligado (shuts down).

  Aviso

  O uso da opção `-a` também desativa a verificação de segurança que é feita quando `STOP` é invocado para garantir que a parada do node não cause um cluster incompleto. Em outras palavras, você deve ter extremo cuidado ao usar a opção `-a` com o comando `STOP`, devido ao fato de que esta opção possibilita que o cluster passe por um forced shutdown porque não possui mais uma cópia completa de todos os dados armazenados em `NDB`.

**Comandos adicionais.** Vários outros comandos disponíveis no client **ndb_mgm** são descritos em outros lugares, conforme mostrado na lista a seguir:

* O `START BACKUP` é usado para realizar um online backup no client **ndb_mgm**; o comando `ABORT BACKUP` é usado para cancelar um backup que já está em andamento. Para mais informações, consulte Seção 21.6.8, “Online Backup do NDB Cluster”.

* O comando `CLUSTERLOG` é usado para executar várias funções de logging. Consulte a Seção 21.6.3, “Relatórios de Eventos Gerados no NDB Cluster”, para mais informações e exemplos. O NDB 7.6 adiciona `NODELOG DEBUG` para ativar ou desativar debug printouts em node logs, conforme descrito anteriormente nesta seção.

* Para trabalho de testing e diagnostics, o client suporta um comando `DUMP` que pode ser usado para executar comandos internos no cluster. Ele nunca deve ser usado em um ambiente de produção, a menos que seja instruído a fazê-lo pelo Suporte MySQL. Para mais informações, consulte NDB Cluster Management Client DUMP Commands.