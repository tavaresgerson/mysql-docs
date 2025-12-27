### 25.5.7 ndb\_config — Extrair Informações de Configuração do NDB Cluster

Essa ferramenta extrai informações atuais de configuração para nós de dados, nós SQL e nós API de uma das várias fontes: um nó de gerenciamento do NDB Cluster ou seu arquivo `config.ini` ou `my.cnf`. Por padrão, o nó de gerenciamento é a fonte dos dados de configuração; para sobrescrever o padrão, execute ndb\_config com a opção `--config-file` ou `--mycnf`. Também é possível usar um nó de dados como fonte, especificando seu ID de nó com `--config_from_node=node_id`.

**ndb\_config** também pode fornecer um dump offline de todos os parâmetros de configuração que podem ser usados, juntamente com seus valores padrão, máximos e mínimos e outras informações. O dump pode ser produzido no formato de texto ou XML; para mais informações, consulte a discussão das opções `--configinfo` e `--xml` mais adiante nesta seção).

Você pode filtrar os resultados por seção (`DB`, `SYSTEM` ou `CONNECTIONS`) usando uma das opções `--nodes`, `--system` ou `--connections`.

Todas as opções que podem ser usadas com **ndb\_config** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `cluster-config-suffix`

<table frame="box" rules="all" summary="Propriedades para cluster-config-suffix">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--cluster-config-suffix=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>

  Supere os sufixos de configuração padrão ao ler seções de configuração de cluster em `my.cnf`; usado em testes.

* `--configinfo`

  A opção `--configinfo` faz com que o **ndb_config** exiba uma lista de cada parâmetro de configuração do NDB Cluster suportado pela distribuição do NDB Cluster, da qual o **ndb_config** faz parte, incluindo as seguintes informações:

  + Uma breve descrição do propósito, efeitos e uso de cada parâmetro

  + A seção do arquivo `config.ini` onde o parâmetro pode ser usado

  + O tipo de dados ou unidade de medida do parâmetro
  + Se aplicável, os valores padrão, mínimo e máximo do parâmetro

  + A versão e as informações de compilação do lançamento do NDB Cluster

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

  Use essa opção junto com a opção `--xml` para obter a saída em formato XML.

* `--config-binary-file=caminho-para-arquivo`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal"></code></td>
    </tr>
  </tbody>
  </table>

Fornece o caminho para o arquivo de configuração binário cache do servidor de gerenciamento (`ndb_nodeID_config.bin.seqno`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb\_config** usados estiverem em hosts diferentes, você deve usar um caminho absoluto.

Este exemplo demonstra a combinação de `--config-binary-file` com outras opções de **ndb\_config** para obter uma saída útil:

```
  $> ndb_config --config-binary-file=../mysql-cluster/ndb_50_config.bin.1 --diff-default --type=ndbd
  config of [DB] node id 5 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,5,(mandatory)
  BackupDataDir,/local/data/9.5,(null)
  DataDir,/local/data/9.5,.
  DataMemory,2G,98M
  FileSystemPath,/local/data/9.5,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  config of [DB] node id 6 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,6,(mandatory)
  BackupDataDir,/local/data/9.5,(null)
  DataDir,/local/data/9.5.
  DataMemory,2G,98M
  FileSystemPath,/local/data/9.5,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  $> ndb_config --config-binary-file=../mysql-cluster/ndb_50_config.bin.1 --diff-default --system
  config of [SYSTEM] system
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  Name,MC_20220906060042,(mandatory)
  ConfigGenerationNumber,1,0
  PrimaryMGMNode,50,0
  ```

As partes relevantes do arquivo `config.ini` são mostradas aqui:

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
  DataDir= /local/data/9.5

  [ndbd]
  NodeId= 6
  HostName= 127.0.0.1
  DataDir= /local/data/9.5
  ```

Ao comparar a saída com o arquivo de configuração, você pode ver que todas as configurações no arquivo foram escritas pelo servidor de gerenciamento na cache binária e, assim, aplicadas ao clúster.

* `--config-file=caminho-para-arquivo`

<table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--config-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>

Fornece o caminho para o arquivo de configuração do clúster (`config.ini`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb\_config** usados estiverem em hosts diferentes, você deve usar um caminho absoluto.

* `--config_from_node=#`

Obtenha os dados de configuração do cluster a partir do nó de dados que possui este ID.

Se o nó que possui este ID não for um nó de dados, o **ndb_config** falha com um erro. (Para obter os dados de configuração do nó de gerenciamento, simplesmente omita esta opção.)

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
</table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

<table frame="box" rules="all" summary="Propriedades para connect-string">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
</table>

O mesmo que `--ndb-connectstring`.

* `--connections`

<table frame="box" rules="all" summary="Propriedades para connections">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections</code></td> </tr>
</table>

Diz ao **ndb_config** para imprimir apenas as informações de `CONNECTIONS`—ou seja, informações sobre os parâmetros encontrados nas seções `[tcp]`, `[tcp default]`, `[shm]` ou `[shm default]` do arquivo de configuração do cluster (consulte a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”, e a Seção 25.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, para obter mais informações).

Esta opção é mutuamente exclusiva com `--nodes` e `--system`; apenas uma dessas 3 opções pode ser usada.

* `--core-file`

<table frame="box" rules="all" summary="Propriedades para o arquivo de configuração do núcleo">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr>
</table>

  Escrever o arquivo de núcleo em caso de erro; usado em depuração.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para o sufixo de configuração do cluster">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>0

  Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para o sufixo de configuração do cluster">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>1

  Ler as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para o sufixo de configuração do cluster">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>2

  Ler também os grupos com concatenação de grupo e sufixo.

* `--diff-default`

<table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>3

  Imprima apenas os parâmetros de configuração que têm valores não padrão.

* `--fields=separador`, `-f` *`separador`*

  <table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>4

  Especifica uma string *`separador`* usada para separar os campos no resultado. O padrão é `,` (o caractere vírgula).

  Nota

  Se o *`separador`* contiver espaços ou escapamentos (como `\n` para o caractere de retorno de linha), ele deve ser citado.

* `--ajuda`

  <table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>5

  Exibir texto de ajuda e sair.

* `--host=hostname`

<table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>6

  Especifica o nome do host do nó para o qual as informações de configuração devem ser obtidas.

  Nota

  Embora o nome de host `localhost` geralmente resolva para o endereço IP `127.0.0.1`, isso nem sempre é verdade para todas as plataformas e configurações operacionais. Isso significa que, quando `localhost` é usado em `config.ini`, **ndb_config `--host=localhost`** pode falhar se **ndb_config** for executado em um host diferente onde `localhost` resolve para um endereço diferente (por exemplo, em algumas versões do SUSE Linux, isso é `127.0.0.2`). Em geral, para obter os melhores resultados, você deve usar endereços IP numéricos para todos os valores de configuração do NDB Cluster relacionados a hosts, ou verificar se todos os hosts do NDB Cluster tratam `localhost` da mesma maneira.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>7

  Leia o caminho dado do arquivo de login.

* `--mycnf`

<table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></table>8

Leia os dados de configuração do arquivo `my.cnf`.

* `--ndb-connectstring=string_de_conexão`, `-c string_de_conexão`

<table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><tr><th>Formato de linha de comando</th> <td><code class="literal">--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></table>9

Especifica a string de conexão a ser usada para se conectar ao servidor de gerenciamento. O formato da string de conexão é o mesmo descrito na Seção 25.4.3.3, “Strings de conexão de cluster NDB”, e tem como padrão `localhost:1186`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para config-binary-file"><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></table>0

Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que o TLS é necessário para se conectar.

* `--ndb-mgmd-host`

<table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>1

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>2

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>3

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

<table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>4

  Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>6

  Ignora a leitura de opções do arquivo de caminho de login.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>7

  Especifique o ID do nó do nó para o qual as informações de configuração devem ser obtidas.

* `--nodes`

  <table frame="box" rules="all" summary="Propriedades para config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>8

  Diz ao **ndb_config** para imprimir informações relacionadas apenas aos parâmetros definidos em uma seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração do cluster (veja a Seção 25.4.3.6, “Definindo NDB Cluster Data Nodes”).

  Esta opção é mutuamente exclusiva com `--connections` e `--system`; apenas uma dessas 3 opções pode ser usada.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para config-binary-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--config-binary-file=caminho/para/arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal"></code></td>
  </tr>
</table>9

  Imprimir a lista de argumentos do programa e sair.

* `--query=opções-de-consulta`, `-q` *`opções-de-consulta`*

  <table frame="box" rules="all" summary="Propriedades para config-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--config-file=nome_do_arquivo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal"></code></td>
    </tr>
  </table>0

  Esta é uma lista de opções de consulta delimitada por vírgula—ou seja, uma lista de um ou mais atributos de nó a serem retornados. Estes incluem `nodeid` (ID do nó), tipo (tipo de nó—ou seja, `ndbd`, `mysqld` ou `ndb_mgmd`) e quaisquer parâmetros de configuração cujos valores devem ser obtidos.

  Por exemplo, `--query=nodeid,type,datamemory,datadir` retorna o ID do nó, tipo de nó, `DataMemory` e `DataDir` para cada nó.

  Nota

  Se um determinado parâmetro não for aplicável a um determinado tipo de nó, uma string vazia é retornada para o valor correspondente. Veja os exemplos mais adiante nesta seção para mais informações.

* `--query-all`, `-a`

<table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>1

  Retorna uma lista separada por vírgula de todas as opções de consulta (atributos do nó; observe que essa lista é uma única string.

* `--rows=separador`, `-r` *`separador`*

  <table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>2

  Especifica uma string *`separador`* usada para separar as linhas no resultado. O padrão é um caractere de espaço.

  Nota

  Se o *`separador`* contiver espaços ou escapamentos (como `\n` para o caractere de retorno de linha), ele deve ser citado.

* `--system`

  <table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>3

Diz ao **ndb\_config** para imprimir apenas as informações do `SISTEMA`. Isso consiste em variáveis do sistema que não podem ser alteradas no tempo de execução; portanto, não há uma seção correspondente do arquivo de configuração do cluster para elas. Elas podem ser vistas (prefixadas com `****** SISTEMA ******`) na saída do **ndb\_config** `--configinfo`.

Esta opção é mutuamente exclusiva com `--nodes` e `--connections`; apenas uma dessas 3 opções pode ser usada.

* `--type=node_type`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de configuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>4

  Filtra os resultados para que apenas os valores de configuração que se aplicam a nós do *`node_type`* especificado (`ndbd`, `mysqld` ou `ndb_mgmd`) sejam retornados.

* `--usage`, `--help` ou `-?`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de configuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>5

  Faz com que o **ndb\_config** imprima uma lista de opções disponíveis e, em seguida, saia.

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>6

  Faz com que **ndb\_config** imprima uma string de informações de versão e, em seguida, saia.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Propriedades para config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>7

  Faz com que **ndb\_config** `--configinfo` forneça a saída como XML adicionando esta opção. Uma parte dessa saída é mostrada neste exemplo:

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

  Normalmente, a saída XML produzida por **ndb\_config** `--configinfo` `--xml` é formatada usando uma linha por elemento; adicionamos espaços extras no exemplo anterior, bem como no seguinte, por razões de legibilidade. Isso não deve fazer diferença para as aplicações que usam essa saída, uma vez que a maioria dos processadores de XML ignora o espaço em branco não essencial como uma questão de cortesia, ou pode ser instruído a fazer isso.

A saída XML também indica quando a alteração de um parâmetro específico requer que os nós de dados sejam reiniciados usando a opção `--initial`. Isso é mostrado pela presença de um atributo `initial="true"` no elemento `<param>` correspondente. Além disso, o tipo de reinício (`system` ou `node`) também é mostrado; se um parâmetro específico requer um reinício do sistema, isso é indicado pela presença de um atributo `restart="system"` no elemento `<param>` correspondente. Por exemplo, alterar o valor definido para o parâmetro `Diskless` requer um reinício inicial do sistema, como mostrado aqui (com os atributos `restart` e `initial` destacados para visibilidade):

  ```
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Atualmente, nenhum atributo `initial` é incluído na saída XML para elementos `<param>` correspondentes a parâmetros que não requerem reinícios iniciais; em outras palavras, `initial="false"` é o padrão, e o valor `false` deve ser assumido se o atributo não estiver presente. Da mesma forma, o tipo de reinício padrão é `node` (ou seja, um reinício online ou "rolling" do clúster), mas o atributo `restart` é incluído apenas se o tipo de reinício for `system` (o que significa que todos os nós do clúster devem ser desligados ao mesmo tempo, depois reiniciados).

  Os parâmetros obsoletos são indicados na saída XML pelo atributo `deprecated`, como mostrado aqui:

  ```
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  Nesses casos, o `comment` refere-se a um ou mais parâmetros que substituem o parâmetro obsoleto. Da mesma forma que `initial`, o atributo `deprecated` é indicado apenas quando o parâmetro é obsoleto, com `deprecated="true"`, e não aparece em absoluto para parâmetros que não são obsoletos. (Bug #21127135)

  Os parâmetros que são obrigatórios são indicados com `mandatory="true"`, como mostrado aqui:

  ```
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

Da mesma forma que o atributo `initial` ou `deprecated` é exibido apenas para um parâmetro que requer um reinício inicial ou que é desatualizado, o atributo `mandatory` é incluído apenas se o parâmetro fornecido for realmente necessário.

Importante

A opção `--xml` só pode ser usada com a opção `--configinfo`. Usar `--xml` sem `--configinfo` falha com um erro.

Ao contrário das opções usadas com este programa para obter dados de configuração atuais, `--configinfo` e `--xml` usam informações obtidas das fontes do NDB Cluster quando o **ndb\_config** foi compilado. Por essa razão, não é necessária uma conexão com um NDB Cluster em execução ou acesso a um arquivo `config.ini` ou `my.cnf` para essas duas opções.

Combinar outras opções de **ndb\_config** (como `--query` ou `--type`) com `--configinfo` (com ou sem a opção `--xml` não é suportada. Atualmente, se você tentar fazer isso, o resultado usual é que todas as outras opções além de `--configinfo` ou `--xml` são simplesmente ignoradas. *No entanto, esse comportamento não é garantido e está sujeito a mudanças a qualquer momento*. Além disso, como o **ndb\_config**, quando usado com a opção `--configinfo`, não acessa o NDB Cluster ou não lê nenhum arquivo, tentar especificar opções adicionais como `--ndb-connectstring` ou `--config-file` com `--configinfo` não serve para nada.

#### Exemplos

1. Para obter o ID de nó e o tipo de cada nó no cluster:

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

   Neste exemplo, usamos as opções `--fields` para separar o ID e o tipo de cada nó com um caractere de colon (`:`), e as opções `--rows` para colocar os valores para cada nó em uma nova linha na saída.

2. Para produzir uma string de conexão que pode ser usada por nós de dados, SQL e API para se conectar ao servidor de gerenciamento:

   ```
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. Esta invocação de **ndb\_config** verifica apenas os nós de dados (usando a opção `--type`), e mostra os valores para o ID e o nome do host de cada nó, bem como os valores definidos para os parâmetros `DataMemory` e `DataDir` dele:

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

   Neste exemplo, também usamos a forma curta `-q` para determinar os atributos a serem consultados.

   Da mesma forma, você pode limitar os resultados a um nó com um ID específico usando a opção `--nodeid`.