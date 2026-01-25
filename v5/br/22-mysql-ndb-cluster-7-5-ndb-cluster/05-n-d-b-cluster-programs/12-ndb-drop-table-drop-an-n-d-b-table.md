### 21.5.12 ndb_drop_table — Remove uma Tabela NDB

[**ndb_drop_table**](mysql-cluster-programs-ndb-drop-table.html "21.5.12 ndb_drop_table — Drop an NDB Table") remove a table [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") especificada. (Se você tentar usar isso em uma table criada com um storage engine diferente de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), a tentativa falhará com o erro 723: No such table exists.) Esta operação é extremamente rápida; em alguns casos, pode ser uma ordem de magnitude mais rápida do que usar uma instrução MySQL [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") em uma table [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

#### Uso

```sql
ndb_drop_table -c connection_string tbl_name -d db_name
```

As Options que podem ser usadas com [**ndb_drop_table**](mysql-cluster-programs-ndb-drop-table.html "21.5.12 ndb_drop_table — Drop an NDB Table") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.31 Options de linha de comando usadas com o programa ndb_drop_table**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a connection antes de desistir</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contatar o management server</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve core file em caso de erro; usado em debugging</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Nome do database no qual a table é encontrada</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê options default somente do arquivo fornecido</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do login file</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com o ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID do node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê options default de nenhum option file além do login file</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Compatível em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a connection antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contatar o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado em debugging.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--database=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Nome do database no qual a table reside.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê options default somente do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connect string para conexão com o ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID do node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê options default de nenhum option file além do login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.