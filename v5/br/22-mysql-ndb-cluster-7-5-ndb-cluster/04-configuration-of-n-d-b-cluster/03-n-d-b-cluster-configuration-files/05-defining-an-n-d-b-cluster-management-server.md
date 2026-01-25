#### 21.4.3.5 Definindo um Servidor de Gerenciamento NDB Cluster

A seção `[ndb_mgmd]` é usada para configurar o comportamento do servidor de gerenciamento. Se múltiplos servidores de gerenciamento forem empregados, você pode especificar parâmetros comuns a todos eles em uma seção `[ndb_mgmd default]`. `[mgm]` e `[mgm default]` são aliases mais antigos para estas seções, suportados para compatibilidade retroativa.

Todos os parâmetros na lista a seguir são opcionais e assumem seus valores Default se omitidos.

Nota

Se nem o parâmetro `ExecuteOnComputer` nem o `HostName` estiver presente, o valor Default `localhost` é assumido para ambos.

* `Id`

  <table frame="box" rules="all" summary="Id: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada Node no Cluster possui uma identidade única. Para um Node de gerenciamento, isso é representado por um valor inteiro no Range de 1 a 255, inclusive. Este ID é usado por todas as mensagens internas do Cluster para endereçar o Node e, portanto, deve ser único para cada Node NDB Cluster, independentemente do tipo de Node.

  Nota

  IDs de Data node devem ser menores que 49. Se você planeja implantar um grande número de Data nodes, é uma boa ideia limitar os Node IDs para Nodes de gerenciamento (e Nodes API) a valores maiores que 48.

  O uso do parâmetro `Id` para identificar Nodes de gerenciamento está obsoleto (deprecated) em favor de [`NodeId`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-nodeid). Embora `Id` continue a ser suportado para compatibilidade retroativa, ele agora gera um aviso (warning) e está sujeito à remoção em uma versão futura do NDB Cluster.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada Node no Cluster possui uma identidade única. Para um Node de gerenciamento, isso é representado por um valor inteiro no Range de 1 a 255, inclusive. Este ID é usado por todas as mensagens internas do Cluster para endereçar o Node e, portanto, deve ser único para cada Node NDB Cluster, independentemente do tipo de Node.

  Nota

  IDs de Data node devem ser menores que 49. Se você planeja implantar um grande número de Data nodes, é uma boa ideia limitar os Node IDs para Nodes de gerenciamento (e Nodes API) a valores maiores que 48.

  `NodeId` é o nome de parâmetro preferido a ser usado ao identificar Nodes de gerenciamento. Embora o [`Id`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-id) mais antigo continue a ser suportado para compatibilidade retroativa, ele agora está obsoleto (deprecated) e gera um aviso (warning) quando usado; ele também está sujeito à remoção em um futuro lançamento do NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Obsoleto (Deprecated)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>System Restart: </strong></span>Requer um desligamento completo e restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Isso se refere ao `Id` definido para um dos computadores definidos em uma seção `[computer]` do arquivo `config.ini`.

  Importante

  Este parâmetro está obsoleto (deprecated) a partir do NDB 7.5.0 e está sujeito à remoção em um lançamento futuro. Use o parâmetro [`HostName`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-hostname) em vez disso.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>1186</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>System Restart: </strong></span>Requer um desligamento completo e restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este é o número da porta na qual o servidor de gerenciamento escuta por requisições de configuração e comandos de gerenciamento.

* `HostName`

  <table frame="box" rules="all" summary="HostName: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A especificação deste parâmetro define o HostName do computador no qual o Node de gerenciamento deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* [`LocationDomainId`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-locationdomainid)

  <table frame="box" rules="all" summary="LocationDomainId: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>System Restart: </strong></span>Requer um desligamento completo e restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Atribui um Node de gerenciamento a um [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) específico (também conhecido como availability zone) dentro de uma nuvem (cloud). Ao informar ao `NDB` quais Nodes estão em quais availability domains, o desempenho pode ser melhorado em um ambiente de cloud das seguintes maneiras:

  + Se os dados solicitados não forem encontrados no mesmo Node, as leituras podem ser direcionadas para outro Node no mesmo availability domain.

  + A comunicação entre Nodes em diferentes availability domains é garantida para usar o suporte WAN dos Transporters `NDB` sem qualquer intervenção manual adicional.

  + O número do grupo do Transporter pode ser baseado em qual availability domain é usado, de modo que os Nodes SQL e outros Nodes API também se comuniquem com Data nodes locais no mesmo availability domain sempre que possível.

  + O arbitrator pode ser selecionado a partir de um availability domain no qual não há Data nodes presentes ou, se nenhum availability domain desse tipo puder ser encontrado, a partir de um terceiro availability domain.

  `LocationDomainId` aceita um valor inteiro entre 0 e 16 inclusive, sendo 0 o Default; usar 0 é o mesmo que deixar o parâmetro não configurado.

* [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination)

  <table frame="box" rules="all" summary="LogDestination: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>{CONSOLE|SYSLOG|FILE}</td> </tr><tr> <th>Default</th> <td>FILE: filename=ndb_nodeid_cluster.log, maxsize=1000000, maxfiles=6</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica para onde enviar as informações de log do Cluster. Existem três opções a este respeito—`CONSOLE`, `SYSLOG` e `FILE`—sendo `FILE` o Default:

  + `CONSOLE` direciona o log para `stdout`:

    ```sql
    CONSOLE
    ```

  + `SYSLOG` envia o log para uma facility de `syslog`, sendo os valores possíveis um de `auth`, `authpriv`, `cron`, `daemon`, `ftp`, `kern`, `lpr`, `mail`, `news`, `syslog`, `user`, `uucp`, `local0`, `local1`, `local2`, `local3`, `local4`, `local5`, `local6` ou `local7`.

    Nota

    Nem toda facility é necessariamente suportada por todo sistema operacional.

    ```sql
    SYSLOG:facility=syslog
    ```

  + `FILE` envia a saída do log do Cluster para um arquivo regular na mesma máquina. Os seguintes valores podem ser especificados:

    - `filename`: O nome do arquivo de log.

      O nome de arquivo de log Default usado nesses casos é `ndb_nodeid_cluster.log`.

    - `maxsize`: O tamanho máximo (em bytes) que o arquivo pode atingir antes que o logging seja transferido para um novo arquivo. Quando isso ocorre, o arquivo de log antigo é renomeado anexando *`.N`* ao nome do arquivo, onde *`N`* é o próximo número ainda não usado com este nome.

    - `maxfiles`: O número máximo de arquivos de log.

    ```sql
    FILE:filename=cluster.log,maxsize=1000000,maxfiles=6
    ```

    O valor Default para o parâmetro `FILE` é `FILE:filename=ndb_node_id_cluster.log,maxsize=1000000,maxfiles=6`, onde *`node_id`* é o ID do Node.

  É possível especificar múltiplos destinos de log separados por ponto e vírgula, conforme mostrado aqui:

  ```sql
  CONSOLE;SYSLOG:facility=local0;FILE:filename=/var/log/mgmd
  ```

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>1</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para definir quais Nodes podem atuar como arbitrators. Apenas Nodes de gerenciamento e Nodes SQL podem ser arbitrators. `ArbitrationRank` pode assumir um dos seguintes valores:

  + `0`: O Node nunca é usado como um arbitrator.

  + `1`: O Node tem alta prioridade; ou seja, ele é preferido como um arbitrator em relação aos Nodes de baixa prioridade.

  + `2`: Indica um Node de baixa prioridade que é usado como arbitrator apenas se um Node com prioridade mais alta não estiver disponível para essa finalidade.

  Normalmente, o servidor de gerenciamento deve ser configurado como um arbitrator definindo seu `ArbitrationRank` como 1 (o Default para Nodes de gerenciamento) e o dos Nodes SQL como 0 (o Default para Nodes SQL).

  Você pode desabilitar o Arbitration completamente definindo `ArbitrationRank` como 0 em todos os Nodes de gerenciamento e SQL, ou definindo o parâmetro [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Definir [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) faz com que quaisquer configurações para `ArbitrationRank` sejam desconsideradas.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Um valor inteiro que faz com que as respostas do servidor de gerenciamento às requisições de Arbitration sejam atrasadas por esse número de milliseconds. Por Default, este valor é 0; normalmente não é necessário alterá-lo.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Isso especifica o diretório onde os arquivos de saída do servidor de gerenciamento são colocados. Esses arquivos incluem arquivos de log do Cluster, arquivos de saída de processo e o arquivo de ID de processo (PID) do Daemon. (Para arquivos de log, este local pode ser sobrescrito definindo o parâmetro `FILE` para [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination), conforme discutido anteriormente nesta seção.)

  O valor Default para este parâmetro é o diretório onde [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") está localizado.

* `PortNumberStats`

  <table frame="box" rules="all" summary="PortNumberStats: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o número da porta usado para obter informações estatísticas de um servidor de gerenciamento NDB Cluster. Ele não tem valor Default.

* [`Wan`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-wan)

  <table frame="box" rules="all" summary="Wan: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Usa a configuração TCP WAN como Default.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="HeartbeatThreadPriority: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a política de agendamento e a prioridade dos Heartbeat Threads para Nodes de gerenciamento e API.

  A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  Ao definir este parâmetro, você deve especificar uma política. Esta é uma das seguintes: `FIFO` (first in, first out) ou `RR` (round robin). O valor da política é seguido opcionalmente pela prioridade (um inteiro).

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="ExtraSendBufferMemory: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica a quantidade de memória do Send Buffer do Transporter a ser alocada além de qualquer valor que tenha sido definido usando [`TotalSendBufferMemory`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-totalsendbuffermemory), [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), ou ambos.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="TotalSendBufferMemory: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste Node para memória de Send Buffer compartilhada entre todos os Transporters configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é 256KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

* `HeartbeatIntervalMgmdMgmd`

  <table frame="box" rules="all" summary="HeartbeatIntervalMgmdMgmd: informações sobre tipo e valor do parâmetro de configuração do node de gerenciamento" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Especifica o intervalo entre mensagens Heartbeat usadas para determinar se outro Node de gerenciamento está em contato com este. O Node de gerenciamento espera 3 desses intervalos antes de declarar a conexão como morta; assim, a configuração Default de 1500 milliseconds faz com que o Node de gerenciamento espere por aproximadamente 1600 ms antes de ocorrer o timeout.

Nota

Após fazer alterações na configuração de um Node de gerenciamento, é necessário realizar um rolling restart do Cluster para que a nova configuração entre em vigor.

Para adicionar novos servidores de gerenciamento a um NDB Cluster em execução, também é necessário realizar um rolling restart de todos os Cluster nodes após modificar quaisquer arquivos `config.ini` existentes. Para mais informações sobre questões que surgem ao usar múltiplos Nodes de gerenciamento, consulte [Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes").

**Tipos de Restart.** As informações sobre os tipos de Restart usados pelas descrições de parâmetros nesta seção são mostradas na tabela a seguir:

**Tabela 21.8 Tipos de restart NDB Cluster**

<table frame="box" rules="all" summary="Tipos de restart NDB Cluster" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então o restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>