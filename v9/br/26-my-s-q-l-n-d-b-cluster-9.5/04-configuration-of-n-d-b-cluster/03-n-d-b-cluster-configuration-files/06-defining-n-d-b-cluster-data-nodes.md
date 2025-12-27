#### 25.4.3.6 Definindo nós de dados do clúster NDB

As seções `[ndbd]` e `[ndbd default]` são usadas para configurar o comportamento dos nós de dados do clúster.

`[ndbd]` e `[ndbd default]` são sempre usadas como nomes de seção, independentemente de você estar usando os binários **ndbd** ou **ndbmtd** para os processos dos nós de dados.

Há muitos parâmetros que controlam tamanhos de buffer, tamanhos de pool, tempos de espera, e assim por diante. O único parâmetro obrigatório é `ExecuteOnComputer`; este deve ser definido na seção local `[ndbd]`.

O parâmetro `NoOfReplicas` deve ser definido na seção `[ndbd default]`, pois é comum a todos os nós de dados do clúster. Não é estritamente necessário definir `NoOfReplicas`, mas é uma boa prática defini-lo explicitamente.

A maioria dos parâmetros dos nós de dados é definida na seção `[ndbd default]`. Apenas os parâmetros explicitamente declarados como capazes de definir valores locais podem ser alterados na seção `[ndbd]`. Quando presentes, `HostName` e `NodeId` *devem* ser definidos na seção local `[ndbd]`, e não em nenhuma outra seção do `config.ini`. Em outras palavras, as configurações para esses parâmetros são específicas a um nó de dados.

Para os parâmetros que afetam o uso de memória ou tamanhos de buffer, é possível usar `K`, `M` ou `G` como sufixo para indicar unidades de 1024, 1024×1024 ou 1024×1024×1024. (Por exemplo, `100K` significa 100 × 1024 = 102400.)

Os nomes e valores dos parâmetros são case-insensitive, a menos que sejam usados em um arquivo `my.cnf` ou `my.ini` do MySQL Server, caso em que são case-sensitive.

Informações sobre os parâmetros de configuração específicos para tabelas de dados de disco do NDB Cluster podem ser encontradas mais adiante nesta seção (veja Parâmetros de Configuração de Dados de Disco).

Todos esses parâmetros também se aplicam a **ndbmtd**") (a versão multithreading de **ndbd**). Três parâmetros adicionais de configuração de nós de dados — `MaxNoOfExecutionThreads`, `ThreadConfig` e `NoOfFragmentLogParts` — se aplicam apenas a **ndbmtd**") e não têm efeito quando usados com **ndbd**. Para mais informações, consulte Parâmetros de configuração de multithreading (ndbmtd"). Veja também a Seção 25.5.3, “ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multithreading”)").

**Identificação de nós de dados.** O valor `NodeId` ou `Id` (ou seja, o identificador do nó de dados) pode ser alocado na linha de comando quando o nó é iniciado ou no arquivo de configuração.

* `NodeId`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração de nó de dados `NodeId`" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 144</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Sistema: </strong></span></p><p>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup Online do NDB Cluster">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Um ID de nó único é usado como endereço do nó para todas as mensagens internas do clúster. Para nós de dados, este é um inteiro no intervalo de 1 a 144, inclusive. Cada nó no clúster deve ter um identificador único.

  `NodeId` é o único nome de parâmetro suportado para identificar nós de dados.

* `ExecuteOnComputer`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr> </table>

Isso se refere ao conjunto de `Id` para um dos computadores definidos em uma seção de `[computer]`.

Importante

Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

* O ID do nó para este nó pode ser fornecido apenas para conexões que o solicitam explicitamente. Um servidor de gerenciamento que solicita qualquer ID de nó não pode usar este. Este parâmetro pode ser usado ao executar vários servidores de gerenciamento no mesmo host, e `HostName` não é suficiente para distinguir entre processos.

* `HostName`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr><th>Padrão</th> <td>localhost</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Especificar este parâmetro define o nome do host do computador em que o nó de dados deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* `ServerPort`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do ServerPort, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>1 - 64K</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Cada nó no cluster usa uma porta para se conectar a outros nós. Por padrão, esta porta é alocada dinamicamente de forma a garantir que nenhum dos dois nós no mesmo computador host receba o mesmo número de porta, portanto, normalmente não é necessário especificar um valor para este parâmetro.

No entanto, se você precisar abrir portas específicas em um firewall para permitir a comunicação entre nós de dados e nós de API (incluindo nós SQL), você pode definir esse parâmetro para o número da porta desejada em uma seção `[ndbd]` ou (se você precisar fazer isso para vários nós de dados) na seção `[ndbd default]` do arquivo `config.ini`, e depois abrir a porta com esse número para conexões de entrada de nós SQL, nós de API ou ambos.

Nota

As conexões de nós de dados para nós de gerenciamento são feitas usando a porta de gerenciamento **ndb\_mgmd** (o `PortNumber` do servidor de gerenciamento), então as conexões saindo dessa porta de qualquer nó de dados devem ser sempre permitidas.

* `TcpBind_INADDR_ANY`

Definir esse parâmetro para `TRUE` ou `1` vincula `IP_ADDR_ANY` para que conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

* `NodeGroup`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NodeGroup tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>0 - 65536</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer um desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

Este parâmetro pode ser usado para atribuir um nó de dados a um grupo de nós específico. Ele é apenas de leitura quando o clúster é iniciado pela primeira vez e não pode ser usado para reatribuir um nó de dados a um grupo de nós diferente online. Geralmente, não é desejável usar este parâmetro na seção `[ndbd default]` do arquivo `config.ini`, e deve-se ter cuidado para não atribuir nós a grupos de nós de maneira que um número inválido de nós seja atribuído a quaisquer grupos de nós.

O parâmetro `NodeGroup` é principalmente destinado ao uso na adição de um novo grupo de nós a um clúster NDB em execução sem precisar realizar um reinício contínuo. Para esse propósito, você deve configurá-lo para 65536 (o valor máximo). Você não é obrigado a definir um valor de `NodeGroup` para todos os nós de dados do clúster, apenas para aqueles nós que devem ser iniciados e adicionados ao clúster como um novo grupo de nós posteriormente. Para mais informações, consulte a Seção 25.6.7.3, “Adicionando Nodos de Dados do Clúster NDB Online: Exemplo Detalhado”.

* `LocationDomainId`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `LocationDomainId`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>inteiro</td></tr><tr><th>Padrão</th><td>0</td></tr><tr><th>Intervalo</th><td>0 - 16</td></tr><tr><th>Tipo de Reinício</th><td><p><span class="bold"><strong>Reinício do Sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></tbody></table>

Atribui um nó de dados a um domínio de disponibilidade específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

+ Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

+ A comunicação entre nós em diferentes domínios de disponibilidade é garantida usando o suporte de WAN dos transportadores `NDB`, sem qualquer intervenção manual adicional.

+ O número do grupo do transportador pode ser baseado no domínio de disponibilidade usado, de modo que os nós SQL e outros nós de API também se comuniquem com nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

+ O árbitro pode ser selecionado de um domínio de disponibilidade em que não há nós de dados presentes, ou, se tal domínio de disponibilidade não for encontrado, de um terceiro domínio de disponibilidade.

`LocationDomainId` recebe um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `NoOfReplicas`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>2</td> </tr><tr><th>Intervalo</th> <td>1 - 4</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Este parâmetro global pode ser definido apenas na seção `[ndbd default]` e define o número de réplicas de fragmentação para cada tabela armazenada no clúster. Este parâmetro também especifica o tamanho dos grupos de nós. Um grupo de nós é um conjunto de nós que armazenam todas as mesmas informações.

Os grupos de nós são formados implicitamente. O primeiro grupo de nós é formado pelo conjunto de nós de dados com os IDs de nó mais baixos, o próximo grupo de nós pelo conjunto dos próximos IDs de nó mais baixos, e assim por diante. Por exemplo, suponha que temos 4 nós de dados e que `NoOfReplicas` está definido para 2. Os quatro nós de dados têm IDs de nó 2, 3, 4 e 5. Então, o primeiro grupo de nós é formado pelos nós 2 e 3, e o segundo grupo de nós pelos nós 4 e 5. É importante configurar o clúster de maneira que os nós dos mesmos grupos de nós não estejam localizados no mesmo computador, pois uma falha de hardware única causaria o falecimento de todo o clúster.

Se não forem fornecidos IDs de nós, a ordem dos nós de dados será o fator determinante para o grupo de nós. Independentemente de atribuições explícitas serem feitas ou não, elas podem ser visualizadas na saída do comando `SHOW` do cliente de gerenciamento.

O valor padrão para `NoOfReplicas` é 2. Esse é o valor recomendado para a maioria dos ambientes de produção. Definir o valor desse parâmetro para 3 ou 4 também é suportado.

Aviso

Definir `NoOfReplicas` para 1 significa que há apenas uma única cópia de todos os dados do Cluster; nesse caso, a perda de um único nó de dados faz com que o cluster falhe, pois não há cópias adicionais dos dados armazenados por esse nó.

O número de nós de dados no cluster deve ser divisível pelo valor desse parâmetro. Por exemplo, se houver dois nós de dados, então `NoOfReplicas` deve ser igual a 1 ou 2, pois 2/3 e 2/4 produzem valores fracionários; se houver quatro nós de dados, então `NoOfReplicas` deve ser igual a 1, 2 ou 4.

* `DataDir`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"> <tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr> <tr> <th>Padrão</th> <td>.</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr> </tbody></table>

Este parâmetro especifica o diretório onde os arquivos de registro, arquivos de log, arquivos de PID e logs de erro são armazenados.

O padrão é o diretório de trabalho do processo do nó de dados.

* `FileSystemPath`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados FileSystemPath, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>

Este parâmetro especifica o diretório onde todos os arquivos criados para metadados, logs REDO, logs UNDO (para tabelas de Dados em Disco) e arquivos de dados são colocados. O padrão é o diretório especificado por `DataDir`.

Nota

Este diretório deve existir antes que o processo **ndbd** seja iniciado.

A hierarquia de diretórios recomendada para o NDB Cluster inclui `/var/lib/mysql-cluster`, sob a qual é criado um diretório para o sistema de arquivos do nó. O nome deste subdiretório contém o ID do nó. Por exemplo, se o ID do nó for 2, este subdiretório é chamado `ndb_2_fs`.

* `BackupDataDir`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>

Este parâmetro especifica o diretório onde os backups são armazenados.

Importante

A string `'/BACKUP'` é sempre anexada a este valor. Por exemplo, se você definir o valor de `BackupDataDir` para `/var/lib/cluster-data`, então todos os backups serão armazenados em `/var/lib/cluster-data/BACKUP`. Isso também significa que o *local* de backup padrão é o diretório chamado `BACKUP` na localização especificada pelo parâmetro `FileSystemPath`.

##### Memória de dados, Memória de índice e Memória de string

`DataMemory` e `IndexMemory` são parâmetros `[ndbd]` que especificam o tamanho dos segmentos de memória usados para armazenar os registros reais e seus índices. Ao definir valores para esses, é importante entender como o `DataMemory` é usado, pois geralmente precisa ser atualizado para refletir o uso real pelo cluster.

Nota

`IndexMemory` está desatualizado e está sujeito à remoção em uma versão futura do NDB Cluster. Consulte as descrições a seguir para obter mais informações.

* `DataMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Desatualizado</th> <td>Sim (na NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do cluster. (NDB 9.5.0)</p></td> </tr> </table>0

  Este parâmetro define a quantidade de espaço (em bytes) disponível para armazenar registros de banco de dados. Toda a quantidade especificada por este valor é alocada na memória, portanto, é extremamente importante que a máquina tenha memória física suficiente para acomodá-la.

  A memória alocada por `DataMemory` é usada para armazenar tanto os registros quanto os índices. Há um sobrecarga de 16 bytes em cada registro; uma quantidade adicional para cada registro é incorrida porque é armazenada em uma página de 32 KB com uma sobrecarga de página de 128 bytes (veja abaixo). Há também uma pequena quantidade desperdiçada por página devido ao fato de que cada registro é armazenado em apenas uma página.

  Para atributos de tabelas de tamanho variável, os dados são armazenados em páginas de dados separadas, alocadas a partir de `DataMemory`. Registros de comprimento variável usam uma parte de tamanho fixo com um sobrecarga extra de 4 bytes para referenciar a parte de tamanho variável. A parte de tamanho variável tem uma sobrecarga de 2 bytes mais 2 bytes por atributo.

  O tamanho máximo do registro é de 30000 bytes.

Os recursos atribuídos ao `DataMemory` são usados para armazenar todos os dados e índices. (Qualquer memória configurada como `IndexMemory` é automaticamente adicionada ao usado pelo `DataMemory` para formar um pool de recursos comum.)

O espaço de memória alocado pelo `DataMemory` consiste em páginas de 32 KB, que são alocadas para fragmentos de tabela. Cada tabela é normalmente dividida no mesmo número de fragmentos que há de nós de dados no clúster. Assim, para cada nó, há o mesmo número de fragmentos que são definidos em `NoOfReplicas`.

Uma vez que uma página foi alocada, atualmente não é possível devolvê-la ao pool de páginas livres, exceto por excluir a tabela. (Isso também significa que as páginas do `DataMemory`, uma vez alocadas a uma tabela específica, não podem ser usadas por outras tabelas.) Realizar a recuperação de um nó de dados também comprime a partição, pois todos os registros são inseridos em partições vazias de outros nós ativos.

O espaço de memória `DataMemory` também contém informações de ANULAMENTO: Para cada atualização, uma cópia do registro não alterado é alocada no `DataMemory`. Há também uma referência a cada cópia nos índices ordenados da tabela. Índices de hash únicos são atualizados apenas quando as colunas do índice único são atualizadas, caso em que uma nova entrada na tabela de índice é inserida e a entrada antiga é excluída após o commit. Por essa razão, também é necessário alocar memória suficiente para lidar com as maiores transações realizadas por aplicativos que usam o clúster. Em qualquer caso, realizar algumas transações grandes não oferece vantagem em relação ao uso de muitas menores, pelas seguintes razões:

+ Transações grandes não são mais rápidas que as menores
+ Transações grandes aumentam o número de operações que são perdidas e devem ser repetidas em caso de falha da transação

+ Transações grandes usam mais memória

O valor padrão para `DataMemory` é de 98 MB. O valor mínimo é de 1 MB. Não há tamanho máximo, mas, na realidade, o tamanho máximo deve ser adaptado para que o processo não comece a fazer swap quando o limite for atingido. Esse limite é determinado pela quantidade de RAM física disponível na máquina e pela quantidade de memória que o sistema operacional pode alocar para qualquer processo. Sistemas operacionais de 32 bits geralmente têm um limite de 2 a 4 GB por processo; sistemas operacionais de 64 bits podem usar mais. Para grandes bancos de dados, pode ser preferível usar um sistema operacional de 64 bits por essa razão.

* `IndexMemory`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer tipo e informações de valor" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0) </p></td> </tr> </table>1

  O parâmetro `IndexMemory` está descontinuado (e sujeito à remoção futura); qualquer memória atribuída a `IndexMemory` é alocada, em vez disso, para o mesmo pool que `DataMemory`, que é exclusivamente responsável por todos os recursos necessários para armazenar dados e índices na memória. No NDB 9.5, o uso de `IndexMemory` no arquivo de configuração do clúster aciona uma mensagem de aviso do servidor de gerenciamento.

  Você pode estimar o tamanho de um índice hash usando esta fórmula:

  ```
    size  = ( (fragments * 32K) + (rows * 18) )
            * fragment_replicas
  ```

*`fragments`* é o número de fragmentos, *`fragment_replicas`* é o número de réplicas de fragmentos (normalmente 2), e *`rows`* é o número de linhas. Se uma tabela tiver um milhão de linhas, oito fragmentos e duas réplicas de fragmentos, o uso esperado da memória do índice é calculado da seguinte forma:

  ```
    ((8 * 32K) + (1000000 * 18)) * 2 = ((8 * 32768) + (1000000 * 18)) * 2
    = (262144 + 18000000) * 2
    = 18262144 * 2 = 36524288 bytes = ~35MB
  ```

  As estatísticas do índice para índices ordenados (quando esses estão habilitados) são armazenadas na tabela `mysql.ndb_index_stat_sample`. Como essa tabela tem um índice hash, isso adiciona ao uso da memória do índice. Um limite superior para o número de linhas para um determinado índice ordenado pode ser calculado da seguinte forma:

  ```
    sample_size= key_size + ((key_attributes + 1) * 4)

    sample_rows = IndexStatSaveSize
                  * ((0.01 * IndexStatSaveScale * log2(rows * sample_size)) + 1)
                  / sample_size
  ```

  Na fórmula anterior, *`key_size`* é o tamanho da chave do índice ordenado em bytes, *`key_attributes`* é o número de atributos na chave do índice ordenado, e *`rows`* é o número de linhas na tabela base.

  Suponha que a tabela `t1` tenha 1 milhão de linhas e um índice ordenado chamado `ix1` em dois inteiros de quatro bytes. Além disso, suponha que `IndexStatSaveSize` e `IndexStatSaveScale` estejam configurados para seus valores padrão (32K e 100, respectivamente). Usando as fórmulas anteriores, podemos calcular da seguinte forma:

  ```
    sample_size = 8  + ((1 + 2) * 4) = 20 bytes

    sample_rows = 32K
                  * ((0.01 * 100 * log2(1000000*20)) + 1)
                  / 20
                  = 32768 * ( (1 * ~16.811) +1) / 20
                  = 32768 * ~17.811 / 20
                  = ~29182 rows
  ```

  O uso esperado da memória do índice é, portanto, 2 * 18 * 29182 = ~1050550 bytes.

  O valor mínimo e padrão para este parâmetro é 0 (zero).
* `StringMemory`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor" width="35%">
  <col style="width: 50%"/><col style="width: 50%"/>
  <tbody>
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (em NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </tbody>
</table>

Este parâmetro determina quanto memória é alocado para strings, como nomes de tabelas, e é especificado em uma seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`. Um valor entre `0` e `100` inclusivo é interpretado como um percentual do valor máximo padrão, que é calculado com base em vários fatores, incluindo o número de tabelas, tamanho máximo de nomes de tabelas, tamanho máximo de arquivos `.FRM`, `MaxNoOfTriggers`, tamanho máximo de nomes de colunas e valor máximo de coluna padrão.

Um valor maior que `100` é interpretado como um número de bytes.

O valor padrão é 25—ou seja, 25% do valor máximo padrão.

Na maioria das circunstâncias, o valor padrão deve ser suficiente, mas quando você tem muitas tabelas `NDB` (1000 ou mais), é possível obter o erro 773 de memória de string, por favor, modifique o parâmetro de configuração StringMemory: Erro permanente: erro de esquema, nesse caso, você deve aumentar esse valor. `25` (25%) não é excessivo e deve impedir que esse erro ocorra em todas as condições, exceto nas mais extremas.

O exemplo seguinte ilustra como a memória é usada para uma tabela. Considere esta definição de tabela:

```
CREATE TABLE example (
  a INT NOT NULL,
  b INT NOT NULL,
  c INT NOT NULL,
  PRIMARY KEY(a),
  UNIQUE(b)
) ENGINE=NDBCLUSTER;
```

Para cada registro, há 12 bytes de dados mais 12 bytes de sobrecarga. Não ter colunas nulas economiza 4 bytes de sobrecarga. Além disso, temos dois índices ordenados nas colunas `a` e `b`, consumindo aproximadamente 10 bytes cada por registro. Há um índice de hash de chave primária na tabela base, usando aproximadamente 29 bytes por registro. A restrição de unicidade é implementada por uma tabela separada com `b` como chave primária e `a` como uma coluna. Essa outra tabela consome mais 29 bytes de memória de índice por registro na tabela `example` e também 8 bytes de dados de registro mais 12 bytes de sobrecarga.

Assim, para um milhão de registros, precisamos de 58MB de memória de índice para lidar com os índices de hash para a chave primária e a restrição de unicidade. Também precisamos de 64MB para os registros da tabela base e da tabela de índice único, mais as duas tabelas de índices ordenados.

Você pode ver que os índices de hash ocupam uma quantidade razoável de espaço de memória; no entanto, eles fornecem acesso muito rápido aos dados em troca. Eles também são usados no NDB Cluster para lidar com restrições de unicidade.

Atualmente, o único algoritmo de particionamento é a hash e os índices ordenados são locais para cada nó. Assim, os índices ordenados não podem ser usados para lidar com restrições de unicidade no caso geral.

Um ponto importante tanto para `IndexMemory` quanto para `DataMemory` é que o tamanho total do banco de dados é a soma de toda a memória de dados e toda a memória de índice para cada grupo de nós. Cada grupo de nós é usado para armazenar informações replicadas, então, se houver quatro nós com duas réplicas de fragmentação, há dois grupos de nós. Assim, o total de memória de dados disponível é 2 × `DataMemory` para cada nó de dados.

É altamente recomendável que `DataMemory` e `IndexMemory` sejam definidos com os mesmos valores para todos os nós. A distribuição de dados é uniforme em todos os nós do clúster, portanto, a quantidade máxima de espaço disponível para qualquer nó não pode ser maior que a do nó mais pequeno do clúster.

`DataMemory` pode ser alterado, mas diminuí-lo pode ser arriscado; fazer isso pode facilmente levar a um nó ou até mesmo a todo o NDB Cluster que não consiga reiniciar devido à falta de espaço de memória. Aumentar esses valores deve ser aceitável, mas é recomendável que essas atualizações sejam realizadas da mesma maneira que uma atualização de software, começando com uma atualização do arquivo de configuração e, em seguida, reiniciando o servidor de gerenciamento, seguido pela reinicialização de cada nó de dados, uma a uma.

**MinFreePct.**

Uma proporção (5% por padrão) dos recursos do nó de dados, incluindo `DataMemory`, é mantida em reserva para garantir que o nó de dados não esgote sua memória ao realizar um reinício. Isso pode ser ajustado usando o parâmetro de configuração do nó de dados `MinFreePct` (padrão 5).

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

As atualizações não aumentam a quantidade de memória de índice usada. As inserções entram em vigor imediatamente; no entanto, as linhas não são realmente excluídas até que a transação seja confirmada.

**Parâmetros da transação.** Os próximos parâmetros `[ndbd]` que discutimos são importantes porque afetam o número de transações paralelas e os tamanhos das transações que podem ser manuseadas pelo sistema. `MaxNoOfConcurrentTransactions` define o número de transações paralelas possíveis em um nó. `MaxNoOfConcurrentOperations` define o número de registros que podem estar na fase de atualização ou bloqueados simultaneamente.

Ambos esses parâmetros (especialmente `MaxNoOfConcurrentOperations`) são provavelmente alvos para usuários que definem valores específicos e não usam o valor padrão. O valor padrão é definido para sistemas que usam transações pequenas, para garantir que essas não usem memória excessiva.

`MaxDMLOperationsPerTransaction` define o número máximo de operações DML que podem ser realizadas em uma transação dada.

* `MaxNoOfConcurrentTransactions`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados [ndbd] ExecuteOnComputer: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>4

Cada nó de dados do cluster requer um registro de transação para cada transação ativa no cluster. A tarefa de coordenação das transações é distribuída entre todos os nós de dados. O número total de registros de transação no cluster é o número de transações em qualquer nó dado multiplicado pelo número de nós no cluster.

Os registros de transação são alocados para servidores MySQL individuais. Cada conexão com um servidor MySQL requer pelo menos um registro de transação, além de um objeto de transação adicional por tabela acessada por essa conexão. Isso significa que um mínimo razoável para o número total de transações no cluster pode ser expresso como

Suponha que haja 10 nós SQL usando o cluster. Uma única junção envolvendo 10 tabelas requer 11 registros de transação; se houver 10 junções desse tipo em uma transação, então 10 * 11 = 110 registros de transação são necessários para essa transação, por servidor MySQL, ou 110 * 10 = 1100 registros de transação no total. Espera-se que cada nó de dados possa lidar com TotalNoOfConcurrentTransactions / número de nós de dados. Para um NDB Cluster com 4 nós de dados, isso significaria definir `MaxNoOfConcurrentTransactions` em cada nó de dados para 1100 / 4 = 275. Além disso, você deve prever a recuperação em caso de falha, garantindo que um único grupo de nós possa acomodar todas as transações concorrentes; em outras palavras, que o MaxNoOfConcurrentTransactions de cada nó de dados seja suficiente para cobrir um número de transações igual a TotalNoOfConcurrentTransactions / número de grupos de nós. Se este cluster tiver um único grupo de nós, então `MaxNoOfConcurrentTransactions` deve ser definido para 1100 (o mesmo que o número total de transações concorrentes para todo o cluster).

Além disso, cada transação envolve pelo menos uma operação; por essa razão, o valor definido para `MaxNoOfConcurrentTransactions` deve ser sempre no máximo o valor de `MaxNoOfConcurrentOperations`.

Este parâmetro deve ser definido com o mesmo valor para todos os nós de dados do clúster. Isso ocorre porque, quando um nó de dados falha, o nó mais antigo que sobrevive recria o estado da transação de todas as transações que estavam em andamento no nó falhado.

É possível alterar este valor usando um reinício contínuo, mas a quantidade de tráfego no clúster deve ser tal que não ocorram mais transações do que o menor dos níveis antigo e novo enquanto isso estiver acontecendo.

O valor padrão é 4096.

* `MaxNoOfConcurrentOperations`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de Reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>5

  É uma boa ideia ajustar o valor deste parâmetro de acordo com o tamanho e o número de transações. Ao realizar transações que envolvem apenas algumas operações e registros, o valor padrão deste parâmetro geralmente é suficiente. Realizar transações grandes que envolvem muitos registros geralmente exige que você aumente seu valor.

Os registros são mantidos para cada transação que atualiza os dados do cluster, tanto no coordenador da transação quanto nos nós onde as atualizações reais são realizadas. Esses registros contêm informações de estado necessárias para encontrar registros de ANULAMENTO para o rollback, filas de bloqueio e outros propósitos.

Este parâmetro deve ser definido no mínimo para o número de registros a serem atualizados simultaneamente nas transações, dividido pelo número de nós de dados do cluster. Por exemplo, em um cluster que tem quatro nós de dados e que deve lidar com uma atualização concorrente de um milhão de operações usando transações, você deve definir esse valor para 1.000.000 / 4 = 250.000. Para ajudar a fornecer resiliência contra falhas, é sugerido que você defina esse parâmetro para um valor suficientemente alto para permitir que um nó de dados individual lidere a carga para seu grupo de nós. Em outras palavras, você deve definir o valor igual ao `número total de operações concorrentes / número de grupos de nós`. (No caso em que há um único grupo de nós, isso é o mesmo que o número total de operações concorrentes para todo o cluster.)

Como cada transação sempre envolve pelo menos uma operação, o valor de `MaxNoOfConcurrentOperations` deve sempre ser maior ou igual ao valor de `MaxNoOfConcurrentTransactions`.

Consultas de leitura que definem bloqueios também causam a criação de registros de operação. Um espaço extra é alocado dentro de nós individuais para acomodar casos em que a distribuição não é perfeita pelos nós.

Quando as consultas utilizam o índice de hash único, na verdade são usados dois registros de operação por registro na transação. O primeiro registro representa a leitura na tabela de índice e o segundo lida com a operação na tabela base.

O valor padrão é 32768.

Este parâmetro lida com dois valores que podem ser configurados separadamente. O primeiro especifica quantos registros de operação devem ser colocados com o coordenador de transações. A segunda parte especifica quantos registros de operação devem ser locais no banco de dados.

Uma transação muito grande realizada em um clúster de oito nós requer tantos registros de operação no coordenador de transações quanto houver de leituras, atualizações e exclusões envolvidas na transação. No entanto, os registros de operação estão espalhados por todos os oito nós. Assim, se for necessário configurar o sistema para uma transação muito grande, é uma boa ideia configurar as duas partes separadamente. `MaxNoOfConcurrentOperations` é sempre usado para calcular o número de registros de operação na parte do coordenador de transações do nó.

Também é importante ter uma ideia dos requisitos de memória para os registros de operação. Eles consomem cerca de 1 KB por registro.

* `MaxNoOfLocalOperations`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></tbody></table>6

Por padrão, este parâmetro é calculado como 1,1 × `MaxNoOfConcurrentOperations`. Isso é adequado para sistemas com muitas operações simultâneas, nenhuma delas sendo muito grande. Se houver a necessidade de lidar com uma transação muito grande de cada vez e houver muitos nós, é uma boa ideia sobrescrever o valor padrão, especificando explicitamente este parâmetro.

Este parâmetro está desatualizado e sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusa a iniciar.

* `MaxDMLOperationsPerTransaction`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>7

  Este parâmetro limita o tamanho de uma transação. A transação é abortada se exigir mais do que este número de operações DML.

  O valor deste parâmetro não pode exceder o definido para `MaxNoOfConcurrentOperations`.

**Armazenamento temporário de transações.** O próximo conjunto de parâmetros de `[ndbd]` é usado para determinar o armazenamento temporário ao executar uma instrução que faz parte de uma transação de cluster. Todos os registros são liberados quando a instrução é concluída e o cluster está aguardando o commit ou rollback.

Os valores padrão para esses parâmetros são adequados para a maioria das situações. No entanto, usuários que precisam suportar transações envolvendo um grande número de linhas ou operações podem precisar aumentar esses valores para permitir um melhor paralelismo no sistema, enquanto usuários cujas aplicações exigem transações relativamente pequenas podem diminuir os valores para economizar memória.

* `MaxNoOfConcurrentIndexOperations`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>8

  Para consultas que usam um índice de hash único, outro conjunto temporário de registros de operação é usado durante a fase de execução da consulta. Esse parâmetro define o tamanho desse conjunto de registros. Assim, esse registro é alocado apenas enquanto uma parte da consulta está sendo executada. Assim que essa parte for concluída, o registro é liberado. O estado necessário para lidar com abortos e commits é tratado pelos registros de operação normais, onde o tamanho do conjunto é definido pelo parâmetro `MaxNoOfConcurrentOperations`.

O valor padrão deste parâmetro é 8192. Somente em casos raros de paralelismo extremamente alto usando índices de hash únicos é que será necessário aumentar este valor. É possível usar um valor menor e pode-se economizar memória se o DBA estiver certo de que não é necessário um alto grau de paralelismo no clúster.

Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do clúster (`config.ini`), o servidor de gerenciamento se recusará a iniciar.

* `MaxNoOfFiredTriggers`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>9

  O valor padrão de `MaxNoOfFiredTriggers` é 4000, o que é suficiente para a maioria das situações. Em alguns casos, ele pode até ser reduzido se o DBA estiver certo de que a necessidade de paralelismo no clúster não é alta.

Um registro é criado quando uma operação é realizada que afeta um índice de hash único. Inserir ou excluir um registro em uma tabela com índices de hash únicos ou atualizar uma coluna que faz parte de um índice de hash único aciona um inserir ou um excluir na tabela de índice. O registro resultante é usado para representar essa operação da tabela de índice enquanto espera que a operação original que a acionou seja concluída. Essa operação é de curta duração, mas ainda pode exigir um grande número de registros em seu pool para situações com muitas operações de escrita paralelas em uma tabela base que contém um conjunto de índices de hash únicos.

Este parâmetro está desatualizado e sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusa a iniciar.

* `TransactionBufferMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados do hospedeiro" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>0

A memória afetada por este parâmetro é usada para rastrear operações realizadas ao atualizar tabelas de índice e ler índices únicos. Esta memória é usada para armazenar as informações da chave e da coluna para essas operações. É muito raro que o valor deste parâmetro precise ser alterado do valor padrão.

O valor padrão para `TransactionBufferMemory` é de 1 MB.

As operações de leitura e escrita normais usam um buffer semelhante, cujo uso é ainda mais de curta duração. O parâmetro de tempo de compilação `ZATTRBUF_FILESIZE` (encontrado em `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) definido para 4000 × 128 bytes (500 KB). Um buffer semelhante para informações de chave, `ZDATABUF_FILESIZE` (também em `Dbtc.hpp`) contém 4000 × 16 = 62,5 KB de espaço de buffer. `Dbtc` é o módulo que lida com a coordenação das transações.

**Parâmetros de alocação de recursos de transação.** Os parâmetros na lista a seguir são usados para alocar recursos de transação no coordenador de transação (`DBTC`). Ao definir qualquer um desses para o valor padrão (0), a memória de transação é dedicada para 25% do uso estimado total do nó de dados para o recurso correspondente. Os valores máximos possíveis para esses parâmetros são tipicamente limitados pela quantidade de memória disponível para o nó de dados; definir esses parâmetros não tem impacto no total de memória alocada para o nó de dados. Além disso, você deve ter em mente que eles controlam o número de registros internos reservados para o nó de dados, independentemente de qualquer configuração para `MaxDMLOperationsPerTransaction`, `MaxNoOfConcurrentIndexOperations`, `MaxNoOfConcurrentOperations`, `MaxNoOfConcurrentScans`, `MaxNoOfConcurrentTransactions`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans` ou `TransactionBufferMemory` (veja Parâmetros de transação e Armazenamento temporário de transação).

* `ReservedConcurrentIndexOperations`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>1

Número de operações de índice simultâneas com recursos dedicados em um nó de dados.

* `ReservedConcurrentOperations`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>2

Número de operações simultâneas com recursos dedicados em coordenadores de transações em um nó de dados.

* `ReservedConcurrentScans`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do HostName, tipo e informações do valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>4

Número de transações simultâneas com recursos dedicados em um nó de dados.

* `ReservedFiredTriggers`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados do host e tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício em rolagem de um NDB Cluster" target="_blank">reinício em rolagem</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>5

Número de gatilhos que têm recursos dedicados em um nó ndbd(DB).

* `ReservedLocalScans`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados do host e tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício em rolagem de um NDB Cluster" target="_blank">reinício em rolagem</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>6

Número de varreduras de fragmentos simultâneas com recursos dedicados em um nó de dados.

* `ReservedTransactionBufferMemory`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados do HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr><th>Padrão</th> <td>localhost</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>9

Espaço de buffer dinâmico (em bytes) para dados de chave e atributo alocados a cada nó de dados.

* `TransactionMemory`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados do HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr><th>Padrão</th> <td>localhost</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>10

Importante

Vários parâmetros de configuração são incompatíveis com `TransactionMemory`; não é possível definir nenhum desses parâmetros simultaneamente com `TransactionMemory`, e se você tentar fazê-lo, o servidor de gerenciamento não consegue iniciar (veja Parâmetros incompatíveis com TransactionMemory).

Este parâmetro determina a memória (em bytes) alocada para transações em cada nó de dados. A configuração da memória de transação é feita da seguinte forma:

  + Se `TransactionMemory` estiver definido, este valor é usado para determinar a memória de transação.

  + Caso contrário, a memória de transação é calculada como era antes da versão 8.0 do NDB.

**Parâmetros incompatíveis com TransactionMemory.** Os seguintes parâmetros não podem ser usados simultaneamente com `TransactionMemory` e, portanto, são desaconselhados:

  + `MaxNoOfConcurrentIndexOperations`
  + `MaxNoOfFiredTriggers`
  + `MaxNoOfLocalOperations`
  + `MaxNoOfLocalScans`

Definir explicitamente qualquer um dos parâmetros listados acima quando `TransactionMemory` também estiver definido no arquivo de configuração do cluster (`config.ini`) impede que o nó de gerenciamento comece.

Para obter mais informações sobre a alocação de recursos nos nós de dados do NDB Cluster, consulte a Seção 25.4.3.13, “Gestão de Memória do Nó de Dados”.

**Scans e bufferização.** Existem parâmetros adicionais de `[ndbd]` no módulo `Dblqh` (em `ndb/src/kernel/blocks/Dblqh/Dblqh.hpp`) que afetam leituras e atualizações. Estes incluem `ZATTRINBUF_FILESIZE`, definido por padrão para 10000 × 128 bytes (1250KB) e `ZDATABUF_FILE_SIZE`, definido por padrão para 10000\*16 bytes (aproximadamente 156KB) de espaço de buffer. Até o momento, não houve relatos de usuários nem resultados de nossos próprios extensos testes sugerindo que nenhum desses limites de tempo de compilação deveria ser aumentado.

* `BatchSizePerLocalScan`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados HostName, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>localhost</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>9

Este parâmetro é usado para calcular o número de registros de bloqueio usados para lidar com operações de varredura concorrentes.

Descontinuado.

`BatchSizePerLocalScan` tem uma forte conexão com o `BatchSize` definido nos nós SQL.

* `LongMessageBuffer`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó ServerPort, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 64K</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>0

Este é um buffer interno usado para passar mensagens dentro de nós individuais e entre nós. O padrão é 64MB.

Este parâmetro raramente precisa ser alterado do padrão.

* `MaxFKBuildBatchSize`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ServerPort, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 64K</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>1

  Tamanho máximo do lote de varredura usado para a construção de chaves estrangeiras. Aumentar o valor definido para este parâmetro pode acelerar a construção de chaves estrangeiras, mas com um impacto maior no tráfego em andamento.

* `MaxNoOfConcurrentScans`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ServerPort, tipo e informações de valor">
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>unsigned</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>1 - 64K</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>2

Este parâmetro é usado para controlar o número de varreduras paralelas que podem ser realizadas no clúster. Cada coordenador de transação pode lidar com o número de varreduras paralelas definido para este parâmetro. Cada consulta de varredura é realizada realizando uma varredura completa de todas as partições em paralelo. Cada varredura de partição usa um registro de varredura no nó onde a partição está localizada, com o número de registros sendo o valor deste parâmetro multiplicado pelo número de nós. O clúster deve ser capaz de sustentar `MaxNoOfConcurrentScans` varreduras simultâneas de todos os nós no clúster.

As varreduras são, na verdade, realizadas em dois casos. O primeiro desses casos ocorre quando não existe índice hash ou ordenado para lidar com a consulta, no qual caso a consulta é executada realizando uma varredura completa da tabela. O segundo caso é encontrado quando não existe índice hash para suportar a consulta, mas existe um índice ordenado. Usar o índice ordenado significa executar uma varredura paralela de intervalo. A ordem é mantida apenas nas partições locais, portanto, é necessário realizar a varredura do índice em todas as partições.

O valor padrão de `MaxNoOfConcurrentScans` é 256. O valor máximo é 500.

* `MaxNoOfLocalScans`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do servidorPort tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 64K</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></tbody></table>3

Especifica o número de registros de varredura local, caso muitas varreduras não sejam totalmente paralelizadas. Quando o número de registros de varredura local não é fornecido, ele é calculado conforme mostrado aqui:

  ```
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

  Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusa a iniciar.

* `MaxParallelCopyInstances`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados (data node) do ServerPort" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 64K</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</td></tr></tbody></table>4

  Este parâmetro define a paralelização usada na fase de cópia de um reinício de nó ou reinício do sistema, quando um nó que está começando agora é sincronizado com um nó que já tem os dados atuais, copiando quaisquer registros alterados do nó que está atualizado. Como a paralelização completa nessas situações pode levar a situações de sobrecarga, `MaxParallelCopyInstances` fornece uma maneira de diminuí-la. O valor padrão deste parâmetro é 0. Esse valor significa que a paralelização efetiva é igual ao número de instâncias do LDM no nó que está começando agora, bem como no nó que está atualizando.

* `MaxParallelScansPerFragment`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ServerPort, tipo e valor de dados">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 64K</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>5

  É possível configurar o número máximo de varreduras paralelas (`TUP` e `TUX`) permitidas antes de elas começarem a ficar na fila para tratamento em série. Você pode aumentar esse valor para aproveitar qualquer CPU não utilizada ao realizar um grande número de varreduras em paralelo e melhorar seu desempenho.

* `MaxReorgBuildBatchSize`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ServerPort, tipo e valor de dados">
    <tr>
      <th>Versão (ou superior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>unsigned</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>1 - 64K</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>6

  Tamanho máximo de lote de varredura usado para reorganização de partições de tabela. Aumentar o valor definido para este parâmetro pode acelerar a reorganização em detrimento do maior impacto no tráfego em andamento.

* `MaxUIBuildBatchSize`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados do ServerPort, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>1 - 64K</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>7

Tamanho máximo do lote de varredura usado para a construção de chaves únicas. Aumentar o valor definido para este parâmetro pode acelerar essas construções às custas de um maior impacto no tráfego em andamento.

##### Alocação de Memória

`MaxAllocate`

<table frame="box" rules="all" summary="Parâmetros de configuração do ServerPort, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>8

Este parâmetro era usado em versões mais antigas do NDB Cluster, mas não tem efeito no NDB 9.5. Ele é desatualizado e sujeito à remoção em uma futura versão.

##### Transportadores Múltiplos

`NDB` aloca múltiplos transportadores para a comunicação entre pares de nós de dados. O número de transportadores alocados pode ser influenciado pela definição de um valor apropriado para o parâmetro `NodeGroupTransporters` introduzido nessa versão.

`NodeGroupTransporters`

<table frame="box" rules="all" summary="Parâmetro de configuração do tipo e valor do nó da porta do servidor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>1 - 64K</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>9

Este parâmetro determina o número de transportadores usados entre nós no mesmo grupo de nós. O valor padrão (0) significa que o número de transportadores usados é o mesmo que o número de LDM no nó. Isso deve ser suficiente para a maioria dos casos de uso; portanto, raramente será necessário alterar este valor do seu padrão.

Definir `NodeGroupTransporters` para um número maior que o número de threads LDM ou o número de threads TC, dependendo do que for maior, faz com que o `NDB` use o máximo desses dois números de threads. Isso significa que um valor maior que este é efetivamente ignorado.

##### Tamanho do Mapa de Hash

`DefaultHashMapSize`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados do NodeGroup" width="35%">
<col style="width: 50%"/><col style="width: 50%"/>
<tbody>
<tr>
<th>Versão (ou posterior)</th>
<td>NDB 9.5.0</td>
</tr>
<tr>
<th>Tipo ou unidades</th>
<td>unsigned</td>
</tr>
<tr>
<th>Padrão</th>
<td>[...]</td>
</tr>
<tr>
<th>Intervalo</th>
<td>0 - 65536</td>
</tr>
<tr>
<th>Tipo de reinício</th>
<td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do NDB Cluster 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td>
</tr>
</tbody></table>0

O uso original deste parâmetro era facilitar as atualizações e, especialmente, as desatualizações para e a partir de versões muito antigas com tamanhos de mapa de hash padrão diferentes. Isso não é um problema ao atualizar do NDB Cluster 7.3 (ou posterior) para versões posteriores.

Atualizar este parâmetro online após a criação ou modificação de tabelas com `DefaultHashMapSize` igual a 3840 não é suportado atualmente.

**Registros e checkpoints.** Os seguintes parâmetros `[ndbd]` controlam o comportamento dos registros e checkpoints.

* `FragmentLogFileSize`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó do grupo de nós: tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>0 - 65536</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>1

  Definir este parâmetro permite que você controle diretamente o tamanho dos arquivos de log de redo. Isso pode ser útil em situações em que o NDB Cluster está operando com alta carga e não consegue fechar os arquivos de log de fragmentação rapidamente o suficiente antes de tentar abrir novos (apenas 2 arquivos de log de fragmentação podem estar abertos de cada vez); aumentar o tamanho dos arquivos de log de fragmentação dá ao clúster mais tempo antes de ter que abrir cada novo arquivo de log de fragmentação. O valor padrão para este parâmetro é 16M.

  Para mais informações sobre arquivos de log de fragmentação, consulte a descrição para `NoOfFragmentLogFiles`.

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NodeGroup, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>0 - 65536</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício inicial do sistema: </strong></span></p>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup online do NDB Cluster">backup</a>, e depois reiniciar o clúster. (NDB 9.5.0)</a></td></tr></tbody></table>3

Por padrão, os arquivos de log de fragmentos são criados de forma esparsa ao realizar o início inicial de um nó de dados—ou seja, dependendo do sistema operacional e do sistema de arquivos em uso, nem todos os bytes são necessariamente escritos no disco. No entanto, é possível sobrescrever esse comportamento e forçar que todos os bytes sejam escritos, independentemente da plataforma e do tipo de sistema de arquivos em uso, por meio deste parâmetro. `InitFragmentLogFiles` aceita um dos dois valores:

  + `SPARSE`. Os arquivos de log de fragmentos são criados de forma esparsa. Este é o valor padrão.

  + `FULL`. Forçar que todos os bytes do arquivo de log de fragmento sejam escritos no disco.

Dependendo do seu sistema operacional e sistema de arquivos, definir `InitFragmentLogFiles=FULL` pode ajudar a eliminar erros de I/O nas gravações no log de redo.

* `EnablePartialLcp`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do nó de grupo de nós (NodeGroup) do tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>4

Quando `true`, habilite checkpoints locais parciais: Isso significa que cada LCP registra apenas parte do banco de dados completo, além de quaisquer registros que contenham linhas alteradas desde o último LCP; se nenhuma linha foi alterada, o LCP atualiza apenas o arquivo de controle do LCP e não atualiza nenhum arquivo de dados.

Se `EnablePartialLcp` estiver desativado (`false`), cada LCP usa apenas um único arquivo e escreve um checkpoint completo; isso requer a menor quantidade de espaço em disco para os LCPs, mas aumenta a carga de escrita para cada LCP. O valor padrão é ativado (`true`). A proporção de espaço usada pelos LCPS parciais pode ser modificada pelo ajuste do parâmetro de configuração `RecoveryWork`.

Para mais informações sobre os arquivos e diretórios usados para LCPS completos e parciais, consulte o diretório do sistema de arquivos do nó de dados do NDB Cluster.

Definir este parâmetro para `false` também desabilita o cálculo da velocidade de escrita do disco usada pelo mecanismo de controle adaptativo do LCP.

* `LcpScanProgressTimeout`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do grupo de nós do NDB Cluster, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>5

Um monitor de progresso de varredura de pontos de controle locais verifica periodicamente se há progresso em cada varredura de pontos de controle realizada como parte de um ponto de controle local e desativa o nó se não houver progresso após um determinado tempo ter se passado. Esse intervalo pode ser definido usando o parâmetro de configuração do nó de dados `LcpScanProgressTimeout`, que define o tempo máximo em que o ponto de controle de varredura de fragmentos LCP pode ficar parado antes de o monitor de progresso de varredura de pontos de controle LCP desativar o nó.

O valor padrão é de 60 segundos (garantindo compatibilidade com versões anteriores). Definir esse parâmetro para 0 desativa completamente o monitor de progresso de varredura de pontos de controle LCP.

* `MaxNoOfOpenFiles`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NodeGroup tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>0 - 65536</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Sistema: </strong></span></p><p>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster.</a> (NDB 9.5.0)</p></td></tr></tbody></table>6

Este parâmetro define um teto sobre quantos threads internos devem ser alocados para arquivos abertos. *Qualquer situação que exija uma mudança neste parâmetro deve ser relatada como um bug*.

O valor padrão é 0. No entanto, o valor mínimo para o qual este parâmetro pode ser definido é 20.

* `MaxNoOfSavedMessages`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó do NodeGroup: tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>0 - 65536</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>7

Este parâmetro define o número máximo de erros escritos no log de erros, bem como o número máximo de arquivos de registro que são mantidos antes de sobrescrever os existentes. Arquivos de registro são gerados quando, por qualquer motivo, o nó falha.

O padrão é 25, que define esses máximos para 25 mensagens de erro e 25 arquivos de registro.

* `MaxLCPStartDelay`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de grupo de nós">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>0 - 65536</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Na recuperação de nós de dados em paralelo, apenas os dados da tabela são realmente copiados e sincronizados em paralelo; a sincronização de metadados, como informações de dicionário e pontos de verificação, é feita de forma serial. Além disso, a recuperação de informações de dicionário e pontos de verificação não pode ser executada em paralelo com a realização de pontos de verificação locais. Isso significa que, ao iniciar ou reiniciar muitos nós de dados simultaneamente, os nós de dados podem ser forçados a esperar enquanto um ponto de verificação local é realizado, o que pode resultar em tempos de recuperação dos nós mais longos.

É possível forçar um atraso no ponto de verificação local para permitir que mais (e possivelmente todos) nós de dados completem a sincronização de metadados; uma vez que a sincronização de metadados de cada nó de dados esteja completa, todos os nós de dados podem recuperar os dados da tabela em paralelo, mesmo enquanto o ponto de verificação local estiver sendo executado. Para forçar tal atraso, defina `MaxLCPStartDelay`, que determina o número de segundos que o clúster pode esperar para iniciar um ponto de verificação local enquanto os nós de dados continuam a sincronizar metadados. Este parâmetro deve ser definido na seção `[ndbd default]` do arquivo `config.ini`, para que seja o mesmo para todos os nós de dados. O valor máximo é 600; o padrão é 0.

* `NoOfFragmentLogFiles`

Este parâmetro define o número de arquivos de registro REDO para o nó, e, portanto, a quantidade de espaço alocado para o registro de log REDO. Como os arquivos de registro REDO são organizados em um anel, é extremamente importante que os primeiros e últimos arquivos de registro no conjunto (às vezes referidos como os arquivos de registro "cabeça" e "cauda", respectivamente) não se encontrem. Quando eles se aproximam muito um do outro, o nó começa a abortar todas as transações que envolvem atualizações devido à falta de espaço para novos registros de log.

Um registro de log `REDO` não é removido até que ambos os pontos de verificação locais exigidos tenham sido concluídos desde que esse registro de log foi inserido. A frequência de verificação é determinada por seu próprio conjunto de parâmetros de configuração discutidos em outro lugar neste capítulo.

O valor padrão do parâmetro é 16, o que, por padrão, significa 16 conjuntos de 4 arquivos de 16 MB, totalizando 1024 MB. O tamanho dos arquivos de log individuais é configurável usando o parâmetro `FragmentLogFileSize`. Em cenários que exigem muitas atualizações, o valor para `NoOfFragmentLogFiles` pode precisar ser definido como alto quanto 300 ou até mais para fornecer espaço suficiente para os logs REDO.

Se a verificação estiver lenta e houver muitas escritas no banco de dados que os arquivos de log estão cheios e a cauda do log não pode ser cortada sem comprometer a recuperação, todas as transações de atualização são abortas com o código de erro interno 410 (`Sem espaço no arquivo de log temporariamente`). Esta condição prevalece até que um ponto de verificação seja concluído e a cauda do log possa ser movida para frente.

Importante

Este parâmetro não pode ser alterado "on the fly"; você deve reiniciar o nó usando `--initial`. Se você deseja alterar esse valor para todos os nós de dados em um clúster em execução, você pode fazer isso usando um reinício de nó em rolagem (usando `--initial` ao iniciar cada nó de dados).

* `RecoveryWork`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados LocationDomainId, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 16</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>0

  Porcentagem de sobrecarga de armazenamento para arquivos LCP. Este parâmetro tem efeito apenas quando `EnablePartialLcp` é verdadeiro, ou seja, apenas quando os pontos de verificação locais parciais são habilitados. Um valor maior significa:

  + Menos registros são escritos para cada LCP, os LCPs usam mais espaço

  + É necessário mais trabalho durante os reinícios

  Um valor menor para `RecoveryWork` significa:

  + Mais registros são escritos durante cada LCP, mas os LCPs requerem menos espaço no disco

  + Menos trabalho durante o reinício e, portanto, reinícios mais rápidos, em detrimento de mais trabalho durante as operações normais

Por exemplo, definir `RecoveryWork` para 60 significa que o tamanho total de um LCP é aproximadamente 1 + 0,6 = 1,6 vezes o tamanho dos dados a serem checkpointeados. Isso significa que é necessário 60% mais trabalho durante a fase de restauração de um reinício em comparação com o trabalho realizado durante um reinício que usa checkpoints completos. (Isso é mais do que compensado durante outras fases do reinício, de modo que o reinício como um todo ainda é mais rápido ao usar LCPs parciais do que ao usar LCPs completos.) Para não encher o log de refazer, é necessário escrever na taxa de 1 + (1 / `RecoveryWork`) vezes a taxa de mudanças de dados durante os checkpoints — assim, quando `RecoveryWork` = 60, é necessário escrever aproximadamente 1 + (1 / 0,6) = 2,67 vezes a taxa de mudança. Em outras palavras, se as mudanças estão sendo escritas a 10 Mbytes por segundo, o checkpoint precisa ser escrito aproximadamente a 26,7 Mbytes por segundo.

Definir `RecoveryWork` = 40 significa que é necessário apenas 1,4 vezes o tamanho total do LCP (e, portanto, a fase de restauração leva de 10 a 15 por cento menos tempo. Neste caso, a taxa de escrita do checkpoint é 3,5 vezes a taxa de mudança.

A distribuição de fonte do NDB inclui um programa de teste para simular LCPs. `lcp_simulator.cc` pode ser encontrado em `storage/ndb/src/kernel/blocks/backup/`. Para compilar e executar em plataformas Unix, execute os comandos mostrados aqui:

```
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

Este programa não tem dependências além de `stdio.h` e não requer uma conexão a um cluster NDB ou a um servidor MySQL. Por padrão, ele simula 300 LCPs (três conjuntos de 100 LCPs, cada um consistindo de inserções, atualizações e exclusões, respectivamente), relatando o tamanho do LCP após cada um. Você pode alterar a simulação alterando os valores de `recovery_work`, `insert_work` e `delete_work` na fonte e recompilando. Para mais informações, consulte a fonte do programa.

* `InsertRecoveryWork`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de tipo e valor do nó de dados LocationDomainId" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 16</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>1

  Porcentagem de `RecoveryWork` usada para linhas inseridas. Um valor maior aumenta o número de escritas durante um ponto de verificação local e diminui o tamanho total do LCP. Um valor menor diminui o número de escritas durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo. Este parâmetro tem efeito apenas quando `EnablePartialLcp` é verdadeiro, ou seja, apenas quando os pontos de verificação locais parciais estão habilitados.

* `EnableRedoControl`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados LocationDomainId, tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>inteiro</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>0</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>0 - 16</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>2

  Ative o controle adaptativo de ponto de verificação para controlar o uso do log de revisão.

  Quando ativado (padrão), o `EnableRedoControl` permite que os nós de dados tenham maior flexibilidade em relação à taxa na qual eles escrevem LCPs no disco. Mais especificamente, ativar este parâmetro significa que taxas de escrita mais altas podem ser empregadas, para que os LCPs possam completar e os logs de revisão possam ser reduzidos mais rapidamente, reduzindo assim o tempo de recuperação e os requisitos de espaço em disco. Esta funcionalidade permite que os nós de dados utilizem melhor a taxa mais alta de I/O e a maior largura de banda disponíveis em dispositivos de armazenamento de estado sólido modernos e protocolos, como unidades de estado sólido (SSDs) que utilizam Expresso de Memória Não Volátil (NVMe).

Quando o `NDB` é implantado em sistemas cujos I/O ou largura de banda estão limitados em relação aos que utilizam tecnologia de estado sólido, como aqueles que usam discos rígidos convencionais (HDDs), o mecanismo `EnableRedoControl` pode facilmente fazer com que o subsistema de I/O fique saturado, aumentando os tempos de espera para a entrada e saída de dados no nó do nó. Em particular, isso pode causar problemas com as tabelas de Dados de Disco do NDB que têm espaços de tabelas ou grupos de arquivos de log compartilhando um subsistema de I/O limitado com os arquivos de log de redo e LCP do nó do nó; tais problemas podem incluir falhas no nó ou no clúster devido a erros de parada do GCP. Defina `EnableRedoControl` para `false` para desabilitá-lo nessas situações. Definir `EnablePartialLcp` para `false` também desabilita o cálculo adaptativo.

**Objetos de metadados.** O próximo conjunto de parâmetros `[ndbd]` define tamanhos de pool para objetos de metadados, usados para definir o número máximo de atributos, tabelas, índices e objetos de gatilho usados por índices, eventos e replicação entre clústeres.

Nota

Esses atuam meramente como “sugestões” para o clúster, e quaisquer que não sejam especificados retornam aos valores padrão mostrados.

* `MaxNoOfAttributes`

  <table frame="box" rules="all" summary="Informações do parâmetro de tipo e valor de configuração do nó de dados LocationDomainId" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>3

Este parâmetro define um número máximo sugerido de atributos que podem ser definidos no cluster; como `MaxNoOfTables`, ele não é destinado a funcionar como um limite superior rígido.

(Em versões mais antigas do NDB Cluster, este parâmetro às vezes era tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava a confusões quando era possível [ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfAttributes` atributos.)

O valor padrão é 1000, com o valor mínimo possível sendo 32. O máximo é 4294967039. Cada atributo consome cerca de 200 bytes de armazenamento por nó devido ao fato de que todos os metadados são totalmente replicados nos servidores.

Ao definir `MaxNoOfAttributes`, é importante se preparar antecipadamente para quaisquer instruções `ALTER TABLE` que você possa querer realizar no futuro. Isso ocorre porque, durante a execução de `ALTER TABLE` em uma tabela do Cluster, são usados 3 vezes o número de atributos da tabela original, e uma boa prática é permitir o dobro desse valor. Por exemplo, se a tabela do NDB Cluster com o maior número de atributos (*`greatest_number_of_attributes`*) tiver 100 atributos, um bom ponto de partida para o valor de `MaxNoOfAttributes` seria `6 * greatest_number_of_attributes = 600`.

Você também deve estimar o número médio de atributos por tabela e multiplicar esse valor por `MaxNoOfTables`. Se esse valor for maior que o valor obtido no parágrafo anterior, você deve usar o valor maior.

Supondo que você possa criar todas as tabelas desejadas sem problemas, você também deve verificar se esse número é suficiente, tentando uma `ALTER TABLE` real após a configuração do parâmetro. Se isso não for bem-sucedido, aumente `MaxNoOfAttributes` por outro múltiplo de `MaxNoOfTables` e teste novamente.

* `MaxNoOfTables`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 16</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>4

  Um objeto de tabela é alocado para cada tabela e para cada índice hash único no clúster. Este parâmetro define um número máximo sugerido de objetos de tabela para o clúster como um todo; como `MaxNoOfAttributes`, ele não é destinado a funcionar como um limite superior rígido.

  (Em versões mais antigas do NDB Cluster, este parâmetro às vezes era tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava a confusão quando era possível [ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfTables` tabelas.)

  Para cada atributo que tem um tipo de dados `BLOB`, uma tabela extra é usada para armazenar a maior parte dos dados `BLOB`. Essas tabelas também devem ser consideradas ao definir o número total de tabelas.

O valor padrão deste parâmetro é 128. O mínimo é 8 e o máximo é 20320. Cada objeto de tabela consome aproximadamente 20KB por nó.

Nota

A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfOrderedIndexes`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `LocationDomainId`"><tbody><tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>5

  Para cada índice ordenado no clúster, um objeto é alocado descrevendo o que está sendo indexado e seus segmentos de armazenamento. Por padrão, cada índice assim definido também define um índice ordenado. Cada índice único e chave primária tem tanto um índice ordenado quanto um índice hash. `MaxNoOfOrderedIndexes` define o número total de índices ordenados que podem estar em uso no sistema a qualquer momento.

  O valor padrão deste parâmetro é 128. Cada objeto de índice consome aproximadamente 10KB de dados por nó.

  Nota

  A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfUniqueHashIndexes`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados LocationDomainId, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>inteiro</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>0</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>0 - 16</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Para cada índice único que não é uma chave primária, é alocada uma tabela especial que mapeia a chave única para a chave primária da tabela indexada. Por padrão, um índice ordenado também é definido para cada índice único. Para evitar isso, você deve especificar a opção `USING HASH` ao definir o índice único.

  O valor padrão é 64. Cada índice consome aproximadamente 15 KB por nó.

  Nota

  A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfTriggers`

Os gatilhos de atualização, inserção e exclusão internos são alocados para cada índice de hash único. (Isso significa que três gatilhos são criados para cada índice de hash único.) No entanto, um índice *ordenado* requer apenas um único objeto de gatilho. As cópias de segurança também usam três objetos de gatilho para cada tabela normal no clúster.

A replicação entre clústeres também utiliza gatilhos internos.

Este parâmetro define o número máximo de objetos de gatilho no clúster.

O valor padrão é 768.

* `MaxNoOfSubscriptions`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 16</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>8

Cada tabela `NDB` em um clúster NDB requer uma assinatura no kernel NDB. Para algumas aplicações da API NDB, pode ser necessário ou desejável alterar este parâmetro. No entanto, para o uso normal com servidores MySQL atuando como nós SQL, não há necessidade de fazer isso.

O valor padrão para `MaxNoOfSubscriptions` é 0, que é tratado como igual a `MaxNoOfTables`. Cada assinatura consome 108 bytes.

* `MaxNoOfSubscribers`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados LocationDomainId, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 16</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>9

Este parâmetro é de interesse apenas quando se usa a Replicação de Clúster NDB. O valor padrão é 0. Ele é tratado como `2 * MaxNoOfTables + 2 * [número de nós de API]`. Há uma assinatura por `NDB` tabela para cada um dos dois servidores MySQL (um atuando como a fonte de replicação e o outro como a replica). Cada assinante usa 16 bytes de memória.

Ao usar replicação circular, replicação de múltiplas fontes e outras configurações de replicação que envolvem mais de 2 servidores MySQL, você deve aumentar este parâmetro para o número de **mysqld** processos incluídos na replicação (isso é frequentemente, mas nem sempre, o mesmo que o número de clústeres). Por exemplo, se você tiver uma configuração de replicação circular usando três Clústeres NDB, com um **mysqld** conectado a cada clúster, e cada um desses processos **mysqld** atue como fonte e como replica, você deve definir `MaxNoOfSubscribers` igual a `3 * MaxNoOfTables`.

Para mais informações, consulte a Seção 25.7, “Replicação de Clúster NDB”.

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>2</td> </tr><tr><th>Intervalo</th> <td>1 - 4</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>0

Este parâmetro define um teto para o número de operações que podem ser realizadas por todos os nós da API no clúster de uma só vez. O valor padrão (256) é suficiente para operações normais e pode precisar ser ajustado apenas em cenários em que há muitos nós da API executando um grande volume de operações simultaneamente.

**Parâmetros booleanos.** O comportamento dos nós de dados também é afetado por um conjunto de parâmetros `[ndbd]` que assumem valores booleanos. Cada um desses parâmetros pode ser especificado como `TRUE` definindo-o igual a `1` ou `Y`, e como `FALSE` definindo-o igual a `0` ou `N`.

* `CompressedLCP`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>2</td> </tr><tr><th>Intervalo</th> <td>1 - 4</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>1

  Definir este parâmetro para `1` faz com que os arquivos de ponto de verificação locais sejam comprimidos. A compressão usada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de ponto de verificação não comprimidos. Os LCPs comprimidos podem ser habilitados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

  Importante

  Você não pode restaurar um ponto de verificação local comprimido para um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

  O valor padrão é `0` (desativado).* `CrashOnCorruptedTuple`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr><th>Padrão</th> <td>2</td> </tr><tr><th>Intervalo</th> <td>1 - 4</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do NDB Cluster 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>3

É possível especificar tabelas do NDB Cluster como sem disco, o que significa que as tabelas não são checkpointeadas no disco e que não ocorre nenhum registro de log. Tais tabelas existem apenas na memória principal. Uma consequência do uso de tabelas sem disco é que nem as tabelas nem os registros nessas tabelas sobrevivem a um crash. No entanto, ao operar no modo sem disco, é possível executar o **ndbd** em um computador sem disco.

Importante

Esta funcionalidade faz com que *toda* a cluster opere no modo sem disco.

Quando esta funcionalidade é habilitada, o backup online do NDB Cluster é desativado. Além disso, não é possível iniciar parcialmente o cluster.

`Diskless` é desabilitado por padrão.

* `EncryptedFileSystem`

<table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados do tipo e valor `NoOfReplicas` (Número de réplicas)" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>inteiro</td></tr><tr><th>Padrão</th><td>2</td></tr><tr><th>Intervalo</th><td>1 - 4</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Sistema: </strong></span></p><p>Requer o desligamento completo do cluster, apagando e restaurando o sistema de arquivos do cluster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster" target="_blank">backup</a>, e depois reiniciando o cluster. (NDB 9.5.0)</p></td></tr></tbody></table>4

  Criptografar arquivos do sistema de arquivos, incluindo logs de desfazer e logs de refazer. Desabilitado por padrão (`0`); definido para `1` para habilitar.

  Importante

  Quando a criptografia do sistema de arquivos é habilitada, você deve fornecer uma senha para cada nó de dados ao iniciá-lo, usando uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`. Caso contrário, o nó de dados não pode ser iniciado.

Para obter mais informações, consulte a Seção 25.6.19.4, “Criptografia do Sistema de Arquivos para NDB Cluster”.

* `LateAlloc`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados `NoOfReplicas` e tipo e valor de unidade" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>inteiro</td></tr><tr><th>Padrão</th><td>2</td></tr><tr><th>Intervalo</th><td>1 - 4</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do cluster, apagamento e restauração do sistema de arquivos do cluster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup Online do NDB Cluster">backup</a>, e, em seguida, reiniciar o cluster. (NDB 9.5.0)</p></td></tr></tbody></table>5

  Alocar memória para este nó de dados após a conexão com o servidor de gerenciamento ter sido estabelecida. Ativado por padrão.

* `LockPagesInMainMemory`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados `NoOfReplicas` e tipo e valor de unidade" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>inteiro</td></tr><tr><th>Padrão</th><td>2</td></tr><tr><th>Intervalo</th><td>1 - 4</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do cluster, apagamento e restauração do sistema de arquivos do cluster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup Online do NDB Cluster">backup</a>, e, em seguida, reiniciar o cluster. (NDB 9.5.0)</p></td></tr></tbody></table>6

Para vários sistemas operacionais, incluindo Solaris e Linux, é possível bloquear um processo na memória e, assim, evitar qualquer troca para o disco. Isso pode ser usado para ajudar a garantir as características em tempo real do clúster.

Este parâmetro aceita um dos valores inteiros `0`, `1` ou `2`, que atuam conforme mostrado na seguinte lista:

+ `0`: Desabilita o bloqueio. Este é o valor padrão.

+ `1`: Realiza o bloqueio após a alocação de memória para o processo.

+ `2`: Realiza o bloqueio antes da alocação de memória para o processo.

Se o sistema operacional não estiver configurado para permitir que usuários não privilegiados bloqueiem páginas, então o processo do nó de dados que utiliza este parâmetro pode ter que ser executado como raiz do sistema. (`LockPagesInMainMemory` usa a função `mlockall`. A partir do kernel Linux 2.6.9, usuários não privilegiados podem bloquear a memória conforme limitado por `max locked memory`. Para mais informações, consulte **ulimit -l** e <http://linux.die.net/man/2/mlock>).

Nota

Em versões mais antigas do NDB Cluster, este parâmetro era um Booleano. `0` ou `false` era o ajuste padrão e desativava o bloqueio. `1` ou `true` ativava o bloqueio do processo após sua memória ser alocada. O NDB Cluster 9.5 trata `true` ou `false` para o valor deste parâmetro como um erro.

Importante

A partir da versão `glibc` 2.10, a `glibc` usa arenas por thread para reduzir a disputa por bloqueios em um pool compartilhado, que consome memória real. Geralmente, um processo do nó de dados não precisa de arenas por thread, uma vez que não realiza nenhuma alocação de memória após o início. (Essa diferença nos alocadores não parece afetar significativamente o desempenho.)

O comportamento do `glibc` é destinado a ser configurável via variável de ambiente `MALLOC_ARENA_MAX`, mas um bug neste mecanismo antes do `glibc` 2.16 significava que essa variável não poderia ser definida para menos de 8, de modo que a memória desperdiçada não poderia ser recuperada. (Bug #15907219; veja também <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> para mais informações sobre este problema.)

Uma solução possível para este problema é usar a variável de ambiente `LD_PRELOAD` para pré-carregar uma biblioteca de alocação de memória `jemalloc` para substituir a fornecida pelo `glibc`.

* `ODirect`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados `NoOfReplicas` (número de réplicas) do NDB 9.5.0" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Intervalo</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup Online do NDB Cluster" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>7

  Ativação deste parâmetro faz com que o `NDB` tente usar escritas `O_DIRECT` para LCP, backups e logs de refazer, muitas vezes reduzindo o uso de **kswapd** e CPU. Ao usar o NDB Cluster no Linux, ative `ODirect` se você estiver usando um kernel 2.6 ou posterior.

  `ODirect` está desativado por padrão.

* `ODirectSyncFlag`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados NoOfReplicas">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>inteiro</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>2</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 4</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Quando este parâmetro é habilitado, as gravações do log de redo são realizadas de forma que cada gravação de sistema de arquivos concluída é tratada como uma chamada para `fsync`. O ajuste deste parâmetro é ignorado se pelo menos uma das seguintes condições for verdadeira:

  + `ODirect` não estiver habilitado.

  + `InitFragmentLogFiles` estiver definido como `SPARSE`.

  Desabilitado por padrão.

* `RequireCertificate`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados `dataDir` do tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>caminho</td></tr><tr><th>Padrão</th><td>.</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="Backup online do clúster NDB 25.6.8" target="_blank">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0)</a></p></td></tr></tbody></table>9

Se este parâmetro for definido como `true`, o nó de dados procura por uma chave e um certificado válido e atual no caminho de busca TLS e não pode ser iniciado se não os encontrar.

* `RequireTls`

Se este parâmetro for definido como `true`, as conexões a este nó de dados devem ser autenticadas usando TLS.

* `RestartOnErrorInsert`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p><span class="bold"><strong>Reinício Inicial do Nó de Dados: </strong></span></p><p><a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rotativo de um NDB Cluster" class="link">Reinício Rotativo do NDB Cluster</a></p><p>(NDB 9.5.0)</p></td> </tr></tbody></table>1

  Esta funcionalidade só é acessível ao construir a versão de depuração, onde é possível inserir erros na execução de blocos individuais de código como parte do teste.

  Esta funcionalidade está desativada por padrão.

* `StopOnError`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>2

Este parâmetro especifica se o processo de um nó de dados deve sair ou realizar um reinício automático quando uma condição de erro for encontrada.

O valor padrão deste parâmetro é 1; isso significa que, por padrão, um erro faz com que o processo do nó de dados seja interrompido.

Quando um erro é encontrado e `StopOnError` é 0, o processo do nó de dados é reiniciado.

Os usuários do MySQL Cluster Manager devem notar que, quando `StopOnError` é igual a 1, isso impede que o agente do MySQL Cluster Manager reinicie quaisquer nós de dados após realizar seu próprio reinício e recuperação. Veja Começando e Parando o Agente no Linux, para mais informações.

* `UseShm`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício contínuo de um clúster NDB" target="_blank">reinício contínuo</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>3

  Ative uma conexão de memória compartilhada entre este nó de dados e o nó de API que também está sendo executado neste host. Defina para 1 para ativar.

##### Controle de Temporizadores, Intervalos e Paginação de Disco

Existem vários parâmetros `[ndbd]` que especificam temporizadores e intervalos entre várias ações nos nós de dados do Cluster. A maioria dos valores de temporizador é especificada em milissegundos. Qualquer exceção a isso é mencionada quando aplicável.

* `TimeBetweenWatchDogCheck`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Nó de Dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rotativo de um Clúster NDB" target="_blank">reinício rotativo</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>4

Para evitar que o fio principal fique preso em um loop infinito em algum momento, um fio "guarda-costas" verifica o fio principal. Este parâmetro especifica o número de milissegundos entre as verificações. Se o processo permanecer no mesmo estado após três verificações, o fio guarda-costas o termina.

Este parâmetro pode ser facilmente alterado para fins de experimentação ou para se adaptar às condições locais. Pode ser especificado por nó, embora pareça haver pouca razão para isso.

O tempo padrão é de 6000 milissegundos (6 segundos).* `TimeBetweenWatchDogCheckInitial`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>5

Isso é semelhante ao parâmetro `TimeBetweenWatchDogCheck`, exceto que `TimeBetweenWatchDogCheckInitial` controla o tempo que passa entre os verificações de execução dentro de um nó de armazenamento nas fases iniciais de execução, durante as quais a memória é alocada.

O tempo limite padrão é de 6000 milissegundos (6 segundos).* `StartPartialTimeout`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó do cluster: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício contínuo de um cluster NDB" class="link">reinício contínuo</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>6

Este parâmetro especifica quanto tempo o Cluster espera que todos os nós de dados estejam disponíveis antes que a rotina de inicialização do cluster seja invocada. Esse tempo de espera é usado para evitar um início parcial do Cluster sempre que possível.

Este parâmetro é sobrescrito ao realizar um início inicial ou um reinício inicial do cluster.

O valor padrão é de 30000 milissegundos (30 segundos). 0 desabilita o tempo de espera, caso em que o cluster pode iniciar apenas se todos os nós estiverem disponíveis.

* `StartPartitionedTimeout`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Nó de Dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rotativo de um Clúster NDB" target="_blank">reinício rotativo</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>7

  Se o clúster estiver pronto para começar após esperar `StartPartialTimeout` milissegundos, mas ainda possivelmente estiver em um estado particionado, o clúster aguarda até que esse tempo limite também tenha passado. Se `StartPartitionedTimeout` for definido como 0, o clúster aguarda indefinidamente (232−1 ms, ou aproximadamente 49,71 dias).

  Este parâmetro é sobrescrito ao realizar um início inicial ou um reinício inicial do clúster.

* `StartFailureTimeout`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>8

  Se um nó de dados não completar sua sequência de inicialização dentro do tempo especificado por este parâmetro, o início da inicialização do nó falha. Definir este parâmetro para 0 (o valor padrão) significa que nenhum timeout de nó de dados é aplicado.

  Para valores não nulos, este parâmetro é medido em milissegundos. Para nós de dados que contêm quantidades extremamente grandes de dados, este parâmetro deve ser aumentado. Por exemplo, no caso de um nó de dados que contém vários gigabytes de dados, pode ser necessário um período de até 10−15 minutos (ou seja, 600000 a 1000000 milissegundos) para realizar um reinício do nó.

* `StartNoNodeGroupTimeout`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó do cluster: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um cluster NDB" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>9

  Quando um nó de dados é configurado com `Nodegroup = 65536`, ele é considerado não atribuído a nenhum grupo de nós. Quando isso é feito, o cluster aguarda `StartNoNodegroupTimeout` milissegundos, depois trata esses nós como se tivessem sido adicionados à lista passada para a opção `--nowait-nodes` e começa. O valor padrão é `15000` (ou seja, o servidor de gerenciamento aguarda 15 segundos). Definir esse parâmetro igual a `0` significa que o cluster aguarda indefinidamente.

  `StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no cluster; por essa razão, você deve sempre defini-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para nós de dados individuais.

  Veja a Seção 25.6.7, “Adicionando Nodos de Dados de Cluster NDB Online”, para mais informações.

* `HeartbeatIntervalDbDb`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados FileSystemPath, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>0

Um dos métodos principais de descoberta de nós falhos é o uso de batidas cardíacas. Este parâmetro indica com que frequência os sinais de batida cardíaca são enviados e com que frequência se espera recebê-los. As batidas cardíacas não podem ser desativadas.

Após perder quatro intervalos de batida cardíaca consecutivos, o nó é declarado morto. Assim, o tempo máximo para descobrir uma falha através do mecanismo de batida cardíaca é cinco vezes o intervalo de batida cardíaca.

O intervalo padrão de batida cardíaca é de 5000 milissegundos (5 segundos). Este parâmetro não deve ser alterado drasticamente e não deve variar muito entre os nós. Se um nó usa 5000 milissegundos e o nó que o monitora usa 1000 milissegundos, obviamente o nó é declarado morto muito rapidamente. Este parâmetro pode ser alterado durante uma atualização de software online, mas apenas em incrementos pequenos.

Veja também Comunicação de rede e latência, bem como a descrição do parâmetro de configuração `ConnectCheckIntervalDelay`.

* `HeartbeatIntervalDbApi`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do caminho do sistema (FileSystemPath) do tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Nó de Dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rotativo de um Clúster NDB" target="_blank">reinício rotativo</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>1

  Cada nó de dados envia sinais de batida de coração para cada servidor MySQL (nó SQL) para garantir que ele permaneça em contato. Se um servidor MySQL não enviar um sinal de batida de coração a tempo, ele é declarado “morto”, caso em que todas as transações em andamento são concluídas e todos os recursos são liberados. O nó SQL não pode se reconectar até que todas as atividades iniciadas pela instância MySQL anterior tenham sido concluídas. Os critérios de três batidas de coração para essa determinação são os mesmos descritos para `HeartbeatIntervalDbDb`.

  O intervalo padrão é de 1500 milissegundos (1,5 segundo). Esse intervalo pode variar entre os nós de dados individuais porque cada nó de dados monitora os servidores MySQL conectados a ele, independentemente de todos os outros nós de dados.

  Para mais informações, consulte Comunicação de rede e latência.

* `HeartbeatOrder`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados FileSystemPath, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>2

Os nós de dados enviam batidas de coração uns aos outros de forma circular, de modo que cada nó de dados monitora o anterior. Se uma batida de coração não for detectada por um dado nó de dados, este nó declara o nó de dados anterior no círculo como "morto" (ou seja, não mais acessível pelo cluster). A determinação de que um nó de dados está morto é feita globalmente; em outras palavras, uma vez que um nó de dados é declarado morto, ele é considerado como tal por todos os nós do cluster.

É possível que as batidas de coração entre nós de dados localizados em hosts diferentes sejam muito lentas em comparação com as batidas de coração entre outros pares de nós (por exemplo, devido a um intervalo de batida de coração muito baixo ou a um problema temporário de conexão), de modo que um nó de dados seja declarado morto, mesmo que o nó ainda possa funcionar como parte do cluster.

Nesse tipo de situação, pode ser que a ordem em que os batimentos cardíacos são transmitidos entre os nós de dados faça a diferença em relação à declaração de um nó de dados como morto ou não. Se essa declaração ocorrer desnecessariamente, isso pode, por sua vez, levar à perda desnecessária de um grupo de nós e, assim, a um falha do clúster.

Considere uma configuração onde existem 4 nós de dados A, B, C e D em execução em 2 computadores hospedeiros `host1` e `host2`, e que esses nós de dados compõem 2 grupos de nós, conforme mostrado na tabela a seguir:

**Tabela 25.9 Quatro nós de dados A, B, C, D em execução em dois computadores hospedeiros host1, host2; cada nó de dados pertence a um dos dois grupos de nós.**

<table frame="box" rules="all" summary="Informações do parâmetro de configuração do nó de dados FileSystemPath e tipo e valor de unidade" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>caminho</td></tr><tr><th>Padrão</th><td>DataDir</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rolling de um Clúster NDB" target="_blank">reinício rolling</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td></tr></tbody></table>3

Suponha que os batimentos cardíacos sejam transmitidos na ordem A->B->C->D->A. Nesse caso, a perda do batimento cardíaco entre os hosts faz com que o nó B declare o nó A como morto e o nó C declare o nó B como morto. Isso resulta na perda do Grupo de Nodos 0, e assim o clúster falha. Por outro lado, se a ordem de transmissão for A->B->D->C->A (e todas as outras condições permanecerem como anteriormente declaradas), a perda do batimento cardíaco faz com que os nós A e D sejam declarados como mortos; nesse caso, cada grupo de nós tem um nó sobrevivente, e o clúster sobrevive.

O parâmetro de configuração `HeartbeatOrder` permite que a ordem de transmissão do batimento cardíaco seja configurada pelo usuário. O valor padrão para `HeartbeatOrder` é zero; permitindo que o valor padrão seja usado em todos os nós de dados, a ordem de transmissão do batimento cardíaco é determinada pelo `NDB`. Se este parâmetro for usado, ele deve ser definido para um valor não nulo (máximo de 65535) para cada nó de dados no clúster, e esse valor deve ser único para cada nó de dados; isso faz com que a transmissão do batimento cardíaco prossiga do nó de dados para o nó de dados na ordem de seus valores de `HeartbeatOrder` do menor para o maior (e então diretamente do nó de dados que tem o valor de `HeartbeatOrder` mais alto para o nó de dados que tem o valor mais baixo, para completar o círculo). Os valores não precisam ser consecutivos. Por exemplo, para forçar a ordem de transmissão do batimento cardíaco A->B->D->C->A no cenário descrito anteriormente, você poderia definir os valores de `HeartbeatOrder` como mostrado aqui:

**Tabela 25.10 Valores de `HeartbeatOrder` para forçar uma ordem de transição do batimento cardíaco de A->B->D->C->A.**

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados FileSystemPath, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício em rolagem de um cluster NDB" target="_blank">reinício em rolagem</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>4

  Para usar este parâmetro para alterar a ordem de transmissão do batimento cardíaco em um cluster NDB em execução, você deve primeiro definir `HeartbeatOrder` para cada nó de dados no cluster no arquivo de configuração global (`config.ini`) (ou arquivos). Para fazer a mudança entrar em vigor, você deve realizar uma das seguintes ações:

  + Um desligamento completo e reinício de todo o cluster.
  + 2 reinícios em rolagem do cluster consecutivos. *Todos os nós devem ser reiniciados na mesma ordem em ambos os reinícios em rolagem*.

  Você pode usar `DUMP 908` para observar o efeito deste parâmetro nos logs do nó de dados.

* `ConnectCheckIntervalDelay`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados FileSystemPath, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>5

Este parâmetro permite a verificação de conexão entre nós de dados após um deles ter falhado nas verificações de batida de coração por 5 intervalos de até `HeartbeatIntervalDbDb` milissegundos.

Um nó de dados que, além disso, não responder dentro de um intervalo de `ConnectCheckIntervalDelay` milissegundos é considerado suspeito e considerado morto após dois desses intervalos. Isso pode ser útil em configurações com problemas de latência conhecidos.

O valor padrão para este parâmetro é 0 (desativado).* `TimeBetweenLocalCheckpoints`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados FileSystemPath, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>6

Este parâmetro é uma exceção, pois não especifica um tempo para esperar antes de iniciar um novo ponto de verificação local; em vez disso, é usado para garantir que os pontos de verificação locais não sejam realizados em um cluster onde ocorrem relativamente poucas atualizações. Na maioria dos clusters com taxas de atualização altas, é provável que um novo ponto de verificação local seja iniciado imediatamente após o anterior ter sido concluído.

O tamanho de todas as operações de escrita executadas desde o início dos pontos de verificação locais anteriores é adicionado. Este parâmetro também é excecional, pois é especificado como o logaritmo base-2 do número de palavras de 4 bytes, de modo que o valor padrão 20 significa 4MB (4 × 220) de operações de escrita, 21 significaria 8MB, e assim por diante até um valor máximo de 31, que equivale a 8GB de operações de escrita.

Todas as operações de escrita no clúster são somadas. Definir `TimeBetweenLocalCheckpoints` para 6 ou menos significa que os pontos de verificação locais são executados continuamente sem pausa, independentemente da carga de trabalho do clúster.

* `TimeBetweenGlobalCheckpoints`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rolling de um Clúster NDB" target="_blank">reinício rolling</a> do clúster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>7

  Quando uma transação é confirmada, ela é confirmada na memória principal em todos os nós nos quais os dados são espelhados. No entanto, os registros do log de transação não são descarregados no disco como parte da confirmação. O raciocínio por trás desse comportamento é que ter a transação confirmada com segurança em pelo menos duas máquinas hospedeiras autônomas deve atender a padrões razoáveis de durabilidade.

É também importante garantir que até mesmo os casos mais graves — um crash completo do clúster — sejam tratados corretamente. Para garantir que isso aconteça, todas as transações que ocorrem dentro de um intervalo específico são colocadas em um ponto de verificação global, que pode ser considerado um conjunto de transações comprometidas que foram descarregadas no disco. Em outras palavras, como parte do processo de commit, uma transação é colocada em um grupo de registros de ponto de verificação global. Mais tarde, os registros do log desse grupo são descarregados no disco e, em seguida, todo o grupo de transações é comprometido de forma segura no disco em todos os computadores do clúster.

Recomendamos que, ao usar discos de estado sólido (especialmente aqueles que utilizam NVMe) com tabelas de Dados de Disco, você reduza esse valor. Nesses casos, você também deve garantir que `MaxDiskDataLatency` esteja configurado em um nível adequado.

Este parâmetro define o intervalo entre os pontos de verificação global. O padrão é de 2000 milissegundos.

* `TimeBetweenGlobalCheckpointsTimeout`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados de caminho do sistema de arquivos e informações sobre tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>caminho</td></tr><tr><th>Padrão</th><td>DataDir</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício Inicial do Nó: </strong></span></p><p><a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rolling de um Clúster NDB" class="link">Reinício Rolling do Clúster</a></p><p>(NDB 9.5.0)</p></td></tr></tbody></table>8

Este parâmetro define o tempo máximo entre os pontos de verificação globais. O valor padrão é de 120000 milissegundos.

* `TimeBetweenEpochs`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>DataDir</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rotativo de um NDB Cluster">reinício rotativo</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>9

  Este parâmetro define o intervalo entre as épocas de sincronização para a Replicação do NDB Cluster. O valor padrão é de 100 milissegundos.

  `TimeBetweenEpochs` faz parte da implementação dos “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação do NDB Cluster.

* `TimeBetweenEpochsTimeout`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados BackupDataDir do tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>0

Este parâmetro define um tempo limite para as épocas de sincronização para a Replicação do NDB Cluster. Se um nó não conseguir participar de um ponto de verificação global dentro do tempo determinado por este parâmetro, o nó é desligado. O valor padrão é 0; em outras palavras, o tempo limite é desativado.

`TimeBetweenEpochsTimeout` faz parte da implementação dos “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação do NDB Cluster.

O valor atual deste parâmetro e uma mensagem de aviso são escritos no log do cluster sempre que uma salvação de GCP leva mais de 1 minuto ou uma comissão de GCP leva mais de 10 segundos.

Definir este parâmetro para zero tem o efeito de desativar as paradas de GCP causadas por tempos de salvação, tempos de comissão ou ambos. O valor máximo possível para este parâmetro é 256000 milissegundos.

* `MaxBufferedEpochs`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados BackupDataDir, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>1

  O número de épocas não processadas pelas quais um nó assinante pode ficar para trás. Exceder esse número faz com que um assinante que fica para trás seja desconectado.

  O valor padrão de 100 é suficiente para a maioria das operações normais. Se um nó assinante ficar para trás o suficiente para causar desconexões, geralmente isso ocorre devido a problemas de rede ou de agendamento em relação a processos ou threads. (Em circunstâncias raras, o problema pode ser devido a um bug no cliente `NDB`. Pode ser desejável definir o valor menor que o padrão quando as épocas são mais longas.)

  A desconexão impede que problemas do cliente afetem o serviço do nó de dados, que fica sem memória para bufferizar dados e, eventualmente, para desligar. Em vez disso, apenas o cliente é afetado como resultado da desconexão (por exemplo, eventos de intervalo no log binário), forçando o cliente a se reconectar ou reiniciar o processo.

* `MaxBufferedEpochBytes`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir do tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>2

O número total de bytes alocados para épocas de bufferização por este nó.

* `TimeBetweenInactiveTransactionAbortCheck`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>3

O gerenciamento de timeout é realizado verificando um temporizador em cada transação uma vez para cada intervalo especificado por este parâmetro. Assim, se este parâmetro for definido para 1000 milissegundos, cada transação é verificada para o timeout uma vez por segundo.

O valor padrão é 1000 milissegundos (1 segundo).* `TransactionInactiveTimeout`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados BackupDataDir, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>4

Este parâmetro define o tempo máximo permitido para o intervalo entre operações na mesma transação antes que a transação seja abortada.

O padrão deste parâmetro é `4G` (também o máximo). Para uma base de dados em tempo real que precisa garantir que nenhuma transação mantenha os bloqueios por muito tempo, este parâmetro deve ser definido para um valor relativamente pequeno. Definir para 0 significa que o aplicativo nunca expira. A unidade é milissegundos.

* `TransactionDeadlockDetectionTimeout`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir, tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0)</p></td> </tr></tbody></table>5

  Quando um nó executa uma consulta que envolve uma transação, o nó aguarda a resposta dos outros nós no cluster antes de continuar. Este parâmetro define o tempo que a transação pode gastar executando dentro de um nó de dados, ou seja, o tempo que o coordenador da transação espera que cada nó de dados que participa da transação execute uma solicitação.

  A falha em responder pode ocorrer por qualquer uma das seguintes razões:

  + O nó está "morto"
  + A operação entrou em uma fila de bloqueio
  + O nó que solicitou a execução da ação pode estar sobrecarregado.

  Este parâmetro de tempo limite indica quanto tempo o coordenador da transação espera para a execução da consulta por outro nó antes de abortar a transação, e é importante tanto para o tratamento de falhas de nó quanto para a detecção de impasses.

  O valor padrão do tempo limite é de 1200 milissegundos (1,2 segundos).

  O mínimo para este parâmetro é de 50 milissegundos.

* `DiskSyncSize`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>6

  Este é o número máximo de bytes para armazenar antes de descartar os dados para um arquivo de ponto de verificação local. Isso é feito para evitar o buffer de escrita, o que pode impedir o desempenho de forma significativa. Este parâmetro *não* é destinado a substituir `TimeBetweenLocalCheckpoints`.

  Nota

  Quando o `ODirect` está habilitado, não é necessário definir `DiskSyncSize`; de fato, nesse caso, seu valor é simplesmente ignorado.

  O valor padrão é de 4M (4 megabytes).
* `MaxDiskWriteSpeed`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir do tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>7

  Defina a taxa máxima para a gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup quando nenhum reinício (por este nó de dados ou qualquer outro nó de dados) está ocorrendo neste NDB Cluster.

  Para definir a taxa máxima de gravação em disco permitida enquanto este nó de dados está reiniciando, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de gravação em disco permitida enquanto outros nós de dados estão reiniciando, use `MaxDiskWriteSpeedOtherNodeRestart`. A velocidade mínima para a gravação em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOtherNodeRestart`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados BackupDataDir do tipo e valor da versão" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>8

  Defina a taxa máxima para a gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup quando um ou mais nós de dados neste NDB Cluster estiverem reiniciando, exceto este nó.

  Para definir a taxa máxima de gravação em disco permitida enquanto este nó de dados estiver reiniciando, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de gravação em disco permitida quando nenhum nó de dados estiver reiniciando em nenhum lugar do cluster, use `MaxDiskWriteSpeed`. A velocidade mínima para a gravação em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOwnRestart`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados BackupDataDir, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>FileSystemPath</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó de dados: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" class="link">reinício Rolling</a> do cluster; cada nó de dados deve ser reiniciado com <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code class="option">--initial</code></a>. (NDB 9.5.0) </p></td> </tr></tbody></table>9

  Defina a taxa máxima para a gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup enquanto este nó de dados estiver reiniciando.

  Para definir a taxa máxima de gravação em disco permitida enquanto outros nós de dados estiverem reiniciando, use `MaxDiskWriteSpeedOtherNodeRestart`. Para definir a taxa máxima de gravação em disco permitida quando nenhum nó de dados estiver reiniciando em nenhum lugar do cluster, use `MaxDiskWriteSpeed`. A velocidade mínima para a gravação em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MinDiskWriteSpeed`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>00

Defina a taxa mínima para a gravação no disco, em bytes por segundo, por meio de pontos de verificação locais e operações de backup.

As taxas máximas de gravação no disco permitidas para LCPs e backups sob várias condições são ajustáveis usando os parâmetros `MaxDiskWriteSpeed`, `MaxDiskWriteSpeedOwnRestart` e `MaxDiskWriteSpeedOtherNodeRestart`. Consulte as descrições desses parâmetros para obter mais informações.

* `ApiFailureHandlingTimeout`

Especifica o tempo máximo (em segundos) que o nó de dados espera para que o tratamento de falha do nó de API seja concluído antes de escalar para o tratamento de falha do nó de dados.

* `ArbitrationTimeout`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>02

Este parâmetro especifica quanto tempo os nós de dados esperam por uma resposta do árbitro a uma mensagem de arbitragem. Se isso for excedido, presume-se que a rede foi dividida.

O valor padrão é de 7500 milissegundos (7,5 segundos).

* `Arbitration`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>03

O parâmetro `Arbitração` permite a escolha de esquemas de arbitragem, correspondendo a um dos 3 valores possíveis para este parâmetro:

  + **Padrão.** Isso permite que a arbitragem prossiga normalmente, conforme determinado pelas configurações de `ArbitraçãoRank` para os nós de gerenciamento e API. Este é o valor padrão.

  + **Desativado.** Definir `Arbitração = Desativado` na seção `[ndbd default]` do arquivo `config.ini` realiza a mesma tarefa que definir `ArbitraçãoRank` para 0 em todos os nós de gerenciamento e API. Quando `Arbitração` é definido dessa maneira, quaisquer configurações de `ArbitraçãoRank` são ignoradas.

  + **AguardeExterno.** O parâmetro `Arbitração` também permite configurar a arbitragem de forma que o clúster espere até que o tempo determinado por `ArbitrationTimeout` tenha passado para que um aplicativo de gerenciamento de clúster externo realize a arbitragem em vez de lidar com a arbitragem internamente. Isso pode ser feito definindo `Arbitração = AguardeExterno` na seção `[ndbd default]` do arquivo `config.ini`. Para obter os melhores resultados com a configuração `AguardeExterno`, recomenda-se que `ArbitrationTimeout` seja 2 vezes o intervalo necessário pelo gerenciador de clúster externo para realizar a arbitragem.

  Importante

Este parâmetro deve ser usado apenas na seção `[ndbd default]` do arquivo de configuração do clúster. O comportamento do clúster não é especificado quando `Arbitração` é definido para valores diferentes para nós de dados individuais.

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>04

  Este parâmetro determina o tempo que um nó de dados aguarda para que os nós de API que estão se subscritindo se conectem. Quando esse tempo de espera expira, quaisquer nós de API "faltantes" são desconectados do clúster. Para desabilitar esse tempo de espera, defina `RestartSubscriberConnectTimeout` para 0.

  Embora este parâmetro seja especificado em milissegundos, o próprio tempo de espera é resolvido para o próximo segundo inteiro maior.

* `KeepAliveSendInterval`

Você pode habilitar e controlar o intervalo entre os sinais de manutenção enviados entre os nós de dados, definindo este parâmetro. O valor padrão para `KeepAliveSendInterval` é de 60000 milissegundos (um minuto); definindo-o para 0, desabilita os sinais de manutenção. Valores entre 1 e 10, inclusive, são tratados como 10.

Este parâmetro pode ser útil em ambientes que monitoram e desconectam conexões TCP ociosas, possivelmente causando falhas desnecessárias nos nós de dados quando o clúster está ocioso.

O intervalo de batida de coração entre os nós de gerenciamento e os nós de dados é sempre de 100 milissegundos e não é configurável.

**Buffering e registro.** Vários parâmetros de configuração de `[ndbd]` permitem que o usuário avançado tenha mais controle sobre os recursos usados pelos processos dos nós e ajuste vários tamanhos de buffer conforme necessário.

Esses buffers são usados como interfaces para o sistema de arquivos ao gravar registros de log no disco. Se o nó estiver em modo sem disco, esses parâmetros podem ser definidos para seus valores mínimos sem penalidade devido ao fato de que as gravações no disco são "falsas" pela camada de abstração de sistema de arquivos do motor de armazenamento `NDB`.

* `UndoIndexBuffer`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `ExecuteOnComputer`" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>06

Este parâmetro anteriormente definia o tamanho do buffer de índice de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

O uso deste parâmetro no arquivo de configuração do cluster gera uma advertência de depreciação; você deve esperar que ele seja removido em uma futura versão do NDB Cluster.

* `UndoDataBuffer`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer no cluster" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Deprecativo</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>07

Este parâmetro anteriormente definia o tamanho do buffer de dados de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

O uso deste parâmetro no arquivo de configuração do cluster gera uma advertência de depreciação; você deve esperar que ele seja removido em uma futura versão do NDB Cluster.

* `RedoBuffer`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados NDB (ExecuteOnComputer) tipo e valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Todas as atividades de atualização também precisam ser registradas. O log REDO permite reproduzir essas atualizações sempre que o sistema for reiniciado. O algoritmo de recuperação do NDB usa um ponto de verificação "fuzzy" dos dados junto com o log UNDO e, em seguida, aplica o log REDO para reproduzir todas as alterações até o ponto de restauração.

  `RedoBuffer` define o tamanho do buffer no qual o log REDO é escrito. O valor padrão é de 32 MB; o valor mínimo é de 1 MB.

  Se esse buffer for muito pequeno, o motor de armazenamento `NDB` emite o código de erro 1221 (buffers de log REDO sobrecarregados). Por essa razão, você deve ter cuidado ao tentar diminuir o valor de `RedoBuffer` como parte de uma mudança online na configuração do clúster.

  **ndbmtd")** aloca um buffer separado para cada thread LDM (consulte `ThreadConfig`). Por exemplo, com 4 threads LDM, um nó de dados **ndbmtd")** na verdade tem 4 buffers e aloca `RedoBuffer` bytes para cada um, totalizando `4 * RedoBuffer` bytes.

* `EventLogBufferSize`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>09

Controla o tamanho do buffer circular usado para eventos de log do NDB nos nós de dados.

**Controle de mensagens de log.** Ao gerenciar o clúster, é muito importante ser capaz de controlar o número de mensagens de log enviadas para `stdout` para vários tipos de eventos. Para cada categoria de evento, há 16 níveis de evento possíveis (numerados de 0 a 15). Definir o relatório de eventos para uma determinada categoria de evento no nível 15 significa que todos os relatórios de eventos nessa categoria são enviados para `stdout`; definir no nível 0 significa que nenhum relatório de evento nessa categoria é feito.

Por padrão, apenas a mensagem de inicialização é enviada para `stdout`, com os níveis padrão de relatório de eventos restantes sendo definidos como 0. A razão para isso é que essas mensagens também são enviadas para o log do clúster do servidor de gerenciamento.

Um conjunto análogo de níveis pode ser definido para o cliente de gerenciamento para determinar quais níveis de evento devem ser registrados no log do clúster.

* `LogLevelStartup`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>10

O nível de relatório para eventos gerados durante o início do processo.

O nível padrão é 1.

* `LogLevelShutdown`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>11

O nível de relatório para eventos gerados como parte do desligamento suave de um nó.

O nível padrão é 0.

* `LogLevelStatistic`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>12

O nível de relatório para eventos estatísticos, como número de leituras de chave primária, número de atualizações, número de inserções, informações relacionadas ao uso do buffer, e assim por diante.

O nível padrão é 0.

* `LogLevelCheckpoint`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>13

O nível de relatório para eventos gerados por pontos de verificação locais e globais.

O nível padrão é 0.

* `LogLevelNodeRestart`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>14

O nível de relatório para eventos gerados durante o reinício do nó.

O nível padrão é 0.
* `LogLevelConnection`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>15

O nível de relatório para eventos gerados por conexões entre nós do clúster.

O nível padrão é 0.
* `LogLevelError`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e valor de versão">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>16

  O nível de relatórios para eventos gerados por erros e avisos pelo clúster como um todo. Esses erros não causam falha em nenhum nó, mas ainda são considerados dignos de serem relatados.

  O nível padrão é 0.

* `LogLevelCongestion`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e valor de versão">
    <tr>
      <th>Versão (ou superior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (em NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>17

  O nível de relatórios para eventos gerados por congestionamento. Esses erros não causam falha no nó, mas ainda são considerados dignos de serem relatados.

  O nível padrão é 0.

* `LogLevelInfo`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>20

O nível de relatórios para eventos gerados para informações sobre o estado geral do clúster.

O nível padrão é 0.
* `MemReportFrequency`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>21

Este parâmetro controla com que frequência os relatórios de uso de memória do nó de dados são registrados no log do clúster; é um valor inteiro que representa o número de segundos entre os relatórios.

O uso da memória de dados e da memória de índice de cada nó de dados é registrado tanto como uma porcentagem quanto como o número de páginas de 32 KB de `DataMemory`, conforme definido no arquivo `config.ini`. Por exemplo, se `DataMemory` for igual a 100 MB e um dado nó de dados estiver usando 50 MB para armazenamento de memória de dados, a linha correspondente no log do clúster pode parecer assim:

  ```
  $> gcc lcp_simulator.cc
  $> ./a.out
  ```

  `MemReportFrequency` não é um parâmetro obrigatório. Se usado, pode ser definido para todos os nós de dados do clúster na seção `[ndbd default]` do `config.ini` e também pode ser definido ou sobrescrito para nós de dados individuais nas seções `[ndbd]` correspondentes do arquivo de configuração. O valor mínimo — que também é o valor padrão — é 0, caso em que os relatórios de memória são registrados apenas quando o uso de memória atinge certos porcentagens (80%, 90% e 100%), conforme mencionado na discussão sobre eventos de estatísticas na Seção 25.6.3.2, “Eventos de Log do Clúster NDB”.

* `StartupStatusReportFrequency`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados executeOnComputer tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>20

Quando um nó de dados é iniciado com a opção `--initial`, ele inicializa o arquivo de log de refazer durante a Fase de Início 4 (veja a Seção 25.6.4, “Resumo das Fases de Início do NDB Cluster”). Quando valores muito grandes são definidos para `NoOfFragmentLogFiles`, `FragmentLogFileSize` ou ambos, essa inicialização pode levar muito tempo. Você pode forçar que os relatórios sobre o progresso desse processo sejam registrados periodicamente, por meio do parâmetro de configuração `StartupStatusReportFrequency`. Nesse caso, o progresso é relatado no log do cluster, em termos de número de arquivos e quantidade de espaço que foram inicializados, conforme mostrado aqui:

```
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

Esses relatórios são registrados a cada `StartupStatusReportFrequency` segundos durante a Fase de Início 4. Se `StartupStatusReportFrequency` for 0 (o padrão), então os relatórios são escritos no log do cluster apenas no início e no término do processo de inicialização do arquivo de log de refazer.

##### Parâmetros de Depuração do Nó de Dados

Os seguintes parâmetros são destinados ao uso durante o teste ou depuração de nós de dados, e não para uso em produção.

* `DictTrace`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `ExecuteOnComputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>21

É possível registrar traços para eventos gerados ao criar e excluir tabelas usando `DictTrace`. Esse parâmetro é útil apenas no depuração do código do kernel NDB. `DictTrace` aceita um valor inteiro. 0 é o padrão e significa que não há registro; 1 habilita o registro de traços e 2 habilita o registro de saída de depuração adicional do `DBDICT`.

* `WatchDogImmediateKill`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td> </tr> </table> 22

  Você pode fazer com que os threads sejam eliminados imediatamente sempre que houver problemas com o watchdog, habilitando o parâmetro de configuração do nó de dados `WatchDogImmediateKill`. Esse parâmetro deve ser usado apenas durante a depuração ou solução de problemas, para obter arquivos de registro que relatam exatamente o que estava ocorrendo no momento em que a execução foi interrompida.

**Parâmetros de backup.** Os parâmetros `[ndbd]` discutidos nesta seção definem buffers de memória reservados para a execução de backups online.

* `BackupDataBufferSize`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th style="width: 50%">Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Ao criar um backup, são usados dois buffers para enviar dados para o disco. O buffer de dados do backup é usado para preencher os dados registrados ao digitalizar as tabelas de um nó. Uma vez que este buffer estiver preenchido até o nível especificado como `BackupWriteSize`, as páginas são enviadas para o disco. Enquanto o processo de gravação de dados no disco, o processo de backup pode continuar preenchendo este buffer até ficar sem espaço. Quando isso acontece, o processo de backup pausa a digitalização e aguarda até que alguns escritos no disco tenham concluído, liberando memória para que a digitalização possa continuar.

  O valor padrão para este parâmetro é 16 MB. O mínimo é 512 K.

* `BackupDiskWriteSpeedPct`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  O parâmetro `BackupDiskWriteSpeedPct` só se aplica quando um backup é executado em um único fio; como o NDB 9.5 suporta backups em múltiplos fios, geralmente não é necessário ajustar este parâmetro, que não tem efeito no caso de backups em múltiplos fios. A discussão a seguir é específica para backups em único fio.

  Durante o funcionamento normal, os nós de dados tentam maximizar a velocidade de escrita no disco usada para verificações de ponto e backups locais, mantendo-se dentro dos limites definidos por `MinDiskWriteSpeed` e `MaxDiskWriteSpeed`. O controle de velocidade de escrita no disco dá a cada fio LDM uma parte igual do orçamento total. Isso permite que os LCPs paralelos ocorram sem exceder o orçamento de I/O do disco. Como um backup é executado por apenas um fio LDM, isso efetivamente causou uma redução no orçamento, resultando em tempos de conclusão do backup mais longos e, se a taxa de mudança for suficientemente alta, na falha na conclusão do backup quando a taxa de enchimento do buffer de log de backup for maior que a taxa de escrita alcançável.

Esse problema pode ser resolvido usando o parâmetro de configuração `BackupDiskWriteSpeedPct`, que aceita um valor no intervalo de 0 a 90 (incluindo) que é interpretado como a porcentagem do orçamento máximo de taxa de escrita do nó que é reservado antes de distribuir o restante do orçamento entre os threads LDM para LCPs. O thread LDM que executa o backup recebe todo o orçamento de taxa de escrita para o backup, mais sua (reduzida) parcela do orçamento de taxa de escrita para pontos de verificação locais.

O valor padrão para esse parâmetro é 50 (interpretado como 50%).

* `BackupLogBufferSize`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>25

  O buffer de log de backup desempenha um papel semelhante ao desempenhado pelo buffer de dados de backup, exceto que é usado para gerar um log de todas as escritas de tabela feitas durante a execução do backup. Os mesmos princípios se aplicam à escrita dessas páginas como com o buffer de dados de backup, exceto que, quando não há mais espaço no buffer de log de backup, o backup falha. Por essa razão, o tamanho do buffer de log de backup deve ser grande o suficiente para lidar com a carga causada pelas atividades de escrita enquanto o backup está sendo feito. Veja a Seção 25.6.8.3, “Configuração para backups de clúster NDB”.

O valor padrão para este parâmetro deve ser suficiente para a maioria das aplicações. De fato, é mais provável que uma falha de backup seja causada por uma velocidade de gravação do disco insuficiente do que pelo buffer do log de backup ficar cheio. Se o subsistema de disco não for configurado para a carga de escrita causada pelas aplicações, é improvável que o clúster consiga realizar as operações desejadas.

É preferível configurar os nós do clúster de tal forma que o processador se torne o gargalo, em vez dos discos ou das conexões de rede.

O valor padrão para este parâmetro é de 16 MB.

* `BackupMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados do data node do NDB Cluster" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (no NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>26

Este parâmetro está descontinuado e sujeito à remoção em uma versão futura do NDB Cluster. Qualquer configuração feita para ele é ignorada.

* `BackupReportFrequency`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>27

Este parâmetro controla com que frequência os relatórios de status de backup são emitidos no cliente de gerenciamento durante um backup, bem como com que frequência esses relatórios são escritos no log do clúster (desde que a log de eventos do clúster esteja configurada para permitir isso—veja Log e checkpointing). `BackupReportFrequency` representa o tempo em segundos entre os relatórios de status de backup.

O valor padrão é 0.

* `BackupWriteSize`

O valor padrão para este parâmetro é de 256 KB.

* `BackupMaxWriteSize`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>29

Este parâmetro especifica o tamanho máximo das mensagens escritas no disco pelo log de backup e pelos buffers de dados de backup.

O valor padrão para este parâmetro é de 1 MB.

* `BackupCompressed`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>30

Ativação deste parâmetro faz com que os arquivos de backup sejam comprimidos. A compressão utilizada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de backup não comprimidos. Os backups comprimidos podem ser habilitados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

Importante

Você não pode restaurar um backup comprimido em um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

O valor padrão é `0` (desativado).

* `RequireEncryptedBackup`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `ExecuteOnComputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></tbody></table>31

  Se definido para 1, os backups devem ser criptografados. Embora seja possível definir este parâmetro para cada nó de dados individualmente, recomenda-se que você o defina na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Para obter mais informações sobre a realização de backups criptografados, consulte a Seção 25.6.8.2, “Usando o cliente de gerenciamento de clúster NDB para criar um backup”.

Nota

A localização dos arquivos de backup é determinada pelo parâmetro de configuração do nó de dados `BackupDataDir`.

**Requisitos adicionais.** Ao especificar esses parâmetros, as seguintes relações devem ser verdadeiras. Caso contrário, o nó de dados não poderá ser iniciado.

* `BackupDataBufferSize >= BackupWriteSize + 188KB`

* `BackupLogBufferSize >= BackupWriteSize + 16KB`

* `BackupMaxWriteSize >= BackupWriteSize`

##### Parâmetros de desempenho em tempo real do NDB Cluster

Os parâmetros `[ndbd]` discutidos nesta seção são usados na programação e bloqueio de threads para CPUs específicas em hosts de nós de dados multiprocessadores.

Nota

Para utilizar esses parâmetros, o processo do nó de dados deve ser executado como raiz do sistema.

* `BuildIndexThreads`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `executeoncomputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>32

  Este parâmetro determina o número de threads a serem criados ao reconstruir índices ordenados durante o início de um sistema ou de um nó, bem como ao executar **ndb_restore** `--rebuild-indexes`. É suportado apenas quando há mais de um fragmento para a tabela por nó de dados (por exemplo, quando `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` é usado com `CREATE TABLE`).

  Definir este parâmetro para 0 (o padrão) desativa a construção multithread de índices ordenados.

  Este parâmetro é suportado ao usar **ndbd** ou **ndbmtd").

Você pode habilitar a construção multithread durante os reinicializações iniciais do nó de dados configurando o parâmetro de configuração do nó de dados `TwoPassInitialNodeRestartCopy` para `TRUE`.

* `LockExecuteThreadToCPU`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinicialização</th> <td><p> <span class="bold"><strong>Reinicialização do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>33

  Quando usado com **ndbd**, este parâmetro (agora uma string) especifica o ID da CPU atribuído para lidar com o thread de execução do `NDBCLUSTER`. Quando usado com **ndbmtd"), o valor deste parâmetro é uma lista de IDs de CPU separados por vírgula, atribuídos para lidar com os threads de execução. Cada ID de CPU na lista deve ser um inteiro no intervalo de 0 a 65535 (inclusivo).

  O número de IDs especificados deve corresponder ao número de threads de execução determinados por `MaxNoOfExecutionThreads`. No entanto, não há garantia de que os threads sejam atribuídos às CPUs em qualquer ordem específica ao usar este parâmetro. Você pode obter um controle mais detalhado deste tipo usando `ThreadConfig`.

  `LockExecuteThreadToCPU` não tem valor padrão.

* `LockMaintThreadsToCPU`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>34

Este parâmetro especifica o ID da CPU atribuído para lidar com os threads de manutenção do `NDBCLUSTER`.

O valor deste parâmetro é um inteiro no intervalo de 0 a 65535 (inclusivo). *Não há valor padrão*.

* `Numa`

Este parâmetro determina se o Acesso Não Uniforme à Memória (NUMA) é controlado pelo sistema operacional ou pelo processo do nó de dados, se o nó de dados usa **ndbd** ou **ndbmtd**"). Por padrão, o `NDB` tenta usar uma política de alocação de memória NUMA interlaçada em qualquer nó de dados onde o sistema operacional do host fornece suporte NUMA.

Definir `Numa = 0` significa que o processo do nó de dados não tenta definir uma política para a alocação de memória e permite que esse comportamento seja determinado pelo sistema operacional, que pode ser guiado ainda mais pela ferramenta separada **numactl**. Ou seja, `Numa = 0` gera o comportamento padrão do sistema, que pode ser personalizado pelo **numactl**. Para muitos sistemas Linux, o comportamento padrão do sistema é alocar memória local para qualquer processo dado no momento da alocação. Isso pode ser problemático ao usar **ndbmtd"); isso ocorre porque **nbdmtd** aloca toda a memória no início, levando a um desequilíbrio, dando velocidades de acesso diferentes para diferentes soquetes, especialmente ao bloquear páginas na memória principal.

Definir `Numa = 1` significa que o processo do nó de dados usa `libnuma` para solicitar a alocação de memória interlaçada. (Isso também pode ser feito manualmente, no nível do sistema operacional, usando **numactl**.) Usar a alocação interlaçada, na verdade, diz ao processo do nó de dados para ignorar o acesso não uniforme à memória, mas não tenta aproveitar a memória local rápida; em vez disso, o processo do nó de dados tenta evitar desequilíbrios devido à memória remota lenta. Se a alocação interlaçada não for desejada, defina `Numa` para 0 para que o comportamento desejado possa ser determinado no nível do sistema operacional.

O parâmetro de configuração `Numa` é suportado apenas em sistemas Linux onde o `libnuma.so` está disponível.

* `RealtimeScheduler`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e valor"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>36

Definir este parâmetro para 1 habilita a agendamento em tempo real das threads do nó de dados.

O padrão é 0 (agendamento desativado).
* `SchedulerExecutionTimer`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e valor"><tr><th style="width: 50%">Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th style="width: 50%">Tipo ou unidades</th><td>nome</td></tr><tr><th style="width: 50%">Padrão</th><td>[...]</td></tr><tr><th style="width: 50%">Intervalo</th><td>...</td></tr><tr><th style="width: 50%">Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th style="width: 50%">Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></table>37

Este parâmetro especifica o tempo em microsegundos para que as threads sejam executadas no agendamento antes de serem enviadas. Definir para 0 minimiza o tempo de resposta; para obter um maior desempenho, você pode aumentar o valor em detrimento de tempos de resposta mais longos.

O valor padrão é de 50 μs, o que, conforme demonstrado em nossos testes, aumenta ligeiramente o desempenho em casos de alta carga sem atrasar substancialmente as solicitações.

* `SchedulerResponsiveness`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e valor"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>38

  Defina o equilíbrio no planejador `NDB` entre velocidade e desempenho. Este parâmetro aceita um número inteiro cujo valor está no intervalo de 0 a 10, incluindo 5 como padrão. Valores mais altos proporcionam tempos de resposta melhores em relação ao desempenho. Valores mais baixos proporcionam um aumento no desempenho à custa de tempos de resposta mais longos.

* `SchedulerSpinTimer`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e valor"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>39

Este parâmetro especifica o tempo em microsegundos para que os threads sejam executados no agendador antes de entrarem em estado de espera.

Nota

Se `SpinMethod` estiver definido, qualquer configuração deste parâmetro é ignorada.

* `SpinMethod`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"> <col style="width: 50%"/><col style="width: 50%"/> <tbody> <tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Descontinuado</th> <td>Sim (na NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr> </tbody> </table> 40

Este parâmetro fornece uma interface simples para controlar o giro adaptativo nos nós de dados, com quatro valores possíveis que fornecem predefinições para os valores do parâmetro de giro, conforme mostrado na lista a seguir:

1. `StaticSpinning` (padrão): Define `EnableAdaptiveSpinning` para `false` e `SchedulerSpinTimer` para 0. (`SetAllowedSpinOverhead` não é relevante neste caso.)

2. `CostBasedSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 100 e `SetAllowedSpinOverhead` para 200.

3. `LatencyOptimisedSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 200 e `SetAllowedSpinOverhead` para 1000.

4. `DatabaseMachineSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 500 e `SetAllowedSpinOverhead` para 10000. Isso é destinado para uso em casos em que os threads possuem suas próprias CPUs.

Os parâmetros de giro modificados por `SpinMethod` são descritos na lista a seguir:

+ `SchedulerSpinTimer`: Isso é o mesmo que o parâmetro de configuração do nó de dados com esse nome. O ajuste aplicado a este parâmetro por `SpinMethod` substitui qualquer valor definido no arquivo `config.ini`.

  + `EnableAdaptiveSpinning`: Habilita ou desabilita o giro adaptativo. Desabilitá-lo faz com que o giro seja realizado sem fazer nenhuma verificação dos recursos da CPU. Este parâmetro não pode ser definido diretamente no arquivo de configuração do cluster, e, na maioria das circunstâncias, não deve ser necessário, mas pode ser habilitado diretamente usando `DUMP 104004 1` ou desabilitado com `DUMP 104004 0` no cliente de gerenciamento **ndb\_mgm**.

  + `SetAllowedSpinOverhead`: Define a quantidade de tempo da CPU para permitir a obtenção de latência. Este parâmetro não pode ser definido diretamente no arquivo `config.ini`. Na maioria dos casos, o ajuste aplicado por SpinMethod deve ser satisfatório, mas se for necessário alterá-lo diretamente, você pode usar `DUMP 104002 overhead` para fazer isso, onde *`overhead`* é um valor variando de 0 a 10000, inclusive; veja a descrição do comando `DUMP` indicado para detalhes.

  Em plataformas que não possuem instruções de giro utilizáveis, como PowerPC e algumas plataformas SPARC, o tempo de giro é definido como 0 em todas as situações, e os valores para `SpinMethod` diferentes de `StaticSpinning` são ignorados.

* `TwoPassInitialNodeRestartCopy`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>41

A construção multithreading de índices ordenados pode ser habilitada para reinícios iniciais de nós de dados configurando este parâmetro de configuração para `true` (o valor padrão), o que permite a cópia de dados em duas passagens durante os reinícios iniciais dos nós.

Você também deve definir `BuildIndexThreads` para um valor não nulo.

**Parâmetros de configuração de multithreading (ndbmtd).** **ndbmtd")** é executado por padrão como um processo de thread único e deve ser configurado para usar múltiplos threads, utilizando um dos dois métodos, ambos os quais exigem a definição de parâmetros de configuração no arquivo `config.ini`. O primeiro método é simplesmente definir um valor apropriado para o parâmetro de configuração `MaxNoOfExecutionThreads`. Um segundo método permite configurar regras mais complexas para a multithreading de **ndbmtd")** usando `ThreadConfig`. Os próximos parágrafos fornecem informações sobre esses parâmetros e seu uso com nós de dados multithread.

Nota

Um backup usando paralelismo nos nós de dados exige que múltiplos LDMs estejam em uso em todos os nós de dados do clúster antes de realizar o backup. Para obter mais informações, consulte a Seção 25.6.8.5, “Realizar um backup NDB com nós de dados paralelos”, além de Restaurar a partir de um backup realizado em paralelo.

* `AutomaticThreadConfig`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `executeOnComputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>42

  Quando definido para 1, habilita a configuração automática de threads, empregando o número de CPUs disponíveis para um nó de dados, levando em conta quaisquer limites definidos por `taskset`, `numactl`, máquinas virtuais, Docker e outros meios de controle de quais CPUs estão disponíveis para um aplicativo específico (em plataformas Windows, a configuração automática de threads usa todas as CPUs que estão online); como alternativa, você pode definir `NumCPUs` para o número desejado de CPUs (até 1024, o número máximo de CPUs que podem ser gerenciadas pela configuração automática de threads). Quaisquer configurações para `ThreadConfig` e `MaxNoOfExecutionThreads` são ignoradas. Além disso, habilitar este parâmetro desabilita automaticamente `ClassicFragmentation`.

* `ClassicFragmentation`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados NDB (ExecuteOnComputer) tipo e informações de valor" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr> </table> 43

Quando habilitado (definido como `true`), o `NDB` distribui fragmentos entre LDMs de forma que o número padrão de partições por nó seja igual ao número mínimo de threads de gerente de dados local (LDM) por nó de dados.

Para novos clústeres, é preferível definir `ClassicFragmentation` para `false` ao configurar o clúster pela primeira vez; isso faz com que o número de partições por nó seja igual ao valor de `PartitionsPerNode`, garantindo que todas as partições sejam distribuídas uniformemente entre todos os LDMs.

Este parâmetro e `AutomaticThreadConfig` são mutuamente exclusivos; habilitar `AutomaticThreadConfig` desabilita automaticamente `ClassicFragmentation`. * `EnableMultithreadedBackup`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>44

  Habilita o backup multisserial. Se cada nó de dados tiver pelo menos 2 LDMs, todos os threads do LDM participam do backup, que é criado usando um subdiretório por thread do LDM, e cada subdiretório contendo os arquivos de backup `.ctl`, `.Data` e `.log`.

  Este parâmetro é normalmente ativado (definido para 1) para **ndbmtd"). Para forçar um backup monosserial que pode ser restaurado facilmente usando versões mais antigas do **ndb\_restore**, desative o backup multisserial definindo este parâmetro para 0. Isso deve ser feito para cada nó de dados no clúster.

  Veja a Seção 25.6.8.5, “Fazendo um backup NDB com nós de dados paralelos”, e Restaurando a partir de um backup feito em paralelo, para mais informações.

* `MaxNoOfExecutionThreads`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th style="width: 50%">Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>
45

Este parâmetro controla diretamente o número de threads de execução usadas por **ndbmtd"), até um máximo de 72. Embora este parâmetro seja definido nas seções `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`, é exclusivo para **ndbmtd") e não se aplica a **ndbd**.

Ativação de `AutomaticThreadConfig` faz com que qualquer configuração para este parâmetro seja ignorada.

Definir `MaxNoOfExecutionThreads` define o número de threads para cada tipo, conforme determinado por uma matriz no arquivo `storage/ndb/src/common/mt_thr_config.cpp`. Esta tabela mostra esses números de threads para valores possíveis de `MaxNoOfExecutionThreads`.

**Tabela 25.11 Valores de MaxNoOfExecutionThreads e o número correspondente de threads por tipo de thread (LQH, TC, Enviar, Receber).**

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados NDB: Versão (ou posterior), Tipo ou unidades, Valor padrão, Intervalo, Descontinuado, Tipo de reinício">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>
46

  Há sempre um único thread SUMA (replicação).

  `NoOfFragmentLogParts` deve ser definido como igual ao número de threads LDM usados por **ndbmtd**"), conforme determinado pelo ajuste deste parâmetro. Esta proporção não deve ser maior que 4:1; uma configuração em que isso ocorre é especificamente desaconselhada.

  O número de threads LDM também determina o número de partições usadas por uma tabela `NDB` que não é particionada explicitamente; este é o número de threads LDM vezes o número de nós de dados no clúster. (Se **ndbd** for usado nos nós de dados em vez de **ndbmtd**"), então há sempre um único thread LDM; neste caso, o número de partições criadas automaticamente é simplesmente igual ao número de nós de dados. Consulte a Seção 25.2.2, “Nodos do clúster NDB, Grupos de nó, Replicas de fragmento e Partições”, para mais informações.

  Adicionar grandes espaços de tabela para tabelas de Dados de disco ao usar mais do número padrão de threads LDM pode causar problemas com o uso de recursos e CPU se o buffer de página de disco for insuficientemente grande; consulte a descrição do parâmetro de configuração `DiskPageBufferMemory` para mais informações.

Os tipos de fio são descritos mais adiante nesta seção (veja `ThreadConfig`).

Definir este parâmetro fora do intervalo de valores permitido faz com que o servidor de gerenciamento abordem o inicialização com o erro Erro linha *`número`*: Valor ilegal *`valor`* para o parâmetro MaxNoOfExecutionThreads.

Para `MaxNoOfExecutionThreads`, um valor de 0 ou 1 é arredondado para 2 internamente pelo `NDB`, de modo que 2 seja considerado o valor padrão e mínimo deste parâmetro.

`MaxNoOfExecutionThreads` é geralmente destinado a ser definido igual ao número de threads do CPU disponíveis, e a alocar um número de threads de cada tipo adequado para cargas de trabalho típicas. Ele não atribui threads específicas a CPUs especificadas. Para casos em que é desejável variar das configurações fornecidas, ou para vincular threads a CPUs, você deve usar `ThreadConfig`, que permite alocar cada thread diretamente a um tipo desejado, CPU ou ambos.

O processo do nó de dados multithread sempre gera, no mínimo, os threads listados aqui:

+ 1 thread de manipulador de consulta local (LDM)
+ 1 thread de recebimento
+ 1 thread de gerenciamento de subscrição (SUMA ou replicação)

Para um valor de `MaxNoOfExecutionThreads` de 8 ou menos, nenhum TC é criado, e o gerenciamento TC é realizado pelo thread principal.

Mudar o número de threads LDM normalmente requer um reinício do sistema, seja ele alterado usando este parâmetro ou `ThreadConfig`, mas é possível efetuar a mudança usando um reinício inicial do nó (*NI*) desde que sejam atendidas as duas condições seguintes:

+ Cada thread LDM lida com um máximo de 8 fragmentos, e
+ O número total de fragmentos de tabela é um múltiplo inteiro do número de threads LDM.

* `MaxSendDelay`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>47

Este parâmetro pode ser usado para fazer com que os nós de dados esperem momentaneamente antes de enviar dados para os nós de API; em algumas circunstâncias, descritas nos parágrafos seguintes, isso pode resultar em uma transmissão mais eficiente de volumes maiores de dados e um desempenho geral maior.

O `MaxSendDelay` pode ser útil quando há muitos nós de API no ponto de saturação ou próximo dele, o que pode resultar em ondas de desempenho crescente e decrescente. Isso ocorre quando os nós de dados conseguem enviar resultados de volta aos nós de API de forma relativamente rápida, com muitos pacotes pequenos a serem processados, o que pode levar mais tempo para ser processado por byte em comparação com pacotes grandes, desacelerando assim os nós de API; mais tarde, os nós de dados começam a enviar pacotes maiores novamente.

Para lidar com esse tipo de cenário, você pode definir `MaxSendDelay` para um valor não nulo, o que ajuda a garantir que as respostas não sejam enviadas de volta aos nós da API tão rapidamente. Quando isso é feito, as respostas são enviadas imediatamente quando não há outro tráfego concorrente, mas quando há, definir `MaxSendDelay` faz com que os nós de dados esperem o tempo suficiente para garantir que enviem pacotes maiores. Na verdade, isso introduz um gargalo artificial no processo de envio, o que pode realmente melhorar significativamente o desempenho.

* `NoOfFragmentLogParts`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>48

  Defina o número de grupos de arquivos de log para logs de revisão pertencentes a este **ndbmtd"). O valor deste parâmetro deve ser definido igual ao número de threads LDM usadas por **ndbmtd")</span> como determinado pelo ajuste para `MaxNoOfExecutionThreads`. Uma configuração que use mais de 4 partes de log de revisão por LDM é desaconselhada.

  Veja a descrição de `MaxNoOfExecutionThreads` para mais informações.

* `NumCPUs`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (na NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>49

  Configure a configuração automática de threads para usar apenas esse número de CPUs. Não tem efeito se `AutomaticThreadConfig` não estiver habilitado.

* `PartitionsPerNode`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer">
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (na NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>50

  Define o número de partições usadas em cada nó ao criar uma nova tabela `NDB`. Isso permite evitar a divisão de tabelas em um número excessivo de partições quando o número de gestores de dados locais (LDMs) aumenta.

Embora seja possível definir esse parâmetro com diferentes valores em diferentes nós de dados e não há problemas conhecidos para fazer isso, também não é provável que isso seja vantajoso; por essa razão, recomenda-se simplesmente defini-lo uma vez, para todos os nós de dados, na seção `[ndbd default]` do arquivo global `config.ini`.

Se `ClassicFragmentation` estiver habilitado, qualquer configuração desse parâmetro será ignorada. (Lembre-se de que habilitar `AutomaticThreadConfig` desabilita `ClassicFragmentation`.)

* `ThreadConfig`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados `ExecuteOnComputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Descontinuado</th><td>Sim (em NDB 7.5)</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</td></tr></tbody></table>51

Este parâmetro é usado com **ndbmtd") para atribuir threads de diferentes tipos a diferentes CPUs. Seu valor é uma string cujo formato tem a seguinte sintaxe:

```
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

As chaves curtas (`{`...`}`) que cercam a lista de parâmetros são necessárias, mesmo que haja apenas um parâmetro na lista.

* `param` (parâmetro) especifica qualquer ou todas as seguintes informações:

  + O número de threads do tipo dado (`count`).

+ O conjunto de CPUs para o qual os threads do tipo especificado devem ser vinculados de forma não exclusiva. Isso é determinado por `cpubind` ou `cpuset`). `cpubind` faz com que cada thread seja vinculada (não exclusivamente) a uma CPU no conjunto; `cpuset` significa que cada thread é vinculada (não exclusivamente) ao conjunto de CPUs especificadas.

Em Solaris, você pode, em vez disso, especificar um conjunto de CPUs para o qual os threads do tipo especificado devem ser vinculados exclusivamente. `cpubind_exclusive` faz com que cada thread seja vinculada exclusivamente a uma CPU no conjunto; `cpuset_exclusive` significa que cada thread é vinculada exclusivamente ao conjunto de CPUs especificadas.

Apenas um dos `cpubind`, `cpuset`, `cpubind_exclusive` ou `cpuset_exclusive` pode ser fornecido em uma única configuração.

  + `spintime` determina o tempo de espera em microsegundos que a thread gasta girando antes de entrar em modo de espera.

    O valor padrão para `spintime` é o valor do parâmetro de configuração do nó de dados `SchedulerSpinTimer`.

    `spintime` não se aplica a threads de E/S, watchdog ou threads de construção de índice offline, e, portanto, não pode ser definido para esses tipos de threads.

  + `realtime` pode ser definido para 0 ou 1. Se definido para 1, os threads são executados com prioridade em tempo real. Isso também significa que `thread_prio` não pode ser definido.

    O parâmetro `realtime` é definido por padrão para o valor do parâmetro de configuração do nó de dados `RealtimeScheduler`.

    `realtime` não pode ser definido para threads de construção de índice offline.

  + Ao definir `nosend` para 1, você pode impedir que um thread `main`, `ldm`, `rep` ou `tc` ajude os threads de envio. Esse parâmetro é 0 por padrão e não pode ser usado com outros tipos de threads.

`thread_prio` é um nível de prioridade de thread que pode ser definido de 0 a 10, sendo 10 a maior prioridade. O padrão é 5. Os efeitos precisos deste parâmetro são específicos da plataforma e são descritos mais adiante nesta seção.

O nível de prioridade de thread não pode ser definido para threads de construção de índice offline.

**Configurações e efeitos de `thread\_prio` por plataforma.** A implementação de `thread_prio` difere entre Linux/FreeBSD, Solaris e Windows. Na lista a seguir, discutimos seus efeitos em cada uma dessas plataformas, uma após a outra:

+ *Linux e FreeBSD*: Mapeamos `thread_prio` para um valor a ser fornecido à chamada de sistema `nice`. Como um valor de niceness menor para um processo indica uma maior prioridade de processo, aumentar `thread_prio` tem o efeito de diminuir o valor `nice`.

**Tabela 25.12 Mapeamento de `thread\_prio` para valores de nice em Linux e FreeBSD**

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer tipo e informação de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></table>52

    Alguns sistemas operacionais podem permitir um nível máximo de niceness de processo de 20, mas isso não é suportado por todas as versões visadas; por essa razão, escolhemos 19 como o valor máximo de `nice` que pode ser definido.

+ *Solaris*: Definir `thread_prio` em Solaris define a prioridade FX do Solaris, com mapes conforme mostrado na tabela a seguir:

    **Tabela 25.13 Mapa de thread\_prio para prioridade FX em Solaris**

    <table frame="box" rules="all" summary="Parâmetro de tipo e valor de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>53

    A configuração de `thread_prio` de 9 é mapeada em Solaris para o valor especial de prioridade de thread FX 59, o que significa que o sistema operacional também tenta forçar o thread a rodar sozinho em seu próprio núcleo de CPU.

  + *Windows*: Mapeamos `thread_prio` para um valor de prioridade de thread do Windows passado para a função `SetThreadPriority()` da API do Windows. Esse mapeamento é mostrado na tabela a seguir:

    **Tabela 25.14 Mapa de thread\_prio para prioridade de thread do Windows**

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>54

O atributo *`type`* representa um tipo de thread do NDB. Os tipos de thread suportados e o intervalo de valores de `count` permitidos para cada um estão fornecidos na seguinte lista:

+ `ldm`: Manipulador de consultas local (`kernel block` `DBLQH`) que lida com os dados. Quanto mais threads LDM forem usadas, mais particionada a estrutura de dados se torna.

Quando `ClassicFragmentation` é definido como 0, o número de partições é independente do número de threads LDM e depende do valor de `PartitionsPerNode` em vez disso.) Cada thread LDM mantém seus próprios conjuntos de partições de dados e índice, bem como seu próprio log de revisão. `ldm` pode ser definido para qualquer valor no intervalo de 0 a 332, inclusive. Ao definir para 0, `main`, `rep` e `tc` também devem ser 0, e `recv` também deve ser definido para 1; isso faz com que **ndbmtd**") emule **ndbd**.

Cada fio LDM é normalmente agrupado com 1 fio de consulta para formar um grupo LDM. Um conjunto de 4 a 8 grupos LDM é agrupado em grupos round robin. Cada fio LDM pode ser auxiliado na execução por qualquer consulta ou fios no mesmo grupo round robin. O `NDB` tenta formar grupos round robin de forma que todos os fios em cada grupo round robin estejam bloqueados em CPUs que estejam ligadas ao mesmo cache L3, dentro dos limites da faixa indicada para o tamanho de um grupo round robin.

Mudar o número de fios LDM normalmente requer um reinício do sistema para ser eficaz e seguro para operações em cluster; essa exigência é relaxada em certos casos, conforme explicado mais adiante nesta seção. Isso também é verdadeiro quando isso é feito usando `MaxNoOfExecutionThreads`.

Adicionar grandes espaços de tabelas (centenas de gigabytes ou mais) para tabelas de Dados de Disco ao usar mais do número padrão de LDMs pode causar problemas com o uso de recursos e CPU se `DiskPageBufferMemory` não for suficientemente grande.

Se `ldm` não estiver incluído na string de valor `ThreadConfig`, um fio `ldm` é criado.

+ `query`: Um fio de consulta está vinculado a um LDM e, junto com ele, forma um grupo LDM; atua apenas em consultas `READ COMMITTED`. O número de fios de consulta deve ser definido para 0, 1, 2 ou 3 vezes o número de fios LDM. Fios de consulta não são usados, a menos que isso seja anulado definindo `query` para um valor não nulo, ou habilitando o parâmetro `AutomaticThreadConfig`.

Um fio de consulta também atua como um fio de recuperação (veja o próximo item), embora o inverso não seja verdadeiro.

Mudar o número de fios de consulta requer um reinício do nó.

+ `recover`: Um fio de recuperação restaura dados de um fragmento como parte de um LCP.

Mudar o número de fios de recuperação requer um reinício do nó.

+ `tc`: Fio do coordenador de transação (`DBTC` bloco do kernel) que contém o estado de uma transação em andamento. O número máximo de fios TC é de 128.

    Optimamente, cada nova transação pode ser atribuída a um novo fio TC. Na maioria dos casos, 1 fio TC por 2 fios LDM é suficiente para garantir que isso possa acontecer. Em casos em que o número de escritas é relativamente pequeno em comparação com o número de leituras, é possível que seja necessário apenas 1 fio TC por 4 fios LQH para manter os estados das transações. Por outro lado, em aplicações que realizam muitas atualizações, pode ser necessário que a proporção de fios TC para fios LDM se aproxime de 1 (por exemplo, 3 fios TC para 4 fios LDM).

    Definir `tc` para 0 faz com que o gerenciamento de TC seja feito pelo fio principal. Na maioria dos casos, isso é efetivamente o mesmo que definir para 1.

    Intervalo: 0-64

  + `main`: Dicionário de dados e coordenador de transação (`DBDIH` e `DBTC` blocos do kernel), fornecendo gerenciamento de esquema. Também é possível especificar zero ou dois fios principais.

    Intervalo: 0-2.

    Definir `main` para 0 e `rep` para 1 faz com que os blocos `main` sejam colocados no fio `rep`; o fio combinado é mostrado na tabela `ndbinfo.threads` como `main_rep`. Isso é efetivamente o mesmo que definir `rep` igual a 1 e `main` igual a 0.

    Também é possível definir tanto `main` quanto `rep` para 0, caso em que ambos os fios são colocados no primeiro fio `recv`; o fio combinado resultante é nomeado `main_rep_recv` na tabela `threads`.

    Se `main` for omitido da string de valor `ThreadConfig`, um fio `main` é criado.

+ `recv`: Thread de recebimento (`CMVMI` bloco do kernel). Cada thread de recebimento lida com um ou mais sockets para a comunicação com outros nós em um NDB Cluster, com um socket por nó. O NDB Cluster suporta múltiplas threads de recebimento; o máximo é de 16 dessas threads.

    Intervalo: 1 - 64.

    Se `recv` for omitido da string de valor `ThreadConfig`, uma thread `recv` é criada.

  + `send`: Thread de envio (`CMVMI` bloco do kernel). Para aumentar o desempenho, é possível realizar envios a partir de um ou mais threads separados e dedicados (máximo de 8).

    O uso de um número excessivo de threads de envio pode ter um efeito adverso na escalabilidade.

    Anteriormente, todos os threads gerenciavam seus próprios envios diretamente; isso ainda pode ser feito configurando o número de threads de envio para 0 (isso também acontece quando `MaxNoOfExecutionThreads` é definido menor que 10). Embora isso possa ter um impacto adverso no desempenho, também pode, em alguns casos, proporcionar uma latência diminuída.

    Intervalo:

    - 0 - 64
  + `rep`: Thread de replicação (`SUMA` bloco do kernel). Este thread também pode ser combinado com o thread principal (consulte as informações de intervalo).

    Intervalo: 0-1.

    Definir `rep` para 0 e `main` para 1 faz com que os blocos `rep` sejam colocados no thread `main`; o thread combinado é mostrado na tabela `ndbinfo.threads` como `main_rep`. Isso é efetivamente o mesmo que definir `main` igual a 1 e `rep` igual a 0.

    Também é possível definir tanto `main` quanto `rep` para 0, caso em que ambos os threads são colocados no primeiro thread `recv`; o thread combinado resultante é nomeado `main_rep_recv` na tabela `threads`.

    Se `rep` for omitido da string de valor `ThreadConfig`, uma thread `rep` é criada.

+ `io`: Operações do sistema de arquivos e outras operações diversas. Estas não são tarefas exigentes e são sempre tratadas como um grupo por uma única thread dedicada de E/S.

    Intervalo: apenas 1.

  + `watchdog`: Os parâmetros associados a este tipo são aplicados a vários threads, cada um com um uso específico. Estes threads incluem o thread `SocketServer`, que recebe configurações de conexão de outros nós; o thread `SocketClient`, que tenta configurar conexões com outros nós; e o thread watchdog, que verifica se os threads estão progredindo.

    Intervalo: apenas 1.

  + `idxbld`: Threads de construção de índice offline. Ao contrário dos outros tipos de thread listados anteriormente, que são permanentes, estes são threads temporários que são criados e usados apenas durante o reinício do nó ou do sistema, ou quando executa-se **ndb\_restore** `--rebuild-indexes`. Eles podem ser vinculados a conjuntos de CPU que se sobrepõem com conjuntos de CPU vinculados a tipos de thread permanentes.

    Os valores `thread_prio`, `realtime` e `spintime` não podem ser definidos para threads de construção de índice offline. Além disso, o `count` é ignorado para este tipo de thread.

    Se `idxbld` não for especificado, o comportamento padrão é o seguinte:

    - Threads de construção de índice offline não são vinculados se a thread de E/S também não for vinculada, e estes threads usam quaisquer núcleos disponíveis.

    - Se a thread de E/S for vinculada, então os threads de construção de índice offline são vinculados ao conjunto inteiro de threads vinculados, devido ao fato de que não deveriam haver outras tarefas para estes threads realizarem.

    Intervalo: 0 - 1.

Mudar `ThreadCOnfig` normalmente requer um reinício inicial do sistema, mas essa exigência pode ser relaxada sob certas circunstâncias:

+ Se, após a mudança, o número de threads LDM permanecer o mesmo que antes, é necessário apenas um simples reinício do nó (reinício em rolagem, ou *N*) para implementar a mudança.

+ Caso contrário (ou seja, se o número de threads LDM mudar), ainda é possível efetuar a mudança usando um reinício inicial do nó (*NI*) desde que sejam atendidas as duas seguintes condições:

    1. Cada thread LDM lida com um máximo de 8 fragmentos, e

    2. O número total de fragmentos da tabela é um múltiplo inteiro do número de threads LDM.

+ Em qualquer outro caso, é necessário um reinício inicial do sistema para alterar este parâmetro.

`NDB` pode distinguir entre os tipos de threads pelos seguintes critérios:

+ Se a thread é uma thread de execução. As threads do tipo `main`, `ldm`, `query`, `recv`, `rep`, `tc` e `send` são threads de execução; as threads `io`, `recover`, `watchdog` e `idxbld` não são consideradas threads de execução.

+ Se a alocação de threads para uma tarefa específica é permanente ou temporária. Atualmente, todos os tipos de threads, exceto `idxbld`, são considerados permanentes; as threads `idxbld` são consideradas threads temporárias.

Exemplos simples:

```
  ThreadConfig := entry[,entry[,...]]

  entry := type={param[,param[,...]]}

  type := ldm | query | recover | main | recv | send | rep | io | tc | watchdog | idxbld

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

Geralmente, é desejável, ao configurar o uso de threads para um host de nó de dados, reservar uma ou mais CPUs para o sistema operacional e outras tarefas. Assim, para uma máquina host com 24 CPUs, você pode querer usar 20 threads de CPU (restando 4 para outros usos), com 8 threads LDM, 4 threads TC (metade do número de threads LDM), 3 threads de envio, 3 threads de recebimento e 1 thread para cada uma das seguintes tarefas: gerenciamento de esquema, replicação assíncrona e operações de E/S. (Isso é quase a mesma distribuição de threads usada quando `MaxNoOfExecutionThreads` é definida como igual a 20.) O seguinte ajuste `ThreadConfig` realiza essas atribuições, além de vincular todas essas threads a CPUs específicas:

  ```
  # Example 1.

  ThreadConfig=ldm={count=2,cpubind=1,2},main={cpubind=12},rep={cpubind=11}

  # Example 2.

  Threadconfig=main={cpubind=0},ldm={count=4,cpubind=1,2,5,6},io={cpubind=3}
  ```

  Na maioria dos casos, é possível vincular a thread principal (gerenciamento de esquema) e a thread de E/S à mesma CPU, como fizemos no exemplo mostrado.

  O seguinte exemplo incorpora grupos de CPUs definidos usando `cpuset` e `cpubind`, além do uso da priorização de threads.

  ```
  ThreadConfig=ldm{count=8,cpubind=1,2,3,4,5,6,7,8},main={cpubind=9},io={cpubind=9}, \
  rep={cpubind=10},tc{count=4,cpubind=11,12,13,14},recv={count=3,cpubind=15,16,17}, \
  send{count=3,cpubind=18,19,20}
  ```

  Neste caso, criamos dois grupos LDM; o primeiro usa `cpubind` e o segundo usa `cpuset`. `thread_prio` e `spintime` são definidos com os mesmos valores para cada grupo. Isso significa que há oito threads LDM no total. (Você deve garantir que `NoOfFragmentLogParts` também esteja definido como 8.) As quatro threads TC usam apenas duas CPUs; é possível, ao usar `cpuset`, especificar menos CPUs do que threads no grupo. (Isso não é verdade para `cpubind`.) As threads de envio usam duas threads usando `cpubind` para vincular essas threads às CPUs 10 e 11. As threads principais e de replicação podem reutilizar essas CPUs.

Este exemplo mostra como `ThreadConfig` e `NoOfFragmentLogParts` podem ser configurados para um host com 24 CPUs e hyperthreading, deixando as CPUs 10, 11, 22 e 23 disponíveis para funções do sistema operacional e interrupções:

```
  ThreadConfig=ldm={count=4,cpuset=0-3,thread_prio=8,spintime=200}, \
  ldm={count=4,cpubind=4-7,thread_prio=8,spintime=200}, \
  tc={count=4,cpuset=8-9,thread_prio=6},send={count=2,thread_prio=10,cpubind=10-11}, \
  main={count=1,cpubind=10},rep={count=1,cpubind=11}
  ```

Os próximos exemplos incluem configurações para `idxbld`. Os dois primeiros demonstram como um conjunto de CPUs definido para `idxbld` pode se sobrepor aos especificados para outros tipos de threads (permanentes), o primeiro usando `cpuset` e o segundo usando `cpubind`:

```
  NoOfFragmentLogParts=10
  ThreadConfig=ldm={count=10,cpubind=0-4,12-16,thread_prio=9,spintime=200}, \
  tc={count=4,cpuset=6-7,18-19,thread_prio=8},send={count=1,cpuset=8}, \
  recv={count=1,cpuset=20},main={count=1,cpuset=9,21},rep={count=1,cpuset=9,21}, \
  io={count=1,cpuset=9,21,thread_prio=8},watchdog={count=1,cpuset=9,21,thread_prio=9}
  ```

O próximo exemplo especifica uma CPU para o thread de I/O, mas não para os threads de construção de índice:

```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1-8}

  ThreadConfig=main,ldm={count=1,cpubind=1},idxbld={count=1,cpubind=1}
  ```

Como o ajuste `ThreadConfig` mostrado acima apenas bloqueia os threads em oito núcleos numerados de 1 a 8, é equivalente ao ajuste mostrado aqui:

```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8}
  ```

Para aproveitar a estabilidade aprimorada que o uso de `ThreadConfig` oferece, é necessário garantir que as CPUs estejam isoladas e não sejam sujeitas a interrupções ou a serem agendadas para outras tarefas pelo sistema operacional. Em muitos sistemas Linux, você pode fazer isso configurando `IRQBALANCE_BANNED_CPUS` em `/etc/sysconfig/irqbalance` para `0xFFFFF0` e usando a opção de inicialização `isolcpus` em `grub.conf`. Para informações específicas, consulte a documentação do seu sistema operacional ou plataforma.

**Parâmetros de Configuração de Dados de Disco.** Os parâmetros de configuração que afetam o comportamento do Dados de Disco incluem os seguintes:

* `DiskPageBufferEntries`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>55

Este é o número de entradas de página (referências de página) a serem alocadas. É especificado como um número de 32K páginas em `DiskPageBufferMemory`. O padrão é suficiente para a maioria dos casos, mas você pode precisar aumentar o valor deste parâmetro se encontrar problemas com transações muito grandes nas tabelas de Dados do disco. Cada entrada de página requer aproximadamente 100 bytes.

* `DiskPageBufferMemory`

Isso determina a quantidade de espaço, em bytes, usado para cache de páginas no disco e é definido na seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`.

Se o valor para `DiskPageBufferMemory` for definido muito baixo em conjunto com o uso de mais do número padrão de threads LDM no `ThreadConfig` (por exemplo, `{ldm=6...}`), problemas podem surgir ao tentar adicionar um arquivo de dados grande (por exemplo, 500G) a uma tabela `NDB` baseada em disco, onde o processo leva um tempo indefinidamente longo, ocupando um dos núcleos da CPU.

Isso ocorre porque, como parte da adição de um arquivo de dados a um espaço de tabelas, as páginas de extensão são bloqueadas na memória em um thread adicional do trabalhador PGMAN, para acesso rápido de metadados. Ao adicionar um arquivo grande, esse trabalhador tem memória insuficiente para todos os metadados do arquivo de dados. Nesses casos, você deve aumentar `DiskPageBufferMemory` ou adicionar arquivos de espaço de tabelas menores. Você também pode precisar ajustar `DiskPageBufferEntries`.

Você pode consultar a tabela `ndbinfo.diskpagebuffer` para ajudar a determinar se o valor desse parâmetro deve ser aumentado para minimizar buscas desnecessárias no disco. Consulte a Seção 25.6.15.31, “A tabela ndbinfo diskpagebuffer”, para obter mais informações.

* `SharedGlobalMemory`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th style="width: 50%">Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Este parâmetro determina a quantidade de memória usada para os buffers de log, operações de disco (como solicitações de página e filas de espera), e metadados para espaços de tabelas, grupos de arquivos de log, arquivos `UNDO` e arquivos de dados. O pool de memória global compartilhada também fornece memória usada para atender aos requisitos de memória da opção `UNDO_BUFFER_SIZE` usada com as instruções `CREATE LOGFILE GROUP` e `ALTER LOGFILE GROUP`, incluindo qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`. `SharedGlobalMemory` pode ser definido na seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração `config.ini`, e é medido em bytes.

O valor padrão é `128M`.

* `DiskIOThreadPool`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NDB: Versão (ou posterior) e tipo ou unidades" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>58

Este parâmetro determina o número de threads não ligadas usadas para o acesso ao arquivo de dados do disco. Antes da introdução do `DiskIOThreadPool`, exatamente um thread era gerado para cada arquivo de dados do disco, o que poderia levar a problemas de desempenho, especialmente ao usar arquivos de dados muito grandes. Com o `DiskIOThreadPool`, você pode, por exemplo, acessar um único grande arquivo de dados usando vários threads trabalhando em paralelo.

Este parâmetro aplica-se apenas aos threads de E/S do Disk Data.

O valor ótimo para este parâmetro depende do seu hardware e configuração, e inclui esses fatores:

+ **Distribuição física dos arquivos de dados do Disk Data.** Você pode obter um melhor desempenho ao colocar os arquivos de dados, arquivos de log de desfazer e o sistema de arquivos do nó de dados em discos físicos separados. Se você fizer isso com alguns ou todos esses conjuntos de arquivos, então você pode (e deve) definir o `DiskIOThreadPool` mais alto para permitir que threads separados lidem com os arquivos em cada disco.

Você também deve desabilitar `DiskDataUsingSameDisk` ao usar um ou mais discos separados para os arquivos de dados do Disk Data; isso aumenta a taxa em que os pontos de verificação dos espaços de tabelas de dados do Disk Data podem ser realizados.

+ **Desempenho e tipos de disco.** O número de threads que podem ser acomodados para o manuseio de arquivos de Dados de Disco também depende da velocidade e do desempenho dos discos. Discos mais rápidos e maior capacidade de transferência permitem mais threads de E/S de disco. Nossos resultados de teste indicam que os discos de estado sólido podem lidar com muito mais threads de E/S de disco do que os discos convencionais, e, portanto, valores mais altos para `DiskIOThreadPool`.

    Também é recomendado diminuir `TimeBetweenGlobalCheckpoints` ao usar discos de estado sólido, especialmente aqueles que usam NVMe. Veja também os parâmetros de latência de Arquivos de Dados de Disco.

  O valor padrão para este parâmetro é 2.

* **Parâmetros do sistema de arquivos de arquivos de Dados de Disco do NDB.** Os parâmetros na lista a seguir permitem que os arquivos de Dados de Disco do NDB Cluster sejam colocados em diretórios específicos sem a necessidade de usar links simbólicos.

  + `FileSystemPathDD`

    <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados do computador ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>59

Se este parâmetro for especificado, então os arquivos de dados do NDB Cluster Disk e os arquivos de log de desfazer são colocados no diretório indicado. Isso pode ser sobrescrito para arquivos de dados, arquivos de log de desfazer ou ambos, especificando valores para `FileSystemPathDataFiles`, `FileSystemPathUndoFiles` ou ambos, conforme explicado para esses parâmetros. Também pode ser sobrescrito para arquivos de dados especificando um caminho na cláusula `ADD DATAFILE` de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`, e para arquivos de log de desfazer especificando um caminho na cláusula `ADD UNDOFILE` de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`. Se `FileSystemPathDD` não for especificado, então `FileSystemPath` é usado.

  + `FileSystemPathDataFiles`

    <table frame="box" rules="all" summary="Informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>60

Se este parâmetro for especificado, então os arquivos de dados do disco do NDB Cluster são colocados no diretório indicado. Isso substitui qualquer valor definido para `FileSystemPathDD`. Este parâmetro pode ser substituído para um arquivo de dados específico, especificando um caminho na cláusula `ADD DATAFILE` de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar esse arquivo de dados. Se `FileSystemPathDataFiles` não for especificado, então `FileSystemPathDD` é usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido definido).

Se um diretório `FileSystemPathDataFiles` for especificado para um dado nó de dados (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`), então iniciar esse nó de dados com `--initial` faz com que todos os arquivos no diretório sejam excluídos.

+ `FileSystemPathUndoFiles`

<table frame="box" rules="all" summary="Informações do parâmetro de configuração do nó de dados ExecuteOnComputer tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>61

Se este parâmetro for especificado, os arquivos de log de undo do disco do NDB Cluster são colocados no diretório indicado. Isso substitui qualquer valor definido para `FileSystemPathDD`. Este parâmetro pode ser substituído para um arquivo de dados específico, especificando um caminho na cláusula `ADD UNDO` de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP` usada para criar esse arquivo de dados. Se `FileSystemPathUndoFiles` não for especificado, então `FileSystemPathDD` é usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido definido).

Se um diretório `FileSystemPathUndoFiles` for especificado para um nó de dados específico (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`), então iniciar esse nó de dados com `--initial` faz com que todos os arquivos no diretório sejam excluídos.

Para mais informações, consulte a Seção 25.6.11.1, “Objetos de Dados do Disco do NDB Cluster”.

* **Parâmetros de criação de objetos de dados de disco.** Os dois parâmetros seguintes permitem que você, ao iniciar o cluster pela primeira vez, faça com que um grupo de arquivos de log de dados de disco, um espaço de tabelas ou ambos sejam criados sem o uso de instruções SQL.

  + `InitialLogFileGroup`

    <table frame="box" rules="all" summary="Informações do parâmetro de configuração do nó de dados `ExecuteOnComputer`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>62

Este parâmetro pode ser usado para especificar um grupo de arquivo de log que é criado ao realizar o início inicial do clúster. `InitialLogFileGroup` é especificado conforme mostrado aqui:

```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1,2,3,4,5,6,7,8}
  ```

O `name` do grupo de arquivo de log é opcional e tem como padrão `DEFAULT-LG`. O `undo_buffer_size` também é opcional; se omitido, tem como padrão `64M`. Cada *`file-specification`* corresponde a um arquivo de log de desfazer, e pelo menos um deve ser especificado na *`file-specification-list`*. Os arquivos de log de desfazer são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathUndoFiles`, assim como se tivessem sido criados como resultado de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`.

Considere o seguinte:

```
    InitialLogFileGroup = [name=name;] [undo_buffer_size=size;] file-specification-list

    file-specification-list:
        file-specification[; file-specification[; ...]]

    file-specification:
        filename:size
    ```

Isso é equivalente às seguintes instruções SQL:

```
    InitialLogFileGroup = name=LG1; undo_buffer_size=128M; undo1.log:250M; undo2.log:150M
    ```

Este grupo de arquivo de log é criado quando os nós de dados são iniciados com `--initial`.

Os recursos do grupo de arquivo de log inicial são adicionados ao pool de memória global juntamente com os indicados pelo valor de `SharedGlobalMemory`.

Este parâmetro, se usado, deve ser definido sempre na seção `[ndbd default]` do arquivo `config.ini`. O comportamento de um NDB Cluster quando valores diferentes são definidos em diferentes nós de dados não é definido.

+ `InitialTablespace`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NDB Cluster: versão (ou posterior) e tipo ou unidades" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th style="width: 50%">Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>
63

Este parâmetro pode ser usado para especificar um espaço de dados de tabela do NDB Cluster que é criado ao realizar o início inicial do clúster. `InitialTablespace` é especificado conforme mostrado aqui:

```
    CREATE LOGFILE GROUP LG1
        ADD UNDOFILE 'undo1.log'
        INITIAL_SIZE 250M
        UNDO_BUFFER_SIZE 128M
        ENGINE NDBCLUSTER;

    ALTER LOGFILE GROUP LG1
        ADD UNDOFILE 'undo2.log'
        INITIAL_SIZE 150M
        ENGINE NDBCLUSTER;
    ```

O *`name`* do espaço de dados é opcional e tem como padrão `DEFAULT-TS`. O *`extent_size` também é opcional; tem como padrão `1M`. A *`file-specification-list`* usa a mesma sintaxe mostrada com o parâmetro `InitialLogfileGroup`, a única diferença sendo que cada *`file-specification`* usado com `InitialTablespace` corresponde a um arquivo de dados. Pelo menos um deve ser especificado na *`file-specification-list`*. Os arquivos de dados são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathDataFiles`, assim como se tivessem sido criados como resultado de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`.

Por exemplo, considere a seguinte linha que especifica `InitialTablespace` na seção `[ndbd default]` do arquivo `config.ini` (assim como com `InitialLogfileGroup`, este parâmetro deve ser sempre definido na seção `[ndbd default]`, pois o comportamento de um NDB Cluster quando valores diferentes são definidos em diferentes nós de dados não é definido):

    ```
    InitialTablespace = [name=name;] [extent_size=size;] file-specification-list
    ```

    Isso é equivalente às seguintes instruções SQL:

    ```
    InitialTablespace = name=TS1; extent_size=8M; data1.dat:2G; data2.dat:4G
    ```

    Este tablespace é criado quando os nós de dados são iniciados com `--initial`, e pode ser usado sempre que criar tabelas de Dados de Disco do NDB Cluster posteriormente.

* **Parâmetros de latência de dados em disco.** Os dois parâmetros listados aqui podem ser usados para melhorar o tratamento de problemas de latência com tabelas de Dados de Disco do NDB Cluster.

  + `MaxDiskDataLatency`

    <table frame="box" rules="all" summary="Execução no parâmetro de configuração do nó de dados `data` da versão (ou posterior) da tabela" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>64

    Este parâmetro controla a latência média máxima permitida para o acesso ao disco (máximo de 8000 milissegundos). Quando esse limite é atingido, o `NDB` começa a abortar transações para diminuir a pressão sobre o subsistema de E/S de Dados de Disco. Use `0` para desabilitar a verificação de latência.

  + `DiskDataUsingSameDisk`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados do NDB: versão (ou posterior) e tipo ou unidades" width="35%"> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>nome</td> </tr> <tr> <th>Padrão</th> <td>[...]</td> </tr> <tr> <th>Intervalo</th> <td>...</td> </tr> <tr> <th>Desatualizado</th> <td>Sim (no NDB 7.5)</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr> </table> 65

Configure este parâmetro para `false` se seus espaços de tabelas de dados de disco usarem um ou mais discos separados. Isso permite que os pontos de verificação dos espaços de tabelas sejam executados em uma taxa mais alta do que a normalmente usada quando os discos são compartilhados.

Quando `DiskDataUsingSameDisk` é `true`, o `NDB` diminui a taxa de verificação de dados de disco sempre que um ponto de verificação em memória estiver em andamento para ajudar a garantir que a carga do disco permaneça constante.

**Erros de dados de disco e GCP Stop.**

Erros encontrados ao usar tabelas de dados de disco, como o Node *`nodeid`* matou este nó porque foi detectado um stop do GCP (erro 2303), são frequentemente referidos como "erros de stop do GCP". Tais erros ocorrem quando o log de redo não é descarregado no disco com rapidez suficiente; isso geralmente ocorre devido a discos lentos e throughput de disco insuficiente.

Você pode ajudar a evitar esses erros usando discos mais rápidos e colocando os arquivos de dados do disco em um disco separado do sistema de arquivos do nó de dados. Reduzir o valor de `TimeBetweenGlobalCheckpoints` tende a diminuir a quantidade de dados a serem escritos para cada ponto de verificação global, e assim pode oferecer alguma proteção contra transbordamentos do buffer do log de refazer ao tentar escrever um ponto de verificação global; no entanto, reduzir esse valor também permite menos tempo para escrever o GCP, então isso deve ser feito com cautela.

Além das considerações dadas para `DiskPageBufferMemory` como explicado anteriormente, também é muito importante que o parâmetro de configuração `DiskIOThreadPool` seja configurado corretamente; ter `DiskIOThreadPool` configurado muito alto é muito provável que cause erros de parada do GCP (Bug #37227).

As paradas do GCP podem ser causadas por tempos de espera de salvar ou confirmar; o parâmetro de configuração do nó de dados `TimeBetweenEpochsTimeout` determina o tempo de espera para confirmações. No entanto, é possível desabilitar ambos os tipos de tempos de espera configurando esse parâmetro para 0.

**Parâmetros para configurar a alocação de memória do buffer de envio.** A memória do buffer de envio é alocada dinamicamente de um pool de memória compartilhado entre todos os transportadores, o que significa que o tamanho do buffer de envio pode ser ajustado conforme necessário. (Anteriormente, o kernel NDB usava um buffer de envio de tamanho fixo para cada nó no clúster, que era alocado quando o nó começava e não podia ser alterado enquanto o nó estava em execução.) Os parâmetros de configuração do nó de dados `TotalSendBufferMemory` e `OverLoadLimit` permitem a configuração de limites para essa alocação de memória. Para mais informações sobre o uso desses parâmetros (assim como `SendBufferMemory`), consulte a Seção 25.4.3.14, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

* `ExtraSendBufferMemory`

Este parâmetro especifica a quantidade de memória de buffer de envio do transportador a ser alocada, além de qualquer valor definido usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambos.

* `TotalSendBufferMemory`

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste nó para a memória de buffer de envio compartilhada entre todos os transportadores configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é de 256KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 25.4.3.14, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

Veja também a Seção 25.6.7, “Adicionando Nodos de Dados do NDB Cluster Online”.

**Tratamento de super-compromisso do log de refazer.** É possível controlar o tratamento de operações de um nó de dados quando muito tempo é gasto para limpar logs de refazer no disco. Isso ocorre quando uma limpeza de log de refazer específico leva mais tempo do que `RedoOverCommitLimit` segundos, mais do que `RedoOverCommitCounter` vezes, fazendo com que quaisquer transações pendentes sejam abortadas. Quando isso acontece, o nó da API que enviou a transação pode lidar com as operações que deveriam ter sido comprometidas, seja agendando as operações e tentando-as novamente, ou abortando-as, conforme determinado por `DefaultOperationRedoProblemAction`. Os parâmetros de configuração do nó de dados para definir o tempo de espera e o número de vezes que ele pode ser excedido antes que o nó da API tome essa ação são descritos na lista a seguir:

* `RedoOverCommitCounter`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>66

  Quando o limite de recomeçar após o limite de commit (RedoOverCommitLimit) é excedido ao tentar escrever um log de recomeçar (redo) dado no disco, tantas vezes ou mais, quaisquer transações que não foram confirmadas como resultado são abortadas, e um nó da API onde qualquer uma dessas transações foi originada processa as operações que compõem essas transações de acordo com seu valor para `DefaultOperationRedoProblemAction` (enquanto enfileira as operações para serem re-providas ou as aborta).

* `RedoOverCommitLimit`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (em NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>67

Este parâmetro define um limite superior em segundos para tentar escrever um log de refazer dado no disco antes de expirar o tempo. O número de vezes que o nó de dados tenta descartar este log de refazer, mas leva mais tempo do que `RedoOverCommitLimit`, é mantido e comparado com `RedoOverCommitCounter`, e quando o descarte leva muito tempo, mais vezes do que o valor desse parâmetro, quaisquer transações que não foram comprometidas como resultado do tempo de espera para o descarte são abortadas. Quando isso ocorre, o nó da API onde qualquer uma dessas transações se originou lida com as operações que compõem essas transações de acordo com a configuração `DefaultOperationRedoProblemAction` (ele ou enfileira as operações para serem re-providas, ou as aborta).

**Controle de tentativas de reinício.** É possível exercer um controle fino sobre as tentativas de reinício por nós de dados quando eles falham ao começar a usar os parâmetros de configuração do nó de dados `MaxStartFailRetries` e `StartFailRetryDelay`.

`MaxStartFailRetries` limita o número total de tentativas de reposição feitas antes de desistir de iniciar o nó de dados, `StartFailRetryDelay` define o número de segundos entre as tentativas de reposição. Esses parâmetros estão listados aqui:

* `StartFailRetryDelay`

  <table frame="box" rules="all" summary="Informações do parâmetro de configuração do nó de dados ExecuteOnComputer tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>68

Use este parâmetro para definir o número de segundos entre as tentativas de reinício do nó de dados no evento de falha na inicialização. O padrão é 0 (sem atraso).

Tanto este parâmetro quanto `MaxStartFailRetries` são ignorados, a menos que `StopOnError` seja igual a 0.

* `MaxStartFailRetries`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de Reinício</th> <td><p> <span class="bold"><strong>Reinício do Sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>69

  Use este parâmetro para limitar o número de tentativas de reinício feitas pelo nó de dados no evento de falha na inicialização. O padrão é 3 tentativas.

  Tanto este parâmetro quanto `StartFailRetryDelay` são ignorados, a menos que `StopOnError` seja igual a 0.

**Parâmetros de estatísticas de índice NDB.**

Os parâmetros na lista a seguir estão relacionados à geração de estatísticas de índice NDB.

* `IndexStatAutoCreate`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>70

  Ative (defina igual a 1) ou desative (defina igual a 0) a coleta automática de estatísticas ao criar índices.

* `IndexStatAutoUpdate`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (em NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>71

  Ative (defina igual a 1) ou desative (defina igual a 0) o monitoramento de índices para alterações e inicie atualizações automáticas de estatísticas quando essas alterações forem detectadas. O grau de alteração necessário para ativar as atualizações é determinado pelas configurações das opções `IndexStatTriggerPct` e `IndexStatTriggerScale`.

* `IndexStatSaveSize`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>72

Espaço máximo em bytes permitido para as estatísticas salvas de qualquer índice dado nas tabelas de sistema `NDB` e no cache de memória **mysqld**.

Pelo menos uma amostra é sempre produzida, independentemente de qualquer limite de tamanho. Esse tamanho é escalado por `IndexStatSaveScale`.

O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, vezes 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escalonamento.

* `IndexStatSaveScale`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>73

O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, vezes 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escalonamento.

* `IndexStatTriggerPct`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer, tipo e informações de valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento completo e um reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>74

Mudança percentual nas atualizações que aciona uma atualização de estatísticas de índice. O valor é escalado por `IndexStatTriggerScale`. Você pode desativar esse gatilho completamente definindo `IndexStatTriggerPct` para 0.

* `IndexStatTriggerScale`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>75

  Aumente `IndexStatTriggerPct` por este valor vezes 0,01 para um grande índice. Um valor de 0 desativa a escala.

* `IndexStatUpdateDelay`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor">
    <tr>
      <th>Versão (ou superior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Descontinuado</th>
      <td>Sim (em NDB 7.5)</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
    </tr>
  </table>76

  Atraso mínimo em segundos entre as atualizações automáticas das estatísticas do índice para um determinado índice. Definir essa variável para 0 desativa qualquer atraso. O padrão é 60 segundos.

**Tipos de reinício.** As informações sobre os tipos de reinício usados pelas descrições dos parâmetros nesta seção são mostradas na tabela a seguir:

**Tabela 25.15 Tipos de reinício do clúster NDB**

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de dados ExecuteOnComputer: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>nome</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Descontinuado</th> <td>Sim (em NDB 7.5)</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema: </strong></span>Requer um desligamento e reinício completos do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>77