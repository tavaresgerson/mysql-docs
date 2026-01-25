#### 21.4.3.7 Definindo SQL e Outros API Nodes em um NDB Cluster

As seções `[mysqld]` e `[api]` no arquivo `config.ini` definem o comportamento dos servidores MySQL (SQL nodes) e de outras aplicações (API nodes) usadas para acessar os dados do cluster. Nenhum dos parâmetros mostrados é obrigatório. Se nenhum computador ou nome de host for fornecido, qualquer host pode usar este SQL ou API node.

De modo geral, uma seção `[mysqld]` é usada para indicar um servidor MySQL que fornece uma interface SQL para o cluster, e uma seção `[api]` é usada para aplicações diferentes de processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que acessam dados do cluster, mas as duas designações são, na verdade, sinônimas; você pode, por exemplo, listar parâmetros para um servidor MySQL que atua como um SQL node em uma seção `[api]`.

Nota

Para uma discussão sobre opções do servidor MySQL para NDB Cluster, veja [Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 MySQL Server Options for NDB Cluster"). Para informações sobre variáveis de sistema do servidor MySQL relacionadas ao NDB Cluster, veja [Section 21.4.3.9.2, “NDB Cluster System Variables”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 NDB Cluster System Variables").

* `Id`

  <table frame="box" rules="all" summary="Id API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart Inicial do Sistema: </strong></span>Requer um desligamento completo do cluster, limpeza e restauração do sistema de arquivos do cluster a partir de um backup, e então o restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O `Id` é um valor inteiro usado para identificar o node em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Este valor deve ser único para cada node no cluster, independentemente do tipo de node.

  Nota

  Os IDs dos Data Nodes devem ser menores que 49, independentemente da versão do NDB Cluster usada. Se você planeja implantar um grande número de Data Nodes, é uma boa ideia limitar os IDs dos API nodes (e management nodes) a valores maiores que 48.

  [`NodeId`](mysql-cluster-api-definition.html#ndbparam-api-nodeid) é o nome de parâmetro preferido a ser usado ao identificar API nodes. (`Id` continua a ser suportado para compatibilidade com versões anteriores, mas agora está depreciado e gera um aviso quando usado. Ele também está sujeito à remoção futura.)

* `ConnectionMap`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Especifica a quais Data Nodes se conectar.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart Inicial do Sistema: </strong></span>Requer um desligamento completo do cluster, limpeza e restauração do sistema de arquivos do cluster a partir de um backup, e então o restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O `NodeId` é um valor inteiro usado para identificar o node em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Este valor deve ser único para cada node no cluster, independentemente do tipo de node.

  Nota

  Os IDs dos Data Nodes devem ser menores que 49, independentemente da versão do NDB Cluster usada. Se você planeja implantar um grande número de Data Nodes, é uma boa ideia limitar os IDs dos API nodes (e management nodes) a valores maiores que 48.

  [`NodeId`](mysql-cluster-api-definition.html#ndbparam-api-nodeid) é o parâmetro preferido a ser usado ao identificar management nodes. Um alias, `Id`, foi usado para este propósito em versões muito antigas do NDB Cluster, e continua a ser suportado para compatibilidade com versões anteriores; ele agora está depreciado e gera um aviso quando usado, estando sujeito à remoção em uma futura release do NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Depreciado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Sistema: </strong></span>Requer um desligamento e restart completo do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Isto se refere ao `Id` definido para um dos computadores (hosts) definidos em uma seção `[computer]` do arquivo de configuração.

  Importante

  Este parâmetro está depreciado a partir do NDB 7.5.0 e está sujeito à remoção em uma release futura. Use o parâmetro [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) em vez disso.

* `HostName`

  <table frame="box" rules="all" summary="HostName API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A especificação deste parâmetro define o Host Name do computador onde o SQL node (API node) deve residir.

  Se nenhum `HostName` for especificado em uma determinada seção `[mysql]` ou `[api]` do arquivo `config.ini`, então um SQL ou API node pode se conectar usando o "slot" correspondente a partir de qualquer host que possa estabelecer uma conexão de rede com a máquina host do management server. *Isto difere do comportamento padrão para Data Nodes, onde `localhost` é assumido para `HostName` a menos que seja especificado o contrário*.

* [`LocationDomainId`](mysql-cluster-api-definition.html#ndbparam-api-locationdomainid)

  <table frame="box" rules="all" summary="LocationDomainId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Sistema: </strong></span>Requer um desligamento e restart completo do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Atribui um SQL ou outro API node a um [domínio de disponibilidade](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) específico (também conhecido como zona de disponibilidade) dentro de uma cloud. Ao informar ao `NDB` quais nodes estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de cloud das seguintes maneiras:

  + Se os dados solicitados não forem encontrados no mesmo node, as reads podem ser direcionadas para outro node no mesmo domínio de disponibilidade.

  + A comunicação entre nodes em diferentes domínios de disponibilidade é garantida para usar o suporte WAN dos transporters do `NDB` sem qualquer intervenção manual adicional.

  + O número do grupo do transporter pode ser baseado em qual domínio de disponibilidade é usado, de modo que também os SQL e outros API nodes se comuniquem com Data Nodes locais no mesmo domínio de disponibilidade sempre que possível.

  + O arbitrator pode ser selecionado a partir de um domínio de disponibilidade no qual não há Data Nodes presentes, ou, se tal domínio de disponibilidade não puder ser encontrado, a partir de um terceiro domínio de disponibilidade.

  `LocationDomainId` aceita um valor inteiro entre 0 e 16, inclusive, sendo 0 o padrão; usar 0 é o mesmo que deixar o parâmetro não definido.

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>0-2</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 2</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define quais nodes podem atuar como arbitrators. Ambos, management nodes e SQL nodes, podem ser arbitrators. Um valor de 0 significa que o node em questão nunca é usado como arbitrator, um valor de 1 dá ao node alta Priority como arbitrator, e um valor de 2 dá baixa Priority. Uma configuração normal usa o management server como arbitrator, definindo seu `ArbitrationRank` como 1 (o padrão para management nodes) e o dos SQL nodes como 0 (o padrão para SQL nodes).

  Ao definir `ArbitrationRank` como 0 em todos os management nodes e SQL nodes, você pode desabilitar a arbitragem completamente. Você também pode controlar a arbitragem sobrescrevendo este parâmetro; para fazer isso, defina o parâmetro [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) na seção `[ndbd default]` do arquivo de configuração global `config.ini`.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>milliseconds</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Definir este parâmetro para qualquer valor diferente de 0 (o padrão) significa que as respostas do arbitrator às requisições de arbitragem são atrasadas pelo número especificado de milissegundos. Geralmente não é necessário alterar este valor.

* [`BatchByteSize`](mysql-cluster-api-definition.html#ndbparam-api-batchbytesize)

  <table frame="box" rules="all" summary="BatchByteSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>16K</td> </tr><tr> <th>Intervalo</th> <td>1K - 1M</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para Queries que são traduzidas em full table scans ou range scans em Indexes, é importante para o melhor desempenho buscar registros em batches de tamanho adequado. É possível definir o tamanho adequado tanto em termos de número de registros ([`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize)) quanto em termos de bytes (`BatchByteSize`). O tamanho real do batch é limitado por ambos os parâmetros.

  A velocidade com que as Queries são executadas pode variar em mais de 40% dependendo de como este parâmetro é definido.

  Este parâmetro é medido em bytes. O valor padrão é 16K.

* [`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize)

  <table frame="box" rules="all" summary="BatchSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>records</td> </tr><tr> <th>Padrão</th> <td>256</td> </tr><tr> <th>Intervalo</th> <td>1 - 992</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é medido em número de registros e é definido por padrão como 256. O tamanho máximo é 992.

* [`ExtraSendBufferMemory`](mysql-cluster-api-definition.html#ndbparam-api-extrasendbuffermemory)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica a quantidade de memória do send buffer do transporter a ser alocada adicionalmente a qualquer valor que tenha sido definido usando [`TotalSendBufferMemory`](mysql-cluster-api-definition.html#ndbparam-api-totalsendbuffermemory), [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), ou ambos.

* [`HeartbeatThreadPriority`](mysql-cluster-api-definition.html#ndbparam-api-heartbeatthreadpriority)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use este parâmetro para definir a política de agendamento e a Priority de Threads de heartbeat para management nodes e API nodes. A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  Ao definir este parâmetro, você deve especificar uma política. Esta é uma de `FIFO` (first in, first in) ou `RR` (round robin). Isto é seguido opcionalmente pela Priority (um inteiro).

* [`MaxScanBatchSize`](mysql-cluster-api-definition.html#ndbparam-api-maxscanbatchsize)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O tamanho do batch é o tamanho de cada batch enviado de cada Data Node. A maioria dos scans são executados em paralelo para proteger o MySQL Server de receber muitos dados de muitos nodes em paralelo; este parâmetro define um limite para o tamanho total do batch em todos os nodes.

  O valor padrão deste parâmetro é definido como 256KB. Seu tamanho máximo é 16MB.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste node para a memória de send buffer compartilhada entre todos os transporters configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é 256KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, veja [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

* [`AutoReconnect`](mysql-cluster-api-definition.html#ndbparam-api-autoreconnect)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é `false` por padrão. Isso força API nodes desconectados (incluindo MySQL Servers atuando como SQL nodes) a usar uma nova conexão com o cluster, em vez de tentar reutilizar uma conexão existente, pois a reutilização de conexões pode causar problemas ao usar IDs de node alocados dinamicamente. (Bug #45921)

  Nota

  Este parâmetro pode ser sobrescrito usando a NDB API. Para mais informações, veja [Ndb_cluster_connection::set_auto_reconnect()](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-auto-reconnect), e [Ndb_cluster_connection::get_auto_reconnect()](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-auto-reconnect).

* [`DefaultOperationRedoProblemAction`](mysql-cluster-api-definition.html#ndbparam-api-defaultoperationredoproblemaction)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro (juntamente com [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) e [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter)) controla o tratamento de operações pelo Data Node quando se leva muito tempo para fazer o flush dos redo logs para o disco. Isso ocorre quando um dado redo log flush leva mais tempo do que [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) segundos, mais do que [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter) vezes, fazendo com que quaisquer transações pendentes sejam abortadas.

  Quando isso acontece, o node pode responder de duas maneiras, de acordo com o valor de `DefaultOperationRedoProblemAction`, listado aqui:

  + `ABORT`: Quaisquer operações pendentes de transações abortadas também são abortadas.

  + `QUEUE`: Operações pendentes de transações que foram abortadas são enfileiradas para serem repetidas (re-tried). Este é o padrão. Operações pendentes ainda são abortadas quando o redo log fica sem espaço — ou seja, quando ocorrem erros P_TAIL_PROBLEM.

* [`DefaultHashMapSize`](mysql-cluster-api-definition.html#ndbparam-api-defaulthashmapsize)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O tamanho dos hash maps da tabela usados pelo [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é configurável usando este parâmetro. `DefaultHashMapSize` pode assumir qualquer um dos três valores possíveis (0, 240, 3840).

  O uso original pretendido para este parâmetro era facilitar upgrades e, especialmente, downgrades de e para releases muito antigas com diferentes tamanhos padrão de hash map. Isso não é um problema ao fazer upgrade do NDB Cluster 7.3 (ou posterior) para versões posteriores.

  Diminuir este parâmetro online após quaisquer tabelas terem sido criadas ou modificadas com `DefaultHashMapSize` igual a 3840 não é atualmente suportado.

* [`Wan`](mysql-cluster-api-definition.html#ndbparam-api-wan)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Usa a configuração TCP WAN como padrão.

* [`ConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-connectbackoffmaxtime)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Em um NDB Cluster com muitos Data Nodes não iniciados, o valor deste parâmetro pode ser aumentado para evitar tentativas de conexão a Data Nodes que ainda não começaram a funcionar no cluster, bem como moderar o alto tráfego para management nodes. Enquanto o API node não estiver conectado a nenhum novo Data Node, o valor do parâmetro [`StartConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-startconnectbackoffmaxtime) é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o período de tempo em milissegundos a ser esperado entre as tentativas de conexão.

  O tempo decorrido *durante* as tentativas de conexão do node não é levado em consideração ao calcular o tempo decorrido para este parâmetro. O timeout é aplicado com resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, a duração deste período é dobrada até atingir `ConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

  Uma vez que o API node esteja conectado a um Data Node e esse node reporte (em uma mensagem de heartbeat) que se conectou a outros Data Nodes, as tentativas de conexão a esses Data Nodes não são mais afetadas por este parâmetro e são feitas a cada 100 ms a partir de então até que sejam conectadas. Depois que um Data Node é iniciado, pode levar até [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi) para que o API node seja notificado de que isso ocorreu.

* [`StartConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-startconnectbackoffmaxtime)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart do Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Em um NDB Cluster com muitos Data Nodes não iniciados, o valor deste parâmetro pode ser aumentado para evitar tentativas de conexão a Data Nodes que ainda não começaram a funcionar no cluster, bem como moderar o alto tráfego para management nodes. Enquanto o API node não estiver conectado a nenhum novo Data Node, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, [`ConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-connectbackoffmaxtime) é usado para determinar o período de tempo em milissegundos a ser esperado entre as tentativas de conexão.

  O tempo decorrido *durante* as tentativas de conexão do node não é levado em consideração ao calcular o tempo decorrido para este parâmetro. O timeout é aplicado com resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, a duração deste período é dobrada até atingir `StartConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

  Uma vez que o API node esteja conectado a um Data Node e esse node reporte (em uma mensagem de heartbeat) que se conectou a outros Data Nodes, as tentativas de conexão a esses Data Nodes não são mais afetadas por este parâmetro e são feitas a cada 100 ms a partir de então até que sejam conectadas. Depois que um Data Node é iniciado, pode levar até [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi) para que o API node seja notificado de que isso ocorreu.

**Parâmetros de Debugging do API Node.** Você pode usar o parâmetro de configuração `ApiVerbose` para habilitar a saída de debugging de um determinado API node. Este parâmetro aceita um valor inteiro. 0 é o padrão e desabilita tal debugging; 1 habilita a saída de debugging no log do cluster; 2 adiciona a saída de debugging do [`DBDICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html) também. (Bug #20638450) Veja também [DUMP 1229](/doc/ndb-internals/en/dump-command-1229.html).

Você também pode obter informações de um MySQL server em execução como um NDB Cluster SQL node usando [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), conforme mostrado aqui:

```sql
mysql> SHOW STATUS LIKE 'ndb%';
+-----------------------------+----------------+
| Variable_name               | Value          |
+-----------------------------+----------------+
| Ndb_cluster_node_id         | 5              |
| Ndb_config_from_host        | 198.51.100.112 |
| Ndb_config_from_port        | 1186           |
| Ndb_number_of_storage_nodes | 4              |
+-----------------------------+----------------+
4 rows in set (0.02 sec)
```

Para informações sobre as variáveis de status que aparecem na saída desta instrução, veja [Section 21.4.3.9.3, “NDB Cluster Status Variables”](mysql-cluster-options-variables.html#mysql-cluster-status-variables "21.4.3.9.3 NDB Cluster Status Variables").

Nota

Para adicionar novos SQL ou API nodes à configuração de um NDB Cluster em execução, é necessário realizar um rolling restart de todos os nodes do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um management server). Isso deve ser feito antes que os novos SQL ou API nodes possam se conectar ao cluster.

*Não* é necessário realizar qualquer restart do cluster se os novos SQL ou API nodes puderem empregar slots de API não utilizados anteriormente na configuração do cluster para se conectar ao cluster.

**Tipos de Restart.** Informações sobre os tipos de restart usados pelas descrições de parâmetros nesta seção são mostradas na tabela a seguir:

**Tabela 21.16 Tipos de restart do NDB Cluster**

<table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart Inicial do Sistema: </strong></span>Requer um desligamento completo do cluster, limpeza e restauração do sistema de arquivos do cluster a partir de um backup, e então o restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>
