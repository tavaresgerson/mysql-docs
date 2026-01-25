### 21.5.16 ndb_move_data — Utilitário de Cópia de Dados NDB

[**ndb_move_data**](mysql-cluster-programs-ndb-move-data.html "21.5.16 ndb_move_data — Utilitário de Cópia de Dados NDB") copia dados de uma tabela NDB para outra.

#### Uso

O programa é invocado com os nomes das tabelas de origem (source) e destino (target); opcionalmente, uma ou ambas podem ser qualificadas com o nome do Database. Ambas as tabelas devem usar o Storage Engine NDB.

```sql
ndb_move_data options source target
```

As opções que podem ser usadas com [**ndb_move_data**](mysql-cluster-programs-ndb-move-data.html "21.5.16 ndb_move_data — Utilitário de Cópia de Dados NDB") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.35 Opções de linha de comando usadas com o programa ndb_move_data**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --abort-on-error </code> </p></th> <td>Gera um Core Dump em erro permanente (opção de debug)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório onde estão os conjuntos de caracteres (character sets)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a reconexão (retry connection) antes de desistir</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento (management server)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve o Core File em caso de erro; usado em debugging</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code> -d name </code> </p></th> <td>Nome do Database onde a tabela é encontrada</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as opções padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --drop-source </code> </p></th> <td>Descarta (Drop) a tabela source após todas as linhas terem sido movidas</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --error-insert </code> </p></th> <td>Insere erros temporários aleatórios (usado em testes)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-missing-columns </code> </p></th> <td>Ignora colunas extras na tabela source ou target</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lossy-conversions</code>, </p><p> <code> -l </code> </p></th> <td>Permite que dados de atributo sejam truncados quando convertidos para um tipo menor</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para Transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum option file além do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--promote-attributes</code>, </p><p> <code> -A </code> </p></th> <td>Permite que dados de atributo sejam convertidos para um tipo maior</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --staging-tries=x[,y[,z </code> </p></th> <td>Especifica tentativas em erros temporários; o formato é x[,y[,z onde x=máx. tentativas (0=sem limite), y=atraso mín. (ms), z=atraso máx. (ms)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --verbose </code> </p></th> <td>Habilita mensagens verbosas (verbose)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Gera um Core Dump em erro permanente (opção de debug).

* `--character-sets-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Diretório onde estão os conjuntos de caracteres (character sets).

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento (management server).

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a reconexão (retry connection) antes de desistir.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve o Core File em caso de erro; usado em debugging.

* `--database`=*`dbname`*, `-d`

  <table frame="box" rules="all" summary="Properties for database"><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Nome do Database no qual a tabela é encontrada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--drop-source`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Descarta (Drop) a tabela source após todas as linhas terem sido movidas.

* `--error-insert`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Insere erros temporários aleatórios (opção de teste).

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Ignora colunas extras na tabela source ou target.

* `--help`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do arquivo de login.

* `--lossy-conversions`, `-l`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Permite que dados de atributo sejam truncados quando convertidos para um tipo menor.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Define a connect string para conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Define o Node ID para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para Transactions. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum option file além do arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Permite que dados de atributo sejam convertidos para um tipo maior.

* `--staging-tries`=*`x[,y[,z`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Especifica tentativas em erros temporários. O formato é x[,y[,z onde x=máx. tentativas (0=sem limite), y=atraso mín. (ms), z=atraso máx. (ms).

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_help).

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Habilita mensagens verbosas (verbose).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.