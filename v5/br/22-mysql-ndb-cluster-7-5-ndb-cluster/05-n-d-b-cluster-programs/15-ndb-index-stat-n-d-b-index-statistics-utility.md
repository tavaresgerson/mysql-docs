### 21.5.15 ndb\_index\_stat — Ferramenta de estatísticas do índice NDB

**ndb\_index\_stat** fornece informações estatísticas por fragmento sobre índices em tabelas `NDB`. Isso inclui a versão e a idade do cache, o número de entradas de índice por partição e o consumo de memória pelos índices.

#### Uso

Para obter estatísticas básicas de índice sobre uma tabela específica do `NDB`, invocando **ndb\_index\_stat** conforme mostrado aqui, com o nome da tabela como o primeiro argumento e o nome do banco de dados que contém essa tabela especificando-se imediatamente após ele, usando a opção `--database` (`-d`):

```sql
ndb_index_stat table -d database
```

Neste exemplo, usamos **ndb\_index\_stat** para obter essas informações sobre uma tabela `NDB` chamada `mytable` no banco de dados `test`:

```sql
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000

NDBT_ProgramExit: 0 - OK
```

`sampleVersion` é o número da versão do cache a partir do qual os dados estatísticos são obtidos. Ao executar **ndb\_index\_stat** com a opção `--update`, o `sampleVersion` é incrementado.

`loadTime` mostra quando o cache foi atualizado pela última vez. Isso é expresso em segundos desde o Unix Epoch.

`sampleCount` é o número de entradas de índice encontradas por partição. Você pode estimar o número total de entradas multiplicando esse valor pelo número de fragmentos (mostrado como `fragCount`).

`sampleCount` pode ser comparado com a cardinalidade de `SHOW INDEX` ou `INFORMATION_SCHEMA.STATISTICS`, embora os dois últimos forneçam uma visão da tabela como um todo, enquanto **ndb\_index\_stat** fornece uma média por fragmento.

`keyBytes` é o número de bytes usados pelo índice. Neste exemplo, a chave primária é um inteiro, o que requer quatro bytes para cada índice, então `keyBytes` pode ser calculado neste caso como mostrado aqui:

```sql
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

Essa informação também pode ser obtida usando as definições correspondentes das colunas da tabela do esquema de informações `COLUMNS` (isso requer um servidor MySQL e uma aplicação cliente MySQL).

`totalBytes` é a memória total consumida por todos os índices na tabela, em bytes.

Os horários mostrados nos exemplos anteriores são específicos para cada invocação de **ndb\_index\_stat**.

A opção `--verbose` fornece alguns dados adicionais, conforme mostrado aqui:

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

Se a única saída do programa for `NDBT_ProgramExit: 0 - OK`, isso pode indicar que ainda não existem estatísticas. Para forçá-las a serem criadas (ou atualizadas se já existirem), invocando **ndb\_index\_stat** com a opção `--update`, ou execute `ANALYZE TABLE` na tabela no cliente **mysql**.

#### Opções

A tabela a seguir inclui opções específicas do utilitário NDB Cluster **ndb\_index\_stat**. Descrições adicionais estão listadas após a tabela.

**Tabela 21.34 Opções de linha de comando usadas com o programa ndb\_index\_stat**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump">--dump</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">--help</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">-?</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_login-path">--login-path=path</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_loops">--loops=#</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>Nome do banco de dados que contém a tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Exclua as estatísticas de índice da tabela, parando qualquer atualização automática configurada anteriormente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump">--dump</a> </code>]] </p></th> <td>Cache de consultas de impressão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">--help</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_loops">--loops=#</a> </code>]] </p></th> <td>Defina o número de vezes para executar o comando especificado; o padrão é 0</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">--ndb-connectstring=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump">--dump</a> </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">--help</a></code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">-?</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_login-path">--login-path=path</a> </code>] </p></th> <td>Realize consultas aleatórias de intervalo na primeira chave (deve ser um número inteiro sem sinal)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_loops">--loops=#</a> </code>] </p></th> <td>Deixe de lado quaisquer tabelas de estatísticas e eventos no kernel NDB (todas as estatísticas são perdidas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>Crie todas as tabelas de estatísticas e eventos no kernel NDB, se nenhuma delas já existir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code>] </p></th> <td>Crie quaisquer tabelas de estatísticas e eventos no kernel NDB que ainda não existam</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Crie quaisquer tabelas de estatísticas ou eventos que ainda não existam no kernel NDB, após descartar quaisquer que sejam inválidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Verifique se as estatísticas do índice do sistema NDB e as tabelas de eventos existem</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Não aplique as opções sys-* às tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump">--dump</a> </code>] </p></th> <td>Não aplique as opções sys-* aos eventos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">--help</a></code>] </p></th> <td>Atualize as estatísticas do índice da tabela, reiniciando qualquer atualização automática configurada anteriormente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">-?</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_login-path">--login-path=path</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_loops">--loops=#</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">--ndb-connectstring=connection_string</a></code>] </p></th> <td>Ative a saída detalhada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database=nome`, `-d nome`

  <table frame="box" rules="all" summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--database=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[non<code class="literal"></code></code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal"></code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>

  O nome do banco de dados que contém a tabela que está sendo consultada.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--delete`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Exclua as estatísticas do índice da tabela fornecida, parando qualquer atualização automática que foi configurada anteriormente.

- `--dump`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Descarte o conteúdo do cache de consulta.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Leia o caminho fornecido a partir do arquivo de login.

- `--loops=#`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Repita os comandos quantas vezes for necessário (para uso em testes).

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>0

  Imprima a lista de argumentos do programa e saia.

- `--query=#`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>1

  Realize consultas aleatórias de intervalo no primeiro atributo de chave (deve ser um inteiro sem sinal).

- `--sys-drop`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>2

  Deixe de lado todas as tabelas de estatísticas e eventos no kernel NDB. *Isso faz com que todas as estatísticas sejam perdidas*.

- `--sys-create`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>3

  Crie todas as tabelas de estatísticas e eventos no kernel NDB. Isso só funciona se nenhum deles existir anteriormente.

- `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>4

  Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que ainda não existam quando o programa for executado.

- `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>5

  Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que ainda não existam, após descartar quaisquer que sejam inválidas.

- `--sys-check`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>6

  Verifique se todas as tabelas de estatísticas de sistema e eventos necessários existem no kernel NDB.

- `--sys-skip-tables`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>7

  Não aplique nenhuma opção `--sys-*` em nenhuma tabela de estatísticas.

- `--sys-skip-events`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>8

  Não aplique nenhuma opção `--sys-*` a nenhum evento.

- `--update`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>9

  Atualize as estatísticas do índice para a tabela fornecida e reinicie qualquer atualização automática que foi configurada anteriormente.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>1

  Ative a saída detalhada.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>2

  Exibir informações da versão e sair.

Opções do sistema **ndb\_index\_stat**. As seguintes opções são usadas para gerar e atualizar as tabelas de estatísticas no kernel NDB. Nenhuma dessas opções pode ser combinada com opções de estatísticas (consulte opções de estatísticas ndb\_index\_stat).

- `--sys-drop`
- `--sys-create`
- `--sys-create-if-not-exist`
- `--sys-create-if-not-valid`
- `--sys-check`
- `--sys-skip-tables`
- `--sys-skip-events`

Opções de estatísticas do ndb\_index\_stat. As opções listadas aqui são usadas para gerar estatísticas de índice. Elas funcionam com uma tabela e um banco de dados específicos. Não podem ser combinadas com opções do sistema (consulte opções do sistema ndb\_index\_stat).

- `--database`
- `--delete`
- `--update`
- `--dump`
- `--query`
