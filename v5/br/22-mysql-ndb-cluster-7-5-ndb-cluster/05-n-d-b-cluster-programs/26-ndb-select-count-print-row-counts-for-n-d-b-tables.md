### 21.5.26 ndb_select_count — Imprime Contagem de Linhas para Tabelas NDB

[**ndb_select_count**](mysql-cluster-programs-ndb-select-count.html "21.5.26 ndb_select_count — Imprime Contagem de Linhas para Tabelas NDB") imprime o número de linhas em uma ou mais tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Com uma única tabela, o resultado é equivalente ao obtido usando a instrução MySQL `SELECT COUNT(*) FROM tbl_name`.

#### Uso

```sql
ndb_select_count [-c connection_string] -ddb_name tbl_name[, tbl_name2[, ...
```

As opções que podem ser usadas com [**ndb_select_count**](mysql-cluster-programs-ndb-select-count.html "21.5.26 ndb_select_count — Imprime Contagem de Linhas para Tabelas NDB") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.42 Opções de linha de comando usadas com o programa ndb_select_count**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres (character sets)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a conexão antes de desistir</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Grava core file em caso de erro; usado em depuração</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Nome do Database onde a tabela é encontrada</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções padrão somente do arquivo fornecido</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lock=#</code>, </p><p> <code>-l #</code> </p></th> <td>Tipo de Lock</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do arquivo de login</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a string de conexão para conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID de node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transações. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum arquivo de opções além do arquivo de login</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code>-p #</code> </p></th> <td>Grau de paralelismo</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres (character sets).

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Grava core file em caso de erro; usado em depuração.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê opções padrão somente do arquivo fornecido.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do arquivo de login.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a string de conexão para conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transações. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID de node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum arquivo de opções além do arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

Você pode obter a contagem de linhas de múltiplas tabelas no mesmo Database listando os nomes das tabelas separados por espaços ao invocar este comando, conforme mostrado em **Saída de Exemplo**.

#### Saída de Exemplo

```sql
$> ./ndb_select_count -c localhost -d ctest1 fish dogs
6 records in table fish
4 records in table dogs

NDBT_ProgramExit: 0 - OK
```
