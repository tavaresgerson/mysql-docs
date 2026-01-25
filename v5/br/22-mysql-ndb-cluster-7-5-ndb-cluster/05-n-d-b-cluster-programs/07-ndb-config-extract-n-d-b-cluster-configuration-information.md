### 21.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster

Esta ferramenta extrai informações de configuração atuais para Data Nodes, SQL Nodes e API Nodes de uma variedade de fontes: um Management Node do NDB Cluster, ou seus arquivos `config.ini` ou `my.cnf`. Por padrão, o Management Node é a fonte dos dados de configuração; para substituir o padrão, execute o `ndb_config` com a opção [`--config-file`](mysql-cluster-programs-ndb-config.html#option_ndb_config_config-file) ou [`--mycnf`](mysql-cluster-programs-ndb-config.html#option_ndb_config_mycnf). Também é possível usar um Data Node como fonte especificando seu ID de Node com [`--config_from_node=node_id`](mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node).

[**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") também pode fornecer um dump offline de todos os parâmetros de configuração, que podem ser usados, juntamente com seus valores default, máximo e mínimo e outras informações. O dump pode ser produzido no formato de texto ou XML; para mais informações, consulte a discussão das opções [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo) e [`--xml`](mysql-cluster-programs-ndb-config.html#option_ndb_config_xml) adiante nesta seção.

Você pode filtrar os resultados por seção (`DB`, `SYSTEM` ou `CONNECTIONS`) usando uma das opções [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes), [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system) ou [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections).

As opções que podem ser usadas com [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.27 Opções de linha de comando usadas com o programa ndb_config**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-file=file_name </code> </p></th> <td>Define o path para o arquivo config.ini</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-from-node=# </code> </p></th> <td>Obtém dados de configuração do Node que possui este ID (deve ser um Data Node)</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --configinfo </code> </p></th> <td>Faz Dump de informações sobre todos os parâmetros de configuração NDB em formato de texto com valores default, máximo e mínimo. Use com --xml para obter saída XML</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connections </code> </p></th> <td>Imprime informações apenas sobre as Connections especificadas nas seções [tcp], [tcp default], [sci], [sci default], [shm] ou [shm default] do arquivo de configuração do Cluster. Não pode ser usado com --system ou --nodes</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a Connection antes de desistir</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos de espera entre as tentativas de contato com o Management Server</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve arquivo core em caso de erro; usado em debugging</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções default somente do arquivo fornecido</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --diff-default </code> </p></th> <td>Imprime apenas os parâmetros de configuração que possuem valores não default</td> <td><p> ADICIONADO: NDB 7.5.7, NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--fields=string</code>, </p><p> <code> -f </code> </p></th> <td>Separador de Field</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --host=name </code> </p></th> <td>Especifica o host</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o path fornecido a partir do arquivo de login</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --mycnf </code> </p></th> <td>Lê dados de configuração do arquivo my.cnf</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a Connection string para conectar-se ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Substitui entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este Node, substituindo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para a seleção de Nodes para Transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções default de nenhum arquivo de opção além do arquivo de login</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodeid=# </code> </p></th> <td>Obtém a configuração do Node com este ID</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodes </code> </p></th> <td>Imprime informações do Node (seção [ndbd] ou [ndbd default] do arquivo de configuração do Cluster) apenas. Não pode ser usado com --system ou --connections</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query=string</code>, </p><p> <code> -q string </code> </p></th> <td>Uma ou mais opções de Query (attributes)</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query-all</code>, </p><p> <code> -a </code> </p></th> <td>Faz Dump de todos os parâmetros e valores em uma única string delimitada por vírgula</td> <td><p> ADICIONADO: NDB 7.4.16, NDB 7.5.7 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--rows=string</code>, </p><p> <code> -r string </code> </p></th> <td>Separador de Row</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --system </code> </p></th> <td>Imprime informações da seção SYSTEM apenas (veja a saída de ndb_config --configinfo). Não pode ser usado com --nodes ou --connections</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --type=name </code> </p></th> <td>Especifica o tipo de Node</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --configinfo --xml </code> </p></th> <td>Use --xml com --configinfo para obter um dump de todos os parâmetros de configuração NDB em formato XML com valores default, máximo e mínimo</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--configinfo`

  A opção `--configinfo` faz com que [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") faça um dump de uma lista de cada parâmetro de configuração do NDB Cluster suportado pela distribuição do NDB Cluster da qual [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") faz parte, incluindo as seguintes informações:

  + Uma breve descrição da finalidade, efeitos e uso de cada parâmetro

  + A seção do arquivo `config.ini` onde o parâmetro pode ser usado

  + O tipo de dado ou unidade de medida do parâmetro
  + Onde aplicável, os valores default, mínimo e máximo do parâmetro

  + Informações de versão e build do NDB Cluster

  Por padrão, esta saída está em formato de texto. Uma parte desta saída é mostrada aqui:

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

  Use esta opção juntamente com a opção [`--xml`](mysql-cluster-programs-ndb-config.html#option_ndb_config_xml) para obter a saída no formato XML.

* `--config-file=path-to-file`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Fornece o path para o arquivo de configuração do Management Server (`config.ini`). Este pode ser um path relativo ou absoluto. Se o Management Node residir em um host diferente daquele onde [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") é invocado, um path absoluto deve ser usado.

* `--config_from_node=#`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>48</code></td> </tr></tbody></table>

  Obtém os dados de configuração do Cluster a partir do Data Node que possui este ID.

  Se o Node que possui este ID não for um Data Node, [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") falhará com um erro. (Para obter dados de configuração do Management Node, simplesmente omita esta opção.)

* `--connections`

  <table frame="box" rules="all" summary="Propriedades para connections"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connections</code></td> </tr></tbody></table>

  Instrui [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") a imprimir apenas informações de `CONNECTIONS` — isto é, informações sobre parâmetros encontrados nas seções `[tcp]`, `[tcp default]`, `[shm]` ou `[shm default]` do arquivo de configuração do Cluster (consulte [Seção 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections"), e [Seção 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), para mais informações).

  Esta opção é mutuamente exclusiva com [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes) e [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system); apenas uma dessas 3 opções pode ser usada.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a Connection antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o Management Server.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve arquivo core em caso de erro; usado em debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê opções default somente do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--diff-default`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime apenas os parâmetros de configuração que possuem valores não default.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Especifica uma string *`delimiter`* usada para separar os fields no resultado. O default é `,` (o caractere vírgula).

  Note

  Se o *`delimiter`* contiver espaços ou escapes (como `\n` para o caractere de quebra de linha), ele deve ser citado.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--host=hostname`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Especifica o nome do host do Node para o qual as informações de configuração devem ser obtidas.

  Note

  Embora o hostname `localhost` geralmente se resolva para o endereço IP `127.0.0.1`, isso pode não ser necessariamente verdade para todas as plataformas e configurações operacionais. Isso significa que é possível, quando `localhost` é usado em `config.ini`, que [**ndb_config `--host=localhost`**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") falhe se [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") for executado em um host diferente onde `localhost` se resolve para um endereço diferente (por exemplo, em algumas versões do SUSE Linux, este é `127.0.0.2`). Em geral, para melhores resultados, você deve usar endereços IP numéricos para todos os valores de configuração do NDB Cluster relacionados a hosts, ou verificar se todos os hosts do NDB Cluster lidam com `localhost` da mesma maneira.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o path fornecido a partir do arquivo de login.

* `--mycnf`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê dados de configuração do arquivo `my.cnf`.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Especifica a Connection string a ser usada para conectar-se ao Management Server. O formato para a Connection string é o mesmo descrito em [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), e o default é `localhost:1186`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Define o Node ID para este Node, substituindo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Habilita otimizações para a seleção de Nodes para Transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Não lê opções default de nenhum arquivo de opção além do arquivo de login.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Especifica o Node ID do Node para o qual as informações de configuração devem ser obtidas. Anteriormente, `--id` podia ser usado como sinônimo para esta opção; no NDB 7.5 e posterior, a única forma aceita é `--nodeid`.

* `--nodes`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Instrui [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") a imprimir informações relacionadas apenas a parâmetros definidos em uma seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração do Cluster (consulte [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes")).

  Esta opção é mutuamente exclusiva com [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections) e [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system); apenas uma dessas 3 opções pode ser usada.

* `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Esta é uma lista delimitada por vírgulas de Query options—isto é, uma lista de um ou mais attributes de Node a serem retornados. Estes incluem `nodeid` (ID do Node), type (tipo de Node — isto é, `ndbd`, `mysqld` ou `ndb_mgmd`), e quaisquer parâmetros de configuração cujos valores devem ser obtidos.

  Por exemplo, `--query=nodeid,type,datamemory,datadir` retorna o ID de Node, o tipo de Node, [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) para cada Node.

  Anteriormente, `id` era aceito como sinônimo de `nodeid`, mas foi removido no NDB 7.5 e posterior.

  Note

  Se um determinado parâmetro não for aplicável a um certo tipo de Node, uma string vazia é retornada para o valor correspondente. Veja os exemplos mais adiante nesta seção para mais informações.

* `--query-all`, `-a`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Retorna uma lista delimitada por vírgulas de todas as Query options (attributes de Node; observe que esta lista é uma única string.

  Esta opção foi introduzida no NDB 7.5.7 (Bug #60095, Bug #11766869).

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Especifica uma string *`separator`* usada para separar as rows no resultado. O default é um caractere de espaço.

  Note

  Se o *`separator`* contiver espaços ou escapes (como `\n` para o caractere de quebra de linha), ele deve ser citado.

* `--system`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Default</th> <td><code></code></td> </tr></tbody></table>

  Instrui [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") a imprimir apenas informações de `SYSTEM`. Isso consiste em System variables que não podem ser alteradas em run time; portanto, não há uma seção correspondente do arquivo de configuração do Cluster para elas. Elas podem ser vistas (prefixadas com `****** SYSTEM ******`) na saída de [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo).

  Esta opção é mutuamente exclusiva com [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes) e [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections); apenas uma dessas 3 opções pode ser usada.

* `--type=node_type`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>48</code></td> </tr></tbody></table>

  Filtra resultados para que apenas os valores de configuração aplicáveis a Nodes do *`node_type`* especificado (`ndbd`, `mysqld` ou `ndb_mgmd`) sejam retornados.

* `--usage`, `--help`, ou `-?`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>48</code></td> </tr></tbody></table>

  Faz com que [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") imprima uma lista de opções disponíveis e, em seguida, saia. Sinônimo de [`--help`](mysql-cluster-programs-ndb-config.html#option_ndb_config_help).

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>48</code></td> </tr></tbody></table>

  Faz com que [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") imprima uma string de informações de versão e, em seguida, saia.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Propriedades para config_from_node"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>48</code></td> </tr></tbody></table>

  Faz com que [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo) forneça a saída como XML adicionando esta opção. Uma parte dessa saída é mostrada neste exemplo:

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

  Note

  Normalmente, a saída XML produzida por [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") `--configinfo` `--xml` é formatada usando uma linha por elemento; adicionamos espaços em branco extras no exemplo anterior, bem como no próximo, por razões de legibilidade. Isso não deve fazer nenhuma diferença para os aplicativos que usam essa saída, pois a maioria dos processadores XML ignora espaços em branco não essenciais como regra, ou pode ser instruída a fazê-lo.

  A saída XML também indica quando a alteração de um determinado parâmetro requer que os Data Nodes sejam reiniciados usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial). Isso é mostrado pela presença de um attribute `initial="true"` no elemento `<param>` correspondente. Além disso, o tipo de restart (`system` ou `node`) também é mostrado; se um determinado parâmetro exigir um restart de sistema, isso é indicado pela presença de um attribute `restart="system"` no elemento `<param>` correspondente. Por exemplo, a alteração do valor definido para o parâmetro [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless) requer um restart inicial do sistema, conforme mostrado aqui (com os attributes `restart` e `initial` destacados para visibilidade):

  ```sql
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Atualmente, nenhum attribute `initial` é incluído na saída XML para elementos `<param>` correspondentes a parâmetros que não requerem restarts iniciais; em outras palavras, `initial="false"` é o default, e o valor `false` deve ser assumido se o attribute não estiver presente. Da mesma forma, o tipo de restart default é `node` (ou seja, um restart online ou "rolling" do Cluster), mas o attribute `restart` é incluído apenas se o tipo de restart for `system` (o que significa que todos os Nodes do Cluster devem ser desligados ao mesmo tempo e depois reiniciados).

  Parâmetros descontinuados (Deprecated) são indicados na saída XML pelo attribute `deprecated`, conforme mostrado aqui:

  ```sql
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  Nesses casos, o `comment` refere-se a um ou mais parâmetros que substituem o parâmetro descontinuado. Semelhante a `initial`, o attribute `deprecated` é indicado apenas quando o parâmetro está descontinuado, com `deprecated="true"`, e não aparece de forma alguma para parâmetros que não estão descontinuados. (Bug #21127135)

  A partir do NDB 7.5.0, os parâmetros que são obrigatórios são indicados com `mandatory="true"`, conforme mostrado aqui:

  ```sql
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  Da mesma forma que o attribute `initial` ou `deprecated` é exibido apenas para um parâmetro que requer um restart inicial ou que está descontinuado, o attribute `mandatory` é incluído apenas se o parâmetro fornecido for realmente obrigatório.

  Important

  A opção `--xml` pode ser usada apenas com a opção `--configinfo`. Usar `--xml` sem `--configinfo` resulta em um erro.

  Ao contrário das opções usadas com este programa para obter dados de configuração atuais, `--configinfo` e `--xml` usam informações obtidas das fontes do NDB Cluster quando [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") foi compilado. Por esse motivo, não é necessária Connection a um NDB Cluster em execução ou acesso a um arquivo `config.ini` ou `my.cnf` para essas duas opções.

A combinação de outras opções [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") (como [`--query`](mysql-cluster-programs-ndb-config.html#option_ndb_config_query) ou [`--type`](mysql-cluster-programs-ndb-config.html#option_ndb_config_type)) com `--configinfo` (com ou sem a opção `--xml`) não é suportada. Atualmente, se você tentar fazer isso, o resultado usual é que todas as outras opções, além de `--configinfo` ou `--xml`, são simplesmente ignoradas. *No entanto, este comportamento não é garantido e está sujeito a alterações a qualquer momento*. Além disso, como [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information"), quando usado com a opção `--configinfo`, não acessa o NDB Cluster nem lê arquivos, tentar especificar opções adicionais como `--ndb-connectstring` ou `--config-file` com `--configinfo` não tem propósito.

#### Exemplos

1. Para obter o ID de Node e o tipo de cada Node no Cluster:

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

   Neste exemplo, usamos as opções [`--fields`](mysql-cluster-programs-ndb-config.html#option_ndb_config_fields) para separar o ID e o tipo de cada Node com um caractere de dois pontos (`:`), e as opções [`--rows`](mysql-cluster-programs-ndb-config.html#option_ndb_config_rows) para colocar os valores de cada Node em uma nova linha na saída.

2. Para produzir uma Connection string que pode ser usada por Data Nodes, SQL Nodes e API Nodes para conectar-se ao Management Server:

   ```sql
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. Esta invocação do [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") verifica apenas Data Nodes (usando a opção [`--type`](mysql-cluster-programs-ndb-config.html#option_ndb_config_type)) e mostra os valores para o ID e nome do host de cada Node, bem como os valores definidos para seus parâmetros [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir):

   ```sql
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   Neste exemplo, usamos as opções curtas `-f` e `-r` para definir o Field delimiter e o Row separator, respectivamente, bem como a opção curta `-q` para passar uma lista de parâmetros a serem obtidos.

4. Para excluir resultados de qualquer host, exceto um em particular, use a opção [`--host`](mysql-cluster-programs-ndb-config.html#option_ndb_config_host):

   ```sql
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   Neste exemplo, também usamos a forma curta `-q` para determinar os attributes a serem consultados.

   Da mesma forma, você pode limitar os resultados a um Node com um ID específico usando a opção [`--nodeid`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodeid).