### 25.5.7 ndb\_config — Extrair informações de configuração do cluster NDB

Essa ferramenta extrai informações de configuração atuais para nós de dados, nós SQL e nós API de uma das várias fontes: um nó de gerenciamento do NDB Cluster ou seu arquivo `config.ini` ou `my.cnf`. Por padrão, o nó de gerenciamento é a fonte dos dados de configuração; para substituir o padrão, execute ndb\_config com a opção `--config-file` ou `--mycnf`. Também é possível usar um nó de dados como fonte, especificando seu ID de nó com `--config_from_node=node_id`.

O **ndb\_config** também pode fornecer um dump offline de todos os parâmetros de configuração que podem ser usados, juntamente com seus valores padrão, máximo e mínimo e outras informações. O dump pode ser produzido no formato de texto ou XML; para mais informações, consulte a discussão das opções `--configinfo` e `--xml` mais adiante nesta seção).

Você pode filtrar os resultados por seção (`DB`, `SYSTEM` ou `CONNECTIONS`) usando uma das opções `--nodes`, `--system` ou `--connections`.

Todas as opções que podem ser usadas com **ndb\_config** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.29 Opções de linha de comando usadas com o programa ndb\_config**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Substitua o sufixo padrão do grupo ao ler seções do cluster_config no arquivo my.cnf; usado em testes</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Leia este arquivo de configuração binário</td> <td><p>ADICIONADO: NDB 8.0.32</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-file=path </code>] </p></th> <td>Defina o caminho para o arquivo config.ini</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Obtenha os dados de configuração do nó com este ID (deve ser um nó de dados)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --diff-default </code>] </p></th> <td>Exibe informações sobre todos os parâmetros de configuração do NDB em formato de texto, com valores padrão, máximo e mínimo. Use com --xml para obter saída em formato XML</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--fields=string</code>] </p></th> <td>Imprima informações apenas sobre as conexões especificadas nas seções [tc<code> -c connection_string </code>, [tcp defaul<code> -c connection_string </code>, [sci], [sci defaul<code> -c connection_string </code>, [sh<code> -c connection_string </code> ou [shm defaul<code> -c connection_string </code> do arquivo de configuração do cluster. Não pode ser usado com --system ou --nodes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -f </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -? </code>],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --cluster-config-suffix=name </code><code> -c connection_string </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-extra-file=path </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-file=path </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --diff-default </code>]] </p></th> <td>Imprima apenas os parâmetros de configuração que têm valores não padrão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--fields=string</code>]],</p><p> [[<code> -f </code>]] </p></th> <td>Separador de campo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code> -c connection_string </code>] </p></th> <td>Especifique o host</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code> -c connection_string </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code> --defaults-extra-file=path </code>] </p></th> <td>Ler dados de configuração do arquivo my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-binary-file=path/to/file </code><code> --defaults-file=path </code>],</p><p> [[<code> --config-binary-file=path/to/file </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> -c connection_string </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-binary-file=path/to/file </code><code> --diff-default </code>],</p><p> [[<code> --config-binary-file=path/to/file </code><code>--fields=string</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code> -f </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code>--help</code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-binary-file=path/to/file </code><code> -? </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-file=file_name </code><code> -c connection_string </code>] </p></th> <td>Obtenha a configuração do nó com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-file=file_name </code><code> -c connection_string </code>] </p></th> <td>Imprima apenas as informações do nó ([seção ndb<code> -c connection_string </code> ou [ndbd padrã<code> -c connection_string </code> do arquivo de configuração do cluster). Não pode ser usado com --system ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-file=file_name </code><code> --defaults-extra-file=path </code>],</p><p> [[<code> --config-file=file_name </code><code> --defaults-file=path </code>] </p></th> <td>Uma ou mais opções de consulta (atributos)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-file=file_name </code><code> --defaults-group-suffix=string </code>],</p><p> [[<code> --config-file=file_name </code><code> --diff-default </code>] </p></th> <td>Descarrega todos os parâmetros e valores em uma única string delimitada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-file=file_name </code><code>--fields=string</code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-file=file_name </code><code> -f </code>],</p><p> [[<code> --config-file=file_name </code><code>--help</code>] </p></th> <td>Separador de linhas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-file=file_name </code><code> -? </code>] </p></th> <td>Imprima apenas as informações da seção SYSTEM (consulte ndb_config --configinfo output). Não pode ser usado com --nodes ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-from-node=# </code><code> -c connection_string </code>] </p></th> <td>Especifique o tipo de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-from-node=# </code><code> -c connection_string </code>],</p><p> [[<code> --config-from-node=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --config-from-node=# </code><code> --defaults-file=path </code>],</p><p> [[<code> --config-from-node=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --config-from-node=# </code><code> --diff-default </code>] </p></th> <td>Use --xml com --configinfo para obter um dump de todos os parâmetros de configuração do NDB no formato XML com valores padrão, máximo e mínimo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

- `cluster-config-suffix`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Sobrepor o sufixo do grupo padrão ao ler seções de configuração de cluster em `my.cnf`; usado em testes.

- `--configinfo`

  A opção `--configinfo` faz com que o **ndb\_config** exiba uma lista de cada parâmetro de configuração do NDB Cluster suportado pela distribuição do NDB Cluster da qual o **ndb\_config** faz parte, incluindo as seguintes informações:

  - Uma breve descrição do propósito, efeitos e uso de cada parâmetro

  - A seção do arquivo `config.ini` onde o parâmetro pode ser usado

  - O tipo de dado ou unidade de medida do parâmetro

  - Quando aplicável, os valores padrão, mínimo e máximo do parâmetro

  - Versão do lançamento do cluster do NDB e informações de compilação

  Por padrão, essa saída é em formato de texto. Parte dessa saída é mostrada aqui:

  ```
  $> ndb_config --configinfo

  ****** SYSTEM ******

  Name (String)
  Name of system (NDB Cluster)
  MANDATORY

  PrimaryMGMNode (Non-negative Integer)
  Node id of Primary ndb_mgmd(MGM) node
  Default: 0 (Min: 0, Max: 4294967039)

  ConfigGenerationNumber (Non-negative Integer)
  Configuration generation number
  Default: 0 (Min: 0, Max: 4294967039)

  ****** DB ******

  MaxNoOfSubscriptions (Non-negative Integer)
  Max no of subscriptions (default 0 == MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  MaxNoOfSubscribers (Non-negative Integer)
  Max no of subscribers (default 0 == 2 * MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  …
  ```

  Use esta opção juntamente com a opção `--xml` para obter a saída no formato XML.

- `--config-binary-file=path-to-file`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Fornece o caminho para o arquivo de configuração binário cacheado do servidor de gerenciamento (`ndb_nodeID_config.bin.seqno`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb\_config** usados estiverem em hosts diferentes, você deve usar um caminho absoluto.

  Este exemplo demonstra a combinação de `--config-binary-file` com outras opções do **ndb\_config** para obter uma saída útil:

  ```
  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --type=ndbd
  config of [DB] node id 5 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,5,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  config of [DB] node id 6 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,6,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --system
  config of [SYSTEM] system
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  Name,MC_20220216092809,(mandatory)
  ConfigGenerationNumber,1,0
  PrimaryMGMNode,50,0
  ```

  As partes relevantes do arquivo `config.ini` estão mostradas aqui:

  ```
  [ndbd default]
  DataMemory= 2G
  NoOfReplicas= 2

  [ndb_mgmd]
  NodeId= 50
  HostName= 127.0.0.1

  [ndbd]
  NodeId= 5
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0

  [ndbd]
  NodeId= 6
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0
  ```

  Ao comparar a saída com o arquivo de configuração, você pode ver que todos os ajustes no arquivo foram escritos pelo servidor de gerenciamento no cache binário e, assim, aplicados ao clúster.

- `--config-file=path-to-file`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Fornece o caminho para o arquivo de configuração do cluster (`config.ini`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb\_config** estiverem em hosts diferentes, você deve usar um caminho absoluto.

- `--config_from_node=#`

  <table summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Obtenha os dados de configuração do cluster a partir do nó de dados que possui esse ID.

  Se o nó com esse ID não for um nó de dados, o **ndb\_config** falha com um erro. (Para obter dados de configuração do nó de gerenciamento, omita essa opção.)

- `--connections`

  <table summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connections</code>]]</td> </tr></tbody></table>

  Informe ao **ndb\_config** para imprimir apenas as informações do `CONNECTIONS` — ou seja, as informações sobre os parâmetros encontrados nas seções `[tcp]`, `[tcp default]`, `[shm]` ou `[shm default]` do arquivo de configuração do cluster (consulte a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”, e a Seção 25.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, para obter mais informações).

  Esta opção é mutuamente exclusiva com `--nodes` e `--system`; apenas uma dessas 3 opções pode ser usada.

- `--diff-default`

  <table summary="Propriedades para diff-default"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--diff-default</code>]]</td> </tr></tbody></table>

  Imprima apenas os parâmetros de configuração que têm valores não padrão.

- `--fields=delimiter`, `-f` `delimiter`

  <table summary="Propriedades para campos"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--fields=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica uma string `delimiter` usada para separar os campos no resultado. O padrão é `,` (o caractere vírgula).

  Nota

  Se o `delimiter` contiver espaços ou escape (como `\n` para o caractere de retorno de linha), então ele deve ser citado.

- `--host=hostname`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica o nome do host do nó para o qual as informações de configuração devem ser obtidas.

  Nota

  Embora o nome de domínio `localhost` geralmente resolva para o endereço IP `127.0.0.1`, isso nem sempre é verdade para todas as plataformas e configurações operacionais. Isso significa que, quando `localhost` é usado em `config.ini`, é possível que o **ndb\_config `--host=localhost`** falhe se o **ndb\_config** for executado em um host diferente onde `localhost` resolva para um endereço diferente (por exemplo, em algumas versões do SUSE Linux, isso é `127.0.0.2`). Em geral, para obter os melhores resultados, você deve usar endereços IP numéricos para todos os valores de configuração do NDB Cluster relacionados a hosts, ou verificar se todos os hosts do NDB Cluster tratam o **ndb\_config `localhost`** da mesma maneira.

- `--mycnf`

  <table summary="Propriedades para mycnf"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mycnf</code>]]</td> </tr></tbody></table>

  Leia os dados de configuração do arquivo `my.cnf`.

- `--ndb-connectstring=connection_string`, `-c connection_string`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Especifica a cadeia de conexão a ser usada para se conectar ao servidor de gerenciamento. O formato da cadeia de conexão é o mesmo descrito na Seção 25.4.3.3, “Cadeias de Conexão de Clúster NDB”, e tem como padrão `localhost:1186`.

- `--no-defaults`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--nodeid=node_id`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  Especifique o ID do nó para o qual as informações de configuração devem ser obtidas.

- `--nodes`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  Instrui o **ndb\_config** a imprimir informações relacionadas apenas aos parâmetros definidos em uma seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração do cluster (consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”).

  Esta opção é mutuamente exclusiva com `--connections` e `--system`; apenas uma dessas 3 opções pode ser usada.

- `--query=query-options`, `-q` `query-options`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  Esta é uma lista delimitada por vírgula de opções de consulta, ou seja, uma lista de um ou mais atributos de nó a serem retornados. Estes incluem `nodeid` (ID do nó), tipo (tipo de nó — ou seja, `ndbd`, `mysqld` ou `ndb_mgmd`) e quaisquer parâmetros de configuração cujos valores devem ser obtidos.

  Por exemplo, `--query=nodeid,type,datamemory,datadir` retorna o ID do nó, o tipo do nó, `DataMemory` e `DataDir` para cada nó.

  Nota

  Se um parâmetro específico não for aplicável a um determinado tipo de nó, uma string vazia será retornada para o valor correspondente. Consulte os exemplos mais adiante nesta seção para obter mais informações.

- `--query-all`, `-a`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>5

  Retorna uma lista separada por vírgula de todas as opções de consulta (atributos do nó; observe que essa lista é uma única string.

- `--rows=separator`, `-r` `separator`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>6

  Especifica uma cadeia de caracteres `separator` usada para separar as linhas no resultado. O padrão é um caractere de espaço.

  Nota

  Se o `separator` contiver espaços ou escape (como `\n` para o caractere de retorno de linha), então ele deve ser citado.

- `--system`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>7

  Diga ao **ndb\_config** para imprimir apenas as informações do `SYSTEM`. Isso consiste em variáveis do sistema que não podem ser alteradas no tempo de execução; portanto, não há uma seção correspondente do arquivo de configuração do cluster para elas. Elas podem ser vistas (com o prefixo `****** SYSTEM ******`) na saída do **ndb\_config** `--configinfo`.

  Esta opção é mutuamente exclusiva com `--nodes` e `--connections`; apenas uma dessas 3 opções pode ser usada.

- `--type=node_type`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>8

  Filtra os resultados para que apenas os valores de configuração que se aplicam aos nós do `node_type` especificado (`ndbd`, `mysqld` ou `ndb_mgmd`) sejam retornados.

- `--usage`, `--help` ou `-?`

  <table summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--cluster-config-suffix=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>9

  Faz com que **ndb\_config** imprima uma lista de opções disponíveis e, em seguida, saia.

- `--version`, `-V`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>0

  Faz com que **ndb\_config** imprima uma string de informações da versão e, em seguida, saia.

- `--configinfo` `--xml`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>1

  Para que o **ndb\_config** `--configinfo` forneça a saída como XML, adicione esta opção. Uma parte dessa saída é mostrada neste exemplo:

  ```
  $> ndb_config --configinfo --xml

  <configvariables protocolversion="1" ndbversionstring="5.7.44-ndb-7.5.36"
                      ndbversion="460032" ndbversionmajor="7" ndbversionminor="5"
                      ndbversionbuild="0">
    <section name="SYSTEM">
      <param name="Name" comment="Name of system (NDB Cluster)" type="string"
                mandatory="true"/>
      <param name="PrimaryMGMNode" comment="Node id of Primary ndb_mgmd(MGM) node"
                type="unsigned" default="0" min="0" max="4294967039"/>
      <param name="ConfigGenerationNumber" comment="Configuration generation number"
                type="unsigned" default="0" min="0" max="4294967039"/>
    </section>
    <section name="MYSQLD" primarykeys="NodeId">
      <param name="wan" comment="Use WAN TCP setting as default" type="bool"
                default="false"/>
      <param name="HostName" comment="Name of computer for this node"
                type="string" default=""/>
      <param name="Id" comment="NodeId" type="unsigned" mandatory="true"
                min="1" max="255" deprecated="true"/>
      <param name="NodeId" comment="Number identifying application node (mysqld(API))"
                type="unsigned" mandatory="true" min="1" max="255"/>
      <param name="ExecuteOnComputer" comment="HostName" type="string"
                deprecated="true"/>

      …

    </section>

    …

  </configvariables>
  ```

  Nota

  Normalmente, a saída XML produzida pelo **ndb\_config** `--configinfo` `--xml` é formatada com uma linha por elemento; adicionamos espaços extras no exemplo anterior e no seguinte, por questões de legibilidade. Isso não deve fazer diferença para as aplicações que utilizam essa saída, uma vez que a maioria dos processadores de XML ignora espaços em branco não essenciais como uma questão de rotina ou pode ser instruída a fazer isso.

  A saída XML também indica quando a alteração de um parâmetro específico exige que os nós de dados sejam reiniciados usando a opção `--initial`. Isso é mostrado pela presença de um atributo `initial="true"` no elemento correspondente `<param>`. Além disso, o tipo de reinício (`system` ou `node`) também é mostrado; se um parâmetro específico requer um reinício do sistema, isso é indicado pela presença de um atributo `restart="system"` no elemento correspondente `<param>`. Por exemplo, alterar o valor definido para o parâmetro `Diskless` requer um reinício inicial do sistema, como mostrado aqui (com os atributos `restart` e `initial` destacados para visibilidade):

  ```
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Atualmente, nenhum atributo `initial` é incluído na saída XML para elementos `<param>` correspondentes a parâmetros que não requerem reinicializações iniciais; em outras palavras, `initial="false"` é o padrão, e o valor `false` deve ser assumido se o atributo não estiver presente. Da mesma forma, o tipo de reinicialização padrão é `node` (ou seja, uma reinicialização online ou "rolling" do clúster), mas o atributo `restart` é incluído apenas se o tipo de reinicialização for `system` (o que significa que todos os nós do clúster devem ser desligados ao mesmo tempo, depois reiniciados).

  Os parâmetros desatualizados são indicados no resultado XML pelo atributo `deprecated`, conforme mostrado aqui:

  ```
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  Nesses casos, o `comment` refere-se a um ou mais parâmetros que substituem o parâmetro descontinuado. Da mesma forma que o `initial`, o atributo `deprecated` é indicado apenas quando o parâmetro está descontinuado, com `deprecated="true"`, e não aparece em absoluto para os parâmetros que não estão descontinuados. (Bug #21127135)

  Os parâmetros necessários são indicados com `mandatory="true"`, conforme mostrado aqui:

  ```
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  Da mesma forma que o atributo `initial` ou `deprecated` é exibido apenas para um parâmetro que requer um reinício inicial ou que está desatualizado, o atributo `mandatory` é incluído apenas se o parâmetro fornecido for realmente necessário.

  Importante

  A opção `--xml` só pode ser usada com a opção `--configinfo`. O uso de `--xml` sem `--configinfo` resulta em um erro.

  Diferentemente das opções usadas com este programa para obter dados de configuração atuais, `--configinfo` e `--xml` utilizam informações obtidas das fontes do NDB Cluster quando o **ndb\_config** foi compilado. Por essa razão, não é necessário fazer uma conexão com um NDB Cluster em execução ou acessar um arquivo `config.ini` ou `my.cnf` para essas duas opções.

- `--print-defaults`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>2

  Imprima a lista de argumentos do programa e saia.

- `--defaults-file`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>3

  Leia as opções padrão do arquivo fornecido.

- `--defaults-extra-file`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>4

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-group-suffix`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>5

  Leia também grupos com concatenação (grupo, sufixo).

- `--login-path`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>6

  Leia o caminho fornecido a partir do arquivo de login.

- `--help`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>7

  Exibir texto de ajuda e sair.

- `--connect-string`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>8

  O mesmo que `--ndb-connectstring`.

- `--ndb-mgmd-host`

  <table summary="Propriedades para config-binary-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-binary-file=path/to/file</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>9

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>0

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--core-file`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>1

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--character-sets-dir`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>2

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>3

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>4

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>5

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

Combinar outras opções de **ndb\_config** (como `--query` ou `--type`) com `--configinfo` (com ou sem a opção `--xml` não é suportado. Atualmente, se você tentar fazer isso, o resultado usual é que todas as outras opções, além de `--configinfo` ou `--xml`, são simplesmente ignoradas. *No entanto, esse comportamento não é garantido e está sujeito a alterações a qualquer momento*. Além disso, como o **ndb\_config**, quando usado com a opção `--configinfo`, não acessa o NDB Cluster ou não lê nenhum arquivo, tentar especificar opções adicionais como `--ndb-connectstring` ou `--config-file` com `--configinfo` não serve para nada.

#### Exemplos

1. Para obter o ID do nó e o tipo de cada nó no cluster:

   ```
   $> ./ndb_config --query=nodeid,type --fields=':' --rows='\n'
   1:ndbd
   2:ndbd
   3:ndbd
   4:ndbd
   5:ndb_mgmd
   6:mysqld
   7:mysqld
   8:mysqld
   9:mysqld
   ```

   Neste exemplo, usamos as opções `--fields` para separar o ID e o tipo de cada nó com um caractere de colon (`:`), e as opções `--rows` para colocar os valores de cada nó em uma nova linha na saída.

2. Para criar uma cadeia de conexão que possa ser usada por nós de dados, SQL e API para se conectar ao servidor de gerenciamento:

   ```
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. Essa invocação do **ndb\_config** verifica apenas os nós de dados (usando a opção `--type`), e mostra os valores para o ID e o nome do host de cada nó, bem como os valores definidos para seus parâmetros `DataMemory` e `DataDir`:

   ```
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   Neste exemplo, usamos as opções curtas `-f` e `-r` para definir o delimitador de campo e o separador de linha, respectivamente, além da opção curta `-q` para passar uma lista de parâmetros a serem obtidos.

4. Para excluir resultados de qualquer host, exceto um em particular, use a opção `--host`:

   ```
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   Neste exemplo, também usamos a forma abreviada `-q` para determinar os atributos a serem consultados.

   Da mesma forma, você pode limitar os resultados a um nó com um ID específico usando a opção `--nodeid`.
