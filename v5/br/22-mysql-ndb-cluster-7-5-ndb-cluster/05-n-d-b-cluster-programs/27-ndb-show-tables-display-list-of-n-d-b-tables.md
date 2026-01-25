### 21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB

[**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") exibe uma lista de todos os objetos de Database [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") no Cluster. Por padrão, isso inclui não apenas tabelas criadas pelo usuário e tabelas de sistema [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), mas também Indexes específicos do [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), triggers internos e objetos NDB Cluster Disk Data.

As opções que podem ser usadas com [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.43 Opções de linha de comando usadas com o programa ndb_show_tables**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a Connection antes de desistir</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve core file em caso de erro; usado em debugging</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code> -d name </code> </p></th> <td>Especifica o Database onde a tabela é encontrada; o nome do Database deve ser seguido pelo nome da tabela</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as opções padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do arquivo de login</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--loops=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code> </p></th> <td>Número de vezes para repetir a saída</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a string de conexão para conectar-se ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID do node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para Transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum arquivo de opção além do arquivo de login</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parsable</code>, </p><p> <code> -p </code> </p></th> <td>Retorna saída adequada para a instrução MySQL LOAD DATA</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --show-temp-status </code> </p></th> <td>Mostra a flag temporária da tabela</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--type=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_type">-t
                #</a> </code> </p></th> <td>Limita a saída a objetos deste tipo</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--unqualified</code>, </p><p> <code> -u </code> </p></th> <td>Não qualifica nomes de tabela</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

#### Uso

```sql
ndb_show_tables [-c connection_string]
```

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a Connection antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado em debugging.

* `--database`, `-d`

  Especifica o nome do Database no qual a tabela desejada é encontrada. Se esta opção for fornecida, o nome de uma tabela deve seguir o nome do Database.

  Se esta opção não tiver sido especificada e nenhuma tabela for encontrada no Database `TEST_DB`, [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") emitirá um aviso.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do arquivo de login.

* `--loops`, `-l`

  Especifica o número de vezes que o utilitário deve ser executado. É 1 quando esta opção não é especificada, mas se você usar a opção, deve fornecer um argumento inteiro para ela.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a string de conexão para conectar-se ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve as entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID do node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para Transactions. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum arquivo de opção além do arquivo de login.

* `--parsable`, `-p`

  O uso desta opção faz com que a saída esteja em um formato adequado para uso com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--show-temp-status`

  Se especificado, isso faz com que tabelas temporárias sejam exibidas.

* `--type`, `-t`

  Pode ser usado para restringir a saída a um tipo de objeto, especificado por um código de tipo inteiro, conforme mostrado aqui:

  + `1`: Tabela de sistema
  + `2`: Tabela criada pelo usuário
  + `3`: Unique hash Index

  Qualquer outro valor faz com que todos os objetos de Database [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") sejam listados (o padrão).

* `--unqualified`, `-u`

  Se especificado, isso faz com que nomes de objeto não qualificados sejam exibidos.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

Nota

Apenas tabelas NDB Cluster criadas pelo usuário podem ser acessadas pelo MySQL; tabelas de sistema, como `SYSTAB_0`, não são visíveis para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). No entanto, você pode examinar o conteúdo das tabelas de sistema usando aplicações da API [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table") (veja [Section 21.5.25, “ndb_select_all — Print Rows from an NDB Table”](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table")).

Antes do NDB 7.5.18 e 7.6.14, este programa imprimia `NDBT_ProgramExit - status` ao concluir sua execução, devido a uma dependência desnecessária da biblioteca de testes NDBT. Essa dependência foi removida, eliminando a saída estranha.