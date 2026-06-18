#### 25.4.3.6 Definindo nós de dados do cluster NDB

As seções `[ndbd]` e `[ndbd default]` são usadas para configurar o comportamento dos nós de dados do cluster.

`[ndbd]` e `[ndbd default]` são sempre usados como nomes de seção, independentemente de você estar usando os binários **ndbd** ou **ndbmtd** para os processos do nó de dados.

Existem muitos parâmetros que controlam os tamanhos dos buffers, os tamanhos dos pools, os tempos de espera, e assim por diante. O único parâmetro obrigatório é `HostName`; este deve ser definido na seção local `[ndbd]`.

O parâmetro `NoOfReplicas` deve ser definido na seção `[ndbd default]`, pois é comum a todos os nós de dados do Cluster. Não é estritamente necessário definir `NoOfReplicas`, mas é uma boa prática defini-lo explicitamente.

A maioria dos parâmetros do nó de dados é definida na seção `[ndbd default]`. Apenas os parâmetros explicitamente declarados como capazes de definir valores locais podem ser alterados na seção `[ndbd]`. Quando presentes, os parâmetros `HostName` e `NodeId` *devem* ser definidos na seção local `[ndbd]`, e não em nenhuma outra seção de `config.ini`. Em outras palavras, as configurações desses parâmetros são específicas para um nó de dados.

Para esses parâmetros que afetam o uso da memória ou os tamanhos dos buffers, é possível usar `K`, `M` ou `G` como sufixo para indicar unidades de 1024, 1024×1024 ou 1024×1024×1024. (Por exemplo, `100K` significa 100 × 1024 = 102400.)

Os nomes e valores dos parâmetros são ignorados pelo caso, a menos que sejam usados em um arquivo do MySQL Server `my.cnf` ou `my.ini`, caso em que são sensíveis ao caso.

Informações sobre os parâmetros de configuração específicos para as tabelas de NDB Cluster Disk Data podem ser encontradas mais adiante nesta seção (veja Parâmetros de configuração de dados de disco).

Todos esses parâmetros também se aplicam a **ndbmtd**") (a versão multithreading de **ndbd**). Três parâmetros adicionais de configuração de nó de dados — `MaxNoOfExecutionThreads`, `ThreadConfig` e `NoOfFragmentLogParts` — se aplicam apenas a **ndbmtd**") e não têm efeito quando usados com **ndbd**. Para mais informações, consulte Parâmetros de configuração de multithreading (ndbmtd"). Veja também a Seção 25.5.3, “ndbmtd — O daemon de nó de dados do NDB Cluster (multithreading”)").

**Identificação dos nós de dados.** O valor `NodeId` ou `Id` (ou seja, o identificador do nó de dados) pode ser atribuído na linha de comando quando o nó é iniciado ou no arquivo de configuração.

- `NodeId`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó NodeId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 48</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.18</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 144</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Um ID de nó único é usado como endereço do nó para todas as mensagens internas do cluster. Para os nós de dados, esse é um número inteiro no intervalo de 1 a 144, inclusive. Cada nó no cluster deve ter um identificador único.

  `NodeId` é o único nome de parâmetro suportado para usar ao identificar nós de dados.

- `ExecuteOnComputer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Isso se refere ao conjunto `Id` para um dos computadores definidos em uma seção `[computer]`.

  Importante

  Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

- O ID do nó para este nó só pode ser fornecido para conexões que o solicitarem explicitamente. Um servidor de gerenciamento que solicite qualquer ID de nó não pode usar este. Este parâmetro pode ser usado ao executar vários servidores de gerenciamento no mesmo host, e `HostName` não é suficiente para distinguir entre processos.

- `HostName`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Especificar este parâmetro define o nome do host do computador em que o nó de dados deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

- `ServerPort`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Cada nó no clúster usa uma porta para se conectar a outros nós. Por padrão, essa porta é alocada dinamicamente de forma a garantir que nenhum dos dois nós no mesmo computador do host receba o mesmo número de porta, portanto, normalmente não é necessário especificar um valor para este parâmetro.

  No entanto, se você precisar abrir portas específicas em um firewall para permitir a comunicação entre nós de dados e nós de API (incluindo nós SQL), você pode definir esse parâmetro para o número da porta desejada em uma seção `[ndbd]` ou (se você precisar fazer isso para vários nós de dados) na seção `[ndbd default]` do arquivo `config.ini`, e, em seguida, abrir a porta com esse número para conexões de entrada de nós SQL, nós de API ou ambos.

  Nota

  As conexões dos nós de dados aos nós de gerenciamento são feitas usando a porta de gerenciamento **ndb\_mgmd** (o `PortNumber` do servidor de gerenciamento), portanto, as conexões saindo dessa porta de qualquer nó de dados devem ser sempre permitidas.

- `TcpBind_INADDR_ANY`

  Definir este parâmetro para `TRUE` ou `1` vincula `IP_ADDR_ANY` de modo que as conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

- `NodeGroup`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Este parâmetro pode ser usado para atribuir um nó de dados a um grupo de nós específico. Ele é apenas de leitura quando o clúster é iniciado pela primeira vez e não pode ser usado para reatribuir um nó de dados a um grupo de nós diferente online. Geralmente, não é desejável usar este parâmetro na seção `[ndbd default]` do arquivo `config.ini`, e deve-se ter cuidado para não atribuir nós a grupos de nós de maneira que um número inválido de nós seja atribuído a quaisquer grupos de nós.

  O parâmetro `NodeGroup` é destinado principalmente para ser usado na adição de um novo grupo de nós a um NDB Cluster em execução sem a necessidade de realizar um reinício contínuo. Para isso, você deve configurá-lo para 65536 (o valor máximo). Você não precisa configurar um valor `NodeGroup` para todos os nós de dados do cluster, apenas para os nós que devem ser iniciados e adicionados ao cluster como um novo grupo de nós posteriormente. Para mais informações, consulte a Seção 25.6.7.3, “Adicionando Nodos de Dados do NDB Cluster Online: Exemplo Detalhado”.

- `LocationDomainId`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Atribui um nó de dados a um domínio de disponibilidade específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  - Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

  - A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

  - O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que, sempre que possível, os nós SQL e outros nós de API também se comuniquem com os nós de dados locais no mesmo domínio de disponibilidade.

  - O árbitro pode ser selecionado a partir de um domínio de disponibilidade no qual não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

  `LocationDomainId` aceita um valor inteiro entre 0 e 16, inclusive, com 0 sendo o valor padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

- `NoOfReplicas`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Este parâmetro global pode ser definido apenas na seção `[ndbd default]` e define o número de réplicas de fragmentos para cada tabela armazenada no clúster. Este parâmetro também especifica o tamanho dos grupos de nós. Um grupo de nós é um conjunto de nós que armazenam as mesmas informações.

  Os grupos de nós são formados implicitamente. O primeiro grupo de nós é formado pelo conjunto de nós de dados com os IDs de nó mais baixos, o próximo grupo de nós pelo conjunto dos próximos IDs de nó mais baixos, e assim por diante. Como exemplo, suponha que temos 4 nós de dados e que `NoOfReplicas` está definido como 2. Os quatro nós de dados têm IDs de nó 2, 3, 4 e

  5. Em seguida, o primeiro grupo de nós é formado pelos nós 2 e 3, e o segundo grupo de nós pelos nós 4 e 5. É importante configurar o clúster de tal forma que os nós dos mesmos grupos de nós não estejam localizados no mesmo computador, pois uma falha no hardware de um deles poderia fazer com que todo o clúster falhasse.

  Se não forem fornecidos IDs de nós, a ordem dos nós de dados será o fator determinante para o grupo de nós. Independentemente de atribuições explícitas serem feitas ou não, elas podem ser visualizadas na saída do comando `SHOW` do cliente de gerenciamento.

  O valor padrão para `NoOfReplicas` é 2. Esse é o valor recomendado para a maioria dos ambientes de produção. No NDB 8.0, definir o valor desse parâmetro para 3 ou 4 é totalmente testado e suportado em produção.

  Aviso

  Definir `NoOfReplicas` para 1 significa que há apenas uma única cópia de todos os dados do cluster; nesse caso, a perda de um único nó de dados faz com que o cluster falhe, pois não há cópias adicionais dos dados armazenados por esse nó.

  O número de nós de dados no clúster deve ser divisível pelo valor deste parâmetro. Por exemplo, se houver dois nós de dados, então `NoOfReplicas` deve ser igual a 1 ou 2, pois 2/3 e 2/4 produzem valores fracionários; se houver quatro nós de dados, então `NoOfReplicas` deve ser igual a 1, 2 ou 4.

- `DataDir`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde os arquivos de registro, arquivos de log, arquivos de PID e logs de erro são armazenados.

  O diretório de trabalho padrão é o diretório do processo do nó de dados.

- `FileSystemPath`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde todos os arquivos criados para metadados, logs REDO, logs UNDO (para tabelas de Dados de Disco) e arquivos de dados serão colocados. O padrão é o diretório especificado por `DataDir`.

  Nota

  Este diretório deve existir antes que o processo **ndbd** seja iniciado.

  A hierarquia de diretórios recomendada para o NDB Cluster inclui `/var/lib/mysql-cluster`, sob o qual é criado um diretório para o sistema de arquivos do nó. O nome deste subdiretório contém o ID do nó. Por exemplo, se o ID do nó for 2, este subdiretório será chamado de `ndb_2_fs`.

- `BackupDataDir`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>

  Este parâmetro especifica o diretório onde os backups serão armazenados.

  Importante

  A string '`/BACKUP`' é sempre anexada a esse valor. Por exemplo, se você definir o valor de `BackupDataDir` para `/var/lib/cluster-data`, então todos os backups serão armazenados em `/var/lib/cluster-data/BACKUP`. Isso também significa que a localização de backup padrão *efetiva* é o diretório nomeado `BACKUP` na localização especificada pelo parâmetro `FileSystemPath`.

##### Memória de dados, memória de índice e memória de string

`DataMemory` e `IndexMemory` são parâmetros `[ndbd]` que especificam o tamanho dos segmentos de memória usados para armazenar os registros reais e seus índices. Ao definir os valores para esses parâmetros, é importante entender como o `DataMemory` é usado, pois geralmente precisa ser atualizado para refletir o uso real pelo clúster.

Nota

`IndexMemory` está desatualizado e está sujeito à remoção em uma versão futura do NDB Cluster. Consulte as descrições a seguir para obter mais informações.

- `DataMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Este parâmetro define a quantidade de espaço (em bytes) disponível para armazenar registros do banco de dados. Toda a quantidade especificada por este valor é alocada na memória, portanto, é extremamente importante que a máquina tenha memória física suficiente para acomodá-la.

  A memória alocada por `DataMemory` é usada para armazenar tanto os registros quanto os índices. Há um sobrecarga de 16 bytes em cada registro; uma quantidade adicional é incorrida por cada registro porque ele é armazenado em uma página de 32 KB com uma sobrecarga de página de 128 bytes (veja abaixo). Há também uma pequena quantidade desperdiçada por página devido ao fato de que cada registro é armazenado em apenas uma página.

  Para atributos de tabela de tamanho variável, os dados são armazenados em páginas de dados separadas, alocadas a partir de `DataMemory`. Os registros de comprimento variável usam uma parte de tamanho fixo com um sobrecarga extra de 4 bytes para referenciar a parte de tamanho variável. A parte de tamanho variável tem uma sobrecarga de 2 bytes mais 2 bytes por atributo.

  No NDB 8.0, o tamanho máximo do registro é de 30000 bytes.

  Os recursos atribuídos a `DataMemory` são usados para armazenar todos os dados e índices. (Qualquer memória configurada como `IndexMemory` é automaticamente adicionada àquela usada por `DataMemory` para formar um conjunto de recursos comum.)

  O espaço de memória alocado por `DataMemory` consiste em páginas de 32 KB, que são alocadas para fragmentos de tabela. Cada tabela é normalmente dividida no mesmo número de fragmentos que há de nós de dados no clúster. Assim, para cada nó, há o mesmo número de fragmentos que estão definidos em `NoOfReplicas`.

  Uma vez que uma página tenha sido alocada, atualmente não é possível devolvê-la ao conjunto de páginas livres, exceto por meio da exclusão da tabela. (Isso também significa que as páginas `DataMemory` que foram alocadas a uma determinada tabela não podem ser usadas por outras tabelas.) Realizar a recuperação de um nó de dados também comprime a partição, pois todos os registros são inseridos em partições vazias de outros nós ativos.

  O espaço de memória `DataMemory` também contém informações de ANULAMENTO: Para cada atualização, uma cópia do registro não alterado é alocada no `DataMemory`. Há também uma referência a cada cópia nos índices da tabela ordenada. Os índices de hash únicos são atualizados apenas quando as colunas do índice único são atualizadas, caso em que uma nova entrada na tabela de índice é inserida e a entrada antiga é excluída após o commit. Por essa razão, também é necessário alocar memória suficiente para lidar com as maiores transações realizadas pelas aplicações que utilizam o clúster. Em qualquer caso, realizar algumas transações grandes não oferece vantagem em relação ao uso de muitas menores, pelas seguintes razões:

  - Grandes transações não são mais rápidas do que as menores

  - Grandes transações aumentam o número de operações perdidas e que precisam ser repetidas em caso de falha na transação

  - Transações grandes usam mais memória

  O valor padrão para `DataMemory` no NDB 8.0 é de 98 MB. O valor mínimo é de 1 MB. Não há tamanho máximo, mas, na realidade, o tamanho máximo deve ser adaptado para que o processo não comece a fazer swap quando o limite for atingido. Esse limite é determinado pela quantidade de RAM física disponível na máquina e pela quantidade de memória que o sistema operacional pode reservar para qualquer processo. Os sistemas operacionais de 32 bits geralmente são limitados a 2 a 4 GB por processo; os sistemas operacionais de 64 bits podem usar mais. Para grandes bancos de dados, pode ser preferível usar um sistema operacional de 64 bits por essa razão.

- `IndexMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  O parâmetro `IndexMemory` está desatualizado (e sujeito à remoção futura); qualquer memória atribuída a `IndexMemory` é alocada, em vez disso, para o mesmo pool que `DataMemory`, que é exclusivamente responsável por todos os recursos necessários para armazenar dados e índices na memória. No NDB 8.0, o uso de `IndexMemory` no arquivo de configuração do cluster aciona uma mensagem de aviso do servidor de gerenciamento.

  Você pode estimar o tamanho de um índice de hash usando esta fórmula:

  ```
    size  = ( (fragments * 32K) + (rows * 18) )
            * fragment_replicas
  ```

  `fragments` é o número de fragmentos, `fragment_replicas` é o número de réplicas de fragmentos (normalmente 2), e `rows` é o número de linhas. Se uma tabela tiver um milhão de linhas, oito fragmentos e duas réplicas de fragmentos, o uso esperado da memória do índice é calculado da seguinte forma:

  ```
    ((8 * 32K) + (1000000 * 18)) * 2 = ((8 * 32768) + (1000000 * 18)) * 2
    = (262144 + 18000000) * 2
    = 18262144 * 2 = 36524288 bytes = ~35MB
  ```

  As estatísticas do índice para índices ordenados (quando esses estão habilitados) são armazenadas na tabela `mysql.ndb_index_stat_sample`. Como essa tabela possui um índice de hash, isso aumenta o uso de memória do índice. Um limite superior para o número de linhas para um índice ordenado dado pode ser calculado da seguinte forma:

  ```
    sample_size= key_size + ((key_attributes + 1) * 4)

    sample_rows = IndexStatSaveSize
                  * ((0.01 * IndexStatSaveScale * log2(rows * sample_size)) + 1)
                  / sample_size
  ```

  Na fórmula anterior, `key_size` é o tamanho da chave de índice ordenada em bytes, `key_attributes` é o número de atributos na chave de índice ordenada e `rows` é o número de linhas na tabela base.

  Suponha que a tabela `t1` tenha 1 milhão de linhas e um índice ordenado chamado `ix1` em dois inteiros de quatro bytes. Além disso, suponha que `IndexStatSaveSize` e `IndexStatSaveScale` estejam configurados com seus valores padrão (32K e 100, respectivamente). Usando as fórmulas anteriores, podemos calcular da seguinte forma:

  ```
    sample_size = 8  + ((1 + 2) * 4) = 20 bytes

    sample_rows = 32K
                  * ((0.01 * 100 * log2(1000000*20)) + 1)
                  / 20
                  = 32768 * ( (1 * ~16.811) +1) / 20
                  = 32768 * ~17.811 / 20
                  = ~29182 rows
  ```

  O uso esperado da memória do índice é, portanto, 2 \* 18 \* 29182 = \~1050550 bytes.

  No NDB 8.0, o valor mínimo e o valor padrão para este parâmetro é 0 (zero).

- `StringMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Este parâmetro determina a quantidade de memória alocada para strings, como nomes de tabelas, e é especificado em uma seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`. Um valor entre `0` e `100` inclusivo é interpretado como um percentual do valor padrão máximo, que é calculado com base em vários fatores, incluindo o número de tabelas, tamanho máximo de nomes de tabelas, tamanho máximo de arquivos `.FRM`, `MaxNoOfTriggers`, tamanho máximo de nomes de colunas e valor padrão máximo de colunas.

  Um valor maior que `100` é interpretado como um número de bytes.

  O valor padrão é de 25 — ou seja, 25% do valor máximo padrão.

  Na maioria das circunstâncias, o valor padrão deve ser suficiente, mas quando você tem muitas tabelas `NDB` (1000 ou mais), é possível obter o erro 773 "Sem memória de string", por favor, modifique o parâmetro de configuração StringMemory: Erro permanente: Erro de esquema, nesse caso, você deve aumentar esse valor. `25` (25 por cento) não é excessivo e deve impedir que esse erro ocorra em todas as condições, exceto as mais extremas.

O exemplo a seguir ilustra como a memória é usada para uma tabela. Considere esta definição de tabela:

```
CREATE TABLE example (
  a INT NOT NULL,
  b INT NOT NULL,
  c INT NOT NULL,
  PRIMARY KEY(a),
  UNIQUE(b)
) ENGINE=NDBCLUSTER;
```

Para cada registro, há 12 bytes de dados mais 12 bytes de sobrecarga. Não ter colunas nulas economiza 4 bytes de sobrecarga. Além disso, temos dois índices ordenados nas colunas `a` e `b`, consumindo aproximadamente 10 bytes cada por registro. Há um índice de hash de chave primária na tabela base, usando aproximadamente 29 bytes por registro. A restrição de unicidade é implementada por uma tabela separada com `b` como chave primária e `a` como uma coluna. Essa outra tabela consome 29 bytes adicionais de memória de índice por registro na tabela `example`, além de 8 bytes de dados de registro mais 12 bytes de sobrecarga.

Assim, para um milhão de registros, precisamos de 58 MB de memória de índice para lidar com os índices de hash da chave primária e da restrição exclusiva. Também precisamos de 64 MB para os registros da tabela base e da tabela de índice exclusivo, além das duas tabelas de índice ordenado.

Você pode ver que os índices de hash ocupam uma quantidade razoável de espaço de memória; no entanto, eles fornecem acesso muito rápido aos dados em troca. Eles também são usados no NDB Cluster para lidar com restrições de unicidade.

Atualmente, o único algoritmo de particionamento é o hashing e os índices ordenados são locais a cada nó. Assim, os índices ordenados não podem ser usados para lidar com restrições de unicidade no caso geral.

Um ponto importante tanto para `IndexMemory` quanto para `DataMemory` é que o tamanho total do banco de dados é a soma de toda a memória de dados e toda a memória de índice para cada grupo de nós. Cada grupo de nós é usado para armazenar informações replicadas, então, se houver quatro nós com duas réplicas de fragmentação, haverá dois grupos de nós. Assim, o tamanho total da memória de dados disponível é 2 × `DataMemory` para cada nó de dados.

É altamente recomendável que `DataMemory` e `IndexMemory` sejam definidos com os mesmos valores para todos os nós. A distribuição de dados é uniforme em todos os nós do clúster, portanto, a quantidade máxima de espaço disponível para qualquer nó não pode ser maior que a do nó mais pequeno do clúster.

`DataMemory` pode ser alterado, mas diminuí-lo pode ser arriscado; isso pode facilmente levar a um nó ou até mesmo a um NDB Cluster inteiro que não consiga reiniciar devido à falta de espaço de memória suficiente. Aumentar esses valores deve ser aceitável, mas é recomendável que essas atualizações sejam realizadas da mesma maneira que uma atualização de software, começando com uma atualização do arquivo de configuração e, em seguida, reiniciando o servidor de gerenciamento, seguido pela reinicialização de cada nó de dados, uma a uma.

**MinFreePct.**

Uma proporção (padrão de 5%) dos recursos dos nós de dados, incluindo `DataMemory`, é mantida em reserva para garantir que o nó de dados não esgote sua memória ao realizar um reinício. Isso pode ser ajustado usando o parâmetro de configuração do nó de dados `MinFreePct` (padrão de 5).

<table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

As atualizações não aumentam a quantidade de memória de índice usada. As inserções entram em vigor imediatamente; no entanto, as linhas não são realmente excluídas até que a transação seja confirmada.

**Parâmetros da transação.** Os próximos parâmetros `[ndbd]` que discutimos são importantes porque afetam o número de transações paralelas e o tamanho das transações que podem ser processadas pelo sistema. `MaxNoOfConcurrentTransactions` define o número de transações paralelas possíveis em um nó. `MaxNoOfConcurrentOperations` define o número de registros que podem estar na fase de atualização ou bloqueados simultaneamente.

Ambos esses parâmetros (especialmente `MaxNoOfConcurrentOperations`) são provavelmente alvos para usuários que definem valores específicos e não usam o valor padrão. O valor padrão é definido para sistemas que utilizam transações pequenas, para garantir que esses não utilizem memória excessiva.

`MaxDMLOperationsPerTransaction` define o número máximo de operações de DML que podem ser realizadas em uma transação específica.

- `MaxNoOfConcurrentTransactions`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Cada nó de dados do cluster requer um registro de transação para cada transação ativa no cluster. A tarefa de coordenação das transações é distribuída entre todos os nós de dados. O número total de registros de transações no cluster é o número de transações em qualquer nó dado multiplicado pelo número de nós no cluster.

  Os registros de transação são alocados para servidores MySQL individuais. Cada conexão com um servidor MySQL requer pelo menos um registro de transação, além de um objeto de transação adicional por tabela acessada por essa conexão. Isso significa que um mínimo razoável para o número total de transações no clúster pode ser expresso como

  ```
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

  Suponha que haja 10 nós SQL usando o clúster. Uma única junção envolvendo 10 tabelas requer 11 registros de transação; se houver 10 junções desse tipo em uma transação, então 10 \* 11 = 110 registros de transação são necessários para essa transação, por servidor MySQL, ou 110 \* 10 = 1100 registros de transação no total. Espera-se que cada nó de dados possa lidar com TotalNoOfConcurrentTransactions / número de nós de dados. Para um NDB Cluster com 4 nós de dados, isso significaria definir `MaxNoOfConcurrentTransactions` em cada nó de dados para 1100 / 4 = 275. Além disso, você deve prever a recuperação em caso de falha, garantindo que um único grupo de nós possa acomodar todas as transações concorrentes; em outras palavras, que o MaxNoOfConcurrentTransactions de cada nó de dados seja suficiente para cobrir um número de transações igual a TotalNoOfConcurrentTransactions / número de grupos de nós. Se este clúster tiver um único grupo de nós, então `MaxNoOfConcurrentTransactions` deve ser definido para 1100 (o mesmo que o número total de transações concorrentes para todo o clúster).

  Além disso, cada transação envolve pelo menos uma operação; por essa razão, o valor definido para `MaxNoOfConcurrentTransactions` nunca deve ser maior que o valor de `MaxNoOfConcurrentOperations`.

  Este parâmetro deve ser definido com o mesmo valor para todos os nós de dados do cluster. Isso ocorre porque, quando um nó de dados falha, o nó mais antigo que sobrevive recria o estado da transação de todas as transações que estavam em andamento no nó falhado.

  É possível alterar esse valor usando um reinício contínuo, mas a quantidade de tráfego no clúster deve ser tal que não ocorram mais transações do que o menor dos níveis antigo e novo durante esse processo.

  O valor padrão é 4096.

- `MaxNoOfConcurrentOperations`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  É uma boa ideia ajustar o valor deste parâmetro de acordo com o tamanho e o número de transações. Ao realizar transações que envolvem apenas algumas operações e registros, o valor padrão deste parâmetro geralmente é suficiente. Realizar grandes transações que envolvem muitos registros geralmente exige que você aumente seu valor.

  Os registros são mantidos para cada transação que atualiza os dados do cluster, tanto no coordenador da transação quanto nos nós onde as atualizações reais são realizadas. Esses registros contêm informações de estado necessárias para encontrar registros de ANULAMENTO para o rollback, filas de bloqueio e outros fins.

  Este parâmetro deve ser definido no mínimo para o número de registros que serão atualizados simultaneamente nas transações, dividido pelo número de nós de dados do cluster. Por exemplo, em um cluster que tem quatro nós de dados e que deve lidar com uma atualização concorrente de um milhão de registros usando transações, você deve definir esse valor para 1.000.000 / 4 = 250.000. Para ajudar a fornecer resiliência contra falhas, é sugerido que você defina esse parâmetro para um valor suficientemente alto para permitir que um nó de dados individual lidere a carga para seu grupo de nós. Em outras palavras, você deve definir o valor igual a `total number of concurrent operations / number of node groups`. (No caso em que há um único grupo de nós, isso é o mesmo que o número total de operações concorrentes para todo o cluster.)

  Como cada transação sempre envolve pelo menos uma operação, o valor de `MaxNoOfConcurrentOperations` deve sempre ser maior ou igual ao valor de `MaxNoOfConcurrentTransactions`.

  As consultas que definem bloqueios também geram a criação de registros de operação. Alguns espaços extras são alocados dentro dos nós individuais para acomodar casos em que a distribuição não é perfeita pelos nós.

  Quando as consultas utilizam o índice de hash exclusivo, na verdade, são usados dois registros de operação por registro na transação. O primeiro registro representa a leitura na tabela de índice e o segundo lida com a operação na tabela base.

  O valor padrão é 32768.

  Este parâmetro, na verdade, lida com dois valores que podem ser configurados separadamente. O primeiro deles especifica quantos registros de operação devem ser colocados com o coordenador da transação. A segunda parte especifica quantos registros de operação devem ser locais para o banco de dados.

  Uma transação muito grande realizada em um clúster de oito nós requer tantos registros de operação no coordenador da transação quanto houver de leituras, atualizações e exclusões envolvidas na transação. No entanto, os registros de operação estão espalhados por todos os oito nós. Portanto, se for necessário configurar o sistema para uma transação muito grande, é uma boa ideia configurá-las separadamente. `MaxNoOfConcurrentOperations` é sempre usado para calcular o número de registros de operação na parte do coordenador da transação do nó.

  É importante também ter uma ideia dos requisitos de memória para os registros de operação. Esses consomem cerca de 1 KB por registro.

- `MaxNoOfLocalOperations`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Por padrão, este parâmetro é calculado como 1,1 × `MaxNoOfConcurrentOperations`. Esse ajuste é adequado para sistemas com muitas transações simultâneas, sem que nenhuma delas seja muito grande. Se houver a necessidade de lidar com uma transação muito grande de cada vez e houver muitos nós, é uma boa ideia substituir o valor padrão, especificando explicitamente esse parâmetro.

  Este parâmetro é desaconselhável no NDB 8.0 e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusará a iniciar.

- `MaxDMLOperationsPerTransaction`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Este parâmetro limita o tamanho de uma transação. A transação é abortada se exigir mais do que esse número de operações DML.

  O valor deste parâmetro não pode exceder o definido para `MaxNoOfConcurrentOperations`.

**Armazenamento temporário de transações.** O próximo conjunto de parâmetros `[ndbd]` é usado para determinar o armazenamento temporário ao executar uma instrução que faz parte de uma transação de cluster. Todos os registros são liberados quando a instrução é concluída e o cluster está aguardando o commit ou rollback.

Os valores padrão para esses parâmetros são adequados para a maioria das situações. No entanto, os usuários que precisam suportar transações envolvendo um grande número de linhas ou operações podem precisar aumentar esses valores para permitir um melhor paralelismo no sistema, enquanto os usuários cujas aplicações exigem transações relativamente pequenas podem diminuir os valores para economizar memória.

- `MaxNoOfConcurrentIndexOperations`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Para consultas que utilizam um índice de hash único, outro conjunto temporário de registros de operação é usado durante a fase de execução da consulta. Este parâmetro define o tamanho desse conjunto de registros. Assim, este registro é alocado apenas durante a execução de uma parte de uma consulta. Assim que essa parte for executada, o registro é liberado. O estado necessário para lidar com abortos e commits é gerenciado pelos registros de operação normais, onde o tamanho do conjunto é definido pelo parâmetro `MaxNoOfConcurrentOperations`.

  O valor padrão deste parâmetro é 8192. Somente em casos raros de paralelismo extremamente alto usando índices de hash únicos é que será necessário aumentar esse valor. É possível usar um valor menor e isso pode economizar memória se o DBA tiver certeza de que um alto grau de paralelismo não é necessário para o clúster.

  Este parâmetro é desaconselhável no NDB 8.0 e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusará a iniciar.

- `MaxNoOfFiredTriggers`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  O valor padrão de `MaxNoOfFiredTriggers` é 4000, o que é suficiente para a maioria das situações. Em alguns casos, ele pode até ser reduzido se o DBA estiver convencido de que a necessidade de paralelismo no clúster não é alta.

  Um registro é criado quando uma operação é realizada que afeta um índice de hash único. Inserir ou excluir um registro em uma tabela com índices de hash únicos ou atualizar uma coluna que faz parte de um índice de hash único aciona um inserção ou uma exclusão na tabela do índice. O registro resultante é usado para representar essa operação da tabela do índice enquanto espera que a operação original que a acionou seja concluída. Essa operação é de curta duração, mas ainda pode exigir um grande número de registros em seu pool para situações com muitas operações de escrita paralelas em uma tabela base que contém um conjunto de índices de hash únicos.

  Este parâmetro é desaconselhável no NDB 8.0 e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusará a iniciar.

- `TransactionBufferMemory`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  A memória afetada por este parâmetro é usada para rastrear operações realizadas ao atualizar tabelas de índice e ler índices únicos. Esta memória é usada para armazenar as informações da chave e da coluna para essas operações. Apenas raramente é necessário alterar o valor deste parâmetro em relação ao padrão.

  O valor padrão para `TransactionBufferMemory` é 1 MB.

  As operações de leitura e escrita normais utilizam um buffer semelhante, cujo uso é ainda mais de curta duração. O parâmetro de tempo de compilação `ZATTRBUF_FILESIZE` (encontrado em `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) definido para 4000 × 128 bytes (500KB). Um buffer semelhante para informações chave, `ZDATABUF_FILESIZE` (também em `Dbtc.hpp`) contém 4000 × 16 = 62,5KB de espaço de buffer. `Dbtc` é o módulo que lida com a coordenação das transações.

**Parâmetros de alocação de recursos de transação.** Os parâmetros na lista a seguir são usados para alocar recursos de transação no coordenador de transação (`DBTC`). Ao definir qualquer um desses parâmetros para o valor padrão (0), você dedica a memória de transação para 25% do uso estimado total do nó de dados para o recurso correspondente. Os valores máximos possíveis para esses parâmetros são normalmente limitados pela quantidade de memória disponível para o nó de dados; definir esses parâmetros não tem impacto no total de memória alocada para o nó de dados. Além disso, você deve ter em mente que eles controlam o número de registros internos reservados para o nó de dados, independentemente de qualquer configuração para `MaxDMLOperationsPerTransaction`, `MaxNoOfConcurrentIndexOperations`, `MaxNoOfConcurrentOperations`, `MaxNoOfConcurrentScans`, `MaxNoOfConcurrentTransactions`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans` ou `TransactionBufferMemory` (consulte Parâmetros de transação e Armazenamento temporário de transação).

- `ReservedConcurrentIndexOperations`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Número de operações de índice simultâneas com recursos dedicados em um nó de dados.

- `ReservedConcurrentOperations`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Número de operações simultâneas com recursos dedicados em coordenadores de transações em um nó de dados.

- `ReservedConcurrentScans`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Número de varreduras simultâneas com recursos dedicados em um nó de dados.

- `ReservedConcurrentTransactions`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Número de transações simultâneas com recursos dedicados em um nó de dados.

- `ReservedFiredTriggers`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Número de gatilhos que têm recursos dedicados em um nó ndbd (DB).

- `ReservedLocalScans`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Número de varreduras de fragmentos simultâneas com recursos dedicados em um nó de dados.

- `ReservedTransactionBufferMemory`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Espaço de buffer dinâmico (em bytes) para os dados de chave e atributo alocados a cada nó de dados.

- `TransactionMemory`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Importante

  Vários parâmetros de configuração são incompatíveis com `TransactionMemory`; não é possível definir nenhum desses parâmetros simultaneamente com `TransactionMemory`, e se você tentar fazê-lo, o servidor de gerenciamento não conseguirá iniciar (veja Parâmetros incompatíveis com TransactionMemory).

  Este parâmetro determina a memória (em bytes) alocada para as transações em cada nó de dados. A configuração da memória de transação é feita da seguinte forma:

  - Se `TransactionMemory` estiver definido, este valor é usado para determinar a memória de transação.

  - Caso contrário, a memória de transação é calculada como era antes da NDB 8.0.

  **Parâmetros incompatíveis com TransactionMemory.** Os seguintes parâmetros não podem ser usados simultaneamente com `TransactionMemory` e são desaconselhados no NDB 8.0:

  - `MaxNoOfConcurrentIndexOperations`
  - `MaxNoOfFiredTriggers`
  - `MaxNoOfLocalOperations`
  - `MaxNoOfLocalScans`

  Definir explicitamente qualquer um dos parâmetros listados acima quando `TransactionMemory` também foi definido no arquivo de configuração do cluster (`config.ini`) impede que o nó de gerenciamento seja iniciado.

  Para obter mais informações sobre a alocação de recursos nos nós de dados do NDB Cluster, consulte a Seção 25.4.3.13, “Gestão de Memória do Nó de Dados”.

**Escaneios e bufferização.** Existem parâmetros adicionais `[ndbd]` no módulo `Dblqh` (em `ndb/src/kernel/blocks/Dblqh/Dblqh.hpp`) que afetam leituras e atualizações. Estes incluem `ZATTRINBUF_FILESIZE`, definido por padrão para 10000 × 128 bytes (1250KB) e `ZDATABUF_FILE_SIZE`, definido por padrão para 10000\*16 bytes (aproximadamente 156KB) de espaço de buffer. Até o momento, não houve relatos de usuários nem resultados de nossos próprios extensos testes que sugiram que nenhum desses limites de tempo de compilação deva ser aumentado.

- `BatchSizePerLocalScan`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados HostName" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>localhost</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um reinício contínuo do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Este parâmetro é usado para calcular o número de registros de bloqueio utilizados para lidar com operações de varredura concorrentes.

  `BatchSizePerLocalScan` tem uma forte conexão com o `BatchSize` definido nos nós SQL.

  Descontinuado na NDB 8.0.

- `LongMessageBuffer`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Este é um buffer interno usado para passar mensagens dentro de nós individuais e entre nós. O padrão é de 64 MB.

  Esse parâmetro raramente precisa ser alterado do padrão.

- `MaxFKBuildBatchSize`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Tamanho máximo do lote de varredura usado para criar chaves estrangeiras. Aumentar o valor definido para este parâmetro pode acelerar a criação de chaves estrangeiras, mas isso pode afetar negativamente o tráfego em andamento.

- `MaxNoOfConcurrentScans`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Este parâmetro é usado para controlar o número de varreduras paralelas que podem ser realizadas no clúster. Cada coordenador de transação pode lidar com o número de varreduras paralelas definido para este parâmetro. Cada consulta de varredura é realizada realizando uma varredura em todas as partições em paralelo. Cada varredura de partição usa um registro de varredura no nó onde a partição está localizada, com o número de registros sendo o valor deste parâmetro multiplicado pelo número de nós. O clúster deve ser capaz de sustentar `MaxNoOfConcurrentScans` varreduras simultâneas de todos os nós no clúster.

  Os scans são realizados em dois casos. O primeiro desses casos ocorre quando não existe hash ou índices ordenados para lidar com a consulta, nesse caso, a consulta é executada realizando um varredura completa da tabela. O segundo caso ocorre quando não existe índice hash para suportar a consulta, mas existe um índice ordenado. Usar o índice ordenado significa executar uma varredura paralela de intervalo. A ordem é mantida apenas nas partições locais, portanto, é necessário realizar a varredura do índice em todas as partições.

  O valor padrão de `MaxNoOfConcurrentScans` é 256. O valor máximo é 500.

- `MaxNoOfLocalScans`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Especifica o número de registros de varredura local, caso muitas varreduras não sejam totalmente paralelizadas. Quando o número de registros de varredura local não for fornecido, ele será calculado conforme mostrado aqui:

  ```
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

  Este parâmetro é desaconselhável no NDB 8.0 e está sujeito à remoção em uma futura versão do NDB Cluster. Além disso, este parâmetro é incompatível com o parâmetro `TransactionMemory`; se você tentar definir valores para ambos os parâmetros no arquivo de configuração do cluster (`config.ini`), o servidor de gerenciamento se recusará a iniciar.

- `MaxParallelCopyInstances`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Este parâmetro define a paralelização utilizada na fase de cópia de um reinício de nó ou de um reinício do sistema, quando um nó que está apenas começando é sincronizado com um nó que já tem os dados atuais, copiando quaisquer registros alterados do nó que está atualizado. Como a paralelização total nessas situações pode levar a situações de sobrecarga, o `MaxParallelCopyInstances` fornece uma maneira de diminuí-la. O valor padrão deste parâmetro é 0. Esse valor significa que a paralelização efetiva é igual ao número de instâncias do LDM no nó que está apenas começando, bem como no nó que está atualizando.

- `MaxParallelScansPerFragment`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  É possível configurar o número máximo de varreduras paralelas (varreduras `TUP` e `TUX`) permitidas antes que comecem a ficar na fila para serem processadas em série. Você pode aumentar esse valor para aproveitar qualquer CPU não utilizada ao realizar um grande número de varreduras em paralelo e melhorar seu desempenho.

- `MaxReorgBuildBatchSize`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Tamanho máximo do lote de varredura usado para reorganização de partições de tabela. Aumentar o valor definido para este parâmetro pode acelerar a reorganização, mas com um maior impacto no tráfego em andamento.

- `MaxUIBuildBatchSize`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Tamanho máximo do lote de varredura usado para criar chaves únicas. Aumentar o valor definido para este parâmetro pode acelerar essas compilações, mas isso pode afetar negativamente o tráfego em andamento.

##### Alocação de memória

`MaxAllocate`

<table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

Este parâmetro era usado em versões mais antigas do NDB Cluster, mas não tem efeito no NDB 8.0. Ele é desaconselhado a partir do NDB 8.0.27 e está sujeito à remoção em uma futura versão.

##### Transportadores múltiplos

A partir da versão 8.0.20, o `NDB` aloca vários transportadores para a comunicação entre pares de nós de dados. O número de transportadores alocados pode ser influenciado pela definição de um valor apropriado para o parâmetro `NodeGroupTransporters` introduzido nessa versão.

`NodeGroupTransporters`

<table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados ServerPort" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

Este parâmetro determina o número de transportadores usados entre nós no mesmo grupo de nós. O valor padrão (0) significa que o número de transportadores usados é o mesmo que o número de LDM no nó. Isso deve ser suficiente para a maioria dos casos de uso; portanto, raramente será necessário alterar esse valor do seu valor padrão.

Definir `NodeGroupTransporters` para um número maior que o número de threads LDM ou o número de threads TC, dependendo do que for maior, faz com que `NDB` use o máximo desses dois números de threads. Isso significa que um valor maior que esse é efetivamente ignorado.

##### Tamanho do Mapa de Hash

`DefaultHashMapSize`

<table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

O uso original previsto para este parâmetro era facilitar as atualizações e, especialmente, as desatualizações para e a partir de versões muito antigas com tamanhos de mapa de hash padrão diferentes. Isso não é um problema ao atualizar o NDB Cluster 7.3 (ou versões posteriores).

Atualmente, não é possível diminuir esse parâmetro online após a criação ou modificação de tabelas com `DefaultHashMapSize` igual a 3840.

**Registro e verificação de ponto de controle.** Os seguintes parâmetros `[ndbd]` controlam o comportamento do registro e do ponto de controle.

- `FragmentLogFileSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Definir este parâmetro permite que você controle diretamente o tamanho dos arquivos de registro de revisão. Isso pode ser útil em situações em que o NDB Cluster está operando sob uma carga alta e não consegue fechar os arquivos de log de fragmentação rapidamente o suficiente antes de tentar abrir novos (apenas 2 arquivos de log de fragmentação podem ser abertos de cada vez); aumentar o tamanho dos arquivos de log de fragmentação dá ao cluster mais tempo antes de ter que abrir cada novo arquivo de log de fragmentação. O valor padrão para este parâmetro é 16M.

  Para obter mais informações sobre os arquivos de registro de fragmentos, consulte a descrição para `NoOfFragmentLogFiles`.

- `InitialNoOfOpenFiles`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Este parâmetro define o número inicial de threads internas a serem alocadas para arquivos abertos.

  O valor padrão é 27.

- `InitFragmentLogFiles`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Por padrão, os arquivos de registro de fragmentos são criados de forma esparsa ao realizar o início inicial de um nó de dados — ou seja, dependendo do sistema operacional e do sistema de arquivos em uso, nem todos os bytes são necessariamente escritos no disco. No entanto, é possível sobrescrever esse comportamento e forçar que todos os bytes sejam escritos, independentemente da plataforma e do tipo de sistema de arquivos em uso, por meio deste parâmetro. `InitFragmentLogFiles` aceita um dos dois valores:

  - `SPARSE`. Os arquivos de registro de fragmentos são criados de forma esparsa. Este é o valor padrão.

  - `FULL`. Forçar que todos os bytes do arquivo de log do fragmento sejam escritos no disco.

  Dependendo do seu sistema operacional e do sistema de arquivos, definir `InitFragmentLogFiles=FULL` pode ajudar a eliminar erros de E/S durante a gravação no log de refazer.

- `EnablePartialLcp`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Quando `true`, habilite verificações locais parciais: Isso significa que cada LCP registra apenas parte do banco de dados completo, além de quaisquer registros que contenham linhas alteradas desde o último LCP; se nenhuma linha tiver sido alterada, o LCP atualiza apenas o arquivo de controle do LCP e não atualiza nenhum arquivo de dados.

  Se `EnablePartialLcp` estiver desativado (`false`), cada LCP usa apenas um único arquivo e grava um ponto de verificação completo; isso requer a menor quantidade de espaço em disco para os LCPs, mas aumenta a carga de escrita para cada LCP. O valor padrão está ativado (`true`). A proporção de espaço usada pelos LCPS parciais pode ser modificada pelo ajuste do parâmetro de configuração `RecoveryWork`.

  Para obter mais informações sobre os arquivos e diretórios usados para LCPs completos e parciais, consulte o diretório do sistema de arquivos do NDB Cluster Data Node.

  Definir este parâmetro para `false` também desabilita o cálculo da velocidade de escrita do disco utilizada pelo mecanismo de controle LCP adaptativo.

- `LcpScanProgressTimeout`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Um monitor de varredura de fragmentação de ponto de verificação local verifica periodicamente se não há progresso em cada varredura de fragmentação realizada como parte de um ponto de verificação local e desativa o nó se não houver progresso após um determinado período de tempo ter se passado. Esse intervalo pode ser definido usando o parâmetro de configuração do nó de dados `LcpScanProgressTimeout`, que define o tempo máximo em que o ponto de verificação local pode ficar parado antes que o monitor de varredura de fragmentação LCP desative o nó.

  O valor padrão é de 60 segundos (para garantir compatibilidade com versões anteriores). Definir esse parâmetro para 0 desativa completamente o monitoramento do rastreamento de fragmentos LCP.

- `MaxNoOfOpenFiles`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Este parâmetro define um limite para o número de threads internas a serem alocadas para arquivos abertos. *Qualquer situação que exija uma alteração neste parâmetro deve ser relatada como um erro*.

  O valor padrão é 0. No entanto, o valor mínimo para o qual este parâmetro pode ser definido é 20.

- `MaxNoOfSavedMessages`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Este parâmetro define o número máximo de erros escritos no log de erros, bem como o número máximo de arquivos de registro que serão mantidos antes de sobrescrever os existentes. Os arquivos de registro são gerados quando, por qualquer motivo, o nó falha.

  O padrão é 25, que define esses limites em 25 mensagens de erro e 25 arquivos de rastreamento.

- `MaxLCPStartDelay`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Na recuperação de nós de dados em paralelo, apenas os dados da tabela são realmente copiados e sincronizados em paralelo; a sincronização dos metadados, como dicionário e informações de ponto de verificação, é feita de forma serial. Além disso, a recuperação do dicionário e das informações de ponto de verificação não pode ser executada em paralelo com a realização de pontos de verificação locais. Isso significa que, ao iniciar ou reiniciar muitos nós de dados simultaneamente, os nós podem ser forçados a esperar enquanto um ponto de verificação local é realizado, o que pode resultar em tempos de recuperação dos nós mais longos.

  É possível forçar um atraso no ponto de verificação local para permitir que mais (e possivelmente todos) nós de dados completem a sincronização dos metadados; uma vez que a sincronização dos metadados de cada nó de dados esteja concluída, todos os nós de dados podem recuperar os dados da tabela em paralelo, mesmo enquanto o ponto de verificação local estiver sendo executado. Para forçar esse atraso, defina `MaxLCPStartDelay`, que determina o número de segundos que o clúster pode esperar para iniciar um ponto de verificação local enquanto os nós de dados continuam a sincronizar os metadados. Este parâmetro deve ser definido na seção `[ndbd default]` do arquivo `config.ini`, para que seja o mesmo para todos os nós de dados. O valor máximo é 600; o padrão é 0.

- `NoOfFragmentLogFiles`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó do NodeGroup" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Este parâmetro define o número de arquivos de registro REDO para o nó e, portanto, a quantidade de espaço alocada para o registro REDO. Como os arquivos de registro REDO são organizados em um anel, é extremamente importante que os primeiros e últimos arquivos de registro do conjunto (às vezes referidos como os arquivos de registro "cabeça" e "cauda", respectivamente) não se encontrem. Quando eles se aproximam muito um do outro, o nó começa a abortar todas as transações que envolvem atualizações devido à falta de espaço para novos registros de log.

  Um registro de log `REDO` não é removido até que ambos os pontos de verificação locais exigidos tenham sido concluídos desde que esse registro de log foi inserido. A frequência de verificação é determinada por seu próprio conjunto de parâmetros de configuração discutidos em outras partes deste capítulo.

  O valor padrão do parâmetro é 16, o que significa, por padrão, 16 conjuntos de 4 arquivos de 16 MB, totalizando 1024 MB. O tamanho dos arquivos de log individuais é configurável usando o parâmetro `FragmentLogFileSize`. Em cenários que exigem muitas atualizações, o valor para `NoOfFragmentLogFiles` pode precisar ser ajustado para valores tão altos quanto 300 ou até mais para fornecer espaço suficiente para os logs REDO.

  Se o checkpoint estiver lento e houver muitas escritas no banco de dados, os arquivos de log estiverem cheios e a cauda do log não puder ser cortada sem comprometer a recuperação, todas as transações de atualização serão abortadas com o código de erro interno 410 (`Out of log file space temporarily`). Esta condição prevalece até que um checkpoint seja concluído e a cauda do log possa ser movida para frente.

  Importante

  Este parâmetro não pode ser alterado “em tempo real”; você deve reiniciar o nó usando `--initial`. Se você deseja alterar esse valor para todos os nós de dados em um clúster em execução, pode fazê-lo usando um reinício de nó em rolagem (usando `--initial` ao iniciar cada nó de dados).

- `RecoveryWork`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Porcentagem de overhead de armazenamento para arquivos LCP. Este parâmetro só tem efeito quando `EnablePartialLcp` é verdadeiro, ou seja, apenas quando os pontos de verificação locais parciais estão habilitados. Um valor maior significa:

  - Menos registros são escritos para cada LCP, os LCPs usam mais espaço

  - Mais trabalho é necessário durante os reinícios

  Um valor menor para `RecoveryWork` significa:

  - Mais registros são escritos durante cada LCP, mas os LCPs exigem menos espaço no disco.

  - Menos trabalho durante o reinício e, portanto, reinícios mais rápidos, em detrimento de mais trabalho durante as operações normais

  Por exemplo, definir `RecoveryWork` para 60 significa que o tamanho total de um LCP é aproximadamente 1 + 0,6 = 1,6 vezes o tamanho dos dados a serem checkpointeados. Isso significa que é necessário realizar 60% mais trabalho durante a fase de restauração de um reinício em comparação com o trabalho realizado durante um reinício que usa pontos de verificação completos. (Isso é mais do que compensado durante outras fases do reinício, de modo que o reinício como um todo ainda é mais rápido ao usar LCPs parciais do que ao usar LCPs completos.) Para não encher o log de refazer, é necessário escrever na taxa de 1 + (1 / `RecoveryWork`) vezes a taxa de mudanças de dados durante os checkpoints — assim, quando `RecoveryWork` = 60, é necessário escrever aproximadamente 1 + (1 / 0,6) = 2,67 vezes a taxa de mudança. Em outras palavras, se as mudanças estão sendo escritas a 10 Mbytes por segundo, o checkpoint precisa ser escrito aproximadamente a 26,7 Mbytes por segundo.

  Definir `RecoveryWork` = 40 significa que é necessário apenas 1,4 vezes o tamanho total do LCP (e, assim, a fase de restauração leva 10 a 15% menos tempo. Neste caso, a taxa de escrita do ponto de verificação é 3,5 vezes a taxa de mudança.

  A distribuição de fonte do NDB inclui um programa de teste para simular LCPs. `lcp_simulator.cc` pode ser encontrado em `storage/ndb/src/kernel/blocks/backup/`. Para compilar e executá-lo em plataformas Unix, execute os comandos mostrados aqui:

  ```
  $> gcc lcp_simulator.cc
  $> ./a.out
  ```

  Este programa não depende de outros componentes além de `stdio.h` e não requer uma conexão a um cluster NDB ou a um servidor MySQL. Por padrão, ele simula 300 LCPs (três conjuntos de 100 LCPs, cada um composto por inserções, atualizações e exclusões, respectivamente), relatando o tamanho do LCP após cada um. Você pode alterar a simulação alterando os valores de `recovery_work`, `insert_work` e `delete_work` na fonte e recompilar. Para mais informações, consulte a fonte do programa.

- `InsertRecoveryWork`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Porcentagem de `RecoveryWork` usada para as linhas inseridas. Um valor maior aumenta o número de gravações durante um ponto de verificação local e diminui o tamanho total do LCP. Um valor menor diminui o número de gravações durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo. Este parâmetro tem efeito apenas quando `EnablePartialLcp` é verdadeiro, ou seja, apenas quando os pontos de verificação locais parciais estão habilitados.

- `EnableRedoControl`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Ative a velocidade adaptativa de verificação de ponto para controlar o uso do log de revisão.

  Quando ativado (padrão), `EnableRedoControl` permite que os nós de dados tenham maior flexibilidade em relação à taxa na qual eles escrevem LCPs no disco. Mais especificamente, ativar este parâmetro significa que taxas de escrita mais altas podem ser empregadas, para que os LCPs possam completar e refazer logs e os logs possam ser reduzidos mais rapidamente, reduzindo assim o tempo de recuperação e os requisitos de espaço no disco. Essa funcionalidade permite que os nós de dados utilizem melhor a taxa mais alta de I/O e a maior largura de banda disponíveis em dispositivos de armazenamento de estado sólido modernos e protocolos, como unidades de estado sólido (SSDs) que utilizam Memória Não Volátil Expressa (NVMe).

  Quando o `NDB` é implantado em sistemas cujos I/O ou largura de banda estão limitados em relação aos que utilizam tecnologia de estado sólido, como os que usam discos rígidos convencionais (HDDs), o mecanismo `EnableRedoControl` pode facilmente saturar o subsistema de I/O, aumentando os tempos de espera para a entrada e saída de nós de dados. Em particular, isso pode causar problemas com as tabelas de Dados de Disco NDB que têm espaços de tabelas ou grupos de arquivos de log compartilhando um subsistema de I/O limitado com os arquivos LCP e arquivos de log de refazer do nó de dados; tais problemas podem incluir falha do nó ou do clúster devido a erros de parada do GCP. Defina `EnableRedoControl` para `false` para desabilitá-lo nessas situações. Definir `EnablePartialLcp` para `false` também desabilita o cálculo adaptativo.

**Objetos de metadados.** O próximo conjunto de parâmetros `[ndbd]` define os tamanhos dos pools para objetos de metadados, usados para definir o número máximo de atributos, tabelas, índices e objetos de gatilho usados por índices, eventos e replicação entre clusters.

Nota

Esses atuam apenas como "sugestões" para o grupo, e quaisquer que não sejam especificadas retornam aos valores padrão mostrados.

- `MaxNoOfAttributes`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Este parâmetro define um número máximo sugerido de atributos que podem ser definidos no cluster; como `MaxNoOfTables`, ele não é destinado a funcionar como um limite superior rígido.

  (Em versões mais antigas do NDB Cluster, esse parâmetro às vezes era tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava a confusões quando era possível \[ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfAttributes` atributos.)

  O valor padrão é 1000, com o valor mínimo possível sendo 32. O máximo é 4294967039. Cada atributo consome cerca de 200 bytes de armazenamento por nó devido ao fato de que todos os metadados são totalmente replicados nos servidores.

  Ao definir `MaxNoOfAttributes`, é importante se preparar antecipadamente para quaisquer declarações `ALTER TABLE` que você possa querer realizar no futuro. Isso ocorre porque, durante a execução de `ALTER TABLE` em uma tabela do NDB Cluster, são usados 3 vezes o número de atributos da tabela original, e uma boa prática é permitir o dobro desse valor. Por exemplo, se a tabela do NDB Cluster com o maior número de atributos (`greatest_number_of_attributes`) tiver 100 atributos, um bom ponto de partida para o valor de `MaxNoOfAttributes` seria `6 * greatest_number_of_attributes = 600`.

  Você também deve estimar o número médio de atributos por tabela e multiplicar esse valor por `MaxNoOfTables`. Se esse valor for maior que o valor obtido no parágrafo anterior, você deve usar o valor maior.

  Supondo que você possa criar todas as tabelas desejadas sem problemas, você também deve verificar se esse número é suficiente, tentando um `ALTER TABLE` real após configurar o parâmetro. Se isso não for bem-sucedido, aumente `MaxNoOfAttributes` por outro múltiplo de `MaxNoOfTables` e teste novamente.

- `MaxNoOfTables`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Um objeto de tabela é alocado para cada tabela e para cada índice de hash único no cluster. Este parâmetro define um número máximo sugerido de objetos de tabela para o conjunto como um todo; como `MaxNoOfAttributes`, ele não é destinado a funcionar como um limite superior rígido.

  (Em versões mais antigas do NDB Cluster, esse parâmetro às vezes era tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e às vezes levava a confusões quando era possível \[ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfTables` tabelas.)

  Para cada atributo que tem um tipo de dados `BLOB`, uma tabela extra é usada para armazenar a maioria dos dados `BLOB`. Essas tabelas também devem ser consideradas ao definir o número total de tabelas.

  O valor padrão deste parâmetro é 128. O mínimo é 8 e o máximo é 20320. Cada objeto de tabela consome aproximadamente 20 KB por nó.

  Nota

  A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

- `MaxNoOfOrderedIndexes`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Para cada índice solicitado no cluster, um objeto é alocado para descrever o que está sendo indexado e seus segmentos de armazenamento. Por padrão, cada índice assim definido também define um índice ordenado. Cada índice único e chave primária tem tanto um índice ordenado quanto um índice de hash. `MaxNoOfOrderedIndexes` define o número total de índices ordenados que podem estar em uso no sistema a qualquer momento.

  O valor padrão deste parâmetro é 128. Cada objeto de índice consome aproximadamente 10 KB de dados por nó.

  Nota

  A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

- `MaxNoOfUniqueHashIndexes`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Para cada índice único que não é uma chave primária, é alocada uma tabela especial que mapeia a chave única para a chave primária da tabela indexada. Por padrão, um índice ordenado também é definido para cada índice único. Para evitar isso, você deve especificar a opção `USING HASH` ao definir o índice único.

  O valor padrão é 64. Cada índice consome aproximadamente 15 KB por nó.

  Nota

  A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

- `MaxNoOfTriggers`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Atualizações internas, inserções e deletações de gatilhos são alocadas para cada índice de hash único. (Isso significa que três gatilhos são criados para cada índice de hash único.) No entanto, um índice *ordenado* requer apenas um único objeto de gatilho. Os backups também usam três objetos de gatilho para cada tabela normal no clúster.

  A replicação entre clusters também utiliza gatilhos internos.

  Este parâmetro define o número máximo de objetos de gatilho no cluster.

  O valor padrão é 768.

- `MaxNoOfSubscriptions`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Cada tabela `NDB` em um NDB Cluster requer uma assinatura no kernel NDB. Para alguns aplicativos da API NDB, pode ser necessário ou desejável alterar esse parâmetro. No entanto, para o uso normal com servidores MySQL atuando como nós SQL, não há necessidade de fazer isso.

  O valor padrão para `MaxNoOfSubscriptions` é 0, que é tratado como igual a `MaxNoOfTables`. Cada assinatura consome 108 bytes.

- `MaxNoOfSubscribers`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados LocationDomainId" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Este parâmetro é de interesse apenas quando se utiliza a Replicação em NDB Cluster. O valor padrão é 0. Antes da versão 8.0.26 do NDB, este era tratado como `2 * MaxNoOfTables`; a partir da versão 8.0.26, é tratado como `2 * MaxNoOfTables + 2 * [number of API nodes]`. Há uma assinatura por tabela `NDB` para cada um dos dois servidores MySQL (um atuando como a fonte de replicação e o outro como a replica). Cada assinante usa 16 bytes de memória.

  Ao usar replicação circular, replicação de múltiplas fontes e outras configurações de replicação que envolvem mais de 2 servidores MySQL, você deve aumentar esse parâmetro para o número de processos **mysqld** incluídos na replicação (geralmente, mas nem sempre, o mesmo número de clusters). Por exemplo, se você tiver uma configuração de replicação circular usando três NDB Clusters, com um **mysqld** conectado a cada cluster, e cada um desses processos **mysqld** atuar como fonte e como replica, você deve definir `MaxNoOfSubscribers` igual a `3 * MaxNoOfTables`.

  Para obter mais informações, consulte a Seção 25.7, “Replicação em NDB Cluster”.

- `MaxNoOfConcurrentSubOperations`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Este parâmetro define um limite para o número de operações que podem ser realizadas por todos os nós da API no clúster de uma só vez. O valor padrão (256) é suficiente para operações normais e pode precisar ser ajustado apenas em cenários em que há muitos nós da API executando um grande volume de operações simultaneamente.

**Parâmetros lógicos.** O comportamento dos nós de dados também é afetado por um conjunto de parâmetros `[ndbd]` que assumem valores lógicos. Esses parâmetros podem ser especificados como `TRUE` definindo-os iguais a `1` ou `Y`, e como `FALSE` definindo-os iguais a `0` ou `N`.

- `CompressedLCP`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Definir este parâmetro para `1` faz com que os arquivos de ponto de verificação locais sejam comprimidos. A compressão usada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de ponto de verificação não comprimidos. Os LCPs comprimidos podem ser habilitados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

  Importante

  Você não pode restaurar um ponto de verificação local compactado em um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

  O valor padrão é `0` (desativado).

  Antes da versão 8.0.29 do NDB, esse parâmetro não tinha efeito nas plataformas Windows (BUG#106075, BUG#33727690).

- `CrashOnCorruptedTuple`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Quando este parâmetro está ativado (o padrão), ele obriga um nó de dados a ser desligado sempre que encontrar uma tupla corrompida.

- `Diskless`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  É possível especificar tabelas do NDB Cluster como sem disco, o que significa que as tabelas não são gravadas em disco e não há registro de eventos. Essas tabelas existem apenas na memória principal. Uma consequência do uso de tabelas sem disco é que nem as tabelas nem os registros nessas tabelas sobrevivem a um crash. No entanto, ao operar no modo sem disco, é possível executar o **ndbd** em um computador sem disco.

  Importante

  Essa funcionalidade faz com que *todo* o cluster opere no modo sem disco.

  Quando essa funcionalidade estiver habilitada, o backup online do NDB Cluster será desativado. Além disso, não será possível iniciar parcialmente o cluster.

  `Diskless` está desativado por padrão.

- `EncryptedFileSystem`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Criptografar arquivos LCP e de espaço de tabela, incluindo logs de desfazer e logs de refazer. Desabilitado por padrão (`0`); configure para `1` para ativar.

  Importante

  Quando a criptografia do sistema de arquivos estiver habilitada, você deve fornecer uma senha para cada nó de dados ao iniciá-lo, usando uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`. Caso contrário, o nó de dados não poderá ser iniciado.

  Para obter mais informações, consulte a Seção 25.6.14, “Criptografia do Sistema de Arquivos para NDB Cluster”.

- `LateAlloc`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Aloque memória para este nó de dados após a conexão com o servidor de gerenciamento ter sido estabelecida. Ativado por padrão.

- `LockPagesInMainMemory`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Para vários sistemas operacionais, incluindo Solaris e Linux, é possível bloquear um processo na memória e, assim, evitar qualquer troca para o disco. Isso pode ser usado para ajudar a garantir as características em tempo real do clúster.

  Este parâmetro aceita um dos valores inteiros `0`, `1` ou `2`, que atuam conforme mostrado na lista a seguir:

  - `0`: Desabilita o bloqueio. Este é o valor padrão.

  - `1`: Realiza o bloqueio após a alocação de memória para o processo.

  - `2`: Realiza o bloqueio antes que a memória para o processo seja alocada.

  Se o sistema operacional não estiver configurado para permitir que usuários não privilegiados bloqueiem páginas, o processo do nó de dados que utilize este parâmetro pode precisar ser executado como root do sistema. (O `LockPagesInMainMemory` usa a função `mlockall`. A partir do kernel Linux 2.6.9, usuários não privilegiados podem bloquear a memória conforme definido por `max locked memory`. Para mais informações, consulte **ulimit -l** e <http://linux.die.net/man/2/mlock>].

  Nota

  Em versões mais antigas do NDB Cluster, esse parâmetro era um Booleano. `0` ou `false` era o ajuste padrão e desativava o bloqueio. `1` ou `true` ativava o bloqueio do processo após a alocação de sua memória. O NDB Cluster 8.0 trata `true` ou `false` como um erro para o valor desse parâmetro.

  Importante

  A partir da versão `glibc` 2.10, o `glibc` utiliza arenas por thread para reduzir a disputa por recursos de bloqueio em um pool compartilhado, o que consome memória real. De modo geral, um processo de nó de dados não precisa de arenas por thread, uma vez que ele não realiza nenhuma alocação de memória após a inicialização. (Essa diferença nos alocadores não parece afetar significativamente o desempenho.)

  O comportamento `glibc` é destinado a ser configurável via variável de ambiente `MALLOC_ARENA_MAX`, mas um erro nesse mecanismo antes da versão `glibc` 2.16 significava que essa variável não poderia ser definida para menos de 8, de modo que a memória desperdiçada não poderia ser recuperada. (Bug #15907219; veja também <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> para mais informações sobre esse problema.)

  Uma solução possível para este problema é usar a variável de ambiente `LD_PRELOAD` para pré-carregar uma biblioteca de alocação de memória `jemalloc` para substituir a fornecida com `glibc`.

- `ODirect`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Ativação deste parâmetro faz com que `NDB` tente usar `O_DIRECT` para gravações LCP, backups e logs de refazer, muitas vezes reduzindo o uso do **kswapd** e da CPU. Ao usar o NDB Cluster no Linux, ative `ODirect` se você estiver usando um kernel 2.6 ou posterior.

  `ODirect` está desativado por padrão.

- `ODirectSyncFlag`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Quando este parâmetro estiver habilitado, as gravações do log de refazer são realizadas de forma que cada gravação de sistema de arquivos concluída seja tratada como uma chamada para `fsync`. O ajuste deste parâmetro é ignorado se pelo menos uma das seguintes condições for verdadeira:

  - `ODirect` não está habilitado.

  - `InitFragmentLogFiles` está definido como `SPARSE`.

  Desativado por padrão.

- `RestartOnErrorInsert`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados NoOfReplicas" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 2</td> </tr><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.19</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>2</td> </tr><tr> <th>Gama</th> <td>1 - 4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, a limpeza e restauração do sistema de arquivos do clúster a partir de um backup e, em seguida, o reinício do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Essa funcionalidade é acessível apenas ao criar a versão de depuração, onde é possível inserir erros na execução de blocos individuais de código como parte do teste.

  Essa funcionalidade está desativada por padrão.

- `StopOnError`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Este parâmetro especifica se um processo de nó de dados deve sair ou realizar um reinício automático quando uma condição de erro for encontrada.

  O valor padrão deste parâmetro é 1; isso significa que, por padrão, um erro faz com que o processo do nó de dados seja interrompido.

  Quando um erro é encontrado e `StopOnError` é 0, o processo do nó de dados é reiniciado.

  Os usuários do MySQL Cluster Manager devem notar que, quando `StopOnError` é igual a 1, isso impede que o agente do MySQL Cluster Manager reinicie quaisquer nós de dados após realizar seu próprio reinício e recuperação. Consulte Iniciar e Parar o Agente no Linux para obter mais informações.

- `UseShm`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Ative uma conexão de memória compartilhada entre este nó de dados e o nó da API que também está sendo executado neste host. Defina para 1 para ativar.

##### Controle de Temporizadores, Intervalos e Paginação de Disco

Existem vários parâmetros `[ndbd]` que especificam tempos de espera e intervalos entre várias ações nos nós de dados do Cluster. A maioria dos valores de tempo de espera é especificada em milissegundos. Qualquer exceção a isso é mencionada quando aplicável.

- `TimeBetweenWatchDogCheck`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Para evitar que o fio principal fique preso em um loop infinito em algum momento, um fio "guarda-costas" verifica o fio principal. Este parâmetro especifica o número de milissegundos entre as verificações. Se o processo permanecer no mesmo estado após três verificações, o fio guarda-costas o encerra.

  Esse parâmetro pode ser facilmente alterado para fins de experimentação ou para se adaptar às condições locais. Pode ser especificado por nó, embora pareça haver pouca razão para isso.

  O tempo de espera padrão é de 6000 milissegundos (6 segundos).

- `TimeBetweenWatchDogCheckInitial`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Isso é semelhante ao parâmetro `TimeBetweenWatchDogCheck`, exceto que `TimeBetweenWatchDogCheckInitial` controla o tempo que passa entre os verificações de execução dentro de um nó de armazenamento nas fases de início precoce, durante as quais a memória é alocada.

  O tempo de espera padrão é de 6000 milissegundos (6 segundos).

- `StartPartialTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Este parâmetro especifica quanto tempo o cluster espera que todos os nós de dados estejam prontos antes que a rotina de inicialização do cluster seja acionada. Esse tempo de espera é usado para evitar uma inicialização parcial do cluster sempre que possível.

  Este parâmetro é substituído ao realizar um início inicial ou reinício inicial do clúster.

  O valor padrão é de 30000 milissegundos (30 segundos). 0 desabilita o tempo limite, caso em que o clúster só pode começar se todos os nós estiverem disponíveis.

- `StartPartitionedTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Se o clúster estiver pronto para começar após esperar `StartPartialTimeout` milissegundos, mas ainda estiver possivelmente em um estado particionado, o clúster aguarda até que esse tempo limite também tenha passado. Se `StartPartitionedTimeout` estiver definido como 0, o clúster aguarda indefinidamente (232−1 ms, ou aproximadamente 49,71 dias).

  Este parâmetro é substituído ao realizar um início inicial ou reinício inicial do clúster.

- `StartFailureTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Se um nó de dados não completar sua sequência de inicialização dentro do tempo especificado por este parâmetro, a inicialização do nó falha. Definir este parâmetro para 0 (o valor padrão) significa que nenhum tempo limite para o nó de dados é aplicado.

  Para valores não nulos, esse parâmetro é medido em milissegundos. Para nós de dados que contêm quantidades extremamente grandes de dados, esse parâmetro deve ser aumentado. Por exemplo, no caso de um nó de dados que contém vários gigabytes de dados, pode ser necessário um período de até 10−15 minutos (ou seja, de 600.000 a 1.000.000 de milissegundos) para realizar o reinício de um nó.

- `StartNoNodeGroupTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Quando um nó de dados é configurado com `Nodegroup = 65536`, ele é considerado não atribuído a nenhum grupo de nós. Quando isso é feito, o clúster aguarda `StartNoNodegroupTimeout` milissegundos, depois trata esses nós como se tivessem sido adicionados à lista passada para a opção `--nowait-nodes`, e começa. O valor padrão é `15000` (ou seja, o servidor de gerenciamento aguarda 15 segundos). Definir esse parâmetro igual a `0` significa que o clúster aguarda indefinidamente.

  `StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no clúster; por essa razão, você deve defini-lo sempre na seção `[ndbd default]` do arquivo `config.ini`, e não para nós de dados individuais.

  Consulte a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster Online”, para obter mais informações.

- `HeartbeatIntervalDbDb`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Um dos principais métodos para descobrir nós falhos é através do uso de batimentos cardíacos. Esse parâmetro indica com que frequência os sinais de batimento cardíaco são enviados e com que frequência é esperado recebê-los. Os batimentos cardíacos não podem ser desativados.

  Após perder quatro intervalos de batimento cardíaco consecutivos, o nó é declarado morto. Assim, o tempo máximo para descobrir uma falha através do mecanismo de batimento cardíaco é cinco vezes o intervalo de batimento cardíaco.

  O intervalo padrão do batimento cardíaco é de 5000 milissegundos (5 segundos). Este parâmetro não deve ser alterado drasticamente e não deve variar muito entre os nós. Se um nó usar 5000 milissegundos e o nó que o monitora usar 1000 milissegundos, obviamente o nó é declarado morto muito rapidamente. Este parâmetro pode ser alterado durante uma atualização de software online, mas apenas em incrementos pequenos.

  Veja também Comunicação de rede e latência, bem como a descrição do parâmetro de configuração `ConnectCheckIntervalDelay`.

- `HeartbeatIntervalDbApi`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados DataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Cada nó de dados envia sinais de batimentos cardíacos para cada servidor MySQL (nó SQL) para garantir que ele permaneça em contato. Se um servidor MySQL não enviar um sinal de batimento cardíaco a tempo, ele é declarado "morto", e, nesse caso, todas as transações em andamento são concluídas e todos os recursos são liberados. O nó SQL não pode se reconectar até que todas as atividades iniciadas pela instância MySQL anterior sejam concluídas. Os critérios de três batimentos cardíacos para essa determinação são os mesmos descritos no `HeartbeatIntervalDbDb`.

  O intervalo padrão é de 1500 milissegundos (1,5 segundo). Esse intervalo pode variar entre os nós de dados individuais, pois cada nó de dados monitora os servidores MySQL conectados a ele, independentemente de todos os outros nós de dados.

  Para obter mais informações, consulte Comunicação de rede e latência.

- `HeartbeatOrder`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  Os nós de dados enviam batimentos cardíacos uns para os outros de forma circular, onde cada nó de dados monitora o anterior. Se um batimento cardíaco não for detectado por um determinado nó de dados, esse nó declara o nó de dados anterior no círculo como "morto" (ou seja, não mais acessível pelo clúster). A determinação de que um nó de dados está morto é feita globalmente; em outras palavras, uma vez que um nó de dados é declarado morto, ele é considerado como tal por todos os nós do clúster.

  É possível que os batimentos cardíacos entre nós de dados localizados em diferentes hosts sejam muito lentos em comparação com os batimentos cardíacos entre outros pares de nós (por exemplo, devido a um intervalo de batimentos cardíacos muito baixo ou a um problema temporário de conexão), de modo que um nó de dados seja declarado como morto, mesmo que o nó ainda possa funcionar como parte do clúster.

  Nesse tipo de situação, pode ser que a ordem em que os batimentos cardíacos são transmitidos entre os nós de dados faça a diferença em relação à declaração de um nó de dados como morto ou não. Se essa declaração ocorrer desnecessariamente, isso pode, por sua vez, levar à perda desnecessária de um grupo de nós e, assim, a uma falha do clúster.

  Considere uma configuração em que existem 4 nós de dados A, B, C e D em execução em 2 computadores hospedeiros `host1` e `host2`, e que esses nós de dados compõem 2 grupos de nós, conforme mostrado na tabela a seguir:

  **Tabela 25.10 Quatro nós de dados A, B, C, D, operando em dois computadores hospedeiros host1, host2; cada nó de dados pertence a um dos dois grupos de nós.**

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  Suponha que os batimentos cardíacos sejam transmitidos na ordem A->B->C->D->A. Nesse caso, a perda do batimento cardíaco entre os hosts faz com que o nó B declare o nó A como morto e o nó C declare o nó B como morto. Isso resulta na perda do Grupo de Nodos 0, e assim o clúster falha. Por outro lado, se a ordem de transmissão for A->B->D->C->A (e todas as outras condições permanecerem como anteriormente declaradas), a perda do batimento cardíaco faz com que os nós A e D sejam declarados como mortos; nesse caso, cada grupo de nós tem um nó sobrevivente, e o clúster sobrevive.

  O parâmetro de configuração `HeartbeatOrder` permite que a ordem de transmissão de batimentos cardíacos seja configurada pelo usuário. O valor padrão para `HeartbeatOrder` é zero; permitindo que o valor padrão seja usado em todos os nós de dados, a ordem de transmissão de batimentos cardíacos é determinada por `NDB`. Se este parâmetro for usado, ele deve ser definido para um valor não nulo (máximo de 65535) para cada nó de dados no clúster, e este valor deve ser único para cada nó de dados; isso faz com que a transmissão de batimentos cardíacos prossiga do nó de dados para o nó de dados na ordem de seus valores de `HeartbeatOrder` do menor para o maior (e depois diretamente do nó de dados com o valor mais alto de `HeartbeatOrder` para o nó de dados com o valor mais baixo, para completar o círculo). Os valores não precisam ser consecutivos. Por exemplo, para forçar a ordem de transmissão de batimentos cardíacos A->B->D->C->A no cenário descrito anteriormente, você poderia definir os valores de `HeartbeatOrder` conforme mostrado aqui:

  **Tabela 25.11 Valores de HeartbeatOrder para forçar uma ordem de transição de heartbeat de A->B->D->C->A.**

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Para usar este parâmetro para alterar a ordem de transmissão do batimento cardíaco em um NDB Cluster em execução, você deve primeiro definir `HeartbeatOrder` para cada nó de dados no cluster no arquivo de configuração global (`config.ini`) (ou arquivos). Para fazer a mudança entrar em vigor, você deve realizar uma das seguintes ações:

  - Um desligamento completo e reinício de todo o clúster.
  - 2 reinicializações em rolagem do clúster consecutivas. *Todos os nós devem ser reiniciados na mesma ordem em ambas as reinicializações em rolagem*.

  Você pode usar `DUMP 908` para observar o efeito deste parâmetro nos logs dos nós de dados.

- `ConnectCheckIntervalDelay`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Este parâmetro permite a verificação de conexão entre os nós de dados após um deles ter falhado nas verificações de batimentos cardíacos por 5 intervalos de até `HeartbeatIntervalDbDb` milissegundos.

  Um nó de dados que não responder dentro de um intervalo de `ConnectCheckIntervalDelay` milissegundos é considerado suspeito e considerado morto após dois desses intervalos. Isso pode ser útil em configurações com problemas de latência conhecidos.

  O valor padrão para este parâmetro é 0 (desativado).

- `TimeBetweenLocalCheckpoints`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Este parâmetro é uma exceção, pois não especifica um tempo de espera antes de iniciar um novo ponto de verificação local; em vez disso, é usado para garantir que os pontos de verificação locais não sejam realizados em um clúster onde ocorrem relativamente poucas atualizações. Na maioria dos clústeres com taxas de atualização elevadas, é provável que um novo ponto de verificação local seja iniciado imediatamente após o anterior ter sido concluído.

  O tamanho de todas as operações de escrita executadas desde o início dos pontos de verificação locais anteriores é adicionado. Este parâmetro também é excecional porque é especificado como o logaritmo base-2 do número de palavras de 4 bytes, de modo que o valor padrão de 20 significa 4 MB (4 × 220) de operações de escrita, 21 significaria 8 MB, e assim por diante até um valor máximo de 31, que equivale a 8 GB de operações de escrita.

  Todas as operações de escrita no clúster são somadas. Definir `TimeBetweenLocalCheckpoints` para 6 ou menos significa que os pontos de verificação locais são executados continuamente sem pausa, independentemente da carga de trabalho do clúster.

- `TimeBetweenGlobalCheckpoints`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Quando uma transação é confirmada, ela é confirmada na memória principal em todos os nós nos quais os dados são espelhados. No entanto, os registros do log de transação não são descarregados no disco como parte do commit. O motivo por trás desse comportamento é que ter a transação confirmada com segurança em pelo menos duas máquinas hospedeiras autônomas deve atender a padrões razoáveis de durabilidade.

  É também importante garantir que até os piores casos — um crash completo do clúster — sejam tratados corretamente. Para garantir que isso aconteça, todas as transações que ocorrem dentro de um intervalo específico são colocadas em um ponto de verificação global, que pode ser visto como um conjunto de transações comprometidas que foram descarregadas no disco. Em outras palavras, como parte do processo de commit, uma transação é colocada em um grupo de registros de ponto de verificação global. Mais tarde, os registros do log desse grupo são descarregados no disco, e então todo o grupo de transações é comprometido de forma segura no disco em todos os computadores do clúster.

  No NDB 8.0, recomendamos que, ao usar discos de estado sólido (especialmente aqueles que utilizam NVMe) com tabelas de dados de disco, você reduza esse valor. Nesses casos, você também deve garantir que `MaxDiskDataLatency` esteja configurado em um nível adequado.

  Este parâmetro define o intervalo entre os pontos de verificação globais. O padrão é de 2000 milissegundos.

- `TimeBetweenGlobalCheckpointsTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Este parâmetro define o tempo máximo mínimo entre os pontos de verificação globais. O valor padrão é de 120000 milissegundos.

- `TimeBetweenEpochs`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Este parâmetro define o intervalo entre as épocas de sincronização para a replicação em cluster do NDB. O valor padrão é de 100 milissegundos.

  O `TimeBetweenEpochs` faz parte da implementação dos “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação de NDB Cluster.

- `TimeBetweenEpochsTimeout`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Este parâmetro define um tempo limite para as épocas de sincronização da replicação em cluster NDB. Se um nó não conseguir participar de um ponto de verificação global dentro do tempo determinado por este parâmetro, o nó é desligado. O valor padrão é 0; em outras palavras, o tempo limite está desativado.

  O `TimeBetweenEpochsTimeout` faz parte da implementação dos “micro-GCPs”, que podem ser usados para melhorar o desempenho da Replicação de NDB Cluster.

  O valor atual deste parâmetro e uma mensagem de alerta são escritos no log do cluster sempre que uma operação de salvamento do GCP leva mais de 1 minuto ou uma operação de commit do GCP leva mais de 10 segundos.

  Definir esse parâmetro para zero desabilita as paradas do GCP causadas por temporizadores de salvamento, temporizadores de commit ou ambos. O valor máximo possível para esse parâmetro é de 256000 milissegundos.

- `MaxBufferedEpochs`

  <table summary="Tipo e informações de valor do parâmetro de configuração do nó de dados FileSystemPath" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>DataDir</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  O número de épocas não processadas pelas quais um nó assinante pode ficar para trás. Exceder esse número faz com que o assinante que está atrasado seja desconectado.

  O valor padrão de 100 é suficiente para a maioria das operações normais. Se um nó assinante estiver atrasado o suficiente para causar desconexões, geralmente isso ocorre devido a problemas de rede ou de agendamento em relação a processos ou threads. (Em circunstâncias raras, o problema pode ser devido a um bug no cliente `NDB`.) Pode ser desejável definir o valor menor que o padrão quando as épocas forem mais longas.

  A desconexão impede que problemas do cliente afetem o serviço do nó de dados, que fica sem memória para bufferizar dados e, eventualmente, para desligar. Em vez disso, apenas o cliente é afetado como resultado da desconexão (por exemplo, eventos de intervalo no log binário), forçando o cliente a se reconectar ou reiniciar o processo.

- `MaxBufferedEpochBytes`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>0

  O número total de bytes alocados para buffer de épocas por este nó.

- `TimeBetweenInactiveTransactionAbortCheck`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>1

  O gerenciamento de tempo de espera é realizado verificando um temporizador em cada transação uma vez para cada intervalo especificado por este parâmetro. Assim, se este parâmetro for definido para 1000 milissegundos, cada transação é verificada para tempo de espera uma vez por segundo.

  O valor padrão é de 1000 milissegundos (1 segundo).

- `TransactionInactiveTimeout`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>2

  Este parâmetro define o tempo máximo permitido para o intervalo entre operações na mesma transação antes de a transação ser abortada.

  O valor padrão para este parâmetro é `4G` (também o máximo). Para um banco de dados em tempo real que precisa garantir que nenhuma transação mantenha os bloqueios por muito tempo, este parâmetro deve ser definido para um valor relativamente pequeno. Definir para 0 significa que o aplicativo nunca expira. A unidade é milissegundos.

- `TransactionDeadlockDetectionTimeout`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>3

  Quando um nó executa uma consulta que envolve uma transação, o nó aguarda a resposta dos outros nós do clúster antes de continuar. Este parâmetro define o tempo que a transação pode gastar executando dentro de um nó de dados, ou seja, o tempo que o coordenador da transação aguarda para cada nó de dados que participa da transação executar uma solicitação.

  A falha na resposta pode ocorrer por qualquer uma das seguintes razões:

  - O nó está "morto"
  - A operação entrou em fila de bloqueio
  - O nó solicitado para realizar a ação pode estar muito sobrecarregado.

  Este parâmetro de tempo de espera indica quanto tempo o coordenador de transações espera para a execução de uma consulta por outro nó antes de abortar a transação, e é importante tanto para o tratamento de falhas de nós quanto para a detecção de impasses.

  O valor padrão do tempo de espera é de 1200 milissegundos (1,2 segundos).

  O mínimo para este parâmetro é de 50 milissegundos.

- `DiskSyncSize`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>4

  Este é o número máximo de bytes a serem armazenados antes de descartar os dados para um arquivo de ponto de verificação local. Isso é feito para evitar o buffer de escrita, o que pode prejudicar significativamente o desempenho. Este parâmetro *não* é destinado a substituir `TimeBetweenLocalCheckpoints`.

  Nota

  Quando o `ODirect` está ativado, não é necessário definir o `DiskSyncSize`; na verdade, nesses casos, seu valor é simplesmente ignorado.

  O valor padrão é 4M (4 megabytes).

- `MaxDiskWriteSpeed`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>5

  Defina a taxa máxima de gravação no disco, em bytes por segundo, por pontos de verificação locais e operações de backup quando não houver reinicializações (por este nó de dados ou qualquer outro nó de dados) neste NDB Cluster.

  Para definir a taxa máxima de escrita em disco permitida enquanto este nó de dados estiver sendo reiniciado, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de escrita em disco permitida enquanto outros nós de dados estiverem sendo reiniciados, use `MaxDiskWriteSpeedOtherNodeRestart`. A velocidade mínima para a escrita em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

- `MaxDiskWriteSpeedOtherNodeRestart`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>6

  Defina a taxa máxima para gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup quando um ou mais nós de dados neste NDB Cluster estiverem reiniciando, exceto este nó.

  Para definir a taxa máxima de escrita em disco permitida enquanto este nó de dados estiver sendo reiniciado, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de escrita em disco permitida quando nenhum nó de dados estiver sendo reiniciado em nenhum lugar do clúster, use `MaxDiskWriteSpeed`. A velocidade mínima para a escrita em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

- `MaxDiskWriteSpeedOwnRestart`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>7

  Defina a taxa máxima de gravação no disco, em bytes por segundo, por pontos de verificação locais e operações de backup enquanto este nó de dados estiver sendo reiniciado.

  Para definir a taxa máxima de escrita em disco permitida enquanto outros nós de dados estão sendo reiniciados, use `MaxDiskWriteSpeedOtherNodeRestart`. Para definir a taxa máxima de escrita em disco permitida quando nenhum nó de dados está sendo reiniciado em nenhum lugar do clúster, use `MaxDiskWriteSpeed`. A velocidade mínima para a escrita em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

- `MinDiskWriteSpeed`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>8

  Defina a taxa mínima para gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup.

  As taxas máximas de gravação de discos permitidas para LCPs e backups sob várias condições são ajustáveis usando os parâmetros `MaxDiskWriteSpeed`, `MaxDiskWriteSpeedOwnRestart` e `MaxDiskWriteSpeedOtherNodeRestart`. Consulte as descrições desses parâmetros para obter mais informações.

- `ApiFailureHandlingTimeout`

  <table summary="Tipo e valor da configuração do parâmetro do nó de dados BackupDataDir" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>CaminhoDoSistemaDeArquivos</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um reinício contínuo do clúster; cada nó de dados deve ser reiniciado com [[<code>--initial</code>]]. (NDB 8.0.13)</p></td> </tr></tbody></table>9

  Especifica o tempo máximo (em segundos) que o nó de dados espera para que o tratamento de falha do nó de API seja concluído antes de escalar para o tratamento de falha do nó de dados.

  Adicionado na NDB 8.0.42.

- `ArbitrationTimeout`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>00

  Este parâmetro especifica quanto tempo os nós de dados esperam por uma resposta do árbitro a uma mensagem de arbitragem. Se isso for excedido, presume-se que a rede tenha se dividido.

  O valor padrão é de 7500 milissegundos (7,5 segundos).

- `Arbitration`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>01

  O parâmetro `Arbitration` permite a escolha de esquemas de arbitragem, correspondendo a um dos 3 valores possíveis para este parâmetro:

  - **Padrão.** Isso permite que a arbitragem prossiga normalmente, conforme determinado pelas configurações `ArbitrationRank` para os nós de gerenciamento e API. Este é o valor padrão.

  - **Desativado.** Definir `Arbitration = Disabled` na seção `[ndbd default]` do arquivo `config.ini` para realizar a mesma tarefa que definir `ArbitrationRank` para 0 em todos os nós de gerenciamento e API. Quando `Arbitration` é definido dessa maneira, quaisquer configurações de `ArbitrationRank` são ignoradas.

  - **Aguarde externo.** O parâmetro `Arbitration` também permite configurar a arbitragem de forma que o clúster espere até que o tempo determinado por `ArbitrationTimeout` tenha passado para que um aplicativo de gerenciamento de clúster externo realize a arbitragem em vez de lidar com ela internamente. Isso pode ser feito configurando `Arbitration = WaitExternal` na seção `[ndbd default]` do arquivo `config.ini`. Para obter os melhores resultados com a configuração `WaitExternal`, recomenda-se que `ArbitrationTimeout` seja duas vezes o intervalo necessário pelo gerenciador de clúster externo para realizar a arbitragem.

  Importante

  Este parâmetro deve ser usado apenas na seção `[ndbd default]` do arquivo de configuração do clúster. O comportamento do clúster não é especificado quando `Arbitration` é definido com diferentes valores para nós de dados individuais.

- `RestartSubscriberConnectTimeout`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>02

  Este parâmetro determina o tempo que um nó de dados espera para os nós de API que se subscrevem se conectarem. Quando esse tempo de espera expira, quaisquer nós de API "ausentes" são desconectados do clúster. Para desabilitar esse tempo de espera, defina `RestartSubscriberConnectTimeout` para 0.

  Embora este parâmetro seja especificado em milissegundos, o próprio tempo de espera é resolvido para o segundo inteiro mais próximo.

- `KeepAliveSendInterval`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>03

  A partir da versão 8.0.27 do NDB, é possível habilitar e controlar o intervalo entre os sinais de manutenção enviados entre os nós de dados, definindo este parâmetro. O valor padrão para `KeepAliveSendInterval` é de 60000 milissegundos (um minuto); definindo-o como 0, desativa os sinais de manutenção. Os valores entre 1 e 10, inclusive, são tratados como 10.

  Este parâmetro pode ser útil em ambientes que monitoram e desconectam conexões TCP inativas, podendo causar falhas desnecessárias nos nós de dados quando o clúster estiver inativo.

O intervalo de batimento cardíaco entre os nós de gerenciamento e os nós de dados é sempre de 100 milissegundos e não é configurável.

**Buffering e registro.** Vários parâmetros de configuração `[ndbd]` permitem que o usuário avançado tenha mais controle sobre os recursos usados pelos processos do nó e ajuste vários tamanhos de buffer conforme necessário.

Esses buffers são usados como interfaces do sistema de arquivos ao gravar registros de log no disco. Se o nó estiver em modo sem disco, esses parâmetros podem ser definidos para seus valores mínimos sem penalidade, devido ao fato de que as gravações no disco são "falsas" pela camada de abstração do sistema de arquivos do motor de armazenamento `NDB`.

- `UndoIndexBuffer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>04

  Este parâmetro definia anteriormente o tamanho do buffer do índice de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

  No NDB 8.0.27 e versões posteriores, o uso deste parâmetro no arquivo de configuração do cluster gera uma mensagem de aviso de depreciação; você deve esperar que ele seja removido em uma futura versão do NDB Cluster.

- `UndoDataBuffer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>05

  Este parâmetro definia anteriormente o tamanho do buffer de dados de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

  No NDB 8.0.27 e versões posteriores, o uso deste parâmetro no arquivo de configuração do cluster gera uma mensagem de aviso de depreciação; você deve esperar que ele seja removido em uma futura versão do NDB Cluster.

- `RedoBuffer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>06

  Todas as atividades de atualização também precisam ser registradas. O log REDO permite reproduzir essas atualizações sempre que o sistema for reiniciado. O algoritmo de recuperação NDB usa um ponto de verificação "duro" dos dados junto com o log UNDO e, em seguida, aplica o log REDO para reproduzir todas as alterações até o ponto de restauração.

  `RedoBuffer` define o tamanho do buffer no qual o log REDO é escrito. O valor padrão é de 32 MB; o valor mínimo é de 1 MB.

  Se esse buffer for muito pequeno, o mecanismo de armazenamento `NDB` emite o código de erro 1221 (buffers de log REDO sobrecarregados). Por essa razão, você deve ter cuidado ao tentar diminuir o valor de `RedoBuffer` como parte de uma alteração online na configuração do cluster.

  **ndbmtd")** aloca um buffer separado para cada thread do LDM (ver `ThreadConfig`). Por exemplo, com 4 threads do LDM, um nó de dados **ndbmtd")** na verdade tem 4 buffers e aloca `RedoBuffer` bytes para cada um deles, totalizando `4 * RedoBuffer` bytes.

- `EventLogBufferSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>07

  Controla o tamanho do buffer circular usado para eventos de log do NDB dentro dos nós de dados.

**Controle de mensagens de log.** Ao gerenciar o clúster, é muito importante ser capaz de controlar o número de mensagens de log enviadas para `stdout`. Para cada categoria de evento, existem 16 níveis de evento possíveis (numerados de 0 a 15). Definir o relatório de eventos para uma determinada categoria de evento no nível 15 significa que todos os relatórios de eventos nessa categoria são enviados para `stdout`; definir no nível 0 significa que não são feitos relatórios de eventos nessa categoria.

Por padrão, apenas a mensagem de inicialização é enviada para `stdout`, com os valores padrão do restante dos níveis de relatórios de eventos sendo definidos como 0. A razão para isso é que essas mensagens também são enviadas para o log do clúster do servidor de gerenciamento.

Um conjunto análogo de níveis pode ser definido para o cliente de gerenciamento para determinar quais níveis de evento devem ser registrados no log do clúster.

- `LogLevelStartup`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>08

  O nível de relatórios para eventos gerados durante o início do processo.

  O nível padrão é 1.

- `LogLevelShutdown`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>09

  O nível de relatórios para eventos gerados como parte do desligamento suave de um nó.

  O nível padrão é 0.

- `LogLevelStatistic`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>10

  O nível de relatórios para eventos estatísticos, como número de leituras da chave primária, número de atualizações, número de inserções, informações relacionadas ao uso do buffer, e assim por diante.

  O nível padrão é 0.

- `LogLevelCheckpoint`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>11

  O nível de relatórios para eventos gerados por pontos de verificação locais e globais.

  O nível padrão é 0.

- `LogLevelNodeRestart`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>12

  O nível de relatórios para eventos gerados durante o reinício do nó.

  O nível padrão é 0.

- `LogLevelConnection`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>13

  O nível de relatórios para eventos gerados por conexões entre nós do cluster.

  O nível padrão é 0.

- `LogLevelError`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>14

  O nível de relatórios para eventos gerados por erros e avisos pelo clúster como um todo. Esses erros não causam falhas em nenhum nó, mas ainda são considerados dignos de serem relatados.

  O nível padrão é 0.

- `LogLevelCongestion`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>15

  O nível de relatórios para eventos gerados por congestionamento. Esses erros não causam falha no nó, mas ainda são considerados dignos de serem relatados.

  O nível padrão é 0.

- `LogLevelInfo`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>16

  O nível de relatórios para eventos gerados para informações sobre o estado geral do cluster.

  O nível padrão é 0.

- `MemReportFrequency`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>17

  Este parâmetro controla a frequência com que os relatórios de uso da memória dos nós de dados são registrados no log do clúster; é um valor inteiro que representa o número de segundos entre os relatórios.

  O uso da memória de dados e da memória de índice de cada nó de dados é registrado tanto como uma porcentagem quanto como o número de páginas de `DataMemory` de 32 KB, conforme definido no arquivo `config.ini`. Por exemplo, se `DataMemory` for igual a 100 MB e um dado nó de dados estiver usando 50 MB para armazenamento de memória de dados, a linha correspondente no log do clúster pode parecer assim:

  ```
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

  `MemReportFrequency` não é um parâmetro obrigatório. Se usado, pode ser definido para todos os nós de dados do cluster na seção `[ndbd default]` de `config.ini`, e também pode ser definido ou substituído para nós de dados individuais nas seções correspondentes `[ndbd]` do arquivo de configuração. O valor mínimo — que também é o valor padrão — é 0, caso em que os relatórios de memória são registrados apenas quando o uso de memória atinge certos porcentagens (80%, 90% e 100%), conforme mencionado na discussão sobre eventos de estatísticas na Seção 25.6.3.2, “Eventos de Registro do NDB Cluster”.

- `StartupStatusReportFrequency`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>18

  Quando um nó de dados é iniciado com o `--initial`, ele inicia o arquivo de log de refazer durante a Fase de Início 4 (veja a Seção 25.6.4, “Resumo das Fases de Início do NDB Cluster”). Quando valores muito grandes são definidos para `NoOfFragmentLogFiles`, `FragmentLogFileSize` ou ambos, essa inicialização pode levar muito tempo. Você pode forçar que os relatórios sobre o progresso desse processo sejam registrados periodicamente, por meio do parâmetro de configuração `StartupStatusReportFrequency`. Nesse caso, o progresso é relatado no log do cluster, em termos de número de arquivos e quantidade de espaço que foram inicializados, conforme mostrado aqui:

  ```
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

  Esses relatórios são registrados a cada `StartupStatusReportFrequency` segundos durante a Fase de Início 4. Se `StartupStatusReportFrequency` for 0 (o padrão), então os relatórios são escritos no log do clúster apenas no início e no término do processo de inicialização do arquivo de log de refazer.

##### Parâmetros de depuração do nó de dados

Os seguintes parâmetros são destinados ao uso durante o teste ou depuração de nós de dados e não para uso em produção.

- `DictTrace`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>19

  É possível registrar traços para eventos gerados ao criar e excluir tabelas usando `DictTrace`. Este parâmetro é útil apenas no depuração do código do kernel NDB. `DictTrace` aceita um valor inteiro. 0 é o padrão e significa que não há registro; 1 habilita o registro de traços e 2 habilita o registro de saída de depuração adicional de `DBDICT`.

- `WatchDogImmediateKill`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>20

  Você pode fazer com que os threads sejam interrompidos imediatamente sempre que ocorrerem problemas no watchdog, habilitando o parâmetro de configuração do nó de dados `WatchDogImmediateKill`. Este parâmetro deve ser usado apenas durante a depuração ou solução de problemas, para obter arquivos de registro que relatam exatamente o que estava acontecendo no momento em que a execução foi interrompida.

**Parâmetros de backup.** Os parâmetros `[ndbd]` discutidos nesta seção definem buffers de memória reservados para a execução de backups online.

- `BackupDataBufferSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>21

  Ao criar um backup, são utilizados dois buffers para enviar dados para o disco. O buffer de dados do backup é usado para preencher os dados registrados ao digitalizar as tabelas de um nó. Uma vez que este buffer estiver preenchido até o nível especificado como `BackupWriteSize`, as páginas são enviadas para o disco. Enquanto o processo de gravação de dados para o disco, o processo de backup pode continuar preenchendo este buffer até esgotar o espaço. Quando isso acontece, o processo de backup pausa a digitalização e aguarda até que alguns escritos no disco tenham concluído a liberação de memória para que a digitalização possa continuar.

  O valor padrão para este parâmetro é 16 MB. O mínimo é 512 K.

- `BackupDiskWriteSpeedPct`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>22

  `BackupDiskWriteSpeedPct` só se aplica quando um backup é feito em um único fio. Com a introdução de backups em múltiplos fios no NDB 8.0.16, geralmente não é mais necessário ajustar esse parâmetro, que não tem efeito no caso de backups em múltiplos fios. A discussão a seguir é específica para backups em um único fio.

  Durante o funcionamento normal, os nós de dados tentam maximizar a velocidade de escrita no disco usada para verificações locais e backups, mantendo-se dentro dos limites definidos por `MinDiskWriteSpeed` e `MaxDiskWriteSpeed`. O controle de escrita no disco dá a cada fio LDM uma parcela igual do orçamento total. Isso permite que os LCPs paralelos ocorram sem exceder o orçamento de I/O do disco. Como um backup é executado por apenas um fio LDM, isso efetivamente causou uma redução no orçamento, resultando em tempos de conclusão do backup mais longos e, se a taxa de mudança for suficientemente alta, em falha na conclusão do backup quando a taxa de enchimento do buffer de log de backup for maior que a taxa de escrita alcançável.

  Esse problema pode ser resolvido usando o parâmetro de configuração `BackupDiskWriteSpeedPct`, que aceita um valor no intervalo de 0 a 90 (inclusivo), que é interpretado como a porcentagem do orçamento máximo de taxa de escrita do nó que é reservada antes de distribuir o restante do orçamento entre os threads LDM para LCPs. O thread LDM que executa o backup recebe todo o orçamento de taxa de escrita para o backup, mais sua (reduzida) parcela do orçamento de taxa de escrita para pontos de verificação locais.

  O valor padrão para este parâmetro é 50 (interpretado como 50%).

- `BackupLogBufferSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>23

  O buffer de log de backup desempenha um papel semelhante ao desempenhado pelo buffer de dados de backup, exceto que ele é usado para gerar um log de todas as escritas de tabela feitas durante a execução do backup. Os mesmos princípios se aplicam à escrita dessas páginas, como no buffer de dados de backup, exceto que, quando não há mais espaço no buffer de log de backup, o backup falha. Por essa razão, o tamanho do buffer de log de backup deve ser grande o suficiente para lidar com a carga causada pelas atividades de escrita enquanto o backup está sendo feito. Veja a Seção 25.6.8.3, “Configuração para Backups de NDB Cluster”.

  O valor padrão para este parâmetro deve ser suficiente para a maioria das aplicações. De fato, é mais provável que uma falha de backup seja causada por uma velocidade de gravação do disco insuficiente do que pelo buffer do log de backup ficar cheio. Se o subsistema de disco não estiver configurado para a carga de escrita causada pelas aplicações, é improvável que o clúster consiga realizar as operações desejadas.

  É preferível configurar os nós do cluster de maneira que o processador se torne o gargalo, e não os discos ou as conexões de rede.

  O valor padrão para este parâmetro é 16 MB.

- `BackupMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>24

  Este parâmetro está desatualizado e está sujeito à remoção em uma versão futura do NDB Cluster. Qualquer configuração feita para ele será ignorada.

- `BackupReportFrequency`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>25

  Este parâmetro controla a frequência com que os relatórios de status de backup são emitidos no cliente de gerenciamento durante um backup, bem como a frequência com que esses relatórios são escritos no log do clúster (desde que a log de eventos do clúster esteja configurada para permitir isso — consulte Log e checkpointing). `BackupReportFrequency` representa o tempo em segundos entre os relatórios de status de backup.

  O valor padrão é 0.

- `BackupWriteSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>26

  Este parâmetro especifica o tamanho padrão das mensagens escritas no disco pelo log de backup e nos buffers de dados de backup.

  O valor padrão para este parâmetro é 256 KB.

- `BackupMaxWriteSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>27

  Este parâmetro especifica o tamanho máximo das mensagens escritas no disco pelo log de backup e nos buffers de dados de backup.

  O valor padrão para este parâmetro é 1 MB.

- `CompressedBackup`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>28

  Ativação deste parâmetro faz com que os arquivos de backup sejam comprimidos. A compressão utilizada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de backup não comprimidos. Os backups comprimidos podem ser ativados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

  Importante

  Você não pode restaurar um backup compactado em um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

  O valor padrão é `0` (desativado).

- `RequireEncryptedBackup`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>29

  Se definido para 1, os backups devem ser criptografados. Embora seja possível definir esse parâmetro individualmente para cada nó de dados, recomenda-se que você o defina na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Para obter mais informações sobre como realizar backups criptografados, consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup”.

  Adicionado na NDB 8.0.22.

Nota

A localização dos arquivos de backup é determinada pelo parâmetro de configuração do nó de dados `BackupDataDir`.

**Requisitos adicionais.** Ao especificar esses parâmetros, as seguintes relações devem ser respeitadas. Caso contrário, o nó de dados não poderá ser iniciado.

- `BackupDataBufferSize >= BackupWriteSize + 188KB`

- `BackupLogBufferSize >= BackupWriteSize + 16KB`

- `BackupMaxWriteSize >= BackupWriteSize`

##### Parâmetros de desempenho em tempo real do NDB Cluster

Os parâmetros `[ndbd]` discutidos nesta seção são usados na programação e bloqueio de threads para CPUs específicas em hosts de nós de dados de multiprocessadores.

Nota

Para utilizar esses parâmetros, o processo do nó de dados deve ser executado como raiz do sistema.

- `BuildIndexThreads`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>30

  Este parâmetro determina o número de threads a serem criados ao reconstruir índices ordenados durante o início de um sistema ou nó, bem como ao executar o **ndb\_restore** `--rebuild-indexes`. É suportado apenas quando há mais de um fragmento para a tabela por nó de dados (por exemplo, quando `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` é usado com `CREATE TABLE`).

  Definir este parâmetro para 0 (o padrão) desabilita a construção em multithread de índices ordenados.

  Este parâmetro é suportado ao usar **ndbd** ou **ndbmtd**").

  Você pode habilitar a compilação multithreading durante os reinicializações iniciais do nó de dados, configurando o parâmetro de configuração do nó de dados `TwoPassInitialNodeRestartCopy` para `TRUE`.

- `LockExecuteThreadToCPU`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>31

  Quando usado com **ndbd**, este parâmetro (agora uma string) especifica o ID da CPU atribuído para lidar com o fio de execução `NDBCLUSTER`. Quando usado com \*\*ndbmtd"), o valor deste parâmetro é uma lista de IDs de CPU separados por vírgula, atribuídos para lidar com os fios de execução. Cada ID de CPU na lista deve ser um número inteiro no intervalo de 0 a 65535 (inclusivo).

  O número de IDs especificado deve corresponder ao número de threads de execução determinado por `MaxNoOfExecutionThreads`. No entanto, não há garantia de que as threads sejam atribuídas às CPUs em qualquer ordem específica ao usar este parâmetro. Você pode obter um controle mais detalhado deste tipo usando `ThreadConfig`.

  `LockExecuteThreadToCPU` não tem valor padrão.

- `LockMaintThreadsToCPU`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>32

  Este parâmetro especifica o ID da CPU atribuído para lidar com os threads de manutenção `NDBCLUSTER`.

  O valor deste parâmetro é um número inteiro no intervalo de 0 a 65535 (inclusivo). *Não há valor padrão*.

- `Numa`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>33

  Este parâmetro determina se o Acesso Não Uniforme à Memória (NUMA) é controlado pelo sistema operacional ou pelo processo do nó de dados, se o nó de dados usa **ndbd** ou **ndbmtd**"). Por padrão, o `NDB` tenta usar uma política de alocação de memória NUMA interlaçada em qualquer nó de dados onde o sistema operacional do host oferece suporte NUMA.

  Definir `Numa = 0` significa que o processo de datanode não tenta definir uma política para a alocação de memória e permite que esse comportamento seja determinado pelo sistema operacional, que pode ser orientado ainda mais pela ferramenta separada **numactl**. Ou seja, `Numa = 0` gera o comportamento padrão do sistema, que pode ser personalizado pelo **numactl**. Para muitos sistemas Linux, o comportamento padrão do sistema é alocar memória local de soquete para qualquer processo dado no momento da alocação. Isso pode ser problemático ao usar \*\*ndbmtd"); isso ocorre porque **nbdmtd** aloca toda a memória no início, levando a um desequilíbrio, dando velocidades de acesso diferentes para diferentes soquetes, especialmente ao bloquear páginas na memória principal.

  Definir `Numa = 1` significa que o processo do nó de dados usa `libnuma` para solicitar a alocação de memória interlaçada. (Isso também pode ser feito manualmente, no nível do sistema operacional, usando **numactl**.) Usar a alocação interlaçada, na verdade, indica ao processo do nó de dados que ele ignore o acesso não uniforme à memória, mas não tente aproveitar a memória local rápida; em vez disso, o processo do nó de dados tenta evitar desequilíbrios devido à memória remota lenta. Se a alocação interlaçada não for desejada, defina `Numa` para 0 para que o comportamento desejado possa ser determinado no nível do sistema operacional.

  O parâmetro de configuração `Numa` é suportado apenas em sistemas Linux onde `libnuma.so` está disponível.

- `RealtimeScheduler`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>34

  Definir esse parâmetro para 1 habilita a agendamento em tempo real das threads dos nós de dados.

  O padrão é 0 (agendamento desativado).

- `SchedulerExecutionTimer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>35

  Este parâmetro especifica o tempo em microsegundos para que os threads sejam executados no agendador antes de serem enviados. Definindo-o como 0, minimiza o tempo de resposta; para alcançar um maior desempenho, você pode aumentar o valor em detrimento de tempos de resposta mais longos.

  O padrão é de 50 μs, o que, segundo nossos testes, aumenta ligeiramente o desempenho em casos de alta carga sem atrasar substancialmente as solicitações.

- `SchedulerResponsiveness`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>36

  Defina o equilíbrio no agendador `NDB` entre velocidade e capacidade de processamento. Este parâmetro aceita um número inteiro cujo valor está no intervalo de 0 a 10, inclusive, com 5 como o valor padrão. Valores mais altos proporcionam tempos de resposta melhores em relação à capacidade de processamento. Valores mais baixos proporcionam maior capacidade de processamento em detrimento de tempos de resposta mais longos.

- `SchedulerSpinTimer`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>37

  Este parâmetro especifica o tempo em microsegundos para que os threads sejam executados no agendador antes de dormir.

  A partir da versão NDB 8.0.20, se `SpinMethod` estiver definido, qualquer configuração para este parâmetro será ignorada.

- `SpinMethod`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>38

  Este parâmetro está presente a partir do NDB 8.0.20, mas não tem efeito antes do NDB 8.0.24. Ele oferece uma interface simples para controlar o giro adaptativo nos nós de dados, com quatro valores possíveis que fornecem predefinições para os valores do parâmetro de giro, conforme mostrado na lista a seguir:

  1. `StaticSpinning` (padrão): Define `EnableAdaptiveSpinning` para `false` e `SchedulerSpinTimer` para 0. (`SetAllowedSpinOverhead` não é relevante neste caso.)

  2. `CostBasedSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 100 e `SetAllowedSpinOverhead` para 200.

  3. `LatencyOptimisedSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 200 e `SetAllowedSpinOverhead` para 1000.

  4. `DatabaseMachineSpinning`: Define `EnableAdaptiveSpinning` para `true`, `SchedulerSpinTimer` para 500 e `SetAllowedSpinOverhead` para

     10000. Isso é destinado para uso em casos em que os threads possuem suas próprias CPUs.

  Os parâmetros de rotação modificados por `SpinMethod` estão descritos na lista a seguir:

  - `SchedulerSpinTimer`: Isso é o mesmo que o parâmetro de configuração do nó de dados desse nome. O ajuste aplicado a este parâmetro por `SpinMethod` substitui qualquer valor definido no arquivo `config.ini`.

  - `EnableAdaptiveSpinning`: Habilita ou desabilita o giro adaptativo. Desabilitá-lo faz com que o giro seja realizado sem fazer qualquer verificação dos recursos da CPU. Este parâmetro não pode ser definido diretamente no arquivo de configuração do cluster e, na maioria das circunstâncias, não deve ser necessário, mas pode ser habilitado diretamente usando `DUMP 104004 1` ou desabilitado com `DUMP 104004 0` no cliente de gerenciamento **ndb\_mgm**.

  - `SetAllowedSpinOverhead`: Define a quantidade de tempo de CPU para permitir a obtenção de latência. Este parâmetro não pode ser definido diretamente no arquivo `config.ini`. Na maioria dos casos, o ajuste aplicado pelo SpinMethod deve ser satisfatório, mas se for necessário alterá-lo diretamente, você pode usar `DUMP 104002 overhead` para fazer isso, onde `overhead` é um valor variando de 0 a 10000, inclusive; consulte a descrição do comando `DUMP` indicado para obter detalhes.

  Em plataformas que não possuem instruções de rotação utilizáveis, como as PowerPC e algumas plataformas SPARC, o tempo de rotação é definido como 0 em todas as situações, e os valores para `SpinMethod` diferentes de `StaticSpinning` são ignorados.

- `TwoPassInitialNodeRestartCopy`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>39

  A construção em múltiplas threads de índices ordenados pode ser habilitada para reinicializações iniciais dos nós de dados, definindo esse parâmetro de configuração para `true` (o valor padrão), o que permite a cópia de dois passes de dados durante as reinicializações iniciais dos nós.

  Você também deve definir `BuildIndexThreads` para um valor não nulo.

**Parâmetros de Configuração de Multithreading (ndbmtd).** O **ndbmtd")** é executado, por padrão, como um processo de único fio e deve ser configurado para usar múltiplos fios, utilizando um dos dois métodos, ambos os quais exigem a definição de parâmetros de configuração no arquivo `config.ini`. O primeiro método é simplesmente definir um valor apropriado para o parâmetro de configuração `MaxNoOfExecutionThreads`. Um segundo método permite configurar regras mais complexas para o multithreading do **ndbmtd")** usando `ThreadConfig`. Os próximos parágrafos fornecem informações sobre esses parâmetros e seu uso com nós de dados multithreaded.

Nota

Para fazer um backup com paralelismo nos nós de dados, é necessário que múltiplos LDMs estejam em uso em todos os nós de dados do clúster antes de realizar o backup. Para obter mais informações, consulte a Seção 25.6.8.5, “Fazer um backup do NDB com nós de dados paralelos”, bem como a Seção 25.5.23.3, “Restaurar a partir de um backup feito em paralelo”.

- `AutomaticThreadConfig`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>40

  Quando definido para 1, habilita a configuração automática de threads, utilizando o número de CPUs disponíveis para um nó de dados, levando em consideração quaisquer limites definidos por `taskset`, `numactl`, máquinas virtuais, Docker e outros meios que controlam quais CPUs estão disponíveis para uma determinada aplicação (em plataformas Windows, a configuração automática de threads usa todas as CPUs que estão online); como alternativa, você pode definir `NumCPUs` para o número desejado de CPUs (até 1024, o número máximo de CPUs que podem ser gerenciadas pela configuração automática de threads). Qualquer configuração para `ThreadConfig` e `MaxNoOfExecutionThreads` é ignorada. Além disso, a ativação deste parâmetro desabilita automaticamente `ClassicFragmentation`.

- `ClassicFragmentation`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>41

  Quando ativado (definido como `true`), `NDB` distribui fragmentos entre os LDM da maneira sempre usada pelo `NDB` antes do NDB 8.0.23; ou seja, o número padrão de partições por nó é igual ao número mínimo de threads do gerente de dados local (LDM) por nó de dados.

  Para novos clústeres para os quais nunca se espera uma despromoção para o NDB 8.0.22 ou versões anteriores, é preferível definir `ClassicFragmentation` para `false` ao configurar o clúster pela primeira vez; isso faz com que o número de partições por nó seja igual ao valor de `PartitionsPerNode`, garantindo que todas as partições sejam distribuídas uniformemente entre todos os LDMs.

  Este parâmetro e `AutomaticThreadConfig` são mutuamente exclusivos; habilitar `AutomaticThreadConfig` desabilita automaticamente `ClassicFragmentation`.

- `EnableMultithreadedBackup`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>42

  Habilita o backup multisserial. Se cada nó de dados tiver pelo menos 2 LDM, todas as threads do LDM participarão do backup, que é criado usando um subdiretório por thread do LDM e cada subdiretório contendo os arquivos de backup `.ctl`, `.Data` e `.log`.

  Este parâmetro é normalmente ativado (definido para 1) para **ndbmtd**"). Para forçar um backup monofilamento que possa ser restaurado facilmente usando versões mais antigas do **ndb\_restore**, desative o backup multifilamento definindo este parâmetro para 0. Isso deve ser feito para cada nó de dados no clúster.

  Consulte a Seção 25.6.8.5, “Fazer um backup do NDB com nós de dados paralelos”, e a Seção 25.5.23.3, “Restaurar a partir de um backup feito em paralelo”, para obter mais informações.

- `MaxNoOfExecutionThreads`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>43

  Este parâmetro controla diretamente o número de threads de execução usadas pelo **ndbmtd**"), até um máximo de 72. Embora este parâmetro seja definido nas seções `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`, ele é exclusivo para **ndbmtd**") e não se aplica ao **ndbd**.

  Ativação de `AutomaticThreadConfig` faz com que qualquer configuração para este parâmetro seja ignorada.

  A definição de `MaxNoOfExecutionThreads` define o número de threads para cada tipo, conforme determinado por uma matriz no arquivo `storage/ndb/src/common/mt_thr_config.cpp`. (Antes do NDB 8.0.30, isso era `storage/ndb/src/kernel/vm/mt_thr_config.cpp`.) Esta tabela mostra esses números de threads para valores possíveis de `MaxNoOfExecutionThreads`.

  **Tabela 25.12 Valores de MaxNoOfExecutionThreads e o número correspondente de threads por tipo de thread (LQH, TC, Enviar, Receber).**

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>44

  Há sempre uma única thread de SUMA (replicação).

  `NoOfFragmentLogParts` deve ser definido como igual ao número de threads LDM usadas pelo **ndbmtd**"), conforme determinado pelo ajuste para este parâmetro. Essa proporção não deve ser maior que 4:1; uma configuração em que isso ocorre é especificamente proibida.

  O número de threads LDM também determina o número de partições usadas por uma tabela `NDB` que não está explicitamente particionada; este é o número de threads LDM vezes o número de nós de dados no clúster. (Se **ndbd** for usado nos nós de dados em vez de **ndbmtd**"), então há sempre um único thread LDM; nesse caso, o número de partições criadas automaticamente é simplesmente igual ao número de nós de dados. Consulte a Seção 25.2.2, “Nodos de Clúster NDB, Grupos de Nó, Replicas de Fragmento e Partições”, para obter mais informações.

  Adicionar grandes espaços de tabelas para tabelas de Dados de Disco ao usar mais do que o número padrão de threads do LDM pode causar problemas com o uso de recursos e CPU se o buffer de página de disco não for suficientemente grande; consulte a descrição do parâmetro de configuração `DiskPageBufferMemory` para obter mais informações.

  Os tipos de fios são descritos mais adiante nesta seção (ver `ThreadConfig`).

  Definir este parâmetro fora do intervalo de valores permitido faz com que o servidor de gerenciamento abordem no início com o erro Erro linha `number`: Valor ilegal `value` para o parâmetro MaxNoOfExecutionThreads.

  Para `MaxNoOfExecutionThreads`, um valor de 0 ou 1 é arredondado para cima internamente por `NDB` para 2, de modo que 2 seja considerado o valor padrão e mínimo deste parâmetro.

  `MaxNoOfExecutionThreads` é geralmente destinado a ser definido como igual ao número de threads da CPU disponíveis e a alocar um número de threads de cada tipo adequado para cargas de trabalho típicas. Ele não atribui threads específicos a CPUs especificadas. Para casos em que seja desejável variar das configurações fornecidas ou vincular threads a CPUs, você deve usar `ThreadConfig` em vez disso, que permite que você aloque cada thread diretamente a um tipo desejado, CPU ou ambos.

  O processo do nó de dados multithread sempre gera, no mínimo, os seguintes threads:

  - 1 fio de manipulador de consulta local (LDM)
  - 1 fio de recebimento
  - 1 fio de gerenciador de assinaturas (SUMA ou replicação)

  Para um valor de `MaxNoOfExecutionThreads` de 8 ou menos, não são criadas threads de TC e, em vez disso, o gerenciamento de TC é realizado pela thread principal.

  Alterar o número de threads LDM normalmente requer um reinício do sistema, seja alterado usando este parâmetro ou `ThreadConfig`, mas é possível efetuar a alteração usando um reinício inicial do nó (*NI*) desde que as duas condições a seguir sejam atendidas:

  - Cada fio LDM lida com um máximo de 8 fragmentos, e
  - O número total de fragmentos de tabela é um múltiplo inteiro do número de threads LDM.

  No NDB 8.0, um reinício inicial *não* é necessário para efetuar uma alteração neste parâmetro, como acontecia em algumas versões mais antigas do NDB Cluster.

- `MaxSendDelay`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>45

  Esse parâmetro pode ser usado para fazer com que os nós de dados esperem momentaneamente antes de enviar dados para os nós da API; em algumas circunstâncias, descritas nos parágrafos seguintes, isso pode resultar em uma transmissão mais eficiente de volumes maiores de dados e em um desempenho geral maior.

  `MaxSendDelay` pode ser útil quando há muitos nós de API no ponto de saturação ou próximo a ele, o que pode resultar em ondas de desempenho crescente e decrescente. Isso ocorre quando os nós de dados conseguem enviar resultados de volta aos nós de API de forma relativamente rápida, com muitos pacotes pequenos para serem processados, o que pode levar mais tempo para ser processado por byte em comparação com pacotes grandes, desacelerando assim os nós de API; mais tarde, os nós de dados começam a enviar pacotes maiores novamente.

  Para lidar com esse tipo de cenário, você pode definir `MaxSendDelay` para um valor não nulo, o que ajuda a garantir que as respostas não sejam enviadas de volta aos nós da API tão rapidamente. Quando isso é feito, as respostas são enviadas imediatamente quando não há outro tráfego concorrente, mas quando há, definir `MaxSendDelay` faz com que os nós de dados esperem o tempo suficiente para garantir que enviem pacotes maiores. Na verdade, isso introduz um gargalo artificial no processo de envio, o que pode melhorar significativamente o desempenho.

- `NoOfFragmentLogParts`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>46

  Defina o número de grupos de arquivos de registro para logs de recuperação pertencentes a este **ndbmtd**"). O valor deste parâmetro deve ser igual ao número de threads do LDM usadas pelo **ndbmtd**") conforme determinado pelo ajuste para `MaxNoOfExecutionThreads`. Uma configuração que utilize mais de 4 partes de log de recuperação por LDM é desaconselhada.

  Veja a descrição de `MaxNoOfExecutionThreads` para mais informações.

- `NumCPUs`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>47

  Faça com que a configuração automática do fio use apenas esse número de CPUs. Não tem efeito se `AutomaticThreadConfig` não estiver habilitado.

- `PartitionsPerNode`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>48

  Define o número de partições usadas em cada nó ao criar uma nova tabela `NDB`. Isso permite evitar a divisão de tabelas em um número excessivo de partições quando o número de gestores de dados locais (LDMs) aumenta muito.

  Embora seja possível definir esse parâmetro com diferentes valores em diferentes nós de dados e não há problemas conhecidos para fazer isso, também não é provável que isso seja vantajoso; por essa razão, recomenda-se definir apenas uma vez, para todos os nós de dados, na seção `[ndbd default]` do arquivo global `config.ini`.

  Se `ClassicFragmentation` estiver ativado, qualquer configuração para este parâmetro será ignorada. (Lembre-se de que ativar `AutomaticThreadConfig` desativa `ClassicFragmentation`.).

- `ThreadConfig`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>49

  Este parâmetro é usado com **ndbmtd")** para atribuir threads de diferentes tipos a diferentes CPUs. Seu valor é uma string cujo formato tem a seguinte sintaxe:

  ```
  ThreadConfig := entry[,entry[,...]]

  entry := type={param[,param[,...]]}

  type (NDB 8.0.22 and earlier) := ldm | main | recv | send | rep | io | tc | watchdog | idxbld

  type (NDB 8.0.23 and later) := ldm | query | recover | main | recv | send | rep | io | tc | watchdog | idxbld

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

  As chaves curvas (`{`...`}`) que cercam a lista de parâmetros são necessárias, mesmo que haja apenas um parâmetro na lista.

  Um `param` (parâmetro) especifica qualquer ou todas as seguintes informações:

  - O número de fios do tipo dado (`count`).

  - O conjunto de CPUs para o qual os threads do tipo especificado devem ser vinculados de forma não exclusiva. Isso é determinado por um dos `cpubind` ou `cpuset`). `cpubind` faz com que cada thread seja vinculada (de forma não exclusiva) a uma CPU do conjunto; `cpuset` significa que cada thread é vinculada (de forma não exclusiva) ao conjunto de CPUs especificadas.

    No Solaris, você pode, em vez disso, especificar um conjunto de CPUs para o qual os threads do tipo dado devem ser vinculados exclusivamente. `cpubind_exclusive` faz com que cada thread seja vinculada exclusivamente a uma CPU do conjunto; `cpuset_exclsuive` significa que cada thread é vinculada exclusivamente ao conjunto de CPUs especificadas.

    Apenas um dos `cpubind`, `cpuset`, `cpubind_exclusive` ou `cpuset_exclusive` pode ser fornecido em uma única configuração.

  - `spintime` determina o tempo de espera em microsegundos que a thread gasta antes de entrar em modo de espera.

    O valor padrão para `spintime` é o valor do parâmetro de configuração do nó de dados `SchedulerSpinTimer`.

    `spintime` não se aplica a threads de E/S, watchdog ou threads de construção de índice offline, portanto, não pode ser definido para esses tipos de threads.

  - `realtime` pode ser definido como 0 ou 1. Se definido como 1, os threads são executados com prioridade em tempo real. Isso também significa que `thread_prio` não pode ser definido.

    O parâmetro `realtime` é definido por padrão para o valor do parâmetro de configuração do nó de dados `RealtimeScheduler`.

    `realtime` não pode ser definido para threads de construção de índice offline.

  - Ao definir `nosend` para 1, você pode impedir que um fio `main`, `ldm`, `rep` ou `tc` ajude os fios de envio. Este parâmetro é 0 por padrão e não pode ser usado com outros tipos de fios.

  - `thread_prio` é um nível de prioridade de thread que pode ser definido de 0 a 10, sendo 10 a maior prioridade. O padrão é 5. Os efeitos precisos deste parâmetro são específicos da plataforma e são descritos mais adiante nesta seção.

    O nível de prioridade do fio não pode ser definido para os fios de construção de índice offline.

  **Configurações e efeitos dos parâmetros thread\_prio por plataforma.** A implementação do `thread_prio` difere entre Linux/FreeBSD, Solaris e Windows. Na lista a seguir, discutimos seus efeitos em cada uma dessas plataformas, uma após a outra:

  - *Linux e FreeBSD*: Mapeamos `thread_prio` para um valor que será fornecido à chamada de sistema `nice`. Como um valor de menor novidade para um processo indica uma maior prioridade do processo, aumentar `thread_prio` tem o efeito de diminuir o valor de `nice`.

    **Tabela 25.13: Mapeamento de thread\_prio para valores nice no Linux e FreeBSD**

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>50

    Alguns sistemas operacionais podem permitir um nível máximo de suavidade de processo de 20, mas isso não é suportado por todas as versões visadas; por essa razão, escolhemos 19 como o valor máximo do `nice` que pode ser definido.

  - *Solaris*: Definir `thread_prio` no Solaris define a prioridade do Solaris FX, com mapeamentos conforme mostrado na tabela a seguir:

    **Tabela 25.14: Mapeamento de thread\_prio para prioridade FX no Solaris**

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>51

    Uma configuração `thread_prio` de 9 é mapeada no Solaris para o valor de prioridade especial FX 59, o que significa que o sistema operacional também tenta forçar o thread a rodar sozinho em seu próprio núcleo de CPU.

  - *Windows*: Mapeamos `thread_prio` para um valor de prioridade de thread do Windows passado para a função da API do Windows `SetThreadPriority()`. Esse mapeamento é mostrado na tabela a seguir:

    **Tabela 25.15: Mapeamento de thread\_prio para prioridade de thread do Windows**

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>52

  O atributo `type` representa um tipo de thread NDB. Os tipos de thread suportados e a faixa de valores `count` permitidos para cada um deles estão fornecidos na lista a seguir:

  - `ldm`: Manipulador de consulta local (`DBLQH` bloco do kernel) que lida com os dados. Quanto mais threads LDM forem usadas, mais particionadas serão as informações. (A partir do NDB 8.0.23, quando `ClassicFragmentation` é definido como 0, o número de partições fica independente do número de threads LDM e depende do valor de `PartitionsPerNode` em vez disso.) Cada thread LDM mantém seus próprios conjuntos de dados e partições de índice, além de seu próprio log de refazer. Antes do NDB 8.0.23, o valor definido para `ldm` deve ser um dos valores 1, 2, 4, 6, 8, 12, 16, 24 ou

    32. No NDB 8.0.23 e versões posteriores, é possível definir `ldm` para qualquer valor no intervalo de 1 a 332, inclusive; também é possível defini-lo para 0, desde que `main`, `rep` e `tc` também sejam 0 e que `recv` seja definido para 1; isso faz com que **ndbmtd")** emule **ndbd**.

    Cada fio LDM é normalmente agrupado com 1 fio de consulta para formar um grupo LDM. Um conjunto de 4 a 8 grupos LDM é agrupado em grupos round robin. Cada fio LDM pode ser auxiliado na execução por qualquer consulta ou fio no mesmo grupo round robin. `NDB` tenta formar grupos round robin de tal forma que todos os fios em cada grupo round robin estejam bloqueados em CPUs que estão ligadas ao mesmo cache L3, dentro dos limites da faixa indicada para o tamanho de um grupo round robin.

    Para alterar o número de threads LDM, normalmente é necessário reiniciar o sistema para que a alteração seja eficaz e segura para as operações do cluster; essa exigência é relaxada em certos casos, conforme explicado mais adiante nesta seção. Isso também é verdadeiro quando isso é feito usando `MaxNoOfExecutionThreads`.

    Adicionar grandes espaços de tabelas (centenas de gigabytes ou mais) para tabelas de Dados de Disco quando se usa mais do número padrão de LDMs pode causar problemas com o uso de recursos e CPU se `DiskPageBufferMemory` não for suficientemente grande.

    Em NDB 8.0.30 (apenas), `ldm` deve ser incluído na string de valor `ThreadConfig`. A partir do NDB 8.0.31, se isso for omitido, uma `ldm` thread é criada. Essas mudanças podem afetar as atualizações de versões anteriores; consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  - `query` (Adicionado em NDB 8.0.23): Um fio de consulta está vinculado a um LDM e, juntamente com ele, forma um grupo de LDM; atua apenas em consultas `READ COMMITTED`. O número de fios de consulta deve ser definido como 0, 1, 2 ou 3 vezes o número de fios de LDM. Os fios de consulta não são usados, a menos que isso seja anulado ao definir `query` para um valor não nulo ou ao habilitar o parâmetro `AutomaticThreadConfig`, caso em que os LDMs se comportam como faziam antes do NDB 8.0.23.

    Um fio de consulta também atua como um fio de recuperação (veja o próximo item), embora o inverso não seja verdadeiro.

    Para alterar o número de threads de consulta, é necessário reiniciar o nó.

  - `recover` (Adicionado em NDB 8.0.23): Um fio de recuperação restaura dados de um fragmento como parte de um LCP.

    Para alterar o número de threads de recuperação, é necessário reiniciar o nó.

  - `tc`: Fio do coordenador de transação (`DBTC` bloco do kernel) que contém o estado de uma transação em andamento. No NDB 8.0.23 e versões posteriores, o número máximo de fios do TC é de 128; anteriormente, era de 32.

    Idealmente, cada nova transação pode ser atribuída a um novo fio TC. Na maioria dos casos, 1 fio TC por 2 fios LDM é suficiente para garantir que isso possa acontecer. Em casos em que o número de escritas é relativamente pequeno em comparação com o número de leituras, pode ser necessário apenas 1 fio TC por 4 fios LQH para manter os estados das transações. Por outro lado, em aplicações que realizam muitas atualizações, pode ser necessário que a proporção de fios TC para fios LDM se aproxime de 1 (por exemplo, 3 fios TC para 4 fios LDM).

    Definir `tc` para 0 faz com que o gerenciamento de TC seja feito pela thread principal. Na maioria dos casos, isso é praticamente o mesmo que definir para 1.

    Faixa: 0-64 (*NDB 8.0.22 e versões anteriores*: 0 - 32)

  - `main`: Dicionário de dados e coordenador de transações (blocos de kernel `DBDIH` e `DBTC`), que fornecem gerenciamento de esquema. Antes da versão 8.0.23 do NDB, isso era sempre gerenciado por um único fio dedicado. A partir da versão 8.0.23, também é possível especificar zero ou dois fios principais.

    Gama:

    - *NDB 8.0.22 e versões anteriores*: apenas 1.

      *NDB 8.0.23 e versões posteriores*: 0-2.

      Definir `main` para 0 e `rep` para 1 faz com que os blocos `main` sejam colocados na `rep` thread; a thread combinada é mostrada na tabela `ndbinfo.threads` como `main_rep`. Isso é efetivamente o mesmo que definir `rep` igual a 1 e `main` igual a 0.

      Também é possível definir tanto `main` quanto `rep` para 0, caso em que ambos os threads são colocados no primeiro thread `recv`; o thread combinado resultante é nomeado `main_rep_recv` na tabela `threads`.

    Em NDB 8.0.30 (apenas), `main` deve ser incluído na string de valor `ThreadConfig`. A partir do NDB 8.0.31, se isso for omitido, uma `main` thread é criada. Essas mudanças podem afetar as atualizações de versões anteriores; consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  - `recv`: Receba o fio (`CMVMI` bloco do kernel). Cada fio de recebimento lida com um ou mais sockets para se comunicar com outros nós em um NDB Cluster, com um socket por nó. O NDB Cluster suporta vários fios de recebimento; o máximo é de 16 desses fios.

    Gama:

    - *NDB 8.0.22 e versões anteriores*: 1 - 16
    - *NDB 8.0.23 e versões posteriores*: 1 - 64

    Em NDB 8.0.30 (apenas), `recv` deve ser incluído na string de valor `ThreadConfig`. A partir do NDB 8.0.31, se isso for omitido, uma `recv` thread é criada. Essas mudanças podem afetar as atualizações de versões anteriores; consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  - `send`: Enviar fio (`CMVMI` bloco do kernel). Para aumentar a taxa de transferência, é possível realizar envios a partir de um ou mais fios separados e dedicados (máximo de 8).

    No NDB 8.0.20 e versões posteriores, devido às mudanças na implementação de multithreading, o uso de muitos threads de envio pode ter um efeito adverso na escalabilidade.

    Anteriormente, todos os threads gerenciavam seu próprio envio diretamente; isso ainda pode ser feito configurando o número de threads de envio para 0 (isso também acontece quando `MaxNoOfExecutionThreads` é definido menor que 10). Embora isso possa ter um impacto negativo no desempenho, em alguns casos, também pode reduzir a latência.

    Gama:

    - *NDB 8.0.22 e versões anteriores*: 0 - 16
    - *NDB 8.0.23 e versões posteriores*: 0 - 64

  - `rep`: Fundo de replicação (`SUMA` bloco do kernel). Antes da versão NDB 8.0.23, as operações de replicação assíncrona são sempre gerenciadas por um único fio dedicado. A partir da versão NDB 8.0.23, este fio pode ser combinado com o fio principal (veja as informações de intervalo).

    Gama:

    - *NDB 8.0.22 e versões anteriores*: apenas 1.
    - *NDB 8.0.23 e versões posteriores*: 0-1.

      Definir `rep` para 0 e `main` para 1 faz com que os blocos `rep` sejam colocados na `main` thread; a thread combinada é mostrada na tabela `ndbinfo.threads` como `main_rep`. Isso é efetivamente o mesmo que definir `main` igual a 1 e `rep` igual a 0.

      Também é possível definir tanto `main` quanto `rep` para 0, caso em que ambos os threads são colocados no primeiro thread `recv`; o thread combinado resultante é nomeado `main_rep_recv` na tabela `threads`.

    Em NDB 8.0.30 (apenas), `rep` deve ser incluído na string de valor `ThreadConfig`. A partir do NDB 8.0.31, se isso for omitido, uma `rep` thread é criada. Essas mudanças podem afetar as atualizações de versões anteriores; consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  - `io`: Sistema de arquivos e outras operações diversas. Estas não são tarefas exigentes e são sempre tratadas em grupo por uma única thread de E/S dedicada.

    Alcance: apenas 1.

  - `watchdog`: Os parâmetros associados a este tipo são aplicados a vários threads, cada um com um uso específico. Esses threads incluem o thread `SocketServer`, que recebe configurações de conexão de outros nós; o thread `SocketClient`, que tenta configurar conexões com outros nós; e o thread watchdog, que verifica se os threads estão progredindo.

    Alcance: apenas 1.

  - `idxbld`: Threads de construção de índice offline. Ao contrário dos outros tipos de threads listados anteriormente, que são permanentes, esses são threads temporários que são criados e usados apenas durante os reinicializações do nó ou do sistema ou quando o **ndb\_restore** `--rebuild-indexes` estiver em execução. Eles podem estar vinculados a conjuntos de CPU que se sobrepõem aos conjuntos de CPU vinculados aos tipos de thread permanentes.

    Os valores `thread_prio`, `realtime` e `spintime` não podem ser definidos para os threads de construção de índice offline. Além disso, o `count` é ignorado para esse tipo de thread.

    Se `idxbld` não for especificado, o comportamento padrão é o seguinte:

    - Os tópicos de construção de índice offline não são vinculados se o thread de E/S também não estiver vinculado, e esses tópicos usam quaisquer núcleos disponíveis.

    - Se a thread de E/S estiver vinculada, então as threads de construção do índice offline estarão vinculadas ao conjunto inteiro de threads vinculadas, devido ao fato de que não deverão haver outras tarefas para essas threads realizarem.

    Alcance: 0 - 1.

  Alterar `ThreadCOnfig` normalmente exige um reinício inicial do sistema, mas essa exigência pode ser relaxada em certas circunstâncias:

  - Se, após a mudança, o número de threads do LDM permanecer o mesmo que antes, nada mais é necessário do que um simples reinício do nó (reinício em rolagem, ou *N*) para implementar a mudança.

  - Caso contrário (ou seja, se o número de threads do LDM mudar), ainda é possível efetuar a alteração usando um reinício inicial do nó (*NI*) desde que as duas condições a seguir sejam atendidas:

    1. Cada fio LDM lida com um máximo de 8 fragmentos, e

    2. O número total de fragmentos de tabela é um múltiplo inteiro do número de threads LDM.

  Em qualquer outro caso, é necessário reiniciar o sistema para alterar esse parâmetro.

  `NDB` pode distinguir entre os tipos de fios por meio dos seguintes critérios:

  - Se o fio é um fio de execução. Os fios do tipo `main`, `ldm`, `query` (NDB 8.0.23 e versões posteriores), `recv`, `rep`, `tc` e `send` são fios de execução; os fios `io`, `recover` (NDB 8.0.23 e versões posteriores), `watchdog` e `idxbld` não são considerados fios de execução.

  - Se a alocação de threads para uma tarefa específica é permanente ou temporária. Atualmente, todos os tipos de threads, exceto os threads `idxbld`, são considerados permanentes; os threads `idxbld` são considerados threads temporárias.

  Exemplos simples:

  ```
  # Example 1.

  ThreadConfig=ldm={count=2,cpubind=1,2},main={cpubind=12},rep={cpubind=11}

  # Example 2.

  Threadconfig=main={cpubind=0},ldm={count=4,cpubind=1,2,5,6},io={cpubind=3}
  ```

  É geralmente desejável, ao configurar o uso de threads para um host de nó de dados, reservar um ou mais núcleos de CPU para o sistema operacional e outras tarefas. Assim, para uma máquina host com 24 CPUs, você pode querer usar 20 threads de CPU (restando 4 para outros usos), com 8 threads LDM, 4 threads TC (metade do número de threads LDM), 3 threads de envio, 3 threads de recebimento e 1 thread para cada uma das tarefas de gerenciamento de esquema, replicação assíncrona e operações de E/S. (Essa é quase a mesma distribuição de threads usada quando `MaxNoOfExecutionThreads` é definida como igual a 20.) A configuração `ThreadConfig` a seguir realiza essas atribuições, além de vincular todas essas threads a CPUs específicas:

  ```
  ThreadConfig=ldm{count=8,cpubind=1,2,3,4,5,6,7,8},main={cpubind=9},io={cpubind=9}, \
  rep={cpubind=10},tc{count=4,cpubind=11,12,13,14},recv={count=3,cpubind=15,16,17}, \
  send{count=3,cpubind=18,19,20}
  ```

  Na maioria dos casos, deve ser possível vincular o fio principal (gestão do esquema) e o fio de E/S à mesma CPU, como fizemos no exemplo que acabamos de mostrar.

  O exemplo a seguir incorpora grupos de CPUs definidos usando tanto `cpuset` quanto `cpubind`, além do uso da priorização de threads.

  ```
  ThreadConfig=ldm={count=4,cpuset=0-3,thread_prio=8,spintime=200}, \
  ldm={count=4,cpubind=4-7,thread_prio=8,spintime=200}, \
  tc={count=4,cpuset=8-9,thread_prio=6},send={count=2,thread_prio=10,cpubind=10-11}, \
  main={count=1,cpubind=10},rep={count=1,cpubind=11}
  ```

  Neste caso, criamos dois grupos LDM; o primeiro usa `cpubind` e o segundo usa `cpuset`. `thread_prio` e `spintime` são definidos com os mesmos valores para cada grupo. Isso significa que há oito threads LDM no total. (Você deve garantir que `NoOfFragmentLogParts` também esteja definido para 8.) As quatro threads TC usam apenas duas CPUs; é possível, ao usar `cpuset`, especificar menos CPUs do que threads no grupo. (Isso não é verdade para `cpubind`.) As threads de envio usam duas threads usando `cpubind` para vincular essas threads às CPUs 10 e 11. As threads principal e rep podem reutilizar essas CPUs.

  Este exemplo mostra como `ThreadConfig` e `NoOfFragmentLogParts` podem ser configurados para um host com 24 CPUs e hyperthreading, deixando as CPUs 10, 11, 22 e 23 disponíveis para funções do sistema operacional e interrupções:

  ```
  NoOfFragmentLogParts=10
  ThreadConfig=ldm={count=10,cpubind=0-4,12-16,thread_prio=9,spintime=200}, \
  tc={count=4,cpuset=6-7,18-19,thread_prio=8},send={count=1,cpuset=8}, \
  recv={count=1,cpuset=20},main={count=1,cpuset=9,21},rep={count=1,cpuset=9,21}, \
  io={count=1,cpuset=9,21,thread_prio=8},watchdog={count=1,cpuset=9,21,thread_prio=9}
  ```

  Os próximos exemplos incluem configurações para `idxbld`. Os dois primeiros desses exemplos demonstram como um conjunto de CPU definido para `idxbld` pode sobrepor os especificados para outros tipos de threads (permanentes), o primeiro usando `cpuset` e o segundo usando `cpubind`:

  ```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1-8}

  ThreadConfig=main,ldm={count=1,cpubind=1},idxbld={count=1,cpubind=1}
  ```

  O próximo exemplo especifica uma CPU para a thread de E/S, mas não para as threads de construção do índice:

  ```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8}
  ```

  Como o ajuste `ThreadConfig` que acabou de ser mostrado bloqueia os threads em oito núcleos numerados de 1 a 8, ele é equivalente ao ajuste mostrado aqui:

  ```
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1,2,3,4,5,6,7,8}
  ```

  Para aproveitar a maior estabilidade que o uso de `ThreadConfig` oferece, é necessário garantir que as CPUs estejam isoladas e não sejam sujeitas a interrupções ou a serem agendadas para outras tarefas pelo sistema operacional. Em muitos sistemas Linux, você pode fazer isso configurando `IRQBALANCE_BANNED_CPUS` em `/etc/sysconfig/irqbalance` para `0xFFFFF0` e usando a opção de inicialização `isolcpus` em `grub.conf`. Para informações específicas, consulte a documentação do seu sistema operacional ou plataforma.

**Parâmetros de configuração de dados de disco.** Os parâmetros de configuração que afetam o comportamento dos dados de disco incluem os seguintes:

- `DiskPageBufferEntries`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>53

  Este é o número de entradas de página (referências de página) a serem alocadas. É especificado como um número de 32K páginas em `DiskPageBufferMemory`. O valor padrão é suficiente para a maioria dos casos, mas você pode precisar aumentar o valor deste parâmetro se encontrar problemas com transações muito grandes nas tabelas de Dados de Disco. Cada entrada de página requer aproximadamente 100 bytes.

- `DiskPageBufferMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>54

  Isso determina a quantidade de espaço usado para armazenar páginas no disco, e é definido na seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`.

  Nota

  Anteriormente, esse parâmetro era especificado como um número de páginas de 32 KB. No NDB 8.0, ele é especificado como um número de bytes.

  Se o valor para `DiskPageBufferMemory` estiver definido muito baixo em conjunto com o uso de mais do número padrão de threads LDM em `ThreadConfig` (por exemplo, `{ldm=6...}`), problemas podem surgir ao tentar adicionar um arquivo de dados grande (por exemplo, 500G) a uma tabela `NDB` baseada em disco, onde o processo leva um tempo indefinidamente longo, ocupando um dos núcleos da CPU.

  Isso ocorre porque, ao adicionar um arquivo de dados a um espaço de tabelas, as páginas de extensão são bloqueadas na memória em uma thread adicional do trabalhador PGMAN, para acesso rápido aos metadados. Ao adicionar um arquivo grande, esse trabalhador tem memória insuficiente para todos os metadados do arquivo de dados. Nesses casos, você deve aumentar `DiskPageBufferMemory` ou adicionar arquivos de espaço de tabelas menores. Você também pode precisar ajustar `DiskPageBufferEntries`.

  Você pode consultar a tabela `ndbinfo.diskpagebuffer` para ajudar a determinar se o valor para este parâmetro deve ser aumentado para minimizar buscas desnecessárias no disco. Consulte a Seção 25.6.16.30, “A tabela ndbinfo diskpagebuffer”, para obter mais informações.

- `SharedGlobalMemory`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>55

  Este parâmetro determina a quantidade de memória utilizada para buffers de log, operações de disco (como solicitações de páginas e filas de espera) e metadados para espaços de tabela, grupos de arquivos de log, arquivos `UNDO` e arquivos de dados. O pool de memória global compartilhada também fornece a memória utilizada para atender aos requisitos de memória da opção `UNDO_BUFFER_SIZE` usada com as instruções `CREATE LOGFILE GROUP` e `ALTER LOGFILE GROUP`, incluindo qualquer valor padrão implícito para essa opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`. `SharedGlobalMemory` pode ser definido na seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração `config.ini` e é medido em bytes.

  O valor padrão é `128M`.

- `DiskIOThreadPool`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>56

  Este parâmetro determina o número de threads não associadas usadas para o acesso ao arquivo de dados do disco. Antes de `DiskIOThreadPool` ser introduzido, exatamente um thread era gerado para cada arquivo de dados do disco, o que poderia levar a problemas de desempenho, especialmente ao usar arquivos de dados muito grandes. Com `DiskIOThreadPool`, você pode, por exemplo, acessar um único grande arquivo de dados usando vários threads trabalhando em paralelo.

  Este parâmetro aplica-se apenas às threads de E/S de dados do disco.

  O valor ótimo para este parâmetro depende do seu hardware e da sua configuração, e inclui os seguintes fatores:

  - **Distribuição física dos arquivos de dados do disco.** Você pode obter um melhor desempenho ao colocar os arquivos de dados, os arquivos de registro de desfazer e o sistema de arquivos do nó de dados em discos físicos separados. Se você fizer isso com alguns ou todos esses conjuntos de arquivos, então você pode (e deve) aumentar o `DiskIOThreadPool` para permitir que os threads separados lidem com os arquivos em cada disco.

    No NDB 8.0, você também deve desabilitar `DiskDataUsingSameDisk` ao usar um disco ou discos separados para os arquivos de dados do disco; isso aumenta a taxa em que os pontos de verificação dos espaços de tabelas de dados do disco podem ser realizados.

  - **Desempenho e tipos de disco.** O número de threads que podem ser acomodados para o manuseio de arquivos de dados de disco também depende da velocidade e do desempenho dos discos. Discos mais rápidos e maior capacidade de transferência permitem mais threads de E/S de disco. Nossos resultados de teste indicam que os discos de estado sólido podem lidar com muito mais threads de E/S de disco do que os discos convencionais, e, portanto, valores mais altos para `DiskIOThreadPool`.

    A redução de `TimeBetweenGlobalCheckpoints` também é recomendada ao usar unidades de disco de estado sólido, especialmente aquelas que utilizam NVMe. Veja também os parâmetros de latência de dados do disco.

  O valor padrão para este parâmetro é 2.

- **Parâmetros do sistema de arquivos de dados do disco.** Os parâmetros na lista a seguir permitem que os arquivos de dados do disco do NDB Cluster sejam colocados em diretórios específicos sem a necessidade de usar links simbólicos.

  - `FileSystemPathDD`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>57

    Se este parâmetro for especificado, os arquivos de dados do NDB Cluster Disk e os arquivos de log de desfazer serão colocados no diretório indicado. Isso pode ser substituído para arquivos de dados, arquivos de log de desfazer ou ambos, especificando valores para `FileSystemPathDataFiles`, `FileSystemPathUndoFiles` ou ambos, conforme explicado para esses parâmetros. Também pode ser substituído para arquivos de dados, especificando um caminho na cláusula `ADD DATAFILE` de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`, e para arquivos de log de desfazer, especificando um caminho na cláusula `ADD UNDOFILE` de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`. Se `FileSystemPathDD` não for especificado, será usado `FileSystemPath`.

    Se um diretório `FileSystemPathDD` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao iniciar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

  - `FileSystemPathDataFiles`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>58

    Se este parâmetro for especificado, os arquivos de dados do disco do NDB Cluster serão colocados no diretório indicado. Isso substitui qualquer valor definido para `FileSystemPathDD`. Este parâmetro pode ser substituído para um arquivo de dados específico, especificando um caminho na cláusula `ADD DATAFILE` de uma instrução `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar esse arquivo de dados. Se `FileSystemPathDataFiles` não for especificado, então `FileSystemPathDD` será usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido definido).

    Se um diretório `FileSystemPathDataFiles` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao iniciar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

  - `FileSystemPathUndoFiles`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>59

    Se este parâmetro for especificado, os arquivos de registro de desfazer do NDB Cluster Disk Data serão colocados no diretório indicado. Isso substitui qualquer valor definido para `FileSystemPathDD`. Este parâmetro pode ser substituído para um arquivo de dados específico, especificando um caminho na cláusula `ADD UNDO` de uma instrução `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP` usada para criar esse arquivo de dados. Se `FileSystemPathUndoFiles` não for especificado, então `FileSystemPathDD` será usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido definido).

    Se um diretório `FileSystemPathUndoFiles` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao iniciar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

  Para obter mais informações, consulte a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”.

- **Parâmetros de criação do objeto de dados de disco.** Os dois parâmetros seguintes permitem que, ao iniciar o clúster pela primeira vez, você crie um grupo de arquivos de log de dados de disco, um espaço de tabelas ou ambos, sem o uso de instruções SQL.

  - `InitialLogFileGroup`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>60

    Este parâmetro pode ser usado para especificar um grupo de arquivo de registro que é criado ao realizar o início inicial do clúster. `InitialLogFileGroup` é especificado conforme mostrado aqui:

    ```
    InitialLogFileGroup = [name=name;] [undo_buffer_size=size;] file-specification-list

    file-specification-list:
        file-specification[; file-specification[; ...]]

    file-specification:
        filename:size
    ```

    O `name` do grupo de arquivos de registro é opcional e tem como padrão `DEFAULT-LG`. O `undo_buffer_size` também é opcional; se omitido, tem como padrão `64M`. Cada `file-specification` corresponde a um arquivo de registro de desfazer, e pelo menos um deve ser especificado no `file-specification-list`. Os arquivos de registro de desfazer são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathUndoFiles`, assim como se tivessem sido criados como resultado de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`.

    Considere o seguinte:

    ```
    InitialLogFileGroup = name=LG1; undo_buffer_size=128M; undo1.log:250M; undo2.log:150M
    ```

    Isso é equivalente às seguintes instruções SQL:

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

    Esse grupo de arquivos de registro é criado quando os nós de dados são iniciados com `--initial`.

    Os recursos do grupo inicial de arquivos de registro são adicionados ao pool de memória global juntamente com os indicados pelo valor de `SharedGlobalMemory`.

    Este parâmetro, se utilizado, deve ser definido sempre na seção `[ndbd default]` do arquivo `config.ini`. O comportamento de um NDB Cluster quando diferentes valores são definidos em diferentes nós de dados não é definido.

  - `InitialTablespace`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>61

    Este parâmetro pode ser usado para especificar um espaço de dados de tabela de disco do NDB Cluster que é criado ao realizar o início inicial do cluster. `InitialTablespace` é especificado conforme mostrado aqui:

    ```
    InitialTablespace = [name=name;] [extent_size=size;] file-specification-list
    ```

    O `name` do espaço de tabelas é opcional e tem como padrão `DEFAULT-TS`. O `extent_size` também é opcional; ele tem como padrão `1M`. O `file-specification-list` usa a mesma sintaxe mostrada com o parâmetro `InitialLogfileGroup`, a única diferença sendo que cada `file-specification` usado com `InitialTablespace` corresponde a um arquivo de dados. Pelo menos um deve ser especificado no `file-specification-list`. Os arquivos de dados são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathDataFiles`, assim como se tivessem sido criados como resultado de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`.

    Por exemplo, considere a seguinte linha que especifica `InitialTablespace` na seção `[ndbd default]` do arquivo `config.ini` (assim como `InitialLogfileGroup`, este parâmetro deve ser sempre definido na seção `[ndbd default]`, pois o comportamento de um NDB Cluster quando diferentes valores são definidos em diferentes nós de dados não é definido):

    ```
    InitialTablespace = name=TS1; extent_size=8M; data1.dat:2G; data2.dat:4G
    ```

    Isso é equivalente às seguintes instruções SQL:

    ```
    CREATE TABLESPACE TS1
        ADD DATAFILE 'data1.dat'
        EXTENT_SIZE 8M
        INITIAL_SIZE 2G
        ENGINE NDBCLUSTER;

    ALTER TABLESPACE TS1
        ADD DATAFILE 'data2.dat'
        INITIAL_SIZE 4G
        ENGINE NDBCLUSTER;
    ```

    Esse espaço de tabela é criado quando os nós de dados são iniciados com `--initial`, e pode ser usado sempre que criar tabelas de NDB Cluster Disk Data posteriormente.

- **Parâmetros de latência de dados do disco.** Os dois parâmetros listados aqui podem ser usados para melhorar o gerenciamento de problemas de latência com as tabelas de dados do disco do NDB Cluster.

  - `MaxDiskDataLatency`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>62

    Este parâmetro controla a latência média máxima permitida para o acesso ao disco (máximo de 8000 milissegundos). Quando esse limite é atingido, o `NDB` começa a abortar as transações para diminuir a pressão sobre o subsistema de E/S de dados do disco. Use `0` para desabilitar a verificação de latência.

  - `DiskDataUsingSameDisk`

    <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>63

    Defina este parâmetro para `false` se suas tabelaspaces de dados de disco usarem um ou mais discos separados. Isso permite que os pontos de verificação para tabelaspaces sejam executados em uma taxa mais alta do que a normalmente usada quando os discos são compartilhados.

    Quando `DiskDataUsingSameDisk` é `true`, `NDB` diminui a taxa de verificação de dados do disco sempre que um checkpoint em memória estiver em andamento, para ajudar a garantir que a carga do disco permaneça constante.

**Erros de dados do disco e GCP Stop.**

Os erros encontrados ao usar tabelas de dados de disco, como o nó `nodeid`, que mataram esse nó porque foi detectado um travamento do GCP (erro 2303), são frequentemente chamados de “erros de travamento do GCP”. Esses erros ocorrem quando o log de redo não é descarregado no disco com rapidez suficiente; isso geralmente ocorre devido a discos lentos e capacidade de processamento de disco insuficiente.

Você pode ajudar a evitar esses erros usando discos mais rápidos e colocando os arquivos de dados do disco em um disco separado do sistema de arquivos do nó de dados. Reduzir o valor de `TimeBetweenGlobalCheckpoints` tende a diminuir a quantidade de dados a serem escritos para cada ponto de verificação global, e assim pode oferecer alguma proteção contra transbordamentos do buffer do log de refazer ao tentar escrever um ponto de verificação global; no entanto, reduzir esse valor também permite menos tempo para escrever o GCP, então isso deve ser feito com cautela.

Além das considerações dadas para `DiskPageBufferMemory`, conforme explicado anteriormente, também é muito importante que o parâmetro de configuração `DiskIOThreadPool` seja configurado corretamente; configurar `DiskIOThreadPool` muito alto provavelmente causará erros de parada do GCP (Bug #37227).

As interrupções do GCP podem ser causadas por temporizadores de salvamento ou commit; o parâmetro de configuração do nó de dados `TimeBetweenEpochsTimeout` determina o temporizador para commits. No entanto, é possível desativar ambos os tipos de temporizadores ao definir este parâmetro para 0.

**Parâmetros para configurar a alocação de memória do buffer de envio.** A memória do buffer de envio é alocada dinamicamente de um pool de memória compartilhado entre todos os transportadores, o que significa que o tamanho do buffer de envio pode ser ajustado conforme necessário. (Anteriormente, o kernel NDB usava um buffer de envio de tamanho fixo para cada nó no clúster, que era alocado quando o nó era iniciado e não podia ser alterado enquanto o nó estivesse em execução.) Os parâmetros de configuração dos nós de dados `TotalSendBufferMemory` e `OverLoadLimit` permitem a definição de limites para essa alocação de memória. Para mais informações sobre o uso desses parâmetros (assim como `SendBufferMemory`), consulte a Seção 25.4.3.14, “Configurando Parâmetros do Buffer de Envio do Clúster NDB”.

- `ExtraSendBufferMemory`

  Este parâmetro especifica a quantidade de memória de buffer de envio do transportador a ser alocada, além de qualquer configuração feita com `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

- `TotalSendBufferMemory`

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste nó para a memória do buffer de envio compartilhado entre todos os transportadores configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 25.4.3.14, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

Veja também a Seção 25.6.7, “Adicionar nós de dados do NDB Cluster Online”.

**Tratamento de transações com excesso de registro de refazer.** É possível controlar o tratamento de operações de um nó de dados quando leva muito tempo para limpar os registros de refazer no disco. Isso ocorre quando uma limpeza de registro de refazer específico leva mais de `RedoOverCommitLimit` segundos, mais de `RedoOverCommitCounter` vezes, fazendo com que quaisquer transações pendentes sejam abortadas. Quando isso acontece, o nó da API que enviou a transação pode lidar com as operações que deveriam ter sido concluídas, agilizando-as e tentando novamente, ou abortando-as, conforme determinado por `DefaultOperationRedoProblemAction`. Os parâmetros de configuração do nó de dados para definir o tempo de espera e o número de vezes que ele pode ser excedido antes que o nó da API tome essa ação estão descritos na lista a seguir:

- `RedoOverCommitCounter`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>64

  Quando `RedoOverCommitLimit` é excedido ao tentar gravar um log de reverter dado número de vezes ou mais no disco, quaisquer transações que não foram confirmadas são abortadas, e um nó da API onde qualquer uma dessas transações foi originada processa as operações que compõem essas transações de acordo com seu valor para `DefaultOperationRedoProblemAction` (enquanto enfileira as operações para serem repetidas ou as aborta).

- `RedoOverCommitLimit`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>65

  Este parâmetro define um limite superior em segundos para tentar escrever um log de refazer dado no disco antes de esgotar o tempo. O número de vezes que o nó de dados tenta descartar este log de refazer, mas leva mais tempo do que `RedoOverCommitLimit`, é mantido e comparado com `RedoOverCommitCounter`, e quando o descarte leva muito tempo, mais vezes do que o valor desse parâmetro, quaisquer transações que não foram comprometidas como resultado do tempo de espera para descarte são abortadas. Quando isso ocorre, o nó da API onde qualquer uma dessas transações foi originada processa as operações que compõem essas transações de acordo com a configuração do seu `DefaultOperationRedoProblemAction` (ele ou enfileira as operações para serem re-providas, ou as aborta).

**Controle de tentativas de reinício.** É possível exercer um controle detalhado sobre as tentativas de reinício por nós de dados quando eles não conseguem iniciar usando os parâmetros de configuração dos nós de dados `MaxStartFailRetries` e `StartFailRetryDelay`.

`MaxStartFailRetries` limita o número total de tentativas antes de desistir de iniciar o nó de dados, `StartFailRetryDelay` define o número de segundos entre as tentativas de recomeço. Esses parâmetros estão listados aqui:

- `StartFailRetryDelay`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>66

  Use este parâmetro para definir o número de segundos entre as tentativas de reinício do nó de dados no evento de falha ao iniciar. O padrão é 0 (sem atraso).

  Ambos os parâmetros e `MaxStartFailRetries` são ignorados, a menos que `StopOnError` seja igual a 0.

- `MaxStartFailRetries`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>67

  Use este parâmetro para limitar o número de tentativas de reinício feitas pelo nó de dados no caso de ele falhar ao iniciar. O padrão é 3 tentativas.

  Ambos os parâmetros e `StartFailRetryDelay` são ignorados, a menos que `StopOnError` seja igual a 0.

**Parâmetros das estatísticas do índice NDB.**

Os parâmetros na lista a seguir estão relacionados à geração de estatísticas do índice NDB.

- `IndexStatAutoCreate`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>68

  Ative (defina igual a 1) ou desative (defina igual a 0) a coleta automática de estatísticas quando os índices são criados.

- `IndexStatAutoUpdate`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>69

  Ative (defina igual a 1) ou desative (defina igual a 0) o monitoramento de índices para alterações e inicie atualizações automáticas de estatísticas quando essas alterações forem detectadas. O grau de mudança necessário para ativar as atualizações é determinado pelas configurações das opções `IndexStatTriggerPct` e `IndexStatTriggerScale`.

- `IndexStatSaveSize`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>70

  Espaço máximo em bytes permitido para as estatísticas salvas de qualquer índice dado nas tabelas de sistema `NDB` e no cache de memória do **mysqld**.

  Pelo menos uma amostra é sempre produzida, independentemente de qualquer limite de tamanho. Esse tamanho é escalado por `IndexStatSaveScale`.

  O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, multiplicado por 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escala.

- `IndexStatSaveScale`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>71

  O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, multiplicado por 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escala.

- `IndexStatTriggerPct`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>72

  Mudança percentual nas atualizações que aciona uma atualização de estatísticas do índice. O valor é escalado por `IndexStatTriggerScale`. Você pode desativar esse gatilho completamente configurando `IndexStatTriggerPct` para 0.

- `IndexStatTriggerScale`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>73

  Escala `IndexStatTriggerPct` por esse valor vezes 0,01 para um índice grande. Um valor de 0 desativa a escala.

- `IndexStatUpdateDelay`

  <table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>74

  Atraso mínimo em segundos entre as atualizações automáticas das estatísticas do índice para um determinado índice. Definir essa variável para 0 desabilita qualquer atraso. O valor padrão é de 60 segundos.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 25.16 Tipos de reinício de cluster do NDB**

<table summary="Tipo e valor das informações do parâmetro de configuração do nó de dados ExecuteOnComputer" width="35%"><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>Sim (em NDB 7.5)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 8.0.13)</p></td> </tr></tbody></table>75
