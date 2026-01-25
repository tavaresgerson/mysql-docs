### 21.5.15 ndb_index_stat — Utilitário de Estatísticas de Index NDB

[**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") fornece informações estatísticas por fragmento sobre Indexes em tabelas `NDB`. Isso inclui versão e idade do cache, número de entradas de Index por partition e consumo de memória pelos Indexes.

#### Uso

Para obter estatísticas básicas de Index sobre uma determinada tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), invoque [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") conforme mostrado aqui, com o nome da tabela como o primeiro argumento e o nome do Database contendo esta tabela especificado imediatamente após, usando a opção [`--database`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database) (`-d`):

```sql
ndb_index_stat table -d database
```

Neste exemplo, usamos [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") para obter tais informações sobre uma tabela `NDB` chamada `mytable` no Database `test`:

```sql
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000

NDBT_ProgramExit: 0 - OK
```

`sampleVersion` é o número da versão do cache a partir do qual os dados estatísticos são extraídos. Executar [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") com a opção [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update) faz com que sampleVersion seja incrementado.

`loadTime` mostra quando o cache foi atualizado pela última vez. Isso é expresso em segundos desde o Unix Epoch.

`sampleCount` é o número de entradas de Index encontradas por partition. Você pode estimar o número total de entradas multiplicando-o pelo número de fragmentos (mostrado como `fragCount`).

`sampleCount` pode ser comparado com a cardinality de [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") ou [`INFORMATION_SCHEMA.STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table"), embora estes dois últimos forneçam uma visão da tabela como um todo, enquanto [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") fornece uma média por fragmento.

`keyBytes` é o número de bytes usados pelo Index. Neste exemplo, a Primary Key é um integer, que requer quatro bytes para cada Index, portanto `keyBytes` pode ser calculado neste caso conforme mostrado aqui:

```sql
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

Esta informação também pode ser obtida usando as definições de column correspondentes da tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do Information Schema (isso requer um MySQL Server e uma aplicação client MySQL).

`totalBytes` é a memória total consumida por todos os Indexes na tabela, em bytes.

Os tempos (Timings) mostrados nos exemplos anteriores são específicos para cada invocação de [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility").

A opção [`--verbose`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_verbose) fornece alguma saída (output) adicional, conforme mostrado aqui:

```sql
$> ndb_index_stat -d test mytable --verbose
random seed 1337010518
connected
loop 1 of 1
table:mytable index:PRIMARY fragCount:4
sampleVersion:2 loadTime:1336751773 sampleCount:0 keyBytes:0
read stats
query cache created
query cache: valid:1 sampleCount:0 totalBytes:0
times in ms: save: 20.766 sort: 0.001
disconnected

NDBT_ProgramExit: 0 - OK

$>
```

Se a única saída (output) do programa for `NDBT_ProgramExit: 0 - OK`, isso pode indicar que nenhuma estatística existe ainda. Para forçar sua criação (ou atualização, se já existirem), invoque [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") com a opção [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update), ou execute [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") na tabela no client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

#### Opções

A tabela a seguir inclui opções que são específicas para o utilitário [**ndb_index_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") do NDB Cluster. Descrições adicionais são listadas após a tabela.

**Tabela 21.34 Opções de linha de comando usadas com o programa ndb_index_stat**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a conexão antes de desistir</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contatar o management server</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve arquivo core em caso de erro; usado em debugging</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code> -d name </code> </p></th> <td>Nome do Database contendo a tabela</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções default apenas do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --delete </code> </p></th> <td>Exclui estatísticas de Index para a tabela, parando qualquer auto-update configurado anteriormente</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --dump </code> </p></th> <td>Imprime o query cache</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o path fornecido a partir do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --loops=# </code> </p></th> <td>Define o número de vezes para executar o comando fornecido; default é 0</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conectar-se ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID de node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções default de nenhum arquivo de opção além do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --query=# </code> </p></th> <td>Executa random range queries no primeiro atributo Key (deve ser int unsigned)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-drop </code> </p></th> <td>Descarta quaisquer tabelas e events de estatísticas no NDB kernel (todas as estatísticas são perdidas)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-create </code> </p></th> <td>Cria todas as tabelas e events de estatísticas no NDB kernel, se nenhuma delas existir previamente</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-create-if-not-exist </code> </p></th> <td>Cria quaisquer tabelas e events de estatísticas no NDB kernel que ainda não existam</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-create-if-not-valid </code> </p></th> <td>Cria quaisquer tabelas ou events de estatísticas que não existam no NDB kernel, após descartar quaisquer que sejam inválidos</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-check </code> </p></th> <td>Verifica se as estatísticas de Index do sistema NDB e as tabelas de events existem</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-skip-tables </code> </p></th> <td>Não aplica opções sys-* a tabelas</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --sys-skip-events </code> </p></th> <td>Não aplica opções sys-* a events</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --update </code> </p></th> <td>Atualiza estatísticas de Index para a tabela, reiniciando qualquer auto-update configurado anteriormente</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Ativa a saída (output) verbose</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contatar o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve arquivo core em caso de erro; usado em debugging.

* `--database=name`, `-d name`

  <table frame="box" rules="all" summary="Propriedades para database"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--database=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr><tr><th>Valor Mínimo</th> <td><code></code></td> </tr><tr><th>Valor Máximo</th> <td><code></code></td> </tr></tbody></table>

  O nome do Database que contém a tabela sendo consultada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê opções default apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--delete`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exclui as estatísticas de Index para a tabela fornecida, parando qualquer auto-update que tenha sido configurado previamente.

* `--dump`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Despeja (Dump) o conteúdo do query cache.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o path fornecido a partir do arquivo de login.

* `--loops=#`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Repete comandos este número de vezes (para uso em testes).

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connect string para conectar-se ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID de node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções default de nenhum arquivo de opção além do arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--query=#`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Executa random range queries no primeiro atributo Key (deve ser int unsigned).

* `--sys-drop`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Descarta todas as tabelas e events de estatísticas no NDB kernel. *Isso faz com que todas as estatísticas sejam perdidas*.

* `--sys-create`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Cria todas as tabelas e events de estatísticas no NDB kernel. Isso funciona apenas se nenhuma delas existir previamente.

* `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Cria quaisquer tabelas ou events de estatísticas do sistema NDB (ou ambos) que ainda não existam quando o programa for invocado.

* `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Cria quaisquer tabelas ou events de estatísticas do sistema NDB que ainda não existam, após descartar quaisquer que sejam inválidos.

* `--sys-check`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Verifica se todas as tabelas e events de estatísticas de sistema necessárias existem no NDB kernel.

* `--sys-skip-tables`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Não aplica nenhuma opção `--sys-*` a nenhuma tabela de estatísticas.

* `--sys-skip-events`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Não aplica nenhuma opção `--sys-*` a nenhum event.

* `--update`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Atualiza as estatísticas de Index para a tabela fornecida e reinicia qualquer auto-update que tenha sido configurado previamente.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help).

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Ativa a saída (output) verbose.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

**Opções de sistema ndb_index_stat.** As seguintes opções são usadas para gerar e atualizar as tabelas de estatísticas no NDB kernel. Nenhuma destas opções pode ser misturada com opções de estatísticas (consulte [opções de estatísticas ndb_index_stat](mysql-cluster-programs-ndb-index-stat.html#ndb-index-stat-options-statistics "ndb_index_stat statistics options")).

* [`--sys-drop`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-drop)
* [`--sys-create`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create)
* [`--sys-create-if-not-exist`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-exist)
* [`--sys-create-if-not-valid`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-valid)
* [`--sys-check`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-check)
* [`--sys-skip-tables`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-tables)
* [`--sys-skip-events`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-events)

**Opções de estatísticas ndb_index_stat.** As opções listadas aqui são usadas para gerar estatísticas de Index. Elas funcionam com uma determinada tabela e Database. Não podem ser misturadas com opções de sistema (consulte [opções de sistema ndb_index_stat](mysql-cluster-programs-ndb-index-stat.html#ndb-index-stat-options-system "ndb_index_stat system options")).

* [`--database`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database)
* [`--delete`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_delete)
* [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update)
* [`--dump`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump)
* [`--query`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_query)