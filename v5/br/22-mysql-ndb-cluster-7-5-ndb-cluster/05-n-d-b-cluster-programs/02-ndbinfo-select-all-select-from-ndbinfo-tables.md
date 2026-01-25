### 21.5.2 ndbinfo_select_all — Select de Tabelas ndbinfo

O [**ndbinfo_select_all**](mysql-cluster-programs-ndbinfo-select-all.html "21.5.2 ndbinfo_select_all — Select From ndbinfo Tables") é um programa cliente que seleciona todas as linhas e colunas de uma ou mais tabelas no Database [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

Nem todas as tabelas `ndbinfo` disponíveis no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") podem ser lidas por este programa (veja mais adiante nesta seção). Além disso, o [**ndbinfo_select_all**](mysql-cluster-programs-ndbinfo-select-all.html "21.5.2 ndbinfo_select_all — Select From ndbinfo Tables") pode exibir informações sobre algumas tabelas internas do `ndbinfo` que não podem ser acessadas usando SQL, incluindo as tabelas de metadados `tables` e `columns`.

Para fazer um select de uma ou mais tabelas `ndbinfo` usando [**ndbinfo_select_all**](mysql-cluster-programs-ndbinfo-select-all.html "21.5.2 ndbinfo_select_all — Select From ndbinfo Tables"), é necessário fornecer os nomes das tabelas ao invocar o programa, conforme mostrado aqui:

```sql
$> ndbinfo_select_all table_name1  [table_name2] [...]
```

Por exemplo:

```sql
$> ndbinfo_select_all logbuffers logspaces
== logbuffers ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       33554432        262144  0
6       0       0       0       33554432        262144  0
7       0       0       0       33554432        262144  0
8       0       0       0       33554432        262144  0
== logspaces ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       268435456       0       0
5       0       0       1       268435456       0       0
5       0       0       2       268435456       0       0
5       0       0       3       268435456       0       0
6       0       0       0       268435456       0       0
6       0       0       1       268435456       0       0
6       0       0       2       268435456       0       0
6       0       0       3       268435456       0       0
7       0       0       0       268435456       0       0
7       0       0       1       268435456       0       0
7       0       0       2       268435456       0       0
7       0       0       3       268435456       0       0
8       0       0       0       268435456       0       0
8       0       0       1       268435456       0       0
8       0       0       2       268435456       0       0
8       0       0       3       268435456       0       0
$>
```

As opções que podem ser usadas com [**ndbinfo_select_all**](mysql-cluster-programs-ndbinfo-select-all.html "21.5.2 ndbinfo_select_all — Select From ndbinfo Tables") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.23 Opções de linha de comando usadas com o programa ndbinfo_select_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Obsoleto ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a conexão antes de desistir</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o management server</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection-string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve core file em caso de erro; usado em debugging</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=db_name</code>, </p><p> <code> -d </code> </p></th> <td>Nome do Database onde a tabela está localizada</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as opções default apenas do arquivo fornecido</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --delay=# </code> </p></th> <td>Define o delay em segundos entre os loops</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do arquivo de login</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--loops=#</code>, </p><p> <code> -l </code> </p></th> <td>Define o número de vezes para realizar o select</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection-string</code>, </p><p> <code> -c </code> </p></th> <td>Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection-string</code>, </p><p> <code> -c </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID do node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê as opções default de nenhum arquivo de opções, exceto o arquivo de login</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para a seleção de nodes para transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code> -p </code> </p></th> <td>Define o grau de parallelism</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe as informações de versão e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection-string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado em debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções default apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--delay=seconds`

  <table frame="box" rules="all" summary="Propriedades para delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>MAX_INT</code></td> </tr></tbody></table>

  Esta opção define o número de segundos a esperar entre a execução dos loops. Não tem efeito se [`--loops`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_loops) estiver definido como 0 ou 1.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do arquivo de login.

* `--loops=number`, `-l number`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Esta opção define o número de vezes para executar o select. Use [`--delay`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_delay) para definir o tempo entre os loops.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve as entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID do node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para a seleção de nodes para transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê as opções default de nenhum arquivo de opções, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_help).

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Exibe as informações de versão e sai.

O [**ndbinfo_select_all**](mysql-cluster-programs-ndbinfo-select-all.html "21.5.2 ndbinfo_select_all — Select From ndbinfo Tables") não consegue ler as seguintes tabelas:

* [`arbitrator_validity_detail`](mysql-cluster-ndbinfo-arbitrator-validity-detail.html "21.6.15.1 The ndbinfo arbitrator_validity_detail Table")
* [`arbitrator_validity_summary`](mysql-cluster-ndbinfo-arbitrator-validity-summary.html "21.6.15.2 The ndbinfo arbitrator_validity_summary Table")
* [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "21.6.15.4 The ndbinfo cluster_locks Table")
* [`cluster_operations`](mysql-cluster-ndbinfo-cluster-operations.html "21.6.15.5 The ndbinfo cluster_operations Table")
* [`cluster_transactions`](mysql-cluster-ndbinfo-cluster-transactions.html "21.6.15.6 The ndbinfo cluster_transactions Table")
* [`disk_write_speed_aggregate_node`](mysql-cluster-ndbinfo-disk-write-speed-aggregate-node.html "21.6.15.19 The ndbinfo disk_write_speed_aggregate_node Table")
* [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "21.6.15.22 The ndbinfo locks_per_fragment Table")
* [`memory_per_fragment`](mysql-cluster-ndbinfo-memory-per-fragment.html "21.6.15.27 The ndbinfo memory_per_fragment Table")
* [`memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "21.6.15.26 The ndbinfo memoryusage Table")
* [`operations_per_fragment`](mysql-cluster-ndbinfo-operations-per-fragment.html "21.6.15.29 The ndbinfo operations_per_fragment Table")
* [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "21.6.15.33 The ndbinfo server_locks Table")
* [`server_operations`](mysql-cluster-ndbinfo-server-operations.html "21.6.15.34 The ndbinfo server_operations Table")
* [`server_transactions`](mysql-cluster-ndbinfo-server-transactions.html "21.6.15.35 The ndbinfo server_transactions Table")
* [`table_info`](mysql-cluster-ndbinfo-table-info.html "21.6.15.38 The ndbinfo table_info Table")