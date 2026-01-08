### 21.5.25 ndb\_select\_all — Imprimir linhas de uma tabela NDB

**ndb\_select\_all** imprime todas as linhas de uma tabela \`**NDB** para a saída padrão.

#### Uso

```sql
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

As opções que podem ser usadas com **ndb\_select\_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.41 Opções de linha de comando usadas com o programa ndb\_select\_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">--descending</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">-z</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk">--disk</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci">--gci</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci64">--gci64</a> </code>] </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">--header[=valu<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code></a></code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code>]] </p></th> <td>Definir delimitador de coluna</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">--descending</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">-z</a> </code>]] </p></th> <td>Classifique o conjunto de resultados em ordem decrescente (requer --order)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk">--disk</a> </code>]] </p></th> <td>Imprimir referências de disco (úteis apenas para tabelas de Dados de disco que possuem colunas não indexadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci">--gci</a> </code>]] </p></th> <td>Incluir o GCI no resultado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci64">--gci64</a> </code>]] </p></th> <td>Incluir GCI e época da linha no resultado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">--header[=valu<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code></a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code>]] </p></th> <td>Imprimir cabeçalho (defina em 0|FALSO para desabilitar cabeçalhos na saída)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Tipo de trava</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">--descending</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">-z</a> </code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk">--disk</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci">--gci</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci64">--gci64</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">--header[=valu<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code></a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code>] </p></th> <td>Não imprima os dados das colunas da tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">--descending</a></code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">-z</a> </code>] </p></th> <td>Classifique o conjunto de resultados de acordo com o índice com este nome</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk">--disk</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci">--gci</a> </code>] </p></th> <td>Grau de paralelismo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci64">--gci64</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">--header[=valu<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code></a></code>] </p></th> <td>Imprimir ID da linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header">-h</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Escanear em ordem inversa</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">--descending</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending">-z</a> </code>] </p></th> <td>Números de saída no formato hexadecimal</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk">--disk</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci">--gci</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database=dbname`, `-d` *dbname*

  Nome do banco de dados em que a tabela está localizada. O valor padrão é `TEST_DB`.

- `--descending`, `-z`

  Ordena a saída em ordem decrescente. Esta opção só pode ser usada em conjunto com a opção `-o` (`--order`).

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--delimiter=character`, `-D character`

  Faz com que o caractere *`character`* seja usado como delimitador de coluna. Apenas as colunas de dados da tabela são separadas por este delimitador.

  O delimitador padrão é o caractere de tabulação.

- `--disk`

  Adiciona uma coluna de referência de disco ao resultado. A coluna só é preenchida para tabelas de Dados de disco que possuem colunas não indexadas.

- `--gci`

  Adicione uma coluna `GCI` ao resultado, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez. Consulte Seção 21.2, “Visão geral do cluster NDB” e Seção 21.6.3.2, “Eventos de log do cluster NDB” para obter mais informações sobre os pontos de verificação.

- `--gci64`

  Adicione uma coluna `ROW$GCI64` ao resultado, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez, bem como o número da época em que essa atualização ocorreu.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--lock=lock_type`, `-l lock_type`

  Usa uma trava ao ler a tabela. Os valores possíveis para *`lock_type`* são:

  - `0`: Bloqueio de leitura
  - `1`: Bloqueio de leitura com retenção
  - `2`: Bloqueio de leitura exclusivo

  Não há um valor padrão para esta opção.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Leia o caminho fornecido a partir do arquivo de login.

- `--header=FALSE`

  Exclui os cabeçalhos das colunas da saída.

- `--nodata`

  Faz com que os dados da tabela sejam omitidos.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--order=nome_do_índice`, `-o nome_do_índice`

  Ordene a saída de acordo com o índice denominado *`index_name`*.

  Nota

  Esse é o nome de um índice, não de uma coluna; o índice deve ter sido explicitamente nomeado quando criado.

- `paralelismo=#`, `-p` *`#`*

  Especifica o grau de paralelismo.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Imprima a lista de argumentos do programa e saia.

- `--rowid`

  Adiciona uma coluna `ROWID` que fornece informações sobre os fragmentos nos quais as linhas são armazenadas.

- `--tupscan`, `-t`

  Escanear a tabela na ordem dos tuplos.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--useHexFormat` `-x`

  Torna todos os valores numéricos exibidos no formato hexadecimal. Isso não afeta a saída de numerais contidos em strings ou valores de data e hora.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Exibir informações da versão e sair.

#### Saída de amostra

Saída de uma instrução `SELECT` do MySQL:

```sql
mysql> SELECT * FROM ctest1.fish;
+----+-----------+
| id | name      |
+----+-----------+
|  3 | shark     |
|  6 | puffer    |
|  2 | tuna      |
|  4 | manta ray |
|  5 | grouper   |
|  1 | guppy     |
+----+-----------+
6 rows in set (0.04 sec)
```

Saída da invocação equivalente de **ndb\_select\_all**:

```sql
$> ./ndb_select_all -c localhost fish -d ctest1
id      name
3       [shark]
6       [puffer]
2       [tuna]
4       [manta ray]
5       [grouper]
1       [guppy]
6 rows returned

NDBT_ProgramExit: 0 - OK
```

Todos os valores de string são fechados entre colchetes (`[`...`]`) na saída de **ndb\_select\_all**. Para outro exemplo, considere a tabela criada e preenchida conforme mostrado aqui:

```sql
CREATE TABLE dogs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    PRIMARY KEY pk (id),
    KEY ix (name)
)
TABLESPACE ts STORAGE DISK
ENGINE=NDBCLUSTER;

INSERT INTO dogs VALUES
    ('', 'Lassie', 'collie'),
    ('', 'Scooby-Doo', 'Great Dane'),
    ('', 'Rin-Tin-Tin', 'Alsatian'),
    ('', 'Rosscoe', 'Mutt');
```

Isso demonstra o uso de várias opções adicionais do **ndb\_select\_all**:

```sql
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned

NDBT_ProgramExit: 0 - OK
```
