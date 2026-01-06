### 21.5.5 ndb\_mgm — O cliente de gerenciamento de cluster NDB

O processo do cliente de gerenciamento **ndb\_mgm** não é realmente necessário para executar o clúster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do clúster, iniciar backups e realizar outras funções administrativas. O cliente de gerenciamento acessa o servidor de gerenciamento usando uma API C. Usuários avançados também podem usar essa API para programar processos de gerenciamento dedicados para realizar tarefas semelhantes às executadas por **ndb\_mgm**.

Para iniciar o cliente de gerenciamento, é necessário fornecer o nome do host e o número de porta do servidor de gerenciamento:

```sql
$> ndb_mgm [host_name [port_num]]
```

Por exemplo:

```sql
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O nome de host padrão e o número de porta são `localhost` e 1186, respectivamente.

As opções que podem ser usadas com **ndb\_mgm** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.25 Opções de linha de comando usadas com o programa ndb\_mgm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_login-path">--login-path=path</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">-c connection_string</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-nodeid">--ndb-nodeid=#</a> </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_no-defaults">--no-defaults</a> </code>] </p></th> <td>Execute o comando e saia</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">--ndb-connectstring=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">-c connection_string</a> </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">-c connection_string</a> </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-nodeid">--ndb-nodeid=#</a> </code>]] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code>]] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_no-defaults">--no-defaults</a> </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help">--help</a></code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_login-path">--login-path=path</a> </code>] </p></th> <td>Defina o número de vezes para tentar a conexão novamente antes de desistir; sinônimo de --connect-retries</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">--ndb-connectstring=connection_string</a></code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">-c connection_string</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries=#`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">3</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Esta opção especifica o número de vezes que a conexão será retente após a primeira tentativa de conexão antes de ser abandonada (o cliente sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando `--connect-retry-delay`.

  Esta opção é sinônima da opção `--try-reconnect`, que agora está desatualizada.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Propriedades para executar"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--execute=command</code>]]</td> </tr></tbody></table>

  Essa opção pode ser usada para enviar um comando ao cliente de gerenciamento do NDB Cluster a partir do shell do sistema. Por exemplo, qualquer uma das seguintes opções é equivalente à execução de `SHOW` no cliente de gerenciamento:

  ```sql
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  Isso é análogo ao modo como a opção `--execute` ou `-e` funciona com o cliente de linha de comando **mysql**. Veja Seção 4.2.2.1, “Usando Opções na Linha de Comando”.

  Nota

  Se o comando do cliente de gerenciamento a ser passado usando essa opção contiver caracteres de espaço, então o comando *deve* ser fechado entre aspas. Pode-se usar aspas simples ou duplas. Se o comando do cliente de gerenciamento não contiver caracteres de espaço, as aspas são opcionais.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: \[`nodeid=id;`]\[`host=`]`hostname`\[`:port`]. Substitui as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Imprima a lista de argumentos do programa e saia.

- `--try-reconnect=número`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Se a conexão com o servidor de gerenciamento for interrompida, o nó tenta reconectar-se a ele a cada 5 segundos até conseguir. Ao usar essa opção, é possível limitar o número de tentativas a *`número`* antes de desistir e relatar um erro.

  Esta opção está desatualizada e está sujeita à remoção em uma futura versão. Use `--connect-retries`, em vez disso.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">3</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

Informações adicionais sobre o uso do **ndb\_mgm** podem ser encontradas em Seção 21.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”.
