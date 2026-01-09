### 21.5.16 ndb\_move\_data — Ferramenta de cópia de dados do NDB

**ndb\_move\_data** copia dados de uma tabela NDB para outra.

#### Uso

O programa é invocado com os nomes das tabelas de origem e destino; um ou ambos podem ser qualificados opcionalmente com o nome do banco de dados. Ambas as tabelas devem usar o motor de armazenamento NDB.

```sql
ndb_move_data options source target
```

As opções que podem ser usadas com **ndb\_move\_data** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.35 Opções de linha de comando usadas com o programa ndb\_move\_data**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Descarregar o núcleo em erro permanente (opção de depuração)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Diretório onde os conjuntos de caracteres estão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_drop-source">--drop-source</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_error-insert">--error-insert</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_exclude-missing-columns">--exclude-missing-columns</a> </code>],</p><p> [[PH_HTML_CODE_<code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">--help</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">-?</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_login-path">--login-path=path</a> </code>],</p><p> [[PH_HTML_CODE_<code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">--lossy-conversions</a></code>] </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">-l</a> </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_character-sets-dir">--character-sets-dir=path</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_drop-source">--drop-source</a> </code>]] </p></th> <td>Deixe a tabela de origem após todas as linhas terem sido movidas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_error-insert">--error-insert</a> </code>]] </p></th> <td>Insira erros temporários aleatórios (usados em testes)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_exclude-missing-columns">--exclude-missing-columns</a> </code>]] </p></th> <td>Ignorar colunas extras na tabela de origem ou de destino</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">--help</a></code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">--lossy-conversions</a></code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">-l</a> </code>]] </p></th> <td>Permitir que os dados de atributo sejam truncados ao serem convertidos para um tipo menor</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_drop-source">--drop-source</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_error-insert">--error-insert</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_exclude-missing-columns">--exclude-missing-columns</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">--help</a></code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">-?</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_login-path">--login-path=path</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">--lossy-conversions</a></code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retries">--connect-retries=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_lossy-conversions">-l</a> </code>] </p></th> <td>Permitir que os dados de atributo sejam convertidos para um tipo maior</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Especifique tentativas para erros temporários; o formato é x[,y[,z]] onde x=max tentativas (0=sem limite), y=min atraso (ms), z=max atraso (ms)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_drop-source">--drop-source</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_error-insert">--error-insert</a> </code>] </p></th> <td>Ative as mensagens detalhadas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_exclude-missing-columns">--exclude-missing-columns</a> </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-retry-delay">--connect-retry-delay=#</a> </code><code><a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help">--help</a></code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--abort-on-error`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Descarregar o núcleo em erro permanente (opção de depuração).

- `--character-sets-dir`=*`nome`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Diretório onde os conjuntos de caracteres estão.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database`=*`dbname`*, `-d`

  <table frame="box" rules="all" summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--database=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>TEST_DB</code>]]</td> </tr></tbody></table>

  Nome do banco de dados em que a tabela está localizada.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--drop-source`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Deixe a tabela de origem após todas as linhas terem sido movidas.

- `--error-insert`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Insira erros temporários aleatórios (opção de teste).

- `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Ignorar colunas extras na tabela de origem ou destino.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--lossy-conversions`, `-l`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Permitir que os dados de atributo sejam truncados ao serem convertidos para um tipo menor.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--abort-on-error</code>]]</td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Permitir que os dados de atributo sejam convertidos para um tipo maior.

- `--staging-tries=*`x\[,y\[,z]]\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Especifique tentativas para erros temporários. O formato é x\[,y\[,z]] onde x=max tentativas (0=sem limite), y=min atraso (ms), z=max atraso (ms).

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Ative as mensagens detalhadas.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair.
