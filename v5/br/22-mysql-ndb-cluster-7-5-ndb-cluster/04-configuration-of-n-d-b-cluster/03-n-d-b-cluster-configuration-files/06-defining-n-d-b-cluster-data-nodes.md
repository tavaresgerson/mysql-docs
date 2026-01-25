#### 21.4.3.6 Definindo Data Nodes do NDB Cluster

As seções `[ndbd]` e `[ndbd default]` são usadas para configurar o comportamento dos Data Nodes do Cluster.

`[ndbd]` e `[ndbd default]` são sempre usados como nomes de seção, independentemente de você estar usando os binários [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") para os processos dos Data Nodes.

Existem muitos parâmetros que controlam tamanhos de Buffer, tamanhos de Pool, timeouts, e assim por diante. O único parâmetro obrigatório é `HostName`; este deve ser definido na seção local `[ndbd]`.

O parâmetro [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) deve ser definido na seção `[ndbd default]`, pois é comum a todos os Data Nodes do Cluster. Não é estritamente necessário definir [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas), mas é uma boa prática defini-lo explicitamente.

A maioria dos parâmetros do Data Node é definida na seção `[ndbd default]`. Somente os parâmetros explicitamente declarados como capazes de definir valores locais são permitidos para serem alterados na seção `[ndbd]`. Quando presentes, `HostName` e `NodeId` *devem* ser definidos na seção `[ndbd]` local e não em qualquer outra seção de `config.ini`. Em outras palavras, as configurações para esses parâmetros são específicas para um Data Node.

Para aqueles parâmetros que afetam o uso de memória ou tamanhos de Buffer, é possível usar `K`, `M` ou `G` como sufixo para indicar unidades de 1024, 1024×1024 ou 1024×1024×1024. (Por exemplo, `100K` significa 100 × 1024 = 102400.)

Os nomes e valores dos parâmetros não diferenciam maiúsculas de minúsculas, a menos que sejam usados em um arquivo `my.cnf` ou `my.ini` do MySQL Server, caso em que diferenciam.

Informações sobre parâmetros de configuração específicos para tabelas Disk Data do NDB Cluster podem ser encontradas posteriormente nesta seção (consulte [Parâmetros de Configuração Disk Data](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-disk-data-parameters "Parâmetros de Configuração Disk Data")).

Todos esses parâmetros também se aplicam a [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") (a versão multi-Thread do [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")). Três parâmetros adicionais de configuração do Data Node — [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads), [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig) e [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) — se aplicam apenas a [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"); eles não têm efeito quando usados com [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"). Para mais informações, consulte [Parâmetros de Configuração de Multi-Threading (ndbmtd)](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-ndbmtd-parameters "Parâmetros de Configuração de Multi-Threading (ndbmtd)"). Consulte também [Seção 21.5.3, “ndbmtd — O Data Node Daemon do NDB Cluster (Multi-Threaded)”](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)").

**Identificando Data Nodes.** O valor `NodeId` ou `Id` (ou seja, o identificador do Data Node) pode ser alocado na linha de comando quando o Node é iniciado ou no arquivo de configuração.

* `NodeId`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 48</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Um ID de Node exclusivo é usado como o endereço do Node para todas as mensagens internas do Cluster. Para Data Nodes, este é um inteiro no intervalo de 1 a 48, inclusive. Cada Node no Cluster deve ter um identificador exclusivo.

  `NodeId` é o único nome de parâmetro suportado para uso ao identificar Data Nodes. (`Id` foi removido no NDB 7.5.0.)

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Isso se refere ao `Id` definido para um dos computadores definidos em uma seção `[computer]`.

  Importante

  Este parâmetro está descontinuado a partir do NDB 7.5.0 e está sujeito à remoção em uma versão futura. Use o parâmetro [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) em vez disso.

* `HostName`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A especificação deste parâmetro define o Hostname do computador onde o Data Node deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* [`ServerPort`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-serverport)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada Node no Cluster usa uma porta para se conectar a outros Nodes. Por padrão, esta porta é alocada dinamicamente de forma a garantir que não haja dois Nodes no mesmo computador host recebendo o mesmo número de porta, portanto, normalmente não deve ser necessário especificar um valor para este parâmetro.

  Entretanto, se você precisar abrir portas específicas em um firewall para permitir a comunicação entre Data Nodes e API Nodes (incluindo SQL Nodes), você pode definir este parâmetro para o número da porta desejada em uma seção `[ndbd]` ou (se precisar fazer isso para vários Data Nodes) na seção `[ndbd default]` do arquivo `config.ini`, e então abrir a porta com esse número para conexões de entrada de SQL Nodes, API Nodes, ou ambos.

  Note

  As conexões de Data Nodes para Management Nodes são feitas usando a porta de gerenciamento do [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") (o [`PortNumber`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-portnumber) do servidor de gerenciamento), portanto, as conexões de saída para essa porta a partir de quaisquer Data Nodes devem ser sempre permitidas.

* `TcpBind_INADDR_ANY`

  Definir este parâmetro para `TRUE` ou `1` faz o bind de `IP_ADDR_ANY` para que as conexões possam ser feitas de qualquer lugar (para conexões autogeradas). O padrão é `FALSE` (`0`).

* [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro pode ser usado para atribuir um Data Node a um Node Group específico. Ele é lido apenas quando o Cluster é iniciado pela primeira vez e não pode ser usado para reatribuir um Data Node a um Node Group diferente online. Geralmente, não é desejável usar este parâmetro na seção `[ndbd default]` do arquivo `config.ini`, e deve-se ter cuidado para não atribuir Nodes a Node Groups de forma que um número inválido de Nodes seja atribuído a qualquer Node Group.

  O parâmetro [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup) destina-se principalmente ao uso na adição de um novo Node Group a um NDB Cluster em execução sem a necessidade de realizar um rolling restart. Para este propósito, você deve defini-lo como 65536 (o valor máximo). Você não é obrigado a definir um valor [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup) para todos os Data Nodes do Cluster, apenas para aqueles Nodes que serão iniciados e adicionados ao Cluster como um novo Node Group posteriormente. Para mais informações, consulte [Seção 21.6.7.3, “Adicionando NDB Cluster Data Nodes Online: Exemplo Detalhado”](mysql-cluster-online-add-node-example.html "21.6.7.3 Adding NDB Cluster Data Nodes Online: Detailed Example").

* [`LocationDomainId`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-locationdomainid)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Atribui um Data Node a um [domínio de disponibilidade](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar ao `NDB` quais Nodes estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  + Se os dados solicitados não forem encontrados no mesmo Node, as leituras podem ser direcionadas para outro Node no mesmo domínio de disponibilidade.

  + A comunicação entre Nodes em diferentes domínios de disponibilidade é garantida para usar o suporte WAN dos Transporters do `NDB` sem qualquer intervenção manual adicional.

  + O número do grupo do Transporter pode ser baseado no domínio de disponibilidade usado, de modo que os SQL Nodes e outros API Nodes também se comuniquem com Data Nodes locais no mesmo domínio de disponibilidade sempre que possível.

  + O árbitro pode ser selecionado em um domínio de disponibilidade onde não há Data Nodes presentes, ou, se tal domínio de disponibilidade não puder ser encontrado, em um terceiro domínio de disponibilidade.

  `LocationDomainId` aceita um valor inteiro entre 0 e 16, inclusive, sendo 0 o padrão; usar 0 é o mesmo que deixar o parâmetro não definido.

* [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro global só pode ser definido na seção `[ndbd default]` e define o número de réplicas de fragmentos para cada tabela armazenada no Cluster. Este parâmetro também especifica o tamanho dos Node Groups. Um Node Group é um conjunto de Nodes que armazenam as mesmas informações.

  Os Node Groups são formados implicitamente. O primeiro Node Group é formado pelo conjunto de Data Nodes com os IDs de Node mais baixos, o próximo Node Group pelos IDs de Node imediatamente mais baixos, e assim por diante. A título de exemplo, suponha que tenhamos 4 Data Nodes e que `NoOfReplicas` esteja definido como 2. Os quatro Data Nodes têm IDs de Node 2, 3, 4 e 5. Então, o primeiro Node Group é formado pelos Nodes 2 e 3, e o segundo Node Group pelos Nodes 4 e 5. É importante configurar o Cluster de tal maneira que os Nodes no mesmo Node Group não sejam colocados no mesmo computador, pois uma única falha de hardware causaria a falha de todo o Cluster.

  Se nenhum ID de Node for fornecido, a ordem dos Data Nodes é o fator determinante para o Node Group. Quer sejam feitas atribuições explícitas ou não, elas podem ser visualizadas na saída do comando [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) do cliente de gerenciamento.

  O valor padrão e máximo recomendado para `NoOfReplicas` é 2. *Este é o valor recomendado para a maioria dos ambientes de produção*.

  Importante

  Embora seja teoricamente possível que o valor deste parâmetro seja 3 ou 4, o **NDB Cluster 7.5 e o NDB Cluster 7.6 não suportam a definição de `NoOfReplicas` para um valor maior que 2 em produção**.

  Aviso

  Definir `NoOfReplicas` como 1 significa que há apenas uma única cópia de todos os dados do Cluster; neste caso, a perda de um único Data Node faz com que o Cluster falhe porque não há cópias adicionais dos dados armazenados por esse Node.

  O número de Data Nodes no Cluster deve ser divisível uniformemente pelo valor deste parâmetro. Por exemplo, se houver dois Data Nodes, então [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) deve ser igual a 1 ou 2, uma vez que 2/3 e 2/4 resultam em valores fracionários; se houver quatro Data Nodes, então `NoOfReplicas` deve ser igual a 1, 2 ou 4.

* `DataDir`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde os arquivos de trace, arquivos de log, arquivos pid e logs de erro são colocados.

  O padrão é o diretório de trabalho do processo do Data Node.

* [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde todos os arquivos criados para metadata, REDO logs, UNDO logs (para tabelas Disk Data) e arquivos de dados são colocados. O padrão é o diretório especificado por `DataDir`.

  Note

  Este diretório deve existir antes que o processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") seja iniciado.

  A hierarquia de diretórios recomendada para o NDB Cluster inclui `/var/lib/mysql-cluster`, sob o qual um diretório para o sistema de arquivos do Node é criado. O nome deste subdiretório contém o ID do Node. Por exemplo, se o ID do Node for 2, este subdiretório será nomeado `ndb_2_fs`.

* [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde os Backups são colocados.

  Importante

  A string '`/BACKUP`' é sempre anexada a este valor. Por exemplo, se você definir o valor de [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir) para `/var/lib/cluster-data`, então todos os Backups são armazenados em `/var/lib/cluster-data/BACKUP`. Isso também significa que a localização de Backup *efetiva* é o diretório nomeado `BACKUP` sob a localização especificada pelo parâmetro [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath).

##### Data Memory, Index Memory e String Memory

[`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) são parâmetros `[ndbd]` que especificam o tamanho dos segmentos de memória usados para armazenar os registros reais e seus Indexes. Ao definir valores para estes, é importante entender como [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) são usados, pois geralmente precisam ser atualizados para refletir o uso real pelo Cluster.

Note

`IndexMemory` está descontinuado no NDB 7.6 e sujeito à remoção em uma versão futura do NDB Cluster. Veja as descrições a seguir para mais informações.

* [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define a quantidade de espaço (em bytes) disponível para armazenar registros de Database. A quantidade total especificada por este valor é alocada na memória, por isso é extremamente importante que a máquina tenha memória física suficiente para acomodá-la.

  A memória alocada por [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) é usada para armazenar tanto os registros reais quanto os Indexes. Há um overhead de 16 bytes em cada registro; uma quantidade adicional para cada registro é incorrida porque ele é armazenado em uma página de 32KB com um overhead de página de 128 bytes (veja abaixo). Há também uma pequena quantidade desperdiçada por página devido ao fato de que cada registro é armazenado em apenas uma página.

  Para Attributes de tabela de tamanho variável, os dados são armazenados em páginas de dados separadas, alocadas a partir de [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). Registros de comprimento variável usam uma parte de tamanho fixo com um overhead extra de 4 bytes para referenciar a parte de tamanho variável. A parte de tamanho variável tem 2 bytes de overhead mais 2 bytes por Attribute.

  O tamanho máximo de registro é de 14000 bytes.

  No NDB 7.5 (e anteriores), o espaço de memória definido por [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) também é usado para armazenar Ordered Indexes, que usam cerca de 10 bytes por registro. Cada linha da tabela é representada no Ordered Index. Um erro comum entre os usuários é supor que todos os Indexes são armazenados na memória alocada por [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), mas este não é o caso: Apenas Primary Key e Unique Hash Indexes usam esta memória; os Ordered Indexes usam a memória alocada por [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). No entanto, a criação de uma Primary Key ou Unique Hash Index também cria um Ordered Index nas mesmas Keys, a menos que você especifique `USING HASH` na instrução de criação do Index. Isso pode ser verificado executando [**ndb_desc -d *`db_name`* *`table_name`***](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

  No NDB 7.6, os recursos atribuídos a `DataMemory` são usados para armazenar *todos* os dados e Indexes; qualquer memória configurada como `IndexMemory` é automaticamente adicionada àquela usada por `DataMemory` para formar um Pool de recursos comum.

  O espaço de memória alocado por [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) consiste em páginas de 32KB, que são alocadas para fragmentos de tabela. Cada tabela é normalmente particionada no mesmo número de fragmentos que há Data Nodes no Cluster. Assim, para cada Node, há o mesmo número de fragmentos que são definidos em [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas).

  Uma vez que uma página tenha sido alocada, atualmente não é possível retorná-la ao Pool de páginas livres, exceto pela exclusão da tabela. (Isso também significa que as páginas [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory), uma vez alocadas a uma determinada tabela, não podem ser usadas por outras tabelas.) A execução de uma recuperação de Data Node também compacta a partição porque todos os registros são inseridos em partições vazias de outros Nodes ativos.

  O espaço de memória [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) também contém informações UNDO: Para cada Update, uma cópia do registro inalterado é alocada no [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). Há também uma referência a cada cópia nos Indexes de tabela ordenados. Unique Hash Indexes são atualizados apenas quando as colunas de Unique Index são atualizadas, caso em que uma nova entrada na tabela de Index é inserida e a entrada antiga é excluída após o Commit. Por esta razão, também é necessário alocar memória suficiente para lidar com as maiores Transactions realizadas por aplicações que usam o Cluster. Em qualquer caso, realizar poucas Transactions grandes não tem vantagem sobre usar muitas menores, pelos seguintes motivos:

  + Transactions grandes não são mais rápidas do que as menores
  + Transactions grandes aumentam o número de operações que são perdidas e devem ser repetidas em caso de falha da Transaction

  + Transactions grandes usam mais memória

  No NDB 7.5 (e anteriores), o valor padrão para [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) é 80MB; no NDB 7.6, é 98MB. O valor mínimo é 1MB. Não há tamanho máximo, mas na realidade o tamanho máximo tem que ser adaptado para que o processo não comece a fazer swapping quando o limite for atingido. Este limite é determinado pela quantidade de RAM física disponível na máquina e pela quantidade de memória que o sistema operacional pode comprometer com qualquer processo. Sistemas operacionais de 32 bits são geralmente limitados a 2–4GB por processo; sistemas operacionais de 64 bits podem usar mais. Para Databases grandes, pode ser preferível usar um sistema operacional de 64 bits por este motivo.

* [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node IndexMemory" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  No NDB 7.5 e anteriores, este parâmetro controla a quantidade de armazenamento usada para Hash Indexes no NDB Cluster. Hash Indexes são sempre usados para Indexes de Primary Key, Unique Indexes e restrições Unique. Ao definir uma Primary Key ou um Unique Index, dois Indexes são criados, um dos quais é um Hash Index usado para todos os acessos a tuplas, bem como para o tratamento de Lock. Este Index também é usado para impor restrições Unique.

  No NDB 7.6.2, o parâmetro `IndexMemory` está descontinuado (e sujeito a remoção futura); qualquer memória atribuída a `IndexMemory` é alocada em vez disso para o mesmo Pool que [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory), que se torna o único responsável por todos os recursos necessários para armazenar dados e Indexes na memória. No NDB 7.6, o uso de `IndexMemory` no arquivo de configuração do Cluster dispara um aviso do servidor de gerenciamento.

  Você pode estimar o tamanho de um Hash Index usando esta fórmula:

  ```sql
    size  = ( (fragments * 32K) + (rows * 18) )
            * fragment_replicas
  ```

  *`fragments`* é o número de fragmentos, *`fragment_replicas`* é o número de réplicas de fragmentos (normalmente duas), e *`rows`* é o número de linhas. Se uma tabela tiver um milhão de linhas, oito fragmentos e duas réplicas de fragmentos, o uso esperado de memória do Index é calculado conforme mostrado aqui:

  ```sql
    ((8 * 32K) + (1000000 * 18)) * 2 = ((8 * 32768) + (1000000 * 18)) * 2
    = (262144 + 18000000) * 2
    = 18262144 * 2 = 36524288 bytes = ~35MB
  ```

  Estatísticas de Index para Ordered Indexes (quando estes estão habilitados) são armazenadas na tabela `mysql.ndb_index_stat_sample`. Uma vez que esta tabela tem um Hash Index, isso aumenta o uso de memória do Index. Um limite superior para o número de linhas para um determinado Ordered Index pode ser calculado da seguinte forma:

  ```sql
    sample_size= key_size + ((key_attributes + 1) * 4)

    sample_rows = IndexStatSaveSize
                  * ((0.01 * IndexStatSaveScale * log2(rows * sample_size)) + 1)
                  / sample_size
  ```

  Na fórmula anterior, *`key_size`* é o tamanho da Key do Ordered Index em bytes, *`key_attributes`* é o número de Attributes na Key do Ordered Index, e *`rows`* é o número de linhas na tabela base.

  Suponha que a tabela `t1` tenha 1 milhão de linhas e um Ordered Index nomeado `ix1` em dois inteiros de quatro bytes. Suponha, adicionalmente, que [`IndexStatSaveSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavesize) e [`IndexStatSaveScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavescale) estejam definidos para seus valores padrão (32K e 100, respectivamente). Usando as 2 fórmulas anteriores, podemos calcular o seguinte:

  ```sql
    sample_size = 8  + ((1 + 2) * 4) = 20 bytes

    sample_rows = 32K
                  * ((0.01 * 100 * log2(1000000*20)) + 1)
                  / 20
                  = 32768 * ( (1 * ~16.811) +1) / 20
                  = 32768 * ~17.811 / 20
                  = ~29182 rows
  ```

  O uso esperado de memória do Index é, portanto, 2 * 18 * 29182 = ~1050550 bytes.

  Antes do NDB 7.6, o valor padrão para [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) é 18MB e o mínimo é 1 MB; no NDB 7.6, o valor mínimo e padrão para este parâmetro é 0 (zero). Isso tem implicações para Downgrades do NDB 7.6 para versões anteriores do NDB Cluster; consulte [Seção 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), para mais informações.

* [`StringMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stringmemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node StringMemory" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro determina quanta memória é alocada para strings, como nomes de tabela, e é especificado em uma seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`. Um valor entre `0` e `100` inclusive é interpretado como uma porcentagem do valor máximo padrão, que é calculado com base em uma série de fatores, incluindo o número de tabelas, tamanho máximo do nome da tabela, tamanho máximo dos arquivos `.FRM`, [`MaxNoOfTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftriggers), tamanho máximo do nome da coluna e valor padrão máximo da coluna.

  Um valor maior que `100` é interpretado como um número de bytes.

  O valor padrão é 25, ou seja, 25% do máximo padrão.

  Na maioria das circunstâncias, o valor padrão deve ser suficiente, mas quando você tem um grande número de tabelas `NDB` (1000 ou mais), é possível obter o Erro 773 Out of string memory, please modify StringMemory config parameter: Permanent error: Schema error, caso em que você deve aumentar este valor. `25` (25 por cento) não é excessivo e deve evitar que este erro se repita em todas as condições, exceto nas mais extremas.

O exemplo a seguir ilustra como a memória é usada para uma tabela. Considere esta definição de tabela:

```sql
CREATE TABLE example (
  a INT NOT NULL,
  b INT NOT NULL,
  c INT NOT NULL,
  PRIMARY KEY(a),
  UNIQUE(b)
) ENGINE=NDBCLUSTER;
```

Para cada registro, há 12 bytes de dados mais 12 bytes de overhead. Não ter colunas anuláveis economiza 4 bytes de overhead. Além disso, temos dois Ordered Indexes nas colunas `a` e `b` consumindo aproximadamente 10 bytes cada por registro. Há um Primary Key Hash Index na tabela base usando aproximadamente 29 bytes por registro. A restrição Unique é implementada por uma tabela separada com `b` como Primary Key e `a` como uma coluna. Esta outra tabela consome 29 bytes adicionais de memória de Index por registro na tabela `example`, bem como 8 bytes de dados de registro mais 12 bytes de overhead.

Assim, para um milhão de registros, precisamos de 58MB para Index Memory para lidar com os Hash Indexes para a Primary Key e a restrição Unique. Também precisamos de 64MB para os registros da tabela base e da tabela de Unique Index, mais as duas tabelas de Ordered Index.

Você pode ver que os Hash Indexes ocupam uma boa quantidade de espaço de memória; no entanto, eles fornecem acesso muito rápido aos dados em troca. Eles também são usados no NDB Cluster para lidar com restrições de unicidade.

Atualmente, o único algoritmo de particionamento é o Hashing e os Ordered Indexes são locais para cada Node. Assim, os Ordered Indexes não podem ser usados para lidar com restrições de unicidade no caso geral.

Um ponto importante para ambos [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) e [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) é que o tamanho total do Database é a soma de toda a Data Memory e toda a Index Memory para cada Node Group. Cada Node Group é usado para armazenar informações replicadas, então se houver quatro Nodes com duas réplicas de fragmentos, há dois Node Groups. Assim, a Data Memory total disponível é 2 × [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) para cada Data Node.

É altamente recomendável que [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) sejam definidos para os mesmos valores para todos os Nodes. A distribuição de dados é uniforme em todos os Nodes no Cluster, então a quantidade máxima de espaço disponível para qualquer Node não pode ser maior do que a do menor Node no Cluster.

[`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) (e no NDB 7.5 e anteriores [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)) podem ser alterados, mas diminuí-los pode ser arriscado; isso pode levar facilmente a um Node ou até mesmo a um NDB Cluster inteiro que não consiga reiniciar devido à memória insuficiente. Aumentos devem ser aceitáveis, mas é recomendável que tais Upgrades sejam realizados da mesma maneira que um Upgrade de software, começando com uma atualização do arquivo de configuração e, em seguida, reiniciando o servidor de gerenciamento seguido pela reinicialização de cada Data Node, por sua vez.

**MinFreePct.**

Uma proporção (5% por padrão) dos recursos do Data Node, incluindo [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) (e no NDB 7.5 e anteriores, [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)), é mantida em reserva para garantir que o Data Node não esgote sua memória ao realizar um Restart. Isso pode ser ajustado usando o parâmetro de configuração do Data Node [`MinFreePct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-minfreepct "MinFreePct") (padrão 5).

<table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

Os Updates não aumentam a quantidade de Index Memory usada. As Inserções entram em vigor imediatamente; no entanto, as linhas não são realmente excluídas até que a Transaction seja commitada.

**Parâmetros de Transaction.** Os próximos parâmetros `[ndbd]` que discutiremos são importantes porque afetam o número de Transactions paralelas e os tamanhos das Transactions que podem ser manipuladas pelo sistema. [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions) define o número de Transactions paralelas possíveis em um Node. [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) define o número de registros que podem estar em fase de Update ou bloqueados simultaneamente.

Ambos os parâmetros (especialmente [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations)) são alvos prováveis para usuários que definem valores específicos e não usam o valor padrão. O valor padrão é definido para sistemas que usam Transactions pequenas, para garantir que elas não usem memória excessiva.

[`MaxDMLOperationsPerTransaction`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdmloperationspertransaction) define o número máximo de operações DML que podem ser realizadas em uma determinada Transaction.

* [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxNoOfConcurrentTransactions" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada Data Node do Cluster requer um registro de Transaction para cada Transaction ativa no Cluster. A tarefa de coordenar Transactions é distribuída entre todos os Data Nodes. O número total de registros de Transaction no Cluster é o número de Transactions em qualquer Node vezes o número de Nodes no Cluster.

  Os registros de Transaction são alocados para servidores MySQL individuais. Cada conexão com um servidor MySQL requer pelo menos um registro de Transaction, mais um objeto de Transaction adicional por tabela acessada por essa conexão. Isso significa que um mínimo razoável para o número total de Transactions no Cluster pode ser expresso como

  ```sql
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

  Suponha que haja 10 SQL Nodes usando o Cluster. Um único JOIN envolvendo 10 tabelas requer 11 registros de Transaction; se houver 10 desses JOINs em uma Transaction, então 10 * 11 = 110 registros de Transaction são necessários para esta Transaction, por servidor MySQL, ou 110 * 10 = 1100 registros de Transaction no total. Espera-se que cada Data Node manipule TotalNoOfConcurrentTransactions / número de Data Nodes. Para um NDB Cluster com 4 Data Nodes, isso significaria definir `MaxNoOfConcurrentTransactions` em cada Data Node para 1100 / 4 = 275. Além disso, você deve prever a recuperação de falhas, garantindo que um único Node Group possa acomodar todas as Transactions concorrentes; em outras palavras, que o MaxNoOfConcurrentTransactions de cada Data Node seja suficiente para cobrir um número de Transactions igual a TotalNoOfConcurrentTransactions / número de Node Groups. Se este Cluster tiver um único Node Group, então `MaxNoOfConcurrentTransactions` deve ser definido para 1100 (o mesmo que o número total de Transactions concorrentes para todo o Cluster).

  Além disso, cada Transaction envolve pelo menos uma operação; por esta razão, o valor definido para `MaxNoOfConcurrentTransactions` deve ser sempre não mais do que o valor de [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations).

  Este parâmetro deve ser definido para o mesmo valor para todos os Data Nodes do Cluster. Isso se deve ao fato de que, quando um Data Node falha, o Node sobrevivente mais antigo recria o estado da Transaction de todas as Transactions que estavam em andamento no Node que falhou.

  É possível alterar este valor usando um rolling restart, mas a quantidade de tráfego no Cluster deve ser tal que não ocorram mais Transactions do que o nível mais baixo (antigo e novo) enquanto isso estiver ocorrendo.

  O valor padrão é 4096.

* [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxNoOfConcurrentOperations" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  É uma boa ideia ajustar o valor deste parâmetro de acordo com o tamanho e o número de Transactions. Ao realizar Transactions que envolvem apenas algumas operações e registros, o valor padrão para este parâmetro é geralmente suficiente. Realizar Transactions grandes envolvendo muitos registros geralmente requer que você aumente seu valor.

  Registros são mantidos para cada Transaction atualizando dados do Cluster, tanto no coordenador de Transaction quanto nos Nodes onde os Updates reais são realizados. Esses registros contêm informações de estado necessárias para encontrar registros UNDO para Rollback, filas de Lock e outros propósitos.

  Este parâmetro deve ser definido, no mínimo, para o número de registros a serem atualizados simultaneamente em Transactions, dividido pelo número de Data Nodes do Cluster. Por exemplo, em um Cluster que tem quatro Data Nodes e que se espera que manipule um milhão de Updates concorrentes usando Transactions, você deve definir este valor para 1000000 / 4 = 250000. Para ajudar a fornecer resiliência contra falhas, sugere-se que você defina este parâmetro para um valor que seja alto o suficiente para permitir que um Data Node individual manipule a carga de seu Node Group. Em outras palavras, você deve definir o valor igual a `número total de operações concorrentes / número de Node Groups`. (No caso em que há um único Node Group, isso é o mesmo que o número total de operações concorrentes para todo o Cluster.)

  Como cada Transaction sempre envolve pelo menos uma operação, o valor de `MaxNoOfConcurrentOperations` deve ser sempre maior ou igual ao valor de [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions).

  Queries de leitura que definem Locks também fazem com que registros de operação sejam criados. Algum espaço extra é alocado dentro de Nodes individuais para acomodar casos em que a distribuição não é perfeita sobre os Nodes.

  Quando as Queries fazem uso do Unique Hash Index, na verdade, há dois registros de operação usados por registro na Transaction. O primeiro registro representa a leitura na tabela de Index e o segundo manipula a operação na tabela base.

  O valor padrão é 32768.

  Este parâmetro na verdade lida com dois valores que podem ser configurados separadamente. O primeiro deles especifica quantos registros de operação devem ser colocados com o coordenador de Transaction. A segunda parte especifica quantos registros de operação devem ser locais para o Database.

  Uma Transaction muito grande realizada em um Cluster de oito Nodes requer tantos registros de operação no coordenador de Transaction quanto há leituras, Updates e Deletes envolvidos na Transaction. No entanto, os registros de operação estão espalhados por todos os oito Nodes. Assim, se for necessário configurar o sistema para uma Transaction muito grande de cada vez e houver muitos Nodes, é uma boa ideia configurar as duas partes separadamente. [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) é sempre usado para calcular o número de registros de operação na porção do coordenador de Transaction do Node.

  Também é importante ter uma ideia dos requisitos de memória para registros de operação. Estes consomem cerca de 1KB por registro.

* [`MaxNoOfLocalOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocaloperations)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxNoOfLocalOperations" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Por padrão, este parâmetro é calculado como 1.1 × [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations). Isso se encaixa em sistemas com muitas Transactions simultâneas, mas nenhuma delas sendo muito grande. Se houver a necessidade de lidar com uma Transaction muito grande de cada vez e houver muitos Nodes, é uma boa ideia anular o valor padrão, especificando este parâmetro explicitamente.

* [`MaxDMLOperationsPerTransaction`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdmloperationspertransaction)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxDMLOperationsPerTransaction" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro limita o tamanho de uma Transaction. A Transaction é abortada se exigir mais do que este número de operações DML.

**Armazenamento temporário de Transaction.** O próximo conjunto de parâmetros `[ndbd]` é usado para determinar o armazenamento temporário ao executar uma instrução que faz parte de uma Transaction do Cluster. Todos os registros são liberados quando a instrução é concluída e o Cluster está esperando pelo Commit ou Rollback.

Os valores padrão para estes parâmetros são adequados para a maioria das situações. No entanto, usuários com necessidade de suportar Transactions envolvendo um grande número de linhas ou operações podem precisar aumentar esses valores para permitir um melhor paralelismo no sistema, enquanto usuários cujas aplicações requerem Transactions relativamente pequenas podem diminuir os valores para economizar memória.

* [`MaxNoOfConcurrentIndexOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentindexoperations)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxNoOfConcurrentIndexOperations" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para Queries que usam um Unique Hash Index, outro conjunto temporário de registros de operação é usado durante a fase de execução de uma Query. Este parâmetro define o tamanho desse Pool de registros. Assim, este registro é alocado apenas durante a execução de uma parte de uma Query. Assim que esta parte é executada, o registro é liberado. O estado necessário para lidar com Aborts e Commits é manipulado pelos registros de operação normais, onde o tamanho do Pool é definido pelo parâmetro [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations).

  O valor padrão deste parâmetro é 8192. Apenas em casos raros de paralelismo extremamente alto usando Unique Hash Indexes deve ser necessário aumentar este valor. Usar um valor menor é possível e pode economizar memória se o DBA tiver certeza de que um alto grau de paralelismo não é necessário para o Cluster.

* [`MaxNoOfFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooffiredtriggers)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node MaxNoOfFiredTriggers" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O valor padrão de [`MaxNoOfFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooffiredtriggers) é 4000, o que é suficiente para a maioria das situações. Em alguns casos, pode até ser diminuído se o DBA tiver certeza de que a necessidade de paralelismo no Cluster não é alta.

  Um registro é criado quando uma operação que afeta um Unique Hash Index é realizada. Inserir ou excluir um registro em uma tabela com Unique Hash Indexes ou atualizar uma coluna que faz parte de um Unique Hash Index dispara uma Inserção ou um Delete na tabela de Index. O registro resultante é usado para representar esta operação na tabela de Index enquanto espera que a operação original que a disparou seja concluída. Esta operação tem vida curta, mas ainda pode exigir um grande número de registros em seu Pool para situações com muitas operações de escrita paralelas em uma tabela base contendo um conjunto de Unique Hash Indexes.

* [`TransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionbuffermemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A memória afetada por este parâmetro é usada para rastrear operações disparadas ao atualizar tabelas de Index e ler Unique Indexes. Esta memória é usada para armazenar a Key e as informações de coluna para estas operações. É muito raro que o valor para este parâmetro precise ser alterado do padrão.

  O valor padrão para [`TransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionbuffermemory) é 1MB.

  Operações normais de leitura e escrita usam um Buffer semelhante, cujo uso é ainda mais curto. O parâmetro de tempo de compilação `ZATTRBUF_FILESIZE` (encontrado em `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) definido para 4000 × 128 bytes (500KB). Um Buffer semelhante para informações de Key, `ZDATABUF_FILESIZE` (também em `Dbtc.hpp`) contém 4000 × 16 = 62.5KB de espaço de Buffer. `Dbtc` é o módulo que lida com a coordenação de Transaction.

**Scans e Buffering.** Existem parâmetros `[ndbd]` adicionais no módulo `Dblqh` (em `ndb/src/kernel/blocks/Dblqh/Dblqh.hpp`) que afetam leituras e Updates. Estes incluem `ZATTRINBUF_FILESIZE`, definido por padrão para 10000 × 128 bytes (1250KB) e `ZDATABUF_FILE_SIZE`, definido por padrão para 10000\*16 bytes (aproximadamente 156KB) de espaço de Buffer. Até o momento, não houve relatórios de usuários nem quaisquer resultados de nossos próprios testes extensivos sugerindo que qualquer um desses limites de tempo de compilação deva ser aumentado.

* [`BatchSizePerLocalScan`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-batchsizeperlocalscan)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para calcular o número de registros de Lock usados para lidar com operações de Scan concorrentes.

  `BatchSizePerLocalScan` tem uma forte conexão com o [`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize) definido nos SQL Nodes.

* [`LongMessageBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-longmessagebuffer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este é um Buffer interno usado para passar mensagens dentro de Nodes individuais e entre Nodes. O padrão é 64MB.

  Este parâmetro raramente precisa ser alterado do padrão.

* [`MaxFKBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxfkbuildbatchsize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Tamanho máximo do Batch de Scan usado para construir Foreign Keys. Aumentar o valor definido para este parâmetro pode acelerar a construção de Foreign Keys, à custa de um impacto maior no tráfego em andamento.

* [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para controlar o número de Scans paralelos que podem ser realizados no Cluster. Cada coordenador de Transaction pode manipular o número de Scans paralelos definidos para este parâmetro. Cada Query de Scan é realizada escaneando todas as partições em paralelo. Cada Scan de partição usa um registro de Scan no Node onde a partição está localizada, sendo o número de registros o valor deste parâmetro vezes o número de Nodes. O Cluster deve ser capaz de sustentar [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans) Scans concorrentemente de todos os Nodes no Cluster.

  Os Scans são realmente realizados em dois casos. O primeiro desses casos ocorre quando não existe Hash ou Ordered Index para lidar com a Query, caso em que a Query é executada realizando um Full Table Scan. O segundo caso é encontrado quando não há Hash Index para suportar a Query, mas há um Ordered Index. Usar o Ordered Index significa executar um Range Scan paralelo. A ordem é mantida apenas nas partições locais, então é necessário realizar o Index Scan em todas as partições.

  O valor padrão de [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans) é 256. O valor máximo é 500.

* [`MaxNoOfLocalScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocalscans)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Especifica o número de registros de Scan locais se muitos Scans não estiverem totalmente paralelizados. Quando o número de registros de Scan locais não é fornecido, ele é calculado conforme mostrado aqui:

  ```sql
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

  O valor mínimo é 32.

* [`MaxParallelCopyInstances`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelcopyinstances)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define a paralelização usada na fase de cópia de um Node Restart ou System Restart, quando um Node que está atualmente apenas iniciando é sincronizado com um Node que já tem dados atuais, copiando quaisquer registros alterados do Node que está atualizado. Como o paralelismo total em tais casos pode levar a situações de sobrecarga, `MaxParallelCopyInstances` fornece um meio de diminuí-lo. O valor padrão deste parâmetro é 0. Este valor significa que o paralelismo efetivo é igual ao número de instâncias LDM no Node que está apenas iniciando, bem como no Node que o está atualizando.

* [`MaxParallelScansPerFragment`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelscansperfragment)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  É possível configurar o número máximo de Scans paralelos (Scans [`TUP`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtup.html) e Scans [`TUX`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtux.html)) permitidos antes que eles comecem a enfileirar para manipulação serial. Você pode aumentar isso para aproveitar qualquer CPU não utilizada ao realizar um grande número de Scans em paralelo e melhorar seu desempenho.

* [`MaxReorgBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxreorgbuildbatchsize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Tamanho máximo do Batch de Scan usado para reorganização de partições de tabela. Aumentar o valor definido para este parâmetro pode acelerar a reorganização, à custa de um impacto maior no tráfego em andamento.

* [`MaxUIBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxuibuildbatchsize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Tamanho máximo do Batch de Scan usado para construir Unique Keys. Aumentar o valor definido para este parâmetro pode acelerar tais construções, à custa de um impacto maior no tráfego em andamento.

##### Alocação de Memória

[`MaxAllocate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxallocate)

<table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

Este parâmetro era usado em versões mais antigas do NDB Cluster, mas não tem efeito no NDB 7.5 ou NDB 7.6.

##### Tamanho do Hash Map

[`DefaultHashMapSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-defaulthashmapsize)

<table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

O tamanho dos Hash Maps de tabela usados pelo [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é configurável usando este parâmetro. `DefaultHashMapSize` pode aceitar qualquer um dos três valores possíveis (0, 240, 3840).

O uso original pretendido para este parâmetro era facilitar Upgrades e especialmente Downgrades para e de lançamentos muito antigos com tamanhos de Hash Map padrão diferentes. Isso não é um problema ao fazer Upgrade do NDB Cluster 7.3 (ou posterior) para versões posteriores.

Diminuir este parâmetro online após qualquer tabela ter sido criada ou modificada com `DefaultHashMapSize` igual a 3840 não é suportado.

**Logging e Checkpointing.** Os seguintes parâmetros `[ndbd]` controlam o comportamento de Log e Checkpoint.

* [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A definição deste parâmetro permite que você controle diretamente o tamanho dos arquivos de REDO log. Isso pode ser útil em situações em que o NDB Cluster está operando sob uma carga alta e não consegue fechar arquivos de log de fragmentos rapidamente o suficiente antes de tentar abrir novos (apenas 2 arquivos de log de fragmentos podem estar abertos de cada vez); aumentar o tamanho dos arquivos de log de fragmentos dá ao Cluster mais tempo antes de ter que abrir cada novo arquivo de log de fragmentos. O valor padrão para este parâmetro é 16M.

  Para mais informações sobre arquivos de log de fragmentos, consulte a descrição para [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles).

* [`InitialNoOfOpenFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialnoofopenfiles)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define o número inicial de Threads internos a serem alocados para arquivos abertos.

  O valor padrão é 27.

* [`InitFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initfragmentlogfiles)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Por padrão, os arquivos de log de fragmentos são criados esparsamente ao realizar uma inicialização inicial de um Data Node — isto é, dependendo do sistema operacional e do sistema de arquivos em uso, nem todos os bytes são necessariamente escritos em disco. No entanto, é possível anular este comportamento e forçar todos os bytes a serem escritos, independentemente da plataforma e do tipo de sistema de arquivos usado, por meio deste parâmetro. [`InitFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initfragmentlogfiles) aceita um de dois valores:

  + `SPARSE`. Os arquivos de log de fragmentos são criados esparsamente. Este é o valor padrão.

  + `FULL`. Força todos os bytes do arquivo de log de fragmentos a serem escritos em disco.

  Dependendo do seu sistema operacional e sistema de arquivos, definir `InitFragmentLogFiles=FULL` pode ajudar a eliminar erros de I/O em escritas no REDO log.

* [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando `true`, habilita Checkpoints locais parciais (Partial Local Checkpoints - LCPs): Isso significa que cada LCP registra apenas parte do Database completo, mais quaisquer registros contendo linhas alteradas desde o último LCP; se nenhuma linha tiver sido alterada, o LCP atualiza apenas o arquivo de controle do LCP e não atualiza nenhum arquivo de dados.

  Se `EnablePartialLcp` estiver desabilitado (`false`), cada LCP usa apenas um único arquivo e escreve um Checkpoint completo; isso requer a menor quantidade de espaço em disco para LCPs, mas aumenta a carga de escrita para cada LCP. O valor padrão é habilitado (`true`). A proporção de espaço usado por LCPs parciais pode ser modificada pela configuração do parâmetro de configuração [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork).

  Para mais informações sobre arquivos e diretórios usados para LCPs completos e parciais, consulte [Diretório do Sistema de Arquivos do Data Node do NDB Cluster](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

  No NDB 7.6.7 e posterior, definir este parâmetro como `false` também desabilita o cálculo da velocidade de escrita em disco usada pelo mecanismo de controle adaptativo de LCP.

* [`LcpScanProgressTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lcpscanprogresstimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Um watchdog de Scan de fragmento de Checkpoint local verifica periodicamente se não há progresso em cada Scan de fragmento realizado como parte de um Checkpoint local e desliga o Node se não houver progresso após um determinado período de tempo. Este intervalo pode ser definido usando o parâmetro de configuração do Data Node [`LcpScanProgressTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lcpscanprogresstimeout), que define o tempo máximo pelo qual o Checkpoint local pode ser paralisado antes que o watchdog de Scan de fragmento LCP desligue o Node.

  O valor padrão é 60 segundos (proporcionando compatibilidade com versões anteriores). Definir este parâmetro para 0 desabilita o watchdog de Scan de fragmento LCP por completo.

* [`MaxNoOfOpenFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofopenfiles)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define um teto sobre quantos Threads internos alocar para arquivos abertos. *Qualquer situação que exija uma mudança neste parâmetro deve ser relatada como um bug*.

  O valor padrão é 0. No entanto, o valor mínimo para o qual este parâmetro pode ser definido é 20.

* [`MaxNoOfSavedMessages`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsavedmessages)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define o número máximo de erros escritos no log de erros, bem como o número máximo de arquivos de trace que são mantidos antes de sobrescrever os existentes. Os arquivos de trace são gerados quando, por qualquer motivo, o Node falha.

  O padrão é 25, o que define estes máximos para 25 mensagens de erro e 25 arquivos de trace.

* [`MaxLCPStartDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxlcpstartdelay)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ServerPort" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Na recuperação paralela de Data Nodes, apenas os dados da tabela são realmente copiados e sincronizados em paralelo; a sincronização de metadata, como informações de dicionário e Checkpoint, é feita de forma serial. Além disso, a recuperação de informações de dicionário e Checkpoint não pode ser executada em paralelo com a realização de Local Checkpoints. Isso significa que, ao iniciar ou reiniciar muitos Data Nodes simultaneamente, os Data Nodes podem ser forçados a esperar enquanto um Local Checkpoint é realizado, o que pode resultar em tempos de recuperação de Node mais longos.

  É possível forçar um atraso no Local Checkpoint para permitir que mais (e possivelmente todos) Data Nodes concluam a sincronização de metadata; uma vez que a sincronização de metadata de cada Data Node esteja completa, todos os Data Nodes podem recuperar dados de tabela em paralelo, mesmo enquanto o Local Checkpoint estiver sendo executado. Para forçar tal atraso, defina [`MaxLCPStartDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxlcpstartdelay), que determina o número de segundos que o Cluster pode esperar para iniciar um Local Checkpoint enquanto os Data Nodes continuam a sincronizar metadata. Este parâmetro deve ser definido na seção `[ndbd default]` do arquivo `config.ini`, para que seja o mesmo para todos os Data Nodes. O valor máximo é 600; o padrão é 0.

* [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define o número de arquivos de REDO log para o Node e, portanto, a quantidade de espaço alocada para o REDO logging. Como os arquivos de REDO log são organizados em um anel, é extremamente importante que o primeiro e o último arquivo de log no conjunto (às vezes referidos como os arquivos de log "head" e "tail", respectivamente) não se encontrem. Quando estes se aproximam demais, o Node começa a abortar todas as Transactions que englobam Updates devido à falta de espaço para novos registros de log.

  Um registro de `REDO` log não é removido até que ambos os Local Checkpoints necessários tenham sido concluídos desde que esse registro de log foi inserido. A frequência de Checkpointing é determinada por seu próprio conjunto de parâmetros de configuração discutidos em outras partes deste capítulo.

  O valor padrão do parâmetro é 16, o que por padrão significa 16 conjuntos de 4 arquivos de 16MB para um total de 1024MB. O tamanho dos arquivos de log individuais é configurável usando o parâmetro [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize). Em cenários que requerem um grande número de Updates, o valor para [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles) pode precisar ser definido tão alto quanto 300 ou até mais para fornecer espaço suficiente para REDO logs.

  Se o Checkpointing for lento e houver tantas escritas no Database que os arquivos de log estejam cheios e a cauda do log não puder ser cortada sem colocar em risco a recuperação, todas as Transactions de atualização são abortadas com o código de erro interno 410 (`Out of log file space temporarily`). Esta condição prevalece até que um Checkpoint tenha sido concluído e a cauda do log possa ser movida para frente.

  Importante

  Este parâmetro não pode ser alterado "on the fly"; você deve reiniciar o Node usando `--initial`. Se você deseja alterar este valor para todos os Data Nodes em um Cluster em execução, você pode fazê-lo usando um rolling node restart (usando `--initial` ao iniciar cada Data Node).

* [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Porcentagem de overhead de armazenamento para arquivos LCP. Este parâmetro só tem efeito quando [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) é true, ou seja, apenas quando Partial Local Checkpoints estão habilitados. Um valor mais alto significa:

  + Menos registros são escritos para cada LCP, LCPs usam mais espaço

  + Mais trabalho é necessário durante os Restarts

  Um valor mais baixo para `RecoveryWork` significa:

  + Mais registros são escritos durante cada LCP, mas LCPs exigem menos espaço em disco.

  + Menos trabalho durante o Restart e, portanto, Restarts mais rápidos, à custa de mais trabalho durante as operações normais

  Por exemplo, definir `RecoveryWork` como 60 significa que o tamanho total de um LCP é aproximadamente 1 + 0.6 = 1.6 vezes o tamanho dos dados a serem Checkpointados. Isso significa que 60% mais trabalho é necessário durante a fase de restauração de um Restart em comparação com o trabalho feito durante um Restart que usa Checkpoints completos. (Isso é mais do que compensado durante outras fases do Restart, de modo que o Restart como um todo ainda é mais rápido ao usar LCPs parciais do que ao usar LCPs completos.) Para não preencher o REDO log, é necessário escrever a 1 + (1 / `RecoveryWork`) vezes a taxa de alterações de dados durante os Checkpoints — assim, quando `RecoveryWork` = 60, é necessário escrever a aproximadamente 1 + (1 / 0.6 ) = 2.67 vezes a taxa de alteração. Em outras palavras, se as alterações estiverem sendo escritas a 10 MByte por segundo, o Checkpoint precisa ser escrito a aproximadamente 26.7 MByte por segundo.

  Definir `RecoveryWork` = 40 significa que apenas 1.4 vezes o tamanho total do LCP é necessário (e, portanto, a fase de restauração leva de 10 a 15 por cento menos tempo. Neste caso, a taxa de escrita do Checkpoint é 3.5 vezes a taxa de alteração.

  A distribuição de origem do NDB inclui um programa de teste para simular LCPs. `lcp_simulator.cc` pode ser encontrado em `storage/ndb/src/kernel/blocks/backup/`. Para compilá-lo e executá-lo em plataformas Unix, execute os comandos mostrados aqui:

  ```sql
  $> gcc lcp_simulator.cc
  $> ./a.out
  ```

  Este programa não tem dependências além de `stdio.h` e não requer uma conexão com um NDB Cluster ou um MySQL Server. Por padrão, ele simula 300 LCPs (três conjuntos de 100 LCPs, cada um consistindo em Inserções, Updates e Deletes, por sua vez), relatando o tamanho do LCP após cada um. Você pode alterar a simulação alterando os valores de `recovery_work`, `insert_work` e `delete_work` na origem e recompilando. Para mais informações, consulte o código-fonte do programa.

* [`InsertRecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-insertrecoverywork)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Porcentagem de [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) usada para linhas inseridas. Um valor mais alto aumenta o número de escritas durante um Local Checkpoint e diminui o tamanho total do LCP. Um valor mais baixo diminui o número de escritas durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo. Este parâmetro só tem efeito quando [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) é true, ou seja, apenas quando Partial Local Checkpoints estão habilitados.

* [`EnableRedoControl`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enableredocontrol)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Habilita a velocidade adaptativa de Checkpointing para controlar o uso do REDO log. Defina como `false` para desabilitar (o padrão). Definir [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) como `false` também desabilita o cálculo adaptativo.

  Quando habilitado, `EnableRedoControl` permite aos Data Nodes maior flexibilidade em relação à taxa na qual eles escrevem LCPs no disco. Mais especificamente, habilitar este parâmetro significa que taxas de escrita mais altas podem ser empregadas, para que os LCPs possam ser concluídos e os REDO logs possam ser encurtados mais rapidamente, reduzindo assim o tempo de recuperação e os requisitos de espaço em disco. Essa funcionalidade permite que os Data Nodes façam melhor uso da taxa mais alta de I/O e maior largura de banda disponíveis em dispositivos de armazenamento de estado sólido e protocolos modernos, como Solid-State Drives (SSDs) usando Non-Volatile Memory Express (NVMe).

  O parâmetro atualmente tem como padrão `false` (desabilitado) devido ao fato de que o `NDB` ainda é amplamente implementado em sistemas cujo I/O ou largura de banda é restrito em relação àqueles que empregam tecnologia de estado sólido, como aqueles que usam discos rígidos convencionais (HDDs). Em configurações como estas, o mecanismo `EnableRedoControl` pode facilmente fazer com que o subsistema de I/O fique saturado, aumentando os tempos de espera para entrada e saída do Data Node. Em particular, isso pode causar problemas com as tabelas Disk Data do NDB que têm tablespaces ou grupos de arquivos de log compartilhando um subsistema de I/O restrito com os arquivos LCP e REDO log do Data Node; tais problemas incluem potencialmente falha de Node ou Cluster devido a erros de parada GCP.

**Objetos de Metadata.** O próximo conjunto de parâmetros `[ndbd]` define tamanhos de Pool para objetos de Metadata, usados para definir o número máximo de Attributes, tabelas, Indexes e objetos Trigger usados por Indexes, eventos e Replicação entre Clusters.

Note

Estes agem meramente como "sugestões" para o Cluster, e qualquer um que não seja especificado reverte para os valores padrão mostrados.

* [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define um número máximo sugerido de Attributes que podem ser definidos no Cluster; assim como [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), não se destina a funcionar como um limite superior rígido.

  (Em versões mais antigas do NDB Cluster, este parâmetro era às vezes tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava à confusão quando era possível [ou não era possível, dependendo das circunstâncias] criar mais Attributes do que `MaxNoOfAttributes`.)

  O valor padrão é 1000, com o valor mínimo possível sendo 32. O máximo é 4294967039. Cada Attribute consome cerca de 200 bytes de armazenamento por Node devido ao fato de que toda a metadata é totalmente replicada nos servidores.

  Ao definir [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes), é importante preparar-se antecipadamente para quaisquer instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que você possa querer executar no futuro. Isso se deve ao fato de que, durante a execução de [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela Cluster, 3 vezes o número de Attributes da tabela original são usados, e uma boa prática é permitir o dobro dessa quantidade. Por exemplo, se a tabela NDB Cluster com o maior número de Attributes (*`greatest_number_of_attributes`*) tiver 100 Attributes, um bom ponto de partida para o valor de [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes) seria `6 * greatest_number_of_attributes = 600`.

  Você também deve estimar o número médio de Attributes por tabela e multiplicar isso por [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables). Se este valor for maior do que o valor obtido no parágrafo anterior, você deve usar o valor maior.

  Assumindo que você pode criar todas as tabelas desejadas sem problemas, você também deve verificar se este número é suficiente tentando um [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") real após configurar o parâmetro. Se isso não for bem-sucedido, aumente [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes) por outro múltiplo de [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables) e teste novamente.

* [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Um objeto de tabela é alocado para cada tabela e para cada Unique Hash Index no Cluster. Este parâmetro define um número máximo sugerido de objetos de tabela para o Cluster como um todo; assim como [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes), não se destina a funcionar como um limite superior rígido.

  (Em versões mais antigas do NDB Cluster, este parâmetro era às vezes tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava à confusão quando era possível [ou não era possível, dependendo das circunstâncias] criar mais tabelas do que `MaxNoOfTables`.)

  Para cada Attribute que tem um tipo de dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), uma tabela extra é usada para armazenar a maior parte dos dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Estas tabelas também devem ser levadas em consideração ao definir o número total de tabelas.

  O valor padrão deste parâmetro é 128. O mínimo é 8 e o máximo é 20320. Cada objeto de tabela consome aproximadamente 20KB por Node.

  Note

  A soma de [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) e [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) não deve exceder `232 − 2` (4294967294).

* [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para cada Ordered Index no Cluster, um objeto é alocado descrevendo o que está sendo indexado e seus segmentos de armazenamento. Por padrão, cada Index assim definido também define um Ordered Index. Cada Unique Index e Primary Key tem um Ordered Index e um Hash Index. [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) define o número total de Ordered Indexes que podem estar em uso no sistema a qualquer momento.

  O valor padrão deste parâmetro é 128. Cada objeto de Index consome aproximadamente 10KB de dados por Node.

  Note

  A soma de [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) e [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) não deve exceder `232 − 2` (4294967294).

* [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para cada Unique Index que não é uma Primary Key, uma tabela especial é alocada que mapeia a Unique Key para a Primary Key da tabela indexada. Por padrão, um Ordered Index também é definido para cada Unique Index. Para evitar isso, você deve especificar a opção `USING HASH` ao definir o Unique Index.

  O valor padrão é 64. Cada Index consome aproximadamente 15KB por Node.

  Note

  A soma de [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) e [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) não deve exceder `232 − 2` (4294967294).

* [`MaxNoOfTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftriggers)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Triggers internos de Update, Insert e Delete são alocados para cada Unique Hash Index. (Isso significa que três Triggers são criados para cada Unique Hash Index.) No entanto, um Index *ordenado* requer apenas um único objeto Trigger. Backups também usam três objetos Trigger para cada tabela normal no Cluster.

  A Replicação entre Clusters também faz uso de Triggers internos.

  Este parâmetro define o número máximo de objetos Trigger no Cluster.

  O valor padrão é 768.

* [`MaxNoOfSubscriptions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscriptions)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NodeGroup" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") em um NDB Cluster requer uma Subscription no kernel NDB. Para algumas aplicações NDB API, pode ser necessário ou desejável alterar este parâmetro. No entanto, para uso normal com MySQL Servers atuando como SQL Nodes, não há necessidade de fazê-lo.

  O valor padrão para [`MaxNoOfSubscriptions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscriptions) é 0, que é tratado como igual a [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables). Cada Subscription consome 108 bytes.

* [`MaxNoOfSubscribers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscribers)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é de interesse apenas ao usar a Replicação do NDB Cluster. O valor padrão é 0, que é tratado como `2 * MaxNoOfTables`; ou seja, há uma Subscription por tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para cada um dos dois MySQL Servers (um atuando como Source de Replicação e o outro como Replica). Cada Subscriber usa 16 bytes de memória.

  Ao usar Replicação circular, Replicação multi-Source e outras configurações de Replicação envolvendo mais de 2 MySQL Servers, você deve aumentar este parâmetro para o número de processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") incluídos na Replicação (isso é frequentemente, mas nem sempre, o mesmo que o número de Clusters). Por exemplo, se você tiver uma configuração de Replicação circular usando três NDB Clusters, com um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") anexado a cada Cluster, e cada um desses processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") atua como Source e como Replica, você deve definir [`MaxNoOfSubscribers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscribers) igual a `3 * MaxNoOfTables`.

  Para mais informações, consulte [Seção 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication").

* [`MaxNoOfConcurrentSubOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentsuboperations)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define um teto para o número de operações que podem ser realizadas por todos os API Nodes no Cluster ao mesmo tempo. O valor padrão (256) é suficiente para operações normais e pode precisar ser ajustado apenas em cenários onde há um grande número de API Nodes, cada um realizando um alto volume de operações concorrentemente.

**Parâmetros Booleanos.** O comportamento dos Data Nodes também é afetado por um conjunto de parâmetros `[ndbd]` que aceitam valores booleanos. Estes parâmetros podem ser especificados como `TRUE` definindo-os iguais a `1` ou `Y`, e como `FALSE` definindo-os iguais a `0` ou `N`.

* [`CompressedLCP`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedlcp)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Definir este parâmetro como `1` faz com que os arquivos de Local Checkpoint sejam comprimidos. A compressão usada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no Data Node para armazenar arquivos de Checkpoint não comprimidos. LCPs comprimidos podem ser habilitados para Data Nodes individuais ou para todos os Data Nodes (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

  Importante

  Você não pode restaurar um Local Checkpoint comprimido para um Cluster executando uma versão do MySQL que não suporte este recurso.

  O valor padrão é `0` (desabilitado).

  Em plataformas Windows, este parâmetro não tem efeito no NDB 7.5 ou NDB 7.6.

* [`CrashOnCorruptedTuple`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-crashoncorruptedtuple)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando este parâmetro está habilitado, ele força um Data Node a desligar sempre que encontra uma tupla corrompida. No NDB 7.5, ele é habilitado por padrão.

* [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  É possível especificar tabelas NDB Cluster como Diskless (sem disco), o que significa que as tabelas não são Checkpointadas para disco e que nenhum logging ocorre. Tais tabelas existem apenas na memória principal. Uma consequência do uso de tabelas Diskless é que nem as tabelas nem os registros nessas tabelas sobrevivem a uma falha. No entanto, ao operar no modo Diskless, é possível executar [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") em um computador sem disco.

  Importante

  Este recurso faz com que o *Cluster inteiro* opere no modo Diskless.

  Quando este recurso está habilitado, o Backup online do Cluster é desabilitado. Além disso, um Start parcial do Cluster não é possível.

  [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless) está desabilitado por padrão.

* [`LateAlloc`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-latealloc)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Aloca memória para este Data Node após o estabelecimento de uma conexão com o servidor de gerenciamento. Habilitado por padrão.

* [`LockPagesInMainMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockpagesinmainmemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para vários sistemas operacionais, incluindo Solaris e Linux, é possível bloquear um processo na memória e, assim, evitar qualquer swapping para disco. Isso pode ser usado para ajudar a garantir as características de tempo real do Cluster.

  Este parâmetro aceita um dos valores inteiros `0`, `1` ou `2`, que agem conforme mostrado na lista a seguir:

  + `0`: Desabilita o Lock. Este é o valor padrão.

  + `1`: Realiza o Lock após alocar memória para o processo.

  + `2`: Realiza o Lock antes que a memória para o processo seja alocada.

  Se o sistema operacional não estiver configurado para permitir que usuários sem privilégios bloqueiem páginas, o processo do Data Node que faz uso deste parâmetro pode ter que ser executado como root do sistema. ([`LockPagesInMainMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockpagesinmainmemory) usa a função `mlockall`. A partir do kernel Linux 2.6.9, usuários sem privilégios podem bloquear memória conforme limitado por `max locked memory`. Para mais informações, consulte **ulimit -l** e <http://linux.die.net/man/2/mlock>).

  Note

  Em versões mais antigas do NDB Cluster, este parâmetro era Booleano. `0` ou `false` era a configuração padrão e desabilitava o Lock. `1` ou `true` habilitava o Lock do processo após sua memória ser alocada. O NDB Cluster 7.5 trata `true` ou `false` para o valor deste parâmetro como um erro.

  Importante

  A partir do `glibc` 2.10, o `glibc` usa arenas por Thread para reduzir a contenção de Lock em um Pool compartilhado, que consome memória real. Em geral, um processo de Data Node não precisa de arenas por Thread, uma vez que não realiza nenhuma alocação de memória após a inicialização. (Esta diferença nos alocadores não parece afetar significativamente o desempenho.)

  O comportamento do `glibc` destina-se a ser configurável através da variável de ambiente `MALLOC_ARENA_MAX`, mas um bug neste mecanismo antes do `glibc` 2.16 significava que esta variável não podia ser definida para menos de 8, de modo que a memória desperdiçada não podia ser recuperada. (Bug #15907219; consulte também <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> para mais informações sobre este problema.)

  Uma possível solução alternativa para este problema é usar a variável de ambiente `LD_PRELOAD` para pré-carregar uma biblioteca de alocação de memória `jemalloc` para tomar o lugar da fornecida com `glibc`.

* [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Habilitar este parâmetro faz com que o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tente usar escritas `O_DIRECT` para LCP, Backups e REDO logs, geralmente diminuindo o uso de **kswapd** e CPU. Ao usar o NDB Cluster no Linux, habilite [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) se você estiver usando um kernel 2.6 ou posterior.

  [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) está desabilitado por padrão.

* [`ODirectSyncFlag`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirectsyncflag)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando este parâmetro está habilitado, as escritas de REDO log são realizadas de modo que cada escrita concluída do sistema de arquivos seja tratada como uma chamada para `fsync`. A configuração para este parâmetro é ignorada se pelo menos uma das seguintes condições for verdadeira:

  + [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) não está habilitado.

  + `InitFragmentLogFiles` está definido como `SPARSE`.

  Desabilitado por padrão.

* [`RestartOnErrorInsert`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-restartonerrorinsert)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este recurso é acessível apenas ao construir a versão de debug, onde é possível inserir erros na execução de blocos individuais de código como parte do teste.

  Este recurso está desabilitado por padrão.

* [`StopOnError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stoponerror)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica se um processo de Data Node deve sair ou realizar um Restart automático quando uma condição de erro é encontrada.

  O valor padrão deste parâmetro é 1; isso significa que, por padrão, um erro faz com que o processo do Data Node pare.

  Quando um erro é encontrado e `StopOnError` é 0, o processo do Data Node é reiniciado.

  Antes do NDB Cluster 7.5.5, se o processo do Data Node sair de forma descontrolada (devido, por exemplo, à execução de [**kill -9**](kill.html "13.7.6.4 KILL Statement") no processo do Data Node enquanto realiza uma Query, ou a uma falha de segmentação), e `StopOnError` for definido como 0, o processo angel tenta reiniciá-lo exatamente da mesma maneira que foi iniciado anteriormente — ou seja, usando as mesmas opções de inicialização que foram empregadas na última vez que o Node foi iniciado. Assim, se o processo do Data Node foi originalmente iniciado usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), ele também é reiniciado com `--initial`. Isso significa que, em tais casos, se a falha ocorrer em um número suficiente de Data Nodes em um intervalo muito curto, o efeito é o mesmo que se você tivesse realizado um Restart inicial de todo o Cluster, levando à perda de todos os dados. Este problema foi resolvido no NDB Cluster 7.5.5 e em lançamentos posteriores do NDB 7.5 (Bug #83510, Bug #24945638).

  Usuários do MySQL Cluster Manager devem notar que, quando `StopOnError` é igual a 1, isso impede que o agente do MySQL Cluster Manager reinicie quaisquer Data Nodes depois de realizar seu próprio Restart e recuperação. Consulte [Iniciando e Parando o Agente no Linux](/doc/mysql-cluster-manager/1.4/en/mcm-using-start-stop-agent-linux.html), para mais informações.

* [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Usa conexões de Shared Memory entre este Data Node e o API Node também em execução neste host. Defina como 1 para habilitar.

  Consulte [Seção 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), para mais informações.

##### Controlando Timeouts, Intervalos e Paging de Disco

Há vários parâmetros `[ndbd]` que especificam Timeouts e intervalos entre várias ações nos Data Nodes do Cluster. A maioria dos valores de Timeout é especificada em milissegundos. Quaisquer exceções a isso são mencionadas onde aplicável.

* [`TimeBetweenWatchDogCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheck)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para evitar que o Thread principal fique preso em um Loop infinito em algum momento, um Thread "watchdog" verifica o Thread principal. Este parâmetro especifica o número de milissegundos entre as verificações. Se o processo permanecer no mesmo estado após três verificações, o Thread watchdog o encerra.

  Este parâmetro pode ser facilmente alterado para fins de experimentação ou para se adaptar a condições locais. Ele pode ser especificado por Node, embora pareça haver pouca razão para fazê-lo.

  O Timeout padrão é de 6000 milissegundos (6 segundos).

* [`TimeBetweenWatchDogCheckInitial`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheckinitial)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Isto é semelhante ao parâmetro [`TimeBetweenWatchDogCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheck), exceto que [`TimeBetweenWatchDogCheckInitial`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheckinitial) controla a quantidade de tempo que passa entre as verificações de execução dentro de um Storage Node nas fases iniciais de Start, durante as quais a memória é alocada.

  O Timeout padrão é de 6000 milissegundos (6 segundos).

* [`StartPartialTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartialtimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica por quanto tempo o Cluster espera que todos os Data Nodes subam antes que a rotina de inicialização do Cluster seja invocada. Este Timeout é usado para evitar um Start parcial do Cluster sempre que possível.

  Este parâmetro é anulado ao realizar um Start inicial ou Restart inicial do Cluster.

  O valor padrão é 30000 milissegundos (30 segundos). 0 desabilita o Timeout, caso em que o Cluster pode iniciar apenas se todos os Nodes estiverem disponíveis.

* [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Se o Cluster estiver pronto para iniciar após esperar por [`StartPartialTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartialtimeout) milissegundos, mas ainda estiver possivelmente em um estado particionado, o Cluster espera até que este Timeout também tenha passado. Se [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout) for definido como 0, o Cluster espera indefinidamente (232−1 ms, ou aproximadamente 49.71 dias).

  Este parâmetro é anulado ao realizar um Start inicial ou Restart inicial do Cluster.

  O valor padrão no NDB 7.6 é 0; anteriormente era 60000 (60 segundos).

* [`StartFailureTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailuretimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Se um Data Node não tiver concluído sua sequência de Start dentro do tempo especificado por este parâmetro, o Start do Node falha. Definir este parâmetro como 0 (o valor padrão) significa que nenhum Timeout de Data Node é aplicado.

  Para valores não zero, este parâmetro é medido em milissegundos. Para Data Nodes contendo quantidades extremamente grandes de dados, este parâmetro deve ser aumentado. Por exemplo, no caso de um Data Node contendo vários gigabytes de dados, um período de 10 a 15 minutos (ou seja, 600000 a 1000000 milissegundos) pode ser necessário para realizar um Node Restart.

* [`StartNoNodeGroupTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startnonodegrouptimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando um Data Node é configurado com [`Nodegroup = 65536`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup), é considerado como não estando atribuído a nenhum Node Group. Quando isso é feito, o Cluster espera `StartNoNodegroupTimeout` milissegundos, então trata tais Nodes como se tivessem sido adicionados à lista passada para a opção [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes) e inicia. O valor padrão é `15000` (ou seja, o servidor de gerenciamento espera 15 segundos). Definir este parâmetro igual a `0` significa que o Cluster espera indefinidamente.

  `StartNoNodegroupTimeout` deve ser o mesmo para todos os Data Nodes no Cluster; por esta razão, você deve sempre defini-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para Data Nodes individuais.

  Consulte [Seção 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online"), para mais informações.

* [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Um dos principais métodos para descobrir Nodes com falha é pelo uso de Heartbeats. Este parâmetro declara a frequência com que os sinais de Heartbeat são enviados e a frequência com que se espera recebê-los. Heartbeats não podem ser desabilitados.

  Após perder quatro intervalos de Heartbeat seguidos, o Node é declarado morto. Assim, o tempo máximo para descobrir uma falha através do mecanismo de Heartbeat é cinco vezes o intervalo de Heartbeat.

  O intervalo de Heartbeat padrão é de 5000 milissegundos (5 segundos). Este parâmetro não deve ser alterado drasticamente e não deve variar muito entre os Nodes. Se um Node usar 5000 milissegundos e o Node que o observa usar 1000 milissegundos, obviamente o Node é declarado morto muito rapidamente. Este parâmetro pode ser alterado durante um Upgrade de software online, mas apenas em pequenos incrementos.

  Consulte também [Comunicação de rede e latência](mysql-cluster-overview-requirements.html#mysql-cluster-network-latency-issues "Network communication and latency"), bem como a descrição do parâmetro de configuração [`ConnectCheckIntervalDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-connectcheckintervaldelay).

* [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node NoOfReplicas" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>integer</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 2</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do Cluster, limpeza e restauração do sistema de arquivos do Cluster a partir de um backup, e então a reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada Data Node envia sinais de Heartbeat para cada MySQL Server (SQL Node) para garantir que ele permaneça em contato. Se um MySQL Server não enviar um Heartbeat a tempo, ele é declarado "morto", caso em que todas as Transactions em andamento são concluídas e todos os recursos liberados. O SQL Node não pode reconectar até que todas as atividades iniciadas pela instância MySQL anterior tenham sido concluídas. O critério de três Heartbeats para esta determinação é o mesmo descrito para [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb).

  O intervalo padrão é de 1500 milissegundos (1.5 segundos). Este intervalo pode variar entre Data Nodes individuais porque cada Data Node observa os MySQL Servers conectados a ele, independentemente de todos os outros Data Nodes.

  Para mais informações, consulte [Comunicação de rede e latência](mysql-cluster-overview-requirements.html#mysql-cluster-network-latency-issues "Network communication and latency").

* [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os Data Nodes enviam Heartbeats uns para os outros de forma circular, onde cada Data Node monitora o anterior. Se um Heartbeat não for detectado por um determinado Data Node, este Node declara o Data Node anterior no círculo "morto" (ou seja, não mais acessível pelo Cluster). A determinação de que um Data Node está morto é feita globalmente; em outras palavras; uma vez que um Data Node é declarado morto, ele é considerado como tal por todos os Nodes no Cluster.

  É possível que os Heartbeats entre Data Nodes que residem em Hosts diferentes sejam muito lentos em comparação com os Heartbeats entre outros pares de Nodes (por exemplo, devido a um intervalo de Heartbeat muito baixo ou problema temporário de conexão), de modo que um Data Node é declarado morto, embora o Node ainda possa funcionar como parte do Cluster.

  Neste tipo de situação, pode ser que a ordem em que os Heartbeats são transmitidos entre Data Nodes faça uma diferença quanto a se um determinado Data Node é declarado morto ou não. Se esta declaração ocorrer desnecessariamente, isso pode, por sua vez, levar à perda desnecessária de um Node Group e, assim, a uma falha do Cluster.

  Considere uma configuração onde há 4 Data Nodes A, B, C e D executando em 2 computadores host `host1` e `host2`, e que estes Data Nodes compõem 2 Node Groups, conforme mostrado na seguinte tabela:

  **Tabela 21.9 Quatro Data Nodes A, B, C, D executando em dois computadores host host1, host2; cada Data Node pertence a um de dois Node Groups.**

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Suponha que os Heartbeats sejam transmitidos na ordem A->B->C->D->A. Neste caso, a perda do Heartbeat entre os Hosts faz com que o Node B declare o Node A morto e o Node C declare o Node B morto. Isso resulta na perda do Node Group 0 e, portanto, o Cluster falha. Por outro lado, se a ordem de transmissão for A->B->D->C->A (e todas as outras condições permanecerem como indicado anteriormente), a perda do Heartbeat faz com que os Nodes A e D sejam declarados mortos; neste caso, cada Node Group tem um Node sobrevivente, e o Cluster sobrevive.

  O parâmetro de configuração [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) torna a ordem de transmissão de Heartbeat configurável pelo usuário. O valor padrão para [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) é zero; permitir que o valor padrão seja usado em todos os Data Nodes faz com que a ordem de transmissão de Heartbeat seja determinada pelo `NDB`. Se este parâmetro for usado, ele deve ser definido para um valor não zero (máximo 65535) para cada Data Node no Cluster, e este valor deve ser exclusivo para cada Data Node; isso faz com que a transmissão de Heartbeat prossiga de Data Node para Data Node na ordem de seus valores [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) do mais baixo para o mais alto (e então diretamente do Data Node com o [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) mais alto para o Data Node com o valor mais baixo, para completar o círculo). Os valores não precisam ser consecutivos. Por exemplo, para forçar a ordem de transmissão de Heartbeat A->B->D->C->A no cenário descrito anteriormente, você pode definir os valores [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) conforme mostrado aqui:

  **Tabela 21.10 Valores de HeartbeatOrder para forçar uma ordem de transição de Heartbeat de A->B->D->C->A.**

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para usar este parâmetro para alterar a ordem de transmissão de Heartbeat em um NDB Cluster em execução, você deve primeiro definir [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) para cada Data Node no Cluster no arquivo (ou arquivos) de configuração global (`config.ini`). Para fazer com que a mudança entre em vigor, você deve realizar o seguinte:

  + Um desligamento completo e Restart de todo o Cluster.
  + 2 rolling restarts do Cluster em sucessão. *Todos os Nodes devem ser reiniciados na mesma ordem em ambos os rolling restarts*.

  Você pode usar [`DUMP 908`](/doc/ndb-internals/en/dump-command-908.html) para observar o efeito deste parâmetro nos logs do Data Node.

* [`ConnectCheckIntervalDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-connectcheckintervaldelay)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro habilita a verificação de conexão entre Data Nodes depois que um deles falhou nas verificações de Heartbeat por 5 intervalos de até [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb) milissegundos.

  Tal Data Node que falhar ainda mais em responder dentro de um intervalo de `ConnectCheckIntervalDelay` milissegundos é considerado suspeito e é considerado morto após dois desses intervalos. Isso pode ser útil em configurações com problemas de latência conhecidos.

  O valor padrão para este parâmetro é 0 (desabilitado).

* [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é uma exceção, pois não especifica um tempo de espera antes de iniciar um novo Local Checkpoint; em vez disso, é usado para garantir que Local Checkpoints não sejam realizados em um Cluster onde relativamente poucos Updates estão ocorrendo. Na maioria dos Clusters com altas taxas de Update, é provável que um novo Local Checkpoint seja iniciado imediatamente após o anterior ter sido concluído.

  O tamanho de todas as operações de escrita executadas desde o início do Local Checkpoint anterior é adicionado. Este parâmetro também é excepcional, pois é especificado como o logaritmo de base 2 do número de palavras de 4 bytes, de modo que o valor padrão 20 significa 4MB (4 × 2^20) de operações de escrita, 21 significaria 8MB e assim por diante até um valor máximo de 31, que equivale a 8GB de operações de escrita.

  Todas as operações de escrita no Cluster são somadas. Definir [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints) para 6 ou menos significa que os Local Checkpoints são executados continuamente sem pausa, independentemente da carga de trabalho do Cluster.

* [`TimeBetweenGlobalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpoints)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando uma Transaction é commitada, ela é commitada na memória principal em todos os Nodes nos quais os dados são espelhados. No entanto, os registros de log de Transaction não são descarregados para o disco como parte do Commit. O raciocínio por trás deste comportamento é que ter a Transaction commitada com segurança em pelo menos duas máquinas host autônomas deve atender aos padrões razoáveis de durabilidade.

  Também é importante garantir que até mesmo o pior dos casos — uma falha completa do Cluster — seja tratado adequadamente. Para garantir que isso aconteça, todas as Transactions que ocorrem dentro de um determinado intervalo são colocadas em um Global Checkpoint, que pode ser considerado como um conjunto de Transactions commitadas que foi descarregado para o disco. Em outras palavras, como parte do processo de Commit, uma Transaction é colocada em um grupo de Global Checkpoint. Mais tarde, os registros de log deste grupo são descarregados para o disco, e então todo o grupo de Transactions é commitado com segurança para o disco em todos os computadores no Cluster.

  Este parâmetro define o intervalo entre Global Checkpoints. O padrão é 2000 milissegundos.

* [`TimeBetweenGlobalCheckpointsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpointstimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define o Timeout mínimo entre Global Checkpoints. O padrão é 120000 milissegundos.

* [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define o intervalo entre épocas de sincronização para a Replicação do NDB Cluster. O valor padrão é 100 milissegundos.

  [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs) faz parte da implementação de “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação do NDB Cluster.

* [`TimeBetweenEpochsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochstimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro define um Timeout para épocas de sincronização para a Replicação do NDB Cluster. Se um Node não participar de um Global Checkpoint dentro do tempo determinado por este parâmetro, o Node é desligado. O valor padrão é 0; em outras palavras, o Timeout está desabilitado.

  [`TimeBetweenEpochsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochstimeout) faz parte da implementação de “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação do NDB Cluster.

  O valor atual deste parâmetro e um aviso são escritos no log do Cluster sempre que um salvamento GCP leva mais de 1 minuto ou um Commit GCP leva mais de 10 segundos.

  Definir este parâmetro como zero tem o efeito de desabilitar as paradas GCP causadas por Timeouts de salvamento, Timeouts de Commit, ou ambos. O valor máximo possível para este parâmetro é 256000 milissegundos.

* [`MaxBufferedEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxbufferedepochs)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O número de épocas não processadas pelas quais um Node Subscritor pode ficar para trás. Exceder este número faz com que um Subscritor atrasado seja desconectado.

  O valor padrão de 100 é suficiente para a maioria das operações normais. Se um Node Subscritor ficar para trás o suficiente para causar desconexões, geralmente é devido a problemas de rede ou agendamento em relação a processos ou Threads. (Em raras circunstâncias, o problema pode ser devido a um bug no cliente [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").) Pode ser desejável definir o valor mais baixo do que o padrão quando as épocas são mais longas.

  A desconexão evita que problemas do cliente afetem o serviço do Data Node, esgotando a memória para Buffering de dados e, eventualmente, desligando. Em vez disso, apenas o cliente é afetado como resultado da desconexão (por, por exemplo, eventos de gap no Binary Log), forçando o cliente a reconectar ou reiniciar o processo.

* [`MaxBufferedEpochBytes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxbufferedepochbytes)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O número total de bytes alocados para Buffering de épocas por este Node.

* [`TimeBetweenInactiveTransactionAbortCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweeninactivetransactionabortcheck)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O tratamento de Timeout é realizado verificando um Timer em cada Transaction uma vez para cada intervalo especificado por este parâmetro. Assim, se este parâmetro for definido como 1000 milissegundos, cada Transaction é verificada quanto ao Timeout uma vez por segundo.

  O valor padrão é 1000 milissegundos (1 segundo).

* [`TransactionInactiveTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactioninactivetimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro declara o tempo máximo permitido de lapso entre operações na mesma Transaction antes que a Transaction seja abortada.

  O padrão para este parâmetro é `4G` (também o máximo). Para um Database em tempo real que precisa garantir que nenhuma Transaction mantenha Locks por muito tempo, este parâmetro deve ser definido para um valor relativamente pequeno. Defini-lo como 0 significa que a aplicação nunca atinge Timeout. A unidade é milissegundos.

* [`TransactionDeadlockDetectionTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactiondeadlockdetectiontimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando um Node executa uma Query envolvendo uma Transaction, o Node espera que os outros Nodes no Cluster respondam antes de continuar. Este parâmetro define a quantidade de tempo que a Transaction pode gastar executando dentro de um Data Node, ou seja, o tempo que o coordenador de Transaction espera que cada Data Node participante na Transaction execute uma solicitação.

  Uma falha em responder pode ocorrer por qualquer um dos seguintes motivos:

  + O Node está "morto"
  + A operação entrou em uma fila de Lock
  + O Node solicitado a realizar a ação pode estar muito sobrecarregado.

  Este parâmetro de Timeout declara por quanto tempo o coordenador de Transaction espera pela execução da Query por outro Node antes de abortar a Transaction, e é importante para o tratamento de falhas de Node e detecção de Deadlock.

  O valor de Timeout padrão é de 1200 milissegundos (1.2 segundos).

  O mínimo para este parâmetro é 50 milissegundos.

* [`DiskSyncSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-disksyncsize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este é o número máximo de bytes a serem armazenados antes de descarregar dados para um arquivo de Local Checkpoint. Isso é feito para evitar o Buffering de escrita, que pode impedir o desempenho significativamente. Este parâmetro *não* se destina a tomar o lugar de [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints).

  Note

  Quando [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) está habilitado, não é necessário definir [`DiskSyncSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-disksyncsize); na verdade, em tais casos, seu valor é simplesmente ignorado.

  O valor padrão é 4M (4 megabytes).

* [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a taxa máxima para escrita em disco, em bytes por segundo, por Local Checkpoints e operações de Backup quando nenhum Restart (por este Data Node ou qualquer outro Data Node) está ocorrendo neste NDB Cluster.

  Para definir a taxa máxima de escritas em disco permitida enquanto este Data Node está reiniciando, use [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart). Para definir a taxa máxima de escritas em disco permitida enquanto outros Data Nodes estão reiniciando, use [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). A velocidade mínima para escritas em disco por todos os LCPs e operações de Backup pode ser ajustada definindo [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a taxa máxima para escrita em disco, em bytes por segundo, por Local Checkpoints e operações de Backup quando um ou mais Data Nodes neste NDB Cluster estão reiniciando, exceto este Node.

  Para definir a taxa máxima de escritas em disco permitida enquanto este Data Node está reiniciando, use [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart). Para definir a taxa máxima de escritas em disco permitida quando nenhum Data Node está reiniciando em qualquer lugar no Cluster, use [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). A velocidade mínima para escritas em disco por todos os LCPs e operações de Backup pode ser ajustada definindo [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a taxa máxima para escrita em disco, em bytes por segundo, por Local Checkpoints e operações de Backup enquanto este Data Node está reiniciando.

  Para definir a taxa máxima de escritas em disco permitida enquanto outros Data Nodes estão reiniciando, use [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). Para definir a taxa máxima de escritas em disco permitida quando nenhum Data Node está reiniciando em qualquer lugar no Cluster, use [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). A velocidade mínima para escritas em disco por todos os LCPs e operações de Backup pode ser ajustada definindo [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a taxa mínima para escrita em disco, em bytes por segundo, por Local Checkpoints e operações de Backup.

  As taxas máximas de escritas em disco permitidas para LCPs e Backups sob várias condições são ajustáveis usando os parâmetros [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed), [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart) e [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). Consulte as descrições destes parâmetros para mais informações.

* [`ApiFailureHandlingTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-apifailurehandlingtimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node FileSystemPath" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Especifica o tempo máximo (em segundos) que o Data Node espera que o tratamento de falha do API Node seja concluído antes de escalá-lo para o tratamento de falha do Data Node.

  Adicionado no NDB 7.6.34.

* [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica por quanto tempo os Data Nodes esperam por uma resposta do árbitro a uma mensagem de Arbitration. Se isso for excedido, presume-se que a rede se dividiu.

  O valor padrão é 7500 milissegundos (7.5 segundos).

* [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O parâmetro [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) permite uma escolha de esquemas de Arbitration, correspondendo a um dos 3 valores possíveis para este parâmetro:

  + **Default.** Isso permite que o Arbitration prossiga normalmente, conforme determinado pelas configurações de `ArbitrationRank` para os Nodes de gerenciamento e API. Este é o valor padrão.

  + **Disabled.** Definir `Arbitration = Disabled` na seção `[ndbd default]` do arquivo `config.ini` realiza a mesma tarefa que definir `ArbitrationRank` para 0 em todos os Nodes de gerenciamento e API. Quando `Arbitration` é definido desta forma, quaisquer configurações de `ArbitrationRank` são ignoradas.

  + **WaitExternal.** O parâmetro [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) também torna possível configurar o Arbitration de tal forma que o Cluster espere até que o tempo determinado por [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout) tenha passado para que uma aplicação de gerenciamento de Cluster externa realize o Arbitration em vez de lidar com o Arbitration internamente. Isso pode ser feito definindo `Arbitration = WaitExternal` na seção `[ndbd default]` do arquivo `config.ini`. Para obter melhores resultados com a configuração `WaitExternal`, é recomendável que [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout) seja 2 vezes mais longo do que o intervalo exigido pelo gerenciador de Cluster externo para realizar o Arbitration.

  Importante

  Este parâmetro deve ser usado apenas na seção `[ndbd default]` do arquivo de configuração do Cluster. O comportamento do Cluster é não especificado quando [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) é definido para valores diferentes para Data Nodes individuais.

* [`RestartSubscriberConnectTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-restartsubscriberconnecttimeout)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro determina o tempo que um Data Node espera que os API Nodes Subscritores se conectem. Uma vez que este Timeout expire, quaisquer API Nodes "ausentes" são desconectados do Cluster. Para desabilitar este Timeout, defina `RestartSubscriberConnectTimeout` como 0.

  Embora este parâmetro seja especificado em milissegundos, o Timeout em si é resolvido para o próximo segundo inteiro maior.

O intervalo de Heartbeat entre Management Nodes e Data Nodes é sempre de 100 milissegundos e não é configurável.

**Buffering e Logging.** Vários parâmetros de configuração `[ndbd]` permitem que o usuário avançado tenha mais controle sobre os recursos usados pelos processos do Node e ajuste vários tamanhos de Buffer conforme a necessidade.

Estes Buffers são usados como Front Ends para o sistema de arquivos ao escrever registros de log em disco. Se o Node estiver em execução no modo Diskless, estes parâmetros podem ser definidos para seus valores mínimos sem penalidade devido ao fato de que as escritas em disco são "falsificadas" pela camada de abstração do sistema de arquivos do Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* [`UndoIndexBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-undoindexbuffer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro definia anteriormente o tamanho do Buffer de Undo Index, mas não tem efeito nas versões atuais do NDB Cluster.

* [`UndoDataBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-undodatabuffer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro definia anteriormente o tamanho do Buffer de Undo Data, mas não tem efeito nas versões atuais do NDB Cluster.

* [`RedoBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redobuffer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Todas as atividades de Update também precisam ser logadas. O REDO log torna possível reproduzir estes Updates sempre que o sistema é reiniciado. O algoritmo de recuperação NDB usa um Checkpoint "fuzzy" dos dados juntamente com o UNDO log e, em seguida, aplica o REDO log para reproduzir todas as alterações até o ponto de restauração.

  `RedoBuffer` define o tamanho do Buffer no qual o REDO log é escrito. O valor padrão é 32MB; o valor mínimo é 1MB.

  Se este Buffer for muito pequeno, o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") emitirá o código de erro 1221 (REDO log buffers overloaded). Por esta razão, você deve ter cuidado se tentar diminuir o valor de `RedoBuffer` como parte de uma alteração online na configuração do Cluster.

  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") aloca um Buffer separado para cada Thread LDM (consulte [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)). Por exemplo, com 4 Threads LDM, um Data Node [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") na verdade tem 4 Buffers e aloca `RedoBuffer` bytes para cada um, para um total de `4 * RedoBuffer` bytes.

* [`EventLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-eventlogbuffersize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Controla o tamanho do Buffer circular usado para eventos de Log do NDB dentro dos Data Nodes.

**Controlando mensagens de log.** Ao gerenciar o Cluster, é muito importante poder controlar o número de mensagens de Log enviadas para vários tipos de eventos para `stdout`. Para cada categoria de evento, existem 16 níveis de evento possíveis (numerados de 0 a 15). Definir o relato de eventos para uma determinada categoria de evento para o nível 15 significa que todos os relatórios de eventos nessa categoria são enviados para `stdout`; defini-lo para 0 significa que não há relatórios de eventos feitos nessa categoria.

Por padrão, apenas a mensagem de Start é enviada para `stdout`, com os padrões de nível de relato de eventos restantes definidos como 0. A razão para isso é que essas mensagens também são enviadas para o Cluster Log do servidor de gerenciamento.

Um conjunto análogo de níveis pode ser definido para o cliente de gerenciamento para determinar quais níveis de evento registrar no Cluster Log.

* [`LogLevelStartup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelstartup)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados durante o Start do processo.

  O nível padrão é 1.

* [`LogLevelShutdown`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelshutdown)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados como parte do desligamento gracioso de um Node.

  O nível padrão é 0.

* [`LogLevelStatistic`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelstatistic)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node BackupDataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>path</td> </tr><tr> <th>Padrão</th> <td>FileSystemPath</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício Inicial do Node: </strong></span>Requer um rolling restart do Cluster; cada Data Node deve ser reiniciado com <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos estatísticos, como número de leituras de Primary Key, número de Updates, número de Inserções, informações relacionadas ao uso de Buffer e assim por diante.

  O nível padrão é 0.

* [`LogLevelCheckpoint`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelcheckpoint)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados por Local e Global Checkpoints.

  O nível padrão é 0.

* [`LogLevelNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelnoderestart)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados durante o Restart do Node.

  O nível padrão é 0.

* [`LogLevelConnection`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelconnection)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados por conexões entre Nodes do Cluster.

  O nível padrão é 0.

* [`LogLevelError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelerror)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados por erros e avisos pelo Cluster como um todo. Estes erros não causam nenhuma falha de Node, mas ainda são considerados dignos de relato.

  O nível padrão é 0.

* [`LogLevelCongestion`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelcongestion)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados por Congestion. Estes erros não causam falha de Node, mas ainda são considerados dignos de relato.

  O nível padrão é 0.

* [`LogLevelInfo`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelinfo)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O nível de relato para eventos gerados para informações sobre o estado geral do Cluster.

  O nível padrão é 0.

* [`MemReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-memreportfrequency)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro controla a frequência com que os relatórios de uso de memória do Data Node são registrados no Cluster Log; é um valor inteiro que representa o número de segundos entre os relatórios.

  O uso de Data Memory e Index Memory de cada Data Node é registrado como uma porcentagem e um número de páginas de 32 KB de [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e (NDB 7.5 e anteriores) [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), respectivamente, definidos no arquivo `config.ini`. Por exemplo, se [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) for igual a 100 MB, e um determinado Data Node estiver usando 50 MB para armazenamento de Data Memory, a linha correspondente no Cluster Log pode ser assim:

  ```sql
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

  [`MemReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-memreportfrequency) não é um parâmetro obrigatório. Se usado, pode ser definido para todos os Data Nodes do Cluster na seção `[ndbd default]` de `config.ini` e também pode ser definido ou anulado para Data Nodes individuais nas seções `[ndbd]` correspondentes do arquivo de configuração. O valor mínimo — que também é o valor padrão — é 0, caso em que os relatórios de memória são registrados apenas quando o uso de memória atinge certas porcentagens (80%, 90% e 100%), conforme mencionado na discussão de eventos de estatísticas na [Seção 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events").

* [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando um Data Node é iniciado com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), ele inicializa o arquivo de REDO log durante a Fase 4 do Start (consulte [Seção 21.6.4, “Summary of NDB Cluster Start Phases”](mysql-cluster-start-phases.html "21.6.4 Summary of NDB Cluster Start Phases")). Quando valores muito grandes são definidos para [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles), [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize) ou ambos, esta inicialização pode levar muito tempo. Você pode forçar que relatórios sobre o progresso deste processo sejam registrados periodicamente, por meio do parâmetro de configuração [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency). Neste caso, o progresso é relatado no Cluster Log, em termos do número de arquivos e da quantidade de espaço que foram inicializados, conforme mostrado aqui:

  ```sql
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

  Estes relatórios são registrados a cada [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency) segundos durante a Fase 4 do Start. Se [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency) for 0 (o padrão), os relatórios são escritos no Cluster Log apenas no início e na conclusão do processo de inicialização do arquivo de REDO log.

##### Parâmetros de Debugging do Data Node

Os seguintes parâmetros destinam-se ao uso durante o teste ou Debugging de Data Nodes, e não para uso em produção.

* [`DictTrace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-dicttrace)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  É possível causar o logging de traces para eventos gerados pela criação e exclusão de tabelas usando `DictTrace`. Este parâmetro é útil apenas no Debugging do código kernel NDB. `DictTrace` aceita um valor inteiro. 0 desabilita o logging; 1 o habilita; definir este parâmetro para 2 habilita o logging de saída de Debugging adicional do [`DBDICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html) (Bug #20368450).

* [`WatchDogImmediateKill`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-watchdogimmediatekill)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  No NDB 7.6.7 e posterior, você pode fazer com que os Threads sejam encerrados imediatamente sempre que ocorrerem problemas de Watchdog, habilitando o parâmetro de configuração do Data Node `WatchDogImmediateKill`. Este parâmetro deve ser usado apenas ao depurar ou solucionar problemas, para obter arquivos de Trace que relatam exatamente o que estava ocorrendo no instante em que a execução cessou.

**Parâmetros de Backup.** Os parâmetros `[ndbd]` discutidos nesta seção definem Buffers de memória reservados para a execução de Backups online.

* [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Na criação de um Backup, existem dois Buffers usados para enviar dados para o disco. O Buffer de dados de Backup é usado para preencher dados registrados pelo Scan das tabelas de um Node. Uma vez que este Buffer tenha sido preenchido até o nível especificado como [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize), as páginas são enviadas para o disco. Ao descarregar dados para o disco, o processo de Backup pode continuar preenchendo este Buffer até ficar sem espaço. Quando isso acontece, o processo de Backup pausa o Scan e espera até que algumas escritas em disco tenham sido concluídas, liberando memória para que o Scan possa continuar.

* [`BackupDiskWriteSpeedPct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdiskwritespeedpct)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Durante a operação normal, os Data Nodes tentam maximizar a velocidade de escrita em disco usada para Local Checkpoints e Backups, permanecendo dentro dos limites definidos por [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed) e [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). O throttling de escrita em disco dá a cada Thread LDM uma parte igual do orçamento total. Isso permite que LCPs paralelos ocorram sem exceder o orçamento de I/O de disco. Como um Backup é executado por apenas um Thread LDM, isso efetivamente causava um corte de orçamento, resultando em tempos de conclusão de Backup mais longos e — se a taxa de alteração for suficientemente alta — em falha na conclusão do Backup quando a taxa de preenchimento do Buffer de log de Backup for maior do que a taxa de escrita alcançável.

  Este problema pode ser resolvido usando o parâmetro de configuração `BackupDiskWriteSpeedPct`, que aceita um valor no intervalo 0-90 (inclusive) que é interpretado como a porcentagem do orçamento de taxa de escrita máxima do Node que é reservada antes de compartilhar o restante do orçamento entre os Threads LDM para LCPs. O Thread LDM que executa o Backup recebe todo o orçamento de taxa de escrita para o Backup, mais sua parte (reduzida) do orçamento de taxa de escrita para Local Checkpoints. (Isso faz com que o orçamento de taxa de escrita em disco se comporte de forma semelhante a como era manipulado no NDB Cluster 7.3 e anteriores.)

  O valor padrão para este parâmetro é 50 (interpretado como 50%).

* [`BackupLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backuplogbuffersize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O Buffer de log de Backup cumpre um papel semelhante ao desempenhado pelo Buffer de dados de Backup, exceto que é usado para gerar um log de todas as escritas de tabela feitas durante a execução do Backup. Os mesmos princípios se aplicam para escrever estas páginas como com o Buffer de dados de Backup, exceto que quando não há mais espaço no Buffer de log de Backup, o Backup falha. Por esta razão, o tamanho do Buffer de log de Backup deve ser grande o suficiente para lidar com a carga causada pelas atividades de escrita enquanto o Backup está sendo feito. Consulte [Seção 21.6.8.3, “Configuration for NDB Cluster Backups”](mysql-cluster-backup-configuration.html "21.6.8.3 Configuration for NDB Cluster Backups").

  O valor padrão para este parâmetro deve ser suficiente para a maioria das aplicações. Na verdade, é mais provável que uma falha de Backup seja causada por velocidade de escrita em disco insuficiente do que pelo Buffer de log de Backup ficar cheio. Se o subsistema de disco não estiver configurado para a carga de escrita causada pelas aplicações, é improvável que o Cluster seja capaz de realizar as operações desejadas.

  É preferível configurar os Nodes do Cluster de forma que o processador se torne o gargalo em vez dos discos ou das conexões de rede.

  O valor padrão para este parâmetro é 16MB.

* [`BackupMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro está descontinuado e sujeito à remoção em uma versão futura do NDB Cluster. Qualquer configuração feita para ele é ignorada.

* [`BackupReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupreportfrequency)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro controla a frequência com que os relatórios de status de Backup são emitidos no cliente de gerenciamento durante um Backup, bem como a frequência com que tais relatórios são escritos no Cluster Log (desde que o logging de eventos do Cluster esteja configurado para permitir isso — consulte [Logging e Checkpointing](mysql-cluster-ndbd-definition.html#mysql-cluster-logging-and-checkpointing "Logging and checkpointing")). [`BackupReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupreportfrequency) representa o tempo em segundos entre os relatórios de status de Backup.

  O valor padrão é 0.

* [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o tamanho padrão das mensagens escritas em disco pelo log de Backup e pelos Buffers de dados de Backup.

  O valor padrão para este parâmetro é 256KB.

* [`BackupMaxWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmaxwritesize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o tamanho máximo das mensagens escritas em disco pelo log de Backup e pelos Buffers de dados de Backup.

  O valor padrão para este parâmetro é 1MB.

* [`CompressedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedbackup)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Habilitar este parâmetro faz com que os arquivos de Backup sejam comprimidos. A compressão usada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no Data Node para armazenar arquivos de Backup não comprimidos. Backups comprimidos podem ser habilitados para Data Nodes individuais ou para todos os Data Nodes (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

  Importante

  Você não pode restaurar um Backup comprimido para um Cluster executando uma versão do MySQL que não suporte este recurso.

  O valor padrão é `0` (desabilitado).

Note

A localização dos arquivos de Backup é determinada pelo parâmetro de configuração do Data Node [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir).

**Requisitos Adicionais.** Ao especificar estes parâmetros, as seguintes relações devem ser verdadeiras. Caso contrário, o Data Node não pode iniciar.

* `BackupDataBufferSize >= BackupWriteSize + 188KB`

* `BackupLogBufferSize >= BackupWriteSize + 16KB`

* `BackupMaxWriteSize >= BackupWriteSize`

##### Parâmetros de Desempenho em Tempo Real do NDB Cluster

Os parâmetros `[ndbd]` discutidos nesta seção são usados no agendamento e Lock de Threads para CPUs específicas em Hosts de Data Node multiprocessadores.

Note

Para usar estes parâmetros, o processo do Data Node deve ser executado como root do sistema.

* [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro determina o número de Threads a serem criados ao reconstruir Ordered Indexes durante um Start de sistema ou Node, bem como ao executar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes). Ele é suportado apenas quando há mais de um fragmento para a tabela por Data Node (por exemplo, quando `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` é usado com [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")).

  Definir este parâmetro como 0 (o padrão) desabilita a construção multi-Thread de Ordered Indexes.

  Este parâmetro é suportado ao usar [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)").

  Você pode habilitar construções multi-Thread durante Restarts iniciais de Data Node definindo o parâmetro de configuração do Data Node [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy) como `TRUE`.

* [`LockExecuteThreadToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockexecutethreadtocpu)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando usado com [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"), este parâmetro (agora uma string) especifica o ID da CPU atribuída para manipular o Thread de execução [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Quando usado com [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), o valor deste parâmetro é uma lista separada por vírgulas de IDs de CPU atribuídas para manipular os Threads de execução. Cada ID de CPU na lista deve ser um inteiro no intervalo de 0 a 65535 (inclusive).

  O número de IDs especificadas deve corresponder ao número de Threads de execução determinado por [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads). No entanto, não há garantia de que os Threads sejam atribuídos a CPUs em qualquer ordem específica ao usar este parâmetro. Você pode obter um controle mais refinado deste tipo usando [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig).

  [`LockExecuteThreadToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockexecutethreadtocpu) não tem valor padrão.

* [`LockMaintThreadsToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockmaintthreadstocpu)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o ID da CPU atribuída para manipular Threads de manutenção [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  O valor deste parâmetro é um inteiro no intervalo de 0 a 65535 (inclusive). *Não há valor padrão*.

* [`Numa`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-numa)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro determina se o Non-Uniform Memory Access (NUMA) é controlado pelo sistema operacional ou pelo processo do Data Node, independentemente de o Data Node usar [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). Por padrão, o `NDB` tenta usar uma política de alocação de memória NUMA entrelaçada (interleaved) em qualquer Data Node onde o sistema operacional host forneça suporte NUMA.

  Definir `Numa = 0` significa que o processo do Data Node não tenta definir uma política para alocação de memória e permite que este comportamento seja determinado pelo sistema operacional, que pode ser ainda mais orientado pela ferramenta separada **numactl**. Ou seja, `Numa = 0` produz o comportamento padrão do sistema, que pode ser customizado por **numactl**. Para muitos sistemas Linux, o comportamento padrão do sistema é alocar memória local do Socket para qualquer processo no momento da alocação. Isso pode ser problemático ao usar [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"); isso ocorre porque o **nbdmtd** aloca toda a memória no Start, levando a um desequilíbrio, dando diferentes velocidades de acesso para diferentes Sockets, especialmente ao bloquear páginas na memória principal.

  Definir `Numa = 1` significa que o processo do Data Node usa `libnuma` para solicitar alocação de memória entrelaçada. (Isso também pode ser realizado manualmente, no nível do sistema operacional, usando **numactl**.) Usar alocação entrelaçada, na verdade, diz ao processo do Data Node para ignorar o acesso à memória não uniforme, mas não tenta tirar proveito da memória local rápida; em vez disso, o processo do Data Node tenta evitar desequilíbrios devido à memória remota lenta. Se a alocação entrelaçada não for desejada, defina `Numa` como 0 para que o comportamento desejado possa ser determinado no nível do sistema operacional.

  O parâmetro de configuração `Numa` é suportado apenas em sistemas Linux onde `libnuma.so` está disponível.

* [`RealtimeScheduler`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-realtimescheduler)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Definir este parâmetro como 1 habilita o agendamento em tempo real dos Data Node Threads.

  O padrão é 0 (agendamento desabilitado).

* [`SchedulerExecutionTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerexecutiontimer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o tempo em microssegundos para que os Threads sejam executados no Scheduler antes de serem enviados. Defini-lo como 0 minimiza o tempo de resposta; para obter maior Throughput, você pode aumentar o valor à custa de tempos de resposta mais longos.

  O padrão é 50 μsec, o que nossos testes mostram aumentar ligeiramente o Throughput em casos de alta carga sem atrasar materialmente as solicitações.

* [`SchedulerResponsiveness`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerresponsiveness)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define o equilíbrio no Scheduler `NDB` entre velocidade e Throughput. Este parâmetro aceita um inteiro cujo valor está no intervalo de 0 a 10, inclusive, com 5 como padrão. Valores mais altos fornecem melhores tempos de resposta em relação ao Throughput. Valores mais baixos fornecem maior Throughput à custa de tempos de resposta mais longos.

* [`SchedulerSpinTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerspintimer)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro especifica o tempo em microssegundos para que os Threads sejam executados no Scheduler antes de dormirem.

  O valor padrão é 0.

* [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A construção multi-Thread de Ordered Indexes pode ser habilitada para Restarts iniciais de Data Nodes definindo este parâmetro de configuração como `true`, o que habilita a cópia de dados em duas passagens durante Restarts iniciais de Node. No NDB 7.6, este é o valor padrão (Bug #26704312, Bug #27109117).

  Você também deve definir [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) para um valor não zero.

**Parâmetros de Configuração de Multi-Threading (ndbmtd).** [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") é executado por padrão como um processo Single-Threaded e deve ser configurado para usar múltiplos Threads, usando um de dois métodos, ambos exigindo a definição de parâmetros de configuração no arquivo `config.ini`. O primeiro método é simplesmente definir um valor apropriado para o parâmetro de configuração [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads). Um segundo método torna possível configurar regras mais complexas para multi-Threading [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") usando [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). Os próximos parágrafos fornecem informações sobre estes parâmetros e seu uso com Data Nodes multi-Threaded.

* `MaxNoOfExecutionThreads`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro controla diretamente o número de Threads de execução usados por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), até um máximo de 72. Embora este parâmetro seja definido nas seções `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`, ele é exclusivo para [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") e não se aplica a [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon").

  Definir `MaxNoOfExecutionThreads` define o número de Threads para cada tipo, conforme determinado por uma matriz no arquivo `storage/ndb/src/kernel/vm/mt_thr_config.cpp`. Esta tabela mostra estes números de Threads para valores possíveis de `MaxNoOfExecutionThreads`.

  **Tabela 21.11 Valores de MaxNoOfExecutionThreads e o número correspondente de Threads por tipo de Thread (LQH, TC, Send, Receive).**

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Há sempre um Thread SUMA (Replicação).

  [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) deve ser definido igual ao número de Threads LDM usados por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), conforme determinado pela configuração para este parâmetro. Esta proporção não deve ser maior que 4:1; a partir do NDB 7.5.7, uma configuração em que este é o caso é especificamente proibida. (Bug #25333414)

  O número de Threads LDM também determina o número de partições usadas por uma tabela `NDB` que não é explicitamente particionada; este é o número de Threads LDM vezes o número de Data Nodes no Cluster. (Se [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") for usado nos Data Nodes em vez de [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), então há sempre um único Thread LDM; neste caso, o número de partições criadas automaticamente é simplesmente igual ao número de Data Nodes. Consulte [Seção 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"), para mais informações.

  Adicionar grandes tablespaces para tabelas Disk Data ao usar mais do que o número padrão de Threads LDM pode causar problemas com o uso de recursos e CPU se o Buffer de página de disco for insuficientemente grande; consulte a descrição do parâmetro de configuração [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory), para mais informações.

  Os tipos de Thread são descritos posteriormente nesta seção (consulte [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)).

  Definir este parâmetro fora do intervalo permitido de valores faz com que o servidor de gerenciamento aborte no Start com o erro Error line *`number`*: Illegal value *`value`* for parameter MaxNoOfExecutionThreads.

  Para `MaxNoOfExecutionThreads`, um valor de 0 ou 1 é arredondado internamente pelo [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para 2, de modo que 2 é considerado o valor padrão e mínimo deste parâmetro.

  `MaxNoOfExecutionThreads` geralmente se destina a ser definido igual ao número de Threads de CPU disponíveis e a alocar um número de Threads de cada tipo adequado para cargas de trabalho típicas. Ele não atribui Threads específicas a CPUs especificadas. Para casos em que é desejável variar das configurações fornecidas ou vincular Threads a CPUs, você deve usar [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig) em vez disso, o que permite alocar cada Thread diretamente a um tipo, CPU ou ambos desejados.

  O processo de Data Node multi-Threaded sempre gera, no mínimo, os Threads listados aqui:

  + 1 Thread de Local Query Handler (LDM)
  + 1 Thread de Receive
  + 1 Thread de Subscription Manager (SUMA ou Replicação)

  Para um valor de `MaxNoOfExecutionThreads` de 8 ou menos, nenhum Thread TC é criado, e o tratamento TC é realizado pelo Thread principal.

  Antes do NDB 7.6, alterar o número de Threads LDM sempre requer um System Restart, quer seja alterado usando este parâmetro ou [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). No NDB 7.6 e posterior, é possível efetuar a alteração usando um Node Initial Restart (*NI*), desde que as seguintes condições sejam atendidas:

  + Se, após a alteração, o número de Threads LDM permanecer o mesmo de antes, nada mais do que um Node Restart simples (rolling restart, ou *N*) é necessário para implementar a alteração.

  + Caso contrário (ou seja, se o número de Threads LDM mudar), ainda é possível efetuar a alteração usando um Node Initial Restart (*NI*), desde que as duas seguintes condições sejam atendidas:

    1. Cada Thread LDM manipula um máximo de 8 fragmentos, e

    2. O número total de fragmentos de tabela é um múltiplo inteiro do número de Threads LDM.

  Antes do NDB 7.6, se o uso de [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) do Cluster for maior que 50%, a alteração disso requer um Restart inicial do Cluster. (Um máximo de 30-35% de uso de `IndexMemory` é recomendado em tais casos.) Caso contrário, o uso de recursos e a alocação de Threads LDM não podem ser equilibrados entre Nodes, o que pode resultar em Threads LDM subutilizados e superutilizados e, em última análise, em falhas de Data Node. No NDB 7.6 e posterior, um Restart inicial *não* é necessário para efetuar uma alteração neste parâmetro.

* `MaxSendDelay`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro pode ser usado para fazer com que os Data Nodes esperem momentaneamente antes de enviar dados para os API Nodes; em algumas circunstâncias, descritas nos parágrafos seguintes, isso pode resultar em um envio mais eficiente de volumes maiores de dados e maior Throughput geral.

  `MaxSendDelay` pode ser útil quando há um grande número de API Nodes em ponto de saturação ou perto dele, o que pode resultar em ondas de desempenho crescente e decrescente. Isso ocorre quando os Data Nodes são capazes de enviar resultados de volta para os API Nodes relativamente rapidamente, com muitos pacotes pequenos para processar, o que pode levar mais tempo para processar por byte em comparação com pacotes grandes, diminuindo assim a velocidade dos API Nodes; mais tarde, os Data Nodes começam a enviar pacotes maiores novamente.

  Para lidar com este tipo de cenário, você pode definir `MaxSendDelay` para um valor não zero, o que ajuda a garantir que as respostas não sejam enviadas de volta para os API Nodes tão rapidamente. Quando isso é feito, as respostas são enviadas imediatamente quando não há outro tráfego concorrente, mas quando há, definir `MaxSendDelay` faz com que os Data Nodes esperem tempo suficiente para garantir que enviem pacotes maiores. Na verdade, isso introduz um gargalo artificial no processo de envio, o que pode realmente melhorar o Throughput significativamente.

* `NoOfFragmentLogParts`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define o número de grupos de arquivos de log para REDO logs pertencentes a este [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). O valor deste parâmetro deve ser definido igual ao número de Threads LDM usados por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") conforme determinado pela configuração para [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads). A partir do NDB 7.5.7, uma configuração que usa mais de 4 partes de REDO log por LDM é proibida. (Bug #25333414)

  Consulte a descrição de [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads) para mais informações.

* `ThreadConfig`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado com [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") para atribuir Threads de diferentes tipos a diferentes CPUs. Seu valor é uma string cujo formato tem a seguinte sintaxe:

  ```sql
  ThreadConfig := entry[,entry[,...

  entry := type={param[,param[,...}

  type := ldm | main | recv | send | rep | io | tc | watchdog | idxbld

  param := count=number
    | cpubind=cpu_list
    | cpuset=cpu_list
    | spintime=number
    | realtime={0|1}
    | nosend={0|1}
    | thread_prio={0..10}
    | cpubind_exclusive=cpu_list
    | cpuset_exclusive=cpu_list
  ```

  As chaves (`{`...`}`) que cercam a lista de parâmetros são obrigatórias, mesmo que haja apenas um parâmetro na lista.

  Um *`param`* (parâmetro) especifica alguma ou todas as seguintes informações:

  + O número de Threads do tipo fornecido (`count`).

  + O conjunto de CPUs ao qual os Threads do tipo fornecido devem ser vinculados não exclusivamente. Isso é determinado por um de `cpubind` ou `cpuset`). `cpubind` faz com que cada Thread seja vinculado (não exclusivamente) a uma CPU no conjunto; `cpuset` significa que cada Thread é vinculado (não exclusivamente) ao conjunto de CPUs especificado.

    No Solaris, você pode, em vez disso, especificar um conjunto de CPUs ao qual os Threads do tipo fornecido devem ser vinculados exclusivamente. `cpubind_exclusive` faz com que cada Thread seja vinculado exclusivamente a uma CPU no conjunto; `cpuset_exclsuive` significa que cada Thread é vinculado exclusivamente ao conjunto de CPUs especificado.

    Apenas um de `cpubind`, `cpuset`, `cpubind_exclusive` ou `cpuset_exclusive` pode ser fornecido em uma única configuração.

  + `spintime` determina o tempo de espera em microssegundos que o Thread gira antes de dormir.

    O valor padrão para `spintime` é o valor do parâmetro de configuração do Data Node [`SchedulerSpinTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerspintimer).

    `spintime` não se aplica a Threads de I/O, watchdog ou Threads de construção de Index offline e, portanto, não pode ser definido para estes tipos de Thread.

  + `realtime` pode ser definido como 0 ou 1. Se for definido como 1, os Threads são executados com prioridade de tempo real. Isso também significa que `thread_prio` não pode ser definido.

    O parâmetro `realtime` é definido por padrão para o valor do parâmetro de configuração do Data Node [`RealtimeScheduler`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-realtimescheduler).

    `realtime` não pode ser definido para Threads de construção de Index offline.

  + Ao definir `nosend` como 1, você pode impedir que um Thread `main`, `ldm`, `rep` ou `tc` auxilie os Threads de envio. Este parâmetro é 0 por padrão e não pode ser usado com outros tipos de Threads.

  + `thread_prio` é um nível de prioridade de Thread que pode ser definido de 0 a 10, com 10 representando a maior prioridade. O padrão é 5. Os efeitos precisos deste parâmetro são específicos da plataforma e são descritos posteriormente nesta seção.

    O nível de prioridade de Thread não pode ser definido para Threads de construção de Index offline.

  **Configurações e efeitos de thread_prio por plataforma.** A implementação de `thread_prio` difere entre Linux/FreeBSD, Solaris e Windows. Na lista a seguir, discutimos seus efeitos em cada uma dessas plataformas, por sua vez:

  + *Linux e FreeBSD*: Mapeamos `thread_prio` para um valor a ser fornecido à chamada de sistema `nice`. Como um valor de niceness mais baixo para um processo indica uma prioridade de processo mais alta, aumentar `thread_prio` tem o efeito de diminuir o valor de `nice`.

    **Tabela 21.12 Mapeamento de thread_prio para valores de nice no Linux e FreeBSD**

    <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    Alguns sistemas operacionais podem prever um nível máximo de niceness de processo de 20, mas isso não é suportado por todas as versões visadas; por esta razão, escolhemos 19 como o valor máximo de `nice` que pode ser definido.

  + *Solaris*: Definir `thread_prio` no Solaris define a prioridade FX do Solaris, com mapeamentos conforme mostrado na tabela a seguir:

    **Tabela 21.13 Mapeamento de thread_prio para prioridade FX no Solaris**

    <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    Uma configuração de `thread_prio` de 9 é mapeada no Solaris para o valor especial de prioridade FX 59, o que significa que o sistema operacional também tenta forçar o Thread a ser executado sozinho em seu próprio core de CPU.

  + *Windows*: Mapeamos `thread_prio` para um valor de prioridade de Thread do Windows passado para a função API do Windows `SetThreadPriority()`. Este mapeamento é mostrado na tabela a seguir:

    **Tabela 21.14 Mapeamento de thread_prio para prioridade de Thread do Windows**

    <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração do Data Node ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span><strong>Reinício do Sistema: </strong></span>Requer um desligamento completo e reinicialização do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  O Attribute *`type`* representa um tipo de Thread NDB. Os tipos de Thread suportados e o intervalo de valores `count` permitidos para cada um, são fornecidos na lista a seguir:

  + `ldm`: Local Query Handler (bloco kernel [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html)) que manipula dados. Quanto mais Threads LDM forem usados, mais altamente particionados os dados se tornam. Cada Thread LDM mantém seus próprios conjuntos de partições de dados e Index, bem como seu próprio REDO log. O valor definido para `ldm` deve ser um dos valores 1, 2, 4, 6, 8, 12, 16, 24 ou 32.

    Alterar o número de Threads LDM normalmente requer um System Restart inicial para ser eficaz e seguro para operações do Cluster. Este requisito é flexibilizado no NDB 7.6, conforme explicado posteriormente nesta seção. (Isso também é verdadeiro quando isso é feito usando [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads).) *NDB 7.5 e anteriores*: Se o uso de [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) for superior a 50%, um Restart inicial do Cluster é necessário; um máximo de 30-35% de uso de `IndexMemory` é recomendado em tais casos. Caso contrário, a alocação de memória e Threads LDM não pode ser equilibrada entre Nodes, o que pode levar a falhas de Data Node.

    Adicionar grandes tablespaces (centenas de gigabytes ou mais) para tabelas Disk Data ao usar mais do que o número padrão de LDMs pode causar problemas com o uso de recursos e CPU se [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) não for suficientemente grande.

  + `tc`: Thread de Coordenador de Transaction (bloco kernel [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html)) contendo o estado de uma Transaction em andamento. O número máximo de Threads TC é 32.

    Idealmente, cada nova Transaction pode ser atribuída a um novo Thread TC. Na maioria dos casos, 1 Thread TC por 2 Threads LDM é suficiente para garantir que isso possa acontecer. Em casos onde o número de escritas é relativamente pequeno quando comparado ao número de leituras, é possível que apenas 1 Thread TC por 4 Threads LQH seja necessário para manter os estados de Transaction. Por outro lado, em aplicações que realizam um grande número de Updates, pode ser necessário que a proporção de Threads TC