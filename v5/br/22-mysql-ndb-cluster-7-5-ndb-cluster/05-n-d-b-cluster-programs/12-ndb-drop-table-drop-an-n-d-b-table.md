### 21.5.12 ndb\_drop\_table — Remover uma tabela NDB

**ndb\_drop\_table** exclui a tabela especificada de `NDB`. (Se você tentar usar isso em uma tabela criada com um motor de armazenamento diferente de `NDB`, a tentativa falhará com o erro 723: A tabela não existe.) Essa operação é extremamente rápida; em alguns casos, pode ser uma ordem de magnitude mais rápida do que usar uma declaração `DROP TABLE` do MySQL em uma tabela de `NDB`.

#### Uso

```sql
ndb_drop_table -c connection_string tbl_name -d db_name
```

As opções que podem ser usadas com **ndb\_drop\_table** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.31 Opções de linha de comando usadas com o programa ndb\_drop\_table**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help">-?</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_login-path">--login-path=path</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">-c connection_string</a> </code>] </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-nodeid">--ndb-nodeid=#</a> </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">--ndb-connectstring=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">-c connection_string</a> </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-nodeid">--ndb-nodeid=#</a> </code>]] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code>]] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help">-?</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_login-path">--login-path=path</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">--ndb-connectstring=connection_string</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

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

- `--database`, `-d`

  <table frame="box" rules="all" summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--database=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>TEST_DB</code>]]</td> </tr></tbody></table>

  Nome do banco de dados em que a tabela reside.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Imprima a lista de argumentos do programa e saia.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Exibir informações da versão e sair.
