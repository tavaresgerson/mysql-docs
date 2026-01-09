### 21.5.7 ndb\_config — Extrair informações de configuração do cluster NDB

Essa ferramenta extrai informações de configuração atuais para nós de dados, nós SQL e nós API de uma das várias fontes: um nó de gerenciamento do NDB Cluster ou seu arquivo `config.ini` ou `my.cnf`. Por padrão, o nó de gerenciamento é a fonte dos dados de configuração; para substituir o padrão, execute o ndb\_config com a opção `--config-file` ou `--mycnf`. Também é possível usar um nó de dados como fonte, especificando seu ID de nó com `--config_from_node=node_id`.

**ndb\_config** também pode fornecer um dump offline de todos os parâmetros de configuração que podem ser usados, juntamente com seus valores padrão, máximo e mínimo e outras informações. O dump pode ser produzido no formato de texto ou XML; para mais informações, consulte a discussão das opções `--configinfo` e `--xml` mais adiante nesta seção).

Você pode filtrar os resultados por seção (`DB`, `SISTEMA` ou `CONEXÕES`) usando uma das opções `--nodes`, `--system` ou `--connections`.

As opções que podem ser usadas com **ndb\_config** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.27 Opções de linha de comando usadas com o programa ndb\_config**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Defina o caminho para o arquivo config.ini</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Obtenha os dados de configuração do nó com este ID (deve ser um nó de dados)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code>] </p></th> <td>Exibe informações sobre todos os parâmetros de configuração do NDB em formato de texto, com valores padrão, máximo e mínimo. Use com --xml para obter saída em formato XML</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">--fields=string</a></code>] </p></th> <td>Imprima informações apenas sobre as conexões especificadas nas seções [tc<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>, [tcp defaul<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>, [sci], [sci defaul<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>, [sh<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code> ou [shm defaul<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code> do arquivo de configuração do cluster. Não pode ser usado com --system ou --nodes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">-f</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">--help</a></code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">-?</a> </code>],</p><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_host">--host=name</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_login-path">--login-path=path</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config-file">--config-file=file_name</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code>]] </p></th> <td>Imprima apenas os parâmetros de configuração que têm valores não padrão</td> <td><p>ADICIONADO: NDB 7.5.7, NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th><p>[[<code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">--fields=string</a></code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">-f</a> </code>]] </p></th> <td>Separador de campo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">--help</a></code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_host">--host=name</a> </code>]] </p></th> <td>Especifique o host</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Ler dados de configuração do arquivo my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">--fields=string</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">-f</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">--help</a></code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">-?</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_host">--host=name</a> </code>] </p></th> <td>Obtenha a configuração do nó com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_login-path">--login-path=path</a> </code>] </p></th> <td>Imprima apenas as informações do nó ([seção ndb<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code> ou [ndbd padrã<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code> do arquivo de configuração do cluster). Não pode ser usado com --system ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Uma ou mais opções de consulta (atributos)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code>] </p></th> <td>Descarrega todos os parâmetros e valores em uma única string delimitada por vírgula</td> <td><p>ADICIONADO: NDB 7.4.16, NDB 7.5.7</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">--fields=string</a></code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">-f</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">--help</a></code>] </p></th> <td>Separador de linhas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">-?</a> </code>] </p></th> <td>Imprima apenas as informações da seção SYSTEM (consulte ndb_config --configinfo output). Não pode ser usado com --nodes ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_host">--host=name</a> </code>] </p></th> <td>Especifique o tipo de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_login-path">--login-path=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connections">--connections</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connections">--connections</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connections">--connections</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connections">--connections</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code>] </p></th> <td>Use --xml com --configinfo para obter um dump de todos os parâmetros de configuração do NDB no formato XML com valores padrão, máximo e mínimo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--configinfo`

  A opção `--configinfo` faz com que **ndb\_config** exiba uma lista de cada parâmetro de configuração do NDB Cluster suportado pela distribuição do NDB Cluster, da qual **ndb\_config** faz parte, incluindo as seguintes informações:

  - Uma breve descrição do propósito, efeitos e uso de cada parâmetro

  - A seção do arquivo `config.ini` onde o parâmetro pode ser usado

  - O tipo de dado ou unidade de medida do parâmetro

  - Quando aplicável, os valores padrão, mínimo e máximo do parâmetro

  - Versão do lançamento do cluster do NDB e informações de compilação

  Por padrão, essa saída é em formato de texto. Parte dessa saída é mostrada aqui:

  ```sql
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

- `--config-file=caminho-para-arquivo`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Fornece o caminho para o arquivo de configuração do servidor de gerenciamento (`config.ini`). Este pode ser um caminho relativo ou absoluto. Se o nó de gerenciamento estiver em um host diferente daquele em que o **ndb\_config** é invocado, então um caminho absoluto deve ser usado.

- `--config_from_node=#`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Obtenha os dados de configuração do cluster a partir do nó de dados que possui esse ID.

  Se o nó com esse ID não for um nó de dados, o **ndb\_config** falha com um erro. (Para obter dados de configuração do nó de gerenciamento, omita essa opção.)

- `--conexões`

  <table frame="box" rules="all" summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connections</code>]]</td> </tr></tbody></table>

  Informe ao **ndb\_config** que ele imprima apenas as informações de `CONNECTIONS`, ou seja, as informações sobre os parâmetros encontrados nas seções `[tcp]`, `[tcp default]`, `[shm]` ou `[shm default]` do arquivo de configuração do cluster (consulte Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster” e Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, para mais informações).

  Esta opção é mutuamente exclusiva de `--nodes` e `--system`; apenas uma dessas 3 opções pode ser usada.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--diff-default`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Imprima apenas os parâmetros de configuração que têm valores não padrão.

- `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Especifica uma cadeia de caracteres `delimitador` usada para separar os campos no resultado. O padrão é `,` (o caractere vírgula).

  Nota

  Se o delimitador contiver espaços ou escape (como `\n` para o caractere de retorno de linha), ele deve ser citado.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--host=hostname`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Especifica o nome do host do nó para o qual as informações de configuração devem ser obtidas.

  Nota

  Embora o nome de domínio `localhost` geralmente resolva para o endereço IP `127.0.0.1`, isso nem sempre é verdade para todas as plataformas e configurações operacionais. Isso significa que, quando `localhost` é usado em `config.ini`, o comando **ndb\_config --host=localhost** pode falhar se o **ndb\_config** for executado em um host diferente onde `localhost` seja resolvido para um endereço diferente (por exemplo, em algumas versões do SUSE Linux, este é `127.0.0.2`). Em geral, para obter os melhores resultados, você deve usar endereços IP numéricos para todos os valores de configuração do NDB Cluster relacionados a hosts, ou verificar se todos os hosts do NDB Cluster tratam `localhost` da mesma maneira.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--mycnf`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Leia os dados de configuração do arquivo `my.cnf`.

- `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Especifica a cadeia de conexão a ser usada para se conectar ao servidor de gerenciamento. O formato da cadeia de conexão é o mesmo descrito na Seção 21.4.3.3, "Cadeias de conexão de cluster NDB", e o padrão é `localhost:1186`.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--nodeid=node_id`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifique o ID do nó para o qual as informações de configuração devem ser obtidas. Anteriormente, `--id` poderia ser usado como sinônimo dessa opção; no NDB 7.5 e versões posteriores, a única forma aceita é `--nodeid`.

- `--nodes`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Informe **ndb\_config** para imprimir informações relacionadas apenas aos parâmetros definidos em uma seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração do cluster (consulte Seção 21.4.3.6, “Definindo NDB Cluster Data Nodes”).

  Esta opção é mutuamente exclusiva de `--connections` e `--system`; apenas uma dessas 3 opções pode ser usada.

- `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Esta é uma lista delimitada por vírgula de opções de consulta, ou seja, uma lista de um ou mais atributos de nó a serem retornados. Estes incluem `nodeid` (ID do nó), tipo (tipo de nó — ou seja, `ndbd`, `mysqld` ou `ndb_mgmd`) e quaisquer parâmetros de configuração cujos valores devem ser obtidos.

  Por exemplo, `--query=nodeid,type,datamemory,datadir` retorna o ID do nó, o tipo do nó, `DataMemory` e `DataDir` para cada nó.

  Anteriormente, `id` era aceito como sinônimo de `nodeid`, mas foi removido na NDB 7.5 e em versões posteriores.

  Nota

  Se um parâmetro específico não for aplicável a um determinado tipo de nó, uma string vazia será retornada para o valor correspondente. Consulte os exemplos mais adiante nesta seção para obter mais informações.

- `--query-all`, `-a`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Retorna uma lista separada por vírgula de todas as opções de consulta (atributos do nó; observe que essa lista é uma única string.

  Essa opção foi introduzida no NDB 7.5.7 (Bug #60095, Bug #11766869).

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica uma string de *separador* usada para separar as linhas no resultado. O padrão é um caractere de espaço.

  Nota

  Se o *`separator`* contiver espaços ou escape (como `\n` para o caractere de retorno de linha), ele deve ser citado.

- `--system`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Informe ao **ndb\_config** para imprimir apenas as informações do `SISTEMA`. Isso inclui variáveis do sistema que não podem ser alteradas em tempo de execução; portanto, não há uma seção correspondente do arquivo de configuração do clúster para elas. Elas podem ser vistas (com o prefixo `****** SISTEMA ******`) na saída do **ndb\_config** `--configinfo`.

  Esta opção é mutuamente exclusiva de `--nodes` e `--connections`; apenas uma dessas 3 opções pode ser usada.

- `--type=node_type`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Filtra os resultados para que apenas os valores de configuração que se aplicam aos nós do tipo especificado *`node_type`* (`ndbd`, `mysqld` ou `ndb_mgmd`) sejam retornados.

- `--usage`, `--help` ou `-?`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Faz com que **ndb\_config** imprima uma lista de opções disponíveis e, em seguida, saia. Sinônimo de `--help`.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Faz com que **ndb\_config** imprima uma string de informações da versão e, em seguida, saia.

- `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--config-from-node=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>48</code>]]</td> </tr></tbody></table>

  Para fornecer a saída como XML, adicione a opção `--configinfo` ao arquivo **ndb\_config**. Uma parte dessa saída é mostrada neste exemplo:

  ```sql
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

  Normalmente, a saída XML produzida pelo comando `--configinfo` `--xml` de **ndb\_config** é formatada com uma linha por elemento; adicionamos espaços extras no exemplo anterior e no seguinte, por questões de legibilidade. Isso não deve fazer diferença para as aplicações que utilizam essa saída, já que a maioria dos processadores de XML ignora espaços em branco não essenciais como uma questão de rotina ou pode ser instruída a fazer isso.

  A saída XML também indica quando a alteração de um parâmetro específico exige que os nós de dados sejam reiniciados usando a opção `--initial`. Isso é mostrado pela presença de um atributo `initial="true"` no elemento `<param>` correspondente. Além disso, o tipo de reinício (`system` ou `node`) também é mostrado; se um parâmetro específico requer um reinício do sistema, isso é indicado pela presença de um atributo `restart="system"` no elemento `<param>` correspondente. Por exemplo, alterar o valor definido para o parâmetro `Diskless` requer um reinício inicial do sistema, como mostrado aqui (com os atributos `restart` e `initial` destacados para visibilidade):

  ```sql
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Atualmente, nenhum atributo `initial` é incluído na saída XML para elementos `<param>` que correspondem a parâmetros que não requerem reinicializações iniciais; em outras palavras, `initial="false"` é o padrão, e o valor `false` deve ser assumido se o atributo não estiver presente. Da mesma forma, o tipo padrão de reinicialização é `node` (ou seja, uma reinicialização online ou "rolling" do clúster), mas o atributo `restart` é incluído apenas se o tipo de reinicialização for `system` (o que significa que todos os nós do clúster devem ser desligados ao mesmo tempo, e depois reiniciados).

  Os parâmetros desatualizados são indicados no resultado XML pelo atributo `deprecated`, conforme mostrado aqui:

  ```sql
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  Nesses casos, o `comment` refere-se a um ou mais parâmetros que substituem o parâmetro descontinuado. Da mesma forma que o `initial`, o atributo `deprecated` é indicado apenas quando o parâmetro está descontinuado, com `deprecated="true"`, e não aparece em absoluto para parâmetros que não estão descontinuados. (Bug #21127135)

  A partir da versão 7.5.0 do NDB, os parâmetros obrigatórios são indicados com `mandatory="true"`, conforme mostrado aqui:

  ```sql
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  Da mesma forma que o atributo `initial` ou `deprecated` é exibido apenas para um parâmetro que requer um reinício inicial ou que está desatualizado, o atributo `mandatory` é incluído apenas se o parâmetro fornecido for realmente necessário.

  Importante

  A opção `--xml` só pode ser usada com a opção `--configinfo`. Usar `--xml` sem `--configinfo` resulta em um erro.

  Ao contrário das opções usadas com este programa para obter dados de configuração atuais, `--configinfo` e `--xml` utilizam informações obtidas das fontes do NDB Cluster quando o **ndb\_config** foi compilado. Por essa razão, não é necessário fazer uma conexão com um NDB Cluster em execução ou acessar um arquivo `config.ini` ou `my.cnf` para essas duas opções.

Combinar outras opções de **ndb\_config** (como `--query` ou `--type`) com `--configinfo` (com ou sem a opção `--xml` não é suportada. Atualmente, se você tentar fazer isso, o resultado usual é que todas as outras opções, além de `--configinfo` ou `--xml`, são simplesmente ignoradas. *No entanto, esse comportamento não é garantido e está sujeito a mudanças a qualquer momento*. Além disso, desde **ndb\_config**, quando usado com a opção `--configinfo`, não acessa o NDB Cluster ou não lê nenhum arquivo, tentando especificar opções adicionais como `--ndb-connectstring` ou `--config-file` com `--configinfo` não serve para nada.

#### Exemplos

1. Para obter o ID do nó e o tipo de cada nó no cluster:

   ```sql
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

   Neste exemplo, usamos as opções ``--fields` para separar o ID e o tipo de cada nó com um caractere de colon (`:`), e as opções ``--rows` para colocar os valores de cada nó em uma nova linha na saída.

2. Para criar uma cadeia de conexão que possa ser usada por nós de dados, SQL e API para se conectar ao servidor de gerenciamento:

   ```sql
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. Essa invocação de **ndb\_config** verifica apenas os nós de dados (usando a opção `--type`), e mostra os valores para o ID e o nome do host de cada nó, bem como os valores definidos para seus parâmetros `DataMemory` e `DataDir`:

   ```sql
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   Neste exemplo, usamos as opções curtas `-f` e `-r` para definir o delimitador de campo e o separador de linha, respectivamente, além da opção curta `-q` para passar uma lista de parâmetros a serem obtidos.

4. Para excluir resultados de qualquer host, exceto um em particular, use a opção `--host`:

   ```sql
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   Neste exemplo, também usamos a forma abreviada `-q` para determinar os atributos a serem consultados.

   Da mesma forma, você pode limitar os resultados a um nó com um ID específico usando a opção `--nodeid`.
