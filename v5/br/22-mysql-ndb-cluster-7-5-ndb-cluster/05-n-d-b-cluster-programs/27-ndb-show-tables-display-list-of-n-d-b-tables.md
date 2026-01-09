### 21.5.27 ndb\_show\_tables — Exibir a lista de tabelas NDB

**ndb\_show\_tables** exibe uma lista de todos os objetos de banco de dados `**NDB** no cluster. Por padrão, isso inclui não apenas as tabelas criadas pelo usuário e as tabelas do sistema `**NDB**, mas também índices específicos do `**NDB**`, gatilhos internos e objetos de dados do disco do NDB Cluster.

As opções que podem ser usadas com **ndb\_show\_tables** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.43 Opções de linha de comando usadas com o programa ndb\_show\_tables**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">--loops=#</a></code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">--help</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">-?</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">--ndb-connectstring=connection_string</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Especifica o banco de dados em que a tabela está localizada; o nome do banco de dados deve ser seguido pelo nome da tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">--loops=#</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code>]] </p></th> <td>Número de vezes para repetir a saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">--help</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">--ndb-connectstring=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">--loops=#</a></code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">--help</a></code>] </p></th> <td>Retorno de saída adequado para a instrução MySQL LOAD DATA</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">-?</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>Mostrar a bandeira temporária da tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Limite a saída para objetos deste tipo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Não qualifique os nomes das tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">--loops=#</a></code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">--help</a></code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

#### Uso

```sql
ndb_show_tables [-c connection_string]
```

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database`, `-d`

  Especifica o nome do banco de dados em que a tabela desejada está localizada. Se esta opção for fornecida, o nome de uma tabela deve seguir o nome do banco de dados.

  Se essa opção não tiver sido especificada e não forem encontradas tabelas no banco de dados `TEST_DB`, o **ndb\_show\_tables** emite uma mensagem de aviso.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Leia o caminho fornecido a partir do arquivo de login.

- `--loops`, `-l`

  Especifica o número de vezes que a utilidade deve ser executada. Isso é 1 quando esta opção não é especificada, mas se você usar a opção, você deve fornecer um argumento inteiro para ela.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--parsable`, `-p`

  Usar essa opção faz com que a saída seja em um formato adequado para uso com `LOAD DATA`.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Imprima a lista de argumentos do programa e saia.

- `--show-temp-status`

  Se especificado, isso faz com que as tabelas temporárias sejam exibidas.

- `--type`, `-t`

  Pode ser usado para restringir a saída a um tipo de objeto, especificado por um código de tipo inteiro, conforme mostrado aqui:

  - `1`: Tabela do sistema
  - `2`: Tabela criada pelo usuário
  - `3`: Índice de hash único

  Qualquer outro valor faz com que todos os objetos de banco de dados `NDB` sejam listados (o padrão).

- `--unqualified`, `-u`

  Se especificado, isso faz com que os nomes de objetos não qualificados sejam exibidos.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Exibir informações da versão e sair.

Nota

Somente as tabelas do NDB Cluster criadas pelo usuário podem ser acessadas a partir do MySQL; as tabelas do sistema, como `SYSTAB_0`, não são visíveis para o **mysqld**. No entanto, você pode examinar o conteúdo das tabelas do sistema usando aplicativos da API **ndb**, como **ndb\_select\_all** (veja Seção 21.5.25, “ndb\_select\_all — Imprimir linhas de uma tabela NDB”).

Antes das versões 7.5.18 e 7.6.14 do NDB, este programa imprimia `NDBT_ProgramExit - status` após o término de sua execução, devido a uma dependência desnecessária da biblioteca de testes `NDBT`. Essa dependência foi removida, eliminando a saída desnecessária.
